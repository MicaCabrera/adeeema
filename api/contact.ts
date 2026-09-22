// Función serverless de Vercel: POST /api/contact
//
// Recibe los datos del formulario "Vinculación Institucional" (Contact.tsx) y
// los reenvía a Web3Forms (https://web3forms.com) para que lleguen por mail.
// La access key de Web3Forms vive SOLO acá, en process.env.WEB3FORMS_KEY (sin
// el prefijo VITE_ a propósito): así nunca se expone en el bundle del
// frontend. Se configura en Vercel → Project Settings → Environment
// Variables, no en ningún archivo del repo.
import type { IncomingMessage, ServerResponse } from "node:http";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

interface ContactPayload {
  name: string;
  email: string;
  message: string;
  reason: string;
}

// En Vercel, request.body ya llega parseado (según el Content-Type) gracias
// al runtime de Node — ver docs.vercel.com/docs/functions/runtimes/node-js.
// En `vite dev` no hay ese parseo automático (lo simula vite.config.ts
// llamando a este mismo handler a mano), así que si no viene ya parseado
// leemos el stream nosotros. Misma función sirve para los dos casos.
async function readJsonBody(req: IncomingMessage & { body?: unknown }): Promise<unknown> {
  if (req.body !== undefined) return req.body;

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(chunk as Buffer);
  }
  const raw = Buffer.concat(chunks).toString("utf-8");
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Campos requeridos: nombre, email y mensaje. "reason" (motivo de consulta)
// es opcional. Cualquier otro campo que llegue en el body se ignora.
function readPayload(body: unknown): ContactPayload | null {
  if (!body || typeof body !== "object") return null;
  const data = body as Record<string, unknown>;

  const name = typeof data.name === "string" ? data.name.trim() : "";
  const email = typeof data.email === "string" ? data.email.trim() : "";
  const message = typeof data.message === "string" ? data.message.trim() : "";
  const reason = typeof data.reason === "string" ? data.reason.trim() : "";

  if (!name || !email || !message) return null;
  return { name, email, message, reason };
}

function sendJson(res: ServerResponse, statusCode: number, body: { success: boolean; message?: string }): void {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

export default async function handler(
  req: IncomingMessage & { body?: unknown },
  res: ServerResponse,
): Promise<void> {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    sendJson(res, 405, { success: false, message: "Método no permitido." });
    return;
  }

  const payload = readPayload(await readJsonBody(req));
  if (!payload) {
    sendJson(res, 400, { success: false, message: "Completá nombre, email y mensaje antes de enviar." });
    return;
  }

  const accessKey = process.env.WEB3FORMS_KEY;
  if (!accessKey) {
    // Falta configurar WEB3FORMS_KEY en las env vars de Vercel. No se expone
    // el detalle al cliente, solo se deja registrado en los logs de la función.
    console.error("[api/contact] falta la variable de entorno WEB3FORMS_KEY");
    sendJson(res, 500, { success: false, message: "El formulario no está disponible en este momento." });
    return;
  }

  // Web3Forms rechaza (403, "not allowed... use client side") los pedidos
  // que no parecen venir de un navegador real — un fetch de servidor sin
  // estos headers cae ahí siempre, sin importar la IP. Se arman a partir
  // del propio request que llegó a esta función (mismo origen que el sitio).
  const origin =
    (Array.isArray(req.headers.origin) ? req.headers.origin[0] : req.headers.origin) ||
    (req.headers.host ? `https://${req.headers.host}` : "https://adeeema-ii.vercel.app");

  try {
    const upstream = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Origin: origin,
        Referer: `${origin}/`,
      },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `Vinculación Institucional — ${payload.name}`,
        from_name: payload.name,
        name: payload.name,
        email: payload.email,
        motivo: payload.reason,
        mensaje: payload.message,
      }),
    });

    const result = await upstream.json().catch(() => null);
    if (!upstream.ok || !result?.success) {
      console.error("[api/contact] Web3Forms respondió con error", upstream.status, result);
      sendJson(res, 502, { success: false, message: "No pudimos enviar tu mensaje. Probá de nuevo en unos segundos." });
      return;
    }

    sendJson(res, 200, { success: true });
  } catch (err) {
    console.error("[api/contact] error llamando a Web3Forms", err);
    sendJson(res, 502, { success: false, message: "No pudimos enviar tu mensaje. Probá de nuevo en unos segundos." });
  }
}

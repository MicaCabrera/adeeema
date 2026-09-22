// Función serverless de Vercel: POST /api/contact
//
// Recibe los datos del formulario "Vinculación Institucional" (Contact.tsx) y
// los manda por mail vía Resend (https://resend.com) a CONTACT_TO_EMAIL.
// La API key de Resend vive SOLO acá, en process.env.RESEND_API_KEY (sin
// prefijo VITE_ a propósito): así nunca se expone en el bundle del frontend.
// Se configura en Vercel → Project Settings → Environment Variables.
//
// (Antes se usaba Web3Forms, pero está detrás de Cloudflare y bloquea con un
// challenge JS cualquier pedido que no venga de un navegador real — no hay
// forma de resolver eso desde un servidor. Resend sí soporta uso server-side.)
import type { IncomingMessage, ServerResponse } from "node:http";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

// Mientras no se verifique un dominio propio en Resend (Dashboard → Domains,
// agregando registros DNS), el remitente tiene que ser sí o sí
// onboarding@resend.dev, y ESE remitente solo entrega al mail con el que se
// creó la cuenta de Resend. Por eso CONTACT_TO_EMAIL tiene que ser ese mismo
// mail hasta que se verifique un dominio propio.
const FROM_ADDRESS = "ADEEMA — Sitio web <onboarding@resend.dev>";
const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "mcabrera@adeema.org";

interface ContactPayload {
  name: string;
  email: string;
  message: string;
  reason: string;
}

// En Vercel, request.body ya llega parseado (según el Content-Type) gracias
// al runtime de Node. En `vite dev` no hay ese parseo automático (lo simula
// vite.config.ts llamando a este mismo handler a mano), así que si no viene
// ya parseado leemos el stream nosotros. Misma función sirve para los dos casos.
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

function escapeHtml(value: string): string {
  const map: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return value.replace(/[&<>"']/g, (c) => map[c]);
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

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Falta configurar RESEND_API_KEY en las env vars de Vercel. No se
    // expone el detalle al cliente, solo queda en los logs de la función.
    console.error("[api/contact] falta la variable de entorno RESEND_API_KEY");
    sendJson(res, 500, { success: false, message: "El formulario no está disponible en este momento." });
    return;
  }

  try {
    const upstream = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [TO_EMAIL],
        reply_to: payload.email,
        subject: `Vinculación Institucional — ${payload.name}`,
        text: [
          `Nombre: ${payload.name}`,
          `Email: ${payload.email}`,
          payload.reason ? `Motivo: ${payload.reason}` : null,
          "",
          "Mensaje:",
          payload.message,
        ]
          .filter((line): line is string => line !== null)
          .join("\n"),
        html: `
          <p><strong>Nombre:</strong> ${escapeHtml(payload.name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
          ${payload.reason ? `<p><strong>Motivo:</strong> ${escapeHtml(payload.reason)}</p>` : ""}
          <p><strong>Mensaje:</strong></p>
          <p>${escapeHtml(payload.message).replace(/\n/g, "<br>")}</p>
        `,
      }),
    });

    const result = await upstream.json().catch(() => null);
    if (!upstream.ok) {
      console.error("[api/contact] Resend respondió con error", upstream.status, result);
      sendJson(res, 502, { success: false, message: "No pudimos enviar tu mensaje. Probá de nuevo en unos segundos." });
      return;
    }

    sendJson(res, 200, { success: true });
  } catch (err) {
    console.error("[api/contact] error llamando a Resend", err);
    sendJson(res, 502, { success: false, message: "No pudimos enviar tu mensaje. Probá de nuevo en unos segundos." });
  }
}

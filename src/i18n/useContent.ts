import { useMemo } from "react";
import * as es from "../data/content";
import * as en from "../data/content.en";
import { ui, type UiDict } from "./ui";
import { useLanguage } from "./language";

type Content = typeof es;

// Si falta un export completo en content.en.ts, esta asignación no compila.
const esContent: Content = { ...es };
const enContent: Content = { ...en };

// Red de seguridad en runtime: un campo ausente o vacío en inglés cae al
// español, nunca queda vacío ni "undefined". (TypeScript ya avisa si falta
// un campo; esto cubre datos que lleguen incompletos igual.)
function withFallback<T>(base: T, over: unknown): T {
  if (over === undefined || over === null || over === "") return base;
  if (Array.isArray(base)) {
    if (!Array.isArray(over)) return base;
    const length = Math.max(base.length, over.length);
    return Array.from({ length }, (_, i) =>
      base[i] === undefined ? over[i] : withFallback(base[i], over[i])
    ) as unknown as T;
  }
  if (typeof base === "object" && base !== null) {
    if (typeof over !== "object") return base;
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(base)) {
      out[key] = withFallback((base as Record<string, unknown>)[key], (over as Record<string, unknown>)[key]);
    }
    return out as T;
  }
  return typeof over === typeof base ? (over as T) : base;
}

const enMerged: Content = withFallback(esContent, enContent);
const uiEnMerged: UiDict = withFallback(ui.es, ui.en);

/** Contenido del idioma activo, con la misma forma que data/content.ts. */
export function useContent(): Content {
  const { lang } = useLanguage();
  return useMemo(() => (lang === "en" ? enMerged : esContent), [lang]);
}

/** Textos de interfaz sueltos (aria-labels, botones, News) del idioma activo. */
export function useUi(): UiDict {
  const { lang } = useLanguage();
  return useMemo(() => (lang === "en" ? uiEnMerged : ui.es), [lang]);
}

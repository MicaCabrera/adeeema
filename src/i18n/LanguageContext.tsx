import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { LanguageContext, type Lang } from "./language";

const STORAGE_KEY = "adeema-lang";

// Sin valor guardado (o si localStorage no está disponible) el idioma es
// español: a propósito no se detecta el idioma del navegador.
function readStoredLang(): Lang {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "es";
  } catch {
    return "es";
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readStoredLang);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Modo privado / storage bloqueado: el idioma sigue funcionando en
      // memoria durante la sesión, solo que no se recuerda al recargar.
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang }), [lang, setLang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

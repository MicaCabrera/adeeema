import { createContext, useContext } from "react";

export type Lang = "es" | "en";

export interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export const LanguageContext = createContext<LanguageContextValue>({
  lang: "es",
  setLang: () => {},
});

export function useLanguage() {
  return useContext(LanguageContext);
}

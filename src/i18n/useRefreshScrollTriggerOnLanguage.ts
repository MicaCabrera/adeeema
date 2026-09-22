import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Lang } from "./language";

gsap.registerPlugin(ScrollTrigger);

// Cambiar de idioma cambia el largo de los textos y con eso la altura de las
// secciones. Después de que React renderiza el nuevo idioma se recalculan los
// triggers (pin de MissionVision, cortina del Hero) para que no queden
// desfasados. Solo actúa cuando el idioma realmente cambia: no en el montaje
// inicial ni en el doble efecto de StrictMode. No toca la lógica de ningún
// trigger, solo llama al refresh.
export function useRefreshScrollTriggerOnLanguage(lang: Lang) {
  const previous = useRef(lang);

  useEffect(() => {
    if (previous.current === lang) return undefined;
    previous.current = lang;

    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [lang]);
}

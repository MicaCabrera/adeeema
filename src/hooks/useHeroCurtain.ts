import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Interruptores: ENABLE_CURTAIN corta todo el hook. Los otros dos activan
// o desactivan cada extra por separado sin tocar el resto.
const ENABLE_CURTAIN = true;
const ENABLE_DEPTH_SHADOW = true;
const ENABLE_HERO_DIM = false;

/**
 * Efecto cortina entre #inicio (Hero) y #institucional (Quiénes somos):
 * el Hero queda pineado (pin sin pinSpacing) y la sección siguiente sube y
 * lo tapa en su posición natural del documento. No usa Observer, no
 * intercepta wheel/touch, no agrega overflow:hidden nuevo: el scroll sigue
 * siendo 100% nativo, ScrollTrigger solo lee la posición de scroll.
 */
export function useHeroCurtain() {
  useEffect(() => {
    if (!ENABLE_CURTAIN) return;

    let ctx: gsap.Context | undefined;

    try {
      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();

        mm.add("(prefers-reduced-motion: no-preference)", () => {
          try {
            // Hero: <section id="inicio"> (Hero.tsx).
            const heroEl = document.querySelector<HTMLElement>("#inicio");
            // Quiénes somos: <section id="institucional"> (Institutional.tsx).
            const institutionalEl = document.querySelector<HTMLElement>("#institucional");

            if (!heroEl || !institutionalEl) {
              // Si falta alguno, no se crea pin ni estilos: la página queda
              // igual que antes. En dev se avisa por qué.
              if (import.meta.env.DEV) {
                console.warn(
                  `[useHeroCurtain] no se encontró ${!heroEl ? "#inicio" : ""}${
                    !heroEl && !institutionalEl ? " ni " : ""
                  }${!institutionalEl ? "#institucional" : ""}: se aborta el efecto`
                );
              }
              return undefined;
            }

            // Institutional ya es "relative"; solo se sube su z-index para
            // que quede por encima del Hero pineado. Se guarda el valor
            // previo para restaurarlo en el cleanup.
            const prevPosition = institutionalEl.style.position;
            const prevZIndex = institutionalEl.style.zIndex;
            const prevBoxShadow = institutionalEl.style.boxShadow;

            institutionalEl.style.position = "relative";
            institutionalEl.style.zIndex = "10";
            if (ENABLE_DEPTH_SHADOW) {
              institutionalEl.style.boxShadow = "0 -40px 80px rgba(0,0,0,0.35)";
            }

            // Mismo cálculo de inicio/fin para el pin y (si está prendido)
            // el dim del Hero, para que ambos efectos queden sincronizados.
            const resolveStart = () =>
              heroEl.offsetHeight > window.innerHeight ? "bottom bottom" : "top top";
            const resolveEnd = () => "+=" + heroEl.offsetHeight;

            const pinTrigger = ScrollTrigger.create({
              trigger: heroEl,
              pin: true,
              pinSpacing: false, // clave: no reserva espacio, Institutional sube y tapa al Hero
              anticipatePin: 1,
              refreshPriority: 1, // MissionVision ya creó su trigger (efectos de hijos corren antes)
              invalidateOnRefresh: true,
              start: resolveStart,
              end: resolveEnd,
            });

            let overlay: HTMLDivElement | null = null;
            let dimTween: gsap.core.Tween | null = null;

            if (ENABLE_HERO_DIM) {
              overlay = document.createElement("div");
              overlay.setAttribute("aria-hidden", "true");
              overlay.style.position = "absolute";
              overlay.style.inset = "0";
              overlay.style.pointerEvents = "none";
              overlay.style.zIndex = "1";
              overlay.style.opacity = "0";
              overlay.className = "bg-ink";
              heroEl.appendChild(overlay);

              dimTween = gsap.to(overlay, {
                opacity: 0.6,
                ease: "none",
                scrollTrigger: {
                  trigger: heroEl,
                  start: resolveStart,
                  end: resolveEnd,
                  scrub: true,
                },
              });
            }

            return () => {
              pinTrigger.kill();
              dimTween?.scrollTrigger?.kill();
              dimTween?.kill();
              overlay?.remove();
              institutionalEl.style.position = prevPosition;
              institutionalEl.style.zIndex = prevZIndex;
              institutionalEl.style.boxShadow = prevBoxShadow;
            };
          } catch (err) {
            if (import.meta.env.DEV) {
              console.warn("[useHeroCurtain] error creando el efecto, se aborta", err);
            }
            return undefined;
          }
        });
      });
    } catch (err) {
      if (import.meta.env.DEV) {
        console.warn("[useHeroCurtain] error en gsap.context(), se aborta", err);
      }
      ctx = undefined;
    }

    return () => {
      ctx?.revert();
    };
  }, []);
}

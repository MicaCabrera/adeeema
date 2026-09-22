import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Ids estables de los paneles "Misión" y "Visión" en la versión apilada
// mobile de MissionVision.tsx (StackedMissionVision). Se exportan para que
// ese componente les ponga el id correspondiente a cada ConceptCard sin
// duplicar los strings acá y allá.
export const MISION_PANEL_ID = "mv-mision-panel";
export const VISION_PANEL_ID = "mv-vision-panel";

// Interruptores en el mismo espíritu que useHeroCurtain.
const ENABLE_CURTAIN = true;
const ENABLE_DEPTH_SHADOW = true;

// Mismo corte que ya usa MissionVision.tsx para elegir entre
// PinnedMissionVision (scrub+pin, desktop) y StackedMissionVision (flujo
// normal, mobile/tablet): "(min-width: 1024px)" / su complemento acá.
const MOBILE_QUERY = "(max-width: 1023.98px)";

/**
 * Efecto cortina entre los paneles "Misión" y "Visión" de la versión mobile
 * apilada de Misión y Visión (StackedMissionVision, <1024px): reutiliza
 * exactamente la misma técnica que useHeroCurtain.ts entre #inicio y
 * #institucional — el panel "Misión" queda pineado (pin sin pinSpacing) y
 * "Visión" sube en su posición natural del documento y lo tapa, con la misma
 * sombra de profundidad (scrub 0.6, ease "none"). No usa Observer ni
 * intercepta wheel/touch: el scroll/swipe sigue siendo 100% nativo (vertical,
 * como ya lo es esta sección apilada), ScrollTrigger solo lee la posición de
 * scroll, así que el scroll general de la página no se bloquea y el efecto
 * corre igual de adelante hacia atrás (Misión→Visión) que de atrás hacia
 * adelante (Visión→Misión, al scrollear hacia arriba).
 *
 * En >=1024px (desktop) esta condición nunca matchea: PinnedMissionVision
 * sigue exactamente igual que antes, y useHeroCurtain (Hero→Institucional)
 * tampoco se toca.
 */
export function useMissionVisionCurtain() {
  useEffect(() => {
    if (!ENABLE_CURTAIN) return;

    let ctx: gsap.Context | undefined;

    try {
      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();

        mm.add(
          { isMobile: MOBILE_QUERY, reduceMotion: "(prefers-reduced-motion: no-preference)" },
          (context) => {
            const conditions = context.conditions as
              | { isMobile: boolean; reduceMotion: boolean }
              | undefined;
            if (!conditions?.isMobile || !conditions?.reduceMotion) return undefined;

            try {
              const misionEl = document.querySelector<HTMLElement>(`#${MISION_PANEL_ID}`);
              const visionEl = document.querySelector<HTMLElement>(`#${VISION_PANEL_ID}`);

              if (!misionEl || !visionEl) {
                if (import.meta.env.DEV) {
                  console.warn(
                    `[useMissionVisionCurtain] no se encontró ${!misionEl ? `#${MISION_PANEL_ID}` : ""}${
                      !misionEl && !visionEl ? " ni " : ""
                    }${!visionEl ? `#${VISION_PANEL_ID}` : ""}: se aborta el efecto`
                  );
                }
                return undefined;
              }

              // "Visión" ya es "relative" (ConceptCard); solo se sube su
              // z-index para que quede por encima de "Misión" pineado. Se
              // guarda el valor previo para restaurarlo en el cleanup.
              const prevPosition = visionEl.style.position;
              const prevZIndex = visionEl.style.zIndex;
              const prevBoxShadow = visionEl.style.boxShadow;

              visionEl.style.position = "relative";
              visionEl.style.zIndex = "10";
              if (ENABLE_DEPTH_SHADOW) {
                // Arranca sin sombra; se anima con el scroll (ver
                // shadowTween más abajo) en vez de aparecer ya a máxima
                // intensidad.
                visionEl.style.boxShadow = "0 -40px 80px rgba(0,0,0,0)";
              }

              // Mismo cálculo de inicio/fin para el pin y la sombra, para
              // que queden sincronizados.
              const resolveStart = () =>
                misionEl.offsetHeight > window.innerHeight ? "bottom bottom" : "top top";
              const resolveEnd = () => "+=" + misionEl.offsetHeight;

              const pinTrigger = ScrollTrigger.create({
                trigger: misionEl,
                pin: true,
                pinSpacing: false, // clave: no reserva espacio, Visión sube y tapa a Misión
                anticipatePin: 1,
                invalidateOnRefresh: true,
                start: resolveStart,
                end: resolveEnd,
              });

              let shadowTween: gsap.core.Tween | null = null;
              if (ENABLE_DEPTH_SHADOW) {
                // scrub 0.6 (en vez de ligarla 1:1 al pin) le da un pequeño
                // retraso/ease a la sombra para que la cortina se sienta más
                // suave, no un corte seco apenas arranca el pin.
                shadowTween = gsap.to(visionEl, {
                  boxShadow: "0 -40px 80px rgba(0,0,0,0.35)",
                  ease: "none",
                  scrollTrigger: {
                    trigger: misionEl,
                    start: resolveStart,
                    end: resolveEnd,
                    scrub: 0.6,
                  },
                });
              }

              return () => {
                pinTrigger.kill();
                shadowTween?.scrollTrigger?.kill();
                shadowTween?.kill();
                visionEl.style.position = prevPosition;
                visionEl.style.zIndex = prevZIndex;
                visionEl.style.boxShadow = prevBoxShadow;
              };
            } catch (err) {
              if (import.meta.env.DEV) {
                console.warn("[useMissionVisionCurtain] error creando el efecto, se aborta", err);
              }
              return undefined;
            }
          }
        );
      });
    } catch (err) {
      if (import.meta.env.DEV) {
        console.warn("[useMissionVisionCurtain] error en gsap.context(), se aborta", err);
      }
      ctx = undefined;
    }

    return () => {
      ctx?.revert();
    };
  }, []);
}

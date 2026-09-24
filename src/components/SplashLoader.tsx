import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DotLoader } from "@/components/ui/dot-loader";
import { cn } from "@/lib/utils";
import { site } from "@/data/content";

// Frames a nivel de módulo: una referencia estable evita que el DotLoader
// reinicie la animación en cada render.
const frames = [
  [14, 7, 0, 8, 6, 13, 20],
  [14, 7, 13, 20, 16, 27, 21],
  [14, 20, 27, 21, 34, 24, 28],
  [27, 21, 34, 28, 41, 32, 35],
  [34, 28, 41, 35, 48, 40, 42],
  [34, 28, 41, 35, 48, 42, 46],
  [34, 28, 41, 35, 48, 42, 38],
  [34, 28, 41, 35, 48, 30, 21],
  [34, 28, 41, 48, 21, 22, 14],
  [34, 28, 41, 21, 14, 16, 27],
  [34, 28, 21, 14, 10, 20, 27],
  [28, 21, 14, 4, 13, 20, 27],
  [28, 21, 14, 12, 6, 13, 20],
  [28, 21, 14, 6, 13, 20, 11],
  [28, 21, 14, 6, 13, 20, 10],
  [14, 6, 13, 20, 9, 7, 21],
];

const MIN_VISIBLE_MS = 4500;
const MIN_VISIBLE_REDUCED_MS = 3600;
const MAX_VISIBLE_MS = 8000; // tope de seguridad: si algo tarda, el splash se va igual
const FADE_OUT_MS = 500;
const TAGLINE_DELAY_MS = 300;

type Phase = "visible" | "leaving" | "done";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Pantalla de carga que tapa el sitio en la primera carga. Se monta una sola
 * vez en App (fuera de <Routes>), así que navegar entre secciones o rutas no
 * la vuelve a mostrar. Se oculta cuando la página terminó de cargar Y pasó el
 * tiempo mínimo, o al llegar al tope de seguridad, lo que ocurra primero.
 */
export default function SplashLoader() {
  const [phase, setPhase] = useState<Phase>("visible");
  const [reducedMotion] = useState(prefersReducedMotion);
  // Con reduced motion la bajada aparece de entrada, sin fade-in diferido.
  const [showTagline, setShowTagline] = useState(reducedMotion);

  useEffect(() => {
    if (showTagline) return;
    const t = setTimeout(() => setShowTagline(true), TAGLINE_DELAY_MS);
    return () => clearTimeout(t);
  }, [showTagline]);

  useEffect(() => {
    let loaded = document.readyState === "complete";
    let minElapsed = false;

    const hide = () => setPhase((p) => (p === "visible" ? "leaving" : p));
    const tryHide = () => {
      if (loaded && minElapsed) hide();
    };
    const onLoad = () => {
      loaded = true;
      tryHide();
    };

    const minTimer = setTimeout(
      () => {
        minElapsed = true;
        tryHide();
      },
      reducedMotion ? MIN_VISIBLE_REDUCED_MS : MIN_VISIBLE_MS
    );
    const maxTimer = setTimeout(hide, MAX_VISIBLE_MS);
    if (!loaded) window.addEventListener("load", onLoad);

    return () => {
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
      window.removeEventListener("load", onLoad);
    };
  }, [reducedMotion]);

  // Fade-out y recién después desmontar.
  useEffect(() => {
    if (phase !== "leaving") return;
    const t = setTimeout(() => setPhase("done"), FADE_OUT_MS);
    return () => clearTimeout(t);
  }, [phase]);

  // Bloquea el scroll mientras el splash está en pantalla. Se hace sobre
  // <html> y no sobre <body> porque el Navbar escribe body.style.overflow al
  // montarse (para su menú mobile) y pisaría el bloqueo.
  const locked = phase !== "done";
  useEffect(() => {
    if (!locked) return;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prevOverflow;
      // Con overflow:hidden desaparece la scrollbar y cambia el ancho útil,
      // así que las posiciones que calcularon las cortinas de GSAP pueden
      // quedar corridas: se recalculan al liberar el scroll.
      ScrollTrigger.refresh();
    };
  }, [locked]);

  if (phase === "done") return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Cargando ADEEMA"
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center bg-accent-deep transition-opacity ease-out",
        phase === "leaving" && "pointer-events-none opacity-0"
      )}
      style={{ transitionDuration: `${FADE_OUT_MS}ms` }}
    >
      <div
        className="flex flex-col items-center gap-3 px-4 text-center md:flex-row md:gap-5 md:px-0 md:text-left"
        aria-hidden="true"
      >
        <DotLoader
          frames={frames}
          isPlaying={!reducedMotion}
          duration={100}
          className="md:gap-[3px]"
          dotClassName={cn(
            "size-1.5 md:size-2",
            // Sin animación, la grilla queda un poco más visible como marca estática.
            reducedMotion ? "bg-white/40" : "bg-white/15 [&.active]:bg-white"
          )}
        />
        {/* Mobile: un bloque alineado a la izquierda, con la fila [emblema +
            ADEEMA] y la bajada debajo, arrancando en el borde del emblema; el
            bloque entero queda centrado bajo el spinner. Desktop: grilla con
            el emblema ocupando las dos filas a la izquierda del texto (la fila
            de mobile pasa a display:contents para que sus hijos entren en la
            grilla). */}
        <div className="flex flex-col items-start text-left md:grid md:grid-cols-[auto_auto] md:items-center md:justify-items-start md:gap-x-3">
          <div className="flex items-center gap-2 md:contents">
            {/* Mismo archivo que usan Navbar y Footer; es negro, así que se
                pasa a blanco con el mismo filtro que ellos. El PNG tiene un
                margen transparente de 36/256 de su ancho: en mobile se
                compensa (-2.7px a h-6) para que la figura quede alineada con
                la bajada. */}
            <img
              src={site.logo}
              alt="ADEEMA"
              width={256}
              height={320}
              decoding="async"
              className="-ml-[2.7px] h-6 w-auto object-contain brightness-0 invert md:row-span-2 md:ml-0 md:h-14"
            />
            <span className="font-display text-base font-semibold tracking-widest text-white md:col-start-2 md:text-xl">
              ADEEMA
            </span>
          </div>
          <span
            className={cn(
              "mt-1.5 whitespace-nowrap md:col-start-2 text-[11px] leading-snug font-normal tracking-wide text-white/60 transition-opacity duration-500 ease-out md:text-sm md:leading-5",
              showTagline ? "opacity-100" : "opacity-0"
            )}
          >
            {/* Corte fijo en mobile (en vez de max-w): así la caja mide lo
                mismo que el texto y el bloque queda centrado al píxel. */}
            Asociación de Deportes Electrónicos <br className="md:hidden" />y Electromecánicos Argentina
          </span>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { mission, vision } from "../data/content";
import { useContent } from "../i18n/useContent";

gsap.registerPlugin(ScrollTrigger);

// Misión → Visión: mismo orden y mismos campos que usaba el bloque anterior
// (eyebrow/label/title/paragraph/tags/image), solo cambia el patrón visual.
// Este "concepts" estático solo aporta la cantidad de pasos para el pin
// (no depende del idioma); lo que se renderiza sale de useConcepts().
const concepts = [mission, vision];

function useConcepts() {
  const content = useContent();
  return useMemo(() => [content.mission, content.vision], [content]);
}

const SCROLL_PER_STEP = 900; // px de scroll "virtual" que consume cada concepto durante el pin

function ConceptCard({ data }: { data: (typeof concepts)[number] }) {
  return (
    <div className="relative flex min-h-[100svh] items-start overflow-hidden">
      <img src={data.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/90 from-0% via-ink/60 via-55% to-ink/10 to-90%" />

      <div className="relative w-full px-6 pt-32 md:px-10 md:pt-36">
        <div className="mx-auto max-w-[1600px]">
          <div className="flex flex-col gap-6">
            <h2 className="display-font text-6xl font-bold uppercase leading-none text-white md:text-8xl">
              {data.label}
            </h2>
            <div className="flex flex-col gap-4">
              <p className="text-lg font-medium leading-snug text-white md:text-xl">{data.title}</p>
              <p className="max-w-md text-[15.4px] leading-relaxed text-white/60">{data.paragraph}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Versión desktop: pin + scrub. La sección queda fija mientras el scroll
// avanza un concepto a la vez. El título activo se "rellena" de gris a
// blanco de izquierda a derecha (clip-path) según el progreso dentro de ese
// paso; al pasar al siguiente concepto, el título anterior sube y queda
// apilado, chico y atenuado, arriba de la línea divisoria.
function PinnedMissionVision() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const fillRef = useRef<HTMLSpanElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${concepts.length * SCROLL_PER_STEP}`,
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          const raw = self.progress * concepts.length;
          const idx = Math.min(concepts.length - 1, Math.floor(raw));
          const localProgress = Math.min(1, raw - idx);

          if (idx !== activeIndexRef.current) {
            activeIndexRef.current = idx;
            setActiveIndex(idx);
          }

          if (fillRef.current) {
            // Top/bottom negativos: con leading-none, tildes y acentos
            // (Ó) sobresalen un poco de la caja de línea — si el clip
            // arranca justo en el borde (0), los corta. Se agranda el
            // área de clip verticalmente para que nunca los toque.
            fillRef.current.style.clipPath = `inset(-0.3em ${(1 - localProgress) * 100}% -0.1em 0)`;
          }
          if (progressRef.current) {
            progressRef.current.style.width = `${self.progress * 100}%`;
          }
        },
      });

      return () => {
        st.kill();
      };
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const refreshTimeout = setTimeout(refresh, 600);

    return () => {
      mm.kill();
      window.removeEventListener("load", refresh);
      clearTimeout(refreshTimeout);
    };
  }, []);

  const translated = useConcepts();
  const current = translated[activeIndex];
  const past = translated.slice(0, activeIndex);

  return (
    <section ref={sectionRef} className="relative hidden h-screen overflow-hidden bg-ink lg:flex">
      {/* Mitad izquierda: contenido sobre fondo sólido */}
      <div className="relative z-10 flex h-full w-1/2 flex-col justify-end bg-accent px-6 pb-16 md:px-10 md:pb-20">
        <div className="w-full max-w-xl">
          {/* Títulos ya vistos, apilados arriba, chicos y atenuados */}
          <div className="mb-3 flex min-h-[1px] flex-col gap-1">
            <AnimatePresence initial={false}>
              {past.map((c) => (
                <motion.span
                  key={c.image}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="display-font text-2xl font-bold uppercase leading-none text-white/25 md:text-4xl"
                >
                  {c.label}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>

          <div className="pt-6 md:pt-8">
            <div className="flex flex-col gap-6">
              <h2 className="display-font relative w-max text-6xl font-bold uppercase leading-none md:text-8xl">
                <span className="text-white/25" aria-hidden="true">
                  {current.label}
                </span>
                <span
                  ref={fillRef}
                  className="absolute inset-0 w-max text-white"
                  style={{ clipPath: "inset(-0.3em 100% -0.1em 0)" }}
                >
                  {current.label}
                </span>
              </h2>

              <div className="flex flex-col gap-4">
                <p className="text-lg font-medium leading-snug text-white md:text-xl">{current.title}</p>
                <p className="max-w-md text-[15.4px] leading-relaxed text-white/60">{current.paragraph}</p>
              </div>
            </div>

            {/* Barra de progreso general de toda la sección */}
            <div className="mt-10 h-px w-full bg-white/15">
              <div ref={progressRef} className="h-full bg-ink" style={{ width: "0%" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Mitad derecha: imagen */}
      <div className="relative h-full w-1/2 overflow-hidden">
        {translated.map((c, i) => (
          <img
            key={c.image}
            src={c.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out"
            style={{ opacity: activeIndex === i ? 1 : 0 }}
          />
        ))}
      </div>
    </section>
  );
}

// Mobile/tablet (<1024px): sin pin (evita el scroll-hijack en pantallas
// chicas). Los conceptos quedan apilados en flujo normal, cada uno con su
// propia imagen de fondo — mismo contenido, sin el efecto de relleno ni la
// acumulación de títulos.
function StackedMissionVision() {
  const translated = useConcepts();

  return (
    <div className="lg:hidden">
      {translated.map((c) => (
        <ConceptCard key={c.image} data={c} />
      ))}
    </div>
  );
}

export default function MissionVision() {
  return (
    <section id="mision-vision" className="relative bg-ink">
      <PinnedMissionVision />
      <StackedMissionVision />
    </section>
  );
}

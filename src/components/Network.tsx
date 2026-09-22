import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Eyebrow from "./ui/Eyebrow";
import Reveal from "./ui/Reveal";
import Cursor from "./ui/inverted-cursor";
import { useContent, useUi } from "../i18n/useContent";

export default function Network() {
  const { network, site } = useContent();
  const ui = useUi();
  const [active, setActive] = useState(0);
  const [inside, setInside] = useState(false);
  const [fine, setFine] = useState(false);
  const rowRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    setFine(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  // En mobile/tablet táctil no hay hover: la fila se activa sola cuando
  // scrollea cerca del centro de la pantalla, imitando el mismo highlight
  // que en desktop dispara el mouse.
  useEffect(() => {
    if (fine) return undefined;

    const rows = rowRefs.current.filter((el): el is HTMLButtonElement => el !== null);
    if (rows.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;

        const best = visible.reduce((max, entry) => (entry.intersectionRatio > max.intersectionRatio ? entry : max));
        const index = rowRefs.current.indexOf(best.target as HTMLButtonElement);
        if (index !== -1) setActive(index);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    for (const row of rows) observer.observe(row);
    return () => observer.disconnect();
  }, [fine, network.items.length]);

  return (
    <section id="red-articulacion" className="relative bg-paper px-6 pb-12 pt-28 text-ink md:px-10 md:pb-16 md:pt-32">
      <div className="mx-auto max-w-[1600px]">
        <Reveal>
          <Eyebrow label={network.eyebrow} className="mb-4 max-w-md" />
        </Reveal>

        <Reveal className="mb-16 md:mb-20">
          <h2 className="display-font text-[13vw] font-bold uppercase leading-[0.9] text-ink md:text-[5.5vw]">
            {network.headingParts[0]} <span className="text-secondary">{network.headingParts[1]}</span>
          </h2>
        </Reveal>

        <div
          className={`relative ${fine ? "cursor-none [&_*]:cursor-none" : ""}`}
          onMouseEnter={() => setInside(true)}
          onMouseLeave={() => setInside(false)}
        >
          {fine && inside && <Cursor size={44} />}
          {network.items.map((item, i) => {
            const isActive = active === i;
            const highlighted = isActive;

            return (
              <Reveal key={item.index} y={16} delay={i * 0.04}>
                <button
                  type="button"
                  ref={(el) => {
                    rowRefs.current[i] = el;
                  }}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className={`relative flex w-full flex-col text-left sm:flex-row sm:items-stretch ${
                    i === 0 ? "border-t border-ink/10" : ""
                  } border-b border-ink/10`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="network-hover-highlight"
                      className="absolute inset-0 z-0 bg-accent will-change-transform"
                      initial={false}
                      animate={{ opacity: highlighted ? 1 : 0 }}
                      transition={{
                        layout: { type: "spring", stiffness: 420, damping: 42, mass: 0.9 },
                        opacity: { duration: 0.25, ease: "easeOut" },
                      }}
                    />
                  )}

                  {/* Miniatura: emblema ADEEMA en reposo, imagen en hover */}
                  <div className="relative h-40 w-full shrink-0 overflow-hidden bg-ink/[0.04] sm:h-auto sm:w-[180px] md:w-[260px] lg:w-[320px]">
                    <div
                      className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
                        highlighted ? "opacity-0" : "opacity-100"
                      }`}
                    >
                      <img
                        src={site.logo}
                        alt=""
                        className="h-10 w-10 object-contain brightness-0 opacity-[0.18] md:h-14 md:w-14"
                      />
                    </div>
                    <img
                      src={item.image}
                      alt=""
                      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                        highlighted ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </div>

                  {/* Título */}
                  <div className="relative z-10 flex w-full shrink-0 items-center px-6 py-6 sm:w-[200px] sm:py-8 md:w-[280px] md:px-8 lg:w-[340px]">
                    <h3
                      className={`display-font text-xl font-bold uppercase leading-[1.05] transition-colors duration-500 md:text-2xl lg:text-[28px] ${
                        highlighted ? "text-white" : "text-ink"
                      }`}
                    >
                      {item.title}
                    </h3>
                  </div>

                  {/* Descripción */}
                  <div className="relative z-10 flex w-full flex-1 items-center px-6 pb-6 sm:px-4 sm:py-8 md:px-6">
                    <p
                      className={`max-w-xl text-sm leading-relaxed transition-colors duration-500 md:text-base ${
                        highlighted ? "text-white/70" : "text-muted-dark"
                      }`}
                    >
                      {item.description || ui.comingSoon}
                    </p>
                  </div>

                  {/* Número */}
                  <div className="relative z-10 flex w-full shrink-0 items-center justify-end px-6 pb-6 sm:w-24 sm:py-8 md:w-28 md:px-8">
                    <span
                      className={`display-font text-2xl font-bold tabular-nums transition-colors duration-500 md:text-3xl ${
                        highlighted ? "text-white" : "text-accent"
                      }`}
                    >
                      {item.index}
                    </span>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Reveal from "./ui/Reveal";
import Cursor from "./ui/inverted-cursor";
import { network, site } from "../data/content";

export default function Network() {
  const [active, setActive] = useState(0);
  const [inside, setInside] = useState(false);
  const [fine, setFine] = useState(false);

  useEffect(() => {
    setFine(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  return (
    <section id="red-articulacion" className="relative bg-paper px-6 py-28 text-ink md:px-10 md:py-32">
      <div className="mx-auto max-w-[1600px]">
        <Reveal className="mb-16 md:mb-20">
          <h2 className="display-font text-[13vw] font-bold uppercase leading-[0.9] text-ink md:text-[5.5vw]">
            Red de <span className="text-secondary">articulación</span>
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
                        layout: { type: "spring", stiffness: 600, damping: 45, mass: 0.8 },
                        opacity: { duration: 0.15, ease: "easeOut" },
                      }}
                    />
                  )}

                  {/* Miniatura: emblema ADEEMA en reposo, imagen en hover */}
                  <div className="relative h-40 w-full shrink-0 overflow-hidden bg-ink/[0.04] sm:h-auto sm:w-[180px] md:w-[260px] lg:w-[320px]">
                    <div
                      className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
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
                      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                        highlighted ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </div>

                  {/* Título */}
                  <div className="relative z-10 flex w-full shrink-0 items-center px-6 py-6 sm:w-[200px] sm:py-8 md:w-[280px] md:px-8 lg:w-[340px]">
                    <h3
                      className={`display-font text-xl font-bold uppercase leading-[1.05] transition-colors duration-300 md:text-2xl lg:text-[28px] ${
                        highlighted ? "text-white" : "text-ink"
                      }`}
                    >
                      {item.title}
                    </h3>
                  </div>

                  {/* Descripción */}
                  <div className="relative z-10 flex w-full flex-1 items-center px-6 pb-6 sm:px-4 sm:py-8 md:px-6">
                    <p
                      className={`max-w-xl text-sm leading-relaxed transition-colors duration-300 md:text-base ${
                        highlighted ? "text-white/70" : "text-muted-dark"
                      }`}
                    >
                      {item.description || "Contenido próximamente."}
                    </p>
                  </div>

                  {/* Número */}
                  <div className="relative z-10 flex w-full shrink-0 items-center justify-end px-6 pb-6 sm:w-24 sm:py-8 md:w-28 md:px-8">
                    <span
                      className={`display-font text-2xl font-bold tabular-nums transition-colors duration-300 md:text-3xl ${
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

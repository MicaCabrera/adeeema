import { useState } from "react";
import { motion } from "framer-motion";
import Eyebrow from "./ui/Eyebrow";
import Reveal from "./ui/Reveal";
import { network } from "../data/content";

export default function Network() {
  const [active, setActive] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  return (
    <section
      id="red-articulacion"
      className="relative flex flex-col bg-ink px-6 py-16 pt-28 md:min-h-screen md:justify-center md:px-10 md:pb-16 md:pt-32"
    >
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="mb-10 md:mb-16">
          <Reveal>
            <Eyebrow label={network.eyebrow} className="mb-3" />
            <h2 className="display-font text-[13vw] font-bold uppercase leading-[0.9] text-white md:text-[5.5vw]">
              Red de
              <br />
              <span className="text-white/35">articulación</span>
            </h2>
          </Reveal>
        </div>

        <div className="flex flex-col" onMouseLeave={() => setIsHovering(false)}>
          {network.items.map((item, i) => {
            const isActive = active === i;
            return (
              <button
                key={item.index}
                onMouseEnter={() => {
                  setActive(i);
                  setIsHovering(true);
                }}
                onFocus={() => {
                  setActive(i);
                  setIsHovering(true);
                }}
                onBlur={() => setIsHovering(false)}
                onClick={() => setActive(i)}
                className="group relative flex w-full items-center text-left transition-colors duration-300"
              >
                <div
                  className={`relative flex w-full flex-col gap-1 border-b border-white/10 py-3 md:w-fit md:flex-row md:items-center md:gap-8 md:py-4 ${
                    i === 0 ? "border-t" : ""
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="hover-highlight"
                      className="absolute inset-0 z-0 rounded-md bg-accent/15 will-change-transform"
                      initial={false}
                      animate={{ opacity: isHovering ? 1 : 0 }}
                      transition={{
                        layout: { type: "spring", stiffness: 600, damping: 45, mass: 0.8 },
                        opacity: { duration: 0.15, ease: "easeOut" },
                      }}
                    />
                  )}

                  <span
                    className={`display-font relative z-10 text-xs shrink-0 tabular-nums transition-colors duration-150 md:w-8 ${
                      isActive ? "text-accent" : "text-white/30"
                    }`}
                  >
                    {item.index}
                  </span>

                  <span
                    className={`display-font relative z-10 shrink-0 text-xl font-bold uppercase transition-colors duration-150 md:w-56 md:text-3xl ${
                      isActive ? "text-white" : "text-white/25"
                    }`}
                  >
                    {item.tag}
                  </span>

                  <span
                    className={`relative z-10 text-[11px] font-medium uppercase tracking-wide transition-colors duration-150 md:w-52 md:text-xs ${
                      isActive ? "text-white/70" : "text-white/20"
                    }`}
                  >
                    {item.title}
                  </span>

                  <span
                    className={`relative z-10 overflow-hidden text-xs leading-relaxed text-white/50 transition-all duration-500 md:w-[26rem] ${
                      isActive ? "max-h-16 opacity-100" : "max-h-0 opacity-0 md:max-h-16 md:opacity-0"
                    }`}
                  >
                    {item.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

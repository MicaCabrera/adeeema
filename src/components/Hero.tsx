import { motion } from "framer-motion";
import { useContent } from "../i18n/useContent";
import CtaButton from "./ui/CtaButton";

export default function Hero() {
  const { hero } = useContent();

  return (
    <section
      id="inicio"
      className="relative isolate flex min-h-screen w-full flex-col overflow-hidden bg-ink pt-36 pb-20 md:pb-16"
    >
      {/* background layers */}
      <div className="absolute inset-0 -z-20">
        <video
          src="/Video%20Home.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="absolute inset-0 -z-20 bg-ink/40" />
      <div className="absolute -left-40 top-20 -z-10 h-[420px] w-[420px] rounded-full bg-accent/25 blur-[140px]" />
      <div className="absolute right-0 bottom-0 -z-10 h-[380px] w-[380px] rounded-full bg-accent/20 blur-[140px]" />

      <div className="relative mx-auto flex h-full w-full max-w-[1600px] flex-1 flex-col justify-end gap-10 px-6 md:px-10">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="display-font flex flex-nowrap leading-[0.85]"
          >
            <span className="text-[13vw] font-bold text-white sm:text-[10vw] md:text-[7vw]">
              {hero.titleLines[0]}
            </span>
            <span className="text-[13vw] font-bold text-white sm:text-[10vw] md:text-[7vw]">
              {hero.titleLines[1]}
            </span>
          </motion.div>

          {/* Misma entrada que el título, ~180ms después. */}
          <motion.p
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="mt-2 max-w-[280px] text-sm font-normal leading-snug tracking-wide text-white/70 md:max-w-none md:text-lg"
          >
            {hero.subtitle}
          </motion.p>

          {/* Mobile: CTAs y kicker apilados (bloque normal). Desde md: en fila,
              kicker a la derecha y alineado por abajo con los CTAs. */}
          <div className="md:flex md:items-end md:justify-between md:gap-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="flex flex-wrap items-center gap-5 pt-8 md:shrink-0"
            >
              <CtaButton href={hero.ctaPrimary.href} size="mobile">
                {hero.ctaPrimary.label}
              </CtaButton>
              <CtaButton href={hero.ctaSecondary.href} variant="secondary" size="mobile">
                {hero.ctaSecondary.label}
              </CtaButton>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.75 }}
              className="max-w-md pt-8 text-base leading-relaxed text-white/70 mb-4 md:mb-0 md:pt-0"
            >
              {hero.kicker}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}

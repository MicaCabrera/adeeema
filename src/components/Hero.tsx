import { motion } from "framer-motion";
import { hero, site } from "../data/content";
import CtaButton from "./ui/CtaButton";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-screen w-full flex-col overflow-hidden bg-ink pt-36 pb-14 md:pb-16"
    >
      {/* background layers */}
      <div className="absolute inset-0 -z-20">
        <img
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=2000&q=80"
          alt=""
          className="h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/85 to-ink/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-transparent to-ink/60" />
      </div>
      <div className="absolute -left-40 top-20 -z-10 h-[420px] w-[420px] rounded-full bg-accent/25 blur-[140px]" />
      <div className="absolute right-0 bottom-0 -z-10 h-[380px] w-[380px] rounded-full bg-accent/20 blur-[140px]" />

      <div className="relative mx-auto flex h-full w-full max-w-[1600px] flex-1 flex-col justify-between gap-10 px-6 md:px-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-xs text-xs font-semibold uppercase tracking-[0.3em] text-white/50"
          >
            {site.fullName}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="max-w-md text-sm leading-relaxed text-white/70 md:text-base"
          >
            {hero.kicker}
          </motion.p>
        </div>

        <div>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="display-font flex flex-nowrap leading-[0.85]"
          >
            <span className="text-outline text-[13vw] font-bold sm:text-[10vw] md:text-[7vw]">
              {hero.titleLines[0]}
            </span>
            <span className="text-[13vw] font-bold text-white sm:text-[10vw] md:text-[7vw]">
              {hero.titleLines[1]}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex flex-wrap items-center gap-5 pt-8"
          >
            <CtaButton href={hero.ctaPrimary.href}>{hero.ctaPrimary.label}</CtaButton>
            <CtaButton href={hero.ctaSecondary.href} variant="secondary" target="_blank" rel="noreferrer">
              {hero.ctaSecondary.label}
            </CtaButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

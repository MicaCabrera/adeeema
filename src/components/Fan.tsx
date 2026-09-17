import { useState } from "react";
import Reveal from "./ui/Reveal";
import CtaButton from "./ui/CtaButton";
import { fan } from "../data/content";

export default function Fan() {
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="comunidad" className="relative overflow-hidden bg-ink px-6 py-32 text-center md:px-10 md:py-40">
      <span className="bg-word absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[22vw] leading-none">
        FAN
      </span>

      <div className="pointer-events-none absolute inset-0">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="radar-ring absolute left-1/2 top-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2"
            style={{ animationDelay: `${i * 1}s` }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-2xl">
        <Reveal>
          <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            {fan.eyebrow}
          </span>
          <h2 className="display-font mb-6 text-4xl font-bold uppercase leading-[0.95] text-white md:text-6xl">
            {fan.titleParts.slice(0, 3).join(" ")}
            <br />
            {fan.titleParts.slice(3).join(" ")}
          </h2>
          <p className="mx-auto mb-10 max-w-md text-base leading-relaxed text-white/60">
            {fan.paragraph}
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          {submitted ? (
            <p className="text-lg font-semibold text-accent">¡Gracias por sumarte! 🎮</p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (consent) setSubmitted(true);
              }}
              className="flex flex-col items-center gap-4"
            >
              <div className="flex w-full max-w-md flex-col items-center gap-3 sm:flex-row">
                <input
                  type="email"
                  required
                  placeholder="Tu email"
                  className="w-full rounded-full border border-white/20 bg-white/5 px-6 py-4 text-sm text-white placeholder:text-white/40 outline-none focus:border-accent"
                />
                <CtaButton as="button" type="submit" className="shrink-0">
                  {fan.cta}
                </CtaButton>
              </div>

              <label className="flex max-w-md items-start gap-3 text-left text-xs text-white/50">
                <input
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 accent-accent"
                />
                {fan.consent}
              </label>
              <p className="text-xs text-white/35">{fan.note}</p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}

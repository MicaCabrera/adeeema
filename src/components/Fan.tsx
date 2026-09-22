import { useState } from "react";
import Reveal from "./ui/Reveal";
import CtaButton from "./ui/CtaButton";
import { useContent, useUi } from "../i18n/useContent";

export default function Fan() {
  const { fan } = useContent();
  const ui = useUi();
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="comunidad" className="relative overflow-hidden bg-ink px-6 py-32 text-center md:px-10 md:py-40">
      <div className="relative mx-auto max-w-2xl">
        <Reveal>
          <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            {fan.eyebrow}
          </span>
          <h2 className="display-font mb-6 text-4xl font-bold uppercase leading-[0.95] text-white md:text-6xl">
            {fan.titleParts.slice(0, 3).join(" ")}
            <br />
            {fan.titleParts.slice(3, -1).join(" ")}{" "}
            <span className="text-secondary">{fan.titleParts[fan.titleParts.length - 1]}</span>
          </h2>
          <p className="mx-auto mb-10 max-w-md text-[17.6px] leading-relaxed text-white/60">
            {fan.paragraph}
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          {submitted ? (
            <p className="text-lg font-semibold text-white">{fan.success}</p>
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
                  placeholder={ui.emailPlaceholder}
                  className="w-full rounded-[4px] bg-white/5 px-6 py-4 text-sm text-white placeholder:text-white/40 outline-none focus:bg-white/10"
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

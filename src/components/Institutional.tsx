import Eyebrow from "./ui/Eyebrow";
import Reveal from "./ui/Reveal";
import CtaButton from "./ui/CtaButton";
import { institutional } from "../data/content";

export default function Institutional() {
  return (
    <section
      id="institucional"
      className="relative overflow-hidden bg-gradient-to-b from-ink via-accent-deep to-accent px-6 py-28 md:px-10 md:py-36"
    >
      <div className="relative mx-auto max-w-[1600px]">
        <Reveal>
          <Eyebrow label={institutional.eyebrow} className="mb-10 max-w-md" />
        </Reveal>

        <div className="grid gap-y-8 gap-x-0 md:grid-cols-2 md:gap-x-16 md:gap-y-0">
          <Reveal delay={0.1} className="md:col-start-1 md:row-start-1">
            <h2 className="display-font text-[13vw] font-bold uppercase leading-[0.9] text-white md:text-[5.5vw]">
              {institutional.headingParts[0]}
              <br />
              <span className="text-secondary">{institutional.headingParts[1]}</span>
              <br />
              <span className="text-secondary">{institutional.headingParts[2]}</span>
            </h2>
          </Reveal>

          <Reveal delay={0.25} className="flex flex-col gap-6 md:col-start-2 md:row-start-2">
            <p className="max-w-lg text-[17.6px] leading-relaxed text-white/60">
              {institutional.paragraph}
            </p>
            <div>
              <CtaButton href="#mision-vision">
                {institutional.ctaLabel}
              </CtaButton>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

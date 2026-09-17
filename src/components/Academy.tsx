import Eyebrow from "./ui/Eyebrow";
import Reveal from "./ui/Reveal";
import CtaButton from "./ui/CtaButton";
import { academy } from "../data/content";

export default function Academy() {
  return (
    <section id="academy" className="relative bg-ink px-6 py-28 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <Reveal>
            <Eyebrow label={academy.eyebrow} className="mb-8 max-w-sm" />
            <h2 className="display-font text-5xl font-bold uppercase leading-[0.95] text-white md:text-7xl">
              {academy.title}
            </h2>
          </Reveal>
          <Reveal delay={0.15} className="flex max-w-md flex-col items-start gap-6">
            <p className="text-base leading-relaxed text-white/60">{academy.paragraph}</p>
            <CtaButton href="https://academy.adeema.org.ar" target="_blank" rel="noreferrer">
              {academy.ctaLabel}
            </CtaButton>
          </Reveal>
        </div>

        <div className="grid gap-px overflow-hidden rounded-sm bg-white/10 md:grid-cols-2 lg:grid-cols-4">
          {academy.items.map((item, i) => (
            <Reveal key={item.index} delay={i * 0.08} className="group relative h-full bg-ink">
              <div className="flex h-full flex-col">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={item.image}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                  <span className="absolute right-4 top-4 display-font text-sm text-white/70">{item.index}</span>
                </div>
                <div className="flex flex-1 flex-col gap-3 bg-panel p-6">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-accent">
                    {academy.tag}
                  </span>
                  <h3 className="display-font text-xl font-bold leading-tight text-white">
                    {item.title}
                  </h3>
                  <p className="flex-1 text-sm leading-relaxed text-white/55">{item.description}</p>
                  <div className="mt-2">
                    <CtaButton href="https://academy.adeema.org.ar" variant="secondary" target="_blank" rel="noreferrer">
                      Ver
                    </CtaButton>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

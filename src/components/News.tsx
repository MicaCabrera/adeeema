import Eyebrow from "./ui/Eyebrow";
import Reveal from "./ui/Reveal";
import CtaButton from "./ui/CtaButton";
import { news } from "../data/content";

export default function News() {
  const total = news.items.length.toString().padStart(2, "0");

  return (
    <section id="noticias" className="relative bg-ink px-6 py-28 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <Reveal>
            <Eyebrow label={news.eyebrow} className="mb-8 max-w-sm" />
            <h2 className="display-font text-5xl font-bold uppercase leading-[0.95] text-white md:text-7xl">
              {news.title}
            </h2>
          </Reveal>
          <Reveal delay={0.15} className="flex max-w-md flex-col items-start gap-6">
            <p className="text-base leading-relaxed text-white/60">{news.paragraph}</p>
            <CtaButton href="#noticias" variant="secondary">
              {news.ctaLabel}
            </CtaButton>
          </Reveal>
        </div>

        <div className="grid gap-px overflow-hidden rounded-sm bg-white/10 md:grid-cols-3">
          {news.items.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1} className="group flex h-full flex-col justify-between gap-10 bg-panel p-8">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-white/40">
                  {item.date}
                </span>
                <span className="display-font text-xs tabular-nums text-white/30">
                  {String(i + 1).padStart(2, "0")}/{total}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                <span className="w-max rounded-full border border-accent/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-accent">
                  {item.category}
                </span>
                <h3 className="display-font text-xl font-semibold leading-snug text-white transition-colors group-hover:text-accent">
                  {item.title}
                </h3>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

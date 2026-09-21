import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Eyebrow from "./ui/Eyebrow";
import Reveal from "./ui/Reveal";
import { academy } from "../data/content";

export default function Academy() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const cardStep = () => {
    const track = trackRef.current;
    const card = track?.firstElementChild as HTMLElement | null;
    return (card?.offsetWidth ?? 340) + 24;
  };

  const scrollByCard = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: dir * cardStep(), behavior: "smooth" });
  };

  const scrollToIndex = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: index * cardStep(), behavior: "smooth" });
  };

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const index = Math.round(track.scrollLeft / cardStep());
    setActive(Math.min(Math.max(index, 0), academy.items.length - 1));
  };

  return (
    <section
      id="academy"
      className="relative bg-paper [--gutter:max(1.5rem,calc((100vw-1600px)/2))] md:[--gutter:max(2.5rem,calc((100vw-1600px)/2))] lg:[--gutter:calc(max(2.5rem,calc((100vw-1600px)/2))+240px+4rem)]"
    >
      <div className="pl-[var(--gutter)] pr-6 pb-16 pt-28 md:pr-10 md:pb-16 md:pt-32">
        <div className="max-w-2xl text-left">
          <Reveal>
            <Eyebrow label={academy.eyebrow} className="mb-6" />
            <h2 className="display-font text-[13vw] font-bold uppercase leading-[0.9] text-ink md:text-[5.5vw]">
              ADEEMA <span className="text-secondary">Academy</span>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-8 text-[15.4px] leading-relaxed text-muted-dark">{academy.paragraph}</p>
          </Reveal>
        </div>
      </div>

      <div className="pb-16 md:pb-20">
        <div
          ref={trackRef}
          onScroll={handleScroll}
          className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 pl-[var(--gutter)] scroll-pl-[var(--gutter)] pr-6 md:pr-10"
        >
          {academy.items.map((item, i) => (
            <Reveal
              key={item.index}
              delay={i * 0.08}
              y={0}
              className="w-[calc(100vw-3rem)] shrink-0 snap-start snap-always sm:w-[calc((100vw-3rem)*0.32)] lg:w-[calc((100vw-var(--gutter)-3rem)/2.4)]"
            >
              <a
                href="https://academy.adeema.org.ar"
                target="_blank"
                rel="noreferrer"
                className="group flex aspect-square w-full flex-col overflow-hidden bg-ink/[0.035] p-3"
              >
                <div className="relative flex-1 overflow-hidden">
                  <img
                    src={item.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="flex shrink-0 flex-col gap-2 px-1 pb-1 pt-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-paper px-2.5 py-1 text-[11px] font-medium text-accent">
                      {academy.tag}
                    </span>
                    <span className="rounded-full bg-paper px-2.5 py-1 text-[11px] font-medium text-accent">
                      {item.index}
                    </span>
                  </div>
                  <h3 className="line-clamp-2 text-sm font-bold leading-snug text-ink transition-colors duration-300 group-hover:text-accent">
                    {item.title}
                  </h3>
                  <p className="text-xs font-normal leading-relaxed text-muted-dark">{item.description}</p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8 flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label="Anterior"
            className="relative flex h-9 w-9 items-center justify-center rounded-sm border border-ink/10 text-ink/50 transition-colors duration-300 before:absolute before:-inset-1 before:content-[''] hover:border-accent/40 hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2">
            {academy.items.map((item, i) => (
              <button
                key={item.index}
                type="button"
                onClick={() => scrollToIndex(i)}
                aria-label={`Ir a ${item.title}`}
                className={`relative h-1.5 rounded-full transition-all duration-300 before:absolute before:-inset-x-1 before:-inset-y-4 before:content-[''] ${
                  i === active ? "w-6 bg-accent" : "w-1.5 bg-ink/20 hover:bg-ink/35"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label="Siguiente"
            className="relative flex h-9 w-9 items-center justify-center rounded-sm border border-ink/10 text-ink/50 transition-colors duration-300 before:absolute before:-inset-1 before:content-[''] hover:border-accent/40 hover:text-accent"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </Reveal>
      </div>
    </section>
  );
}

import { useState } from "react";
import Eyebrow from "./ui/Eyebrow";
import Reveal from "./ui/Reveal";
import { media } from "../data/content";

export default function Media() {
  const [active, setActive] = useState(0);

  return (
    <section id="media" className="relative bg-paper px-6 py-28 text-ink md:px-10 md:py-32">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-16 grid gap-8 md:grid-cols-2 md:gap-16">
          <Reveal>
            <Eyebrow label={media.eyebrow} dark className="mb-8" />
            <h2 className="display-font text-5xl font-bold uppercase leading-[0.95] text-ink md:text-7xl">
              {media.title}
            </h2>
          </Reveal>
          <Reveal delay={0.15} className="flex items-end">
            <p className="max-w-lg text-base leading-relaxed text-ink/60 md:text-lg">
              {media.paragraph}
            </p>
          </Reveal>
        </div>

        <div className="border-t border-ink/10">
          {media.items.map((item, i) => {
            const isActive = active === i;
            return (
              <button
                key={item.index}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className="group flex w-full flex-col gap-3 border-b border-ink/10 py-7 text-left transition-colors duration-300 md:flex-row md:items-center md:gap-10"
              >
                <span
                  className={`display-font shrink-0 text-sm tabular-nums transition-colors duration-300 md:w-10 ${
                    isActive ? "text-accent" : "text-ink/30"
                  }`}
                >
                  {item.index}
                </span>
                <span
                  className={`display-font shrink-0 text-2xl font-bold uppercase transition-colors duration-300 md:w-96 md:text-3xl ${
                    isActive ? "text-ink" : "text-ink/25"
                  }`}
                >
                  {item.title}
                </span>
                <span
                  className={`overflow-hidden text-sm leading-relaxed text-ink/60 transition-all duration-500 md:flex-1 ${
                    isActive ? "max-h-24 opacity-100" : "max-h-0 opacity-0 md:max-h-24 md:opacity-0"
                  }`}
                >
                  {item.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

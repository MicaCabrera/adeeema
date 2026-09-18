import Eyebrow from "./ui/Eyebrow";
import Reveal from "./ui/Reveal";
import CtaButton from "./ui/CtaButton";
import { academy } from "../data/content";

export default function Academy() {
  return (
    <section id="academy" className="relative bg-[#f7f5f0]">
      <div className="px-6 pb-16 pt-28 md:px-10 md:pb-16 md:pt-32">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <Eyebrow label={academy.eyebrow} className="mb-6 justify-center" dark />
            <h2 className="display-font text-[13vw] font-bold uppercase leading-[0.9] text-ink/35 md:text-[5.5vw]">
              {academy.title}
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mx-auto mt-8 max-w-md text-sm leading-relaxed text-ink/60">{academy.paragraph}</p>
          </Reveal>
        </div>
      </div>

      <div className="px-6 pb-16 md:px-10 md:pb-20">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {academy.items.map((item, i) => (
              <Reveal
                key={item.index}
                delay={i * 0.08}
                y={0}
                className="h-full overflow-hidden rounded-sm bg-transparent"
              >
                <div className="flex h-full flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <img src={item.image} alt="" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                    <span className="absolute right-4 top-4 display-font text-sm text-white/70">{item.index}</span>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-6">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-accent">
                      {academy.tag}
                    </span>
                    <h3 className="display-font text-xl font-bold leading-tight text-ink">{item.title}</h3>
                    <p className="flex-1 text-sm leading-relaxed text-ink/55">{item.description}</p>
                    <div className="mt-2">
                      <CtaButton
                        href="https://academy.adeema.org.ar"
                        variant="secondary"
                        target="_blank"
                        rel="noreferrer"
                        className="!bg-accent/10 !text-accent/80 hover:!bg-accent/15 hover:!text-accent"
                      >
                        Ver
                      </CtaButton>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

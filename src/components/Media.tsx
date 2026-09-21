import Eyebrow from "./ui/Eyebrow";
import Reveal from "./ui/Reveal";
import { media } from "../data/content";

export default function Media() {
  return (
    <section id="media" className="relative bg-accent px-6 py-28 text-ink md:px-10 md:py-32">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[240px_1fr] lg:gap-16">
          {/* Columna izquierda: eyebrow arriba, párrafo abajo (sólo desktop) */}
          <div className="flex flex-col lg:justify-between">
            <Reveal>
              <Eyebrow label={media.eyebrow} />
            </Reveal>
            <Reveal delay={0.15} className="mt-8 hidden lg:mt-0 lg:block">
              <p className="max-w-[200px] text-[15.4px] leading-relaxed text-white">{media.paragraph}</p>
            </Reveal>
          </div>

          {/* Columna derecha: título grande + párrafo (mobile/tablet) + grilla de tarjetas */}
          <div>
            <Reveal>
              <h2 className="display-font text-[15vw] font-bold uppercase leading-[0.9] text-white sm:text-[10vw] md:text-[7vw] lg:text-[4.6vw]">
                ADEEMA <span className="text-secondary">MEDIA</span>
              </h2>
            </Reveal>

            <Reveal delay={0.1} className="lg:hidden">
              <p className="mt-6 max-w-md text-[15.4px] leading-relaxed text-white">{media.paragraph}</p>
            </Reveal>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
              {media.items.map((item, i) => (
                <Reveal key={item.index} delay={i * 0.08} y={0}>
                  <MediaCard title={item.title} image={item.image} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MediaCard({ title, image }: { title: string; image: string }) {
  return (
    <div className="group relative aspect-[5/6] w-full overflow-hidden bg-ink">
      <img
        src={image}
        alt=""
        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
      <span className="display-font absolute inset-x-5 bottom-5 text-base font-bold uppercase leading-tight text-white">
        {title}
      </span>
    </div>
  );
}

import { Link, useParams } from "react-router-dom";
import Reveal from "./ui/Reveal";
import { getNewsItemBySlug, formatNewsDate } from "../data/news";
import { useContent, useUi } from "../i18n/useContent";

export default function NewsDetail() {
  const { newsDetail } = useContent();
  const ui = useUi();
  const { slug } = useParams<{ slug: string }>();
  const item = slug ? getNewsItemBySlug(slug) : undefined;

  if (!item) {
    return (
      <section className="relative bg-paper px-6 py-32 pt-40 text-center text-ink md:px-10">
        <p className="mb-6 text-sm text-muted-dark">{newsDetail.notFound}</p>
        <Link to="/#noticias" className="font-mono text-xs font-semibold uppercase tracking-widest text-accent">
          ← {ui.back}
        </Link>
      </section>
    );
  }

  return (
    <section className="relative bg-paper px-6 pb-28 pt-40 text-ink md:px-10 md:pt-44">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/#noticias"
          className="mb-10 inline-block font-mono text-xs font-semibold uppercase tracking-widest text-accent hover:underline"
        >
          ← {ui.back}
        </Link>

        <Reveal>
          <span className="mb-4 block font-mono text-[11px] font-semibold uppercase tracking-widest text-muted-dark">
            {item.subcategory} | {formatNewsDate(item.date)}
          </span>
          <h1 className="display-font mb-10 text-3xl font-bold uppercase leading-[1.05] text-ink md:text-5xl">
            {item.title}
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mb-10 aspect-[16/9] w-full overflow-hidden rounded-sm">
            <img src={item.image} alt="" className="h-full w-full object-cover" />
          </div>
        </Reveal>

        <Reveal delay={0.15} className="flex flex-col gap-5">
          {item.content.map((paragraph, i) => (
            <p key={i} className="text-base leading-relaxed text-ink">
              {paragraph}
            </p>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

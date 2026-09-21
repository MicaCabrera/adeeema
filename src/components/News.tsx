import { useState } from "react";
import { Link } from "react-router-dom";
import Reveal from "./ui/Reveal";
import { useUi } from "../i18n/useContent";
import {
  newsCategoryGroups,
  getNewsItemsSorted,
  getSubcategoryCount,
  formatNewsDate,
  type NewsItem,
} from "../data/news";

const sortedItems = getNewsItemsSorted();

export default function News() {
  const ui = useUi();
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);

  const filteredItems = activeSubcategory
    ? sortedItems.filter((item) => item.subcategory === activeSubcategory)
    : sortedItems;

  return (
    <section id="noticias" className="relative bg-paper px-6 py-28 text-ink md:px-10 md:py-32">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          <Reveal className="w-full shrink-0 lg:w-64">
            <h3 className="display-font mb-6 text-2xl font-bold uppercase leading-none text-ink">
              {ui.newsCategories}
            </h3>

            <button
              type="button"
              onClick={() => setActiveSubcategory(null)}
              className={`mb-2 flex w-full items-center justify-between gap-3 border-b border-ink/10 px-3 py-3 text-left font-mono text-xs font-semibold uppercase tracking-wide transition-colors ${
                activeSubcategory === null ? "text-accent" : "text-ink hover:text-accent"
              }`}
            >
              <span>{ui.newsAll}</span>
              <span className={activeSubcategory === null ? "text-accent" : "text-muted-dark"}>
                {sortedItems.length}
              </span>
            </button>

            <div className="flex flex-col gap-8">
              {newsCategoryGroups.map((group) => (
                <div key={group.group}>
                  <div className="mb-2 bg-ink/[0.04] px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-muted-dark">
                    {group.group}
                  </div>
                  <ul>
                    {group.subcategories.map((sub) => {
                      const count = getSubcategoryCount(sub);
                      const active = activeSubcategory === sub;
                      return (
                        <li key={sub}>
                          <button
                            type="button"
                            onClick={() => setActiveSubcategory(active ? null : sub)}
                            className={`flex w-full items-center justify-between gap-3 border-b border-ink/10 px-3 py-3 text-left font-mono text-xs font-semibold uppercase tracking-wide transition-colors ${
                              active ? "text-accent" : "text-ink hover:text-accent"
                            }`}
                          >
                            <span>{sub}</span>
                            <span className={active ? "text-accent" : "text-muted-dark"}>{count}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="min-w-0 flex-1">
            <Reveal className="mb-10 border-b border-ink/10 pb-6">
              <h2 className="display-font text-4xl font-bold uppercase leading-[0.95] text-ink md:text-5xl">
                {ui.newsTitleLead} <span className="text-secondary">{ui.newsTitleAccent}</span>
              </h2>
            </Reveal>

            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredItems.map((item, i) => (
                  <Reveal key={item.slug} delay={i * 0.06}>
                    <NewsCard item={item} />
                  </Reveal>
                ))}
              </div>
            ) : (
              <p className="py-16 text-center text-sm text-muted-dark">
                {ui.newsEmpty}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function NewsCard({ item }: { item: NewsItem }) {
  const content = (
    <div className="flex h-full flex-col gap-6 rounded-sm bg-ink/[0.035] p-6 transition-colors hover:bg-ink/[0.06]">
      <div className="h-20 w-20 overflow-hidden rounded-sm">
        <img src={item.image} alt="" className="h-full w-full object-cover" loading="lazy" />
      </div>
      <div className="flex flex-col gap-3">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-muted-dark">
          {item.subcategory} | {formatNewsDate(item.date)}
        </span>
        <p className="text-sm font-semibold leading-snug text-ink">{item.title}</p>
      </div>
    </div>
  );

  if (item.externalLink) {
    return (
      <a href={item.externalLink} target="_blank" rel="noreferrer" className="block h-full">
        {content}
      </a>
    );
  }

  return (
    <Link to={`/actualidad/${item.slug}`} className="block h-full">
      {content}
    </Link>
  );
}

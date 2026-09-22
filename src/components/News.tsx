import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Reveal from "./ui/Reveal";
import { useContent, useUi } from "../i18n/useContent";
import { newsCategoryGroups, getNewsItemsSorted, formatNewsDate } from "../data/news";
import { mergeNews, type DisplayNewsItem } from "../data/externalNews";
import { useExternalNews } from "../hooks/useExternalNews";

const ownItems = getNewsItemsSorted();
const PAGE_SIZE = 6;

export default function News() {
  const ui = useUi();
  const { site } = useContent();
  const externalItems = useExternalNews();
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const sortedItems = useMemo(() => mergeNews(ownItems, externalItems), [externalItems]);

  const getSubcategoryCount = (subcategory: string) =>
    sortedItems.filter((item) => item.subcategory === subcategory).length;

  const filteredItems = activeSubcategory
    ? sortedItems.filter((item) => item.subcategory === activeSubcategory)
    : sortedItems;

  const pageCount = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const pageItems = filteredItems.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE);

  const selectSubcategory = (subcategory: string | null) => {
    setActiveSubcategory(subcategory);
    setPage(0);
  };

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
              onClick={() => selectSubcategory(null)}
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
                            onClick={() => selectSubcategory(active ? null : sub)}
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

            {pageItems.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {pageItems.map((item, i) => (
                    <Reveal key={item.slug} delay={i * 0.06}>
                      <NewsCard item={item} logo={site.logo} />
                    </Reveal>
                  ))}
                </div>

                {pageCount > 1 && (
                  <Reveal className="mt-10 flex items-center justify-center gap-6">
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      disabled={currentPage === 0}
                      aria-label={ui.previous}
                      className="relative flex h-9 w-9 items-center justify-center rounded-sm border border-ink/10 text-ink/50 transition-colors duration-300 before:absolute before:-inset-1 before:content-[''] hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-30"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>

                    <div className="flex items-center gap-2">
                      {Array.from({ length: pageCount }).map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setPage(i)}
                          aria-label={`${ui.goTo} ${i + 1}`}
                          className={`relative h-1.5 rounded-full transition-all duration-300 before:absolute before:-inset-x-1 before:-inset-y-4 before:content-[''] ${
                            i === currentPage ? "w-6 bg-accent" : "w-1.5 bg-ink/20 hover:bg-ink/35"
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                      disabled={currentPage === pageCount - 1}
                      aria-label={ui.next}
                      className="relative flex h-9 w-9 items-center justify-center rounded-sm border border-ink/10 text-ink/50 transition-colors duration-300 before:absolute before:-inset-1 before:content-[''] hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-30"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </Reveal>
                )}
              </>
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

function NewsCard({ item, logo }: { item: DisplayNewsItem; logo: string }) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = Boolean(item.image) && !imageFailed;

  const content = (
    <div className="flex h-full flex-col gap-6 rounded-sm bg-ink/[0.035] p-6 transition-colors hover:bg-ink/[0.06]">
      <div className="relative h-20 w-20 overflow-hidden rounded-sm bg-ink/[0.04]">
        {hasImage ? (
          <img
            src={item.image}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <img src={logo} alt="" className="h-8 w-8 object-contain brightness-0 opacity-[0.18]" />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-muted-dark">
          {item.subcategory} | {item.source ? `${item.source} | ` : ""}
          {formatNewsDate(item.date)}
        </span>
        <p className="text-sm font-semibold leading-snug text-ink" title={item.summary}>
          {item.title}
        </p>
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

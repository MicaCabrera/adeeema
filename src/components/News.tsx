import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import Eyebrow from "./ui/Eyebrow";
import Reveal from "./ui/Reveal";
import WindowedDots from "./ui/WindowedDots";
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
  const [filtersOpen, setFiltersOpen] = useState(false);
  const carouselTrackRef = useRef<HTMLDivElement>(null);
  const [carouselActive, setCarouselActive] = useState(0);

  const sortedItems = useMemo(() => mergeNews(ownItems, externalItems), [externalItems]);

  // Cuando llegan las noticias externas, las cards del carrusel se reordenan
  // por fecha y el navegador puede correr el scroll horizontal solo (scroll
  // anchoring) para "compensar" el cambio. Se fuerza de nuevo al principio.
  useEffect(() => {
    setCarouselActive(0);
    carouselTrackRef.current?.scrollTo({ left: 0 });
  }, [externalItems]);

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
    setFiltersOpen(false);
    setCarouselActive(0);
    carouselTrackRef.current?.scrollTo({ left: 0 });
  };

  const carouselCardStep = () => {
    const track = carouselTrackRef.current;
    const card = track?.firstElementChild as HTMLElement | null;
    return (card?.offsetWidth ?? 300) + 24;
  };

  const scrollCarouselByCard = (dir: 1 | -1) => {
    const track = carouselTrackRef.current;
    if (!track) return;
    track.scrollBy({ left: dir * carouselCardStep(), behavior: "smooth" });
  };

  const scrollCarouselToIndex = (index: number) => {
    const track = carouselTrackRef.current;
    if (!track) return;
    track.scrollTo({ left: index * carouselCardStep(), behavior: "smooth" });
  };

  const handleCarouselScroll = () => {
    const track = carouselTrackRef.current;
    if (!track) return;
    const index = Math.round(track.scrollLeft / carouselCardStep());
    setCarouselActive(Math.min(Math.max(index, 0), filteredItems.length - 1));
  };

  const filtersList = (
    <>
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
    </>
  );

  return (
    <section id="noticias" className="relative bg-paper px-6 py-28 text-ink md:px-10 md:py-32">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          <Reveal className="order-2 w-full shrink-0 lg:order-1 lg:w-64">
            {/* Desktop/tablet (>= sm): columna de filtros siempre visible, sin acordeón */}
            <div className="hidden sm:block">
              <h3 className="display-font mb-6 text-2xl font-bold uppercase leading-none text-ink">
                {ui.newsCategories}
              </h3>
              {filtersList}
            </div>

            {/* Mobile (< sm): acordeón colapsable, arranca cerrado */}
            <div className="sm:hidden">
              <button
                type="button"
                onClick={() => setFiltersOpen((open) => !open)}
                aria-expanded={filtersOpen}
                className="flex w-full items-center justify-between gap-3 border-b border-ink/10 pb-4"
              >
                <span className="display-font text-2xl font-bold uppercase leading-none text-ink">
                  {ui.newsCategories}
                </span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-ink transition-transform duration-300 ${
                    filtersOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {filtersOpen && (
                  <motion.div
                    key="news-filters-panel"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="scrollbar-thin-light max-h-[60vh] overflow-y-auto pt-4">{filtersList}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>

          {/* contents en mobile: título, filtros y grilla pasan a ser hermanos
              directos del flex de arriba, así el order de cada uno decide el
              orden visual (título, categorías, cards). Desde lg vuelve a ser
              una columna normal (título + grilla) al lado del sidebar. */}
          <div className="contents lg:flex lg:min-w-0 lg:flex-1 lg:flex-col lg:order-2">
            <Reveal className="order-1 mb-10 border-b border-ink/10 pb-6 lg:order-none">
              <Eyebrow label={ui.newsEyebrow} className="mb-4 max-w-md" />
              <h2 className="display-font text-4xl font-bold uppercase leading-[0.95] text-ink md:text-5xl">
                {ui.newsTitleLead} <span className="text-secondary">{ui.newsTitleAccent}</span>
              </h2>
            </Reveal>

            <div className="order-3 min-w-0 lg:order-none">
            {filteredItems.length > 0 ? (
              <>
                {/* Desktop/tablet (>= sm): grilla paginada, sin cambios */}
                <div className="hidden gap-6 sm:grid sm:grid-cols-2 xl:grid-cols-3">
                  {pageItems.map((item, i) => (
                    <Reveal key={item.slug} delay={i * 0.06}>
                      <NewsCard item={item} logo={site.logo} />
                    </Reveal>
                  ))}
                </div>

                {pageCount > 1 && (
                  <Reveal className="mt-10 hidden items-center justify-center gap-6 sm:flex">
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

                {/* Mobile (< sm): carrusel horizontal, mismo patrón que Academy */}
                <div className="sm:hidden">
                  <div
                    ref={carouselTrackRef}
                    onScroll={handleCarouselScroll}
                    className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2"
                  >
                    {filteredItems.map((item, i) => (
                      <Reveal
                        key={item.slug}
                        delay={i * 0.06}
                        y={0}
                        className="w-[calc(100vw-3rem)] shrink-0 snap-start snap-always"
                      >
                        <NewsCard item={item} logo={site.logo} />
                      </Reveal>
                    ))}
                  </div>

                  {filteredItems.length > 1 && (
                    <Reveal className="mt-8 flex items-center justify-center gap-6">
                      <button
                        type="button"
                        onClick={() => scrollCarouselByCard(-1)}
                        aria-label={ui.previous}
                        className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-ink/10 text-ink/50 transition-colors duration-300 before:absolute before:-inset-1 before:content-[''] hover:border-accent hover:text-accent"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </button>

                      <WindowedDots
                        count={filteredItems.length}
                        active={carouselActive}
                        onSelect={scrollCarouselToIndex}
                        getLabel={(i) => `${ui.goTo} ${filteredItems[i].title}`}
                      />

                      <button
                        type="button"
                        onClick={() => scrollCarouselByCard(1)}
                        aria-label={ui.next}
                        className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-ink/10 text-ink/50 transition-colors duration-300 before:absolute before:-inset-1 before:content-[''] hover:border-accent hover:text-accent"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </Reveal>
                  )}
                </div>
              </>
            ) : (
              <p className="py-16 text-center text-sm text-muted-dark">
                {ui.newsEmpty}
              </p>
            )}
            </div>
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

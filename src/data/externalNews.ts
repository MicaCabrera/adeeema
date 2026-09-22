// Noticias externas de "Actualidad & Prensa": contrato de la API (/api/news) y
// helpers para combinarlas con las noticias propias de ADEEMA (data/news.ts).
import { newsCategoryGroups, type NewsGroup, type NewsItem } from "./news";

/** Lo que devuelve /api/news por cada noticia. Sólo datos reales de la fuente. */
export interface ExternalNewsItem {
  title: string;
  /** Extracto breve tomado del propio artículo; vacío si la fuente no trae uno usable. */
  summary: string;
  /** Nombre de la fuente tal cual se muestra (medio, universidad, organismo). */
  source: string;
  /** ISO yyyy-mm-dd (fecha de publicación original). */
  date: string;
  /** Imagen original de la nota, o null si no tiene una usable. */
  image: string | null;
  /** Enlace al artículo original. */
  url: string;
  /** Siempre una de las subcategorías existentes de newsCategoryGroups. */
  subcategory: string;
}

/** Noticia lista para la card: propia o externa (con fuente y resumen). */
export interface DisplayNewsItem extends NewsItem {
  source?: string;
  summary?: string;
}

const groupBySubcategory = new Map<string, NewsGroup>(
  newsCategoryGroups.flatMap((g) => g.subcategories.map((sub) => [sub, g.group] as const)),
);

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function isHttpUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const { protocol } = new URL(value);
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
}

/** Valida una noticia de la API. Descarta lo que no encaje (nunca crea categorías nuevas). */
export function toDisplayItem(raw: unknown): DisplayNewsItem | null {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Partial<Record<keyof ExternalNewsItem, unknown>>;

  if (typeof r.title !== "string" || !r.title.trim()) return null;
  if (typeof r.date !== "string" || !ISO_DATE.test(r.date)) return null;
  if (!isHttpUrl(r.url)) return null;
  if (typeof r.subcategory !== "string") return null;
  const group = groupBySubcategory.get(r.subcategory);
  if (!group) return null;

  const summary = typeof r.summary === "string" ? r.summary : "";
  return {
    slug: `externa-${r.url}`,
    title: r.title,
    group,
    subcategory: r.subcategory,
    date: r.date,
    image: isHttpUrl(r.image) ? r.image : "",
    content: summary ? [summary] : [],
    externalLink: r.url,
    source: typeof r.source === "string" ? r.source : undefined,
    summary: summary || undefined,
  };
}

/** Propias + externas, más recientes primero. Las propias ganan en empate de fecha. */
export function mergeNews(own: NewsItem[], external: DisplayNewsItem[]): DisplayNewsItem[] {
  return [...own, ...external].sort((a, b) => b.date.localeCompare(a.date));
}

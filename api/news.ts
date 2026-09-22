// Función serverless de Vercel: GET /api/news
//
// Lee un conjunto curado de feeds RSS/Atom de fuentes confiables, se queda con
// lo relevante para el ecosistema ADEEMA (esports, tecnología, innovación, IA,
// educación, universidades, políticas públicas), lo clasifica en las
// subcategorías EXISTENTES de "Actualidad & Prensa", elimina duplicados y
// devuelve JSON. No inventa nada: título, fuente, fecha, imagen y enlace son los
// del artículo original; el resumen es un extracto de su propio texto.
//
// Sin claves ni variables de entorno. El resultado se cachea en el CDN de Vercel
// (s-maxage), así que el contenido se renueva solo, sin tocar código.
//
// Para sumar o quitar una fuente basta editar SOURCES.
import type { IncomingMessage, ServerResponse } from "node:http";

// ─── Contrato (espejo de ExternalNewsItem en src/data/externalNews.ts) ─────────
interface ExternalNewsItem {
  title: string;
  summary: string;
  source: string;
  date: string;
  image: string | null;
  url: string;
  subcategory: string;
}

// ─── Fuentes ───────────────────────────────────────────────────────────────────
// institution: organismo público, universidad o centro de investigación.
// specialized: medio especializado en tecnología, esports o educación.
// media:       medio periodístico generalista.
// trust (0–1) desempata duplicados y pondera el ranking.
type SourceKind = "institution" | "specialized" | "media";

interface Source {
  name: string;
  url: string;
  kind: SourceKind;
  trust: number;
  /** Fuente dedicada a esports: todo lo que publica está en el tema, falta que sea sustancial. */
  esports?: boolean;
}

const SOURCES: Source[] = [
  // Organismos y universidades
  { name: "Argentina.gob.ar", url: "https://www.argentina.gob.ar/rss.xml", kind: "institution", trust: 1 },
  { name: "UNLP", url: "https://unlp.edu.ar/feed/", kind: "institution", trust: 0.95 },
  { name: "UNQ", url: "https://www.unq.edu.ar/feed/", kind: "institution", trust: 0.95 },
  { name: "UNLaM", url: "https://www.unlam.edu.ar/feed/", kind: "institution", trust: 0.95 },
  { name: "ITBA", url: "https://www.itba.edu.ar/feed/", kind: "institution", trust: 0.95 },
  { name: "Exactas UBA", url: "https://exactas.uba.ar/feed/", kind: "institution", trust: 0.95 },
  { name: "MIT News", url: "https://news.mit.edu/rss/feed", kind: "institution", trust: 0.95 },
  // Medios especializados
  { name: "Xataka Argentina", url: "https://www.xataka.com.ar/feedburner.xml", kind: "specialized", trust: 0.85 },
  { name: "Genbeta", url: "https://www.genbeta.com/feedburner.xml", kind: "specialized", trust: 0.8 },
  { name: "Hipertextual", url: "https://hipertextual.com/feed", kind: "specialized", trust: 0.85 },
  { name: "WIRED en Español", url: "https://es.wired.com/feed/rss", kind: "specialized", trust: 0.85 },
  { name: "Esports Insider", url: "https://esportsinsider.com/feed", kind: "specialized", trust: 0.9, esports: true },
  { name: "The Esports Advocate", url: "https://esportsadvocate.net/feed/", kind: "specialized", trust: 0.85, esports: true },
  { name: "Dot Esports", url: "https://dotesports.com/feed", kind: "specialized", trust: 0.8, esports: true },
  // Medios generalistas
  { name: "Infobae", url: "https://www.infobae.com/arc/outboundfeeds/rss/category/tecno/", kind: "media", trust: 0.85 },
  { name: "Infobae", url: "https://www.infobae.com/arc/outboundfeeds/rss/category/educacion/", kind: "media", trust: 0.85 },
  { name: "Clarín", url: "https://www.clarin.com/rss/tecnologia/", kind: "media", trust: 0.85 },
  { name: "La Nación", url: "https://www.lanacion.com.ar/arcio/rss/category/tecnologia/", kind: "media", trust: 0.9 },
  { name: "Ámbito", url: "https://www.ambito.com/rss/pages/tecnologia.xml", kind: "media", trust: 0.8 },
  { name: "iProfesional", url: "https://www.iprofesional.com/rss/tecnologia", kind: "media", trust: 0.75 },
  { name: "El País", url: "https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/tecnologia/portada", kind: "media", trust: 0.9 },
  { name: "El País", url: "https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/ciencia/portada", kind: "media", trust: 0.9 },
  { name: "Expansión", url: "https://e00-expansion.uecdn.es/rss/tecnologia.xml", kind: "media", trust: 0.85 },
];

// ─── Parámetros de curaduría ───────────────────────────────────────────────────
const MAX_AGE_DAYS = 45;
const MAX_ITEMS = 24;
const MAX_PER_SOURCE = 4;
const MAX_FEATURED = 3;
const MIN_SCORE = 5;
const FEATURED_MIN_SCORE = 9;
const FEED_TIMEOUT_MS = 6000;
const MEMORY_TTL_MS = 15 * 60 * 1000;

// Subcategorías existentes de la sección (src/data/news.ts). No se crean otras.
const SUB = {
  featured: "Destacados",
  news: "Novedades",
  events: "Eventos",
  pressNotes: "Notas de prensa",
  inMedia: "En los medios",
  statements: "Comunicados",
} as const;

// ─── Utilidades de texto ───────────────────────────────────────────────────────
const NAMED_ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", hellip: "…", ndash: "–", mdash: "—",
  lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”", laquo: "«", raquo: "»", iexcl: "¡", iquest: "¿",
  aacute: "á", eacute: "é", iacute: "í", oacute: "ó", uacute: "ú", ntilde: "ñ", uuml: "ü",
  Aacute: "Á", Eacute: "É", Iacute: "Í", Oacute: "Ó", Uacute: "Ú", Ntilde: "Ñ", Uuml: "Ü",
  copy: "©", reg: "®", deg: "°", middot: "·", bull: "•",
};

function decodeEntities(input: string): string {
  return input.replace(/&(#x[0-9a-f]+|#\d+|[a-z][a-z0-9]*);/gi, (match, body: string) => {
    if (body[0] === "#") {
      const code = body[1].toLowerCase() === "x" ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10);
      return Number.isFinite(code) && code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : match;
    }
    return NAMED_ENTITIES[body] ?? match;
  });
}

function unwrapCdata(input: string): string {
  return input.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
}

function stripTags(html: string): string {
  return html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<\/(p|div|li|h[1-6]|br)>|<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ");
}

function toPlainText(raw: string): string {
  return decodeEntities(stripTags(decodeEntities(unwrapCdata(raw)))).replace(/\s+/g, " ").trim();
}

/** Minúsculas y sin acentos, para comparar y buscar palabras clave. */
function normalize(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

// ─── Parser RSS / Atom ─────────────────────────────────────────────────────────
interface RawEntry {
  title: string;
  link: string;
  date: Date | null;
  description: string;
  content: string;
  image: string | null;
}

function tagContent(block: string, tag: string): string | null {
  const re = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, "i");
  const m = block.match(re);
  return m ? m[1] : null;
}

function attr(tagSource: string, name: string): string | null {
  const m = tagSource.match(new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i"));
  return m ? decodeEntities(m[2] ?? m[3] ?? "") : null;
}

const IMAGE_EXT = /\.(?:jpe?g|png|webp|avif|gif)(?:[?#]|$)/i;

function cleanImageUrl(candidate: string | null, base: string): string | null {
  if (!candidate) return null;
  try {
    const url = new URL(decodeEntities(candidate.trim()), base);
    if (url.protocol === "http:") url.protocol = "https:";
    if (url.protocol !== "https:") return null;
    if (/(pixel|spacer|blank|1x1|feedburner|doubleclick|\/ads?\/|logo)/i.test(url.href)) return null;
    if (/\.(?:svg|ico)(?:[?#]|$)/i.test(url.pathname)) return null;
    return url.href;
  } catch {
    return null;
  }
}

function extractImage(block: string, html: string, base: string): string | null {
  for (const m of block.matchAll(/<(?:enclosure|media:content|media:thumbnail)\b[^>]*>/gi)) {
    const tag = m[0];
    const url = attr(tag, "url");
    const type = attr(tag, "type") ?? "";
    const medium = attr(tag, "medium") ?? "";
    const isImage = type.startsWith("image/") || medium === "image" || (!type && !medium && IMAGE_EXT.test(url ?? ""));
    if (!isImage && !/^<media:thumbnail/i.test(tag)) continue;
    const clean = cleanImageUrl(url, base);
    if (clean) return clean;
  }
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = m[0];
    const width = Number(attr(tag, "width") ?? "");
    if (width && width < 120) continue;
    const clean = cleanImageUrl(attr(tag, "src") ?? attr(tag, "data-src"), base);
    if (clean) return clean;
  }
  return null;
}

function parseFeed(xml: string): RawEntry[] {
  const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>|<entry[\s>][\s\S]*?<\/entry>/gi) ?? [];
  const entries: RawEntry[] = [];

  for (const block of blocks) {
    const title = toPlainText(tagContent(block, "title") ?? "");

    let link = "";
    const atomLink = [...block.matchAll(/<link\b[^>]*>/gi)]
      .map((m) => m[0])
      .find((tag) => /href=/i.test(tag) && !/rel\s*=\s*["'](?:self|enclosure|replies)["']/i.test(tag));
    if (atomLink) link = attr(atomLink, "href") ?? "";
    if (!link) link = toPlainText(tagContent(block, "link") ?? "");
    if (!link) {
      const guid = tagContent(block, "guid");
      if (guid && /^https?:\/\//i.test(toPlainText(guid))) link = toPlainText(guid);
    }
    if (!title || !/^https?:\/\//i.test(link)) continue;

    const rawDate =
      tagContent(block, "pubDate") ?? tagContent(block, "published") ?? tagContent(block, "dc:date") ?? tagContent(block, "updated");
    const parsed = rawDate ? new Date(toPlainText(rawDate)) : null;
    const date = parsed && !Number.isNaN(parsed.getTime()) ? parsed : null;

    const descriptionRaw = unwrapCdata(tagContent(block, "description") ?? tagContent(block, "summary") ?? "");
    const contentRaw = unwrapCdata(tagContent(block, "content:encoded") ?? tagContent(block, "content") ?? "");

    entries.push({
      title,
      link,
      date,
      description: toPlainText(descriptionRaw),
      content: toPlainText(contentRaw),
      image: extractImage(block, decodeEntities(contentRaw || descriptionRaw), link),
    });
  }
  return entries;
}

// ─── Resumen ───────────────────────────────────────────────────────────────────
const SUMMARY_MAX = 200;

function buildSummary(entry: RawEntry): string {
  const title = normalize(entry.title);
  for (const candidate of [entry.description, entry.content]) {
    let text = candidate
      .replace(/\s*(?:The post|La entrada|El artículo|The article)\b[\s\S]*?(?:appeared first on|se publicó primero en|apareció primero en)[\s\S]*$/i, "")
      .replace(/\s*\[(?:…|\.\.\.)\]\s*$/, "")
      .replace(/\s*(?:Leer más|Seguir leyendo|Read more|Continue reading)\.?\s*»?$/i, "")
      .trim();
    if (text.length < 40) continue;
    const plain = normalize(text);
    if (plain === title || plain.startsWith(title) && plain.length - title.length < 30) continue;
    if (/^resumen\s?semanal/i.test(text)) continue;

    if (text.length > SUMMARY_MAX) {
      const cut = text.slice(0, SUMMARY_MAX);
      const stop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("? "), cut.lastIndexOf("! "));
      text = stop > SUMMARY_MAX * 0.5 ? cut.slice(0, stop + 1) : `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,;:–—-]+$/, "")}…`;
    }
    return text;
  }
  return "";
}

// ─── Relevancia ────────────────────────────────────────────────────────────────
// Puntaje por contenido (título pesa doble). Tres niveles: términos núcleo del
// ecosistema (3 y 2) y términos de contexto (1). Hace falta al menos un término
// núcleo: hablar de "universidad" o de "videojuegos" solos no alcanza.
type Term = [pattern: string, weight: number];

const TERMS: Term[] = [
  // núcleo fuerte
  ["e-?sports?", 3], ["deportes? electronicos?", 3], ["gaming competitivo", 3], ["competitive gaming", 3],
  ["videojuegos? (?:competitiv\\w+|educativ\\w+)", 3], ["industria (?:de los |del |de )?videojuegos", 3],
  ["desarrollo de videojuegos", 3], ["game development", 3],
  ["inteligencia artificial", 3], ["artificial intelligence", 3], ["machine learning", 3],
  ["aprendizaje automatico", 3], ["robotic\\w*", 3], ["semiconductor\\w*", 3],
  ["supercomputador\\w*", 3], ["supercomputer\\w*", 3], ["computacion cuantica", 3], ["quantum comput\\w+", 3],
  ["ciberseguridad", 3], ["cybersecurity", 3], ["hackathon", 3], ["innovacion tecnologica", 3],
  ["educacion tecnologica", 3], ["alfabetizacion digital", 3], ["programacion", 3],
  ["pensamiento computacional", 3], ["realidad (?:virtual|aumentada)", 3], ["metaverso", 3],
  ["impresion 3d", 3], ["internet de las cosas", 3], ["chatgpt", 3], ["openai", 3],
  ["modelos? de lenguaje", 3], ["large language model\\w*", 3],
  // núcleo medio
  ["tecnolog\\w+", 2], ["technolog\\w+", 2], ["innovacion", 2], ["innovation", 2], ["digital\\w*", 2],
  ["software", 2], ["startups?", 2], ["emprendedor\\w*", 2], ["ia", 2], ["ai", 2], ["algoritmos?", 2],
  ["algorithms?", 2], ["nube", 2], ["cloud", 2], ["5g", 2], ["blockchain", 2], ["chips?", 2],
  ["ingenieri\\w+", 2], ["engineer\\w*", 2], ["laboratorios?", 2], ["robots?", 2], ["drones?", 2],
  // contexto
  ["universidad\\w*", 1], ["universit\\w+", 1], ["facultad\\w*", 1], ["educacion", 1], ["education", 1],
  ["educativ\\w+", 1], ["formacion", 1], ["capacitacion", 1], ["escuelas?", 1], ["schools?", 1],
  ["docentes?", 1], ["estudiantes?", 1], ["students?", 1], ["investigaci\\w+", 1], ["investigadores?", 1],
  ["research\\w*", 1], ["ciencia", 1], ["cientific\\w+", 1], ["science", 1], ["becas?", 1],
  ["scholarship\\w*", 1], ["competencias?", 1], ["competitions?", 1], ["torneos?", 1], ["tournaments?", 1],
  ["campeonatos?", 1], ["championships?", 1], ["convenio", 1], ["politicas? publicas?", 1],
  ["federacion", 1], ["federation", 1], ["asociacion", 1], ["association", 1], ["videojuegos?", 1],
  ["gaming", 1], ["gamers?", 1], ["data", 1], ["datos", 1],
];

// Complementa a las fuentes de esports: qué las vuelve sustanciales (no sólo el
// transfer de un jugador o el parche de un juego).
const ESPORTS_CONTEXT: Term[] = [
  ["tournaments?", 2], ["championships?", 2], ["leagues?", 2], ["federation", 2], ["association", 2],
  ["government", 2], ["ministry", 2], ["universit\\w+", 2], ["college", 2], ["schools?", 2],
  ["education\\w*", 2], ["scholarship\\w*", 2], ["partnership", 2], ["sponsor\\w*", 2],
  ["investment", 2], ["funding", 2], ["regulation", 2], ["olympic\\w*", 2], ["industry", 2],
  ["revenue", 2], ["viewership", 2], ["talent", 2], ["academy", 2],
];

const REJECT_PATTERNS = [
  "apuestas?", "casinos?", "betting", "sportsbook", "bookmaker\\w*", "sorteo", "horoscop\\w+",
  "rumou?r\\w*", "se filtra", "filtracion", "filtran", "leak\\w*",
];

const NOISE_PATTERNS = [
  "como (?:activar|evitar|saber|recuperar|borrar|ver|hacer|usar|configurar|proteger|instalar|cambiar|descargar|desactivar|eliminar)",
  "trucos?", "whatsapp", "ofertas?", "descuentos?", "cyber monday", "hot sale", "iphone", "galaxy",
  "netflix", "hbo", "disney", "pelicula\\w*", "estreno\\w*", "harry potter", "futbol", "receta\\w*",
  "famos[oa]s?", "celebridad\\w*", "how to", "best deals", "gmail", "guia", "guide", "tier list",
  "banners?", "gacha", "loadout", "walkthrough", "codes?",
];

// Señal de que la nota trata sobre un evento / competencia / convocatoria.
const EVENT_PATTERNS = [
  "torneos?", "campeonatos?", "copas?", "mundial\\w*", "eventos?", "ferias?", "congresos?", "jornadas?",
  "cumbre", "summit", "hackathon", "festival\\w*", "expo\\b", "convocatoria\\w*", "inscripciones?",
  "tournaments?", "championships?", "conference", "bootcamp", "olimpiadas?", "competencias?",
  "competition", "lan party", "major",
];

// Señal de comunicado oficial (sólo para organismos y universidades).
const STATEMENT_PATTERNS = [
  "comunicad\\w*", "acuerdo", "convenio", "resolucion", "firma(?:n|ron)?", "declaracion", "designa\\w*",
  "lanza(?:n|miento)?", "lanzo", "programa", "plan nacional", "ley", "decreto", "creacion", "inaugura\\w*",
  "anuncia\\w*",
];

const compile = (patterns: string[]) => new RegExp(`(?<![a-z0-9])(?:${patterns.join("|")})(?![a-z0-9])`);
const REJECT_RE = compile(REJECT_PATTERNS);
const NOISE_RE = compile(NOISE_PATTERNS);
const EVENT_RE = compile(EVENT_PATTERNS);
const STATEMENT_RE = compile(STATEMENT_PATTERNS);

const compileTerms = (terms: Term[]) =>
  terms.map(([pattern, weight]) => ({ re: new RegExp(`(?<![a-z0-9])(?:${pattern})(?![a-z0-9])`), weight }));
const TERM_RES = compileTerms(TERMS);
const ESPORTS_RES = compileTerms(ESPORTS_CONTEXT);

interface Relevance {
  score: number;
  coreInTitle: boolean;
  hasCore: boolean;
}

function scoreRelevance(title: string, summary: string, source: Source): Relevance | null {
  const t = normalize(title);
  const s = normalize(summary);
  if (REJECT_RE.test(t) || REJECT_RE.test(s)) return null;

  let score = 0;
  let hasCore = false;
  let coreInTitle = false;

  const apply = (list: { re: RegExp; weight: number }[]) => {
    for (const { re, weight } of list) {
      const inTitle = re.test(t);
      if (!inTitle && !re.test(s)) continue;
      score += inTitle ? weight * 2 : weight;
      if (weight >= 2) {
        hasCore = true;
        if (inTitle) coreInTitle = true;
      }
    }
  };

  apply(TERM_RES);
  if (source.esports) {
    score += 3;
    hasCore = true;
    apply(ESPORTS_RES);
  }
  if (NOISE_RE.test(t)) score -= 5;
  else if (NOISE_RE.test(s)) score -= 2;

  return { score, coreInTitle, hasCore };
}

// ─── Duplicados ────────────────────────────────────────────────────────────────
function canonicalUrl(href: string): string {
  try {
    const url = new URL(href);
    for (const key of [...url.searchParams.keys()]) {
      if (/^(utm_|fbclid|gclid|mc_|ref$|source$)/i.test(key)) url.searchParams.delete(key);
    }
    url.hash = "";
    return `${url.hostname.replace(/^www\./, "")}${url.pathname.replace(/\/+$/, "")}${url.search}`.toLowerCase();
  } catch {
    return href.toLowerCase();
  }
}

const STOPWORDS = new Set(
  "de la el en y a los las un una por con para que se del al su sus es lo como mas pero the of and to in for on with is are at by an from its it this that".split(" "),
);

function titleTokens(title: string): Set<string> {
  return new Set(
    normalize(title)
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOPWORDS.has(w)),
  );
}

function similar(a: Set<string>, b: Set<string>): boolean {
  if (a.size < 3 || b.size < 3) return false;
  let shared = 0;
  for (const w of a) if (b.has(w)) shared++;
  const union = a.size + b.size - shared;
  const containment = shared / Math.min(a.size, b.size);
  return shared / union >= 0.6 || (containment >= 0.85 && shared >= 4);
}

// ─── Pipeline ──────────────────────────────────────────────────────────────────
interface Candidate {
  source: Source;
  title: string;
  summary: string;
  url: string;
  date: Date;
  image: string | null;
  relevance: Relevance;
  rank: number;
  tokens: Set<string>;
  canonical: string;
}

const DAY_MS = 24 * 60 * 60 * 1000;
const ISO_FORMAT = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Argentina/Buenos_Aires" });

async function fetchFeed(source: Source): Promise<RawEntry[]> {
  const res = await fetch(source.url, {
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; ADEEMA-NewsBot/1.0; +https://adeema.org.ar)",
      accept: "application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.5",
    },
    signal: AbortSignal.timeout(FEED_TIMEOUT_MS),
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`${source.name}: HTTP ${res.status}`);
  return parseFeed(await res.text());
}

function classify(c: Candidate): string {
  const text = normalize(c.title);
  if (EVENT_RE.test(text)) return SUB.events;
  if (c.source.kind === "institution") return STATEMENT_RE.test(text) ? SUB.statements : SUB.pressNotes;
  return c.source.kind === "specialized" ? SUB.news : SUB.inMedia;
}

async function buildNews(): Promise<ExternalNewsItem[]> {
  const now = Date.now();
  const results = await Promise.allSettled(SOURCES.map((s) => fetchFeed(s)));

  const candidates: Candidate[] = [];
  results.forEach((result, i) => {
    if (result.status !== "fulfilled") return;
    const source = SOURCES[i];
    for (const entry of result.value) {
      if (!entry.date) continue;
      const age = (now - entry.date.getTime()) / DAY_MS;
      if (age > MAX_AGE_DAYS || age < -1) continue;
      const published = age < 0 ? new Date(now) : entry.date;

      const summary = buildSummary(entry);
      const relevance = scoreRelevance(entry.title, summary || entry.content.slice(0, 400), source);
      if (!relevance || !relevance.hasCore || relevance.score < MIN_SCORE) continue;
      if (!relevance.coreInTitle && relevance.score < MIN_SCORE + 2) continue;

      const freshness = Math.max(0, 4 * (1 - Math.max(age, 0) / 30));
      candidates.push({
        source,
        title: entry.title,
        summary,
        url: entry.link,
        date: published,
        image: entry.image,
        relevance,
        rank: relevance.score * source.trust + freshness,
        tokens: titleTokens(entry.title),
        canonical: canonicalUrl(entry.link),
      });
    }
  });

  // Duplicados: se conserva la fuente más confiable (luego la más antigua = la original).
  candidates.sort((a, b) => b.source.trust - a.source.trust || a.date.getTime() - b.date.getTime());
  const unique: Candidate[] = [];
  for (const c of candidates) {
    const dup = unique.find((u) => u.canonical === c.canonical || similar(u.tokens, c.tokens));
    if (dup) {
      dup.image ??= c.image;
      continue;
    }
    unique.push(c);
  }

  // Calidad sobre cantidad: mejores primero, con tope por fuente y en total.
  unique.sort((a, b) => b.rank - a.rank);
  const perSource = new Map<string, number>();
  const selected: Candidate[] = [];
  for (const c of unique) {
    const used = perSource.get(c.source.name) ?? 0;
    if (used >= MAX_PER_SOURCE) continue;
    perSource.set(c.source.name, used + 1);
    selected.push(c);
    if (selected.length >= MAX_ITEMS) break;
  }

  const featured = new Set(
    selected
      .filter((c) => c.relevance.score >= FEATURED_MIN_SCORE && c.source.trust >= 0.85 && !EVENT_RE.test(normalize(c.title)))
      .slice(0, MAX_FEATURED),
  );

  return selected
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .map((c) => ({
      title: c.title,
      summary: c.summary,
      source: c.source.name,
      date: ISO_FORMAT.format(c.date),
      image: c.image,
      url: c.url,
      subcategory: featured.has(c) ? SUB.featured : classify(c),
    }));
}

// Caché en memoria de la instancia (útil en dev y en instancias "tibias"); el
// caché real de producción es el del CDN, vía Cache-Control.
let memory: { at: number; items: ExternalNewsItem[] } | null = null;

async function getNews(): Promise<ExternalNewsItem[]> {
  if (memory && Date.now() - memory.at < MEMORY_TTL_MS) return memory.items;
  const items = await buildNews();
  if (items.length > 0) memory = { at: Date.now(), items };
  return items.length > 0 ? items : (memory?.items ?? []);
}

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.statusCode = 405;
    res.setHeader("Allow", "GET, HEAD");
    res.end();
    return;
  }

  try {
    const items = await getNews();
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    // Renovación automática: el CDN sirve la copia por 30 min y, pasado ese
    // tiempo, entrega la anterior mientras regenera en segundo plano.
    res.setHeader(
      "Cache-Control",
      items.length > 0
        ? "public, max-age=300, s-maxage=1800, stale-while-revalidate=43200"
        : "public, max-age=0, s-maxage=60",
    );
    res.end(req.method === "HEAD" ? undefined : JSON.stringify({ generatedAt: new Date().toISOString(), items }));
  } catch {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=0, s-maxage=60");
    res.end(JSON.stringify({ generatedAt: new Date().toISOString(), items: [] }));
  }
}

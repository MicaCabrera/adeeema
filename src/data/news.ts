// Colección "Noticias" de la sección Actualidad y Prensa.
// Contenido provisional de ejemplo — reemplazar por las noticias reales de ADEEMA.

export type NewsGroup = "Actualidad" | "Prensa" | "Social Updates";

export interface NewsCategoryGroup {
  group: NewsGroup;
  subcategories: string[];
}

export const newsCategoryGroups: NewsCategoryGroup[] = [
  { group: "Actualidad", subcategories: ["Destacados", "Novedades", "Eventos"] },
  { group: "Prensa", subcategories: ["Notas de prensa", "En los medios", "Comunicados"] },
  { group: "Social Updates", subcategories: ["LinkedIn", "Instagram"] },
];

export interface NewsItem {
  slug: string;
  title: string;
  group: NewsGroup;
  subcategory: string;
  /** ISO date (yyyy-mm-dd), usada para ordenar y para generar la fecha visible. */
  date: string;
  image: string;
  /** Cuerpo de la noticia, un párrafo por elemento. */
  content: string[];
  /** Sólo para novedades de redes sociales: enlace a la publicación original. */
  externalLink?: string;
}

export const newsItems: NewsItem[] = [
  {
    slug: "adeema-consolida-red-alianzas-federales",
    title: "ADEEMA consolida su red de alianzas estratégicas y convenios federales.",
    group: "Actualidad",
    subcategory: "Destacados",
    date: "2026-09-18",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80",
    content: [
      "ADEEMA anunció la ampliación de su red de alianzas estratégicas, sumando nuevos convenios con instituciones de distintas provincias del país.",
      "El objetivo es fortalecer el desarrollo del ecosistema de deportes electrónicos y electromecánicos a nivel federal, articulando gobierno, educación y sector privado.",
      "En los próximos meses se anunciarán las primeras actividades conjuntas surgidas de estos acuerdos.",
    ],
  },
  {
    slug: "adeema-comunicado-nuevo-consejo-directivo",
    title: "ADEEMA comunica la conformación de su nuevo Consejo Directivo.",
    group: "Prensa",
    subcategory: "Comunicados",
    date: "2026-09-10",
    image: "https://images.unsplash.com/photo-1560439514-4e9645039924?auto=format&fit=crop&w=800&q=80",
    content: [
      "La asociación informa a sus socios e instituciones vinculadas la conformación de su nuevo Consejo Directivo para el próximo período.",
      "El nuevo consejo continuará impulsando los programas de formación, articulación institucional y desarrollo del ecosistema tecnológico nacional.",
    ],
  },
  {
    slug: "encuentros-en-territorio-gira-jornadas",
    title: "Encuentros en Territorio: agenda de jornadas presenciales en todo el país.",
    group: "Actualidad",
    subcategory: "Eventos",
    date: "2026-09-02",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
    content: [
      "ADEEMA presenta la nueva agenda de \"Encuentros en Territorio\", un ciclo de jornadas presenciales que recorrerá distintas provincias durante los próximos meses.",
      "Cada encuentro reunirá a instituciones educativas, gobiernos locales y comunidades para compartir experiencias sobre el desarrollo del ecosistema gamer y tecnológico.",
      "La inscripción para las primeras sedes ya se encuentra abierta a través del sitio de la Academy.",
    ],
  },
  {
    slug: "adeema-nota-prensa-medios-nacionales",
    title: "ADEEMA fue consultada por medios nacionales sobre el crecimiento de los esports.",
    group: "Prensa",
    subcategory: "Notas de prensa",
    date: "2026-08-20",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80",
    content: [
      "Referentes de ADEEMA fueron entrevistados por medios de alcance nacional para analizar el crecimiento sostenido de los deportes electrónicos en Argentina.",
      "Durante las notas se destacó el rol de la asociación en la profesionalización del sector y en la articulación con instituciones educativas.",
    ],
  },
  {
    slug: "resumen-linkedin-comunidad-adeema",
    title: "Resumen semanal: así estuvo la comunidad de ADEEMA en LinkedIn.",
    group: "Social Updates",
    subcategory: "LinkedIn",
    date: "2026-08-12",
    image: "https://images.unsplash.com/photo-1611944212129-29977ae1398c?auto=format&fit=crop&w=800&q=80",
    content: [
      "Repasamos las publicaciones más destacadas de la semana en el LinkedIn oficial de ADEEMA, con novedades institucionales y contenido de la comunidad.",
    ],
    externalLink: "https://www.linkedin.com/company/adeema/posts/?feedView=all",
  },
  {
    slug: "nueva-convocatoria-adeema-academy",
    title: "Se abrió una nueva convocatoria de cursos en ADEEMA Academy.",
    group: "Actualidad",
    subcategory: "Novedades",
    date: "2026-08-05",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    content: [
      "ADEEMA Academy abrió una nueva convocatoria de cursos especializados orientados a fortalecer las competencias del ecosistema tech, académico y cultural.",
      "Las inscripciones están disponibles en el sitio de la Academy y permanecerán abiertas hasta agotar cupos.",
    ],
  },
];

export function getNewsItemsSorted(): NewsItem[] {
  return [...newsItems].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getNewsItemBySlug(slug: string): NewsItem | undefined {
  return newsItems.find((item) => item.slug === slug);
}

const MONTHS_ES = [
  "ENERO",
  "FEBRERO",
  "MARZO",
  "ABRIL",
  "MAYO",
  "JUNIO",
  "JULIO",
  "AGOSTO",
  "SEPTIEMBRE",
  "OCTUBRE",
  "NOVIEMBRE",
  "DICIEMBRE",
];

/** Formatea "2026-09-18" como "18 SEPTIEMBRE, 2026". */
export function formatNewsDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} ${MONTHS_ES[month - 1]}, ${year}`;
}

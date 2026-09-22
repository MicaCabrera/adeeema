// Contenido extraído del sitio real de ADEEMA (https://adeema-three.vercel.app/)
// No inventar copy nuevo acá: sólo reorganizar/adaptar el texto existente al nuevo layout.

export const site = {
  name: "ADEEMA",
  description:
    "ADEEMA - Asociación de Deportes Electrónicos y Electromecánicos de Argentina. Impulsamos el ecosistema deportivo tecnológico nacional.",
  logo: "/adeema-logo.png",
  social: {
    instagram: "https://www.instagram.com/adeemaoficial/",
    linkedin: "https://www.linkedin.com/company/adeema/posts/?feedView=all",
  },
};

export const nav = [
  { label: "Institucional", href: "#institucional" },
  { label: "Academy", href: "#academy" },
  { label: "Media", href: "#media" },
  { label: "Comunidad", href: "#comunidad" },
  { label: "Noticias", href: "#noticias" },
  { label: "Contacto", href: "#contacto" },
];

export const hero = {
  kicker: "Impulsando el ecosistema tecnológico, académico y cultural del futuro.",
  titleLines: ["ADE", "EMA"], // "ADE" en outline + "EMA" sólido, sobre una misma línea ("ADEEMA")
  ctaPrimary: { label: "SUMATE", href: "#institucional" },
  ctaSecondary: { label: "Explorar Academy", href: "#academy" },
};

export const institutional = {
  eyebrow: "Quiénes somos",
  headingParts: ["Tecnología,", "conocimiento", "y comunidad."],
  paragraph:
    "ADEEMA impulsa el impacto del gaming y las nuevas tecnologías en la sociedad. Articulamos comunidades, universidades, empresas e instituciones para conectar conocimiento, innovación y oportunidades, fortaleciendo las capacidades necesarias para el futuro.",
  ctaLabel: "Conocer más",
};

// `image` de cada item: placeholder temático (no random) de Unsplash, curado
// a mano por temática mientras no haya foto real del cliente para ese rubro.
// Reemplazo cuando llegue la definitiva: pisar el string de `image` acá
// (o subir el archivo a /public y usar esa ruta) — ningún componente
// necesita tocarse, todos leen `item.image` desde acá.
export const network = {
  eyebrow: "Red de articulación",
  headingParts: ["Red de", "articulación"],
  items: [
    {
      index: "01",
      title: "Municipios y Gobiernos",
      description: "Acercamos innovación, tecnología y formación a comunidades de todo el país.",
      image: "https://images.unsplash.com/photo-1627397159237-d2acb7f500af?auto=format&fit=crop&w=1200&q=80",
    },
    {
      index: "02",
      title: "Cámaras Empresariales e Instituciones",
      description: "Generamos alianzas y proyectos que fortalecen el desarrollo empresarial e institucional.",
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80",
    },
    {
      index: "03",
      title: "Universidades y Colegios",
      description: "Conectamos educación, conocimiento e innovación para crear nuevas oportunidades de formación.",
      image: "https://images.unsplash.com/photo-1616428394230-ba242d33e3ba?auto=format&fit=crop&w=1200&q=80",
    },
    {
      index: "04",
      title: "Centros Tech e Incubadoras",
      description: "Potenciamos talento, proyectos y emprendimientos que impulsan el futuro tecnológico.",
      image: "https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?auto=format&fit=crop&w=1200&q=80",
    },
    {
      index: "05",
      title: "Organismos y Asociaciones",
      description: "Articulamos cooperación y alianzas para desarrollar iniciativas de impacto nacional e internacional.",
      image: "https://images.unsplash.com/photo-1591453214154-c95db71dbd83?auto=format&fit=crop&w=1200&q=80",
    },
    {
      index: "06",
      title: "Empresas Tech y Sponsors",
      description: "Creamos oportunidades de colaboración, visibilidad y participación en nuevas iniciativas tecnológicas.",
      image: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?auto=format&fit=crop&w=1200&q=80",
    },
  ],
};

// `image`: placeholder temático de Unsplash (equipo/tecnología/comunidad),
// no random. Reemplazar acá cuando haya foto real — ver nota en `network`.
export const mission = {
  eyebrow: "Nosotros",
  label: "Misión",
  title: "Impulsar las competencias del futuro en Argentina.",
  paragraph:
    "Creamos programas de formación, comunidades y espacios de articulación que conectan conocimiento, tecnología y oportunidades para fortalecer el desarrollo sostenible del ecosistema en todo el país.",
  image:
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80",
};

export const vision = {
  eyebrow: "Nosotros",
  label: "Visión",
  title: "Ser una organización de referencia en la región.",
  paragraph:
    "Impulsamos la investigación, el desarrollo y la articulación en torno al gaming, los esports y la innovación tecnológica, conectando nuevas generaciones, educación y tecnología con una mirada federal y de largo plazo.",
  image:
    "https://images.unsplash.com/photo-1542323228-002ac256e7b8?auto=format&fit=crop&w=2000&q=80",
};

// `image` de cada item: placeholder temático de Unsplash — ver nota en `network`.
export const academy = {
  eyebrow: "Educación",
  paragraph:
    "El espacio de formación del ecosistema. Programas educativos estructurados para capacitar a las nuevas generaciones, profesionales y organizaciones en las competencias del futuro e innovación.",
  tag: "Academy",
  items: [
    {
      index: "01",
      title: "Cursos Especializados",
      description:
        "Trayectos formativos enfocados en herramientas clave, gestión del entorno tecnológico y habilidades técnicas demandadas por el sector.",
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80",
    },
    {
      index: "02",
      title: "Diplomaturas Institucionales",
      description:
        "Programas de formación continua con respaldo académico para profesionalizar la industria del gaming y los esports de manera sostenible.",
      image: "https://images.unsplash.com/photo-1664382953481-141e97ad9825?auto=format&fit=crop&w=1200&q=80",
    },
    {
      index: "03",
      title: "Charlas & ADEEMA Talks",
      description:
        "Ciclos de conferencias y masterclasses abiertas con expertos del sector, analizando el impacto educativo y social de la tecnología.",
      image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=1200&q=80",
    },
    {
      index: "04",
      title: "Programas de Innovación",
      description:
        "Espacios de aceleración de conocimiento orientados al desarrollo de talento joven, transformación y capacidades tecnológicas aplicadas.",
      image: "https://images.unsplash.com/photo-1519241047957-be31d7379a5d?auto=format&fit=crop&w=1200&q=80",
    },
  ],
};

// `image` de cada item: placeholder temático de Unsplash — ver nota en `network`.
export const media = {
  eyebrow: "Adeema Media",
  paragraph:
    "Conectando audiencias a través de contenidos estratégicos, streaming y producciones audiovisuales sobre innovación y cultura del gaming.",
  items: [
    {
      index: "01",
      title: "Transmisiones en Vivo / Streaming",
      description:
        "Programación institucional en directo junto a referentes del sector, conversando sobre gaming, innovación, educación y nuevas generaciones.",
      image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=1200&q=80",
    },
    {
      index: "02",
      title: "Ciclos de Entrevistas",
      description:
        "Charlas profundas con líderes de la industria, académicos y tomadores de decisión que impulsan el desarrollo.",
      image: "https://images.unsplash.com/photo-1615458318132-1f151a3d18f4?auto=format&fit=crop&w=1200&q=80",
    },
    {
      index: "03",
      title: "Contenido Audiovisual",
      description:
        "Resúmenes, contenidos en formato corto y material interactivo diseñado para plataformas digitales.",
      image: "https://images.unsplash.com/photo-1497015289639-54688650d173?auto=format&fit=crop&w=1200&q=80",
    },
    {
      index: "04",
      title: "Cobertura de Eventos",
      description:
        "Difusión audiovisual de las activaciones presenciales, jornadas de vinculación y encuentros de la asociación.",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
    },
  ],
};

export const fan = {
  eyebrow: "Área FAN",
  titleParts: ["Una", "comunidad", "para", "seguir", "conectados"],
  paragraph:
    "Novedades, alertas y contenido exclusivo del ecosistema tech, académico y cultural de ADEEMA, directo en tu correo.",
  cta: "Sumarme",
  consent: "Acepto recibir el newsletter de ADEEMA.",
  note: "Tus datos están protegidos. Podés darte de baja cuando quieras.",
  success: "¡Gracias por sumarte!",
};

export const contact = {
  eyebrow: "Contacto",
  title: "Vinculación Institucional",
  paragraph:
    "¿Querés sumar a tu organización, proponer una alianza estratégica o conocer más sobre nuestros programas?",
  ctaLabel: "Iniciar conversación",
  form: {
    title: "Vinculación Institucional",
    subtitle: "Contanos qué necesitás.",
    fields: {
      name: "Nombre y Apellido / Institución o Empresa",
      email: "Email",
      reason: "Motivo de la Consulta",
      reasonPlaceholder: "Seleccionar…",
      // "value" es una clave estable, igual en todos los idiomas; solo "label" se traduce.
      reasonOptions: [
        { value: "alliances", label: "Alianzas y Convenios Marco" },
        { value: "sponsorship", label: "Patrocinio y Sponsors" },
        { value: "academy", label: "Consultas de Academy" },
        { value: "press", label: "Prensa y Media" },
      ],
      message: "Mensaje / Propuesta",
    },
    submit: "Enviar",
  },
  success: {
    title: "¡Gracias por tu mensaje!",
    paragraph: "Nuestro equipo de relaciones institucionales se va a contactar a la brevedad.",
  },
};

export const newsDetail = {
  notFound: "No encontramos esta noticia.",
};

export const footer = {
  description: "Asociación de Deportes Electrónicos y Electromecánicos de Argentina.",
  email: "contacto@adeema.org.ar",
  navTitle: "Navegación",
  navLinks: [
    { label: "Quiénes somos", href: "#institucional" },
    { label: "Misión y Visión", href: "#mision-vision" },
    { label: "ADEEMA Academy", href: "#academy" },
    { label: "ADEEMA Media", href: "#media" },
    { label: "Comunidad", href: "#comunidad" },
    { label: "Noticias", href: "#noticias" },
    { label: "Contacto", href: "#contacto" },
  ],
  socialTitle: "Social",
  // href "#": todavía no hay página para ese link (ver Política de privacidad).
  legal: [
    { label: "Términos y condiciones", href: "/legal/terminos" },
    { label: "Política de privacidad", href: "#" },
  ],
  backToTop: "Volver arriba",
  copyright: `© ${new Date().getFullYear()} ADEEMA. Todos los derechos reservados.`,
};

// Páginas legales (Términos y Condiciones, Política de Privacidad) — el
// mismo componente Legal.tsx (src/components/Legal.tsx) renderiza
// cualquier clave de acá según la ruta /legal/:page.
export interface LegalSection {
  heading: string;
  paragraphs: string[];
}

export interface LegalPage {
  title: string;
  lastUpdated: string;
  intro: string[];
  sections: LegalSection[];
  contact: {
    heading: string;
    orgName: string;
    emailLabel: string;
    email: string;
    websiteLabel: string;
    website: string;
  };
}

export const legalPages: { terminos: LegalPage } = {
  terminos: {
    title: "Términos y Condiciones",
    lastUpdated: "Última actualización: septiembre de 2026",
    intro: [
      "Bienvenido/a al sitio web oficial de la Asociación de Deportes Electrónicos y Electromecánicos de Argentina (ADEEMA).",
      "El acceso y uso del sitio web adeema.org implica la aceptación de los presentes Términos y Condiciones. Si no está de acuerdo con alguno de ellos, le recomendamos no utilizar el sitio.",
    ],
    sections: [
      {
        heading: "1. Identificación",
        paragraphs: [
          "El sitio web https://adeema.org/ es titularidad de la Asociación de Deportes Electrónicos y Electromecánicos de Argentina (ADEEMA).",
          "Para consultas relacionadas con el sitio web, puede comunicarse a través de mcabrera@adeema.org.",
        ],
      },
      {
        heading: "2. Uso del sitio",
        paragraphs: [
          "El sitio tiene como finalidad brindar información sobre ADEEMA, sus actividades, proyectos, programas, iniciativas, eventos, contenidos educativos, noticias y demás acciones vinculadas con sus objetivos institucionales.",
          "El usuario se compromete a utilizar el sitio de manera lícita, responsable y conforme a estos Términos y Condiciones.",
          "Queda prohibido utilizar el sitio para realizar actividades que puedan afectar su funcionamiento, seguridad, disponibilidad o integridad, así como intentar acceder sin autorización a sistemas, bases de datos o funcionalidades restringidas.",
        ],
      },
      {
        heading: "3. Contenidos",
        paragraphs: [
          "ADEEMA procura que la información publicada en el sitio sea clara y se encuentre actualizada. No obstante, determinados contenidos pueden modificarse, actualizarse o retirarse sin previo aviso.",
          "Las publicaciones, noticias, fechas, actividades, programas y demás información institucional se proporcionan con fines informativos.",
          "Cuando el sitio incluya contenidos provenientes de terceros, estos podrán encontrarse sujetos a sus propias condiciones y políticas.",
        ],
      },
      {
        heading: "4. Propiedad intelectual",
        paragraphs: [
          "Salvo indicación expresa en contrario, los contenidos propios publicados en este sitio, incluyendo textos, fotografías, videos, piezas gráficas, logotipos, emblemas, diseños, elementos audiovisuales y demás materiales, se encuentran protegidos por la normativa aplicable en materia de propiedad intelectual.",
          "El acceso al sitio no implica la cesión ni transferencia de derechos de propiedad intelectual.",
          "Queda prohibida la reproducción, distribución, modificación, comunicación pública o utilización comercial de los contenidos protegidos sin la correspondiente autorización de sus titulares, salvo en aquellos casos permitidos por la legislación vigente.",
          "Los contenidos pertenecientes a terceros continúan siendo propiedad de sus respectivos titulares.",
        ],
      },
      {
        heading: "5. Contenidos y enlaces de terceros",
        paragraphs: [
          "El sitio puede incluir enlaces hacia páginas web, plataformas, redes sociales u otros servicios administrados por terceros.",
          "ADEEMA no controla necesariamente el contenido, disponibilidad, funcionamiento o políticas de privacidad de dichos sitios externos. El acceso a ellos se realiza bajo responsabilidad del usuario y de acuerdo con las condiciones establecidas por sus respectivos titulares.",
        ],
      },
      {
        heading: "6. Formularios y comunicaciones",
        paragraphs: [
          "El sitio puede disponer de formularios de contacto, suscripción a comunicaciones, inscripción a actividades u otros mecanismos destinados a facilitar la comunicación con ADEEMA.",
          "La información proporcionada a través de estos medios será tratada de acuerdo con la Política de Privacidad disponible en este sitio.",
        ],
      },
      {
        heading: "7. Disponibilidad del sitio",
        paragraphs: [
          "ADEEMA podrá realizar tareas de mantenimiento, actualización o modificación del sitio, lo que eventualmente podrá generar interrupciones temporales del servicio.",
          "Asimismo, ADEEMA no garantiza que el sitio permanezca disponible de manera permanente ni que se encuentre completamente libre de errores o interrupciones.",
        ],
      },
      {
        heading: "8. Modificaciones",
        paragraphs: [
          "ADEEMA podrá modificar, actualizar o reemplazar estos Términos y Condiciones cuando resulte necesario.",
          "La versión vigente será aquella publicada en adeema.org al momento de su consulta.",
        ],
      },
      {
        heading: "9. Legislación aplicable",
        paragraphs: [
          "Estos Términos y Condiciones se regirán por las leyes de la República Argentina.",
          "Cualquier cuestión que pudiera surgir en relación con el uso del sitio será sometida a la jurisdicción que resulte legalmente competente.",
        ],
      },
    ],
    contact: {
      heading: "10. Contacto",
      orgName: "Asociación de Deportes Electrónicos y Electromecánicos de Argentina (ADEEMA)",
      emailLabel: "Correo electrónico:",
      email: "mcabrera@adeema.org",
      websiteLabel: "Sitio web:",
      website: "https://adeema.org/",
    },
  },
};

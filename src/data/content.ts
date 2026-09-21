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
  ctaSecondary: { label: "Explorar Academy", href: "https://academy.adeema.org.ar" },
};

export const institutional = {
  eyebrow: "Quiénes somos",
  title: "Una asociación que conecta tecnología, conocimiento y comunidad.",
  headingParts: ["Tecnología,", "conocimiento", "y comunidad."],
  paragraph:
    "ADEEMA impulsa el impacto del gaming y las nuevas tecnologías en la sociedad. Articulamos comunidades, universidades, empresas e instituciones para conectar conocimiento, innovación y oportunidades, fortaleciendo las capacidades necesarias para el futuro.",
  ctaLabel: "Conocer más",
};

export const network = {
  eyebrow: "Red de articulación",
  headingParts: ["Red de", "articulación"],
  title:
    "Construimos vínculos estratégicos entre instituciones, empresas y comunidades para impulsar el desarrollo tecnológico y académico.",
  items: [
    {
      index: "01",
      tag: "Gobierno",
      title: "Municipios y Gobiernos",
      description: "Acercamos innovación, tecnología y formación a comunidades de todo el país.",
      image: "https://picsum.photos/seed/gobierno/640/360",
    },
    {
      index: "02",
      tag: "Instituciones",
      title: "Cámaras Empresariales e Instituciones",
      description: "Generamos alianzas y proyectos que fortalecen el desarrollo empresarial e institucional.",
      image: "https://picsum.photos/seed/instituciones/640/360",
    },
    {
      index: "03",
      tag: "Educación",
      title: "Universidades y Colegios",
      description: "Conectamos educación, conocimiento e innovación para crear nuevas oportunidades de formación.",
      image: "https://picsum.photos/seed/educacion/640/360",
    },
    {
      index: "04",
      tag: "Innovación",
      title: "Centros Tech e Incubadoras",
      description: "Potenciamos talento, proyectos y emprendimientos que impulsan el futuro tecnológico.",
      image: "https://picsum.photos/seed/innovacion/640/360",
    },
    {
      index: "05",
      tag: "Cooperación",
      title: "Organismos y Asociaciones",
      description: "Articulamos cooperación y alianzas para desarrollar iniciativas de impacto nacional e internacional.",
      image: "https://picsum.photos/seed/cooperacion/640/360",
    },
    {
      index: "06",
      tag: "Sponsors",
      title: "Empresas Tech y Sponsors",
      description: "Creamos oportunidades de colaboración, visibilidad y participación en nuevas iniciativas tecnológicas.",
      image: "https://picsum.photos/seed/sponsors/640/360",
    },
  ],
};

export const mission = {
  eyebrow: "Nosotros",
  label: "Misión",
  title: "Impulsar las competencias del futuro en Argentina.",
  paragraph:
    "Creamos programas de formación, comunidades y espacios de articulación que conectan conocimiento, tecnología y oportunidades para fortalecer el desarrollo sostenible del ecosistema en todo el país.",
  image:
    "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=2000&q=80",
};

export const vision = {
  eyebrow: "Nosotros",
  label: "Visión",
  title: "Ser una organización de referencia en la región.",
  paragraph:
    "Impulsamos la investigación, el desarrollo y la articulación en torno al gaming, los esports y la innovación tecnológica, conectando nuevas generaciones, educación y tecnología con una mirada federal y de largo plazo.",
  image:
    "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=2000&q=80",
};

export const academy = {
  eyebrow: "Educación",
  title: "ADEEMA Academy",
  paragraph:
    "El espacio de formación del ecosistema. Programas educativos estructurados para capacitar a las nuevas generaciones, profesionales y organizaciones en las competencias del futuro e innovación.",
  tag: "Academy",
  items: [
    {
      index: "01",
      title: "Cursos Especializados",
      description:
        "Trayectos formativos enfocados en herramientas clave, gestión del entorno tecnológico y habilidades técnicas demandadas por el sector.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    },
    {
      index: "02",
      title: "Diplomaturas Institucionales",
      description:
        "Programas de formación continua con respaldo académico para profesionalizar la industria del gaming y los esports de manera sostenible.",
      image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80",
    },
    {
      index: "03",
      title: "Charlas & ADEEMA Talks",
      description:
        "Ciclos de conferencias y masterclasses abiertas con expertos del sector, analizando el impacto educativo y social de la tecnología.",
      image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80",
    },
    {
      index: "04",
      title: "Programas de Innovación",
      description:
        "Espacios de aceleración de conocimiento orientados al desarrollo de talento joven, transformación y capacidades tecnológicas aplicadas.",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    },
  ],
};

export const media = {
  eyebrow: "Media Hub",
  title: "ADEEMA Media",
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
      image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1200&q=80",
    },
    {
      index: "03",
      title: "Contenido Audiovisual",
      description:
        "Resúmenes, contenidos en formato corto y material interactivo diseñado para plataformas digitales.",
      image: "https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?auto=format&fit=crop&w=1200&q=80",
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
      reasonOptions: [
        "Alianzas y Convenios Marco",
        "Patrocinio y Sponsors",
        "Consultas de Academy",
        "Prensa y Media",
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
  legal: ["Términos y condiciones", "Política de privacidad"],
  backToTop: "Volver arriba",
  copyright: `© ${new Date().getFullYear()} ADEEMA. Todos los derechos reservados.`,
};

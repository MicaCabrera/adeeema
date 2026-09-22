// Traducción al inglés de data/content.ts. Cada export se tipa contra el de
// español (typeof), así que TypeScript marca cualquier campo que falte.
// Nombres propios (ADEEMA, ADEEMA Academy, ADEEMA Media), URLs, hrefs, ids
// e imágenes son idénticos al español.
import type * as es from "./content";

export const site: typeof es.site = {
  name: "ADEEMA",
  description:
    "ADEEMA - Association of Electronic and Electromechanical Sports of Argentina. We drive the national technology sports ecosystem.",
  logo: "/adeema-logo.png",
  social: {
    instagram: "https://www.instagram.com/adeemaoficial/",
    linkedin: "https://www.linkedin.com/company/adeema/posts/?feedView=all",
  },
};

export const nav: typeof es.nav = [
  { label: "Institutional", href: "#institucional" },
  { label: "Academy", href: "#academy" },
  { label: "Media", href: "#media" },
  { label: "Community", href: "#comunidad" },
  { label: "News", href: "#noticias" },
  { label: "Contact", href: "#contacto" },
];

export const hero: typeof es.hero = {
  kicker: "Driving the technological, academic and cultural ecosystem of the future.",
  titleLines: ["ADE", "EMA"],
  ctaPrimary: { label: "Get involved", href: "#institucional" },
  ctaSecondary: { label: "Explore Academy", href: "https://academy.adeema.org.ar" },
};

export const institutional: typeof es.institutional = {
  eyebrow: "Who we are",
  title: "An association that connects technology, knowledge and community.",
  headingParts: ["Technology,", "knowledge", "and community."],
  paragraph:
    "ADEEMA drives the impact of gaming and new technologies on society. We connect communities, universities, companies and institutions to bring together knowledge, innovation and opportunities, strengthening the capabilities needed for the future.",
  ctaLabel: "Learn more",
};

export const network: typeof es.network = {
  eyebrow: "Partnership network",
  headingParts: ["Network of", "partnership"],
  title:
    "We build strategic links between institutions, companies and communities to drive technological and academic development.",
  items: [
    {
      index: "01",
      tag: "Government",
      title: "Municipalities and Governments",
      description: "We bring innovation, technology and training to communities across the country.",
      image: "https://picsum.photos/seed/gobierno/640/360",
    },
    {
      index: "02",
      tag: "Institutions",
      title: "Chambers of Commerce and Institutions",
      description: "We create alliances and projects that strengthen business and institutional development.",
      image: "https://picsum.photos/seed/instituciones/640/360",
    },
    {
      index: "03",
      tag: "Education",
      title: "Universities and Schools",
      description: "We connect education, knowledge and innovation to create new training opportunities.",
      image: "https://picsum.photos/seed/educacion/640/360",
    },
    {
      index: "04",
      tag: "Innovation",
      title: "Tech Centers and Incubators",
      description: "We nurture talent, projects and ventures that drive the technological future.",
      image: "https://picsum.photos/seed/innovacion/640/360",
    },
    {
      index: "05",
      tag: "Cooperation",
      title: "Organizations and Associations",
      description: "We foster cooperation and alliances to develop initiatives of national and international impact.",
      image: "https://picsum.photos/seed/cooperacion/640/360",
    },
    {
      index: "06",
      tag: "Sponsors",
      title: "Tech Companies and Sponsors",
      description: "We create opportunities for collaboration, visibility and participation in new technology initiatives.",
      image: "https://picsum.photos/seed/sponsors/640/360",
    },
  ],
};

export const mission: typeof es.mission = {
  eyebrow: "About us",
  label: "Mission",
  title: "Drive the skills of the future in Argentina.",
  paragraph:
    "We create training programs, communities and networking spaces that connect knowledge, technology and opportunities to strengthen the sustainable development of the ecosystem across the country.",
  image:
    "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=2000&q=80",
};

export const vision: typeof es.vision = {
  eyebrow: "About us",
  label: "Vision",
  title: "Be a reference organization in the region.",
  paragraph:
    "We promote research, development and networking around gaming, esports and technological innovation, connecting new generations, education and technology with a federal, long-term outlook.",
  image:
    "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=2000&q=80",
};

export const academy: typeof es.academy = {
  eyebrow: "Education",
  title: "ADEEMA Academy",
  paragraph:
    "The training arm of the ecosystem. Structured educational programs to prepare new generations, professionals and organizations in the skills of the future and innovation.",
  tag: "Academy",
  items: [
    {
      index: "01",
      title: "Specialized Courses",
      description:
        "Training paths focused on key tools, technology environment management and technical skills in demand across the industry.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    },
    {
      index: "02",
      title: "Institutional Diplomas",
      description:
        "Continuing education programs with academic backing to professionalize the gaming and esports industry in a sustainable way.",
      image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80",
    },
    {
      index: "03",
      title: "Talks & ADEEMA Talks",
      description:
        "Series of open conferences and masterclasses with industry experts, exploring the educational and social impact of technology.",
      image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80",
    },
    {
      index: "04",
      title: "Innovation Programs",
      description:
        "Knowledge-acceleration spaces aimed at developing young talent, transformation and applied technological capabilities.",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    },
  ],
};

export const media: typeof es.media = {
  eyebrow: "Media Hub",
  title: "ADEEMA Media",
  paragraph:
    "Connecting audiences through strategic content, streaming and audiovisual productions on innovation and gaming culture.",
  items: [
    {
      index: "01",
      title: "Live Broadcasts / Streaming",
      description:
        "Live institutional programming with industry leaders, discussing gaming, innovation, education and new generations.",
      image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=1200&q=80",
    },
    {
      index: "02",
      title: "Interview Series",
      description:
        "In-depth conversations with industry leaders, academics and decision-makers who drive development.",
      image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1200&q=80",
    },
    {
      index: "03",
      title: "Audiovisual Content",
      description:
        "Recaps, short-form content and interactive material designed for digital platforms.",
      image: "https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?auto=format&fit=crop&w=1200&q=80",
    },
    {
      index: "04",
      title: "Event Coverage",
      description:
        "Audiovisual coverage of in-person activations, networking days and association gatherings.",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
    },
  ],
};

export const fan: typeof es.fan = {
  eyebrow: "FAN Area",
  titleParts: ["A", "community", "to", "stay", "connected"],
  paragraph:
    "News, alerts and exclusive content from ADEEMA's tech, academic and cultural ecosystem, straight to your inbox.",
  cta: "Get involved",
  consent: "I agree to receive the ADEEMA newsletter.",
  note: "Your data is protected. You can unsubscribe at any time.",
  success: "Thanks for getting involved!",
};

export const contact: typeof es.contact = {
  eyebrow: "Contact",
  title: "Institutional Partnerships",
  paragraph:
    "Want to bring your organization on board, propose a strategic alliance or learn more about our programs?",
  ctaLabel: "Start a conversation",
  form: {
    title: "Institutional Partnerships",
    subtitle: "Tell us what you need.",
    fields: {
      name: "Full name / Institution or Company",
      email: "Email",
      reason: "Reason for your inquiry",
      reasonPlaceholder: "Select…",
      reasonOptions: [
        "Alliances and Framework Agreements",
        "Sponsorship",
        "Academy Inquiries",
        "Press and Media",
      ],
      message: "Message / Proposal",
    },
    submit: "Send",
  },
  success: {
    title: "Thanks for your message!",
    paragraph: "Our institutional relations team will get back to you shortly.",
  },
};

export const footer: typeof es.footer = {
  description: "Association of Electronic and Electromechanical Sports of Argentina.",
  email: "contacto@adeema.org.ar",
  navTitle: "Navigation",
  navLinks: [
    { label: "Who we are", href: "#institucional" },
    { label: "Mission & Vision", href: "#mision-vision" },
    { label: "ADEEMA Academy", href: "#academy" },
    { label: "ADEEMA Media", href: "#media" },
    { label: "Community", href: "#comunidad" },
    { label: "News", href: "#noticias" },
    { label: "Contact", href: "#contacto" },
  ],
  socialTitle: "Social",
  legal: ["Terms and conditions", "Privacy policy"],
  backToTop: "Back to top",
  copyright: `© ${new Date().getFullYear()} ADEEMA. All rights reserved.`,
};

export const newsDetail: typeof es.newsDetail = {
  notFound: "We couldn't find this article.",
};

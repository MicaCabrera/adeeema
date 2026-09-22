// Textos de interfaz sueltos (botones, aria-labels, placeholders, textos de
// la sección News) que no pertenecen a ningún bloque de data/content.ts.
// El español es la fuente de verdad; el inglés se tipa contra él, así
// TypeScript avisa si falta una clave.

const es = {
  signIn: "Iniciar Sesión",
  goHome: "Ir al inicio",
  mainNav: "Navegación principal",
  mobileNav: "Navegación mobile",
  openMenu: "Abrir menú",
  closeMenu: "Cerrar menú",
  previous: "Anterior",
  next: "Siguiente",
  goTo: "Ir a",
  close: "Cerrar",
  currentLanguage: "Idioma actual",
  changeLanguage: "Cambiar idioma",
  selectLanguage: "Seleccionar idioma",
  emailPlaceholder: "Tu email",
  comingSoon: "Contenido próximamente.",
  newsCategories: "Categorías",
  newsAll: "Todas las noticias",
  newsEyebrow: "Noticias",
  newsTitleLead: "Actualidad",
  newsTitleAccent: "& Prensa",
  newsEmpty: "No hay noticias en esta categoría todavía.",
  back: "Volver",
  contactSending: "Enviando…",
  contactValidationError: "Completá nombre, email y mensaje antes de enviar.",
  contactSendError: "No pudimos enviar tu mensaje. Probá de nuevo en unos segundos.",
};

export type UiDict = typeof es;

const en: UiDict = {
  signIn: "Sign in",
  goHome: "Go to home",
  mainNav: "Main navigation",
  mobileNav: "Mobile navigation",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  previous: "Previous",
  next: "Next",
  goTo: "Go to",
  close: "Close",
  currentLanguage: "Current language",
  changeLanguage: "Change language",
  selectLanguage: "Select language",
  emailPlaceholder: "Your email",
  comingSoon: "Content coming soon.",
  newsCategories: "Categories",
  newsAll: "All news",
  newsEyebrow: "News",
  newsTitleLead: "News",
  newsTitleAccent: "& Press",
  newsEmpty: "There are no news in this category yet.",
  back: "Back",
  contactSending: "Sending…",
  contactValidationError: "Fill in name, email and message before sending.",
  contactSendError: "We couldn't send your message. Please try again in a few seconds.",
};

export const ui = { es, en };

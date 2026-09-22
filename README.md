# ADEEMA — Sitio institucional

Sitio web de ADEEMA (Asociación de Deportes Electrónicos y Electromecánicos de Argentina), construido con React + TypeScript + Vite, Tailwind CSS v4, Framer Motion y GSAP (ScrollTrigger). Español e inglés (`src/i18n/`), con el español como idioma fuente.

El contenido (institucional, red de articulación, misión/visión, ADEEMA Academy, ADEEMA Media, comunidad/newsletter, noticias y contacto) reproduce el del sitio real de ADEEMA. Paleta de marca: negro `#151515` (ink), Mint Cream `#f7fff7` (paper), Tech Blue `#1d5cba` (accent) y Dusty Denim `#6189c4` (secondary) — definida en `src/index.css`. Navbar, botón CTA y el drawer de contacto siguen el patrón visual del proyecto de referencia `adeema-main`.

## Desarrollo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Variables de entorno

Copiá `.env.example` a `.env` y completá los valores (ver comentarios ahí). En producción se cargan en Vercel → Project Settings → Environment Variables, no en el repo.

## Estructura

- `src/data/content.ts` / `content.en.ts` — copy del sitio por sección, en español e inglés.
- `src/i18n/` — selector de idioma (`LanguageContext`, `language.ts`), `ui.ts` (textos sueltos que no pertenecen a `content.ts`) y `useContent()`/`useUi()` para leer el idioma activo.
- `src/components/` — una sección por archivo (Navbar, Hero, Institutional, Network, MissionVision, Academy, Media, Fan, News, NewsDetail, Contact, Footer).
- `src/components/ui/` — piezas reutilizables (CtaButton, Eyebrow, LangSwitcher, Reveal, WindowedDots, inverted-cursor).
- `src/hooks/` — `useHeroCurtain`/`useMissionVisionCurtain` (efecto cortina con GSAP ScrollTrigger) y `useExternalNews` (consume `/api/news`).
- `api/` — funciones serverless de Vercel: `news.ts` (agrega noticias externas por RSS para Actualidad & Prensa) y `contact.ts` (envía el formulario de contacto por Resend, ver `.env.example`).

## Detalles destacados

- **Red de Articulación**: lista de 6 filas con highlight animado (hover en desktop, scroll-spy en mobile/táctil) — `src/components/Network.tsx`.
- **Misión/Visión**: en desktop (`lg`+), scroll pinneado con GSAP ScrollTrigger — títulos que se acumulan arriba a medida que avanza el scroll, con efecto de relleno de texto (clip-path) por concepto. En mobile/tablet, paneles apilados a pantalla completa con el mismo efecto "cortina" que separa Home de Institucional (`useMissionVisionCurtain`).

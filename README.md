# ADEEMA — Sitio institucional

Sitio web de ADEEMA (Asociación de Deportes Electrónicos y Electromecánicos de Argentina), construido con React + TypeScript + Vite, Tailwind CSS v4, Framer Motion y GSAP (ScrollTrigger).

El contenido (institucional, red de articulación, misión/visión, ADEEMA Academy, ADEEMA Media, comunidad/newsletter, noticias y contacto) reproduce el del sitio real de ADEEMA. La paleta de marca es azul `#034BFF`, gris claro `#E4E8F7` y negro `#090C0D`. Navbar, botón CTA y el drawer de contacto siguen el patrón visual del proyecto de referencia `adeema-main`.

## Desarrollo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Estructura

- `src/data/content.ts` — todo el copy del sitio (en español), centralizado.
- `src/components/` — una sección por archivo (Navbar, Hero, Institutional, Network, MissionVision, Academy, Media, Fan, News, Contact, Footer).
- `src/components/ui/` — piezas reutilizables (CtaButton, Eyebrow, LangSwitcher, Reveal).

## Detalles destacados

- **Red de Articulación**: sección de 100vh con los 6 items distribuidos a `flex-1`, tope duro de altura con `overflow: hidden`.
- **Misión/Visión**: scroll pinneado con GSAP ScrollTrigger — títulos que se acumulan arriba a medida que avanza el scroll, con efecto de relleno de texto (clip-path) por concepto.

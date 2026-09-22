import type { ReactNode } from "react";
import { site } from "../../data/content";

// Único componente de CTA del sitio, con un único tamaño fijo (no acepta
// variación de tamaño): las medidas son las del CTA del Hero ("Conocé
// ADEEMA" / "Explorar Academy"), la fuente de verdad para alto, padding y
// tipografía de todos los botones de la página, sin importar la sección ni
// el largo del texto de cada uno.
//
// Única excepción: prop `size="touch"`, pensada solo para el CTA "Iniciar
// sesión" del menú full-screen mobile, donde el botón necesita cumplir el
// área táctil mínima (alto 48px; el ancho ya lo da el contenido/padding).
// No se usa en ningún otro lugar del sitio.
//
// Variante "primary" (default): rectángulo de texto blanco + cuadrado azul
// de marca con flecha, separados por gap chico. En hover, la flecha escapa
// arriba-izquierda mientras el emblema de ADEEMA entra desde abajo-izquierda.
//
// Variante "secondary": una sola pieza translúcida, misma altura que la
// primaria. En hover el texto sale por la derecha y una copia entra por la
// izquierda (slide, no fade).
//
// Adaptado del CtaButton de referencia (adeema-main) a los tokens de este
// proyecto: bg-dark/text-dark -> ink, bg-brand-500 -> accent (#034BFF).

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

// Medidas del CTA del Hero — única fuente de verdad de tamaño para todo el sitio.
const SIZE = {
  square: "w-10 md:w-9",
  height: "h-10 md:h-9",
  icon: "h-3.5 w-3.5 md:h-3.5 md:w-3.5",
  emblem: "h-4 w-4 md:h-3.5 md:w-3.5",
  text: "px-5 text-sm md:px-4 md:text-xs",
  gap: "gap-1.5 md:gap-1",
};

// Variante "touch": mismo diseño, alto 48px fijo (área táctil mínima) para
// el CTA del menú full-screen mobile. Ver comentario arriba.
const SIZE_TOUCH = {
  ...SIZE,
  square: "w-12",
  height: "h-12",
  icon: "h-4 w-4",
  emblem: "h-4 w-4",
};

interface CtaButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary";
  href?: string;
  as?: "button" | "a";
  type?: "button" | "submit";
  className?: string;
  /** Recolorea el cuadrado del arrow (variante primary) para los casos puntuales
   * donde el botón se usa sobre un fondo que ya es accent (#034BFF). */
  squareClassName?: string;
  /** "touch": alto 48px fijo, solo para el CTA del menú full-screen mobile. */
  size?: "default" | "touch";
  onClick?: () => void;
  target?: string;
  rel?: string;
}

export default function CtaButton({
  children,
  variant = "primary",
  href,
  as = "button",
  type,
  className = "",
  squareClassName = "bg-accent",
  size = "default",
  onClick,
  target,
  rel,
}: CtaButtonProps) {
  const Component = (href ? "a" : as) as "a" | "button";
  const componentProps = href
    ? { href, onClick, target, rel }
    : { onClick, type: type ?? (as === "button" ? "button" : undefined) };
  const S = size === "touch" ? SIZE_TOUCH : SIZE;

  if (variant === "secondary") {
    return (
      <Component
        className={`group inline-flex items-center justify-center overflow-hidden rounded bg-paper/10 font-semibold uppercase tracking-widest text-paper/70 backdrop-blur-sm transition-colors duration-500 ease-in-out hover:bg-paper/15 hover:text-paper ${S.height} ${S.text} ${className}`}
        {...(componentProps as object)}
      >
        <span className="relative inline-block overflow-hidden">
          <span className="invisible whitespace-nowrap">{children}</span>
          <span className="absolute inset-0 flex items-center justify-center whitespace-nowrap transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-x-[145%]">
            {children}
          </span>
          <span
            aria-hidden="true"
            className="absolute inset-0 flex -translate-x-[145%] items-center justify-center whitespace-nowrap transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-x-0"
          >
            {children}
          </span>
        </span>
      </Component>
    );
  }

  return (
    <Component className={`group inline-flex items-stretch ${S.gap} ${className}`} {...(componentProps as object)}>
      <span
        className={`relative z-0 flex items-center rounded bg-paper ${S.text} font-semibold uppercase tracking-widest text-ink transition-colors duration-300 group-hover:bg-paper/90`}
      >
        {children}
      </span>

      <span
        aria-hidden="true"
        className={`relative z-10 aspect-square shrink-0 overflow-hidden rounded transition-colors duration-300 group-hover:bg-paper/90 ${squareClassName} ${S.square}`}
      >
        <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-in-out group-hover:-translate-x-full group-hover:-translate-y-full">
          <ArrowIcon className={`${S.icon} text-white`} />
        </span>
        <span className="absolute inset-0 flex -translate-x-full translate-y-full items-center justify-center transition-transform duration-300 ease-in-out group-hover:translate-x-0 group-hover:translate-y-0">
          <span
            aria-hidden="true"
            className={`${S.emblem} bg-ink`}
            style={{
              maskImage: `url(${site.logo})`,
              maskSize: "contain",
              maskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskImage: `url(${site.logo})`,
              WebkitMaskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
            }}
          />
        </span>
      </span>
    </Component>
  );
}

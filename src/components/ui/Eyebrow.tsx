interface EyebrowProps {
  label: string;
  className?: string;
  /** Color del texto (Tailwind). Default text-accent; override puntual para
   * secciones con fondo ya accent (ej. Media), donde el accent se hace
   * invisible sobre sí mismo. */
  textClassName?: string;
}

export default function Eyebrow({ label, className = "", textClassName = "text-accent" }: EyebrowProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <span className={`text-xs md:text-sm font-semibold uppercase tracking-[0.25em] ${textClassName}`}>
        {label}
      </span>
    </div>
  );
}

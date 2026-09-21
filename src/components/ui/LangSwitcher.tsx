import { useEffect, useRef, useState } from "react";

const LANGS = [
  { code: "ES", label: "Español" },
  { code: "EN", label: "English" },
];

interface LangSwitcherProps {
  className?: string;
  variant?: "chip" | "flat";
  /** Hacia dónde abre el desplegable. Por defecto abre hacia abajo; se
   * puede forzar "up" cuando el botón está cerca del borde inferior de su
   * contenedor (ej. el menú mobile) y abajo no tiene lugar. */
  dropdownAlign?: "up" | "down";
}

export default function LangSwitcher({ className = "", variant = "chip", dropdownAlign }: LangSwitcherProps) {
  const [lang, setLang] = useState("ES");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const isFlat = variant === "flat";
  const opensUp = dropdownAlign === "up";

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      // Cubre las tres formas de cerrar (click afuera, Escape, elegir un
      // idioma): las tres pasan por acá porque las tres ponen open en false.
      triggerRef.current?.focus();
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`relative shrink-0 ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1.5 rounded-full text-xs font-semibold transition-colors duration-200 ${
          isFlat
            ? "p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
            : "border border-white/10 bg-white/5 px-2.5 py-1.5 text-white/60 hover:border-white/20 hover:text-white"
        }`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Idioma actual: ${lang}. Cambiar idioma`}
      >
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
          <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 9h17M3.5 15h17" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3z" />
        </svg>
        {!isFlat && (
          <>
            <span>{lang}</span>
            <svg
              className={`h-3 w-3 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
            </svg>
          </>
        )}
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Seleccionar idioma"
          className={`absolute right-0 z-50 min-w-[9rem] overflow-hidden rounded-medium border border-white/10 bg-panel/98 py-1 shadow-xl shadow-black/30 backdrop-blur-md ${
            opensUp ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          {LANGS.map(({ code, label }) => (
            <button
              key={code}
              type="button"
              role="menuitemradio"
              aria-checked={lang === code}
              onClick={() => {
                setLang(code);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-3 py-2 text-xs font-semibold transition-colors duration-150 ${
                lang === code ? "bg-white/5 text-accent" : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span>{label}</span>
              <span className="text-[10px] text-white/40">{code}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

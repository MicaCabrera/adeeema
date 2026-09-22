import { useEffect, useRef, useState, type FormEvent, type RefObject } from "react";
import CtaButton from "./ui/CtaButton";
import Eyebrow from "./ui/Eyebrow";
import { useContent, useUi } from "../i18n/useContent";

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function FloatingInput({
  id,
  label,
  type = "text",
  required,
  inputRef,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  inputRef?: RefObject<HTMLInputElement | null>;
}) {
  return (
    <div className="relative">
      <input
        id={id}
        name={id}
        ref={inputRef}
        type={type}
        required={required}
        placeholder=" "
        className="peer w-full border-0 bg-transparent px-0 pb-2 pt-5 text-sm text-white placeholder-transparent focus:outline-none"
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-0 top-5 text-sm text-white/80 transition-all duration-200 ease-out peer-focus:top-0 peer-focus:text-xs peer-focus:text-white peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-white"
      >
        {label}
      </label>
      <span aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-white/25" />
      <span aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 h-px w-0 bg-white transition-all duration-300 ease-out peer-focus:w-full" />
    </div>
  );
}

function FloatingSelect({ id, label, required }: { id: string; label: string; required?: boolean }) {
  const { contact } = useContent();

  return (
    <div className="relative">
      <label htmlFor={id} className="absolute left-0 top-0 text-xs text-white/80">
        {label}
      </label>
      <select
        id={id}
        name={id}
        required={required}
        defaultValue=""
        className="peer w-full cursor-pointer appearance-none border-0 bg-transparent px-0 pb-2 pt-5 text-sm text-white focus:outline-none"
      >
        <option value="" disabled className="bg-panel text-white/50">
          {contact.form.fields.reasonPlaceholder}
        </option>
        {contact.form.fields.reasonOptions.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-panel text-white">
            {opt.label}
          </option>
        ))}
      </select>
      <span aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-white/25" />
      <span aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 h-px w-0 bg-white transition-all duration-300 ease-out peer-focus:w-full" />
    </div>
  );
}

function FloatingTextarea({ id, label, required }: { id: string; label: string; required?: boolean }) {
  return (
    <div className="relative">
      <textarea
        id={id}
        name={id}
        required={required}
        rows={3}
        placeholder=" "
        className="peer w-full resize-none border-0 bg-transparent px-0 pb-2 pt-5 text-sm text-white placeholder-transparent focus:outline-none"
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-0 top-5 text-sm text-white/80 transition-all duration-200 ease-out peer-focus:top-0 peer-focus:text-xs peer-focus:text-white peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-white"
      >
        {label}
      </label>
      <span aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-white/25" />
      <span aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 h-px w-0 bg-white transition-all duration-300 ease-out peer-focus:w-full" />
    </div>
  );
}

export default function Contact() {
  const { contact } = useContent();
  const ui = useUi();
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const triggerRef = useRef<HTMLSpanElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  useEffect(() => {
    if (!open) return undefined;

    firstFieldRef.current?.focus();
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeDrawer();
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>("input, select, textarea, button, a[href]");
        if (focusables.length === 0) return;
        const list = Array.from(focusables);
        const first = list[0];
        const last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      triggerRef.current?.focus();
    };
  }, [open]);

  return (
    <section id="contacto" className="section-padding relative isolate flex min-h-[100svh] items-center overflow-hidden bg-ink">
      {/* Fondo: foto + filtro negro encima (mismo patrón que el Hero) para
          que el texto blanco siga siendo legible sobre la imagen. */}
      <div className="absolute inset-0 -z-20">
        <img src="/contacto.jpg" alt="" className="h-full w-full object-cover" />
      </div>
      <div className="absolute inset-0 -z-10 bg-ink/90" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <Eyebrow label={contact.eyebrow} className="mb-4" />
          <h2 className="display-font mb-4 text-[13vw] font-bold uppercase leading-[0.9] text-white md:text-[5.5vw]">
            {contact.title}
          </h2>
          <p className="text-[15.4px] leading-relaxed text-white/60 md:text-[17.6px]">{contact.paragraph}</p>
        </div>

        <div className="mt-16 md:mt-20">
          <span ref={triggerRef} className="inline-block">
            <CtaButton
              as="button"
              type="button"
              onClick={openDrawer}
              aria-haspopup="dialog"
              aria-expanded={open}
              size="mobile"
            >
              {contact.ctaLabel}
            </CtaButton>
          </span>
        </div>
      </div>

      <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
        <div
          onClick={closeDrawer}
          className={`absolute inset-0 bg-black transition-opacity duration-300 ease-out ${open ? "opacity-70" : "opacity-0"}`}
        />

        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="contacto-panel-title"
          className={`absolute right-0 top-0 flex h-full w-full flex-col overflow-hidden bg-accent p-6 shadow-2xl transition-transform duration-300 ease-out sm:w-[45%] sm:min-w-[420px] sm:p-8 md:p-10 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="mb-6 flex shrink-0 items-center justify-between">
            <Eyebrow label={contact.eyebrow} textClassName="text-white" />
            <button
              type="button"
              onClick={closeDrawer}
              aria-label={ui.close}
              className="text-white/70 transition-colors duration-200 hover:text-white"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          {submitted ? (
            <div className="flex flex-1 flex-col items-start justify-center gap-3">
              <h3 className="text-2xl font-medium text-white md:text-3xl">{contact.success.title}</h3>
              <p className="text-sm text-white/80">{contact.success.paragraph}</p>
            </div>
          ) : (
            <>
              <h3 id="contacto-panel-title" className="shrink-0 text-2xl font-medium leading-tight text-white md:text-3xl">
                {contact.form.title}
              </h3>
              <p className="mt-2 shrink-0 text-sm text-white/80">{contact.form.subtitle}</p>

              <form onSubmit={handleSubmit} className="mt-6 flex min-h-0 flex-1 flex-col gap-4 overflow-hidden">
                <FloatingInput
                  id="contacto-nombre"
                  label={contact.form.fields.name}
                  required
                  inputRef={firstFieldRef}
                />
                <FloatingInput id="contacto-email" label={contact.form.fields.email} type="email" required />
                <FloatingSelect id="contacto-motivo" label={contact.form.fields.reason} required />
                <FloatingTextarea id="contacto-mensaje" label={contact.form.fields.message} required />

                <div className="mt-8 md:mt-2">
                  <CtaButton
                    as="button"
                    type="submit"
                    className="w-full justify-center"
                    squareClassName="bg-secondary"
                    size="mobile"
                  >
                    {contact.form.submit}
                  </CtaButton>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import CtaButton from "./ui/CtaButton";
import LangSwitcher from "./ui/LangSwitcher";
import { site, nav } from "../data/content";

export default function Navbar() {
  const [activeHref, setActiveHref] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [prevMenuOpen, setPrevMenuOpen] = useState(false);
  if (menuOpen !== prevMenuOpen) {
    setPrevMenuOpen(menuOpen);
    if (!menuOpen) setClosing(true);
  }
  const menuRendered = menuOpen || closing;

  const progressRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const mobileOverlayRef = useRef<HTMLDivElement | null>(null);
  const mobileItemRefs = useRef<(HTMLElement | null)[]>([]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Scroll-spy: qué sección está cerca del centro del viewport.
  useEffect(() => {
    let observer: IntersectionObserver | undefined;
    let rafId: number;
    let attempts = 0;
    const MAX_ATTEMPTS = 240;

    const trySetup = () => {
      const sections = nav.map((link) => document.querySelector(link.href)).filter(Boolean) as Element[];

      attempts += 1;
      if (sections.length < nav.length && attempts < MAX_ATTEMPTS) {
        rafId = requestAnimationFrame(trySetup);
        return;
      }
      if (sections.length === 0) return;

      observer = new IntersectionObserver(
        (entries) => {
          const visible = entries.filter((entry) => entry.isIntersecting);
          if (visible.length === 0) return;
          const closest = visible.reduce((best, entry) =>
            entry.intersectionRatio > best.intersectionRatio ? entry : best
          );
          setActiveHref(`#${closest.target.id}`);
        },
        { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
      );
      sections.forEach((section) => observer!.observe(section));
    };

    rafId = requestAnimationFrame(trySetup);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (observer) observer.disconnect();
    };
  }, []);

  // Barra de progreso de scroll por sección, debajo de cada link.
  useEffect(() => {
    const activeIndex = nav.findIndex((link) => link.href === activeHref);
    nav.forEach((link, index) => {
      const el = progressRefs.current[link.href];
      if (!el || index === activeIndex) return;
      const target = activeIndex === -1 ? 0 : index < activeIndex ? 1 : 0;
      gsap.to(el, { scaleX: target, duration: 0.4, ease: "power2.out", overwrite: "auto" });
    });
  }, [activeHref]);

  useEffect(() => {
    const tick = () => {
      const link = nav.find((item) => item.href === activeHref);
      if (!link) return;
      const section = document.querySelector(link.href);
      const el = progressRefs.current[link.href];
      if (!section || !el) return;

      const sectionTop = window.scrollY + section.getBoundingClientRect().top;
      const sectionHeight = (section as HTMLElement).offsetHeight || 1;
      const raw = (window.scrollY - sectionTop) / sectionHeight;
      const progress = Math.min(1, Math.max(0, raw));

      gsap.to(el, { scaleX: progress, duration: 0.15, ease: "none", overwrite: "auto" });
    };

    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
    };
  }, [activeHref]);

  useEffect(() => {
    document.body.style.overflow = menuRendered ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuRendered]);

  useEffect(() => {
    if (!menuRendered) return;
    const overlay = mobileOverlayRef.current;
    const items = mobileItemRefs.current.filter(Boolean);
    if (!overlay) return;

    if (menuOpen) {
      gsap.set(overlay, { opacity: 0 });
      gsap.set(items, { opacity: 0, y: 28 });
      gsap.to(overlay, { opacity: 1, duration: 0.3, ease: "power2.out" });
      gsap.to(items, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out", stagger: 0.06, delay: 0.1 });
    } else {
      gsap.to(items, { opacity: 0, y: -16, duration: 0.2, ease: "power2.in", stagger: 0.03 });
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
        delay: 0.08,
        onComplete: () => setClosing(false),
      });
    }
  }, [menuOpen, menuRendered]);

  return (
    <>
      {/* Dock fijo arriba — tres cápsulas independientes (desktop, >=1280px) */}
      <div className="pointer-events-none fixed inset-x-0 top-6 z-50 hidden items-center justify-center gap-3 xl:flex">
        <a
          href="#inicio"
          aria-label="Ir al inicio"
          className="pointer-events-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-medium border border-white/10 bg-ink/70 backdrop-blur-lg transition-colors duration-200 hover:border-white/20"
        >
          <img src={site.logo} alt={site.name} className="h-6 w-6 object-contain brightness-0 invert" />
        </a>

        <nav
          aria-label="Navegación principal"
          className="pointer-events-auto flex h-12 shrink-0 items-center gap-0.5 rounded-full border border-white/10 bg-ink/70 px-1.5 backdrop-blur-lg"
        >
          {nav.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={activeHref === link.href ? "true" : undefined}
              className={`relative shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors duration-200 ${
                activeHref === link.href ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              {link.label}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-2.5 bottom-0.5 h-0.5 rounded-full bg-white/15"
              />
              <span
                ref={(el) => {
                  progressRefs.current[link.href] = el;
                }}
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-2.5 bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-accent"
              />
            </a>
          ))}
          <span className="mx-1 h-5 w-px shrink-0 bg-white/10" aria-hidden="true" />
          <LangSwitcher variant="flat" />
        </nav>

        <div className="pointer-events-auto flex h-12 shrink-0 items-center gap-1 rounded-full border border-white/10 bg-ink/70 px-1.5 backdrop-blur-lg">
          <a
            href="#login"
            className="rounded-full px-3.5 py-2 text-[13px] font-medium text-white/60 transition-colors duration-200 hover:text-white"
          >
            Iniciar Sesión
          </a>
          <CtaButton href="#comunidad">Sumate</CtaButton>
        </div>
      </div>

      {/* Navbar mobile / tablet (<1280px) */}
      <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-white/10 bg-ink/80 px-4 py-3 backdrop-blur-lg sm:px-6 xl:hidden">
        <a
          href="#inicio"
          aria-label="Ir al inicio"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-medium border border-white/10 bg-ink/70 transition-colors duration-200 hover:border-white/20"
        >
          <img src={site.logo} alt={site.name} className="h-6 w-6 object-contain brightness-0 invert" />
        </a>

        <button
          type="button"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-medium border border-white/10 bg-ink/70 text-white/80 transition-colors duration-300 hover:text-white"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <span className="relative block h-4 w-5">
            <span
              className={`absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ease-out ${
                menuOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 bottom-0 h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ease-out ${
                menuOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {/* Menú full-screen mobile / tablet */}
      {menuRendered && (
        <div
          id="mobile-menu"
          ref={mobileOverlayRef}
          className="fixed inset-0 z-40 flex flex-col bg-ink/98 opacity-0 backdrop-blur-xl xl:hidden"
        >
          <div className="flex-1 overflow-y-auto px-6 pb-28 pt-16 sm:px-10">
            <nav aria-label="Navegación mobile" className="flex flex-col">
              {nav.map((link, index) => (
                <a
                  key={link.href}
                  ref={(el) => {
                    mobileItemRefs.current[index] = el;
                  }}
                  href={link.href}
                  onClick={closeMenu}
                  className="group flex items-center justify-between border-b border-white/10 py-4 text-3xl font-semibold text-white/80 transition-colors hover:text-white sm:text-4xl"
                >
                  <span>{link.label}</span>
                  <span aria-hidden="true" className="text-accent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    →
                  </span>
                </a>
              ))}
            </nav>

            <div
              ref={(el) => {
                mobileItemRefs.current[nav.length] = el;
              }}
              className="mt-8 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between gap-3 rounded-medium border border-white/10 bg-white/5 p-3 backdrop-blur-md">
                <CtaButton href="#login" onClick={closeMenu}>
                  Iniciar Sesión
                </CtaButton>
                <LangSwitcher />
              </div>
              <CtaButton href="#comunidad" className="w-full justify-center" onClick={closeMenu}>
                Sumate
              </CtaButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

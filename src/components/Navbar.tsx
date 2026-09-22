import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import CtaButton from "./ui/CtaButton";
import LangSwitcher from "./ui/LangSwitcher";
import { site, nav } from "../data/content";
import { useContent, useUi } from "../i18n/useContent";

export default function Navbar() {
  // "nav" estático: hrefs para el scroll-spy y la barra de progreso (no se
  // traducen). Los labels visibles salen de navT, por índice.
  const { nav: navT } = useContent();
  const ui = useUi();
  const { pathname } = useLocation();
  // Los links son anclas ("#seccion") pensadas para la home. Si estamos en
  // otra ruta (ej. el detalle de una noticia), hay que anteponer "/" para
  // que el navegador primero vuelva a la home y después baje a la sección.
  const toHomeAnchor = useCallback(
    (anchor: string) => (pathname === "/" ? anchor : `/${anchor}`),
    [pathname]
  );

  const [activeHref, setActiveHref] = useState<string | null>(null);
  const [navbarTheme, setNavbarTheme] = useState<"dark" | "light">("dark");
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
  const mobileTriggerRef = useRef<HTMLButtonElement | null>(null);

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

  // Tema de la barra mobile (logo blanco u oscuro): qué sección queda justo
  // detrás de la franja donde vive el navbar fijo, para que el logo (sin
  // fondo propio) se siga viendo sobre secciones de fondo claro (Academy,
  // Network, News) igual que sobre las oscuras (Hero, Institutional, etc.).
  useEffect(() => {
    let observer: IntersectionObserver | undefined;
    let rafId: number;
    let attempts = 0;
    const MAX_ATTEMPTS = 240;
    const sectionIds = [
      "inicio",
      "institucional",
      "red-articulacion",
      "mision-vision",
      "academy",
      "media",
      "comunidad",
      "noticias",
      "contacto",
    ];
    const lightSections = new Set(["red-articulacion", "academy", "noticias"]);

    const trySetup = () => {
      const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean) as Element[];

      attempts += 1;
      if (sections.length < sectionIds.length && attempts < MAX_ATTEMPTS) {
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
          setNavbarTheme(lightSections.has(closest.target.id) ? "light" : "dark");
        },
        { rootMargin: "0px 0px -90% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
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

  // Timeline de apertura/cierre del menú full-screen mobile (revelado por
  // clip-path + entrada escalonada de los links), sin tocar el dock desktop.
  useEffect(() => {
    if (!menuRendered) return undefined;
    const overlay = mobileOverlayRef.current;
    const items = mobileItemRefs.current.filter(Boolean) as HTMLElement[];
    if (!overlay) return undefined;

    const ctx = gsap.context(() => {
      if (menuOpen) {
        gsap
          .timeline()
          .fromTo(
            overlay,
            { clipPath: "inset(0 0 100% 0)" },
            { clipPath: "inset(0% 0 0% 0)", duration: 0.7, ease: "power4.out" }
          )
          .fromTo(
            items,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.5,
              ease: "power3.out",
              stagger: 0.06,
              // Sin esto, el transform inline queda pegado en cada item ya
              // terminada la animación y le abre un stacking context nuevo
              // (afecta, por ejemplo, al desplegable de LangSwitcher).
              clearProps: "transform,opacity",
            },
            "-=0.35"
          )
          .call(() => mobileItemRefs.current[0]?.focus());
      } else {
        gsap
          .timeline()
          .to(items, { y: -15, opacity: 0, stagger: 0.03, duration: 0.25, ease: "power2.in" })
          .to(overlay, { clipPath: "inset(0 0 100% 0)", duration: 0.5, ease: "power4.in" }, "-=0.1")
          .call(() => {
            setClosing(false);
            mobileTriggerRef.current?.focus();
          });
      }
    }, overlay);

    return () => ctx.revert();
  }, [menuOpen, menuRendered]);

  // Escape para cerrar y Tab-trap mientras el menú está abierto (mismo
  // patrón que el drawer de Contacto).
  useEffect(() => {
    if (!menuOpen) return undefined;
    const overlay = mobileOverlayRef.current;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMenu();
        return;
      }
      if (e.key === "Tab" && overlay) {
        const focusables = overlay.querySelectorAll<HTMLElement>("a[href], button");
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
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen, closeMenu]);

  return (
    <>
      {/* Dock fijo arriba — tres cápsulas independientes (desktop, >=1280px) */}
      <div className="pointer-events-none fixed inset-x-0 top-6 z-50 hidden items-center justify-center gap-3 xl:flex">
        <a
          href={toHomeAnchor("#inicio")}
          aria-label={ui.goHome}
          className="pointer-events-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-[4px] bg-ink/70 backdrop-blur-lg transition-colors duration-200"
        >
          <img src={site.logo} alt={site.name} className="h-6 w-6 object-contain brightness-0 invert" />
        </a>

        <nav
          aria-label={ui.mainNav}
          className="pointer-events-auto flex h-12 shrink-0 items-center gap-0.5 rounded-[4px] bg-ink/70 px-1.5 backdrop-blur-lg"
        >
          {nav.map((link, index) => (
            <a
              key={link.href}
              href={toHomeAnchor(link.href)}
              aria-current={activeHref === link.href ? "true" : undefined}
              className={`relative shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors duration-200 ${
                activeHref === link.href ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              {navT[index]?.label ?? link.label}
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

        <div className="pointer-events-auto flex h-12 shrink-0 items-center gap-1 rounded-[4px] bg-ink/70 px-1.5 backdrop-blur-lg">
          <a
            href={toHomeAnchor("#login")}
            className="rounded-full px-3.5 py-2 text-[13px] font-medium text-white/60 transition-colors duration-200 hover:text-accent"
          >
            {ui.signIn}
          </a>
        </div>
      </div>

      {/* Navbar mobile / tablet (<1280px) */}
      <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-3 sm:px-6 xl:hidden">
        <a
          href={toHomeAnchor("#inicio")}
          aria-label={ui.goHome}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[4px] transition-colors duration-200"
        >
          <img
            src={site.logo}
            alt={site.name}
            className={`h-6 w-6 object-contain brightness-0 transition-[filter] duration-300 ${
              navbarTheme === "dark" ? "invert" : ""
            }`}
          />
        </a>

        <button
          ref={mobileTriggerRef}
          type="button"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[4px] bg-ink/70 text-white/80 transition-colors duration-300 hover:text-white"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? ui.closeMenu : ui.openMenu}
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
          inert={!menuOpen}
          style={{ clipPath: "inset(0 0 100% 0)" }}
          className="fixed inset-0 z-40 flex flex-col bg-accent xl:hidden"
        >
          <div className="flex-1 overflow-y-auto px-6 pb-10 pt-20 sm:px-10 sm:pt-24">
            {/* min-h-full + flex-col empuja el bloque de CTA/idioma hacia el
                fondo del alto disponible (mt-auto) sin usar position: fixed,
                así nunca se superpone al contenido ni queda pegado al borde. */}
            <div className="flex min-h-full flex-col">
              <nav aria-label={ui.mobileNav} className="flex flex-col">
                {nav.map((link, index) => (
                  <a
                    key={link.href}
                    ref={(el) => {
                      mobileItemRefs.current[index] = el;
                    }}
                    href={toHomeAnchor(link.href)}
                    onClick={closeMenu}
                    className="group flex items-center justify-between border-b border-white/20 py-4 text-3xl font-semibold text-white transition-colors sm:text-4xl"
                  >
                    <span>{navT[index]?.label ?? link.label}</span>
                    <span aria-hidden="true" className="text-secondary opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      →
                    </span>
                  </a>
                ))}
              </nav>

              <div
                ref={(el) => {
                  mobileItemRefs.current[nav.length] = el;
                }}
                className="mt-auto flex flex-col gap-4 pt-8"
              >
                <div className="flex items-center justify-between gap-3 rounded-[4px] bg-white/10 p-3">
                  <CtaButton href={toHomeAnchor("#login")} onClick={closeMenu} squareClassName="bg-secondary">
                    {ui.signIn}
                  </CtaButton>
                  <LangSwitcher dropdownAlign="up" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

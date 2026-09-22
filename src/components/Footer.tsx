import { Link, useLocation } from "react-router-dom";
import { useContent } from "../i18n/useContent";

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8.24h4.56V23H.22V8.24zM8.27 8.24h4.37v2.01h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.47 3.04 5.47 7v8.11h-4.56v-7.19c0-1.72-.03-3.92-2.39-3.92-2.4 0-2.77 1.87-2.77 3.8v7.31H8.27V8.24z" />
    </svg>
  );
}

export default function Footer() {
  const { site, footer } = useContent();
  const { pathname } = useLocation();
  const toHomeAnchor = (anchor: string) => (pathname === "/" ? anchor : `/${anchor}`);

  return (
    <footer className="relative bg-ink px-6 pb-8 pt-16 md:px-10 md:pt-20">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-12 pb-14 md:grid-cols-[1.4fr_1fr_1fr] md:gap-8">
          <div className="flex flex-col gap-4">
            <a href={toHomeAnchor("#inicio")} className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-accent p-2">
                <img src={site.logo} alt={site.name} className="h-full w-full object-contain brightness-0 invert" />
              </span>
              <span className="display-font text-xl font-bold text-white">{site.name}</span>
            </a>
            <p className="max-w-xs text-sm leading-relaxed text-white/50">{footer.description}</p>
            <a href={`mailto:${footer.email}`} className="text-sm text-white/70 transition-colors hover:text-accent">
              {footer.email}
            </a>
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-white/40">
              {footer.navTitle}
            </span>
            <nav className="flex flex-col gap-3">
              {footer.navLinks.map((link) => (
                <a
                  key={link.label}
                  href={toHomeAnchor(link.href)}
                  className="text-sm text-white/60 transition-colors hover:text-accent"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-white/40">
              {footer.socialTitle}
            </span>
            <div className="flex flex-col gap-3">
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-accent"
              >
                <InstagramIcon /> Instagram
              </a>
              <a
                href={site.social.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-accent"
              >
                <LinkedinIcon /> LinkedIn
              </a>
            </div>

            <a
              href={toHomeAnchor("#inicio")}
              aria-label={footer.backToTop}
              className="mt-4 flex h-10 w-10 items-center justify-center rounded-sm border border-white/15 text-white/70 transition-colors duration-300 hover:border-accent/40 hover:text-accent"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/40 md:flex-row md:items-center md:justify-between">
          <span>{footer.copyright}</span>
          <div className="flex gap-6">
            {footer.legal.map((item) =>
              item.href.startsWith("/") ? (
                <Link key={item.label} to={item.href} className="transition-colors hover:text-accent">
                  {item.label}
                </Link>
              ) : (
                // Todavía no hay página para este link (ver Política de privacidad).
                <a key={item.label} href={item.href} className="transition-colors hover:text-accent">
                  {item.label}
                </a>
              ),
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

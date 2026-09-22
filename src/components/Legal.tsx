import type { ReactNode } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Reveal from "./ui/Reveal";
import { useContent, useUi } from "../i18n/useContent";

// El grupo de dominio exige que cada "palabra." se cierre con otra palabra al
// final (no con punto), para no comerse el punto final de la oración cuando
// el mail está al final de un párrafo (ej. "...adeema.org.").
const EMAIL_PATTERN = /([\w.+-]+@(?:[\w-]+\.)+[\w-]+)/g;

/** Convierte cualquier mail suelto dentro de un párrafo en un link mailto:. */
function linkifyEmail(text: string): ReactNode {
  const parts = text.split(EMAIL_PATTERN);
  if (parts.length === 1) return text;

  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <a key={i} href={`mailto:${part}`} className="text-accent hover:underline">
        {part}
      </a>
    ) : (
      part
    ),
  );
}

// Página genérica para /legal/:page — hoy solo existe "terms" (Términos y
// Condiciones) en src/data/content.ts (legalPages); cuando llegue la
// Política de Privacidad se suma como "privacy" ahí, sin tocar este
// componente. Si la ruta no matchea ninguna clave, vuelve al home.
export default function Legal() {
  const { legalPages } = useContent();
  const ui = useUi();
  const { page } = useParams<{ page: string }>();

  const data = page && page in legalPages ? legalPages[page as keyof typeof legalPages] : undefined;
  if (!data) return <Navigate to="/" replace />;

  return (
    <section className="relative bg-paper px-6 pb-28 pt-40 text-ink md:px-10 md:pt-44">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/"
          className="mb-10 inline-block font-mono text-xs font-semibold uppercase tracking-widest text-accent hover:underline"
        >
          ← {ui.back}
        </Link>

        <Reveal>
          <h1 className="display-font mb-2 text-3xl font-bold uppercase leading-[1.05] text-ink md:text-5xl">
            {data.title}
          </h1>
          <p className="mb-10 font-mono text-[11px] font-semibold uppercase tracking-widest text-muted-dark">
            {data.lastUpdated}
          </p>
        </Reveal>

        <Reveal delay={0.05} className="flex flex-col gap-4">
          {data.intro.map((paragraph, i) => (
            <p key={i} className="text-base leading-relaxed text-ink">
              {linkifyEmail(paragraph)}
            </p>
          ))}
        </Reveal>

        <div className="mt-10 flex flex-col gap-10">
          {data.sections.map((section) => (
            <Reveal key={section.heading} y={16}>
              <h2 className="display-font mb-4 text-xl font-bold uppercase text-ink md:text-2xl">
                {section.heading}
              </h2>
              <div className="flex flex-col gap-4">
                {section.paragraphs.map((paragraph, i) => (
                  <p key={i} className="text-base leading-relaxed text-muted-dark">
                    {linkifyEmail(paragraph)}
                  </p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal y={16} className="mt-10 flex flex-col gap-1 border-t border-ink/10 pt-8">
          <h2 className="display-font mb-3 text-xl font-bold uppercase text-ink md:text-2xl">
            {data.contact.heading}
          </h2>
          <p className="text-base font-semibold leading-relaxed text-ink">{data.contact.orgName}</p>
          <p className="text-base leading-relaxed text-muted-dark">
            {data.contact.emailLabel}{" "}
            <a href={`mailto:${data.contact.email}`} className="text-accent hover:underline">
              {data.contact.email}
            </a>
          </p>
          <p className="text-base leading-relaxed text-muted-dark">
            {data.contact.websiteLabel}{" "}
            <a href={data.contact.website} target="_blank" rel="noreferrer" className="text-accent hover:underline">
              {data.contact.website}
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

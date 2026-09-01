import type { ReactNode } from "react";

export interface LegalSection {
  id: string;
  title: string;
  content: ReactNode;
}

export function LegalLayout({
  title,
  lastUpdated,
  sections,
}: {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
}) {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-10 lg:grid-cols-[16rem_1fr]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Contents
        </p>
        <nav className="mt-3 flex flex-col gap-2" aria-label="Table of contents">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {section.title}
            </a>
          ))}
        </nav>
      </aside>
      <article>
        <p className="text-sm text-muted-foreground">Last updated {lastUpdated}</p>
        <h1 className="mt-2 font-display text-4xl">{title}</h1>
        <p className="mt-4 rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-warning-foreground">
          Placeholder policy text for product development. Counsel must review and
          replace this content before any public launch.
        </p>
        {sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-28 mt-10">
            <h2 className="font-display text-2xl">{section.title}</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
              {section.content}
            </div>
          </section>
        ))}
      </article>
    </div>
  );
}

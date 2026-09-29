import type { ReactNode } from "react";

export type LegalSection = {
  id: string;
  title: string;
  body: ReactNode;
};

type LegalDocumentProps = {
  effectiveDate: string;
  readTime: string;
  organization: { name: string; lines: string[]; email: string };
  sections: LegalSection[];
};

export function LegalDocument({ effectiveDate, readTime, organization, sections }: LegalDocumentProps) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono-code text-xs uppercase tracking-wider text-ink-500">
        <span>Effective {effectiveDate}</span>
        <span aria-hidden>·</span>
        <span>{readTime}</span>
      </div>

      <div className="mt-8 max-w-2xl custom-rounded border border-ink-200 bg-pantone-50 p-6 text-sm text-ink-600">
        <p className="font-bold text-ink-900 font-sans-title">{organization.name}</p>
        {organization.lines.map((l) => (
          <p key={l}>{l}</p>
        ))}
        <a href={`mailto:${organization.email}`} className="mt-2 inline-block font-medium text-pantone hover:text-pantone-700">
          {organization.email}
        </a>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[16rem_1fr]">
        <nav aria-label="Table of contents" className="lg:sticky lg:top-28 lg:self-start">
          <p className="font-mono-code text-xs uppercase tracking-wider text-ink-500">Contents</p>
          <ol className="mt-4 space-y-2 text-sm">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="flex gap-2 text-ink-600 transition-colors hover:text-pantone">
                  <span className="font-mono-code text-ink-500">{String(i + 1).padStart(2, "0")}</span>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="max-w-2xl">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-28 border-t border-ink-200 py-8 first:border-t-0 first:pt-0">
              <h2 className="text-xl sm:text-2xl font-bold text-ink-900 font-sans-title">
                <span className="mr-3 font-mono-code text-sm text-pantone">{String(i + 1).padStart(2, "0")}</span>
                {s.title}
              </h2>
              <div className="mt-4 space-y-4 text-ink-600 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">{s.body}</div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";

const columns = [
  { title: "Platform", links: [["Go/No-Go Analysis", "/platform"], ["Tender Repository", "/platform"], ["Bid Studio & Archive", "/platform"]] },
  { title: "Solutions", links: [["Tender Consultancies", "/solutions"], ["Independent Consultants", "/solutions"], ["EPC & OEM Teams", "/solutions"]] },
  { title: "Resources", links: [["Documentation", "/documentation"], ["Blogs", "/documentation#blogs"], ["Workflow Guides", "/documentation"]] },
  { title: "Company", links: [["About", "/company"], ["Pricing", "/#pricing"], ["Privacy", "/privacy"], ["Terms", "/terms"]] },
] as const;

export function Footer() {
  return (
    <footer className="bg-pantone px-8 py-14 text-alabaster sm:px-12 lg:px-16">
      <div className="grid gap-14 lg:grid-cols-[minmax(250px,1.2fr)_repeat(4,minmax(130px,1fr))] lg:gap-10">
        <div>
          <h2 className="max-w-xs text-5xl font-extrabold leading-[0.98] tracking-tight font-sans-title sm:text-6xl">
            Tender<br />Intelligence<br />Done Right
          </h2>
          <p className="mt-10 max-w-sm text-lg leading-relaxed text-alabaster/75">
            Evidence-backed procurement intelligence for teams that analyze, validate, and craft complex bids.
          </p>
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <h3 className="font-mono-code text-xs uppercase tracking-[0.16em] text-alabaster/60">{column.title}</h3>
            <ul className="mt-7 space-y-5">
              {column.links.map(([label, href]) => (
                <li key={label}><Link href={href} className="text-lg leading-7 text-alabaster transition-colors hover:text-alabaster/70">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-16 flex flex-col gap-5 border-t border-alabaster/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <span className="font-mono-code text-xs tracking-[0.12em] text-alabaster/50">© {new Date().getFullYear()} Ficungini.ai — Worldwide</span>
        <div className="flex gap-5 font-mono-code text-xs uppercase tracking-widest text-alabaster/70">
          <a href="https://x.com/ficungini" target="_blank" rel="noopener noreferrer" className="hover:text-alabaster">X</a>
          <a href="https://linkedin.com/company/ficungini" target="_blank" rel="noopener noreferrer" className="hover:text-alabaster">LinkedIn</a>
          <a href="https://instagram.com/ficungini" target="_blank" rel="noopener noreferrer" className="hover:text-alabaster">Instagram</a>
        </div>
      </div>
    </footer>
  );
}

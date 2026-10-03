import Link from "next/link";

const columns: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Platform",
    links: [
      { label: "Go/No-Go Analysis", href: "/platform" },
      { label: "Tender Repository", href: "/platform" },
      { label: "Bid Studio & Archive", href: "/platform" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Tender Consultancies", href: "/solutions" },
      { label: "Independent Consultants", href: "/solutions" },
      { label: "EPC & OEM Teams", href: "/solutions" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/company" },
      { label: "Documentation", href: "/documentation" },
      { label: "Pricing", href: "/#pricing" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Use", href: "/terms" },
      { label: "Security", href: "/privacy#security-measures" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="min-h-[247px] bg-pantone px-[22px] py-[18px] text-alabaster sm:px-8 lg:px-[22px]">
      <div className="mb-14 bg-[#315cf5] px-8 py-12 sm:px-14 sm:py-14 lg:max-w-xl">
        <h2 className="max-w-md text-5xl font-extrabold leading-[0.98] tracking-tight font-sans-title sm:text-6xl">
          Indoor
          <br />
          Monitoring
          <br />
          Done Right
        </h2>
        <p className="mt-10 max-w-md text-lg leading-relaxed text-alabaster/80 sm:text-xl">
          Hardware, software, and installation built around each facility.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="font-mono-code text-xs uppercase tracking-[0.16em] text-alabaster/75">{col.title}</h4>
            <ul className="mt-5 space-y-5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xl leading-7 text-alabaster transition-colors hover:text-alabaster/75"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}

import Link from "next/link";

const columns = [
  {
    title: "Platform",
    links: [
      ["Go/No-Go Analysis", "/platform"],
      ["Tender Repository", "/platform"],
      ["Bid Studio & Archive", "/platform"],
    ],
  },
  {
    title: "Solutions",
    links: [
      ["Tender Consultancies", "/solutions"],
      ["Independent Consultants", "/solutions"],
      ["EPC & OEM Teams", "/solutions"],
    ],
  },
  {
    title: "Resources",
    links: [
      ["Documentation", "/documentation"],
      ["Blogs", "/documentation#blogs"],
      ["Case Studies", "/documentation#case-studies"],
      ["Workflow Guides", "/documentation#workflow-guides"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "/company"],
      ["Pricing", "/#pricing"],
      ["Privacy", "/privacy"],
      ["Terms", "/terms"],
      ["Security", "/privacy#security-measures"],
    ],
  },
] as const;

const socialLinks = [
  {
    "label": "X",
    "path": "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
    "href": "https://x.com/ficungini"
  },
  {
    "label": "LinkedIn",
    "path": "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.446-2.136 2.94v5.666H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.114 20.452H3.56V9h3.554v11.452z",
    "href": "https://linkedin.com/company/ficungini"
  },
  {
    "label": "YouTube",
    "path": "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
    "href": "https://youtube.com/@ficungini"
  },
  {
    "label": "Instagram",
    "path": "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z",
    "href": "https://instagram.com/ficungini"
  }
] as const;

export function Footer() {
  return (
    <footer className="bg-pantone px-8 py-16 text-alabaster sm:px-16 lg:px-20">
      <div className="flex flex-col gap-14 lg:flex-row lg:justify-between">
        <div className="lg:max-w-xs">
          <h2 className="font-sans-title text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Tender Intelligence
            <br />
            Done Right
          </h2>
          <p className="mt-6 max-w-md text-alabaster/70">
            Evidence-backed procurement intelligence for teams that analyze, validate, and craft complex bids.
          </p>
        </div>

        <nav
          aria-label="Footer"
          className="grid grid-cols-2 gap-x-8 gap-y-14 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-10"
        >
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="font-mono-code text-xs uppercase tracking-widest text-alabaster/60">
                {column.title}
              </h3>
              <ul className="mt-5 space-y-4">
                {column.links.map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-alabaster/90 transition-colors hover:text-alabaster focus-visible:outline-2 focus-visible:outline-offset-4"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="font-mono-code text-xs uppercase tracking-widest text-alabaster/60">
              Connect
            </h3>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              {socialLinks.map(({ label, href, path }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-alabaster/90 transition-colors hover:text-alabaster focus-visible:outline-2 focus-visible:outline-offset-4"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </nav>
      </div>

      <div className="mt-16 text-right">
        <span className="font-mono-code text-xs tracking-widest text-alabaster/50">
          © {new Date().getFullYear()} Ficungini.ai — Worldwide
        </span>
      </div>
    </footer>
  );
}

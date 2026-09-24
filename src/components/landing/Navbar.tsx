"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BrainLogo } from "./BrainLogo";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type DropdownItem = {
  label?: string;
  href?: string;
  empty?: boolean;
  colStart?: string;
};

const navItems: {
  label: string;
  href: string;
  intro?: { title: string; cta: string; href: string };
  items?: DropdownItem[];
}[] = [
  {
    label: "Platform",
    href: "/platform",
    intro: { title: "See how Ficungini analyzes every tender", cta: "See overview", href: "/platform" },
    items: [
      { empty: true },
      { label: "Integrations", href: "/platform#integrations" },
      { label: "Explorer", href: "/platform#explorer" },
      { label: "Capabilities", href: "/platform#capabilities" },
    ],
  },
  {
    label: "Solutions",
    href: "/solutions",
    intro: { title: "Solutions built around how your team bids", cta: "See overview", href: "/solutions" },
    items: [
      { empty: true },
      { label: "Tender Discovery", href: "/solutions#tender-discovery" },
      { label: "Bid Workspace", href: "/solutions#bid-workspace" },
      { label: "Market Intelligence", href: "/solutions#market-intelligence" },
      { label: "Human in the Loop", href: "/solutions#human-in-loop", colStart: "lg:col-start-1" },
    ],
  },
  {
    label: "Documentation",
    href: "/documentation",
  },
  {
    label: "Company",
    href: "/company",
    intro: { title: "Meet the people building Ficungini", cta: "See overview", href: "/company" },
    items: [
      { empty: true },
      { label: "Team", href: "/company#team" },
    ],
  },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const activeNav = navItems.find((l) => l.label === activeMenu);
  const activeItems = activeNav?.items;
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const [span, setSpan] = useState<{ left: number; introWidth: number; itemsWidth: number } | null>(null);

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: document.body,
      start: "8px top",
      toggleClass: { targets: headerRef.current, className: "is-scrolled" },
    });
  }, []);

  // Intro block sits below the logo; the item grid starts at "Platform" and ends at the CTA.
  useEffect(() => {
    const measure = () => {
      const header = headerRef.current;
      const logo = logoRef.current;
      const first = firstLinkRef.current;
      const cta = ctaRef.current;
      if (!header || !logo || !first || !cta) return;
      const h = header.getBoundingClientRect();
      const l = logo.getBoundingClientRect();
      const a = first.getBoundingClientRect();
      const b = cta.getBoundingClientRect();
      if (!l.width || !a.width || !b.width) return;
      setSpan({
        left: l.left - h.left,
        introWidth: a.left - l.left,
        itemsWidth: b.right - a.left,
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeMenu]);

  return (
    <header
      ref={headerRef}
      className="site-header sticky top-0 z-[60] border-b border-ink-200 bg-alabaster/90 backdrop-blur-sm"
      onMouseLeave={() => setActiveMenu(null)}
    >
      <div className="mx-auto flex h-[65px] max-w-6xl items-center justify-between px-4 sm:px-0">
        <Link ref={logoRef} href="/" className="flex items-center gap-2.5 text-ink-900 group">
          <BrainLogo className="w-7 h-7 text-pantone" />
          <span className="font-fira-code text-xl font-semibold tracking-tight text-ink-900">
            ficungini<span className="text-pantone">.ai</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((l, i) => (
            <Link
              key={l.label}
              ref={i === 0 ? firstLinkRef : undefined}
              href={l.href}
              onMouseEnter={() => setActiveMenu(l.items ? l.label : null)}
              className="text-sm text-ink-600 transition-colors hover:text-ink-900"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex" onMouseEnter={() => setActiveMenu(null)}>
          <a
            href="https://app.ficungini.ai"
            className="text-sm font-medium text-ink-600 hover:text-ink-900"
          >
            Sign In
          </a>
          <a
            ref={ctaRef}
            href="https://app.ficungini.ai"
            className="custom-rounded bg-pantone px-4 py-2 text-sm font-medium text-alabaster transition-colors hover:bg-pantone-700"
          >
            Analyze a Tender Free
          </a>
        </div>

        <button
          className="text-sm font-medium text-ink-600 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <div
        className={`absolute inset-x-0 top-[65px] hidden border-b border-ink-200 bg-alabaster shadow-lg transition-all duration-200 ease-in-out md:block ${
          activeItems
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="mx-auto flex max-w-6xl px-6 py-6"
          style={span ? { maxWidth: "none", marginLeft: span.left, padding: "1.5rem 0" } : undefined}
        >
          {activeNav?.intro && (
            <div className="shrink-0" style={span ? { width: span.introWidth } : undefined}>
              <p className="max-w-[15rem] text-balance text-lg font-bold leading-snug text-ink-900 font-sans-title">
                {activeNav.intro.title}
              </p>
              <Link
                href={activeNav.intro.href}
                className="mt-3 inline-flex items-center custom-rounded border border-ink-200 bg-white px-4 py-2 text-sm font-medium text-ink-900 transition-colors hover:bg-ink-50"
              >
                {activeNav.intro.cta}
              </Link>
            </div>
          )}
          <div
            className="grid grid-cols-3 content-start gap-2"
            style={span ? { width: span.itemsWidth } : { flex: 1 }}
          >
            {activeItems
              ?.filter((it) => !it.empty)
              .map(({ label, href, colStart }) => (
                <Link
                  key={label}
                  href={href ?? "#"}
                  className={`block custom-rounded border border-ink-200/80 bg-gradient-to-br from-white/70 to-pantone-50/60 px-3 py-4 text-[13px] font-medium text-ink-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_4px_16px_-6px_rgba(5,11,46,0.15)] backdrop-blur-md transition-colors hover:border-pantone/40 hover:bg-white/60 ${
                    colStart ?? ""
                  }`}
                >
                  {label}
                </Link>
              ))}
          </div>
        </div>
      </div>

      <div
        className="grid overflow-hidden bg-alabaster transition-[grid-template-rows] duration-300 ease-in-out md:hidden"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="border-t border-ink-200 px-6 py-4">
            <nav className="flex flex-col gap-1">
              {navItems.map((l) =>
                l.items ? (
                  <div key={l.label} className="border-b border-ink-200 last:border-b-0">
                    <button
                      onClick={() => setMobileExpanded((cur) => (cur === l.label ? null : l.label))}
                      className="flex w-full items-center justify-between py-3 text-sm text-ink-600"
                      aria-expanded={mobileExpanded === l.label}
                    >
                      {l.label}
                      <span aria-hidden className="text-ink-500">
                        {mobileExpanded === l.label ? "–" : "+"}
                      </span>
                    </button>
                    <div
                      className="grid overflow-hidden transition-[grid-template-rows] duration-200 ease-in-out"
                      style={{ gridTemplateRows: mobileExpanded === l.label ? "1fr" : "0fr" }}
                    >
                      <div className="overflow-hidden">
                        <div className="flex flex-col gap-3 pb-3 pl-4">
                          {l.items
                            .filter((it) => !it.empty)
                            .map(({ label, href }) => (
                              <Link
                                key={label}
                                href={href ?? "#"}
                                className="block text-sm text-ink-600 hover:text-ink-900"
                                onClick={() => setOpen(false)}
                              >
                                {label}
                              </Link>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={l.label}
                    href={l.href}
                    className="border-b border-ink-200 py-3 text-sm text-ink-600 last:border-b-0 hover:text-ink-900"
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </Link>
                )
              )}
              <div className="mt-2 flex flex-col gap-3 border-t border-ink-200 pt-4">
                <a href="https://app.ficungini.ai" className="text-sm font-medium text-ink-600">
                  Sign In
                </a>
                <a
                  href="https://app.ficungini.ai"
                  className="custom-rounded bg-pantone px-4 py-2 text-center text-sm font-medium text-alabaster"
                  onClick={() => setOpen(false)}
                >
                  Analyze a Tender Free
                </a>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

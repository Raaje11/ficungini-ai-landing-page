import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { BookOpen, Compass, LayoutGrid, ShieldCheck } from "lucide-react";
import { StaticPageShell } from "@/components/landing/StaticPageShell";
import { PageHero } from "@/components/landing/PageHero";
import { Reveal } from "@/components/landing/Reveal";

export const metadata: Metadata = {
  title: "Company | Ficungini",
  description:
    "Ficungini brings clarity and rigorous precision to public and private procurement worldwide, built by tender experts, for tender experts.",
};

type Pillar = {
  n: string;
  tag: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  href: string;
};

const pillars: Pillar[] = [
  {
    n: "01",
    tag: "PLATFORM",
    icon: LayoutGrid,
    title: "Platform",
    desc: "Go/No-Go, compliance flags, and market intelligence in one tender workspace.",
    href: "/platform",
  },
  {
    n: "02",
    tag: "SOLUTIONS",
    icon: Compass,
    title: "Solutions",
    desc: "Workflows built around consultancies, independent consultants, and EPC & OEM teams.",
    href: "/solutions",
  },
  {
    n: "03",
    tag: "DOCUMENTATION",
    icon: BookOpen,
    title: "Documentation",
    desc: "Guides and references for setup, integration, and day-to-day analysis.",
    href: "/documentation",
  },
];

type TeamMember = {
  initials: string;
  name: string;
  role: string;
};

const team: TeamMember[] = [
  { initials: "KJ", name: "Kevalkumar S Jadhav", role: "Founder" },
  { initials: "RK", name: "Rahul Kidiyappanavar", role: "Co-founder" },
];

function Divider() {
  return <div aria-hidden className="mx-auto h-px max-w-6xl bg-ink-200" />;
}

export default function CompanyPage() {
  return (
    <StaticPageShell>
      <PageHero
        kicker="COMPANY"
        title="Built by tender experts, for tender experts"
        description="We are headquartered with a mission to bring clarity and rigorous precision to public and private procurement worldwide."
      />

      <Divider />

      <div className="mx-auto grid max-w-6xl border-y border-ink-200 sm:grid-cols-3">
        {pillars.map(({ n, tag, icon: Icon, title, desc, href }, i) => (
          <Reveal key={n} delayMs={i * 80}>
            <Link
              href={href}
              className={`group flex h-full flex-col border-ink-200 transition-colors ${
                i > 0 ? "border-t sm:border-t-0 sm:border-l" : ""
              }`}
            >
              <div className="flex items-center justify-between border-b border-ink-200 px-6 py-4 font-mono-code text-sm text-pantone">
                {n} / {tag}
              </div>
              <div className="flex flex-1 flex-col justify-between gap-8 bg-gradient-to-b from-pantone-50 to-white p-6 transition-colors group-hover:from-pantone-100">
                <div className="flex h-16 w-16 items-center justify-center custom-rounded bg-pantone text-alabaster shadow">
                  <Icon className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-ink-900 font-sans-title">{title}</h3>
                  <p className="mt-2 text-sm text-ink-600">{desc}</p>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>

      <Divider />

      <div id="team" className="mx-auto max-w-6xl px-6 py-16 scroll-mt-24">
        <Reveal className="max-w-2xl mb-12">
          <span className="inline-flex items-center custom-rounded bg-pantone-100 px-3 py-1.5 font-mono-code text-xs uppercase tracking-wider text-pantone-700">
            Team
          </span>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-ink-900 font-sans-title">
            The people behind Ficungini.
          </h2>
          <p className="mt-4 text-base text-ink-600 leading-relaxed">
            A small team building the platform end to end.
          </p>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 sm:max-w-2xl">
          {team.map((member, i) => (
            <Reveal key={member.name} delayMs={100 * (i + 1)}>
              <div className="custom-rounded border border-ink-200 p-6">
                <div className="flex h-12 w-12 items-center justify-center custom-rounded bg-pantone-100 font-mono-code text-sm font-bold text-pantone-700">
                  {member.initials}
                </div>
                <h3 className="mt-4 text-lg font-bold text-ink-900 font-sans-title">{member.name}</h3>
                <p className="mt-1 text-sm text-ink-600">{member.role}</p>
                <p className="mt-0.5 text-xs text-ink-500">Ficungini</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <Divider />

      <Reveal className="mx-auto max-w-4xl px-6 py-16 text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-ink-500">
          <ShieldCheck className="h-4 w-4 text-pantone" />
          Trusted by consultancies, independent bid experts, and EPC teams.
        </div>
      </Reveal>
    </StaticPageShell>
  );
}

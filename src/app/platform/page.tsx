import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Building2, FileSearch, FileWarning, Lock, MousePointerClick, TrendingUp } from "lucide-react";
import { StaticPageShell } from "@/components/landing/StaticPageShell";
import { PageHero } from "@/components/landing/PageHero";
import { Reveal } from "@/components/landing/Reveal";
import { FeatureGrid, type Feature } from "@/components/landing/FeatureGrid";
import { PlatformExplorer } from "@/components/landing/PlatformExplorer";

export const metadata: Metadata = {
  title: "Platform | Ficungini",
  description:
    "Go/No-Go recommendations, clause-level compliance flags, and market intelligence in one tender workspace.",
};

const capabilities: Feature[] = [
  {
    n: "01",
    tag: "Decision",
    icon: BadgeCheck,
    title: "Go / No-Go recommendation",
    desc: "Know whether the opportunity is worth pursuing before investing hours in drafting.",
  },
  {
    n: "02",
    tag: "Compliance",
    icon: FileWarning,
    title: "Requirements needing verification",
    desc: "Identify exact clauses and compliance items that need expert review and sign-off.",
  },
  {
    n: "03",
    tag: "Clarity",
    icon: FileSearch,
    title: "Clauses requiring clarification",
    desc: "Detect conflicting conditions, ambiguities, and corrigenda that need formal queries.",
  },
  {
    n: "04",
    tag: "Intelligence",
    icon: TrendingUp,
    title: "Critical eligibility observations",
    desc: "Uncover decisive eligibility nuances and market context before submission.",
  },
];

const integrationPoints = [
  {
    icon: MousePointerClick,
    title: "One-click connect",
    desc: "Authorize a connection once, with no custom integration project or engineering queue.",
  },
  {
    icon: Lock,
    title: "Encrypted, read-only both ways",
    desc: "Data moves over an encrypted API connection using GET requests only. Ficungini reads from your ERP, and your ERP reads from Ficungini. Neither side gets write access.",
  },
  {
    icon: Building2,
    title: "Any ERP with an API",
    desc: "If your ERP permits API access, we can connect to it to draw on project, financial, and document records.",
  },
];

function Divider() {
  return <div aria-hidden className="mx-auto h-px max-w-6xl bg-ink-200" />;
}

export default function PlatformPage() {
  return (
    <StaticPageShell>
      <PageHero
        kicker="PLATFORM"
        title="Winning starts long before the proposal is written."
        description="The quality of a bid depends on the decisions behind it: eligibility, compliance, clarifications, commercial strategy, and market context. Ficungini brings them together in one place."
      />

      <Divider />

      <div id="integrations" className="mx-auto max-w-6xl px-6 py-16 scroll-mt-24">
        <Reveal>
          <div className="custom-rounded border border-ink-200 bg-gradient-to-b from-pantone-50 to-white p-8 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-12">
              <div>
                <span className="inline-flex items-center custom-rounded bg-white px-3 py-1.5 font-mono-code text-xs uppercase tracking-wider text-pantone">
                  Integrations
                </span>
                <h2 className="mt-5 text-2xl sm:text-3xl font-bold text-ink-900 font-sans-title">
                  One-click, encrypted, GET-only integration with your ERP.
                </h2>
                <p className="mt-4 text-ink-600">
                  Ficungini works with any ERP that allows API access. Access is GET-only in both directions:
                  Ficungini can only read from your ERP, and your ERP can only read from Ficungini. Neither side can
                  create, change, or delete anything in the other. Ficungini also runs any
                  tender you upload directly, from any procuring authority and in any format.
                </p>
                <Link
                  href="/documentation"
                  className="group mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-pantone transition-colors hover:text-pantone-700"
                >
                  View Integration Documentation
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-in-out group-hover:translate-x-0.5" />
                </Link>
              </div>
              <ul className="grid gap-3">
                {integrationPoints.map(({ icon: Icon, title, desc }) => (
                  <li
                    key={title}
                    className="flex items-start gap-4 custom-rounded border border-ink-200 bg-white p-5"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center custom-rounded bg-pantone-100 text-pantone-700">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-ink-900 font-sans-title">{title}</h3>
                      <p className="mt-1 text-sm text-ink-600">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>

      <Divider />

      <div id="explorer" className="mx-auto max-w-6xl px-6 py-16 scroll-mt-24">
        <Reveal>
          <PlatformExplorer />
        </Reveal>
      </div>

      <Divider />

      <div className="mx-auto max-w-6xl px-6 py-16">
        <Reveal>
          <PlatformExplorer />
        </Reveal>
      </div>

      <Divider />

      <div id="capabilities" className="py-16 scroll-mt-24">
        <Reveal className="mx-auto max-w-3xl px-6 text-center mb-12">
          <span className="inline-flex items-center custom-rounded bg-pantone-100 px-3 py-1.5 font-mono-code text-xs uppercase tracking-wider text-pantone-700">
            Capabilities
          </span>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-ink-900 font-sans-title">
            What your team knows before writing a bid
          </h2>
        </Reveal>
        <Reveal>
          <FeatureGrid features={capabilities} />
        </Reveal>
      </div>
    </StaticPageShell>
  );
}

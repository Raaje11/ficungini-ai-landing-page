import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, FileSearch, FileWarning, TrendingUp } from "lucide-react";
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
                  Built for Ficungini. Open to the rest of your document stack.
                </h2>
              </div>
              <div>
                <p className="text-ink-600">
                  The platform runs every tender you upload directly, and it&rsquo;s format-agnostic, so RFPs,
                  corrigenda, and technical annexures from any procuring authority work too. Bring the documents
                  you already have into one place for analysis, drafting, and archive without starting over.
                </p>
                <Link
                  href="/documentation"
                  className="group mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-pantone transition-colors hover:text-pantone-700"
                >
                  View Integration Documentation
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-in-out group-hover:translate-x-0.5" />
                </Link>
              </div>
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

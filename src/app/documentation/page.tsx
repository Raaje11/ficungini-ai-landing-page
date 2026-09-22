import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, BookOpen, Cable, FileText, ShieldCheck, Workflow } from "lucide-react";
import { StaticPageShell } from "@/components/landing/StaticPageShell";
import { PageHero } from "@/components/landing/PageHero";
import { Reveal } from "@/components/landing/Reveal";

export const metadata: Metadata = {
  title: "Documentation | Ficungini",
  description: "Guides and references for setting up, integrating, and running tender analysis with Ficungini.",
};

function Divider() {
  return <div aria-hidden className="mx-auto h-px max-w-6xl bg-ink-200" />;
}

type DocLink = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const docLinks: DocLink[] = [
  {
    icon: BookOpen,
    title: "Getting Started",
    description: "Create a workspace, upload your first tender, and read your first Go/No-Go recommendation.",
  },
  {
    icon: Workflow,
    title: "Workflow Guides",
    description: "How the Repository, Compliance, Bid Studio, and Archive modules fit together end to end.",
  },
  {
    icon: Cable,
    title: "Integration Docs",
    description: "REST references for pulling analysis results and pushing documents into your own systems.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance & Security",
    description: "How tender data is encrypted, scoped to your organization, and retained.",
  },
];

export default function DocumentationPage() {
  return (
    <StaticPageShell>
      <PageHero
        kicker="DOCUMENTATION"
        title="Everything you need to master Ficungini"
        description="Guides, API references for enterprise deployment, and best practices for tender analysis workflows."
      />

      <Divider />

      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-4 sm:grid-cols-2">
          {docLinks.map((d, i) => {
            const Icon = d.icon;
            return (
              <Reveal key={d.title} delayMs={(i % 2) * 70}>
                <a
                  href="#"
                  className="group flex h-full flex-col gap-3 custom-rounded border border-ink-200 bg-white p-6 transition-colors hover:border-pantone"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center custom-rounded bg-pantone-100 text-pantone-700">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-bold text-ink-900 font-sans-title">{d.title}</h3>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-ink-500 transition-all duration-200 ease-in-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-pantone" />
                  </div>
                  <p className="text-sm text-ink-600">{d.description}</p>
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>

      <Divider />

      <div className="mx-auto max-w-6xl px-6 py-16">
        <Reveal>
          <div className="custom-rounded border border-ink-200 bg-gradient-to-b from-pantone-50 to-white p-8 sm:p-10 text-center">
            <span className="inline-flex items-center gap-2 custom-rounded bg-white px-3 py-1.5 font-mono-code text-xs uppercase tracking-wider text-pantone">
              <FileText className="h-3.5 w-3.5" />
              API Reference
            </span>
            <h2 className="mx-auto mt-5 max-w-xl text-2xl sm:text-3xl font-bold text-ink-900 font-sans-title">
              Endpoints, authentication, and schemas for pulling analysis out of the platform.
            </h2>
            <a
              href="#"
              className="group mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-pantone transition-colors hover:text-pantone-700"
            >
              Browse Documentation Hub
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 ease-in-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </Reveal>
      </div>
    </StaticPageShell>
  );
}

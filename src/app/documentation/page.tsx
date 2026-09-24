import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, BookOpen, Cable, ClipboardList, FileText, Scale, ShieldCheck, Workflow } from "lucide-react";
import { benchmarkDimensions, benchmarkTitleByKey, type BenchmarkDimensionKey } from "@/components/landing/benchmarkData";
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
  href?: string;
};

type CaseStudy = {
  participant: string;
  title: string;
  scenario: string;
  dimensions: BenchmarkDimensionKey[];
  review: string;
};

const YOUTUBE_URL = "https://youtube.com/ficungini-ai";

const caseStudies: CaseStudy[] = [
  {
    participant: "Tender consultancy",
    title: "Compliance review across a multi-tender bid pipeline",
    scenario:
      "A tender consultancy runs the same live procurement documents through Ficungini and its existing workflow, checking which requirements each one identifies as applicable and what evidence supports them.",
    dimensions: ["compliance-fidelity", "time-to-first-draft", "value-for-money"],
    review: "Blind, by the firm's senior tender professionals.",
  },
  {
    participant: "EPC bid team",
    title: "Resolving eligibility gaps before submission",
    scenario:
      "An EPC bid team evaluates a complex works tender where eligibility gaps and compliance issues surface late, and compares how each workflow flags them and whether they can be recovered.",
    dimensions: ["complication-resolution", "compliance-fidelity", "strategy-quality"],
    review: "Blind, by experienced bid managers on the team.",
  },
  {
    participant: "Tender consultancy",
    title: "Finding the right opportunities for a specific organization",
    scenario:
      "Given an organization's capabilities, each workflow surfaces relevant open opportunities, and reviewers judge how precisely the results fit what the organization can actually bid for.",
    dimensions: ["tender-discovery", "strategy-quality"],
    review: "Blind, by consultants who know the organization.",
  },
];

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
  {
    icon: Scale,
    title: "Benchmark Methodology",
    description: "How Ficungini is evaluated on real tenders, with blind review by tender professionals.",
    href: "#benchmark-methodology",
  },
  {
    icon: ClipboardList,
    title: "Case Studies",
    description: "Documentaries of pilot evaluations with tender consultancies and EPC bid teams, on our YouTube channel.",
    href: "#case-studies",
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
                  href={d.href ?? "#"}
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

      <div id="benchmark-methodology" className="mx-auto max-w-6xl scroll-mt-32 px-6 py-16">
        <Reveal>
          <span className="block font-mono-code text-sm font-medium text-pantone">BENCHMARK METHODOLOGY</span>
          <h2 className="mt-4 max-w-2xl text-2xl sm:text-3xl font-bold text-ink-900 font-sans-title">
            How the Tender Intelligence Benchmark is run.
          </h2>
          <p className="mt-4 max-w-2xl text-ink-600">
            Pilot evaluations are conducted with tender consultancy firms and EPC bid teams using real procurement
            documents. Each tender is processed with the same requirements, and outputs are reviewed blind by
            experienced tender professionals, who are not told which system produced which output. Results are
            published only after the evaluation process is complete.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benchmarkDimensions.map((d, i) => (
            <Reveal key={d.key} delayMs={(i % 3) * 70}>
              <div className="flex h-full flex-col gap-2 custom-rounded border border-ink-200 bg-white p-6">
                <span className="font-mono-code text-xs text-pantone">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-base font-bold text-ink-900 font-sans-title">{d.title}</h3>
                <p className="text-sm text-ink-600">{d.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <Divider />

      <div id="case-studies" className="mx-auto max-w-6xl scroll-mt-32 px-6 py-16">
        <Reveal>
          <span className="block font-mono-code text-sm font-medium text-pantone">CASE STUDIES</span>
          <h2 className="mt-4 max-w-2xl text-2xl sm:text-3xl font-bold text-ink-900 font-sans-title">
            Pilot case studies, built on the same benchmark.
          </h2>
          <p className="mt-4 max-w-2xl text-ink-600">
            Every case study is structured around the benchmark dimensions above and published as a documentary on our
            YouTube channel, without fabricated evidence.
          </p>
          <a
            href={YOUTUBE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-pantone transition-colors hover:text-pantone-700"
          >
            Watch the case study documentaries on YouTube
            <ArrowUpRight className="h-4 w-4 transition-transform duration-200 ease-in-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </Reveal>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {caseStudies.map((c, i) => (
            <Reveal key={c.title} delayMs={i * 70}>
              <article className="flex h-full flex-col gap-4 custom-rounded border border-ink-200 bg-white p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono-code text-xs uppercase tracking-wider text-ink-500">{c.participant}</span>
                  <span className="custom-rounded bg-pantone-100 px-2 py-0.5 font-mono-code text-[10px] uppercase tracking-wider text-pantone-700">
                    Documentary
                  </span>
                </div>
                <h3 className="text-lg font-bold text-ink-900 font-sans-title">{c.title}</h3>
                <p className="text-sm text-ink-600">{c.scenario}</p>
                <div>
                  <p className="font-mono-code text-xs uppercase tracking-wider text-ink-500">Evaluated on</p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {c.dimensions.map((k) => (
                      <li
                        key={k}
                        className="custom-rounded border border-ink-200 bg-ink-50 px-2.5 py-1 text-xs text-ink-900"
                      >
                        {benchmarkTitleByKey[k]}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="mt-auto border-t border-ink-200 pt-4 text-sm text-ink-600">
                  <span className="font-medium text-ink-900">Review:</span> {c.review}
                </p>
                <a
                  href={YOUTUBE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-sm font-medium text-pantone transition-colors hover:text-pantone-700"
                >
                  Watch on YouTube
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-200 ease-in-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </article>
            </Reveal>
          ))}
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

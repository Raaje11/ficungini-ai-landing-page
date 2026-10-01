import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { benchmarkDimensions, benchmarkTitleByKey, type BenchmarkDimensionKey } from "@/components/landing/benchmarkData";
import { blogPosts } from "@/content/blogs";
import { StaticPageShell } from "@/components/landing/StaticPageShell";
import { PageHero } from "@/components/landing/PageHero";
import { Reveal } from "@/components/landing/Reveal";

export const metadata: Metadata = {
  title: "Documentation | Ficungini",
  description: "Benchmark methodology, whitepaper, case studies, blogs, workflow guides, and our privacy policy and terms of use.",
};

function Divider() {
  return <div aria-hidden className="mx-auto h-px max-w-6xl bg-ink-200" />;
}

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

const workflowGuides = [
  {
    title: "Bid Analysis",
    description: "Upload a tender and get a requirement-level read of eligibility, compliance, and a Go/No-Go recommendation.",
  },
  {
    title: "Craft Bid",
    description: "Turn an analysed tender into a structured, reviewable bid draft, with your team in the loop.",
  },
];

const comingSoon: { id: string; kicker: string; title: string; body: string }[] = [
  {
    id: "whitepaper",
    kicker: "WHITEPAPER",
    title: "The Tender Intelligence Benchmark whitepaper.",
    body: "The full write-up of the benchmark dimensions, evaluation design, and results is being prepared and will be published here once the evaluation process is complete.",
  },
];

export default function DocumentationPage() {
  return (
    <StaticPageShell>
      <PageHero
        kicker="DOCUMENTATION"
        title="Everything you need to master Ficungini"
        description="Benchmark methodology, whitepaper, case studies, blogs, and workflow guides."
      />

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
        <Reveal>
          <div className="mt-10 custom-rounded border border-ink-200 bg-pantone-50 p-6 sm:p-8">
            <h3 className="text-lg font-bold text-ink-900 font-sans-title">
              Why tender AI needs a domain-specific benchmark
            </h3>
            <ul className="mt-4 grid gap-4 text-sm text-ink-600 sm:grid-cols-2">
              <li>
                <span className="font-medium text-ink-900">General benchmarks measure the wrong thing.</span> Reasoning
                and coding scores don&apos;t show whether a system caught the turnover threshold buried in a corrigendum.
              </li>
              <li>
                <span className="font-medium text-ink-900">Errors are costly and lopsided.</span> A missed eligibility
                clause can disqualify a bid, and a wrong Go or No-Go wastes drafting effort or forfeits a winnable
                contract.
              </li>
              <li>
                <span className="font-medium text-ink-900">Ground truth is domain expertise.</span> Only experienced
                tender professionals can judge whether a strategy is defensible and competitive.
              </li>
              <li>
                <span className="font-medium text-ink-900">Relevance depends on the organization.</span> A good tender
                for one firm is noise for another, so discovery must be scored against a specific profile and its
                capabilities.
              </li>
            </ul>
          </div>
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

      <div id="workflow-guides" className="mx-auto max-w-6xl scroll-mt-32 px-6 py-16">
        <Reveal>
          <span className="block font-mono-code text-sm font-medium text-pantone">WORKFLOW GUIDES</span>
          <h2 className="mt-4 max-w-2xl text-2xl sm:text-3xl font-bold text-ink-900 font-sans-title">
            Two workflows, from tender to bid.
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {workflowGuides.map((g, i) => (
            <Reveal key={g.title} delayMs={i * 70}>
              <div className="flex h-full flex-col gap-2 custom-rounded border border-ink-200 bg-white p-6">
                <span className="font-mono-code text-xs text-pantone">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-base font-bold text-ink-900 font-sans-title">{g.title}</h3>
                <p className="text-sm text-ink-600">{g.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <Divider />

      <div id="blogs" className="mx-auto max-w-6xl scroll-mt-32 px-6 py-16">
        <Reveal>
          <span className="block font-mono-code text-sm font-medium text-pantone">BLOGS</span>
          <h2 className="mt-4 max-w-2xl text-2xl font-bold text-ink-900 font-sans-title sm:text-3xl">
            Four field notes for bids that hold up under scrutiny.
          </h2>
          <p className="mt-4 max-w-2xl text-ink-600">
            Practical thinking on evidence, complications, drafting and the process metrics that make tender work
            stronger.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {blogPosts.map((post, i) => (
            <Reveal key={post.slug} delayMs={i * 70}>
              <article className="flex h-full flex-col gap-5 custom-rounded border border-ink-200 bg-white p-6 transition-colors hover:border-pantone-300 sm:p-8">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono-code text-xs uppercase tracking-wider text-pantone">
                    {post.number} / {post.concept}
                  </span>
                  <span className="font-mono-code text-[10px] uppercase tracking-wider text-ink-500">
                    {post.readTime}
                  </span>
                </div>
                <h3 className="max-w-xl text-2xl font-bold text-ink-900 font-sans-title">{post.title}</h3>
                <p className="text-base leading-relaxed text-ink-600">{post.excerpt}</p>
                <Link
                  href={`/documentation/blogs/${post.slug}`}
                  className="group mt-auto inline-flex items-center gap-2 text-sm font-medium text-pantone transition-colors hover:text-pantone-700"
                >
                  Read the field note
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-200 ease-in-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      {comingSoon.map((c) => (
        <div key={c.id}>
          <Divider />
          <div id={c.id} className="mx-auto max-w-6xl scroll-mt-32 px-6 py-16">
            <Reveal>
              <span className="block font-mono-code text-sm font-medium text-pantone">{c.kicker}</span>
              <h2 className="mt-4 max-w-2xl text-2xl sm:text-3xl font-bold text-ink-900 font-sans-title">{c.title}</h2>
              <p className="mt-4 max-w-2xl text-ink-600">{c.body}</p>
            </Reveal>
          </div>
        </div>
      ))}
    </StaticPageShell>
  );
}

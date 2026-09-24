import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { TextRevealHeading, TextRevealParagraph } from "./TextReveal";

export function Hero() {
  return (
    <section className="relative hero-gradient overflow-hidden border-b border-ink-200">
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 text-center">
        <span className="mb-6 block font-mono-code text-sm font-medium uppercase tracking-wider text-pantone">
          The Tender Intelligence Workspace
        </span>

        <TextRevealHeading className="mx-auto max-w-4xl text-4xl sm:text-6xl font-extrabold tracking-tight text-ink-900 leading-[1.15] font-sans-title">
          Turn complex tenders into{" "}
          <span className="text-pantone">actionable bids.</span>
        </TextRevealHeading>

        <TextRevealParagraph className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-ink-600 leading-relaxed">
          Discover the right opportunities. Understand every requirement. Resolve complications. Build the strategy.
          Craft the bid. Keep working from evidence through submission.
        </TextRevealParagraph>

        <Reveal delayMs={200}>
          <div className="mx-auto mt-10 flex max-w-md flex-col gap-3">
            <a
              href="https://app.ficungini.ai"
              className="group flex items-center justify-center gap-2 custom-rounded bg-pantone px-6 py-4 text-base font-medium text-alabaster shadow-lg shadow-pantone/20 transition-colors hover:bg-pantone-700"
            >
              Analyze a Tender Free
              <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-in-out group-hover:translate-x-0.5" />
            </a>
            <Link
              href="/platform"
              className="flex items-center justify-center custom-rounded border border-ink-200 bg-white px-6 py-4 text-base font-medium text-ink-900 transition-colors hover:bg-ink-50"
            >
              Explore the Platform
            </Link>
          </div>
        </Reveal>

        <Reveal delayMs={300}>
          <p className="mx-auto mt-6 max-w-lg text-sm text-ink-500">
            For teams where every clause, qualification, and decision matters.
          </p>
        </Reveal>

        <Reveal delayMs={400} scale>
          <div className="mx-auto mt-16 max-w-5xl custom-rounded border border-ink-200 bg-white text-left shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-ink-200 bg-ink-50 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 custom-rounded bg-ink-300" />
                <div className="h-3 w-3 custom-rounded bg-pantone-400" />
                <div className="h-3 w-3 custom-rounded bg-pantone-600" />
              </div>
              <div className="font-mono-code text-xs text-ink-600 custom-rounded border border-ink-200 bg-white px-3 py-1 shadow-inner">
                tender-analysis-workspace.pdf
              </div>
              <div className="custom-rounded border border-iris/25 bg-iris-100 px-2.5 py-1 text-xs font-semibold text-iris">
                Go Decision: 88% Match
              </div>
            </div>
            <div className="grid grid-cols-1 gap-px bg-ink-200 sm:grid-cols-3">
              <div className="bg-white p-6">
                <div className="mb-2 font-mono-code text-xs font-bold uppercase tracking-wider text-pantone">
                  Recommendation
                </div>
                <h4 className="font-sans-title text-lg font-bold text-ink-900">Go / No-Go</h4>
                <p className="mt-1 text-xs text-ink-500">
                  High eligibility match. Past expressway experience satisfies Clause 4.2.
                </p>
              </div>
              <div className="bg-white p-6">
                <div className="mb-2 font-mono-code text-xs font-bold uppercase tracking-wider text-pantone-700">
                  Verification Needed
                </div>
                <h4 className="font-sans-title text-lg font-bold text-ink-900">3 Clauses Flagged</h4>
                <p className="mt-1 text-xs text-ink-500">
                  JV turnover ratios in Section 7 require expert sign-off.
                </p>
              </div>
              <div className="bg-white p-6">
                <div className="mb-2 font-mono-code text-xs font-bold uppercase tracking-wider text-pantone-800">
                  Market Intelligence
                </div>
                <h4 className="font-sans-title text-lg font-bold text-ink-900">Competitor Trend</h4>
                <p className="mt-1 text-xs text-ink-500">
                  Average bidding margin in regional tenders is 12.4% below estimate.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

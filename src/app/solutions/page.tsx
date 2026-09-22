import type { Metadata } from "next";
import { StaticPageShell } from "@/components/landing/StaticPageShell";
import { PageHero } from "@/components/landing/PageHero";
import { Reveal } from "@/components/landing/Reveal";
import { CheckIcon } from "@/components/landing/Icons";
import { TiltCard } from "@/components/landing/TiltCard";

export const metadata: Metadata = {
  title: "Solutions | Ficungini",
  description:
    "Tender discovery tuned to you, a high-performance bid workspace, market intelligence you can trust, and a human always in the loop.",
};

type SolutionCard = {
  slug: string;
  title: string;
  subheading: string;
  description: string;
  usedFor: string[];
  solves: { label: string; body: string }[];
};

const solutions: SolutionCard[] = [
  {
    slug: "tender-discovery",
    title: "Tender Discovery, Tuned to You",
    subheading: "Matched to your track record, not dropped into a generic feed",
    description:
      "New tenders are matched against the specific profile of your firm or desk, not broadcast to everyone. You choose how much you share to sharpen that match, right down to opting out of discovery entirely if privacy is a concern.",
    usedFor: [
      "Prioritizing the tenders worth chasing instead of sifting through irrelevant listings",
      "Controlling exactly how much you share to sharpen your match",
      "Opting out of discovery entirely when a desk prefers to source tenders on its own",
    ],
    solves: [
      { label: "Signal over noise", body: "Fewer, better-matched opportunities instead of a flooded inbox." },
      { label: "Privacy by choice", body: "Discovery is optional. It's never a requirement to use the rest of the platform." },
    ],
  },
  {
    slug: "bid-workspace",
    title: "A High-Performance Bid Workspace",
    subheading: "Built for teams that already know how to win",
    description:
      "Ficungini doesn't replace judgment, it sharpens it. Analysis and drafting happen in the same workspace, so high-performing teams move from a stack of tender documents to a submission-ready bid without losing pace or consistency.",
    usedFor: [
      "Multiple consultants working the same tender without duplicating effort",
      "Moving from requirement analysis straight into drafting, in one workspace",
      "Keeping evidence, analysis, and drafts consistent across the team",
    ],
    solves: [
      { label: "Speed", body: "Far less time spent manually reading and re-reading dense tender documents." },
      { label: "Consistency", body: "The same rigor whether the tender is handled by one person or by twelve." },
    ],
  },
  {
    slug: "market-intelligence",
    title: "Market Intelligence You Can Trust",
    subheading: "Insight built for this tender, not a generic industry report",
    description:
      "Every market read is specific to the tender in front of you, not a recycled summary. It's backed by current tender-traffic activity, deep research into historical patterns in that exact niche, competitive-bidding know-how suited to how this tender will actually play out, and an understanding of the economics of that specific market.",
    usedFor: [
      "Real-time tender-traffic signals instead of stale reports",
      "Historical patterns researched for that particular niche",
      "Competitive-bidding know-how suited to this specific tender",
      "An understanding of the economics of the market the tender sits in",
    ],
    solves: [
      { label: "Pricing confidence", body: "A commercial strategy grounded in evidence, not a guess." },
      { label: "Context before commitment", body: "A read on how a tender is likely to play out before hours are invested." },
    ],
  },
  {
    slug: "human-in-loop",
    title: "A Human in the Loop, Always",
    subheading: "An assistant that works with you, not around you",
    description:
      "Think of it as a capable co-pilot sitting inside your workflow, in the way a coding agent sits inside a developer's: it proposes, checks, and drafts, but every decision can be reviewed and overridden. It does the heavy lifting; your team stays in command of every call that matters.",
    usedFor: [
      "Reviewing and overriding any AI-generated finding before it reaches the bid",
      "Requiring a reason whenever a validated item is changed, checked against existing evidence",
      "Keeping the final call on strategy and submission with your consultants, always",
    ],
    solves: [
      { label: "Control", body: "Nothing reaches a submission without a human sign-off." },
      { label: "Trust", body: "Every AI decision is inspectable, never a black box." },
    ],
  },
];

function Divider() {
  return <div aria-hidden className="mx-auto h-px max-w-6xl bg-ink-200" />;
}

export default function SolutionsPage() {
  return (
    <StaticPageShell>
      <PageHero
        kicker="SOLUTIONS"
        title="Built around how your team actually bids."
        description="Discovery tuned to you, a high-performance workspace, market intelligence you can trust, and a human always in the loop."
      />

      <Divider />

      <div className="mx-auto max-w-6xl px-6 py-16">
        <Reveal className="max-w-2xl mb-12">
          <span className="inline-flex items-center custom-rounded bg-pantone-100 px-3 py-1.5 font-mono-code text-xs uppercase tracking-wider text-pantone-700">
            Solutions
          </span>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-ink-900 font-sans-title">
            What Ficungini actually does
          </h2>
          <p className="mt-4 text-base text-ink-600 leading-relaxed">
            Ficungini doesn&apos;t promise a higher win rate. It gives experienced teams a sharper
            instrument, one that removes the grinding manual work and the guesswork, while every final
            decision stays in human hands.
          </p>
        </Reveal>

        <div className="flex flex-col gap-6">
          {solutions.map((card, i) => (
            <Reveal key={card.title} delayMs={80 * (i + 1)}>
              <TiltCard id={card.slug} className="custom-rounded p-8 scroll-mt-24">
                <div className="relative">
                  <h3 className="text-xl font-bold text-ink-900 font-sans-title">{card.title}</h3>
                  <p className="mt-1 text-sm font-medium text-ink-500">{card.subheading}</p>
                  <p className="mt-4 text-sm text-ink-600 leading-relaxed">{card.description}</p>

                  <div className="mt-6 grid gap-8 lg:grid-cols-2">
                    <div>
                      <h4 className="font-mono-code text-xs uppercase tracking-wider text-ink-500">
                        In practice
                      </h4>
                      <ul className="mt-3 flex flex-col gap-2.5">
                        {card.usedFor.map((point) => (
                          <li key={point} className="flex items-start gap-2.5">
                            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center custom-rounded bg-pantone-100 text-pantone-700">
                              <CheckIcon className="h-3 w-3" />
                            </span>
                            <span className="text-sm text-ink-600">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-mono-code text-xs uppercase tracking-wider text-ink-500">
                        What it solves
                      </h4>
                      <dl className="mt-3 flex flex-col gap-3">
                        {card.solves.map((item) => (
                          <div key={item.label}>
                            <dt className="text-sm font-bold text-ink-900">{item.label}</dt>
                            <dd className="text-sm text-ink-600 leading-relaxed">{item.body}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </StaticPageShell>
  );
}

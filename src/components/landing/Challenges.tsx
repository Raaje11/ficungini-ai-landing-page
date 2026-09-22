import { ArrowRight, CircleAlert, CircleCheck, Info } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

const rows = [
  {
    challenge: {
      title: "Too many tenders to keep track of",
      desc: "Relevant opportunities get buried across portals and mailing lists faster than any one person can watch.",
    },
    advantage: {
      title: "The right leads land in front of you",
      desc: "Ficungini surfaces tenders that fit your business, and you decide how much you share to sharpen the match. It's entirely optional.",
    },
  },
  {
    challenge: {
      title: "Not every lead is worth chasing",
      desc: "A pile of tender notices doesn't tell you which ones you can actually win.",
    },
    advantage: {
      title: "Every lead checked before it reaches you",
      desc: "Each opportunity is weighed against your capabilities, eligibility, sector, and fit before it ever lands on your team's desk.",
    },
  },
  {
    challenge: {
      title: "Corrigenda quietly change the rules",
      desc: "A revised annexure lands mid-cycle and the team is still working from the original document.",
    },
    advantage: {
      title: "Nothing slips past you mid-cycle",
      desc: "Ficungini keeps watch on tender portals so every amendment, corrigendum, and added document reaches you the moment it's published.",
    },
  },
  {
    challenge: {
      title: "Pricing strategy is mostly a guess",
      desc: "Without real market context, commercial strategy comes down to instinct and last year's number.",
    },
    advantage: {
      title: "Pricing backed by real market context",
      desc: "Current tender activity, historical patterns, competitive dynamics, and the economics of your specific niche, all brought together so your number is grounded in something real.",
    },
  },
  {
    challenge: {
      title: "Hidden disqualification clauses",
      desc: "A single missed exemption or eligibility path can knock a bid out before it's even reviewed.",
    },
    advantage: {
      title: "It looks for the way in, not just the rules",
      desc: "Beyond the obvious requirements, Ficungini actively searches for missing qualifications, exemptions, and alternative eligibility paths before you submit.",
    },
  },
  {
    challenge: {
      title: "Sensitive tender data stored indefinitely",
      desc: "Commercially sensitive documents shouldn't sit on a server forever once the deal is done.",
    },
    advantage: {
      title: "Your data leaves when the tender closes",
      desc: "Once a tender closes, Ficungini notifies you, hands over the complete project as a single file to your inbox, and permanently deletes it from the platform.",
    },
  },
];

export function Challenges() {
  return (
    <section>
      <SectionHeader label="Challenges" index={2} total={7} />

      <div className="mx-auto max-w-6xl px-6 py-20">
        <Reveal className="text-center">
          <span className="inline-flex items-center custom-rounded bg-pantone-100 px-3 py-1.5 font-mono-code text-xs uppercase tracking-wider text-pantone-700">
            Real Problems, Not Hypotheticals
          </span>
          <h2 className="mx-auto mt-6 max-w-2xl text-3xl sm:text-4xl font-extrabold tracking-tight text-ink-900 font-sans-title">
            The challenges we solve.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-ink-600">
            The same handful of problems we hear from almost every bid team before they switch to Ficungini.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-3 lg:grid-cols-[1fr_auto_1fr] lg:gap-x-6 lg:gap-y-4">
          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-ink-900">The Challenge</p>
            <p className="mt-1 text-sm text-ink-500">Common problems faced by bid teams</p>
          </div>
          <div aria-hidden className="hidden lg:block" />
          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-ink-900">The Ficungini Solution</p>
            <p className="mt-1 text-sm text-ink-500">How Ficungini helps you overcome them</p>
          </div>

          {rows.map((row, i) => (
            <div key={row.challenge.title} className="contents">
              <Reveal delayMs={80 * i} className="lg:contents">
                <div className="flex items-start gap-4 custom-rounded border border-ink-200 bg-white p-5">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-500">
                    <CircleAlert className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-ink-900">{row.challenge.title}</h3>
                    <p className="mt-1.5 text-sm text-ink-600">{row.challenge.desc}</p>
                  </div>
                </div>
              </Reveal>

              <div className="hidden items-center justify-center lg:flex">
                <ArrowRight className="h-5 w-5 text-ink-400" />
              </div>

              <Reveal delayMs={80 * i + 60} className="lg:contents">
                <div className="flex items-start gap-4 custom-rounded border border-ink-200 bg-white p-5">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pantone-100 text-pantone-700">
                    <CircleCheck className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-ink-900">{row.advantage.title}</h3>
                    <p className="mt-1.5 text-sm text-ink-600">{row.advantage.desc}</p>
                  </div>
                </div>
              </Reveal>
            </div>
          ))}
        </div>

        <Reveal delayMs={80 * rows.length + 120}>
          <div className="mx-auto mt-10 flex max-w-2xl items-start gap-3.5 border-l-2 border-l-pantone border-y border-r border-y-ink-200 border-r-ink-200 bg-pantone-50 custom-rounded p-5">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pantone-100 text-pantone-700">
              <Info className="h-3.5 w-3.5" />
            </span>
            <div>
              <p className="font-mono-code text-xs uppercase tracking-wider text-pantone-700">Privacy note</p>
              <p className="mt-1 text-sm text-ink-600">
                Tender matching is optional. You decide how much business information to share, and match
                quality depends on what you choose to provide.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { TiltCard } from "./TiltCard";

const reasons = [
  {
    title: "One clear view of the market",
    desc: "Several different kinds of market insight brought together into a single strategic read on where a tender stands.",
  },
  {
    title: "Compliance you can point to",
    desc: "Every compliance conclusion is backed by evidence from the tender itself, not a guess.",
  },
  {
    title: "Discovery built around you",
    desc: "Opportunities matched to your organization's specific capabilities and priorities, not dropped into a generic feed.",
  },
  {
    title: "Strategy built for this bid",
    desc: "Competitive advantages, exemptions, and paths to winning identified specifically for the tender in front of you.",
  },
  {
    title: "Every recommendation, traceable",
    desc: "Nothing is a black box. Your team can review, question, and defend every recommendation Ficungini makes.",
  },
  {
    title: "Built for teams that already perform",
    desc: "Made to amplify experienced tender consultants, EPC bid teams, and procurement professionals, while keeping humans in control.",
  },
];

export function WhyFicungini() {
  return (
    <section>
      <SectionHeader label="Why Ficungini" index={1} total={7} />

      <div className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <h2 className="max-w-2xl text-3xl sm:text-4xl font-extrabold tracking-tight text-ink-900 font-sans-title">
            Why bid teams choose Ficungini
          </h2>
          <p className="mt-4 max-w-xl text-ink-600">
            Built to amplify expert judgment with intelligence your team can trace, question, and trust.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r, i) => (
            <Reveal key={r.title} delayMs={70 * (i + 1)}>
              <TiltCard className="custom-rounded p-6 h-full">
                <div className="relative">
                  <h3 className="font-bold text-ink-900 font-sans-title">{r.title}</h3>
                  <p className="mt-2 text-sm text-ink-600">{r.desc}</p>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

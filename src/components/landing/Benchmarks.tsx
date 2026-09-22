import { Check, Play } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { IsoBar } from "./IsoBar";

const compareRows: [string, boolean, boolean, boolean][] = [
  ["Go/No-Go in minutes, not days", true, false, false],
  ["Clause-level compliance flags", true, false, true],
  ["Market intelligence benchmarking", true, false, false],
  ["Draft directly against source clauses", true, true, false],
  ["Reusable, searchable tender archive", true, false, false],
  ["Audit-ready recommendation trail", true, false, true],
];

export function Benchmarks() {
  return (
    <section>
      <SectionHeader label="Benchmarks" index={3} total={7} />

      <div className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <span className="block font-mono-code text-sm font-medium text-pantone">DECISION SPEED</span>
          <h2 className="mt-4 max-w-2xl text-3xl sm:text-4xl font-extrabold tracking-tight text-ink-900 font-sans-title">
            Go/No-Go in minutes,{" "}
            <span className="text-pantone">not the three days manual review takes.</span>
          </h2>
        </Reveal>

        <Reveal delayMs={120}>
          <div className="mt-16 flex items-end justify-center gap-16 custom-rounded border border-ink-200 bg-ink-50/50 px-10 py-14">
            <IsoBar height={190} color="var(--color-pantone)" label="Ficungini" sub="< 5 min" />
            <IsoBar height={90} color="var(--color-pantone-300)" label="Generic AI Tools" sub="~45 min" />
            <IsoBar height={40} color="var(--color-ink-300)" label="Manual Review" sub="~3 days" />
          </div>
        </Reveal>

        <Reveal delayMs={160}>
          <div className="relative mt-16 flex aspect-video items-center justify-center overflow-hidden custom-rounded bg-gradient-to-br from-ink-900 to-pantone-900">
            <div className="absolute inset-0 flex items-center justify-center text-6xl sm:text-8xl font-black uppercase italic tracking-tight text-white/10">
              Decide With Confidence
            </div>
            <div className="absolute left-6 top-6 flex items-center gap-3 text-white">
              <div className="h-10 w-10 rounded-full bg-white/20" />
              <div>
                <p className="text-sm font-medium">Ficungini is built for the pressure of bid week</p>
                <p className="text-xs text-white/70">Founder, Ficungini</p>
              </div>
            </div>
            <button
              aria-label="Play video"
              className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-pantone text-alabaster shadow-xl transition-transform hover:scale-105"
            >
              <Play className="h-6 w-6 fill-current ml-0.5" />
            </button>
          </div>
        </Reveal>

        <Reveal delayMs={200}>
          <div className="mt-16 overflow-x-auto custom-rounded border border-ink-200">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-ink-200 bg-ink-50">
                  <th className="px-6 py-4 font-mono-code text-xs uppercase tracking-wider text-ink-500">Feature</th>
                  <th className="px-6 py-4">
                    <span className="flex items-center gap-2 text-ink-900">
                      Ficungini
                      <span className="custom-rounded bg-pantone px-2 py-0.5 text-[10px] font-bold uppercase text-alabaster">
                        Best
                      </span>
                    </span>
                  </th>
                  <th className="px-6 py-4 text-ink-500">Generic AI Tools</th>
                  <th className="px-6 py-4 text-ink-500">Manual Review</th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map(([feature, a, b, c]) => (
                  <tr key={feature} className="border-b border-ink-200 last:border-0">
                    <td className="px-6 py-4 text-ink-900">{feature}</td>
                    <td className="px-6 py-4">{a && <Check className="h-4 w-4 text-pantone" />}</td>
                    <td className="px-6 py-4">{b && <Check className="h-4 w-4 text-ink-500" />}</td>
                    <td className="px-6 py-4">{c && <Check className="h-4 w-4 text-ink-500" />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { BookDemoButton } from "./BookDemoButton";
import { benchmarkDimensions } from "./benchmarkData";

const blindSteps = ["Same tender.", "Same requirements.", "Blind evaluation."];

export function Benchmarks() {
  return (
    <section id="benchmarks">
      <SectionHeader label="Benchmarks" index={3} total={7} />

      <div className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <span className="block font-mono-code text-sm font-medium text-pantone">TENDER INTELLIGENCE BENCHMARK</span>
          <h2 className="mt-4 max-w-2xl text-3xl sm:text-4xl font-extrabold tracking-tight text-ink-900 font-sans-title">
            Measured on <span className="text-pantone">what matters in real tender work.</span>
          </h2>
          <p className="mt-6 max-w-2xl text-lg text-ink-600">
            Ficungini is evaluated on the capabilities that directly affect tender outcomes—not model benchmarks, token
            counts, or AI-generated scores.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benchmarkDimensions.map((d, i) => (
            <Reveal key={d.key} delayMs={(i % 3) * 70}>
              <div className="flex h-full flex-col gap-3 custom-rounded border border-ink-200 bg-white p-6">
                <span className="font-mono-code text-xs text-pantone">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-base font-bold text-ink-900 font-sans-title">{d.title}</h3>
                <p className="text-sm text-ink-600">{d.description}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delayMs={80}>
          <div className="mt-16 grid gap-10 custom-rounded border border-ink-200 bg-ink-50/50 p-8 sm:p-10 lg:grid-cols-2">
            <div>
              <span className="block font-mono-code text-xs uppercase tracking-wider text-pantone">
                Independent evaluation
              </span>
              <h3 className="mt-4 text-2xl font-bold text-ink-900 font-sans-title">
                Real tenders. Real bid teams. Independent professional review.
              </h3>
              <p className="mt-4 text-ink-600">
                Ficungini is assessed against other tender workflows without revealing which output was produced by
                which system.
              </p>
            </div>
            <ol className="flex flex-col justify-center gap-3">
              {blindSteps.map((s, i) => (
                <li
                  key={s}
                  className="flex items-center gap-4 custom-rounded border border-ink-200 bg-white px-5 py-4"
                >
                  <span className="font-mono-code text-xs text-pantone">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-base font-semibold text-ink-900 font-sans-title">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>

        <Reveal delayMs={120}>
          <div className="mt-16 custom-rounded border border-ink-200 bg-gradient-to-b from-pantone-50 to-white p-8 sm:p-10 text-center">
            <span className="block font-mono-code text-xs uppercase tracking-wider text-pantone">
              Benchmark methodology
            </span>
            <p className="mx-auto mt-4 max-w-2xl text-ink-600">
              Pilot evaluations are conducted with tender consultancy firms and EPC bid teams using real procurement
              documents. Results are published only after the evaluation process is complete.
            </p>
            <p className="mx-auto mt-6 max-w-2xl text-lg font-bold text-ink-900 font-sans-title">
              No architectural claims. No model marketing. Just measurable tender performance.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="/documentation#benchmark-methodology"
                className="group inline-flex items-center gap-1.5 custom-rounded border border-ink-200 bg-white px-5 py-2.5 text-sm font-medium text-ink-900 transition-colors hover:bg-ink-50"
              >
                View Benchmark Methodology
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 ease-in-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <BookDemoButton className="custom-rounded bg-pantone px-5 py-2.5 text-sm font-medium text-alabaster transition-colors hover:bg-pantone-700">
                Join the Pilot
              </BookDemoButton>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

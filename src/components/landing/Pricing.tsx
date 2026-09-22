import { Check, ArrowRight, User, Building2 } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { BookDemoButton } from "./BookDemoButton";

export function Pricing({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section id="pricing">
      <SectionHeader label="Pricing" index={6} total={7} />

      <div className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <h2 className="max-w-xl text-3xl sm:text-4xl font-extrabold tracking-tight text-ink-900 font-sans-title">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 max-w-lg text-ink-600">
            Every capability is included in both plans. Choose what fits how your team works.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Reveal delayMs={100} className="flex flex-col custom-rounded border border-ink-200 p-8">
            <span className="flex h-12 w-12 items-center justify-center custom-rounded bg-pantone text-alabaster shadow">
              <User className="h-5 w-5" />
            </span>
            <span className="mt-6 font-mono-code text-xs font-medium uppercase tracking-widest text-pantone">
              Individual
            </span>
            <h3 className="mt-2 text-2xl font-bold text-ink-900 font-sans-title">Individual</h3>

            <div className="mt-6 border-t border-ink-200 pt-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-ink-900 font-sans-title">₹9,999</span>
                <span className="text-ink-500">/month</span>
              </div>
              <p className="mt-2 text-sm text-ink-600">+ applicable GST. Complete platform access with monthly usage limits.</p>
            </div>

            <button
              onClick={onGetStarted}
              className="mt-6 flex items-center justify-center gap-2 custom-rounded border border-dashed border-ink-200 px-6 py-4 text-sm font-medium text-pantone transition-colors hover:bg-ink-50"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="mt-8 border-t border-ink-200 pt-6">
              <p className="text-xs font-medium uppercase tracking-wider text-ink-500">Includes</p>
              <ul className="mt-4 space-y-4 text-sm">
                {["Tender Intelligence", "Tender Repository", "Bid Studio & Archive"].map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 custom-rounded border border-pantone/40 text-pantone" />
                    <span className="text-ink-600">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal
            delayMs={200}
            className="flex flex-col custom-rounded border border-pantone bg-pantone-50/60 p-8 shadow-sm"
          >
            <span className="flex h-12 w-12 items-center justify-center custom-rounded bg-pantone text-alabaster shadow">
              <Building2 className="h-5 w-5" />
            </span>
            <span className="mt-6 font-mono-code text-xs font-medium uppercase tracking-widest text-pantone">
              Business
            </span>
            <h3 className="mt-2 text-2xl font-bold text-ink-900 font-sans-title">Business</h3>

            <div className="mt-6 border-t border-ink-200 pt-6">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-ink-900 font-sans-title">Request a Quote</span>
              </div>
              <p className="mt-2 text-sm text-ink-600">For consultancy firms and organizations with multi-seat needs.</p>
            </div>

            <BookDemoButton className="mt-6 flex items-center justify-center gap-2 custom-rounded bg-pantone px-6 py-4 text-sm font-medium text-alabaster transition-colors hover:bg-pantone-700">
              Book a Demo
              <ArrowRight className="h-4 w-4" />
            </BookDemoButton>

            <div className="mt-8 border-t border-ink-200 pt-6">
              <p className="text-xs font-medium uppercase tracking-wider text-ink-500">
                Everything in Individual, plus
              </p>
              <ul className="mt-4 space-y-4 text-sm">
                {["Collaborative workspaces", "Organizational deployment", "Priority support & onboarding"].map(
                  (f) => (
                    <li key={f} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 custom-rounded border border-pantone/40 text-pantone" />
                      <span className="text-ink-600">{f}</span>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

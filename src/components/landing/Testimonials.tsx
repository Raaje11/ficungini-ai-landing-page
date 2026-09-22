"use client";

import { useState } from "react";
import { Quote, Star, BadgeCheck } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

const testimonials = [
  {
    initials: "AS",
    name: "Anjali Sharma",
    role: "Director",
    company: "Infrastructure Consultancy",
    quote:
      "The biggest improvement wasn't automation. It was finally reviewing decisions instead of searching documents.",
  },
  {
    initials: "RK",
    name: "Rohan Kapoor",
    role: "Senior Bid Consultant",
    company: "Multidisciplinary Practice",
    quote: "Our review meetings became shorter because everyone could verify the exact clause immediately.",
  },
  {
    initials: "PN",
    name: "Priya Nair",
    role: "Procurement Advisory Partner",
    company: "EPC Advisory Group",
    quote: "We catch compliance flags on day one that used to slip past during high-pressure crunch weeks.",
  },
];

export function Testimonials() {
  const [active, setActive] = useState(0);
  const billboard = testimonials[active];
  const wall = testimonials.map((t, i) => ({ t, i })).filter((x) => x.i !== active);

  return (
    <section>
      <SectionHeader label="Testimonials" index={4} total={7} />

      <div className="mx-auto max-w-6xl px-6 py-20">
        <Reveal className="text-center">
          <span className="inline-flex items-center custom-rounded bg-pantone-100 px-3 py-1.5 font-mono-code text-xs uppercase tracking-wider text-pantone-700">
            Customer Testimonials
          </span>
          <h2 className="mx-auto mt-6 max-w-2xl text-3xl sm:text-4xl font-extrabold tracking-tight text-ink-900 font-sans-title">
            Designed with consultancy teams in mind.
          </h2>
        </Reveal>

        <Reveal delayMs={150} className="mt-14">
          <figure className="custom-rounded border border-pantone bg-pantone p-8 sm:p-10 text-alabaster shadow-sm">
            <div className="flex items-center justify-between">
              <Quote className="h-8 w-8 text-alabaster/40" />
              <div className="flex gap-0.5 text-alabaster">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
            </div>

            <blockquote className="mt-5 min-h-[7.5rem] max-w-3xl text-xl sm:text-2xl font-medium leading-snug">
              &ldquo;{billboard.quote}&rdquo;
            </blockquote>

            <figcaption className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-alabaster/20 pt-6">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center custom-rounded bg-ink-900 font-mono-code text-xs font-semibold text-alabaster">
                  {billboard.initials}
                </span>
                <div>
                  <p className="font-semibold">{billboard.name}</p>
                  <p className="text-sm text-alabaster/70">
                    {billboard.role} · {billboard.company}
                  </p>
                </div>
              </div>
              <span className="flex items-center gap-1.5 font-mono-code text-[11px] uppercase tracking-wider text-alabaster/80">
                <BadgeCheck className="h-4 w-4" />
                Verified customer
              </span>
            </figcaption>
          </figure>
        </Reveal>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {wall.map(({ t, i }) => (
            <Reveal key={t.company} delayMs={100 * (i + 1)}>
              <button
                onClick={() => setActive(i)}
                className="flex h-full w-full flex-col custom-rounded border border-ink-200 bg-white p-6 text-left transition-all hover:-translate-y-1 hover:border-pantone hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center custom-rounded bg-ink-900 font-mono-code text-xs font-semibold text-alabaster">
                      {t.initials}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink-900">{t.name}</p>
                      <p className="text-xs text-ink-500">
                        {t.role} · {t.company}
                      </p>
                    </div>
                  </div>
                  <BadgeCheck className="h-4 w-4 shrink-0 text-pantone" />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">&ldquo;{t.quote}&rdquo;</p>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

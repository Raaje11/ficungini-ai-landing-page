"use client";

import { useState } from "react";
import { Play, BadgeCheck } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

const reviews = [
  {
    company: "Infrastructure Consultancy",
    initials: "IC",
    role: "Director",
    duration: "02:14",
    quote:
      "The biggest improvement wasn't automation. It was finally reviewing decisions instead of searching documents.",
  },
  {
    company: "Multidisciplinary Practice",
    initials: "MP",
    role: "Senior Bid Consultant",
    duration: "01:48",
    quote: "Our review meetings became shorter because everyone could verify the exact clause immediately.",
  },
  {
    company: "EPC Advisory Group",
    initials: "EA",
    role: "Procurement Advisory Partner",
    duration: "02:37",
    quote: "We catch compliance flags on day one that used to slip past during high-pressure crunch weeks.",
  },
  {
    company: "Independent Practice",
    initials: "IP",
    role: "Independent Bid Consultant",
    duration: "01:59",
    quote: "I used to need a second person just to double-check clauses. Now I take on twice the tenders alone.",
  },
];

export function VideoReviews() {
  const [active, setActive] = useState(0);
  const current = reviews[active];
  const first = current.quote.charAt(0);
  const rest = current.quote.slice(1);

  return (
    <section>
      <SectionHeader label="Video Reviews" index={5} total={7} />

      <div className="mx-auto max-w-6xl px-6 py-20">
        <Reveal className="text-center">
          <span className="inline-flex items-center custom-rounded bg-pantone-100 px-3 py-1.5 font-mono-code text-xs uppercase tracking-wider text-pantone-700">
            From the Field
          </span>
          <h2 className="mx-auto mt-6 max-w-2xl text-3xl sm:text-4xl font-extrabold tracking-tight text-ink-900 font-sans-title">
            In their own words
          </h2>
        </Reveal>

        <Reveal delayMs={120}>
          <div className="relative mt-14 overflow-hidden custom-rounded border border-ink-200 bg-white shadow-sm">
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-pantone-100/60"
            />

            <div className="relative grid gap-10 p-8 sm:p-10 md:grid-cols-[220px_1fr]">
              <div>
                <span className="block h-1 w-8 rounded-full bg-pantone" />
                <h3 className="mt-3 text-lg font-bold text-ink-900 font-sans-title">Customer Reviews</h3>

                <div className="relative mt-8 flex flex-col gap-7 pl-2">
                  {reviews.map((r, i) => {
                    const isActive = i === active;
                    return (
                      <button
                        key={r.company}
                        onClick={() => setActive(i)}
                        className="flex items-center gap-3 text-left"
                      >
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 font-mono-code text-[10px] font-semibold transition-colors ${
                            isActive
                              ? "border-pantone bg-pantone-100 text-pantone-700"
                              : "border-ink-200 bg-ink-50 text-ink-500"
                          }`}
                        >
                          {r.initials}
                        </span>
                        <span>
                          <span className={`block text-sm font-medium ${isActive ? "text-ink-900" : "text-ink-500"}`}>
                            {r.company}
                          </span>
                          <span className="mt-0.5 block text-xs text-ink-500">{r.role}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="group relative aspect-video overflow-hidden custom-rounded bg-ink-900">
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ink-800 to-ink-900">
                    <span className="font-mono-code text-3xl font-semibold text-white/20">{current.initials}</span>
                  </div>
                  <button
                    aria-label={`Play video review from ${current.company}`}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-ink-900 shadow-lg transition-transform group-hover:scale-105">
                      <Play className="ml-0.5 h-6 w-6 fill-current" />
                    </span>
                  </button>
                  <div className="absolute bottom-4 right-4 custom-rounded bg-black/60 px-2 py-1 font-mono-code text-[11px] text-white backdrop-blur-sm">
                    {current.duration}
                  </div>
                </div>

                <div className="mt-6">
                  <span className="font-serif text-4xl italic leading-none text-pantone">&ldquo;</span>
                  <p className="-mt-3 font-serif text-xl italic leading-snug text-ink-900">
                    <span className="text-2xl not-italic">{first}</span>
                    {rest}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-dashed border-ink-200 pt-4">
                    <div>
                      <p className="text-sm font-semibold text-ink-900">{current.role}</p>
                      <p className="text-sm text-ink-500">{current.company}</p>
                    </div>
                    <span className="flex items-center gap-1.5 font-mono-code text-[11px] uppercase tracking-wider text-ink-500">
                      <BadgeCheck className="h-3.5 w-3.5 text-pantone" />
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

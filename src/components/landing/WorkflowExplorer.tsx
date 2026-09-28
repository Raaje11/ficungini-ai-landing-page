"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { VideoPanel } from "./PlatformExplorer";

type Workflow = {
  label: string;
  agents: number;
  summary: string;
  duration: string;
  /** walkthrough clip, served from /public/platform */
  video: string;
  poster?: string;
  points: { title: string; desc: string }[];
};

const workflows: Workflow[] = [
  {
    label: "Bid Analysis",
    agents: 6,
    summary: "From discovery to a defensible Go / No-Go, run by six specialized agents.",
    duration: "02:30",
    video: "/platform/bid-analysis.mp4",
    poster: "/platform/bid-analysis.jpg",
    points: [
      {
        title: "Profile-specific discovery",
        desc: "Tenders are matched to your organization's profile, and you're notified only when the call is Go or Conditional Go.",
      },
      {
        title: "Multi-parameter, verifiable market intelligence",
        desc: "Market context is built across multiple parameters, each traceable back to its source so it can be verified.",
      },
    ],
  },
  {
    label: "Craft Bid",
    agents: 8,
    summary: "From strategy to a submission-ready bid, drafted by eight specialized agents.",
    duration: "03:05",
    video: "/platform/craft-bid.mp4",
    poster: "/platform/craft-bid.jpg",
    points: [
      {
        title: "Complication resolution and strategic planning",
        desc: "Specialized AI assistance works through complications in the tender and shapes the bid strategy.",
      },
      {
        title: "Human-assisted AI bid writer",
        desc: "Your team steers the draft, while every claim is back-checked against the evidence-backed analysis and strategy.",
      },
      {
        title: "Niche-specific format and vocabulary",
        desc: "The final bid is formatted and worded the way your sector expects.",
      },
    ],
  },
];

export function WorkflowExplorer() {
  const [active, setActive] = useState(0);
  const current = workflows[active];

  return (
    <div>
      <div role="tablist" aria-label="Workflows" className="flex flex-wrap gap-3">
        {workflows.map((w, i) => {
          const isActive = i === active;
          return (
            <button
              key={w.label}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(i)}
              className={`flex items-center gap-3 custom-rounded border px-5 py-3 text-left transition-colors ${
                isActive
                  ? "border-l-2 border-l-pantone border-y-ink-200 border-r-ink-200 bg-pantone-50"
                  : "border-ink-200 hover:bg-ink-100"
              }`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono-code text-xs ${
                  isActive ? "bg-pantone-100 text-pantone-700" : "bg-ink-100 text-ink-500"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>
                <span className="block text-base font-bold text-ink-900 font-sans-title">{w.label}</span>
                <span className="block font-mono-code text-[11px] uppercase tracking-wider text-ink-500">
                  {w.agents} specialized agents
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[420px_1fr]">
        <div>
          <h3 className="text-2xl font-bold text-ink-900 font-sans-title">{current.label}</h3>
          <p className="mt-2 text-ink-600">{current.summary}</p>

          <ul className="mt-6 flex flex-col gap-4 border-t border-dashed border-ink-200 pt-6">
            {current.points.map((point) => (
              <li key={point.title} className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center custom-rounded bg-pantone-100 text-pantone-700">
                  <Check className="h-3 w-3" />
                </span>
                <span>
                  <span className="block text-sm font-bold text-ink-900">{point.title}</span>
                  <span className="mt-0.5 block text-sm text-ink-600">{point.desc}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <VideoPanel key={current.label} module={current} />
      </div>
    </div>
  );
}

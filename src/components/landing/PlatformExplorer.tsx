"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Play, Check } from "lucide-react";

type Module = {
  label: string;
  summary: string;
  description: string;
  duration: string;
  /** per-module walkthrough clip, served from /public/platform */
  video: string;
  poster?: string;
  points: string[];
};

const modules: Module[] = [
  {
    label: "Go/No-Go",
    summary: "An instant call on every tender",
    description:
      "Eligibility, past-performance match, and strategic fit scored the moment a tender is uploaded, so hours aren't spent drafting a bid that was never worth pursuing.",
    duration: "02:14",
    video: "/platform/go-no-go.mp4",
    poster: "/platform/go-no-go.jpg",
    points: [
      "Eligibility breakdown against clause-level qualification criteria",
      "Strategic match score weighted by past project experience",
      "Flagged risks surfaced before commercial commitment",
      "Click straight from the score to the clause that drove it",
    ],
  },
  {
    label: "Repository",
    summary: "Every tender, structured and searchable",
    description:
      "RFPs, corrigenda, and technical specs ingested and indexed automatically, so nothing is buried in a shared drive when a deadline is close.",
    duration: "01:48",
    video: "/platform/repository.mp4",
    poster: "/platform/repository.jpg",
    points: [
      "Automatic ingestion of RFPs, corrigenda, and technical annexures",
      "Full-text search across every clause in every tender",
      "Version history when corrigenda change requirements mid-cycle",
      "Organized by opportunity, sector, or client in a couple of clicks",
    ],
  },
  {
    label: "Compliance",
    summary: "Clauses that need a human sign-off",
    description:
      "The exact requirements that need expert review, ranked by risk, so verification time goes where it actually matters.",
    duration: "01:59",
    video: "/platform/compliance.mp4",
    poster: "/platform/compliance.jpg",
    points: [
      "Clause-level compliance checklist generated per tender",
      "JV, turnover, and experience thresholds checked automatically",
      "Ambiguities and conflicting conditions flagged for clarification",
      "Filter by risk, section, or reviewer to find what needs attention",
    ],
  },
  {
    label: "Bid Studio",
    summary: "Draft and refine in the same workspace",
    description:
      "Responses drafted against the source clauses directly, with prior submissions on hand, so the proposal and the analysis never drift apart.",
    duration: "02:37",
    video: "/platform/bid-studio.mp4",
    poster: "/platform/bid-studio.jpg",
    points: [
      "Draft responses next to the clause they answer",
      "Reuse prior submissions and approved language across bids",
      "Track open items until every section is sign-off ready",
      "Export a submission-ready package without reformatting",
    ],
  },
  {
    label: "Market Intelligence",
    summary: "Pricing context before you commit",
    description:
      "Regional bidding margins and competitor trends pulled from real procurement data, so the commercial strategy isn't a guess.",
    duration: "01:52",
    video: "/platform/market-intelligence.mp4",
    poster: "/platform/market-intelligence.jpg",
    points: [
      "Average bidding margins for comparable regional tenders",
      "Competitor trends by sector and procuring authority",
      "Historical award data to calibrate a commercial strategy",
      "Filter by geography, sector, or contract value",
    ],
  },
  {
    label: "Archive",
    summary: "Every closed tender becomes knowledge",
    description:
      "Completed tenders stay searchable and reusable, so the next bid starts from what the team already knows instead of from zero.",
    duration: "01:35",
    video: "/platform/archive.mp4",
    poster: "/platform/archive.jpg",
    points: [
      "Closed tenders retained with their full analysis and drafts",
      "Reusable clause responses indexed by topic and outcome",
      "Win/loss context carried forward into the next opportunity",
      "Organization-wide, not siloed to whoever worked the bid",
    ],
  },
];

function VideoPanel({ module }: { module: Module }) {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Fall back to the placeholder if the clip is missing / never loads.
  useEffect(() => {
    const t = setTimeout(() => {
      if (!videoRef.current || videoRef.current.readyState < 1) setFailed(true);
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  const showPlaceholder = failed || !ready;

  return (
    <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden custom-rounded bg-ink-900 lg:min-h-[520px]">
      {!failed && (
        <video
          ref={videoRef}
          className={`h-full w-full object-cover transition-opacity duration-300 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
          src={module.video}
          poster={module.poster}
          controls
          playsInline
          preload="metadata"
          onLoadedMetadata={() => setReady(true)}
          onError={() => setFailed(true)}
        />
      )}

      {showPlaceholder && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg">
            <Play className="ml-0.5 h-6 w-6 fill-current text-ink-900" />
          </span>
          <p className="font-mono-code text-[11px] uppercase tracking-wider text-white/60">
            {module.label} walkthrough
          </p>
        </div>
      )}

      <div className="pointer-events-none absolute bottom-4 right-4 custom-rounded bg-black/60 px-2 py-1 font-mono-code text-[11px] text-white backdrop-blur-sm">
        {module.duration}
      </div>
    </div>
  );
}

export function PlatformExplorer() {
  const [active, setActive] = useState(0);
  const current = modules[active];
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Set on click so the scroll handler doesn't fight the smooth-scroll it triggers.
  const suppressUntilRef = useRef(0);

  // Auto-advance the active module to whichever row sits closest to the
  // viewport's vertical center. Computed directly off scroll position
  // (rAF-throttled) rather than IntersectionObserver, since a threshold-based
  // observer can skip rows entirely on a fast scroll.
  useEffect(() => {
    let ticking = false;

    const computeActive = () => {
      ticking = false;
      if (Date.now() < suppressUntilRef.current) return;

      const viewportCenter = window.innerHeight / 2;
      let closestIdx = -1;
      let closestDist = Infinity;
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top + rect.height / 2 - viewportCenter);
        if (dist < closestDist) {
          closestDist = dist;
          closestIdx = i;
        }
      });
      if (closestIdx !== -1) {
        setActive((prev) => (prev === closestIdx ? prev : closestIdx));
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(computeActive);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    computeActive();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div>
      <div className="grid gap-10 lg:grid-cols-[420px_1fr]">
        <div className="flex flex-col gap-3">
          {modules.map((m, i) => {
            const isActive = i === active;
            return (
              <div
                key={m.label}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                className={`overflow-hidden custom-rounded border transition-colors ${
                  isActive
                    ? "border-l-2 border-l-pantone border-y-ink-200 border-r-ink-200 bg-pantone-50"
                    : "border-ink-200"
                }`}
              >
                <button
                  onClick={() => {
                    setActive(i);
                    suppressUntilRef.current = Date.now() + 700;
                    itemRefs.current[i]?.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  }}
                  aria-expanded={isActive}
                  className="flex w-full items-center gap-4 p-5 text-left"
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono-code text-xs ${
                      isActive ? "bg-pantone-100 text-pantone-700" : "bg-ink-100 text-ink-500"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1">
                    <span className="block text-base font-bold text-ink-900 font-sans-title">{m.label}</span>
                    <span className="mt-0.5 block text-sm text-ink-500">{m.summary}</span>
                  </span>
                  {isActive ? (
                    <ChevronUp className="h-4 w-4 shrink-0 text-ink-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-ink-500" />
                  )}
                </button>

                <div
                  className="grid transition-[grid-template-rows] duration-300 ease-in-out"
                  style={{ gridTemplateRows: isActive ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pb-5">
                      <p className="text-sm text-ink-600">{m.description}</p>

                      <ul className="mt-4 flex flex-col gap-2.5 border-t border-dashed border-ink-200 pt-4">
                        {m.points.map((point) => (
                          <li key={point} className="flex items-start gap-2.5">
                            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center custom-rounded bg-pantone-100 text-pantone-700">
                              <Check className="h-3 w-3" />
                            </span>
                            <span className="text-sm text-ink-600">{point}</span>
                          </li>
                        ))}
                      </ul>

                      {/* On small screens the video sits inside the open section */}
                      {isActive && (
                        <div className="mt-5 lg:hidden">
                          <VideoPanel key={m.label} module={m} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* On large screens the right panel loads the active module's video */}
        <div className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
          <VideoPanel key={current.label} module={current} />
        </div>
      </div>

      <div className="mt-4 grid gap-10 lg:grid-cols-[420px_1fr]">
        <div aria-hidden className="hidden lg:block" />
        <p className="text-sm text-ink-500">Open any module to see how it works.</p>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { ArrowLeft, Check, X } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { chatSpec } from "@/lib/chat/spec";
import FicoOrb from "./FicoOrb";

gsap.registerPlugin(useGSAP);

/** Who Fico is, in a few plain lines: her role, what she does, and where she stops. */
export default function FicoCard({
  onClose,
  onAsk,
  onTeam,
}: {
  onClose: () => void;
  onAsk: () => void;
  onTeam: () => void;
}) {
  const p = chatSpec.ui.card;
  const root = useRef<HTMLDivElement>(null);
  const back = useRef<HTMLButtonElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(root.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25, ease: "power2.out" });
    },
    { scope: root },
  );
  useEffect(() => {
    back.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label={`${p.name}'s profile`}
      className="absolute inset-0 z-20 flex flex-col overflow-hidden bg-white"
    >
      <header className="flex h-[58px] shrink-0 items-center gap-3 border-b border-ink-200 px-3 pt-[env(safe-area-inset-top)] sm:h-16">
        <button
          ref={back}
          type="button"
          onClick={onClose}
          aria-label="Back to the chat"
          className="flex h-9 w-9 items-center justify-center rounded-[2px] text-ink-500 transition-colors hover:bg-ink-100 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pantone"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-base font-bold">{p.name}</h2>
      </header>

      <div className="oc-scroll min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[760px] px-5 pb-8 pt-6">
          <div className="flex items-center gap-4">
            <span role="img" aria-label={`${p.name}, the Ficungini digital aide`} className="block h-20 w-20 shrink-0">
              <FicoOrb />
            </span>
            <div className="min-w-0">
              <h3 className="text-lg font-bold leading-tight">{p.name}</h3>
              <p className="text-sm text-ink-500">{p.subtitle}</p>
              <p className="mt-1 text-sm">{p.bio}</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onAsk}
              className="rounded-[2px] bg-pantone px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-pantone-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pantone"
            >
              {p.ask_label}
            </button>
            <button
              type="button"
              onClick={onTeam}
              className="rounded-[2px] border border-ink-200 bg-white px-4 py-2.5 text-sm font-medium text-black transition-colors hover:border-pantone hover:text-pantone-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pantone"
            >
              {p.team_label}
            </button>
          </div>

          <div className="mt-6 grid gap-5 border-t border-ink-200 pt-5">
            {p.sections.map((s) => (
              <section key={s.title}>
                <h4 className="text-xs font-medium uppercase tracking-wider text-ink-500">{s.title}</h4>
                <ul className="mt-2 flex flex-col gap-2">
                  {s.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm">
                      <span
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[2px] ${
                          s.negative ? "bg-ink-100 text-ink-500" : "bg-pantone-100 text-pantone-700"
                        }`}
                      >
                        {s.negative ? <X className="h-3 w-3" aria-hidden /> : <Check className="h-3 w-3" aria-hidden />}
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

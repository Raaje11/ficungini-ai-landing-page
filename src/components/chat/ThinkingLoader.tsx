"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const COLOR = "var(--pantone)";
const SWEEP = "color-mix(in oklab, var(--pantone) 40%, white)";
const PHRASE_MS = 500;

/**
 * Fico's "working" indicator: a spinning, pulsing glyph and a status line that
 * cycles through phrases with a light sweep across the text.
 */
export default function ThinkingLoader({ phrases }: { phrases: string[] }) {
  const root = useRef<HTMLDivElement>(null);
  const glyph = useRef<SVGSVGElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const [phrase, setPhrase] = useState(0);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      gsap.to(glyph.current, { rotation: 360, duration: 2.4, ease: "none", repeat: -1, transformOrigin: "50% 50%" });
      gsap.to(glyph.current, { scale: 0.78, duration: 0.45, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "50% 50%" });
      gsap.fromTo(
        ".tl-dot",
        { opacity: 0.2, y: 0 },
        { opacity: 1, y: -2, duration: 0.3, ease: "power1.inOut", yoyo: true, repeat: -1, stagger: 0.15 },
      );
      // Light sweep across the status text.
      gsap.fromTo(
        label.current,
        { backgroundPositionX: "150%" },
        { backgroundPositionX: "-50%", duration: 1.1, ease: "none", repeat: -1 },
      );
    },
    { scope: root },
  );

  // Move on to the next status line every half second.
  useEffect(() => {
    if (phrases.length < 2) return;
    const iv = setInterval(() => setPhrase((p) => Math.min(p + 1, phrases.length - 1)), PHRASE_MS);
    return () => clearInterval(iv);
  }, [phrases]);

  // Each new line slides in.
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(label.current, { opacity: 0, y: 4 }, { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" });
    },
    { scope: root, dependencies: [phrase] },
  );

  return (
    <div ref={root} className="flex items-center gap-2" style={{ color: COLOR }}>
      <svg ref={glyph} viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden fill="currentColor">
        <path d="M12 1.5c.5 4.6 1.4 7 3 8.5s3.9 2.5 8.5 3c-4.6.5-7 1.4-8.5 3s-2.5 3.9-3 8.5c-.5-4.6-1.4-7-3-8.5S5.1 13 .5 12.5C5.1 12 7.5 11 9 9.5s2.5-3.9 3-8z" />
      </svg>
      <span
        ref={label}
        className="bg-clip-text text-[13px] font-medium text-transparent"
        style={{
          backgroundImage: `linear-gradient(100deg, ${COLOR} 35%, ${SWEEP} 50%, ${COLOR} 65%)`,
          backgroundSize: "250% 100%",
        }}
      >
        {phrases[Math.min(phrase, phrases.length - 1)]}
      </span>
      <span className="flex items-center gap-0.5" aria-hidden>
        {[0, 1, 2].map((n) => (
          <span key={n} className="tl-dot h-1 w-1 rounded-full" style={{ backgroundColor: COLOR }} />
        ))}
      </span>
      <span className="sr-only">Fico is typing</span>
    </div>
  );
}

"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Reveal({
  children,
  delayMs = 0,
  className = "",
  scale = false,
  y = 24,
}: {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
  /** Animate in from a slightly smaller scale in addition to the fade/slide. */
  scale?: boolean;
  /** Starting vertical offset in px. */
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      gsap.to(el, {
        opacity: 1,
        y: 0,
        ...(scale ? { scale: 1 } : null),
        duration: 0.9,
        delay: delayMs / 1000,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
        },
      });
    },
    { scope: ref, dependencies: [delayMs, scale] },
  );

  return (
    <div
      ref={ref}
      className={`gsap-reveal ${scale ? "gsap-reveal--scale" : ""} ${className}`}
      style={{ "--reveal-y": `${y}px` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

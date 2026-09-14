"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import DrawSVGPlugin from "gsap/DrawSVGPlugin";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(DrawSVGPlugin, ScrollTrigger, useGSAP);

function useDrawOnScroll(ref: React.RefObject<SVGSVGElement | null>, delay: number) {
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const strokes = el.querySelectorAll("path, circle, line, polyline, polygon, rect, ellipse");
      if (!strokes.length) return;

      gsap.set(strokes, { drawSVG: "0%" });
      gsap.to(strokes, {
        drawSVG: "100%",
        duration: 0.6,
        delay,
        ease: "power2.out",
        stagger: 0.04,
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
      });
    },
    { scope: ref, dependencies: [delay] },
  );
}

export function CheckIcon({ className, delay = 0 }: { className?: string; delay?: number }) {
  const ref = useRef<SVGSVGElement>(null);
  useDrawOnScroll(ref, delay);

  return (
    <svg ref={ref} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

export function CloseIcon({ className, delay = 0 }: { className?: string; delay?: number }) {
  const ref = useRef<SVGSVGElement>(null);
  useDrawOnScroll(ref, delay);

  return (
    <svg ref={ref} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export function PopIcon({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      gsap.set(el, { transformOrigin: "50% 50%" });
      gsap.from(el, {
        scale: 0,
        rotate: -25,
        opacity: 0,
        duration: 0.6,
        delay,
        ease: "back.out(1.8)",
        scrollTrigger: { trigger: el, start: "top 95%", once: true },
      });
    },
    { scope: ref, dependencies: [delay] },
  );

  return (
    <svg ref={ref} width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      {children}
    </svg>
  );
}

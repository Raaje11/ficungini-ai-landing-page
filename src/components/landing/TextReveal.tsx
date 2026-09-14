"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useRef } from "react";

gsap.registerPlugin(SplitText, useGSAP);

export function TextRevealHeading({
  children,
  className,
  delay = 0.1,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const split = SplitText.create(el, { type: "lines,words", mask: "lines" });
      gsap.from(split.words, {
        yPercent: 115,
        opacity: 0,
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.035,
        delay,
      });
    },
    { scope: ref, dependencies: [delay] },
  );

  return (
    <h1 ref={ref} className={className}>
      {children}
    </h1>
  );
}

export function TextRevealParagraph({
  children,
  className,
  delay = 0.35,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const split = SplitText.create(el, { type: "lines,words", mask: "lines" });
      gsap.from(split.words, {
        yPercent: 115,
        opacity: 0,
        duration: 0.8,
        ease: "power4.out",
        stagger: 0.025,
        delay,
      });
    },
    { scope: ref, dependencies: [delay] },
  );

  return (
    <p ref={ref} className={className}>
      {children}
    </p>
  );
}

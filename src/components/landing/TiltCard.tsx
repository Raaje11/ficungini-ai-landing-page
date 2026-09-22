"use client";

import { useRef } from "react";

export function TiltCard({
  className = "",
  id,
  children,
}: {
  className?: string;
  id?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    el.style.setProperty("--rx", `${(py - 0.5) * -4}deg`);
    el.style.setProperty("--ry", `${(px - 0.5) * 4}deg`);
    el.style.setProperty("--op", "1");
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--op", "0");
  };

  return (
    <div
      ref={ref}
      id={id}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={`tilt-card border border-ink-200 bg-white ${className}`}
    >
      {children}
    </div>
  );
}

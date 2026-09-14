"use client";

import { useEffect, useState } from "react";

export function Toast({
  message,
  onDone,
}: {
  message: string;
  onDone: () => void;
}) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 3500);
    const removeTimer = setTimeout(onDone, 4000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [onDone]);

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 bg-ink-900 text-alabaster text-sm px-5 py-3 custom-rounded shadow-2xl border border-ink-700 flex items-center space-x-3 animate-bounce transition-opacity duration-500 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-2.5 h-2.5 custom-rounded bg-pantone-500" />
      <span>{message}</span>
    </div>
  );
}

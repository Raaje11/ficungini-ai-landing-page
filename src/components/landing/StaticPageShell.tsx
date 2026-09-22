import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { FinalCta } from "./FinalCta";

export function StaticPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="antialiased selection:bg-pantone selection:text-alabaster">
      <Navbar />
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-1/2 z-50 hidden w-full max-w-6xl -translate-x-1/2 sm:block"
        >
          <div className="absolute inset-y-0 left-0 w-px bg-ink-200" />
          <div className="absolute inset-y-0 right-0 w-px bg-ink-200" />
        </div>
        <main className="flex-1">
          {children}
          <FinalCta />
        </main>
      </div>
      <Footer />
    </div>
  );
}

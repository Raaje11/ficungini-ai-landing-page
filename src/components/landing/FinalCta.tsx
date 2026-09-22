import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { BookDemoButton } from "./BookDemoButton";

export function FinalCta() {
  return (
    <section className="border-t border-ink-200">
      <Reveal className="mx-auto max-w-6xl px-6 py-6 text-center">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
          <a
            href="https://app.ficungini.ai"
            className="group flex w-full sm:w-auto items-center justify-center gap-2 custom-rounded bg-pantone px-8 py-3 text-base font-medium text-alabaster transition-colors hover:bg-pantone-700"
          >
            Analyze a Tender Free
            <ArrowUpRight className="h-4 w-4 transition-transform duration-200 ease-in-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <BookDemoButton className="w-full sm:w-auto custom-rounded border border-ink-200 bg-white px-8 py-3 text-base font-medium text-ink-900 transition-colors hover:bg-ink-50">
            Book a Demo
          </BookDemoButton>
        </div>
      </Reveal>
    </section>
  );
}

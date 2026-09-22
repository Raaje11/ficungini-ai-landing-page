import { ChevronRight } from "lucide-react";

export function SectionHeader({
  label,
  index,
  total = 8,
}: {
  label: string;
  index: number;
  total?: number;
}) {
  return (
    <div className="sticky top-[65px] z-30 bg-alabaster/90 backdrop-blur-sm">
      <div aria-hidden className="mx-auto h-px max-w-6xl bg-ink-200" />
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2 font-mono-code text-xs uppercase tracking-[0.2em] text-ink-500">
          <ChevronRight className="h-3.5 w-3.5 text-pantone" />
          {label}
        </div>
        <div className="font-mono-code text-xs text-ink-500">
          [<span className="text-pantone">{String(index).padStart(2, "0")}</span>/{String(total).padStart(2, "0")}]
        </div>
      </div>
      <div aria-hidden className="mx-auto h-px max-w-6xl bg-ink-200" />
    </div>
  );
}

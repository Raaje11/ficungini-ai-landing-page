import type { LucideIcon } from "lucide-react";

export type Feature = {
  n: string;
  tag: string;
  icon: LucideIcon;
  title: string;
  desc: string;
};

const BORDER_CLASSES = [
  "",
  "border-t sm:border-t-0 sm:border-l lg:border-l",
  "border-t lg:border-t-0 lg:border-l",
  "border-t sm:border-t-0 sm:border-l lg:border-l",
];

export function FeatureGrid({ features }: { features: Feature[] }) {
  return (
    <div className="mx-auto grid max-w-6xl border-y border-ink-200 sm:grid-cols-2 lg:grid-cols-4">
      {features.map(({ n, tag, icon: Icon, title, desc }, i) => (
        <div key={n} className={`flex flex-col border-ink-200 ${BORDER_CLASSES[i] ?? ""}`}>
          <div className="flex items-center justify-between border-b border-ink-200 px-5 py-3.5 font-mono-code text-xs text-pantone">
            {n} / {tag}
          </div>
          <div className="flex flex-1 flex-col justify-between gap-8 bg-gradient-to-b from-pantone-50 to-white p-6">
            <div className="flex h-14 w-14 items-center justify-center custom-rounded bg-pantone text-alabaster shadow-sm">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-ink-900 font-sans-title">{title}</h3>
              <p className="mt-2 text-sm text-ink-600">{desc}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function IsoBar({
  height,
  color,
  label,
  sub,
}: {
  height: number;
  color: string;
  label: string;
  sub?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-end" style={{ height: 260 }}>
      <div className="mb-2 text-center text-xs text-ink-500">{sub}</div>
      <div className="relative" style={{ width: 72, height }}>
        <div
          className="absolute -top-4 left-0 h-4 w-full"
          style={{
            background: color,
            filter: "brightness(1.25)",
            clipPath: "polygon(15% 100%, 100% 100%, 85% 0%, 0% 0%)",
          }}
        />
        <div className="absolute top-0 left-0 h-full w-full" style={{ background: color }} />
        <div className="absolute top-0 -right-3 h-full w-3" style={{ background: color, filter: "brightness(0.75)" }} />
      </div>
      <div className="mt-4 text-center text-sm font-medium text-ink-900">{label}</div>
    </div>
  );
}

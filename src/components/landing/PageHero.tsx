import { Reveal } from "./Reveal";

export function PageHero({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-16 pt-20 text-center sm:pt-28">
      <span className="block font-mono-code text-sm font-medium text-pantone">{kicker}</span>
      <Reveal delayMs={70}>
        <h1 className="mx-auto mt-4 max-w-2xl text-4xl sm:text-5xl font-extrabold tracking-tight text-ink-900 font-sans-title">
          {title}
        </h1>
      </Reveal>
      {description && (
        <Reveal delayMs={140}>
          <p className="mx-auto mt-6 max-w-xl text-lg text-ink-600">{description}</p>
        </Reveal>
      )}
    </div>
  );
}

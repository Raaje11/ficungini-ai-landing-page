/**
 * Fico's face as a small flat cat head: for the avatar beside each message (a long conversation would otherwise hold a
 * WebGL canvas per message) and for the moment before the 3D cat has loaded. Static, in the site's palette only:
 * Electric Coral, Alabaster and Matte Black, with every shade a mix of them.
 */
export default function FicoCatAvatar() {
  const line = "var(--matte-black)";
  const fur = "color-mix(in srgb, var(--pantone) 88%, var(--alabaster))";
  const inner = "color-mix(in srgb, var(--pantone) 25%, var(--alabaster))";
  return (
    <svg aria-hidden viewBox="0 0 100 100" className="block h-full w-full overflow-visible">
      <g strokeLinejoin="round" strokeLinecap="round" stroke={line} strokeWidth="4">
        <path d="M 14 50 L 17 10 L 45 27 Z" fill={fur} />
        <path d="M 86 50 L 83 10 L 55 27 Z" fill={fur} />
        <path d="M 22 40 L 23.5 20 L 38 29 Z" fill={inner} stroke="none" />
        <path d="M 78 40 L 76.5 20 L 62 29 Z" fill={inner} stroke="none" />
        <ellipse cx="50" cy="58" rx="40" ry="34" fill={fur} />
      </g>
      {[35, 65].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="55" r="11.5" fill={line} />
          <circle cx={cx} cy="55" r="9.2" fill="var(--alabaster)" />
          <circle cx={cx} cy="55" r="6" fill={line} />
          <path d={`M ${cx - 2.6} 52.4 L ${cx + 2.6} 57.6 M ${cx + 2.6} 52.4 L ${cx - 2.6} 57.6`} stroke="var(--alabaster)" strokeWidth="1.6" strokeLinecap="round" />
        </g>
      ))}
      <path d="M 25 39 L 43 43 M 75 39 L 57 43" stroke={line} strokeWidth="3.6" strokeLinecap="round" fill="none" />
      <path d="M 46.4 68 L 53.6 68 L 50 72 Z" fill={line} stroke={line} strokeWidth="2" strokeLinejoin="round" />
      <path d="M 50 72 L 50 74.5 M 50 74.5 C 50 78.5 45 79.5 42.6 76.5 M 50 74.5 C 50 78.5 55 79.5 57.4 76.5" fill="none" stroke={line} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

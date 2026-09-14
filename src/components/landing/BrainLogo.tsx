export function BrainLogo({ className }: { className?: string }) {
  const strokeGroup = (id: string) => (
    <g id={id}>
      <path d="M110 34 V54" />
      <circle cx="110" cy="30" r="6" />
      <circle cx="110" cy="58" r="6" />
      <path d="M92 52 V70 L108 84" />
      <circle cx="92" cy="48" r="6" />
      <circle cx="108" cy="84" r="6" />
      <path d="M76 74 H92 L104 98" />
      <circle cx="72" cy="74" r="6" />
      <circle cx="104" cy="98" r="6" />
      <path d="M64 98 H86 L98 116" />
      <circle cx="60" cy="98" r="6" />
      <circle cx="98" cy="116" r="6" />
      <path d="M58 126 H82 L96 140" />
      <circle cx="54" cy="126" r="6" />
      <circle cx="96" cy="140" r="6" />
      <path d="M72 154 H94 L108 170" />
      <circle cx="68" cy="154" r="6" />
      <circle cx="108" cy="170" r="6" />
      <path d="M86 182 V198 L100 210" />
      <circle cx="86" cy="178" r="6" />
      <circle cx="100" cy="210" r="6" />
    </g>
  );

  return (
    <svg
      className={`brain-logo ${className ?? ""}`}
      viewBox="0 0 256 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
        <path d="M128 18 C108 18 94 30 88 46 C70 46 56 60 56 78 C42 86 36 102 40 118 C34 134 42 152 56 160 C56 182 72 198 92 202 C100 218 114 230 128 238" />
        <path d="M128 18 C148 18 162 30 168 46 C186 46 200 60 200 78 C214 86 220 102 216 118 C222 134 214 152 200 160 C200 182 184 198 164 202 C156 218 142 230 128 238" />
        <path d="M128 26 V230" />
        {strokeGroup(`left-${className ?? "logo"}`)}
        <g transform="translate(256 0) scale(-1 1)">
          <use href={`#left-${className ?? "logo"}`} />
        </g>
      </g>
    </svg>
  );
}

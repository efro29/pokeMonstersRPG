export function PokedexIcon({
  size = 28,
  accent = "#ff3b3b",
  body = "#b8c4cc",
}: {
  size?: number;
  accent?: string;
  body?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* BODY */}
      <rect
        x="6"
        y="6"
        width="52"
        height="52"
        rx="10"
        fill={body}
        stroke="#2b2f33"
        strokeWidth="3"
      />

      {/* TOP BUMP */}
      <rect x="20" y="4" width="24" height="10" rx="4" fill={body} stroke="#2b2f33" strokeWidth="3"/>

      {/* CAMERA LIGHT */}
      <circle cx="16" cy="18" r="5" fill="#2b2f33"/>
      <circle cx="16" cy="18" r="3" fill="#7CFF5E"/>

      {/* MAIN POKEBALL */}
      <circle cx="32" cy="34" r="16" fill="#dfe6eb" stroke="#2b2f33" strokeWidth="3"/>

      {/* TOP RED HALF */}
      <path
        d="M16 34a16 16 0 0 1 32 0H16Z"
        fill={accent}
      />

      {/* CENTER LINE */}
      <line x1="16" y1="34" x2="48" y2="34" stroke="#2b2f33" strokeWidth="3"/>

      {/* BUTTON */}
      <circle cx="32" cy="34" r="5" fill="#f4f4f4" stroke="#2b2f33" strokeWidth="3"/>

      {/* SPEAKER */}
      <rect x="42" y="44" width="10" height="2.5" rx="1" fill="#2b2f33"/>
      <rect x="42" y="49" width="10" height="2.5" rx="1" fill="#2b2f33"/>

      {/* BOTTOM NOTCH */}
      <rect x="30" y="56" width="4" height="4" rx="1" fill="#2b2f33"/>
    </svg>
  );
}
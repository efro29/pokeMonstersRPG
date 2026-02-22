export function TeamIcon({ size = 28, color = "#6FA8DC" }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* TOP HALF */}
      <path
        d="M6 32a26 26 0 0 1 52 0H42a10 10 0 0 0-20 0Z"
        fill={color}
        stroke="#1b1f23"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* BOTTOM HALF */}
      <path
        d="M58 32a26 26 0 0 1-52 0h16a10 10 0 0 0 20 0Z"
        fill={color}
        opacity="0.85"
        stroke="#1b1f23"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* CENTER RING */}
      <circle cx="32" cy="32" r="8" fill="#a9d0f5" stroke="#1b1f23" strokeWidth="3" />
      <circle cx="32" cy="32" r="3.5" fill="#1b1f23" />

      {/* STARS */}
      <g fill="#FFC107" stroke="#1b1f23" strokeWidth="2">
        <polygon points="18,48 21,54 28,55 23,60 24,66 18,63 12,66 13,60 8,55 15,54" transform="scale(.7) translate(6,12)"/>
        <polygon points="46,48 49,54 56,55 51,60 52,66 46,63 40,66 41,60 36,55 43,54" transform="scale(.7) translate(6,12)"/>
      </g>
    </svg>
  );
}
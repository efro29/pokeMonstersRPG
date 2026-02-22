export function ProfileIcon({
  size = 28,
  primary = "#e53935",
  logo = "#2f4f2f",
}: {
  size?: number;
  primary?: string;
  logo?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* CAP TOP */}
      <path
        d="M12 30
           Q32 6 52 30
           L52 40
           Q32 44 12 40 Z"
        fill={primary}
        stroke="#2b2f33"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* FRONT PANEL */}
      <path
        d="M16 30
           Q32 14 48 30
           L48 38
           Q32 40 16 38 Z"
        fill="#f2f2f2"
      />

      {/* LOGO */}
      <path
        d="M28 30 L36 24 L32 32 L42 33 L26 34 Z"
        fill={logo}
      />

      {/* BUTTON ON TOP */}
      <circle cx="32" cy="20" r="3" fill={primary} stroke="#2b2f33" strokeWidth="2" />

      {/* BRIM */}
      <path
        d="M8 40
           Q32 48 56 40
           Q32 56 8 40 Z"
        fill={primary}
        stroke="#2b2f33"
        strokeWidth="3"
      />
    </svg>
  );
}
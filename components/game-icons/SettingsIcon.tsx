export function SettingsIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <g fill="#ADB5BD" stroke="#111" strokeWidth="4">
        <circle cx="32" cy="32" r="10"/>
        <rect x="30" y="4" width="4" height="12"/>
        <rect x="30" y="48" width="4" height="12"/>
        <rect x="48" y="30" width="12" height="4"/>
        <rect x="4" y="30" width="12" height="4"/>
        <rect x="45" y="10" width="4" height="12" transform="rotate(45 47 16)"/>
        <rect x="15" y="42" width="4" height="12" transform="rotate(45 17 48)"/>
        <rect x="45" y="42" width="4" height="12" transform="rotate(-45 47 48)"/>
        <rect x="15" y="10" width="4" height="12" transform="rotate(-45 17 16)"/>
      </g>
    </svg>
  );
}
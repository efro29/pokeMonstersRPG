export function NpcIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      {/* trainer */}
      <circle cx="20" cy="22" r="7" fill="#FFD166" stroke="#111" strokeWidth="3"/>
      <rect x="14" y="28" width="12" height="14" rx="5" fill="#2A9D8F" stroke="#111" strokeWidth="3"/>

      {/* versus lightning */}
      <polygon points="34,18 44,18 38,28 48,28 32,48 36,32 28,32" fill="#FFD400" stroke="#111" strokeWidth="3"/>
    </svg>
  );
}
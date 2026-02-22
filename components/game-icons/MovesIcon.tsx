export function MovesIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="22" fill="#FF595E" stroke="#111" strokeWidth="4"/>
      <circle cx="32" cy="32" r="14" fill="#fff" stroke="#111" strokeWidth="4"/>
      <circle cx="32" cy="32" r="6" fill="#111"/>
    </svg>
  );
}
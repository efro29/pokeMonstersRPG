export function BagIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <rect x="14" y="18" width="36" height="36" rx="10" fill="#F4A261" stroke="#111" strokeWidth="4"/>
      <rect x="22" y="10" width="20" height="12" rx="6" fill="#E76F51" stroke="#111" strokeWidth="4"/>
      <circle cx="32" cy="38" r="7" fill="#fff" stroke="#111" strokeWidth="3"/>
      <path d="M25 38 H39" stroke="#111" strokeWidth="3"/>
      <circle cx="32" cy="38" r="2.5" fill="#111"/>
    </svg>
  );
}
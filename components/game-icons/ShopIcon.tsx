export function ShopIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <rect x="6" y="22" width="52" height="30" rx="6" fill="#3A86FF" stroke="#111" strokeWidth="4"/>
      <rect x="12" y="10" width="40" height="16" rx="4" fill="#FF006E" stroke="#111" strokeWidth="4"/>
      
      {/* pokeball sign */}
      <circle cx="32" cy="38" r="8" fill="#fff" stroke="#111" strokeWidth="3"/>
      <path d="M24 38 H40" stroke="#111" strokeWidth="3"/>
      <circle cx="32" cy="38" r="3" fill="#111"/>
    </svg>
  );
}
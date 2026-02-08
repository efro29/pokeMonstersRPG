"use client";

// SVG Badge icons matching the real Pokemon game badges
// Kanto Badges (Gen I) and Johto Badges (Gen II)

interface BadgeIconProps {
  size?: number;
  obtained?: boolean;
}

// ── KANTO BADGES ──

export function BoulderBadge({ size = 40, obtained = false }: BadgeIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ opacity: obtained ? 1 : 0.3 }}>
      <polygon points="20,2 34,10 38,26 30,38 10,38 2,26 6,10" fill="#8B7355" stroke="#5C4033" strokeWidth="1.5" />
      <polygon points="20,6 30,12 33,24 27,34 13,34 7,24 10,12" fill="#A0926A" />
      <polygon points="20,12 26,16 28,24 24,30 16,30 12,24 14,16" fill="#C4B896" />
    </svg>
  );
}

export function CascadeBadge({ size = 40, obtained = false }: BadgeIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ opacity: obtained ? 1 : 0.3 }}>
      <path d="M20 3 C20 3, 8 18, 8 25 C8 32, 13 37, 20 37 C27 37, 32 32, 32 25 C32 18, 20 3, 20 3Z" fill="#4A90D9" stroke="#2E6CB5" strokeWidth="1.5" />
      <path d="M20 8 C20 8, 12 20, 12 25 C12 30, 15 34, 20 34 C25 34, 28 30, 28 25 C28 20, 20 8, 20 8Z" fill="#6BAAEF" />
      <ellipse cx="17" cy="22" rx="3" ry="4" fill="#9ECBFF" opacity="0.6" />
    </svg>
  );
}

export function ThunderBadge({ size = 40, obtained = false }: BadgeIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ opacity: obtained ? 1 : 0.3 }}>
      <polygon points="12,2 22,2 18,14 28,14 10,38 16,20 6,20" fill="#F5C518" stroke="#C9A00C" strokeWidth="1.5" />
      <polygon points="14,5 20,5 17,14 25,14 12,34 16,20 9,20" fill="#FFD84D" />
    </svg>
  );
}

export function RainbowBadge({ size = 40, obtained = false }: BadgeIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ opacity: obtained ? 1 : 0.3 }}>
      {/* Petals */}
      <ellipse cx="20" cy="10" rx="5" ry="8" fill="#FF6B6B" />
      <ellipse cx="20" cy="10" rx="5" ry="8" fill="#FF9F43" transform="rotate(72 20 20)" />
      <ellipse cx="20" cy="10" rx="5" ry="8" fill="#FECA57" transform="rotate(144 20 20)" />
      <ellipse cx="20" cy="10" rx="5" ry="8" fill="#48DBFB" transform="rotate(216 20 20)" />
      <ellipse cx="20" cy="10" rx="5" ry="8" fill="#A29BFE" transform="rotate(288 20 20)" />
      <circle cx="20" cy="20" r="5" fill="#2ECC71" stroke="#27AE60" strokeWidth="1" />
    </svg>
  );
}

export function SoulBadge({ size = 40, obtained = false }: BadgeIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ opacity: obtained ? 1 : 0.3 }}>
      <path d="M20 36 L6 20 C2 14, 4 6, 12 4 C16 3, 19 6, 20 9 C21 6, 24 3, 28 4 C36 6, 38 14, 34 20 Z" fill="#E74C8B" stroke="#C0397A" strokeWidth="1.5" />
      <path d="M20 32 L9 20 C6 15, 8 9, 13 7 C16 6, 19 8, 20 11 C21 8, 24 6, 27 7 C32 9, 34 15, 31 20 Z" fill="#FF7EB3" />
    </svg>
  );
}

export function MarshBadge({ size = 40, obtained = false }: BadgeIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ opacity: obtained ? 1 : 0.3 }}>
      <circle cx="20" cy="20" r="17" fill="#D4AF37" stroke="#B8960C" strokeWidth="1.5" />
      <circle cx="20" cy="20" r="12" fill="#E8C547" />
      <circle cx="20" cy="20" r="6" fill="#F0D56E" />
      <circle cx="20" cy="20" r="2" fill="#D4AF37" />
    </svg>
  );
}

export function VolcanoBadge({ size = 40, obtained = false }: BadgeIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ opacity: obtained ? 1 : 0.3 }}>
      <path d="M20 3 C14 12, 4 18, 4 26 C4 33, 11 38, 20 38 C29 38, 36 33, 36 26 C36 18, 26 12, 20 3Z" fill="#E74C3C" stroke="#C0392B" strokeWidth="1.5" />
      <path d="M20 10 C16 16, 9 20, 9 26 C9 31, 14 35, 20 35 C26 35, 31 31, 31 26 C31 20, 24 16, 20 10Z" fill="#FF6B4A" />
      <path d="M20 18 C18 22, 14 24, 14 27 C14 30, 17 33, 20 33 C23 33, 26 30, 26 27 C26 24, 22 22, 20 18Z" fill="#FECA57" />
    </svg>
  );
}

export function EarthBadge({ size = 40, obtained = false }: BadgeIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ opacity: obtained ? 1 : 0.3 }}>
      <path d="M20 2 L30 12 L36 24 L30 36 L20 38 L10 36 L4 24 L10 12 Z" fill="#27AE60" stroke="#1E8449" strokeWidth="1.5" />
      <path d="M20 6 L28 14 L32 24 L28 33 L20 35 L12 33 L8 24 L12 14 Z" fill="#2ECC71" />
      <path d="M20 14 L24 18 L26 24 L24 28 L20 30 L16 28 L14 24 L16 18 Z" fill="#58D68D" />
    </svg>
  );
}

// ── JOHTO BADGES ──

export function ZephyrBadge({ size = 40, obtained = false }: BadgeIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ opacity: obtained ? 1 : 0.3 }}>
      {/* Wing shape */}
      <path d="M4 20 Q10 6, 20 8 Q25 4, 36 6 L32 14 Q26 10, 20 14 Q14 10, 4 20Z" fill="#B0C4DE" stroke="#8CA8C4" strokeWidth="1.2" />
      <path d="M4 20 Q10 34, 20 32 Q25 36, 36 34 L32 26 Q26 30, 20 26 Q14 30, 4 20Z" fill="#B0C4DE" stroke="#8CA8C4" strokeWidth="1.2" />
      <circle cx="20" cy="20" r="4" fill="#D6E4F0" stroke="#8CA8C4" strokeWidth="1" />
    </svg>
  );
}

export function HiveBadge({ size = 40, obtained = false }: BadgeIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ opacity: obtained ? 1 : 0.3 }}>
      {/* Honeycomb hexagon */}
      <polygon points="20,3 34,11 34,29 20,37 6,29 6,11" fill="#DAA520" stroke="#B8860B" strokeWidth="1.5" />
      <polygon points="20,8 30,14 30,26 20,32 10,26 10,14" fill="#F0C040" />
      <polygon points="20,14 25,17 25,23 20,26 15,23 15,17" fill="#FFD866" />
    </svg>
  );
}

export function PlainBadge({ size = 40, obtained = false }: BadgeIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ opacity: obtained ? 1 : 0.3 }}>
      <rect x="6" y="6" width="28" height="28" rx="4" fill="#E67E22" stroke="#D35400" strokeWidth="1.5" />
      <rect x="11" y="11" width="18" height="18" rx="2" fill="#F39C12" />
      <rect x="16" y="16" width="8" height="8" rx="1" fill="#FAD390" />
    </svg>
  );
}

export function FogBadge({ size = 40, obtained = false }: BadgeIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ opacity: obtained ? 1 : 0.3 }}>
      <circle cx="20" cy="20" r="16" fill="#8E44AD" stroke="#6C3483" strokeWidth="1.5" />
      <path d="M12 20 Q14 14, 20 14 Q26 14, 28 20 Q26 26, 20 26 Q14 26, 12 20Z" fill="#A569BD" />
      <circle cx="16" cy="18" r="2" fill="#D7BDE2" />
      <circle cx="24" cy="18" r="2" fill="#D7BDE2" />
      <path d="M16 24 Q20 28, 24 24" fill="none" stroke="#D7BDE2" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function StormBadge({ size = 40, obtained = false }: BadgeIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ opacity: obtained ? 1 : 0.3 }}>
      <circle cx="20" cy="16" r="10" fill="#5B6C8A" stroke="#3D4F6F" strokeWidth="1.5" />
      <ellipse cx="12" cy="20" rx="8" ry="6" fill="#5B6C8A" />
      <ellipse cx="28" cy="20" rx="8" ry="6" fill="#5B6C8A" />
      {/* Lightning */}
      <polygon points="18,22 22,22 20,28 25,28 17,38 19,30 15,30" fill="#FECA57" />
    </svg>
  );
}

export function MineralBadge({ size = 40, obtained = false }: BadgeIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ opacity: obtained ? 1 : 0.3 }}>
      {/* Diamond/crystal shape */}
      <polygon points="20,3 35,18 20,37 5,18" fill="#B8B8D0" stroke="#9494B0" strokeWidth="1.5" />
      <polygon points="20,8 30,18 20,32 10,18" fill="#D0D0E8" />
      <polygon points="20,13 25,18 20,27 15,18" fill="#E8E8F8" />
      <line x1="20" y1="3" x2="20" y2="37" stroke="#9494B0" strokeWidth="0.5" opacity="0.5" />
      <line x1="5" y1="18" x2="35" y2="18" stroke="#9494B0" strokeWidth="0.5" opacity="0.5" />
    </svg>
  );
}

export function GlacierBadge({ size = 40, obtained = false }: BadgeIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ opacity: obtained ? 1 : 0.3 }}>
      {/* Snowflake/ice crystal */}
      <polygon points="20,2 24,14 36,14 26,22 30,36 20,28 10,36 14,22 4,14 16,14" fill="#87CEEB" stroke="#5BA3D9" strokeWidth="1.2" />
      <polygon points="20,8 22,16 30,16 24,22 26,30 20,26 14,30 16,22 10,16 18,16" fill="#B0E0F6" />
      <circle cx="20" cy="20" r="3" fill="#E0F2FF" />
    </svg>
  );
}

export function RisingBadge({ size = 40, obtained = false }: BadgeIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ opacity: obtained ? 1 : 0.3 }}>
      {/* Dragon fang / rising shape */}
      <path d="M20 2 L32 14 L36 30 L28 36 L20 32 L12 36 L4 30 L8 14 Z" fill="#C0392B" stroke="#922B21" strokeWidth="1.5" />
      <path d="M20 8 L28 16 L31 28 L25 32 L20 29 L15 32 L9 28 L12 16 Z" fill="#E74C3C" />
      <path d="M20 16 L24 20 L26 26 L22 28 L20 26 L18 28 L14 26 L16 20 Z" fill="#F5B041" />
    </svg>
  );
}

// Badge lookup map
export const KANTO_BADGE_ICONS: Record<string, React.FC<BadgeIconProps>> = {
  boulder: BoulderBadge,
  cascade: CascadeBadge,
  thunder: ThunderBadge,
  rainbow: RainbowBadge,
  soul: SoulBadge,
  marsh: MarshBadge,
  volcano: VolcanoBadge,
  earth: EarthBadge,
};

export const JOHTO_BADGE_ICONS: Record<string, React.FC<BadgeIconProps>> = {
  zephyr: ZephyrBadge,
  hive: HiveBadge,
  plain: PlainBadge,
  fog: FogBadge,
  storm: StormBadge,
  mineral: MineralBadge,
  glacier: GlacierBadge,
  rising: RisingBadge,
};

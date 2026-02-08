"use client";

import { TRAINER_AVATARS } from "@/lib/mode-store";

interface TrainerAvatarProps {
  avatarId: number;
  size?: number;
  className?: string;
}

export function TrainerAvatar({ avatarId, size = 64, className = "" }: TrainerAvatarProps) {
  const avatar = TRAINER_AVATARS[avatarId] || TRAINER_AVATARS[0];
  const hasHat = avatar.hat !== "none";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label={`Avatar ${avatar.name}`}
    >
      {/* Background circle */}
      <circle cx="32" cy="32" r="30" fill={avatar.shirt} opacity="0.2" />
      <circle cx="32" cy="32" r="30" fill="none" stroke={avatar.shirt} strokeWidth="2" opacity="0.5" />

      {/* Body/shirt */}
      <ellipse cx="32" cy="56" rx="18" ry="12" fill={avatar.shirt} />

      {/* Neck */}
      <rect x="28" y="38" width="8" height="6" rx="2" fill={avatar.skin} />

      {/* Head */}
      <ellipse cx="32" cy="28" rx="12" ry="13" fill={avatar.skin} />

      {/* Hair */}
      {hasHat ? (
        <>
          {/* Hair visible under hat */}
          <ellipse cx="32" cy="22" rx="12" ry="8" fill={avatar.hair} />
          {/* Hat */}
          <ellipse cx="32" cy="19" rx="14" ry="6" fill={avatar.hat} />
          <rect x="18" y="16" width="28" height="6" rx="2" fill={avatar.hat} />
          {/* Hat brim */}
          <ellipse cx="32" cy="22" rx="16" ry="3" fill={avatar.hat} opacity="0.8" />
        </>
      ) : (
        <>
          {/* Full hair */}
          <ellipse cx="32" cy="20" rx="13" ry="9" fill={avatar.hair} />
          {/* Hair sides */}
          <ellipse cx="20" cy="26" rx="3" ry="6" fill={avatar.hair} />
          <ellipse cx="44" cy="26" rx="3" ry="6" fill={avatar.hair} />
        </>
      )}

      {/* Eyes */}
      <circle cx="27" cy="29" r="2" fill="#1E1E1E" />
      <circle cx="37" cy="29" r="2" fill="#1E1E1E" />
      {/* Eye highlights */}
      <circle cx="27.8" cy="28.2" r="0.8" fill="#ffffff" />
      <circle cx="37.8" cy="28.2" r="0.8" fill="#ffffff" />

      {/* Mouth - small smile */}
      <path d="M 28 33 Q 32 36 36 33" fill="none" stroke="#1E1E1E" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

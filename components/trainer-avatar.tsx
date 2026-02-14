"use client";

import Image from "next/image";
import { TRAINER_AVATARS } from "@/lib/mode-store";

interface TrainerAvatarProps {
  avatarId: number;
  size?: number;
  className?: string;
}

export function TrainerAvatar({ avatarId, size = 64, className = "" }: TrainerAvatarProps) {
  const avatar = TRAINER_AVATARS[avatarId] || TRAINER_AVATARS[0];

  return (
    <div
      className={`relative overflow-hidden rounded-full border-2 border-border ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Avatar ${avatar.name}`}
    >
      <Image
        src={`/images/profiles/perfil${avatarId}.jpg`}
        alt={avatar.name}
        width={size}
        height={size}
        className="object-cover w-full h-full"
        priority
      />
    </div>
  );
}

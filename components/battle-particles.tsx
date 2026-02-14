"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { CardEffectType } from "@/lib/card-animations";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  angle: number;
  distance: number;
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 100,
    y: (Math.random() - 0.5) * 80,
    size: 3 + Math.random() * 5,
    delay: Math.random() * 0.2,
    duration: 0.4 + Math.random() * 0.4,
    angle: (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5,
    distance: 30 + Math.random() * 50,
  }));
}

const PARTICLE_CONFIG: Record<
  Exclude<CardEffectType, "none">,
  { colors: string[]; count: number; glow: string }
> = {
  damage: {
    colors: ["#ef4444", "#dc2626", "#b91c1c", "#f87171", "#ff6b6b"],
    count: 20,
    glow: "rgba(239, 68, 68, 0.6)",
  },
  heal: {
    colors: ["#22c55e", "#16a34a", "#4ade80", "#86efac", "#bbf7d0"],
    count: 16,
    glow: "rgba(34, 197, 94, 0.6)",
  },
  buff: {
    colors: ["#f59e0b", "#fbbf24", "#fcd34d", "#fef08a", "#d4af37"],
    count: 18,
    glow: "rgba(251, 191, 36, 0.6)",
  },
  debuff: {
    colors: ["#a855f7", "#9333ea", "#7c3aed", "#c084fc", "#e879f9"],
    count: 18,
    glow: "rgba(168, 85, 247, 0.6)",
  },
};

export function BattleParticles({
  effectType,
  isAnimating,
}: {
  effectType: CardEffectType;
  isAnimating: boolean;
}) {
  if (!isAnimating || effectType === "none") return null;

  const config = PARTICLE_CONFIG[effectType];
  const particles = generateParticles(config.count);

  return (
    <AnimatePresence>
      <div
        className="absolute inset-0 z-20 pointer-events-none overflow-hidden"
        style={{ filter: `drop-shadow(0 0 8px ${config.glow})` }}
      >
        {/* Center flash */}
        <motion.div
          className="absolute rounded-full"
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 60,
            height: 60,
            background: `radial-gradient(circle, ${config.glow} 0%, transparent 70%)`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 2.5, 0], opacity: [0, 0.8, 0] }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />

        {/* Particles */}
        {particles.map((p) => {
          const color = config.colors[p.id % config.colors.length];
          const endX = Math.cos(p.angle) * p.distance;
          const endY = Math.sin(p.angle) * p.distance;

          return (
            <motion.div
              key={p.id}
              className="absolute rounded-full"
              style={{
                left: "50%",
                top: "50%",
                width: p.size,
                height: p.size,
                backgroundColor: color,
                boxShadow: `0 0 ${p.size * 2}px ${color}`,
              }}
              initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
              animate={{
                x: [0, endX * 0.5, endX],
                y: [0, endY * 0.5 - 15, endY],
                opacity: [0, 1, 0],
                scale: [0, 1.2, 0],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: "easeOut",
              }}
            />
          );
        })}

        {/* Damage-specific: impact ring */}
        {effectType === "damage" && (
          <motion.div
            className="absolute rounded-full border-2"
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              borderColor: "#ef4444",
            }}
            initial={{ width: 0, height: 0, opacity: 1 }}
            animate={{
              width: [0, 120],
              height: [0, 120],
              opacity: [1, 0],
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        )}

        {/* Heal-specific: rising sparkles */}
        {effectType === "heal" &&
          Array.from({ length: 8 }, (_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute"
              style={{
                left: `${30 + Math.random() * 40}%`,
                bottom: "20%",
                width: 4,
                height: 4,
                backgroundColor: config.colors[i % config.colors.length],
                borderRadius: "50%",
                boxShadow: `0 0 6px ${config.colors[i % config.colors.length]}`,
              }}
              initial={{ y: 0, opacity: 0 }}
              animate={{
                y: [0, -40 - Math.random() * 40],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 0.6,
                delay: i * 0.06,
                ease: "easeOut",
              }}
            />
          ))}
      </div>
    </AnimatePresence>
  );
}

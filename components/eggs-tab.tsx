"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore, EGG_POKEMON, EGG_TIER_COLORS, EGG_HATCH_XP, isEggReady, getEggRemainingMs, formatEggTime, MAX_EGGS } from "@/lib/game-store";
import type { PokemonEgg, EggTier } from "@/lib/game-store";
import { getSpriteUrl } from "@/lib/pokemon-data";
import { useModeStore } from "@/lib/mode-store";
import { Button } from "@/components/ui/button";
import { Egg, Clock, Sparkles, Timer } from "lucide-react";

// ── Egg SVG Component ──
function EggIcon({ tier, size = 64, wobble = false }: { tier: EggTier; size?: number; wobble?: boolean }) {
  const colors = EGG_TIER_COLORS[tier];
  return (
    <motion.svg
      width={size}
      height={size * 1.2}
      viewBox="0 0 40 48"
      animate={wobble ? { rotate: [-3, 3, -3, 3, 0] } : {}}
      transition={wobble ? { duration: 0.4, repeat: Infinity, repeatDelay: 1.5 } : {}}
    >
      {/* Shadow */}
      <ellipse cx="20" cy="44" rx="10" ry="3" fill="black" opacity="0.15" />
      {/* Egg body */}
      <ellipse cx="20" cy="26" rx="13" ry="17" fill={colors.bg} />
      {/* Darker bottom half */}
      <clipPath id={`egg-clip-${tier}`}>
        <rect x="0" y="30" width="40" height="18" />
      </clipPath>
      <ellipse cx="20" cy="26" rx="13" ry="17" fill={colors.border} clipPath={`url(#egg-clip-${tier})`} />
      {/* Spots */}
      <circle cx="14" cy="22" r="2.5" fill="white" opacity="0.2" />
      <circle cx="24" cy="18" r="2" fill="white" opacity="0.15" />
      <circle cx="18" cy="32" r="1.8" fill="white" opacity="0.12" />
      <circle cx="26" cy="28" r="2.2" fill="white" opacity="0.18" />
      {/* Highlight */}
      <ellipse cx="15" cy="19" rx="3" ry="5" fill="white" opacity="0.2" transform="rotate(-15 15 19)" />
      {/* Outline */}
      <ellipse cx="20" cy="26" rx="13" ry="17" fill="none" stroke="white" strokeWidth="0.8" opacity="0.2" />
    </motion.svg>
  );
}

// ── Hatch Animation Component ──
function HatchAnimation({ egg, onComplete }: { egg: PokemonEgg; onComplete: () => void }) {
  const [phase, setPhase] = useState<"wobble" | "crack" | "explode" | "reveal">("wobble");
  const colors = EGG_TIER_COLORS[egg.tier];
  const spriteUrl = getSpriteUrl(egg.speciesId);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase("crack"), 1500),
      setTimeout(() => setPhase("explode"), 2500),
      setTimeout(() => setPhase("reveal"), 3200),
      setTimeout(onComplete, 5500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const particles = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * Math.PI * 2;
    const dist = 50 + Math.random() * 40;
    return { id: i, x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, size: 3 + Math.random() * 5 };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.85)" }}>
      <div className="relative flex flex-col items-center">
        {/* Wobble phase */}
        {phase === "wobble" && (
          <motion.div
            animate={{ rotate: [-8, 8, -12, 12, -6, 6, 0] }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <EggIcon tier={egg.tier} size={80} />
          </motion.div>
        )}

        {/* Crack phase */}
        {phase === "crack" && (
          <motion.div
            animate={{ rotate: [-15, 15, -20, 20, 0], scale: [1, 1.05, 0.98, 1.08, 1] }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <div className="relative">
              <EggIcon tier={egg.tier} size={80} />
              {/* Crack lines */}
              <svg className="absolute inset-0" width="80" height="96" viewBox="0 0 40 48">
                <path d="M14 20 L18 26 L15 30 L20 35" stroke="white" strokeWidth="1.5" fill="none" opacity="0.8" />
                <path d="M26 18 L22 24 L25 28" stroke="white" strokeWidth="1" fill="none" opacity="0.6" />
              </svg>
            </div>
          </motion.div>
        )}

        {/* Explode phase - particles */}
        {phase === "explode" && (
          <div className="relative w-20 h-24 flex items-center justify-center">
            <motion.div
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <EggIcon tier={egg.tier} size={80} />
            </motion.div>
            {particles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute rounded-full"
                style={{ width: p.size, height: p.size, backgroundColor: colors.bg, top: "50%", left: "50%" }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.2 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            ))}
            {/* Flash */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: colors.bg }}
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 4, opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          </div>
        )}

        {/* Reveal phase - show pokemon */}
        {phase === "reveal" && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="flex flex-col items-center gap-4"
          >
            {/* Glow ring */}
            <motion.div
              className="absolute rounded-full"
              style={{ width: 140, height: 140, background: `radial-gradient(circle, ${colors.glow}, transparent 70%)` }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.3, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {/* Pokemon sprite */}
            <div className="relative z-10">
              <img
                src={spriteUrl}
                alt={egg.name}
                className="w-28 h-28 object-contain drop-shadow-lg"
                crossOrigin="anonymous"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center gap-1 z-10"
            >
              <span className="text-lg font-black text-foreground capitalize">{egg.name}</span>
              <span className="text-xs font-medium" style={{ color: colors.bg }}>
                +{EGG_HATCH_XP[egg.tier]} XP de Exploracao
              </span>
              <span className="text-[10px] text-muted-foreground">Adicionado a equipe!</span>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ── Main Eggs Tab ──
export function EggsTab() {
  const { eggs, hatchEgg } = useGameStore();
  const [, setTick] = useState(0);
  const [hatchingEgg, setHatchingEgg] = useState<PokemonEgg | null>(null);

  // Update timers every second
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const handleHatch = useCallback((egg: PokemonEgg) => {
    setHatchingEgg(egg);
  }, []);

  const completeHatch = useCallback(() => {
    if (hatchingEgg) {
      hatchEgg(hatchingEgg.id);
      // Auto-discover in Pokedex
      const modeState = useModeStore.getState();
      if (modeState.mode === "trainer") {
        modeState.discoverPokemon(hatchingEgg.speciesId);
      }
      setHatchingEgg(null);
    }
  }, [hatchingEgg, hatchEgg]);

  // Group catalog by tier
  const tiers: { tier: EggTier; label: string }[] = [
    { tier: "green", label: "3 Horas" },
    { tier: "yellow", label: "6 Horas" },
    { tier: "red", label: "10 Horas" },
  ];

  return (
    <div className="flex flex-col gap-4 p-3 pb-20">
      {/* Hatch animation overlay */}
      <AnimatePresence>
        {hatchingEgg && (
          <HatchAnimation egg={hatchingEgg} onComplete={completeHatch} />
        )}
      </AnimatePresence>

      {/* Active eggs section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Egg className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-bold text-foreground">Ovos</span>
          </div>
          <span className="text-[10px] text-muted-foreground font-mono">{eggs.length}/{MAX_EGGS}</span>
        </div>

        {eggs.length === 0 ? (
          <div className="rounded-xl border border-border/50 p-6 flex flex-col items-center gap-2" style={{ background: "rgba(255,255,255,0.02)" }}>
            <Egg className="w-8 h-8 text-muted-foreground/40" />
            <p className="text-xs text-muted-foreground text-center">
              Nenhum ovo encontrado. Use o Radar para encontrar ovos!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {eggs.map((egg) => {
              const ready = isEggReady(egg);
              const remainingMs = getEggRemainingMs(egg);
              const totalMs = egg.hatchTimeMs;
              const progressPct = Math.min(100, ((totalMs - remainingMs) / totalMs) * 100);
              const colors = EGG_TIER_COLORS[egg.tier];

              return (
                <motion.div
                  key={egg.id}
                  layout
                  className="rounded-xl border p-3 flex flex-col items-center gap-2 relative overflow-hidden"
                  style={{
                    borderColor: ready ? colors.bg : `${colors.bg}40`,
                    background: `linear-gradient(180deg, rgba(0,0,0,0.3) 0%, ${colors.bg}10 100%)`,
                    boxShadow: ready ? `0 0 20px ${colors.glow}` : "none",
                  }}
                >
                  {/* Ready sparkle indicator */}
                  {ready && (
                    <motion.div
                      className="absolute top-1 right-1"
                      animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Sparkles className="w-4 h-4" style={{ color: colors.bg }} />
                    </motion.div>
                  )}

                  {/* Egg visual */}
                  <EggIcon tier={egg.tier} size={40} wobble={ready} />

                  {/* Info */}
                  <span className="text-[10px] font-medium text-muted-foreground">???</span>

                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: colors.bg }}
                      animate={{ width: `${progressPct}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>

                  {/* Timer or hatch button */}
                  {ready ? (
                    <Button
                      onClick={() => handleHatch(egg)}
                      className="w-full h-7 text-[10px] font-bold"
                      style={{ background: colors.bg, color: "#fff" }}
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      Chocar!
                    </Button>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Timer className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {formatEggTime(remainingMs)}
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}

            {/* Empty slots */}
            {Array.from({ length: MAX_EGGS - eggs.length }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="rounded-xl border border-dashed border-border/30 p-3 flex flex-col items-center justify-center gap-1 min-h-[140px]"
                style={{ background: "rgba(255,255,255,0.01)" }}
              >
                <Egg className="w-6 h-6 text-muted-foreground/20" />
                <span className="text-[9px] text-muted-foreground/40">Vazio</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Baby Pokemon catalog */}
      {/*}  <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-bold text-foreground">Catalogo de Ovos</span>
        </div>

        {tiers.map(({ tier, label }) => {
          const colors = EGG_TIER_COLORS[tier];
          const pokemonList = EGG_POKEMON.filter((e) => e.tier === tier);

          return (
            <div key={tier} className="mb-3">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.bg }} />
                <span className="text-xs font-semibold" style={{ color: colors.bg }}>
                  {colors.label} - {label}
                </span>
                <span className="text-[10px] text-muted-foreground ml-auto">+{EGG_HATCH_XP[tier]} XP</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {pokemonList.map((p) => (
                  <div
                    key={p.speciesId}
                    className="rounded-lg border p-1.5 flex flex-col items-center gap-0.5"
                    style={{
                      borderColor: `${colors.bg}25`,
                      background: `${colors.bg}08`,
                    }}
                  >
                    <img
                      src={getSpriteUrl(p.speciesId)}
                      alt={p.name}
                      className="w-10 h-10 object-contain"
                      crossOrigin="anonymous"
                      loading="lazy"
                    />
                    <span className="text-[8px] font-medium text-muted-foreground capitalize leading-tight text-center">
                      {p.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>*/}
    </div>
  );
}

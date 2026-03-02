"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore, EGG_POKEMON, EGG_TIER_COLORS, EGG_HATCH_XP, isEggReady, getEggRemainingMs, formatEggTime, MAX_EGGS } from "@/lib/game-store";
import type { PokemonEgg, EggTier } from "@/lib/game-store";
import { getSpriteUrl } from "@/lib/pokemon-data";
import { useModeStore } from "@/lib/mode-store";
import { Button } from "@/components/ui/button";
import { Egg, Clock, Sparkles, Timer } from "lucide-react";
import React from "react";

// ── Egg SVG Component ──
function EggIcon({ tier, size = 64, wobble = false }: { tier: EggTier; size?: number; wobble?: boolean }) {
  const colors = EGG_TIER_COLORS[tier];
  const id = React.useId().replace(/:/g, '');

  return (
    <motion.svg
      width={size}
      height={size * 1.2}
      viewBox="0 0 40 50"
      className="filter drop-shadow-[0_0_8px_rgba(0,0,0,0.3)]"
      animate={wobble ? { 
        rotate: [-3, 3, -3, 3, 0],
        y: [0, -4, 0],
        scale: [1, 1.05, 1]
      } : {}}
      transition={wobble ? { 
        duration: 0.5, 
        repeat: Infinity, 
        repeatDelay: 1,
        ease: "easeInOut"
      } : {}}
    >
      <defs>
        {/* Gradiente do Corpo (Profundidade 3D) */}
        <radialGradient id={`eggGrad-${id}`} cx="35%" cy="35%" r="65%">

          <stop offset="10%" stopColor={colors.bg} />
          <stop offset="100%" stopColor="#000" stopOpacity="0.6" />
        </radialGradient>

        {/* Brilho do Núcleo (Energia Vital) */}
        <radialGradient id={`coreGlow-${id}`}>
          <stop offset="0%" stopColor="white" stopOpacity="0.8" />
          <stop offset="50%" stopColor={colors.bg} stopOpacity="0.4" />
          <stop offset="100%" stopColor={colors.bg} stopOpacity="0" />
        </radialGradient>

        {/* Reflexo de Vidro Curvo */}
        <linearGradient id={`glassReflex-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.5" />
          <stop offset="40%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Sombra no Chão */}
      <ellipse cx="20" cy="46" rx="12" ry="3" fill="black" opacity="0.2" />

      {/* CORPO DO OVO (Base) */}
      <ellipse cx="20" cy="25" rx="14" ry="19" fill={`url(#eggGrad-${id})`} />

      {/* NÚCLEO DE ENERGIA (O que está lá dentro) */}
      <motion.circle 
        cx="20" cy="28" r="8" 
        fill={`url(#coreGlow-${id})`}
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.7, 0.3]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* MANCHAS ESTILIZADAS (Hexágonos ou Círculos Tech) */}
      <g opacity="0.2" fill="white">
        <circle cx="12" cy="20" r="3" />
        <circle cx="28" cy="18" r="2" />
        <circle cx="22" cy="35" r="2.5" />
      </g>

      {/* REFLEXO DE SUPERFÍCIE (Glass Effect) */}
      <path 
        d="M10,18 C12,10 28,10 30,18" 
        stroke={`url(#glassReflex-${id})`} 
        strokeWidth="2" 
        strokeLinecap="round" 
        fill="none" 
      />

      {/* ANEL DE CONTENÇÃO (Base Tech) */}
      <path 
        d="M8,35 A15,5 0 0,0 32,35" 
        fill="none" 
        stroke="white" 
        strokeWidth="0.5" 
        strokeOpacity="0.2" 
      />

      {/* BRILHO DE PONTO (Highlights) */}
      <circle cx="14" cy="15" r="1.5" fill="white" opacity="0.6" />
      
      {/* INDICADOR DE STATUS (Ready Glow) */}
      {wobble && (
        <ellipse 
          cx="20" cy="25" rx="14" ry="19" 
          fill="none" 
          stroke={colors.bg} 
          strokeWidth="1.5" 
          className="animate-pulse"
          style={{ filter: `blur(2px)` }}
        />
      )}
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
<div className="flex flex-col gap-6 p-4 pb-24 bg-slate-950 min-h-screen text-slate-200">
  {/* Overlay de Eclosão */}
  <AnimatePresence>
    {hatchingEgg && (
      <HatchAnimation egg={hatchingEgg} onComplete={completeHatch} />
    )}
  </AnimatePresence>

  {/* Header da Seção de Ovos */}
  <header>
    <div className="flex items-center justify-between mb-4 px-1">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
          <Egg className="w-5 h-5 text-amber-400 animate-pulse" />
        </div>
        <div>
          <h2 className="text-lg font-black uppercase italic tracking-tighter text-white">Laboratório</h2>
          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Active_Incubators</p>
        </div>
      </div>
      <div className="px-3 py-1 bg-slate-900 border border-white/5 rounded-md shadow-inner">
        <span className="text-xs font-mono font-bold text-amber-400">
          {eggs.length.toString().padStart(2, '0')}<span className="text-slate-600">/</span>{MAX_EGGS.toString().padStart(2, '0')}
        </span>
      </div>
    </div>

    {eggs.length === 0 ? (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="rounded-2xl border-2 border-dashed border-slate-800 p-10 flex flex-col items-center gap-4 bg-slate-900/20"
      >
        <div className="relative">
          <Egg className="w-12 h-12 text-slate-800" />
          <div className="absolute inset-0 bg-amber-500/5 blur-xl rounded-full" />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-slate-400 italic uppercase">Sem sinal biológico</p>
          <p className="text-[10px] text-slate-600 font-mono mt-1">USE O RADAR PARA ESCANEAR NOVOS OVOS</p>
        </div>
      </motion.div>
    ) : (
      <div className="grid grid-cols-2 gap-4">
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
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative group p-[1px] overflow-hidden rounded-tr-3xl rounded-bl-3xl"
              style={{
                background: ready 
                  ? `linear-gradient(135deg, ${colors.bg}, transparent)` 
                  : 'linear-gradient(135deg, rgba(255,255,255,0.05), transparent)'
              }}
            >
              <div 
                className="bg-slate-900/90 backdrop-blur-md p-4 flex flex-col items-center gap-3 relative z-10 rounded-tr-[22px] rounded-bl-[22px]"
                style={{
                  boxShadow: ready ? `inset 0 0 20px ${colors.bg}20` : 'none'
                }}
              >
                {/* Badge de Tier */}
                <div 
                  className="absolute top-0 left-0 px-2 py-0.5 text-[8px] font-mono font-bold uppercase tracking-tighter"
                  style={{ backgroundColor: colors.bg, color: '#000' }}
                >
                  {colors.label}
                </div>

                {/* Efeito de Scanner para Ready */}
                {ready && (
                  <motion.div 
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{ background: `linear-gradient(to bottom, transparent, ${colors.bg}, transparent)`, height: '20%' }}
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                )}

                {/* Visual do Ovo */}
                <div className="relative mt-2">
                  <div className={`transition-all duration-500 ${ready ? 'drop-shadow-[0_0_15px_' + colors.glow + ']' : 'grayscale-[0.5]'}`}>
                    <EggIcon tier={egg.tier} size={85} wobble={ready} />
                  </div>
                </div>

                {/* Info Container */}
                <div className="w-full space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-[9px] font-mono text-slate-500 italic uppercase">Trace_ID: ???</span>
                    <span className="text-[9px] font-mono text-white font-bold">{Math.round(progressPct)}%</span>
                  </div>

                  {/* Gamer Progress Bar */}
                  <div className="w-full h-1.5 bg-black rounded-full overflow-hidden border border-white/5 relative">
                    <motion.div
                      className="h-full relative z-10"
                      style={{ 
                        backgroundColor: colors.bg,
                        boxShadow: `0 0 10px ${colors.bg}`
                      }}
                      animate={{ width: `${progressPct}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    >
                      {/* Efeito de brilho animado na barra */}
                      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] w-1/2 animate-[shimmer_2s_infinite]" />
                    </motion.div>
                  </div>

                  {/* Action / Timer */}
                  {ready ? (
                    <Button
                      onClick={() => handleHatch(egg)}
                      className="w-full h-8 text-[10px] font-black uppercase italic tracking-widest group relative overflow-hidden transition-all active:scale-95"
                      style={{ background: colors.bg, color: "#000" }}
                    >
                      <Sparkles className="w-3 h-3 mr-2 fill-current" />
                      Iniciando Parto
                    </Button>
                  ) : (
                    <div className="flex items-center justify-center gap-2 py-1 bg-black/40 rounded border border-white/5 font-mono">
                      <Timer className="w-3 h-3 text-slate-500" />
                      <span className="text-[10px] text-slate-300">
                        {formatEggTime(remainingMs)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Empty slots - Cyber Style */}
        {Array.from({ length: MAX_EGGS - eggs.length }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="rounded-tr-2xl rounded-bl-2xl border border-white/5 p-4 flex flex-col items-center justify-center gap-2 min-h-[160px] bg-slate-900/10 relative group"
          >
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_70%)]" />
             <div className="p-3 rounded-full bg-slate-800/20 border border-white/5 opacity-30 group-hover:opacity-50 transition-opacity">
                <Egg className="w-6 h-6 text-slate-600" />
             </div>
             <span className="text-[8px] font-mono text-slate-700 uppercase tracking-[0.3em]">Incubator_Offline</span>
          </div>
        ))}
      </div>
    )}
  </header>

  {/* CSS para o Shimmer Effect (Colocar no seu CSS global) */}
  <style jsx>{`
    @keyframes shimmer {
      from { transform: translateX(-100%); }
      to { transform: translateX(200%); }
    }
  `}</style>
</div>
  );
}

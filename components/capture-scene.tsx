"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/lib/game-store";
import { getBattleSpriteUrl, getSpriteUrl, TYPE_COLORS } from "@/lib/pokemon-data";
import type { PokemonSpecies } from "@/lib/pokemon-data";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { playPokeball, playGift, playButtonClick, playFlee } from "@/lib/sounds";

interface CaptureSceneProps {
  pokemon: PokemonSpecies;
  onClose: () => void;
  onCaptured: (species: PokemonSpecies, ballsUsed: number) => void;
}

// Pokeball types with capture rate multipliers
const POKEBALL_TYPES: Record<string, { name: string; multiplier: number; color: string }> = {
  "pokeball": { name: "Pokeball", multiplier: 1, color: "#EF4444" },
  "great-ball": { name: "Great Ball", multiplier: 1.5, color: "#3B82F6" },
  "ultra-ball": { name: "Ultra Ball", multiplier: 2, color: "#F59E0B" },
  "master-ball": { name: "Master Ball", multiplier: 255, color: "#8B5CF6" },
};

type CapturePhase =
  | "select-ball"
  | "ready"
  | "throwing"
  | "hit"
  | "shaking"
  | "captured"
  | "escaped"
  | "fled";

// Difficulty class (DC) for capture based on pokemon base HP
function getCaptureDC(baseHp: number, ballId: string): number {
  const baseDC = Math.min(18, Math.max(13, Math.floor(6 + (baseHp / 15))));
  const ballReduction: Record<string, number> = {
    "pokeball": 0,
    "great-ball": 2,
    "ultra-ball": 4,
    "master-ball": 99,
  };
  return Math.max(2, baseDC - (ballReduction[ballId] ?? 0));
}

function PokeballSVG({ color, size = 60 }: { color: string; size?: number }) {
  // react.useId() para garantir IDs únicos se houver múltiplas bolas na tela
  const id = React.useId().replace(/:/g, '');
  
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.5)] hover:scale-110 transition-transform duration-300">
      <defs>
        {/* 1. Efeito Joia / Candy Coat (Metade Superior) */}
        <radialGradient id={`topCandy-${id}`} cx="25%" cy="25%" r="80%" fx="25%" fy="25%">
          <stop offset="0%" stopColor="white" stopOpacity="0.6" /> {/* Brilho Central */}
          <stop offset="30%" stopColor={color} />
          <stop offset="100%" stopColor="#000" stopOpacity="0.7" /> {/* Sombra de profundidade */}
        </radialGradient>

        {/* 2. Metal Anodizado Escovado (Metade Inferior) */}
        <radialGradient id={`bottomMetal-${id}`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#E5E7EB" /> {/* slate-200 */}
          <stop offset="100%" stopColor="#9CA3AF" /> {/* slate-400 */}
        </radialGradient>
        
        {/* Textura de escovação metálica (Quase invisível, mas dá realismo) */}
        <pattern id="brushedTexture" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="10" stroke="#000" strokeWidth="0.1" strokeOpacity="0.1" />
        </pattern>

        {/* 3. Brilho de Vidro Superior (Caustics) */}
        <linearGradient id={`glassShine-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.7" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>

        {/* 4. Glow de Energia do Botão (Neon Effect) */}
        <radialGradient id={`buttonGlow-${id}`}>
          <stop offset="0%" stopColor="white" />
          <stop offset="50%" stopColor={color} />
          <stop offset="100%" stopColor="#111" />
        </radialGradient>
        
        {/* Filtro de Desfoque para o Glow */}
        <filter id={`neonBlur-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Corpo Esférico Principal */}
      <circle cx="50" cy="50" r="48" fill="#111" /> Contorno fino preto

      {/* METADE INFERIOR - Metal Escovado */}
      <path d="M2,50 A48,48 0 0,0 98,50 L98,52 L2,52 Z" fill={`url(#bottomMetal-${id})`} />
      <path d="M2,50 A48,48 0 0,0 98,50 L98,52 L2,52 Z" fill="url(#brushedTexture)" opacity="0.4" />
      
      {/* METADE SUPERIOR - Efeito Joia */}
      <path d="M2,50 A48,48 0 0,1 98,50 L98,48 L2,48 Z" fill={`url(#topCandy-${id})`} />

      {/* Sombreamento de Volume (Dá o formato 3D final) */}
      <circle cx="50" cy="50" r="48" fill="url(#baseOcclusion)" />
      <radialGradient id="baseOcclusion">
        <stop offset="85%" stopColor="#000" stopOpacity="0" />
        <stop offset="100%" stopColor="#000" stopOpacity="0.4" />
      </radialGradient>

      {/* Linha de Fechamento Mecânica (Precisão) */}
      <rect x="2" y="46.5" width="96" height="7" fill="#1A1A1A" rx="1" />
      <rect x="2" y="49" width="96" height="1" fill="#000" fillOpacity="0.4" />
      <rect x="2" y="51" width="96" height="0.5" fill="#FFF" fillOpacity="0.1" />

      {/* Brilho de Vidro (Reflexo de Estúdio Curvo) */}
      <path 
        d="M25,20 C40,10 60,10 75,20" 
        stroke={`url(#glassShine-${id})`} 
        strokeWidth="4" 
        strokeLinecap="round" 
        fill="none" 
        className="opacity-70"
      />
      <path 
        d="M15,40 C10,35 10,25 15,20" 
        stroke="white" 
        strokeWidth="1" 
        strokeLinecap="round" 
        strokeOpacity="0.2"
        fill="none" 
      />

      {/* MECANISMO DO BOTÃO CENTRAL (Premium) */}
      {/* Anel de Glow (Neon) que ilumina a carcaça ao redor */}
      <circle 
        cx="50" cy="50" r="14" 
        fill="none" 
        stroke={color} 
        strokeWidth="3" 
        filter={`url(#neonBlur-${id})`}
        className="animate-pulse"
      />
      
      {/* Carcaça do Botão (Polímero Escuro) */}
      <circle cx="50" cy="50" r="14" fill="#1A1A1A" />
      
      {/* O Botão Físico com efeito Joia central */}
      <circle cx="50" cy="50" r="8" fill="#F9FAFB" /> {/* slate-50 */}
      <circle cx="50" cy="50" r="8" fill={`url(#topCandy-${id})`} opacity="0.3" /> {/* Tinge o botão levemente */}
      <circle cx="50" cy="50" r="8" fill="none" stroke="#D1D5DB" strokeWidth="0.5" />
      
      {/* O "Coração" do Botão (A Joia de Energia) */}
      <circle cx="50" cy="50" r="5" fill={`url(#buttonGlow-${id})`} />
      
      {/* Micro-reflexo no centro */}
      <circle cx="48.5" cy="48.5" r="1.5" fill="white" fillOpacity="0.9" />
    </svg>
  );
}

export function CaptureScene({ pokemon, onClose, onCaptured }: CaptureSceneProps) {
  const { bag, trainer } = useGameStore();
  const [phase, setPhase] = useState<CapturePhase>("select-ball");
  const [selectedBall, setSelectedBall] = useState<string | null>(null);
  const [shakeCount, setShakeCount] = useState(0);
  const [message, setMessage] = useState("");
  const [ballsUsed, setBallsUsed] = useState(0);
  const [lastRoll, setLastRoll] = useState<{ d20: number; sorteBonus: number; total: number; dc: number } | null>(null);

  // Pokemon Go-style throw state
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, time: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Ball flight animation state
  const [ballFlight, setBallFlight] = useState<{
    startX: number; startY: number;
    targetX: number; targetY: number;
    active: boolean;
    progress: number;
  } | null>(null);

  // Target ring animation (Pokemon Go pulsing ring)
  const [ringScale, setRingScale] = useState(1);
  const ringDir = useRef(-1);

  // Flee mechanic
  const [fleeChance] = useState(() => {
    // Higher base HP = lower flee chance (stronger/rarer pokemon more likely to stay)
    const base = Math.max(0.05, Math.min(0.35, 0.25 - (pokemon.baseHp - 50) * 0.002));
    return base;
  });
  const fleeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fleeCheckRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Pokemon idle animation
  const [pokemonBob, setPokemonBob] = useState(0);

  // Sorte (luck) bonus from trainer attributes
  const sorteBonus = trainer.attributes?.sorte ?? 0;

  // Available pokeballs from bag
  const availableBalls = bag.filter((item) =>
    ["pokeball", "great-ball", "ultra-ball", "master-ball"].includes(item.itemId) && item.quantity > 0
  );

  const ballData = selectedBall ? POKEBALL_TYPES[selectedBall] : null;
  const mainType = pokemon.types[0];
  const mainColor = TYPE_COLORS[mainType];
  const bagBallQty = (id: string) => bag.find((b) => b.itemId === id)?.quantity ?? 0;

  // ─── Target ring pulsing (like Pokemon Go) ────────────────
  useEffect(() => {
    if (phase !== "ready") return;
    const interval = setInterval(() => {
      setRingScale((prev) => {
        const next = prev + ringDir.current * 0.012;
        if (next <= 0.25) { ringDir.current = 1; return 0.25; }
        if (next >= 1) { ringDir.current = -1; return 1; }
        return next;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [phase]);

  // ─── Pokemon idle bobbing ────────────────────────────────
  useEffect(() => {
    if (phase === "captured" || phase === "fled") return;
    const interval = setInterval(() => {
      setPokemonBob((prev) => prev + 0.08);
    }, 50);
    return () => clearInterval(interval);
  }, [phase]);

  // ─── Flee mechanic: periodic check while in "ready" phase ─
  useEffect(() => {
    if (phase !== "ready") {
      if (fleeCheckRef.current) clearInterval(fleeCheckRef.current);
      return;
    }
    // After a brief grace period, start checking for flee
    fleeTimerRef.current = setTimeout(() => {
      fleeCheckRef.current = setInterval(() => {
        if (Math.random() < fleeChance) {
          setPhase("fled");
          playFlee();
          setMessage(`${pokemon.name} fugiu!`);
          if (fleeCheckRef.current) clearInterval(fleeCheckRef.current);
        }
      }, 3500 + Math.random() * 2000); // Check every 3.5-5.5s
    }, 4000); // 4s grace period

    return () => {
      if (fleeTimerRef.current) clearTimeout(fleeTimerRef.current);
      if (fleeCheckRef.current) clearInterval(fleeCheckRef.current);
    };
  }, [phase, fleeChance, pokemon.name]);

  // Also chance to flee right after escape
  useEffect(() => {
    if (phase !== "escaped") return;
    const timer = setTimeout(() => {
      if (Math.random() < fleeChance * 1.5) {
        setPhase("fled");
        playFlee();
        setMessage(`${pokemon.name} fugiu!`);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [phase, fleeChance, pokemon.name]);

  // ─── Consume a pokeball from bag ──────────────────────────
  const consumeBall = useCallback((ballId: string) => {
    const { bag: currentBag } = useGameStore.getState();
    const newBag = currentBag
      .map((i) => (i.itemId === ballId ? { ...i, quantity: i.quantity - 1 } : i))
      .filter((i) => i.quantity > 0);
    useGameStore.setState({ bag: newBag });
  }, []);

  // ─── D20 capture calculation ──────────────────────────────
  const calculateCapture = useCallback(
    (ballId: string, currentRingScale: number): boolean => {
      if (ballId === "master-ball") {
        setLastRoll({ d20: 20, sorteBonus: 0, total: 20, dc: 0 });
        return true;
      }
      const d20 = Math.floor(Math.random() * 20) + 1;
      const bonus = sorteBonus;
      const accuracyBonus = currentRingScale <= 0.4 ? 2 : currentRingScale <= 0.65 ? 1 : 0;
      const total = d20 + bonus + accuracyBonus;
      const dc = getCaptureDC(pokemon.baseHp, ballId);
      setLastRoll({ d20, sorteBonus: bonus + accuracyBonus, total, dc });
      if (d20 === 1) return false;
      if (d20 === 20) return true;
      return total >= dc;
    },
    [pokemon.baseHp, sorteBonus]
  );

  // ─── Ball flight animation tick ───────────────────────────
  useEffect(() => {
    if (!ballFlight?.active) return;
    const startTime = Date.now();
    const duration = 500; // 500ms flight

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(1, elapsed / duration);
      setBallFlight((prev) => prev ? { ...prev, progress: t } : null);

      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        // Ball arrived at pokemon - trigger hit
        setBallFlight(null);
        setPhase("hit");

        setTimeout(() => {
          setPhase("shaking");
          const success = calculateCapture(selectedBall!, ringScale);
          const shakes = success ? 3 : Math.floor(Math.random() * 3);
          let currentShake = 0;

          const shakeInterval = setInterval(() => {
            currentShake++;
            setShakeCount(currentShake);

            if (currentShake >= (success ? 3 : shakes)) {
              clearInterval(shakeInterval);
              setTimeout(() => {
                if (success) {
                  setPhase("captured");
                  setMessage(`${pokemon.name} foi capturado!`);
                  playGift();
                } else {
                  setPhase("escaped");
                  setMessage(`${pokemon.name} escapou!`);
                  setShakeCount(0);
                  const remainingBalls = useGameStore.getState().bag.filter((item) =>
                    ["pokeball", "great-ball", "ultra-ball", "master-ball"].includes(item.itemId) && item.quantity > 0
                  );
                  if (remainingBalls.length === 0) {
                    setMessage("Sem Pokebolas! O Pokemon fugiu...");
                  }
                }
              }, 500);
            }
          }, 700);
        }, 500);
      }
    };
    requestAnimationFrame(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ballFlight?.active]);

  // ─── Touch / pointer handlers (swipe up to throw) ─────────
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (phase !== "ready") return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      // Only start drag if pointer is in bottom 40% (where the ball sits)
      const relY = (e.clientY - rect.top) / rect.height;
      if (relY < 0.55) return;

      setIsDragging(true);
      dragStartRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
      setDragOffset({ x: 0, y: 0 });
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    [phase]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging || phase !== "ready") return;
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setDragOffset({ x: dx, y: dy });
    },
    [isDragging, phase]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging || phase !== "ready" || !selectedBall) return;
      setIsDragging(false);

      const dy = e.clientY - dragStartRef.current.y;
      const dx = e.clientX - dragStartRef.current.x;
      const elapsed = Date.now() - dragStartRef.current.time;
      const velocity = Math.sqrt(dx * dx + dy * dy) / Math.max(1, elapsed);

      // Need upward swipe with enough speed
      if (dy > -50 || velocity < 0.3) {
        setDragOffset({ x: 0, y: 0 });
        return;
      }

      // Valid throw!
      setPhase("throwing");
      consumeBall(selectedBall);
      setBallsUsed((prev) => prev + 1);
      playPokeball();

      // Calculate ball flight path
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const startX = rect.width / 2 + dragOffset.x;
      const startY = rect.height * 0.78;
      // Target = pokemon center (top ~25% of container)
      const targetX = rect.width / 2 + dx * 0.3; // slight horizontal aim
      const targetY = rect.height * 0.22;

      setBallFlight({
        startX,
        startY,
        targetX: Math.max(rect.width * 0.2, Math.min(rect.width * 0.8, targetX)),
        targetY,
        active: true,
        progress: 0,
      });
      setDragOffset({ x: 0, y: 0 });
    },
    [isDragging, phase, selectedBall, consumeBall, dragOffset]
  );

  // ─── Helpers ─────────────────────���────────────────────────
  const handleSelectBall = (ballId: string) => {
    setSelectedBall(ballId);
    setPhase("ready");
    setMessage("");
    setDragOffset({ x: 0, y: 0 });
    setShakeCount(0);
    playButtonClick();
  };

  const handleRetry = () => {
    const remaining = useGameStore.getState().bag.filter((item) =>
      ["pokeball", "great-ball", "ultra-ball", "master-ball"].includes(item.itemId) && item.quantity > 0
    );
    if (remaining.length === 0) {
      onClose();
      return;
    }
    setPhase("select-ball");
    setSelectedBall(null);
    setMessage("");
    setShakeCount(0);
    setDragOffset({ x: 0, y: 0 });
    setLastRoll(null);
  };

  // ─── Ball flight position with arc ────────────────────────
  function getBallFlightPos() {
    if (!ballFlight) return { x: 0, y: 0, scale: 1, opacity: 1 };
    const t = ballFlight.progress;
    // Ease out quad
    const ease = 1 - (1 - t) * (1 - t);
    const x = ballFlight.startX + (ballFlight.targetX - ballFlight.startX) * ease;
    const linearY = ballFlight.startY + (ballFlight.targetY - ballFlight.startY) * ease;
    // Parabolic arc: peak at t=0.4
    const arcHeight = -120 * Math.sin(t * Math.PI);
    const y = linearY + arcHeight;
    // Scale: starts at 1, ends at 0.4 (perspective shrinking as it goes away)
    const scale = 1 - t * 0.55;
    return { x, y, scale, opacity: 1 };
  }

  // ─── Ring color based on size ─────────────────────────────
  const ringColor = ringScale > 0.65 ? "#22C55E" : ringScale > 0.4 ? "#F59E0B" : "#EF4444";

  return (
    <div className="flex flex-col h-dvh max-w-md mx-auto bg-background overflow-hidden">
      {/* Header */}
      <nav className="flex items-center justify-between px-3 py-2 bg-card border-b border-border z-50">
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="h-8 gap-1 text-muted-foreground"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-xs">Voltar</span>
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-foreground">{pokemon.name}</span>
          <span className="text-xs text-muted-foreground font-mono">
            #{String(pokemon.id).padStart(3, "0")}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {selectedBall && ballData && (
            <>
              <PokeballSVG color={ballData.color} size={20} />
              <span className="text-xs font-mono text-muted-foreground">
                x{bagBallQty(selectedBall)}
              </span>
            </>
          )}
        </div>
      </nav>

{/* Main capture area */}
<div
  ref={containerRef}
  className="flex-1 relative flex flex-col items-center select-none touch-none overflow-hidden"
  style={{
    background: `radial-gradient(ellipse at 50% 30%, ${mainColor}18 0%, transparent 60%), linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--card)) 100%)`,
  }}
  onPointerDown={handlePointerDown}
  onPointerMove={handlePointerMove}
  onPointerUp={handlePointerUp}
>
{/* Fundo Decorativo Estilo ARENA DIGITAL / CYBER-GAMER */}
<div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-slate-950">
  
  {/* 1. Brilho de Fundo (Spotlight Central) */}
  <div 
    className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[150%] h-[150%] rounded-full opacity-20 blur-[120px]"
    style={{ 
      background: `radial-gradient(circle, ${mainColor} 0%, transparent 70%)` 
    }}
  />

  {/* 2. Piso de Hexágonos Dinâmicos (HUD Gamer) */}
  <div 
    className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[200%] h-[500px] opacity-10"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='104' viewBox='0 0 60 104' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 104V88m0-72V0M0 78l15-8.5m30 0l15 8.5m-60-52L15 34.5m30 0L60 26' stroke='${encodeURIComponent(mainColor)}' fill='none' stroke-width='1'/%3E%3C/svg%3E")`,
      transform: 'perspective(600px) rotateX(70deg)',
      maskImage: 'linear-gradient(to top, black 20%, transparent 80%)',
    }}
  />

  {/* 3. Scan Lines / Feixes de Dados (Animados) */}
  <div className="absolute inset-0 opacity-20">
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={`scan-${i}`}
        className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
        initial={{ top: '-10%' }}
        animate={{ top: '110%' }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          delay: i * 1, 
          ease: "linear" 
        }}
      />
    ))}
  </div>

  {/* 4. Moldura de Lentes (Vignette Gamer Estilizada) */}
  <div className="absolute inset-0 pointer-events-none">
    {/* Cantos estilo Interface de Usuário (HUD) */}
    <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-white/10 rounded-tl-xl" />
    <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white/10 rounded-tr-xl" />
    <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-white/10 rounded-bl-xl" />
    <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-white/10 rounded-br-xl" />
  </div>

  {/* 5. Partículas de Energia no Chão */}
  {[...Array(12)].map((_, i) => (
    <motion.div
      key={`energy-${i}`}
      className="absolute bottom-10 left-1/2 w-1 h-3 rounded-full"
      style={{ backgroundColor: mainColor }}
      initial={{ x: (Math.random() - 0.5) * 300, y: 0, opacity: 0, scale: 0 }}
      animate={{ 
        y: -100 - Math.random() * 100, 
        opacity: [0, 0.8, 0], 
        scale: [0, 1, 0] 
      }}
      transition={{ 
        duration: 2 + Math.random() * 2, 
        repeat: Infinity, 
        delay: Math.random() * 5 
      }}
    />
  ))}

  {/* 6. Glow de Base (Onde o Pokémon "pisa") */}
  <div 
    className="absolute top-[30%] left-1/2 -translate-x-1/2 w-48 h-12 rounded-full blur-2xl opacity-30"
    style={{ backgroundColor: mainColor }}
  />
</div>

  {/* 1. Camada de Mira (Target Ring) */}
  <AnimatePresence>
    {phase === "ready" && (
      <motion.div
        className="absolute z-10 flex items-center justify-center pointer-events-none"
        style={{ top: "22%", left: "50%", x: "-50%", y: "-50%" }}
        initial={{ opacity: 0, scale: 1.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
      >
        <div
          className="absolute rounded-full border-2 opacity-40"
          style={{ width: 140, height: 140, borderColor: mainColor }}
        />
        <div
          className="rounded-full border-[3px] shadow-[0_0_15px_rgba(0,0,0,0.2)]"
          style={{
            width: 140 * ringScale,
            height: 140 * ringScale,
            borderColor: ringColor,
            backgroundColor: `${ringColor}10`,
          }}
        />
      </motion.div>
    )}
  </AnimatePresence>

  {/* 2. Camada do Pokémon */}
  <div className="absolute w-full flex justify-center z-20" style={{ top: "12%" }}>
    <AnimatePresence mode="wait">
      {phase === "fled" ? (
        <motion.div
          key="fled"
          initial={{ x: 0, opacity: 1 }}
          animate={{ x: 400, opacity: 0, rotate: 15 }}
          transition={{ duration: 0.7, ease: "easeIn" }}
          className="relative"
        >
          <motion.div className="absolute bottom-0 left-0 text-2xl" animate={{ opacity: [1, 0], scale: [1, 2] }}>💨</motion.div>
          <img src={getBattleSpriteUrl(pokemon.id)} alt={pokemon.name} className="w-32 h-32 object-contain" />
        </motion.div>
      ) : phase === "captured" ? (
        <motion.div
          key="captured"
          className="flex flex-col items-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.4 }}
        >
          <div className="absolute w-64 h-64 rounded-full blur-[60px] opacity-40 -z-10 animate-pulse" style={{ backgroundColor: mainColor }} />
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute"
              animate={{ scale: [0, 1, 0], x: Math.cos(i) * 120, y: Math.sin(i) * 120, rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 + i * 0.1 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={i % 2 === 0 ? "#FFD700" : mainColor}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </motion.div>
          ))}
          <img src={getSpriteUrl(pokemon.id)} alt={pokemon.name} className="w-36 h-36 object-contain pixelated drop-shadow-2xl z-10" />
          <motion.p className="mt-4 text-white font-black italic uppercase tracking-widest bg-black/40 px-6 py-2 rounded-full backdrop-blur-md border border-white/20">
            {pokemon.name} CAPTURADO!
          </motion.p>
        </motion.div>
      ) : (phase !== "hit" && phase !== "shaking") ? (
        <motion.div
          key="pokemon-idle"
          className="relative flex flex-col items-center"
          animate={{ y: Math.sin(pokemonBob) * 8 }}
        >
          <img src={getBattleSpriteUrl(pokemon.id)} alt={pokemon.name} className="w-32 h-32 object-contain drop-shadow-xl" />
          <div className="w-20 h-3 bg-black/20 rounded-[100%] blur-sm mt-2" />
        </motion.div>
      ) : (
        /* Efeito de sucção/impacto quando a bola atinge o pokémon */
        <motion.div
          key="impact"
          initial={{ scale: 1.2, opacity: 1 }}
          animate={{ scale: 0, opacity: 0, y: 60 }}
          className="w-32 h-32 bg-white rounded-full blur-2xl"
        />
      )}
    </AnimatePresence>
  </div>
{/* 3. Camada da Pokébola no chão (Raios Elétricos saindo do Centro) */}
<AnimatePresence>
  {(phase === "hit" || phase === "shaking") && ballData && (
    <motion.div
      className="absolute z-30 flex flex-col items-center"
      style={{ top: "25%", left: "50%", x: "-50%" }}
      initial={{ y: -150, scale: 0.5 }}
      animate={{ 
        y: 0, scale: 1,
        rotate: phase === "shaking" ? [0, -7, 7, -7, 7, 0] : 0
      }}
      transition={{
        y: { type: "spring", stiffness: 400, damping: 20 },
        rotate: phase === "shaking" ? { duration: 0.25, repeat: Infinity } : {}
      }}
    >
      
      {/* ─── RAIOS SAINDO DO CENTRO (CORE) ─── */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        
        {/* Geramos 12 raios para uma cobertura 360º mais densa */}
        {[...Array(12)].map((_, i) => {
          const angle = (i / 12) * 360 + (Math.random() * 15); // Ângulos distribuídos + variação
          const isCyan = i % 2 === 0;
          
          return (
            <motion.div
              key={`lightning-bolt-${i}`}
              className="absolute h-[1px] origin-left"
              style={{
                // O raio nasce exatamente no centro (50% 50%)
                top: "50%",
                left: "50%",
                width: "100px", // Comprimento que ultrapassa a bola
                background: "linear-gradient(90deg, white 0%, rgba(255,255,255,0.8) 50%, transparent 100%)",
                boxShadow: `0 0 8px ${isCyan ? "#00f2ff" : "#ff00e5"}, 0 0 2px white`,
                transform: `rotate(${angle}deg)`,
                filter: "blur(0.5px)",
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={phase === "shaking" ? {
                // Efeito de "disparo" elétrico do centro para fora
                scaleX: [0, 1.2, 0],
                opacity: [0, 1, 0],
                // Pequeno tremor na posição do raio para parecer instável
                skewY: [0, 2, -50, 0], 
              } : {}}
              transition={{
                duration: 0.2,
                repeat: Infinity,
                repeatDelay: Math.random() * 0.6,
                delay: i * 0.03,
                ease: "easeOut"
              }}
            />
          );
        })}

        {/* Aura de Choque Central (O "flash" no botão) */}
        <motion.div
          className="absolute w-8 h-8 rounded-full bg-white blur-md"
          animate={phase === "shaking" ? {
            scale: [1, 1.8, 1],
            opacity: [0.2, 0.6, 0.2],
          } : { opacity: 0 }}
          transition={{ duration: 0.2, repeat: Infinity }}
        />
      </div>

      {/* Pokébola Principal */}
      <div className="relative z-10">
        <PokeballSVG color={ballData.color} size={65} />
      </div>
      
      {/* HUD de Progresso Gamer */}
      <div className="flex items-center gap-3 mt-6 px-4 py-1.5 bg-black/40 border border-white/10 backdrop-blur-md rounded-lg z-10">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-3 rounded-sm"
              style={{
                backgroundColor: i < shakeCount ? ballData.color : "#334155",
                boxShadow: i < shakeCount ? `0 0 10px ${ballData.color}` : "none",
              }}
              animate={i < shakeCount ? { opacity: [1, 0.4, 1] } : {}}
            />
          ))}
        </div>
        <span className="text-[9px] font-mono text-white/70 uppercase tracking-tighter">
          {shakeCount < 3 ? `Analyzing... ${shakeCount * 33}%` : "Success_Locked"}
        </span>
      </div>
    </motion.div>
  )}
</AnimatePresence>
{/* 4. Pokébola em voo com Rastro de Movimento */}
{ballFlight && ballData && (() => {
  const currentPos = getBallFlightPos();
  
  // Criamos um array para as "sombras" do rastro
  // Quanto mais itens no array, mais longo o rastro
  const trailSteps = [0.02, 0.04, 0.06, 0.08]; 

  return (
    <>
      {/* Camada do Rastro (Renderizada antes da bola principal para ficar atrás) */}
      {trailSteps.map((offset, i) => {
        // Calculamos a posição da bola alguns milissegundos atrás
        const trailProgress = Math.max(0, ballFlight.progress - offset);
        const trailPos = getBallFlightPos(trailProgress);
        
        // Se o progresso for 0, não desenhamos a partícula
        if (trailProgress <= 0) return null;

        return (
          <div
            key={`trail-${i}`}
            className="absolute z-30 pointer-events-none"
            style={{
              left: trailPos.x,
              top: trailPos.y,
              transform: `translate(-50%, -50%) scale(${trailPos.scale * (1 - offset * 5)})`,
              opacity: (trailPos.opacity * 0.4) / (i + 1), // Vai sumindo
              filter: `blur(${i * 2}px)`, // Fica mais borrado conforme se afasta
            }}
          >
            {/* Um círculo brilhante da cor da bola como rastro */}
            <div 
              className="w-10 h-10 rounded-full" 
              style={{ 
                backgroundColor: ballData.color,
                boxShadow: `0 0 20px ${ballData.color}` 
              }} 
            />
          </div>
        );
      })}

      {/* Pokébola Principal */}
      <div
        className="absolute z-40 pointer-events-none"
        style={{
          left: currentPos.x,
          top: currentPos.y,
          transform: `translate(-50%, -50%) scale(${currentPos.scale}) rotate(${ballFlight.progress * 720}deg)`,
          opacity: currentPos.opacity,
          filter: `drop-shadow(0 ${10 * (1 - ballFlight.progress)}px 15px rgba(0,0,0,0.4))`,
        }}
      >
        {/* Aura de brilho intenso na bola principal */}
        <motion.div 
          className="absolute -inset-4 rounded-full blur-xl opacity-60" 
          style={{ backgroundColor: ballData.color }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 0.2 }}
        />
        <PokeballSVG color={ballData.color} size={56} />
      </div>
    </>
  );
})()}

  {/* 5. Pokébola para arrastar (Ready State) */}
  <AnimatePresence>
    {phase === "ready" && ballData && !ballFlight && (
      <motion.div
        className="absolute z-40 flex flex-col items-center"
        style={{
          bottom: "10%",
          left: "50%",
          x: `calc(-50% + ${dragOffset.x}px)`,
          y: dragOffset.y,
        }}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1, scale: isDragging ? 1.1 : 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <motion.div 
          className="absolute -inset-6 rounded-full blur-2xl opacity-40 -z-10" 
          style={{ backgroundColor: ballData.color }}
          animate={{ opacity: isDragging ? 0.2 : [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
        <PokeballSVG color={ballData.color} size={64} />
        {!isDragging && (
          <motion.p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter mt-4" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
            Arraste para lançar
          </motion.p>
        )}
      </motion.div>
    )}
  </AnimatePresence>

  {/* Indicador de Risco de Fuga */}
  {phase === "ready" && (
    <motion.div
      className="absolute top-4 right-4 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10"
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
    >
      <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
      <span className="text-[10px] text-amber-400 font-black uppercase italic">Instável</span>
    </motion.div>
  )}

{/* 6. Tela de Seleção de Mochila (Overlay) - ESTILO GAMER TECH */}
<AnimatePresence>
  {phase === "select-ball" && (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col items-center justify-end bg-slate-950/40 backdrop-blur-md"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      {/* Background Dimmer com efeito de Scanline */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none" />

      <motion.div 
        className="w-full bg-slate-900/90 border-t-2 border-primary/50 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] p-6 relative overflow-hidden"
        style={{ 
          clipPath: "polygon(0 15px, 15px 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 0 100%)",
        }}
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 250 }}
      >
        {/* Detalhes de HUD nos cantos do painel */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
        
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center gap-2">
              <span className="w-2 h-6 bg-primary animate-pulse" />
              Inventory_System
            </h2>
            <p className="text-[10px] text-primary font-mono uppercase tracking-[0.2em] opacity-70">
              Target_Selection: {pokemon.name}
            </p>
          </div>
          <div className="text-right font-mono text-[10px] text-muted-foreground">
            v4.0.2 // STABLE
          </div>
        </div>

        <div className="flex flex-col gap-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
          {availableBalls.filter(b => b.quantity > 0).map((item) => {
            const bd = POKEBALL_TYPES[item.itemId];
            return (
              <motion.button
                key={item.itemId}
                onClick={() => handleSelectBall(item.itemId)}
                whileHover={{ x: 8 }}
                className="relative flex items-center gap-4 p-4 rounded-lg bg-slate-800/50 border border-white/5 hover:border-primary/50 hover:bg-primary/10 transition-all group overflow-hidden"
              >
                {/* Efeito de Glitch/Scan no Hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                
                <div className="relative z-10 p-2 bg-black/40 rounded-md border border-white/5 group-hover:scale-110 group-hover:rotate-12 transition-transform">
                  <PokeballSVG color={bd.color} size={40} />
                </div>

                <div className="flex-1 relative z-10">
                  <div className="flex items-center gap-2">
                    <p className="font-black text-white uppercase text-sm italic tracking-tight">{bd.name}</p>
                    <div className="h-[2px] flex-1 bg-white/5" />
                  </div>
                  <p className="text-[9px] text-primary/80 font-mono uppercase mt-1">
                    Capture_Rate: <span className="text-white">x{bd.multiplier.toFixed(1)}</span>
                  </p>
                </div>

                <div className="text-right relative z-10">
                  <p className="text-[10px] text-muted-foreground font-mono uppercase">Qty</p>
                  <span className="text-2xl font-black text-white font-mono leading-none">
                    {item.quantity < 10 ? `0${item.quantity}` : item.quantity}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        <Button 
          onClick={onClose} 
          variant="outline" 
          className="w-full mt-6 border-primary/20 bg-transparent text-primary hover:bg-primary hover:text-black font-black uppercase italic tracking-widest transition-all"
        >
          [ Cancel_Operation ]
        </Button>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

  {/* 7. Overlay de Resultados e Mensagens */}
  <AnimatePresence>
    {(phase === "escaped" || phase === "captured" || phase === "fled") && (
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-50 p-8 flex flex-col items-center gap-6"
        style={{ background: "linear-gradient(0deg, hsl(var(--card)) 40%, transparent 100%)" }}
        initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      >
        {/* Painel de Rolagem D20 */}
        {lastRoll && phase !== "fled" && (
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/80 border border-white/5 backdrop-blur-md w-full max-w-xs">
            <div 
              className="w-14 h-14 rounded-xl flex items-center justify-center font-black text-2xl text-white shadow-lg"
              style={{ backgroundColor: lastRoll.total >= lastRoll.dc ? "#22C55E" : "#EF4444" }}
            >
              {lastRoll.d20}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-black text-muted-foreground tracking-widest italic">Resultado do Dado</span>
              <span className="text-sm font-bold">Total: {lastRoll.total} <span className="text-muted-foreground font-normal">vs DC {lastRoll.dc}</span></span>
              {lastRoll.d20 === 20 && <span className="text-[10px] text-green-400 font-bold uppercase">✨ Crítico!</span>}
            </div>
          </div>
        )}

        {/* Botões de Ação Final */}
        <div className="w-full max-w-xs flex flex-col gap-3">
          {phase === "captured" ? (
            <Button 
              onClick={() => onCaptured(pokemon, ballsUsed)} 
              className="w-full h-12 font-black italic uppercase tracking-widest text-white shadow-xl shadow-primary/20"
              style={{ backgroundColor: mainColor }}
            >
              Adicionar à Equipe
            </Button>
          ) : phase === "fled" ? (
            <Button onClick={onClose} variant="secondary" className="w-full h-12 font-bold uppercase tracking-widest">
              O Pokémon fugiu...
            </Button>
          ) : (
            <>
              <Button 
                onClick={handleRetry} 
                className="w-full h-12 font-black italic uppercase tracking-widest text-white"
                style={{ backgroundColor: mainColor }}
              >
                Tentar Novamente
              </Button>
              <Button onClick={onClose} variant="ghost" className="text-muted-foreground uppercase text-xs font-bold">
                Desistir do Encontro
              </Button>
            </>
          )}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</div>

      {/* Bottom info bar (when in ready phase) */}
      {phase === "ready" && ballData && (
        <div className="flex items-center justify-between px-4 py-3 bg-card border-t border-border">
          <button
            onClick={() => {
              setPhase("select-ball");
              setSelectedBall(null);
              playButtonClick();
            }}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <PokeballSVG color={ballData.color} size={24} />
            <span>{ballData.name} x{bagBallQty(selectedBall!)}</span>
            <span className="text-[10px] text-muted-foreground/60">trocar</span>
          </button>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>DC: {getCaptureDC(pokemon.baseHp, selectedBall!)}</span>
            {sorteBonus > 0 && <span>Sorte: +{sorteBonus}</span>}
            {ballsUsed > 0 && <span>#{ballsUsed}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

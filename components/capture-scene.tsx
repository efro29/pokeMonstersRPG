"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/lib/game-store";
import { getBattleSpriteUrl, getSpriteUrl, TYPE_COLORS, POKEMON } from "@/lib/pokemon-data";
import type { PokemonSpecies } from "@/lib/pokemon-data";
import { Button } from "@/components/ui/button";
import { ChevronLeft, CircleDot, X } from "lucide-react";
import { playPokeball, playGift, playButtonClick } from "@/lib/sounds";

interface CaptureSceneProps {
  pokemon: PokemonSpecies;
  onClose: () => void;
  onCaptured: (species: PokemonSpecies) => void;
}

// Pokeball types with capture rate multipliers
const POKEBALL_TYPES: Record<string, { name: string; multiplier: number; color: string; gradient: string }> = {
  "pokeball": {
    name: "Pokeball",
    multiplier: 1,
    color: "#EF4444",
    gradient: "linear-gradient(180deg, #EF4444 0%, #EF4444 45%, #1E293B 45%, #1E293B 55%, #F8FAFC 55%, #F8FAFC 100%)",
  },
  "great-ball": {
    name: "Great Ball",
    multiplier: 1.5,
    color: "#3B82F6",
    gradient: "linear-gradient(180deg, #3B82F6 0%, #3B82F6 45%, #1E293B 45%, #1E293B 55%, #F8FAFC 55%, #F8FAFC 100%)",
  },
  "ultra-ball": {
    name: "Ultra Ball",
    multiplier: 2,
    color: "#F59E0B",
    gradient: "linear-gradient(180deg, #1E293B 0%, #1E293B 45%, #F59E0B 45%, #F59E0B 55%, #F8FAFC 55%, #F8FAFC 100%)",
  },
  "master-ball": {
    name: "Master Ball",
    multiplier: 255,
    color: "#8B5CF6",
    gradient: "linear-gradient(180deg, #8B5CF6 0%, #8B5CF6 45%, #1E293B 45%, #1E293B 55%, #F8FAFC 55%, #F8FAFC 100%)",
  },
};

type CapturePhase = "ready" | "throwing" | "hit" | "shaking" | "captured" | "escaped" | "select-ball";

// Difficulty class (DC) for capture based on pokemon base HP
function getCaptureDC(baseHp: number, ballId: string): number {
  // Tougher pokemon = higher DC
  // baseHp ranges roughly 20-120
  // DC ranges: 8 (easy) to 18 (legendary)
  const baseDC = Math.min(18, Math.max(8, Math.floor(6 + (baseHp / 15))));

  // Ball bonus reduces DC
  const ballReduction: Record<string, number> = {
    "pokeball": 0,
    "great-ball": 2,
    "ultra-ball": 4,
    "master-ball": 99, // auto-success
  };

  return Math.max(2, baseDC - (ballReduction[ballId] ?? 0));
}

export function CaptureScene({ pokemon, onClose, onCaptured }: CaptureSceneProps) {
  const { bag, addBagItem, trainer } = useGameStore();
  const [phase, setPhase] = useState<CapturePhase>("select-ball");
  const [selectedBall, setSelectedBall] = useState<string | null>(null);
  const [shakeCount, setShakeCount] = useState(0);
  const [message, setMessage] = useState("");
  const [ballsUsed, setBallsUsed] = useState(0);
  const [lastRoll, setLastRoll] = useState<{ d20: number; sorteBonus: number; total: number; dc: number } | null>(null);

  // Drag/throw state
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragCurrent, setDragCurrent] = useState({ x: 0, y: 0 });
  const [ballPos, setBallPos] = useState({ x: 0, y: 0 });
  const [throwAnim, setThrowAnim] = useState(false);

  // Target ring animation
  const [ringScale, setRingScale] = useState(1);
  const ringDir = useRef(1);

  // Sorte (luck) bonus from trainer attributes
  const sorteBonus = trainer.attributes?.sorte ?? 0;

  // Available pokeballs from bag
  const availableBalls = bag.filter((item) => {
    return ["pokeball", "great-ball", "ultra-ball", "master-ball"].includes(item.itemId) && item.quantity > 0;
  });

  // Animate the target ring
  useEffect(() => {
    if (phase !== "ready") return;
    const interval = setInterval(() => {
      setRingScale((prev) => {
        const next = prev + ringDir.current * 0.015;
        if (next >= 1) { ringDir.current = -1; return 1; }
        if (next <= 0.3) { ringDir.current = 1; return 0.3; }
        return next;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [phase]);

  // Consume a pokeball from bag
  const consumeBall = useCallback((ballId: string) => {
    const { bag: currentBag } = useGameStore.getState();
    const newBag = currentBag.map((i) =>
      i.itemId === ballId ? { ...i, quantity: i.quantity - 1 } : i
    ).filter((i) => i.quantity > 0);
    useGameStore.setState({ bag: newBag });
  }, []);

  // Calculate capture success using D20 + Sorte
  const calculateCapture = useCallback((ballId: string, ringAccuracy: number): boolean => {
    if (ballId === "master-ball") {
      setLastRoll({ d20: 20, sorteBonus: 0, total: 20, dc: 0 });
      return true;
    }

    // Roll a d20
    const d20 = Math.floor(Math.random() * 20) + 1;

    // Sorte bonus: +1 per point of sorte attribute
    const bonus = sorteBonus;

    // Ring accuracy bonus: smaller ring when thrown = +1 to +3 bonus
    // ringScale ranges 0.3 (small/hard) to 1.0 (large/easy)
    const accuracyBonus = ringAccuracy <= 0.4 ? 3 : ringAccuracy <= 0.65 ? 2 : ringAccuracy <= 0.85 ? 1 : 0;

    const total = d20 + bonus + accuracyBonus;

    // DC depends on pokemon + ball type
    const dc = getCaptureDC(pokemon.baseHp, ballId);

    setLastRoll({ d20, sorteBonus: bonus + accuracyBonus, total, dc });

    // Natural 1 always fails, natural 20 always succeeds
    if (d20 === 1) return false;
    if (d20 === 20) return true;

    return total >= dc;
  }, [pokemon.baseHp, sorteBonus]);

  // Handle touch/mouse events for the pokeball throw
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (phase !== "ready") return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDragging(true);
    setDragStart({ x, y });
    setDragCurrent({ x, y });
    setBallPos({ x: 0, y: 0 });
  }, [phase]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging || phase !== "ready") return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setDragCurrent({ x, y });

    // Move ball relative to drag
    const dx = x - dragStart.x;
    const dy = y - dragStart.y;
    setBallPos({ x: dx, y: dy });
  }, [isDragging, phase, dragStart]);

  const handlePointerUp = useCallback(() => {
    if (!isDragging || phase !== "ready" || !selectedBall) return;
    setIsDragging(false);

    // Calculate throw velocity (upward = negative dy)
    const dy = dragCurrent.y - dragStart.y;
    const dx = dragCurrent.x - dragStart.x;
    const velocity = Math.sqrt(dx * dx + dy * dy);

    // Need sufficient upward throw
    if (dy > -40 || velocity < 50) {
      // Not a valid throw - reset
      setBallPos({ x: 0, y: 0 });
      return;
    }

    // Valid throw!
    setPhase("throwing");
    setThrowAnim(true);
    consumeBall(selectedBall);
    setBallsUsed((prev) => prev + 1);
    playPokeball();

    // After throw animation - ball hits pokemon
    setTimeout(() => {
      setPhase("hit");
      setThrowAnim(false);

      // Start shaking animation
      setTimeout(() => {
        setPhase("shaking");
        const success = calculateCapture(selectedBall, ringScale);
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
                // lastRoll is already set by calculateCapture

                // Check if player still has balls
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
      }, 600);
    }, 600);
  }, [isDragging, phase, selectedBall, dragCurrent, dragStart, ringScale, consumeBall, calculateCapture, pokemon.name]);

  const handleSelectBall = (ballId: string) => {
    setSelectedBall(ballId);
    setPhase("ready");
    setMessage("");
    setBallPos({ x: 0, y: 0 });
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
    setBallPos({ x: 0, y: 0 });
  };

  const mainType = pokemon.types[0];
  const mainColor = TYPE_COLORS[mainType];
  const ballData = selectedBall ? POKEBALL_TYPES[selectedBall] : null;
  const bagBallQty = (id: string) => bag.find((b) => b.itemId === id)?.quantity ?? 0;

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
          <span className="text-xs text-muted-foreground font-mono">#{String(pokemon.id).padStart(3, "0")}</span>
        </div>
        <div className="flex items-center gap-1">
          {selectedBall && ballData && (
            <>
              <div
                className="w-5 h-5 rounded-full border border-border"
                style={{ background: ballData.gradient }}
              />
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
        className="flex-1 relative flex flex-col items-center justify-center select-none touch-none overflow-hidden"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, ${mainColor}15 0%, transparent 60%), linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--card)) 100%)`,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={() => {
          if (isDragging) {
            setIsDragging(false);
            setBallPos({ x: 0, y: 0 });
          }
        }}
      >
        {/* Grass/ground decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{
            background: "linear-gradient(180deg, transparent 0%, rgba(34,197,94,0.08) 40%, rgba(34,197,94,0.15) 100%)",
          }}
        />

        {/* Target ring around pokemon (only when ready) */}
        <AnimatePresence>
          {phase === "ready" && (
            <motion.div
              className="absolute z-10"
              style={{ top: "22%" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="rounded-full border-[3px]"
                style={{
                  width: 120,
                  height: 50,
                  borderColor: ringScale > 0.65 ? "#22C55E" : ringScale > 0.4 ? "#F59E0B" : "#EF4444",
                  transform: `scale(${ringScale})`,
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pokemon sprite */}
        <AnimatePresence mode="wait">
          {phase !== "captured" ? (
            <motion.div
              key="pokemon-visible"
              className="relative z-20"
              style={{ marginTop: "-15%" }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: phase === "hit" || phase === "shaking" ? 0 : 1,
                opacity: phase === "hit" || phase === "shaking" ? 0 : 1,
                y: phase === "escaped" ? [0, -10, 0] : 0,
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Glow behind pokemon */}
              <div
                className="absolute -inset-8 rounded-full blur-3xl opacity-30 -z-10"
                style={{ backgroundColor: mainColor }}
              />
              <img
                src={getBattleSpriteUrl(pokemon.id)}
                alt={pokemon.name}
                width={140}
                height={140}
                className="drop-shadow-[0_8px_20px_rgba(0,0,0,0.5)]"
                style={{ imageRendering: "auto", minWidth: 100, minHeight: 100 }}
                crossOrigin="anonymous"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getSpriteUrl(pokemon.id);
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="captured-celebration"
              className="flex flex-col items-center gap-4 z-20"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
            >
              {/* Sparkles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{ backgroundColor: mainColor }}
                  initial={{
                    x: 0, y: 0, opacity: 1, scale: 1,
                  }}
                  animate={{
                    x: Math.cos((i / 8) * Math.PI * 2) * 80,
                    y: Math.sin((i / 8) * Math.PI * 2) * 80,
                    opacity: 0,
                    scale: 0,
                  }}
                  transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                />
              ))}

              <img
                src={getSpriteUrl(pokemon.id)}
                alt={pokemon.name}
                width={120}
                height={120}
                className="pixelated drop-shadow-[0_6px_12px_rgba(0,0,0,0.4)]"
                crossOrigin="anonymous"
              />
              <motion.p
                className="text-lg font-bold text-foreground text-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {pokemon.name} foi capturado!
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pokeball on ground / being shaken */}
        <AnimatePresence>
          {(phase === "hit" || phase === "shaking") && ballData && (
            <motion.div
              className="absolute z-30 flex flex-col items-center"
              style={{ top: "30%" }}
              initial={{ scale: 0 }}
              animate={{
                scale: 1,
                rotate: phase === "shaking" ? [0, -20, 20, -20, 20, 0] : 0,
              }}
              transition={
                phase === "shaking"
                  ? { rotate: { duration: 0.6, repeat: Infinity, repeatDelay: 0.3 } }
                  : { type: "spring", stiffness: 300, damping: 20 }
              }
            >
              {/* Pokeball SVG */}
              <svg width="60" height="60" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill={ballData.color} stroke="#1E293B" strokeWidth="3" />
                <rect x="2" y="48" width="96" height="4" fill="#1E293B" />
                <path d="M 2 50 A 48 48 0 0 0 98 50" fill="#F1F5F9" />
                <circle cx="50" cy="50" r="14" fill="#F1F5F9" stroke="#1E293B" strokeWidth="3" />
                <circle cx="50" cy="50" r="7" fill="#1E293B" />
              </svg>
              {/* Shake dots */}
              <div className="flex gap-2 mt-3">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      backgroundColor: i < shakeCount ? ballData.color : "rgba(255,255,255,0.15)",
                      boxShadow: i < shakeCount ? `0 0 8px ${ballData.color}` : "none",
                    }}
                    animate={i < shakeCount ? { scale: [1, 1.4, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Throwable pokeball at bottom (when ready) */}
        <AnimatePresence>
          {phase === "ready" && ballData && (
            <motion.div
              className="absolute bottom-16 z-40 cursor-grab active:cursor-grabbing"
              style={{
                transform: `translate(${ballPos.x}px, ${ballPos.y}px)`,
              }}
              initial={{ y: 40, opacity: 0 }}
              animate={{
                y: throwAnim ? -400 : 0,
                opacity: throwAnim ? 0 : 1,
                scale: isDragging ? 1.15 : 1,
              }}
              exit={{ y: -400, opacity: 0, transition: { duration: 0.3 } }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <svg width="64" height="64" viewBox="0 0 100 100" className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
                <circle cx="50" cy="50" r="48" fill={ballData.color} stroke="#1E293B" strokeWidth="3" />
                <rect x="2" y="48" width="96" height="4" fill="#1E293B" />
                <path d="M 2 50 A 48 48 0 0 0 98 50" fill="#F1F5F9" />
                <circle cx="50" cy="50" r="14" fill="#F1F5F9" stroke="#1E293B" strokeWidth="3" />
                <circle cx="50" cy="50" r="7" fill={isDragging ? ballData.color : "#1E293B"} />
              </svg>
              {!isDragging && (
                <motion.p
                  className="text-[10px] text-muted-foreground text-center mt-2 whitespace-nowrap"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  Arraste para cima para lancar
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ball selection screen */}
        <AnimatePresence>
          {phase === "select-ball" && (
            <motion.div
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm px-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-lg font-bold text-foreground mb-1">Escolha a Pokebola</h2>
              <p className="text-xs text-muted-foreground mb-6 text-center">
                Selecione qual Pokebola usar para tentar capturar {pokemon.name}
              </p>

              {availableBalls.length === 0 ? (
                <div className="flex flex-col items-center gap-4">
                  <p className="text-sm text-destructive font-medium">Sem Pokebolas na bolsa!</p>
                  <p className="text-xs text-muted-foreground text-center">
                    Compre Pokebolas na Loja antes de tentar capturar.
                  </p>
                  <Button onClick={onClose} variant="outline" className="border-border text-foreground">
                    Voltar
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 w-full max-w-xs">
                  {availableBalls.map((item) => {
                    const bd = POKEBALL_TYPES[item.itemId];
                    if (!bd) return null;
                    return (
                      <button
                        key={item.itemId}
                        onClick={() => handleSelectBall(item.itemId)}
                        className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-secondary transition-all active:scale-95"
                      >
                        <svg width="44" height="44" viewBox="0 0 100 100" className="shrink-0 drop-shadow-md">
                          <circle cx="50" cy="50" r="48" fill={bd.color} stroke="#1E293B" strokeWidth="3" />
                          <rect x="2" y="48" width="96" height="4" fill="#1E293B" />
                          <path d="M 2 50 A 48 48 0 0 0 98 50" fill="#F1F5F9" />
                          <circle cx="50" cy="50" r="14" fill="#F1F5F9" stroke="#1E293B" strokeWidth="3" />
                          <circle cx="50" cy="50" r="7" fill="#1E293B" />
                        </svg>
                        <div className="flex flex-col items-start flex-1">
                          <span className="text-sm font-semibold text-foreground">{bd.name}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {item.itemId === "master-ball"
                              ? "Captura garantida"
                              : `Multiplicador: x${bd.multiplier}`}
                          </span>
                        </div>
                        <span
                          className="text-sm font-bold font-mono px-2.5 py-1 rounded-lg"
                          style={{ backgroundColor: `${bd.color}20`, color: bd.color }}
                        >
                          x{item.quantity}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result message overlay */}
        <AnimatePresence>
          {(phase === "escaped" || phase === "captured") && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 z-50 p-6 flex flex-col items-center gap-4"
              style={{
                background: "linear-gradient(0deg, hsl(var(--card)) 0%, hsl(var(--card)) 60%, transparent 100%)",
              }}
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              {/* D20 Roll result display */}
              {lastRoll && (
                <motion.div
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-border bg-secondary/80 backdrop-blur-sm"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  {/* D20 dice icon */}
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg text-white shrink-0"
                    style={{
                      backgroundColor:
                        lastRoll.d20 === 20
                          ? "#22C55E"
                          : lastRoll.d20 === 1
                          ? "#EF4444"
                          : lastRoll.total >= lastRoll.dc
                          ? "#22C55E"
                          : "#EF4444",
                      boxShadow: `0 0 12px ${
                        lastRoll.d20 === 20 || lastRoll.total >= lastRoll.dc
                          ? "rgba(34,197,94,0.4)"
                          : "rgba(239,68,68,0.4)"
                      }`,
                    }}
                  >
                    {lastRoll.d20}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">
                      D20: {lastRoll.d20}
                      {lastRoll.sorteBonus > 0 && ` + ${lastRoll.sorteBonus} bonus`}
                      {` = `}
                      <span className="font-bold text-foreground">{lastRoll.total}</span>
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Dificuldade (DC): <span className="font-bold text-foreground">{lastRoll.dc}</span>
                    </span>
                    {lastRoll.d20 === 20 && (
                      <span className="text-[10px] font-bold text-green-400">CRITICO! Captura garantida!</span>
                    )}
                    {lastRoll.d20 === 1 && (
                      <span className="text-[10px] font-bold text-red-400">FALHA CRITICA!</span>
                    )}
                  </div>
                </motion.div>
              )}

              {phase === "captured" ? (
                <>
                  <Button
                    onClick={() => onCaptured(pokemon)}
                    className="w-full max-w-xs font-bold text-sm"
                    style={{ backgroundColor: mainColor, color: "#fff" }}
                  >
                    Adicionar a Equipe
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-destructive">{message}</p>
                  {availableBalls.length > 0 ? (
                    <div className="flex gap-3 w-full max-w-xs">
                      <Button
                        onClick={handleRetry}
                        className="flex-1 font-bold text-sm"
                        style={{ backgroundColor: mainColor, color: "#fff" }}
                      >
                        Tentar Novamente
                      </Button>
                      <Button
                        onClick={onClose}
                        variant="outline"
                        className="border-border text-foreground"
                      >
                        Desistir
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={onClose}
                      variant="outline"
                      className="w-full max-w-xs border-border text-foreground"
                    >
                      Sem Pokebolas - Voltar
                    </Button>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Drag indicator line */}
        {isDragging && phase === "ready" && (
          <svg
            className="absolute inset-0 z-30 pointer-events-none"
            style={{ width: "100%", height: "100%" }}
          >
            <line
              x1={dragStart.x}
              y1={dragStart.y}
              x2={dragCurrent.x}
              y2={dragCurrent.y}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="2"
              strokeDasharray="6 4"
            />
          </svg>
        )}
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
            <svg width="24" height="24" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="48" fill={ballData.color} stroke="#1E293B" strokeWidth="3" />
              <rect x="2" y="48" width="96" height="4" fill="#1E293B" />
              <path d="M 2 50 A 48 48 0 0 0 98 50" fill="#F1F5F9" />
              <circle cx="50" cy="50" r="10" fill="#F1F5F9" stroke="#1E293B" strokeWidth="3" />
              <circle cx="50" cy="50" r="5" fill="#1E293B" />
            </svg>
            <span>{ballData.name} x{bagBallQty(selectedBall!)}</span>
            <span className="text-[10px] text-muted-foreground/60">trocar</span>
          </button>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>DC: {getCaptureDC(pokemon.baseHp, selectedBall!)}</span>
            {sorteBonus > 0 && <span>Sorte: +{sorteBonus}</span>}
            <span>Tentativas: {ballsUsed}</span>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useRef, useCallback, useEffect } from "react";
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

// ─── Pokeball SVG component ────────────────────────────────
function PokeballSVG({ color, size = 60, center = false }: { color: string; size?: number; center?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={`drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] ${center ? "" : ""}`}>
      <circle cx="50" cy="50" r="48" fill={color} stroke="#1E293B" strokeWidth="3" />
      <rect x="2" y="48" width="96" height="4" fill="#1E293B" />
      <path d="M 2 50 A 48 48 0 0 0 98 50" fill="#F1F5F9" />
      <circle cx="50" cy="50" r="14" fill="#F1F5F9" stroke="#1E293B" strokeWidth="3" />
      <circle cx="50" cy="50" r="7" fill="#1E293B" />
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

  // ─── Helpers ──────────────────────────────────────────────
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
        {/* Grass/ground */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(34,197,94,0.06) 30%, rgba(34,197,94,0.15) 100%)",
          }}
        />

        {/* Target ring around pokemon (Pokemon Go style) */}
        <AnimatePresence>
          {phase === "ready" && (
            <motion.div
              className="absolute z-10 flex items-center justify-center"
              style={{ top: "16%", left: "50%", transform: "translateX(-50%)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
            >
              {/* Outer fixed circle */}
              <div
                className="absolute rounded-full border-2 opacity-30"
                style={{ width: 160, height: 160, borderColor: mainColor }}
              />
              {/* Pulsing inner colored circle */}
              <div
                className="rounded-full border-[3px]"
                style={{
                  width: 160 * ringScale,
                  height: 160 * ringScale,
                  borderColor: ringColor,
                  backgroundColor: `${ringColor}08`,
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pokemon sprite area */}
        <div className="absolute" style={{ top: "10%", left: "50%", transform: "translateX(-50%)" }}>
          <AnimatePresence mode="wait">
            {phase === "fled" ? (
              // Fled animation: pokemon runs away
              <motion.div
                key="fled"
                initial={{ x: 0, opacity: 1 }}
                animate={{ x: 300, opacity: 0, rotate: -15 }}
                transition={{ duration: 0.6, ease: "easeIn" }}
                className="relative"
              >
                <img
                  src={getBattleSpriteUrl(pokemon.id)}
                  alt={pokemon.name}
                  width={130}
                  height={130}
                  style={{ imageRendering: "auto", minWidth: 100, minHeight: 100 }}
                  crossOrigin="anonymous"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getSpriteUrl(pokemon.id);
                  }}
                />
              </motion.div>
            ) : phase === "captured" ? (
              // Captured celebration
              <motion.div
                key="captured"
                className="flex flex-col items-center gap-4"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
              >
                {/* Sparkle particles */}
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{ backgroundColor: i % 2 === 0 ? mainColor : "#FFD700" }}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{
                      x: Math.cos((i / 12) * Math.PI * 2) * 90,
                      y: Math.sin((i / 12) * Math.PI * 2) * 90,
                      opacity: 0,
                      scale: 0,
                    }}
                    transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                  />
                ))}
                {/* Star sparkles */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={`star-${i}`}
                    className="absolute text-yellow-400"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1.2, 0],
                      x: Math.cos((i / 6) * Math.PI * 2) * 60,
                      y: Math.sin((i / 6) * Math.PI * 2) * 60,
                    }}
                    transition={{ duration: 0.8, delay: 0.6 + i * 0.1 }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </motion.div>
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
            ) : phase !== "hit" && phase !== "shaking" ? (
              // Normal pokemon display with idle bob
              <motion.div
                key="pokemon-idle"
                className="relative"
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  y: Math.sin(pokemonBob) * 6,
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ scale: { duration: 0.5 }, opacity: { duration: 0.5 } }}
              >
                {/* Glow */}
                <div
                  className="absolute -inset-8 rounded-full blur-3xl opacity-25 -z-10"
                  style={{ backgroundColor: mainColor }}
                />
                <img
                  src={getBattleSpriteUrl(pokemon.id)}
                  alt={pokemon.name}
                  width={130}
                  height={130}
                  className="drop-shadow-[0_8px_20px_rgba(0,0,0,0.5)]"
                  style={{ imageRendering: "auto", minWidth: 100, minHeight: 100 }}
                  crossOrigin="anonymous"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getSpriteUrl(pokemon.id);
                  }}
                />
                {/* Shadow under pokemon */}
                <div
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-3 rounded-full opacity-30 blur-sm"
                  style={{ backgroundColor: "#000" }}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Pokeball on ground shaking (after hit) */}
        <AnimatePresence>
          {(phase === "hit" || phase === "shaking") && ballData && (
            <motion.div
              className="absolute z-30 flex flex-col items-center"
              style={{ top: "22%", left: "50%", transform: "translateX(-50%)" }}
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                rotate: phase === "shaking" ? [0, -25, 25, -25, 25, 0] : 0,
              }}
              transition={
                phase === "shaking"
                  ? { rotate: { duration: 0.7, repeat: Infinity, repeatDelay: 0.4 } }
                  : { type: "spring", stiffness: 300, damping: 15 }
              }
            >
              <PokeballSVG color={ballData.color} size={56} />
              {/* Shake progress dots */}
              <div className="flex gap-2 mt-3">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      backgroundColor: i < shakeCount ? ballData.color : "rgba(255,255,255,0.15)",
                      boxShadow: i < shakeCount ? `0 0 8px ${ballData.color}` : "none",
                    }}
                    animate={i < shakeCount ? { scale: [1, 1.5, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ball in flight (thrown towards pokemon in arc) */}
        {ballFlight && ballData && (() => {
          const pos = getBallFlightPos();
          return (
            <div
              className="absolute z-40 pointer-events-none"
              style={{
                left: pos.x - 28 * pos.scale,
                top: pos.y - 28 * pos.scale,
                transform: `scale(${pos.scale}) rotate(${ballFlight.progress * 360}deg)`,
                opacity: pos.opacity,
                transition: "none",
              }}
            >
              <PokeballSVG color={ballData.color} size={56} />
            </div>
          );
        })()}

        {/* Throwable pokeball at bottom (when ready) */}
        <AnimatePresence>
          {phase === "ready" && ballData && !ballFlight && (
            <motion.div
              className="absolute z-40 flex flex-col items-center"
              style={{
                bottom: "10%",
                left: "50%",
                transform: `translate(calc(-50% + ${dragOffset.x}px), ${dragOffset.y}px)`,
              }}
              initial={{ y: 40, opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1,
                scale: isDragging ? 1.2 : 1,
              }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <PokeballSVG color={ballData.color} size={64} />
              {!isDragging && (
                <motion.p
                  className="text-[10px] text-muted-foreground text-center mt-2 whitespace-nowrap"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  Arraste para cima para lancar
                </motion.p>
              )}
              {isDragging && dragOffset.y < -20 && (
                <motion.div
                  className="absolute -top-16 left-1/2 -translate-x-1/2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
                    <path d="M12 19V5M5 12l7-7 7 7" />
                  </svg>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Flee warning indicator */}
        {phase === "ready" && (
          <motion.div
            className="absolute top-3 right-3 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card/80 backdrop-blur-sm border border-border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <motion.div
              className="w-2 h-2 rounded-full bg-amber-400"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
            <span className="text-[10px] text-amber-400 font-medium">Pode fugir</span>
          </motion.div>
        )}

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
                        <PokeballSVG color={bd.color} size={44} />
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
          {(phase === "escaped" || phase === "captured" || phase === "fled") && (
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
              {/* D20 Roll result (not on fled) */}
              {lastRoll && phase !== "fled" && (
                <motion.div
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-border bg-secondary/80 backdrop-blur-sm"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg text-white shrink-0"
                    style={{
                      backgroundColor:
                        lastRoll.d20 === 20 ? "#22C55E" : lastRoll.d20 === 1 ? "#EF4444" : lastRoll.total >= lastRoll.dc ? "#22C55E" : "#EF4444",
                      boxShadow: `0 0 12px ${
                        lastRoll.d20 === 20 || lastRoll.total >= lastRoll.dc ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)"
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
                <Button
                  onClick={() => onCaptured(pokemon, ballsUsed)}
                  className="w-full max-w-xs font-bold text-sm"
                  style={{ backgroundColor: mainColor, color: "#fff" }}
                >
                  Adicionar a Equipe
                </Button>
              ) : phase === "fled" ? (
                <div className="flex flex-col items-center gap-3">
                  <motion.div
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-amber-500/30 bg-amber-500/10"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                  >
                    <motion.span
                      className="text-xl"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: 2, duration: 0.3 }}
                    >
                      {'💨'}
                    </motion.span>
                    <span className="text-sm font-medium text-amber-400">{message}</span>
                  </motion.div>
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="w-full max-w-xs border-border text-foreground"
                  >
                    Voltar
                  </Button>
                </div>
              ) : (
                <>
                  <p className="text-sm font-medium text-destructive">{message}</p>
                  {availableBalls.length > 0 && !message.includes("Sem Pokebolas") ? (
                    <div className="flex gap-3 w-full max-w-xs">
                      <Button
                        onClick={handleRetry}
                        className="flex-1 font-bold text-sm"
                        style={{ backgroundColor: mainColor, color: "#fff" }}
                      >
                        Tentar Novamente
                      </Button>
                      <Button onClick={onClose} variant="outline" className="border-border text-foreground">
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

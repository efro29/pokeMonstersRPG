"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Star } from "lucide-react";

// ============================================
// SOM DE MOEDA DO MARIO - Toca para cada estrela
// ============================================
function playMarioCoinSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    
    const audioContext = new AudioContextClass();
    const masterGain = audioContext.createGain();
    masterGain.connect(audioContext.destination);
    masterGain.gain.setValueAtTime(0.12, audioContext.currentTime);
    
    // B5 (987.77 Hz) -> E6 (1318.51 Hz) - o classico do Mario
    const osc1 = audioContext.createOscillator();
    const gain1 = audioContext.createGain();
    osc1.connect(gain1);
    gain1.connect(masterGain);
    osc1.frequency.setValueAtTime(987.77, audioContext.currentTime);
    osc1.type = "square";
    gain1.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.08);
    osc1.start(audioContext.currentTime);
    osc1.stop(audioContext.currentTime + 0.08);
    
    const osc2 = audioContext.createOscillator();
    const gain2 = audioContext.createGain();
    osc2.connect(gain2);
    gain2.connect(masterGain);
    osc2.frequency.setValueAtTime(1318.51, audioContext.currentTime + 0.08);
    osc2.type = "square";
    gain2.gain.setValueAtTime(0, audioContext.currentTime);
    gain2.gain.setValueAtTime(0.3, audioContext.currentTime + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.25);
    osc2.start(audioContext.currentTime + 0.08);
    osc2.stop(audioContext.currentTime + 0.25);
    
    setTimeout(() => audioContext.close(), 300);
  } catch {
    // Audio not supported
  }
}

// ============================================
// STAR DUST COUNTER
// ============================================
interface StarDustCounterProps {
  value: number;
  previousValue: number;
  className?: string;
}

export function StarDustCounter({ value, previousValue, className = "" }: StarDustCounterProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (value === previousValue) {
      setDisplayValue(value);
      return;
    }

    setFlash(true);
    setTimeout(() => setFlash(false), 500);

    const diff = value - previousValue;
    const steps = Math.min(Math.abs(diff), 20);
    const stepValue = diff / steps;
    let current = previousValue;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      current += stepValue;
      setDisplayValue(Math.round(current));
      
      if (step >= steps) {
        clearInterval(interval);
        setDisplayValue(value);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [value, previousValue]);

  return (
    <span 
      className={`${className} transition-all duration-200`}
      style={{
        transform: flash ? "scale(1.3)" : "scale(1)",
        color: flash ? "#fde047" : undefined,
        textShadow: flash ? "0 0 10px rgba(253,224,71,0.8)" : undefined,
      }}
    >
      {displayValue.toLocaleString("pt-BR")}
    </span>
  );
}

// ============================================
// FULLSCREEN STAR DUST ANIMATION
// ============================================
interface StarDustFullscreenAnimationProps {
  amount: number;
  isActive: boolean;
  type: "gain" | "spend";
  onComplete: () => void;
}

interface StarData {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  progress: number;
  arrived: boolean;
}

export function StarDustFullscreenAnimation({ 
  amount, 
  isActive, 
  type,
  onComplete 
}: StarDustFullscreenAnimationProps) {
  const [phase, setPhase] = useState<"idle" | "showNumber" | "flyStars">("idle");
  const [stars, setStars] = useState<StarData[]>([]);
  const [currentStarIndex, setCurrentStarIndex] = useState(0);
  const [arrivedCount, setArrivedCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Reset when deactivated
  useEffect(() => {
    if (!isActive) {
      setPhase("idle");
      setStars([]);
      setCurrentStarIndex(0);
      setArrivedCount(0);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  }, [isActive]);

  // Start animation when activated
  useEffect(() => {
    if (!isActive || !mounted || amount <= 0) return;

    // Phase 1: Show the number
    setPhase("showNumber");

    // After 1.5s, start flying stars
    const timer = setTimeout(() => {
      // Get target position
      const targetEl = document.getElementById("stardust-counter-target");
      const rect = targetEl?.getBoundingClientRect();
      const targetX = rect ? rect.left + rect.width / 2 : window.innerWidth - 60;
      const targetY = rect ? rect.top + rect.height / 2 : 40;

      // Create stars - 1 star per 50 stardust, max 60, min 8
      const numStars = Math.min(60, Math.max(8, Math.ceil(amount / 50)));
      
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const newStars: StarData[] = [];
      for (let i = 0; i < numStars; i++) {
        // Slight random offset from center
        const offsetX = (Math.random() - 0.5) * 60;
        const offsetY = (Math.random() - 0.5) * 60;
        
        newStars.push({
          id: i,
          x: centerX + offsetX,
          y: centerY + offsetY,
          targetX: targetX + (Math.random() - 0.5) * 20,
          targetY: targetY + (Math.random() - 0.5) * 10,
          progress: 0,
          arrived: false,
        });
      }

      setStars(newStars);
      setCurrentStarIndex(0);
      setArrivedCount(0);
      setPhase("flyStars");
      lastTimeRef.current = performance.now();
    }, 1500);

    return () => clearTimeout(timer);
  }, [isActive, mounted, amount]);

  // Animation loop for flying stars
  useEffect(() => {
    if (phase !== "flyStars" || stars.length === 0) return;

    const STAR_LAUNCH_INTERVAL = 60; // ms between each star launch
    const FLIGHT_DURATION = 400; // ms for each star to reach target
    let lastLaunchTime = 0;

    const animate = (time: number) => {
      const deltaTime = time - lastTimeRef.current;
      lastTimeRef.current = time;

      // Launch new stars
      if (time - lastLaunchTime > STAR_LAUNCH_INTERVAL && currentStarIndex < stars.length) {
        lastLaunchTime = time;
        setCurrentStarIndex(prev => prev + 1);
      }

      // Update star positions
      setStars(prevStars => {
        let newArrivedCount = 0;
        const updated = prevStars.map((star, index) => {
          if (index >= currentStarIndex) return star;
          if (star.arrived) {
            newArrivedCount++;
            return star;
          }

          const newProgress = Math.min(1, star.progress + deltaTime / FLIGHT_DURATION);
          
          // Ease out cubic
          const eased = 1 - Math.pow(1 - newProgress, 3);
          
          const newX = star.x + (star.targetX - star.x) * eased;
          const newY = star.y + (star.targetY - star.y) * eased;

          if (newProgress >= 1 && !star.arrived) {
            // Star arrived - play sound!
            playMarioCoinSound();
            newArrivedCount++;
            return { ...star, x: newX, y: newY, progress: 1, arrived: true };
          }

          return { ...star, x: newX, y: newY, progress: newProgress };
        });

        return updated;
      });

      // Check if all stars have arrived
      const totalArrived = stars.filter(s => s.arrived).length;
      setArrivedCount(totalArrived);

      if (totalArrived >= stars.length && currentStarIndex >= stars.length) {
        // All done!
        setTimeout(() => {
          onComplete();
        }, 300);
        return;
      }

      // Max 8 seconds
      if (time - (lastTimeRef.current - deltaTime) > 8000) {
        onComplete();
        return;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [phase, stars.length, currentStarIndex, onComplete]);

  // Recalculate arrived count from stars state
  useEffect(() => {
    const count = stars.filter(s => s.arrived).length;
    setArrivedCount(count);
  }, [stars]);

  if (!mounted || !isActive || phase === "idle") {
    return null;
  }

  const displayAmount = phase === "flyStars" 
    ? Math.round((arrivedCount / Math.max(1, stars.length)) * amount)
    : amount;

  const content = (
    <div className="fixed inset-0 z-[99999] pointer-events-none">
      {/* Dark overlay */}
      <div 
        className="absolute inset-0 bg-black/70 transition-opacity duration-300"
        style={{ opacity: phase === "showNumber" ? 1 : 0.5 }}
      />

      {/* Big number in center */}
      {phase === "showNumber" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center animate-in zoom-in-50 duration-500">
          <div 
            className="text-7xl font-bold"
            style={{ 
              color: type === "gain" ? "#fde047" : "#f87171",
              textShadow: `0 0 60px ${type === "gain" ? "rgba(253,224,71,0.9)" : "rgba(248,113,113,0.9)"}`,
            }}
          >
            {type === "gain" ? "+" : "-"}{amount.toLocaleString("pt-BR")}
          </div>
          <div className="flex items-center gap-3 mt-4 text-2xl text-blue-300">
            <Star className="w-8 h-8" fill="currentColor" />
            <span>Star Dust</span>
          </div>
        </div>
      )}

      {/* Flying stars */}
      {phase === "flyStars" && (
        <>
          {/* Counter in center showing progress */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="text-4xl font-bold tabular-nums"
              style={{ 
                color: "#fde047",
                textShadow: "0 0 30px rgba(253,224,71,0.8)",
              }}
            >
              {displayAmount.toLocaleString("pt-BR")}
            </div>
          </div>

          {/* Render active stars */}
          {stars.slice(0, currentStarIndex).map((star) => (
            <div
              key={star.id}
              className="absolute pointer-events-none"
              style={{
                left: star.x,
                top: star.y,
                transform: "translate(-50%, -50%)",
                opacity: star.arrived ? 0 : 1,
                transition: "opacity 0.1s",
              }}
            >
              <Star 
                className="w-6 h-6 text-yellow-400" 
                fill="currentColor"
                style={{
                  filter: "drop-shadow(0 0 8px rgba(250,204,21,0.9)) drop-shadow(0 0 4px rgba(255,255,255,0.5))",
                }}
              />
            </div>
          ))}

          {/* Impact flash at target */}
          {arrivedCount > 0 && (
            <div
              className="absolute w-12 h-12 rounded-full animate-ping"
              style={{
                left: stars[0]?.targetX ?? 0,
                top: stars[0]?.targetY ?? 0,
                transform: "translate(-50%, -50%)",
                background: "radial-gradient(circle, rgba(253,224,71,0.6) 0%, transparent 70%)",
              }}
            />
          )}
        </>
      )}
    </div>
  );

  return createPortal(content, document.body);
}

// ============================================
// POKEMON POWER UP
// ============================================
export function PokemonPowerUp({ isActive, xpGained }: { isActive: boolean; xpGained: number }) {
  if (!isActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
      <div 
        className="absolute inset-0 animate-pulse rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(34,197,94,0.5) 0%, transparent 70%)",
        }}
      />
      <div 
        className="absolute -top-6 left-1/2 -translate-x-1/2 text-lg font-bold text-emerald-400 animate-bounce"
        style={{ textShadow: "0 0 10px rgba(34,197,94,0.8)" }}
      >
        +{xpGained} XP
      </div>
    </div>
  );
}

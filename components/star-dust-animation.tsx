"use client";

import React, { useEffect, useState, useRef, createContext, useContext, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ═══════════════════════════════════════════════════════════════════════════════
// STAR DUST ANIMATION CONTEXT - Sistema centralizado de animações
// ═══════════════════════════════════════════════════════════════════════════════

interface StarDustAnimationEvent {
  id: string;
  amount: number;
  type: "gain" | "spend";
  sourcePosition?: { x: number; y: number };
  targetPosition?: { x: number; y: number };
}

interface StarDustAnimationContextType {
  triggerGainAnimation: (amount: number, sourcePosition?: { x: number; y: number }) => void;
  triggerSpendAnimation: (amount: number, targetPosition?: { x: number; y: number }) => void;
  setCounterRef: (ref: HTMLElement | null) => void;
  setPokemonRef: (ref: HTMLElement | null) => void;
}

const StarDustAnimationContext = createContext<StarDustAnimationContextType | null>(null);

export function useStarDustAnimation() {
  const context = useContext(StarDustAnimationContext);
  if (!context) {
    throw new Error("useStarDustAnimation must be used within StarDustAnimationProvider");
  }
  return context;
}

// ═══════════════════════════════════════════════════════════════════════════════
// STAR DUST ANIMATION PROVIDER - Provedor global
// ═══════════════════════════════════════════════════════════════════════════════

interface StarDustAnimationProviderProps {
  children: React.ReactNode;
}

export function StarDustAnimationProvider({ children }: StarDustAnimationProviderProps) {
  const [events, setEvents] = useState<StarDustAnimationEvent[]>([]);
  const counterRef = useRef<HTMLElement | null>(null);
  const pokemonRef = useRef<HTMLElement | null>(null);

  const setCounterRef = useCallback((ref: HTMLElement | null) => {
    counterRef.current = ref;
  }, []);

  const setPokemonRef = useCallback((ref: HTMLElement | null) => {
    pokemonRef.current = ref;
  }, []);

  const triggerGainAnimation = useCallback((amount: number, sourcePosition?: { x: number; y: number }) => {
    const targetPos = counterRef.current?.getBoundingClientRect();
    const event: StarDustAnimationEvent = {
      id: `gain-${Date.now()}-${Math.random()}`,
      amount,
      type: "gain",
      sourcePosition: sourcePosition ?? { x: window.innerWidth / 2, y: window.innerHeight / 2 },
      targetPosition: targetPos 
        ? { x: targetPos.left + targetPos.width / 2, y: targetPos.top + targetPos.height / 2 }
        : { x: window.innerWidth - 80, y: 50 },
    };
    setEvents(prev => [...prev, event]);
  }, []);

  const triggerSpendAnimation = useCallback((amount: number, targetPosition?: { x: number; y: number }) => {
    const sourcePos = counterRef.current?.getBoundingClientRect();
    const targetPos = pokemonRef.current?.getBoundingClientRect() ?? targetPosition;
    const event: StarDustAnimationEvent = {
      id: `spend-${Date.now()}-${Math.random()}`,
      amount,
      type: "spend",
      sourcePosition: sourcePos 
        ? { x: sourcePos.left + sourcePos.width / 2, y: sourcePos.top + sourcePos.height / 2 }
        : { x: window.innerWidth - 80, y: 50 },
      targetPosition: targetPos 
        ? "x" in targetPos 
          ? targetPos 
          : { x: targetPos.left + targetPos.width / 2, y: targetPos.top + targetPos.height / 2 }
        : { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    };
    setEvents(prev => [...prev, event]);
  }, []);

  const removeEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  }, []);

  return (
    <StarDustAnimationContext.Provider value={{ triggerGainAnimation, triggerSpendAnimation, setCounterRef, setPokemonRef }}>
      {children}
      {/* Render all active animations */}
      <AnimatePresence>
        {events.map(event => (
          <StarDustParticleSystem
            key={event.id}
            event={event}
            onComplete={() => removeEvent(event.id)}
          />
        ))}
      </AnimatePresence>
    </StarDustAnimationContext.Provider>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STAR DUST PARTICLE SYSTEM - Sistema de partículas épico
// ═══════════════════════════════════════════════════════════════════════════════

interface StarParticle {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  delay: number;
  size: number;
  rotation: number;
  trail: boolean;
}

interface StarDustParticleSystemProps {
  event: StarDustAnimationEvent;
  onComplete: () => void;
}

function StarDustParticleSystem({ event, onComplete }: StarDustParticleSystemProps) {
  const [particles, setParticles] = useState<StarParticle[]>([]);
  const [showExplosion, setShowExplosion] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Calculate particle count based on amount (capped for performance)
    // Representacao proporcional: mais dust = mais particulas
    const baseCount = Math.floor(event.amount / 100);
    const particleCount = Math.min(50, Math.max(8, baseCount)); // 8-50 particulas
    
    const { sourcePosition, targetPosition } = event;
    if (!sourcePosition || !targetPosition) return;

    const isGain = event.type === "gain";
    const startPos = isGain ? sourcePosition : sourcePosition;
    const endPos = isGain ? targetPosition : targetPosition;

    // Create particles with varied properties
    const newParticles: StarParticle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const spreadRadius = 60 + Math.random() * 40;
      
      newParticles.push({
        id: i,
        startX: startPos.x + Math.cos(angle) * spreadRadius * Math.random(),
        startY: startPos.y + Math.sin(angle) * spreadRadius * Math.random(),
        endX: endPos.x + (Math.random() - 0.5) * 20,
        endY: endPos.y + (Math.random() - 0.5) * 20,
        delay: i * 0.02 + Math.random() * 0.1,
        size: 12 + Math.random() * 8,
        rotation: Math.random() * 360,
        trail: i % 3 === 0, // Every 3rd particle has a trail
      });
    }

    setParticles(newParticles);

    // Play sound effect
    try {
      // Web Audio API for sound
      const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(isGain ? 800 : 400, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(isGain ? 1200 : 200, audioContext.currentTime + 0.3);
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.type = "sine";
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch {
      // Audio not supported, continue silently
    }

    // Hide explosion after initial burst
    setTimeout(() => setShowExplosion(false), 400);

    // Complete animation
    const timeout = setTimeout(() => {
      onComplete();
    }, 1500);

    return () => clearTimeout(timeout);
  }, [event, onComplete]);

  const isGain = event.type === "gain";

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {/* Initial explosion effect */}
      <AnimatePresence>
        {showExplosion && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 2, 2.5], opacity: [0, 0.8, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute"
            style={{
              left: event.sourcePosition?.x ?? 0,
              top: event.sourcePosition?.y ?? 0,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div 
              className="w-20 h-20 rounded-full"
              style={{
                background: isGain 
                  ? "radial-gradient(circle, rgba(147,197,253,0.8) 0%, rgba(96,165,250,0.4) 50%, transparent 70%)"
                  : "radial-gradient(circle, rgba(252,211,77,0.8) 0%, rgba(251,191,36,0.4) 50%, transparent 70%)",
                boxShadow: isGain
                  ? "0 0 40px rgba(147,197,253,0.6), 0 0 80px rgba(96,165,250,0.4)"
                  : "0 0 40px rgba(252,211,77,0.6), 0 0 80px rgba(251,191,36,0.4)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Star particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            x: particle.startX,
            y: particle.startY,
            scale: 0,
            opacity: 0,
            rotate: particle.rotation,
          }}
          animate={{
            x: particle.endX,
            y: particle.endY,
            scale: [0, 1.5, 1.2, 0.8, 0],
            opacity: [0, 1, 1, 0.8, 0],
            rotate: particle.rotation + (isGain ? 180 : -180),
          }}
          transition={{
            duration: 0.8 + Math.random() * 0.3,
            delay: particle.delay,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="absolute"
          style={{ 
            transform: "translate(-50%, -50%)",
            filter: `drop-shadow(0 0 ${particle.size / 2}px ${isGain ? "rgba(147,197,253,0.9)" : "rgba(252,211,77,0.9)"})`,
          }}
        >
          {/* Star with glow */}
          <svg
            width={particle.size}
            height={particle.size}
            viewBox="0 0 24 24"
            fill="none"
          >
            <defs>
              <filter id={`glow-${particle.id}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <linearGradient id={`starGradient-${particle.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isGain ? "#93C5FD" : "#FCD34D"} />
                <stop offset="50%" stopColor={isGain ? "#60A5FA" : "#FBBF24"} />
                <stop offset="100%" stopColor={isGain ? "#3B82F6" : "#F59E0B"} />
              </linearGradient>
            </defs>
            <path
              d="M12 2L14.09 8.26L20 9.27L15.5 13.14L16.82 19.02L12 16.24L7.18 19.02L8.5 13.14L4 9.27L9.91 8.26L12 2Z"
              fill={`url(#starGradient-${particle.id})`}
              filter={`url(#glow-${particle.id})`}
            />
          </svg>
          
          {/* Trail effect for some particles */}
          {particle.trail && (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0.8, scale: 1 }}
              animate={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3, delay: particle.delay }}
              style={{
                background: isGain
                  ? "radial-gradient(circle, rgba(147,197,253,0.6) 0%, transparent 70%)"
                  : "radial-gradient(circle, rgba(252,211,77,0.6) 0%, transparent 70%)",
              }}
            />
          )}
        </motion.div>
      ))}

      {/* Impact effect at target */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.5, 0], opacity: [0, 0.8, 0] }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="absolute"
        style={{
          left: event.targetPosition?.x ?? 0,
          top: event.targetPosition?.y ?? 0,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div 
          className="w-16 h-16 rounded-full"
          style={{
            background: isGain
              ? "radial-gradient(circle, rgba(147,197,253,0.9) 0%, rgba(96,165,250,0.5) 40%, transparent 70%)"
              : "radial-gradient(circle, rgba(252,211,77,0.9) 0%, rgba(251,191,36,0.5) 40%, transparent 70%)",
            boxShadow: isGain
              ? "0 0 30px rgba(147,197,253,0.8), 0 0 60px rgba(96,165,250,0.5)"
              : "0 0 30px rgba(252,211,77,0.8), 0 0 60px rgba(251,191,36,0.5)",
          }}
        />
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STAR DUST COUNTER - Contador animado
// ═══════════════════════════════════════════════════════════════════════════════

interface StarDustCounterProps {
  value: number;
  previousValue: number;
  className?: string;
  onRef?: (ref: HTMLSpanElement | null) => void;
}

export function StarDustCounter({ value, previousValue, className = "", onRef }: StarDustCounterProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayValue, setDisplayValue] = useState(value);
  const [animationType, setAnimationType] = useState<"gain" | "spend" | null>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (onRef && spanRef.current) {
      onRef(spanRef.current);
    }
  }, [onRef]);

  useEffect(() => {
    const diff = value - previousValue;
    if (diff === 0) {
      setDisplayValue(value);
      return;
    }

    setIsAnimating(true);
    setAnimationType(diff > 0 ? "gain" : "spend");
    
    // Animate counting
    const absDiff = Math.abs(diff);
    const steps = Math.min(30, Math.max(10, Math.floor(absDiff / 50)));
    const stepValue = diff / steps;
    let currentStep = 0;
    
    const interval = setInterval(() => {
      currentStep++;
      setDisplayValue(Math.floor(previousValue + stepValue * currentStep));
      
      if (currentStep >= steps) {
        clearInterval(interval);
        setDisplayValue(value);
        setTimeout(() => {
          setIsAnimating(false);
          setAnimationType(null);
        }, 400);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [value, previousValue]);

  return (
    <motion.span
      ref={spanRef}
      className={className}
      animate={isAnimating ? {
        scale: animationType === "gain" ? [1, 1.3, 1] : [1, 0.85, 1],
        textShadow: animationType === "gain"
          ? [
              "0 0 0px rgba(147, 197, 253, 0)",
              "0 0 20px rgba(147, 197, 253, 1)",
              "0 0 8px rgba(147, 197, 253, 0.6)",
            ]
          : [
              "0 0 0px rgba(252, 211, 77, 0)",
              "0 0 20px rgba(252, 211, 77, 1)",
              "0 0 8px rgba(252, 211, 77, 0.6)",
            ],
      } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {displayValue.toLocaleString("pt-BR")}
    </motion.span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LEGACY ANIMATION COMPONENT - Para compatibilidade
// ═══════════════════════════════════════════════════════════════════════════════

interface StarDustAnimationProps {
  amount: number;
  isActive: boolean;
  onComplete?: () => void;
  targetRef?: React.RefObject<HTMLElement | null>;
}

export function StarDustAnimation({ 
  amount, 
  isActive, 
  onComplete, 
  targetRef 
}: StarDustAnimationProps) {
  const [event, setEvent] = useState<StarDustAnimationEvent | null>(null);

  useEffect(() => {
    if (!isActive) {
      setEvent(null);
      return;
    }

    const targetPos = targetRef?.current?.getBoundingClientRect();
    setEvent({
      id: `legacy-${Date.now()}`,
      amount,
      type: "gain",
      sourcePosition: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
      targetPosition: targetPos 
        ? { x: targetPos.left + targetPos.width / 2, y: targetPos.top + targetPos.height / 2 }
        : { x: window.innerWidth - 80, y: 50 },
    });
  }, [isActive, amount, targetRef]);

  if (!event) return null;

  return (
    <StarDustParticleSystem
      event={event}
      onComplete={() => {
        setEvent(null);
        onComplete?.();
      }}
    />
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// POKEMON POWER UP ANIMATION - Efeito de absorção no Pokemon
// ═══════════════════════════════════════════════════════════════════════════════

interface PokemonPowerUpProps {
  isActive: boolean;
  xpGained: number;
}

export function PokemonPowerUp({ isActive, xpGained }: PokemonPowerUpProps) {
  if (!isActive) return null;

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-lg"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: [0, 0.8, 0.4, 0],
          scale: [0.8, 1.1, 1.05, 1],
        }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{
          background: "radial-gradient(circle, rgba(34,197,94,0.4) 0%, rgba(16,185,129,0.2) 50%, transparent 70%)",
          boxShadow: "0 0 40px rgba(34,197,94,0.6), inset 0 0 30px rgba(16,185,129,0.3)",
        }}
      />
      
      {/* Rising particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-emerald-400"
          initial={{
            x: "50%",
            y: "100%",
            opacity: 0,
            scale: 0,
          }}
          animate={{
            x: `${30 + Math.random() * 40}%`,
            y: "-20%",
            opacity: [0, 1, 0],
            scale: [0, 1, 0.5],
          }}
          transition={{
            duration: 1 + Math.random() * 0.5,
            delay: i * 0.1,
            ease: "easeOut",
          }}
          style={{
            filter: "blur(1px)",
            boxShadow: "0 0 10px rgba(34,197,94,0.8)",
          }}
        />
      ))}
      
      {/* XP text */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 0.5, y: 0 }}
        animate={{ 
          opacity: [0, 1, 1, 0],
          scale: [0.5, 1.2, 1, 0.8],
          y: [0, -30, -40, -50],
        }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <span 
          className="text-2xl font-bold text-emerald-400"
          style={{ textShadow: "0 0 20px rgba(34,197,94,0.8)" }}
        >
          +{xpGained} XP
        </span>
      </motion.div>
    </motion.div>
  );
}

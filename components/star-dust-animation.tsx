"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════════
// MARIO COIN SOUND - Som classico de moeda do Mario
// ═══════════════════════════════════════════════════════════════════════════════

function playMarioCoinSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    
    const audioContext = new AudioContextClass();
    const masterGain = audioContext.createGain();
    masterGain.connect(audioContext.destination);
    masterGain.gain.setValueAtTime(0.15, audioContext.currentTime);
    
    // Nota 1: B5 (987.77 Hz)
    const osc1 = audioContext.createOscillator();
    const gain1 = audioContext.createGain();
    osc1.connect(gain1);
    gain1.connect(masterGain);
    osc1.frequency.setValueAtTime(987.77, audioContext.currentTime);
    osc1.type = "square";
    gain1.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    osc1.start(audioContext.currentTime);
    osc1.stop(audioContext.currentTime + 0.1);
    
    // Nota 2: E6 (1318.51 Hz) - a nota alta classica
    const osc2 = audioContext.createOscillator();
    const gain2 = audioContext.createGain();
    osc2.connect(gain2);
    gain2.connect(masterGain);
    osc2.frequency.setValueAtTime(1318.51, audioContext.currentTime + 0.1);
    osc2.type = "square";
    gain2.gain.setValueAtTime(0, audioContext.currentTime);
    gain2.gain.setValueAtTime(0.3, audioContext.currentTime + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
    osc2.start(audioContext.currentTime + 0.1);
    osc2.stop(audioContext.currentTime + 0.4);
    
    // Cleanup
    setTimeout(() => audioContext.close(), 500);
  } catch {
    // Audio not supported
  }
}

// Som para cada estrela chegando (mais curto)
function playStarHitSound(pitch: number = 1) {
  try {
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    
    const audioContext = new AudioContextClass();
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    // Som tipo "pling" de moeda
    const baseFreq = 1200 * pitch;
    osc.frequency.setValueAtTime(baseFreq, audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, audioContext.currentTime + 0.05);
    osc.type = "sine";
    
    gain.gain.setValueAtTime(0.08, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.15);
    
    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + 0.15);
    
    setTimeout(() => audioContext.close(), 200);
  } catch {
    // Audio not supported
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// STAR DUST FULLSCREEN ANIMATION - Animacao fullscreen epica
// ═══════════════════════════════════════════════════════════════════════════════

interface StarDustFullscreenAnimationProps {
  amount: number;
  isActive: boolean;
  type: "gain" | "spend";
  onComplete?: () => void;
}

interface StarParticle {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  delay: number;
  size: number;
  duration: number;
}

export function StarDustFullscreenAnimation({ 
  amount, 
  isActive, 
  type,
  onComplete 
}: StarDustFullscreenAnimationProps) {
  const [particles, setParticles] = useState<StarParticle[]>([]);
  const [showCounter, setShowCounter] = useState(false);
  const [displayAmount, setDisplayAmount] = useState(0);
  const particlesArrivedRef = useRef(0);
  const totalParticlesRef = useRef(0);

  console.log("[v0] StarDustFullscreenAnimation - isActive:", isActive, "amount:", amount, "type:", type);

  useEffect(() => {
    if (!isActive) {
      setParticles([]);
      setShowCounter(false);
      setDisplayAmount(0);
      particlesArrivedRef.current = 0;
      return;
    }

    console.log("[v0] StarDustFullscreenAnimation useEffect triggered - creating particles");
    
    // Som inicial do Mario
    playMarioCoinSound();

    // Criar particulas - maximo 30 para performance, minimo 5
    const particleCount = Math.min(30, Math.max(5, Math.floor(amount / 200)));
    totalParticlesRef.current = particleCount;
    particlesArrivedRef.current = 0;

    const isGain = type === "gain";
    
    // Posicao central do alvo (contador no topo direito para gain, centro para spend)
    const targetX = isGain ? window.innerWidth - 100 : window.innerWidth / 2;
    const targetY = isGain ? 60 : window.innerHeight / 2;
    
    // Criar particulas com posicoes aleatorias
    const newParticles: StarParticle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 150 + Math.random() * 100;
      
      // Spawn em circulo ao redor do centro
      const spawnX = window.innerWidth / 2 + Math.cos(angle) * radius;
      const spawnY = window.innerHeight / 2 + Math.sin(angle) * radius;
      
      newParticles.push({
        id: i,
        startX: isGain ? spawnX : targetX + (Math.random() - 0.5) * 40,
        startY: isGain ? spawnY : targetY + (Math.random() - 0.5) * 40,
        endX: isGain ? targetX + (Math.random() - 0.5) * 30 : spawnX,
        endY: isGain ? targetY + (Math.random() - 0.5) * 20 : spawnY,
        delay: i * 0.08, // Escalonado para efeito cascata
        size: 20 + Math.random() * 12,
        duration: 0.6 + Math.random() * 0.3,
      });
    }

    setParticles(newParticles);
    setShowCounter(true);

    // Animar o contador incrementando
    const amountPerParticle = Math.floor(amount / particleCount);
    let currentAmount = 0;
    const counterInterval = setInterval(() => {
      if (currentAmount < amount) {
        currentAmount = Math.min(amount, currentAmount + amountPerParticle);
        setDisplayAmount(currentAmount);
      }
    }, 80);

    // Finalizar animacao apos todas as estrelas chegarem (max 8 segundos)
    const totalDuration = Math.min(8000, (particleCount * 80) + 1500);
    const timeout = setTimeout(() => {
      clearInterval(counterInterval);
      setDisplayAmount(amount);
      setTimeout(() => {
        onComplete?.();
      }, 500);
    }, totalDuration);

    return () => {
      clearTimeout(timeout);
      clearInterval(counterInterval);
    };
  }, [isActive, amount, type, onComplete]);

  const handleParticleArrived = () => {
    particlesArrivedRef.current++;
    // Som de cada estrela chegando com pitch variavel
    const pitch = 0.8 + (particlesArrivedRef.current / totalParticlesRef.current) * 0.6;
    playStarHitSound(pitch);
  };

  if (!isActive || particles.length === 0) return null;

  const isGain = type === "gain";

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      {/* Fundo escurecido com blur */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Flash inicial */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.4, 0] }}
        transition={{ duration: 0.4 }}
        style={{
          background: isGain
            ? "radial-gradient(circle at center, rgba(96,165,250,0.4) 0%, transparent 70%)"
            : "radial-gradient(circle at center, rgba(251,191,36,0.4) 0%, transparent 70%)",
        }}
      />

      {/* Contador central grande */}
      <AnimatePresence>
        {showCounter && (
          <motion.div
            className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0, y: -50 }}
            transition={{ type: "spring", damping: 15 }}
          >
            <motion.div
              className="flex items-center gap-3"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <Star 
                className="w-12 h-12" 
                style={{ 
                  color: isGain ? "#60A5FA" : "#FBBF24",
                  filter: `drop-shadow(0 0 20px ${isGain ? "rgba(96,165,250,0.8)" : "rgba(251,191,36,0.8)"})`,
                }}
                fill={isGain ? "#60A5FA" : "#FBBF24"}
              />
              <span 
                className="text-5xl font-bold tabular-nums"
                style={{ 
                  color: isGain ? "#93C5FD" : "#FCD34D",
                  textShadow: `0 0 30px ${isGain ? "rgba(147,197,253,0.8)" : "rgba(252,211,77,0.8)"}`,
                }}
              >
                {isGain ? "+" : "-"}{displayAmount.toLocaleString("pt-BR")}
              </span>
            </motion.div>
            <span className="text-lg text-white/80 font-medium">
              Star Dust
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Particulas de estrela */}
      {particles.map((particle) => (
        <StarParticleComponent
          key={particle.id}
          particle={particle}
          isGain={isGain}
          onArrived={handleParticleArrived}
        />
      ))}

      {/* Efeito de impacto no alvo */}
      <motion.div
        className="absolute"
        style={{
          left: isGain ? window.innerWidth - 100 : window.innerWidth / 2,
          top: isGain ? 60 : window.innerHeight / 2,
          transform: "translate(-50%, -50%)",
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: [0, 1.5, 2, 0],
          opacity: [0, 0.8, 0.6, 0],
        }}
        transition={{ 
          duration: 2,
          delay: particles.length * 0.08 + 0.3,
          ease: "easeOut",
        }}
      >
        <div 
          className="w-24 h-24 rounded-full"
          style={{
            background: isGain
              ? "radial-gradient(circle, rgba(147,197,253,0.9) 0%, rgba(96,165,250,0.5) 40%, transparent 70%)"
              : "radial-gradient(circle, rgba(252,211,77,0.9) 0%, rgba(251,191,36,0.5) 40%, transparent 70%)",
          }}
        />
      </motion.div>
    </div>
  );
}

// Componente individual de particula
function StarParticleComponent({ 
  particle, 
  isGain,
  onArrived,
}: { 
  particle: StarParticle; 
  isGain: boolean;
  onArrived: () => void;
}) {
  const hasArrivedRef = useRef(false);

  return (
    <motion.div
      className="absolute"
      style={{ 
        left: 0,
        top: 0,
        width: particle.size,
        height: particle.size,
      }}
      initial={{
        x: particle.startX - particle.size / 2,
        y: particle.startY - particle.size / 2,
        scale: 0,
        opacity: 0,
        rotate: 0,
      }}
      animate={{
        x: particle.endX - particle.size / 2,
        y: particle.endY - particle.size / 2,
        scale: [0, 1.3, 1, 0.8, 0],
        opacity: [0, 1, 1, 0.8, 0],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: particle.duration,
        delay: particle.delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      onAnimationComplete={() => {
        if (!hasArrivedRef.current) {
          hasArrivedRef.current = true;
          onArrived();
        }
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        style={{
          filter: `drop-shadow(0 0 ${particle.size / 3}px ${isGain ? "rgba(147,197,253,1)" : "rgba(252,211,77,1)"})`,
        }}
      >
        <defs>
          <linearGradient id={`starGrad-${particle.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isGain ? "#BFDBFE" : "#FEF3C7"} />
            <stop offset="50%" stopColor={isGain ? "#60A5FA" : "#FBBF24"} />
            <stop offset="100%" stopColor={isGain ? "#3B82F6" : "#F59E0B"} />
          </linearGradient>
        </defs>
        <path
          d="M12 2L14.09 8.26L20 9.27L15.5 13.14L16.82 19.02L12 16.24L7.18 19.02L8.5 13.14L4 9.27L9.91 8.26L12 2Z"
          fill={`url(#starGrad-${particle.id})`}
        />
      </svg>
      
      {/* Trail/rastro */}
      <motion.div
        className="absolute inset-0 rounded-full"
        initial={{ opacity: 0.6, scale: 1 }}
        animate={{ opacity: 0, scale: 2 }}
        transition={{ duration: 0.3, delay: particle.delay }}
        style={{
          background: isGain
            ? "radial-gradient(circle, rgba(147,197,253,0.5) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(252,211,77,0.5) 0%, transparent 70%)",
        }}
      />
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STAR DUST COUNTER - Contador animado simples
// ═══════════════════════════════════════════════════════════════════════════════

interface StarDustCounterProps {
  value: number;
  previousValue: number;
  className?: string;
}

export function StarDustCounter({ value, previousValue, className = "" }: StarDustCounterProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayValue, setDisplayValue] = useState(value);
  const [animationType, setAnimationType] = useState<"gain" | "spend" | null>(null);

  useEffect(() => {
    const diff = value - previousValue;
    if (diff === 0) {
      setDisplayValue(value);
      return;
    }

    setIsAnimating(true);
    setAnimationType(diff > 0 ? "gain" : "spend");
    
    // Animar contagem
    const steps = 15;
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
        }, 300);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [value, previousValue]);

  return (
    <motion.span
      className={className}
      animate={isAnimating ? {
        scale: animationType === "gain" ? [1, 1.2, 1] : [1, 0.9, 1],
      } : {}}
      transition={{ duration: 0.4 }}
      style={{
        textShadow: isAnimating 
          ? animationType === "gain"
            ? "0 0 15px rgba(147, 197, 253, 0.8)"
            : "0 0 15px rgba(252, 211, 77, 0.8)"
          : "none",
      }}
    >
      {displayValue.toLocaleString("pt-BR")}
    </motion.span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LEGACY EXPORTS - Para compatibilidade
// ═══════════════════════════════════════════════════════════════════════════════

// Mantido para compatibilidade com codigo existente
export function StarDustAnimation({ 
  amount, 
  isActive, 
  onComplete,
}: {
  amount: number;
  isActive: boolean;
  onComplete?: () => void;
  targetRef?: React.RefObject<HTMLElement | null>;
}) {
  return (
    <StarDustFullscreenAnimation
      amount={amount}
      isActive={isActive}
      type="gain"
      onComplete={onComplete}
    />
  );
}

export function StarDustAnimationProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useStarDustAnimation() {
  return {
    triggerGainAnimation: () => {},
    triggerSpendAnimation: () => {},
    setCounterRef: () => {},
    setPokemonRef: () => {},
  };
}

export function PokemonPowerUp({ isActive, xpGained }: { isActive: boolean; xpGained: number }) {
  if (!isActive) return null;

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Glow verde */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0, 0.7, 0],
          scale: [0.8, 1.2, 1],
        }}
        transition={{ duration: 1 }}
        style={{
          background: "radial-gradient(circle, rgba(34,197,94,0.5) 0%, transparent 70%)",
          boxShadow: "0 0 60px rgba(34,197,94,0.6)",
        }}
      />
      
      {/* Texto XP */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: [0, 1, 1, 0],
          y: [20, -10, -20, -40],
        }}
        transition={{ duration: 1.5 }}
      >
        <span 
          className="text-xl font-bold text-emerald-400 whitespace-nowrap"
          style={{ textShadow: "0 0 15px rgba(34,197,94,0.8)" }}
        >
          +{xpGained} XP
        </span>
      </motion.div>
    </motion.div>
  );
}

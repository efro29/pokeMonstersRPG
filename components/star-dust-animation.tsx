"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Star } from "lucide-react";

// ============================================
// SOM DE MOEDA DO MARIO
// ============================================
function playMarioCoinSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    
    const audioContext = new AudioContextClass();
    const masterGain = audioContext.createGain();
    masterGain.connect(audioContext.destination);
    masterGain.gain.setValueAtTime(0.12, audioContext.currentTime);
    
    // B5 -> E6 - classico do Mario
    const osc1 = audioContext.createOscillator();
    const gain1 = audioContext.createGain();
    osc1.connect(gain1);
    gain1.connect(masterGain);
    osc1.frequency.setValueAtTime(987.77, audioContext.currentTime);
    osc1.type = "square";
    gain1.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.06);
    osc1.start(audioContext.currentTime);
    osc1.stop(audioContext.currentTime + 0.06);
    
    const osc2 = audioContext.createOscillator();
    const gain2 = audioContext.createGain();
    osc2.connect(gain2);
    gain2.connect(masterGain);
    osc2.frequency.setValueAtTime(1318.51, audioContext.currentTime + 0.06);
    osc2.type = "square";
    gain2.gain.setValueAtTime(0, audioContext.currentTime);
    gain2.gain.setValueAtTime(0.3, audioContext.currentTime + 0.06);
    gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.18);
    osc2.start(audioContext.currentTime + 0.06);
    osc2.stop(audioContext.currentTime + 0.18);
    
    setTimeout(() => audioContext.close(), 250);
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
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (value === previousValue) {
      setDisplayValue(value);
      return;
    }

    setScale(1.4);
    setTimeout(() => setScale(1), 200);

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
      className={`${className} transition-transform duration-200`}
      style={{ transform: `scale(${scale})`, display: "inline-block" }}
    >
      {displayValue.toLocaleString("pt-BR")}
    </span>
  );
}

// ============================================
// ESTRELA INDIVIDUAL ANIMADA
// ============================================
interface FlyingStarProps {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  delay: number;
  duration: number;
  onArrive: () => void;
}

function FlyingStar({ startX, startY, endX, endY, delay, duration, onArrive }: FlyingStarProps) {
  const [state, setState] = useState<"hidden" | "visible" | "flying" | "arrived">("hidden");
  const onArriveRef = useRef(onArrive);
  onArriveRef.current = onArrive;
  
  useEffect(() => {
    // Mostrar estrela apos delay
    const showTimer = setTimeout(() => {
      setState("visible");
      // Iniciar voo no proximo frame para a transicao funcionar
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setState("flying");
        });
      });
    }, delay);
    
    // Marcar chegada apos delay + duration
    const arriveTimer = setTimeout(() => {
      setState("arrived");
      onArriveRef.current();
    }, delay + duration);
    
    return () => {
      clearTimeout(showTimer);
      clearTimeout(arriveTimer);
    };
  }, [delay, duration]);
  
  if (state === "hidden") return null;
  
  const translateX = endX - startX;
  const translateY = endY - startY;
  
  const isFlying = state === "flying" || state === "arrived";
  
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: startX,
        top: startY,
        transform: isFlying 
          ? `translate(${translateX}px, ${translateY}px) scale(${state === "arrived" ? 0 : 0.8})`
          : "translate(0, 0) scale(1.2)",
        transition: `transform ${duration}ms ease-in`,
        opacity: state === "arrived" ? 0 : 1,
        zIndex: 100000,
      }}
    >
      <Star 
        className="w-5 h-5 text-yellow-400" 
        fill="currentColor"
        style={{
          filter: "drop-shadow(0 0 6px rgba(250,204,21,1)) drop-shadow(0 0 3px rgba(255,255,255,0.9))",
        }}
      />
    </div>
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

export function StarDustFullscreenAnimation({ 
  amount, 
  isActive, 
  type,
  onComplete 
}: StarDustFullscreenAnimationProps) {
  const [phase, setPhase] = useState<"idle" | "showNumber" | "flyStars" | "done">("idle");
  const [stars, setStars] = useState<Array<{ id: number; startX: number; startY: number; endX: number; endY: number; delay: number; duration: number }>>([]);
  const [displayedAmount, setDisplayedAmount] = useState(0);
  const [counterPulse, setCounterPulse] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const arrivedCountRef = useRef(0);
  const totalStarsRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  const amountPerStarRef = useRef(0);
  
  onCompleteRef.current = onComplete;

  // Mount check
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Reset
  useEffect(() => {
    if (!isActive) {
      setPhase("idle");
      setStars([]);
      setDisplayedAmount(0);
      arrivedCountRef.current = 0;
    }
  }, [isActive]);

  // Iniciar animacao
  useEffect(() => {
    if (!isActive || !mounted || amount <= 0) return;

    // Fase 1: Mostrar numero grande
    setPhase("showNumber");
    setDisplayedAmount(0);
    arrivedCountRef.current = 0;

    // Apos 1.5s, criar estrelas
    const timer = setTimeout(() => {
      const targetEl = document.getElementById("stardust-counter-target");
      const targetRect = targetEl?.getBoundingClientRect();
      const targetX = targetRect ? targetRect.left + targetRect.width / 2 : window.innerWidth - 60;
      const targetY = targetRect ? targetRect.top + targetRect.height / 2 : 40;

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      // Numero de estrelas: 1 por 25 stardust, min 10, max 60
      const numStars = Math.min(60, Math.max(10, Math.ceil(amount / 25)));
      totalStarsRef.current = numStars;
      amountPerStarRef.current = Math.ceil(amount / numStars);

      const newStars: typeof stars = [];
      
      for (let i = 0; i < numStars; i++) {
        const delay = i * 50; // 50ms entre cada estrela
        const duration = 350 + Math.random() * 100;
        
        // Posicao inicial espalhada do centro
        const angle = (i / numStars) * Math.PI * 2 + Math.random() * 0.5;
        const radius = 30 + Math.random() * 50;
        const startX = centerX + Math.cos(angle) * radius;
        const startY = centerY + Math.sin(angle) * radius;
        
        // Posicao final no contador com pequena variacao
        const endX = targetX + (Math.random() - 0.5) * 15;
        const endY = targetY + (Math.random() - 0.5) * 10;

        newStars.push({ id: i, startX, startY, endX, endY, delay, duration });
      }

      setStars(newStars);
      setPhase("flyStars");
    }, 1500);

    return () => clearTimeout(timer);
  }, [isActive, mounted, amount]);

  // Callback quando estrela chega
  const handleStarArrive = () => {
    arrivedCountRef.current++;
    
    // Tocar som
    playMarioCoinSound();
    
    // Atualizar contador
    const newAmount = Math.min(amount, arrivedCountRef.current * amountPerStarRef.current);
    setDisplayedAmount(newAmount);
    
    // Pulsar
    setCounterPulse(true);
    setTimeout(() => setCounterPulse(false), 80);
    
    // Verificar se terminou
    if (arrivedCountRef.current >= totalStarsRef.current) {
      setDisplayedAmount(amount);
      setTimeout(() => {
        setPhase("done");
        onCompleteRef.current();
      }, 400);
    }
  };

  // Nao renderizar se nao ativo ou ja terminou
  if (!mounted || !isActive || phase === "idle" || phase === "done") {
    return null;
  }

  const content = (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 99999 }}
    >
      {/* Overlay escuro */}
      <div 
        className="absolute inset-0 transition-opacity duration-300"
        style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
      />

      {/* Numero grande no centro (fase 1) */}
      {phase === "showNumber" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div 
            className="text-6xl font-bold"
            style={{ 
              color: type === "gain" ? "#fde047" : "#f87171",
              textShadow: `0 0 40px ${type === "gain" ? "rgba(253,224,71,0.9)" : "rgba(248,113,113,0.9)"}`,
              animation: "zoomIn 0.4s ease-out",
            }}
          >
            {type === "gain" ? "+" : "-"}{amount.toLocaleString("pt-BR")}
          </div>
          <div className="flex items-center gap-2 mt-3 text-xl text-blue-300">
            <Star className="w-6 h-6" fill="currentColor" />
            <span>Star Dust</span>
          </div>
        </div>
      )}

      {/* Estrelas voando e contador (fase 2) */}
      {phase === "flyStars" && (
        <>
          {/* Contador progressivo no centro */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="text-5xl font-bold tabular-nums"
              style={{ 
                color: "#fde047",
                textShadow: "0 0 25px rgba(253,224,71,0.9)",
                transform: counterPulse ? "scale(1.15)" : "scale(1)",
                transition: "transform 0.08s ease-out",
              }}
            >
              {displayedAmount.toLocaleString("pt-BR")}
            </div>
          </div>

          {/* Estrelas */}
          {stars.map((star) => (
            <FlyingStar
              key={star.id}
              {...star}
              onArrive={handleStarArrive}
            />
          ))}
        </>
      )}

      {/* Keyframes CSS */}
      <style>{`
        @keyframes zoomIn {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
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

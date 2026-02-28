"use client";

import { useEffect, useState, useRef, useCallback } from "react";
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
    masterGain.gain.setValueAtTime(0.15, audioContext.currentTime);
    
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

    // Animacao de escala
    setScale(1.4);
    setTimeout(() => setScale(1), 200);

    // Animacao de contagem
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
      style={{
        transform: `scale(${scale})`,
        display: "inline-block",
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

export function StarDustFullscreenAnimation({ 
  amount, 
  isActive, 
  type,
  onComplete 
}: StarDustFullscreenAnimationProps) {
  const [phase, setPhase] = useState<"idle" | "showNumber" | "flyStars" | "done">("idle");
  const [starElements, setStarElements] = useState<React.ReactNode[]>([]);
  const [displayedAmount, setDisplayedAmount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [counterPulse, setCounterPulse] = useState(false);
  
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Reset quando desativado
  useEffect(() => {
    if (!isActive) {
      setPhase("idle");
      setStarElements([]);
      setDisplayedAmount(0);
    }
  }, [isActive]);

  // Iniciar animacao
  useEffect(() => {
    console.log("[v0] StarDust useEffect - isActive:", isActive, "mounted:", mounted, "amount:", amount);
    if (!isActive || amount <= 0) {
      console.log("[v0] StarDust useEffect early return");
      return;
    }

    console.log("[v0] StarDust starting animation - setting phase to showNumber");
    // Fase 1: Mostrar numero grande
    setPhase("showNumber");
    setDisplayedAmount(0);
    setMounted(true); // Garantir que mounted seja true

    // Apos 1.5s, iniciar estrelas
    const timer = setTimeout(() => {
      setPhase("flyStars");

      // Pegar posicao do contador no header
      const targetEl = document.getElementById("stardust-counter-target");
      const targetRect = targetEl?.getBoundingClientRect();
      const targetX = targetRect ? targetRect.left + targetRect.width / 2 : window.innerWidth - 60;
      const targetY = targetRect ? targetRect.top + targetRect.height / 2 : 40;

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      // Numero de estrelas: 1 por 50 stardust, min 8, max 50
      const numStars = Math.min(50, Math.max(8, Math.ceil(amount / 50)));
      const starsPerBatch = Math.ceil(amount / numStars);

      let arrivedCount = 0;
      const elements: React.ReactNode[] = [];

      // Criar estrelas em sequencia (60ms entre cada)
      for (let i = 0; i < numStars; i++) {
        const delay = i * 60;
        const duration = 400 + Math.random() * 100;
        
        // Posicao inicial com variacao
        const startX = centerX + (Math.random() - 0.5) * 80;
        const startY = centerY + (Math.random() - 0.5) * 80;
        
        // Posicao final com pequena variacao
        const endX = targetX + (Math.random() - 0.5) * 20;
        const endY = targetY + (Math.random() - 0.5) * 10;

        // Criar elemento de estrela com animacao CSS
        const starElement = (
          <div
            key={i}
            className="absolute"
            style={{
              left: startX,
              top: startY,
              transform: "translate(-50%, -50%)",
              animation: `flyToTarget${i} ${duration}ms ease-out ${delay}ms forwards`,
              opacity: 0,
            }}
          >
            <style>{`
              @keyframes flyToTarget${i} {
                0% {
                  transform: translate(-50%, -50%) scale(0);
                  opacity: 0;
                }
                10% {
                  transform: translate(-50%, -50%) scale(1.5);
                  opacity: 1;
                }
                100% {
                  left: ${endX}px;
                  top: ${endY}px;
                  transform: translate(-50%, -50%) scale(0.5);
                  opacity: 0;
                }
              }
            `}</style>
            <Star 
              className="w-6 h-6 text-yellow-400" 
              fill="currentColor"
              style={{
                filter: "drop-shadow(0 0 8px rgba(250,204,21,1)) drop-shadow(0 0 4px rgba(255,255,255,0.8))",
              }}
            />
          </div>
        );

        elements.push(starElement);

        // Quando estrela chega: tocar som, atualizar contador, pulsar
        setTimeout(() => {
          playMarioCoinSound();
          arrivedCount++;
          setDisplayedAmount(Math.min(amount, arrivedCount * starsPerBatch));
          setCounterPulse(true);
          setTimeout(() => setCounterPulse(false), 100);
          
          // Ultima estrela = terminar animacao
          if (arrivedCount >= numStars) {
            setDisplayedAmount(amount);
            setTimeout(() => {
              setPhase("done");
              onCompleteRef.current();
            }, 300);
          }
        }, delay + duration);
      }

      setStarElements(elements);
    }, 1500);

    return () => clearTimeout(timer);
  }, [isActive, amount]);

  console.log("[v0] StarDust render - isActive:", isActive, "phase:", phase, "amount:", amount);

  if (!isActive || phase === "idle" || phase === "done") {
    console.log("[v0] StarDust returning null - isActive:", isActive, "phase:", phase);
    return null;
  }

  console.log("[v0] StarDust rendering content for phase:", phase);

  const content = (
    <div className="fixed inset-0 z-[99999] pointer-events-none overflow-hidden">
      {/* Overlay escuro */}
      <div 
        className="absolute inset-0 transition-opacity duration-500"
        style={{ 
          backgroundColor: phase === "showNumber" ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.6)",
        }}
      />

      {/* Numero grande no centro (fase 1) */}
      {phase === "showNumber" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div 
            className="text-7xl font-bold animate-in zoom-in-50 duration-300"
            style={{ 
              color: type === "gain" ? "#fde047" : "#f87171",
              textShadow: `0 0 60px ${type === "gain" ? "rgba(253,224,71,0.9)" : "rgba(248,113,113,0.9)"}`,
            }}
          >
            {type === "gain" ? "+" : "-"}{amount.toLocaleString("pt-BR")}
          </div>
          <div className="flex items-center gap-3 mt-4 text-2xl text-blue-300 animate-in fade-in duration-500 delay-300">
            <Star className="w-8 h-8" fill="currentColor" />
            <span>Star Dust</span>
          </div>
        </div>
      )}

      {/* Estrelas voando (fase 2) */}
      {phase === "flyStars" && (
        <>
          {/* Contador progressivo no centro */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div 
              className="text-5xl font-bold tabular-nums transition-transform duration-100"
              style={{ 
                color: "#fde047",
                textShadow: "0 0 30px rgba(253,224,71,0.9)",
                transform: counterPulse ? "scale(1.2)" : "scale(1)",
              }}
            >
              {displayedAmount.toLocaleString("pt-BR")}
            </div>
          </div>

          {/* Estrelas animadas */}
          {starElements}

          {/* Efeito de pulso no alvo */}
          {displayedAmount > 0 && (
            <div
              className="absolute w-16 h-16 rounded-full"
              style={{
                left: document.getElementById("stardust-counter-target")?.getBoundingClientRect().left ?? 0,
                top: document.getElementById("stardust-counter-target")?.getBoundingClientRect().top ?? 0,
                background: "radial-gradient(circle, rgba(253,224,71,0.4) 0%, transparent 70%)",
                animation: counterPulse ? "pulse 0.2s ease-out" : "none",
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

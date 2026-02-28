"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StarParticle {
  id: number;
  startX: number;
  startY: number;
  delay: number;
}

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
  const [particles, setParticles] = useState<StarParticle[]>([]);
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isActive) {
      setParticles([]);
      return;
    }

    // Get target position (star dust counter in header)
    if (targetRef?.current) {
      const rect = targetRef.current.getBoundingClientRect();
      setTargetPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    } else {
      // Default position (top right area)
      setTargetPosition({ x: window.innerWidth - 100, y: 50 });
    }

    // Create particles based on amount (more dust = more particles, capped at 12)
    const particleCount = Math.min(12, Math.max(5, Math.floor(amount / 200)));
    const newParticles: StarParticle[] = [];

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: Date.now() + i,
        startX: window.innerWidth / 2 + (Math.random() - 0.5) * 100,
        startY: window.innerHeight / 2 + (Math.random() - 0.5) * 100,
        delay: i * 0.08,
      });
    }

    setParticles(newParticles);

    // Cleanup after animation completes
    const timeout = setTimeout(() => {
      setParticles([]);
      onComplete?.();
    }, 1200);

    return () => clearTimeout(timeout);
  }, [isActive, amount, onComplete, targetRef]);

  if (!isActive || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[200]">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: particle.startX,
              y: particle.startY,
              scale: 0,
              opacity: 0,
            }}
            animate={{
              x: targetPosition.x,
              y: targetPosition.y,
              scale: [0, 1.2, 0.8, 0],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 0.8,
              delay: particle.delay,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="absolute"
            style={{ transform: "translate(-50%, -50%)" }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="drop-shadow-[0_0_8px_rgba(147,197,253,0.8)]"
            >
              <path
                d="M12 2L14.09 8.26L20 9.27L15.5 13.14L16.82 19.02L12 16.24L7.18 19.02L8.5 13.14L4 9.27L9.91 8.26L12 2Z"
                fill="#93C5FD"
                stroke="#60A5FA"
                strokeWidth="1"
              />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Component to animate the star dust counter when receiving dust
interface StarDustCounterProps {
  value: number;
  previousValue: number;
  className?: string;
}

export function StarDustCounter({ value, previousValue, className = "" }: StarDustCounterProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (value > previousValue) {
      setIsAnimating(true);
      
      // Animate counting up
      const diff = value - previousValue;
      const steps = 20;
      const stepValue = diff / steps;
      let currentStep = 0;
      
      const interval = setInterval(() => {
        currentStep++;
        setDisplayValue(Math.floor(previousValue + stepValue * currentStep));
        
        if (currentStep >= steps) {
          clearInterval(interval);
          setDisplayValue(value);
          setTimeout(() => setIsAnimating(false), 300);
        }
      }, 30);

      return () => clearInterval(interval);
    } else {
      setDisplayValue(value);
    }
  }, [value, previousValue]);

  return (
    <motion.span
      className={className}
      animate={isAnimating ? {
        scale: [1, 1.3, 1],
        textShadow: [
          "0 0 0px rgba(147, 197, 253, 0)",
          "0 0 12px rgba(147, 197, 253, 0.8)",
          "0 0 0px rgba(147, 197, 253, 0)",
        ],
      } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {displayValue.toLocaleString("pt-BR")}
    </motion.span>
  );
}

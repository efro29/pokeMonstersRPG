"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface D20DiceProps {
  onResult: (value: number) => void;
  rolling: boolean;
}

export function D20Dice({ onResult, rolling }: D20DiceProps) {
  const [displayValue, setDisplayValue] = useState(20);
  const [finalValue, setFinalValue] = useState<number | null>(null);

  const rollDice = useCallback(() => {
    setFinalValue(null);
    let count = 0;
    const maxFlips = 20;
    const interval = setInterval(() => {
      const val = Math.floor(Math.random() * 20) + 1;
      setDisplayValue(val);
      count++;
      if (count >= maxFlips) {
        clearInterval(interval);
        const result = Math.floor(Math.random() * 20) + 1;
        setDisplayValue(result);
        setFinalValue(result);
        onResult(result);
      }
    }, 80);
    return () => clearInterval(interval);
  }, [onResult]);

  useEffect(() => {
    if (rolling) {
      const cleanup = rollDice();
      return cleanup;
    }
  }, [rolling, rollDice]);

  const isCritHit = finalValue === 20;
  const isCritMiss = finalValue === 1;

  return (
    <div className="flex flex-col items-center gap-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={rolling ? "rolling" : "static"}
          initial={{ scale: 0.5, rotateZ: -180 }}
          animate={{
            scale: rolling && !finalValue ? [1, 1.1, 1] : 1,
            rotateZ: 0,
          }}
          transition={{
            scale: {
              repeat: rolling && !finalValue ? Number.POSITIVE_INFINITY : 0,
              duration: 0.3,
            },
            rotateZ: { duration: 0.5, ease: "easeOut" },
          }}
          className="relative"
        >
          {/* D20 shape */}
          <svg
            width="160"
            height="160"
            viewBox="0 0 160 160"
            className="drop-shadow-2xl"
          >
            {/* Outer glow when rolling */}
            {rolling && (
              <motion.circle
                cx="80"
                cy="80"
                r="75"
                fill="none"
                stroke={isCritHit ? "#F59E0B" : isCritMiss ? "#EF4444" : "#EF4444"}
                strokeWidth="2"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.6, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.6 }}
              />
            )}
            {/* D20 icosahedron shape */}
            <polygon
              points="80,8 148,46 148,114 80,152 12,114 12,46"
              fill={
                finalValue
                  ? isCritHit
                    ? "#F59E0B"
                    : isCritMiss
                      ? "#EF4444"
                      : "#1E293B"
                  : "#1E293B"
              }
              stroke={
                finalValue
                  ? isCritHit
                    ? "#FCD34D"
                    : isCritMiss
                      ? "#FCA5A5"
                      : "#EF4444"
                  : "#EF4444"
              }
              strokeWidth="3"
            />
            {/* Inner triangle lines */}
            <line x1="80" y1="8" x2="80" y2="152" stroke="#334155" strokeWidth="1" opacity="0.5" />
            <line x1="12" y1="46" x2="148" y2="114" stroke="#334155" strokeWidth="1" opacity="0.5" />
            <line x1="148" y1="46" x2="12" y2="114" stroke="#334155" strokeWidth="1" opacity="0.5" />
            {/* Number */}
            <text
              x="80"
              y="88"
              textAnchor="middle"
              fill={
                finalValue
                  ? isCritHit || isCritMiss
                    ? "#FFFFFF"
                    : "#F1F5F9"
                  : "#F1F5F9"
              }
              fontSize="42"
              fontWeight="bold"
              fontFamily="monospace"
            >
              {displayValue}
            </text>
          </svg>

          {/* Particles on critical */}
          {finalValue && (isCritHit || isCritMiss) && (
            <>
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: isCritHit ? "#F59E0B" : "#EF4444",
                    top: "50%",
                    left: "50%",
                  }}
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{
                    x: Math.cos((i * Math.PI * 2) / 8) * 80,
                    y: Math.sin((i * Math.PI * 2) / 8) * 80,
                    opacity: 0,
                    scale: [1, 2, 0],
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              ))}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {rolling && !finalValue && (
        <motion.p
          className="text-muted-foreground text-sm font-mono"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
        >
          Rolando D20...
        </motion.p>
      )}
    </div>
  );
}

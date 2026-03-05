"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SequentialDiceRollerProps {
  diceCount: number;
  diceSize: number;
  rolling: boolean;
  onComplete: (results: number[], totalDamage: number) => void;
  onDiceResult?: (diceIndex: number, value: number, damage: number) => void;
}

export function SequentialDiceRoller({
  diceCount,
  diceSize,
  rolling,
  onComplete,
  onDiceResult,
}: SequentialDiceRollerProps) {
  const [diceResults, setDiceResults] = useState<number[]>([]);
  const [currentRollingIndex, setCurrentRollingIndex] = useState<number | null>(null);
  const [displayValues, setDisplayValues] = useState<number[]>(
    Array(diceCount).fill(diceSize)
  );
  const [totalDamage, setTotalDamage] = useState(0);

  const rollDice = useCallback(async () => {
    const results: number[] = [];
    let damage = 0;

    // Rola cada dado sequencialmente
    for (let i = 0; i < diceCount; i++) {
      setCurrentRollingIndex(i);
      
      // Animação de rolagem individual
      let count = 0;
      const maxFlips = 15;
      
      await new Promise<void>((resolve) => {
        const interval = setInterval(() => {
          const val = Math.floor(Math.random() * diceSize) + 1;
          setDisplayValues((prev) => {
            const newValues = [...prev];
            newValues[i] = val;
            return newValues;
          });
          count++;
          
          if (count >= maxFlips) {
            clearInterval(interval);
            const finalValue = Math.floor(Math.random() * diceSize) + 1;
            setDisplayValues((prev) => {
              const newValues = [...prev];
              newValues[i] = finalValue;
              return newValues;
            });
            
            results.push(finalValue);
            damage += finalValue;
            setDiceResults([...results]);
            setTotalDamage(damage);
            
            // Callback de resultado individual
            if (onDiceResult) {
              onDiceResult(i, finalValue, damage);
            }
            
            resolve();
          }
        }, 60);
      });
      
      // Aguarda um pouco antes de rolar o próximo dado
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    setCurrentRollingIndex(null);
    onComplete(results, totalDamage);
  }, [diceCount, diceSize, onComplete, onDiceResult]);

  useEffect(() => {
    if (rolling && diceCount > 0) {
      setDiceResults([]);
      setTotalDamage(0);
      setDisplayValues(Array(diceCount).fill(diceSize));
      rollDice();
    }
  }, [rolling, diceCount, diceSize, rollDice]);

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Dados em fila */}
      <div className="flex gap-4 flex-wrap justify-center max-w-md">
        {Array.from({ length: diceCount }).map((_, index) => {
          const isCurrentlyRolling = currentRollingIndex === index;
          const isComplete = index < diceResults.length;
          const value = displayValues[index];
          const damage = diceResults[index];

          return (
            <motion.div
              key={index}
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.3, opacity: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="flex flex-col items-center gap-2"
            >
              {/* Dado */}
              <motion.div
                className="relative w-16 h-16 flex items-center justify-center rounded-lg shadow-lg"
                animate={{
                  backgroundColor: isCurrentlyRolling
                    ? "#F59E0B"
                    : isComplete
                      ? "#22C55E"
                      : "#1E293B",
                  scale: isCurrentlyRolling ? [1, 1.15, 1] : 1,
                }}
                transition={{
                  scale: isCurrentlyRolling
                    ? {
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 0.2,
                      }
                    : { duration: 0.3 },
                  backgroundColor: { duration: 0.4 },
                }}
                style={{
                  border: isCurrentlyRolling
                    ? "2px solid #FBBF24"
                    : isComplete
                      ? "2px solid #4ADE80"
                      : "2px solid #EF4444",
                }}
              >
                {/* Brilho quando rolando */}
                {isCurrentlyRolling && (
                  <motion.div
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: [-64, 64] }}
                    transition={{
                      duration: 0.6,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  />
                )}

                <span
                  className="text-3xl font-bold text-white z-10"
                  style={{
                    fontFamily: "monospace",
                  }}
                >
                  {value}
                </span>
              </motion.div>

              {/* Dano animado após rolagem */}
              <AnimatePresence>
                {isComplete && (
                  <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 10, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-center"
                  >
                    <div className="text-xs text-muted-foreground">Dano</div>
                    <motion.div
                      initial={{ scale: 1.5 }}
                      animate={{ scale: 1 }}
                      className="text-lg font-bold text-red-500"
                    >
                      -{damage}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Indicador de posição */}
              <div className="text-xs text-muted-foreground">
                d{diceSize} #{index + 1}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Dano total */}
      <AnimatePresence>
        {diceResults.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <div className="text-sm text-muted-foreground mb-2">Dano Total</div>
            <motion.div className="text-4xl font-bold text-red-600">
              -{totalDamage}
            </motion.div>
            <div className="text-xs text-muted-foreground mt-2">
              {diceResults.join(" + ")} = {totalDamage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status de rolagem */}
      {rolling && (
        <motion.p
          className="text-sm text-amber-500 font-mono"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
        >
          Rolando dados...
        </motion.p>
      )}
    </div>
  );
}

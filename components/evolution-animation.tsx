"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getSpriteUrl, getPokemon } from "@/lib/pokemon-data";
import { playEvolve } from "@/lib/sounds";
import { Sparkles, Zap } from "lucide-react";

interface EvolutionAnimationProps {
  fromSpeciesId: number;
  toSpeciesId: number;
  pokemonName: string;
  onComplete: () => void;
}

export function EvolutionAnimation({
  fromSpeciesId,
  toSpeciesId,
  pokemonName,
  onComplete,
}: EvolutionAnimationProps) {
  const [stage, setStage] = useState<"intro" | "transform" | "reveal" | "complete">("intro");
  const fromSpecies = getPokemon(fromSpeciesId);
  const toSpecies = getPokemon(toSpeciesId);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    playEvolve();

    // Stage timeline (total ~10 seconds)
    const t1 = setTimeout(() => setStage("transform"), 2000);
    const t2 = setTimeout(() => setStage("reveal"), 6000);
    const t3 = setTimeout(() => setStage("complete"), 9000);
    const t4 = setTimeout(() => onCompleteRef.current(), 10500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
    >
      {/* Background animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ opacity: 0 }}
            animate={{
              x: [0, (Math.random() - 0.5) * 200],
              y: [0, (Math.random() - 0.5) * 200],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <AnimatePresence mode="wait">
          {stage === "intro" && (
            <motion.div
              key="intro"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <Sparkles className="w-16 h-16 text-yellow-400" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white">
                O que?
              </h2>
              <p className="text-lg text-white/80">
                {pokemonName} esta evoluindo!
              </p>
            </motion.div>
          )}

          {stage === "transform" && (
            <motion.div
              key="transform"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative flex flex-col items-center"
            >
              {/* Pulsing silhouette effect */}
              <motion.div
                className="relative"
                animate={{
                  scale: [1, 1.15, 1],
                  filter: [
                    "brightness(1) blur(0px)",
                    "brightness(2) blur(4px)",
                    "brightness(1) blur(0px)",
                  ],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <img
                  src={getSpriteUrl(fromSpeciesId) || "/placeholder.svg"}
                  alt={fromSpecies?.name || "Pokemon"}
                  width={160}
                  height={160}
                  className="pixelated drop-shadow-[0_0_30px_rgba(255,255,255,0.8)]"
                  crossOrigin="anonymous"
                />
              </motion.div>

              {/* Energy rings */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-32 h-32 border-4 border-yellow-400 rounded-full"
                  style={{ translateX: "-50%", translateY: "-50%" }}
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{
                    scale: [0, 2.5],
                    opacity: [1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.6,
                    ease: "easeOut",
                  }}
                />
              ))}

              {/* Lightning bolts */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={`bolt-${i}`}
                  className="absolute"
                  style={{
                    top: "50%",
                    left: "50%",
                    translateX: "-50%",
                    translateY: "-50%",
                  }}
                  initial={{ scale: 0, rotate: i * 45 }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                >
                  <Zap className="w-8 h-8 text-yellow-300 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
                </motion.div>
              ))}
            </motion.div>
          )}

          {(stage === "reveal" || stage === "complete") && (
            <motion.div
              key="reveal"
              initial={{ scale: 0, opacity: 0, rotateY: -180 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              transition={{ type: "spring", duration: 1 }}
              className="flex flex-col items-center gap-6"
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <img
                  src={getSpriteUrl(toSpeciesId) || "/placeholder.svg"}
                  alt={toSpecies?.name || "Pokemon"}
                  width={180}
                  height={180}
                  className="pixelated drop-shadow-[0_0_40px_rgba(255,215,0,0.9)]"
                  crossOrigin="anonymous"
                />
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-3xl font-bold text-white">
                    Parabens!
                  </h2>
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                </div>
                <p className="text-xl text-white/90">
                  {pokemonName} evoluiu para
                </p>
                <p className="text-2xl font-bold text-yellow-400">
                  {toSpecies?.name || "???"}!
                </p>
              </motion.div>

              {/* Celebration sparkles */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={`sparkle-${i}`}
                  className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                  initial={{
                    x: 0,
                    y: 0,
                    scale: 0,
                  }}
                  animate={{
                    x: (Math.random() - 0.5) * 300,
                    y: (Math.random() - 0.5) * 300,
                    scale: [0, 1, 0],
                    opacity: [1, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.1,
                    ease: "easeOut",
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

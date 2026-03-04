"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PokemonType } from "@/lib/pokemon-data";

interface AnimeAttackAnimationProps {
  attackerSprite: string;
  defenderSprite: string;
  attackerName: string;
  defenderName: string;
  moveName: string;
  moveType: PokemonType;
  onComplete: () => void;
}

// Configuracao visual por tipo de ataque
const TYPE_ATTACK_CONFIG: Record<
  string,
  {
    bgGradient: string;
    particleColors: string[];
    auraColor: string;
    impactColor: string;
    speedLines: string;
    kanji: string;
  }
> = {
  fire: {
    bgGradient: "radial-gradient(ellipse at center, #ff4500 0%, #8b0000 50%, #1a0000 100%)",
    particleColors: ["#ff6b35", "#f7931e", "#ffcc00", "#ff4500", "#ff0000"],
    auraColor: "rgba(255, 69, 0, 0.8)",
    impactColor: "#ff4500",
    speedLines: "#ff6b35",
    kanji: "炎",
  },
  water: {
    bgGradient: "radial-gradient(ellipse at center, #00bfff 0%, #0066cc 50%, #001a33 100%)",
    particleColors: ["#00bfff", "#0099ff", "#66ccff", "#0066cc", "#003366"],
    auraColor: "rgba(0, 191, 255, 0.8)",
    impactColor: "#00bfff",
    speedLines: "#66ccff",
    kanji: "水",
  },
  grass: {
    bgGradient: "radial-gradient(ellipse at center, #32cd32 0%, #228b22 50%, #0a2e0a 100%)",
    particleColors: ["#32cd32", "#00ff00", "#7cfc00", "#228b22", "#006400"],
    auraColor: "rgba(50, 205, 50, 0.8)",
    impactColor: "#32cd32",
    speedLines: "#7cfc00",
    kanji: "草",
  },
  electric: {
    bgGradient: "radial-gradient(ellipse at center, #ffd700 0%, #ff8c00 50%, #332200 100%)",
    particleColors: ["#ffd700", "#ffff00", "#fff44f", "#ff8c00", "#ffcc00"],
    auraColor: "rgba(255, 215, 0, 0.9)",
    impactColor: "#ffd700",
    speedLines: "#ffff00",
    kanji: "雷",
  },
  ice: {
    bgGradient: "radial-gradient(ellipse at center, #87ceeb 0%, #4169e1 50%, #0a1a33 100%)",
    particleColors: ["#87ceeb", "#b0e0e6", "#add8e6", "#4169e1", "#ffffff"],
    auraColor: "rgba(135, 206, 235, 0.8)",
    impactColor: "#87ceeb",
    speedLines: "#ffffff",
    kanji: "氷",
  },
  fighting: {
    bgGradient: "radial-gradient(ellipse at center, #ff6347 0%, #b22222 50%, #1a0a0a 100%)",
    particleColors: ["#ff6347", "#ff4500", "#dc143c", "#b22222", "#8b0000"],
    auraColor: "rgba(255, 99, 71, 0.8)",
    impactColor: "#ff6347",
    speedLines: "#ff4500",
    kanji: "闘",
  },
  poison: {
    bgGradient: "radial-gradient(ellipse at center, #9932cc 0%, #4b0082 50%, #1a001a 100%)",
    particleColors: ["#9932cc", "#8b008b", "#ba55d3", "#4b0082", "#800080"],
    auraColor: "rgba(153, 50, 204, 0.8)",
    impactColor: "#9932cc",
    speedLines: "#ba55d3",
    kanji: "毒",
  },
  ground: {
    bgGradient: "radial-gradient(ellipse at center, #d2691e 0%, #8b4513 50%, #1a0f00 100%)",
    particleColors: ["#d2691e", "#cd853f", "#deb887", "#8b4513", "#a0522d"],
    auraColor: "rgba(210, 105, 30, 0.8)",
    impactColor: "#d2691e",
    speedLines: "#deb887",
    kanji: "地",
  },
  flying: {
    bgGradient: "radial-gradient(ellipse at center, #87ceeb 0%, #4682b4 50%, #0a1a2e 100%)",
    particleColors: ["#87ceeb", "#b0c4de", "#add8e6", "#4682b4", "#ffffff"],
    auraColor: "rgba(135, 206, 235, 0.8)",
    impactColor: "#87ceeb",
    speedLines: "#ffffff",
    kanji: "風",
  },
  psychic: {
    bgGradient: "radial-gradient(ellipse at center, #ff69b4 0%, #8b008b 50%, #1a001a 100%)",
    particleColors: ["#ff69b4", "#ff1493", "#da70d6", "#8b008b", "#ff00ff"],
    auraColor: "rgba(255, 105, 180, 0.8)",
    impactColor: "#ff69b4",
    speedLines: "#ff00ff",
    kanji: "念",
  },
  bug: {
    bgGradient: "radial-gradient(ellipse at center, #9acd32 0%, #556b2f 50%, #1a1f0a 100%)",
    particleColors: ["#9acd32", "#6b8e23", "#7cfc00", "#556b2f", "#adff2f"],
    auraColor: "rgba(154, 205, 50, 0.8)",
    impactColor: "#9acd32",
    speedLines: "#adff2f",
    kanji: "虫",
  },
  rock: {
    bgGradient: "radial-gradient(ellipse at center, #a0522d 0%, #5c4033 50%, #1a1410 100%)",
    particleColors: ["#a0522d", "#8b7355", "#d2b48c", "#5c4033", "#bc8f8f"],
    auraColor: "rgba(160, 82, 45, 0.8)",
    impactColor: "#a0522d",
    speedLines: "#d2b48c",
    kanji: "岩",
  },
  ghost: {
    bgGradient: "radial-gradient(ellipse at center, #663399 0%, #301934 50%, #0d0d1a 100%)",
    particleColors: ["#663399", "#9370db", "#8a2be2", "#301934", "#9932cc"],
    auraColor: "rgba(102, 51, 153, 0.8)",
    impactColor: "#663399",
    speedLines: "#9370db",
    kanji: "霊",
  },
  dragon: {
    bgGradient: "radial-gradient(ellipse at center, #6a5acd 0%, #483d8b 50%, #0d0a1a 100%)",
    particleColors: ["#6a5acd", "#7b68ee", "#9370db", "#483d8b", "#8a2be2"],
    auraColor: "rgba(106, 90, 205, 0.8)",
    impactColor: "#6a5acd",
    speedLines: "#9370db",
    kanji: "竜",
  },
  dark: {
    bgGradient: "radial-gradient(ellipse at center, #2f2f2f 0%, #1a1a1a 50%, #000000 100%)",
    particleColors: ["#2f2f2f", "#4a4a4a", "#696969", "#1a1a1a", "#333333"],
    auraColor: "rgba(47, 47, 47, 0.9)",
    impactColor: "#4a4a4a",
    speedLines: "#696969",
    kanji: "闇",
  },
  steel: {
    bgGradient: "radial-gradient(ellipse at center, #c0c0c0 0%, #708090 50%, #1a1a1f 100%)",
    particleColors: ["#c0c0c0", "#d3d3d3", "#a9a9a9", "#708090", "#ffffff"],
    auraColor: "rgba(192, 192, 192, 0.8)",
    impactColor: "#c0c0c0",
    speedLines: "#ffffff",
    kanji: "鋼",
  },
  fairy: {
    bgGradient: "radial-gradient(ellipse at center, #ffb6c1 0%, #ff69b4 50%, #330d1a 100%)",
    particleColors: ["#ffb6c1", "#ffc0cb", "#ff69b4", "#ff1493", "#ffffff"],
    auraColor: "rgba(255, 182, 193, 0.8)",
    impactColor: "#ffb6c1",
    speedLines: "#ffffff",
    kanji: "妖",
  },
  normal: {
    bgGradient: "radial-gradient(ellipse at center, #a8a878 0%, #6d6d4e 50%, #1a1a14 100%)",
    particleColors: ["#a8a878", "#c6c6a7", "#d8d8c0", "#6d6d4e", "#8b8b6b"],
    auraColor: "rgba(168, 168, 120, 0.8)",
    impactColor: "#a8a878",
    speedLines: "#d8d8c0",
    kanji: "力",
  },
};

export function AnimeAttackAnimation({
  attackerSprite,
  defenderSprite,
  attackerName,
  defenderName,
  moveName,
  moveType,
  onComplete,
}: AnimeAttackAnimationProps) {
  const [stage, setStage] = useState<
    "charge" | "attack" | "impact" | "damage" | "complete"
  >("charge");

  const config = TYPE_ATTACK_CONFIG[moveType] || TYPE_ATTACK_CONFIG.normal;

  const handleComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    // Timeline da animacao estilo anime
    const timers: NodeJS.Timeout[] = [];

    // Fase 1: Charge (Pokemon carregando o ataque)
    timers.push(setTimeout(() => setStage("attack"), 1200));

    // Fase 2: Attack (Pokemon avanca para atacar)
    timers.push(setTimeout(() => setStage("impact"), 2000));

    // Fase 3: Impact (Impacto no rival)
    timers.push(setTimeout(() => setStage("damage"), 2800));

    // Fase 4: Damage (Rival recebendo dano)
    timers.push(setTimeout(() => setStage("complete"), 3600));

    // Fim
    timers.push(setTimeout(() => handleComplete(), 4000));

    return () => timers.forEach(clearTimeout);
  }, [handleComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] overflow-hidden"
        style={{ background: config.bgGradient }}
      >
        {/* Speed Lines Background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={`speed-${i}`}
              className="absolute h-[2px]"
              style={{
                background: `linear-gradient(90deg, transparent, ${config.speedLines}, transparent)`,
                width: `${100 + Math.random() * 200}px`,
                top: `${Math.random() * 100}%`,
                left: stage === "attack" ? "-200px" : `${Math.random() * 100}%`,
              }}
              animate={
                stage === "attack" || stage === "impact"
                  ? {
                      x: ["0vw", "120vw"],
                      opacity: [0, 1, 0],
                    }
                  : {}
              }
              transition={{
                duration: 0.3 + Math.random() * 0.2,
                repeat: stage === "attack" || stage === "impact" ? Infinity : 0,
                delay: Math.random() * 0.2,
              }}
            />
          ))}
        </div>

        {/* Radial Burst Effect */}
        {(stage === "impact" || stage === "damage") && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0] }}
            transition={{ duration: 0.5 }}
            style={{
              background: `radial-gradient(circle at center, ${config.impactColor} 0%, transparent 70%)`,
            }}
          />
        )}

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(40)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute rounded-full"
              style={{
                width: 4 + Math.random() * 8,
                height: 4 + Math.random() * 8,
                backgroundColor:
                  config.particleColors[i % config.particleColors.length],
                boxShadow: `0 0 10px ${config.particleColors[i % config.particleColors.length]}`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, (Math.random() - 0.5) * 100],
                y: [0, (Math.random() - 0.5) * 100],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 1 + Math.random(),
                repeat: Infinity,
                delay: Math.random() * 0.5,
              }}
            />
          ))}
        </div>

        {/* STAGE: CHARGE - Pokemon carregando ataque */}
        <AnimatePresence>
          {stage === "charge" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {/* Nome do Movimento */}
              <motion.div
                className="absolute top-8 left-0 right-0 text-center z-20"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <div className="inline-block bg-black/60 backdrop-blur-sm px-8 py-3 rounded-lg border-2"
                     style={{ borderColor: config.impactColor }}>
                  <span className="text-3xl font-black tracking-wider text-white uppercase"
                        style={{ textShadow: `0 0 20px ${config.impactColor}` }}>
                    {moveName}
                  </span>
                </div>
              </motion.div>

              {/* Kanji do tipo */}
              <motion.div
                className="absolute text-[200px] font-black opacity-20 z-0"
                style={{ color: config.impactColor }}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 10 }}
              >
                {config.kanji}
              </motion.div>

              {/* Pokemon Atacante */}
              <motion.div
                className="relative z-10"
                initial={{ x: -200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", damping: 12 }}
              >
                {/* Aura de poder */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${config.auraColor} 0%, transparent 70%)`,
                    filter: "blur(20px)",
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />

                {/* Sprite */}
                <motion.img
                  src={attackerSprite}
                  alt={attackerName}
                  className="w-48 h-48 object-contain drop-shadow-2xl"
                  style={{
                    imageRendering: "pixelated",
                    filter: `drop-shadow(0 0 30px ${config.auraColor})`,
                  }}
                  animate={{
                    scale: [1, 1.1, 1],
                    y: [0, -10, 0],
                  }}
                  transition={{ duration: 0.4, repeat: Infinity }}
                  crossOrigin="anonymous"
                />

                {/* Energy rings */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={`ring-${i}`}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-4"
                    style={{ borderColor: config.impactColor }}
                    initial={{ width: 0, height: 0, opacity: 1 }}
                    animate={{
                      width: [0, 300],
                      height: [0, 300],
                      opacity: [1, 0],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  />
                ))}
              </motion.div>

              {/* Nome do atacante */}
              <motion.div
                className="absolute bottom-16 left-8 z-20"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="bg-black/70 backdrop-blur px-4 py-2 rounded-r-lg border-l-4"
                     style={{ borderColor: config.impactColor }}>
                  <span className="text-xl font-bold text-white">{attackerName}</span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* STAGE: ATTACK - Pokemon avancando */}
        <AnimatePresence>
          {stage === "attack" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {/* Flash de movimento */}
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.8, 0] }}
                transition={{ duration: 0.2 }}
              />

              {/* Pokemon em movimento */}
              <motion.div
                className="relative z-10"
                initial={{ x: -300, scale: 0.5 }}
                animate={{ x: 300, scale: 1.5 }}
                transition={{ duration: 0.6, ease: "easeIn" }}
              >
                {/* Trail effect */}
                {[...Array(5)].map((_, i) => (
                  <motion.img
                    key={`trail-${i}`}
                    src={attackerSprite}
                    alt=""
                    className="absolute w-48 h-48 object-contain"
                    style={{
                      imageRendering: "pixelated",
                      filter: `blur(${i * 2}px)`,
                      opacity: 0.5 - i * 0.1,
                      left: -i * 40,
                    }}
                    crossOrigin="anonymous"
                  />
                ))}
                <motion.img
                  src={attackerSprite}
                  alt={attackerName}
                  className="w-48 h-48 object-contain"
                  style={{
                    imageRendering: "pixelated",
                    filter: `drop-shadow(0 0 40px ${config.auraColor})`,
                  }}
                  crossOrigin="anonymous"
                />
              </motion.div>

              {/* Nome do movimento voando */}
              <motion.div
                className="absolute text-6xl font-black text-white z-20"
                style={{
                  textShadow: `0 0 30px ${config.impactColor}, 0 0 60px ${config.impactColor}`,
                }}
                initial={{ x: 0, opacity: 1, scale: 1 }}
                animate={{ x: 200, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.5 }}
              >
                {moveName}!
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* STAGE: IMPACT - Momento do impacto */}
        <AnimatePresence>
          {stage === "impact" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {/* Flash de impacto */}
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />

              {/* Explosion effect */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 3] }}
                transition={{ duration: 0.5 }}
              >
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={`explosion-${i}`}
                    className="absolute w-4 h-20 rounded-full"
                    style={{
                      background: `linear-gradient(to bottom, ${config.impactColor}, transparent)`,
                      transformOrigin: "center bottom",
                      rotate: `${i * 30}deg`,
                    }}
                    initial={{ scaleY: 0, opacity: 1 }}
                    animate={{ scaleY: [0, 1, 0], opacity: [1, 1, 0] }}
                    transition={{ duration: 0.4, delay: i * 0.02 }}
                  />
                ))}
              </motion.div>

              {/* Impact star */}
              <motion.div
                className="absolute z-20"
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: [0, 2, 0], rotate: 180 }}
                transition={{ duration: 0.4 }}
              >
                <svg width="200" height="200" viewBox="0 0 200 200">
                  <polygon
                    points="100,10 120,80 190,80 135,120 155,190 100,150 45,190 65,120 10,80 80,80"
                    fill={config.impactColor}
                    style={{ filter: `drop-shadow(0 0 20px ${config.impactColor})` }}
                  />
                </svg>
              </motion.div>

              {/* CRITICAL text */}
              <motion.div
                className="absolute text-8xl font-black z-30"
                style={{
                  color: config.impactColor,
                  textShadow: `0 0 20px ${config.impactColor}, 0 0 40px white`,
                  WebkitTextStroke: "3px white",
                }}
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: [0, 1.5, 1], rotate: [0, 5, 0] }}
                transition={{ type: "spring", damping: 8 }}
              >
                HIT!
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* STAGE: DAMAGE - Rival recebendo dano */}
        <AnimatePresence>
          {stage === "damage" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {/* Dark vignette */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: "radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.8) 100%)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />

              {/* Pokemon rival recebendo dano */}
              <motion.div
                className="relative z-10"
                initial={{ x: 100 }}
                animate={{ x: 0 }}
              >
                {/* Damage flash */}
                <motion.div
                  className="absolute inset-0 bg-red-500 rounded-full"
                  style={{ filter: "blur(40px)" }}
                  animate={{ opacity: [0.8, 0, 0.5, 0] }}
                  transition={{ duration: 0.4, times: [0, 0.3, 0.6, 1] }}
                />

                {/* Pokemon sprite com shake */}
                <motion.img
                  src={defenderSprite}
                  alt={defenderName}
                  className="w-56 h-56 object-contain"
                  style={{
                    imageRendering: "pixelated",
                    filter: "drop-shadow(0 0 20px rgba(255,0,0,0.5))",
                  }}
                  animate={{
                    x: [0, -20, 20, -15, 15, -10, 10, -5, 5, 0],
                    filter: [
                      "brightness(1)",
                      "brightness(3)",
                      "brightness(1)",
                      "brightness(2)",
                      "brightness(1)",
                    ],
                  }}
                  transition={{ duration: 0.5 }}
                  crossOrigin="anonymous"
                />

                {/* Damage particles */}
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={`dmg-${i}`}
                    className="absolute top-1/2 left-1/2 rounded-full"
                    style={{
                      width: 8 + Math.random() * 12,
                      height: 8 + Math.random() * 12,
                      backgroundColor: config.particleColors[i % config.particleColors.length],
                    }}
                    initial={{ x: 0, y: 0, scale: 0 }}
                    animate={{
                      x: (Math.random() - 0.5) * 200,
                      y: (Math.random() - 0.5) * 200,
                      scale: [0, 1, 0],
                      opacity: [1, 1, 0],
                    }}
                    transition={{ duration: 0.6, delay: i * 0.02 }}
                  />
                ))}
              </motion.div>

              {/* Nome do defensor */}
              <motion.div
                className="absolute bottom-16 right-8 z-20"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <div className="bg-black/70 backdrop-blur px-4 py-2 rounded-l-lg border-r-4 border-red-500">
                  <span className="text-xl font-bold text-red-400">{defenderName}</span>
                </div>
              </motion.div>

              {/* Dano text */}
              <motion.div
                className="absolute top-1/3 right-1/4 z-30"
                initial={{ scale: 0, y: 0 }}
                animate={{ scale: [0, 1.5, 1], y: -50 }}
                transition={{ type: "spring" }}
              >
                <span
                  className="text-6xl font-black text-red-500"
                  style={{
                    textShadow: "0 0 20px rgba(255,0,0,0.8), 2px 2px 0 white",
                    WebkitTextStroke: "2px white",
                  }}
                >
                  DAMAGE!
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scan lines overlay para efeito de TV/Anime */}
        <div
          className="absolute inset-0 pointer-events-none z-50 opacity-10"
          style={{
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}

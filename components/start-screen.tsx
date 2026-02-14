"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playStartGame, playButtonClick } from "@/lib/sounds";
import type { GameMode } from "@/lib/mode-store";

interface StartScreenProps {
  onStart: () => void;
  onContinue: () => void;
  hasSave: boolean;
  mode?: GameMode;
  profileName?: string;
  onChangeMode?: () => void;
  onChangeProfile?: () => void;
}

export function StartScreen({
  onStart,
  onContinue,
  hasSave,
  mode,
  profileName,
  onChangeMode,
  onChangeProfile,
}: StartScreenProps) {
  const [showPress, setShowPress] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [stars, setStars] = useState<{ x: number; y: number; delay: number; size: number }[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: 30 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      size: Math.random() * 2 + 1,
    }));
    setStars(generated);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowPress((prev) => !prev);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const handleTap = () => {
    if (!showMenu) {
      setShowMenu(true);
    }
  };

  return (
    <div
      className="flex flex-col h-dvh max-w-md mx-auto relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0c1220 0%, #1a1a3e 40%, #2d1b4e 70%, #0c1220 100%)",
      }}
      onClick={handleTap}
    >
      {/* Twinkling stars */}
      {stars.map((star, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            backgroundColor: "#ffffff",
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
          }}
          transition={{
            duration: 2,
            delay: star.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Pokeball background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.04]">
        <svg width="400" height="400" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="48" fill="none" stroke="white" strokeWidth="2" />
          <rect x="2" y="48" width="96" height="4" fill="white" />
          <circle cx="50" cy="50" r="14" fill="none" stroke="white" strokeWidth="2" />
        </svg>
      </div>

      {/* Mode badge */}
      {mode && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute top-4 left-0 right-0 flex justify-center z-10"
        >
          <div
            className="px-3 py-1 rounded-full text-[10px] font-pixel tracking-wider"
            style={{
              backgroundColor: mode === "master" ? "rgba(239,68,68,0.15)" : "rgba(59,130,246,0.15)",
              color: mode === "master" ? "#EF4444" : "#3B82F6",
              border: `1px solid ${mode === "master" ? "rgba(239,68,68,0.3)" : "rgba(59,130,246,0.3)"}`,
            }}
          >
            {mode === "master" ? "MODO MESTRE" : `TREINADOR: ${profileName || ""}`}
          </div>
        </motion.div>
      )}

      {/* Title area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        {/* Animated Pokeball */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 12, delay: 0.3 }}
          className="mb-6"
        >
          <svg width="80" height="80" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" fill="#EF4444" stroke="#1E293B" strokeWidth="3" />
            <rect x="2" y="48" width="96" height="4" fill="#1E293B" />
            <path d="M 2 50 A 48 48 0 0 1 98 50" fill="#EF4444" />
            <path d="M 2 50 A 48 48 0 0 0 98 50" fill="#F1F5F9" />
            <circle cx="50" cy="50" r="16" fill="#F1F5F9" stroke="#1E293B" strokeWidth="3" />
            <circle cx="50" cy="50" r="8" fill="#1E293B" />
            <motion.circle
              cx="50"
              cy="50"
              r="4"
              fill="white"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
          </svg>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center mb-2"
        >
          <h1 className="font-pixel text-xl leading-relaxed tracking-wider" style={{ color: "#ffffff" }}>
            POKEMON RPG
          </h1>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2
            className="font-pixel text-sm leading-relaxed tracking-widest"
            style={{ color: "#F59E0B" }}
          >
            MANAUS EDITION Beta
          </h2>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-xs text-center mb-10"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          Tabletop RPG Companion App
        </motion.p>

        {/* Menu or Press to Start */}
        <AnimatePresence mode="wait">
          {!showMenu ? (
            <motion.p
              key="press"
              animate={{ opacity: showPress ? 1 : 0.3 }}
              className="text-sm font-pixel tracking-wider"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              PRESSIONE PARA INICIAR
            </motion.p>
          ) : (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 w-full max-w-xs"
              onClick={(e) => e.stopPropagation()}
            >
              {hasSave && (
                <button
                  type="button"
                  onClick={() => { playStartGame(); onContinue(); }}
                  className="w-full py-3 px-6 rounded-lg border-2 font-pixel text-xs tracking-wider transition-all hover:bg-white/5 active:scale-95"
                  style={{ borderColor: "rgba(255,255,255,0.2)", color: "#ffffff" }}
                >
                  CONTINUAR
                </button>
              )}
              <button
                type="button"
                onClick={() => { playStartGame(); onStart(); }}
                className="w-full py-3 px-6 rounded-lg border-2 text-xs font-pixel tracking-wider transition-all active:scale-95"
                style={{
                  borderColor: "#EF4444",
                  color: "#EF4444",
                  background: "rgba(239, 68, 68, 0.1)",
                }}
              >
                {hasSave ? "NOVO JOGO" : "INICIAR JOGO"}
              </button>

              {/* Navigation buttons */}
              <div className="flex gap-2 w-full mt-2">
                {onChangeMode && (
                  <button
                    type="button"
                    onClick={() => {
                      playButtonClick();
                      onChangeMode();
                    }}
                    className="flex-1 py-2 px-4 rounded-lg border text-[10px] font-pixel tracking-wider transition-all active:scale-95"
                    style={{
                      borderColor: "rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.4)",
                    }}
                  >
                    TROCAR MODO
                  </button>
                )}
                {onChangeProfile && (
                  <button
                    type="button"
                    onClick={() => {
                      playButtonClick();
                      onChangeProfile();
                    }}
                    className="flex-1 py-2 px-4 rounded-lg border text-[10px] font-pixel tracking-wider transition-all active:scale-95"
                    style={{
                      borderColor: "rgba(59,130,246,0.3)",
                      color: "rgba(59,130,246,0.6)",
                    }}
                  >
                    TROCAR PERFIL
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="pb-8 text-center"
      >
        <p className="text-[10px] font-pixel" style={{ color: "rgba(255,255,255,0.2)" }}>
          GEN I & II - 251 POKEMON
        </p>
      </motion.div>
    </div>
  );
}

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
  className="flex flex-col h-dvh max-w-md mx-auto relative overflow-hidden bg-black select-none"
  onClick={handleTap}
>
  {/* Background Image com ajuste de brilho gamer */}
  <img
    src="/images/home.png"
    className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105"
    style={{ zIndex: 0 }}
    loading="eager"
    decoding="sync"
  />

  {/* Overlay de gradiente mais profundo */}
  <div
    className="absolute inset-0"
    style={{
      background: "linear-gradient(180deg, rgba(7,10,20,0.85) 0%, rgba(20,20,45,0.8) 40%, rgba(0,0,0,0.95) 100%)",
      zIndex: 1,
    }}
  />

  {/* Efeito de Scanlines (Linhas de TV antiga/CRT) */}
  <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-[2]" 
    style={{ backgroundImage: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))", backgroundSize: "100% 2px, 3px 100%" }} 
  />

  {/* Twinkling stars com Glow */}
  {stars.map((star, i) => (
    <motion.div
      key={i}
      className="absolute rounded-full z-[1]"
      style={{
        left: `${star.x}%`,
        top: `${star.y}%`,
        width: star.size,
        height: star.size,
        backgroundColor: "#ffffff",
        boxShadow: "0 0 5px rgba(255,255,255,0.8)",
      }}
      animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.2, 1] }}
      transition={{ duration: 2, delay: star.delay, repeat: Infinity, ease: "easeInOut" }}
    />
  ))}

  {/* Pokeball background decoration - Opacidade levemente maior para profundidade */}
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.07] blur-[1px]">
    <svg width="400" height="400" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="48" fill="none" stroke="white" strokeWidth="1" />
      <rect x="2" y="48" width="96" height="4" fill="white" />
      <circle cx="50" cy="50" r="14" fill="none" stroke="white" strokeWidth="1" />
    </svg>
  </div>

  {/* Mode badge Estilo HUD */}
  {mode && (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="absolute top-6 left-0 right-0 flex justify-center z-20"
    >
      <div
        className="px-4 py-1.5 border-x border-b rounded-b-xl backdrop-blur-md text-[9px] font-black tracking-[0.2em] shadow-lg"
        style={{
          backgroundColor: mode === "master" ? "rgba(239,68,68,0.1)" : "rgba(59,130,246,0.1)",
          color: mode === "master" ? "#EF4444" : "#3B82F6",
          borderColor: mode === "master" ? "rgba(239,68,68,0.4)" : "rgba(59,130,246,0.4)",
        }}
      >
        <span className="opacity-50 mr-2">●</span>
        {mode === "master" ? "MODO MESTRE" : `TREINADOR: ${profileName || ""}`}
      </div>
    </motion.div>
  )}

  {/* Title area */}
  <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 pt-12">
    {/* Animated Pokeball com Glow de Neon */}
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", damping: 15, delay: 0.3 }}
      className="mb-8 relative"
    >
      <div className="absolute inset-0 bg-red-600 blur-[20px] opacity-20 animate-pulse" />
      <motion.img
        src={`/images/pokebola.png`}
        className="w-[70px] drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]"
        animate={{ opacity: [0.8, 1, 0.8], y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </motion.div>

    {/* Title Group */}
    <div className="flex flex-col items-center mb-10 text-center">
      <div className="logo-wrapper relative mb-2">
        <div className="smoke"></div>
        <h1 className="pokemon-logo text-5xl tracking-tighter">PoKéMoN</h1>
      </div>
      <h4 className="text-red-500 text-[10px] font-black tracking-[0.4em] uppercase opacity-80 mb-1">
        Season 1
      </h4>
      <h2 className="text-white text-xl font-black italic tracking-tight uppercase bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
        Sombras da Liga
      </h2>
    </div>

    {/* Subtitle / Version */}
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2 }}
      className="text-[9px] font-mono tracking-[0.2em] text-center mb-12 opacity-40"
    > Auxiliar de Fichas para RPG
    </motion.p>

    {/* Menu or Press to Start */}
    <AnimatePresence mode="wait">
      {!showMenu ? (
        <motion.div
          key="press"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.p
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-[11px] font-black tracking-[0.3em] text-white/70 italic"
          >
            PRESSIONE PARA INICIAR
          </motion.p>
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </motion.div>
      ) : (
        <motion.div
          key="menu"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center gap-4 w-full max-w-[260px]"
          onClick={(e) => e.stopPropagation()}
        >
          {hasSave && (
            <button
              type="button"
              onClick={() => { playStartGame(); onContinue(); }}
              className="w-full py-4 px-6 bg-white/5 border border-white/20 rounded-sm font-black text-[10px] tracking-[0.2em] uppercase transition-all hover:bg-white/10 active:scale-95"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% 75%, 90% 100%, 0 100%)" }}
            >
              Continuar Registro
            </button>
          )}
          <button
            type="button"
            onClick={() => { playStartGame(); onStart(); }}
            className="w-full py-4 px-6 border rounded-sm font-black text-[10px] tracking-[0.2em] uppercase transition-all active:scale-95 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
            style={{
              borderColor: "#EF4444",
              color: "#EF4444",
              background: "rgba(239, 68, 68, 0.1)",
              clipPath: "polygon(0 0, 100% 0, 100% 75%, 90% 100%, 0 100%)"
            }}
          >
            {hasSave ? "Novo Protocolo" : "Iniciar Sistema"}
          </button>

          {/* Navigation buttons Style HUD */}
          <div className="flex gap-3 w-full mt-2">
            {onChangeMode && (
              <button
                type="button"
                onClick={() => { playButtonClick(); onChangeMode(); }}
                className="flex-1 py-2 border border-white/10 text-[8px] font-bold tracking-widest text-white/40 hover:text-white/80 transition-all italic uppercase"
              >
                Modo
              </button>
            )}
            {onChangeProfile && (
              <button
                type="button"
                onClick={() => { playButtonClick(); onChangeProfile(); }}
                className="flex-1 py-2 border border-blue-500/20 text-[8px] font-bold tracking-widest text-blue-400/50 hover:text-blue-400 transition-all italic uppercase"
              >
                Perfil
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
    className="pb-8 text-center flex flex-col gap-1 items-center"
  >
    <div className="w-1 h-1 bg-red-600 rounded-full animate-ping mb-1" />
    <p className="text-[8px] font-mono tracking-[0.3em] text-white/20 uppercase">
      Database: GEN I & II // 251 PKMN Active
    </p>
  </motion.div>
</div>
  );
}

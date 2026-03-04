"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Shield, Eye, Lock, X } from "lucide-react";
import { playButtonClick, playStartGame } from "@/lib/sounds";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { GameMode } from "@/lib/mode-store";

const MASTER_SECRET = "mestreares";

interface ModeSelectScreenProps {
  onSelectMode: (mode: GameMode) => void;
}

export function ModeSelectScreen({ onSelectMode }: ModeSelectScreenProps) {
  const [stars, setStars] = useState<{ x: number; y: number; delay: number; size: number }[]>([]);
  const [showMasterPassword, setShowMasterPassword] = useState(false);
  const [masterPasswordInput, setMasterPasswordInput] = useState("");
  const [masterPasswordError, setMasterPasswordError] = useState(false);

  const handleMasterPasswordSubmit = () => {
    if (masterPasswordInput.toLowerCase().trim() === MASTER_SECRET) {
      playStartGame();
      onSelectMode("master");
      setShowMasterPassword(false);
      setMasterPasswordInput("");
      setMasterPasswordError(false);
    } else {
      setMasterPasswordError(true);
      setMasterPasswordInput("");
    }
  };

  useEffect(() => {
    const generated = Array.from({ length: 20 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      size: Math.random() * 2 + 1,
    }));
    setStars(generated);
  }, []);

  return (
<div
      className="flex flex-col h-dvh max-w-md mx-auto relative overflow-hidden bg-[#050505] font-mono"
      style={{
        background: "radial-gradient(circle at center, #0a1a2f 0%, #050505 100%)",
      }}
    >
      {/* HUD Decorativo de Fundo */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ backgroundImage: `linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)`, backgroundSize: '30px 30px' }} 
      />

      {/* Título Estilo Terminal */}
      <div className="absolute top-12 left-0 w-full z-30 text-center pointer-events-none">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="font-pixel text-xl tracking-[0.3em] text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            ESCOLHA UM MODO
          </h1>
          <p className="text-[10px] text-cyan-500/50 mt-1 uppercase tracking-widest font-bold">
            Waiting for authorization...
          </p>
        </motion.div>
      </div>

      {/* CONTAINER DOS BOTÕES QUE PEGAM A TELA INTEIRA */}
      <div className="flex-1 flex flex-col relative z-10 h-full">
        
        {/* MODO MESTRE (METADE SUPERIOR) */}
        <motion.button
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          onClick={() => {
            playButtonClick();
            setShowMasterPassword(true);
            setMasterPasswordInput("");
            setMasterPasswordError(false);
          }}
          className="group relative w-full h-1/2 overflow-hidden outline-none border-b border-red-500/30"
          style={{
            background: "linear-gradient(180deg, rgba(153, 27, 27, 0.4) 0%, transparent 100%)",
            clipPath: "polygon(0 0, 100% 0, 100% 85%, 0% 100%)",
          }}
        >
          <div className="absolute inset-0 group-hover:bg-red-600/10 transition-colors duration-300" />
          <div className="absolute left-10 top-1/2 -translate-y-1/2 flex items-center gap-6">
            <div className="p-4 bg-red-600/20 border border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]">
              <Shield className="w-10 h-10 text-red-500" />
            </div>
            <div className="text-left">
              <h2 className="font-pixel text-3xl text-red-500 group-hover:text-red-400">MESTRE</h2>
              <p className="text-[10px] text-red-300/50 max-w-[150px] leading-tight mt-1 uppercase">
               Pokedex Completa
              </p>
            </div>
          </div>
          {/* Label Vertical */}
          <div className="absolute right-4 top-20 rotate-90 text-[8px] font-bold text-red-500/30 tracking-[0.5em]">ROOT_ACCESS</div>
        </motion.button>

        {/* MODO TREINADOR (METADE INFERIOR) */}
        <motion.button
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          onClick={() => {
            playStartGame();
            onSelectMode("trainer");
          }}
          className="group relative w-full h-1/2 overflow-hidden outline-none"
          style={{
            background: "linear-gradient(0deg, rgba(59, 130, 246, 0.3) 0%, transparent 100%)",
            clipPath: "polygon(0 15%, 100% 0, 100% 100%, 0% 100%)",
          }}
        >
          <div className="absolute inset-0 group-hover:bg-blue-600/10 transition-colors duration-300" />
          <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-row-reverse items-center gap-6">
            <div className="p-4 bg-blue-600/20 border border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.4)]">
              <Eye className="w-10 h-10 text-blue-400" />
            </div>
            <div className="text-right">
              <h2 className="font-pixel text-3xl text-blue-400 group-hover:text-blue-300">TRAINER</h2>
              <p className="text-[10px] text-blue-300/50 max-w-[150px] ml-auto leading-tight mt-1 uppercase">
                Descubra pokemons e venca batalhas
              </p>
            </div>
          </div>
          <div className="absolute left-4 bottom-20 -rotate-90 text-[8px] font-bold text-blue-500/30 tracking-[0.5em]">FIELD_OP_SYNC</div>
        </motion.button>
      </div>

      {/* POPUP DE SENHA ESTILIZADA */}
      <AnimatePresence>
        {showMasterPassword && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center px-6 bg-black/80 backdrop-blur-md"
            onClick={() => setShowMasterPassword(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-xs border-2 p-6 flex flex-col gap-5 relative overflow-hidden"
              style={{
                borderColor: "#EF4444",
                background: "#0a0a0f",
                boxShadow: "0 0 40px rgba(239, 68, 68, 0.2)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Scanline no Modal */}
              <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />

              <div className="flex items-center justify-between relative">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-red-500 animate-pulse" />
                  <h3 className="font-pixel text-xs tracking-widest text-red-500">
                    AUTH_REQUIRED
                  </h3>
                </div>
                <button onClick={() => setShowMasterPassword(false)} className="hover:bg-red-500/20 p-1">
                  <X className="w-5 h-5 text-white/40" />
                </button>
              </div>

              <div className="h-[1px] w-full bg-red-500/30" />

              <p className="text-[10px] font-mono leading-tight text-white/60 tracking-tighter">
                Enter MASTER_KEY to bypass standard encryption and unlock full database access.
              </p>

              <Input
                type="password"
                placeholder="PROMPT_PASS..."
                value={masterPasswordInput}
                onChange={(e) => {
                  setMasterPasswordInput(e.target.value.toUpperCase());
                  setMasterPasswordError(false);
                }}
                onKeyDown={(e) => { if (e.key === "Enter") handleMasterPasswordSubmit(); }}
                className="bg-black border-red-500/40 text-red-500 placeholder:text-red-900 font-mono h-12 rounded-none focus-visible:ring-red-500"
                autoFocus
              />

              {masterPasswordError && (
                <motion.p initial={{ x: -10 }} animate={{ x: 0 }} className="text-[10px] font-bold text-red-600 uppercase tracking-widest italic">
                  &gt; ACCESS_DENIED: Invalid Key
                </motion.p>
              )}

              <Button
                onClick={handleMasterPasswordSubmit}
                disabled={!masterPasswordInput}
                className="w-full font-pixel text-sm h-12 rounded-none transition-all"
                style={{
                  backgroundColor: masterPasswordInput ? "#EF4444" : "#450a0a",
                  color: masterPasswordInput ? "#000" : "#ef4444",
                  clipPath: "polygon(5% 0, 100% 0, 95% 100%, 0 100%)",
                }}
              >
                AUTHORIZE
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="absolute bottom-4 w-full text-center z-30 pointer-events-none opacity-30">
        <p className="text-[8px] font-pixel tracking-[0.5em] text-white">
          POKEMON_RPG_MANAUS // V.4.0
        </p>
      </div>
    </div>
  );
}

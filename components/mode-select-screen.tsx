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
      className="flex flex-col h-dvh max-w-md mx-auto relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0c1220 0%, #1a1a3e 40%, #2d1b4e 70%, #0c1220 100%)",
      }}
    >
      {/* Stars */}
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
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 2, delay: star.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Pokeball bg */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.04]">
        <svg width="400" height="400" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="48" fill="none" stroke="white" strokeWidth="2" />
          <rect x="2" y="48" width="96" height="4" fill="white" />
          <circle cx="50" cy="50" r="14" fill="none" stroke="white" strokeWidth="2" />
        </svg>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 gap-6">
        {/* Title */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-2"
        >
          <h1 className="font-pixel text-lg leading-relaxed tracking-wider" style={{ color: "#ffffff" }}>
            ESCOLHA O MODO
          </h1>
          <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.4)" }}>
            Como deseja jogar?
          </p>
        </motion.div>

        {/* Mode cards */}
        <div className="flex flex-col gap-4 w-full max-w-xs">
          {/* Master mode */}
          <motion.button
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            onClick={() => {
              playButtonClick();
              setShowMasterPassword(true);
              setMasterPasswordInput("");
              setMasterPasswordError(false);
            }}
            className="relative w-full rounded-xl border-2 p-5 text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              borderColor: "#EF4444",
              background: "rgba(239, 68, 68, 0.08)",
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: "rgba(239, 68, 68, 0.2)" }}
              >
                <Shield className="w-6 h-6" style={{ color: "#EF4444" }} />
              </div>
              <div className="flex-1">
                <h2 className="font-pixel text-xs tracking-wider mb-2" style={{ color: "#EF4444" }}>
                  MODO MESTRE
                </h2>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Acesso completo a todos os  Pokemon da Pokedex. Ideal para quem conduz a campanha.
                </p>
              </div>
            </div>
          </motion.button>

          {/* Trainer mode */}
          <motion.button
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            onClick={() => {
              playStartGame();
              onSelectMode("trainer");
            }}
            className="relative w-full rounded-xl border-2 p-5 text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              borderColor: "#3B82F6",
              background: "rgba(59, 130, 246, 0.08)",
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: "rgba(59, 130, 246, 0.2)" }}
              >
                <Eye className="w-6 h-6" style={{ color: "#3B82F6" }} />
              </div>
              <div className="flex-1">
                <h2 className="font-pixel text-xs tracking-wider mb-2" style={{ color: "#3B82F6" }}>
                  MODO TREINADOR
                </h2>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Pokemon ficam escondidos na Pokedex. Descubra-os inserindo o numero que o Mestre revelar durante a campanha.
                </p>
              </div>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="pb-8 text-center"
      >
        <p className="text-[10px] font-pixel" style={{ color: "rgba(255,255,255,0.2)" }}>
          POKEMON RPG MANAUS
        </p>
      </motion.div>

      {/* Master Password Modal */}
      <AnimatePresence>
        {showMasterPassword && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center px-6"
            style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
            onClick={() => setShowMasterPassword(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-xs rounded-xl border-2 p-5 flex flex-col gap-4"
              style={{
                borderColor: "#EF4444",
                background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" style={{ color: "#EF4444" }} />
                  <h3 className="font-pixel text-xs tracking-wider" style={{ color: "#EF4444" }}>
                    MODO MESTRE
                  </h3>
                </div>
                <button
                  onClick={() => setShowMasterPassword(false)}
                  className="p-1 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" style={{ color: "rgba(255,255,255,0.5)" }} />
                </button>
              </div>

              <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                Digite a senha do Mestre para acessar o modo completo.
              </p>

              <Input
                type="password"
                placeholder="Senha..."
                value={masterPasswordInput}
                onChange={(e) => {
                  setMasterPasswordInput(e.target.value);
                  setMasterPasswordError(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleMasterPasswordSubmit();
                }}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-10"
                autoFocus
              />

              {masterPasswordError && (
                <p className="text-xs font-medium" style={{ color: "#EF4444" }}>
                  Senha incorreta. Tente novamente.
                </p>
              )}

              <Button
                onClick={handleMasterPasswordSubmit}
                disabled={!masterPasswordInput}
                className="w-full font-bold text-sm h-10"
                style={{
                  backgroundColor: masterPasswordInput ? "#EF4444" : "rgba(239,68,68,0.3)",
                  color: "#fff",
                }}
              >
                Entrar
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, ArrowLeft, Check } from "lucide-react";
import { playButtonClick, playStartGame } from "@/lib/sounds";
import { useModeStore, TRAINER_AVATARS } from "@/lib/mode-store";
import type { TrainerProfile } from "@/lib/mode-store";
import { TrainerAvatar } from "@/components/trainer-avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProfileSelectScreenProps {
  onSelectProfile: (profileId: string) => void;
  onBack: () => void;
}

export function ProfileSelectScreen({ onSelectProfile, onBack }: ProfileSelectScreenProps) {
  const { profiles, addProfile, removeProfile } = useModeStore();
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<TrainerProfile | null>(null);

  const handleCreate = () => {
    if (!newName.trim()) return;
    const id = addProfile(newName.trim(), selectedAvatar);
    setCreating(false);
    setNewName("");
    setSelectedAvatar(0);
    playStartGame();
    onSelectProfile(id);
  };

  const handleDelete = (profile: TrainerProfile) => {
    removeProfile(profile.id);
    setDeleteTarget(null);
    playButtonClick();
  };

  return (
<div
  className="flex flex-col h-dvh max-w-md mx-auto relative overflow-hidden font-mono"
  style={{
    backgroundColor: "#050505",
    background: "radial-gradient(circle at top, #0c1a2e 0%, #050505 100%)",
  }}
>
  {/* SCANLINES & GRID DE FUNDO TÁTICO */}
  <div className="absolute inset-0 pointer-events-none z-0 opacity-10" 
    style={{ backgroundImage: `linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)`, backgroundSize: '40px 40px' }} 
  />
  <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />

  {/* BACK BUTTON - ESTILO TÉCNICO */}
  <motion.div
    initial={{ x: -20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    className="absolute top-6 left-6 z-20"
  >
    <button
      onClick={() => { playButtonClick(); onBack(); }}
      className="group flex items-center gap-2 text-cyan-500/60 hover:text-cyan-400 transition-colors"
    >
      <div className="p-1 border border-cyan-500/30 group-hover:border-cyan-400 group-hover:shadow-[0_0_10px_#22d3ee]">
        <ArrowLeft className="w-4 h-4" />
      </div>
      <span className="text-[10px] font-pixel tracking-tighter">DISCONNECT</span>
    </button>
  </motion.div>

  <div className="flex-1 flex flex-col items-center pt-20 px-6 relative z-10">
    {/* TITLE HUD */}
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="text-center mb-10 w-full"
    >
      <div className="inline-block px-3 py-1 border-x-2 border-cyan-500 mb-2">
        <h1 className="font-pixel text-lg tracking-[0.2em] text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
          IDENTIFICATION
        </h1>
      </div>
      <p className="text-[9px] font-mono text-cyan-500/50 uppercase tracking-[0.3em]">
        Accessing trainer database... [SECURE_CONNECTION]
      </p>
    </motion.div>

    {/* PROFILES GRID - BRUTALIST STYLE */}
    <div className="grid grid-cols-2 gap-5 w-full max-w-xs mb-10">
      <AnimatePresence>
        {profiles.map((profile, index) => (
          <motion.div
            key={profile.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative group"
          >
            <button
              onClick={() => { playStartGame(); onSelectProfile(profile.id); }}
              className="w-full flex flex-col items-center gap-3 p-4 bg-black/40 border-b-2 transition-all relative overflow-hidden"
              style={{
                borderColor: "#22d3ee44",
                clipPath: "polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%)",
              }}
            >
              {/* Efeito de brilho no hover */}
              <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative border-2 border-white/5 p-1 group-hover:border-cyan-400 transition-colors">
                <TrainerAvatar avatarId={profile.avatarId} size={72} />
              </div>

              <span className="text-[10px] font-pixel tracking-tighter text-white/70 group-hover:text-cyan-400 truncate w-full">
                {profile.name.toUpperCase()}
              </span>
              
              {/* Decoração técnica minúscula */}
              <div className="absolute bottom-1 right-3 text-[7px] text-cyan-500/20 font-mono">ID: {profile.id.slice(0,4)}</div>
            </button>

            {/* DELETE BUTTON - ALERTA */}
            <button
              onClick={(e) => { e.stopPropagation(); playButtonClick(); setDeleteTarget(profile); }}
              className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-30"
              style={{ clipPath: "polygon(20% 0, 100% 0, 100% 80%, 80% 100%, 0 100%, 0 20%)" }}
            >
              <Trash2 className="w-3 h-3 text-white" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* ADD PROFILE - ESTILO WIREFRAME */}
      {profiles.length < 6 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => { playButtonClick(); setCreating(true); }}
          className="w-full flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-cyan-500/20 bg-cyan-500/5 transition-all hover:bg-cyan-500/10 group h-full min-h-[135px]"
          style={{ clipPath: "polygon(0 0, 85% 0, 100% 15%, 100% 100%, 15% 100%, 0 85%)" }}
        >
          <div className="w-10 h-10 border border-cyan-500/40 rounded-full flex items-center justify-center group-hover:shadow-[0_0_15px_#22d3ee44]">
            <Plus className="w-5 h-5 text-cyan-500/60 group-hover:text-cyan-400" />
          </div>
          <span className="text-[8px] font-pixel tracking-widest text-cyan-500/40 group-hover:text-cyan-400">
            NEW_PROFILE
          </span>
        </motion.button>
      )}
    </div>
  </div>

  {/* DIALOGS ESTILIZADOS CYBERPUNK (Red e Cyan) */}
  <Dialog open={creating} onOpenChange={setCreating}>
    <DialogContent className="max-w-sm mx-auto border-2 border-cyan-500 bg-[#0a0a0f] text-white p-6 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
      <DialogHeader className="border-b border-cyan-500/20 pb-4">
        <DialogTitle className="font-pixel text-cyan-400 text-sm italic tracking-widest">INITIALIZE_TRAINER_PROTOCOL</DialogTitle>
      </DialogHeader>
      
      <div className="flex flex-col gap-6 py-4">
        <div>
          <label className="text-[9px] font-pixel text-cyan-500/60 block mb-3">SELECT_AVATAR_MODEL</label>
          <div className="grid grid-cols-4 gap-3">
            {TRAINER_AVATARS.map((avatar) => (
              <button
                key={avatar.id}
                onClick={() => setSelectedAvatar(avatar.id)}
                className={`p-1 border transition-all ${selectedAvatar === avatar.id ? 'border-cyan-400 bg-cyan-400/20 shadow-[0_0_10px_#22d3ee]' : 'border-white/5 bg-white/5'}`}
              >
                <TrainerAvatar avatarId={avatar.id} size={60} />
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <label className="text-[9px] font-pixel text-cyan-500/60 block mb-2">IDENTIFICATION_STRING</label>
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value.toUpperCase())}
            placeholder="INPUT NAME..."
            className="bg-black/50 border-cyan-500/30 text-cyan-400 font-mono placeholder:text-cyan-900"
          />
        </div>

        <Button
          onClick={handleCreate}
          disabled={!newName.trim()}
          className="w-full font-pixel text-xs h-12 bg-cyan-600 hover:bg-cyan-400 text-black transition-all"
          style={{ clipPath: "polygon(5% 0, 100% 0, 95% 100%, 0 100%)" }}
        >
          CONFIRM_CREATION
        </Button>
      </div>
    </DialogContent>
  </Dialog>

  {/* FOOTER - SYSTEM LOG */}
  <div className="pb-6 px-10 flex justify-between items-center opacity-20">
    <div className="h-[1px] flex-1 bg-cyan-500/30" />
    <p className="px-4 text-[8px] font-pixel text-cyan-500 whitespace-nowrap">
      MAX_CAPACITY: 06_PROFILES
    </p>
    <div className="h-[1px] flex-1 bg-cyan-500/30" />
  </div>
</div>
  );
}

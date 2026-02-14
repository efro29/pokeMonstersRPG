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
      className="flex flex-col h-dvh max-w-md mx-auto relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0c1220 0%, #1a1a3e 40%, #2d1b4e 70%, #0c1220 100%)",
      }}
    >
      {/* Back button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="absolute top-4 left-4 z-20"
      >
        <button
          onClick={() => {
            playButtonClick();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all hover:bg-white/10 active:scale-95"
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs font-pixel tracking-wider">VOLTAR</span>
        </button>
      </motion.div>

      <div className="flex-1 flex flex-col items-center pt-16 px-6 relative z-10">
        {/* Title */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="font-pixel text-sm leading-relaxed tracking-wider" style={{ color: "#3B82F6" }}>
            QUEM VAI JOGAR?
          </h1>
          <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.4)" }}>
            Selecione seu perfil ou crie um novo
          </p>
        </motion.div>

        {/* Profiles grid */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-xs mb-6">
          <AnimatePresence>
            {profiles.map((profile, index) => (
              <motion.div
                key={profile.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ delay: 0.3 + index * 0.1, type: "spring", damping: 15 }}
                className="relative group"
              >
                <button
                  onClick={() => {
                    playStartGame();
                    onSelectProfile(profile.id);
                  }}
                  className="w-full flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all hover:scale-[1.03] active:scale-[0.97]"
                  style={{
                    borderColor: "rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.03)",
                  }}
                >
                  <TrainerAvatar avatarId={profile.avatarId} size={72} />
                  <span className="text-xs font-medium tracking-wide truncate w-full text-center" style={{ color: "#ffffff" }}>
                    {profile.name}
                  </span>
                </button>

                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playButtonClick();
                    setDeleteTarget(profile);
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: "#EF4444" }}
                >
                  <Trash2 className="w-3 h-3" style={{ color: "#ffffff" }} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add profile card */}
          {profiles.length < 6 && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 + profiles.length * 0.1, type: "spring", damping: 15 }}
              onClick={() => {
                playButtonClick();
                setCreating(true);
              }}
              className="w-full flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed transition-all hover:scale-[1.03] active:scale-[0.97]"
              style={{
                borderColor: "rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.02)",
                minHeight: "120px",
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
              >
                <Plus className="w-6 h-6" style={{ color: "rgba(255,255,255,0.5)" }} />
              </div>
              <span className="text-[10px] font-pixel tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>
                NOVO PERFIL
              </span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Create profile dialog */}
      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent
          className="max-w-sm mx-auto border-0"
          style={{
            backgroundColor: "#1E293B",
            color: "#F8FAFC",
          }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: "#F8FAFC" }}>Novo Perfil de Treinador</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            {/* Avatar selection */}
            <div>
              <label className="text-xs mb-2 block" style={{ color: "rgba(248,250,252,0.6)" }}>
                Escolha seu avatar
              </label>
              <div className="grid grid-cols-4 gap-2">
                {TRAINER_AVATARS.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => setSelectedAvatar(avatar.id)}
                    className="flex flex-col items-center gap-1 p-2  transition-all"
                    style={{
                      borderColor: selectedAvatar === avatar.id ? "#3B82F6" : "rgba(255,255,255,0.1)",
                      backgroundColor: selectedAvatar === avatar.id ? "rgba(59,130,246,0.1)" : "transparent",
                    }}
                  >
                    <TrainerAvatar avatarId={avatar.id} size={75} />
                    {selectedAvatar === avatar.id && (
                      <Check className="w-3 h-3" style={{ color: "#3B82F6" }} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Name input */}
            <div>
              <label className="text-xs mb-1 block" style={{ color: "rgba(248,250,252,0.6)" }}>
                Nome do treinador
              </label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ex: Ash, Misty, Brock..."
                maxLength={20}
                className="border-0 text-sm"
                style={{
                  backgroundColor: "rgba(255,255,255,0.08)",
                  color: "#F8FAFC",
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreate();
                }}
              />
            </div>

            <Button
              onClick={handleCreate}
              disabled={!newName.trim()}
              className="w-full"
              style={{
                backgroundColor: "#3B82F6",
                color: "#ffffff",
              }}
            >
              CRIAR PERFIL
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent
          className="max-w-sm mx-auto border-0"
          style={{
            backgroundColor: "#1E293B",
            color: "#F8FAFC",
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: "#F8FAFC" }}>Remover perfil?</AlertDialogTitle>
            <AlertDialogDescription style={{ color: "rgba(248,250,252,0.6)" }}>
              Todos os dados de {deleteTarget?.name} serao perdidos. Essa acao nao pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="border-0"
              style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "#F8FAFC" }}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && handleDelete(deleteTarget)}
              style={{ backgroundColor: "#EF4444", color: "#ffffff" }}
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Footer */}
      <div className="pb-6 text-center">
        <p className="text-[10px] font-pixel" style={{ color: "rgba(255,255,255,0.15)" }}>
          MODO TREINADOR - ATE 6 PERFIS
        </p>
      </div>
    </div>
  );
}

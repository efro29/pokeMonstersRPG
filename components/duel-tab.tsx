"use client";

import { useState, useEffect } from "react";
import { useGameStore } from "@/lib/game-store";
import { npcs, superBossSemanal, generateRandomChallenges, getNivelColor, getNivelLabel } from "@/lib/duel-npcs";
import type { DuelNpc } from "@/lib/duel-npcs";
import { getSpriteUrl } from "@/lib/pokemon-data";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  MailOpen,
  Swords,
  Trophy,
  Star,
  Coins,
  Users,
  ChevronRight,
  Zap,
  Flame,
  Crown,
  Skull,
} from "lucide-react";
import { playButtonClick } from "@/lib/sounds";

interface DuelTabProps {
  onStartDuel: (npc: DuelNpc) => void;
}

export function DuelTab({ onStartDuel }: DuelTabProps) {
  const { trainer } = useGameStore();
  const [challenges, setChallenges] = useState<DuelNpc[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<DuelNpc | null>(null);
  const [showTransition, setShowTransition] = useState(false);
  const [weeklyBoss, setWeeklyBoss] = useState<DuelNpc | null>(null);
  const [weeklyWins, setWeeklyWins] = useState(0);
  const [readChallenges, setReadChallenges] = useState<Set<string>>(new Set());

  // Gera desafios ao montar o componente
  useEffect(() => {
    const newChallenges = generateRandomChallenges(6);
    setChallenges(newChallenges);
    
    // Verifica se o boss semanal esta disponivel (10 vitorias no fim de semana)
    const storedWins = localStorage.getItem("pokerpg-weekly-duel-wins");
    const wins = storedWins ? parseInt(storedWins) : 0;
    setWeeklyWins(wins);
    
    if (wins >= 10) {
      const now = new Date();
      const weekNumber = Math.ceil((now.getDate()) / 7);
      const boss = superBossSemanal.find(b => b.semana === ((weekNumber - 1) % 4) + 1);
      setWeeklyBoss(boss || null);
    }
  }, []);

  const handleAcceptChallenge = (npc: DuelNpc) => {
    playButtonClick();
    setShowTransition(true);
    
    // Marca como lido
    setReadChallenges(prev => new Set(prev).add(npc.id));
    
    // Aguarda a animacao de transicao antes de iniciar o duelo
    setTimeout(() => {
      onStartDuel(npc);
      setShowTransition(false);
      setSelectedChallenge(null);
    }, 2000);
  };

  const getNivelIcon = (nivel: DuelNpc["nivel"]) => {
    switch (nivel) {
      case "facil": return <Zap className="w-4 h-4" />;
      case "medio": return <Swords className="w-4 h-4" />;
      case "dificil": return <Flame className="w-4 h-4" />;
      case "elite": return <Crown className="w-4 h-4" />;
      case "lendario": return <Star className="w-4 h-4" />;
      case "superboss": return <Skull className="w-4 h-4" />;
      default: return <Swords className="w-4 h-4" />;
    }
  };

  // Vista de detalhes do desafio
  if (selectedChallenge) {
    return (
      <div className="flex flex-col h-full bg-background">
        {/* Animacao de transicao de duelo */}
        <AnimatePresence>
          {showTransition && (
            <motion.div
              className="fixed inset-0 z-[100] flex"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Lado Esquerdo - Jogador (Azul) */}
              <motion.div
                className="flex-1 flex items-center justify-center relative overflow-hidden"
                style={{ backgroundColor: "#1e3a8a" }}
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700" />
                <motion.div
                  className="relative z-10 flex flex-col items-center"
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  <img
                    src="/images/trainers/player.png"
                    alt="Jogador"
                    className="w-24 h-24 rounded-full border-4 border-white shadow-2xl object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/trainers/rival.png";
                    }}
                  />
                  <span className="mt-3 text-white font-bold text-lg tracking-wider">
                    {trainer.name || "JOGADOR"}
                  </span>
                  <span className="text-blue-200 text-xs uppercase tracking-widest">
                    Treinador
                  </span>
                </motion.div>
              </motion.div>

              {/* Raio Central */}
              <motion.div
                className="absolute left-1/2 top-0 bottom-0 w-4 -ml-2 z-20"
                style={{
                  background: "linear-gradient(180deg, #fbbf24 0%, #f59e0b 50%, #fbbf24 100%)",
                  clipPath: "polygon(50% 0%, 100% 10%, 80% 25%, 100% 40%, 70% 55%, 100% 70%, 80% 85%, 100% 100%, 0% 100%, 20% 85%, 0% 70%, 30% 55%, 0% 40%, 20% 25%, 0% 10%)"
                }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              />

              {/* VS Badge */}
              <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.7, type: "spring", damping: 10 }}
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center border-4 border-white shadow-2xl">
                  <span className="text-2xl font-black text-white drop-shadow-lg">VS</span>
                </div>
              </motion.div>

              {/* Lado Direito - Desafiante (Vermelho) */}
              <motion.div
                className="flex-1 flex items-center justify-center relative overflow-hidden"
                style={{ backgroundColor: "#991b1b" }}
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
              >
                <div className="absolute inset-0 bg-gradient-to-l from-red-900 to-red-700" />
                <motion.div
                  className="relative z-10 flex flex-col items-center"
                  initial={{ scale: 0, rotate: 45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  <img
                    src={selectedChallenge.imagem}
                    alt={selectedChallenge.nome}
                    className="w-24 h-24 rounded-full border-4 border-white shadow-2xl object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/trainers/rival.png";
                    }}
                  />
                  <span className="mt-3 text-white font-bold text-lg tracking-wider">
                    {selectedChallenge.nome}
                  </span>
                  <span className="text-red-200 text-xs uppercase tracking-widest">
                    {getNivelLabel(selectedChallenge.nivel)}
                  </span>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header do Email Aberto */}
        <div className="p-4 border-b border-border bg-card">
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedChallenge(null)}
              className="text-foreground hover:bg-secondary shrink-0"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
            </Button>
            <div
              className="w-12 h-12 rounded-full border-2 flex items-center justify-center shrink-0 overflow-hidden"
              style={{ borderColor: getNivelColor(selectedChallenge.nivel) }}
            >
              <img
                src={selectedChallenge.imagem}
                alt={selectedChallenge.nome}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/trainers/rival.png";
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-foreground text-sm truncate">
                {selectedChallenge.nome}
              </h2>
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-bold text-white"
                  style={{ backgroundColor: getNivelColor(selectedChallenge.nivel) }}
                >
                  {getNivelLabel(selectedChallenge.nivel)}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {selectedChallenge.time.length} Pokemon
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Corpo do Email */}
        <ScrollArea className="flex-1">
          <div className="p-4 flex flex-col gap-4">
            {/* Frase de Desafio */}
            <div className="bg-secondary/50 rounded-lg p-4 border border-border">
              <p className="text-sm text-foreground italic">
                "{selectedChallenge.fraseDesafio}"
              </p>
            </div>

            {/* Recompensas */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                Recompensas por Vitoria
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center gap-1 p-2 bg-secondary/50 rounded-lg">
                  <Coins className="w-5 h-5 text-amber-400" />
                  <span className="text-sm font-bold text-foreground">
                    ${selectedChallenge.recompensa}
                  </span>
                  <span className="text-[9px] text-muted-foreground">Dinheiro</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 bg-secondary/50 rounded-lg">
                  <Star className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-bold text-foreground">
                    {selectedChallenge.stardust}
                  </span>
                  <span className="text-[9px] text-muted-foreground">Stardust</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 bg-secondary/50 rounded-lg">
                  <Trophy className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm font-bold text-foreground">
                    {selectedChallenge.xp}
                  </span>
                  <span className="text-[9px] text-muted-foreground">XP</span>
                </div>
              </div>
            </div>

            {/* Time do Oponente */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                Equipe do Desafiante
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {selectedChallenge.time.map((pokemon, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-1 p-2 bg-secondary/30 rounded-lg"
                  >
                    <img
                      src={getSpriteUrl(pokemon.speciesId)}
                      alt={pokemon.nome}
                      width={48}
                      height={48}
                      className="pixelated"
                      crossOrigin="anonymous"
                    />
                    <span className="text-[10px] font-medium text-foreground truncate w-full text-center">
                      {pokemon.nome}
                    </span>
                    <span className="text-[9px] text-muted-foreground">
                      Lv.{pokemon.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Botao Aceitar Desafio */}
            <Button
              onClick={() => handleAcceptChallenge(selectedChallenge)}
              className="h-14 text-lg font-bold bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white shadow-lg"
            >
              <Swords className="w-6 h-6 mr-2" />
              ACEITAR DESAFIO!
            </Button>
          </div>
        </ScrollArea>
      </div>
    );
  }

  // Lista de Desafios (estilo Email)
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-foreground flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Caixa de Desafios
            </h2>
            <p className="text-xs text-muted-foreground">
              {challenges.length} desafios disponiveis
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground">Vitorias Semanais</p>
              <p className="text-sm font-bold text-foreground">{weeklyWins}/10</p>
            </div>
            {weeklyWins >= 10 && (
              <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Skull className="w-4 h-4 text-orange-500" />
              </div>
            )}
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col">
          {/* Boss Semanal (se disponivel) */}
          {weeklyBoss && (
            <button
              onClick={() => {
                playButtonClick();
                setSelectedChallenge(weeklyBoss);
              }}
              className="flex items-center gap-3 p-4 border-b border-border bg-gradient-to-r from-orange-500/10 to-red-500/10 hover:from-orange-500/20 hover:to-red-500/20 transition-all text-left"
            >
              <div className="relative">
                <div
                  className="w-12 h-12 rounded-full border-2 flex items-center justify-center shrink-0 overflow-hidden"
                  style={{ borderColor: getNivelColor(weeklyBoss.nivel) }}
                >
                  <img
                    src={weeklyBoss.imagem}
                    alt={weeklyBoss.nome}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/trainers/rival.png";
                    }}
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                  <Crown className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-orange-400 truncate">
                    {weeklyBoss.nome}
                  </span>
                  <span
                    className="text-[8px] px-1.5 py-0.5 rounded-full font-bold text-white shrink-0"
                    style={{ backgroundColor: getNivelColor(weeklyBoss.nivel) }}
                  >
                    BOSS
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground truncate">
                  {weeklyBoss.fraseDesafio}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] text-muted-foreground">
                    {weeklyBoss.time.length} Pokemon
                  </span>
                  <span className="text-[9px] text-amber-400 font-bold">
                    ${weeklyBoss.recompensa}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </button>
          )}

          {/* Lista de Desafios Normais */}
          {challenges.map((npc) => {
            const isRead = readChallenges.has(npc.id);
            return (
              <button
                key={npc.id}
                onClick={() => {
                  playButtonClick();
                  setSelectedChallenge(npc);
                }}
                className={`flex items-center gap-3 p-4 border-b border-border transition-all text-left ${
                  isRead
                    ? "bg-card hover:bg-secondary/50"
                    : "bg-primary/5 hover:bg-primary/10"
                }`}
              >
                <div className="relative">
                  <div
                    className="w-12 h-12 rounded-full border-2 flex items-center justify-center shrink-0 overflow-hidden"
                    style={{ borderColor: getNivelColor(npc.nivel) }}
                  >
                    <img
                      src={npc.imagem}
                      alt={npc.nome}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/trainers/rival.png";
                      }}
                    />
                  </div>
                  {!isRead && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {isRead ? (
                      <MailOpen className="w-3.5 h-3.5 text-muted-foreground" />
                    ) : (
                      <Mail className="w-3.5 h-3.5 text-primary" />
                    )}
                    <span
                      className={`font-medium text-sm truncate ${
                        isRead ? "text-muted-foreground" : "text-foreground"
                      }`}
                    >
                      {npc.nome}
                    </span>
                    <span
                      className="text-[8px] px-1.5 py-0.5 rounded-full font-bold text-white shrink-0"
                      style={{ backgroundColor: getNivelColor(npc.nivel) }}
                    >
                      {getNivelLabel(npc.nivel)}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                    {npc.fraseDesafio}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[9px] text-muted-foreground">
                        {npc.time.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Coins className="w-3 h-3 text-amber-400" />
                      <span className="text-[9px] text-amber-400 font-bold">
                        ${npc.recompensa}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-blue-400" />
                      <span className="text-[9px] text-blue-400">
                        {npc.stardust}
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </button>
            );
          })}

          {/* Empty State */}
          {challenges.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-6 gap-3">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
                <Mail className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Sem Desafios</h3>
              <p className="text-sm text-muted-foreground text-center">
                Nenhum treinador te desafiou ainda. Volte mais tarde!
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

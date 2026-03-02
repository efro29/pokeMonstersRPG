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
  Map,
  Inbox,
  Check,
  Clock,
  Activity,
} from "lucide-react";
import { playButtonClick, playBattleMusic } from "@/lib/sounds";
import { TrailsMode } from "./trails-mode";

export type DuelMode = "challenges" | "trails";

interface DuelTabProps {
  onStartDuel: (npc: DuelNpc) => void;
  onStartCapture?: (speciesId: number) => void;
  duelMode: DuelMode;
  onDuelModeChange: (mode: DuelMode) => void;
  onTrailNodeStart?: (nodeId: string) => void;
}

// Constante para o limite diario de desafios
const DAILY_CHALLENGE_LIMIT = 5;

// Funcao para obter a data atual formatada (para reset diario)
function getTodayKey(): string {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}

// Funcao para obter vitorias diarias do localStorage
function getDailyWins(): { date: string; wins: number } {
  if (typeof window === "undefined") return { date: getTodayKey(), wins: 0 };
  const stored = localStorage.getItem("pokerpg-daily-challenge-wins");
  if (stored) {
    try {
      const data = JSON.parse(stored);
      // Se a data mudou, reseta as vitorias
      if (data.date !== getTodayKey()) {
        return { date: getTodayKey(), wins: 0 };
      }
      return data;
    } catch {
      return { date: getTodayKey(), wins: 0 };
    }
  }
  return { date: getTodayKey(), wins: 0 };
}

// Funcao para salvar vitorias diarias no localStorage
function saveDailyWins(wins: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("pokerpg-daily-challenge-wins", JSON.stringify({
    date: getTodayKey(),
    wins
  }));
}

export function DuelTab({ onStartDuel, onStartCapture, duelMode, onDuelModeChange, onTrailNodeStart }: DuelTabProps) {
  const { trainer } = useGameStore();
  const [challenges, setChallenges] = useState<DuelNpc[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<DuelNpc | null>(null);
  const [showTransition, setShowTransition] = useState(false);
  const [weeklyBoss, setWeeklyBoss] = useState<DuelNpc | null>(null);
  const [weeklyWins, setWeeklyWins] = useState(0);
  const [readChallenges, setReadChallenges] = useState<Set<string>>(new Set());
  const [battleXp, setBattleXp] = useState(0);
  const [battleLevel, setBattleLevel] = useState(1);
  const [dailyChallengeWins, setDailyChallengeWins] = useState(0);

  // Verifica se o jogador completou todos os desafios diarios
  const dailyChallengesCompleted = dailyChallengeWins >= DAILY_CHALLENGE_LIMIT;

  // Calcula XP necessario para o proximo nivel de batalha
  const getXpForLevel = (level: number) => level * 500;
  const xpToNextLevel = getXpForLevel(battleLevel);
  const xpProgress = (battleXp / xpToNextLevel) * 100;

  // Gera desafios ao montar o componente
  useEffect(() => {
    // Carrega vitorias diarias
    const dailyData = getDailyWins();
    setDailyChallengeWins(dailyData.wins);

    // So gera novos desafios se ainda nao completou o limite diario
    const newChallenges = generateRandomChallenges(DAILY_CHALLENGE_LIMIT);
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

    // Carrega XP de batalha
    const storedBattleXp = localStorage.getItem("pokerpg-battle-xp");
    const storedBattleLevel = localStorage.getItem("pokerpg-battle-level");
    if (storedBattleXp) setBattleXp(parseInt(storedBattleXp));
    if (storedBattleLevel) setBattleLevel(parseInt(storedBattleLevel));
  }, []);

  // Recarrega as vitorias diarias quando o componente ganha foco ou muda o modo
  // Isso garante que o contador seja atualizado apos uma batalha
  useEffect(() => {
    const handleFocus = () => {
      const dailyData = getDailyWins();
      setDailyChallengeWins(dailyData.wins);
    };

    // Tambem verifica ao montar/re-renderizar e quando muda o modo
    handleFocus();

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [duelMode]);

  const handleAcceptChallenge = (npc: DuelNpc) => {
    playButtonClick();
    setShowTransition(true);
    
    // Inicia a musica de batalha imediatamente junto com a transicao
    playBattleMusic();
    
    // Marca como lido
    setReadChallenges(prev => new Set(prev).add(npc.id));
    
    // Aguarda 5 segundos na transicao antes de iniciar o duelo
    setTimeout(() => {
      onStartDuel(npc);
      setShowTransition(false);
      setSelectedChallenge(null);
    }, 5000);
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
  {/* Gradiente de Fundo Azul */}
  <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700" />

  {/* CAMADA DE PARTÍCULAS (ANIME SPEED LINES - SENTIDO OPOSTO) */}
  <div className="absolute inset-0 pointer-events-none">
    {[...Array(15)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute bg-white/20"
        style={{
          height: '2px',
          width: Math.random() * 100 + 50 + 'px',
          top: Math.random() * 100 + '%',
          right: '-20%', // Começa da direita para cruzar para a esquerda
        }}
        animate={{
          x: ['0vw', '-120vw'], // Move para a esquerda
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: Math.random() * 0.5 + 0.3,
          repeat: Infinity,
          ease: "linear",
          delay: Math.random() * 2,
        }}
      />
    ))}
  </div>

                    {/* CONTEÚDO PRINCIPAL (JOGADOR) */}
                    <motion.div
                      className="relative z-10 flex flex-col items-center"
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.3, type: "spring" }}
                    >
                      <div className="relative">
                        {/* Aura de Energia Azul */}
                        <motion.div 
                          className="absolute inset-0 rounded-full bg-blue-400/30 blur-xl"
                          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.8, 0.5] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        />
                        
                        <img
                        style={{width:800}}
                          src="/images/trainers/ash-unova.jpg"
                          alt="Jogador"
                          className="relative   object-cover z-10"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/images/trainers/ash-unova.jpg";
                          }}
                        />
                      </div>

                      <span className="mt-3 text-white font-bold text-lg tracking-wider drop-shadow-md">
                        {trainer.name || "JOGADOR"}
                      </span>
                      <span className="text-blue-200 text-xs uppercase tracking-widest font-black">
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
            
              </motion.div>

              {/* Lado Direito - Desafiante (Vermelho) */}
            <motion.div
  className="flex-1 flex items-center justify-center relative overflow-hidden"
  style={{ backgroundColor: "#991b1b" }}
  initial={{ x: "100%" }}
  animate={{ x: 0 }}
  transition={{ type: "spring", damping: 20, stiffness: 100 }}
>
  {/* Gradiente de Fundo */}
  <div className="absolute inset-0 bg-gradient-to-l from-red-900 to-red-700" />

  {/* CAMADA DE PARTÍCULAS (ANIME SPEED LINES) */}
  <div className="absolute inset-0 pointer-events-none">
    {[...Array(15)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute bg-white/20"
        style={{
          height: '2px',
          width: Math.random() * 100 + 50 + 'px', // Comprimento variado
          top: Math.random() * 100 + '%',        // Posição vertical aleatória
          left: '-20%',
        }}
        animate={{
          x: ['0vw', '120vw'], // Cruza a tela inteira
          opacity: [0, 1, 0],   // Surge e some
        }}
        transition={{
          duration: Math.random() * 0.5 + 0.3, // Velocidade alta e variada
          repeat: Infinity,
          ease: "linear",
          delay: Math.random() * 2,
        }}
      />
    ))}
  </div>

                {/* CONTEÚDO PRINCIPAL */}
                <motion.div
                  className="relative z-10 flex flex-col items-center"
                  initial={{ scale: 0, rotate: 45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  <div className="relative">
                    {/* Brilho pulsante atrás da imagem (aura) */}
                    <img
                    style={{width:800}}
                      src={selectedChallenge.imagem}
                      alt={selectedChallenge.nome}
                      className="    object-cover z-10"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/trainers/player.jpg";
                      }}
                    />
                  </div>

                  <span className="mt-3 text-white font-bold text-lg tracking-wider drop-shadow-md">
                    {selectedChallenge.nome}
                  </span>
                  <span className="text-red-200 text-xs uppercase tracking-widest font-black">
                    {getNivelLabel(selectedChallenge.nivel)}
                  </span>
                </motion.div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

<div className="relative p-4 bg-slate-900 border-b border-cyan-500/30 overflow-hidden">
  {/* Elemento de Background: Grid Gamer */}
  <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:10px_10px]" />

  <div className="flex items-center gap-4 relative z-10">
    {/* Botão de Voltar - Quadrado e Minimalista */}
    <Button
      size="icon"
      variant="ghost"
      onClick={() => setSelectedChallenge(null)}
      className="w-8 h-8 rounded-none border border-white/10 bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-400 hover:border-cyan-500/50 transition-all shrink-0"
    >
      <ChevronRight className="w-5 h-5 rotate-180" />
    </Button>

    {/* Frame do Avatar - Estilo Scan de Alvo */}
    <div className="relative group">
      <div 
        className="w-14 h-14 p-0.5" 
        style={{ 
          background: `linear-gradient(135deg, ${getNivelColor(selectedChallenge.nivel)}, transparent)`,
          clipPath: "polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%)" 
        }}
      >
        <div 
          className="w-full h-full bg-slate-950 overflow-hidden relative"
          style={{ clipPath: "polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%)" }}
        >
          <img
            src={selectedChallenge.imagem}
            alt={selectedChallenge.nome}
            className="w-full h-full object-cover  brightness-125  transition-all duration-500"
            onError={(e) => { (e.target as HTMLImageElement).src = "/images/trainers/player.jpg"; }}
          />
          {/* Scanline Overlay na foto */}
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />
        </div>
      </div>
      
      {/* Badge de Nível colada no frame */}
      <div 
        className="absolute -bottom-1 -right-1 px-1.5 py-0.5 text-[8px] font-black italic uppercase tracking-tighter text-white shadow-lg rotate-2"
        style={{ backgroundColor: getNivelColor(selectedChallenge.nivel) }}
      >
        RANK {selectedChallenge.nivel}
      </div>
    </div>

    {/* Informações Táticas do Oponente */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span className="text-[8px] font-black text-cyan-500 uppercase tracking-widest opacity-60">Identity Confirmed</span>
        <div className="h-[1px] flex-1 bg-cyan-500/20" />
      </div>
      
      <h2 className="font-black text-xl text-slate-100 uppercase italic tracking-tighter leading-none my-1 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">
        {selectedChallenge.nome}
      </h2>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_5px_#22d3ee]" />
          <span className="text-[10px] font-mono text-cyan-400 font-bold">
            {selectedChallenge.time.length} UNIT DETECTED
          </span>
        </div>
        <div className="h-3 w-px bg-white/10" />
        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
          {getNivelLabel(selectedChallenge.nivel)}
        </span>
      </div>
    </div>
  </div>

  {/* Detalhe de Canto Tático */}
  <div className="absolute top-0 right-0 w-12 h-12 pointer-events-none opacity-20">
    <div className="absolute top-2 right-2 w-full h-full border-t-2 border-r-2 border-cyan-500" />
  </div>
</div>

<ScrollArea className="flex-1 bg-slate-950">
  <div className="p-4 flex flex-col gap-6">
    
    {/* Frase de Desafio - Estilo Comms-Link */}
    <div className="relative group">
      <div className="absolute -left-2 top-0 bottom-0 w-1 bg-cyan-500 shadow-[0_0_10px_#22d3ee]" />
      <div className="bg-slate-900/50 p-4 border border-white/5 backdrop-blur-sm">
        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-500/50 block mb-2">Incoming Transmission</span>
        <p className="text-sm text-slate-200 italic font-medium leading-relaxed">
          "{selectedChallenge.fraseDesafio}"
        </p>
      </div>
    </div>

    {/* Recompensas - Estilo Loot Preview */}
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Victory Rewards</h3>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: Coins, val: selectedChallenge.recompensa, label: 'Credits', color: 'text-amber-400', bg: 'bg-amber-400/5' },
          { icon: Star, val: selectedChallenge.stardust, label: 'Dust', color: 'text-cyan-400', bg: 'bg-cyan-400/5' },
          { icon: Trophy, val: selectedChallenge.xp, label: 'Exp', color: 'text-emerald-400', bg: 'bg-emerald-400/5' }
        ].map((item, i) => (
          <div key={i} className={`${item.bg} border border-white/5 p-3 flex flex-col items-center group hover:border-white/20 transition-colors`}>
            <item.icon className={`w-5 h-5 ${item.color} mb-1 drop-shadow-[0_0_5px_currentColor]`} />
            <span className="text-sm font-black font-mono">{item.val}</span>
            <span className="text-[8px] uppercase font-bold text-slate-500 tracking-tighter">{item.label}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Time do Oponente - Estilo Squad Scan */}
    <div className="space-y-3">
      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
        <Activity className="w-3 h-3 text-red-500" /> Hostile Squad Detected
      </h3>
      
      <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
        {selectedChallenge.time.map((pokemon, index) => (
          <div
            key={index}
            className="relative flex flex-col items-center p-3 bg-slate-900 border border-white/5 overflow-hidden group hover:bg-slate-800/80 transition-all"
          >
            {/* Background Decorativo de Nível */}
            <div className="absolute top-0 right-0 px-1.5 py-0.5 bg-white/5 text-[8px] font-mono text-slate-500">
              LV.{pokemon.level}
            </div>
            
            <div className="relative w-16 h-16 mb-2">
              <img
                src={getSpriteUrl(pokemon.speciesId)}
                alt={pokemon.nome}
                className="w-full h-full object-contain pixelated relative z-10 group-hover:scale-110 transition-transform"
                crossOrigin="anonymous"
              />
              <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <span className="text-[10px] font-black uppercase tracking-tighter text-slate-300 w-full text-center truncate">
              {pokemon.nome}
            </span>
            
            {/* Barra de Vida Decorativa (Estilo HUD) */}
            <div className="w-full h-[2px] bg-slate-800 mt-2">
              <div className="w-full h-full bg-red-600/40" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</ScrollArea>

{/* Botao Aceitar Desafio - Estilo "SYSTEM OVERRIDE" */}
<div className="p-4 bg-slate-950 border-t border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
  <button
    onClick={() => handleAcceptChallenge(selectedChallenge)}
    className="group relative w-full h-16 bg-red-600 overflow-hidden transition-all active:scale-[0.98]"
  >
    {/* Efeito de Brilho que passa pelo botão */}
    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_2s_infinite] pointer-events-none" />
    
    <div className="relative z-10 flex items-center justify-center gap-3">
      <Swords className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
      <span className="text-xl font-black italic tracking-tighter text-white">
        INICIAR CONFRONTO
      </span>
    </div>

    {/* Detalhes nos cantos do botão */}
    <div className="absolute top-0 left-0 p-1">
      <div className="w-2 h-2 border-t-2 border-l-2 border-white/50" />
    </div>
    <div className="absolute bottom-0 right-0 p-1">
      <div className="w-2 h-2 border-b-2 border-r-2 border-white/50" />
    </div>
  </button>
</div>
      </div>
    );
  }

  // Trails Mode
  if (duelMode === "trails") {
    return (
      <TrailsMode
        onStartDuel={onStartDuel}
        onStartCapture={onStartCapture || (() => {})}
        onBack={() => onDuelModeChange("challenges")}
        onNodeStart={onTrailNodeStart}
      />
    );
  }

  // Lista de Desafios (estilo Email)
  return (
<div className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans italic-stats">
  {/* Mode Selector Tabs - Estilo HUD de Seleção */}
  <div className="flex p-1 bg-black/40 backdrop-blur-md border-b border-blue-500/30">
    {[
      { id: 'challenges', label: 'Desafios', icon: Swords },
      { id: 'trails', label: 'Trilhas', icon: Map }
    ].map((tab) => (
      <button
        key={tab.id}
        onClick={() => {
          playButtonClick();
          onDuelModeChange(tab.id as any);
        }}
        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 transition-all duration-300 relative overflow-hidden
          ${duelMode === tab.id ? "text-cyan-400" : "text-slate-500 hover:text-slate-300"}`}
      >
        <tab.icon className={`w-4 h-4 ${duelMode === tab.id ? "drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" : ""}`} />
        <span className="text-xs font-black uppercase tracking-[0.2em]">{tab.label}</span>
        
        {duelMode === tab.id && (
          <>
            <motion.div layoutId="tab-glow" className="absolute inset-0 bg-cyan-500/10" />
            <motion.div layoutId="duel-tab-indicator" className="absolute bottom-0 left-0 right-0 h-[3px] bg-cyan-400 shadow-[0_0_15px_#22d3ee]" />
          </>
        )}
      </button>
    ))}
  </div>

  {/* Header com Barras de Progresso Neon */}
  <div className="p-4 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-white/5">
    <div className="grid grid-cols-2 gap-4">
      {/* Daily Progress */}
      <div className="relative group">
        <div className="flex justify-between items-end mb-1 px-1">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Daily Mission</span>
          <span className="text-[10px] font-mono text-cyan-400">{dailyChallengeWins}/{DAILY_CHALLENGE_LIMIT}</span>
        </div>
        <div className="h-1.5 w-full bg-slate-800 rounded-none overflow-hidden border border-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-600 to-blue-400 shadow-[0_0_10px_#22d3ee]"
            initial={{ width: 0 }}
            animate={{ width: `${(dailyChallengeWins / DAILY_CHALLENGE_LIMIT) * 100}%` }}
          />
        </div>
      </div>

      {/* Battle Level */}
      <div className="relative group">
        <div className="flex justify-between items-end mb-1 px-1">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Battle Rank</span>
          <span className="text-[10px] font-mono text-purple-400">LV.{battleLevel}</span>
        </div>
        <div className="h-1.5 w-full bg-slate-800 rounded-none overflow-hidden border border-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-600 to-fuchsia-400 shadow-[0_0_10px_#a855f7]"
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress}%` }}
          />
        </div>
      </div>
    </div>
  </div>

  <ScrollArea className="flex-1 bg-slate-950">
    <div className="flex flex-col p-2 gap-2">
      
      {/* BOSS SEMANAL - Visual de "Alerta de Intruso" */}
      {weeklyBoss && (
        <button
          onClick={() => { playButtonClick(); setSelectedChallenge(weeklyBoss); }}
          className="relative group flex items-center gap-4 p-4 bg-red-950/20 border border-red-500/30 hover:border-red-500 transition-all overflow-hidden"
        >
          {/* Scanline Effect */}
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-10" />
          
          <div className="relative">
            <div className="w-14 h-14 bg-slate-800 border-2 border-red-500 rotate-3 group-hover:rotate-0 transition-transform duration-500 overflow-hidden">
              <img src={weeklyBoss.imagem} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-red-600 p-1 shadow-lg">
              <Crown className="w-3 h-3 text-white" />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-red-500 tracking-tighter">Emergency Event</span>
              <div className="h-[1px] flex-1 bg-red-500/30" />
            </div>
            <h3 className="text-lg font-black italic uppercase leading-none my-1">{weeklyBoss.nome}</h3>
            <div className="flex gap-3 mt-2">
              <span className="text-[10px] font-mono text-red-400/80">REWARD: ${weeklyBoss.recompensa}</span>
              <span className="text-[10px] font-mono text-red-400/80">SIZE: {weeklyBoss.time.length}PKM</span>
            </div>
          </div>
          <Zap className="w-5 h-5 text-red-500 animate-pulse" />
        </button>
      )}

      {/* LISTA DE DESAFIOS - Estilo "Data Logs" */}
      {!dailyChallengesCompleted && challenges.map((npc) => {
        const isRead = readChallenges.has(npc.id);
        return (
          <button
            key={npc.id}
            onClick={() => { playButtonClick(); setSelectedChallenge(npc); }}
            className={`group relative flex items-center gap-4 p-3 border-l-4 transition-all
              ${isRead 
                ? "bg-slate-900/40 border-slate-700 hover:bg-slate-800/60" 
                : "bg-blue-600/5 border-cyan-500 shadow-[inset_10px_0_20px_-10px_rgba(6,182,212,0.1)] hover:bg-blue-600/10"
              }`}
          >
            <div className="w-12 h-12 shrink-0 bg-slate-800 border border-white/10 overflow-hidden relative">
              <img src={npc.imagem} className={`w-full h-full object-cover ${!isRead ? "scale-110" : "opacity-60"}`} />
              {!isRead && <div className="absolute top-0 right-0 w-2 h-2 bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <span className={`text-xs font-bold uppercase tracking-tight truncate ${isRead ? "text-slate-500" : "text-slate-100"}`}>
                  {npc.nome}
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 border border-white/10 bg-black/40" 
                      style={{ color: getNivelColor(npc.nivel) }}>
                  LVL.{npc.nivel}
                </span>
              </div>
              
              <div className="flex gap-3 mt-2 opacity-70 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-1">
                  <Coins className="w-3 h-3 text-amber-500" />
                  <span className="text-[10px] font-mono">${npc.recompensa}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-cyan-400" />
                  <span className="text-[10px] font-mono">{npc.stardust}</span>
                </div>
              </div>
            </div>
            
            <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-cyan-400 transition-colors" />
          </button>
        );
      })}
    </div>
  </ScrollArea>
</div>
  );
}

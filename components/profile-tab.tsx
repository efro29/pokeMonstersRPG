"use client";

import { useState } from "react";
import { useGameStore, ATTRIBUTE_INFO, trainerXpForLevel, explorationXpForLevel, getTodayDateStr, getCurrentWeeklyEvent, getCurrentWeekKey, getWeekStartDate } from "@/lib/game-store";
import { getPokemon } from "@/lib/pokemon-data";
import { useModeStore } from "@/lib/mode-store";
import type { TrainerAttributes } from "@/lib/game-store";
import { KANTO_BADGE_ICONS, JOHTO_BADGE_ICONS } from "./badge-icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  User,
  MapPin,
  Coins,
  Plus,
  Minus,
  Shield,
  Award,
  Sparkles,
  Swords,
  Heart,
  EyeOff,
  Eye,
  Users,
  Star,
  ArrowUp,
  Trophy,
  Crosshair,
  Compass,
  Flame,
  Target,
  Gift,
  CheckCircle2,
  Circle,
  Calendar,
  Settings2,
  Info,
} from "lucide-react";
import { playBadgeObtained, playBadgeRemoved, playButtonClick } from "@/lib/sounds";
import { TrainerAvatar } from "@/components/trainer-avatar";

// Trainer class options
const TRAINER_CLASSES = [
  "Treinador Pokemon",
  "Ace Trainer",
  "Bug Catcher",
  "Lass",
  "Youngster",
  "Hiker",
  "Fisherman",
  "Swimmer",
  "Psychic",
  "Rocket Grunt",
  "Ranger",
  "Breeder",
];

const ATTR_ICONS: Record<keyof TrainerAttributes, React.ReactNode> = {
  combate: <Swords className="w-4 h-4" />,
  afinidade: <Heart className="w-4 h-4" />,
  sorte: <Sparkles className="w-4 h-4" />,
  furtividade: <EyeOff className="w-4 h-4" />,
  percepcao: <Eye className="w-4 h-4" />,
  carisma: <Users className="w-4 h-4" />,
};

export function ProfileTab() {
  const { trainer, updateTrainer, updateAttributes, addMoney, toggleBadge, toggleJohtoBadge, addTrainerXp, setTrainerLevel, damageTrainer, healTrainer, recalcTrainerStats } = useGameStore();
  const { profiles, activeProfileId } = useModeStore();
  const activeProfile = profiles.find((p) => p.id === activeProfileId);
  const [editing, setEditing] = useState(!trainer.name);
  const [moneyDialog, setMoneyDialog] = useState(false);
  const [moneyAmount, setMoneyAmount] = useState("");
  const [xpDialog, setXpDialog] = useState(false);
  const [xpAmount, setXpAmount] = useState("");
  const [hpDialog, setHpDialog] = useState(false);
  const [hpAmount, setHpAmount] = useState("");
  const [hpMode, setHpMode] = useState<"damage" | "heal">("damage");
  const [levelDialog, setLevelDialog] = useState(false);
  const [levelInput, setLevelInput] = useState("");
  const [editForm, setEditForm] = useState({
    name: trainer.name,
    age: trainer.age,
    hometown: trainer.hometown,
    trainerClass: trainer.trainerClass,
  });

  const handleSave = () => {
    updateTrainer(editForm);
    setEditing(false);
  };

  const economyLocked = useModeStore((s) => s.economyLocked);

  const handleAddMoney = () => {
    if (economyLocked) return;
    const amount = parseInt(moneyAmount);
    if (amount > 0) {
      addMoney(amount);
      setMoneyAmount("");
      setMoneyDialog(false);
    }
  };

  const kantoBadgesObtained = trainer.badges.filter((b) => b.obtained).length;
  const johtoBadgesObtained = (trainer.johtoBadges || []).filter((b) => b.obtained).length;
  const totalPoints = Object.values(trainer.attributes || {}).reduce((sum, v) => sum + v, 0);

  const handleAttrChange = (attr: keyof TrainerAttributes, delta: number) => {
    const current = trainer.attributes?.[attr] ?? 0;
    const newVal = Math.max(0, Math.min(10, current + delta));
    updateAttributes({ [attr]: newVal });
    playButtonClick();
  };

  const handleBadgeToggle = (badgeId: string, isObtained: boolean, region: "kanto" | "johto") => {
    if (region === "kanto") {
      toggleBadge(badgeId);
    } else {
      toggleJohtoBadge(badgeId);
    }
    if (!isObtained) playBadgeObtained();
    else playBadgeRemoved();
  };

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-2 p-2">
                    <div className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ backgroundImage: `linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)`, backgroundSize: '30px 30px' }} 
      />

        {/* Trainer Card */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          
          <div className="relative bg-gradient-to-r from-primary/20 to-accent/20 p-4 ">
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-card/80 backdrop-blur-sm rounded-full px-3 py-1">
              <Award className="w-3 h-3 text-accent" />
              <span className="text-xs font-medium text-accent">
                {kantoBadgesObtained + johtoBadgesObtained}/16
              </span>
            </div>
            <div

              onClick={() => {
                setEditForm({
                  name: trainer.name,
                  age: trainer.age,
                  hometown: trainer.hometown,
                  trainerClass: trainer.trainerClass,
                });
                setEditing(true);
              }}

              className="flex items-center gap-4">
              {activeProfile ? (
                <TrainerAvatar avatarId={activeProfile.avatarId} size={64} />
              ) : (
                <div className="w-16 h-16 rounded-full bg-secondary border-2 border-border flex items-center justify-center">
                  <User className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  {trainer.name || "Novo Treinador"}
                </h2>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Shield className="w-3 h-3" />
                  <span className="text-xs">{trainer.trainerClass}</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <Compass className="w-3 h-3 text-emerald-400" />
                  <span className="text-[10px] font-semibold text-emerald-400">
                    Explorador Nivel {trainer.explorationLevel ?? 1}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{trainer.hometown || "Desconhecida"}</span>
              </div>
              {trainer.age && (
                <span className="text-xs text-muted-foreground">{trainer.age} anos</span>
              )}
            </div>

              {/* Exploration Level & XP - Scout Radar Version */}
              <div className="relative overflow-hidden bg-slate-950/90 border-l-4 border-emerald-500 shadow-[8px_0_15px_-5px_rgba(16,185,129,0.2)] rounded-r-xl group">
                
                {/* Header de Missão */}
                <div className="px-3 py-2 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="relative flex items-center justify-center">
                      <Compass className="w-4 h-4 text-emerald-400 animate-[spin_4s_linear_infinite]" />
                      <div className="absolute inset-0 blur-sm bg-emerald-500/40 animate-pulse" />
                    </div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 italic">
                      Exploration_Module
                    </h3>
                  </div>
                  <div className="flex items-baseline gap-1 bg-black/40 px-2 py-0.5 border border-emerald-500/30 rounded-sm">
                    <span className="text-[8px] font-bold text-emerald-500/60 uppercase">Rank</span>
                    <span className="text-xs font-mono font-black text-emerald-400">
                      {trainer.explorationLevel ?? 1}
                    </span>
                  </div>
                </div>

                <div className="p-3">
                  {/* XP Info Display */}
                  <div className="flex justify-between items-end mb-2 px-0.5">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-emerald-500/40 uppercase tracking-tighter">Current_Data_Sync</span>
                      <span className="text-sm font-mono font-black text-white">
                        {(trainer.explorationXp ?? 0).toLocaleString()} <span className="text-[9px] text-emerald-500/50">XP</span>
                      </span>
                    </div>
                    {/* Mini Radar Pulse Decorator */}
                    <div className="flex gap-1 mb-1">
                      <div className="w-1 h-1 bg-emerald-500 animate-ping rounded-full" />
                      <div className="w-1 h-1 bg-emerald-500/40 rounded-full" />
                      <div className="w-1 h-1 bg-emerald-500/20 rounded-full" />
                    </div>
                  </div>

                  {/* Barra de XP Estilo "Recon Scan" */}
                  {(() => {
                    const currentLevel = trainer.explorationLevel ?? 1;
                    const currentXp = trainer.explorationXp ?? 0;
                    const xpCurrent = explorationXpForLevel(currentLevel);
                    const xpNext = explorationXpForLevel(currentLevel + 1);
                    const xpPercent = Math.min(100, ((currentXp - xpCurrent) / (xpNext - xpCurrent)) * 100);
                    
                    return (
                      <div className="space-y-1.5">
                        <div className="relative h-2 bg-black/60 border border-emerald-500/20 rounded-sm overflow-hidden p-[1px]">
                          {/* Linhas de grade de fundo para dar aspecto técnico */}
                          <div className="absolute inset-0 flex justify-between px-2 opacity-20 pointer-events-none">
                              {[...Array(5)].map((_, i) => <div key={i} className="w-[1px] h-full bg-emerald-500" />)}
                          </div>
                          
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.6)] relative"
                            style={{ width: `${xpPercent}%` }}
                          >
                              {/* Efeito de brilho na ponta da barra */}
                              <div className="absolute right-0 top-0 bottom-0 w-1 bg-white shadow-[0_0_8px_white]" />
                          </div>
                        </div>
                        
                        <div className="flex justify-between text-[8px] font-mono font-bold text-emerald-500/60 uppercase italic">
                          <span>Sector_{currentLevel}</span>
                          <span>Next_Node: {xpNext.toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Dica de Jogo com Estilo de Log de Sistema */}
                  <div className="mt-3 py-1.5 px-2 bg-emerald-500/5 border-t border-emerald-500/10 flex gap-2 items-start group-hover:bg-emerald-500/10 transition-colors">
                    <div className="w-1 h-1 bg-emerald-400 mt-1 shrink-0 shadow-[0_0_4px_#10B981]" />
                    <p className="text-[9px] text-emerald-200/60 leading-tight font-medium">
                      CAPTURA COM RADAR DETECTADA: Bônus de eficiência aplicado para arremessos precisos.
                    </p>
                  </div>
                </div>
              </div>
            {/* Daily Streak - Ignition HUD Version (Fixed) */}
            {(() => {
              const streak = trainer.dailyStreak ?? 0;
              const lastDate = trainer.lastCaptureDate ?? null;
              const today = getTodayDateStr();
              const capturedToday = lastDate === today;

              const nextMilestone = Math.ceil((streak + 1) / 30) * 30;
              const milestoneProgress = streak % 30;
              const milestonePercent = (milestoneProgress / 30) * 100;

              const weekStart = trainer.weekStartDate || getWeekStartDate();
              const daysIntoCycle: number[] = [];
              for (let i = 0; i < 7; i++) {
                const checkDate = new Date(weekStart + "T12:00:00");
                checkDate.setDate(checkDate.getDate() + i);
                const checkDateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, "0")}-${String(checkDate.getDate()).padStart(2, "0")}`;
                daysIntoCycle.push(checkDateStr === lastDate ? 1 : 0);
              }
              
              const d = new Date();
              const dayOfWeek = d.getDay();
              const currentDayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

              let streakActive = capturedToday;
              if (!capturedToday && lastDate) {
                const last = new Date(lastDate + "T12:00:00");
                const now = new Date(today + "T12:00:00");
                const diffDays = Math.round((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
                if (diffDays === 1) streakActive = true;
              }

              // Cores dinâmicas baseadas no estado
              const statusColorClass = !streakActive && streak > 0 ? "text-red-500" : "text-orange-500";
              const statusBorderClass = !streakActive && streak > 0 ? "border-red-500/40" : "border-orange-500/40";

              return (
                <div className="relative overflow-hidden bg-slate-950 border border-white/10 rounded-xl shadow-2xl">
                  {/* Header com Status de Ignição */}
                  <div className="flex items-center justify-between px-3 py-2 bg-white/[0.03] border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <Flame className={`w-4 h-4 ${statusColorClass} drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]`} />
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white italic">Ofensivas</h3>
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      <div className={`px-1.5 py-0.5 rounded-sm text-[8px] font-black uppercase border ${
                        capturedToday ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400" : "bg-red-500/10 border-red-500/40 text-red-400 animate-pulse"
                      }`}>
                        {capturedToday ? "Synced" : "Warning"}
                      </div>
                      <div className={`bg-black/60 px-2 py-0.5 border ${statusBorderClass} rounded-sm flex items-center gap-1`}>
                        <span className="text-xs font-mono font-black text-white">{streak}</span>
                        <span className="text-[8px] font-bold text-orange-500 uppercase italic">D</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 space-y-4">
                    {/* Weekly Micro-Tracker */}
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: 7 }).map((_, i) => {
                        const active = daysIntoCycle[i] === 1;
                        const isToday = i === currentDayOfWeek;
                        
                        return (
                          <div key={i} className="flex flex-col items-center gap-1">
                            <div 
                              className={`w-full h-5 rounded-sm border transition-all duration-300 relative ${
                                active 
                                  ? "bg-orange-500/20 border-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.2)]" 
                                  : isToday ? "bg-white/5 border-white/20 border-dashed" : "bg-white/[0.02] border-white/5"
                              }`}
                            >
                              {active && <div className="absolute inset-0 flex items-center justify-center"><div className="w-0.5 h-2 bg-orange-400 rounded-full animate-pulse" /></div>}
                            </div>
                            <span className={`text-[7px] font-black uppercase ${isToday ? "text-orange-400" : "text-white/30"}`}>
                              {["S", "T", "Q", "Q", "S", "S", "D"][i]}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Milestone Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-end px-0.5">
                        <span className="text-[8px] font-black text-white/40 uppercase tracking-widest italic">Dias</span>
                        <span className="text-[9px] font-mono font-bold text-orange-400">{milestoneProgress} <span className="text-white/20">/</span> 30</span>
                      </div>
                      
                      <div className="h-1.5 bg-black/60 rounded-full border border-white/5 overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-orange-600 to-yellow-400 transition-all duration-1000" 
                            style={{ width: `${milestonePercent}%` }} 
                        />
                      </div>
                    </div>

                    {/* Alerta de captura pendente */}
                    {!capturedToday && (
                      <div className="flex items-center gap-2 p-1.5 bg-red-500/5 border border-red-500/10 rounded-md">
                        <div className="w-1 h-1 bg-red-500 rounded-full animate-ping" />
                        <p className="text-[8px] font-bold text-red-400/80 uppercase tracking-tighter">
                          Ação Necessária: Capture um Pokémon para estabilizar.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

{/* Weekly Event - Tactical Operation HUD */}
        {(() => {
          const event = getCurrentWeeklyEvent();
          const weekKey = getCurrentWeekKey();
          const progress = trainer.weeklyEventProgress;
          const isCurrentWeek = progress?.weekKey === weekKey && progress?.eventId === event.id;
          const missionProgress = isCurrentWeek ? (progress?.missionProgress ?? {}) : {};
          const allCompleted = isCurrentWeek ? (progress?.completed ?? false) : false;
          const rewardClaimed = isCurrentWeek ? (progress?.rewardClaimed ?? false) : false;
          const rewardPokemon = getPokemon(event.rewardPokemonId);
          const claimReward = useGameStore.getState().claimWeeklyEventReward;

          return (
            <div className="relative overflow-hidden bg-slate-950 border border-cyan-500/30 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.1)]">
              {/* Decoração de Canto (Triângulo de Interface) */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/5 [clip-path:polygon(100%_0,0_0,100%_100%)] pointer-events-none" />

              {/* Header Estilo Missão */}
              <div className="flex items-center justify-between px-3 py-2 bg-cyan-500/10 border-b border-cyan-500/20">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    <div className="absolute inset-0 blur-sm bg-cyan-400/50 animate-pulse" />
                  </div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100 italic">
                    Op_Weekly.sys
                  </h3>
                </div>
                <span className="text-[9px] font-mono font-bold text-cyan-500/70 bg-black/40 px-1.5 rounded border border-cyan-500/20">
                  {weekKey}
                </span>
              </div>

              {/* Título do Evento - Scanner Box */}
              <div className="p-3">
                <div className="relative flex items-center gap-2 px-3 py-2 bg-cyan-950/40 border-l-2 border-cyan-400 mb-4 overflow-hidden">
                  <Target className="w-4 h-4 text-cyan-300 animate-pulse" />
                  <div className="flex flex-col">
                    <span className="text-[7px] font-black text-cyan-500/60 uppercase tracking-tighter">Objetivo Principal</span>
                    <span className="text-xs font-black text-white uppercase tracking-tight">{event.title}</span>
                  </div>
                  {/* Efeito de scan line */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent w-1/2 -skew-x-12 animate-[move_3s_infinite]" />
                </div>

                {/* Missões Estilo Checkpoint */}
                <div className="space-y-3 mb-4">
                  {event.missions.map((mission) => {
                    const current = missionProgress[mission.id] ?? 0;
                    const done = current >= mission.target;
                    const pct = Math.min(100, (current / mission.target) * 100);
                    
                    return (
                      <div key={mission.id} className="group/mission">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className={`w-3.5 h-3.5 flex items-center justify-center rounded-sm border ${
                            done ? "bg-emerald-500 border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-black/40 border-white/20"
                          }`}>
                            {done && <CheckCircle2 className="w-2.5 h-2.5 text-black" />}
                          </div>
                          <span className={`text-[10px] font-bold flex-1 tracking-tight ${done ? "text-emerald-400 italic opacity-60" : "text-slate-200"}`}>
                            {mission.description}
                          </span>
                          <span className="text-[9px] font-mono font-black text-cyan-400">
                            {Math.min(current, mission.target)}<span className="text-white/20">/</span>{mission.target}
                          </span>
                        </div>
                        {/* Barra de Progresso Segmentada (Gamer Style) */}
                        <div className="ml-5 h-1 flex gap-0.5 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-700 ${done ? "bg-emerald-500" : "bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.4)]"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Seção de Recompensas - Loot Box Style */}
                <div className="pt-3 border-t border-white/5">
                  <div className="flex items-center gap-1.5 mb-2 px-1">
                    <Gift className="w-3 h-3 text-amber-400" />
                    <span className="text-[9px] font-black uppercase text-amber-400/80 tracking-widest">Recompensas de Missão</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 rounded text-amber-400 text-[9px] font-bold italic">
                      $ {event.rewardMoney.toLocaleString("pt-BR")}
                    </div>
                    {event.rewardItems.map((item, i) => (
                      <div key={i} className="flex items-center gap-1 px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/30 rounded text-cyan-300 text-[9px] font-bold italic">
                        {item.itemName} <span className="text-white/40 font-mono">x{item.quantity}</span>
                      </div>
                    ))}
                    {rewardPokemon && (
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-purple-500/10 border border-purple-500/30 rounded text-purple-400 text-[9px] font-black italic uppercase">
                        {rewardPokemon.name} <span className="text-[8px] opacity-60">NV.{event.rewardPokemonLevel}</span>
                      </div>
                    )}
                  </div>

                  {/* Botão de Resgate - Estilo Retro-Gamer */}
                  {allCompleted && !rewardClaimed && (
                    <button
                      onClick={() => claimReward()}
                      className="w-full py-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-sm transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Gift className="w-3.5 h-3.5" />
                      Resgatar Recompensas
                    </button>
                  )}

                  {rewardClaimed && (
                    <div className="flex items-center justify-center gap-2 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span className="text-[9px] font-black uppercase tracking-widest italic">Status: Finalizado</span>
                    </div>
                  )}

                  {!allCompleted && (
                    <div className="flex items-center justify-center gap-1.5 opacity-40 italic">
                      <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
                        Aguardando conclusão de todos os objetivos...
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
})()}

            {/* <div className="flex items-center justify-between bg-secondary/50 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium text-foreground">Dinheiro</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold font-mono text-accent">
                  {"$"}{trainer.money.toLocaleString("pt-BR")}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setMoneyDialog(true)}
                  className="h-7 w-7 p-0 border-border text-foreground bg-transparent hover:bg-secondary"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div> */}

            {/* <Button
              onClick={() => {
                setEditForm({
                  name: trainer.name,
                  age: trainer.age,
                  hometown: trainer.hometown,
                  trainerClass: trainer.trainerClass,
                });
                setEditing(true);
              }}
              variant="outline"
              className="border-border text-foreground bg-transparent hover:bg-secondary"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Editar Ficha
            </Button> */}
          </div>
        </div>
{/* Trainer RPG Status - Gamer Elite HUD */}
<div className="relative overflow-hidden bg-slate-950 border-l-4 border-primary shadow-[10px_0_20px_-10px_rgba(var(--primary),0.3)] rounded-r-2xl">
  
  {/* Header Estilizado com "Glow" */}
  <div className="px-4 py-3 bg-gradient-to-r from-primary/20 via-primary/5 to-transparent border-b border-white/10 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="relative">
        <Star className="w-5 h-5 text-primary animate-pulse" />
        <div className="absolute inset-0 blur-sm bg-primary/50 animate-pulse" />
      </div>
      <h3 className="font-black text-xs uppercase tracking-[0.2em] text-white italic">
        Trainer_Status.exe
      </h3>
    </div>
    <div className="flex items-center gap-2 bg-black/60 px-3 py-1 border border-primary/50 skew-x-[-12deg]">
      <span className="text-[10px] font-black text-primary uppercase skew-x-[12deg]">LVL</span>
      <span className="text-sm font-mono font-black text-white skew-x-[12deg]">{trainer.level ?? 1}</span>
    </div>
  </div>

  <div className="p-4 flex flex-col gap-4">
    
    {/* Grid Compacto */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      
      {/* CARD DE XP - NEON STYLE */}
      <div className="relative group bg-slate-900/50 p-3 border border-white/5 rounded-lg overflow-hidden">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[9px] font-black text-primary/70 uppercase tracking-widest">Experience_Log</span>
          <div className="flex gap-1">
             <button 
                onClick={() => { setLevelInput(String(trainer.level ?? 1)); setLevelDialog(true); }}
                className="p-1 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors"
             >
                <Settings2 className="w-3 h-3" />
             </button>
             <button 
                onClick={() => setXpDialog(true)}
                className="px-2 py-0.5 bg-primary text-black text-[9px] font-black uppercase hover:brightness-125 transition-all"
             >
                + XP
             </button>
          </div>
        </div>
        
        <div className="text-lg font-mono font-black text-white mb-2 leading-none">
          {(trainer.xp ?? 0).toLocaleString()} <span className="text-primary/50 text-[10px]">XP</span>
        </div>

        {/* Barra de XP Gamer (Segmentada) */}
        {(() => {
          const currentLevel = trainer.level ?? 1;
          const currentXp = trainer.xp ?? 0;
          const xpCurrent = trainerXpForLevel(currentLevel);
          const xpNext = trainerXpForLevel(currentLevel + 1);
          const xpPercent = Math.min(100, ((currentXp - xpCurrent) / (xpNext - xpCurrent)) * 100);
          return (
            <div className="relative h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-primary transition-all duration-1000 shadow-[0_0_15px_rgba(var(--primary),0.8)]" 
                style={{ width: `${xpPercent}%` }} 
              />
            </div>
          );
        })()}
      </div>

      {/* CARD DE COMBATE - BATTLE HUD */}
      <div className="bg-slate-900/50 p-3 border border-white/5 rounded-lg space-y-3">
        {/* HP Bar Style Jogo de Luta */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[9px] font-black uppercase">
            <div className="flex items-center gap-1 text-red-500">
              <Heart className="w-3 h-3 fill-current" />
              <span>Vitality</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setHpMode("damage"); setHpAmount(""); setHpDialog(true); }} className="text-red-400 hover:text-red-200 underline decoration-red-500/50">DMG</button>
              <button onClick={() => { setHpMode("heal"); setHpAmount(""); setHpDialog(true); }} className="text-emerald-400 hover:text-emerald-200 underline decoration-emerald-500/50">HEAL</button>
            </div>
          </div>
          
          <div className="relative h-4 bg-black/60 border border-white/10 group">
            <div 
              className="h-full bg-gradient-to-r from-red-600 via-red-500 to-orange-400 transition-all duration-500 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]" 
              style={{ 
                width: `${((trainer.currentHp ?? 20) / (trainer.maxHp ?? 20)) * 100}%`,
                clipPath: "polygon(0 0, 100% 0, 98% 100%, 0 100%)"
              }} 
            />
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white italic tracking-tighter drop-shadow-md">
              {trainer.currentHp ?? 20} <span className="text-white/40 mx-1">/</span> {trainer.maxHp ?? 20}
            </span>
          </div>
        </div>

        {/* DEFESA - TACTICAL SHIELD */}
        <div className="flex items-center justify-between bg-blue-500/5 border border-blue-500/20 p-2 rounded-sm">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.5)]" />
            <span className="text-[10px] font-black uppercase text-blue-200/70 tracking-tighter text-foreground">Armor_Class</span>
          </div>
          <span className="text-xl font-black font-mono text-blue-400 italic">
            {trainer.defesa ?? 10}
          </span>
        </div>
      </div>
    </div>

    {/* Footer Minimalista */}
    <div className="flex items-center gap-2 px-1 opacity-50">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <p className="text-[8px] font-bold text-white uppercase tracking-[0.3em]">Scalable_Systems_Active</p>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  </div>
</div>

{/* Attributes Section - Cyberpunk HUD Version */}
      <div className="relative group overflow-hidden bg-slate-950/80  rounded border-primary/40 rounded-br-3xl shadow-[5px_5px_0px_0px_rgba(var(--primary),0.2)]">
        
        {/* Header Estilizado (Corte diagonal fake) */}
        <div className="relative flex items-center justify-between px-3 py-1.5 bg-primary/20 border-b border-primary/30">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-primary animate-pulse" /> {/* Detalhe de luz */}
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-foreground italic">
              Systems.Attributes
            </h3>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-bold text-primary/70 uppercase">Available</span>
            <span className="text-xs font-mono font-black text-primary drop-shadow-[0_0_5px_rgba(var(--primary),0.8)]">
              {totalPoints}P
            </span>
          </div>
        </div>

        <div className="p-3 grid grid-cols-2 gap-x-4 gap-y-3">
          {(Object.keys(ATTRIBUTE_INFO) as (keyof TrainerAttributes)[]).map((attr) => {
            const value = trainer.attributes?.[attr] ?? 0;
            const info = ATTRIBUTE_INFO[attr];

            return (
              <div key={attr} className="relative group/item">
                {/* Label e Valor com Fonte Estilizada */}
                <div className="flex justify-between items-end mb-1 px-0.5">
                  <span className="text-[8px] font-black uppercase text-primary/60 tracking-wider">
                    {info.name}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-white leading-none">
                    {value.toString().padStart(2, '0')}
                  </span>
                </div>

                {/* Controle HUD */}
                <div className="flex items-center gap-1.5 bg-slate-900/50 p-1 rounded-sm border border-white/5 shadow-inner">
                  <button
                    onClick={() => handleAttrChange(attr, -1)}
                    disabled={value <= 0}
                    className="w-4 h-4 flex items-center justify-center bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white disabled:opacity-10 transition-all rounded-[2px]"
                  >
                    <Minus className="w-2.5 h-2.5" />
                  </button>
                  
                  {/* Barra de Segmentos (Estilo "Energy Bar") */}
                  <div className="flex-1 flex gap-[2px] h-2">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 transition-all duration-300 ${
                          i < value 
                            ? "bg-primary shadow-[0_0_5px_rgba(var(--primary),0.5)] scale-y-110" 
                            : "bg-white/5"
                        }`}
                        style={{
                          clipPath: "polygon(20% 0%, 100% 0%, 80% 100%, 0% 100%)" // Inclinação gamer
                        }}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => handleAttrChange(attr, 1)}
                    disabled={value >= 10}
                    className="w-4 h-4 flex items-center justify-center bg-primary/20 text-primary hover:bg-primary hover:text-black disabled:opacity-10 transition-all rounded-[2px]"
                  >
                    <Plus className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer com Decorador Técnico */}
        <div className="px-3 py-1 bg-white/5 flex justify-between items-center border-t border-white/5">
          <div className="flex gap-3 text-[7px] font-black text-white/40 tracking-tighter uppercase">
            <span className="hover:text-primary transition-colors cursor-help">CBT: ROLL+1/2P</span>
            <span className="hover:text-primary transition-colors cursor-help">LUK: CRIT+</span>
            <span className="hover:text-primary transition-colors cursor-help">AFN: +3HP/P</span>
          </div>
          <div className="w-2 h-2 bg-primary/40 rotate-45 animate-bounce" />
        </div>
      </div>
        {/* Kanto Badges */}
        <BadgeRegionCard
          title="Kanto"
          badges={trainer.badges}
          iconMap={KANTO_BADGE_ICONS}
          obtained={kantoBadgesObtained}
          region="kanto"
          onToggle={handleBadgeToggle}
          gradientFrom="#DC2626"
          gradientTo="#991B1B"
        />

        {/* Johto Badges */}
        <BadgeRegionCard
          title="Johto"
          badges={trainer.johtoBadges || []}
          iconMap={JOHTO_BADGE_ICONS}
          obtained={johtoBadgesObtained}
          region="johto"
          onToggle={handleBadgeToggle}
          gradientFrom="#2563EB"
          gradientTo="#1E40AF"
        />

        {/* Edit Trainer Dialog */}
        <Dialog open={editing} onOpenChange={setEditing}>
          <DialogContent 
            className="max-w-[320px] mx-auto border-2 bg-[#0a0a14] p-0 overflow-hidden"
            style={{ borderColor: "#22d3ee" }}
          >
            {/* Header Estreito Estilo HUD */}
            <div className="bg-cyan-500/10 border-b border-cyan-500/30 px-4 py-3 flex justify-between items-center">
              {/* O DialogTitle resolve o erro do Console e mantém o estilo */}
              <DialogTitle className="font-pixel text-[10px] tracking-widest text-cyan-400">
                EDIT_TRAINER_DATA
              </DialogTitle>
              
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-cyan-500 animate-pulse" />
                <div className="w-1.5 h-1.5 bg-cyan-500/30" />
              </div>
            </div>

            <div className="p-5 flex flex-col gap-4 relative z-10">
              {/* Campo: Nome */}
              <div className="space-y-1">
                <label className="text-[8px] font-pixel text-cyan-500/50 uppercase">Name_String</label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="h-9 bg-black/40 border-cyan-500/20 text-white text-xs font-mono rounded-none focus-visible:ring-1 focus-visible:ring-cyan-500"
                />
              </div>

              {/* Grid: Idade e Cidade */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[8px] font-pixel text-cyan-500/50 uppercase">Age_Cycle</label>
                  <Input
                    value={editForm.age}
                    onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                    className="h-9 bg-black/40 border-cyan-500/20 text-white text-xs font-mono rounded-none focus-visible:ring-1 focus-visible:ring-cyan-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-pixel text-cyan-500/50 uppercase">Home_Sector</label>
                  <Input
                    value={editForm.hometown}
                    onChange={(e) => setEditForm({ ...editForm, hometown: e.target.value })}
                    className="h-9 bg-black/40 border-cyan-500/20 text-white text-xs font-mono rounded-none focus-visible:ring-1 focus-visible:ring-cyan-500"
                  />
                </div>
              </div>

              {/* Selector: Classe */}
              <div className="space-y-2">
                <label className="text-[8px] font-pixel text-cyan-500/50 uppercase">Specialization</label>
                <div className="flex flex-wrap gap-1.5">
                  {TRAINER_CLASSES.map((cls) => (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => setEditForm({ ...editForm, trainerClass: cls })}
                      className={`text-[9px] px-2 py-1 border transition-all ${
                        editForm.trainerClass === cls
                          ? "bg-cyan-500 text-black border-cyan-400"
                          : "bg-white/5 text-white/40 border-white/10 hover:border-cyan-500/40"
                      }`}
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              </div>

              {/* Botão de Ação */}
              <Button 
                onClick={handleSave} 
                className="w-full mt-2 font-pixel text-[10px] h-10 rounded-none bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)] border-none"
              >
                SAVE_CHANGES_
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit XP Dialog */}
        <Dialog open={xpDialog} onOpenChange={setXpDialog}>
          <DialogContent 
            className="max-w-[320px] mx-auto border-2 bg-[#0a0a14] p-0 overflow-hidden"
            style={{ borderColor: "#10b981" }} // Cor Esmeralda para XP
          >
            {/* Cabeçalho Estilo HUD */}
            <div className="bg-emerald-500/10 border-b border-emerald-500/30 px-4 py-3 flex justify-between items-center">
              <DialogTitle className="font-pixel text-[10px] tracking-widest text-emerald-400 uppercase">
                PROTOCOLO_DE_EXPERIENCIA
              </DialogTitle>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 animate-pulse" />
              </div>
            </div>

            <div className="p-5 flex flex-col gap-4 relative z-10">
              <p className="text-[9px] font-pixel text-emerald-500/60 uppercase tracking-tighter">
                Selecione a carga de XP para o treinador:
              </p>

              {/* Grade de Valores Rápidos */}
              <div className="grid grid-cols-3 gap-2">
                {[50, 100, 250, 500, 1000].map((val) => (
                  <button
                    key={val}
                    onClick={() => setXpAmount(String(val))}
                    className={`font-mono text-[10px] py-1.5 border transition-all ${
                      xpAmount === String(val)
                        ? "bg-emerald-500 text-black border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                        : "bg-white/5 text-emerald-500/50 border-white/10 hover:border-emerald-500/30"
                    }`}
                  >
                    +{val}
                  </button>
                ))}
              </div>

              {/* Entrada de Valor Personalizado */}
              <div className="space-y-1">
                <label className="text-[8px] font-pixel text-emerald-500/40 uppercase">VALOR_ESPECIFICO</label>
                <Input
                  type="number"
                  value={xpAmount}
                  onChange={(e) => setXpAmount(e.target.value)}
                  placeholder="0000"
                  className="h-9 bg-black/40 border-emerald-500/20 text-emerald-400 text-xs font-mono rounded-none focus-visible:ring-1 focus-visible:ring-emerald-500"
                />
              </div>

              {/* Botão de Confirmação */}
              <Button
                onClick={() => {
                  const amount = parseInt(xpAmount);
                  if (amount > 0) {
                    addTrainerXp(amount);
                    setXpAmount("");
                    setXpDialog(false);
                  }
                }}
                disabled={!xpAmount || parseInt(xpAmount) <= 0}
                className="w-full mt-2 font-pixel text-[10px] h-10 rounded-none bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] border-none disabled:opacity-20"
              >
                <Star className="w-3 h-3 mr-2" />
                CONFIRMAR_INJEÇÃO_XP
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Trainer Level Dialog */}
        <Dialog open={levelDialog} onOpenChange={setLevelDialog}>
          <DialogContent className="bg-card border-border text-foreground max-w-sm mx-auto">
            <DialogHeader>
              <DialogTitle className="text-foreground">Definir Nivel</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">Defina o nivel do treinador (1-100):</p>
            <Input
              type="number"
              value={levelInput}
              onChange={(e) => setLevelInput(e.target.value)}
              min={1}
              max={100}
              className="bg-secondary border-border text-foreground text-lg font-mono text-center"
              autoFocus
            />
            <Button
              onClick={() => {
                const level = Math.max(1, Math.min(100, parseInt(levelInput) || 1));
                setTrainerLevel(level);
                setLevelDialog(false);
              }}
              disabled={!levelInput}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <ArrowUp className="w-4 h-4 mr-2" />
              Definir Nivel {levelInput || "?"}
            </Button>
          </DialogContent>
        </Dialog>

              {/* Trainer HP Dialog */}
      <Dialog open={hpDialog} onOpenChange={setHpDialog}>
        <DialogContent 
          className="max-w-[320px] mx-auto border-2 bg-[#0a0a14] p-0 overflow-hidden"
          style={{ borderColor: hpMode === "damage" ? "#ef4444" : "#10b981" }}
        >
          {/* Header Estilo HUD */}
          <div 
            className="border-b px-4 py-3 flex justify-between items-center"
            style={{ 
              backgroundColor: hpMode === "damage" ? "rgba(239, 68, 68, 0.1)" : "rgba(16, 185, 129, 0.1)",
              borderColor: hpMode === "damage" ? "rgba(239, 68, 68, 0.3)" : "rgba(16, 185, 129, 0.3)"
            }}
          >
            <DialogTitle className="font-pixel text-[10px] tracking-widest uppercase" style={{ color: hpMode === "damage" ? "#ef4444" : "#10b981" }}>
              {hpMode === "damage" ? "SISTEMA_DE_DANO" : "PROTOCOLO_DE_CURA"}
            </DialogTitle>
            <Heart className={`w-3 h-3 ${hpMode === "damage" ? "text-red-500 animate-pulse" : "text-emerald-500"}`} />
          </div>

          <div className="p-5 flex flex-col gap-4 relative z-10">
            {/* Monitor de HP Atual */}
            <div className="bg-black/40 border border-white/5 p-2 text-center">
              <span className="text-[10px] font-pixel text-white/40 block mb-1">INTEGRIDADE_DO_SUJEITO</span>
              <span className="text-xl font-mono font-bold text-white tracking-tighter">
                {trainer.currentHp ?? 20} <span className="text-white/20 text-xs">/ {trainer.maxHp ?? 20} HP</span>
              </span>
            </div>

            {/* Info de Defesa (Apenas em Dano) */}
            {hpMode === "damage" && (
              <div className="grid grid-cols-2 gap-2 text-[9px] font-mono border border-blue-500/20 bg-blue-500/5 p-2">
                <div className="text-blue-400">DEFESA (AC): {trainer.defesa ?? 10}</div>
                <div className="text-blue-300 text-right">REDUÇÃO: -{Math.floor((trainer.defesa ?? 10) / 3)}</div>
              </div>
            )}

            {/* Seletores Rápidos */}
            <div className="grid grid-cols-5 gap-1.5">
              {[5, 10, 15, 20, 30].map((val) => (
                <button
                  key={val}
                  onClick={() => setHpAmount(String(val))}
                  className={`font-mono text-[10px] py-2 border transition-all ${
                    hpAmount === String(val)
                      ? hpMode === "damage" 
                        ? "bg-red-500 text-black border-red-400" 
                        : "bg-emerald-500 text-black border-emerald-400"
                      : "bg-white/5 text-white/40 border-white/10 hover:border-white/30"
                  }`}
                >
                  {hpMode === "damage" ? "-" : "+"}{val}
                </button>
              ))}
            </div>

            {/* Input Personalizado */}
            <Input
              type="number"
              value={hpAmount}
              onChange={(e) => setHpAmount(e.target.value)}
              placeholder="VALOR_CUSTOM..."
              className="h-9 bg-black/40 border-white/10 text-white text-xs font-mono rounded-none focus-visible:ring-1 focus-visible:ring-white/30"
            />

            {/* Cálculo de Dano Final */}
            {hpMode === "damage" && hpAmount && parseInt(hpAmount) > 0 && (
              <div className="space-y-1 bg-red-950/20 p-2 border border-red-900/30">
                <div className="flex justify-between text-[9px] font-mono text-red-400/60 uppercase">
                  <span>Dano Bruto:</span>
                  <span>{hpAmount}</span>
                </div>
                <div className="flex justify-between text-[10px] font-mono text-red-500 font-bold uppercase pt-1 border-t border-red-900/30">
                  <span>Dano Final:</span>
                  <span>{Math.max(1, parseInt(hpAmount) - Math.floor((trainer.defesa ?? 10) / 3))}</span>
                </div>
              </div>
            )}

            {/* Botão de Ação */}
            <Button
              onClick={() => {
                const amount = parseInt(hpAmount);
                if (amount > 0) {
                  if (hpMode === "damage") {
                    const defReduction = Math.floor((trainer.defesa ?? 10) / 3);
                    const finalDmg = Math.max(1, amount - defReduction);
                    damageTrainer(finalDmg);
                  } else {
                    healTrainer(amount);
                  }
                  setHpAmount("");
                  setHpDialog(false);
                }
              }}
              disabled={!hpAmount || parseInt(hpAmount) <= 0}
              className={`w-full font-pixel text-[10px] h-10 rounded-none border-none shadow-lg transition-all ${
                hpMode === "damage"
                  ? "bg-red-600 text-white hover:bg-red-500 shadow-red-900/20"
                  : "bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-900/20"
              }`}
            >
              <Heart className="w-3 h-3 mr-2" />
              {hpMode === "damage" ? "CONFIRMAR_DANO" : "EXECUTAR_REPARO"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

        {/* Add Money Dialog */}
<Dialog open={moneyDialog} onOpenChange={setMoneyDialog}>
  <DialogContent 
    className="max-w-[320px] mx-auto border-2 bg-[#0a0a14] p-0 overflow-hidden"
    style={{ borderColor: "#f59e0b" }} // Cor Amber para Dinheiro
  >
    {/* Cabeçalho Estilo HUD */}
    <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-3 flex justify-between items-center">
      <DialogTitle className="font-pixel text-[10px] tracking-widest text-amber-500 uppercase">
        TRANSFERENCIA_DE_CREDITOS
      </DialogTitle>
      <div className="flex gap-1">
        <div className="w-1.5 h-1.5 bg-amber-500 animate-bounce" />
      </div>
    </div>

    <div className="p-5 flex flex-col gap-4 relative z-10">
      <p className="text-[9px] font-pixel text-amber-500/60 uppercase tracking-tighter">
        Defina o montante para depósito na conta:
      </p>

      {/* Grade de Valores Rápidos */}
      <div className="grid grid-cols-3 gap-2">
        {[100, 500, 1000, 2000, 5000, 10000].map((val) => (
          <button
            key={val}
            onClick={() => setMoneyAmount(String(val))}
            className={`font-mono text-[10px] py-1.5 border transition-all ${
              moneyAmount === String(val)
                ? "bg-amber-500 text-black border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.4)]"
                : "bg-white/5 text-amber-500/50 border-white/10 hover:border-amber-500/30"
            }`}
          >
            ${val.toLocaleString("pt-BR")}
          </button>
        ))}
      </div>

      {/* Entrada de Valor Personalizado */}
      <div className="space-y-1">
        <label className="text-[8px] font-pixel text-amber-500/40 uppercase">MONTANTE_CUSTOMIZADO</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500/50 font-mono text-xs">$</span>
          <Input
            type="number"
            value={moneyAmount}
            onChange={(e) => setMoneyAmount(e.target.value)}
            placeholder="0000"
            className="h-9 bg-black/40 border-amber-500/20 text-amber-400 text-xs font-mono rounded-none pl-7 focus-visible:ring-1 focus-visible:ring-amber-500"
          />
        </div>
      </div>

      {/* Botão de Confirmação */}
      <Button
        onClick={handleAddMoney}
        disabled={!moneyAmount || parseInt(moneyAmount) <= 0}
        className="w-full mt-2 font-pixel text-[10px] h-10 rounded-none bg-amber-500 text-black hover:bg-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)] border-none disabled:opacity-20"
      >
        <Coins className="w-3 h-3 mr-2" />
        CONFIRMAR_DEPOSITO
      </Button>
    </div>
  </DialogContent>
</Dialog>
{/* Trainer Battle History - Gamer Victory Log */}
<div className="relative overflow-hidden bg-slate-950 border border-white/10 rounded-xl shadow-2xl">
  {/* Header Estilo Terminal */}
  <div className="p-3 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className="relative">
        <Trophy className="w-4 h-4 text-amber-500 animate-bounce" />
        <div className="absolute inset-0 blur-[6px] bg-amber-500/30" />
      </div>
      <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-amber-500 italic">
        Match_History.log
      </h3>
    </div>
    <div className="bg-amber-500/20 px-2 py-0.5 rounded-sm border border-amber-500/30">
      <span className="text-[9px] font-mono font-bold text-amber-500 uppercase">
        {trainer.battleHistory?.length ?? 0} Duelos
      </span>
    </div>
  </div>

  <div className="p-3">
    {(!trainer.battleHistory || trainer.battleHistory.length === 0) ? (
      <div className="flex flex-col items-center py-8 opacity-40">
        <Trophy className="w-8 h-8 text-slate-700 mb-2" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
          No combat data found.
        </p>
      </div>
    ) : (
      <div className="flex flex-col gap-3 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
        {[...(trainer.battleHistory || [])].reverse().map((entry) => {
          const date = new Date(entry.date);
          const formatted = `${date.toLocaleDateString("pt-BR")} | ${date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
          
          return (
            <div
              key={entry.id}
              className="relative group bg-slate-900/40 border-l-2 border-amber-500/50 p-3 transition-all hover:bg-amber-500/5"
            >
              {/* Overlay Decorativo de Fundo */}
              <div className="absolute top-0 right-0 p-1 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <Trophy size={40} className="-rotate-12" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black px-1.5 py-0.5 bg-amber-500 text-black skew-x-[-15deg]">
                      VICTORY
                    </span>
                    {entry.xpPerPokemon && (
                      <span className="text-[10px] font-mono font-bold text-amber-400 drop-shadow-glow">
                        +{entry.xpPerPokemon} XP
                      </span>
                    )}
                  </div>
                  <span className="text-[8px] font-mono text-slate-500 uppercase">
                    {formatted}
                  </span>
                </div>

                {/* Team Roster Estilizado */}
                <div className="flex flex-wrap gap-1">
                  {entry.teamSnapshot.map((name, i) => (
                    <div 
                      key={i} 
                      className="flex items-center gap-1 text-[9px] font-bold text-slate-300 bg-white/5 border border-white/5 px-2 py-0.5 rounded-sm hover:border-amber-500/30 transition-colors"
                    >
                      <div className="w-1 h-1 bg-amber-500 rounded-full" />
                      {name.toUpperCase()}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>

  {/* Footer Gamer */}
  <div className="bg-amber-500/5 px-3 py-1 flex items-center gap-2">
    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
    <span className="text-[7px] font-black text-amber-500/50 uppercase tracking-tighter">
      End-to-end combat encryption active // session_{Math.random().toString(36).substring(7)}
    </span>
  </div>
</div>

<style jsx>{`
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.02);
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(245, 158, 11, 0.2);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(245, 158, 11, 0.5);
  }
  .drop-shadow-glow {
    filter: drop-shadow(0 0 4px rgba(245, 158, 11, 0.6));
  }
`}</style>
      </div>
    </ScrollArea>
  );
}

// ── Badge Region Card ──

interface BadgeRegionCardProps {
  title: string;
  badges: { id: string; name: string; gym: string; obtained: boolean }[];
  iconMap: Record<string, React.FC<{ size?: number; obtained?: boolean }>>;
  obtained: number;
  region: "kanto" | "johto";
  onToggle: (badgeId: string, isObtained: boolean, region: "kanto" | "johto") => void;
  gradientFrom: string;
  gradientTo: string;
}

function BadgeRegionCard({ title, badges, iconMap, obtained, region, onToggle, gradientFrom, gradientTo }: BadgeRegionCardProps) {
  return (
<div className="relative group overflow-hidden bg-neutral-950 border-2 border-white/10 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.8)]">
  {/* Efeito de Scanline de Fundo (Gamer Detail) */}
  <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px]" />

  {/* Region Header: Estilo Terminal */}
  <div
    className="relative p-3 border-b-2 border-white/5 flex items-center justify-between"
    style={{
      background: `linear-gradient(90deg, ${gradientFrom}33 0%, transparent 100%)`,
    }}
  >
    <div className="flex items-center gap-3">
      {/* Ícone de Troféu com Glow */}
      <div 
        className="p-1.5 rounded-sm rotate-45 border"
        style={{ borderColor: gradientFrom, boxShadow: `0 0 10px ${gradientFrom}66` }}
      >
        <Award className="w-4 h-4 -rotate-45" style={{ color: gradientFrom }} />
      </div>
      <div>
        <h3 className="text-xs font-black italic uppercase tracking-widest text-white">
          {title} <span className="text-[10px] opacity-40 not-italic font-mono">Sector_Alpha</span>
        </h3>
      </div>
    </div>

    {/* Contador Digital */}
    <div
      className="font-mono text-sm font-bold px-3 py-0.5 rounded border-l-2 skew-x-[-12deg]"
      style={{
        backgroundColor: `${gradientFrom}15`,
        borderColor: gradientFrom,
        color: gradientFrom,
        textShadow: `0 0 8px ${gradientFrom}`,
      }}
    >
      <span className="skew-x-[12deg] inline-block">{obtained} / 8</span>
    </div>
  </div>

  {/* Badges Grid */}
  <div className="grid grid-cols-4 gap-4 p-5 relative">
    {badges.map((badge) => {
      const IconComponent = iconMap[badge.id];
      const isObtained = badge.obtained;
      
      return (
        <button
          key={badge.id}
          type="button"
          onClick={() => onToggle(badge.id, isObtained, region)}
          className={`
            relative flex flex-col items-center justify-center p-2 rounded-lg 
            transition-all duration-300 group/badge
            ${isObtained ? 'scale-100' : 'grayscale opacity-30 hover:grayscale-0 hover:opacity-100'}
          `}
          title={`${badge.name}\n${badge.gym}`}
        >
          {/* Fundo do Slot (Estilo Inventário) */}
          <div className="absolute inset-0 bg-white/[0.03] border border-white/5 rounded-lg group-hover/badge:border-white/20 transition-colors" />

          {/* Container do Ícone */}
          <div className={`
            relative w-12 h-12 flex items-center justify-center z-10
            ${isObtained ? 'drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]' : ''}
          `}>
            {IconComponent ? (
              <div className="transform transition-transform group-hover/badge:scale-110 duration-500">
                <IconComponent size={42} obtained={isObtained} />
              </div>
            ) : (
              <div
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all`}
                style={{
                  borderColor: isObtained ? gradientFrom : "#333",
                  backgroundColor: isObtained ? `${gradientFrom}33` : "transparent",
                  boxShadow: isObtained ? `0 0 15px ${gradientFrom}44` : "none"
                }}
              >
                <Award className="w-5 h-5" style={{ color: isObtained ? "#fff" : "#444" }} />
              </div>
            )}
            
            {/* Brilho de "Novo Item" se obtido */}
            {isObtained && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping" />
            )}
          </div>

          {/* Nome da Insígnia (Fonte Estilo HUD) */}
          <span
            className={`
              mt-2 text-[7px] font-black uppercase tracking-tighter text-center leading-none z-10
              transition-colors duration-300
              ${isObtained ? 'text-white' : 'text-neutral-600'}
            `}
          >
            {badge.name.replace(" Badge", "")}
          </span>

          {/* Detalhe de Canto Tático */}
          <div className="absolute bottom-1 right-1 w-1 h-1 bg-white/10 rotate-45 group-hover/badge:bg-white/40" />
        </button>
      );
    })}
  </div>

  {/* Footer: Barra de progresso visual fina */}
  <div className="h-1 w-full bg-white/5">
    <div 
      className="h-full transition-all duration-1000 ease-out"
      style={{ 
        width: `${(obtained / 8) * 100}%`,
        background: `linear-gradient(90deg, transparent, ${gradientFrom}, ${gradientTo})`,
        boxShadow: `0 0 10px ${gradientFrom}`
      }}
    />
  </div>
  
  <p className="text-[9px] font-mono text-white/20 text-center py-2 uppercase tracking-[0.2em]">
    System_Status: {obtained === 8 ? "All_Badges_Detected" : "Synchronizing_Data..."}
  </p>
</div>
  );
}

"use client";

import { useState } from "react";
import { useGameStore, ATTRIBUTE_INFO, trainerXpForLevel, explorationXpForLevel, battleXpForLevel, getTodayDateStr, getCurrentWeeklyEvent, getCurrentWeekKey, getWeekStartDate } from "@/lib/game-store";
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

            {/* Exploration Level & XP */}
            <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-medium text-foreground">Explorador Nivel {trainer.explorationLevel ?? 1}</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">
                  Nv.{trainer.explorationLevel ?? 1}
                </span>
              </div>
              {/* Exploration XP Progress Bar */}
              {(() => {
                const currentLevel = trainer.explorationLevel ?? 1;
                const currentXp = trainer.explorationXp ?? 0;
                const xpCurrent = explorationXpForLevel(currentLevel);
                const xpNext = explorationXpForLevel(currentLevel + 1);
                const xpInLevel = currentXp - xpCurrent;
                const xpNeeded = xpNext - xpCurrent;
                const xpPercent = xpNeeded > 0 ? Math.min(100, (xpInLevel / xpNeeded) * 100) : 100;
                return (
                  <>
                    <div className="flex-1 h-2.5 bg-background rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${xpPercent}%`, backgroundColor: "#10B981" }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px] text-muted-foreground font-mono">
                        XP: {currentXp.toLocaleString("pt-BR")}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        Proximo: {xpNext.toLocaleString("pt-BR")}
                      </span>
                    </div>
                  </>
                );
              })()}
              <p className="text-[9px] text-muted-foreground mt-1.5 leading-relaxed">
                Ganhe XP capturando Pokemon no radar. Bonus por capturar com menos pokebolas!
              </p>
            </div>

            {/* Daily Streak / Ofensiva */}
            {(() => {
              const streak = trainer.dailyStreak ?? 0;
              const lastDate = trainer.lastCaptureDate ?? null;
              const unlockedDays = trainer.legendaryUnlockedDays ?? [];
              const today = getTodayDateStr();
              const capturedToday = lastDate === today;

              // Next milestone calculation
              const nextMilestone = Math.ceil((streak + 1) / 30) * 30;
              const daysToNextMilestone = nextMilestone - streak;
              const milestoneProgress = streak % 30;
              const milestonePercent = (milestoneProgress / 30) * 100;

              // Calculate which day of the week we're on
              const weekStart = trainer.weekStartDate || getWeekStartDate();
              const daysIntoCycle: number[] = [];
              for (let i = 0; i < 7; i++) {
                const checkDate = new Date(weekStart + "T12:00:00");
                checkDate.setDate(checkDate.getDate() + i);
                const checkDateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, "0")}-${String(checkDate.getDate()).padStart(2, "0")}`;
                daysIntoCycle.push(checkDateStr === lastDate ? 1 : 0);
              }
              
              // Current day of week (0 = Monday, 6 = Sunday)
              const d = new Date();
              const dayOfWeek = d.getDay();
              const currentDayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

              // Check if streak is still active (captured today or yesterday)
              let streakActive = capturedToday;
              if (!capturedToday && lastDate) {
                const last = new Date(lastDate + "T12:00:00");
                const now = new Date(today + "T12:00:00");
                const diffDays = Math.round((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
                if (diffDays === 1) {
                  streakActive = true; // Captured yesterday, streak still alive
                }
              }

              const streakColor = !streakActive && streak > 0 ? "#EF4444" : streak >= 7 ? "#F97316" : "#F59E0B";

              return (
                <div className="rounded-xl overflow-hidden border border-orange-500/20" style={{ background: "rgba(249,115,22,0.04)" }}>
                  {/* Header */}
                  <div className="flex items-center justify-between px-3 pt-3 pb-2">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4" style={{ color: streakColor }} />
                      <span className="text-sm font-bold text-foreground">Ofensiva Diaria</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {!streakActive && streak > 0 && (
                        <span className="text-[10px] text-red-400 font-medium">Quebrada</span>
                      )}
                      {capturedToday && (
                        <span className="text-[10px] text-emerald-400 font-medium">Hoje</span>
                      )}
                      <div
                        className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                        style={{ background: `${streakColor}20`, border: `1px solid ${streakColor}40` }}
                      >
                        <Flame className="w-3 h-3" style={{ color: streakColor }} />
                        <span className="text-sm font-black font-mono" style={{ color: streakColor }}>
                          {streak}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Streak mini-dots (7 days of week visualization) */}
                  <div className="px-3 pb-2">
                    <div className="flex gap-1.5 items-center">
                      {Array.from({ length: 7 }).map((_, i) => {
                        const active = daysIntoCycle[i] === 1;
                        const isToday = i === currentDayOfWeek && capturedToday;
                        const streakColor2 = !streakActive && streak > 0 ? "#EF4444" : streak >= 7 ? "#F97316" : "#F59E0B";
                        return (
                          <div
                            key={i}
                            className="flex-1 flex flex-col items-center gap-0.5"
                          >
                            <div
                              className="w-full h-5 rounded-md flex items-center justify-center transition-all"
                              style={{
                                background: active
                                  ? isToday
                                    ? `${streakColor2}30`
                                    : `${streakColor2}18`
                                  : "rgba(255,255,255,0.04)",
                                border: `1px solid ${active ? streakColor2 + "40" : "rgba(255,255,255,0.06)"}`,
                              }}
                            >
                              {active && (
                                <Flame className="w-2.5 h-2.5" style={{ color: isToday ? streakColor2 : streakColor2 + "80" }} />
                              )}
                            </div>
                            <span className="text-[8px] text-muted-foreground font-mono">
                              {["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"][i]}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Progress to next milestone */}
                  <div className="px-3 pb-2">
                    <div className="flex items-center justify-between mb-1">


                    </div>
                    <div className="h-2 bg-background rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${milestonePercent}%`, background: "linear-gradient(90deg, #F59E0B, #F97316)" }}
                      />
                    </div>
                    <div className="flex justify-between mt-0.5">
                      <span className="text-[9px] text-muted-foreground font-mono">{milestoneProgress}/30 dias</span>
                      <span className="text-[9px] text-muted-foreground font-mono">Marco: {nextMilestone} dias</span>
                    </div>
                  </div>

                  {/* No capture today warning */}
                  {!capturedToday && (
                    <div className="mx-3 mb-3 px-2 py-1.5 rounded-lg" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                      <p className="text-[10px] text-red-400 text-center">
                        Capture um Pokemon hoje para manter a ofensiva!
                      </p>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Weekly Event / Evento Semanal */}
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
                <div className="rounded-xl overflow-hidden border border-cyan-500/20" style={{ background: "rgba(6,182,212,0.04)" }}>
                  {/* Header */}
                  <div className="flex items-center justify-between px-3 pt-3 pb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm font-bold text-foreground">Evento Semanal</span>
                    </div>
                    <span className="text-[10px] text-cyan-400/70 font-mono">{weekKey}</span>
                  </div>

                  {/* Event title */}
                  <div className="px-3 pb-2">
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg" style={{ background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.15)" }}>
                      <Target className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="text-xs font-semibold text-cyan-300">{event.title}</span>
                    </div>
                  </div>

                  {/* Missions */}
                  <div className="px-3 pb-2 flex flex-col gap-1.5">
                    {event.missions.map((mission) => {
                      const current = missionProgress[mission.id] ?? 0;
                      const done = current >= mission.target;
                      const pct = Math.min(100, (current / mission.target) * 100);
                      return (
                        <div key={mission.id} className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            {done ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : (
                              <Circle className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                            )}
                            <span className={`text-[11px] flex-1 ${done ? "text-emerald-400 line-through" : "text-foreground"}`}>
                              {mission.description}
                            </span>
                            <span className="text-[10px] font-mono text-muted-foreground">
                              {Math.min(current, mission.target)}/{mission.target}
                            </span>
                          </div>
                          <div className="ml-5.5 h-1 bg-background rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${pct}%`,
                                backgroundColor: done ? "#10B981" : "#06B6D4",
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Rewards section */}
                  <div className="px-3 pb-3">
                    <div className="flex items-center gap-1 mb-1.5">
                      <Gift className="w-3 h-3 text-amber-400" />
                      <span className="text-[10px] font-semibold text-amber-400">Recompensas</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.3)", color: "#F59E0B" }}>
                        ${event.rewardMoney.toLocaleString("pt-BR")}
                      </span>
                      {event.rewardItems.map((item, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.3)", color: "#06B6D4" }}>
                          {item.itemName} x{item.quantity}
                        </span>
                      ))}
                      {rewardPokemon && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold capitalize" style={{ background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.3)", color: "#A855F7" }}>
                          {rewardPokemon.name} Nv.{event.rewardPokemonLevel}
                        </span>
                      )}
                    </div>

                    {/* Claim button */}
                    {allCompleted && !rewardClaimed && (
                      <Button
                        onClick={() => claimReward()}
                        className="w-full h-8 text-xs font-bold"
                        style={{ background: "linear-gradient(90deg, #06B6D4, #A855F7)", color: "#fff" }}
                      >
                        <Gift className="w-3.5 h-3.5 mr-1.5" />
                        Resgatar Recompensas
                      </Button>
                    )}
                    {rewardClaimed && (
                      <div className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[11px] font-semibold text-emerald-400">Recompensas Resgatadas!</span>
                      </div>
                    )}
                    {!allCompleted && (
                      <p className="text-[9px] text-muted-foreground text-center leading-relaxed">
                        Complete todas as missoes para desbloquear as recompensas!
                      </p>
                    )}
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

        {/* Trainer RPG Stats */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-accent" />
              <h3 className="font-semibold text-foreground">Status RPG</h3>
            </div>
            <span className="text-xs text-muted-foreground font-mono">Nivel {trainer.level ?? 1}</span>
          </div>
          <div className="p-4 flex flex-col gap-3">
            {/* Level & XP */}
            <div className="bg-secondary/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ArrowUp className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium text-foreground">Nivel {trainer.level ?? 1}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setLevelInput(String(trainer.level ?? 1));
                      setLevelDialog(true);
                    }}
                    className="h-6 text-[10px] px-2 border-border text-muted-foreground bg-transparent hover:bg-secondary"
                  >
                    Editar Nivel
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setXpDialog(true)}
                    className="h-6 text-[10px] px-2 border-accent/50 text-accent bg-transparent hover:bg-accent/10"
                  >
                    <Plus className="w-3 h-3 mr-0.5" />XP
                  </Button>
                </div>
              </div>
              {/* XP Progress Bar */}
              {(() => {
                const currentLevel = trainer.level ?? 1;
                const currentXp = trainer.xp ?? 0;
                const xpCurrent = trainerXpForLevel(currentLevel);
                const xpNext = trainerXpForLevel(currentLevel + 1);
                const xpInLevel = currentXp - xpCurrent;
                const xpNeeded = xpNext - xpCurrent;
                const xpPercent = xpNeeded > 0 ? Math.min(100, (xpInLevel / xpNeeded) * 100) : 100;
                return (
                  <>
                    <div className="flex-1 h-2.5 bg-background rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-accent transition-all duration-300"
                        style={{ width: `${xpPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px] text-muted-foreground font-mono">
                        XP: {currentXp.toLocaleString("pt-BR")}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        Proximo: {xpNext.toLocaleString("pt-BR")}
                      </span>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* HP */}
            <div className="bg-secondary/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-medium text-foreground">HP</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold font-mono text-foreground">
                    {trainer.currentHp ?? 20}/{trainer.maxHp ?? 20}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => { setHpMode("damage"); setHpAmount(""); setHpDialog(true); }}
                    className="h-6 text-[10px] px-2 border-destructive/50 text-destructive bg-transparent hover:bg-destructive/10"
                  >
                    Dano
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => { setHpMode("heal"); setHpAmount(""); setHpDialog(true); }}
                    className="h-6 text-[10px] px-2 border-green-500/50 text-green-500 bg-transparent hover:bg-green-500/10"
                  >
                    Cura
                  </Button>
                </div>
              </div>
              {/* HP Bar */}
              {(() => {
                const maxHp = trainer.maxHp ?? 20;
                const currentHp = trainer.currentHp ?? 20;
                const hpPercent = maxHp > 0 ? (currentHp / maxHp) * 100 : 0;
                const hpColor = hpPercent > 50 ? "#22C55E" : hpPercent > 25 ? "#EAB308" : "#EF4444";
                return (
                  <div className="flex-1 h-3 bg-background rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${hpPercent}%`, backgroundColor: hpColor }}
                    />
                  </div>
                );
              })()}
            </div>

            {/* Defense */}
            <div className="flex items-center justify-between bg-secondary/50 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-foreground">Defesa (AC)</span>
              </div>
              <span className="text-lg font-bold font-mono text-blue-400">{trainer.defesa ?? 10}</span>
            </div>

            <p className="text-[10px] text-muted-foreground leading-relaxed">
              HP e Defesa escalam com o nivel e os atributos do treinador. Combate aumenta HP e AC, Furtividade aumenta AC.
            </p>
          </div>
        </div>

        {/* Attributes Section */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Swords className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Atributos</h3>
            </div>
            <span className="text-xs text-muted-foreground font-mono">{totalPoints} pts</span>
          </div>
          <div className="p-4 flex flex-col gap-2.5">
            {(Object.keys(ATTRIBUTE_INFO) as (keyof TrainerAttributes)[]).map((attr) => {
              const info = ATTRIBUTE_INFO[attr];
              const value = trainer.attributes?.[attr] ?? 0;
              return (
                <div key={attr} className="flex items-center gap-3">
                  <div className="flex items-center gap-2 w-28 shrink-0">
                    <span className="text-primary">{ATTR_ICONS[attr]}</span>
                    <span className="text-sm font-medium text-foreground">{info.name}</span>
                  </div>
                  <div className="flex-1 flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleAttrChange(attr, -1)}
                      disabled={value <= 0}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground hover:bg-secondary"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <div className="flex-1 flex gap-0.5">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex-1 h-3 rounded-sm transition-colors"
                          style={{
                            backgroundColor: i < value
                              ? "hsl(var(--primary))"
                              : "hsl(var(--secondary))",
                          }}
                        />
                      ))}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleAttrChange(attr, 1)}
                      disabled={value >= 10}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground hover:bg-secondary"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                    <span className="text-xs font-mono text-muted-foreground w-5 text-right">{value}</span>
                  </div>
                </div>
              );
            })}
            <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
              Combate: +1 na rolagem a cada 2pts | Sorte: crit expandido a cada 2pts | Afinidade: +3 HP de cura por pt
            </p>
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
          <DialogContent className="bg-card border-border text-foreground max-w-sm mx-auto">
            <DialogHeader>
              <DialogTitle className="text-foreground">Ficha do Treinador</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-3">
              <div>
                <label htmlFor="trainer-name" className="text-xs text-muted-foreground mb-1 block">Nome</label>
                <Input
                  id="trainer-name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Ash Ketchum"
                  className="bg-secondary border-border text-foreground"
                />
              </div>
              <div>
                <label htmlFor="trainer-age" className="text-xs text-muted-foreground mb-1 block">Idade</label>
                <Input
                  id="trainer-age"
                  value={editForm.age}
                  onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                  placeholder="10"
                  className="bg-secondary border-border text-foreground"
                />
              </div>
              <div>
                <label htmlFor="trainer-hometown" className="text-xs text-muted-foreground mb-1 block">Cidade Natal</label>
                <Input
                  id="trainer-hometown"
                  value={editForm.hometown}
                  onChange={(e) => setEditForm({ ...editForm, hometown: e.target.value })}
                  placeholder="Pallet Town"
                  className="bg-secondary border-border text-foreground"
                />
              </div>
              <div>
                <label htmlFor="trainer-class" className="text-xs text-muted-foreground mb-1 block">Classe</label>
                <div className="flex flex-wrap gap-2">
                  {TRAINER_CLASSES.map((cls) => (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => setEditForm({ ...editForm, trainerClass: cls })}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${editForm.trainerClass === cls
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-secondary text-muted-foreground border-border hover:text-foreground"
                        }`}
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              </div>
              <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90 mt-2">
                Salvar
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add XP Dialog */}
        <Dialog open={xpDialog} onOpenChange={setXpDialog}>
          <DialogContent className="bg-card border-border text-foreground max-w-sm mx-auto">
            <DialogHeader>
              <DialogTitle className="text-foreground">Adicionar Experiencia</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">Quanto XP o treinador ganhou?</p>
            <div className="flex gap-2 flex-wrap">
              {[50, 100, 250, 500, 1000].map((val) => (
                <Button
                  key={val}
                  size="sm"
                  variant="outline"
                  onClick={() => setXpAmount(String(val))}
                  className={`border-border bg-transparent hover:bg-secondary ${xpAmount === String(val) ? "text-accent border-accent" : "text-foreground"
                    }`}
                >
                  +{val}
                </Button>
              ))}
            </div>
            <Input
              type="number"
              value={xpAmount}
              onChange={(e) => setXpAmount(e.target.value)}
              placeholder="Valor personalizado"
              className="bg-secondary border-border text-foreground"
            />
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
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Star className="w-4 h-4 mr-2" />
              Adicionar {parseInt(xpAmount || "0").toLocaleString("pt-BR")} XP
            </Button>
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
          <DialogContent className="bg-card border-border text-foreground max-w-sm mx-auto">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                {hpMode === "damage" ? "Aplicar Dano ao Treinador" : "Curar Treinador"}
              </DialogTitle>
            </DialogHeader>
            <div className="flex items-center justify-center gap-3 my-1">
              <Heart className="w-5 h-5 text-red-400" />
              <span className="text-lg font-bold font-mono text-foreground">
                {trainer.currentHp ?? 20}/{trainer.maxHp ?? 20} HP
              </span>
            </div>
            {hpMode === "damage" && (
              <div className="bg-secondary/50 rounded-lg p-2 text-center">
                <span className="text-xs text-muted-foreground">
                  Defesa (AC): <span className="text-blue-400 font-bold">{trainer.defesa ?? 10}</span>
                  {" - "}Reducao: <span className="text-blue-400 font-bold">-{Math.floor((trainer.defesa ?? 10) / 3)}</span>
                </span>
              </div>
            )}
            <div className="flex gap-2 flex-wrap">
              {[5, 10, 15, 20, 30].map((val) => (
                <Button
                  key={val}
                  size="sm"
                  variant="outline"
                  onClick={() => setHpAmount(String(val))}
                  className={`border-border bg-transparent hover:bg-secondary ${hpAmount === String(val)
                    ? hpMode === "damage" ? "text-destructive border-destructive" : "text-green-500 border-green-500"
                    : "text-foreground"
                    }`}
                >
                  {hpMode === "damage" ? "-" : "+"}{val}
                </Button>
              ))}
            </div>
            <Input
              type="number"
              value={hpAmount}
              onChange={(e) => setHpAmount(e.target.value)}
              placeholder="Valor personalizado"
              className="bg-secondary border-border text-foreground"
            />
            {hpMode === "damage" && hpAmount && parseInt(hpAmount) > 0 && (
              <div className="bg-destructive/10 rounded-lg p-2 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Dano bruto:</span>
                  <span className="font-mono text-foreground">{hpAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Reducao da defesa:</span>
                  <span className="font-mono text-blue-400">-{Math.floor((trainer.defesa ?? 10) / 3)}</span>
                </div>
                <div className="flex justify-between border-t border-border/50 mt-1 pt-1">
                  <span className="font-medium text-foreground">Dano final:</span>
                  <span className="font-mono font-bold text-destructive">
                    {Math.max(1, parseInt(hpAmount) - Math.floor((trainer.defesa ?? 10) / 3))}
                  </span>
                </div>
              </div>
            )}
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
              className={hpMode === "damage"
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : "bg-green-600 text-white hover:bg-green-700"
              }
            >
              <Heart className="w-4 h-4 mr-2" />
              {hpMode === "damage"
                ? `Aplicar Dano`
                : `Curar ${parseInt(hpAmount || "0")} HP`
              }
            </Button>
          </DialogContent>
        </Dialog>

        {/* Add Money Dialog */}
        <Dialog open={moneyDialog} onOpenChange={setMoneyDialog}>
          <DialogContent className="bg-card border-border text-foreground max-w-sm mx-auto">
            <DialogHeader>
              <DialogTitle className="text-foreground">Receber Dinheiro</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">Quanto dinheiro o treinador recebeu?</p>
            <div className="flex gap-2 flex-wrap">
              {[100, 500, 1000, 2000, 5000].map((val) => (
                <Button
                  key={val}
                  size="sm"
                  variant="outline"
                  onClick={() => setMoneyAmount(String(val))}
                  className={`border-border bg-transparent hover:bg-secondary ${moneyAmount === String(val) ? "text-accent border-accent" : "text-foreground"
                    }`}
                >
                  {"$"}{val.toLocaleString("pt-BR")}
                </Button>
              ))}
            </div>
            <Input
              type="number"
              value={moneyAmount}
              onChange={(e) => setMoneyAmount(e.target.value)}
              placeholder="Valor personalizado"
              className="bg-secondary border-border text-foreground"
            />
            <Button
              onClick={handleAddMoney}
              disabled={!moneyAmount || parseInt(moneyAmount) <= 0}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Coins className="w-4 h-4 mr-2" />
              Receber {"$"}{parseInt(moneyAmount || "0").toLocaleString("pt-BR")}
            </Button>
          </DialogContent>
        </Dialog>

        {/* Trainer Battle History */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-3 border-b border-border flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h3 className="font-semibold text-sm text-foreground">Historico de Batalhas</h3>
            <span className="ml-auto text-xs text-muted-foreground">
              {(trainer.battleHistory || []).length} registro(s)
            </span>
          </div>
          <div className="p-3">
            {(!trainer.battleHistory || trainer.battleHistory.length === 0) ? (
              <p className="text-xs text-muted-foreground text-center py-4">
                Nenhuma vitoria de equipe registrada.
              </p>
            ) : (
              <div className="flex flex-col gap-1.5 max-h-[250px] overflow-y-auto">
                {[...(trainer.battleHistory || [])].reverse().map((entry) => {
                  const date = new Date(entry.date);
                  const formatted = `${date.toLocaleDateString("pt-BR")} ${date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
                  return (
                    <div
                      key={entry.id}
                      className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-2"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="text-xs font-medium text-foreground">Vitoria da Equipe</span>
                        {entry.xpPerPokemon && entry.xpPerPokemon > 0 && (
                          <span className="text-[10px] text-amber-400 font-mono">+{entry.xpPerPokemon} XP/cada</span>
                        )}
                        <span className="ml-auto text-[9px] text-muted-foreground">{formatted}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {entry.teamSnapshot.map((name, i) => (
                          <span key={i} className="text-[9px] bg-secondary rounded px-1.5 py-0.5 text-muted-foreground">
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
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
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Region header */}
      <div
        className="p-3 flex items-center justify-between"
        style={{
          background: `linear-gradient(135deg, ${gradientFrom}22 0%, ${gradientTo}22 100%)`,
        }}
      >
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5" style={{ color: gradientFrom }} />
          <h3 className="font-semibold text-foreground">{title}</h3>
        </div>
        <div
          className="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold"
          style={{
            backgroundColor: `${gradientFrom}20`,
            color: gradientFrom,
          }}
        >
          {obtained}/8
        </div>
      </div>

      {/* Badges grid */}
      <div className="grid grid-cols-4 gap-3 p-4">
        {badges.map((badge) => {
          const IconComponent = iconMap[badge.id];
          return (
            <button
              key={badge.id}
              type="button"
              onClick={() => onToggle(badge.id, badge.obtained, region)}
              className="flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all hover:bg-secondary/50"
              style={{
                opacity: badge.obtained ? 1 : 0.4,
              }}
              title={`${badge.name}\n${badge.gym}\nClique para ${badge.obtained ? "remover" : "obter"}`}
            >
              <div className="w-11 h-11 flex items-center justify-center">
                {IconComponent ? (
                  <IconComponent size={44} obtained={badge.obtained} />
                ) : (
                  <div
                    className="w-10 h-10 rounded-full border-2 flex items-center justify-center"
                    style={{
                      borderColor: badge.obtained ? gradientFrom : "hsl(var(--border))",
                      backgroundColor: badge.obtained ? gradientFrom : "transparent",
                    }}
                  >
                    <Award className="w-5 h-5" style={{ color: badge.obtained ? "#fff" : "hsl(var(--muted-foreground))" }} />
                  </div>
                )}
              </div>
              <span
                className="text-[8px] font-medium text-center leading-tight"
                style={{ color: badge.obtained ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))" }}
              >
                {badge.name.replace(" Badge", "")}
              </span>
            </button>
          );
        })}
      </div>
      <p className="text-[10px] text-muted-foreground text-center pb-3 px-4">
        Toque em uma insignia para marcar como obtida
      </p>
    </div>
  );
}

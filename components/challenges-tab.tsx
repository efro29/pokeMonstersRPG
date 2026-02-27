"use client";

import { useState, useEffect } from "react";
import { useGameStore, battleXpForLevel } from "@/lib/game-store";
import { getPokemon, POKEMON, getSpriteUrl } from "@/lib/pokemon-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Mail,
  MailOpen,
  Swords,
  Trophy,
  Skull,
  Star,
  User,
  Clock,
  Flame,
  Shield,
} from "lucide-react";

// NPC Names for challenges
const NPC_NAMES = [
  "Bruno", "Misty", "Brock", "Surge", "Erika", "Koga", "Sabrina", "Blaine",
  "Giovanni", "Lorelei", "Agatha", "Lance", "Gary", "Red", "Blue",
  "Falkner", "Bugsy", "Whitney", "Morty", "Chuck", "Jasmine", "Pryce", "Clair",
  "Will", "Karen", "Silver", "Ethan", "Lyra", "Archer", "Proton", "Petrel",
  "Ariana", "Youngster Joey", "Bug Catcher Wade", "Lass Dana", "Hiker Anthony",
  "Fisherman Ralph", "Swimmer Simon", "Ace Trainer Gaven", "Cooltrainer Mary"
];

// Challenge messages
const CHALLENGE_MESSAGES = [
  "Vi que voce agora e treinador, vamos duelar!",
  "Meus Pokemon estao prontos para batalha!",
  "Aceita um desafio de verdade?",
  "Dizem que voce e bom... Prove!",
  "Minha equipe quer testar sua forca!",
  "Estou te esperando na arena!",
  "Vamos ver quem e o melhor treinador!",
  "Prepare-se para perder!",
  "Meus Pokemon nao conhecem derrota!",
  "Aceita o desafio ou tem medo?",
  "Hora de mostrar o poder do meu time!",
  "Voce nao tem chance contra mim!",
  "Vem pro duelo, treinador!",
  "Minha equipe esta sedenta por batalha!",
  "Chegou a hora da revanche!",
];

export interface NpcChallenge {
  id: string;
  npcName: string;
  message: string;
  npcTeam: { speciesId: number; level: number; currentHp: number; maxHp: number }[];
  difficulty: "easy" | "medium" | "hard";
  xpReward: number;
  moneyReward: number;
  read: boolean;
  timestamp: number;
}

interface ChallengesTabProps {
  onStartDuel: (challenge: NpcChallenge) => void;
}

// Generate a random NPC team
function generateNpcTeam(difficulty: "easy" | "medium" | "hard", trainerLevel: number): NpcChallenge["npcTeam"] {
  const teamSize = difficulty === "easy" ? 2 : difficulty === "medium" ? 3 : 4;
  const levelRange = difficulty === "easy" 
    ? { min: Math.max(1, trainerLevel - 5), max: trainerLevel }
    : difficulty === "medium"
    ? { min: trainerLevel, max: trainerLevel + 5 }
    : { min: trainerLevel + 3, max: trainerLevel + 10 };

  const team: NpcChallenge["npcTeam"] = [];
  const availablePokemon = POKEMON.filter(p => p.id <= 151); // Only Kanto for now
  
  for (let i = 0; i < teamSize; i++) {
    const randomPokemon = availablePokemon[Math.floor(Math.random() * availablePokemon.length)];
    const level = Math.min(100, Math.max(1, Math.floor(Math.random() * (levelRange.max - levelRange.min + 1)) + levelRange.min));
    const baseHp = randomPokemon.baseHp || 40;
    const maxHp = baseHp + level * 3;
    
    team.push({
      speciesId: randomPokemon.id,
      level,
      currentHp: maxHp,
      maxHp,
    });
  }
  
  return team;
}

// Generate a new challenge
function generateChallenge(trainerLevel: number): NpcChallenge {
  const difficulties: ("easy" | "medium" | "hard")[] = ["easy", "medium", "hard"];
  const difficultyWeights = [0.4, 0.4, 0.2]; // 40% easy, 40% medium, 20% hard
  
  const roll = Math.random();
  let difficulty: "easy" | "medium" | "hard" = "easy";
  let cumulative = 0;
  for (let i = 0; i < difficulties.length; i++) {
    cumulative += difficultyWeights[i];
    if (roll <= cumulative) {
      difficulty = difficulties[i];
      break;
    }
  }

  const xpMultiplier = difficulty === "easy" ? 50 : difficulty === "medium" ? 100 : 200;
  const moneyMultiplier = difficulty === "easy" ? 100 : difficulty === "medium" ? 250 : 500;

  return {
    id: `challenge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    npcName: NPC_NAMES[Math.floor(Math.random() * NPC_NAMES.length)],
    message: CHALLENGE_MESSAGES[Math.floor(Math.random() * CHALLENGE_MESSAGES.length)],
    npcTeam: generateNpcTeam(difficulty, trainerLevel),
    difficulty,
    xpReward: xpMultiplier + Math.floor(trainerLevel * (xpMultiplier / 10)),
    moneyReward: moneyMultiplier + Math.floor(trainerLevel * (moneyMultiplier / 20)),
    read: false,
    timestamp: Date.now(),
  };
}

// localStorage key for challenges
const CHALLENGES_KEY = "pokemon-rpg-challenges";

export function ChallengesTab({ onStartDuel }: ChallengesTabProps) {
  const { trainer, team } = useGameStore();
  const [challenges, setChallenges] = useState<NpcChallenge[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<NpcChallenge | null>(null);

  // Load challenges from localStorage and generate new ones if needed
  useEffect(() => {
    const stored = localStorage.getItem(CHALLENGES_KEY);
    let loadedChallenges: NpcChallenge[] = [];
    
    if (stored) {
      try {
        loadedChallenges = JSON.parse(stored);
      } catch {
        loadedChallenges = [];
      }
    }

    // Generate challenges if less than 5
    const trainerBattleLevel = trainer.battleLevel ?? 1;
    while (loadedChallenges.length < 5) {
      loadedChallenges.push(generateChallenge(trainerBattleLevel));
    }

    // Sort by timestamp (newest first)
    loadedChallenges.sort((a, b) => b.timestamp - a.timestamp);
    
    setChallenges(loadedChallenges);
    localStorage.setItem(CHALLENGES_KEY, JSON.stringify(loadedChallenges));
  }, [trainer.battleLevel]);

  // Mark challenge as read
  const markAsRead = (challengeId: string) => {
    const updated = challenges.map(c => 
      c.id === challengeId ? { ...c, read: true } : c
    );
    setChallenges(updated);
    localStorage.setItem(CHALLENGES_KEY, JSON.stringify(updated));
  };

  // Remove challenge and generate new one
  const removeChallenge = (challengeId: string) => {
    const filtered = challenges.filter(c => c.id !== challengeId);
    // Add a new challenge
    filtered.push(generateChallenge(trainer.battleLevel ?? 1));
    filtered.sort((a, b) => b.timestamp - a.timestamp);
    setChallenges(filtered);
    localStorage.setItem(CHALLENGES_KEY, JSON.stringify(filtered));
  };

  // Handle accepting a duel
  const handleAcceptDuel = (challenge: NpcChallenge) => {
    markAsRead(challenge.id);
    setSelectedChallenge(null);
    onStartDuel(challenge);
  };

  // Battle stats section
  const battleLevel = trainer.battleLevel ?? 1;
  const battleXp = trainer.battleXp ?? 0;
  const xpCurrent = battleXpForLevel(battleLevel);
  const xpNext = battleXpForLevel(battleLevel + 1);
  const xpInLevel = battleXp - xpCurrent;
  const xpNeeded = xpNext - xpCurrent;
  const xpPercent = xpNeeded > 0 ? Math.min(100, (xpInLevel / xpNeeded) * 100) : 100;
  const battleWins = trainer.battleWins ?? 0;
  const battleLosses = trainer.battleLosses ?? 0;
  const winRate = battleWins + battleLosses > 0 
    ? Math.round((battleWins / (battleWins + battleLosses)) * 100) 
    : 0;

  const unreadCount = challenges.filter(c => !c.read).length;
  const hasTeam = team.length > 0 && team.some(p => p.currentHp > 0);

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "easy": return "#22C55E";
      case "medium": return "#F59E0B";
      case "hard": return "#EF4444";
      default: return "#888";
    }
  };

  const getDifficultyLabel = (diff: string) => {
    switch (diff) {
      case "easy": return "Facil";
      case "medium": return "Medio";
      case "hard": return "Dificil";
      default: return diff;
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-3 p-3">
        {/* Battle Stats Card */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Swords className="w-5 h-5 text-red-400" />
                <span className="text-sm font-bold text-foreground">Nivel de Batalha</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/30">
                <Flame className="w-3 h-3 text-red-400" />
                <span className="text-sm font-black text-red-400">Nv.{battleLevel}</span>
              </div>
            </div>
          </div>

          <div className="p-3 space-y-3">
            {/* XP Bar */}
            <div>
              <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                <span>XP: {battleXp.toLocaleString("pt-BR")}</span>
                <span>Proximo: {xpNext.toLocaleString("pt-BR")}</span>
              </div>
              <div className="h-2.5 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${xpPercent}%`, background: "linear-gradient(90deg, #EF4444, #F97316)" }}
                />
              </div>
            </div>

            {/* Win/Loss Stats */}
            <div className="flex gap-3">
              <div className="flex-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2 text-center">
                <Trophy className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <span className="text-lg font-black text-emerald-400">{battleWins}</span>
                <p className="text-[9px] text-muted-foreground">Vitorias</p>
              </div>
              <div className="flex-1 bg-red-500/10 border border-red-500/20 rounded-lg p-2 text-center">
                <Skull className="w-4 h-4 text-red-400 mx-auto mb-1" />
                <span className="text-lg font-black text-red-400">{battleLosses}</span>
                <p className="text-[9px] text-muted-foreground">Derrotas</p>
              </div>
              <div className="flex-1 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2 text-center">
                <Star className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <span className="text-lg font-black text-amber-400">{winRate}%</span>
                <p className="text-[9px] text-muted-foreground">Taxa</p>
              </div>
            </div>
          </div>
        </div>

        {/* Challenges Inbox */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-secondary/30">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-foreground">Desafios</span>
            </div>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">
                {unreadCount} novo{unreadCount > 1 ? "s" : ""}
              </span>
            )}
          </div>

          {!hasTeam ? (
            <div className="p-6 text-center">
              <Shield className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Voce precisa de Pokemon na equipe para aceitar desafios!
              </p>
            </div>
          ) : challenges.length === 0 ? (
            <div className="p-6 text-center">
              <Mail className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Nenhum desafio no momento...
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {challenges.map((challenge) => (
                <button
                  key={challenge.id}
                  onClick={() => {
                    markAsRead(challenge.id);
                    setSelectedChallenge(challenge);
                  }}
                  className={`w-full p-3 text-left transition-colors hover:bg-secondary/50 ${
                    !challenge.read ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Mail Icon */}
                    <div className={`mt-0.5 ${!challenge.read ? "text-primary" : "text-muted-foreground"}`}>
                      {challenge.read ? (
                        <MailOpen className="w-5 h-5" />
                      ) : (
                        <Mail className="w-5 h-5" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-sm font-bold ${!challenge.read ? "text-foreground" : "text-muted-foreground"}`}>
                          {challenge.npcName}
                        </span>
                        <span
                          className="text-[9px] px-1.5 py-0.5 rounded-full font-bold"
                          style={{
                            backgroundColor: `${getDifficultyColor(challenge.difficulty)}20`,
                            color: getDifficultyColor(challenge.difficulty),
                            border: `1px solid ${getDifficultyColor(challenge.difficulty)}40`,
                          }}
                        >
                          {getDifficultyLabel(challenge.difficulty)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {challenge.message}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] text-amber-400 font-mono">
                          +{challenge.xpReward} XP
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono">
                          ${challenge.moneyReward}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {challenge.npcTeam.length} Pokemon
                        </span>
                      </div>
                    </div>

                    {/* Unread indicator */}
                    {!challenge.read && (
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Challenge Detail Dialog */}
      <Dialog open={!!selectedChallenge} onOpenChange={() => setSelectedChallenge(null)}>
        {selectedChallenge && (
          <DialogContent className="bg-card border-border text-foreground max-w-sm mx-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                {selectedChallenge.npcName}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {selectedChallenge.message}
              </DialogDescription>
            </DialogHeader>

            {/* Difficulty Badge */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Dificuldade:</span>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-bold"
                style={{
                  backgroundColor: `${getDifficultyColor(selectedChallenge.difficulty)}20`,
                  color: getDifficultyColor(selectedChallenge.difficulty),
                  border: `1px solid ${getDifficultyColor(selectedChallenge.difficulty)}40`,
                }}
              >
                {getDifficultyLabel(selectedChallenge.difficulty)}
              </span>
            </div>

            {/* NPC Team Preview */}
            <div className="bg-secondary/30 rounded-lg p-3">
              <span className="text-xs font-bold text-foreground mb-2 block">
                Equipe do {selectedChallenge.npcName}:
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedChallenge.npcTeam.map((pokemon, idx) => {
                  const species = getPokemon(pokemon.speciesId);
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 bg-background rounded-lg px-2 py-1 border border-border"
                    >
                      <img
                        src={getSpriteUrl(pokemon.speciesId)}
                        alt={species?.name || "Pokemon"}
                        className="w-8 h-8 pixelated"
                        crossOrigin="anonymous"
                      />
                      <div>
                        <p className="text-[10px] font-bold text-foreground capitalize">
                          {species?.name || "???"}
                        </p>
                        <p className="text-[9px] text-muted-foreground">Nv.{pokemon.level}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rewards */}
            <div className="flex gap-3">
              <div className="flex-1 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2 text-center">
                <span className="text-xs text-muted-foreground">XP</span>
                <p className="text-sm font-bold text-amber-400">+{selectedChallenge.xpReward}</p>
              </div>
              <div className="flex-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2 text-center">
                <span className="text-xs text-muted-foreground">Dinheiro</span>
                <p className="text-sm font-bold text-emerald-400">${selectedChallenge.moneyReward}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  removeChallenge(selectedChallenge.id);
                  setSelectedChallenge(null);
                }}
              >
                Recusar
              </Button>
              <Button
                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                onClick={() => handleAcceptDuel(selectedChallenge)}
                disabled={!hasTeam}
              >
                <Swords className="w-4 h-4 mr-1" />
                Aceitar Duelo
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </ScrollArea>
  );
}

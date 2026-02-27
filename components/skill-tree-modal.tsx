"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Unlock, Swords, Shield, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGameStore, TeamPokemon, battleXpForLevel } from "@/lib/game-store";
import { 
  getSkillTree, 
  generateDefaultSkillTree, 
  canUnlockSkill, 
  SkillNode, 
  SkillTree 
} from "@/lib/skill-tree-data";
import { POKEMON, getMove, getSpriteUrl } from "@/lib/pokemon-data";

interface SkillTreeModalProps {
  pokemon: TeamPokemon;
  onClose: () => void;
}

export function SkillTreeModal({ pokemon, onClose }: SkillTreeModalProps) {
  const { trainer, unlockPokemonSkill, learnMove } = useGameStore();
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);

  // Get or generate skill tree for this pokemon
  const skillTree: SkillTree = useMemo(() => {
    const existing = getSkillTree(pokemon.speciesId);
    if (existing) return existing;

    // Generate default tree from pokemon's move pool
    const species = POKEMON.find((p) => p.id === pokemon.speciesId);
    if (!species) {
      return { speciesId: pokemon.speciesId, swordPath: [], shieldPath: [] };
    }
    return generateDefaultSkillTree(
      pokemon.speciesId,
      species.startingMoves,
      species.learnableMoves
    );
  }, [pokemon.speciesId]);

  const battleXp = trainer.battleXp ?? 0;
  const battleLevel = trainer.battleLevel ?? 1;
  const battlePoints = trainer.battlePoints ?? 0;
  const nextLevelXp = battleXpForLevel(battleLevel + 1);
  const xpProgress = nextLevelXp > 0 ? Math.min(100, (battleXp / nextLevelXp) * 100) : 100;

  const unlockedSkills = pokemon.unlockedSkills ?? [];

  const handleUnlockSkill = (skill: SkillNode) => {
    const result = canUnlockSkill(skill, pokemon.level, unlockedSkills, battlePoints);
    if (!result.canUnlock) return;

    const success = unlockPokemonSkill(pokemon.uid, skill.id, skill.pbCost);
    if (success && skill.moveId) {
      // Also teach the move to the pokemon
      learnMove(pokemon.uid, skill.moveId);
    }
    setSelectedSkill(null);
  };

  const renderSkillNode = (skill: SkillNode, isLast: boolean) => {
    const isUnlocked = unlockedSkills.includes(skill.id);
    const checkResult = canUnlockSkill(skill, pokemon.level, unlockedSkills, battlePoints);
    const canUnlock = checkResult.canUnlock;
    const move = skill.moveId ? getMove(skill.moveId) : null;

    return (
      <div key={skill.id} className="flex flex-col items-center">
        {/* Skill node */}
        <motion.button
          className={`relative w-20 h-20 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${
            isUnlocked
              ? "bg-accent/20 border-accent text-accent"
              : canUnlock
                ? "bg-primary/10 border-primary/50 hover:border-primary text-foreground cursor-pointer"
                : "bg-secondary/30 border-border/50 text-muted-foreground cursor-not-allowed"
          }`}
          onClick={() => !isUnlocked && setSelectedSkill(skill)}
          whileHover={!isUnlocked && canUnlock ? { scale: 1.05 } : {}}
          whileTap={!isUnlocked && canUnlock ? { scale: 0.95 } : {}}
        >
          {/* Lock/Unlock icon */}
          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center">
            {isUnlocked ? (
              <Unlock className="w-3 h-3 text-accent" />
            ) : (
              <Lock className="w-3 h-3 text-muted-foreground" />
            )}
          </div>

          {/* Skill icon or move type */}
          {skill.isPassive ? (
            <Star className="w-5 h-5" />
          ) : move ? (
            <span className="text-lg">{getTypeEmoji(move.type)}</span>
          ) : (
            <Zap className="w-5 h-5" />
          )}

          {/* Skill name */}
          <span className="text-[9px] font-medium text-center leading-tight px-1 line-clamp-2">
            {skill.name}
          </span>
        </motion.button>

        {/* Connector line to next skill */}
        {!isLast && (
          <div className="w-0.5 h-6 bg-border/50 my-1" />
        )}
      </div>
    );
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-2xl bg-background border border-border rounded-2xl overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-secondary/50 border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">POKEMON TEAM-TAB</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="w-8 h-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Trainer Profile Bar */}
        <div className="bg-secondary/30 border-b border-border px-4 py-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-background border border-border">
              <span className="text-xs text-muted-foreground">BATTLE XP:</span>
              <span className="text-sm font-bold text-foreground">{battleXp} / {nextLevelXp}</span>
            </div>
            {/* XP Bar */}
            <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent transition-all duration-300" 
                style={{ width: `${xpProgress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/10 border border-primary/30">
              <span className="text-xs text-muted-foreground">BATTLE LEVEL:</span>
              <span className="text-lg font-bold text-primary">{battleLevel}</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-accent/10 border border-accent/30">
              <span className="text-xs text-muted-foreground">PB (BATTLE POINTS):</span>
              <span className="text-lg font-bold text-accent">{battlePoints}</span>
            </div>
          </div>
        </div>

      {/* Main Content */}
      <ScrollArea className="h-[520px] bg-gradient-to-b from-black via-background to-black">
        <div className="p-6">
          <div className="grid grid-cols-3 gap-6 min-h-[480px]">

            {/* SWORD PATH */}
            <div className="relative bg-red-950/60 border border-red-700/40 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center gap-2 mb-6 pb-3 border-b border-red-700/40">
                <Swords className="w-5 h-5 text-red-400" />
                <h3 className="text-sm font-bold text-red-400 tracking-wide">
                  SWORD PATH
                </h3>
                <span className="text-[10px] text-red-400/60">
                  (ATTACK & OFFENSE)
                </span>
              </div>

              <div className="flex flex-col items-center gap-4 relative">
                {skillTree.swordPath.map((skill, index) =>
                  renderSkillNode(skill, index === skillTree.swordPath.length - 1)
                )}
              </div>
            </div>

            {/* CENTER - POKEMON */}
            <div className="flex flex-col items-center justify-center relative">
              <div className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-transparent via-border to-transparent" />

              <img
                src={getSpriteUrl(pokemon.speciesId)}
                alt={pokemon.name}
                className="w-40 h-40 drop-shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:scale-105 transition-all duration-300"
                crossOrigin="anonymous"
              />

              <p className="text-lg font-bold text-foreground mt-3 tracking-wide">
                {pokemon.name}
              </p>
              <p className="text-xs text-muted-foreground">
                Lv. {pokemon.level}
              </p>
            </div>

            {/* SHIELD PATH */}
            <div className="relative bg-blue-950/60 border border-blue-700/40 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center gap-2 mb-6 pb-3 border-b border-blue-700/40">
                <Shield className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold text-blue-400 tracking-wide">
                  SHIELD PATH
                </h3>
                <span className="text-[10px] text-blue-400/60">
                  (DEFENSE, STATUS, UTILITY)
                </span>
              </div>

              <div className="flex flex-col items-center gap-4 relative">
                {skillTree.shieldPath.map((skill, index) =>
                  renderSkillNode(skill, index === skillTree.shieldPath.length - 1)
                )}
              </div>
            </div>

          </div>
        </div>
      </ScrollArea>
        {/* Skill Detail Modal */}
        <AnimatePresence>
          {selectedSkill && (
            <motion.div
              className="absolute inset-0 bg-black/60 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSkill(null)}
            >
              <motion.div
                className="bg-background border border-border rounded-xl p-4 w-full max-w-xs"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h4 className="text-lg font-bold text-foreground mb-2">{selectedSkill.name}</h4>
                <p className="text-sm text-muted-foreground mb-3">{selectedSkill.description}</p>

                {selectedSkill.isPassive && selectedSkill.passiveEffect && (
                  <div className="bg-accent/10 border border-accent/30 rounded-lg p-2 mb-3">
                    <p className="text-xs font-medium text-accent">
                      Efeito Passivo: {getPassiveDescription(selectedSkill.passiveEffect)}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm mb-4">
                  <span className="text-muted-foreground">Custo:</span>
                  <span className="font-bold text-primary">{selectedSkill.pbCost} PB</span>
                </div>

                <div className="flex items-center justify-between text-sm mb-4">
                  <span className="text-muted-foreground">Nivel requerido:</span>
                  <span className={`font-bold ${pokemon.level >= selectedSkill.levelRequired ? "text-accent" : "text-destructive"}`}>
                    {selectedSkill.levelRequired}
                  </span>
                </div>

                {(() => {
                  const result = canUnlockSkill(selectedSkill, pokemon.level, unlockedSkills, battlePoints);
                  return (
                    <Button
                      className="w-full"
                      disabled={!result.canUnlock}
                      onClick={() => handleUnlockSkill(selectedSkill)}
                    >
                      {result.canUnlock ? "Desbloquear" : result.reason}
                    </Button>
                  );
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// Helper function to get type emoji
function getTypeEmoji(type: string): string {
  const emojis: Record<string, string> = {
    normal: "⚪",
    fire: "🔥",
    water: "💧",
    electric: "⚡",
    grass: "🌿",
    ice: "❄️",
    fighting: "👊",
    poison: "☠️",
    ground: "🏜️",
    flying: "🦅",
    psychic: "🔮",
    bug: "🐛",
    rock: "🪨",
    ghost: "👻",
    dragon: "🐉",
    dark: "🌑",
    steel: "⚙️",
    fairy: "✨",
  };
  return emojis[type] || "⚪";
}

// Helper function to get passive effect description
function getPassiveDescription(effect: { type: string; condition?: string }): string {
  const descriptions: Record<string, string> = {
    double_damage: "Dano dobrado",
    double_xp: "XP dobrado",
    double_defense: effect.condition === "vs_grass_ice" 
      ? "Defesa dobrada contra Grass/Ice" 
      : "Defesa dobrada",
    dot: "Causa dano ao longo do tempo",
    buff: "Aumenta atributos",
  };
  return descriptions[effect.type] || effect.type;
}

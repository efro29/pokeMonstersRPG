"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useGameStore, battleXpForLevel } from "@/lib/game-store";
import {
  getSpriteUrl,
  getBattleSpriteUrl,
  getMove,
  TYPE_COLORS,
  BAG_ITEMS,
  getHitResultLabel,
  getHitResultColor,
  computeAttributes,
  calculateBattleDamage,
  getDamageMultiplier,
  getPokemon,
} from "@/lib/pokemon-data";
import type { PokemonType, HitResult, PokemonSpecies, Move } from "@/lib/pokemon-data";
import { D20Dice } from "./d20-dice";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { BattleParticles } from "./battle-particles";
import { kantoPokemonSizes } from "@/lib/kantoPokemonSizes";
import {
  Swords,
  ChevronLeft,
  Backpack,
  Heart,
  Shield,
  Zap,
  RefreshCw,
  CircleDot,
  Flame,
  Droplets,
  Leaf,
  Snowflake,
  Mountain,
  Brain,
  Ghost,
  Star,
  Circle,
  Wind,
  Sword,
  Bug,
  Skull,
  Cog,
  Footprints,
  Trophy,
  XCircle,
} from "lucide-react";
import {
  playAttack,
  playAttackHit,
  playCriticalHit,
  playMiss,
  playCriticalMiss,
  playDamageReceived,
  playDiceRoll,
  playButtonClick,
  playHeal,
  playSendPokemon,
  playVictoryFanfare,
} from "@/lib/sounds";
import type { NpcChallenge } from "./challenges-tab";

// ─── Types ─────────────────────────────────────────────────
type BattlePhase =
  | "intro"
  | "menu"
  | "attack-select"
  | "rolling"
  | "result"
  | "enemy-turn"
  | "enemy-result"
  | "bag"
  | "switch"
  | "npc-switch"
  | "player-fainted"
  | "npc-fainted"
  | "victory"
  | "defeated";

interface NpcPokemonState {
  speciesId: number;
  name: string;
  level: number;
  maxHp: number;
  currentHp: number;
  moves: { moveId: string; currentPP: number; maxPP: number }[];
  types: PokemonType[];
}

interface Props {
  challenge: NpcChallenge;
  onEnd: (won: boolean) => void;
}

// ─── Helpers ───────────────────────────────────────────────
function getBackSpriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/${id}.gif`;
}

const ATTACK_EFFECT_ICONS: Record<string, { icon: string; color: string }> = {
  fire: { icon: "🔥", color: "#EF4444" },
  water: { icon: "💧", color: "#3B82F6" },
  grass: { icon: "🍃", color: "#22C55E" },
  electric: { icon: "⚡", color: "#EAB308" },
  ice: { icon: "❄️", color: "#67E8F9" },
  fighting: { icon: "👊", color: "#C2410C" },
  poison: { icon: "☠️", color: "#A855F7" },
  ground: { icon: "🌍", color: "#92400E" },
  flying: { icon: "🌪️", color: "#93C5FD" },
  psychic: { icon: "🔮", color: "#EC4899" },
  bug: { icon: "🐛", color: "#84CC16" },
  rock: { icon: "🪨", color: "#78716C" },
  ghost: { icon: "👻", color: "#7C3AED" },
  dragon: { icon: "🐉", color: "#6366F1" },
  dark: { icon: "🌑", color: "#1F2937" },
  steel: { icon: "🛡️", color: "#9CA3AF" },
  fairy: { icon: "✨", color: "#F9A8D4" },
  normal: { icon: "💥", color: "#A8A29E" },
};

function createNpcPokemon(speciesId: number, level: number): NpcPokemonState {
  const species = getPokemon(speciesId);
  if (!species) {
    return {
      speciesId,
      name: "???",
      level,
      maxHp: 50,
      currentHp: 50,
      moves: [],
      types: ["normal"] as PokemonType[],
    };
  }
  const baseHp = species.baseHp || 40;
  const maxHp = baseHp + level * 3;
  const startMoves = (species.startingMoves || []).slice(0, 4);
  return {
    speciesId,
    name: species.name,
    level,
    maxHp,
    currentHp: maxHp,
    moves: startMoves.map((mId) => {
      const m = getMove(mId);
      return { moveId: mId, currentPP: m?.pp ?? 10, maxPP: m?.pp ?? 10 };
    }),
    types: species.types as PokemonType[],
  };
}

// ─── Component ─────────────────────────────────────────────
export function NpcBattleScene({ challenge, onEnd }: Props) {
  const {
    team,
    bag,
    trainer,
    startBattle,
    endBattle,
    useBagItem,
    battle,
    applyOpponentDamage,
    switchBattlePokemon,
    addXp,
    addPokemonBattleHistory,
    addTrainerBattleHistory,
    recordBattleResult,
    addMoney,
  } = useGameStore();

  // ─── NPC Team State ───────────────────────────────────
  const [npcTeam, setNpcTeam] = useState<NpcPokemonState[]>(() =>
    challenge.team.map((p) => createNpcPokemon(p.speciesId, p.level))
  );
  const [activeNpcIndex, setActiveNpcIndex] = useState(0);

  // ─── Local state ───────────────────────────────────────
  const [phase, setPhase] = useState<BattlePhase>("intro");
  const [selectedMoveId, setSelectedMoveId] = useState<string | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [diceRoll, setDiceRoll] = useState<number | null>(null);
  const [hitResult, setHitResult] = useState<HitResult | null>(null);
  const [damageDealt, setDamageDealt] = useState<number | null>(null);
  const [battleLog, setBattleLog] = useState<string[]>([
    `${challenge.npcName} quer batalhar!`,
    `"${challenge.message}"`,
  ]);
  const [showPlayerParticles, setShowPlayerParticles] = useState(false);
  const [showNpcParticles, setShowNpcParticles] = useState(false);
  const [playerAttacking, setPlayerAttacking] = useState(false);
  const [npcAttacking, setNpcAttacking] = useState(false);
  const [npcShake, setNpcShake] = useState(false);
  const [playerShake, setPlayerShake] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [showBagDialog, setShowBagDialog] = useState(false);
  const [enemyMoveUsed, setEnemyMoveUsed] = useState<string | null>(null);
  const [enemyDamage, setEnemyDamage] = useState<number | null>(null);
  const [enemyHitResult, setEnemyHitResult] = useState<HitResult | null>(null);
  const [turnNumber, setTurnNumber] = useState(1);
  const [totalXpGained, setTotalXpGained] = useState(0);
  const [attackEffect, setAttackEffect] = useState<{ type: PokemonType | null; side: "player" | "npc" } | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const addLog = useCallback((msg: string) => {
    setBattleLog((prev) => [...prev, msg]);
  }, []);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [battleLog]);

  // Init battle in store
  const initRef = useRef(false);
  useEffect(() => {
    if (!initRef.current && team.length > 0) {
      initRef.current = true;
      const firstAlive = team.find((p) => p.currentHp > 0);
      if (firstAlive) {
        startBattle(firstAlive.uid);
        // Start intro animation
        setTimeout(() => {
          playSendPokemon();
          addLog(`${challenge.npcName} enviou ${npcTeam[0].name}!`);
          addLog(`Va, ${firstAlive.name}!`);
          setPhase("menu");
        }, 1500);
      }
    }
  }, [team, startBattle, challenge.npcName, npcTeam, addLog]);

  const trainerAttrs = trainer.attributes || { combate: 0, afinidade: 0, sorte: 0, furtividade: 0, percepcao: 0, carisma: 0 };
  const combateBonus = Math.floor(trainerAttrs.combate / 2);
  const critExpansion = Math.floor(trainerAttrs.sorte / 2);
  const critThreshold = Math.max(15, 20 - critExpansion);

  const pokemon = team.find((p) => p.uid === battle.activePokemonUid);
  const hpPercent = pokemon ? (pokemon.currentHp / pokemon.maxHp) * 100 : 0;
  const hpColor = hpPercent > 50 ? "#22C55E" : hpPercent > 25 ? "#F59E0B" : "#EF4444";
  const isFainted = pokemon ? pokemon.currentHp <= 0 : true;

  const npc = npcTeam[activeNpcIndex];
  const npcHpPercent = npc ? (npc.currentHp / npc.maxHp) * 100 : 0;
  const npcHpColor = npcHpPercent > 50 ? "#22C55E" : npcHpPercent > 25 ? "#F59E0B" : "#EF4444";

  const playerSize = kantoPokemonSizes[pokemon?.speciesId ?? 0] ?? { width: 80, height: 80 };
  const npcSize = kantoPokemonSizes[npc?.speciesId ?? 0] ?? { width: 80, height: 80 };

  // Count remaining Pokemon
  const playerAliveCount = team.filter((p) => p.currentHp > 0).length;
  const npcAliveCount = npcTeam.filter((p) => p.currentHp > 0).length;

  // ─── Player Attack ────────────────────────────────────
  const handleAttackSelect = (moveId: string) => {
    const moveData = pokemon?.moves.find((m) => m.moveId === moveId);
    if (!moveData || moveData.currentPP <= 0) {
      addLog(`${pokemon?.name} nao tem PP para usar esse golpe!`);
      return;
    }

    // Consume 1 PP
    const { team: currentTeam } = useGameStore.getState();
    useGameStore.setState({
      team: currentTeam.map((p) =>
        p.uid === pokemon?.uid
          ? {
              ...p,
              moves: p.moves.map((m) =>
                m.moveId === moveId ? { ...m, currentPP: m.currentPP - 1 } : m
              ),
            }
          : p
      ),
    });

    setSelectedMoveId(moveId);
    setPhase("rolling");
    setIsRolling(true);
    playAttack();
    playDiceRoll();
  };

  const handleDiceResult = useCallback(
    (roll: number) => {
      setIsRolling(false);
      setDiceRoll(roll);

      const move = getMove(selectedMoveId || "");
      if (!move || !pokemon || !npc) return;

      const effectiveRoll = roll + combateBonus;
      let hr: HitResult;
      if (roll === 1) hr = "critical-miss";
      else if (roll >= critThreshold) hr = "critical-hit";
      else if (effectiveRoll >= move.accuracy + 5) hr = "strong-hit";
      else if (effectiveRoll >= move.accuracy) hr = "hit";
      else hr = "miss";

      setHitResult(hr);

      if (hr === "critical-hit") playCriticalHit();
      else if (hr === "strong-hit" || hr === "hit") playAttackHit();
      else if (hr === "miss") playMiss();
      else if (hr === "critical-miss") playCriticalMiss();

      setPlayerAttacking(true);
      setTimeout(() => setPlayerAttacking(false), 400);

      setAttackEffect({ type: move.type as PokemonType, side: "npc" });
      setTimeout(() => setAttackEffect(null), 800);

      const pokemonAttrs = computeAttributes(pokemon.speciesId, pokemon.level, pokemon.customAttributes);
      const npcAttrs = computeAttributes(npc.speciesId, npc.level);
      const breakdown = calculateBattleDamage(move, hr, pokemonAttrs, npcAttrs.defesa, pokemon.level, npc.level);
      const finalDmg = breakdown.finalDamage;
      setDamageDealt(finalDmg);

      if (finalDmg > 0) {
        setTimeout(() => {
          setNpcShake(true);
          setShowNpcParticles(true);
          playDamageReceived();
          setNpcTeam((prev) =>
            prev.map((p, i) =>
              i === activeNpcIndex ? { ...p, currentHp: Math.max(0, p.currentHp - finalDmg) } : p
            )
          );
          setTimeout(() => {
            setNpcShake(false);
            setShowNpcParticles(false);
          }, 600);
        }, 300);

        addLog(`${pokemon.name} usou ${move.name}! Rolou ${roll} - ${getHitResultLabel(hr)}! ${finalDmg} de dano!`);
      } else {
        addLog(`${pokemon.name} usou ${move.name}! Rolou ${roll} - ${getHitResultLabel(hr)}! Errou!`);
      }

      setPhase("result");
    },
    [selectedMoveId, pokemon, combateBonus, critThreshold, npc, activeNpcIndex, addLog]
  );

  // Check NPC pokemon fainted
  useEffect(() => {
    if (npc && npc.currentHp <= 0 && phase === "result") {
      setTimeout(() => {
        const reward = npc.level * 35;
        setTotalXpGained((prev) => prev + reward);
        addLog(`${npc.name} do oponente desmaiou!`);

        if (pokemon) {
          addXp(pokemon.uid, reward);
          addLog(`${pokemon.name} ganhou ${reward} XP!`);
          addPokemonBattleHistory(pokemon.uid, {
            type: "victory",
            date: new Date().toISOString(),
            xpGained: reward,
            opponentName: `${npc.name} de ${challenge.npcName}`,
          });
        }

        // Check if NPC has more Pokemon
        const nextNpcIndex = npcTeam.findIndex((p, i) => i > activeNpcIndex && p.currentHp > 0);
        if (nextNpcIndex === -1) {
          // Player wins!
          setPhase("victory");
        } else {
          setPhase("npc-switch");
          setTimeout(() => {
            setActiveNpcIndex(nextNpcIndex);
            playSendPokemon();
            addLog(`${challenge.npcName} enviou ${npcTeam[nextNpcIndex].name}!`);
            setTimeout(() => setPhase("menu"), 1000);
          }, 1000);
        }
      }, 1200);
    }
  }, [npc, phase, pokemon, addXp, addLog, addPokemonBattleHistory, challenge.npcName, npcTeam, activeNpcIndex]);

  // ─── Enemy Turn ────────────────────────────────────────
  const executeEnemyTurn = useCallback(() => {
    if (!npc || npc.currentHp <= 0) return;
    setPhase("enemy-turn");

    const availableMoves = npc.moves.filter((m) => m.currentPP > 0);
    if (availableMoves.length === 0) {
      addLog(`${npc.name} nao tem mais movimentos!`);
      setTimeout(() => setPhase("menu"), 1000);
      return;
    }

    const chosen = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    const move = getMove(chosen.moveId);
    if (!move || !pokemon) {
      setPhase("menu");
      return;
    }

    // Consume PP
    setNpcTeam((prev) =>
      prev.map((p, i) =>
        i === activeNpcIndex
          ? {
              ...p,
              moves: p.moves.map((m) =>
                m.moveId === chosen.moveId ? { ...m, currentPP: m.currentPP - 1 } : m
              ),
            }
          : p
      )
    );

    setEnemyMoveUsed(move.name);

    setTimeout(() => {
      setNpcAttacking(true);
      playAttack();
      setAttackEffect({ type: move.type as PokemonType, side: "player" });
      setTimeout(() => {
        setNpcAttacking(false);
        setAttackEffect(null);
      }, 600);
    }, 500);

    const enemyRoll = Math.floor(Math.random() * 20) + 1;
    let eHr: HitResult;
    if (enemyRoll === 1) eHr = "critical-miss";
    else if (enemyRoll >= 19) eHr = "critical-hit";
    else if (enemyRoll >= move.accuracy + 3) eHr = "strong-hit";
    else if (enemyRoll >= move.accuracy) eHr = "hit";
    else eHr = "miss";

    setEnemyHitResult(eHr);

    const npcAttrs = computeAttributes(npc.speciesId, npc.level);
    const pokemonAttrs = pokemon ? computeAttributes(pokemon.speciesId, pokemon.level, pokemon.customAttributes) : npcAttrs;
    const breakdown = calculateBattleDamage(move, eHr, npcAttrs, pokemonAttrs.defesa, npc.level, pokemon?.level || 5);
    const finalDmg = breakdown.finalDamage;

    setTimeout(() => {
      if (finalDmg > 0 && pokemon) {
        setPlayerShake(true);
        setShowPlayerParticles(true);
        playDamageReceived();
        applyOpponentDamage(finalDmg);
        setTimeout(() => {
          setPlayerShake(false);
          setShowPlayerParticles(false);
        }, 600);
        setEnemyDamage(finalDmg);
        addLog(`${npc.name} usou ${move.name}! Rolou ${enemyRoll} - ${getHitResultLabel(eHr)}! ${finalDmg} de dano!`);
      } else {
        setEnemyDamage(0);
        addLog(`${npc.name} usou ${move.name}! Rolou ${enemyRoll} - ${getHitResultLabel(eHr)}! Errou!`);
      }

      setPhase("enemy-result");

      setTimeout(() => {
        const currentTeam = useGameStore.getState().team;
        const activePoke = currentTeam.find((p) => p.uid === battle.activePokemonUid);
        if (activePoke && activePoke.currentHp <= 0) {
          addPokemonBattleHistory(activePoke.uid, {
            type: "faint",
            date: new Date().toISOString(),
            opponentName: `${npc.name} de ${challenge.npcName}`,
          });
          const nextAlive = currentTeam.find((p) => p.currentHp > 0);
          if (!nextAlive) {
            addLog("Todos os seus Pokemon desmaiaram!");
            setPhase("defeated");
          } else {
            addLog(`${activePoke.name} desmaiou! Troque de Pokemon!`);
            setPhase("switch");
          }
        } else {
          setTurnNumber((t) => t + 1);
          setPhase("menu");
        }
      }, 1500);
    }, 1000);
  }, [npc, pokemon, battle.activePokemonUid, applyOpponentDamage, addLog, activeNpcIndex, addPokemonBattleHistory, challenge.npcName]);

  // ─── End Turn ──────────────────────────────────────────
  const handleEndTurn = () => {
    playButtonClick();
    addLog(`--- Fim do Turno ${turnNumber} ---`);
    executeEnemyTurn();
  };

  // ─── Switch Pokemon ───────────────────────────────────
  const handleSwitchPokemon = (uid: string) => {
    if (uid === battle.activePokemonUid) return;
    const target = team.find((p) => p.uid === uid);
    if (!target || target.currentHp <= 0) return;
    setIsSwitching(true);
    playSendPokemon();
    addLog(`Trocou para ${target.name}!`);
    setTimeout(() => {
      switchBattlePokemon(uid);
      setIsSwitching(false);
      if (phase === "switch") {
        setTurnNumber((t) => t + 1);
        setPhase("menu");
      } else {
        setPhase("menu");
      }
    }, 500);
  };

  // ─── Bag Use ──────────────────────────────────────────
  const handleUseBagItem = (itemId: string) => {
    const def = BAG_ITEMS.find((d) => d.id === itemId);
    if (def && pokemon) {
      useBagItem(itemId, pokemon.uid);
      addLog(`Usou ${def.name}!`);
      playHeal();
    }
    setShowBagDialog(false);
    executeEnemyTurn();
  };

  // ─── Continue after result ────────────────────────────
  const handleContinueAfterResult = () => {
    if (npc && npc.currentHp <= 0) return;
    executeEnemyTurn();
  };

  // ─── Handle Victory ───────────────────────────────────
  const handleVictory = () => {
    playVictoryFanfare();
    // Record battle result
    recordBattleResult(true, challenge.xpReward);
    addMoney(challenge.moneyReward);
    addTrainerBattleHistory({
      type: "npc-battle",
      date: new Date().toISOString(),
      won: true,
      opponentName: challenge.npcName,
      xpGained: challenge.xpReward,
      moneyGained: challenge.moneyReward,
    });
    endBattle();
    onEnd(true);
  };

  // ─── Handle Defeat ────────────────────────────────────
  const handleDefeat = () => {
    recordBattleResult(false, Math.floor(challenge.xpReward / 4));
    addTrainerBattleHistory({
      type: "npc-battle",
      date: new Date().toISOString(),
      won: false,
      opponentName: challenge.npcName,
      xpGained: 0,
      moneyGained: 0,
    });
    endBattle();
    onEnd(false);
  };

  if (!pokemon && phase !== "defeated" && phase !== "victory") {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-background p-6">
        <p className="text-muted-foreground mb-4">Nenhum Pokemon disponivel para batalha.</p>
        <Button onClick={() => onEnd(false)}>Voltar</Button>
      </div>
    );
  }

  // ─── RENDER ───────────────────────────────────────────
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Top nav */}
      <nav className="flex items-center justify-between px-2 py-1.5 bg-card border-b border-border gap-1">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 bg-secondary/50 rounded px-1.5 py-0.5">
            <RefreshCw className="w-3 h-3 text-muted-foreground" />
            <span className="text-[10px] font-bold text-muted-foreground">Turno: {turnNumber}</span>
          </div>
        </div>

        <span className="text-[10px] font-bold text-red-400">vs {challenge.npcName}</span>

        <div className="flex items-center gap-1">
          {/* Pokemon count indicators */}
          <div className="flex items-center gap-0.5 mr-2">
            {npcTeam.map((p, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${p.currentHp > 0 ? "bg-red-500" : "bg-gray-500"}`}
              />
            ))}
          </div>
          <Button
            size="sm"
            onClick={handleEndTurn}
            disabled={phase !== "menu" && phase !== "attack-select"}
            className="h-7 px-2 text-[9px] font-bold bg-amber-500/90 hover:bg-amber-500 text-black gap-0.5"
          >
            Passar
          </Button>
        </div>
      </nav>

      {/* Arena */}
      <div className="relative flex-1 overflow-hidden">
        <div className="relative w-full" style={{ height: 280 }}>
          {/* BG Arena */}
          <img
            src="/images/arenas/campo3.jpg"
            alt="Arena"
            className="w-full h-full object-fill"
            style={{ imageRendering: "pixelated" }}
            crossOrigin="anonymous"
          />

          {/* NPC Pokemon (top right - front sprite) */}
          {npc && (
            <div className="absolute flex flex-col items-center" style={{ top: 15, right: 15 }}>
              <div className="flex items-center gap-1 mb-1 bg-black/70 rounded-lg px-2 py-0.5 backdrop-blur-sm">
                <span className="text-[9px] font-bold text-white">{npc.name}</span>
                <span className="text-[8px] text-gray-300">Lv.{npc.level}</span>
              </div>
              <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden mb-1">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: npcHpColor }}
                  animate={{ width: `${npcHpPercent}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <span className="text-[8px] text-white/80 font-mono bg-black/40 rounded px-1">
                {npc.currentHp}/{npc.maxHp}
              </span>
              <div className="relative mt-1">
                {showNpcParticles && <BattleParticles effectType="damage" isAnimating={true} />}
                <AnimatePresence>
                  {npcShake && (
                    <motion.div
                      className="absolute inset-0 bg-white rounded-full z-10"
                      initial={{ opacity: 0.8 }}
                      animate={{ opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </AnimatePresence>
                <motion.img
                  src={getBattleSpriteUrl(npc.speciesId)}
                  alt={npc.name}
                  width={npcSize.width}
                  height={npcSize.height}
                  style={{ imageRendering: "auto", minWidth: 60, minHeight: 60 }}
                  crossOrigin="anonymous"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getSpriteUrl(npc.speciesId);
                  }}
                  animate={
                    npcShake
                      ? { x: [0, -8, 8, -6, 6, -3, 3, 0], opacity: [1, 0.5, 1, 0.5, 1] }
                      : npcAttacking
                      ? { x: [0, -30, -30, 0], transition: { duration: 0.4 } }
                      : npc.currentHp <= 0
                      ? { opacity: 0.3, y: 15, rotate: -20 }
                      : { opacity: 1, y: [0, -3, 0], transition: { duration: 2, repeat: Infinity } }
                  }
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}

          {/* Player Pokemon (bottom left - BACK sprite) */}
          {pokemon && (
            <div className="absolute flex flex-col items-center" style={{ bottom: 10, left: 15 }}>
              <div className="relative">
                {showPlayerParticles && <BattleParticles effectType="damage" isAnimating={true} />}
                <AnimatePresence>
                  {playerShake && (
                    <motion.div
                      className="absolute inset-0 bg-white rounded-full z-10"
                      initial={{ opacity: 0.8 }}
                      animate={{ opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </AnimatePresence>
                <motion.img
                  src={getBackSpriteUrl(pokemon.speciesId)}
                  alt={pokemon.name}
                  width={Math.round(playerSize.width * 1.3)}
                  height={Math.round(playerSize.height * 1.3)}
                  style={{ imageRendering: "auto", minWidth: 70, minHeight: 70 }}
                  crossOrigin="anonymous"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.src = getBattleSpriteUrl(pokemon.speciesId);
                    img.style.transform = "scaleX(-1)";
                  }}
                  animate={
                    playerShake
                      ? { x: [0, 6, -6, 4, -4, 2, -2, 0], opacity: [1, 0.5, 1, 0.5, 1] }
                      : playerAttacking
                      ? { x: [0, 40, 40, 0], y: [0, -10, -10, 0], transition: { duration: 0.4 } }
                      : isSwitching
                      ? { opacity: 0, scale: 0.3 }
                      : isFainted
                      ? { opacity: 0.3, y: 15, rotate: 20 }
                      : { opacity: 1, y: 0, scale: 1 }
                  }
                />
              </div>
              <div className="flex items-center gap-1 mt-1 bg-black/70 rounded-lg px-2 py-0.5 backdrop-blur-sm">
                <span className="text-[9px] font-bold text-white">{pokemon.name}</span>
                <span className="text-[8px] text-gray-300">Lv.{pokemon.level}</span>
              </div>
              <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden mt-0.5">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: hpColor }}
                  animate={{ width: `${hpPercent}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <span className="text-[8px] text-white/80 font-mono bg-black/40 rounded px-1 mt-0.5">
                {pokemon.currentHp}/{pokemon.maxHp}
              </span>
            </div>
          )}

          {/* Player team indicators */}
          <div className="absolute bottom-2 right-2 flex gap-0.5">
            {team.slice(0, 6).map((p, i) => (
              <div
                key={p.uid}
                className={`w-2 h-2 rounded-full ${p.currentHp > 0 ? "bg-green-500" : "bg-gray-500"}`}
              />
            ))}
          </div>

          {/* Type effect overlay */}
          <AnimatePresence>
            {attackEffect && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.span
                  className="text-6xl"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.5, 1] }}
                  exit={{ scale: 0, opacity: 0 }}
                  style={{
                    position: "absolute",
                    top: attackEffect.side === "npc" ? "25%" : "60%",
                    left: attackEffect.side === "npc" ? "70%" : "20%",
                  }}
                >
                  {ATTACK_EFFECT_ICONS[attackEffect.type || "normal"]?.icon || "💥"}
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dice overlay */}
          <AnimatePresence>
            {phase === "rolling" && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <D20Dice
                  onResult={handleDiceResult}
                  combateBonus={combateBonus}
                  isRolling={isRolling}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Battle Log */}
      <div
        ref={logRef}
        className="h-20 overflow-y-auto px-3 py-2 bg-card/80 border-t border-border text-[10px] leading-relaxed"
      >
        {battleLog.map((msg, i) => (
          <p key={i} className={msg.startsWith("---") ? "text-muted-foreground italic" : "text-foreground"}>
            {msg}
          </p>
        ))}
      </div>

      {/* Controls */}
      <div className="p-2 bg-card border-t border-border">
        {/* Intro Phase */}
        {phase === "intro" && (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">Preparando batalha...</p>
          </div>
        )}

        {/* Menu Phase */}
        {phase === "menu" && pokemon && (
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => setPhase("attack-select")}
              className="h-12 bg-red-600 hover:bg-red-700 text-white font-bold"
            >
              <Swords className="w-4 h-4 mr-2" />
              Lutar
            </Button>
            <Button
              onClick={() => setShowBagDialog(true)}
              variant="outline"
              className="h-12 font-bold"
            >
              <Backpack className="w-4 h-4 mr-2" />
              Mochila
            </Button>
            <Button
              onClick={() => setPhase("switch")}
              variant="outline"
              className="h-12 font-bold col-span-2"
              disabled={playerAliveCount <= 1}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Trocar Pokemon
            </Button>
          </div>
        )}

        {/* Attack Select */}
        {phase === "attack-select" && pokemon && (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPhase("menu")}
                className="h-6 px-2 text-xs"
              >
                <ChevronLeft className="w-3 h-3 mr-1" />
                Voltar
              </Button>
              <span className="text-[10px] text-muted-foreground">Escolha um golpe</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {pokemon.moves.map((m) => {
                const move = getMove(m.moveId);
                if (!move) return null;
                const typeColor = TYPE_COLORS[move.type] || "#888";
                const hasNoPP = m.currentPP <= 0;
                return (
                  <Button
                    key={m.moveId}
                    onClick={() => handleAttackSelect(m.moveId)}
                    disabled={hasNoPP}
                    className="h-14 flex flex-col items-start justify-center px-2 py-1"
                    style={{
                      backgroundColor: hasNoPP ? "#333" : typeColor,
                      opacity: hasNoPP ? 0.5 : 1,
                    }}
                  >
                    <span className="text-[11px] font-bold text-white truncate w-full text-left">
                      {move.name}
                    </span>
                    <div className="flex items-center gap-2 text-[9px] text-white/80">
                      <span>PP: {m.currentPP}/{m.maxPP}</span>
                      <span>Poder: {move.power || "-"}</span>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {/* Result Phase */}
        {phase === "result" && (
          <div className="text-center py-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              {hitResult && (
                <span
                  className="px-3 py-1 rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: getHitResultColor(hitResult) }}
                >
                  {getHitResultLabel(hitResult)}
                </span>
              )}
              {damageDealt !== null && damageDealt > 0 && (
                <span className="text-lg font-bold text-red-400">-{damageDealt} HP</span>
              )}
            </div>
            <Button onClick={handleContinueAfterResult} className="w-full">
              Continuar
            </Button>
          </div>
        )}

        {/* Enemy Turn / Result */}
        {(phase === "enemy-turn" || phase === "enemy-result") && (
          <div className="text-center py-3">
            <p className="text-sm text-muted-foreground">
              {phase === "enemy-turn" ? `${npc?.name} esta atacando...` : ""}
            </p>
            {phase === "enemy-result" && enemyHitResult && (
              <div className="flex items-center justify-center gap-2 mt-1">
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: getHitResultColor(enemyHitResult) }}
                >
                  {getHitResultLabel(enemyHitResult)}
                </span>
                {enemyDamage !== null && enemyDamage > 0 && (
                  <span className="text-sm font-bold text-red-400">-{enemyDamage} HP</span>
                )}
              </div>
            )}
          </div>
        )}

        {/* NPC Switch */}
        {phase === "npc-switch" && (
          <div className="text-center py-3">
            <p className="text-sm text-muted-foreground">{challenge.npcName} esta trocando de Pokemon...</p>
          </div>
        )}

        {/* Switch Phase */}
        {phase === "switch" && (
          <div className="space-y-2">
            <p className="text-xs text-center text-muted-foreground mb-2">Escolha um Pokemon</p>
            <div className="grid grid-cols-3 gap-1.5 max-h-32 overflow-y-auto">
              {team.map((p) => {
                const isActive = p.uid === battle.activePokemonUid;
                const isFaint = p.currentHp <= 0;
                return (
                  <Button
                    key={p.uid}
                    onClick={() => handleSwitchPokemon(p.uid)}
                    disabled={isActive || isFaint}
                    variant={isActive ? "default" : "outline"}
                    className="h-16 flex flex-col items-center justify-center p-1"
                  >
                    <img
                      src={getSpriteUrl(p.speciesId)}
                      alt={p.name}
                      className="w-8 h-8"
                      style={{ opacity: isFaint ? 0.3 : 1 }}
                    />
                    <span className="text-[9px] truncate w-full text-center">{p.name}</span>
                    <span className="text-[8px] text-muted-foreground">
                      {p.currentHp}/{p.maxHp}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {/* Victory */}
        {phase === "victory" && (
          <div className="text-center py-4">
            <Trophy className="w-12 h-12 mx-auto text-amber-400 mb-2" />
            <p className="text-lg font-bold text-green-400 mb-1">Vitoria!</p>
            <p className="text-sm text-muted-foreground mb-1">
              Voce derrotou {challenge.npcName}!
            </p>
            <div className="flex items-center justify-center gap-4 text-sm mb-3">
              <span className="text-amber-400">+{challenge.xpReward} XP</span>
              <span className="text-green-400">+${challenge.moneyReward}</span>
            </div>
            <Button onClick={handleVictory} className="w-full bg-green-600 hover:bg-green-700">
              Continuar
            </Button>
          </div>
        )}

        {/* Defeated */}
        {phase === "defeated" && (
          <div className="text-center py-4">
            <XCircle className="w-12 h-12 mx-auto text-red-400 mb-2" />
            <p className="text-lg font-bold text-red-400 mb-1">Derrota...</p>
            <p className="text-sm text-muted-foreground mb-3">
              Todos os seus Pokemon desmaiaram.
            </p>
            <Button onClick={handleDefeat} variant="outline" className="w-full">
              Continuar
            </Button>
          </div>
        )}

        {/* Bag Dialog */}
        {showBagDialog && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-xl p-4 w-full max-w-sm max-h-[60vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold">Mochila</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowBagDialog(false)}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {bag.filter((item) => {
                  const def = BAG_ITEMS.find((d) => d.id === item.itemId);
                  return def && def.usableInBattle;
                }).length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhum item utilizavel em batalha.
                  </p>
                ) : (
                  bag
                    .filter((item) => {
                      const def = BAG_ITEMS.find((d) => d.id === item.itemId);
                      return def && def.usableInBattle;
                    })
                    .map((item) => {
                      const def = BAG_ITEMS.find((d) => d.id === item.itemId);
                      return (
                        <Button
                          key={item.itemId}
                          onClick={() => handleUseBagItem(item.itemId)}
                          variant="outline"
                          className="w-full justify-between h-12"
                        >
                          <span>{def?.name}</span>
                          <span className="text-muted-foreground">x{item.quantity}</span>
                        </Button>
                      );
                    })
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

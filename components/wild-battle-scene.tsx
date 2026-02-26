"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useGameStore, PA_CONFIG } from "@/lib/game-store";
import type { PAActionType } from "@/lib/game-store";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { BattleCards } from "./battle-cards";
import { BattleParticles } from "./battle-particles";
import { kantoPokemonSizes } from "@/lib/kantoPokemonSizes";
import {
  Swords,
  ChevronLeft,
  Backpack,
  Heart,
  Shield,
  Zap,
  SkipForward,
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
} from "lucide-react";
import {
  playAttack,
  playAttackHit,
  playCriticalHit,
  playMiss,
  playCriticalMiss,
  playDamageReceived,
  playPokeball,
  playDiceRoll,
  playButtonClick,
  playFlee,
  playHeal,
  playSendPokemon,
} from "@/lib/sounds";

// ─── Types ─────────────────────────────────────────────────
type WildPhase =
  | "menu"
  | "attack-select"
  | "rolling"
  | "result"
  | "enemy-turn"
  | "enemy-result"
  | "bag"
  | "pokeball-select"
  | "shaking"
  | "captured"
  | "escaped"
  | "switch"
  | "wild-fainted"
  | "defeated";

interface WildPokemonState {
  speciesId: number;
  name: string;
  level: number;
  maxHp: number;
  currentHp: number;
  moves: { moveId: string; currentPP: number; maxPP: number }[];
  types: PokemonType[];
}

interface Props {
  wildPokemon: PokemonSpecies;
  wildLevel: number;
  onClose: () => void;
  onCapture: (speciesId: number, ballsUsed: number) => void;
  onFled: () => void;
}

// ─── Helpers ───────────────────────────────────────────────
function getCaptureDC(baseHp: number, ballId: string, hpPercent: number): number {
  const baseDC = Math.min(18, Math.max(13, Math.floor(6 + baseHp / 15)));
  const ballReduction: Record<string, number> = {
    pokeball: 0,
    "great-ball": 2,
    "ultra-ball": 4,
    "master-ball": 99,
  };
  let dc = Math.max(2, baseDC - (ballReduction[ballId] ?? 0));
  if (hpPercent <= 25) dc -= 4;
  else if (hpPercent <= 50) dc -= 2;
  return Math.max(2, dc);
}

function rollDiceString(diceStr: string): { rolls: number[]; sum: number } {
  const match = diceStr.match(/(\d+)d(\d+)(?:\+(\d+))?/);
  if (!match) return { rolls: [], sum: 0 };
  const count = parseInt(match[1]);
  const sides = parseInt(match[2]);
  const bonus = parseInt(match[3] || "0");
  const rolls: number[] = [];
  for (let i = 0; i < count; i++) {
    rolls.push(Math.floor(Math.random() * sides) + 1);
  }
  return { rolls, sum: rolls.reduce((a, b) => a + b, 0) + bonus };
}

const BALL_DATA: Record<string, { name: string; color: string }> = {
  pokeball: { name: "Pokeball", color: "#EF4444" },
  "great-ball": { name: "Great Ball", color: "#3B82F6" },
  "ultra-ball": { name: "Ultra Ball", color: "#EAB308" },
  "master-ball": { name: "Master Ball", color: "#8B5CF6" },
};

const ENERGY_ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  fire: Flame, water: Droplets, grass: Leaf, electric: Zap,
  ice: Snowflake, rock: Mountain, psychic: Brain, ghost: Ghost,
  dragon: Star, normal: Circle, flying: Wind, fighting: Sword,
  poison: Skull, ground: Footprints, bug: Bug, dark: Shield, steel: Cog,
};

// ─── Component ─────────────────────────────────────────────
export function WildBattleScene({ wildPokemon, wildLevel, onClose, onCapture, onFled }: Props) {
  const {
    team,
    bag,
    trainer,
    showBattleCards,
    startBattle,
    endBattle,
    spendPA,
    endTurn,
    useBagItem,
    addBattleLog,
    battle,
    applyOpponentDamage,
    switchBattlePokemon,
  } = useGameStore();

  // ─── Local state ───────────────────────────────────────
  const [phase, setPhase] = useState<WildPhase>("menu");
  const [wild, setWild] = useState<WildPokemonState>(() => {
    const baseHp = wildPokemon.baseHp || 40;
    const maxHp = baseHp + wildLevel * 3;
    const startMoves = (wildPokemon.startingMoves || []).slice(0, 4);
    return {
      speciesId: wildPokemon.id,
      name: wildPokemon.name,
      level: wildLevel,
      maxHp,
      currentHp: maxHp,
      moves: startMoves.map((mId) => {
        const m = getMove(mId);
        return { moveId: mId, currentPP: m?.pp ?? 10, maxPP: m?.pp ?? 10 };
      }),
      types: wildPokemon.types as PokemonType[],
    };
  });

  const [selectedMoveId, setSelectedMoveId] = useState<string | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [diceRoll, setDiceRoll] = useState<number | null>(null);
  const [hitResult, setHitResult] = useState<HitResult | null>(null);
  const [damageDealt, setDamageDealt] = useState<number | null>(null);
  const [battleLog, setBattleLog] = useState<string[]>(
    [`Um ${wildPokemon.name} selvagem Lv.${wildLevel} apareceu!`]
  );
  const [showPlayerParticles, setShowPlayerParticles] = useState(false);
  const [showWildParticles, setShowWildParticles] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [showBagDialog, setShowBagDialog] = useState(false);
  const [ballsUsed, setBallsUsed] = useState(0);
  const [shakeCount, setShakeCount] = useState(0);
  const [selectedBall, setSelectedBall] = useState<string | null>(null);
  const [enemyMoveUsed, setEnemyMoveUsed] = useState<string | null>(null);
  const [enemyDamage, setEnemyDamage] = useState<number | null>(null);
  const [enemyHitResult, setEnemyHitResult] = useState<HitResult | null>(null);
  const [turnNumber, setTurnNumber] = useState(1);
  const [pa, setPa] = useState(PA_CONFIG.startingPA);
  const maxPa = PA_CONFIG.maxPA;
  const logRef = useRef<HTMLDivElement>(null);

  const addLog = useCallback((msg: string) => {
    setBattleLog((prev) => [...prev, msg]);
  }, []);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [battleLog]);

  // Init battle in store to use BattleCards
  const initRef = useRef(false);
  useEffect(() => {
    if (!initRef.current && team.length > 0) {
      initRef.current = true;
      const firstAlive = team.find((p) => p.currentHp > 0);
      if (firstAlive) {
        startBattle(firstAlive.uid);
      }
    }
    return () => {
      // Cleanup: end battle on unmount
    };
  }, [team, startBattle]);

  const trainerAttrs = trainer.attributes || { combate: 0, afinidade: 0, sorte: 0, furtividade: 0, percepcao: 0, carisma: 0 };
  const combateBonus = Math.floor(trainerAttrs.combate / 2);
  const critExpansion = Math.floor(trainerAttrs.sorte / 2);
  const critThreshold = Math.max(15, 20 - critExpansion);
  const sorteBonus = Math.floor(trainerAttrs.sorte / 2);

  const pokemon = team.find((p) => p.uid === battle.activePokemonUid);
  const hpPercent = pokemon ? (pokemon.currentHp / pokemon.maxHp) * 100 : 0;
  const hpColor = hpPercent > 50 ? "#22C55E" : hpPercent > 25 ? "#F59E0B" : "#EF4444";
  const isFainted = pokemon ? pokemon.currentHp <= 0 : true;

  const wildHpPercent = (wild.currentHp / wild.maxHp) * 100;
  const wildHpColor = wildHpPercent > 50 ? "#22C55E" : wildHpPercent > 25 ? "#F59E0B" : "#EF4444";

  const playerSize = kantoPokemonSizes[pokemon?.speciesId ?? 0] ?? { width: 80, height: 80 };
  const wildSize = kantoPokemonSizes[wild.speciesId] ?? { width: 80, height: 80 };

  // Available balls
  const availableBalls = bag.filter(
    (item) => ["pokeball", "great-ball", "ultra-ball", "master-ball"].includes(item.itemId) && item.quantity > 0
  );

  // ─── PA helpers ────────────────────────────────────────
  const localSpendPA = useCallback(
    (cost: number): boolean => {
      if (pa < cost) return false;
      setPa((prev) => prev - cost);
      return true;
    },
    [pa]
  );

  // ─── Player Attack ────────────────────────────────────
  const handleAttackSelect = (moveId: string) => {
    const moveDef = getMove(moveId);
    const usesCards = moveDef && showBattleCards && (moveDef.energy_cost ?? 0) > 0;
    if (!usesCards) {
      if (!localSpendPA(1)) return;
    }
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
      if (!move || !pokemon) return;

      const effectiveRoll = roll + combateBonus;
      let hr: HitResult;
      if (roll === 1) hr = "critical-miss";
      else if (roll >= critThreshold) hr = "critical-hit";
      else if (effectiveRoll >= move.accuracy + 5) hr = "strong-hit";
      else if (effectiveRoll >= move.accuracy) hr = "hit";
      else hr = "miss";

      setHitResult(hr);

      // Play sounds
      if (hr === "critical-hit") playCriticalHit();
      else if (hr === "strong-hit" || hr === "hit") playAttackHit();
      else if (hr === "miss") playMiss();
      else if (hr === "critical-miss") playCriticalMiss();

      // Calc damage
      const pokemonAttrs = computeAttributes(pokemon.speciesId, pokemon.level, pokemon.customAttributes);
      const breakdown = calculateBattleDamage(move, hr, pokemonAttrs, 0);
      const dmg = breakdown.rawTotal;
      setDamageDealt(dmg);

      // Apply damage to wild pokemon
      if (dmg > 0) {
        const wildAttrs = computeAttributes(wild.speciesId, wild.level);
        const defReduction = Math.floor(wildAttrs.defesa / 3);
        const finalDmg = Math.max(1, dmg - defReduction);
        setWild((prev) => ({
          ...prev,
          currentHp: Math.max(0, prev.currentHp - finalDmg),
        }));
        setShowWildParticles(true);
        playDamageReceived();
        setTimeout(() => setShowWildParticles(false), 600);
        addLog(`${pokemon.name} usou ${move.name}! Rolou ${roll} - ${getHitResultLabel(hr)}! ${finalDmg} de dano!`);
      } else {
        addLog(`${pokemon.name} usou ${move.name}! Rolou ${roll} - ${getHitResultLabel(hr)}! Errou!`);
      }

      setPhase("result");
    },
    [selectedMoveId, pokemon, combateBonus, critThreshold, wild, addLog]
  );

  // Check wild fainted after damage
  useEffect(() => {
    if (wild.currentHp <= 0 && phase === "result") {
      setTimeout(() => {
        addLog(`${wild.name} selvagem desmaiou! Nao pode mais ser capturado.`);
        setPhase("wild-fainted");
      }, 1200);
    }
  }, [wild.currentHp, phase, wild.name, addLog]);

  // ─── Enemy Turn ────────────────────────────────────────
  const executeEnemyTurn = useCallback(() => {
    if (wild.currentHp <= 0) return;
    setPhase("enemy-turn");

    const availableMoves = wild.moves.filter((m) => m.currentPP > 0);
    if (availableMoves.length === 0) {
      addLog(`${wild.name} selvagem nao tem mais movimentos!`);
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
    setWild((prev) => ({
      ...prev,
      moves: prev.moves.map((m) =>
        m.moveId === chosen.moveId ? { ...m, currentPP: m.currentPP - 1 } : m
      ),
    }));

    setEnemyMoveUsed(move.name);

    // Roll D20 for enemy
    const enemyRoll = Math.floor(Math.random() * 20) + 1;
    let eHr: HitResult;
    if (enemyRoll === 1) eHr = "critical-miss";
    else if (enemyRoll >= 19) eHr = "critical-hit";
    else if (enemyRoll >= move.accuracy + 3) eHr = "strong-hit";
    else if (enemyRoll >= move.accuracy) eHr = "hit";
    else eHr = "miss";

    setEnemyHitResult(eHr);

    const wildAttrs = computeAttributes(wild.speciesId, wild.level);
    const breakdown = calculateBattleDamage(move, eHr, wildAttrs, 0);
    const rawDmg = breakdown.rawTotal;

    setTimeout(() => {
      if (rawDmg > 0 && pokemon) {
        applyOpponentDamage(rawDmg);
        setShowPlayerParticles(true);
        playDamageReceived();
        setTimeout(() => setShowPlayerParticles(false), 600);
        setEnemyDamage(rawDmg);
        addLog(`${wild.name} selvagem usou ${move.name}! Rolou ${enemyRoll} - ${getHitResultLabel(eHr)}! ${rawDmg} de dano bruto!`);
      } else {
        setEnemyDamage(0);
        addLog(`${wild.name} selvagem usou ${move.name}! Rolou ${enemyRoll} - ${getHitResultLabel(eHr)}! Errou!`);
      }

      setPhase("enemy-result");

      setTimeout(() => {
        // Check if player fainted
        const currentTeam = useGameStore.getState().team;
        const activePoke = currentTeam.find((p) => p.uid === battle.activePokemonUid);
        if (activePoke && activePoke.currentHp <= 0) {
          // Try to switch to next alive
          const nextAlive = currentTeam.find((p) => p.currentHp > 0);
          if (!nextAlive) {
            addLog("Todos os seus Pokemon desmaiaram!");
            setPhase("defeated");
          } else {
            addLog(`${activePoke.name} desmaiou! Troque de Pokemon!`);
            setPhase("switch");
          }
        } else {
          // New turn
          setTurnNumber((t) => t + 1);
          setPa(PA_CONFIG.startingPA);
          setPhase("menu");
        }
      }, 1500);
    }, 1000);
  }, [wild, pokemon, battle.activePokemonUid, applyOpponentDamage, addLog]);

  // ─── End Turn (pass) ──────────────────────────────────
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
    if (phase !== "switch" && !localSpendPA(1)) return;
    setIsSwitching(true);
    playSendPokemon();
    addLog(`Trocou para ${target.name}!`);
    setTimeout(() => {
      switchBattlePokemon(uid);
      setIsSwitching(false);
      if (phase === "switch") {
        setTurnNumber((t) => t + 1);
        setPa(PA_CONFIG.startingPA);
        setPhase("menu");
      } else {
        setPhase("menu");
      }
    }, 500);
  };

  // ─── Bag Use ──────────────────────────────────────────
  const handleUseBagItem = (itemId: string) => {
    if (!localSpendPA(1)) return;
    const def = BAG_ITEMS.find((d) => d.id === itemId);
    if (def && pokemon) {
      useBagItem(itemId, pokemon.uid);
      addLog(`Usou ${def.name}!`);
      playHeal();
    }
    setShowBagDialog(false);
    setPhase("menu");
  };

  // ─── Pokeball ─────────────────────────────────────────
  const handleThrowBall = (ballId: string) => {
    if (!localSpendPA(1)) return;
    if (wild.currentHp <= 0) {
      addLog("O Pokemon selvagem desmaiou! Nao pode ser capturado.");
      setPhase("wild-fainted");
      return;
    }
    setSelectedBall(ballId);
    setBallsUsed((b) => b + 1);

    // Consume ball
    const { bag: currentBag } = useGameStore.getState();
    const newBag = currentBag
      .map((i) => (i.itemId === ballId ? { ...i, quantity: i.quantity - 1 } : i))
      .filter((i) => i.quantity > 0);
    useGameStore.setState({ bag: newBag });

    playPokeball();
    setPhase("shaking");
    setShakeCount(0);

    // Capture calc
    const hpPct = (wild.currentHp / wild.maxHp) * 100;
    const dc = getCaptureDC(wildPokemon.baseHp || 40, ballId, hpPct);
    const d20 = Math.floor(Math.random() * 20) + 1;
    const total = d20 + sorteBonus;
    const success = ballId === "master-ball" || (d20 !== 1 && (d20 === 20 || total >= dc));

    addLog(`Lancou ${BALL_DATA[ballId]?.name ?? "Pokebola"}! D20: ${d20} + Sorte: ${sorteBonus} = ${total} vs DC ${dc}`);

    // Shake animation
    const totalShakes = success ? 3 : Math.floor(Math.random() * 3);
    let current = 0;
    const shakeInterval = setInterval(() => {
      current++;
      setShakeCount(current);
      if (current >= (success ? 3 : totalShakes)) {
        clearInterval(shakeInterval);
        setTimeout(() => {
          if (success) {
            addLog(`${wild.name} foi capturado!`);
            setPhase("captured");
          } else {
            addLog(`${wild.name} escapou!`);
            setPhase("escaped");
            setShakeCount(0);
            // After escape, enemy may attack
            setTimeout(() => {
              executeEnemyTurn();
            }, 1000);
          }
        }, 500);
      }
    }, 600);
  };

  // ─── Flee ─────────────────────────────────────────────
  const handleFlee = () => {
    playFlee();
    addLog("Voce fugiu da batalha!");
    onClose();
  };

  // ─── Continue after result ────────────────────────────
  const handleContinueAfterResult = () => {
    if (wild.currentHp <= 0) {
      setPhase("wild-fainted");
      return;
    }
    // After player acts, enemy attacks
    executeEnemyTurn();
  };

  if (!pokemon) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-background p-6">
        <p className="text-muted-foreground mb-4">Nenhum Pokemon disponivel para batalha.</p>
        <Button onClick={onClose}>Voltar</Button>
      </div>
    );
  }

  // ─── RENDER ───────────────────────────────────────────
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Top nav */}
      <nav className="flex items-center justify-between px-2 py-1.5 bg-card border-b border-border gap-1">
        <div className="flex items-center gap-1.5">
          <Button onClick={handleFlee} variant="ghost" size="sm" className="h-7 w-7 p-0">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-1 bg-secondary/50 rounded px-1.5 py-0.5">
            <RefreshCw className="w-3 h-3 text-muted-foreground" />
            <span className="text-[10px] font-bold text-muted-foreground">Turno: {turnNumber}</span>
          </div>
        </div>

        {/* PA Orbs */}
        <div className="flex items-center gap-0.5 bg-blue-500/10 rounded-sm">
          {Array.from({ length: maxPa }).map((_, i) => (
            <motion.img
              src="/images/PA.png"
              key={i}
              initial={false}
              animate={{
                scale: i < pa ? 1 : 0.65,
                opacity: i < pa ? 1 : 0.2,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className={`w-6 h-6 rounded-full border-[1.5px] ${
                i < pa
                  ? "bg-amber-400/30 shadow-[0_0_4px_rgba(251,191,36,0.5)]"
                  : "bg-transparent border-gray-600"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-1">
          <Button
            size="sm"
            onClick={handleEndTurn}
            disabled={phase !== "menu" && phase !== "attack-select"}
            className="h-7 px-2 text-[9px] font-bold bg-amber-500/90 hover:bg-amber-500 text-black gap-0.5"
          >
            <SkipForward className="w-3 h-3" />
          </Button>
        </div>
      </nav>

      {/* Arena */}
      <div className="relative flex-1 overflow-hidden">
        <div className="relative w-full" style={{ height: 280 }}>
          {/* BG Arena */}
          <img
            src="/images/arenas/campo.gif"
            alt="Arena"
            className="w-full h-full object-cover"
            style={{ imageRendering: "pixelated" }}
            crossOrigin="anonymous"
          />

          {/* Wild Pokemon (top right) */}
          <div className="absolute flex flex-col items-center" style={{ top: 20, right: 20 }}>
            {/* Wild HP bar */}
            <div className="flex items-center gap-1 mb-1 bg-black/60 rounded px-2 py-0.5">
              <span className="text-[9px] font-bold text-white">{wild.name}</span>
              <span className="text-[8px] text-gray-300">Lv.{wild.level}</span>
            </div>
            <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden mb-1">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: wildHpColor }}
                animate={{ width: `${wildHpPercent}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="text-[8px] text-white/70">
              {wild.currentHp}/{wild.maxHp}
            </span>
            <div className="relative mt-1">
              {showWildParticles && <BattleParticles effectType="damage" isAnimating={true} />}
              <motion.img
                src={getBattleSpriteUrl(wild.speciesId)}
                alt={wild.name}
                width={wildSize.width}
                height={wildSize.height}
                style={{ imageRendering: "auto", minWidth: 60, minHeight: 60 }}
                crossOrigin="anonymous"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getSpriteUrl(wild.speciesId);
                }}
                animate={
                  phase === "shaking"
                    ? { x: [0, -5, 5, -5, 0], transition: { duration: 0.4, repeat: Infinity } }
                    : wild.currentHp <= 0
                    ? { opacity: 0.3, y: 15 }
                    : { opacity: 1, y: 0 }
                }
              />
            </div>
          </div>

          {/* Player Pokemon (bottom left) */}
          <div className="absolute flex flex-col items-center" style={{ bottom: 15, left: 20 }}>
            <div className="relative">
              {showPlayerParticles && <BattleParticles effectType="damage" isAnimating={true} />}
              <motion.img
                src={getBattleSpriteUrl(pokemon.speciesId)}
                alt={pokemon.name}
                width={playerSize.width}
                height={playerSize.height}
                style={{
                  imageRendering: "auto",
                  minWidth: 60,
                  minHeight: 60,
                  transform: "scaleX(-1)",
                }}
                crossOrigin="anonymous"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getSpriteUrl(pokemon.speciesId);
                }}
                animate={
                  isSwitching
                    ? { opacity: 0, scale: 0.5 }
                    : isFainted
                    ? { opacity: 0.3, y: 15 }
                    : { opacity: 1, y: 0, scale: 1 }
                }
              />
            </div>
            {/* Player HP */}
            <div className="flex items-center gap-1 mt-1 bg-black/60 rounded px-2 py-0.5">
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
            <span className="text-[8px] text-white/70">
              {pokemon.currentHp}/{pokemon.maxHp}
            </span>
          </div>

          {/* Pokeball shaking overlay */}
          {phase === "shaking" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{
                  rotate: shakeCount > 0 ? [0, -20, 20, -20, 0] : 0,
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 0.5 }}
                className="text-4xl"
              >
                <img src="/images/items/pokeball.png" alt="Pokeball" className="w-12 h-12" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
              </motion.div>
            </div>
          )}
        </div>

        {/* Team strip */}
        <div className="flex items-center justify-center gap-2 py-1 bg-black/20 border-y border-border">
          {team.map((p) => {
            const isActive = p.uid === battle.activePokemonUid;
            const isFaintedMember = p.currentHp <= 0;
            return (
              <button
                key={p.uid}
                onClick={() => (phase === "menu" || phase === "switch") && handleSwitchPokemon(p.uid)}
                disabled={isFaintedMember || isActive}
                className={`relative rounded-full w-8 h-8 flex items-center justify-center border-2 transition-all ${
                  isActive
                    ? "border-amber-400 bg-amber-400/20"
                    : isFaintedMember
                    ? "border-red-800 bg-red-900/30 opacity-50"
                    : "border-gray-600 bg-gray-800/50 hover:border-gray-400"
                }`}
              >
                <img
                  src={getSpriteUrl(p.speciesId)}
                  alt={p.name}
                  className="w-5 h-5"
                  crossOrigin="anonymous"
                />
                {isFaintedMember && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[8px] text-red-400 font-bold">KO</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Battle Cards area */}
        {showBattleCards && (phase === "menu" || phase === "attack-select") && (
          <div className="px-3 py-1 bg-black/10">
            <div className="flex items-center gap-3 mb-1">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/50" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Cartas</span>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/50" />
            </div>
            <BattleCards />
          </div>
        )}

        {/* Action Panel */}
        <div className="px-3 py-2">
          {/* MENU */}
          {phase === "menu" && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => setPhase("attack-select")}
                  className="h-12 bg-red-700 hover:bg-red-600 text-white font-bold"
                >
                  <Swords className="w-4 h-4 mr-1" /> Atacar
                </Button>
                <Button
                  onClick={() => setShowBagDialog(true)}
                  className="h-12 bg-emerald-700 hover:bg-emerald-600 text-white font-bold"
                >
                  <Backpack className="w-4 h-4 mr-1" /> Bolsa
                </Button>
                <Button
                  onClick={() => setPhase("pokeball-select")}
                  disabled={availableBalls.length === 0}
                  className="h-12 bg-amber-600 hover:bg-amber-500 text-white font-bold"
                >
                  <CircleDot className="w-4 h-4 mr-1" /> Pokebola
                </Button>
                <Button
                  onClick={() => setPhase("switch")}
                  className="h-12 bg-blue-700 hover:bg-blue-600 text-white font-bold"
                >
                  <RefreshCw className="w-4 h-4 mr-1" /> Trocar
                </Button>
              </div>
            </div>
          )}

          {/* ATTACK SELECT */}
          {phase === "attack-select" && pokemon && (
            <div className="space-y-1">
              <div className="flex items-center justify-between mb-1">
                <Button variant="ghost" size="sm" onClick={() => setPhase("menu")} className="h-6 px-1 text-[10px]">
                  <ChevronLeft className="w-3 h-3" /> Voltar
                </Button>
                <span className="text-[10px] text-muted-foreground">Escolha um Ataque</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {(pokemon.moves || []).map((m) => {
                  const moveDef = getMove(m.moveId);
                  if (!moveDef) return null;
                  const typeColor = TYPE_COLORS[moveDef.type as PokemonType] || "#888";
                  return (
                    <Button
                      key={m.moveId}
                      onClick={() => handleAttackSelect(m.moveId)}
                      disabled={m.currentPP <= 0}
                      className="h-10 text-[10px] font-bold text-white flex flex-col gap-0 px-1"
                      style={{ backgroundColor: typeColor }}
                    >
                      <span>{moveDef.name}</span>
                      <span className="text-[8px] opacity-80">
                        PP: {m.currentPP}/{m.maxPP} | Pwr: {moveDef.power}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ROLLING */}
          {phase === "rolling" && (
            <div className="flex flex-col items-center py-4">
              <D20Dice isRolling={isRolling} onResult={handleDiceResult} combateBonus={combateBonus} />
            </div>
          )}

          {/* RESULT */}
          {phase === "result" && hitResult && (
            <div className="flex flex-col items-center py-2 gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold" style={{ color: getHitResultColor(hitResult) }}>
                  {getHitResultLabel(hitResult)}
                </span>
                {diceRoll !== null && (
                  <span className="text-xs text-muted-foreground">D20: {diceRoll}</span>
                )}
              </div>
              {damageDealt !== null && damageDealt > 0 && (
                <span className="text-lg font-bold text-red-400">-{damageDealt} dano</span>
              )}
              <Button onClick={handleContinueAfterResult} size="sm" className="mt-1">
                Continuar
              </Button>
            </div>
          )}

          {/* ENEMY TURN / RESULT */}
          {(phase === "enemy-turn" || phase === "enemy-result") && (
            <div className="flex flex-col items-center py-3 gap-2">
              <span className="text-xs text-amber-400 font-bold animate-pulse">
                {phase === "enemy-turn" ? `${wild.name} selvagem esta atacando...` : `${wild.name} selvagem usou ${enemyMoveUsed}!`}
              </span>
              {phase === "enemy-result" && enemyHitResult && (
                <>
                  <span className="text-sm font-bold" style={{ color: getHitResultColor(enemyHitResult) }}>
                    {getHitResultLabel(enemyHitResult)}
                  </span>
                  {enemyDamage !== null && enemyDamage > 0 && (
                    <span className="text-lg font-bold text-red-400">-{enemyDamage} dano bruto</span>
                  )}
                </>
              )}
            </div>
          )}

          {/* POKEBALL SELECT */}
          {phase === "pokeball-select" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-1">
                <Button variant="ghost" size="sm" onClick={() => setPhase("menu")} className="h-6 px-1 text-[10px]">
                  <ChevronLeft className="w-3 h-3" /> Voltar
                </Button>
                <span className="text-[10px] text-muted-foreground">
                  DC: {getCaptureDC(wildPokemon.baseHp || 40, "pokeball", wildHpPercent)} | HP: {Math.round(wildHpPercent)}%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {availableBalls.map((item) => {
                  const bd = BALL_DATA[item.itemId];
                  if (!bd) return null;
                  return (
                    <Button
                      key={item.itemId}
                      onClick={() => handleThrowBall(item.itemId)}
                      className="h-12 font-bold text-white flex items-center gap-2"
                      style={{ backgroundColor: bd.color }}
                    >
                      <span className="text-sm">{bd.name}</span>
                      <span className="text-xs opacity-75">x{item.quantity}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SHAKING */}
          {phase === "shaking" && (
            <div className="flex flex-col items-center py-4">
              <span className="text-sm text-muted-foreground animate-pulse">Balancando... {shakeCount}/3</span>
            </div>
          )}

          {/* CAPTURED */}
          {phase === "captured" && (
            <div className="flex flex-col items-center py-4 gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 10 }}
                className="text-center"
              >
                <span className="text-lg font-bold text-amber-400">{wild.name} foi capturado!</span>
              </motion.div>
              <Button
                onClick={() => onCapture(wild.speciesId, ballsUsed)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                Continuar
              </Button>
            </div>
          )}

          {/* ESCAPED */}
          {phase === "escaped" && (
            <div className="flex flex-col items-center py-4">
              <span className="text-sm text-amber-400 font-bold">{wild.name} escapou da pokebola!</span>
              <span className="text-xs text-muted-foreground animate-pulse mt-1">Preparando contra-ataque...</span>
            </div>
          )}

          {/* SWITCH */}
          {phase === "switch" && (
            <div className="space-y-2">
              <span className="text-xs text-amber-400 font-bold block text-center">Escolha um Pokemon!</span>
              <div className="grid grid-cols-3 gap-2">
                {team
                  .filter((p) => p.currentHp > 0 && p.uid !== battle.activePokemonUid)
                  .map((p) => (
                    <Button
                      key={p.uid}
                      onClick={() => handleSwitchPokemon(p.uid)}
                      variant="outline"
                      className="h-16 flex flex-col items-center gap-1"
                    >
                      <img src={getSpriteUrl(p.speciesId)} alt={p.name} className="w-8 h-8" crossOrigin="anonymous" />
                      <span className="text-[9px]">{p.name}</span>
                      <span className="text-[8px] text-muted-foreground">
                        {p.currentHp}/{p.maxHp}
                      </span>
                    </Button>
                  ))}
              </div>
              {phase === "switch" && !team.some((p) => p.currentHp > 0 && p.uid !== battle.activePokemonUid) && (
                <Button onClick={onClose} variant="destructive" className="w-full mt-2">
                  Sem Pokemon - Sair
                </Button>
              )}
            </div>
          )}

          {/* WILD FAINTED */}
          {phase === "wild-fainted" && (
            <div className="flex flex-col items-center py-4 gap-3">
              <span className="text-lg font-bold text-red-400">{wild.name} selvagem desmaiou!</span>
              <span className="text-xs text-muted-foreground">Voce nao conseguiu captura-lo.</span>
              <Button onClick={onClose}>Voltar</Button>
            </div>
          )}

          {/* DEFEATED */}
          {phase === "defeated" && (
            <div className="flex flex-col items-center py-4 gap-3">
              <span className="text-lg font-bold text-red-400">Todos os seus Pokemon desmaiaram!</span>
              <Button onClick={onClose} variant="destructive">
                Voltar
              </Button>
            </div>
          )}

          {/* BAG dialog */}
          {showBagDialog && (
            <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
              <div className="bg-card rounded-lg border border-border p-4 w-full max-w-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-sm">Bolsa</span>
                  <Button variant="ghost" size="sm" onClick={() => setShowBagDialog(false)} className="h-6 px-2 text-[10px]">
                    Fechar
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {bag
                    .filter((item) => {
                      const def = BAG_ITEMS.find((d) => d.id === item.itemId);
                      return def && def.type === "healing";
                    })
                    .map((item) => {
                      const def = BAG_ITEMS.find((d) => d.id === item.itemId);
                      if (!def) return null;
                      return (
                        <Button
                          key={item.itemId}
                          onClick={() => handleUseBagItem(item.itemId)}
                          variant="outline"
                          className="h-10 text-[10px] flex items-center justify-between"
                        >
                          <span>{def.name}</span>
                          <span className="text-muted-foreground">x{item.quantity}</span>
                        </Button>
                      );
                    })}
                </div>
                {bag.filter((item) => BAG_ITEMS.find((d) => d.id === item.itemId)?.type === "healing").length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">Sem itens de cura.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Battle Log */}
        <div
          ref={logRef}
          className="mx-3 mb-2 h-20 overflow-y-auto bg-black/30 rounded border border-border p-2"
        >
          {battleLog.map((log, i) => (
            <p key={i} className="text-[9px] text-gray-300 leading-tight">
              {log}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

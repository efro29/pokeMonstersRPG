"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useGameStore } from "@/lib/game-store";
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
  | "ball-throw"
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
function getBackSpriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/${id}.gif`;
}

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

function PokeballSVG({ color, size = 60 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
      <circle cx="50" cy="50" r="48" fill={color} stroke="#1E293B" strokeWidth="3" />
      <rect x="2" y="48" width="96" height="4" fill="#1E293B" />
      <path d="M 2 50 A 48 48 0 0 0 98 50" fill="#F1F5F9" />
      <circle cx="50" cy="50" r="14" fill="#F1F5F9" stroke="#1E293B" strokeWidth="3" />
      <circle cx="50" cy="50" r="7" fill="#1E293B" />
    </svg>
  );
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

const BALL_DATA: Record<string, { name: string; color: string }> = {
  pokeball: { name: "Pokeball", color: "#EF4444" },
  "great-ball": { name: "Great Ball", color: "#3B82F6" },
  "ultra-ball": { name: "Ultra Ball", color: "#EAB308" },
  "master-ball": { name: "Master Ball", color: "#8B5CF6" },
};

// ─── Component ─────────────────────────────────────────────
export function WildBattleScene({ wildPokemon, wildLevel, onClose, onCapture, onFled }: Props) {
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
  const [playerAttacking, setPlayerAttacking] = useState(false);
  const [wildAttacking, setWildAttacking] = useState(false);
  const [wildShake, setWildShake] = useState(false);
  const [playerShake, setPlayerShake] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [showBagDialog, setShowBagDialog] = useState(false);
  const [ballsUsed, setBallsUsed] = useState(0);
  const [shakeCount, setShakeCount] = useState(0);
  const [selectedBall, setSelectedBall] = useState<string | null>(null);
  const [enemyMoveUsed, setEnemyMoveUsed] = useState<string | null>(null);
  const [enemyDamage, setEnemyDamage] = useState<number | null>(null);
  const [enemyHitResult, setEnemyHitResult] = useState<HitResult | null>(null);
  const [turnNumber, setTurnNumber] = useState(1);
  const [ballFlightProgress, setBallFlightProgress] = useState(0);
  const [xpReward, setXpReward] = useState(0);
  const [showXpBar, setShowXpBar] = useState(false);
  const [xpBarProgress, setXpBarProgress] = useState(0);
  const [attackEffect, setAttackEffect] = useState<{ type: PokemonType | null; side: "player" | "wild" } | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const addLog = useCallback((msg: string) => {
    setBattleLog((prev) => [...prev, msg]);
  }, []);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [battleLog]);

  // Init battle in store for switch/damage tracking
  const initRef = useRef(false);
  useEffect(() => {
    if (!initRef.current && team.length > 0) {
      initRef.current = true;
      const firstAlive = team.find((p) => p.currentHp > 0);
      if (firstAlive) {
        startBattle(firstAlive.uid);
      }
    }
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

  // ─── Player Attack ────────────────────────────────────
  const handleAttackSelect = (moveId: string) => {
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

      // Attack animation - player lunges forward
      setPlayerAttacking(true);
      setTimeout(() => setPlayerAttacking(false), 400);

      // Show type effect on wild pokemon
      setAttackEffect({ type: move.type as PokemonType, side: "wild" });
      setTimeout(() => setAttackEffect(null), 800);

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

        // Hit animation on wild pokemon
        setTimeout(() => {
          setWildShake(true);
          setShowWildParticles(true);
          playDamageReceived();
          setWild((prev) => ({
            ...prev,
            currentHp: Math.max(0, prev.currentHp - finalDmg),
          }));
          setTimeout(() => {
            setWildShake(false);
            setShowWildParticles(false);
          }, 600);
        }, 300);

        addLog(`${pokemon.name} usou ${move.name}! Rolou ${roll} - ${getHitResultLabel(hr)}! ${finalDmg} de dano!`);
      } else {
        addLog(`${pokemon.name} usou ${move.name}! Rolou ${roll} - ${getHitResultLabel(hr)}! Errou!`);
      }

      setPhase("result");
    },
    [selectedMoveId, pokemon, combateBonus, critThreshold, wild, addLog]
  );

  // Check wild fainted after damage - award XP
  useEffect(() => {
    if (wild.currentHp <= 0 && phase === "result") {
      setTimeout(() => {
        const reward = wild.level * 30;
        setXpReward(reward);
        addLog(`${wild.name} selvagem desmaiou!`);
        // Give XP to active pokemon
        if (pokemon) {
          addXp(pokemon.uid, reward);
          addLog(`${pokemon.name} ganhou ${reward} XP!`);
        }
        setPhase("wild-fainted");
        // Animate XP bar
        setShowXpBar(true);
        setXpBarProgress(0);
        setTimeout(() => setXpBarProgress(100), 100);
      }, 1200);
    }
  }, [wild.currentHp, phase, wild.name, wild.level, pokemon, addXp, addLog]);

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

    // Wild attack animation - lunge toward player + type effect
    setTimeout(() => {
      setWildAttacking(true);
      playAttack();
      setAttackEffect({ type: move.type as PokemonType, side: "player" });
      setTimeout(() => {
        setWildAttacking(false);
        setAttackEffect(null);
      }, 600);
    }, 500);

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
        // Hit animation on player pokemon
        setPlayerShake(true);
        setShowPlayerParticles(true);
        playDamageReceived();
        applyOpponentDamage(rawDmg);
        setTimeout(() => {
          setPlayerShake(false);
          setShowPlayerParticles(false);
        }, 600);
        setEnemyDamage(rawDmg);
        addLog(`${wild.name} selvagem usou ${move.name}! Rolou ${enemyRoll} - ${getHitResultLabel(eHr)}! ${rawDmg} de dano bruto!`);
      } else {
        setEnemyDamage(0);
        addLog(`${wild.name} selvagem usou ${move.name}! Rolou ${enemyRoll} - ${getHitResultLabel(eHr)}! Errou!`);
      }

      setPhase("enemy-result");

      setTimeout(() => {
        const currentTeam = useGameStore.getState().team;
        const activePoke = currentTeam.find((p) => p.uid === battle.activePokemonUid);
        if (activePoke && activePoke.currentHp <= 0) {
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

  // ─── Pokeball ─────────────────────────────────────────
  const handleThrowBall = (ballId: string) => {
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

    // Ball flight animation
    setPhase("ball-throw");
    setBallFlightProgress(0);
    let progress = 0;
    const flightInterval = setInterval(() => {
      progress += 0.04;
      setBallFlightProgress(Math.min(progress, 1));
      if (progress >= 1) {
        clearInterval(flightInterval);
        // After flight completes, start shaking
        setPhase("shaking");
        setShakeCount(0);

        // Capture calc
        const hpPct = (wild.currentHp / wild.maxHp) * 100;
        const dc = getCaptureDC(wildPokemon.baseHp || 40, ballId, hpPct);
        const d20 = Math.floor(Math.random() * 20) + 1;
        const total = d20 + sorteBonus;
        const success = ballId === "master-ball" || (d20 !== 1 && (d20 === 20 || total >= dc));

        addLog(`Lancou ${BALL_DATA[ballId]?.name ?? "Pokebola"}! D20: ${d20} + Sorte: ${sorteBonus} = ${total} vs DC ${dc}`);

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
                setTimeout(() => {
                  executeEnemyTurn();
                }, 1000);
              }
            }, 500);
          }
        }, 600);
      }
    }, 25);
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

  // Ball flight arc position
  const getBallArcPos = () => {
    const t = ballFlightProgress;
    // Start from bottom-left (player position), arc to top-right (wild position)
    const startX = 80;
    const startY = 220;
    const endX = 280;
    const endY = 60;
    const x = startX + (endX - startX) * t;
    const arcHeight = -120;
    const y = startY + (endY - startY) * t + arcHeight * Math.sin(t * Math.PI);
    const scale = 1 - t * 0.3;
    const rotation = t * 720;
    return { x, y, scale, rotation };
  };

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

        <span className="text-[10px] font-bold text-amber-400">Batalha Selvagem</span>

        <div className="flex items-center gap-1">
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
            src="/images/arenas/campo.gif"
            alt="Arena"
            className="w-full h-full object-fill"
            style={{ imageRendering: "pixelated" }}
            crossOrigin="anonymous"
          />

          {/* Wild Pokemon (top right - front sprite) */}
          <div className="absolute flex flex-col items-center" style={{ top: 15, right: 15 }}>
            {/* Wild HP bar */}
            <div className="flex items-center gap-1 mb-1 bg-black/70 rounded-lg px-2 py-0.5 backdrop-blur-sm">
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
            <span className="text-[8px] text-white/80 font-mono bg-black/40 rounded px-1">
              {wild.currentHp}/{wild.maxHp}
            </span>
            <div className="relative mt-1">
              {showWildParticles && <BattleParticles effectType="damage" isAnimating={true} />}
              {/* Flash overlay on hit */}
              <AnimatePresence>
                {wildShake && (
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
                  wildShake
                    ? { x: [0, -8, 8, -6, 6, -3, 3, 0], opacity: [1, 0.5, 1, 0.5, 1] }
                    : wildAttacking
                    ? { x: [0, -30, -30, 0], transition: { duration: 0.4 } }
                    : phase === "shaking" || phase === "ball-throw"
                    ? { opacity: 0.3, scale: 0.5, transition: { duration: 0.3 } }
                    : wild.currentHp <= 0
                    ? { opacity: 0.3, y: 15, rotate: -20 }
                    : { opacity: 1, y: [0, -3, 0], transition: { duration: 2, repeat: Infinity } }
                }
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Player Pokemon (bottom left - BACK sprite) */}
          <div className="absolute flex flex-col items-center" style={{ bottom: 10, left: 15 }}>
            <div className="relative">
              {showPlayerParticles && <BattleParticles effectType="damage" isAnimating={true} />}
              {/* Flash overlay on hit */}
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
                style={{
                  imageRendering: "auto",
                  minWidth: 70,
                  minHeight: 70,
                }}
                crossOrigin="anonymous"
                onError={(e) => {
                  // Fallback: flipped front sprite
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
            {/* Player HP */}
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

          {/* Type Attack Effect Overlay */}
          <AnimatePresence>
            {attackEffect && (
              <motion.div
                key={`effect-${attackEffect.side}-${Date.now()}`}
                className="absolute z-30 pointer-events-none flex items-center justify-center"
                style={
                  attackEffect.side === "wild"
                    ? { top: 40, right: 20, width: 100, height: 100 }
                    : { bottom: 30, left: 20, width: 100, height: 100 }
                }
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1.2 }}
                exit={{ opacity: 0, scale: 2 }}
                transition={{ duration: 0.4 }}
              >
                {/* Impact ring */}
                <motion.div
                  className="absolute rounded-full border-4"
                  style={{
                    borderColor: ATTACK_EFFECT_ICONS[attackEffect.type ?? "normal"]?.color ?? "#A8A29E",
                    width: 80,
                    height: 80,
                  }}
                  initial={{ scale: 0.2, opacity: 1 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
                {/* Type icon burst */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.span
                    key={i}
                    className="absolute text-2xl"
                    initial={{
                      x: 0,
                      y: 0,
                      opacity: 1,
                      scale: 0.5,
                    }}
                    animate={{
                      x: Math.cos((i * 72 * Math.PI) / 180) * 40,
                      y: Math.sin((i * 72 * Math.PI) / 180) * 40,
                      opacity: 0,
                      scale: 1.2,
                    }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                  >
                    {ATTACK_EFFECT_ICONS[attackEffect.type ?? "normal"]?.icon ?? "💥"}
                  </motion.span>
                ))}
                {/* Central flash */}
                <motion.div
                  className="absolute rounded-full"
                  style={{
                    backgroundColor: ATTACK_EFFECT_ICONS[attackEffect.type ?? "normal"]?.color ?? "#A8A29E",
                    width: 30,
                    height: 30,
                    filter: `blur(8px)`,
                  }}
                  initial={{ scale: 0, opacity: 0.9 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Shadow under player pokemon */}
          <div
            className="absolute"
            style={{
              bottom: 12,
              left: 35,
              width: 70,
              height: 16,
              background: "rgba(0,0,0,0.3)",
              borderRadius: "50%",
              filter: "blur(4px)",
              pointerEvents: "none",
            }}
          />
          {/* Shadow under wild pokemon */}
          <div
            className="absolute"
            style={{
              top: 145,
              right: 30,
              width: 60,
              height: 14,
              background: "rgba(0,0,0,0.3)",
              borderRadius: "50%",
              filter: "blur(4px)",
              pointerEvents: "none",
            }}
          />

          {/* Ball throw animation */}
          <AnimatePresence>
            {phase === "ball-throw" && selectedBall && (() => {
              const pos = getBallArcPos();
              return (
                <motion.div
                  key="ball-flight"
                  className="absolute z-40 pointer-events-none"
                  style={{
                    left: pos.x - 20,
                    top: pos.y - 20,
                    transform: `scale(${pos.scale}) rotate(${pos.rotation}deg)`,
                  }}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  <PokeballSVG color={BALL_DATA[selectedBall]?.color ?? "#EF4444"} size={40} />
                </motion.div>
              );
            })()}
          </AnimatePresence>

          {/* Pokeball shaking on wild pokemon */}
          {phase === "shaking" && selectedBall && (
            <motion.div
              className="absolute z-40 flex flex-col items-center"
              style={{ top: 70, right: 35 }}
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                rotate: [0, -20, 20, -20, 20, 0],
              }}
              transition={{
                rotate: { duration: 0.6, repeat: Infinity, repeatDelay: 0.3 },
                scale: { type: "spring", stiffness: 300, damping: 15 },
              }}
            >
              <PokeballSVG color={BALL_DATA[selectedBall]?.color ?? "#EF4444"} size={48} />
              <div className="flex gap-1.5 mt-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: i < shakeCount ? BALL_DATA[selectedBall]?.color ?? "#EF4444" : "rgba(255,255,255,0.15)",
                      boxShadow: i < shakeCount ? `0 0 6px ${BALL_DATA[selectedBall]?.color ?? "#EF4444"}` : "none",
                    }}
                    animate={i < shakeCount ? { scale: [1, 1.4, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </div>
            </motion.div>
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
              <D20Dice rolling={isRolling} onResult={handleDiceResult} />
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
                  <span className="text-xs text-muted-foreground">D20: {diceRoll}{combateBonus > 0 ? ` +${combateBonus}` : ""}</span>
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
                      <PokeballSVG color={bd.color} size={20} />
                      <span className="text-sm">{bd.name}</span>
                      <span className="text-xs opacity-75">x{item.quantity}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* BALL THROW / SHAKING */}
          {(phase === "ball-throw" || phase === "shaking") && (
            <div className="flex flex-col items-center py-4">
              <span className="text-sm text-muted-foreground animate-pulse">
                {phase === "ball-throw" ? "Lancando pokebola..." : `Balancando... ${shakeCount}/3`}
              </span>
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
                <img
                  src={getSpriteUrl(wild.speciesId)}
                  alt={wild.name}
                  className="w-16 h-16 mx-auto mb-2"
                  crossOrigin="anonymous"
                />
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
              {!team.some((p) => p.currentHp > 0 && p.uid !== battle.activePokemonUid) && (
                <Button onClick={onClose} variant="destructive" className="w-full mt-2">
                  Sem Pokemon - Sair
                </Button>
              )}
            </div>
          )}

          {/* WILD FAINTED */}
          {phase === "wild-fainted" && (
            <div className="flex flex-col items-center py-4 gap-3">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 12 }}
                className="text-center"
              >
                <span className="text-lg font-bold text-amber-400">Vitoria!</span>
                <p className="text-sm text-muted-foreground mt-1">{wild.name} selvagem desmaiou!</p>
              </motion.div>
              {showXpBar && pokemon && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full max-w-xs bg-card rounded-lg border border-border p-3"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <img src={getSpriteUrl(pokemon.speciesId)} alt={pokemon.name} className="w-8 h-8" crossOrigin="anonymous" />
                    <div className="flex-1">
                      <span className="text-xs font-bold text-foreground">{pokemon.name}</span>
                      <span className="text-[10px] text-muted-foreground ml-1">Lv.{pokemon.level}</span>
                    </div>
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.3, 1] }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="text-sm font-bold text-emerald-400"
                    >
                      +{xpReward} XP
                    </motion.span>
                  </div>
                  <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400"
                      initial={{ width: "0%" }}
                      animate={{ width: `${xpBarProgress}%` }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                    />
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-1 text-center">
                    XP: {pokemon.xp ?? 0}
                  </p>
                </motion.div>
              )}
              <Button onClick={onClose} className="mt-2 bg-emerald-600 hover:bg-emerald-500 text-white">Continuar</Button>
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

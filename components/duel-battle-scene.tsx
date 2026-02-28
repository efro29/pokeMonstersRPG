"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useGameStore, PA_CONFIG } from "@/lib/game-store";
import type { PAActionType, PokemonAttributeKey } from "@/lib/game-store";
import type { DuelNpc, DuelNpcPokemon } from "@/lib/duel-npcs";
import { getNivelColor, getNivelLabel } from "@/lib/duel-npcs";
import {
  getSpriteUrl,
  getBattleSpriteUrl,
  getMove,
  TYPE_COLORS,
  BAG_ITEMS,
  getHitResultLabel,
  getHitResultColor,
  computeAttributes,
  POKEMON_ATTRIBUTE_INFO,
  MOVE_RANGE_INFO,
  getPokemon,
} from "@/lib/pokemon-data";
import type { PokemonType, HitResult, MoveRange, DamageBreakdown } from "@/lib/pokemon-data";
import { D20Dice } from "./d20-dice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { getPokemonAnimationVariants } from "@/lib/card-animations";
import { countFieldCardsByElement, ELEMENT_COLORS, hasAuraAmplificada } from "@/lib/card-data";
import {
  Swords,
  ArrowLeft,
  Backpack,
  CircleDot,
  Heart,
  Shield,
  Zap,
  ChevronLeft,
  Dices,
  Wind,
  CheckCircle,
  XCircle,
  Star,
  Flame,
  Droplets,
  Leaf,
  Snowflake,
  Mountain,
  Brain,
  Ghost,
  Bug,
  Skull,
  Cog,
  Footprints,
  Sword,
  Circle,
  SkipForward,
  RefreshCw,
  Trophy,
  Coins,
  X,
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
  stopBattleMusic,
} from "@/lib/sounds";

// Mapa de efeitos visuais por tipo
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
import { BattleCards } from "./battle-cards";
import { BattleParticles } from "./battle-particles";
import { kantoPokemonSizes } from "@/lib/kantoPokemonSizes";

// Element icon map for energy cost display
const ENERGY_ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  fire: Flame,
  water: Droplets,
  grass: Leaf,
  electric: Zap,
  ice: Snowflake,
  rock: Mountain,
  psychic: Brain,
  ghost: Ghost,
  dragon: Star,
  normal: Circle,
  flying: Wind,
  fighting: Sword,
  poison: Skull,
  ground: Footprints,
  bug: Bug,
  dark: Shield,
  steel: Cog,
};

interface DuelBattleSceneProps {
  npc: DuelNpc;
  onClose: () => void;
  onVictory: (npc: DuelNpc) => void;
  onDefeat: () => void;
}

// Sistema de IA simples para o rival
function getAIMove(
  pokemonMoves: string[],
  playerPokemonTypes: string[],
  ia: string
): string {
  if (pokemonMoves.length === 0) return "";
  
  // IA aleatoria
  if (ia === "aleatoria" || ia === "balanceada") {
    return pokemonMoves[Math.floor(Math.random() * pokemonMoves.length)];
  }
  
  // IA agressiva - prefere golpes com mais dano
  if (ia === "agressiva" || ia === "competitiva" || ia === "chefe" || ia === "chefe_lendario" || ia === "chefe_final") {
    const movesWithDamage = pokemonMoves.map((moveId) => {
      const move = getMove(moveId);
      if (!move || move.damage_type === "status") return { moveId, power: 0 };
      // Calcula dano base
      const diceMatch = move.damage_dice?.match(/(\d+)d(\d+)/);
      if (!diceMatch) return { moveId, power: 0 };
      const numDice = parseInt(diceMatch[1]);
      const diceSize = parseInt(diceMatch[2]);
      return { moveId, power: numDice * (diceSize / 2 + 0.5) };
    });
    
    // Ordena por poder e pega o mais forte
    movesWithDamage.sort((a, b) => b.power - a.power);
    return movesWithDamage[0]?.moveId || pokemonMoves[0];
  }
  
  // IA defensiva - alterna entre ataques
  if (ia === "defensiva" || ia === "estrategica") {
    return pokemonMoves[Math.floor(Math.random() * pokemonMoves.length)];
  }
  
  return pokemonMoves[Math.floor(Math.random() * pokemonMoves.length)];
}

// Rola dano do rival baseado no golpe
function rollRivalDamage(moveId: string, level: number): number {
  const move = getMove(moveId);
  if (!move || !move.damage_dice || move.damage_type === "status") return 0;
  
  const diceMatch = move.damage_dice.match(/(\d+)d(\d+)/);
  if (!diceMatch) return 0;
  
  const numDice = parseInt(diceMatch[1]);
  const diceSize = parseInt(diceMatch[2]);
  
  let total = 0;
  for (let i = 0; i < numDice; i++) {
    total += Math.floor(Math.random() * diceSize) + 1;
  }
  
  // Adiciona bonus de nivel
  const levelBonus = Math.floor(level / 5);
  total += levelBonus;
  
  return total;
}

export function DuelBattleScene({ npc, onClose, onVictory, onDefeat }: DuelBattleSceneProps) {
  const {
    battle,
    team,
    bag,
    trainer,
    setBattlePhase,
    selectMove,
    resolveDiceRoll,
    endBattle,
    applyOpponentDamage,
    addBattleLog,
    useBagItem,
    switchBattlePokemon,
    showBattleCards,
    spendPA,
    endTurn,
    addXp,
    addPokemonBattleHistory,
    addTrainerBattleHistory,
    addMoney,
    addStarDust,
  } = useGameStore();

  const attrs = trainer.attributes || { combate: 0, afinidade: 0, sorte: 0, furtividade: 0, percepcao: 0, carisma: 0 };
  const combateBonus = Math.floor(attrs.combate / 2);
  const critExpansion = Math.floor(attrs.sorte / 2);
  const critThreshold = Math.max(15, 20 - critExpansion);

  // Estado do rival
  const [rivalTeam, setRivalTeam] = useState<(DuelNpcPokemon & { currentHp: number; maxHp: number })[]>(() => {
    return npc.time.map((p) => {
      const baseHp = 40 + p.level * 3;
      return { ...p, currentHp: baseHp, maxHp: baseHp };
    });
  });
  const [activeRivalIndex, setActiveRivalIndex] = useState(0);

  // Estado da batalha
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [showParticles, setShowParticles] = useState(false);
  const [showParticlePok, setShowParticlesPok] = useState(false);
  const [showRivalParticles, setShowRivalParticles] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [showBagDialog, setShowBagDialog] = useState(false);
  const [showVictoryDialog, setShowVictoryDialog] = useState(false);
  const [showDefeatDialog, setShowDefeatDialog] = useState(false);
  const [rivalAction, setRivalAction] = useState<string | null>(null);
  const [rivalDamage, setRivalDamage] = useState<number | null>(null);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  
  // Animacoes de ataque
  const [playerAttacking, setPlayerAttacking] = useState(false);
  const [rivalAttacking, setRivalAttacking] = useState(false);
  const [playerShake, setPlayerShake] = useState(false);
  const [rivalShake, setRivalShake] = useState(false);
  const [attackEffect, setAttackEffect] = useState<{ type: PokemonType | null; side: "player" | "rival" } | null>(null);

  const ARENAS = ["campo"];
  const [arena] = useState(() => ARENAS[Math.floor(Math.random() * ARENAS.length)]);

  const activeRival = rivalTeam[activeRivalIndex];
  const rivalPokemonAlive = rivalTeam.filter((p) => p.currentHp > 0).length;
  const playerPokemonAlive = team.filter((p) => p.currentHp > 0).length;

  const pokemon = team.find((p) => p.uid === battle.activePokemonUid);
  const hpPercent = pokemon ? (pokemon.currentHp / pokemon.maxHp) * 100 : 0;
  const hpColor = hpPercent > 50 ? "#22C55E" : hpPercent > 25 ? "#F59E0B" : "#EF4444";
  const isFainted = pokemon ? pokemon.currentHp <= 0 : true;

  const rivalHpPercent = activeRival ? (activeRival.currentHp / activeRival.maxHp) * 100 : 0;
  const rivalHpColor = rivalHpPercent > 50 ? "#22C55E" : rivalHpPercent > 25 ? "#F59E0B" : "#EF4444";

  const pokemonAttrs = pokemon ? computeAttributes(pokemon.speciesId, pokemon.level, pokemon.customAttributes) : null;
  const pokemonTypes = pokemon ? getPokemon(pokemon.speciesId)?.types : [];
  const size = kantoPokemonSizes[pokemon?.speciesId ?? 0] ?? { width: 80, height: 80 };

  const selectedMove = battle.selectedMoveId ? getMove(battle.selectedMoveId) : null;

  // Log de batalha
  const addLog = (msg: string) => {
    setBattleLog((prev) => [...prev.slice(-10), msg]);
    addBattleLog(msg);
  };

  // Verificar condicoes de vitoria/derrota
  useEffect(() => {
    if (rivalPokemonAlive === 0 && !showVictoryDialog) {
      setTimeout(() => {
        playVictoryFanfare();
        setShowVictoryDialog(true);
      }, 500);
    }
    if (playerPokemonAlive === 0 && !showDefeatDialog) {
      setTimeout(() => {
        setShowDefeatDialog(true);
      }, 500);
    }
  }, [rivalPokemonAlive, playerPokemonAlive, showVictoryDialog, showDefeatDialog]);

  // Auto-switch rival pokemon quando o atual desmaia
  useEffect(() => {
    if (activeRival && activeRival.currentHp <= 0) {
      const nextAliveIndex = rivalTeam.findIndex((p, i) => i > activeRivalIndex && p.currentHp > 0);
      if (nextAliveIndex !== -1) {
        setTimeout(() => {
          addLog(`${activeRival.nome} desmaiou! ${npc.nome} enviou ${rivalTeam[nextAliveIndex].nome}!`);
          setActiveRivalIndex(nextAliveIndex);
          // Registra vitoria do pokemon do jogador
          if (pokemon) {
            addPokemonBattleHistory(pokemon.uid, {
              type: "victory",
              date: new Date().toISOString(),
              opponentName: activeRival.nome,
            });
          }
        }, 800);
      } else {
        // Verifica se ha algum pokemon vivo antes do atual
        const anyAlive = rivalTeam.findIndex((p) => p.currentHp > 0);
        if (anyAlive !== -1 && anyAlive !== activeRivalIndex) {
          setTimeout(() => {
            addLog(`${activeRival.nome} desmaiou! ${npc.nome} enviou ${rivalTeam[anyAlive].nome}!`);
            setActiveRivalIndex(anyAlive);
            if (pokemon) {
              addPokemonBattleHistory(pokemon.uid, {
                type: "victory",
                date: new Date().toISOString(),
                opponentName: activeRival.nome,
              });
            }
          }, 800);
        }
      }
    }
  }, [activeRival?.currentHp]);

  // Turno do rival (IA classica de Pokemon)
  const executeRivalTurn = useCallback(() => {
    if (!activeRival || activeRival.currentHp <= 0) {
      setIsPlayerTurn(true);
      return;
    }
    
    setRivalAction("thinking");
    
    setTimeout(() => {
      // Pega os golpes do rival baseado no pokemon
      const rivalSpecies = getPokemon(activeRival.speciesId);
      const rivalMoves = rivalSpecies?.startingMoves || ["tackle", "scratch"];
      
      // IA escolhe o golpe
      const chosenMoveId = getAIMove(rivalMoves, pokemonTypes || [], npc.ia);
      const chosenMove = getMove(chosenMoveId);
      
      if (!chosenMove) {
        setRivalAction(null);
        setIsPlayerTurn(true);
        return;
      }
      
      setRivalAction(`${activeRival.nome} usou ${chosenMove.name}!`);
      playAttack();
      
      // Animacao de ataque do rival
      setRivalAttacking(true);
      setAttackEffect({ type: chosenMove.type as PokemonType, side: "player" });
      setTimeout(() => {
        setRivalAttacking(false);
        setAttackEffect(null);
      }, 600);
      
      setTimeout(() => {
        // Rola D20 para acerto
        const roll = Math.floor(Math.random() * 20) + 1;
        const hit = roll >= chosenMove.accuracy;
        const isCrit = roll >= 19;
        
        if (!hit) {
          addLog(`${activeRival.nome} usou ${chosenMove.name} mas errou! (D20: ${roll})`);
          playMiss();
          setRivalAction(`Errou! (${roll})`);
          setTimeout(() => {
            setRivalAction(null);
            setIsPlayerTurn(true);
            useGameStore.setState((state) => ({
              battle: { ...state.battle, pa: state.battle.maxPa },
            }));
          }, 1500);
          return;
        }
        
        // Calcula e aplica dano
        let damage = rollRivalDamage(chosenMoveId, activeRival.level);
        if (isCrit) {
          damage = Math.floor(damage * 1.5);
          playCriticalHit();
        } else {
          playAttackHit();
        }
        
        // Aplica defesa do pokemon do jogador
        if (pokemonAttrs) {
          const defReduction = Math.floor(pokemonAttrs.defesa / 3);
          damage = Math.max(1, damage - defReduction);
        }
        
        const hitLabel = isCrit ? "CRITICO!" : "Acertou!";
        addLog(`${activeRival.nome} usou ${chosenMove.name}: ${hitLabel} ${damage} de dano! (D20: ${roll})`);
        setRivalDamage(damage);
        setRivalAction(`${hitLabel} ${damage} dano!`);
        
        // Aplica dano ao pokemon do jogador com animacao de shake
        setPlayerShake(true);
        setShowParticles(true);
        playDamageReceived();
        
        setTimeout(() => {
          setPlayerShake(false);
          setShowParticles(false);
          applyOpponentDamage(damage);
          setRivalDamage(null);
          setRivalAction(null);
          setIsPlayerTurn(true);
          // Restaura PA do jogador
          useGameStore.setState((state) => ({
            battle: { ...state.battle, pa: state.battle.maxPa },
          }));
        }, 800);
      }, 1000);
    }, 1000);
  }, [activeRival, pokemonTypes, npc.ia, pokemonAttrs, addLog, applyOpponentDamage]);

  // Handler de troca de pokemon
  const handleSwitchPokemon = (uid: string) => {
    if (uid === battle.activePokemonUid) return;
    const targetPokemon = team.find((p) => p.uid === uid);
    if (!targetPokemon || targetPokemon.currentHp <= 0) return;
    if (!spendPA("switchPokemon")) return;
    
    setShowParticlesPok(true);
    setTimeout(() => setShowParticlesPok(false), 1000);
    setIsSwitching(true);
    playSendPokemon();
    addLog(`Trocou para ${targetPokemon.name}!`);
    
    setTimeout(() => {
      switchBattlePokemon(uid);
      setTimeout(() => {
        setIsSwitching(false);
      }, 300);
    }, 400);
  };

  // Handler de resultado do dado
  const handleDiceResult = useCallback(
    (roll: number) => {
      setIsRolling(false);
      resolveDiceRoll(roll);
      
      setTimeout(() => {
        const state = useGameStore.getState();
        const hr = state.battle.hitResult;
        const damageDealt = state.battle.damageDealt || 0;
        
        if (hr === "critical-hit") playCriticalHit();
        else if (hr === "strong-hit" || hr === "hit") playAttackHit();
        else if (hr === "miss") playMiss();
        else if (hr === "critical-miss") playCriticalMiss();
        
        // Aplica dano ao rival com animacao de shake
        if (damageDealt > 0 && activeRival) {
          setRivalShake(true);
          setShowRivalParticles(true);
          setTimeout(() => {
            setRivalShake(false);
            setShowRivalParticles(false);
            setRivalTeam((prev) => {
              const updated = [...prev];
              updated[activeRivalIndex] = {
                ...updated[activeRivalIndex],
                currentHp: Math.max(0, updated[activeRivalIndex].currentHp - damageDealt),
              };
              return updated;
            });
          }, 500);
        }
      }, 50);
    },
    [resolveDiceRoll, activeRival, activeRivalIndex]
  );

  // Handler de selecao de ataque
  const handleAttackSelect = (moveId: string) => {
    const moveDef = getMove(moveId);
    const usesCards = moveDef && showBattleCards && moveDef.energy_cost > 0;
    if (!usesCards) {
      if (!spendPA("attack")) return;
    }
    selectMove(moveId);
    setIsRolling(true);
    playAttack();
    playDiceRoll();
    
    // Animacao de ataque do jogador
    setPlayerAttacking(true);
    if (moveDef) {
      setAttackEffect({ type: moveDef.type as PokemonType, side: "rival" });
    }
    setTimeout(() => {
      setPlayerAttacking(false);
      setAttackEffect(null);
    }, 600);
  };

  // Handler do fim do turno do jogador
  const handleEndPlayerTurn = () => {
    playButtonClick();
    addLog("Fim do turno do jogador.");
    setIsPlayerTurn(false);
    setBattlePhase("menu");
    
    setTimeout(() => {
      executeRivalTurn();
    }, 500);
  };

  // Handler de uso de item
  const handleUseBagItem = (bagItemId: string) => {
    if (!spendPA("item")) {
      setShowBagDialog(false);
      return;
    }
    const def = BAG_ITEMS.find((d) => d.id === bagItemId);
    if (def && pokemon) {
      useBagItem(bagItemId, pokemon.uid);
      addLog(`Usou ${def.name}!`);
      playHeal();
    }
    setShowBagDialog(false);
    setBattlePhase("menu");
  };

  // Handler de vitoria
  const handleVictory = () => {
    // Adiciona recompensas
    addMoney(npc.recompensa);
    addStarDust(npc.stardust);
    
    // XP para todos os pokemon que participaram
    const aliveTeam = team.filter((p) => p.currentHp > 0);
    const xpPerPokemon = Math.floor(npc.xp / Math.max(1, aliveTeam.length));
    aliveTeam.forEach((p) => {
      addXp(p.uid, xpPerPokemon);
    });
    
    // Registra no historico do treinador
    addTrainerBattleHistory({
      type: "team-victory",
      date: new Date().toISOString(),
      xpPerPokemon,
      teamSnapshot: aliveTeam.map((p) => p.name),
    });
    
    // Incrementa contador de vitorias semanais
    const storedWins = localStorage.getItem("pokerpg-weekly-duel-wins");
    const currentWins = storedWins ? parseInt(storedWins) : 0;
    localStorage.setItem("pokerpg-weekly-duel-wins", String(currentWins + 1));
    
    // Incrementa XP de batalha
    const storedBattleXp = localStorage.getItem("pokerpg-battle-xp");
    const storedBattleLevel = localStorage.getItem("pokerpg-battle-level");
    let currentBattleXp = storedBattleXp ? parseInt(storedBattleXp) : 0;
    let currentBattleLevel = storedBattleLevel ? parseInt(storedBattleLevel) : 1;
    
    // XP de batalha baseado no nivel do NPC
    const battleXpGained = npc.xp;
    currentBattleXp += battleXpGained;
    
    // Verifica level up de batalha
    const xpForNextLevel = currentBattleLevel * 500;
    while (currentBattleXp >= xpForNextLevel) {
      currentBattleXp -= xpForNextLevel;
      currentBattleLevel++;
    }
    
    localStorage.setItem("pokerpg-battle-xp", String(currentBattleXp));
    localStorage.setItem("pokerpg-battle-level", String(currentBattleLevel));
    
    // Para a musica de batalha
    stopBattleMusic();
    
    endBattle();
    onVictory(npc);
  };

  // Handler de derrota
  const handleDefeat = () => {
    // Registra derrotas nos pokemon que desmaiaram
    team.filter((p) => p.currentHp <= 0).forEach((p) => {
      addPokemonBattleHistory(p.uid, {
        type: "faint",
        date: new Date().toISOString(),
        opponentName: npc.nome,
      });
    });
    
    // Para a musica de batalha
    stopBattleMusic();
    
    endBattle();
    onDefeat();
  };

  if (!pokemon) return null;

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Barra de navegacao superior */}
      <nav className="flex items-center justify-between px-2 py-1.5 bg-card border-b border-border gap-1">
        {/* Esquerda: Voltar + Turno */}
        <div className="flex items-center gap-1.5">
          <Button
            onClick={() => {
              stopBattleMusic();
              endBattle();
              onClose();
            }}
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-1 bg-secondary/50 rounded px-1.5 py-0.5">
            <RefreshCw className="w-3 h-3 text-muted-foreground" />
            <span className="text-[10px] font-bold text-muted-foreground">
              Turno: {battle.turnNumber}
            </span>
          </div>
          <div
            className="px-2 py-0.5 rounded text-[10px] font-bold"
            style={{
              backgroundColor: isPlayerTurn ? "rgba(59, 130, 246, 0.2)" : "rgba(239, 68, 68, 0.2)",
              color: isPlayerTurn ? "#3b82f6" : "#ef4444",
            }}
          >
            {isPlayerTurn ? "SEU TURNO" : "TURNO DO RIVAL"}
          </div>
        </div>

        {/* Centro: PA orbs */}
        <div className="flex items-center gap-0.5 bg-blue-500/10 rounded-sm">
          {Array.from({ length: battle.maxPa }).map((_, i) => (
            <motion.img
              src={`/images/PA.png`}
              key={i}
              initial={false}
              animate={{
                scale: i < battle.pa ? 1 : 0.65,
                opacity: i < battle.pa ? 1 : 0.2,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className={`w-6 h-6 rounded-full border-[1.5px] ${
                i < battle.pa
                  ? "bg-amber-400/30 shadow-[0_0_4px_rgba(251,191,36,0.5)]"
                  : "bg-transparent border-gray-600"
              }`}
            />
          ))}
        </div>

        {/* Direita: Passar Turno */}
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            onClick={handleEndPlayerTurn}
            disabled={!isPlayerTurn}
            className="h-7 px-2 text-[9px] font-bold bg-amber-500/90 hover:bg-amber-500 text-black gap-0.5"
          >
            <SkipForward className="w-3 h-3" />
            Passar
          </Button>
        </div>
      </nav>

      {/* AREA DO RIVAL */}
      <div className="w-full flex justify-center z-30 mt-2 px-2">
        <div className="w-full bg-red-900/30 backdrop-blur-md rounded-xl px-4 py-2 flex items-center justify-between border border-red-500/30">
          {/* Foto + Nome */}
          <div className="flex items-center gap-3">
            <img
              src={npc.imagem}
              alt={npc.nome}
              className="w-10 h-10 rounded-full border-2 border-red-400 shadow-md object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/images/trainers/player.jpg";
              }}
            />
            <div className="flex flex-col">
              <span className="text-[10px] text-red-300 uppercase tracking-widest">
                {getNivelLabel(npc.nivel)}
              </span>
              <span className="text-sm font-bold text-white">{npc.nome}</span>
            </div>
          </div>

          {/* Pokebolas do rival */}
          <div className="flex items-center gap-1.5">
            {rivalTeam.map((p, i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full border-2 ${
                  p.currentHp > 0
                    ? i === activeRivalIndex
                      ? "bg-red-500 border-white shadow-md"
                      : "bg-red-500 border-red-300"
                    : "bg-gray-600 border-gray-400 opacity-40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CAMPO DE BATALHA */}
      <div className="relative w-full max-w-[500px] mx-auto">
        {/* Pokemon do Rival em cima */}
        {activeRival && (
          <div
            className="absolute top-2 right-4 z-20 bg-black/60 rounded-lg px-3 py-2"
            style={{ minWidth: 140 }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-white">{activeRival.nome}</span>
              <span className="text-[9px] text-muted-foreground">Lv.{activeRival.level}</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-3 h-3 text-red-400 shrink-0" />
              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: rivalHpColor }}
                  animate={{ width: `${rivalHpPercent}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-[9px] font-mono text-muted-foreground">
                {activeRival.currentHp}/{activeRival.maxHp}
              </span>
            </div>
          </div>
        )}

        {/* Acao do Rival */}
        <AnimatePresence>
          {rivalAction && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute top-16 left-1/2 -translate-x-1/2 z-30 bg-red-600/90 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg"
            >
              {rivalAction}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ARENA */}
        <div className="relative w-full h-[220px] overflow-hidden rounded-md mt-2">
          {/* Background */}
          <img
            src={`/images/arenas/${arena}.gif`}
            alt="Arena"
            className="absolute inset-0 w-full h-full object-fill"
            style={{ imageRendering: "pixelated" }}
          />

          {/* CONTAINER DOS SPRITES */}
          <div className="absolute inset-0">
            {/* Sombra Rival */}
            <div
              style={{
                position: "absolute",
                top: "42%",
                right: "28%",
                transform: "translateX(50%)",
                width: "70px",
                height: "18px",
                background: "rgba(0,0,0,0.25)",
                borderRadius: "50%",
                filter: "blur(4px)",
              }}
            />

            {/* Pokemon Rival */}
            {activeRival && (
              <motion.div
                className="absolute"
                style={{
                  top: "15%",
                  right: "25%",
                  transform: "translateX(60%)",
                }}
              >
                {showRivalParticles && (
                  <BattleParticles effectType="damage" isAnimating={true} />
                )}
                {/* Flash overlay on hit */}
                <AnimatePresence>
                  {rivalShake && (
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
                  src={getBattleSpriteUrl(activeRival.speciesId)}
                  alt={activeRival.nome}
                  style={{
                    imageRendering: "pixelated",
                    width: 64,
                    height: 64,
                  }}
                  animate={
                    rivalShake
                      ? { x: [0, -8, 8, -6, 6, -3, 3, 0], opacity: [1, 0.5, 1, 0.5, 1] }
                      : rivalAttacking
                      ? { x: [0, -30, -30, 0], transition: { duration: 0.4 } }
                      : activeRival.currentHp <= 0
                      ? { opacity: 0.3, y: 20 }
                      : { opacity: 1, y: [0, -3, 0], transition: { duration: 2, repeat: Infinity } }
                  }
                  transition={{ duration: 0.3 }}
                  crossOrigin="anonymous"
                />
              </motion.div>
            )}

            {/* Sombra Player */}
            <div
              style={{
                position: "absolute",
                bottom: "12%",
                left: "30%",
                transform: "translateX(-50%)",
                width: "100px",
                height: "24px",
                background: "rgba(0,0,0,0.35)",
                borderRadius: "50%",
                filter: "blur(6px)",
              }}
            />

            {/* Pokemon Player */}
            <div
              className="absolute"
              style={{
                bottom: "10%",
                left: "15%",
              }}
            >
              {showParticles && <BattleParticles effectType="damage" isAnimating={true} />}
              {showParticlePok && <BattleParticles effectType="changed" isAnimating={true} />}
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
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/${pokemon.speciesId}.gif`}
                alt={pokemon.name}
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
                transition={{ duration: 0.3 }}
                style={{
                  width: 80,
                  height: 80,
                  imageRendering: "pixelated",
                }}
                crossOrigin="anonymous"
              />
            </div>
          </div>

          {/* Type Attack Effect Overlay */}
          <AnimatePresence>
            {attackEffect && (
              <motion.div
                key={`effect-${attackEffect.side}-${Date.now()}`}
                className="absolute z-30 pointer-events-none flex items-center justify-center"
                style={
                  attackEffect.side === "rival"
                    ? { top: 40, right: 60, width: 100, height: 100 }
                    : { bottom: 50, left: 40, width: 100, height: 100 }
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

          {/* KO Overlay */}
          {isFainted && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-black/70 text-white px-4 py-2 rounded-md font-bold">
                KO!
              </span>
            </div>
          )}

          {/* Switch Animation */}
          <AnimatePresence>
            {isSwitching && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-black/70"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ type: "spring", damping: 10 }}
                >
                  <svg width="70" height="70" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="48" fill="#EF4444" stroke="white" strokeWidth="3" />
                    <rect x="2" y="48" width="96" height="4" fill="#111" />
                    <circle cx="50" cy="50" r="16" fill="white" stroke="#111" strokeWidth="3" />
                    <circle cx="50" cy="50" r="8" fill="#111" />
                  </svg>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* AREA DO JOGADOR */}
      <div className="w-full flex justify-center z-30 mt-2 px-2">
        <div className="w-full bg-blue-900/30 backdrop-blur-md rounded-xl px-4 py-2 flex items-center justify-between border border-blue-500/30">
          {/* Foto + Nome */}
          <div className="flex items-center gap-3">
            <img
              src="/images/trainers/player.jpg"
              alt={trainer.name}
              className="w-10 h-10 rounded-full border-2 border-blue-400 shadow-md object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/images/trainers/player.jpg";
              }}
            />
            <div className="flex flex-col">
              <span className="text-[10px] text-blue-300 uppercase tracking-widest">
                Treinador
              </span>
              <span className="text-sm font-bold text-white">{trainer.name || "Jogador"}</span>
            </div>
          </div>

          {/* Pokebolas do jogador */}
          <div className="flex items-center gap-1.5">
            {team.map((p, i) => (
              <button
                key={p.uid}
                onClick={() => isPlayerTurn && handleSwitchPokemon(p.uid)}
                disabled={!isPlayerTurn || p.currentHp <= 0 || p.uid === battle.activePokemonUid}
                className={`w-5 h-5 rounded-full border-2 transition-transform ${
                  p.currentHp > 0
                    ? p.uid === battle.activePokemonUid
                      ? "bg-blue-500 border-white shadow-md scale-110"
                      : "bg-blue-500 border-blue-300 hover:scale-110"
                    : "bg-gray-600 border-gray-400 opacity-40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Info do Pokemon do jogador */}
      <div className="px-4 mt-2">
        <div className="bg-black/60 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="text-xs font-bold text-foreground">
              <span className="text-blue-400">#{pokemon.speciesId}</span> {pokemon.name}
            </h3>
            <div className="flex items-center gap-2">
              {pokemonAttrs && (
                <span className="text-[9px] font-mono text-blue-400 bg-blue-400/10 rounded-full px-1.5 py-0.5">
                  DEF {pokemonAttrs.defesa}
                </span>
              )}
              <span className="text-[10px] text-muted-foreground font-mono">Lv.{pokemon.level}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <div className="flex-1 h-2.5 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: hpColor }}
                animate={{ width: `${hpPercent}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span style={{ color: hpColor }} className="text-[10px] font-mono w-16 text-right">
              {Math.round(pokemon.currentHp)}/{pokemon.maxHp}
            </span>
          </div>
        </div>
      </div>

      {/* Cartas de batalha */}
      {showBattleCards && battle.phase === "menu" && isPlayerTurn && (
        <div className="px-3 mt-2">
          <BattleCards />
        </div>
      )}

      {/* Area de acoes */}
      <div className="flex-1 px-4 pb-4 flex flex-col">
        <AnimatePresence mode="wait">
          {/* Menu principal */}
          {battle.phase === "menu" && isPlayerTurn && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-2 mt-auto"
            >
              <div className="grid grid-cols-3 gap-1">
                <Button
                  onClick={() => setBattlePhase("attack-select")}
                  disabled={isFainted || battle.pa < PA_CONFIG.costs.attack}
                  className="h-14 flex flex-col gap-0.5 bg-orange-500 text-white hover:bg-orange-600 relative"
                >
                  <Swords className="w-6 h-6" />
                  <span className="text-[9px] font-bold">Atacar</span>
                  <span className="absolute top-0.5 right-1 text-[8px] font-mono font-bold text-orange-200">
                    {PA_CONFIG.costs.attack}PA
                  </span>
                </Button>

                <Button
                  onClick={() => setShowBagDialog(true)}
                  disabled={battle.pa < PA_CONFIG.costs.item}
                  variant="outline"
                  className="h-14 flex flex-col gap-0.5 border-border text-white bg-green-600 hover:bg-green-700 relative"
                >
                  <Backpack className="w-5 h-5" />
                  <span className="text-[9px] font-bold">Bolsa</span>
                  <span className="absolute top-0.5 right-1 text-[8px] font-mono font-bold text-green-200">
                    {PA_CONFIG.costs.item}PA
                  </span>
                </Button>

                <Button
                  onClick={handleEndPlayerTurn}
                  className="h-14 flex flex-col gap-0.5 bg-amber-600 text-white hover:bg-amber-700"
                >
                  <SkipForward className="w-5 h-5" />
                  <span className="text-[9px] font-bold">Passar</span>
                </Button>
              </div>
            </motion.div>
          )}

          {/* Selecao de ataque */}
          {battle.phase === "attack-select" && isPlayerTurn && (
            <motion.div
              key="attacks"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              style={{ backgroundColor: "rgb(0,0,0,0.5)" }}
              className="p-3 rounded-lg flex flex-col gap-3 mt-auto z-10"
            >
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setBattlePhase("menu")}
                className="self-start text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Voltar
              </Button>
              <div className="grid grid-cols-2 gap-2">
                {(() => {
                  const hasAmplificada = hasAuraAmplificada(battle.cardField);
                  return pokemon.moves.map((m) => {
                    const moveDef = getMove(m.moveId);
                    if (!moveDef) return null;
                    const noPP = m.currentPP <= 0;
                    const energyCost = moveDef.energy_cost;
                    const energyType = moveDef.energy_type;
                    const availableEnergy =
                      energyCost > 0 ? countFieldCardsByElement(battle.cardField, energyType) : 0;
                    const notEnoughEnergy =
                      showBattleCards && energyCost > 0 && availableEnergy < energyCost;
                    const canUseAmplificada = notEnoughEnergy && hasAmplificada && energyCost > 0;
                    const isDisabled = noPP || (notEnoughEnergy && !canUseAmplificada);
                    const EnergyIcon = ENERGY_ICON_MAP[energyType] || Circle;
                    return (
                      <Button
                        key={m.moveId}
                        onClick={() => handleAttackSelect(m.moveId)}
                        disabled={isDisabled}
                        className="h-auto min-h-[60px] py-2 px-3 flex flex-col items-start gap-0.5 text-left relative"
                        style={{
                          backgroundColor: isDisabled
                            ? undefined
                            : canUseAmplificada
                            ? "#B8860B"
                            : `${TYPE_COLORS[moveDef.type as PokemonType]}CC`,
                          color: isDisabled ? undefined : "#fff",
                          border: canUseAmplificada ? "1px solid #FFD700" : "none",
                        }}
                      >
                        <span className="text-sm font-bold">{moveDef.name}</span>
                        <div className="flex items-center gap-2 text-[10px] opacity-90 flex-wrap">
                          {moveDef.damage_dice && <span>{moveDef.damage_dice}</span>}
                          <span>
                            PP {m.currentPP}/{m.maxPP}
                          </span>
                        </div>
                      </Button>
                    );
                  });
                })()}
              </div>
            </motion.div>
          )}

          {/* Rolagem de dado */}
          {battle.phase === "rolling" && (
            <motion.div
              style={{ backgroundColor: "rgb(0,0,0,0.6)", zIndex: 10, padding: 10, borderRadius: 8 }}
              key="rolling"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center"
            >
              {selectedMove && (
                <div className="text-center mb-2">
                  <p className="text-sm text-muted-foreground">
                    {pokemon.name} usou <b className="text-white">{selectedMove.name}!</b>
                  </p>
                  <span className="text-xs text-muted-foreground">
                    Precisa rolar D20 {">"}= {selectedMove.accuracy} para acertar
                  </span>
                </div>
              )}
              <D20Dice onResult={handleDiceResult} rolling={isRolling} />
            </motion.div>
          )}

          {/* Resultado */}
          {battle.phase === "result" && (
            <motion.div
              onClick={() => {
                const bd = battle.damageBreakdown;
                const logMsg =
                  bd && !bd.isStatus
                    ? `${pokemon.name} usou ${selectedMove?.name}: D20=${battle.diceRoll} - ${getHitResultLabel(
                        battle.hitResult as HitResult
                      )} | ${bd.formula} => ${bd.rawTotal} dano`
                    : `${pokemon.name} usou ${selectedMove?.name}: rolou ${battle.diceRoll} - ${getHitResultLabel(
                        battle.hitResult as HitResult
                      )} (${battle.damageDealt} dano)`;
                addLog(logMsg);
                setBattlePhase("menu");
              }}
              style={{ backgroundColor: "rgb(0,0,0,0.5)", zIndex: 10, padding: 10, borderRadius: 8 }}
              key="result"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 10 }}
                className="w-20 h-20 rounded-full flex flex-col items-center justify-center"
                style={{
                  backgroundColor: `rgb(0,0,0,0.9)`,
                  border: `3px solid ${getHitResultColor(battle.hitResult as HitResult)}`,
                }}
              >
                <span
                  className="text-2xl font-bold font-mono"
                  style={{ color: getHitResultColor(battle.hitResult as HitResult) }}
                >
                  {battle.diceRoll}
                </span>
              </motion.div>

              <motion.h3
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-bold"
                style={{ color: getHitResultColor(battle.hitResult as HitResult) }}
              >
                {getHitResultLabel(battle.hitResult as HitResult)}
              </motion.h3>

              {battle.damageBreakdown && !battle.damageBreakdown.isStatus && (
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-accent" />
                  <span className="text-lg font-bold text-accent">
                    {battle.damageBreakdown.rawTotal > 0
                      ? `${battle.damageBreakdown.rawTotal} de dano!`
                      : "Sem dano"}
                  </span>
                </div>
              )}

              <p className="text-[10px] text-muted-foreground">Toque para continuar</p>
            </motion.div>
          )}

          {/* Turno do rival */}
          {!isPlayerTurn && battle.phase === "menu" && (
            <motion.div
              key="rival-turn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center gap-4 mt-auto py-8"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw className="w-6 h-6 text-red-400" />
                </motion.div>
                <span className="text-red-400 font-bold">Turno do {npc.nome}...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dialog da bolsa */}
      <Dialog open={showBagDialog} onOpenChange={setShowBagDialog}>
        <DialogContent className="bg-card border-border text-foreground max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">Bolsa</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-64">
            <div className="flex flex-col gap-1">
              {bag
                .filter((b) => {
                  const def = BAG_ITEMS.find((d) => d.id === b.itemId);
                  return def && (def.category === "potion" || def.category === "status");
                })
                .map((item) => {
                  const def = BAG_ITEMS.find((d) => d.id === item.itemId);
                  if (!def) return null;
                  return (
                    <Button
                      key={item.itemId}
                      variant="ghost"
                      onClick={() => handleUseBagItem(item.itemId)}
                      className="flex items-center justify-between h-auto py-2 text-foreground hover:bg-secondary"
                    >
                      <span className="text-sm">{def.name}</span>
                      <span className="text-xs text-accent font-mono">x{item.quantity}</span>
                    </Button>
                  );
                })}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Dialog de vitoria */}
      <Dialog open={showVictoryDialog} onOpenChange={() => {}}>
        <DialogContent className="bg-card border-border text-foreground max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center justify-center gap-2">
              <Trophy className="w-6 h-6 text-amber-400" />
              Vitoria!
            </DialogTitle>
            <DialogDescription className="text-center">
              Voce derrotou {npc.nome}!
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div className="bg-secondary/50 rounded-lg p-4">
              <h4 className="text-xs font-bold text-muted-foreground uppercase mb-2">
                Recompensas
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center gap-1 p-2 bg-card rounded-lg">
                  <Coins className="w-5 h-5 text-amber-400" />
                  <span className="text-sm font-bold">${npc.recompensa}</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 bg-card rounded-lg">
                  <Star className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-bold">{npc.stardust}</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 bg-card rounded-lg">
                  <Trophy className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm font-bold">{npc.xp} XP</span>
                </div>
              </div>
            </div>
            <Button
              onClick={handleVictory}
              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold"
            >
              Coletar Recompensas
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de derrota */}
      <Dialog open={showDefeatDialog} onOpenChange={() => {}}>
        <DialogContent className="bg-card border-border text-foreground max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center justify-center gap-2 text-red-400">
              <Skull className="w-6 h-6" />
              Derrota!
            </DialogTitle>
            <DialogDescription className="text-center">
              Todos os seus Pokemon desmaiaram.
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={handleDefeat}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-bold"
          >
            Continuar
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

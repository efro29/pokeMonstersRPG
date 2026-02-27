"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/lib/game-store";
import { getPokemon, getSpriteUrl, TYPE_COLORS } from "@/lib/pokemon-data";
import { CARD_ELEMENTS, ELEMENT_NAMES_PT, ELEMENTCOLORS } from "@/lib/card-data";
import type { NpcChallenge } from "./challenges-tab";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Heart,
  Swords,
  Trophy,
  Skull,
  ArrowLeft,
  RefreshCw,
  Zap,
  Shield,
  Star,
  Sparkles,
} from "lucide-react";
import {
  playAttack,
  playAttackHit,
  playDamageReceived,
  playVictoryFanfare,
  playButtonClick,
  playSendPokemon,
  playCardDraw,
} from "@/lib/sounds";

interface CardDuelSceneProps {
  challenge: NpcChallenge;
  onEnd: (won: boolean) => void;
}

interface DuelPokemon {
  speciesId: number;
  level: number;
  currentHp: number;
  maxHp: number;
  name: string;
}

type CardType = typeof CARD_ELEMENTS[number];

interface DuelCard {
  id: string;
  type: CardType;
  value: number; // 1-10 damage value
}

// Generate a random card
function generateCard(): DuelCard {
  const types = CARD_ELEMENTS;
  return {
    id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: types[Math.floor(Math.random() * types.length)],
    value: Math.floor(Math.random() * 10) + 1, // 1-10
  };
}

// Calculate type effectiveness multiplier
function getTypeMultiplier(attackType: CardType, defenderTypes: string[]): number {
  // Simplified type chart
  const effectiveness: Record<string, { strong: string[]; weak: string[] }> = {
    fire: { strong: ["grass", "ice", "bug", "steel"], weak: ["water", "rock", "fire", "dragon"] },
    water: { strong: ["fire", "ground", "rock"], weak: ["grass", "water", "dragon", "electric"] },
    grass: { strong: ["water", "ground", "rock"], weak: ["fire", "grass", "poison", "flying", "bug", "dragon", "steel"] },
    electric: { strong: ["water", "flying"], weak: ["grass", "electric", "dragon", "ground"] },
    ice: { strong: ["grass", "ground", "flying", "dragon"], weak: ["fire", "water", "ice", "steel"] },
    fighting: { strong: ["normal", "ice", "rock", "dark", "steel"], weak: ["poison", "flying", "psychic", "bug", "fairy"] },
    poison: { strong: ["grass", "fairy"], weak: ["poison", "ground", "rock", "ghost"] },
    ground: { strong: ["fire", "electric", "poison", "rock", "steel"], weak: ["grass", "bug"] },
    flying: { strong: ["grass", "fighting", "bug"], weak: ["electric", "rock", "steel"] },
    psychic: { strong: ["fighting", "poison"], weak: ["psychic", "steel"] },
    bug: { strong: ["grass", "psychic", "dark"], weak: ["fire", "fighting", "poison", "flying", "ghost", "steel", "fairy"] },
    rock: { strong: ["fire", "ice", "flying", "bug"], weak: ["fighting", "ground", "steel"] },
    ghost: { strong: ["psychic", "ghost"], weak: ["dark"] },
    dragon: { strong: ["dragon"], weak: ["steel"] },
    dark: { strong: ["psychic", "ghost"], weak: ["fighting", "dark", "fairy"] },
    steel: { strong: ["ice", "rock", "fairy"], weak: ["fire", "water", "electric", "steel"] },
    fairy: { strong: ["fighting", "dragon", "dark"], weak: ["fire", "poison", "steel"] },
    normal: { strong: [], weak: ["rock", "steel"] },
  };

  const typeData = effectiveness[attackType];
  if (!typeData) return 1;

  for (const defType of defenderTypes) {
    if (typeData.strong.includes(defType)) return 1.5;
    if (typeData.weak.includes(defType)) return 0.5;
  }
  return 1;
}

export function CardDuelScene({ challenge, onEnd }: CardDuelSceneProps) {
  const { team, recordBattleResult, addMoney, addPokemonBattleHistory } = useGameStore();
  
  // Player team state
  const [playerTeam, setPlayerTeam] = useState<DuelPokemon[]>(() => 
    team.filter(p => p.currentHp > 0).map(p => ({
      speciesId: p.speciesId,
      level: p.level,
      currentHp: p.currentHp,
      maxHp: p.maxHp,
      name: p.name,
    }))
  );
  const [playerActiveIdx, setPlayerActiveIdx] = useState(0);

  // NPC team state
  const [npcTeam, setNpcTeam] = useState<DuelPokemon[]>(() =>
    challenge.npcTeam.map(p => ({
      speciesId: p.speciesId,
      level: p.level,
      currentHp: p.currentHp,
      maxHp: p.maxHp,
      name: getPokemon(p.speciesId)?.name || "Pokemon",
    }))
  );
  const [npcActiveIdx, setNpcActiveIdx] = useState(0);

  // Card state
  const [playerCard, setPlayerCard] = useState<DuelCard | null>(null);
  const [npcCard, setNpcCard] = useState<DuelCard | null>(null);
  const [canDraw, setCanDraw] = useState(true);
  
  // Battle state
  const [turn, setTurn] = useState(1);
  const [phase, setPhase] = useState<"draw" | "compare" | "result" | "switch" | "end">("draw");
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [won, setWon] = useState(false);
  const [animatingDamage, setAnimatingDamage] = useState<"player" | "npc" | null>(null);

  // Active Pokemon
  const playerActive = playerTeam[playerActiveIdx];
  const npcActive = npcTeam[npcActiveIdx];
  const playerSpecies = getPokemon(playerActive?.speciesId);
  const npcSpecies = getPokemon(npcActive?.speciesId);

  // Check win/loss conditions
  useEffect(() => {
    const playerAlive = playerTeam.filter(p => p.currentHp > 0);
    const npcAlive = npcTeam.filter(p => p.currentHp > 0);

    if (playerAlive.length === 0 && phase !== "end") {
      setPhase("end");
      setWon(false);
      setShowResult(true);
    } else if (npcAlive.length === 0 && phase !== "end") {
      setPhase("end");
      setWon(true);
      setShowResult(true);
      playVictoryFanfare();
    }
  }, [playerTeam, npcTeam, phase]);

  // Auto-switch to next alive Pokemon
  useEffect(() => {
    if (playerActive && playerActive.currentHp <= 0) {
      const nextAlive = playerTeam.findIndex((p, i) => i > playerActiveIdx && p.currentHp > 0);
      if (nextAlive !== -1) {
        setPlayerActiveIdx(nextAlive);
        playSendPokemon();
        addLog(`Voce enviou ${playerTeam[nextAlive].name}!`);
      } else {
        const firstAlive = playerTeam.findIndex(p => p.currentHp > 0);
        if (firstAlive !== -1) {
          setPlayerActiveIdx(firstAlive);
          playSendPokemon();
          addLog(`Voce enviou ${playerTeam[firstAlive].name}!`);
        }
      }
    }
  }, [playerTeam, playerActiveIdx, playerActive]);

  useEffect(() => {
    if (npcActive && npcActive.currentHp <= 0) {
      const nextAlive = npcTeam.findIndex((p, i) => i > npcActiveIdx && p.currentHp > 0);
      if (nextAlive !== -1) {
        setNpcActiveIdx(nextAlive);
        playSendPokemon();
        addLog(`${challenge.npcName} enviou ${npcTeam[nextAlive].name}!`);
      } else {
        const firstAlive = npcTeam.findIndex(p => p.currentHp > 0);
        if (firstAlive !== -1) {
          setNpcActiveIdx(firstAlive);
          playSendPokemon();
          addLog(`${challenge.npcName} enviou ${npcTeam[firstAlive].name}!`);
        }
      }
    }
  }, [npcTeam, npcActiveIdx, npcActive, challenge.npcName]);

  const addLog = (msg: string) => {
    setBattleLog(prev => [...prev.slice(-4), msg]);
  };

  // Draw cards
  const handleDraw = () => {
    if (!canDraw || phase !== "draw") return;
    
    playCardDraw();
    const pCard = generateCard();
    const nCard = generateCard();
    
    setPlayerCard(pCard);
    setNpcCard(nCard);
    setCanDraw(false);
    
    addLog(`Turno ${turn}: Cartas sacadas!`);
    
    setTimeout(() => {
      setPhase("compare");
    }, 800);
  };

  // Compare cards and apply damage
  useEffect(() => {
    if (phase !== "compare" || !playerCard || !npcCard || !playerActive || !npcActive) return;

    const playerTypes = playerSpecies?.types || ["normal"];
    const npcTypes = npcSpecies?.types || ["normal"];

    // Calculate player damage
    const playerMultiplier = getTypeMultiplier(playerCard.type, npcTypes);
    const playerBonus = playerTypes.includes(playerCard.type) ? 3 : 0; // STAB bonus
    const playerDamage = Math.round((playerCard.value + playerBonus + (playerActive.level / 10)) * playerMultiplier);

    // Calculate NPC damage
    const npcMultiplier = getTypeMultiplier(npcCard.type, playerTypes);
    const npcBonus = npcTypes.includes(npcCard.type) ? 3 : 0;
    const npcDamage = Math.round((npcCard.value + npcBonus + (npcActive.level / 10)) * npcMultiplier);

    // Determine winner based on card values
    let resultMsg = "";
    
    if (playerCard.value > npcCard.value) {
      // Player wins this round
      resultMsg = `${playerActive.name} causa ${playerDamage} de dano!`;
      if (playerMultiplier > 1) resultMsg += " Super efetivo!";
      
      setTimeout(() => {
        setAnimatingDamage("npc");
        playAttackHit();
        setNpcTeam(prev => prev.map((p, i) => 
          i === npcActiveIdx ? { ...p, currentHp: Math.max(0, p.currentHp - playerDamage) } : p
        ));
        setTimeout(() => setAnimatingDamage(null), 400);
      }, 300);
      
    } else if (npcCard.value > playerCard.value) {
      // NPC wins this round
      resultMsg = `${npcActive.name} causa ${npcDamage} de dano!`;
      if (npcMultiplier > 1) resultMsg += " Super efetivo!";
      
      setTimeout(() => {
        setAnimatingDamage("player");
        playDamageReceived();
        setPlayerTeam(prev => prev.map((p, i) => 
          i === playerActiveIdx ? { ...p, currentHp: Math.max(0, p.currentHp - npcDamage) } : p
        ));
        setTimeout(() => setAnimatingDamage(null), 400);
      }, 300);
      
    } else {
      // Tie - both take reduced damage
      const reducedPlayerDmg = Math.round(playerDamage * 0.5);
      const reducedNpcDmg = Math.round(npcDamage * 0.5);
      resultMsg = `Empate! Ambos recebem dano reduzido.`;
      
      setTimeout(() => {
        setAnimatingDamage("player");
        playDamageReceived();
        setPlayerTeam(prev => prev.map((p, i) => 
          i === playerActiveIdx ? { ...p, currentHp: Math.max(0, p.currentHp - reducedNpcDmg) } : p
        ));
        setNpcTeam(prev => prev.map((p, i) => 
          i === npcActiveIdx ? { ...p, currentHp: Math.max(0, p.currentHp - reducedPlayerDmg) } : p
        ));
        setTimeout(() => setAnimatingDamage(null), 400);
      }, 300);
    }

    addLog(resultMsg);

    // Move to next turn
    setTimeout(() => {
      setPhase("draw");
      setPlayerCard(null);
      setNpcCard(null);
      setCanDraw(true);
      setTurn(t => t + 1);
    }, 1500);
  }, [phase, playerCard, npcCard, playerActive, npcActive, playerActiveIdx, npcActiveIdx, playerSpecies, npcSpecies]);

  // End battle handler
  const handleEndBattle = () => {
    recordBattleResult(won, won ? challenge.xpReward : Math.floor(challenge.xpReward * 0.25));
    
    if (won) {
      addMoney(challenge.moneyReward);
      // Record victory for each surviving Pokemon
      team.forEach(p => {
        if (playerTeam.find(pt => pt.speciesId === p.speciesId && pt.currentHp > 0)) {
          addPokemonBattleHistory(p.uid, {
            type: "victory",
            date: new Date().toISOString(),
            opponentName: challenge.npcName,
          });
        }
      });
    } else {
      // Record defeat
      team.forEach(p => {
        addPokemonBattleHistory(p.uid, {
          type: "defeat",
          date: new Date().toISOString(),
          opponentName: challenge.npcName,
        });
      });
    }
    
    onEnd(won);
  };

  // Switch Pokemon dialog
  const [showSwitchDialog, setShowSwitchDialog] = useState(false);

  const handleSwitch = (idx: number) => {
    if (idx === playerActiveIdx || playerTeam[idx].currentHp <= 0) return;
    setPlayerActiveIdx(idx);
    playSendPokemon();
    addLog(`Voce trocou para ${playerTeam[idx].name}!`);
    setShowSwitchDialog(false);
  };

  // Render card component
  const renderCard = (card: DuelCard | null, side: "player" | "npc") => {
    if (!card) {
      return (
        <div className="w-20 h-28 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-secondary/20">
          <span className="text-xs text-muted-foreground">?</span>
        </div>
      );
    }

    const color = ELEMENTCOLORS[card.type] || "#888";
    const typeName = ELEMENT_NAMES_PT[card.type] || card.type;

    return (
      <motion.div
        initial={{ rotateY: 180, scale: 0.8 }}
        animate={{ rotateY: 0, scale: 1 }}
        transition={{ duration: 0.4, type: "spring" }}
        className="w-20 h-28 rounded-lg border-2 overflow-hidden relative"
        style={{ 
          borderColor: color,
          background: `linear-gradient(180deg, ${color}20 0%, ${color}40 100%)`,
        }}
      >
        {/* Card Value */}
        <div 
          className="absolute top-1 left-1 w-6 h-6 rounded-full flex items-center justify-center text-white font-black text-sm"
          style={{ backgroundColor: color }}
        >
          {card.value}
        </div>
        
        {/* Type Icon Area */}
        <div className="flex items-center justify-center h-16 mt-2">
          <img
            src={`/images/cardsTypes/${card.type}.png`}
            alt={typeName}
            className="w-10 h-10 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
        
        {/* Type Name */}
        <div 
          className="absolute bottom-0 left-0 right-0 py-1 text-center text-[8px] font-bold text-white"
          style={{ backgroundColor: color }}
        >
          {typeName.toUpperCase()}
        </div>
      </motion.div>
    );
  };

  // Pokemon display component
  const renderPokemon = (pokemon: DuelPokemon | undefined, side: "player" | "npc", isAnimating: boolean) => {
    if (!pokemon) return null;
    const species = getPokemon(pokemon.speciesId);
    const hpPercent = (pokemon.currentHp / pokemon.maxHp) * 100;
    const hpColor = hpPercent > 50 ? "#22C55E" : hpPercent > 25 ? "#F59E0B" : "#EF4444";
    const isFainted = pokemon.currentHp <= 0;

    return (
      <motion.div
        animate={isAnimating ? { x: [-5, 5, -5, 5, 0], transition: { duration: 0.3 } } : {}}
        className={`flex flex-col items-center ${isFainted ? "opacity-40 grayscale" : ""}`}
      >
        <motion.img
          src={getSpriteUrl(pokemon.speciesId)}
          alt={pokemon.name}
          className={`w-20 h-20 pixelated ${side === "npc" ? "-scale-x-100" : ""}`}
          style={{ imageRendering: "pixelated" }}
          crossOrigin="anonymous"
          animate={isFainted ? { y: 10, rotate: -90 } : {}}
        />
        <div className="mt-1 text-center">
          <p className="text-xs font-bold text-foreground capitalize">{pokemon.name}</p>
          <p className="text-[9px] text-muted-foreground">Nv.{pokemon.level}</p>
          {species && (
            <div className="flex gap-0.5 justify-center mt-0.5">
              {species.types.map(t => (
                <span
                  key={t}
                  className="text-[7px] px-1 rounded text-white"
                  style={{ backgroundColor: TYPE_COLORS[t] || "#888" }}
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
        {/* HP Bar */}
        <div className="w-full mt-1">
          <div className="flex items-center gap-1">
            <Heart className="w-2.5 h-2.5 text-red-500" />
            <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: hpColor }}
                initial={false}
                animate={{ width: `${hpPercent}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
          <p className="text-[8px] text-center text-muted-foreground mt-0.5">
            {Math.round(pokemon.currentHp)}/{pokemon.maxHp}
          </p>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <nav className="flex items-center justify-between px-3 py-2 bg-card border-b border-border">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEnd(false)}
            className="h-7 w-7 p-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-bold text-foreground">
            vs {challenge.npcName}
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-secondary/50 rounded px-2 py-0.5">
          <RefreshCw className="w-3 h-3 text-muted-foreground" />
          <span className="text-[10px] font-bold text-muted-foreground">Turno {turn}</span>
        </div>
      </nav>

      {/* Battle Area */}
      <div className="flex-1 flex flex-col p-3 gap-3">
        {/* NPC Side */}
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-red-400">{challenge.npcName}</span>
            <div className="flex gap-1">
              {npcTeam.map((p, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    p.currentHp > 0 ? "bg-red-500" : "bg-red-500/30"
                  } ${i === npcActiveIdx ? "ring-1 ring-white" : ""}`}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center gap-6">
            {renderPokemon(npcActive, "npc", animatingDamage === "npc")}
            {renderCard(npcCard, "npc")}
          </div>
        </div>

        {/* VS Indicator */}
        <div className="flex items-center justify-center">
          <div className="bg-primary/20 rounded-full px-4 py-1 border border-primary/30">
            <Swords className="w-5 h-5 text-primary" />
          </div>
        </div>

        {/* Player Side */}
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-blue-400">Voce</span>
            <div className="flex gap-1">
              {playerTeam.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setShowSwitchDialog(true)}
                  className={`w-3 h-3 rounded-full ${
                    p.currentHp > 0 ? "bg-blue-500" : "bg-blue-500/30"
                  } ${i === playerActiveIdx ? "ring-1 ring-white" : ""}`}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center gap-6">
            {renderCard(playerCard, "player")}
            {renderPokemon(playerActive, "player", animatingDamage === "player")}
          </div>
        </div>

        {/* Battle Log */}
        <div className="bg-secondary/30 rounded-lg p-2 min-h-[60px]">
          <div className="space-y-0.5">
            {battleLog.slice(-3).map((log, i) => (
              <p key={i} className="text-[10px] text-muted-foreground">
                {log}
              </p>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setShowSwitchDialog(true)}
            disabled={playerTeam.filter(p => p.currentHp > 0).length <= 1}
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Trocar
          </Button>
          <Button
            className="flex-1 bg-primary hover:bg-primary/90"
            onClick={handleDraw}
            disabled={!canDraw || phase !== "draw"}
          >
            <Sparkles className="w-4 h-4 mr-1" />
            Sacar Carta
          </Button>
        </div>
      </div>

      {/* Switch Pokemon Dialog */}
      <Dialog open={showSwitchDialog} onOpenChange={setShowSwitchDialog}>
        <DialogContent className="bg-card border-border text-foreground max-w-sm">
          <DialogHeader>
            <DialogTitle>Trocar Pokemon</DialogTitle>
            <DialogDescription>Escolha um Pokemon para enviar</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2">
            {playerTeam.map((p, i) => {
              const species = getPokemon(p.speciesId);
              const isActive = i === playerActiveIdx;
              const isFainted = p.currentHp <= 0;
              return (
                <button
                  key={i}
                  onClick={() => handleSwitch(i)}
                  disabled={isActive || isFainted}
                  className={`p-2 rounded-lg border text-left transition-colors ${
                    isActive 
                      ? "border-primary bg-primary/10" 
                      : isFainted 
                      ? "border-border bg-secondary/30 opacity-50" 
                      : "border-border hover:bg-secondary"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={getSpriteUrl(p.speciesId)}
                      alt={p.name}
                      className={`w-10 h-10 pixelated ${isFainted ? "grayscale" : ""}`}
                      crossOrigin="anonymous"
                    />
                    <div>
                      <p className="text-xs font-bold capitalize">{p.name}</p>
                      <p className="text-[9px] text-muted-foreground">
                        HP: {Math.round(p.currentHp)}/{p.maxHp}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Result Dialog */}
      <Dialog open={showResult} onOpenChange={() => {}}>
        <DialogContent className="bg-card border-border text-foreground max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center gap-2">
              {won ? (
                <>
                  <Trophy className="w-6 h-6 text-amber-400" />
                  <span className="text-amber-400">Vitoria!</span>
                </>
              ) : (
                <>
                  <Skull className="w-6 h-6 text-red-400" />
                  <span className="text-red-400">Derrota...</span>
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              {won 
                ? `Voce derrotou ${challenge.npcName}!` 
                : `${challenge.npcName} venceu a batalha.`}
            </p>

            {/* Rewards */}
            <div className="flex justify-center gap-4">
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-2 text-center">
                <Star className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <span className="text-xs text-muted-foreground">XP</span>
                <p className="text-sm font-bold text-amber-400">
                  +{won ? challenge.xpReward : Math.floor(challenge.xpReward * 0.25)}
                </p>
              </div>
              {won && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-2 text-center">
                  <Zap className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                  <span className="text-xs text-muted-foreground">Dinheiro</span>
                  <p className="text-sm font-bold text-emerald-400">
                    ${challenge.moneyReward}
                  </p>
                </div>
              )}
            </div>

            <Button className="w-full" onClick={handleEndBattle}>
              Continuar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRaidStore } from "@/lib/raid-store";
import { useGameStore } from "@/lib/game-store";
import { getSpriteUrl, getBattleSpriteUrl, getMove, TYPE_COLORS, getHitResultLabel, getHitResultColor } from "@/lib/pokemon-data";
import type { PokemonType, HitResult } from "@/lib/pokemon-data";
import { D20Dice } from "./d20-dice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Swords,
  Crown,
  Shield,
  Heart,
  ChevronLeft,
  Zap,
  Users,
  MessageSquare,
  Loader2,
  Target,
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
  playFlee,
} from "@/lib/sounds";

interface RaidBattleProps {
  onBack: () => void;
}

export function RaidBattle({ onBack }: RaidBattleProps) {
  const { team, trainer } = useGameStore();
  const {
    room,
    players,
    myPlayer,
    battleLog,
    isLoading,
    error,
    sendAction,
    fetchRoom,
    subscribeRealtime,
    leaveRaid,
    screen,
  } = useRaidStore();

  const [battlePhase, setBattlePhase] = useState<"waiting" | "menu" | "attack-select" | "rolling" | "result" | "master-menu" | "master-damage">("waiting");
  const [selectedMoveId, setSelectedMoveId] = useState<string | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [diceRoll, setDiceRoll] = useState<number | null>(null);
  const [hitResult, setHitResult] = useState<HitResult | null>(null);
  const [damageDealt, setDamageDealt] = useState<number | null>(null);
  const [showLog, setShowLog] = useState(false);
  const [showMasterDamageDialog, setShowMasterDamageDialog] = useState(false);
  const [damageInput, setDamageInput] = useState("");
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [activePokemonIdx, setActivePokemonIdx] = useState(0);

  const attrs = trainer.attributes || { combate: 0, afinidade: 0, sorte: 0, furtividade: 0, percepcao: 0, carisma: 0 };
  const combateBonus = Math.floor(attrs.combate / 2);
  const critExpansion = Math.floor(attrs.sorte / 2);
  const critThreshold = Math.max(15, 20 - critExpansion);

  // Subscribe to realtime
  useEffect(() => {
    if (room) {
      const unsub = subscribeRealtime();
      const interval = setInterval(fetchRoom, 2000);
      return () => {
        unsub();
        clearInterval(interval);
      };
    }
  }, [room?.id, subscribeRealtime, fetchRoom]);

  // Update phase based on whose turn it is
  useEffect(() => {
    if (!room || !myPlayer) return;

    if (screen === "finished" || room.status === "finished") {
      setBattlePhase("waiting");
      return;
    }

    const isMyTurn = room.current_turn_player_id === myPlayer.id;
    if (isMyTurn) {
      if (myPlayer.role === "master") {
        setBattlePhase("master-menu");
      } else {
        setBattlePhase("menu");
      }
    } else {
      setBattlePhase("waiting");
    }
  }, [room?.current_turn_player_id, myPlayer?.id, myPlayer?.role, room?.status, screen]);

  const isMaster = myPlayer?.role === "master";
  const isMyTurn = room?.current_turn_player_id === myPlayer?.id;
  const trainers = players.filter((p) => p.role === "trainer");
  const master = players.find((p) => p.role === "master");

  // Get master's active pokemon from room data
  const masterPokemon = (room?.master_pokemon as Array<{
    uid: string;
    speciesId: number;
    name: string;
    level: number;
    maxHp: number;
    currentHp: number;
    moves: Array<{ moveId: string; currentPP: number; maxPP: number }>;
  }>) || [];

  const activeMasterPokemon = masterPokemon[activePokemonIdx] || masterPokemon[0];

  // My pokemon (for trainer)
  const myActivePokemon = team[0]; // Use first pokemon in team

  const resolveHit = useCallback((roll: number, move: { accuracy: number; power: number }) => {
    const totalRoll = roll + combateBonus;
    let result: HitResult;
    let damage = 0;

    if (roll === 1) {
      result = "critical-miss";
      damage = 0;
    } else if (roll >= critThreshold) {
      result = "critical-hit";
      damage = Math.floor(move.power * 1.5);
    } else if (totalRoll >= move.accuracy + 5) {
      result = "strong-hit";
      damage = Math.floor(move.power * 1.2);
    } else if (totalRoll >= move.accuracy) {
      result = "hit";
      damage = move.power;
    } else {
      result = "miss";
      damage = 0;
    }

    return { result, damage };
  }, [combateBonus, critThreshold]);

  const handleAttackSelect = (moveId: string) => {
    setSelectedMoveId(moveId);
    setIsRolling(true);
    setBattlePhase("rolling");
    playAttack();
    playDiceRoll();
  };

  const handleDiceResult = useCallback((roll: number) => {
    setIsRolling(false);
    setDiceRoll(roll);

    const move = selectedMoveId ? getMove(selectedMoveId) : null;
    if (!move) return;

    const { result, damage } = resolveHit(roll, move);
    setHitResult(result);
    setDamageDealt(damage);
    setBattlePhase("result");

    setTimeout(() => {
      if (result === "critical-hit") playCriticalHit();
      else if (result === "strong-hit" || result === "hit") playAttackHit();
      else if (result === "miss") playMiss();
      else if (result === "critical-miss") playCriticalMiss();
    }, 50);
  }, [selectedMoveId, resolveHit]);

  const handleConfirmAttack = async () => {
    const move = selectedMoveId ? getMove(selectedMoveId) : null;
    if (!move) return;

    await sendAction("attack", {
      moveName: move.name,
      moveType: move.type,
      diceRoll,
      hitResult,
      damageDealt,
      pokemonName: myActivePokemon?.name || "Pokemon",
      message: `${myActivePokemon?.name || "Pokemon"} usou ${move.name}: rolou ${diceRoll} - ${getHitResultLabel(hitResult as HitResult)} (${damageDealt} dano)`,
    });

    // Reset state
    setSelectedMoveId(null);
    setDiceRoll(null);
    setHitResult(null);
    setDamageDealt(null);
    setBattlePhase("waiting");
  };

  const handleMasterAttack = async () => {
    if (!damageInput || !selectedTargetId) return;

    const targetPlayer = trainers.find((p) => p.id === selectedTargetId);
    const damage = parseInt(damageInput);
    if (isNaN(damage) || damage <= 0) return;

    await sendAction("master_attack", {
      targetPlayerId: selectedTargetId,
      targetPlayerName: targetPlayer?.player_name,
      damage,
      pokemonName: activeMasterPokemon?.name || "Boss Pokemon",
      message: `${activeMasterPokemon?.name || "Boss"} atacou ${targetPlayer?.player_name} causando ${damage} de dano!`,
    });

    // Also send damage to update HP
    await sendAction("damage", {
      targetPlayerId: selectedTargetId,
      damage,
    });

    setDamageInput("");
    setSelectedTargetId(null);
    setShowMasterDamageDialog(false);
    setBattlePhase("waiting");
  };

  const handleEndBattle = async () => {
    playFlee();
    await sendAction("end_battle");
    leaveRaid();
    onBack();
  };

  const currentTurnPlayer = players.find((p) => p.id === room?.current_turn_player_id);
  const selectedMove = selectedMoveId ? getMove(selectedMoveId) : null;

  if (screen === "finished" || room?.status === "finished") {
    return (
      <div
        className="flex flex-col h-dvh max-w-md mx-auto relative overflow-hidden items-center justify-center"
        style={{
          background: "linear-gradient(180deg, #0c1220 0%, #1a1a3e 40%, #2d1b4e 70%, #0c1220 100%)",
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12 }}
          className="text-center px-6"
        >
          <Swords className="w-16 h-16 mx-auto mb-4" style={{ color: "#F59E0B" }} />
          <h2 className="font-pixel text-lg tracking-wider mb-2" style={{ color: "#ffffff" }}>
            RAID FINALIZADA!
          </h2>
          <p className="text-xs mb-8" style={{ color: "rgba(255,255,255,0.4)" }}>
            A batalha RAID foi encerrada
          </p>
          <Button
            onClick={() => { leaveRaid(); onBack(); }}
            className="font-pixel text-xs tracking-wider"
            style={{ backgroundColor: "#F59E0B", color: "#0c1220" }}
          >
            VOLTAR AO MENU
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-dvh max-w-md mx-auto relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0c1220 0%, #0d1522 40%, #000000 70%, #000000 100%)",
      }}
    >
      {/* Battle header */}
      <div className="flex items-center gap-2 p-2 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            if (isMaster) handleEndBattle();
            else { leaveRaid(); onBack(); }
          }}
          className="text-foreground hover:bg-white/5 h-8 w-8 p-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Swords className="w-4 h-4" style={{ color: "#EF4444" }} />
        <span className="font-pixel text-[10px] tracking-wider" style={{ color: "#EF4444" }}>
          RAID
        </span>
        <div className="flex-1" />
        <span className="text-[10px] font-pixel" style={{ color: "rgba(255,255,255,0.3)" }}>
          TURNO {room?.turn_number || 1}
        </span>
        <button
          onClick={() => setShowLog(!showLog)}
          className="w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-white/5"
        >
          <MessageSquare className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.4)" }} />
        </button>
      </div>

      {/* Boss Pokemon display */}
      {activeMasterPokemon && (
        <div className="relative flex flex-col items-center px-4">
          <div className="absolute top-2 w-full max-w-xs z-20">
            <div className="rounded-xl border p-2" style={{ backgroundColor: "rgba(0,0,0,0.6)", borderColor: "rgba(239, 68, 68, 0.3)" }}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <Crown className="w-3 h-3" style={{ color: "#F59E0B" }} />
                  <h3 className="text-sm font-bold text-foreground">{activeMasterPokemon.name}</h3>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">
                  Lv.{activeMasterPokemon.level}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-3 h-3 shrink-0" style={{ color: "#EF4444" }} />
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      backgroundColor:
                        (activeMasterPokemon.currentHp / activeMasterPokemon.maxHp) * 100 > 50
                          ? "#22C55E"
                          : (activeMasterPokemon.currentHp / activeMasterPokemon.maxHp) * 100 > 25
                            ? "#F59E0B"
                            : "#EF4444",
                    }}
                    animate={{ width: `${(activeMasterPokemon.currentHp / activeMasterPokemon.maxHp) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span className="text-[10px] font-mono text-muted-foreground w-14 text-right">
                  {activeMasterPokemon.currentHp}/{activeMasterPokemon.maxHp}
                </span>
              </div>
            </div>
          </div>

          <motion.div
            animate={{ opacity: activeMasterPokemon.currentHp <= 0 ? 0.3 : 1 }}
            className="relative z-10 pt-16 pb-2"
          >
            <img
              src={getBattleSpriteUrl(activeMasterPokemon.speciesId)}
              alt={activeMasterPokemon.name}
              width={160}
              height={120}
              className="drop-shadow-[0_4px_24px_rgba(239,68,68,0.3)]"
              style={{ imageRendering: "auto", minHeight: 140 }}
              crossOrigin="anonymous"
              onError={(e) => {
                (e.target as HTMLImageElement).src = getSpriteUrl(activeMasterPokemon.speciesId);
              }}
            />
          </motion.div>

          {/* Master pokemon selector (for master) */}
          {isMaster && masterPokemon.length > 1 && (
            <div className="flex gap-1 pb-2">
              {masterPokemon.map((p, idx) => (
                <button
                  key={p.uid}
                  onClick={() => setActivePokemonIdx(idx)}
                  className="px-2 py-0.5 rounded-full text-[9px] transition-all"
                  style={{
                    backgroundColor: idx === activePokemonIdx ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.05)",
                    color: idx === activePokemonIdx ? "#EF4444" : "rgba(255,255,255,0.3)",
                    border: `1px solid ${idx === activePokemonIdx ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.1)"}`,
                  }}
                >
                  {p.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Trainers status bar */}
      <div className="flex gap-1 px-3 py-2 overflow-x-auto">
        {trainers.map((t) => {
          const pokemon = (t.pokemon_data as Array<{ name: string; speciesId: number; currentHp: number; maxHp: number }>)?.[0];
          const isCurrentTurn = room?.current_turn_player_id === t.id;
          return (
            <div
              key={t.id}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg shrink-0"
              style={{
                backgroundColor: isCurrentTurn ? "rgba(59, 130, 246, 0.15)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${isCurrentTurn ? "rgba(59, 130, 246, 0.4)" : "rgba(255,255,255,0.08)"}`,
              }}
            >
              {pokemon && (
                <img
                  src={getSpriteUrl(pokemon.speciesId)}
                  alt={pokemon.name}
                  width={20}
                  height={20}
                  className="pixelated"
                  crossOrigin="anonymous"
                />
              )}
              <div>
                <p className="text-[9px] font-bold text-foreground leading-none">{t.player_name}</p>
                {pokemon && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className="w-12 h-1 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(pokemon.currentHp / pokemon.maxHp) * 100}%`,
                          backgroundColor: pokemon.currentHp / pokemon.maxHp > 0.5 ? "#22C55E" : pokemon.currentHp / pokemon.maxHp > 0.25 ? "#F59E0B" : "#EF4444",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
              {isCurrentTurn && (
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full ml-1"
                  style={{ backgroundColor: "#3B82F6" }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Turn indicator */}
      <div className="px-4 py-1">
        <div
          className="text-center py-1.5 rounded-lg text-[10px] font-pixel tracking-wider"
          style={{
            backgroundColor: isMyTurn ? "rgba(34, 197, 94, 0.1)" : "rgba(255,255,255,0.03)",
            color: isMyTurn ? "#22C55E" : "rgba(255,255,255,0.3)",
            border: `1px solid ${isMyTurn ? "rgba(34, 197, 94, 0.2)" : "rgba(255,255,255,0.05)"}`,
          }}
        >
          {isMyTurn
            ? (isMaster ? "SUA VEZ (MESTRE)" : "SUA VEZ DE ATACAR!")
            : `VEZ DE: ${currentTurnPlayer?.player_name || "..."}`}
        </div>
      </div>

      {/* Battle content */}
      <div className="flex-1 px-4 pb-4 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          {/* Waiting for turn */}
          {battlePhase === "waiting" && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center gap-3"
            >
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: "rgba(255,255,255,0.2)" }} />
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                Aguardando {currentTurnPlayer?.player_name || "..."}
              </p>
            </motion.div>
          )}

          {/* Trainer attack menu */}
          {battlePhase === "menu" && !isMaster && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-auto"
            >
              <p className="text-[10px] font-pixel text-center mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>
                ESCOLHA UM ATAQUE
              </p>
              <Button
                onClick={() => setBattlePhase("attack-select")}
                className="w-full h-14 flex flex-col gap-1"
                style={{ backgroundColor: "#EF4444", color: "#ffffff" }}
              >
                <Swords className="w-6 h-6" />
                <span className="text-sm font-bold">Atacar</span>
              </Button>
            </motion.div>
          )}

          {/* Attack select */}
          {battlePhase === "attack-select" && myActivePokemon && (
            <motion.div
              key="attacks"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="flex flex-col gap-2 mt-auto"
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
                {myActivePokemon.moves.map((m) => {
                  const moveDef = getMove(m.moveId);
                  if (!moveDef) return null;
                  const noPP = m.currentPP <= 0;
                  return (
                    <Button
                      key={m.moveId}
                      onClick={() => handleAttackSelect(m.moveId)}
                      disabled={noPP}
                      className="h-auto py-2 px-3 flex flex-col items-start gap-0.5 text-left"
                      style={{
                        backgroundColor: noPP ? undefined : `${TYPE_COLORS[moveDef.type as PokemonType]}CC`,
                        color: noPP ? undefined : "#fff",
                        border: "none",
                      }}
                    >
                      <span className="text-sm font-bold">{moveDef.name}</span>
                      <div className="flex items-center gap-2 text-[10px] opacity-90">
                        {moveDef.power > 0 && <span>PWR {moveDef.power}</span>}
                        <span>PP {m.currentPP}/{m.maxPP}</span>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Dice rolling */}
          {battlePhase === "rolling" && (
            <motion.div
              key="rolling"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center gap-4 my-auto"
            >
              {selectedMove && (
                <div className="text-center mb-2">
                  <span className="text-sm text-muted-foreground">
                    {myActivePokemon?.name} usou
                  </span>
                  <h4 className="text-lg font-bold text-foreground">
                    {selectedMove.name}!
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    Precisa rolar D20 {">"}{`=`} {selectedMove.accuracy} para acertar
                  </span>
                </div>
              )}
              <D20Dice onResult={handleDiceResult} rolling={isRolling} />
            </motion.div>
          )}

          {/* Result */}
          {battlePhase === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 my-auto"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 10 }}
                className="w-20 h-20 rounded-full flex flex-col items-center justify-center"
                style={{
                  backgroundColor: `${getHitResultColor(hitResult as HitResult)}22`,
                  border: `3px solid ${getHitResultColor(hitResult as HitResult)}`,
                }}
              >
                <span
                  className="text-2xl font-bold font-mono"
                  style={{ color: getHitResultColor(hitResult as HitResult) }}
                >
                  {diceRoll}
                </span>
                {combateBonus > 0 && (
                  <span className="text-[9px] font-mono" style={{ color: "#EF4444" }}>
                    +{combateBonus} = {(diceRoll || 0) + combateBonus}
                  </span>
                )}
              </motion.div>

              <motion.h3
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-bold"
                style={{ color: getHitResultColor(hitResult as HitResult) }}
              >
                {getHitResultLabel(hitResult as HitResult)}
              </motion.h3>

              {damageDealt !== null && damageDealt > 0 && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-2"
                >
                  <Zap className="w-5 h-5" style={{ color: "#F59E0B" }} />
                  <span className="text-lg font-bold" style={{ color: "#F59E0B" }}>
                    {damageDealt} de dano!
                  </span>
                </motion.div>
              )}

              <Button
                onClick={handleConfirmAttack}
                disabled={isLoading}
                className="w-full mt-4"
                style={{ backgroundColor: "#EF4444", color: "#ffffff" }}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirmar e Passar Turno"}
              </Button>
            </motion.div>
          )}

          {/* Master menu */}
          {battlePhase === "master-menu" && isMaster && (
            <motion.div
              key="master-menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-3 mt-auto"
            >
              <p className="text-[10px] font-pixel text-center" style={{ color: "#F59E0B" }}>
                VEZ DO MESTRE - ATAQUE OS TREINADORES
              </p>
              <Button
                onClick={() => setShowMasterDamageDialog(true)}
                className="w-full h-14 flex flex-col gap-1"
                style={{ backgroundColor: "#EF4444", color: "#ffffff" }}
              >
                <Target className="w-6 h-6" />
                <span className="text-sm font-bold">Atacar Treinador</span>
              </Button>
              <Button
                onClick={async () => {
                  playButtonClick();
                  await sendAction("master_attack", {
                    message: `${activeMasterPokemon?.name || "Boss"} passou o turno.`,
                    damage: 0,
                  });
                }}
                variant="outline"
                className="w-full h-10 text-xs border-white/20 text-foreground bg-transparent hover:bg-white/5"
              >
                Pular Turno
              </Button>
              <Button
                onClick={handleEndBattle}
                variant="outline"
                className="w-full h-10 text-xs border-destructive/30 text-destructive bg-transparent hover:bg-destructive/10"
              >
                Encerrar RAID
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Battle log overlay */}
      <AnimatePresence>
        {showLog && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 20 }}
            className="absolute bottom-0 left-0 right-0 z-30 rounded-t-2xl"
            style={{ backgroundColor: "#0c1220", borderTop: "1px solid rgba(255,255,255,0.1)", maxHeight: "60%" }}
          >
            <div className="flex items-center justify-between p-3 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
              <span className="font-pixel text-[10px] tracking-wider" style={{ color: "rgba(255,255,255,0.5)" }}>
                BATTLE LOG
              </span>
              <button onClick={() => setShowLog(false)} className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                Fechar
              </button>
            </div>
            <ScrollArea className="h-60 px-3 py-2">
              {battleLog.map((entry) => (
                <div key={entry.id} className="py-1.5 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                  <p className="text-xs text-foreground">
                    {entry.action_data?.message as string || `${entry.player_name}: ${entry.action_type}`}
                  </p>
                  <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                    Turno {entry.turn_number}
                  </p>
                </div>
              ))}
              {battleLog.length === 0 && (
                <p className="text-xs text-center py-4" style={{ color: "rgba(255,255,255,0.2)" }}>
                  Nenhuma acao ainda
                </p>
              )}
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Master damage dialog */}
      <Dialog open={showMasterDamageDialog} onOpenChange={setShowMasterDamageDialog}>
        <DialogContent className="bg-card border-border text-foreground max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <Target className="w-5 h-5" style={{ color: "#EF4444" }} />
              Atacar Treinador
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">Selecione o alvo:</p>
            <div className="grid grid-cols-2 gap-2">
              {trainers.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTargetId(t.id)}
                  className="p-2 rounded-lg text-left transition-all"
                  style={{
                    backgroundColor: selectedTargetId === t.id ? "rgba(59, 130, 246, 0.15)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${selectedTargetId === t.id ? "rgba(59, 130, 246, 0.4)" : "rgba(255,255,255,0.1)"}`,
                  }}
                >
                  <p className="text-xs font-bold text-foreground">{t.player_name}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Shield className="w-3 h-3" style={{ color: "#3B82F6" }} />
                    <span className="text-[10px] text-muted-foreground">Treinador</span>
                  </div>
                </button>
              ))}
            </div>

            <Input
              type="number"
              placeholder="Dano causado"
              value={damageInput}
              onChange={(e) => setDamageInput(e.target.value)}
              className="bg-secondary border-border text-foreground text-lg font-mono text-center"
            />

            <div className="flex gap-2">
              <Button
                onClick={handleMasterAttack}
                disabled={!selectedTargetId || !damageInput || isLoading}
                className="flex-1"
                style={{ backgroundColor: "#EF4444", color: "#ffffff" }}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Aplicar Dano"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowMasterDamageDialog(false);
                  setDamageInput("");
                  setSelectedTargetId(null);
                }}
                className="border-border text-foreground bg-transparent hover:bg-secondary"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {error && (
        <div className="absolute bottom-16 left-4 right-4 p-2 rounded-lg text-center text-xs" style={{ backgroundColor: "rgba(239, 68, 68, 0.15)", color: "#EF4444" }}>
          {error}
        </div>
      )}
    </div>
  );
}

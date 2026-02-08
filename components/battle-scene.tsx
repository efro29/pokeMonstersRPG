"use client";

import { useState, useCallback } from "react";
import { useGameStore } from "@/lib/game-store";
import {
  getSpriteUrl,
  getBattleSpriteUrl,
  getMove,
  TYPE_COLORS,
  BAG_ITEMS,
  getHitResultLabel,
  getHitResultColor,
} from "@/lib/pokemon-data";
import type { PokemonType, HitResult } from "@/lib/pokemon-data";
import { D20Dice } from "./d20-dice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import {
  Swords,
  ArrowLeft,
  Backpack,
  CircleDot,
  Heart,
  Shield,
  Zap,
  ChevronLeft,
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
} from "@/lib/sounds";

export function BattleScene() {
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
  } = useGameStore();

  const attrs = trainer.attributes || { combate: 0, afinidade: 0, sorte: 0, furtividade: 0, percepcao: 0, carisma: 0 };
  const combateBonus = Math.floor(attrs.combate / 2);
  const critExpansion = Math.floor(attrs.sorte / 2);
  const critThreshold = Math.max(15, 20 - critExpansion);

  const [isRolling, setIsRolling] = useState(false);
  const [showDamageInput, setShowDamageInput] = useState(false);
  const [damageInput, setDamageInput] = useState("");
  const [showBagDialog, setShowBagDialog] = useState(false);
  const [showPokeballAnim, setShowPokeballAnim] = useState(false);

  const handleDiceResult = useCallback(
    (roll: number) => {
      setIsRolling(false);
      resolveDiceRoll(roll);
      // Play sound based on result after resolving
      setTimeout(() => {
        const state = useGameStore.getState();
        const hr = state.battle.hitResult;
        if (hr === "critical-hit") playCriticalHit();
        else if (hr === "strong-hit" || hr === "hit") playAttackHit();
        else if (hr === "miss") playMiss();
        else if (hr === "critical-miss") playCriticalMiss();
      }, 50);
    },
    [resolveDiceRoll]
  );

  const handleAttackSelect = (moveId: string) => {
    selectMove(moveId);
    setIsRolling(true);
    playAttack();
    playDiceRoll();
  };

  const handleApplyDamage = () => {
    const dmg = parseInt(damageInput);
    if (Number.isNaN(dmg) || dmg <= 0) return;
    applyOpponentDamage(dmg);
    playDamageReceived();
    setDamageInput("");
    setShowDamageInput(false);
  };

  const handlePokeball = () => {
    setShowPokeballAnim(true);
    addBattleLog("Lancou uma Pokebola!");
    playPokeball();
    setTimeout(() => {
      setShowPokeballAnim(false);
      setBattlePhase("menu");
    }, 2000);
  };

  const selectedMove = battle.selectedMoveId
    ? getMove(battle.selectedMoveId)
    : null;

  const pokemon = team.find((p) => p.uid === battle.activePokemonUid);
  const hpPercent = pokemon ? (pokemon.currentHp / pokemon.maxHp) * 100 : 0;
  const hpColor = hpPercent > 50 ? "#22C55E" : hpPercent > 25 ? "#F59E0B" : "#EF4444";
  const isFainted = pokemon ? pokemon.currentHp <= 0 : true;

  const handleUseBagItem = (bagItemId: string) => {
    const def = BAG_ITEMS.find((d) => d.id === bagItemId);
    if (def && pokemon) {
      useBagItem(bagItemId, pokemon.uid);
      addBattleLog(`Usou ${def.name}!`);
      playHeal();
    }
    setShowBagDialog(false);
    setBattlePhase("menu");
  };

  if (!pokemon) return null;

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Battle header */}
      <div className="flex items-center gap-3 p-3 border-b border-border bg-card">
        <Button
          size="sm"
          variant="ghost"
          onClick={endBattle}
          className="text-foreground hover:bg-secondary"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <Swords className="w-5 h-5 text-primary" />
        <span className="font-semibold text-foreground">Batalha</span>
      </div>

      {/* Pokemon display area - Battle arena */}
      <div className="relative flex flex-col items-center px-4 gap-2">
        {/* Arena background */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            background: "linear-gradient(180deg, #1a2744 0%, #243b5e 40%, #2d5a3d 70%, #1a3a28 100%)",
          }}
        >
          {/* Arena floor ellipse */}
          <div
            className="absolute bottom-[18%] left-1/2 -translate-x-1/2"
            style={{
              width: "85%",
              height: "40px",
              borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(255,255,255,0.08) 0%, transparent 70%)",
            }}
          />
        </div>

        {/* Pokemon sprite */}
        <motion.div
          animate={
            isFainted
              ? { opacity: 0.3, y: 20 }
              : { opacity: 1, y: 0 }
          }
          className="relative z-10 pt-3 pb-1"
        >
          <img
            src={getBattleSpriteUrl(pokemon.speciesId)}
            alt={pokemon.name}
            width={220}
            height={220}
            className="drop-shadow-[0_4px_24px_rgba(255,255,255,0.15)]"
            style={{ imageRendering: "auto", minHeight: 180 }}
            crossOrigin="anonymous"
            onError={(e) => {
              (e.target as HTMLImageElement).src = getSpriteUrl(pokemon.speciesId);
            }}
          />
          {isFainted && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-destructive font-bold text-xl bg-background/80 px-3 py-1.5 rounded-lg">
                KO!
              </span>
            </div>
          )}
        </motion.div>

        {/* Name + HP overlay on the arena */}
        <div className="relative z-10 w-full max-w-xs -mt-1 pb-3">
          <div className="bg-card/90 backdrop-blur-sm rounded-xl border border-border p-3">
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="text-base font-bold text-foreground">{pokemon.name}</h3>
              <span className="text-[10px] text-muted-foreground font-mono">
                Lv.{pokemon.level}
              </span>
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
              <span className="text-[10px] font-mono text-muted-foreground w-16 text-right">
                {pokemon.currentHp}/{pokemon.maxHp}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Battle content area */}
      <div className="flex-1 px-4 pb-4 flex flex-col">
        <AnimatePresence mode="wait">
          {/* Main menu */}
          {battle.phase === "menu" && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-2 gap-3 mt-auto"
            >
              <Button
                onClick={() => setBattlePhase("attack-select")}
                disabled={isFainted}
                className="h-16 flex flex-col gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Swords className="w-6 h-6" />
                <span className="text-sm font-bold">Atacar</span>
              </Button>
              <Button
                onClick={() => { playFlee(); endBattle(); }}
                variant="outline"
                className="h-16 flex flex-col gap-1 border-border text-foreground bg-transparent hover:bg-secondary"
              >
                <ArrowLeft className="w-6 h-6" />
                <span className="text-sm font-bold">Fugir</span>
              </Button>
              <Button
                onClick={() => setShowBagDialog(true)}
                variant="outline"
                className="h-16 flex flex-col gap-1 border-border text-foreground bg-transparent hover:bg-secondary"
              >
                <Backpack className="w-6 h-6" />
                <span className="text-sm font-bold">Bolsa</span>
              </Button>
              <Button
                onClick={handlePokeball}
                variant="outline"
                className="h-16 flex flex-col gap-1 border-border text-foreground bg-transparent hover:bg-secondary"
              >
                <CircleDot className="w-6 h-6" />
                <span className="text-sm font-bold">Pokebola</span>
              </Button>
            </motion.div>
          )}

          {/* Attack selection */}
          {battle.phase === "attack-select" && (
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
                {pokemon.moves.map((m) => {
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
                        backgroundColor: noPP
                          ? undefined
                          : `${TYPE_COLORS[moveDef.type as PokemonType]}CC`,
                        color: noPP ? undefined : "#fff",
                        border: "none",
                      }}
                    >
                      <span className="text-sm font-bold">{moveDef.name}</span>
                      <div className="flex items-center gap-2 text-[10px] opacity-90">
                        {moveDef.power > 0 && <span>PWR {moveDef.power}</span>}
                        <span>
                          PP {m.currentPP}/{m.maxPP}
                        </span>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Dice rolling */}
          {battle.phase === "rolling" && (
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
                    {pokemon.name} usou
                  </span>
                  <h4 className="text-lg font-bold text-foreground">
                    {selectedMove.name}!
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    Precisa rolar D20 {">"}= {selectedMove.accuracy} para acertar
                  </span>
                  {(combateBonus > 0 || critExpansion > 0) && (
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-1.5">
                      {combateBonus > 0 && (
                        <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                          Combate +{combateBonus}
                        </span>
                      )}
                      {critExpansion > 0 && (
                        <span className="text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                          Crit {critThreshold}+
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
              <D20Dice onResult={handleDiceResult} rolling={isRolling} />
            </motion.div>
          )}

          {/* Result */}
          {battle.phase === "result" && (
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
                className="w-24 h-24 rounded-full flex flex-col items-center justify-center"
                style={{
                  backgroundColor: `${getHitResultColor(battle.hitResult as HitResult)}22`,
                  border: `3px solid ${getHitResultColor(battle.hitResult as HitResult)}`,
                }}
              >
                <span
                  className="text-3xl font-bold font-mono"
                  style={{
                    color: getHitResultColor(battle.hitResult as HitResult),
                  }}
                >
                  {battle.diceRoll}
                </span>
                {combateBonus > 0 && (
                  <span className="text-[10px] font-mono text-primary">
                    +{combateBonus} = {(battle.diceRoll || 0) + combateBonus}
                  </span>
                )}
              </motion.div>

              <motion.h3
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold"
                style={{
                  color: getHitResultColor(battle.hitResult as HitResult),
                }}
              >
                {getHitResultLabel(battle.hitResult as HitResult)}
              </motion.h3>

              {battle.damageDealt !== null && battle.damageDealt > 0 && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-2"
                >
                  <Zap className="w-5 h-5 text-accent" />
                  <span className="text-xl font-bold text-accent">
                    {battle.damageDealt} de dano!
                  </span>
                </motion.div>
              )}

              <div className="flex gap-2 mt-4 w-full">
                <Button
                  onClick={() => {
                    addBattleLog(
                      `${pokemon.name} usou ${selectedMove?.name}: rolou ${battle.diceRoll} - ${getHitResultLabel(battle.hitResult as HitResult)} (${battle.damageDealt} dano)`
                    );
                    setBattlePhase("menu");
                  }}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Continuar
                </Button>
                <Button
                  onClick={() => setShowDamageInput(true)}
                  variant="outline"
                  className="flex-1 border-border text-foreground bg-transparent hover:bg-secondary"
                >
                  <Shield className="w-4 h-4 mr-1" />
                  Receber Dano
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pokeball animation overlay */}
        <AnimatePresence>
          {showPokeballAnim && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-background/80"
            >
              <motion.div
                initial={{ scale: 0, y: -100 }}
                animate={{
                  scale: [0, 1.2, 1, 1, 1],
                  y: [-100, 0, 0, -20, 0],
                  rotate: [0, 0, 0, -15, 15, 0],
                }}
                transition={{ duration: 1.5 }}
              >
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="48" fill="#EF4444" stroke="#1E293B" strokeWidth="3" />
                  <rect x="2" y="48" width="96" height="4" fill="#1E293B" />
                  <circle cx="50" cy="50" r="48" fill="none" stroke="#1E293B" strokeWidth="3" />
                  <path d="M 2 50 A 48 48 0 0 1 98 50" fill="#EF4444" />
                  <path d="M 2 50 A 48 48 0 0 0 98 50" fill="#F1F5F9" />
                  <circle cx="50" cy="50" r="16" fill="#F1F5F9" stroke="#1E293B" strokeWidth="3" />
                  <circle cx="50" cy="50" r="8" fill="#1E293B" />
                </svg>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Receive damage from opponent - always accessible from menu */}
        {battle.phase === "menu" && !showDamageInput && !isFainted && (
          <div className="mt-3">
            <Button
              onClick={() => setShowDamageInput(true)}
              variant="outline"
              className="w-full border-destructive/50 text-destructive bg-transparent hover:bg-destructive/10"
            >
              <Shield className="w-4 h-4 mr-2" />
              Receber Dano do Adversario
            </Button>
          </div>
        )}
      </div>

      {/* Damage input dialog */}
      <Dialog open={showDamageInput} onOpenChange={setShowDamageInput}>
        <DialogContent className="bg-card border-border text-foreground max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">Dano do Adversario</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mb-2">
            Informe o dano causado pelo adversario (use dados na vida real):
          </p>
          <Input
            type="number"
            placeholder="Ex: 25"
            value={damageInput}
            onChange={(e) => setDamageInput(e.target.value)}
            className="bg-secondary border-border text-foreground text-lg font-mono text-center"
            autoFocus
          />
          <div className="flex gap-2">
            <Button
              onClick={handleApplyDamage}
              className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Aplicar Dano
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowDamageInput(false);
                setDamageInput("");
              }}
              className="border-border text-foreground bg-transparent hover:bg-secondary"
            >
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bag in battle dialog */}
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
                      <span className="text-xs text-accent font-mono">
                        x{item.quantity}
                      </span>
                    </Button>
                  );
                })}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Battle log */}
      {battle.battleLog.length > 0 && (
        <div className="border-t border-border bg-card p-3">
          <ScrollArea className="max-h-24">
            <div className="flex flex-col gap-0.5">
              {battle.battleLog.map((log, i) => (
                <p key={i} className="text-[10px] text-muted-foreground font-mono">
                  {">"} {log}
                </p>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}

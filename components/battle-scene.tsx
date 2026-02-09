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
  computeAttributes,
  POKEMON_ATTRIBUTE_INFO,
} from "@/lib/pokemon-data";
import type { PokemonType, HitResult, PokemonBaseAttributes } from "@/lib/pokemon-data";
import type { PokemonAttributeKey } from "@/lib/game-store";
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
  Dices,
  Wind,
  CheckCircle,
  XCircle,
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
    selectAttributeTest,
    resolveAttributeTest,
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
  const [isTestRolling, setIsTestRolling] = useState(false);
  const [testDC, setTestDC] = useState("10");

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

  const handleSelectAttribute = (attr: PokemonAttributeKey) => {
    const dc = parseInt(testDC) || 10;
    selectAttributeTest(attr, dc);
    setIsTestRolling(true);
    playDiceRoll();
  };

  const handleTestDiceResult = useCallback(
    (roll: number) => {
      setIsTestRolling(false);
      resolveAttributeTest(roll);
    },
    [resolveAttributeTest]
  );

  // Compute pokemon attributes for display (using customAttributes if modified by faint/level)
  const pokemonAttrs = pokemon ? computeAttributes(pokemon.speciesId, pokemon.level, pokemon.customAttributes) : null;

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
            background: "white",
          }}
        >
          {/* Arena floor ellipse */}

        </div>

        {/* Pokemon sprite */}
        <motion.div
          animate={
            isFainted
              ? { opacity: 0.3, y: 20 }
              : { opacity: 1, y: 0 }
          }
          className="relative z-10 pt- pb-1"
        > <br /><br />
          <img
            src={getBattleSpriteUrl(pokemon.speciesId)}
            alt={pokemon.name}
            width={200}
            height={150}
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

        <div className="absolute top-2 w-full max-w-xs -mt-1 pb-3">
          <div className="bg-card/90 backdrop-blur-sm rounded-xl border border-border p-3">
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="text-base font-bold text-foreground">{pokemon.name}</h3>
              <div className="flex items-center gap-2">
                {pokemonAttrs && (
                  <span className="text-[9px] font-mono text-blue-400 bg-blue-400/10 rounded-full px-1.5 py-0.5">
                    DEF {pokemonAttrs.defesa}
                  </span>
                )}
                <span className="text-[10px] text-muted-foreground font-mono">
                  Lv.{pokemon.level}
                </span>
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
              <span className="text-[10px] font-mono text-muted-foreground w-16 text-right">
                {pokemon.currentHp}/{pokemon.maxHp}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Battle content area */}
      <div className="flex-1 px-4 pb-8 flex flex-col">
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
              <Button
                onClick={() => {
                  playButtonClick();
                  setBattlePhase("attribute-test-select");
                }}
                disabled={isFainted}
                variant="outline"
                className="col-span-2 h-14 flex flex-row gap-2 border-accent/50 text-accent bg-transparent hover:bg-accent/10"
              >
                <Dices className="w-6 h-6" />
                <span className="text-sm font-bold">Rolar um Teste</span>
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
          {/* Attribute test - select attribute */}
          {battle.phase === "attribute-test-select" && pokemonAttrs && (
            <motion.div
              key="attr-test-select"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="flex flex-col gap-3 mt-auto"
            >
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setBattlePhase("menu")}
                className="self-start text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Voltar
              </Button>

              <div className="text-center mb-1">
                <h4 className="text-base font-bold text-foreground">Rolar um Teste</h4>
                <p className="text-xs text-muted-foreground">
                  Escolha o atributo e a dificuldade (DC) para rolar D20
                </p>
              </div>

              {/* DC input */}
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-xs text-muted-foreground">DC:</span>
                <div className="flex items-center gap-1">
                  {[5, 10, 15, 20].map((dc) => (
                    <Button
                      key={dc}
                      size="sm"
                      variant={testDC === String(dc) ? "default" : "outline"}
                      onClick={() => setTestDC(String(dc))}
                      className={`h-8 w-10 text-xs ${testDC === String(dc) ? "bg-accent text-accent-foreground" : "border-border text-foreground bg-transparent hover:bg-secondary"}`}
                    >
                      {dc}
                    </Button>
                  ))}
                  <Input
                    type="number"
                    value={testDC}
                    onChange={(e) => setTestDC(e.target.value)}
                    className="w-16 h-8 text-xs text-center bg-secondary border-border text-foreground"
                    min={1}
                    max={30}
                  />
                </div>
              </div>

              {/* Attribute buttons */}
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(POKEMON_ATTRIBUTE_INFO) as PokemonAttributeKey[]).map((attr) => {
                  const info = POKEMON_ATTRIBUTE_INFO[attr];
                  const modKey = `${attr}Mod` as keyof typeof pokemonAttrs;
                  const mod = pokemonAttrs[modKey] as number;
                  const base = pokemonAttrs[attr];
                  return (
                    <Button
                      key={attr}
                      onClick={() => handleSelectAttribute(attr)}
                      className="h-auto py-3 px-3 flex flex-col items-start gap-1 text-left bg-secondary text-foreground hover:bg-accent/20 border border-border"
                      variant="outline"
                    >
                      <div className="flex items-center gap-2 w-full">
                        {attr === "velocidade" && <Zap className="w-4 h-4 text-yellow-400 shrink-0" />}
                        {attr === "felicidade" && <Heart className="w-4 h-4 text-pink-400 shrink-0" />}
                        {attr === "resistencia" && <Shield className="w-4 h-4 text-blue-400 shrink-0" />}
                        {attr === "acrobacia" && <Wind className="w-4 h-4 text-teal-400 shrink-0" />}
                        <span className="text-sm font-bold">{info.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <span>Base: {base}</span>
                        <span className="text-accent font-medium">+{mod} mod</span>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Attribute test - rolling */}
          {battle.phase === "attribute-test-rolling" && battle.selectedAttribute && pokemonAttrs && (
            <motion.div
              key="attr-test-rolling"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center gap-4 my-auto"
            >
              <div className="text-center mb-2">
                <span className="text-sm text-muted-foreground">
                  Teste de {POKEMON_ATTRIBUTE_INFO[battle.selectedAttribute].name}
                </span>
                <h4 className="text-lg font-bold text-foreground">
                  {pokemon.name} rola D20!
                </h4>
                <div className="flex items-center justify-center gap-3 mt-1">
                  <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                    DC {battle.attributeTestDC}
                  </span>
                  <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                    +{pokemonAttrs[`${battle.selectedAttribute}Mod` as keyof typeof pokemonAttrs]} mod
                  </span>
                </div>
              </div>
              <D20Dice onResult={handleTestDiceResult} rolling={isTestRolling} />
            </motion.div>
          )}

          {/* Attribute test - result */}
          {battle.phase === "attribute-test-result" && battle.attributeTestResult && (
            <motion.div
              key="attr-test-result"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 my-auto"
            >
              {(() => {
                const r = battle.attributeTestResult;
                const isSuccess = r.success;
                const color = r.criticalSuccess ? "#F59E0B" : r.criticalFail ? "#EF4444" : isSuccess ? "#22C55E" : "#9CA3AF";
                const label = r.criticalSuccess
                  ? "Sucesso Critico!"
                  : r.criticalFail
                    ? "Falha Critica!"
                    : isSuccess
                      ? "Sucesso!"
                      : "Falhou!";

                return (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 10 }}
                      className="w-24 h-24 rounded-full flex flex-col items-center justify-center"
                      style={{
                        backgroundColor: `${color}22`,
                        border: `3px solid ${color}`,
                      }}
                    >
                      <span className="text-3xl font-bold font-mono" style={{ color }}>
                        {r.roll}
                      </span>
                      {r.modifier > 0 && (
                        <span className="text-[10px] font-mono text-primary">
                          +{r.modifier} = {r.total}
                        </span>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-center gap-2"
                    >
                      {isSuccess ? (
                        <CheckCircle className="w-6 h-6" style={{ color }} />
                      ) : (
                        <XCircle className="w-6 h-6" style={{ color }} />
                      )}
                      <h3 className="text-2xl font-bold" style={{ color }}>
                        {label}
                      </h3>
                    </motion.div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-center"
                    >
                      <p className="text-sm text-muted-foreground">
                        Teste de {POKEMON_ATTRIBUTE_INFO[r.attribute].name} (DC {r.dc})
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Rolou {r.roll} + {r.modifier} mod = {r.total} vs DC {r.dc}
                      </p>
                    </motion.div>

                    <Button
                      onClick={() => {
                        addBattleLog(
                          `Teste de ${POKEMON_ATTRIBUTE_INFO[r.attribute].name}: rolou ${r.roll}+${r.modifier}=${r.total} vs DC ${r.dc} - ${label}`
                        );
                        setBattlePhase("menu");
                      }}
                      className="w-full mt-2 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Continuar
                    </Button>
                  </>
                );
              })()}
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
          {pokemonAttrs && (
            <div className="bg-secondary/50 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-foreground">Defesa (AC)</span>
              </div>
              <span className="text-lg font-bold font-mono text-blue-400">{pokemonAttrs.defesa}</span>
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            Informe o dano bruto causado pelo adversario. A defesa do Pokemon reduzira o dano automaticamente.
          </p>
          {pokemonAttrs && damageInput && parseInt(damageInput) > 0 && (
            <div className="bg-destructive/10 rounded-lg p-2.5 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Dano bruto:</span>
                <span className="font-mono text-foreground">{damageInput}</span>
              </div>
              <div className="flex justify-between">
                <span>Reducao da defesa:</span>
                <span className="font-mono text-blue-400">-{Math.floor(pokemonAttrs.defesa / 3)}</span>
              </div>
              <div className="flex justify-between border-t border-border/50 mt-1 pt-1">
                <span className="font-medium text-foreground">Dano final:</span>
                <span className="font-mono font-bold text-destructive">
                  {Math.max(1, parseInt(damageInput) - Math.floor(pokemonAttrs.defesa / 3))}
                </span>
              </div>
            </div>
          )}
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

    </div>
  );
}

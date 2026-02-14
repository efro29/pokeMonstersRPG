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
  MOVE_RANGE_INFO,
} from "@/lib/pokemon-data";
import type { PokemonType, HitResult, PokemonBaseAttributes, MoveRange, DamageBreakdown } from "@/lib/pokemon-data";
import type { PokemonAttributeKey } from "@/lib/game-store";
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
import { BattleCards } from "./battle-cards";
import { BattleParticles } from "./battle-particles";
import { kantoPokemonSizes } from "@/lib/kantoPokemonSizes";



type Props = {
  number: number;
};


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
    switchBattlePokemon,
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
  const [isSwitching, setIsSwitching] = useState(false);
  const ARENAS = [
  "campo"
];

const getRandomArena = () => {
  const randomIndex = Math.floor(Math.random() * ARENAS.length);
  return ARENAS[randomIndex];
};

  const handleSwitchPokemon = (uid: string) => {
    if (uid === battle.activePokemonUid) return;
    const targetPokemon = team.find((p) => p.uid === uid);
    if (!targetPokemon || targetPokemon.currentHp <= 0) return;
    setIsSwitching(true);
    playPokeball();
    addBattleLog(`Trocou para ${targetPokemon.name}!`);
    setTimeout(() => {
      switchBattlePokemon(uid);
      setTimeout(() => {
        setIsSwitching(false);
      }, 300);
    }, 400);
  };

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
const [arena] = useState(getRandomArena());
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
  const size = kantoPokemonSizes[pokemon?.speciesId] ?? { width: 80, height: 80 };
  if (!pokemon) return null;

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Battle header */}
      <div  className="flex flex-center  border-border bg-card ">
        <Button
          onClick={endBattle}
          variant="ghost"
          className="self-start  hover:text-foreground"
        >   <ChevronLeft className="w-5 h-5" />
          <Swords className="w-5 h-5 text-primary" />

          <span className="font-semibold text-foreground">Batalha</span>
        </Button>


     

      </div>
        <div style={{paddingBottom:10}}></div>
        
      <div  className=" relative flex flex-col items-center  ">

        <motion.div
          animate={
            isFainted
              ? { opacity: 0.3, y: 20 }
              : { opacity: 1, y: 0 }
          }
         
          className="absolute z-1"
        > 
                    
                  <div className="relative"> 

                  {/* Imagem 1: O Campo (Fundo) */}
                  <img
                  src={`/images/arenas/${arena}.gif`} 
                  alt="Campo"
                  loading="eager"
                  decoding="sync"
                  fetchPriority="high"
                  style={{ 
    
                  display: 'block', 
                  imageRendering: "pixelated", 
                  width: '100%',
                   height: '270px',   // 👈 define a altura
                 objectFit: 'fill', // 👈 força esticar
                  maxWidth: 'none',
                  minHeight: 80, 
                  minWidth: 80, 
                
                  }}
                  crossOrigin="anonymous"
                  />

                  {/* SOMBRA: Fica entre o campo e o personagem */}
                  <div 
                  className="absolute z-0" 
                  style={{
                  bottom: '12%',            // Mesma posição da base do Pokémon
                  left: '50%',              // Centralizado
                  transform: 'translateX(-50%)',
                  width: '90px',            // Largura da sombra
                  height: '30px',           // Altura da sombra (achatada)
                  background: 'rgba(0, 0, 0, 0.35)', // Cor preta com transparência
                  borderRadius: '50%',      // Formato oval
                  filter: 'blur(4px)',      // Suaviza as bordas
                  pointerEvents: 'none'
                  }}
                  />

                  {/* Imagem 2: O Personagem + Particulas */}
                  {(() => {
                    const effectType = battle.pokemonAnimationState?.effectType ?? "none";
                    const isAnim = battle.pokemonAnimationState?.isAnimating ?? false;
                    const animProps = getPokemonAnimationVariants(effectType);
                    return (
                      <div
                        className="absolute z-10 flex justify-center"
                        style={{
                          bottom: '15%',
                          left: 0,
                          right: 0,
                          pointerEvents: "none",
                        }}
                      >
                        {/* Particulas ao redor do Pokemon */}
                        <BattleParticles effectType={effectType} isAnimating={isAnim} />
                        
                        <motion.img
                          src={getBattleSpriteUrl(pokemon.speciesId)}
                          alt={pokemon.name}
                          width={size.width}
                          height={size.height}
                          style={{
                            imageRendering: "auto",
                            minHeight: 80,
                            minWidth: 80,
                          }}
                          crossOrigin="anonymous"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = getSpriteUrl(pokemon.speciesId);
                          }}
                          initial={animProps.initial}
                          animate={animProps.animate}
                          transition={animProps.transition}
                          key={effectType === "none" ? "idle" : `anim-${Date.now()}`}
                        />
                      </div>
                    );
                  })()}
                  </div>

          {isFainted && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-destructive font-bold text-xl bg-background/80 px-3 py-1.5 rounded-lg">
                KO!
              </span>
            </div>
          )}
        </motion.div>
              {/* Card field - always visible below pokemon */}
               {battle.phase === "attribute-test-select" && pokemonAttrs || 
               battle.phase === "attribute-test-rolling" && battle.selectedAttribute && pokemonAttrs ||
               battle.phase === "attribute-test-result" && battle.attributeTestResult ||
               battle.phase === "result" ||
               battle.phase === "attack-select" ||
               battle.phase === "rolling"
               ? '':

               
    <div style={{position:'absolute',top:350,}} className="top-100 px-3 py-2  bg-blue/30">
          <div className="flex items-center gap-3 mb-1 w-full ">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/50"></div>
            <span style={{color:'silver'}} className=" text-[10px] font-bold uppercase tracking-widest drop-shadow-md">
               Cartas
            </span>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/50"></div>
          </div>
        <BattleCards />
      </div>
      

               }
{/* Container Principal: Absolute no topo, largura total e Flex Coluna */}
<div 
  style={{ position: 'absolute', top: 280 }} 
  className="w-full flex flex-col items-center z-20"
>
  
    {/* Título: My Team com linhas laterais */}
 

        {/* Team pokeball strip */}
          {battle.phase === "attribute-test-select" && pokemonAttrs || 
               battle.phase === "attribute-test-rolling" && battle.selectedAttribute && pokemonAttrs ||
               battle.phase === "attribute-test-result" && battle.attributeTestResult ||
               battle.phase === "result" ||
        
               battle.phase === "rolling"
               ? '': <>
                        <div className="flex items-center gap-3 mb-1 w-full px-10">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/50"></div>
            <span style={{color:'silver'}} className=" text-[10px] font-bold uppercase tracking-widest drop-shadow-md">
               Equipe
            </span>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/50"></div>
          </div>
        {team.length > 1 && (
          <div 
            style={{ backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '12px' }} 
            className="backdrop-blur-md flex flex-row items-center gap-3  border border-white/10"
          >
            {team.map((p) => {
              const isActive = p.uid === battle.activePokemonUid;
              const isFaintedMember = p.currentHp <= 0;
              
              return (
                <motion.button
                  key={p.uid}
                  onClick={() => handleSwitchPokemon(p.uid)}
                  disabled={isActive || isFaintedMember || isSwitching}
                  whileTap={!isActive && !isFaintedMember ? { scale: 0.9 } : undefined}
                  className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all ${
                    isActive
                      ? "ring-2 ring-green-400 bg-green-400/20 shadow-[0_0_10px_rgba(74,222,128,0.5)]"
                      : isFaintedMember ? "opacity-30 grayscale cursor-not-allowed"
                      : "opacity-80 hover:opacity-100 hover:scale-110 cursor-pointer"
                  }`}
                >
                  {/* Pokeball background */}
                  <img
                    src={`/images/pokebola.png`}
                    className="absolute inset-0 w-full h-full object-contain p-1"
                    alt="pokebola"
                    loading="eager"
                    decoding="sync"
                  />

                  {/* Pokemon mini sprite */}
                  <img
                    src={getSpriteUrl(p.speciesId)}
                    alt={p.name}
                    width={38}
                    height={38}
                    className="relative z-10 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
                    style={{
                      imageRendering: "pixelated",
                      filter: isFaintedMember ? "grayscale(1)" : undefined,
                    }}
                    crossOrigin="anonymous"
                  />
                </motion.button>
              );
            })}
          </div>
        )}  </>}
      </div>

        {/* Name + HP overlay on the arena */}
        <div  className="absolute  left-0 p-2  w-full">

          <div style={{backgroundColor:'rgb(0,0,0,0.7)'}} className="backdrop-blur-sm rounded-xl bg-black-100 p-3">
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="text-base font-bold text-foreground"><span className="text-blue-400">#{pokemon.speciesId}</span> {pokemon.name} </h3>
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



        {/* Switch transition overlay */}
        <AnimatePresence>
          {isSwitching && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 z-30 flex items-center justify-center"
              style={{ background: "rgba(15, 23, 41, 0.85)", top: 230 }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: "spring", damping: 12 }}
              >
                <svg width="64" height="64" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="48" fill="#EF4444" stroke="#F1F5F9" strokeWidth="3" />
                  <rect x="2" y="48" width="96" height="4" fill="#1E293B" />
                  <path d="M 2 50 A 48 48 0 0 0 98 50" fill="#F1F5F9" />
                  <circle cx="50" cy="50" r="16" fill="#F1F5F9" stroke="#1E293B" strokeWidth="3" />
                  <circle cx="50" cy="50" r="8" fill="#0f0f0f" />
                </svg>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
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
              className="grid grid-cols-4 gap-3 mt-auto"
            >
              <Button
                onClick={() => setBattlePhase("attack-select")}
                disabled={isFainted}
                className="h-16 flex flex-col gap-1 bg-orange-500 text-primary-foreground hover:bg-primary/90"
              >
                <Swords className="w-30 h-10" />
                <span className="text-[7px] font-bold">Atacar</span>
              </Button>

              <Button
                onClick={() => setShowBagDialog(true)}
                variant="outline"
                className="h-16 flex flex-col gap-1 border-border text-foreground bg-green-500 hover:bg-secondary"
              >
                <Backpack className="w-6 h-6" />
                <span className="text-[7px] font-bold">Bolsa</span>
              </Button>

              <Button
                onClick={() => {
                  playButtonClick();
                  setBattlePhase("attribute-test-select");
                }}
                disabled={isFainted}
                variant="outline"
                className="h-16 flex flex-col gap-1 border-border text-foreground bg-blue-500 hover:bg-secondary"
              >
                <Dices className="w-6 h-6" />
                <span className="text-[7px] font-bold">Teste</span>
              </Button>

              {/* Receive damage from opponent */}
              {battle.phase === "menu" && !showDamageInput && !isFainted && (
                <Button
                  onClick={() => setShowDamageInput(true)}
                  variant="outline"
                  className="h-16 flex flex-col gap-1 border-border text-foreground bg-red-500 hover:bg-secondary"
                >
                  <Shield className="w-7 h-6" />
                  <span className="text-[7px] font-bold">Dano</span>
                </Button>
              )}
            </motion.div>
          )}

          {/* Attack selection */}
          {battle.phase === "attack-select" && (
            <motion.div
              key="attacks"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
                    style={{ backgroundColor: 'rgb(0,0,0,0.3)' }}
              className="p-3 rounded-sm flex flex-col gap-3 mt-auto z-10 h-[30vh] "
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
                      className="h-[70px] py-2 px-3 flex flex-col items-start gap-0.5 text-left"
                      style={{
                        backgroundColor: noPP
                          ? undefined
                          : `${TYPE_COLORS[moveDef.type as PokemonType]}CC`,
                        color: noPP ? undefined : "#fff",
                        border: "none",
                      }}
                    >
                      <span className="text-sm font-bold">{moveDef.name}</span>
                      <div className="flex items-center gap-2 text-[10px] opacity-90 flex-wrap">
                        {moveDef.damage_dice && <span>{moveDef.damage_dice}</span>}
                        {moveDef.damage_type !== "status" && <span className="opacity-75">{moveDef.damage_type === "physical" ? "FIS" : "ESP"}</span>}
                        {moveDef.damage_type === "status" && <span className="opacity-75">STA</span>}
                        <span>
                          PP {m.currentPP}/{m.maxPP}
                        </span>
                      </div>
                      <span className="text-[9px] opacity-75 mt-0.5">
                        {MOVE_RANGE_INFO[moveDef.range as MoveRange]?.labelPt ?? moveDef.range}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </motion.div>
          )}

   
          {/* Result */}
      
          {/* Attribute test - select attribute */}
          {battle.phase === "attribute-test-select" && pokemonAttrs && (

            <motion.div
              key="attr-test-select"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              style={{ backgroundColor: 'rgb(0,0,0,0.3)' }}
              className="p-3 rounded-sm flex flex-col gap-3 mt-auto z-10 "
            >
               <Button
                size="sm"
                variant="ghost"
                         onClick={() => setBattlePhase("menu")}
                className="self-start text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Voltar
              </Button>
              

              {/* DC input */}
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-xs text-muted-foreground">Dificuldade:</span>
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
                  {/* <Input
                    type="number"
                    value={testDC}
                    onChange={(e) => setTestDC(e.target.value)}
                    className="w-16 h-8 text-xs text-center bg-secondary border-border text-foreground"
                    min={1}
                    max={30}
                  /> */}
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
                      style={{zIndex:200, backgroundColor:'rgb(0,0,0,0.9)',padding:10,borderRadius:8}}
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
              style={{zIndex:200, backgroundColor:'rgb(0,0,0,0.9)',padding:10,borderRadius:8}}
              className="flex flex-col items-center gap-4 my-auto "
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
              className="fixed inset-0 z- flex items-center justify-center bg-background/80"
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
       {/* Dice Result */}
      </div>
          {battle.phase === "result" && (
            <motion.div
                onClick={() => {
                const bd = battle.damageBreakdown;
                const logMsg = bd && !bd.isStatus
                  ? `${pokemon.name} usou ${selectedMove?.name}: D20=${battle.diceRoll} - ${getHitResultLabel(battle.hitResult as HitResult)} | ${bd.formula} => ${bd.rawTotal} dano`
                  : `${pokemon.name} usou ${selectedMove?.name}: rolou ${battle.diceRoll} - ${getHitResultLabel(battle.hitResult as HitResult)} (${battle.damageDealt} dano)`;
                addBattleLog(logMsg);
                setBattlePhase("menu");
              }}
              style={{  backgroundColor: 'rgb(0,0,0,0.3)', zIndex: 10,padding:10,borderRadius:8 }}
              key="result"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
                   
              className="  flex flex-col items-center gap-1 "
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 10 }}
                className="w-24 h-24 rounded-full flex flex-col items-center justify-center"
                style={{
                  backgroundColor: `rgb(0,0,0,0.9)`,
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

              {/* Dice Damage Breakdown */}
              {battle.damageBreakdown && !battle.damageBreakdown.isStatus && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="w-full max-w-xs bg-card/80 backdrop-blur-sm rounded-lg border border-border p-3 text-xs"
                >
                  {/* Dice rolls */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-muted-foreground font-mono">Dados:</span>
                    <span className="font-bold text-foreground">{battle.damageBreakdown.diceString}</span>
                    <span className="font-mono text-accent">
                      [{battle.damageBreakdown.diceRolls.join(" + ")}] = {battle.damageBreakdown.diceTotal}
                    </span>
                  </div>
                  {/* Attribute bonus */}
                  {battle.damageBreakdown.attrBonus > 0 && (
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-muted-foreground font-mono">Bonus:</span>
                      <span className="text-foreground">
                        +{battle.damageBreakdown.attrBonus} {battle.damageBreakdown.scalingAttr}
                      </span>
                    </div>
                  )}
                  {/* Hit multiplier */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-muted-foreground font-mono">Acerto:</span>
                    <span
                      className="font-bold"
                      style={{ color: getHitResultColor(battle.hitResult as HitResult) }}
                    >
                      {battle.damageBreakdown.hitMultiplierLabel}
                    </span>
                  </div>
                  {/* Total damage */}
                  <div className="flex items-center gap-2 pt-1.5 border-t border-border">
                    <Zap className="w-4 h-4 text-accent shrink-0" />
                    <span className="font-bold text-accent text-sm">
                      {battle.damageBreakdown.rawTotal > 0 ? `${battle.damageBreakdown.rawTotal} de dano!` : "Sem dano"}
                    </span>
                  </div>
                  {/* Formula */}
                  <div className="mt-1.5 text-[10px] text-muted-foreground font-mono break-all">
                    {battle.damageBreakdown.formula}
                  </div>
                </motion.div>
              )}

              {/* Status move fallback */}
              {battle.damageBreakdown?.isStatus && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm text-muted-foreground"
                >
                  Golpe de status - sem dano direto
                </motion.div>
              )}

              {/* Legacy fallback for when breakdown is null */}
              {!battle.damageBreakdown && battle.damageDealt !== null && battle.damageDealt > 0 && (
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


            </motion.div>
          )}
       {/* Dice rolling */}
          {battle.phase === "rolling" && (
            <motion.div
             style={{  backgroundColor: 'rgb(0,0,0,0.6)' , zIndex: 10,padding:10,borderRadius:8 }}
              key="rolling"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
       
            >
              {selectedMove && (
                <div className="text-center mb-2">
                  <p className="text-sm text-muted-foreground">
                    {pokemon.name} usou
                    <b className="text-white">
                      {selectedMove.name}!
                    </b>
                  </p>

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



    </div>
  );
}

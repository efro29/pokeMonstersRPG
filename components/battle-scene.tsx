"use client";

import { useState, useCallback } from "react";
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
  POKEMON_ATTRIBUTE_INFO,
  MOVE_RANGE_INFO,
} from "@/lib/pokemon-data";
import { PokemonType, HitResult, PokemonBaseAttributes, MoveRange, DamageBreakdown, getBaseAttributes, getPokemon } from "@/lib/pokemon-data";
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
  MapPin,
  RefreshCw,
  Trophy,
  Plus,
  Minus,
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
  playVictoryFanfare,
} from "@/lib/sounds";
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
    showBattleCards,
    spendPA,
    endTurn,
    moveBoardSquares,
    addXp,
  } = useGameStore();

  const attrs = trainer.attributes || { combate: 0, afinidade: 0, sorte: 0, furtividade: 0, percepcao: 0, carisma: 0 };
  const combateBonus = Math.floor(attrs.combate / 2);
  const critExpansion = Math.floor(attrs.sorte / 2);
  const critThreshold = Math.max(15, 20 - critExpansion);
  const [showParticles, setShowParticles] = useState(false);
  const [showParticlePok, setShowParticlesPok] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [showDamageInput, setShowDamageInput] = useState(false);
  const [damageInput, setDamageInput] = useState("");
  const [showBagDialog, setShowBagDialog] = useState(false);
  const [showPokeballAnim, setShowPokeballAnim] = useState(false);
  const [isTestRolling, setIsTestRolling] = useState(false);
  const [testDC, setTestDC] = useState("10");
  const [isSwitching, setIsSwitching] = useState(false);
  const [showDefeatMessage, setShowDefeatMessage] = useState(false);

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
    if (!spendPA("switchPokemon")) return;
    setShowParticlesPok(true);
    setTimeout(() => setShowParticlesPok(false), 1000);
    // playHeal();
    setIsSwitching(true);
    playSendPokemon();
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
    // Moves that consume energy cards are free (no PA cost)
    const moveDef = getMove(moveId);
    const usesCards = moveDef && showBattleCards && moveDef.energy_cost > 0;
    if (!usesCards) {
      if (!spendPA("attack")) return;
    }
    selectMove(moveId);
    setIsRolling(true);
    playAttack();
    playDiceRoll();
  };

  const handlePokemonTap = () => {
    // Mostra animação de sangue + som ANTES de abrir o popup
    setShowParticles(true);
    playDamageReceived();

    setTimeout(() => {
      setShowParticles(false);
      setShowDamageInput(true);
    }, 600);
  };

  const handleApplyDamage = () => {
    const dmg = parseInt(damageInput);
    if (Number.isNaN(dmg) || dmg <= 0) return;

    // Mostra animação de sangue ANTES de fechar o diálogo
    setShowParticles(true);
    playDamageReceived();
    
    // Aguarda a animação terminar antes de aplicar o dano e fechar
    setTimeout(() => {
      applyOpponentDamage(dmg);
      setShowParticles(false);
      setDamageInput("");
      setShowDamageInput(false);
    }, 500);
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
  const totalHp = team.reduce((sum, p) => sum + p.currentHp, 0);




  const handleUseBagItem = (bagItemId: string) => {
    if (!spendPA("item")) {
      setShowBagDialog(false);
      return;
    }
    const def = BAG_ITEMS.find((d) => d.id === bagItemId);
    if (def && pokemon) {
      useBagItem(bagItemId, pokemon.uid);
      addBattleLog(`Usou ${def.name}!`);
      playHeal();
    }
    setShowBagDialog(false);
    setBattlePhase("menu");
  };

  const [isWalking, setIsWalking] = useState(false);
  const [showVictoryDialog, setShowVictoryDialog] = useState(false);
  const [victoryXp, setVictoryXp] = useState("");

  const handleMoveSquares = () => {
    if (!moveBoardSquares()) return;
    playButtonClick();
    setIsWalking(true);
    setTimeout(() => setIsWalking(false), 1000);
  };
  const [arena] = useState(getRandomArena());
  const handleSelectAttribute = (attr: PokemonAttributeKey) => {
  if (!spendPA("attributeTest")) return;
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
  const habildade_especial = getBaseAttributes(pokemon?.speciesId).especial
  // Compute pokemon attributes for display (using customAttributes if modified by faint/level)
  const pokemonAttrs = pokemon ? computeAttributes(pokemon.speciesId, pokemon.level, pokemon.customAttributes) : null;
  const pokemonTypes = getPokemon(pokemon.speciesId)?.types
  const size = kantoPokemonSizes[pokemon?.speciesId] ?? { width: 80, height: 80 };
  if (!pokemon) return null;

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Battle top nav bar */}
      <nav className="flex items-center justify-between px-2 py-1.5 bg-card border-b border-border gap-1">
        {/* Left: Back + Turn */}
        <div className="flex items-center gap-1.5">
          <Button
            onClick={endBattle}
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-1 bg-secondary/50 rounded px-1.5 py-0.5">
            <RefreshCw className="w-3 h-3 text-muted-foreground" />
            <span className="text-[10px] font-bold text-muted-foreground">Turno: {battle.turnNumber}</span>
          </div>
        </div>

        {/* Center: PA orbs (clickable) */}
        <div className="flex items-center gap-0.5 bg-blue-500/10 rounded-sm">
    
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-4 p-0 min-w-0"
            onClick={() => {
              const { battle: b } = useGameStore.getState();
              if (b.pa > 0) {
                useGameStore.setState({ battle: { ...b, pa: b.pa - 1 } });
              }
            }}
          >
            {/* <Minus className="w-3 h-3 text-muted-foreground" /> */}
          </Button>
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
              className={`w-6 h-6 rounded-full border-[1.5px] cursor-pointer ${
                i < battle.pa
                  ? "bg-amber-400/30  shadow-[0_0_4px_rgba(251,191,36,0.5)]"
                  : "bg-transparent border-gray-600"
              }`}
              onClick={() => {
                const { battle: b } = useGameStore.getState();
                if (i < b.pa) {
                  // clicking a filled orb removes PA down to that level
                  useGameStore.setState({ battle: { ...b, pa: i } });
                } else {
                  // clicking an empty orb fills up to that level
                  useGameStore.setState({ battle: { ...b, pa: Math.min(i + 1, b.maxPa) } });
                }
              }}
            /> 
          ))}
    
        
        </div>

        {/* Right: Pass Turn + Victory */}
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            onClick={() => {
              playButtonClick();
              endTurn();
            }}
            className="h-7 px-2 text-[9px] font-bold bg-amber-500/90 hover:bg-amber-500 text-black gap-0.5"
          >
            <SkipForward className="w-3 h-3" />
     
          </Button>
          <Button
            size="sm"
            onClick={() => {
              playVictoryFanfare();
              setShowVictoryDialog(true);
              setVictoryXp("");
            }}
            className="h-7 px-2 text-[9px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white gap-0.5"
          >
            <Trophy className="w-3 h-3" />

          </Button>
        </div>
      </nav>
      <div style={{ paddingBottom: 4 }}></div>

      <div className=" relative flex flex-col items-center  ">
        {/* POKEMON SPRITES */}
        
        <motion.div
        style={{borderWidth:2,borderRadius:4,margin:5}}
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
                  className=" absolute z-10 flex justify-center"
                  style={{
                    bottom: '15%',
                    left: 0,
                    right: 0,
                    pointerEvents: "none",
                  }}
                >
                  {showParticles && (<BattleParticles effectType={'damage'} isAnimating={true} />)}
                  {showParticlePok && (<BattleParticles effectType={'changed'} isAnimating={true} />)}
                  <BattleParticles effectType={effectType} isAnimating={true} />
                  <motion.img
                    onClick={handlePokemonTap}
                    src={getBattleSpriteUrl(pokemon.speciesId)}
                    alt={pokemon.name}
                    width={size.width}
                    height={size.height}
                    style={{
                      imageRendering: "auto",
                      minHeight: 80,
                      minWidth: 80,
                      pointerEvents: "auto",
                      cursor: "pointer",
                    }}
                    crossOrigin="anonymous"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = getSpriteUrl(pokemon.speciesId);
                    }}
                    initial={animProps.initial}
                    animate={
                      isWalking
                        ? { x: [-0, -60, -60, 0], scaleX: [-1, -1, 1, 1] }
                        : animProps.animate
                    }
                    transition={
                      isWalking
                        ? { duration: 1, times: [0, 0.35, 0.65, 1], ease: "easeInOut" }
                        : animProps.transition
                    }
                    key={isWalking ? `walk-${Date.now()}` : (effectType === "none" ? "idle" : `anim-${Date.now()}`)}
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
          ? '' :


          <div style={{ position: 'absolute', top: 350, }} className="top-100 px-3 py-2  bg-blue/30">
            <div className="flex items-center gap-3 mb-1 w-full ">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/50"></div>
              <span style={{ color: 'silver' }} className=" text-[10px] font-bold uppercase tracking-widest drop-shadow-md">
                {showBattleCards && ('Cartas')}
              </span>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/50"></div>
            </div>
            {showBattleCards && (<BattleCards />)}
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
            ?    '' : <>
              <div className="flex items-center gap-3 mb-1 w-full px-10">

                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/50"></div>
                <span style={{ color: 'silver' }} className=" text-[10px] font-bold uppercase tracking-widest drop-shadow-md">
                  Equipe
                </span>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/50"></div>
              </div>
            
                <div
                  style={{ backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '12px' }}
                  className="backdrop-blur-md flex flex-row items-center justify-center gap-3 w-[94%]  border border-white/10"
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
                        className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all ${p.currentHp <= 0 ? 'opacity-30 grayscale' : isActive
                          ? " ring-blue-400 bg-green-400/20 shadow-[0_0_10px_rgba(74,222,128,0.5)]"
                          : p.currentHp <= 0
                            ? "opacity-30 grayscale cursor-not-allowed"
                            : "opacity-20 hover:opacity-100 hover:scale-110 cursor-pointer"
                          }`}
                      >
                        {/* Circulo de HP */}
                        <svg className="absolute w-full h-full" viewBox="0 0 40 40">
                          <circle
                            cx="20"
                            cy="20"
                            r="5"
                            stroke="#ddd"
                            strokeWidth="4"
                            fill="none"
                          />
                          <circle
                            cx="20"
                            cy="20"
                            r="18"
                            stroke={p.currentHp / p.maxHp > 0.5 ? "#22c55e" : p.currentHp / p.maxHp > 0.2 ? "#facc15" : "#ef4444"} // verde, amarelo, vermelho
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray={2 * Math.PI * 18}
                            strokeDashoffset={
                              2 * Math.PI * 18 * (1 - p.currentHp / p.maxHp)
                            }
                            strokeLinecap="round"
                            transform="rotate(-90 20 20)"
                          />
                        </svg>

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

                        {/* HP numérico */}
                        <div style={{ zIndex: 100, top: 33 }} className="absolute text-[8px] font-bold text-black">
                          {p.currentHp}/{p.maxHp}
                        </div>
                      </motion.button>



                    );

                  })}
                </div>
               </>}
        </div>

        {/* Name + HP overlay on the arena */}
        <div  className="absolute   p-4  w-full ">
          <div style={{ backgroundColor: 'rgb(0,0,0,0.6)' }} className=" rounded-xl  p-3">
            <div  className="flex items-center justify-between mb-1.5">
              <h3 className="text-[12px] font-bold text-foreground"><span className="text-blue-400">#{pokemon.speciesId}</span> {pokemon.name} </h3>
              <div className="flex items-center ">
                {pokemonTypes?.map((d) =>
                  <img key={d}
                    style={{ width: 30 }}
                    src={`/images/cardsTypes/${d}.png`}
                    alt={d}
                    className=" rounded-full"
                    loading="eager"
                    decoding="sync"
                  />
                )}
              </div>
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
              <span style={{ color: hpColor }} className="text-[10px] font-mono text-muted-foreground w-16 text-right">
                {Math.round(pokemon.currentHp)}/{pokemon.maxHp}
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
      <div className="flex-1 px-4 pb-9 flex flex-col">
        <AnimatePresence mode="wait">
          {/* Main menu */}
          {battle.phase === "menu" && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-2 mt-auto"
            >
              {/* Row 1: Main combat actions */}
              <div className="grid grid-cols-4 gap-1">

                <Button
                  onClick={() => setBattlePhase("attack-select")}
                  disabled={isFainted || battle.pa < PA_CONFIG.costs.attack}
                  className="h-16 flex flex-col gap-0.5 bg-orange-500 text-white hover:bg-orange-600 relative"
                >
                 <Swords className="w-40 h-55" />
                  <span className="text-[7px] font-bold">Atacar</span>
                  <span className="absolute top-0.5 right-1 text-[8px] font-mono font-bold text-orange-200">{PA_CONFIG.costs.attack}PA</span>
                </Button>

                <Button
                  onClick={() => setShowBagDialog(true)}
                  disabled={battle.pa < PA_CONFIG.costs.item}
                  variant="outline"
                  className="h-16 flex flex-col gap-0.5 border-border text-white bg-green-600 hover:bg-green-700 relative"
                >
                  <Backpack className="w-5 h-5" />
                  <span className="text-[7px] font-bold">Bolsa</span>
                  <span className="absolute top-0.5 right-1 text-[8px] font-mono font-bold text-green-200">{PA_CONFIG.costs.item}PA</span>
                </Button>

                <Button
                  onClick={() => {
                    playButtonClick();
                    setBattlePhase("attribute-test-select");
                  }}
                  disabled={isFainted || battle.pa < PA_CONFIG.costs.attributeTest}
                  variant="outline"
                  className="h-16 flex flex-col gap-0.5 border-border text-white bg-blue-600 hover:bg-blue-700 relative"
                >
                  <Dices className="w-5 h-5" />
                  <span className="text-[7px] font-bold">Teste</span>
                  <span className="absolute top-0.5 right-1 text-[8px] font-mono font-bold text-blue-200">{PA_CONFIG.costs.attributeTest}PA</span>
                </Button>

                 <Button
                  onClick={handleMoveSquares}
                  disabled={battle.pa < PA_CONFIG.costs.moveSquares}
                  variant="outline"
                    className="h-16 flex flex-col gap-0.5 border-border text-white bg-purple-600 hover:bg-blue-700 relative"
                >
                  <MapPin className="w-4 h-4" />
                  <span className="text-[9px] font-bold">Mover</span>
                  <span className="absolute top-0.5 right-1 text-[8px] font-mono font-bold text-white-200">{PA_CONFIG.costs.moveSquares}PA</span>
                </Button>

                {/* Receive damage from opponent - free action */}
                {/* {!showDamageInput && !isFainted && (
                  <Button
                    onClick={() => setShowDamageInput(true)}
                    variant="outline"
                    className="h-16 flex flex-col gap-0.5 border-border text-white bg-red-600 hover:bg-red-700 relative"
                  >
                    <Shield className="w-5 h-5" />
                    <span className="text-[7px] font-bold">Dano</span>
                    <span className="absolute top-0.5 right-1 text-[8px] font-mono font-bold text-red-200">0PA</span>
                  </Button>
                )} */}
              </div>



              {/* PA spend log this turn */}
              {/* {battle.paLog.length > 0 && (
                <div className="bg-black/30 rounded px-2 py-1 flex flex-wrap gap-1">
                  {battle.paLog.map((entry, i) => (
                    <span key={i} className="text-[8px] text-muted-foreground bg-white/5 px-1.5 py-0.5 rounded">
                      {entry}
                    </span>
                  ))}
                </div>
              )} */}
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
                {(() => {
                  const hasAmplificada = hasAuraAmplificada(battle.cardField);
                  return pokemon.moves.map((m) => {
                    const moveDef = getMove(m.moveId);
                    if (!moveDef) return null;
                    const noPP = m.currentPP <= 0;
                    // Energy cost check (only if cards are enabled)
                    const energyCost = moveDef.energy_cost;
                    const energyType = moveDef.energy_type;
                    const availableEnergy = energyCost > 0
                      ? countFieldCardsByElement(battle.cardField, energyType)
                      : 0;
                    const notEnoughEnergy = showBattleCards && energyCost > 0 && availableEnergy < energyCost;
                    // Aura Amplificada bypasses energy cost
                    const canUseAmplificada = notEnoughEnergy && hasAmplificada && energyCost > 0;
                    const isDisabled = noPP || (notEnoughEnergy && !canUseAmplificada);
                    const EnergyIcon = ENERGY_ICON_MAP[energyType] || Circle;
                    return (
                      <Button
                        key={m.moveId}
                        onClick={() => handleAttackSelect(m.moveId)}
                        disabled={isDisabled}
                        className="h-auto min-h-[70px] py-2 px-3 flex flex-col items-start gap-0.5 text-left relative"
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
                          {moveDef.damage_type !== "status" && <span className="opacity-75">{moveDef.damage_type === "physical" ? "FIS" : "ESP"}</span>}
                          {moveDef.damage_type === "status" && <span className="opacity-75">STA</span>}
                          <span>
                            PP {m.currentPP}/{m.maxPP}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 w-full justify-between">
                          <span className="text-[9px] opacity-75">
                            {MOVE_RANGE_INFO[moveDef.range as MoveRange]?.labelPt ?? moveDef.range}
                          </span>
                          {energyCost > 0 ? (
                            canUseAmplificada ? (
                              <div
                                className="flex items-center gap-0.5 text-[9px] font-bold rounded px-1 py-0.5"
                                style={{
                                  backgroundColor: "rgba(212,175,55,0.4)",
                                  color: "#FFD700",
                                }}
                              >
                                <Star className="w-3 h-3" />
                                <span>D20=20</span>
                              </div>
                            ) : (
                              <div
                                className="flex items-center gap-0.5 text-[9px] font-bold rounded px-1 py-0.5"
                                style={{
                                  backgroundColor: notEnoughEnergy ? "rgba(255,60,60,0.35)" : "rgba(255,255,255,0.2)",
                                  color: notEnoughEnergy ? "#ff9999" : "#fff",
                                }}
                              >
                                <EnergyIcon className="w-3 h-3" />
                                <span>{availableEnergy}/{energyCost}</span>
                              </div>
                            )
                          ) : (
                            <span className="text-[8px] opacity-50">Gratis</span>
                          )}
                        </div>
                      </Button>
                    );
                  });
                })()}
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
              style={{ backgroundColor: 'rgb(0,0,0,0.9)' }}
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
                {(Object.keys(POKEMON_ATTRIBUTE_INFO) as PokemonAttributeKey[]).filter((t => t !== 'especial')).map((attr) => {
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
              <div className="flex flex-col justify-center items-center gap-3">
                {(Object.keys(POKEMON_ATTRIBUTE_INFO) as PokemonAttributeKey[])
                  .filter((t => t === 'especial'))
                  .map((attr) => {

                    return (

                      <div
                        key={attr}
                        className="
                  p-[2px] rounded-xl
                  bg-gradient-to-r 
                  from-purple-500 
                  via-pink-500 
                  to-yellow-400
                  animate-gradient
                  shadow-lg shadow-purple-500/30
                  "
                      >
                        <Button
                          onClick={() => handleSelectAttribute(attr)}
                          variant="outline"
                          className="
                    w-64
                    h-auto py-4 px-4
                    flex flex-col items-center gap-2
                    text-center
                    rounded-xl
                    bg-background/90 backdrop-blur-md
                    border-0
                    hover:bg-background
                    transition-all duration-300
                    hover:scale-105
                    "
                        >
                          <div className="flex items-center gap-2 justify-center w-full">
                            {attr === "especial" && (
                              <Star className="w-5 h-5 text-yellow-400 animate-pulse" />
                            )}
                            <span className="text-base font-bold tracking-wide">
                              Habilidade Única
                            </span>
                          </div>

                          <div className="text-[10px] opacity-80">
                            {habildade_especial}
                          </div>
                        </Button>
                      </div>

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
              style={{ zIndex: 200, backgroundColor: 'rgb(0,0,0,0.9)', padding: 10, borderRadius: 8 }}
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
              style={{ zIndex: 200, backgroundColor: 'rgb(0,0,0,0.9)', padding: 10, borderRadius: 8 }}
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


                      <p style={{ padding: 10 }}>USE: {habildade_especial.replace("_", " ")}</p>


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
          style={{ backgroundColor: 'rgb(0,0,0,0.3)', zIndex: 10, padding: 10, borderRadius: 8 }}
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
          style={{ backgroundColor: 'rgb(0,0,0,0.6)', zIndex: 10, padding: 10, borderRadius: 8 }}
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
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="bg-card border-border text-foreground max-w-sm mx-auto">
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

      <AnimatePresence>
        {totalHp <= 0 && (
          <motion.div
            onClick={endBattle}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ cursor: 'pointer' }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/70"
          >
            <div className="text-center p-6 bg-red-600/90 text-white rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-2">{"Voc\u00ea foi derrotado!"}</h2>
              <p className="text-sm">{"Todos os seus Pok\u00e9mon desmaiaram."}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Victory dialog */}
      <Dialog open={showVictoryDialog} onOpenChange={setShowVictoryDialog}>
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="bg-card border-border text-foreground max-w-sm mx-auto overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center gap-2 text-foreground text-lg">
              <Trophy className="w-6 h-6 text-amber-400" />
              Vitoria!
            </DialogTitle>
          </DialogHeader>

          {/* Particle animation area */}
          <div className="relative h-40 flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-b from-amber-500/10 to-transparent">
            {/* Floating particles */}
            {showVictoryDialog && Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  background: ["#fbbf24", "#f59e0b", "#fcd34d", "#fff7ed", "#d97706"][i % 5],
                  left: `${10 + Math.random() * 80}%`,
                  bottom: 0,
                }}
                animate={{
                  y: [0, -(80 + Math.random() * 80)],
                  x: [0, (Math.random() - 0.5) * 40],
                  opacity: [0, 1, 1, 0],
                  scale: [0.5, 1.2, 0.8, 0],
                }}
                transition={{
                  duration: 2 + Math.random() * 1.5,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeOut",
                }}
              />
            ))}

            {/* Glowing ring behind pokemon */}
            {showVictoryDialog && (
              <motion.div
                className="absolute w-32 h-32 rounded-full border-2 border-amber-400/30"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            )}

            {/* Pokemon sprites side by side */}
            <div className="relative z-10 flex items-end justify-center gap-1">
              {team.map((p, idx) => (
                <motion.div
                  key={p.uid}
                  className="flex flex-col items-center"
                  initial={{ y: 40, opacity: 0, scale: 0.5 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 18,
                    delay: 0.15 * idx,
                  }}
                >
                  <motion.img
                    src={getSpriteUrl(p.speciesId)}
                    alt={p.name}
                    width={48}
                    height={48}
                    crossOrigin="anonymous"
                    style={{ imageRendering: "pixelated" }}
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: 0.2 * idx,
                      ease: "easeInOut",
                    }}
                  />
                  <span className="text-[8px] font-bold text-foreground mt-0.5 truncate max-w-[50px] text-center">
                    {p.name}
                  </span>
                  <span className="text-[7px] text-muted-foreground">Lv.{p.level}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Single XP input */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-muted-foreground text-center">
              XP ganho (igual para todos):
            </p>
          <Input
            type="number"
            placeholder="Ex: 0"
            value={victoryXp}
            onChange={(e) => setVictoryXp(e.target.value)}
            className="bg-secondary border-border text-foreground text-lg font-mono text-center"
          />
          </div>

          <div className="flex gap-2 mt-1">
            <Button
              onClick={() => {
                const val = parseInt(victoryXp || "0");
                if (val > 0) {
                  for (const p of team) {
                    addXp(p.uid, val);
                  }
                }
                setShowVictoryDialog(false);
                setVictoryXp("");
                endBattle();
              }}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
            >
              Confirmar XP
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowVictoryDialog(false);
                setVictoryXp("");
              }}
              className="border-border text-foreground bg-transparent hover:bg-secondary"
            >
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}

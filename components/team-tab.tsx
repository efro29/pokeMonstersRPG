"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGameStore } from "@/lib/game-store";
import { useModeStore } from "@/lib/mode-store";
import {
  getSpriteUrl,
  getMove,
  TYPE_COLORS,
  getPokemon,
  xpForLevel,
  canEvolveByLevel,
  canEvolveByStone,
  canEvolveByTrade,
  EVOLUTION_STONES,
  computeAttributes,
  POKEMON_ATTRIBUTE_INFO,
} from "@/lib/pokemon-data";
import { PokemonType, PokemonBaseAttributes,getBaseAttributes } from "@/lib/pokemon-data";
import { SkillTreeModal } from "@/components/skill-tree-modal";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Heart,
  Swords,
  Trash2,
  Plus,
  X,
  Star,
  ArrowUp,
  Sparkles,
  Gem,
  RefreshCw,
  Zap,
  Shield,
  Wind,
  ArrowRightLeft,
  Archive,
  Trophy,
  Clock,
  Skull,
  GripVertical,
  ArrowDown,
  BookAIcon,
  Send,
  Users,
  Lock,
  Unlock,
} from "lucide-react";
import { EvolutionAnimation } from "@/components/evolution-animation";

interface TeamTabProps {
  onStartBattle: (uid: string) => void;
  onSwitchToPokedex?: () => void;
}

export function TeamTab({ onStartBattle, onSwitchToPokedex }: TeamTabProps) {
  const {
    team,
    reserves,
    bag,
    removeFromTeam,
    reorderTeam,
    moveToReserves,
    moveToTeam,
    removeFromReserves,
    learnMove,
    forgetMove,
    addXp,
    setLevel,
    evolvePokemon,
    useStone,
    evolveByTrade,
    useRareCandy,
    pendingEvolution,
    completeEvolution,
    transferToProfesor,
    transferAllDuplicates,
  } = useGameStore();



      
  const [selectedUid, setSelectedUid] = useState<string | null>(null);
  const [xpInput, setXpInput] = useState("");
  const [levelInput, setLevelInput] = useState("");

  const hasRareCandy = bag.some(
    (b) => b.itemId === "rare-candy" && b.quantity > 0
  );

  const handleEvolutionComplete = useCallback(() => {
    // Discover the evolved pokemon in the pokedex and trigger reveal
    const evo = pendingEvolution;
    if (evo) {
      const modeState = useModeStore.getState();
      if (modeState.mode === "trainer") {
        const profileId = modeState.activeProfileId;
        const alreadyDiscovered = profileId ? (modeState.discoveredPokemon[profileId] || []).includes(evo.toSpeciesId) : true;
        modeState.discoverPokemon(evo.toSpeciesId);
        if (!alreadyDiscovered && onSwitchToPokedex) {
          modeState.triggerPokedexReveal(evo.toSpeciesId);
          onSwitchToPokedex();
        }
      }
    }
    completeEvolution();
  }, [completeEvolution, pendingEvolution, onSwitchToPokedex]);

  // Derive selectedPokemon directly from store state so it's always fresh
  const selectedPokemon = selectedUid
    ? team.find((p) => p.uid === selectedUid) ?? reserves.find((p) => p.uid === selectedUid) ?? null
    : null;
  const isSelectedInReserves = selectedUid ? reserves.some((p) => p.uid === selectedUid) : false;

  // Drag state for reordering team (must be before any early return)
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  if (team.length === 0 && reserves.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
          <Swords className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          Nenhum Pokemon
        </h3>
        <p className="text-sm text-muted-foreground">
          Va ate a Pokedex e escolha Pokemon para sua equipe!
        </p>
      </div>
    );
  }

  // First alive pokemon for the battle button
  const firstAlive = team.find((p) => p.currentHp > 0);

  // Build the 6 fixed slots
  const slots: (typeof team[number] | null)[] = Array.from({ length: 6 }, (_, i) => team[i] ?? null);

  const handleDragStart = (index: number) => {
    if (!slots[index]) return;
    setDragIndex(index);
  };
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };
  const handleDrop = (targetIndex: number) => {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }
    const sourcePokemon = slots[dragIndex];
    const targetPokemon = slots[targetIndex];

    if (sourcePokemon && targetPokemon) {
      // Both slots have pokemon -> swap
      reorderTeam(dragIndex, targetIndex);
    } else if (sourcePokemon && !targetPokemon && targetIndex < team.length) {
      // Move to an occupied-range slot (shouldn't happen with contiguous array)
      reorderTeam(dragIndex, targetIndex);
    } else if (sourcePokemon && !targetPokemon) {
      // Moving to an empty slot beyond current length - reorder by removing and inserting
      const newTeam = [...team];
      const [moved] = newTeam.splice(dragIndex, 1);
      // Insert at the target position (clamped to array length)
      const insertAt = Math.min(targetIndex, newTeam.length);
      newTeam.splice(insertAt, 0, moved);
      useGameStore.setState({ team: newTeam });
    }
    setDragIndex(null);
    setDragOverIndex(null);
  };
  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const renderTeamSlot = (pokemon: typeof team[number] | null, slotIndex: number) => {
    if (!pokemon) {
      // Empty slot
      return (
        <div
          key={`empty-${slotIndex}`}
          className={`flex flex-col items-center justify-center rounded-lg border-1 transition-all ${
            dragOverIndex === slotIndex
              ? "border-primary/60 bg-primary/5"
              : "border-border/40 bg-card/20"
          }`}
          style={{ height: 150 }}
          onDragOver={(e) => handleDragOver(e, slotIndex)}
          onDrop={() => handleDrop(slotIndex)}
        >
      
      <span className="text-[9px] text-muted-foreground/30 font-mono">
      <svg
          width="60"
          height="60"
          viewBox="0 0 100 100"
        >
          <circle cx="50" cy="50" r="48" fill="#08080a" stroke="#1E293B" strokeWidth="4" />
          <rect x="2" y="48" width="96" height="4" fill="#1E293B" />
          <path d="M 2 50 A 48 48 0 0 0 98 50" fill="#606264" />
          <circle cx="50" cy="50" r="14" fill="#3c3d3d" stroke="#1E293B" strokeWidth="3" />
          <circle cx="50" cy="50" r="6" fill="#1E293B" />
        </svg>
                    
                    </span>
        </div>
      );
    }

    const species = getPokemon(pokemon.speciesId);
    const level = pokemon.level ?? 1;
    const xp = pokemon.xp ?? 0;
    const hpPercent = pokemon.maxHp > 0 ? (Math.round(pokemon.currentHp) / pokemon.maxHp) * 100 : 0;
    const hpColor = hpPercent > 50 ? "#22C55E" : hpPercent > 25 ? "#F59E0B" : "#EF4444";
    const isFainted = pokemon.currentHp <= 0;
    const xpNeeded = xpForLevel(level + 1);
    const xpPercent = xpNeeded > 0 ? Math.min(100, (xp / xpNeeded) * 100) : 0;
    const isDragging = dragIndex === slotIndex;
    const isDragOver = dragOverIndex === slotIndex && dragIndex !== slotIndex;

    return (

      <div
        key={pokemon.uid}
        draggable
        onDragStart={() => handleDragStart(slotIndex)}
        onDragOver={(e) => handleDragOver(e, slotIndex)}
        onDrop={() => handleDrop(slotIndex)}
        onDragEnd={handleDragEnd}
        className={`relativew-full rounded-[4px] p-[2px] transition-all duration-200 ${
          isDragging ? "opacity-40 scale-95" : ""
        } ${
          isDragOver
            ? "ring-2 ring-primary/60 ring-offset-1 ring-offset-background"
            : ""
        }`}
        style={{
          background: isFainted?"linear-gradient(135deg, #6d6969, #000000, #403f3f)":"linear-gradient(135deg, #1852e6, #09bfcf, #030240)",
        }}
      >
        <div
          role="button"
          tabIndex={0}
          onClick={() => setSelectedUid(pokemon.uid)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedUid(pokemon.uid) }}
          className={`w-full rounded-[4px] p-1.5 flex flex-col h-full cursor-pointer
        
              ${ isFainted ? "bg-gradient-to-b from-[#4b4b4b] via-[#2e2e2e] to-[#1a1a1a]" : " bg-gradient-to-b from-[#1e3a8a] to-[#0f172a] border " }
         ${ isFainted ? "border-red-800 " : "border-neutral-700 " }
         
         `}
        >
          {/* HEADER */}
          <div className="flex justify-between items-start border-b border-neutral-700 pb-[2px]">
            <div className="min-w-0">
              <div className="text-[9px] font-bold text-neutral-100 truncate leading-none">
                {pokemon.name}
              </div>

            </div>

            <div className="text-right shrink-0">
              {species && (
                <div className="flex gap-[2px] mt-[1px]">
                  {species.types.map((t) => (
                    <span
                      key={t}
                      className="text-[6px] px-[2px] rounded-[2px] text-white"
                      style={{ backgroundColor: TYPE_COLORS[t] }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ART AREA */}
          <div className={`relative flex justify-center items-center my-1.5 h-[56px]
          
            ${ isFainted ? "bg-gradient-to-b from-[#3a3a3a] via-[#262626] to-[#141414]" : " bg-gradient-to-b from-[#1e2f5a] via-[#162447] to-[#0f1a33] " }
          rounded `}>
            <img
              src={getSpriteUrl(pokemon.speciesId) || "/placeholder.svg"}
              alt={pokemon.name}
              className={`pixelated h-[48px]  ${isFainted?'grayscale':''}` }
              crossOrigin="anonymous"
            />
                <span className="absolute top-1 left-1 text-[7px] font-mono text-neutral-500">
                  Lv{level}
            </span>

          </div>

          {/* STATUS */}
          <div className="flex flex-col gap-[3px] mt-auto">

            {/* HP */}
            <div className="flex items-center gap-[3px]">
              <Heart className="w-2.5 h-2.5 text-red-500" />
              <div className="flex-1 h-[6px] bg-neutral-800 rounded-full overflow-hidden border border-neutral-700">
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${hpPercent}%`,
                    backgroundColor: hpColor,
                  }}
                />
              </div>
            </div>
               <div className="text-[7px] font-mono text-neutral-400 leading-none">
        {Math.round(pokemon.currentHp)}/{pokemon.maxHp}
      </div>
            

            {/* XP */}
            <div className="flex items-center gap-[3px]">
              <Star className="w-2.5 h-2.5 text-yellow-500" />
              <div className="flex-1 h-[6px] bg-neutral-800 rounded-full overflow-hidden border border-neutral-700">
                <div
                  className="h-full bg-yellow-500 transition-all duration-300"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex justify-end pt-[2px]">
              <div
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation()
                  moveToReserves(pokemon.uid)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation()
                    moveToReserves(pokemon.uid)
                  }
                }}
                className="h-5 w-full px-1.5 bg-gray-600 text-white hover:bg-red-700 text-[8px] rounded cursor-pointer inline-flex items-center justify-center font-medium"
              >
                Reserva
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderReserveCard = (pokemon: typeof team[number]) => {
    const species = getPokemon(pokemon.speciesId);
    const level = pokemon.level ?? 1;
        const xp = pokemon.xp ?? 0;
     const xpNeeded = xpForLevel(level + 1);
    const hpPercent = pokemon.maxHp > 0 ? (Math.round(pokemon.currentHp) / pokemon.maxHp) * 100 : 0;
    const hpColor = hpPercent > 50 ? "#22C55E" : hpPercent > 25 ? "#F59E0B" : "#EF4444";
    const isFainted = pokemon.currentHp <= 0;
    const xpPercent = xpNeeded > 0 ? Math.min(100, (xp / xpNeeded) * 100) : 0;

    return (
<div
  key={pokemon.uid}
  className="relative w-[108px] rounded-[4px] p-[2px] transition-all duration-200"
  style={{
    background: "linear-gradient(135deg, #e02d2d, #1e0000, #180101)",
  }}
>
  <div
    role="button"
    tabIndex={0}
    onClick={() => setSelectedUid(pokemon.uid)}
    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedUid(pokemon.uid) }}
    className={`w-full rounded-[4px] p-1.5 flex flex-col h-full cursor-pointer
    bg-gradient-to-b from-[#2b2b2b] to-[#161616] border transition-all
    ${isFainted ? "border-red-800 opacity-60" : "border-neutral-700"}`}
  >
    {/* HEADER */}
    <div className="flex justify-between items-start border-b border-neutral-700 pb-[2px]">
      <div className="min-w-0">
        <div className="text-[9px] font-bold text-neutral-100 truncate leading-none">
          {pokemon.name}
        </div>
      </div>

              {species && (
                <div className="flex gap-[2px] mt-[1px]">
                  {species.types.map((t) => (
                    <span
                      key={t}
                      className="text-[6px] px-[2px] rounded-[2px] text-white"
                      style={{ backgroundColor: 'gray' }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
    </div>

    {/* ART AREA */}
        <div className="relative flex justify-center items-center my-1.5 h-[56px] bg-gradient-to-b from-neutral-800 to-neutral-900 rounded  border-neutral-700">
      <img
        src={getSpriteUrl(pokemon.speciesId) || "/placeholder.svg"}
        alt={pokemon.name}
        className="pixelated h-[48px] select-none pointer-events-none grayscale"
        crossOrigin="anonymous"
        draggable={false}
      />

      <span className="absolute top-1 left-1 text-[7px] font-mono text-neutral-500">
        Lv{level}
      </span>
    </div>

    {/* STATUS */}
    <div className="flex flex-col gap-[3px] mt-auto">

      {/* HP */}
      <div className="flex items-center gap-[3px]">
        <Heart className="w-2.5 h-2.5 text-gray-500" />
        <div className="flex-1 h-[6px] bg-neutral-800 rounded-full overflow-hidden border border-neutral-700">
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${hpPercent}%`,
              backgroundColor: 'gray',
            }}
          />
        </div>
      </div>

      <div className="text-[7px] font-mono text-neutral-400 leading-none">
        {Math.round(pokemon.currentHp)}/{pokemon.maxHp}
      </div>
        {/* XP */}
        <div className="flex items-center gap-[3px]">
          <Star className="w-2.5 h-2.5 text-gray-500" />
          <div className="flex-1 h-[6px] bg-neutral-800 rounded-full overflow-hidden border border-neutral-700">
            <div
              className="h-full bg-gray-500 transition-all duration-300"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>
      {/* FOOTER BUTTON */}
      <div className="flex justify-end pt-[2px]">
        <div
          role="button"
          tabIndex={0}
          aria-disabled={team.length >= 6}
          style={{backgroundColor:team.length >= 6?"gray":'green'}}
          onClick={(e) => {
            e.stopPropagation()
            if (team.length < 6) moveToTeam(pokemon.uid)
          }}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && team.length < 6) {
              e.stopPropagation()
              moveToTeam(pokemon.uid)
            }
          }}
          className={`h-5 w-full px-1.5 text-white text-[7px] rounded inline-flex items-center justify-center font-medium ${team.length >= 6 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-green-700'}`}
          title="Promover para Equipe"
        >
          Promover
        </div>
      </div>
    </div>
  </div>
</div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Evolution animation overlay */}
      <AnimatePresence>
        {pendingEvolution && (
          <EvolutionAnimation
            fromSpeciesId={pendingEvolution.fromSpeciesId}
            toSpeciesId={pendingEvolution.toSpeciesId}
            pokemonName={pendingEvolution.pokemonName}
            onComplete={handleEvolutionComplete}
          />
        )}
      </AnimatePresence>

      <ScrollArea className="flex-1">
        {/* Section 1: Minha Equipe - always 6 slots */}
        <div className="p-3 border-b border-border">
          <div className="flex items-center gap-2 mb-2">
            <Swords className="w-4 h-4 text-primary" />
            <h2 className="font-semibold text-sm text-foreground">
              Minha Equipe ({team.length}/6)
            </h2>
            <Button
              size="sm"
              disabled={!firstAlive}
              onClick={() => firstAlive && onStartBattle(firstAlive.uid)}
              className="ml-auto h-7 px-3 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold gap-1.5"
            >
              <Swords className="w-3.5 h-3.5" />
              Batalhar
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {slots.map((pokemon, i) => renderTeamSlot(pokemon, i))}
          </div>
        </div>

        {/* Section 2: Reservas */}
        <div className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <Archive className="w-4 h-4 text-muted-foreground" />
            <h2 className="font-semibold text-sm text-foreground">
              Reservas ({reserves.length})
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {reserves.length === 0 ? (
              <div className="col-span-3 flex flex-col items-center gap-2 py-4 text-center">
                <Archive className="w-6 h-6 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  Nenhum Pokemon nas reservas.
                </p>
              </div>
            ) : (
              reserves.map((pokemon) => renderReserveCard(pokemon))
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Pokemon detail / manage dialog */}
      <Dialog
        open={!!selectedPokemon}
        onOpenChange={() => setSelectedUid(null)}
      >
        {selectedPokemon && <PokemonDetailContent
          pokemon={selectedPokemon}
          bag={bag}
          hasRareCandy={hasRareCandy}
          xpInput={xpInput}
          setXpInput={setXpInput}
          levelInput={levelInput}
          setLevelInput={setLevelInput}
          addXp={addXp}
          setLevel={setLevel}
          evolvePokemon={evolvePokemon}
          useStone={useStone}
          evolveByTrade={evolveByTrade}
          useRareCandy={useRareCandy}
          learnMove={learnMove}
          forgetMove={forgetMove}
          removeFromTeam={isSelectedInReserves ? removeFromReserves : removeFromTeam}
          transferToProfesor={transferToProfesor}
          transferAllDuplicates={transferAllDuplicates}
          allTeam={team}
          allReserves={reserves}
          onClose={() => setSelectedUid(null)}
          xpLocked={useModeStore.getState().xpLocked}
        />}
      </Dialog>
    </div>
  );
}

// Extracted to a separate component to keep things clean
function PokemonDetailContent({
  pokemon,
  bag,
  hasRareCandy,
  xpInput,
  setXpInput,
  levelInput,
  setLevelInput,
  addXp,
  setLevel,
  xpLocked,
  evolvePokemon,
  useStone,
  evolveByTrade,
  learnMove,
  forgetMove,
  removeFromTeam,
  transferToProfesor,
  transferAllDuplicates,
  allTeam,
  allReserves,
  onClose,
}: {
  pokemon: NonNullable<ReturnType<typeof useGameStore.getState>["team"][number]>;
  bag: ReturnType<typeof useGameStore.getState>["bag"];
  hasRareCandy: boolean;
  xpInput: string;
  setXpInput: (v: string) => void;
  levelInput: string;
  setLevelInput: (v: string) => void;
  addXp: (uid: string, amount: number) => void;
  setLevel: (uid: string, level: number) => void;
  xpLocked: boolean;
  evolvePokemon: (uid: string, toSpeciesId: number) => void;
  useStone: (uid: string, stoneId: string) => boolean;
  evolveByTrade: (uid: string) => boolean;
  learnMove: (uid: string, moveId: string) => void;
  forgetMove: (uid: string, moveId: string) => void;
  removeFromTeam: (uid: string) => void;
  transferToProfesor: (uid: string) => { xpGained: number; recipientName: string | null };
  transferAllDuplicates: (speciesId: number, keepUid: string) => { count: number; totalXp: number };
  allTeam: ReturnType<typeof useGameStore.getState>["team"];
  allReserves: ReturnType<typeof useGameStore.getState>["reserves"];
  onClose: () => void;
}) {
  const level = pokemon.level ?? 1;
  const xp = pokemon.xp ?? 0;
  const xpNeeded = xpForLevel(level + 1);

  const species = getPokemon(pokemon.speciesId);
  const levelEvo = canEvolveByLevel(pokemon.speciesId, level);
  const tradeEvo = canEvolveByTrade(pokemon.speciesId);
  const stoneEvos = EVOLUTION_STONES.filter((stone) =>
    canEvolveByStone(pokemon.speciesId, stone.id)
  );
const habildade_especial = getBaseAttributes(pokemon.speciesId).especial ?? ''

  // Count duplicates of same species across team + reserves (excluding self)
  const duplicateCount = [...allTeam, ...allReserves].filter(
    (p) => p.speciesId === pokemon.speciesId && p.uid !== pokemon.uid
  ).length;
  const estimatedXp = [...allTeam, ...allReserves]
    .filter((p) => p.speciesId === pokemon.speciesId && p.uid !== pokemon.uid)
    .reduce((sum, p) => sum + (p.level ?? 1) * 25, 0);

  const [transferResult, setTransferResult] = useState<{
    pokemonName: string;
    recipientName: string;
    xpGained: number;
    count?: number;
  } | null>(null);
  const [xpBarAnimProgress, setXpBarAnimProgress] = useState(0);

  return (
    <DialogContent className="bg-card border-border text-foreground max-w-sm mx-auto h-[75vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-foreground">
          {pokemon.name}
          <span className="text-xs font-normal text-muted-foreground bg-secondary rounded-full px-2 py-0.5">
            Lv.{level}
          </span>
        </DialogTitle>

      </DialogHeader>
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="w-full bg-secondary">
          <TabsTrigger
            value="info"
            style={{fontSize:9}}
            className="flex-1  data-[state=active]:bg-card"
          >
          Info
          </TabsTrigger>
          <TabsTrigger
                    style={{fontSize:9}}
            value="moves"
            className="flex-1  data-[state=active]:bg-card"
          >
            Golpes
          </TabsTrigger>
<TabsTrigger
  style={{fontSize:9}}
  value="learn"
  className="flex-1  data-[state=active]:bg-card"
  >
Aprender
  </TabsTrigger>
  <TabsTrigger
  style={{fontSize:9}}
  value="skilltree"
  className="flex-1  data-[state=active]:bg-card"
  >
Arvore
  </TabsTrigger>
          <TabsTrigger
                    style={{fontSize:9}}
            value="attrs"
            className="flex-1  data-[state=active]:bg-card"
          >
            Atributos
          </TabsTrigger>
          {/* <TabsTrigger
                    style={{fontSize:9}}
            value="evolve"
            className="flex-1  data-[state=active]:bg-card"
          >
           <ArrowUp size={10} />
          </TabsTrigger> */}
          <TabsTrigger
                    style={{fontSize:9}}
            value="history"
            className="flex-1  data-[state=active]:bg-card"
          >
            <Swords size={25} />
          </TabsTrigger>
        </TabsList>

        {/* Info Tab */}
        <TabsContent value="info" className="mt-3">
          <div className="flex flex-col items-center gap-3">
            <img
              src={getSpriteUrl(pokemon.speciesId) || "/placeholder.svg"}
              alt={pokemon.name}
              width={96}
              height={96}
              className="pixelated"
              crossOrigin="anonymous"
            />
            {/* <div className="flex items-center gap-2 text-sm">
              <Heart className="w-4 h-4 text-red-400" />
              <span className="text-foreground">
                {Math.round(pokemon.currentHp)} / {pokemon.maxHp} HP
              </span>
            </div> */}
            {/* <div className="flex items-center gap-2 text-sm">
              <Star className="w-4 h-4 text-yellow-400" />
                <p> {habildade_especial.toLowerCase().replace("_"," ")}</p>
            </div> */}

                 
            {/* XP display */}
            <div className="w-full bg-secondary/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">
                  Level {level}
                </span>
                <span className="text-xs text-muted-foreground">
                  XP: {xp} / {xpNeeded}
                </span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, (xp / xpNeeded) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Duplicates panel */}
            {duplicateCount > 0 && (
              <div className="w-full rounded-lg border border-amber-700/30 bg-amber-900/20 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-medium text-amber-300">
                    {duplicateCount} duplicata{duplicateCount > 1 ? 's' : ''} encontrada{duplicateCount > 1 ? 's' : ''}
                  </span>
                </div>
                <p className="text-xs text-amber-200/70 mb-2">
                  Envie ao Professor e ganhe <span className="font-bold text-amber-300">+{estimatedXp} XP</span> para {pokemon.name}!
                </p>
                <Button
                  size="sm"
                  onClick={() => {
                    const result = transferAllDuplicates(pokemon.speciesId, pokemon.uid);
                    if (result.count > 0) {
                      setTransferResult({
                        pokemonName: pokemon.name,
                        recipientName: pokemon.name,
                        xpGained: result.totalXp,
                        count: result.count,
                      });
                      setXpBarAnimProgress(0);
                      setTimeout(() => setXpBarAnimProgress(100), 100);
                    }
                  }}
                  className="w-full bg-amber-600 text-white hover:bg-amber-700 text-xs"
                >
                  <Send className="w-3 h-3 mr-1" />
                  Enviar excesso ao Professor
                </Button>
              </div>
            )}

            {/* Add XP */}
            <div className="w-full flex flex-col gap-2">
              {xpLocked && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-2 mb-1">
                  <p className="text-xs text-amber-400 text-center">
                    Adicao de XP bloqueada. Desbloqueie nas Configuracoes.
                  </p>
                </div>
              )}
              <div className="flex gap-2">
                {[50, 100, 250, 500].map((val) => (
                  <Button
                    key={val}
                    size="sm"
                    variant="outline"
                    onClick={() => addXp(pokemon.uid, val)}
                    disabled={xpLocked}
                    className="flex-1 text-xs border-border text-foreground bg-transparent hover:bg-secondary disabled:opacity-50"
                  >
                    +{val}
                  </Button>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="XP personalizado"
                  value={xpInput}
                  onChange={(e) => setXpInput(e.target.value)}
                  disabled={xpLocked}
                  className="bg-secondary border-border text-foreground text-sm disabled:opacity-50"
                />
                <Button
                  size="sm"
                  onClick={() => {
                    const val = parseInt(xpInput);
                    if (val > 0) {
                      addXp(pokemon.uid, val);
                      setXpInput("");
                    }
                  }}
                  disabled={xpLocked}
                  className="bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Set Level directly */}
            <div className="w-full flex flex-col gap-2">
      
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Definir Nivel: Ex 60"
                  value={levelInput}
                  onChange={(e) => setLevelInput(e.target.value)}
                  disabled={xpLocked}
                  className="bg-secondary border-border text-foreground text-sm disabled:opacity-50"
                  min={1}
                  max={100}
                />
                <Button
                  size="sm"
                  onClick={() => {
                    const val = parseInt(levelInput);
                    if (val >= 1 && val <= 100) {
                      setLevel(pokemon.uid, val);
                      setLevelInput("");
                    }
                  }}
                  disabled={xpLocked}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Rare Candy */}
            {hasRareCandy && (
              <Button
                variant="outline"
                onClick={() => useRareCandy(pokemon.uid)}
                className="w-full border-accent/50 text-accent bg-transparent hover:bg-accent/10"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Usar Rare Candy (Lv.{level} {"->"} {level + 1})
              </Button>
            )}

            <Button
              variant="destructive"
              onClick={() => {
                const result = transferToProfesor(pokemon.uid);
                if (result.xpGained > 0 && result.recipientName) {
                  setTransferResult({
                    pokemonName: pokemon.name,
                    recipientName: result.recipientName,
                    xpGained: result.xpGained,
                  });
                  setXpBarAnimProgress(0);
                  setTimeout(() => setXpBarAnimProgress(100), 100);
                  setTimeout(() => onClose(), 3000);
                } else {
                  onClose();
                }
              }}
              className="w-full"
            >
              <Send className="w-4 h-4 mr-2" />
              Transferir para o Professor
            </Button>
          </div>
        </TabsContent>

        {/* Moves Tab */}
        <TabsContent value="moves" className="mt-3">
          <div className="flex flex-col gap-2">
            {pokemon.moves.map((m) => {
              const moveDef = getMove(m.moveId);
              if (!moveDef) return null;
              return (
                <div
                  key={m.moveId}
                  className="flex items-center justify-between bg-secondary rounded-lg p-2"
                >
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[8px] px-1 py-0.5 rounded text-white"
                        style={{
                          backgroundColor:
                            TYPE_COLORS[moveDef.type as PokemonType],
                        }}
                      >
                        {moveDef.type.toUpperCase()}
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {moveDef.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {moveDef.description}
                    </span>
                    <div className="flex gap-2 text-[10px] text-muted-foreground">
                      {moveDef.power > 0 && (
                        <span>PWR: {moveDef.power}</span>
                      )}
                      <span>
                        D20 {">="} {moveDef.accuracy}
                      </span>
                      <span>
                        PP: {m.currentPP}/{m.maxPP}
                      </span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => forgetMove(pokemon.uid, m.moveId)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
            {pokemon.moves.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum golpe. Va em Aprender para adicionar.
              </p>
            )}
          </div>
        </TabsContent>

        {/* Learn Tab */}
        <TabsContent value="learn" className="mt-3">
          <div className="flex flex-col gap-2">
            {pokemon.learnableMoves.map((mId) => {
              const moveDef = getMove(mId);
              if (!moveDef) return null;
              const canLearn = pokemon.moves.length < 4;
              return (
                <div
                  key={mId}
                  className="flex items-center justify-between bg-secondary rounded-lg p-2"
                >
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[8px] px-1 py-0.5 rounded text-white"
                        style={{
                          backgroundColor:
                            TYPE_COLORS[moveDef.type as PokemonType],
                        }}
                      >
                        {moveDef.type.toUpperCase()}
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {moveDef.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {moveDef.description}
                    </span>
                    <div className="flex gap-2 text-[10px] text-muted-foreground">
                      {moveDef.power > 0 && (
                        <span>PWR: {moveDef.power}</span>
                      )}
                      <span>
                        D20 {">="} {moveDef.accuracy}
                      </span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    disabled={!canLearn}
                    onClick={() => learnMove(pokemon.uid, mId)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
            {pokemon.learnableMoves.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum golpe disponivel para aprender.
              </p>
            )}
            {pokemon.moves.length >= 4 && (
              <p className="text-xs text-accent text-center">
                Maximo 4 golpes. Esqueca um para aprender outro.
              </p>
            )}
          </div>
        </TabsContent>

        {/* Skill Tree Tab */}
        <TabsContent value="skilltree" className="mt-3">
          <SkillTreeTab pokemon={pokemon} />
        </TabsContent>

        {/* Attributes Tab */}
        <TabsContent value="attrs" className="mt-3">
          {(() => {
            const attrs = computeAttributes(pokemon.speciesId, level, pokemon.customAttributes);

            const habildade_especial = getBaseAttributes(pokemon.speciesId).especial ?? ''


            const attrKeys: (keyof PokemonBaseAttributes)[] = ["velocidade", "felicidade", "resistencia", "acrobacia","especial"];
            const attrIcons: Record<string, { icon: typeof Zap; color: string }> = {
              velocidade:  { icon: Zap,    color: "#FACC15" },
              felicidade:  { icon: Heart,  color: "#F472B6" },
              resistencia: { icon: Shield, color: "#60A5FA" },
              acrobacia:   { icon: Wind,   color: "#2DD4BF" },
               especial:   { icon: Wind,   color: "#e6f511" },
            };
            const isFainted = pokemon.currentHp <= 0;
            return (
              <div className="flex flex-col gap-3">
                <p className="text-xs text-muted-foreground text-center">
                  Atributos do Pokemon (escalam com o nivel)
               
                </p>
                {isFainted && (
                  <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-2 text-center">
                    <span className="text-xs text-destructive font-medium">
                      Pokemon desmaiado - atributos penalizados!
                    </span>
                  </div>
                )}

                {/* Defense / AC */}
                <div className="bg-blue-400/10 border border-blue-400/20 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <div>
                      <span className="text-sm font-bold text-foreground">Defesa (AC)</span>
                      <p className="text-[10px] text-muted-foreground">Reducao de dano: -{Math.floor(attrs.defesa / 3)}</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold font-mono text-blue-400">{attrs.defesa}</span>
                </div>

                {attrKeys.map((attr) => {

             
                  const info = POKEMON_ATTRIBUTE_INFO[attr];
                  const { icon: Icon, color } = attrIcons[attr];
                  const baseVal = attrs[attr];
                  const modKey = `${attr}Mod` as keyof typeof attrs;
                  const mod = attrs[modKey] as number;
                  const barPercent = Math.min(100, baseVal * 10);
                  return (
                    <div key={attr} style={{backgroundColor: attr == 'especial'?'rgb(0,0,0,0.4)':''}}  className="bg-secondary rounded-lg p-3">

                      <div  className="flex items-center gap-2 mb-1.5">
                        <Icon className="w-4 h-4 shrink-0" style={{ color }} />
                        <span className="text-sm font-bold text-foreground">{info.name}</span>
                        <span className="ml-auto text-xs font-mono text-accent">+{mod} mod</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">

                        {attr == 'especial'?  (habildade_especial ?? '').replace('_',' ') :
                          <div className="flex-1 h-2.5 bg-background rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{ width: `${barPercent}%`, backgroundColor: color }}
                          />
                        </div>
                        
                        }
                      
                        <span className="text-xs font-mono text-muted-foreground w-8 text-right">
                          {baseVal}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{info.desc}</p>
                    </div>
                  );
                })}
                <div className="bg-secondary/50 rounded-lg p-2 mt-1">
                  <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
                    Modificador = Base/2 + Nivel/5. Defesa = 8 + Resistencia/2 + Nivel/4.
                    <br />
                    Atributos sobem ao ganhar nivel e caem ao desmaiar.
                  </p>
                </div>
              </div>
            );
          })()}
        </TabsContent>

        {/* Evolve Tab */}
        <TabsContent value="evolve" className="mt-3">
          <div className="flex flex-col gap-3">
            {/* Level evolution */}
            {levelEvo &&
              (() => {
                const evoSpecies = getPokemon(levelEvo.to);
                const canEvolveNow = level >= (levelEvo.level || 999);
                return (
                  <div className="bg-secondary rounded-lg p-3 flex items-center gap-3">
                    <img
                      src={getSpriteUrl(levelEvo.to) || "/placeholder.svg"}
                      alt={evoSpecies?.name || ""}
                      width={48}
                      height={48}
                      className="pixelated"
                      crossOrigin="anonymous"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        Evoluir para {evoSpecies?.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Nivel necessario: {levelEvo.level} (atual: {level})
                      </p>
                      {canEvolveNow && (
                        <p className="text-[10px] text-green-400 font-medium">
                          Pronto para evoluir!
                        </p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      disabled={!canEvolveNow}
                      onClick={() =>
                        evolvePokemon(pokemon.uid, levelEvo.to)
                      }
                      className="bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })()}

            {/* Stone evolutions */}
            {stoneEvos.map((stone) => {
              const evo = canEvolveByStone(pokemon.speciesId, stone.id);
              if (!evo) return null;
              const evoSpecies = getPokemon(evo.to);
              const hasStone = bag.some(
                (b) => b.itemId === stone.id && b.quantity > 0
              );
              return (
                <div
                  key={stone.id}
                  className="bg-secondary rounded-lg p-3 flex items-center gap-3"
                >
                  <img
                    src={getSpriteUrl(evo.to) || "/placeholder.svg"}
                    alt={evoSpecies?.name || ""}
                    width={48}
                    height={48}
                    className="pixelated"
                    crossOrigin="anonymous"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      Evoluir para {evoSpecies?.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Requer: {stone.name}{" "}
                      {hasStone ? "(na bolsa)" : "(nao possui)"}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    disabled={!hasStone}
                    onClick={() => useStone(pokemon.uid, stone.id)}
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    <Gem className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}

            {/* Trade evolution */}
            {tradeEvo &&
              (() => {
                const evoSpecies = getPokemon(tradeEvo.to);
                return (
                  <div className="bg-secondary rounded-lg p-3 flex items-center gap-3">
                    <img
                      src={getSpriteUrl(tradeEvo.to) || "/placeholder.svg"}
                      alt={evoSpecies?.name || ""}
                      width={48}
                      height={48}
                      className="pixelated"
                      crossOrigin="anonymous"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        Evoluir para {evoSpecies?.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Evolucao por troca (decisao do mestre)
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => evolveByTrade(pokemon.uid)}
                      className="bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })()}

            {!levelEvo && stoneEvos.length === 0 && !tradeEvo && (
              <div className="flex flex-col items-center gap-2 py-6 text-center">
                <Sparkles className="w-8 h-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Este Pokemon nao possui evolucoes disponiveis.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="mt-3">
          <div className="flex flex-col gap-2">
            {(() => {
              const history = [...(pokemon.battleHistory || [])].reverse();
              const victories = history.filter((h) => h.type === "victory").length;
              const faints = history.filter((h) => h.type === "faint").length;

              return (
                <>
                  {/* Stats summary */}
                  <div className="flex gap-3 mb-2">
                    <div className="flex-1 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2 text-center">
                      <Trophy className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                      <span className="text-lg font-bold text-amber-400">{victories}</span>
                      <p className="text-[9px] text-muted-foreground">Vitorias</p>
                    </div>
                    <div className="flex-1 bg-red-500/10 border border-red-500/20 rounded-lg p-2 text-center">
                      <Skull className="w-4 h-4 text-red-400 mx-auto mb-1" />
                      <span className="text-lg font-bold text-red-400">{faints}</span>
                      <p className="text-[9px] text-muted-foreground">Derrotas</p>
                    </div>
                  </div>

                  {history.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-6 text-center">
                      <Clock className="w-8 h-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Nenhum registro de batalha ainda.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1.5 max-h-[200px] overflow-y-auto">
                      {history.map((entry) => {
                        const date = new Date(entry.date);
                        const formatted = `${date.toLocaleDateString("pt-BR")} ${date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
                        return (
                          <div
                            key={entry.id}
                            className={`flex items-center gap-2 rounded-lg p-2 text-xs ${
                              entry.type === "victory"
                                ? "bg-amber-500/10 border border-amber-500/20"
                                : "bg-red-500/10 border border-red-500/20"
                            }`}
                          >
                            {entry.type === "victory" ? (
                              <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            ) : (
                              <Skull className="w-3.5 h-3.5 text-red-400 shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <span className="font-medium text-foreground">
                                {entry.type === "victory" ? "Vitoria" : "Desmaiou"}
                              </span>
                              {entry.xpGained && entry.xpGained > 0 && (
                                <span className="ml-1.5 text-amber-400 font-mono">+{entry.xpGained} XP</span>
                              )}
                            </div>
                            <span className="text-[9px] text-muted-foreground shrink-0">{formatted}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </TabsContent>
      </Tabs>

      {/* Transfer XP Animation Overlay */}
      <AnimatePresence>
        {transferResult && (
          <motion.div
            key="transfer-overlay"
            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="flex flex-col items-center gap-3 p-6 max-w-xs"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 10, delay: 0.2 }}
              >
                <Send className="w-10 h-10 text-amber-400" />
              </motion.div>
              <motion.p
                className="text-sm text-center text-foreground font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {transferResult.count
                  ? `${transferResult.count} Pokemon transferido${transferResult.count > 1 ? 's' : ''}!`
                  : `${transferResult.pokemonName} transferido!`}
              </motion.p>
              <motion.div
                className="w-full bg-card rounded-lg border border-border p-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-foreground">{transferResult.recipientName}</span>
                  <motion.span
                    className="text-sm font-bold text-emerald-400"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.4, 1] }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    +{transferResult.xpGained} XP
                  </motion.span>
                </div>
                <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400"
                    initial={{ width: "0%" }}
                    animate={{ width: `${xpBarAnimProgress}%` }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.8 }}
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setTransferResult(null)}
                  className="text-xs"
                >
                  Fechar
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DialogContent>
  );
}

// ─── Skill Tree Tab Component ───────────────────────────────────────────────
import { TeamPokemon, battleXpForLevel } from "@/lib/game-store";
import { 
  getSkillTree, 
  generateDefaultSkillTree, 
  canUnlockSkill, 
  SkillNode, 
  SkillTree 
} from "@/lib/skill-tree-data";
import { POKEMON } from "@/lib/pokemon-data";

function SkillTreeTab({ pokemon }: { pokemon: TeamPokemon }) {
  const { trainer, unlockPokemonSkill, learnMove } = useGameStore();
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);

  // Get or generate skill tree
  const skillTree: SkillTree = (() => {
    const existing = getSkillTree(pokemon.speciesId);
    if (existing) return existing;
    const species = POKEMON.find((p) => p.id === pokemon.speciesId);
    if (!species) return { speciesId: pokemon.speciesId, swordPath: [], shieldPath: [] };
    return generateDefaultSkillTree(pokemon.speciesId, species.startingMoves, species.learnableMoves);
  })();

  const battleLevel = trainer.battleLevel ?? 1;
  const battlePoints = trainer.battlePoints ?? 0;
  const battleXp = trainer.battleXp ?? 0;
  const nextLevelXp = battleXpForLevel(battleLevel + 1);
  const unlockedSkills = pokemon.unlockedSkills ?? [];

  const handleUnlockSkill = (skill: SkillNode) => {
    const result = canUnlockSkill(skill, pokemon.level, unlockedSkills, battlePoints);
    if (!result.canUnlock) return;
    const success = unlockPokemonSkill(pokemon.uid, skill.id, skill.pbCost);
    if (success && skill.moveId) {
      learnMove(pokemon.uid, skill.moveId);
    }
    setSelectedSkill(null);
  };

  const renderSkillNode = (skill: SkillNode, isLast: boolean) => {
    const isUnlocked = unlockedSkills.includes(skill.id);
    const checkResult = canUnlockSkill(skill, pokemon.level, unlockedSkills, battlePoints);
    const canUnlock = checkResult.canUnlock;
    const move = skill.moveId ? getMove(skill.moveId) : null;

    return (
      <div key={skill.id} className="flex items-center gap-2">
        <button
          className={`relative flex items-center gap-2 px-3 py-2 rounded-lg border transition-all w-full ${
            isUnlocked
              ? "bg-accent/20 border-accent text-accent"
              : canUnlock
                ? "bg-primary/10 border-primary/50 hover:border-primary cursor-pointer"
                : "bg-secondary/30 border-border/50 text-muted-foreground cursor-not-allowed"
          }`}
          onClick={() => !isUnlocked && setSelectedSkill(skill)}
        >
          <div className="w-5 h-5 flex items-center justify-center">
            {isUnlocked ? <Unlock className="w-3 h-3 text-accent" /> : <Lock className="w-3 h-3" />}
          </div>
          <div className="flex-1 text-left">
            <p className="text-xs font-medium">{skill.name}</p>
            <p className="text-[9px] text-muted-foreground">Lv.{skill.levelRequired} | {skill.pbCost} PB</p>
          </div>
          {skill.isPassive && <Star className="w-3 h-3 text-yellow-400" />}
        </button>
        {!isLast && <div className="w-4 h-0.5 bg-border" />}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Battle Stats Header */}
      <div className="flex items-center justify-between bg-secondary/50 rounded-lg p-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Battle Lv:</span>
          <span className="text-sm font-bold text-primary">{battleLevel}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">PB:</span>
          <span className="text-sm font-bold text-accent">{battlePoints}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">XP:</span>
          <span className="text-sm font-mono">{battleXp}/{nextLevelXp}</span>
        </div>
      </div>

      {/* Sword Path */}
      <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <Swords className="w-4 h-4 text-red-400" />
          <span className="text-xs font-bold text-red-400">SWORD PATH</span>
        </div>
        <div className="flex flex-col gap-1">
          {skillTree.swordPath.slice(0, 5).map((skill, i) => 
            renderSkillNode(skill, i === Math.min(4, skillTree.swordPath.length - 1))
          )}
        </div>
      </div>

      {/* Shield Path */}
      <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-green-400" />
          <span className="text-xs font-bold text-green-400">SHIELD PATH</span>
        </div>
        <div className="flex flex-col gap-1">
          {skillTree.shieldPath.slice(0, 5).map((skill, i) => 
            renderSkillNode(skill, i === Math.min(4, skillTree.shieldPath.length - 1))
          )}
        </div>
      </div>

      {/* Skill Detail Popup */}
      {selectedSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setSelectedSkill(null)}>
          <div className="bg-background border border-border rounded-xl p-4 w-full max-w-xs" onClick={(e) => e.stopPropagation()}>
            <h4 className="text-sm font-bold mb-2">{selectedSkill.name}</h4>
            <p className="text-xs text-muted-foreground mb-3">{selectedSkill.description}</p>
            <div className="flex justify-between text-xs mb-3">
              <span>Custo: <b className="text-primary">{selectedSkill.pbCost} PB</b></span>
              <span>Nivel: <b className={pokemon.level >= selectedSkill.levelRequired ? "text-accent" : "text-destructive"}>{selectedSkill.levelRequired}</b></span>
            </div>
            {(() => {
              const result = canUnlockSkill(selectedSkill, pokemon.level, unlockedSkills, battlePoints);
              return (
                <Button className="w-full" size="sm" disabled={!result.canUnlock} onClick={() => handleUnlockSkill(selectedSkill)}>
                  {result.canUnlock ? "Desbloquear" : result.reason}
                </Button>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

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
<DialogContent  className="bg-[#020617] border-border/40 text-slate-100 m sm:max-w-sm mx-auto  overflow-y-auto shadow-2xl rounded-t-3xl sm:rounded-3xl p-0 border-t-2">
  {/* Header Compacto */}
  <DialogHeader className="p-3 bg-gradient-to-b from-primary/10 to-transparent border-b border-white/5">
    <DialogTitle className="flex items-center justify-between text-lg font-black uppercase italic tracking-tighter">
      <span className=" max-w-[150px]">{pokemon.name}</span>
      <div className="flex items-center gap-1 bg-secondary/80 border border-white/10 px-2 py-0.5 rounded-lg shadow-lg">
        <span className="text-[8px] font-bold text-muted-foreground not-italic">LV.</span>
        <span className="text-base font-black text-primary not-italic">{level}</span>
      </div>
    </DialogTitle>
  </DialogHeader>

  <Tabs defaultValue="info" className="w-full">
    <TabsList className="flex w-full bg-black/40 p-1 rounded-none border-y border-white/5 h-10">
      {["info", "moves", "attrs", "history"].map((tab) => (
        <TabsTrigger
          key={tab}
          value={tab}
          style={{ fontSize: 9 }}
          className="flex-1 font-bold uppercase tracking-tighter data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-all h-full"
        >
          {tab === "history" ? <Swords size={16} /> : tab === "moves" ? "Golpes" : tab === "attrs" ? "Atrib." : "Info"}
        </TabsTrigger>
      ))}
    </TabsList>

    <div className="p-3">
      {/* Info Tab - Compacta */}
      <TabsContent value="info" className="mt-0 space-y-4">
        <div className="flex flex-col items-center relative py-2">
          <img
            src={getSpriteUrl(pokemon.speciesId) || "/placeholder.svg"}
            alt={pokemon.name}
            width={80}
            height={80}
            className="pixelated z-10 drop-shadow-md"
            crossOrigin="anonymous"
          />

          {/* XP Bar Slim */}
          <div className="w-full mt-2 bg-slate-900/60 border border-white/5 rounded-xl p-2.5">
            <div className="flex items-center justify-between mb-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">
              <span>Experiência</span>
              <span className="text-primary">{xp} / {xpNeeded}</span>
            </div>
            <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden p-[1px]">
              <div
                className="h-full bg-primary rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, (xp / xpNeeded) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Duplicates - Menor e mais direto */}
        {duplicateCount > 0 && (
          <div className="w-full rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-amber-400">
                <Users className="w-3.5 h-3.5" />
                <span className="text-[10px] font-black uppercase tracking-tighter">{duplicateCount} Duplicatas</span>
              </div>
              <span className="text-[10px] font-bold text-amber-300">+{estimatedXp} XP</span>
            </div>
            <Button
              size="sm"
              onClick={() => {
                const result = transferAllDuplicates(pokemon.speciesId, pokemon.uid);
                if (result.count > 0) {
                  setTransferResult({ pokemonName: pokemon.name, recipientName: pokemon.name, xpGained: result.totalXp, count: result.count });
                  setXpBarAnimProgress(100);
                }
              }}
              className="w-full h-8 bg-amber-600 hover:bg-amber-500 text-white font-black uppercase text-[9px]"
            >
              Transferir Tudo
            </Button>
          </div>
        )}

        {/* XP & Level - Grid Otimizado */}
        {xpLocked?"":
        <div className="space-y-2">
          <div className="grid grid-cols-4 gap-1">
            {[50, 100, 250, 500].map((val) => (
              <Button
                key={val}
                size="sm"
                onClick={() => addXp(pokemon.uid, val)}
                disabled={xpLocked}
                className="h-8 text-[9px] font-bold bg-slate-800 border-b-2 border-black"
              >
                +{val}
              </Button>
            ))}
          </div>
          <div className="flex gap-1">
            <Input
              type="number"
              placeholder="XP Custom"
              value={xpInput}
              onChange={(e) => setXpInput(e.target.value)}
              disabled={xpLocked}
              className="bg-black/40 border-white/5 h-8 text-[10px] flex-1"
            />
            <Button size="sm" onClick={() => { if (parseInt(xpInput) > 0) { addXp(pokemon.uid, parseInt(xpInput)); setXpInput(""); } }} disabled={xpLocked} className="h-8 bg-primary">
              <Plus className="w-3 h-3" />
            </Button>
          </div>
          <div className="flex gap-1">
            <Input
              type="number"
              placeholder="Definir Nível"
              value={levelInput}
              onChange={(e) => setLevelInput(e.target.value)}
              disabled={xpLocked}
              className="bg-black/40 border-white/5 h-8 text-[10px] flex-1"
            />
            <Button size="sm" onClick={() => { const val = parseInt(levelInput); if (val >= 1 && val <= 100) { setLevel(pokemon.uid, val); setLevelInput(""); } }} disabled={xpLocked} className="h-8 bg-indigo-600">
              <ArrowUp className="w-3 h-3" />
            </Button>
          </div>
        </div>
        }
        <Button
          variant="destructive"
          onClick={() => { /* sua logica */ }}
          className="w-full h-9 bg-red-600/10 border border-red-600/30 text-red-500 font-bold uppercase text-[9px]"
        >
          Liberar ao Professor
        </Button>
      </TabsContent>

      {/* Moves Tab - Grid 2 colunas compacto */}
      <TabsContent value="moves" className="mt-0">
        <div className="grid grid-cols-2 gap-2 mt-2">
          {Array.from(new Set([...pokemon.moves.map(m => m.moveId), ...pokemon.learnableMoves])).map(mId => {
            const moveDef = getMove(mId);
            if (!moveDef) return null;
            const isLearned = pokemon.moves.some(m => m.moveId === mId);
            const canLearnMore = pokemon.moves.length < 4;
            return (
              <button
                key={mId}
                disabled={!isLearned && !canLearnMore}
                onClick={() => isLearned ? forgetMove(pokemon.uid, mId) : learnMove(pokemon.uid, mId)}
                className={`p-2 rounded-xl border-2 text-left relative overflow-hidden transition-all ${
                  isLearned ? "bg-primary/20 border-primary shadow-sm" : "bg-slate-900/40 border-white/5"
                } ${(!isLearned && !canLearnMore) ? "opacity-30" : ""}`}
              >
                <div className="text-[7px] font-black uppercase px-1 rounded bg-black/50 inline-block mb-1 text-white" style={{ color: TYPE_COLORS[moveDef.type as PokemonType] }}>
                  {moveDef.type}
                </div>
                <div className="text-[10px] font-bold truncate text-white uppercase italic">{moveDef.name}</div>
              </button>
            );
          })}
        </div>
      </TabsContent>

      {/* Attributes Tab - Compacto */}
      <TabsContent value="attrs" className="mt-0 space-y-2">
        <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-3 flex justify-between items-center">
          <span className="text-[9px] font-black uppercase text-blue-400">Defesa AC</span>
          <span className="text-2xl font-black italic text-blue-400">{computeAttributes(pokemon.speciesId, level).defesa}</span>
        </div>
        {["velocidade", "felicidade", "resistencia", "acrobacia"].map((attr) => {
          const val = computeAttributes(pokemon.speciesId, level)[attr];
          return (
            <div key={attr} className="bg-slate-900/40 border border-white/5 rounded-xl p-2 flex items-center gap-3">
              <span className="text-[8px] font-black uppercase text-slate-500 w-16">{attr}</span>
              <div className="flex-1 h-1 bg-black rounded-full">
                <div className="h-full bg-primary/60 rounded-full" style={{ width: `${val * 10}%` }} />
              </div>
              <span className="text-[10px] font-mono font-bold w-4 text-right">{val}</span>
            </div>
          );
        })}
      </TabsContent>
    </div>
  </Tabs>

  {/* Overlay de Sucesso - Fullscreen Mobile */}
  <AnimatePresence>
    {transferResult && (
      <motion.div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
        <div className="text-center w-full max-w-[250px]">
          <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-lg font-black uppercase italic text-white mb-4">Transferido!</h3>
          <div className="bg-white/5 rounded-2xl p-4 mb-6">
            <p className="text-xs text-emerald-400 font-bold">+{transferResult.xpGained} XP</p>
          </div>
          <Button onClick={() => setTransferResult(null)} className="w-full bg-primary font-black uppercase text-xs">OK</Button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</DialogContent>
  );
}

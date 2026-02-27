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
<DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100 max-w-sm mx-auto h-[85vh] overflow-hidden flex flex-col p-0 gap-0 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
  
  {/* Header Decorativo Estilo Terminal */}
  <div className="bg-zinc-900/50 border-b border-zinc-800 p-3 flex justify-between items-center">
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 bg-red-500 animate-pulse rounded-full" />
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">System Trace: {pokemon.name}</span>
    </div>
  </div>

  <Tabs defaultValue="skills" className="flex-1 flex flex-col overflow-hidden">
    {/* Seleção de Abas Estilo Terminal */}
    <TabsList className="grid grid-cols-2 bg-zinc-900 rounded-none border-b border-zinc-800 h-10 p-0">
      <TabsTrigger value="skills" className="rounded-none text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-zinc-800 data-[state=active]:text-emerald-400">Skill Tree</TabsTrigger>
      <TabsTrigger value="info" className="rounded-none text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-zinc-800 data-[state=active]:text-emerald-400">Management</TabsTrigger>
    </TabsList>

    {/* ABA 1: ÁRVORE DE HABILIDADES */}
    <TabsContent value="skills" className="flex-1 m-0 overflow-y-auto custom-scrollbar">
      <SkillTreeTab pokemon={pokemon} />
    </TabsContent>

    {/* ABA 2: GERENCIAMENTO (XP, LVL, DUPLICATAS) */}
    <TabsContent value="info" className="flex-1 m-0 overflow-y-auto p-4 space-y-6 custom-scrollbar">
      <div className="space-y-4">
        
        {/* ================= DUPLICATES PANEL ================= */}
        {duplicateCount > 0 && (
          <div className="relative group overflow-hidden rounded-sm border border-amber-500/30 bg-amber-500/5 p-4 transition-all">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/10 to-transparent h-1/2 w-full -translate-y-full group-hover:animate-[scan_2s_linear_infinite]" />
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-500/20 rounded-sm">
                <Users className="w-4 h-4 text-amber-500" />
              </div>
              <span className="text-[11px] font-black text-amber-500 uppercase tracking-wider">
                {duplicateCount} Duplicata{duplicateCount > 1 ? 's' : ''} Detectada
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 mb-4">
              Otimização disponível: Converta para ganhar <span className="text-amber-400 font-bold">+{estimatedXp} XP</span>.
            </p>
            <Button
              onClick={() => {
                const result = transferAllDuplicates(pokemon.speciesId, pokemon.uid);
                if (result.count > 0) {
                  setTransferResult({
                    pokemonName: pokemon.name,
                    recipientName: pokemon.name,
                    xpGained: result.totalXp,
                    count: result.count,
                  });
                  setXpBarAnimProgress(100);
                }
              }}
              className="w-full bg-amber-600/20 border border-amber-600/50 text-amber-500 hover:bg-amber-600 hover:text-white text-[10px] font-black uppercase h-9"
            >
              <Send className="w-3 h-3 mr-2" /> Executar Transferência
            </Button>
          </div>
        )}

        {/* ================= XP MANAGEMENT ================= */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-[1px] flex-1 bg-zinc-800" />
            <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">XP Injection</span>
            <div className="h-[1px] flex-1 bg-zinc-800" />
          </div>

          {xpLocked && (
            <div className="bg-red-500/10 border border-red-500/30 p-2 text-center">
              <p className="text-[9px] text-red-400 font-bold uppercase">Manual Override Locked</p>
            </div>
          )}

          <div className="grid grid-cols-4 gap-2">
            {[50, 100, 250, 500].map((val) => (
              <button
                key={val}
                onClick={() => addXp(pokemon.uid, val)}
                disabled={xpLocked}
                className="py-2 text-[10px] font-black border border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-emerald-500 hover:text-emerald-400 disabled:opacity-20 uppercase"
              >
                +{val}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="CUSTOM XP"
              value={xpInput}
              onChange={(e) => setXpInput(e.target.value)}
              disabled={xpLocked}
              className="h-10 bg-zinc-900 border-zinc-800 text-zinc-100 text-[10px] font-bold"
            />
            <Button
              onClick={() => {
                const val = parseInt(xpInput);
                if (val > 0) { addXp(pokemon.uid, val); setXpInput(""); }
              }}
              disabled={xpLocked}
              className="bg-emerald-600 hover:bg-emerald-500 text-black font-black px-4"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* ================= LEVEL & SPECIALS ================= */}
        <div className="space-y-3 pt-2">
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="SET LEVEL"
              value={levelInput}
              onChange={(e) => setLevelInput(e.target.value)}
              disabled={xpLocked}
              className="h-10 bg-zinc-900 border-zinc-800 text-[10px] font-bold"
            />
            <Button
              onClick={() => {
                const val = parseInt(levelInput);
                if (val >= 1 && val <= 100) { setLevel(pokemon.uid, val); setLevelInput(""); }
              }}
              disabled={xpLocked}
              className="bg-blue-600 hover:bg-blue-500 text-white font-black px-4"
            >
              <ArrowUp className="w-4 h-4" />
            </Button>
          </div>

          {hasRareCandy && (
            <button
              onClick={() => useRareCandy(pokemon.uid)}
              className="w-full py-3 border border-emerald-500/50 bg-emerald-500/5 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-emerald-500/20"
            >
              <Sparkles className="w-3 h-3 animate-pulse" /> Utilizar Rare Candy
            </button>
          )}

          <button
            onClick={() => {
              const result = transferToProfesor(pokemon.uid);
              if (result.xpGained > 0 && result.recipientName) {
                setTransferResult({ pokemonName: pokemon.name, recipientName: result.recipientName, xpGained: result.xpGained });
                setXpBarAnimProgress(100);
              } else { onClose(); }
            }}
            className="w-full py-3 bg-zinc-900 border border-zinc-800 text-red-500/70 text-[10px] font-black uppercase tracking-widest hover:text-red-500"
          >
            Transferir ao Professor
          </button>
        </div>

        {/* ================= HUD XP DISPLAY ================= */}
        <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-sm">
          <div className="flex justify-between items-end mb-2">
            <div>
              <span className="text-[8px] text-zinc-500 font-black uppercase block tracking-tighter">Current Rank</span>
              <span className="text-xl font-black italic text-zinc-100">LV.{level}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-emerald-400">{xp} <span className="text-zinc-600">/</span> {xpNeeded}</span>
              <span className="text-[8px] text-zinc-500 block uppercase font-black">Data Progress</span>
            </div>
          </div>
          <div className="h-2 w-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-emerald-500 to-emerald-400 transition-all duration-700"
              style={{ width: `${Math.min(100, (xp / xpNeeded) * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </TabsContent>
  </Tabs>

  {/* ================= ANIMATION OVERLAY ================= */}
  <AnimatePresence>
    {transferResult && (
      <motion.div className="absolute inset-0 z-[100] bg-zinc-950/90 backdrop-blur-md flex items-center justify-center p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div className="w-full space-y-6 text-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="w-16 h-16 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full mx-auto flex items-center justify-center">
            <Send className="w-6 h-6 text-emerald-500" />
          </motion.div>
          <div className="space-y-1">
            <h2 className="text-sm font-black uppercase tracking-widest text-white">Transferência Concluída</h2>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-4 relative">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold text-zinc-400 uppercase">{transferResult.recipientName}</span>
              <span className="text-xs font-black text-emerald-400">+{transferResult.xpGained} XP</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-800">
              <motion.div className="h-full bg-emerald-500" initial={{ width: 0 }} animate={{ width: `${xpBarAnimProgress}%` }} transition={{ duration: 1.5 }} />
            </div>
          </div>
          <Button onClick={() => setTransferResult(null)} className="bg-transparent border border-zinc-800 text-zinc-500 hover:text-white text-[10px] font-black uppercase">Fechar Terminal</Button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</DialogContent>
  );
}

// ─── Skill Tree Tab Component ───────────────────────────────────────────────
import { TeamPokemon, battleXpForLevel } from "@/lib/game-store";
import { 
  generateSkillTree, 
  canUnlockSkill, 
  getUnlockedSkills,
  SkillNode, 
  SkillTree 
} from "@/lib/skill-tree-data";
import { POKEMON } from "@/lib/pokemon-data";

// Small hexagon node (28px)
function HexNode({ 
  skill, isUnlocked, canUnlockIt, isSword, onClick 
}: { 
  skill: SkillNode; isUnlocked: boolean; canUnlockIt: boolean; isSword: boolean; onClick: () => void;
}) {
  const color = isSword ? "#ef4444" : "#3b82f6";
  const glowShadow = isUnlocked ? `drop-shadow(0 0 5px ${color}cc)` : "none";

  return (
    <button 
      onClick={onClick} 
      className="flex flex-col items-center group relative outline-none"
    >
      {/* Container do Hexágono */}
      <div 
        className="relative w-11 h-12 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
        style={{ filter: glowShadow }}
      >
        {/* Borda Externa Neon */}
        <div 
          className="absolute inset-0 transition-colors duration-500"
          style={{
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            background: isUnlocked ? color : canUnlockIt ? "#52525b" : "#27272a",
          }}
        />
        
        {/* Fundo Interno (Cria o efeito de moldura) */}
        <div 
          className="absolute inset-[1.5px] bg-zinc-950 flex items-center justify-center"
          style={{
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          }}
        >
          {isUnlocked ? (
            <div className="relative flex items-center justify-center">
               {/* Ícone de fundo sutil */}
              <div className="absolute opacity-10 scale-150 rotate-12 uppercase font-black text-[8px] text-white">
                {skill.name.substring(0, 2)}
              </div>
              {/* Ponto de energia central */}
              <div 
                className="w-1.5 h-1.5 rounded-full animate-pulse z-10" 
                style={{ backgroundColor: color, boxShadow: `0 0 12px ${color}` }} 
              />
            </div>
          ) : (
            <Lock className={`w-3.5 h-3.5 ${canUnlockIt ? "text-zinc-400" : "text-zinc-800"}`} />
          )}
        </div>
      </div>

      {/* Label Box - Organização Limpa */}
      <div className="mt-2 text-center pointer-events-none">
        <div className={`text-[8px] font-black uppercase tracking-[0.08em] leading-tight transition-colors
          ${isUnlocked ? "text-zinc-100" : "text-zinc-600"}`}>
          {skill.name}
        </div>
        
        <div className="flex items-center justify-center gap-1 mt-0.5 opacity-80">
          <span className="text-[6px] font-bold text-zinc-500">LV.{skill.levelRequired}</span>
          <span className={`text-[7px] font-black px-1 rounded-sm
            ${canUnlockIt && !isUnlocked ? "bg-yellow-500/10 text-yellow-500" : "text-zinc-700"}`}>
            {skill.pbCost}PB
          </span>
        </div>
      </div>

      {/* Notificação de Upgrade Disponível */}
      {canUnlockIt && !isUnlocked && (
        <span className="absolute -top-1 -right-1 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
        </span>
      )}
    </button>
  );
}

function SkillTreeTab({ pokemon }: { pokemon: TeamPokemon }) {
  const { trainer, unlockPokemonSkill, learnMove } = useGameStore();
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);

  const species = POKEMON.find((p) => p.id === pokemon.speciesId);
  const skillTree: SkillTree = species 
    ? generateSkillTree(pokemon.speciesId, species.startingMoves, species.learnableMoves)
    : { speciesId: pokemon.speciesId, swordPath: [], shieldPath: [] };

  const battleLevel = trainer.battleLevel ?? 1;
  const battlePoints = trainer.battlePoints ?? 0;
  const battleXp = trainer.battleXp ?? 0;
  const nextLevelXp = battleXpForLevel(battleLevel + 1);
  const unlockedSkills = getUnlockedSkills(skillTree, pokemon.unlockedSkills ?? []);

  const handleUnlock = (skill: SkillNode) => {
    if (skill.isUnlockedByDefault) return;
    const result = canUnlockSkill(skill, pokemon.level, unlockedSkills, battlePoints);
    if (!result.canUnlock) return;
    const success = unlockPokemonSkill(pokemon.uid, skill.id, skill.pbCost);
    if (success && skill.moveId) learnMove(pokemon.uid, skill.moveId);
    setSelectedSkill(null);
  };

  const sw = skillTree.swordPath;
  const sh = skillTree.shieldPath;

const nodePositions = {
  // Lado SWORD (Vermelho)
  s0: { x: 30, y: 5 },   // Golpe 1
  s1: { x: 30, y: 28 },  // Golpe 2 (Alinhado verticalmente com o 1)
  s2: { x: 12, y: 55 },  // Golpe 3 (Base esquerda)
  s3: { x: 30, y: 55 },  // Golpe 4 (Base centro - logo abaixo do s1)
  s4: { x: 48, y: 55 },  // Golpe 5 (Base direita)

  // Lado SHIELD (Azul)
  h0: { x: 70, y: 5 },   // Golpe 1
  h1: { x: 70, y: 28 },  // Golpe 2
  h2: { x: 52, y: 55 },  // Golpe 3
  h3: { x: 70, y: 55 },  // Golpe 4
  h4: { x: 88, y: 55 },  // Golpe 5
};

const renderNode = (skill: SkillNode | undefined, pos: {x: number, y: number}, isSword: boolean) => {
  if (!skill) return null;
  const isUnlocked = skill.isUnlockedByDefault || unlockedSkills.includes(skill.id);
  const { canUnlock: canUnlockIt } = canUnlockSkill(skill, pokemon.level, unlockedSkills, battlePoints);

  return (
    <div className="z-20"> {/* Removido o absolute e o style de left/top */}
      <HexNode 
        skill={skill} 
        isUnlocked={isUnlocked} 
        canUnlockIt={canUnlockIt} 
        isSword={isSword} 
        onClick={() => setSelectedSkill(skill)} 
      />
    </div>
  );
};

  // Generate SVG lines between nodes
  const makeLine = (from: {x: number, y: number}, to: {x: number, y: number}, color: string) => (
    <g className="opacity-80">
      {/* Glow da linha (borrado) */}
      <line 
        x1={`${from.x}%`} y1={`${from.y}%`} 
        x2={`${to.x}%`} y2={`${to.y}%`} 
        stroke={color} 
        strokeWidth="3" 
        className="blur-[2px] opacity-30" 
      />
      {/* Núcleo da linha */}
      <line 
        x1={`${from.x}%`} y1={`${from.y}%`} 
        x2={`${to.x}%`} y2={`${to.y}%`} 
        stroke={color} 
        strokeWidth="1.5"
        className="transition-all duration-1000"
      />
    </g>
  );

  return (
<div className="flex flex-col h-full bg-zinc-950 text-zinc-100 font-sans overflow-hidden select-none">
  
  {/* ================= TRAINER HUD (Status Bar Compacta) ================= */}
  <div className="grid grid-cols-3 items-center gap-2 p-2 bg-zinc-900/90 border-b border-zinc-800 backdrop-blur-md">
    {/* XP Progress */}
    <div className="col-span-1 flex flex-col justify-center">
      <div className="flex justify-between items-end mb-0.5">
        <span className="text-[8px] font-black text-zinc-500 uppercase tracking-tighter">Battle XP</span>
        <span className="text-[8px] font-bold text-green-400">{(battleXp/nextLevelXp * 100).toFixed(0)}%</span>
      </div>
      <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden border border-white/5">
        <div 
          className="h-full bg-gradient-to-r from-green-600 to-emerald-400 transition-all duration-500" 
          style={{ width: `${(battleXp / nextLevelXp) * 100}%` }}
        />
      </div>
    </div>

    {/* Battle Level Badge */}
    <div className="flex flex-col items-center border-x border-zinc-800">
      <span className="text-[7px] text-zinc-500 uppercase font-black">Rank</span>
      <div className="flex items-center gap-1">
        <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.3)]">
          <span className="text-[10px] font-black text-blue-400">{battleLevel}</span>
        </div>
      </div>
    </div>

    {/* PB Points */}
    <div className="flex flex-col items-center">
      <span className="text-[7px] text-zinc-500 uppercase font-black">Disponível</span>
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 bg-red-500/20 border border-red-500/50 flex items-center justify-center shadow-[0_0_10px_rgba(239,68,68,0.3)]" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
          <span className="text-[10px] font-black text-red-400">{battlePoints}</span>
        </div>
        <span className="text-[9px] font-bold text-zinc-300">PB</span>
      </div>
    </div>
  </div>

  {/* ================= PATH SELECTION ================= */}
  <div className="flex text-center bg-zinc-900/50 border-b border-zinc-800">
    <div className="flex-1 py-2 bg-gradient-to-r from-red-500/10 to-transparent border-r border-zinc-800">
      <span className="text-[9px] font-black text-red-500 tracking-widest uppercase italic">Sword Path</span>
    </div>
    <div className="flex-1 py-2 bg-gradient-to-l from-blue-500/10 to-transparent">
      <span className="text-[9px] font-black text-blue-500 tracking-widest uppercase italic">Shield Path</span>
    </div>
  </div>
        {/* ================= TREE AREA (Com Fundo Colorido e Sub-Grid de 3 Colunas) ================= */}
<div className="relative flex-1 bg-zinc-950 overflow-hidden flex items-stretch select-none">
  
  {/* 1. Grid sutil de fundo (Camada mais baixa) */}
  <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-0" 
       style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
  
  {/* 2. GRADIENTES DE FUNDO (Cores das Laterais) */}
  {/* Glow Vermelho (Sword - Esquerda) */}
  <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-red-950/30 via-red-950/10 to-transparent pointer-events-none z-1" />
  {/* Glow Azul (Shield - Direita) */}
  <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-blue-950/30 via-blue-950/10 to-transparent pointer-events-none z-1" />

  {/* 3. POKEMON WATERMARK CENTRAL */}
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-2">
    <img
      src={getSpriteUrl(pokemon.speciesId)}
      alt=""
      className="w-40 h-40 object-contain opacity-10 blur-[1px] pixelated scale-[2]"
    />
  </div>

  {/* ================= CONTEÚDO (Z-index superior para ficar acima dos fundos) ================= */}

  {/* LADO SWORD (Esquerda - Vermelho) */}
  <div className="flex-1 flex flex-col items-center pt-8 border-r border-white/5 z-10 relative">
    {/* Borda Neon Sutil na Divisória (Opcional) */}
    <div className="absolute right-0 top-1/4 bottom-1/4 w-[1px] bg-gradient-to-b from-transparent via-red-500/20 to-transparent" />

    {/* Nível 1 e 2 alinhados verticalmente */}
    <div className="flex flex-col gap-12 items-center mb-12">
      {sw[0] && renderNode(sw[0], { x: 0, y: 0 }, true)}
      {sw[1] && renderNode(sw[1], { x: 0, y: 0 }, true)}
    </div>

    {/* Grid de 3 colunas para Golpe 3, 4 e 5 */}
    <div className="grid grid-cols-3 gap-4 px-2 w-full max-w-[280px]">
      <div className="flex justify-center">{sw[2] && renderNode(sw[2], { x: 0, y: 0 }, true)}</div>
      <div className="flex justify-center">{sw[3] && renderNode(sw[3], { x: 0, y: 0 }, true)}</div>
      <div className="flex justify-center">{sw[4] && renderNode(sw[4], { x: 0, y: 0 }, true)}</div>
    </div>
  </div>

  {/* LADO SHIELD (Direita - Azul) */}
  <div className="flex-1 flex flex-col items-center pt-8 z-10 relative">
    {/* Nível 1 e 2 alinhados verticalmente */}
    <div className="flex flex-col gap-12 items-center mb-12">
      {sh[0] && renderNode(sh[0], { x: 0, y: 0 }, false)}
      {sh[1] && renderNode(sh[1], { x: 0, y: 0 }, false)}
    </div>

    {/* Grid de 3 colunas para Golpe 3, 4 e 5 */}
    <div className="grid grid-cols-3 gap-4 px-2 w-full max-w-[280px]">
      <div className="flex justify-center">{sh[2] && renderNode(sh[2], { x: 0, y: 0 }, false)}</div>
      <div className="flex justify-center">{sh[3] && renderNode(sh[3], { x: 0, y: 0 }, false)}</div>
      <div className="flex justify-center">{sh[4] && renderNode(sh[4], { x: 0, y: 0 }, false)}</div>
    </div>
  </div>
</div>



  {/* ================= SKILL DETAIL MODAL (Cyber Look) ================= */}
  <AnimatePresence>
    {selectedSkill && (
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setSelectedSkill(null)}>
        <motion.div 
          initial={{ y: "100%" }} 
          animate={{ y: 0 }} 
          exit={{ y: "100%" }}
          className="bg-zinc-900 border-t-2 border-zinc-700 rounded-t-2xl p-4 w-full max-w-md relative overflow-hidden" 
          onClick={(e) => e.stopPropagation()}
        >
          {/* Decoração da Popup */}
          <div className={`absolute top-0 right-0 w-24 h-1 ${selectedSkill.path === "sword" ? "bg-red-600" : "bg-blue-600"}`} />
          
          <div className="flex items-start gap-4 mb-4">
            <div 
              className="w-12 h-14 flex items-center justify-center flex-shrink-0" 
              style={{ 
                clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)", 
                background: (selectedSkill.isUnlockedByDefault || unlockedSkills.includes(selectedSkill.id)) 
                  ? (selectedSkill.path === "sword" ? "#ef4444" : "#3b82f6") 
                  : "#27272a" 
              }}
            >
              {(selectedSkill.isUnlockedByDefault || unlockedSkills.includes(selectedSkill.id)) ? 
                <Unlock className="w-6 h-6 text-white" /> : <Lock className="w-6 h-6 text-zinc-500" />}
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-tight">{selectedSkill.name}</h4>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${selectedSkill.path === "sword" ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-500"}`}>
                    {selectedSkill.path === "sword" ? "Ofensivo" : "Estratégico"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-500 block uppercase font-bold tracking-tighter">Custo</span>
                  <span className="text-sm font-black text-yellow-500">{selectedSkill.pbCost} PB</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-3 mb-4">
            <p className="text-[11px] leading-relaxed text-zinc-400 italic">"{selectedSkill.description}"</p>
          </div>
          
          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-2 mb-5">
            <div className="bg-zinc-800/50 p-2 rounded flex justify-between items-center border border-zinc-700/30">
              <span className="text-[9px] text-zinc-500 uppercase font-bold">Nível Req.</span>
              <span className={`text-xs font-black ${pokemon.level >= selectedSkill.levelRequired ? "text-green-500" : "text-red-500"}`}>
                {selectedSkill.levelRequired}
              </span>
            </div>
            <div className="bg-zinc-800/50 p-2 rounded flex justify-between items-center border border-zinc-700/30">
              <span className="text-[9px] text-zinc-500 uppercase font-bold">Status Req.</span>
              <span className="text-xs font-black text-zinc-300">Pronto</span>
            </div>
          </div>
          
          {/* Action Button */}
          {(() => {
            const isAlreadyUnlocked = selectedSkill.isUnlockedByDefault || unlockedSkills.includes(selectedSkill.id);
            if (isAlreadyUnlocked) {
              return (
                <button className="w-full py-3 bg-zinc-800 rounded-xl text-zinc-500 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 cursor-default border border-zinc-700" disabled>
                  <Unlock className="w-4 h-4" /> Habilidade Ativa
                </button>
              );
            }
            
            const result = canUnlockSkill(selectedSkill, pokemon.level, unlockedSkills, battlePoints);
            return (
              <button 
                className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg
                  ${result.canUnlock ? "bg-white text-black shadow-white/10" : "bg-zinc-800 text-zinc-600 grayscale cursor-not-allowed"}`}
                disabled={!result.canUnlock} 
                onClick={() => handleUnlock(selectedSkill)}
              >
                {result.canUnlock ? (
                  <>Adquirir Golpe <span className="opacity-40">|</span> {selectedSkill.pbCost} PB</>
                ) : (
                  <><Lock className="w-4 h-4" /> {result.reason}</>
                )}
              </button>
            );
          })()}
          
          <button className="w-full py-3 mt-2 text-zinc-500 text-[10px] font-bold uppercase tracking-widest" onClick={() => setSelectedSkill(null)}>
            Voltar
          </button>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
</div>
  );
}


    // <div className="flex flex-col gap-2">
    //         {(() => {
    //           const history = [...(pokemon.battleHistory || [])].reverse();
    //           const victories = history.filter((h) => h.type === "victory").length;
    //           const faints = history.filter((h) => h.type === "faint").length;

    //           return (
    //             <>
    //               {/* Stats summary */}
    //               <div className="flex gap-3 mb-2">
    //                 <div className="flex-1 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2 text-center">
    //                   <Trophy className="w-4 h-4 text-amber-400 mx-auto mb-1" />
    //                   <span className="text-lg font-bold text-amber-400">{victories}</span>
    //                   <p className="text-[9px] text-muted-foreground">Vitorias</p>
    //                 </div>
    //                 <div className="flex-1 bg-red-500/10 border border-red-500/20 rounded-lg p-2 text-center">
    //                   <Skull className="w-4 h-4 text-red-400 mx-auto mb-1" />
    //                   <span className="text-lg font-bold text-red-400">{faints}</span>
    //                   <p className="text-[9px] text-muted-foreground">Derrotas</p>
    //                 </div>
    //               </div>

    //               {history.length === 0 ? (
    //                 <div className="flex flex-col items-center gap-2 py-6 text-center">
    //                   <Clock className="w-8 h-8 text-muted-foreground" />
    //                   <p className="text-sm text-muted-foreground">
    //                     Nenhum registro de batalha ainda.
    //                   </p>
    //                 </div>
    //               ) : (
    //                 <div className="flex flex-col gap-1.5 max-h-[200px] overflow-y-auto">
    //                   {history.map((entry) => {
    //                     const date = new Date(entry.date);
    //                     const formatted = `${date.toLocaleDateString("pt-BR")} ${date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
    //                     return (
    //                       <div
    //                         key={entry.id}
    //                         className={`flex items-center gap-2 rounded-lg p-2 text-xs ${
    //                           entry.type === "victory"
    //                             ? "bg-amber-500/10 border border-amber-500/20"
    //                             : "bg-red-500/10 border border-red-500/20"
    //                         }`}
    //                       >
    //                         {entry.type === "victory" ? (
    //                           <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
    //                         ) : (
    //                           <Skull className="w-3.5 h-3.5 text-red-400 shrink-0" />
    //                         )}
    //                         <div className="flex-1 min-w-0">
    //                           <span className="font-medium text-foreground">
    //                             {entry.type === "victory" ? "Vitoria" : "Desmaiou"}
    //                           </span>
    //                           {entry.xpGained && entry.xpGained > 0 && (
    //                             <span className="ml-1.5 text-amber-400 font-mono">+{entry.xpGained} XP</span>
    //                           )}
    //                         </div>
    //                         <span className="text-[9px] text-muted-foreground shrink-0">{formatted}</span>
    //                       </div>
    //                     );
    //                   })}
    //                 </div>
    //               )}
    //             </>
    //           );
    //         })()}
    //       </div>
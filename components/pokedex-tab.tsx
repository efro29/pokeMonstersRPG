"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { POKEMON, TYPE_COLORS, getSpriteUrl, getMove, getSpriteUrl2 } from "@/lib/pokemon-data";
import type { PokemonType } from "@/lib/pokemon-data";
import { useGameStore } from "@/lib/game-store";
import { useModeStore } from "@/lib/mode-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Plus, Check, Heart, Swords, Zap, HelpCircle, CircleDot, ArrowLeft, Crosshair } from "lucide-react";
import { playButtonClick, playPokedexRegister, playTabSwitch } from "@/lib/sounds";
import { ExplorationRadar } from "@/components/exploration-radar";
import { EggsTab } from "@/components/eggs-tab";
import { Egg } from "lucide-react";

// Generation definitions
const GENERATIONS = [
  {
    id: 1,
    name: "KANTO",
    label: "G1",
    range: [1, 151] as [number, number],
    color: "#3B82F6",
    icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png" // Squirtle
  },
  {
    id: 2,
    name: "JOHTO",
    label: "G2",
    range: [152, 251] as [number, number],
    color: "#2563EB",
    icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/158.png" // Totodile
  },
  {
    id: 3,
    name: "HOENN",
    label: "G3",
    range: [252, 386] as [number, number],
    color: "#0EA5E9",
    icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/258.png" // Mudkip
  },
  {
    id: 4,
    name: "SINNOH",
    label: "G4",
    range: [387, 493] as [number, number],
    color: "#38BDF8",
    icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/393.png" // Piplup
  },
  {
    id: 5,
    name: "UNOVA",
    label: "G5",
    range: [494, 649] as [number, number],
    color: "#14B8A6",
    icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/501.png" // Oshawott
  },
  {
    id: 6,
    name: "KALOS",
    label: "G6",
    range: [650, 721] as [number, number],
    color: "#06B6D4",
    icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/656.png" // Froakie
  },
  {
    id: 7,
    name: "ALOLA",
    label: "G7",
    range: [722, 809] as [number, number],
    color: "#0EA5E9",
    icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/728.png" // Popplio
  },
  {
    id: 8,
    name: "GALAR",
    label: "G8",
    range: [810, 905] as [number, number],
    color: "#1D4ED8",
    icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/816.png" // Sobble
  },
  {
    id: 9,
    name: "PALDEA",
    label: "G9",
    range: [906, 1009] as [number, number],
    color: "#0284C7",
    icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/912.png" // Quaxly
  },
];

function getGenForPokemon(pokemonId: number): number | null {
  for (const gen of GENERATIONS) {
    if (pokemonId >= gen.range[0] && pokemonId <= gen.range[1]) return gen.id;
  }
  return null;
}

function DonutChart({ discovered, total, color, size = 64 }: { discovered: number; total: number; color: string; size?: number }) {
  const pct = total > 0 ? discovered / total : 0;
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={6}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-foreground"
        fontSize={size > 56 ? 12 : 10}
        fontWeight={700}
      >
        {Math.round(pct * 100)}%
      </text>
    </svg>
  );
}

// Particle burst animation for reveal
function RevealParticles({ color }: { color: string }) {
  const particles = Array.from({ length: 14 }, (_, i) => {
    const angle = (i / 14) * Math.PI * 2;
    const dist = 60 + Math.random() * 30;
    return {
      id: i,
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      size: 4 + Math.random() * 4,
      delay: Math.random() * 0.15,
    };
  });

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{ width: p.size, height: p.size, backgroundColor: color }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.2 }}
          transition={{ duration: 0.7, delay: p.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

interface PokedexTabProps {
  onStartBattleWithPokemon?: (speciesId: number, level: number) => void;
  onStartCapture?: (speciesId: number) => void;
  onStartWildBattle?: (speciesId: number) => void;
}

type PokedexSubTab = "lista" | "radar" | "ovos";

export function PokedexTab({ onStartBattleWithPokemon, onStartCapture, onStartWildBattle }: PokedexTabProps = {}) {
  const [subTab, setSubTab] = useState<PokedexSubTab>("lista");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [discoverInput, setDiscoverInput] = useState("");
  const [discoverMessage, setDiscoverMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [battleLevel, setBattleLevel] = useState("5");
  const [activeGen, setActiveGen] = useState<number | null>(null);
  const [revealingId, setRevealingId] = useState<number | null>(null);
  const [discoverByNumber, setDiscoverByNumber] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("pokerpg-discover-by-number") === "true";
    }
    return false;
  });
  const { team, reserves, addToTeam } = useGameStore();
  const { mode, activeProfileId, discoveredPokemon, discoverPokemon, pendingPokedexReveal, clearPokedexReveal, triggerPokedexReveal } = useModeStore();

  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  // Listen for changes from settings
  useEffect(() => {
    const handler = () => {
      setDiscoverByNumber(localStorage.getItem("pokerpg-discover-by-number") === "true");
    };
    window.addEventListener("pokerpg-discover-toggle", handler);
    return () => window.removeEventListener("pokerpg-discover-toggle", handler);
  }, []);

  const isTrainerMode = mode === "trainer";
  const discovered = activeProfileId ? (discoveredPokemon[activeProfileId] || []) : [];

  // Handle pending reveal animation
  useEffect(() => {
    if (!pendingPokedexReveal || !isTrainerMode) return;

    const pokemonId = pendingPokedexReveal.pokemonId;
    const targetGen = getGenForPokemon(pokemonId);

    // Switch sub-tab to lista
    setSubTab("lista");
    setSearch("");

    // Navigate to the correct generation
    if (targetGen !== null) {
      setActiveGen(targetGen);
    }

    // Start the reveal after a short delay for the gen to render
    const timer = setTimeout(() => {
      setRevealingId(pokemonId);
      playPokedexRegister();

      // Scroll to the card
      requestAnimationFrame(() => {
        const cardEl = cardRefs.current[pokemonId];
        if (cardEl) {
          cardEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      });

      // End animation after duration
      setTimeout(() => {
        setRevealingId(null);
        clearPokedexReveal();
      }, 2200);
    }, 400);

    return () => clearTimeout(timer);
  }, [pendingPokedexReveal, isTrainerMode, clearPokedexReveal]);

  // Filter pokemon by active generation
  const genRange = activeGen !== null ? GENERATIONS.find((g) => g.id === activeGen) : null;

  const basePokemon = genRange
    ? POKEMON.filter((p) => p.id >= genRange.range[0] && p.id <= genRange.range[1])
    : POKEMON;

  // In trainer mode, show ALL pokemon (discovered + undiscovered)
  // Search only matches discovered pokemon by name, or any by number
  const filtered = search
    ? basePokemon.filter(
      (p) => {
        const isDiscovered = discovered.includes(p.id);
        const matchesNumber = p.id.toString().includes(search) || `#${String(p.id).padStart(3, "0")}`.includes(search);
        const matchesName = isDiscovered && p.name.toLowerCase().includes(search.toLowerCase());
        return matchesNumber || matchesName;
      }
    )
    : basePokemon;

  const selectedPokemon = selectedId ? POKEMON.find((p) => p.id === selectedId) : null;
  const isInTeam = (id: number) => team.some((t) => t.speciesId === id) || reserves.some((t) => t.speciesId === id);
  const teamFull = team.length >= 6;

  const handleDiscover = () => {
    const num = parseInt(discoverInput);
    if (isNaN(num) || num < 1 || num > 493) {
      setDiscoverMessage({ text: "Numero invalido! Digite entre 1 e 493.", type: "error" });
      setTimeout(() => setDiscoverMessage(null), 3000);
      return;
    }

    const pokemon = POKEMON.find((p) => p.id === num);
    if (!pokemon) {
      setDiscoverMessage({ text: "Pokemon nao encontrado!", type: "error" });
      setTimeout(() => setDiscoverMessage(null), 3000);
      return;
    }

    if (discovered.includes(num)) {
      setDiscoverMessage({ text: `${pokemon.name} ja foi descoberto!`, type: "error" });
      setTimeout(() => setDiscoverMessage(null), 3000);
      return;
    }

    discoverPokemon(num);
    triggerPokedexReveal(num);
    setDiscoverMessage({ text: `${pokemon.name} foi adicionado a Pokedex!`, type: "success" });
    setDiscoverInput("");
    setTimeout(() => setDiscoverMessage(null), 3000);
  };

  // Count discovered per generation
  const genStats = GENERATIONS.map((gen) => {
    const total = gen.range[1] - gen.range[0] + 1;
    const disc = isTrainerMode
      ? discovered.filter((id) => id >= gen.range[0] && id <= gen.range[1]).length
      : POKEMON.filter((p) => p.id >= gen.range[0] && p.id <= gen.range[1]).length;
    return { ...gen, total, discovered: disc };
  });

  return (
    <div className="flex flex-col h-full">
      {/* Sub-tab switcher */}
      {isTrainerMode && (
        <div className="grid grid-cols-3 gap-0 bg-[#0a0a0c] p-1 border-b-2 border-white/5">
          {([
            { id: "lista" as PokedexSubTab, label: "Pokedex", icon: <Search className="w-3.5 h-3.5" />, color: "#3B82F6" },
            { id: "radar" as PokedexSubTab, label: "Radar", icon: <Crosshair className="w-3.5 h-3.5" />, color: "#22C55E" },
            { id: "ovos" as PokedexSubTab, label: "Ovos", icon: <Egg className="w-3.5 h-3.5" />, color: "#EAB308" },
          ]).map(({ id, label, icon, color }) => {
            const isActive = subTab === id;

            return (
              <button
                key={id}
                onClick={() => { playTabSwitch(); setSubTab(id); }}
                className={`
                relative flex items-center justify-center gap-2 py-3 px-1
                text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300
                ${isActive ? "text-white" : "text-white/30 hover:text-white/60"}
              `}
                style={{
                  /* Corte diagonal Cyberpunk nas pontas do grid */
                  clipPath: id === 'lista'
                    ? 'polygon(0 0, 100% 0, 100% 100%, 15% 100%, 0 75%)'
                    : id === 'ovos'
                      ? 'polygon(0 0, 100% 0, 85% 75%, 85% 100%, 0 100%)'
                      : 'none',
                  backgroundColor: isActive ? `${color}20` : 'transparent',
                }}
              >
                {/* EFEITO DE SCANLINE NO ATIVO */}
                {isActive && (
                  <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_2px]" />
                )}

                {/* ÍCONE COM GLOW */}
                <span className={isActive ? "drop-shadow-[0_0_5px_currentColor]" : ""} style={{ color: isActive ? color : 'inherit' }}>
                  {icon}
                </span>

                {/* LABEL */}
                <span className="relative z-10">{label}</span>

                {/* INDICADOR DE BORDA NEON (FOOTER) */}
                <div
                  className={`absolute bottom-0 left-0 h-[3px] transition-all duration-500 ${isActive ? "w-full" : "w-0"}`}
                  style={{
                    backgroundColor: color,
                    boxShadow: `0 -4px 10px ${color}88`
                  }}
                />

                {/* DETALHE TÉCNICO (CANTO) */}
                {isActive && (
                  <div
                    className="absolute top-1 right-1 w-1 h-1 rounded-full animate-pulse"
                    style={{ backgroundColor: color }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Eggs tab */}
      {isTrainerMode && subTab === "ovos" ? (
        <div className="flex-1 overflow-y-auto">
          <EggsTab />
        </div>
      ) : /* Radar tab */
        isTrainerMode && subTab === "radar" ? (
          <ExplorationRadar onStartCapture={onStartCapture} onStartWildBattle={onStartWildBattle} />
        ) : (
          <>
            {/* Header area */}
            <div className="p-3 border-b border-border flex flex-col gap-2">
              {/* Discover input - only for trainer mode when unlocked in settings */}
              {isTrainerMode && discoverByNumber && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <HelpCircle className="w-3 h-3" />
                    Descobrir Pokemon pelo numero
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Ex: 34"
                      value={discoverInput}
                      onChange={(e) => setDiscoverInput(e.target.value)}
                      className="bg-secondary border-border text-foreground flex-1 h-8 text-sm"
                      min={1}
                      max={493}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleDiscover();
                      }}
                    />
                    <Button
                      onClick={handleDiscover}
                      disabled={!discoverInput}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 h-8 text-xs"
                    >
                      <Search className="w-3.5 h-3.5 mr-1" />
                      Descobrir
                    </Button>
                  </div>
                  {discoverMessage && (
                    <p
                      className="text-xs font-medium px-2 py-1.5 rounded-lg"
                      style={{
                        backgroundColor: discoverMessage.type === "success" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                        color: discoverMessage.type === "success" ? "#22C55E" : "#EF4444",
                      }}
                    >
                      {discoverMessage.text}
                    </p>
                  )}
                </div>
              )}

              {/* <p className="text-[10px] text-muted-foreground">
              {isTrainerMode
                ? `${discovered.length}/493 Descobertos - Equipe: ${team.length}/6 - Reservas: ${reserves.length}`
                : `${POKEMON.length} Pokemon - Equipe: ${team.length}/6 - Reservas: ${reserves.length}`}
            </p> */}
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => { setActiveGen(null); setSearch(""); }}
                  className="h-7 px-2 text-muted-foreground hover:text-foreground hover:bg-secondary"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-1.5">
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: genRange?.color, color: "#fff" }}
                  >
                    {genRange?.label}
                  </span>
                  <span className="text-sm font-semibold text-foreground">{genRange?.name}</span>
                </div>
                <div className="relative flex-1 ml-2">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Buscar..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-7 h-7 bg-secondary border-border text-foreground text-xs"
                  />
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1" ref={scrollAreaRef}>
              {activeGen === null ? (
                /* Generation selection cards */
                <div className="grid grid-cols-2 gap-3 p-2 bg-[#020203]">
                  {genStats.map((gen) => (
                    <button
                      key={gen.id}
                      onClick={() => setActiveGen(gen.id)}
                      className="relative flex items-center h-16 w-full p-0 transition-all duration-300 group border border-white/5 hover:border-white/10"
                      style={{
                        background: `linear-gradient(90deg, #0d0d0f 0%, ${gen.color}05 100%)`,
                        clipPath: 'polygon(0 0, 96% 0, 100% 15%, 100% 100%, 4% 100%, 0 85%)',
                      }}
                    >
                      {/* BARRA LATERAL NEON INDICADORA */}
                      <div
                        className="w-1 h-full shrink-0 opacity-80"
                        style={{
                          backgroundColor: gen.color,
                          boxShadow: `0 0 12px ${gen.color}`
                        }}
                      />

                      {/* 1. SÍMBOLO TÁTICO (Representando a Geração/Região) */}
                      <div className="relative flex items-center justify-center w-14 h-full shrink-0 bg-black/60 border-r border-white/5">
                        {/* Frame de Mira (Cantoneiras) */}
                        <div className="absolute inset-2 border border-white/10" />
                        <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l" style={{ borderColor: gen.color }} />
                        <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r" style={{ borderColor: gen.color }} />

                        {/* Sigla da Geração (Baseada no ID ou Label) */}
                        <div className="flex flex-col items-center leading-none">
                          <span className="text-[8px] font-mono opacity-40 text-white">{gen.name}</span>
                          <span
                            className="text-xl font-black italic tracking-tighter"
                            style={{
                              color: gen.color,
                              textShadow: `0 0 10px ${gen.color}aa`
                            }}
                          >
                            {/* Pega apenas o número do ID ou o primeiro caractere do label */}
                            {String(gen.id).replace(/\D/g, "") || gen.label.charAt(0)}

                          </span>
                        </div>
                      </div>



                      {/* 3. MÓDULO DE SINCRONIZAÇÃO (Progresso) */}
                      <div className="flex items-center gap-2 px-3 h-full bg-white/[0.02]">
                        <div className="flex flex-col items-end">

                          <img
                            src={gen.icon}
                            alt={gen.name}
                            width={100}
                            height={100}
                            /* Mudei a drop-shadow para azul claro e adicionei opacity-80 
                              para que o azul não fique muito agressivo.
                            */
                            className="pixelated drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] opacity-80 group-hover:rotate-12 group-hover:scale-110 group-hover:opacity-100 transition-all duration-300"
                            style={{
                              /* A mágica acontece aqui:
                                1. grayscale(1) -> Remove as cores originais.
                                2. brightness(0.8) -> Escurece um pouco para o azul aparecer melhor.
                                3. sepia(1) -> Transforma em tons de marrom/sépia (necessário para o hue-rotate funcionar).
                                4. hue-rotate(190deg) -> Rotaciona a cor do sépia para um tom de azul-ciano (190-210 graus é a faixa do azul).
                              */
                              filter: 'grayscale(1) brightness(0.8) sepia(1) hue-rotate(190deg)',
                              imageRendering: "pixelated", // Garante que continue pixelado se você não usar a classe.
                            }}
                            crossOrigin="anonymous"
                          />

                        </div>

                        <div className="relative shrink-0 scale-90">
                          <DonutChart
                            discovered={gen.discovered}
                            total={gen.total}
                            color={gen.color}
                            size={40}
                          />
                          <span className="text-[7px] font-mono text-white/30 ">
                            {String(gen.range[0]).padStart(3, "0")} ~ {String(gen.range[1]).padStart(3, "0")}
                          </span>
                        </div>
                      </div>

                      {/* OVERLAY DE RUÍDO/SCANLINE */}
                      <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_2px]" />

                    </button>
                  ))}
                </div>
              ) : (

                /* Pokemon grid for selected generation */
                <div className="flex flex-col">
                  {/* Back button + search */}
                  {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-6 gap-3">
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                      >
                        <HelpCircle className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground text-center">
                        Nenhum Pokemon encontrado.
                      </p>
                    </div>
                  ) : (
<div className="grid grid-cols-4 gap-2 p-1 bg-[#020203]">
  {filtered.map((pokemon) => {
    const isDiscovered = !isTrainerMode || discovered.includes(pokemon.id);
    const isRevealing = revealingId === pokemon.id;
    const inTeam = isInTeam(pokemon.id);
    const mainType = pokemon.types[0];
    const mainColor = TYPE_COLORS[mainType];

    // 1. CARD NÃO DESCOBERTO (ESTILO CRIPTOGRAFADO)
    if (!isDiscovered && !isRevealing) {
      return (
        <div
          key={pokemon.id}
          ref={(el) => { cardRefs.current[pokemon.id] = el; }}
          className="relative flex flex-col items-center justify-center h-40 rounded-lg border border-white/5 bg-neutral-950/50 overflow-hidden"
          style={{ clipPath: 'polygon(0 0, 85% 0, 100% 15%, 100% 100%, 0 100%)' }}
        >
          <div className="absolute top-1 left-1 font-mono text-[8px] text-white/20">
            #{String(pokemon.id).padStart(3, "0")}
          </div>
          <HelpCircle className="w-6 h-6 text-white/10" />
          <div className="mt-2 h-1 w-12 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-white/10 animate-[loading_2s_infinite]" style={{ width: '30%' }} />
          </div>
          <span className="mt-1 font-mono text-[7px] text-white/10 tracking-widest uppercase">Locked</span>
        </div>
      );
    }

    // 2. CARD REVELANDO (ANIMAÇÃO DE SCAN)
// 2. CARD REVELANDO (ANIMAÇÃO DE SCAN TÁTICO)
if (isRevealing) {
  return (
    <div
      key={pokemon.id}
      ref={(el) => { cardRefs.current[pokemon.id] = el; }}
      className="relative flex flex-col items-center justify-center h-40 rounded-lg border-2 overflow-hidden z-50 bg-black"
      style={{ 
        borderColor: mainColor,
        boxShadow: `0 0 30px ${mainColor}aa, inset 0 0 20px ${mainColor}44`,
      }}
    >
      {/* 1. FLASH DE ENTRADA (OVERLAY) */}
      <motion.div 
        className="absolute inset-0 z-50 bg-white"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />

      {/* 2. LINHA DE SCAN LASER */}
      <motion.div 
        className="absolute left-0 right-0 z-30 h-[2px] shadow-[0_0_15px_2px_currentColor]"
        style={{ color: mainColor, backgroundColor: mainColor }}
        initial={{ top: "0%" }}
        animate={{ top: "100%" }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      />

      {/* 3. PARTÍCULAS E GRID DE FUNDO */}
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] animate-pulse" />
      <RevealParticles color={mainColor} />

      {/* 4. SPRITE COM EFEITO DE "MATERIALIZAÇÃO" */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0, filter: 'brightness(2) contrast(2)' }}
        animate={{ scale: 1.1, opacity: 1, filter: 'brightness(1) contrast(1)' }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-10"
      >
        <img
          src={getSpriteUrl2(pokemon.id)}
          alt={pokemon.name}
          className="w-20 h-20 pixelated drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
          crossOrigin="anonymous"
        />
      </motion.div>

      {/* 5. TEXTO DE REGISTRO (GLITCH) */}
      <div className="absolute bottom-2 left-0 right-0 flex flex-col items-center z-20">
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0, 1] }}
          transition={{ duration: 0.2, repeat: 5 }}
          className="font-mono text-[8px] font-black tracking-[0.2em] text-white uppercase"
        >
          Analyzing DNA...
        </motion.span>
        <div className="w-16 h-0.5 mt-1 bg-white/20 rounded-full overflow-hidden">
          <motion.div 
            className="h-full" 
            style={{ backgroundColor: mainColor }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5 }}
          />
        </div>
      </div>

      {/* 6. OVERLAY DE RUÍDO DIGITAL */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://media.giphy.com/media/oEI9uWUicKgH6/giphy.gif')] mix-blend-screen" />
    </div>
  );
}

    // 3. CARD DESCOBERTO (ESTILO TÁTICO HUD)
    return (
      <button
        key={pokemon.id}
        ref={(el) => { cardRefs.current[pokemon.id] = el as unknown as HTMLDivElement; }}
        onClick={() => setSelectedId(pokemon.id)}
        className="relative flex flex-col items-center h-40 w-full p-0 transition-all duration-300 group overflow-hidden border-b"
        style={{
          backgroundColor: '#0a0a0c',
          borderColor: `${mainColor}66`,
          clipPath: 'polygon(0 0, 88% 0, 100% 12%, 100% 100%, 0 100%)',
        }}
      >
        {/* Camada de Scanlines decorativa */}
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(transparent_50%,black_50%)] bg-[size:100%_2px]" />

        {/* Top Header: ID e Team Indicator */}
        <div className="relative z-10 w-full flex justify-between items-start">
          <span className="font-mono text-[9px] font-black px-1.5 py-0.5 rounded-br" 
                style={{ backgroundColor: mainColor, color: '#000' }}>
            #{String(pokemon.id).padStart(3, "0")}
          </span>
          {inTeam && (
            <div className="mr-1 mt-1 flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_5px_currentColor]" style={{ color: mainColor, backgroundColor: 'currentColor' }} />
            </div>
          )}
        </div>

        {/* Sprite: Com brilho neon de fundo */}
        <div className="relative flex-1 flex items-center justify-center w-full min-h-0">
          <div 
            className="absolute w-12 h-12 blur-xl opacity-20 group-hover:opacity-50 transition-opacity duration-500"
            style={{ backgroundColor: mainColor }}
          />
          <img
            src={getSpriteUrl2(pokemon.id)}
            alt={pokemon.name}
            className="relative z-10 pixelated w-16 h-16 group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]"
            crossOrigin="anonymous"
            loading="lazy"
          />
        </div>

        {/* Footer: Nome e Tipos Simplificados */}
        <div className="relative z-10 w-full bg-black/60 p-1.5 border-t border-white/5">
          <h3 className="text-[9px] font-black text-white uppercase truncate tracking-tight mb-1">
            {pokemon.name}
          </h3>
          <div className="flex gap-0.5">
            {pokemon.types.map((t) => (
              <span
                key={t}
                className="text-[6px] px-1 py-[1px] rounded-[1px] font-bold border"
                style={{
                  borderColor: `${TYPE_COLORS[t]}44`,
                  color: TYPE_COLORS[t],
                  backgroundColor: `${TYPE_COLORS[t]}11`,
                }}
              >
                {t.substring(0, 3).toUpperCase()}
              </span>
            ))}
          </div>
        </div>

        {/* Borda lateral direita tática */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-1/2 opacity-30" style={{ backgroundColor: mainColor }} />
      </button>
    );
  })}
</div>
                  )}
                </div>

              )}
            </ScrollArea>

            {/* Detail dialog - only show for discovered pokemon */}
            <Dialog open={!!selectedPokemon} onOpenChange={() => setSelectedId(null)}>
              {selectedPokemon && (
                <DialogContent
                  className="bg-[#050505] border-0 text-white max-w-[340px] mx-auto overflow-hidden p-0 shadow-2xl"
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 100% 96%, 92% 100%, 0 100%)",
                    boxShadow: `0 0 30px ${TYPE_COLORS[selectedPokemon.types[0]]}22`
                  }}
                >
                  {/* HEADER COMPACTO */}
                  <div
                    className="relative p-3 border-b border-white/5"
                    style={{ background: `linear-gradient(90deg, ${TYPE_COLORS[selectedPokemon.types[0]]}15 0%, transparent 100%)` }}
                  >
                    <DialogHeader>
                      <DialogTitle className="flex flex-col">
                        <span className="text-[8px] font-mono text-white/30 tracking-[0.2em] uppercase">
                          Análise de Espécime // ID_{String(selectedPokemon.id).padStart(3, "0")}
                        </span>
                        <span className="text-xl font-black italic uppercase tracking-tight text-white">
                          {selectedPokemon.name}
                        </span>
                      </DialogTitle>
                    </DialogHeader>
                  </div>

                  <div className="p-4 flex flex-col gap-4">
                    {/* ÁREA DO SPRITE (REDUZIDA) */}
                    <div className="relative w-full h-32 flex items-center justify-center bg-white/[0.02] border border-white/5">
                      {/* Radar de fundo sutil */}
                      <div className="absolute w-24 h-24 border border-dashed border-white/10 rounded-full animate-spin-slow" />

                      <img
                        src={getSpriteUrl2(selectedPokemon.id)}
                        alt={selectedPokemon.name}
                        width={80}
                        height={80}
                        className="relative z-10 pixelated drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                        crossOrigin="anonymous"
                      />

                      {/* HP INDICATOR */}
                      <div className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-black/60 px-2 py-0.5 border border-white/10">
                        <Heart className="w-2.5 h-2.5 text-red-500 fill-red-500" />
                        <span className="font-mono text-[10px] font-bold">{selectedPokemon.baseHp} <span className="text-[7px] opacity-40">HP</span></span>
                      </div>
                    </div>

                    {/* TIPOS */}
                    <div className="flex gap-1.5 justify-center">
                      {selectedPokemon.types.map((t) => (
                        <div
                          key={t}
                          className="px-2 py-0.5 text-[8px] font-black uppercase tracking-widest border"
                          style={{
                            backgroundColor: `${TYPE_COLORS[t]}10`,
                            color: TYPE_COLORS[t],
                            borderColor: `${TYPE_COLORS[t]}44`
                          }}
                        >
                          {t}
                        </div>
                      ))}
                    </div>

                    {/* LISTA DE ATAQUES (MAIS COMPACTA) */}
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-white/30 uppercase font-bold text-[8px] tracking-wider">
                          <Swords className="w-2.5 h-2.5" />
                          <span>Protocolos de Ataque</span>
                        </div>

                        <div className="grid grid-cols-1 gap-1">
                          {selectedPokemon.startingMoves.slice(0, 4).map((mId) => {
                            const move = getMove(mId);
                            if (!move) return null;
                            return (
                              <div key={mId} className="flex items-center justify-between bg-white/[0.03] px-2 py-1 border border-white/5">
                                <span className="text-[9px] font-bold text-white/70 uppercase">{move.name}</span>
                                {move.power > 0 && (
                                  <span className="text-[9px] font-mono text-white/30">{move.power} PWR</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* AÇÕES (BOTÕES EM GRADE SE NECESSÁRIO) */}
                    <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
                      {isInTeam(selectedPokemon.id) ? (
                        <div className="py-2 text-center border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[9px] font-black uppercase italic tracking-widest">
                          UNIDADE REGISTRADA NA EQUIPE
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            addToTeam(selectedPokemon);
                            setSelectedId(null);
                          }}
                          className="w-full py-2 bg-white text-black font-black uppercase italic text-[10px] tracking-wider hover:bg-emerald-400 transition-colors"
                          style={{ clipPath: "polygon(3% 0, 100% 0, 97% 100%, 0 100%)" }}
                        >
                          {teamFull ? "+ Enviar para Reserva" : "+ Alocar na Equipe"}
                        </button>
                      )}

                      {/* ÁREA DE CAPTURA/BATALHA */}
                      <div className="flex flex-col gap-1.5">
                        {isTrainerMode && onStartCapture && (
                          <button
                            onClick={() => {
                              onStartCapture(selectedPokemon.id);
                              setSelectedId(null);
                            }}
                            className="py-1.5 border border-red-500/50 text-red-500 font-bold text-[9px] uppercase hover:bg-red-500 hover:text-white transition-all"
                          >
                            Iniciar Sequência de Captura
                          </button>
                        )}

                        {onStartBattleWithPokemon && (
                          <div className="flex gap-1.5 mt-1">
                            <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-2 h-8">
                              <span className="text-[8px] font-mono text-white/30">LV</span>
                              <input
                                type="number"
                                value={battleLevel}
                                onChange={(e) => setBattleLevel(e.target.value)}
                                className="bg-transparent border-0 text-white font-mono text-[10px] w-8 p-0 focus:ring-0"
                              />
                            </div>
                            <button
                              onClick={() => {
                                const lv = parseInt(battleLevel) || 5;
                                onStartBattleWithPokemon(selectedPokemon.id, Math.min(100, Math.max(1, lv)));
                                setSelectedId(null);
                              }}
                              className="flex-1 bg-red-600 text-white text-[9px] font-black uppercase hover:bg-red-500 transition-colors"
                            >
                              Simulação de Combate
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              )}
            </Dialog>
          </>
        )}
    </div>
  );
}

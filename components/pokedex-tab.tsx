"use client";

import { useState } from "react";
import { POKEMON, TYPE_COLORS, getSpriteUrl, getMove } from "@/lib/pokemon-data";
import type { PokemonType } from "@/lib/pokemon-data";
import { useGameStore } from "@/lib/game-store";
import { useModeStore } from "@/lib/mode-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Plus, Check, Heart, Swords, Zap, HelpCircle, CircleDot, ArrowLeft } from "lucide-react";
import { playButtonClick, playGift } from "@/lib/sounds";

// Generation definitions
const GENERATIONS = [
  { id: 1, name: "KANTO", label: "G1", range: [1, 151] as [number, number], color: "#EF4444", icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/6.svg" },
  { id: 2, name: "JOHTO", label: "G2", range: [152, 251] as [number, number], color: "#3B82F6", icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/249.svg" },
  { id: 3, name: "HOENN", label: "G3", range: [252, 275] as [number, number], color: "#22C55E", icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/254.svg" },
];

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

interface PokedexTabProps {
  onStartBattleWithPokemon?: (speciesId: number, level: number) => void;
  onStartCapture?: (speciesId: number) => void;
}

export function PokedexTab({ onStartBattleWithPokemon, onStartCapture }: PokedexTabProps = {}) {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [discoverInput, setDiscoverInput] = useState("");
  const [discoverMessage, setDiscoverMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [battleLevel, setBattleLevel] = useState("5");
  const [activeGen, setActiveGen] = useState<number | null>(null);
  const { team, reserves, addToTeam } = useGameStore();
  const { mode, activeProfileId, discoveredPokemon, discoverPokemon } = useModeStore();

  const isTrainerMode = mode === "trainer";
  const discovered = activeProfileId ? (discoveredPokemon[activeProfileId] || []) : [];

  // Filter pokemon by active generation
  const genRange = activeGen !== null ? GENERATIONS.find((g) => g.id === activeGen) : null;

  const basePokemon = genRange
    ? POKEMON.filter((p) => p.id >= genRange.range[0] && p.id <= genRange.range[1])
    : POKEMON;

  const availablePokemon = isTrainerMode
    ? basePokemon.filter((p) => discovered.includes(p.id))
    : basePokemon;

  const filtered = search
    ? availablePokemon.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.id.toString().includes(search)
      )
    : availablePokemon;

  const selectedPokemon = selectedId ? POKEMON.find((p) => p.id === selectedId) : null;
  const isInTeam = (id: number) => team.some((t) => t.speciesId === id) || reserves.some((t) => t.speciesId === id);
  const teamFull = team.length >= 6;

  const handleDiscover = () => {
    const num = parseInt(discoverInput);
    if (isNaN(num) || num < 1 || num > 275) {
      setDiscoverMessage({ text: "Numero invalido! Digite entre 1 e 275.", type: "error" });
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
    playGift();
    setDiscoverMessage({ text: `${pokemon.name} foi adicionado a Pokedex!`, type: "success" });
    setDiscoverInput("");
    setTimeout(() => setDiscoverMessage(null), 3000);

    // Auto-open the modal for the discovered pokemon
    setSelectedId(num);
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
      {/* Header area */}
      <div className="p-3 border-b border-border flex flex-col gap-2">
        {/* Discover input - only for trainer mode */}
        {isTrainerMode && (
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
                max={275}
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

        <p className="text-[10px] text-muted-foreground">
          {isTrainerMode
            ? `${discovered.length}/275 Descobertos - Equipe: ${team.length}/6 - Reservas: ${reserves.length}`
            : `${POKEMON.length} Pokemon - Equipe: ${team.length}/6 - Reservas: ${reserves.length}`}
        </p>
      </div>

      <ScrollArea className="flex-1">
        {activeGen === null ? (
          /* Generation selection cards */
          <div className="flex flex-col gap-3 p-3">
            {genStats.map((gen) => (
              <button
                key={gen.id}
                onClick={() => setActiveGen(gen.id)}
                className="relative flex items-center gap-3 p-3 rounded-xl border transition-all hover:scale-[1.01] active:scale-[0.99]"
                style={{
                  borderColor: `${gen.color}44`,
                  background: `linear-gradient(135deg, rgba(0,0,0,0.6) 0%, ${gen.color}15 100%)`,
                  boxShadow: `0 0 20px ${gen.color}22`,
                }}
              >
                {/* Gen icon */}
                <img
                  src={gen.icon}
                  alt={gen.name}
                  width={52}
                  height={52}
                  className="pixelated shrink-0"
                  crossOrigin="anonymous"
                  loading="lazy"
                />

                {/* Info */}
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: gen.color, color: "#fff" }}
                    >
                      {gen.label}
                    </span>
                    <span className="text-sm font-bold text-foreground">{gen.name}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    #{String(gen.range[0]).padStart(3, "0")} - #{String(gen.range[1]).padStart(3, "0")}
                  </p>
                  <p className="text-xs font-medium mt-0.5" style={{ color: gen.color }}>
                    {gen.discovered}/{gen.total}
                  </p>
                </div>

                {/* Donut chart */}
                <DonutChart
                  discovered={gen.discovered}
                  total={gen.total}
                  color={gen.color}
                  size={56}
                />
              </button>
            ))}
          </div>
        ) : (
          /* Pokemon grid for selected generation */
          <div className="flex flex-col">
            {/* Back button + search */}
            <div className="flex items-center gap-2 p-3 border-b border-border">
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

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 gap-3">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                >
                  <HelpCircle className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  {isTrainerMode
                    ? "Nenhum Pokemon descoberto nesta geracao."
                    : "Nenhum Pokemon encontrado."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1 p-1">
                {filtered.map((pokemon) => {
                  const inTeam = isInTeam(pokemon.id);
                  const mainType = pokemon.types[0];
                  const mainColor = TYPE_COLORS[mainType];
                  return (
                    <button
                      key={pokemon.id}
                      onClick={() => setSelectedId(pokemon.id)}
                      className="relative flex flex-col items-center p-4 h-56 rounded-2xl border transition-all bg-neutral-900/90 overflow-hidden group"
                      style={{
                        borderColor: mainColor,
                        borderWidth: "1px",
                        boxShadow: `0 0 18px ${mainColor}55`,
                      }}
                    >
                      {/* Badge ID */}
                      <div className="absolute top-2 bg-black/40 backdrop-blur px-2 py-0.5 rounded-md text-[10px] font-mono text-white">
                        #{String(pokemon.id).padStart(3, "0")}
                      </div>

                      {/* Indicator (in team) */}
                      {inTeam && (
                        <div
                          className="absolute top-2 right-2 w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: mainColor,
                            boxShadow: `0 0 10px ${mainColor}`,
                          }}
                        />
                      )}

                      <div className="relative flex items-center justify-center flex-1 w-full">
                        <div
                          className="absolute w-28 h-28 rounded-full blur-2xl opacity-40"
                          style={{
                            background: `radial-gradient(circle, ${mainColor} 0%, transparent 70%)`,
                          }}
                        />
                        <div className="absolute w-24 h-24 rounded-full bg-white/10" />
                        <img
                          src={getSpriteUrl(pokemon.id) || "/placeholder.svg"}
                          alt={pokemon.name}
                          width={60}
                          height={60}
                          className="relative z-10 pixelated drop-shadow-[0_6px_10px_rgba(0,0,0,0.6)] group-hover:scale-110 transition-transform duration-300"
                          crossOrigin="anonymous"
                          loading="lazy"
                        />
                      </div>

                      <div className="flex flex-col gap-1 mt-2">
                        <span className="text-sm font-semibold text-white capitalize mt-1">
                          {pokemon.name}
                        </span>
                        <div className="flex justify-between gap-1 mt-2">
                          {pokemon.types.map((t) => (
                            <span
                              key={t}
                              className="text-[9px] px-1 rounded-full font-semibold tracking-wide"
                              style={{
                                backgroundColor: TYPE_COLORS[t],
                                color: "#fff",
                              }}
                            >
                              {t.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Detail dialog */}
      <Dialog open={!!selectedPokemon} onOpenChange={() => setSelectedId(null)}>
        {selectedPokemon && (
          <DialogContent className="bg-card border-border text-foreground max-w-sm mx-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-foreground">
                <span className="text-muted-foreground font-mono text-sm">
                  #{String(selectedPokemon.id).padStart(3, "0")}
                </span>
                {selectedPokemon.name}
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-col items-center gap-3">
              <img
                src={getSpriteUrl(selectedPokemon.id)}
                alt={selectedPokemon.name}
                width={96}
                height={96}
                className="pixelated"
                crossOrigin="anonymous"
              />

              <div className="flex gap-2">
                {selectedPokemon.types.map((t) => (
                  <Badge
                    key={t}
                    className="text-xs border-0"
                    style={{ backgroundColor: TYPE_COLORS[t], color: "#ffffff" }}
                  >
                    {t.toUpperCase()}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span className="text-foreground">{selectedPokemon.baseHp} HP</span>
                </div>
              </div>

              {/* Starting moves */}
              <div className="w-full">
                <h4 className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <Swords className="w-3 h-3" /> Golpes Iniciais
                </h4>
                <div className="flex flex-col gap-1">
                  {selectedPokemon.startingMoves.map((mId) => {
                    const move = getMove(mId);
                    if (!move) return null;
                    return (
                      <div
                        key={mId}
                        className="flex items-center justify-between bg-secondary rounded px-2 py-1"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="text-[8px] px-1 py-0.5 rounded font-medium"
                            style={{ backgroundColor: TYPE_COLORS[move.type as PokemonType], color: "#ffffff" }}
                          >
                            {move.type.toUpperCase()}
                          </span>
                          <span className="text-xs text-foreground">{move.name}</span>
                        </div>
                        {move.power > 0 && (
                          <span className="text-xs text-accent font-mono">{move.power} PWR</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Learnable moves */}
              {selectedPokemon.learnableMoves.length > 0 && (
                <div className="w-full">
                  <h4 className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Pode Aprender
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedPokemon.learnableMoves.map((mId) => {
                      const move = getMove(mId);
                      if (!move) return null;
                      return (
                        <span
                          key={mId}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground"
                        >
                          {move.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Add to team / capture buttons */}
              <div className="flex flex-col gap-2 w-full">
                {isInTeam(selectedPokemon.id) ? (
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <Check className="w-4 h-4" />
                    Ja esta na equipe
                  </div>
                ) : (
                  <Button
                    onClick={() => {
                      addToTeam(selectedPokemon);
                      setSelectedId(null);
                    }}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {teamFull ? "Adicionar nas Reservas" : "Adicionar a Equipe"}
                  </Button>
                )}

                {/* Capture button - trainer mode only */}
                {isTrainerMode && onStartCapture && (
                  <Button
                    onClick={() => {
                      onStartCapture(selectedPokemon.id);
                      setSelectedId(null);
                    }}
                    className="w-full text-white font-bold"
                    style={{
                      backgroundColor: "#EF4444",
                    }}
                  >
                    <CircleDot className="w-4 h-4 mr-2" />
                    Tentar Capturar
                  </Button>
                )}
              </div>

              {/* Battle button - master mode only */}
              {onStartBattleWithPokemon && (
                <div className="w-full flex flex-col gap-2 pt-2 border-t border-border">
                  <label className="text-xs text-muted-foreground">Iniciar batalha rapida</label>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-xs text-muted-foreground">Lv.</span>
                      <Input
                        type="number"
                        value={battleLevel}
                        onChange={(e) => setBattleLevel(e.target.value)}
                        className="w-16 h-9 bg-secondary border-border text-foreground text-center text-sm"
                        min={1}
                        max={100}
                      />
                    </div>
                    <Button
                      onClick={() => {
                        const lv = parseInt(battleLevel) || 5;
                        onStartBattleWithPokemon(selectedPokemon.id, Math.min(100, Math.max(1, lv)));
                        setSelectedId(null);
                      }}
                      className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      <Swords className="w-4 h-4 mr-1.5" />
                      Batalhar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}

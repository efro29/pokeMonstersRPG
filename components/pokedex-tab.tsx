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
import { Search, Plus, Check, Heart, Swords, Zap, HelpCircle } from "lucide-react";
import { playButtonClick, playGift } from "@/lib/sounds";

interface PokedexTabProps {
  onStartBattleWithPokemon?: (speciesId: number, level: number) => void;
}

export function PokedexTab({ onStartBattleWithPokemon }: PokedexTabProps = {}) {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [discoverInput, setDiscoverInput] = useState("");
  const [discoverMessage, setDiscoverMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [battleLevel, setBattleLevel] = useState("5");
  const { team, addToTeam } = useGameStore();
  const { mode, activeProfileId, discoveredPokemon, discoverPokemon } = useModeStore();

  const isTrainerMode = mode === "trainer";
  const discovered = activeProfileId ? (discoveredPokemon[activeProfileId] || []) : [];

  // In master mode: show all. In trainer mode: only show discovered
  const availablePokemon = isTrainerMode
    ? POKEMON.filter((p) => discovered.includes(p.id))
    : POKEMON;

  const filtered = availablePokemon.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toString().includes(search)
  );

  const selectedPokemon = selectedId ? POKEMON.find((p) => p.id === selectedId) : null;
  const isInTeam = (id: number) => team.some((t) => t.speciesId === id);
  const teamFull = team.length >= 6;

  const handleDiscover = () => {
    const num = parseInt(discoverInput);
    if (isNaN(num) || num < 1 || num > 251) {
      setDiscoverMessage({ text: "Numero invalido! Digite entre 1 e 251.", type: "error" });
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
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search bar and discover */}
      <div className="p-4 border-b border-border flex flex-col gap-3">
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
                className="bg-secondary border-border text-foreground flex-1"
                min={1}
                max={251}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleDiscover();
                }}
              />
              <Button
                onClick={handleDiscover}
                disabled={!discoverInput}
                className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
              >
                <Search className="w-4 h-4 mr-1.5" />
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

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar Pokemon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-secondary border-border text-foreground"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {isTrainerMode
            ? `${discovered.length}/251 Descobertos - Equipe: ${team.length}/6`
            : `${POKEMON.length} Pokemon - Equipe: ${team.length}/6`}
        </p>
      </div>

      {/* Pokemon grid */}
      <ScrollArea className="flex-1">
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
                ? "Nenhum Pokemon descoberto ainda. Insira o numero que o Mestre informar para desbloquear!"
                : "Nenhum Pokemon encontrado."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 p-4">
            {filtered.map((pokemon) => {
              const inTeam = isInTeam(pokemon.id);
              return (
                <button
                  key={pokemon.id}
                  onClick={() => setSelectedId(pokemon.id)}
                  className={`relative flex flex-col items-center p-2 rounded-lg border transition-all ${
                    inTeam
                      ? "border-primary/50 bg-primary/10"
                      : "border-border bg-card hover:border-muted-foreground/50"
                  }`}
                >
                  {inTeam && (
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                  <img
                    src={getSpriteUrl(pokemon.id) || "/placeholder.svg"}
                    alt={pokemon.name}
                    width={64}
                    height={64}
                    className="pixelated"
                    crossOrigin="anonymous"
                    loading="lazy"
                  />
                  <span className="text-[10px] text-muted-foreground font-mono">
                    #{String(pokemon.id).padStart(3, "0")}
                  </span>
                  <span className="text-xs font-medium text-foreground truncate w-full text-center">
                    {pokemon.name}
                  </span>
                  <div className="flex gap-0.5 mt-1">
                    {pokemon.types.map((t) => (
                      <span
                        key={t}
                        className="text-[8px] px-1 py-0.5 rounded font-medium"
                        style={{ backgroundColor: TYPE_COLORS[t], color: "#ffffff" }}
                      >
                        {t.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
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
                src={getSpriteUrl(selectedPokemon.id) || "/placeholder.svg"}
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

              {/* Add to team button */}
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
                  disabled={teamFull}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {teamFull ? "Equipe cheia (6/6)" : "Adicionar a Equipe"}
                </Button>
              )}

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

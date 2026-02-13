"use client";

import { useState } from "react";
import {
  MOVES,
  TYPE_COLORS,
  MOVE_RANGE_INFO,
  getMove,
  getSpriteUrl,
  POKEMON,
} from "@/lib/pokemon-data";
import type { PokemonType, MoveRange, Move, DamageType } from "@/lib/pokemon-data";
import { useGameStore } from "@/lib/game-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Search, Target, GraduationCap, ChevronLeft, Check } from "lucide-react";
import { playButtonClick, playGift } from "@/lib/sounds";

// Range colors for badges
const RANGE_COLORS: Record<MoveRange, string> = {
  melee: "#EF4444",
  short: "#F59E0B",
  medium: "#3B82F6",
  long: "#8B5CF6",
  area: "#22C55E",
};

// Build the 8x8 grid pattern for a move's range
function buildRangeGrid(range: MoveRange): boolean[][] {
  const grid: boolean[][] = Array.from({ length: 8 }, () =>
    Array(8).fill(false)
  );
  // Pokemon at center-ish: row 3, col 3 (0-indexed)
  const py = 3;
  const px = 3;

  if (range === "melee") {
    // 1 adjacent tile in each cardinal direction
    const offsets = [[-1,0],[1,0],[0,-1],[0,1]];
    for (const [dy, dx] of offsets) {
      const ny = py + dy, nx = px + dx;
      if (ny >= 0 && ny < 8 && nx >= 0 && nx < 8) grid[ny][nx] = true;
    }
  } else if (range === "short") {
    // Up to 3 tiles in cardinal directions
    for (let d = 1; d <= 3; d++) {
      for (const [dy, dx] of [[-1,0],[1,0],[0,-1],[0,1]]) {
        const ny = py + dy * d, nx = px + dx * d;
        if (ny >= 0 && ny < 8 && nx >= 0 && nx < 8) grid[ny][nx] = true;
      }
    }
  } else if (range === "medium") {
    // Up to 5 tiles in cardinal directions
    for (let d = 1; d <= 5; d++) {
      for (const [dy, dx] of [[-1,0],[1,0],[0,-1],[0,1]]) {
        const ny = py + dy * d, nx = px + dx * d;
        if (ny >= 0 && ny < 8 && nx >= 0 && nx < 8) grid[ny][nx] = true;
      }
    }
  } else if (range === "long") {
    // Up to 6 tiles in cardinal directions
    for (let d = 1; d <= 6; d++) {
      for (const [dy, dx] of [[-1,0],[1,0],[0,-1],[0,1]]) {
        const ny = py + dy * d, nx = px + dx * d;
        if (ny >= 0 && ny < 8 && nx >= 0 && nx < 8) grid[ny][nx] = true;
      }
    }
  } else if (range === "area") {
    // 6 tiles in 4 columns (2 cols each side), spreading out
    for (let dy = -3; dy <= 3; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        if (dy === 0 && dx === 0) continue;
        const ny = py + dy, nx = px + dx;
        if (ny >= 0 && ny < 8 && nx >= 0 && nx < 8) grid[ny][nx] = true;
      }
    }
  }

  return grid;
}

function RangeGridPopup({ move, onClose }: { move: Move; onClose: () => void }) {
  const grid = buildRangeGrid(move.range);
  const py = 3;
  const px = 3;
  const rangeInfo = MOVE_RANGE_INFO[move.range];
  const typeColor = TYPE_COLORS[move.type as PokemonType];

  return (
    <div className="flex flex-col gap-4">
      {/* Move info header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${typeColor}33` }}
        >
          <Target className="w-5 h-5" style={{ color: typeColor }} />
        </div>
        <div>
          <h4 className="font-bold text-foreground">{move.name}</h4>
          <p className="text-xs text-muted-foreground">{rangeInfo.labelPt} - {rangeInfo.description}</p>
          <div className="flex items-center gap-2 mt-1 text-[10px]">
            {move.damage_dice && <span className="font-mono font-bold text-accent">{move.damage_dice}</span>}
            <span className="text-muted-foreground">
              {move.damage_type === "physical" ? "Fisico" : move.damage_type === "special" ? "Especial" : "Status"}
            </span>
          </div>
        </div>
      </div>

      {/* 8x8 Grid */}
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-[10px] text-muted-foreground mb-1">
          Grid 8x8 - Alcance do golpe
        </span>
        <div className="inline-grid gap-[2px]" style={{ gridTemplateColumns: "repeat(8, 1fr)" }}>
          {grid.map((row, y) =>
            row.map((isHit, x) => {
              const isAttacker = y === py && x === px;
              return (
                <div
                  key={`${y}-${x}`}
                  className="w-7 h-7 rounded-sm flex items-center justify-center text-[8px] font-mono"
                  style={{
                    backgroundColor: isAttacker
                      ? "#F59E0B"
                      : isHit
                        ? `${RANGE_COLORS[move.range]}88`
                        : "hsl(var(--secondary))",
                    border: isAttacker
                      ? "2px solid #F59E0B"
                      : isHit
                        ? `1px solid ${RANGE_COLORS[move.range]}`
                        : "1px solid hsl(var(--border))",
                    color: isAttacker || isHit ? "#fff" : "hsl(var(--muted-foreground))",
                  }}
                >
                  {isAttacker ? "P" : isHit ? "X" : ""}
                </div>
              );
            })
          )}
        </div>
        <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#F59E0B" }} />
            <span>Pokemon (P)</span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: `${RANGE_COLORS[move.range]}88` }}
            />
            <span>Alcance (X)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MovesDictionaryTab() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<PokemonType | "all">("all");
  const [rangeFilter, setRangeFilter] = useState<MoveRange | "all">("all");
  const [selectedMove, setSelectedMove] = useState<Move | null>(null);
  const [showTeachDialog, setShowTeachDialog] = useState(false);
  const [teachMove, setTeachMove] = useState<Move | null>(null);
  const { team, learnMove } = useGameStore();

  const allTypes = Array.from(new Set(MOVES.map((m) => m.type))).sort();

  const filtered = MOVES.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.id.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || m.type === typeFilter;
    const matchRange = rangeFilter === "all" || m.range === rangeFilter;
    return matchSearch && matchType && matchRange;
  }).sort((a, b) => a.name.localeCompare(b.name));

  // Find which pokemon can learn a move
  const getEligiblePokemon = (moveId: string) => {
    return team.filter((p) => {
      // Already knows
      if (p.moves.some((m) => m.moveId === moveId)) return false;
      // Already has 4 moves
      if (p.moves.length >= 4) return false;
      // Check if it's in learnable moves or starting moves
      const species = POKEMON.find((s) => s.id === p.speciesId);
      if (!species) return false;
      const allMoveIds = [...species.startingMoves, ...species.learnableMoves];
      return allMoveIds.includes(moveId);
    });
  };

  const handleTeachMove = (pokemonUid: string, moveId: string) => {
    playGift();
    learnMove(pokemonUid, moveId);
    setShowTeachDialog(false);
    setTeachMove(null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search + Filters */}
      <div className="p-4 border-b border-border flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar golpe..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>

        {/* Type filter */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setTypeFilter("all")}
            className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
              typeFilter === "all"
                ? "bg-foreground text-background"
                : "bg-secondary text-muted-foreground"
            }`}
          >
            Todos
          </button>
          {allTypes.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors"
              style={{
                backgroundColor:
                  typeFilter === t
                    ? TYPE_COLORS[t]
                    : `${TYPE_COLORS[t]}33`,
                color: typeFilter === t ? "#fff" : TYPE_COLORS[t],
              }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Range filter */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setRangeFilter("all")}
            className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
              rangeFilter === "all"
                ? "bg-foreground text-background"
                : "bg-secondary text-muted-foreground"
            }`}
          >
            Alcance
          </button>
          {(Object.keys(MOVE_RANGE_INFO) as MoveRange[]).map((r) => (
            <button
              key={r}
              onClick={() => setRangeFilter(r)}
              className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors"
              style={{
                backgroundColor:
                  rangeFilter === r
                    ? RANGE_COLORS[r]
                    : `${RANGE_COLORS[r]}33`,
                color: rangeFilter === r ? "#fff" : RANGE_COLORS[r],
              }}
            >
              {MOVE_RANGE_INFO[r].labelPt}
            </button>
          ))}
        </div>

        <span className="text-[10px] text-muted-foreground">
          {filtered.length} golpe{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Moves list */}
      <ScrollArea className="flex-1">
        <div className="p-3 flex flex-col gap-2">
          {filtered.map((move) => {
            const typeColor = TYPE_COLORS[move.type as PokemonType];
            const rangeInfo = MOVE_RANGE_INFO[move.range];
            const eligible = getEligiblePokemon(move.id);

            return (
              <div
                key={move.id}
                className="bg-card border border-border rounded-xl p-3 flex flex-col gap-2"
              >
                {/* Move header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${typeColor}22`,
                        color: typeColor,
                      }}
                    >
                      {move.type.toUpperCase()}
                    </span>
                    <h3 className="text-sm font-bold text-foreground">
                      {move.name}
                    </h3>
                  </div>
                  <span
                    className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${RANGE_COLORS[move.range]}22`,
                      color: RANGE_COLORS[move.range],
                    }}
                  >
                    {rangeInfo.labelPt}
                  </span>
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground flex-wrap">
                  {move.damage_dice && (
                    <span className="font-mono bg-secondary px-1.5 py-0.5 rounded text-foreground font-bold">
                      {move.damage_dice}
                    </span>
                  )}
                  <span
                    className="px-1.5 py-0.5 rounded text-[9px] font-bold"
                    style={{
                      backgroundColor: move.damage_type === "physical" ? "#EF444422" : move.damage_type === "special" ? "#8B5CF622" : "#6B728022",
                      color: move.damage_type === "physical" ? "#EF4444" : move.damage_type === "special" ? "#8B5CF6" : "#6B7280",
                    }}
                  >
                    {move.damage_type === "physical" ? "Fisico" : move.damage_type === "special" ? "Especial" : "Status"}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="font-bold text-foreground">ACC</span> D20 {">"}= {move.accuracy}
                  </span>
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3 h-3" />
                    Lv.{move.learnLevel}
                  </span>
                </div>
                {/* Scaling info */}
                {move.scaling_attribute && (
                  <div className="text-[9px] text-muted-foreground">
                    Bonus: {move.damage_type === "physical" ? "Acrobacia" : "Felicidade"} mod
                    {move.uses_contact && <span className="ml-2 text-red-400">(Contato)</span>}
                  </div>
                )}

                {/* Description */}
                <p className="text-[11px] text-muted-foreground">
                  {move.description}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-[10px] gap-1"
                    onClick={() => {
                      playButtonClick();
                      setSelectedMove(move);
                    }}
                  >
                    <Target className="w-3 h-3" />
                    Ver Alcance
                  </Button>
                  {eligible.length > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-[10px] gap-1"
                      style={{
                        borderColor: `${typeColor}66`,
                        color: typeColor,
                      }}
                      onClick={() => {
                        playButtonClick();
                        setTeachMove(move);
                        setShowTeachDialog(true);
                      }}
                    >
                      <GraduationCap className="w-3 h-3" />
                      Ensinar ({eligible.length})
                    </Button>
                  )}
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Search className="w-8 h-8 mb-2 opacity-40" />
              <span className="text-sm">Nenhum golpe encontrado</span>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Range Grid Popup */}
      <Dialog
        open={!!selectedMove}
        onOpenChange={(open) => !open && setSelectedMove(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Alcance do Golpe</DialogTitle>
            <DialogDescription>Visualizacao do alcance do golpe no grid 8x8 do tabuleiro.</DialogDescription>
          </DialogHeader>
          {selectedMove && (
            <RangeGridPopup
              move={selectedMove}
              onClose={() => setSelectedMove(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Teach Move Dialog */}
      <Dialog
        open={showTeachDialog}
        onOpenChange={(open) => {
          if (!open) {
            setShowTeachDialog(false);
            setTeachMove(null);
          }
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              Ensinar {teachMove?.name}
            </DialogTitle>
            <DialogDescription>Escolha um Pokemon do time para aprender este golpe.</DialogDescription>
          </DialogHeader>
          {teachMove && (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground mb-2">
                Escolha um Pokemon para aprender este golpe.
                O Pokemon precisa ter espaco (max 4 golpes) e nivel {">"}= {teachMove.learnLevel}.
              </p>
              {getEligiblePokemon(teachMove.id)
                .filter((p) => p.level >= teachMove.learnLevel)
                .map((p) => (
                  <button
                    key={p.uid}
                    onClick={() => handleTeachMove(p.uid, teachMove.id)}
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-left"
                  >
                    <img
                      src={getSpriteUrl(p.speciesId)}
                      alt={p.name}
                      width={40}
                      height={40}
                      className="pixelated"
                      crossOrigin="anonymous"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-bold text-foreground">
                        {p.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground ml-2">
                        Lv.{p.level}
                      </span>
                      <div className="text-[9px] text-muted-foreground">
                        Golpes: {p.moves.length}/4
                      </div>
                    </div>
                    <GraduationCap className="w-4 h-4 text-primary" />
                  </button>
                ))}
              {getEligiblePokemon(teachMove.id).filter(
                (p) => p.level >= teachMove.learnLevel
              ).length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">
                  Nenhum Pokemon elegivel. Precisam ter nivel {">"}= {teachMove.learnLevel}, espaco para golpes, e este golpe na lista de aprendiveis.
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

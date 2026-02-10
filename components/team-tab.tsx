"use client";

import { useState } from "react";
import { useGameStore } from "@/lib/game-store";
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
import type { PokemonType, PokemonBaseAttributes } from "@/lib/pokemon-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
} from "lucide-react";

interface TeamTabProps {
  onStartBattle: (uid: string) => void;
}

export function TeamTab({ onStartBattle }: TeamTabProps) {
  const {
    team,
    bag,
    removeFromTeam,
    learnMove,
    forgetMove,
    addXp,
    setLevel,
    evolvePokemon,
    useStone,
    evolveByTrade,
    useRareCandy,
  } = useGameStore();

  const [selectedUid, setSelectedUid] = useState<string | null>(null);
  const [xpInput, setXpInput] = useState("");
  const [levelInput, setLevelInput] = useState("");

  const hasRareCandy = bag.some(
    (b) => b.itemId === "rare-candy" && b.quantity > 0
  );

  // Derive selectedPokemon directly from store state so it's always fresh
  const selectedPokemon = selectedUid
    ? team.find((p) => p.uid === selectedUid) ?? null
    : null;

  if (team.length === 0) {
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

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-foreground">
          Minha Equipe ({team.length}/6)
        </h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2 p-4">
          {team.map((pokemon) => {
            const species = getPokemon(pokemon.speciesId);
            const level = pokemon.level ?? 1;
            const xp = pokemon.xp ?? 0;
            const hpPercent =
              pokemon.maxHp > 0
                ? (pokemon.currentHp / pokemon.maxHp) * 100
                : 0;
            const hpColor =
              hpPercent > 50
                ? "#22C55E"
                : hpPercent > 25
                  ? "#F59E0B"
                  : "#EF4444";
            const isFainted = pokemon.currentHp <= 0;
            const xpNeeded = xpForLevel(level + 1);
            const xpPercent =
              xpNeeded > 0 ? Math.min(100, (xp / xpNeeded) * 100) : 0;

            return (
              <div
                key={pokemon.uid}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  isFainted
                    ? "border-destructive/30 bg-destructive/5 opacity-60"
                    : "border-border bg-card"
                }`}
              >
                <button
                  onClick={() => setSelectedUid(pokemon.uid)}
                  className="flex items-center gap-3 flex-1 text-left"
                >
                  <div className="relative">
                    <img
                      src={getSpriteUrl(pokemon.speciesId) || "/placeholder.svg"}
                      alt={pokemon.name}
                      width={56}
                      height={56}
                      className="pixelated"
                      crossOrigin="anonymous"
                    />
                    <span className="absolute -bottom-1 -right-1 text-[9px] font-bold bg-secondary text-foreground rounded-full px-1.5 py-0.5 border border-border">
                      Lv.{level}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-foreground">
                        {pokemon.name}
                      </span>
                      {species && (
                        <div className="flex gap-0.5">
                          {species.types.map((t) => (
                            <span
                              key={t}
                              className="text-[8px] px-1 py-0.5 rounded text-white"
                              style={{ backgroundColor: TYPE_COLORS[t] }}
                            >
                              {t.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* HP bar */}
                    <div className="flex items-center gap-2 mt-1">
                      <Heart className="w-3 h-3 text-red-400 shrink-0" />
                      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${hpPercent}%`,
                            backgroundColor: hpColor,
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground w-16 text-right">
                        {pokemon.currentHp}/{pokemon.maxHp}
                      </span>
                    </div>
                    {/* XP bar */}
                    <div className="flex items-center gap-2 mt-0.5">
                      <Star className="w-3 h-3 text-accent shrink-0" />
                      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-accent transition-all duration-300"
                          style={{ width: `${xpPercent}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-mono text-muted-foreground w-16 text-right">
                        {xp}/{xpNeeded}
                      </span>
                    </div>
                  </div>
                </button>

                <Button
                  size="sm"
                  disabled={isFainted}
                  onClick={() => onStartBattle(pokemon.uid)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
                >
                  <Swords className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
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
          removeFromTeam={removeFromTeam}
          onClose={() => setSelectedUid(null)}
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
  evolvePokemon,
  useStone,
  evolveByTrade,
  learnMove,
  forgetMove,
  removeFromTeam,
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
  evolvePokemon: (uid: string, toSpeciesId: number) => void;
  useStone: (uid: string, stoneId: string) => boolean;
  evolveByTrade: (uid: string) => boolean;
  learnMove: (uid: string, moveId: string) => void;
  forgetMove: (uid: string, moveId: string) => void;
  removeFromTeam: (uid: string) => void;
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

  return (
    <DialogContent className="bg-card border-border text-foreground max-w-sm mx-auto max-h-[85vh] overflow-y-auto">
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
            className="flex-1 text-foreground data-[state=active]:bg-card"
          >
            Info
          </TabsTrigger>
          <TabsTrigger
            value="moves"
            className="flex-1 text-foreground data-[state=active]:bg-card"
          >
            Golpes
          </TabsTrigger>
          <TabsTrigger
            value="learn"
            className="flex-1 text-foreground data-[state=active]:bg-card"
          >
            Aprender
          </TabsTrigger>
          <TabsTrigger
            value="attrs"
            className="flex-1 text-foreground data-[state=active]:bg-card"
          >
            Atributos
          </TabsTrigger>
          <TabsTrigger
            value="evolve"
            className="flex-1 text-foreground data-[state=active]:bg-card"
          >
            Evoluir
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
            <div className="flex items-center gap-2 text-sm">
              <Heart className="w-4 h-4 text-red-400" />
              <span className="text-foreground">
                {pokemon.currentHp} / {pokemon.maxHp} HP
              </span>
            </div>
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

            {/* Add XP */}
            <div className="w-full flex flex-col gap-2">
              <label className="text-xs text-muted-foreground">
                Adicionar XP (recompensa do mestre)
              </label>
              <div className="flex gap-2">
                {[50, 100, 250, 500].map((val) => (
                  <Button
                    key={val}
                    size="sm"
                    variant="outline"
                    onClick={() => addXp(pokemon.uid, val)}
                    className="flex-1 text-xs border-border text-foreground bg-transparent hover:bg-secondary"
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
                  className="bg-secondary border-border text-foreground text-sm"
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
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Set Level directly */}
            <div className="w-full flex flex-col gap-2">
              <label className="text-xs text-muted-foreground">
                Definir Level (decisao do mestre)
              </label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Ex: 16"
                  value={levelInput}
                  onChange={(e) => setLevelInput(e.target.value)}
                  className="bg-secondary border-border text-foreground text-sm"
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
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
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
                removeFromTeam(pokemon.uid);
                onClose();
              }}
              className="w-full"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remover da Equipe
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

        {/* Attributes Tab */}
        <TabsContent value="attrs" className="mt-3">
          {(() => {
            const attrs = computeAttributes(pokemon.speciesId, level);
            const attrKeys: (keyof PokemonBaseAttributes)[] = ["velocidade", "felicidade", "resistencia", "acrobacia"];
            const attrIcons: Record<string, { icon: typeof Zap; color: string }> = {
              velocidade:  { icon: Zap,    color: "#FACC15" },
              felicidade:  { icon: Heart,  color: "#F472B6" },
              resistencia: { icon: Shield, color: "#60A5FA" },
              acrobacia:   { icon: Wind,   color: "#2DD4BF" },
            };
            return (
              <div className="flex flex-col gap-3">
                <p className="text-xs text-muted-foreground text-center">
                  Atributos do Pokemon (escalam com o nivel)
                </p>
                {attrKeys.map((attr) => {
                  const info = POKEMON_ATTRIBUTE_INFO[attr];
                  const { icon: Icon, color } = attrIcons[attr];
                  const baseVal = attrs[attr];
                  const modKey = `${attr}Mod` as keyof typeof attrs;
                  const mod = attrs[modKey] as number;
                  const barPercent = Math.min(100, baseVal * 10);
                  return (
                    <div key={attr} className="bg-secondary rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Icon className="w-4 h-4 shrink-0" style={{ color }} />
                        <span className="text-sm font-bold text-foreground">{info.name}</span>
                        <span className="ml-auto text-xs font-mono text-accent">+{mod} mod</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 h-2.5 bg-background rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{ width: `${barPercent}%`, backgroundColor: color }}
                          />
                        </div>
                        <span className="text-xs font-mono text-muted-foreground w-8 text-right">
                          {baseVal}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{info.desc}</p>
                    </div>
                  );
                })}
                <div className="bg-secondary/50 rounded-lg p-2 mt-1">
                  <p className="text-[10px] text-muted-foreground text-center">
                    Modificador = Base/2 + Nivel/5. Usado em "Rolar um Teste" na batalha.
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
      </Tabs>
    </DialogContent>
  );
}

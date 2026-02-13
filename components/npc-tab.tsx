"use client";

import { useState } from "react";
import { useGameStore } from "@/lib/game-store";
import type { NpcEnemy } from "@/lib/game-store";
import { POKEMON, getSpriteUrl, getPokemon, TYPE_COLORS } from "@/lib/pokemon-data";
import type { PokemonType } from "@/lib/pokemon-data";
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
  Plus,
  Trash2,
  ChevronRight,
  Search,
  Users,
  Swords,
  Heart,
  ArrowLeft,
  Pencil,
  Check,
} from "lucide-react";
import { playButtonClick, playGift } from "@/lib/sounds";

interface NpcTabProps {
  onStartBattleWithPokemon: (speciesId: number, level: number) => void;
}

export function NpcTab({ onStartBattleWithPokemon }: NpcTabProps) {
  const {
    npcs,
    addNpc,
    removeNpc,
    updateNpcName,
    addNpcPokemon,
    removeNpcPokemon,
    updateNpcPokemonLevel,
  } = useGameStore();

  const [selectedNpcId, setSelectedNpcId] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newNpcName, setNewNpcName] = useState("");
  const [showAddPokemon, setShowAddPokemon] = useState(false);
  const [pokemonSearch, setPokemonSearch] = useState("");
  const [selectedAddLevel, setSelectedAddLevel] = useState("5");
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [editNameValue, setEditNameValue] = useState("");

  const selectedNpc = npcs.find((n) => n.id === selectedNpcId);

  const handleCreateNpc = () => {
    if (!newNpcName.trim()) return;
    playGift();
    const id = addNpc(newNpcName.trim());
    setNewNpcName("");
    setShowCreateDialog(false);
    setSelectedNpcId(id);
  };

  const handleAddPokemonToNpc = (speciesId: number) => {
    if (!selectedNpcId) return;
    const level = parseInt(selectedAddLevel) || 5;
    addNpcPokemon(selectedNpcId, speciesId, Math.min(100, Math.max(1, level)));
    playButtonClick();
    setShowAddPokemon(false);
    setPokemonSearch("");
  };

  const filteredPokemon = POKEMON.filter(
    (p) =>
      p.name.toLowerCase().includes(pokemonSearch.toLowerCase()) ||
      p.id.toString().includes(pokemonSearch)
  );

  // NPC list view
  if (!selectedNpc) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-foreground">NPCs Inimigos</h2>
            <p className="text-xs text-muted-foreground">{npcs.length} criados</p>
          </div>
          <Button
            onClick={() => setShowCreateDialog(true)}
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Novo NPC
          </Button>
        </div>

        <ScrollArea className="flex-1">
          {npcs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 gap-3">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
                <Users className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Nenhum NPC</h3>
              <p className="text-sm text-muted-foreground text-center">
                Crie inimigos com equipes de Pokemon para usar nas batalhas da campanha.
              </p>
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Criar Primeiro NPC
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 p-4">
              {npcs.map((npc) => (
                <button
                  key={npc.id}
                  onClick={() => {
                    playButtonClick();
                    setSelectedNpcId(npc.id);
                  }}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:border-muted-foreground/50 transition-all text-left"
                >
                  {/* NPC avatar */}
                  <div className="w-12 h-12 rounded-full bg-destructive/10 border-2 border-destructive/30 flex items-center justify-center shrink-0">
                    <Swords className="w-5 h-5 text-destructive" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-sm text-foreground block truncate">
                      {npc.name}
                    </span>
                    <div className="flex items-center gap-1 mt-0.5">
                      {npc.team.length === 0 ? (
                        <span className="text-[10px] text-muted-foreground">Sem Pokemon</span>
                      ) : (
                        <>
                          <span className="text-[10px] text-muted-foreground mr-1">
                            {npc.team.length}/6
                          </span>
                          {npc.team.slice(0, 4).map((p, i) => (
                            <img
                              key={i}
                              src={getSpriteUrl(p.speciesId)}
                              alt=""
                              width={20}
                              height={20}
                              className="pixelated"
                              crossOrigin="anonymous"
                            />
                          ))}
                          {npc.team.length > 4 && (
                            <span className="text-[10px] text-muted-foreground">+{npc.team.length - 4}</span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </button>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Create NPC Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="bg-card border-border text-foreground max-w-sm mx-auto">
            <DialogHeader>
              <DialogTitle className="text-foreground">Novo NPC Inimigo</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-3">
              <Input
                placeholder="Nome do NPC (ex: Keny, Rocket Grunt)"
                value={newNpcName}
                onChange={(e) => setNewNpcName(e.target.value)}
                className="bg-secondary border-border text-foreground"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateNpc();
                }}
              />
              <Button
                onClick={handleCreateNpc}
                disabled={!newNpcName.trim()}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Criar NPC
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // NPC detail view
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setSelectedNpcId(null)}
            className="text-foreground hover:bg-secondary shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="w-10 h-10 rounded-full bg-destructive/10 border-2 border-destructive/30 flex items-center justify-center shrink-0">
            <Swords className="w-4 h-4 text-destructive" />
          </div>
          <div className="flex-1 min-w-0">
            {editingNameId === selectedNpc.id ? (
              <div className="flex items-center gap-1">
                <Input
                  value={editNameValue}
                  onChange={(e) => setEditNameValue(e.target.value)}
                  className="h-7 bg-secondary border-border text-foreground text-sm"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && editNameValue.trim()) {
                      updateNpcName(selectedNpc.id, editNameValue.trim());
                      setEditingNameId(null);
                    }
                  }}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    if (editNameValue.trim()) {
                      updateNpcName(selectedNpc.id, editNameValue.trim());
                    }
                    setEditingNameId(null);
                  }}
                  className="h-7 w-7 p-0"
                >
                  <Check className="w-3 h-3" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <h2 className="font-semibold text-foreground text-sm truncate">
                  {selectedNpc.name}
                </h2>
                <button
                  onClick={() => {
                    setEditNameValue(selectedNpc.name);
                    setEditingNameId(selectedNpc.id);
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Pencil className="w-3 h-3" />
                </button>
              </div>
            )}
            <p className="text-[10px] text-muted-foreground">
              Equipe: {selectedNpc.team.length}/6
            </p>
          </div>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => {
              removeNpc(selectedNpc.id);
              setSelectedNpcId(null);
            }}
            className="shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* NPC Pokemon Team */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2 p-4">
          {selectedNpc.team.map((npcPokemon, index) => {
            const species = getPokemon(npcPokemon.speciesId);
            if (!species) return null;
            const levelBonus = (npcPokemon.level - 1) * 3;
            const hp = species.baseHp + levelBonus;

            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card"
              >
                <img
                  src={getSpriteUrl(npcPokemon.speciesId)}
                  alt={species.name}
                  width={48}
                  height={48}
                  className="pixelated shrink-0"
                  crossOrigin="anonymous"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-foreground">
                      {species.name}
                    </span>
                    <div className="flex gap-0.5">
                      {species.types.map((t) => (
                        <span
                          key={t}
                          className="text-[8px] px-1 py-0.5 rounded text-white"
                          style={{ backgroundColor: TYPE_COLORS[t as PokemonType] }}
                        >
                          {t.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-muted-foreground">Lv.</span>
                      <Input
                        type="number"
                        value={npcPokemon.level}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (val >= 1 && val <= 100) {
                            updateNpcPokemonLevel(selectedNpc.id, index, val);
                          }
                        }}
                        className="h-6 w-14 text-xs bg-secondary border-border text-foreground text-center px-1"
                        min={1}
                        max={100}
                      />
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Heart className="w-3 h-3 text-red-400" />
                      {hp} HP
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      playButtonClick();
                      onStartBattleWithPokemon(npcPokemon.speciesId, npcPokemon.level);
                    }}
                    className="h-7 text-xs border-primary/50 text-primary bg-transparent hover:bg-primary/10"
                  >
                    <Swords className="w-3 h-3 mr-1" />
                    Batalhar
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeNpcPokemon(selectedNpc.id, index)}
                    className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            );
          })}

          {/* Add Pokemon button */}
          {selectedNpc.team.length < 6 && (
            <Button
              variant="outline"
              onClick={() => setShowAddPokemon(true)}
              className="h-14 border-dashed border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
            >
              <Plus className="w-5 h-5 mr-2" />
              Adicionar Pokemon
            </Button>
          )}
        </div>
      </ScrollArea>

      {/* Add Pokemon Dialog */}
      <Dialog open={showAddPokemon} onOpenChange={setShowAddPokemon}>
        <DialogContent className="bg-card border-border text-foreground max-w-sm mx-auto max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Adicionar Pokemon - {selectedNpc.name}
            </DialogTitle>
          </DialogHeader>
          <div className="flex gap-2 mb-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={pokemonSearch}
                onChange={(e) => setPokemonSearch(e.target.value)}
                className="pl-10 bg-secondary border-border text-foreground"
              />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground whitespace-nowrap">Lv.</span>
              <Input
                type="number"
                value={selectedAddLevel}
                onChange={(e) => setSelectedAddLevel(e.target.value)}
                className="w-16 bg-secondary border-border text-foreground text-center text-sm"
                min={1}
                max={100}
              />
            </div>
          </div>
          <ScrollArea className="flex-1 max-h-[50vh]">
            <div className="grid grid-cols-3 gap-1.5">
              {filteredPokemon.map((pokemon) => (
                <button
                  key={pokemon.id}
                  onClick={() => handleAddPokemonToNpc(pokemon.id)}
                  className="flex flex-col items-center p-1.5 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  <img
                    src={getSpriteUrl(pokemon.id)}
                    alt={pokemon.name}
                    width={40}
                    height={40}
                    className="pixelated"
                    crossOrigin="anonymous"
                    loading="lazy"
                  />
                  <span className="text-[9px] text-muted-foreground font-mono">
                    #{String(pokemon.id).padStart(3, "0")}
                  </span>
                  <span className="text-[10px] font-medium text-foreground truncate w-full text-center">
                    {pokemon.name}
                  </span>
                </button>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}

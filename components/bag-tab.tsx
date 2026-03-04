"use client";

import React from "react";

import { useState } from "react";
import { useGameStore } from "@/lib/game-store";
import { useModeStore } from "@/lib/mode-store";
import { BAG_ITEMS } from "@/lib/pokemon-data";
import { getSpriteUrl } from "@/lib/pokemon-data";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Pill, CircleDot, Beaker, Package, Plus, Minus, Gem, Zap, Terminal, ChevronRight, ChevronLeft } from "lucide-react";
import { getMove, TYPE_COLORS } from "@/lib/pokemon-data";
import type { PokemonType } from "@/lib/pokemon-data";
import { playButtonClick, playHeal } from "@/lib/sounds";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  potion: <Beaker className="w-5 h-5 text-green-400" />,
  pokeball: <CircleDot className="w-5 h-5 text-red-400" />,
  status: <Pill className="w-5 h-5 text-blue-400" />,
  other: <Gem className="w-5 h-5 text-purple-400" />,
};

const CATEGORY_LABELS: Record<string, string> = {
  potion: "Pocoes",
  pokeball: "Pokebolas",
  status: "Status/PP",
  other: "Pedras & Itens",
};

export function BagTab() {
  const { bag, team, addBagItem, useBagItem } = useGameStore();
  const economyLocked = useModeStore((s) => s.economyLocked);
  const [useTarget, setUseTarget] = useState<{
    itemId: string;
    itemName: string;
  } | null>(null);
  const [etherTarget, setEtherTarget] = useState<{
    itemId: string;
    itemName: string;
  } | null>(null);
  const [selectedEtherPokemon, setSelectedEtherPokemon] = useState<string | null>(null);
  const [addItemDialog, setAddItemDialog] = useState(false);
  const [addQty, setAddQty] = useState(1);

  const categories = ["potion", "pokeball", "status", "other"] as const;

  return (
<div className="flex flex-col h-full bg-[#08090d] text-slate-200 select-none">
  {/* Header Estilo Inventário Tático */}
  <div className="p-4 border-b-2 border-primary/30 bg-primary/5 flex items-center justify-between shadow-[0_4px_15px_rgba(0,0,0,0.4)]">
    <div className="flex items-center gap-3">
      <div className="relative">
        <Package className="w-5 h-5 text-primary" />
        <div className="absolute -inset-1 bg-primary/20 blur-sm rounded-full animate-pulse" />
      </div>
      <div>
        <h2 className="text-[10px] font-black tracking-[0.3em] uppercase text-primary/50 leading-none">Storage_v2.1</h2>
        <h2 className="font-black italic text-lg tracking-tighter text-white uppercase">Sua Bolsa</h2>
      </div>
    </div>

    {!economyLocked && (
      <button
        onClick={() => setAddItemDialog(true)}
        className="group relative px-4 py-1.5 flex items-center gap-2 transition-all active:scale-95"
      >
        <div className="absolute inset-0 bg-white/5 skew-x-[-12deg] border border-white/20 group-hover:bg-primary/20 group-hover:border-primary/50 transition-all" />
        <Plus className="w-4 h-4 text-primary relative z-10" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-white relative z-10">Add Item</span>
      </button>
    )}
  </div>

  <ScrollArea className="flex-1 px-4">
    <div className="flex flex-col gap-8 py-6 pb-20">
      {categories.map((cat) => {
        const items = bag.filter((b) => {
          const def = BAG_ITEMS.find((d) => d.id === b.itemId);
          return def?.category === cat;
        });
        if (items.length === 0) return null;

        return (
          <div key={cat} className="space-y-3">
            {/* Header da Categoria com Linha de Scanner */}
            <div className="flex items-center gap-3 group">
              <div className="p-1.5 bg-white/5 border border-white/10 rounded-sm">
                {CATEGORY_ICONS[cat]}
              </div>
              <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-500 italic group-hover:text-primary transition-colors">
                {CATEGORY_LABELS[cat]}
              </h3>
              <div className="flex-1 h-[1px] bg-gradient-to-r from-white/10 to-transparent" />
            </div>

            <div className="grid gap-2">
              {items.map((item) => {
                const def = BAG_ITEMS.find((d) => d.id === item.itemId);
                if (!def) return null;
                const canUse = def.category === "potion" || def.category === "status" || def.id === "revive";

                return (
                  <div
                    key={item.itemId}
                    className="relative flex items-center justify-between p-3 bg-white/[0.03] border border-white/5 transition-all hover:bg-white/[0.06]"
                    style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}
                  >
                    <div className="flex flex-col gap-0.5 relative z-10">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black italic uppercase text-slate-100">
                          {def.name}
                        </span>
                        <div className="h-1 w-1 bg-primary/40 rounded-full" />
                        <span className="text-xs font-mono font-bold text-primary">
                          x{item.quantity.toString().padStart(2, '0')}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium leading-tight max-w-[180px]">
                        {def.description}
                      </span>
                    </div>

                    {canUse && (
                      <button
                        onClick={() => {
                          // Ether precisa de seleção de Pokemon e golpe
                          if (def.id === "ether") {
                            setEtherTarget({ itemId: item.itemId, itemName: def.name });
                          } else {
                            setUseTarget({ itemId: item.itemId, itemName: def.name });
                          }
                        }}
                        className="relative px-5 py-2 overflow-hidden group/btn active:scale-90 transition-transform"
                      >
                        <div className="absolute inset-0 bg-primary/10 border border-primary/30 skew-x-[-15deg] group-hover/btn:bg-primary/20" />
                        <span className="relative z-10 text-[10px] font-black uppercase italic tracking-widest text-primary">
                          Utilizar
                        </span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {bag.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 py-20 opacity-20">
          <div className="relative">
            <Package className="w-16 h-16 stroke-[1px]" />
            <div className="absolute inset-0 border-2 border-dashed border-white/20 rounded-full animate-[spin_10s_linear_infinite]" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em]">Inventory_Empty</p>
        </div>
      )}
    </div>
  </ScrollArea>

  {/* Dialog de Uso - Estilo Seleção de Unidade */}
  <Dialog open={!!useTarget} onOpenChange={() => setUseTarget(null)}>
    {useTarget && (
      <DialogContent className="bg-[#0c0d12] border-2 border-primary/40 text-white max-w-sm rounded-none shadow-[0_0_40px_rgba(0,0,0,0.7)]">
        <div className="absolute top-0 left-0 w-20 h-[2px] bg-primary shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
        
        <DialogHeader>
          <DialogTitle className="text-white font-black italic uppercase text-xl flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Deploy: <span className="text-primary">{useTarget.itemName}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/10 pb-2">
             Selecione o alvo para aplicação:
          </p>
          
          <ScrollArea className="max-h-[350px] pr-2">
            <div className="flex flex-col gap-2">
              {team.length > 0 ? (
                team.map((p) => {
                  const isFainted = p.currentHp <= 0;
                  const isRevive = useTarget.itemId === "revive";
                  const isDisabled = isRevive ? !isFainted : isFainted;

                  return (
                    <button
                      key={p.uid}
                      disabled={isDisabled}
                      onClick={() => {
                        useBagItem(useTarget.itemId, p.uid);
                        setUseTarget(null);
                        playHeal();
                      }}
                      className={`group relative flex items-center gap-4 p-3 border transition-all ${
                        isDisabled 
                        ? "opacity-30 grayscale cursor-not-allowed border-white/5" 
                        : "bg-white/5 border-white/10 hover:border-primary/50 hover:bg-primary/5"
                      }`}
                    >
                      <div className="relative w-12 h-12 flex-shrink-0 bg-black/40 border border-white/5 rounded-sm overflow-hidden">
                        <img
                          src={getSpriteUrl(p.speciesId)}
                          className={`w-full h-full object-contain pixelated relative z-10 ${isFainted ? 'opacity-40' : ''}`}
                        />
                        {isFainted && <div className="absolute inset-0 bg-red-900/20 z-0" />}
                      </div>

                      <div className="flex-1 text-left">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase italic tracking-tighter">{p.name}</span>
                          <span className="text-[10px] font-mono text-slate-500">LV.{p.level || '??'}</span>
                        </div>
                        
                        {/* HP Bar HUD */}
                        <div className="mt-1 space-y-1">
                          <div className="flex justify-between text-[8px] font-bold font-mono">
                            <span className={isFainted ? "text-red-500" : "text-primary"}>HP MONITOR</span>
                            <span>{p.currentHp} / {p.maxHp}</span>
                          </div>
                          <div className="h-1.5 w-full bg-black/60 rounded-full overflow-hidden border border-white/5">
                            <div 
                              className={`h-full transition-all duration-500 ${isFainted ? 'bg-red-600' : 'bg-primary'}`}
                              style={{ width: `${(p.currentHp / p.maxHp) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-10 border border-dashed border-white/10">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-600 italic">No_Targets_Available</span>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    )}
  </Dialog>

  {/* Dialog de Ether - Selecao de Pokemon e Golpe */}
  <Dialog open={!!etherTarget} onOpenChange={(open) => {
    if (!open) {
      setEtherTarget(null);
      setSelectedEtherPokemon(null);
    }
  }}>
    {etherTarget && (
      <DialogContent className="bg-[#0c0d12] border-2 border-blue-500/40 text-white max-w-md rounded-none shadow-[0_0_40px_rgba(0,0,0,0.7)]">
        <div className="absolute top-0 left-0 w-20 h-[2px] bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
        
        <DialogHeader>
          <DialogTitle className="text-white font-black italic uppercase text-xl flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-400" />
            {etherTarget.itemName} - Restaurar PP
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {!selectedEtherPokemon 
              ? "Selecione um Pokemon para restaurar PP de um golpe"
              : "Selecione o golpe para restaurar 5 PP"
            }
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[400px] pr-2">
          {!selectedEtherPokemon ? (
            // Lista de Pokemon do time
            <div className="flex flex-col gap-2">
              {team.length > 0 ? (
                team.filter((p) => p.currentHp > 0).map((p) => {
                  const hasMovesNeedingPP = p.moves.some((m) => m.currentPP < m.maxPP);
                  return (
                    <button
                      key={p.uid}
                      disabled={!hasMovesNeedingPP}
                      onClick={() => setSelectedEtherPokemon(p.uid)}
                      className={`group relative flex items-center gap-4 p-3 border transition-all ${
                        !hasMovesNeedingPP 
                        ? "opacity-30 grayscale cursor-not-allowed border-white/5" 
                        : "bg-white/5 border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5"
                      }`}
                    >
                      <div className="relative w-12 h-12 flex-shrink-0 bg-black/40 border border-white/5 rounded-sm overflow-hidden">
                        <img
                          src={getSpriteUrl(p.speciesId)}
                          className="w-full h-full object-contain pixelated relative z-10"
                        />
                      </div>

                      <div className="flex-1 text-left">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase italic tracking-tighter">{p.name}</span>
                          <span className="text-[10px] font-mono text-slate-500">LV.{p.level || '??'}</span>
                        </div>
                        
                        <div className="mt-1 text-[10px] text-slate-400">
                          {hasMovesNeedingPP ? (
                            <span className="text-blue-400">{p.moves.filter((m) => m.currentPP < m.maxPP).length} golpe(s) precisam de PP</span>
                          ) : (
                            <span>Todos os golpes com PP cheio</span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-10 border border-dashed border-white/10">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-600 italic">Nenhum Pokemon no time</span>
                </div>
              )}
            </div>
          ) : (
            // Lista de golpes do Pokemon selecionado
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setSelectedEtherPokemon(null)}
                className="self-start flex items-center gap-1 text-slate-400 hover:text-white text-xs mb-2"
              >
                <ChevronLeft className="w-4 h-4" /> Voltar
              </button>
              
              {(() => {
                const targetPokemon = team.find((p) => p.uid === selectedEtherPokemon);
                if (!targetPokemon) return null;
                
                return (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 bg-white/5 border border-white/10">
                      <img
                        src={getSpriteUrl(targetPokemon.speciesId)}
                        className="w-10 h-10 pixelated"
                      />
                      <span className="font-black uppercase italic">{targetPokemon.name}</span>
                    </div>
                    
                    {targetPokemon.moves.map((m) => {
                      const moveDef = getMove(m.moveId);
                      if (!moveDef) return null;
                      const needsPP = m.currentPP < m.maxPP;
                      const ppAfter = Math.min(m.maxPP, m.currentPP + 5);
                      
                      return (
                        <button
                          key={m.moveId}
                          disabled={!needsPP}
                          onClick={() => {
                            useBagItem(etherTarget.itemId, selectedEtherPokemon, m.moveId);
                            setEtherTarget(null);
                            setSelectedEtherPokemon(null);
                            playHeal();
                          }}
                          className={`w-full flex items-center justify-between p-3 border-l-4 transition-all ${
                            !needsPP 
                            ? "opacity-40 cursor-not-allowed bg-white/[0.02]" 
                            : "bg-white/5 hover:bg-white/10"
                          }`}
                          style={{
                            borderLeftColor: TYPE_COLORS[moveDef.type as PokemonType] || "#666",
                          }}
                        >
                          <div className="flex flex-col items-start">
                            <span className="text-sm font-bold">{moveDef.name}</span>
                            <span className="text-[10px] text-slate-500 capitalize">
                              Tipo: {moveDef.type} | {moveDef.damage_dice || "Status"}
                            </span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className={`text-sm font-mono ${needsPP ? 'text-amber-400' : 'text-green-400'}`}>
                              PP: {m.currentPP}/{m.maxPP}
                            </span>
                            {needsPP && (
                              <span className="text-[10px] text-blue-400">
                                +5 PP (vai para {ppAfter})
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    )}
  </Dialog>

  {/* Add Item Dialog (Mestre) - Estilo Admin Console */}
  <Dialog open={addItemDialog} onOpenChange={setAddItemDialog}>
    <DialogContent className="bg-[#0a0b0e] border-2 border-slate-700 text-white max-w-sm rounded-none shadow-2xl">
      <div className="flex items-center gap-2 mb-4 p-2 bg-slate-900 border-l-4 border-slate-500">
        <Terminal className="w-4 h-4 text-slate-400" />
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Admin_Console // Add_Inventory</span>
      </div>

      <div className="flex items-center justify-center gap-4 mb-6 p-4 bg-black/40 border border-white/5">
        <Button
          variant="ghost"
          onClick={() => setAddQty(Math.max(1, addQty - 1))}
          className="h-10 w-10 text-white hover:bg-white/10 border border-white/10"
        >
          <Minus className="w-4 h-4" />
        </Button>
        <div className="text-center">
          <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">Load_Qty</span>
          <span className="text-3xl font-black font-mono text-white tracking-tighter">{addQty}</span>
        </div>
        <Button
          variant="ghost"
          onClick={() => setAddQty(addQty + 1)}
          className="h-10 w-10 text-white hover:bg-white/10 border border-white/10"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="max-h-[300px] border-t border-white/5 pt-4">
        <div className="grid gap-1">
          {BAG_ITEMS.map((def) => (
            <button
              key={def.id}
              onClick={() => {
                addBagItem(def.id, addQty);
                playButtonClick();
                setAddItemDialog(false);
                setAddQty(1);
              }}
              className="flex items-center justify-between p-3 bg-white/[0.02] hover:bg-white/[0.08] transition-colors border border-transparent hover:border-white/10 text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="text-slate-500 group-hover:text-primary transition-colors">
                  {CATEGORY_ICONS[def.category]}
                </div>
                <div>
                  <div className="text-xs font-black uppercase italic tracking-tight">{def.name}</div>
                  <div className="text-[9px] text-slate-500 leading-none">{def.description}</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-primary" />
            </button>
          ))}
        </div>
      </ScrollArea>
    </DialogContent>
  </Dialog>
</div>
  );
}

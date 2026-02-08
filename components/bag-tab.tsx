"use client";

import React from "react";

import { useState } from "react";
import { useGameStore } from "@/lib/game-store";
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
} from "@/components/ui/dialog";
import { Pill, CircleDot, Beaker, Package, Plus, Minus, Gem } from "lucide-react";
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
  const [useTarget, setUseTarget] = useState<{
    itemId: string;
    itemName: string;
  } | null>(null);
  const [addItemDialog, setAddItemDialog] = useState(false);
  const [addQty, setAddQty] = useState(1);
  const uid = ""; // Declare uid variable here
  const p = { uid: "" }; // Declare p variable here

  const categories = ["potion", "pokeball", "status", "other"] as const;

  const handleUseItem = (itemId: string, uid: string) => {
    playHeal();
    setUseTarget(null);
  };

  const useBagItemHook = (itemId: string, uid: string) => {
    useBagItem(itemId, uid);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="font-semibold text-foreground">Bolsa</h2>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setAddItemDialog(true)}
          className="border-border text-foreground bg-transparent hover:bg-secondary"
        >
          <Plus className="w-4 h-4 mr-1" /> Adicionar
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-4 p-4">
          {categories.map((cat) => {
            const items = bag.filter((b) => {
              const def = BAG_ITEMS.find((d) => d.id === b.itemId);
              return def?.category === cat;
            });
            if (items.length === 0) return null;

            return (
              <div key={cat}>
                <div className="flex items-center gap-2 mb-2">
                  {CATEGORY_ICONS[cat]}
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {CATEGORY_LABELS[cat]}
                  </h3>
                </div>
                <div className="flex flex-col gap-1">
                  {items.map((item) => {
                    const def = BAG_ITEMS.find((d) => d.id === item.itemId);
                    if (!def) return null;
                    return (
                      <div
                        key={item.itemId}
                        className="flex items-center justify-between bg-card rounded-lg border border-border p-3"
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-foreground">
                            {def.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {def.description}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-accent">
                            x{item.quantity}
                          </span>
                          {(def.category === "potion" || def.category === "status") && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                useBagItem(item.itemId, p.uid);
                                handleUseItem(item.itemId, p.uid);
                              }}
                              className="text-xs border-border text-foreground bg-transparent hover:bg-secondary"
                            >
                              Usar
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {bag.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <Package className="w-12 h-12 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Bolsa vazia</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Use item target dialog */}
      <Dialog open={!!useTarget} onOpenChange={() => setUseTarget(null)}>
        {useTarget && (
          <DialogContent className="bg-card border-border text-foreground max-w-sm mx-auto">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                Usar {useTarget.itemName}
              </DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground mb-2">
              Escolha um Pokemon:
            </p>
            <div className="flex flex-col gap-2">
              {team.map((p) => (
                <Button
                  key={p.uid}
                  variant="outline"
                  onClick={() => {
                    useBagItem(useTarget.itemId, p.uid);
                    handleUseItem(useTarget.itemId, p.uid);
                  }}
                  className="flex items-center justify-start gap-3 h-auto py-2 border-border text-foreground bg-transparent hover:bg-secondary"
                >
                  <img
                    src={getSpriteUrl(p.speciesId) || "/placeholder.svg"}
                    alt={p.name}
                    width={40}
                    height={40}
                    className="pixelated"
                    crossOrigin="anonymous"
                  />
                  <div className="text-left">
                    <span className="text-sm font-medium">{p.name}</span>
                    <span className="text-[10px] block text-muted-foreground">
                      HP: {p.currentHp}/{p.maxHp}
                    </span>
                  </div>
                </Button>
              ))}
              {team.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum Pokemon na equipe.
                </p>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Add item dialog */}
      <Dialog open={addItemDialog} onOpenChange={setAddItemDialog}>
        <DialogContent className="bg-card border-border text-foreground max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">Adicionar Item</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-2 mb-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setAddQty(Math.max(1, addQty - 1))}
              className="border-border text-foreground bg-transparent hover:bg-secondary"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Input
              type="number"
              value={addQty}
              onChange={(e) => setAddQty(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 text-center bg-secondary border-border text-foreground"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => setAddQty(addQty + 1)}
              className="border-border text-foreground bg-transparent hover:bg-secondary"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <ScrollArea className="max-h-64">
            <div className="flex flex-col gap-1">
              {BAG_ITEMS.map((def) => (
                <Button
                  key={def.id}
                  variant="ghost"
                  onClick={() => {
                    addBagItem(def.id, addQty);
                    playButtonClick();
                    setAddItemDialog(false);
                    setAddQty(1);
                  }}
                  className="flex items-center justify-between h-auto py-2 text-foreground hover:bg-secondary"
                >
                  <div className="flex items-center gap-2">
                    {CATEGORY_ICONS[def.category]}
                    <div className="text-left">
                      <span className="text-sm">{def.name}</span>
                      <span className="text-[10px] block text-muted-foreground">
                        {def.description}
                      </span>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}

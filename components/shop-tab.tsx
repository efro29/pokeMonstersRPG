"use client";

import React from "react";
import { useState } from "react";
import { useGameStore, SHOP_ITEMS, type ShopItem } from "@/lib/game-store";
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
  Coins,
  ShoppingCart,
  CircleDot,
  Beaker,
  Pill,
  Gem,
  Sparkles,
  Minus,
  Plus,
  Check,
  X,
  Gift,
} from "lucide-react";
import { playBuy, playGift, playButtonClick } from "@/lib/sounds";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  pokeball: <CircleDot className="w-5 h-5 text-red-400" />,
  potion: <Beaker className="w-5 h-5 text-green-400" />,
  status: <Pill className="w-5 h-5 text-blue-400" />,
  stone: <Gem className="w-5 h-5 text-purple-400" />,
  rare: <Sparkles className="w-5 h-5 text-yellow-400" />,
};

const CATEGORY_LABELS: Record<string, string> = {
  pokeball: "Pokebolas",
  potion: "Pocoes & Cura",
  status: "Status & PP",
  stone: "Pedras de Evolucao",
  rare: "Itens Raros",
};

// Free items the master can give during the campaign
const GIFT_ITEMS = [
  { id: "potion", name: "Pocao", qty: 3 },
  { id: "super-potion", name: "Super Pocao", qty: 2 },
  { id: "hyper-potion", name: "Hyper Pocao", qty: 1 },
  { id: "revive", name: "Revive", qty: 1 },
  { id: "ether", name: "Ether", qty: 2 },
  { id: "max-ether", name: "Max Ether", qty: 1 },
  { id: "pokeball", name: "Pokeball", qty: 5 },
  { id: "great-ball", name: "Great Ball", qty: 3 },
  { id: "ultra-ball", name: "Ultra Ball", qty: 1 },
  { id: "rare-candy", name: "Rare Candy", qty: 1 },
  { id: "fire-stone", name: "Pedra de Fogo", qty: 1 },
  { id: "water-stone", name: "Pedra da Agua", qty: 1 },
  { id: "thunder-stone", name: "Pedra do Trovao", qty: 1 },
  { id: "leaf-stone", name: "Pedra da Folha", qty: 1 },
  { id: "moon-stone", name: "Pedra da Lua", qty: 1 },
  { id: "master-ball", name: "Master Ball", qty: 1 },
  { id: "full-heal", name: "Full Heal", qty: 2 },
];

export function ShopTab() {
  const { trainer, buyItem, bag, addBagItem } = useGameStore();
  const [buyDialog, setBuyDialog] = useState<ShopItem | null>(null);
  const [qty, setQty] = useState(1);
  const [result, setResult] = useState<"success" | "fail" | null>(null);
  const [showGifts, setShowGifts] = useState(false);
  const [giftFlash, setGiftFlash] = useState<string | null>(null);

  const categories = ["pokeball", "potion", "status", "stone", "rare"] as const;

  const handleBuy = () => {
    if (!buyDialog) return;
    const success = buyItem(buyDialog, qty);
    if (success) playBuy();
    setResult(success ? "success" : "fail");
    setTimeout(() => {
      setResult(null);
      if (success) {
        setBuyDialog(null);
        setQty(1);
      }
    }, 1200);
  };

  const handleGift = (itemId: string, giftQty: number) => {
    addBagItem(itemId, giftQty);
    playGift();
    setGiftFlash(itemId);
    setTimeout(() => setGiftFlash(null), 800);
  };

  const totalCost = buyDialog ? buyDialog.price * qty : 0;
  const canAfford = totalCost <= trainer.money;

  return (
    <div className="flex flex-col h-full">
      {/* Header with money display */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-foreground" />
          <h2 className="font-semibold text-foreground">Loja</h2>
        </div>
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowGifts(true)}
            className="border-accent/50 text-accent bg-transparent hover:bg-accent/10"
          >
            <Gift className="w-4 h-4 mr-1" />
            <span className="text-xs">Mestre</span>
          </Button>
          <div className="flex items-center gap-1.5 bg-secondary/50 rounded-full px-3 py-1.5">
            <Coins className="w-4 h-4 text-accent" />
            <span className="text-sm font-bold font-mono text-accent">
              {"$"}{trainer.money.toLocaleString("pt-BR")}
            </span>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-5 p-4">
          {categories.map((cat) => {
            const items = SHOP_ITEMS.filter((i) => i.category === cat);
            if (items.length === 0) return null;

            return (
              <div key={cat}>
                <div className="flex items-center gap-2 mb-2">
                  {CATEGORY_ICONS[cat]}
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {CATEGORY_LABELS[cat]}
                  </h3>
                </div>
                <div className="flex flex-col gap-1.5">
                  {items.map((item) => {
                    const owned = bag.find((b) => b.itemId === item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setBuyDialog(item);
                          setQty(1);
                          setResult(null);
                        }}
                        className="flex items-center justify-between bg-card rounded-lg border border-border p-3 transition-colors hover:border-primary/50 text-left"
                      >
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground">
                              {item.name}
                            </span>
                            {owned && (
                              <span className="text-[10px] bg-secondary text-muted-foreground rounded-full px-2 py-0.5">
                                x{owned.quantity}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-muted-foreground">
                            {item.description}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 ml-3">
                          <Coins className="w-3 h-3 text-accent" />
                          <span className="text-sm font-mono font-medium text-accent">
                            {"$"}{item.price.toLocaleString("pt-BR")}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Buy Dialog */}
      <Dialog
        open={!!buyDialog}
        onOpenChange={() => {
          setBuyDialog(null);
          setQty(1);
          setResult(null);
        }}
      >
        {buyDialog && (
          <DialogContent className="bg-card border-border text-foreground max-w-sm mx-auto">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                Comprar {buyDialog.name}
              </DialogTitle>
            </DialogHeader>

            {result === "success" ? (
              <div className="flex flex-col items-center gap-3 py-6">
                <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="w-7 h-7 text-green-400" />
                </div>
                <p className="text-sm font-medium text-green-400">
                  Compra realizada!
                </p>
              </div>
            ) : result === "fail" ? (
              <div className="flex flex-col items-center gap-3 py-6">
                <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center">
                  <X className="w-7 h-7 text-red-400" />
                </div>
                <p className="text-sm font-medium text-red-400">
                  Dinheiro insuficiente!
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">
                  {buyDialog.description}
                </p>

                {/* Quantity selector */}
                <div className="flex items-center justify-center gap-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="h-10 w-10 p-0 border-border text-foreground bg-transparent hover:bg-secondary"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-2xl font-bold font-mono text-foreground w-12 text-center">
                    {qty}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setQty(qty + 1)}
                    className="h-10 w-10 p-0 border-border text-foreground bg-transparent hover:bg-secondary"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Price breakdown */}
                <div className="bg-secondary/50 rounded-lg p-3 flex flex-col gap-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Preco unitario</span>
                    <span className="font-mono text-foreground">
                      {"$"}{buyDialog.price.toLocaleString("pt-BR")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span className="text-foreground">Total</span>
                    <span
                      className={`font-mono font-bold ${canAfford ? "text-accent" : "text-red-400"}`}
                    >
                      {"$"}{totalCost.toLocaleString("pt-BR")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs mt-1 pt-1 border-t border-border">
                    <span className="text-muted-foreground">Seu saldo</span>
                    <span className="font-mono text-muted-foreground">
                      {"$"}{trainer.money.toLocaleString("pt-BR")}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleBuy}
                  disabled={!canAfford}
                  className={`${
                    canAfford
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-secondary text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {canAfford ? "Comprar" : "Saldo insuficiente"}
                </Button>
              </div>
            )}
          </DialogContent>
        )}
      </Dialog>

      {/* Master Gift Dialog */}
      <Dialog open={showGifts} onOpenChange={setShowGifts}>
        <DialogContent className="bg-card border-border text-foreground max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <Gift className="w-5 h-5 text-accent" />
              Presentes do Mestre
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            O mestre pode dar itens gratuitos durante a campanha. Toque para adicionar a bolsa do jogador.
          </p>
          <ScrollArea className="max-h-80">
            <div className="grid grid-cols-2 gap-2">
              {GIFT_ITEMS.map((gift) => (
                <button
                  key={gift.id}
                  type="button"
                  onClick={() => handleGift(gift.id, gift.qty)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-all text-center ${
                    giftFlash === gift.id
                      ? "border-accent bg-accent/10"
                      : "border-border bg-secondary/50 hover:border-accent/50"
                  }`}
                >
                  {giftFlash === gift.id ? (
                    <Check className="w-5 h-5 text-accent" />
                  ) : (
                    <Gift className="w-5 h-5 text-muted-foreground" />
                  )}
                  <span className="text-xs font-medium text-foreground">{gift.name}</span>
                  <span className="text-[10px] text-muted-foreground">x{gift.qty}</span>
                </button>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}

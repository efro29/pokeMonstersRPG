"use client";

import React from "react";
import { useState } from "react";
import { useGameStore, SHOP_ITEMS, type ShopItem } from "@/lib/game-store";
import { useModeStore } from "@/lib/mode-store";
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
import { motion } from "framer-motion";

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
  const economyLocked = useModeStore((s) => s.economyLocked);
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
    if (economyLocked) return;
    addBagItem(itemId, giftQty);
    playGift();
    setGiftFlash(itemId);
    setTimeout(() => setGiftFlash(null), 800);
  };

  const totalCost = buyDialog ? buyDialog.price * qty : 0;
  const canAfford = totalCost <= trainer.money;

  return (
        <div className="flex flex-col h-full bg-[#0a0a0f] text-slate-200 font-sans select-none">
          {/* Header Gamer - Estilo Status Bar */}
          <div className="p-4 border-b-2 border-primary/20 bg-gradient-to-r from-primary/10 via-transparent to-transparent flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-sm border border-primary/50 shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                <ShoppingCart className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xs font-black tracking-[0.3em] uppercase text-primary-foreground/50">Marketplace</h2>
                <h2 className="font-black italic text-lg tracking-tighter text-white uppercase leading-none">PokeMart</h2>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {!economyLocked && (
                <button
                  onClick={() => setShowGifts(true)}
                  className="group relative px-3 py-1.5 flex items-center gap-2 transition-all active:scale-95"
                >
                  <div className="absolute inset-0 bg-accent/20 skew-x-[-15deg] border border-accent/50 group-hover:bg-accent/30" />
                  <Gift className="w-4 h-4 text-accent relative z-10" />
                  <span className="text-[10px] font-black italic uppercase text-accent relative z-10">Mestre</span>
                </button>
              )}
              
              {/* Saldo Estilo HUD */}
              <div className="relative px-4 py-2 flex items-center gap-2 bg-black/40 border-r-2 border-accent shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
                <Coins className="w-4 h-4 text-accent animate-pulse" />
                <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-accent/50 leading-none uppercase tracking-widest">Créditos</span>
                  <span className="text-sm font-black font-mono text-white tracking-widest">
                    {trainer.money.toLocaleString("pt-BR")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 px-4 py-6">
            <div className="flex flex-col gap-8 pb-10">
              {categories.map((cat) => {
                const items = SHOP_ITEMS.filter((i) => i.category === cat);
                if (items.length === 0) return null;

                return (
                  <div key={cat} className="relative">
                    {/* Header da Categoria */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-primary opacity-80">{CATEGORY_ICONS[cat]}</div>
                      <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-500 italic">
                        {CATEGORY_LABELS[cat]}
                      </h3>
                      <div className="flex-1 h-[1px] bg-gradient-to-r from-slate-800 to-transparent" />
                    </div>

                    <div className="grid gap-2">
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
                            className="group relative flex items-center justify-between p-4 bg-[#12121a] border border-white/5 hover:border-primary/50 transition-all hover:translate-x-1"
                            style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 95% 100%, 0 100%)" }}
                          >
                            {/* Efeito de hover no fundo */}
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            
                            <div className="flex flex-col gap-1 relative z-10 text-left">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-black italic uppercase text-white group-hover:text-primary transition-colors">
                                  {item.name}
                                </span>
                                {owned && (
                                  <span className="text-[9px] font-mono font-bold bg-white/10 text-white/50 px-2 py-0.5 rounded-sm border border-white/5">
                                    INSTOQUE: {owned.quantity}
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] leading-tight text-slate-500 font-medium max-w-[200px]">
                                {item.description}
                              </span>
                            </div>

                            <div className="flex flex-col items-end gap-1 relative z-10 shrink-0">
                              <div className="flex items-center gap-1.5 px-3 py-1 bg-black/40 border border-white/5 rounded-sm group-hover:border-accent/30 transition-all">
                                <span className="text-[10px] font-black text-accent">$</span>
                                <span className="text-sm font-black font-mono text-accent tracking-tighter">
                                  {item.price.toLocaleString("pt-BR")}
                                </span>
                              </div>
                              <span className="text-[8px] font-black text-white/20 uppercase italic tracking-widest">Comprar</span>
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

          {/* Buy Dialog Estilo Cyberpunk */}
          <Dialog open={!!buyDialog} onOpenChange={() => setBuyDialog(null)}>
            {buyDialog && (
              <DialogContent className="bg-[#0f0f15] border-2 border-primary/30 text-white max-w-sm rounded-none shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
                
                <DialogHeader>
                  <DialogTitle className="text-white font-black italic uppercase tracking-tighter text-xl">
                    Confirmar <span className="text-primary">Transação</span>
                  </DialogTitle>
                </DialogHeader>

                {result ? (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center gap-4 py-8"
                  >
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center border-2 ${result === "success" ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10"}`}>
                      {result === "success" ? <Check className="w-10 h-10 text-green-500" /> : <X className="w-10 h-10 text-red-500" />}
                    </div>
                    <p className={`font-black uppercase tracking-[0.2em] ${result === "success" ? "text-green-500" : "text-red-500"}`}>
                      {result === "success" ? "Sucesso no Sistema" : "Erro: Sem Créditos"}
                    </p>
                  </motion.div>
                ) : (
                  <div className="space-y-6">
                    <div className="p-4 bg-white/5 border-l-4 border-primary italic text-xs text-slate-400 leading-relaxed uppercase tracking-wider">
                      "{buyDialog.description}"
                    </div>

                    {/* Selector de Qtd Estilo HUD */}
                    <div className="flex items-center justify-between p-2 bg-black/40 border border-white/5">
                      <Button
                        variant="ghost"
                        onClick={() => setQty(Math.max(1, qty - 1))}
                        className="h-12 w-12 text-primary hover:bg-primary/20 rounded-none border border-white/5"
                      >
                        <Minus className="w-6 h-6" />
                      </Button>
                      <div className="flex flex-col items-center">
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em]">Quantidade</span>
                        <span className="text-3xl font-black font-mono text-white tracking-tighter leading-none">
                          {qty.toString().padStart(2, '0')}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        onClick={() => setQty(qty + 1)}
                        className="h-12 w-12 text-primary hover:bg-primary/20 rounded-none border border-white/5"
                      >
                        <Plus className="w-6 h-6" />
                      </Button>
                    </div>

                    {/* Resumo Estilo Recibo */}
                    <div className="space-y-2 border-y border-white/5 py-4">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        <span>Custo Total</span>
                        <span className={canAfford ? "text-accent" : "text-red-500"}>
                          {"$"}{totalCost.toLocaleString("pt-BR")}
                        </span>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        <span>Seu Saldo</span>
                        <span className="text-white/40 italic">
                          {"$"}{trainer.money.toLocaleString("pt-BR")}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={handleBuy}
                      disabled={!canAfford}
                      className={`w-full h-14 rounded-none font-black italic uppercase tracking-widest transition-all ${
                        canAfford 
                        ? "bg-primary text-white hover:bg-primary/80 shadow-[0_0_20px_rgba(59,130,246,0.4)]" 
                        : "bg-red-500/10 text-red-500/50 border border-red-500/20"
                      }`}
                      style={{ clipPath: "polygon(5% 0, 100% 0, 95% 100%, 0 100%)" }}
                    >
                      {canAfford ? "Confirmar Compra" : "Saldo Bloqueado"}
                    </Button>
                  </div>
                )}
              </DialogContent>
            )}
          </Dialog>
        </div>
  );
}

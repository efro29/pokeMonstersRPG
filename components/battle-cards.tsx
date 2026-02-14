"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/lib/game-store";
import type { BattleCard } from "@/lib/card-data";
import { ELEMENT_COLORS, ELEMENT_NAMES_PT } from "@/lib/card-data";
import {
  playCardDraw,
  playCardLuck,
  playCardBadLuck,
  playLuckTrio,
  playBadLuckTrio,
  playButtonClick,
} from "@/lib/sounds";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Flame,
  Droplets,
  Leaf,
  Zap,
  Snowflake,
  Mountain,
  Brain,
  Ghost,
  Star,
  Circle,
  Wind,
  Sword,
  Bug,
  Skull,
  Shield,
  Cog,
  Footprints,
} from "lucide-react";

// Element icon map
const ELEMENT_ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  fire: Flame,
  water: Droplets,
  grass: Leaf,
  electric: Zap,
  ice: Snowflake,
  rock: Mountain,
  psychic: Brain,
  ghost: Ghost,
  dragon: Star,
  normal: Circle,
  flying: Wind,
  fighting: Sword,
  poison: Skull,
  ground: Footprints,
  bug: Bug,
  dark: Shield,
  steel: Cog,
};

function ElementIcon({ element, className }: { element: string; className?: string }) {
  const Icon = ELEMENT_ICON_MAP[element] || Circle;
  return <Icon className={className} />;
}

// ============================================================
// YU-GI-OH STYLE CARD
// ============================================================
function YuGiOhCard({
  card,
  size = "small",
  onClick,
  slotIndex,
}: {
  card: BattleCard;
  size?: "small" | "large";
  onClick?: () => void;
  slotIndex?: number;
}) {
  const isLuck = card.alignment === "luck";
  const elColor = ELEMENT_COLORS[card.element] || "#888";
  const elName = ELEMENT_NAMES_PT[card.element] || card.element;

  // Color scheme
  const borderColor = isLuck ? "#e0dcce" : "#24065c";
  const outerBg = isLuck
    ? "linear-gradient(180deg, #e9e4d0 0%, #c5bfac 8%, #e7e2cf 92%, #ecebe5 100%)"
    : "linear-gradient(180deg, #502d5a 0%, #4a1547 8%, #2b0a3a 92%, #1A0505 100%)";
  const innerBg = isLuck
    ? "linear-gradient(180deg, #FFFDE0 0%, #e9e8e4 100%)"
    : "linear-gradient(180deg, #2D1515 0%, #1A0A0A 100%)";
  const textColor = isLuck ? "#3E2723" : "#E8C8C8";
  const subTextColor = isLuck ? "#5D4037" : "#B0888A";
  const nameBg = isLuck
    ? "linear-gradient(90deg, #F9F0D0 0%, #FFF8DC 50%, #F9F0D0 100%)"
    : "linear-gradient(90deg, #1d102a 0%, #33183a 50%, #21102a 100%)";

  if (size === "small") {
    return (
      <motion.button
        onClick={onClick}
        initial={{ rotateY: 180, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.06, y: -3 }}
        whileTap={{ scale: 0.97 }}
        className="relative flex flex-col rounded-[2px] overflow-hidden cursor-pointer"
        style={{
          width: 52,
          height: 76,
          background: outerBg,
          border: `1.5px solid ${borderColor}`,
          boxShadow: isLuck
            ? "0 2px 8px rgba(197,160,38,0.4), inset 0 1px 0 rgba(255,255,255,0.2)"
            : "0 2px 8px rgba(17, 1, 22, 0.6), inset 0 1px 0 rgba(42, 14, 54, 0.05)",
        }}
      >

        {isLuck?
      <>
        <div
          className="flex items-center justify-center gap-0.5 py-[2px]"
          style={{ background: `${elColor}33` }}
        > <span className="text-[3px] font-bold uppercase " style={{ color: 'black'}}>
            {card.name}
          </span>
        </div>
        <div style={{backgroundColor:'white'}}>
        <div
          className=" mflex items-center justify-center  overflow-hidden"
          style={{
            height: 28,
            background: innerBg,backgroundColor:'white'
          }}
        >
          <img
            src={`/images/cards/card${card.cardIndex}.png`}
            alt={card.name}
            className="w-full h-full object-cover"
            loading="eager"
            decoding="sync"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
              (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="text-[18px] leading-none drop-shadow-sm">${isLuck ? "\u2618" : "\u2620"}</span>`;
            }}
          />
        </div>
   

          <div
            className="mx-[3px] mt-[1px] mb-[2px] flex-1 px-1 py-[1px] rounded-[1px] flex justify-center items-center bg-white-200"
            style={{
              background: 'white',
              border: `0.5px solid ${borderColor}33`,
              minHeight: '30px' // Opcional: Garanta uma altura mínima se o container estiver "esmagado"
            }}
          >
            <img
              style={{ width: 20, borderRadius:4 }}
              src={`/images/cardsTypes/${card.element}.jpg`}
              alt={card.name}
              className="object-cover"
              loading="eager"
              decoding="sync"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                // Ao injetar o HTML do span, ele também herdará o alinhamento flex da div pai
                target.parentElement!.innerHTML = `<span class="text-[18px] leading-none drop-shadow-sm">${isLuck ? "\u2618" : "\u2620"}</span>`;
              }}
            />
          </div>
          </div>
</>
        : 
        
        
        
        
           <div
            className=" flex justify-center items-center bg-white-200"
            style={{ minHeight: '30px' }}>
            <img
          
              src={`/images/cardsTypes/genga.jpg`}
              alt={card.name}
              className="object-cover"
              loading="eager"
              decoding="sync"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                // Ao injetar o HTML do span, ele também herdará o alinhamento flex da div pai
                target.parentElement!.innerHTML = `<span class="text-[18px] leading-none drop-shadow-sm">${isLuck ? "\u2618" : "\u2620"}</span>`;
              }}
            />
          </div>
        
        }
      </motion.button>
    );
  }

  // LARGE card (dialog view)
  return (
    <motion.div
      initial={{ scale: 0.6, rotateY: 180 }}
      animate={{ scale: 1, rotateY: 0 }}
      transition={{ type: "spring", damping: 14 }}
      className="relative flex flex-col r overflow-hidden mx-auto"
      style={{
        height:350,
        width: 250,
        background: outerBg,
        border: `3px solid ${borderColor}`,
        boxShadow: isLuck
          ? "0 8px 32px rgba(236, 183, 6, 0.5), inset 0 2px 0 rgba(255,255,255,0.15)"
          : "0 8px 32px rgba(30, 2, 41, 0.7), inset 0 2px 0 rgba(255,255,255,0.05)",
      }}
    >
      {/* Element type strip */}
      <div
        className="flex items-center justify-between px-3 py-1.5"
        style={{ background: `${elColor}22` }}
      >
        <div className="flex items-center gap-1.5">
       
          
          {isLuck?
               <div className=" rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${elColor}33`, border: `1px solid ${elColor}66` }}
                 > 
            <img
              style={{ width: 20 }}
              src={`/images/cardsTypes/${card.element}.jpg`}
              alt={card.name}
              className="object-cover rounded-full"
              loading="eager"
              decoding="sync"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                // Ao injetar o HTML do span, ele também herdará o alinhamento flex da div pai
                target.parentElement!.innerHTML = `<span class="text-[18px] leading-none drop-shadow-sm">${isLuck ? "\u2618" : "\u2620"}</span>`;
              }}
            />
                </div>
            :
               <img
              style={{ width: 20 }}
              src={`/images/cardsTypes/genga.gif`}
              alt={card.name}
              className="object-cover rounded-full"
              loading="eager"
              decoding="sync"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                // Ao injetar o HTML do span, ele também herdará o alinhamento flex da div pai
                target.parentElement!.innerHTML = `<span class="text-[18px] leading-none drop-shadow-sm">${isLuck ? "\u2618" : "\u2620"}</span>`;
              }}
            />

          }
             
      
          <span className="text-sm font-bold  tracking-wider" style={{ color: isLuck?'green':'pink' }}>
                 {card.name} 
          </span>
        </div>
       
      </div>

      {/* Image area */}
      <div
        className=" mt-2 flex items-center justify-center rounded overflow-hidden"
        style={{
          height: 200,
          background: innerBg,
          border: `1.5px solid ${borderColor}88`,
        }}
      >
        <motion.img
          src={`/images/cards/card${card.cardIndex}.png`}
          alt={card.name}
          className="w-full h-full object-cover"
          loading="eager"
          decoding="sync"
          animate={{
            scale: [1, 1.04, 1],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
            const fallback = document.createElement("span");
            fallback.className = "text-6xl drop-shadow-lg";
            fallback.textContent = isLuck ? "\u2618" : "\u2620";
            (e.target as HTMLImageElement).parentElement!.appendChild(fallback);
          }}
        />
      </div>


      {/* Description box */}
      <div
        className="  rounded flex items-center justify-center min-h-[90px]"
        style={{
          background: innerBg,
          border: `1px solid ${borderColor}455`,
        }}
      >
        <p
          className="text-[10px] leading-relaxed text-center"
          style={{ color: subTextColor }}
        >
          {card.description}
        </p>
      </div>

    </motion.div>
  );
}

// ============================================================
// EMPTY SLOT
// ============================================================
function EmptySlot({ index }: { index: number }) {
  return (
    <div
      className="relative flex flex-col items-center justify-center rounded-[5px]"
      style={{
        width: 52,
        height: 76,
        background: "linear-gradient(180deg, rgba(30,30,30,0.6) 0%, rgba(20,20,20,0.8) 100%)",
        border: "1.5px dashed rgba(255,255,255,0.1)",
      }}
    >
      <span className="text-[9px] text-muted-foreground/30 font-mono">
                 <svg
                    width="20"
                    height="20"
                    viewBox="0 0 100 100"
                    className=""
                  >
                    <circle cx="50" cy="50" r="48" fill="#2b2424" stroke="#1E293B" strokeWidth="4" />
                    <rect x="2" y="48" width="96" height="4" fill="#1E293B" />
                    <path d="M 2 50 A 48 48 0 0 0 98 50" fill="#606264" />
                    <circle cx="50" cy="50" r="14" fill="#3c3d3d" stroke="#1E293B" strokeWidth="3" />
                    <circle cx="50" cy="50" r="6" fill={  "#1E293B"} />
                  </svg>
      
      </span>
    </div>
  );
}

// ============================================================
// CARD VIEWER DIALOG
// ============================================================
function CardViewer({
  card,
  open,
  onClose,
}: {
  card: BattleCard | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!card) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[260px] mx-auto p-4 overflow-visible border-none bg-transparent">
        <DialogHeader className="sr-only">
          <DialogTitle>{card.name}</DialogTitle>
          <DialogDescription>Detalhes da carta de batalha</DialogDescription>
        </DialogHeader>
        <YuGiOhCard card={card} size="large" />
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// REPLACE CARD MODAL (when 6th card drawn)
// ============================================================
function ReplaceCardModal({
  open,
  card,
  fieldCards,
  onReplace,
  onCancel,
}: {
  open: boolean;
  card: BattleCard | null;
  fieldCards: (BattleCard | null)[];
  onReplace: (slotIndex: number) => void;
  onCancel: () => void;
}) {
  if (!card) return null;

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="max-w-sm mx-auto bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle className="text-center text-base">Substituir uma carta de Sorte</DialogTitle>
          <DialogDescription className="text-center text-xs text-muted-foreground">
            Slots cheios! Escolha uma carta de Sorte para substituir. Cartas de Azar sao bloqueadas.
          </DialogDescription>
        </DialogHeader>

        {/* New card preview */}
        <div className="flex justify-center mb-3">
          <YuGiOhCard card={card} size="small" />
        </div>

        {/* Field cards to choose from */}
        <div className="flex gap-2 justify-center flex-wrap">
          {fieldCards.map((fieldCard, i) => {
            
            
            if (!fieldCard) return null;
            if (i == 4) return null;
            
            const isLocked = fieldCard.alignment === "bad-luck";
            return (
              <div key={i} className="relative">
                <div
                  className={`transition-all ${isLocked ? "opacity-30 pointer-events-none" : "cursor-pointer hover:ring-2 hover:ring-yellow-400 rounded-[5px]"}`}
                  onClick={() => !isLocked && onReplace(i)}
                >
                  <YuGiOhCard card={fieldCard} size="small" />
                </div>
                {isLocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-[5px]">
                    <span className="text-[8px] text-red-400 font-bold bg-background/80 px-1.5 py-0.5 rounded">BLOQ</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <Button variant="outline" size="sm" onClick={onCancel} className="mt-2 border-border text-foreground w-full">
          Cancelar
        </Button>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// TRIO EVENT OVERLAY
// ============================================================
function TrioEventOverlay() {
  const { battle, dismissTrioEvent } = useGameStore();
  const event = battle.cardTrioEvent;
  if (!event) return null;

  const isLuck = event.type === "luck";
  const effectName = event.hasAffinity ? event.effect.affinityName : event.effect.name;
  const effectDesc = event.hasAffinity ? event.effect.affinityDescription : event.effect.description;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: isLuck
          ? "radial-gradient(ellipse at center, rgba(197,160,38,0.3) 0%, rgba(0,0,0,0.92) 70%)"
          : "radial-gradient(ellipse at center, rgba(127,29,29,0.4) 0%, rgba(0,0,0,0.95) 70%)",
      }}
    >
      <motion.div
        animate={
          isLuck
            ? {}
            : { x: [0, -5, 5, -3, 3, -1, 1, 0], y: [0, 3, -3, 1, -1, 0] }
        }
        transition={{ duration: 0.5, repeat: 3 }}
        className="flex flex-col items-center gap-5 px-6"
      >
        {/* Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: isLuck
                  ? `hsl(${45 + Math.random() * 30}, 100%, ${60 + Math.random() * 30}%)`
                  : `hsl(${0 + Math.random() * 20}, 80%, ${30 + Math.random() * 20}%)`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                y: [0, (Math.random() - 0.5) * 200],
                x: [0, (Math.random() - 0.5) * 200],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random(),
              }}
            />
          ))}
        </div>

        {/* Title */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 8 }}
          className="text-center"
        >
          <motion.span
            className="text-5xl block mb-2"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {isLuck ? "\u2618\u2618\u2618" : 
            
            
            <>
            <div style={{display:'flex',justifyContent:'center'}}>

      
            <img
              style={{ width: 50 }}
              src={`/images/cardsTypes/genga.gif`}
              className="object-cover rounded-full"
              loading="eager"
              decoding="sync"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                // Ao injetar o HTML do span, ele também herdará o alinhamento flex da div pai
                target.parentElement!.innerHTML = `<span class="text-[18px] leading-none drop-shadow-sm">${isLuck ? "\u2618" : "\u2620"}</span>`;
              }}
            />
             <img
              style={{ width: 50 }}
              src={`/images/cardsTypes/genga.gif`}
              className="object-cover rounded-full"
              loading="eager"
              decoding="sync"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                // Ao injetar o HTML do span, ele também herdará o alinhamento flex da div pai
                target.parentElement!.innerHTML = `<span class="text-[18px] leading-none drop-shadow-sm">${isLuck ? "\u2618" : "\u2620"}</span>`;
              }}
            />
             <img
              style={{ width: 50 }}
              src={`/images/cardsTypes/genga.gif`}
              className="object-cover rounded-full"
              loading="eager"
              decoding="sync"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                // Ao injetar o HTML do span, ele também herdará o alinhamento flex da div pai
                target.parentElement!.innerHTML = `<span class="text-[18px] leading-none drop-shadow-sm">${isLuck ? "\u2618" : "\u2620"}</span>`;
              }}
            />
                  </div>
            </>
            
            
            
            
            
            
            }
          </motion.span>
          <h2
            className="text-2xl font-black tracking-wider"
            style={{
              color: isLuck ? "#D4AF37" : "#c86aff",
              textShadow: isLuck
                ? "0 0 30px rgba(212,175,55,0.5)"
                : "0 0 30px rgba(142, 68, 239, 0.5)",
            }}
          >
            {isLuck ? "SUPER VANTAGEM!" : "SUPER PUNICAO!"}
          </h2>
       
        </motion.div>

        {/* Affinity notice */}
        {event.hasAffinity && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="px-4 py-1.5 rounded-full text-xs font-bold"
            style={{
              background: isLuck ? "rgba(212,175,55,0.2)" : "rgba(128, 68, 239, 0.2)",
              color: isLuck ? "#FCD34D" : "#FCA5A5",
              border: `1px solid ${isLuck ? "rgba(212,175,55,0.4)" : "rgba(156, 68, 239, 0.4)"}`,
            }}
          >
            Afinidade Elemental - Efeito DOBRADO!
          </motion.div>
        )}

        {/* Effect card */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-xs rounded-xl p-5 text-center"
          style={{
            background: isLuck
              ? "linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.05) 100%)"
              : "linear-gradient(135deg, rgba(0, 0, 0, 0.15) 0%, rgba(15, 2, 36, 0.05) 100%)",
            border: `1px solid ${isLuck ? "rgba(212,175,55,0.3)" : "rgba(239,68,68,0.3)"}`,
          }}
        >
          <h3
            className="text-lg font-bold mb-1.5"
            style={{ color: isLuck ? "#FCD34D" : "#e8a5fc" }}
          >
            {effectName}
          </h3>
          <p className="text-sm text-foreground/80">{effectDesc}</p>
        </motion.div>

        {/* Dismiss */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
          <Button
            onClick={() => {
              playButtonClick();
              dismissTrioEvent();
            }}
            className="px-8 py-2"
            style={{
              backgroundColor: isLuck ? "#B8860B" : "#7b26dc",
              color: "#fff",
            }}
          >
            Continuar
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ============================================================
// MAIN BATTLE CARDS COMPONENT
// ============================================================
export function BattleCards() {
  const {
    battle,
    drawBattleCard,
    replaceCardInSlot,
  } = useGameStore();

  const [viewingCard, setViewingCard] = useState<BattleCard | null>(null);
  const [pendingCard, setPendingCard] = useState<BattleCard | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const fieldCards = battle.cardField;
  const hasEmptySlot = fieldCards.some((c) => c === null);
  const luckCount = fieldCards.filter((c) => c?.alignment === "luck").length;
  const badLuckCount = fieldCards.filter((c) => c?.alignment === "bad-luck").length;
  const penalty = battle.badLuckPenalty;

  const handleDraw = useCallback(() => {
    if (isDrawing) return;
    setIsDrawing(true);
    playCardDraw();

    const card = drawBattleCard();

    // Check if card ended up as lastDrawnCard (all slots full -> need replace)
    const state = useGameStore.getState();
    const cardNotPlaced = state.battle.lastDrawnCard?.id === card.id &&
      state.battle.cardField.every((c) => c !== null);

    setTimeout(() => {
      if (card.alignment === "luck") {
        playCardLuck();
      } else {
        playCardBadLuck();
      }

      if (cardNotPlaced) {
        // Need to replace a luck card
        setPendingCard(card);
      }

      // Check trio
      const currentState = useGameStore.getState();
      if (currentState.battle.cardTrioEvent) {
        if (currentState.battle.cardTrioEvent.type === "luck") {
          playLuckTrio();
        } else {
          playBadLuckTrio();
        }
      }

      setIsDrawing(false);
    }, 350);
  }, [isDrawing, drawBattleCard]);

  const handleReplace = (slotIndex: number) => {
    if (!pendingCard) return;
    replaceCardInSlot(slotIndex, pendingCard);
    setPendingCard(null);

    setTimeout(() => {
      const state = useGameStore.getState();
      if (state.battle.cardTrioEvent) {
        if (state.battle.cardTrioEvent.type === "luck") {
          playLuckTrio();
        } else {
          playBadLuckTrio();
        }
      }
    }, 100);
  };

  return (
    <>
      <div className="flex flex-col gap-1.5">
        {/* 5 card slots */}
        <div className="flex items-center justify-center gap-1.5">
          {fieldCards.map((card, i) => i == 4 ?'':
            card ? (
              <YuGiOhCard key={`${card.id}-${i}`} card={card} size="small" onClick={() => setViewingCard(card)} />
            ) : (
              <EmptySlot key={`empty-${i}`} index={i} />
            )
          )}
           <div
      className="relative flex flex-col items-center justify-center rounded-[5px]"
      style={{
        width: 52,
        height: 76,
        background: "linear-gradient(180deg, rgba(2, 2, 26, 0.6) 0%, rgba(1, 1, 3, 0.8) 100%)",
        borderColor: "rgb(7, 18, 119)",borderWidth:1
      }}
    >
      <span     onClick={handleDraw} className="text-[9px]  font-mono">
                 
      Compre
      </span>
    </div>
          
        </div>

        {/* Info strip + draw button */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-[9px]">
           
          </div>
          {/* <Button
            size="sm"
            onClick={handleDraw}
            disabled={isDrawing || !!battle.cardTrioEvent}
            className="h-6 text-[10px] px-3 rounded"
            style={{
              background: "linear-gradient(180deg, #D4AF37 0%, #B8860B 100%)",
              color: "#1a1a1a",
              fontWeight: 700,
              border: "1px solid #C5A026",
            }}
          >
            {isDrawing ? "..." : "Comprar Carta"}
          </Button> */}
        </div>
      </div>

      {/* Card viewer */}
      <CardViewer card={viewingCard} open={!!viewingCard} onClose={() => setViewingCard(null)} />

      {/* Replace modal (6th card drawn) */}
      <ReplaceCardModal
        open={!!pendingCard && !hasEmptySlot}
        card={pendingCard}
        fieldCards={fieldCards}
        onReplace={handleReplace}
        onCancel={() => setPendingCard(null)}
      />

      {/* Trio event overlay */}
      <AnimatePresence>
        {battle.cardTrioEvent && <TrioEventOverlay />}
      </AnimatePresence>
    </>
  );
}

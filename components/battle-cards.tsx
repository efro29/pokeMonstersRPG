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
  playCardActivateLuck,
  playCardActivateDamage,
  playCardActivateCritDamage,
  playTrioPunishment,
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
  Sparkles,
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
  glowing = false,
}: {
  card: BattleCard;
  size?: "small" | "large";
  onClick?: () => void;
  slotIndex?: number;
  glowing?: boolean;
}) {
  const isLuck = card.alignment === "luck";
  const isAuraElemental = card.alignment === "aura-elemental";
  const isAuraAmplificada = card.alignment === "aura-amplificada";
  const isAura = isAuraElemental || isAuraAmplificada;
  const elColor = isAura ? (isAuraAmplificada ? "#D4AF37" : "#C0C0C0") : (ELEMENT_COLORS[card.element] || "#888");
  const elName = ELEMENT_NAMES_PT[card.element] || card.element;

  // Color scheme based on card type
  const borderColor = isAuraAmplificada
    ? "#D4AF37"
    : isAuraElemental
    ? "#C0C0C0"
    : isLuck
    ? "#e0dcce"
    : "#24065c";

  const outerBg = isAuraAmplificada
    ? "linear-gradient(180deg, #D4AF37 0%, #B8860B 30%, #8B6914 70%, #D4AF37 100%)"
    : isAuraElemental
    ? "linear-gradient(180deg, #E8E8E8 0%, #C0C0C0 30%, #A8A8A8 70%, #D0D0D0 100%)"
    : isLuck
    ? "linear-gradient(180deg, #e9e4d0 0%, #c5bfac 8%, #e7e2cf 92%, #ecebe5 100%)"
    : "linear-gradient(180deg, #502d5a 0%, #4a1547 8%, #2b0a3a 92%, #1A0505 100%)";

  const innerBg = isAura
    ? (isAuraAmplificada ? "linear-gradient(180deg, #3a2a00 0%, #1a1200 100%)" : "linear-gradient(180deg, #f0f0f0 0%, #d8d8d8 100%)")
    : isLuck
    ? "linear-gradient(180deg, #FFFDE0 0%, #e9e8e4 100%)"
    : "linear-gradient(180deg, #2D1515 0%, #1A0A0A 100%)";
  const subTextColor = isLuck ? "#5D4037" : "#B0888A";

  // Glow animation for matching cards
  const glowShadow = glowing
    ? `0 0 8px 2px ${elColor}, 0 0 16px 4px ${elColor}88`
    : "";

  if (size === "small") {
    // -- AURA cards small rendering --
    if (isAura) {
      return (
        <motion.button
          onClick={onClick}
          initial={{ rotateY: 180, opacity: 0 }}
          animate={{
            rotateY: 0,
            opacity: 1,
            boxShadow: isAuraAmplificada
              ? [
                  "0 0 6px 2px rgba(212,175,55,0.6), 0 0 20px 6px rgba(212,175,55,0.3)",
                  "0 0 12px 4px rgba(212,175,55,0.9), 0 0 30px 10px rgba(212,175,55,0.5)",
                  "0 0 6px 2px rgba(212,175,55,0.6), 0 0 20px 6px rgba(212,175,55,0.3)",
                ]
              : [
                  "0 0 6px 2px rgba(192,192,192,0.5), 0 0 18px 5px rgba(192,192,192,0.25)",
                  "0 0 10px 3px rgba(192,192,192,0.8), 0 0 25px 8px rgba(192,192,192,0.4)",
                  "0 0 6px 2px rgba(192,192,192,0.5), 0 0 18px 5px rgba(192,192,192,0.25)",
                ],
          }}
          transition={{
            duration: 0.5,
            boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
          whileHover={{ scale: 1.06, y: -3 }}
          whileTap={{ scale: 0.97 }}
          className="relative flex flex-col rounded-[2px] overflow-hidden cursor-pointer"
          style={{
            width: 52,
            height: 76,
            background: outerBg,
            border: `1.5px solid ${borderColor}`,
          }}
        >
          <div
            className="flex items-center justify-center py-[2px]"
            style={{ background: isAuraAmplificada ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.3)" }}
          >
            <span
              className="text-[3px] font-bold uppercase"
              style={{ color: isAuraAmplificada ? "#FFD700" : "#333" }}
            >
              {card.name}
            </span>
          </div>
          <div
            className="flex items-center justify-center overflow-hidden"
            style={{ height: 50 }}
          >
            <img
              src={isAuraAmplificada ? "/images/cards/aura-amplificada.jpg" : "/images/cards/aura-elemental.jpg"}
              alt={card.name}
              className="w-full h-full object-cover"
              loading="eager"
              decoding="sync"
            />
          </div>
          <div
            className="flex items-center justify-center py-[2px]"
            style={{ background: isAuraAmplificada ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)" }}
          >
            <Sparkles className="w-2 h-2" style={{ color: isAuraAmplificada ? "#FFD700" : "#888" }} />
          </div>
        </motion.button>
      );
    }

    // -- Normal luck/bad-luck small rendering --
    return (
      <motion.button
        onClick={onClick}
        initial={{ rotateY: 180, opacity: 0 }}
        animate={{
          rotateY: 0,
          opacity: 1,
          ...(glowing && {
            boxShadow: [
              `0 2px 8px ${elColor}66`,
              `0 0 12px 4px ${elColor}AA, 0 0 20px 6px ${elColor}55`,
              `0 2px 8px ${elColor}66`,
            ],
          }),
        }}
        transition={{
          duration: 0.5,
          ...(glowing && { boxShadow: { duration: 1.5, repeat: Infinity, ease: "easeInOut" } }),
        }}
        whileHover={{ scale: 1.06, y: -3 }}
        whileTap={{ scale: 0.97 }}
        className="relative flex flex-col rounded-[2px] overflow-hidden cursor-pointer"
        style={{
          width: 52,
          height: 76,
          background: outerBg,
          border: `1.5px solid ${glowing ? elColor : borderColor}`,
          boxShadow: !glowing
            ? (isLuck
              ? "0 2px 8px rgba(197,160,38,0.4), inset 0 1px 0 rgba(255,255,255,0.2)"
              : "0 2px 8px rgba(17, 1, 22, 0.6), inset 0 1px 0 rgba(42, 14, 54, 0.05)")
            : undefined,
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
              minHeight: '30px'
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
                target.parentElement!.innerHTML = `<span class="text-[18px] leading-none drop-shadow-sm">${isLuck ? "\u2618" : "\u2620"}</span>`;
              }}
            />
          </div>
        }
      </motion.button>
    );
  }

  // LARGE card (dialog view)
  const largeCardImage = isAuraAmplificada
    ? "/images/cards/aura-amplificada.jpg"
    : isAuraElemental
    ? "/images/cards/aura-elemental.jpg"
    : `/images/cards/card${card.cardIndex}.png`;

  const largeShadow = isAuraAmplificada
    ? "0 8px 40px rgba(212,175,55,0.7), 0 0 60px rgba(212,175,55,0.3), inset 0 2px 0 rgba(255,255,255,0.15)"
    : isAuraElemental
    ? "0 8px 40px rgba(192,192,192,0.6), 0 0 50px rgba(192,192,192,0.25), inset 0 2px 0 rgba(255,255,255,0.15)"
    : isLuck
    ? "0 8px 32px rgba(236, 183, 6, 0.5), inset 0 2px 0 rgba(255,255,255,0.15)"
    : "0 8px 32px rgba(30, 2, 41, 0.7), inset 0 2px 0 rgba(255,255,255,0.05)";

  const nameColor = isAuraAmplificada ? "#FFD700" : isAuraElemental ? "#555" : isLuck ? "green" : "pink";

  return (
    <motion.div
      initial={{ scale: 0.6, rotateY: 180 }}
      animate={{ scale: 1, rotateY: 0 }}
      transition={{ type: "spring", damping: 14 }}
      className="relative flex flex-col overflow-hidden mx-auto"
      style={{
        height: 350,
        width: 250,
        background: outerBg,
        border: `3px solid ${borderColor}`,
        boxShadow: largeShadow,
      }}
    >
      {/* Element type strip */}
      <div
        className="flex items-center justify-between px-3 py-1.5"
        style={{ background: `${elColor}22` }}
      >
        <div className="flex items-center gap-1.5">
          {isAura ? (
            <Sparkles className="w-5 h-5" style={{ color: isAuraAmplificada ? "#FFD700" : "#999" }} />
          ) : isLuck ? (
            <div
              className="rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${elColor}33`, border: `1px solid ${elColor}66` }}
            >
              <img
                style={{ width: 20 }}
                src={`/images/cardsTypes/${card.element}.jpg`}
                alt={card.name}
                className="object-cover rounded-full"
                loading="eager"
                decoding="sync"
              />
            </div>
          ) : (
            <img
              style={{ width: 20 }}
              src="/images/cardsTypes/genga.gif"
              alt={card.name}
              className="object-cover rounded-full"
              loading="eager"
              decoding="sync"
            />
          )}

          <span className="text-sm font-bold tracking-wider" style={{ color: nameColor }}>
            {card.name}
          </span>
        </div>
      </div>

      {/* Image area */}
      <div
        className="mt-2 flex items-center justify-center rounded overflow-hidden"
        style={{
          height: 200,
          background: innerBg,
          border: `1.5px solid ${borderColor}88`,
        }}
      >
        <motion.img
          src={largeCardImage}
          alt={card.name}
          className="w-full h-full object-cover"
          loading="eager"
          decoding="sync"
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>

      {/* Description box */}
      <div
        className="rounded flex items-center justify-center min-h-[90px] px-3"
        style={{
          background: innerBg,
          border: `1px solid ${borderColor}45`,
        }}
      >
        <p
          className="text-[10px] leading-relaxed text-center"
          style={{ color: isAuraAmplificada ? "#FFD700" : isAuraElemental ? "#666" : subTextColor }}
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
  slotIndex,
}: {
  card: BattleCard | null;
  open: boolean;
  onClose: () => void;
  slotIndex?: number;
}) {
  const { activateCardEffect } = useGameStore();
  
  if (!card) return null;

  const handleActivatePower = () => {
    if (slotIndex !== undefined) {
      const result = activateCardEffect(slotIndex);
      // Play the correct sound based on card type and crit
      if (result) {
        if (result.alignment === "bad-luck") {
          if (result.isCrit) {
            playCardActivateCritDamage();
          } else {
            playCardActivateDamage();
          }
        } else {
          playCardActivateLuck();
        }
      }
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[260px] mx-auto p-4 overflow-visible border-none bg-transparent">
        <DialogHeader className="sr-only">
          <DialogTitle>{card.name}</DialogTitle>
          <DialogDescription>Detalhes da carta de batalha</DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-3">
          <YuGiOhCard card={card} size="large" />
          
          {slotIndex !== undefined && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                onClick={handleActivatePower}
                className={`w-full font-bold text-sm transition-all ${
                  card.alignment === "bad-luck"
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {card.alignment === "bad-luck" ? "Ativar Maldicao" : "Ativar Poder"}
              </Button>
            </motion.div>
          )}
        </div>
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
            const isLocked = fieldCard.alignment === "bad-luck" || fieldCard.alignment === "aura-elemental" || fieldCard.alignment === "aura-amplificada";
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
              if (!isLuck) {
                playTrioPunishment();
              } else {
                playButtonClick();
              }
              dismissTrioEvent();
            }}
            className="px-8 py-2"
            style={{
              backgroundColor: isLuck ? "#B8860B" : "#7b26dc",
              color: "#fff",
            }}
          >
            {isLuck ? "Continuar" : "Receber Punicao (-20 HP)"}
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
  const [viewingCardSlotIndex, setViewingCardSlotIndex] = useState<number | undefined>(undefined);
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

  // Compute which elements have duplicates on the field for glow effect
  const elementCounts: Record<string, number> = {};
  for (const card of fieldCards) {
    if (card && card.alignment === "luck") {
      elementCounts[card.element] = (elementCounts[card.element] || 0) + 1;
    }
  }
  // Elements with 2+ cards should glow
  const glowingElements = new Set(
    Object.entries(elementCounts)
      .filter(([, count]) => count >= 2)
      .map(([el]) => el)
  );

  return (
    <>
      <div className="flex flex-col gap-1.5">
        {/* 6 card slots + draw button */}
        <div className="flex items-center justify-center gap-1">
          {fieldCards.map((card, i) =>
            card ? (
              <YuGiOhCard 
                key={`${card.id}-${i}`} 
                card={card} 
                size="small" 
                onClick={() => {
                  setViewingCard(card);
                  setViewingCardSlotIndex(i);
                }} 
                slotIndex={i}
                glowing={card.alignment === "luck" && glowingElements.has(card.element)}
              />
            ) : (
              <EmptySlot key={`empty-${i}`} index={i} />
            )
          )}
          <div
            onClick={handleDraw}
            className="relative flex flex-col items-center justify-center rounded-[5px]"
            style={{
              cursor: "pointer",
              width: 52,
              height: 76,
              background: "linear-gradient(180deg, rgba(2, 2, 26, 0.6) 0%, rgba(1, 1, 3, 0.8) 100%)",
              borderColor: "rgb(7, 18, 119)",
              borderWidth: 1,
            }}
          >
            <span className="text-[9px] font-mono">Compre</span>
          </div>
        </div>
      </div>

      {/* Card viewer */}
      <CardViewer 
        card={viewingCard} 
        open={!!viewingCard} 
        onClose={() => {
          setViewingCard(null);
          setViewingCardSlotIndex(undefined);
        }}
        slotIndex={viewingCardSlotIndex}
      />

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

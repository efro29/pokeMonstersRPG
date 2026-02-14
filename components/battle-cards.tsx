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
}: {
  card: BattleCard;
  size?: "small" | "large";
  onClick?: () => void;
}) {
  const isLuck = card.alignment === "luck";
  const elColor = ELEMENT_COLORS[card.element] || "#888";
  const elName = ELEMENT_NAMES_PT[card.element] || card.element;

  // Color scheme
  const borderColor = isLuck ? "#C5A026" : "#5A1A1A";
  const outerBg = isLuck
    ? "linear-gradient(180deg, #F5E6A3 0%, #D4AF37 8%, #C5A026 92%, #8B7118 100%)"
    : "linear-gradient(180deg, #5A2D2D 0%, #4A1515 8%, #3A0A0A 92%, #1A0505 100%)";
  const innerBg = isLuck
    ? "linear-gradient(180deg, #FFFDE0 0%, #FFF9C4 100%)"
    : "linear-gradient(180deg, #2D1515 0%, #1A0A0A 100%)";
  const textColor = isLuck ? "#3E2723" : "#E8C8C8";
  const subTextColor = isLuck ? "#5D4037" : "#B0888A";
  const nameBg = isLuck
    ? "linear-gradient(90deg, #F9F0D0 0%, #FFF8DC 50%, #F9F0D0 100%)"
    : "linear-gradient(90deg, #2A1010 0%, #3A1818 50%, #2A1010 100%)";

  if (size === "small") {
    return (
      <motion.button
        onClick={onClick}
        initial={{ rotateY: 180, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.06, y: -3 }}
        whileTap={{ scale: 0.97 }}
        className="relative flex flex-col rounded-[5px] overflow-hidden cursor-pointer"
        style={{
          width: 52,
          height: 76,
          background: outerBg,
          border: `1.5px solid ${borderColor}`,
          boxShadow: isLuck
            ? "0 2px 8px rgba(197,160,38,0.4), inset 0 1px 0 rgba(255,255,255,0.2)"
            : "0 2px 8px rgba(90,26,26,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {/* Element type strip at top */}
        <div
          className="flex items-center justify-center gap-0.5 py-[2px]"
          style={{ background: `${elColor}33` }}
        >
          <ElementIcon element={card.element} className="w-2.5 h-2.5" />
          <span className="text-[6px] font-bold uppercase" style={{ color: elColor }}>
            {elName}
          </span>
        </div>

        {/* Image area */}
        <div
          className="mx-[3px] mt-[2px] flex items-center justify-center rounded-[2px]"
          style={{
            height: 28,
            background: innerBg,
            border: `0.5px solid ${borderColor}55`,
          }}
        >
          <span className="text-[18px] leading-none drop-shadow-sm">
            {isLuck ? "\u2618" : "\u2620"}
          </span>
        </div>

        {/* Name */}
        <div
          className="mx-[3px] mt-[2px] px-1 py-[1px] rounded-[1px] text-center"
          style={{ background: nameBg }}
        >
          <span
            className="text-[5.5px] font-bold leading-tight block truncate"
            style={{ color: textColor }}
          >
            {card.name}
          </span>
        </div>

        {/* Description area */}
        <div
          className="mx-[3px] mt-[1px] mb-[2px] flex-1 px-1 py-[1px] rounded-[1px] flex items-center"
          style={{
            background: innerBg,
            border: `0.5px solid ${borderColor}33`,
          }}
        >
          <span
            className="text-[4.5px] leading-[1.3] text-center w-full line-clamp-2"
            style={{ color: subTextColor }}
          >
            {card.description}
          </span>
        </div>

        {/* Bad luck lock indicator */}
        {!isLuck && (
          <div className="absolute bottom-[1px] right-[2px]">
            <span className="text-[5px] text-red-400/80">X</span>
          </div>
        )}
      </motion.button>
    );
  }

  // LARGE card (dialog view)
  return (
    <motion.div
      initial={{ scale: 0.6, rotateY: 180 }}
      animate={{ scale: 1, rotateY: 0 }}
      transition={{ type: "spring", damping: 14 }}
      className="relative flex flex-col rounded-lg overflow-hidden mx-auto"
      style={{
        width: 220,
        background: outerBg,
        border: `3px solid ${borderColor}`,
        boxShadow: isLuck
          ? "0 8px 32px rgba(197,160,38,0.5), inset 0 2px 0 rgba(255,255,255,0.15)"
          : "0 8px 32px rgba(90,26,26,0.7), inset 0 2px 0 rgba(255,255,255,0.05)",
      }}
    >
      {/* Element type strip */}
      <div
        className="flex items-center justify-between px-3 py-1.5"
        style={{ background: `${elColor}22` }}
      >
        <div className="flex items-center gap-1.5">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${elColor}33`, border: `1px solid ${elColor}66` }}
          >
            <ElementIcon element={card.element} className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: elColor }}>
            {elName}
          </span>
        </div>
        <span
          className="text-[9px] font-bold px-2 py-0.5 rounded-full"
          style={{
            background: isLuck ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)",
            color: isLuck ? "#4ADE80" : "#F87171",
            border: `1px solid ${isLuck ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
          }}
        >
          {isLuck ? "SORTE" : "AZAR"}
        </span>
      </div>

      {/* Image area */}
      <div
        className="mx-3 mt-2 flex items-center justify-center rounded"
        style={{
          height: 120,
          background: innerBg,
          border: `1.5px solid ${borderColor}88`,
        }}
      >
        <motion.span
          className="text-6xl drop-shadow-lg"
          animate={{
            scale: [1, 1.08, 1],
            rotate: isLuck ? [0, 3, -3, 0] : [0, -2, 2, 0],
          }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          {isLuck ? "\u2618" : "\u2620"}
        </motion.span>
      </div>

      {/* Name bar */}
      <div
        className="mx-3 mt-2 px-3 py-1.5 rounded text-center"
        style={{ background: nameBg, border: `1px solid ${borderColor}44` }}
      >
        <h3 className="text-sm font-bold tracking-wide" style={{ color: textColor }}>
          {card.name}
        </h3>
      </div>

      {/* Description box */}
      <div
        className="mx-3 mt-1.5 mb-3 px-3 py-2 rounded flex items-center justify-center min-h-[48px]"
        style={{
          background: innerBg,
          border: `1px solid ${borderColor}44`,
        }}
      >
        <p
          className="text-xs leading-relaxed text-center"
          style={{ color: subTextColor }}
        >
          {card.description}
        </p>
      </div>

      {/* Bad luck penalty notice */}
      {!isLuck && (
        <div
          className="mx-3 mb-2 py-1.5 px-2 rounded text-center"
          style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.2)" }}
        >
          <span className="text-[9px] text-red-400">
            -2 dano (ou -4 se mesmo tipo) | Nao pode ser substituida
          </span>
        </div>
      )}
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
      <span className="text-[9px] text-muted-foreground/30 font-mono">{index + 1}</span>
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
            {isLuck ? "\u2618\u2618\u2618" : "\u2620\u2620\u2620"}
          </motion.span>
          <h2
            className="text-2xl font-black tracking-wider"
            style={{
              color: isLuck ? "#D4AF37" : "#EF4444",
              textShadow: isLuck
                ? "0 0 30px rgba(212,175,55,0.5)"
                : "0 0 30px rgba(239,68,68,0.5)",
            }}
          >
            {isLuck ? "SUPER VANTAGEM!" : "SUPER PUNICAO!"}
          </h2>
          {!isLuck && (
            <p className="text-xs text-red-400/70 mt-1">
              Todos os slots serao limpos!
            </p>
          )}
        </motion.div>

        {/* Affinity notice */}
        {event.hasAffinity && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="px-4 py-1.5 rounded-full text-xs font-bold"
            style={{
              background: isLuck ? "rgba(212,175,55,0.2)" : "rgba(239,68,68,0.2)",
              color: isLuck ? "#FCD34D" : "#FCA5A5",
              border: `1px solid ${isLuck ? "rgba(212,175,55,0.4)" : "rgba(239,68,68,0.4)"}`,
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
              : "linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(239,68,68,0.05) 100%)",
            border: `1px solid ${isLuck ? "rgba(212,175,55,0.3)" : "rgba(239,68,68,0.3)"}`,
          }}
        >
          <h3
            className="text-lg font-bold mb-1.5"
            style={{ color: isLuck ? "#FCD34D" : "#FCA5A5" }}
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
              backgroundColor: isLuck ? "#B8860B" : "#DC2626",
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
          {fieldCards.map((card, i) =>
            card ? (
              <YuGiOhCard key={`${card.id}-${i}`} card={card} size="small" onClick={() => setViewingCard(card)} />
            ) : (
              <EmptySlot key={`empty-${i}`} index={i} />
            )
          )}
        </div>

        {/* Info strip + draw button */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-[9px]">
            {luckCount > 0 && (
              <span className="text-yellow-500 font-mono font-bold">
                Sorte: {luckCount}
              </span>
            )}
            {badLuckCount > 0 && (
              <span className="text-red-400 font-mono font-bold">
                Azar: {badLuckCount}
              </span>
            )}
            {penalty < 0 && (
              <span className="text-red-300/80 font-mono text-[8px]">
                ({penalty} dano)
              </span>
            )}
            {luckCount === 2 && (
              <span className="text-yellow-400/80 animate-pulse text-[8px]">
                Falta 1 p/ Trio!
              </span>
            )}
            {badLuckCount === 2 && (
              <span className="text-red-400/80 animate-pulse text-[8px]">
                Perigo! 2/3 azar
              </span>
            )}
          </div>
          <Button
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
          </Button>
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

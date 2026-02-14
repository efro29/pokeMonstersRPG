"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/lib/game-store";
import type { BattleCard } from "@/lib/card-data";
import { ELEMENT_COLORS } from "@/lib/card-data";
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
};

function ElementIcon({ element, className }: { element: string; className?: string }) {
  const Icon = ELEMENT_ICON_MAP[element] || Circle;
  return <Icon className={className} />;
}

// -- Card Slot Component --
function CardSlot({
  card,
  index,
  onClick,
}: {
  card: BattleCard | null;
  index: number;
  onClick: (card: BattleCard) => void;
}) {
  if (!card) {
    return (
      <div className="w-14 h-20 rounded-lg border border-dashed border-muted-foreground/30 bg-secondary/20 flex items-center justify-center">
        <span className="text-[9px] text-muted-foreground/40">{index + 1}</span>
      </div>
    );
  }

  const isLuck = card.alignment === "luck";
  const bgColor = isLuck ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)";
  const borderColor = isLuck ? "rgba(34,197,94,0.5)" : "rgba(239,68,68,0.5)";
  const locked = card.alignment === "bad-luck";

  return (
    <motion.button
      initial={{ rotateY: 180, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      onClick={() => onClick(card)}
      className="relative w-14 h-20 rounded-lg flex flex-col items-center justify-center gap-0.5 cursor-pointer hover:scale-105 transition-transform"
      style={{
        background: bgColor,
        border: `1.5px solid ${borderColor}`,
      }}
    >
      {/* Element icon - top left */}
      <div className="absolute top-0.5 left-0.5">
        <ElementIcon
          element={card.element}
          className="w-3 h-3"
          // @ts-expect-error - style is valid
          style={{ color: ELEMENT_COLORS[card.element] }}
        />
      </div>

      {/* Lock badge for bad luck */}
      {locked && (
        <div className="absolute top-0.5 right-0.5">
          <span className="text-[7px] text-red-400">X</span>
        </div>
      )}

      {/* Alignment symbol */}
      <span className="text-lg leading-none">
        {isLuck ? "\u2618" : "\u2620"}
      </span>

      {/* Card name */}
      <span className="text-[7px] text-center leading-tight text-foreground/80 px-0.5 line-clamp-2">
        {card.name}
      </span>
    </motion.button>
  );
}

// -- Card Viewer Dialog --
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
  const isLuck = card.alignment === "luck";
  const bgGradient = isLuck
    ? "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)"
    : "linear-gradient(135deg, #450a0a 0%, #7f1d1d 50%, #991b1b 100%)";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[280px] mx-auto p-0 overflow-hidden border-none bg-transparent">
        <DialogHeader className="sr-only">
          <DialogTitle>{card.name}</DialogTitle>
          <DialogDescription>Detalhes da carta de batalha</DialogDescription>
        </DialogHeader>
        <motion.div
          initial={{ scale: 0.5, rotateY: 180 }}
          animate={{ scale: 1, rotateY: 0 }}
          transition={{ type: "spring", damping: 15 }}
          className="relative rounded-xl overflow-hidden"
          style={{ background: bgGradient }}
        >
          {/* Top-left element icon */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${ELEMENT_COLORS[card.element]}33` }}
            >
              <ElementIcon
                element={card.element}
                className="w-5 h-5"
              />
            </div>
            <span className="text-xs font-bold text-white/80 capitalize">
              {card.element}
            </span>
          </div>

          {/* Alignment badge */}
          <div className="absolute top-3 right-3">
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                isLuck
                  ? "bg-green-500/30 text-green-300"
                  : "bg-red-500/30 text-red-300"
              }`}
            >
              {isLuck ? "Sorte" : "Azar"}
            </span>
          </div>

          {/* Center alignment symbol */}
          <div className="flex flex-col items-center justify-center py-12 px-6">
            <motion.span
              className="text-7xl mb-3"
              animate={{
                scale: [1, 1.1, 1],
                rotate: isLuck ? [0, 5, -5, 0] : [0, -3, 3, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {isLuck ? "\u2618" : "\u2620"}
            </motion.span>
            <h3 className="text-xl font-bold text-white text-center mb-2">
              {card.name}
            </h3>
            <p className="text-sm text-white/70 text-center leading-relaxed">
              {card.description}
            </p>
          </div>

          {/* Bad luck lock notice */}
          {!isLuck && (
            <div className="mx-4 mb-4 bg-red-900/40 rounded-lg py-1.5 px-3 text-center">
              <span className="text-[10px] text-red-300/80">
                Carta bloqueada - nao pode ser substituida
              </span>
            </div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

// -- Replace Card Modal --
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
  const isLuck = card.alignment === "luck";

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="max-w-sm mx-auto bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle>Substituir Carta</DialogTitle>
          <DialogDescription>
            Escolha uma carta para substituir. Cartas de Azar nao podem ser substituidas.
          </DialogDescription>
        </DialogHeader>
        <div className="mb-3 flex items-center gap-2 p-3 rounded-lg" style={{
          background: isLuck ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
          border: `1px solid ${isLuck ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
        }}>
          <span className="text-2xl">{isLuck ? "\u2618" : "\u2620"}</span>
          <div>
            <p className="text-sm font-bold">{card.name}</p>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </div>
        </div>
        <div className="flex gap-2 justify-center">
          {fieldCards.map((fieldCard, i) => {
            if (!fieldCard) return null;
            const isFieldLuck = fieldCard.alignment === "luck";
            const isLocked = fieldCard.alignment === "bad-luck";
            return (
              <button
                key={i}
                onClick={() => !isLocked && onReplace(i)}
                disabled={isLocked}
                className={`relative w-14 h-20 rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all ${
                  isLocked
                    ? "opacity-40 cursor-not-allowed"
                    : "cursor-pointer hover:ring-2 hover:ring-accent"
                }`}
                style={{
                  background: isFieldLuck ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                  border: `1.5px solid ${isFieldLuck ? "rgba(34,197,94,0.5)" : "rgba(239,68,68,0.5)"}`,
                }}
              >
                <span className="text-lg">{isFieldLuck ? "\u2618" : "\u2620"}</span>
                <span className="text-[7px] text-center leading-tight text-foreground/80 px-0.5 line-clamp-2">
                  {fieldCard.name}
                </span>
                {isLocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-lg">
                    <span className="text-[9px] text-red-400 font-bold">BLOQ</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
        <Button variant="outline" onClick={onCancel} className="mt-2 border-border text-foreground">
          Cancelar
        </Button>
      </DialogContent>
    </Dialog>
  );
}

// -- Trio Event Overlay --
function TrioEventOverlay() {
  const { battle, dismissTrioEvent } = useGameStore();
  const event = battle.cardTrioEvent;
  if (!event) return null;

  const isLuck = event.type === "luck";
  const effectName = event.hasAffinity
    ? event.effect.affinityName
    : event.effect.name;
  const effectDesc = event.hasAffinity
    ? event.effect.affinityDescription
    : event.effect.description;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: isLuck
          ? "radial-gradient(ellipse at center, rgba(234,179,8,0.3) 0%, rgba(0,0,0,0.9) 70%)"
          : "radial-gradient(ellipse at center, rgba(127,29,29,0.4) 0%, rgba(0,0,0,0.95) 70%)",
      }}
    >
      {/* Screen shake for bad luck */}
      <motion.div
        animate={
          isLuck
            ? {}
            : {
                x: [0, -4, 4, -3, 3, -1, 1, 0],
                y: [0, 2, -2, 1, -1, 0],
              }
        }
        transition={{ duration: 0.5, repeat: 2 }}
        className="flex flex-col items-center gap-6 px-6"
      >
        {/* Particle effects */}
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
                delay: Math.random() * 1,
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
            className="text-6xl block mb-2"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {isLuck ? "\u2618\u2618\u2618" : "\u2620\u2620\u2620"}
          </motion.span>
          <h2
            className="text-3xl font-black tracking-wider"
            style={{
              color: isLuck ? "#F59E0B" : "#EF4444",
              textShadow: isLuck
                ? "0 0 30px rgba(245,158,11,0.5)"
                : "0 0 30px rgba(239,68,68,0.5)",
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
              background: isLuck ? "rgba(245,158,11,0.2)" : "rgba(239,68,68,0.2)",
              color: isLuck ? "#FCD34D" : "#FCA5A5",
              border: `1px solid ${isLuck ? "rgba(245,158,11,0.4)" : "rgba(239,68,68,0.4)"}`,
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
              ? "linear-gradient(135deg, rgba(234,179,8,0.15) 0%, rgba(234,179,8,0.05) 100%)"
              : "linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(239,68,68,0.05) 100%)",
            border: `1px solid ${isLuck ? "rgba(234,179,8,0.3)" : "rgba(239,68,68,0.3)"}`,
          }}
        >
          <h3
            className="text-xl font-bold mb-2"
            style={{ color: isLuck ? "#FCD34D" : "#FCA5A5" }}
          >
            {effectName}
          </h3>
          <p className="text-sm text-foreground/80">{effectDesc}</p>
        </motion.div>

        {/* Dismiss button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <Button
            onClick={() => {
              playButtonClick();
              dismissTrioEvent();
            }}
            className="px-8 py-2"
            style={{
              backgroundColor: isLuck ? "#D97706" : "#DC2626",
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

// -- Main BattleCards Component --
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

  const handleDraw = useCallback(() => {
    if (isDrawing) return;
    setIsDrawing(true);
    playCardDraw();

    const card = drawBattleCard();

    // Check if all slots were full - need replace modal
    const state = useGameStore.getState();
    const allFull = state.battle.cardField.every((c) => c !== null);

    setTimeout(() => {
      if (card.alignment === "luck") {
        playCardLuck();
      } else {
        playCardBadLuck();
      }

      // If all slots are full and this card wasn't auto-placed, show replace modal
      if (allFull) {
        setPendingCard(card);
      }

      // Check if trio happened
      const currentState = useGameStore.getState();
      if (currentState.battle.cardTrioEvent) {
        if (currentState.battle.cardTrioEvent.type === "luck") {
          playLuckTrio();
        } else {
          playBadLuckTrio();
        }
      }

      setIsDrawing(false);
    }, 300);
  }, [isDrawing, drawBattleCard]);

  const handleReplace = (slotIndex: number) => {
    if (!pendingCard) return;
    replaceCardInSlot(slotIndex, pendingCard);
    setPendingCard(null);

    // Check for trio after replace
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

  const luckCount = fieldCards.filter((c) => c?.alignment === "luck").length;
  const badLuckCount = fieldCards.filter((c) => c?.alignment === "bad-luck").length;

  return (
    <>
      {/* Card field area */}
      <div className="flex flex-col gap-2">
        {/* Card slots */}
        <div className="flex items-center justify-center gap-1.5">
          {fieldCards.map((card, i) => (
            <CardSlot key={i} card={card} index={i} onClick={setViewingCard} />
          ))}
        </div>

        {/* Count indicators and draw button */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-[10px]">
            {luckCount > 0 && (
              <span className="text-green-400 font-mono">
                {"\u2618"}{luckCount}
              </span>
            )}
            {badLuckCount > 0 && (
              <span className="text-red-400 font-mono">
                {"\u2620"}{badLuckCount}
              </span>
            )}
            {luckCount >= 2 && (
              <span className="text-[9px] text-yellow-400/80 animate-pulse">
                Falta {3 - luckCount} p/ Trio!
              </span>
            )}
            {badLuckCount >= 2 && (
              <span className="text-[9px] text-red-400/80 animate-pulse">
                Azar: {badLuckCount}/3
              </span>
            )}
          </div>
          <Button
            size="sm"
            onClick={handleDraw}
            disabled={isDrawing || !!battle.cardTrioEvent}
            className="h-7 text-xs bg-accent text-accent-foreground hover:bg-accent/90 px-3"
          >
            {isDrawing ? "..." : "Comprar"}
          </Button>
        </div>
      </div>

      {/* Card viewer dialog */}
      <CardViewer card={viewingCard} open={!!viewingCard} onClose={() => setViewingCard(null)} />

      {/* Replace card modal */}
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

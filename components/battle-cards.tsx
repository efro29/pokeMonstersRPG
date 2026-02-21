"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/lib/game-store";
import type { BattleCard, CardElement } from "@/lib/card-data";
import { ELEMENT_COLORS, ELEMENT_NAMES_PT, CARD_ELEMENTS, DECK_SIZE, ELEMENT_EFFECTS, ELEMENTCOLORS } from "@/lib/card-data";
import { getSpriteUrl, getPokemon } from "@/lib/pokemon-data";
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
  playCardRareAppear,
  playCardResurrectAppear,
  playHealActivate,
  playResurrectActivate,
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
  Heart,
  RotateCcw,
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

function handleImgError(e: React.SyntheticEvent<HTMLImageElement>, fallbackText: string) {
  const target = e.currentTarget;
  target.style.display = "none";
  const parent = target.parentElement;
  if (parent) {
    const span = document.createElement("span");
    span.className = "text-[18px] leading-none drop-shadow-sm";
    span.textContent = fallbackText;
    parent.appendChild(span);
  }
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
  const isResurrect = card.alignment === "resurrect";
  const isAura = isAuraElemental || isAuraAmplificada;
  const isSpecial = isResurrect;
  const elColor = isResurrect ? "#EC4899" : isAura ? (isAuraAmplificada ? "#D4AF37" : "#C0C0C0") : (ELEMENT_COLORS[card.element] || "#888");
  const elName = ELEMENT_NAMES_PT[card.element] || card.element;
  const elementColor = (ELEMENTCOLORS[card.element] || "#ba0000")


  
  // Color scheme based on card type
  const borderColor = isResurrect
    ? "#EC4899"
    : isAuraAmplificada
    ? "#D4AF37"
    : isAuraElemental
    ? "#C0C0C0"
    : isLuck
    ? "#e0dcce"
    : "#24065c";

  const outerBg = isResurrect
    ? "linear-gradient(180deg, #fce7f3 0%, #f472b6 30%, #ec4899 70%, #fbcfe8 100%)"
    : isAuraAmplificada
    ? "linear-gradient(180deg, #D4AF37 0%, #B8860B 30%, #8B6914 70%, #D4AF37 100%)"
    : isAuraElemental
    ? "linear-gradient(180deg, #E8E8E8 0%, #C0C0C0 30%, #A8A8A8 70%, #D0D0D0 100%)"
    : isLuck
    ? "linear-gradient(180deg, #ffffff 0%, #ffffff 8%, #ffffff 92%, #ffffff 100%)"
    : "linear-gradient(180deg, #502d5a 0%, #4a1547 8%, #2b0a3a 92%, #1A0505 100%)";

  const innerBg = isResurrect
    ? "linear-gradient(180deg, #fdf2f8 0%, #fce7f3 100%)"
    : isAura
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
      const isActivated = !!card.activated;
      return (
        <motion.button
          onClick={onClick}
          initial={{ rotateY: 180, opacity: 0 }}
          animate={{
            rotateY: 0,
            opacity: 1,
            boxShadow: isActivated
              ? (isAuraAmplificada
                ? [
                    "0 0 10px 3px rgba(212,175,55,0.8), 0 0 25px 8px rgba(212,175,55,0.5)",
                    "0 0 16px 6px rgba(212,175,55,1), 0 0 40px 14px rgba(212,175,55,0.6)",
                    "0 0 10px 3px rgba(212,175,55,0.8), 0 0 25px 8px rgba(212,175,55,0.5)",
                  ]
                : [
                    "0 0 8px 2px rgba(192,192,192,0.7), 0 0 22px 6px rgba(192,192,192,0.35)",
                    "0 0 14px 4px rgba(192,192,192,0.9), 0 0 30px 10px rgba(192,192,192,0.5)",
                    "0 0 8px 2px rgba(192,192,192,0.7), 0 0 22px 6px rgba(192,192,192,0.35)",
                  ])
              : (isAuraAmplificada
                ? [
                    "0 0 4px 1px rgba(212,175,55,0.3), 0 0 10px 3px rgba(212,175,55,0.15)",
                    "0 0 6px 2px rgba(212,175,55,0.5), 0 0 14px 4px rgba(212,175,55,0.25)",
                    "0 0 4px 1px rgba(212,175,55,0.3), 0 0 10px 3px rgba(212,175,55,0.15)",
                  ]
                : [
                    "0 0 4px 1px rgba(192,192,192,0.25), 0 0 10px 3px rgba(192,192,192,0.12)",
                    "0 0 6px 2px rgba(192,192,192,0.4), 0 0 14px 4px rgba(192,192,192,0.2)",
                    "0 0 4px 1px rgba(192,192,192,0.25), 0 0 10px 3px rgba(192,192,192,0.12)",
                  ]),
          }}
          transition={{
            duration: 0.5,
            boxShadow: { duration: isActivated ? 1.2 : 2, repeat: Infinity, ease: "easeInOut" },
          }}
          whileHover={{ scale: 1.06, y: -3 }}
          whileTap={{ scale: 0.97 }}
          className="relative flex flex-col rounded-[2px] overflow-hidden cursor-pointer"
          style={{
            width: 44,
            height: 64,
            background: outerBg,
            border: `1.5px solid ${isActivated ? (isAuraAmplificada ? "#FFD700" : "#E0E0E0") : borderColor}`,
          }}
        >
          <div
            className="flex items-center justify-center py-[1px]"
            style={{ background: isAuraAmplificada ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.3)" }}
          >
            <span
              className="text-[3px] font-bold uppercase"
              style={{ color: isAuraAmplificada ? "#FFD700" : "#333" }}
            >
              {isActivated ? "ATIVO" : card.name}
            </span>
          </div>
          <div
            className="relative flex items-center justify-center overflow-hidden"
            style={{ height: 42 }}
          >
            <img
              src={isAuraAmplificada ? "/images/cards/aura-amplificada.jpg" : "/images/cards/aura-elemental.jpg"}
              alt={card.name}
              className="w-full h-full object-cover"
              loading="eager"
              decoding="sync"
              style={{ opacity: isActivated ? 1 : 0.7 }}
            />
          </div>
          <div
            className="flex items-center justify-center py-[1px]"
            style={{ background: isAuraAmplificada ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)" }}
          >
            <Sparkles className="w-2 h-2" style={{ color: isActivated ? (isAuraAmplificada ? "#FFD700" : "#fff") : (isAuraAmplificada ? "#997700" : "#666") }} />
          </div>
        </motion.button>
      );
    }

    // -- RESURRECT card small rendering --
    if (isSpecial) {
      const specialColor = "#EC4899";
      const specialBg = "linear-gradient(180deg, #fce7f3 0%, #f472b6 30%, #ec4899 70%, #fbcfe8 100%)";

      return (
        <motion.button
          onClick={onClick}
          initial={{ rotateY: 180, opacity: 0 }}
          animate={{
            rotateY: 0,
            opacity: 1,
            boxShadow: [
              `0 0 6px 2px ${specialColor}55`,
              `0 0 12px 4px ${specialColor}88`,
              `0 0 6px 2px ${specialColor}55`,
            ],
          }}
          transition={{
            duration: 0.5,
            boxShadow: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
          }}
          whileHover={{ scale: 1.06, y: -3 }}
          whileTap={{ scale: 0.97 }}
          className="relative flex flex-col rounded-[2px] overflow-hidden cursor-pointer"
          style={{
            width: 44,
            height: 64,
            background: specialBg,
            border: `1.5px solid ${specialColor}`,
          }}
        >
          <div
            className="flex items-center justify-center py-[1px]"
            style={{ background: "rgba(255,255,255,0.4)" }}
          >
            <span
              className="text-[3px] font-bold uppercase"
              style={{ color: "#831843" }}
            >
              {card.name}
            </span>
          </div>
          <div
            className="relative flex items-center justify-center overflow-hidden"
            style={{ height: 42 }}
          >
            <img
              src="/images/cards/card-resurrect.jpg"
              alt={card.name}
              className="w-full h-full object-cover"
              loading="eager"
              decoding="sync"
              onError={(e) => handleImgError(e, "\u2625")}
            />
          </div>
          <div
            className="flex items-center justify-center py-[1px]"
            style={{ background: "rgba(255,255,255,0.5)" }}
          >
            <span className="text-[6px] font-bold" style={{ color: "#831843" }}>ENF. JOY</span>
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
          width: 44,
          height: 64,
          backgroundColor: elColor,
          border: `1.5px solid ${glowing ? elColor : borderColor}`,
          boxShadow: !glowing
            ? (isLuck
              ? "0 2px 8px rgba(200, 164, 43, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)"
              : "0 2px 8px rgba(17, 1, 22, 0.6), inset 0 1px 0 rgba(42, 14, 54, 0.05)")
            : undefined,
        }}
      >

        {isLuck?
      <>


  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">

    {/* SCALE CONTAINER */}
    <div className="origin-center scale-[0.125]">

      <div
        className="
        w-[360px] h-[500px] p-[12px] rounded-[26px]
        flex flex-col
        shadow-[0_10px_25px_rgba(0,0,0,0.35),inset_0_0_6px_rgba(255,255,255,0.9),inset_0_0_15px_rgba(0,0,0,0.25)]
        bg-[linear-gradient(180deg,#f2f2f2_0%,#d6d6d6_20%,#bdbdbd_40%,#eeeeee_60%,#bdbdbd_80%,#f7f7f7_100%)]
        font-sans
        "
      >

        {/* HEADER */}
        <div className="relative
          h-[48px] rounded-[18px] px-4
          flex items-center justify-between
          font-bold text-[#5a5a5a] text-sm
          shadow-[inset_0_2px_3px_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(0,0,0,0.25)]
          bg-[linear-gradient(180deg,#ffffff,#cfcfcf_40%,#a9a9a9_50%,#dedede_80%)]
        ">
          <span className="italic opacity-90">Basic Energy</span>
          <span className="tracking-widest">ENERGY</span>
        </div>

        {/* TITLE */}
      

        {/* ART */}
        <div className="relative inset-0 z-0" />
        <div
        className={`absolute inset-0 pointer-events-none z-10 `}
        />

        <div style={{background:elColor}} className={`
          flex-1 mx-[6px] rounded-[14px] overflow-hidden
         
          shadow-[inset_0_0_18px_rgba(255,255,255,0.35)]
          flex items-center justify-center
        `}>
      
          <img
                src={`/images/cardsTypes/${card.element}.png`}
                  alt={card.name}
             className="  relative z-20 block max-w-full max-h-full object-contain shadow-[inset_0_0_18px_rgba(0,0,0,0.35)] rounded-full"
                style={{
                width:200
     
                }}
                loading="eager"
                decoding="sync"
                onError={(e) =>
                handleImgError(e, isLuck ? "\u2618" : "\u2620")
                }
          />
                    <span className="font-bold" style={{color:'white',position:'absolute',zIndex:100,top:360,fontSize:40}}>{card.element.toUpperCase()}</span>
        </div>

        {/* FOOTER */}
        <div className="
          h-[44px] mt-2 px-3 rounded-[12px]
          flex items-center justify-between text-[11px]
          text-black/80
          bg-[linear-gradient(180deg,#fdfdfd,#d0d0d0_40%,#b5b5b5_60%,#efefef)]
          shadow-[inset_0_2px_3px_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(0,0,0,0.25)]
        ">
          <span className="font-bold">SVE EN 003</span>
          <span>©2023 Pokémon</span>
        </div>

      </div>
    </div>
  </div>

</>
        : 
           <div
            className=" flex justify-center items-center bg-white-200"
            style={{ minHeight: '24px' }}>
            <img
              src="/images/cardsTypes/genga.jpg"
              alt={card.name}
              className="object-cover"
              loading="eager"
              decoding="sync"
              onError={(e) => handleImgError(e, "\u2620")}
            />
          </div>
        }
      </motion.button>
    );
  }

  // LARGE card (dialog view)
  const largeCardImage = isResurrect
    ? "/images/cards/card-resurrect.jpg"
    : isAuraAmplificada
    ? "/images/cards/aura-amplificada.jpg"
    : isAuraElemental
    ? "/images/cards/aura-elemental.jpg"
    : `/images/cards/card${card.cardIndex}.png`;

  const largeShadow = isResurrect
    ? "0 8px 40px rgba(236,72,153,0.6), 0 0 50px rgba(236,72,153,0.25), inset 0 2px 0 rgba(255,255,255,0.15)"
    : isAuraAmplificada
    ? "0 8px 40px rgba(212,175,55,0.7), 0 0 60px rgba(212,175,55,0.3), inset 0 2px 0 rgba(255,255,255,0.15)"
    : isAuraElemental
    ? "0 8px 40px rgba(192,192,192,0.6), 0 0 50px rgba(192,192,192,0.25), inset 0 2px 0 rgba(255,255,255,0.15)"
    : isLuck
    ? "0 8px 32px rgba(236, 183, 6, 0.5), inset 0 2px 0 rgba(255,255,255,0.15)"
    : "0 8px 32px rgba(30, 2, 41, 0.7), inset 0 2px 0 rgba(255,255,255,0.05)";

  const nameColor = isResurrect ? "#831843" : isAuraAmplificada ? "#FFD700" : isAuraElemental ? "#555" : isLuck ? "green" : "pink";

  return (
    isLuck?
    
        <>  
        <motion.div
        initial={{ scale: 0.6, rotateY: 180 }}
        animate={{ scale: 1, rotateY: 0 }}
        transition={{ type: "spring", damping: 14 }}
        className="relative overflow-hidden mx-auto flex items-center justify-center rounded-[9px]"
        style={{
        height: 350,
        width: 250,
        background: outerBg,
        border: `3px solid ${borderColor}`,
        boxShadow: largeShadow,
        perspective: "1000px",
        }}
        >

        {/* centralizador */}
        <div className="absolute inset-0 flex items-center justify-center">

        {/* escala da carta */}
        <div className="origin-center scale-[0.7]">

        {/* CARTA REAL */}
        <div className="
        w-[360px] h-[500px] p-[12px] rounded-[26px]
        flex flex-col
        shadow-[0_10px_25px_rgba(0,0,0,0.35),inset_0_0_6px_rgba(255,255,255,0.9),inset_0_0_15px_rgba(0,0,0,0.25)]
        bg-[linear-gradient(180deg,#f2f2f2_0%,#d6d6d6_20%,#bdbdbd_40%,#eeeeee_60%,#bdbdbd_80%,#f7f7f7_100%)]
        font-sans
        ">

        {/* HEADER */}
        <div className="
        h-[48px] rounded-[9px] px-4
        flex items-center justify-between
        font-bold text-[#5a5a5a] text-sm
        shadow-[inset_0_2px_3px_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(0,0,0,0.25)]
        bg-[linear-gradient(180deg,#ffffff,#cfcfcf_40%,#a9a9a9_50%,#dedede_80%)]
        ">
        <span className="italic opacity-80">Basic Energy</span> 
        <span className="tracking-widest">ENERGY</span>
        </div>

        {/* TITLE */}
        <div className="h-[42px] flex text-gray-500 gap-2 px-3 text-[23px] justify-between font-semibold text-black">
        <span>Basic Energy</span>

        <img
        src={`/images/cardsTypes/${card.element}.png`}
        alt={card.name}
        className="  relative z-20 block max-w-full max-h-full object-contain rounded-full"

        loading="eager"
        decoding="sync"
        onError={(e) =>
        handleImgError(e, isLuck ? "\u2618" : "\u2620")
        }
        />
        </div>

        {/* ART AREA */}
        <div
        style={{ background: elColor }}
        className="
        relative
        flex-1 mx-[6px] rounded-[14px] overflow-hidden
        shadow-[inset_0_0_18px_rgba(255,255,255,0.35)]
        flex items-center justify-center
        "
        >
        <div className="absolute inset-0 z-0" />
        <div
        className={`absolute inset-0 pointer-events-none z-10 ${ELEMENT_EFFECTS[card.element]}`}
        />

        <img
        src={`/images/cardsTypes/${card.element}.png`}
        alt={card.name}
        className="  relative z-20 block max-w-full max-h-full object-contain shadow-[inset_0_0_18px_rgba(0,0,0,0.35)] rounded-full"
        style={{
        width:200

        }}
        loading="eager"
        decoding="sync"
        onError={(e) =>
        handleImgError(e, isLuck ? "\u2618" : "\u2620")
        }
        />
        <span className="font-bold" style={{color:'white',position:'absolute',zIndex:100,top:270,fontSize:23}}>{card.element.toUpperCase()}</span>





        </div>

        {/* FOOTER */}
        <div className="
        h-[44px] mt-2 px-3 rounded-[12px]
        flex items-center justify-center text-[11px]
        text-black/80
        bg-[linear-gradient(180deg,#fdfdfd,#d0d0d0_40%,#b5b5b5_60%,#efefef)]
        shadow-[inset_0_2px_3px_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(0,0,0,0.25)]
        ">
        <span className="font-bold">{card.description.toUpperCase()}</span>

        </div>

        </div>
        </div>
        </div>
        </motion.div>
        </>

:

<>    <motion.div
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
          {isResurrect ? (
            <RotateCcw className="w-5 h-5" style={{ color: "#EC4899" }} />
          ) : isAura ? (
            <Sparkles className="w-5 h-5" style={{ color: isAuraAmplificada ? "#FFD700" : "#999" }} />
          ) : isLuck ? (
            <div
              className=" flex items-center justify-center"
            
            >
              <img
                style={{ width: 20 }}
                src={`/images/cardsTypes/${card.element}.jpg`}
                alt={card.name}
                className="object-cover "
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
    </motion.div></>






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
        width: 44,
        height: 64,
        background: "linear-gradient(180deg, rgba(30,30,30,0.6) 0%, rgba(20,20,20,0.8) 100%)",
        border: "1.5px dashed rgba(255,255,255,0.1)",
      }}
    >
      <span className="text-[9px] text-muted-foreground/30 font-mono">
                 <svg
                    width="20"
                    height="20"
                    viewBox="0 0 100 100"
                  >
                    <circle cx="50" cy="50" r="48" fill="#2b2424" stroke="#1E293B" strokeWidth="4" />
                    <rect x="2" y="48" width="96" height="4" fill="#1E293B" />
                    <path d="M 2 50 A 48 48 0 0 0 98 50" fill="#606264" />
                    <circle cx="50" cy="50" r="14" fill="#3c3d3d" stroke="#1E293B" strokeWidth="3" />
                    <circle cx="50" cy="50" r="6" fill="#1E293B" />
                  </svg>
      
      </span>
    </div>
  );
}

// ============================================================
// CARD VIEWER DIALOG
// ============================================================
function AuraActivationOverlay({
  card,
  onComplete,
}: {
  card: BattleCard;
  onComplete: () => void;
}) {
  const isAmplificada = card.alignment === "aura-amplificada";
  const primaryColor = isAmplificada ? "#FFD700" : "#C0C0C0";
  const secondaryColor = isAmplificada ? "#B8860B" : "#888";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        background: isAmplificada
          ? "radial-gradient(ellipse at center, rgba(212,175,55,0.4) 0%, rgba(0,0,0,0.95) 70%)"
          : "radial-gradient(ellipse at center, rgba(192,192,192,0.35) 0%, rgba(0,0,0,0.95) 70%)",
      }}
    >
      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: 2 + Math.random() * 4,
              height: 2 + Math.random() * 4,
              backgroundColor: isAmplificada
                ? `hsl(${42 + Math.random() * 20}, 100%, ${55 + Math.random() * 35}%)`
                : `hsl(0, 0%, ${60 + Math.random() * 35}%)`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 2, 0],
              y: [0, (Math.random() - 0.5) * 300],
              x: [0, (Math.random() - 0.5) * 300],
            }}
            transition={{
              duration: 1.5 + Math.random() * 1.5,
              repeat: Infinity,
              delay: Math.random() * 0.5,
            }}
          />
        ))}
      </div>

      {/* Energy rings */}
      {[0, 1, 2].map((ring) => (
        <motion.div
          key={ring}
          className="absolute rounded-full"
          style={{
            width: 120 + ring * 80,
            height: 120 + ring * 80,
            border: `2px solid ${primaryColor}${ring === 0 ? "88" : ring === 1 ? "44" : "22"}`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.3, 0.7, 0.3],
            rotate: [0, ring % 2 === 0 ? 360 : -360],
          }}
          transition={{
            duration: 3 + ring,
            repeat: Infinity,
            ease: "linear",
            delay: ring * 0.3,
          }}
        />
      ))}

      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", damping: 8, delay: 0.2 }}
        className="flex flex-col items-center gap-4 z-10"
      >
        {/* Card image */}
        <motion.div
          animate={{
            boxShadow: [
              `0 0 20px 5px ${primaryColor}66`,
              `0 0 40px 15px ${primaryColor}AA`,
              `0 0 20px 5px ${primaryColor}66`,
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="rounded-lg overflow-hidden"
          style={{ border: `3px solid ${primaryColor}` }}
        >
          <img
            src={isAmplificada ? "/images/cards/aura-amplificada.jpg" : "/images/cards/aura-elemental.jpg"}
            alt={card.name}
            className="w-40 h-40 object-cover"
          />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-2xl font-black tracking-wider text-center"
          style={{
            color: primaryColor,
            textShadow: `0 0 30px ${primaryColor}88, 0 0 60px ${primaryColor}44`,
          }}
        >
          {isAmplificada ? "AURA AMPLIFICADA!" : "AURA ELEMENTAL!"}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-sm text-center max-w-xs"
          style={{ color: `${primaryColor}CC` }}
        >
          {isAmplificada
            ? "Poder ativado! D20 garantido em 20 no proximo golpe!"
            : "Poder ativado! Coringa de energia liberado!"}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <Button
            onClick={onComplete}
            className="px-8 py-2 font-bold"
            style={{
              backgroundColor: secondaryColor,
              color: "#fff",
              border: `1px solid ${primaryColor}`,
            }}
          >
            Continuar
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function NurseJoyActivationOverlay({
  isHeal,
  pokemonName,
  amount,
  onComplete,
}: {
  isHeal: boolean;
  pokemonName: string;
  amount: number;
  onComplete: () => void;
}) {
  const primaryColor = "#EC4899";
  const bgGlow = "radial-gradient(ellipse at center, rgba(236,72,153,0.35) 0%, rgba(0,0,0,0.95) 70%)";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: bgGlow }}
    >
      {/* Heart particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: 6 + Math.random() * 8,
              height: 6 + Math.random() * 8,
              backgroundColor: isHeal
                ? `hsl(${340 + Math.random() * 30}, 80%, ${60 + Math.random() * 30}%)`
                : `hsl(${340 + Math.random() * 30}, 90%, ${55 + Math.random() * 30}%)`,
              borderRadius: "50%",
              boxShadow: `0 0 6px ${primaryColor}88`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              y: [0, -80 - Math.random() * 120],
              x: [0, (Math.random() - 0.5) * 80],
            }}
            transition={{
              duration: 1.2 + Math.random() * 1,
              repeat: Infinity,
              delay: Math.random() * 0.8,
            }}
          />
        ))}
      </div>

      {/* Cross / Plus symbol for healing */}
      {isHeal && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[0, 1].map((ring) => (
            <motion.div
              key={ring}
              className="absolute rounded-full"
              style={{
                width: 140 + ring * 70,
                height: 140 + ring * 70,
                border: `2px solid ${primaryColor}${ring === 0 ? "66" : "33"}`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0.9, 1.15, 0.9],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 2 + ring,
                repeat: Infinity,
                ease: "easeInOut",
                delay: ring * 0.4,
              }}
            />
          ))}
        </div>
      )}

      {/* Resurrect: rising flame effect */}
      {!isHeal && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`flame-${i}`}
              className="absolute"
              style={{
                bottom: "30%",
                left: `${35 + Math.random() * 30}%`,
                width: 3 + Math.random() * 5,
                height: 20 + Math.random() * 30,
                background: "linear-gradient(to top, #EC4899, #F472B6, transparent)",
                borderRadius: "50% 50% 0 0",
              }}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{
                opacity: [0, 0.8, 0],
                scaleY: [0, 1.5, 0],
                y: [0, -60 - Math.random() * 80],
              }}
              transition={{
                duration: 1 + Math.random() * 0.8,
                repeat: Infinity,
                delay: i * 0.12,
              }}
            />
          ))}
        </div>
      )}

      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", damping: 10, delay: 0.15 }}
        className="flex flex-col items-center gap-4 z-10"
      >
        {/* Card image */}
        <motion.div
          animate={{
            boxShadow: [
              `0 0 20px 5px ${primaryColor}66`,
              `0 0 40px 15px ${primaryColor}AA`,
              `0 0 20px 5px ${primaryColor}66`,
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="rounded-lg overflow-hidden"
          style={{ border: `3px solid ${primaryColor}` }}
        >
          <img
            src="/images/cards/card-resurrect.jpg"
            alt="Enfermeira Joy"
            className="w-40 h-40 object-cover"
          />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-black tracking-wider text-center"
          style={{
            color: primaryColor,
            textShadow: `0 0 30px ${primaryColor}88, 0 0 60px ${primaryColor}44`,
          }}
        >
          {isHeal ? "CURA!" : "RESSURREICAO!"}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-sm text-center max-w-xs"
          style={{ color: `${primaryColor}CC` }}
        >
          {isHeal
            ? `${pokemonName} recuperou ${amount} HP!`
            : `${pokemonName} foi ressuscitado com ${amount} HP!`}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Button
            onClick={onComplete}
            className="px-8 py-2 font-bold"
            style={{
              backgroundColor: "#9d174d",
              color: "#fff",
              border: `1px solid ${primaryColor}`,
            }}
          >
            Continuar
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

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
  const { activateCardEffect, activateHealCard, activateResurrectCard, team } = useGameStore();
  const [showAuraAnimation, setShowAuraAnimation] = useState(false);
  const [animatingCard, setAnimatingCard] = useState<BattleCard | null>(null);
  const [showPokemonSelect, setShowPokemonSelect] = useState(false);
  const [nurseJoyAnim, setNurseJoyAnim] = useState<{
    isHeal: boolean;
    pokemonName: string;
    amount: number;
  } | null>(null);
  
  if (!card && !showAuraAnimation && !nurseJoyAnim) return null;

  const isAura = card?.alignment === "aura-elemental" || card?.alignment === "aura-amplificada";
  const isResurrectCard = card?.alignment === "resurrect";
  const isAlreadyActivated = isAura && card?.activated;

  // For resurrect: show fainted Pokemon first; if none fainted, show alive Pokemon that need healing
  const hasFaintedPokemon = isResurrectCard && team.some((p) => p.currentHp <= 0);
  const eligiblePokemon = isResurrectCard
    ? (hasFaintedPokemon
        ? team.filter((p) => p.currentHp <= 0)
        : team.filter((p) => p.currentHp > 0 && p.currentHp < p.maxHp))
    : [];

  const handleActivatePower = () => {
    if (slotIndex !== undefined && card) {
      // Resurrect -> show Pokemon selection
      if (isResurrectCard) {
        if (eligiblePokemon.length === 0) {
          alert("Todos os Pokemon estao com HP cheio!");
          return;
        }
        setShowPokemonSelect(true);
        return;
      }

      if (isAura && !isAlreadyActivated) {
        setAnimatingCard(card);
        setShowAuraAnimation(true);
        onClose();
        const result = activateCardEffect(slotIndex);
        if (result) playCardActivateLuck();
      } else {
        const result = activateCardEffect(slotIndex);
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
    }
  };

  const handleSelectPokemon = (uid: string) => {
    if (slotIndex === undefined) return;
    const targetMon = team.find((p) => p.uid === uid);
    if (!targetMon) return;
    const targetSpecies = getPokemon(targetMon.speciesId);
    let success = false;
    if (hasFaintedPokemon) {
      success = activateResurrectCard(slotIndex, uid);
      if (success) {
        playResurrectActivate();
        const reviveHp = Math.round(targetMon.maxHp * 0.25);
        setNurseJoyAnim({ isHeal: false, pokemonName: targetSpecies.name, amount: reviveHp });
      }
    } else {
      const healAmount = Math.round(targetMon.maxHp * 0.20);
      const actualHeal = Math.min(healAmount, targetMon.maxHp - targetMon.currentHp);
      success = activateHealCard(slotIndex, uid);
      if (success) {
        playHealActivate();
        setNurseJoyAnim({ isHeal: true, pokemonName: targetSpecies.name, amount: actualHeal });
      }
    }
    setShowPokemonSelect(false);
    onClose();
  };

  const handleAuraAnimationComplete = () => {
    setShowAuraAnimation(false);
    setAnimatingCard(null);
  };

  const getButtonText = () => {
    if (isAlreadyActivated) return "Poder Ja Ativado";
    if (isAura) return "ATIVAR PODER";
    if (isResurrectCard) return "Usar Enfermeira Joy";
    if (card?.alignment === "bad-luck") return "Ativar Maldicao";
    return "Ativar Poder";
  };

  const getButtonStyle = () => {
    if (isAlreadyActivated) return "bg-gray-500 text-white cursor-not-allowed";
    if (card?.alignment === "aura-amplificada") return "text-white";
    if (card?.alignment === "aura-elemental") return "text-white";
    if (isResurrectCard) return "text-white";
    if (card?.alignment === "bad-luck") return "bg-red-600 hover:bg-red-700 text-white";
    return "bg-green-600 hover:bg-green-700 text-white";
  };

  return (
    <>
      <AnimatePresence>
        {showAuraAnimation && animatingCard && (
          <AuraActivationOverlay card={animatingCard} onComplete={handleAuraAnimationComplete} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {nurseJoyAnim && (
          <NurseJoyActivationOverlay
            isHeal={nurseJoyAnim.isHeal}
            pokemonName={nurseJoyAnim.pokemonName}
            amount={nurseJoyAnim.amount}
            onComplete={() => setNurseJoyAnim(null)}
          />
        )}
      </AnimatePresence>

      {/* Pokemon Selection Dialog for Heal/Resurrect */}
      <Dialog open={showPokemonSelect} onOpenChange={() => setShowPokemonSelect(false)}>
        <DialogContent className="max-w-[300px] mx-auto p-4 border-border" style={{
          background: "linear-gradient(180deg, #500724 0%, #0a0a0a 100%)",
          borderColor: "#EC4899",
        }}>
          <DialogHeader>
            <DialogTitle className="text-center text-sm font-bold" style={{ color: "#EC4899" }}>
              {hasFaintedPokemon
                ? "Escolha um Pokemon para reviver"
                : "Escolha um Pokemon para curar"}
            </DialogTitle>
            <DialogDescription className="text-center text-xs text-muted-foreground">
              {hasFaintedPokemon
                ? "Restaura 25% do HP maximo"
                : "Cura 20% do HP maximo"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-2 mt-2 max-h-[300px] overflow-y-auto">
            {eligiblePokemon.map((poke) => {
              const species = getPokemon(poke.speciesId);
              const hpPercent = Math.round((poke.currentHp / poke.maxHp) * 100);
              const isFainted = poke.currentHp <= 0;
              
              return (
                <motion.button
                  key={poke.uid}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectPokemon(poke.uid)}
                  className="flex items-center gap-3 p-2 rounded-lg border transition-colors cursor-pointer"
                  style={{
                    borderColor: "#EC489944",
                    background: "rgba(0,0,0,0.3)",
                  }}
                >
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <img
                      src={getSpriteUrl(poke.speciesId)}
                      alt={species.name}
                      className="w-10 h-10 object-contain"
                      style={{ filter: isFainted ? "grayscale(1) brightness(0.5)" : "none" }}
                    />
                  </div>
                  <div className="flex flex-col items-start flex-1 min-w-0">
                    <span className="text-xs font-bold text-foreground truncate w-full text-left">
                      {poke.name} <span className="text-muted-foreground font-normal">Lv.{poke.level}</span>
                    </span>
                    <div className="w-full flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.max(0, hpPercent)}%`,
                            background: isFainted ? "#666" : hpPercent > 50 ? "#4ADE80" : hpPercent > 25 ? "#FBBF24" : "#EF4444",
                          }}
                        />
                      </div>
                      <span className="text-[9px] text-muted-foreground whitespace-nowrap">
                        {poke.currentHp}/{poke.maxHp}
                      </span>
                    </div>
                  </div>
                  <div
                    className="flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0"
                    style={{ background: "#EC489933" }}
                  >
                    {hasFaintedPokemon ? (
                      <RotateCcw className="w-3 h-3" style={{ color: "#EC4899" }} />
                    ) : (
                      <Heart className="w-3 h-3" style={{ color: "#EC4899" }} />
                    )}
                  </div>
                </motion.button>
              );
            })}

            {eligiblePokemon.length === 0 && (
              <p className="text-center text-xs text-muted-foreground py-4">
                Todos os Pokemon estao com HP cheio.
              </p>
            )}
          </div>

          <Button
            variant="outline"
            onClick={() => setShowPokemonSelect(false)}
            className="w-full mt-2 text-xs"
          >
            Cancelar
          </Button>
        </DialogContent>
      </Dialog>

      {/* Main Card Viewer Dialog */}
      <Dialog open={open && !showPokemonSelect} onOpenChange={onClose}>
        <DialogContent className="max-w-[260px] mx-auto p-4 overflow-visible border-none bg-transparent">
          <DialogHeader className="sr-only">
            <DialogTitle>{card?.name ?? "Carta"}</DialogTitle>
            <DialogDescription>Detalhes da carta de batalha</DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-3">
            {card && <YuGiOhCard card={card} size="large" />}
            
            {slotIndex !== undefined && card && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  onClick={handleActivatePower}
                  disabled={!!isAlreadyActivated}
                  className={`w-full font-bold text-sm transition-all ${getButtonStyle()}`}
                  style={
                    card.alignment === "aura-amplificada" && !isAlreadyActivated
                      ? {
                          background: "linear-gradient(90deg, #B8860B, #D4AF37, #FFD700, #D4AF37, #B8860B)",
                          backgroundSize: "200% 100%",
                          animation: "shimmer 2s linear infinite",
                          border: "1px solid #FFD700",
                        }
                      : card.alignment === "aura-elemental" && !isAlreadyActivated
                      ? {
                          background: "linear-gradient(90deg, #888, #C0C0C0, #E8E8E8, #C0C0C0, #888)",
                          backgroundSize: "200% 100%",
                          animation: "shimmer 2s linear infinite",
                          border: "1px solid #C0C0C0",
                        }
                      : isResurrectCard
                      ? {
                          background: "linear-gradient(90deg, #9d174d, #ec4899, #f472b6, #ec4899, #9d174d)",
                          backgroundSize: "200% 100%",
                          animation: "shimmer 2s linear infinite",
                          border: "1px solid #EC4899",
                        }
                      : undefined
                  }
                >
                  {isResurrectCard ? (
                    <RotateCcw className="w-4 h-4 mr-2" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  {getButtonText()}
                </Button>
              </motion.div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
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

        {/* <Button variant="outline" size="sm" onClick={onCancel} className="mt-2 border-border text-foreground w-full">
          Cancelar
        </Button> */}
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// TRIO EVENT OVERLAY
// ============================================================
function TrioEventOverlay() {
  const { battle, dismissTrioEvent, trioChoiceTradeForElement, trioChoiceRemoveBadLuck, trioChoiceDoNothing } = useGameStore();
  const event = battle.cardTrioEvent;
  const [showElementPicker, setShowElementPicker] = useState(false);
  if (!event) return null;

  const isLuck = event.type === "luck";

  // For luck trio: find bad luck cards on the field (for option 2)
  const badLuckSlots = isLuck
    ? battle.cardField
        .map((c, i) => (c && c.alignment === "bad-luck" ? i : -1))
        .filter((i) => i !== -1)
    : [];
  const hasBadLuck = badLuckSlots.length > 0;

  // Element picker for trade option
  if (isLuck && showElementPicker) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ background: "radial-gradient(ellipse at center, rgba(37, 30, 5, 0.3) 0%, rgba(0,0,0,0.95) 70%)" }}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="flex flex-col items-center gap-4 px-4 max-w-sm w-full"
        >
          <h2
            className=" text-lg font-black tracking-wider text-center"
            style={{ color: "#D4AF37", textShadow: "0 0 20px rgba(212,175,55,0.5)" }}
          >
            Escolha o tipo da nova carta
          </h2>
        <div className="bonus-particles  w-full flex items-center justify-center p-4">
          <div className="relative w-80 h-80">



            {/* Centro */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-24 h-24 rounded-full   flex items-center justify-center   z-20">
                <img
                  src="/images/pokebola.png"
                  alt="Centro"
                  className=" w-16 h-16 object-contain select-none"
                  draggable={false}
                />
              </div>
            </div>

            {CARD_ELEMENTS.map((el, index) => {
              const total = CARD_ELEMENTS.length;
              const angle = (360 / total) * index;
              const radius = 120;

              return (
                <div key={el}>
                  
                  {/* 🔹 Linha radial */}
                  <div
                    className="water-particle absolute h-[2px] origin-left opacity-40 animate-pulse"
                    style={{
                      top: "50%",
                      left: "70%",
                      width: `${radius}px`,
                      background: ELEMENT_COLORS[el],
                      transform: `
                        translate(-50%, -50%)
                        rotate(${angle}deg)
                      `,
                    }}
                  />

                  {/* 🔹 Botão */}
                  <button
                    onClick={() => {
                      playButtonClick();
                      trioChoiceTradeForElement(el);
                      setShowElementPicker(false);
                    }}
                    className="group absolute w-16 h-16 flex items-center justify-center rounded-full transition-all duration-300 ease-out"
                    style={{
                      top: "50%",
                      left: "50%",
                      transform: `
                        translate(-50%, -50%)
                        rotate(${angle}deg)
                        translate(${radius}px)
                        rotate(-${angle}deg)
                      `,
                    }}
                  >
                    <div
                      className="flex items-center justify-center w-full h-full rounded-full 
                                transition-all duration-300
                                group-hover:scale-125
                                group-hover:shadow-[0_0_18px_rgba(255,255,255,0.75)]"
                      style={{
                        background: `${ELEMENT_COLORS[el]}22`,
                        border: `2px solid ${ELEMENT_COLORS[el]}99`,
                      }}
                    >
                      <img
                        src={`/images/cardsTypes/${el}.png`}
                        alt={el}
                        className="w-14 h-14 rounded-full transition-transform duration-300 select-none"
                        draggable={false}
                      />
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
          <button
            onClick={() => setShowElementPicker(false)}
            className="text-xs text-muted-foreground underline mt-1"
          >
            Voltar
          </button>
        </motion.div>
      </motion.div>
    );
  }

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
            {isLuck ? "\u2618\u2618" : 
            <>
            <div style={{display:'flex',justifyContent:'center'}}>
            <img
              style={{ width: 50 }}
              src="/images/cardsTypes/genga.gif"
              className="object-cover rounded-full"
              loading="eager"
              decoding="sync"
              onError={(e) => handleImgError(e, "\u2620")}
            />
             <img
              style={{ width: 50 }}
              src="/images/cardsTypes/genga.gif"
              className="object-cover rounded-full"
              loading="eager"
              decoding="sync"
              onError={(e) => handleImgError(e, "\u2620")}
            />
             <img
              style={{ width: 50 }}
              src="/images/cardsTypes/genga.gif"
              className="object-cover rounded-full"
              loading="eager"
              decoding="sync"
              onError={(e) => handleImgError(e, "\u2620")}
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
            {isLuck ? "DUPLEX!" : "SUPER PUNICAO!"}
          </h2>
        </motion.div>

        {isLuck ? (
          /* LUCK TRIO: 3 choice buttons */
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col gap-3 w-full max-w-xs"
          >
            <p className="text-sm text-center text-foreground/70 mb-1">
              3 cartas do mesmo tipo! Escolha:
            </p>

            {/* Choice 1: Trade for any type */}
            <button
              onClick={() => {
                playButtonClick();
                setShowElementPicker(true);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-bold transition-all hover:scale-[1.02] active:scale-95"
              style={{
                background: "linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.05) 100%)",
                border: "1px solid rgba(212,175,55,0.4)",
                color: "#FCD34D",
              }}
            >
              <span className="text-lg">{"1."}</span>
              Trocar por 1 carta do tipo que quiser
            </button>

            {/* Choice 2: Remove a bad luck card */}
            <button
              onClick={() => {
                if (hasBadLuck) {
                  playButtonClick();
                  // Remove the first bad luck card found
                  trioChoiceRemoveBadLuck(badLuckSlots[0]);
                }
              }}
              disabled={!hasBadLuck}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-bold transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                background: hasBadLuck ? "linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(239,68,68,0.05) 100%)" : "rgba(50,50,50,0.2)",
                border: `1px solid ${hasBadLuck ? "rgba(239,68,68,0.4)" : "rgba(80,80,80,0.3)"}`,
                color: hasBadLuck ? "#FCA5A5" : "#555",
              }}
            >
              <span className="text-lg">{"2."}</span>
              {hasBadLuck
                ? `Eliminar 1 carta de azar (${badLuckSlots.length} no campo)`
                : "Eliminar carta de azar (nenhuma no campo)"}
            </button>

            {/* Choice 3: Do nothing */}
            <button
              onClick={() => {
                playButtonClick();
                trioChoiceDoNothing();
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-bold transition-all hover:scale-[1.02] active:scale-95"
              style={{
                background: "rgba(100,100,100,0.1)",
                border: "1px solid rgba(100,100,100,0.3)",
                color: "#999",
              }}
            >
              <span className="text-lg">{"3."}</span>
              Nao fazer nada
            </button>
          </motion.div>
        ) : (
          /* BAD LUCK TRIO: punishment */
          <>
            {event.hasAffinity && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="px-4 py-1.5 rounded-full text-xs font-bold"
                style={{
                  background: "rgba(128, 68, 239, 0.2)",
                  color: "#FCA5A5",
                  border: "1px solid rgba(156, 68, 239, 0.4)",
                }}
              >
                Afinidade Elemental - Efeito DOBRADO!
              </motion.div>
            )}

            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="w-full max-w-xs rounded-xl p-5 text-center"
              style={{
                background: "linear-gradient(135deg, rgba(0, 0, 0, 0.15) 0%, rgba(15, 2, 36, 0.05) 100%)",
                border: "1px solid rgba(239,68,68,0.3)",
              }}
            >
              <h3 className="text-lg font-bold mb-1.5" style={{ color: "#e8a5fc" }}>
                {event.hasAffinity ? event.effect.affinityName : event.effect.name}
              </h3>
              <p className="text-sm text-foreground/80">
                {event.hasAffinity ? event.effect.affinityDescription : event.effect.description}
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
              <Button
                onClick={() => {
                  playTrioPunishment();
                  dismissTrioEvent();
                }}
                className="px-8 py-2"
                style={{ backgroundColor: "#7b26dc", color: "#fff" }}
              >
                Receber Punicao
              </Button>
            </motion.div>
          </>
        )}
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
  shuffleDeckAction,
  replenishDeck,
  spendPA,
  } = useGameStore();

  const [viewingCard, setViewingCard] = useState<BattleCard | null>(null);
  const [viewingCardSlotIndex, setViewingCardSlotIndex] = useState<number | undefined>(undefined);
  const [pendingCard, setPendingCard] = useState<BattleCard | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showDeckMenu, setShowDeckMenu] = useState(false);

  const fieldCards = battle.cardField;
  const hasEmptySlot = fieldCards.some((c) => c === null);
  const luckCount = fieldCards.filter((c) => c?.alignment === "luck").length;
  const badLuckCount = fieldCards.filter((c) => c?.alignment === "bad-luck").length;
  const penalty = battle.badLuckPenalty;

  const deckRemaining = battle.deck?.length ?? 0;
  const canDraw = deckRemaining > 0;
  const totalDrawn = DECK_SIZE - deckRemaining;
  const discardCount = battle.discardPile?.length ?? 0;

  const handleDraw = useCallback(() => {
  if (isDrawing || !canDraw) return;
  if (!spendPA("drawCard")) return;
  setIsDrawing(true);
  setShowDeckMenu(false);
  playCardDraw();

    const card = drawBattleCard();
    if (!card) {
      setIsDrawing(false);
      return;
    }

    // Check if card was NOT placed in any slot (all slots were full -> need replace)
    const state = useGameStore.getState();
    const cardIsInField = state.battle.cardField.some((c) => c !== null && c.id === card.id);
    const cardNotPlaced = !cardIsInField && state.battle.lastDrawnCard?.id === card.id;

    setTimeout(() => {
      if (card.alignment === "aura-elemental" || card.alignment === "aura-amplificada") {
        playCardRareAppear();
      } else if (card.alignment === "resurrect") {
        playCardResurrectAppear();
      } else if (card.alignment === "luck") {
        playCardLuck();
      } else {
        playCardBadLuck();
      }

      if (cardNotPlaced) {
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
  }, [isDrawing, canDraw, drawBattleCard, spendPA]);

  const handleShuffle = () => {
    shuffleDeckAction();
    setShowDeckMenu(false);
  };

  const handleReplenish = () => {
    replenishDeck();
    setShowDeckMenu(false);
  };

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
  const glowingElements = new Set(
    Object.entries(elementCounts)
      .filter(([, count]) => count >= 2)
      .map(([el]) => el)
  );

  return (
    <>
      <div className="flex flex-col gap-1.5">
        {/* 6 card slots + deck button */}
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

          {/* Deck button with remaining count */}
          <div className="relative">
            <div
              onClick={() => setShowDeckMenu(!showDeckMenu)}
              className="relative flex flex-col items-center justify-center rounded-[5px] select-none"
              style={{
                cursor: "pointer",
                width: 44,
                height: 64,
                background: canDraw
                  ? "linear-gradient(180deg, rgba(2, 2, 26, 0.6) 0%, rgba(1, 1, 3, 0.8) 100%)"
                  : "linear-gradient(180deg, rgba(40, 10, 10, 0.6) 0%, rgba(20, 5, 5, 0.8) 100%)",
                borderColor: canDraw ? "rgb(7, 18, 119)" : "rgb(100, 30, 30)",
                borderWidth: 1,
              }}
            >
              <span className="text-[11px] font-bold font-mono" style={{ color: canDraw ? "#6890F0" : "#EF4444" }}>
                {deckRemaining}
              </span>
              <span className="text-[7px] text-muted-foreground mt-0.5">
                {canDraw ? "cartas" : "vazio"}
              </span>
            </div>

            {/* Deck popup menu */}
            <AnimatePresence>
              {showDeckMenu && (
                <>
                  {/* Backdrop to close */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDeckMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-[68px] right-0 z-50 flex flex-col gap-1 p-2 rounded-lg border"
                    style={{
                      background: "linear-gradient(180deg, #0a0a2e 0%, #050510 100%)",
                      borderColor: "#1e3a8a",
                      minWidth: 160,
                      boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
                    }}
                  >
                    <p className="text-[9px] text-muted-foreground text-center mb-1">
                      Baralho: {deckRemaining} restantes 
                    </p>

                    {/* Option 1: Draw card (costs 1 PA) */}
                    <button
                      onClick={handleDraw}
                      disabled={!canDraw || isDrawing || battle.pa < 1}
                      className="flex items-center gap-2 px-2 py-1.5 rounded text-left text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        background: canDraw && battle.pa >= 1 ? "rgba(104,144,240,0.15)" : "rgba(100,100,100,0.1)",
                        color: canDraw && battle.pa >= 1 ? "#93C5FD" : "#666",
                      }}
                    >
                      <span className="text-[10px]">{"\uD83C\uDCCF"}</span>
                      Comprar carta
                      <span className="text-[8px] font-mono text-amber-400 ml-auto">1PA</span>
                    </button>

                    {/* Option 2: Shuffle */}
                    <button
                      onClick={handleShuffle}
                      disabled={deckRemaining <= 1}
                      className="flex items-center gap-2 px-2 py-1.5 rounded text-left text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        background: "rgba(168,104,255,0.15)",
                        color: deckRemaining > 1 ? "#C4B5FD" : "#666",
                      }}
                    >
                      <span className="text-[10px]">{"\uD83D\uDD00"}</span>
                      Embaralhar
                    </button>

                    {/* Option 3: Replenish */}
                    <button
                      onClick={handleReplenish}
                      disabled={discardCount === 0}
                      className="flex items-center gap-2 px-2 py-1.5 rounded text-left text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        background: discardCount > 0 ? "rgba(74,222,128,0.15)" : "rgba(100,100,100,0.1)",
                        color: discardCount > 0 ? "#86EFAC" : "#666",
                      }}
                    >
                      <span className="text-[10px]">{"\u267B"}</span>
                      Repor cartas ({totalDrawn})
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
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

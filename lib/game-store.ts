import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PokemonSpecies, BagItemDef, PokemonBaseAttributes, DamageBreakdown, HitResult } from "./pokemon-data";
import { getGameStoreKey } from "./mode-store";
import { BAG_ITEMS, getMove, getPokemon, canEvolveByLevel, canEvolveByStone, canEvolveByTrade, xpForLevel, computeAttributes, getBaseAttributes, applyFaintPenalty, applyLevelUpBonus, rollDamageAgainstPokemon, calculateHitResult, calculateBattleDamage, getDamageMultiplier } from "./pokemon-data";
import type { BattleCard, CardAlignment, CardElement, SuperEffect } from "./card-data";
import { drawCard, buildDeck, shuffleDeck, createLuckCardOfElement, checkLuckTrio, checkBadLuckTrio, checkElementalAffinity, calculateBadLuckPenalty, rollSuperAdvantage, rollSuperPunishment, countFieldCardsByElement, consumeEnergyCards, hasAuraAmplificada, consumeAuraAmplificada } from "./card-data";

export type PokemonAttributeKey = keyof PokemonBaseAttributes;

export interface ActiveMove {
  moveId: string;
  currentPP: number;
  maxPP: number;
}

export interface BattleHistoryEntry {
  id: string;
  type: "victory" | "faint";
  date: string; // ISO string
  xpGained?: number;
  opponentName?: string;
}

export interface TrainerBattleHistoryEntry {
  id: string;
  type: "team-victory" | "npc-battle";
  date: string;
  xpPerPokemon?: number;
  teamSnapshot?: string[]; // pokemon names at time of victory
  // NPC battle fields
  won?: boolean;
  opponentName?: string;
  xpGained?: number;
  moneyGained?: number;
}

export interface TeamPokemon {
  uid: string;
  speciesId: number;
  name: string;
  level: number;
  type: string[];
  xp: number;
  maxHp: number;
  currentHp: number;
  moves: ActiveMove[];
  learnableMoves: string[];
  /** Override base attributes (modified by faint penalties and level-up bonuses) */
  customAttributes?: PokemonBaseAttributes;
  battleHistory?: BattleHistoryEntry[];
}

export interface BagItem {
  itemId: string;
  quantity: number;
}

export interface TrainerAttributes {
  combate: number;      // Battle instinct: +1 to D20 roll per 2 pts
  afinidade: number;    // Pokemon bond: +3 HP per pt on healing
  sorte: number;        // Luck: expands crit range by 1 per 2 pts
  furtividade: number;  // Stealth: RP + flee bonus
  percepcao: number;    // Perception: RP + item finding
  carisma: number;      // Charisma: RP + capture bonus
}

export const DEFAULT_ATTRIBUTES: TrainerAttributes = {
  combate: 0,
  afinidade: 0,
  sorte: 0,
  furtividade: 0,
  percepcao: 0,
  carisma: 0,
};

export const ATTRIBUTE_INFO: Record<keyof TrainerAttributes, { name: string; icon: string; desc: string; battleEffect: string }> = {
  combate: { name: "Combate", icon: "swords", desc: "Instinto de batalha do treinador.", battleEffect: "+1 na rolagem D20 a cada 2 pontos" },
  afinidade: { name: "Afinidade", icon: "heart", desc: "Vinculo com seus Pokemon.", battleEffect: "+3 HP de cura por ponto" },
  sorte: { name: "Sorte", icon: "sparkles", desc: "Sorte e acasos favoraveis.", battleEffect: "Critico em 19+ (2pts), 18+ (4pts)..." },
  furtividade: { name: "Furtividade", icon: "eye-off", desc: "Habilidade de se mover sem ser visto.", battleEffect: "Bonus em fugas e ataques surpresa" },
  percepcao: { name: "Percepcao", icon: "eye", desc: "Atencao aos detalhes e perigos.", battleEffect: "Bonus em encontrar itens e armadilhas" },
  carisma: { name: "Carisma", icon: "users", desc: "Poder de persuasao e lideranca.", battleEffect: "Bonus em captura e interacoes" },
};

export interface TrainerProfile {
  name: string;
  age: string;
  hometown: string;
  trainerClass: string;
  money: number;
  badges: Badge[];
  johtoBadges: Badge[];
  attributes: TrainerAttributes;
  // RPG stats
  level: number;
  xp: number;
  maxHp: number;
  currentHp: number;
  defesa: number; // AC / defense
  battleHistory?: TrainerBattleHistoryEntry[];
  // Exploration system
  explorationXp: number;
  explorationLevel: number;
  // Daily streak system
  dailyStreak: number;
  lastCaptureDate: string | null; // ISO date string YYYY-MM-DD
  weekStartDate: string | null; // ISO date string YYYY-MM-DD - quando a semana atual começou
  legendaryUnlockedDays: number[]; // which 30-day milestones were unlocked (30, 60, 90...)
  // Weekly events
  weeklyEventProgress: WeeklyEventProgress | null;
  // Battle system
  battleXp: number;
  battleLevel: number;
  battleWins: number;
  battleLosses: number;
}

/** XP required for a given trainer level */
export function trainerXpForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.floor(100 * Math.pow(level - 1, 1.5));
}

/** XP required for a given exploration level */
export function explorationXpForLevel(level: number): number {
  if (level <= 1) return 0;
  // Slightly easier curve than trainer XP
  return Math.floor(80 * Math.pow(level - 1, 1.4));
}

/** XP required for a given battle level */
export function battleXpForLevel(level: number): number {
  if (level <= 1) return 0;
  // Similar curve to exploration
  return Math.floor(100 * Math.pow(level - 1, 1.5));
}

/** Calculate exploration XP for a capture based on balls used */
export function calculateExplorationXp(ballsUsed: number): number {
  // 1 ball = 100 XP (perfect catch bonus)
  // 2 balls = 70 XP
  // 3 balls = 50 XP
  // 4 balls = 35 XP
  // 5+ balls = 20 XP (minimum)
  if (ballsUsed <= 1) return 100;
  if (ballsUsed === 2) return 70;
  if (ballsUsed === 3) return 50;
  if (ballsUsed === 4) return 35;
  return 20;
}

/** Rewards for reaching an exploration level */
export interface ExplorationReward {
  type: "money" | "item";
  itemId?: string;
  itemName?: string;
  quantity: number;
}

export function getExplorationLevelRewards(level: number): ExplorationReward[] {
  // Every level gives some reward
  const rewards: ExplorationReward[] = [];

  // Money at every level (scales with level)
  rewards.push({ type: "money", quantity: 200 + (level - 1) * 100 });

  // Pokeballs
  if (level % 2 === 0) {
    // Even levels: regular pokeballs
    rewards.push({ type: "item", itemId: "pokeball", itemName: "Pokeball", quantity: 3 + Math.floor(level / 3) });
  }

  if (level % 3 === 0) {
    // Every 3 levels: great balls
    rewards.push({ type: "item", itemId: "great-ball", itemName: "Great Ball", quantity: 2 + Math.floor(level / 5) });
  }

  if (level % 5 === 0) {
    // Every 5 levels: ultra balls
    rewards.push({ type: "item", itemId: "ultra-ball", itemName: "Ultra Ball", quantity: 1 + Math.floor(level / 10) });
  }

  if (level % 7 === 0) {
    // Every 7 levels: super potions
    rewards.push({ type: "item", itemId: "super-potion", itemName: "Super Pocao", quantity: 2 });
  }

  if (level === 10 || level === 20 || level === 30) {
    // Milestone levels: rare candy
    rewards.push({ type: "item", itemId: "rare-candy", itemName: "Rare Candy", quantity: 1 });
  }

  return rewards;
}

// ---- Legendary Pokemon desbloqueados a cada 30 dias de ofensiva ----
// IDs dos lendários em ordem de desbloqueio (Kanto/Johto)
export const STREAK_LEGENDARY_IDS: number[] = [
  144, // Articuno  (30 dias)
  145, // Zapdos    (60 dias)
  146, // Moltres   (90 dias)
  243, // Raikou    (120 dias)
  244, // Entei     (150 dias)
  245, // Suicune   (180 dias)
  249, // Lugia     (210 dias)
  250, // Ho-Oh     (240 dias)
  151, // Mew       (270 dias)
  250, // Celebi    (300 dias) – placeholder 251 if available
];

export function getLegendaryForMilestone(milestone: number): number | null {
  const idx = milestone / 30 - 1;
  return STREAK_LEGENDARY_IDS[idx] ?? null;
}

export interface StreakUpdateResult {
  newStreak: number;
  milestoneReached: number | null; // e.g. 30, 60, 90
  legendaryId: number | null;
  streakBroken: boolean;
}

/** Returns today's date as YYYY-MM-DD string */
export function getTodayDateStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Returns the Monday of the current week as YYYY-MM-DD */
export function getWeekStartDate(): string {
  const d = new Date();
  // Get current day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const dayOfWeek = d.getDay();
  // Calculate days since Monday (0 if today is Monday, 1 if Tuesday, etc.)
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(d);
  monday.setDate(monday.getDate() - daysSinceMonday);
  return `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, "0")}-${String(monday.getDate()).padStart(2, "0")}`;
}

/** Compute streak status given lastCaptureDate and current streak */
export function computeStreakUpdate(
  currentStreak: number,
  lastCaptureDate: string | null,
  weekStartDate: string | null,
  legendaryUnlockedDays: number[]
): StreakUpdateResult {
  const today = getTodayDateStr();
  const currentWeekStart = getWeekStartDate();
  let newStreak = currentStreak;
  let streakBroken = false;

  // Check if we're in a new week - if so, reset streak to 0 until they capture today
  const weekChanged = weekStartDate !== currentWeekStart;

  if (!lastCaptureDate) {
    // First ever capture
    newStreak = 1;
  } else if (lastCaptureDate === today) {
    // Already captured today, no change
    return { newStreak: currentStreak, milestoneReached: null, legendaryId: null, streakBroken: false };
  } else if (weekChanged) {
    // New week started - reset to 1 if captured today (which means yesterday was last day of last week)
    const last = new Date(lastCaptureDate + "T12:00:00");
    const now = new Date(today + "T12:00:00");
    const diffDays = Math.round((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Captured yesterday, continuing into new week
      newStreak = 1;
    } else {
      // Gap, reset to 1 (for today)
      newStreak = 1;
    }
  } else {
    // Same week - check if consecutive days
    const last = new Date(lastCaptureDate + "T12:00:00");
    const now = new Date(today + "T12:00:00");
    const diffDays = Math.round((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      newStreak = currentStreak + 1;
    } else {
      // Streak broken within week
      newStreak = 1;
      streakBroken = true;
    }
  }

  // Check if new 30-day milestone was reached
  let milestoneReached: number | null = null;
  let legendaryId: number | null = null;
  if (newStreak > 0 && newStreak % 30 === 0) {
    const milestone = newStreak;
    if (!legendaryUnlockedDays.includes(milestone)) {
      milestoneReached = milestone;
      legendaryId = getLegendaryForMilestone(milestone);
    }
  }

  return { newStreak, milestoneReached, legendaryId, streakBroken };
}

// ---- Weekly Events System ----
export interface WeeklyMission {
  id: string;
  description: string;
  target: number;
  type: "catch_type" | "catch_one_ball" | "catch_total" | "catch_unique";
  pokemonType?: string; // for catch_type missions
}

export interface WeeklyEvent {
  id: string;
  title: string;
  missions: WeeklyMission[];
  rewardMoney: number;
  rewardItems: { itemId: string; itemName: string; quantity: number }[];
  rewardPokemonId: number; // rare/trade-evo Pokemon reward
  rewardPokemonLevel: number;
}

export interface WeeklyEventProgress {
  eventId: string;
  weekKey: string; // e.g. "2026-W09"
  missionProgress: Record<string, number>; // missionId -> current progress
  completed: boolean;
  rewardClaimed: boolean;
}

/** Get the current ISO week key (YYYY-Www) */
export function getCurrentWeekKey(): string {
  const d = new Date();
  const dayOfYear = Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 1).getTime()) / 86400000);
  const weekNum = Math.ceil((dayOfYear + new Date(d.getFullYear(), 0, 1).getDay() + 1) / 7);
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

/** All possible weekly event templates (rotated weekly) */
const WEEKLY_EVENT_POOL: WeeklyEvent[] = [
  {
    id: "bug_hunter",
    title: "Cacador de Insetos",
    missions: [
      { id: "bug_10", description: "Capture 10 Pokemon tipo Inseto", target: 10, type: "catch_type", pokemonType: "bug" },
      { id: "one_ball_3", description: "Capture 3 Pokemon seguidos com 1 pokebola", target: 3, type: "catch_one_ball" },
      { id: "catch_5", description: "Capture 5 Pokemon no total", target: 5, type: "catch_total" },
    ],
    rewardMoney: 1500,
    rewardItems: [
      { itemId: "great-ball", itemName: "Great Ball", quantity: 5 },
      { itemId: "super-potion", itemName: "Super Pocao", quantity: 3 },
    ],
    rewardPokemonId: 123, // Scyther (raro)
    rewardPokemonLevel: 15,
  },
  {
    id: "water_master",
    title: "Mestre das Aguas",
    missions: [
      { id: "water_8", description: "Capture 8 Pokemon tipo Agua", target: 8, type: "catch_type", pokemonType: "water" },
      { id: "one_ball_4", description: "Capture 4 Pokemon seguidos com 1 pokebola", target: 4, type: "catch_one_ball" },
      { id: "catch_6", description: "Capture 6 Pokemon no total", target: 6, type: "catch_total" },
    ],
    rewardMoney: 1500,
    rewardItems: [
      { itemId: "ultra-ball", itemName: "Ultra Ball", quantity: 3 },
      { itemId: "potion", itemName: "Pocao", quantity: 5 },
    ],
    rewardPokemonId: 131, // Lapras (raro)
    rewardPokemonLevel: 15,
  },
  {
    id: "fire_fury",
    title: "Furia do Fogo",
    missions: [
      { id: "fire_7", description: "Capture 7 Pokemon tipo Fogo", target: 7, type: "catch_type", pokemonType: "fire" },
      { id: "one_ball_2", description: "Capture 2 Pokemon seguidos com 1 pokebola", target: 2, type: "catch_one_ball" },
      { id: "catch_8", description: "Capture 8 Pokemon no total", target: 8, type: "catch_total" },
    ],
    rewardMoney: 2000,
    rewardItems: [
      { itemId: "great-ball", itemName: "Great Ball", quantity: 4 },
      { itemId: "rare-candy", itemName: "Rare Candy", quantity: 1 },
    ],
    rewardPokemonId: 126, // Magmar (raro)
    rewardPokemonLevel: 15,
  },
  {
    id: "ghost_whisper",
    title: "Sussurro Fantasma",
    missions: [
      { id: "ghost_5", description: "Capture 5 Pokemon tipo Fantasma", target: 5, type: "catch_type", pokemonType: "ghost" },
      { id: "one_ball_5", description: "Capture 5 Pokemon seguidos com 1 pokebola", target: 5, type: "catch_one_ball" },
      { id: "catch_7", description: "Capture 7 Pokemon no total", target: 7, type: "catch_total" },
    ],
    rewardMoney: 2000,
    rewardItems: [
      { itemId: "ultra-ball", itemName: "Ultra Ball", quantity: 2 },
      { itemId: "super-potion", itemName: "Super Pocao", quantity: 4 },
    ],
    rewardPokemonId: 93, // Haunter (evolui por troca -> Gengar)
    rewardPokemonLevel: 20,
  },
  {
    id: "rock_solid",
    title: "Solido como Pedra",
    missions: [
      { id: "rock_6", description: "Capture 6 Pokemon tipo Pedra", target: 6, type: "catch_type", pokemonType: "rock" },
      { id: "one_ball_3b", description: "Capture 3 Pokemon seguidos com 1 pokebola", target: 3, type: "catch_one_ball" },
      { id: "catch_10", description: "Capture 10 Pokemon no total", target: 10, type: "catch_total" },
    ],
    rewardMoney: 1800,
    rewardItems: [
      { itemId: "great-ball", itemName: "Great Ball", quantity: 6 },
      { itemId: "potion", itemName: "Pocao", quantity: 5 },
    ],
    rewardPokemonId: 75, // Graveler (evolui por troca -> Golem)
    rewardPokemonLevel: 20,
  },
  {
    id: "psychic_mind",
    title: "Mente Psiquica",
    missions: [
      { id: "psychic_6", description: "Capture 6 Pokemon tipo Psiquico", target: 6, type: "catch_type", pokemonType: "psychic" },
      { id: "one_ball_4b", description: "Capture 4 Pokemon seguidos com 1 pokebola", target: 4, type: "catch_one_ball" },
      { id: "catch_7b", description: "Capture 7 Pokemon no total", target: 7, type: "catch_total" },
    ],
    rewardMoney: 2500,
    rewardItems: [
      { itemId: "ultra-ball", itemName: "Ultra Ball", quantity: 3 },
      { itemId: "rare-candy", itemName: "Rare Candy", quantity: 1 },
    ],
    rewardPokemonId: 64, // Kadabra (evolui por troca -> Alakazam)
    rewardPokemonLevel: 20,
  },
  {
    id: "fighting_spirit",
    title: "Espirito de Luta",
    missions: [
      { id: "fighting_5", description: "Capture 5 Pokemon tipo Lutador", target: 5, type: "catch_type", pokemonType: "fighting" },
      { id: "one_ball_3c", description: "Capture 3 Pokemon seguidos com 1 pokebola", target: 3, type: "catch_one_ball" },
      { id: "catch_9", description: "Capture 9 Pokemon no total", target: 9, type: "catch_total" },
    ],
    rewardMoney: 2000,
    rewardItems: [
      { itemId: "great-ball", itemName: "Great Ball", quantity: 5 },
      { itemId: "super-potion", itemName: "Super Pocao", quantity: 3 },
    ],
    rewardPokemonId: 67, // Machoke (evolui por troca -> Machamp)
    rewardPokemonLevel: 20,
  },
  {
    id: "electric_storm",
    title: "Tempestade Eletrica",
    missions: [
      { id: "electric_7", description: "Capture 7 Pokemon tipo Eletrico", target: 7, type: "catch_type", pokemonType: "electric" },
      { id: "one_ball_2b", description: "Capture 2 Pokemon seguidos com 1 pokebola", target: 2, type: "catch_one_ball" },
      { id: "catch_6b", description: "Capture 6 Pokemon no total", target: 6, type: "catch_total" },
    ],
    rewardMoney: 1800,
    rewardItems: [
      { itemId: "ultra-ball", itemName: "Ultra Ball", quantity: 2 },
      { itemId: "potion", itemName: "Pocao", quantity: 5 },
    ],
    rewardPokemonId: 125, // Electabuzz (raro)
    rewardPokemonLevel: 15,
  },
];

/** Get the current week's event (deterministic rotation based on week number) */
export function getCurrentWeeklyEvent(): WeeklyEvent {
  const weekKey = getCurrentWeekKey();
  const weekNum = parseInt(weekKey.split("-W")[1], 10);
  const idx = weekNum % WEEKLY_EVENT_POOL.length;
  return WEEKLY_EVENT_POOL[idx];
}

// ---- Egg System ----
export type EggTier = "green" | "yellow" | "red";

export interface EggPokemonDef {
  speciesId: number;
  name: string;
  tier: EggTier;
}

// Baby Pokemon that ONLY come from eggs (never from radar)
export const EGG_POKEMON: EggPokemonDef[] = [
  // Green eggs (3h) - common babies
  { speciesId: 172, name: "Pichu", tier: "green" },
  { speciesId: 173, name: "Cleffa", tier: "green" },
  { speciesId: 174, name: "Igglybuff", tier: "green" },
  { speciesId: 175, name: "Togepi", tier: "green" },
  { speciesId: 298, name: "Azurill", tier: "green" },
  { speciesId: 406, name: "Budew", tier: "green" },
  { speciesId: 440, name: "Happiny", tier: "green" },
  // Yellow eggs (6h) - intermediate babies
  { speciesId: 236, name: "Tyrogue", tier: "yellow" },
  { speciesId: 238, name: "Smoochum", tier: "yellow" },
  { speciesId: 239, name: "Elekid", tier: "yellow" },
  { speciesId: 240, name: "Magby", tier: "yellow" },
  { speciesId: 360, name: "Wynaut", tier: "yellow" },
  { speciesId: 433, name: "Chingling", tier: "yellow" },
  { speciesId: 438, name: "Bonsly", tier: "yellow" },
  // Red eggs (10h) - rare babies
  { speciesId: 446, name: "Munchlax", tier: "red" },
  { speciesId: 447, name: "Riolu", tier: "red" },
  { speciesId: 458, name: "Mantyke", tier: "red" },
];

// Set of all egg-exclusive Pokemon IDs (to exclude from radar)
export const BABY_POKEMON_IDS = new Set(EGG_POKEMON.map((e) => e.speciesId));

// Hatch times per tier in milliseconds
export const EGG_HATCH_TIMES: Record<EggTier, number> = {
  green: 3 * 60 * 60 * 1000,   // 3 hours
  yellow: 6 * 60 * 60 * 1000,  // 6 hours
  red: 10 * 60 * 60 * 1000,    // 10 hours
};

// XP per tier
export const EGG_HATCH_XP: Record<EggTier, number> = {
  green: 50,
  yellow: 80,
  red: 120,
};

// Egg tier colors
export const EGG_TIER_COLORS: Record<EggTier, { bg: string; border: string; glow: string; label: string }> = {
  green: { bg: "#22C55E", border: "#16A34A", glow: "rgba(34,197,94,0.3)", label: "Comum" },
  yellow: { bg: "#EAB308", border: "#CA8A04", glow: "rgba(234,179,8,0.3)", label: "Intermediario" },
  red: { bg: "#EF4444", border: "#DC2626", glow: "rgba(239,68,68,0.3)", label: "Raro" },
};

export const MAX_EGGS = 4;

export interface PokemonEgg {
  id: string;
  speciesId: number;
  name: string;
  tier: EggTier;
  foundAt: number; // timestamp ms
  hatchTimeMs: number;
}

/** Roll a random egg from the pool, weighted by tier rarity */
export function rollRandomEgg(): PokemonEgg {
  const roll = Math.random();
  let tier: EggTier;
  if (roll < 0.10) {
    tier = "red";      // 10% chance
  } else if (roll < 0.40) {
    tier = "yellow";   // 30% chance
  } else {
    tier = "green";    // 60% chance
  }

  const pool = EGG_POKEMON.filter((e) => e.tier === tier);
  const chosen = pool[Math.floor(Math.random() * pool.length)];

  return {
    id: `egg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    speciesId: chosen.speciesId,
    name: chosen.name,
    tier,
    foundAt: Date.now(),
    hatchTimeMs: EGG_HATCH_TIMES[tier],
  };
}

/** Check if an egg is ready to hatch */
export function isEggReady(egg: PokemonEgg): boolean {
  return Date.now() >= egg.foundAt + egg.hatchTimeMs;
}

/** Get remaining time in ms */
export function getEggRemainingMs(egg: PokemonEgg): number {
  return Math.max(0, (egg.foundAt + egg.hatchTimeMs) - Date.now());
}

/** Format remaining time as "Xh Xm" */
export function formatEggTime(ms: number): string {
  if (ms <= 0) return "Pronto!";
  const hours = Math.floor(ms / (60 * 60 * 1000));
  const mins = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
  const secs = Math.floor((ms % (60 * 1000)) / 1000);
  if (hours > 0) return `${hours}h ${mins}m`;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
}

/** Compute trainer defense from attributes + level */
export function computeTrainerDefesa(level: number, combate: number, furtividade: number): number {
  // Base AC 10 + floor(combate/2) + floor(furtividade/3) + floor(level/5)
  return 10 + Math.floor(combate / 2) + Math.floor(furtividade / 3) + Math.floor(level / 5);
}

/** Compute trainer max HP from level and attributes */
export function computeTrainerMaxHp(level: number, combate: number): number {
  // Base 20 HP + 3 per level + combate bonus
  return 20 + (level - 1) * 3 + combate * 2;
}

export interface Badge {
  id: string;
  name: string;
  gym: string;
  obtained: boolean;
}

export const KANTO_BADGES: Badge[] = [
  { id: "boulder", name: "Boulder Badge", gym: "Pewter City - Brock", obtained: false },
  { id: "cascade", name: "Cascade Badge", gym: "Cerulean City - Misty", obtained: false },
  { id: "thunder", name: "Thunder Badge", gym: "Vermilion City - Lt. Surge", obtained: false },
  { id: "rainbow", name: "Rainbow Badge", gym: "Celadon City - Erika", obtained: false },
  { id: "soul", name: "Soul Badge", gym: "Fuchsia City - Koga", obtained: false },
  { id: "marsh", name: "Marsh Badge", gym: "Saffron City - Sabrina", obtained: false },
  { id: "volcano", name: "Volcano Badge", gym: "Cinnabar Island - Blaine", obtained: false },
  { id: "earth", name: "Earth Badge", gym: "Viridian City - Giovanni", obtained: false },
];

export const JOHTO_BADGES: Badge[] = [
  { id: "zephyr", name: "Zephyr Badge", gym: "Violet City - Falkner", obtained: false },
  { id: "hive", name: "Hive Badge", gym: "Azalea Town - Bugsy", obtained: false },
  { id: "plain", name: "Plain Badge", gym: "Goldenrod City - Whitney", obtained: false },
  { id: "fog", name: "Fog Badge", gym: "Ecruteak City - Morty", obtained: false },
  { id: "storm", name: "Storm Badge", gym: "Cianwood City - Chuck", obtained: false },
  { id: "mineral", name: "Mineral Badge", gym: "Olivine City - Jasmine", obtained: false },
  { id: "glacier", name: "Glacier Badge", gym: "Mahogany Town - Pryce", obtained: false },
  { id: "rising", name: "Rising Badge", gym: "Blackthorn City - Clair", obtained: false },
];

export interface ShopItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
}

export const SHOP_ITEMS: ShopItem[] = [
  { id: "pokeball", name: "Pokeball", price: 200, description: "Pokeball basica para capturar Pokemon.", category: "pokeball" },
  { id: "great-ball", name: "Great Ball", price: 600, description: "Pokeball melhorada. Maior chance de captura.", category: "pokeball" },
  { id: "ultra-ball", name: "Ultra Ball", price: 1200, description: "Pokeball de alta performance.", category: "pokeball" },
  { id: "potion", name: "Poção", price: 300, description: "Restaura 20 HP de um Pokemon.", category: "potion" },
  { id: "super-potion", name: "Super Poção", price: 700, description: "Restaura 50 HP de um Pokemon.", category: "potion" },
  { id: "hyper-potion", name: "Hyper Poção", price: 1200, description: "Restaura 200 HP de um Pokemon.", category: "potion" },
  { id: "ether", name: "Ether", price: 500, description: "Restaura 5 PP de um golpe.", category: "status" },
  { id: "max-ether", name: "Max Ether", price: 900, description: "Restaura todos os PP de um golpe.", category: "status" },
  { id: "revive", name: "Revive", price: 1500, description: "Revive um Pokemon desmaiado com 50% HP.", category: "potion" },
  { id: "full-heal", name: "Full Heal", price: 600, description: "Cura qualquer problema de status.", category: "status" },
  { id: "antidote", name: "Antídoto", price: 100, description: "Cura envenenamento.", category: "status" },
  { id: "paralyze-heal", name: "Cura Paralisia", price: 200, description: "Cura paralisia.", category: "status" },
  { id: "awakening", name: "Despertar", price: 250, description: "Acorda um Pokemon adormecido.", category: "status" },
  // Evolution stones
  { id: "fire-stone", name: "Pedra de Fogo", price: 2100, description: "Evolui Pokemon do tipo Fogo.", category: "stone" },
  { id: "water-stone", name: "Pedra da Agua", price: 2100, description: "Evolui Pokemon do tipo Agua.", category: "stone" },
  { id: "thunder-stone", name: "Pedra do Trovao", price: 2100, description: "Evolui Pokemon do tipo Eletrico.", category: "stone" },
  { id: "leaf-stone", name: "Pedra da Folha", price: 2100, description: "Evolui Pokemon do tipo Planta.", category: "stone" },
  { id: "moon-stone", name: "Pedra da Lua", price: 2100, description: "Evolui Pokemon especiais.", category: "stone" },
  { id: "sun-stone", name: "Pedra do Sol", price: 2100, description: "Evolui Pokemon com luz solar.", category: "stone" },
  { id: "metal-coat", name: "Revestimento Metalico", price: 2100, description: "Evolui Pokemon de aco.", category: "stone" },
  { id: "kings-rock", name: "Pedra do Rei", price: 2100, description: "Evolui Pokemon por troca.", category: "stone" },
  { id: "dragon-scale", name: "Escama de Dragao", price: 3000, description: "Evolui Seadra em Kingdra.", category: "stone" },
  { id: "up-grade", name: "Up-Grade", price: 3000, description: "Evolui Porygon em Porygon2.", category: "stone" },
  // Rare items
  { id: "rare-candy", name: "Rare Candy", price: 4800, description: "Sobe 1 nivel instantaneamente.", category: "rare" },
  { id: "master-ball", name: "Master Ball", price: 50000, description: "Captura garantida. Rarissima.", category: "rare" },
  // Radar battery
  { id: "radar-battery", name: "Bateria do Radar", price: 30000, description: "Carrega o radar com 10 usos. Ao esgotar volta a 4. Acumula na bolsa.", category: "rare" },
];

// NPC / Enemy system (master mode)
export interface NpcPokemon {
  speciesId: number;
  level: number;
  nickname?: string;
}

export interface NpcEnemy {
  id: string;
  name: string;
  team: NpcPokemon[];
}

export type BattlePhase =
  | "idle"
  | "menu"
  | "attack-select"
  | "rolling"
  | "result"
  | "opponent-damage"
  | "bag-battle"
  | "pokeball"
  | "attribute-test-select"
  | "attribute-test-rolling"
  | "attribute-test-result";

// --- PA (Action Points) System ---
export const PA_CONFIG = {
  startingPA: 3,
  maxPA: 5,
  costs: {
    attack: 1,
    item: 1,
    switchPokemon: 1,
    attributeTest: 1,
    drawCard: 1,
    moveSquares: 1,
  },
} as const;

export type PAActionType = keyof typeof PA_CONFIG.costs;

export interface AttributeTestResult {
  attribute: PokemonAttributeKey;
  roll: number;
  modifier: number;
  total: number;
  dc: number;
  success: boolean;
  criticalSuccess: boolean;
  criticalFail: boolean;
}

export interface CardTrioEvent {
  type: CardAlignment;
  effect: SuperEffect;
  hasAffinity: boolean;
}

export interface BattleState {
  phase: BattlePhase;
  activePokemonUid: string | null;
  selectedMoveId: string | null;
  diceRoll: number | null;
  hitResult: string | null;
  damageDealt: number | null;
  damageBreakdown: DamageBreakdown | null;
  battleLog: string[];
  // Attribute test
  selectedAttribute: PokemonAttributeKey | null;
  attributeTestDC: number;
  attributeTestResult: AttributeTestResult | null;
  // Card system - finite deck
  deck: BattleCard[];          // remaining cards to draw
  discardPile: BattleCard[];   // used/consumed cards (can be replenished)
  cardField: (BattleCard | null)[];
  lastDrawnCard: BattleCard | null;
  cardTrioEvent: CardTrioEvent | null;
  cardDrawCount: number;
  badLuckPenalty: number; // cumulative -2 per bad card (-4 if same type)
  auraAmplificadaActive: boolean; // When true, hit uses 70% flat chance
  // PA (Action Points) system
  pa: number;           // Current action points
  maxPa: number;        // Max PA per turn
  turnNumber: number;   // Current turn counter
  paLog: string[];      // Log of PA spending this turn
  boardPosition: number; // Symbolic board position
  pendingAutoDraw: boolean; // Flag to trigger auto card draw from battle-cards
  // Card animation
  pokemonAnimationState: {
    isAnimating: boolean;
    effectType: "damage" | "heal" | "buff" | "debuff" | "none";
    duration: number;
  };
}

export interface PendingEvolution {
  uid: string;
  pokemonName: string;
  fromSpeciesId: number;
  toSpeciesId: number;
}

interface GameState {
  trainer: TrainerProfile;
  team: TeamPokemon[];
  reserves: TeamPokemon[];
  bag: BagItem[];
  eggs: PokemonEgg[];
  battle: BattleState;
  npcs: NpcEnemy[];
  pendingEvolution: PendingEvolution | null;
  showBattleCards: boolean;
  // Egg management
  addEgg: (egg: PokemonEgg) => boolean;
  hatchEgg: (eggId: string) => TeamPokemon | null;
  removeEgg: (eggId: string) => void;
  // Trainer management
  updateTrainer: (data: Partial<TrainerProfile>) => void;
  toggleBattleCards: () => void;
  addMoney: (amount: number) => void;
  spendMoney: (amount: number) => boolean;
  toggleBadge: (badgeId: string) => void;
  toggleJohtoBadge: (badgeId: string) => void;
  updateAttributes: (attrs: Partial<TrainerAttributes>) => void;
  buyItem: (shopItem: ShopItem, qty: number) => boolean;
  // Team management
  addToTeam: (species: PokemonSpecies) => void;
  addToTeamWithLevel: (species: PokemonSpecies, level: number) => string;
  removeFromTeam: (uid: string) => void;
  transferToProfesor: (uid: string) => { xpGained: number; recipientName: string | null };
  transferAllDuplicates: (speciesId: number, keepUid: string) => { count: number; totalXp: number };
  reorderTeam: (fromIndex: number, toIndex: number) => void;
  // Reserves management
  moveToReserves: (uid: string) => void;
  moveToTeam: (uid: string) => void;
  removeFromReserves: (uid: string) => void;
  // Battle history
  addPokemonBattleHistory: (uid: string, entry: Omit<BattleHistoryEntry, "id">) => void;
  addTrainerBattleHistory: (entry: Omit<TrainerBattleHistoryEntry, "id">) => void;
  learnMove: (uid: string, moveId: string) => void;
  forgetMove: (uid: string, moveId: string) => void;
  // Bag management
  addBagItem: (itemId: string, qty: number) => void;
  useBagItem: (itemId: string, targetUid?: string, moveId?: string) => void;
  // Battle
  startBattle: (uid: string) => void;
  endBattle: () => void;
  setBattlePhase: (phase: BattlePhase) => void;
  selectMove: (moveId: string) => void;
  resolveDiceRoll: (roll: number) => void;
  applyOpponentDamage: (damage: number) => void;
  addBattleLog: (msg: string) => void;
  clearBattleLog: () => void;
  switchBattlePokemon: (uid: string) => void;
  // Healing
  healPokemon: (uid: string, amount: number) => void;
  restorePP: (uid: string, moveId: string, amount: number) => void;
  restoreAllPP: (uid: string, amount: number) => void;
  // Level & Evolution
  addXp: (uid: string, amount: number) => void;
  setLevel: (uid: string, level: number) => void;
  evolvePokemon: (uid: string, toSpeciesId: number) => void;
  useStone: (uid: string, stoneId: string) => boolean;
  evolveByTrade: (uid: string) => boolean;
  useRareCandy: (uid: string) => void;
  // Trainer RPG stats
  addTrainerXp: (amount: number) => void;
  setTrainerLevel: (level: number) => void;
  damageTrainer: (amount: number) => void;
  healTrainer: (amount: number) => void;
  recalcTrainerStats: () => void;
  // Exploration system
  addExplorationXp: (amount: number) => ExplorationReward[];
  // Battle system
  addBattleXp: (amount: number) => { newLevel: number; levelsGained: number };
  recordBattleResult: (won: boolean, xpGained: number) => void;
  // Daily streak system
  registerDailyCapture: () => StreakUpdateResult;
  // Weekly events
  trackWeeklyCapture: (pokemonTypes: string[], ballsUsed: number) => void;
  claimWeeklyEventReward: () => boolean;
  // Pokemon attribute modifications
  applyFaintPenaltyToPokemon: (uid: string) => void;
  applyLevelUpBonusToPokemon: (uid: string) => void;
  rollDamageOnPokemon: (uid: string, baseDamage: number) => { attackRoll: number; hitAC: boolean; finalDamage: number; defenseReduction: number } | null;
  // Attribute tests
  selectAttributeTest: (attribute: PokemonAttributeKey, dc: number) => void;
  resolveAttributeTest: (roll: number) => void;
  // NPC management
  addNpc: (name: string) => string;
  removeNpc: (id: string) => void;
  updateNpcName: (id: string, name: string) => void;
  addNpcPokemon: (npcId: string, speciesId: number, level: number) => void;
  removeNpcPokemon: (npcId: string, index: number) => void;
  updateNpcPokemonLevel: (npcId: string, index: number, level: number) => void;
  // Evolution queue
  triggerEvolution: (evolution: PendingEvolution) => void;
  completeEvolution: () => void;
  // Card system
  drawBattleCard: () => BattleCard | null;
  replaceCardInSlot: (slotIndex: number, card: BattleCard) => void;
  shuffleDeckAction: () => void;
  replenishDeck: () => void;
  // Luck trio choice actions
  trioChoiceTradeForElement: (element: CardElement) => void;
  trioChoiceRemoveBadLuck: (slotIndex: number) => void;
  trioChoiceDoNothing: () => void;
  clearCardField: () => void;
  dismissTrioEvent: () => void;
  recalcBadLuckPenalty: () => void;
  activateCardEffect: (slotIndex: number) => { isCrit: boolean; alignment: string } | undefined;
  activateHealCard: (slotIndex: number, targetUid: string) => boolean;
  activateResurrectCard: (slotIndex: number, targetUid: string) => boolean;
  // PA system
  spendPA: (action: PAActionType) => boolean;
  endTurn: () => void;
  moveBoardSquares: () => boolean;
  clearPendingAutoDraw: () => void;
}

function generateUid(): string {
  return Math.random().toString(36).substring(2, 10);
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      trainer: {
        name: "",
        age: "",
        hometown: "Pallet Town",
        trainerClass: "Treinador Pokemon",
        money: 3000,
        badges: KANTO_BADGES.map((b) => ({ ...b })),
        johtoBadges: JOHTO_BADGES.map((b) => ({ ...b })),
        attributes: { ...DEFAULT_ATTRIBUTES },
        level: 1,
        xp: 0,
        maxHp: 20,
        currentHp: 20,
        defesa: 10,
        battleHistory: [],
        explorationXp: 0,
        explorationLevel: 1,
        dailyStreak: 0,
        lastCaptureDate: null,
        weekStartDate: null,
        legendaryUnlockedDays: [],
        weeklyEventProgress: null,
        battleXp: 0,
        battleLevel: 1,
        battleWins: 0,
        battleLosses: 0,
      },
      team: [],
      reserves: [],
      eggs: [],
      bag: [
        { itemId: "potion", quantity: 5 },
        { itemId: "super-potion", quantity: 2 },
        { itemId: "ether", quantity: 3 },
        { itemId: "pokeball", quantity: 10 },
        { itemId: "great-ball", quantity: 5 },
        { itemId: "revive", quantity: 2 },
      ],
      npcs: [],
      pendingEvolution: null,
      showBattleCards: true,
      battle: {
        phase: "idle",
        activePokemonUid: null,
        selectedMoveId: null,
        diceRoll: null,
        hitResult: null,
        damageDealt: null,
        damageBreakdown: null,
        battleLog: [],
        selectedAttribute: null,
        attributeTestDC: 10,
        attributeTestResult: null,
        // Card system - finite deck
        deck: buildDeck(),
        discardPile: [],
        cardField: [null, null, null, null, null, null],
        lastDrawnCard: null,
        cardTrioEvent: null,
        cardDrawCount: 0,
        badLuckPenalty: 0,
        auraAmplificadaActive: false,
        // Card animation
        pokemonAnimationState: {
          isAnimating: false,
          effectType: "none",
          duration: 0,
        },
      },

      // ── Egg management ──
      addEgg: (egg) => {
        const { eggs } = get();
        if (eggs.length >= MAX_EGGS) return false;
        set({ eggs: [...eggs, egg] });
        return true;
      },
      hatchEgg: (eggId) => {
        const { eggs } = get();
        const egg = eggs.find((e) => e.id === eggId);
        if (!egg || !isEggReady(egg)) return null;

        // Add pokemon to team/reserves
        const species = getPokemon(egg.speciesId);
        if (!species) return null;

        const uid = get().addToTeamWithLevel(species, 1);
        if (!uid) return null;

        // Set HP to 10 for hatched babies
        const state = get();
        const mapHp = (p: TeamPokemon) =>
          p.uid === uid ? { ...p, maxHp: 10, currentHp: 10 } : p;
        set({
          team: state.team.map(mapHp),
          reserves: state.reserves.map(mapHp),
        });

        // Grant exploration XP
        const xp = EGG_HATCH_XP[egg.tier];
        get().addExplorationXp(xp);

        // Remove egg
        set({ eggs: get().eggs.filter((e) => e.id !== eggId) });

        // Return the hatched pokemon
        const allPokemon = [...get().team, ...get().reserves];
        return allPokemon.find((p) => p.uid === uid) ?? null;
      },
      removeEgg: (eggId) => {
        set({ eggs: get().eggs.filter((e) => e.id !== eggId) });
      },

      updateTrainer: (data) => {
        set({ trainer: { ...get().trainer, ...data } });
      },

      toggleBattleCards: () => {
        set({ showBattleCards: !get().showBattleCards });
      },

      addMoney: (amount) => {
        set({ trainer: { ...get().trainer, money: get().trainer.money + amount } });
      },

      spendMoney: (amount) => {
        const { trainer } = get();
        if (trainer.money < amount) return false;
        set({ trainer: { ...trainer, money: trainer.money - amount } });
        return true;
      },

      toggleBadge: (badgeId) => {
        set({
          trainer: {
            ...get().trainer,
            badges: get().trainer.badges.map((b) =>
              b.id === badgeId ? { ...b, obtained: !b.obtained } : b
            ),
          },
        });
      },

      toggleJohtoBadge: (badgeId) => {
        set({
          trainer: {
            ...get().trainer,
            johtoBadges: get().trainer.johtoBadges.map((b) =>
              b.id === badgeId ? { ...b, obtained: !b.obtained } : b
            ),
          },
        });
      },

      updateAttributes: (attrs) => {
        const { trainer } = get();
        const newAttrs = { ...trainer.attributes, ...attrs };
        const level = trainer.level ?? 1;
        set({
          trainer: {
            ...trainer,
            attributes: newAttrs,
            maxHp: computeTrainerMaxHp(level, newAttrs.combate),
            defesa: computeTrainerDefesa(level, newAttrs.combate, newAttrs.furtividade),
            currentHp: Math.min(trainer.currentHp ?? 20, computeTrainerMaxHp(level, newAttrs.combate)),
          },
        });
      },

      buyItem: (shopItem, qty) => {
        const totalCost = shopItem.price * qty;
        const { trainer } = get();
        if (trainer.money < totalCost) return false;
        set({ trainer: { ...trainer, money: trainer.money - totalCost } });
        get().addBagItem(shopItem.id, qty);
        return true;
      },

      addToTeam: (species) => {

        const { team, reserves } = get();
        const pokemon: TeamPokemon = {
          uid: generateUid(),
          speciesId: species.id,
          name: species.name,
          level: 1,
          xp: 0,
          type: species.types,
          maxHp: species.baseHp,
          currentHp: species.baseHp,
          moves: species.startingMoves
            .filter((id) => getMove(id))
            .map((id) => ({ moveId: id, currentPP: 10, maxPP: 10 })),
          learnableMoves: species.learnableMoves,
        };
        if (team.length >= 6) {
          set({ reserves: [...reserves, pokemon] });
        } else {
          set({ team: [...team, pokemon] });
        }
      },

      addToTeamWithLevel: (species, level) => {
        const { team, reserves } = get();
        const levelBonus = (level - 1) * 3;
        const hp = species.baseHp + levelBonus;
        const uid = generateUid();
        const pokemon: TeamPokemon = {
          uid,
          speciesId: species.id,
          name: species.name,
          level,
          xp: xpForLevel(level),
          maxHp: hp,
          currentHp: hp,
          moves: species.startingMoves
            .filter((id) => getMove(id))
            .map((id) => ({ moveId: id, currentPP: 10, maxPP: 10 })),
          learnableMoves: species.learnableMoves,
        };
        if (team.length >= 6) {
          set({ reserves: [...reserves, pokemon] });
        } else {
          set({ team: [...team, pokemon] });
        }
        return uid;
      },

      removeFromTeam: (uid) => {
        set({ team: get().team.filter((p) => p.uid !== uid) });
      },

      transferToProfesor: (uid) => {
        const { team, reserves } = get();
        const pokemon = team.find((p) => p.uid === uid) || reserves.find((p) => p.uid === uid);
        if (!pokemon) return { xpGained: 0, recipientName: null };

        const xpGained = (pokemon.level ?? 1) * 25;
        const speciesId = pokemon.speciesId;

        // Find a duplicate of the same species in the main team (not the one being transferred)
        const recipient = team.find((p) => p.speciesId === speciesId && p.uid !== uid);

        // Remove the pokemon from wherever it is
        set({
          team: team.filter((p) => p.uid !== uid),
          reserves: reserves.filter((p) => p.uid !== uid),
        });

        // Give XP to the recipient if found
        if (recipient) {
          get().addXp(recipient.uid, xpGained);
          return { xpGained, recipientName: recipient.name };
        }

        return { xpGained: 0, recipientName: null };
      },

      transferAllDuplicates: (speciesId, keepUid) => {
        const { team, reserves } = get();
        const allPokemon = [...team, ...reserves];
        const duplicates = allPokemon.filter(
          (p) => p.speciesId === speciesId && p.uid !== keepUid
        );

        if (duplicates.length === 0) return { count: 0, totalXp: 0 };

        const totalXp = duplicates.reduce((sum, p) => sum + (p.level ?? 1) * 25, 0);
        const dupUids = new Set(duplicates.map((p) => p.uid));

        // Remove all duplicates
        set({
          team: team.filter((p) => !dupUids.has(p.uid)),
          reserves: reserves.filter((p) => !dupUids.has(p.uid)),
        });

        // Give accumulated XP to the kept pokemon
        get().addXp(keepUid, totalXp);

        return { count: duplicates.length, totalXp };
      },

      reorderTeam: (fromIndex, toIndex) => {
        const newTeam = [...get().team];
        if (fromIndex < 0 || fromIndex >= newTeam.length) return;
        if (toIndex < 0 || toIndex >= newTeam.length) return;
        // Swap positions
        const temp = newTeam[fromIndex];
        newTeam[fromIndex] = newTeam[toIndex];
        newTeam[toIndex] = temp;
        set({ team: newTeam });
      },

      moveToReserves: (uid) => {
        const { team, reserves } = get();
        const pokemon = team.find((p) => p.uid === uid);
        if (!pokemon) return;
        set({
          team: team.filter((p) => p.uid !== uid),
          reserves: [...reserves, pokemon],
        });
      },

      moveToTeam: (uid) => {
        const { team, reserves } = get();
        if (team.length >= 6) return;
        const pokemon = reserves.find((p) => p.uid === uid);
        if (!pokemon) return;
        set({
          team: [...team, pokemon],
          reserves: reserves.filter((p) => p.uid !== uid),
        });
      },

      removeFromReserves: (uid) => {
        set({ reserves: get().reserves.filter((p) => p.uid !== uid) });
      },

      addPokemonBattleHistory: (uid, entry) => {
        const fullEntry: BattleHistoryEntry = { ...entry, id: generateUid() };
        const mapHistory = (p: TeamPokemon) => {
          if (p.uid !== uid) return p;
          return { ...p, battleHistory: [...(p.battleHistory || []), fullEntry] };
        };
        set({
          team: get().team.map(mapHistory),
          reserves: get().reserves.map(mapHistory),
        });
      },

      addTrainerBattleHistory: (entry) => {
        const fullEntry: TrainerBattleHistoryEntry = { ...entry, id: generateUid() };
        const { trainer } = get();
        set({
          trainer: {
            ...trainer,
            battleHistory: [...(trainer.battleHistory || []), fullEntry],
          },
        });
      },

      learnMove: (uid, moveId) => {
        const mapLearn = (p: TeamPokemon) => {
          if (p.uid !== uid) return p;
          if (p.moves.length >= 4) return p;
          if (p.moves.some((m) => m.moveId === moveId)) return p;
          return {
            ...p,
            moves: [...p.moves, { moveId, currentPP: 10, maxPP: 10 }],
            learnableMoves: p.learnableMoves.filter((id) => id !== moveId),
          };
        };
        set({
          team: get().team.map(mapLearn),
          reserves: get().reserves.map(mapLearn),
        });
      },

      forgetMove: (uid, moveId) => {
        const mapForget = (p: TeamPokemon) => {
          if (p.uid !== uid) return p;
          return {
            ...p,
            moves: p.moves.filter((m) => m.moveId !== moveId),
            learnableMoves: [...p.learnableMoves, moveId],
          };
        };
        set({
          team: get().team.map(mapForget),
          reserves: get().reserves.map(mapForget),
        });
      },

      addBagItem: (itemId, qty) => {
        const { bag } = get();
        const existing = bag.find((i) => i.itemId === itemId);
        if (existing) {
          set({
            bag: bag.map((i) =>
              i.itemId === itemId
                ? { ...i, quantity: i.quantity + qty }
                : i
            ),
          });
        } else {
          set({ bag: [...bag, { itemId, quantity: qty }] });
        }
      },

      useBagItem: (itemId, targetUid, moveId) => {
        const { bag, team, trainer } = get();
        const bagItem = bag.find((i) => i.itemId === itemId);
        if (!bagItem || bagItem.quantity <= 0) return;

        const itemDef = BAG_ITEMS.find((i) => i.id === itemId);
        if (!itemDef) return;

        const newBag = bag.map((i) =>
          i.itemId === itemId ? { ...i, quantity: i.quantity - 1 } : i
        ).filter((i) => i.quantity > 0);

        // Afinidade: +3 HP bonus per point when healing
        const afinidadeBonus = (trainer.attributes?.afinidade ?? 0) * 3;

        let newTeam = team;
        if (targetUid && itemDef.healAmount !== undefined) {
          if (itemDef.id === "revive") {
            newTeam = team.map((p) =>
              p.uid === targetUid && p.currentHp <= 0
                ? { ...p, currentHp: Math.floor(p.maxHp / 2) + afinidadeBonus }
                : p
            );
          } else {
            const totalHeal = (itemDef.healAmount || 0) + afinidadeBonus;
            newTeam = team.map((p) =>
              p.uid === targetUid
                ? { ...p, currentHp: Math.min(p.maxHp, p.currentHp + totalHeal) }
                : p
            );
          }
        }

        if (targetUid && itemDef.ppRestore) {
          if (moveId) {
            newTeam = newTeam.map((p) =>
              p.uid === targetUid
                ? {
                  ...p,
                  moves: p.moves.map((m) =>
                    m.moveId === moveId
                      ? { ...m, currentPP: Math.min(m.maxPP, m.currentPP + itemDef.ppRestore!) }
                      : m
                  ),
                }
                : p
            );
          } else {
            newTeam = newTeam.map((p) =>
              p.uid === targetUid
                ? {
                  ...p,
                  moves: p.moves.map((m) => ({
                    ...m,
                    currentPP: Math.min(m.maxPP, m.currentPP + itemDef.ppRestore!),
                  })),
                }
                : p
            );
          }
        }

        set({ bag: newBag, team: newTeam });
      },

      startBattle: (uid) => {
        set({
          battle: {
            phase: "menu",
            activePokemonUid: uid,
            selectedMoveId: null,
            diceRoll: null,
            hitResult: null,
            damageDealt: null,
            damageBreakdown: null,
            battleLog: [],
            selectedAttribute: null,
            attributeTestDC: 10,
            attributeTestResult: null,
            deck: buildDeck(),
            discardPile: [],
            cardField: [null, null, null, null, null, null],
            lastDrawnCard: null,
            cardTrioEvent: null,
            cardDrawCount: 0,
            badLuckPenalty: 0,
            auraAmplificadaActive: false,
            pa: PA_CONFIG.startingPA,
            maxPa: PA_CONFIG.maxPA,
            turnNumber: 1,
            paLog: [],
            boardPosition: 0,
            pendingAutoDraw: false,
          },
        });
      },

      endBattle: () => {
        set({
          battle: {
            phase: "idle",
            activePokemonUid: null,
            selectedMoveId: null,
            diceRoll: null,
            hitResult: null,
            damageDealt: null,
            damageBreakdown: null,
            battleLog: [],
            selectedAttribute: null,
            attributeTestDC: 10,
            attributeTestResult: null,
            deck: buildDeck(),
            discardPile: [],
            cardField: [null, null, null, null, null, null],
            lastDrawnCard: null,
            cardTrioEvent: null,
            cardDrawCount: 0,
            badLuckPenalty: 0,
            auraAmplificadaActive: false,
            pa: PA_CONFIG.startingPA,
            maxPa: PA_CONFIG.maxPA,
            turnNumber: 1,
            paLog: [],
            boardPosition: 0,
            pendingAutoDraw: false,
          },
        });
      },

      setBattlePhase: (phase) => {
        set({ battle: { ...get().battle, phase } });
      },

      selectMove: (moveId) => {
        const { battle, team, showBattleCards } = get();
        const pokemon = team.find((p) => p.uid === battle.activePokemonUid);
        if (!pokemon) return;
        const activeMove = pokemon.moves.find((m) => m.moveId === moveId);
        if (!activeMove || activeMove.currentPP <= 0) return;

        // Check energy cost
        const moveDef = getMove(moveId);
        if (!moveDef) return;

        let updatedCardField = battle.cardField;
        let useAuraAmplificada = false;
        let consumedCards: import("./card-data").BattleCard[] = [];

        // Only check energy cost if battle cards are enabled
        if (showBattleCards && moveDef.energy_cost > 0) {
          const available = countFieldCardsByElement(battle.cardField, moveDef.energy_type);
          const hasAmplificada = hasAuraAmplificada(battle.cardField);

          if (available >= moveDef.energy_cost) {
            // Enough normal energy - consume it
            const result = consumeEnergyCards(updatedCardField, moveDef.energy_type, moveDef.energy_cost);
            updatedCardField = result.field;
            consumedCards = result.consumed;
          } else if (hasAmplificada) {
            // Use Aura Amplificada to bypass energy cost
            const result = consumeAuraAmplificada(updatedCardField);
            updatedCardField = result.field;
            consumedCards = result.consumed;
            useAuraAmplificada = true;
          } else {
            return; // Not enough energy cards and no aura
          }
        }

        // Recalculate bad luck penalty after consuming cards
        const species = getPokemon(pokemon.speciesId);
        const pokemonTypes = species ? species.types : [];
        const newPenalty = calculateBadLuckPenalty(updatedCardField, pokemonTypes);

        // Deduct 1 PP
        set({
          team: team.map((p) =>
            p.uid === pokemon.uid
              ? {
                ...p,
                moves: p.moves.map((m) =>
                  m.moveId === moveId
                    ? { ...m, currentPP: m.currentPP - 1 }
                    : m
                ),
              }
              : p
          ),
          battle: {
            ...battle,
            phase: "rolling",
            selectedMoveId: moveId,
            diceRoll: null,
            hitResult: null,
            damageDealt: null,
            damageBreakdown: null,
            cardField: updatedCardField,
            badLuckPenalty: newPenalty,
            auraAmplificadaActive: useAuraAmplificada,
            discardPile: [...battle.discardPile, ...consumedCards],
          },
        });
      },

      resolveDiceRoll: (roll) => {
        const { battle, trainer, team } = get();
        const move = getMove(battle.selectedMoveId || "");
        if (!move) return;

        const trainerAttrs = trainer.attributes || DEFAULT_ATTRIBUTES;
        // Combate: +1 to effective roll per 2 points
        const combateBonus = Math.floor(trainerAttrs.combate / 2);
        // Sorte: expands crit range by 1 per 2 points (20 -> 19 -> 18...)
        const critExpansion = Math.floor(trainerAttrs.sorte / 2);
        const critThreshold = Math.max(15, 20 - critExpansion);

        const effectiveRoll = roll + combateBonus;

        // Determine hit result
        let hitResult: HitResult;

        if (battle.auraAmplificadaActive) {
          // Aura Amplificada: D20 always counts as 20 - guaranteed critical hit!
          hitResult = "critical-hit";
        } else if (roll === 1) {
          hitResult = "critical-miss";
        } else if (roll >= critThreshold) {
          hitResult = "critical-hit";
        } else if (effectiveRoll >= move.accuracy + 5) {
          hitResult = "strong-hit";
        } else if (effectiveRoll >= move.accuracy) {
          hitResult = "hit";
        } else {
          hitResult = "miss";
        }

        // Get active Pokemon's computed attributes for damage scaling
        const activePokemon = team.find((p) => p.uid === battle.activePokemonUid);
        const pokemonAttrs = activePokemon
          ? computeAttributes(activePokemon.speciesId, activePokemon.level, activePokemon.customAttributes)
          : computeAttributes(1, 5); // fallback
        const attackerLevel = activePokemon?.level || 5;

        // Calculate dice-based damage with full breakdown (level scaling applied)
        const breakdown = calculateBattleDamage(move, hitResult, pokemonAttrs, 0, attackerLevel);
        // damageDealt = the raw total before target defense (target defense is applied on applyOpponentDamage)
        const damageDealt = breakdown.rawTotal;

        set({
          battle: {
            ...battle,
            phase: "result",
            diceRoll: roll,
            hitResult,
            damageDealt,
            damageBreakdown: breakdown,
            auraAmplificadaActive: false,
          },
        });
      },

      applyOpponentDamage: (damage) => {
        const { battle, team } = get();
        const uid = battle.activePokemonUid;
        if (!uid) return;
        const pokemon = team.find((p) => p.uid === uid);
        if (!pokemon) return;

        // Apply defense reduction
        const attrs = computeAttributes(pokemon.speciesId, pokemon.level, pokemon.customAttributes);
        const defenseReduction = Math.floor(attrs.defesa / 3);
        const finalDamage = Math.max(1, damage - defenseReduction);
        const newHp = Math.max(0, pokemon.currentHp - finalDamage);

        set({
          team: team.map((p) =>
            p.uid === uid
              ? { ...p, currentHp: newHp }
              : p
          ),
          battle: {
            ...battle,
            battleLog: [
              ...battle.battleLog,
              `Adversario causou ${damage} de dano bruto! Defesa absorveu ${defenseReduction}. Dano final: ${finalDamage}.`,
            ],
          },
        });

        // Check faint
        if (newHp <= 0) {
          get().applyFaintPenaltyToPokemon(uid);
          set({
            battle: {
              ...get().battle,
              battleLog: [
                ...get().battle.battleLog,
                `${pokemon.name} desmaiou! Atributos penalizados.`,
              ],
            },
          });
        }
      },

      addBattleLog: (msg) => {
        set({
          battle: {
            ...get().battle,
            battleLog: [...get().battle.battleLog, msg],
          },
        });
      },

      clearBattleLog: () => {
        set({
          battle: {
            ...get().battle,
            battleLog: [],
          },
        });
      },

      switchBattlePokemon: (uid) => {
        const { battle } = get();
        if (battle.phase === "idle" || battle.activePokemonUid === uid) return;
        set({
          battle: {
            ...battle,
            activePokemonUid: uid,
            selectedMoveId: null,
            diceRoll: null,
            hitResult: null,
            damageDealt: null,
            damageBreakdown: null,
            phase: "menu",
            selectedAttribute: null,
            attributeTestResult: null,
          },
        });
      },

      healPokemon: (uid, amount) => {
        const mapHeal = (p: TeamPokemon) =>
          p.uid === uid
            ? { ...p, currentHp: Math.min(p.maxHp, p.currentHp + amount) }
            : p;
        set({
          team: get().team.map(mapHeal),
          reserves: get().reserves.map(mapHeal),
        });
      },

      restorePP: (uid, moveId, amount) => {
        const mapPP = (p: TeamPokemon) =>
          p.uid === uid
            ? {
              ...p,
              moves: p.moves.map((m) =>
                m.moveId === moveId
                  ? { ...m, currentPP: Math.min(m.maxPP, m.currentPP + amount) }
                  : m
              ),
            }
            : p;
        set({
          team: get().team.map(mapPP),
          reserves: get().reserves.map(mapPP),
        });
      },

      restoreAllPP: (uid, amount) => {
        const mapAllPP = (p: TeamPokemon) =>
          p.uid === uid
            ? {
              ...p,
              moves: p.moves.map((m) => ({
                ...m,
                currentPP: Math.min(m.maxPP, m.currentPP + amount),
              })),
            }
            : p;
        set({
          team: get().team.map(mapAllPP),
          reserves: get().reserves.map(mapAllPP),
        });
      },

      addXp: (uid, amount) => {
        const { team, reserves } = get();
        const pokemon = team.find((p) => p.uid === uid) || reserves.find((p) => p.uid === uid);
        if (!pokemon) return;

        const currentXp = pokemon.xp ?? 0;
        const currentLevel = pokemon.level ?? 1;
        let newXp = currentXp + amount;
        let newLevel = currentLevel;
        // Check for level ups
        while (newXp >= xpForLevel(newLevel + 1) && newLevel < 100) {
          newLevel++;
        }

        // Calculate HP scaling: +3 HP per level gained
        const levelsGained = newLevel - currentLevel;
        const hpGain = levelsGained * 3;

        // Apply attribute level-up bonuses for each level gained
        let currentAttrs = pokemon.customAttributes || getBaseAttributes(pokemon.speciesId);
        for (let i = 0; i < levelsGained; i++) {
          currentAttrs = applyLevelUpBonus(currentAttrs);
        }

        const mapXp = (p: TeamPokemon) =>
          p.uid === uid
            ? {
              ...p,
              xp: newXp,
              level: newLevel,
              maxHp: p.maxHp + hpGain,
              currentHp: Math.min(p.currentHp + hpGain, p.maxHp + hpGain),
              customAttributes: levelsGained > 0 ? currentAttrs : p.customAttributes,
            }
            : p;
        set({
          team: team.map(mapXp),
          reserves: reserves.map(mapXp),
        });

        // Auto-trigger evolution if level requirement met
        if (levelsGained > 0) {
          const evo = canEvolveByLevel(pokemon.speciesId, newLevel);
          if (evo) {
            const evolvedSpecies = getPokemon(evo.to);
            if (evolvedSpecies) {
              // Small delay so the level-up state is rendered first
              setTimeout(() => {
                get().triggerEvolution({
                  uid,
                  pokemonName: pokemon.name,
                  fromSpeciesId: pokemon.speciesId,
                  toSpeciesId: evo.to,
                });
              }, 300);
            }
          }
        }
      },

      setLevel: (uid, level) => {
        const { team, reserves } = get();
        const pokemon = team.find((p) => p.uid === uid) || reserves.find((p) => p.uid === uid);
        if (!pokemon) return;
        const currentLevel = pokemon.level ?? 1;
        const levelDiff = level - currentLevel;
        const hpChange = levelDiff * 3;

        // Apply level-up bonuses if gaining levels
        let currentAttrs = pokemon.customAttributes || getBaseAttributes(pokemon.speciesId);
        if (levelDiff > 0) {
          for (let i = 0; i < levelDiff; i++) {
            currentAttrs = applyLevelUpBonus(currentAttrs);
          }
        }

        const mapLevel = (p: TeamPokemon) =>
          p.uid === uid
            ? {
              ...p,
              level,
              xp: xpForLevel(level),
              maxHp: Math.max(1, p.maxHp + hpChange),
              currentHp: Math.max(1, Math.min(p.currentHp + Math.max(0, hpChange), Math.max(1, p.maxHp + hpChange))),
              customAttributes: levelDiff > 0 ? currentAttrs : p.customAttributes,
            }
            : p;
        set({
          team: team.map(mapLevel),
          reserves: reserves.map(mapLevel),
        });

        // Auto-trigger evolution if level requirement met
        if (levelDiff > 0) {
          const evo = canEvolveByLevel(pokemon.speciesId, level);
          if (evo) {
            const evolvedSpecies = getPokemon(evo.to);
            if (evolvedSpecies) {
              setTimeout(() => {
                get().triggerEvolution({
                  uid,
                  pokemonName: pokemon.name,
                  fromSpeciesId: pokemon.speciesId,
                  toSpeciesId: evo.to,
                });
              }, 300);
            }
          }
        }
      },

      evolvePokemon: (uid, toSpeciesId) => {
        const { team, reserves } = get();
        const species = getPokemon(toSpeciesId);
        if (!species) return;
        const mapEvolve = (p: TeamPokemon) => {
          if (p.uid !== uid) return p;
          const hpDiff = species.baseHp - (getPokemon(p.speciesId)?.baseHp || 0);
          // Add level-based HP bonus
          const pLevel = p.level ?? 1;
          const levelBonus = (pLevel - 1) * 3;
          return {
            ...p,
            speciesId: toSpeciesId,
            name: species.name,
            maxHp: species.baseHp + levelBonus,
            currentHp: Math.min(p.currentHp + Math.max(0, hpDiff), species.baseHp + levelBonus),
            moves: species.startingMoves
              .filter((id) => getMove(id))
              .map((id) => {
                const existing = p.moves.find((m) => m.moveId === id);
                return existing || { moveId: id, currentPP: 10, maxPP: 10 };
              }),
            learnableMoves: species.learnableMoves.filter(
              (id) => !species.startingMoves.includes(id)
            ),
          };
        };
        set({
          team: team.map(mapEvolve),
          reserves: reserves.map(mapEvolve),
        });
      },

      useStone: (uid, stoneId) => {
        const { team, reserves, bag } = get();
        const pokemon = team.find((p) => p.uid === uid) || reserves.find((p) => p.uid === uid);
        if (!pokemon) return false;
        const evo = canEvolveByStone(pokemon.speciesId, stoneId);
        if (!evo) return false;
        // Check if player has the stone
        const stoneItem = bag.find((b) => b.itemId === stoneId);
        if (!stoneItem || stoneItem.quantity <= 0) return false;
        // Consume the stone
        const newBag = bag.map((b) =>
          b.itemId === stoneId ? { ...b, quantity: b.quantity - 1 } : b
        ).filter((b) => b.quantity > 0);
        set({ bag: newBag });
        // Evolve
        get().evolvePokemon(uid, evo.to);
        return true;
      },

      evolveByTrade: (uid) => {
        const { team, reserves } = get();
        const pokemon = team.find((p) => p.uid === uid) || reserves.find((p) => p.uid === uid);
        if (!pokemon) return false;
        const evo = canEvolveByTrade(pokemon.speciesId);
        if (!evo) return false;
        get().evolvePokemon(uid, evo.to);
        return true;
      },

      useRareCandy: (uid) => {
        const { team, reserves, bag } = get();
        const pokemon = team.find((p) => p.uid === uid) || reserves.find((p) => p.uid === uid);
        if (!pokemon) return;
        const candy = bag.find((b) => b.itemId === "rare-candy");
        if (!candy || candy.quantity <= 0) return;
        // Consume candy
        const newBag = bag.map((b) =>
          b.itemId === "rare-candy" ? { ...b, quantity: b.quantity - 1 } : b
        ).filter((b) => b.quantity > 0);
        set({ bag: newBag });
        // Level up by 1
        const newLevel = (pokemon.level ?? 1) + 1;
        get().setLevel(uid, newLevel);
      },

      // Trainer RPG stats
      addTrainerXp: (amount) => {
        const { trainer } = get();
        const currentXp = trainer.xp ?? 0;
        const currentLevel = trainer.level ?? 1;
        let newXp = currentXp + amount;
        let newLevel = currentLevel;
        while (newXp >= trainerXpForLevel(newLevel + 1) && newLevel < 100) {
          newLevel++;
        }
        const levelsGained = newLevel - currentLevel;
        const attrs = trainer.attributes || DEFAULT_ATTRIBUTES;
        const newMaxHp = computeTrainerMaxHp(newLevel, attrs.combate);
        const hpGain = newMaxHp - (trainer.maxHp ?? 20);
        set({
          trainer: {
            ...trainer,
            xp: newXp,
            level: newLevel,
            maxHp: newMaxHp,
            currentHp: Math.min((trainer.currentHp ?? 20) + Math.max(0, hpGain), newMaxHp),
            defesa: computeTrainerDefesa(newLevel, attrs.combate, attrs.furtividade),
          },
        });
      },

      setTrainerLevel: (level) => {
        const { trainer } = get();
        const attrs = trainer.attributes || DEFAULT_ATTRIBUTES;
        const newMaxHp = computeTrainerMaxHp(level, attrs.combate);
        set({
          trainer: {
            ...trainer,
            level,
            xp: trainerXpForLevel(level),
            maxHp: newMaxHp,
            currentHp: Math.min(trainer.currentHp ?? 20, newMaxHp),
            defesa: computeTrainerDefesa(level, attrs.combate, attrs.furtividade),
          },
        });
      },

      damageTrainer: (amount) => {
        const { trainer } = get();
        set({
          trainer: {
            ...trainer,
            currentHp: Math.max(0, (trainer.currentHp ?? 20) - amount),
          },
        });
      },

      healTrainer: (amount) => {
        const { trainer } = get();
        const maxHp = trainer.maxHp ?? 20;
        set({
          trainer: {
            ...trainer,
            currentHp: Math.min(maxHp, (trainer.currentHp ?? 0) + amount),
          },
        });
      },

      recalcTrainerStats: () => {
        const { trainer } = get();
        const level = trainer.level ?? 1;
        const attrs = trainer.attributes || DEFAULT_ATTRIBUTES;
        const newMaxHp = computeTrainerMaxHp(level, attrs.combate);
        const newDefesa = computeTrainerDefesa(level, attrs.combate, attrs.furtividade);
        set({
          trainer: {
            ...trainer,
            maxHp: newMaxHp,
            currentHp: Math.min(trainer.currentHp ?? 20, newMaxHp),
            defesa: newDefesa,
          },
        });
      },

      // Exploration system
      addExplorationXp: (amount) => {
        const { trainer } = get();
        const currentXp = trainer.explorationXp ?? 0;
        const currentLevel = trainer.explorationLevel ?? 1;
        let newXp = currentXp + amount;
        let newLevel = currentLevel;
        const allRewards: ExplorationReward[] = [];

        while (newXp >= explorationXpForLevel(newLevel + 1) && newLevel < 100) {
          newLevel++;
          // Collect rewards for each level gained
          const levelRewards = getExplorationLevelRewards(newLevel);
          allRewards.push(...levelRewards);
          // Apply rewards immediately
          for (const reward of levelRewards) {
            if (reward.type === "money") {
              // Will be applied after set
            } else if (reward.type === "item" && reward.itemId) {
              get().addBagItem(reward.itemId, reward.quantity);
            }
          }
        }

        // Calculate total money from rewards
        const totalMoney = allRewards
          .filter((r) => r.type === "money")
          .reduce((sum, r) => sum + r.quantity, 0);

        set({
          trainer: {
            ...get().trainer,
            explorationXp: newXp,
            explorationLevel: newLevel,
            money: get().trainer.money + totalMoney,
          },
        });

        return allRewards;
      },

      // Battle system
      addBattleXp: (amount) => {
        const { trainer } = get();
        const currentXp = trainer.battleXp ?? 0;
        const currentLevel = trainer.battleLevel ?? 1;
        let newXp = currentXp + amount;
        let newLevel = currentLevel;
        let levelsGained = 0;

        while (newXp >= battleXpForLevel(newLevel + 1) && newLevel < 100) {
          newLevel++;
          levelsGained++;
        }

        set({
          trainer: {
            ...get().trainer,
            battleXp: newXp,
            battleLevel: newLevel,
          },
        });

        return { newLevel, levelsGained };
      },

      recordBattleResult: (won, xpGained) => {
        const { trainer } = get();
        const currentWins = trainer.battleWins ?? 0;
        const currentLosses = trainer.battleLosses ?? 0;

        set({
          trainer: {
            ...get().trainer,
            battleWins: won ? currentWins + 1 : currentWins,
            battleLosses: won ? currentLosses : currentLosses + 1,
          },
        });

        if (xpGained > 0) {
          get().addBattleXp(xpGained);
        }
      },

      // Daily streak system
      registerDailyCapture: () => {
        const { trainer } = get();
        const currentStreak = trainer.dailyStreak ?? 0;
        const lastCaptureDate = trainer.lastCaptureDate ?? null;
        const weekStartDate = trainer.weekStartDate ?? null;
        const legendaryUnlockedDays = trainer.legendaryUnlockedDays ?? [];

        const result = computeStreakUpdate(currentStreak, lastCaptureDate, weekStartDate, legendaryUnlockedDays);

        const newUnlockedDays = result.milestoneReached
          ? [...legendaryUnlockedDays, result.milestoneReached]
          : legendaryUnlockedDays;

        set({
          trainer: {
            ...get().trainer,
            dailyStreak: result.newStreak,
            lastCaptureDate: getTodayDateStr(),
            weekStartDate: getWeekStartDate(),
            legendaryUnlockedDays: newUnlockedDays,
          },
        });

        return result;
      },

      // Weekly events
      trackWeeklyCapture: (pokemonTypes, ballsUsed) => {
        const weekKey = getCurrentWeekKey();
        const event = getCurrentWeeklyEvent();
        const { trainer } = get();
        let progress = trainer.weeklyEventProgress;

        // Initialize or reset if different week/event
        if (!progress || progress.weekKey !== weekKey || progress.eventId !== event.id) {
          progress = {
            eventId: event.id,
            weekKey,
            missionProgress: {},
            completed: false,
            rewardClaimed: false,
          };
        }

        if (progress.completed) return;

        const newProgress = { ...progress.missionProgress };

        for (const mission of event.missions) {
          const current = newProgress[mission.id] ?? 0;
          if (current >= mission.target) continue;

          if (mission.type === "catch_type" && mission.pokemonType) {
            if (pokemonTypes.includes(mission.pokemonType)) {
              newProgress[mission.id] = current + 1;
            }
          } else if (mission.type === "catch_one_ball") {
            if (ballsUsed === 1) {
              newProgress[mission.id] = current + 1;
            } else {
              // Reset — must be consecutive single-ball catches
              newProgress[mission.id] = 0;
            }
          } else if (mission.type === "catch_total") {
            newProgress[mission.id] = current + 1;
          }
        }

        // Check if all missions complete
        const allDone = event.missions.every(
          (m) => (newProgress[m.id] ?? 0) >= m.target
        );

        set({
          trainer: {
            ...get().trainer,
            weeklyEventProgress: {
              ...progress,
              missionProgress: newProgress,
              completed: allDone,
            },
          },
        });
      },

      claimWeeklyEventReward: () => {
        const { trainer } = get();
        const progress = trainer.weeklyEventProgress;
        if (!progress || !progress.completed || progress.rewardClaimed) return false;

        const event = getCurrentWeeklyEvent();
        if (event.id !== progress.eventId) return false;

        // Grant money
        const newMoney = trainer.money + event.rewardMoney;

        // Grant items
        for (const item of event.rewardItems) {
          get().addBagItem(item.itemId, item.quantity);
        }

        // Grant Pokemon reward
        const rewardPokemon = getPokemon(event.rewardPokemonId);
        if (rewardPokemon) {
          get().addToTeamWithLevel(rewardPokemon, event.rewardPokemonLevel);
        }

        set({
          trainer: {
            ...get().trainer,
            money: newMoney,
            weeklyEventProgress: {
              ...progress,
              rewardClaimed: true,
            },
          },
        });

        return true;
      },

      // Pokemon attribute modifications
      applyFaintPenaltyToPokemon: (uid) => {
        const { team } = get();
        const pokemon = team.find((p) => p.uid === uid);
        if (!pokemon) return;
        const currentAttrs = pokemon.customAttributes || getBaseAttributes(pokemon.speciesId);
        const penalizedAttrs = applyFaintPenalty(currentAttrs);
        set({
          team: team.map((p) =>
            p.uid === uid ? { ...p, customAttributes: penalizedAttrs } : p
          ),
        });
      },

      applyLevelUpBonusToPokemon: (uid) => {
        const { team } = get();
        const pokemon = team.find((p) => p.uid === uid);
        if (!pokemon) return;
        const currentAttrs = pokemon.customAttributes || getBaseAttributes(pokemon.speciesId);
        const bonusAttrs = applyLevelUpBonus(currentAttrs);
        set({
          team: team.map((p) =>
            p.uid === uid ? { ...p, customAttributes: bonusAttrs } : p
          ),
        });
      },

      rollDamageOnPokemon: (uid, baseDamage) => {
        const { team } = get();
        const pokemon = team.find((p) => p.uid === uid);
        if (!pokemon) return null;
        const attrs = computeAttributes(pokemon.speciesId, pokemon.level, pokemon.customAttributes);
        const result = rollDamageAgainstPokemon(baseDamage, attrs.defesa);
        // Apply damage
        set({
          team: team.map((p) =>
            p.uid === uid
              ? { ...p, currentHp: Math.max(0, p.currentHp - result.finalDamage) }
              : p
          ),
        });
        // Check if fainted and apply penalty
        const updatedPokemon = get().team.find((p) => p.uid === uid);
        if (updatedPokemon && updatedPokemon.currentHp <= 0) {
          get().applyFaintPenaltyToPokemon(uid);
        }
        return result;
      },

      // Attribute tests
      selectAttributeTest: (attribute, dc) => {
        const { battle } = get();
        set({
          battle: {
            ...battle,
            phase: "attribute-test-rolling",
            selectedAttribute: attribute,
            attributeTestDC: dc,
            attributeTestResult: null,
          },
        });
      },

      resolveAttributeTest: (roll) => {
        const { battle, team } = get();
        const pokemon = team.find((p) => p.uid === battle.activePokemonUid);
        if (!pokemon || !battle.selectedAttribute) return;

        const attrs = computeAttributes(pokemon.speciesId, pokemon.level);

        const attrKey = battle.selectedAttribute;
        const modKey = `${attrKey}Mod` as keyof typeof attrs;
        const modifier = attrs[modKey] as number;

        const total = roll + modifier;
        const dc = battle.attributeTestDC;
        const criticalSuccess = roll === 20;
        const criticalFail = roll === 1;
        const success = criticalFail ? false : criticalSuccess ? true : total >= 10;

        const result: AttributeTestResult = {
          attribute: attrKey,
          roll,
          modifier,
          total,
          dc,
          success,
          criticalSuccess,
          criticalFail,
        };

        set({
          battle: {
            ...battle,
            phase: "attribute-test-result",
            attributeTestResult: result,
          },
        });
      },

      // NPC management
      addNpc: (name) => {
        const id = generateUid();
        set({ npcs: [...get().npcs, { id, name, team: [] }] });
        return id;
      },

      removeNpc: (id) => {
        set({ npcs: get().npcs.filter((n) => n.id !== id) });
      },

      updateNpcName: (id, name) => {
        set({
          npcs: get().npcs.map((n) => (n.id === id ? { ...n, name } : n)),
        });
      },

      addNpcPokemon: (npcId, speciesId, level) => {
        set({
          npcs: get().npcs.map((n) => {
            if (n.id !== npcId) return n;
            if (n.team.length >= 6) return n;
            return { ...n, team: [...n.team, { speciesId, level }] };
          }),
        });
      },

      removeNpcPokemon: (npcId, index) => {
        set({
          npcs: get().npcs.map((n) => {
            if (n.id !== npcId) return n;
            return { ...n, team: n.team.filter((_, i) => i !== index) };
          }),
        });
      },

      updateNpcPokemonLevel: (npcId, index, level) => {
        set({
          npcs: get().npcs.map((n) => {
            if (n.id !== npcId) return n;
            return {
              ...n,
              team: n.team.map((p, i) => (i === index ? { ...p, level } : p)),
            };
          }),
        });
      },

      triggerEvolution: (evolution) => {
        set({ pendingEvolution: evolution });
      },

      completeEvolution: () => {
        const { pendingEvolution } = get();
        if (!pendingEvolution) return;
        get().evolvePokemon(pendingEvolution.uid, pendingEvolution.toSpeciesId);
        set({ pendingEvolution: null });
      },

      // -- Card system (finite deck) --
      drawBattleCard: () => {
        const { battle, team } = get();

        // Check if deck is empty
        if (battle.deck.length === 0) {
          return null as unknown as BattleCard; // No cards left
        }

        // Draw from top of deck
        const newDeck = [...battle.deck];
        const card = newDeck.shift()!;
        const newField = [...battle.cardField];
        const newCount = battle.cardDrawCount + 1;
        const activeMon = team.find((p) => p.uid === battle.activePokemonUid);
        const activeSpecies = activeMon ? getPokemon(activeMon.speciesId) : null;
        const pokemonTypes = activeSpecies ? [activeSpecies.type1, activeSpecies.type2].filter(Boolean) as string[] : [];

        // Find first empty slot
        const emptyIndex = newField.findIndex((c) => c === null);

        if (emptyIndex !== -1) {
          // Place in empty slot
          newField[emptyIndex] = card;
        } else {
          // All slots full: must replace a luck card (UI will handle choosing which)
          // Set as lastDrawnCard for the replace modal
          set({
            battle: {
              ...battle,
              deck: newDeck,
              lastDrawnCard: card,
              cardDrawCount: newCount,
            },
          });
          return card;
        }

        // Recalc bad luck penalty
        const penalty = calculateBadLuckPenalty(newField, pokemonTypes);

        // Check for bad luck trio (3 bad luck -> punishment + clear field)
        if (checkBadLuckTrio(newField)) {
          const hasAffinity = checkElementalAffinity(
            pokemonTypes,
            newField.filter((c): c is BattleCard => c !== null && c.alignment === "bad-luck")
          );
          const effect = rollSuperPunishment();
          set({
            battle: {
              ...battle,
              deck: newDeck,

              cardField: newField,
              lastDrawnCard: card,
              cardDrawCount: newCount,
              badLuckPenalty: penalty,
              cardTrioEvent: { type: "bad-luck", effect, hasAffinity },
            },
          });
          return card;
        }

        // Check for luck trio (3 luck with same element or all different)
        const luckTrio = checkLuckTrio(newField);
        if (luckTrio) {
          const hasAffinity = checkElementalAffinity(pokemonTypes, luckTrio);
          const effect = rollSuperAdvantage();
          set({
            battle: {
              ...battle,
              deck: newDeck,

              cardField: newField,
              lastDrawnCard: card,
              cardDrawCount: newCount,
              badLuckPenalty: penalty,
              cardTrioEvent: { type: "luck", effect, hasAffinity },
            },
          });
          return card;
        }

        // No trio - just update field
        set({
          battle: {
            ...battle,
            deck: newDeck,
            cardField: newField,
            lastDrawnCard: card,
            cardDrawCount: newCount,
            badLuckPenalty: penalty,
            cardTrioEvent: null,
          },
        });
        return card;
      },

      replaceCardInSlot: (slotIndex, card) => {
        const { battle, team } = get();
        const existing = battle.cardField[slotIndex];
        // Cannot replace bad luck cards
        if (existing && existing.alignment === "bad-luck") return;

        const newField = [...battle.cardField];
        newField[slotIndex] = card;

        // Add replaced card to discard pile
        const newDiscard = existing
          ? [...battle.discardPile, existing]
          : battle.discardPile;

        const activeMon = team.find((p) => p.uid === battle.activePokemonUid);
        const activeSpecies = activeMon ? getPokemon(activeMon.speciesId) : null;
        const pokemonTypes = activeSpecies ? [activeSpecies.type1, activeSpecies.type2].filter(Boolean) as string[] : [];
        const penalty = calculateBadLuckPenalty(newField, pokemonTypes);

        // Check for bad luck trio
        if (checkBadLuckTrio(newField)) {
          const hasAffinity = checkElementalAffinity(
            pokemonTypes,
            newField.filter((c): c is BattleCard => c !== null && c.alignment === "bad-luck")
          );
          const effect = rollSuperPunishment();
          set({
            battle: {
              ...battle,
              cardField: newField,
              lastDrawnCard: null,
              badLuckPenalty: penalty,
              discardPile: newDiscard,
              cardTrioEvent: { type: "bad-luck", effect, hasAffinity },
            },
          });
          return;
        }

        // Check for luck trio
        const luckTrio = checkLuckTrio(newField);
        if (luckTrio) {
          const hasAffinity = checkElementalAffinity(pokemonTypes, luckTrio);
          const effect = rollSuperAdvantage();
          set({
            battle: {
              ...battle,
              cardField: newField,
              lastDrawnCard: null,
              badLuckPenalty: penalty,
              discardPile: newDiscard,
              cardTrioEvent: { type: "luck", effect, hasAffinity },
            },
          });
          return;
        }

        set({
          battle: {
            ...battle,
            cardField: newField,
            lastDrawnCard: null,
            badLuckPenalty: penalty,
            discardPile: newDiscard,
            cardTrioEvent: null,
          },
        });
      },

      clearCardField: () => {
        const { battle } = get();
        // Move all field cards to discard pile
        const discarded = battle.cardField.filter((c): c is BattleCard => c !== null);
        set({
          battle: {
            ...battle,
            cardField: [null, null, null, null, null, null],
            lastDrawnCard: null,
            cardTrioEvent: null,
            badLuckPenalty: 0,
            auraAmplificadaActive: false,
            discardPile: [...battle.discardPile, ...discarded],
          },
        });
      },

      recalcBadLuckPenalty: () => {
        const { battle, team } = get();
        const activeMon = team.find((p) => p.uid === battle.activePokemonUid);
        const activeSpecies = activeMon ? getPokemon(activeMon.speciesId) : null;
        const pokemonTypes = activeSpecies ? [activeSpecies.type1, activeSpecies.type2].filter(Boolean) as string[] : [];
        const penalty = calculateBadLuckPenalty(battle.cardField, pokemonTypes);
        set({ battle: { ...battle, badLuckPenalty: penalty } });
      },

      dismissTrioEvent: () => {
        const { battle, team } = get();
        const event = battle.cardTrioEvent;
        if (!event) return;

        if (event.type === "bad-luck") {
          const desc = event.hasAffinity ? event.effect.affinityDescription : event.effect.description;
          get().addBattleLog(`[CARTA] Super Punicao: ${event.effect.name} - ${desc}`);

          const activeMon = team.find((p) => p.uid === battle.activePokemonUid);
          let updatedTeam = team;

          if (activeMon) {
            const trioDamage = Math.round(activeMon.currentHp * 0.8);
            const newHp = Math.max(0, activeMon.currentHp - trioDamage);
            updatedTeam = team.map((p) =>
              p.uid === activeMon.uid ? { ...p, currentHp: newHp } : p
            );
            get().addBattleLog(`[CARTA] Super Punicao causa ${trioDamage} de dano em ${activeMon.name}!`);
          }

          const currentBattle = get().battle;
          const discardedCards = currentBattle.cardField.filter((c): c is BattleCard => c !== null);
          set({
            team: updatedTeam,
            battle: {
              ...currentBattle,
              cardField: [null, null, null, null, null, null],
              lastDrawnCard: null,
              cardTrioEvent: null,
              badLuckPenalty: 0,
              auraAmplificadaActive: false,
              discardPile: [...currentBattle.discardPile, ...discardedCards],
              pokemonAnimationState: {
                isAnimating: true,
                effectType: "damage",
                duration: 800,
              },
            },
          });

          setTimeout(() => {
            set((state) => ({
              battle: {
                ...state.battle,
                pokemonAnimationState: {
                  isAnimating: false,
                  effectType: "none",
                  duration: 0,
                },
              },
            }));
          }, 800);
        }
        // Luck trio is NOT dismissed here -- it is handled by trioChoice* actions
      },

      // ---- LUCK TRIO CHOICES ----

      // Choice 1: Trade 3 trio cards for a luck card of chosen element
      trioChoiceTradeForElement: (element: CardElement) => {
        const { battle, team } = get();
        if (!battle.cardTrioEvent || battle.cardTrioEvent.type !== "luck") return;

        // Find which element formed the trio
        const byElement: Record<string, number[]> = {};
        battle.cardField.forEach((c, i) => {
          if (c && c.alignment === "luck" && !c.trioUsed) {
            if (!byElement[c.element]) byElement[c.element] = [];
            byElement[c.element].push(i);
          }
        });

        const newField = [...battle.cardField];
        const discarded: BattleCard[] = [];
        let trioFound = false;
        for (const el of Object.keys(byElement)) {
          if (byElement[el].length >= 2 && !trioFound) {
            // Remove the 3 trio cards -> discard
            for (let k = 0; k < 2; k++) {
              const idx = byElement[el][k];
              discarded.push(newField[idx]!);
              newField[idx] = null;
            }
            trioFound = true;
          }
        }

        // Place the new card in the first empty slot
        const newCard = createLuckCardOfElement(element);
        const emptyIdx = newField.findIndex((c) => c === null);
        if (emptyIdx !== -1) {
          newField[emptyIdx] = newCard;
        }

        const activeMon = team.find((p) => p.uid === battle.activePokemonUid);
        const activeSpecies = activeMon ? getPokemon(activeMon.speciesId) : null;
        const pokemonTypes = activeSpecies ? [activeSpecies.type1, activeSpecies.type2].filter(Boolean) as string[] : [];
        const penalty = calculateBadLuckPenalty(newField, pokemonTypes);

        get().addBattleLog(`[DUO] Trocou 2 cartas por 1 carta de ${element}!`);

        set({
          battle: {
            ...get().battle,
            cardField: newField,
            cardTrioEvent: null,
            badLuckPenalty: penalty,
            discardPile: [...battle.discardPile, ...discarded],
          },
        });
      },

      // Choice 2: Remove a bad luck card from the field (also removes the 3 trio luck cards)
      trioChoiceRemoveBadLuck: (slotIndex: number) => {
        const { battle, team } = get();
        if (!battle.cardTrioEvent || battle.cardTrioEvent.type !== "luck") return;

        const card = battle.cardField[slotIndex];
        if (!card || card.alignment !== "bad-luck") return;

        // Find and remove the 3 trio luck cards from the field
        const newField: (BattleCard | null)[] = [...battle.cardField];
        const discarded: BattleCard[] = [];
        const byElement: Record<string, number[]> = {};
        newField.forEach((c, i) => {
          if (c && c.alignment === "luck" && !c.trioUsed) {
            if (!byElement[c.element]) byElement[c.element] = [];
            byElement[c.element].push(i);
          }
        });
        for (const el of Object.keys(byElement)) {
          if (byElement[el].length >= 2) {
            for (let k = 0; k < 2; k++) {
              const idx = byElement[el][k];
              discarded.push(newField[idx]!);
              newField[idx] = null;
            }
            break;
          }
        }

        // Remove the bad luck card
        const removedCard = newField[slotIndex]!;
        discarded.push(removedCard);
        newField[slotIndex] = null;

        const activeMon = team.find((p) => p.uid === battle.activePokemonUid);
        const activeSpecies = activeMon ? getPokemon(activeMon.speciesId) : null;
        const pokemonTypes = activeSpecies ? [activeSpecies.type1, activeSpecies.type2].filter(Boolean) as string[] : [];
        const penalty = calculateBadLuckPenalty(newField, pokemonTypes);

        get().addBattleLog(` Removeu carta de azar: ${removedCard.name}!`);

        set({
          battle: {
            ...get().battle,
            cardField: newField,
            cardTrioEvent: null,
            badLuckPenalty: penalty,
            discardPile: [...battle.discardPile, ...discarded],
          },
        });
      },

      // Choice 3: Do nothing
      trioChoiceDoNothing: () => {
        const { battle } = get();
        if (!battle.cardTrioEvent || battle.cardTrioEvent.type !== "luck") return;

        // Just mark the trio cards as used and clear the event
        const byElement: Record<string, number[]> = {};
        battle.cardField.forEach((c, i) => {
          if (c && c.alignment === "luck" && !c.trioUsed) {
            if (!byElement[c.element]) byElement[c.element] = [];
            byElement[c.element].push(i);
          }
        });
        const newField = [...battle.cardField];
        for (const el of Object.keys(byElement)) {
          if (byElement[el].length >= 2) {
            for (let k = 0; k < 2; k++) {
              const idx = byElement[el][k];
              newField[idx] = { ...newField[idx]!, trioUsed: true };
            }
            break;
          }
        }

        get().addBattleLog(" Nao fez nada com o trio de sorte.");

        set({
          battle: {
            ...get().battle,
            cardField: newField,
            cardTrioEvent: null,
          },
        });
      },

      activateCardEffect: (slotIndex: number) => {
        const { battle, team } = get();
        if (!battle || !battle.cardField) return undefined;
        const card = battle.cardField[slotIndex];
        if (!card) return undefined;

        const activeMon = team.find((p) => p.uid === battle.activePokemonUid);
        if (!activeMon) return undefined;

        const activeSpecies = getPokemon(activeMon.speciesId);
        const pokemonTypes = [activeSpecies.type1, activeSpecies.type2].filter(Boolean) as string[];

        let isCrit = false;

        // Handle AURA card activation - don't remove the card, just set activated = true
        if (card.alignment === "aura-elemental" || card.alignment === "aura-amplificada") {
          if (card.activated) return undefined; // Already activated
          const newField = [...battle.cardField];
          newField[slotIndex] = { ...card, activated: true };

          const logMsg = card.alignment === "aura-amplificada"
            ? `[AURA] Aura Primordial ativada! Proximo golpe tera D20 garantido de 20!`
            : `[AURA] Aura Elemental ativada! Funciona como energia coringa!`;
          get().addBattleLog(logMsg);

          const currentBattle = get().battle;
          set({
            battle: {
              ...currentBattle,
              cardField: newField,
              pokemonAnimationState: {
                isAnimating: true,
                effectType: "buff",
                duration: 800,
              },
            },
          });

          setTimeout(() => {
            set((state) => ({
              battle: {
                ...state.battle,
                pokemonAnimationState: {
                  isAnimating: false,
                  effectType: "none",
                  duration: 0,
                },
              },
            }));
          }, 800);

          return { isCrit: false, alignment: card.alignment };
        }

        // Heal and Resurrect are handled by dedicated functions (activateHealCard / activateResurrectCard)
        // They should not be activated via the generic activateCardEffect
        if (card.alignment === "heal" || card.alignment === "resurrect") {
          return undefined;
        }

        // Apply damage if bad-luck card
        if (card.alignment === "bad-luck") {
          const isSameType = pokemonTypes.some((t) => t.toLowerCase() === card.element.toLowerCase());
          isCrit = isSameType;

          const damage = Math.round(activeMon.currentHp * 0.3);

          const damageHit = isSameType ? damage * 2 : damage;

          const newHp = Math.max(0, activeMon.currentHp - damageHit);
          const updatedTeam = team.map((p) =>
            p.uid === activeMon.uid ? { ...p, currentHp: newHp } : p
          );

          const log = isSameType
            ? `[CARTA] ${card.name} (${card.element}) acerta critico no tipo ${activeSpecies.type1}! ${damage} de dano!`
            : `[CARTA] ${card.name} (${card.element}) causa ${damage} de dano!`;
          get().addBattleLog(log);

          set({ team: updatedTeam });
        }

        // Clear the slot after activation and add card to discard pile
        const newField = [...battle.cardField];
        newField[slotIndex] = null;

        // Recalculate penalty after removing card
        const penalty = calculateBadLuckPenalty(newField, pokemonTypes);

        // Determine animation type
        const animationType = card.alignment === "bad-luck" ? "damage" : "heal";

        // Re-read current battle state (may have changed via addBattleLog/set above)
        const currentBattle = get().battle;
        set({
          battle: {
            ...currentBattle,
            cardField: newField,
            badLuckPenalty: penalty,
            discardPile: [...currentBattle.discardPile, card],
            pokemonAnimationState: {
              isAnimating: true,
              effectType: animationType,
              duration: animationType === "damage" ? 500 : 600,
            },
          },
        });

        // Reset animation state after duration
        setTimeout(() => {
          set((state) => ({
            battle: {
              ...state.battle,
              pokemonAnimationState: {
                isAnimating: false,
                effectType: "none",
                duration: 0,
              },
            },
          }));
        }, animationType === "damage" ? 500 : 600);

        return { isCrit, alignment: card.alignment };
      },

      // ---- HEAL CARD: target a specific Pokemon by uid ----
      activateHealCard: (slotIndex: number, targetUid: string): boolean => {
        const { battle, team } = get();
        const card = battle.cardField[slotIndex];
        if (!card || (card.alignment !== "heal" && card.alignment !== "resurrect")) return false;

        const targetMon = team.find((p) => p.uid === targetUid);
        if (!targetMon || targetMon.currentHp <= 0) return false; // Can't heal fainted

        const targetSpecies = getPokemon(targetMon.speciesId);
        const maxHp = targetMon.maxHp;
        const healAmount = Math.round(maxHp * 0.20); // Always 20%
        const newHp = Math.min(maxHp, targetMon.currentHp + healAmount);
        const actualHeal = newHp - targetMon.currentHp;

        const updatedTeam = team.map((p) =>
          p.uid === targetUid ? { ...p, currentHp: newHp } : p
        );

        get().addBattleLog(`[CURA] ${card.name} cura ${actualHeal} HP de ${targetSpecies.name}!`);
        set({ team: updatedTeam });

        // Remove card from field -> discard pile
        const activeMon2 = team.find((p) => p.uid === battle.activePokemonUid);
        const activeSpecies2 = activeMon2 ? getPokemon(activeMon2.speciesId) : null;
        const pokemonTypes = activeSpecies2 ? [activeSpecies2.type1, activeSpecies2.type2].filter(Boolean) as string[] : [];
        const currentBattle = get().battle;
        const consumedCard = currentBattle.cardField[slotIndex];
        const newField = [...currentBattle.cardField];
        newField[slotIndex] = null;
        const penalty = calculateBadLuckPenalty(newField, pokemonTypes);

        set({
          battle: {
            ...currentBattle,
            cardField: newField,
            badLuckPenalty: penalty,
            discardPile: consumedCard ? [...currentBattle.discardPile, consumedCard] : currentBattle.discardPile,
            pokemonAnimationState: {
              isAnimating: true,
              effectType: "heal",
              duration: 1200,
            },
          },
        });

        setTimeout(() => {
          set((state) => ({
            battle: {
              ...state.battle,
              pokemonAnimationState: {
                isAnimating: false,
                effectType: "none",
                duration: 0,
              },
            },
          }));
        }, 1200);

        return true;
      },

      // ---- RESURRECT CARD: target a fainted Pokemon by uid ----
      activateResurrectCard: (slotIndex: number, targetUid: string): boolean => {
        const { battle, team } = get();
        const card = battle.cardField[slotIndex];
        if (!card || card.alignment !== "resurrect") return false;

        const targetMon = team.find((p) => p.uid === targetUid);
        if (!targetMon || targetMon.currentHp > 0) return false; // Must be fainted

        const targetSpecies = getPokemon(targetMon.speciesId);
        const maxHp = targetMon.maxHp;
        const reviveHp = Math.round(maxHp * 0.25); // 25% HP

        const updatedTeam = team.map((p) =>
          p.uid === targetUid ? { ...p, currentHp: reviveHp } : p
        );

        get().addBattleLog(`[RESSURREICAO] ${targetSpecies.name} foi ressuscitado com ${reviveHp} HP!`);
        set({ team: updatedTeam });

        // Remove card from field -> discard pile
        const activeMon2 = team.find((p) => p.uid === battle.activePokemonUid);
        const activeSpecies2 = activeMon2 ? getPokemon(activeMon2.speciesId) : null;
        const pokemonTypes = activeSpecies2 ? [activeSpecies2.type1, activeSpecies2.type2].filter(Boolean) as string[] : [];
        const currentBattle = get().battle;
        const consumedCard = currentBattle.cardField[slotIndex];
        const newField = [...currentBattle.cardField];
        newField[slotIndex] = null;
        const penalty = calculateBadLuckPenalty(newField, pokemonTypes);

        set({
          battle: {
            ...currentBattle,
            cardField: newField,
            badLuckPenalty: penalty,
            discardPile: consumedCard ? [...currentBattle.discardPile, consumedCard] : currentBattle.discardPile,
            pokemonAnimationState: {
              isAnimating: true,
              effectType: "buff",
              duration: 1200,
            },
          },
        });

        setTimeout(() => {
          set((state) => ({
            battle: {
              ...state.battle,
              pokemonAnimationState: {
                isAnimating: false,
                effectType: "none",
                duration: 0,
              },
            },
          }));
        }, 1200);

        return true;
      },

      // ---- SHUFFLE DECK: shuffle remaining cards in the deck ----
      shuffleDeckAction: () => {
        const { battle } = get();
        const shuffled = shuffleDeck(battle.deck);
        set({
          battle: {
            ...battle,
            deck: shuffled,
          },
        });
        get().addBattleLog("[BARALHO] Cartas embaralhadas!");
      },

      // ---- REPLENISH DECK: return discard pile back into the deck and shuffle ----
      replenishDeck: () => {
        const { battle } = get();
        if (battle.discardPile.length === 0) {
          get().addBattleLog("[BARALHO] Nenhuma carta usada para repor!");
          return;
        }
        // Re-generate IDs for replenished cards to avoid duplicates
        const replenished = battle.discardPile.map((c) => ({
          ...c,
          id: `card-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          activated: undefined,
          trioUsed: undefined,
        }));
        const newDeck = shuffleDeck([...battle.deck, ...replenished]);
        get().addBattleLog(`[BARALHO] ${replenished.length} cartas repostas e embaralhadas!`);
        set({
          battle: {
            ...battle,
            deck: newDeck,
            discardPile: [],
          },
        });
      },

      // ---- PA SYSTEM ----
      spendPA: (action: PAActionType): boolean => {
        const { battle } = get();
        const cost = PA_CONFIG.costs[action];
        if (battle.pa < cost) return false;
        const actionLabels: Record<PAActionType, string> = {
          attack: "Atacar",
          item: "Usar Item",
          switchPokemon: "Trocar Pokemon",
          attributeTest: "Teste de Atributo",
          drawCard: "Comprar Carta",
          moveSquares: "Mover Casas",
        };
        set({
          battle: {
            ...battle,
            pa: battle.pa - cost,
            paLog: [...battle.paLog, `${actionLabels[action]} (-${cost} PA)`],
          },
        });
        return true;
      },

      endTurn: () => {
        const { battle } = get();
        const newTurn = battle.turnNumber + 1;
        get().addBattleLog(`--- Fim do Turno ${battle.turnNumber} | Inicio do Turno ${newTurn} ---`);
        set({
          battle: {
            ...battle,
            pa: PA_CONFIG.startingPA,
            turnNumber: newTurn,
            paLog: [],
            phase: "menu",
            pendingAutoDraw: true,
          },
        });
      },

      clearPendingAutoDraw: () => {
        const { battle } = get();
        set({ battle: { ...battle, pendingAutoDraw: false } });
      },

      moveBoardSquares: (): boolean => {
        const { battle } = get();
        const cost = PA_CONFIG.costs.moveSquares;
        if (battle.pa < cost) return false;
        const newPos = battle.boardPosition + 1;
        get().addBattleLog(`[TABULEIRO] Moveu para casa ${newPos}`);
        set({
          battle: {
            ...battle,
            pa: battle.pa - cost,
            boardPosition: newPos,
            paLog: [...battle.paLog, `Mover Casas (-${cost} PA)`],
          },
        });
        return true;
      },

    }),
    {
      name: getGameStoreKey(),
      version: 13,
      migrate: (persistedState: unknown, version: number) => {
        const state = persistedState as Record<string, unknown>;
        if (version < 2) {
          const team = (state.team as TeamPokemon[]) || [];
          state.team = team.map((p) => ({
            ...p,
            level: p.level ?? 1,
            xp: p.xp ?? 0,
          }));
        }
        if (version < 3) {
          state.npcs = state.npcs ?? [];
        }
        if (version < 4) {
          const trainer = (state.trainer as Record<string, unknown>) || {};
          trainer.johtoBadges = trainer.johtoBadges ?? JOHTO_BADGES.map((b) => ({ ...b }));
          trainer.attributes = trainer.attributes ?? { ...DEFAULT_ATTRIBUTES };
          state.trainer = trainer;
        }
        if (version < 5) {
          const battle = (state.battle as Record<string, unknown>) || {};
          battle.selectedAttribute = battle.selectedAttribute ?? null;
          battle.attributeTestDC = battle.attributeTestDC ?? 10;
          battle.attributeTestResult = battle.attributeTestResult ?? null;
          state.battle = battle;
        }
        if (version < 6) {
          const trainer = (state.trainer as Record<string, unknown>) || {};
          trainer.level = trainer.level ?? 1;
          trainer.xp = trainer.xp ?? 0;
          trainer.maxHp = trainer.maxHp ?? 20;
          trainer.currentHp = trainer.currentHp ?? 20;
          trainer.defesa = trainer.defesa ?? 10;
          state.trainer = trainer;
        }
        if (version < 7) {
          state.pendingEvolution = null;
          const battle = (state.battle as Record<string, unknown>) || {};
          battle.damageBreakdown = battle.damageBreakdown ?? null;
          state.battle = battle;
        }
        if (version < 8) {
          const battle = (state.battle as Record<string, unknown>) || {};
          battle.cardField = battle.cardField ?? [null, null, null, null, null, null];
          battle.lastDrawnCard = battle.lastDrawnCard ?? null;
          battle.cardTrioEvent = battle.cardTrioEvent ?? null;
          battle.cardDrawCount = battle.cardDrawCount ?? 0;
          state.battle = battle;
        }
        if (version < 9) {
          const battle = (state.battle as Record<string, unknown>) || {};
          battle.badLuckPenalty = battle.badLuckPenalty ?? 0;
          state.battle = battle;
        }
        if (version < 10) {
          const battle = (state.battle as Record<string, unknown>) || {};
          battle.pokemonAnimationState = battle.pokemonAnimationState ?? {
            isAnimating: false,
            effectType: "none",
            duration: 0,
          };
          state.battle = battle;
        }
        if (version < 11) {
          const battle = (state.battle as Record<string, unknown>) || {};
          battle.auraAmplificadaActive = battle.auraAmplificadaActive ?? false;
          // Extend card field from 5 to 6 slots if needed
          const field = battle.cardField as (unknown | null)[];
          if (field && field.length < 6) {
            while (field.length < 6) field.push(null);
            battle.cardField = field;
          }
          state.battle = battle;
        }
        if (version < 12) {
          const battle = (state.battle as Record<string, unknown>) || {};
          battle.pa = battle.pa ?? PA_CONFIG.startingPA;
          battle.maxPa = battle.maxPa ?? PA_CONFIG.maxPA;
          battle.turnNumber = battle.turnNumber ?? 1;
          battle.paLog = battle.paLog ?? [];
          battle.boardPosition = battle.boardPosition ?? 0;
          battle.pendingAutoDraw = battle.pendingAutoDraw ?? false;
          state.battle = battle;
        }
        return state as unknown as GameState;
      },
    }
  )
);

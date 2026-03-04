export type PokemonType =
  | "normal" | "fire" | "water" | "grass" | "electric" | "ice"
  | "fighting" | "poison" | "ground" | "flying" | "psychic"
  | "bug" | "rock" | "ghost" | "dragon" | "dark" | "steel" | "fairy";

export const TYPE_COLORS: Record<PokemonType, string> = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  grass: "#78C850",
  electric: "#F8D030",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#cd8298",
};

// ========== Type Effectiveness Chart ==========
// Multiplicadores: 2.0 = super efetivo (2x dano), 0.5 = pouco efetivo (0.5x dano), 0 = imune
// Baseado na tabela oficial de Pokemon
export const TYPE_EFFECTIVENESS: Record<PokemonType, Partial<Record<PokemonType, number>>> = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  electric: { water: 2, grass: 0.5, electric: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2 },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying: { grass: 2, electric: 0.5, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5 },
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5 },
  fairy: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5 },
};

/**
 * Calcula o multiplicador de efetividade de tipo para um ataque.
 * @param attackType - Tipo do golpe
 * @param defenderTypes - Tipos do Pokemon defensor
 * @returns Multiplicador (0, 0.25, 0.5, 1, 2, ou 4)
 */
export function getTypeEffectiveness(attackType: PokemonType, defenderTypes: PokemonType[]): number {
  let multiplier = 1;
  for (const defType of defenderTypes) {
    const effectiveness = TYPE_EFFECTIVENESS[attackType]?.[defType];
    if (effectiveness !== undefined) {
      multiplier *= effectiveness;
    }
  }
  return multiplier;
}

/**
 * Retorna o label de efetividade para exibir na UI
 */
export function getTypeEffectivenessLabel(multiplier: number): string | null {
  if (multiplier === 0) return "Imune!";
  if (multiplier === 0.25) return "Muito Pouco Efetivo";
  if (multiplier === 0.5) return "Pouco Efetivo";
  if (multiplier === 2) return "Super Efetivo!";
  if (multiplier === 4) return "Extremamente Efetivo!";
  return null; // 1x = normal, não precisa label
}

/**
 * Calcula o bônus de felicidade para rolagens de dados.
 * Pokemon com felicidade alta têm mais sorte nos dados.
 * @param felicidade - Atributo de felicidade do Pokemon (1-10)
 * @returns Bônus para adicionar ao D20 roll
 */
export function getHappinessBonus(felicidade: number): number {
  // Felicidade 1-3: +0
  // Felicidade 4-5: +1
  // Felicidade 6-7: +2
  // Felicidade 8-9: +3
  // Felicidade 10: +4
  if (felicidade <= 3) return 0;
  if (felicidade <= 5) return 1;
  if (felicidade <= 7) return 2;
  if (felicidade <= 9) return 3;
  return 4;
}

export type MoveRange = "melee" | "short" | "medium" | "long" | "area";

export const MOVE_RANGE_INFO: Record<MoveRange, { label: string; labelPt: string; tiles: number; description: string }> = {
  melee: { label: "Melee", labelPt: "Corpo-a-corpo", tiles: 1, description: "1 casa adjacente" },
  short: { label: "Short", labelPt: "Curto Alcance", tiles: 3, description: "Ate 3 casas" },
  medium: { label: "Medium", labelPt: "Medio Alcance", tiles: 5, description: "Ate 5 casas" },
  long: { label: "Long", labelPt: "Longo Alcance", tiles: 6, description: "Ate 6 casas" },
  area: { label: "Area", labelPt: "Area", tiles: 6, description: "6 casas em 4 colunas" },
};

export type PowerCategory = "weak" | "medium" | "strong" | "very_strong" | "ultimate";
export type ScalingAttribute = "attack" | "sp_attack" | null;
export type DamageType = "physical" | "special" | "status";

export const POWER_CATEGORY_LABEL: Record<PowerCategory, string> = {
  weak: "Fraco",
  medium: "Medio",
  strong: "Forte",
  very_strong: "Muito Forte",
  ultimate: "Devastador",
};

/** Derive dice damage fields from the existing power field */
export function deriveDiceFromPower(power: number): { damage_dice: string | null; power_category: PowerCategory; damage_type: DamageType } {
  if (power === 0) return { damage_dice: null, power_category: "weak", damage_type: "status" };
  if (power <= 40) return { damage_dice: "1d6", power_category: "weak", damage_type: "physical" };
  if (power <= 60) return { damage_dice: "1d8", power_category: "medium", damage_type: "physical" };
  if (power <= 80) return { damage_dice: "1d10", power_category: "medium", damage_type: "physical" };
  if (power <= 100) return { damage_dice: "2d8", power_category: "strong", damage_type: "physical" };
  if (power <= 120) return { damage_dice: "2d10", power_category: "strong", damage_type: "physical" };
  if (power <= 150) return { damage_dice: "2d12", power_category: "very_strong", damage_type: "physical" };
  return { damage_dice: "3d12", power_category: "ultimate", damage_type: "physical" };
}

/** Physical move types (melee/contact-based) - all others are special */
const PHYSICAL_TYPES: Set<PokemonType> = new Set([
  "normal", "fighting", "ground", "rock", "bug", "steel",
]);

/** Determine if a move is physical, special, or status based on type and range */
export function classifyMove(move: { type: PokemonType; power: number; range: MoveRange }): { damage_type: DamageType; scaling_attribute: ScalingAttribute; uses_contact: boolean } {
  if (move.power === 0) return { damage_type: "status", scaling_attribute: null, uses_contact: false };
  const isPhysical = PHYSICAL_TYPES.has(move.type) || move.range === "melee";
  return {
    damage_type: isPhysical ? "physical" : "special",
    scaling_attribute: isPhysical ? "attack" : "sp_attack",
    uses_contact: move.range === "melee",
  };
}

export interface Move {
  id: string;
  name: string;
  type: PokemonType;
  power: number;
  accuracy: number; // D20 threshold: need to roll this or higher to hit
  description: string;
  range: MoveRange;
  learnLevel: number; // Nivel minimo para aprender
  // Dice damage system (auto-derived from power, kept for display)
  damage_dice: string | null;
  power_category: PowerCategory;
  damage_type: DamageType;
  scaling_attribute: ScalingAttribute;
  uses_contact: boolean;
  // Energy cost: number of element cards needed on field to use this move
  energy_cost: number;
  energy_type: PokemonType; // The element type of cards needed (same as move type)
}

/** Parse dice string like "2d8" into { count, sides } */
export function parseDice(dice: string): { count: number; sides: number } {
  const match = dice.match(/^(\d+)d(\d+)$/);
  if (!match) return { count: 1, sides: 6 };
  return { count: parseInt(match[1]), sides: parseInt(match[2]) };
}

/** Roll a dice string like "2d8" and return individual rolls + sum */
export function rollDiceString(dice: string): { rolls: number[]; sum: number } {
  const { count, sides } = parseDice(dice);
  const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
  return { rolls, sum: rolls.reduce((a, b) => a + b, 0) };
}

export interface PokemonSpecies {
  id: number;
  name: string;
  types: PokemonType[];
  baseHp: number;
  startingMoves: string[];
  learnableMoves: string[];
}

/** Calculate energy cost based on move type and power */
function deriveEnergyCost(type: PokemonType, power: number): number {
  // Normal-type moves are always free (player always has usable moves)
  if (type === "normal") return 0;
  // Status moves (power 0) are always free
  if (power === 0) return 0;
  // Elemental moves cost cards based on power tier
  if (power <= 60) return 1;
  if (power <= 100) return 2;
  if (power <= 150) return 3;
  return 4; // 150+ (Fissure etc)
}

/** Auto-enrich a raw move definition with dice damage fields */
function m(raw: Omit<Move, "damage_dice" | "power_category" | "damage_type" | "scaling_attribute" | "uses_contact" | "energy_cost" | "energy_type">): Move {
  const dice = deriveDiceFromPower(raw.power);
  const classification = classifyMove(raw);
  return {
    ...raw,
    damage_dice: dice.damage_dice,
    power_category: raw.power === 0 ? "weak" : dice.power_category,
    damage_type: classification.damage_type,
    scaling_attribute: classification.scaling_attribute,
    uses_contact: classification.uses_contact,
    energy_cost: deriveEnergyCost(raw.type, raw.power),
    energy_type: raw.type,
  };
}

export const MOVES: Move[] = [

  m({ id: "pound", name: "Pound", type: "normal", power: 40, accuracy: 14, description: "", range: "melee", learnLevel: 8 }),
  m({ id: "karate-chop", name: "Karate Chop", type: "fighting", power: 50, accuracy: 14, description: "", range: "short", learnLevel: 19 }),
  m({ id: "double-slap", name: "Double Slap", type: "normal", power: 15, accuracy: 12, description: "", range: "melee", learnLevel: 7 }),
  m({ id: "comet-punch", name: "Comet Punch", type: "normal", power: 18, accuracy: 12, description: "", range: "melee", learnLevel: 5 }),
  m({ id: "mega-punch", name: "Mega Punch", type: "normal", power: 80, accuracy: 12, description: "", range: "short", learnLevel: 23 }),
  m({ id: "pay-day", name: "Pay Day", type: "normal", power: 40, accuracy: 14, description: "", range: "melee", learnLevel: 1 }),
  m({ id: "fire-punch", name: "Fire Punch", type: "fire", power: 75, accuracy: 14, description: "", range: "short", learnLevel: 20 }),
  m({ id: "ice-punch", name: "Ice Punch", type: "ice", power: 75, accuracy: 14, description: "", range: "short", learnLevel: 25 }),
  m({ id: "thunder-punch", name: "Thunder Punch", type: "electric", power: 75, accuracy: 14, description: "", range: "short", learnLevel: 17 }),
  m({ id: "scratch", name: "Scratch", type: "normal", power: 40, accuracy: 14, description: "", range: "melee", learnLevel: 2 }),
  m({ id: "vice-grip", name: "Vice Grip", type: "normal", power: 55, accuracy: 14, description: "", range: "short", learnLevel: 18 }),
  m({ id: "razor-wind", name: "Razor Wind", type: "normal", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 22 }),
  m({ id: "cut", name: "Cut", type: "normal", power: 50, accuracy: 13, description: "", range: "short", learnLevel: 24 }),
  m({ id: "gust", name: "Gust", type: "flying", power: 40, accuracy: 14, description: "", range: "melee", learnLevel: 1 }),
  m({ id: "wing-attack", name: "Wing Attack", type: "flying", power: 60, accuracy: 14, description: "", range: "short", learnLevel: 12 }),
  m({ id: "fly", name: "Fly", type: "flying", power: 90, accuracy: 13, description: "", range: "long", learnLevel: 34 }),
  m({ id: "bind", name: "Bind", type: "normal", power: 15, accuracy: 12, description: "", range: "melee", learnLevel: 10 }),
  m({ id: "slam", name: "Slam", type: "normal", power: 80, accuracy: 10, description: "", range: "short", learnLevel: 15 }),
  m({ id: "vine-whip", name: "Vine Whip", type: "grass", power: 45, accuracy: 14, description: "", range: "short", learnLevel: 21 }),
  m({ id: "stomp", name: "Stomp", type: "normal", power: 65, accuracy: 14, description: "", range: "short", learnLevel: 16 }),
  m({ id: "double-kick", name: "Double Kick", type: "fighting", power: 30, accuracy: 14, description: "", range: "melee", learnLevel: 4 }),
  m({ id: "mega-kick", name: "Mega Kick", type: "normal", power: 120, accuracy: 10, description: "", range: "long", learnLevel: 34 }),
  m({ id: "jump-kick", name: "Jump Kick", type: "fighting", power: 100, accuracy: 13, description: "", range: "long", learnLevel: 37 }),
  m({ id: "rolling-kick", name: "Rolling Kick", type: "fighting", power: 60, accuracy: 12, description: "", range: "short", learnLevel: 16 }),
  m({ id: "headbutt", name: "Headbutt", type: "normal", power: 70, accuracy: 14, description: "", range: "short", learnLevel: 11 }),
  m({ id: "horn-attack", name: "Horn Attack", type: "normal", power: 65, accuracy: 14, description: "", range: "short", learnLevel: 19 }),
  m({ id: "fury-attack", name: "Fury Attack", type: "normal", power: 15, accuracy: 12, description: "", range: "melee", learnLevel: 4 }),
  m({ id: "tackle", name: "Tackle", type: "normal", power: 40, accuracy: 14, description: "", range: "melee", learnLevel: 1 }),
  m({ id: "body-slam", name: "Body Slam", type: "normal", power: 85, accuracy: 14, description: "", range: "long", learnLevel: 48 }),
  m({ id: "wrap", name: "Wrap", type: "normal", power: 15, accuracy: 13, description: "", range: "melee", learnLevel: 10 }),
  m({ id: "take-down", name: "Take Down", type: "normal", power: 90, accuracy: 12, description: "", range: "long", learnLevel: 39 }),
  m({ id: "thrash", name: "Thrash", type: "normal", power: 120, accuracy: 14, description: "", range: "long", learnLevel: 33 }),
  m({ id: "double-edge", name: "Double Edge", type: "normal", power: 120, accuracy: 14, description: "", range: "long", learnLevel: 35 }),
  m({ id: "poison-sting", name: "Poison Sting", type: "poison", power: 15, accuracy: 14, description: "", range: "melee", learnLevel: 8 }),
  m({ id: "twineedle", name: "Twineedle", type: "bug", power: 25, accuracy: 14, description: "", range: "melee", learnLevel: 9 }),
  m({ id: "pin-missile", name: "Pin Missile", type: "bug", power: 25, accuracy: 13, description: "", range: "melee", learnLevel: 6 }),
  m({ id: "bite", name: "Bite", type: "dark", power: 60, accuracy: 14, description: "", range: "short", learnLevel: 20 }),
  m({ id: "acid", name: "Acid", type: "poison", power: 40, accuracy: 14, description: "", range: "melee", learnLevel: 7 }),
  m({ id: "ember", name: "Ember", type: "fire", power: 40, accuracy: 14, description: "", range: "melee", learnLevel: 5 }),
  m({ id: "flamethrower", name: "Flamethrower", type: "fire", power: 90, accuracy: 14, description: "", range: "long", learnLevel: 37 }),
  m({ id: "water-gun", name: "Water Gun", type: "water", power: 40, accuracy: 14, description: "", range: "melee", learnLevel: 6 }),
  m({ id: "hydro-pump", name: "Hydro Pump", type: "water", power: 110, accuracy: 11, description: "", range: "long", learnLevel: 46 }),
  m({ id: "surf", name: "Surf", type: "water", power: 90, accuracy: 14, description: "", range: "long", learnLevel: 42 }),
  m({ id: "ice-beam", name: "Ice Beam", type: "ice", power: 90, accuracy: 14, description: "", range: "long", learnLevel: 48 }),
  m({ id: "blizzard", name: "Blizzard", type: "ice", power: 110, accuracy: 10, description: "", range: "long", learnLevel: 34 }),
  m({ id: "psybeam", name: "Psybeam", type: "psychic", power: 65, accuracy: 14, description: "", range: "short", learnLevel: 10 }),
  m({ id: "bubble-beam", name: "Bubble Beam", type: "water", power: 65, accuracy: 14, description: "", range: "short", learnLevel: 15 }),
  m({ id: "aurora-beam", name: "Aurora Beam", type: "ice", power: 65, accuracy: 14, description: "", range: "short", learnLevel: 18 }),
  m({ id: "hyper-beam", name: "Hyper Beam", type: "normal", power: 150, accuracy: 13, description: "", range: "long", learnLevel: 32 }),
  m({ id: "peck", name: "Peck", type: "flying", power: 35, accuracy: 14, description: "", range: "melee", learnLevel: 10 }),
  m({ id: "drill-peck", name: "Drill Peck", type: "flying", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 24 }),
  m({ id: "submission", name: "Submission", type: "fighting", power: 80, accuracy: 11, description: "", range: "short", learnLevel: 25 }),
  m({ id: "strength", name: "Strength", type: "normal", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 17 }),
  m({ id: "absorb", name: "Absorb", type: "grass", power: 20, accuracy: 14, description: "", range: "melee", learnLevel: 9 }),
  m({ id: "mega-drain", name: "Mega Drain", type: "grass", power: 40, accuracy: 14, description: "", range: "melee", learnLevel: 3 }),
  m({ id: "razor-leaf", name: "Razor Leaf", type: "grass", power: 55, accuracy: 13, description: "", range: "short", learnLevel: 24 }),
  m({ id: "solar-beam", name: "Solar Beam", type: "grass", power: 120, accuracy: 14, description: "", range: "long", learnLevel: 48 }),
  m({ id: "petal-dance", name: "Petal Dance", type: "grass", power: 120, accuracy: 14, description: "", range: "long", learnLevel: 47 }),
  m({ id: "fire-spin", name: "Fire Spin", type: "fire", power: 35, accuracy: 12, description: "", range: "melee", learnLevel: 7 }),
  m({ id: "thunder-shock", name: "Thunder Shock", type: "electric", power: 40, accuracy: 14, description: "", range: "melee", learnLevel: 9 }),
  m({ id: "thunderbolt", name: "Thunderbolt", type: "electric", power: 90, accuracy: 14, description: "", range: "long", learnLevel: 32 }),
  m({ id: "thunder", name: "Thunder", type: "electric", power: 110, accuracy: 10, description: "", range: "long", learnLevel: 47 }),
  m({ id: "rock-throw", name: "Rock Throw", type: "rock", power: 50, accuracy: 13, description: "", range: "short", learnLevel: 22 }),
  m({ id: "earthquake", name: "Earthquake", type: "ground", power: 100, accuracy: 14, description: "", range: "long", learnLevel: 36 }),
  m({ id: "dig", name: "Dig", type: "ground", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 13 }),
  m({ id: "confusion", name: "Confusion", type: "psychic", power: 50, accuracy: 14, description: "", range: "short", learnLevel: 14 }),
  m({ id: "psychic", name: "Psychic", type: "psychic", power: 90, accuracy: 14, description: "", range: "long", learnLevel: 43 }),
  m({ id: "quick-attack", name: "Quick Attack", type: "normal", power: 40, accuracy: 14, description: "", range: "melee", learnLevel: 7 }),
  m({ id: "rage", name: "Rage", type: "normal", power: 20, accuracy: 14, description: "", range: "melee", learnLevel: 7 }),
  m({ id: "self-destruct", name: "Self Destruct", type: "normal", power: 200, accuracy: 14, description: "", range: "long", learnLevel: 47 }),
  m({ id: "egg-bomb", name: "Egg Bomb", type: "normal", power: 100, accuracy: 10, description: "", range: "long", learnLevel: 37 }),
  m({ id: "lick", name: "Lick", type: "ghost", power: 30, accuracy: 14, description: "", range: "melee", learnLevel: 6 }),
  m({ id: "smog", name: "Smog", type: "poison", power: 30, accuracy: 10, description: "", range: "melee", learnLevel: 3 }),
  m({ id: "sludge", name: "Sludge", type: "poison", power: 65, accuracy: 14, description: "", range: "short", learnLevel: 13 }),
  m({ id: "bone-club", name: "Bone Club", type: "ground", power: 65, accuracy: 12, description: "", range: "short", learnLevel: 25 }),
  m({ id: "fire-blast", name: "Fire Blast", type: "fire", power: 110, accuracy: 12, description: "", range: "long", learnLevel: 43 }),
  m({ id: "waterfall", name: "Waterfall", type: "water", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 17 }),
  m({ id: "clamp", name: "Clamp", type: "water", power: 35, accuracy: 12, description: "", range: "melee", learnLevel: 7 }),
  m({ id: "swift", name: "Swift", type: "normal", power: 60, accuracy: 7, description: "", range: "short", learnLevel: 21 }),
  m({ id: "skull-bash", name: "Skull Bash", type: "normal", power: 130, accuracy: 14, description: "", range: "long", learnLevel: 38 }),
  m({ id: "spike-cannon", name: "Spike Cannon", type: "normal", power: 20, accuracy: 14, description: "", range: "melee", learnLevel: 6 }),
  m({ id: "constrict", name: "Constrict", type: "normal", power: 10, accuracy: 14, description: "", range: "melee", learnLevel: 3 }),
  m({ id: "high-jump-kick", name: "High Jump Kick", type: "fighting", power: 130, accuracy: 13, description: "", range: "long", learnLevel: 37 }),
  m({ id: "dream-eater", name: "Dream Eater", type: "psychic", power: 100, accuracy: 14, description: "", range: "long", learnLevel: 49 }),
  m({ id: "barrage", name: "Barrage", type: "normal", power: 15, accuracy: 12, description: "", range: "melee", learnLevel: 8 }),
  m({ id: "leech-life", name: "Leech Life", type: "bug", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 15 }),
  m({ id: "sky-attack", name: "Sky Attack", type: "flying", power: 140, accuracy: 13, description: "", range: "long", learnLevel: 37 }),
  m({ id: "bubble", name: "Bubble", type: "water", power: 40, accuracy: 14, description: "", range: "melee", learnLevel: 9 }),
  m({ id: "dizzy-punch", name: "Dizzy Punch", type: "normal", power: 70, accuracy: 14, description: "", range: "short", learnLevel: 14 }),
  m({ id: "crabhammer", name: "Crabhammer", type: "water", power: 100, accuracy: 13, description: "", range: "long", learnLevel: 37 }),
  m({ id: "explosion", name: "Explosion", type: "normal", power: 250, accuracy: 14, description: "", range: "long", learnLevel: 44 }),
  m({ id: "fury-swipes", name: "Fury Swipes", type: "normal", power: 18, accuracy: 11, description: "", range: "melee", learnLevel: 5 }),
  m({ id: "bonemerang", name: "Bonemerang", type: "ground", power: 50, accuracy: 13, description: "", range: "short", learnLevel: 20 }),
  m({ id: "rock-slide", name: "Rock Slide", type: "rock", power: 75, accuracy: 13, description: "", range: "short", learnLevel: 14 }),
  m({ id: "hyper-fang", name: "Hyper Fang", type: "normal", power: 80, accuracy: 13, description: "", range: "short", learnLevel: 18 }),
  m({ id: "tri-attack", name: "Tri Attack", type: "normal", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 22 }),
  m({ id: "slash", name: "Slash", type: "normal", power: 70, accuracy: 14, description: "", range: "short", learnLevel: 11 }),
  m({ id: "struggle", name: "Struggle", type: "normal", power: 50, accuracy: 7, description: "", range: "short", learnLevel: 11 }),
  m({ id: "triple-kick", name: "Triple Kick", type: "fighting", power: 10, accuracy: 13, description: "", range: "melee", learnLevel: 8 }),
  m({ id: "thief", name: "Thief", type: "dark", power: 60, accuracy: 14, description: "", range: "short", learnLevel: 23 }),
  m({ id: "flame-wheel", name: "Flame Wheel", type: "fire", power: 60, accuracy: 14, description: "", range: "short", learnLevel: 17 }),
  m({ id: "snore", name: "Snore", type: "normal", power: 50, accuracy: 14, description: "", range: "short", learnLevel: 24 }),
  m({ id: "aeroblast", name: "Aeroblast", type: "flying", power: 100, accuracy: 13, description: "", range: "long", learnLevel: 45 }),
  m({ id: "powder-snow", name: "Powder Snow", type: "ice", power: 40, accuracy: 14, description: "", range: "melee", learnLevel: 2 }),
  m({ id: "mach-punch", name: "Mach Punch", type: "fighting", power: 40, accuracy: 14, description: "", range: "melee", learnLevel: 1 }),
  m({ id: "feint-attack", name: "Feint Attack", type: "dark", power: 60, accuracy: 7, description: "", range: "short", learnLevel: 25 }),
  m({ id: "sludge-bomb", name: "Sludge Bomb", type: "poison", power: 90, accuracy: 14, description: "", range: "long", learnLevel: 42 }),
  m({ id: "mud-slap", name: "Mud Slap", type: "ground", power: 20, accuracy: 14, description: "", range: "melee", learnLevel: 2 }),
  m({ id: "octazooka", name: "Octazooka", type: "water", power: 65, accuracy: 12, description: "", range: "short", learnLevel: 12 }),
  m({ id: "zap-cannon", name: "Zap Cannon", type: "electric", power: 120, accuracy: 7, description: "", range: "long", learnLevel: 31 }),
  m({ id: "icy-wind", name: "Icy Wind", type: "ice", power: 55, accuracy: 13, description: "", range: "short", learnLevel: 23 }),
  m({ id: "bone-rush", name: "Bone Rush", type: "ground", power: 25, accuracy: 13, description: "", range: "melee", learnLevel: 8 }),
  m({ id: "outrage", name: "Outrage", type: "dragon", power: 120, accuracy: 14, description: "", range: "long", learnLevel: 35 }),
  m({ id: "giga-drain", name: "Giga Drain", type: "grass", power: 75, accuracy: 14, description: "", range: "short", learnLevel: 12 }),
  m({ id: "rollout", name: "Rollout", type: "rock", power: 30, accuracy: 13, description: "", range: "melee", learnLevel: 1 }),
  m({ id: "false-swipe", name: "False Swipe", type: "normal", power: 40, accuracy: 14, description: "", range: "melee", learnLevel: 2 }),
  m({ id: "spark", name: "Spark", type: "electric", power: 65, accuracy: 14, description: "", range: "short", learnLevel: 11 }),
  m({ id: "fury-cutter", name: "Fury Cutter", type: "bug", power: 40, accuracy: 13, description: "", range: "melee", learnLevel: 8 }),
  m({ id: "steel-wing", name: "Steel Wing", type: "steel", power: 70, accuracy: 13, description: "", range: "short", learnLevel: 10 }),
  m({ id: "sacred-fire", name: "Sacred Fire", type: "fire", power: 100, accuracy: 13, description: "", range: "long", learnLevel: 42 }),
  m({ id: "dynamic-punch", name: "Dynamic Punch", type: "fighting", power: 100, accuracy: 7, description: "", range: "long", learnLevel: 34 }),
  m({ id: "megahorn", name: "Megahorn", type: "bug", power: 120, accuracy: 12, description: "", range: "long", learnLevel: 46 }),
  m({ id: "dragon-breath", name: "Dragon Breath", type: "dragon", power: 60, accuracy: 14, description: "", range: "short", learnLevel: 19 }),
  m({ id: "pursuit", name: "Pursuit", type: "dark", power: 40, accuracy: 14, description: "", range: "melee", learnLevel: 9 }),
  m({ id: "rapid-spin", name: "Rapid Spin", type: "normal", power: 50, accuracy: 14, description: "", range: "short", learnLevel: 22 }),
  m({ id: "iron-tail", name: "Iron Tail", type: "steel", power: 100, accuracy: 10, description: "", range: "long", learnLevel: 33 }),
  m({ id: "metal-claw", name: "Metal Claw", type: "steel", power: 50, accuracy: 13, description: "", range: "short", learnLevel: 14 }),
  m({ id: "vital-throw", name: "Vital Throw", type: "fighting", power: 70, accuracy: 7, description: "", range: "short", learnLevel: 23 }),
  m({ id: "hidden-power", name: "Hidden Power", type: "normal", power: 60, accuracy: 14, description: "", range: "short", learnLevel: 14 }),
  m({ id: "cross-chop", name: "Cross Chop", type: "fighting", power: 100, accuracy: 11, description: "", range: "long", learnLevel: 50 }),
  m({ id: "twister", name: "Twister", type: "dragon", power: 40, accuracy: 14, description: "", range: "melee", learnLevel: 1 }),
  m({ id: "crunch", name: "Crunch", type: "dark", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 18 }),
  m({ id: "extreme-speed", name: "Extreme Speed", type: "normal", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 13 }),
  m({ id: "ancient-power", name: "Ancient Power", type: "rock", power: 60, accuracy: 14, description: "", range: "short", learnLevel: 21 }),
  m({ id: "shadow-ball", name: "Shadow Ball", type: "ghost", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 10 }),
  m({ id: "future-sight", name: "Future Sight", type: "psychic", power: 120, accuracy: 14, description: "", range: "long", learnLevel: 35 }),
  m({ id: "rock-smash", name: "Rock Smash", type: "fighting", power: 40, accuracy: 14, description: "", range: "melee", learnLevel: 3 }),
  m({ id: "whirlpool", name: "Whirlpool", type: "water", power: 35, accuracy: 12, description: "", range: "melee", learnLevel: 2 }),
  m({ id: "fake-out", name: "Fake Out", type: "normal", power: 40, accuracy: 14, description: "", range: "melee", learnLevel: 1 }),
  m({ id: "uproar", name: "Uproar", type: "normal", power: 90, accuracy: 14, description: "", range: "long", learnLevel: 36 }),
  m({ id: "heat-wave", name: "Heat Wave", type: "fire", power: 95, accuracy: 13, description: "", range: "long", learnLevel: 37 }),
  m({ id: "facade", name: "Facade", type: "normal", power: 70, accuracy: 14, description: "", range: "short", learnLevel: 15 }),
  m({ id: "focus-punch", name: "Focus Punch", type: "fighting", power: 150, accuracy: 14, description: "", range: "long", learnLevel: 41 }),
  m({ id: "smelling-salts", name: "Smelling Salts", type: "normal", power: 70, accuracy: 14, description: "", range: "short", learnLevel: 13 }),
  m({ id: "superpower", name: "Superpower", type: "fighting", power: 120, accuracy: 14, description: "", range: "long", learnLevel: 37 }),
  m({ id: "revenge", name: "Revenge", type: "fighting", power: 60, accuracy: 14, description: "", range: "short", learnLevel: 24 }),
  m({ id: "brick-break", name: "Brick Break", type: "fighting", power: 75, accuracy: 14, description: "", range: "short", learnLevel: 13 }),
  m({ id: "knock-off", name: "Knock Off", type: "dark", power: 65, accuracy: 14, description: "", range: "short", learnLevel: 21 }),
  m({ id: "eruption", name: "Eruption", type: "fire", power: 150, accuracy: 14, description: "", range: "long", learnLevel: 45 }),
  m({ id: "secret-power", name: "Secret Power", type: "normal", power: 70, accuracy: 14, description: "", range: "short", learnLevel: 16 }),
  m({ id: "dive", name: "Dive", type: "water", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 21 }),
  m({ id: "arm-thrust", name: "Arm Thrust", type: "fighting", power: 15, accuracy: 14, description: "", range: "melee", learnLevel: 9 }),
  m({ id: "luster-purge", name: "Luster Purge", type: "psychic", power: 95, accuracy: 14, description: "", range: "long", learnLevel: 47 }),
  m({ id: "mist-ball", name: "Mist Ball", type: "psychic", power: 95, accuracy: 14, description: "", range: "long", learnLevel: 41 }),
  m({ id: "blaze-kick", name: "Blaze Kick", type: "fire", power: 85, accuracy: 13, description: "", range: "long", learnLevel: 33 }),
  m({ id: "ice-ball", name: "Ice Ball", type: "ice", power: 30, accuracy: 13, description: "", range: "melee", learnLevel: 5 }),
  m({ id: "needle-arm", name: "Needle Arm", type: "grass", power: 60, accuracy: 14, description: "", range: "short", learnLevel: 24 }),
  m({ id: "hyper-voice", name: "Hyper Voice", type: "normal", power: 90, accuracy: 14, description: "", range: "long", learnLevel: 43 }),
  m({ id: "poison-fang", name: "Poison Fang", type: "poison", power: 50, accuracy: 14, description: "", range: "short", learnLevel: 22 }),
  m({ id: "crush-claw", name: "Crush Claw", type: "normal", power: 75, accuracy: 13, description: "", range: "short", learnLevel: 24 }),
  m({ id: "blast-burn", name: "Blast Burn", type: "fire", power: 150, accuracy: 13, description: "", range: "long", learnLevel: 47 }),
  m({ id: "hydro-cannon", name: "Hydro Cannon", type: "water", power: 150, accuracy: 13, description: "", range: "long", learnLevel: 33 }),
  m({ id: "meteor-mash", name: "Meteor Mash", type: "steel", power: 90, accuracy: 13, description: "", range: "long", learnLevel: 50 }),
  m({ id: "astonish", name: "Astonish", type: "ghost", power: 30, accuracy: 14, description: "", range: "melee", learnLevel: 1 }),
  m({ id: "weather-ball", name: "Weather Ball", type: "normal", power: 50, accuracy: 14, description: "", range: "short", learnLevel: 15 }),
  m({ id: "air-cutter", name: "Air Cutter", type: "flying", power: 60, accuracy: 13, description: "", range: "short", learnLevel: 21 }),
  m({ id: "overheat", name: "Overheat", type: "fire", power: 130, accuracy: 13, description: "", range: "long", learnLevel: 47 }),
  m({ id: "rock-tomb", name: "Rock Tomb", type: "rock", power: 60, accuracy: 13, description: "", range: "short", learnLevel: 25 }),
  m({ id: "silver-wind", name: "Silver Wind", type: "bug", power: 60, accuracy: 14, description: "", range: "short", learnLevel: 18 }),
  m({ id: "water-spout", name: "Water Spout", type: "water", power: 150, accuracy: 14, description: "", range: "long", learnLevel: 30 }),
  m({ id: "signal-beam", name: "Signal Beam", type: "bug", power: 75, accuracy: 14, description: "", range: "short", learnLevel: 22 }),
  m({ id: "shadow-punch", name: "Shadow Punch", type: "ghost", power: 60, accuracy: 7, description: "", range: "short", learnLevel: 19 }),
  m({ id: "extrasensory", name: "Extrasensory", type: "psychic", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 22 }),
  m({ id: "sky-uppercut", name: "Sky Uppercut", type: "fighting", power: 85, accuracy: 13, description: "", range: "long", learnLevel: 45 }),
  m({ id: "sand-tomb", name: "Sand Tomb", type: "ground", power: 35, accuracy: 12, description: "", range: "melee", learnLevel: 7 }),
  m({ id: "muddy-water", name: "Muddy Water", type: "water", power: 90, accuracy: 12, description: "", range: "long", learnLevel: 49 }),
  m({ id: "bullet-seed", name: "Bullet Seed", type: "grass", power: 25, accuracy: 14, description: "", range: "melee", learnLevel: 8 }),
  m({ id: "aerial-ace", name: "Aerial Ace", type: "flying", power: 60, accuracy: 7, description: "", range: "short", learnLevel: 22 }),
  m({ id: "icicle-spear", name: "Icicle Spear", type: "ice", power: 25, accuracy: 14, description: "", range: "melee", learnLevel: 7 }),
  m({ id: "dragon-claw", name: "Dragon Claw", type: "dragon", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 22 }),
  m({ id: "frenzy-plant", name: "Frenzy Plant", type: "grass", power: 150, accuracy: 13, description: "", range: "long", learnLevel: 39 }),
  m({ id: "bounce", name: "Bounce", type: "flying", power: 85, accuracy: 12, description: "", range: "long", learnLevel: 44 }),
  m({ id: "mud-shot", name: "Mud Shot", type: "ground", power: 55, accuracy: 13, description: "", range: "short", learnLevel: 13 }),
  m({ id: "poison-tail", name: "Poison Tail", type: "poison", power: 50, accuracy: 14, description: "", range: "short", learnLevel: 18 }),
  m({ id: "covet", name: "Covet", type: "normal", power: 60, accuracy: 14, description: "", range: "short", learnLevel: 15 }),
  m({ id: "volt-tackle", name: "Volt Tackle", type: "electric", power: 120, accuracy: 14, description: "", range: "long", learnLevel: 48 }),
  m({ id: "magical-leaf", name: "Magical Leaf", type: "grass", power: 60, accuracy: 7, description: "", range: "short", learnLevel: 13 }),
  m({ id: "leaf-blade", name: "Leaf Blade", type: "grass", power: 90, accuracy: 14, description: "", range: "long", learnLevel: 40 }),
  m({ id: "rock-blast", name: "Rock Blast", type: "rock", power: 25, accuracy: 13, description: "", range: "melee", learnLevel: 9 }),
  m({ id: "shock-wave", name: "Shock Wave", type: "electric", power: 60, accuracy: 7, description: "", range: "short", learnLevel: 13 }),
  m({ id: "water-pulse", name: "Water Pulse", type: "water", power: 60, accuracy: 14, description: "", range: "short", learnLevel: 10 }),
  m({ id: "doom-desire", name: "Doom Desire", type: "steel", power: 140, accuracy: 14, description: "", range: "long", learnLevel: 49 }),
  m({ id: "psycho-boost", name: "Psycho Boost", type: "psychic", power: 140, accuracy: 13, description: "", range: "long", learnLevel: 31 }),
  m({ id: "wake-up-slap", name: "Wake Up Slap", type: "fighting", power: 70, accuracy: 14, description: "", range: "short", learnLevel: 22 }),
  m({ id: "hammer-arm", name: "Hammer Arm", type: "fighting", power: 100, accuracy: 13, description: "", range: "long", learnLevel: 42 }),
  m({ id: "brine", name: "Brine", type: "water", power: 65, accuracy: 14, description: "", range: "short", learnLevel: 24 }),
  m({ id: "feint", name: "Feint", type: "normal", power: 30, accuracy: 14, description: "", range: "melee", learnLevel: 6 }),
  m({ id: "pluck", name: "Pluck", type: "flying", power: 60, accuracy: 14, description: "", range: "short", learnLevel: 22 }),
  m({ id: "u-turn", name: "U Turn", type: "bug", power: 70, accuracy: 14, description: "", range: "short", learnLevel: 23 }),
  m({ id: "close-combat", name: "Close Combat", type: "fighting", power: 120, accuracy: 14, description: "", range: "long", learnLevel: 31 }),
  m({ id: "payback", name: "Payback", type: "dark", power: 50, accuracy: 14, description: "", range: "short", learnLevel: 24 }),
  m({ id: "assurance", name: "Assurance", type: "dark", power: 60, accuracy: 14, description: "", range: "short", learnLevel: 22 }),
  m({ id: "last-resort", name: "Last Resort", type: "normal", power: 140, accuracy: 14, description: "", range: "long", learnLevel: 44 }),
  m({ id: "sucker-punch", name: "Sucker Punch", type: "dark", power: 70, accuracy: 14, description: "", range: "short", learnLevel: 11 }),
  m({ id: "flare-blitz", name: "Flare Blitz", type: "fire", power: 120, accuracy: 14, description: "", range: "long", learnLevel: 36 }),
  m({ id: "force-palm", name: "Force Palm", type: "fighting", power: 60, accuracy: 14, description: "", range: "short", learnLevel: 13 }),
  m({ id: "aura-sphere", name: "Aura Sphere", type: "fighting", power: 80, accuracy: 7, description: "", range: "short", learnLevel: 18 }),
  m({ id: "poison-jab", name: "Poison Jab", type: "poison", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 15 }),
  m({ id: "dark-pulse", name: "Dark Pulse", type: "dark", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 23 }),
  m({ id: "night-slash", name: "Night Slash", type: "dark", power: 70, accuracy: 14, description: "", range: "short", learnLevel: 15 }),
  m({ id: "aqua-tail", name: "Aqua Tail", type: "water", power: 90, accuracy: 13, description: "", range: "long", learnLevel: 44 }),
  m({ id: "seed-bomb", name: "Seed Bomb", type: "grass", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 23 }),
  m({ id: "air-slash", name: "Air Slash", type: "flying", power: 75, accuracy: 13, description: "", range: "short", learnLevel: 19 }),
  m({ id: "x-scissor", name: "X Scissor", type: "bug", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 18 }),
  m({ id: "bug-buzz", name: "Bug Buzz", type: "bug", power: 90, accuracy: 14, description: "", range: "long", learnLevel: 47 }),
  m({ id: "dragon-pulse", name: "Dragon Pulse", type: "dragon", power: 85, accuracy: 14, description: "", range: "long", learnLevel: 38 }),
  m({ id: "dragon-rush", name: "Dragon Rush", type: "dragon", power: 100, accuracy: 10, description: "", range: "long", learnLevel: 31 }),
  m({ id: "power-gem", name: "Power Gem", type: "rock", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 21 }),
  m({ id: "drain-punch", name: "Drain Punch", type: "fighting", power: 75, accuracy: 14, description: "", range: "short", learnLevel: 16 }),
  m({ id: "vacuum-wave", name: "Vacuum Wave", type: "fighting", power: 40, accuracy: 14, description: "", range: "melee", learnLevel: 1 }),
  m({ id: "focus-blast", name: "Focus Blast", type: "fighting", power: 120, accuracy: 10, description: "", range: "long", learnLevel: 48 }),
  m({ id: "energy-ball", name: "Energy Ball", type: "grass", power: 90, accuracy: 14, description: "", range: "long", learnLevel: 30 }),
  m({ id: "brave-bird", name: "Brave Bird", type: "flying", power: 120, accuracy: 14, description: "", range: "long", learnLevel: 31 }),
  m({ id: "earth-power", name: "Earth Power", type: "ground", power: 90, accuracy: 14, description: "", range: "long", learnLevel: 30 }),
  m({ id: "giga-impact", name: "Giga Impact", type: "normal", power: 150, accuracy: 13, description: "", range: "long", learnLevel: 38 }),
  m({ id: "bullet-punch", name: "Bullet Punch", type: "steel", power: 40, accuracy: 14, description: "", range: "melee", learnLevel: 7 }),
  m({ id: "avalanche", name: "Avalanche", type: "ice", power: 60, accuracy: 14, description: "", range: "short", learnLevel: 20 }),
  m({ id: "ice-shard", name: "Ice Shard", type: "ice", power: 40, accuracy: 14, description: "", range: "melee", learnLevel: 9 }),
  m({ id: "shadow-claw", name: "Shadow Claw", type: "ghost", power: 70, accuracy: 14, description: "", range: "short", learnLevel: 19 }),
  m({ id: "thunder-fang", name: "Thunder Fang", type: "electric", power: 65, accuracy: 13, description: "", range: "short", learnLevel: 10 }),
  m({ id: "ice-fang", name: "Ice Fang", type: "ice", power: 65, accuracy: 13, description: "", range: "short", learnLevel: 19 }),
  m({ id: "fire-fang", name: "Fire Fang", type: "fire", power: 65, accuracy: 13, description: "", range: "short", learnLevel: 20 }),
  m({ id: "shadow-sneak", name: "Shadow Sneak", type: "ghost", power: 40, accuracy: 14, description: "", range: "melee", learnLevel: 2 }),
  m({ id: "mud-bomb", name: "Mud Bomb", type: "ground", power: 65, accuracy: 12, description: "", range: "short", learnLevel: 12 }),
  m({ id: "psycho-cut", name: "Psycho Cut", type: "psychic", power: 70, accuracy: 14, description: "", range: "short", learnLevel: 11 }),
  m({ id: "zen-headbutt", name: "Zen Headbutt", type: "psychic", power: 80, accuracy: 13, description: "", range: "short", learnLevel: 25 }),
  m({ id: "mirror-shot", name: "Mirror Shot", type: "steel", power: 65, accuracy: 12, description: "", range: "short", learnLevel: 18 }),
  m({ id: "flash-cannon", name: "Flash Cannon", type: "steel", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 13 }),
  m({ id: "rock-climb", name: "Rock Climb", type: "normal", power: 90, accuracy: 12, description: "", range: "long", learnLevel: 36 }),
  m({ id: "draco-meteor", name: "Draco Meteor", type: "dragon", power: 130, accuracy: 13, description: "", range: "long", learnLevel: 34 }),
  m({ id: "discharge", name: "Discharge", type: "electric", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 16 }),
  m({ id: "lava-plume", name: "Lava Plume", type: "fire", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 22 }),
  m({ id: "leaf-storm", name: "Leaf Storm", type: "grass", power: 130, accuracy: 13, description: "", range: "long", learnLevel: 45 }),
  m({ id: "power-whip", name: "Power Whip", type: "grass", power: 120, accuracy: 12, description: "", range: "long", learnLevel: 45 }),
  m({ id: "rock-wrecker", name: "Rock Wrecker", type: "rock", power: 150, accuracy: 13, description: "", range: "long", learnLevel: 50 }),
  m({ id: "cross-poison", name: "Cross Poison", type: "poison", power: 70, accuracy: 14, description: "", range: "short", learnLevel: 14 }),
  m({ id: "gunk-shot", name: "Gunk Shot", type: "poison", power: 120, accuracy: 11, description: "", range: "long", learnLevel: 43 }),
  m({ id: "iron-head", name: "Iron Head", type: "steel", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 24 }),
  m({ id: "magnet-bomb", name: "Magnet Bomb", type: "steel", power: 60, accuracy: 7, description: "", range: "short", learnLevel: 14 }),
  m({ id: "stone-edge", name: "Stone Edge", type: "rock", power: 100, accuracy: 11, description: "", range: "long", learnLevel: 47 }),
  m({ id: "chatter", name: "Chatter", type: "flying", power: 65, accuracy: 14, description: "", range: "short", learnLevel: 11 }),
  m({ id: "judgment", name: "Judgment", type: "normal", power: 100, accuracy: 14, description: "", range: "long", learnLevel: 31 }),
  m({ id: "bug-bite", name: "Bug Bite", type: "bug", power: 60, accuracy: 14, description: "", range: "short", learnLevel: 16 }),
  m({ id: "charge-beam", name: "Charge Beam", type: "electric", power: 50, accuracy: 13, description: "", range: "short", learnLevel: 10 }),
  m({ id: "wood-hammer", name: "Wood Hammer", type: "grass", power: 120, accuracy: 14, description: "", range: "long", learnLevel: 30 }),
  m({ id: "aqua-jet", name: "Aqua Jet", type: "water", power: 40, accuracy: 14, description: "", range: "melee", learnLevel: 8 }),
  m({ id: "attack-order", name: "Attack Order", type: "bug", power: 90, accuracy: 14, description: "", range: "long", learnLevel: 50 }),
  m({ id: "head-smash", name: "Head Smash", type: "rock", power: 150, accuracy: 11, description: "", range: "long", learnLevel: 47 }),
  m({ id: "double-hit", name: "Double Hit", type: "normal", power: 35, accuracy: 13, description: "", range: "melee", learnLevel: 3 }),
  m({ id: "roar-of-time", name: "Roar Of Time", type: "dragon", power: 150, accuracy: 13, description: "", range: "long", learnLevel: 31 }),
  m({ id: "spacial-rend", name: "Spacial Rend", type: "dragon", power: 100, accuracy: 13, description: "", range: "long", learnLevel: 42 }),
  m({ id: "magma-storm", name: "Magma Storm", type: "fire", power: 100, accuracy: 10, description: "", range: "long", learnLevel: 42 }),
  m({ id: "seed-flare", name: "Seed Flare", type: "grass", power: 120, accuracy: 12, description: "", range: "long", learnLevel: 48 }),
  m({ id: "ominous-wind", name: "Ominous Wind", type: "ghost", power: 60, accuracy: 14, description: "", range: "short", learnLevel: 16 }),
  m({ id: "shadow-force", name: "Shadow Force", type: "ghost", power: 120, accuracy: 14, description: "", range: "long", learnLevel: 39 }),
  m({ id: "psyshock", name: "Psyshock", type: "psychic", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 22 }),
  m({ id: "venoshock", name: "Venoshock", type: "poison", power: 65, accuracy: 14, description: "", range: "short", learnLevel: 20 }),
  m({ id: "smack-down", name: "Smack Down", type: "rock", power: 50, accuracy: 14, description: "", range: "short", learnLevel: 25 }),
  m({ id: "storm-throw", name: "Storm Throw", type: "fighting", power: 60, accuracy: 14, description: "", range: "short", learnLevel: 21 }),
  m({ id: "flame-burst", name: "Flame Burst", type: "fire", power: 70, accuracy: 14, description: "", range: "short", learnLevel: 13 }),
  m({ id: "sludge-wave", name: "Sludge Wave", type: "poison", power: 95, accuracy: 14, description: "", range: "long", learnLevel: 45 }),
  m({ id: "synchronoise", name: "Synchronoise", type: "psychic", power: 120, accuracy: 14, description: "", range: "long", learnLevel: 33 }),
  m({ id: "flame-charge", name: "Flame Charge", type: "fire", power: 50, accuracy: 14, description: "", range: "short", learnLevel: 16 }),
  m({ id: "low-sweep", name: "Low Sweep", type: "fighting", power: 65, accuracy: 14, description: "", range: "short", learnLevel: 14 }),
  m({ id: "acid-spray", name: "Acid Spray", type: "poison", power: 40, accuracy: 14, description: "", range: "melee", learnLevel: 1 }),
  m({ id: "foul-play", name: "Foul Play", type: "dark", power: 95, accuracy: 14, description: "", range: "long", learnLevel: 40 }),
  m({ id: "round", name: "Round", type: "normal", power: 60, accuracy: 14, description: "", range: "short", learnLevel: 13 }),
  m({ id: "echoed-voice", name: "Echoed Voice", type: "normal", power: 40, accuracy: 14, description: "", range: "melee", learnLevel: 5 }),
  m({ id: "chip-away", name: "Chip Away", type: "normal", power: 70, accuracy: 14, description: "", range: "short", learnLevel: 20 }),
  m({ id: "clear-smog", name: "Clear Smog", type: "poison", power: 50, accuracy: 7, description: "", range: "short", learnLevel: 17 }),
  m({ id: "stored-power", name: "Stored Power", type: "psychic", power: 20, accuracy: 14, description: "", range: "melee", learnLevel: 10 }),
  m({ id: "scald", name: "Scald", type: "water", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 17 }),
  m({ id: "hex", name: "Hex", type: "ghost", power: 65, accuracy: 14, description: "", range: "short", learnLevel: 24 }),
  m({ id: "sky-drop", name: "Sky Drop", type: "flying", power: 60, accuracy: 14, description: "", range: "short", learnLevel: 19 }),
  m({ id: "circle-throw", name: "Circle Throw", type: "fighting", power: 60, accuracy: 13, description: "", range: "short", learnLevel: 15 }),
  m({ id: "incinerate", name: "Incinerate", type: "fire", power: 60, accuracy: 14, description: "", range: "short", learnLevel: 15 }),
  m({ id: "acrobatics", name: "Acrobatics", type: "flying", power: 55, accuracy: 14, description: "", range: "short", learnLevel: 16 }),
  m({ id: "retaliate", name: "Retaliate", type: "normal", power: 70, accuracy: 14, description: "", range: "short", learnLevel: 13 }),
  m({ id: "inferno", name: "Inferno", type: "fire", power: 100, accuracy: 7, description: "", range: "long", learnLevel: 31 }),
  m({ id: "water-pledge", name: "Water Pledge", type: "water", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 14 }),
  m({ id: "fire-pledge", name: "Fire Pledge", type: "fire", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 21 }),
  m({ id: "grass-pledge", name: "Grass Pledge", type: "grass", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 11 }),
  m({ id: "volt-switch", name: "Volt Switch", type: "electric", power: 70, accuracy: 14, description: "", range: "short", learnLevel: 23 }),
  m({ id: "struggle-bug", name: "Struggle Bug", type: "bug", power: 50, accuracy: 14, description: "", range: "short", learnLevel: 21 }),
  m({ id: "bulldoze", name: "Bulldoze", type: "ground", power: 60, accuracy: 14, description: "", range: "short", learnLevel: 19 }),
  m({ id: "frost-breath", name: "Frost Breath", type: "ice", power: 60, accuracy: 13, description: "", range: "short", learnLevel: 18 }),
  m({ id: "dragon-tail", name: "Dragon Tail", type: "dragon", power: 60, accuracy: 13, description: "", range: "short", learnLevel: 21 }),
  m({ id: "electroweb", name: "Electroweb", type: "electric", power: 55, accuracy: 13, description: "", range: "short", learnLevel: 14 }),
  m({ id: "wild-charge", name: "Wild Charge", type: "electric", power: 90, accuracy: 14, description: "", range: "long", learnLevel: 49 }),
  m({ id: "drill-run", name: "Drill Run", type: "ground", power: 80, accuracy: 13, description: "", range: "short", learnLevel: 10 }),
  m({ id: "dual-chop", name: "Dual Chop", type: "dragon", power: 40, accuracy: 13, description: "", range: "melee", learnLevel: 8 }),
  m({ id: "heart-stamp", name: "Heart Stamp", type: "psychic", power: 60, accuracy: 14, description: "", range: "short", learnLevel: 13 }),
  m({ id: "horn-leech", name: "Horn Leech", type: "grass", power: 75, accuracy: 14, description: "", range: "short", learnLevel: 25 }),
  m({ id: "sacred-sword", name: "Sacred Sword", type: "fighting", power: 90, accuracy: 14, description: "", range: "long", learnLevel: 50 }),
  m({ id: "razor-shell", name: "Razor Shell", type: "water", power: 75, accuracy: 13, description: "", range: "short", learnLevel: 10 }),
  m({ id: "leaf-tornado", name: "Leaf Tornado", type: "grass", power: 65, accuracy: 13, description: "", range: "short", learnLevel: 12 }),
  m({ id: "steamroller", name: "Steamroller", type: "bug", power: 65, accuracy: 14, description: "", range: "short", learnLevel: 13 }),
  m({ id: "night-daze", name: "Night Daze", type: "dark", power: 85, accuracy: 13, description: "", range: "long", learnLevel: 34 }),
  m({ id: "psystrike", name: "Psystrike", type: "psychic", power: 100, accuracy: 14, description: "", range: "long", learnLevel: 32 }),
  m({ id: "tail-slap", name: "Tail Slap", type: "normal", power: 25, accuracy: 12, description: "", range: "melee", learnLevel: 6 }),
  m({ id: "hurricane", name: "Hurricane", type: "flying", power: 110, accuracy: 10, description: "", range: "long", learnLevel: 47 }),
  m({ id: "head-charge", name: "Head Charge", type: "normal", power: 120, accuracy: 14, description: "", range: "long", learnLevel: 43 }),
  m({ id: "gear-grind", name: "Gear Grind", type: "steel", power: 50, accuracy: 12, description: "", range: "short", learnLevel: 13 }),
  m({ id: "searing-shot", name: "Searing Shot", type: "fire", power: 100, accuracy: 14, description: "", range: "long", learnLevel: 49 }),
  m({ id: "techno-blast", name: "Techno Blast", type: "normal", power: 120, accuracy: 14, description: "", range: "long", learnLevel: 42 }),
  m({ id: "relic-song", name: "Relic Song", type: "normal", power: 75, accuracy: 14, description: "", range: "short", learnLevel: 20 }),
  m({ id: "secret-sword", name: "Secret Sword", type: "fighting", power: 85, accuracy: 14, description: "", range: "long", learnLevel: 40 }),
  m({ id: "glaciate", name: "Glaciate", type: "ice", power: 65, accuracy: 13, description: "", range: "short", learnLevel: 18 }),
  m({ id: "bolt-strike", name: "Bolt Strike", type: "electric", power: 130, accuracy: 12, description: "", range: "long", learnLevel: 41 }),
  m({ id: "blue-flare", name: "Blue Flare", type: "fire", power: 130, accuracy: 12, description: "", range: "long", learnLevel: 40 }),
  m({ id: "fiery-dance", name: "Fiery Dance", type: "fire", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 13 }),
  m({ id: "freeze-shock", name: "Freeze Shock", type: "ice", power: 140, accuracy: 13, description: "", range: "long", learnLevel: 38 }),
  m({ id: "ice-burn", name: "Ice Burn", type: "ice", power: 140, accuracy: 13, description: "", range: "long", learnLevel: 34 }),
  m({ id: "snarl", name: "Snarl", type: "dark", power: 55, accuracy: 13, description: "", range: "short", learnLevel: 24 }),
  m({ id: "icicle-crash", name: "Icicle Crash", type: "ice", power: 85, accuracy: 13, description: "", range: "long", learnLevel: 37 }),
  m({ id: "v-create", name: "V Create", type: "fire", power: 180, accuracy: 13, description: "", range: "long", learnLevel: 34 }),
  m({ id: "fusion-flare", name: "Fusion Flare", type: "fire", power: 100, accuracy: 14, description: "", range: "long", learnLevel: 45 }),
  m({ id: "fusion-bolt", name: "Fusion Bolt", type: "electric", power: 100, accuracy: 14, description: "", range: "long", learnLevel: 31 }),
  m({ id: "flying-press", name: "Flying Press", type: "fighting", power: 100, accuracy: 13, description: "", range: "long", learnLevel: 32 }),
  m({ id: "belch", name: "Belch", type: "poison", power: 120, accuracy: 13, description: "", range: "long", learnLevel: 39 }),
  m({ id: "fell-stinger", name: "Fell Stinger", type: "bug", power: 50, accuracy: 14, description: "", range: "short", learnLevel: 18 }),
  m({ id: "phantom-force", name: "Phantom Force", type: "ghost", power: 90, accuracy: 14, description: "", range: "long", learnLevel: 38 }),
  m({ id: "parabolic-charge", name: "Parabolic Charge", type: "electric", power: 65, accuracy: 14, description: "", range: "short", learnLevel: 14 }),
  m({ id: "petal-blizzard", name: "Petal Blizzard", type: "grass", power: 90, accuracy: 14, description: "", range: "long", learnLevel: 48 }),
  m({ id: "freeze-dry", name: "Freeze Dry", type: "ice", power: 70, accuracy: 14, description: "", range: "short", learnLevel: 19 }),
  m({ id: "disarming-voice", name: "Disarming Voice", type: "fairy", power: 40, accuracy: 7, description: "", range: "melee", learnLevel: 8 }),
  m({ id: "draining-kiss", name: "Draining Kiss", type: "fairy", power: 50, accuracy: 14, description: "", range: "short", learnLevel: 10 }),
  m({ id: "play-rough", name: "Play Rough", type: "fairy", power: 90, accuracy: 13, description: "", range: "long", learnLevel: 36 }),
  m({ id: "fairy-wind", name: "Fairy Wind", type: "fairy", power: 40, accuracy: 14, description: "", range: "melee", learnLevel: 8 }),
  m({ id: "moonblast", name: "Moonblast", type: "fairy", power: 95, accuracy: 14, description: "", range: "long", learnLevel: 50 }),
  m({ id: "boomburst", name: "Boomburst", type: "normal", power: 140, accuracy: 14, description: "", range: "long", learnLevel: 50 }),
  m({ id: "diamond-storm", name: "Diamond Storm", type: "rock", power: 100, accuracy: 13, description: "", range: "long", learnLevel: 49 }),
  m({ id: "steam-eruption", name: "Steam Eruption", type: "water", power: 110, accuracy: 13, description: "", range: "long", learnLevel: 49 }),
  m({ id: "hyperspace-hole", name: "Hyperspace Hole", type: "psychic", power: 80, accuracy: 7, description: "", range: "short", learnLevel: 15 }),
  m({ id: "water-shuriken", name: "Water Shuriken", type: "water", power: 15, accuracy: 14, description: "", range: "melee", learnLevel: 6 }),
  m({ id: "mystical-fire", name: "Mystical Fire", type: "fire", power: 75, accuracy: 14, description: "", range: "short", learnLevel: 19 }),
  m({ id: "dazzling-gleam", name: "Dazzling Gleam", type: "fairy", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 12 }),
  m({ id: "nuzzle", name: "Nuzzle", type: "electric", power: 20, accuracy: 14, description: "", range: "melee", learnLevel: 3 }),
  m({ id: "hold-back", name: "Hold Back", type: "normal", power: 40, accuracy: 14, description: "", range: "melee", learnLevel: 9 }),
  m({ id: "infestation", name: "Infestation", type: "bug", power: 20, accuracy: 14, description: "", range: "melee", learnLevel: 9 }),
  m({ id: "power-up-punch", name: "Power Up Punch", type: "fighting", power: 40, accuracy: 14, description: "", range: "melee", learnLevel: 6 }),
  m({ id: "oblivion-wing", name: "Oblivion Wing", type: "flying", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 22 }),
  m({ id: "thousand-arrows", name: "Thousand Arrows", type: "ground", power: 90, accuracy: 14, description: "", range: "long", learnLevel: 44 }),
  m({ id: "thousand-waves", name: "Thousand Waves", type: "ground", power: 90, accuracy: 14, description: "", range: "long", learnLevel: 44 }),
  m({ id: "lands-wrath", name: "Lands Wrath", type: "ground", power: 90, accuracy: 14, description: "", range: "long", learnLevel: 47 }),
  m({ id: "light-of-ruin", name: "Light Of Ruin", type: "fairy", power: 140, accuracy: 13, description: "", range: "long", learnLevel: 49 }),
  m({ id: "origin-pulse", name: "Origin Pulse", type: "water", power: 110, accuracy: 12, description: "", range: "long", learnLevel: 38 }),
  m({ id: "precipice-blades", name: "Precipice Blades", type: "ground", power: 120, accuracy: 12, description: "", range: "long", learnLevel: 50 }),
  m({ id: "dragon-ascent", name: "Dragon Ascent", type: "flying", power: 120, accuracy: 14, description: "", range: "long", learnLevel: 41 }),
  m({ id: "hyperspace-fury", name: "Hyperspace Fury", type: "dark", power: 100, accuracy: 7, description: "", range: "long", learnLevel: 31 }),
  m({ id: "catastropika", name: "Catastropika", type: "electric", power: 210, accuracy: 7, description: "", range: "long", learnLevel: 42 }),
  m({ id: "first-impression", name: "First Impression", type: "bug", power: 90, accuracy: 14, description: "", range: "long", learnLevel: 45 }),
  m({ id: "spirit-shackle", name: "Spirit Shackle", type: "ghost", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 20 }),
  m({ id: "darkest-lariat", name: "Darkest Lariat", type: "dark", power: 85, accuracy: 14, description: "", range: "long", learnLevel: 45 }),
  m({ id: "sparkling-aria", name: "Sparkling Aria", type: "water", power: 90, accuracy: 14, description: "", range: "long", learnLevel: 39 }),
  m({ id: "ice-hammer", name: "Ice Hammer", type: "ice", power: 100, accuracy: 13, description: "", range: "long", learnLevel: 41 }),
  m({ id: "high-horsepower", name: "High Horsepower", type: "ground", power: 95, accuracy: 13, description: "", range: "long", learnLevel: 41 }),
  m({ id: "solar-blade", name: "Solar Blade", type: "grass", power: 125, accuracy: 14, description: "", range: "long", learnLevel: 35 }),
  m({ id: "leafage", name: "Leafage", type: "grass", power: 40, accuracy: 14, description: "", range: "melee", learnLevel: 7 }),
  m({ id: "throat-chop", name: "Throat Chop", type: "dark", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 17 }),
  m({ id: "pollen-puff", name: "Pollen Puff", type: "bug", power: 90, accuracy: 14, description: "", range: "long", learnLevel: 38 }),
  m({ id: "anchor-shot", name: "Anchor Shot", type: "steel", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 21 }),
  m({ id: "lunge", name: "Lunge", type: "bug", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 12 }),
  m({ id: "fire-lash", name: "Fire Lash", type: "fire", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 14 }),
  m({ id: "power-trip", name: "Power Trip", type: "dark", power: 20, accuracy: 14, description: "", range: "melee", learnLevel: 10 }),
  m({ id: "burn-up", name: "Burn Up", type: "fire", power: 130, accuracy: 14, description: "", range: "long", learnLevel: 48 }),
  m({ id: "smart-strike", name: "Smart Strike", type: "steel", power: 70, accuracy: 7, description: "", range: "short", learnLevel: 25 }),
  m({ id: "revelation-dance", name: "Revelation Dance", type: "normal", power: 90, accuracy: 14, description: "", range: "long", learnLevel: 37 }),
  m({ id: "core-enforcer", name: "Core Enforcer", type: "dragon", power: 100, accuracy: 14, description: "", range: "long", learnLevel: 38 }),
  m({ id: "trop-kick", name: "Trop Kick", type: "grass", power: 70, accuracy: 14, description: "", range: "short", learnLevel: 21 }),
  m({ id: "beak-blast", name: "Beak Blast", type: "flying", power: 100, accuracy: 14, description: "", range: "long", learnLevel: 43 }),
  m({ id: "clanging-scales", name: "Clanging Scales", type: "dragon", power: 110, accuracy: 14, description: "", range: "long", learnLevel: 43 }),
  m({ id: "dragon-hammer", name: "Dragon Hammer", type: "dragon", power: 90, accuracy: 14, description: "", range: "long", learnLevel: 48 }),
  m({ id: "brutal-swing", name: "Brutal Swing", type: "dark", power: 60, accuracy: 14, description: "", range: "short", learnLevel: 21 }),
  m({ id: "sinister-arrow-raid", name: "Sinister Arrow Raid", type: "ghost", power: 180, accuracy: 7, description: "", range: "long", learnLevel: 30 }),
  m({ id: "malicious-moonsault", name: "Malicious Moonsault", type: "dark", power: 180, accuracy: 7, description: "", range: "long", learnLevel: 45 }),
  m({ id: "oceanic-operetta", name: "Oceanic Operetta", type: "water", power: 195, accuracy: 7, description: "", range: "long", learnLevel: 41 }),
  m({ id: "soul-stealing-7-star-strike", name: "Soul Stealing 7 Star Strike", type: "ghost", power: 195, accuracy: 7, description: "", range: "long", learnLevel: 39 }),
  m({ id: "stoked-sparksurfer", name: "Stoked Sparksurfer", type: "electric", power: 175, accuracy: 7, description: "", range: "long", learnLevel: 39 }),
  m({ id: "pulverizing-pancake", name: "Pulverizing Pancake", type: "normal", power: 210, accuracy: 7, description: "", range: "long", learnLevel: 44 }),
  m({ id: "genesis-supernova", name: "Genesis Supernova", type: "psychic", power: 185, accuracy: 7, description: "", range: "long", learnLevel: 41 }),
  m({ id: "shell-trap", name: "Shell Trap", type: "fire", power: 150, accuracy: 14, description: "", range: "long", learnLevel: 42 }),
  m({ id: "fleur-cannon", name: "Fleur Cannon", type: "fairy", power: 130, accuracy: 13, description: "", range: "long", learnLevel: 44 }),
  m({ id: "psychic-fangs", name: "Psychic Fangs", type: "psychic", power: 85, accuracy: 14, description: "", range: "long", learnLevel: 46 }),
  m({ id: "stomping-tantrum", name: "Stomping Tantrum", type: "ground", power: 75, accuracy: 14, description: "", range: "short", learnLevel: 25 }),
  m({ id: "shadow-bone", name: "Shadow Bone", type: "ghost", power: 85, accuracy: 14, description: "", range: "long", learnLevel: 38 }),
  m({ id: "accelerock", name: "Accelerock", type: "rock", power: 40, accuracy: 14, description: "", range: "melee", learnLevel: 3 }),
  m({ id: "liquidation", name: "Liquidation", type: "water", power: 85, accuracy: 14, description: "", range: "long", learnLevel: 30 }),
  m({ id: "prismatic-laser", name: "Prismatic Laser", type: "psychic", power: 160, accuracy: 14, description: "", range: "long", learnLevel: 31 }),
  m({ id: "spectral-thief", name: "Spectral Thief", type: "ghost", power: 90, accuracy: 14, description: "", range: "long", learnLevel: 34 }),
  m({ id: "sunsteel-strike", name: "Sunsteel Strike", type: "steel", power: 100, accuracy: 14, description: "", range: "long", learnLevel: 48 }),
  m({ id: "moongeist-beam", name: "Moongeist Beam", type: "ghost", power: 100, accuracy: 14, description: "", range: "long", learnLevel: 35 }),
  m({ id: "zing-zap", name: "Zing Zap", type: "electric", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 22 }),
  m({ id: "multi-attack", name: "Multi Attack", type: "normal", power: 120, accuracy: 14, description: "", range: "long", learnLevel: 43 }),
  m({ id: "10-000-000-volt-thunderbolt", name: "10 000 000 Volt Thunderbolt", type: "electric", power: 195, accuracy: 7, description: "", range: "long", learnLevel: 49 }),
  m({ id: "mind-blown", name: "Mind Blown", type: "fire", power: 150, accuracy: 14, description: "", range: "long", learnLevel: 39 }),
  m({ id: "plasma-fists", name: "Plasma Fists", type: "electric", power: 100, accuracy: 14, description: "", range: "long", learnLevel: 48 }),
  m({ id: "photon-geyser", name: "Photon Geyser", type: "psychic", power: 100, accuracy: 14, description: "", range: "long", learnLevel: 32 }),
  m({ id: "light-that-burns-the-sky", name: "Light That Burns The Sky", type: "psychic", power: 200, accuracy: 7, description: "", range: "long", learnLevel: 47 }),
  m({ id: "searing-sunraze-smash", name: "Searing Sunraze Smash", type: "steel", power: 200, accuracy: 7, description: "", range: "long", learnLevel: 43 }),
  m({ id: "menacing-moonraze-maelstrom", name: "Menacing Moonraze Maelstrom", type: "ghost", power: 200, accuracy: 7, description: "", range: "long", learnLevel: 49 }),
  m({ id: "lets-snuggle-forever", name: "Lets Snuggle Forever", type: "fairy", power: 190, accuracy: 7, description: "", range: "long", learnLevel: 44 }),
  m({ id: "splintered-stormshards", name: "Splintered Stormshards", type: "rock", power: 190, accuracy: 7, description: "", range: "long", learnLevel: 38 }),
  m({ id: "clangorous-soulblaze", name: "Clangorous Soulblaze", type: "dragon", power: 185, accuracy: 7, description: "", range: "long", learnLevel: 50 }),
  m({ id: "zippy-zap", name: "Zippy Zap", type: "electric", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 12 }),
  m({ id: "splishy-splash", name: "Splishy Splash", type: "water", power: 90, accuracy: 14, description: "", range: "long", learnLevel: 33 }),
  m({ id: "floaty-fall", name: "Floaty Fall", type: "flying", power: 90, accuracy: 13, description: "", range: "long", learnLevel: 34 }),
  m({ id: "bouncy-bubble", name: "Bouncy Bubble", type: "water", power: 60, accuracy: 14, description: "", range: "short", learnLevel: 21 }),
  m({ id: "buzzy-buzz", name: "Buzzy Buzz", type: "electric", power: 60, accuracy: 14, description: "", range: "short", learnLevel: 17 }),
  m({ id: "sizzly-slide", name: "Sizzly Slide", type: "fire", power: 60, accuracy: 14, description: "", range: "short", learnLevel: 11 }),
  m({ id: "glitzy-glow", name: "Glitzy Glow", type: "psychic", power: 80, accuracy: 13, description: "", range: "short", learnLevel: 16 }),
  m({ id: "baddy-bad", name: "Baddy Bad", type: "dark", power: 80, accuracy: 13, description: "", range: "short", learnLevel: 15 }),
  m({ id: "sappy-seed", name: "Sappy Seed", type: "grass", power: 100, accuracy: 13, description: "", range: "long", learnLevel: 42 }),
  m({ id: "freezy-frost", name: "Freezy Frost", type: "ice", power: 100, accuracy: 13, description: "", range: "long", learnLevel: 48 }),
  m({ id: "sparkly-swirl", name: "Sparkly Swirl", type: "fairy", power: 120, accuracy: 12, description: "", range: "long", learnLevel: 42 }),
  m({ id: "double-iron-bash", name: "Double Iron Bash", type: "steel", power: 60, accuracy: 14, description: "", range: "short", learnLevel: 20 }),
  m({ id: "dynamax-cannon", name: "Dynamax Cannon", type: "dragon", power: 100, accuracy: 14, description: "", range: "long", learnLevel: 40 }),
  m({ id: "snipe-shot", name: "Snipe Shot", type: "water", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 24 }),
  m({ id: "jaw-lock", name: "Jaw Lock", type: "dark", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 19 }),
  m({ id: "dragon-darts", name: "Dragon Darts", type: "dragon", power: 50, accuracy: 14, description: "", range: "short", learnLevel: 11 }),
  m({ id: "bolt-beak", name: "Bolt Beak", type: "electric", power: 85, accuracy: 14, description: "", range: "long", learnLevel: 37 }),
  m({ id: "fishious-rend", name: "Fishious Rend", type: "water", power: 85, accuracy: 14, description: "", range: "long", learnLevel: 37 }),
  m({ id: "max-flare", name: "Max Flare", type: "fire", power: 100, accuracy: 7, description: "", range: "long", learnLevel: 37 }),
  m({ id: "max-flutterby", name: "Max Flutterby", type: "bug", power: 10, accuracy: 7, description: "", range: "melee", learnLevel: 10 }),
  m({ id: "max-lightning", name: "Max Lightning", type: "electric", power: 10, accuracy: 7, description: "", range: "melee", learnLevel: 7 }),
  m({ id: "max-strike", name: "Max Strike", type: "normal", power: 10, accuracy: 7, description: "", range: "melee", learnLevel: 9 }),
  m({ id: "max-knuckle", name: "Max Knuckle", type: "fighting", power: 10, accuracy: 7, description: "", range: "melee", learnLevel: 8 }),
  m({ id: "max-phantasm", name: "Max Phantasm", type: "ghost", power: 10, accuracy: 7, description: "", range: "melee", learnLevel: 10 }),
  m({ id: "max-hailstorm", name: "Max Hailstorm", type: "ice", power: 10, accuracy: 7, description: "", range: "melee", learnLevel: 7 }),
  m({ id: "max-ooze", name: "Max Ooze", type: "poison", power: 10, accuracy: 7, description: "", range: "melee", learnLevel: 2 }),
  m({ id: "max-geyser", name: "Max Geyser", type: "water", power: 10, accuracy: 7, description: "", range: "melee", learnLevel: 5 }),
  m({ id: "max-airstream", name: "Max Airstream", type: "flying", power: 10, accuracy: 7, description: "", range: "melee", learnLevel: 10 }),
  m({ id: "max-starfall", name: "Max Starfall", type: "fairy", power: 10, accuracy: 7, description: "", range: "melee", learnLevel: 4 }),
  m({ id: "max-wyrmwind", name: "Max Wyrmwind", type: "dragon", power: 10, accuracy: 7, description: "", range: "melee", learnLevel: 5 }),
  m({ id: "max-mindstorm", name: "Max Mindstorm", type: "psychic", power: 10, accuracy: 7, description: "", range: "melee", learnLevel: 8 }),
  m({ id: "max-rockfall", name: "Max Rockfall", type: "rock", power: 10, accuracy: 7, description: "", range: "melee", learnLevel: 9 }),
  m({ id: "max-quake", name: "Max Quake", type: "ground", power: 10, accuracy: 7, description: "", range: "melee", learnLevel: 4 }),
  m({ id: "max-darkness", name: "Max Darkness", type: "dark", power: 10, accuracy: 7, description: "", range: "melee", learnLevel: 8 }),
  m({ id: "max-overgrowth", name: "Max Overgrowth", type: "grass", power: 10, accuracy: 7, description: "", range: "melee", learnLevel: 1 }),
  m({ id: "max-steelspike", name: "Max Steelspike", type: "steel", power: 10, accuracy: 7, description: "", range: "melee", learnLevel: 3 }),
  m({ id: "body-press", name: "Body Press", type: "fighting", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 17 }),
  m({ id: "drum-beating", name: "Drum Beating", type: "grass", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 17 }),
  m({ id: "snap-trap", name: "Snap Trap", type: "grass", power: 35, accuracy: 14, description: "", range: "melee", learnLevel: 4 }),
  m({ id: "pyro-ball", name: "Pyro Ball", type: "fire", power: 120, accuracy: 13, description: "", range: "long", learnLevel: 49 }),
  m({ id: "behemoth-blade", name: "Behemoth Blade", type: "steel", power: 100, accuracy: 14, description: "", range: "long", learnLevel: 49 }),
  m({ id: "behemoth-bash", name: "Behemoth Bash", type: "steel", power: 100, accuracy: 14, description: "", range: "long", learnLevel: 46 }),
  m({ id: "aura-wheel", name: "Aura Wheel", type: "electric", power: 110, accuracy: 14, description: "", range: "long", learnLevel: 36 }),
  m({ id: "breaking-swipe", name: "Breaking Swipe", type: "dragon", power: 60, accuracy: 14, description: "", range: "short", learnLevel: 11 }),
  m({ id: "branch-poke", name: "Branch Poke", type: "grass", power: 40, accuracy: 14, description: "", range: "melee", learnLevel: 4 }),
  m({ id: "overdrive", name: "Overdrive", type: "electric", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 14 }),
  m({ id: "apple-acid", name: "Apple Acid", type: "grass", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 14 }),
  m({ id: "grav-apple", name: "Grav Apple", type: "grass", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 20 }),
  m({ id: "spirit-break", name: "Spirit Break", type: "fairy", power: 75, accuracy: 14, description: "", range: "short", learnLevel: 11 }),
  m({ id: "strange-steam", name: "Strange Steam", type: "fairy", power: 90, accuracy: 13, description: "", range: "long", learnLevel: 43 }),
  m({ id: "false-surrender", name: "False Surrender", type: "dark", power: 80, accuracy: 7, description: "", range: "short", learnLevel: 23 }),
  m({ id: "meteor-assault", name: "Meteor Assault", type: "fighting", power: 150, accuracy: 14, description: "", range: "long", learnLevel: 45 }),
  m({ id: "eternabeam", name: "Eternabeam", type: "dragon", power: 160, accuracy: 13, description: "", range: "long", learnLevel: 47 }),
  m({ id: "steel-beam", name: "Steel Beam", type: "steel", power: 140, accuracy: 13, description: "", range: "long", learnLevel: 44 }),
  m({ id: "expanding-force", name: "Expanding Force", type: "psychic", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 21 }),
  m({ id: "steel-roller", name: "Steel Roller", type: "steel", power: 130, accuracy: 14, description: "", range: "long", learnLevel: 38 }),
  m({ id: "scale-shot", name: "Scale Shot", type: "dragon", power: 25, accuracy: 13, description: "", range: "melee", learnLevel: 4 }),
  m({ id: "meteor-beam", name: "Meteor Beam", type: "rock", power: 120, accuracy: 13, description: "", range: "long", learnLevel: 42 }),
  m({ id: "shell-side-arm", name: "Shell Side Arm", type: "poison", power: 90, accuracy: 14, description: "", range: "long", learnLevel: 31 }),
  m({ id: "misty-explosion", name: "Misty Explosion", type: "fairy", power: 100, accuracy: 14, description: "", range: "long", learnLevel: 50 }),
  m({ id: "grassy-glide", name: "Grassy Glide", type: "grass", power: 55, accuracy: 14, description: "", range: "short", learnLevel: 12 }),
  m({ id: "rising-voltage", name: "Rising Voltage", type: "electric", power: 70, accuracy: 14, description: "", range: "short", learnLevel: 15 }),
  m({ id: "terrain-pulse", name: "Terrain Pulse", type: "normal", power: 50, accuracy: 14, description: "", range: "short", learnLevel: 17 }),
  m({ id: "skitter-smack", name: "Skitter Smack", type: "bug", power: 70, accuracy: 13, description: "", range: "short", learnLevel: 16 }),
  m({ id: "burning-jealousy", name: "Burning Jealousy", type: "fire", power: 70, accuracy: 14, description: "", range: "short", learnLevel: 17 }),
  m({ id: "lash-out", name: "Lash Out", type: "dark", power: 75, accuracy: 14, description: "", range: "short", learnLevel: 18 }),
  m({ id: "poltergeist", name: "Poltergeist", type: "ghost", power: 110, accuracy: 13, description: "", range: "long", learnLevel: 32 }),
  m({ id: "flip-turn", name: "Flip Turn", type: "water", power: 60, accuracy: 14, description: "", range: "short", learnLevel: 19 }),
  m({ id: "triple-axel", name: "Triple Axel", type: "ice", power: 20, accuracy: 13, description: "", range: "melee", learnLevel: 8 }),
  m({ id: "dual-wingbeat", name: "Dual Wingbeat", type: "flying", power: 40, accuracy: 13, description: "", range: "melee", learnLevel: 2 }),
  m({ id: "scorching-sands", name: "Scorching Sands", type: "ground", power: 70, accuracy: 14, description: "", range: "short", learnLevel: 15 }),
  m({ id: "wicked-blow", name: "Wicked Blow", type: "dark", power: 75, accuracy: 14, description: "", range: "short", learnLevel: 18 }),
  m({ id: "surging-strikes", name: "Surging Strikes", type: "water", power: 25, accuracy: 14, description: "", range: "melee", learnLevel: 3 }),
  m({ id: "thunder-cage", name: "Thunder Cage", type: "electric", power: 80, accuracy: 13, description: "", range: "short", learnLevel: 11 }),
  m({ id: "dragon-energy", name: "Dragon Energy", type: "dragon", power: 150, accuracy: 14, description: "", range: "long", learnLevel: 47 }),
  m({ id: "freezing-glare", name: "Freezing Glare", type: "psychic", power: 90, accuracy: 14, description: "", range: "long", learnLevel: 35 }),
  m({ id: "fiery-wrath", name: "Fiery Wrath", type: "dark", power: 90, accuracy: 14, description: "", range: "long", learnLevel: 34 }),
  m({ id: "thunderous-kick", name: "Thunderous Kick", type: "fighting", power: 90, accuracy: 14, description: "", range: "long", learnLevel: 45 }),
  m({ id: "glacial-lance", name: "Glacial Lance", type: "ice", power: 120, accuracy: 14, description: "", range: "long", learnLevel: 37 }),
  m({ id: "astral-barrage", name: "Astral Barrage", type: "ghost", power: 120, accuracy: 14, description: "", range: "long", learnLevel: 33 }),
  m({ id: "eerie-spell", name: "Eerie Spell", type: "psychic", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 25 }),
  m({ id: "dire-claw", name: "Dire Claw", type: "poison", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 14 }),
  m({ id: "psyshield-bash", name: "Psyshield Bash", type: "psychic", power: 70, accuracy: 13, description: "", range: "short", learnLevel: 22 }),
  m({ id: "power-shift", name: "Power Shift", type: "normal", power: 0, accuracy: 7, description: "", range: "melee", learnLevel: 4 }),
  m({ id: "stone-axe", name: "Stone Axe", type: "rock", power: 65, accuracy: 13, description: "", range: "short", learnLevel: 25 }),
  m({ id: "springtide-storm", name: "Springtide Storm", type: "fairy", power: 100, accuracy: 11, description: "", range: "long", learnLevel: 33 }),
  m({ id: "mystical-power", name: "Mystical Power", type: "psychic", power: 70, accuracy: 13, description: "", range: "short", learnLevel: 17 }),
  m({ id: "raging-fury", name: "Raging Fury", type: "fire", power: 120, accuracy: 14, description: "", range: "long", learnLevel: 34 }),
  m({ id: "wave-crash", name: "Wave Crash", type: "water", power: 120, accuracy: 14, description: "", range: "long", learnLevel: 42 }),
  m({ id: "chloroblast", name: "Chloroblast", type: "grass", power: 150, accuracy: 13, description: "", range: "long", learnLevel: 46 }),
  m({ id: "mountain-gale", name: "Mountain Gale", type: "ice", power: 100, accuracy: 12, description: "", range: "long", learnLevel: 40 }),
  m({ id: "victory-dance", name: "Victory Dance", type: "fighting", power: 0, accuracy: 7, description: "", range: "melee", learnLevel: 10 }),
  m({ id: "headlong-rush", name: "Headlong Rush", type: "ground", power: 120, accuracy: 14, description: "", range: "long", learnLevel: 32 }),
  m({ id: "barb-barrage", name: "Barb Barrage", type: "poison", power: 60, accuracy: 14, description: "", range: "short", learnLevel: 21 }),
  m({ id: "esper-wing", name: "Esper Wing", type: "psychic", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 21 }),
  m({ id: "bitter-malice", name: "Bitter Malice", type: "ghost", power: 75, accuracy: 14, description: "", range: "short", learnLevel: 10 }),
  m({ id: "shelter", name: "Shelter", type: "steel", power: 0, accuracy: 7, description: "", range: "melee", learnLevel: 3 }),
  m({ id: "triple-arrows", name: "Triple Arrows", type: "fighting", power: 90, accuracy: 14, description: "", range: "long", learnLevel: 35 }),
  m({ id: "infernal-parade", name: "Infernal Parade", type: "ghost", power: 60, accuracy: 14, description: "", range: "short", learnLevel: 10 }),
  m({ id: "ceaseless-edge", name: "Ceaseless Edge", type: "dark", power: 65, accuracy: 13, description: "", range: "short", learnLevel: 13 }),
  m({ id: "bleakwind-storm", name: "Bleakwind Storm", type: "flying", power: 100, accuracy: 11, description: "", range: "long", learnLevel: 45 }),
  m({ id: "wildbolt-storm", name: "Wildbolt Storm", type: "electric", power: 100, accuracy: 11, description: "", range: "long", learnLevel: 30 }),
  m({ id: "sandsear-storm", name: "Sandsear Storm", type: "ground", power: 100, accuracy: 11, description: "", range: "long", learnLevel: 46 }),
  m({ id: "lunar-blessing", name: "Lunar Blessing", type: "psychic", power: 0, accuracy: 7, description: "", range: "melee", learnLevel: 9 }),
  m({ id: "take-heart", name: "Take Heart", type: "psychic", power: 0, accuracy: 7, description: "", range: "melee", learnLevel: 4 }),
  m({ id: "tera-blast", name: "Tera Blast", type: "normal", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 21 }),
  m({ id: "silk-trap", name: "Silk Trap", type: "bug", power: 0, accuracy: 7, description: "", range: "melee", learnLevel: 4 }),
  m({ id: "axe-kick", name: "Axe Kick", type: "fighting", power: 120, accuracy: 13, description: "", range: "long", learnLevel: 33 }),
  m({ id: "last-respects", name: "Last Respects", type: "ghost", power: 50, accuracy: 14, description: "", range: "short", learnLevel: 14 }),
  m({ id: "lumina-crash", name: "Lumina Crash", type: "psychic", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 23 }),
  m({ id: "order-up", name: "Order Up", type: "dragon", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 12 }),
  m({ id: "jet-punch", name: "Jet Punch", type: "water", power: 60, accuracy: 14, description: "", range: "short", learnLevel: 18 }),
  m({ id: "spicy-extract", name: "Spicy Extract", type: "grass", power: 0, accuracy: 7, description: "", range: "melee", learnLevel: 6 }),
  m({ id: "spin-out", name: "Spin Out", type: "steel", power: 100, accuracy: 14, description: "", range: "long", learnLevel: 37 }),
  m({ id: "population-bomb", name: "Population Bomb", type: "normal", power: 20, accuracy: 13, description: "", range: "melee", learnLevel: 4 }),
  m({ id: "ice-spinner", name: "Ice Spinner", type: "ice", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 14 }),
  m({ id: "glaive-rush", name: "Glaive Rush", type: "dragon", power: 120, accuracy: 14, description: "", range: "long", learnLevel: 38 }),
  m({ id: "revival-blessing", name: "Revival Blessing", type: "normal", power: 0, accuracy: 7, description: "", range: "melee", learnLevel: 9 }),
  m({ id: "salt-cure", name: "Salt Cure", type: "rock", power: 40, accuracy: 14, description: "", range: "melee", learnLevel: 4 }),
  m({ id: "triple-dive", name: "Triple Dive", type: "water", power: 30, accuracy: 13, description: "", range: "melee", learnLevel: 8 }),
  m({ id: "mortal-spin", name: "Mortal Spin", type: "poison", power: 30, accuracy: 14, description: "", range: "melee", learnLevel: 10 }),
  m({ id: "doodle", name: "Doodle", type: "normal", power: 0, accuracy: 14, description: "", range: "melee", learnLevel: 3 }),
  m({ id: "fillet-away", name: "Fillet Away", type: "normal", power: 0, accuracy: 7, description: "", range: "melee", learnLevel: 1 }),
  m({ id: "kowtow-cleave", name: "Kowtow Cleave", type: "dark", power: 85, accuracy: 7, description: "", range: "long", learnLevel: 35 }),
  m({ id: "flower-trick", name: "Flower Trick", type: "grass", power: 70, accuracy: 7, description: "", range: "short", learnLevel: 24 }),
  m({ id: "torch-song", name: "Torch Song", type: "fire", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 15 }),
  m({ id: "aqua-step", name: "Aqua Step", type: "water", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 24 }),
  m({ id: "raging-bull", name: "Raging Bull", type: "normal", power: 90, accuracy: 14, description: "", range: "long", learnLevel: 41 }),
  m({ id: "make-it-rain", name: "Make It Rain", type: "steel", power: 120, accuracy: 14, description: "", range: "long", learnLevel: 47 }),
  m({ id: "psyblade", name: "Psyblade", type: "psychic", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 13 }),
  m({ id: "hydro-steam", name: "Hydro Steam", type: "water", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 16 }),
  m({ id: "ruination", name: "Ruination", type: "dark", power: 1, accuracy: 13, description: "", range: "melee", learnLevel: 6 }),
  m({ id: "collision-course", name: "Collision Course", type: "fighting", power: 100, accuracy: 14, description: "", range: "long", learnLevel: 49 }),
  m({ id: "electro-drift", name: "Electro Drift", type: "electric", power: 100, accuracy: 14, description: "", range: "long", learnLevel: 47 }),
  m({ id: "shed-tail", name: "Shed Tail", type: "normal", power: 0, accuracy: 7, description: "", range: "melee", learnLevel: 3 }),
  m({ id: "chilly-reception", name: "Chilly Reception", type: "ice", power: 0, accuracy: 7, description: "", range: "melee", learnLevel: 7 }),
  m({ id: "tidy-up", name: "Tidy Up", type: "normal", power: 0, accuracy: 7, description: "", range: "melee", learnLevel: 4 }),
  m({ id: "snowscape", name: "Snowscape", type: "ice", power: 0, accuracy: 7, description: "", range: "melee", learnLevel: 2 }),
  m({ id: "pounce", name: "Pounce", type: "bug", power: 50, accuracy: 14, description: "", range: "short", learnLevel: 11 }),
  m({ id: "trailblaze", name: "Trailblaze", type: "grass", power: 50, accuracy: 14, description: "", range: "short", learnLevel: 13 }),
  m({ id: "chilling-water", name: "Chilling Water", type: "water", power: 50, accuracy: 14, description: "", range: "short", learnLevel: 25 }),
  m({ id: "hyper-drill", name: "Hyper Drill", type: "normal", power: 100, accuracy: 14, description: "", range: "long", learnLevel: 35 }),
  m({ id: "twin-beam", name: "Twin Beam", type: "psychic", power: 40, accuracy: 14, description: "", range: "melee", learnLevel: 9 }),
  m({ id: "rage-fist", name: "Rage Fist", type: "ghost", power: 50, accuracy: 14, description: "", range: "short", learnLevel: 19 }),
  m({ id: "armor-cannon", name: "Armor Cannon", type: "fire", power: 120, accuracy: 14, description: "", range: "long", learnLevel: 43 }),
  m({ id: "bitter-blade", name: "Bitter Blade", type: "fire", power: 90, accuracy: 14, description: "", range: "long", learnLevel: 39 }),
  m({ id: "double-shock", name: "Double Shock", type: "electric", power: 120, accuracy: 14, description: "", range: "long", learnLevel: 34 }),
  m({ id: "gigaton-hammer", name: "Gigaton Hammer", type: "steel", power: 160, accuracy: 14, description: "", range: "long", learnLevel: 31 }),
  m({ id: "comeuppance", name: "Comeuppance", type: "dark", power: 1, accuracy: 14, description: "", range: "melee", learnLevel: 10 }),
  m({ id: "aqua-cutter", name: "Aqua Cutter", type: "water", power: 70, accuracy: 14, description: "", range: "short", learnLevel: 14 }),
  m({ id: "blazing-torque", name: "Blazing Torque", type: "fire", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 24 }),
  m({ id: "wicked-torque", name: "Wicked Torque", type: "dark", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 15 }),
  m({ id: "noxious-torque", name: "Noxious Torque", type: "poison", power: 100, accuracy: 14, description: "", range: "long", learnLevel: 48 }),
  m({ id: "combat-torque", name: "Combat Torque", type: "fighting", power: 100, accuracy: 14, description: "", range: "long", learnLevel: 45 }),
  m({ id: "magical-torque", name: "Magical Torque", type: "fairy", power: 100, accuracy: 14, description: "", range: "long", learnLevel: 50 }),
  m({ id: "blood-moon", name: "Blood Moon", type: "normal", power: 140, accuracy: 14, description: "", range: "long", learnLevel: 44 }),
  m({ id: "matcha-gotcha", name: "Matcha Gotcha", type: "grass", power: 80, accuracy: 13, description: "", range: "short", learnLevel: 23 }),
  m({ id: "syrup-bomb", name: "Syrup Bomb", type: "grass", power: 60, accuracy: 12, description: "", range: "short", learnLevel: 25 }),
  m({ id: "ivy-cudgel", name: "Ivy Cudgel", type: "grass", power: 100, accuracy: 14, description: "", range: "long", learnLevel: 42 }),
  m({ id: "electro-shot", name: "Electro Shot", type: "electric", power: 130, accuracy: 14, description: "", range: "long", learnLevel: 35 }),
  m({ id: "tera-starstorm", name: "Tera Starstorm", type: "normal", power: 120, accuracy: 14, description: "", range: "long", learnLevel: 30 }),
  m({ id: "fickle-beam", name: "Fickle Beam", type: "dragon", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 18 }),
  m({ id: "burning-bulwark", name: "Burning Bulwark", type: "fire", power: 0, accuracy: 1, description: "", range: "melee", learnLevel: 10 }),
  m({ id: "thunderclap", name: "Thunderclap", type: "electric", power: 70, accuracy: 14, description: "", range: "short", learnLevel: 24 }),
  m({ id: "mighty-cleave", name: "Mighty Cleave", type: "rock", power: 95, accuracy: 14, description: "", range: "long", learnLevel: 44 }),
  m({ id: "tachyon-cutter", name: "Tachyon Cutter", type: "steel", power: 50, accuracy: 1, description: "", range: "short", learnLevel: 13 }),
  m({ id: "hard-press", name: "Hard Press", type: "steel", power: 0, accuracy: 14, description: "", range: "melee", learnLevel: 9 }),
  m({ id: "dragon-cheer", name: "Dragon Cheer", type: "dragon", power: 0, accuracy: 1, description: "", range: "melee", learnLevel: 1 }),
  m({ id: "alluring-voice", name: "Alluring Voice", type: "fairy", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 12 }),
  m({ id: "temper-flare", name: "Temper Flare", type: "fire", power: 75, accuracy: 14, description: "", range: "short", learnLevel: 25 }),
  m({ id: "supercell-slam", name: "Supercell Slam", type: "electric", power: 100, accuracy: 13, description: "", range: "long", learnLevel: 47 }),
  m({ id: "psychic-noise", name: "Psychic Noise", type: "psychic", power: 75, accuracy: 14, description: "", range: "short", learnLevel: 25 }),
  m({ id: "upper-hand", name: "Upper Hand", type: "fighting", power: 65, accuracy: 14, description: "", range: "short", learnLevel: 14 }),
  m({ id: "malignant-chain", name: "Malignant Chain", type: "poison", power: 100, accuracy: 14, description: "", range: "long", learnLevel: 39 }),
  m({ id: "shadow-rush", name: "Shadow Rush", type: "shadow", power: 55, accuracy: 14, description: "", range: "short", learnLevel: 11 }),
  m({ id: "shadow-blast", name: "Shadow Blast", type: "shadow", power: 80, accuracy: 14, description: "", range: "short", learnLevel: 14 }),
  m({ id: "shadow-blitz", name: "Shadow Blitz", type: "shadow", power: 40, accuracy: 14, description: "", range: "melee", learnLevel: 6 }),
  m({ id: "shadow-bolt", name: "Shadow Bolt", type: "shadow", power: 75, accuracy: 14, description: "", range: "short", learnLevel: 22 }),
  m({ id: "shadow-break", name: "Shadow Break", type: "shadow", power: 75, accuracy: 14, description: "", range: "short", learnLevel: 24 }),
  m({ id: "shadow-chill", name: "Shadow Chill", type: "shadow", power: 75, accuracy: 14, description: "", range: "short", learnLevel: 17 }),
  m({ id: "shadow-end", name: "Shadow End", type: "shadow", power: 120, accuracy: 8, description: "", range: "long", learnLevel: 41 }),
  m({ id: "shadow-fire", name: "Shadow Fire", type: "shadow", power: 75, accuracy: 14, description: "", range: "short", learnLevel: 13 }),
  m({ id: "shadow-rave", name: "Shadow Rave", type: "shadow", power: 70, accuracy: 14, description: "", range: "short", learnLevel: 14 }),
  m({ id: "shadow-storm", name: "Shadow Storm", type: "shadow", power: 95, accuracy: 14, description: "", range: "long", learnLevel: 32 }),
  m({ id: "shadow-wave", name: "Shadow Wave", type: "shadow", power: 50, accuracy: 14, description: "", range: "short", learnLevel: 21 }),
];


// Helper to get move by ID
export function getMove(id: string): Move | undefined {
  return MOVES.find((m) => m.id === id);
}

// [id, name, types[], baseHp, startingMoves[], learnableMoves[]]
type PokemonRaw = [number, string, PokemonType[], number, string[], string[]];

const RAW_POKEMON: PokemonRaw[] = [
  [1, "Bulbasaur", ["grass", "poison"], 45, ["tackle", "growl"], ["vine-whip", "razor-leaf", "leech-seed", "solar-beam", "sludge"]],
  [2, "Ivysaur", ["grass", "poison"], 60, ["tackle", "vine-whip", "growl"], ["razor-leaf", "leech-seed", "solar-beam", "sludge"]],
  [3, "Venusaur", ["grass", "poison"], 80, ["vine-whip", "razor-leaf", "growl"], ["solar-beam", "sludge", "petal-dance", "hyper-beam"]],
  [4, "Charmander", ["fire"], 39, ["scratch", "growl"], ["ember", "flamethrower", "fire-blast", "slash", "rage"]],
  [5, "Charmeleon", ["fire"], 58, ["scratch", "ember", "growl"], ["flamethrower", "fire-blast", "slash", "rage"]],
  [6, "Charizard", ["fire", "flying"], 78, ["scratch", "ember", "flamethrower"], ["fire-blast", "fly", "hyper-beam", "slash"]],
  [7, "Squirtle", ["water"], 44, ["tackle", "tail-whip"], ["water-gun", "bubble", "bite", "surf", "hydro-pump"]],
  [8, "Wartortle", ["water"], 59, ["tackle", "water-gun", "tail-whip"], ["bite", "surf", "hydro-pump", "ice-beam"]],
  [9, "Blastoise", ["water"], 79, ["water-gun", "bite", "tail-whip"], ["surf", "hydro-pump", "ice-beam", "hyper-beam"]],
  [10, "Caterpie", ["bug"], 45, ["tackle", "string-shot"], ["bug-bite"]],
  [11, "Metapod", ["bug"], 50, ["tackle", "harden"], ["string-shot"]],
  [12, "Butterfree", ["bug", "flying"], 60, ["confusion", "gust"], ["psybeam", "sleep-powder", "stun-spore", "psychic"]],
  [13, "Weedle", ["bug", "poison"], 40, ["poison-sting", "string-shot"], ["bug-bite"]],
  [14, "Kakuna", ["bug", "poison"], 45, ["poison-sting", "harden"], ["string-shot"]],
  [15, "Beedrill", ["bug", "poison"], 65, ["fury-attack", "twineedle"], ["pin-missile", "rage", "sludge", "agility"]],
  [16, "Pidgey", ["normal", "flying"], 40, ["tackle", "gust"], ["quick-attack", "wing-attack", "fly"]],
  [17, "Pidgeotto", ["normal", "flying"], 63, ["tackle", "gust", "quick-attack"], ["wing-attack", "fly"]],
  [18, "Pidgeot", ["normal", "flying"], 83, ["gust", "quick-attack", "wing-attack"], ["fly", "hyper-beam", "sky-attack"]],
  [19, "Rattata", ["normal"], 30, ["tackle", "tail-whip"], ["quick-attack", "bite", "super-fang", "hyper-beam"]],
  [20, "Raticate", ["normal"], 55, ["tackle", "quick-attack", "bite"], ["super-fang", "hyper-beam", "body-slam"]],
  [21, "Spearow", ["normal", "flying"], 40, ["peck", "growl"], ["fury-attack", "drill-peck", "fly"]],
  [22, "Fearow", ["normal", "flying"], 65, ["peck", "fury-attack", "drill-peck"], ["fly", "hyper-beam", "sky-attack"]],
  [23, "Ekans", ["poison"], 35, ["wrap", "leer"], ["poison-sting", "bite", "acid", "sludge"]],
  [24, "Arbok", ["poison"], 60, ["wrap", "poison-sting", "bite"], ["acid", "sludge", "earthquake", "hyper-beam"]],
  [25, "Pikachu", ["electric"], 35, ["thunder-shock", "growl"], ["thunderbolt", "thunder", "quick-attack", "agility", "slam"]],
  [26, "Raichu", ["electric"], 60, ["thunder-shock", "thunderbolt", "quick-attack"], ["thunder", "body-slam", "hyper-beam"]],
  [27, "Sandshrew", ["ground"], 50, ["scratch", "sand-attack"], ["slash", "dig", "earthquake", "fury-swipes"]],
  [28, "Sandslash", ["ground"], 75, ["scratch", "sand-attack", "slash"], ["dig", "earthquake", "fury-swipes", "hyper-beam"]],
  [29, "Nidoran F", ["poison"], 55, ["tackle", "growl"], ["scratch", "poison-sting", "bite", "double-kick"]],
  [30, "Nidorina", ["poison"], 70, ["tackle", "scratch", "poison-sting"], ["bite", "double-kick", "body-slam"]],
  [31, "Nidoqueen", ["poison", "ground"], 90, ["scratch", "poison-sting", "body-slam"], ["earthquake", "surf", "ice-beam", "hyper-beam"]],
  [32, "Nidoran M", ["poison"], 46, ["leer", "tackle"], ["horn-attack", "poison-sting", "double-kick", "fury-attack"]],
  [33, "Nidorino", ["poison"], 61, ["leer", "horn-attack", "poison-sting"], ["double-kick", "fury-attack", "body-slam"]],
  [34, "Nidoking", ["poison", "ground"], 81, ["horn-attack", "poison-sting", "body-slam"], ["earthquake", "surf", "ice-beam", "hyper-beam", "fire-blast"]],
  [35, "Clefairy", ["normal"], 70, ["pound", "growl"], ["sing", "defense-curl", "mega-punch", "body-slam", "psychic"]],
  [36, "Clefable", ["normal"], 95, ["pound", "sing", "mega-punch"], ["body-slam", "psychic", "hyper-beam", "ice-beam"]],
  [37, "Vulpix", ["fire"], 38, ["ember", "tail-whip"], ["quick-attack", "fire-spin", "flamethrower", "confuse-ray"]],
  [38, "Ninetales", ["fire"], 73, ["ember", "quick-attack", "flamethrower"], ["fire-blast", "fire-spin", "confuse-ray", "hyper-beam"]],
  [39, "Jigglypuff", ["normal"], 115, ["sing", "pound"], ["defense-curl", "body-slam", "psychic", "hyper-beam"]],
  [40, "Wigglytuff", ["normal"], 140, ["sing", "pound", "body-slam"], ["psychic", "hyper-beam", "ice-beam"]],
  [41, "Zubat", ["poison", "flying"], 40, ["leech-life", "bite"], ["wing-attack", "confuse-ray", "swift"]],
  [42, "Golbat", ["poison", "flying"], 75, ["leech-life", "bite", "wing-attack"], ["confuse-ray", "swift", "hyper-beam"]],
  [43, "Oddish", ["grass", "poison"], 45, ["absorb", "growl"], ["acid", "stun-spore", "sleep-powder", "mega-drain", "petal-dance"]],
  [44, "Gloom", ["grass", "poison"], 60, ["absorb", "acid", "stun-spore"], ["sleep-powder", "mega-drain", "petal-dance", "solar-beam"]],
  [45, "Vileplume", ["grass", "poison"], 75, ["acid", "mega-drain", "stun-spore"], ["petal-dance", "solar-beam", "hyper-beam"]],
  [46, "Paras", ["bug", "grass"], 35, ["scratch", "leech-life"], ["stun-spore", "slash", "mega-drain"]],
  [47, "Parasect", ["bug", "grass"], 60, ["scratch", "leech-life", "stun-spore"], ["slash", "mega-drain", "solar-beam"]],
  [48, "Venonat", ["bug", "poison"], 60, ["tackle", "confusion"], ["poison-sting", "leech-life", "psybeam", "psychic"]],
  [49, "Venomoth", ["bug", "poison"], 70, ["confusion", "poison-sting", "leech-life"], ["psybeam", "psychic", "sleep-powder", "stun-spore"]],
  [50, "Diglett", ["ground"], 10, ["scratch", "sand-attack"], ["dig", "slash", "earthquake"]],
  [51, "Dugtrio", ["ground"], 35, ["scratch", "sand-attack", "dig"], ["slash", "earthquake", "fissure"]],
  [52, "Meowth", ["normal"], 40, ["scratch", "growl"], ["bite", "pay-day", "slash", "fury-swipes"]],
  [53, "Persian", ["normal"], 65, ["scratch", "bite", "pay-day"], ["slash", "fury-swipes", "hyper-beam"]],
  [54, "Psyduck", ["water"], 50, ["scratch", "confusion"], ["water-gun", "fury-swipes", "hydro-pump", "psychic"]],
  [55, "Golduck", ["water"], 80, ["scratch", "confusion", "water-gun"], ["surf", "hydro-pump", "psychic", "hyper-beam"]],
  [56, "Mankey", ["fighting"], 40, ["scratch", "leer"], ["low-kick", "karate-chop", "fury-swipes", "seismic-toss"]],
  [57, "Primeape", ["fighting"], 65, ["scratch", "low-kick", "karate-chop"], ["fury-swipes", "seismic-toss", "submission", "hyper-beam"]],
  [58, "Growlithe", ["fire"], 55, ["bite", "ember"], ["leer", "take-down", "flamethrower", "fire-blast", "agility"]],
  [59, "Arcanine", ["fire"], 90, ["bite", "ember", "take-down", "flamethrower"], ["fire-blast", "hyper-beam"]],
  [60, "Poliwag", ["water"], 40, ["bubble", "hypnosis"], ["water-gun", "body-slam", "surf"]],
  [61, "Poliwhirl", ["water"], 65, ["bubble", "hypnosis", "water-gun"], ["body-slam", "surf", "ice-beam"]],
  [62, "Poliwrath", ["water", "fighting"], 90, ["water-gun", "hypnosis", "body-slam"], ["surf", "submission", "ice-beam", "hyper-beam"]],
  [63, "Abra", ["psychic"], 25, ["teleport"], ["confusion", "psychic", "thunder-wave"]],
  [64, "Kadabra", ["psychic"], 40, ["teleport", "confusion"], ["psychic", "psybeam", "thunder-wave"]],
  [65, "Alakazam", ["psychic"], 55, ["confusion", "psychic", "psybeam"], ["dream-eater", "thunder-wave", "hyper-beam"]],
  [66, "Machop", ["fighting"], 70, ["low-kick", "leer"], ["karate-chop", "seismic-toss", "submission"]],
  [67, "Machoke", ["fighting"], 80, ["low-kick", "karate-chop", "leer"], ["seismic-toss", "submission", "earthquake"]],
  [68, "Machamp", ["fighting"], 90, ["low-kick", "karate-chop", "seismic-toss"], ["submission", "earthquake", "hyper-beam"]],
  [69, "Bellsprout", ["grass", "poison"], 50, ["vine-whip", "growl"], ["wrap", "acid", "razor-leaf", "sleep-powder", "slam"]],
  [70, "Weepinbell", ["grass", "poison"], 65, ["vine-whip", "wrap", "acid"], ["razor-leaf", "sleep-powder", "slam"]],
  [71, "Victreebel", ["grass", "poison"], 80, ["vine-whip", "acid", "razor-leaf"], ["sleep-powder", "slam", "solar-beam", "hyper-beam"]],
  [72, "Tentacool", ["water", "poison"], 40, ["poison-sting", "acid"], ["wrap", "water-gun", "surf", "hydro-pump"]],
  [73, "Tentacruel", ["water", "poison"], 80, ["poison-sting", "acid", "wrap"], ["surf", "hydro-pump", "sludge", "hyper-beam"]],
  [74, "Geodude", ["rock", "ground"], 40, ["tackle", "defense-curl"], ["rock-throw", "self-destruct", "earthquake"]],
  [75, "Graveler", ["rock", "ground"], 55, ["tackle", "rock-throw", "defense-curl"], ["self-destruct", "earthquake", "explosion"]],
  [76, "Golem", ["rock", "ground"], 80, ["tackle", "rock-throw", "self-destruct"], ["earthquake", "explosion", "hyper-beam"]],
  [77, "Ponyta", ["fire"], 50, ["ember", "tail-whip"], ["take-down", "fire-spin", "agility", "flamethrower"]],
  [78, "Rapidash", ["fire"], 65, ["ember", "take-down", "fire-spin"], ["agility", "flamethrower", "fire-blast", "hyper-beam"]],
  [79, "Slowpoke", ["water", "psychic"], 90, ["confusion", "tackle"], ["water-gun", "headbutt", "surf", "psychic", "amnesia"]],
  [80, "Slowbro", ["water", "psychic"], 95, ["confusion", "water-gun", "headbutt"], ["surf", "psychic", "amnesia", "hyper-beam"]],
  [81, "Magnemite", ["electric"], 25, ["tackle", "thunder-shock"], ["thunderbolt", "thunder", "swift"]],
  [82, "Magneton", ["electric"], 50, ["tackle", "thunder-shock", "thunderbolt"], ["thunder", "swift", "hyper-beam"]],
  [83, "Farfetch'd", ["normal", "flying"], 52, ["peck", "sand-attack"], ["slash", "fury-attack", "fly"]],
  [84, "Doduo", ["normal", "flying"], 35, ["peck", "growl"], ["fury-attack", "drill-peck", "rage"]],
  [85, "Dodrio", ["normal", "flying"], 60, ["peck", "fury-attack", "drill-peck"], ["rage", "fly", "hyper-beam"]],
  [86, "Seel", ["water"], 65, ["headbutt", "growl"], ["aurora-beam", "ice-beam", "surf"]],
  [87, "Dewgong", ["water", "ice"], 90, ["headbutt", "aurora-beam", "ice-beam"], ["surf", "blizzard", "hyper-beam"]],
  [88, "Grimer", ["poison"], 80, ["pound", "poison-gas"], ["sludge", "acid", "screech", "self-destruct"]],
  [89, "Muk", ["poison"], 105, ["pound", "sludge", "poison-gas"], ["acid", "screech", "self-destruct", "hyper-beam"]],
  [90, "Shellder", ["water"], 30, ["tackle", "withdraw"], ["clamp", "ice-beam", "aurora-beam"]],
  [91, "Cloyster", ["water", "ice"], 50, ["tackle", "clamp", "aurora-beam"], ["ice-beam", "blizzard", "hyper-beam", "explosion"]],
  [92, "Gastly", ["ghost", "poison"], 30, ["lick", "confuse-ray"], ["night-shade", "hypnosis", "dream-eater"]],
  [93, "Haunter", ["ghost", "poison"], 45, ["lick", "confuse-ray", "night-shade"], ["hypnosis", "dream-eater", "sludge"]],
  [94, "Gengar", ["ghost", "poison"], 60, ["lick", "night-shade", "confuse-ray"], ["hypnosis", "dream-eater", "sludge", "psychic", "hyper-beam"]],
  [95, "Onix", ["rock", "ground"], 35, ["tackle", "screech"], ["rock-throw", "slam", "earthquake", "rock-slide"]],
  [96, "Drowzee", ["psychic"], 60, ["pound", "hypnosis"], ["confusion", "headbutt", "psybeam", "psychic"]],
  [97, "Hypno", ["psychic"], 85, ["pound", "hypnosis", "confusion"], ["headbutt", "psybeam", "psychic", "dream-eater"]],
  [98, "Krabby", ["water"], 30, ["bubble", "leer"], ["vice-grip", "slam", "crabhammer", "surf"]],
  [99, "Kingler", ["water"], 55, ["bubble", "slam", "crabhammer"], ["surf", "hyper-beam"]],
  [100, "Voltorb", ["electric"], 40, ["tackle", "screech"], ["thunder-shock", "self-destruct", "thunderbolt", "explosion"]],
  [101, "Electrode", ["electric"], 60, ["tackle", "thunder-shock", "screech"], ["self-destruct", "thunderbolt", "thunder", "explosion", "hyper-beam"]],
  [102, "Exeggcute", ["grass", "psychic"], 60, ["barrage", "hypnosis"], ["confusion", "leech-seed", "stun-spore", "solar-beam"]],
  [103, "Exeggutor", ["grass", "psychic"], 95, ["barrage", "confusion", "hypnosis"], ["psychic", "solar-beam", "mega-drain", "hyper-beam"]],
  [104, "Cubone", ["ground"], 50, ["bone-club", "growl"], ["leer", "headbutt", "bonemerang", "rage"]],
  [105, "Marowak", ["ground"], 60, ["bone-club", "headbutt", "leer"], ["bonemerang", "earthquake", "rage", "hyper-beam"]],
  [106, "Hitmonlee", ["fighting"], 50, ["double-kick", "meditate"], ["high-jump-kick", "low-kick", "mega-kick", "submission"]],
  [107, "Hitmonchan", ["fighting"], 50, ["comet-punch", "agility"], ["fire-punch", "ice-punch", "thunder-punch", "mega-punch", "submission"]],
  [108, "Lickitung", ["normal"], 90, ["wrap", "lick"], ["slam", "body-slam", "screech", "hyper-beam"]],
  [109, "Koffing", ["poison"], 40, ["tackle", "smog"], ["sludge", "self-destruct", "explosion", "toxic"]],
  [110, "Weezing", ["poison"], 65, ["tackle", "smog", "sludge"], ["self-destruct", "explosion", "toxic", "hyper-beam"]],
  [111, "Rhyhorn", ["ground", "rock"], 80, ["horn-attack", "tail-whip"], ["take-down", "rock-throw", "earthquake"]],
  [112, "Rhydon", ["ground", "rock"], 105, ["horn-attack", "take-down", "rock-throw"], ["earthquake", "rock-slide", "hyper-beam", "surf"]],
  [113, "Chansey", ["normal"], 250, ["pound", "growl"], ["sing", "defense-curl", "body-slam", "ice-beam", "psychic"]],
  [114, "Tangela", ["grass"], 65, ["vine-whip", "bind"], ["absorb", "mega-drain", "stun-spore", "sleep-powder", "solar-beam"]],
  [115, "Kangaskhan", ["normal"], 105, ["comet-punch", "rage"], ["bite", "mega-punch", "body-slam", "earthquake", "hyper-beam"]],
  [116, "Horsea", ["water"], 30, ["bubble", "leer"], ["water-gun", "smokescreen", "hydro-pump", "agility"]],
  [117, "Seadra", ["water"], 55, ["bubble", "water-gun", "leer"], ["hydro-pump", "agility", "ice-beam", "hyper-beam"]],
  [118, "Goldeen", ["water"], 45, ["peck", "tail-whip"], ["horn-attack", "fury-attack", "surf", "waterfall"]],
  [119, "Seaking", ["water"], 80, ["peck", "horn-attack", "fury-attack"], ["surf", "waterfall", "hyper-beam"]],
  [120, "Staryu", ["water"], 30, ["tackle", "water-gun"], ["swift", "bubble-beam", "surf", "psychic"]],
  [121, "Starmie", ["water", "psychic"], 60, ["tackle", "water-gun", "swift"], ["bubble-beam", "surf", "psychic", "ice-beam", "hyper-beam"]],
  [122, "Mr. Mime", ["psychic"], 40, ["confusion", "barrier"], ["psybeam", "psychic", "meditate", "body-slam"]],
  [123, "Scyther", ["bug", "flying"], 70, ["quick-attack", "leer"], ["fury-attack", "slash", "wing-attack", "agility", "fly"]],
  [124, "Jynx", ["ice", "psychic"], 65, ["pound", "ice-punch"], ["confusion", "psychic", "blizzard", "body-slam"]],
  [125, "Electabuzz", ["electric"], 65, ["quick-attack", "thunder-shock"], ["thunderbolt", "thunder", "thunder-punch", "screech", "psychic"]],
  [126, "Magmar", ["fire"], 65, ["ember", "leer"], ["fire-punch", "flamethrower", "fire-blast", "smog", "psychic"]],
  [127, "Pinsir", ["bug"], 65, ["bite", "harden"], ["seismic-toss", "slash", "submission"]],
  [128, "Tauros", ["normal"], 75, ["tackle", "tail-whip"], ["horn-attack", "rage", "take-down", "body-slam", "earthquake", "hyper-beam"]],
  [129, "Magikarp", ["water"], 20, ["tackle"], ["splash"]],
  [130, "Gyarados", ["water", "flying"], 95, ["bite", "tackle"], ["hydro-pump", "surf", "hyper-beam", "dragon-rage", "body-slam"]],
  [131, "Lapras", ["water", "ice"], 130, ["water-gun", "body-slam"], ["surf", "ice-beam", "blizzard", "psychic", "hydro-pump", "confuse-ray"]],
  [132, "Ditto", ["normal"], 48, ["tackle"], ["slam"]],
  [133, "Eevee", ["normal"], 55, ["tackle", "tail-whip", "sand-attack"], ["quick-attack", "bite", "take-down"]],
  [134, "Vaporeon", ["water"], 130, ["tackle", "water-gun", "sand-attack"], ["bite", "surf", "hydro-pump", "ice-beam", "aurora-beam"]],
  [135, "Jolteon", ["electric"], 65, ["tackle", "thunder-shock", "sand-attack"], ["thunderbolt", "thunder", "quick-attack", "pin-missile", "agility"]],
  [136, "Flareon", ["fire"], 65, ["tackle", "ember", "sand-attack"], ["bite", "flamethrower", "fire-blast", "quick-attack"]],
  [137, "Porygon", ["normal"], 65, ["tackle", "agility"], ["psybeam", "tri-attack", "psychic", "thunderbolt", "ice-beam"]],
  [138, "Omanyte", ["rock", "water"], 35, ["water-gun", "withdraw"], ["bite", "surf", "hydro-pump"]],
  [139, "Omastar", ["rock", "water"], 70, ["water-gun", "bite", "withdraw"], ["surf", "hydro-pump", "ice-beam", "hyper-beam"]],
  [140, "Kabuto", ["rock", "water"], 30, ["scratch", "harden"], ["absorb", "slash", "surf"]],
  [141, "Kabutops", ["rock", "water"], 60, ["scratch", "absorb", "slash"], ["surf", "hydro-pump", "hyper-beam"]],
  [142, "Aerodactyl", ["rock", "flying"], 80, ["wing-attack", "bite"], ["fly", "hyper-beam", "take-down", "sky-attack"]],
  [143, "Snorlax", ["normal"], 160, ["headbutt", "body-slam"], ["hyper-beam", "earthquake", "ice-beam", "surf", "amnesia", "self-destruct"]],
  [144, "Articuno", ["ice", "flying"], 90, ["peck", "ice-beam"], ["blizzard", "fly", "agility", "hyper-beam"]],
  [145, "Zapdos", ["electric", "flying"], 90, ["peck", "thunderbolt"], ["thunder", "drill-peck", "fly", "agility", "hyper-beam"]],
  [146, "Moltres", ["fire", "flying"], 90, ["peck", "flamethrower"], ["fire-blast", "fly", "agility", "hyper-beam", "sky-attack"]],
  [147, "Dratini", ["dragon"], 41, ["wrap", "leer"], ["thunder-wave", "slam", "dragon-rage", "agility"]],
  [148, "Dragonair", ["dragon"], 61, ["wrap", "thunder-wave", "slam"], ["dragon-rage", "agility", "hyper-beam"]],
  [149, "Dragonite", ["dragon", "flying"], 91, ["wrap", "slam", "dragon-rage"], ["agility", "hyper-beam", "surf", "ice-beam", "thunderbolt", "fire-blast"]],
  [150, "Mewtwo", ["psychic"], 106, ["confusion", "psychic", "barrier"], ["psybeam", "hyper-beam", "ice-beam", "thunderbolt", "fire-blast", "amnesia"]],
  [151, "Mew", ["psychic"], 100, ["pound", "psychic"], ["confusion", "psybeam", "hyper-beam", "ice-beam", "thunderbolt", "fire-blast", "surf", "earthquake", "solar-beam"]],
  // Generation 2 (152-251)
  [152, "Chikorita", ["grass"], 45, ["tackle", "growl"], ["razor-leaf", "vine-whip", "body-slam", "giga-drain", "solar-beam"]],
  [153, "Bayleef", ["grass"], 60, ["tackle", "razor-leaf", "growl"], ["vine-whip", "body-slam", "giga-drain", "solar-beam"]],
  [154, "Meganium", ["grass"], 80, ["razor-leaf", "body-slam", "giga-drain"], ["solar-beam", "petal-dance", "earthquake", "hyper-beam"]],
  [155, "Cyndaquil", ["fire"], 39, ["tackle", "leer"], ["ember", "flame-wheel", "flamethrower", "quick-attack"]],
  [156, "Quilava", ["fire"], 58, ["tackle", "ember", "leer"], ["flame-wheel", "flamethrower", "fire-blast", "quick-attack"]],
  [157, "Typhlosion", ["fire"], 78, ["ember", "flame-wheel", "flamethrower"], ["fire-blast", "thunder-punch", "hyper-beam", "earthquake"]],
  [158, "Totodile", ["water"], 50, ["scratch", "leer"], ["water-gun", "bite", "slash", "surf"]],
  [159, "Croconaw", ["water"], 65, ["scratch", "water-gun", "bite"], ["slash", "surf", "ice-punch", "crunch"]],
  [160, "Feraligatr", ["water"], 85, ["water-gun", "bite", "slash"], ["surf", "hydro-pump", "ice-punch", "crunch", "hyper-beam", "earthquake"]],
  [161, "Sentret", ["normal"], 35, ["tackle", "defense-curl"], ["quick-attack", "fury-swipes", "slam"]],
  [162, "Furret", ["normal"], 85, ["tackle", "quick-attack", "fury-swipes"], ["slam", "body-slam", "surf", "hyper-beam"]],
  [163, "Hoothoot", ["normal", "flying"], 60, ["tackle", "growl"], ["peck", "confusion", "hypnosis", "dream-eater"]],
  [164, "Noctowl", ["normal", "flying"], 100, ["tackle", "peck", "confusion"], ["hypnosis", "dream-eater", "psychic", "hyper-beam"]],
  [165, "Ledyba", ["bug", "flying"], 40, ["tackle", "agility"], ["swift", "comet-punch", "gust"]],
  [166, "Ledian", ["bug", "flying"], 55, ["tackle", "swift", "comet-punch"], ["agility", "gust", "ice-punch", "thunder-punch"]],
  [167, "Spinarak", ["bug", "poison"], 40, ["poison-sting", "string-shot"], ["leech-life", "night-shade", "psychic"]],
  [168, "Ariados", ["bug", "poison"], 70, ["poison-sting", "leech-life", "night-shade"], ["psychic", "sludge-bomb", "agility"]],
  [169, "Crobat", ["poison", "flying"], 85, ["bite", "wing-attack", "confuse-ray"], ["swift", "sludge-bomb", "fly", "hyper-beam"]],
  [170, "Chinchou", ["water", "electric"], 75, ["bubble", "thunder-wave"], ["spark", "water-gun", "confuse-ray", "thunderbolt"]],
  [171, "Lanturn", ["water", "electric"], 125, ["bubble", "spark", "water-gun"], ["thunderbolt", "thunder", "surf", "confuse-ray", "hyper-beam"]],
  [172, "Pichu", ["electric"], 20, ["thunder-shock", "growl"], ["thunderbolt", "quick-attack", "thunder-wave"]],
  [173, "Cleffa", ["normal"], 50, ["pound", "growl"], ["sing", "mega-punch", "psychic"]],
  [174, "Igglybuff", ["normal"], 90, ["sing", "pound"], ["defense-curl", "body-slam"]],
  [175, "Togepi", ["normal"], 35, ["growl", "headbutt"], ["swift", "ancient-power", "psychic"]],
  [176, "Togetic", ["normal", "flying"], 55, ["headbutt", "swift", "ancient-power"], ["psychic", "fly", "hyper-beam"]],
  [177, "Natu", ["psychic", "flying"], 40, ["peck", "leer"], ["night-shade", "confusion", "psychic", "future-sight"]],
  [178, "Xatu", ["psychic", "flying"], 65, ["peck", "night-shade", "confusion"], ["psychic", "future-sight", "fly", "hyper-beam"]],
  [179, "Mareep", ["electric"], 55, ["tackle", "growl"], ["thunder-shock", "thunder-wave", "thunderbolt"]],
  [180, "Flaaffy", ["electric"], 70, ["tackle", "thunder-shock", "thunder-wave"], ["thunderbolt", "thunder", "fire-punch"]],
  [181, "Ampharos", ["electric"], 90, ["thunder-shock", "thunderbolt", "thunder-wave"], ["thunder", "fire-punch", "hyper-beam", "iron-tail"]],
  [182, "Bellossom", ["grass"], 75, ["absorb", "mega-drain", "stun-spore"], ["petal-dance", "solar-beam", "hyper-beam"]],
  [183, "Marill", ["water"], 70, ["tackle", "defense-curl"], ["water-gun", "bubble-beam", "body-slam", "surf"]],
  [184, "Azumarill", ["water"], 100, ["tackle", "water-gun", "bubble-beam"], ["surf", "hydro-pump", "body-slam", "hyper-beam"]],
  [185, "Sudowoodo", ["rock"], 70, ["rock-throw", "leer"], ["slam", "rock-slide", "earthquake", "self-destruct"]],
  [186, "Politoed", ["water"], 90, ["water-gun", "hypnosis", "body-slam"], ["surf", "ice-beam", "earthquake", "hyper-beam"]],
  [187, "Hoppip", ["grass", "flying"], 35, ["tackle", "growl"], ["absorb", "stun-spore", "mega-drain", "gust"]],
  [188, "Skiploom", ["grass", "flying"], 55, ["tackle", "absorb", "stun-spore"], ["mega-drain", "gust", "giga-drain"]],
  [189, "Jumpluff", ["grass", "flying"], 75, ["absorb", "mega-drain", "stun-spore"], ["giga-drain", "gust", "sleep-powder", "hyper-beam"]],
  [190, "Aipom", ["normal"], 55, ["scratch", "tail-whip"], ["swift", "fury-swipes", "slam", "agility"]],
  [191, "Sunkern", ["grass"], 30, ["absorb", "growl"], ["mega-drain", "giga-drain", "solar-beam"]],
  [192, "Sunflora", ["grass"], 75, ["absorb", "mega-drain", "razor-leaf"], ["giga-drain", "solar-beam", "hyper-beam"]],
  [193, "Yanma", ["bug", "flying"], 65, ["tackle", "quick-attack"], ["wing-attack", "swift", "hypnosis", "ancient-power"]],
  [194, "Wooper", ["water", "ground"], 55, ["water-gun", "tail-whip"], ["slam", "mud-slap", "earthquake", "surf"]],
  [195, "Quagsire", ["water", "ground"], 95, ["water-gun", "slam", "mud-slap"], ["earthquake", "surf", "ice-punch", "hyper-beam"]],
  [196, "Espeon", ["psychic"], 65, ["tackle", "confusion", "sand-attack"], ["psybeam", "psychic", "swift", "future-sight", "hyper-beam"]],
  [197, "Umbreon", ["dark"], 95, ["tackle", "sand-attack", "pursuit"], ["bite", "faint-attack", "confuse-ray", "mean-look", "hyper-beam"]],
  [198, "Murkrow", ["dark", "flying"], 60, ["peck", "pursuit"], ["faint-attack", "night-shade", "wing-attack", "fly"]],
  [199, "Slowking", ["water", "psychic"], 95, ["confusion", "water-gun", "headbutt"], ["surf", "psychic", "ice-beam", "hyper-beam"]],
  [200, "Misdreavus", ["ghost"], 60, ["confusion", "growl"], ["psybeam", "shadow-ball", "confuse-ray", "mean-look", "psychic"]],
  [201, "Unown", ["psychic"], 48, ["confusion"], ["psychic"]],
  [202, "Wobbuffet", ["psychic"], 190, ["counter", "mirror-coat"], ["defense-curl"]],
  [203, "Girafarig", ["normal", "psychic"], 70, ["tackle", "confusion"], ["psybeam", "crunch", "psychic", "hyper-beam"]],
  [204, "Pineco", ["bug"], 50, ["tackle", "harden"], ["self-destruct", "rapid-spin", "explosion"]],
  [205, "Forretress", ["bug", "steel"], 75, ["tackle", "rapid-spin", "self-destruct"], ["explosion", "earthquake", "zap-cannon", "hyper-beam"]],
  [206, "Dunsparce", ["normal"], 100, ["tackle", "defense-curl"], ["headbutt", "bite", "ancient-power", "body-slam"]],
  [207, "Gligar", ["ground", "flying"], 65, ["poison-sting", "sand-attack"], ["slash", "dig", "earthquake", "steel-wing"]],
  [208, "Steelix", ["steel", "ground"], 75, ["tackle", "rock-throw", "screech"], ["iron-tail", "earthquake", "rock-slide", "hyper-beam"]],
  [209, "Snubbull", ["normal"], 60, ["tackle", "bite"], ["headbutt", "crunch", "body-slam"]],
  [210, "Granbull", ["normal"], 90, ["tackle", "bite", "headbutt"], ["crunch", "body-slam", "earthquake", "hyper-beam"]],
  [211, "Qwilfish", ["water", "poison"], 65, ["tackle", "poison-sting"], ["water-gun", "pin-missile", "surf", "sludge-bomb"]],
  [212, "Scizor", ["bug", "steel"], 70, ["quick-attack", "metal-claw", "fury-attack"], ["slash", "steel-wing", "agility", "hyper-beam"]],
  [213, "Shuckle", ["bug", "rock"], 20, ["wrap", "withdraw"], ["rollout", "ancient-power", "body-slam"]],
  [214, "Heracross", ["bug", "fighting"], 80, ["tackle", "horn-attack", "leer"], ["megahorn", "seismic-toss", "take-down", "reversal", "hyper-beam"]],
  [215, "Sneasel", ["dark", "ice"], 55, ["scratch", "leer"], ["quick-attack", "faint-attack", "icy-wind", "slash", "ice-punch"]],
  [216, "Teddiursa", ["normal"], 60, ["scratch", "leer"], ["fury-swipes", "slash", "body-slam", "crunch"]],
  [217, "Ursaring", ["normal"], 90, ["scratch", "fury-swipes", "slash"], ["body-slam", "crunch", "earthquake", "hyper-beam"]],
  [218, "Slugma", ["fire"], 40, ["ember", "smog"], ["rock-throw", "flamethrower", "body-slam"]],
  [219, "Magcargo", ["fire", "rock"], 50, ["ember", "rock-throw", "flamethrower"], ["body-slam", "fire-blast", "earthquake", "hyper-beam"]],
  [220, "Swinub", ["ice", "ground"], 50, ["tackle", "powder-snow"], ["mud-slap", "icy-wind", "take-down", "earthquake"]],
  [221, "Piloswine", ["ice", "ground"], 100, ["tackle", "powder-snow", "icy-wind"], ["mud-slap", "earthquake", "ice-beam", "blizzard", "hyper-beam"]],
  [222, "Corsola", ["water", "rock"], 55, ["tackle", "bubble"], ["rock-throw", "ancient-power", "surf", "ice-beam"]],
  [223, "Remoraid", ["water"], 35, ["water-gun", "leer"], ["aurora-beam", "bubble-beam", "ice-beam", "octazooka"]],
  [224, "Octillery", ["water"], 75, ["water-gun", "aurora-beam", "octazooka"], ["ice-beam", "surf", "hyper-beam", "fire-blast"]],
  [225, "Delibird", ["ice", "flying"], 45, ["peck", "powder-snow"], ["icy-wind", "ice-beam", "fly", "quick-attack"]],
  [226, "Mantine", ["water", "flying"], 65, ["bubble", "wing-attack"], ["surf", "ice-beam", "body-slam", "hydro-pump"]],
  [227, "Skarmory", ["steel", "flying"], 65, ["peck", "leer"], ["steel-wing", "swift", "fly", "agility"]],
  [228, "Houndour", ["dark", "fire"], 45, ["leer", "ember"], ["bite", "faint-attack", "flamethrower", "crunch"]],
  [229, "Houndoom", ["dark", "fire"], 75, ["ember", "bite", "faint-attack"], ["flamethrower", "fire-blast", "crunch", "hyper-beam"]],
  [230, "Kingdra", ["water", "dragon"], 75, ["bubble", "water-gun", "twister"], ["surf", "hydro-pump", "dragon-breath", "ice-beam", "hyper-beam"]],
  [231, "Phanpy", ["ground"], 90, ["tackle", "growl"], ["rollout", "take-down", "mud-slap", "earthquake"]],
  [232, "Donphan", ["ground"], 90, ["tackle", "rollout", "take-down"], ["earthquake", "rapid-spin", "body-slam", "hyper-beam"]],
  [233, "Porygon2", ["normal"], 85, ["tackle", "psybeam", "agility"], ["tri-attack", "psychic", "thunderbolt", "ice-beam", "hyper-beam"]],
  [234, "Stantler", ["normal"], 73, ["tackle", "leer"], ["headbutt", "take-down", "confuse-ray", "psychic", "hyper-beam"]],
  [235, "Smeargle", ["normal"], 55, ["tackle"], ["slash", "swift"]],
  [236, "Tyrogue", ["fighting"], 35, ["tackle"], ["low-kick", "mach-punch"]],
  [237, "Hitmontop", ["fighting"], 50, ["tackle", "rapid-spin"], ["triple-kick", "mach-punch", "seismic-toss", "submission"]],
  [238, "Smoochum", ["ice", "psychic"], 45, ["pound", "lick"], ["confusion", "ice-punch", "psychic"]],
  [239, "Elekid", ["electric"], 45, ["quick-attack", "leer"], ["thunder-shock", "thunderbolt", "thunder-punch"]],
  [240, "Magby", ["fire"], 45, ["ember", "leer"], ["fire-punch", "flamethrower", "smog"]],
  [241, "Miltank", ["normal"], 95, ["tackle", "growl"], ["rollout", "body-slam", "earthquake", "surf", "hyper-beam"]],
  [242, "Blissey", ["normal"], 255, ["pound", "growl"], ["body-slam", "ice-beam", "psychic", "hyper-beam"]],
  [243, "Raikou", ["electric"], 90, ["thunder-shock", "quick-attack"], ["spark", "thunderbolt", "thunder", "crunch", "extreme-speed", "hyper-beam"]],
  [244, "Entei", ["fire"], 115, ["ember", "bite"], ["flamethrower", "fire-blast", "extreme-speed", "crunch", "hyper-beam"]],
  [245, "Suicune", ["water"], 100, ["water-gun", "gust"], ["surf", "hydro-pump", "ice-beam", "aurora-beam", "hyper-beam"]],
  [246, "Larvitar", ["rock", "ground"], 50, ["bite", "leer"], ["rock-throw", "screech", "crunch", "earthquake"]],
  [247, "Pupitar", ["rock", "ground"], 70, ["bite", "rock-throw", "screech"], ["crunch", "earthquake", "rock-slide"]],
  [248, "Tyranitar", ["rock", "dark"], 100, ["bite", "rock-throw", "crunch"], ["earthquake", "rock-slide", "hyper-beam", "fire-blast", "ice-beam", "thunderbolt"]],
  [249, "Lugia", ["psychic", "flying"], 106, ["gust", "confusion"], ["aeroblast", "psychic", "hydro-pump", "ice-beam", "hyper-beam", "ancient-power"]],
  [250, "Ho-Oh", ["fire", "flying"], 106, ["peck", "ember"], ["sacred-fire", "fire-blast", "fly", "ancient-power", "hyper-beam", "earthquake"]],
  [251, "Celebi", ["psychic", "grass"], 100, ["confusion", "leech-seed"], ["psychic", "giga-drain", "solar-beam", "ancient-power", "future-sight", "hyper-beam"]],
  // Generation # (252-386)

  [252, "Treecko", ["grass"], 50, ["pound", "leer"], ["quick-attack", "mega-drain", "slam", "leaf-blade"]],
  [253, "Grovyle", ["grass"], 70, ["pound", "quick-attack", "leer"], ["leaf-blade", "screech", "agility", "fury-cutter"]],
  [254, "Sceptile", ["grass"], 100, ["quick-attack", "leer", "fury-cutter"], ["leaf-blade", "dragon-claw", "slam", "solar-beam", "hyper-beam"]],

  [255, "Torchic", ["fire"], 50, ["scratch", "growl"], ["ember", "peck", "focus-energy", "flamethrower"]],
  [256, "Combusken", ["fire", "fighting"], 70, ["scratch", "ember", "peck"], ["double-kick", "bulk-up", "flamethrower", "sky-uppercut"]],
  [257, "Blaziken", ["fire", "fighting"], 100, ["ember", "double-kick", "peck"], ["blaze-kick", "sky-uppercut", "bulk-up", "fire-blast", "hyper-beam"]],

  [258, "Mudkip", ["water"], 50, ["tackle", "growl"], ["water-gun", "mud-slap", "bite", "take-down"]],
  [259, "Marshtomp", ["water", "ground"], 70, ["water-gun", "mud-slap", "tackle"], ["mud-shot", "take-down", "protect", "surf"]],
  [260, "Swampert", ["water", "ground"], 100, ["water-gun", "mud-shot", "tackle"], ["earthquake", "surf", "muddy-water", "ice-beam", "hyper-beam"]],

  [261, "Poochyena", ["dark"], 45, ["tackle", "howl"], ["bite", "sand-attack", "roar", "crunch"]],
  [262, "Mightyena", ["dark"], 70, ["bite", "howl", "sand-attack"], ["crunch", "swagger", "take-down", "roar"]],

  [263, "Zigzagoon", ["normal"], 40, ["tackle", "growl"], ["headbutt", "sand-attack", "pin-missile", "rest"]],
  [264, "Linoone", ["normal"], 70, ["headbutt", "growl", "tackle"], ["slash", "rest", "belly-drum", "hyper-beam"]],

  [265, "Wurmple", ["bug"], 30, ["tackle", "string-shot"], ["poison-sting", "bug-bite"]],
  [266, "Silcoon", ["bug"], 40, ["harden"], ["iron-defense"]],
  [267, "Beautifly", ["bug", "flying"], 70, ["gust", "string-shot"], ["silver-wind", "air-cutter", "mega-drain", "stun-spore"]],
  [268, "Cascoon", ["bug"], 40, ["harden"], ["iron-defense"]],
  [269, "Dustox", ["bug", "poison"], 70, ["gust", "confusion"], ["poison-powder", "psybeam", "silver-wind", "toxic"]],

  [270, "Lotad", ["water", "grass"], 40, ["astonish", "growl"], ["absorb", "bubble-beam", "rain-dance", "mega-drain"]],
  [271, "Lombre", ["water", "grass"], 70, ["bubble", "astonish"], ["fake-out", "rain-dance", "mega-drain", "nature-power"]],
  [272, "Ludicolo", ["water", "grass"], 100, ["fake-out", "bubble-beam"], ["rain-dance", "surf", "giga-drain", "hydro-pump", "hyper-beam"]],

  [273, "Seedot", ["grass"], 40, ["bide", "harden"], ["growth", "nature-power", "solar-beam"]],
  [274, "Nuzleaf", ["grass", "dark"], 70, ["razor-leaf", "growth"], ["fake-out", "torment", "nature-power", "swagger"]],
  [275, "Shiftry", ["grass", "dark"], 100, ["razor-leaf", "fake-out"], ["leaf-blade", "extrasensory", "hurricane", "solar-beam", "hyper-beam"]],

  [276, "Taillow", ["normal", "flying"], 40, ["peck", "growl"], ["quick-attack", "wing-attack", "double-attack", "agility"]],
  [277, "Swellow", ["normal", "flying"], 70, ["peck", "quick-attack"], ["wing-attack", "double-attack", "agility", "hyper-beam"]],

  [278, "Wingull", ["water", "flying"], 40, ["peck", "growl"], ["water-gun", "supersonic", "quick-attack", "aerial-ace"]],
  [279, "Pelipper", ["water", "flying"], 70, ["peck", "water-gun"], ["supersonic", "aerial-ace", "protect", "hydro-pump"]],

  [280, "Ralts", ["psychic"], 30, ["growl", "confusion"], ["double-team", "teleport", "shock-wave", "psychic"]],
  [281, "Kirlia", ["psychic"], 50, ["growl", "confusion", "double-team"], ["teleport", "psychic", "calm-mind", "future-sight"]],



  [282, "Gardevoir", ["psychic"], 80, ["growl", "confusion", "double-team"], ["calm-mind", "psychic", "future-sight", "hyper-beam"]],

  [283, "Surskit", ["bug", "water"], 40, ["bubble", "quick-attack"], ["water-gun", "bug-bite", "aqua-jet", "ice-beam"]],
  [284, "Masquerain", ["bug", "flying"], 70, ["quick-attack", "bubble-beam"], ["stun-spore", "silver-wind", "air-cutter", "hydro-pump"]],

  [285, "Shroomish", ["grass"], 50, ["absorb", "growl"], ["mega-drain", "toxic-spores", "stun-spore", "solar-beam"]],
  [286, "Breloom", ["grass", "fighting"], 80, ["growl", "mega-drain"], ["bullet-seed", "drain-punch", "sky-uppercut", "earthquake"]],

  [287, "Slakoth", ["normal"], 60, ["scratch", "yawn"], ["slack-off", "comet-punch", "earthquake"]],
  [288, "Vigoroth", ["normal"], 80, ["scratch", "focus-energy"], ["slack-off", "comet-punch", "earthquake", "hyper-beam"]],
  [289, "Slaking", ["normal"], 100, ["scratch", "yawn"], ["earthquake", "hyper-beam", "giga-impact", "comet-punch"]],

  [290, "Nincada", ["bug", "ground"], 50, ["scratch", "harden"], ["x-scissor", "fury-swipes", "earthquake"]],
  [291, "Ninjask", ["bug", "flying"], 80, ["scratch", "harden"], ["x-scissor", "aerial-ace", "swords-dance", "agility"]],
  [292, "Shedinja", ["bug", "ghost"], 30, ["scratch", "harden"], ["x-scissor", "will-o-wisp", "shadow-sneak"]],

  [293, "Whismur", ["normal"], 60, ["pound", "echo"], ["uproar", "howl", "bite", "crunch"]],
  [294, "Loudred", ["normal"], 80, ["pound", "echo"], ["uproar", "roar", "crunch", "hyper-beam"]],
  [295, "Exploud", ["normal"], 104, ["echo", "pound"], ["uproar", "hyper-beam", "giga-impact", "fire-blast"]],

  [296, "Makuhita", ["fighting"], 60, ["tackle", "focus-energy"], ["vital-throw", "arm-thrust", "earthquake", "close-combat"]],
  [297, "Hariyama", ["fighting"], 120, ["tackle", "focus-energy"], ["vital-throw", "close-combat", "earthquake", "hyper-beam"]],

  [298, "Azurill", ["normal", "water"], 50, ["pound", "charm"], ["bubble-beam", "water-gun", "tail-whip"]],

  [299, "Nosepass", ["rock"], 80, ["tackle", "harden"], ["rock-throw", "block", "sandstorm", "power-gem"]],
  [300, "Skitty", ["normal"], 50, ["tackle", "growl"], ["sing", "attract", "assist", "double-edge"]],
  [301, "Delcatty", ["normal"], 70, ["tackle", "sing"], ["attract", "assist", "heal-bell", "double-edge"]],

  [302, "Sableye", ["dark", "ghost"], 50, ["scratch", "leer"], ["night-shade", "fake-out", "shadow-sneak", "shadow-claw"]],
  [303, "Mawile", ["steel", "fairy"], 50, ["astonish", "growl"], ["bite", "sweet-scent", "iron-head", "crunch"]],

  [304, "Aron", ["steel", "rock"], 50, ["tackle", "harden"], ["metal-claw", "rock-tomb", "iron-defense", "take-down"]],
  [305, "Lairon", ["steel", "rock"], 70, ["tackle", "metal-claw"], ["rock-tomb", "iron-defense", "take-down", "iron-tail"]],
  [306, "Aggron", ["steel", "rock"], 100, ["metal-claw", "iron-defense"], ["iron-tail", "rock-slide", "earthquake", "hyper-beam"]],

  [307, "Meditite", ["fighting", "psychic"], 30, ["confusion", "light-screen"], ["low-kick", "hi-jump-kick", "calm-mind", "psychic"]],
  [308, "Medicham", ["fighting", "psychic"], 60, ["confusion", "meditation"], ["low-kick", "hi-jump-kick", "calm-mind", "psychic"]],

  [309, "Electrike", ["electric"], 40, ["tackle", "growl"], ["quick-attack", "thunderbolt", "wild-charge", "thunder"]],
  [310, "Manectric", ["electric"], 70, ["tackle", "growl"], ["quick-attack", "thunderbolt", "wild-charge", "thunder"]],

  [311, "Plusle", ["electric"], 60, ["growl", "thundershock"], ["quick-attack", "thunder-wave", "signal-beam", "thunderbolt"]],


  [312, "Minun", ["electric"], 60, ["growl", "thundershock"], ["quick-attack", "thunder-wave", "signal-beam", "thunderbolt"]],
  [313, "Volbeat", ["bug"], 65, ["tackle", "flash"], ["quick-attack", "signal-beam", "bug-buzz", "x-scissor"]],
  [314, "Illumise", ["bug"], 65, ["tackle", "flash"], ["quick-attack", "signal-beam", "bug-buzz", "x-scissor"]],

  [315, "Roselia", ["grass", "poison"], 50, ["poison-powder", "absorb"], ["mega-drain", "toxic-spikes", "stun-spore", "giga-drain"]],

  [316, "Gulpin", ["poison"], 70, ["pound", "yawn"], ["sludge", "amnesia", "sludge-bomb", "gastro-acid"]],
  [317, "Swalot", ["poison"], 100, ["pound", "yawn"], ["sludge", "amnesia", "sludge-bomb", "gastro-acid"]],

  [318, "Carvanha", ["water", "dark"], 45, ["leer", "bite"], ["crunch", "aqua-jet", "dark-pulse", "waterfall"]],
  [319, "Sharpedo", ["water", "dark"], 70, ["leer", "bite"], ["crunch", "waterfall", "dark-pulse", "hyper-beam"]],

  [320, "Wailmer", ["water"], 130, ["growl", "water-gun"], ["water-pulse", "rest", "aurora-beam", "surf"]],
  [321, "Wailord", ["water"], 170, ["growl", "water-gun"], ["surf", "hydro-pump", "aqua-ring", "hyper-beam"]],

  [322, "Numel", ["fire", "ground"], 60, ["tackle", "growl"], ["ember", "magnitude", "earth-power", "lava-plume"]],
  [323, "Camerupt", ["fire", "ground"], 90, ["tackle", "ember"], ["magnitude", "earth-power", "lava-plume", "earthquake"]],

  [324, "Torkoal", ["fire"], 70, ["ember", "smog"], ["flamethrower", "iron-defense", "heat-wave", "amnesia"]],

  [325, "Spoink", ["psychic"], 60, ["psywave", "growl"], ["light-screen", "psybeam", "calm-mind", "psychic"]],
  [326, "Grumpig", ["psychic"], 80, ["psywave", "psybeam"], ["calm-mind", "psychic", "power-gem", "hyper-beam"]],

  [327, "Spinda", ["normal"], 60, ["pound", "teeter-dance"], ["dizzy-punch", "fake-out", "sucker-punch", "hyper-beam"]],

  [328, "Trapinch", ["ground"], 45, ["bite", "sand-attack"], ["crunch", "dig", "earthquake", "sandstorm"]],
  [329, "Vibrava", ["ground", "dragon"], 70, ["bite", "sand-attack"], ["crunch", "dragon-breath", "earthquake", "dragon-dance"]],
  [330, "Flygon", ["ground", "dragon"], 80, ["dragon-breath", "sand-attack"], ["earthquake", "dragon-claw", "dragon-dance", "hyper-beam"]],

  [331, "Cacnea", ["grass"], 50, ["poison-sting", "leer"], ["needle-arm", "pin-missile", "spikes", "energy-ball"]],
  [332, "Cacturne", ["grass", "dark"], 70, ["poison-sting", "leer"], ["needle-arm", "spikes", "dark-pulse", "energy-ball"]],

  [333, "Swablu", ["normal", "flying"], 45, ["peck", "growl"], ["sing", "dragon-breath", "cotton-guard", "refresh"]],
  [334, "Altaria", ["dragon", "flying"], 75, ["peck", "dragon-breath"], ["dragon-dance", "dragon-pulse", "cotton-guard", "hyper-beam"]],

  [335, "Zangoose", ["normal"], 73, ["scratch", "leer"], ["slash", "swords-dance", "close-combat", "crush-claw"]],
  [336, "Seviper", ["poison"], 73, ["wrap", "leer"], ["poison-fang", "bite", "sludge-bomb", "crunch"]],

  [337, "Lunatone", ["rock", "psychic"], 70, ["confusion", "harden"], ["rock-slide", "cosmic-power", "psychic", "moonlight"]],
  [338, "Solrock", ["rock", "psychic"], 70, ["confusion", "harden"], ["rock-slide", "cosmic-power", "psychic", "sunny-day"]],

  [339, "Barboach", ["water", "ground"], 50, ["mud-slap", "water-gun"], ["earthquake", "waterfall", "stone-edge", "muddy-water"]],
  [340, "Whiscash", ["water", "ground"], 110, ["mud-slap", "water-gun"], ["earthquake", "waterfall", "stone-edge", "hyper-beam"]],

  [341, "Corphish", ["water"], 43, ["scratch", "harden"], ["bubble-beam", "crunch", "waterfall", "ice-beam"]],
  [342, "Crawdaunt", ["water", "dark"], 63, ["scratch", "crunch"], ["waterfall", "dark-pulse", "x-scissor", "earthquake"]],

  [343, "Baltoy", ["ground", "psychic"], 40, ["confusion", "harden"], ["psybeam", "ancient-power", "earthquake"]],
  [344, "Claydol", ["ground", "psychic"], 60, ["confusion", "ancient-power"], ["earthquake", "psychic", "power-gem", "hyper-beam"]],

  [345, "Lileep", ["rock", "grass"], 66, ["astonish", "constrict"], ["ancient-power", "giga-drain", "stockpile", "energy-ball"]],
  [346, "Cradily", ["rock", "grass"], 86, ["astonish", "giga-drain"], ["ancient-power", "energy-ball", "stone-edge", "earthquake"]],

  [347, "Anorith", ["rock", "bug"], 45, ["scratch", "harden"], ["ancient-power", "x-scissor", "rock-slide", "earthquake"]],
  [348, "Armaldo", ["rock", "bug"], 75, ["scratch", "x-scissor"], ["ancient-power", "stone-edge", "earthquake", "hyper-beam"]],

  [349, "Feebas", ["water"], 20, ["splash", "tackle"], ["water-pulse", "rain-dance", "flail", "protect"]],
  [350, "Milotic", ["water"], 95, ["water-gun", "rain-dance"], ["aqua-ring", "recover", "hydro-pump", "ice-beam"]],

  [351, "Castform", ["normal"], 70, ["tackle", "powder-snow"], ["weather-ball", "sunny-day", "rain-dance", "hail"]],

  [352, "Kecleon", ["normal"], 60, ["scratch", "tail-whip"], ["fury-swipes", "shadow-claw", "sucker-punch", "slash"]],

  [353, "Shuppet", ["ghost"], 50, ["knock-off", "screech"], ["shadow-sneak", "will-o-wisp", "curse", "night-shade"]],
  [354, "Banette", ["ghost"], 80, ["knock-off", "shadow-sneak"], ["shadow-ball", "will-o-wisp", "curse", "hyper-beam"]],

  [355, "Duskull", ["ghost"], 70, ["leer", "night-shade"], ["shadow-sneak", "will-o-wisp", "confuse-ray", "payback"]],
  [356, "Dusclops", ["ghost"], 80, ["shadow-punch", "leer"], ["shadow-ball", "will-o-wisp", "curse", "hyper-beam"]],

  [357, "Tropius", ["grass", "flying"], 99, ["gust", "growl"], ["razor-leaf", "air-slash", "solar-beam", "synthesis"]],

  [358, "Chimecho", ["psychic"], 65, ["wrap", "growl"], ["psybeam", "calm-mind", "psychic", "healing-wish"]],

  [359, "Absol", ["dark"], 65, ["scratch", "leer"], ["night-slash", "swords-dance", "psycho-cut", "bite"]],

  [360, "Wynaut", ["psychic"], 60, ["charm", "counter"], ["mirror-coat", "safeguard", "destiny-bond"]],
  [361, "Snorunt", ["ice"], 50, ["powder-snow", "leer"], ["ice-shard", "bite", "ice-beam", "hail"]],
  [362, "Glalie", ["ice"], 80, ["powder-snow", "bite"], ["ice-beam", "crunch", "blizzard", "hyper-beam"]],

  [363, "Spheal", ["ice", "water"], 70, ["powder-snow", "growl"], ["water-gun", "ice-ball", "rest", "aurora-beam"]],
  [364, "Sealeo", ["ice", "water"], 90, ["growl", "aurora-beam"], ["ice-ball", "rest", "protect", "surf"]],
  [365, "Walrein", ["ice", "water"], 110, ["aurora-beam", "growl"], ["ice-beam", "blizzard", "hydro-pump", "earthquake"]],

  [366, "Clamperl", ["water"], 35, ["clamp", "water-gun"], ["whirlpool", "iron-defense", "shell-smash", "brine"]],
  [367, "Huntail", ["water"], 55, ["bite", "water-gun"], ["crunch", "aqua-tail", "hydro-pump", "ice-beam"]],
  [368, "Gorebyss", ["water"], 55, ["confusion", "water-gun"], ["aqua-ring", "baton-pass", "hydro-pump", "ice-beam"]],

  [369, "Relicanth", ["water", "rock"], 100, ["tackle", "harden"], ["waterfall", "ancient-power", "yawn", "double-edge"]],
  [370, "Luvdisc", ["water"], 43, ["tackle", "charm"], ["water-gun", "attract", "sweet-kiss", "aqua-ring"]],

  [371, "Bagon", ["dragon"], 45, ["rage", "bite"], ["dragon-breath", "headbutt", "crunch", "dragon-claw"]],
  [372, "Shelgon", ["dragon"], 65, ["bite", "headbutt"], ["dragon-breath", "zen-headbutt", "crunch", "dragon-claw"]],
  [373, "Salamence", ["dragon", "flying"], 95, ["bite", "dragon-breath"], ["fly", "dragon-claw", "crunch", "hyper-beam"]],

  [374, "Beldum", ["steel", "psychic"], 40, ["tackle"], ["take-down"]],
  [375, "Metang", ["steel", "psychic"], 60, ["tackle", "confusion"], ["metal-claw", "psychic", "iron-defense", "take-down"]],
  [376, "Metagross", ["steel", "psychic"], 80, ["metal-claw", "confusion"], ["meteor-mash", "psychic", "earthquake", "hyper-beam"]],

  [377, "Regirock", ["rock"], 80, ["rock-throw", "curse"], ["ancient-power", "superpower", "stone-edge", "hyper-beam"]],
  [378, "Regice", ["ice"], 80, ["icy-wind", "curse"], ["ice-beam", "amnesia", "blizzard", "hyper-beam"]],
  [379, "Registeel", ["steel"], 80, ["metal-claw", "curse"], ["iron-head", "amnesia", "flash-cannon", "hyper-beam"]],

  [380, "Latias", ["dragon", "psychic"], 80, ["confusion", "dragon-breath"], ["recover", "psychic", "calm-mind", "outrage"]],
  [381, "Latios", ["dragon", "psychic"], 80, ["confusion", "dragon-breath"], ["recover", "psychic", "calm-mind", "outrage"]],

  [382, "Kyogre", ["water"], 100, ["water-gun", "scary-face"], ["hydro-pump", "ice-beam", "calm-mind", "water-spout"]],
  [383, "Groudon", ["ground"], 100, ["mud-shot", "scary-face"], ["earthquake", "fire-blast", "bulk-up", "solar-beam"]],
  [384, "Rayquaza", ["dragon", "flying"], 105, ["twister", "scary-face"], ["dragon-dance", "outrage", "fly", "hyper-beam"]],

  [385, "Jirachi", ["steel", "psychic"], 60, ["confusion", "wish"], ["psychic", "iron-head", "calm-mind", "doom-desire"]],
  [386, "Deoxys", ["psychic"], 50, ["leer", "confusion"], ["psycho-boost", "superpower", "extreme-speed", "hyper-beam"]],


  // Generation 4 # (252-386)
  [387, "Turtwig", ["grass"], 45, ["tackle", "withdraw"], ["razor-leaf", "bite", "mega-drain", "leaf-storm"]],
  [388, "Grotle", ["grass"], 60, ["tackle", "withdraw"], ["razor-leaf", "bite", "curse", "leaf-storm"]],
  [389, "Torterra", ["grass", "ground"], 95, ["earthquake", "razor-leaf"], ["wood-hammer", "earthquake", "stone-edge", "synthesis"]],
  [390, "Chimchar", ["fire"], 45, ["scratch", "leer"], ["flame-wheel", "mach-punch", "fire-spin", "nasty-plot"]],
  [391, "Monferno", ["fire", "fighting"], 65, ["scratch", "ember"], ["flame-wheel", "close-combat", "acrobatics", "fire-spin"]],
  [392, "Infernape", ["fire", "fighting"], 95, ["mach-punch", "ember"], ["close-combat", "flare-blitz", "acrobatics", "focus-blast"]],
  [393, "Piplup", ["water"], 45, ["pound", "bubble"], ["water-pulse", "peck", "brine", "aqua-ring"]],
  [394, "Prinplup", ["water"], 60, ["metal-claw", "bubble"], ["water-pulse", "drill-peck", "brine", "aqua-jet"]],
  [395, "Empoleon", ["water", "steel"], 95, ["metal-claw", "bubble-beam"], ["hydro-pump", "flash-cannon", "ice-beam", "aqua-jet"]],
  [396, "Starly", ["normal", "flying"], 30, ["tackle", "quick-attack"], ["wing-attack", "double-team", "endeavor", "aerial-ace"]],
  [397, "Staravia", ["normal", "flying"], 55, ["wing-attack", "quick-attack"], ["aerial-ace", "double-team", "take-down", "endeavor"]],
  [398, "Staraptor", ["normal", "flying"], 85, ["wing-attack", "quick-attack"], ["brave-bird", "close-combat", "double-edge", "u-turn"]],
  [399, "Bidoof", ["normal"], 30, ["tackle", "growl"], ["hyper-fang", "defense-curl", "yawn", "take-down"]],
  [400, "Bibarel", ["normal", "water"], 55, ["water-gun", "tackle"], ["aqua-jet", "hyper-fang", "superpower", "curse"]],
  [401, "Kricketot", ["bug"], 30, ["growl", "bide"], ["struggle-bug", "bug-bite", "uproar", "sing"]],
  [402, "Kricketune", ["bug"], 65, ["fury-cutter", "sing"], ["x-scissor", "night-slash", "aerial-ace", "bug-buzz"]],
  [403, "Shinx", ["electric"], 45, ["tackle", "thunder-shock"], ["bite", "spark", "charge", "thunder-fang"]],
  [404, "Luxio", ["electric"], 60, ["spark", "bite"], ["thunder-fang", "crunch", "charge", "volt-switch"]],
  [405, "Luxray", ["electric"], 85, ["spark", "bite"], ["wild-charge", "crunch", "ice-fang", "thunder-wave"]],
  [406, "Budew", ["grass", "poison"], 35, ["absorb", "growth"], ["mega-drain", "stun-spore", "toxic-spikes", "energy-ball"]],
  [407, "Roserade", ["grass", "poison"], 80, ["magical-leaf", "poison-sting"], ["energy-ball", "sludge-bomb", "shadow-ball", "toxic-spikes"]],
  [408, "Cranidos", ["rock"], 60, ["headbutt", "leer"], ["ancient-power", "take-down", "zen-headbutt", "crunch"]],
  [409, "Rampardos", ["rock"], 95, ["headbutt", "focus-energy"], ["head-smash", "earthquake", "zen-headbutt", "hammer-arm"]],
  [410, "Shieldon", ["rock", "steel"], 60, ["tackle", "protect"], ["ancient-power", "iron-defense", "metal-sound", "take-down"]],
  [411, "Bastiodon", ["rock", "steel"], 95, ["iron-defense", "tackle"], ["flash-cannon", "metal-burst", "stone-edge", "iron-head"]],
  [412, "Burmy", ["bug"], 30, ["tackle", "protect"], ["bug-bite", "hidden-power", "string-shot", "electroweb"]],
  [413, "Wormadam", ["bug", "grass"], 60, ["tackle", "protect"], ["razor-leaf", "bug-buzz", "giga-drain", "protect"]],
  [414, "Mothim", ["bug", "flying"], 65, ["gust", "tackle"], ["air-slash", "bug-buzz", "silver-wind", "quiver-dance"]],
  [415, "Combee", ["bug", "flying"], 30, ["gust", "sweet-scent"], ["bug-bite", "endeavor", "air-cutter", "sweet-scent"]],
  [416, "Vespiquen", ["bug", "flying"], 80, ["gust", "poison-sting"], ["attack-order", "defend-order", "heal-order", "air-slash"]],
  [417, "Pachirisu", ["electric"], 45, ["spark", "growl"], ["discharge", "nuzzle", "super-fang", "thunder-wave"]],
  [418, "Buizel", ["water"], 45, ["quick-attack", "water-gun"], ["aqua-jet", "bite", "swift", "water-pulse"]],
  [419, "Floatzel", ["water"], 75, ["aqua-jet", "bite"], ["crunch", "waterfall", "ice-fang", "swift"]],
  [420, "Cherubi", ["grass"], 35, ["tackle", "growth"], ["magical-leaf", "morning-sun", "take-down", "sunny-day"]],
  [421, "Cherrim", ["grass"], 70, ["magical-leaf", "growth"], ["petal-dance", "solar-beam", "sunny-day", "healing-wish"]],
  [422, "Shellos", ["water"], 40, ["mud-slap", "water-gun"], ["mud-bomb", "recover", "water-pulse", "ancient-power"]],
  [423, "Gastrodon", ["water", "ground"], 80, ["mud-bomb", "water-pulse"], ["earth-power", "recover", "surf", "ice-beam"]],
  [424, "Ambipom", ["normal"], 80, ["double-hit", "swift"], ["fake-out", "baton-pass", "u-turn", "last-resort"]],
  [425, "Drifloon", ["ghost", "flying"], 45, ["gust", "astonish"], ["ominous-wind", "stockpile", "shadow-ball", "minimize"]],
  [426, "Drifblim", ["ghost", "flying"], 80, ["gust", "shadow-ball"], ["phantom-force", "stockpile", "explosion", "tailwind"]],
  [427, "Buneary", ["normal"], 45, ["pound", "defense-curl"], ["jump-kick", "quick-attack", "baton-pass", "charm"]],
  [428, "Lopunny", ["normal"], 75, ["quick-attack", "double-kick"], ["jump-kick", "return", "mirror-coat", "agility"]],
  [429, "Mismagius", ["ghost"], 85, ["psybeam", "astonish"], ["shadow-ball", "power-gem", "mystical-fire", "nasty-plot"]],
  [430, "Honchkrow", ["dark", "flying"], 90, ["wing-attack", "astonish"], ["night-slash", "brave-bird", "sucker-punch", "roost"]],
  [431, "Glameow", ["normal"], 45, ["scratch", "growl"], ["fury-swipes", "fake-out", "slash", "assist"]],
  [432, "Purugly", ["normal"], 70, ["slash", "fake-out"], ["body-slam", "play-rough", "swagger", "hone-claws"]],
  [433, "Chingling", ["psychic"], 35, ["wrap", "growl"], ["psywave", "heal-bell", "confusion", "uproar"]],
  [434, "Stunky", ["poison", "dark"], 45, ["scratch", "poison-gas"], ["bite", "toxic", "night-slash", "flamethrower"]],
  [435, "Skuntank", ["poison", "dark"], 80, ["bite", "poison-gas"], ["night-slash", "toxic", "explosion", "flamethrower"]],
  [436, "Bronzor", ["steel", "psychic"], 40, ["tackle", "confusion"], ["gyro-ball", "hypnosis", "iron-defense", "extrasensory"]],
  [437, "Bronzong", ["steel", "psychic"], 80, ["confusion", "block"], ["gyro-ball", "hypnosis", "psychic", "heavy-slam"]],
  [438, "Bonsly", ["rock"], 35, ["copycat", "rock-throw"], ["rock-slide", "mimic", "flail", "sucker-punch"]],
  [439, "Mime Jr.", ["psychic"], 35, ["barrier", "confusion"], ["psybeam", "encore", "mimic", "baton-pass"]],
  [440, "Happiny", ["normal"], 35, ["pound", "charm"], ["refresh", "sweet-kiss", "heal-pulse", "light-screen"]],
  [441, "Chatot", ["normal", "flying"], 60, ["peck", "growl"], ["chatter", "uproar", "hyper-voice", "roost"]],
  [442, "Spiritomb", ["ghost", "dark"], 80, ["pursuit", "confuse-ray"], ["shadow-ball", "dark-pulse", "pain-split", "nasty-plot"]],
  [443, "Gible", ["dragon", "ground"], 45, ["tackle", "sand-attack"], ["dragon-breath", "bite", "dig", "sand-tomb"]],
  [444, "Gabite", ["dragon", "ground"], 65, ["dragon-breath", "slash"], ["dragon-claw", "dig", "sandstorm", "crunch"]],
  [445, "Garchomp", ["dragon", "ground"], 95, ["dragon-claw", "slash"], ["earthquake", "outrage", "stone-edge", "swords-dance"]],
  [446, "Munchlax", ["normal"], 40, ["tackle", "lick"], ["body-slam", "rest", "snore", "stockpile"]],
  [447, "Riolu", ["fighting"], 45, ["quick-attack", "endure"], ["force-palm", "counter", "detect", "bite"]],
  [448, "Lucario", ["fighting", "steel"], 90, ["metal-claw", "quick-attack"], ["aura-sphere", "close-combat", "extreme-speed", "swords-dance"]],
  [449, "Hippopotas", ["ground"], 50, ["tackle", "sand-attack"], ["bite", "dig", "sandstorm", "yawn"]],
  [450, "Hippowdon", ["ground"], 85, ["bite", "sand-attack"], ["earthquake", "crunch", "slack-off", "sandstorm"]],
  [451, "Skorupi", ["poison", "bug"], 50, ["poison-sting", "leer"], ["bug-bite", "toxic-spikes", "crunch", "night-slash"]],
  [452, "Drapion", ["poison", "dark"], 85, ["bite", "poison-sting"], ["crunch", "cross-poison", "earthquake", "swords-dance"]],
  [453, "Croagunk", ["poison", "fighting"], 50, ["astonish", "poison-sting"], ["revenge", "sucker-punch", "toxic", "mud-bomb"]],
  [454, "Toxicroak", ["poison", "fighting"], 85, ["poison-jab", "revenge"], ["drain-punch", "sucker-punch", "mud-bomb", "swords-dance"]],
  [455, "Carnivine", ["grass"], 70, ["bind", "bite"], ["vine-whip", "crunch", "giga-drain", "sleep-powder"]],
  [456, "Finneon", ["water"], 40, ["pound", "water-gun"], ["water-pulse", "gust", "attract", "rain-dance"]],
  [457, "Lumineon", ["water"], 70, ["water-pulse", "gust"], ["silver-wind", "ice-beam", "rain-dance", "tailwind"]],
  [458, "Mantyke", ["water", "flying"], 40, ["bubble", "tackle"], ["bubble-beam", "confuse-ray", "take-down", "agility"]],
  [459, "Snover", ["grass", "ice"], 50, ["razor-leaf", "powder-snow"], ["ice-shard", "ingrain", "swagger", "mist"]],
  [460, "Abomasnow", ["grass", "ice"], 85, ["razor-leaf", "ice-shard"], ["blizzard", "wood-hammer", "aurora-veil", "earthquake"]],
  [461, "Weavile", ["dark", "ice"], 95, ["quick-attack", "leer"], ["night-slash", "ice-punch", "swords-dance", "icicle-crash"]],
  [462, "Magnezone", ["electric", "steel"], 90, ["spark", "mirror-shot"], ["discharge", "flash-cannon", "zap-cannon", "magnet-rise"]],
  [463, "Lickilicky", ["normal"], 85, ["lick", "supersonic"], ["body-slam", "power-whip", "rollout", "amnesia"]],
  [464, "Rhyperior", ["ground", "rock"], 95, ["hammer-arm", "rock-blast"], ["earthquake", "stone-edge", "megahorn", "rock-wrecker"]],
  [465, "Tangrowth", ["grass"], 85, ["vine-whip", "bind"], ["power-whip", "sleep-powder", "earthquake", "giga-drain"]],
  [466, "Electivire", ["electric"], 95, ["quick-attack", "leer"], ["wild-charge", "thunder-punch", "ice-punch", "earthquake"]],
  [467, "Magmortar", ["fire"], 95, ["ember", "smokescreen"], ["flamethrower", "fire-blast", "thunderbolt", "focus-blast"]],
  [468, "Togekiss", ["fairy", "flying"], 90, ["air-cutter", "charm"], ["air-slash", "aura-sphere", "roost", "ancient-power"]],
  [469, "Yanmega", ["bug", "flying"], 95, ["quick-attack", "double-team"], ["air-slash", "bug-buzz", "ancient-power", "detect"]],
  [470, "Leafeon", ["grass"], 90, ["quick-attack", "razor-leaf"], ["leaf-blade", "swords-dance", "x-scissor", "synthesis"]],
  [471, "Glaceon", ["ice"], 90, ["quick-attack", "icy-wind"], ["ice-beam", "hail", "shadow-ball", "barrier"]],
  [472, "Gliscor", ["ground", "flying"], 95, ["quick-attack", "sand-attack"], ["earthquake", "x-scissor", "swords-dance", "acrobatics"]],
  [473, "Mamoswine", ["ice", "ground"], 95, ["powder-snow", "mud-slap"], ["earthquake", "icicle-crash", "stone-edge", "ice-shard"]],
  [474, "Porygon-Z", ["normal"], 90, ["conversion", "tackle"], ["tri-attack", "dark-pulse", "ice-beam", "nasty-plot"]],
  [475, "Gallade", ["psychic", "fighting"], 95, ["confusion", "double-team"], ["psycho-cut", "close-combat", "leaf-blade", "swords-dance"]],
  [476, "Probopass", ["rock", "steel"], 85, ["tackle", "block"], ["power-gem", "earth-power", "iron-defense", "zap-cannon"]],
  [477, "Dusknoir", ["ghost"], 85, ["shadow-punch", "disable"], ["shadow-ball", "will-o-wisp", "pain-split", "earthquake"]],
  [478, "Froslass", ["ice", "ghost"], 90, ["powder-snow", "leer"], ["ice-beam", "shadow-ball", "blizzard", "destiny-bond"]],
  [479, "Rotom", ["electric", "ghost"], 80, ["thunder-shock", "astonish"], ["discharge", "shadow-ball", "hex", "trick"]],
  [480, "Uxie", ["psychic"], 95, ["confusion", "rest"], ["psychic", "amnesia", "yawn", "future-sight"]],
  [481, "Mesprit", ["psychic"], 95, ["confusion", "swift"], ["psychic", "charm", "future-sight", "copycat"]],
  [482, "Azelf", ["psychic"], 95, ["confusion", "uproar"], ["psychic", "nasty-plot", "future-sight", "explosion"]],
  [483, "Dialga", ["steel", "dragon"], 120, ["metal-claw", "dragon-breath"], ["roar-of-time", "flash-cannon", "earth-power", "ancient-power"]],
  [484, "Palkia", ["water", "dragon"], 120, ["water-gun", "dragon-breath"], ["spacial-rend", "hydro-pump", "aura-sphere", "ancient-power"]],
  [485, "Heatran", ["fire", "steel"], 110, ["ember", "metal-claw"], ["lava-plume", "earth-power", "iron-head", "stone-edge"]],
  [486, "Regigigas", ["normal"], 120, ["stomp", "confuse-ray"], ["crush-grip", "zen-headbutt", "earthquake", "giga-impact"]],
  [487, "Giratina", ["ghost", "dragon"], 120, ["shadow-sneak", "dragon-breath"], ["shadow-force", "dragon-claw", "earth-power", "aura-sphere"]],
  [488, "Cresselia", ["psychic"], 120, ["confusion", "double-team"], ["moonlight", "psychic", "aurora-beam", "lunar-dance"]],
  [489, "Phione", ["water"], 80, ["bubble", "charm"], ["aqua-ring", "water-pulse", "rain-dance", "whirlpool"]],
  [490, "Manaphy", ["water"], 100, ["bubble", "heart-swap"], ["surf", "ice-beam", "tail-glow", "rain-dance"]],
  [491, "Darkrai", ["dark"], 120, ["disable", "quick-attack"], ["dark-pulse", "nightmare", "hypnosis", "dream-eater"]],
  [492, "Shaymin", ["grass"], 100, ["growth", "magical-leaf"], ["seed-flare", "aromatherapy", "energy-ball", "synthesis"]],
  [493, "Arceus", ["normal"], 120, ["tackle", "recover"], ["judgment", "hyper-beam", "extreme-speed", "cosmic-power"]],

  [494, 'Victini', ['psychic', 'fire'], 100, ['baton-pass', 'blaze-kick'], ['bounce', 'brick-break', 'charge-beam', 'confide']],
  [495, 'Snivy', ['grass'], 45, ['aerial-ace', 'aqua-tail'], ['attract', 'bind', 'bullet-seed', 'calm-mind']],
  [496, 'Servine', ['grass'], 60, ['aerial-ace', 'aqua-tail'], ['attract', 'bind', 'bullet-seed', 'calm-mind']],
  [497, 'Serperior', ['grass'], 75, ['aerial-ace', 'aqua-tail'], ['attract', 'bind', 'body-slam', 'breaking-swipe']],
  [498, 'Tepig', ['fire'], 65, ['assurance', 'attract'], ['body-slam', 'burn-up', 'confide', 'covet']],
  [499, 'Pignite', ['fire', 'fighting'], 90, ['arm-thrust', 'assurance'], ['attract', 'body-slam', 'brick-break', 'bulk-up']],
  [500, 'Emboar', ['fire', 'fighting'], 110, ['arm-thrust', 'assurance'], ['attract', 'blast-burn', 'block', 'body-press']],
  [501, 'Oshawott', ['water'], 55, ['aerial-ace', 'air-slash'], ['aqua-cutter', 'aqua-jet', 'aqua-tail', 'assurance']],
  [502, 'Dewott', ['water'], 75, ['aerial-ace', 'air-slash'], ['aqua-cutter', 'aqua-jet', 'aqua-tail', 'attract']],
  [503, 'Samurott', ['water'], 95, ['aerial-ace', 'air-slash'], ['aqua-cutter', 'aqua-jet', 'aqua-tail', 'attract']],
  [504, 'Patrat', ['normal'], 45, ['after-you', 'aqua-tail'], ['assurance', 'attract', 'baton-pass', 'bide']],
  [505, 'Watchog', ['normal'], 60, ['after-you', 'aqua-tail'], ['attract', 'baton-pass', 'bide', 'bite']],
  [506, 'Lillipup', ['normal'], 45, ['aerial-ace', 'after-you'], ['attract', 'baby-doll-eyes', 'bite', 'charm']],
  [507, 'Herdier', ['normal'], 65, ['aerial-ace', 'after-you'], ['attract', 'baby-doll-eyes', 'bite', 'charm']],
  [508, 'Stoutland', ['normal'], 85, ['aerial-ace', 'after-you'], ['attract', 'baby-doll-eyes', 'bite', 'charm']],
  [509, 'Purrloin', ['dark'], 41, ['aerial-ace', 'assist'], ['assurance', 'attract', 'baton-pass', 'captivate']],
  [510, 'Liepard', ['dark'], 64, ['aerial-ace', 'assist'], ['assurance', 'attract', 'baton-pass', 'burning-jealousy']],
  [511, 'Pansage', ['grass'], 50, ['acrobatics', 'astonish'], ['attract', 'bite', 'bullet-seed', 'confide']],
  [512, 'Simisage', ['grass'], 75, ['acrobatics', 'attract'], ['brick-break', 'confide', 'covet', 'cut']],
  [513, 'Pansear', ['fire'], 50, ['acrobatics', 'amnesia'], ['astonish', 'attract', 'belch', 'bite']],
  [514, 'Simisear', ['fire'], 75, ['acrobatics', 'attract'], ['brick-break', 'confide', 'covet', 'cut']],
  [515, 'Panpour', ['water'], 50, ['acrobatics', 'aqua-ring'], ['aqua-tail', 'astonish', 'attract', 'bite']],
  [516, 'Simipour', ['water'], 75, ['acrobatics', 'aqua-tail'], ['attract', 'blizzard', 'brick-break', 'confide']],
  [517, 'Munna', ['psychic'], 76, ['after-you', 'ally-switch'], ['amnesia', 'attract', 'barrier', 'baton-pass']],
  [518, 'Musharna', ['psychic'], 116, ['after-you', 'ally-switch'], ['amnesia', 'attract', 'calm-mind', 'charge-beam']],
  [519, 'Pidove', ['normal', 'flying'], 50, ['aerial-ace', 'agility'], ['air-cutter', 'air-slash', 'attract', 'bestow']],
  [520, 'Tranquill', ['normal', 'flying'], 62, ['aerial-ace', 'agility'], ['air-cutter', 'air-slash', 'attract', 'confide']],
  [521, 'Unfezant', ['normal', 'flying'], 80, ['aerial-ace', 'agility'], ['air-cutter', 'air-slash', 'attract', 'brave-bird']],
  [522, 'Blitzle', ['electric'], 45, ['agility', 'attract'], ['baton-pass', 'body-slam', 'bounce', 'charge']],
  [523, 'Zebstrika', ['electric'], 75, ['agility', 'ally-switch'], ['attract', 'baton-pass', 'body-slam', 'bounce']],
  [524, 'Roggenrola', ['rock'], 55, ['attract', 'autotomize'], ['block', 'body-press', 'bulldoze', 'confide']],
  [525, 'Boldore', ['rock'], 70, ['attract', 'block'], ['body-press', 'bulldoze', 'confide', 'double-team']],
  [526, 'Gigalith', ['rock'], 85, ['attract', 'block'], ['body-press', 'bulldoze', 'confide', 'double-team']],
  [527, 'Woobat', ['psychic', 'flying'], 65, ['acrobatics', 'aerial-ace'], ['after-you', 'air-cutter', 'air-slash', 'ally-switch']],
  [528, 'Swoobat', ['psychic', 'flying'], 67, ['acrobatics', 'aerial-ace'], ['after-you', 'air-cutter', 'air-slash', 'ally-switch']],
  [529, 'Drilbur', ['ground'], 60, ['aerial-ace', 'attract'], ['brick-break', 'bulldoze', 'confide', 'crush-claw']],
  [530, 'Excadrill', ['ground', 'steel'], 110, ['aerial-ace', 'attract'], ['body-slam', 'brick-break', 'brutal-swing', 'bulldoze']],
  [531, 'Audino', ['normal'], 103, ['after-you', 'ally-switch'], ['amnesia', 'attract', 'baby-doll-eyes', 'bestow']],
  [532, 'Timburr', ['fighting'], 75, ['attract', 'bide'], ['block', 'brick-break', 'brutal-swing', 'bulk-up']],
  [533, 'Gurdurr', ['fighting'], 85, ['attract', 'bide'], ['block', 'brick-break', 'brutal-swing', 'bulk-up']],
  [534, 'Conkeldurr', ['fighting'], 105, ['attract', 'bide'], ['block', 'body-slam', 'brick-break', 'brutal-swing']],
  [535, 'Tympole', ['water'], 50, ['acid', 'after-you'], ['aqua-ring', 'attract', 'bounce', 'bubble']],
  [536, 'Palpitoad', ['water', 'ground'], 75, ['acid', 'after-you'], ['aqua-ring', 'attract', 'bounce', 'bubble']],
  [537, 'Seismitoad', ['water', 'ground'], 105, ['acid', 'after-you'], ['aqua-ring', 'attract', 'bounce', 'brick-break']],
  [538, 'Throh', ['fighting'], 120, ['attract', 'bide'], ['bind', 'block', 'body-slam', 'brick-break']],
  [539, 'Sawk', ['fighting'], 75, ['attract', 'bide'], ['block', 'brick-break', 'bulk-up', 'bulldoze']],
  [540, 'Sewaddle', ['bug', 'grass'], 45, ['agility', 'air-slash'], ['attract', 'baton-pass', 'bug-bite', 'bug-buzz']],
  [541, 'Swadloon', ['bug', 'grass'], 55, ['attract', 'baton-pass'], ['bug-bite', 'bug-buzz', 'calm-mind', 'charm']],
  [542, 'Leavanny', ['bug', 'grass'], 75, ['aerial-ace', 'agility'], ['air-slash', 'attract', 'baton-pass', 'bug-bite']],
  [543, 'Venipede', ['bug', 'poison'], 30, ['agility', 'attract'], ['bite', 'bug-bite', 'confide', 'defense-curl']],
  [544, 'Whirlipede', ['bug', 'poison'], 40, ['agility', 'attract'], ['bug-bite', 'confide', 'defense-curl', 'double-edge']],
  [545, 'Scolipede', ['bug', 'poison'], 60, ['agility', 'aqua-tail'], ['assurance', 'attract', 'baton-pass', 'bug-bite']],
  [546, 'Cottonee', ['grass', 'fairy'], 40, ['absorb', 'attract'], ['beat-up', 'captivate', 'charm', 'confide']],
  [547, 'Whimsicott', ['grass', 'fairy'], 60, ['absorb', 'attract'], ['beat-up', 'charm', 'confide', 'cotton-guard']],
  [548, 'Petilil', ['grass'], 45, ['absorb', 'after-you'], ['aromatherapy', 'attract', 'bide', 'bullet-seed']],
  [549, 'Lilligant', ['grass'], 70, ['absorb', 'after-you'], ['alluring-voice', 'aromatherapy', 'attract', 'bullet-seed']],
  [550, 'Basculin-red-striped', ['water'], 70, ['agility', 'aqua-jet'], ['aqua-tail', 'assurance', 'attract', 'bite']],
  [551, 'Sandile', ['ground', 'dark'], 50, ['aqua-tail', 'assurance'], ['attract', 'beat-up', 'bite', 'body-slam']],
  [552, 'Krokorok', ['ground', 'dark'], 60, ['aerial-ace', 'aqua-tail'], ['assurance', 'attract', 'beat-up', 'bite']],
  [553, 'Krookodile', ['ground', 'dark'], 95, ['aerial-ace', 'aqua-tail'], ['assurance', 'attract', 'beat-up', 'bite']],
  [554, 'Darumaka', ['fire'], 70, ['attract', 'belly-drum'], ['bite', 'brick-break', 'confide', 'dig']],
  [555, 'Darmanitan-standard', ['fire'], 105, ['attract', 'belly-drum'], ['bite', 'body-press', 'body-slam', 'brick-break']],
  [556, 'Maractus', ['grass'], 75, ['absorb', 'acupressure'], ['aerial-ace', 'after-you', 'assurance', 'attract']],
  [557, 'Dwebble', ['bug', 'rock'], 50, ['aerial-ace', 'attract'], ['block', 'bug-bite', 'bulldoze', 'confide']],
  [558, 'Crustle', ['bug', 'rock'], 70, ['aerial-ace', 'attract'], ['block', 'body-press', 'bug-bite', 'bulldoze']],
  [559, 'Scraggy', ['dark', 'fighting'], 50, ['acid-spray', 'amnesia'], ['assurance', 'attract', 'beat-up', 'brick-break']],
  [560, 'Scrafty', ['dark', 'fighting'], 65, ['acid-spray', 'amnesia'], ['assurance', 'attract', 'beat-up', 'body-slam']],
  [561, 'Sigilyph', ['psychic', 'flying'], 72, ['aerial-ace', 'air-cutter'], ['air-slash', 'ancient-power', 'attract', 'calm-mind']],
  [562, 'Yamask', ['ghost'], 38, ['after-you', 'ally-switch'], ['astonish', 'attract', 'block', 'calm-mind']],
  [563, 'Cofagrigus', ['ghost'], 58, ['after-you', 'ally-switch'], ['astonish', 'attract', 'block', 'body-press']],
  [564, 'Tirtouga', ['water', 'rock'], 54, ['ancient-power', 'aqua-jet'], ['aqua-tail', 'attract', 'bide', 'bite']],
  [565, 'Carracosta', ['water', 'rock'], 74, ['ancient-power', 'aqua-jet'], ['aqua-tail', 'attract', 'bide', 'bite']],
  [566, 'Archen', ['rock', 'flying'], 55, ['acrobatics', 'aerial-ace'], ['agility', 'ally-switch', 'ancient-power', 'aqua-tail']],
  [567, 'Archeops', ['rock', 'flying'], 75, ['acrobatics', 'aerial-ace'], ['agility', 'air-slash', 'ally-switch', 'ancient-power']],
  [568, 'Trubbish', ['poison'], 50, ['acid-spray', 'amnesia'], ['attract', 'autotomize', 'belch', 'clear-smog']],
  [569, 'Garbodor', ['poison'], 80, ['acid-spray', 'amnesia'], ['attract', 'belch', 'body-press', 'body-slam']],
  [570, 'Zorua', ['dark'], 40, ['aerial-ace', 'agility'], ['assurance', 'attract', 'bounce', 'burning-jealousy']],
  [571, 'Zoroark', ['dark'], 60, ['aerial-ace', 'agility'], ['assurance', 'attract', 'body-slam', 'bounce']],
  [572, 'Minccino', ['normal'], 55, ['after-you', 'alluring-voice'], ['aqua-tail', 'attract', 'baby-doll-eyes', 'baton-pass']],
  [573, 'Cinccino', ['normal'], 75, ['after-you', 'alluring-voice'], ['aqua-tail', 'attract', 'baby-doll-eyes', 'baton-pass']],
  [574, 'Gothita', ['psychic'], 45, ['ally-switch', 'attract'], ['calm-mind', 'captivate', 'charge-beam', 'charm']],
  [575, 'Gothorita', ['psychic'], 60, ['ally-switch', 'attract'], ['calm-mind', 'charge-beam', 'charm', 'confide']],
  [576, 'Gothitelle', ['psychic'], 70, ['ally-switch', 'attract'], ['body-slam', 'brick-break', 'calm-mind', 'charge-beam']],
  [577, 'Solosis', ['psychic'], 45, ['acid-armor', 'after-you'], ['ally-switch', 'astonish', 'attract', 'calm-mind']],
  [578, 'Duosion', ['psychic'], 65, ['acid-armor', 'after-you'], ['ally-switch', 'astonish', 'attract', 'calm-mind']],
  [579, 'Reuniclus', ['psychic'], 110, ['acid-armor', 'after-you'], ['ally-switch', 'astonish', 'attract', 'body-slam']],
  [580, 'Ducklett', ['water', 'flying'], 62, ['aerial-ace', 'air-cutter'], ['air-slash', 'aqua-jet', 'aqua-ring', 'attract']],
  [581, 'Swanna', ['water', 'flying'], 75, ['acrobatics', 'aerial-ace'], ['air-cutter', 'air-slash', 'alluring-voice', 'aqua-jet']],
  [582, 'Vanillite', ['ice'], 36, ['acid-armor', 'ally-switch'], ['astonish', 'attract', 'aurora-veil', 'autotomize']],
  [583, 'Vanillish', ['ice'], 51, ['acid-armor', 'ally-switch'], ['astonish', 'attract', 'avalanche', 'blizzard']],
  [584, 'Vanilluxe', ['ice'], 71, ['acid-armor', 'ally-switch'], ['astonish', 'attract', 'avalanche', 'beat-up']],
  [585, 'Deerling', ['normal', 'grass'], 60, ['agility', 'aromatherapy'], ['attract', 'baton-pass', 'body-slam', 'bounce']],
  [586, 'Sawsbuck', ['normal', 'grass'], 80, ['agility', 'aromatherapy'], ['attract', 'baton-pass', 'body-slam', 'bounce']],
  [587, 'Emolga', ['electric', 'flying'], 55, ['acrobatics', 'aerial-ace'], ['agility', 'air-slash', 'astonish', 'attract']],
  [588, 'Karrablast', ['bug'], 50, ['acid-spray', 'aerial-ace'], ['attract', 'bug-bite', 'bug-buzz', 'confide']],
  [589, 'Escavalier', ['bug', 'steel'], 70, ['acid-spray', 'aerial-ace'], ['agility', 'attract', 'brutal-swing', 'bug-bite']],
  [590, 'Foongus', ['grass', 'poison'], 69, ['absorb', 'after-you'], ['astonish', 'attract', 'bide', 'body-slam']],
  [591, 'Amoonguss', ['grass', 'poison'], 114, ['absorb', 'after-you'], ['astonish', 'attract', 'bide', 'body-slam']],
  [592, 'Frillish-male', ['water', 'ghost'], 55, ['absorb', 'acid-armor'], ['attract', 'bind', 'blizzard', 'brine']],
  [593, 'Jellicent-male', ['water', 'ghost'], 100, ['absorb', 'acid-armor'], ['attract', 'bind', 'blizzard', 'brine']],
  [594, 'Alomomola', ['water'], 165, ['acrobatics', 'alluring-voice'], ['aqua-jet', 'aqua-ring', 'attract', 'baton-pass']],
  [595, 'Joltik', ['bug', 'electric'], 50, ['absorb', 'agility'], ['attract', 'bounce', 'bug-bite', 'bug-buzz']],
  [596, 'Galvantula', ['bug', 'electric'], 70, ['absorb', 'agility'], ['attract', 'bounce', 'bug-bite', 'bug-buzz']],
  [597, 'Ferroseed', ['grass', 'steel'], 44, ['acid-spray', 'assurance'], ['attract', 'bullet-seed', 'confide', 'curse']],
  [598, 'Ferrothorn', ['grass', 'steel'], 74, ['aerial-ace', 'assurance'], ['attract', 'block', 'body-press', 'brutal-swing']],
  [599, 'Klink', ['steel'], 40, ['assurance', 'autotomize'], ['bind', 'charge', 'charge-beam', 'confide']],
  [600, 'Klang', ['steel'], 60, ['ally-switch', 'assurance'], ['autotomize', 'bind', 'charge', 'charge-beam']],
  [601, 'Klinklang', ['steel'], 60, ['ally-switch', 'assurance'], ['autotomize', 'bind', 'charge', 'charge-beam']],
  [602, 'Tynamo', ['electric'], 35, ['charge', 'charge-beam'], ['knock-off', 'magnet-rise', 'spark', 'tackle']],
  [603, 'Eelektrik', ['electric'], 65, ['acid', 'acid-spray'], ['acrobatics', 'aqua-tail', 'attract', 'bind']],
  [604, 'Eelektross', ['electric'], 85, ['acid', 'acid-spray'], ['acrobatics', 'aqua-tail', 'attract', 'bind']],
  [605, 'Elgyem', ['psychic'], 55, ['after-you', 'agility'], ['ally-switch', 'astonish', 'attract', 'barrier']],
  [606, 'Beheeyem', ['psychic'], 75, ['after-you', 'agility'], ['ally-switch', 'attract', 'calm-mind', 'charge-beam']],
  [607, 'Litwick', ['ghost', 'fire'], 50, ['acid', 'acid-armor'], ['ally-switch', 'astonish', 'attract', 'burning-jealousy']],
  [608, 'Lampent', ['ghost', 'fire'], 60, ['acid-armor', 'ally-switch'], ['astonish', 'attract', 'burning-jealousy', 'calm-mind']],
  [609, 'Chandelure', ['ghost', 'fire'], 60, ['acid-armor', 'ally-switch'], ['astonish', 'attract', 'burning-jealousy', 'calm-mind']],
  [610, 'Axew', ['dragon'], 46, ['aerial-ace', 'aqua-tail'], ['assurance', 'attract', 'bite', 'breaking-swipe']],
  [611, 'Fraxure', ['dragon'], 66, ['aerial-ace', 'aqua-tail'], ['assurance', 'attract', 'bite', 'breaking-swipe']],
  [612, 'Haxorus', ['dragon'], 76, ['aerial-ace', 'aqua-tail'], ['assurance', 'attract', 'bite', 'body-slam']],
  [613, 'Cubchoo', ['ice'], 55, ['aerial-ace', 'assurance'], ['attract', 'avalanche', 'bide', 'blizzard']],
  [614, 'Beartic', ['ice'], 95, ['aerial-ace', 'aqua-jet'], ['assurance', 'attract', 'avalanche', 'bide']],
  [615, 'Cryogonal', ['ice'], 80, ['acid-armor', 'acrobatics'], ['ancient-power', 'attract', 'aurora-beam', 'aurora-veil']],
  [616, 'Shelmet', ['bug'], 50, ['absorb', 'acid'], ['acid-armor', 'attract', 'baton-pass', 'bide']],
  [617, 'Accelgor', ['bug'], 80, ['absorb', 'acid'], ['acid-armor', 'acid-spray', 'agility', 'attract']],
  [618, 'Stunfisk', ['ground', 'electric'], 109, ['aqua-tail', 'astonish'], ['attract', 'bide', 'bounce', 'bulldoze']],
  [619, 'Mienfoo', ['fighting'], 45, ['acrobatics', 'aerial-ace'], ['agility', 'ally-switch', 'attract', 'aura-sphere']],
  [620, 'Mienshao', ['fighting'], 65, ['acrobatics', 'aerial-ace'], ['agility', 'ally-switch', 'assurance', 'attract']],
  [621, 'Druddigon', ['dragon'], 77, ['aerial-ace', 'aqua-tail'], ['attract', 'bite', 'body-slam', 'bulldoze']],
  [622, 'Golett', ['ground', 'ghost'], 59, ['ally-switch', 'astonish'], ['block', 'body-slam', 'brick-break', 'bulldoze']],
  [623, 'Golurk', ['ground', 'ghost'], 89, ['ally-switch', 'astonish'], ['block', 'body-press', 'body-slam', 'brick-break']],
  [624, 'Pawniard', ['dark', 'steel'], 45, ['aerial-ace', 'air-slash'], ['assurance', 'attract', 'beat-up', 'brick-break']],
  [625, 'Bisharp', ['dark', 'steel'], 65, ['aerial-ace', 'air-slash'], ['assurance', 'attract', 'beat-up', 'brick-break']],
  [626, 'Bouffalant', ['normal'], 95, ['aerial-ace', 'amnesia'], ['assurance', 'attract', 'belch', 'body-slam']],
  [627, 'Rufflet', ['normal', 'flying'], 70, ['acrobatics', 'aerial-ace'], ['agility', 'air-cutter', 'air-slash', 'assurance']],
  [628, 'Braviary', ['normal', 'flying'], 100, ['acrobatics', 'aerial-ace'], ['agility', 'air-cutter', 'air-slash', 'assurance']],
  [629, 'Vullaby', ['dark', 'flying'], 70, ['aerial-ace', 'air-cutter'], ['air-slash', 'assurance', 'attract', 'block']],
  [630, 'Mandibuzz', ['dark', 'flying'], 110, ['acrobatics', 'aerial-ace'], ['air-cutter', 'air-slash', 'assurance', 'attract']],
  [631, 'Heatmor', ['fire'], 85, ['aerial-ace', 'amnesia'], ['attract', 'belch', 'bind', 'body-slam']],
  [632, 'Durant', ['bug', 'steel'], 58, ['aerial-ace', 'agility'], ['attract', 'baton-pass', 'beat-up', 'bite']],
  [633, 'Deino', ['dark', 'dragon'], 52, ['aqua-tail', 'assurance'], ['astonish', 'attract', 'belch', 'bite']],
  [634, 'Zweilous', ['dark', 'dragon'], 72, ['aqua-tail', 'assurance'], ['attract', 'beat-up', 'bite', 'body-slam']],
  [635, 'Hydreigon', ['dark', 'dragon'], 92, ['acrobatics', 'aqua-tail'], ['assurance', 'attract', 'beat-up', 'bite']],
  [636, 'Larvesta', ['bug', 'fire'], 55, ['absorb', 'acrobatics'], ['amnesia', 'attract', 'body-slam', 'bug-bite']],
  [637, 'Volcarona', ['bug', 'fire'], 85, ['absorb', 'acrobatics'], ['aerial-ace', 'air-cutter', 'air-slash', 'amnesia']],
  [638, 'Cobalion', ['steel', 'fighting'], 91, ['aerial-ace', 'air-slash'], ['aura-sphere', 'block', 'body-press', 'body-slam']],
  [639, 'Terrakion', ['rock', 'fighting'], 91, ['aerial-ace', 'air-slash'], ['aura-sphere', 'block', 'body-slam', 'brick-break']],
  [640, 'Virizion', ['grass', 'fighting'], 91, ['aerial-ace', 'air-slash'], ['aura-sphere', 'block', 'body-slam', 'bounce']],
  [641, 'Tornadus-incarnate', ['flying'], 79, ['acrobatics', 'aerial-ace'], ['agility', 'air-cutter', 'air-slash', 'assurance']],
  [642, 'Thundurus-incarnate', ['electric', 'flying'], 79, ['acrobatics', 'agility'], ['assurance', 'astonish', 'attract', 'bite']],
  [643, 'Reshiram', ['dragon', 'fire'], 100, ['ancient-power', 'blue-flare'], ['body-press', 'body-slam', 'breaking-swipe', 'brutal-swing']],
  [644, 'Zekrom', ['dragon', 'electric'], 100, ['ancient-power', 'body-press'], ['body-slam', 'bolt-strike', 'breaking-swipe', 'brick-break']],
  [645, 'Landorus-incarnate', ['ground', 'flying'], 89, ['attract', 'bite'], ['block', 'body-slam', 'brick-break', 'brutal-swing']],
  [646, 'Kyurem', ['dragon', 'ice'], 125, ['aerial-ace', 'ancient-power'], ['avalanche', 'blizzard', 'body-press', 'body-slam']],
  [647, 'Keldeo-ordinary', ['water', 'fighting'], 91, ['aerial-ace', 'air-slash'], ['aqua-jet', 'aqua-tail', 'aura-sphere', 'baton-pass']],
  [648, 'Meloetta-aria', ['normal', 'psychic'], 100, ['acrobatics', 'alluring-voice'], ['ally-switch', 'baton-pass', 'brick-break', 'calm-mind']],
  [649, 'Genesect', ['bug', 'steel'], 71, ['aerial-ace', 'ally-switch'], ['assurance', 'blaze-kick', 'blizzard', 'bug-bite']],
  [650, 'Chespin', ['grass'], 56, ['aerial-ace', 'attract'], ['belly-drum', 'bite', 'body-slam', 'brick-break']],
  [651, 'Quilladin', ['grass'], 61, ['aerial-ace', 'attract'], ['belly-drum', 'bite', 'body-slam', 'brick-break']],
  [652, 'Chesnaught', ['grass', 'fighting'], 88, ['aerial-ace', 'attract'], ['belly-drum', 'bite', 'block', 'body-press']],
  [653, 'Fennekin', ['fire'], 40, ['agility', 'attract'], ['burning-jealousy', 'calm-mind', 'charm', 'confide']],
  [654, 'Braixen', ['fire'], 59, ['agility', 'ally-switch'], ['attract', 'burning-jealousy', 'calm-mind', 'charm']],
  [655, 'Delphox', ['fire', 'psychic'], 75, ['agility', 'ally-switch'], ['attract', 'blast-burn', 'burning-jealousy', 'calm-mind']],
  [656, 'Froakie', ['water'], 41, ['acrobatics', 'aerial-ace'], ['attract', 'bestow', 'blizzard', 'bounce']],
  [657, 'Frogadier', ['water'], 54, ['acrobatics', 'aerial-ace'], ['attract', 'blizzard', 'bounce', 'bubble']],
  [658, 'Greninja', ['water', 'dark'], 72, ['acrobatics', 'aerial-ace'], ['attract', 'blizzard', 'bounce', 'brick-break']],
  [659, 'Bunnelby', ['normal'], 38, ['agility', 'attract'], ['bounce', 'brick-break', 'bulk-up', 'bulldoze']],
  [660, 'Diggersby', ['normal', 'ground'], 85, ['agility', 'attract'], ['body-slam', 'bounce', 'brick-break', 'brutal-swing']],
  [661, 'Fletchling', ['normal', 'flying'], 45, ['acrobatics', 'aerial-ace'], ['agility', 'air-cutter', 'air-slash', 'attract']],
  [662, 'Fletchinder', ['fire', 'flying'], 62, ['acrobatics', 'aerial-ace'], ['agility', 'air-cutter', 'air-slash', 'attract']],
  [663, 'Talonflame', ['fire', 'flying'], 78, ['acrobatics', 'aerial-ace'], ['agility', 'air-cutter', 'air-slash', 'attract']],
  [664, 'Scatterbug', ['bug'], 38, ['bug-bite', 'poison-powder'], ['pounce', 'rage-powder', 'string-shot', 'struggle-bug']],
  [665, 'Spewpa', ['bug'], 45, ['bug-bite', 'electroweb'], ['harden', 'iron-defense', 'pounce', 'protect']],
  [666, 'Vivillon', ['bug', 'flying'], 80, ['acrobatics', 'aerial-ace'], ['air-cutter', 'air-slash', 'aromatherapy', 'attract']],
  [667, 'Litleo', ['fire', 'normal'], 62, ['acrobatics', 'attract'], ['body-slam', 'bulldoze', 'confide', 'crunch']],
  [668, 'Pyroar-male', ['fire', 'normal'], 86, ['acrobatics', 'attract'], ['body-slam', 'bounce', 'bulldoze', 'burning-jealousy']],
  [669, 'Flabebe', ['fairy'], 44, ['after-you', 'alluring-voice'], ['ally-switch', 'aromatherapy', 'attract', 'baton-pass']],
  [670, 'Floette', ['fairy'], 54, ['after-you', 'alluring-voice'], ['ally-switch', 'aromatherapy', 'attract', 'baton-pass']],
  [671, 'Florges', ['fairy'], 78, ['after-you', 'alluring-voice'], ['ally-switch', 'aromatherapy', 'attract', 'baton-pass']],
  [672, 'Skiddo', ['grass'], 66, ['attract', 'body-slam'], ['brick-break', 'bulk-up', 'bulldoze', 'bullet-seed']],
  [673, 'Gogoat', ['grass'], 123, ['aerial-ace', 'attract'], ['body-slam', 'bounce', 'brick-break', 'bulk-up']],
  [674, 'Pancham', ['fighting'], 67, ['aerial-ace', 'arm-thrust'], ['attract', 'block', 'body-slam', 'brick-break']],
  [675, 'Pangoro', ['fighting', 'dark'], 95, ['aerial-ace', 'arm-thrust'], ['attract', 'beat-up', 'block', 'body-slam']],
  [676, 'Furfrou', ['normal'], 75, ['attract', 'baby-doll-eyes'], ['bite', 'captivate', 'charge-beam', 'charm']],
  [677, 'Espurr', ['psychic'], 62, ['ally-switch', 'assist'], ['attract', 'barrier', 'calm-mind', 'charge-beam']],
  [678, 'Meowstic-male', ['psychic'], 74, ['alluring-voice', 'ally-switch'], ['attract', 'baton-pass', 'calm-mind', 'charge-beam']],
  [679, 'Honedge', ['steel', 'ghost'], 45, ['aerial-ace', 'after-you'], ['attract', 'autotomize', 'block', 'brick-break']],
  [680, 'Doublade', ['steel', 'ghost'], 59, ['aerial-ace', 'after-you'], ['attract', 'autotomize', 'brick-break', 'brutal-swing']],
  [681, 'Aegislash-shield', ['steel', 'ghost'], 60, ['aerial-ace', 'after-you'], ['air-slash', 'attract', 'autotomize', 'block']],
  [682, 'Spritzee', ['fairy'], 78, ['after-you', 'ally-switch'], ['aromatherapy', 'attract', 'calm-mind', 'captivate']],
  [683, 'Aromatisse', ['fairy'], 101, ['after-you', 'ally-switch'], ['aromatherapy', 'aromatic-mist', 'attract', 'calm-mind']],
  [684, 'Swirlix', ['fairy'], 62, ['after-you', 'amnesia'], ['aromatherapy', 'attract', 'belly-drum', 'calm-mind']],
  [685, 'Slurpuff', ['fairy'], 82, ['after-you', 'amnesia'], ['aromatherapy', 'attract', 'calm-mind', 'charm']],
  [686, 'Inkay', ['dark', 'psychic'], 53, ['acupressure', 'aerial-ace'], ['ally-switch', 'attract', 'baton-pass', 'bind']],
  [687, 'Malamar', ['dark', 'psychic'], 86, ['acupressure', 'aerial-ace'], ['ally-switch', 'attract', 'baton-pass', 'bind']],
  [688, 'Binacle', ['rock', 'water'], 42, ['aerial-ace', 'ancient-power'], ['assurance', 'attract', 'beat-up', 'blizzard']],
  [689, 'Barbaracle', ['rock', 'water'], 72, ['aerial-ace', 'ancient-power'], ['assurance', 'attract', 'beat-up', 'blizzard']],
  [690, 'Skrelp', ['poison', 'water'], 50, ['acid', 'acid-armor'], ['acid-spray', 'aqua-tail', 'attract', 'bounce']],
  [691, 'Dragalge', ['poison', 'dragon'], 65, ['acid', 'acid-spray'], ['aqua-tail', 'attract', 'bounce', 'bubble']],
  [692, 'Clauncher', ['water'], 50, ['aqua-jet', 'aqua-tail'], ['attract', 'aura-sphere', 'blizzard', 'bounce']],
  [693, 'Clawitzer', ['water'], 71, ['aqua-jet', 'aqua-tail'], ['attract', 'aura-sphere', 'blizzard', 'body-slam']],
  [694, 'Helioptile', ['electric', 'normal'], 44, ['agility', 'ally-switch'], ['attract', 'bulldoze', 'camouflage', 'charge']],
  [695, 'Heliolisk', ['electric', 'normal'], 62, ['agility', 'ally-switch'], ['attract', 'breaking-swipe', 'brutal-swing', 'bulldoze']],
  [696, 'Tyrunt', ['rock', 'dragon'], 58, ['aerial-ace', 'ancient-power'], ['assurance', 'attract', 'bide', 'bite']],
  [697, 'Tyrantrum', ['rock', 'dragon'], 82, ['aerial-ace', 'ancient-power'], ['assurance', 'attract', 'bide', 'bite']],
  [698, 'Amaura', ['rock', 'ice'], 77, ['ancient-power', 'aqua-tail'], ['attract', 'aurora-beam', 'aurora-veil', 'avalanche']],
  [699, 'Aurorus', ['rock', 'ice'], 123, ['ancient-power', 'aqua-tail'], ['attract', 'aurora-beam', 'avalanche', 'blizzard']],
  [700, 'Sylveon', ['fairy'], 95, ['alluring-voice', 'attract'], ['baby-doll-eyes', 'baton-pass', 'bite', 'body-slam']],
  [701, 'Hawlucha', ['fighting', 'flying'], 78, ['acrobatics', 'aerial-ace'], ['agility', 'ally-switch', 'assurance', 'attract']],
  [702, 'Dedenne', ['electric', 'fairy'], 67, ['aerial-ace', 'agility'], ['ally-switch', 'attract', 'charge', 'charge-beam']],
  [703, 'Carbink', ['rock', 'fairy'], 50, ['after-you', 'ally-switch'], ['ancient-power', 'body-press', 'body-slam', 'calm-mind']],
  [704, 'Goomy', ['dragon'], 45, ['absorb', 'acid-armor'], ['acid-spray', 'attract', 'bide', 'body-slam']],
  [705, 'Sliggoo', ['dragon'], 68, ['absorb', 'acid-armor'], ['acid-spray', 'attract', 'bide', 'blizzard']],
  [706, 'Goodra', ['dragon'], 90, ['absorb', 'acid-spray'], ['aqua-tail', 'assurance', 'attract', 'bide']],
  [707, 'Klefki', ['steel', 'fairy'], 57, ['astonish', 'attract'], ['calm-mind', 'confide', 'covet', 'crafty-shield']],
  [708, 'Phantump', ['ghost', 'grass'], 43, ['ally-switch', 'astonish'], ['attract', 'bestow', 'branch-poke', 'bulldoze']],
  [709, 'Trevenant', ['ghost', 'grass'], 85, ['ally-switch', 'astonish'], ['attract', 'block', 'branch-poke', 'brutal-swing']],
  [710, 'Pumpkaboo-average', ['ghost', 'grass'], 49, ['ally-switch', 'astonish'], ['attract', 'bestow', 'bullet-seed', 'charge-beam']],
  [711, 'Gourgeist-average', ['ghost', 'grass'], 65, ['ally-switch', 'astonish'], ['attract', 'brutal-swing', 'bullet-seed', 'charge-beam']],
  [712, 'Bergmite', ['ice'], 55, ['after-you', 'attract'], ['aurora-veil', 'avalanche', 'barrier', 'bite']],
  [713, 'Avalugg', ['ice'], 95, ['after-you', 'attract'], ['avalanche', 'bite', 'blizzard', 'block']],
  [714, 'Noibat', ['flying', 'dragon'], 40, ['absorb', 'acrobatics'], ['aerial-ace', 'agility', 'air-cutter', 'air-slash']],
  [715, 'Noivern', ['flying', 'dragon'], 85, ['absorb', 'acrobatics'], ['aerial-ace', 'agility', 'air-cutter', 'air-slash']],
  [716, 'Xerneas', ['fairy'], 126, ['aromatherapy', 'aurora-beam'], ['block', 'body-slam', 'calm-mind', 'close-combat']],
  [717, 'Yveltal', ['dark', 'flying'], 126, ['acrobatics', 'aerial-ace'], ['air-slash', 'block', 'body-slam', 'confide']],
  [718, 'Zygarde-50', ['dragon', 'ground'], 108, ['bind', 'bite'], ['block', 'body-slam', 'breaking-swipe', 'brick-break']],
  [719, 'Diancie', ['rock', 'fairy'], 50, ['after-you', 'ally-switch'], ['amnesia', 'ancient-power', 'baton-pass', 'body-press']],
  [720, 'Hoopa', ['psychic', 'ghost'], 80, ['ally-switch', 'astonish'], ['block', 'brick-break', 'calm-mind', 'charge-beam']],
  [721, 'Volcanion', ['fire', 'water'], 80, ['body-press', 'body-slam'], ['brick-break', 'bulldoze', 'confide', 'cut']],
  [722, 'Rowlet', ['grass', 'flying'], 68, ['aerial-ace', 'air-cutter'], ['air-slash', 'astonish', 'attract', 'baton-pass']],
  [723, 'Dartrix', ['grass', 'flying'], 78, ['aerial-ace', 'air-cutter'], ['air-slash', 'astonish', 'attract', 'baton-pass']],
  [724, 'Decidueye', ['grass', 'ghost'], 78, ['acrobatics', 'aerial-ace'], ['air-cutter', 'air-slash', 'astonish', 'attract']],
  [725, 'Litten', ['fire'], 45, ['acrobatics', 'attract'], ['bite', 'body-slam', 'bulk-up', 'confide']],
  [726, 'Torracat', ['fire'], 65, ['acrobatics', 'attract'], ['bite', 'body-slam', 'bulk-up', 'confide']],
  [727, 'Incineroar', ['fire', 'dark'], 95, ['acrobatics', 'aerial-ace'], ['assurance', 'attract', 'baton-pass', 'bind']],
  [728, 'Popplio', ['water'], 50, ['acrobatics', 'amnesia'], ['aqua-jet', 'aqua-ring', 'aqua-tail', 'aromatic-mist']],
  [729, 'Brionne', ['water'], 60, ['acrobatics', 'amnesia'], ['aqua-jet', 'aqua-ring', 'aqua-tail', 'attract']],
  [730, 'Primarina', ['water', 'fairy'], 80, ['acrobatics', 'alluring-voice'], ['amnesia', 'aqua-jet', 'aqua-ring', 'aqua-tail']],
  [731, 'Pikipek', ['normal', 'flying'], 35, ['acrobatics', 'aerial-ace'], ['air-cutter', 'air-slash', 'attract', 'boomburst']],
  [732, 'Trumbeak', ['normal', 'flying'], 55, ['acrobatics', 'aerial-ace'], ['air-cutter', 'air-slash', 'attract', 'boomburst']],
  [733, 'Toucannon', ['normal', 'flying'], 80, ['acrobatics', 'aerial-ace'], ['air-cutter', 'air-slash', 'attract', 'beak-blast']],
  [734, 'Yungoos', ['normal'], 48, ['attract', 'bide'], ['bite', 'bulldoze', 'chilling-water', 'confide']],
  [735, 'Gumshoos', ['normal'], 88, ['attract', 'bide'], ['bite', 'block', 'body-slam', 'bulldoze']],
  [736, 'Grubbin', ['bug'], 47, ['acrobatics', 'attract'], ['baton-pass', 'bite', 'bug-bite', 'charge']],
  [737, 'Charjabug', ['bug', 'electric'], 57, ['acrobatics', 'attract'], ['baton-pass', 'bite', 'bug-bite', 'charge']],
  [738, 'Vikavolt', ['bug', 'electric'], 77, ['acrobatics', 'agility'], ['air-slash', 'attract', 'baton-pass', 'bite']],
  [739, 'Crabrawler', ['fighting'], 47, ['amnesia', 'attract'], ['body-slam', 'brick-break', 'brutal-swing', 'bubble']],
  [740, 'Crabominable', ['fighting', 'ice'], 97, ['amnesia', 'attract'], ['avalanche', 'blizzard', 'block', 'body-press']],
  [741, 'Oricorio-baile', ['fire', 'flying'], 75, ['acrobatics', 'aerial-ace'], ['agility', 'air-cutter', 'air-slash', 'alluring-voice']],
  [742, 'Cutiefly', ['bug', 'fairy'], 40, ['absorb', 'acrobatics'], ['aerial-ace', 'after-you', 'ally-switch', 'aromatherapy']],
  [743, 'Ribombee', ['bug', 'fairy'], 60, ['absorb', 'acrobatics'], ['aerial-ace', 'after-you', 'agility', 'alluring-voice']],
  [744, 'Rockruff', ['rock'], 45, ['attract', 'bite'], ['body-slam', 'bulldoze', 'charm', 'confide']],
  [745, 'Lycanroc-midday', ['rock'], 75, ['accelerock', 'agility'], ['assurance', 'attract', 'bite', 'body-slam']],
  [746, 'Wishiwashi-solo', ['water'], 45, ['aqua-ring', 'aqua-tail'], ['attract', 'beat-up', 'brine', 'bulldoze']],
  [747, 'Mareanie', ['poison', 'water'], 50, ['acid-spray', 'after-you'], ['attract', 'bite', 'blizzard', 'brine']],
  [748, 'Toxapex', ['poison', 'water'], 50, ['acid-spray', 'after-you'], ['attract', 'baneful-bunker', 'bite', 'blizzard']],
  [749, 'Mudbray', ['ground'], 70, ['attract', 'bide'], ['body-slam', 'bulldoze', 'close-combat', 'confide']],
  [750, 'Mudsdale', ['ground'], 100, ['attract', 'bide'], ['body-press', 'body-slam', 'bulldoze', 'close-combat']],
  [751, 'Dewpider', ['water', 'bug'], 38, ['aqua-ring', 'attract'], ['aurora-beam', 'bite', 'blizzard', 'bubble']],
  [752, 'Araquanid', ['water', 'bug'], 68, ['aqua-ring', 'attract'], ['bite', 'blizzard', 'body-slam', 'bubble']],
  [753, 'Fomantis', ['grass'], 40, ['aromatherapy', 'attract'], ['bug-bite', 'bullet-seed', 'confide', 'defog']],
  [754, 'Lurantis', ['grass'], 70, ['aerial-ace', 'attract'], ['brick-break', 'bug-bite', 'bullet-seed', 'confide']],
  [755, 'Morelull', ['grass', 'fairy'], 40, ['absorb', 'after-you'], ['amnesia', 'astonish', 'attract', 'confide']],
  [756, 'Shiinotic', ['grass', 'fairy'], 60, ['absorb', 'after-you'], ['amnesia', 'astonish', 'attract', 'charge-beam']],
  [757, 'Salandit', ['poison', 'fire'], 48, ['acid-spray', 'agility'], ['attract', 'beat-up', 'belch', 'burning-jealousy']],
  [758, 'Salazzle', ['poison', 'fire'], 68, ['acid-spray', 'acrobatics'], ['agility', 'attract', 'beat-up', 'body-slam']],
  [759, 'Stufful', ['normal', 'fighting'], 70, ['aerial-ace', 'attract'], ['baby-doll-eyes', 'bide', 'bind', 'brick-break']],
  [760, 'Bewear', ['normal', 'fighting'], 120, ['aerial-ace', 'attract'], ['baby-doll-eyes', 'bide', 'bind', 'body-press']],
  [761, 'Bounsweet', ['grass'], 42, ['acupressure', 'aromatherapy'], ['aromatic-mist', 'attract', 'bounce', 'bullet-seed']],
  [762, 'Steenee', ['grass'], 52, ['aromatherapy', 'aromatic-mist'], ['attract', 'bounce', 'bullet-seed', 'captivate']],
  [763, 'Tsareena', ['grass'], 72, ['acrobatics', 'aromatherapy'], ['aromatic-mist', 'attract', 'bounce', 'bullet-seed']],
  [764, 'Comfey', ['fairy'], 51, ['acrobatics', 'after-you'], ['alluring-voice', 'ally-switch', 'amnesia', 'aromatherapy']],
  [765, 'Oranguru', ['normal', 'psychic'], 90, ['after-you', 'ally-switch'], ['attract', 'block', 'body-slam', 'brick-break']],
  [766, 'Passimian', ['fighting'], 100, ['acrobatics', 'aerial-ace'], ['assurance', 'attract', 'baton-pass', 'beat-up']],
  [767, 'Wimpod', ['bug', 'water'], 25, ['aqua-jet', 'assurance'], ['attract', 'bug-buzz', 'confide', 'defense-curl']],
  [768, 'Golisopod', ['bug', 'water'], 75, ['aerial-ace', 'assurance'], ['attract', 'blizzard', 'brick-break', 'bug-bite']],
  [769, 'Sandygast', ['ghost', 'ground'], 55, ['absorb', 'after-you'], ['amnesia', 'ancient-power', 'astonish', 'attract']],
  [770, 'Palossand', ['ghost', 'ground'], 85, ['absorb', 'after-you'], ['amnesia', 'astonish', 'attract', 'block']],
  [771, 'Pyukumuku', ['water'], 55, ['attract', 'baton-pass'], ['bestow', 'bide', 'block', 'confide']],
  [772, 'Type-null', ['normal'], 95, ['aerial-ace', 'air-slash'], ['confide', 'crush-claw', 'double-edge', 'double-hit']],
  [773, 'Silvally', ['normal'], 95, ['aerial-ace', 'air-slash'], ['bite', 'confide', 'crunch', 'crush-claw']],
  [774, 'Minior-red-meteor', ['rock', 'flying'], 60, ['acrobatics', 'ancient-power'], ['attract', 'autotomize', 'bulldoze', 'calm-mind']],
  [775, 'Komala', ['normal'], 65, ['acrobatics', 'attract'], ['body-slam', 'brick-break', 'bulk-up', 'bulldoze']],
  [776, 'Turtonator', ['fire', 'dragon'], 60, ['attract', 'block'], ['body-press', 'body-slam', 'brutal-swing', 'bulk-up']],
  [777, 'Togedemaru', ['electric', 'steel'], 65, ['after-you', 'agility'], ['assurance', 'attract', 'bounce', 'charge']],
  [778, 'Mimikyu-disguised', ['ghost', 'fairy'], 55, ['after-you', 'astonish'], ['attract', 'baby-doll-eyes', 'beat-up', 'bulk-up']],
  [779, 'Bruxish', ['water', 'psychic'], 68, ['aerial-ace', 'after-you'], ['agility', 'ally-switch', 'aqua-jet', 'aqua-tail']],
  [780, 'Drampa', ['normal', 'dragon'], 78, ['amnesia', 'attract'], ['blizzard', 'block', 'breaking-swipe', 'bulldoze']],
  [781, 'Dhelmise', ['ghost', 'grass'], 70, ['absorb', 'aerial-ace'], ['ally-switch', 'anchor-shot', 'assurance', 'astonish']],
  [782, 'Jangmo-o', ['dragon'], 45, ['aerial-ace', 'aqua-tail'], ['attract', 'bide', 'body-slam', 'breaking-swipe']],
  [783, 'Hakamo-o', ['dragon', 'fighting'], 55, ['aerial-ace', 'aqua-tail'], ['attract', 'autotomize', 'bide', 'body-slam']],
  [784, 'Kommo-o', ['dragon', 'fighting'], 75, ['aerial-ace', 'aqua-tail'], ['attract', 'aura-sphere', 'autotomize', 'belly-drum']],
  [785, 'Tapu-koko', ['electric', 'fairy'], 70, ['acrobatics', 'aerial-ace'], ['agility', 'assurance', 'brave-bird', 'calm-mind']],
  [786, 'Tapu-lele', ['psychic', 'fairy'], 70, ['ally-switch', 'aromatherapy'], ['aromatic-mist', 'astonish', 'calm-mind', 'charge-beam']],
  [787, 'Tapu-bulu', ['grass', 'fairy'], 70, ['brick-break', 'brutal-swing'], ['bulk-up', 'bullet-seed', 'calm-mind', 'close-combat']],
  [788, 'Tapu-fini', ['water', 'fairy'], 70, ['aqua-ring', 'blizzard'], ['brine', 'calm-mind', 'confide', 'dazzling-gleam']],
  [789, 'Cosmog', ['psychic'], 43, ['splash', 'teleport'], []],
  [790, 'Cosmoem', ['psychic'], 43, ['cosmic-power', 'teleport'], []],
  [791, 'Solgaleo', ['psychic', 'steel'], 137, ['agility', 'body-slam'], ['bulldoze', 'calm-mind', 'close-combat', 'confide']],
  [792, 'Lunala', ['psychic', 'ghost'], 137, ['acrobatics', 'aerial-ace'], ['agility', 'air-slash', 'blizzard', 'calm-mind']],
  [793, 'Nihilego', ['rock', 'poison'], 109, ['acid', 'acid-spray'], ['ally-switch', 'bind', 'body-slam', 'brutal-swing']],
  [794, 'Buzzwole', ['bug', 'fighting'], 107, ['body-slam', 'bounce'], ['brick-break', 'bug-bite', 'bulk-up', 'bulldoze']],
  [795, 'Pheromosa', ['bug', 'fighting'], 71, ['agility', 'assurance'], ['blizzard', 'block', 'bounce', 'brick-break']],
  [796, 'Xurkitree', ['electric'], 83, ['bind', 'brutal-swing'], ['calm-mind', 'charge', 'charge-beam', 'confide']],
  [797, 'Celesteela', ['steel', 'flying'], 97, ['absorb', 'acrobatics'], ['air-slash', 'autotomize', 'block', 'body-slam']],
  [798, 'Kartana', ['grass', 'steel'], 59, ['aerial-ace', 'air-cutter'], ['air-slash', 'brick-break', 'calm-mind', 'confide']],
  [799, 'Guzzlord', ['dark', 'dragon'], 223, ['amnesia', 'belch'], ['bite', 'body-press', 'body-slam', 'brick-break']],
  [800, 'Necrozma', ['psychic'], 97, ['aerial-ace', 'ally-switch'], ['autotomize', 'body-slam', 'breaking-swipe', 'brick-break']],
  [801, 'Magearna', ['steel', 'fairy'], 80, ['after-you', 'agility'], ['aura-sphere', 'aurora-beam', 'baton-pass', 'body-slam']],
  [802, 'Marshadow', ['fighting', 'ghost'], 90, ['acrobatics', 'agility'], ['assurance', 'aura-sphere', 'blaze-kick', 'bounce']],
  [803, 'Poipole', ['poison'], 67, ['acid', 'charm'], ['confide', 'covet', 'dragon-pulse', 'echoed-voice']],
  [804, 'Naganadel', ['poison', 'dragon'], 73, ['acid', 'acrobatics'], ['aerial-ace', 'air-cutter', 'air-slash', 'ally-switch']],
  [805, 'Stakataka', ['rock', 'steel'], 61, ['ally-switch', 'autotomize'], ['bide', 'bind', 'block', 'body-press']],
  [806, 'Blacephalon', ['fire', 'ghost'], 53, ['after-you', 'astonish'], ['calm-mind', 'confide', 'confuse-ray', 'dark-pulse']],
  [807, 'Zeraora', ['electric'], 88, ['acrobatics', 'aerial-ace'], ['agility', 'assurance', 'aura-sphere', 'blaze-kick']],
  [808, 'Meltan', ['steel'], 46, ['acid-armor', 'endure'], ['facade', 'flash-cannon', 'gyro-ball', 'harden']],
  [809, 'Melmetal', ['steel'], 135, ['acid-armor', 'body-press'], ['body-slam', 'brick-break', 'brutal-swing', 'darkest-lariat']],
  [810, 'Grookey', ['grass'], 50, ['acrobatics', 'assurance'], ['attract', 'body-slam', 'branch-poke', 'bullet-seed']],
  [811, 'Thwackey', ['grass'], 70, ['acrobatics', 'assurance'], ['attract', 'body-slam', 'branch-poke', 'bullet-seed']],
  [812, 'Rillaboom', ['grass'], 100, ['acrobatics', 'assurance'], ['attract', 'body-press', 'body-slam', 'boomburst']],
  [813, 'Scorbunny', ['fire'], 50, ['acrobatics', 'agility'], ['ally-switch', 'assurance', 'attract', 'baton-pass']],
  [814, 'Raboot', ['fire'], 65, ['acrobatics', 'agility'], ['ally-switch', 'assurance', 'attract', 'baton-pass']],
  [815, 'Cinderace', ['fire'], 80, ['acrobatics', 'agility'], ['ally-switch', 'assurance', 'attract', 'baton-pass']],
  [816, 'Sobble', ['water'], 50, ['aqua-jet', 'aqua-ring'], ['attract', 'baton-pass', 'bind', 'bounce']],
  [817, 'Drizzile', ['water'], 65, ['aqua-jet', 'aqua-ring'], ['attract', 'baton-pass', 'bind', 'bounce']],
  [818, 'Inteleon', ['water'], 70, ['acrobatics', 'agility'], ['air-cutter', 'air-slash', 'aqua-jet', 'aqua-ring']],
  [819, 'Skwovet', ['normal'], 70, ['amnesia', 'assurance'], ['attract', 'belch', 'belly-drum', 'bite']],
  [820, 'Greedent', ['normal'], 120, ['amnesia', 'assurance'], ['attract', 'belch', 'bite', 'body-press']],
  [821, 'Rookidee', ['flying'], 38, ['aerial-ace', 'agility'], ['air-cutter', 'air-slash', 'assurance', 'attract']],
  [822, 'Corvisquire', ['flying'], 68, ['aerial-ace', 'agility'], ['air-cutter', 'air-slash', 'assurance', 'attract']],
  [823, 'Corviknight', ['flying', 'steel'], 98, ['aerial-ace', 'agility'], ['air-cutter', 'air-slash', 'assurance', 'attract']],
  [824, 'Blipbug', ['bug'], 25, ['infestation', 'recover'], ['sticky-web', 'struggle-bug', 'supersonic']],
  [825, 'Dottler', ['bug', 'psychic'], 50, ['ally-switch', 'attract'], ['body-press', 'bug-buzz', 'calm-mind', 'confusion']],
  [826, 'Orbeetle', ['bug', 'psychic'], 60, ['after-you', 'agility'], ['ally-switch', 'attract', 'baton-pass', 'body-press']],
  [827, 'Nickit', ['dark'], 40, ['agility', 'assurance'], ['attract', 'baton-pass', 'beat-up', 'dig']],
  [828, 'Thievul', ['dark'], 70, ['acrobatics', 'agility'], ['assurance', 'attract', 'baton-pass', 'beat-up']],
  [829, 'Gossifleur', ['grass'], 40, ['aromatherapy', 'attract'], ['bullet-seed', 'charm', 'endure', 'energy-ball']],
  [830, 'Eldegoss', ['grass'], 60, ['aromatherapy', 'attract'], ['bullet-seed', 'charm', 'cotton-guard', 'cotton-spore']],
  [831, 'Wooloo', ['normal'], 42, ['agility', 'attract'], ['copycat', 'cotton-guard', 'counter', 'defense-curl']],
  [832, 'Dubwool', ['normal'], 72, ['agility', 'attract'], ['baton-pass', 'body-press', 'body-slam', 'bounce']],
  [833, 'Chewtle', ['water'], 50, ['assurance', 'attract'], ['bite', 'body-slam', 'chilling-water', 'counter']],
  [834, 'Drednaw', ['water', 'rock'], 90, ['assurance', 'attract'], ['bite', 'blizzard', 'body-press', 'body-slam']],
  [835, 'Yamper', ['electric'], 59, ['attract', 'bite'], ['charge', 'charm', 'crunch', 'dig']],
  [836, 'Boltund', ['electric'], 69, ['agility', 'attract'], ['bite', 'bulk-up', 'charge', 'charm']],
  [837, 'Rolycoly', ['rock'], 30, ['ancient-power', 'attract'], ['block', 'body-slam', 'bulldoze', 'curse']],
  [838, 'Carkol', ['rock', 'fire'], 80, ['ancient-power', 'attract'], ['body-press', 'body-slam', 'bulldoze', 'burn-up']],
  [839, 'Coalossal', ['rock', 'fire'], 110, ['ancient-power', 'attract'], ['body-press', 'body-slam', 'bulldoze', 'burn-up']],
  [840, 'Applin', ['grass', 'dragon'], 40, ['astonish', 'attract'], ['defense-curl', 'draco-meteor', 'grassy-glide', 'pounce']],
  [841, 'Flapple', ['grass', 'dragon'], 70, ['acid-spray', 'acrobatics'], ['aerial-ace', 'air-slash', 'astonish', 'attract']],
  [842, 'Appletun', ['grass', 'dragon'], 110, ['amnesia', 'apple-acid'], ['astonish', 'attract', 'body-press', 'body-slam']],
  [843, 'Silicobra', ['ground'], 52, ['attract', 'belch'], ['body-slam', 'brutal-swing', 'bulldoze', 'coil']],
  [844, 'Sandaconda', ['ground'], 72, ['attract', 'body-press'], ['body-slam', 'brutal-swing', 'bulldoze', 'coil']],
  [845, 'Cramorant', ['flying', 'water'], 70, ['acrobatics', 'aerial-ace'], ['agility', 'air-cutter', 'air-slash', 'amnesia']],
  [846, 'Arrokuda', ['water'], 41, ['acupressure', 'agility'], ['aqua-jet', 'assurance', 'attract', 'bite']],
  [847, 'Barraskewda', ['water'], 61, ['agility', 'aqua-jet'], ['assurance', 'attract', 'bite', 'blizzard']],
  [848, 'Toxel', ['electric', 'poison'], 40, ['acid', 'attract'], ['belch', 'charm', 'encore', 'endeavor']],
  [849, 'Toxtricity-amped', ['electric', 'poison'], 75, ['acid', 'acid-spray'], ['attract', 'belch', 'boomburst', 'brick-break']],
  [850, 'Sizzlipede', ['fire', 'bug'], 50, ['attract', 'bite'], ['brutal-swing', 'bug-bite', 'bug-buzz', 'burn-up']],
  [851, 'Centiskorch', ['fire', 'bug'], 100, ['attract', 'bite'], ['brutal-swing', 'bug-bite', 'bug-buzz', 'burn-up']],
  [852, 'Clobbopus', ['fighting'], 50, ['attract', 'bind'], ['body-slam', 'brick-break', 'brine', 'bulk-up']],
  [853, 'Grapploct', ['fighting'], 80, ['attract', 'bind'], ['body-slam', 'brick-break', 'brine', 'brutal-swing']],
  [854, 'Sinistea', ['ghost'], 40, ['ally-switch', 'aromatherapy'], ['aromatic-mist', 'astonish', 'baton-pass', 'calm-mind']],
  [855, 'Polteageist', ['ghost'], 60, ['ally-switch', 'aromatherapy'], ['aromatic-mist', 'astonish', 'baton-pass', 'calm-mind']],
  [856, 'Hatenna', ['psychic'], 42, ['after-you', 'aromatherapy'], ['aromatic-mist', 'attract', 'baton-pass', 'calm-mind']],
  [857, 'Hattrem', ['psychic'], 57, ['aromatherapy', 'aromatic-mist'], ['attract', 'baton-pass', 'brutal-swing', 'calm-mind']],
  [858, 'Hatterene', ['psychic', 'fairy'], 57, ['agility', 'aromatherapy'], ['aromatic-mist', 'attract', 'baton-pass', 'brutal-swing']],
  [859, 'Impidimp', ['dark', 'fairy'], 45, ['assurance', 'attract'], ['bite', 'burning-jealousy', 'chilling-water', 'confide']],
  [860, 'Morgrem', ['dark', 'fairy'], 65, ['assurance', 'attract'], ['bite', 'burning-jealousy', 'chilling-water', 'confide']],
  [861, 'Grimmsnarl', ['dark', 'fairy'], 95, ['assurance', 'attract'], ['bite', 'body-press', 'body-slam', 'brick-break']],
  [862, 'Obstagoon', ['dark', 'normal'], 93, ['assurance', 'attract'], ['baby-doll-eyes', 'blizzard', 'body-press', 'body-slam']],
  [863, 'Perrserker', ['steel'], 70, ['amnesia', 'assurance'], ['attract', 'baton-pass', 'body-slam', 'brick-break']],
  [864, 'Cursola', ['ghost'], 60, ['amnesia', 'ancient-power'], ['astonish', 'attract', 'blizzard', 'body-slam']],
  [865, 'Sirfetchd', ['fighting'], 62, ['assurance', 'attract'], ['body-slam', 'brave-bird', 'brick-break', 'brutal-swing']],
  [866, 'Mr-rime', ['ice', 'psychic'], 80, ['after-you', 'ally-switch'], ['attract', 'avalanche', 'baton-pass', 'blizzard']],
  [867, 'Runerigus', ['ground', 'ghost'], 58, ['ally-switch', 'amnesia'], ['astonish', 'attract', 'body-press', 'brutal-swing']],
  [868, 'Milcery', ['fairy'], 45, ['acid-armor', 'aromatherapy'], ['aromatic-mist', 'attract', 'baby-doll-eyes', 'charm']],
  [869, 'Alcremie', ['fairy'], 65, ['acid-armor', 'alluring-voice'], ['aromatherapy', 'aromatic-mist', 'attract', 'baby-doll-eyes']],
  [870, 'Falinks', ['fighting'], 65, ['agility', 'assurance'], ['beat-up', 'body-press', 'body-slam', 'brick-break']],
  [871, 'Pincurchin', ['electric'], 48, ['acupressure', 'assurance'], ['attract', 'body-slam', 'brine', 'bubble-beam']],
  [872, 'Snom', ['ice', 'bug'], 30, ['attract', 'bug-bite'], ['bug-buzz', 'endure', 'facade', 'fairy-wind']],
  [873, 'Frosmoth', ['ice', 'bug'], 70, ['acrobatics', 'air-slash'], ['attract', 'aurora-beam', 'aurora-veil', 'avalanche']],
  [874, 'Stonjourner', ['rock'], 100, ['ancient-power', 'assurance'], ['attract', 'block', 'body-press', 'body-slam']],
  [875, 'Eiscue-ice', ['ice'], 75, ['agility', 'amnesia'], ['aqua-ring', 'attract', 'aurora-veil', 'avalanche']],
  [876, 'Indeedee-male', ['psychic', 'normal'], 60, ['after-you', 'ally-switch'], ['aromatherapy', 'attract', 'body-slam', 'calm-mind']],
  [877, 'Morpeko-full-belly', ['electric', 'dark'], 58, ['agility', 'assurance'], ['attract', 'aura-wheel', 'baton-pass', 'bite']],
  [878, 'Cufant', ['steel'], 72, ['attract', 'belch'], ['body-press', 'body-slam', 'brick-break', 'brutal-swing']],
  [879, 'Copperajah', ['steel'], 122, ['attract', 'body-press'], ['body-slam', 'brick-break', 'brutal-swing', 'bulldoze']],
  [880, 'Dracozolt', ['electric', 'dragon'], 90, ['aerial-ace', 'ancient-power'], ['body-slam', 'bolt-beak', 'breaking-swipe', 'brutal-swing']],
  [881, 'Arctozolt', ['electric', 'ice'], 90, ['ancient-power', 'avalanche'], ['blizzard', 'body-slam', 'bolt-beak', 'bulldoze']],
  [882, 'Dracovish', ['water', 'dragon'], 90, ['ancient-power', 'bite'], ['body-slam', 'brine', 'brutal-swing', 'bulldoze']],
  [883, 'Arctovish', ['water', 'ice'], 90, ['ancient-power', 'aurora-veil'], ['avalanche', 'bite', 'blizzard', 'body-slam']],
  [884, 'Duraludon', ['steel', 'dragon'], 70, ['attract', 'body-press'], ['body-slam', 'breaking-swipe', 'brick-break', 'dark-pulse']],
  [885, 'Dreepy', ['dragon', 'ghost'], 28, ['astonish', 'attract'], ['baton-pass', 'bite', 'confuse-ray', 'curse']],
  [886, 'Drakloak', ['dragon', 'ghost'], 68, ['acrobatics', 'agility'], ['ally-switch', 'assurance', 'astonish', 'attract']],
  [887, 'Dragapult', ['dragon', 'ghost'], 88, ['acrobatics', 'agility'], ['ally-switch', 'assurance', 'astonish', 'attract']],
  [888, 'Zacian', ['fairy'], 92, ['agility', 'air-slash'], ['assurance', 'bite', 'body-slam', 'brick-break']],
  [889, 'Zamazenta', ['fighting'], 92, ['agility', 'bite'], ['body-press', 'body-slam', 'brick-break', 'close-combat']],
  [890, 'Eternatus', ['poison', 'dragon'], 140, ['agility', 'assurance'], ['body-slam', 'brutal-swing', 'confuse-ray', 'cosmic-power']],
  [891, 'Kubfu', ['fighting'], 60, ['acrobatics', 'aerial-ace'], ['attract', 'body-slam', 'brick-break', 'bulk-up']],
  [892, 'Urshifu-single-strike', ['fighting', 'dark'], 100, ['acrobatics', 'aerial-ace'], ['assurance', 'attract', 'aura-sphere', 'beat-up']],
  [893, 'Zarude', ['dark', 'grass'], 105, ['acrobatics', 'aerial-ace'], ['assurance', 'bind', 'bite', 'body-slam']],
  [894, 'Regieleki', ['electric'], 80, ['acrobatics', 'agility'], ['ancient-power', 'assurance', 'body-slam', 'bounce']],
  [895, 'Regidrago', ['dragon'], 200, ['ancient-power', 'bite'], ['body-slam', 'breaking-swipe', 'crunch', 'draco-meteor']],
  [896, 'Glastrier', ['ice'], 100, ['assurance', 'avalanche'], ['blizzard', 'body-press', 'body-slam', 'bulldoze']],
  [897, 'Spectrier', ['ghost'], 100, ['agility', 'assurance'], ['body-slam', 'bulldoze', 'calm-mind', 'confuse-ray']],
  [898, 'Calyrex', ['psychic', 'grass'], 100, ['agility', 'ally-switch'], ['aromatherapy', 'baton-pass', 'body-press', 'bullet-seed']],
  [899, 'Wyrdeer', ['normal', 'psychic'], 103, ['agility', 'astonish'], ['body-slam', 'bulldoze', 'calm-mind', 'charge-beam']],
  [900, 'Kleavor', ['bug', 'rock'], 70, ['acrobatics', 'aerial-ace'], ['agility', 'air-cutter', 'air-slash', 'baton-pass']],
  [901, 'Ursaluna', ['ground', 'normal'], 130, ['aerial-ace', 'avalanche'], ['baby-doll-eyes', 'body-press', 'body-slam', 'brick-break']],
  [902, 'Basculegion-male', ['water', 'ghost'], 120, ['agility', 'aqua-jet'], ['bite', 'blizzard', 'chilling-water', 'confuse-ray']],
  [903, 'Sneasler', ['fighting', 'poison'], 80, ['acid-spray', 'acrobatics'], ['aerial-ace', 'agility', 'brick-break', 'bulk-up']],
  [904, 'Overqwil', ['dark', 'poison'], 85, ['acupressure', 'agility'], ['aqua-tail', 'barb-barrage', 'bite', 'blizzard']],
  [905, 'Enamorus-incarnate', ['fairy', 'flying'], 74, ['agility', 'alluring-voice'], ['astonish', 'bite', 'body-slam', 'calm-mind']],
  [906, 'Sprigatito', ['grass'], 40, ['acrobatics', 'agility'], ['ally-switch', 'bite', 'bullet-seed', 'charm']],
  [907, 'Floragato', ['grass'], 61, ['acrobatics', 'aerial-ace'], ['agility', 'bite', 'bullet-seed', 'charm']],
  [908, 'Meowscarada', ['grass', 'dark'], 76, ['acrobatics', 'aerial-ace'], ['agility', 'aura-sphere', 'bite', 'brick-break']],
  [909, 'Fuecoco', ['fire'], 67, ['belch', 'bite'], ['body-slam', 'crunch', 'curse', 'dig']],
  [910, 'Crocalor', ['fire'], 81, ['bite', 'body-slam'], ['crunch', 'curse', 'dig', 'disarming-voice']],
  [911, 'Skeledirge', ['fire', 'ghost'], 104, ['alluring-voice', 'bite'], ['blast-burn', 'body-slam', 'crunch', 'curse']],
  [912, 'Quaxly', ['water'], 55, ['acrobatics', 'aerial-ace'], ['air-cutter', 'air-slash', 'aqua-cutter', 'aqua-jet']],
  [913, 'Quaxwell', ['water'], 70, ['acrobatics', 'aerial-ace'], ['air-cutter', 'air-slash', 'aqua-cutter', 'aqua-jet']],
  [914, 'Quaquaval', ['water', 'fighting'], 85, ['acrobatics', 'aerial-ace'], ['agility', 'air-cutter', 'air-slash', 'aqua-cutter']],
  [915, 'Lechonk', ['normal'], 54, ['body-slam', 'bulldoze'], ['bullet-seed', 'chilling-water', 'covet', 'curse']],
  [916, 'Oinkologne-male', ['normal'], 110, ['belch', 'body-press'], ['body-slam', 'bulldoze', 'bullet-seed', 'chilling-water']],
  [917, 'Tarountula', ['bug'], 35, ['assurance', 'block'], ['body-slam', 'bug-bite', 'bug-buzz', 'bullet-seed']],
  [918, 'Spidops', ['bug'], 60, ['aerial-ace', 'assurance'], ['block', 'body-slam', 'brick-break', 'bug-bite']],
  [919, 'Nymble', ['bug'], 33, ['agility', 'assurance'], ['astonish', 'bug-bite', 'bug-buzz', 'counter']],
  [920, 'Lokix', ['bug', 'dark'], 71, ['aerial-ace', 'agility'], ['assurance', 'astonish', 'axe-kick', 'bounce']],
  [921, 'Pawmi', ['electric'], 45, ['agility', 'baton-pass'], ['bite', 'charge', 'charge-beam', 'charm']],
  [922, 'Pawmo', ['electric', 'fighting'], 60, ['agility', 'arm-thrust'], ['baton-pass', 'bite', 'charge', 'charge-beam']],
  [923, 'Pawmot', ['electric', 'fighting'], 70, ['agility', 'arm-thrust'], ['baton-pass', 'bite', 'body-press', 'brick-break']],
  [924, 'Tandemaus', ['normal'], 50, ['aerial-ace', 'after-you'], ['agility', 'baby-doll-eyes', 'baton-pass', 'beat-up']],
  [925, 'Maushold-family-of-four', ['normal'], 74, ['aerial-ace', 'agility'], ['baby-doll-eyes', 'beat-up', 'bullet-seed', 'charm']],
  [926, 'Fidough', ['fairy'], 37, ['agility', 'alluring-voice'], ['baby-doll-eyes', 'baton-pass', 'bite', 'body-slam']],
  [927, 'Dachsbun', ['fairy'], 57, ['agility', 'alluring-voice'], ['baby-doll-eyes', 'baton-pass', 'bite', 'body-press']],
  [928, 'Smoliv', ['grass', 'normal'], 41, ['absorb', 'bullet-seed'], ['charm', 'earth-power', 'endure', 'energy-ball']],
  [929, 'Dolliv', ['grass', 'normal'], 52, ['absorb', 'bullet-seed'], ['charm', 'earth-power', 'endure', 'energy-ball']],
  [930, 'Arboliva', ['grass', 'normal'], 78, ['absorb', 'alluring-voice'], ['bullet-seed', 'charm', 'dazzling-gleam', 'earth-power']],
  [931, 'Squawkabilly-green-plumage', ['normal', 'flying'], 82, ['aerial-ace', 'air-cutter'], ['air-slash', 'brave-bird', 'copycat', 'double-edge']],
  [932, 'Nacli', ['rock'], 55, ['ancient-power', 'body-slam'], ['bulldoze', 'curse', 'dig', 'earth-power']],
  [933, 'Naclstack', ['rock'], 60, ['body-press', 'body-slam'], ['bulldoze', 'curse', 'dig', 'double-edge']],
  [934, 'Garganacl', ['rock'], 100, ['avalanche', 'block'], ['body-press', 'body-slam', 'brick-break', 'bulldoze']],
  [935, 'Charcadet', ['fire'], 40, ['astonish', 'clear-smog'], ['confuse-ray', 'destiny-bond', 'disable', 'ember']],
  [936, 'Armarouge', ['fire', 'psychic'], 85, ['acid-spray', 'ally-switch'], ['armor-cannon', 'astonish', 'aura-sphere', 'calm-mind']],
  [937, 'Ceruledge', ['fire', 'ghost'], 75, ['ally-switch', 'astonish'], ['bitter-blade', 'brick-break', 'bulk-up', 'clear-smog']],
  [938, 'Tadbulb', ['electric'], 61, ['acid-spray', 'charge'], ['charge-beam', 'chilling-water', 'confuse-ray', 'discharge']],
  [939, 'Bellibolt', ['electric'], 109, ['acid-spray', 'charge'], ['charge-beam', 'chilling-water', 'confuse-ray', 'discharge']],
  [940, 'Wattrel', ['electric', 'flying'], 40, ['acrobatics', 'aerial-ace'], ['agility', 'air-cutter', 'air-slash', 'brave-bird']],
  [941, 'Kilowattrel', ['electric', 'flying'], 70, ['acrobatics', 'aerial-ace'], ['agility', 'air-cutter', 'air-slash', 'brave-bird']],
  [942, 'Maschiff', ['dark'], 60, ['bite', 'body-slam'], ['charm', 'crunch', 'dark-pulse', 'destiny-bond']],
  [943, 'Mabosstiff', ['dark'], 80, ['bite', 'body-slam'], ['charm', 'comeuppance', 'crunch', 'curse']],
  [944, 'Shroodle', ['poison', 'normal'], 40, ['acid-spray', 'acrobatics'], ['baton-pass', 'bite', 'copycat', 'cross-poison']],
  [945, 'Grafaiai', ['poison', 'normal'], 63, ['acid-spray', 'acrobatics'], ['baton-pass', 'dig', 'doodle', 'double-edge']],
  [946, 'Bramblin', ['grass', 'ghost'], 40, ['absorb', 'astonish'], ['beat-up', 'block', 'bullet-seed', 'confuse-ray']],
  [947, 'Brambleghast', ['grass', 'ghost'], 55, ['absorb', 'astonish'], ['beat-up', 'block', 'bullet-seed', 'confuse-ray']],
  [948, 'Toedscool', ['ground', 'grass'], 40, ['absorb', 'acid-spray'], ['acupressure', 'bullet-seed', 'confuse-ray', 'dazzling-gleam']],
  [949, 'Toedscruel', ['ground', 'grass'], 80, ['absorb', 'acid-spray'], ['bullet-seed', 'confuse-ray', 'dazzling-gleam', 'earth-power']],
  [950, 'Klawf', ['rock'], 70, ['ancient-power', 'body-slam'], ['brick-break', 'bulldoze', 'crabhammer', 'dig']],
  [951, 'Capsakid', ['grass'], 50, ['bite', 'bullet-seed'], ['crunch', 'endeavor', 'endure', 'energy-ball']],
  [952, 'Scovillain', ['grass', 'fire'], 65, ['bite', 'bullet-seed'], ['burning-jealousy', 'crunch', 'endeavor', 'endure']],
  [953, 'Rellor', ['bug'], 41, ['bug-bite', 'bug-buzz'], ['cosmic-power', 'defense-curl', 'dig', 'endure']],
  [954, 'Rabsca', ['bug', 'psychic'], 75, ['bug-bite', 'bug-buzz'], ['calm-mind', 'confuse-ray', 'confusion', 'dazzling-gleam']],
  [955, 'Flittle', ['psychic'], 30, ['agility', 'ally-switch'], ['baby-doll-eyes', 'baton-pass', 'calm-mind', 'confuse-ray']],
  [956, 'Espathra', ['psychic'], 95, ['aerial-ace', 'agility'], ['baby-doll-eyes', 'baton-pass', 'body-slam', 'brave-bird']],
  [957, 'Tinkatink', ['fairy', 'steel'], 50, ['astonish', 'baby-doll-eyes'], ['brutal-swing', 'covet', 'draining-kiss', 'encore']],
  [958, 'Tinkatuff', ['fairy', 'steel'], 65, ['astonish', 'baby-doll-eyes'], ['brick-break', 'brutal-swing', 'covet', 'draining-kiss']],
  [959, 'Tinkaton', ['fairy', 'steel'], 85, ['astonish', 'baby-doll-eyes'], ['brick-break', 'brutal-swing', 'bulldoze', 'covet']],
  [960, 'Wiglett', ['water'], 10, ['agility', 'aqua-jet'], ['blizzard', 'bulldoze', 'chilling-water', 'dig']],
  [961, 'Wugtrio', ['water'], 35, ['agility', 'aqua-jet'], ['blizzard', 'bulldoze', 'chilling-water', 'dig']],
  [962, 'Bombirdier', ['flying', 'dark'], 70, ['acrobatics', 'aerial-ace'], ['air-cutter', 'air-slash', 'brave-bird', 'curse']],
  [963, 'Finizen', ['water'], 70, ['acrobatics', 'agility'], ['aqua-jet', 'aqua-tail', 'astonish', 'blizzard']],
  [964, 'Palafin-zero', ['water'], 100, ['acrobatics', 'agility'], ['aqua-jet', 'aqua-tail', 'astonish', 'aura-sphere']],
  [965, 'Varoom', ['steel', 'poison'], 45, ['acid-spray', 'assurance'], ['body-slam', 'bulldoze', 'curse', 'double-edge']],
  [966, 'Revavroom', ['steel', 'poison'], 80, ['acid-spray', 'assurance'], ['body-slam', 'bulldoze', 'curse', 'double-edge']],
  [967, 'Cyclizar', ['dragon', 'normal'], 70, ['acrobatics', 'aerial-ace'], ['agility', 'aqua-tail', 'bite', 'body-slam']],
  [968, 'Orthworm', ['steel'], 70, ['body-press', 'body-slam'], ['bulldoze', 'coil', 'curse', 'dig']],
  [969, 'Glimmet', ['rock', 'poison'], 48, ['acid-armor', 'acid-spray'], ['ancient-power', 'confuse-ray', 'dazzling-gleam', 'endure']],
  [970, 'Glimmora', ['rock', 'poison'], 83, ['acid-armor', 'acid-spray'], ['ancient-power', 'confuse-ray', 'dazzling-gleam', 'earth-power']],
  [971, 'Greavard', ['ghost'], 50, ['ally-switch', 'bite'], ['bulldoze', 'charm', 'confuse-ray', 'crunch']],
  [972, 'Houndstone', ['ghost'], 72, ['bite', 'body-press'], ['bulldoze', 'charm', 'confuse-ray', 'crunch']],
  [973, 'Flamigo', ['flying', 'fighting'], 82, ['acrobatics', 'aerial-ace'], ['agility', 'air-cutter', 'air-slash', 'brave-bird']],
  [974, 'Cetoddle', ['ice'], 108, ['amnesia', 'avalanche'], ['belly-drum', 'blizzard', 'body-press', 'body-slam']],
  [975, 'Cetitan', ['ice'], 170, ['amnesia', 'avalanche'], ['blizzard', 'body-press', 'body-slam', 'bounce']],
  [976, 'Veluza', ['water', 'psychic'], 90, ['agility', 'aqua-cutter'], ['aqua-jet', 'blizzard', 'body-slam', 'chilling-water']],
  [977, 'Dondozo', ['water'], 150, ['aqua-tail', 'avalanche'], ['body-press', 'body-slam', 'bulldoze', 'chilling-water']],
  [978, 'Tatsugiri-curly', ['dragon', 'water'], 68, ['baton-pass', 'chilling-water'], ['counter', 'draco-meteor', 'dragon-cheer', 'dragon-dance']],
  [979, 'Annihilape', ['fighting', 'ghost'], 110, ['acrobatics', 'assurance'], ['body-slam', 'brick-break', 'bulk-up', 'bulldoze']],
  [980, 'Clodsire', ['poison', 'ground'], 130, ['acid-spray', 'amnesia'], ['body-press', 'body-slam', 'bulldoze', 'chilling-water']],
  [981, 'Farigiraf', ['normal', 'psychic'], 120, ['agility', 'amnesia'], ['assurance', 'astonish', 'baton-pass', 'body-slam']],
  [982, 'Dudunsparce-two-segment', ['normal'], 125, ['agility', 'air-slash'], ['amnesia', 'ancient-power', 'baton-pass', 'blizzard']],
  [983, 'Kingambit', ['dark', 'steel'], 100, ['aerial-ace', 'air-slash'], ['assurance', 'brick-break', 'dark-pulse', 'dig']],
  [984, 'Great-tusk', ['ground', 'fighting'], 115, ['body-press', 'body-slam'], ['brick-break', 'bulk-up', 'bulldoze', 'close-combat']],
  [985, 'Scream-tail', ['fairy', 'psychic'], 115, ['amnesia', 'baton-pass'], ['bite', 'blizzard', 'body-slam', 'boomburst']],
  [986, 'Brute-bonnet', ['grass', 'dark'], 111, ['absorb', 'astonish'], ['body-press', 'body-slam', 'bullet-seed', 'clear-smog']],
  [987, 'Flutter-mane', ['ghost', 'fairy'], 55, ['astonish', 'calm-mind'], ['charge-beam', 'charm', 'confuse-ray', 'dark-pulse']],
  [988, 'Slither-wing', ['bug', 'fighting'], 85, ['acrobatics', 'aerial-ace'], ['body-press', 'body-slam', 'brick-break', 'bug-bite']],
  [989, 'Sandy-shocks', ['electric', 'ground'], 85, ['body-press', 'body-slam'], ['bulldoze', 'charge', 'charge-beam', 'discharge']],
  [990, 'Iron-treads', ['ground', 'steel'], 90, ['body-press', 'body-slam'], ['bulldoze', 'defense-curl', 'double-edge', 'earth-power']],
  [991, 'Iron-bundle', ['ice', 'water'], 56, ['acrobatics', 'agility'], ['air-cutter', 'aurora-veil', 'avalanche', 'blizzard']],
  [992, 'Iron-hands', ['fighting', 'electric'], 154, ['arm-thrust', 'belly-drum'], ['body-press', 'body-slam', 'brick-break', 'bulldoze']],
  [993, 'Iron-jugulis', ['dark', 'flying'], 94, ['acrobatics', 'air-cutter'], ['air-slash', 'assurance', 'body-slam', 'charge-beam']],
  [994, 'Iron-moth', ['fire', 'poison'], 80, ['acid-spray', 'acrobatics'], ['agility', 'air-slash', 'bug-buzz', 'charge-beam']],
  [995, 'Iron-thorns', ['rock', 'electric'], 100, ['bite', 'blizzard'], ['body-press', 'body-slam', 'breaking-swipe', 'brick-break']],
  [996, 'Frigibax', ['dragon', 'ice'], 65, ['aqua-tail', 'avalanche'], ['bite', 'blizzard', 'body-slam', 'crunch']],
  [997, 'Arctibax', ['dragon', 'ice'], 90, ['aerial-ace', 'avalanche'], ['bite', 'blizzard', 'body-slam', 'brick-break']],
  [998, 'Baxcalibur', ['dragon', 'ice'], 115, ['aerial-ace', 'avalanche'], ['bite', 'blizzard', 'body-press', 'body-slam']],
  [999, 'Gimmighoul', ['ghost'], 45, ['astonish', 'confuse-ray'], ['endure', 'hex', 'light-screen', 'nasty-plot']],
  [1000, 'Gholdengo', ['steel', 'ghost'], 87, ['astonish', 'charge-beam'], ['confuse-ray', 'dazzling-gleam', 'electro-ball', 'endure']],
  [1001, 'Wo-chien', ['dark', 'grass'], 85, ['absorb', 'body-press'], ['body-slam', 'bullet-seed', 'dark-pulse', 'endure']],
  [1002, 'Chien-pao', ['dark', 'ice'], 80, ['acrobatics', 'aerial-ace'], ['avalanche', 'blizzard', 'brick-break', 'crunch']],
  [1003, 'Ting-lu', ['dark', 'ground'], 155, ['body-press', 'body-slam'], ['bulldoze', 'dark-pulse', 'dig', 'double-edge']],
  [1004, 'Chi-yu', ['dark', 'fire'], 55, ['bounce', 'burning-jealousy'], ['confuse-ray', 'crunch', 'dark-pulse', 'ember']],
  [1005, 'Roaring-moon', ['dragon', 'dark'], 105, ['acrobatics', 'aerial-ace'], ['air-slash', 'bite', 'body-press', 'body-slam']],
  [1006, 'Iron-valiant', ['fairy', 'fighting'], 74, ['aerial-ace', 'agility'], ['aura-sphere', 'brick-break', 'calm-mind', 'charge-beam']],
  [1007, 'Koraidon', ['fighting', 'dragon'], 100, ['acrobatics', 'agility'], ['ancient-power', 'body-press', 'body-slam', 'breaking-swipe']],
  [1008, 'Miraidon', ['electric', 'dragon'], 100, ['acrobatics', 'agility'], ['body-slam', 'calm-mind', 'charge', 'charge-beam']],
  [1009, 'Walking-wake', ['water', 'dragon'], 99, ['agility', 'aqua-jet'], ['bite', 'body-slam', 'breaking-swipe', 'chilling-water']],

];

export const POKEMON: PokemonSpecies[] = RAW_POKEMON.map(([id, name, types, baseHp, startingMoves, learnableMoves]) => ({
  id,
  name,
  types,
  baseHp,
  startingMoves,
  learnableMoves,
}));

export function getPokemon(id: number): PokemonSpecies | undefined {
  return POKEMON.find((p) => p.id === id);
}

// export function getSpriteUrl(id: number): string {
//   return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`;
// }
export function getSpriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}
export function getSpriteUrl2(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function getOfficialArtUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

// Animated front battle sprite (Showdown style) - used in battle scene
export function getBattleSpriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${id}.gif`;
}

// Evolution data
export type EvolutionMethod = "level" | "stone" | "trade";

export interface EvolutionData {
  from: number;
  to: number;
  method: EvolutionMethod;
  level?: number;       // for level-based
  stone?: string;       // item id for stone-based
}

// EVOLUÇÔES NIVEIS
export const EVOLUTIONS: EvolutionData[] = [
  // Starters
  { from: 1, to: 2, method: "level", level: 16 },
  { from: 2, to: 3, method: "level", level: 32 },
  { from: 4, to: 5, method: "level", level: 16 },
  { from: 5, to: 6, method: "level", level: 36 },
  { from: 7, to: 8, method: "level", level: 16 },
  { from: 8, to: 9, method: "level", level: 36 },
  // Caterpie line
  { from: 10, to: 11, method: "level", level: 7 },
  { from: 11, to: 12, method: "level", level: 10 },
  // Weedle line
  { from: 13, to: 14, method: "level", level: 7 },
  { from: 14, to: 15, method: "level", level: 10 },
  // Pidgey line
  { from: 16, to: 17, method: "level", level: 18 },
  { from: 17, to: 18, method: "level", level: 36 },
  // Rattata
  { from: 19, to: 20, method: "level", level: 20 },
  // Spearow
  { from: 21, to: 22, method: "level", level: 20 },
  // Ekans
  { from: 23, to: 24, method: "level", level: 22 },
  // Pikachu - Thunder Stone
  { from: 25, to: 26, method: "stone", stone: "thunder-stone" },
  // Sandshrew
  { from: 27, to: 28, method: "level", level: 22 },
  // Nidoran F line
  { from: 29, to: 30, method: "level", level: 16 },
  { from: 30, to: 31, method: "stone", stone: "moon-stone" },
  // Nidoran M line
  { from: 32, to: 33, method: "level", level: 16 },
  { from: 33, to: 34, method: "stone", stone: "moon-stone" },
  // Clefairy - Moon Stone
  { from: 35, to: 36, method: "stone", stone: "moon-stone" },
  // Vulpix - Fire Stone
  { from: 37, to: 38, method: "stone", stone: "fire-stone" },
  // Jigglypuff - Moon Stone
  { from: 39, to: 40, method: "stone", stone: "moon-stone" },
  // Zubat
  { from: 41, to: 42, method: "level", level: 22 },
  // Oddish line
  { from: 43, to: 44, method: "level", level: 21 },
  { from: 44, to: 45, method: "stone", stone: "leaf-stone" },
  // Paras
  { from: 46, to: 47, method: "level", level: 24 },
  // Venonat
  { from: 48, to: 49, method: "level", level: 31 },
  // Diglett
  { from: 50, to: 51, method: "level", level: 26 },
  // Meowth
  { from: 52, to: 53, method: "level", level: 28 },
  // Psyduck
  { from: 54, to: 55, method: "level", level: 33 },
  // Mankey
  { from: 56, to: 57, method: "level", level: 28 },
  // Growlithe - Fire Stone
  { from: 58, to: 59, method: "stone", stone: "fire-stone" },
  // Poliwag line
  { from: 60, to: 61, method: "level", level: 25 },
  { from: 61, to: 62, method: "stone", stone: "water-stone" },
  // Abra line
  { from: 63, to: 64, method: "level", level: 16 },
  { from: 64, to: 65, method: "trade" },
  // Machop line
  { from: 66, to: 67, method: "level", level: 28 },
  { from: 67, to: 68, method: "trade" },
  // Bellsprout line
  { from: 69, to: 70, method: "level", level: 21 },
  { from: 70, to: 71, method: "stone", stone: "leaf-stone" },
  // Tentacool
  { from: 72, to: 73, method: "level", level: 30 },
  // Geodude line
  { from: 74, to: 75, method: "level", level: 25 },
  { from: 75, to: 76, method: "trade" },
  // Ponyta
  { from: 77, to: 78, method: "level", level: 40 },
  // Slowpoke
  { from: 79, to: 80, method: "level", level: 37 },
  // Magnemite
  { from: 81, to: 82, method: "level", level: 30 },
  // Doduo
  { from: 84, to: 85, method: "level", level: 31 },
  // Seel
  { from: 86, to: 87, method: "level", level: 34 },
  // Grimer
  { from: 88, to: 89, method: "level", level: 38 },
  // Shellder - Water Stone
  { from: 90, to: 91, method: "stone", stone: "water-stone" },
  // Gastly line
  { from: 92, to: 93, method: "level", level: 25 },
  { from: 93, to: 94, method: "trade" },
  // Drowzee
  { from: 96, to: 97, method: "level", level: 26 },
  // Krabby
  { from: 98, to: 99, method: "level", level: 28 },
  // Voltorb
  { from: 100, to: 101, method: "level", level: 30 },
  // Exeggcute - Leaf Stone
  { from: 102, to: 103, method: "stone", stone: "leaf-stone" },
  // Cubone
  { from: 104, to: 105, method: "level", level: 28 },
  // Koffing
  { from: 109, to: 110, method: "level", level: 35 },
  // Rhyhorn
  { from: 111, to: 112, method: "level", level: 42 },
  // Horsea
  { from: 116, to: 117, method: "level", level: 32 },
  // Goldeen
  { from: 118, to: 119, method: "level", level: 33 },
  // Staryu - Water Stone
  { from: 120, to: 121, method: "stone", stone: "water-stone" },
  // Magikarp
  { from: 129, to: 130, method: "level", level: 20 },
  // Eevee evolutions - stones
  { from: 133, to: 134, method: "stone", stone: "water-stone" },
  { from: 133, to: 135, method: "stone", stone: "thunder-stone" },
  { from: 133, to: 136, method: "stone", stone: "fire-stone" },
  // Omanyte
  { from: 138, to: 139, method: "level", level: 40 },
  // Kabuto
  { from: 140, to: 141, method: "level", level: 40 },
  // Dratini line
  { from: 147, to: 148, method: "level", level: 30 },
  { from: 148, to: 149, method: "level", level: 55 },
  // Cross-gen evolutions (Gen 1 -> Gen 2)
  { from: 42, to: 169, method: "level", level: 36 },  // Golbat -> Crobat
  { from: 44, to: 182, method: "stone", stone: "sun-stone" },  // Gloom -> Bellossom
  { from: 61, to: 186, method: "stone", stone: "kings-rock" },  // Poliwhirl -> Politoed
  { from: 79, to: 199, method: "stone", stone: "kings-rock" },  // Slowpoke -> Slowking
  { from: 95, to: 208, method: "stone", stone: "metal-coat" },  // Onix -> Steelix
  { from: 117, to: 230, method: "stone", stone: "dragon-scale" },  // Seadra -> Kingdra
  { from: 123, to: 212, method: "stone", stone: "metal-coat" },  // Scyther -> Scizor
  { from: 137, to: 233, method: "stone", stone: "up-grade" },  // Porygon -> Porygon2
  { from: 113, to: 242, method: "level", level: 40 },  // Chansey -> Blissey
  // Eevee Gen 2 evolutions
  { from: 133, to: 196, method: "level", level: 25 },  // Eevee -> Espeon (friendship/day)
  { from: 133, to: 197, method: "level", level: 25 },  // Eevee -> Umbreon (friendship/night)
  // Baby -> Gen 1 evolutions
  { from: 172, to: 25, method: "level", level: 10 },  // Pichu -> Pikachu
  { from: 173, to: 35, method: "level", level: 10 },  // Cleffa -> Clefairy
  { from: 174, to: 39, method: "level", level: 10 },  // Igglybuff -> Jigglypuff
  { from: 175, to: 176, method: "level", level: 20 },  // Togepi -> Togetic
  { from: 236, to: 106, method: "level", level: 20 },  // Tyrogue -> Hitmonlee
  { from: 236, to: 107, method: "level", level: 20 },  // Tyrogue -> Hitmonchan
  { from: 236, to: 237, method: "level", level: 20 },  // Tyrogue -> Hitmontop
  { from: 238, to: 124, method: "level", level: 30 },  // Smoochum -> Jynx
  { from: 239, to: 125, method: "level", level: 30 },  // Elekid -> Electabuzz
  { from: 240, to: 126, method: "level", level: 30 },  // Magby -> Magmar
  // Gen 2 Starters
  { from: 152, to: 153, method: "level", level: 16 },
  { from: 153, to: 154, method: "level", level: 32 },
  { from: 155, to: 156, method: "level", level: 14 },
  { from: 156, to: 157, method: "level", level: 36 },
  { from: 158, to: 159, method: "level", level: 18 },
  { from: 159, to: 160, method: "level", level: 30 },
  // Gen 2 regulars
  { from: 161, to: 162, method: "level", level: 15 },  // Sentret -> Furret
  { from: 163, to: 164, method: "level", level: 20 },  // Hoothoot -> Noctowl
  { from: 165, to: 166, method: "level", level: 18 },  // Ledyba -> Ledian
  { from: 167, to: 168, method: "level", level: 22 },  // Spinarak -> Ariados
  { from: 170, to: 171, method: "level", level: 27 },  // Chinchou -> Lanturn
  { from: 177, to: 178, method: "level", level: 25 },  // Natu -> Xatu
  { from: 179, to: 180, method: "level", level: 15 },  // Mareep -> Flaaffy
  { from: 180, to: 181, method: "level", level: 30 },  // Flaaffy -> Ampharos
  { from: 183, to: 184, method: "level", level: 18 },  // Marill -> Azumarill
  { from: 187, to: 188, method: "level", level: 18 },  // Hoppip -> Skiploom
  { from: 188, to: 189, method: "level", level: 27 },  // Skiploom -> Jumpluff
  { from: 191, to: 192, method: "stone", stone: "sun-stone" },  // Sunkern -> Sunflora
  { from: 194, to: 195, method: "level", level: 20 },  // Wooper -> Quagsire
  { from: 204, to: 205, method: "level", level: 31 },  // Pineco -> Forretress
  { from: 209, to: 210, method: "level", level: 23 },  // Snubbull -> Granbull
  { from: 216, to: 217, method: "level", level: 30 },  // Teddiursa -> Ursaring
  { from: 218, to: 219, method: "level", level: 38 },  // Slugma -> Magcargo
  { from: 220, to: 221, method: "level", level: 33 },  // Swinub -> Piloswine
  { from: 223, to: 224, method: "level", level: 25 },  // Remoraid -> Octillery
  { from: 228, to: 229, method: "level", level: 24 },  // Houndour -> Houndoom
  { from: 231, to: 232, method: "level", level: 25 },  // Phanpy -> Donphan
  { from: 246, to: 247, method: "level", level: 30 },  // Larvitar -> Pupitar
  { from: 247, to: 248, method: "level", level: 55 },  // Pupitar -> Tyranitar


  { from: 252, to: 253, method: "level", level: 16 },
  { from: 253, to: 254, method: "level", level: 36 },

  { from: 255, to: 256, method: "level", level: 16 },
  { from: 256, to: 257, method: "level", level: 36 },

  { from: 258, to: 259, method: "level", level: 16 },
  { from: 259, to: 260, method: "level", level: 36 },

  { from: 261, to: 262, method: "level", level: 18 },
  { from: 263, to: 264, method: "level", level: 20 },

  // Wurmple split
  { from: 265, to: 266, method: "level", level: 7 },
  { from: 265, to: 268, method: "level", level: 7 },
  { from: 266, to: 267, method: "level", level: 10 },
  { from: 268, to: 269, method: "level", level: 10 },

  { from: 270, to: 271, method: "level", level: 14 },
  { from: 271, to: 272, method: "stone", stone: "water-stone" },

  { from: 273, to: 274, method: "level", level: 14 },
  { from: 274, to: 275, method: "stone", stone: "leaf-stone" },

  { from: 276, to: 277, method: "level", level: 22 },
  { from: 278, to: 279, method: "level", level: 25 },

  { from: 280, to: 281, method: "level", level: 20 },
  { from: 281, to: 282, method: "level", level: 30 },

  { from: 283, to: 284, method: "level", level: 22 },
  { from: 285, to: 286, method: "level", level: 23 },

  { from: 287, to: 288, method: "level", level: 18 },
  { from: 288, to: 289, method: "level", level: 36 },

  // Nincada special (Shedinja extra)
  { from: 290, to: 291, method: "level", level: 20 },
  { from: 290, to: 292, method: "special", requirement: "empty-slot+pokeball" },

  { from: 293, to: 294, method: "level", level: 20 },
  { from: 294, to: 295, method: "level", level: 40 },

  { from: 296, to: 297, method: "level", level: 24 },

  { from: 299, to: 476, method: "later-gen" }, // Nosepass evolves only gen4

  { from: 300, to: 301, method: "stone", stone: "moon-stone" },

  { from: 304, to: 305, method: "level", level: 32 },
  { from: 305, to: 306, method: "level", level: 42 },

  { from: 307, to: 308, method: "level", level: 37 },

  { from: 309, to: 310, method: "level", level: 26 },

  { from: 315, to: 407, method: "later-gen" }, // Roselia -> Roserade (Gen4)

  { from: 316, to: 317, method: "level", level: 26 },

  { from: 318, to: 319, method: "level", level: 30 },

  { from: 320, to: 321, method: "level", level: 40 },

  { from: 322, to: 323, method: "level", level: 33 },

  { from: 325, to: 326, method: "level", level: 32 },

  { from: 328, to: 329, method: "level", level: 35 },
  { from: 329, to: 330, method: "level", level: 45 },

  { from: 331, to: 332, method: "level", level: 32 },

  { from: 333, to: 334, method: "level", level: 35 },

  { from: 339, to: 340, method: "level", level: 30 },
  { from: 341, to: 342, method: "level", level: 30 },

  { from: 343, to: 344, method: "level", level: 36 },

  { from: 345, to: 346, method: "level", level: 40 },
  { from: 347, to: 348, method: "level", level: 40 },

  // Feebas special beauty
  { from: 349, to: 350, method: "beauty", value: 170 },

  { from: 353, to: 354, method: "level", level: 37 },
  { from: 355, to: 356, method: "level", level: 37 },

  { from: 360, to: 202, method: "friendship" }, // Wynaut -> Wobbuffet

  { from: 361, to: 362, method: "level", level: 42 },

  { from: 363, to: 364, method: "level", level: 32 },
  { from: 364, to: 365, method: "level", level: 44 },

  { from: 366, to: 367, method: "trade", item: "deep-sea-tooth" },
  { from: 366, to: 368, method: "trade", item: "deep-sea-scale" },

  { from: 371, to: 372, method: "level", level: 30 },
  { from: 372, to: 373, method: "level", level: 50 },

  { from: 374, to: 375, method: "level", level: 20 },
  { from: 375, to: 376, method: "level", level: 45 },



  { from: 387, to: 388, method: "level", level: 18 }, // Turtwig -> Grotle
  { from: 388, to: 389, method: "level", level: 32 }, // Grotle -> Torterra

  { from: 390, to: 391, method: "level", level: 14 }, // Chimchar -> Monferno
  { from: 391, to: 392, method: "level", level: 36 }, // Monferno -> Infernape

  { from: 393, to: 394, method: "level", level: 16 }, // Piplup -> Prinplup
  { from: 394, to: 395, method: "level", level: 36 }, // Prinplup -> Empoleon

  // Early routes
  { from: 396, to: 397, method: "level", level: 14 }, // Starly -> Staravia
  { from: 397, to: 398, method: "level", level: 34 }, // Staravia -> Staraptor

  { from: 399, to: 400, method: "level", level: 15 }, // Bidoof -> Bibarel

  { from: 401, to: 402, method: "level", level: 10 }, // Kricketot -> Kricketune

  { from: 403, to: 404, method: "level", level: 15 }, // Shinx -> Luxio
  { from: 404, to: 405, method: "level", level: 30 }, // Luxio -> Luxray

  // Friendship / special
  { from: 406, to: 407, method: "friendship_day" }, // Budew -> Roserade
  { from: 420, to: 421, method: "level", level: 25 }, // Cherubi -> Cherrim

  { from: 427, to: 428, method: "friendship_day" }, // Buneary -> Lopunny

  // Trade evolutions
  { from: 422, to: 423, method: "level", level: 30 }, // Shellos -> Gastrodon

  { from: 443, to: 444, method: "level", level: 24 }, // Gible -> Gabite
  { from: 444, to: 445, method: "level", level: 48 }, // Gabite -> Garchomp

  { from: 447, to: 448, method: "friendship_day" }, // Riolu -> Lucario

  { from: 449, to: 450, method: "level", level: 34 }, // Hippopotas -> Hippowdon

  { from: 451, to: 452, method: "level", level: 40 }, // Skorupi -> Drapion

  { from: 453, to: 454, method: "level", level: 37 }, // Croagunk -> Toxicroak

  { from: 456, to: 457, method: "level", level: 31 }, // Finneon -> Lumineon

  { from: 459, to: 460, method: "level", level: 40 }, // Snover -> Abomasnow

  // Special evolutions with items
  { from: 458, to: 226, method: "level_with_party", party: "Remoraid" }, // Mantyke -> Mantine
  { from: 446, to: 143, method: "friendship" }, // Munchlax -> Snorlax

  // Gender
  { from: 415, to: 416, method: "level_female", level: 21 }, // Combee -> Vespiquen

  // Stones & location
  { from: 133, to: 470, method: "location", location: "moss-rock" }, // Eevee -> Leafeon
  { from: 133, to: 471, method: "location", location: "ice-rock" }, // Eevee -> Glaceon

  // Trade with items (new Gen4 evolutions)
  { from: 75, to: 76, method: "trade_item", item: "protector" }, // Graveler -> Golem (alt rule)
  { from: 93, to: 94, method: "trade_item", item: "reaper-cloth" }, // Dusclops -> Dusknoir
  { from: 112, to: 464, method: "trade_item", item: "protector" }, // Rhydon -> Rhyperior
  { from: 125, to: 466, method: "trade_item", item: "electirizer" }, // Electabuzz -> Electivire
  { from: 126, to: 467, method: "trade_item", item: "magmarizer" }, // Magmar -> Magmortar
  { from: 117, to: 230, method: "trade_item", item: "dragon-scale" }, // Seadra -> Kingdra
  { from: 233, to: 474, method: "trade_item", item: "dubious-disc" }, // Porygon2 -> Porygon-Z
  { from: 650, to: 651, method: "level", level: 16 },
  { from: 651, to: 652, method: "level", level: 36 },
  { from: 653, to: 654, method: "level", level: 16 },
  { from: 654, to: 655, method: "level", level: 36 },
  { from: 656, to: 657, method: "level", level: 16 },
  { from: 657, to: 658, method: "level", level: 36 },
  { from: 659, to: 660, method: "level", level: 20 },
  { from: 661, to: 662, method: "level", level: 17 },
  { from: 662, to: 663, method: "level", level: 35 },
  { from: 664, to: 665, method: "level", level: 9 },
  { from: 665, to: 666, method: "level", level: 12 },
  { from: 667, to: 668, method: "level", level: 35 },
  { from: 669, to: 670, method: "level", level: 19 },
  { from: 672, to: 673, method: "level", level: 32 },
  { from: 674, to: 675, method: "level", level: 32 },
  { from: 677, to: 678, method: "level", level: 25 },
  { from: 679, to: 680, method: "level", level: 35 },
  { from: 686, to: 687, method: "level", level: 30 },
  { from: 688, to: 689, method: "level", level: 39 },
  { from: 690, to: 691, method: "level", level: 48 },
  { from: 692, to: 693, method: "level", level: 37 },
  { from: 696, to: 697, method: "level", level: 39 },
  { from: 698, to: 699, method: "level", level: 39 },
  { from: 704, to: 705, method: "level", level: 40 },
  { from: 705, to: 706, method: "level", level: 50 },
  { from: 712, to: 713, method: "level", level: 37 },
  { from: 714, to: 715, method: "level", level: 48 },
  { from: 722, to: 723, method: "level", level: 17 },
  { from: 723, to: 724, method: "level", level: 34 },
  { from: 725, to: 726, method: "level", level: 17 },
  { from: 726, to: 727, method: "level", level: 34 },
  { from: 728, to: 729, method: "level", level: 17 },
  { from: 729, to: 730, method: "level", level: 34 },
  { from: 731, to: 732, method: "level", level: 14 },
  { from: 732, to: 733, method: "level", level: 28 },
  { from: 734, to: 735, method: "level", level: 20 },
  { from: 736, to: 737, method: "level", level: 20 },
  { from: 742, to: 743, method: "level", level: 25 },
  { from: 744, to: 745, method: "level", level: 25 },
  { from: 747, to: 748, method: "level", level: 38 },
  { from: 749, to: 750, method: "level", level: 30 },
  { from: 751, to: 752, method: "level", level: 22 },
  { from: 753, to: 754, method: "level", level: 34 },
  { from: 755, to: 756, method: "level", level: 24 },
  { from: 757, to: 758, method: "level", level: 33 },
  { from: 759, to: 760, method: "level", level: 27 },
  { from: 761, to: 762, method: "level", level: 18 },
  { from: 767, to: 768, method: "level", level: 30 },
  { from: 769, to: 770, method: "level", level: 42 },
  { from: 782, to: 783, method: "level", level: 35 },
  { from: 783, to: 784, method: "level", level: 45 },
  { from: 789, to: 790, method: "level", level: 43 },
  { from: 790, to: 791, method: "level", level: 53 },
  { from: 790, to: 792, method: "level", level: 53 },
  { from: 810, to: 811, method: "level", level: 16 },
  { from: 811, to: 812, method: "level", level: 35 },
  { from: 813, to: 814, method: "level", level: 16 },
  { from: 814, to: 815, method: "level", level: 35 },
  { from: 816, to: 817, method: "level", level: 16 },
  { from: 817, to: 818, method: "level", level: 35 },
  { from: 819, to: 820, method: "level", level: 24 },
  { from: 821, to: 822, method: "level", level: 18 },
  { from: 822, to: 823, method: "level", level: 38 },
  { from: 824, to: 825, method: "level", level: 10 },
  { from: 825, to: 826, method: "level", level: 30 },
  { from: 827, to: 828, method: "level", level: 18 },
  { from: 829, to: 830, method: "level", level: 20 },
  { from: 831, to: 832, method: "level", level: 24 },
  { from: 833, to: 834, method: "level", level: 22 },
  { from: 835, to: 836, method: "level", level: 25 },
  { from: 837, to: 838, method: "level", level: 18 },
  { from: 838, to: 839, method: "level", level: 34 },
  { from: 843, to: 844, method: "level", level: 36 },
  { from: 846, to: 847, method: "level", level: 26 },
  { from: 848, to: 849, method: "level", level: 30 },
  { from: 850, to: 851, method: "level", level: 28 },
  { from: 856, to: 857, method: "level", level: 32 },
  { from: 857, to: 858, method: "level", level: 42 },
  { from: 859, to: 860, method: "level", level: 32 },
  { from: 860, to: 861, method: "level", level: 42 },
  { from: 263, to: 264, method: "level", level: 20 },
  { from: 264, to: 862, method: "level", level: 35 },
  { from: 52, to: 53, method: "level", level: 28 },
  { from: 52, to: 863, method: "level", level: 28 },
  { from: 222, to: 864, method: "level", level: 38 },
  { from: 122, to: 866, method: "level", level: 42 },
  { from: 562, to: 563, method: "level", level: 34 },
  { from: 878, to: 879, method: "level", level: 34 },
  { from: 885, to: 886, method: "level", level: 50 },
  { from: 886, to: 887, method: "level", level: 60 },
  { from: 216, to: 217, method: "level", level: 30 },
  { from: 906, to: 907, method: "level", level: 16 },
  { from: 907, to: 908, method: "level", level: 36 },
  { from: 909, to: 910, method: "level", level: 16 },
  { from: 910, to: 911, method: "level", level: 36 },
  { from: 912, to: 913, method: "level", level: 16 },
  { from: 913, to: 914, method: "level", level: 36 },
  { from: 915, to: 916, method: "level", level: 18 },
  { from: 917, to: 918, method: "level", level: 15 },
  { from: 919, to: 920, method: "level", level: 24 },
  { from: 921, to: 922, method: "level", level: 18 },
  { from: 926, to: 927, method: "level", level: 26 },
  { from: 928, to: 929, method: "level", level: 25 },
  { from: 929, to: 930, method: "level", level: 35 },
  { from: 932, to: 933, method: "level", level: 24 },
  { from: 933, to: 934, method: "level", level: 38 },
  { from: 940, to: 941, method: "level", level: 25 },
  { from: 942, to: 943, method: "level", level: 30 },
  { from: 944, to: 945, method: "level", level: 28 },
  { from: 948, to: 949, method: "level", level: 30 },
  { from: 955, to: 956, method: "level", level: 35 },
  { from: 957, to: 958, method: "level", level: 24 },
  { from: 958, to: 959, method: "level", level: 38 },
  { from: 960, to: 961, method: "level", level: 26 },
  { from: 963, to: 964, method: "level", level: 38 },
  { from: 965, to: 966, method: "level", level: 40 },
  { from: 969, to: 970, method: "level", level: 35 },
  { from: 971, to: 972, method: "level", level: 30 },
  { from: 56, to: 57, method: "level", level: 28 },
  { from: 194, to: 195, method: "level", level: 20 },
  { from: 194, to: 980, method: "level", level: 20 },
  { from: 624, to: 625, method: "level", level: 52 },
  { from: 996, to: 997, method: "level", level: 35 },
  { from: 997, to: 998, method: "level", level: 54 },

];

// Helper to find evolutions for a given Pokemon
export function getEvolutions(speciesId: number): EvolutionData[] {
  return EVOLUTIONS.filter((e) => e.from === speciesId);
}

// Check if a Pokemon can evolve by level
export function canEvolveByLevel(speciesId: number, level: number): EvolutionData | null {
  return EVOLUTIONS.find((e) => e.from === speciesId && e.method === "level" && e.level !== undefined && level >= e.level) || null;
}

// Check if a Pokemon can evolve by stone
export function canEvolveByStone(speciesId: number, stoneId: string): EvolutionData | null {
  return EVOLUTIONS.find((e) => e.from === speciesId && e.method === "stone" && e.stone === stoneId) || null;
}

// Check if a Pokemon can evolve by trade (in our RPG, the master decides)
export function canEvolveByTrade(speciesId: number): EvolutionData | null {
  return EVOLUTIONS.find((e) => e.from === speciesId && e.method === "trade") || null;
}

// XP needed per level (simple formula)
export function xpForLevel(level: number): number {
  return level * level * 25;
}

// Stone item definitions
export interface StoneItem {
  id: string;
  name: string;
  description: string;
}

export const EVOLUTION_STONES: StoneItem[] = [

  // Pedras Elementais Clássicas
  { id: "fire-stone", name: "Pedra de Fogo", description: "Evolui certos Pokemon do tipo Fogo." },
  { id: "water-stone", name: "Pedra da Agua", description: "Evolui certos Pokemon do tipo Agua." },
  { id: "thunder-stone", name: "Pedra do Trovao", description: "Evolui certos Pokemon do tipo Eletrico." },
  { id: "leaf-stone", name: "Pedra da Folha", description: "Evolui certos Pokemon do tipo Planta." },
  { id: "ice-stone", name: "Pedra de Gelo", description: "Evolui Pokemon ligados ao frio intenso." },
  { id: "moon-stone", name: "Pedra da Lua", description: "Evolui Pokemon influenciados pela lua." },
  { id: "sun-stone", name: "Pedra do Sol", description: "Evolui Pokemon influenciados pela luz solar." },
  { id: "shiny-stone", name: "Pedra do Brilho", description: "Evolui Pokemon sensiveis a energia luminosa." },
  { id: "dusk-stone", name: "Pedra do Anoitecer", description: "Evolui Pokemon ligados a escuridao." },
  { id: "dawn-stone", name: "Pedra do Amanhecer", description: "Evolui Pokemon com energia do amanhecer." },

  // Itens de Troca com Evolucao
  { id: "metal-coat", name: "Revestimento Metalico", description: "Evolui certos Pokemon de Aco por troca." },
  { id: "kings-rock", name: "Pedra do Rei", description: "Evolui Pokemon especificos por troca." },
  { id: "dragon-scale", name: "Escama de Dragao", description: "Evolui Seadra em Kingdra." },
  { id: "up-grade", name: "Up-Grade", description: "Evolui Porygon em Porygon2." },
  { id: "dubious-disc", name: "Disco Duvidoso", description: "Evolui Porygon2 em Porygon-Z." },
  { id: "protector", name: "Protetor", description: "Evolui Rhydon em Rhyperior." },
  { id: "electirizer", name: "Eletrizador", description: "Evolui Electabuzz em Electivire." },
  { id: "magmarizer", name: "Magmarizador", description: "Evolui Magmar em Magmortar." },
  { id: "reaper-cloth", name: "Tecido Reaper", description: "Evolui Dusclops em Dusknoir." },
  { id: "razor-claw", name: "Garra Afiada", description: "Evolui Sneasel em Weavile." },
  { id: "razor-fang", name: "Presa Afiada", description: "Evolui Gligar em Gliscor." },
  { id: "prism-scale", name: "Escama Prisma", description: "Evolui Feebas em Milotic." },
  { id: "whipped-dream", name: "Doce Chicoteado", description: "Evolui Swirlix em Slurpuff." },
  { id: "sachet", name: "Sachê Aromatico", description: "Evolui Spritzee em Aromatisse." },

  // Itens Especiais Modernos
  { id: "sweet-apple", name: "Maca Doce", description: "Evolui Applin em Appletun." },
  { id: "tart-apple", name: "Maca Azeda", description: "Evolui Applin em Flapple." },
  { id: "cracked-pot", name: "Bule Rachado", description: "Evolui Sinistea." },
  { id: "chipped-pot", name: "Bule Raro", description: "Evolui Sinistea forma autentica." },
  { id: "auspicious-armor", name: "Armadura Auspiciosa", description: "Evolui Charcadet em Armarouge." },
  { id: "malicious-armor", name: "Armadura Maliciosa", description: "Evolui Charcadet em Ceruledge." },
  { id: "leader-crest", name: "Brasao do Lider", description: "Evolui Bisharp em Kingambit." },

];

// Bag item definitions
export interface BagItemDef {
  id: string;
  name: string;
  description: string;
  category: "potion" | "pokeball" | "status" | "other";
  healAmount?: number;
  ppRestore?: number;
}

export const BAG_ITEMS: BagItemDef[] = [
  { id: "potion", name: "Potion", description: "Restaura 20 HP.", category: "potion", healAmount: 20 },
  { id: "super-potion", name: "Super Potion", description: "Restaura 50 HP.", category: "potion", healAmount: 50 },
  { id: "hyper-potion", name: "Hyper Potion", description: "Restaura 200 HP.", category: "potion", healAmount: 200 },
  { id: "max-potion", name: "Max Potion", description: "Restaura todo o HP.", category: "potion", healAmount: 9999 },
  { id: "revive", name: "Revive", description: "Revive um Pokemon com metade do HP.", category: "potion", healAmount: -1 },
  { id: "ether", name: "Ether", description: "Restaura 5 PP de um golpe.", category: "status", ppRestore: 5 },
  { id: "elixir", name: "Elixir", description: "Restaura 10 PP de todos os golpes.", category: "status", ppRestore: 10 },
  { id: "pokeball", name: "Poke Ball", description: "Captura Pokemon selvagens.", category: "pokeball" },
  { id: "great-ball", name: "Great Ball", description: "Melhor taxa de captura.", category: "pokeball" },
  { id: "ultra-ball", name: "Ultra Ball", description: "Alta taxa de captura.", category: "pokeball" },
  { id: "master-ball", name: "Master Ball", description: "Captura garantida.", category: "pokeball" },
  // Evolution stones as bag items
  { id: "fire-stone", name: "Pedra de Fogo", description: "Evolui Pokemon do tipo Fogo.", category: "other" },
  { id: "water-stone", name: "Pedra da Agua", description: "Evolui Pokemon do tipo Agua.", category: "other" },
  { id: "thunder-stone", name: "Pedra do Trovao", description: "Evolui Pokemon do tipo Eletrico.", category: "other" },
  { id: "leaf-stone", name: "Pedra da Folha", description: "Evolui Pokemon do tipo Planta.", category: "other" },
  { id: "moon-stone", name: "Pedra da Lua", description: "Evolui Pokemon especiais.", category: "other" },
  // Gen 2 evolution items
  { id: "sun-stone", name: "Pedra do Sol", description: "Evolui Pokemon com luz solar.", category: "other" },
  { id: "metal-coat", name: "Revestimento Metalico", description: "Evolui Pokemon de aco.", category: "other" },
  { id: "kings-rock", name: "Pedra do Rei", description: "Evolui Pokemon especiais.", category: "other" },
  { id: "dragon-scale", name: "Escama de Dragao", description: "Evolui Seadra em Kingdra.", category: "other" },
  { id: "up-grade", name: "Up-Grade", description: "Evolui Porygon em Porygon2.", category: "other" },
  // Rare Candy
  { id: "rare-candy", name: "Rare Candy", description: "Sobe 1 nivel instantaneamente.", category: "other" },
];

// ========== Pokemon RPG Attributes ==========
// Base stats for each Pokemon that scale with level.
// velocidade  = Speed / initiative
// felicidade  = Happiness / charm
// resistencia = Endurance / constitution
// acrobacia   = Acrobatics / agility

export interface PokemonBaseAttributes {
  velocidade: number;   // 1-10 base
  felicidade: number;   // 1-10 base
  resistencia: number;  // 1-10 base
  acrobacia: number;    // 1-10 base
  especial: string;    // 1-10 base
}

export interface PokemonComputedAttributes extends PokemonBaseAttributes {
  // Modifier added to d20 rolls for attribute tests
  velocidadeMod: number;
  felicidadeMod: number;
  resistenciaMod: number;
  acrobaciaMod: number;
  // Defense (Classe de Armadura / AC) - scales with level
  defesa: number;
}

export const POKEMON_ATTRIBUTE_INFO: Record<keyof PokemonBaseAttributes, { name: string; desc: string; icon: string }> = {
  velocidade: { name: "Velocidade", desc: "Rapidez e reflexos em combate.", icon: "zap" },
  felicidade: { name: "Felicidade", desc: "Vinculo com o treinador e carisma.", icon: "heart" },
  resistencia: { name: "Resistencia", desc: "Vigor fisico e capacidade de aguentar.", icon: "shield" },
  acrobacia: { name: "Acrobacia", desc: "Agilidade, esquiva e movimentos aereos.", icon: "wind" },
  especial: { name: "Especial", desc: "Habilidade que somente este pokemon pode fazer", icon: "star" },
};

// ========== RPG Dice Utilities ==========

/** Roll NdS: returns an array of N dice with S sides (1-based) */
export function rollDice(count: number, sides: number): number[] {
  return Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
}

/** Roll NdS and return the sum */
export function rollDiceSum(count: number, sides: number): number {
  return rollDice(count, sides).reduce((a, b) => a + b, 0);
}

/**
 * Calculate how much damage a Pokemon takes given:
 * - rawDamage: incoming damage from attacker
 * - defesa: the Pokemon's defense (AC)
 * Returns an object with the damage dice results and final damage after defense reduction.
 * Formula: damage = max(1, rawDamage - defenseReduction)
 * defenseReduction = floor(defesa / 3)
 */
export function calculateDamageTaken(rawDamage: number, defesa: number): {
  rawDamage: number;
  defenseReduction: number;
  finalDamage: number;
} {
  const defenseReduction = Math.floor(defesa / 3);
  const finalDamage = Math.max(1, rawDamage - defenseReduction);
  return { rawDamage, defenseReduction, finalDamage };
}

/**
 * Roll damage dice for an attacker targeting a Pokemon.
 * Uses 1d20 vs target AC. If roll >= AC, full damage. Otherwise halved.
 * Returns: { attackRoll, hitAC, rawDamage, defenseReduction, finalDamage }
 */
export function rollDamageAgainstPokemon(
  baseDamage: number,
  targetDefesa: number
): {
  attackRoll: number;
  hitAC: boolean;
  rawDamage: number;
  defenseReduction: number;
  finalDamage: number;
} {
  const attackRoll = rollDiceSum(1, 20);
  const hitAC = attackRoll >= targetDefesa;
  const rawDamage = hitAC ? baseDamage : Math.floor(baseDamage / 2);
  const defenseReduction = Math.floor(targetDefesa / 3);
  const finalDamage = Math.max(1, rawDamage - defenseReduction);
  return { attackRoll, hitAC, rawDamage, defenseReduction, finalDamage };
}

/**
 * Faint penalty: reduce base attribute values temporarily.
 * When a Pokemon faints, its felicidade drops by 1 (min 1) and
 * a random other attribute drops by 1 (min 1).
 * Returns a new base attributes object with penalties applied.
 */
export function applyFaintPenalty(base: PokemonBaseAttributes): PokemonBaseAttributes {
  const result = { ...base };
  // Felicidade always drops
  result.felicidade = Math.max(1, result.felicidade - 1);
  // Random other attribute drops
  const otherKeys: (keyof PokemonBaseAttributes)[] = ["velocidade", "resistencia", "acrobacia"];
  const randomKey = otherKeys[Math.floor(Math.random() * otherKeys.length)];
  result[randomKey] = Math.max(1, result[randomKey] - 1);
  return result;
}

/**
 * Level up bonus: when leveling up, one random attribute may increase by 1 (max 10).
 * The attribute chosen is weighted towards the Pokemon's highest base stat.
 */
export function applyLevelUpBonus(base: PokemonBaseAttributes): PokemonBaseAttributes {
  const result = { ...base };
  const keys: (keyof PokemonBaseAttributes)[] = ["velocidade", "felicidade", "resistencia", "acrobacia"];
  // Weight towards highest stat
  const weights = keys.map((k) => base[k]);
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let rand = Math.random() * totalWeight;
  let chosen: keyof PokemonBaseAttributes = keys[0];
  for (let i = 0; i < keys.length; i++) {
    rand -= weights[i];
    if (rand <= 0) {
      chosen = keys[i];
      break;
    }
  }
  result[chosen] = Math.min(10, result[chosen] + 1);
  return result;
}

// Base attributes per species ID. Each value 1-10.
// Designed to make thematic sense for each Pokemon.
const SPECIES_BASE_ATTRIBUTES: Record<number, PokemonBaseAttributes> = {
  1: { velocidade: 4, felicidade: 5, resistencia: 5, acrobacia: 4, especial: "Faz brotar vinhas e plantas pelo campo." },   // Bulbasaur
  2: { velocidade: 5, felicidade: 5, resistencia: 6, acrobacia: 4, especial: "Acelera o crescimento natural ao redor." },  // Ivysaur
  3: { velocidade: 6, felicidade: 6, resistencia: 8, acrobacia: 5, especial: "Cria vegetação densa que protege aliados." },  // Venusaur

  4: { velocidade: 6, felicidade: 5, resistencia: 4, acrobacia: 5, especial: "Aquece o ambiente suavemente." },      // Charmander
  5: { velocidade: 7, felicidade: 5, resistencia: 5, acrobacia: 6, especial: "Ilumina áreas escuras com sua chama." },  // Charmeleon
  6: { velocidade: 8, felicidade: 6, resistencia: 6, acrobacia: 9, especial: "Permite voar carregando um treinador." },      // Charizard

  7: { velocidade: 4, felicidade: 6, resistencia: 6, acrobacia: 4, especial: "Flutua e atravessa água calma." },      // Squirtle
  8: { velocidade: 5, felicidade: 6, resistencia: 7, acrobacia: 4, especial: "Mergulha por longos períodos." }, // Wartortle
  9: { velocidade: 6, felicidade: 6, resistencia: 9, acrobacia: 5, especial: "Dispara jato de água para empurrar obstáculos." },        // Blastoise

  10: { velocidade: 3, felicidade: 4, resistencia: 2, acrobacia: 3, especial: "Produz fios de seda criando trilhas." },      // Caterpie
  11: { velocidade: 2, felicidade: 3, resistencia: 5, acrobacia: 1, especial: "Endurece o corpo bloqueando ataques." },   // Metapod
  12: { velocidade: 6, felicidade: 6, resistencia: 4, acrobacia: 8, especial: "Espalha pó que causa sono." },     // Butterfree

  13: { velocidade: 3, felicidade: 3, resistencia: 2, acrobacia: 3, especial: "Deixa rastro venenoso no chão." },     // Weedle
  14: { velocidade: 2, felicidade: 2, resistencia: 5, acrobacia: 1, especial: "Ergue espinhos defensivos." },     // Kakuna
  15: { velocidade: 7, felicidade: 4, resistencia: 4, acrobacia: 7, especial: "Invoca um enxame de insetos aliados." },     // Beedrill

  16: { velocidade: 5, felicidade: 5, resistencia: 3, acrobacia: 6, especial: "Cria rajadas de vento." },    // Pidgey
  17: { velocidade: 6, felicidade: 5, resistencia: 4, acrobacia: 7, especial: "Plana carregando mensagens ou itens." },            // Pidgeotto
  18: { velocidade: 8, felicidade: 6, resistencia: 6, acrobacia: 9, especial: "Guia viajantes pelo céu." },        // Pidgeot

  19: { velocidade: 7, felicidade: 4, resistencia: 2, acrobacia: 5, especial: "Escapa rapidamente de perigos." },       // Rattata
  20: { velocidade: 8, felicidade: 4, resistencia: 5, acrobacia: 6, especial: "Encontra comida e objetos escondidos." },    // Raticate

  21: { velocidade: 6, felicidade: 3, resistencia: 3, acrobacia: 6, especial: "Atrai Pokémon selvagens próximos." },  // Spearow
  22: { velocidade: 8, felicidade: 4, resistencia: 5, acrobacia: 8, especial: "Afugenta criaturas ao redor." },// Fearow

  23: { velocidade: 5, felicidade: 3, resistencia: 4, acrobacia: 6, especial: "Enxerga perfeitamente no escuro." },     // Ekans
  24: { velocidade: 6, felicidade: 3, resistencia: 6, acrobacia: 7, especial: "Intimida inimigos com o olhar." }, // Arbok

  25: { velocidade: 8, felicidade: 8, resistencia: 3, acrobacia: 7, especial: "Encontra moedas perdidas." },    // Pikachu
  26: { velocidade: 9, felicidade: 7, resistencia: 5, acrobacia: 7, especial: "Gera eletricidade para iluminar locais." },     // Raichu

  27: { velocidade: 4, felicidade: 4, resistencia: 7, acrobacia: 4, especial: "Cava abrigo subterrâneo." },        // Sandshrew
  28: { velocidade: 5, felicidade: 4, resistencia: 8, acrobacia: 5, especial: "Cria uma tempestade de areia." },    // Sandslash

  29: { velocidade: 4, felicidade: 5, resistencia: 5, acrobacia: 3, especial: "Protege filhotes e aliados." },    // Nidoran F
  30: { velocidade: 5, felicidade: 5, resistencia: 6, acrobacia: 4, especial: "Defende o grupo próximo." },      // Nidorina
  31: { velocidade: 6, felicidade: 5, resistencia: 8, acrobacia: 5, especial: "Ergue barreira protetora natural." },    // Nidoqueen

  32: { velocidade: 5, felicidade: 4, resistencia: 5, acrobacia: 4, especial: "Provoca inimigos para chamar atenção." },   // Nidoran M
  33: { velocidade: 6, felicidade: 4, resistencia: 6, acrobacia: 5, especial: "Perfura obstáculos com o chifre." },   // Nidorino
  34: { velocidade: 7, felicidade: 4, resistencia: 8, acrobacia: 6, especial: "Domina território ao redor." },     // Nidoking

  35: { velocidade: 3, felicidade: 9, resistencia: 5, acrobacia: 4, especial: "Canta e acalma criaturas." },      // Clefairy
  36: { velocidade: 4, felicidade: 10, resistencia: 7, acrobacia: 5, especial: "Concede energia lunar restauradora." },       // Clefable

  37: { velocidade: 6, felicidade: 6, resistencia: 3, acrobacia: 7, especial: "Aquece o ambiente com fogo suave." },          // Vulpix
  38: { velocidade: 8, felicidade: 7, resistencia: 5, acrobacia: 8, especial: "Guia pessoas com chamas místicas." },          // Ninetales

  39: { velocidade: 3, felicidade: 9, resistencia: 6, acrobacia: 3, especial: "Canta fazendo alvos dormirem." },         // Jigglypuff
  40: { velocidade: 4, felicidade: 10, resistencia: 8, acrobacia: 3, especial: "Induz sono profundo em área." },      // Wigglytuff
  41: { velocidade: 5, felicidade: 3, resistencia: 3, acrobacia: 7, especial: "Localiza tudo ao redor por ecolocalização." },     // Zubat
  42: { velocidade: 7, felicidade: 3, resistencia: 5, acrobacia: 8, especial: "Mapeia cavernas enquanto voa." },      // Golbat

  43: { velocidade: 3, felicidade: 5, resistencia: 4, acrobacia: 2, especial: "Espalha sementes pelo terreno." },      // Oddish
  44: { velocidade: 4, felicidade: 5, resistencia: 5, acrobacia: 3, especial: "Libera aroma que atrai criaturas." },      // Gloom
  45: { velocidade: 4, felicidade: 5, resistencia: 7, acrobacia: 3, especial: "Transforma a área em jardim florido." },         // Vileplume

  46: { velocidade: 3, felicidade: 4, resistencia: 4, acrobacia: 3, especial: "Coleta e cultiva cogumelos úteis." },   // Paras
  47: { velocidade: 3, felicidade: 4, resistencia: 6, acrobacia: 3, especial: "Regenera ferimentos naturalmente." },        // Parasect

  48: { velocidade: 4, felicidade: 4, resistencia: 5, acrobacia: 4, especial: "Solta pó que confunde inimigos." },         // Venonat
  49: { velocidade: 7, felicidade: 4, resistencia: 5, acrobacia: 7, especial: "Dispersa escamas brilhantes cegantes." },  // Venomoth

  50: { velocidade: 8, felicidade: 4, resistencia: 1, acrobacia: 6, especial: "Abre túneis rapidamente no solo." },   // Diglett
  51: { velocidade: 9, felicidade: 4, resistencia: 3, acrobacia: 7, especial: "Cria rede de túneis subterrâneos." },     // Dugtrio

  52: { velocidade: 7, felicidade: 6, resistencia: 3, acrobacia: 8, especial: "Encontra moedas escondidas." },        // Meowth
  53: { velocidade: 8, felicidade: 6, resistencia: 5, acrobacia: 9, especial: "Move-se sem fazer ruído." },   // Persian

  54: { velocidade: 4, felicidade: 5, resistencia: 4, acrobacia: 4, especial: "Prevê mudanças no clima." },   // Psyduck
  55: { velocidade: 7, felicidade: 5, resistencia: 6, acrobacia: 6, especial: "Nada velozmente em rios." },        // Golduck

  56: { velocidade: 7, felicidade: 3, resistencia: 4, acrobacia: 7, especial: "Escala paredes e árvores." },    // Mankey
  57: { velocidade: 8, felicidade: 3, resistencia: 6, acrobacia: 8, especial: "Quebra obstáculos com força bruta." },        // Primeape

  58: { velocidade: 6, felicidade: 7, resistencia: 5, acrobacia: 6, especial: "Fareja itens e pessoas distantes." },      // Growlithe
  59: { velocidade: 8, felicidade: 7, resistencia: 7, acrobacia: 7, especial: "Corre carregando um treinador." },   // Arcanine

  60: { velocidade: 5, felicidade: 5, resistencia: 3, acrobacia: 5, especial: "Nada facilmente em lagos." },         // Poliwag
  61: { velocidade: 6, felicidade: 5, resistencia: 5, acrobacia: 5, especial: "Guia nadadores com segurança." },    // Poliwhirl
  62: { velocidade: 6, felicidade: 5, resistencia: 8, acrobacia: 6, especial: "Resgata pessoas na água." },    // Poliwrath

  63: { velocidade: 7, felicidade: 5, resistencia: 1, acrobacia: 6, especial: "Teleporta-se para local seguro." },   // Abra
  64: { velocidade: 8, felicidade: 5, resistencia: 3, acrobacia: 7, especial: "Abre portais curtos." },       // Kadabra
  65: { velocidade: 9, felicidade: 5, resistencia: 4, acrobacia: 8, especial: "Abre portais de longa distância." },       // Alakazam

  66: { velocidade: 3, felicidade: 5, resistencia: 7, acrobacia: 3, especial: "Empurra grandes rochas." },    // Machop
  67: { velocidade: 4, felicidade: 5, resistencia: 8, acrobacia: 4, especial: "Carrega objetos pesados." },   // Machoke
  68: { velocidade: 5, felicidade: 5, resistencia: 10, acrobacia: 4, especial: "Esmaga pedras gigantes." },    // Machamp

  69: { velocidade: 4, felicidade: 5, resistencia: 4, acrobacia: 4, especial: "Corta vegetação densa." },      // Bellsprout
  70: { velocidade: 5, felicidade: 5, resistencia: 5, acrobacia: 5, especial: "Arma armadilhas com vinhas." },   // Weepinbell
  71: { velocidade: 6, felicidade: 5, resistencia: 6, acrobacia: 5, especial: "Devora pragas do ambiente." },     // Victreebel

  72: { velocidade: 6, felicidade: 4, resistencia: 3, acrobacia: 6, especial: "Purifica água contaminada." },     // Tentacool
  73: { velocidade: 8, felicidade: 4, resistencia: 6, acrobacia: 7, especial: "Cria fortes correntes marítimas." },   // Tentacruel

  74: { velocidade: 2, felicidade: 4, resistencia: 8, acrobacia: 1, especial: "Rola por encostas montanhosas." },     // Geodude
  75: { velocidade: 3, felicidade: 4, resistencia: 9, acrobacia: 2, especial: "Escala paredões rochosos." },   // Graveler
  76: { velocidade: 4, felicidade: 4, resistencia: 10, acrobacia: 2, especial: "Destrói rochas enormes." }, // Golem

  77: { velocidade: 8, felicidade: 6, resistencia: 4, acrobacia: 7, especial: "Galopa rapidamente por terra." },          // Ponyta
  78: { velocidade: 9, felicidade: 6, resistencia: 6, acrobacia: 8, especial: "Dispara corrida em chamas." },            // Rapidash

  79: { velocidade: 2, felicidade: 7, resistencia: 8, acrobacia: 2, especial: "Fisga peixes sem esforço." },          // Slowpoke
  80: { velocidade: 3, felicidade: 7, resistencia: 10, acrobacia: 2, especial: "Mergulha lentamente por longos períodos." },       // Slowbro
  81: { velocidade: 3, felicidade: 4, resistencia: 6, acrobacia: 3, especial: "Detecta metais e objetos escondidos." },             // Magnemite
  82: { velocidade: 5, felicidade: 4, resistencia: 8, acrobacia: 4, especial: "Cria campo magnético que move metal." },         // Magneton

  83: { velocidade: 7, felicidade: 6, resistencia: 5, acrobacia: 8, especial: "Corta árvores e galhos grossos." },          // Farfetch'd

  84: { velocidade: 8, felicidade: 5, resistencia: 4, acrobacia: 8, especial: "Corre rapidamente em terreno aberto." },          // Doduo
  85: { velocidade: 9, felicidade: 5, resistencia: 6, acrobacia: 9, especial: "Transporta pessoas por terra." },    // Dodrio

  86: { velocidade: 5, felicidade: 7, resistencia: 6, acrobacia: 5, especial: "Nada em águas geladas sem esforço." },               // Seel
  87: { velocidade: 6, felicidade: 7, resistencia: 8, acrobacia: 6, especial: "Quebra gelo espesso." },            // Dewgong

  88: { velocidade: 4, felicidade: 3, resistencia: 7, acrobacia: 3, especial: "Move-se por resíduos e esgoto." },           // Grimer
  89: { velocidade: 5, felicidade: 3, resistencia: 9, acrobacia: 4, especial: "Absorve toxinas do ambiente." },        // Muk

  90: { velocidade: 4, felicidade: 4, resistencia: 6, acrobacia: 3, especial: "Abre conchas e cascos duros." },           // Shellder
  91: { velocidade: 6, felicidade: 4, resistencia: 10, acrobacia: 4, especial: "Mergulha em águas profundas." },      // Cloyster

  92: { velocidade: 7, felicidade: 3, resistencia: 2, acrobacia: 7, especial: "Atravessa paredes e objetos." },      // Gastly
  93: { velocidade: 8, felicidade: 3, resistencia: 3, acrobacia: 8, especial: "Assombra e afugenta inimigos." },               // Haunter
  94: { velocidade: 9, felicidade: 3, resistencia: 5, acrobacia: 8, especial: "Abre passagem pelo mundo das sombras." },           // Gengar

  95: { velocidade: 3, felicidade: 4, resistencia: 10, acrobacia: 2, especial: "Escava longos túneis rochosos." },          // Onix

  96: { velocidade: 4, felicidade: 5, resistencia: 3, acrobacia: 5, especial: "Hipnotiza criaturas ou pessoas." },             // Drowzee
  97: { velocidade: 6, felicidade: 5, resistencia: 6, acrobacia: 6, especial: "Restaura energia através de sonhos." },       // Hypno

  98: { velocidade: 7, felicidade: 5, resistencia: 4, acrobacia: 7, especial: "Corta objetos com precisão." },           // Krabby
  99: { velocidade: 8, felicidade: 5, resistencia: 6, acrobacia: 8, especial: "Quebra troncos grossos." },         // Kingler

  100: { velocidade: 8, felicidade: 4, resistencia: 5, acrobacia: 7, especial: "Explode abrindo passagem em rochas." },
  101: { velocidade: 9, felicidade: 4, resistencia: 7, acrobacia: 8, especial: "Detona explosões controladas." },    // Electrode

  102: { velocidade: 3, felicidade: 5, resistencia: 5, acrobacia: 3, especial: "Planta sementes rapidamente." },      // Exeggcute
  103: { velocidade: 5, felicidade: 6, resistencia: 7, acrobacia: 5, especial: "Faz surgir palmeiras no terreno." },       // Exeggutor

  104: { velocidade: 4, felicidade: 5, resistencia: 6, acrobacia: 4, especial: "Encontra ossos e relíquias." },       // Cubone
  105: { velocidade: 5, felicidade: 5, resistencia: 8, acrobacia: 5, especial: "Protege áreas espirituais." },     // Marowak

  106: { velocidade: 7, felicidade: 5, resistencia: 6, acrobacia: 8, especial: "Salta alturas impressionantes." },            // Hitmonlee
  107: { velocidade: 7, felicidade: 5, resistencia: 7, acrobacia: 7, especial: "Desfere sequência de socos rápidos." },         // Hitmonchan

  108: { velocidade: 4, felicidade: 7, resistencia: 8, acrobacia: 3, especial: "Alcança objetos distantes com a língua." },        // Lickitung

  109: { velocidade: 5, felicidade: 3, resistencia: 4, acrobacia: 4, especial: "Libera gás venenoso." },            // Koffing
  110: { velocidade: 6, felicidade: 3, resistencia: 7, acrobacia: 5, especial: "Cria névoa tóxica na área." },        // Weezing

  111: { velocidade: 3, felicidade: 4, resistencia: 9, acrobacia: 2, especial: "Empurra grandes pedras." },       // Rhyhorn
  112: { velocidade: 4, felicidade: 4, resistencia: 10, acrobacia: 3, especial: "Arromba paredes sólidas." },      // Rhydon

  113: { velocidade: 3, felicidade: 10, resistencia: 7, acrobacia: 2, especial: "Cura ferimentos do grupo." },           // Chansey

  114: { velocidade: 5, felicidade: 7, resistencia: 6, acrobacia: 6, especial: "Estende cipós como cordas." },            // Tangela

  115: { velocidade: 7, felicidade: 7, resistencia: 8, acrobacia: 7, especial: "Guarda itens na bolsa marsupial." },           // Kangaskhan

  116: { velocidade: 5, felicidade: 6, resistencia: 3, acrobacia: 6, especial: "Nada calmamente no mar." },           // Horsea
  117: { velocidade: 7, felicidade: 6, resistencia: 5, acrobacia: 7, especial: "Cria correnteza na água." },            // Seadra

  118: { velocidade: 7, felicidade: 7, resistencia: 4, acrobacia: 7, especial: "Atrai peixes raros." },           // Goldeen
  119: { velocidade: 8, felicidade: 7, resistencia: 6, acrobacia: 8, especial: "Nada contra fortes correntes." },       // Seaking

  120: { velocidade: 6, felicidade: 6, resistencia: 5, acrobacia: 6, especial: "Brilha iluminando a noite." },     // Staryu

  121: { velocidade: 8, felicidade: 6, resistencia: 7, acrobacia: 8, especial: "Ilumina o fundo do mar." },     // Starmie

  122: { velocidade: 7, felicidade: 6, resistencia: 5, acrobacia: 7, especial: "Imita pessoas e gestos perfeitamente." },            // Mr. Mime

  123: { velocidade: 8, felicidade: 6, resistencia: 6, acrobacia: 9, especial: "Corta árvores rapidamente." },       // Scyther

  124: { velocidade: 7, felicidade: 6, resistencia: 5, acrobacia: 7, especial: "Congela água ao tocar." },         // Jynx

  125: { velocidade: 9, felicidade: 5, resistencia: 5, acrobacia: 8, especial: "Gera energia elétrica utilizável." },
  126: { velocidade: 7, felicidade: 5, resistencia: 6, acrobacia: 7, especial: "Derrete gelo e neve." },        // Magmar
  127: { velocidade: 7, felicidade: 5, resistencia: 7, acrobacia: 8, especial: "Parte troncos gigantes." }, // Pinsir
  128: { velocidade: 6, felicidade: 5, resistencia: 8, acrobacia: 5, especial: "Ara o solo com investidas." },           // Tauros

  129: { velocidade: 6, felicidade: 4, resistencia: 2, acrobacia: 5, especial: "Salta alto fora d'água." },           // Magikarp
  130: { velocidade: 8, felicidade: 5, resistencia: 9, acrobacia: 8, especial: "Transporta pessoas sobre as águas." },               // Gyarados

  131: { velocidade: 6, felicidade: 7, resistencia: 10, acrobacia: 6, especial: "Serve como montaria marítima." },  // Lapras

  132: { velocidade: 5, felicidade: 5, resistencia: 5, acrobacia: 5, especial: "Copia a forma de outro Pokémon." },          // Ditto

  133: { velocidade: 7, felicidade: 9, resistencia: 5, acrobacia: 7, especial: "Rastreia caminhos e trilhas." },      // Eevee
  134: { velocidade: 7, felicidade: 9, resistencia: 7, acrobacia: 7, especial: "Purifica água poluída." },       // Vaporeon
  135: { velocidade: 9, felicidade: 9, resistencia: 5, acrobacia: 9, especial: "Ativa máquinas elétricas." },      // Jolteon
  136: { velocidade: 8, felicidade: 9, resistencia: 6, acrobacia: 8, especial: "Acende fogueiras e tochas." },       // Flareon

  137: { velocidade: 5, felicidade: 5, resistencia: 5, acrobacia: 5, especial: "Analisa dados e mecanismos." },       // Porygon

  138: { velocidade: 4, felicidade: 5, resistencia: 6, acrobacia: 4, especial: "Reage a fósseis antigos." },       // Omanyte
  139: { velocidade: 5, felicidade: 5, resistencia: 8, acrobacia: 5, especial: "Quebra conchas resistentes." },      // Omastar

  140: { velocidade: 6, felicidade: 5, resistencia: 5, acrobacia: 7, especial: "Escala quedas d'água." },    // Kabuto
  141: { velocidade: 7, felicidade: 5, resistencia: 7, acrobacia: 8, especial: "Sobe cachoeiras velozmente." },      // Kabutops

  142: { velocidade: 9, felicidade: 5, resistencia: 6, acrobacia: 10, especial: "Voa livremente pelos céus." },                // Aerodactyl

  143: { velocidade: 3, felicidade: 10, resistencia: 10, acrobacia: 2, especial: "Recupera energia ao dormir." },     // Snorlax

  144: { velocidade: 8, felicidade: 8, resistencia: 7, acrobacia: 9, especial: "Provoca nevasca contínua." },      // Articuno
  145: { velocidade: 9, felicidade: 8, resistencia: 7, acrobacia: 9, especial: "Invoca tempestade elétrica." },  // Zapdos
  146: { velocidade: 9, felicidade: 8, resistencia: 8, acrobacia: 9, especial: "Cria clima ensolarado intenso." },     // Moltres

  147: { velocidade: 4, felicidade: 7, resistencia: 5, acrobacia: 4, especial: "Sente grandes massas de água." },          // Dratini
  148: { velocidade: 6, felicidade: 7, resistencia: 7, acrobacia: 6, especial: "Nada longas distâncias oceânicas." },          // Dragonair
  149: { velocidade: 9, felicidade: 7, resistencia: 10, acrobacia: 9, especial: "Realiza voos intercontinentais." },        // Dragonite

  150: { velocidade: 10, felicidade: 5, resistencia: 10, acrobacia: 10, especial: "Move objetos com telecinese." },  // Mewtwo
  151: { velocidade: 10, felicidade: 10, resistencia: 10, acrobacia: 10, especial: "Purifica energia e ambiente." },    // Mew

  152: { velocidade: 4, felicidade: 6, resistencia: 5, acrobacia: 4, especial: "Faz plantas crescerem sob seus pés." },        // Chikorita
  153: { velocidade: 5, felicidade: 6, resistencia: 6, acrobacia: 4, especial: "Cria trilhas floridas." },     // Bayleef
  154: { velocidade: 6, felicidade: 7, resistencia: 8, acrobacia: 5, especial: "Restaura a natureza ao redor." },  // Meganium

  155: { velocidade: 6, felicidade: 5, resistencia: 4, acrobacia: 5, especial: "Acende pequenas chamas." },      // Cyndaquil
  156: { velocidade: 7, felicidade: 5, resistencia: 5, acrobacia: 6, especial: "Mantém fogo contínuo." },       // Quilava
  157: { velocidade: 8, felicidade: 6, resistencia: 6, acrobacia: 7, especial: "Libera explosão de calor." },    // Typhlosion

  158: { velocidade: 5, felicidade: 5, resistencia: 5, acrobacia: 5, especial: "Morde enquanto nada." },    // Totodile
  159: { velocidade: 6, felicidade: 5, resistencia: 6, acrobacia: 5, especial: "Abre passagens aquáticas." },     // Croconaw
  160: { velocidade: 6, felicidade: 5, resistencia: 8, acrobacia: 6, especial: "Arrebenta correntes e grades." },  // Feraligatr

  161: { velocidade: 5, felicidade: 5, resistencia: 3, acrobacia: 5, especial: "Observa e mapeia os arredores." },         // Sentret
  162: { velocidade: 7, felicidade: 5, resistencia: 5, acrobacia: 7, especial: "Atravessa longas distâncias rapidamente." },    // Furret

  163: { velocidade: 4, felicidade: 5, resistencia: 4, acrobacia: 5, especial: "Enxerga perfeitamente à noite." },       // Hoothoot
  164: { velocidade: 6, felicidade: 5, resistencia: 6, acrobacia: 6, especial: "Vigia áreas do alto." },       // Noctowl

  165: { velocidade: 4, felicidade: 5, resistencia: 3, acrobacia: 5, especial: "Poliniza flores do ambiente." },           // Ledyba
  166: { velocidade: 6, felicidade: 5, resistencia: 4, acrobacia: 7, especial: "Cria correntes de ar ao voar." },          // Ledian

  167: { velocidade: 4, felicidade: 4, resistencia: 3, acrobacia: 5, especial: "Sobe paredes usando teias." },       // Spinarak
  168: { velocidade: 6, felicidade: 4, resistencia: 5, acrobacia: 7, especial: "Arma teias para bloquear passagem." },      // Ariados
  169: { velocidade: 8, felicidade: 4, resistencia: 6, acrobacia: 9, especial: "Voa silenciosamente na escuridão." },      // Crobat

  170: { velocidade: 5, felicidade: 5, resistencia: 4, acrobacia: 5, especial: "Ilumina águas profundas." },   // Chinchou
  171: { velocidade: 5, felicidade: 5, resistencia: 6, acrobacia: 5, especial: "Energiza equipamentos submersos." },   // Lanturn

  172: { velocidade: 7, felicidade: 9, resistencia: 2, acrobacia: 6, especial: "Libera pequenas descargas elétricas." },   // Pichu
  173: { velocidade: 3, felicidade: 9, resistencia: 3, acrobacia: 3, especial: "Encanta pessoas ao redor." },    // Cleffa
  174: { velocidade: 3, felicidade: 9, resistencia: 4, acrobacia: 2, especial: "Canta alegremente animando aliados." },       // Igglybuff

  175: { velocidade: 3, felicidade: 9, resistencia: 3, acrobacia: 3, especial: "Abençoa com boa sorte." },      // Togepi
  176: { velocidade: 5, felicidade: 9, resistencia: 5, acrobacia: 7, especial: "Espalha energia positiva ao voar." },        // Togetic

  177: { velocidade: 6, felicidade: 5, resistencia: 3, acrobacia: 6, especial: "Percebe eventos futuros próximos." },           // Natu
  178: { velocidade: 8, felicidade: 5, resistencia: 5, acrobacia: 8, especial: "Prevê rotas seguras." },      // Xatu

  179: { velocidade: 3, felicidade: 7, resistencia: 4, acrobacia: 3, especial: "Armazena eletricidade na lã." },    // Mareep
  180: { velocidade: 4, felicidade: 7, resistencia: 5, acrobacia: 3, especial: "Amplifica energia elétrica." },    // Flaaffy
  181: { velocidade: 5, felicidade: 7, resistencia: 7, acrobacia: 4, especial: "Funciona como farol elétrico." },      // Ampharos

  182: { velocidade: 4, felicidade: 7, resistencia: 6, acrobacia: 4, especial: "Dança que cura ferimentos leves." },      // Bellossom

  183: { velocidade: 4, felicidade: 7, resistencia: 5, acrobacia: 4, especial: "Flutua sobre a água." },        // Marill
  184: { velocidade: 5, felicidade: 7, resistencia: 7, acrobacia: 4, especial: "Cria ondas protetoras." },      // Azumarill

  185: { velocidade: 2, felicidade: 5, resistencia: 8, acrobacia: 2, especial: "Imita árvore para se esconder." },   // Sudowoodo
  186: { velocidade: 5, felicidade: 6, resistencia: 7, acrobacia: 5, especial: "Invoca chuva contínua." },     // Politoed

  187: { velocidade: 4, felicidade: 6, resistencia: 3, acrobacia: 6, especial: "É levado pelo vento." },         // Hoppip
  188: { velocidade: 5, felicidade: 6, resistencia: 4, acrobacia: 7, especial: "Flutua com correntes de ar." },      // Skiploom
  189: { velocidade: 6, felicidade: 6, resistencia: 5, acrobacia: 8, especial: "Controla ventos altos." },        // Jumpluff

  190: { velocidade: 7, felicidade: 7, resistencia: 3, acrobacia: 9, especial: "Escala rapidamente usando a cauda." },      // Aipom

  191: { velocidade: 3, felicidade: 5, resistencia: 3, acrobacia: 2, especial: "Absorve luz solar lentamente." },  // Sunkern
  192: { velocidade: 4, felicidade: 6, resistencia: 5, acrobacia: 3, especial: "Dispara energia solar concentrada." },       // Sunflora

  193: { velocidade: 8, felicidade: 4, resistencia: 4, acrobacia: 9, especial: "Patrulha o céu rapidamente." },      // Yanma

  194: { velocidade: 2, felicidade: 6, resistencia: 5, acrobacia: 2, especial: "Atravessa áreas pantanosas." },  // Wooper
  195: { velocidade: 2, felicidade: 6, resistencia: 8, acrobacia: 2, especial: "Move-se livremente na lama." },      // Quagsire

  196: { velocidade: 9, felicidade: 8, resistencia: 5, acrobacia: 7, especial: "Lê pensamentos próximos." },       // Espeon
  197: { velocidade: 5, felicidade: 7, resistencia: 8, acrobacia: 6, especial: "Cria barreira sombria defensiva." },      // Umbreon

  198: { velocidade: 7, felicidade: 4, resistencia: 4, acrobacia: 7, especial: "Rouba pequenos objetos." },       // Murkrow
  199: { velocidade: 2, felicidade: 6, resistencia: 8, acrobacia: 2, especial: "Oferece conselhos sábios." },      // Slowking

  200: { velocidade: 7, felicidade: 3, resistencia: 3, acrobacia: 7, especial: "Produz ecos fantasmagóricos." },      // Misdreavus

  201: { velocidade: 5, felicidade: 5, resistencia: 5, acrobacia: 5, especial: "Emite runas com mensagens místicas." },      // Unown
  202: { velocidade: 3, felicidade: 6, resistencia: 9, acrobacia: 2, especial: "Reflete ataques recebidos." },       // Wobbuffet

  203: { velocidade: 7, felicidade: 5, resistencia: 5, acrobacia: 5, especial: "Observa em duas direções ao mesmo tempo." },         // Girafarig

  204: { velocidade: 2, felicidade: 4, resistencia: 7, acrobacia: 2, especial: "Fecha-se em casulo protetor." },       // Pineco
  205: { velocidade: 3, felicidade: 4, resistencia: 10, acrobacia: 2, especial: "Ergue defesa impenetrável." },     // Forretress

  206: { velocidade: 3, felicidade: 5, resistencia: 6, acrobacia: 3, especial: "Escapa por túneis estreitos." },    // Dunsparce
  207: { velocidade: 7, felicidade: 4, resistencia: 6, acrobacia: 8, especial: "Plana por penhascos." },     // Gligar
  208: { velocidade: 3, felicidade: 4, resistencia: 10, acrobacia: 3, especial: "Escava túneis metálicos." },     // Steelix

  209: { velocidade: 3, felicidade: 7, resistencia: 5, acrobacia: 3, especial: "Intimida com latido feroz." },  // Snubbull
  210: { velocidade: 4, felicidade: 6, resistencia: 7, acrobacia: 3, especial: "Protege aliados próximos." },    // Granbull

  211: { velocidade: 7, felicidade: 3, resistencia: 5, acrobacia: 5, especial: "Ergue espinhos venenosos na água." },   // Qwilfish
  212: { velocidade: 5, felicidade: 5, resistencia: 8, acrobacia: 7, especial: "Corta metal com pinças." },      // Scizor
  213: { velocidade: 1, felicidade: 4, resistencia: 10, acrobacia: 1, especial: "Suporta qualquer impacto." },    // Shuckle

  214: { velocidade: 7, felicidade: 5, resistencia: 8, acrobacia: 6, especial: "Investida extremamente poderosa." },     // Heracross
  215: { velocidade: 8, felicidade: 3, resistencia: 4, acrobacia: 8, especial: "Escala superfícies congeladas." },     // Sneasel

  216: { velocidade: 4, felicidade: 7, resistencia: 5, acrobacia: 4, especial: "Coleta mel nas árvores." },          // Teddiursa
  217: { velocidade: 5, felicidade: 5, resistencia: 8, acrobacia: 4, especial: "Ergue objetos pesados com facilidade." },         // Ursaring

  218: { velocidade: 3, felicidade: 4, resistencia: 6, acrobacia: 3, especial: "Derrete obstáculos com calor." },  // Slugma
  219: { velocidade: 3, felicidade: 4, resistencia: 8, acrobacia: 2, especial: "Funde rochas ao redor." },         // Magcargo

  220: { velocidade: 4, felicidade: 6, resistencia: 5, acrobacia: 3, especial: "Rastreia trilhas na neve." },        // Swinub
  221: { velocidade: 5, felicidade: 5, resistencia: 8, acrobacia: 4, especial: "Provoca pequenas avalanches." },            // Piloswine

  222: { velocidade: 3, felicidade: 6, resistencia: 6, acrobacia: 3, especial: "Forma recifes de coral." },          // Corsola
  223: { velocidade: 5, felicidade: 4, resistencia: 4, acrobacia: 5, especial: "Dispara jatos de água." },           // Remoraid
  224: { velocidade: 5, felicidade: 4, resistencia: 6, acrobacia: 4, especial: "Atira projéteis aquáticos." },   // Octillery

  225: { velocidade: 6, felicidade: 8, resistencia: 4, acrobacia: 6, especial: "Entrega itens e mensagens." },  // Delibird
  226: { velocidade: 6, felicidade: 5, resistencia: 5, acrobacia: 8, especial: "Plana sobre o oceano." },           // Mantine
  227: { velocidade: 5, felicidade: 4, resistencia: 10, acrobacia: 6, especial: "Protege o céu com asas metálicas." },        // Skarmory

  228: { velocidade: 6, felicidade: 3, resistencia: 4, acrobacia: 5, especial: "Segue rastros na escuridão." },       // Houndour
  229: { velocidade: 8, felicidade: 3, resistencia: 5, acrobacia: 6, especial: "Libera chamas infernais." },        // Houndoom

  230: { velocidade: 7, felicidade: 5, resistencia: 7, acrobacia: 6, especial: "Controla correntes marítimas." },        // Kingdra

  231: { velocidade: 4, felicidade: 6, resistencia: 5, acrobacia: 3, especial: "Escava com a tromba." },            // Phanpy
  232: { velocidade: 5, felicidade: 5, resistencia: 9, acrobacia: 3, especial: "Atropela abrindo caminho." },     // Donphan

  233: { velocidade: 7, felicidade: 4, resistencia: 6, acrobacia: 6, especial: "Simula sistemas complexos." },   // Porygon2
  234: { velocidade: 7, felicidade: 5, resistencia: 5, acrobacia: 7, especial: "Guia viajantes pela floresta." },       // Stantler
  235: { velocidade: 5, felicidade: 7, resistencia: 4, acrobacia: 5, especial: "Copia técnicas observadas." },    // Smeargle

  236: { velocidade: 5, felicidade: 5, resistencia: 5, acrobacia: 5, especial: "Treina combate com aliados." },      // Tyrogue
  237: { velocidade: 7, felicidade: 5, resistencia: 6, acrobacia: 8, especial: "Gira desviando ataques." },       // Hitmontop

  238: { velocidade: 6, felicidade: 7, resistencia: 3, acrobacia: 5, especial: "Congela com beijo gelado." },         // Smoochum
  239: { velocidade: 8, felicidade: 6, resistencia: 3, acrobacia: 6, especial: "Solta descarga elétrica intensa." },           // Elekid
  240: { velocidade: 7, felicidade: 6, resistencia: 3, acrobacia: 5, especial: "Acende fogo instantaneamente." },       // Magby

  241: { velocidade: 8, felicidade: 8, resistencia: 7, acrobacia: 4, especial: "Produz leite nutritivo." },       // Miltank
  242: { velocidade: 4, felicidade: 10, resistencia: 8, acrobacia: 3, especial: "Realiza cura completa." },        // Blissey

  243: { velocidade: 8, felicidade: 5, resistencia: 7, acrobacia: 7, especial: "Move tempestades ao correr." },    // Raikou
  244: { velocidade: 8, felicidade: 5, resistencia: 7, acrobacia: 7, especial: "Abre caminho com erupções." },     // Entei
  245: { velocidade: 7, felicidade: 6, resistencia: 8, acrobacia: 7, especial: "Purifica águas ao passar." },   // Suicune

  246: { velocidade: 4, felicidade: 3, resistencia: 6, acrobacia: 3, especial: "Sente vibrações do solo." },        // Larvitar
  247: { velocidade: 5, felicidade: 3, resistencia: 7, acrobacia: 4, especial: "Protege-se em casulo rochoso." },       // Pupitar
  248: { velocidade: 6, felicidade: 4, resistencia: 10, acrobacia: 5, especial: "Altera o terreno ao redor." },    // Tyranitar

  249: { velocidade: 8, felicidade: 7, resistencia: 9, acrobacia: 8, especial: "Acalma mares e tempestades." },            // Lugia
  250: { velocidade: 8, felicidade: 8, resistencia: 9, acrobacia: 8, especial: "Renasce e cura com chamas sagradas." },     // Ho-Oh
  251: { velocidade: 8, felicidade: 10, resistencia: 8, acrobacia: 8, especial: "Viaja pelo tempo e restaura florestas." },    // Celebi
  252: { velocidade: 7, felicidade: 6, resistencia: 4, acrobacia: 8, especial: "Escala paredes e árvores rapidamente." }, // Treecko
  253: { velocidade: 8, felicidade: 6, resistencia: 5, acrobacia: 9, especial: "Move-se entre galhos sem ser visto." }, // Grovyle
  254: { velocidade: 9, felicidade: 7, resistencia: 7, acrobacia: 9, especial: "Corta obstáculos com lâminas de folhas." }, // Sceptile

  255: { velocidade: 6, felicidade: 7, resistencia: 4, acrobacia: 6, especial: "Solta pequenas labaredas ao redor." }, // Torchic
  256: { velocidade: 7, felicidade: 7, resistencia: 6, acrobacia: 7, especial: "Golpeia com chutes em sequência." }, // Combusken
  257: { velocidade: 8, felicidade: 8, resistencia: 7, acrobacia: 8, especial: "Salta alto deixando rastro de fogo." }, // Blaziken

  258: { velocidade: 4, felicidade: 7, resistencia: 6, acrobacia: 3, especial: "Nada em lama sem afundar." }, // Mudkip
  259: { velocidade: 4, felicidade: 7, resistencia: 7, acrobacia: 3, especial: "Cria lama para dificultar avanço." }, // Marshtomp
  260: { velocidade: 5, felicidade: 8, resistencia: 9, acrobacia: 4, especial: "Provoca tremores ao golpear o chão." }, // Swampert

  261: { velocidade: 6, felicidade: 5, resistencia: 4, acrobacia: 5, especial: "Rastreia presas pelo cheiro." }, // Poochyena
  262: { velocidade: 7, felicidade: 5, resistencia: 6, acrobacia: 6, especial: "Intimida inimigos com uivo." }, // Mightyena

  263: { velocidade: 6, felicidade: 7, resistencia: 4, acrobacia: 6, especial: "Procura itens escondidos." }, // Zigzagoon
  264: { velocidade: 7, felicidade: 7, resistencia: 5, acrobacia: 7, especial: "Corre veloz abrindo trilhas." }, // Linoone

  265: { velocidade: 3, felicidade: 5, resistencia: 3, acrobacia: 2, especial: "Produz fios para se prender." }, // Wurmple
  266: { velocidade: 2, felicidade: 5, resistencia: 6, acrobacia: 1, especial: "Endurece o casulo defensivamente." }, // Silcoon
  267: { velocidade: 6, felicidade: 6, resistencia: 5, acrobacia: 7, especial: "Espalha pólen que enfraquece." }, // Beautifly

  268: { velocidade: 2, felicidade: 5, resistencia: 6, acrobacia: 1, especial: "Resiste ataques protegido no casulo." }, // Cascoon
  269: { velocidade: 5, felicidade: 5, resistencia: 6, acrobacia: 6, especial: "Libera nuvem venenosa." }, // Dustox
  270: { velocidade: 3, felicidade: 6, resistencia: 5, acrobacia: 3, especial: "Flutua sobre a água parada." }, // Lotad
  271: { velocidade: 4, felicidade: 6, resistencia: 6, acrobacia: 4, especial: "Dança invocando chuva leve." }, // Lombre
  272: { velocidade: 5, felicidade: 7, resistencia: 7, acrobacia: 5, especial: "Cria chuva intensa ao dançar." }, // Ludicolo
  273: { velocidade: 3, felicidade: 5, resistencia: 4, acrobacia: 2, especial: "Finge ser planta para se esconder." }, // Seedot
  274: { velocidade: 5, felicidade: 5, resistencia: 5, acrobacia: 5, especial: "Assusta inimigos surgindo das árvores." }, // Nuzleaf
  275: { velocidade: 7, felicidade: 6, resistencia: 7, acrobacia: 7, especial: "Controla rajadas de vento cortante." }, // Shiftry
  276: { velocidade: 8, felicidade: 5, resistencia: 3, acrobacia: 7, especial: "Mergulha velozmente contra o alvo" }, // Taillow
  277: { velocidade: 9, felicidade: 6, resistencia: 4, acrobacia: 8, especial: "Corta o ar em rasantes contínuos" }, // Swellow
  278: { velocidade: 6, felicidade: 5, resistencia: 4, acrobacia: 6, especial: "Desliza sobre o mar capturando presas" }, // Wingull
  279: { velocidade: 5, felicidade: 6, resistencia: 7, acrobacia: 5, especial: "Armazena água no bico e lança jatos" }, // Pelipper
  280: { velocidade: 4, felicidade: 8, resistencia: 4, acrobacia: 4, especial: "Sente emoções próximas e se aproxima" }, // Ralts
  281: { velocidade: 5, felicidade: 8, resistencia: 5, acrobacia: 5, especial: "Cria pequena distorção psíquica ao redor" }, // Kirlia
  282: { velocidade: 6, felicidade: 9, resistencia: 6, acrobacia: 6, especial: "Dobra o espaço em um campo psíquico" }, // Gardevoir
  283: { velocidade: 7, felicidade: 5, resistencia: 3, acrobacia: 7, especial: "Corre sobre a superfície da água" }, // Surskit
  284: { velocidade: 8, felicidade: 6, resistencia: 4, acrobacia: 8, especial: "Bate as asas criando poeira brilhante" }, // Masquerain
  285: { velocidade: 3, felicidade: 6, resistencia: 5, acrobacia: 2, especial: "Espalha esporos sonolentos ao redor" }, // Shroomish
  286: { velocidade: 5, felicidade: 6, resistencia: 7, acrobacia: 5, especial: "Golpeia o chão liberando esporos" }, // Breloom
  287: { velocidade: 2, felicidade: 7, resistencia: 6, acrobacia: 1, especial: "Boceja profundamente afetando quem observa" }, // Slakoth
  288: { velocidade: 5, felicidade: 6, resistencia: 7, acrobacia: 5, especial: "Persegue o alvo sem parar" }, // Vigoroth
  289: { velocidade: 7, felicidade: 8, resistencia: 10, acrobacia: 6, especial: "Libera uma onda de força esmagadora" }, // Slaking
  290: { velocidade: 5, felicidade: 5, resistencia: 4, acrobacia: 6, especial: "Vive oculto sob o solo e vibra o terreno" }, // Nincada
  291: { velocidade: 10, felicidade: 6, resistencia: 3, acrobacia: 10, especial: "Move-se tão rápido que quase desaparece" }, // Ninjask
  292: { velocidade: 4, felicidade: 4, resistencia: 1, acrobacia: 4, especial: "Permanece imóvel drenando energia vital" }, // Shedinja
  293: { velocidade: 3, felicidade: 6, resistencia: 5, acrobacia: 2, especial: "Emite grito que faz o chão tremer" }, // Whismur
  294: { velocidade: 4, felicidade: 6, resistencia: 6, acrobacia: 3, especial: "Solta berro ensurdecedor contínuo" }, // Loudred
  295: { velocidade: 5, felicidade: 7, resistencia: 8, acrobacia: 4, especial: "Produz onda sonora que empurra tudo" }, // Exploud
  296: { velocidade: 4, felicidade: 6, resistencia: 7, acrobacia: 4, especial: "Treina golpes repetindo movimentos" }, // Makuhita
  297: { velocidade: 3, felicidade: 7, resistencia: 9, acrobacia: 3, especial: "Golpeia com palmas liberando impacto" }, // Hariyama
  298: { velocidade: 4, felicidade: 9, resistencia: 4, acrobacia: 3, especial: "Salta alegremente fortalecendo aliados" }, // Azurill
  299: { velocidade: 2, felicidade: 5, resistencia: 9, acrobacia: 1, especial: "Alinha o corpo emitindo pulso magnético" }, // Nosepass
  300: { velocidade: 5, felicidade: 8, resistencia: 4, acrobacia: 6, especial: "Encanta quem observa com gestos graciosos" }, // Skitty
  301: { velocidade: 7, felicidade: 8, resistencia: 5, acrobacia: 7, especial: "Gira a cauda espalhando charme ao redor" }, // Delcatty
  302: { velocidade: 6, felicidade: 5, resistencia: 6, acrobacia: 6, especial: "Espia das sombras assustando o alvo" }, // Sableye
  303: { velocidade: 5, felicidade: 7, resistencia: 8, acrobacia: 5, especial: "Morde esmagando pedras com a mandíbula" }, // Mawile
  304: { velocidade: 3, felicidade: 5, resistencia: 9, acrobacia: 2, especial: "Resiste firme como uma muralha metálica" }, // Aron
  305: { velocidade: 4, felicidade: 5, resistencia: 10, acrobacia: 3, especial: "Avança derrubando obstáculos pesados" }, // Lairon
  306: { velocidade: 5, felicidade: 6, resistencia: 10, acrobacia: 4, especial: "Provoca tremor ao pisar com força" }, // Aggron
  307: { velocidade: 5, felicidade: 7, resistencia: 6, acrobacia: 5, especial: "Medita elevando energia interior" }, // Meditite
  308: { velocidade: 7, felicidade: 8, resistencia: 7, acrobacia: 7, especial: "Move-se prevendo ataques do oponente" }, // Medicham
  309: { velocidade: 8, felicidade: 6, resistencia: 4, acrobacia: 7, especial: "Gera faíscas ao correr pelo chão" }, // Electrike
  310: { velocidade: 9, felicidade: 7, resistencia: 5, acrobacia: 8, especial: "Dispara relâmpago rápido ao redor" }, // Manectric
  311: { velocidade: 8, felicidade: 8, resistencia: 5, acrobacia: 7, especial: "Irradia energia positiva no campo" }, // Plusle
  312: { velocidade: 8, felicidade: 8, resistencia: 5, acrobacia: 7, especial: "Irradia energia negativa no campo" }, // Minun
  313: { velocidade: 7, felicidade: 6, resistencia: 5, acrobacia: 7, especial: "Pisca luzes atraindo a atenção" }, // Volbeat
  314: { velocidade: 7, felicidade: 7, resistencia: 5, acrobacia: 7, especial: "Brilha dançando ao entardecer" }, // Illumise
  315: { velocidade: 5, felicidade: 7, resistencia: 4, acrobacia: 5, especial: "Espalha pétalas perfumadas no ar" }, // Roselia
  316: { velocidade: 3, felicidade: 6, resistencia: 6, acrobacia: 2, especial: "Absorve tudo que toca com o corpo gelatinoso" }, // Gulpin
  317: { velocidade: 4, felicidade: 6, resistencia: 8, acrobacia: 3, especial: "Expele jato tóxico após inflar o corpo" }, // Swalot
  318: { velocidade: 7, felicidade: 5, resistencia: 4, acrobacia: 7, especial: "Nada veloz farejando sangue na água" }, // Carvanha
  319: { velocidade: 8, felicidade: 6, resistencia: 6, acrobacia: 7, especial: "Avança em investida aquática feroz" }, // Sharpedo
  320: { velocidade: 4, felicidade: 6, resistencia: 7, acrobacia: 3, especial: "Salta liberando grande coluna d’água" }, // Wailmer
  321: { velocidade: 5, felicidade: 7, resistencia: 10, acrobacia: 3, especial: "Cria ondas enormes ao emergir" }, // Wailord
  322: { velocidade: 4, felicidade: 5, resistencia: 7, acrobacia: 3, especial: "Armazena magma no interior do corpo" }, // Numel
  323: { velocidade: 5, felicidade: 6, resistencia: 9, acrobacia: 4, especial: "Ergue jorro de lava ao redor" }, // Camerupt
  324: { velocidade: 2, felicidade: 6, resistencia: 10, acrobacia: 1, especial: "Permanece imóvel irradiando calor intenso" }, // Torkoal
  325: { velocidade: 4, felicidade: 7, resistencia: 6, acrobacia: 4, especial: "Salta fazendo moedas tilintarem" }, // Spoink
  326: { velocidade: 5, felicidade: 7, resistencia: 7, acrobacia: 4, especial: "Usa energia psíquica para empurrar inimigos" }, // Grumpig
  327: { velocidade: 6, felicidade: 6, resistencia: 5, acrobacia: 6, especial: "Confunde adversários com movimentos erráticos" }, // Spinda
  328: { velocidade: 5, felicidade: 5, resistencia: 5, acrobacia: 5, especial: "Vibra asas levantando areia" }, // Trapinch
  329: { velocidade: 7, felicidade: 6, resistencia: 5, acrobacia: 7, especial: "Bate asas criando tempestade de areia" }, // Vibrava
  330: { velocidade: 8, felicidade: 7, resistencia: 7, acrobacia: 8, especial: "Sobrevoa levantando vendaval do deserto" }, // Flygon
  331: { velocidade: 4, felicidade: 6, resistencia: 5, acrobacia: 4, especial: "Ergue espinhos para se proteger" }, // Cacnea
  332: { velocidade: 5, felicidade: 6, resistencia: 7, acrobacia: 5, especial: "Dispara agulhas giratórias" }, // Cacturne
  333: { velocidade: 5, felicidade: 8, resistencia: 4, acrobacia: 6, especial: "Canta acalmando quem escuta" }, // Swablu
  334: { velocidade: 6, felicidade: 9, resistencia: 6, acrobacia: 7, especial: "Envolve o campo em canto harmonioso" }, // Altaria
  335: { velocidade: 7, felicidade: 6, resistencia: 6, acrobacia: 7, especial: "Avança cortando com as garras" }, // Zangoose
  336: { velocidade: 6, felicidade: 6, resistencia: 7, acrobacia: 6, especial: "Espreita liberando veneno pelo corpo" }, // Seviper
  337: { velocidade: 4, felicidade: 7, resistencia: 7, acrobacia: 4, especial: "Reflete luz lunar em energia mística" }, // Lunatone
  338: { velocidade: 4, felicidade: 7, resistencia: 7, acrobacia: 4, especial: "Irradia calor solar intenso" }, // Solrock
  339: { velocidade: 3, felicidade: 5, resistencia: 6, acrobacia: 2, especial: "Permanece enterrado aguardando presa" }, // Barboach
  340: { velocidade: 4, felicidade: 6, resistencia: 8, acrobacia: 3, especial: "Provoca redemoinho na água barrenta" }, // Whiscash
  341: { velocidade: 4, felicidade: 6, resistencia: 6, acrobacia: 4, especial: "Anda de lado levantando lama" }, // Corphish
  342: { velocidade: 5, felicidade: 6, resistencia: 8, acrobacia: 5, especial: "Esmaga com pinças gigantes" }, // Crawdaunt
  343: { velocidade: 4, felicidade: 5, resistencia: 6, acrobacia: 3, especial: "Gira confundindo quem se aproxima" }, // Baltoy
  344: { velocidade: 5, felicidade: 6, resistencia: 8, acrobacia: 4, especial: "Flutua emitindo poder ancestral" }, // Claydol
  345: { velocidade: 2, felicidade: 6, resistencia: 7, acrobacia: 2, especial: "Abre pétalas absorvendo luz solar" }, // Lileep
  346: { velocidade: 3, felicidade: 6, resistencia: 9, acrobacia: 2, especial: "Prende o alvo com tentáculos pétreos" }, // Cradily
  347: { velocidade: 4, felicidade: 5, resistencia: 6, acrobacia: 4, especial: "Enterra-se para evitar ataques" }, // Anorith
  348: { velocidade: 6, felicidade: 6, resistencia: 8, acrobacia: 6, especial: "Avança cortando com lâminas dos braços" }, // Armaldo
  349: { velocidade: 2, felicidade: 7, resistencia: 2, acrobacia: 1, especial: "Debate-se tentando sobreviver" }, // Feebas
  350: { velocidade: 7, felicidade: 10, resistencia: 7, acrobacia: 8, especial: "Surge criando aura de beleza mística" }, // Milotic
  351: { velocidade: 6, felicidade: 7, resistencia: 5, acrobacia: 6, especial: "Muda o clima ao redor do campo" }, // Castform
  352: { velocidade: 7, felicidade: 6, resistencia: 5, acrobacia: 7, especial: "Imita o ambiente ficando invisível" }, // Kecleon
  353: { velocidade: 5, felicidade: 5, resistencia: 4, acrobacia: 5, especial: "Aparece silenciosamente atrás do alvo" }, // Shuppet
  354: { velocidade: 6, felicidade: 5, resistencia: 6, acrobacia: 6, especial: "Manipula a própria sombra para atacar" }, // Banette
  355: { velocidade: 4, felicidade: 5, resistencia: 5, acrobacia: 4, especial: "Flutua emitindo sussurros noturnos" }, // Duskull
  356: { velocidade: 5, felicidade: 6, resistencia: 8, acrobacia: 5, especial: "Aprisiona o alvo dentro do corpo espectral" }, // Dusclops
  357: { velocidade: 3, felicidade: 7, resistencia: 7, acrobacia: 2, especial: "Oferece frutos maduros aos aliados" }, // Tropius
  358: { velocidade: 4, felicidade: 9, resistencia: 5, acrobacia: 4, especial: "Ecoa som puro restaurando ânimo" }, // Chimecho
  359: { velocidade: 9, felicidade: 6, resistencia: 6, acrobacia: 8, especial: "Surge trazendo presságio sombrio" }, // Absol
  360: { velocidade: 2, felicidade: 10, resistencia: 6, acrobacia: 1, especial: "Observa em silêncio refletindo ataques" }, // Wynaut
  361: { velocidade: 5, felicidade: 6, resistencia: 5, acrobacia: 5, especial: "Congela o ar ao redor do corpo" }, // Snorunt
  362: { velocidade: 7, felicidade: 6, resistencia: 8, acrobacia: 7, especial: "Invoca nevasca intensa" }, // Glalie
  363: { velocidade: 3, felicidade: 7, resistencia: 7, acrobacia: 2, especial: "Bate nadadeiras espalhando gelo" }, // Spheal
  364: { velocidade: 4, felicidade: 7, resistencia: 8, acrobacia: 3, especial: "Rola sobre o gelo derrubando oponentes" }, // Sealeo
  365: { velocidade: 5, felicidade: 8, resistencia: 10, acrobacia: 4, especial: "Quebra placas de gelo com as presas" }, // Walrein
  366: { velocidade: 4, felicidade: 5, resistencia: 7, acrobacia: 3, especial: "Fecha a concha bloqueando ataques" }, // Clamperl
  367: { velocidade: 6, felicidade: 6, resistencia: 5, acrobacia: 6, especial: "Nada em correntes oceânicas rápidas" }, // Huntail
  368: { velocidade: 6, felicidade: 7, resistencia: 5, acrobacia: 7, especial: "Brilha nas profundezas atraindo presas" }, // Gorebyss
  369: { velocidade: 3, felicidade: 7, resistencia: 10, acrobacia: 2, especial: "Permanece imóvel como rocha milenar" }, // Relicanth
  370: { velocidade: 5, felicidade: 10, resistencia: 5, acrobacia: 6, especial: "Nada formando corações na água" }, // Luvdisc
  371: { velocidade: 5, felicidade: 6, resistencia: 6, acrobacia: 5, especial: "Golpeia com a cabeça sem hesitar" }, // Bagon
  372: { velocidade: 4, felicidade: 6, resistencia: 9, acrobacia: 3, especial: "Protege o corpo com casco duro" }, // Shelgon
  373: { velocidade: 8, felicidade: 8, resistencia: 9, acrobacia: 8, especial: "Sobrevoa liberando rajadas dracônicas" }, // Salamence
  374: { velocidade: 3, felicidade: 5, resistencia: 8, acrobacia: 2, especial: "Flutua guiado por força magnética" }, // Beldum
  375: { velocidade: 5, felicidade: 6, resistencia: 9, acrobacia: 4, especial: "Une mentes ampliando poder psíquico" }, // Metang
  376: { velocidade: 6, felicidade: 7, resistencia: 10, acrobacia: 5, especial: "Impacta o chão com força colossal" }, // Metagross
  377: { velocidade: 3, felicidade: 6, resistencia: 10, acrobacia: 2, especial: "Selos antigos emanam energia estável" }, // Regirock
  378: { velocidade: 3, felicidade: 6, resistencia: 10, acrobacia: 2, especial: "Irradia frio absoluto ao redor" }, // Regice
  379: { velocidade: 3, felicidade: 6, resistencia: 10, acrobacia: 2, especial: "Carrega energia elétrica ancestral" }, // Registeel
  380: { velocidade: 9, felicidade: 9, resistencia: 7, acrobacia: 9, especial: "Sobrevoa protegendo aliados com luz" }, // Latias
  381: { velocidade: 9, felicidade: 9, resistencia: 7, acrobacia: 9, especial: "Corta o céu com velocidade psíquica" }, // Latios
  382: { velocidade: 5, felicidade: 8, resistencia: 10, acrobacia: 5, especial: "Expande os mares com ondas gigantes" }, // Kyogre
  383: { velocidade: 6, felicidade: 8, resistencia: 10, acrobacia: 6, especial: "Ergue continentes liberando magma" }, // Groudon
  384: { velocidade: 10, felicidade: 10, resistencia: 10, acrobacia: 10, especial: "Desce dos céus dominando ventos" }, // Rayquaza
  385: { velocidade: 8, felicidade: 10, resistencia: 8, acrobacia: 8, especial: "Realiza desejos envolvendo o campo em luz" }, // Jirachi
  386: { velocidade: 10, felicidade: 7, resistencia: 8, acrobacia: 10, especial: "Altera a própria forma para combater" }, // Deoxys


  387: { velocidade: 4, felicidade: 6, resistencia: 6, acrobacia: 3, especial: "Faz brotar pequenas vinhas ao redor" }, // Turtwig
  388: { velocidade: 5, felicidade: 6, resistencia: 7, acrobacia: 4, especial: "Fortalece o solo com raízes espessas" }, // Grotle
  389: { velocidade: 6, felicidade: 7, resistencia: 9, acrobacia: 4, especial: "Ergue pilares de terra cobertos por árvores" }, // Torterra
  390: { velocidade: 7, felicidade: 6, resistencia: 4, acrobacia: 7, especial: "Salta envolto em chamas rápidas" }, // Chimchar
  391: { velocidade: 8, felicidade: 6, resistencia: 5, acrobacia: 8, especial: "Gira desferindo golpes flamejantes" }, // Monferno
  392: { velocidade: 9, felicidade: 7, resistencia: 6, acrobacia: 9, especial: "Avança deixando um rastro de fogo intenso" }, // Infernape
  393: { velocidade: 4, felicidade: 7, resistencia: 5, acrobacia: 3, especial: "Dispara pequenas ondas de água" }, // Piplup
  394: { velocidade: 5, felicidade: 7, resistencia: 6, acrobacia: 4, especial: "Golpeia com jatos de água pressurizada" }, // Prinplup
  395: { velocidade: 6, felicidade: 8, resistencia: 8, acrobacia: 5, especial: "Invoca uma maré metálica ao redor" }, // Empoleon
  396: { velocidade: 6, felicidade: 6, resistencia: 3, acrobacia: 6, especial: "Avança em voo rasante veloz" }, // Starly
  397: { velocidade: 7, felicidade: 6, resistencia: 4, acrobacia: 7, especial: "Corta o ar com investidas aéreas" }, // Staravia
  398: { velocidade: 9, felicidade: 7, resistencia: 6, acrobacia: 9, especial: "Despenca do céu com força devastadora" }, // Staraptor
  399: { velocidade: 3, felicidade: 7, resistencia: 5, acrobacia: 2, especial: "Rói obstáculos abrindo caminho" }, // Bidoof
  400: { velocidade: 5, felicidade: 7, resistencia: 7, acrobacia: 4, especial: "Constrói barreira improvisada no campo" }, // Bibarel
  401: { velocidade: 4, felicidade: 6, resistencia: 4, acrobacia: 4, especial: "Produz som vibrante que ecoa ao redor" }, // Kricketot
  402: { velocidade: 6, felicidade: 7, resistencia: 5, acrobacia: 6, especial: "Entoa melodia que energiza aliados" }, // Kricketune
  403: { velocidade: 5, felicidade: 6, resistencia: 4, acrobacia: 5, especial: "Libera faíscas ao se movimentar" }, // Shinx
  404: { velocidade: 6, felicidade: 6, resistencia: 5, acrobacia: 6, especial: "Carrega eletricidade no próprio corpo" }, // Luxio
  405: { velocidade: 8, felicidade: 7, resistencia: 6, acrobacia: 8, especial: "Dispara relâmpago feroz contra o alvo" }, // Luxray
  406: { velocidade: 4, felicidade: 8, resistencia: 4, acrobacia: 3, especial: "Espalha pólen restaurador no ar" }, // Budew
  407: { velocidade: 7, felicidade: 8, resistencia: 5, acrobacia: 6, especial: "Libera pétalas cortantes ao redor" }, // Roserade
  408: { velocidade: 6, felicidade: 6, resistencia: 5, acrobacia: 5, especial: "Avança com cabeçada poderosa" }, // Cranidos
  409: { velocidade: 7, felicidade: 7, resistencia: 6, acrobacia: 6, especial: "Quebra o chão com impacto brutal" }, // Rampardos
  410: { velocidade: 3, felicidade: 6, resistencia: 8, acrobacia: 2, especial: "Ergue escudo rochoso à frente" }, // Shieldon
  411: { velocidade: 4, felicidade: 7, resistencia: 10, acrobacia: 3, especial: "Forma muralha impenetrável no campo" }, // Bastiodon
  483: { velocidade: 7, felicidade: 9, resistencia: 10, acrobacia: 6, especial: "Distorce o tempo ao seu redor" }, // Dialga
  484: { velocidade: 7, felicidade: 9, resistencia: 10, acrobacia: 7, especial: "Rasga o espaço com energia dracônica" }, // Palkia
  485: { velocidade: 6, felicidade: 8, resistencia: 9, acrobacia: 5, especial: "Ergue colunas de lava ardente" }, // Heatran
  486: { velocidade: 4, felicidade: 7, resistencia: 10, acrobacia: 3, especial: "Desperta força ancestral adormecida" }, // Regigigas
  487: { velocidade: 7, felicidade: 9, resistencia: 10, acrobacia: 7, especial: "Surge das sombras alterando dimensões" }, // Giratina
  488: { velocidade: 6, felicidade: 10, resistencia: 9, acrobacia: 6, especial: "Espalha luz serena restaurando o campo" }, // Cresselia
  489: { velocidade: 6, felicidade: 9, resistencia: 6, acrobacia: 6, especial: "Dança sobre as ondas suavemente" }, // Phione
  490: { velocidade: 7, felicidade: 10, resistencia: 8, acrobacia: 7, especial: "Controla as marés com graça divina" }, // Manaphy
  491: { velocidade: 9, felicidade: 6, resistencia: 8, acrobacia: 9, especial: "Induz pesadelos que drenam energia" }, // Darkrai
  492: { velocidade: 8, felicidade: 10, resistencia: 7, acrobacia: 8, especial: "Floresce purificando o ambiente" }, // Shaymin
  493: { velocidade: 10, felicidade: 10, resistencia: 10, acrobacia: 10, especial: "Manifesta energia primordial absoluta" }, // Arceus
  494: { velocidade: 4, felicidade: 3, resistencia: 3, acrobacia: 5, especial: "Controla o ambiente natural." },
  495: { velocidade: 4, felicidade: 6, resistencia: 6, acrobacia: 7, especial: "Cria uma aura protetora temporária." },
  496: { velocidade: 10, felicidade: 9, resistencia: 3, acrobacia: 2, especial: "Aumenta a moral de aliados próximos." },
  497: { velocidade: 5, felicidade: 4, resistencia: 5, acrobacia: 2, especial: "Aumenta a moral de aliados próximos." },
  498: { velocidade: 2, felicidade: 4, resistencia: 6, acrobacia: 5, especial: "Fortalece aliados com presença inspiradora." },
  499: { velocidade: 10, felicidade: 3, resistencia: 10, acrobacia: 6, especial: "Fortalece aliados com presença inspiradora." },
  500: { velocidade: 10, felicidade: 7, resistencia: 1, acrobacia: 8, especial: "Fortalece aliados com presença inspiradora." },
  501: { velocidade: 3, felicidade: 5, resistencia: 3, acrobacia: 2, especial: "Controla o ambiente natural." },
  502: { velocidade: 4, felicidade: 3, resistencia: 6, acrobacia: 8, especial: "Cria uma aura protetora temporária." },
  503: { velocidade: 2, felicidade: 6, resistencia: 2, acrobacia: 6, especial: "Recupera vigor durante batalhas longas." },
  504: { velocidade: 5, felicidade: 6, resistencia: 8, acrobacia: 6, especial: "Move-se silenciosamente pelo terreno." },
  505: { velocidade: 2, felicidade: 9, resistencia: 7, acrobacia: 4, especial: "Manipula energia elemental ao redor." },
  506: { velocidade: 7, felicidade: 2, resistencia: 5, acrobacia: 7, especial: "Controla o ambiente natural." },
  507: { velocidade: 3, felicidade: 4, resistencia: 2, acrobacia: 10, especial: "Cria uma aura protetora temporária." },
  508: { velocidade: 4, felicidade: 3, resistencia: 8, acrobacia: 1, especial: "Confunde o oponente com movimentos rápidos." },
  509: { velocidade: 2, felicidade: 4, resistencia: 5, acrobacia: 9, especial: "Confunde o oponente com movimentos rápidos." },
  510: { velocidade: 3, felicidade: 6, resistencia: 5, acrobacia: 7, especial: "Recupera vigor durante batalhas longas." },
  511: { velocidade: 2, felicidade: 9, resistencia: 6, acrobacia: 6, especial: "Manipula energia elemental ao redor." },
  512: { velocidade: 7, felicidade: 3, resistencia: 2, acrobacia: 9, especial: "Manipula energia elemental ao redor." },
  513: { velocidade: 3, felicidade: 3, resistencia: 3, acrobacia: 7, especial: "Confunde o oponente com movimentos rápidos." },
  514: { velocidade: 3, felicidade: 5, resistencia: 8, acrobacia: 5, especial: "Manipula energia elemental ao redor." },
  515: { velocidade: 1, felicidade: 5, resistencia: 5, acrobacia: 5, especial: "Fortalece aliados com presença inspiradora." },
  516: { velocidade: 10, felicidade: 6, resistencia: 5, acrobacia: 5, especial: "Fortalece aliados com presença inspiradora." },
  517: { velocidade: 10, felicidade: 10, resistencia: 8, acrobacia: 4, especial: "Controla o ambiente natural." },
  518: { velocidade: 6, felicidade: 9, resistencia: 2, acrobacia: 6, especial: "Confunde o oponente com movimentos rápidos." },
  519: { velocidade: 8, felicidade: 7, resistencia: 3, acrobacia: 5, especial: "Move-se silenciosamente pelo terreno." },
  520: { velocidade: 4, felicidade: 2, resistencia: 7, acrobacia: 10, especial: "Fortalece aliados com presença inspiradora." },
  521: { velocidade: 6, felicidade: 7, resistencia: 10, acrobacia: 4, especial: "Confunde o oponente com movimentos rápidos." },
  522: { velocidade: 10, felicidade: 5, resistencia: 7, acrobacia: 5, especial: "Cria uma aura protetora temporária." },
  523: { velocidade: 9, felicidade: 8, resistencia: 5, acrobacia: 10, especial: "Move-se silenciosamente pelo terreno." },
  524: { velocidade: 9, felicidade: 1, resistencia: 2, acrobacia: 3, especial: "Libera rajadas de energia concentrada." },
  525: { velocidade: 1, felicidade: 6, resistencia: 5, acrobacia: 8, especial: "Libera rajadas de energia concentrada." },
  526: { velocidade: 8, felicidade: 6, resistencia: 10, acrobacia: 6, especial: "Libera rajadas de energia concentrada." },
  527: { velocidade: 9, felicidade: 4, resistencia: 9, acrobacia: 7, especial: "Aumenta a moral de aliados próximos." },
  528: { velocidade: 7, felicidade: 7, resistencia: 8, acrobacia: 2, especial: "Manipula energia elemental ao redor." },
  529: { velocidade: 6, felicidade: 9, resistencia: 6, acrobacia: 7, especial: "Controla o ambiente natural." },
  530: { velocidade: 10, felicidade: 6, resistencia: 5, acrobacia: 5, especial: "Recupera vigor durante batalhas longas." },
  531: { velocidade: 8, felicidade: 6, resistencia: 4, acrobacia: 6, especial: "Manipula energia elemental ao redor." },
  532: { velocidade: 9, felicidade: 8, resistencia: 5, acrobacia: 10, especial: "Aumenta a moral de aliados próximos." },
  533: { velocidade: 6, felicidade: 2, resistencia: 1, acrobacia: 10, especial: "Confunde o oponente com movimentos rápidos." },
  534: { velocidade: 1, felicidade: 1, resistencia: 4, acrobacia: 6, especial: "Move-se silenciosamente pelo terreno." },
  535: { velocidade: 10, felicidade: 7, resistencia: 2, acrobacia: 2, especial: "Libera rajadas de energia concentrada." },
  536: { velocidade: 4, felicidade: 6, resistencia: 5, acrobacia: 2, especial: "Controla o ambiente natural." },
  537: { velocidade: 6, felicidade: 10, resistencia: 10, acrobacia: 10, especial: "Manipula energia elemental ao redor." },
  538: { velocidade: 4, felicidade: 3, resistencia: 1, acrobacia: 6, especial: "Manipula energia elemental ao redor." },
  539: { velocidade: 5, felicidade: 9, resistencia: 5, acrobacia: 9, especial: "Cria uma aura protetora temporária." },
  540: { velocidade: 3, felicidade: 8, resistencia: 2, acrobacia: 10, especial: "Cria uma aura protetora temporária." },
  541: { velocidade: 7, felicidade: 2, resistencia: 2, acrobacia: 10, especial: "Controla o ambiente natural." },
  542: { velocidade: 5, felicidade: 2, resistencia: 3, acrobacia: 1, especial: "Recupera vigor durante batalhas longas." },
  543: { velocidade: 9, felicidade: 5, resistencia: 7, acrobacia: 7, especial: "Fortalece aliados com presença inspiradora." },
  544: { velocidade: 9, felicidade: 1, resistencia: 5, acrobacia: 5, especial: "Aumenta a moral de aliados próximos." },
  545: { velocidade: 8, felicidade: 1, resistencia: 2, acrobacia: 1, especial: "Detecta ameaças antes de todos." },
  546: { velocidade: 7, felicidade: 4, resistencia: 2, acrobacia: 10, especial: "Detecta ameaças antes de todos." },
  547: { velocidade: 2, felicidade: 5, resistencia: 3, acrobacia: 7, especial: "Move-se silenciosamente pelo terreno." },
  548: { velocidade: 10, felicidade: 7, resistencia: 4, acrobacia: 5, especial: "Controla o ambiente natural." },
  549: { velocidade: 8, felicidade: 5, resistencia: 10, acrobacia: 1, especial: "Aumenta a moral de aliados próximos." },
  550: { velocidade: 4, felicidade: 4, resistencia: 8, acrobacia: 1, especial: "Controla o ambiente natural." },
  551: { velocidade: 3, felicidade: 10, resistencia: 6, acrobacia: 3, especial: "Libera rajadas de energia concentrada." },
  552: { velocidade: 6, felicidade: 4, resistencia: 2, acrobacia: 2, especial: "Aumenta a moral de aliados próximos." },
  553: { velocidade: 4, felicidade: 4, resistencia: 7, acrobacia: 5, especial: "Aumenta a moral de aliados próximos." },
  554: { velocidade: 4, felicidade: 4, resistencia: 6, acrobacia: 9, especial: "Aumenta a moral de aliados próximos." },
  555: { velocidade: 10, felicidade: 10, resistencia: 4, acrobacia: 6, especial: "Manipula energia elemental ao redor." },
  556: { velocidade: 3, felicidade: 9, resistencia: 4, acrobacia: 4, especial: "Manipula energia elemental ao redor." },
  557: { velocidade: 8, felicidade: 4, resistencia: 9, acrobacia: 10, especial: "Detecta ameaças antes de todos." },
  558: { velocidade: 1, felicidade: 5, resistencia: 6, acrobacia: 4, especial: "Manipula energia elemental ao redor." },
  559: { velocidade: 3, felicidade: 8, resistencia: 8, acrobacia: 6, especial: "Aumenta a moral de aliados próximos." },
  560: { velocidade: 10, felicidade: 2, resistencia: 4, acrobacia: 4, especial: "Move-se silenciosamente pelo terreno." },
  561: { velocidade: 6, felicidade: 7, resistencia: 10, acrobacia: 9, especial: "Confunde o oponente com movimentos rápidos." },
  562: { velocidade: 3, felicidade: 7, resistencia: 7, acrobacia: 4, especial: "Detecta ameaças antes de todos." },
  563: { velocidade: 10, felicidade: 2, resistencia: 4, acrobacia: 1, especial: "Manipula energia elemental ao redor." },
  564: { velocidade: 7, felicidade: 3, resistencia: 1, acrobacia: 6, especial: "Libera rajadas de energia concentrada." },
  565: { velocidade: 3, felicidade: 9, resistencia: 3, acrobacia: 7, especial: "Fortalece aliados com presença inspiradora." },
  566: { velocidade: 8, felicidade: 10, resistencia: 10, acrobacia: 3, especial: "Fortalece aliados com presença inspiradora." },
  567: { velocidade: 10, felicidade: 7, resistencia: 5, acrobacia: 8, especial: "Manipula energia elemental ao redor." },
  568: { velocidade: 2, felicidade: 1, resistencia: 1, acrobacia: 5, especial: "Controla o ambiente natural." },
  569: { velocidade: 8, felicidade: 3, resistencia: 6, acrobacia: 4, especial: "Fortalece aliados com presença inspiradora." },
  570: { velocidade: 5, felicidade: 2, resistencia: 6, acrobacia: 2, especial: "Manipula energia elemental ao redor." },
  571: { velocidade: 7, felicidade: 4, resistencia: 7, acrobacia: 6, especial: "Confunde o oponente com movimentos rápidos." },
  572: { velocidade: 3, felicidade: 9, resistencia: 5, acrobacia: 8, especial: "Cria uma aura protetora temporária." },
  573: { velocidade: 8, felicidade: 2, resistencia: 7, acrobacia: 9, especial: "Confunde o oponente com movimentos rápidos." },
  574: { velocidade: 7, felicidade: 3, resistencia: 1, acrobacia: 1, especial: "Detecta ameaças antes de todos." },
  575: { velocidade: 4, felicidade: 1, resistencia: 1, acrobacia: 6, especial: "Detecta ameaças antes de todos." },
  576: { velocidade: 6, felicidade: 5, resistencia: 10, acrobacia: 7, especial: "Controla o ambiente natural." },
  577: { velocidade: 2, felicidade: 4, resistencia: 3, acrobacia: 3, especial: "Detecta ameaças antes de todos." },
  578: { velocidade: 5, felicidade: 5, resistencia: 6, acrobacia: 4, especial: "Detecta ameaças antes de todos." },
  579: { velocidade: 3, felicidade: 8, resistencia: 9, acrobacia: 7, especial: "Fortalece aliados com presença inspiradora." },
  580: { velocidade: 9, felicidade: 10, resistencia: 10, acrobacia: 1, especial: "Confunde o oponente com movimentos rápidos." },
  581: { velocidade: 6, felicidade: 8, resistencia: 4, acrobacia: 7, especial: "Libera rajadas de energia concentrada." },
  582: { velocidade: 6, felicidade: 10, resistencia: 8, acrobacia: 3, especial: "Detecta ameaças antes de todos." },
  583: { velocidade: 3, felicidade: 9, resistencia: 6, acrobacia: 4, especial: "Cria uma aura protetora temporária." },
  584: { velocidade: 3, felicidade: 5, resistencia: 6, acrobacia: 6, especial: "Aumenta a moral de aliados próximos." },
  585: { velocidade: 2, felicidade: 9, resistencia: 9, acrobacia: 1, especial: "Confunde o oponente com movimentos rápidos." },
  586: { velocidade: 3, felicidade: 4, resistencia: 3, acrobacia: 6, especial: "Move-se silenciosamente pelo terreno." },
  587: { velocidade: 9, felicidade: 5, resistencia: 4, acrobacia: 1, especial: "Aumenta a moral de aliados próximos." },
  588: { velocidade: 3, felicidade: 4, resistencia: 3, acrobacia: 4, especial: "Libera rajadas de energia concentrada." },
  589: { velocidade: 9, felicidade: 9, resistencia: 3, acrobacia: 10, especial: "Detecta ameaças antes de todos." },
  590: { velocidade: 9, felicidade: 9, resistencia: 10, acrobacia: 9, especial: "Manipula energia elemental ao redor." },
  591: { velocidade: 5, felicidade: 5, resistencia: 10, acrobacia: 8, especial: "Controla o ambiente natural." },
  592: { velocidade: 9, felicidade: 10, resistencia: 2, acrobacia: 2, especial: "Move-se silenciosamente pelo terreno." },
  593: { velocidade: 10, felicidade: 2, resistencia: 6, acrobacia: 5, especial: "Detecta ameaças antes de todos." },
  594: { velocidade: 8, felicidade: 10, resistencia: 5, acrobacia: 2, especial: "Cria uma aura protetora temporária." },
  595: { velocidade: 2, felicidade: 10, resistencia: 1, acrobacia: 8, especial: "Detecta ameaças antes de todos." },
  596: { velocidade: 9, felicidade: 10, resistencia: 1, acrobacia: 3, especial: "Controla o ambiente natural." },
  597: { velocidade: 5, felicidade: 6, resistencia: 6, acrobacia: 5, especial: "Libera rajadas de energia concentrada." },
  598: { velocidade: 1, felicidade: 6, resistencia: 4, acrobacia: 4, especial: "Controla o ambiente natural." },
  599: { velocidade: 8, felicidade: 6, resistencia: 4, acrobacia: 8, especial: "Cria uma aura protetora temporária." },
  600: { velocidade: 2, felicidade: 5, resistencia: 9, acrobacia: 4, especial: "Recupera vigor durante batalhas longas." },
  601: { velocidade: 7, felicidade: 8, resistencia: 2, acrobacia: 1, especial: "Fortalece aliados com presença inspiradora." },
  602: { velocidade: 9, felicidade: 4, resistencia: 6, acrobacia: 4, especial: "Recupera vigor durante batalhas longas." },
  603: { velocidade: 10, felicidade: 5, resistencia: 10, acrobacia: 4, especial: "Controla o ambiente natural." },
  604: { velocidade: 3, felicidade: 9, resistencia: 5, acrobacia: 7, especial: "Cria uma aura protetora temporária." },
  605: { velocidade: 4, felicidade: 10, resistencia: 7, acrobacia: 7, especial: "Manipula energia elemental ao redor." },
  606: { velocidade: 8, felicidade: 1, resistencia: 3, acrobacia: 6, especial: "Libera rajadas de energia concentrada." },
  607: { velocidade: 10, felicidade: 2, resistencia: 6, acrobacia: 2, especial: "Libera rajadas de energia concentrada." },
  608: { velocidade: 2, felicidade: 3, resistencia: 7, acrobacia: 8, especial: "Cria uma aura protetora temporária." },
  609: { velocidade: 9, felicidade: 5, resistencia: 7, acrobacia: 7, especial: "Libera rajadas de energia concentrada." },
  610: { velocidade: 7, felicidade: 9, resistencia: 6, acrobacia: 1, especial: "Confunde o oponente com movimentos rápidos." },
  611: { velocidade: 4, felicidade: 10, resistencia: 6, acrobacia: 10, especial: "Confunde o oponente com movimentos rápidos." },
  612: { velocidade: 2, felicidade: 10, resistencia: 2, acrobacia: 9, especial: "Detecta ameaças antes de todos." },
  613: { velocidade: 2, felicidade: 2, resistencia: 5, acrobacia: 5, especial: "Manipula energia elemental ao redor." },
  614: { velocidade: 4, felicidade: 8, resistencia: 2, acrobacia: 4, especial: "Manipula energia elemental ao redor." },
  615: { velocidade: 10, felicidade: 4, resistencia: 3, acrobacia: 7, especial: "Libera rajadas de energia concentrada." },
  616: { velocidade: 6, felicidade: 8, resistencia: 1, acrobacia: 4, especial: "Move-se silenciosamente pelo terreno." },
  617: { velocidade: 3, felicidade: 10, resistencia: 4, acrobacia: 9, especial: "Fortalece aliados com presença inspiradora." },
  618: { velocidade: 5, felicidade: 7, resistencia: 9, acrobacia: 7, especial: "Aumenta a moral de aliados próximos." },
  619: { velocidade: 9, felicidade: 9, resistencia: 3, acrobacia: 6, especial: "Manipula energia elemental ao redor." },
  620: { velocidade: 2, felicidade: 5, resistencia: 5, acrobacia: 10, especial: "Aumenta a moral de aliados próximos." },
  621: { velocidade: 4, felicidade: 3, resistencia: 10, acrobacia: 10, especial: "Cria uma aura protetora temporária." },
  622: { velocidade: 7, felicidade: 4, resistencia: 9, acrobacia: 10, especial: "Libera rajadas de energia concentrada." },
  623: { velocidade: 9, felicidade: 10, resistencia: 1, acrobacia: 9, especial: "Recupera vigor durante batalhas longas." },
  624: { velocidade: 9, felicidade: 9, resistencia: 1, acrobacia: 6, especial: "Recupera vigor durante batalhas longas." },
  625: { velocidade: 7, felicidade: 2, resistencia: 1, acrobacia: 3, especial: "Controla o ambiente natural." },
  626: { velocidade: 1, felicidade: 7, resistencia: 7, acrobacia: 8, especial: "Confunde o oponente com movimentos rápidos." },
  627: { velocidade: 10, felicidade: 2, resistencia: 3, acrobacia: 9, especial: "Cria uma aura protetora temporária." },
  628: { velocidade: 9, felicidade: 7, resistencia: 5, acrobacia: 9, especial: "Libera rajadas de energia concentrada." },
  629: { velocidade: 3, felicidade: 3, resistencia: 5, acrobacia: 2, especial: "Detecta ameaças antes de todos." },
  630: { velocidade: 1, felicidade: 8, resistencia: 1, acrobacia: 8, especial: "Confunde o oponente com movimentos rápidos." },
  631: { velocidade: 4, felicidade: 5, resistencia: 5, acrobacia: 10, especial: "Cria uma aura protetora temporária." },
  632: { velocidade: 6, felicidade: 5, resistencia: 8, acrobacia: 1, especial: "Manipula energia elemental ao redor." },
  633: { velocidade: 4, felicidade: 10, resistencia: 2, acrobacia: 4, especial: "Manipula energia elemental ao redor." },
  634: { velocidade: 10, felicidade: 1, resistencia: 3, acrobacia: 8, especial: "Fortalece aliados com presença inspiradora." },
  635: { velocidade: 3, felicidade: 7, resistencia: 5, acrobacia: 4, especial: "Move-se silenciosamente pelo terreno." },
  636: { velocidade: 9, felicidade: 8, resistencia: 4, acrobacia: 10, especial: "Fortalece aliados com presença inspiradora." },
  637: { velocidade: 4, felicidade: 8, resistencia: 8, acrobacia: 3, especial: "Detecta ameaças antes de todos." },
  638: { velocidade: 10, felicidade: 4, resistencia: 7, acrobacia: 5, especial: "Recupera vigor durante batalhas longas." },
  639: { velocidade: 1, felicidade: 9, resistencia: 9, acrobacia: 10, especial: "Move-se silenciosamente pelo terreno." },
  640: { velocidade: 3, felicidade: 2, resistencia: 10, acrobacia: 1, especial: "Libera rajadas de energia concentrada." },
  641: { velocidade: 6, felicidade: 6, resistencia: 3, acrobacia: 10, especial: "Controla o ambiente natural." },
  642: { velocidade: 2, felicidade: 8, resistencia: 6, acrobacia: 10, especial: "Confunde o oponente com movimentos rápidos." },
  643: { velocidade: 8, felicidade: 5, resistencia: 7, acrobacia: 7, especial: "Move-se silenciosamente pelo terreno." },
  644: { velocidade: 9, felicidade: 6, resistencia: 7, acrobacia: 4, especial: "Detecta ameaças antes de todos." },
  645: { velocidade: 10, felicidade: 5, resistencia: 1, acrobacia: 4, especial: "Fortalece aliados com presença inspiradora." },
  646: { velocidade: 2, felicidade: 10, resistencia: 6, acrobacia: 7, especial: "Confunde o oponente com movimentos rápidos." },
  647: { velocidade: 6, felicidade: 4, resistencia: 10, acrobacia: 8, especial: "Recupera vigor durante batalhas longas." },
  648: { velocidade: 5, felicidade: 7, resistencia: 2, acrobacia: 3, especial: "Manipula energia elemental ao redor." },
  649: { velocidade: 9, felicidade: 1, resistencia: 3, acrobacia: 5, especial: "Aumenta a moral de aliados próximos." },
  650: { velocidade: 1, felicidade: 4, resistencia: 10, acrobacia: 4, especial: "Detecta ameaças antes de todos." },
  651: { velocidade: 6, felicidade: 10, resistencia: 6, acrobacia: 2, especial: "Recupera vigor durante batalhas longas." },
  652: { velocidade: 5, felicidade: 3, resistencia: 8, acrobacia: 3, especial: "Recupera vigor durante batalhas longas." },
  653: { velocidade: 4, felicidade: 6, resistencia: 7, acrobacia: 1, especial: "Manipula energia elemental ao redor." },
  654: { velocidade: 8, felicidade: 8, resistencia: 7, acrobacia: 8, especial: "Move-se silenciosamente pelo terreno." },
  655: { velocidade: 1, felicidade: 8, resistencia: 8, acrobacia: 3, especial: "Confunde o oponente com movimentos rápidos." },
  656: { velocidade: 6, felicidade: 5, resistencia: 1, acrobacia: 2, especial: "Manipula energia elemental ao redor." },
  657: { velocidade: 1, felicidade: 6, resistencia: 6, acrobacia: 10, especial: "Cria uma aura protetora temporária." },
  658: { velocidade: 3, felicidade: 4, resistencia: 8, acrobacia: 1, especial: "Controla o ambiente natural." },
  659: { velocidade: 7, felicidade: 5, resistencia: 7, acrobacia: 4, especial: "Cria uma aura protetora temporária." },
  660: { velocidade: 1, felicidade: 7, resistencia: 6, acrobacia: 1, especial: "Libera rajadas de energia concentrada." },
  661: { velocidade: 2, felicidade: 10, resistencia: 9, acrobacia: 6, especial: "Controla o ambiente natural." },
  662: { velocidade: 6, felicidade: 1, resistencia: 10, acrobacia: 2, especial: "Fortalece aliados com presença inspiradora." },
  663: { velocidade: 5, felicidade: 9, resistencia: 7, acrobacia: 10, especial: "Cria uma aura protetora temporária." },
  664: { velocidade: 7, felicidade: 1, resistencia: 4, acrobacia: 1, especial: "Controla o ambiente natural." },
  665: { velocidade: 6, felicidade: 3, resistencia: 1, acrobacia: 10, especial: "Cria uma aura protetora temporária." },
  666: { velocidade: 9, felicidade: 8, resistencia: 2, acrobacia: 1, especial: "Controla o ambiente natural." },
  667: { velocidade: 10, felicidade: 10, resistencia: 10, acrobacia: 8, especial: "Manipula energia elemental ao redor." },
  668: { velocidade: 1, felicidade: 5, resistencia: 10, acrobacia: 9, especial: "Cria uma aura protetora temporária." },
  669: { velocidade: 1, felicidade: 8, resistencia: 7, acrobacia: 4, especial: "Libera rajadas de energia concentrada." },
  670: { velocidade: 6, felicidade: 6, resistencia: 5, acrobacia: 7, especial: "Controla o ambiente natural." },
  671: { velocidade: 4, felicidade: 10, resistencia: 9, acrobacia: 7, especial: "Manipula energia elemental ao redor." },
  672: { velocidade: 1, felicidade: 4, resistencia: 2, acrobacia: 7, especial: "Manipula energia elemental ao redor." },
  673: { velocidade: 7, felicidade: 2, resistencia: 1, acrobacia: 5, especial: "Cria uma aura protetora temporária." },
  674: { velocidade: 2, felicidade: 7, resistencia: 10, acrobacia: 1, especial: "Move-se silenciosamente pelo terreno." },
  675: { velocidade: 10, felicidade: 9, resistencia: 1, acrobacia: 6, especial: "Confunde o oponente com movimentos rápidos." },
  676: { velocidade: 5, felicidade: 9, resistencia: 8, acrobacia: 2, especial: "Manipula energia elemental ao redor." },
  677: { velocidade: 6, felicidade: 9, resistencia: 6, acrobacia: 7, especial: "Aumenta a moral de aliados próximos." },
  678: { velocidade: 10, felicidade: 1, resistencia: 3, acrobacia: 1, especial: "Confunde o oponente com movimentos rápidos." },
  679: { velocidade: 4, felicidade: 1, resistencia: 9, acrobacia: 4, especial: "Fortalece aliados com presença inspiradora." },
  680: { velocidade: 4, felicidade: 7, resistencia: 8, acrobacia: 10, especial: "Move-se silenciosamente pelo terreno." },
  681: { velocidade: 2, felicidade: 6, resistencia: 5, acrobacia: 5, especial: "Recupera vigor durante batalhas longas." },
  682: { velocidade: 4, felicidade: 2, resistencia: 4, acrobacia: 10, especial: "Recupera vigor durante batalhas longas." },
  683: { velocidade: 4, felicidade: 6, resistencia: 1, acrobacia: 4, especial: "Detecta ameaças antes de todos." },
  684: { velocidade: 7, felicidade: 5, resistencia: 8, acrobacia: 10, especial: "Recupera vigor durante batalhas longas." },
  685: { velocidade: 5, felicidade: 8, resistencia: 3, acrobacia: 6, especial: "Aumenta a moral de aliados próximos." },
  686: { velocidade: 10, felicidade: 6, resistencia: 5, acrobacia: 3, especial: "Aumenta a moral de aliados próximos." },
  687: { velocidade: 6, felicidade: 9, resistencia: 8, acrobacia: 4, especial: "Recupera vigor durante batalhas longas." },
  688: { velocidade: 8, felicidade: 2, resistencia: 7, acrobacia: 4, especial: "Controla o ambiente natural." },
  689: { velocidade: 4, felicidade: 1, resistencia: 2, acrobacia: 4, especial: "Detecta ameaças antes de todos." },
  690: { velocidade: 5, felicidade: 5, resistencia: 4, acrobacia: 1, especial: "Aumenta a moral de aliados próximos." },
  691: { velocidade: 6, felicidade: 9, resistencia: 2, acrobacia: 7, especial: "Recupera vigor durante batalhas longas." },
  692: { velocidade: 9, felicidade: 7, resistencia: 1, acrobacia: 6, especial: "Cria uma aura protetora temporária." },
  693: { velocidade: 4, felicidade: 9, resistencia: 1, acrobacia: 7, especial: "Cria uma aura protetora temporária." },
  694: { velocidade: 10, felicidade: 10, resistencia: 3, acrobacia: 6, especial: "Confunde o oponente com movimentos rápidos." },
  695: { velocidade: 5, felicidade: 10, resistencia: 9, acrobacia: 5, especial: "Controla o ambiente natural." },
  696: { velocidade: 3, felicidade: 8, resistencia: 8, acrobacia: 7, especial: "Aumenta a moral de aliados próximos." },
  697: { velocidade: 9, felicidade: 3, resistencia: 7, acrobacia: 1, especial: "Confunde o oponente com movimentos rápidos." },
  698: { velocidade: 9, felicidade: 1, resistencia: 7, acrobacia: 8, especial: "Fortalece aliados com presença inspiradora." },
  699: { velocidade: 9, felicidade: 1, resistencia: 5, acrobacia: 3, especial: "Aumenta a moral de aliados próximos." },
  700: { velocidade: 6, felicidade: 7, resistencia: 3, acrobacia: 10, especial: "Cria uma aura protetora temporária." },
  701: { velocidade: 8, felicidade: 9, resistencia: 3, acrobacia: 5, especial: "Controla o ambiente natural." },
  702: { velocidade: 7, felicidade: 1, resistencia: 4, acrobacia: 3, especial: "Recupera vigor durante batalhas longas." },
  703: { velocidade: 9, felicidade: 4, resistencia: 9, acrobacia: 8, especial: "Cria uma aura protetora temporária." },
  704: { velocidade: 5, felicidade: 4, resistencia: 6, acrobacia: 4, especial: "Controla o ambiente natural." },
  705: { velocidade: 9, felicidade: 6, resistencia: 8, acrobacia: 9, especial: "Aumenta a moral de aliados próximos." },
  706: { velocidade: 7, felicidade: 1, resistencia: 10, acrobacia: 9, especial: "Controla o ambiente natural." },
  707: { velocidade: 6, felicidade: 8, resistencia: 10, acrobacia: 9, especial: "Detecta ameaças antes de todos." },
  708: { velocidade: 6, felicidade: 3, resistencia: 5, acrobacia: 9, especial: "Cria uma aura protetora temporária." },
  709: { velocidade: 4, felicidade: 4, resistencia: 8, acrobacia: 4, especial: "Detecta ameaças antes de todos." },
  710: { velocidade: 5, felicidade: 8, resistencia: 6, acrobacia: 7, especial: "Libera rajadas de energia concentrada." },
  711: { velocidade: 1, felicidade: 1, resistencia: 8, acrobacia: 10, especial: "Manipula energia elemental ao redor." },
  712: { velocidade: 3, felicidade: 4, resistencia: 8, acrobacia: 7, especial: "Move-se silenciosamente pelo terreno." },
  713: { velocidade: 3, felicidade: 1, resistencia: 9, acrobacia: 3, especial: "Move-se silenciosamente pelo terreno." },
  714: { velocidade: 9, felicidade: 10, resistencia: 5, acrobacia: 3, especial: "Manipula energia elemental ao redor." },
  715: { velocidade: 3, felicidade: 4, resistencia: 7, acrobacia: 6, especial: "Recupera vigor durante batalhas longas." },
  716: { velocidade: 1, felicidade: 8, resistencia: 5, acrobacia: 3, especial: "Cria uma aura protetora temporária." },
  717: { velocidade: 4, felicidade: 10, resistencia: 1, acrobacia: 5, especial: "Move-se silenciosamente pelo terreno." },
  718: { velocidade: 7, felicidade: 9, resistencia: 2, acrobacia: 7, especial: "Cria uma aura protetora temporária." },
  719: { velocidade: 2, felicidade: 5, resistencia: 10, acrobacia: 7, especial: "Manipula energia elemental ao redor." },
  720: { velocidade: 4, felicidade: 2, resistencia: 4, acrobacia: 2, especial: "Fortalece aliados com presença inspiradora." },
  721: { velocidade: 2, felicidade: 7, resistencia: 3, acrobacia: 10, especial: "Manipula energia elemental ao redor." },
  722: { velocidade: 8, felicidade: 5, resistencia: 9, acrobacia: 3, especial: "Cria uma aura protetora temporária." },
  723: { velocidade: 5, felicidade: 8, resistencia: 7, acrobacia: 6, especial: "Cria uma aura protetora temporária." },
  724: { velocidade: 9, felicidade: 10, resistencia: 7, acrobacia: 4, especial: "Controla o ambiente natural." },
  725: { velocidade: 7, felicidade: 9, resistencia: 4, acrobacia: 7, especial: "Aumenta a moral de aliados próximos." },
  726: { velocidade: 4, felicidade: 5, resistencia: 2, acrobacia: 5, especial: "Confunde o oponente com movimentos rápidos." },
  727: { velocidade: 6, felicidade: 1, resistencia: 2, acrobacia: 10, especial: "Confunde o oponente com movimentos rápidos." },
  728: { velocidade: 8, felicidade: 10, resistencia: 4, acrobacia: 9, especial: "Cria uma aura protetora temporária." },
  729: { velocidade: 4, felicidade: 5, resistencia: 4, acrobacia: 2, especial: "Libera rajadas de energia concentrada." },
  730: { velocidade: 9, felicidade: 10, resistencia: 8, acrobacia: 1, especial: "Libera rajadas de energia concentrada." },
  731: { velocidade: 10, felicidade: 6, resistencia: 7, acrobacia: 3, especial: "Cria uma aura protetora temporária." },
  732: { velocidade: 10, felicidade: 1, resistencia: 9, acrobacia: 1, especial: "Manipula energia elemental ao redor." },
  733: { velocidade: 7, felicidade: 4, resistencia: 3, acrobacia: 4, especial: "Controla o ambiente natural." },
  734: { velocidade: 9, felicidade: 8, resistencia: 9, acrobacia: 8, especial: "Libera rajadas de energia concentrada." },
  735: { velocidade: 7, felicidade: 4, resistencia: 9, acrobacia: 5, especial: "Detecta ameaças antes de todos." },
  736: { velocidade: 10, felicidade: 8, resistencia: 10, acrobacia: 8, especial: "Confunde o oponente com movimentos rápidos." },
  737: { velocidade: 4, felicidade: 9, resistencia: 6, acrobacia: 10, especial: "Libera rajadas de energia concentrada." },
  738: { velocidade: 1, felicidade: 9, resistencia: 2, acrobacia: 3, especial: "Recupera vigor durante batalhas longas." },
  739: { velocidade: 1, felicidade: 3, resistencia: 2, acrobacia: 10, especial: "Move-se silenciosamente pelo terreno." },
  740: { velocidade: 4, felicidade: 7, resistencia: 10, acrobacia: 4, especial: "Detecta ameaças antes de todos." },
  741: { velocidade: 1, felicidade: 1, resistencia: 3, acrobacia: 4, especial: "Libera rajadas de energia concentrada." },
  742: { velocidade: 5, felicidade: 4, resistencia: 7, acrobacia: 9, especial: "Manipula energia elemental ao redor." },
  743: { velocidade: 10, felicidade: 9, resistencia: 6, acrobacia: 3, especial: "Confunde o oponente com movimentos rápidos." },
  744: { velocidade: 7, felicidade: 5, resistencia: 5, acrobacia: 1, especial: "Libera rajadas de energia concentrada." },
  745: { velocidade: 8, felicidade: 8, resistencia: 4, acrobacia: 8, especial: "Manipula energia elemental ao redor." },
  746: { velocidade: 7, felicidade: 2, resistencia: 7, acrobacia: 10, especial: "Confunde o oponente com movimentos rápidos." },
  747: { velocidade: 5, felicidade: 3, resistencia: 6, acrobacia: 9, especial: "Detecta ameaças antes de todos." },
  748: { velocidade: 8, felicidade: 9, resistencia: 9, acrobacia: 9, especial: "Aumenta a moral de aliados próximos." },
  749: { velocidade: 2, felicidade: 10, resistencia: 8, acrobacia: 9, especial: "Detecta ameaças antes de todos." },
  750: { velocidade: 3, felicidade: 2, resistencia: 2, acrobacia: 2, especial: "Controla o ambiente natural." },
  751: { velocidade: 10, felicidade: 7, resistencia: 6, acrobacia: 9, especial: "Move-se silenciosamente pelo terreno." },
  752: { velocidade: 8, felicidade: 8, resistencia: 6, acrobacia: 2, especial: "Cria uma aura protetora temporária." },
  753: { velocidade: 8, felicidade: 7, resistencia: 10, acrobacia: 7, especial: "Manipula energia elemental ao redor." },
  754: { velocidade: 3, felicidade: 2, resistencia: 7, acrobacia: 1, especial: "Move-se silenciosamente pelo terreno." },
  755: { velocidade: 10, felicidade: 10, resistencia: 1, acrobacia: 1, especial: "Aumenta a moral de aliados próximos." },
  756: { velocidade: 8, felicidade: 2, resistencia: 7, acrobacia: 6, especial: "Detecta ameaças antes de todos." },
  757: { velocidade: 10, felicidade: 3, resistencia: 3, acrobacia: 6, especial: "Confunde o oponente com movimentos rápidos." },
  758: { velocidade: 4, felicidade: 2, resistencia: 4, acrobacia: 5, especial: "Cria uma aura protetora temporária." },
  759: { velocidade: 9, felicidade: 4, resistencia: 1, acrobacia: 9, especial: "Move-se silenciosamente pelo terreno." },
  760: { velocidade: 10, felicidade: 7, resistencia: 3, acrobacia: 9, especial: "Controla o ambiente natural." },
  761: { velocidade: 1, felicidade: 9, resistencia: 4, acrobacia: 7, especial: "Controla o ambiente natural." },
  762: { velocidade: 1, felicidade: 5, resistencia: 6, acrobacia: 10, especial: "Cria uma aura protetora temporária." },
  763: { velocidade: 7, felicidade: 9, resistencia: 8, acrobacia: 6, especial: "Aumenta a moral de aliados próximos." },
  764: { velocidade: 2, felicidade: 3, resistencia: 5, acrobacia: 2, especial: "Confunde o oponente com movimentos rápidos." },
  765: { velocidade: 3, felicidade: 8, resistencia: 6, acrobacia: 5, especial: "Recupera vigor durante batalhas longas." },
  766: { velocidade: 3, felicidade: 9, resistencia: 2, acrobacia: 3, especial: "Move-se silenciosamente pelo terreno." },
  767: { velocidade: 10, felicidade: 2, resistencia: 4, acrobacia: 3, especial: "Confunde o oponente com movimentos rápidos." },
  768: { velocidade: 4, felicidade: 2, resistencia: 5, acrobacia: 5, especial: "Libera rajadas de energia concentrada." },
  769: { velocidade: 5, felicidade: 9, resistencia: 5, acrobacia: 8, especial: "Move-se silenciosamente pelo terreno." },
  770: { velocidade: 8, felicidade: 5, resistencia: 9, acrobacia: 7, especial: "Cria uma aura protetora temporária." },
  771: { velocidade: 5, felicidade: 4, resistencia: 10, acrobacia: 1, especial: "Detecta ameaças antes de todos." },
  772: { velocidade: 1, felicidade: 10, resistencia: 3, acrobacia: 7, especial: "Recupera vigor durante batalhas longas." },
  773: { velocidade: 8, felicidade: 9, resistencia: 3, acrobacia: 3, especial: "Manipula energia elemental ao redor." },
  774: { velocidade: 9, felicidade: 7, resistencia: 7, acrobacia: 4, especial: "Aumenta a moral de aliados próximos." },
  775: { velocidade: 10, felicidade: 10, resistencia: 8, acrobacia: 7, especial: "Libera rajadas de energia concentrada." },
  776: { velocidade: 10, felicidade: 2, resistencia: 4, acrobacia: 4, especial: "Cria uma aura protetora temporária." },
  777: { velocidade: 3, felicidade: 3, resistencia: 3, acrobacia: 6, especial: "Cria uma aura protetora temporária." },
  778: { velocidade: 1, felicidade: 6, resistencia: 10, acrobacia: 1, especial: "Detecta ameaças antes de todos." },
  779: { velocidade: 4, felicidade: 3, resistencia: 4, acrobacia: 9, especial: "Recupera vigor durante batalhas longas." },
  780: { velocidade: 6, felicidade: 6, resistencia: 6, acrobacia: 4, especial: "Controla o ambiente natural." },
  781: { velocidade: 7, felicidade: 3, resistencia: 1, acrobacia: 7, especial: "Confunde o oponente com movimentos rápidos." },
  782: { velocidade: 4, felicidade: 6, resistencia: 9, acrobacia: 4, especial: "Libera rajadas de energia concentrada." },
  783: { velocidade: 2, felicidade: 5, resistencia: 6, acrobacia: 6, especial: "Libera rajadas de energia concentrada." },
  784: { velocidade: 7, felicidade: 6, resistencia: 5, acrobacia: 8, especial: "Aumenta a moral de aliados próximos." },
  785: { velocidade: 8, felicidade: 8, resistencia: 6, acrobacia: 10, especial: "Libera rajadas de energia concentrada." },
  786: { velocidade: 2, felicidade: 7, resistencia: 9, acrobacia: 4, especial: "Detecta ameaças antes de todos." },
  787: { velocidade: 6, felicidade: 10, resistencia: 6, acrobacia: 4, especial: "Manipula energia elemental ao redor." },
  788: { velocidade: 4, felicidade: 5, resistencia: 8, acrobacia: 6, especial: "Manipula energia elemental ao redor." },
  789: { velocidade: 5, felicidade: 10, resistencia: 4, acrobacia: 2, especial: "Cria uma aura protetora temporária." },
  790: { velocidade: 4, felicidade: 5, resistencia: 5, acrobacia: 10, especial: "Libera rajadas de energia concentrada." },
  791: { velocidade: 4, felicidade: 4, resistencia: 7, acrobacia: 4, especial: "Controla o ambiente natural." },
  792: { velocidade: 9, felicidade: 4, resistencia: 9, acrobacia: 9, especial: "Confunde o oponente com movimentos rápidos." },
  793: { velocidade: 2, felicidade: 7, resistencia: 1, acrobacia: 7, especial: "Libera rajadas de energia concentrada." },
  794: { velocidade: 9, felicidade: 1, resistencia: 4, acrobacia: 9, especial: "Libera rajadas de energia concentrada." },
  795: { velocidade: 6, felicidade: 6, resistencia: 10, acrobacia: 1, especial: "Detecta ameaças antes de todos." },
  796: { velocidade: 3, felicidade: 7, resistencia: 9, acrobacia: 1, especial: "Libera rajadas de energia concentrada." },
  797: { velocidade: 8, felicidade: 4, resistencia: 7, acrobacia: 7, especial: "Libera rajadas de energia concentrada." },
  798: { velocidade: 1, felicidade: 9, resistencia: 5, acrobacia: 2, especial: "Aumenta a moral de aliados próximos." },
  799: { velocidade: 6, felicidade: 8, resistencia: 4, acrobacia: 8, especial: "Confunde o oponente com movimentos rápidos." },
  800: { velocidade: 5, felicidade: 8, resistencia: 8, acrobacia: 1, especial: "Aumenta a moral de aliados próximos." },
  801: { velocidade: 9, felicidade: 10, resistencia: 10, acrobacia: 3, especial: "Controla o ambiente natural." },
  802: { velocidade: 5, felicidade: 2, resistencia: 3, acrobacia: 8, especial: "Recupera vigor durante batalhas longas." },
  803: { velocidade: 10, felicidade: 8, resistencia: 4, acrobacia: 10, especial: "Aumenta a moral de aliados próximos." },
  804: { velocidade: 2, felicidade: 3, resistencia: 10, acrobacia: 3, especial: "Fortalece aliados com presença inspiradora." },
  805: { velocidade: 7, felicidade: 7, resistencia: 8, acrobacia: 5, especial: "Fortalece aliados com presença inspiradora." },
  806: { velocidade: 10, felicidade: 1, resistencia: 3, acrobacia: 3, especial: "Libera rajadas de energia concentrada." },
  807: { velocidade: 10, felicidade: 4, resistencia: 3, acrobacia: 8, especial: "Controla o ambiente natural." },
  808: { velocidade: 2, felicidade: 10, resistencia: 5, acrobacia: 9, especial: "Libera rajadas de energia concentrada." },
  809: { velocidade: 6, felicidade: 1, resistencia: 8, acrobacia: 6, especial: "Recupera vigor durante batalhas longas." },
  810: { velocidade: 9, felicidade: 9, resistencia: 2, acrobacia: 7, especial: "Cria uma aura protetora temporária." },
  811: { velocidade: 7, felicidade: 5, resistencia: 6, acrobacia: 7, especial: "Manipula energia elemental ao redor." },
  812: { velocidade: 9, felicidade: 7, resistencia: 1, acrobacia: 8, especial: "Manipula energia elemental ao redor." },
  813: { velocidade: 8, felicidade: 8, resistencia: 9, acrobacia: 1, especial: "Confunde o oponente com movimentos rápidos." },
  814: { velocidade: 4, felicidade: 5, resistencia: 5, acrobacia: 9, especial: "Detecta ameaças antes de todos." },
  815: { velocidade: 9, felicidade: 7, resistencia: 4, acrobacia: 5, especial: "Fortalece aliados com presença inspiradora." },
  816: { velocidade: 3, felicidade: 1, resistencia: 2, acrobacia: 9, especial: "Confunde o oponente com movimentos rápidos." },
  817: { velocidade: 2, felicidade: 5, resistencia: 7, acrobacia: 5, especial: "Detecta ameaças antes de todos." },
  818: { velocidade: 3, felicidade: 6, resistencia: 2, acrobacia: 5, especial: "Detecta ameaças antes de todos." },
  819: { velocidade: 6, felicidade: 6, resistencia: 3, acrobacia: 1, especial: "Fortalece aliados com presença inspiradora." },
  820: { velocidade: 5, felicidade: 3, resistencia: 2, acrobacia: 9, especial: "Move-se silenciosamente pelo terreno." },
  821: { velocidade: 6, felicidade: 8, resistencia: 6, acrobacia: 10, especial: "Detecta ameaças antes de todos." },
  822: { velocidade: 7, felicidade: 4, resistencia: 9, acrobacia: 3, especial: "Cria uma aura protetora temporária." },
  823: { velocidade: 3, felicidade: 6, resistencia: 7, acrobacia: 3, especial: "Controla o ambiente natural." },
  824: { velocidade: 3, felicidade: 3, resistencia: 8, acrobacia: 4, especial: "Aumenta a moral de aliados próximos." },
  825: { velocidade: 9, felicidade: 10, resistencia: 10, acrobacia: 2, especial: "Confunde o oponente com movimentos rápidos." },
  826: { velocidade: 6, felicidade: 7, resistencia: 10, acrobacia: 9, especial: "Move-se silenciosamente pelo terreno." },
  827: { velocidade: 10, felicidade: 1, resistencia: 8, acrobacia: 10, especial: "Confunde o oponente com movimentos rápidos." },
  828: { velocidade: 10, felicidade: 2, resistencia: 1, acrobacia: 8, especial: "Libera rajadas de energia concentrada." },
  829: { velocidade: 3, felicidade: 9, resistencia: 5, acrobacia: 4, especial: "Recupera vigor durante batalhas longas." },
  830: { velocidade: 8, felicidade: 1, resistencia: 7, acrobacia: 8, especial: "Recupera vigor durante batalhas longas." },
  831: { velocidade: 3, felicidade: 3, resistencia: 7, acrobacia: 3, especial: "Cria uma aura protetora temporária." },
  832: { velocidade: 10, felicidade: 5, resistencia: 4, acrobacia: 2, especial: "Cria uma aura protetora temporária." },
  833: { velocidade: 5, felicidade: 10, resistencia: 3, acrobacia: 10, especial: "Detecta ameaças antes de todos." },
  834: { velocidade: 1, felicidade: 9, resistencia: 9, acrobacia: 7, especial: "Controla o ambiente natural." },
  835: { velocidade: 4, felicidade: 4, resistencia: 1, acrobacia: 7, especial: "Controla o ambiente natural." },
  836: { velocidade: 10, felicidade: 8, resistencia: 6, acrobacia: 3, especial: "Confunde o oponente com movimentos rápidos." },
  837: { velocidade: 6, felicidade: 3, resistencia: 2, acrobacia: 6, especial: "Manipula energia elemental ao redor." },
  838: { velocidade: 9, felicidade: 5, resistencia: 6, acrobacia: 8, especial: "Cria uma aura protetora temporária." },
  839: { velocidade: 7, felicidade: 7, resistencia: 2, acrobacia: 7, especial: "Confunde o oponente com movimentos rápidos." },
  840: { velocidade: 2, felicidade: 9, resistencia: 4, acrobacia: 6, especial: "Manipula energia elemental ao redor." },
  841: { velocidade: 10, felicidade: 6, resistencia: 10, acrobacia: 9, especial: "Cria uma aura protetora temporária." },
  842: { velocidade: 4, felicidade: 8, resistencia: 9, acrobacia: 3, especial: "Controla o ambiente natural." },
  843: { velocidade: 2, felicidade: 6, resistencia: 5, acrobacia: 10, especial: "Aumenta a moral de aliados próximos." },
  844: { velocidade: 3, felicidade: 9, resistencia: 7, acrobacia: 7, especial: "Detecta ameaças antes de todos." },
  845: { velocidade: 4, felicidade: 9, resistencia: 10, acrobacia: 5, especial: "Aumenta a moral de aliados próximos." },
  846: { velocidade: 3, felicidade: 5, resistencia: 2, acrobacia: 5, especial: "Confunde o oponente com movimentos rápidos." },
  847: { velocidade: 5, felicidade: 5, resistencia: 9, acrobacia: 6, especial: "Fortalece aliados com presença inspiradora." },
  848: { velocidade: 8, felicidade: 8, resistencia: 3, acrobacia: 5, especial: "Detecta ameaças antes de todos." },
  849: { velocidade: 8, felicidade: 7, resistencia: 1, acrobacia: 3, especial: "Recupera vigor durante batalhas longas." },
  850: { velocidade: 3, felicidade: 9, resistencia: 2, acrobacia: 10, especial: "Move-se silenciosamente pelo terreno." },
  851: { velocidade: 1, felicidade: 3, resistencia: 7, acrobacia: 10, especial: "Aumenta a moral de aliados próximos." },
  852: { velocidade: 4, felicidade: 5, resistencia: 8, acrobacia: 1, especial: "Fortalece aliados com presença inspiradora." },
  853: { velocidade: 7, felicidade: 8, resistencia: 1, acrobacia: 4, especial: "Detecta ameaças antes de todos." },
  854: { velocidade: 7, felicidade: 4, resistencia: 10, acrobacia: 1, especial: "Move-se silenciosamente pelo terreno." },
  855: { velocidade: 6, felicidade: 8, resistencia: 8, acrobacia: 9, especial: "Recupera vigor durante batalhas longas." },
  856: { velocidade: 2, felicidade: 10, resistencia: 9, acrobacia: 10, especial: "Aumenta a moral de aliados próximos." },
  857: { velocidade: 4, felicidade: 9, resistencia: 6, acrobacia: 10, especial: "Libera rajadas de energia concentrada." },
  858: { velocidade: 9, felicidade: 1, resistencia: 8, acrobacia: 1, especial: "Cria uma aura protetora temporária." },
  859: { velocidade: 7, felicidade: 2, resistencia: 8, acrobacia: 9, especial: "Confunde o oponente com movimentos rápidos." },
  860: { velocidade: 9, felicidade: 5, resistencia: 7, acrobacia: 10, especial: "Confunde o oponente com movimentos rápidos." },
  861: { velocidade: 4, felicidade: 3, resistencia: 3, acrobacia: 6, especial: "Manipula energia elemental ao redor." },
  862: { velocidade: 6, felicidade: 6, resistencia: 9, acrobacia: 1, especial: "Confunde o oponente com movimentos rápidos." },
  863: { velocidade: 6, felicidade: 3, resistencia: 2, acrobacia: 8, especial: "Confunde o oponente com movimentos rápidos." },
  864: { velocidade: 5, felicidade: 7, resistencia: 4, acrobacia: 9, especial: "Recupera vigor durante batalhas longas." },
  865: { velocidade: 3, felicidade: 2, resistencia: 3, acrobacia: 3, especial: "Libera rajadas de energia concentrada." },
  866: { velocidade: 9, felicidade: 8, resistencia: 9, acrobacia: 2, especial: "Confunde o oponente com movimentos rápidos." },
  867: { velocidade: 8, felicidade: 7, resistencia: 8, acrobacia: 2, especial: "Aumenta a moral de aliados próximos." },
  868: { velocidade: 8, felicidade: 9, resistencia: 4, acrobacia: 2, especial: "Recupera vigor durante batalhas longas." },
  869: { velocidade: 3, felicidade: 10, resistencia: 9, acrobacia: 7, especial: "Controla o ambiente natural." },
  870: { velocidade: 1, felicidade: 7, resistencia: 1, acrobacia: 3, especial: "Fortalece aliados com presença inspiradora." },
  871: { velocidade: 1, felicidade: 9, resistencia: 6, acrobacia: 10, especial: "Aumenta a moral de aliados próximos." },
  872: { velocidade: 4, felicidade: 1, resistencia: 6, acrobacia: 3, especial: "Manipula energia elemental ao redor." },
  873: { velocidade: 2, felicidade: 6, resistencia: 10, acrobacia: 2, especial: "Recupera vigor durante batalhas longas." },
  874: { velocidade: 8, felicidade: 1, resistencia: 1, acrobacia: 10, especial: "Move-se silenciosamente pelo terreno." },
  875: { velocidade: 4, felicidade: 7, resistencia: 9, acrobacia: 1, especial: "Fortalece aliados com presença inspiradora." },
  876: { velocidade: 10, felicidade: 4, resistencia: 2, acrobacia: 4, especial: "Recupera vigor durante batalhas longas." },
  877: { velocidade: 1, felicidade: 5, resistencia: 10, acrobacia: 3, especial: "Aumenta a moral de aliados próximos." },
  878: { velocidade: 2, felicidade: 7, resistencia: 1, acrobacia: 6, especial: "Manipula energia elemental ao redor." },
  879: { velocidade: 8, felicidade: 2, resistencia: 10, acrobacia: 10, especial: "Recupera vigor durante batalhas longas." },
  880: { velocidade: 6, felicidade: 10, resistencia: 4, acrobacia: 5, especial: "Manipula energia elemental ao redor." },
  881: { velocidade: 6, felicidade: 7, resistencia: 5, acrobacia: 9, especial: "Aumenta a moral de aliados próximos." },
  882: { velocidade: 6, felicidade: 3, resistencia: 8, acrobacia: 2, especial: "Fortalece aliados com presença inspiradora." },
  883: { velocidade: 2, felicidade: 10, resistencia: 7, acrobacia: 3, especial: "Move-se silenciosamente pelo terreno." },
  884: { velocidade: 4, felicidade: 7, resistencia: 2, acrobacia: 8, especial: "Confunde o oponente com movimentos rápidos." },
  885: { velocidade: 10, felicidade: 10, resistencia: 3, acrobacia: 3, especial: "Cria uma aura protetora temporária." },
  886: { velocidade: 7, felicidade: 10, resistencia: 1, acrobacia: 10, especial: "Confunde o oponente com movimentos rápidos." },
  887: { velocidade: 10, felicidade: 8, resistencia: 10, acrobacia: 7, especial: "Fortalece aliados com presença inspiradora." },
  888: { velocidade: 4, felicidade: 4, resistencia: 8, acrobacia: 8, especial: "Move-se silenciosamente pelo terreno." },
  889: { velocidade: 10, felicidade: 7, resistencia: 1, acrobacia: 7, especial: "Aumenta a moral de aliados próximos." },
  890: { velocidade: 6, felicidade: 1, resistencia: 2, acrobacia: 8, especial: "Detecta ameaças antes de todos." },
  891: { velocidade: 10, felicidade: 9, resistencia: 8, acrobacia: 3, especial: "Controla o ambiente natural." },
  892: { velocidade: 1, felicidade: 9, resistencia: 3, acrobacia: 2, especial: "Fortalece aliados com presença inspiradora." },
  893: { velocidade: 5, felicidade: 1, resistencia: 7, acrobacia: 1, especial: "Controla o ambiente natural." },
  894: { velocidade: 6, felicidade: 9, resistencia: 10, acrobacia: 10, especial: "Libera rajadas de energia concentrada." },
  895: { velocidade: 2, felicidade: 1, resistencia: 4, acrobacia: 2, especial: "Cria uma aura protetora temporária." },
  896: { velocidade: 5, felicidade: 4, resistencia: 4, acrobacia: 4, especial: "Detecta ameaças antes de todos." },
  897: { velocidade: 4, felicidade: 7, resistencia: 1, acrobacia: 7, especial: "Confunde o oponente com movimentos rápidos." },
  898: { velocidade: 2, felicidade: 7, resistencia: 1, acrobacia: 7, especial: "Cria uma aura protetora temporária." },
  899: { velocidade: 4, felicidade: 10, resistencia: 2, acrobacia: 6, especial: "Detecta ameaças antes de todos." },
  900: { velocidade: 5, felicidade: 7, resistencia: 8, acrobacia: 2, especial: "Fortalece aliados com presença inspiradora." },
  901: { velocidade: 3, felicidade: 8, resistencia: 7, acrobacia: 3, especial: "Recupera vigor durante batalhas longas." },
  902: { velocidade: 8, felicidade: 5, resistencia: 2, acrobacia: 9, especial: "Cria uma aura protetora temporária." },
  903: { velocidade: 7, felicidade: 3, resistencia: 3, acrobacia: 7, especial: "Fortalece aliados com presença inspiradora." },
  904: { velocidade: 8, felicidade: 10, resistencia: 6, acrobacia: 8, especial: "Controla o ambiente natural." },
  905: { velocidade: 3, felicidade: 3, resistencia: 6, acrobacia: 1, especial: "Confunde o oponente com movimentos rápidos." },
  906: { velocidade: 3, felicidade: 6, resistencia: 7, acrobacia: 5, especial: "Move-se silenciosamente pelo terreno." },
  907: { velocidade: 7, felicidade: 6, resistencia: 5, acrobacia: 2, especial: "Confunde o oponente com movimentos rápidos." },
  908: { velocidade: 10, felicidade: 7, resistencia: 5, acrobacia: 3, especial: "Move-se silenciosamente pelo terreno." },
  909: { velocidade: 3, felicidade: 3, resistencia: 1, acrobacia: 5, especial: "Move-se silenciosamente pelo terreno." },
  910: { velocidade: 10, felicidade: 5, resistencia: 7, acrobacia: 10, especial: "Libera rajadas de energia concentrada." },
  911: { velocidade: 9, felicidade: 4, resistencia: 5, acrobacia: 10, especial: "Recupera vigor durante batalhas longas." },
  912: { velocidade: 10, felicidade: 10, resistencia: 7, acrobacia: 4, especial: "Controla o ambiente natural." },
  913: { velocidade: 1, felicidade: 4, resistencia: 10, acrobacia: 1, especial: "Confunde o oponente com movimentos rápidos." },
  914: { velocidade: 8, felicidade: 5, resistencia: 9, acrobacia: 10, especial: "Controla o ambiente natural." },
  915: { velocidade: 4, felicidade: 6, resistencia: 10, acrobacia: 10, especial: "Libera rajadas de energia concentrada." },
  916: { velocidade: 5, felicidade: 3, resistencia: 3, acrobacia: 5, especial: "Detecta ameaças antes de todos." },
  917: { velocidade: 9, felicidade: 4, resistencia: 7, acrobacia: 7, especial: "Manipula energia elemental ao redor." },
  918: { velocidade: 3, felicidade: 10, resistencia: 7, acrobacia: 7, especial: "Move-se silenciosamente pelo terreno." },
  919: { velocidade: 6, felicidade: 6, resistencia: 3, acrobacia: 9, especial: "Confunde o oponente com movimentos rápidos." },
  920: { velocidade: 2, felicidade: 9, resistencia: 4, acrobacia: 2, especial: "Move-se silenciosamente pelo terreno." },
  921: { velocidade: 5, felicidade: 7, resistencia: 8, acrobacia: 3, especial: "Confunde o oponente com movimentos rápidos." },
  922: { velocidade: 1, felicidade: 7, resistencia: 4, acrobacia: 7, especial: "Detecta ameaças antes de todos." },
  923: { velocidade: 6, felicidade: 2, resistencia: 5, acrobacia: 2, especial: "Detecta ameaças antes de todos." },
  924: { velocidade: 1, felicidade: 3, resistencia: 2, acrobacia: 4, especial: "Confunde o oponente com movimentos rápidos." },
  925: { velocidade: 4, felicidade: 5, resistencia: 7, acrobacia: 10, especial: "Cria uma aura protetora temporária." },
  926: { velocidade: 2, felicidade: 1, resistencia: 8, acrobacia: 3, especial: "Controla o ambiente natural." },
  927: { velocidade: 7, felicidade: 5, resistencia: 10, acrobacia: 2, especial: "Aumenta a moral de aliados próximos." },
  928: { velocidade: 1, felicidade: 2, resistencia: 2, acrobacia: 6, especial: "Detecta ameaças antes de todos." },
  929: { velocidade: 2, felicidade: 9, resistencia: 6, acrobacia: 6, especial: "Libera rajadas de energia concentrada." },
  930: { velocidade: 3, felicidade: 1, resistencia: 10, acrobacia: 1, especial: "Detecta ameaças antes de todos." },
  931: { velocidade: 7, felicidade: 6, resistencia: 2, acrobacia: 2, especial: "Aumenta a moral de aliados próximos." },
  932: { velocidade: 7, felicidade: 3, resistencia: 7, acrobacia: 5, especial: "Controla o ambiente natural." },
  933: { velocidade: 5, felicidade: 3, resistencia: 9, acrobacia: 1, especial: "Aumenta a moral de aliados próximos." },
  934: { velocidade: 6, felicidade: 3, resistencia: 5, acrobacia: 6, especial: "Move-se silenciosamente pelo terreno." },
  935: { velocidade: 4, felicidade: 9, resistencia: 10, acrobacia: 3, especial: "Manipula energia elemental ao redor." },
  936: { velocidade: 2, felicidade: 1, resistencia: 7, acrobacia: 7, especial: "Aumenta a moral de aliados próximos." },
  937: { velocidade: 3, felicidade: 8, resistencia: 6, acrobacia: 6, especial: "Detecta ameaças antes de todos." },
  938: { velocidade: 8, felicidade: 8, resistencia: 9, acrobacia: 1, especial: "Move-se silenciosamente pelo terreno." },
  939: { velocidade: 3, felicidade: 5, resistencia: 10, acrobacia: 3, especial: "Fortalece aliados com presença inspiradora." },
  940: { velocidade: 8, felicidade: 8, resistencia: 10, acrobacia: 3, especial: "Move-se silenciosamente pelo terreno." },
  941: { velocidade: 7, felicidade: 2, resistencia: 9, acrobacia: 7, especial: "Libera rajadas de energia concentrada." },
  942: { velocidade: 7, felicidade: 4, resistencia: 5, acrobacia: 1, especial: "Move-se silenciosamente pelo terreno." },
  943: { velocidade: 7, felicidade: 10, resistencia: 7, acrobacia: 8, especial: "Libera rajadas de energia concentrada." },
  944: { velocidade: 8, felicidade: 9, resistencia: 9, acrobacia: 4, especial: "Fortalece aliados com presença inspiradora." },
  945: { velocidade: 3, felicidade: 9, resistencia: 5, acrobacia: 6, especial: "Detecta ameaças antes de todos." },
  946: { velocidade: 8, felicidade: 5, resistencia: 6, acrobacia: 4, especial: "Detecta ameaças antes de todos." },
  947: { velocidade: 4, felicidade: 6, resistencia: 3, acrobacia: 5, especial: "Move-se silenciosamente pelo terreno." },
  948: { velocidade: 2, felicidade: 8, resistencia: 6, acrobacia: 8, especial: "Fortalece aliados com presença inspiradora." },
  949: { velocidade: 5, felicidade: 1, resistencia: 1, acrobacia: 5, especial: "Cria uma aura protetora temporária." },
  950: { velocidade: 8, felicidade: 4, resistencia: 8, acrobacia: 10, especial: "Controla o ambiente natural." },
  951: { velocidade: 1, felicidade: 8, resistencia: 7, acrobacia: 1, especial: "Cria uma aura protetora temporária." },
  952: { velocidade: 3, felicidade: 4, resistencia: 7, acrobacia: 8, especial: "Fortalece aliados com presença inspiradora." },
  953: { velocidade: 6, felicidade: 5, resistencia: 3, acrobacia: 8, especial: "Manipula energia elemental ao redor." },
  954: { velocidade: 6, felicidade: 8, resistencia: 10, acrobacia: 2, especial: "Recupera vigor durante batalhas longas." },
  955: { velocidade: 3, felicidade: 2, resistencia: 4, acrobacia: 8, especial: "Move-se silenciosamente pelo terreno." },
  956: { velocidade: 2, felicidade: 10, resistencia: 3, acrobacia: 8, especial: "Libera rajadas de energia concentrada." },
  957: { velocidade: 10, felicidade: 3, resistencia: 8, acrobacia: 2, especial: "Cria uma aura protetora temporária." },
  958: { velocidade: 9, felicidade: 4, resistencia: 8, acrobacia: 2, especial: "Cria uma aura protetora temporária." },
  959: { velocidade: 9, felicidade: 5, resistencia: 7, acrobacia: 4, especial: "Fortalece aliados com presença inspiradora." },
  960: { velocidade: 1, felicidade: 3, resistencia: 2, acrobacia: 8, especial: "Detecta ameaças antes de todos." },
  961: { velocidade: 10, felicidade: 10, resistencia: 10, acrobacia: 2, especial: "Move-se silenciosamente pelo terreno." },
  962: { velocidade: 8, felicidade: 10, resistencia: 3, acrobacia: 5, especial: "Manipula energia elemental ao redor." },
  963: { velocidade: 5, felicidade: 6, resistencia: 9, acrobacia: 2, especial: "Recupera vigor durante batalhas longas." },
  964: { velocidade: 6, felicidade: 3, resistencia: 2, acrobacia: 2, especial: "Detecta ameaças antes de todos." },
  965: { velocidade: 4, felicidade: 8, resistencia: 6, acrobacia: 3, especial: "Fortalece aliados com presença inspiradora." },
  966: { velocidade: 3, felicidade: 3, resistencia: 3, acrobacia: 1, especial: "Manipula energia elemental ao redor." },
  967: { velocidade: 10, felicidade: 3, resistencia: 8, acrobacia: 5, especial: "Libera rajadas de energia concentrada." },
  968: { velocidade: 8, felicidade: 6, resistencia: 2, acrobacia: 9, especial: "Controla o ambiente natural." },
  969: { velocidade: 1, felicidade: 7, resistencia: 5, acrobacia: 1, especial: "Controla o ambiente natural." },
  970: { velocidade: 8, felicidade: 9, resistencia: 3, acrobacia: 9, especial: "Fortalece aliados com presença inspiradora." },
  971: { velocidade: 3, felicidade: 8, resistencia: 10, acrobacia: 4, especial: "Confunde o oponente com movimentos rápidos." },
  972: { velocidade: 6, felicidade: 3, resistencia: 8, acrobacia: 9, especial: "Recupera vigor durante batalhas longas." },
  973: { velocidade: 2, felicidade: 4, resistencia: 5, acrobacia: 2, especial: "Cria uma aura protetora temporária." },
  974: { velocidade: 6, felicidade: 7, resistencia: 2, acrobacia: 7, especial: "Controla o ambiente natural." },
  975: { velocidade: 5, felicidade: 5, resistencia: 3, acrobacia: 4, especial: "Move-se silenciosamente pelo terreno." },
  976: { velocidade: 10, felicidade: 9, resistencia: 3, acrobacia: 10, especial: "Cria uma aura protetora temporária." },
  977: { velocidade: 5, felicidade: 2, resistencia: 7, acrobacia: 9, especial: "Controla o ambiente natural." },
  978: { velocidade: 4, felicidade: 1, resistencia: 1, acrobacia: 2, especial: "Recupera vigor durante batalhas longas." },
  979: { velocidade: 4, felicidade: 1, resistencia: 6, acrobacia: 1, especial: "Detecta ameaças antes de todos." },
  980: { velocidade: 6, felicidade: 1, resistencia: 4, acrobacia: 4, especial: "Aumenta a moral de aliados próximos." },
  981: { velocidade: 1, felicidade: 5, resistencia: 8, acrobacia: 7, especial: "Move-se silenciosamente pelo terreno." },
  982: { velocidade: 5, felicidade: 5, resistencia: 5, acrobacia: 1, especial: "Cria uma aura protetora temporária." },
  983: { velocidade: 8, felicidade: 9, resistencia: 3, acrobacia: 5, especial: "Recupera vigor durante batalhas longas." },
  984: { velocidade: 6, felicidade: 2, resistencia: 5, acrobacia: 7, especial: "Aumenta a moral de aliados próximos." },
  985: { velocidade: 4, felicidade: 2, resistencia: 10, acrobacia: 6, especial: "Detecta ameaças antes de todos." },
  986: { velocidade: 2, felicidade: 8, resistencia: 1, acrobacia: 3, especial: "Detecta ameaças antes de todos." },
  987: { velocidade: 8, felicidade: 6, resistencia: 7, acrobacia: 6, especial: "Aumenta a moral de aliados próximos." },
  988: { velocidade: 3, felicidade: 6, resistencia: 7, acrobacia: 4, especial: "Move-se silenciosamente pelo terreno." },
  989: { velocidade: 3, felicidade: 3, resistencia: 8, acrobacia: 1, especial: "Move-se silenciosamente pelo terreno." },
  990: { velocidade: 3, felicidade: 3, resistencia: 3, acrobacia: 5, especial: "Controla o ambiente natural." },
  991: { velocidade: 1, felicidade: 5, resistencia: 10, acrobacia: 6, especial: "Manipula energia elemental ao redor." },
  992: { velocidade: 10, felicidade: 10, resistencia: 1, acrobacia: 6, especial: "Cria uma aura protetora temporária." },
  993: { velocidade: 8, felicidade: 6, resistencia: 9, acrobacia: 3, especial: "Confunde o oponente com movimentos rápidos." },
  994: { velocidade: 7, felicidade: 2, resistencia: 1, acrobacia: 5, especial: "Aumenta a moral de aliados próximos." },
  995: { velocidade: 1, felicidade: 2, resistencia: 4, acrobacia: 3, especial: "Libera rajadas de energia concentrada." },
  996: { velocidade: 5, felicidade: 5, resistencia: 8, acrobacia: 5, especial: "Libera rajadas de energia concentrada." },
  997: { velocidade: 8, felicidade: 3, resistencia: 7, acrobacia: 1, especial: "Cria uma aura protetora temporária." },
  998: { velocidade: 6, felicidade: 6, resistencia: 10, acrobacia: 3, especial: "Cria uma aura protetora temporária." },
  999: { velocidade: 7, felicidade: 1, resistencia: 3, acrobacia: 5, especial: "Aumenta a moral de aliados próximos." },
  1000: { velocidade: 3, felicidade: 2, resistencia: 9, acrobacia: 8, especial: "Libera rajadas de energia concentrada." },
  1001: { velocidade: 1, felicidade: 3, resistencia: 6, acrobacia: 8, especial: "Detecta ameaças antes de todos." },
  1002: { velocidade: 7, felicidade: 9, resistencia: 5, acrobacia: 7, especial: "Detecta ameaças antes de todos." },
  1003: { velocidade: 9, felicidade: 6, resistencia: 4, acrobacia: 10, especial: "Controla o ambiente natural." },
  1004: { velocidade: 8, felicidade: 8, resistencia: 7, acrobacia: 5, especial: "Cria uma aura protetora temporária." },
  1005: { velocidade: 5, felicidade: 4, resistencia: 7, acrobacia: 6, especial: "Cria uma aura protetora temporária." },
  1006: { velocidade: 7, felicidade: 9, resistencia: 1, acrobacia: 7, especial: "Aumenta a moral de aliados próximos." },
  1007: { velocidade: 3, felicidade: 7, resistencia: 7, acrobacia: 5, especial: "Manipula energia elemental ao redor." },
  1008: { velocidade: 1, felicidade: 9, resistencia: 5, acrobacia: 1, especial: "Manipula energia elemental ao redor." },
  1009: { velocidade: 3, felicidade: 6, resistencia: 2, acrobacia: 8, especial: "Confunde o oponente com movimentos rápidos." },
  1010: { velocidade: 1, felicidade: 8, resistencia: 8, acrobacia: 7, especial: "Manipula energia elemental ao redor." },



};

const DEFAULT_POKEMON_ATTRIBUTES: PokemonBaseAttributes = {
  velocidade: 5,
  felicidade: 5,
  resistencia: 5,
  acrobacia: 5,
};

/**
 * Get the base attributes for a given species.
 * Falls back to balanced defaults for unknown species.
 */
export function getBaseAttributes(speciesId: number): PokemonBaseAttributes {
  return SPECIES_BASE_ATTRIBUTES[speciesId] || DEFAULT_POKEMON_ATTRIBUTES;
}

/**
 * Compute the effective attribute modifier for a D20 test at a given level.
 * Formula: floor(baseAttr / 2) + floor(level / 5)
 * This gives a +0 to +5 base modifier, growing up to +20 at level 100.
 * e.g. Pikachu (velocidade=8) at level 20: floor(8/2) + floor(20/5) = 4 + 4 = +8
 */
export function computeAttributes(speciesId: number, level: number, overrideBase?: PokemonBaseAttributes): PokemonComputedAttributes {
  const base = overrideBase || getBaseAttributes(speciesId);
  const levelBonus = Math.floor(level / 5);
  // Defense (AC) formula: 8 + resistencia modifier + floor(level / 4)
  // Gives range ~9 at level 1 to ~33 at level 100 for high-resist Pokemon
  const resistenciaMod = Math.floor(base.resistencia / 2) + levelBonus;
  const defesa = 8 + Math.floor(base.resistencia / 2) + Math.floor(level / 4);
  return {
    velocidade: base.velocidade,
    felicidade: base.felicidade,
    resistencia: base.resistencia,
    acrobacia: base.acrobacia,
    velocidadeMod: Math.floor(base.velocidade / 2) + levelBonus,
    felicidadeMod: Math.floor(base.felicidade / 2) + levelBonus,
    especialMod: Math.floor(base.felicidade / 2) + levelBonus,
    resistenciaMod,
    acrobaciaMod: Math.floor(base.acrobacia / 2) + levelBonus,
    defesa,
  };
}

// D20 hit result calculation
export type HitResult = "critical-miss" | "miss" | "hit" | "strong-hit" | "critical-hit";

export function calculateHitResult(roll: number, accuracy: number): HitResult {
  if (roll === 1) return "critical-miss";
  if (roll === 20) return "critical-hit";
  if (roll >= accuracy + 5) return "strong-hit";
  if (roll >= accuracy) return "hit";
  return "miss";
}

export function getDamageMultiplier(result: HitResult): number {
  switch (result) {
    case "critical-miss": return 0;
    case "miss": return 0;
    case "hit": return 1;
    case "strong-hit": return 1.5;
    case "critical-hit": return 2;
  }
}

export function getHitResultLabel(result: HitResult): string {
  switch (result) {
    case "critical-miss": return "Falha Critica!";
    case "miss": return "Errou!";
    case "hit": return "Acertou!";
    case "strong-hit": return "Golpe Forte!";
    case "critical-hit": return "Critico!";
  }
}

export function getHitResultColor(result: HitResult): string {
  switch (result) {
    case "critical-miss": return "#EF4444";
    case "miss": return "#9CA3AF";
    case "hit": return "#22C55E";
    case "strong-hit": return "#3B82F6";
    case "critical-hit": return "#F59E0B";
  }
}

// ========== RPG Dice Damage Calculation ==========

export interface DamageBreakdown {
  moveName: string;
  diceString: string | null;     // e.g. "2d8"
  diceRolls: number[];           // individual dice results [5, 3]
  diceTotal: number;             // sum of dice
  scalingAttr: string | null;    // which attribute is used for bonus
  attrBonus: number;             // modifier from attribute (acrobaciaMod or felicidadeMod)
  hitMultiplierLabel: string;    // "Critico x2", "Golpe Forte x1.5", etc.
  hitMultiplier: number;         // 0, 1, 1.5, or 2
  defenseReduction: number;      // floor(defesa / 3)
  rawTotal: number;              // (diceTotal + attrBonus) * hitMultiplier
  finalDamage: number;           // max(1, rawTotal - defenseReduction) for hits, 0 for miss
  isStatus: boolean;             // true for moves with power=0
  formula: string;               // human-readable formula string
}

/**
 * Calculate full RPG battle damage with dice rolls, attribute bonuses, hit multipliers, level scaling, and defense.
 * 
 * Formula: finalDamage = max(1, ((diceRoll + attrBonus + levelBonus) * hitMultiplier * typeMultiplier) - defenseReduction)
 * 
 * - diceRoll: roll the move's damage_dice (e.g. "2d8" -> roll 2d8)
 * - attrBonus: attacker's attribute modifier (acrobaciaMod for physical, felicidadeMod for special)
 * - levelBonus: floor(attackerLevel / 5) - adds bonus damage based on attacker's level
 * - hitMultiplier: from D20 hit result (0 for miss, 1 for hit, 1.5 for strong, 2 for critical)
 * - typeMultiplier: 1.5 for super effective (STAB), calculated externally
 * - defenseReduction: floor(targetDefesa / 3)
 * 
 * Level difference scaling:
 * - Each level grants +1 base damage per 5 levels
 * - Higher level attackers deal significantly more damage
 */
export function calculateBattleDamage(
  move: Move,
  hitResult: HitResult,
  attackerAttrs: PokemonComputedAttributes,
  targetDefesa: number,
  attackerLevel?: number,
  targetLevel?: number
): DamageBreakdown {
  const isStatus = move.damage_type === "status";
  const multiplier = getDamageMultiplier(hitResult);

  if (isStatus || !move.damage_dice) {
    return {
      moveName: move.name,
      diceString: null,
      diceRolls: [],
      diceTotal: 0,
      scalingAttr: null,
      attrBonus: 0,
      hitMultiplierLabel: getHitMultiplierLabel(hitResult),
      hitMultiplier: multiplier,
      defenseReduction: 0,
      rawTotal: 0,
      finalDamage: 0,
      isStatus: true,
      formula: "Status - sem dano",
    };
  }

  // Roll dice
  const { rolls, sum: diceTotal } = rollDiceString(move.damage_dice);

  // Get attribute bonus based on move classification
  let attrBonus = 0;
  let scalingAttr: string | null = null;
  if (move.damage_type === "physical") {
    attrBonus = attackerAttrs.acrobaciaMod;
    scalingAttr = "Acrobacia";
  } else if (move.damage_type === "special") {
    attrBonus = attackerAttrs.felicidadeMod;
    scalingAttr = "Felicidade";
  }

  // Level-based damage bonus: +1 damage per 5 levels of the attacker
  const levelBonus = attackerLevel ? Math.floor(attackerLevel / 5) : 0;

  // Level difference multiplier: higher level attackers deal more damage
  // +10% damage per level difference (capped at +100% / -50%)
  let levelDiffMultiplier = 1.0;
  if (attackerLevel && targetLevel) {
    const levelDiff = attackerLevel - targetLevel;
    if (levelDiff > 0) {
      // Attacker is higher level: +10% per level, max +100%
      levelDiffMultiplier = Math.min(2.0, 1.0 + (levelDiff * 0.10));
    } else if (levelDiff < 0) {
      // Attacker is lower level: -5% per level, min 50%
      levelDiffMultiplier = Math.max(0.5, 1.0 + (levelDiff * 0.05));
    }
  }

  // Calculate raw total before defense (with level bonus and level diff multiplier)
  const rawTotal = Math.floor((diceTotal + attrBonus + levelBonus) * multiplier * levelDiffMultiplier);

  // Defense reduction (reduced effectiveness against higher level attackers)
  const defenseEffectiveness = levelDiffMultiplier > 1.0 ? Math.max(0.5, 2.0 - levelDiffMultiplier) : 1.0;
  const defenseReduction = Math.floor((targetDefesa / 3) * defenseEffectiveness);

  // Final damage (min 1 if hit, 0 if miss)
  const isMiss = hitResult === "miss" || hitResult === "critical-miss";
  const finalDamage = isMiss ? 0 : Math.max(1, rawTotal - defenseReduction);

  // Build formula string
  const formulaParts: string[] = [];
  formulaParts.push(`${move.damage_dice} [${rolls.join("+")}=${diceTotal}]`);
  if (attrBonus > 0) formulaParts.push(`+${attrBonus} ${scalingAttr}`);
  if (levelBonus > 0) formulaParts.push(`+${levelBonus} Lv`);
  if (multiplier !== 1) formulaParts.push(`x${multiplier}`);
  if (levelDiffMultiplier !== 1.0) formulaParts.push(`x${levelDiffMultiplier.toFixed(1)} NvDif`);
  formulaParts.push(`= ${rawTotal}`);
  if (!isMiss && defenseReduction > 0) formulaParts.push(`- ${defenseReduction} DEF = ${finalDamage}`);

  return {
    moveName: move.name,
    diceString: move.damage_dice,
    diceRolls: rolls,
    diceTotal,
    scalingAttr,
    attrBonus,
    hitMultiplierLabel: getHitMultiplierLabel(hitResult),
    hitMultiplier: multiplier,
    defenseReduction: isMiss ? 0 : defenseReduction,
    rawTotal,
    finalDamage,
    isStatus: false,
    formula: formulaParts.join(" "),
  };
}

function getHitMultiplierLabel(result: HitResult): string {
  switch (result) {
    case "critical-miss": return "Falha Critica x0";
    case "miss": return "Errou x0";
    case "hit": return "Acertou x1";
    case "strong-hit": return "Golpe Forte x1.5";
    case "critical-hit": return "Critico x2";
  }
}

// Dice notation parser for RPG damage
export function parseDiceNotation(notation: string): { count: number; sides: number; modifier: number } | null {
  const match = notation.trim().match(/^(\d+)?d(\d+)\s*([+-]\s*\d+)?$/i);
  if (!match) return null;
  return {
    count: match[1] ? parseInt(match[1]) : 1,
    sides: parseInt(match[2]),
    modifier: match[3] ? parseInt(match[3].replace(/\s/g, "")) : 0,
  };
}


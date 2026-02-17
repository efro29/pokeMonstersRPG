export type PokemonType =
  | "normal" | "fire" | "water" | "grass" | "electric" | "ice"
  | "fighting" | "poison" | "ground" | "flying" | "psychic"
  | "bug" | "rock" | "ghost" | "dragon" | "dark" | "steel";

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
};

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
  // Normal
  m({ id: "tackle", name: "Tackle", type: "normal", power: 40, accuracy: 6, description: "Um ataque corpo a corpo simples.", range: "melee", learnLevel: 1 }),
  m({ id: "scratch", name: "Scratch", type: "normal", power: 40, accuracy: 6, description: "Arranha o inimigo com garras afiadas.", range: "melee", learnLevel: 1 }),
  m({ id: "pound", name: "Pound", type: "normal", power: 40, accuracy: 6, description: "Golpeia o alvo com a pata.", range: "melee", learnLevel: 1 }),
  m({ id: "quick-attack", name: "Quick Attack", type: "normal", power: 40, accuracy: 5, description: "Ataque extremamente rapido.", range: "short", learnLevel: 5 }),
  m({ id: "slam", name: "Slam", type: "normal", power: 80, accuracy: 10, description: "Golpe poderoso que arremessa o alvo.", range: "melee", learnLevel: 20 }),
  m({ id: "body-slam", name: "Body Slam", type: "normal", power: 85, accuracy: 8, description: "Arremessa o corpo inteiro no inimigo.", range: "melee", learnLevel: 25 }),
  m({ id: "hyper-beam", name: "Hyper Beam", type: "normal", power: 150, accuracy: 14, description: "Disparo devastador de energia.", range: "long", learnLevel: 45 }),
  m({ id: "wrap", name: "Wrap", type: "normal", power: 15, accuracy: 7, description: "Enrola o alvo apertando-o.", range: "melee", learnLevel: 5 }),
  m({ id: "bite", name: "Bite", type: "dark", power: 60, accuracy: 7, description: "Morde com presas afiadas.", range: "melee", learnLevel: 10 }),
  m({ id: "headbutt", name: "Headbutt", type: "normal", power: 70, accuracy: 8, description: "Cabecada poderosa.", range: "melee", learnLevel: 15 }),
  m({ id: "take-down", name: "Take Down", type: "normal", power: 90, accuracy: 10, description: "Investida selvagem, causa recuo.", range: "melee", learnLevel: 25 }),
  m({ id: "fury-attack", name: "Fury Attack", type: "normal", power: 15, accuracy: 6, description: "Ataca 2-5 vezes seguidas.", range: "melee", learnLevel: 8 }),
  m({ id: "horn-attack", name: "Horn Attack", type: "normal", power: 65, accuracy: 7, description: "Ataca com chifres afiados.", range: "melee", learnLevel: 10 }),
  m({ id: "rage", name: "Rage", type: "normal", power: 20, accuracy: 6, description: "Fica mais forte a cada golpe.", range: "melee", learnLevel: 10 }),
  m({ id: "mega-punch", name: "Mega Punch", type: "normal", power: 80, accuracy: 10, description: "Soco devastador.", range: "melee", learnLevel: 20 }),
  m({ id: "double-edge", name: "Double-Edge", type: "normal", power: 120, accuracy: 8, description: "Investida suicida. Causa recuo.", range: "melee", learnLevel: 35 }),
  m({ id: "strength", name: "Strength", type: "normal", power: 80, accuracy: 7, description: "Golpe de forca bruta.", range: "melee", learnLevel: 15 }),
  m({ id: "pay-day", name: "Pay Day", type: "normal", power: 40, accuracy: 7, description: "Atira moedas no inimigo.", range: "short", learnLevel: 12 }),
  m({ id: "comet-punch", name: "Comet Punch", type: "normal", power: 18, accuracy: 6, description: "Sequencia rapida de socos.", range: "melee", learnLevel: 5 }),
  m({ id: "sing", name: "Sing", type: "normal", power: 0, accuracy: 13, description: "Canta para adormecer o alvo.", range: "medium", learnLevel: 10 }),
  m({ id: "growl", name: "Growl", type: "normal", power: 0, accuracy: 4, description: "Rosna para reduzir ataque.", range: "short", learnLevel: 1 }),
  m({ id: "tail-whip", name: "Tail Whip", type: "normal", power: 0, accuracy: 4, description: "Abana a cauda para reduzir defesa.", range: "short", learnLevel: 1 }),
  m({ id: "leer", name: "Leer", type: "normal", power: 0, accuracy: 4, description: "Olhar intimidador reduz defesa.", range: "short", learnLevel: 1 }),
  m({ id: "harden", name: "Harden", type: "normal", power: 0, accuracy: 2, description: "Endurece o corpo, aumenta defesa.", range: "melee", learnLevel: 1 }),
  m({ id: "defense-curl", name: "Defense Curl", type: "normal", power: 0, accuracy: 2, description: "Enrola-se para aumentar defesa.", range: "melee", learnLevel: 1 }),
  m({ id: "self-destruct", name: "Self-Destruct", type: "normal", power: 200, accuracy: 6, description: "Explode causando dano massivo.", range: "area", learnLevel: 30 }),
  m({ id: "explosion", name: "Explosion", type: "normal", power: 250, accuracy: 6, description: "Explosao devastadora.", range: "area", learnLevel: 40 }),
  m({ id: "fury-swipes", name: "Fury Swipes", type: "normal", power: 18, accuracy: 7, description: "Arranha 2-5 vezes.", range: "melee", learnLevel: 8 }),
  m({ id: "super-fang", name: "Super Fang", type: "normal", power: 50, accuracy: 8, description: "Morde tirando metade do HP.", range: "melee", learnLevel: 20 }),
  m({ id: "swift", name: "Swift", type: "normal", power: 60, accuracy: 2, description: "Estrelas que nunca erram.", range: "medium", learnLevel: 18 }),
  m({ id: "screech", name: "Screech", type: "normal", power: 0, accuracy: 10, description: "Grito que reduz muito a defesa.", range: "short", learnLevel: 15 }),
  m({ id: "barrage", name: "Barrage", type: "normal", power: 15, accuracy: 7, description: "Atira objetos 2-5 vezes.", range: "short", learnLevel: 8 }),
  m({ id: "tri-attack", name: "Tri Attack", type: "normal", power: 80, accuracy: 7, description: "Ataque triplo de elementos.", range: "medium", learnLevel: 30 }),
  m({ id: "skull-bash", name: "Skull Bash", type: "normal", power: 130, accuracy: 12, description: "Cabecada devastadora.", range: "melee", learnLevel: 35 }),
  // Fire
  m({ id: "ember", name: "Ember", type: "fire", power: 40, accuracy: 7, description: "Pequenas chamas atingem o alvo.", range: "short", learnLevel: 5 }),
  m({ id: "flamethrower", name: "Flamethrower", type: "fire", power: 90, accuracy: 8, description: "Lanca-chamas poderoso.", range: "medium", learnLevel: 25 }),
  m({ id: "fire-blast", name: "Fire Blast", type: "fire", power: 110, accuracy: 12, description: "Explosao de fogo intensa.", range: "long", learnLevel: 40 }),
  m({ id: "fire-spin", name: "Fire Spin", type: "fire", power: 35, accuracy: 10, description: "Vortice de fogo aprisiona o alvo.", range: "short", learnLevel: 12 }),
  m({ id: "fire-punch", name: "Fire Punch", type: "fire", power: 75, accuracy: 7, description: "Soco em chamas.", range: "melee", learnLevel: 18 }),
  // Water
  m({ id: "water-gun", name: "Water Gun", type: "water", power: 40, accuracy: 7, description: "Jato de agua pressurizado.", range: "short", learnLevel: 5 }),
  m({ id: "bubble", name: "Bubble", type: "water", power: 40, accuracy: 7, description: "Bolhas que atingem o alvo.", range: "short", learnLevel: 1 }),
  m({ id: "surf", name: "Surf", type: "water", power: 90, accuracy: 8, description: "Onda gigante atinge todos.", range: "area", learnLevel: 30 }),
  m({ id: "hydro-pump", name: "Hydro Pump", type: "water", power: 110, accuracy: 12, description: "Jato de agua devastador.", range: "long", learnLevel: 40 }),
  m({ id: "bubble-beam", name: "Bubble Beam", type: "water", power: 65, accuracy: 7, description: "Rajada de bolhas concentrada.", range: "medium", learnLevel: 15 }),
  m({ id: "withdraw", name: "Withdraw", type: "water", power: 0, accuracy: 2, description: "Recolhe no casco, aumenta defesa.", range: "melee", learnLevel: 1 }),
  m({ id: "clamp", name: "Clamp", type: "water", power: 35, accuracy: 10, description: "Prende o alvo com conchas.", range: "melee", learnLevel: 10 }),
  m({ id: "crabhammer", name: "Crabhammer", type: "water", power: 100, accuracy: 10, description: "Martelo com garra.", range: "melee", learnLevel: 30 }),
  // Grass
  m({ id: "vine-whip", name: "Vine Whip", type: "grass", power: 45, accuracy: 7, description: "Chicoteia com vinhas.", range: "short", learnLevel: 5 }),
  m({ id: "razor-leaf", name: "Razor Leaf", type: "grass", power: 55, accuracy: 7, description: "Folhas afiadas cortam o alvo.", range: "medium", learnLevel: 15 }),
  m({ id: "solar-beam", name: "Solar Beam", type: "grass", power: 120, accuracy: 12, description: "Raio solar concentrado.", range: "long", learnLevel: 40 }),
  m({ id: "absorb", name: "Absorb", type: "grass", power: 20, accuracy: 6, description: "Absorve HP do alvo.", range: "short", learnLevel: 5 }),
  m({ id: "mega-drain", name: "Mega Drain", type: "grass", power: 40, accuracy: 7, description: "Drena muita energia do alvo.", range: "short", learnLevel: 15 }),
  m({ id: "leech-seed", name: "Leech Seed", type: "grass", power: 0, accuracy: 8, description: "Planta semente que drena HP.", range: "short", learnLevel: 8 }),
  m({ id: "stun-spore", name: "Stun Spore", type: "grass", power: 0, accuracy: 10, description: "Espalha esporos paralisantes.", range: "short", learnLevel: 12 }),
  m({ id: "sleep-powder", name: "Sleep Powder", type: "grass", power: 0, accuracy: 12, description: "Po que faz o alvo dormir.", range: "short", learnLevel: 15 }),
  m({ id: "petal-dance", name: "Petal Dance", type: "grass", power: 120, accuracy: 8, description: "Danca de petalas frentica.", range: "area", learnLevel: 35 }),
  // Electric
  m({ id: "thunder-shock", name: "Thunder Shock", type: "electric", power: 40, accuracy: 7, description: "Descarga eletrica leve.", range: "short", learnLevel: 5 }),
  m({ id: "thunderbolt", name: "Thunderbolt", type: "electric", power: 90, accuracy: 8, description: "Raio poderoso.", range: "medium", learnLevel: 25 }),
  m({ id: "thunder", name: "Thunder", type: "electric", power: 110, accuracy: 13, description: "Trovao devastador.", range: "long", learnLevel: 40 }),
  m({ id: "thunder-wave", name: "Thunder Wave", type: "electric", power: 0, accuracy: 7, description: "Onda eletrica que paralisa.", range: "medium", learnLevel: 10 }),
  m({ id: "thunder-punch", name: "Thunder Punch", type: "electric", power: 75, accuracy: 7, description: "Soco eletrificado.", range: "melee", learnLevel: 18 }),
  // Ice
  m({ id: "ice-beam", name: "Ice Beam", type: "ice", power: 90, accuracy: 8, description: "Raio congelante.", range: "medium", learnLevel: 25 }),
  m({ id: "blizzard", name: "Blizzard", type: "ice", power: 110, accuracy: 13, description: "Tempestade de gelo devastadora.", range: "area", learnLevel: 40 }),
  m({ id: "ice-punch", name: "Ice Punch", type: "ice", power: 75, accuracy: 7, description: "Soco congelante.", range: "melee", learnLevel: 18 }),
  m({ id: "aurora-beam", name: "Aurora Beam", type: "ice", power: 65, accuracy: 7, description: "Raio colorido congelante.", range: "medium", learnLevel: 15 }),
  // Fighting
  m({ id: "low-kick", name: "Low Kick", type: "fighting", power: 50, accuracy: 7, description: "Rasteira poderosa.", range: "melee", learnLevel: 5 }),
  m({ id: "karate-chop", name: "Karate Chop", type: "fighting", power: 50, accuracy: 7, description: "Golpe de karate.", range: "melee", learnLevel: 8 }),
  m({ id: "submission", name: "Submission", type: "fighting", power: 80, accuracy: 10, description: "Golpe de luta, causa recuo.", range: "melee", learnLevel: 25 }),
  m({ id: "seismic-toss", name: "Seismic Toss", type: "fighting", power: 60, accuracy: 8, description: "Arremesso sismico.", range: "melee", learnLevel: 20 }),
  m({ id: "high-jump-kick", name: "High Jump Kick", type: "fighting", power: 130, accuracy: 14, description: "Chute voador devastador.", range: "melee", learnLevel: 35 }),
  m({ id: "double-kick", name: "Double Kick", type: "fighting", power: 30, accuracy: 7, description: "Chuta duas vezes seguidas.", range: "melee", learnLevel: 8 }),
  // Poison
  m({ id: "poison-sting", name: "Poison Sting", type: "poison", power: 15, accuracy: 6, description: "Ferroa com veneno.", range: "short", learnLevel: 1 }),
  m({ id: "sludge", name: "Sludge", type: "poison", power: 65, accuracy: 7, description: "Lanca lodo toxico.", range: "short", learnLevel: 20 }),
  m({ id: "acid", name: "Acid", type: "poison", power: 40, accuracy: 7, description: "Spray de acido corrosivo.", range: "short", learnLevel: 10 }),
  m({ id: "smog", name: "Smog", type: "poison", power: 30, accuracy: 9, description: "Fumaca toxica.", range: "short", learnLevel: 8 }),
  m({ id: "toxic", name: "Toxic", type: "poison", power: 0, accuracy: 10, description: "Envenena gravemente o alvo.", range: "short", learnLevel: 20 }),
  m({ id: "poison-gas", name: "Poison Gas", type: "poison", power: 0, accuracy: 11, description: "Gas venenoso.", range: "short", learnLevel: 10 }),
  // Ground
  m({ id: "sand-attack", name: "Sand Attack", type: "ground", power: 0, accuracy: 6, description: "Joga areia nos olhos.", range: "short", learnLevel: 5 }),
  m({ id: "earthquake", name: "Earthquake", type: "ground", power: 100, accuracy: 7, description: "Terremoto devastador.", range: "area", learnLevel: 30 }),
  m({ id: "dig", name: "Dig", type: "ground", power: 80, accuracy: 7, description: "Cava e ataca por baixo.", range: "melee", learnLevel: 20 }),
  m({ id: "bone-club", name: "Bone Club", type: "ground", power: 65, accuracy: 10, description: "Golpeia com osso.", range: "melee", learnLevel: 15 }),
  m({ id: "bonemerang", name: "Bonemerang", type: "ground", power: 50, accuracy: 8, description: "Lanca osso como bumerangue.", range: "medium", learnLevel: 18 }),
  m({ id: "fissure", name: "Fissure", type: "ground", power: 999, accuracy: 19, description: "Abre fenda no chao. KO instantaneo.", range: "area", learnLevel: 45 }),
  // Flying
  m({ id: "gust", name: "Gust", type: "flying", power: 40, accuracy: 7, description: "Rajada de vento.", range: "medium", learnLevel: 5 }),
  m({ id: "wing-attack", name: "Wing Attack", type: "flying", power: 60, accuracy: 7, description: "Ataque com asas.", range: "melee", learnLevel: 12 }),
  m({ id: "fly", name: "Fly", type: "flying", power: 90, accuracy: 10, description: "Voa alto e mergulha para atacar.", range: "long", learnLevel: 30 }),
  m({ id: "peck", name: "Peck", type: "flying", power: 35, accuracy: 6, description: "Bica o alvo.", range: "melee", learnLevel: 1 }),
  m({ id: "drill-peck", name: "Drill Peck", type: "flying", power: 80, accuracy: 7, description: "Bica girando como broca.", range: "melee", learnLevel: 25 }),
  m({ id: "sky-attack", name: "Sky Attack", type: "flying", power: 140, accuracy: 14, description: "Ataque aereo devastador.", range: "long", learnLevel: 40 }),
  // Psychic
  m({ id: "confusion", name: "Confusion", type: "psychic", power: 50, accuracy: 7, description: "Onda psiquica que confunde.", range: "medium", learnLevel: 8 }),
  m({ id: "psychic", name: "Psychic", type: "psychic", power: 90, accuracy: 7, description: "Ataque psiquico poderoso.", range: "medium", learnLevel: 30 }),
  m({ id: "psybeam", name: "Psybeam", type: "psychic", power: 65, accuracy: 7, description: "Raio psiquico peculiar.", range: "medium", learnLevel: 18 }),
  m({ id: "hypnosis", name: "Hypnosis", type: "psychic", power: 0, accuracy: 12, description: "Hipnotiza o alvo para dormir.", range: "short", learnLevel: 15 }),
  m({ id: "dream-eater", name: "Dream Eater", type: "psychic", power: 100, accuracy: 7, description: "Devora sonhos do alvo dormindo.", range: "medium", learnLevel: 30 }),
  m({ id: "barrier", name: "Barrier", type: "psychic", power: 0, accuracy: 2, description: "Cria barreira, aumenta defesa.", range: "melee", learnLevel: 15 }),
  m({ id: "agility", name: "Agility", type: "psychic", power: 0, accuracy: 2, description: "Relaxa o corpo, aumenta velocidade.", range: "melee", learnLevel: 10 }),
  m({ id: "teleport", name: "Teleport", type: "psychic", power: 0, accuracy: 2, description: "Teletransporta para longe.", range: "melee", learnLevel: 1 }),
  m({ id: "amnesia", name: "Amnesia", type: "psychic", power: 0, accuracy: 2, description: "Esquece algo, aumenta defesa esp.", range: "melee", learnLevel: 20 }),
  m({ id: "meditate", name: "Meditate", type: "psychic", power: 0, accuracy: 2, description: "Medita para aumentar ataque.", range: "melee", learnLevel: 10 }),
  // Bug
  m({ id: "string-shot", name: "String Shot", type: "bug", power: 0, accuracy: 6, description: "Seda que reduz velocidade.", range: "short", learnLevel: 1 }),
  m({ id: "leech-life", name: "Leech Life", type: "bug", power: 80, accuracy: 7, description: "Suga a vida do alvo.", range: "melee", learnLevel: 15 }),
  m({ id: "pin-missile", name: "Pin Missile", type: "bug", power: 25, accuracy: 7, description: "Agulhas afiadas 2-5 vezes.", range: "short", learnLevel: 12 }),
  m({ id: "twineedle", name: "Twineedle", type: "bug", power: 25, accuracy: 7, description: "Ataca com dois ferroes.", range: "melee", learnLevel: 10 }),
  // Rock
  m({ id: "rock-throw", name: "Rock Throw", type: "rock", power: 50, accuracy: 8, description: "Arremessa pedras no alvo.", range: "short", learnLevel: 10 }),
  m({ id: "rock-slide", name: "Rock Slide", type: "rock", power: 75, accuracy: 9, description: "Deslizamento de rochas.", range: "medium", learnLevel: 25 }),
  // Ghost
  m({ id: "lick", name: "Lick", type: "ghost", power: 30, accuracy: 7, description: "Lambe com lingua espectral.", range: "melee", learnLevel: 5 }),
  m({ id: "night-shade", name: "Night Shade", type: "ghost", power: 50, accuracy: 7, description: "Ilusao sinistra que causa dano.", range: "medium", learnLevel: 15 }),
  m({ id: "confuse-ray", name: "Confuse Ray", type: "ghost", power: 0, accuracy: 7, description: "Luz sinistra que confunde.", range: "short", learnLevel: 10 }),
  // Dragon
  m({ id: "dragon-rage", name: "Dragon Rage", type: "dragon", power: 40, accuracy: 7, description: "Furia do dragao, dano fixo.", range: "medium", learnLevel: 15 }),
  m({ id: "outrage", name: "Outrage", type: "dragon", power: 120, accuracy: 8, description: "Furia descontrolada de dragao.", range: "melee", learnLevel: 40 }),
  m({ id: "twister", name: "Twister", type: "dragon", power: 40, accuracy: 7, description: "Tornado draconico.", range: "medium", learnLevel: 12 }),
  m({ id: "dragon-breath", name: "Dragon Breath", type: "dragon", power: 60, accuracy: 7, description: "Sopro draconico paralisante.", range: "short", learnLevel: 18 }),
  // Dark (Gen 2)
  m({ id: "crunch", name: "Crunch", type: "dark", power: 80, accuracy: 7, description: "Mordida que esmaga a defesa.", range: "melee", learnLevel: 25 }),
  m({ id: "faint-attack", name: "Faint Attack", type: "dark", power: 60, accuracy: 2, description: "Ataque furtivo que nunca erra.", range: "short", learnLevel: 15 }),
  m({ id: "pursuit", name: "Pursuit", type: "dark", power: 40, accuracy: 6, description: "Persegue o alvo que foge.", range: "short", learnLevel: 8 }),
  m({ id: "thief", name: "Thief", type: "dark", power: 60, accuracy: 7, description: "Rouba item enquanto ataca.", range: "melee", learnLevel: 15 }),
  m({ id: "mean-look", name: "Mean Look", type: "dark", power: 0, accuracy: 4, description: "Olhar sinistro impede fuga.", range: "medium", learnLevel: 10 }),
  m({ id: "beat-up", name: "Beat Up", type: "dark", power: 10, accuracy: 7, description: "Chama aliados para atacar.", range: "short", learnLevel: 20 }),
  // Steel (Gen 2)
  m({ id: "iron-tail", name: "Iron Tail", type: "steel", power: 100, accuracy: 10, description: "Golpeia com cauda de aco.", range: "melee", learnLevel: 30 }),
  m({ id: "metal-claw", name: "Metal Claw", type: "steel", power: 50, accuracy: 7, description: "Arranha com garras metalicas.", range: "melee", learnLevel: 10 }),
  m({ id: "steel-wing", name: "Steel Wing", type: "steel", power: 70, accuracy: 8, description: "Ataca com asas de aco.", range: "melee", learnLevel: 20 }),
  // Gen 2 additions to existing types
  m({ id: "cross-chop", name: "Cross Chop", type: "fighting", power: 100, accuracy: 10, description: "Golpe cruzado devastador.", range: "melee", learnLevel: 35 }),
  m({ id: "dynamic-punch", name: "Dynamic Punch", type: "fighting", power: 100, accuracy: 13, description: "Soco dinamico que confunde.", range: "melee", learnLevel: 35 }),
  m({ id: "mach-punch", name: "Mach Punch", type: "fighting", power: 40, accuracy: 5, description: "Soco rapido, sempre ataca primeiro.", range: "melee", learnLevel: 5 }),
  m({ id: "vital-throw", name: "Vital Throw", type: "fighting", power: 70, accuracy: 2, description: "Arremesso certeiro.", range: "melee", learnLevel: 20 }),
  m({ id: "shadow-ball", name: "Shadow Ball", type: "ghost", power: 80, accuracy: 7, description: "Esfera sombria fantasmagorica.", range: "medium", learnLevel: 25 }),
  m({ id: "megahorn", name: "Megahorn", type: "bug", power: 120, accuracy: 10, description: "Chifrada poderosa.", range: "melee", learnLevel: 35 }),
  m({ id: "sacred-fire", name: "Sacred Fire", type: "fire", power: 100, accuracy: 7, description: "Chamas sagradas de Ho-Oh.", range: "long", learnLevel: 45 }),
  m({ id: "aeroblast", name: "Aeroblast", type: "flying", power: 100, accuracy: 7, description: "Rajada aerea de Lugia.", range: "long", learnLevel: 45 }),
  m({ id: "spark", name: "Spark", type: "electric", power: 65, accuracy: 7, description: "Eletricidade ao colidir.", range: "melee", learnLevel: 15 }),
  m({ id: "zap-cannon", name: "Zap Cannon", type: "electric", power: 120, accuracy: 14, description: "Canhao eletrico paralisante.", range: "long", learnLevel: 40 }),
  m({ id: "extreme-speed", name: "Extreme Speed", type: "normal", power: 80, accuracy: 5, description: "Velocidade extrema.", range: "short", learnLevel: 30 }),
  m({ id: "return", name: "Return", type: "normal", power: 102, accuracy: 7, description: "Ataque baseado na felicidade.", range: "melee", learnLevel: 15 }),
  m({ id: "rapid-spin", name: "Rapid Spin", type: "normal", power: 50, accuracy: 7, description: "Giro rapido remove armadilhas.", range: "melee", learnLevel: 12 }),
  m({ id: "giga-drain", name: "Giga Drain", type: "grass", power: 75, accuracy: 7, description: "Drena muita energia do alvo.", range: "medium", learnLevel: 25 }),
  m({ id: "sludge-bomb", name: "Sludge Bomb", type: "poison", power: 90, accuracy: 7, description: "Bomba de lodo toxico.", range: "medium", learnLevel: 30 }),
  m({ id: "rollout", name: "Rollout", type: "rock", power: 30, accuracy: 8, description: "Rola com forca crescente.", range: "melee", learnLevel: 10 }),
  m({ id: "ancient-power", name: "Ancient Power", type: "rock", power: 60, accuracy: 7, description: "Poder ancestral, pode subir stats.", range: "medium", learnLevel: 20 }),
  m({ id: "mud-slap", name: "Mud-Slap", type: "ground", power: 20, accuracy: 6, description: "Joga lama que reduz precisao.", range: "short", learnLevel: 5 }),
  m({ id: "icy-wind", name: "Icy Wind", type: "ice", power: 55, accuracy: 7, description: "Vento gelado que reduz velocidade.", range: "medium", learnLevel: 15 }),
  m({ id: "powder-snow", name: "Powder Snow", type: "ice", power: 40, accuracy: 7, description: "Neve em po congelante.", range: "short", learnLevel: 5 }),
  m({ id: "future-sight", name: "Future Sight", type: "psychic", power: 120, accuracy: 12, description: "Ataque psiquico do futuro.", range: "long", learnLevel: 35 }),
  m({ id: "whirlpool", name: "Whirlpool", type: "water", power: 35, accuracy: 10, description: "Redemoinho que prende o alvo.", range: "short", learnLevel: 12 }),
  m({ id: "octazooka", name: "Octazooka", type: "water", power: 65, accuracy: 10, description: "Tinta que reduz precisao.", range: "medium", learnLevel: 20 }),
  m({ id: "flame-wheel", name: "Flame Wheel", type: "fire", power: 60, accuracy: 7, description: "Roda de fogo.", range: "melee", learnLevel: 15 }),
  m({ id: "cotton-spore", name: "Cotton Spore", type: "grass", power: 0, accuracy: 10, description: "Esporos de algodao reduzem velocidade.", range: "short", learnLevel: 12 }),
  m({ id: "reversal", name: "Reversal", type: "fighting", power: 60, accuracy: 7, description: "Mais forte com menos HP.", range: "melee", learnLevel: 20 }),
  m({ id: "mirror-coat", name: "Mirror Coat", type: "psychic", power: 0, accuracy: 7, description: "Reflete ataques especiais.", range: "melee", learnLevel: 25 }),
  m({ id: "counter", name: "Counter", type: "fighting", power: 0, accuracy: 7, description: "Reflete ataques fisicos.", range: "melee", learnLevel: 20 }),
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
  [275, "Shiftry", ["grass", "dark"], 100, ["razor-leaf", "fake-out"], ["leaf-blade", "extrasensory", "hurricane", "solar-beam", "hyper-beam"]]

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

export function getSpriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
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
  { from: 255, to: 256, method: "level", level: 16 },  // Torchic -> Combusken
  { from: 256, to: 257, method: "level", level: 36 },  // Combusken -> Blaziken
  { from: 258, to: 259, method: "level", level: 16 },  // Mudkip -> Marshtomp
  { from: 259, to: 260, method: "level", level: 36 },  // Marshtomp -> Swampert
  { from: 261, to: 262, method: "level", level: 18 },  // Poochyena -> Mightyena
  { from: 263, to: 264, method: "level", level: 20 },  // Zigzagoon -> Linoone
  { from: 265, to: 266, method: "level", level: 7 },   // Wurmple -> Silcoon
  { from: 266, to: 267, method: "level", level: 10 },  // Silcoon -> Beautifly
  { from: 265, to: 268, method: "level", level: 7 },   // Wurmple -> Cascoon
  { from: 268, to: 269, method: "level", level: 10 },  // Cascoon -> Dustox
  { from: 270, to: 271, method: "level", level: 14 },  // Lotad -> Lombre
  { from: 271, to: 272, method: "stone", stone: "water-stone" },  // Lombre -> Ludicolo
  { from: 273, to: 274, method: "level", level: 14 },  // Seedot -> Nuzleaf
  { from: 274, to: 275, method: "stone", stone: "leaf-stone" }   // Nuzleaf -> Shiftry

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
  { id: "fire-stone", name: "Pedra de Fogo", description: "Evolui Pokemon do tipo Fogo." },
  { id: "water-stone", name: "Pedra da Agua", description: "Evolui Pokemon do tipo Agua." },
  { id: "thunder-stone", name: "Pedra do Trovao", description: "Evolui Pokemon do tipo Eletrico." },
  { id: "leaf-stone", name: "Pedra da Folha", description: "Evolui Pokemon do tipo Planta." },
  { id: "moon-stone", name: "Pedra da Lua", description: "Evolui Pokemon especiais." },
  { id: "sun-stone", name: "Pedra do Sol", description: "Evolui Pokemon com luz solar." },
  { id: "metal-coat", name: "Revestimento Metalico", description: "Evolui Pokemon de aco." },
  { id: "kings-rock", name: "Pedra do Rei", description: "Evolui Pokemon especiais por troca." },
  { id: "dragon-scale", name: "Escama de Dragao", description: "Evolui Seadra em Kingdra." },
  { id: "up-grade", name: "Up-Grade", description: "Evolui Porygon em Porygon2." },
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
  velocidade:  { name: "Velocidade",  desc: "Rapidez e reflexos em combate.",       icon: "zap" },
  felicidade:  { name: "Felicidade",  desc: "Vinculo com o treinador e carisma.",   icon: "heart" },
  resistencia: { name: "Resistencia", desc: "Vigor fisico e capacidade de aguentar.", icon: "shield" },
  acrobacia:   { name: "Acrobacia",   desc: "Agilidade, esquiva e movimentos aereos.", icon: "wind" },
    especial:   { name: "Especial",   desc: "Habilidade que somente este pokemon pode fazer", icon: "star" },
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
  1:  { velocidade: 4, felicidade: 5, resistencia: 5, acrobacia: 4, especial: "Faz brotar vinhas e plantas pelo campo." },   // Bulbasaur
2:  { velocidade: 5, felicidade: 5, resistencia: 6, acrobacia: 4, especial: "Acelera o crescimento natural ao redor." },  // Ivysaur
3:  { velocidade: 6, felicidade: 6, resistencia: 8, acrobacia: 5, especial: "Cria vegetação densa que protege aliados." },  // Venusaur

4:  { velocidade: 6, felicidade: 5, resistencia: 4, acrobacia: 5, especial: "Aquece o ambiente suavemente." },      // Charmander
5:  { velocidade: 7, felicidade: 5, resistencia: 5, acrobacia: 6, especial: "Ilumina áreas escuras com sua chama." },  // Charmeleon
6:  { velocidade: 8, felicidade: 6, resistencia: 6, acrobacia: 9, especial: "Permite voar carregando um treinador." },      // Charizard

7:  { velocidade: 4, felicidade: 6, resistencia: 6, acrobacia: 4, especial: "Flutua e atravessa água calma." },      // Squirtle
8:  { velocidade: 5, felicidade: 6, resistencia: 7, acrobacia: 4, especial: "Mergulha por longos períodos." }, // Wartortle
9:  { velocidade: 6, felicidade: 6, resistencia: 9, acrobacia: 5, especial: "Dispara jato de água para empurrar obstáculos." },        // Blastoise

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
80: { velocidade: 3, felicidade: 7, resistencia: 10, acrobacia: 2, especial: "Mergulha lentamente por longos períodos." }  ,       // Slowbro
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

120: { velocidade: 6, felicidade: 6, resistencia: 5, acrobacia: 6, especial: "Brilha iluminando a noite." }    ,     // Staryu

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
160: { velocidade: 6, felicidade: 5, resistencia: 8, acrobacia: 6, especial: "Arrebenta correntes e grades." } ,  // Feraligatr

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

200: { velocidade: 7, felicidade: 3, resistencia: 3, acrobacia: 7, especial: "Produz ecos fantasmagóricos." }  ,      // Misdreavus

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
251: { velocidade: 8, felicidade: 10, resistencia: 8, acrobacia: 8, especial: "Viaja pelo tempo e restaura florestas." } ,    // Celebi
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
275: { velocidade: 7, felicidade: 6, resistencia: 7, acrobacia: 7, especial: "Controla rajadas de vento cortante." } // Shiftry

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
 * Calculate full RPG battle damage with dice rolls, attribute bonuses, hit multipliers, and defense.
 * 
 * Formula: finalDamage = max(1, ((diceRoll + attrBonus) * hitMultiplier) - defenseReduction)
 * 
 * - diceRoll: roll the move's damage_dice (e.g. "2d8" -> roll 2d8)
 * - attrBonus: attacker's attribute modifier (acrobaciaMod for physical, felicidadeMod for special)
 * - hitMultiplier: from D20 hit result (0 for miss, 1 for hit, 1.5 for strong, 2 for critical)
 * - defenseReduction: floor(targetDefesa / 3)
 */
export function calculateBattleDamage(
  move: Move,
  hitResult: HitResult,
  attackerAttrs: PokemonComputedAttributes,
  targetDefesa: number
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

  // Calculate raw total before defense
  const rawTotal = Math.floor((diceTotal + attrBonus) * multiplier);

  // Defense reduction
  const defenseReduction = Math.floor(targetDefesa / 3);

  // Final damage (min 1 if hit, 0 if miss)
  const isMiss = hitResult === "miss" || hitResult === "critical-miss";
  const finalDamage = isMiss ? 0 : Math.max(1, rawTotal - defenseReduction);

  // Build formula string
  const formulaParts: string[] = [];
  formulaParts.push(`${move.damage_dice} [${rolls.join("+")}=${diceTotal}]`);
  if (attrBonus > 0) formulaParts.push(`+${attrBonus} ${scalingAttr}`);
  if (multiplier !== 1) formulaParts.push(`x${multiplier}`);
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


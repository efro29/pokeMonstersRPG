// Battle Card system - Types, deck generation, and card effects
// Trio rules:
//   - Super Advantage: 3 LUCK cards with SAME element (e.g. fire+fire+fire)
//   - Super Punishment: 3 BAD-LUCK cards -> clears all slots
//   - Bad luck cards: -2 damage penalty each (-4 if pokemon shares the card element type)
//   - Luck cards: slots remain after trio, only cleared on bad-luck trio
//   - Deck: 27 luck / 13 bad luck cards

export type CardAlignment = "luck" | "bad-luck" | "aura-elemental" | "aura-amplificada" | "heal" | "resurrect";

export type CardElement =
  | "fire" | "water" | "grass" | "electric" | "ice"
  | "rock" | "psychic" | "ghost" | "dragon" | "normal" | "flying"
  | "fighting" | "poison" | "ground" | "bug" | "dark" | "steel";

export const CARD_ELEMENTS: CardElement[] = [
  "fire", "water", "grass", "electric", "ice",
  "rock", "psychic", "ghost", "dragon", "normal", "flying",
  "fighting", "poison", "ground", "bug", "dark", "steel",
];

export const ELEMENT_COLORS: Record<CardElement, string> = {
  fire: "#F08030",
  water: "#6890F0",
  grass: "#78C850",
  electric: "#F8D030",
  ice: "#98D8D8",
  rock: "#B8A038",
  psychic: "#F85888",
  ghost: "#705898",
  dragon: "#7038F8",
  normal: "#A8A878",
  flying: "#A890F0",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  bug: "#A8B820",
  dark: "#705848",
  steel: "#B8B8D0",
};

export const ELEMENT_NAMES_PT: Record<CardElement, string> = {
  fire: "Fogo",
  water: "Agua",
  grass: "Planta",
  electric: "Eletrico",
  ice: "Gelo",
  rock: "Pedra",
  psychic: "Psiquico",
  ghost: "Fantasma",
  dragon: "Dragao",
  normal: "Normal",
  flying: "Voador",
  fighting: "Lutador",
  poison: "Veneno",
  ground: "Terra",
  bug: "Inseto",
  dark: "Sombrio",
  steel: "Aco",
};

export interface BattleCard {
  id: string;
  alignment: CardAlignment;
  element: CardElement;
  name: string;
  description: string;
  effectKey: string;
  /** Index used for the card image: /images/cards/card{cardIndex}.png */
  cardIndex: number;
  /** Whether the aura card's power has been activated (only for aura cards) */
  activated?: boolean;
}

// -- LUCK CARD DEFINITIONS --
export interface LuckCardDef {
  effectKey: string;
  name: string;
  description: string;
}

export const LUCK_CARDS: LuckCardDef[] = [
  { effectKey: "crit-chance", name: "Olhar Afiado", description: "+5% chance de critico neste combate" },
  { effectKey: "regen-hp", name: "Aura Vital", description: "Cura 8% HP por turno" },
  { effectKey: "accuracy-up", name: "Confio em você!", description: "+10% precisao nos ataques" },
  { effectKey: "speed-up", name: "Veloz como um Raio", description: "+1 velocidade no combate" },
  { effectKey: "damage-reduce", name: "Barreira Leve", description: "Reduz dano recebido em 5%" },
  { effectKey: "pp-recover", name: "Barreira Pesada", description: "Recupera 1 HP por turno" },
  { effectKey: "element-damage", name: "Acredito em voce!", description: "1 Critico ao movimentar" },
  { effectKey: "first-action", name: "Barriga Cheia", description: "Acao garantida primeiro" },
];

// -- BAD LUCK CARD DEFINITIONS --
export interface BadLuckCardDef {
  effectKey: string;
  name: string;
  description: string;
}

export const BAD_LUCK_CARDS: BadLuckCardDef[] = [
  { effectKey: "bleed-hp", name: "Sangramento", description: "Perde 3% HP por turno" },
  { effectKey: "accuracy-down", name: "Visao Turva", description: "-10% precisao nos ataques" },
  { effectKey: "attack-fail", name: "Hesitacao", description: "Chance do ataque falhar" },
  { effectKey: "no-items", name: "Maldicao do Bolso", description: "Nao pode usar itens" },
  { effectKey: "double-pp", name: "Gasto Excessivo", description: "Consumo dobrado de PP" },
  { effectKey: "extra-damage", name: "Guarda Baixa", description: "Dano recebido +15%" },
  { effectKey: "enemy-crit", name: "Ameaca Crescente", description: "Inimigo ganha chance de critico" },
  { effectKey: "enemy-atk-up", name: "Furia Inimiga", description: "Ataque do inimigo aumenta" },
  { effectKey: "enemy-speed-up", name: "Inimigo Agil", description: "Velocidade do inimigo +1" },
  { effectKey: "enemy-shield", name: "Escudo Sombrio", description: "Inimigo ganha escudo" },

];

// -- SUPER ADVANTAGES (Luck Trio) --
export interface SuperEffect {
  key: string;
  name: string;
  description: string;
  affinityName: string;
  affinityDescription: string;
}

export const SUPER_ADVANTAGES: SuperEffect[] = [
  {
    key: "full-heal",
    name: "Cura Completa",
    description: "HP totalmente restaurado!",
    affinityName: "Cura Divina",
    affinityDescription: "HP restaurado e status curados!",
  },
  {
    key: "guaranteed-crit",
    name: "Golpe Certeiro",
    description: "Proximo ataque e critico garantido!",
    affinityName: "Golpe Duplo Certeiro",
    affinityDescription: "2 ataques criticos garantidos!",
  },
  {
    key: "enemy-stun",
    name: "Atordoamento",
    description: "Inimigo atordoado por 1 turno!",
    affinityName: "Atordoamento Prolongado",
    affinityDescription: "Inimigo atordoado por 2 turnos!",
  },
  {
    key: "attack-boost",
    name: "Forca Extrema",
    description: "+50% ataque por 3 turnos!",
    affinityName: "Forca Suprema",
    affinityDescription: "+100% ataque por 3 turnos!",
  },
  {
    key: "protect-shield",
    name: "Escudo Protetor",
    description: "Escudo protege contra 1 ataque!",
    affinityName: "Escudo Duplo",
    affinityDescription: "Escudo protege contra 2 ataques!",
  },
  {
    key: "auto-revive",
    name: "Segunda Chance",
    description: "Revive automaticamente uma vez!",
    affinityName: "Segunda Chance+",
    affinityDescription: "Revive com HP elevado!",
  },
];

// -- SUPER PUNISHMENTS (Bad Luck Trio) --
export const SUPER_PUNISHMENTS: SuperEffect[] = [
  {
    key: "lose-hp",
    name: "Drenagem Vital",
    description: "-80% de HP",
    affinityName: "Drenagem Severa",
    affinityDescription: "-80% de HP",
  },
  {
    key: "skip-turn",
    name: "Paralisia Total",
    description: "-80% de HP",
    affinityName: "Paralisia Dupla",
    affinityDescription: "-80% de HP",
  },
  {
    key: "attack-failures",
    name: "Confusao",
    description: "-80% de HP",
    affinityName: "Confusao Severa",
 affinityDescription: "-80% de HP",
  },
  {
    key: "heavy-debuff",
    name: "Enfraquecimento",
    description: "-80% de HP",
    affinityName: "Enfraquecimento Duplo",
 affinityDescription: "-80% de HP",
  },
  {
    key: "pp-drain",
    name: "Exaustao",
    description: "-80% de HP",
    affinityName: "Exaustao Severa",
  affinityDescription: "-80% de HP",
  },
  {
    key: "status-condition",
    name: "Maldicao",
    description: "-80% de HP",
    affinityName: "Maldicao Multipla",
  affinityDescription: "-80% de HP",
  },
];

// -- DECK GENERATION --
let cardCounter = 0;
function nextCardId(): string {
  return `card-${Date.now()}-${++cardCounter}`;
}

function randomElement(): CardElement {
  return CARD_ELEMENTS[Math.floor(Math.random() * CARD_ELEMENTS.length)];
}

/**
 * Draw a single card with exact probabilities:
 *   Sorte (luck)        = 80%
 *   Azar (bad-luck)     = 15%
 *   Aura Elemental      =  2%
 *   Aura Amplificada    =  1%
 *   Cura (heal)         =  1%
 *   Ressurreicao        =  1%
 *   Total               = 100%
 */
export function drawCard(): BattleCard {
  const roll = Math.random() * 100; // 0-100
  const element = randomElement();

  if (roll < 80) {
    // --- LUCK (80%) ---
    const defIndex = Math.floor(Math.random() * LUCK_CARDS.length);
    const def = LUCK_CARDS[defIndex];
    return {
      id: nextCardId(),
      alignment: "luck",
      element,
      name: def.name,
      description: def.description,
      effectKey: def.effectKey,
      cardIndex: defIndex,
    };
  } else if (roll < 95) {
    // --- BAD LUCK (15%) ---
    const defIndex = Math.floor(Math.random() * BAD_LUCK_CARDS.length);
    const def = BAD_LUCK_CARDS[defIndex];
    return {
      id: nextCardId(),
      alignment: "bad-luck",
      element,
      name: def.name,
      description: def.description,
      effectKey: def.effectKey,
      cardIndex: LUCK_CARDS.length + defIndex,
    };
  } else if (roll < 97) {
    // --- AURA ELEMENTAL (2%) ---
    return {
      id: nextCardId(),
      alignment: "aura-elemental",
      element: "normal",
      name: "Aura Elemental",
      description: "Carta coringa! Ative o poder para usar como 1 carta de energia de qualquer tipo.",
      effectKey: "aura-elemental",
      cardIndex: -1,
    };
  } else if (roll < 98) {
    // --- AURA AMPLIFICADA (1%) ---
    return {
      id: nextCardId(),
      alignment: "aura-amplificada",
      element: "normal",
      name: "Aura Amplificada",
      description: "Ative o poder para executar qualquer golpe sem custo. O D20 sera automaticamente 20 - Critico Garantido!",
      effectKey: "aura-amplificada",
      cardIndex: -2,
    };
  } else if (roll < 99) {
    // --- HEAL (1%) ---
    return {
      id: nextCardId(),
      alignment: "heal",
      element: "normal",
      name: "Pocao Vital",
      description: "Escolha um Pokemon para curar 20% do HP maximo!",
      effectKey: "heal-20",
      cardIndex: -3,
    };
  } else {
    // --- RESURRECT (1%) ---
    return {
      id: nextCardId(),
      alignment: "resurrect",
      element: "normal",
      name: "Enfermeira Joy",
      description: "Ressuscita um Pokemon com 0 HP (25% HP). Se nenhum morreu, cura 20%!",
      effectKey: "resurrect-25",
      cardIndex: -4,
    };
  }
}

/**
 * Check if a luck trio is formed:
 *   - Need at least 3 luck cards
 *   - All 3 must be the SAME element (e.g. fire+fire+fire)
 * Returns the matching trio cards if found, null otherwise
 */
export function checkLuckTrio(fieldCards: (BattleCard | null)[]): BattleCard[] | null {
  const luckCards = fieldCards.filter((c): c is BattleCard => c !== null && c.alignment === "luck");
  if (luckCards.length < 3) return null;

  // Group luck cards by element
  const byElement: Record<string, BattleCard[]> = {};
  for (const card of luckCards) {
    if (!byElement[card.element]) byElement[card.element] = [];
    byElement[card.element].push(card);
  }

  // Find any element with 3+ cards
  for (const element of Object.keys(byElement)) {
    if (byElement[element].length >= 3) {
      return byElement[element].slice(0, 3);
    }
  }

  return null;
}

/**
 * Check if 3 bad-luck cards are in the field -> triggers punishment + clears field
 */
export function checkBadLuckTrio(fieldCards: (BattleCard | null)[]): boolean {
  const badLuckCount = fieldCards.filter((c) => c !== null && c.alignment === "bad-luck").length;
  return badLuckCount >= 3;
}

/**
 * Calculate total bad-luck damage penalty.
 * -2 per bad luck card, -4 if pokemon shares the card's element type.
 */
export function calculateBadLuckPenalty(
  fieldCards: (BattleCard | null)[],
  pokemonTypes: string[]
): number {
  let penalty = 0;
  const normalizedTypes = pokemonTypes.map((t) => t.toLowerCase());
  for (const card of fieldCards) {
    if (card && card.alignment === "bad-luck") {
      const sameType = normalizedTypes.includes(card.element.toLowerCase());
      penalty += sameType ? -4 : -2;
    }
  }
  return penalty;
}

/** Check if the active Pokemon's type matches at least one card element in the trio */
export function checkElementalAffinity(
  pokemonTypes: string[],
  trioCards: BattleCard[]
): boolean {
  return trioCards.some((card) =>
    pokemonTypes.some((type) => type.toLowerCase() === card.element.toLowerCase())
  );
}

/** Pick a random super advantage effect */
export function rollSuperAdvantage(): SuperEffect {
  return SUPER_ADVANTAGES[Math.floor(Math.random() * SUPER_ADVANTAGES.length)];
}

/** Pick a random super punishment effect */
export function rollSuperPunishment(): SuperEffect {
  return SUPER_PUNISHMENTS[Math.floor(Math.random() * SUPER_PUNISHMENTS.length)];
}

// ---- Energy System: Count and consume element cards for move costs ----

/**
 * Count how many energy cards of a given element are on the field.
 * Luck cards of the element count + Aura Elemental cards count as wildcard (+1 each).
 */
export function countFieldCardsByElement(
  fieldCards: (BattleCard | null)[],
  element: string
): number {
  let count = 0;
  for (const c of fieldCards) {
    if (!c) continue;
    // Luck card of matching element
    if (c.alignment === "luck" && c.element === element) count++;
    // Aura Elemental counts as 1 of ANY type (only if activated)
    else if (c.alignment === "aura-elemental" && c.activated) count++;
  }
  return count;
}

/**
 * Check if an Aura Amplificada card is on the field.
 */
export function hasAuraAmplificada(fieldCards: (BattleCard | null)[]): boolean {
  return fieldCards.some((c) => c !== null && c.alignment === "aura-amplificada" && c.activated);
}

/**
 * Remove the first Aura Amplificada card from the field.
 */
export function consumeAuraAmplificada(fieldCards: (BattleCard | null)[]): (BattleCard | null)[] {
  const newField = [...fieldCards];
  const idx = newField.findIndex((c) => c !== null && c.alignment === "aura-amplificada");
  if (idx !== -1) newField[idx] = null;
  return newField;
}

/**
 * Remove `count` energy cards of the given element from the field.
 * Prefers consuming exact-element luck cards first, then aura-elemental wildcards.
 * Returns a new field array with consumed cards set to null.
 */
export function consumeEnergyCards(
  fieldCards: (BattleCard | null)[],
  element: string,
  count: number
): (BattleCard | null)[] {
  const newField = [...fieldCards];
  let remaining = count;

  // First pass: consume exact element luck cards
  for (let i = 0; i < newField.length && remaining > 0; i++) {
    const card = newField[i];
    if (card && card.alignment === "luck" && card.element === element) {
      newField[i] = null;
      remaining--;
    }
  }

  // Second pass: consume activated aura-elemental wildcards for remaining
  for (let i = 0; i < newField.length && remaining > 0; i++) {
    const card = newField[i];
    if (card && card.alignment === "aura-elemental" && card.activated) {
      newField[i] = null;
      remaining--;
    }
  }

  return newField;
}

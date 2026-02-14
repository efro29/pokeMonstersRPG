// Battle Card system - Types, deck generation, and card effects
// Trio rules:
//   - Super Advantage: 3 LUCK cards with SAME element (e.g. fire+fire+fire)
//   - Super Punishment: 3 BAD-LUCK cards -> clears all slots
//   - Bad luck cards: -2 damage penalty each (-4 if pokemon shares the card element type)
//   - Luck cards: slots remain after trio, only cleared on bad-luck trio
//   - Deck: 27 luck / 13 bad luck cards

export type CardAlignment = "luck" | "bad-luck";

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
    description: "Perde uma grande quantidade de HP!",
    affinityName: "Drenagem Severa",
    affinityDescription: "Perde ainda mais HP!",
  },
  {
    key: "skip-turn",
    name: "Paralisia Total",
    description: "Perde o proximo turno!",
    affinityName: "Paralisia Dupla",
    affinityDescription: "Perde 2 turnos!",
  },
  {
    key: "attack-failures",
    name: "Confusao",
    description: "Ataques podem falhar por 3 turnos!",
    affinityName: "Confusao Severa",
    affinityDescription: "Ataques podem falhar por mais turnos!",
  },
  {
    key: "heavy-debuff",
    name: "Enfraquecimento",
    description: "Debuff severo em atributos!",
    affinityName: "Enfraquecimento Duplo",
    affinityDescription: "Debuff dobrado em atributos!",
  },
  {
    key: "pp-drain",
    name: "Exaustao",
    description: "Perde PP de todos os golpes!",
    affinityName: "Exaustao Severa",
    affinityDescription: "Perde muito PP de todos os golpes!",
  },
  {
    key: "status-condition",
    name: "Maldicao",
    description: "Ganha uma condicao de status severa!",
    affinityName: "Maldicao Multipla",
    affinityDescription: "Ganha multiplas condicoes de status!",
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

/** Draw a single card (weighted: 27 luck / 13 bad luck = 67.5% luck, 32.5% bad luck) */
export function drawCard(): BattleCard {
  const isLuck = Math.random() < 0.500;
  const element = randomElement();

  if (isLuck) {
    const defIndex = Math.floor(Math.random() * LUCK_CARDS.length);
    const def = LUCK_CARDS[defIndex];
    return {
      id: nextCardId(),
      alignment: "luck",
      element,
      name: def.name,
      description: def.description,
      effectKey: def.effectKey,
      cardIndex: defIndex, // 0-7 for luck cards
    };
  } else {
    const defIndex = Math.floor(Math.random() * BAD_LUCK_CARDS.length);
    const def = BAD_LUCK_CARDS[defIndex];
    return {
      id: nextCardId(),
      alignment: "bad-luck",
      element,
      name: def.name,
      description: def.description,
      effectKey: def.effectKey,
      cardIndex: LUCK_CARDS.length + defIndex, // 8-20 for bad luck cards
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

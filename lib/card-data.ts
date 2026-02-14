// Battle Card system - Types, deck generation, and card effects

export type CardAlignment = "luck" | "bad-luck";

export type CardElement =
  | "fire" | "water" | "grass" | "electric" | "ice"
  | "rock" | "psychic" | "ghost" | "dragon" | "normal" | "flying";

export const CARD_ELEMENTS: CardElement[] = [
  "fire", "water", "grass", "electric", "ice",
  "rock", "psychic", "ghost", "dragon", "normal", "flying",
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
};

export const ELEMENT_ICONS: Record<CardElement, string> = {
  fire: "Flame",
  water: "Droplets",
  grass: "Leaf",
  electric: "Zap",
  ice: "Snowflake",
  rock: "Mountain",
  psychic: "Brain",
  ghost: "Ghost",
  dragon: "Star",
  normal: "Circle",
  flying: "Wind",
};

export interface BattleCard {
  id: string;
  alignment: CardAlignment;
  element: CardElement;
  name: string;
  description: string;
  effectKey: string;
}

// -- LUCK CARD DEFINITIONS --
export interface LuckCardDef {
  effectKey: string;
  name: string;
  description: string;
}

export const LUCK_CARDS: LuckCardDef[] = [
  { effectKey: "crit-chance", name: "Olhar Afiado", description: "+5% chance de critico" },
  { effectKey: "regen-hp", name: "Aura Vital", description: "Cura 8% HP por turno" },
  { effectKey: "accuracy-up", name: "Mira Precisa", description: "+10% precisao" },
  { effectKey: "speed-up", name: "Passo Rapido", description: "+1 velocidade" },
  { effectKey: "damage-reduce", name: "Barreira Leve", description: "Reduz dano recebido em 5%" },
  { effectKey: "pp-recover", name: "Energia Fluida", description: "Recupera 1 PP por turno" },
  { effectKey: "element-damage", name: "Ressonancia", description: "+12% dano se mesmo elemento" },
  { effectKey: "first-action", name: "Impulso Inicial", description: "Acao garantida primeiro" },
];

// -- BAD LUCK CARD DEFINITIONS --
export interface BadLuckCardDef {
  effectKey: string;
  name: string;
  description: string;
}

export const BAD_LUCK_CARDS: BadLuckCardDef[] = [
  { effectKey: "bleed-hp", name: "Sangramento", description: "Perde 3% HP por turno" },
  { effectKey: "accuracy-down", name: "Visao Turva", description: "-10% precisao" },
  { effectKey: "attack-fail", name: "Hesitacao", description: "Chance do ataque falhar" },
  { effectKey: "no-items", name: "Maldição do Bolso", description: "Nao pode usar itens" },
  { effectKey: "double-pp", name: "Gasto Excessivo", description: "Consumo dobrado de PP" },
  { effectKey: "extra-damage", name: "Guarda Baixa", description: "Dano recebido aumentado" },
  { effectKey: "enemy-crit", name: "Ameaca Crescente", description: "Inimigo ganha chance de critico" },
  { effectKey: "enemy-atk-up", name: "Furia Inimiga", description: "Ataque do inimigo aumenta" },
  { effectKey: "enemy-speed-up", name: "Inimigo Agil", description: "Velocidade do inimigo aumenta" },
  { effectKey: "enemy-shield", name: "Escudo Sombrio", description: "Inimigo ganha escudo" },
  { effectKey: "enemy-regen", name: "Cura Sombria", description: "Inimigo cura 10% HP por turno" },
  { effectKey: "enemy-pp-recover", name: "Fonte Negra", description: "Inimigo recupera PP" },
  { effectKey: "enemy-clear-status", name: "Purificacao Hostil", description: "Status do inimigo removidos" },
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
    name: "Maldição",
    description: "Ganha uma condicao de status severa!",
    affinityName: "Maldição Multipla",
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

/** Generate a full 40-card deck: 22 Luck + 18 Bad Luck, shuffled */
export function generateDeck(): BattleCard[] {
  const deck: BattleCard[] = [];

  // 22 Luck cards
  for (let i = 0; i < 22; i++) {
    const def = LUCK_CARDS[Math.floor(Math.random() * LUCK_CARDS.length)];
    const element = randomElement();
    deck.push({
      id: nextCardId(),
      alignment: "luck",
      element,
      name: def.name,
      description: def.description,
      effectKey: def.effectKey,
    });
  }

  // 18 Bad Luck cards
  for (let i = 0; i < 18; i++) {
    const def = BAD_LUCK_CARDS[Math.floor(Math.random() * BAD_LUCK_CARDS.length)];
    const element = randomElement();
    deck.push({
      id: nextCardId(),
      alignment: "bad-luck",
      element,
      name: def.name,
      description: def.description,
      effectKey: def.effectKey,
    });
  }

  // Shuffle (Fisher-Yates)
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

/** Draw a single card from the deck (weighted: 55% luck, 45% bad luck) */
export function drawCard(): BattleCard {
  const isLuck = Math.random() < 0.55;
  const element = randomElement();

  if (isLuck) {
    const def = LUCK_CARDS[Math.floor(Math.random() * LUCK_CARDS.length)];
    return {
      id: nextCardId(),
      alignment: "luck",
      element,
      name: def.name,
      description: def.description,
      effectKey: def.effectKey,
    };
  } else {
    const def = BAD_LUCK_CARDS[Math.floor(Math.random() * BAD_LUCK_CARDS.length)];
    return {
      id: nextCardId(),
      alignment: "bad-luck",
      element,
      name: def.name,
      description: def.description,
      effectKey: def.effectKey,
    };
  }
}

/** Check if a trio is formed in the field. Returns "luck" | "bad-luck" | null */
export function checkTrio(fieldCards: (BattleCard | null)[]): CardAlignment | null {
  const active = fieldCards.filter((c): c is BattleCard => c !== null);
  const luckCount = active.filter((c) => c.alignment === "luck").length;
  const badLuckCount = active.filter((c) => c.alignment === "bad-luck").length;

  if (luckCount >= 3) return "luck";
  if (badLuckCount >= 3) return "bad-luck";
  return null;
}

/** Check if the active Pokemon's type matches at least one card element in the field */
export function checkElementalAffinity(
  pokemonTypes: string[],
  fieldCards: (BattleCard | null)[]
): boolean {
  const active = fieldCards.filter((c): c is BattleCard => c !== null);
  return active.some((card) =>
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

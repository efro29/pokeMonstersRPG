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

export interface TeamPokemon {
  uid: string;
  speciesId: number;
  name: string;
  level: number;
  type:string[];
  xp: number;
  maxHp: number;
  currentHp: number;
  moves: ActiveMove[];
  learnableMoves: string[];
  /** Override base attributes (modified by faint penalties and level-up bonuses) */
  customAttributes?: PokemonBaseAttributes;
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
}

/** XP required for a given trainer level */
export function trainerXpForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.floor(100 * Math.pow(level - 1, 1.5));
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
  bag: BagItem[];
  battle: BattleState;
  npcs: NpcEnemy[];
  pendingEvolution: PendingEvolution | null;
  showBattleCards: boolean; // Toggle to show/hide battle cards
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
      },
      team: [],
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

        const { team } = get();
        if (team.length >= 6) return;
        const pokemon: TeamPokemon = {
          uid: generateUid(),
          speciesId: species.id,
          name: species.name,
          level: 1,
          xp: 0,
          type:species.types,
          maxHp: species.baseHp,
          currentHp: species.baseHp,
          moves: species.startingMoves
            .filter((id) => getMove(id))
            .map((id) => ({ moveId: id, currentPP: 10, maxPP: 10 })),
          learnableMoves: species.learnableMoves,
        };
        set({ team: [...team, pokemon] });
      },

      addToTeamWithLevel: (species, level) => {
        const { team } = get();
        if (team.length >= 6) return "";
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
        set({ team: [...team, pokemon] });
        return uid;
      },

      removeFromTeam: (uid) => {
        set({ team: get().team.filter((p) => p.uid !== uid) });
      },

      learnMove: (uid, moveId) => {
        set({
          team: get().team.map((p) => {
            if (p.uid !== uid) return p;
            if (p.moves.length >= 4) return p;
            if (p.moves.some((m) => m.moveId === moveId)) return p;
            return {
              ...p,
              moves: [...p.moves, { moveId, currentPP: 10, maxPP: 10 }],
              learnableMoves: p.learnableMoves.filter((id) => id !== moveId),
            };
          }),
        });
      },

      forgetMove: (uid, moveId) => {
        set({
          team: get().team.map((p) => {
            if (p.uid !== uid) return p;
            return {
              ...p,
              moves: p.moves.filter((m) => m.moveId !== moveId),
              learnableMoves: [...p.learnableMoves, moveId],
            };
          }),
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

        // Calculate dice-based damage with full breakdown
        const breakdown = calculateBattleDamage(move, hitResult, pokemonAttrs, 0);
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
        set({
          team: get().team.map((p) =>
            p.uid === uid
              ? { ...p, currentHp: Math.min(p.maxHp, p.currentHp + amount) }
              : p
          ),
        });
      },

      restorePP: (uid, moveId, amount) => {
        set({
          team: get().team.map((p) =>
            p.uid === uid
              ? {
                  ...p,
                  moves: p.moves.map((m) =>
                    m.moveId === moveId
                      ? { ...m, currentPP: Math.min(m.maxPP, m.currentPP + amount) }
                      : m
                  ),
                }
              : p
          ),
        });
      },

      restoreAllPP: (uid, amount) => {
        set({
          team: get().team.map((p) =>
            p.uid === uid
              ? {
                  ...p,
                  moves: p.moves.map((m) => ({
                    ...m,
                    currentPP: Math.min(m.maxPP, m.currentPP + amount),
                  })),
                }
              : p
          ),
        });
      },

      addXp: (uid, amount) => {
        const { team } = get();
        const pokemon = team.find((p) => p.uid === uid);
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

        set({
          team: team.map((p) =>
            p.uid === uid
              ? {
                  ...p,
                  xp: newXp,
                  level: newLevel,
                  maxHp: p.maxHp + hpGain,
                  currentHp: Math.min(p.currentHp + hpGain, p.maxHp + hpGain),
                  customAttributes: levelsGained > 0 ? currentAttrs : p.customAttributes,
                }
              : p
          ),
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
        const { team } = get();
        const pokemon = team.find((p) => p.uid === uid);
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

        set({
          team: team.map((p) =>
            p.uid === uid
              ? {
                  ...p,
                  level,
                  xp: xpForLevel(level),
                  maxHp: Math.max(1, p.maxHp + hpChange),
                  currentHp: Math.max(1, Math.min(p.currentHp + Math.max(0, hpChange), Math.max(1, p.maxHp + hpChange))),
                  customAttributes: levelDiff > 0 ? currentAttrs : p.customAttributes,
                }
              : p
          ),
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
        const { team } = get();
        const species = getPokemon(toSpeciesId);
        if (!species) return;
        set({
          team: team.map((p) => {
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
          }),
        });
      },

      useStone: (uid, stoneId) => {
        const { team, bag } = get();
        const pokemon = team.find((p) => p.uid === uid);
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
        const { team } = get();
        const pokemon = team.find((p) => p.uid === uid);
        if (!pokemon) return false;
        const evo = canEvolveByTrade(pokemon.speciesId);
        if (!evo) return false;
        get().evolvePokemon(uid, evo.to);
        return true;
      },

      useRareCandy: (uid) => {
        const { team, bag } = get();
        const pokemon = team.find((p) => p.uid === uid);
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
        const modifier =  attrs[modKey] as number;

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
            pa: battle.maxPa,
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

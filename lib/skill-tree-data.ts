/**
 * Skill Tree System - Pokemon Move Learning via Battle Points
 * 
 * Each Pokemon has a skill tree divided into two paths:
 * - SWORD PATH (Attack & Offense): Damage-dealing moves
 * - SHIELD PATH (Defense, Status, Utility): Support and defensive moves
 * 
 * Skills are organized in a tree structure where:
 * - Level 1 skills are always available
 * - Higher level skills require prerequisite skills to be unlocked
 * - Each skill costs Battle Points (PB) to unlock
 * - Some skills are passive bonuses instead of moves
 */

export type SkillPath = "sword" | "shield";

export interface SkillNode {
  id: string;
  moveId: string | null; // null for passive skills
  name: string;
  description: string;
  path: SkillPath;
  levelRequired: number; // Pokemon level required
  pbCost: number; // Battle Points cost
  prerequisites: string[]; // IDs of required skills
  isPassive: boolean;
  passiveEffect?: {
    type: "double_damage" | "double_xp" | "double_defense" | "dot" | "buff";
    condition?: string; // e.g., "vs_grass_ice"
  };
  row: number; // Visual row position (0 = top)
  col: number; // Visual column position
}

export interface SkillTree {
  speciesId: number;
  swordPath: SkillNode[];
  shieldPath: SkillNode[];
}

// ─── Helper to create skill nodes ───────────────────────────────────────────

function skill(
  id: string,
  moveId: string | null,
  name: string,
  description: string,
  path: SkillPath,
  levelRequired: number,
  pbCost: number,
  prerequisites: string[],
  row: number,
  col: number,
  isPassive = false,
  passiveEffect?: SkillNode["passiveEffect"]
): SkillNode {
  return {
    id,
    moveId,
    name,
    description,
    path,
    levelRequired,
    pbCost,
    prerequisites,
    isPassive,
    passiveEffect,
    row,
    col,
  };
}

// ─── Skill Trees for each Pokemon ───────────────────────────────────────────

// Charmander (ID: 4)
const CHARMANDER_TREE: SkillTree = {
  speciesId: 4,
  swordPath: [
    skill("charmander-scratch", "scratch", "Scratch", "Level 1, 1 PB", "sword", 1, 1, [], 0, 0),
    skill("charmander-ember", "ember", "Ember", "Level 3, 1 PB", "sword", 3, 1, ["charmander-scratch"], 1, 0),
    skill("charmander-ferocious", null, "Ferocious Attack", "Passive: DOUBLE DAMAGE", "sword", 5, 2, ["charmander-ember"], 2, 0, true, { type: "double_damage" }),
    skill("charmander-flame-burst", "flame-burst", "Flame Burst", "Level 8, 2 PB", "sword", 8, 2, ["charmander-ember"], 2, 1),
    skill("charmander-fire-blade", null, "Fire Blade", "Passive: DOT", "sword", 12, 3, ["charmander-flame-burst", "charmander-ferocious"], 3, 0, true, { type: "dot" }),
  ],
  shieldPath: [
    skill("charmander-growl", "growl", "Growl", "Level 1, 1 PB", "shield", 1, 1, [], 0, 0),
    skill("charmander-smokescreen", "smokescreen", "Smokescreen", "Level 4, 1 PB", "shield", 4, 1, ["charmander-growl"], 1, 0),
    skill("charmander-sound-mind", null, "Sound Mind", "Passive: DOUBLE XP", "shield", 6, 2, ["charmander-smokescreen"], 2, 0, true, { type: "double_xp" }),
    skill("charmander-dragon-dance", "dragon-dance", "Dragon Dance", "Buff, Level 10, 2 PB", "shield", 10, 2, ["charmander-smokescreen"], 2, 1),
    skill("charmander-flame-shield", null, "Flame Shield", "Passive: DOUBLE DEFENSE vs GRASS/ICE", "shield", 15, 3, ["charmander-dragon-dance", "charmander-sound-mind"], 3, 0, true, { type: "double_defense", condition: "vs_grass_ice" }),
  ],
};

// Bulbasaur (ID: 1)
const BULBASAUR_TREE: SkillTree = {
  speciesId: 1,
  swordPath: [
    skill("bulbasaur-tackle", "tackle", "Tackle", "Level 1, 1 PB", "sword", 1, 1, [], 0, 0),
    skill("bulbasaur-vine-whip", "vine-whip", "Vine Whip", "Level 3, 1 PB", "sword", 3, 1, ["bulbasaur-tackle"], 1, 0),
    skill("bulbasaur-razor-leaf", "razor-leaf", "Razor Leaf", "Level 7, 2 PB", "sword", 7, 2, ["bulbasaur-vine-whip"], 2, 0),
    skill("bulbasaur-seed-bomb", "seed-bomb", "Seed Bomb", "Level 12, 2 PB", "sword", 12, 2, ["bulbasaur-razor-leaf"], 2, 1),
    skill("bulbasaur-solar-beam", "solar-beam", "Solar Beam", "Level 20, 3 PB", "sword", 20, 3, ["bulbasaur-seed-bomb"], 3, 0),
  ],
  shieldPath: [
    skill("bulbasaur-growl", "growl", "Growl", "Level 1, 1 PB", "shield", 1, 1, [], 0, 0),
    skill("bulbasaur-leech-seed", "leech-seed", "Leech Seed", "Level 5, 1 PB", "shield", 5, 1, ["bulbasaur-growl"], 1, 0),
    skill("bulbasaur-sleep-powder", "sleep-powder", "Sleep Powder", "Level 10, 2 PB", "shield", 10, 2, ["bulbasaur-leech-seed"], 2, 0),
    skill("bulbasaur-synthesis", "synthesis", "Synthesis", "Level 15, 2 PB", "shield", 15, 2, ["bulbasaur-sleep-powder"], 2, 1),
    skill("bulbasaur-toxic", "toxic", "Toxic", "Level 22, 3 PB", "shield", 22, 3, ["bulbasaur-synthesis"], 3, 0),
  ],
};

// Squirtle (ID: 7)
const SQUIRTLE_TREE: SkillTree = {
  speciesId: 7,
  swordPath: [
    skill("squirtle-tackle", "tackle", "Tackle", "Level 1, 1 PB", "sword", 1, 1, [], 0, 0),
    skill("squirtle-water-gun", "water-gun", "Water Gun", "Level 3, 1 PB", "sword", 3, 1, ["squirtle-tackle"], 1, 0),
    skill("squirtle-bubble-beam", "bubble-beam", "Bubble Beam", "Level 8, 2 PB", "sword", 8, 2, ["squirtle-water-gun"], 2, 0),
    skill("squirtle-aqua-tail", "aqua-tail", "Aqua Tail", "Level 15, 2 PB", "sword", 15, 2, ["squirtle-bubble-beam"], 2, 1),
    skill("squirtle-hydro-pump", "hydro-pump", "Hydro Pump", "Level 25, 3 PB", "sword", 25, 3, ["squirtle-aqua-tail"], 3, 0),
  ],
  shieldPath: [
    skill("squirtle-tail-whip", "tail-whip", "Tail Whip", "Level 1, 1 PB", "shield", 1, 1, [], 0, 0),
    skill("squirtle-withdraw", "withdraw", "Withdraw", "Level 4, 1 PB", "shield", 4, 1, ["squirtle-tail-whip"], 1, 0),
    skill("squirtle-protect", "protect", "Protect", "Level 10, 2 PB", "shield", 10, 2, ["squirtle-withdraw"], 2, 0),
    skill("squirtle-rain-dance", "rain-dance", "Rain Dance", "Level 16, 2 PB", "shield", 16, 2, ["squirtle-protect"], 2, 1),
    skill("squirtle-aqua-ring", "aqua-ring", "Aqua Ring", "Level 22, 3 PB", "shield", 22, 3, ["squirtle-rain-dance"], 3, 0),
  ],
};

// Pikachu (ID: 25)
const PIKACHU_TREE: SkillTree = {
  speciesId: 25,
  swordPath: [
    skill("pikachu-thunder-shock", "thunder-shock", "Thunder Shock", "Level 1, 1 PB", "sword", 1, 1, [], 0, 0),
    skill("pikachu-quick-attack", "quick-attack", "Quick Attack", "Level 5, 1 PB", "sword", 5, 1, ["pikachu-thunder-shock"], 1, 0),
    skill("pikachu-electro-ball", "electro-ball", "Electro Ball", "Level 10, 2 PB", "sword", 10, 2, ["pikachu-quick-attack"], 2, 0),
    skill("pikachu-thunderbolt", "thunderbolt", "Thunderbolt", "Level 18, 2 PB", "sword", 18, 2, ["pikachu-electro-ball"], 2, 1),
    skill("pikachu-thunder", "thunder", "Thunder", "Level 30, 3 PB", "sword", 30, 3, ["pikachu-thunderbolt"], 3, 0),
  ],
  shieldPath: [
    skill("pikachu-growl", "growl", "Growl", "Level 1, 1 PB", "shield", 1, 1, [], 0, 0),
    skill("pikachu-tail-whip", "tail-whip", "Tail Whip", "Level 3, 1 PB", "shield", 3, 1, ["pikachu-growl"], 1, 0),
    skill("pikachu-double-team", "double-team", "Double Team", "Level 8, 2 PB", "shield", 8, 2, ["pikachu-tail-whip"], 2, 0),
    skill("pikachu-agility", "agility", "Agility", "Level 15, 2 PB", "shield", 15, 2, ["pikachu-double-team"], 2, 1),
    skill("pikachu-light-screen", "light-screen", "Light Screen", "Level 22, 3 PB", "shield", 22, 3, ["pikachu-agility"], 3, 0),
  ],
};

// ─── All Skill Trees Map ────────────────────────────────────────────────────

export const SKILL_TREES: Record<number, SkillTree> = {
  1: BULBASAUR_TREE,
  4: CHARMANDER_TREE,
  7: SQUIRTLE_TREE,
  25: PIKACHU_TREE,
};

// ─── Helper Functions ───────────────────────────────────────────────────────

/**
 * Get skill tree for a Pokemon species
 * Returns null if no custom tree defined (will use default generation)
 */
export function getSkillTree(speciesId: number): SkillTree | null {
  return SKILL_TREES[speciesId] ?? null;
}

/**
 * Generate a default skill tree for a Pokemon based on its startingMoves and learnableMoves
 */
export function generateDefaultSkillTree(
  speciesId: number,
  startingMoves: string[],
  learnableMoves: string[]
): SkillTree {
  const swordPath: SkillNode[] = [];
  const shieldPath: SkillNode[] = [];

  // Classify moves into sword (damage) or shield (status/support)
  const allMoves = [...startingMoves, ...learnableMoves];
  const statusMoves = ["growl", "tail-whip", "leer", "harden", "defense-curl", "smokescreen", 
    "withdraw", "protect", "double-team", "agility", "light-screen", "reflect",
    "leech-seed", "sleep-powder", "stun-spore", "poison-powder", "toxic",
    "rain-dance", "sunny-day", "sandstorm", "hail", "sing", "hypnosis"];

  let swordRow = 0;
  let shieldRow = 0;
  let prevSwordId: string | null = null;
  let prevShieldId: string | null = null;

  allMoves.forEach((moveId, index) => {
    const isStatus = statusMoves.includes(moveId);
    const level = Math.max(1, (index + 1) * 3);
    const pbCost = Math.min(3, Math.floor(index / 2) + 1);
    const id = `${speciesId}-${moveId}`;

    if (isStatus) {
      shieldPath.push(skill(
        id,
        moveId,
        moveId.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
        `Level ${level}, ${pbCost} PB`,
        "shield",
        level,
        pbCost,
        prevShieldId ? [prevShieldId] : [],
        shieldRow,
        0
      ));
      prevShieldId = id;
      shieldRow++;
    } else {
      swordPath.push(skill(
        id,
        moveId,
        moveId.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
        `Level ${level}, ${pbCost} PB`,
        "sword",
        level,
        pbCost,
        prevSwordId ? [prevSwordId] : [],
        swordRow,
        0
      ));
      prevSwordId = id;
      swordRow++;
    }
  });

  // Ensure at least one move in each path
  if (swordPath.length === 0 && allMoves.length > 0) {
    const moveId = allMoves[0];
    swordPath.push(skill(
      `${speciesId}-${moveId}`,
      moveId,
      moveId.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
      "Level 1, 1 PB",
      "sword",
      1,
      1,
      [],
      0,
      0
    ));
  }
  if (shieldPath.length === 0) {
    shieldPath.push(skill(
      `${speciesId}-growl`,
      "growl",
      "Growl",
      "Level 1, 1 PB",
      "shield",
      1,
      1,
      [],
      0,
      0
    ));
  }

  return { speciesId, swordPath, shieldPath };
}

/**
 * Check if a skill can be unlocked
 */
export function canUnlockSkill(
  skill: SkillNode,
  pokemonLevel: number,
  unlockedSkills: string[],
  battlePoints: number
): { canUnlock: boolean; reason?: string } {
  // Check level
  if (pokemonLevel < skill.levelRequired) {
    return { canUnlock: false, reason: `Requer nivel ${skill.levelRequired}` };
  }

  // Check battle points
  if (battlePoints < skill.pbCost) {
    return { canUnlock: false, reason: `Requer ${skill.pbCost} PB` };
  }

  // Check prerequisites
  for (const prereqId of skill.prerequisites) {
    if (!unlockedSkills.includes(prereqId)) {
      return { canUnlock: false, reason: "Desbloqueie habilidades anteriores" };
    }
  }

  // Check if already unlocked
  if (unlockedSkills.includes(skill.id)) {
    return { canUnlock: false, reason: "Ja desbloqueado" };
  }

  return { canUnlock: true };
}

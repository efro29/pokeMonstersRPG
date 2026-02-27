/**
 * Skill Tree System - Pokemon Move Learning via Battle Points
 * 
 * Each Pokemon has a skill tree divided into two paths:
 * - SWORD PATH (Attack & Offense): Damage-dealing moves (power > 0)
 * - SHIELD PATH (Defense, Status, Utility): Status/support moves (power === 0)
 * 
 * Starting moves are unlocked by default.
 * Learnable moves need to be unlocked with Battle Points (PB).
 */

import { MOVES, getMove } from "./pokemon-data";

export type SkillPath = "sword" | "shield";

export interface SkillNode {
  id: string;
  moveId: string;
  name: string;
  description: string;
  path: SkillPath;
  levelRequired: number;
  pbCost: number;
  prerequisites: string[];
  isUnlockedByDefault: boolean; // true for startingMoves
  row: number;
  isPassive?: boolean;
  passiveEffect?: {
    type: "double_damage" | "double_xp" | "double_defense" | "dot" | "buff";
    condition?: string;
  };
}

export interface SkillTree {
  speciesId: number;
  swordPath: SkillNode[];
  shieldPath: SkillNode[];
}

/**
 * Determine if a move is offensive (SWORD) or defensive/status (SHIELD)
 */
function isOffensiveMove(moveId: string): boolean {
  const move = getMove(moveId);
  if (!move) return true; // Default to sword if move not found
  return move.power > 0;
}

/**
 * Generate skill tree for a Pokemon based on its startingMoves and learnableMoves
 * 
 * - startingMoves go to row 0 (unlocked by default)
 * - learnableMoves go to subsequent rows (need PB to unlock)
 * - Moves with power > 0 go to SWORD PATH
 * - Moves with power === 0 go to SHIELD PATH
 */
export function generateSkillTree(
  speciesId: number,
  startingMoves: string[],
  learnableMoves: string[]
): SkillTree {
  const swordPath: SkillNode[] = [];
  const shieldPath: SkillNode[] = [];

  // Process starting moves (unlocked by default, row 0)
  startingMoves.forEach((moveId) => {
    const move = getMove(moveId);
    if (!move) return;
    
    const isOffensive = move.power > 0;
    const path: SkillPath = isOffensive ? "sword" : "shield";
    const targetPath = isOffensive ? swordPath : shieldPath;
    
    targetPath.push({
      id: `${speciesId}-${moveId}`,
      moveId,
      name: move.name,
      description: move.description,
      path,
      levelRequired: 1,
      pbCost: 0, // Free - starting move
      prerequisites: [],
      isUnlockedByDefault: true,
      row: 0,
    });
  });

  // Process learnable moves (need to unlock, rows 1+)
  let swordRow = 1;
  let shieldRow = 1;

  learnableMoves.forEach((moveId, index) => {
    const move = getMove(moveId);
    if (!move) return;
    
    const isOffensive = move.power > 0;
    const path: SkillPath = isOffensive ? "sword" : "shield";
    const targetPath = isOffensive ? swordPath : shieldPath;
    const currentRow = isOffensive ? swordRow : shieldRow;
    
    // Calculate level and cost based on position
    const levelRequired = Math.max(1, move.learnLevel || (currentRow * 5));
    const pbCost = Math.min(3, Math.max(1, Math.ceil(currentRow / 2)));
    
    // Prerequisites: previous skill in same path
    const prevSkill = targetPath.length > 0 ? targetPath[targetPath.length - 1] : null;
    const prerequisites = prevSkill ? [prevSkill.id] : [];
    
    targetPath.push({
      id: `${speciesId}-${moveId}`,
      moveId,
      name: move.name,
      description: move.description,
      path,
      levelRequired,
      pbCost,
      prerequisites,
      isUnlockedByDefault: false,
      row: currentRow,
    });
    
    if (isOffensive) {
      swordRow++;
    } else {
      shieldRow++;
    }
  });

  // Ensure at least one skill in each path
  if (swordPath.length === 0) {
    swordPath.push({
      id: `${speciesId}-tackle`,
      moveId: "tackle",
      name: "Tackle",
      description: "Um ataque corpo a corpo simples.",
      path: "sword",
      levelRequired: 1,
      pbCost: 0,
      prerequisites: [],
      isUnlockedByDefault: true,
      row: 0,
    });
  }
  
  if (shieldPath.length === 0) {
    shieldPath.push({
      id: `${speciesId}-growl`,
      moveId: "growl",
      name: "Growl",
      description: "Diminui o ataque do inimigo.",
      path: "shield",
      levelRequired: 1,
      pbCost: 0,
      prerequisites: [],
      isUnlockedByDefault: true,
      row: 0,
    });
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
  // Already unlocked by default
  if (skill.isUnlockedByDefault) {
    return { canUnlock: false, reason: "Ja desbloqueado" };
  }

  // Check if already unlocked
  if (unlockedSkills.includes(skill.id)) {
    return { canUnlock: false, reason: "Ja desbloqueado" };
  }

  // Check level
  if (pokemonLevel < skill.levelRequired) {
    return { canUnlock: false, reason: `Nivel ${skill.levelRequired}` };
  }

  // Check battle points
  if (battlePoints < skill.pbCost) {
    return { canUnlock: false, reason: `${skill.pbCost} PB` };
  }

  // Check prerequisites
  for (const prereqId of skill.prerequisites) {
    // Check if prerequisite is a starting move (always unlocked) or manually unlocked
    const isPrereqStartingMove = prereqId.includes("-") && skill.row > 0;
    if (!unlockedSkills.includes(prereqId) && !isPrereqStartingMove) {
      // Check if the prerequisite is a default unlocked skill
      const prereqRow = parseInt(prereqId.split("-").pop() || "0", 10);
      if (prereqRow !== 0) {
        return { canUnlock: false, reason: "Desbloqueie anterior" };
      }
    }
  }

  return { canUnlock: true };
}

/**
 * Get all unlocked skills for a Pokemon (including default starting moves,
 * excluding any that were manually disabled via disabledDefaultSkills).
 */
export function getUnlockedSkills(
  skillTree: SkillTree,
  manuallyUnlocked: string[],
  disabledDefaultSkills: string[] = []
): string[] {
  const defaultUnlocked = [
    ...skillTree.swordPath.filter(s => s.isUnlockedByDefault).map(s => s.id),
    ...skillTree.shieldPath.filter(s => s.isUnlockedByDefault).map(s => s.id),
  ].filter(id => !disabledDefaultSkills.includes(id));
  return [...new Set([...defaultUnlocked, ...manuallyUnlocked])];
}

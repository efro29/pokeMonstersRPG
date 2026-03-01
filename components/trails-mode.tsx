"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { npcs } from "@/lib/duel-npcs";
import type { DuelNpc } from "@/lib/duel-npcs";
import { getSpriteUrl } from "@/lib/pokemon-data";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronLeft,
  Lock,
  Check,
  Star,
  Trophy,
  Sparkles,
  Crown,
  Swords,
} from "lucide-react";
import { playButtonClick, playBattleMusic } from "@/lib/sounds";

// Pokemon rewards for each stage - Eeveelutions + Legendary Birds
const STAGE_POKEMON_REWARDS = [
  { speciesId: 134, name: "Vaporeon", level: 15, type: "water" },      // Stage 1 - Water
  { speciesId: 135, name: "Jolteon", level: 18, type: "electric" },    // Stage 2 - Electric
  { speciesId: 136, name: "Flareon", level: 21, type: "fire" },        // Stage 3 - Fire
  { speciesId: 196, name: "Espeon", level: 24, type: "psychic" },      // Stage 4 - Psychic
  { speciesId: 197, name: "Umbreon", level: 27, type: "dark" },        // Stage 5 - Dark
  { speciesId: 470, name: "Leafeon", level: 30, type: "grass" },       // Stage 6 - Grass
  { speciesId: 471, name: "Glaceon", level: 33, type: "ice" },         // Stage 7 - Ice
  { speciesId: 144, name: "Articuno", level: 50, type: "legendary" },  // Stage 8 - Legendary Ice
  { speciesId: 145, name: "Zapdos", level: 50, type: "legendary" },    // Stage 9 - Legendary Electric
  { speciesId: 146, name: "Moltres", level: 50, type: "legendary" },   // Stage 10 - Legendary Fire
];

// Stage configuration: NPCs per stage with theme colors
const STAGE_CONFIG = [
  { npcsCount: 5, name: "Trilha da Agua", color: "#3B82F6", gradient: "from-blue-500 to-cyan-400" },
  { npcsCount: 10, name: "Trilha Eletrica", color: "#EAB308", gradient: "from-yellow-400 to-amber-500" },
  { npcsCount: 10, name: "Trilha do Fogo", color: "#EF4444", gradient: "from-red-500 to-orange-500" },
  { npcsCount: 10, name: "Trilha Psiquica", color: "#EC4899", gradient: "from-pink-500 to-purple-500" },
  { npcsCount: 10, name: "Trilha Sombria", color: "#6366F1", gradient: "from-indigo-600 to-purple-800" },
  { npcsCount: 10, name: "Trilha da Natureza", color: "#22C55E", gradient: "from-green-500 to-emerald-400" },
  { npcsCount: 10, name: "Trilha Glacial", color: "#06B6D4", gradient: "from-cyan-400 to-blue-300" },
  { npcsCount: 10, name: "Santuario de Articuno", color: "#60A5FA", gradient: "from-blue-400 to-sky-300", legendary: true },
  { npcsCount: 10, name: "Santuario de Zapdos", color: "#FBBF24", gradient: "from-yellow-400 to-orange-400", legendary: true },
  { npcsCount: 10, name: "Santuario de Moltres", color: "#F97316", gradient: "from-orange-500 to-red-600", legendary: true },
];

// Sort NPCs by difficulty for trail progression
function sortNpcsByDifficulty(npcList: DuelNpc[]): DuelNpc[] {
  const difficultyOrder: Record<string, number> = {
    facil: 1,
    medio: 2,
    dificil: 3,
    elite: 4,
    lendario: 5,
    superboss: 6,
  };

  return [...npcList].sort((a, b) => {
    const diffA = difficultyOrder[a.nivel] || 0;
    const diffB = difficultyOrder[b.nivel] || 0;
    if (diffA !== diffB) return diffA - diffB;
    // Secondary sort by XP reward (lower = easier)
    return a.xp - b.xp;
  });
}

// Build trail stages from sorted NPCs
interface TrailNode {
  type: "npc" | "pokemon";
  npc?: DuelNpc;
  pokemonReward?: { speciesId: number; name: string; level: number; type: string };
  index: number;
  stageIndex: number;
  completed: boolean;
  locked: boolean;
}

interface TrailStage {
  name: string;
  nodes: TrailNode[];
  stageIndex: number;
  pokemonReward: { speciesId: number; name: string; level: number; type: string };
}

function buildTrailStages(sortedNpcs: DuelNpc[], completedNodeIds: Set<string>): TrailStage[] {
  const stages: TrailStage[] = [];
  let npcIndex = 0;
  let globalIndex = 0;

  for (let stageIdx = 0; stageIdx < STAGE_CONFIG.length; stageIdx++) {
    const config = STAGE_CONFIG[stageIdx];
    const pokemonReward = STAGE_POKEMON_REWARDS[stageIdx];
    const nodes: TrailNode[] = [];

    // Get NPCs for this stage
    for (let i = 0; i < config.npcsCount && npcIndex < sortedNpcs.length; i++) {
      const npc = sortedNpcs[npcIndex];
      const nodeId = `stage-${stageIdx}-node-${i}`;
      const isCompleted = completedNodeIds.has(nodeId);

      // Determine if locked: need previous node to be completed
      let isLocked = false;
      if (i === 0) {
        // First node of the stage
        if (stageIdx === 0) {
          // First stage, first node is always unlocked
          isLocked = false;
        } else {
          // Need previous stage's pokemon to be captured
          isLocked = !completedNodeIds.has(`stage-${stageIdx - 1}-pokemon`);
        }
      } else {
        // Need previous node in same stage to be completed
        isLocked = !completedNodeIds.has(`stage-${stageIdx}-node-${i - 1}`);
      }

      // If already completed, never locked
      if (isCompleted) isLocked = false;

      nodes.push({
        type: "npc",
        npc,
        index: globalIndex,
        stageIndex: stageIdx,
        completed: isCompleted,
        locked: isLocked,
      });
      npcIndex++;
      globalIndex++;
    }

    // Add Pokemon capture node at the end of the stage
    const pokemonNodeId = `stage-${stageIdx}-pokemon`;
    const pokemonCompleted = completedNodeIds.has(pokemonNodeId);
    const lastNpcNodeId = `stage-${stageIdx}-node-${nodes.length - 1}`;
    const lastNpcCompleted = completedNodeIds.has(lastNpcNodeId);
    const pokemonLocked = !lastNpcCompleted && !pokemonCompleted;

    nodes.push({
      type: "pokemon",
      pokemonReward,
      index: globalIndex,
      stageIndex: stageIdx,
      completed: pokemonCompleted,
      locked: pokemonLocked,
    });
    globalIndex++;

    stages.push({
      name: config.name,
      nodes,
      stageIndex: stageIdx,
      pokemonReward,
    });
  }

  return stages;
}

// Get color for node based on stage (from config)
function getStageColor(stageIndex: number): string {
  const config = STAGE_CONFIG[stageIndex];
  return config?.color || "#22C55E";
}

// Get gradient for stage
function getStageGradient(stageIndex: number): string {
  const config = STAGE_CONFIG[stageIndex];
  return config?.gradient || "from-green-500 to-emerald-400";
}

// Check if stage is legendary
function isLegendaryStage(stageIndex: number): boolean {
  const config = STAGE_CONFIG[stageIndex] as { legendary?: boolean };
  return config?.legendary || false;
}

// Legacy color array kept for compatibility
const _legacyColors = [
  "#3B82F6", // Blue - Stage 1
  "#EAB308", // Yellow - Stage 2
  "#EF4444", // Red - Stage 3
  "#EC4899", // Pink - Stage 4
  "#6366F1", // Indigo - Stage 5
  "#F97316", // Orange - Stage 10
];

// Get difficulty color
function getDifficultyColor(nivel: string): string {
  const colors: Record<string, string> = {
    facil: "#22C55E",
    medio: "#3B82F6",
    dificil: "#F59E0B",
    elite: "#EF4444",
    lendario: "#8B5CF6",
    superboss: "#EC4899",
  };
  return colors[nivel] || "#6B7280";
}

interface TrailsModeProps {
  onStartDuel: (npc: DuelNpc) => void;
  onStartCapture: (speciesId: number) => void;
  onBack: () => void;
  onNodeStart?: (nodeId: string) => void;
}

export function TrailsMode({ onStartDuel, onStartCapture, onBack, onNodeStart }: TrailsModeProps) {
  const [sortedNpcs] = useState(() => sortNpcsByDifficulty(npcs));
  const [completedNodes, setCompletedNodes] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("pokerpg-trail-progress");
      if (saved) {
        try {
          return new Set(JSON.parse(saved) as string[]);
        } catch {
          return new Set();
        }
      }
    }
    return new Set();
  });
  const [stages, setStages] = useState<TrailStage[]>([]);
  const [selectedNode, setSelectedNode] = useState<TrailNode | null>(null);
  const [showTransition, setShowTransition] = useState(false);
  const [currentStageView, setCurrentStageView] = useState(0);

  // Build stages when component mounts or progress changes
  useEffect(() => {
    setStages(buildTrailStages(sortedNpcs, completedNodes));
  }, [sortedNpcs, completedNodes]);

  // Find the first incomplete stage
  useEffect(() => {
    if (stages.length > 0) {
      const firstIncomplete = stages.findIndex(stage =>
        stage.nodes.some(node => !node.completed && !node.locked)
      );
      if (firstIncomplete >= 0) {
        setCurrentStageView(firstIncomplete);
      }
    }
  }, [stages]);

  // Save progress to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("pokerpg-trail-progress", JSON.stringify([...completedNodes]));
    }
  }, [completedNodes]);

  const handleNodeClick = (node: TrailNode) => {
    if (node.locked || node.completed) return;
    playButtonClick();
    setSelectedNode(node);
  };

  // Get the local index of a node within its stage
  const getLocalNodeIndex = (node: TrailNode): number => {
    const stage = stages[node.stageIndex];
    if (!stage) return 0;
    return stage.nodes.findIndex(n => n.index === node.index);
  };

  const handleStartChallenge = () => {
    if (!selectedNode) return;
    playButtonClick();

    if (selectedNode.type === "npc" && selectedNode.npc) {
      setShowTransition(true);
      playBattleMusic();

      setTimeout(() => {
        // Notify parent about which node is being challenged (DON'T mark completed yet)
        const localIndex = getLocalNodeIndex(selectedNode);
        const nodeId = `stage-${selectedNode.stageIndex}-node-${localIndex}`;
        onNodeStart?.(nodeId);
        onStartDuel(selectedNode.npc!);
        setShowTransition(false);
        setSelectedNode(null);
      }, 3000);
    } else if (selectedNode.type === "pokemon" && selectedNode.pokemonReward) {
      // Notify parent about pokemon node
      const nodeId = `stage-${selectedNode.stageIndex}-pokemon`;
      onNodeStart?.(nodeId);
      onStartCapture(selectedNode.pokemonReward.speciesId);
      setSelectedNode(null);
    }
  };

  // Reload progress from localStorage when component regains focus
  // This ensures we pick up changes made by page.tsx after battle victories
  useEffect(() => {
    const handleFocus = () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("pokerpg-trail-progress");
        if (saved) {
          try {
            const parsed = JSON.parse(saved) as string[];
            setCompletedNodes(new Set(parsed));
          } catch {
            // ignore
          }
        }
      }
    };

    // Also check on mount/re-render
    handleFocus();

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  // Calculate progress
  const totalNodes = stages.reduce((acc, stage) => acc + stage.nodes.length, 0);
  const completedCount = completedNodes.size;
  const progressPercent = totalNodes > 0 ? (completedCount / totalNodes) * 100 : 0;

  // Get current stage
  const currentStage = stages[currentStageView];

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background via-background to-card">
      {/* Transition Animation */}
      <AnimatePresence>
        {showTransition && selectedNode?.npc && (
          <motion.div
            className="fixed inset-0 z-[100] flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="flex-1 flex items-center justify-center relative overflow-hidden"
              style={{ backgroundColor: "#1e3a8a" }}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700" />
              <motion.div
                className="relative z-10 flex flex-col items-center"
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                <div className="w-20 h-20 rounded-full bg-blue-500/30 flex items-center justify-center border-4 border-white shadow-2xl">
                  <Swords className="w-10 h-10 text-white" />
                </div>
                <span className="mt-3 text-white font-bold text-lg tracking-wider">
                  DESAFIO
                </span>
              </motion.div>
            </motion.div>

            <motion.div
              className="absolute left-1/2 top-0 bottom-0 w-4 -ml-2 z-20"
              style={{
                background: `linear-gradient(180deg, ${getStageColor(currentStageView)} 0%, #fbbf24 50%, ${getStageColor(currentStageView)} 100%)`,
                clipPath: "polygon(50% 0%, 100% 10%, 80% 25%, 100% 40%, 70% 55%, 100% 70%, 80% 85%, 100% 100%, 0% 100%, 20% 85%, 0% 70%, 30% 55%, 0% 40%, 20% 25%, 0% 10%)"
              }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            />

            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.7, type: "spring", damping: 10 }}
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center border-4 border-white shadow-2xl"
                style={{ background: `linear-gradient(135deg, ${getStageColor(currentStageView)}, #f59e0b)` }}
              >
                <span className="text-2xl font-black text-white drop-shadow-lg">VS</span>
              </div>
            </motion.div>

            <motion.div
              className="flex-1 flex items-center justify-center relative overflow-hidden"
              style={{ backgroundColor: "#991b1b" }}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
            >
              <div className="absolute inset-0 bg-gradient-to-l from-red-900 to-red-700" />
              <motion.div
                className="relative z-10 flex flex-col items-center"
                initial={{ scale: 0, rotate: 45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                <img
                  src={selectedNode.npc.imagem}
                  alt={selectedNode.npc.nome}
                  className="w-20 h-20 rounded-full border-4 border-white shadow-2xl object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/trainers/player.jpg";
                  }}
                />
                <span className="mt-3 text-white font-bold text-lg tracking-wider">
                  {selectedNode.npc.nome}
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="p-4 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-3">
          <Button
            size="sm"
            variant="ghost"
            onClick={onBack}
            className="text-foreground hover:bg-secondary shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h2 className="font-bold text-foreground flex items-center gap-2">
              <Crown className="w-5 h-5" style={{ color: getStageColor(currentStageView) }} />
              Modo Trilhas
            </h2>
            <p className="text-xs text-muted-foreground">
              {currentStage?.name || "Carregando..."}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-foreground">{completedCount}/{totalNodes}</p>
            <p className="text-[10px] text-muted-foreground">Completo</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${getStageColor(0)}, ${getStageColor(currentStageView)})` }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[9px] text-muted-foreground">{Math.round(progressPercent)}%</span>
            <span className="text-[9px] text-muted-foreground">Nivel {currentStageView + 1}</span>
          </div>
        </div>

        {/* Stage selector */}
        <div className="flex gap-1 mt-3 overflow-x-auto pb-1">
          {stages.map((stage, idx) => {
            const stageCompleted = stage.nodes.every(n => n.completed);
            const hasProgress = stage.nodes.some(n => n.completed);
            return (
              <button
                key={idx}
                onClick={() => setCurrentStageView(idx)}
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${currentStageView === idx
                  ? "ring-2 ring-offset-2 ring-offset-background"
                  : ""
                  }`}
                style={{
                  backgroundColor: stageCompleted
                    ? getStageColor(idx)
                    : hasProgress
                      ? `${getStageColor(idx)}40`
                      : "hsl(var(--secondary))",
                  color: stageCompleted || hasProgress ? "#fff" : "hsl(var(--muted-foreground))",
                  borderColor: getStageColor(idx),
                  ...(currentStageView === idx ? { ringColor: getStageColor(idx) } : {}),
                }}
              >
                {stageCompleted ? <Check className="w-4 h-4" /> : idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Trail Path - Duolingo Style */}
      <ScrollArea className="flex-1">
        <div className="py-6 px-4">
          {/* Pokemon Reward Banner - Enhanced Design */}
          {currentStage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-8 relative overflow-hidden rounded-2xl ${isLegendaryStage(currentStageView) ? "ring-2 ring-yellow-400/50" : ""
                }`}
            >
          {/* Pokemon Reward Banner - Enhanced Design */}
          {currentStage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-8 relative overflow-hidden rounded-2xl ${isLegendaryStage(currentStageView) ? "ring-2 ring-yellow-400/50" : ""
                }`}
            >
              {/* Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${getStageGradient(currentStageView)} opacity-20`}
              />

              {/* Legendary glow effect */}
              {isLegendaryStage(currentStageView) && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-transparent to-yellow-400/20"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}

              <div className="relative p-5 flex items-center gap-4">
                {/* Pokemon Sprite Container */}
                <motion.div
                  className="relative"
                  animate={isLegendaryStage(currentStageView) ? { y: [0, -4, 0] } : {}}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div
                    className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg ${isLegendaryStage(currentStageView) ? "ring-2 ring-yellow-400" : ""
                      }`}
                    style={{
                      background: `linear-gradient(135deg, ${getStageColor(currentStageView)}40, ${getStageColor(currentStageView)}20)`,
                      boxShadow: `0 8px 32px ${getStageColor(currentStageView)}30`
                    }}
                  >
                    <img
                      src={getSpriteUrl(currentStage.pokemonReward.speciesId)}
                      alt={currentStage.pokemonReward.name}
                      width={56}
                      height={56}
                      className="pixelated drop-shadow-lg"
                      crossOrigin="anonymous"
                    />
                  </div>
                  {isLegendaryStage(currentStageView) && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Crown className="w-3.5 h-3.5 text-yellow-900" />
                    </motion.div>
                  )}
                </motion.div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {isLegendaryStage(currentStageView) ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-400 bg-yellow-400/20 px-2 py-0.5 rounded-full">
                        Lendario
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        Premio
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-lg text-foreground truncate">{currentStage.pokemonReward.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${getStageColor(currentStageView)}30`,
                        color: getStageColor(currentStageView)
                      }}
                    >
                      Nv. {currentStage.pokemonReward.level}
                    </span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {currentStage.pokemonReward.type}
                    </span>
                  </div>
                </div>

                {/* Sparkles */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles
                    className="w-8 h-8"
                    style={{ color: isLegendaryStage(currentStageView) ? "#FBBF24" : getStageColor(currentStageView) }}
                  />
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Trail Nodes - Enhanced Duolingo Style */}
          <div className="relative flex flex-col items-center pb-8">
            {/* Smooth S-Curve Path Background - Behind all nodes */}
            <svg
              className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
              style={{ zIndex: 0, width: "200px", height: `${(currentStage?.nodes.length || 1) * 96 + 48}px` }}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id={`pathGradient-${currentStageView}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={getStageColor(currentStageView)} stopOpacity="0.4" />
                  <stop offset="50%" stopColor={getStageColor(currentStageView)} stopOpacity="0.6" />
                  <stop offset="100%" stopColor={getStageColor(currentStageView)} stopOpacity="0.4" />
                </linearGradient>
              </defs>
              {/* Single continuous S-curve path */}
              {currentStage && currentStage.nodes.length > 0 && (
                <path
                  d={(() => {
                    const nodes = currentStage.nodes;
                    const nodeSpacing = 96; // mb-4 = 16px + node height ~80px
                    const centerX = 100;
                    const amplitude = 50; // How far left/right the S curves
                    
                    // Build smooth cubic bezier path
                    let pathD = "";
                    
                    nodes.forEach((_, idx) => {
                      const y = idx * nodeSpacing + 48; // Center of each node
                      const isEven = idx % 2 === 0;
                      const x = isEven ? centerX - amplitude : centerX + amplitude;
                      
                      if (idx === 0) {
                        pathD = `M ${x} ${y}`;
                      } else {
                        const prevY = (idx - 1) * nodeSpacing + 48;
                        const prevIsEven = (idx - 1) % 2 === 0;
                        const prevX = prevIsEven ? centerX - amplitude : centerX + amplitude;
                        
                        // Control points for smooth S-curve
                        const cp1X = prevX;
                        const cp1Y = prevY + nodeSpacing * 0.5;
                        const cp2X = x;
                        const cp2Y = y - nodeSpacing * 0.5;
                        
                        pathD += ` C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${x} ${y}`;
                      }
                    });
                    
                    return pathD;
                  })()}
                  stroke={`url(#pathGradient-${currentStageView})`}
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
              {/* Completed path overlay - solid line over completed sections */}
              {currentStage && currentStage.nodes.length > 0 && (
                <path
                  d={(() => {
                    const nodes = currentStage.nodes;
                    const nodeSpacing = 96;
                    const centerX = 100;
                    const amplitude = 50;
                    
                    let pathD = "";
                    let lastCompletedIdx = -1;
                    
                    // Find last completed node
                    nodes.forEach((_, idx) => {
                      if (completedNodes.has(`stage-${currentStageView}-node-${idx}`) || 
                          (idx === nodes.length - 1 && completedNodes.has(`stage-${currentStageView}-pokemon`))) {
                        lastCompletedIdx = idx;
                      }
                    });
                    
                    if (lastCompletedIdx < 0) return "";
                    
                    nodes.forEach((_, idx) => {
                      if (idx > lastCompletedIdx) return;
                      
                      const y = idx * nodeSpacing + 48;
                      const isEven = idx % 2 === 0;
                      const x = isEven ? centerX - amplitude : centerX + amplitude;
                      
                      if (idx === 0) {
                        pathD = `M ${x} ${y}`;
                      } else {
                        const prevY = (idx - 1) * nodeSpacing + 48;
                        const prevIsEven = (idx - 1) % 2 === 0;
                        const prevX = prevIsEven ? centerX - amplitude : centerX + amplitude;
                        
                        const cp1X = prevX;
                        const cp1Y = prevY + nodeSpacing * 0.5;
                        const cp2X = x;
                        const cp2Y = y - nodeSpacing * 0.5;
                        
                        pathD += ` C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${x} ${y}`;
                      }
                    });
                    
                    return pathD;
                  })()}
                  stroke={getStageColor(currentStageView)}
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ filter: `drop-shadow(0 0 8px ${getStageColor(currentStageView)}60)` }}
                />
              )}
            </svg>

            {currentStage?.nodes.map((node, idx) => {
              // Zigzag pattern for Duolingo style - more pronounced
              const isEven = idx % 2 === 0;
              const offset = isEven ? -50 : 50;
              const isPokemonNode = node.type === "pokemon";
              const isAvailable = !node.locked && !node.completed;

              return (
                <motion.div
                  key={idx}
                  className="relative z-10 mb-4"
                  style={{ marginLeft: offset }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.06, type: "spring", damping: 15 }}
                >
                  {/* Glow effect for available nodes */}
                  {isAvailable && (
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `radial-gradient(circle, ${getStageColor(currentStageView)}40 0%, transparent 70%)`,
                      }}
                      animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.2, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}

                  {/* Node Circle */}
                  <motion.button
                    onClick={() => handleNodeClick(node)}
                    disabled={node.locked}
                    animate={isAvailable ? { y: [0, -8, 0] } : {}}
                    transition={isAvailable ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" } : {}}
                    className={`relative flex items-center justify-center transition-all ${isPokemonNode ? "w-24 h-24" : "w-20 h-20"
                      } rounded-full ${node.locked
                        ? "opacity-40 cursor-not-allowed grayscale"
                        : node.completed
                          ? "cursor-default"
                          : "cursor-pointer hover:scale-110 active:scale-95"
                      }`}
                    style={{
                      background: node.completed
                        ? `linear-gradient(135deg, ${getStageColor(currentStageView)}, ${getStageColor(currentStageView)}cc)`
                        : node.locked
                          ? "hsl(var(--secondary))"
                          : isPokemonNode
                            ? `linear-gradient(135deg, ${getStageColor(currentStageView)}50, ${getStageColor(currentStageView)}20)`
                            : `linear-gradient(135deg, ${getStageColor(currentStageView)}40, ${getStageColor(currentStageView)}15)`,
                      border: `4px solid ${node.completed
                        ? "#fff"
                        : node.locked
                          ? "hsl(var(--border))"
                          : getStageColor(currentStageView)
                        }`,
                      boxShadow: node.completed
                        ? `0 6px 24px ${getStageColor(currentStageView)}60, inset 0 -4px 0 ${getStageColor(currentStageView)}80`
                        : node.locked
                          ? "inset 0 -3px 0 hsl(var(--border))"
                          : `0 6px 20px ${getStageColor(currentStageView)}40, inset 0 -4px 0 ${getStageColor(currentStageView)}50`,
                    }}
                  >
                    {node.locked ? (
                      <Lock className="w-7 h-7 text-muted-foreground" />
                    ) : node.completed ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 10 }}
                      >
                        <Check className="w-10 h-10 text-white drop-shadow-lg" />
                      </motion.div>
                    ) : node.type === "pokemon" ? (
                      <motion.img
                        src={getSpriteUrl(node.pokemonReward!.speciesId)}
                        alt={node.pokemonReward!.name}
                        width={56}
                        height={56}
                        className="pixelated drop-shadow-lg"
                        crossOrigin="anonymous"
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    ) : (
                      <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-white/30">
                        <img
                          src={node.npc!.imagem}
                          alt={node.npc!.nome}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/images/trainers/player.jpg";
                          }}
                        />
                      </div>
                    )}

                    {/* Node Badge - Number or Star */}
                    {isAvailable && (
                      <motion.div
                        className="absolute -top-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg"
                        style={{
                          background: isPokemonNode
                            ? "linear-gradient(135deg, #FBBF24, #F59E0B)"
                            : `linear-gradient(135deg, ${getStageColor(currentStageView)}, ${getStageColor(currentStageView)}cc)`
                        }}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        {isPokemonNode ? (
                          <Crown className="w-4 h-4" />
                        ) : (
                          idx + 1
                        )}
                      </motion.div>
                    )}

                    {/* Stars for completed */}
                    {node.completed && (
                      <motion.div
                        className="absolute -bottom-3 flex gap-0.5"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {[1, 2, 3].map((s) => (
                          <motion.div
                            key={s}
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.1 * s }}
                          >
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 drop-shadow" />
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </motion.button>

                  {/* Node Label */}
                  <div
                    className={`mt-3 text-center ${isEven ? "text-left -ml-2" : "text-right -mr-2"
                      }`}
                  >
                    {node.type === "npc" ? (
                      <>
                        <p className="text-xs font-medium text-foreground truncate max-w-[80px]">
                          {node.npc!.nome}
                        </p>
                        <p
                          className="text-[10px] font-bold uppercase"
                          style={{ color: getDifficultyColor(node.npc!.nivel) }}
                        >
                          {node.npc!.nivel}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-xs font-medium text-foreground">
                          {node.pokemonReward!.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">Capturar</p>
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </ScrollArea>

      {/* Selected Node Modal - Enhanced */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            className="h-screen flex items-center justify-center "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedNode(null)}
          >
            {/* Backdrop with blur */}
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="relative w-full max-w-md bg-gradient-to-b from-card to-background rounded-t-3xl overflow-hidden flex flex-col max-h-[90vh]"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top gradient accent */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ background: `linear-gradient(90deg, ${getStageColor(currentStageView)}, ${getStageColor(currentStageView)}80)` }}
              />

              {/* Handle bar */}
              <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
                <div className="w-12 h-1.5 rounded-full bg-border" />
              </div>

              {/* Scrollable Content */}
              <ScrollArea className="flex-1 overflow-hidden">
                <div className="p-6 pt-2">
                  {selectedNode.type === "npc" && selectedNode.npc && (
                    <>
                      <div className="flex items-center gap-4 mb-5">
                        <div className="relative">
                          <div
                            className="absolute inset-0 rounded-full opacity-30 blur-md"
                            style={{ backgroundColor: getDifficultyColor(selectedNode.npc.nivel) }}
                          />
                          <img
                            src={selectedNode.npc.imagem}
                            alt={selectedNode.npc.nome}
                            className="relative w-20 h-20 rounded-full object-cover ring-4"
                            style={{
                              ringColor: getDifficultyColor(selectedNode.npc.nivel),
                              boxShadow: `0 4px 20px ${getDifficultyColor(selectedNode.npc.nivel)}40`
                            }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/images/trainers/player.jpg";
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-xl text-foreground mb-1">
                            {selectedNode.npc.nome}
                          </h3>
                          <span
                            className="inline-block text-xs font-bold uppercase px-3 py-1 rounded-full"
                            style={{
                              backgroundColor: `${getDifficultyColor(selectedNode.npc.nivel)}20`,
                              color: getDifficultyColor(selectedNode.npc.nivel)
                            }}
                          >
                            {selectedNode.npc.nivel}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground italic mb-5 pl-4 border-l-2 border-border">
                        "{selectedNode.npc.fraseDesafio}"
                      </p>

                      <div className="grid grid-cols-3 gap-3 mb-5">
                        <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/5 rounded-xl p-3 text-center border border-amber-500/20">
                          <p className="text-xl font-bold text-amber-400">${selectedNode.npc.recompensa}</p>
                          <p className="text-[10px] text-amber-400/60 font-medium">DINHEIRO</p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/5 rounded-xl p-3 text-center border border-blue-500/20">
                          <p className="text-xl font-bold text-blue-400">{selectedNode.npc.stardust}</p>
                          <p className="text-[10px] text-blue-400/60 font-medium">STARDUST</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-500/20 to-green-600/5 rounded-xl p-3 text-center border border-green-500/20">
                          <p className="text-xl font-bold text-green-400">{selectedNode.npc.xp}</p>
                          <p className="text-[10px] text-green-400/60 font-medium">XP</p>
                        </div>
                      </div>

                      <div className="pb-5">
                        <p className="text-xs text-muted-foreground mb-3 font-medium">EQUIPE ADVERSARIA ({selectedNode.npc.time.length})</p>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {selectedNode.npc.time.map((p, i) => (
                            <div
                              key={i}
                              className="flex-shrink-0 flex flex-col items-center bg-secondary/30 rounded-xl p-2"
                            >
                              <img
                                src={getSpriteUrl(p.speciesId)}
                                alt={p.nome}
                                width={44}
                                height={44}
                                className="pixelated"
                                crossOrigin="anonymous"
                              />
                              <p className="text-[10px] text-muted-foreground font-medium mt-1">Lv.{p.level}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {selectedNode.type === "pokemon" && selectedNode.pokemonReward && (
                    <>
                      <div className="flex flex-col items-center mb-5">
                        <motion.div
                          className="relative"
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <div
                            className="absolute inset-0 rounded-full blur-xl opacity-50"
                            style={{ backgroundColor: getStageColor(currentStageView) }}
                          />
                          <div
                            className={`relative w-28 h-28 rounded-full flex items-center justify-center ${isLegendaryStage(selectedNode.stageIndex) ? "ring-4 ring-yellow-400" : ""
                              }`}
                            style={{
                              background: `linear-gradient(135deg, ${getStageColor(currentStageView)}50, ${getStageColor(currentStageView)}20)`,
                              boxShadow: `0 8px 32px ${getStageColor(currentStageView)}40`
                            }}
                          >
                            <img
                              src={getSpriteUrl(selectedNode.pokemonReward.speciesId)}
                              alt={selectedNode.pokemonReward.name}
                              width={80}
                              height={80}
                              className="pixelated drop-shadow-lg"
                              crossOrigin="anonymous"
                            />
                          </div>
                          {isLegendaryStage(selectedNode.stageIndex) && (
                            <motion.div
                              className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center"
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <Crown className="w-5 h-5 text-yellow-900" />
                            </motion.div>
                          )}
                        </motion.div>
                        <h3 className="font-bold text-2xl text-foreground mt-4">
                          {selectedNode.pokemonReward.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          <span
                            className="text-xs font-medium px-3 py-1 rounded-full"
                            style={{
                              backgroundColor: `${getStageColor(currentStageView)}30`,
                              color: getStageColor(currentStageView)
                            }}
                          >
                            Nivel {selectedNode.pokemonReward.level}
                          </span>
                          {isLegendaryStage(selectedNode.stageIndex) && (
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-400">
                              LENDARIO
                            </span>
                          )}
                        </div>
                      </div>

                      <div
                        className="p-5 rounded-2xl mb-5 text-center border"
                        style={{
                          backgroundColor: `${getStageColor(currentStageView)}10`,
                          borderColor: `${getStageColor(currentStageView)}30`
                        }}
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="w-10 h-10 mx-auto mb-3" style={{ color: getStageColor(currentStageView) }} />
                        </motion.div>
                        <p className="text-sm text-foreground font-medium">
                          {isLegendaryStage(selectedNode.stageIndex)
                            ? "Um Pokemon lendario aguarda! Prepare sua melhor equipe para esta captura epica!"
                            : "Parabens! Voce completou todos os desafios desta fase. Capture seu premio!"
                          }
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </ScrollArea>

              {/* Button - Fixed at Bottom */}
              <div className="p-6 pt-4 border-t border-border bg-card flex-shrink-0">
                <Button
                  onClick={handleStartChallenge}
                  className="w-full h-14 text-lg font-bold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: `linear-gradient(135deg, ${getStageColor(currentStageView)}, ${getStageColor(currentStageView)}cc)`,
                    boxShadow: `0 8px 24px ${getStageColor(currentStageView)}40`
                  }}
                >
                  {selectedNode.type === "npc" ? (
                    <>
                      <Swords className="w-6 h-6 mr-2" />
                      BATALHAR!
                    </>
                  ) : (
                    <>
                      <Star className="w-6 h-6 mr-2" />
                      CAPTURAR!
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

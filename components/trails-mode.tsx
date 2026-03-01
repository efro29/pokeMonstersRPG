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

// Pokemon rewards for each stage (every 5-15 NPCs)
const STAGE_POKEMON_REWARDS = [
  { speciesId: 447, name: "Riolu", level: 10 },      // Stage 1 (5 NPCs)
  { speciesId: 37, name: "Vulpix", level: 12 },     // Stage 2 (10 NPCs)
  { speciesId: 54, name: "Psyduck", level: 14 },    // Stage 3 (10 NPCs)
  { speciesId: 133, name: "Eevee", level: 16 },     // Stage 4 (10 NPCs)
  { speciesId: 147, name: "Dratini", level: 18 },   // Stage 5 (10 NPCs)
  { speciesId: 123, name: "Scyther", level: 20 },   // Stage 6 (10 NPCs)
  { speciesId: 137, name: "Porygon", level: 22 },   // Stage 7 (10 NPCs)
  { speciesId: 142, name: "Aerodactyl", level: 24 }, // Stage 8 (10 NPCs)
  { speciesId: 131, name: "Lapras", level: 26 },    // Stage 9 (10 NPCs)
  { speciesId: 143, name: "Snorlax", level: 28 },   // Stage 10 (10 NPCs)
];

// Stage configuration: NPCs per stage
const STAGE_CONFIG = [
  { npcsCount: 5, name: "Fase 1 - Inicio da Jornada" },
  { npcsCount: 10, name: "Fase 2 - Primeiros Desafios" },
  { npcsCount: 10, name: "Fase 3 - Treinadores Locais" },
  { npcsCount: 10, name: "Fase 4 - Campeonato Junior" },
  { npcsCount: 10, name: "Fase 5 - Liga Regional" },
  { npcsCount: 10, name: "Fase 6 - Elite Trainer" },
  { npcsCount: 10, name: "Fase 7 - Desafio dos Mestres" },
  { npcsCount: 10, name: "Fase 8 - Campeonato Nacional" },
  { npcsCount: 10, name: "Fase 9 - Liga dos Campeoes" },
  { npcsCount: 10, name: "Fase 10 - Elite Four" },
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
  pokemonReward?: { speciesId: number; name: string; level: number };
  index: number;
  stageIndex: number;
  completed: boolean;
  locked: boolean;
}

interface TrailStage {
  name: string;
  nodes: TrailNode[];
  stageIndex: number;
  pokemonReward: { speciesId: number; name: string; level: number };
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

// Get color for node based on stage
function getStageColor(stageIndex: number): string {
  const colors = [
    "#22C55E", // Green - Stage 1
    "#3B82F6", // Blue - Stage 2
    "#8B5CF6", // Purple - Stage 3
    "#F59E0B", // Amber - Stage 4
    "#EC4899", // Pink - Stage 5
    "#14B8A6", // Teal - Stage 6
    "#F97316", // Orange - Stage 7
    "#6366F1", // Indigo - Stage 8
    "#EF4444", // Red - Stage 9
    "#FBBF24", // Gold - Stage 10
  ];
  return colors[stageIndex % colors.length];
}

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
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  currentStageView === idx
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
        <div className="py-8 px-4">
          {/* Pokemon Reward Banner */}
          {currentStage && (
            <div
              className="mb-6 p-4 rounded-xl border-2 flex items-center gap-4"
              style={{
                backgroundColor: `${getStageColor(currentStageView)}15`,
                borderColor: `${getStageColor(currentStageView)}50`,
              }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${getStageColor(currentStageView)}30` }}
              >
                <img
                  src={getSpriteUrl(currentStage.pokemonReward.speciesId)}
                  alt={currentStage.pokemonReward.name}
                  width={48}
                  height={48}
                  className="pixelated"
                  crossOrigin="anonymous"
                />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Premio da Fase</p>
                <p className="font-bold text-foreground">{currentStage.pokemonReward.name}</p>
                <p className="text-xs text-muted-foreground">Nivel {currentStage.pokemonReward.level}</p>
              </div>
              <Sparkles className="w-6 h-6" style={{ color: getStageColor(currentStageView) }} />
            </div>
          )}

          {/* Trail Nodes */}
          <div className="relative flex flex-col items-center">
            {/* Connecting Line */}
            <div
              className="absolute top-0 bottom-0 w-1 rounded-full opacity-30"
              style={{ backgroundColor: getStageColor(currentStageView) }}
            />

            {currentStage?.nodes.map((node, idx) => {
              // Zigzag pattern for Duolingo style
              const isEven = idx % 2 === 0;
              const offset = isEven ? -40 : 40;

              return (
                <motion.div
                  key={idx}
                  className="relative z-10 mb-6"
                  style={{ marginLeft: offset }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  {/* Node Circle */}
                  <motion.button
                    onClick={() => handleNodeClick(node)}
                    disabled={node.locked}
                    animate={
                      !node.locked && !node.completed
                        ? { y: [0, -6, 0] }
                        : {}
                    }
                    transition={
                      !node.locked && !node.completed
                        ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                        : {}
                    }
                    className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                      node.locked
                        ? "opacity-50 cursor-not-allowed"
                        : node.completed
                        ? "cursor-default"
                        : "cursor-pointer hover:scale-110 active:scale-95"
                    }`}
                    style={{
                      backgroundColor: node.completed
                        ? getStageColor(currentStageView)
                        : node.locked
                        ? "hsl(var(--secondary))"
                        : `${getStageColor(currentStageView)}30`,
                      border: `3px solid ${
                        node.completed
                          ? getStageColor(currentStageView)
                          : node.locked
                          ? "hsl(var(--border))"
                          : getStageColor(currentStageView)
                      }`,
                      boxShadow: node.completed
                        ? `0 4px 20px ${getStageColor(currentStageView)}50`
                        : node.locked
                        ? "none"
                        : `0 4px 12px ${getStageColor(currentStageView)}30, 0 0 0 ${!node.locked && !node.completed ? "4px" : "0"} ${getStageColor(currentStageView)}20`,
                    }}
                  >
                    {node.locked ? (
                      <Lock className="w-6 h-6 text-muted-foreground" />
                    ) : node.completed ? (
                      <Check className="w-8 h-8 text-white" />
                    ) : node.type === "pokemon" ? (
                      <img
                        src={getSpriteUrl(node.pokemonReward!.speciesId)}
                        alt={node.pokemonReward!.name}
                        width={48}
                        height={48}
                        className="pixelated"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <img
                        src={node.npc!.imagem}
                        alt={node.npc!.nome}
                        className="w-14 h-14 rounded-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/images/trainers/player.jpg";
                        }}
                      />
                    )}

                    {/* Node Badge */}
                    {!node.locked && !node.completed && (
                      <div
                        className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: getStageColor(currentStageView) }}
                      >
                        {node.type === "pokemon" ? (
                          <Star className="w-3 h-3" />
                        ) : (
                          idx + 1
                        )}
                      </div>
                    )}

                    {/* Stars for completed */}
                    {node.completed && (
                      <div className="absolute -bottom-2 flex gap-0.5">
                        {[1, 2, 3].map((s) => (
                          <Star
                            key={s}
                            className="w-3 h-3 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    )}
                  </motion.button>

                  {/* Node Label */}
                  <div
                    className={`mt-3 text-center ${
                      isEven ? "text-left -ml-2" : "text-right -mr-2"
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

      {/* Selected Node Modal */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedNode(null)}
          >
            <motion.div
              className="w-full max-w-md bg-card rounded-t-3xl p-6 border-t border-border"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {selectedNode.type === "npc" && selectedNode.npc && (
                <>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={selectedNode.npc.imagem}
                      alt={selectedNode.npc.nome}
                      className="w-16 h-16 rounded-full object-cover border-2"
                      style={{ borderColor: getDifficultyColor(selectedNode.npc.nivel) }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/trainers/player.jpg";
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-foreground">
                        {selectedNode.npc.nome}
                      </h3>
                      <p
                        className="text-sm font-medium"
                        style={{ color: getDifficultyColor(selectedNode.npc.nivel) }}
                      >
                        {selectedNode.npc.nivel.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground italic mb-4">
                    "{selectedNode.npc.fraseDesafio}"
                  </p>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-secondary/50 rounded-lg p-3 text-center">
                      <p className="text-lg font-bold text-amber-400">${selectedNode.npc.recompensa}</p>
                      <p className="text-[10px] text-muted-foreground">Dinheiro</p>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-3 text-center">
                      <p className="text-lg font-bold text-blue-400">{selectedNode.npc.stardust}</p>
                      <p className="text-[10px] text-muted-foreground">Stardust</p>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-3 text-center">
                      <p className="text-lg font-bold text-green-400">{selectedNode.npc.xp}</p>
                      <p className="text-[10px] text-muted-foreground">XP</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground mb-2">Equipe ({selectedNode.npc.time.length} Pokemon)</p>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {selectedNode.npc.time.map((p, i) => (
                        <div key={i} className="flex-shrink-0 flex flex-col items-center">
                          <img
                            src={getSpriteUrl(p.speciesId)}
                            alt={p.nome}
                            width={40}
                            height={40}
                            className="pixelated"
                            crossOrigin="anonymous"
                          />
                          <p className="text-[9px] text-muted-foreground">Lv.{p.level}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {selectedNode.type === "pokemon" && selectedNode.pokemonReward && (
                <>
                  <div className="flex flex-col items-center mb-4">
                    <div
                      className="w-24 h-24 rounded-full flex items-center justify-center mb-3"
                      style={{ backgroundColor: `${getStageColor(currentStageView)}30` }}
                    >
                      <img
                        src={getSpriteUrl(selectedNode.pokemonReward.speciesId)}
                        alt={selectedNode.pokemonReward.name}
                        width={72}
                        height={72}
                        className="pixelated"
                        crossOrigin="anonymous"
                      />
                    </div>
                    <h3 className="font-bold text-xl text-foreground">
                      {selectedNode.pokemonReward.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Nivel {selectedNode.pokemonReward.level}
                    </p>
                  </div>

                  <div
                    className="p-4 rounded-xl mb-4 text-center"
                    style={{ backgroundColor: `${getStageColor(currentStageView)}15` }}
                  >
                    <Sparkles className="w-8 h-8 mx-auto mb-2" style={{ color: getStageColor(currentStageView) }} />
                    <p className="text-sm text-foreground">
                      Parabens! Voce completou todos os desafios desta fase.
                      Capture seu premio!
                    </p>
                  </div>
                </>
              )}

              <Button
                onClick={handleStartChallenge}
                className="w-full h-14 text-lg font-bold text-white"
                style={{
                  background: `linear-gradient(135deg, ${getStageColor(currentStageView)}, ${getStageColor((currentStageView + 1) % 10)})`,
                }}
              >
                {selectedNode.type === "npc" ? (
                  <>
                    <Swords className="w-5 h-5 mr-2" />
                    BATALHAR!
                  </>
                ) : (
                  <>
                    <Star className="w-5 h-5 mr-2" />
                    CAPTURAR!
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
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
  const pendingNodeRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  // Scroll to pending node when stages load
  useEffect(() => {
    if (stages.length > 0 && pendingNodeRef.current) {
      setTimeout(() => {
        pendingNodeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
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
  style={{ backgroundColor: "#450a0a" }} // Vermelho bem escuro para contraste
  initial={{ x: "100%", filter: "brightness(2) contrast(1.2)" }}
  animate={{ x: 0, filter: "brightness(1) contrast(1)" }}
  transition={{ type: "spring", damping: 15, stiffness: 120 }}
>
  {/* 1. FUNDO DINÂMICO */}
  <div className="absolute inset-0 bg-gradient-to-bl from-red-900 via-red-950 to-black" />
  
  {/* Vinheta de foco (Escurece as bordas) */}
  <div className="absolute inset-0 bg-[radial-gradient(circle,_transparent_30%,_rgba(0,0,0,0.8)_100%)] z-1" />

  {/* 2. LINHAS DE VELOCIDADE ÉPICAS (Speed Lines) */}
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {[...Array(25)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute bg-gradient-to-r from-transparent via-white/40 to-transparent"
        style={{
          height: Math.random() * 4 + 1 + 'px', // Linhas mais grossas e finas
          width: Math.random() * 300 + 100 + 'px',
          top: Math.random() * 100 + '%',
          left: '-20%',
          skewX: -20, // Inclinação para dar sensação de corte
        }}
        animate={{
          x: ['-20vw', '120vw'],
          opacity: [0, 0.8, 0],
        }}
        transition={{
          duration: Math.random() * 0.4 + 0.2, // Muito rápido
          repeat: Infinity,
          ease: "easeIn",
          delay: Math.random() * 1,
        }}
      />
    ))}
  </div>

            {/* 3. CONTEÚDO DO PERSONAGEM COM AURA */}
            <motion.div
              className="relative z-10 flex flex-col items-center"
              initial={{ scale: 2, opacity: 0, rotate: 10 }} // Entra "esmagando" a tela
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", duration: 0.8 }}
            >
              <div className="relative group">
                {/* Aura de Energia Pulsante (Atrás da imagem) */}
                <motion.div 
                  className="absolute -inset-4 rounded-full bg-red-600/40 blur-2xl z-0"
                  animate={{ 
                    scale: [1, 1.5, 1.2],
                    opacity: [0.3, 0.7, 0.3],
                    rotate: [0, 180, 360] 
                  }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                />
                
                {/* Brilho de "Impacto" */}
                <motion.div 
                  className="absolute -inset-1 rounded-full bg-white blur-md z-0"
                  initial={{ opacity: 1, scale: 2 }}
                  animate={{ opacity: 0, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                />

                <img
                style={{width:900}}
                  src={selectedNode.npc.imagem}
                  alt={selectedNode.npc.nome}
                  className="relative   z-10"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/trainers/player.jpg";
                  }}
                />
              </div>

              {/* NOME COM SOMBRA ÉPICA */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col items-center"
              >
                <span className="mt-4 text-white font-black text-2xl tracking-tighter uppercase italic drop-shadow-[0_2px_10px_rgba(255,255,255,0.5)]">
                  {selectedNode.npc.nome}
                </span>
                <div className="h-1 w-full bg-gradient-to-r from-transparent via-red-500 to-transparent mt-1" />
            
              </motion.div>
            </motion.div>

            {/* Efeito de Flash Rápido na entrada */}
            <motion.div 
              className="absolute inset-0 bg-white z-50 pointer-events-none"
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Compacto */}
      <div className="p-3 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playButtonClick();
              onBack();
            }}
            className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors shrink-0"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-base text-foreground flex items-center gap-2">
              <Trophy className="w-4 h-4 text-primary" />
              Modo Trilhas
            </h2>
            <p className="text-[10px] text-muted-foreground">
              {completedCount}/{totalNodes} desafios completos
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-primary">{Math.round(progressPercent)}%</p>
          </div>
        </div>
      </div>

      {/* Trail Path - Todas as fases em lista continua estilo Duolingo */}
<ScrollArea className="flex-1 bg-slate-950 overflow-hidden" ref={scrollContainerRef}>
  {/* Overlay de Scanlines Global para a trilha */}
  <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,2px_100%]" />

  <div className="py-8 px-6 relative">
    {stages.map((stage, stageIdx) => {
      const stageCompleted = stage.nodes.every(n => n.completed);
      const stageColor = getStageColor(stageIdx);

      return (
        <div key={stageIdx} className="mb-12 relative">
          {/* Header da Fase - Estilo Terminal */}
          <div className="relative mb-8 group">
            <div 
              className="absolute inset-0 opacity-20 blur-sm transition-opacity group-hover:opacity-40" 
              style={{ backgroundColor: stageColor }} 
            />
            <div 
              className="relative p-3 border-l-4 bg-slate-900/80 backdrop-blur-md flex items-center gap-4"
              style={{ borderColor: stageColor }}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-slate-800 flex items-center justify-center border border-white/10"
                     style={{ clipPath: "polygon(25% 0%, 100% 0%, 100% 75%, 75% 100%, 0% 100%, 0% 25%)" }}>
                  <img src={getSpriteUrl(stage.pokemonReward.speciesId)} className="w-10 h-10 pixelated" crossOrigin="anonymous" />
                </div>
                {isLegendaryStage(stageIdx) && <Crown className="absolute -top-2 -left-2 w-4 h-4 text-yellow-400 drop-shadow-md" />}
              </div>

              <div className="flex-1">
                <h3 className="font-black text-xs uppercase tracking-[0.2em] text-white/50 leading-none mb-1">Sector {stageIdx + 1}</h3>
                <h2 className="font-black text-base text-white uppercase italic tracking-tighter leading-none">
                  {stage.name}
                </h2>
              </div>
              
              <div className="text-right">
                <p className="text-[9px] font-mono text-white/40 uppercase">Status</p>
                <p className="text-xs font-black font-mono" style={{ color: stageColor }}>
                   {stageCompleted ? "CLEARED" : "INFILTRATING"}
                </p>
              </div>
            </div>
          </div>

          {/* Trilha de Nodes */}
          <div className="relative flex flex-col items-center min-h-[400px]">
            {/* SVG de Conexão entre nodes (O "Fio" do sistema) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
               {/* Aqui você pode renderizar linhas ligando o node atual ao próximo */}
            </svg>

            {/* Container de Conexões de Dados */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
              <defs>
                {/* Gradiente para a linha de energia */}
                <linearGradient id={`lineGradient-${stageIdx}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={stageColor} stopOpacity="0.8" />
                  <stop offset="100%" stopColor={stageColor} stopOpacity="0.2" />
                </linearGradient>
              </defs>
              
              {stage.nodes.map((_, idx) => {
                if (idx === stage.nodes.length - 1) return null;
                
                // Cálculo das posições baseado no seu offset de 50px
                const isEven = idx % 2 === 0;
                const nextIsEven = (idx + 1) % 2 === 0;
                
                // Centralizando os pontos (considerando o centro dos botões de 64px/w-16)
                const x1 = isEven ? "calc(50% - 50px)" : "calc(50% + 50px)";
                const x2 = nextIsEven ? "calc(50% - 50px)" : "calc(50% + 50px)";
                
                // O gap entre nodes é de 32px (mb-8) + altura do node (64px) = ~96px por node
                const y1 = idx * 96 + 32; 
                const y2 = (idx + 1) * 96 + 32;

                return (
                  <g key={`line-${idx}`}>
                    {/* Linha de "Sombra" Glow */}
                    <line
                      x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke={stageColor}
                      strokeWidth="6"
                      strokeOpacity="0.1"
                      strokeLinecap="round"
                      className="blur-sm"
                    />
                    {/* Linha de Dados Principal */}
                    <line
                      x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke={`url(#lineGradient-${stageIdx})`}
                      strokeWidth="2"
                      strokeDasharray={stage.nodes[idx+1].locked ? "4 4" : "0"} // Pontilhado se estiver travado
                      className={!stage.nodes[idx+1].locked ? "animate-pulse" : "opacity-30"}
                    />
                  </g>
                );
              })}
            </svg>

            {stage.nodes.map((node, idx) => {
              const isEven = idx % 2 === 0;
              const isAvailable = !node.locked && !node.completed;
              const nodeColor = node.completed ? stageColor : (node.locked ? '#334155' : stageColor);

              return (
                <div 
                  key={idx} 
                  className="relative z-10 mb-8 flex flex-col items-center"
                  style={{ transform: `translateX(${isEven ? '-50px' : '50px'})` }}
                >
                  <motion.button
                    whileHover={!node.locked ? { scale: 1.1, rotate: 5 } : {}}
                    whileTap={!node.locked ? { scale: 0.9 } : {}}
                    onClick={() => { setCurrentStageView(stageIdx); handleNodeClick(node); }}
                    disabled={node.locked}
                    className={`relative w-16 h-16 flex items-center justify-center transition-all`}
                  >
                    {/* Background do Node com Clip-Path de Octógono */}
                    <div 
                      className="absolute inset-0 transition-colors duration-500"
                      style={{ 
                        backgroundColor: node.locked ? '#1e293b' : `${nodeColor}${node.completed ? '' : '30'}`,
                        clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
                        border: `2px solid ${node.completed ? '#fff' : nodeColor}`
                      }} 
                    />

                    {/* Conteúdo do Node */}
                    <div className="relative z-10">
                      {node.locked ? (
                        <Lock className="w-5 h-5 text-slate-600" />
                      ) : node.completed ? (
                        <Check className="w-8 h-8 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                      ) : (
                         <div className="relative">
                            <img 
                              src={node.type === "pokemon" ? getSpriteUrl(node.pokemonReward!.speciesId) : node.npc!.imagem} 
                              className={`w-10 h-10 object-cover ${node.type === "pokemon" ? 'pixelated' : 'rounded-full border border-white/20'}`}
                            />
                            {/* Efeito de glitch/scanline no node ativo */}
                            {isAvailable && <div className="absolute inset-0 bg-cyan-500/20 animate-pulse" />}
                         </div>
                      )}
                    </div>

                    {/* Ring de Ativo */}
                    {isAvailable && (
                      <div 
                        className="absolute inset-[-8px] border-2 border-dashed rounded-full animate-[spin_8s_linear_infinite] opacity-40"
                        style={{ borderColor: stageColor }}
                      />
                    )}
                  </motion.button>

                  {/* Label Tático */}
                  <div className={`mt-2 font-mono uppercase tracking-tighter ${isEven ? 'text-left' : 'text-right'}`}>
                    <p className="text-[10px] font-black text-white leading-none">
                      {node.type === "pokemon" ? node.pokemonReward!.name : node.npc!.nome}
                    </p>
                    <p className="text-[8px] opacity-50 font-bold" style={{ color: nodeColor }}>
                      {node.completed ? "Mission Success" : node.locked ? "Signal Encrypted" : "Ready to Breach"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    })}
  </div>
</ScrollArea>


      {/* Selected Node Modal - Enhanced */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-2"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedNode(null)}
          >
            <motion.div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />

            <motion.div
              className="relative w-full max-w-sm bg-slate-900 border border-cyan-500/30 flex flex-col max-h-[80vh] z-50 shadow-2xl"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% 95%, 95% 100%, 0 100%)" }}
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                  {selectedNode.type === "npc" && selectedNode.npc && (
                    <>
                      {/* Header Compacto */}
                      <div className="flex gap-3 items-center">
                        <div className="relative shrink-0 w-16 h-16 bg-slate-800 border-l-2 border-cyan-500 overflow-hidden">
                          <img
                            src={selectedNode.npc.imagem}
                            className="w-full h-full object-cover  hover:grayscale-0 transition-all"
                            onError={(e) => { (e.target as HTMLImageElement).src = "/images/trainers/player.jpg"; }}
                          />
                          <div className="absolute bottom-0 right-0 bg-cyan-500 text-[8px] px-1 font-black text-slate-900">
                            LV.{selectedNode.npc.nivel}
                          </div>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[8px] font-black text-cyan-500 uppercase tracking-widest leading-none">Target Identified</p>
                          <h3 className="font-black text-lg text-white italic tracking-tighter truncate uppercase leading-tight">
                            {selectedNode.npc.nome}
                          </h3>
                        </div>
                      </div>

                      {/* Recompensas em Linha Única */}
                      <div className="grid grid-cols-3 gap-1.5 py-2 border-y border-white/5">
                        {[
                          { val: `$${selectedNode.npc.recompensa}`, color: "text-amber-400" },
                          { val: selectedNode.npc.stardust, color: "text-blue-400" },
                          { val: selectedNode.npc.xp, color: "text-emerald-400" }
                        ].map((item, i) => (
                          <div key={i} className="bg-white/5 p-1 text-center">
                            <p className={`text-xs font-black font-mono ${item.color}`}>{item.val}</p>
                          </div>
                        ))}
                      </div>

                      {/* Squad Mini Scan */}
                      <div className="flex gap-1.5 overflow-x-auto pb-2">
                        {selectedNode.npc.time.map((p, i) => (
                          <div key={i} className="shrink-0 w-12 h-14 bg-slate-950 border border-white/5 flex flex-col items-center justify-center">
                            <img src={getSpriteUrl(p.speciesId)} className="w-8 h-8 pixelated" crossOrigin="anonymous" />
                            <span className="text-[7px] font-mono text-slate-500">L.{p.level}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {selectedNode.type === "pokemon" && selectedNode.pokemonReward && (
                    <div className="flex flex-col items-center py-2 text-center">
                      <div className="relative w-24 h-24 mb-3 flex items-center justify-center bg-cyan-500/5 border border-cyan-500/20 rotate-45">
                        <div className="-rotate-45">
                          <img
                            src={getSpriteUrl(selectedNode.pokemonReward.speciesId)}
                            className="w-16 h-16 pixelated drop-shadow-md"
                            crossOrigin="anonymous"
                          />
                        </div>
                      </div>
                      <h3 className="font-black text-xl text-white uppercase italic tracking-tighter leading-none mb-1">
                        {selectedNode.pokemonReward.name}
                      </h3>
                      <span className="text-[9px] font-black px-2 py-0.5 bg-cyan-500 text-slate-900 uppercase">
                        Level {selectedNode.pokemonReward.level}
                      </span>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Botão de Ação Ultra Compacto */}
              <div className="p-3 bg-slate-950/50 border-t border-white/5">
                <button
                  onClick={handleStartChallenge}
                  className="group relative w-full h-12 bg-red-600 hover:bg-red-500 active:scale-[0.98] transition-all overflow-hidden flex items-center justify-center gap-2"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_2s_infinite]" />
                  <span className="relative z-10 text-sm font-black italic tracking-tighter text-white uppercase">
                    {selectedNode.type === "npc" ? "ENGAGE BATTLE" : "CLAIM REWARD"}
                  </span>
                  <Swords className="w-4 h-4 text-white/50 group-hover:text-white" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { POKEMON, EVOLUTIONS, getSpriteUrl, TYPE_COLORS } from "@/lib/pokemon-data";
import type { PokemonSpecies, PokemonType } from "@/lib/pokemon-data";
import { Button } from "@/components/ui/button";
import { useGameStore, BABY_POKEMON_IDS, rollRandomEgg, MAX_EGGS, EGG_TIER_COLORS } from "@/lib/game-store";
import type { PokemonEgg } from "@/lib/game-store";
import { useModeStore } from "@/lib/mode-store";
import { playButtonClick, playGift, playBuy } from "@/lib/sounds";

// ─── Regras do Radar ───────────────────────────────────────
const MAX_ENERGY = 4;
const BATTERY_ENERGY = 10;
const ENERGY_RECOVERY_MS = 5 * 60 * 1000; // 5 minutos
const SCAN_DURATION_MS = 8_000; // 8 segundos (animação visível, mas < 1 min)
const MAX_POKEMON_PER_SCAN = 5;

// Legendários / Míticos – nunca aparecem no radar
const LEGENDARY_IDS = new Set([
// Kanto
144, 145, 146, 150, 151,

// Johto
243, 244, 245, 249, 250, 251,

// Hoenn
377, 378, 379, // Regis
380, 381,      // Lati@s
382, 383, 384, // Weather trio
385, 386,      // Míticos

// Sinnoh
480, 481, 482, // Lake trio
483, 484, 487, // Dialga, Palkia, Giratina
485,           // Heatran
486,           // Regigigas
488,           // Cresselia
489, 490,      // Phione, Manaphy
491,           // Darkrai
492,           // Shaymin
493            // Arceus
]);


// IDs que são resultado de evolução (o campo "to" de EVOLUTIONS)
const EVOLVED_IDS = new Set(EVOLUTIONS.map((e) => e.to));

// Pokemon noturnos (Ghost, Dark) – só aparecem entre 18h e 6h
const NOCTURNAL_TYPES: Set<string> = new Set(["ghost", "dark"]);

// Gerações com ranges para cálculo de dificuldade
const GEN_RANGES: [number, number][] = [
  [1, 151],   // G1 Kanto
  [152, 251], // G2 Johto
  [252, 386], // G3 Hoenn (completa)
  [387, 493], // G4
];

function isNightTime(): boolean {
  const h = new Date().getHours();
  return h >= 18 || h < 6;
}

/** Retorna a geração de um Pokemon pelo ID */
function getGenRange(id: number): [number, number] | null {
  return GEN_RANGES.find(([start, end]) => id >= start && id <= end) ?? null;
}

/**
 * Calcula o peso (chance) de um Pokemon aparecer no radar.
 * Pokemon com número mais baixo dentro da sua geração têm peso maior.
 * Exemplo G1: #1 Bulbasaur peso ~1.0, #60 peso ~0.25, #151 peso ~0.05
 */
function getSpawnWeight(p: PokemonSpecies): number {
  const range = getGenRange(p.id);
  if (!range) return 0.5; // fallback

  const [start, end] = range;
  const genSize = end - start + 1;
  const positionInGen = p.id - start; // 0 = primeiro da geração
  const normalizedPosition = positionInGen / (genSize - 1 || 1); // 0..1

  // Curva exponencial: peso decresce drasticamente conforme o número sobe
  // posição 0 (primeiro) => peso ~1.0
  // posição 0.4 (~meio-baixo) => peso ~0.45
  // posição 0.7 (~alto) => peso ~0.15
  // posição 1.0 (último) => peso ~0.05
  const weight = Math.max(0.05, Math.pow(1 - normalizedPosition, 2.5));
  return weight;
}

/**
 * Seleção ponderada: Pokemon com número mais baixo na geração
 * têm muito mais chance de aparecer no radar.
 */
function weightedRandomSelect(pool: PokemonSpecies[], count: number): PokemonSpecies[] {
  if (pool.length === 0 || count === 0) return [];

  const weights = pool.map((p) => getSpawnWeight(p));
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);

  const selected: PokemonSpecies[] = [];
  const usedIndices = new Set<number>();

  for (let i = 0; i < count && usedIndices.size < pool.length; i++) {
    let roll = Math.random() * totalWeight;
    let picked = -1;

    for (let j = 0; j < pool.length; j++) {
      if (usedIndices.has(j)) continue;
      roll -= weights[j];
      if (roll <= 0) {
        picked = j;
        break;
      }
    }

    // Fallback caso rounding cause problemas
    if (picked === -1) {
      for (let j = 0; j < pool.length; j++) {
        if (!usedIndices.has(j)) { picked = j; break; }
      }
    }
    if (picked === -1) break;

    usedIndices.add(picked);
    selected.push(pool[picked]);
  }

  return selected;
}

/** Filtra Pokemon que podem aparecer no radar */
function getRadarPool(): PokemonSpecies[] {
  const night = isNightTime();
  return POKEMON.filter((p) => {
    // Excluir lendários
    if (LEGENDARY_IDS.has(p.id)) return false;
    // Excluir evoluções
    if (EVOLVED_IDS.has(p.id)) return false;
    // Excluir baby Pokemon (vêm apenas de ovos)
    if (BABY_POKEMON_IDS.has(p.id)) return false;
    // Nocturnos somente à noite
    const isNocturnal = p.types.some((t) => NOCTURNAL_TYPES.has(t));
    if (isNocturnal && !night) return false;
    return true;
  });
}

// ─── Persistência da energia do radar ───────────────────────
interface RadarEnergy {
  charges: number;
  lastUsed: number; // timestamp
  batteryActive: boolean; // true = bateria da bolsa ativa (max 10), false = normal (max 4)
}

function loadEnergy(): RadarEnergy {
  if (typeof window === "undefined") return { charges: MAX_ENERGY, lastUsed: 0, batteryActive: false };
  try {
    const raw = localStorage.getItem("radar-energy");
    if (raw) {
      const data = JSON.parse(raw) as RadarEnergy;
      const maxE = data.batteryActive ? BATTERY_ENERGY : MAX_ENERGY;
      // Recuperar cargas offline (só quando sem bateria ativa, que tem recarga limitada)
      if (data.charges < maxE && data.lastUsed > 0 && !data.batteryActive) {
        const elapsed = Date.now() - data.lastUsed;
        const recovered = Math.floor(elapsed / ENERGY_RECOVERY_MS);
        if (recovered > 0) {
          data.charges = Math.min(MAX_ENERGY, data.charges + recovered);
          data.lastUsed = data.lastUsed + recovered * ENERGY_RECOVERY_MS;
        }
      }
      return data;
    }
  } catch { /* ignore */ }
  return { charges: MAX_ENERGY, lastUsed: 0, batteryActive: false };
}

function saveEnergy(e: RadarEnergy) {
  if (typeof window !== "undefined") localStorage.setItem("radar-energy", JSON.stringify(e));
}

// ─── Kit de presente (caixas do radar) ─────────────────────
type KitRarity = "normal" | "raro" | "epico";

interface GiftKitReward {
  type: "money" | "item";
  itemId?: string;
  itemName?: string;
  quantity: number;
}

interface GiftKit {
  rarity: KitRarity;
  label: string;
  color: string;
  rewards: GiftKitReward[];
}

// Chance de spawn por raridade (total = 100%)
// Normal: ~60%, Raro: ~30%, Epico: ~10%
function rollGiftKit(): GiftKit {
  const roll = Math.random();

  if (roll < 0.10) {
    // Epico
    const options: GiftKit[] = [
      { rarity: "epico", label: "Kit Epico", color: "#A855F7", rewards: [
        { type: "money", quantity: 3000 },
        { type: "item", itemId: "ultra-ball", itemName: "Ultra Ball", quantity: 2 },
        { type: "item", itemId: "hyper-potion", itemName: "Hyper Pocao", quantity: 1 },
      ]},
      { rarity: "epico", label: "Kit Epico", color: "#A855F7", rewards: [
        { type: "money", quantity: 2500 },
        { type: "item", itemId: "rare-candy", itemName: "Rare Candy", quantity: 1 },
      ]},
      { rarity: "epico", label: "Kit Epico", color: "#A855F7", rewards: [
        { type: "money", quantity: 2000 },
        { type: "item", itemId: "great-ball", itemName: "Great Ball", quantity: 3 },
        { type: "item", itemId: "revive", itemName: "Revive", quantity: 2 },
      ]},
      { rarity: "epico", label: "Kit Epico", color: "#A855F7", rewards: [
        { type: "money", quantity: 1500 },
        { type: "item", itemId: "radar-battery", itemName: "Bateria do Radar", quantity: 1 },
      ]},
    ];
    return options[Math.floor(Math.random() * options.length)];
  }

  if (roll < 0.40) {
    // Raro
    const options: GiftKit[] = [
      { rarity: "raro", label: "Kit Raro", color: "#3B82F6", rewards: [
        { type: "money", quantity: 1200 },
        { type: "item", itemId: "great-ball", itemName: "Great Ball", quantity: 2 },
      ]},
      { rarity: "raro", label: "Kit Raro", color: "#3B82F6", rewards: [
        { type: "money", quantity: 1000 },
        { type: "item", itemId: "super-potion", itemName: "Super Pocao", quantity: 2 },
      ]},
      { rarity: "raro", label: "Kit Raro", color: "#3B82F6", rewards: [
        { type: "item", itemId: "pokeball", itemName: "Pokeball", quantity: 3 },
        { type: "item", itemId: "potion", itemName: "Pocao", quantity: 2 },
        { type: "money", quantity: 800 },
      ]},
    ];
    return options[Math.floor(Math.random() * options.length)];
  }

  // Normal
  const options: GiftKit[] = [
    { rarity: "normal", label: "Kit Normal", color: "#22C55E", rewards: [
      { type: "money", quantity: 600 },
    ]},
    { rarity: "normal", label: "Kit Normal", color: "#22C55E", rewards: [
      { type: "item", itemId: "pokeball", itemName: "Pokeball", quantity: 1 },
    ]},
    { rarity: "normal", label: "Kit Normal", color: "#22C55E", rewards: [
      { type: "money", quantity: 400 },
      { type: "item", itemId: "potion", itemName: "Pocao", quantity: 1 },
    ]},
    { rarity: "normal", label: "Kit Normal", color: "#22C55E", rewards: [
      { type: "money", quantity: 300 },
    ]},
  ];
  return options[Math.floor(Math.random() * options.length)];
}

// ─── Tipos de ponto no radar ────────────────────────────────
interface RadarBlip {
  id: string;
  pokemon?: PokemonSpecies;
  giftKit?: GiftKit;
  egg?: PokemonEgg;
  isGift: boolean;
  isEgg: boolean;
  angle: number;  // graus
  distance: number; // 0-1 (centro para borda)
  delay: number; // animação
}

interface ExplorationRadarProps {
  onStartCapture?: (speciesId: number) => void;
}

export function ExplorationRadar({ onStartCapture }: ExplorationRadarProps) {
  const { addMoney, addBagItem, addEgg, eggs, bag } = useGameStore();
  const { activeProfileId, getDiscoveredForProfile } = useModeStore();
  const [energy, setEnergy] = useState<RadarEnergy>(loadEnergy);
  const [scanning, setScanning] = useState(false);
  const [blips, setBlips] = useState<RadarBlip[]>([]);
  const [scanProgress, setScanProgress] = useState(0);
  const [selectedBlip, setSelectedBlip] = useState<RadarBlip | null>(null);
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const [recoveryTimer, setRecoveryTimer] = useState<string>("");
  const [claimedGift, setClaimedGift] = useState<GiftKit | null>(null);
  const [claimedEgg, setClaimedEgg] = useState<PokemonEgg | null>(null);
  const scanInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Bateria na bolsa (para mostrar botão de ativar)
  const bagBatteryCount = bag.find((i) => i.itemId === "radar-battery")?.quantity ?? 0;
  const canActivateBattery = bagBatteryCount > 0 && !energy.batteryActive;

  // Check if pokemon is discovered
  const isDiscovered = (pokemonId: number): boolean => {
    if (!activeProfileId) return false;
    const discovered = getDiscoveredForProfile(activeProfileId);
    return discovered.includes(pokemonId);
  };

  // ── Recuperação de energia (a cada 5 min, apenas no modo normal sem bateria) ──
  useEffect(() => {
    const tick = () => {
      setEnergy((prev) => {
        if (prev.batteryActive) return prev; // bateria não regenera, apenas é consumida
        if (prev.charges >= MAX_ENERGY) return prev;
        const now = Date.now();
        const elapsed = now - prev.lastUsed;
        const recovered = Math.floor(elapsed / ENERGY_RECOVERY_MS);
        if (recovered > 0) {
          const next = {
            ...prev,
            charges: Math.min(MAX_ENERGY, prev.charges + recovered),
            lastUsed: prev.lastUsed + recovered * ENERGY_RECOVERY_MS,
          };
          saveEnergy(next);
          return next;
        }
        return prev;
      });
    };
    tick();
    const id = setInterval(tick, 5000);
    return () => clearInterval(id);
  }, []);

  // ── Timer de recuperação visual ──
  useEffect(() => {
    const id = setInterval(() => {
      setEnergy((prev) => {
        if (prev.batteryActive || prev.charges >= MAX_ENERGY) {
          setRecoveryTimer("");
          return prev;
        }
        const remaining = ENERGY_RECOVERY_MS - (Date.now() - prev.lastUsed);
        if (remaining <= 0) {
          setRecoveryTimer("");
          return prev;
        }
        const mins = Math.floor(remaining / 60000);
        const secs = Math.floor((remaining % 60000) / 1000);
        setRecoveryTimer(`${mins}:${String(secs).padStart(2, "0")}`);
        return prev;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // ── Finalizar scan ──
  const finishScan = useCallback(() => {
    setScanning(false);
    setScanProgress(1);

    const pool = getRadarPool();
    // 0 a 5 pokemon, com chance de 0
    const count = Math.floor(Math.random() * (MAX_POKEMON_PER_SCAN + 2)) - 1; // -1 to 6, clamped
    const finalCount = Math.max(0, Math.min(MAX_POKEMON_PER_SCAN, count));

    if (finalCount === 0) {
      // Even with no pokemon, can still find a gift box
      const loneGiftChance = Math.random();
      if (loneGiftChance < 0.35) {
        const kit = rollGiftKit();
        const giftBlip: RadarBlip = {
          id: `gift-${Date.now()}`,
          giftKit: kit,
          isGift: true,
          isEgg: false,
          angle: Math.random() * 360,
          distance: 0.2 + Math.random() * 0.55,
          delay: 0.2,
        };
        setBlips([giftBlip]);
        playGift();
        setScanMessage("1 presente detectado!");
        setTimeout(() => setScanMessage(null), 4000);
        return;
      }
      setScanMessage("Nenhum Pokemon detectado nesta area...");
      setTimeout(() => setScanMessage(null), 5000);
      return;
    }

    // Seleção ponderada: Pokemon de número baixo na geração aparecem mais
    const selected = weightedRandomSelect(pool, finalCount);

    const newBlips: RadarBlip[] = selected.map((p, i) => ({
      id: `${p.id}-${Date.now()}-${i}`,
      pokemon: p,
      isGift: false,
      isEgg: false,
      angle: Math.random() * 360,
      distance: 0.2 + Math.random() * 0.65,
      delay: i * 0.3,
    }));

    // Gift box chance: ~40% chance per scan (independent of pokemon count)
    const giftChance = Math.random();
    if (giftChance < 0.40) {
      const kit = rollGiftKit();
      newBlips.push({
        id: `gift-${Date.now()}`,
        giftKit: kit,
        isGift: true,
        isEgg: false,
        angle: Math.random() * 360,
        distance: 0.15 + Math.random() * 0.6,
        delay: finalCount * 0.3 + 0.2,
      });
    }

    // Egg chance: ~18% chance per scan (only if not at max eggs)
    const currentEggCount = useGameStore.getState().eggs.length;
    if (currentEggCount < MAX_EGGS && Math.random() < 0.18) {
      const egg = rollRandomEgg();
      newBlips.push({
        id: `egg-${Date.now()}`,
        egg,
        isGift: false,
        isEgg: true,
        angle: Math.random() * 360,
        distance: 0.2 + Math.random() * 0.55,
        delay: (finalCount + 1) * 0.3 + 0.1,
      });
    }

    setBlips(newBlips);
    playGift();
    const giftCount = newBlips.filter(b => b.isGift).length;
    const eggCount = newBlips.filter(b => b.isEgg).length;
    const pokemonCount = newBlips.filter(b => !b.isGift && !b.isEgg).length;
    const parts: string[] = [];
    if (pokemonCount > 0) parts.push(`${pokemonCount} Pokemon`);
    if (giftCount > 0) parts.push(`${giftCount} presente${giftCount > 1 ? "s" : ""}`);
    if (eggCount > 0) parts.push(`${eggCount} ovo${eggCount > 1 ? "s" : ""}`);
    setScanMessage(parts.length > 0 ? `${parts.join(" e ")} detectado${pokemonCount + giftCount + eggCount > 1 ? "s" : ""}!` : "Nenhum Pokemon detectado nesta area...");
    setTimeout(() => setScanMessage(null), 4000);
  }, []);

  // ── Iniciar scan ──
  const startScan = useCallback(() => {
    if (scanning) return;
    if (energy.charges <= 0) {
      setScanMessage("Sem energia! Aguarde a recarga.");
      setTimeout(() => setScanMessage(null), 3000);
      return;
    }

    playButtonClick();

    // Gastar energia
    const newCharges = energy.charges - 1;
    const batteryJustDepleted = energy.batteryActive && newCharges <= 0;
    const next: RadarEnergy = {
      charges: batteryJustDepleted ? MAX_ENERGY : newCharges,
      lastUsed: Date.now(),
      batteryActive: batteryJustDepleted ? false : energy.batteryActive,
    };
    setEnergy(next);
    saveEnergy(next);

    setScanning(true);
    setScanProgress(0);
    setBlips([]);
    setSelectedBlip(null);
    setClaimedGift(null);
    setScanMessage(null);

    // Progresso do scan
    const start = Date.now();
    scanInterval.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(1, elapsed / SCAN_DURATION_MS);
      setScanProgress(pct);
      if (pct >= 1) {
        if (scanInterval.current) clearInterval(scanInterval.current);
        finishScan();
      }
    }, 50);
  }, [scanning, energy, finishScan]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (scanInterval.current) clearInterval(scanInterval.current);
    };
  }, []);

  // ── Ativar bateria da bolsa ──
  const activateBattery = useCallback(() => {
    if (!canActivateBattery) return;
    // Consume 1 battery from bag
    addBagItem("radar-battery", -1);
    // Set radar to 10 charges in battery mode
    const next: RadarEnergy = {
      charges: BATTERY_ENERGY,
      lastUsed: Date.now(),
      batteryActive: true,
    };
    setEnergy(next);
    saveEnergy(next);
    playGift();
  }, [canActivateBattery, addBagItem]);

  const handleBlipClick = (blip: RadarBlip) => {
    if (scanning) return;
    playButtonClick();
    if (blip.isEgg && blip.egg) {
      // Claim egg
      const success = addEgg(blip.egg);
      if (success) {
        playGift();
        setClaimedEgg(blip.egg);
        setBlips((prev) => prev.filter((b) => b.id !== blip.id));
        setTimeout(() => setClaimedEgg(null), 4000);
      }
      return;
    }
    if (blip.isGift && blip.giftKit) {
      // Claim gift immediately
      blip.giftKit.rewards.forEach((r) => {
        if (r.type === "money") {
          addMoney(r.quantity);
        } else if (r.type === "item" && r.itemId) {
          addBagItem(r.itemId, r.quantity);
        }
      });
      playBuy();
      setClaimedGift(blip.giftKit);
      setBlips((prev) => prev.filter((b) => b.id !== blip.id));
      setTimeout(() => setClaimedGift(null), 4000);
    } else {
      setSelectedBlip(blip);
    }
  };

  const handleCapture = () => {
    if (!selectedBlip || !onStartCapture || !selectedBlip.pokemon) return;
    onStartCapture(selectedBlip.pokemon.id);
    // Remove from blips
    setBlips((prev) => prev.filter((b) => b.id !== selectedBlip.id));
    setSelectedBlip(null);
  };

  const radarSize = 280;
  const center = radarSize / 2;

  return (
    <div className="flex flex-col items-center h-full overflow-auto py-4 px-3 gap-4">

      {/* Titulo + Energia */}
      <div className="flex items-center justify-between w-full max-w-sm">
        <div className="flex flex-col">
          <h2 className="text-sm font-bold text-foreground tracking-wide">Radar de Exploracao</h2>
          <p className="text-[10px] text-muted-foreground">
            {isNightTime() ? "Modo noturno ativo" : "Modo diurno"}
            {" — "}
            {energy.batteryActive
              ? <span style={{ color: "#EAB308" }}>{energy.charges}/{BATTERY_ENERGY} (Bateria)</span>
              : <span>{energy.charges}/{MAX_ENERGY} cargas</span>
            }
          </p>
        </div>

        {/* Bateria com raio */}
        <div className="flex items-center gap-1.5">
          {recoveryTimer && !energy.batteryActive && (
            <span className="text-[10px] text-muted-foreground font-mono">{recoveryTimer}</span>
          )}
          {energy.batteryActive && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: "rgba(234,179,8,0.15)", color: "#EAB308" }}>
              ⚡ BATERIA
            </span>
          )}
          <BatteryIcon charges={energy.charges} max={energy.batteryActive ? BATTERY_ENERGY : MAX_ENERGY} />
        </div>
      </div>

      {/* Mensagem */}
      <AnimatePresence>
        {scanMessage && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs font-medium text-center px-3 py-1.5 rounded-lg"
            style={{ backgroundColor: "rgba(34,197,94,0.15)", color: "#22C55E" }}
          >
            {scanMessage}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Radar circular */}
      <div
        className="relative shrink-0"
        style={{ width: radarSize, height: radarSize }}
      >
        {/* Fundo do radar */}
        <svg
          width={radarSize}
          height={radarSize}
          viewBox={`0 0 ${radarSize} ${radarSize}`}
          className="absolute inset-0"
        >
          {/* Círculos concêntricos */}
          {[0.25, 0.5, 0.75, 1].map((r) => (
            <circle
              key={r}
              cx={center}
              cy={center}
              r={center * r - 2}
              fill="none"
              stroke="rgba(34,197,94,0.15)"
              strokeWidth={1}
            />
          ))}
          {/* Cruz central */}
          <line x1={center} y1={4} x2={center} y2={radarSize - 4} stroke="rgba(34,197,94,0.1)" strokeWidth={1} />
          <line x1={4} y1={center} x2={radarSize - 4} y2={center} stroke="rgba(34,197,94,0.1)" strokeWidth={1} />
          {/* Ponto central (treinador) */}
          <circle cx={center} cy={center} r={4} fill="#22C55E" opacity={0.9} />
          <circle cx={center} cy={center} r={7} fill="none" stroke="#22C55E" strokeWidth={1} opacity={0.4} />
        </svg>

        {/* Sweep de scan (linha giratória) */}
        {scanning && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ transformOrigin: "center center" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <svg width={radarSize} height={radarSize} viewBox={`0 0 ${radarSize} ${radarSize}`}>
              <defs>
                <linearGradient id="sweep-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22C55E" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Sweep cone */}
              <path
                d={`M ${center} ${center} L ${center} 4 A ${center - 4} ${center - 4} 0 0 1 ${center + (center - 4) * Math.sin(Math.PI / 6)} ${center - (center - 4) * Math.cos(Math.PI / 6)} Z`}
                fill="url(#sweep-grad)"
                opacity={0.5}
              />
              {/* Sweep line */}
              <line
                x1={center}
                y1={center}
                x2={center}
                y2={4}
                stroke="#22C55E"
                strokeWidth={2}
                opacity={0.8}
              />
            </svg>
          </motion.div>
        )}

        {/* Blips (pontos de pokemon) */}
        <AnimatePresence>
          {blips.map((blip) => {
            const rad = (blip.angle * Math.PI) / 180;
            const maxR = center - 16;
            const x = center + Math.cos(rad) * maxR * blip.distance;
            const y = center + Math.sin(rad) * maxR * blip.distance;
            const color = blip.isEgg
              ? (EGG_TIER_COLORS[blip.egg?.tier || "green"].bg)
              : blip.isGift
              ? (blip.giftKit?.color || "#F59E0B")
              : TYPE_COLORS[(blip.pokemon?.types[0] || "normal") as PokemonType] || "#22C55E";

            return (
              <motion.button
                key={blip.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ delay: blip.delay, type: "spring", stiffness: 300, damping: 20 }}
                className="absolute z-10 group"
                style={{
                  left: x - 12,
                  top: y - 12,
                  width: 24,
                  height: 24,
                }}
                onClick={() => handleBlipClick(blip)}
              >
                {/* Glow ring */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    backgroundColor: color,
                    opacity: 0.25,
                    boxShadow: `0 0 12px ${color}`,
                  }}
                  animate={{ scale: [1, 1.6, 1], opacity: [0.25, 0.1, 0.25] }}
                  transition={{ duration: 2, repeat: Infinity, delay: blip.delay }}
                />
                {/* Dot */}
                <div
                  className="absolute inset-1 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: color,
                    boxShadow: `0 0 6px ${color}`,
                  }}
                >
                  {blip.isEgg ? (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                      <ellipse cx="12" cy="13" rx="8" ry="10" fill="white" opacity="0.9"/>
                    </svg>
                  ) : blip.isGift ? (
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="white">
                      <path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 110-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 100-5C13 2 12 7 12 7z" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : null}
                </div>
                {/* Hover/selected indicator */}
                {selectedBlip?.id === blip.id && (
                  <motion.div
                    className="absolute -inset-1 rounded-full border-2"
                    style={{ borderColor: color }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>

        {/* Borda exterior do radar */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            border: "2px solid rgba(34,197,94,0.3)",
            boxShadow: "0 0 20px rgba(34,197,94,0.1), inset 0 0 30px rgba(0,0,0,0.4)",
          }}
        />
      </div>

      {/* Progress bar during scan */}
      {scanning && (
        <div className="w-full max-w-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-muted-foreground">Escaneando...</span>
            <span className="text-[10px] text-muted-foreground font-mono">
              {Math.round(scanProgress * 100)}%
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: "#22C55E" }}
              animate={{ width: `${scanProgress * 100}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>
      )}

      {/* Botão de scan */}
      <Button
        onClick={startScan}
        disabled={scanning || energy.charges <= 0}
        className="w-full max-w-sm h-12 text-sm font-bold relative overflow-hidden"
        style={{
          backgroundColor: scanning ? "rgba(34,197,94,0.15)" : energy.charges > 0 ? "#22C55E" : "rgba(255,255,255,0.08)",
          color: energy.charges > 0 ? "#fff" : "rgba(255,255,255,0.4)",
        }}
      >
        {scanning ? (
          <span className="flex items-center gap-2">
            <motion.div
              className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            Escaneando...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <RadarIcon />
            {energy.charges > 0 ? "Iniciar Scan" : "Sem Energia"}
          </span>
        )}
      </Button>

      {/* Painel do presente coletado */}
      <AnimatePresence>
        {claimedGift && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="w-full max-w-sm rounded-xl border-2 p-4 flex flex-col items-center gap-3"
            style={{
              borderColor: claimedGift.color,
              background: `linear-gradient(135deg, rgba(0,0,0,0.7) 0%, ${claimedGift.color}20 100%)`,
            }}
          >
            {/* Gift icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, -10, 10, -5, 5, 0] }}
              transition={{ duration: 0.6 }}
              className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${claimedGift.color}30` }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={claimedGift.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 110-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 100-5C13 2 12 7 12 7z"/>
              </svg>
            </motion.div>

            <div className="text-center">
              <span className="text-xs font-bold tracking-wider" style={{ color: claimedGift.color }}>
                {claimedGift.label.toUpperCase()}
              </span>
            </div>

            {/* Rewards list */}
            <div className="flex flex-col gap-1.5 w-full">
              {claimedGift.rewards.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1.5"
                >
                  {r.type === "money" ? (
                    <>
                      <span className="text-amber-400 text-sm">$</span>
                      <span className="text-xs font-bold text-amber-400">{r.quantity.toLocaleString("pt-BR")}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xs text-foreground">{r.itemName}</span>
                      <span className="text-[10px] text-muted-foreground ml-auto">x{r.quantity}</span>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão de ativar bateria */}
      {canActivateBattery && (
        <button
          onClick={activateBattery}
          className="w-full max-w-sm h-9 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all"
          style={{
            background: "rgba(234,179,8,0.12)",
            border: "1px solid rgba(234,179,8,0.4)",
            color: "#EAB308",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="16" height="10" rx="2" ry="2"/><line x1="22" y1="11" x2="22" y2="13"/><line x1="10" y1="11" x2="10" y2="13"/>
          </svg>
          Ativar Bateria ({bagBatteryCount} na bolsa) — 10 cargas
        </button>
      )}
      {energy.batteryActive && bagBatteryCount > 0 && (
        <p className="text-[10px] text-muted-foreground text-center max-w-sm">
          Proxima bateria disponivel apos esgotar a atual ({bagBatteryCount} aguardando)
        </p>
      )}

      {/* Painel do ovo coletado */}
      <AnimatePresence>
        {claimedEgg && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="w-full max-w-sm rounded-xl border-2 p-4 flex flex-col items-center gap-3"
            style={{
              borderColor: EGG_TIER_COLORS[claimedEgg.tier].bg,
              background: `linear-gradient(135deg, rgba(0,0,0,0.7) 0%, ${EGG_TIER_COLORS[claimedEgg.tier].bg}20 100%)`,
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, -8, 8, -4, 4, 0] }}
              transition={{ duration: 0.6 }}
              className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${EGG_TIER_COLORS[claimedEgg.tier].bg}25` }}
            >
              <svg width="32" height="32" viewBox="0 0 40 48" fill="none">
                <ellipse cx="20" cy="26" rx="14" ry="18" fill={EGG_TIER_COLORS[claimedEgg.tier].bg} opacity="0.9"/>
                <ellipse cx="20" cy="26" rx="14" ry="18" fill="none" stroke="white" strokeWidth="1.5" opacity="0.4"/>
                <ellipse cx="15" cy="20" rx="3" ry="4" fill="white" opacity="0.25" transform="rotate(-15 15 20)"/>
              </svg>
            </motion.div>
            <div className="text-center">
              <span className="text-xs font-bold tracking-wider" style={{ color: EGG_TIER_COLORS[claimedEgg.tier].bg }}>
                OVO ENCONTRADO!
              </span>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Ovo {EGG_TIER_COLORS[claimedEgg.tier].label} - Veja na aba Ovos da Pokedex
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Painel do pokemon selecionado */}
      <AnimatePresence mode="wait">
        {selectedBlip && selectedBlip.pokemon && (
          <motion.div
            key={selectedBlip.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-full max-w-sm rounded-xl border p-4 flex flex-col items-center gap-3"
            style={{
              borderColor: `${TYPE_COLORS[selectedBlip.pokemon.types[0] as PokemonType]}55`,
              background: `linear-gradient(135deg, rgba(0,0,0,0.6) 0%, ${TYPE_COLORS[selectedBlip.pokemon.types[0] as PokemonType]}15 100%)`,
            }}
          >
            {/* Pokemon sprite */}
            <div className="relative">
              <div
                className="absolute -inset-6 rounded-full blur-2xl opacity-30"
                style={{ backgroundColor: TYPE_COLORS[selectedBlip.pokemon.types[0] as PokemonType] }}
              />
              {isDiscovered(selectedBlip.pokemon.id) ? (
                // Pokemon descoberto - mostrar sprite normal
                <img
                  src={getSpriteUrl(selectedBlip.pokemon.id)}
                  alt={selectedBlip.pokemon.name}
                  width={80}
                  height={80}
                  className="relative z-10 pixelated drop-shadow-[0_6px_10px_rgba(0,0,0,0.6)]"
                  crossOrigin="anonymous"
                  loading="lazy"
                />
              ) : (
                // Pokemon não descoberto - mostrar silhueta
                <div className="relative z-10 w-20 h-20 rounded-lg flex items-center justify-center drop-shadow-[0_6px_10px_rgba(0,0,0,0.6)]" style={{ background: "rgba(0,0,0,0.4)" }}>
                  <svg width="60" height="60" viewBox="0 0 100 100" className="opacity-60">
                    <ellipse cx="50" cy="65" rx="30" ry="20" fill="rgba(255,255,255,0.3)" />
                    <circle cx="50" cy="35" r="20" fill="rgba(255,255,255,0.3)" />
                    <circle cx="40" cy="28" r="4" fill="rgba(255,255,255,0.4)" />
                    <circle cx="60" cy="28" r="4" fill="rgba(255,255,255,0.4)" />
                  </svg>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs text-muted-foreground font-mono">
                {isDiscovered(selectedBlip.pokemon.id) ? `#${String(selectedBlip.pokemon.id).padStart(3, "0")}` : "???"}
              </span>
              <span className="text-base font-bold text-foreground capitalize">
                {isDiscovered(selectedBlip.pokemon.id) ? selectedBlip.pokemon.name : "Pokemon Desconhecido"}
              </span>
              <div className="flex gap-1.5">
                {isDiscovered(selectedBlip.pokemon.id) ? (
                  selectedBlip.pokemon.types.map((t) => (
                    <span
                      key={t}
                      className="text-[9px] px-2 py-0.5 rounded-full font-semibold tracking-wide"
                      style={{ backgroundColor: TYPE_COLORS[t as PokemonType], color: "#fff" }}
                    >
                      {t.toUpperCase()}
                    </span>
                  ))
                ) : (
                  <span className="text-[9px] px-2 py-0.5 rounded-full font-semibold tracking-wide text-muted-foreground" style={{ background: "rgba(255,255,255,0.08)" }}>
                    TIPO DESCONHECIDO
                  </span>
                )}
              </div>
            </div>

            {/* Botão capturar */}
            {onStartCapture && (
              <Button
                onClick={handleCapture}
                className="w-full text-white font-bold mt-1"
                style={{ backgroundColor: "#EF4444" }}
              >
                <svg width="16" height="16" viewBox="0 0 100 100" className="mr-2">
                  <circle cx="50" cy="50" r="48" fill="#EF4444" stroke="#1E293B" strokeWidth="3" />
                  <rect x="2" y="48" width="96" height="4" fill="#1E293B" />
                  <path d="M 2 50 A 48 48 0 0 0 98 50" fill="#F1F5F9" />
                  <circle cx="50" cy="50" r="14" fill="#F1F5F9" stroke="#1E293B" strokeWidth="3" />
                  <circle cx="50" cy="50" r="7" fill="#1E293B" />
                </svg>
                Tentar Capturar
              </Button>
            )}

            <button
              onClick={() => setSelectedBlip(null)}
              className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
            >
              Fechar
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legenda */}
      {/* <div className="w-full max-w-sm mt-auto pt-3 border-t border-border">
        <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <BatteryIcon charges={1} max={4} size={14} />
            <span>1 energia por scan</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
            <span>Recarga em 5 min</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-yellow-500 shrink-0" />
            <span>Caixas presente</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
            <span>Noturnos: 18h-6h</span>
          </div>
        </div>
      </div> */}
    </div>
  );
}

// ─── Ícone de bateria com raio ���─────────────────────────────
function BatteryIcon({ charges, max, size = 28 }: { charges: number; max: number; size?: number }) {
  const pct = charges / max;
  const barColor = pct > 0.5 ? "#22C55E" : pct > 0.25 ? "#F59E0B" : "#EF4444";
  const w = size;
  const h = size * 0.55;

  return (
    <svg width={w} height={h} viewBox="0 0 40 22" className="shrink-0">
      {/* Corpo da bateria */}
      <rect x="1" y="3" width="33" height="16" rx="3" ry="3" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground" />
      {/* Terminal da bateria */}
      <rect x="34" y="7" width="4" height="8" rx="1" fill="currentColor" className="text-muted-foreground" />
      {/* Barras de energia */}
      {Array.from({ length: max }).map((_, i) => {
        const barW = 6;
        const gap = 1.5;
        const startX = 4 + i * (barW + gap);
        return (
          <rect
            key={i}
            x={startX}
            y={6}
            width={barW}
            height={10}
            rx={1}
            fill={i < charges ? barColor : "rgba(255,255,255,0.08)"}
          />
        );
      })}
      {/* Raio (lightning bolt) */}
      <polygon
        points="20,2 17,11 21,11 18,20 24,9 20,9 23,2"
        fill={charges > 0 ? "#F59E0B" : "rgba(255,255,255,0.15)"}
        stroke="none"
      />
    </svg>
  );
}

// ─── Ícone do radar ─────────────────────────────────────────
function RadarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" opacity={0.5} />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <line x1="12" y1="2" x2="12" y2="12" />
    </svg>
  );
}

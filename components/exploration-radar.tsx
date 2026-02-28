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
import { ScanIcon } from "lucide-react";

// ─── Regras do Radar ───────────────────────────────────────
const MAX_ENERGY = 4;
const BATTERY_ENERGY = 10;
const ENERGY_RECOVERY_MS = 5 * 60 * 1000; // 5 minutos
const MIN = 1_000; // 1 segundo
const MAX = 8_000; // 8 segundo

const SCAN_DURATION_MS = Math.floor(
  Math.random() * (MAX - MIN + 1)
) + MIN;
const MAX_POKEMON_PER_SCAN = 5;

// ─── Categorias de Pokemon que NAO aparecem no radar ───────
// Legendarios / Miticos / Deuses - somente em metas ofensivas
const LEGENDARY_IDS = new Set([
  // Kanto
  144, 145, 146, 150, 151,
  // Johto
  243, 244, 245, 249, 250, 251,
  // Hoenn
  377, 378, 379, // Regis
  380, 381,      // Lati@s
  382, 383, 384, // Weather trio
  385, 386,      // Miticos
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

// Fosseis - somente em metas ofensivas
const FOSSIL_IDS = new Set([
  // Kanto
  138, 139,      // Omanyte, Omastar
  140, 141,      // Kabuto, Kabutops
  142,           // Aerodactyl
  // Johto (nenhum fossil novo)
  // Hoenn
  345, 346,      // Lileep, Cradily
  347, 348,      // Anorith, Armaldo
  // Sinnoh
  408, 409,      // Cranidos, Rampardos
  410, 411,      // Shieldon, Bastiodon
]);

// Raros especiais - somente em metas ofensivas
const RARE_SPECIAL_IDS = new Set([
  132,           // Ditto
  201,           // Unown
  352,           // Kecleon
]);

// IDs que sao resultado de evolucao (o campo "to" de EVOLUTIONS)
const EVOLVED_IDS = new Set(EVOLUTIONS.map((e) => e.to));

// Pokemon noturnos (Ghost, Dark) - so aparecem entre 18h e 6h
const NOCTURNAL_TYPES: Set<string> = new Set(["ghost", "dark"]);

// Tipos afetados pelo clima
const WATER_TYPES: Set<string> = new Set(["water"]);
const FIRE_TYPES: Set<string> = new Set(["fire"]);

// Geracoes com ranges para calculo de dificuldade
const GEN_RANGES: [number, number][] = [
  [1, 151],   // G1 Kanto
  [152, 251], // G2 Johto
  [252, 386], // G3 Hoenn (completa)
  [387, 493], // G4
];

// ─── Estado do clima ───────────────────────────────────────
type WeatherCondition = "clear" | "rain" | "clouds" | "thunderstorm" | "snow" | "unknown";

interface WeatherState {
  condition: WeatherCondition;
  description: string;
  temperature: number;
  city: string;
  lastUpdated: number;
}

let cachedWeather: WeatherState | null = null;

// Buscar clima real da regiao do jogador
async function fetchWeather(): Promise<WeatherState> {
  // Usar cache se atualizado nos ultimos 10 minutos
  if (cachedWeather && Date.now() - cachedWeather.lastUpdated < 10 * 60 * 1000) {
    return cachedWeather;
  }

  try {
    // Obter localizacao do usuario
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
        return;
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
    });

    const { latitude, longitude } = position.coords;

    // Buscar clima da API Open-Meteo (gratuita, sem API key)
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`
    );

    if (!response.ok) throw new Error("Weather API error");

    const data = await response.json();
    const weatherCode = data.current.weather_code;
    const temp = data.current.temperature_2m;

    // Mapear codigo WMO para condicao
    let condition: WeatherCondition = "unknown";
    let description = "Desconhecido";

    if (weatherCode === 0 || weatherCode === 1) {
      condition = "clear";
      description = "Ensolarado";
    } else if (weatherCode >= 2 && weatherCode <= 3) {
      condition = "clouds";
      description = "Nublado";
    } else if (weatherCode >= 51 && weatherCode <= 67) {
      condition = "rain";
      description = "Chuva";
    } else if (weatherCode >= 80 && weatherCode <= 82) {
      condition = "rain";
      description = "Chuva";
    } else if (weatherCode >= 95 && weatherCode <= 99) {
      condition = "thunderstorm";
      description = "Tempestade";
    } else if (weatherCode >= 71 && weatherCode <= 77) {
      condition = "snow";
      description = "Neve";
    } else if (weatherCode >= 85 && weatherCode <= 86) {
      condition = "snow";
      description = "Neve";
    } else {
      condition = "clouds";
      description = "Nublado";
    }

    // Buscar nome da cidade via reverse geocoding
    let city = "Sua regiao";
    try {
      const geoResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      if (geoResponse.ok) {
        const geoData = await geoResponse.json();
        city = geoData.address?.city || geoData.address?.town || geoData.address?.village || "Sua regiao";
      }
    } catch {
      // Ignorar erro de geocoding
    }

    cachedWeather = {
      condition,
      description,
      temperature: Math.round(temp),
      city,
      lastUpdated: Date.now(),
    };

    return cachedWeather;
  } catch {
    // Fallback: clima aleatorio baseado na hora
    const hour = new Date().getHours();
    let condition: WeatherCondition = "clear";
    let description = "Ensolarado";

    // Simular clima baseado na hora (fallback)
    if (hour >= 6 && hour < 18) {
      const roll = Math.random();
      if (roll < 0.6) {
        condition = "clear";
        description = "Ensolarado";
      } else if (roll < 0.85) {
        condition = "clouds";
        description = "Nublado";
      } else {
        condition = "rain";
        description = "Chuva";
      }
    } else {
      condition = "clouds";
      description = "Noite nublada";
    }

    cachedWeather = {
      condition,
      description,
      temperature: 22,
      city: "Sua regiao",
      lastUpdated: Date.now(),
    };

    return cachedWeather;
  }
}

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

/** 
 * Filtra Pokemon que podem aparecer no radar
 * Regras:
 * 1. Somente Pokemon no nivel 1 de evolucao (nao evoluidos)
 * 2. Pokemon noturnos (Ghost, Dark) somente a noite
 * 3. Baby Pokemon somente nos ovos do radar
 * 4. Raros, deuses, lendarios, fosseis - somente em metas ofensivas
 * 5. Evolucoes nao aparecem no radar
 * 6. Chuva aumenta chances de aquaticos
 * 7. Sol aumenta chances de fogo
 * 8. Agua e fogo sao dificeis de encontrar fora das condicoes ideais
 */
function getRadarPool(weather: WeatherState): PokemonSpecies[] {
  const night = isNightTime();
  const isRaining = weather.condition === "rain" || weather.condition === "thunderstorm";
  const isSunny = weather.condition === "clear";

  return POKEMON.filter((p) => {
    // 1. Excluir lendarios/miticos/deuses (somente em metas ofensivas)
    if (LEGENDARY_IDS.has(p.id)) return false;

    // 2. Excluir fosseis (somente em metas ofensivas)
    if (FOSSIL_IDS.has(p.id)) return false;

    // 3. Excluir raros especiais (somente em metas ofensivas)
    if (RARE_SPECIAL_IDS.has(p.id)) return false;

    // 4. Excluir evolucoes (somente nivel 1 de evolucao aparece)
    if (EVOLVED_IDS.has(p.id)) return false;

    // 5. Excluir baby Pokemon (somente nos ovos do radar)
    if (BABY_POKEMON_IDS.has(p.id)) return false;

    // 6. Nocturnos (Ghost, Dark) somente a noite
    const isNocturnal = p.types.some((t) => NOCTURNAL_TYPES.has(t));
    if (isNocturnal && !night) return false;

    // 7. Tipo Agua - dificil sem chuva (80% de chance de ser filtrado)
    const isWaterType = p.types.some((t) => WATER_TYPES.has(t));
    if (isWaterType && !isRaining) {
      if (Math.random() > 0.20) return false; // 80% chance de nao aparecer
    }

    // 8. Tipo Fogo - dificil sem sol (80% de chance de ser filtrado)
    const isFireType = p.types.some((t) => FIRE_TYPES.has(t));
    if (isFireType && !isSunny) {
      if (Math.random() > 0.20) return false; // 80% chance de nao aparecer
    }

    return true;
  });
}

/**
 * Ajusta os pesos de spawn baseado no clima
 * - Chuva: Pokemon de agua tem peso 3x maior
 * - Sol: Pokemon de fogo tem peso 3x maior
 */
function getWeatherAdjustedWeight(p: PokemonSpecies, weather: WeatherState): number {
  let baseWeight = getSpawnWeight(p);

  const isRaining = weather.condition === "rain" || weather.condition === "thunderstorm";
  const isSunny = weather.condition === "clear";

  const isWaterType = p.types.some((t) => WATER_TYPES.has(t));
  const isFireType = p.types.some((t) => FIRE_TYPES.has(t));

  // Clima de chuva: agua 3x mais comum
  if (isRaining && isWaterType) {
    baseWeight *= 3;
  }

  // Clima ensolarado: fogo 3x mais comum
  if (isSunny && isFireType) {
    baseWeight *= 3;
  }

  return baseWeight;
}

/**
 * Selecao ponderada com ajuste de clima
 */
function weatherWeightedRandomSelect(pool: PokemonSpecies[], count: number, weather: WeatherState): PokemonSpecies[] {
  if (pool.length === 0 || count === 0) return [];

  const weights = pool.map((p) => getWeatherAdjustedWeight(p, weather));
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
      {
        rarity: "epico", label: "Kit Epico", color: "#A855F7", rewards: [
          { type: "money", quantity: 3000 },
          { type: "item", itemId: "ultra-ball", itemName: "Ultra Ball", quantity: 2 },
          { type: "item", itemId: "hyper-potion", itemName: "Hyper Pocao", quantity: 1 },
        ]
      },
      {
        rarity: "epico", label: "Kit Epico", color: "#A855F7", rewards: [
          { type: "money", quantity: 2500 },
          { type: "item", itemId: "rare-candy", itemName: "Rare Candy", quantity: 1 },
        ]
      },
      {
        rarity: "epico", label: "Kit Epico", color: "#A855F7", rewards: [
          { type: "money", quantity: 2000 },
          { type: "item", itemId: "great-ball", itemName: "Great Ball", quantity: 3 },
          { type: "item", itemId: "revive", itemName: "Revive", quantity: 2 },
        ]
      },
      {
        rarity: "epico", label: "Kit Epico", color: "#A855F7", rewards: [
          { type: "money", quantity: 1500 },
          { type: "item", itemId: "radar-battery", itemName: "Bateria do Radar", quantity: 1 },
        ]
      },
    ];
    return options[Math.floor(Math.random() * options.length)];
  }

  if (roll < 0.40) {
    // Raro
    const options: GiftKit[] = [
      {
        rarity: "raro", label: "Kit Raro", color: "#3B82F6", rewards: [
          { type: "money", quantity: 1200 },
          { type: "item", itemId: "great-ball", itemName: "Great Ball", quantity: 2 },
        ]
      },
      {
        rarity: "raro", label: "Kit Raro", color: "#3B82F6", rewards: [
          { type: "money", quantity: 1000 },
          { type: "item", itemId: "super-potion", itemName: "Super Pocao", quantity: 2 },
        ]
      },
      {
        rarity: "raro", label: "Kit Raro", color: "#3B82F6", rewards: [
          { type: "item", itemId: "pokeball", itemName: "Pokeball", quantity: 3 },
          { type: "item", itemId: "potion", itemName: "Pocao", quantity: 2 },
          { type: "money", quantity: 800 },
        ]
      },
    ];
    return options[Math.floor(Math.random() * options.length)];
  }

  // Normal
  const options: GiftKit[] = [
    {
      rarity: "normal", label: "Kit Normal", color: "#22C55E", rewards: [
        { type: "money", quantity: 600 },
      ]
    },
    {
      rarity: "normal", label: "Kit Normal", color: "#22C55E", rewards: [
        { type: "item", itemId: "pokeball", itemName: "Pokeball", quantity: 1 },
      ]
    },
    {
      rarity: "normal", label: "Kit Normal", color: "#22C55E", rewards: [
        { type: "money", quantity: 400 },
        { type: "item", itemId: "potion", itemName: "Pocao", quantity: 1 },
      ]
    },
    {
      rarity: "normal", label: "Kit Normal", color: "#22C55E", rewards: [
        { type: "money", quantity: 300 },
      ]
    },
  ];
  return options[Math.floor(Math.random() * options.length)];
}

// ─── Tipos de ponto no radar ────────────────────────────────
interface PawPrint {
  id: string;
  x: number;
  y: number;
  opacity: number;
}

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
  // Movement
  vAngle: number; // velocidade angular (graus/tick)
  vDist: number;  // velocidade radial (/tick)
  pawPrints: PawPrint[];
}

interface ExplorationRadarProps {
  onStartCapture?: (speciesId: number) => void;
  onStartWildBattle?: (speciesId: number) => void;
}

export function ExplorationRadar({ onStartCapture, onStartWildBattle }: ExplorationRadarProps) {
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

  // Estado do clima
  const [weather, setWeather] = useState<WeatherState>({
    condition: "unknown",
    description: "Carregando...",
    temperature: 0,
    city: "",
    lastUpdated: 0,
  });

  // Carregar clima ao montar componente
  useEffect(() => {
    fetchWeather().then(setWeather);
    // Atualizar clima a cada 10 minutos
    const weatherInterval = setInterval(() => {
      fetchWeather().then(setWeather);
    }, 10 * 60 * 1000);
    return () => clearInterval(weatherInterval);
  }, []);

  // ── Movimentacao dos blips com rastro de patinhas ──
  // ── Movimentacao dos blips com rastro de patinhas ──
  useEffect(() => {
    if (blips.length === 0 || scanning) return;

    const moveInterval = setInterval(() => {
      setBlips((prev) =>
        prev.map((blip) => {
          if (blip.isGift || blip.isEgg) return blip;

          let newVAngle = blip.vAngle;
          let newVDist = blip.vDist;

          // Mudança aleatória de direção
          if (Math.random() < 0.08) {
            newVAngle = (Math.random() - 0.5) * 8;
            newVDist = (Math.random() - 0.5) * 0.02;
          }

          const speedMultiplier = 2;

          const radarSize = 280;
          const center = radarSize / 2;
          const maxR = center - 16;

          // 📍 POSIÇÃO ATUAL (antes de mover)
          const currentRad = (blip.angle * Math.PI) / 180;
          const currentX =
            center + Math.cos(currentRad) * maxR * blip.distance;
          const currentY =
            center + Math.sin(currentRad) * maxR * blip.distance;

          // 🏃 NOVA POSIÇÃO
          let newAngle = blip.angle + newVAngle * speedMultiplier;
          let newDist = blip.distance + newVDist * speedMultiplier;

          // Bounce nas bordas
          if (newDist > 0.85) {
            newDist = 0.85;
            newVDist = -Math.abs(newVDist);
          }
          if (newDist < 0.12) {
            newDist = 0.12;
            newVDist = Math.abs(newVDist);
          }

          // 📍 NOVA POSIÇÃO CARTESIANA
          const newRad = (newAngle * Math.PI) / 180;
          const newX =
            center + Math.cos(newRad) * maxR * newDist;
          const newY =
            center + Math.sin(newRad) * maxR * newDist;

          // 🔄 ÂNGULO REAL DE MOVIMENTO
          const deltaX = newX - currentX;
          const deltaY = newY - currentY;

          const movementAngle =
            (Math.atan2(deltaY, deltaX) * 180) / Math.PI;

          // 🐾 NOVA PATINHA (posição anterior)
          const newPaw: PawPrint = {
            id: `paw-${Date.now()}-${Math.random()}`,
            x: currentX,
            y: currentY,
            opacity: 0.7,
            rotation: movementAngle + 90,
            // ajuste para -90 se necessário
          };

          // 🐾 RASTRO LONGO
          const updatedPaws = [...blip.pawPrints, newPaw]
            .map((p) => ({
              ...p,
              opacity: Math.max(0, p.opacity - 0.02),
            }))
            .filter((p) => p.opacity > 0.005);

          return {
            ...blip,
            angle: newAngle,
            distance: newDist,
            vAngle: newVAngle,
            vDist: newVDist,
            pawPrints: updatedPaws,
          };
        })
      );
    }, 120);

    return () => clearInterval(moveInterval);
  }, [blips.length, scanning]);

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
        const secs = Math.floor((remaining % 60000) / 3000);
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

    // Usar clima atual para filtrar e ponderar Pokemon
    const pool = getRadarPool(weather);

    // Distribuicao ponderada: 0 possivel, 1-2 normal, 3 pode acontecer, 4 raro, 5 muito raro
    const spawnRoll = Math.random();
    let finalCount: number;
    if (spawnRoll < 0.08) finalCount = 0;       // 8%  - nenhum
    else if (spawnRoll < 0.38) finalCount = 1;   // 30% - normal
    else if (spawnRoll < 0.70) finalCount = 2;   // 32% - normal
    else if (spawnRoll < 0.88) finalCount = 3;   // 18% - pode acontecer
    else if (spawnRoll < 0.97) finalCount = 4;   // 9%  - raro
    else finalCount = 5;                          // 3%  - muito raro

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
          vAngle: 0,
          vDist: 0,
          pawPrints: [],
        };
        setBlips([giftBlip]);
        playGift();
        setScanMessage("1 presente detectado!");
        setTimeout(() => setScanMessage(null), 1000);
        return;
      }
      setScanMessage("Nenhum Pokemon detectado nesta area...");
      setTimeout(() => setScanMessage(null), 1000);
      return;
    }

    // Selecao ponderada com ajuste de clima
    const selected = weatherWeightedRandomSelect(pool, finalCount, weather);

    const newBlips: RadarBlip[] = selected.map((p, i) => ({
      id: `${p.id}-${Date.now()}-${i}`,
      pokemon: p,
      isGift: false,
      isEgg: false,
      angle: Math.random() * 360,
      distance: 0.2 + Math.random() * 0.65,
      delay: i * 0.3,
      vAngle: (Math.random() - 0.5) * 3,   // -1.5 a +1.5 graus/tick
      vDist: (Math.random() - 0.5) * 0.008, // radial drift
      pawPrints: [],
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
        vAngle: 0,
        vDist: 0,
        pawPrints: [],
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
        vAngle: 0,
        vDist: 0,
        pawPrints: [],
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
    setTimeout(() => setScanMessage(null), 1000);
  }, [weather]);

  // ── Iniciar scan ──
  const startScan = useCallback(() => {
    if (scanning) return;
    if (energy.charges <= 0) {
      setScanMessage("Sem energia! Aguarde a recarga.");
      setTimeout(() => setScanMessage(null), 1000);
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
        setTimeout(() => setClaimedEgg(null), 1000);
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
      setTimeout(() => setClaimedGift(null), 1000);
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

  const handleBattle = () => {
    if (!selectedBlip || !onStartWildBattle || !selectedBlip.pokemon) return;
    onStartWildBattle(selectedBlip.pokemon.id);
    setBlips((prev) => prev.filter((b) => b.id !== selectedBlip.id));
    setSelectedBlip(null);
  };

  const radarSize = 280;
  const center = radarSize / 2;

  return (
    <div className="flex flex-col items-center h-full overflow-auto py-4 px-3 gap-4">

      {/* Titulo + Energia + Clima */}
      <div className="flex items-center justify-between w-full max-w-sm">
        {/* Indicador de clima e localizacao */}
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg" style={{ background: "rgba(0,0,0,0.3)" }}>
          <span className="text-base">
            {weather.condition === "clear" && "☀️"}
            {weather.condition === "rain" && "🌧️"}
            {weather.condition === "thunderstorm" && "⛈️"}
            {weather.condition === "clouds" && "☁️"}
            {weather.condition === "snow" && "❄️"}
            {weather.condition === "unknown" && "🌡️"}
          </span>
          <div className="flex flex-col">
            {/* Nome da cidade em destaque */}
            <span className="text-[11px] font-bold text-foreground leading-tight">
              {weather.city || "Localizando..."}
            </span>
            <span className="text-[9px] text-muted-foreground leading-tight">
              {weather.description}
              {weather.temperature > 0 && ` - ${weather.temperature}°C`}
            </span>
          </div>
          {/* Bonus indicator */}
          <div className="flex flex-col gap-0.5">
            {(weather.condition === "rain" || weather.condition === "thunderstorm") && (
              <span className="text-[8px] px-1 py-0.5 rounded font-bold" style={{ background: "rgba(59,130,246,0.3)", color: "#60A5FA" }}>
                +Agua
              </span>
            )}
            {weather.condition === "clear" && (
              <span className="text-[8px] px-1 py-0.5 rounded font-bold" style={{ background: "rgba(239,68,68,0.3)", color: "#F87171" }}>
                +Fogo
              </span>
            )}
            {isNightTime() && (
              <span className="text-[8px] px-1 py-0.5 rounded font-bold" style={{ background: "rgba(139,92,246,0.3)", color: "#A78BFA" }}>
                +Noturno
              </span>
            )}
          </div>
        </div>

        {/* Bateria com raio */}
        <div className="flex items-center">
          {recoveryTimer && !energy.batteryActive && (
            <span style={{ paddingRight: 5 }} className="text-[10px] text-muted-foreground font-mono">{recoveryTimer}</span>
          )}
          <BatteryIcon charges={energy.charges} max={energy.batteryActive ? BATTERY_ENERGY : MAX_ENERGY} />
          {energy.batteryActive
            ? <span style={{ color: "#EAB308", fontSize: 10, paddingLeft: 2 }}>{energy.charges / BATTERY_ENERGY * 100}%</span>
            : <span style={{ color: "#595753", fontSize: 10, paddingLeft: 2 }}>{energy.charges / MAX_ENERGY * 100}%</span>
          }
        </div>

      </div>

      {/* Mensagem */}
      <AnimatePresence>
        {scanMessage && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute text-xs font-medium text-center px-3 py-1.5 rounded-lg"
            style={{ backgroundColor: "rgb(0, 3, 1)", color: "#22C55E", top: 270, zIndex: 77 }}
          >
            {scanMessage}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Radar circular */}
      <div

        className="z-20 relative shrink-0"
        style={{ width: radarSize, height: radarSize }}
      >
        {/* Fundo do radar */}
        <svg
          width={radarSize}
          height={radarSize}
          viewBox={`0 0 ${radarSize} ${radarSize}`}
          className="absolute inset-0 "
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
          <circle cx={center} cy={center} r={4} fill="#1a3c26" opacity={0.9} />
          <circle cx={center} cy={center} r={7} fill="none" stroke="#102216" strokeWidth={1} opacity={0.4} />
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

        {/* Paw prints trail */}
        <svg
          className="absolute inset-0 pointer-events-none z-[5]"
          width={radarSize}
          height={radarSize}
          viewBox={`0 0 ${radarSize} ${radarSize}`}
        >
          {blips.flatMap((blip) =>
            blip.pawPrints.map((paw) => (
              <g
                key={paw.id}
                opacity={paw.opacity}
                transform={`translate(${paw.x}, ${paw.y}) rotate(${paw.rotation})`}
              >
                {/* Small paw - 3 toes + pad */}
                <circle cx={-2.5} cy={-3} r={1.2} fill="rgba(34,197,94,0.7)" />
                <circle cx={0} cy={-4} r={1.2} fill="rgba(34,197,94,0.7)" />
                <circle cx={2.5} cy={-3} r={1.2} fill="rgba(34,197,94,0.7)" />
                <ellipse cx={0} cy={0} rx={2.5} ry={2} fill="rgba(34,197,94,0.6)" />
              </g>
            ))
          )}
        </svg>

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
                animate={{ scale: 1, opacity: 1, left: x - 12, top: y - 12 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ delay: blip.delay, type: "spring", stiffness: 300, damping: 20, left: { duration: 0.35, ease: "easeOut", delay: 0 }, top: { duration: 0.35, ease: "easeOut", delay: 0 } }}
                className="absolute z-10 group"
                style={{
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
                      <ellipse cx="12" cy="13" rx="8" ry="10" fill="white" opacity="0.9" />
                    </svg>
                  ) : blip.isGift ? (
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="white">
                      <path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 110-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 100-5C13 2 12 7 12 7z" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
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
            border: "2px solid rgba(118, 255, 6, 0.3)",
            boxShadow: "0 0 20px rgba(34,197,94,0.1), inset 0 0 30px rgba(0,0,0,0.4)",
          }}
        />
      </div>

      {/* Progress bar during scan */}
      {/* {scanning && (
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
      )} */}



      {/* Botão de scan */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, width: '100%' }}>
        <Button
          onClick={startScan}
          disabled={scanning || energy.charges <= 0}
          className="w-full  h-12 text-sm font-bold relative overflow-hidden"
          style={{
            backgroundColor: scanning ? "rgba(16, 80, 148, 0.15)" : energy.charges > 0 ? "#22C55E" : "rgba(255,255,255,0.08)",
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
              Escaneando
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <RadarIcon />
              {energy.charges > 0 ? "Iniciar" : "Sem Energia"}
            </span>
          )}
        </Button>


        <>
          <Button
            disabled={!selectedBlip || !selectedBlip.pokemon}
            onClick={handleBattle}
            className="w-full max-w-sm h-12 text-sm font-bold relative overflow-hidden"
            style={{ backgroundColor: selectedBlip && selectedBlip.pokemon ? "#b91c1c" : "#333645" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
              <path d="M13 19l6-6" />
              <path d="M16 16l4 4" />
              <path d="M19 21l2-2" />
            </svg>
            {selectedBlip && selectedBlip.pokemon ? "Batalhar" : ""}
          </Button>
          <Button
            disabled={!selectedBlip || !selectedBlip.pokemon}
            onClick={handleCapture}
            className="w-full max-w-sm h-12 text-sm font-bold relative overflow-hidden"
            style={{ backgroundColor: selectedBlip && selectedBlip.pokemon ? "#c88941" : "#333645" }}
          >
            <svg width="16" height="16" viewBox="0 0 100 100" className="mr-1">
              <circle cx="50" cy="50" r="48" fill={selectedBlip && selectedBlip.pokemon ? "#EF4444" : "#1E293B"} stroke="#1E293B" strokeWidth="3" />
              <rect x="2" y="48" width="96" height="4" fill="#1E293B" />
              <path d="M 2 50 A 48 48 0 0 0 98 50" fill="#F1F5F9" />
              <circle cx="50" cy="50" r="14" fill="#F1F5F9" stroke="#1E293B" strokeWidth="3" />
              <circle cx="50" cy="50" r="7" fill="#1E293B" />
            </svg>
            {selectedBlip && selectedBlip.pokemon ? "Capturar" : ""}
          </Button>
        </>
      </div>


      {/* Painel do presente coletado */}
      <AnimatePresence>
        {claimedGift && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className=" w-full max-w-sm rounded-xl border-2 p-4 flex flex-col items-center gap-3"
            style={{
              borderColor: claimedGift.color,
              background: `linear-gradient(135deg, rgb(0, 0, 0) 0%, ${claimedGift.color}20 100%)`,
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
                <path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 110-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 100-5C13 2 12 7 12 7z" />
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
            <rect x="2" y="7" width="16" height="10" rx="2" ry="2" /><line x1="22" y1="11" x2="22" y2="13" /><line x1="10" y1="11" x2="10" y2="13" />
          </svg>
          Ativar Super Bateria ({bagBatteryCount} na bolsa)
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
                <ellipse cx="20" cy="26" rx="14" ry="18" fill={EGG_TIER_COLORS[claimedEgg.tier].bg} opacity="0.9" />
                <ellipse cx="20" cy="26" rx="14" ry="18" fill="none" stroke="white" strokeWidth="1.5" opacity="0.4" />
                <ellipse cx="15" cy="20" rx="3" ry="4" fill="white" opacity="0.25" transform="rotate(-15 15 20)" />
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
            className="absolute z-0  w-full max-w-sm rounded-xl  p-4 flex flex-col items-center gap-3"
            style={{
              background: ` ${TYPE_COLORS[selectedBlip.pokemon.types[0] as PokemonType]}15 100%)`,
            }} >
            {/* Pokemon sprite */}
            <div className="relative">
              <div
                className="absolute -inset-6 rounded-full blur-2xl opacity-60"
                style={{ backgroundColor: TYPE_COLORS[selectedBlip.pokemon.types[0] as PokemonType], top: 70 }}
              />
              <img
                src={getSpriteUrl(selectedBlip.pokemon.id)}
                alt={selectedBlip.pokemon.name}
                width={100}
                height={100}
                className="relative z-0  pixelated drop-shadow-[0_6px_10px_rgba(0,0,0,0.6)]"
                style={isDiscovered(selectedBlip.pokemon.id) ? { top: 70 } : { filter: "saturate(0%) brightness(0.0)", top: 70 }}
                crossOrigin="anonymous"
                loading="lazy"
              />
            </div>

            {/* Info */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs text-muted-foreground font-mono">
                {isDiscovered(selectedBlip.pokemon.id) ? `#${String(selectedBlip.pokemon.id).padStart(3, "0")}` : ""}
              </span>
              <span style={{ top: 8, zIndex: 0 }} className="absolute text-base font-bold text-foreground capitalize">
                {isDiscovered(selectedBlip.pokemon.id) ? selectedBlip.pokemon.name : ""}
              </span>


            </div>

            {/* Botão capturar */}



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
  const w = max == 10 ? 90 : size;
  const h = size * 0.55;

  return (
    <svg width={w} height={h} viewBox="0 0 40 22" className="shrink-0">
      {/* Corpo da bateria */}
      <rect x="1" y="3" width={max == 10 ? "80" : "33"} height="16" rx="3" ry="3" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground" />
      {/* Terminal da bateria */}
      <rect x={max == 10 ? "80" : "34"} y="7" width="4" height="8" rx="1" fill="currentColor" className="text-muted-foreground" />
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

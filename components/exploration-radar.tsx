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
import { ScanIcon, Star } from "lucide-react";
import { StarDustFullscreenAnimation } from "@/components/star-dust-animation";

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
  // GEN 1 - Kanto
  144, 145, 146, 150, 151,

  // GEN 2 - Johto
  243, 244, 245, 249, 250, 251,

  // GEN 3 - Hoenn
  377, 378, 379, 380, 381, 382, 383, 384, 385, 386,

  // GEN 4 - Sinnoh
  480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493,

  // GEN 5 - Unova
  494, 638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649,

  // GEN 6 - Kalos
  716, 717, 718, 719, 720, 721,

  // GEN 7 - Alola (+ Ultra Beasts)
  772, 773, 785, 786, 787, 788, 789, 790, 791, 792, 793, 794, 795,
  796, 797, 798, 799, 800, 801, 802, 803, 804, 805, 806, 807, 808, 809,

  // GEN 8 - Galar (+ Crown Tundra/Isle of Armor)
  888, 889, 890, 891, 892, 893, 894, 895, 896, 897, 898, 905,

  // GEN 9 - Paldea (+ Teal Mask/Indigo Disk)
  1001, 1002, 1003, 1004, 1007, 1008, 1014, 1015, 1016, 1017,
  1020, 1021, 1022, 1023, 1024, 1025
]);

// Fosseis - somente em metas ofensivas
const FOSSIL_IDS = new Set([
  // GEN 1 - Kanto
  138, 139,      // Omanyte, Omastar
  140, 141,      // Kabuto, Kabutops
  142,           // Aerodactyl

  // GEN 3 - Hoenn
  345, 346,      // Lileep, Cradily
  347, 348,      // Anorith, Armaldo

  // GEN 4 - Sinnoh
  408, 409,      // Cranidos, Rampardos
  410, 411,      // Shieldon, Bastiodon

  // GEN 5 - Unova
  564, 565,      // Tirtouga, Carracosta
  566, 567,      // Archen, Archeops

  // GEN 6 - Kalos
  696, 697,      // Tyrunt, Tyrantrum
  698, 699,      // Amaura, Aurorus

  // GEN 8 - Galar (Fósseis Combinados)
  880,           // Dracozolt
  881,           // Arctozolt
  882,           // Dracovish
  883            // Arctovish
]);
// Raros especiais - somente em metas ofensivas
const RARE_SPECIAL_IDS = new Set([
  // GEN 1 - Kanto
  132,           // Ditto (Transformação)

  // GEN 2 - Johto
  201,           // Unown (28 formas/Alfabeto)
  235,           // Smeargle (Sketch/Copia movimentos)

  // GEN 3 - Hoenn
  290,           // Nincada (Gera dois Pokémon na evolução)
  292,           // Shedinja (1 HP / Wonder Guard)
  327,           // Spinda (Bilhões de padrões de manchas)
  351,           // Castform (Mudança de clima)
  352,           // Kecleon (Mudança de tipo/Invisibilidade)

  // GEN 4 - Sinnoh
  441,           // Chatot (Gravação de voz/Chatter)
  442,           // Spiritomb (Encontro especial de 108 almas)
  479,           // Rotom (Possessão de eletrodomésticos)

  // GEN 5 - Unova
  550,           // Basculin (Múltiplas formas de listras)
  570, 571,      // Zorua & Zoroark (Ilusão/Copia aparência)

  // GEN 6 - Kalos
  666,           // Vivillon (20 padrões baseados em localização real)
  676,           // Furfrou (Cortes de pelo customizáveis)

  // GEN 7 - Alola
  774,           // Minior (Forma meteoro/Núcleo colorido)

  // GEN 8 - Galar
  845,           // Cramorant (Gulp Missile/Engole presas)
  854, 855,      // Sinistea & Polteageist (Versões Autênticas vs Falsas)
  876,           // Indeedee (Diferença drástica entre gêneros)

  // GEN 9 - Paldea
  922,           // Pawmot (Ressurreição em batalha)
  990,           // Iron Valiant (Paradoxo - fusão visual)
  999, 1000      // Gimmighoul & Gholdengo (Coleta de 999 moedas)
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
  [1, 151],    // G1 - Kanto
  [152, 251],  // G2 - Johto
  [252, 386],  // G3 - Hoenn
  [387, 493],  // G4 - Sinnoh
  [494, 649],  // G5 - Unova
  [650, 721],  // G6 - Kalos
  [722, 809],  // G7 - Alola
  [810, 905],  // G8 - Galar & Hisui
  [906, 1025], // G9 - Paldea (Inclui DLCs: Teal Mask / Indigo Disk)
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

// ─── Estrela cadente de Stardust ────────────────────────────
interface StardustMeteor {
  id: string;
  startAngle: number; // angulo inicial (graus)
  startDistance: number; // distancia inicial do centro (0-1)
  angle: number; // angulo atual
  distance: number; // distancia atual
  speed: number; // velocidade do movimento
  direction: number; // direcao do movimento (angulo em graus)
  stardust: number; // quantidade de stardust (100-700)
  opacity: number; // opacidade atual
  collected: boolean; // se ja foi coletada
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
  const { addMoney, addBagItem, addEgg, eggs, bag, addStarDust } = useGameStore();
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
  const [stardustMeteors, setStardustMeteors] = useState<StardustMeteor[]>([]);
  const [stardustAnimation, setStardustAnimation] = useState<{ active: boolean; amount: number }>({ active: false, amount: 0 });
  const scanInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const meteorInterval = useRef<ReturnType<typeof setInterval> | null>(null);

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

  // ── Spawn de estrelas cadentes de Stardust ──
  useEffect(() => {
    // Chance de spawn a cada 20-35 segundos
    const spawnMeteor = () => {
      if (Math.random() > 0.25) return; // 25% chance de spawn
      
      // Posicao inicial: borda do radar em um angulo aleatorio
      const startAngle = Math.random() * 360;
      // Direcao de movimento: atravessa o radar (angulo oposto + variacao)
      const direction = (startAngle + 180 + (Math.random() - 0.5) * 60) % 360;
      
      const newMeteor: StardustMeteor = {
        id: `meteor-${Date.now()}-${Math.random()}`,
        startAngle,
        startDistance: 0.95, // Comeca na borda
        angle: startAngle,
        distance: 0.95,
        speed: 0.015 + Math.random() * 0.01, // Velocidade variavel
        direction,
        stardust: Math.floor(Math.random() * 601) + 100, // 100-700
        opacity: 1,
        collected: false,
      };
      
      setStardustMeteors(prev => [...prev, newMeteor]);
    };

    const spawnInterval = setInterval(spawnMeteor, 20000 + Math.random() * 15000);
    
    // Spawn inicial apos 8 segundos
    const initialSpawn = setTimeout(() => {
      if (Math.random() < 0.3) spawnMeteor();
    }, 8000);

    return () => {
      clearInterval(spawnInterval);
      clearTimeout(initialSpawn);
    };
  }, []);

  // ── Movimento das estrelas cadentes ──
  useEffect(() => {
    if (stardustMeteors.length === 0) return;

    meteorInterval.current = setInterval(() => {
      setStardustMeteors(prev => {
        return prev
          .map(meteor => {
            if (meteor.collected) return meteor;
            
            // Calcular nova posicao baseada na direcao
            const dirRad = (meteor.direction * Math.PI) / 180;
            const currentRad = (meteor.angle * Math.PI) / 180;
            
            // Posicao cartesiana atual
            const currentX = Math.cos(currentRad) * meteor.distance;
            const currentY = Math.sin(currentRad) * meteor.distance;
            
            // Nova posicao cartesiana
            const newX = currentX + Math.cos(dirRad) * meteor.speed;
            const newY = currentY + Math.sin(dirRad) * meteor.speed;
            
            // Converter de volta para polar
            const newDistance = Math.sqrt(newX * newX + newY * newY);
            const newAngle = (Math.atan2(newY, newX) * 180) / Math.PI;
            
            return {
              ...meteor,
              angle: newAngle,
              distance: newDistance,
              // Fade out quando se aproxima da borda oposta
              opacity: newDistance > 0.8 ? Math.max(0, 1 - (newDistance - 0.8) / 0.2) : 1,
            };
          })
          // Remover meteoros que sairam do radar ou foram coletados
          .filter(meteor => meteor.distance < 1.1 && !meteor.collected);
      });
    }, 50);

    return () => {
      if (meteorInterval.current) clearInterval(meteorInterval.current);
    };
  }, [stardustMeteors.length]);

  // ── Handler de clique na estrela cadente ──
  const handleMeteorClick = useCallback((meteor: StardustMeteor) => {
    if (meteor.collected) return;
    
    // Marcar como coletada
    setStardustMeteors(prev => prev.filter(m => m.id !== meteor.id));
    
    // Adicionar stardust
    addStarDust(meteor.stardust);
    
    // Mostrar animacao
    setStardustAnimation({ active: true, amount: meteor.stardust });
    
    playGift();
  }, [addStarDust]);

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
  const startScanAgain = useCallback(() => {



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


  // ── Iniciar scan ──
  const startScan = useCallback(() => {


    if (blips.length > 0) {


    } else {

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



    }


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
    <div className="flex flex-col items-center h-full overflow-auto py-4 px-3 gap-4 bg-slate-950 font-mono text-cyan-400">

      {/* TOP HUD: Weather & Energy */}
      <div className="flex items-center justify-between w-full max-w-sm border-b border-cyan-900/50 pb-2 mb-2">
        <div className="flex items-center gap-3 px-3 py-1 bg-black/60 border-l-2 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
          <span className="text-xl animate-pulse">
            {weather.condition === "clear" && "☀️"}
            {weather.condition === "rain" && "🌧️"}
            {weather.condition === "thunderstorm" && "⛈️"}
            {weather.condition === "clouds" && "☁️"}
            {weather.condition === "unknown" && "📡"}
          </span>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-tighter text-cyan-500/70">Location_Signal</span>
            <span className="text-xs font-black text-white uppercase truncate max-w-[100px]">
              {weather.city || "Searching..."}
            </span>
          </div>

          <div className="flex gap-1">
            {(weather.condition === "rain" || weather.condition === "thunderstorm") && (
              <span className="text-[9px] px-1.5 py-0.5 bg-blue-600/20 border border-blue-500 text-blue-400 font-bold animate-pulse">
                WATER_UP
              </span>
            )}
            {weather.condition === "clear" && (
              <span className="text-[9px] px-1.5 py-0.5 bg-red-600/20 border border-red-500 text-red-400 font-bold animate-pulse">
                FIRE_UP
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[9px] uppercase text-cyan-500/50 mb-1">Power_Core</span>
          <div className="flex items-center gap-2">
            {recoveryTimer && !energy.batteryActive && (
              <span className="text-[10px] text-cyan-600 animate-pulse">{recoveryTimer}</span>
            )}
            <div className="relative">
              <BatteryIcon charges={energy.charges} max={energy.batteryActive ? BATTERY_ENERGY : MAX_ENERGY} />
              <div className="absolute inset-0 shadow-[0_0_10px_rgba(34,197,94,0.3)] pointer-events-none" />
            </div>
            <span className={`text-xs font-bold ${energy.batteryActive ? 'text-yellow-400' : 'text-cyan-400'}`}>
              {Math.floor((energy.charges / (energy.batteryActive ? BATTERY_ENERGY : MAX_ENERGY)) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* MAIN RADAR AREA */}
      <div
        onClick={startScan}
        className="z-20 relative shrink-0 cursor-crosshair group"
        style={{ width: radarSize, height: radarSize }}
      >
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,_#061b1b_0%,_#000000_100%)] border border-cyan-500/30 overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,118,0.06))] bg-[length:100%_2px,3px_100%]" />
        </div>

        <svg width={radarSize} height={radarSize} className="absolute inset-0">
          {[0.25, 0.5, 0.75, 1].map((r) => (
            <circle
              key={r}
              cx={center} cy={center} r={center * r - 2}
              fill="none"
              stroke="rgba(6, 182, 212, 0.2)"
              strokeWidth={1}
              strokeDasharray={r === 1 ? "0" : "4 4"}
            />
          ))}
          <line x1={center} y1="0" x2={center} y2={radarSize} stroke="rgba(6, 182, 212, 0.3)" strokeWidth={0.5} />
          <line x1="0" y1={center} x2={radarSize} y2={center} stroke="rgba(6, 182, 212, 0.3)" strokeWidth={0.5} />
        </svg>

        {/* PAW PRINTS LAYER (Adicionadas aqui no estilo anterior) */}
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
                {/* Paw visual - Estilo minimalista combinando com o radar */}
                <circle cx={-2.5} cy={-3} r={1.2} fill="rgba(6, 182, 212, 0.6)" />
                <circle cx={0} cy={-4} r={1.2} fill="rgba(6, 182, 212, 0.6)" />
                <circle cx={2.5} cy={-3} r={1.2} fill="rgba(6, 182, 212, 0.6)" />
                <ellipse cx={0} cy={0} rx={2.5} ry={2} fill="rgba(6, 182, 212, 0.4)" />
              </g>
            ))
          )}
        </svg>

        {/* Scanning Sweep - Radar Clássico */}
        {/* Scanning Sweep - Radar Clássico Alinhado */}
        {scanning && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-10"
            style={{ transformOrigin: "center center" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            {/* O Rastro (Fatia de Luz) - Ajustado para alinhar com o topo */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                // "from 0deg" começa no topo (12h), exatamente onde a linha está
                // O rastro de 25% (90 graus) fica "atrás" da linha no sentido horário
                background: `conic-gradient(from 0deg at 50% 50%, rgba(34, 211, 238, 0.14) 1%, transparent 60%)`,
                maskImage: 'radial-gradient(circle, black 35%, transparent 100%)',
                WebkitMaskImage: 'radial-gradient(circle, black 35%, transparent 100%)',
                transform: 'rotate(-90deg)' // Compensação para o gradiente colar na linha
              }}
            />

            {/* A Linha do Ponteiro (O Scanner Laser) */}
            <div
              className="absolute top-0 left-1/2 w-[2px] h-1/2 bg-cyan-400"
              style={{
                transform: "translateX(-50%)",
                boxShadow: "0 0 15px #22d3ee, 0 0 5px #fff"
              }}
            />

            {/* Ponto de luz na ponta (Efeito lente) */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_12px_#22d3ee]"
            />
          </motion.div>
        )}

        {/* Stardust Meteors - Estrelas Cadentes */}
        <AnimatePresence>
          {stardustMeteors.map((meteor) => {
            const rad = (meteor.angle * Math.PI) / 180;
            const maxR = center - 10;
            const x = center + Math.cos(rad) * maxR * meteor.distance;
            const y = center + Math.sin(rad) * maxR * meteor.distance;
            
            // Calcular rotacao da cauda: oposta a direcao do movimento
            // A cauda deve apontar para onde a estrela VEIO, nao para onde vai
            const tailRotation = meteor.direction + 180;
            
            return (
              <motion.button
                key={meteor.id}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: meteor.opacity,
                  left: x - 12,
                  top: y - 12,
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.1 }}
                className="absolute z-40 cursor-pointer group"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMeteorClick(meteor);
                }}
              >
                <div className="relative w-6 h-6 flex items-center justify-center">
                  {/* Rastro da estrela cadente - aponta para tras */}
                  <div 
                    className="absolute w-10 h-[3px] origin-right"
                    style={{
                      transform: `rotate(${tailRotation}deg)`,
                      right: '50%',
                      background: "linear-gradient(to left, rgba(253,224,71,0.9), rgba(253,224,71,0.4), transparent)",
                      borderRadius: "2px",
                    }}
                  />
                  
                  {/* Rastro secundario mais longo e suave */}
                  <div 
                    className="absolute w-14 h-[2px] origin-right"
                    style={{
                      transform: `rotate(${tailRotation}deg)`,
                      right: '50%',
                      background: "linear-gradient(to left, rgba(253,224,71,0.5), rgba(255,255,255,0.2), transparent)",
                      borderRadius: "2px",
                    }}
                  />
                  
                  {/* Estrela principal */}
                  <Star 
                    className="w-4 h-4 text-yellow-400 animate-pulse relative z-10" 
                    fill="currentColor"
                    style={{
                      filter: "drop-shadow(0 0 8px rgba(253,224,71,1)) drop-shadow(0 0 4px rgba(255,255,255,0.9))",
                    }}
                  />
                  
                  {/* Brilho extra */}
                  <div className="absolute w-4 h-4 rounded-full bg-yellow-400/40 blur-sm animate-ping" />
                </div>
                
                {/* Tooltip com valor */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-black/80 border border-yellow-500/50 px-2 py-0.5 rounded text-[9px] text-yellow-400 font-bold whitespace-nowrap">
                    +{meteor.stardust} Stardust
                  </div>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>

        {/* Blips & Entities */}
        {/* Blips & Entities */}
        <AnimatePresence>
          {blips.map((blip) => {
            const rad = (blip.angle * Math.PI) / 180;
            const maxR = center - 20;
            const x = center + Math.cos(rad) * maxR * blip.distance;
            const y = center + Math.sin(rad) * maxR * blip.distance;

            // Verifica se este blip é o alvo selecionado
            const isSelected = selectedBlip?.id === blip.id;

            // Lógica de cores original
            const color = blip.isEgg
              ? (EGG_TIER_COLORS[blip.egg?.tier || "green"].bg)
              : blip.isGift
                ? (blip.giftKit?.color || "#F59E0B")
                : TYPE_COLORS[(blip.pokemon?.types[0] || "normal")];

            return (
              <motion.button
                key={blip.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  left: x - 12,
                  top: y - 12,
                  zIndex: isSelected ? 50 : 30 // Alvo clicado fica por cima de tudo
                }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute group transition-transform active:scale-90"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBlipClick(blip);
                }}
              >
                <div className="relative w-7 h-7 flex items-center justify-center">

                  {/* DESTAQUE DE ALVO CLICADO (Target Lock Brackets) */}
                  {isSelected && (
                    <>
                      {/* Cantoneiras de Mira Estilo Sniper */}
                      <motion.div
                        initial={{ scale: 1.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute inset-0 pointer-events-none"
                      >
                        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2" style={{ borderColor: color }} />
                        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2" style={{ borderColor: color }} />
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2" style={{ borderColor: color }} />
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2" style={{ borderColor: color }} />
                      </motion.div>

                      {/* Pulso de Radar Circular no Alvo */}
                      <motion.div
                        animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: "easeOut" }}
                        className="absolute inset-0 rounded-full border-2"
                        style={{ borderColor: color }}
                      />
                    </>
                  )}

                  {/* Anel Giratório Padrão (Fica mais opaco se selecionado) */}
                  <div
                    className={`absolute inset-1 border border-dashed rounded-full animate-spin-slow ${isSelected ? 'opacity-100 border-2' : 'opacity-40 border-1'}`}
                    style={{ borderColor: color }}
                  />

                  {/* Ponto Central (Blip) */}
                  <div
                    className={`w-2.5 h-2.5 rounded-full shadow-[0_0_10px_currentColor] transition-all duration-300`}
                    style={{
                      backgroundColor: color,
                      color: color,
                      boxShadow: isSelected ? `0 0 20px ${color}` : `0 0 8px ${color}`,
                      transform: isSelected ? 'scale(1.2)' : 'scale(1)'
                    }}
                  />

                  {/* Indicador visual para itens especiais */}
                  {(blip.isEgg || blip.isGift) && !isSelected && (
                    <span className="absolute -top-1 -right-1 text-[8px] drop-shadow-md">
                      {blip.isEgg ? "🥚" : "🎁"}
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>

        <div className="absolute -inset-2 border-2 border-cyan-500/20 rounded-full pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950 px-2 text-[8px] text-cyan-500 font-bold">RADAR_V3.0</div>

        </div>
      </div>
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


      {/* POKEMON DATA OVERLAY */}
      <AnimatePresence mode="wait">
        {selectedBlip && selectedBlip.pokemon && (
          <motion.div
            key={selectedBlip.id}
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-20 bg-black/90 border-t-2 border-b-2 border-cyan-500 py-2 w-full max-w-sm flex items-center px-3 gap-2 backdrop-blur-md z-[100] shadow-[0_0_30px_rgba(6,182,212,0.2)]"
          >
            {/* NOVO: Botão Start Scan integrado ao Card */}
            <Button
              onClick={(e) => { e.stopPropagation(); startScanAgain(); }}
              disabled={scanning}
              // Adicionado !bg-transparent e active:!bg-cyan-500/20 para travar a cor
              className={`
    relative shrink-0 w-12 h-16 flex flex-col items-center justify-center gap-1 
    border-r border-cyan-500/30 pr-3 transition-all duration-200
    !bg-transparent hover:!bg-cyan-500/10 active:!bg-cyan-500/20 
    !text-cyan-400 focus:ring-0 focus:outline-none outline-none
    ${scanning ? 'opacity-40 grayscale' : 'opacity-100'}
  `}
            >
              {/* Glow Effect de fundo (Só aparece quando não está escaneando) */}
              {!scanning && (
                <div className="absolute inset-0 bg-cyan-500/5 animate-pulse -z-10" />
              )}

              {/* Ícone 📡 */}
              <div className="relative">
                <span className={`text-xl block leading-none ${scanning ? 'animate-spin opacity-50' : 'text-cyan-400'}`}>
                  📡
                </span>
                {/* Sombra interna do ícone */}
                {!scanning && (
                  <div className="absolute inset-0 blur-[6px] bg-cyan-400/40 rounded-full -z-10" />
                )}
              </div>

              {/* Texto Scan */}
              <span className={`
    text-[8px] font-black uppercase tracking-[0.15em] mt-1
    ${scanning ? 'text-cyan-800' : 'text-cyan-500'}
  `}>
                {scanning ? 'Wait' : 'Scan'}
              </span>

              {/* Pequeno detalhe de "LED" na base do botão */}
              <div className={`
    w-4 h-[2px] mt-1 rounded-full
    ${scanning ? 'bg-cyan-900' : 'bg-cyan-400 shadow-[0_0_5px_#22d3ee]'}
  `} />
            </Button>
            {/* Sprite Slot */}
            <div className="relative shrink-0 w-14 h-14 bg-cyan-950/30 border border-cyan-500/50 rounded overflow-hidden p-1">
              <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,191,255,0.1)_50%)] bg-[length:100%_4px] pointer-events-none z-10" />
              <img
                src={getSpriteUrl(selectedBlip.pokemon.id)}
                className={`w-full h-full pixelated object-contain relative z-0 ${!isDiscovered(selectedBlip.pokemon.id) && 'brightness-0 opacity-70'}`}
                alt="target"
              />
              <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-cyan-400" />
              <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-cyan-400" />
            </div>

            {/* Info Group */}
            <div className="flex flex-col min-w-[65px] max-w-[80px]">
              <span className="text-[7px] text-cyan-500/70 font-black tracking-tighter leading-none">ID:{String(selectedBlip.pokemon.id).padStart(3, '0')}</span>
              <span className="text-[11px] font-black text-white uppercase italic truncate mt-0.5">
                {isDiscovered(selectedBlip.pokemon.id) ? selectedBlip.pokemon.name : "UNK_DATA"}
              </span>
              <div className="flex gap-1 mt-1">
                <span className="text-[6px] px-1 bg-cyan-500 text-black font-black uppercase">
                  {isDiscovered(selectedBlip.pokemon.id) ? selectedBlip.pokemon.types[0] : "???"}
                </span>
              </div>
            </div>

            {/* Action Buttons Group */}
            <div className="flex flex-1 gap-1 items-center pl-1 border-l border-cyan-900/50">
              <Button
                onClick={(e) => { e.stopPropagation(); handleBattle(); }}
                className="flex-1 h-9 px-0 bg-red-600/10 border border-red-600/50 text-red-500 text-[8px] font-black uppercase skew-x-[-12deg] hover:bg-red-600 hover:text-white transition-all active:scale-95"
              >
                <span className="skew-x-[12deg]">⚔️ BATTLE</span>
              </Button>

              <Button
                onClick={(e) => { e.stopPropagation(); handleCapture(); }}
                className="flex-1 h-9 px-0 bg-cyan-600/10 border border-cyan-600/50 text-cyan-400 text-[8px] font-black uppercase skew-x-[-12deg] hover:bg-cyan-600 hover:text-white transition-all active:scale-95"
              >
                <span className="skew-x-[12deg]">🎯 GET</span>
              </Button>
            </div>

            {/* Decorative Line */}
            <div className="absolute top-0 right-4 -translate-y-full">
              <div className="h-[1px] w-6 bg-cyan-500/40" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stardust Animation */}
      <StarDustFullscreenAnimation
        amount={stardustAnimation.amount}
        isActive={stardustAnimation.active}
        type="gain"
        onComplete={() => setStardustAnimation({ active: false, amount: 0 })}
      />
    </div>
  );
}

// ─── Ícone de bateria com raio    ─────────────────────────────
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

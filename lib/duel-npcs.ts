// NPCs de Duelo - Treinadores para batalhas PvE

export interface DuelNpcPokemon {
  speciesId: number;
  nome: string;
  level: number;
}

export interface DuelNpc {
  id: string;
  nome: string;
  imagem: string;
  fraseDesafio: string;
  nivel: "facil" | "medio" | "dificil" | "elite" | "lendario" | "superboss";
  recompensa: number;
  stardust: number;
  xp: number;
  ia: string;
  time: DuelNpcPokemon[];
  tipoEspecialidade?: string;
  semana?: number;
}

// NPCs Normais
export const npcs: DuelNpc[] = [
  // FACEIS
  {
    id: "kai",
    nome: "Kai",
    imagem: "/images/trainers/kai.png",
    fraseDesafio: "Voce parece forte... mas meus Pokemon vao surpreender voce!",
    nivel: "facil",
    recompensa: 100,
    stardust: 180,
    xp: 50,
    ia: "aleatoria",
    time: [
      { speciesId: 19, nome: "Rattata", level: 12 },
      { speciesId: 16, nome: "Pidgey", level: 11 },
      { speciesId: 41, nome: "Zubat", level: 13 }
    ]
  },
  {
    id: "milo",
    nome: "Milo",
    imagem: "/images/trainers/milo.png",
    fraseDesafio: "Vamos ver se voce consegue acompanhar meu ritmo!",
    nivel: "facil",
    recompensa: 120,
    stardust: 240,
    xp: 60,
    ia: "aleatoria",
    time: [
      { speciesId: 25, nome: "Pikachu", level: 15 },
      { speciesId: 52, nome: "Meowth", level: 14 },
      { speciesId: 54, nome: "Psyduck", level: 16 }
    ]
  },
  {
    id: "nina",
    nome: "Nina",
    imagem: "/images/trainers/nina.png",
    fraseDesafio: "Nao subestime o poder da fofura!",
    nivel: "facil",
    recompensa: 150,
    stardust: 320,
    xp: 70,
    ia: "defensiva",
    time: [
      { speciesId: 39, nome: "Jigglypuff", level: 17 },
      { speciesId: 173, nome: "Cleffa", level: 15 },
      { speciesId: 174, nome: "Igglybuff", level: 14 }
    ]
  },
  {
    id: "rex",
    nome: "Rex",
    imagem: "/images/trainers/rex.png",
    fraseDesafio: "Forca bruta resolve qualquer batalha!",
    nivel: "facil",
    recompensa: 180,
    stardust: 400,
    xp: 80,
    ia: "agressiva",
    time: [
      { speciesId: 66, nome: "Machop", level: 18 },
      { speciesId: 74, nome: "Geodude", level: 17 },
      { speciesId: 56, nome: "Mankey", level: 16 }
    ]
  },

  // MEDIOS
  {
    id: "luna",
    nome: "Luna",
    imagem: "/images/trainers/luna.png",
    fraseDesafio: "Estrategia vence forca. Vamos testar isso!",
    nivel: "medio",
    recompensa: 300,
    stardust: 1100,
    xp: 150,
    ia: "estrategica",
    time: [
      { speciesId: 133, nome: "Eevee", level: 25 },
      { speciesId: 135, nome: "Jolteon", level: 28 },
      { speciesId: 134, nome: "Vaporeon", level: 27 }
    ]
  },
  {
    id: "drake",
    nome: "Drake",
    imagem: "/images/trainers/drake.png",
    fraseDesafio: "Meus dragoes vao dominar essa arena!",
    nivel: "medio",
    recompensa: 350,
    stardust: 1500,
    xp: 180,
    ia: "agressiva",
    time: [
      { speciesId: 148, nome: "Dragonair", level: 32 },
      { speciesId: 130, nome: "Gyarados", level: 33 },
      { speciesId: 149, nome: "Dragonite", level: 36 }
    ]
  },
  {
    id: "sora",
    nome: "Sora",
    imagem: "/images/trainers/sora.png",
    fraseDesafio: "Cada movimento meu tem um proposito.",
    nivel: "medio",
    recompensa: 320,
    stardust: 1300,
    xp: 160,
    ia: "balanceada",
    time: [
      { speciesId: 282, nome: "Gardevoir", level: 33 },
      { speciesId: 303, nome: "Mawile", level: 30 },
      { speciesId: 407, nome: "Roserade", level: 34 }
    ]
  },
  {
    id: "victor",
    nome: "Victor",
    imagem: "/images/trainers/victor.png",
    fraseDesafio: "As aguas sao profundas... e perigosas.",
    nivel: "medio",
    recompensa: 400,
    stardust: 1700,
    xp: 200,
    ia: "agressiva",
    time: [
      { speciesId: 130, nome: "Gyarados", level: 35 },
      { speciesId: 121, nome: "Starmie", level: 33 },
      { speciesId: 119, nome: "Seaking", level: 31 }
    ]
  },

  // DIFICEIS
  {
    id: "barak",
    nome: "Barak",
    imagem: "/images/trainers/barak.png",
    fraseDesafio: "Voce chegou longe... mas aqui termina sua jornada!",
    nivel: "dificil",
    recompensa: 600,
    stardust: 3200,
    xp: 350,
    ia: "agressiva",
    time: [
      { speciesId: 6, nome: "Charizard", level: 45 },
      { speciesId: 94, nome: "Gengar", level: 44 },
      { speciesId: 212, nome: "Scizor", level: 43 },
      { speciesId: 149, nome: "Dragonite", level: 47 }
    ]
  },

  // ELITE
  {
    id: "helena",
    nome: "Helena",
    imagem: "/images/trainers/helena.png",
    fraseDesafio: "A elite nao perde. Prove que voce e diferente.",
    nivel: "elite",
    recompensa: 1200,
    stardust: 5000,
    xp: 600,
    ia: "competitiva",
    time: [
      { speciesId: 150, nome: "Mewtwo", level: 60 },
      { speciesId: 384, nome: "Rayquaza", level: 62 },
      { speciesId: 249, nome: "Lugia", level: 58 }
    ]
  },

  // LENDARIOS
  {
    id: "arkan",
    nome: "Arkan",
    imagem: "/images/trainers/arkan.png",
    fraseDesafio: "Voce ousa desafiar o poder supremo?",
    nivel: "lendario",
    recompensa: 2000,
    stardust: 5200,
    xp: 800,
    ia: "chefe",
    time: [
      { speciesId: 493, nome: "Arceus", level: 70 },
      { speciesId: 150, nome: "Mewtwo", level: 68 },
      { speciesId: 384, nome: "Rayquaza", level: 69 }
    ]
  }
];

// Super Bosses Semanais (liberados ao vencer 10 batalhas no fim de semana)
export const superBossSemanal: DuelNpc[] = [
  // SEMANA 1 - TIPO FOGO
  {
    id: "ignar",
    semana: 1,
    nome: "Ignar, O Infernal",
    imagem: "/images/trainers/ignar.png",
    fraseDesafio: "O fogo consome tudo... inclusive sua esperanca!",
    tipoEspecialidade: "Fire",
    nivel: "superboss",
    recompensa: 5000,
    stardust: 5500,
    xp: 1500,
    ia: "chefe_lendario",
    time: [
      { speciesId: 6, nome: "Charizard", level: 75 },
      { speciesId: 146, nome: "Moltres", level: 78 },
      { speciesId: 485, nome: "Heatran", level: 80 },
      { speciesId: 392, nome: "Infernape", level: 76 },
      { speciesId: 500, nome: "Emboar", level: 74 },
      { speciesId: 38, nome: "Ninetales", level: 73 }
    ]
  },

  // SEMANA 2 - TIPO AGUA
  {
    id: "nerida",
    semana: 2,
    nome: "Nerida, A Profunda",
    imagem: "/images/trainers/nerida.png",
    fraseDesafio: "Voce vai afundar nas profundezas do meu poder!",
    tipoEspecialidade: "Water",
    nivel: "superboss",
    recompensa: 5200,
    stardust: 5400,
    xp: 1550,
    ia: "chefe_lendario",
    time: [
      { speciesId: 382, nome: "Kyogre", level: 82 },
      { speciesId: 130, nome: "Gyarados", level: 78 },
      { speciesId: 484, nome: "Palkia", level: 80 },
      { speciesId: 245, nome: "Suicune", level: 77 },
      { speciesId: 121, nome: "Starmie", level: 74 },
      { speciesId: 9, nome: "Blastoise", level: 76 }
    ]
  },

  // SEMANA 3 - TIPO ELETRICO
  {
    id: "voltaris",
    semana: 3,
    nome: "Voltaris, O Tempestuoso",
    imagem: "/images/trainers/voltaris.png",
    fraseDesafio: "Voce sera atingido antes mesmo de perceber!",
    tipoEspecialidade: "Electric",
    nivel: "superboss",
    recompensa: 5300,
    stardust: 5450,
    xp: 1600,
    ia: "chefe_lendario",
    time: [
      { speciesId: 145, nome: "Zapdos", level: 80 },
      { speciesId: 243, nome: "Raikou", level: 79 },
      { speciesId: 466, nome: "Electivire", level: 76 },
      { speciesId: 135, nome: "Jolteon", level: 75 },
      { speciesId: 479, nome: "Rotom", level: 77 },
      { speciesId: 26, nome: "Raichu", level: 74 }
    ]
  },

  // SEMANA 4 - TIPO SOMBRIO
  {
    id: "umbra",
    semana: 4,
    nome: "Umbra, A Soberana das Sombras",
    imagem: "/images/trainers/umbra.png",
    fraseDesafio: "Na escuridao... eu sou absoluta.",
    tipoEspecialidade: "Dark",
    nivel: "superboss",
    recompensa: 5500,
    stardust: 5500,
    xp: 1700,
    ia: "chefe_final",
    time: [
      { speciesId: 491, nome: "Darkrai", level: 85 },
      { speciesId: 197, nome: "Umbreon", level: 80 },
      { speciesId: 461, nome: "Weavile", level: 78 },
      { speciesId: 282, nome: "Gardevoir", level: 77 },
      { speciesId: 248, nome: "Tyranitar", level: 82 },
      { speciesId: 442, nome: "Spiritomb", level: 79 }
    ]
  }
];

// Funcao para gerar desafios aleatorios
export function generateRandomChallenges(count: number = 5): DuelNpc[] {
  const shuffled = [...npcs].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Funcao para verificar se o boss semanal esta disponivel
export function getWeeklyBoss(): DuelNpc | null {
  const now = new Date();
  const weekNumber = Math.ceil((now.getDate()) / 7);
  const boss = superBossSemanal.find(b => b.semana === ((weekNumber - 1) % 4) + 1);
  return boss || null;
}

// Funcao para obter cor baseada no nivel
export function getNivelColor(nivel: DuelNpc["nivel"]): string {
  switch (nivel) {
    case "facil": return "#22c55e";
    case "medio": return "#f59e0b";
    case "dificil": return "#ef4444";
    case "elite": return "#8b5cf6";
    case "lendario": return "#ec4899";
    case "superboss": return "#f97316";
    default: return "#64748b";
  }
}

// Funcao para obter label do nivel
export function getNivelLabel(nivel: DuelNpc["nivel"]): string {
  switch (nivel) {
    case "facil": return "Facil";
    case "medio": return "Medio";
    case "dificil": return "Dificil";
    case "elite": return "Elite";
    case "lendario": return "Lendario";
    case "superboss": return "Super Boss";
    default: return nivel;
  }
}

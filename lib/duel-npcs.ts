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

  {
    id: "aaron",
    nome: "Aaron",
    imagem: "/images/trainers/aaron.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 2051,
    stardust: 793,
    xp: 209,
    ia: "defensiva",
    time: [
      { speciesId: 299, nome: "Nosepass", level: 79 },
      { speciesId: 222, nome: "Corsola", level: 16 },
      { speciesId: 670, nome: "Floette", level: 11 },
      { speciesId: 623, nome: "Golurk", level: 19 },
      { speciesId: 960, nome: "Wiglett", level: 65 },
      { speciesId: 125, nome: "Electabuzz", level: 21 }
    ]
  },

  {
    id: "aarune",
    nome: "Aarune",
    imagem: "/images/trainers/aarune.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 2410,
    stardust: 4161,
    xp: 353,
    ia: "aleatoria",
    time: [
      { speciesId: 954, nome: "Rabsca", level: 15 },
      { speciesId: 817, nome: "Drizzile", level: 66 },
      { speciesId: 596, nome: "Galvantula", level: 38 },
      { speciesId: 58, nome: "Growlithe", level: 73 },
      { speciesId: 17, nome: "Pidgeotto", level: 44 },
      { speciesId: 759, nome: "Stufful", level: 55 }
    ]
  },

  {
    id: "acerola-masters",
    nome: "Acerola-masters",
    imagem: "/images/trainers/acerola-masters.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 823,
    stardust: 3217,
    xp: 109,
    ia: "agressiva",
    time: [
      { speciesId: 277, nome: "Swellow", level: 74 },
      { speciesId: 88, nome: "Grimer", level: 61 },
      { speciesId: 567, nome: "Archeops", level: 20 },
      { speciesId: 258, nome: "Mudkip", level: 15 },
      { speciesId: 845, nome: "Cramorant", level: 28 },
      { speciesId: 634, nome: "Zweilous", level: 39 }
    ]
  },

  {
    id: "acerola-masters2",
    nome: "Acerola-masters2",
    imagem: "/images/trainers/acerola-masters2.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 2947,
    stardust: 2595,
    xp: 123,
    ia: "aleatoria",
    time: [
      { speciesId: 304, nome: "Aron", level: 12 },
      { speciesId: 116, nome: "Horsea", level: 25 },
      { speciesId: 500, nome: "Emboar", level: 17 },
      { speciesId: 78, nome: "Rapidash", level: 35 },
      { speciesId: 164, nome: "Noctowl", level: 11 },
      { speciesId: 769, nome: "Sandygast", level: 15 }
    ]
  },

  {
    id: "acerola-masters3",
    nome: "Acerola-masters3",
    imagem: "/images/trainers/acerola-masters3.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 2144,
    stardust: 2940,
    xp: 398,
    ia: "aleatoria",
    time: [
      { speciesId: 973, nome: "Flamigo", level: 44 },
      { speciesId: 649, nome: "Genesect", level: 73 },
      { speciesId: 381, nome: "Latios", level: 16 },
      { speciesId: 715, nome: "Noivern", level: 67 },
      { speciesId: 507, nome: "Herdier", level: 23 },
      { speciesId: 193, nome: "Yanma", level: 75 }
    ]
  },

  {
    id: "acerola",
    nome: "Acerola",
    imagem: "/images/trainers/acerola.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 2953,
    stardust: 3306,
    xp: 465,
    ia: "estrategica",
    time: [
      { speciesId: 394, nome: "Prinplup", level: 69 },
      { speciesId: 682, nome: "Spritzee", level: 62 },
      { speciesId: 715, nome: "Noivern", level: 18 },
      { speciesId: 926, nome: "Fidough", level: 48 },
      { speciesId: 271, nome: "Lombre", level: 79 },
      { speciesId: 93, nome: "Haunter", level: 59 }
    ]
  },

  {
    id: "acetrainer-gen1",
    nome: "Acetrainer-gen1",
    imagem: "/images/trainers/acetrainer-gen1.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 1602,
    stardust: 1204,
    xp: 409,
    ia: "aleatoria",
    time: [
      { speciesId: 437, nome: "Bronzong", level: 38 },
      { speciesId: 740, nome: "Crabominable", level: 47 },
      { speciesId: 983, nome: "Kingambit", level: 79 },
      { speciesId: 685, nome: "Slurpuff", level: 78 },
      { speciesId: 518, nome: "Musharna", level: 73 },
      { speciesId: 767, nome: "Wimpod", level: 64 }
    ]
  },

  {
    id: "acetrainer-gen1rb",
    nome: "Acetrainer-gen1rb",
    imagem: "/images/trainers/acetrainer-gen1rb.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 2766,
    stardust: 3081,
    xp: 246,
    ia: "estrategica",
    time: [
      { speciesId: 927, nome: "Dachsbun", level: 44 },
      { speciesId: 889, nome: "Zamazenta", level: 11 },
      { speciesId: 957, nome: "Tinkatink", level: 77 },
      { speciesId: 61, nome: "Poliwhirl", level: 40 },
      { speciesId: 462, nome: "Magnezone", level: 14 },
      { speciesId: 115, nome: "Kangaskhan", level: 36 }
    ]
  },

  {
    id: "acetrainer-gen2",
    nome: "Acetrainer-gen2",
    imagem: "/images/trainers/acetrainer-gen2.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 561,
    stardust: 2343,
    xp: 254,
    ia: "estrategica",
    time: [
      { speciesId: 70, nome: "Weepinbell", level: 66 },
      { speciesId: 882, nome: "Dracovish", level: 18 },
      { speciesId: 489, nome: "Phione", level: 57 },
      { speciesId: 630, nome: "Mandibuzz", level: 68 },
      { speciesId: 121, nome: "Starmie", level: 55 },
      { speciesId: 303, nome: "Mawile", level: 43 }
    ]
  },

  {
    id: "acetrainer-gen3",
    nome: "Acetrainer-gen3",
    imagem: "/images/trainers/acetrainer-gen3.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 2490,
    stardust: 1303,
    xp: 147,
    ia: "estrategica",
    time: [
      { speciesId: 441, nome: "Chatot", level: 48 },
      { speciesId: 640, nome: "Virizion", level: 30 },
      { speciesId: 436, nome: "Bronzor", level: 33 },
      { speciesId: 944, nome: "Shroodle", level: 56 },
      { speciesId: 43, nome: "Oddish", level: 24 },
      { speciesId: 202, nome: "Wobbuffet", level: 18 }
    ]
  },

  {
    id: "acetrainer-gen3jp",
    nome: "Acetrainer-gen3jp",
    imagem: "/images/trainers/acetrainer-gen3jp.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 2900,
    stardust: 5037,
    xp: 255,
    ia: "agressiva",
    time: [
      { speciesId: 718, nome: "Zygarde-50", level: 75 },
      { speciesId: 174, nome: "Igglybuff", level: 36 },
      { speciesId: 138, nome: "Omanyte", level: 46 },
      { speciesId: 680, nome: "Doublade", level: 30 },
      { speciesId: 966, nome: "Revavroom", level: 41 },
      { speciesId: 516, nome: "Simipour", level: 73 }
    ]
  },

  {
    id: "acetrainer-gen3rs",
    nome: "Acetrainer-gen3rs",
    imagem: "/images/trainers/acetrainer-gen3rs.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 2981,
    stardust: 4580,
    xp: 296,
    ia: "defensiva",
    time: [
      { speciesId: 659, nome: "Bunnelby", level: 72 },
      { speciesId: 630, nome: "Mandibuzz", level: 61 },
      { speciesId: 728, nome: "Popplio", level: 73 },
      { speciesId: 170, nome: "Chinchou", level: 77 },
      { speciesId: 555, nome: "Darmanitan-standard", level: 75 },
      { speciesId: 222, nome: "Corsola", level: 43 }
    ]
  },

  {
    id: "acetrainer-gen4",
    nome: "Acetrainer-gen4",
    imagem: "/images/trainers/acetrainer-gen4.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 1815,
    stardust: 2280,
    xp: 51,
    ia: "agressiva",
    time: [
      { speciesId: 125, nome: "Electabuzz", level: 65 },
      { speciesId: 517, nome: "Munna", level: 71 },
      { speciesId: 585, nome: "Deerling", level: 17 },
      { speciesId: 943, nome: "Mabosstiff", level: 41 },
      { speciesId: 420, nome: "Cherubi", level: 38 },
      { speciesId: 248, nome: "Tyranitar", level: 66 }
    ]
  },

  {
    id: "acetrainer-gen4dp",
    nome: "Acetrainer-gen4dp",
    imagem: "/images/trainers/acetrainer-gen4dp.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 2543,
    stardust: 2071,
    xp: 184,
    ia: "defensiva",
    time: [
      { speciesId: 172, nome: "Pichu", level: 74 },
      { speciesId: 565, nome: "Carracosta", level: 79 },
      { speciesId: 487, nome: "Giratina-altered", level: 41 },
      { speciesId: 396, nome: "Starly", level: 20 },
      { speciesId: 77, nome: "Ponyta", level: 38 },
      { speciesId: 378, nome: "Regice", level: 58 }
    ]
  },

  {
    id: "acetrainer-gen6",
    nome: "Acetrainer-gen6",
    imagem: "/images/trainers/acetrainer-gen6.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 2100,
    stardust: 5204,
    xp: 443,
    ia: "estrategica",
    time: [
      { speciesId: 958, nome: "Tinkatuff", level: 70 },
      { speciesId: 449, nome: "Hippopotas", level: 43 },
      { speciesId: 935, nome: "Charcadet", level: 80 },
      { speciesId: 943, nome: "Mabosstiff", level: 34 },
      { speciesId: 852, nome: "Clobbopus", level: 75 },
      { speciesId: 218, nome: "Slugma", level: 68 }
    ]
  },

  {
    id: "acetrainer-gen6xy",
    nome: "Acetrainer-gen6xy",
    imagem: "/images/trainers/acetrainer-gen6xy.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 527,
    stardust: 4476,
    xp: 124,
    ia: "defensiva",
    time: [
      { speciesId: 199, nome: "Slowking", level: 46 },
      { speciesId: 249, nome: "Lugia", level: 26 },
      { speciesId: 839, nome: "Coalossal", level: 64 },
      { speciesId: 292, nome: "Shedinja", level: 53 },
      { speciesId: 414, nome: "Mothim", level: 57 },
      { speciesId: 934, nome: "Garganacl", level: 37 }
    ]
  },

  {
    id: "acetrainer-gen7",
    nome: "Acetrainer-gen7",
    imagem: "/images/trainers/acetrainer-gen7.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 2300,
    stardust: 3528,
    xp: 335,
    ia: "defensiva",
    time: [
      { speciesId: 881, nome: "Arctozolt", level: 44 },
      { speciesId: 621, nome: "Druddigon", level: 36 },
      { speciesId: 904, nome: "Overqwil", level: 33 },
      { speciesId: 79, nome: "Slowpoke", level: 50 },
      { speciesId: 995, nome: "Iron-thorns", level: 44 },
      { speciesId: 260, nome: "Swampert", level: 19 }
    ]
  },

  {
    id: "acetrainer",
    nome: "Acetrainer",
    imagem: "/images/trainers/acetrainer.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 361,
    stardust: 1520,
    xp: 250,
    ia: "aleatoria",
    time: [
      { speciesId: 928, nome: "Smoliv", level: 20 },
      { speciesId: 974, nome: "Cetoddle", level: 12 },
      { speciesId: 457, nome: "Lumineon", level: 74 },
      { speciesId: 951, nome: "Capsakid", level: 24 },
      { speciesId: 681, nome: "Aegislash-shield", level: 74 },
      { speciesId: 110, nome: "Weezing", level: 65 }
    ]
  },

  {
    id: "acetrainercouple-gen3",
    nome: "Acetrainercouple-gen3",
    imagem: "/images/trainers/acetrainercouple-gen3.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "dificil",
    recompensa: 1797,
    stardust: 1585,
    xp: 295,
    ia: "estrategica",
    time: [
      { speciesId: 112, nome: "Rhydon", level: 73 },
      { speciesId: 1023, nome: "Iron-crown", level: 67 },
      { speciesId: 288, nome: "Vigoroth", level: 18 },
      { speciesId: 763, nome: "Tsareena", level: 47 },
      { speciesId: 429, nome: "Mismagius", level: 70 },
      { speciesId: 268, nome: "Cascoon", level: 40 }
    ]
  },

  {
    id: "acetrainercouple",
    nome: "Acetrainercouple",
    imagem: "/images/trainers/acetrainercouple.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 2429,
    stardust: 1718,
    xp: 103,
    ia: "aleatoria",
    time: [
      { speciesId: 766, nome: "Passimian", level: 50 },
      { speciesId: 612, nome: "Haxorus", level: 72 },
      { speciesId: 72, nome: "Tentacool", level: 68 },
      { speciesId: 876, nome: "Indeedee-male", level: 54 },
      { speciesId: 71, nome: "Victreebel", level: 71 },
      { speciesId: 455, nome: "Carnivine", level: 18 }
    ]
  },

  {
    id: "acetrainerf-gen1",
    nome: "Acetrainerf-gen1",
    imagem: "/images/trainers/acetrainerf-gen1.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 919,
    stardust: 3096,
    xp: 349,
    ia: "defensiva",
    time: [
      { speciesId: 330, nome: "Flygon", level: 28 },
      { speciesId: 591, nome: "Amoonguss", level: 63 },
      { speciesId: 607, nome: "Litwick", level: 63 },
      { speciesId: 695, nome: "Heliolisk", level: 78 },
      { speciesId: 857, nome: "Hattrem", level: 14 },
      { speciesId: 53, nome: "Persian", level: 60 }
    ]
  },

  {
    id: "acetrainerf-gen1rb",
    nome: "Acetrainerf-gen1rb",
    imagem: "/images/trainers/acetrainerf-gen1rb.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 1173,
    stardust: 603,
    xp: 269,
    ia: "defensiva",
    time: [
      { speciesId: 941, nome: "Kilowattrel", level: 26 },
      { speciesId: 464, nome: "Rhyperior", level: 71 },
      { speciesId: 254, nome: "Sceptile", level: 16 },
      { speciesId: 766, nome: "Passimian", level: 39 },
      { speciesId: 281, nome: "Kirlia", level: 11 },
      { speciesId: 69, nome: "Bellsprout", level: 10 }
    ]
  },

  {
    id: "acetrainerf-gen2",
    nome: "Acetrainerf-gen2",
    imagem: "/images/trainers/acetrainerf-gen2.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 1570,
    stardust: 2139,
    xp: 86,
    ia: "agressiva",
    time: [
      { speciesId: 964, nome: "Palafin-zero", level: 59 },
      { speciesId: 994, nome: "Iron-moth", level: 63 },
      { speciesId: 548, nome: "Petilil", level: 76 },
      { speciesId: 9, nome: "Blastoise", level: 37 },
      { speciesId: 334, nome: "Altaria", level: 33 },
      { speciesId: 215, nome: "Sneasel", level: 49 }
    ]
  },

  {
    id: "acetrainerf-gen3",
    nome: "Acetrainerf-gen3",
    imagem: "/images/trainers/acetrainerf-gen3.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 1558,
    stardust: 130,
    xp: 188,
    ia: "defensiva",
    time: [
      { speciesId: 203, nome: "Girafarig", level: 34 },
      { speciesId: 866, nome: "Mr-rime", level: 54 },
      { speciesId: 66, nome: "Machop", level: 35 },
      { speciesId: 77, nome: "Ponyta", level: 36 },
      { speciesId: 516, nome: "Simipour", level: 72 },
      { speciesId: 365, nome: "Walrein", level: 25 }
    ]
  },

  {
    id: "acetrainerf-gen3rs",
    nome: "Acetrainerf-gen3rs",
    imagem: "/images/trainers/acetrainerf-gen3rs.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 142,
    stardust: 196,
    xp: 479,
    ia: "defensiva",
    time: [
      { speciesId: 706, nome: "Goodra", level: 22 },
      { speciesId: 852, nome: "Clobbopus", level: 44 },
      { speciesId: 256, nome: "Combusken", level: 50 },
      { speciesId: 844, nome: "Sandaconda", level: 62 },
      { speciesId: 688, nome: "Binacle", level: 11 },
      { speciesId: 496, nome: "Servine", level: 44 }
    ]
  },

  {
    id: "acetrainerf-gen4",
    nome: "Acetrainerf-gen4",
    imagem: "/images/trainers/acetrainerf-gen4.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 2409,
    stardust: 3066,
    xp: 99,
    ia: "agressiva",
    time: [
      { speciesId: 3, nome: "Venusaur", level: 56 },
      { speciesId: 328, nome: "Trapinch", level: 31 },
      { speciesId: 913, nome: "Quaxwell", level: 55 },
      { speciesId: 959, nome: "Tinkaton", level: 61 },
      { speciesId: 341, nome: "Corphish", level: 28 },
      { speciesId: 1008, nome: "Miraidon", level: 26 }
    ]
  },

  {
    id: "acetrainerf-gen4dp",
    nome: "Acetrainerf-gen4dp",
    imagem: "/images/trainers/acetrainerf-gen4dp.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 1974,
    stardust: 2239,
    xp: 299,
    ia: "defensiva",
    time: [
      { speciesId: 446, nome: "Munchlax", level: 67 },
      { speciesId: 482, nome: "Azelf", level: 76 },
      { speciesId: 755, nome: "Morelull", level: 21 },
      { speciesId: 236, nome: "Tyrogue", level: 62 },
      { speciesId: 717, nome: "Yveltal", level: 36 },
      { speciesId: 149, nome: "Dragonite", level: 56 }
    ]
  },

  {
    id: "acetrainerf-gen6",
    nome: "Acetrainerf-gen6",
    imagem: "/images/trainers/acetrainerf-gen6.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 466,
    stardust: 4137,
    xp: 275,
    ia: "estrategica",
    time: [
      { speciesId: 864, nome: "Cursola", level: 62 },
      { speciesId: 95, nome: "Onix", level: 12 },
      { speciesId: 881, nome: "Arctozolt", level: 70 },
      { speciesId: 210, nome: "Granbull", level: 56 },
      { speciesId: 940, nome: "Wattrel", level: 15 },
      { speciesId: 809, nome: "Melmetal", level: 11 }
    ]
  },

  {
    id: "acetrainerf-gen6xy",
    nome: "Acetrainerf-gen6xy",
    imagem: "/images/trainers/acetrainerf-gen6xy.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 2402,
    stardust: 1234,
    xp: 340,
    ia: "estrategica",
    time: [
      { speciesId: 952, nome: "Scovillain", level: 18 },
      { speciesId: 1008, nome: "Miraidon", level: 32 },
      { speciesId: 466, nome: "Electivire", level: 59 },
      { speciesId: 432, nome: "Purugly", level: 30 },
      { speciesId: 614, nome: "Beartic", level: 35 },
      { speciesId: 444, nome: "Gabite", level: 50 }
    ]
  },

  {
    id: "acetrainerf-gen7",
    nome: "Acetrainerf-gen7",
    imagem: "/images/trainers/acetrainerf-gen7.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 540,
    stardust: 3705,
    xp: 271,
    ia: "estrategica",
    time: [
      { speciesId: 257, nome: "Blaziken", level: 16 },
      { speciesId: 645, nome: "Landorus-incarnate", level: 48 },
      { speciesId: 879, nome: "Copperajah", level: 70 },
      { speciesId: 846, nome: "Arrokuda", level: 51 },
      { speciesId: 40, nome: "Wigglytuff", level: 65 },
      { speciesId: 388, nome: "Grotle", level: 60 }
    ]
  },

  {
    id: "acetrainerf",
    nome: "Acetrainerf",
    imagem: "/images/trainers/acetrainerf.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 2002,
    stardust: 4437,
    xp: 379,
    ia: "defensiva",
    time: [
      { speciesId: 805, nome: "Stakataka", level: 49 },
      { speciesId: 302, nome: "Sableye", level: 62 },
      { speciesId: 948, nome: "Toedscool", level: 23 },
      { speciesId: 925, nome: "Maushold-family-of-four", level: 25 },
      { speciesId: 837, nome: "Rolycoly", level: 46 },
      { speciesId: 421, nome: "Cherrim", level: 65 }
    ]
  },

  {
    id: "acetrainersnow",
    nome: "Acetrainersnow",
    imagem: "/images/trainers/acetrainersnow.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 2005,
    stardust: 3150,
    xp: 486,
    ia: "estrategica",
    time: [
      { speciesId: 369, nome: "Relicanth", level: 61 },
      { speciesId: 626, nome: "Bouffalant", level: 22 },
      { speciesId: 289, nome: "Slaking", level: 65 },
      { speciesId: 833, nome: "Chewtle", level: 67 },
      { speciesId: 502, nome: "Dewott", level: 59 },
      { speciesId: 20, nome: "Raticate", level: 68 }
    ]
  },

  {
    id: "acetrainersnowf",
    nome: "Acetrainersnowf",
    imagem: "/images/trainers/acetrainersnowf.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 2744,
    stardust: 4700,
    xp: 170,
    ia: "aleatoria",
    time: [
      { speciesId: 494, nome: "Victini", level: 66 },
      { speciesId: 873, nome: "Frosmoth", level: 80 },
      { speciesId: 537, nome: "Seismitoad", level: 61 },
      { speciesId: 635, nome: "Hydreigon", level: 16 },
      { speciesId: 382, nome: "Kyogre", level: 11 },
      { speciesId: 719, nome: "Diancie", level: 68 }
    ]
  },

  {
    id: "adaman-masters",
    nome: "Adaman-masters",
    imagem: "/images/trainers/adaman-masters.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 1899,
    stardust: 457,
    xp: 264,
    ia: "defensiva",
    time: [
      { speciesId: 41, nome: "Zubat", level: 37 },
      { speciesId: 914, nome: "Quaquaval", level: 68 },
      { speciesId: 411, nome: "Bastiodon", level: 47 },
      { speciesId: 526, nome: "Gigalith", level: 33 },
      { speciesId: 259, nome: "Marshtomp", level: 41 },
      { speciesId: 539, nome: "Sawk", level: 51 }
    ]
  },

  {
    id: "adaman",
    nome: "Adaman",
    imagem: "/images/trainers/adaman.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 443,
    stardust: 1933,
    xp: 117,
    ia: "defensiva",
    time: [
      { speciesId: 699, nome: "Aurorus", level: 66 },
      { speciesId: 102, nome: "Exeggcute", level: 54 },
      { speciesId: 437, nome: "Bronzong", level: 12 },
      { speciesId: 566, nome: "Archen", level: 40 },
      { speciesId: 404, nome: "Luxio", level: 42 },
      { speciesId: 204, nome: "Pineco", level: 41 }
    ]
  },

  {
    id: "aetheremployee",
    nome: "Aetheremployee",
    imagem: "/images/trainers/aetheremployee.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 1249,
    stardust: 473,
    xp: 220,
    ia: "estrategica",
    time: [
      { speciesId: 925, nome: "Maushold-family-of-four", level: 32 },
      { speciesId: 64, nome: "Kadabra", level: 21 },
      { speciesId: 882, nome: "Dracovish", level: 36 },
      { speciesId: 626, nome: "Bouffalant", level: 18 },
      { speciesId: 319, nome: "Sharpedo", level: 53 },
      { speciesId: 94, nome: "Gengar", level: 44 }
    ]
  },

  {
    id: "aetheremployeef",
    nome: "Aetheremployeef",
    imagem: "/images/trainers/aetheremployeef.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 2693,
    stardust: 1152,
    xp: 429,
    ia: "defensiva",
    time: [
      { speciesId: 805, nome: "Stakataka", level: 25 },
      { speciesId: 126, nome: "Magmar", level: 23 },
      { speciesId: 842, nome: "Appletun", level: 40 },
      { speciesId: 551, nome: "Sandile", level: 53 },
      { speciesId: 595, nome: "Joltik", level: 72 },
      { speciesId: 600, nome: "Klang", level: 37 }
    ]
  },

  {
    id: "aetherfoundation",
    nome: "Aetherfoundation",
    imagem: "/images/trainers/aetherfoundation.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 1651,
    stardust: 2140,
    xp: 126,
    ia: "estrategica",
    time: [
      { speciesId: 610, nome: "Axew", level: 16 },
      { speciesId: 543, nome: "Venipede", level: 40 },
      { speciesId: 352, nome: "Kecleon", level: 24 },
      { speciesId: 379, nome: "Registeel", level: 22 },
      { speciesId: 130, nome: "Gyarados", level: 11 },
      { speciesId: 590, nome: "Foongus", level: 45 }
    ]
  },

  {
    id: "aetherfoundation2",
    nome: "Aetherfoundation2",
    imagem: "/images/trainers/aetherfoundation2.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 1029,
    stardust: 2345,
    xp: 500,
    ia: "agressiva",
    time: [
      { speciesId: 790, nome: "Cosmoem", level: 64 },
      { speciesId: 405, nome: "Luxray", level: 63 },
      { speciesId: 14, nome: "Kakuna", level: 32 },
      { speciesId: 961, nome: "Wugtrio", level: 46 },
      { speciesId: 755, nome: "Morelull", level: 15 },
      { speciesId: 733, nome: "Toucannon", level: 21 }
    ]
  },

  {
    id: "aetherfoundationf",
    nome: "Aetherfoundationf",
    imagem: "/images/trainers/aetherfoundationf.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 740,
    stardust: 2053,
    xp: 50,
    ia: "aleatoria",
    time: [
      { speciesId: 657, nome: "Frogadier", level: 50 },
      { speciesId: 283, nome: "Surskit", level: 52 },
      { speciesId: 263, nome: "Zigzagoon", level: 12 },
      { speciesId: 455, nome: "Carnivine", level: 68 },
      { speciesId: 286, nome: "Breloom", level: 66 },
      { speciesId: 530, nome: "Excadrill", level: 73 }
    ]
  },

  {
    id: "agatha-gen1",
    nome: "Agatha-gen1",
    imagem: "/images/trainers/agatha-gen1.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 1462,
    stardust: 2930,
    xp: 98,
    ia: "estrategica",
    time: [
      { speciesId: 445, nome: "Garchomp", level: 48 },
      { speciesId: 46, nome: "Paras", level: 54 },
      { speciesId: 658, nome: "Greninja", level: 42 },
      { speciesId: 484, nome: "Palkia", level: 19 },
      { speciesId: 775, nome: "Komala", level: 27 },
      { speciesId: 863, nome: "Perrserker", level: 32 }
    ]
  },

  {
    id: "agatha-gen1rb",
    nome: "Agatha-gen1rb",
    imagem: "/images/trainers/agatha-gen1rb.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 1148,
    stardust: 2453,
    xp: 151,
    ia: "agressiva",
    time: [
      { speciesId: 159, nome: "Croconaw", level: 35 },
      { speciesId: 802, nome: "Marshadow", level: 58 },
      { speciesId: 724, nome: "Decidueye", level: 69 },
      { speciesId: 487, nome: "Giratina-altered", level: 11 },
      { speciesId: 788, nome: "Tapu-fini", level: 41 },
      { speciesId: 612, nome: "Haxorus", level: 18 }
    ]
  },

  {
    id: "agatha-gen3",
    nome: "Agatha-gen3",
    imagem: "/images/trainers/agatha-gen3.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 1129,
    stardust: 2620,
    xp: 358,
    ia: "estrategica",
    time: [
      { speciesId: 351, nome: "Castform", level: 26 },
      { speciesId: 385, nome: "Jirachi", level: 39 },
      { speciesId: 889, nome: "Zamazenta", level: 68 },
      { speciesId: 596, nome: "Galvantula", level: 67 },
      { speciesId: 102, nome: "Exeggcute", level: 55 },
      { speciesId: 808, nome: "Meltan", level: 44 }
    ]
  },

  {
    id: "agatha-lgpe",
    nome: "Agatha-lgpe",
    imagem: "/images/trainers/agatha-lgpe.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 2723,
    stardust: 2382,
    xp: 242,
    ia: "agressiva",
    time: [
      { speciesId: 672, nome: "Skiddo", level: 79 },
      { speciesId: 430, nome: "Honchkrow", level: 50 },
      { speciesId: 756, nome: "Shiinotic", level: 80 },
      { speciesId: 329, nome: "Vibrava", level: 21 },
      { speciesId: 281, nome: "Kirlia", level: 21 },
      { speciesId: 618, nome: "Stunfisk", level: 68 }
    ]
  },

  {
    id: "akari-isekai",
    nome: "Akari-isekai",
    imagem: "/images/trainers/akari-isekai.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 1185,
    stardust: 2061,
    xp: 324,
    ia: "aleatoria",
    time: [
      { speciesId: 285, nome: "Shroomish", level: 69 },
      { speciesId: 47, nome: "Parasect", level: 22 },
      { speciesId: 94, nome: "Gengar", level: 62 },
      { speciesId: 301, nome: "Delcatty", level: 53 },
      { speciesId: 681, nome: "Aegislash-shield", level: 42 },
      { speciesId: 6, nome: "Charizard", level: 25 }
    ]
  },

  {
    id: "akari",
    nome: "Akari",
    imagem: "/images/trainers/akari.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 654,
    stardust: 4594,
    xp: 470,
    ia: "aleatoria",
    time: [
      { speciesId: 891, nome: "Kubfu", level: 68 },
      { speciesId: 41, nome: "Zubat", level: 44 },
      { speciesId: 679, nome: "Honedge", level: 24 },
      { speciesId: 530, nome: "Excadrill", level: 66 },
      { speciesId: 882, nome: "Dracovish", level: 29 },
      { speciesId: 488, nome: "Cresselia", level: 14 }
    ]
  },

  {
    id: "alain",
    nome: "Alain",
    imagem: "/images/trainers/alain.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 1513,
    stardust: 4394,
    xp: 329,
    ia: "defensiva",
    time: [
      { speciesId: 948, nome: "Toedscool", level: 43 },
      { speciesId: 214, nome: "Heracross", level: 14 },
      { speciesId: 576, nome: "Gothitelle", level: 13 },
      { speciesId: 558, nome: "Crustle", level: 49 },
      { speciesId: 381, nome: "Latios", level: 76 },
      { speciesId: 710, nome: "Pumpkaboo-average", level: 80 }
    ]
  },

  {
    id: "alder",
    nome: "Alder",
    imagem: "/images/trainers/alder.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 2461,
    stardust: 2469,
    xp: 99,
    ia: "agressiva",
    time: [
      { speciesId: 547, nome: "Whimsicott", level: 54 },
      { speciesId: 517, nome: "Munna", level: 49 },
      { speciesId: 839, nome: "Coalossal", level: 72 },
      { speciesId: 541, nome: "Swadloon", level: 16 },
      { speciesId: 899, nome: "Wyrdeer", level: 67 },
      { speciesId: 581, nome: "Swanna", level: 23 }
    ]
  },

  {
    id: "alec-anime",
    nome: "Alec-anime",
    imagem: "/images/trainers/alec-anime.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 2541,
    stardust: 4578,
    xp: 163,
    ia: "estrategica",
    time: [
      { speciesId: 273, nome: "Seedot", level: 42 },
      { speciesId: 150, nome: "Mewtwo", level: 13 },
      { speciesId: 507, nome: "Herdier", level: 72 },
      { speciesId: 772, nome: "Type-null", level: 42 },
      { speciesId: 303, nome: "Mawile", level: 16 },
      { speciesId: 206, nome: "Dunsparce", level: 33 }
    ]
  },

  {
    id: "allister-masters",
    nome: "Allister-masters",
    imagem: "/images/trainers/allister-masters.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 1462,
    stardust: 3759,
    xp: 215,
    ia: "agressiva",
    time: [
      { speciesId: 1, nome: "Bulbasaur", level: 37 },
      { speciesId: 180, nome: "Flaaffy", level: 52 },
      { speciesId: 20, nome: "Raticate", level: 76 },
      { speciesId: 145, nome: "Zapdos", level: 22 },
      { speciesId: 706, nome: "Goodra", level: 12 },
      { speciesId: 69, nome: "Bellsprout", level: 17 }
    ]
  },

  {
    id: "allister-unmasked",
    nome: "Allister-unmasked",
    imagem: "/images/trainers/allister-unmasked.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 414,
    stardust: 5065,
    xp: 452,
    ia: "agressiva",
    time: [
      { speciesId: 376, nome: "Metagross", level: 26 },
      { speciesId: 583, nome: "Vanillish", level: 65 },
      { speciesId: 1022, nome: "Iron-boulder", level: 14 },
      { speciesId: 840, nome: "Applin", level: 32 },
      { speciesId: 592, nome: "Frillish", level: 67 },
      { speciesId: 252, nome: "Treecko", level: 12 }
    ]
  },

  {
    id: "allister",
    nome: "Allister",
    imagem: "/images/trainers/allister.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "dificil",
    recompensa: 1867,
    stardust: 2045,
    xp: 289,
    ia: "agressiva",
    time: [
      { speciesId: 231, nome: "Phanpy", level: 16 },
      { speciesId: 960, nome: "Wiglett", level: 74 },
      { speciesId: 284, nome: "Masquerain", level: 54 },
      { speciesId: 84, nome: "Doduo", level: 15 },
      { speciesId: 106, nome: "Hitmonlee", level: 33 },
      { speciesId: 698, nome: "Amaura", level: 41 }
    ]
  },

  {
    id: "amarys",
    nome: "Amarys",
    imagem: "/images/trainers/amarys.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 800,
    stardust: 2035,
    xp: 495,
    ia: "agressiva",
    time: [
      { speciesId: 862, nome: "Obstagoon", level: 42 },
      { speciesId: 456, nome: "Finneon", level: 80 },
      { speciesId: 330, nome: "Flygon", level: 59 },
      { speciesId: 476, nome: "Probopass", level: 45 },
      { speciesId: 285, nome: "Shroomish", level: 56 },
      { speciesId: 873, nome: "Frosmoth", level: 51 }
    ]
  },

  {
    id: "amelia-shuffle",
    nome: "Amelia-shuffle",
    imagem: "/images/trainers/amelia-shuffle.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 2859,
    stardust: 2932,
    xp: 326,
    ia: "agressiva",
    time: [
      { speciesId: 146, nome: "Moltres", level: 11 },
      { speciesId: 250, nome: "Ho-oh", level: 57 },
      { speciesId: 61, nome: "Poliwhirl", level: 13 },
      { speciesId: 64, nome: "Kadabra", level: 68 },
      { speciesId: 853, nome: "Grapploct", level: 39 },
      { speciesId: 777, nome: "Togedemaru", level: 53 }
    ]
  },

  {
    id: "anabel-gen3",
    nome: "Anabel-gen3",
    imagem: "/images/trainers/anabel-gen3.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 1282,
    stardust: 2986,
    xp: 156,
    ia: "defensiva",
    time: [
      { speciesId: 188, nome: "Skiploom", level: 52 },
      { speciesId: 701, nome: "Hawlucha", level: 17 },
      { speciesId: 706, nome: "Goodra", level: 13 },
      { speciesId: 655, nome: "Delphox", level: 75 },
      { speciesId: 1008, nome: "Miraidon", level: 78 },
      { speciesId: 90, nome: "Shellder", level: 67 }
    ]
  },

  {
    id: "anabel-gen7",
    nome: "Anabel-gen7",
    imagem: "/images/trainers/anabel-gen7.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 1706,
    stardust: 4037,
    xp: 72,
    ia: "aleatoria",
    time: [
      { speciesId: 284, nome: "Masquerain", level: 74 },
      { speciesId: 201, nome: "Unown", level: 45 },
      { speciesId: 767, nome: "Wimpod", level: 53 },
      { speciesId: 208, nome: "Steelix", level: 44 },
      { speciesId: 973, nome: "Flamigo", level: 47 },
      { speciesId: 932, nome: "Nacli", level: 48 }
    ]
  },

  {
    id: "anabel",
    nome: "Anabel",
    imagem: "/images/trainers/anabel.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "dificil",
    recompensa: 1407,
    stardust: 4097,
    xp: 329,
    ia: "agressiva",
    time: [
      { speciesId: 68, nome: "Machamp", level: 25 },
      { speciesId: 618, nome: "Stunfisk", level: 35 },
      { speciesId: 795, nome: "Pheromosa", level: 25 },
      { speciesId: 278, nome: "Wingull", level: 29 },
      { speciesId: 531, nome: "Audino", level: 18 },
      { speciesId: 656, nome: "Froakie", level: 67 }
    ]
  },

  {
    id: "anthe",
    nome: "Anthe",
    imagem: "/images/trainers/anthe.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 1766,
    stardust: 1183,
    xp: 418,
    ia: "agressiva",
    time: [
      { speciesId: 188, nome: "Skiploom", level: 68 },
      { speciesId: 799, nome: "Guzzlord", level: 74 },
      { speciesId: 170, nome: "Chinchou", level: 73 },
      { speciesId: 776, nome: "Turtonator", level: 36 },
      { speciesId: 117, nome: "Seadra", level: 32 },
      { speciesId: 464, nome: "Rhyperior", level: 30 }
    ]
  },

  {
    id: "anthea",
    nome: "Anthea",
    imagem: "/images/trainers/anthea.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 384,
    stardust: 4067,
    xp: 452,
    ia: "estrategica",
    time: [
      { speciesId: 806, nome: "Blacephalon", level: 20 },
      { speciesId: 248, nome: "Tyranitar", level: 63 },
      { speciesId: 401, nome: "Kricketot", level: 65 },
      { speciesId: 595, nome: "Joltik", level: 13 },
      { speciesId: 880, nome: "Dracozolt", level: 29 },
      { speciesId: 577, nome: "Solosis", level: 38 }
    ]
  },

  {
    id: "anvin",
    nome: "Anvin",
    imagem: "/images/trainers/anvin.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 1818,
    stardust: 147,
    xp: 441,
    ia: "aleatoria",
    time: [
      { speciesId: 475, nome: "Gallade", level: 78 },
      { speciesId: 82, nome: "Magneton", level: 17 },
      { speciesId: 227, nome: "Skarmory", level: 23 },
      { speciesId: 902, nome: "Basculegion-male", level: 42 },
      { speciesId: 650, nome: "Chespin", level: 32 },
      { speciesId: 98, nome: "Krabby", level: 47 }
    ]
  },

  {
    id: "aquagrunt-rse",
    nome: "Aquagrunt-rse",
    imagem: "/images/trainers/aquagrunt-rse.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 1251,
    stardust: 288,
    xp: 490,
    ia: "defensiva",
    time: [
      { speciesId: 364, nome: "Sealeo", level: 24 },
      { speciesId: 176, nome: "Togetic", level: 74 },
      { speciesId: 579, nome: "Reuniclus", level: 40 },
      { speciesId: 134, nome: "Vaporeon", level: 59 },
      { speciesId: 845, nome: "Cramorant", level: 63 },
      { speciesId: 966, nome: "Revavroom", level: 27 }
    ]
  },

  {
    id: "aquagrunt",
    nome: "Aquagrunt",
    imagem: "/images/trainers/aquagrunt.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 267,
    stardust: 3047,
    xp: 134,
    ia: "estrategica",
    time: [
      { speciesId: 405, nome: "Luxray", level: 10 },
      { speciesId: 623, nome: "Golurk", level: 80 },
      { speciesId: 203, nome: "Girafarig", level: 60 },
      { speciesId: 438, nome: "Bonsly", level: 13 },
      { speciesId: 42, nome: "Golbat", level: 37 },
      { speciesId: 248, nome: "Tyranitar", level: 24 }
    ]
  },

  {
    id: "aquagruntf-rse",
    nome: "Aquagruntf-rse",
    imagem: "/images/trainers/aquagruntf-rse.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 2776,
    stardust: 2074,
    xp: 75,
    ia: "aleatoria",
    time: [
      { speciesId: 237, nome: "Hitmontop", level: 67 },
      { speciesId: 184, nome: "Azumarill", level: 57 },
      { speciesId: 121, nome: "Starmie", level: 68 },
      { speciesId: 533, nome: "Gurdurr", level: 24 },
      { speciesId: 763, nome: "Tsareena", level: 75 },
      { speciesId: 198, nome: "Murkrow", level: 16 }
    ]
  },

  {
    id: "aquagruntf",
    nome: "Aquagruntf",
    imagem: "/images/trainers/aquagruntf.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 2578,
    stardust: 4023,
    xp: 217,
    ia: "aleatoria",
    time: [
      { speciesId: 854, nome: "Sinistea", level: 30 },
      { speciesId: 366, nome: "Clamperl", level: 11 },
      { speciesId: 273, nome: "Seedot", level: 57 },
      { speciesId: 247, nome: "Pupitar", level: 22 },
      { speciesId: 460, nome: "Abomasnow", level: 63 },
      { speciesId: 522, nome: "Blitzle", level: 40 }
    ]
  },

  {
    id: "aquasuit",
    nome: "Aquasuit",
    imagem: "/images/trainers/aquasuit.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 457,
    stardust: 3691,
    xp: 140,
    ia: "defensiva",
    time: [
      { speciesId: 96, nome: "Drowzee", level: 61 },
      { speciesId: 688, nome: "Binacle", level: 37 },
      { speciesId: 424, nome: "Ambipom", level: 77 },
      { speciesId: 117, nome: "Seadra", level: 67 },
      { speciesId: 499, nome: "Pignite", level: 56 },
      { speciesId: 62, nome: "Poliwrath", level: 57 }
    ]
  },

  {
    id: "archer",
    nome: "Archer",
    imagem: "/images/trainers/archer.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 1989,
    stardust: 3087,
    xp: 67,
    ia: "estrategica",
    time: [
      { speciesId: 380, nome: "Latias", level: 62 },
      { speciesId: 977, nome: "Dondozo", level: 35 },
      { speciesId: 36, nome: "Clefable", level: 34 },
      { speciesId: 853, nome: "Grapploct", level: 58 },
      { speciesId: 306, nome: "Aggron", level: 33 },
      { speciesId: 329, nome: "Vibrava", level: 25 }
    ]
  },

  {
    id: "archie-gen3",
    nome: "Archie-gen3",
    imagem: "/images/trainers/archie-gen3.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 2839,
    stardust: 2417,
    xp: 343,
    ia: "defensiva",
    time: [
      { speciesId: 1012, nome: "Poltchageist", level: 23 },
      { speciesId: 897, nome: "Spectrier", level: 66 },
      { speciesId: 554, nome: "Darumaka", level: 63 },
      { speciesId: 294, nome: "Loudred", level: 47 },
      { speciesId: 516, nome: "Simipour", level: 15 },
      { speciesId: 118, nome: "Goldeen", level: 30 }
    ]
  },

  {
    id: "archie-gen6",
    nome: "Archie-gen6",
    imagem: "/images/trainers/archie-gen6.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 2949,
    stardust: 5170,
    xp: 52,
    ia: "agressiva",
    time: [
      { speciesId: 263, nome: "Zigzagoon", level: 31 },
      { speciesId: 131, nome: "Lapras", level: 38 },
      { speciesId: 696, nome: "Tyrunt", level: 69 },
      { speciesId: 385, nome: "Jirachi", level: 36 },
      { speciesId: 774, nome: "Minior-red-meteor", level: 21 },
      { speciesId: 786, nome: "Tapu-lele", level: 11 }
    ]
  },

  {
    id: "archie-usum",
    nome: "Archie-usum",
    imagem: "/images/trainers/archie-usum.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 1971,
    stardust: 1341,
    xp: 214,
    ia: "defensiva",
    time: [
      { speciesId: 955, nome: "Flittle", level: 18 },
      { speciesId: 651, nome: "Quilladin", level: 69 },
      { speciesId: 539, nome: "Sawk", level: 24 },
      { speciesId: 327, nome: "Spinda", level: 55 },
      { speciesId: 323, nome: "Camerupt", level: 41 },
      { speciesId: 430, nome: "Honchkrow", level: 13 }
    ]
  },

  {
    id: "arezu",
    nome: "Arezu",
    imagem: "/images/trainers/arezu.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 1104,
    stardust: 1034,
    xp: 294,
    ia: "defensiva",
    time: [
      { speciesId: 85, nome: "Dodrio", level: 43 },
      { speciesId: 898, nome: "Calyrex", level: 79 },
      { speciesId: 92, nome: "Gastly", level: 18 },
      { speciesId: 656, nome: "Froakie", level: 27 },
      { speciesId: 802, nome: "Marshadow", level: 70 },
      { speciesId: 422, nome: "Shellos", level: 54 }
    ]
  },

  {
    id: "argenta",
    nome: "Argenta",
    imagem: "/images/trainers/argenta.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 2310,
    stardust: 4108,
    xp: 130,
    ia: "defensiva",
    time: [
      { speciesId: 721, nome: "Volcanion", level: 52 },
      { speciesId: 718, nome: "Zygarde-50", level: 80 },
      { speciesId: 613, nome: "Cubchoo", level: 66 },
      { speciesId: 540, nome: "Sewaddle", level: 46 },
      { speciesId: 201, nome: "Unown", level: 58 },
      { speciesId: 999, nome: "Gimmighoul", level: 54 }
    ]
  },

  {
    id: "ariana",
    nome: "Ariana",
    imagem: "/images/trainers/ariana.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 1390,
    stardust: 1618,
    xp: 207,
    ia: "aleatoria",
    time: [
      { speciesId: 339, nome: "Barboach", level: 41 },
      { speciesId: 942, nome: "Maschiff", level: 22 },
      { speciesId: 588, nome: "Karrablast", level: 46 },
      { speciesId: 682, nome: "Spritzee", level: 78 },
      { speciesId: 755, nome: "Morelull", level: 68 },
      { speciesId: 19, nome: "Rattata", level: 36 }
    ]
  },

  {
    id: "arlo",
    nome: "Arlo",
    imagem: "/images/trainers/arlo.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 234,
    stardust: 2317,
    xp: 354,
    ia: "agressiva",
    time: [
      { speciesId: 532, nome: "Timburr", level: 19 },
      { speciesId: 805, nome: "Stakataka", level: 68 },
      { speciesId: 131, nome: "Lapras", level: 13 },
      { speciesId: 202, nome: "Wobbuffet", level: 24 },
      { speciesId: 649, nome: "Genesect", level: 59 },
      { speciesId: 243, nome: "Raikou", level: 59 }
    ]
  },

  {
    id: "aromalady-gen3",
    nome: "Aromalady-gen3",
    imagem: "/images/trainers/aromalady-gen3.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "dificil",
    recompensa: 200,
    stardust: 1884,
    xp: 242,
    ia: "defensiva",
    time: [
      { speciesId: 604, nome: "Eelektross", level: 75 },
      { speciesId: 613, nome: "Cubchoo", level: 28 },
      { speciesId: 573, nome: "Cinccino", level: 62 },
      { speciesId: 972, nome: "Houndstone", level: 59 },
      { speciesId: 14, nome: "Kakuna", level: 62 },
      { speciesId: 924, nome: "Tandemaus", level: 23 }
    ]
  },

  {
    id: "aromalady-gen3rs",
    nome: "Aromalady-gen3rs",
    imagem: "/images/trainers/aromalady-gen3rs.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 2250,
    stardust: 3820,
    xp: 170,
    ia: "defensiva",
    time: [
      { speciesId: 218, nome: "Slugma", level: 39 },
      { speciesId: 273, nome: "Seedot", level: 44 },
      { speciesId: 1018, nome: "Archaludon", level: 23 },
      { speciesId: 472, nome: "Gliscor", level: 42 },
      { speciesId: 900, nome: "Kleavor", level: 59 },
      { speciesId: 437, nome: "Bronzong", level: 33 }
    ]
  },

  {
    id: "aromalady-gen6",
    nome: "Aromalady-gen6",
    imagem: "/images/trainers/aromalady-gen6.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 2821,
    stardust: 3317,
    xp: 165,
    ia: "aleatoria",
    time: [
      { speciesId: 338, nome: "Solrock", level: 25 },
      { speciesId: 366, nome: "Clamperl", level: 50 },
      { speciesId: 4, nome: "Charmander", level: 54 },
      { speciesId: 268, nome: "Cascoon", level: 21 },
      { speciesId: 249, nome: "Lugia", level: 14 },
      { speciesId: 164, nome: "Noctowl", level: 76 }
    ]
  },

  {
    id: "aromalady",
    nome: "Aromalady",
    imagem: "/images/trainers/aromalady.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 2249,
    stardust: 1629,
    xp: 131,
    ia: "agressiva",
    time: [
      { speciesId: 201, nome: "Unown", level: 50 },
      { speciesId: 112, nome: "Rhydon", level: 61 },
      { speciesId: 44, nome: "Gloom", level: 46 },
      { speciesId: 914, nome: "Quaquaval", level: 52 },
      { speciesId: 374, nome: "Beldum", level: 23 },
      { speciesId: 479, nome: "Rotom", level: 60 }
    ]
  },

  {
    id: "artist-gen4",
    nome: "Artist-gen4",
    imagem: "/images/trainers/artist-gen4.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "dificil",
    recompensa: 999,
    stardust: 1053,
    xp: 476,
    ia: "agressiva",
    time: [
      { speciesId: 409, nome: "Rampardos", level: 76 },
      { speciesId: 739, nome: "Crabrawler", level: 73 },
      { speciesId: 128, nome: "Tauros", level: 21 },
      { speciesId: 534, nome: "Conkeldurr", level: 64 },
      { speciesId: 915, nome: "Lechonk", level: 67 },
      { speciesId: 668, nome: "Pyroar", level: 51 }
    ]
  },

  {
    id: "artist-gen6",
    nome: "Artist-gen6",
    imagem: "/images/trainers/artist-gen6.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 787,
    stardust: 1485,
    xp: 312,
    ia: "estrategica",
    time: [
      { speciesId: 365, nome: "Walrein", level: 71 },
      { speciesId: 870, nome: "Falinks", level: 58 },
      { speciesId: 111, nome: "Rhyhorn", level: 35 },
      { speciesId: 846, nome: "Arrokuda", level: 52 },
      { speciesId: 215, nome: "Sneasel", level: 28 },
      { speciesId: 961, nome: "Wugtrio", level: 56 }
    ]
  },

  {
    id: "artist-gen8",
    nome: "Artist-gen8",
    imagem: "/images/trainers/artist-gen8.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 1357,
    stardust: 1712,
    xp: 310,
    ia: "aleatoria",
    time: [
      { speciesId: 236, nome: "Tyrogue", level: 60 },
      { speciesId: 831, nome: "Wooloo", level: 32 },
      { speciesId: 746, nome: "Wishiwashi-solo", level: 62 },
      { speciesId: 264, nome: "Linoone", level: 78 },
      { speciesId: 142, nome: "Aerodactyl", level: 20 },
      { speciesId: 275, nome: "Shiftry", level: 46 }
    ]
  },

  {
    id: "artist-gen9",
    nome: "Artist-gen9",
    imagem: "/images/trainers/artist-gen9.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 981,
    stardust: 5114,
    xp: 56,
    ia: "estrategica",
    time: [
      { speciesId: 284, nome: "Masquerain", level: 55 },
      { speciesId: 13, nome: "Weedle", level: 45 },
      { speciesId: 895, nome: "Regidrago", level: 15 },
      { speciesId: 314, nome: "Illumise", level: 46 },
      { speciesId: 383, nome: "Groudon", level: 15 },
      { speciesId: 877, nome: "Morpeko-full-belly", level: 47 }
    ]
  },

  {
    id: "artist",
    nome: "Artist",
    imagem: "/images/trainers/artist.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "dificil",
    recompensa: 2057,
    stardust: 4305,
    xp: 367,
    ia: "estrategica",
    time: [
      { speciesId: 67, nome: "Machoke", level: 38 },
      { speciesId: 560, nome: "Scrafty", level: 22 },
      { speciesId: 5, nome: "Charmeleon", level: 36 },
      { speciesId: 485, nome: "Heatran", level: 44 },
      { speciesId: 1003, nome: "Ting-lu", level: 59 },
      { speciesId: 376, nome: "Metagross", level: 65 }
    ]
  },

  {
    id: "artistf-gen6",
    nome: "Artistf-gen6",
    imagem: "/images/trainers/artistf-gen6.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 497,
    stardust: 4521,
    xp: 407,
    ia: "agressiva",
    time: [
      { speciesId: 627, nome: "Rufflet", level: 13 },
      { speciesId: 342, nome: "Crawdaunt", level: 28 },
      { speciesId: 128, nome: "Tauros", level: 33 },
      { speciesId: 346, nome: "Cradily", level: 59 },
      { speciesId: 741, nome: "Oricorio-baile", level: 31 },
      { speciesId: 635, nome: "Hydreigon", level: 56 }
    ]
  },

  {
    id: "arven-s",
    nome: "Arven-s",
    imagem: "/images/trainers/arven-s.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 1418,
    stardust: 914,
    xp: 321,
    ia: "agressiva",
    time: [
      { speciesId: 407, nome: "Roserade", level: 43 },
      { speciesId: 756, nome: "Shiinotic", level: 67 },
      { speciesId: 243, nome: "Raikou", level: 42 },
      { speciesId: 599, nome: "Klink", level: 61 },
      { speciesId: 929, nome: "Dolliv", level: 17 },
      { speciesId: 748, nome: "Toxapex", level: 68 }
    ]
  },

  {
    id: "arven-v",
    nome: "Arven-v",
    imagem: "/images/trainers/arven-v.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 2991,
    stardust: 3634,
    xp: 80,
    ia: "agressiva",
    time: [
      { speciesId: 965, nome: "Varoom", level: 77 },
      { speciesId: 604, nome: "Eelektross", level: 25 },
      { speciesId: 728, nome: "Popplio", level: 16 },
      { speciesId: 59, nome: "Arcanine", level: 76 },
      { speciesId: 508, nome: "Stoutland", level: 15 },
      { speciesId: 385, nome: "Jirachi", level: 15 }
    ]
  },

  {
    id: "ash-alola",
    nome: "Ash-alola",
    imagem: "/images/trainers/ash-alola.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 1177,
    stardust: 1298,
    xp: 290,
    ia: "estrategica",
    time: [
      { speciesId: 342, nome: "Crawdaunt", level: 80 },
      { speciesId: 767, nome: "Wimpod", level: 38 },
      { speciesId: 101, nome: "Electrode", level: 42 },
      { speciesId: 695, nome: "Heliolisk", level: 46 },
      { speciesId: 240, nome: "Magby", level: 78 },
      { speciesId: 180, nome: "Flaaffy", level: 41 }
    ]
  },

  {
    id: "ash-capbackward",
    nome: "Ash-capbackward",
    imagem: "/images/trainers/ash-capbackward.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 2467,
    stardust: 2143,
    xp: 207,
    ia: "aleatoria",
    time: [
      { speciesId: 508, nome: "Stoutland", level: 64 },
      { speciesId: 197, nome: "Umbreon", level: 30 },
      { speciesId: 955, nome: "Flittle", level: 34 },
      { speciesId: 461, nome: "Weavile", level: 25 },
      { speciesId: 840, nome: "Applin", level: 47 },
      { speciesId: 802, nome: "Marshadow", level: 52 }
    ]
  },

  {
    id: "ash-hoenn",
    nome: "Ash-hoenn",
    imagem: "/images/trainers/ash-hoenn.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 2481,
    stardust: 1416,
    xp: 217,
    ia: "defensiva",
    time: [
      { speciesId: 410, nome: "Shieldon", level: 26 },
      { speciesId: 117, nome: "Seadra", level: 44 },
      { speciesId: 487, nome: "Giratina-altered", level: 40 },
      { speciesId: 886, nome: "Drakloak", level: 12 },
      { speciesId: 64, nome: "Kadabra", level: 39 },
      { speciesId: 652, nome: "Chesnaught", level: 32 }
    ]
  },

  {
    id: "ash-johto",
    nome: "Ash-johto",
    imagem: "/images/trainers/ash-johto.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "dificil",
    recompensa: 226,
    stardust: 4610,
    xp: 468,
    ia: "defensiva",
    time: [
      { speciesId: 702, nome: "Dedenne", level: 72 },
      { speciesId: 427, nome: "Buneary", level: 53 },
      { speciesId: 609, nome: "Chandelure", level: 49 },
      { speciesId: 421, nome: "Cherrim", level: 62 },
      { speciesId: 183, nome: "Marill", level: 46 },
      { speciesId: 82, nome: "Magneton", level: 24 }
    ]
  },

  {
    id: "ash-kalos",
    nome: "Ash-kalos",
    imagem: "/images/trainers/ash-kalos.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 2858,
    stardust: 1231,
    xp: 464,
    ia: "defensiva",
    time: [
      { speciesId: 1023, nome: "Iron-crown", level: 19 },
      { speciesId: 666, nome: "Vivillon", level: 80 },
      { speciesId: 847, nome: "Barraskewda", level: 48 },
      { speciesId: 122, nome: "Mr-mime", level: 44 },
      { speciesId: 840, nome: "Applin", level: 77 },
      { speciesId: 1007, nome: "Koraidon", level: 76 }
    ]
  },

  {
    id: "ash-sinnoh",
    nome: "Ash-sinnoh",
    imagem: "/images/trainers/ash-sinnoh.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 402,
    stardust: 1551,
    xp: 358,
    ia: "estrategica",
    time: [
      { speciesId: 516, nome: "Simipour", level: 75 },
      { speciesId: 374, nome: "Beldum", level: 36 },
      { speciesId: 492, nome: "Shaymin-land", level: 39 },
      { speciesId: 62, nome: "Poliwrath", level: 14 },
      { speciesId: 413, nome: "Wormadam-plant", level: 69 },
      { speciesId: 676, nome: "Furfrou", level: 55 }
    ]
  },

  {
    id: "ash-unova",
    nome: "Ash-unova",
    imagem: "/images/trainers/ash-unova.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "dificil",
    recompensa: 2421,
    stardust: 5069,
    xp: 121,
    ia: "defensiva",
    time: [
      { speciesId: 997, nome: "Arctibax", level: 15 },
      { speciesId: 1023, nome: "Iron-crown", level: 78 },
      { speciesId: 728, nome: "Popplio", level: 70 },
      { speciesId: 256, nome: "Combusken", level: 54 },
      { speciesId: 457, nome: "Lumineon", level: 13 },
      { speciesId: 313, nome: "Volbeat", level: 71 }
    ]
  },

  {
    id: "ash",
    nome: "Ash",
    imagem: "/images/trainers/ash.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 480,
    stardust: 1948,
    xp: 215,
    ia: "aleatoria",
    time: [
      { speciesId: 800, nome: "Necrozma", level: 68 },
      { speciesId: 328, nome: "Trapinch", level: 18 },
      { speciesId: 108, nome: "Lickitung", level: 15 },
      { speciesId: 774, nome: "Minior-red-meteor", level: 55 },
      { speciesId: 75, nome: "Graveler", level: 11 },
      { speciesId: 639, nome: "Terrakion", level: 44 }
    ]
  },

  {
    id: "atticus",
    nome: "Atticus",
    imagem: "/images/trainers/atticus.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 2716,
    stardust: 823,
    xp: 460,
    ia: "aleatoria",
    time: [
      { speciesId: 558, nome: "Crustle", level: 31 },
      { speciesId: 857, nome: "Hattrem", level: 20 },
      { speciesId: 633, nome: "Deino", level: 20 },
      { speciesId: 694, nome: "Helioptile", level: 33 },
      { speciesId: 226, nome: "Mantine", level: 79 },
      { speciesId: 765, nome: "Oranguru", level: 21 }
    ]
  },

  {
    id: "avery",
    nome: "Avery",
    imagem: "/images/trainers/avery.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 370,
    stardust: 5326,
    xp: 461,
    ia: "defensiva",
    time: [
      { speciesId: 485, nome: "Heatran", level: 43 },
      { speciesId: 71, nome: "Victreebel", level: 23 },
      { speciesId: 591, nome: "Amoonguss", level: 77 },
      { speciesId: 817, nome: "Drizzile", level: 53 },
      { speciesId: 13, nome: "Weedle", level: 18 },
      { speciesId: 951, nome: "Capsakid", level: 21 }
    ]
  },

  {
    id: "az-lza",
    nome: "Az-lza",
    imagem: "/images/trainers/az-lza.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "dificil",
    recompensa: 981,
    stardust: 3658,
    xp: 96,
    ia: "defensiva",
    time: [
      { speciesId: 176, nome: "Togetic", level: 32 },
      { speciesId: 17, nome: "Pidgeotto", level: 39 },
      { speciesId: 672, nome: "Skiddo", level: 45 },
      { speciesId: 329, nome: "Vibrava", level: 71 },
      { speciesId: 354, nome: "Banette", level: 78 },
      { speciesId: 309, nome: "Electrike", level: 49 }
    ]
  },

  {
    id: "az",
    nome: "Az",
    imagem: "/images/trainers/az.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 719,
    stardust: 3383,
    xp: 459,
    ia: "aleatoria",
    time: [
      { speciesId: 66, nome: "Machop", level: 63 },
      { speciesId: 499, nome: "Pignite", level: 71 },
      { speciesId: 858, nome: "Hatterene", level: 38 },
      { speciesId: 233, nome: "Porygon2", level: 12 },
      { speciesId: 95, nome: "Onix", level: 77 },
      { speciesId: 996, nome: "Frigibax", level: 46 }
    ]
  },

  {
    id: "backers",
    nome: "Backers",
    imagem: "/images/trainers/backers.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 2807,
    stardust: 252,
    xp: 483,
    ia: "agressiva",
    time: [
      { speciesId: 497, nome: "Serperior", level: 31 },
      { speciesId: 356, nome: "Dusclops", level: 41 },
      { speciesId: 355, nome: "Duskull", level: 50 },
      { speciesId: 35, nome: "Clefairy", level: 15 },
      { speciesId: 807, nome: "Zeraora", level: 29 },
      { speciesId: 122, nome: "Mr-mime", level: 18 }
    ]
  },

  {
    id: "backersf",
    nome: "Backersf",
    imagem: "/images/trainers/backersf.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 638,
    stardust: 2871,
    xp: 173,
    ia: "defensiva",
    time: [
      { speciesId: 889, nome: "Zamazenta", level: 11 },
      { speciesId: 893, nome: "Zarude", level: 38 },
      { speciesId: 1015, nome: "Munkidori", level: 79 },
      { speciesId: 646, nome: "Kyurem", level: 26 },
      { speciesId: 936, nome: "Armarouge", level: 67 },
      { speciesId: 816, nome: "Sobble", level: 74 }
    ]
  },

  {
    id: "backpacker-gen6",
    nome: "Backpacker-gen6",
    imagem: "/images/trainers/backpacker-gen6.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 1717,
    stardust: 4961,
    xp: 249,
    ia: "aleatoria",
    time: [
      { speciesId: 466, nome: "Electivire", level: 78 },
      { speciesId: 407, nome: "Roserade", level: 31 },
      { speciesId: 882, nome: "Dracovish", level: 49 },
      { speciesId: 794, nome: "Buzzwole", level: 77 },
      { speciesId: 1005, nome: "Roaring-moon", level: 77 },
      { speciesId: 165, nome: "Ledyba", level: 45 }
    ]
  },

  {
    id: "backpacker-gen8",
    nome: "Backpacker-gen8",
    imagem: "/images/trainers/backpacker-gen8.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 2497,
    stardust: 624,
    xp: 353,
    ia: "defensiva",
    time: [
      { speciesId: 682, nome: "Spritzee", level: 16 },
      { speciesId: 919, nome: "Nymble", level: 76 },
      { speciesId: 861, nome: "Grimmsnarl", level: 38 },
      { speciesId: 893, nome: "Zarude", level: 80 },
      { speciesId: 599, nome: "Klink", level: 40 },
      { speciesId: 323, nome: "Camerupt", level: 24 }
    ]
  },

  {
    id: "backpacker-gen9",
    nome: "Backpacker-gen9",
    imagem: "/images/trainers/backpacker-gen9.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 1681,
    stardust: 766,
    xp: 70,
    ia: "agressiva",
    time: [
      { speciesId: 34, nome: "Nidoking", level: 55 },
      { speciesId: 416, nome: "Vespiquen", level: 16 },
      { speciesId: 563, nome: "Cofagrigus", level: 12 },
      { speciesId: 794, nome: "Buzzwole", level: 72 },
      { speciesId: 498, nome: "Tepig", level: 76 },
      { speciesId: 429, nome: "Mismagius", level: 21 }
    ]
  },

  {
    id: "backpacker",
    nome: "Backpacker",
    imagem: "/images/trainers/backpacker.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 1756,
    stardust: 2566,
    xp: 389,
    ia: "estrategica",
    time: [
      { speciesId: 992, nome: "Iron-hands", level: 31 },
      { speciesId: 335, nome: "Zangoose", level: 73 },
      { speciesId: 527, nome: "Woobat", level: 80 },
      { speciesId: 559, nome: "Scraggy", level: 27 },
      { speciesId: 37, nome: "Vulpix", level: 25 },
      { speciesId: 545, nome: "Scolipede", level: 27 }
    ]
  },

  {
    id: "backpackerf",
    nome: "Backpackerf",
    imagem: "/images/trainers/backpackerf.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 159,
    stardust: 3406,
    xp: 291,
    ia: "estrategica",
    time: [
      { speciesId: 149, nome: "Dragonite", level: 11 },
      { speciesId: 214, nome: "Heracross", level: 45 },
      { speciesId: 349, nome: "Feebas", level: 48 },
      { speciesId: 345, nome: "Lileep", level: 38 },
      { speciesId: 636, nome: "Larvesta", level: 10 },
      { speciesId: 348, nome: "Armaldo", level: 40 }
    ]
  },

  {
    id: "baker",
    nome: "Baker",
    imagem: "/images/trainers/baker.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 141,
    stardust: 5488,
    xp: 266,
    ia: "aleatoria",
    time: [
      { speciesId: 741, nome: "Oricorio-baile", level: 30 },
      { speciesId: 132, nome: "Ditto", level: 11 },
      { speciesId: 820, nome: "Greedent", level: 58 },
      { speciesId: 819, nome: "Skwovet", level: 18 },
      { speciesId: 226, nome: "Mantine", level: 33 },
      { speciesId: 726, nome: "Torracat", level: 42 }
    ]
  },

  {
    id: "ballguy",
    nome: "Ballguy",
    imagem: "/images/trainers/ballguy.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 1934,
    stardust: 2235,
    xp: 457,
    ia: "defensiva",
    time: [
      { speciesId: 85, nome: "Dodrio", level: 43 },
      { speciesId: 828, nome: "Thievul", level: 55 },
      { speciesId: 905, nome: "Enamorus-incarnate", level: 64 },
      { speciesId: 588, nome: "Karrablast", level: 12 },
      { speciesId: 391, nome: "Monferno", level: 64 },
      { speciesId: 61, nome: "Poliwhirl", level: 17 }
    ]
  },

  {
    id: "baoba",
    nome: "Baoba",
    imagem: "/images/trainers/baoba.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 722,
    stardust: 1363,
    xp: 126,
    ia: "defensiva",
    time: [
      { speciesId: 292, nome: "Shedinja", level: 15 },
      { speciesId: 846, nome: "Arrokuda", level: 48 },
      { speciesId: 42, nome: "Golbat", level: 54 },
      { speciesId: 194, nome: "Wooper", level: 65 },
      { speciesId: 509, nome: "Purrloin", level: 47 },
      { speciesId: 621, nome: "Druddigon", level: 64 }
    ]
  },

  {
    id: "barry-masters",
    nome: "Barry-masters",
    imagem: "/images/trainers/barry-masters.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 2198,
    stardust: 5499,
    xp: 138,
    ia: "agressiva",
    time: [
      { speciesId: 640, nome: "Virizion", level: 36 },
      { speciesId: 760, nome: "Bewear", level: 24 },
      { speciesId: 526, nome: "Gigalith", level: 64 },
      { speciesId: 752, nome: "Araquanid", level: 76 },
      { speciesId: 315, nome: "Roselia", level: 28 },
      { speciesId: 757, nome: "Salandit", level: 68 }
    ]
  },

  {
    id: "barry",
    nome: "Barry",
    imagem: "/images/trainers/barry.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 1404,
    stardust: 4711,
    xp: 375,
    ia: "aleatoria",
    time: [
      { speciesId: 820, nome: "Greedent", level: 32 },
      { speciesId: 711, nome: "Gourgeist-average", level: 11 },
      { speciesId: 483, nome: "Dialga", level: 51 },
      { speciesId: 1016, nome: "Fezandipiti", level: 57 },
      { speciesId: 654, nome: "Braixen", level: 57 },
      { speciesId: 219, nome: "Magcargo", level: 79 }
    ]
  },

  {
    id: "battlegirl-gen3",
    nome: "Battlegirl-gen3",
    imagem: "/images/trainers/battlegirl-gen3.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 260,
    stardust: 2176,
    xp: 329,
    ia: "defensiva",
    time: [
      { speciesId: 744, nome: "Rockruff", level: 41 },
      { speciesId: 113, nome: "Chansey", level: 45 },
      { speciesId: 405, nome: "Luxray", level: 67 },
      { speciesId: 140, nome: "Kabuto", level: 41 },
      { speciesId: 105, nome: "Marowak", level: 49 },
      { speciesId: 184, nome: "Azumarill", level: 65 }
    ]
  },

  {
    id: "battlegirl-gen4",
    nome: "Battlegirl-gen4",
    imagem: "/images/trainers/battlegirl-gen4.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "dificil",
    recompensa: 2926,
    stardust: 4767,
    xp: 180,
    ia: "estrategica",
    time: [
      { speciesId: 344, nome: "Claydol", level: 56 },
      { speciesId: 71, nome: "Victreebel", level: 65 },
      { speciesId: 842, nome: "Appletun", level: 67 },
      { speciesId: 777, nome: "Togedemaru", level: 73 },
      { speciesId: 60, nome: "Poliwag", level: 73 },
      { speciesId: 67, nome: "Machoke", level: 32 }
    ]
  },

  {
    id: "battlegirl-gen6",
    nome: "Battlegirl-gen6",
    imagem: "/images/trainers/battlegirl-gen6.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 1104,
    stardust: 4543,
    xp: 220,
    ia: "estrategica",
    time: [
      { speciesId: 841, nome: "Flapple", level: 47 },
      { speciesId: 809, nome: "Melmetal", level: 11 },
      { speciesId: 959, nome: "Tinkaton", level: 67 },
      { speciesId: 585, nome: "Deerling", level: 76 },
      { speciesId: 229, nome: "Houndoom", level: 55 },
      { speciesId: 801, nome: "Magearna", level: 62 }
    ]
  },

  {
    id: "battlegirl-gen6xy",
    nome: "Battlegirl-gen6xy",
    imagem: "/images/trainers/battlegirl-gen6xy.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 1510,
    stardust: 5187,
    xp: 123,
    ia: "estrategica",
    time: [
      { speciesId: 721, nome: "Volcanion", level: 63 },
      { speciesId: 918, nome: "Spidops", level: 53 },
      { speciesId: 222, nome: "Corsola", level: 76 },
      { speciesId: 123, nome: "Scyther", level: 58 },
      { speciesId: 879, nome: "Copperajah", level: 59 },
      { speciesId: 641, nome: "Tornadus-incarnate", level: 45 }
    ]
  },

  {
    id: "battlegirl",
    nome: "Battlegirl",
    imagem: "/images/trainers/battlegirl.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 1365,
    stardust: 366,
    xp: 84,
    ia: "estrategica",
    time: [
      { speciesId: 736, nome: "Grubbin", level: 24 },
      { speciesId: 297, nome: "Hariyama", level: 35 },
      { speciesId: 998, nome: "Baxcalibur", level: 27 },
      { speciesId: 43, nome: "Oddish", level: 56 },
      { speciesId: 820, nome: "Greedent", level: 49 },
      { speciesId: 876, nome: "Indeedee-male", level: 46 }
    ]
  },

  {
    id: "bea-masters",
    nome: "Bea-masters",
    imagem: "/images/trainers/bea-masters.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 1618,
    stardust: 2200,
    xp: 247,
    ia: "agressiva",
    time: [
      { speciesId: 723, nome: "Dartrix", level: 66 },
      { speciesId: 806, nome: "Blacephalon", level: 80 },
      { speciesId: 1022, nome: "Iron-boulder", level: 37 },
      { speciesId: 459, nome: "Snover", level: 59 },
      { speciesId: 79, nome: "Slowpoke", level: 51 },
      { speciesId: 629, nome: "Vullaby", level: 48 }
    ]
  },

  {
    id: "bea",
    nome: "Bea",
    imagem: "/images/trainers/bea.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 829,
    stardust: 1935,
    xp: 54,
    ia: "aleatoria",
    time: [
      { speciesId: 610, nome: "Axew", level: 30 },
      { speciesId: 190, nome: "Aipom", level: 56 },
      { speciesId: 180, nome: "Flaaffy", level: 51 },
      { speciesId: 1006, nome: "Iron-valiant", level: 26 },
      { speciesId: 584, nome: "Vanilluxe", level: 76 },
      { speciesId: 631, nome: "Heatmor", level: 64 }
    ]
  },

  {
    id: "beauty-gen1",
    nome: "Beauty-gen1",
    imagem: "/images/trainers/beauty-gen1.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 217,
    stardust: 5007,
    xp: 239,
    ia: "estrategica",
    time: [
      { speciesId: 423, nome: "Gastrodon", level: 47 },
      { speciesId: 946, nome: "Bramblin", level: 62 },
      { speciesId: 682, nome: "Spritzee", level: 47 },
      { speciesId: 831, nome: "Wooloo", level: 26 },
      { speciesId: 790, nome: "Cosmoem", level: 51 },
      { speciesId: 754, nome: "Lurantis", level: 32 }
    ]
  },

  {
    id: "beauty-gen1rb",
    nome: "Beauty-gen1rb",
    imagem: "/images/trainers/beauty-gen1rb.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 1949,
    stardust: 4517,
    xp: 433,
    ia: "aleatoria",
    time: [
      { speciesId: 994, nome: "Iron-moth", level: 39 },
      { speciesId: 985, nome: "Scream-tail", level: 27 },
      { speciesId: 421, nome: "Cherrim", level: 79 },
      { speciesId: 925, nome: "Maushold-family-of-four", level: 69 },
      { speciesId: 700, nome: "Sylveon", level: 16 },
      { speciesId: 933, nome: "Naclstack", level: 79 }
    ]
  },

  {
    id: "beauty-gen2",
    nome: "Beauty-gen2",
    imagem: "/images/trainers/beauty-gen2.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 304,
    stardust: 2567,
    xp: 54,
    ia: "agressiva",
    time: [
      { speciesId: 102, nome: "Exeggcute", level: 65 },
      { speciesId: 389, nome: "Torterra", level: 13 },
      { speciesId: 889, nome: "Zamazenta", level: 72 },
      { speciesId: 687, nome: "Malamar", level: 19 },
      { speciesId: 852, nome: "Clobbopus", level: 52 },
      { speciesId: 678, nome: "Meowstic-male", level: 50 }
    ]
  },

  {
    id: "beauty-gen2jp",
    nome: "Beauty-gen2jp",
    imagem: "/images/trainers/beauty-gen2jp.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 489,
    stardust: 3678,
    xp: 449,
    ia: "aleatoria",
    time: [
      { speciesId: 40, nome: "Wigglytuff", level: 62 },
      { speciesId: 708, nome: "Phantump", level: 31 },
      { speciesId: 412, nome: "Burmy", level: 35 },
      { speciesId: 571, nome: "Zoroark", level: 65 },
      { speciesId: 988, nome: "Slither-wing", level: 56 },
      { speciesId: 25, nome: "Pikachu", level: 17 }
    ]
  },

  {
    id: "beauty-gen3",
    nome: "Beauty-gen3",
    imagem: "/images/trainers/beauty-gen3.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 2169,
    stardust: 115,
    xp: 419,
    ia: "defensiva",
    time: [
      { speciesId: 647, nome: "Keldeo-ordinary", level: 48 },
      { speciesId: 972, nome: "Houndstone", level: 26 },
      { speciesId: 873, nome: "Frosmoth", level: 80 },
      { speciesId: 123, nome: "Scyther", level: 19 },
      { speciesId: 92, nome: "Gastly", level: 20 },
      { speciesId: 7, nome: "Squirtle", level: 13 }
    ]
  },

  {
    id: "beauty-gen3rs",
    nome: "Beauty-gen3rs",
    imagem: "/images/trainers/beauty-gen3rs.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 2272,
    stardust: 2240,
    xp: 100,
    ia: "estrategica",
    time: [
      { speciesId: 690, nome: "Skrelp", level: 66 },
      { speciesId: 463, nome: "Lickilicky", level: 39 },
      { speciesId: 149, nome: "Dragonite", level: 11 },
      { speciesId: 89, nome: "Muk", level: 53 },
      { speciesId: 935, nome: "Charcadet", level: 53 },
      { speciesId: 819, nome: "Skwovet", level: 14 }
    ]
  },

  {
    id: "beauty-gen4dp",
    nome: "Beauty-gen4dp",
    imagem: "/images/trainers/beauty-gen4dp.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 2380,
    stardust: 5446,
    xp: 466,
    ia: "agressiva",
    time: [
      { speciesId: 940, nome: "Wattrel", level: 72 },
      { speciesId: 739, nome: "Crabrawler", level: 44 },
      { speciesId: 636, nome: "Larvesta", level: 34 },
      { speciesId: 110, nome: "Weezing", level: 31 },
      { speciesId: 112, nome: "Rhydon", level: 57 },
      { speciesId: 813, nome: "Scorbunny", level: 78 }
    ]
  },

  {
    id: "beauty-gen5bw2",
    nome: "Beauty-gen5bw2",
    imagem: "/images/trainers/beauty-gen5bw2.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 2680,
    stardust: 5366,
    xp: 373,
    ia: "defensiva",
    time: [
      { speciesId: 410, nome: "Shieldon", level: 18 },
      { speciesId: 882, nome: "Dracovish", level: 78 },
      { speciesId: 458, nome: "Mantyke", level: 19 },
      { speciesId: 21, nome: "Spearow", level: 11 },
      { speciesId: 883, nome: "Arctovish", level: 50 },
      { speciesId: 36, nome: "Clefable", level: 19 }
    ]
  },

  {
    id: "beauty-gen6",
    nome: "Beauty-gen6",
    imagem: "/images/trainers/beauty-gen6.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 415,
    stardust: 1359,
    xp: 50,
    ia: "agressiva",
    time: [
      { speciesId: 25, nome: "Pikachu", level: 21 },
      { speciesId: 334, nome: "Altaria", level: 44 },
      { speciesId: 257, nome: "Blaziken", level: 54 },
      { speciesId: 453, nome: "Croagunk", level: 51 },
      { speciesId: 20, nome: "Raticate", level: 29 },
      { speciesId: 209, nome: "Snubbull", level: 77 }
    ]
  },

  {
    id: "beauty-gen6xy",
    nome: "Beauty-gen6xy",
    imagem: "/images/trainers/beauty-gen6xy.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 1438,
    stardust: 3962,
    xp: 229,
    ia: "estrategica",
    time: [
      { speciesId: 194, nome: "Wooper", level: 71 },
      { speciesId: 440, nome: "Happiny", level: 15 },
      { speciesId: 395, nome: "Empoleon", level: 13 },
      { speciesId: 883, nome: "Arctovish", level: 29 },
      { speciesId: 339, nome: "Barboach", level: 32 },
      { speciesId: 875, nome: "Eiscue-ice", level: 26 }
    ]
  },

  {
    id: "beauty-gen7",
    nome: "Beauty-gen7",
    imagem: "/images/trainers/beauty-gen7.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 255,
    stardust: 4433,
    xp: 140,
    ia: "estrategica",
    time: [
      { speciesId: 724, nome: "Decidueye", level: 27 },
      { speciesId: 643, nome: "Reshiram", level: 46 },
      { speciesId: 101, nome: "Electrode", level: 40 },
      { speciesId: 114, nome: "Tangela", level: 57 },
      { speciesId: 1023, nome: "Iron-crown", level: 40 },
      { speciesId: 319, nome: "Sharpedo", level: 35 }
    ]
  },

  {
    id: "beauty-gen8",
    nome: "Beauty-gen8",
    imagem: "/images/trainers/beauty-gen8.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 2529,
    stardust: 2292,
    xp: 360,
    ia: "aleatoria",
    time: [
      { speciesId: 252, nome: "Treecko", level: 20 },
      { speciesId: 741, nome: "Oricorio-baile", level: 80 },
      { speciesId: 863, nome: "Perrserker", level: 15 },
      { speciesId: 567, nome: "Archeops", level: 80 },
      { speciesId: 916, nome: "Oinkologne-male", level: 79 },
      { speciesId: 498, nome: "Tepig", level: 41 }
    ]
  },

  {
    id: "beauty-gen9",
    nome: "Beauty-gen9",
    imagem: "/images/trainers/beauty-gen9.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 862,
    stardust: 2163,
    xp: 357,
    ia: "agressiva",
    time: [
      { speciesId: 714, nome: "Noibat", level: 77 },
      { speciesId: 379, nome: "Registeel", level: 22 },
      { speciesId: 254, nome: "Sceptile", level: 73 },
      { speciesId: 1017, nome: "Ogerpon", level: 20 },
      { speciesId: 957, nome: "Tinkatink", level: 73 },
      { speciesId: 630, nome: "Mandibuzz", level: 41 }
    ]
  },

  {
    id: "beauty-masters",
    nome: "Beauty-masters",
    imagem: "/images/trainers/beauty-masters.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 1331,
    stardust: 1571,
    xp: 288,
    ia: "estrategica",
    time: [
      { speciesId: 799, nome: "Guzzlord", level: 72 },
      { speciesId: 219, nome: "Magcargo", level: 15 },
      { speciesId: 551, nome: "Sandile", level: 67 },
      { speciesId: 61, nome: "Poliwhirl", level: 60 },
      { speciesId: 564, nome: "Tirtouga", level: 58 },
      { speciesId: 619, nome: "Mienfoo", level: 49 }
    ]
  },

  {
    id: "beauty",
    nome: "Beauty",
    imagem: "/images/trainers/beauty.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 1845,
    stardust: 1946,
    xp: 118,
    ia: "agressiva",
    time: [
      { speciesId: 344, nome: "Claydol", level: 21 },
      { speciesId: 930, nome: "Arboliva", level: 49 },
      { speciesId: 605, nome: "Elgyem", level: 26 },
      { speciesId: 729, nome: "Brionne", level: 10 },
      { speciesId: 907, nome: "Floragato", level: 46 },
      { speciesId: 384, nome: "Rayquaza", level: 72 }
    ]
  },

  {
    id: "bede-leader",
    nome: "Bede-leader",
    imagem: "/images/trainers/bede-leader.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 489,
    stardust: 210,
    xp: 489,
    ia: "aleatoria",
    time: [
      { speciesId: 250, nome: "Ho-oh", level: 74 },
      { speciesId: 673, nome: "Gogoat", level: 55 },
      { speciesId: 56, nome: "Mankey", level: 57 },
      { speciesId: 235, nome: "Smeargle", level: 78 },
      { speciesId: 743, nome: "Ribombee", level: 51 },
      { speciesId: 397, nome: "Staravia", level: 54 }
    ]
  },

  {
    id: "bede-masters",
    nome: "Bede-masters",
    imagem: "/images/trainers/bede-masters.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 228,
    stardust: 433,
    xp: 436,
    ia: "agressiva",
    time: [
      { speciesId: 769, nome: "Sandygast", level: 34 },
      { speciesId: 756, nome: "Shiinotic", level: 15 },
      { speciesId: 194, nome: "Wooper", level: 51 },
      { speciesId: 95, nome: "Onix", level: 41 },
      { speciesId: 446, nome: "Munchlax", level: 72 },
      { speciesId: 306, nome: "Aggron", level: 48 }
    ]
  },

  {
    id: "bede",
    nome: "Bede",
    imagem: "/images/trainers/bede.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 1647,
    stardust: 338,
    xp: 239,
    ia: "agressiva",
    time: [
      { speciesId: 559, nome: "Scraggy", level: 70 },
      { speciesId: 715, nome: "Noivern", level: 19 },
      { speciesId: 535, nome: "Tympole", level: 18 },
      { speciesId: 395, nome: "Empoleon", level: 46 },
      { speciesId: 460, nome: "Abomasnow", level: 21 },
      { speciesId: 348, nome: "Armaldo", level: 33 }
    ]
  },

  {
    id: "bellelba",
    nome: "Bellelba",
    imagem: "/images/trainers/bellelba.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 1290,
    stardust: 2252,
    xp: 460,
    ia: "estrategica",
    time: [
      { speciesId: 22, nome: "Fearow", level: 16 },
      { speciesId: 375, nome: "Metang", level: 15 },
      { speciesId: 600, nome: "Klang", level: 34 },
      { speciesId: 250, nome: "Ho-oh", level: 68 },
      { speciesId: 305, nome: "Lairon", level: 49 },
      { speciesId: 679, nome: "Honedge", level: 78 }
    ]
  },

  {
    id: "bellepa",
    nome: "Bellepa",
    imagem: "/images/trainers/bellepa.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 200,
    stardust: 5404,
    xp: 437,
    ia: "aleatoria",
    time: [
      { speciesId: 896, nome: "Glastrier", level: 12 },
      { speciesId: 24, nome: "Arbok", level: 29 },
      { speciesId: 202, nome: "Wobbuffet", level: 74 },
      { speciesId: 267, nome: "Beautifly", level: 17 },
      { speciesId: 117, nome: "Seadra", level: 60 },
      { speciesId: 750, nome: "Mudsdale", level: 26 }
    ]
  },

  {
    id: "bellhop",
    nome: "Bellhop",
    imagem: "/images/trainers/bellhop.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 304,
    stardust: 4668,
    xp: 203,
    ia: "aleatoria",
    time: [
      { speciesId: 196, nome: "Espeon", level: 75 },
      { speciesId: 772, nome: "Type-null", level: 10 },
      { speciesId: 131, nome: "Lapras", level: 45 },
      { speciesId: 991, nome: "Iron-bundle", level: 32 },
      { speciesId: 252, nome: "Treecko", level: 23 },
      { speciesId: 983, nome: "Kingambit", level: 80 }
    ]
  },

  {
    id: "bellis",
    nome: "Bellis",
    imagem: "/images/trainers/bellis.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 172,
    stardust: 5237,
    xp: 342,
    ia: "agressiva",
    time: [
      { speciesId: 789, nome: "Cosmog", level: 10 },
      { speciesId: 57, nome: "Primeape", level: 34 },
      { speciesId: 709, nome: "Trevenant", level: 11 },
      { speciesId: 918, nome: "Spidops", level: 23 },
      { speciesId: 465, nome: "Tangrowth", level: 27 },
      { speciesId: 546, nome: "Cottonee", level: 38 }
    ]
  },

  {
    id: "benga",
    nome: "Benga",
    imagem: "/images/trainers/benga.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 1012,
    stardust: 2022,
    xp: 379,
    ia: "estrategica",
    time: [
      { speciesId: 194, nome: "Wooper", level: 50 },
      { speciesId: 961, nome: "Wugtrio", level: 27 },
      { speciesId: 583, nome: "Vanillish", level: 60 },
      { speciesId: 148, nome: "Dragonair", level: 25 },
      { speciesId: 122, nome: "Mr-mime", level: 39 },
      { speciesId: 797, nome: "Celesteela", level: 21 }
    ]
  },

  {
    id: "beni-ninja",
    nome: "Beni-ninja",
    imagem: "/images/trainers/beni-ninja.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 873,
    stardust: 674,
    xp: 182,
    ia: "estrategica",
    time: [
      { speciesId: 920, nome: "Lokix", level: 12 },
      { speciesId: 865, nome: "Sirfetchd", level: 40 },
      { speciesId: 859, nome: "Impidimp", level: 66 },
      { speciesId: 871, nome: "Pincurchin", level: 52 },
      { speciesId: 108, nome: "Lickitung", level: 39 },
      { speciesId: 623, nome: "Golurk", level: 36 }
    ]
  },

  {
    id: "beni",
    nome: "Beni",
    imagem: "/images/trainers/beni.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 2177,
    stardust: 3578,
    xp: 155,
    ia: "agressiva",
    time: [
      { speciesId: 674, nome: "Pancham", level: 11 },
      { speciesId: 880, nome: "Dracozolt", level: 13 },
      { speciesId: 704, nome: "Goomy", level: 46 },
      { speciesId: 916, nome: "Oinkologne-male", level: 63 },
      { speciesId: 555, nome: "Darmanitan-standard", level: 25 },
      { speciesId: 449, nome: "Hippopotas", level: 55 }
    ]
  },

  {
    id: "bertha",
    nome: "Bertha",
    imagem: "/images/trainers/bertha.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 2162,
    stardust: 1508,
    xp: 59,
    ia: "estrategica",
    time: [
      { speciesId: 158, nome: "Totodile", level: 68 },
      { speciesId: 276, nome: "Taillow", level: 41 },
      { speciesId: 662, nome: "Fletchinder", level: 79 },
      { speciesId: 358, nome: "Chimecho", level: 40 },
      { speciesId: 195, nome: "Quagsire", level: 27 },
      { speciesId: 311, nome: "Plusle", level: 38 }
    ]
  },

  {
    id: "bianca-masters",
    nome: "Bianca-masters",
    imagem: "/images/trainers/bianca-masters.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 1650,
    stardust: 1772,
    xp: 66,
    ia: "estrategica",
    time: [
      { speciesId: 876, nome: "Indeedee-male", level: 16 },
      { speciesId: 85, nome: "Dodrio", level: 21 },
      { speciesId: 147, nome: "Dratini", level: 26 },
      { speciesId: 130, nome: "Gyarados", level: 19 },
      { speciesId: 714, nome: "Noibat", level: 65 },
      { speciesId: 146, nome: "Moltres", level: 11 }
    ]
  },

  {
    id: "bianca-pwt",
    nome: "Bianca-pwt",
    imagem: "/images/trainers/bianca-pwt.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 2394,
    stardust: 5081,
    xp: 476,
    ia: "defensiva",
    time: [
      { speciesId: 364, nome: "Sealeo", level: 36 },
      { speciesId: 905, nome: "Enamorus-incarnate", level: 34 },
      { speciesId: 695, nome: "Heliolisk", level: 36 },
      { speciesId: 859, nome: "Impidimp", level: 59 },
      { speciesId: 733, nome: "Toucannon", level: 79 },
      { speciesId: 246, nome: "Larvitar", level: 68 }
    ]
  },

  {
    id: "bianca",
    nome: "Bianca",
    imagem: "/images/trainers/bianca.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 1553,
    stardust: 322,
    xp: 80,
    ia: "estrategica",
    time: [
      { speciesId: 688, nome: "Binacle", level: 38 },
      { speciesId: 154, nome: "Meganium", level: 67 },
      { speciesId: 156, nome: "Quilava", level: 24 },
      { speciesId: 132, nome: "Ditto", level: 36 },
      { speciesId: 1012, nome: "Poltchageist", level: 75 },
      { speciesId: 435, nome: "Skuntank", level: 14 }
    ]
  },

  {
    id: "biker-gen1",
    nome: "Biker-gen1",
    imagem: "/images/trainers/biker-gen1.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 1606,
    stardust: 2880,
    xp: 76,
    ia: "aleatoria",
    time: [
      { speciesId: 45, nome: "Vileplume", level: 50 },
      { speciesId: 1025, nome: "Pecharunt", level: 21 },
      { speciesId: 133, nome: "Eevee", level: 24 },
      { speciesId: 893, nome: "Zarude", level: 72 },
      { speciesId: 190, nome: "Aipom", level: 78 },
      { speciesId: 523, nome: "Zebstrika", level: 42 }
    ]
  },

  {
    id: "biker-gen1rb",
    nome: "Biker-gen1rb",
    imagem: "/images/trainers/biker-gen1rb.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 1375,
    stardust: 3219,
    xp: 450,
    ia: "agressiva",
    time: [
      { speciesId: 399, nome: "Bidoof", level: 58 },
      { speciesId: 915, nome: "Lechonk", level: 41 },
      { speciesId: 128, nome: "Tauros", level: 61 },
      { speciesId: 376, nome: "Metagross", level: 19 },
      { speciesId: 600, nome: "Klang", level: 73 },
      { speciesId: 609, nome: "Chandelure", level: 66 }
    ]
  },

  {
    id: "biker-gen2",
    nome: "Biker-gen2",
    imagem: "/images/trainers/biker-gen2.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 2414,
    stardust: 839,
    xp: 346,
    ia: "aleatoria",
    time: [
      { speciesId: 927, nome: "Dachsbun", level: 70 },
      { speciesId: 571, nome: "Zoroark", level: 20 },
      { speciesId: 313, nome: "Volbeat", level: 19 },
      { speciesId: 824, nome: "Blipbug", level: 10 },
      { speciesId: 706, nome: "Goodra", level: 39 },
      { speciesId: 212, nome: "Scizor", level: 10 }
    ]
  },

  {
    id: "biker-gen3",
    nome: "Biker-gen3",
    imagem: "/images/trainers/biker-gen3.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 421,
    stardust: 3684,
    xp: 387,
    ia: "aleatoria",
    time: [
      { speciesId: 415, nome: "Combee", level: 65 },
      { speciesId: 177, nome: "Natu", level: 35 },
      { speciesId: 351, nome: "Castform", level: 18 },
      { speciesId: 469, nome: "Yanmega", level: 26 },
      { speciesId: 926, nome: "Fidough", level: 15 },
      { speciesId: 661, nome: "Fletchling", level: 40 }
    ]
  },

  {
    id: "biker-gen4",
    nome: "Biker-gen4",
    imagem: "/images/trainers/biker-gen4.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 2045,
    stardust: 186,
    xp: 449,
    ia: "aleatoria",
    time: [
      { speciesId: 734, nome: "Yungoos", level: 63 },
      { speciesId: 255, nome: "Torchic", level: 31 },
      { speciesId: 801, nome: "Magearna", level: 50 },
      { speciesId: 18, nome: "Pidgeot", level: 62 },
      { speciesId: 498, nome: "Tepig", level: 44 },
      { speciesId: 30, nome: "Nidorina", level: 46 }
    ]
  },

  {
    id: "biker",
    nome: "Biker",
    imagem: "/images/trainers/biker.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 1509,
    stardust: 512,
    xp: 264,
    ia: "agressiva",
    time: [
      { speciesId: 359, nome: "Absol", level: 68 },
      { speciesId: 259, nome: "Marshtomp", level: 73 },
      { speciesId: 612, nome: "Haxorus", level: 42 },
      { speciesId: 380, nome: "Latias", level: 22 },
      { speciesId: 353, nome: "Shuppet", level: 56 },
      { speciesId: 846, nome: "Arrokuda", level: 39 }
    ]
  },

  {
    id: "bill-gen3",
    nome: "Bill-gen3",
    imagem: "/images/trainers/bill-gen3.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 1572,
    stardust: 3358,
    xp: 460,
    ia: "estrategica",
    time: [
      { speciesId: 830, nome: "Eldegoss", level: 48 },
      { speciesId: 536, nome: "Palpitoad", level: 69 },
      { speciesId: 552, nome: "Krokorok", level: 73 },
      { speciesId: 516, nome: "Simipour", level: 33 },
      { speciesId: 865, nome: "Sirfetchd", level: 11 },
      { speciesId: 1025, nome: "Pecharunt", level: 21 }
    ]
  },

  {
    id: "bill",
    nome: "Bill",
    imagem: "/images/trainers/bill.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 1911,
    stardust: 346,
    xp: 244,
    ia: "defensiva",
    time: [
      { speciesId: 1003, nome: "Ting-lu", level: 25 },
      { speciesId: 110, nome: "Weezing", level: 62 },
      { speciesId: 290, nome: "Nincada", level: 71 },
      { speciesId: 455, nome: "Carnivine", level: 43 },
      { speciesId: 483, nome: "Dialga", level: 75 },
      { speciesId: 749, nome: "Mudbray", level: 46 }
    ]
  },

  {
    id: "birch-gen3",
    nome: "Birch-gen3",
    imagem: "/images/trainers/birch-gen3.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 826,
    stardust: 4854,
    xp: 408,
    ia: "defensiva",
    time: [
      { speciesId: 160, nome: "Feraligatr", level: 47 },
      { speciesId: 583, nome: "Vanillish", level: 72 },
      { speciesId: 922, nome: "Pawmo", level: 41 },
      { speciesId: 1020, nome: "Gouging-fire", level: 77 },
      { speciesId: 650, nome: "Chespin", level: 47 },
      { speciesId: 934, nome: "Garganacl", level: 59 }
    ]
  },

  {
    id: "birch",
    nome: "Birch",
    imagem: "/images/trainers/birch.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 2043,
    stardust: 4770,
    xp: 131,
    ia: "estrategica",
    time: [
      { speciesId: 291, nome: "Ninjask", level: 66 },
      { speciesId: 977, nome: "Dondozo", level: 21 },
      { speciesId: 422, nome: "Shellos", level: 71 },
      { speciesId: 363, nome: "Spheal", level: 72 },
      { speciesId: 1018, nome: "Archaludon", level: 66 },
      { speciesId: 816, nome: "Sobble", level: 58 }
    ]
  },

  {
    id: "birdkeeper-gen1",
    nome: "Birdkeeper-gen1",
    imagem: "/images/trainers/birdkeeper-gen1.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 2722,
    stardust: 3238,
    xp: 430,
    ia: "agressiva",
    time: [
      { speciesId: 151, nome: "Mew", level: 14 },
      { speciesId: 967, nome: "Cyclizar", level: 78 },
      { speciesId: 835, nome: "Yamper", level: 76 },
      { speciesId: 150, nome: "Mewtwo", level: 56 },
      { speciesId: 405, nome: "Luxray", level: 53 },
      { speciesId: 187, nome: "Hoppip", level: 24 }
    ]
  },

  {
    id: "birdkeeper-gen1rb",
    nome: "Birdkeeper-gen1rb",
    imagem: "/images/trainers/birdkeeper-gen1rb.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 1925,
    stardust: 1384,
    xp: 452,
    ia: "defensiva",
    time: [
      { speciesId: 718, nome: "Zygarde-50", level: 72 },
      { speciesId: 779, nome: "Bruxish", level: 60 },
      { speciesId: 39, nome: "Jigglypuff", level: 51 },
      { speciesId: 240, nome: "Magby", level: 62 },
      { speciesId: 328, nome: "Trapinch", level: 28 },
      { speciesId: 512, nome: "Simisage", level: 71 }
    ]
  },

  {
    id: "birdkeeper-gen2",
    nome: "Birdkeeper-gen2",
    imagem: "/images/trainers/birdkeeper-gen2.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 110,
    stardust: 3861,
    xp: 99,
    ia: "agressiva",
    time: [
      { speciesId: 239, nome: "Elekid", level: 55 },
      { speciesId: 673, nome: "Gogoat", level: 20 },
      { speciesId: 824, nome: "Blipbug", level: 74 },
      { speciesId: 927, nome: "Dachsbun", level: 22 },
      { speciesId: 195, nome: "Quagsire", level: 69 },
      { speciesId: 852, nome: "Clobbopus", level: 14 }
    ]
  },

  {
    id: "birdkeeper-gen3",
    nome: "Birdkeeper-gen3",
    imagem: "/images/trainers/birdkeeper-gen3.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 1050,
    stardust: 3841,
    xp: 229,
    ia: "defensiva",
    time: [
      { speciesId: 252, nome: "Treecko", level: 59 },
      { speciesId: 360, nome: "Wynaut", level: 67 },
      { speciesId: 340, nome: "Whiscash", level: 65 },
      { speciesId: 791, nome: "Solgaleo", level: 34 },
      { speciesId: 123, nome: "Scyther", level: 15 },
      { speciesId: 5, nome: "Charmeleon", level: 71 }
    ]
  },

  {
    id: "birdkeeper-gen3rs",
    nome: "Birdkeeper-gen3rs",
    imagem: "/images/trainers/birdkeeper-gen3rs.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 1223,
    stardust: 5034,
    xp: 378,
    ia: "estrategica",
    time: [
      { speciesId: 554, nome: "Darumaka", level: 43 },
      { speciesId: 10, nome: "Caterpie", level: 74 },
      { speciesId: 673, nome: "Gogoat", level: 64 },
      { speciesId: 560, nome: "Scrafty", level: 40 },
      { speciesId: 558, nome: "Crustle", level: 44 },
      { speciesId: 584, nome: "Vanilluxe", level: 56 }
    ]
  },

  {
    id: "birdkeeper-gen4dp",
    nome: "Birdkeeper-gen4dp",
    imagem: "/images/trainers/birdkeeper-gen4dp.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 1905,
    stardust: 2791,
    xp: 369,
    ia: "defensiva",
    time: [
      { speciesId: 455, nome: "Carnivine", level: 69 },
      { speciesId: 739, nome: "Crabrawler", level: 37 },
      { speciesId: 254, nome: "Sceptile", level: 62 },
      { speciesId: 799, nome: "Guzzlord", level: 72 },
      { speciesId: 528, nome: "Swoobat", level: 28 },
      { speciesId: 701, nome: "Hawlucha", level: 63 }
    ]
  },

  {
    id: "birdkeeper-gen6",
    nome: "Birdkeeper-gen6",
    imagem: "/images/trainers/birdkeeper-gen6.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 1551,
    stardust: 3911,
    xp: 352,
    ia: "agressiva",
    time: [
      { speciesId: 256, nome: "Combusken", level: 76 },
      { speciesId: 497, nome: "Serperior", level: 79 },
      { speciesId: 269, nome: "Dustox", level: 16 },
      { speciesId: 602, nome: "Tynamo", level: 12 },
      { speciesId: 641, nome: "Tornadus-incarnate", level: 35 },
      { speciesId: 288, nome: "Vigoroth", level: 39 }
    ]
  },

  {
    id: "birdkeeper",
    nome: "Birdkeeper",
    imagem: "/images/trainers/birdkeeper.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 2894,
    stardust: 440,
    xp: 72,
    ia: "aleatoria",
    time: [
      { speciesId: 542, nome: "Leavanny", level: 50 },
      { speciesId: 811, nome: "Thwackey", level: 46 },
      { speciesId: 936, nome: "Armarouge", level: 39 },
      { speciesId: 1012, nome: "Poltchageist", level: 29 },
      { speciesId: 868, nome: "Milcery", level: 35 },
      { speciesId: 749, nome: "Mudbray", level: 43 }
    ]
  },

  {
    id: "blackbelt-gen1",
    nome: "Blackbelt-gen1",
    imagem: "/images/trainers/blackbelt-gen1.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 1101,
    stardust: 739,
    xp: 113,
    ia: "estrategica",
    time: [
      { speciesId: 190, nome: "Aipom", level: 41 },
      { speciesId: 980, nome: "Clodsire", level: 52 },
      { speciesId: 743, nome: "Ribombee", level: 52 },
      { speciesId: 151, nome: "Mew", level: 67 },
      { speciesId: 371, nome: "Bagon", level: 20 },
      { speciesId: 771, nome: "Pyukumuku", level: 14 }
    ]
  },

  {
    id: "blackbelt-gen1rb",
    nome: "Blackbelt-gen1rb",
    imagem: "/images/trainers/blackbelt-gen1rb.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 583,
    stardust: 214,
    xp: 226,
    ia: "aleatoria",
    time: [
      { speciesId: 863, nome: "Perrserker", level: 14 },
      { speciesId: 922, nome: "Pawmo", level: 49 },
      { speciesId: 77, nome: "Ponyta", level: 23 },
      { speciesId: 194, nome: "Wooper", level: 46 },
      { speciesId: 288, nome: "Vigoroth", level: 70 },
      { speciesId: 787, nome: "Tapu-bulu", level: 28 }
    ]
  },

  {
    id: "blackbelt-gen2",
    nome: "Blackbelt-gen2",
    imagem: "/images/trainers/blackbelt-gen2.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 1899,
    stardust: 4859,
    xp: 414,
    ia: "estrategica",
    time: [
      { speciesId: 627, nome: "Rufflet", level: 78 },
      { speciesId: 755, nome: "Morelull", level: 46 },
      { speciesId: 791, nome: "Solgaleo", level: 16 },
      { speciesId: 470, nome: "Leafeon", level: 43 },
      { speciesId: 15, nome: "Beedrill", level: 42 },
      { speciesId: 67, nome: "Machoke", level: 77 }
    ]
  },

  {
    id: "blackbelt-gen3",
    nome: "Blackbelt-gen3",
    imagem: "/images/trainers/blackbelt-gen3.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 2904,
    stardust: 4384,
    xp: 259,
    ia: "agressiva",
    time: [
      { speciesId: 129, nome: "Magikarp", level: 35 },
      { speciesId: 390, nome: "Chimchar", level: 62 },
      { speciesId: 710, nome: "Pumpkaboo-average", level: 74 },
      { speciesId: 416, nome: "Vespiquen", level: 58 },
      { speciesId: 379, nome: "Registeel", level: 30 },
      { speciesId: 669, nome: "Flabebe", level: 48 }
    ]
  },

  {
    id: "blackbelt-gen3rs",
    nome: "Blackbelt-gen3rs",
    imagem: "/images/trainers/blackbelt-gen3rs.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 1688,
    stardust: 1847,
    xp: 150,
    ia: "defensiva",
    time: [
      { speciesId: 230, nome: "Kingdra", level: 76 },
      { speciesId: 827, nome: "Nickit", level: 66 },
      { speciesId: 976, nome: "Veluza", level: 47 },
      { speciesId: 930, nome: "Arboliva", level: 31 },
      { speciesId: 924, nome: "Tandemaus", level: 53 },
      { speciesId: 562, nome: "Yamask", level: 35 }
    ]
  },

  {
    id: "blackbelt-gen4",
    nome: "Blackbelt-gen4",
    imagem: "/images/trainers/blackbelt-gen4.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 1881,
    stardust: 5452,
    xp: 111,
    ia: "defensiva",
    time: [
      { speciesId: 50, nome: "Diglett", level: 70 },
      { speciesId: 874, nome: "Stonjourner", level: 69 },
      { speciesId: 913, nome: "Quaxwell", level: 43 },
      { speciesId: 507, nome: "Herdier", level: 63 },
      { speciesId: 401, nome: "Kricketot", level: 63 },
      { speciesId: 497, nome: "Serperior", level: 45 }
    ]
  },

  {
    id: "blackbelt-gen4dp",
    nome: "Blackbelt-gen4dp",
    imagem: "/images/trainers/blackbelt-gen4dp.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 2805,
    stardust: 3043,
    xp: 435,
    ia: "estrategica",
    time: [
      { speciesId: 101, nome: "Electrode", level: 52 },
      { speciesId: 972, nome: "Houndstone", level: 50 },
      { speciesId: 839, nome: "Coalossal", level: 42 },
      { speciesId: 147, nome: "Dratini", level: 30 },
      { speciesId: 931, nome: "Squawkabilly-green-plumage", level: 13 },
      { speciesId: 697, nome: "Tyrantrum", level: 76 }
    ]
  },

  {
    id: "blackbelt-gen6",
    nome: "Blackbelt-gen6",
    imagem: "/images/trainers/blackbelt-gen6.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 1694,
    stardust: 687,
    xp: 334,
    ia: "estrategica",
    time: [
      { speciesId: 57, nome: "Primeape", level: 33 },
      { speciesId: 622, nome: "Golett", level: 27 },
      { speciesId: 522, nome: "Blitzle", level: 59 },
      { speciesId: 725, nome: "Litten", level: 40 },
      { speciesId: 940, nome: "Wattrel", level: 77 },
      { speciesId: 666, nome: "Vivillon", level: 21 }
    ]
  },

  {
    id: "blackbelt-gen7",
    nome: "Blackbelt-gen7",
    imagem: "/images/trainers/blackbelt-gen7.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 1377,
    stardust: 2689,
    xp: 432,
    ia: "defensiva",
    time: [
      { speciesId: 854, nome: "Sinistea", level: 20 },
      { speciesId: 305, nome: "Lairon", level: 43 },
      { speciesId: 422, nome: "Shellos", level: 23 },
      { speciesId: 957, nome: "Tinkatink", level: 62 },
      { speciesId: 484, nome: "Palkia", level: 77 },
      { speciesId: 647, nome: "Keldeo-ordinary", level: 44 }
    ]
  },

  {
    id: "blackbelt-gen8",
    nome: "Blackbelt-gen8",
    imagem: "/images/trainers/blackbelt-gen8.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 749,
    stardust: 4651,
    xp: 303,
    ia: "aleatoria",
    time: [
      { speciesId: 461, nome: "Weavile", level: 38 },
      { speciesId: 729, nome: "Brionne", level: 66 },
      { speciesId: 823, nome: "Corviknight", level: 24 },
      { speciesId: 1012, nome: "Poltchageist", level: 43 },
      { speciesId: 1016, nome: "Fezandipiti", level: 50 },
      { speciesId: 890, nome: "Eternatus", level: 17 }
    ]
  },

  {
    id: "blackbelt-gen9",
    nome: "Blackbelt-gen9",
    imagem: "/images/trainers/blackbelt-gen9.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 2661,
    stardust: 4715,
    xp: 195,
    ia: "defensiva",
    time: [
      { speciesId: 95, nome: "Onix", level: 34 },
      { speciesId: 501, nome: "Oshawott", level: 37 },
      { speciesId: 463, nome: "Lickilicky", level: 23 },
      { speciesId: 931, nome: "Squawkabilly-green-plumage", level: 40 },
      { speciesId: 1009, nome: "Walking-wake", level: 28 },
      { speciesId: 966, nome: "Revavroom", level: 64 }
    ]
  },

  {
    id: "blackbelt",
    nome: "Blackbelt",
    imagem: "/images/trainers/blackbelt.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 172,
    stardust: 2048,
    xp: 125,
    ia: "agressiva",
    time: [
      { speciesId: 619, nome: "Mienfoo", level: 69 },
      { speciesId: 143, nome: "Snorlax", level: 71 },
      { speciesId: 870, nome: "Falinks", level: 25 },
      { speciesId: 443, nome: "Gible", level: 43 },
      { speciesId: 195, nome: "Quagsire", level: 22 },
      { speciesId: 38, nome: "Ninetales", level: 65 }
    ]
  },

  {
    id: "blaine-gen1",
    nome: "Blaine-gen1",
    imagem: "/images/trainers/blaine-gen1.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 1007,
    stardust: 3010,
    xp: 68,
    ia: "defensiva",
    time: [
      { speciesId: 818, nome: "Inteleon", level: 46 },
      { speciesId: 672, nome: "Skiddo", level: 49 },
      { speciesId: 517, nome: "Munna", level: 73 },
      { speciesId: 634, nome: "Zweilous", level: 76 },
      { speciesId: 456, nome: "Finneon", level: 78 },
      { speciesId: 783, nome: "Hakamo-o", level: 49 }
    ]
  },

  {
    id: "blaine-gen1rb",
    nome: "Blaine-gen1rb",
    imagem: "/images/trainers/blaine-gen1rb.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 1571,
    stardust: 3795,
    xp: 447,
    ia: "defensiva",
    time: [
      { speciesId: 528, nome: "Swoobat", level: 16 },
      { speciesId: 10, nome: "Caterpie", level: 12 },
      { speciesId: 498, nome: "Tepig", level: 20 },
      { speciesId: 248, nome: "Tyranitar", level: 61 },
      { speciesId: 870, nome: "Falinks", level: 17 },
      { speciesId: 855, nome: "Polteageist", level: 42 }
    ]
  },

  {
    id: "blaine-gen2",
    nome: "Blaine-gen2",
    imagem: "/images/trainers/blaine-gen2.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 2167,
    stardust: 137,
    xp: 463,
    ia: "estrategica",
    time: [
      { speciesId: 649, nome: "Genesect", level: 39 },
      { speciesId: 133, nome: "Eevee", level: 20 },
      { speciesId: 24, nome: "Arbok", level: 24 },
      { speciesId: 262, nome: "Mightyena", level: 17 },
      { speciesId: 553, nome: "Krookodile", level: 34 },
      { speciesId: 138, nome: "Omanyte", level: 48 }
    ]
  },

  {
    id: "blaine-gen3",
    nome: "Blaine-gen3",
    imagem: "/images/trainers/blaine-gen3.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 2137,
    stardust: 159,
    xp: 461,
    ia: "defensiva",
    time: [
      { speciesId: 529, nome: "Drilbur", level: 10 },
      { speciesId: 598, nome: "Ferrothorn", level: 68 },
      { speciesId: 998, nome: "Baxcalibur", level: 26 },
      { speciesId: 164, nome: "Noctowl", level: 48 },
      { speciesId: 912, nome: "Quaxly", level: 78 },
      { speciesId: 206, nome: "Dunsparce", level: 53 }
    ]
  },

  {
    id: "blaine-lgpe",
    nome: "Blaine-lgpe",
    imagem: "/images/trainers/blaine-lgpe.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 1830,
    stardust: 397,
    xp: 422,
    ia: "aleatoria",
    time: [
      { speciesId: 530, nome: "Excadrill", level: 58 },
      { speciesId: 160, nome: "Feraligatr", level: 41 },
      { speciesId: 977, nome: "Dondozo", level: 65 },
      { speciesId: 563, nome: "Cofagrigus", level: 39 },
      { speciesId: 102, nome: "Exeggcute", level: 40 },
      { speciesId: 784, nome: "Kommo-o", level: 16 }
    ]
  },

  {
    id: "blaine",
    nome: "Blaine",
    imagem: "/images/trainers/blaine.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 683,
    stardust: 1743,
    xp: 496,
    ia: "defensiva",
    time: [
      { speciesId: 444, nome: "Gabite", level: 19 },
      { speciesId: 760, nome: "Bewear", level: 72 },
      { speciesId: 275, nome: "Shiftry", level: 16 },
      { speciesId: 104, nome: "Cubone", level: 33 },
      { speciesId: 83, nome: "Farfetchd", level: 76 },
      { speciesId: 948, nome: "Toedscool", level: 78 }
    ]
  },

  {
    id: "blanche-casual",
    nome: "Blanche-casual",
    imagem: "/images/trainers/blanche-casual.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 2855,
    stardust: 973,
    xp: 410,
    ia: "defensiva",
    time: [
      { speciesId: 233, nome: "Porygon2", level: 22 },
      { speciesId: 992, nome: "Iron-hands", level: 19 },
      { speciesId: 846, nome: "Arrokuda", level: 75 },
      { speciesId: 994, nome: "Iron-moth", level: 40 },
      { speciesId: 245, nome: "Suicune", level: 33 },
      { speciesId: 840, nome: "Applin", level: 57 }
    ]
  },

  {
    id: "blanche",
    nome: "Blanche",
    imagem: "/images/trainers/blanche.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 2072,
    stardust: 4376,
    xp: 326,
    ia: "agressiva",
    time: [
      { speciesId: 378, nome: "Regice", level: 19 },
      { speciesId: 784, nome: "Kommo-o", level: 68 },
      { speciesId: 379, nome: "Registeel", level: 68 },
      { speciesId: 604, nome: "Eelektross", level: 29 },
      { speciesId: 199, nome: "Slowking", level: 39 },
      { speciesId: 271, nome: "Lombre", level: 50 }
    ]
  },

  {
    id: "blue-gen1",
    nome: "Blue-gen1",
    imagem: "/images/trainers/blue-gen1.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 2925,
    stardust: 782,
    xp: 486,
    ia: "agressiva",
    time: [
      { speciesId: 898, nome: "Calyrex", level: 31 },
      { speciesId: 443, nome: "Gible", level: 21 },
      { speciesId: 977, nome: "Dondozo", level: 45 },
      { speciesId: 331, nome: "Cacnea", level: 77 },
      { speciesId: 670, nome: "Floette", level: 13 },
      { speciesId: 66, nome: "Machop", level: 71 }
    ]
  },

  {
    id: "blue-gen1champion",
    nome: "Blue-gen1champion",
    imagem: "/images/trainers/blue-gen1champion.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 2022,
    stardust: 4889,
    xp: 143,
    ia: "defensiva",
    time: [
      { speciesId: 91, nome: "Cloyster", level: 62 },
      { speciesId: 130, nome: "Gyarados", level: 45 },
      { speciesId: 229, nome: "Houndoom", level: 29 },
      { speciesId: 675, nome: "Pangoro", level: 17 },
      { speciesId: 314, nome: "Illumise", level: 44 },
      { speciesId: 1004, nome: "Chi-yu", level: 28 }
    ]
  },

  {
    id: "blue-gen1rb",
    nome: "Blue-gen1rb",
    imagem: "/images/trainers/blue-gen1rb.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 842,
    stardust: 3490,
    xp: 491,
    ia: "defensiva",
    time: [
      { speciesId: 613, nome: "Cubchoo", level: 41 },
      { speciesId: 840, nome: "Applin", level: 17 },
      { speciesId: 484, nome: "Palkia", level: 67 },
      { speciesId: 165, nome: "Ledyba", level: 48 },
      { speciesId: 784, nome: "Kommo-o", level: 51 },
      { speciesId: 209, nome: "Snubbull", level: 62 }
    ]
  },

  {
    id: "blue-gen1rbchampion",
    nome: "Blue-gen1rbchampion",
    imagem: "/images/trainers/blue-gen1rbchampion.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 217,
    stardust: 279,
    xp: 401,
    ia: "defensiva",
    time: [
      { speciesId: 911, nome: "Skeledirge", level: 27 },
      { speciesId: 344, nome: "Claydol", level: 51 },
      { speciesId: 147, nome: "Dratini", level: 59 },
      { speciesId: 512, nome: "Simisage", level: 50 },
      { speciesId: 396, nome: "Starly", level: 73 },
      { speciesId: 206, nome: "Dunsparce", level: 56 }
    ]
  },

  {
    id: "blue-gen1rbtwo",
    nome: "Blue-gen1rbtwo",
    imagem: "/images/trainers/blue-gen1rbtwo.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 2191,
    stardust: 3944,
    xp: 458,
    ia: "agressiva",
    time: [
      { speciesId: 734, nome: "Yungoos", level: 71 },
      { speciesId: 27, nome: "Sandshrew", level: 28 },
      { speciesId: 77, nome: "Ponyta", level: 79 },
      { speciesId: 594, nome: "Alomomola", level: 66 },
      { speciesId: 92, nome: "Gastly", level: 43 },
      { speciesId: 625, nome: "Bisharp", level: 26 }
    ]
  },

  {
    id: "blue-gen1two",
    nome: "Blue-gen1two",
    imagem: "/images/trainers/blue-gen1two.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 2416,
    stardust: 3404,
    xp: 467,
    ia: "aleatoria",
    time: [
      { speciesId: 131, nome: "Lapras", level: 33 },
      { speciesId: 837, nome: "Rolycoly", level: 63 },
      { speciesId: 125, nome: "Electabuzz", level: 25 },
      { speciesId: 116, nome: "Horsea", level: 17 },
      { speciesId: 440, nome: "Happiny", level: 55 },
      { speciesId: 905, nome: "Enamorus-incarnate", level: 51 }
    ]
  },

  {
    id: "blue-gen2",
    nome: "Blue-gen2",
    imagem: "/images/trainers/blue-gen2.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 533,
    stardust: 1761,
    xp: 332,
    ia: "agressiva",
    time: [
      { speciesId: 502, nome: "Dewott", level: 25 },
      { speciesId: 759, nome: "Stufful", level: 14 },
      { speciesId: 288, nome: "Vigoroth", level: 71 },
      { speciesId: 638, nome: "Cobalion", level: 26 },
      { speciesId: 1019, nome: "Hydrapple", level: 66 },
      { speciesId: 708, nome: "Phantump", level: 52 }
    ]
  },

  {
    id: "blue-gen3",
    nome: "Blue-gen3",
    imagem: "/images/trainers/blue-gen3.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "dificil",
    recompensa: 411,
    stardust: 3593,
    xp: 274,
    ia: "agressiva",
    time: [
      { speciesId: 882, nome: "Dracovish", level: 29 },
      { speciesId: 424, nome: "Ambipom", level: 29 },
      { speciesId: 489, nome: "Phione", level: 80 },
      { speciesId: 658, nome: "Greninja", level: 55 },
      { speciesId: 218, nome: "Slugma", level: 43 },
      { speciesId: 325, nome: "Spoink", level: 77 }
    ]
  },

  {
    id: "blue-gen3champion",
    nome: "Blue-gen3champion",
    imagem: "/images/trainers/blue-gen3champion.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 326,
    stardust: 787,
    xp: 344,
    ia: "defensiva",
    time: [
      { speciesId: 823, nome: "Corviknight", level: 73 },
      { speciesId: 17, nome: "Pidgeotto", level: 44 },
      { speciesId: 822, nome: "Corvisquire", level: 31 },
      { speciesId: 790, nome: "Cosmoem", level: 67 },
      { speciesId: 452, nome: "Drapion", level: 39 },
      { speciesId: 255, nome: "Torchic", level: 59 }
    ]
  },

  {
    id: "blue-gen3two",
    nome: "Blue-gen3two",
    imagem: "/images/trainers/blue-gen3two.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 1552,
    stardust: 2165,
    xp: 423,
    ia: "aleatoria",
    time: [
      { speciesId: 205, nome: "Forretress", level: 25 },
      { speciesId: 621, nome: "Druddigon", level: 50 },
      { speciesId: 375, nome: "Metang", level: 23 },
      { speciesId: 534, nome: "Conkeldurr", level: 74 },
      { speciesId: 134, nome: "Vaporeon", level: 44 },
      { speciesId: 942, nome: "Maschiff", level: 78 }
    ]
  },

  {
    id: "blue-gen7",
    nome: "Blue-gen7",
    imagem: "/images/trainers/blue-gen7.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 2865,
    stardust: 435,
    xp: 296,
    ia: "estrategica",
    time: [
      { speciesId: 557, nome: "Dwebble", level: 73 },
      { speciesId: 36, nome: "Clefable", level: 79 },
      { speciesId: 192, nome: "Sunflora", level: 56 },
      { speciesId: 937, nome: "Ceruledge", level: 65 },
      { speciesId: 96, nome: "Drowzee", level: 14 },
      { speciesId: 829, nome: "Gossifleur", level: 34 }
    ]
  },

  {
    id: "blue-lgpe",
    nome: "Blue-lgpe",
    imagem: "/images/trainers/blue-lgpe.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 1087,
    stardust: 231,
    xp: 496,
    ia: "agressiva",
    time: [
      { speciesId: 622, nome: "Golett", level: 36 },
      { speciesId: 258, nome: "Mudkip", level: 10 },
      { speciesId: 442, nome: "Spiritomb", level: 45 },
      { speciesId: 381, nome: "Latios", level: 72 },
      { speciesId: 617, nome: "Accelgor", level: 51 },
      { speciesId: 76, nome: "Golem", level: 44 }
    ]
  },

  {
    id: "blue-masters",
    nome: "Blue-masters",
    imagem: "/images/trainers/blue-masters.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 2545,
    stardust: 3554,
    xp: 52,
    ia: "estrategica",
    time: [
      { speciesId: 199, nome: "Slowking", level: 19 },
      { speciesId: 53, nome: "Persian", level: 66 },
      { speciesId: 352, nome: "Kecleon", level: 43 },
      { speciesId: 111, nome: "Rhyhorn", level: 70 },
      { speciesId: 306, nome: "Aggron", level: 12 },
      { speciesId: 457, nome: "Lumineon", level: 32 }
    ]
  },

  {
    id: "blue-masters2",
    nome: "Blue-masters2",
    imagem: "/images/trainers/blue-masters2.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 2285,
    stardust: 4784,
    xp: 394,
    ia: "defensiva",
    time: [
      { speciesId: 531, nome: "Audino", level: 42 },
      { speciesId: 846, nome: "Arrokuda", level: 35 },
      { speciesId: 759, nome: "Stufful", level: 34 },
      { speciesId: 229, nome: "Houndoom", level: 72 },
      { speciesId: 684, nome: "Swirlix", level: 80 },
      { speciesId: 20, nome: "Raticate", level: 66 }
    ]
  },

  {
    id: "blue",
    nome: "Blue",
    imagem: "/images/trainers/blue.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 558,
    stardust: 2772,
    xp: 103,
    ia: "defensiva",
    time: [
      { speciesId: 734, nome: "Yungoos", level: 30 },
      { speciesId: 730, nome: "Primarina", level: 48 },
      { speciesId: 852, nome: "Clobbopus", level: 69 },
      { speciesId: 400, nome: "Bibarel", level: 55 },
      { speciesId: 936, nome: "Armarouge", level: 33 },
      { speciesId: 632, nome: "Durant", level: 33 }
    ]
  },

  {
    id: "boarder-gen2",
    nome: "Boarder-gen2",
    imagem: "/images/trainers/boarder-gen2.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 886,
    stardust: 3973,
    xp: 418,
    ia: "agressiva",
    time: [
      { speciesId: 332, nome: "Cacturne", level: 57 },
      { speciesId: 394, nome: "Prinplup", level: 39 },
      { speciesId: 273, nome: "Seedot", level: 31 },
      { speciesId: 415, nome: "Combee", level: 28 },
      { speciesId: 392, nome: "Infernape", level: 52 },
      { speciesId: 108, nome: "Lickitung", level: 37 }
    ]
  },

  {
    id: "boarder",
    nome: "Boarder",
    imagem: "/images/trainers/boarder.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 2063,
    stardust: 3411,
    xp: 364,
    ia: "defensiva",
    time: [
      { speciesId: 992, nome: "Iron-hands", level: 37 },
      { speciesId: 616, nome: "Shelmet", level: 47 },
      { speciesId: 966, nome: "Revavroom", level: 77 },
      { speciesId: 612, nome: "Haxorus", level: 39 },
      { speciesId: 329, nome: "Vibrava", level: 58 },
      { speciesId: 80, nome: "Slowbro", level: 61 }
    ]
  },

  {
    id: "bodybuilder-gen9",
    nome: "Bodybuilder-gen9",
    imagem: "/images/trainers/bodybuilder-gen9.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 316,
    stardust: 1162,
    xp: 326,
    ia: "aleatoria",
    time: [
      { speciesId: 990, nome: "Iron-treads", level: 30 },
      { speciesId: 927, nome: "Dachsbun", level: 74 },
      { speciesId: 830, nome: "Eldegoss", level: 53 },
      { speciesId: 461, nome: "Weavile", level: 28 },
      { speciesId: 549, nome: "Lilligant", level: 11 },
      { speciesId: 444, nome: "Gabite", level: 39 }
    ]
  },

  {
    id: "bodybuilderf-gen9",
    nome: "Bodybuilderf-gen9",
    imagem: "/images/trainers/bodybuilderf-gen9.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 1105,
    stardust: 2570,
    xp: 253,
    ia: "estrategica",
    time: [
      { speciesId: 991, nome: "Iron-bundle", level: 40 },
      { speciesId: 771, nome: "Pyukumuku", level: 27 },
      { speciesId: 517, nome: "Munna", level: 25 },
      { speciesId: 774, nome: "Minior-red-meteor", level: 34 },
      { speciesId: 924, nome: "Tandemaus", level: 13 },
      { speciesId: 849, nome: "Toxtricity-amped", level: 58 }
    ]
  },

  {
    id: "brandon-gen3",
    nome: "Brandon-gen3",
    imagem: "/images/trainers/brandon-gen3.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 914,
    stardust: 3485,
    xp: 476,
    ia: "defensiva",
    time: [
      { speciesId: 850, nome: "Sizzlipede", level: 60 },
      { speciesId: 348, nome: "Armaldo", level: 31 },
      { speciesId: 163, nome: "Hoothoot", level: 12 },
      { speciesId: 866, nome: "Mr-rime", level: 64 },
      { speciesId: 129, nome: "Magikarp", level: 22 },
      { speciesId: 472, nome: "Gliscor", level: 52 }
    ]
  },

  {
    id: "brandon",
    nome: "Brandon",
    imagem: "/images/trainers/brandon.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 2667,
    stardust: 5001,
    xp: 292,
    ia: "aleatoria",
    time: [
      { speciesId: 338, nome: "Solrock", level: 23 },
      { speciesId: 445, nome: "Garchomp", level: 48 },
      { speciesId: 788, nome: "Tapu-fini", level: 62 },
      { speciesId: 1025, nome: "Pecharunt", level: 23 },
      { speciesId: 454, nome: "Toxicroak", level: 30 },
      { speciesId: 150, nome: "Mewtwo", level: 13 }
    ]
  },

  {
    id: "brassius",
    nome: "Brassius",
    imagem: "/images/trainers/brassius.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 2590,
    stardust: 4750,
    xp: 265,
    ia: "agressiva",
    time: [
      { speciesId: 284, nome: "Masquerain", level: 45 },
      { speciesId: 64, nome: "Kadabra", level: 73 },
      { speciesId: 144, nome: "Articuno", level: 12 },
      { speciesId: 958, nome: "Tinkatuff", level: 67 },
      { speciesId: 243, nome: "Raikou", level: 12 },
      { speciesId: 365, nome: "Walrein", level: 34 }
    ]
  },

  {
    id: "brawly-gen3",
    nome: "Brawly-gen3",
    imagem: "/images/trainers/brawly-gen3.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 2942,
    stardust: 5072,
    xp: 495,
    ia: "aleatoria",
    time: [
      { speciesId: 905, nome: "Enamorus-incarnate", level: 23 },
      { speciesId: 875, nome: "Eiscue-ice", level: 50 },
      { speciesId: 776, nome: "Turtonator", level: 65 },
      { speciesId: 735, nome: "Gumshoos", level: 71 },
      { speciesId: 829, nome: "Gossifleur", level: 11 },
      { speciesId: 84, nome: "Doduo", level: 27 }
    ]
  },

  {
    id: "brawly-gen6",
    nome: "Brawly-gen6",
    imagem: "/images/trainers/brawly-gen6.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 2966,
    stardust: 807,
    xp: 445,
    ia: "defensiva",
    time: [
      { speciesId: 445, nome: "Garchomp", level: 49 },
      { speciesId: 889, nome: "Zamazenta", level: 16 },
      { speciesId: 884, nome: "Duraludon", level: 42 },
      { speciesId: 657, nome: "Frogadier", level: 66 },
      { speciesId: 461, nome: "Weavile", level: 49 },
      { speciesId: 826, nome: "Orbeetle", level: 17 }
    ]
  },

  {
    id: "brawly",
    nome: "Brawly",
    imagem: "/images/trainers/brawly.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 233,
    stardust: 3858,
    xp: 142,
    ia: "defensiva",
    time: [
      { speciesId: 257, nome: "Blaziken", level: 43 },
      { speciesId: 45, nome: "Vileplume", level: 68 },
      { speciesId: 73, nome: "Tentacruel", level: 79 },
      { speciesId: 666, nome: "Vivillon", level: 34 },
      { speciesId: 202, nome: "Wobbuffet", level: 61 },
      { speciesId: 513, nome: "Pansear", level: 31 }
    ]
  },

  {
    id: "brendan-contest",
    nome: "Brendan-contest",
    imagem: "/images/trainers/brendan-contest.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 2695,
    stardust: 4815,
    xp: 67,
    ia: "estrategica",
    time: [
      { speciesId: 119, nome: "Seaking", level: 14 },
      { speciesId: 997, nome: "Arctibax", level: 34 },
      { speciesId: 941, nome: "Kilowattrel", level: 41 },
      { speciesId: 611, nome: "Fraxure", level: 25 },
      { speciesId: 999, nome: "Gimmighoul", level: 25 },
      { speciesId: 825, nome: "Dottler", level: 52 }
    ]
  },

  {
    id: "brendan-e",
    nome: "Brendan-e",
    imagem: "/images/trainers/brendan-e.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 2111,
    stardust: 3379,
    xp: 331,
    ia: "aleatoria",
    time: [
      { speciesId: 774, nome: "Minior-red-meteor", level: 66 },
      { speciesId: 909, nome: "Fuecoco", level: 49 },
      { speciesId: 927, nome: "Dachsbun", level: 76 },
      { speciesId: 745, nome: "Lycanroc-midday", level: 13 },
      { speciesId: 87, nome: "Dewgong", level: 61 },
      { speciesId: 16, nome: "Pidgey", level: 15 }
    ]
  },

  {
    id: "brendan-gen3",
    nome: "Brendan-gen3",
    imagem: "/images/trainers/brendan-gen3.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 2958,
    stardust: 5178,
    xp: 300,
    ia: "estrategica",
    time: [
      { speciesId: 227, nome: "Skarmory", level: 64 },
      { speciesId: 912, nome: "Quaxly", level: 47 },
      { speciesId: 583, nome: "Vanillish", level: 37 },
      { speciesId: 37, nome: "Vulpix", level: 29 },
      { speciesId: 266, nome: "Silcoon", level: 29 },
      { speciesId: 586, nome: "Sawsbuck", level: 44 }
    ]
  },

  {
    id: "brendan-gen3rs",
    nome: "Brendan-gen3rs",
    imagem: "/images/trainers/brendan-gen3rs.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 657,
    stardust: 2949,
    xp: 52,
    ia: "aleatoria",
    time: [
      { speciesId: 934, nome: "Garganacl", level: 15 },
      { speciesId: 588, nome: "Karrablast", level: 10 },
      { speciesId: 700, nome: "Sylveon", level: 45 },
      { speciesId: 269, nome: "Dustox", level: 17 },
      { speciesId: 693, nome: "Clawitzer", level: 60 },
      { speciesId: 752, nome: "Araquanid", level: 64 }
    ]
  },

  {
    id: "brendan-masters",
    nome: "Brendan-masters",
    imagem: "/images/trainers/brendan-masters.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 315,
    stardust: 1470,
    xp: 148,
    ia: "aleatoria",
    time: [
      { speciesId: 843, nome: "Silicobra", level: 29 },
      { speciesId: 684, nome: "Swirlix", level: 12 },
      { speciesId: 796, nome: "Xurkitree", level: 70 },
      { speciesId: 146, nome: "Moltres", level: 80 },
      { speciesId: 41, nome: "Zubat", level: 47 },
      { speciesId: 448, nome: "Lucario", level: 27 }
    ]
  },

  {
    id: "brendan-masters2",
    nome: "Brendan-masters2",
    imagem: "/images/trainers/brendan-masters2.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 874,
    stardust: 2989,
    xp: 384,
    ia: "aleatoria",
    time: [
      { speciesId: 450, nome: "Hippowdon", level: 26 },
      { speciesId: 706, nome: "Goodra", level: 69 },
      { speciesId: 232, nome: "Donphan", level: 19 },
      { speciesId: 547, nome: "Whimsicott", level: 57 },
      { speciesId: 744, nome: "Rockruff", level: 21 },
      { speciesId: 448, nome: "Lucario", level: 56 }
    ]
  },

  {
    id: "brendan-rs",
    nome: "Brendan-rs",
    imagem: "/images/trainers/brendan-rs.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 1635,
    stardust: 376,
    xp: 132,
    ia: "estrategica",
    time: [
      { speciesId: 71, nome: "Victreebel", level: 34 },
      { speciesId: 373, nome: "Salamence", level: 75 },
      { speciesId: 273, nome: "Seedot", level: 58 },
      { speciesId: 822, nome: "Corvisquire", level: 36 },
      { speciesId: 350, nome: "Milotic", level: 67 },
      { speciesId: 828, nome: "Thievul", level: 64 }
    ]
  },

  {
    id: "brendan",
    nome: "Brendan",
    imagem: "/images/trainers/brendan.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 2957,
    stardust: 3479,
    xp: 394,
    ia: "agressiva",
    time: [
      { speciesId: 295, nome: "Exploud", level: 52 },
      { speciesId: 897, nome: "Spectrier", level: 35 },
      { speciesId: 264, nome: "Linoone", level: 66 },
      { speciesId: 448, nome: "Lucario", level: 69 },
      { speciesId: 105, nome: "Marowak", level: 23 },
      { speciesId: 980, nome: "Clodsire", level: 18 }
    ]
  },

  {
    id: "briar",
    nome: "Briar",
    imagem: "/images/trainers/briar.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 2226,
    stardust: 4595,
    xp: 208,
    ia: "agressiva",
    time: [
      { speciesId: 983, nome: "Kingambit", level: 75 },
      { speciesId: 382, nome: "Kyogre", level: 51 },
      { speciesId: 386, nome: "Deoxys-normal", level: 53 },
      { speciesId: 1006, nome: "Iron-valiant", level: 14 },
      { speciesId: 968, nome: "Orthworm", level: 14 },
      { speciesId: 633, nome: "Deino", level: 36 }
    ]
  },

  {
    id: "brigette",
    nome: "Brigette",
    imagem: "/images/trainers/brigette.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 514,
    stardust: 1856,
    xp: 170,
    ia: "aleatoria",
    time: [
      { speciesId: 757, nome: "Salandit", level: 55 },
      { speciesId: 898, nome: "Calyrex", level: 26 },
      { speciesId: 10, nome: "Caterpie", level: 21 },
      { speciesId: 447, nome: "Riolu", level: 36 },
      { speciesId: 798, nome: "Kartana", level: 16 },
      { speciesId: 96, nome: "Drowzee", level: 55 }
    ]
  },

  {
    id: "brock-gen1",
    nome: "Brock-gen1",
    imagem: "/images/trainers/brock-gen1.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 143,
    stardust: 1226,
    xp: 355,
    ia: "agressiva",
    time: [
      { speciesId: 306, nome: "Aggron", level: 41 },
      { speciesId: 268, nome: "Cascoon", level: 43 },
      { speciesId: 266, nome: "Silcoon", level: 37 },
      { speciesId: 872, nome: "Snom", level: 68 },
      { speciesId: 721, nome: "Volcanion", level: 43 },
      { speciesId: 566, nome: "Archen", level: 78 }
    ]
  },

  {
    id: "brock-gen1rb",
    nome: "Brock-gen1rb",
    imagem: "/images/trainers/brock-gen1rb.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 1289,
    stardust: 4202,
    xp: 81,
    ia: "estrategica",
    time: [
      { speciesId: 924, nome: "Tandemaus", level: 41 },
      { speciesId: 855, nome: "Polteageist", level: 44 },
      { speciesId: 399, nome: "Bidoof", level: 54 },
      { speciesId: 685, nome: "Slurpuff", level: 67 },
      { speciesId: 91, nome: "Cloyster", level: 78 },
      { speciesId: 74, nome: "Geodude", level: 66 }
    ]
  },

  {
    id: "brock-gen2",
    nome: "Brock-gen2",
    imagem: "/images/trainers/brock-gen2.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 2425,
    stardust: 3136,
    xp: 179,
    ia: "agressiva",
    time: [
      { speciesId: 932, nome: "Nacli", level: 17 },
      { speciesId: 375, nome: "Metang", level: 37 },
      { speciesId: 794, nome: "Buzzwole", level: 37 },
      { speciesId: 562, nome: "Yamask", level: 27 },
      { speciesId: 264, nome: "Linoone", level: 45 },
      { speciesId: 791, nome: "Solgaleo", level: 51 }
    ]
  },

  {
    id: "brock-gen3",
    nome: "Brock-gen3",
    imagem: "/images/trainers/brock-gen3.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 893,
    stardust: 4173,
    xp: 393,
    ia: "aleatoria",
    time: [
      { speciesId: 861, nome: "Grimmsnarl", level: 62 },
      { speciesId: 761, nome: "Bounsweet", level: 17 },
      { speciesId: 923, nome: "Pawmot", level: 29 },
      { speciesId: 293, nome: "Whismur", level: 57 },
      { speciesId: 1019, nome: "Hydrapple", level: 24 },
      { speciesId: 310, nome: "Manectric", level: 71 }
    ]
  },

  {
    id: "brock-lgpe",
    nome: "Brock-lgpe",
    imagem: "/images/trainers/brock-lgpe.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 449,
    stardust: 901,
    xp: 335,
    ia: "aleatoria",
    time: [
      { speciesId: 486, nome: "Regigigas", level: 30 },
      { speciesId: 753, nome: "Fomantis", level: 31 },
      { speciesId: 503, nome: "Samurott", level: 47 },
      { speciesId: 775, nome: "Komala", level: 64 },
      { speciesId: 767, nome: "Wimpod", level: 63 },
      { speciesId: 21, nome: "Spearow", level: 29 }
    ]
  },

  {
    id: "brock-masters",
    nome: "Brock-masters",
    imagem: "/images/trainers/brock-masters.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 830,
    stardust: 1088,
    xp: 264,
    ia: "aleatoria",
    time: [
      { speciesId: 865, nome: "Sirfetchd", level: 59 },
      { speciesId: 755, nome: "Morelull", level: 73 },
      { speciesId: 141, nome: "Kabutops", level: 50 },
      { speciesId: 543, nome: "Venipede", level: 43 },
      { speciesId: 665, nome: "Spewpa", level: 30 },
      { speciesId: 459, nome: "Snover", level: 77 }
    ]
  },

  {
    id: "brock",
    nome: "Brock",
    imagem: "/images/trainers/brock.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 993,
    stardust: 3603,
    xp: 282,
    ia: "defensiva",
    time: [
      { speciesId: 993, nome: "Iron-jugulis", level: 44 },
      { speciesId: 314, nome: "Illumise", level: 12 },
      { speciesId: 635, nome: "Hydreigon", level: 58 },
      { speciesId: 389, nome: "Torterra", level: 53 },
      { speciesId: 935, nome: "Charcadet", level: 79 },
      { speciesId: 287, nome: "Slakoth", level: 50 }
    ]
  },

  {
    id: "bruno-gen1",
    nome: "Bruno-gen1",
    imagem: "/images/trainers/bruno-gen1.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 2184,
    stardust: 5086,
    xp: 276,
    ia: "estrategica",
    time: [
      { speciesId: 665, nome: "Spewpa", level: 57 },
      { speciesId: 455, nome: "Carnivine", level: 68 },
      { speciesId: 196, nome: "Espeon", level: 47 },
      { speciesId: 404, nome: "Luxio", level: 19 },
      { speciesId: 765, nome: "Oranguru", level: 35 },
      { speciesId: 184, nome: "Azumarill", level: 74 }
    ]
  },

  {
    id: "bruno-gen1rb",
    nome: "Bruno-gen1rb",
    imagem: "/images/trainers/bruno-gen1rb.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 2426,
    stardust: 2752,
    xp: 147,
    ia: "estrategica",
    time: [
      { speciesId: 759, nome: "Stufful", level: 50 },
      { speciesId: 776, nome: "Turtonator", level: 25 },
      { speciesId: 376, nome: "Metagross", level: 57 },
      { speciesId: 217, nome: "Ursaring", level: 16 },
      { speciesId: 284, nome: "Masquerain", level: 29 },
      { speciesId: 827, nome: "Nickit", level: 29 }
    ]
  },

  {
    id: "bruno-gen2",
    nome: "Bruno-gen2",
    imagem: "/images/trainers/bruno-gen2.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 1018,
    stardust: 3176,
    xp: 224,
    ia: "aleatoria",
    time: [
      { speciesId: 843, nome: "Silicobra", level: 70 },
      { speciesId: 664, nome: "Scatterbug", level: 64 },
      { speciesId: 322, nome: "Numel", level: 74 },
      { speciesId: 119, nome: "Seaking", level: 62 },
      { speciesId: 473, nome: "Mamoswine", level: 52 },
      { speciesId: 122, nome: "Mr-mime", level: 16 }
    ]
  },

  {
    id: "bruno-gen3",
    nome: "Bruno-gen3",
    imagem: "/images/trainers/bruno-gen3.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 1725,
    stardust: 2646,
    xp: 252,
    ia: "agressiva",
    time: [
      { speciesId: 219, nome: "Magcargo", level: 62 },
      { speciesId: 858, nome: "Hatterene", level: 28 },
      { speciesId: 614, nome: "Beartic", level: 25 },
      { speciesId: 414, nome: "Mothim", level: 77 },
      { speciesId: 599, nome: "Klink", level: 73 },
      { speciesId: 958, nome: "Tinkatuff", level: 44 }
    ]
  },

  {
    id: "bruno",
    nome: "Bruno",
    imagem: "/images/trainers/bruno.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 2701,
    stardust: 304,
    xp: 280,
    ia: "estrategica",
    time: [
      { speciesId: 349, nome: "Feebas", level: 49 },
      { speciesId: 546, nome: "Cottonee", level: 69 },
      { speciesId: 618, nome: "Stunfisk", level: 16 },
      { speciesId: 306, nome: "Aggron", level: 72 },
      { speciesId: 628, nome: "Braviary", level: 35 },
      { speciesId: 370, nome: "Luvdisc", level: 78 }
    ]
  },

  {
    id: "brycen",
    nome: "Brycen",
    imagem: "/images/trainers/brycen.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 654,
    stardust: 4359,
    xp: 274,
    ia: "defensiva",
    time: [
      { speciesId: 757, nome: "Salandit", level: 80 },
      { speciesId: 147, nome: "Dratini", level: 32 },
      { speciesId: 961, nome: "Wugtrio", level: 50 },
      { speciesId: 939, nome: "Bellibolt", level: 51 },
      { speciesId: 1024, nome: "Terapagos", level: 39 },
      { speciesId: 246, nome: "Larvitar", level: 53 }
    ]
  },

  {
    id: "brycenman",
    nome: "Brycenman",
    imagem: "/images/trainers/brycenman.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 728,
    stardust: 4870,
    xp: 349,
    ia: "defensiva",
    time: [
      { speciesId: 400, nome: "Bibarel", level: 70 },
      { speciesId: 437, nome: "Bronzong", level: 39 },
      { speciesId: 390, nome: "Chimchar", level: 34 },
      { speciesId: 216, nome: "Teddiursa", level: 50 },
      { speciesId: 776, nome: "Turtonator", level: 51 },
      { speciesId: 996, nome: "Frigibax", level: 60 }
    ]
  },

  {
    id: "bryony",
    nome: "Bryony",
    imagem: "/images/trainers/bryony.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 2779,
    stardust: 266,
    xp: 98,
    ia: "aleatoria",
    time: [
      { speciesId: 287, nome: "Slakoth", level: 49 },
      { speciesId: 463, nome: "Lickilicky", level: 48 },
      { speciesId: 667, nome: "Litleo", level: 18 },
      { speciesId: 633, nome: "Deino", level: 76 },
      { speciesId: 731, nome: "Pikipek", level: 58 },
      { speciesId: 726, nome: "Torracat", level: 11 }
    ]
  },

  {
    id: "buck",
    nome: "Buck",
    imagem: "/images/trainers/buck.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 1377,
    stardust: 496,
    xp: 251,
    ia: "agressiva",
    time: [
      { speciesId: 326, nome: "Grumpig", level: 44 },
      { speciesId: 578, nome: "Duosion", level: 67 },
      { speciesId: 971, nome: "Greavard", level: 70 },
      { speciesId: 538, nome: "Throh", level: 43 },
      { speciesId: 276, nome: "Taillow", level: 29 },
      { speciesId: 872, nome: "Snom", level: 74 }
    ]
  },

  {
    id: "bugcatcher-gen1",
    nome: "Bugcatcher-gen1",
    imagem: "/images/trainers/bugcatcher-gen1.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 1255,
    stardust: 1244,
    xp: 315,
    ia: "agressiva",
    time: [
      { speciesId: 999, nome: "Gimmighoul", level: 35 },
      { speciesId: 511, nome: "Pansage", level: 27 },
      { speciesId: 994, nome: "Iron-moth", level: 74 },
      { speciesId: 130, nome: "Gyarados", level: 71 },
      { speciesId: 14, nome: "Kakuna", level: 57 },
      { speciesId: 241, nome: "Miltank", level: 27 }
    ]
  },

  {
    id: "bugcatcher-gen1rb",
    nome: "Bugcatcher-gen1rb",
    imagem: "/images/trainers/bugcatcher-gen1rb.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 1003,
    stardust: 2375,
    xp: 317,
    ia: "estrategica",
    time: [
      { speciesId: 435, nome: "Skuntank", level: 24 },
      { speciesId: 784, nome: "Kommo-o", level: 77 },
      { speciesId: 840, nome: "Applin", level: 36 },
      { speciesId: 503, nome: "Samurott", level: 53 },
      { speciesId: 888, nome: "Zacian", level: 75 },
      { speciesId: 414, nome: "Mothim", level: 66 }
    ]
  },

  {
    id: "bugcatcher-gen2",
    nome: "Bugcatcher-gen2",
    imagem: "/images/trainers/bugcatcher-gen2.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 1138,
    stardust: 5144,
    xp: 353,
    ia: "defensiva",
    time: [
      { speciesId: 342, nome: "Crawdaunt", level: 54 },
      { speciesId: 851, nome: "Centiskorch", level: 30 },
      { speciesId: 29, nome: "Nidoran-f", level: 32 },
      { speciesId: 455, nome: "Carnivine", level: 19 },
      { speciesId: 388, nome: "Grotle", level: 61 },
      { speciesId: 402, nome: "Kricketune", level: 74 }
    ]
  },

  {
    id: "bugcatcher-gen3",
    nome: "Bugcatcher-gen3",
    imagem: "/images/trainers/bugcatcher-gen3.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "dificil",
    recompensa: 1553,
    stardust: 5136,
    xp: 306,
    ia: "aleatoria",
    time: [
      { speciesId: 877, nome: "Morpeko-full-belly", level: 23 },
      { speciesId: 634, nome: "Zweilous", level: 73 },
      { speciesId: 327, nome: "Spinda", level: 34 },
      { speciesId: 201, nome: "Unown", level: 62 },
      { speciesId: 671, nome: "Florges", level: 10 },
      { speciesId: 576, nome: "Gothitelle", level: 56 }
    ]
  },

  {
    id: "bugcatcher-gen3rs",
    nome: "Bugcatcher-gen3rs",
    imagem: "/images/trainers/bugcatcher-gen3rs.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 2186,
    stardust: 2184,
    xp: 430,
    ia: "estrategica",
    time: [
      { speciesId: 426, nome: "Drifblim", level: 41 },
      { speciesId: 244, nome: "Entei", level: 58 },
      { speciesId: 368, nome: "Gorebyss", level: 75 },
      { speciesId: 835, nome: "Yamper", level: 32 },
      { speciesId: 879, nome: "Copperajah", level: 29 },
      { speciesId: 331, nome: "Cacnea", level: 25 }
    ]
  },

  {
    id: "bugcatcher-gen4dp",
    nome: "Bugcatcher-gen4dp",
    imagem: "/images/trainers/bugcatcher-gen4dp.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 2403,
    stardust: 5054,
    xp: 286,
    ia: "defensiva",
    time: [
      { speciesId: 977, nome: "Dondozo", level: 17 },
      { speciesId: 189, nome: "Jumpluff", level: 35 },
      { speciesId: 409, nome: "Rampardos", level: 79 },
      { speciesId: 888, nome: "Zacian", level: 67 },
      { speciesId: 555, nome: "Darmanitan-standard", level: 58 },
      { speciesId: 954, nome: "Rabsca", level: 55 }
    ]
  },

  {
    id: "bugcatcher-gen6",
    nome: "Bugcatcher-gen6",
    imagem: "/images/trainers/bugcatcher-gen6.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 1400,
    stardust: 3027,
    xp: 52,
    ia: "agressiva",
    time: [
      { speciesId: 244, nome: "Entei", level: 58 },
      { speciesId: 696, nome: "Tyrunt", level: 15 },
      { speciesId: 657, nome: "Frogadier", level: 44 },
      { speciesId: 757, nome: "Salandit", level: 57 },
      { speciesId: 71, nome: "Victreebel", level: 42 },
      { speciesId: 37, nome: "Vulpix", level: 24 }
    ]
  },

  {
    id: "bugcatcher",
    nome: "Bugcatcher",
    imagem: "/images/trainers/bugcatcher.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 690,
    stardust: 4069,
    xp: 325,
    ia: "aleatoria",
    time: [
      { speciesId: 938, nome: "Tadbulb", level: 15 },
      { speciesId: 845, nome: "Cramorant", level: 67 },
      { speciesId: 725, nome: "Litten", level: 75 },
      { speciesId: 670, nome: "Floette", level: 32 },
      { speciesId: 423, nome: "Gastrodon", level: 71 },
      { speciesId: 436, nome: "Bronzor", level: 57 }
    ]
  },

  {
    id: "bugmaniac-gen3",
    nome: "Bugmaniac-gen3",
    imagem: "/images/trainers/bugmaniac-gen3.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 1219,
    stardust: 740,
    xp: 62,
    ia: "defensiva",
    time: [
      { speciesId: 952, nome: "Scovillain", level: 30 },
      { speciesId: 683, nome: "Aromatisse", level: 75 },
      { speciesId: 738, nome: "Vikavolt", level: 16 },
      { speciesId: 14, nome: "Kakuna", level: 38 },
      { speciesId: 772, nome: "Type-null", level: 80 },
      { speciesId: 955, nome: "Flittle", level: 61 }
    ]
  },

  {
    id: "bugmaniac-gen6",
    nome: "Bugmaniac-gen6",
    imagem: "/images/trainers/bugmaniac-gen6.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 2342,
    stardust: 2977,
    xp: 55,
    ia: "estrategica",
    time: [
      { speciesId: 298, nome: "Azurill", level: 55 },
      { speciesId: 612, nome: "Haxorus", level: 15 },
      { speciesId: 315, nome: "Roselia", level: 61 },
      { speciesId: 292, nome: "Shedinja", level: 80 },
      { speciesId: 126, nome: "Magmar", level: 62 },
      { speciesId: 779, nome: "Bruxish", level: 46 }
    ]
  },

  {
    id: "bugsy-gen2",
    nome: "Bugsy-gen2",
    imagem: "/images/trainers/bugsy-gen2.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 349,
    stardust: 4588,
    xp: 256,
    ia: "estrategica",
    time: [
      { speciesId: 872, nome: "Snom", level: 64 },
      { speciesId: 608, nome: "Lampent", level: 14 },
      { speciesId: 602, nome: "Tynamo", level: 51 },
      { speciesId: 450, nome: "Hippowdon", level: 50 },
      { speciesId: 888, nome: "Zacian", level: 59 },
      { speciesId: 413, nome: "Wormadam-plant", level: 72 }
    ]
  },

  {
    id: "bugsy-masters",
    nome: "Bugsy-masters",
    imagem: "/images/trainers/bugsy-masters.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 324,
    stardust: 2977,
    xp: 304,
    ia: "defensiva",
    time: [
      { speciesId: 324, nome: "Torkoal", level: 35 },
      { speciesId: 184, nome: "Azumarill", level: 15 },
      { speciesId: 55, nome: "Golduck", level: 56 },
      { speciesId: 34, nome: "Nidoking", level: 64 },
      { speciesId: 847, nome: "Barraskewda", level: 49 },
      { speciesId: 657, nome: "Frogadier", level: 46 }
    ]
  },

  {
    id: "bugsy",
    nome: "Bugsy",
    imagem: "/images/trainers/bugsy.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 1956,
    stardust: 1088,
    xp: 263,
    ia: "agressiva",
    time: [
      { speciesId: 624, nome: "Pawniard", level: 80 },
      { speciesId: 683, nome: "Aromatisse", level: 66 },
      { speciesId: 519, nome: "Pidove", level: 74 },
      { speciesId: 873, nome: "Frosmoth", level: 29 },
      { speciesId: 717, nome: "Yveltal", level: 49 },
      { speciesId: 332, nome: "Cacturne", level: 53 }
    ]
  },

  {
    id: "burgh-masters",
    nome: "Burgh-masters",
    imagem: "/images/trainers/burgh-masters.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 1744,
    stardust: 4716,
    xp: 479,
    ia: "defensiva",
    time: [
      { speciesId: 243, nome: "Raikou", level: 62 },
      { speciesId: 538, nome: "Throh", level: 18 },
      { speciesId: 369, nome: "Relicanth", level: 27 },
      { speciesId: 85, nome: "Dodrio", level: 25 },
      { speciesId: 540, nome: "Sewaddle", level: 25 },
      { speciesId: 134, nome: "Vaporeon", level: 59 }
    ]
  },

  {
    id: "burgh",
    nome: "Burgh",
    imagem: "/images/trainers/burgh.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 1257,
    stardust: 4007,
    xp: 412,
    ia: "aleatoria",
    time: [
      { speciesId: 844, nome: "Sandaconda", level: 37 },
      { speciesId: 186, nome: "Politoed", level: 75 },
      { speciesId: 953, nome: "Rellor", level: 23 },
      { speciesId: 453, nome: "Croagunk", level: 38 },
      { speciesId: 979, nome: "Annihilape", level: 14 },
      { speciesId: 741, nome: "Oricorio-baile", level: 75 }
    ]
  },

  {
    id: "burglar-gen1",
    nome: "Burglar-gen1",
    imagem: "/images/trainers/burglar-gen1.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 2892,
    stardust: 1851,
    xp: 447,
    ia: "aleatoria",
    time: [
      { speciesId: 544, nome: "Whirlipede", level: 17 },
      { speciesId: 846, nome: "Arrokuda", level: 79 },
      { speciesId: 754, nome: "Lurantis", level: 53 },
      { speciesId: 935, nome: "Charcadet", level: 67 },
      { speciesId: 611, nome: "Fraxure", level: 79 },
      { speciesId: 504, nome: "Patrat", level: 33 }
    ]
  },

  {
    id: "burglar-gen1rb",
    nome: "Burglar-gen1rb",
    imagem: "/images/trainers/burglar-gen1rb.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 2606,
    stardust: 1034,
    xp: 233,
    ia: "aleatoria",
    time: [
      { speciesId: 113, nome: "Chansey", level: 47 },
      { speciesId: 335, nome: "Zangoose", level: 12 },
      { speciesId: 40, nome: "Wigglytuff", level: 34 },
      { speciesId: 440, nome: "Happiny", level: 74 },
      { speciesId: 145, nome: "Zapdos", level: 12 },
      { speciesId: 117, nome: "Seadra", level: 26 }
    ]
  },

  {
    id: "burglar-gen2",
    nome: "Burglar-gen2",
    imagem: "/images/trainers/burglar-gen2.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "dificil",
    recompensa: 2427,
    stardust: 2986,
    xp: 408,
    ia: "estrategica",
    time: [
      { speciesId: 428, nome: "Lopunny", level: 25 },
      { speciesId: 485, nome: "Heatran", level: 20 },
      { speciesId: 65, nome: "Alakazam", level: 76 },
      { speciesId: 657, nome: "Frogadier", level: 13 },
      { speciesId: 55, nome: "Golduck", level: 78 },
      { speciesId: 394, nome: "Prinplup", level: 54 }
    ]
  },

  {
    id: "burglar-gen3",
    nome: "Burglar-gen3",
    imagem: "/images/trainers/burglar-gen3.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 2820,
    stardust: 2594,
    xp: 348,
    ia: "estrategica",
    time: [
      { speciesId: 19, nome: "Rattata", level: 58 },
      { speciesId: 832, nome: "Dubwool", level: 80 },
      { speciesId: 56, nome: "Mankey", level: 39 },
      { speciesId: 170, nome: "Chinchou", level: 46 },
      { speciesId: 321, nome: "Wailord", level: 60 },
      { speciesId: 1008, nome: "Miraidon", level: 24 }
    ]
  },

  {
    id: "burglar-lgpe",
    nome: "Burglar-lgpe",
    imagem: "/images/trainers/burglar-lgpe.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 873,
    stardust: 4191,
    xp: 230,
    ia: "defensiva",
    time: [
      { speciesId: 450, nome: "Hippowdon", level: 57 },
      { speciesId: 448, nome: "Lucario", level: 50 },
      { speciesId: 512, nome: "Simisage", level: 20 },
      { speciesId: 990, nome: "Iron-treads", level: 32 },
      { speciesId: 970, nome: "Glimmora", level: 77 },
      { speciesId: 162, nome: "Furret", level: 51 }
    ]
  },

  {
    id: "burglar",
    nome: "Burglar",
    imagem: "/images/trainers/burglar.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 1436,
    stardust: 985,
    xp: 376,
    ia: "defensiva",
    time: [
      { speciesId: 90, nome: "Shellder", level: 63 },
      { speciesId: 130, nome: "Gyarados", level: 73 },
      { speciesId: 529, nome: "Drilbur", level: 47 },
      { speciesId: 547, nome: "Whimsicott", level: 19 },
      { speciesId: 898, nome: "Calyrex", level: 44 },
      { speciesId: 682, nome: "Spritzee", level: 69 }
    ]
  },

  {
    id: "burnet-radar",
    nome: "Burnet-radar",
    imagem: "/images/trainers/burnet-radar.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 2155,
    stardust: 4347,
    xp: 288,
    ia: "defensiva",
    time: [
      { speciesId: 617, nome: "Accelgor", level: 64 },
      { speciesId: 693, nome: "Clawitzer", level: 70 },
      { speciesId: 207, nome: "Gligar", level: 28 },
      { speciesId: 449, nome: "Hippopotas", level: 10 },
      { speciesId: 455, nome: "Carnivine", level: 61 },
      { speciesId: 208, nome: "Steelix", level: 16 }
    ]
  },

  {
    id: "burnet",
    nome: "Burnet",
    imagem: "/images/trainers/burnet.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 863,
    stardust: 316,
    xp: 276,
    ia: "defensiva",
    time: [
      { speciesId: 1008, nome: "Miraidon", level: 47 },
      { speciesId: 231, nome: "Phanpy", level: 47 },
      { speciesId: 570, nome: "Zorua", level: 11 },
      { speciesId: 720, nome: "Hoopa", level: 32 },
      { speciesId: 52, nome: "Meowth", level: 38 },
      { speciesId: 65, nome: "Alakazam", level: 14 }
    ]
  },

  {
    id: "butler",
    nome: "Butler",
    imagem: "/images/trainers/butler.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 1468,
    stardust: 4277,
    xp: 115,
    ia: "defensiva",
    time: [
      { speciesId: 937, nome: "Ceruledge", level: 73 },
      { speciesId: 459, nome: "Snover", level: 27 },
      { speciesId: 426, nome: "Drifblim", level: 55 },
      { speciesId: 405, nome: "Luxray", level: 43 },
      { speciesId: 494, nome: "Victini", level: 67 },
      { speciesId: 286, nome: "Breloom", level: 56 }
    ]
  },

  {
    id: "byron",
    nome: "Byron",
    imagem: "/images/trainers/byron.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 1390,
    stardust: 5101,
    xp: 117,
    ia: "defensiva",
    time: [
      { speciesId: 475, nome: "Gallade", level: 28 },
      { speciesId: 189, nome: "Jumpluff", level: 33 },
      { speciesId: 120, nome: "Staryu", level: 48 },
      { speciesId: 43, nome: "Oddish", level: 62 },
      { speciesId: 803, nome: "Poipole", level: 77 },
      { speciesId: 523, nome: "Zebstrika", level: 75 }
    ]
  },

  {
    id: "cabbie-gen9",
    nome: "Cabbie-gen9",
    imagem: "/images/trainers/cabbie-gen9.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 1363,
    stardust: 3425,
    xp: 153,
    ia: "aleatoria",
    time: [
      { speciesId: 402, nome: "Kricketune", level: 52 },
      { speciesId: 950, nome: "Klawf", level: 53 },
      { speciesId: 67, nome: "Machoke", level: 15 },
      { speciesId: 330, nome: "Flygon", level: 35 },
      { speciesId: 447, nome: "Riolu", level: 53 },
      { speciesId: 76, nome: "Golem", level: 47 }
    ]
  },

  {
    id: "cabbie",
    nome: "Cabbie",
    imagem: "/images/trainers/cabbie.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 247,
    stardust: 2610,
    xp: 132,
    ia: "agressiva",
    time: [
      { speciesId: 538, nome: "Throh", level: 43 },
      { speciesId: 240, nome: "Magby", level: 30 },
      { speciesId: 587, nome: "Emolga", level: 59 },
      { speciesId: 608, nome: "Lampent", level: 72 },
      { speciesId: 586, nome: "Sawsbuck", level: 58 },
      { speciesId: 279, nome: "Pelipper", level: 34 }
    ]
  },

  {
    id: "cafemaster",
    nome: "Cafemaster",
    imagem: "/images/trainers/cafemaster.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 1182,
    stardust: 3830,
    xp: 393,
    ia: "aleatoria",
    time: [
      { speciesId: 334, nome: "Altaria", level: 51 },
      { speciesId: 130, nome: "Gyarados", level: 69 },
      { speciesId: 792, nome: "Lunala", level: 22 },
      { speciesId: 378, nome: "Regice", level: 54 },
      { speciesId: 968, nome: "Orthworm", level: 55 },
      { speciesId: 594, nome: "Alomomola", level: 67 }
    ]
  },

  {
    id: "caitlin-gen4",
    nome: "Caitlin-gen4",
    imagem: "/images/trainers/caitlin-gen4.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 1768,
    stardust: 1560,
    xp: 312,
    ia: "estrategica",
    time: [
      { speciesId: 342, nome: "Crawdaunt", level: 65 },
      { speciesId: 790, nome: "Cosmoem", level: 50 },
      { speciesId: 181, nome: "Ampharos", level: 69 },
      { speciesId: 1023, nome: "Iron-crown", level: 71 },
      { speciesId: 878, nome: "Cufant", level: 73 },
      { speciesId: 626, nome: "Bouffalant", level: 36 }
    ]
  },

  {
    id: "caitlin-masters",
    nome: "Caitlin-masters",
    imagem: "/images/trainers/caitlin-masters.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 224,
    stardust: 1704,
    xp: 483,
    ia: "agressiva",
    time: [
      { speciesId: 453, nome: "Croagunk", level: 14 },
      { speciesId: 828, nome: "Thievul", level: 56 },
      { speciesId: 647, nome: "Keldeo-ordinary", level: 73 },
      { speciesId: 440, nome: "Happiny", level: 24 },
      { speciesId: 140, nome: "Kabuto", level: 70 },
      { speciesId: 539, nome: "Sawk", level: 34 }
    ]
  },

  {
    id: "caitlin",
    nome: "Caitlin",
    imagem: "/images/trainers/caitlin.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 1253,
    stardust: 1483,
    xp: 267,
    ia: "aleatoria",
    time: [
      { speciesId: 278, nome: "Wingull", level: 61 },
      { speciesId: 893, nome: "Zarude", level: 23 },
      { speciesId: 473, nome: "Mamoswine", level: 34 },
      { speciesId: 980, nome: "Clodsire", level: 35 },
      { speciesId: 9, nome: "Blastoise", level: 45 },
      { speciesId: 718, nome: "Zygarde-50", level: 76 }
    ]
  },

  {
    id: "calaba",
    nome: "Calaba",
    imagem: "/images/trainers/calaba.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 1713,
    stardust: 1219,
    xp: 160,
    ia: "aleatoria",
    time: [
      { speciesId: 759, nome: "Stufful", level: 44 },
      { speciesId: 328, nome: "Trapinch", level: 52 },
      { speciesId: 540, nome: "Sewaddle", level: 77 },
      { speciesId: 488, nome: "Cresselia", level: 68 },
      { speciesId: 772, nome: "Type-null", level: 25 },
      { speciesId: 226, nome: "Mantine", level: 63 }
    ]
  },

  {
    id: "calem-masters",
    nome: "Calem-masters",
    imagem: "/images/trainers/calem-masters.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 1908,
    stardust: 1185,
    xp: 369,
    ia: "estrategica",
    time: [
      { speciesId: 366, nome: "Clamperl", level: 29 },
      { speciesId: 872, nome: "Snom", level: 39 },
      { speciesId: 456, nome: "Finneon", level: 53 },
      { speciesId: 287, nome: "Slakoth", level: 15 },
      { speciesId: 220, nome: "Swinub", level: 54 },
      { speciesId: 982, nome: "Dudunsparce-two-segment", level: 32 }
    ]
  },

  {
    id: "calem",
    nome: "Calem",
    imagem: "/images/trainers/calem.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 1927,
    stardust: 1186,
    xp: 334,
    ia: "defensiva",
    time: [
      { speciesId: 249, nome: "Lugia", level: 78 },
      { speciesId: 813, nome: "Scorbunny", level: 45 },
      { speciesId: 998, nome: "Baxcalibur", level: 31 },
      { speciesId: 233, nome: "Porygon2", level: 14 },
      { speciesId: 408, nome: "Cranidos", level: 32 },
      { speciesId: 570, nome: "Zorua", level: 22 }
    ]
  },

  {
    id: "cameraman-gen6",
    nome: "Cameraman-gen6",
    imagem: "/images/trainers/cameraman-gen6.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 1533,
    stardust: 898,
    xp: 448,
    ia: "agressiva",
    time: [
      { speciesId: 384, nome: "Rayquaza", level: 40 },
      { speciesId: 33, nome: "Nidorino", level: 74 },
      { speciesId: 699, nome: "Aurorus", level: 25 },
      { speciesId: 954, nome: "Rabsca", level: 72 },
      { speciesId: 387, nome: "Turtwig", level: 65 },
      { speciesId: 165, nome: "Ledyba", level: 37 }
    ]
  },

  {
    id: "cameraman-gen8",
    nome: "Cameraman-gen8",
    imagem: "/images/trainers/cameraman-gen8.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 1548,
    stardust: 1630,
    xp: 178,
    ia: "agressiva",
    time: [
      { speciesId: 141, nome: "Kabutops", level: 42 },
      { speciesId: 76, nome: "Golem", level: 30 },
      { speciesId: 656, nome: "Froakie", level: 16 },
      { speciesId: 938, nome: "Tadbulb", level: 36 },
      { speciesId: 357, nome: "Tropius", level: 59 },
      { speciesId: 570, nome: "Zorua", level: 67 }
    ]
  },

  {
    id: "cameraman",
    nome: "Cameraman",
    imagem: "/images/trainers/cameraman.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 845,
    stardust: 4111,
    xp: 247,
    ia: "defensiva",
    time: [
      { speciesId: 440, nome: "Happiny", level: 10 },
      { speciesId: 425, nome: "Drifloon", level: 32 },
      { speciesId: 611, nome: "Fraxure", level: 69 },
      { speciesId: 972, nome: "Houndstone", level: 14 },
      { speciesId: 729, nome: "Brionne", level: 38 },
      { speciesId: 875, nome: "Eiscue-ice", level: 66 }
    ]
  },

  {
    id: "camper-gen2",
    nome: "Camper-gen2",
    imagem: "/images/trainers/camper-gen2.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 2494,
    stardust: 4888,
    xp: 438,
    ia: "agressiva",
    time: [
      { speciesId: 422, nome: "Shellos", level: 23 },
      { speciesId: 216, nome: "Teddiursa", level: 43 },
      { speciesId: 389, nome: "Torterra", level: 54 },
      { speciesId: 390, nome: "Chimchar", level: 69 },
      { speciesId: 793, nome: "Nihilego", level: 23 },
      { speciesId: 160, nome: "Feraligatr", level: 21 }
    ]
  },

  {
    id: "camper-gen3",
    nome: "Camper-gen3",
    imagem: "/images/trainers/camper-gen3.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 2961,
    stardust: 1753,
    xp: 312,
    ia: "estrategica",
    time: [
      { speciesId: 436, nome: "Bronzor", level: 13 },
      { speciesId: 338, nome: "Solrock", level: 70 },
      { speciesId: 236, nome: "Tyrogue", level: 19 },
      { speciesId: 848, nome: "Toxel", level: 67 },
      { speciesId: 295, nome: "Exploud", level: 77 },
      { speciesId: 318, nome: "Carvanha", level: 33 }
    ]
  },

  {
    id: "camper-gen3rs",
    nome: "Camper-gen3rs",
    imagem: "/images/trainers/camper-gen3rs.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 1336,
    stardust: 4843,
    xp: 59,
    ia: "defensiva",
    time: [
      { speciesId: 697, nome: "Tyrantrum", level: 31 },
      { speciesId: 986, nome: "Brute-bonnet", level: 13 },
      { speciesId: 827, nome: "Nickit", level: 69 },
      { speciesId: 682, nome: "Spritzee", level: 15 },
      { speciesId: 6, nome: "Charizard", level: 11 },
      { speciesId: 824, nome: "Blipbug", level: 44 }
    ]
  },

  {
    id: "camper-gen6",
    nome: "Camper-gen6",
    imagem: "/images/trainers/camper-gen6.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 1092,
    stardust: 2058,
    xp: 425,
    ia: "agressiva",
    time: [
      { speciesId: 101, nome: "Electrode", level: 63 },
      { speciesId: 238, nome: "Smoochum", level: 15 },
      { speciesId: 495, nome: "Snivy", level: 14 },
      { speciesId: 997, nome: "Arctibax", level: 37 },
      { speciesId: 983, nome: "Kingambit", level: 60 },
      { speciesId: 382, nome: "Kyogre", level: 32 }
    ]
  },

  {
    id: "camper",
    nome: "Camper",
    imagem: "/images/trainers/camper.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "dificil",
    recompensa: 243,
    stardust: 2919,
    xp: 324,
    ia: "defensiva",
    time: [
      { speciesId: 934, nome: "Garganacl", level: 21 },
      { speciesId: 424, nome: "Ambipom", level: 71 },
      { speciesId: 764, nome: "Comfey", level: 61 },
      { speciesId: 293, nome: "Whismur", level: 14 },
      { speciesId: 151, nome: "Mew", level: 40 },
      { speciesId: 327, nome: "Spinda", level: 22 }
    ]
  },

  {
    id: "candela-casual",
    nome: "Candela-casual",
    imagem: "/images/trainers/candela-casual.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 1107,
    stardust: 5299,
    xp: 338,
    ia: "aleatoria",
    time: [
      { speciesId: 813, nome: "Scorbunny", level: 56 },
      { speciesId: 905, nome: "Enamorus-incarnate", level: 50 },
      { speciesId: 290, nome: "Nincada", level: 73 },
      { speciesId: 467, nome: "Magmortar", level: 30 },
      { speciesId: 902, nome: "Basculegion-male", level: 39 },
      { speciesId: 988, nome: "Slither-wing", level: 51 }
    ]
  },

  {
    id: "candela",
    nome: "Candela",
    imagem: "/images/trainers/candela.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 1069,
    stardust: 4765,
    xp: 107,
    ia: "estrategica",
    time: [
      { speciesId: 607, nome: "Litwick", level: 48 },
      { speciesId: 303, nome: "Mawile", level: 79 },
      { speciesId: 956, nome: "Espathra", level: 28 },
      { speciesId: 447, nome: "Riolu", level: 58 },
      { speciesId: 78, nome: "Rapidash", level: 33 },
      { speciesId: 320, nome: "Wailmer", level: 22 }
    ]
  },

  {
    id: "candice-masters",
    nome: "Candice-masters",
    imagem: "/images/trainers/candice-masters.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 1054,
    stardust: 4958,
    xp: 329,
    ia: "defensiva",
    time: [
      { speciesId: 177, nome: "Natu", level: 24 },
      { speciesId: 721, nome: "Volcanion", level: 51 },
      { speciesId: 510, nome: "Liepard", level: 16 },
      { speciesId: 383, nome: "Groudon", level: 35 },
      { speciesId: 752, nome: "Araquanid", level: 10 },
      { speciesId: 106, nome: "Hitmonlee", level: 67 }
    ]
  },

  {
    id: "candice",
    nome: "Candice",
    imagem: "/images/trainers/candice.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 2473,
    stardust: 3276,
    xp: 109,
    ia: "agressiva",
    time: [
      { speciesId: 908, nome: "Meowscarada", level: 40 },
      { speciesId: 358, nome: "Chimecho", level: 19 },
      { speciesId: 637, nome: "Volcarona", level: 64 },
      { speciesId: 918, nome: "Spidops", level: 73 },
      { speciesId: 199, nome: "Slowking", level: 71 },
      { speciesId: 155, nome: "Cyndaquil", level: 63 }
    ]
  },

  {
    id: "caraliss",
    nome: "Caraliss",
    imagem: "/images/trainers/caraliss.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 2123,
    stardust: 3606,
    xp: 132,
    ia: "aleatoria",
    time: [
      { speciesId: 768, nome: "Golisopod", level: 48 },
      { speciesId: 349, nome: "Feebas", level: 78 },
      { speciesId: 486, nome: "Regigigas", level: 40 },
      { speciesId: 515, nome: "Panpour", level: 43 },
      { speciesId: 214, nome: "Heracross", level: 34 },
      { speciesId: 687, nome: "Malamar", level: 11 }
    ]
  },

  {
    id: "caretaker",
    nome: "Caretaker",
    imagem: "/images/trainers/caretaker.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 1382,
    stardust: 3068,
    xp: 172,
    ia: "agressiva",
    time: [
      { speciesId: 985, nome: "Scream-tail", level: 67 },
      { speciesId: 240, nome: "Magby", level: 48 },
      { speciesId: 800, nome: "Necrozma", level: 64 },
      { speciesId: 422, nome: "Shellos", level: 53 },
      { speciesId: 481, nome: "Mesprit", level: 73 },
      { speciesId: 798, nome: "Kartana", level: 32 }
    ]
  },

  {
    id: "carmine-festival",
    nome: "Carmine-festival",
    imagem: "/images/trainers/carmine-festival.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 1630,
    stardust: 700,
    xp: 112,
    ia: "aleatoria",
    time: [
      { speciesId: 508, nome: "Stoutland", level: 25 },
      { speciesId: 1024, nome: "Terapagos", level: 23 },
      { speciesId: 363, nome: "Spheal", level: 31 },
      { speciesId: 482, nome: "Azelf", level: 72 },
      { speciesId: 37, nome: "Vulpix", level: 16 },
      { speciesId: 540, nome: "Sewaddle", level: 30 }
    ]
  },

  {
    id: "carmine",
    nome: "Carmine",
    imagem: "/images/trainers/carmine.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 1337,
    stardust: 825,
    xp: 392,
    ia: "defensiva",
    time: [
      { speciesId: 46, nome: "Paras", level: 37 },
      { speciesId: 165, nome: "Ledyba", level: 46 },
      { speciesId: 691, nome: "Dragalge", level: 13 },
      { speciesId: 18, nome: "Pidgeot", level: 70 },
      { speciesId: 671, nome: "Florges", level: 66 },
      { speciesId: 487, nome: "Giratina-altered", level: 75 }
    ]
  },

  {
    id: "cedricjuniper",
    nome: "Cedricjuniper",
    imagem: "/images/trainers/cedricjuniper.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 106,
    stardust: 396,
    xp: 453,
    ia: "estrategica",
    time: [
      { speciesId: 960, nome: "Wiglett", level: 55 },
      { speciesId: 313, nome: "Volbeat", level: 17 },
      { speciesId: 873, nome: "Frosmoth", level: 16 },
      { speciesId: 374, nome: "Beldum", level: 79 },
      { speciesId: 202, nome: "Wobbuffet", level: 60 },
      { speciesId: 213, nome: "Shuckle", level: 11 }
    ]
  },

  {
    id: "celio",
    nome: "Celio",
    imagem: "/images/trainers/celio.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 611,
    stardust: 3183,
    xp: 305,
    ia: "agressiva",
    time: [
      { speciesId: 218, nome: "Slugma", level: 62 },
      { speciesId: 28, nome: "Sandslash", level: 58 },
      { speciesId: 539, nome: "Sawk", level: 12 },
      { speciesId: 829, nome: "Gossifleur", level: 41 },
      { speciesId: 309, nome: "Electrike", level: 45 },
      { speciesId: 409, nome: "Rampardos", level: 42 }
    ]
  },

  {
    id: "channeler-gen1",
    nome: "Channeler-gen1",
    imagem: "/images/trainers/channeler-gen1.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 1262,
    stardust: 2422,
    xp: 182,
    ia: "agressiva",
    time: [
      { speciesId: 357, nome: "Tropius", level: 44 },
      { speciesId: 756, nome: "Shiinotic", level: 45 },
      { speciesId: 74, nome: "Geodude", level: 51 },
      { speciesId: 81, nome: "Magnemite", level: 77 },
      { speciesId: 9, nome: "Blastoise", level: 36 },
      { speciesId: 285, nome: "Shroomish", level: 60 }
    ]
  },

  {
    id: "channeler-gen1rb",
    nome: "Channeler-gen1rb",
    imagem: "/images/trainers/channeler-gen1rb.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 1716,
    stardust: 224,
    xp: 159,
    ia: "aleatoria",
    time: [
      { speciesId: 973, nome: "Flamigo", level: 53 },
      { speciesId: 663, nome: "Talonflame", level: 37 },
      { speciesId: 921, nome: "Pawmi", level: 34 },
      { speciesId: 74, nome: "Geodude", level: 30 },
      { speciesId: 144, nome: "Articuno", level: 59 },
      { speciesId: 80, nome: "Slowbro", level: 59 }
    ]
  },

  {
    id: "channeler-gen3",
    nome: "Channeler-gen3",
    imagem: "/images/trainers/channeler-gen3.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 1783,
    stardust: 4952,
    xp: 181,
    ia: "agressiva",
    time: [
      { speciesId: 126, nome: "Magmar", level: 54 },
      { speciesId: 785, nome: "Tapu-koko", level: 30 },
      { speciesId: 909, nome: "Fuecoco", level: 19 },
      { speciesId: 230, nome: "Kingdra", level: 74 },
      { speciesId: 487, nome: "Giratina-altered", level: 38 },
      { speciesId: 116, nome: "Horsea", level: 40 }
    ]
  },

  {
    id: "channeler-lgpe",
    nome: "Channeler-lgpe",
    imagem: "/images/trainers/channeler-lgpe.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 893,
    stardust: 651,
    xp: 124,
    ia: "aleatoria",
    time: [
      { speciesId: 906, nome: "Sprigatito", level: 33 },
      { speciesId: 429, nome: "Mismagius", level: 80 },
      { speciesId: 81, nome: "Magnemite", level: 49 },
      { speciesId: 773, nome: "Silvally", level: 17 },
      { speciesId: 419, nome: "Floatzel", level: 66 },
      { speciesId: 984, nome: "Great-tusk", level: 73 }
    ]
  },

  {
    id: "charm",
    nome: "Charm",
    imagem: "/images/trainers/charm.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 1364,
    stardust: 4190,
    xp: 234,
    ia: "aleatoria",
    time: [
      { speciesId: 974, nome: "Cetoddle", level: 40 },
      { speciesId: 456, nome: "Finneon", level: 58 },
      { speciesId: 17, nome: "Pidgeotto", level: 65 },
      { speciesId: 132, nome: "Ditto", level: 80 },
      { speciesId: 395, nome: "Empoleon", level: 42 },
      { speciesId: 259, nome: "Marshtomp", level: 10 }
    ]
  },

  {
    id: "charon",
    nome: "Charon",
    imagem: "/images/trainers/charon.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 148,
    stardust: 2763,
    xp: 395,
    ia: "agressiva",
    time: [
      { speciesId: 656, nome: "Froakie", level: 64 },
      { speciesId: 256, nome: "Combusken", level: 57 },
      { speciesId: 457, nome: "Lumineon", level: 29 },
      { speciesId: 465, nome: "Tangrowth", level: 32 },
      { speciesId: 574, nome: "Gothita", level: 37 },
      { speciesId: 798, nome: "Kartana", level: 43 }
    ]
  },

  {
    id: "chase",
    nome: "Chase",
    imagem: "/images/trainers/chase.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 216,
    stardust: 1675,
    xp: 465,
    ia: "defensiva",
    time: [
      { speciesId: 632, nome: "Durant", level: 69 },
      { speciesId: 750, nome: "Mudsdale", level: 31 },
      { speciesId: 439, nome: "Mime-jr", level: 65 },
      { speciesId: 991, nome: "Iron-bundle", level: 76 },
      { speciesId: 38, nome: "Ninetales", level: 74 },
      { speciesId: 325, nome: "Spoink", level: 40 }
    ]
  },

  {
    id: "chef",
    nome: "Chef",
    imagem: "/images/trainers/chef.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 667,
    stardust: 1306,
    xp: 88,
    ia: "agressiva",
    time: [
      { speciesId: 396, nome: "Starly", level: 23 },
      { speciesId: 402, nome: "Kricketune", level: 50 },
      { speciesId: 400, nome: "Bibarel", level: 56 },
      { speciesId: 489, nome: "Phione", level: 43 },
      { speciesId: 508, nome: "Stoutland", level: 52 },
      { speciesId: 769, nome: "Sandygast", level: 73 }
    ]
  },

  {
    id: "cheren-gen5bw2",
    nome: "Cheren-gen5bw2",
    imagem: "/images/trainers/cheren-gen5bw2.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 1712,
    stardust: 1698,
    xp: 380,
    ia: "agressiva",
    time: [
      { speciesId: 744, nome: "Rockruff", level: 77 },
      { speciesId: 198, nome: "Murkrow", level: 25 },
      { speciesId: 605, nome: "Elgyem", level: 34 },
      { speciesId: 893, nome: "Zarude", level: 62 },
      { speciesId: 701, nome: "Hawlucha", level: 68 },
      { speciesId: 187, nome: "Hoppip", level: 14 }
    ]
  },

  {
    id: "cheren-masters",
    nome: "Cheren-masters",
    imagem: "/images/trainers/cheren-masters.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 777,
    stardust: 3823,
    xp: 177,
    ia: "estrategica",
    time: [
      { speciesId: 290, nome: "Nincada", level: 57 },
      { speciesId: 515, nome: "Panpour", level: 23 },
      { speciesId: 496, nome: "Servine", level: 57 },
      { speciesId: 462, nome: "Magnezone", level: 77 },
      { speciesId: 718, nome: "Zygarde-50", level: 51 },
      { speciesId: 211, nome: "Qwilfish", level: 39 }
    ]
  },

  {
    id: "cheren",
    nome: "Cheren",
    imagem: "/images/trainers/cheren.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 857,
    stardust: 4225,
    xp: 280,
    ia: "defensiva",
    time: [
      { speciesId: 163, nome: "Hoothoot", level: 39 },
      { speciesId: 81, nome: "Magnemite", level: 34 },
      { speciesId: 539, nome: "Sawk", level: 10 },
      { speciesId: 295, nome: "Exploud", level: 33 },
      { speciesId: 807, nome: "Zeraora", level: 36 },
      { speciesId: 204, nome: "Pineco", level: 32 }
    ]
  },

  {
    id: "cheryl",
    nome: "Cheryl",
    imagem: "/images/trainers/cheryl.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 1417,
    stardust: 2651,
    xp: 269,
    ia: "estrategica",
    time: [
      { speciesId: 26, nome: "Raichu", level: 54 },
      { speciesId: 939, nome: "Bellibolt", level: 70 },
      { speciesId: 456, nome: "Finneon", level: 72 },
      { speciesId: 711, nome: "Gourgeist-average", level: 39 },
      { speciesId: 21, nome: "Spearow", level: 12 },
      { speciesId: 884, nome: "Duraludon", level: 28 }
    ]
  },

  {
    id: "chili",
    nome: "Chili",
    imagem: "/images/trainers/chili.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 2880,
    stardust: 3862,
    xp: 133,
    ia: "aleatoria",
    time: [
      { speciesId: 1024, nome: "Terapagos", level: 24 },
      { speciesId: 198, nome: "Murkrow", level: 10 },
      { speciesId: 283, nome: "Surskit", level: 71 },
      { speciesId: 415, nome: "Combee", level: 31 },
      { speciesId: 972, nome: "Houndstone", level: 58 },
      { speciesId: 67, nome: "Machoke", level: 77 }
    ]
  },

  {
    id: "choy",
    nome: "Choy",
    imagem: "/images/trainers/choy.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 2957,
    stardust: 3311,
    xp: 87,
    ia: "aleatoria",
    time: [
      { speciesId: 700, nome: "Sylveon", level: 21 },
      { speciesId: 490, nome: "Manaphy", level: 71 },
      { speciesId: 767, nome: "Wimpod", level: 80 },
      { speciesId: 919, nome: "Nymble", level: 71 },
      { speciesId: 811, nome: "Thwackey", level: 65 },
      { speciesId: 978, nome: "Tatsugiri-curly", level: 61 }
    ]
  },

  {
    id: "christoph",
    nome: "Christoph",
    imagem: "/images/trainers/christoph.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 1430,
    stardust: 194,
    xp: 300,
    ia: "agressiva",
    time: [
      { speciesId: 1012, nome: "Poltchageist", level: 48 },
      { speciesId: 603, nome: "Eelektrik", level: 19 },
      { speciesId: 394, nome: "Prinplup", level: 32 },
      { speciesId: 502, nome: "Dewott", level: 52 },
      { speciesId: 129, nome: "Magikarp", level: 65 },
      { speciesId: 298, nome: "Azurill", level: 42 }
    ]
  },

  {
    id: "chuck-gen2",
    nome: "Chuck-gen2",
    imagem: "/images/trainers/chuck-gen2.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 2232,
    stardust: 3722,
    xp: 464,
    ia: "defensiva",
    time: [
      { speciesId: 963, nome: "Finizen", level: 41 },
      { speciesId: 318, nome: "Carvanha", level: 80 },
      { speciesId: 452, nome: "Drapion", level: 37 },
      { speciesId: 455, nome: "Carnivine", level: 70 },
      { speciesId: 887, nome: "Dragapult", level: 67 },
      { speciesId: 55, nome: "Golduck", level: 59 }
    ]
  },

  {
    id: "chuck",
    nome: "Chuck",
    imagem: "/images/trainers/chuck.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 2515,
    stardust: 4837,
    xp: 356,
    ia: "agressiva",
    time: [
      { speciesId: 784, nome: "Kommo-o", level: 44 },
      { speciesId: 170, nome: "Chinchou", level: 37 },
      { speciesId: 558, nome: "Crustle", level: 16 },
      { speciesId: 360, nome: "Wynaut", level: 50 },
      { speciesId: 94, nome: "Gengar", level: 39 },
      { speciesId: 1001, nome: "Wo-chien", level: 17 }
    ]
  },

  {
    id: "cilan",
    nome: "Cilan",
    imagem: "/images/trainers/cilan.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 2599,
    stardust: 1728,
    xp: 286,
    ia: "defensiva",
    time: [
      { speciesId: 762, nome: "Steenee", level: 16 },
      { speciesId: 285, nome: "Shroomish", level: 75 },
      { speciesId: 112, nome: "Rhydon", level: 26 },
      { speciesId: 991, nome: "Iron-bundle", level: 27 },
      { speciesId: 495, nome: "Snivy", level: 75 },
      { speciesId: 147, nome: "Dratini", level: 57 }
    ]
  },

  {
    id: "clair-gen2",
    nome: "Clair-gen2",
    imagem: "/images/trainers/clair-gen2.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 954,
    stardust: 5318,
    xp: 331,
    ia: "aleatoria",
    time: [
      { speciesId: 980, nome: "Clodsire", level: 69 },
      { speciesId: 370, nome: "Luvdisc", level: 26 },
      { speciesId: 1024, nome: "Terapagos", level: 80 },
      { speciesId: 572, nome: "Minccino", level: 64 },
      { speciesId: 215, nome: "Sneasel", level: 79 },
      { speciesId: 708, nome: "Phantump", level: 18 }
    ]
  },

  {
    id: "clair-masters",
    nome: "Clair-masters",
    imagem: "/images/trainers/clair-masters.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 1063,
    stardust: 4484,
    xp: 289,
    ia: "agressiva",
    time: [
      { speciesId: 712, nome: "Bergmite", level: 62 },
      { speciesId: 961, nome: "Wugtrio", level: 32 },
      { speciesId: 201, nome: "Unown", level: 27 },
      { speciesId: 226, nome: "Mantine", level: 25 },
      { speciesId: 625, nome: "Bisharp", level: 66 },
      { speciesId: 688, nome: "Binacle", level: 69 }
    ]
  },

  {
    id: "clair",
    nome: "Clair",
    imagem: "/images/trainers/clair.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "dificil",
    recompensa: 628,
    stardust: 5336,
    xp: 489,
    ia: "defensiva",
    time: [
      { speciesId: 108, nome: "Lickitung", level: 59 },
      { speciesId: 500, nome: "Emboar", level: 33 },
      { speciesId: 902, nome: "Basculegion-male", level: 26 },
      { speciesId: 903, nome: "Sneasler", level: 17 },
      { speciesId: 813, nome: "Scorbunny", level: 22 },
      { speciesId: 817, nome: "Drizzile", level: 38 }
    ]
  },

  {
    id: "clavell-s",
    nome: "Clavell-s",
    imagem: "/images/trainers/clavell-s.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 328,
    stardust: 4563,
    xp: 368,
    ia: "estrategica",
    time: [
      { speciesId: 313, nome: "Volbeat", level: 44 },
      { speciesId: 273, nome: "Seedot", level: 63 },
      { speciesId: 751, nome: "Dewpider", level: 79 },
      { speciesId: 739, nome: "Crabrawler", level: 35 },
      { speciesId: 250, nome: "Ho-oh", level: 24 },
      { speciesId: 364, nome: "Sealeo", level: 65 }
    ]
  },

  {
    id: "clay",
    nome: "Clay",
    imagem: "/images/trainers/clay.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 1442,
    stardust: 5371,
    xp: 80,
    ia: "defensiva",
    time: [
      { speciesId: 993, nome: "Iron-jugulis", level: 73 },
      { speciesId: 68, nome: "Machamp", level: 39 },
      { speciesId: 275, nome: "Shiftry", level: 12 },
      { speciesId: 397, nome: "Staravia", level: 44 },
      { speciesId: 440, nome: "Happiny", level: 66 },
      { speciesId: 969, nome: "Glimmet", level: 10 }
    ]
  },

  {
    id: "clemont",
    nome: "Clemont",
    imagem: "/images/trainers/clemont.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "dificil",
    recompensa: 2797,
    stardust: 5042,
    xp: 67,
    ia: "defensiva",
    time: [
      { speciesId: 721, nome: "Volcanion", level: 57 },
      { speciesId: 685, nome: "Slurpuff", level: 42 },
      { speciesId: 771, nome: "Pyukumuku", level: 13 },
      { speciesId: 856, nome: "Hatenna", level: 47 },
      { speciesId: 505, nome: "Watchog", level: 72 },
      { speciesId: 929, nome: "Dolliv", level: 25 }
    ]
  },

  {
    id: "clerk-boss",
    nome: "Clerk-boss",
    imagem: "/images/trainers/clerk-boss.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 2019,
    stardust: 1097,
    xp: 395,
    ia: "agressiva",
    time: [
      { speciesId: 95, nome: "Onix", level: 37 },
      { speciesId: 499, nome: "Pignite", level: 14 },
      { speciesId: 507, nome: "Herdier", level: 64 },
      { speciesId: 309, nome: "Electrike", level: 40 },
      { speciesId: 229, nome: "Houndoom", level: 80 },
      { speciesId: 123, nome: "Scyther", level: 66 }
    ]
  },

  {
    id: "clerk-gen8",
    nome: "Clerk-gen8",
    imagem: "/images/trainers/clerk-gen8.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 2092,
    stardust: 3609,
    xp: 252,
    ia: "aleatoria",
    time: [
      { speciesId: 354, nome: "Banette", level: 73 },
      { speciesId: 356, nome: "Dusclops", level: 15 },
      { speciesId: 826, nome: "Orbeetle", level: 63 },
      { speciesId: 772, nome: "Type-null", level: 53 },
      { speciesId: 489, nome: "Phione", level: 32 },
      { speciesId: 584, nome: "Vanilluxe", level: 23 }
    ]
  },

  {
    id: "clerk-unite",
    nome: "Clerk-unite",
    imagem: "/images/trainers/clerk-unite.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 2294,
    stardust: 4908,
    xp: 123,
    ia: "defensiva",
    time: [
      { speciesId: 500, nome: "Emboar", level: 17 },
      { speciesId: 920, nome: "Lokix", level: 45 },
      { speciesId: 922, nome: "Pawmo", level: 51 },
      { speciesId: 727, nome: "Incineroar", level: 36 },
      { speciesId: 596, nome: "Galvantula", level: 79 },
      { speciesId: 841, nome: "Flapple", level: 76 }
    ]
  },

  {
    id: "clerk",
    nome: "Clerk",
    imagem: "/images/trainers/clerk.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 1600,
    stardust: 2068,
    xp: 470,
    ia: "agressiva",
    time: [
      { speciesId: 61, nome: "Poliwhirl", level: 47 },
      { speciesId: 958, nome: "Tinkatuff", level: 70 },
      { speciesId: 267, nome: "Beautifly", level: 60 },
      { speciesId: 513, nome: "Pansear", level: 27 },
      { speciesId: 976, nome: "Veluza", level: 17 },
      { speciesId: 686, nome: "Inkay", level: 50 }
    ]
  },

  {
    id: "clerkf-gen8",
    nome: "Clerkf-gen8",
    imagem: "/images/trainers/clerkf-gen8.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 1981,
    stardust: 1276,
    xp: 420,
    ia: "estrategica",
    time: [
      { speciesId: 456, nome: "Finneon", level: 25 },
      { speciesId: 127, nome: "Pinsir", level: 47 },
      { speciesId: 289, nome: "Slaking", level: 66 },
      { speciesId: 487, nome: "Giratina-altered", level: 58 },
      { speciesId: 259, nome: "Marshtomp", level: 45 },
      { speciesId: 785, nome: "Tapu-koko", level: 59 }
    ]
  },

  {
    id: "clerkf",
    nome: "Clerkf",
    imagem: "/images/trainers/clerkf.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 564,
    stardust: 961,
    xp: 298,
    ia: "aleatoria",
    time: [
      { speciesId: 621, nome: "Druddigon", level: 23 },
      { speciesId: 477, nome: "Dusknoir", level: 41 },
      { speciesId: 440, nome: "Happiny", level: 62 },
      { speciesId: 167, nome: "Spinarak", level: 19 },
      { speciesId: 622, nome: "Golett", level: 53 },
      { speciesId: 805, nome: "Stakataka", level: 22 }
    ]
  },

  {
    id: "cliff",
    nome: "Cliff",
    imagem: "/images/trainers/cliff.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 927,
    stardust: 2813,
    xp: 364,
    ia: "estrategica",
    time: [
      { speciesId: 697, nome: "Tyrantrum", level: 57 },
      { speciesId: 732, nome: "Trumbeak", level: 25 },
      { speciesId: 417, nome: "Pachirisu", level: 26 },
      { speciesId: 463, nome: "Lickilicky", level: 24 },
      { speciesId: 994, nome: "Iron-moth", level: 45 },
      { speciesId: 245, nome: "Suicune", level: 23 }
    ]
  },

  {
    id: "clive-v",
    nome: "Clive-v",
    imagem: "/images/trainers/clive-v.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 1778,
    stardust: 5387,
    xp: 171,
    ia: "defensiva",
    time: [
      { speciesId: 81, nome: "Magnemite", level: 24 },
      { speciesId: 755, nome: "Morelull", level: 59 },
      { speciesId: 271, nome: "Lombre", level: 72 },
      { speciesId: 946, nome: "Bramblin", level: 55 },
      { speciesId: 304, nome: "Aron", level: 31 },
      { speciesId: 634, nome: "Zweilous", level: 54 }
    ]
  },

  {
    id: "clover",
    nome: "Clover",
    imagem: "/images/trainers/clover.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 2907,
    stardust: 2025,
    xp: 237,
    ia: "aleatoria",
    time: [
      { speciesId: 991, nome: "Iron-bundle", level: 30 },
      { speciesId: 131, nome: "Lapras", level: 77 },
      { speciesId: 838, nome: "Carkol", level: 59 },
      { speciesId: 753, nome: "Fomantis", level: 16 },
      { speciesId: 259, nome: "Marshtomp", level: 26 },
      { speciesId: 755, nome: "Morelull", level: 18 }
    ]
  },

  {
    id: "clown",
    nome: "Clown",
    imagem: "/images/trainers/clown.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 2343,
    stardust: 386,
    xp: 487,
    ia: "defensiva",
    time: [
      { speciesId: 784, nome: "Kommo-o", level: 76 },
      { speciesId: 7, nome: "Squirtle", level: 45 },
      { speciesId: 373, nome: "Salamence", level: 46 },
      { speciesId: 102, nome: "Exeggcute", level: 21 },
      { speciesId: 671, nome: "Florges", level: 25 },
      { speciesId: 110, nome: "Weezing", level: 53 }
    ]
  },

  {
    id: "cogita",
    nome: "Cogita",
    imagem: "/images/trainers/cogita.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 2017,
    stardust: 4450,
    xp: 307,
    ia: "agressiva",
    time: [
      { speciesId: 110, nome: "Weezing", level: 11 },
      { speciesId: 588, nome: "Karrablast", level: 22 },
      { speciesId: 1016, nome: "Fezandipiti", level: 45 },
      { speciesId: 791, nome: "Solgaleo", level: 69 },
      { speciesId: 843, nome: "Silicobra", level: 12 },
      { speciesId: 21, nome: "Spearow", level: 30 }
    ]
  },

  {
    id: "coin",
    nome: "Coin",
    imagem: "/images/trainers/coin.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 699,
    stardust: 3842,
    xp: 225,
    ia: "agressiva",
    time: [
      { speciesId: 857, nome: "Hattrem", level: 26 },
      { speciesId: 914, nome: "Quaquaval", level: 74 },
      { speciesId: 998, nome: "Baxcalibur", level: 80 },
      { speciesId: 380, nome: "Latias", level: 72 },
      { speciesId: 32, nome: "Nidoran-m", level: 80 },
      { speciesId: 420, nome: "Cherubi", level: 53 }
    ]
  },

  {
    id: "collector-gen3",
    nome: "Collector-gen3",
    imagem: "/images/trainers/collector-gen3.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 1342,
    stardust: 4014,
    xp: 246,
    ia: "agressiva",
    time: [
      { speciesId: 365, nome: "Walrein", level: 13 },
      { speciesId: 150, nome: "Mewtwo", level: 56 },
      { speciesId: 261, nome: "Poochyena", level: 46 },
      { speciesId: 102, nome: "Exeggcute", level: 10 },
      { speciesId: 388, nome: "Grotle", level: 24 },
      { speciesId: 775, nome: "Komala", level: 18 }
    ]
  },

  {
    id: "collector-gen6",
    nome: "Collector-gen6",
    imagem: "/images/trainers/collector-gen6.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 2082,
    stardust: 2203,
    xp: 267,
    ia: "agressiva",
    time: [
      { speciesId: 807, nome: "Zeraora", level: 29 },
      { speciesId: 873, nome: "Frosmoth", level: 22 },
      { speciesId: 1003, nome: "Ting-lu", level: 56 },
      { speciesId: 162, nome: "Furret", level: 20 },
      { speciesId: 933, nome: "Naclstack", level: 77 },
      { speciesId: 642, nome: "Thundurus-incarnate", level: 13 }
    ]
  },

  {
    id: "collector-gen7",
    nome: "Collector-gen7",
    imagem: "/images/trainers/collector-gen7.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 2292,
    stardust: 847,
    xp: 112,
    ia: "defensiva",
    time: [
      { speciesId: 543, nome: "Venipede", level: 56 },
      { speciesId: 914, nome: "Quaquaval", level: 35 },
      { speciesId: 1, nome: "Bulbasaur", level: 69 },
      { speciesId: 73, nome: "Tentacruel", level: 67 },
      { speciesId: 361, nome: "Snorunt", level: 30 },
      { speciesId: 29, nome: "Nidoran-f", level: 75 }
    ]
  },

  {
    id: "collector-masters",
    nome: "Collector-masters",
    imagem: "/images/trainers/collector-masters.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 2480,
    stardust: 1484,
    xp: 448,
    ia: "defensiva",
    time: [
      { speciesId: 781, nome: "Dhelmise", level: 35 },
      { speciesId: 596, nome: "Galvantula", level: 21 },
      { speciesId: 312, nome: "Minun", level: 24 },
      { speciesId: 606, nome: "Beheeyem", level: 21 },
      { speciesId: 956, nome: "Espathra", level: 71 },
      { speciesId: 388, nome: "Grotle", level: 26 }
    ]
  },

  {
    id: "collector",
    nome: "Collector",
    imagem: "/images/trainers/collector.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 2671,
    stardust: 688,
    xp: 485,
    ia: "aleatoria",
    time: [
      { speciesId: 678, nome: "Meowstic-male", level: 51 },
      { speciesId: 284, nome: "Masquerain", level: 21 },
      { speciesId: 924, nome: "Tandemaus", level: 49 },
      { speciesId: 816, nome: "Sobble", level: 14 },
      { speciesId: 540, nome: "Sewaddle", level: 16 },
      { speciesId: 837, nome: "Rolycoly", level: 64 }
    ]
  },

  {
    id: "colress-gen7",
    nome: "Colress-gen7",
    imagem: "/images/trainers/colress-gen7.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 1928,
    stardust: 2960,
    xp: 138,
    ia: "agressiva",
    time: [
      { speciesId: 408, nome: "Cranidos", level: 47 },
      { speciesId: 375, nome: "Metang", level: 65 },
      { speciesId: 800, nome: "Necrozma", level: 40 },
      { speciesId: 889, nome: "Zamazenta", level: 65 },
      { speciesId: 271, nome: "Lombre", level: 36 },
      { speciesId: 144, nome: "Articuno", level: 23 }
    ]
  },

  {
    id: "colress",
    nome: "Colress",
    imagem: "/images/trainers/colress.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 2603,
    stardust: 100,
    xp: 263,
    ia: "aleatoria",
    time: [
      { speciesId: 381, nome: "Latios", level: 24 },
      { speciesId: 795, nome: "Pheromosa", level: 57 },
      { speciesId: 304, nome: "Aron", level: 68 },
      { speciesId: 127, nome: "Pinsir", level: 47 },
      { speciesId: 886, nome: "Drakloak", level: 60 },
      { speciesId: 830, nome: "Eldegoss", level: 49 }
    ]
  },

  {
    id: "colza",
    nome: "Colza",
    imagem: "/images/trainers/colza.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 1220,
    stardust: 951,
    xp: 160,
    ia: "estrategica",
    time: [
      { speciesId: 591, nome: "Amoonguss", level: 56 },
      { speciesId: 855, nome: "Polteageist", level: 27 },
      { speciesId: 278, nome: "Wingull", level: 37 },
      { speciesId: 892, nome: "Urshifu-single-strike", level: 26 },
      { speciesId: 623, nome: "Golurk", level: 51 },
      { speciesId: 442, nome: "Spiritomb", level: 19 }
    ]
  },

  {
    id: "concordia",
    nome: "Concordia",
    imagem: "/images/trainers/concordia.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 1111,
    stardust: 3015,
    xp: 481,
    ia: "aleatoria",
    time: [
      { speciesId: 715, nome: "Noivern", level: 20 },
      { speciesId: 618, nome: "Stunfisk", level: 66 },
      { speciesId: 712, nome: "Bergmite", level: 10 },
      { speciesId: 505, nome: "Watchog", level: 62 },
      { speciesId: 975, nome: "Cetitan", level: 37 },
      { speciesId: 702, nome: "Dedenne", level: 76 }
    ]
  },

  {
    id: "cook-gen7",
    nome: "Cook-gen7",
    imagem: "/images/trainers/cook-gen7.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 1664,
    stardust: 3212,
    xp: 118,
    ia: "defensiva",
    time: [
      { speciesId: 510, nome: "Liepard", level: 60 },
      { speciesId: 915, nome: "Lechonk", level: 42 },
      { speciesId: 503, nome: "Samurott", level: 63 },
      { speciesId: 941, nome: "Kilowattrel", level: 42 },
      { speciesId: 428, nome: "Lopunny", level: 38 },
      { speciesId: 748, nome: "Toxapex", level: 10 }
    ]
  },

  {
    id: "cook-gen9",
    nome: "Cook-gen9",
    imagem: "/images/trainers/cook-gen9.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 2932,
    stardust: 5334,
    xp: 486,
    ia: "agressiva",
    time: [
      { speciesId: 246, nome: "Larvitar", level: 65 },
      { speciesId: 335, nome: "Zangoose", level: 34 },
      { speciesId: 338, nome: "Solrock", level: 78 },
      { speciesId: 853, nome: "Grapploct", level: 58 },
      { speciesId: 554, nome: "Darumaka", level: 18 },
      { speciesId: 677, nome: "Espurr", level: 56 }
    ]
  },

  {
    id: "cook",
    nome: "Cook",
    imagem: "/images/trainers/cook.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 848,
    stardust: 359,
    xp: 327,
    ia: "estrategica",
    time: [
      { speciesId: 386, nome: "Deoxys-normal", level: 32 },
      { speciesId: 213, nome: "Shuckle", level: 69 },
      { speciesId: 566, nome: "Archen", level: 21 },
      { speciesId: 99, nome: "Kingler", level: 70 },
      { speciesId: 836, nome: "Boltund", level: 35 },
      { speciesId: 620, nome: "Mienshao", level: 36 }
    ]
  },

  {
    id: "courier",
    nome: "Courier",
    imagem: "/images/trainers/courier.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 1289,
    stardust: 2263,
    xp: 347,
    ia: "defensiva",
    time: [
      { speciesId: 363, nome: "Spheal", level: 30 },
      { speciesId: 625, nome: "Bisharp", level: 64 },
      { speciesId: 51, nome: "Dugtrio", level: 33 },
      { speciesId: 397, nome: "Staravia", level: 80 },
      { speciesId: 162, nome: "Furret", level: 75 },
      { speciesId: 899, nome: "Wyrdeer", level: 38 }
    ]
  },

  {
    id: "courtney-gen3",
    nome: "Courtney-gen3",
    imagem: "/images/trainers/courtney-gen3.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 2373,
    stardust: 4412,
    xp: 457,
    ia: "aleatoria",
    time: [
      { speciesId: 812, nome: "Rillaboom", level: 51 },
      { speciesId: 767, nome: "Wimpod", level: 64 },
      { speciesId: 281, nome: "Kirlia", level: 48 },
      { speciesId: 96, nome: "Drowzee", level: 53 },
      { speciesId: 393, nome: "Piplup", level: 45 },
      { speciesId: 912, nome: "Quaxly", level: 54 }
    ]
  },

  {
    id: "courtney",
    nome: "Courtney",
    imagem: "/images/trainers/courtney.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 1686,
    stardust: 1377,
    xp: 89,
    ia: "aleatoria",
    time: [
      { speciesId: 344, nome: "Claydol", level: 36 },
      { speciesId: 240, nome: "Magby", level: 56 },
      { speciesId: 132, nome: "Ditto", level: 60 },
      { speciesId: 97, nome: "Hypno", level: 19 },
      { speciesId: 303, nome: "Mawile", level: 16 },
      { speciesId: 204, nome: "Pineco", level: 41 }
    ]
  },

  {
    id: "cowgirl",
    nome: "Cowgirl",
    imagem: "/images/trainers/cowgirl.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 846,
    stardust: 1812,
    xp: 401,
    ia: "agressiva",
    time: [
      { speciesId: 247, nome: "Pupitar", level: 56 },
      { speciesId: 139, nome: "Omastar", level: 46 },
      { speciesId: 178, nome: "Xatu", level: 69 },
      { speciesId: 412, nome: "Burmy", level: 28 },
      { speciesId: 1012, nome: "Poltchageist", level: 45 },
      { speciesId: 1015, nome: "Munkidori", level: 42 }
    ]
  },

  {
    id: "crasherwake",
    nome: "Crasherwake",
    imagem: "/images/trainers/crasherwake.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 1338,
    stardust: 3265,
    xp: 206,
    ia: "aleatoria",
    time: [
      { speciesId: 756, nome: "Shiinotic", level: 29 },
      { speciesId: 858, nome: "Hatterene", level: 43 },
      { speciesId: 592, nome: "Frillish", level: 17 },
      { speciesId: 235, nome: "Smeargle", level: 21 },
      { speciesId: 868, nome: "Milcery", level: 14 },
      { speciesId: 1023, nome: "Iron-crown", level: 24 }
    ]
  },

  {
    id: "cress",
    nome: "Cress",
    imagem: "/images/trainers/cress.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 2433,
    stardust: 3229,
    xp: 144,
    ia: "estrategica",
    time: [
      { speciesId: 733, nome: "Toucannon", level: 41 },
      { speciesId: 24, nome: "Arbok", level: 58 },
      { speciesId: 407, nome: "Roserade", level: 17 },
      { speciesId: 303, nome: "Mawile", level: 23 },
      { speciesId: 1013, nome: "Sinistcha", level: 74 },
      { speciesId: 435, nome: "Skuntank", level: 32 }
    ]
  },

  {
    id: "crispin",
    nome: "Crispin",
    imagem: "/images/trainers/crispin.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 244,
    stardust: 1095,
    xp: 497,
    ia: "defensiva",
    time: [
      { speciesId: 139, nome: "Omastar", level: 29 },
      { speciesId: 317, nome: "Swalot", level: 48 },
      { speciesId: 886, nome: "Drakloak", level: 54 },
      { speciesId: 693, nome: "Clawitzer", level: 30 },
      { speciesId: 679, nome: "Honedge", level: 15 },
      { speciesId: 845, nome: "Cramorant", level: 63 }
    ]
  },

  {
    id: "crushgirl-gen3",
    nome: "Crushgirl-gen3",
    imagem: "/images/trainers/crushgirl-gen3.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 790,
    stardust: 4027,
    xp: 204,
    ia: "defensiva",
    time: [
      { speciesId: 485, nome: "Heatran", level: 13 },
      { speciesId: 610, nome: "Axew", level: 48 },
      { speciesId: 965, nome: "Varoom", level: 42 },
      { speciesId: 242, nome: "Blissey", level: 55 },
      { speciesId: 727, nome: "Incineroar", level: 16 },
      { speciesId: 508, nome: "Stoutland", level: 68 }
    ]
  },

  {
    id: "crushkin-gen3",
    nome: "Crushkin-gen3",
    imagem: "/images/trainers/crushkin-gen3.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 1334,
    stardust: 2914,
    xp: 371,
    ia: "estrategica",
    time: [
      { speciesId: 146, nome: "Moltres", level: 21 },
      { speciesId: 31, nome: "Nidoqueen", level: 16 },
      { speciesId: 381, nome: "Latios", level: 16 },
      { speciesId: 61, nome: "Poliwhirl", level: 60 },
      { speciesId: 166, nome: "Ledian", level: 79 },
      { speciesId: 922, nome: "Pawmo", level: 15 }
    ]
  },

  {
    id: "cueball-gen1",
    nome: "Cueball-gen1",
    imagem: "/images/trainers/cueball-gen1.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 2510,
    stardust: 1323,
    xp: 268,
    ia: "agressiva",
    time: [
      { speciesId: 830, nome: "Eldegoss", level: 72 },
      { speciesId: 124, nome: "Jynx", level: 47 },
      { speciesId: 163, nome: "Hoothoot", level: 16 },
      { speciesId: 960, nome: "Wiglett", level: 27 },
      { speciesId: 873, nome: "Frosmoth", level: 44 },
      { speciesId: 1009, nome: "Walking-wake", level: 50 }
    ]
  },

  {
    id: "cueball-gen1rb",
    nome: "Cueball-gen1rb",
    imagem: "/images/trainers/cueball-gen1rb.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 1362,
    stardust: 434,
    xp: 261,
    ia: "defensiva",
    time: [
      { speciesId: 757, nome: "Salandit", level: 69 },
      { speciesId: 142, nome: "Aerodactyl", level: 71 },
      { speciesId: 197, nome: "Umbreon", level: 61 },
      { speciesId: 125, nome: "Electabuzz", level: 19 },
      { speciesId: 841, nome: "Flapple", level: 20 },
      { speciesId: 790, nome: "Cosmoem", level: 48 }
    ]
  },

  {
    id: "cueball-gen3",
    nome: "Cueball-gen3",
    imagem: "/images/trainers/cueball-gen3.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 620,
    stardust: 280,
    xp: 199,
    ia: "defensiva",
    time: [
      { speciesId: 759, nome: "Stufful", level: 47 },
      { speciesId: 570, nome: "Zorua", level: 37 },
      { speciesId: 67, nome: "Machoke", level: 58 },
      { speciesId: 488, nome: "Cresselia", level: 30 },
      { speciesId: 330, nome: "Flygon", level: 79 },
      { speciesId: 433, nome: "Chingling", level: 39 }
    ]
  },

  {
    id: "curtis",
    nome: "Curtis",
    imagem: "/images/trainers/curtis.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 127,
    stardust: 1427,
    xp: 396,
    ia: "estrategica",
    time: [
      { speciesId: 7, nome: "Squirtle", level: 70 },
      { speciesId: 306, nome: "Aggron", level: 74 },
      { speciesId: 473, nome: "Mamoswine", level: 50 },
      { speciesId: 42, nome: "Golbat", level: 46 },
      { speciesId: 474, nome: "Porygon-z", level: 66 },
      { speciesId: 222, nome: "Corsola", level: 72 }
    ]
  },

  {
    id: "cyclist-gen4",
    nome: "Cyclist-gen4",
    imagem: "/images/trainers/cyclist-gen4.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 2280,
    stardust: 2465,
    xp: 300,
    ia: "aleatoria",
    time: [
      { speciesId: 192, nome: "Sunflora", level: 43 },
      { speciesId: 409, nome: "Rampardos", level: 49 },
      { speciesId: 611, nome: "Fraxure", level: 77 },
      { speciesId: 572, nome: "Minccino", level: 31 },
      { speciesId: 91, nome: "Cloyster", level: 49 },
      { speciesId: 874, nome: "Stonjourner", level: 28 }
    ]
  },

  {
    id: "cyclist",
    nome: "Cyclist",
    imagem: "/images/trainers/cyclist.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 2759,
    stardust: 2520,
    xp: 211,
    ia: "estrategica",
    time: [
      { speciesId: 769, nome: "Sandygast", level: 75 },
      { speciesId: 583, nome: "Vanillish", level: 46 },
      { speciesId: 221, nome: "Piloswine", level: 46 },
      { speciesId: 761, nome: "Bounsweet", level: 32 },
      { speciesId: 649, nome: "Genesect", level: 15 },
      { speciesId: 507, nome: "Herdier", level: 30 }
    ]
  },

  {
    id: "cyclistf-gen4",
    nome: "Cyclistf-gen4",
    imagem: "/images/trainers/cyclistf-gen4.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 501,
    stardust: 2343,
    xp: 95,
    ia: "agressiva",
    time: [
      { speciesId: 238, nome: "Smoochum", level: 40 },
      { speciesId: 252, nome: "Treecko", level: 75 },
      { speciesId: 369, nome: "Relicanth", level: 65 },
      { speciesId: 58, nome: "Growlithe", level: 63 },
      { speciesId: 473, nome: "Mamoswine", level: 49 },
      { speciesId: 275, nome: "Shiftry", level: 21 }
    ]
  },

  {
    id: "cyclistf",
    nome: "Cyclistf",
    imagem: "/images/trainers/cyclistf.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 1563,
    stardust: 4541,
    xp: 408,
    ia: "aleatoria",
    time: [
      { speciesId: 630, nome: "Mandibuzz", level: 30 },
      { speciesId: 493, nome: "Arceus", level: 34 },
      { speciesId: 425, nome: "Drifloon", level: 35 },
      { speciesId: 46, nome: "Paras", level: 43 },
      { speciesId: 212, nome: "Scizor", level: 24 },
      { speciesId: 25, nome: "Pikachu", level: 11 }
    ]
  },

  {
    id: "cyllene",
    nome: "Cyllene",
    imagem: "/images/trainers/cyllene.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 149,
    stardust: 4588,
    xp: 107,
    ia: "defensiva",
    time: [
      { speciesId: 815, nome: "Cinderace", level: 66 },
      { speciesId: 328, nome: "Trapinch", level: 28 },
      { speciesId: 807, nome: "Zeraora", level: 33 },
      { speciesId: 878, nome: "Cufant", level: 70 },
      { speciesId: 537, nome: "Seismitoad", level: 13 },
      { speciesId: 703, nome: "Carbink", level: 67 }
    ]
  },

  {
    id: "cynthia-anime",
    nome: "Cynthia-anime",
    imagem: "/images/trainers/cynthia-anime.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 1212,
    stardust: 1950,
    xp: 480,
    ia: "agressiva",
    time: [
      { speciesId: 86, nome: "Seel", level: 45 },
      { speciesId: 885, nome: "Dreepy", level: 56 },
      { speciesId: 909, nome: "Fuecoco", level: 34 },
      { speciesId: 666, nome: "Vivillon", level: 21 },
      { speciesId: 731, nome: "Pikipek", level: 26 },
      { speciesId: 805, nome: "Stakataka", level: 53 }
    ]
  },

  {
    id: "cynthia-anime2",
    nome: "Cynthia-anime2",
    imagem: "/images/trainers/cynthia-anime2.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 2217,
    stardust: 5465,
    xp: 286,
    ia: "aleatoria",
    time: [
      { speciesId: 121, nome: "Starmie", level: 31 },
      { speciesId: 998, nome: "Baxcalibur", level: 22 },
      { speciesId: 1002, nome: "Chien-pao", level: 16 },
      { speciesId: 129, nome: "Magikarp", level: 14 },
      { speciesId: 135, nome: "Jolteon", level: 31 },
      { speciesId: 636, nome: "Larvesta", level: 17 }
    ]
  },

  {
    id: "cynthia-gen4",
    nome: "Cynthia-gen4",
    imagem: "/images/trainers/cynthia-gen4.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 362,
    stardust: 3682,
    xp: 123,
    ia: "aleatoria",
    time: [
      { speciesId: 243, nome: "Raikou", level: 60 },
      { speciesId: 1006, nome: "Iron-valiant", level: 60 },
      { speciesId: 489, nome: "Phione", level: 24 },
      { speciesId: 339, nome: "Barboach", level: 45 },
      { speciesId: 605, nome: "Elgyem", level: 13 },
      { speciesId: 685, nome: "Slurpuff", level: 26 }
    ]
  },

  {
    id: "cynthia-gen7",
    nome: "Cynthia-gen7",
    imagem: "/images/trainers/cynthia-gen7.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 1422,
    stardust: 4264,
    xp: 303,
    ia: "agressiva",
    time: [
      { speciesId: 1001, nome: "Wo-chien", level: 59 },
      { speciesId: 829, nome: "Gossifleur", level: 74 },
      { speciesId: 720, nome: "Hoopa", level: 66 },
      { speciesId: 849, nome: "Toxtricity-amped", level: 12 },
      { speciesId: 32, nome: "Nidoran-m", level: 47 },
      { speciesId: 131, nome: "Lapras", level: 67 }
    ]
  },

  {
    id: "cynthia-masters",
    nome: "Cynthia-masters",
    imagem: "/images/trainers/cynthia-masters.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 990,
    stardust: 3418,
    xp: 92,
    ia: "aleatoria",
    time: [
      { speciesId: 942, nome: "Maschiff", level: 51 },
      { speciesId: 337, nome: "Lunatone", level: 38 },
      { speciesId: 799, nome: "Guzzlord", level: 72 },
      { speciesId: 480, nome: "Uxie", level: 40 },
      { speciesId: 51, nome: "Dugtrio", level: 70 },
      { speciesId: 401, nome: "Kricketot", level: 41 }
    ]
  },

  {
    id: "cynthia-masters2",
    nome: "Cynthia-masters2",
    imagem: "/images/trainers/cynthia-masters2.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 1915,
    stardust: 2338,
    xp: 207,
    ia: "aleatoria",
    time: [
      { speciesId: 334, nome: "Altaria", level: 73 },
      { speciesId: 20, nome: "Raticate", level: 40 },
      { speciesId: 186, nome: "Politoed", level: 13 },
      { speciesId: 513, nome: "Pansear", level: 35 },
      { speciesId: 809, nome: "Melmetal", level: 18 },
      { speciesId: 296, nome: "Makuhita", level: 43 }
    ]
  },

  {
    id: "cynthia-masters3",
    nome: "Cynthia-masters3",
    imagem: "/images/trainers/cynthia-masters3.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 190,
    stardust: 4195,
    xp: 128,
    ia: "aleatoria",
    time: [
      { speciesId: 818, nome: "Inteleon", level: 24 },
      { speciesId: 117, nome: "Seadra", level: 79 },
      { speciesId: 884, nome: "Duraludon", level: 52 },
      { speciesId: 272, nome: "Ludicolo", level: 61 },
      { speciesId: 634, nome: "Zweilous", level: 25 },
      { speciesId: 767, nome: "Wimpod", level: 39 }
    ]
  },

  {
    id: "cynthia-masters4",
    nome: "Cynthia-masters4",
    imagem: "/images/trainers/cynthia-masters4.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 2254,
    stardust: 5450,
    xp: 272,
    ia: "defensiva",
    time: [
      { speciesId: 935, nome: "Charcadet", level: 75 },
      { speciesId: 774, nome: "Minior-red-meteor", level: 38 },
      { speciesId: 622, nome: "Golett", level: 75 },
      { speciesId: 390, nome: "Chimchar", level: 56 },
      { speciesId: 840, nome: "Applin", level: 28 },
      { speciesId: 413, nome: "Wormadam-plant", level: 20 }
    ]
  },

  {
    id: "cynthia",
    nome: "Cynthia",
    imagem: "/images/trainers/cynthia.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 2797,
    stardust: 5453,
    xp: 156,
    ia: "estrategica",
    time: [
      { speciesId: 204, nome: "Pineco", level: 24 },
      { speciesId: 612, nome: "Haxorus", level: 77 },
      { speciesId: 750, nome: "Mudsdale", level: 70 },
      { speciesId: 345, nome: "Lileep", level: 60 },
      { speciesId: 262, nome: "Mightyena", level: 21 },
      { speciesId: 952, nome: "Scovillain", level: 28 }
    ]
  },

  {
    id: "cyrano",
    nome: "Cyrano",
    imagem: "/images/trainers/cyrano.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 1049,
    stardust: 1050,
    xp: 363,
    ia: "agressiva",
    time: [
      { speciesId: 920, nome: "Lokix", level: 55 },
      { speciesId: 536, nome: "Palpitoad", level: 12 },
      { speciesId: 873, nome: "Frosmoth", level: 80 },
      { speciesId: 256, nome: "Combusken", level: 60 },
      { speciesId: 853, nome: "Grapploct", level: 28 },
      { speciesId: 224, nome: "Octillery", level: 21 }
    ]
  },

  {
    id: "cyrus-masters",
    nome: "Cyrus-masters",
    imagem: "/images/trainers/cyrus-masters.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 2823,
    stardust: 2061,
    xp: 298,
    ia: "aleatoria",
    time: [
      { speciesId: 1014, nome: "Okidogi", level: 51 },
      { speciesId: 253, nome: "Grovyle", level: 40 },
      { speciesId: 565, nome: "Carracosta", level: 80 },
      { speciesId: 731, nome: "Pikipek", level: 64 },
      { speciesId: 108, nome: "Lickitung", level: 51 },
      { speciesId: 189, nome: "Jumpluff", level: 37 }
    ]
  },

  {
    id: "cyrus",
    nome: "Cyrus",
    imagem: "/images/trainers/cyrus.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 1323,
    stardust: 3910,
    xp: 56,
    ia: "aleatoria",
    time: [
      { speciesId: 275, nome: "Shiftry", level: 53 },
      { speciesId: 748, nome: "Toxapex", level: 61 },
      { speciesId: 973, nome: "Flamigo", level: 29 },
      { speciesId: 213, nome: "Shuckle", level: 28 },
      { speciesId: 689, nome: "Barbaracle", level: 38 },
      { speciesId: 416, nome: "Vespiquen", level: 50 }
    ]
  },

  {
    id: "dagero",
    nome: "Dagero",
    imagem: "/images/trainers/dagero.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 2867,
    stardust: 3740,
    xp: 359,
    ia: "estrategica",
    time: [
      { speciesId: 331, nome: "Cacnea", level: 12 },
      { speciesId: 146, nome: "Moltres", level: 32 },
      { speciesId: 577, nome: "Solosis", level: 29 },
      { speciesId: 565, nome: "Carracosta", level: 14 },
      { speciesId: 878, nome: "Cufant", level: 19 },
      { speciesId: 499, nome: "Pignite", level: 46 }
    ]
  },

  {
    id: "dahlia",
    nome: "Dahlia",
    imagem: "/images/trainers/dahlia.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 213,
    stardust: 2516,
    xp: 248,
    ia: "estrategica",
    time: [
      { speciesId: 815, nome: "Cinderace", level: 62 },
      { speciesId: 84, nome: "Doduo", level: 47 },
      { speciesId: 951, nome: "Capsakid", level: 61 },
      { speciesId: 711, nome: "Gourgeist-average", level: 51 },
      { speciesId: 395, nome: "Empoleon", level: 76 },
      { speciesId: 583, nome: "Vanillish", level: 47 }
    ]
  },

  {
    id: "daisy-gen3",
    nome: "Daisy-gen3",
    imagem: "/images/trainers/daisy-gen3.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 919,
    stardust: 3852,
    xp: 380,
    ia: "estrategica",
    time: [
      { speciesId: 973, nome: "Flamigo", level: 80 },
      { speciesId: 318, nome: "Carvanha", level: 13 },
      { speciesId: 931, nome: "Squawkabilly-green-plumage", level: 75 },
      { speciesId: 896, nome: "Glastrier", level: 43 },
      { speciesId: 798, nome: "Kartana", level: 40 },
      { speciesId: 550, nome: "Basculin-red-striped", level: 66 }
    ]
  },

  {
    id: "daisy",
    nome: "Daisy",
    imagem: "/images/trainers/daisy.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 1024,
    stardust: 1768,
    xp: 161,
    ia: "defensiva",
    time: [
      { speciesId: 4, nome: "Charmander", level: 41 },
      { speciesId: 41, nome: "Zubat", level: 61 },
      { speciesId: 650, nome: "Chespin", level: 10 },
      { speciesId: 448, nome: "Lucario", level: 15 },
      { speciesId: 536, nome: "Palpitoad", level: 13 },
      { speciesId: 113, nome: "Chansey", level: 80 }
    ]
  },

  {
    id: "dana",
    nome: "Dana",
    imagem: "/images/trainers/dana.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 2976,
    stardust: 2590,
    xp: 283,
    ia: "defensiva",
    time: [
      { speciesId: 229, nome: "Houndoom", level: 52 },
      { speciesId: 289, nome: "Slaking", level: 56 },
      { speciesId: 159, nome: "Croconaw", level: 56 },
      { speciesId: 293, nome: "Whismur", level: 19 },
      { speciesId: 971, nome: "Greavard", level: 69 },
      { speciesId: 912, nome: "Quaxly", level: 10 }
    ]
  },

  {
    id: "dancer-gen7",
    nome: "Dancer-gen7",
    imagem: "/images/trainers/dancer-gen7.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 2558,
    stardust: 1025,
    xp: 129,
    ia: "defensiva",
    time: [
      { speciesId: 320, nome: "Wailmer", level: 40 },
      { speciesId: 555, nome: "Darmanitan-standard", level: 34 },
      { speciesId: 89, nome: "Muk", level: 31 },
      { speciesId: 71, nome: "Victreebel", level: 33 },
      { speciesId: 8, nome: "Wartortle", level: 40 },
      { speciesId: 923, nome: "Pawmot", level: 78 }
    ]
  },

  {
    id: "dancer-gen8",
    nome: "Dancer-gen8",
    imagem: "/images/trainers/dancer-gen8.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 2085,
    stardust: 1450,
    xp: 204,
    ia: "defensiva",
    time: [
      { speciesId: 946, nome: "Bramblin", level: 28 },
      { speciesId: 970, nome: "Glimmora", level: 20 },
      { speciesId: 103, nome: "Exeggutor", level: 34 },
      { speciesId: 202, nome: "Wobbuffet", level: 69 },
      { speciesId: 749, nome: "Mudbray", level: 34 },
      { speciesId: 763, nome: "Tsareena", level: 25 }
    ]
  },

  {
    id: "dancer",
    nome: "Dancer",
    imagem: "/images/trainers/dancer.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 1743,
    stardust: 452,
    xp: 497,
    ia: "defensiva",
    time: [
      { speciesId: 46, nome: "Paras", level: 55 },
      { speciesId: 200, nome: "Misdreavus", level: 44 },
      { speciesId: 339, nome: "Barboach", level: 33 },
      { speciesId: 316, nome: "Gulpin", level: 75 },
      { speciesId: 642, nome: "Thundurus-incarnate", level: 48 },
      { speciesId: 837, nome: "Rolycoly", level: 30 }
    ]
  },

  {
    id: "darach-caitlin",
    nome: "Darach-caitlin",
    imagem: "/images/trainers/darach-caitlin.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 2980,
    stardust: 4714,
    xp: 183,
    ia: "agressiva",
    time: [
      { speciesId: 802, nome: "Marshadow", level: 50 },
      { speciesId: 358, nome: "Chimecho", level: 53 },
      { speciesId: 323, nome: "Camerupt", level: 13 },
      { speciesId: 425, nome: "Drifloon", level: 33 },
      { speciesId: 205, nome: "Forretress", level: 49 },
      { speciesId: 980, nome: "Clodsire", level: 51 }
    ]
  },

  {
    id: "darach",
    nome: "Darach",
    imagem: "/images/trainers/darach.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 858,
    stardust: 1718,
    xp: 430,
    ia: "agressiva",
    time: [
      { speciesId: 682, nome: "Spritzee", level: 65 },
      { speciesId: 893, nome: "Zarude", level: 30 },
      { speciesId: 535, nome: "Tympole", level: 76 },
      { speciesId: 770, nome: "Palossand", level: 43 },
      { speciesId: 554, nome: "Darumaka", level: 37 },
      { speciesId: 51, nome: "Dugtrio", level: 28 }
    ]
  },

  {
    id: "dawn-contest",
    nome: "Dawn-contest",
    imagem: "/images/trainers/dawn-contest.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 2297,
    stardust: 4615,
    xp: 134,
    ia: "estrategica",
    time: [
      { speciesId: 323, nome: "Camerupt", level: 75 },
      { speciesId: 325, nome: "Spoink", level: 43 },
      { speciesId: 240, nome: "Magby", level: 68 },
      { speciesId: 110, nome: "Weezing", level: 39 },
      { speciesId: 535, nome: "Tympole", level: 24 },
      { speciesId: 599, nome: "Klink", level: 57 }
    ]
  },

  {
    id: "dawn-gen4pt",
    nome: "Dawn-gen4pt",
    imagem: "/images/trainers/dawn-gen4pt.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 1308,
    stardust: 1564,
    xp: 465,
    ia: "defensiva",
    time: [
      { speciesId: 376, nome: "Metagross", level: 28 },
      { speciesId: 258, nome: "Mudkip", level: 73 },
      { speciesId: 267, nome: "Beautifly", level: 64 },
      { speciesId: 634, nome: "Zweilous", level: 53 },
      { speciesId: 788, nome: "Tapu-fini", level: 11 },
      { speciesId: 827, nome: "Nickit", level: 60 }
    ]
  },

  {
    id: "dawn-masters",
    nome: "Dawn-masters",
    imagem: "/images/trainers/dawn-masters.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 1844,
    stardust: 2946,
    xp: 62,
    ia: "defensiva",
    time: [
      { speciesId: 289, nome: "Slaking", level: 12 },
      { speciesId: 260, nome: "Swampert", level: 64 },
      { speciesId: 668, nome: "Pyroar", level: 63 },
      { speciesId: 976, nome: "Veluza", level: 28 },
      { speciesId: 545, nome: "Scolipede", level: 60 },
      { speciesId: 523, nome: "Zebstrika", level: 30 }
    ]
  },

  {
    id: "dawn-masters2",
    nome: "Dawn-masters2",
    imagem: "/images/trainers/dawn-masters2.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 1499,
    stardust: 4396,
    xp: 418,
    ia: "aleatoria",
    time: [
      { speciesId: 800, nome: "Necrozma", level: 61 },
      { speciesId: 718, nome: "Zygarde-50", level: 58 },
      { speciesId: 628, nome: "Braviary", level: 15 },
      { speciesId: 28, nome: "Sandslash", level: 20 },
      { speciesId: 728, nome: "Popplio", level: 17 },
      { speciesId: 701, nome: "Hawlucha", level: 21 }
    ]
  },

  {
    id: "dawn-masters3",
    nome: "Dawn-masters3",
    imagem: "/images/trainers/dawn-masters3.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 1231,
    stardust: 322,
    xp: 50,
    ia: "agressiva",
    time: [
      { speciesId: 583, nome: "Vanillish", level: 44 },
      { speciesId: 931, nome: "Squawkabilly-green-plumage", level: 79 },
      { speciesId: 114, nome: "Tangela", level: 51 },
      { speciesId: 580, nome: "Ducklett", level: 69 },
      { speciesId: 592, nome: "Frillish", level: 33 },
      { speciesId: 557, nome: "Dwebble", level: 74 }
    ]
  },

  {
    id: "dawn",
    nome: "Dawn",
    imagem: "/images/trainers/dawn.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 1371,
    stardust: 3394,
    xp: 79,
    ia: "defensiva",
    time: [
      { speciesId: 35, nome: "Clefairy", level: 69 },
      { speciesId: 67, nome: "Machoke", level: 26 },
      { speciesId: 695, nome: "Heliolisk", level: 22 },
      { speciesId: 700, nome: "Sylveon", level: 48 },
      { speciesId: 243, nome: "Raikou", level: 36 },
      { speciesId: 276, nome: "Taillow", level: 28 }
    ]
  },

  {
    id: "delinquent-gen9",
    nome: "Delinquent-gen9",
    imagem: "/images/trainers/delinquent-gen9.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 1562,
    stardust: 329,
    xp: 287,
    ia: "agressiva",
    time: [
      { speciesId: 113, nome: "Chansey", level: 56 },
      { speciesId: 125, nome: "Electabuzz", level: 49 },
      { speciesId: 983, nome: "Kingambit", level: 16 },
      { speciesId: 649, nome: "Genesect", level: 37 },
      { speciesId: 592, nome: "Frillish", level: 11 },
      { speciesId: 739, nome: "Crabrawler", level: 48 }
    ]
  },

  {
    id: "delinquent",
    nome: "Delinquent",
    imagem: "/images/trainers/delinquent.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 1055,
    stardust: 4195,
    xp: 72,
    ia: "defensiva",
    time: [
      { speciesId: 964, nome: "Palafin-zero", level: 67 },
      { speciesId: 113, nome: "Chansey", level: 47 },
      { speciesId: 770, nome: "Palossand", level: 75 },
      { speciesId: 276, nome: "Taillow", level: 49 },
      { speciesId: 648, nome: "Meloetta-aria", level: 76 },
      { speciesId: 925, nome: "Maushold-family-of-four", level: 14 }
    ]
  },

  {
    id: "delinquentf-gen9",
    nome: "Delinquentf-gen9",
    imagem: "/images/trainers/delinquentf-gen9.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 1161,
    stardust: 5302,
    xp: 116,
    ia: "agressiva",
    time: [
      { speciesId: 381, nome: "Latios", level: 10 },
      { speciesId: 733, nome: "Toucannon", level: 62 },
      { speciesId: 65, nome: "Alakazam", level: 25 },
      { speciesId: 382, nome: "Kyogre", level: 54 },
      { speciesId: 400, nome: "Bibarel", level: 35 },
      { speciesId: 707, nome: "Klefki", level: 43 }
    ]
  },

  {
    id: "delinquentf2-gen9",
    nome: "Delinquentf2-gen9",
    imagem: "/images/trainers/delinquentf2-gen9.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 458,
    stardust: 4613,
    xp: 120,
    ia: "aleatoria",
    time: [
      { speciesId: 976, nome: "Veluza", level: 73 },
      { speciesId: 377, nome: "Regirock", level: 17 },
      { speciesId: 395, nome: "Empoleon", level: 18 },
      { speciesId: 735, nome: "Gumshoos", level: 77 },
      { speciesId: 561, nome: "Sigilyph", level: 66 },
      { speciesId: 527, nome: "Woobat", level: 69 }
    ]
  },

  {
    id: "dendra",
    nome: "Dendra",
    imagem: "/images/trainers/dendra.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 2414,
    stardust: 604,
    xp: 289,
    ia: "estrategica",
    time: [
      { speciesId: 238, nome: "Smoochum", level: 21 },
      { speciesId: 999, nome: "Gimmighoul", level: 69 },
      { speciesId: 467, nome: "Magmortar", level: 41 },
      { speciesId: 331, nome: "Cacnea", level: 28 },
      { speciesId: 704, nome: "Goomy", level: 53 },
      { speciesId: 536, nome: "Palpitoad", level: 47 }
    ]
  },

  {
    id: "depotagent",
    nome: "Depotagent",
    imagem: "/images/trainers/depotagent.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 1822,
    stardust: 1195,
    xp: 243,
    ia: "aleatoria",
    time: [
      { speciesId: 660, nome: "Diggersby", level: 10 },
      { speciesId: 916, nome: "Oinkologne-male", level: 79 },
      { speciesId: 102, nome: "Exeggcute", level: 41 },
      { speciesId: 811, nome: "Thwackey", level: 53 },
      { speciesId: 736, nome: "Grubbin", level: 69 },
      { speciesId: 825, nome: "Dottler", level: 66 }
    ]
  },

  {
    id: "dexio-gen6",
    nome: "Dexio-gen6",
    imagem: "/images/trainers/dexio-gen6.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 2408,
    stardust: 4686,
    xp: 369,
    ia: "aleatoria",
    time: [
      { speciesId: 153, nome: "Bayleef", level: 24 },
      { speciesId: 142, nome: "Aerodactyl", level: 79 },
      { speciesId: 178, nome: "Xatu", level: 65 },
      { speciesId: 963, nome: "Finizen", level: 77 },
      { speciesId: 497, nome: "Serperior", level: 23 },
      { speciesId: 370, nome: "Luvdisc", level: 57 }
    ]
  },

  {
    id: "dexio",
    nome: "Dexio",
    imagem: "/images/trainers/dexio.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 717,
    stardust: 3603,
    xp: 386,
    ia: "agressiva",
    time: [
      { speciesId: 539, nome: "Sawk", level: 15 },
      { speciesId: 918, nome: "Spidops", level: 61 },
      { speciesId: 628, nome: "Braviary", level: 57 },
      { speciesId: 735, nome: "Gumshoos", level: 17 },
      { speciesId: 606, nome: "Beheeyem", level: 66 },
      { speciesId: 31, nome: "Nidoqueen", level: 10 }
    ]
  },

  {
    id: "diamondclanmember",
    nome: "Diamondclanmember",
    imagem: "/images/trainers/diamondclanmember.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 2831,
    stardust: 1876,
    xp: 95,
    ia: "aleatoria",
    time: [
      { speciesId: 720, nome: "Hoopa", level: 40 },
      { speciesId: 593, nome: "Jellicent", level: 65 },
      { speciesId: 307, nome: "Meditite", level: 33 },
      { speciesId: 410, nome: "Shieldon", level: 39 },
      { speciesId: 721, nome: "Volcanion", level: 70 },
      { speciesId: 156, nome: "Quilava", level: 66 }
    ]
  },

  {
    id: "diantha-masters",
    nome: "Diantha-masters",
    imagem: "/images/trainers/diantha-masters.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 1063,
    stardust: 3754,
    xp: 159,
    ia: "aleatoria",
    time: [
      { speciesId: 166, nome: "Ledian", level: 74 },
      { speciesId: 661, nome: "Fletchling", level: 45 },
      { speciesId: 688, nome: "Binacle", level: 39 },
      { speciesId: 498, nome: "Tepig", level: 57 },
      { speciesId: 10, nome: "Caterpie", level: 26 },
      { speciesId: 722, nome: "Rowlet", level: 64 }
    ]
  },

  {
    id: "diantha-masters2",
    nome: "Diantha-masters2",
    imagem: "/images/trainers/diantha-masters2.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 1742,
    stardust: 2276,
    xp: 282,
    ia: "aleatoria",
    time: [
      { speciesId: 464, nome: "Rhyperior", level: 66 },
      { speciesId: 430, nome: "Honchkrow", level: 64 },
      { speciesId: 933, nome: "Naclstack", level: 59 },
      { speciesId: 861, nome: "Grimmsnarl", level: 70 },
      { speciesId: 120, nome: "Staryu", level: 28 },
      { speciesId: 103, nome: "Exeggutor", level: 62 }
    ]
  },

  {
    id: "diantha",
    nome: "Diantha",
    imagem: "/images/trainers/diantha.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 1842,
    stardust: 1254,
    xp: 61,
    ia: "aleatoria",
    time: [
      { speciesId: 65, nome: "Alakazam", level: 64 },
      { speciesId: 356, nome: "Dusclops", level: 75 },
      { speciesId: 1024, nome: "Terapagos", level: 73 },
      { speciesId: 766, nome: "Passimian", level: 53 },
      { speciesId: 966, nome: "Revavroom", level: 45 },
      { speciesId: 141, nome: "Kabutops", level: 66 }
    ]
  },

  {
    id: "doctor-gen8",
    nome: "Doctor-gen8",
    imagem: "/images/trainers/doctor-gen8.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 1794,
    stardust: 1166,
    xp: 61,
    ia: "aleatoria",
    time: [
      { speciesId: 666, nome: "Vivillon", level: 37 },
      { speciesId: 188, nome: "Skiploom", level: 28 },
      { speciesId: 131, nome: "Lapras", level: 80 },
      { speciesId: 350, nome: "Milotic", level: 27 },
      { speciesId: 592, nome: "Frillish", level: 74 },
      { speciesId: 558, nome: "Crustle", level: 63 }
    ]
  },

  {
    id: "doctor",
    nome: "Doctor",
    imagem: "/images/trainers/doctor.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 2987,
    stardust: 3895,
    xp: 455,
    ia: "estrategica",
    time: [
      { speciesId: 769, nome: "Sandygast", level: 79 },
      { speciesId: 336, nome: "Seviper", level: 68 },
      { speciesId: 261, nome: "Poochyena", level: 35 },
      { speciesId: 11, nome: "Metapod", level: 68 },
      { speciesId: 487, nome: "Giratina-altered", level: 68 },
      { speciesId: 517, nome: "Munna", level: 14 }
    ]
  },

  {
    id: "doctorf-gen8",
    nome: "Doctorf-gen8",
    imagem: "/images/trainers/doctorf-gen8.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 2173,
    stardust: 3887,
    xp: 433,
    ia: "agressiva",
    time: [
      { speciesId: 600, nome: "Klang", level: 11 },
      { speciesId: 92, nome: "Gastly", level: 63 },
      { speciesId: 596, nome: "Galvantula", level: 75 },
      { speciesId: 7, nome: "Squirtle", level: 80 },
      { speciesId: 64, nome: "Kadabra", level: 61 },
      { speciesId: 584, nome: "Vanilluxe", level: 44 }
    ]
  },

  {
    id: "doubleteam",
    nome: "Doubleteam",
    imagem: "/images/trainers/doubleteam.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 1930,
    stardust: 2830,
    xp: 359,
    ia: "aleatoria",
    time: [
      { speciesId: 437, nome: "Bronzong", level: 20 },
      { speciesId: 164, nome: "Noctowl", level: 33 },
      { speciesId: 902, nome: "Basculegion-male", level: 23 },
      { speciesId: 600, nome: "Klang", level: 56 },
      { speciesId: 224, nome: "Octillery", level: 74 },
      { speciesId: 798, nome: "Kartana", level: 33 }
    ]
  },

  {
    id: "dragontamer-gen3",
    nome: "Dragontamer-gen3",
    imagem: "/images/trainers/dragontamer-gen3.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 245,
    stardust: 873,
    xp: 295,
    ia: "aleatoria",
    time: [
      { speciesId: 541, nome: "Swadloon", level: 54 },
      { speciesId: 390, nome: "Chimchar", level: 63 },
      { speciesId: 623, nome: "Golurk", level: 46 },
      { speciesId: 323, nome: "Camerupt", level: 68 },
      { speciesId: 55, nome: "Golduck", level: 16 },
      { speciesId: 218, nome: "Slugma", level: 69 }
    ]
  },

  {
    id: "dragontamer-gen6",
    nome: "Dragontamer-gen6",
    imagem: "/images/trainers/dragontamer-gen6.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 2238,
    stardust: 534,
    xp: 219,
    ia: "agressiva",
    time: [
      { speciesId: 632, nome: "Durant", level: 51 },
      { speciesId: 563, nome: "Cofagrigus", level: 78 },
      { speciesId: 836, nome: "Boltund", level: 50 },
      { speciesId: 283, nome: "Surskit", level: 33 },
      { speciesId: 430, nome: "Honchkrow", level: 58 },
      { speciesId: 872, nome: "Snom", level: 70 }
    ]
  },

  {
    id: "dragontamer-gen9",
    nome: "Dragontamer-gen9",
    imagem: "/images/trainers/dragontamer-gen9.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 945,
    stardust: 2858,
    xp: 365,
    ia: "agressiva",
    time: [
      { speciesId: 452, nome: "Drapion", level: 39 },
      { speciesId: 447, nome: "Riolu", level: 80 },
      { speciesId: 393, nome: "Piplup", level: 11 },
      { speciesId: 253, nome: "Grovyle", level: 29 },
      { speciesId: 128, nome: "Tauros", level: 69 },
      { speciesId: 842, nome: "Appletun", level: 78 }
    ]
  },

  {
    id: "dragontamer",
    nome: "Dragontamer",
    imagem: "/images/trainers/dragontamer.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 2672,
    stardust: 5158,
    xp: 409,
    ia: "defensiva",
    time: [
      { speciesId: 30, nome: "Nidorina", level: 25 },
      { speciesId: 427, nome: "Buneary", level: 70 },
      { speciesId: 49, nome: "Venomoth", level: 15 },
      { speciesId: 827, nome: "Nickit", level: 43 },
      { speciesId: 72, nome: "Tentacool", level: 47 },
      { speciesId: 89, nome: "Muk", level: 25 }
    ]
  },

  {
    id: "drake-gen3",
    nome: "Drake-gen3",
    imagem: "/images/trainers/drake-gen3.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 454,
    stardust: 1051,
    xp: 454,
    ia: "aleatoria",
    time: [
      { speciesId: 578, nome: "Duosion", level: 64 },
      { speciesId: 73, nome: "Tentacruel", level: 63 },
      { speciesId: 568, nome: "Trubbish", level: 73 },
      { speciesId: 31, nome: "Nidoqueen", level: 53 },
      { speciesId: 173, nome: "Cleffa", level: 49 },
      { speciesId: 599, nome: "Klink", level: 55 }
    ]
  },

  {
    id: "drasna",
    nome: "Drasna",
    imagem: "/images/trainers/drasna.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 1193,
    stardust: 159,
    xp: 496,
    ia: "estrategica",
    time: [
      { speciesId: 1016, nome: "Fezandipiti", level: 50 },
      { speciesId: 925, nome: "Maushold-family-of-four", level: 38 },
      { speciesId: 812, nome: "Rillaboom", level: 43 },
      { speciesId: 179, nome: "Mareep", level: 71 },
      { speciesId: 496, nome: "Servine", level: 63 },
      { speciesId: 661, nome: "Fletchling", level: 51 }
    ]
  },

  {
    id: "drayden",
    nome: "Drayden",
    imagem: "/images/trainers/drayden.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 904,
    stardust: 4963,
    xp: 62,
    ia: "aleatoria",
    time: [
      { speciesId: 128, nome: "Tauros", level: 38 },
      { speciesId: 711, nome: "Gourgeist-average", level: 41 },
      { speciesId: 78, nome: "Rapidash", level: 11 },
      { speciesId: 115, nome: "Kangaskhan", level: 27 },
      { speciesId: 698, nome: "Amaura", level: 73 },
      { speciesId: 521, nome: "Unfezant", level: 69 }
    ]
  },

  {
    id: "drayton",
    nome: "Drayton",
    imagem: "/images/trainers/drayton.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 1140,
    stardust: 3973,
    xp: 120,
    ia: "aleatoria",
    time: [
      { speciesId: 765, nome: "Oranguru", level: 44 },
      { speciesId: 821, nome: "Rookidee", level: 50 },
      { speciesId: 711, nome: "Gourgeist-average", level: 64 },
      { speciesId: 86, nome: "Seel", level: 31 },
      { speciesId: 117, nome: "Seadra", level: 32 },
      { speciesId: 973, nome: "Flamigo", level: 60 }
    ]
  },

  {
    id: "dulse",
    nome: "Dulse",
    imagem: "/images/trainers/dulse.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 1953,
    stardust: 599,
    xp: 370,
    ia: "estrategica",
    time: [
      { speciesId: 376, nome: "Metagross", level: 74 },
      { speciesId: 670, nome: "Floette", level: 54 },
      { speciesId: 144, nome: "Articuno", level: 53 },
      { speciesId: 185, nome: "Sudowoodo", level: 75 },
      { speciesId: 556, nome: "Maractus", level: 58 },
      { speciesId: 661, nome: "Fletchling", level: 33 }
    ]
  },

  {
    id: "elaine",
    nome: "Elaine",
    imagem: "/images/trainers/elaine.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 1632,
    stardust: 4912,
    xp: 288,
    ia: "estrategica",
    time: [
      { speciesId: 92, nome: "Gastly", level: 59 },
      { speciesId: 552, nome: "Krokorok", level: 77 },
      { speciesId: 242, nome: "Blissey", level: 69 },
      { speciesId: 476, nome: "Probopass", level: 11 },
      { speciesId: 619, nome: "Mienfoo", level: 76 },
      { speciesId: 38, nome: "Ninetales", level: 58 }
    ]
  },

  {
    id: "elesa-gen5bw2",
    nome: "Elesa-gen5bw2",
    imagem: "/images/trainers/elesa-gen5bw2.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 2132,
    stardust: 5308,
    xp: 103,
    ia: "defensiva",
    time: [
      { speciesId: 551, nome: "Sandile", level: 45 },
      { speciesId: 403, nome: "Shinx", level: 47 },
      { speciesId: 159, nome: "Croconaw", level: 15 },
      { speciesId: 313, nome: "Volbeat", level: 46 },
      { speciesId: 213, nome: "Shuckle", level: 39 },
      { speciesId: 630, nome: "Mandibuzz", level: 51 }
    ]
  },

  {
    id: "elesa-masters",
    nome: "Elesa-masters",
    imagem: "/images/trainers/elesa-masters.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 1933,
    stardust: 3977,
    xp: 263,
    ia: "aleatoria",
    time: [
      { speciesId: 913, nome: "Quaxwell", level: 60 },
      { speciesId: 236, nome: "Tyrogue", level: 28 },
      { speciesId: 765, nome: "Oranguru", level: 33 },
      { speciesId: 247, nome: "Pupitar", level: 28 },
      { speciesId: 132, nome: "Ditto", level: 79 },
      { speciesId: 275, nome: "Shiftry", level: 32 }
    ]
  },

  {
    id: "elesa-masters2",
    nome: "Elesa-masters2",
    imagem: "/images/trainers/elesa-masters2.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 2864,
    stardust: 824,
    xp: 310,
    ia: "aleatoria",
    time: [
      { speciesId: 345, nome: "Lileep", level: 31 },
      { speciesId: 41, nome: "Zubat", level: 23 },
      { speciesId: 896, nome: "Glastrier", level: 24 },
      { speciesId: 226, nome: "Mantine", level: 56 },
      { speciesId: 364, nome: "Sealeo", level: 61 },
      { speciesId: 529, nome: "Drilbur", level: 34 }
    ]
  },

  {
    id: "elesa-masters3",
    nome: "Elesa-masters3",
    imagem: "/images/trainers/elesa-masters3.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 2386,
    stardust: 1222,
    xp: 482,
    ia: "estrategica",
    time: [
      { speciesId: 811, nome: "Thwackey", level: 68 },
      { speciesId: 58, nome: "Growlithe", level: 18 },
      { speciesId: 545, nome: "Scolipede", level: 15 },
      { speciesId: 842, nome: "Appletun", level: 23 },
      { speciesId: 777, nome: "Togedemaru", level: 23 },
      { speciesId: 123, nome: "Scyther", level: 48 }
    ]
  },

  {
    id: "elesa",
    nome: "Elesa",
    imagem: "/images/trainers/elesa.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 737,
    stardust: 3069,
    xp: 412,
    ia: "agressiva",
    time: [
      { speciesId: 96, nome: "Drowzee", level: 58 },
      { speciesId: 375, nome: "Metang", level: 65 },
      { speciesId: 387, nome: "Turtwig", level: 17 },
      { speciesId: 801, nome: "Magearna", level: 71 },
      { speciesId: 950, nome: "Klawf", level: 78 },
      { speciesId: 182, nome: "Bellossom", level: 39 }
    ]
  },

  {
    id: "elio-masters",
    nome: "Elio-masters",
    imagem: "/images/trainers/elio-masters.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 2740,
    stardust: 5347,
    xp: 134,
    ia: "aleatoria",
    time: [
      { speciesId: 231, nome: "Phanpy", level: 41 },
      { speciesId: 244, nome: "Entei", level: 31 },
      { speciesId: 919, nome: "Nymble", level: 21 },
      { speciesId: 43, nome: "Oddish", level: 74 },
      { speciesId: 864, nome: "Cursola", level: 79 },
      { speciesId: 642, nome: "Thundurus-incarnate", level: 21 }
    ]
  },

  {
    id: "elio-usum",
    nome: "Elio-usum",
    imagem: "/images/trainers/elio-usum.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 2660,
    stardust: 302,
    xp: 332,
    ia: "agressiva",
    time: [
      { speciesId: 816, nome: "Sobble", level: 57 },
      { speciesId: 822, nome: "Corvisquire", level: 67 },
      { speciesId: 858, nome: "Hatterene", level: 43 },
      { speciesId: 365, nome: "Walrein", level: 76 },
      { speciesId: 553, nome: "Krookodile", level: 69 },
      { speciesId: 272, nome: "Ludicolo", level: 70 }
    ]
  },

  {
    id: "elio",
    nome: "Elio",
    imagem: "/images/trainers/elio.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 453,
    stardust: 4835,
    xp: 208,
    ia: "aleatoria",
    time: [
      { speciesId: 984, nome: "Great-tusk", level: 29 },
      { speciesId: 443, nome: "Gible", level: 40 },
      { speciesId: 210, nome: "Granbull", level: 80 },
      { speciesId: 130, nome: "Gyarados", level: 40 },
      { speciesId: 193, nome: "Yanma", level: 40 },
      { speciesId: 737, nome: "Charjabug", level: 54 }
    ]
  },

  {
    id: "elm",
    nome: "Elm",
    imagem: "/images/trainers/elm.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 142,
    stardust: 3438,
    xp: 289,
    ia: "defensiva",
    time: [
      { speciesId: 954, nome: "Rabsca", level: 66 },
      { speciesId: 662, nome: "Fletchinder", level: 18 },
      { speciesId: 250, nome: "Ho-oh", level: 74 },
      { speciesId: 878, nome: "Cufant", level: 65 },
      { speciesId: 513, nome: "Pansear", level: 32 },
      { speciesId: 1016, nome: "Fezandipiti", level: 58 }
    ]
  },

  {
    id: "emma-lza",
    nome: "Emma-lza",
    imagem: "/images/trainers/emma-lza.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 859,
    stardust: 3792,
    xp: 398,
    ia: "estrategica",
    time: [
      { speciesId: 374, nome: "Beldum", level: 51 },
      { speciesId: 452, nome: "Drapion", level: 34 },
      { speciesId: 519, nome: "Pidove", level: 51 },
      { speciesId: 847, nome: "Barraskewda", level: 66 },
      { speciesId: 805, nome: "Stakataka", level: 16 },
      { speciesId: 38, nome: "Ninetales", level: 24 }
    ]
  },

  {
    id: "emma",
    nome: "Emma",
    imagem: "/images/trainers/emma.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 1233,
    stardust: 702,
    xp: 357,
    ia: "agressiva",
    time: [
      { speciesId: 733, nome: "Toucannon", level: 32 },
      { speciesId: 104, nome: "Cubone", level: 54 },
      { speciesId: 959, nome: "Tinkaton", level: 38 },
      { speciesId: 148, nome: "Dragonair", level: 34 },
      { speciesId: 917, nome: "Tarountula", level: 55 },
      { speciesId: 734, nome: "Yungoos", level: 13 }
    ]
  },

  {
    id: "emmet-masters",
    nome: "Emmet-masters",
    imagem: "/images/trainers/emmet-masters.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 211,
    stardust: 4562,
    xp: 483,
    ia: "defensiva",
    time: [
      { speciesId: 229, nome: "Houndoom", level: 58 },
      { speciesId: 157, nome: "Typhlosion", level: 59 },
      { speciesId: 1017, nome: "Ogerpon", level: 47 },
      { speciesId: 358, nome: "Chimecho", level: 20 },
      { speciesId: 238, nome: "Smoochum", level: 24 },
      { speciesId: 72, nome: "Tentacool", level: 19 }
    ]
  },

  {
    id: "emmet",
    nome: "Emmet",
    imagem: "/images/trainers/emmet.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "dificil",
    recompensa: 202,
    stardust: 1686,
    xp: 228,
    ia: "agressiva",
    time: [
      { speciesId: 392, nome: "Infernape", level: 41 },
      { speciesId: 691, nome: "Dragalge", level: 10 },
      { speciesId: 44, nome: "Gloom", level: 32 },
      { speciesId: 64, nome: "Kadabra", level: 56 },
      { speciesId: 933, nome: "Naclstack", level: 27 },
      { speciesId: 903, nome: "Sneasler", level: 42 }
    ]
  },

  {
    id: "engineer-gen1",
    nome: "Engineer-gen1",
    imagem: "/images/trainers/engineer-gen1.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 2221,
    stardust: 3527,
    xp: 79,
    ia: "defensiva",
    time: [
      { speciesId: 660, nome: "Diggersby", level: 26 },
      { speciesId: 191, nome: "Sunkern", level: 31 },
      { speciesId: 657, nome: "Frogadier", level: 23 },
      { speciesId: 969, nome: "Glimmet", level: 56 },
      { speciesId: 989, nome: "Sandy-shocks", level: 28 },
      { speciesId: 205, nome: "Forretress", level: 69 }
    ]
  },

  {
    id: "engineer-gen1rb",
    nome: "Engineer-gen1rb",
    imagem: "/images/trainers/engineer-gen1rb.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 140,
    stardust: 3853,
    xp: 275,
    ia: "defensiva",
    time: [
      { speciesId: 682, nome: "Spritzee", level: 19 },
      { speciesId: 1020, nome: "Gouging-fire", level: 43 },
      { speciesId: 459, nome: "Snover", level: 36 },
      { speciesId: 468, nome: "Togekiss", level: 70 },
      { speciesId: 293, nome: "Whismur", level: 76 },
      { speciesId: 524, nome: "Roggenrola", level: 52 }
    ]
  },

  {
    id: "engineer-gen3",
    nome: "Engineer-gen3",
    imagem: "/images/trainers/engineer-gen3.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 958,
    stardust: 763,
    xp: 264,
    ia: "aleatoria",
    time: [
      { speciesId: 405, nome: "Luxray", level: 59 },
      { speciesId: 367, nome: "Huntail", level: 17 },
      { speciesId: 183, nome: "Marill", level: 39 },
      { speciesId: 721, nome: "Volcanion", level: 68 },
      { speciesId: 711, nome: "Gourgeist-average", level: 44 },
      { speciesId: 905, nome: "Enamorus-incarnate", level: 76 }
    ]
  },

  {
    id: "erbie-unite",
    nome: "Erbie-unite",
    imagem: "/images/trainers/erbie-unite.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 1178,
    stardust: 5165,
    xp: 314,
    ia: "estrategica",
    time: [
      { speciesId: 676, nome: "Furfrou", level: 76 },
      { speciesId: 185, nome: "Sudowoodo", level: 29 },
      { speciesId: 95, nome: "Onix", level: 51 },
      { speciesId: 383, nome: "Groudon", level: 45 },
      { speciesId: 722, nome: "Rowlet", level: 10 },
      { speciesId: 738, nome: "Vikavolt", level: 65 }
    ]
  },

  {
    id: "eri",
    nome: "Eri",
    imagem: "/images/trainers/eri.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 945,
    stardust: 3963,
    xp: 208,
    ia: "defensiva",
    time: [
      { speciesId: 271, nome: "Lombre", level: 46 },
      { speciesId: 549, nome: "Lilligant", level: 33 },
      { speciesId: 677, nome: "Espurr", level: 15 },
      { speciesId: 238, nome: "Smoochum", level: 51 },
      { speciesId: 484, nome: "Palkia", level: 68 },
      { speciesId: 566, nome: "Archen", level: 33 }
    ]
  },

  {
    id: "erika-gen1",
    nome: "Erika-gen1",
    imagem: "/images/trainers/erika-gen1.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 2277,
    stardust: 4268,
    xp: 82,
    ia: "agressiva",
    time: [
      { speciesId: 60, nome: "Poliwag", level: 16 },
      { speciesId: 753, nome: "Fomantis", level: 44 },
      { speciesId: 691, nome: "Dragalge", level: 20 },
      { speciesId: 623, nome: "Golurk", level: 70 },
      { speciesId: 679, nome: "Honedge", level: 30 },
      { speciesId: 263, nome: "Zigzagoon", level: 16 }
    ]
  },

  {
    id: "erika-gen1rb",
    nome: "Erika-gen1rb",
    imagem: "/images/trainers/erika-gen1rb.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 1584,
    stardust: 2006,
    xp: 424,
    ia: "defensiva",
    time: [
      { speciesId: 661, nome: "Fletchling", level: 69 },
      { speciesId: 513, nome: "Pansear", level: 38 },
      { speciesId: 475, nome: "Gallade", level: 21 },
      { speciesId: 173, nome: "Cleffa", level: 22 },
      { speciesId: 908, nome: "Meowscarada", level: 63 },
      { speciesId: 384, nome: "Rayquaza", level: 20 }
    ]
  },

  {
    id: "erika-gen2",
    nome: "Erika-gen2",
    imagem: "/images/trainers/erika-gen2.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 292,
    stardust: 1370,
    xp: 291,
    ia: "defensiva",
    time: [
      { speciesId: 807, nome: "Zeraora", level: 76 },
      { speciesId: 584, nome: "Vanilluxe", level: 47 },
      { speciesId: 94, nome: "Gengar", level: 14 },
      { speciesId: 432, nome: "Purugly", level: 73 },
      { speciesId: 412, nome: "Burmy", level: 48 },
      { speciesId: 998, nome: "Baxcalibur", level: 27 }
    ]
  },

  {
    id: "erika-gen3",
    nome: "Erika-gen3",
    imagem: "/images/trainers/erika-gen3.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 1907,
    stardust: 4606,
    xp: 455,
    ia: "estrategica",
    time: [
      { speciesId: 261, nome: "Poochyena", level: 10 },
      { speciesId: 431, nome: "Glameow", level: 55 },
      { speciesId: 72, nome: "Tentacool", level: 14 },
      { speciesId: 949, nome: "Toedscruel", level: 66 },
      { speciesId: 952, nome: "Scovillain", level: 53 },
      { speciesId: 666, nome: "Vivillon", level: 78 }
    ]
  },

  {
    id: "erika-lgpe",
    nome: "Erika-lgpe",
    imagem: "/images/trainers/erika-lgpe.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 322,
    stardust: 3232,
    xp: 63,
    ia: "aleatoria",
    time: [
      { speciesId: 622, nome: "Golett", level: 23 },
      { speciesId: 134, nome: "Vaporeon", level: 11 },
      { speciesId: 50, nome: "Diglett", level: 14 },
      { speciesId: 69, nome: "Bellsprout", level: 47 },
      { speciesId: 155, nome: "Cyndaquil", level: 42 },
      { speciesId: 387, nome: "Turtwig", level: 68 }
    ]
  },

  {
    id: "erika-masters",
    nome: "Erika-masters",
    imagem: "/images/trainers/erika-masters.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 2684,
    stardust: 1279,
    xp: 376,
    ia: "agressiva",
    time: [
      { speciesId: 744, nome: "Rockruff", level: 75 },
      { speciesId: 918, nome: "Spidops", level: 12 },
      { speciesId: 407, nome: "Roserade", level: 28 },
      { speciesId: 34, nome: "Nidoking", level: 10 },
      { speciesId: 146, nome: "Moltres", level: 39 },
      { speciesId: 892, nome: "Urshifu-single-strike", level: 39 }
    ]
  },

  {
    id: "erika-masters2",
    nome: "Erika-masters2",
    imagem: "/images/trainers/erika-masters2.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 1430,
    stardust: 2057,
    xp: 272,
    ia: "estrategica",
    time: [
      { speciesId: 49, nome: "Venomoth", level: 27 },
      { speciesId: 488, nome: "Cresselia", level: 33 },
      { speciesId: 747, nome: "Mareanie", level: 29 },
      { speciesId: 739, nome: "Crabrawler", level: 51 },
      { speciesId: 608, nome: "Lampent", level: 20 },
      { speciesId: 84, nome: "Doduo", level: 17 }
    ]
  },

  {
    id: "erika-masters3",
    nome: "Erika-masters3",
    imagem: "/images/trainers/erika-masters3.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 1832,
    stardust: 4994,
    xp: 424,
    ia: "defensiva",
    time: [
      { speciesId: 193, nome: "Yanma", level: 11 },
      { speciesId: 257, nome: "Blaziken", level: 18 },
      { speciesId: 425, nome: "Drifloon", level: 23 },
      { speciesId: 954, nome: "Rabsca", level: 40 },
      { speciesId: 472, nome: "Gliscor", level: 54 },
      { speciesId: 45, nome: "Vileplume", level: 17 }
    ]
  },

  {
    id: "erika",
    nome: "Erika",
    imagem: "/images/trainers/erika.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 2399,
    stardust: 338,
    xp: 127,
    ia: "estrategica",
    time: [
      { speciesId: 455, nome: "Carnivine", level: 28 },
      { speciesId: 523, nome: "Zebstrika", level: 35 },
      { speciesId: 700, nome: "Sylveon", level: 30 },
      { speciesId: 193, nome: "Yanma", level: 28 },
      { speciesId: 675, nome: "Pangoro", level: 55 },
      { speciesId: 69, nome: "Bellsprout", level: 39 }
    ]
  },

  {
    id: "essentia",
    nome: "Essentia",
    imagem: "/images/trainers/essentia.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 1569,
    stardust: 4942,
    xp: 51,
    ia: "defensiva",
    time: [
      { speciesId: 184, nome: "Azumarill", level: 80 },
      { speciesId: 678, nome: "Meowstic-male", level: 19 },
      { speciesId: 318, nome: "Carvanha", level: 47 },
      { speciesId: 166, nome: "Ledian", level: 16 },
      { speciesId: 232, nome: "Donphan", level: 59 },
      { speciesId: 8, nome: "Wartortle", level: 11 }
    ]
  },

  {
    id: "ethan-gen2",
    nome: "Ethan-gen2",
    imagem: "/images/trainers/ethan-gen2.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 167,
    stardust: 1090,
    xp: 298,
    ia: "estrategica",
    time: [
      { speciesId: 793, nome: "Nihilego", level: 20 },
      { speciesId: 920, nome: "Lokix", level: 21 },
      { speciesId: 792, nome: "Lunala", level: 74 },
      { speciesId: 632, nome: "Durant", level: 59 },
      { speciesId: 852, nome: "Clobbopus", level: 52 },
      { speciesId: 972, nome: "Houndstone", level: 77 }
    ]
  },

  {
    id: "ethan-gen2c",
    nome: "Ethan-gen2c",
    imagem: "/images/trainers/ethan-gen2c.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 125,
    stardust: 5318,
    xp: 268,
    ia: "agressiva",
    time: [
      { speciesId: 139, nome: "Omastar", level: 42 },
      { speciesId: 578, nome: "Duosion", level: 31 },
      { speciesId: 465, nome: "Tangrowth", level: 35 },
      { speciesId: 521, nome: "Unfezant", level: 26 },
      { speciesId: 213, nome: "Shuckle", level: 35 },
      { speciesId: 817, nome: "Drizzile", level: 37 }
    ]
  },

  {
    id: "ethan-masters",
    nome: "Ethan-masters",
    imagem: "/images/trainers/ethan-masters.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 1926,
    stardust: 1697,
    xp: 260,
    ia: "defensiva",
    time: [
      { speciesId: 580, nome: "Ducklett", level: 66 },
      { speciesId: 20, nome: "Raticate", level: 24 },
      { speciesId: 412, nome: "Burmy", level: 10 },
      { speciesId: 448, nome: "Lucario", level: 72 },
      { speciesId: 686, nome: "Inkay", level: 53 },
      { speciesId: 181, nome: "Ampharos", level: 20 }
    ]
  },

  {
    id: "ethan-pokeathlon",
    nome: "Ethan-pokeathlon",
    imagem: "/images/trainers/ethan-pokeathlon.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 1701,
    stardust: 1551,
    xp: 310,
    ia: "aleatoria",
    time: [
      { speciesId: 81, nome: "Magnemite", level: 74 },
      { speciesId: 398, nome: "Staraptor", level: 53 },
      { speciesId: 402, nome: "Kricketune", level: 69 },
      { speciesId: 781, nome: "Dhelmise", level: 49 },
      { speciesId: 676, nome: "Furfrou", level: 46 },
      { speciesId: 142, nome: "Aerodactyl", level: 20 }
    ]
  },

  {
    id: "ethan",
    nome: "Ethan",
    imagem: "/images/trainers/ethan.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 1950,
    stardust: 2120,
    xp: 321,
    ia: "aleatoria",
    time: [
      { speciesId: 47, nome: "Parasect", level: 62 },
      { speciesId: 292, nome: "Shedinja", level: 44 },
      { speciesId: 116, nome: "Horsea", level: 70 },
      { speciesId: 569, nome: "Garbodor", level: 70 },
      { speciesId: 1022, nome: "Iron-boulder", level: 28 },
      { speciesId: 690, nome: "Skrelp", level: 26 }
    ]
  },

  {
    id: "eusine-gen2",
    nome: "Eusine-gen2",
    imagem: "/images/trainers/eusine-gen2.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 1734,
    stardust: 4107,
    xp: 139,
    ia: "aleatoria",
    time: [
      { speciesId: 990, nome: "Iron-treads", level: 61 },
      { speciesId: 275, nome: "Shiftry", level: 42 },
      { speciesId: 805, nome: "Stakataka", level: 68 },
      { speciesId: 951, nome: "Capsakid", level: 15 },
      { speciesId: 684, nome: "Swirlix", level: 45 },
      { speciesId: 238, nome: "Smoochum", level: 59 }
    ]
  },

  {
    id: "eusine",
    nome: "Eusine",
    imagem: "/images/trainers/eusine.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 2338,
    stardust: 486,
    xp: 360,
    ia: "estrategica",
    time: [
      { speciesId: 584, nome: "Vanilluxe", level: 63 },
      { speciesId: 178, nome: "Xatu", level: 64 },
      { speciesId: 191, nome: "Sunkern", level: 59 },
      { speciesId: 627, nome: "Rufflet", level: 40 },
      { speciesId: 221, nome: "Piloswine", level: 15 },
      { speciesId: 251, nome: "Celebi", level: 21 }
    ]
  },

  {
    id: "evelyn",
    nome: "Evelyn",
    imagem: "/images/trainers/evelyn.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 1753,
    stardust: 5154,
    xp: 84,
    ia: "estrategica",
    time: [
      { speciesId: 234, nome: "Stantler", level: 80 },
      { speciesId: 775, nome: "Komala", level: 21 },
      { speciesId: 170, nome: "Chinchou", level: 80 },
      { speciesId: 367, nome: "Huntail", level: 75 },
      { speciesId: 672, nome: "Skiddo", level: 77 },
      { speciesId: 802, nome: "Marshadow", level: 18 }
    ]
  },

  {
    id: "expert-gen3",
    nome: "Expert-gen3",
    imagem: "/images/trainers/expert-gen3.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 762,
    stardust: 1773,
    xp: 105,
    ia: "aleatoria",
    time: [
      { speciesId: 737, nome: "Charjabug", level: 30 },
      { speciesId: 386, nome: "Deoxys-normal", level: 74 },
      { speciesId: 795, nome: "Pheromosa", level: 45 },
      { speciesId: 758, nome: "Salazzle", level: 67 },
      { speciesId: 751, nome: "Dewpider", level: 70 },
      { speciesId: 474, nome: "Porygon-z", level: 22 }
    ]
  },

  {
    id: "expert-gen6",
    nome: "Expert-gen6",
    imagem: "/images/trainers/expert-gen6.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 1031,
    stardust: 1782,
    xp: 474,
    ia: "estrategica",
    time: [
      { speciesId: 948, nome: "Toedscool", level: 55 },
      { speciesId: 319, nome: "Sharpedo", level: 26 },
      { speciesId: 792, nome: "Lunala", level: 16 },
      { speciesId: 825, nome: "Dottler", level: 75 },
      { speciesId: 544, nome: "Whirlipede", level: 11 },
      { speciesId: 676, nome: "Furfrou", level: 50 }
    ]
  },

  {
    id: "expertf-gen3",
    nome: "Expertf-gen3",
    imagem: "/images/trainers/expertf-gen3.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 2049,
    stardust: 946,
    xp: 390,
    ia: "aleatoria",
    time: [
      { speciesId: 702, nome: "Dedenne", level: 59 },
      { speciesId: 544, nome: "Whirlipede", level: 75 },
      { speciesId: 587, nome: "Emolga", level: 32 },
      { speciesId: 486, nome: "Regigigas", level: 34 },
      { speciesId: 812, nome: "Rillaboom", level: 53 },
      { speciesId: 472, nome: "Gliscor", level: 45 }
    ]
  },

  {
    id: "expertf-gen6",
    nome: "Expertf-gen6",
    imagem: "/images/trainers/expertf-gen6.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 2218,
    stardust: 2514,
    xp: 195,
    ia: "agressiva",
    time: [
      { speciesId: 632, nome: "Durant", level: 32 },
      { speciesId: 314, nome: "Illumise", level: 60 },
      { speciesId: 557, nome: "Dwebble", level: 16 },
      { speciesId: 546, nome: "Cottonee", level: 62 },
      { speciesId: 553, nome: "Krookodile", level: 28 },
      { speciesId: 867, nome: "Runerigus", level: 26 }
    ]
  },

  {
    id: "faba",
    nome: "Faba",
    imagem: "/images/trainers/faba.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 1407,
    stardust: 1740,
    xp: 197,
    ia: "estrategica",
    time: [
      { speciesId: 675, nome: "Pangoro", level: 74 },
      { speciesId: 146, nome: "Moltres", level: 53 },
      { speciesId: 80, nome: "Slowbro", level: 11 },
      { speciesId: 19, nome: "Rattata", level: 63 },
      { speciesId: 975, nome: "Cetitan", level: 68 },
      { speciesId: 479, nome: "Rotom", level: 39 }
    ]
  },

  {
    id: "fairytalegirl",
    nome: "Fairytalegirl",
    imagem: "/images/trainers/fairytalegirl.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 1206,
    stardust: 1091,
    xp: 464,
    ia: "estrategica",
    time: [
      { speciesId: 967, nome: "Cyclizar", level: 30 },
      { speciesId: 838, nome: "Carkol", level: 78 },
      { speciesId: 866, nome: "Mr-rime", level: 20 },
      { speciesId: 501, nome: "Oshawott", level: 40 },
      { speciesId: 376, nome: "Metagross", level: 13 },
      { speciesId: 878, nome: "Cufant", level: 46 }
    ]
  },

  {
    id: "falkner-gen2",
    nome: "Falkner-gen2",
    imagem: "/images/trainers/falkner-gen2.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 2530,
    stardust: 3559,
    xp: 228,
    ia: "aleatoria",
    time: [
      { speciesId: 542, nome: "Leavanny", level: 69 },
      { speciesId: 584, nome: "Vanilluxe", level: 11 },
      { speciesId: 139, nome: "Omastar", level: 72 },
      { speciesId: 386, nome: "Deoxys-normal", level: 25 },
      { speciesId: 1009, nome: "Walking-wake", level: 27 },
      { speciesId: 240, nome: "Magby", level: 22 }
    ]
  },

  {
    id: "falkner",
    nome: "Falkner",
    imagem: "/images/trainers/falkner.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 440,
    stardust: 2884,
    xp: 266,
    ia: "agressiva",
    time: [
      { speciesId: 70, nome: "Weepinbell", level: 74 },
      { speciesId: 258, nome: "Mudkip", level: 56 },
      { speciesId: 596, nome: "Galvantula", level: 43 },
      { speciesId: 264, nome: "Linoone", level: 72 },
      { speciesId: 57, nome: "Primeape", level: 69 },
      { speciesId: 520, nome: "Tranquill", level: 44 }
    ]
  },

  {
    id: "fantina",
    nome: "Fantina",
    imagem: "/images/trainers/fantina.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 2679,
    stardust: 748,
    xp: 250,
    ia: "agressiva",
    time: [
      { speciesId: 349, nome: "Feebas", level: 47 },
      { speciesId: 245, nome: "Suicune", level: 74 },
      { speciesId: 309, nome: "Electrike", level: 45 },
      { speciesId: 678, nome: "Meowstic-male", level: 15 },
      { speciesId: 470, nome: "Leafeon", level: 57 },
      { speciesId: 555, nome: "Darmanitan-standard", level: 11 }
    ]
  },

  {
    id: "fennel",
    nome: "Fennel",
    imagem: "/images/trainers/fennel.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 119,
    stardust: 5255,
    xp: 177,
    ia: "agressiva",
    time: [
      { speciesId: 941, nome: "Kilowattrel", level: 41 },
      { speciesId: 193, nome: "Yanma", level: 20 },
      { speciesId: 217, nome: "Ursaring", level: 66 },
      { speciesId: 309, nome: "Electrike", level: 77 },
      { speciesId: 330, nome: "Flygon", level: 14 },
      { speciesId: 542, nome: "Leavanny", level: 45 }
    ]
  },

  {
    id: "firebreather-gen2",
    nome: "Firebreather-gen2",
    imagem: "/images/trainers/firebreather-gen2.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 667,
    stardust: 5306,
    xp: 134,
    ia: "agressiva",
    time: [
      { speciesId: 846, nome: "Arrokuda", level: 73 },
      { speciesId: 377, nome: "Regirock", level: 49 },
      { speciesId: 207, nome: "Gligar", level: 13 },
      { speciesId: 822, nome: "Corvisquire", level: 42 },
      { speciesId: 538, nome: "Throh", level: 78 },
      { speciesId: 875, nome: "Eiscue-ice", level: 71 }
    ]
  },

  {
    id: "firebreather",
    nome: "Firebreather",
    imagem: "/images/trainers/firebreather.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 321,
    stardust: 3381,
    xp: 69,
    ia: "estrategica",
    time: [
      { speciesId: 687, nome: "Malamar", level: 24 },
      { speciesId: 829, nome: "Gossifleur", level: 41 },
      { speciesId: 493, nome: "Arceus", level: 61 },
      { speciesId: 81, nome: "Magnemite", level: 78 },
      { speciesId: 448, nome: "Lucario", level: 21 },
      { speciesId: 420, nome: "Cherubi", level: 33 }
    ]
  },

  {
    id: "firefighter",
    nome: "Firefighter",
    imagem: "/images/trainers/firefighter.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 1526,
    stardust: 500,
    xp: 441,
    ia: "defensiva",
    time: [
      { speciesId: 829, nome: "Gossifleur", level: 58 },
      { speciesId: 180, nome: "Flaaffy", level: 48 },
      { speciesId: 344, nome: "Claydol", level: 63 },
      { speciesId: 926, nome: "Fidough", level: 24 },
      { speciesId: 18, nome: "Pidgeot", level: 23 },
      { speciesId: 966, nome: "Revavroom", level: 67 }
    ]
  },

  {
    id: "fisher-gen8",
    nome: "Fisher-gen8",
    imagem: "/images/trainers/fisher-gen8.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 2985,
    stardust: 5033,
    xp: 413,
    ia: "aleatoria",
    time: [
      { speciesId: 797, nome: "Celesteela", level: 72 },
      { speciesId: 837, nome: "Rolycoly", level: 11 },
      { speciesId: 477, nome: "Dusknoir", level: 39 },
      { speciesId: 987, nome: "Flutter-mane", level: 62 },
      { speciesId: 79, nome: "Slowpoke", level: 68 },
      { speciesId: 808, nome: "Meltan", level: 78 }
    ]
  },

  {
    id: "fisherman-gen1",
    nome: "Fisherman-gen1",
    imagem: "/images/trainers/fisherman-gen1.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 1669,
    stardust: 3506,
    xp: 132,
    ia: "aleatoria",
    time: [
      { speciesId: 513, nome: "Pansear", level: 52 },
      { speciesId: 437, nome: "Bronzong", level: 46 },
      { speciesId: 866, nome: "Mr-rime", level: 22 },
      { speciesId: 495, nome: "Snivy", level: 10 },
      { speciesId: 412, nome: "Burmy", level: 64 },
      { speciesId: 197, nome: "Umbreon", level: 51 }
    ]
  },

  {
    id: "fisherman-gen1rb",
    nome: "Fisherman-gen1rb",
    imagem: "/images/trainers/fisherman-gen1rb.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 1467,
    stardust: 2564,
    xp: 109,
    ia: "estrategica",
    time: [
      { speciesId: 996, nome: "Frigibax", level: 17 },
      { speciesId: 354, nome: "Banette", level: 30 },
      { speciesId: 858, nome: "Hatterene", level: 44 },
      { speciesId: 380, nome: "Latias", level: 60 },
      { speciesId: 126, nome: "Magmar", level: 28 },
      { speciesId: 174, nome: "Igglybuff", level: 71 }
    ]
  },

  {
    id: "fisherman-gen2jp",
    nome: "Fisherman-gen2jp",
    imagem: "/images/trainers/fisherman-gen2jp.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 993,
    stardust: 611,
    xp: 372,
    ia: "defensiva",
    time: [
      { speciesId: 251, nome: "Celebi", level: 24 },
      { speciesId: 31, nome: "Nidoqueen", level: 75 },
      { speciesId: 259, nome: "Marshtomp", level: 14 },
      { speciesId: 28, nome: "Sandslash", level: 67 },
      { speciesId: 50, nome: "Diglett", level: 10 },
      { speciesId: 84, nome: "Doduo", level: 75 }
    ]
  },

  {
    id: "fisherman-gen3",
    nome: "Fisherman-gen3",
    imagem: "/images/trainers/fisherman-gen3.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 1563,
    stardust: 3736,
    xp: 132,
    ia: "estrategica",
    time: [
      { speciesId: 254, nome: "Sceptile", level: 80 },
      { speciesId: 955, nome: "Flittle", level: 37 },
      { speciesId: 27, nome: "Sandshrew", level: 78 },
      { speciesId: 784, nome: "Kommo-o", level: 12 },
      { speciesId: 344, nome: "Claydol", level: 73 },
      { speciesId: 646, nome: "Kyurem", level: 57 }
    ]
  },

  {
    id: "fisherman-gen3rs",
    nome: "Fisherman-gen3rs",
    imagem: "/images/trainers/fisherman-gen3rs.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 2195,
    stardust: 2401,
    xp: 212,
    ia: "agressiva",
    time: [
      { speciesId: 563, nome: "Cofagrigus", level: 73 },
      { speciesId: 475, nome: "Gallade", level: 65 },
      { speciesId: 903, nome: "Sneasler", level: 65 },
      { speciesId: 664, nome: "Scatterbug", level: 11 },
      { speciesId: 833, nome: "Chewtle", level: 30 },
      { speciesId: 339, nome: "Barboach", level: 75 }
    ]
  },

  {
    id: "fisherman-gen4",
    nome: "Fisherman-gen4",
    imagem: "/images/trainers/fisherman-gen4.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 605,
    stardust: 4724,
    xp: 222,
    ia: "aleatoria",
    time: [
      { speciesId: 285, nome: "Shroomish", level: 69 },
      { speciesId: 43, nome: "Oddish", level: 77 },
      { speciesId: 307, nome: "Meditite", level: 37 },
      { speciesId: 45, nome: "Vileplume", level: 38 },
      { speciesId: 713, nome: "Avalugg", level: 28 },
      { speciesId: 164, nome: "Noctowl", level: 55 }
    ]
  },

  {
    id: "fisherman-gen6",
    nome: "Fisherman-gen6",
    imagem: "/images/trainers/fisherman-gen6.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 1068,
    stardust: 4636,
    xp: 303,
    ia: "agressiva",
    time: [
      { speciesId: 765, nome: "Oranguru", level: 57 },
      { speciesId: 883, nome: "Arctovish", level: 17 },
      { speciesId: 866, nome: "Mr-rime", level: 11 },
      { speciesId: 938, nome: "Tadbulb", level: 13 },
      { speciesId: 833, nome: "Chewtle", level: 34 },
      { speciesId: 977, nome: "Dondozo", level: 43 }
    ]
  },

  {
    id: "fisherman-gen6xy",
    nome: "Fisherman-gen6xy",
    imagem: "/images/trainers/fisherman-gen6xy.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 2604,
    stardust: 1400,
    xp: 277,
    ia: "aleatoria",
    time: [
      { speciesId: 822, nome: "Corvisquire", level: 56 },
      { speciesId: 334, nome: "Altaria", level: 22 },
      { speciesId: 616, nome: "Shelmet", level: 36 },
      { speciesId: 668, nome: "Pyroar", level: 13 },
      { speciesId: 346, nome: "Cradily", level: 45 },
      { speciesId: 573, nome: "Cinccino", level: 51 }
    ]
  },

  {
    id: "fisherman-gen7",
    nome: "Fisherman-gen7",
    imagem: "/images/trainers/fisherman-gen7.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 243,
    stardust: 2218,
    xp: 128,
    ia: "aleatoria",
    time: [
      { speciesId: 444, nome: "Gabite", level: 13 },
      { speciesId: 348, nome: "Armaldo", level: 30 },
      { speciesId: 989, nome: "Sandy-shocks", level: 22 },
      { speciesId: 255, nome: "Torchic", level: 64 },
      { speciesId: 798, nome: "Kartana", level: 28 },
      { speciesId: 703, nome: "Carbink", level: 25 }
    ]
  },

  {
    id: "fisherman",
    nome: "Fisherman",
    imagem: "/images/trainers/fisherman.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 1130,
    stardust: 392,
    xp: 226,
    ia: "estrategica",
    time: [
      { speciesId: 859, nome: "Impidimp", level: 39 },
      { speciesId: 195, nome: "Quagsire", level: 47 },
      { speciesId: 742, nome: "Cutiefly", level: 62 },
      { speciesId: 130, nome: "Gyarados", level: 61 },
      { speciesId: 202, nome: "Wobbuffet", level: 31 },
      { speciesId: 269, nome: "Dustox", level: 65 }
    ]
  },

  {
    id: "flannery-gen3",
    nome: "Flannery-gen3",
    imagem: "/images/trainers/flannery-gen3.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 784,
    stardust: 626,
    xp: 135,
    ia: "defensiva",
    time: [
      { speciesId: 751, nome: "Dewpider", level: 17 },
      { speciesId: 580, nome: "Ducklett", level: 74 },
      { speciesId: 440, nome: "Happiny", level: 73 },
      { speciesId: 298, nome: "Azurill", level: 52 },
      { speciesId: 187, nome: "Hoppip", level: 32 },
      { speciesId: 17, nome: "Pidgeotto", level: 28 }
    ]
  },

  {
    id: "flannery-gen6",
    nome: "Flannery-gen6",
    imagem: "/images/trainers/flannery-gen6.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "dificil",
    recompensa: 750,
    stardust: 5402,
    xp: 476,
    ia: "agressiva",
    time: [
      { speciesId: 741, nome: "Oricorio-baile", level: 77 },
      { speciesId: 241, nome: "Miltank", level: 62 },
      { speciesId: 896, nome: "Glastrier", level: 16 },
      { speciesId: 413, nome: "Wormadam-plant", level: 66 },
      { speciesId: 518, nome: "Musharna", level: 45 },
      { speciesId: 739, nome: "Crabrawler", level: 12 }
    ]
  },

  {
    id: "flannery",
    nome: "Flannery",
    imagem: "/images/trainers/flannery.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "dificil",
    recompensa: 2448,
    stardust: 4852,
    xp: 436,
    ia: "agressiva",
    time: [
      { speciesId: 588, nome: "Karrablast", level: 75 },
      { speciesId: 652, nome: "Chesnaught", level: 19 },
      { speciesId: 72, nome: "Tentacool", level: 68 },
      { speciesId: 493, nome: "Arceus", level: 78 },
      { speciesId: 149, nome: "Dragonite", level: 66 },
      { speciesId: 18, nome: "Pidgeot", level: 75 }
    ]
  },

  {
    id: "flaregrunt",
    nome: "Flaregrunt",
    imagem: "/images/trainers/flaregrunt.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "dificil",
    recompensa: 2474,
    stardust: 3772,
    xp: 420,
    ia: "agressiva",
    time: [
      { speciesId: 4, nome: "Charmander", level: 41 },
      { speciesId: 75, nome: "Graveler", level: 15 },
      { speciesId: 81, nome: "Magnemite", level: 60 },
      { speciesId: 961, nome: "Wugtrio", level: 22 },
      { speciesId: 269, nome: "Dustox", level: 75 },
      { speciesId: 339, nome: "Barboach", level: 39 }
    ]
  },

  {
    id: "flaregruntf",
    nome: "Flaregruntf",
    imagem: "/images/trainers/flaregruntf.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 1183,
    stardust: 3428,
    xp: 454,
    ia: "defensiva",
    time: [
      { speciesId: 479, nome: "Rotom", level: 45 },
      { speciesId: 515, nome: "Panpour", level: 14 },
      { speciesId: 353, nome: "Shuppet", level: 44 },
      { speciesId: 155, nome: "Cyndaquil", level: 64 },
      { speciesId: 826, nome: "Orbeetle", level: 80 },
      { speciesId: 695, nome: "Heliolisk", level: 22 }
    ]
  },

  {
    id: "flint",
    nome: "Flint",
    imagem: "/images/trainers/flint.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 2992,
    stardust: 2398,
    xp: 404,
    ia: "estrategica",
    time: [
      { speciesId: 377, nome: "Regirock", level: 31 },
      { speciesId: 648, nome: "Meloetta-aria", level: 59 },
      { speciesId: 763, nome: "Tsareena", level: 79 },
      { speciesId: 454, nome: "Toxicroak", level: 65 },
      { speciesId: 1003, nome: "Ting-lu", level: 37 },
      { speciesId: 331, nome: "Cacnea", level: 54 }
    ]
  },

  {
    id: "florian-bb",
    nome: "Florian-bb",
    imagem: "/images/trainers/florian-bb.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 1491,
    stardust: 1709,
    xp: 222,
    ia: "aleatoria",
    time: [
      { speciesId: 241, nome: "Miltank", level: 28 },
      { speciesId: 348, nome: "Armaldo", level: 64 },
      { speciesId: 517, nome: "Munna", level: 25 },
      { speciesId: 23, nome: "Ekans", level: 70 },
      { speciesId: 140, nome: "Kabuto", level: 30 },
      { speciesId: 655, nome: "Delphox", level: 79 }
    ]
  },

  {
    id: "florian-festival",
    nome: "Florian-festival",
    imagem: "/images/trainers/florian-festival.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 582,
    stardust: 600,
    xp: 298,
    ia: "defensiva",
    time: [
      { speciesId: 374, nome: "Beldum", level: 50 },
      { speciesId: 914, nome: "Quaquaval", level: 55 },
      { speciesId: 721, nome: "Volcanion", level: 75 },
      { speciesId: 135, nome: "Jolteon", level: 54 },
      { speciesId: 187, nome: "Hoppip", level: 25 },
      { speciesId: 82, nome: "Magneton", level: 53 }
    ]
  },

  {
    id: "florian-s",
    nome: "Florian-s",
    imagem: "/images/trainers/florian-s.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 844,
    stardust: 534,
    xp: 382,
    ia: "estrategica",
    time: [
      { speciesId: 794, nome: "Buzzwole", level: 31 },
      { speciesId: 309, nome: "Electrike", level: 18 },
      { speciesId: 789, nome: "Cosmog", level: 38 },
      { speciesId: 154, nome: "Meganium", level: 43 },
      { speciesId: 577, nome: "Solosis", level: 20 },
      { speciesId: 659, nome: "Bunnelby", level: 31 }
    ]
  },

  {
    id: "freediver",
    nome: "Freediver",
    imagem: "/images/trainers/freediver.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 1459,
    stardust: 5396,
    xp: 263,
    ia: "estrategica",
    time: [
      { speciesId: 450, nome: "Hippowdon", level: 70 },
      { speciesId: 14, nome: "Kakuna", level: 23 },
      { speciesId: 1021, nome: "Raging-bolt", level: 33 },
      { speciesId: 28, nome: "Sandslash", level: 66 },
      { speciesId: 696, nome: "Tyrunt", level: 65 },
      { speciesId: 72, nome: "Tentacool", level: 56 }
    ]
  },

  {
    id: "furisodegirl-black",
    nome: "Furisodegirl-black",
    imagem: "/images/trainers/furisodegirl-black.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 676,
    stardust: 358,
    xp: 262,
    ia: "estrategica",
    time: [
      { speciesId: 666, nome: "Vivillon", level: 55 },
      { speciesId: 482, nome: "Azelf", level: 55 },
      { speciesId: 597, nome: "Ferroseed", level: 20 },
      { speciesId: 355, nome: "Duskull", level: 17 },
      { speciesId: 995, nome: "Iron-thorns", level: 45 },
      { speciesId: 14, nome: "Kakuna", level: 74 }
    ]
  },

  {
    id: "furisodegirl-blue",
    nome: "Furisodegirl-blue",
    imagem: "/images/trainers/furisodegirl-blue.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 344,
    stardust: 1868,
    xp: 295,
    ia: "estrategica",
    time: [
      { speciesId: 30, nome: "Nidorina", level: 80 },
      { speciesId: 974, nome: "Cetoddle", level: 33 },
      { speciesId: 144, nome: "Articuno", level: 70 },
      { speciesId: 550, nome: "Basculin-red-striped", level: 74 },
      { speciesId: 455, nome: "Carnivine", level: 69 },
      { speciesId: 157, nome: "Typhlosion", level: 39 }
    ]
  },

  {
    id: "furisodegirl-pink",
    nome: "Furisodegirl-pink",
    imagem: "/images/trainers/furisodegirl-pink.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 873,
    stardust: 220,
    xp: 483,
    ia: "estrategica",
    time: [
      { speciesId: 444, nome: "Gabite", level: 80 },
      { speciesId: 786, nome: "Tapu-lele", level: 62 },
      { speciesId: 728, nome: "Popplio", level: 63 },
      { speciesId: 196, nome: "Espeon", level: 69 },
      { speciesId: 795, nome: "Pheromosa", level: 56 },
      { speciesId: 271, nome: "Lombre", level: 47 }
    ]
  },

  {
    id: "furisodegirl-white",
    nome: "Furisodegirl-white",
    imagem: "/images/trainers/furisodegirl-white.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 2724,
    stardust: 1737,
    xp: 351,
    ia: "defensiva",
    time: [
      { speciesId: 625, nome: "Bisharp", level: 12 },
      { speciesId: 635, nome: "Hydreigon", level: 61 },
      { speciesId: 923, nome: "Pawmot", level: 13 },
      { speciesId: 765, nome: "Oranguru", level: 63 },
      { speciesId: 611, nome: "Fraxure", level: 31 },
      { speciesId: 221, nome: "Piloswine", level: 53 }
    ]
  },

  {
    id: "gaeric",
    nome: "Gaeric",
    imagem: "/images/trainers/gaeric.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 748,
    stardust: 708,
    xp: 70,
    ia: "defensiva",
    time: [
      { speciesId: 362, nome: "Glalie", level: 43 },
      { speciesId: 1007, nome: "Koraidon", level: 70 },
      { speciesId: 144, nome: "Articuno", level: 55 },
      { speciesId: 138, nome: "Omanyte", level: 79 },
      { speciesId: 249, nome: "Lugia", level: 54 },
      { speciesId: 396, nome: "Starly", level: 36 }
    ]
  },

  {
    id: "galacticgrunt",
    nome: "Galacticgrunt",
    imagem: "/images/trainers/galacticgrunt.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 2088,
    stardust: 3165,
    xp: 58,
    ia: "agressiva",
    time: [
      { speciesId: 329, nome: "Vibrava", level: 38 },
      { speciesId: 645, nome: "Landorus-incarnate", level: 66 },
      { speciesId: 222, nome: "Corsola", level: 54 },
      { speciesId: 262, nome: "Mightyena", level: 20 },
      { speciesId: 762, nome: "Steenee", level: 69 },
      { speciesId: 871, nome: "Pincurchin", level: 39 }
    ]
  },

  {
    id: "galacticgruntf",
    nome: "Galacticgruntf",
    imagem: "/images/trainers/galacticgruntf.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 195,
    stardust: 3654,
    xp: 376,
    ia: "defensiva",
    time: [
      { speciesId: 960, nome: "Wiglett", level: 61 },
      { speciesId: 975, nome: "Cetitan", level: 22 },
      { speciesId: 220, nome: "Swinub", level: 29 },
      { speciesId: 173, nome: "Cleffa", level: 60 },
      { speciesId: 421, nome: "Cherrim", level: 80 },
      { speciesId: 746, nome: "Wishiwashi-solo", level: 71 }
    ]
  },

  {
    id: "gambler-gen1",
    nome: "Gambler-gen1",
    imagem: "/images/trainers/gambler-gen1.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 337,
    stardust: 3566,
    xp: 406,
    ia: "defensiva",
    time: [
      { speciesId: 987, nome: "Flutter-mane", level: 63 },
      { speciesId: 224, nome: "Octillery", level: 10 },
      { speciesId: 581, nome: "Swanna", level: 55 },
      { speciesId: 250, nome: "Ho-oh", level: 16 },
      { speciesId: 706, nome: "Goodra", level: 57 },
      { speciesId: 877, nome: "Morpeko-full-belly", level: 44 }
    ]
  },

  {
    id: "gambler-gen1rb",
    nome: "Gambler-gen1rb",
    imagem: "/images/trainers/gambler-gen1rb.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 1116,
    stardust: 5439,
    xp: 51,
    ia: "aleatoria",
    time: [
      { speciesId: 192, nome: "Sunflora", level: 57 },
      { speciesId: 896, nome: "Glastrier", level: 25 },
      { speciesId: 12, nome: "Butterfree", level: 16 },
      { speciesId: 941, nome: "Kilowattrel", level: 62 },
      { speciesId: 537, nome: "Seismitoad", level: 17 },
      { speciesId: 313, nome: "Volbeat", level: 16 }
    ]
  },

  {
    id: "gambler",
    nome: "Gambler",
    imagem: "/images/trainers/gambler.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 381,
    stardust: 2798,
    xp: 231,
    ia: "defensiva",
    time: [
      { speciesId: 918, nome: "Spidops", level: 77 },
      { speciesId: 27, nome: "Sandshrew", level: 26 },
      { speciesId: 469, nome: "Yanmega", level: 39 },
      { speciesId: 620, nome: "Mienshao", level: 68 },
      { speciesId: 41, nome: "Zubat", level: 31 },
      { speciesId: 467, nome: "Magmortar", level: 26 }
    ]
  },

  {
    id: "gamer-gen3",
    nome: "Gamer-gen3",
    imagem: "/images/trainers/gamer-gen3.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 2114,
    stardust: 1162,
    xp: 383,
    ia: "aleatoria",
    time: [
      { speciesId: 480, nome: "Uxie", level: 27 },
      { speciesId: 740, nome: "Crabominable", level: 20 },
      { speciesId: 159, nome: "Croconaw", level: 32 },
      { speciesId: 499, nome: "Pignite", level: 67 },
      { speciesId: 74, nome: "Geodude", level: 15 },
      { speciesId: 492, nome: "Shaymin-land", level: 37 }
    ]
  },

  {
    id: "garcon",
    nome: "Garcon",
    imagem: "/images/trainers/garcon.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 1603,
    stardust: 3025,
    xp: 174,
    ia: "agressiva",
    time: [
      { speciesId: 379, nome: "Registeel", level: 80 },
      { speciesId: 933, nome: "Naclstack", level: 77 },
      { speciesId: 749, nome: "Mudbray", level: 35 },
      { speciesId: 769, nome: "Sandygast", level: 31 },
      { speciesId: 924, nome: "Tandemaus", level: 79 },
      { speciesId: 882, nome: "Dracovish", level: 79 }
    ]
  },

  {
    id: "gardener",
    nome: "Gardener",
    imagem: "/images/trainers/gardener.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 1819,
    stardust: 2798,
    xp: 390,
    ia: "estrategica",
    time: [
      { speciesId: 491, nome: "Darkrai", level: 57 },
      { speciesId: 469, nome: "Yanmega", level: 79 },
      { speciesId: 67, nome: "Machoke", level: 54 },
      { speciesId: 738, nome: "Vikavolt", level: 24 },
      { speciesId: 770, nome: "Palossand", level: 11 },
      { speciesId: 1019, nome: "Hydrapple", level: 18 }
    ]
  },

  {
    id: "gardenia-masters",
    nome: "Gardenia-masters",
    imagem: "/images/trainers/gardenia-masters.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 1477,
    stardust: 4125,
    xp: 405,
    ia: "aleatoria",
    time: [
      { speciesId: 954, nome: "Rabsca", level: 60 },
      { speciesId: 195, nome: "Quagsire", level: 27 },
      { speciesId: 839, nome: "Coalossal", level: 72 },
      { speciesId: 555, nome: "Darmanitan-standard", level: 67 },
      { speciesId: 584, nome: "Vanilluxe", level: 50 },
      { speciesId: 815, nome: "Cinderace", level: 17 }
    ]
  },

  {
    id: "gardenia",
    nome: "Gardenia",
    imagem: "/images/trainers/gardenia.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 2671,
    stardust: 3006,
    xp: 490,
    ia: "estrategica",
    time: [
      { speciesId: 107, nome: "Hitmonchan", level: 16 },
      { speciesId: 478, nome: "Froslass", level: 63 },
      { speciesId: 417, nome: "Pachirisu", level: 41 },
      { speciesId: 733, nome: "Toucannon", level: 33 },
      { speciesId: 48, nome: "Venonat", level: 46 },
      { speciesId: 1003, nome: "Ting-lu", level: 69 }
    ]
  },

  {
    id: "geeta",
    nome: "Geeta",
    imagem: "/images/trainers/geeta.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 2654,
    stardust: 5373,
    xp: 455,
    ia: "estrategica",
    time: [
      { speciesId: 811, nome: "Thwackey", level: 37 },
      { speciesId: 14, nome: "Kakuna", level: 20 },
      { speciesId: 529, nome: "Drilbur", level: 24 },
      { speciesId: 530, nome: "Excadrill", level: 25 },
      { speciesId: 374, nome: "Beldum", level: 21 },
      { speciesId: 211, nome: "Qwilfish", level: 15 }
    ]
  },

  {
    id: "gentleman-gen1",
    nome: "Gentleman-gen1",
    imagem: "/images/trainers/gentleman-gen1.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 1195,
    stardust: 5195,
    xp: 433,
    ia: "agressiva",
    time: [
      { speciesId: 968, nome: "Orthworm", level: 68 },
      { speciesId: 285, nome: "Shroomish", level: 56 },
      { speciesId: 681, nome: "Aegislash-shield", level: 20 },
      { speciesId: 190, nome: "Aipom", level: 14 },
      { speciesId: 778, nome: "Mimikyu-disguised", level: 10 },
      { speciesId: 732, nome: "Trumbeak", level: 35 }
    ]
  },

  {
    id: "gentleman-gen1rb",
    nome: "Gentleman-gen1rb",
    imagem: "/images/trainers/gentleman-gen1rb.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 2808,
    stardust: 899,
    xp: 449,
    ia: "estrategica",
    time: [
      { speciesId: 673, nome: "Gogoat", level: 75 },
      { speciesId: 41, nome: "Zubat", level: 57 },
      { speciesId: 695, nome: "Heliolisk", level: 34 },
      { speciesId: 562, nome: "Yamask", level: 62 },
      { speciesId: 711, nome: "Gourgeist-average", level: 11 },
      { speciesId: 42, nome: "Golbat", level: 34 }
    ]
  },

  {
    id: "gentleman-gen2",
    nome: "Gentleman-gen2",
    imagem: "/images/trainers/gentleman-gen2.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 1529,
    stardust: 431,
    xp: 371,
    ia: "agressiva",
    time: [
      { speciesId: 162, nome: "Furret", level: 80 },
      { speciesId: 680, nome: "Doublade", level: 67 },
      { speciesId: 78, nome: "Rapidash", level: 35 },
      { speciesId: 189, nome: "Jumpluff", level: 25 },
      { speciesId: 142, nome: "Aerodactyl", level: 40 },
      { speciesId: 594, nome: "Alomomola", level: 59 }
    ]
  },

  {
    id: "gentleman-gen3",
    nome: "Gentleman-gen3",
    imagem: "/images/trainers/gentleman-gen3.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 1210,
    stardust: 2024,
    xp: 353,
    ia: "defensiva",
    time: [
      { speciesId: 603, nome: "Eelektrik", level: 70 },
      { speciesId: 981, nome: "Farigiraf", level: 37 },
      { speciesId: 236, nome: "Tyrogue", level: 20 },
      { speciesId: 1022, nome: "Iron-boulder", level: 52 },
      { speciesId: 33, nome: "Nidorino", level: 21 },
      { speciesId: 491, nome: "Darkrai", level: 27 }
    ]
  },

  {
    id: "gentleman-gen3rs",
    nome: "Gentleman-gen3rs",
    imagem: "/images/trainers/gentleman-gen3rs.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 543,
    stardust: 4059,
    xp: 388,
    ia: "agressiva",
    time: [
      { speciesId: 816, nome: "Sobble", level: 72 },
      { speciesId: 881, nome: "Arctozolt", level: 56 },
      { speciesId: 70, nome: "Weepinbell", level: 37 },
      { speciesId: 35, nome: "Clefairy", level: 42 },
      { speciesId: 722, nome: "Rowlet", level: 60 },
      { speciesId: 789, nome: "Cosmog", level: 39 }
    ]
  },

  {
    id: "gentleman-gen4",
    nome: "Gentleman-gen4",
    imagem: "/images/trainers/gentleman-gen4.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 2393,
    stardust: 4497,
    xp: 340,
    ia: "estrategica",
    time: [
      { speciesId: 765, nome: "Oranguru", level: 28 },
      { speciesId: 969, nome: "Glimmet", level: 41 },
      { speciesId: 652, nome: "Chesnaught", level: 24 },
      { speciesId: 359, nome: "Absol", level: 79 },
      { speciesId: 579, nome: "Reuniclus", level: 57 },
      { speciesId: 818, nome: "Inteleon", level: 68 }
    ]
  },

  {
    id: "gentleman-gen4dp",
    nome: "Gentleman-gen4dp",
    imagem: "/images/trainers/gentleman-gen4dp.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 1711,
    stardust: 4122,
    xp: 139,
    ia: "defensiva",
    time: [
      { speciesId: 532, nome: "Timburr", level: 17 },
      { speciesId: 965, nome: "Varoom", level: 43 },
      { speciesId: 950, nome: "Klawf", level: 30 },
      { speciesId: 225, nome: "Delibird", level: 52 },
      { speciesId: 154, nome: "Meganium", level: 12 },
      { speciesId: 43, nome: "Oddish", level: 76 }
    ]
  },

  {
    id: "gentleman-gen6",
    nome: "Gentleman-gen6",
    imagem: "/images/trainers/gentleman-gen6.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 196,
    stardust: 5178,
    xp: 455,
    ia: "aleatoria",
    time: [
      { speciesId: 1021, nome: "Raging-bolt", level: 52 },
      { speciesId: 816, nome: "Sobble", level: 28 },
      { speciesId: 742, nome: "Cutiefly", level: 71 },
      { speciesId: 791, nome: "Solgaleo", level: 77 },
      { speciesId: 628, nome: "Braviary", level: 26 },
      { speciesId: 462, nome: "Magnezone", level: 59 }
    ]
  },

  {
    id: "gentleman-gen6xy",
    nome: "Gentleman-gen6xy",
    imagem: "/images/trainers/gentleman-gen6xy.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 188,
    stardust: 2573,
    xp: 112,
    ia: "defensiva",
    time: [
      { speciesId: 505, nome: "Watchog", level: 39 },
      { speciesId: 827, nome: "Nickit", level: 52 },
      { speciesId: 945, nome: "Grafaiai", level: 51 },
      { speciesId: 2, nome: "Ivysaur", level: 44 },
      { speciesId: 993, nome: "Iron-jugulis", level: 38 },
      { speciesId: 120, nome: "Staryu", level: 62 }
    ]
  },

  {
    id: "gentleman-gen7",
    nome: "Gentleman-gen7",
    imagem: "/images/trainers/gentleman-gen7.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 2579,
    stardust: 1459,
    xp: 379,
    ia: "agressiva",
    time: [
      { speciesId: 209, nome: "Snubbull", level: 17 },
      { speciesId: 509, nome: "Purrloin", level: 40 },
      { speciesId: 813, nome: "Scorbunny", level: 12 },
      { speciesId: 84, nome: "Doduo", level: 37 },
      { speciesId: 801, nome: "Magearna", level: 80 },
      { speciesId: 850, nome: "Sizzlipede", level: 21 }
    ]
  },

  {
    id: "gentleman-gen8",
    nome: "Gentleman-gen8",
    imagem: "/images/trainers/gentleman-gen8.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 2774,
    stardust: 1245,
    xp: 317,
    ia: "defensiva",
    time: [
      { speciesId: 7, nome: "Squirtle", level: 56 },
      { speciesId: 568, nome: "Trubbish", level: 67 },
      { speciesId: 774, nome: "Minior-red-meteor", level: 22 },
      { speciesId: 34, nome: "Nidoking", level: 14 },
      { speciesId: 443, nome: "Gible", level: 18 },
      { speciesId: 553, nome: "Krookodile", level: 71 }
    ]
  },

  {
    id: "gentleman-lgpe",
    nome: "Gentleman-lgpe",
    imagem: "/images/trainers/gentleman-lgpe.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 2450,
    stardust: 2014,
    xp: 466,
    ia: "agressiva",
    time: [
      { speciesId: 374, nome: "Beldum", level: 68 },
      { speciesId: 992, nome: "Iron-hands", level: 52 },
      { speciesId: 217, nome: "Ursaring", level: 62 },
      { speciesId: 99, nome: "Kingler", level: 26 },
      { speciesId: 396, nome: "Starly", level: 69 },
      { speciesId: 326, nome: "Grumpig", level: 23 }
    ]
  },

  {
    id: "gentleman",
    nome: "Gentleman",
    imagem: "/images/trainers/gentleman.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 313,
    stardust: 2593,
    xp: 324,
    ia: "defensiva",
    time: [
      { speciesId: 297, nome: "Hariyama", level: 11 },
      { speciesId: 921, nome: "Pawmi", level: 73 },
      { speciesId: 170, nome: "Chinchou", level: 21 },
      { speciesId: 108, nome: "Lickitung", level: 47 },
      { speciesId: 488, nome: "Cresselia", level: 44 },
      { speciesId: 501, nome: "Oshawott", level: 25 }
    ]
  },

  {
    id: "ghetsis-gen5bw",
    nome: "Ghetsis-gen5bw",
    imagem: "/images/trainers/ghetsis-gen5bw.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 286,
    stardust: 1610,
    xp: 89,
    ia: "defensiva",
    time: [
      { speciesId: 4, nome: "Charmander", level: 61 },
      { speciesId: 188, nome: "Skiploom", level: 28 },
      { speciesId: 183, nome: "Marill", level: 12 },
      { speciesId: 515, nome: "Panpour", level: 14 },
      { speciesId: 425, nome: "Drifloon", level: 72 },
      { speciesId: 125, nome: "Electabuzz", level: 13 }
    ]
  },

  {
    id: "ghetsis",
    nome: "Ghetsis",
    imagem: "/images/trainers/ghetsis.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 2319,
    stardust: 3786,
    xp: 169,
    ia: "defensiva",
    time: [
      { speciesId: 155, nome: "Cyndaquil", level: 41 },
      { speciesId: 746, nome: "Wishiwashi-solo", level: 29 },
      { speciesId: 787, nome: "Tapu-bulu", level: 24 },
      { speciesId: 241, nome: "Miltank", level: 26 },
      { speciesId: 717, nome: "Yveltal", level: 30 },
      { speciesId: 176, nome: "Togetic", level: 51 }
    ]
  },

  {
    id: "giacomo",
    nome: "Giacomo",
    imagem: "/images/trainers/giacomo.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 819,
    stardust: 5499,
    xp: 50,
    ia: "aleatoria",
    time: [
      { speciesId: 365, nome: "Walrein", level: 69 },
      { speciesId: 279, nome: "Pelipper", level: 60 },
      { speciesId: 802, nome: "Marshadow", level: 70 },
      { speciesId: 162, nome: "Furret", level: 58 },
      { speciesId: 222, nome: "Corsola", level: 11 },
      { speciesId: 223, nome: "Remoraid", level: 21 }
    ]
  },

  {
    id: "ginchiyo-conquest",
    nome: "Ginchiyo-conquest",
    imagem: "/images/trainers/ginchiyo-conquest.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 1249,
    stardust: 5051,
    xp: 114,
    ia: "estrategica",
    time: [
      { speciesId: 623, nome: "Golurk", level: 76 },
      { speciesId: 1023, nome: "Iron-crown", level: 32 },
      { speciesId: 360, nome: "Wynaut", level: 13 },
      { speciesId: 396, nome: "Starly", level: 51 },
      { speciesId: 460, nome: "Abomasnow", level: 25 },
      { speciesId: 780, nome: "Drampa", level: 17 }
    ]
  },

  {
    id: "ginter",
    nome: "Ginter",
    imagem: "/images/trainers/ginter.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 900,
    stardust: 4633,
    xp: 319,
    ia: "estrategica",
    time: [
      { speciesId: 299, nome: "Nosepass", level: 18 },
      { speciesId: 333, nome: "Swablu", level: 65 },
      { speciesId: 219, nome: "Magcargo", level: 29 },
      { speciesId: 129, nome: "Magikarp", level: 57 },
      { speciesId: 102, nome: "Exeggcute", level: 27 },
      { speciesId: 665, nome: "Spewpa", level: 17 }
    ]
  },

  {
    id: "giovanni-gen1",
    nome: "Giovanni-gen1",
    imagem: "/images/trainers/giovanni-gen1.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 1098,
    stardust: 3398,
    xp: 86,
    ia: "defensiva",
    time: [
      { speciesId: 428, nome: "Lopunny", level: 22 },
      { speciesId: 154, nome: "Meganium", level: 48 },
      { speciesId: 349, nome: "Feebas", level: 65 },
      { speciesId: 816, nome: "Sobble", level: 22 },
      { speciesId: 418, nome: "Buizel", level: 14 },
      { speciesId: 292, nome: "Shedinja", level: 42 }
    ]
  },

  {
    id: "giovanni-gen1rb",
    nome: "Giovanni-gen1rb",
    imagem: "/images/trainers/giovanni-gen1rb.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 1884,
    stardust: 3723,
    xp: 470,
    ia: "estrategica",
    time: [
      { speciesId: 189, nome: "Jumpluff", level: 74 },
      { speciesId: 216, nome: "Teddiursa", level: 17 },
      { speciesId: 596, nome: "Galvantula", level: 37 },
      { speciesId: 530, nome: "Excadrill", level: 64 },
      { speciesId: 2, nome: "Ivysaur", level: 54 },
      { speciesId: 469, nome: "Yanmega", level: 45 }
    ]
  },

  {
    id: "giovanni-gen3",
    nome: "Giovanni-gen3",
    imagem: "/images/trainers/giovanni-gen3.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 695,
    stardust: 139,
    xp: 424,
    ia: "agressiva",
    time: [
      { speciesId: 622, nome: "Golett", level: 33 },
      { speciesId: 311, nome: "Plusle", level: 80 },
      { speciesId: 413, nome: "Wormadam-plant", level: 22 },
      { speciesId: 772, nome: "Type-null", level: 73 },
      { speciesId: 469, nome: "Yanmega", level: 64 },
      { speciesId: 930, nome: "Arboliva", level: 49 }
    ]
  },

  {
    id: "giovanni-lgpe",
    nome: "Giovanni-lgpe",
    imagem: "/images/trainers/giovanni-lgpe.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 1695,
    stardust: 4271,
    xp: 118,
    ia: "aleatoria",
    time: [
      { speciesId: 12, nome: "Butterfree", level: 52 },
      { speciesId: 567, nome: "Archeops", level: 40 },
      { speciesId: 449, nome: "Hippopotas", level: 54 },
      { speciesId: 637, nome: "Volcarona", level: 43 },
      { speciesId: 116, nome: "Horsea", level: 77 },
      { speciesId: 808, nome: "Meltan", level: 35 }
    ]
  },

  {
    id: "giovanni-masters",
    nome: "Giovanni-masters",
    imagem: "/images/trainers/giovanni-masters.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 772,
    stardust: 4192,
    xp: 382,
    ia: "aleatoria",
    time: [
      { speciesId: 391, nome: "Monferno", level: 79 },
      { speciesId: 969, nome: "Glimmet", level: 41 },
      { speciesId: 265, nome: "Wurmple", level: 63 },
      { speciesId: 766, nome: "Passimian", level: 35 },
      { speciesId: 753, nome: "Fomantis", level: 70 },
      { speciesId: 85, nome: "Dodrio", level: 16 }
    ]
  },

  {
    id: "giovanni",
    nome: "Giovanni",
    imagem: "/images/trainers/giovanni.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 297,
    stardust: 598,
    xp: 272,
    ia: "estrategica",
    time: [
      { speciesId: 684, nome: "Swirlix", level: 35 },
      { speciesId: 601, nome: "Klinklang", level: 76 },
      { speciesId: 573, nome: "Cinccino", level: 79 },
      { speciesId: 649, nome: "Genesect", level: 65 },
      { speciesId: 1013, nome: "Sinistcha", level: 79 },
      { speciesId: 266, nome: "Silcoon", level: 16 }
    ]
  },

  {
    id: "glacia-gen3",
    nome: "Glacia-gen3",
    imagem: "/images/trainers/glacia-gen3.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 2627,
    stardust: 5073,
    xp: 349,
    ia: "defensiva",
    time: [
      { speciesId: 851, nome: "Centiskorch", level: 46 },
      { speciesId: 900, nome: "Kleavor", level: 57 },
      { speciesId: 906, nome: "Sprigatito", level: 34 },
      { speciesId: 87, nome: "Dewgong", level: 26 },
      { speciesId: 1016, nome: "Fezandipiti", level: 54 },
      { speciesId: 540, nome: "Sewaddle", level: 38 }
    ]
  },

  {
    id: "glacia",
    nome: "Glacia",
    imagem: "/images/trainers/glacia.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 1601,
    stardust: 4107,
    xp: 311,
    ia: "agressiva",
    time: [
      { speciesId: 537, nome: "Seismitoad", level: 53 },
      { speciesId: 309, nome: "Electrike", level: 76 },
      { speciesId: 215, nome: "Sneasel", level: 46 },
      { speciesId: 910, nome: "Crocalor", level: 64 },
      { speciesId: 934, nome: "Garganacl", level: 41 },
      { speciesId: 694, nome: "Helioptile", level: 10 }
    ]
  },

  {
    id: "gladion-masters",
    nome: "Gladion-masters",
    imagem: "/images/trainers/gladion-masters.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 2060,
    stardust: 472,
    xp: 66,
    ia: "estrategica",
    time: [
      { speciesId: 248, nome: "Tyranitar", level: 67 },
      { speciesId: 743, nome: "Ribombee", level: 71 },
      { speciesId: 914, nome: "Quaquaval", level: 20 },
      { speciesId: 199, nome: "Slowking", level: 25 },
      { speciesId: 1009, nome: "Walking-wake", level: 72 },
      { speciesId: 29, nome: "Nidoran-f", level: 37 }
    ]
  },

  {
    id: "gladion-stance",
    nome: "Gladion-stance",
    imagem: "/images/trainers/gladion-stance.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 2468,
    stardust: 1431,
    xp: 324,
    ia: "agressiva",
    time: [
      { speciesId: 149, nome: "Dragonite", level: 77 },
      { speciesId: 340, nome: "Whiscash", level: 24 },
      { speciesId: 287, nome: "Slakoth", level: 43 },
      { speciesId: 534, nome: "Conkeldurr", level: 45 },
      { speciesId: 873, nome: "Frosmoth", level: 19 },
      { speciesId: 572, nome: "Minccino", level: 70 }
    ]
  },

  {
    id: "gladion",
    nome: "Gladion",
    imagem: "/images/trainers/gladion.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 2889,
    stardust: 1711,
    xp: 113,
    ia: "aleatoria",
    time: [
      { speciesId: 68, nome: "Machamp", level: 73 },
      { speciesId: 602, nome: "Tynamo", level: 63 },
      { speciesId: 954, nome: "Rabsca", level: 72 },
      { speciesId: 845, nome: "Cramorant", level: 63 },
      { speciesId: 815, nome: "Cinderace", level: 36 },
      { speciesId: 588, nome: "Karrablast", level: 58 }
    ]
  },

  {
    id: "gloria-dojo",
    nome: "Gloria-dojo",
    imagem: "/images/trainers/gloria-dojo.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 2963,
    stardust: 4353,
    xp: 129,
    ia: "agressiva",
    time: [
      { speciesId: 641, nome: "Tornadus-incarnate", level: 18 },
      { speciesId: 80, nome: "Slowbro", level: 53 },
      { speciesId: 770, nome: "Palossand", level: 43 },
      { speciesId: 210, nome: "Granbull", level: 61 },
      { speciesId: 254, nome: "Sceptile", level: 57 },
      { speciesId: 875, nome: "Eiscue-ice", level: 46 }
    ]
  },

  {
    id: "gloria-league",
    nome: "Gloria-league",
    imagem: "/images/trainers/gloria-league.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 1525,
    stardust: 1900,
    xp: 335,
    ia: "estrategica",
    time: [
      { speciesId: 502, nome: "Dewott", level: 57 },
      { speciesId: 385, nome: "Jirachi", level: 40 },
      { speciesId: 472, nome: "Gliscor", level: 46 },
      { speciesId: 23, nome: "Ekans", level: 56 },
      { speciesId: 349, nome: "Feebas", level: 15 },
      { speciesId: 196, nome: "Espeon", level: 74 }
    ]
  },

  {
    id: "gloria-masters",
    nome: "Gloria-masters",
    imagem: "/images/trainers/gloria-masters.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 947,
    stardust: 1195,
    xp: 241,
    ia: "estrategica",
    time: [
      { speciesId: 440, nome: "Happiny", level: 25 },
      { speciesId: 549, nome: "Lilligant", level: 12 },
      { speciesId: 329, nome: "Vibrava", level: 22 },
      { speciesId: 423, nome: "Gastrodon", level: 41 },
      { speciesId: 198, nome: "Murkrow", level: 16 },
      { speciesId: 59, nome: "Arcanine", level: 24 }
    ]
  },

  {
    id: "gloria-tundra",
    nome: "Gloria-tundra",
    imagem: "/images/trainers/gloria-tundra.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 1284,
    stardust: 4967,
    xp: 249,
    ia: "agressiva",
    time: [
      { speciesId: 878, nome: "Cufant", level: 34 },
      { speciesId: 78, nome: "Rapidash", level: 66 },
      { speciesId: 271, nome: "Lombre", level: 44 },
      { speciesId: 547, nome: "Whimsicott", level: 58 },
      { speciesId: 224, nome: "Octillery", level: 77 },
      { speciesId: 29, nome: "Nidoran-f", level: 36 }
    ]
  },

  {
    id: "gloria",
    nome: "Gloria",
    imagem: "/images/trainers/gloria.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 2351,
    stardust: 2745,
    xp: 113,
    ia: "estrategica",
    time: [
      { speciesId: 196, nome: "Espeon", level: 27 },
      { speciesId: 953, nome: "Rellor", level: 51 },
      { speciesId: 470, nome: "Leafeon", level: 65 },
      { speciesId: 842, nome: "Appletun", level: 72 },
      { speciesId: 882, nome: "Dracovish", level: 71 },
      { speciesId: 341, nome: "Corphish", level: 13 }
    ]
  },

  {
    id: "golfer",
    nome: "Golfer",
    imagem: "/images/trainers/golfer.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 1598,
    stardust: 1440,
    xp: 369,
    ia: "estrategica",
    time: [
      { speciesId: 651, nome: "Quilladin", level: 26 },
      { speciesId: 378, nome: "Regice", level: 30 },
      { speciesId: 853, nome: "Grapploct", level: 29 },
      { speciesId: 656, nome: "Froakie", level: 33 },
      { speciesId: 276, nome: "Taillow", level: 71 },
      { speciesId: 90, nome: "Shellder", level: 70 }
    ]
  },

  {
    id: "gordie",
    nome: "Gordie",
    imagem: "/images/trainers/gordie.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 2579,
    stardust: 4353,
    xp: 302,
    ia: "defensiva",
    time: [
      { speciesId: 210, nome: "Granbull", level: 65 },
      { speciesId: 566, nome: "Archen", level: 31 },
      { speciesId: 266, nome: "Silcoon", level: 38 },
      { speciesId: 212, nome: "Scizor", level: 69 },
      { speciesId: 39, nome: "Jigglypuff", level: 50 },
      { speciesId: 137, nome: "Porygon", level: 16 }
    ]
  },

  {
    id: "grace",
    nome: "Grace",
    imagem: "/images/trainers/grace.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 2102,
    stardust: 734,
    xp: 57,
    ia: "estrategica",
    time: [
      { speciesId: 1008, nome: "Miraidon", level: 42 },
      { speciesId: 612, nome: "Haxorus", level: 11 },
      { speciesId: 406, nome: "Budew", level: 37 },
      { speciesId: 875, nome: "Eiscue-ice", level: 53 },
      { speciesId: 35, nome: "Clefairy", level: 39 },
      { speciesId: 982, nome: "Dudunsparce-two-segment", level: 47 }
    ]
  },

  {
    id: "grant",
    nome: "Grant",
    imagem: "/images/trainers/grant.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 810,
    stardust: 4311,
    xp: 362,
    ia: "defensiva",
    time: [
      { speciesId: 668, nome: "Pyroar", level: 10 },
      { speciesId: 264, nome: "Linoone", level: 47 },
      { speciesId: 695, nome: "Heliolisk", level: 13 },
      { speciesId: 177, nome: "Natu", level: 60 },
      { speciesId: 333, nome: "Swablu", level: 16 },
      { speciesId: 897, nome: "Spectrier", level: 77 }
    ]
  },

  {
    id: "green",
    nome: "Green",
    imagem: "/images/trainers/green.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 1419,
    stardust: 308,
    xp: 269,
    ia: "aleatoria",
    time: [
      { speciesId: 409, nome: "Rampardos", level: 69 },
      { speciesId: 568, nome: "Trubbish", level: 36 },
      { speciesId: 683, nome: "Aromatisse", level: 59 },
      { speciesId: 205, nome: "Forretress", level: 56 },
      { speciesId: 291, nome: "Ninjask", level: 40 },
      { speciesId: 213, nome: "Shuckle", level: 62 }
    ]
  },

  {
    id: "greta-gen3",
    nome: "Greta-gen3",
    imagem: "/images/trainers/greta-gen3.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 2394,
    stardust: 2069,
    xp: 430,
    ia: "estrategica",
    time: [
      { speciesId: 733, nome: "Toucannon", level: 39 },
      { speciesId: 393, nome: "Piplup", level: 64 },
      { speciesId: 948, nome: "Toedscool", level: 58 },
      { speciesId: 294, nome: "Loudred", level: 40 },
      { speciesId: 606, nome: "Beheeyem", level: 29 },
      { speciesId: 739, nome: "Crabrawler", level: 61 }
    ]
  },

  {
    id: "greta",
    nome: "Greta",
    imagem: "/images/trainers/greta.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 2586,
    stardust: 1901,
    xp: 339,
    ia: "aleatoria",
    time: [
      { speciesId: 770, nome: "Palossand", level: 42 },
      { speciesId: 1006, nome: "Iron-valiant", level: 69 },
      { speciesId: 280, nome: "Ralts", level: 45 },
      { speciesId: 513, nome: "Pansear", level: 26 },
      { speciesId: 777, nome: "Togedemaru", level: 76 },
      { speciesId: 139, nome: "Omastar", level: 66 }
    ]
  },

  {
    id: "grimsley-gen7",
    nome: "Grimsley-gen7",
    imagem: "/images/trainers/grimsley-gen7.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 1541,
    stardust: 572,
    xp: 132,
    ia: "aleatoria",
    time: [
      { speciesId: 65, nome: "Alakazam", level: 21 },
      { speciesId: 503, nome: "Samurott", level: 58 },
      { speciesId: 453, nome: "Croagunk", level: 10 },
      { speciesId: 722, nome: "Rowlet", level: 22 },
      { speciesId: 504, nome: "Patrat", level: 14 },
      { speciesId: 335, nome: "Zangoose", level: 65 }
    ]
  },

  {
    id: "grimsley-masters",
    nome: "Grimsley-masters",
    imagem: "/images/trainers/grimsley-masters.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 2921,
    stardust: 619,
    xp: 142,
    ia: "estrategica",
    time: [
      { speciesId: 351, nome: "Castform", level: 37 },
      { speciesId: 905, nome: "Enamorus-incarnate", level: 33 },
      { speciesId: 33, nome: "Nidorino", level: 61 },
      { speciesId: 714, nome: "Noibat", level: 24 },
      { speciesId: 788, nome: "Tapu-fini", level: 11 },
      { speciesId: 515, nome: "Panpour", level: 23 }
    ]
  },

  {
    id: "grimsley",
    nome: "Grimsley",
    imagem: "/images/trainers/grimsley.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 929,
    stardust: 3407,
    xp: 170,
    ia: "estrategica",
    time: [
      { speciesId: 158, nome: "Totodile", level: 18 },
      { speciesId: 867, nome: "Runerigus", level: 72 },
      { speciesId: 207, nome: "Gligar", level: 60 },
      { speciesId: 791, nome: "Solgaleo", level: 33 },
      { speciesId: 6, nome: "Charizard", level: 30 },
      { speciesId: 118, nome: "Goldeen", level: 55 }
    ]
  },

  {
    id: "grusha",
    nome: "Grusha",
    imagem: "/images/trainers/grusha.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 2142,
    stardust: 852,
    xp: 398,
    ia: "aleatoria",
    time: [
      { speciesId: 707, nome: "Klefki", level: 52 },
      { speciesId: 438, nome: "Bonsly", level: 33 },
      { speciesId: 203, nome: "Girafarig", level: 75 },
      { speciesId: 489, nome: "Phione", level: 35 },
      { speciesId: 35, nome: "Clefairy", level: 47 },
      { speciesId: 512, nome: "Simisage", level: 20 }
    ]
  },

  {
    id: "guitarist-gen2",
    nome: "Guitarist-gen2",
    imagem: "/images/trainers/guitarist-gen2.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 1877,
    stardust: 5340,
    xp: 458,
    ia: "aleatoria",
    time: [
      { speciesId: 115, nome: "Kangaskhan", level: 67 },
      { speciesId: 368, nome: "Gorebyss", level: 44 },
      { speciesId: 264, nome: "Linoone", level: 46 },
      { speciesId: 496, nome: "Servine", level: 31 },
      { speciesId: 139, nome: "Omastar", level: 50 },
      { speciesId: 160, nome: "Feraligatr", level: 39 }
    ]
  },

  {
    id: "guitarist-gen3",
    nome: "Guitarist-gen3",
    imagem: "/images/trainers/guitarist-gen3.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 856,
    stardust: 5412,
    xp: 435,
    ia: "agressiva",
    time: [
      { speciesId: 898, nome: "Calyrex", level: 72 },
      { speciesId: 217, nome: "Ursaring", level: 14 },
      { speciesId: 199, nome: "Slowking", level: 17 },
      { speciesId: 458, nome: "Mantyke", level: 10 },
      { speciesId: 863, nome: "Perrserker", level: 56 },
      { speciesId: 319, nome: "Sharpedo", level: 21 }
    ]
  },

  {
    id: "guitarist-gen4",
    nome: "Guitarist-gen4",
    imagem: "/images/trainers/guitarist-gen4.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 538,
    stardust: 4080,
    xp: 244,
    ia: "aleatoria",
    time: [
      { speciesId: 448, nome: "Lucario", level: 50 },
      { speciesId: 750, nome: "Mudsdale", level: 37 },
      { speciesId: 797, nome: "Celesteela", level: 32 },
      { speciesId: 272, nome: "Ludicolo", level: 75 },
      { speciesId: 325, nome: "Spoink", level: 67 },
      { speciesId: 76, nome: "Golem", level: 39 }
    ]
  },

  {
    id: "guitarist-gen6",
    nome: "Guitarist-gen6",
    imagem: "/images/trainers/guitarist-gen6.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 1439,
    stardust: 3206,
    xp: 220,
    ia: "aleatoria",
    time: [
      { speciesId: 125, nome: "Electabuzz", level: 47 },
      { speciesId: 949, nome: "Toedscruel", level: 76 },
      { speciesId: 568, nome: "Trubbish", level: 70 },
      { speciesId: 688, nome: "Binacle", level: 30 },
      { speciesId: 428, nome: "Lopunny", level: 35 },
      { speciesId: 970, nome: "Glimmora", level: 42 }
    ]
  },

  {
    id: "guitarist",
    nome: "Guitarist",
    imagem: "/images/trainers/guitarist.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 2720,
    stardust: 2458,
    xp: 472,
    ia: "aleatoria",
    time: [
      { speciesId: 966, nome: "Revavroom", level: 26 },
      { speciesId: 54, nome: "Psyduck", level: 80 },
      { speciesId: 755, nome: "Morelull", level: 34 },
      { speciesId: 569, nome: "Garbodor", level: 74 },
      { speciesId: 667, nome: "Litleo", level: 39 },
      { speciesId: 839, nome: "Coalossal", level: 43 }
    ]
  },

  {
    id: "gurkinn",
    nome: "Gurkinn",
    imagem: "/images/trainers/gurkinn.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 1711,
    stardust: 2757,
    xp: 106,
    ia: "aleatoria",
    time: [
      { speciesId: 825, nome: "Dottler", level: 15 },
      { speciesId: 881, nome: "Arctozolt", level: 18 },
      { speciesId: 621, nome: "Druddigon", level: 43 },
      { speciesId: 1008, nome: "Miraidon", level: 77 },
      { speciesId: 656, nome: "Froakie", level: 39 },
      { speciesId: 977, nome: "Dondozo", level: 58 }
    ]
  },

  {
    id: "guzma-masters",
    nome: "Guzma-masters",
    imagem: "/images/trainers/guzma-masters.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 748,
    stardust: 431,
    xp: 347,
    ia: "defensiva",
    time: [
      { speciesId: 202, nome: "Wobbuffet", level: 12 },
      { speciesId: 150, nome: "Mewtwo", level: 13 },
      { speciesId: 806, nome: "Blacephalon", level: 40 },
      { speciesId: 834, nome: "Drednaw", level: 74 },
      { speciesId: 455, nome: "Carnivine", level: 74 },
      { speciesId: 953, nome: "Rellor", level: 41 }
    ]
  },

  {
    id: "guzma",
    nome: "Guzma",
    imagem: "/images/trainers/guzma.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 2430,
    stardust: 4086,
    xp: 168,
    ia: "defensiva",
    time: [
      { speciesId: 512, nome: "Simisage", level: 76 },
      { speciesId: 303, nome: "Mawile", level: 39 },
      { speciesId: 68, nome: "Machamp", level: 67 },
      { speciesId: 677, nome: "Espurr", level: 47 },
      { speciesId: 564, nome: "Tirtouga", level: 58 },
      { speciesId: 687, nome: "Malamar", level: 50 }
    ]
  },

  {
    id: "hala",
    nome: "Hala",
    imagem: "/images/trainers/hala.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 2316,
    stardust: 1399,
    xp: 83,
    ia: "estrategica",
    time: [
      { speciesId: 97, nome: "Hypno", level: 36 },
      { speciesId: 110, nome: "Weezing", level: 68 },
      { speciesId: 240, nome: "Magby", level: 79 },
      { speciesId: 483, nome: "Dialga", level: 50 },
      { speciesId: 1018, nome: "Archaludon", level: 26 },
      { speciesId: 133, nome: "Eevee", level: 12 }
    ]
  },

  {
    id: "hanbei-conquest",
    nome: "Hanbei-conquest",
    imagem: "/images/trainers/hanbei-conquest.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 1637,
    stardust: 1868,
    xp: 295,
    ia: "agressiva",
    time: [
      { speciesId: 128, nome: "Tauros", level: 62 },
      { speciesId: 982, nome: "Dudunsparce-two-segment", level: 65 },
      { speciesId: 245, nome: "Suicune", level: 65 },
      { speciesId: 71, nome: "Victreebel", level: 25 },
      { speciesId: 345, nome: "Lileep", level: 66 },
      { speciesId: 874, nome: "Stonjourner", level: 64 }
    ]
  },

  {
    id: "hapu",
    nome: "Hapu",
    imagem: "/images/trainers/hapu.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 1870,
    stardust: 182,
    xp: 154,
    ia: "estrategica",
    time: [
      { speciesId: 873, nome: "Frosmoth", level: 66 },
      { speciesId: 377, nome: "Regirock", level: 61 },
      { speciesId: 682, nome: "Spritzee", level: 66 },
      { speciesId: 463, nome: "Lickilicky", level: 55 },
      { speciesId: 612, nome: "Haxorus", level: 42 },
      { speciesId: 326, nome: "Grumpig", level: 35 }
    ]
  },

  {
    id: "harlequin",
    nome: "Harlequin",
    imagem: "/images/trainers/harlequin.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 2334,
    stardust: 4241,
    xp: 317,
    ia: "defensiva",
    time: [
      { speciesId: 844, nome: "Sandaconda", level: 73 },
      { speciesId: 538, nome: "Throh", level: 34 },
      { speciesId: 155, nome: "Cyndaquil", level: 79 },
      { speciesId: 351, nome: "Castform", level: 39 },
      { speciesId: 562, nome: "Yamask", level: 26 },
      { speciesId: 964, nome: "Palafin-zero", level: 65 }
    ]
  },

  {
    id: "harmony",
    nome: "Harmony",
    imagem: "/images/trainers/harmony.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 2598,
    stardust: 800,
    xp: 297,
    ia: "estrategica",
    time: [
      { speciesId: 671, nome: "Florges", level: 41 },
      { speciesId: 988, nome: "Slither-wing", level: 25 },
      { speciesId: 795, nome: "Pheromosa", level: 49 },
      { speciesId: 771, nome: "Pyukumuku", level: 65 },
      { speciesId: 938, nome: "Tadbulb", level: 17 },
      { speciesId: 314, nome: "Illumise", level: 57 }
    ]
  },

  {
    id: "hassel",
    nome: "Hassel",
    imagem: "/images/trainers/hassel.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 2928,
    stardust: 292,
    xp: 471,
    ia: "defensiva",
    time: [
      { speciesId: 90, nome: "Shellder", level: 20 },
      { speciesId: 938, nome: "Tadbulb", level: 63 },
      { speciesId: 896, nome: "Glastrier", level: 22 },
      { speciesId: 823, nome: "Corviknight", level: 18 },
      { speciesId: 328, nome: "Trapinch", level: 70 },
      { speciesId: 373, nome: "Salamence", level: 59 }
    ]
  },

  {
    id: "hau-masters",
    nome: "Hau-masters",
    imagem: "/images/trainers/hau-masters.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 1065,
    stardust: 3016,
    xp: 206,
    ia: "aleatoria",
    time: [
      { speciesId: 217, nome: "Ursaring", level: 34 },
      { speciesId: 311, nome: "Plusle", level: 62 },
      { speciesId: 361, nome: "Snorunt", level: 10 },
      { speciesId: 585, nome: "Deerling", level: 65 },
      { speciesId: 414, nome: "Mothim", level: 33 },
      { speciesId: 308, nome: "Medicham", level: 19 }
    ]
  },

  {
    id: "hau-stance",
    nome: "Hau-stance",
    imagem: "/images/trainers/hau-stance.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 136,
    stardust: 4708,
    xp: 160,
    ia: "agressiva",
    time: [
      { speciesId: 984, nome: "Great-tusk", level: 54 },
      { speciesId: 650, nome: "Chespin", level: 22 },
      { speciesId: 568, nome: "Trubbish", level: 43 },
      { speciesId: 649, nome: "Genesect", level: 73 },
      { speciesId: 287, nome: "Slakoth", level: 71 },
      { speciesId: 96, nome: "Drowzee", level: 17 }
    ]
  },

  {
    id: "hau",
    nome: "Hau",
    imagem: "/images/trainers/hau.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 1917,
    stardust: 1388,
    xp: 481,
    ia: "aleatoria",
    time: [
      { speciesId: 548, nome: "Petilil", level: 63 },
      { speciesId: 638, nome: "Cobalion", level: 34 },
      { speciesId: 690, nome: "Skrelp", level: 39 },
      { speciesId: 802, nome: "Marshadow", level: 78 },
      { speciesId: 922, nome: "Pawmo", level: 65 },
      { speciesId: 527, nome: "Woobat", level: 32 }
    ]
  },

  {
    id: "hayley",
    nome: "Hayley",
    imagem: "/images/trainers/hayley.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 2539,
    stardust: 4021,
    xp: 471,
    ia: "aleatoria",
    time: [
      { speciesId: 869, nome: "Alcremie", level: 70 },
      { speciesId: 256, nome: "Combusken", level: 34 },
      { speciesId: 674, nome: "Pancham", level: 50 },
      { speciesId: 1008, nome: "Miraidon", level: 71 },
      { speciesId: 227, nome: "Skarmory", level: 64 },
      { speciesId: 783, nome: "Hakamo-o", level: 61 }
    ]
  },

  {
    id: "heath",
    nome: "Heath",
    imagem: "/images/trainers/heath.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 503,
    stardust: 2309,
    xp: 417,
    ia: "aleatoria",
    time: [
      { speciesId: 103, nome: "Exeggutor", level: 22 },
      { speciesId: 809, nome: "Melmetal", level: 71 },
      { speciesId: 1002, nome: "Chien-pao", level: 14 },
      { speciesId: 212, nome: "Scizor", level: 70 },
      { speciesId: 998, nome: "Baxcalibur", level: 47 },
      { speciesId: 118, nome: "Goldeen", level: 53 }
    ]
  },

  {
    id: "hero-conquest",
    nome: "Hero-conquest",
    imagem: "/images/trainers/hero-conquest.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 2637,
    stardust: 4819,
    xp: 413,
    ia: "agressiva",
    time: [
      { speciesId: 229, nome: "Houndoom", level: 34 },
      { speciesId: 904, nome: "Overqwil", level: 38 },
      { speciesId: 615, nome: "Cryogonal", level: 18 },
      { speciesId: 732, nome: "Trumbeak", level: 66 },
      { speciesId: 905, nome: "Enamorus-incarnate", level: 12 },
      { speciesId: 529, nome: "Drilbur", level: 61 }
    ]
  },

  {
    id: "hero2-conquest",
    nome: "Hero2-conquest",
    imagem: "/images/trainers/hero2-conquest.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 889,
    stardust: 2204,
    xp: 399,
    ia: "estrategica",
    time: [
      { speciesId: 98, nome: "Krabby", level: 60 },
      { speciesId: 260, nome: "Swampert", level: 78 },
      { speciesId: 656, nome: "Froakie", level: 52 },
      { speciesId: 735, nome: "Gumshoos", level: 19 },
      { speciesId: 2, nome: "Ivysaur", level: 53 },
      { speciesId: 81, nome: "Magnemite", level: 42 }
    ]
  },

  {
    id: "heroine-conquest",
    nome: "Heroine-conquest",
    imagem: "/images/trainers/heroine-conquest.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "dificil",
    recompensa: 1197,
    stardust: 3472,
    xp: 169,
    ia: "aleatoria",
    time: [
      { speciesId: 1009, nome: "Walking-wake", level: 78 },
      { speciesId: 181, nome: "Ampharos", level: 48 },
      { speciesId: 981, nome: "Farigiraf", level: 70 },
      { speciesId: 164, nome: "Noctowl", level: 41 },
      { speciesId: 768, nome: "Golisopod", level: 54 },
      { speciesId: 552, nome: "Krokorok", level: 74 }
    ]
  },

  {
    id: "heroine2-conquest",
    nome: "Heroine2-conquest",
    imagem: "/images/trainers/heroine2-conquest.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 2470,
    stardust: 1969,
    xp: 62,
    ia: "aleatoria",
    time: [
      { speciesId: 259, nome: "Marshtomp", level: 75 },
      { speciesId: 68, nome: "Machamp", level: 28 },
      { speciesId: 371, nome: "Bagon", level: 62 },
      { speciesId: 362, nome: "Glalie", level: 13 },
      { speciesId: 554, nome: "Darumaka", level: 39 },
      { speciesId: 716, nome: "Xerneas", level: 78 }
    ]
  },

  {
    id: "hexmaniac-gen3",
    nome: "Hexmaniac-gen3",
    imagem: "/images/trainers/hexmaniac-gen3.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 351,
    stardust: 4045,
    xp: 325,
    ia: "aleatoria",
    time: [
      { speciesId: 812, nome: "Rillaboom", level: 35 },
      { speciesId: 424, nome: "Ambipom", level: 22 },
      { speciesId: 21, nome: "Spearow", level: 64 },
      { speciesId: 483, nome: "Dialga", level: 79 },
      { speciesId: 77, nome: "Ponyta", level: 10 },
      { speciesId: 695, nome: "Heliolisk", level: 72 }
    ]
  },

  {
    id: "hexmaniac-gen3jp",
    nome: "Hexmaniac-gen3jp",
    imagem: "/images/trainers/hexmaniac-gen3jp.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 2246,
    stardust: 464,
    xp: 167,
    ia: "estrategica",
    time: [
      { speciesId: 900, nome: "Kleavor", level: 17 },
      { speciesId: 575, nome: "Gothorita", level: 59 },
      { speciesId: 551, nome: "Sandile", level: 21 },
      { speciesId: 529, nome: "Drilbur", level: 39 },
      { speciesId: 865, nome: "Sirfetchd", level: 37 },
      { speciesId: 420, nome: "Cherubi", level: 73 }
    ]
  },

  {
    id: "hexmaniac-gen6",
    nome: "Hexmaniac-gen6",
    imagem: "/images/trainers/hexmaniac-gen6.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 197,
    stardust: 4448,
    xp: 252,
    ia: "aleatoria",
    time: [
      { speciesId: 128, nome: "Tauros", level: 28 },
      { speciesId: 730, nome: "Primarina", level: 47 },
      { speciesId: 115, nome: "Kangaskhan", level: 66 },
      { speciesId: 99, nome: "Kingler", level: 71 },
      { speciesId: 301, nome: "Delcatty", level: 79 },
      { speciesId: 161, nome: "Sentret", level: 60 }
    ]
  },

  {
    id: "hiker-gen1",
    nome: "Hiker-gen1",
    imagem: "/images/trainers/hiker-gen1.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 1811,
    stardust: 3992,
    xp: 491,
    ia: "agressiva",
    time: [
      { speciesId: 46, nome: "Paras", level: 22 },
      { speciesId: 74, nome: "Geodude", level: 67 },
      { speciesId: 836, nome: "Boltund", level: 45 },
      { speciesId: 607, nome: "Litwick", level: 16 },
      { speciesId: 178, nome: "Xatu", level: 39 },
      { speciesId: 404, nome: "Luxio", level: 61 }
    ]
  },

  {
    id: "hiker-gen1rb",
    nome: "Hiker-gen1rb",
    imagem: "/images/trainers/hiker-gen1rb.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 1125,
    stardust: 2571,
    xp: 219,
    ia: "agressiva",
    time: [
      { speciesId: 809, nome: "Melmetal", level: 24 },
      { speciesId: 396, nome: "Starly", level: 50 },
      { speciesId: 384, nome: "Rayquaza", level: 43 },
      { speciesId: 466, nome: "Electivire", level: 80 },
      { speciesId: 125, nome: "Electabuzz", level: 48 },
      { speciesId: 400, nome: "Bibarel", level: 20 }
    ]
  },

  {
    id: "hiker-gen2",
    nome: "Hiker-gen2",
    imagem: "/images/trainers/hiker-gen2.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 2044,
    stardust: 2104,
    xp: 419,
    ia: "agressiva",
    time: [
      { speciesId: 356, nome: "Dusclops", level: 66 },
      { speciesId: 12, nome: "Butterfree", level: 64 },
      { speciesId: 343, nome: "Baltoy", level: 67 },
      { speciesId: 946, nome: "Bramblin", level: 20 },
      { speciesId: 236, nome: "Tyrogue", level: 32 },
      { speciesId: 247, nome: "Pupitar", level: 78 }
    ]
  },

  {
    id: "hiker-gen3",
    nome: "Hiker-gen3",
    imagem: "/images/trainers/hiker-gen3.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 2038,
    stardust: 2966,
    xp: 131,
    ia: "aleatoria",
    time: [
      { speciesId: 749, nome: "Mudbray", level: 45 },
      { speciesId: 767, nome: "Wimpod", level: 66 },
      { speciesId: 952, nome: "Scovillain", level: 77 },
      { speciesId: 202, nome: "Wobbuffet", level: 44 },
      { speciesId: 530, nome: "Excadrill", level: 51 },
      { speciesId: 667, nome: "Litleo", level: 32 }
    ]
  },

  {
    id: "hiker-gen3rs",
    nome: "Hiker-gen3rs",
    imagem: "/images/trainers/hiker-gen3rs.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 1639,
    stardust: 3492,
    xp: 242,
    ia: "estrategica",
    time: [
      { speciesId: 518, nome: "Musharna", level: 50 },
      { speciesId: 147, nome: "Dratini", level: 58 },
      { speciesId: 996, nome: "Frigibax", level: 60 },
      { speciesId: 227, nome: "Skarmory", level: 66 },
      { speciesId: 195, nome: "Quagsire", level: 15 },
      { speciesId: 431, nome: "Glameow", level: 29 }
    ]
  },

  {
    id: "hiker-gen4",
    nome: "Hiker-gen4",
    imagem: "/images/trainers/hiker-gen4.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 1993,
    stardust: 1776,
    xp: 495,
    ia: "agressiva",
    time: [
      { speciesId: 630, nome: "Mandibuzz", level: 78 },
      { speciesId: 617, nome: "Accelgor", level: 12 },
      { speciesId: 125, nome: "Electabuzz", level: 28 },
      { speciesId: 461, nome: "Weavile", level: 64 },
      { speciesId: 515, nome: "Panpour", level: 45 },
      { speciesId: 127, nome: "Pinsir", level: 36 }
    ]
  },

  {
    id: "hiker-gen6",
    nome: "Hiker-gen6",
    imagem: "/images/trainers/hiker-gen6.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 1085,
    stardust: 2356,
    xp: 348,
    ia: "defensiva",
    time: [
      { speciesId: 542, nome: "Leavanny", level: 45 },
      { speciesId: 620, nome: "Mienshao", level: 20 },
      { speciesId: 450, nome: "Hippowdon", level: 40 },
      { speciesId: 966, nome: "Revavroom", level: 77 },
      { speciesId: 412, nome: "Burmy", level: 35 },
      { speciesId: 196, nome: "Espeon", level: 48 }
    ]
  },

  {
    id: "hiker-gen7",
    nome: "Hiker-gen7",
    imagem: "/images/trainers/hiker-gen7.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 2058,
    stardust: 2166,
    xp: 206,
    ia: "agressiva",
    time: [
      { speciesId: 147, nome: "Dratini", level: 63 },
      { speciesId: 213, nome: "Shuckle", level: 80 },
      { speciesId: 980, nome: "Clodsire", level: 70 },
      { speciesId: 1025, nome: "Pecharunt", level: 42 },
      { speciesId: 670, nome: "Floette", level: 79 },
      { speciesId: 814, nome: "Raboot", level: 70 }
    ]
  },

  {
    id: "hiker-gen8",
    nome: "Hiker-gen8",
    imagem: "/images/trainers/hiker-gen8.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 1109,
    stardust: 1722,
    xp: 409,
    ia: "defensiva",
    time: [
      { speciesId: 868, nome: "Milcery", level: 24 },
      { speciesId: 125, nome: "Electabuzz", level: 74 },
      { speciesId: 374, nome: "Beldum", level: 35 },
      { speciesId: 218, nome: "Slugma", level: 37 },
      { speciesId: 160, nome: "Feraligatr", level: 49 },
      { speciesId: 977, nome: "Dondozo", level: 64 }
    ]
  },

  {
    id: "hiker-gen9",
    nome: "Hiker-gen9",
    imagem: "/images/trainers/hiker-gen9.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 500,
    stardust: 2200,
    xp: 328,
    ia: "defensiva",
    time: [
      { speciesId: 654, nome: "Braixen", level: 49 },
      { speciesId: 676, nome: "Furfrou", level: 21 },
      { speciesId: 662, nome: "Fletchinder", level: 47 },
      { speciesId: 695, nome: "Heliolisk", level: 51 },
      { speciesId: 742, nome: "Cutiefly", level: 61 },
      { speciesId: 802, nome: "Marshadow", level: 34 }
    ]
  },

  {
    id: "hiker",
    nome: "Hiker",
    imagem: "/images/trainers/hiker.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 406,
    stardust: 951,
    xp: 417,
    ia: "agressiva",
    time: [
      { speciesId: 319, nome: "Sharpedo", level: 44 },
      { speciesId: 414, nome: "Mothim", level: 60 },
      { speciesId: 184, nome: "Azumarill", level: 35 },
      { speciesId: 350, nome: "Milotic", level: 32 },
      { speciesId: 993, nome: "Iron-jugulis", level: 24 },
      { speciesId: 396, nome: "Starly", level: 35 }
    ]
  },

  {
    id: "hilbert-masters",
    nome: "Hilbert-masters",
    imagem: "/images/trainers/hilbert-masters.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 240,
    stardust: 980,
    xp: 162,
    ia: "agressiva",
    time: [
      { speciesId: 620, nome: "Mienshao", level: 63 },
      { speciesId: 526, nome: "Gigalith", level: 34 },
      { speciesId: 358, nome: "Chimecho", level: 34 },
      { speciesId: 856, nome: "Hatenna", level: 65 },
      { speciesId: 726, nome: "Torracat", level: 13 },
      { speciesId: 1019, nome: "Hydrapple", level: 28 }
    ]
  },

  {
    id: "hilbert-masters2",
    nome: "Hilbert-masters2",
    imagem: "/images/trainers/hilbert-masters2.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 1865,
    stardust: 3951,
    xp: 175,
    ia: "estrategica",
    time: [
      { speciesId: 391, nome: "Monferno", level: 40 },
      { speciesId: 466, nome: "Electivire", level: 66 },
      { speciesId: 114, nome: "Tangela", level: 29 },
      { speciesId: 313, nome: "Volbeat", level: 48 },
      { speciesId: 96, nome: "Drowzee", level: 50 },
      { speciesId: 908, nome: "Meowscarada", level: 37 }
    ]
  },

  {
    id: "hilbert-wonderlauncher",
    nome: "Hilbert-wonderlauncher",
    imagem: "/images/trainers/hilbert-wonderlauncher.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 1345,
    stardust: 2658,
    xp: 326,
    ia: "agressiva",
    time: [
      { speciesId: 675, nome: "Pangoro", level: 51 },
      { speciesId: 19, nome: "Rattata", level: 44 },
      { speciesId: 831, nome: "Wooloo", level: 57 },
      { speciesId: 445, nome: "Garchomp", level: 35 },
      { speciesId: 647, nome: "Keldeo-ordinary", level: 75 },
      { speciesId: 363, nome: "Spheal", level: 74 }
    ]
  },

  {
    id: "hilbert",
    nome: "Hilbert",
    imagem: "/images/trainers/hilbert.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 2728,
    stardust: 4555,
    xp: 103,
    ia: "estrategica",
    time: [
      { speciesId: 12, nome: "Butterfree", level: 20 },
      { speciesId: 98, nome: "Krabby", level: 27 },
      { speciesId: 117, nome: "Seadra", level: 15 },
      { speciesId: 963, nome: "Finizen", level: 42 },
      { speciesId: 804, nome: "Naganadel", level: 59 },
      { speciesId: 306, nome: "Aggron", level: 46 }
    ]
  },

  {
    id: "hilda-masters",
    nome: "Hilda-masters",
    imagem: "/images/trainers/hilda-masters.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 1554,
    stardust: 1784,
    xp: 75,
    ia: "aleatoria",
    time: [
      { speciesId: 563, nome: "Cofagrigus", level: 45 },
      { speciesId: 812, nome: "Rillaboom", level: 19 },
      { speciesId: 683, nome: "Aromatisse", level: 50 },
      { speciesId: 855, nome: "Polteageist", level: 74 },
      { speciesId: 620, nome: "Mienshao", level: 36 },
      { speciesId: 484, nome: "Palkia", level: 26 }
    ]
  },

  {
    id: "hilda-masters2",
    nome: "Hilda-masters2",
    imagem: "/images/trainers/hilda-masters2.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 1417,
    stardust: 5433,
    xp: 465,
    ia: "estrategica",
    time: [
      { speciesId: 882, nome: "Dracovish", level: 79 },
      { speciesId: 790, nome: "Cosmoem", level: 39 },
      { speciesId: 523, nome: "Zebstrika", level: 40 },
      { speciesId: 795, nome: "Pheromosa", level: 76 },
      { speciesId: 4, nome: "Charmander", level: 18 },
      { speciesId: 601, nome: "Klinklang", level: 67 }
    ]
  },

  {
    id: "hilda-masters3",
    nome: "Hilda-masters3",
    imagem: "/images/trainers/hilda-masters3.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 1213,
    stardust: 825,
    xp: 421,
    ia: "estrategica",
    time: [
      { speciesId: 933, nome: "Naclstack", level: 19 },
      { speciesId: 597, nome: "Ferroseed", level: 65 },
      { speciesId: 929, nome: "Dolliv", level: 17 },
      { speciesId: 892, nome: "Urshifu-single-strike", level: 32 },
      { speciesId: 117, nome: "Seadra", level: 16 },
      { speciesId: 716, nome: "Xerneas", level: 11 }
    ]
  },

  {
    id: "hilda-wonderlauncher",
    nome: "Hilda-wonderlauncher",
    imagem: "/images/trainers/hilda-wonderlauncher.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 1021,
    stardust: 470,
    xp: 194,
    ia: "aleatoria",
    time: [
      { speciesId: 675, nome: "Pangoro", level: 14 },
      { speciesId: 560, nome: "Scrafty", level: 33 },
      { speciesId: 37, nome: "Vulpix", level: 62 },
      { speciesId: 1020, nome: "Gouging-fire", level: 16 },
      { speciesId: 72, nome: "Tentacool", level: 64 },
      { speciesId: 822, nome: "Corvisquire", level: 14 }
    ]
  },

  {
    id: "hilda",
    nome: "Hilda",
    imagem: "/images/trainers/hilda.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 729,
    stardust: 3337,
    xp: 482,
    ia: "estrategica",
    time: [
      { speciesId: 834, nome: "Drednaw", level: 47 },
      { speciesId: 513, nome: "Pansear", level: 56 },
      { speciesId: 212, nome: "Scizor", level: 45 },
      { speciesId: 746, nome: "Wishiwashi-solo", level: 70 },
      { speciesId: 244, nome: "Entei", level: 14 },
      { speciesId: 532, nome: "Timburr", level: 52 }
    ]
  },

  {
    id: "hooligans",
    nome: "Hooligans",
    imagem: "/images/trainers/hooligans.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 2187,
    stardust: 3536,
    xp: 64,
    ia: "agressiva",
    time: [
      { speciesId: 64, nome: "Kadabra", level: 41 },
      { speciesId: 990, nome: "Iron-treads", level: 25 },
      { speciesId: 583, nome: "Vanillish", level: 38 },
      { speciesId: 543, nome: "Venipede", level: 42 },
      { speciesId: 353, nome: "Shuppet", level: 49 },
      { speciesId: 612, nome: "Haxorus", level: 59 }
    ]
  },

  {
    id: "hoopster",
    nome: "Hoopster",
    imagem: "/images/trainers/hoopster.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 1870,
    stardust: 2160,
    xp: 272,
    ia: "defensiva",
    time: [
      { speciesId: 7, nome: "Squirtle", level: 47 },
      { speciesId: 670, nome: "Floette", level: 59 },
      { speciesId: 569, nome: "Garbodor", level: 22 },
      { speciesId: 493, nome: "Arceus", level: 57 },
      { speciesId: 873, nome: "Frosmoth", level: 52 },
      { speciesId: 454, nome: "Toxicroak", level: 27 }
    ]
  },

  {
    id: "hop-masters",
    nome: "Hop-masters",
    imagem: "/images/trainers/hop-masters.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 1487,
    stardust: 1564,
    xp: 202,
    ia: "defensiva",
    time: [
      { speciesId: 767, nome: "Wimpod", level: 60 },
      { speciesId: 538, nome: "Throh", level: 63 },
      { speciesId: 435, nome: "Skuntank", level: 19 },
      { speciesId: 605, nome: "Elgyem", level: 48 },
      { speciesId: 69, nome: "Bellsprout", level: 48 },
      { speciesId: 597, nome: "Ferroseed", level: 18 }
    ]
  },

  {
    id: "hop",
    nome: "Hop",
    imagem: "/images/trainers/hop.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 1040,
    stardust: 1602,
    xp: 185,
    ia: "defensiva",
    time: [
      { speciesId: 440, nome: "Happiny", level: 73 },
      { speciesId: 958, nome: "Tinkatuff", level: 11 },
      { speciesId: 746, nome: "Wishiwashi-solo", level: 69 },
      { speciesId: 701, nome: "Hawlucha", level: 77 },
      { speciesId: 968, nome: "Orthworm", level: 43 },
      { speciesId: 568, nome: "Trubbish", level: 15 }
    ]
  },

  {
    id: "hugh",
    nome: "Hugh",
    imagem: "/images/trainers/hugh.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 1704,
    stardust: 2004,
    xp: 106,
    ia: "aleatoria",
    time: [
      { speciesId: 64, nome: "Kadabra", level: 75 },
      { speciesId: 661, nome: "Fletchling", level: 41 },
      { speciesId: 579, nome: "Reuniclus", level: 38 },
      { speciesId: 121, nome: "Starmie", level: 15 },
      { speciesId: 979, nome: "Annihilape", level: 63 },
      { speciesId: 857, nome: "Hattrem", level: 74 }
    ]
  },

  {
    id: "hyde",
    nome: "Hyde",
    imagem: "/images/trainers/hyde.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 2509,
    stardust: 3926,
    xp: 487,
    ia: "estrategica",
    time: [
      { speciesId: 390, nome: "Chimchar", level: 12 },
      { speciesId: 333, nome: "Swablu", level: 55 },
      { speciesId: 736, nome: "Grubbin", level: 53 },
      { speciesId: 857, nome: "Hattrem", level: 68 },
      { speciesId: 585, nome: "Deerling", level: 68 },
      { speciesId: 600, nome: "Klang", level: 12 }
    ]
  },

  {
    id: "idol",
    nome: "Idol",
    imagem: "/images/trainers/idol.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 2078,
    stardust: 5236,
    xp: 450,
    ia: "estrategica",
    time: [
      { speciesId: 455, nome: "Carnivine", level: 13 },
      { speciesId: 422, nome: "Shellos", level: 74 },
      { speciesId: 748, nome: "Toxapex", level: 45 },
      { speciesId: 269, nome: "Dustox", level: 31 },
      { speciesId: 233, nome: "Porygon2", level: 61 },
      { speciesId: 330, nome: "Flygon", level: 36 }
    ]
  },

  {
    id: "ilima",
    nome: "Ilima",
    imagem: "/images/trainers/ilima.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 2835,
    stardust: 2541,
    xp: 173,
    ia: "agressiva",
    time: [
      { speciesId: 666, nome: "Vivillon", level: 55 },
      { speciesId: 274, nome: "Nuzleaf", level: 70 },
      { speciesId: 526, nome: "Gigalith", level: 78 },
      { speciesId: 875, nome: "Eiscue-ice", level: 18 },
      { speciesId: 399, nome: "Bidoof", level: 31 },
      { speciesId: 815, nome: "Cinderace", level: 33 }
    ]
  },

  {
    id: "infielder",
    nome: "Infielder",
    imagem: "/images/trainers/infielder.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 649,
    stardust: 1558,
    xp: 442,
    ia: "estrategica",
    time: [
      { speciesId: 346, nome: "Cradily", level: 38 },
      { speciesId: 983, nome: "Kingambit", level: 54 },
      { speciesId: 406, nome: "Budew", level: 33 },
      { speciesId: 181, nome: "Ampharos", level: 61 },
      { speciesId: 866, nome: "Mr-rime", level: 57 },
      { speciesId: 32, nome: "Nidoran-m", level: 62 }
    ]
  },

  {
    id: "ingo-hisui",
    nome: "Ingo-hisui",
    imagem: "/images/trainers/ingo-hisui.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 2540,
    stardust: 5402,
    xp: 92,
    ia: "estrategica",
    time: [
      { speciesId: 467, nome: "Magmortar", level: 24 },
      { speciesId: 550, nome: "Basculin-red-striped", level: 49 },
      { speciesId: 362, nome: "Glalie", level: 60 },
      { speciesId: 568, nome: "Trubbish", level: 25 },
      { speciesId: 691, nome: "Dragalge", level: 20 },
      { speciesId: 663, nome: "Talonflame", level: 16 }
    ]
  },

  {
    id: "ingo-masters",
    nome: "Ingo-masters",
    imagem: "/images/trainers/ingo-masters.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 2842,
    stardust: 2712,
    xp: 293,
    ia: "defensiva",
    time: [
      { speciesId: 538, nome: "Throh", level: 25 },
      { speciesId: 621, nome: "Druddigon", level: 48 },
      { speciesId: 678, nome: "Meowstic-male", level: 63 },
      { speciesId: 237, nome: "Hitmontop", level: 23 },
      { speciesId: 951, nome: "Capsakid", level: 34 },
      { speciesId: 41, nome: "Zubat", level: 20 }
    ]
  },

  {
    id: "ingo",
    nome: "Ingo",
    imagem: "/images/trainers/ingo.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 340,
    stardust: 816,
    xp: 161,
    ia: "agressiva",
    time: [
      { speciesId: 401, nome: "Kricketot", level: 70 },
      { speciesId: 374, nome: "Beldum", level: 67 },
      { speciesId: 893, nome: "Zarude", level: 48 },
      { speciesId: 45, nome: "Vileplume", level: 32 },
      { speciesId: 252, nome: "Treecko", level: 16 },
      { speciesId: 124, nome: "Jynx", level: 38 }
    ]
  },

  {
    id: "interviewers-gen3",
    nome: "Interviewers-gen3",
    imagem: "/images/trainers/interviewers-gen3.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 2634,
    stardust: 5018,
    xp: 143,
    ia: "agressiva",
    time: [
      { speciesId: 621, nome: "Druddigon", level: 49 },
      { speciesId: 601, nome: "Klinklang", level: 74 },
      { speciesId: 958, nome: "Tinkatuff", level: 52 },
      { speciesId: 899, nome: "Wyrdeer", level: 17 },
      { speciesId: 8, nome: "Wartortle", level: 12 },
      { speciesId: 304, nome: "Aron", level: 24 }
    ]
  },

  {
    id: "interviewers-gen6",
    nome: "Interviewers-gen6",
    imagem: "/images/trainers/interviewers-gen6.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 1118,
    stardust: 2473,
    xp: 195,
    ia: "aleatoria",
    time: [
      { speciesId: 721, nome: "Volcanion", level: 24 },
      { speciesId: 788, nome: "Tapu-fini", level: 43 },
      { speciesId: 32, nome: "Nidoran-m", level: 36 },
      { speciesId: 186, nome: "Politoed", level: 67 },
      { speciesId: 317, nome: "Swalot", level: 69 },
      { speciesId: 331, nome: "Cacnea", level: 41 }
    ]
  },

  {
    id: "interviewers",
    nome: "Interviewers",
    imagem: "/images/trainers/interviewers.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 555,
    stardust: 3083,
    xp: 235,
    ia: "agressiva",
    time: [
      { speciesId: 924, nome: "Tandemaus", level: 50 },
      { speciesId: 859, nome: "Impidimp", level: 50 },
      { speciesId: 202, nome: "Wobbuffet", level: 47 },
      { speciesId: 721, nome: "Volcanion", level: 25 },
      { speciesId: 1022, nome: "Iron-boulder", level: 41 },
      { speciesId: 457, nome: "Lumineon", level: 52 }
    ]
  },

  {
    id: "iono-masters",
    nome: "Iono-masters",
    imagem: "/images/trainers/iono-masters.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 1546,
    stardust: 868,
    xp: 451,
    ia: "aleatoria",
    time: [
      { speciesId: 982, nome: "Dudunsparce-two-segment", level: 70 },
      { speciesId: 437, nome: "Bronzong", level: 56 },
      { speciesId: 585, nome: "Deerling", level: 20 },
      { speciesId: 942, nome: "Maschiff", level: 23 },
      { speciesId: 837, nome: "Rolycoly", level: 75 },
      { speciesId: 417, nome: "Pachirisu", level: 32 }
    ]
  },

  {
    id: "iono-masters2",
    nome: "Iono-masters2",
    imagem: "/images/trainers/iono-masters2.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 397,
    stardust: 3925,
    xp: 158,
    ia: "defensiva",
    time: [
      { speciesId: 559, nome: "Scraggy", level: 57 },
      { speciesId: 664, nome: "Scatterbug", level: 65 },
      { speciesId: 104, nome: "Cubone", level: 57 },
      { speciesId: 900, nome: "Kleavor", level: 13 },
      { speciesId: 604, nome: "Eelektross", level: 73 },
      { speciesId: 871, nome: "Pincurchin", level: 45 }
    ]
  },

  {
    id: "iono",
    nome: "Iono",
    imagem: "/images/trainers/iono.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 2298,
    stardust: 3024,
    xp: 425,
    ia: "agressiva",
    time: [
      { speciesId: 725, nome: "Litten", level: 76 },
      { speciesId: 180, nome: "Flaaffy", level: 24 },
      { speciesId: 883, nome: "Arctovish", level: 28 },
      { speciesId: 128, nome: "Tauros", level: 76 },
      { speciesId: 202, nome: "Wobbuffet", level: 69 },
      { speciesId: 68, nome: "Machamp", level: 26 }
    ]
  },

  {
    id: "irida-masters",
    nome: "Irida-masters",
    imagem: "/images/trainers/irida-masters.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "dificil",
    recompensa: 925,
    stardust: 3161,
    xp: 85,
    ia: "aleatoria",
    time: [
      { speciesId: 21, nome: "Spearow", level: 51 },
      { speciesId: 170, nome: "Chinchou", level: 25 },
      { speciesId: 493, nome: "Arceus", level: 57 },
      { speciesId: 96, nome: "Drowzee", level: 29 },
      { speciesId: 590, nome: "Foongus", level: 15 },
      { speciesId: 263, nome: "Zigzagoon", level: 19 }
    ]
  },

  {
    id: "irida",
    nome: "Irida",
    imagem: "/images/trainers/irida.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 1001,
    stardust: 3836,
    xp: 250,
    ia: "agressiva",
    time: [
      { speciesId: 187, nome: "Hoppip", level: 38 },
      { speciesId: 1003, nome: "Ting-lu", level: 14 },
      { speciesId: 169, nome: "Crobat", level: 79 },
      { speciesId: 644, nome: "Zekrom", level: 23 },
      { speciesId: 945, nome: "Grafaiai", level: 30 },
      { speciesId: 195, nome: "Quagsire", level: 18 }
    ]
  },

  {
    id: "iris-gen5bw2",
    nome: "Iris-gen5bw2",
    imagem: "/images/trainers/iris-gen5bw2.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 979,
    stardust: 1418,
    xp: 222,
    ia: "agressiva",
    time: [
      { speciesId: 404, nome: "Luxio", level: 34 },
      { speciesId: 111, nome: "Rhyhorn", level: 26 },
      { speciesId: 540, nome: "Sewaddle", level: 44 },
      { speciesId: 300, nome: "Skitty", level: 74 },
      { speciesId: 142, nome: "Aerodactyl", level: 15 },
      { speciesId: 730, nome: "Primarina", level: 10 }
    ]
  },

  {
    id: "iris-masters",
    nome: "Iris-masters",
    imagem: "/images/trainers/iris-masters.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 1576,
    stardust: 3780,
    xp: 491,
    ia: "aleatoria",
    time: [
      { speciesId: 993, nome: "Iron-jugulis", level: 12 },
      { speciesId: 403, nome: "Shinx", level: 61 },
      { speciesId: 740, nome: "Crabominable", level: 78 },
      { speciesId: 523, nome: "Zebstrika", level: 18 },
      { speciesId: 589, nome: "Escavalier", level: 35 },
      { speciesId: 810, nome: "Grookey", level: 63 }
    ]
  },

  {
    id: "iris",
    nome: "Iris",
    imagem: "/images/trainers/iris.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 1400,
    stardust: 4682,
    xp: 490,
    ia: "estrategica",
    time: [
      { speciesId: 846, nome: "Arrokuda", level: 63 },
      { speciesId: 420, nome: "Cherubi", level: 56 },
      { speciesId: 964, nome: "Palafin-zero", level: 17 },
      { speciesId: 236, nome: "Tyrogue", level: 71 },
      { speciesId: 259, nome: "Marshtomp", level: 39 },
      { speciesId: 597, nome: "Ferroseed", level: 10 }
    ]
  },

  {
    id: "iscan",
    nome: "Iscan",
    imagem: "/images/trainers/iscan.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 324,
    stardust: 3218,
    xp: 281,
    ia: "defensiva",
    time: [
      { speciesId: 628, nome: "Braviary", level: 20 },
      { speciesId: 872, nome: "Snom", level: 57 },
      { speciesId: 903, nome: "Sneasler", level: 10 },
      { speciesId: 499, nome: "Pignite", level: 34 },
      { speciesId: 910, nome: "Crocalor", level: 68 },
      { speciesId: 273, nome: "Seedot", level: 52 }
    ]
  },

  {
    id: "jacq",
    nome: "Jacq",
    imagem: "/images/trainers/jacq.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 665,
    stardust: 528,
    xp: 324,
    ia: "agressiva",
    time: [
      { speciesId: 850, nome: "Sizzlipede", level: 25 },
      { speciesId: 989, nome: "Sandy-shocks", level: 13 },
      { speciesId: 762, nome: "Steenee", level: 35 },
      { speciesId: 847, nome: "Barraskewda", level: 41 },
      { speciesId: 951, nome: "Capsakid", level: 29 },
      { speciesId: 613, nome: "Cubchoo", level: 26 }
    ]
  },

  {
    id: "jamie",
    nome: "Jamie",
    imagem: "/images/trainers/jamie.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 2870,
    stardust: 1598,
    xp: 318,
    ia: "defensiva",
    time: [
      { speciesId: 999, nome: "Gimmighoul", level: 45 },
      { speciesId: 746, nome: "Wishiwashi-solo", level: 63 },
      { speciesId: 561, nome: "Sigilyph", level: 78 },
      { speciesId: 592, nome: "Frillish", level: 79 },
      { speciesId: 980, nome: "Clodsire", level: 80 },
      { speciesId: 732, nome: "Trumbeak", level: 53 }
    ]
  },

  {
    id: "janine-gen2",
    nome: "Janine-gen2",
    imagem: "/images/trainers/janine-gen2.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 1255,
    stardust: 1480,
    xp: 130,
    ia: "defensiva",
    time: [
      { speciesId: 684, nome: "Swirlix", level: 18 },
      { speciesId: 246, nome: "Larvitar", level: 52 },
      { speciesId: 294, nome: "Loudred", level: 50 },
      { speciesId: 515, nome: "Panpour", level: 70 },
      { speciesId: 43, nome: "Oddish", level: 15 },
      { speciesId: 547, nome: "Whimsicott", level: 68 }
    ]
  },

  {
    id: "janine",
    nome: "Janine",
    imagem: "/images/trainers/janine.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 1721,
    stardust: 2252,
    xp: 298,
    ia: "defensiva",
    time: [
      { speciesId: 53, nome: "Persian", level: 14 },
      { speciesId: 444, nome: "Gabite", level: 11 },
      { speciesId: 645, nome: "Landorus-incarnate", level: 42 },
      { speciesId: 420, nome: "Cherubi", level: 35 },
      { speciesId: 972, nome: "Houndstone", level: 49 },
      { speciesId: 655, nome: "Delphox", level: 48 }
    ]
  },

  {
    id: "janitor-gen7",
    nome: "Janitor-gen7",
    imagem: "/images/trainers/janitor-gen7.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 1452,
    stardust: 783,
    xp: 88,
    ia: "estrategica",
    time: [
      { speciesId: 911, nome: "Skeledirge", level: 34 },
      { speciesId: 698, nome: "Amaura", level: 41 },
      { speciesId: 629, nome: "Vullaby", level: 31 },
      { speciesId: 967, nome: "Cyclizar", level: 24 },
      { speciesId: 284, nome: "Masquerain", level: 74 },
      { speciesId: 652, nome: "Chesnaught", level: 68 }
    ]
  },

  {
    id: "janitor-gen9",
    nome: "Janitor-gen9",
    imagem: "/images/trainers/janitor-gen9.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 1089,
    stardust: 4403,
    xp: 289,
    ia: "defensiva",
    time: [
      { speciesId: 656, nome: "Froakie", level: 38 },
      { speciesId: 119, nome: "Seaking", level: 16 },
      { speciesId: 205, nome: "Forretress", level: 53 },
      { speciesId: 531, nome: "Audino", level: 68 },
      { speciesId: 755, nome: "Morelull", level: 49 },
      { speciesId: 884, nome: "Duraludon", level: 76 }
    ]
  },

  {
    id: "janitor",
    nome: "Janitor",
    imagem: "/images/trainers/janitor.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 151,
    stardust: 153,
    xp: 189,
    ia: "agressiva",
    time: [
      { speciesId: 661, nome: "Fletchling", level: 73 },
      { speciesId: 529, nome: "Drilbur", level: 62 },
      { speciesId: 366, nome: "Clamperl", level: 17 },
      { speciesId: 862, nome: "Obstagoon", level: 61 },
      { speciesId: 394, nome: "Prinplup", level: 66 },
      { speciesId: 918, nome: "Spidops", level: 70 }
    ]
  },

  {
    id: "jasmine-contest",
    nome: "Jasmine-contest",
    imagem: "/images/trainers/jasmine-contest.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 2986,
    stardust: 707,
    xp: 313,
    ia: "aleatoria",
    time: [
      { speciesId: 490, nome: "Manaphy", level: 34 },
      { speciesId: 246, nome: "Larvitar", level: 52 },
      { speciesId: 375, nome: "Metang", level: 78 },
      { speciesId: 619, nome: "Mienfoo", level: 53 },
      { speciesId: 973, nome: "Flamigo", level: 63 },
      { speciesId: 366, nome: "Clamperl", level: 44 }
    ]
  },

  {
    id: "jasmine-gen2",
    nome: "Jasmine-gen2",
    imagem: "/images/trainers/jasmine-gen2.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 1632,
    stardust: 4629,
    xp: 149,
    ia: "estrategica",
    time: [
      { speciesId: 172, nome: "Pichu", level: 34 },
      { speciesId: 977, nome: "Dondozo", level: 56 },
      { speciesId: 92, nome: "Gastly", level: 52 },
      { speciesId: 867, nome: "Runerigus", level: 55 },
      { speciesId: 1001, nome: "Wo-chien", level: 57 },
      { speciesId: 885, nome: "Dreepy", level: 68 }
    ]
  },

  {
    id: "jasmine-masters",
    nome: "Jasmine-masters",
    imagem: "/images/trainers/jasmine-masters.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "dificil",
    recompensa: 422,
    stardust: 351,
    xp: 379,
    ia: "agressiva",
    time: [
      { speciesId: 615, nome: "Cryogonal", level: 73 },
      { speciesId: 307, nome: "Meditite", level: 55 },
      { speciesId: 916, nome: "Oinkologne-male", level: 73 },
      { speciesId: 129, nome: "Magikarp", level: 44 },
      { speciesId: 329, nome: "Vibrava", level: 58 },
      { speciesId: 541, nome: "Swadloon", level: 23 }
    ]
  },

  {
    id: "jasmine-masters2",
    nome: "Jasmine-masters2",
    imagem: "/images/trainers/jasmine-masters2.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 2896,
    stardust: 4061,
    xp: 272,
    ia: "estrategica",
    time: [
      { speciesId: 646, nome: "Kyurem", level: 62 },
      { speciesId: 856, nome: "Hatenna", level: 63 },
      { speciesId: 864, nome: "Cursola", level: 30 },
      { speciesId: 930, nome: "Arboliva", level: 21 },
      { speciesId: 407, nome: "Roserade", level: 59 },
      { speciesId: 902, nome: "Basculegion-male", level: 24 }
    ]
  },

  {
    id: "jasmine",
    nome: "Jasmine",
    imagem: "/images/trainers/jasmine.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 2792,
    stardust: 4954,
    xp: 76,
    ia: "defensiva",
    time: [
      { speciesId: 992, nome: "Iron-hands", level: 53 },
      { speciesId: 296, nome: "Makuhita", level: 61 },
      { speciesId: 966, nome: "Revavroom", level: 14 },
      { speciesId: 984, nome: "Great-tusk", level: 41 },
      { speciesId: 82, nome: "Magneton", level: 27 },
      { speciesId: 1005, nome: "Roaring-moon", level: 63 }
    ]
  },

  {
    id: "jessiejames-gen1",
    nome: "Jessiejames-gen1",
    imagem: "/images/trainers/jessiejames-gen1.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 1350,
    stardust: 1945,
    xp: 227,
    ia: "estrategica",
    time: [
      { speciesId: 32, nome: "Nidoran-m", level: 44 },
      { speciesId: 605, nome: "Elgyem", level: 79 },
      { speciesId: 830, nome: "Eldegoss", level: 26 },
      { speciesId: 662, nome: "Fletchinder", level: 41 },
      { speciesId: 614, nome: "Beartic", level: 37 },
      { speciesId: 424, nome: "Ambipom", level: 68 }
    ]
  },

  {
    id: "jogger",
    nome: "Jogger",
    imagem: "/images/trainers/jogger.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 829,
    stardust: 4634,
    xp: 124,
    ia: "aleatoria",
    time: [
      { speciesId: 320, nome: "Wailmer", level: 78 },
      { speciesId: 956, nome: "Espathra", level: 61 },
      { speciesId: 542, nome: "Leavanny", level: 36 },
      { speciesId: 755, nome: "Morelull", level: 38 },
      { speciesId: 475, nome: "Gallade", level: 49 },
      { speciesId: 31, nome: "Nidoqueen", level: 23 }
    ]
  },

  {
    id: "johanna-contest",
    nome: "Johanna-contest",
    imagem: "/images/trainers/johanna-contest.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 1145,
    stardust: 3297,
    xp: 276,
    ia: "agressiva",
    time: [
      { speciesId: 897, nome: "Spectrier", level: 62 },
      { speciesId: 515, nome: "Panpour", level: 71 },
      { speciesId: 556, nome: "Maractus", level: 44 },
      { speciesId: 230, nome: "Kingdra", level: 28 },
      { speciesId: 817, nome: "Drizzile", level: 21 },
      { speciesId: 824, nome: "Blipbug", level: 22 }
    ]
  },

  {
    id: "johanna",
    nome: "Johanna",
    imagem: "/images/trainers/johanna.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 846,
    stardust: 172,
    xp: 233,
    ia: "aleatoria",
    time: [
      { speciesId: 898, nome: "Calyrex", level: 18 },
      { speciesId: 266, nome: "Silcoon", level: 29 },
      { speciesId: 347, nome: "Anorith", level: 42 },
      { speciesId: 819, nome: "Skwovet", level: 57 },
      { speciesId: 686, nome: "Inkay", level: 26 },
      { speciesId: 629, nome: "Vullaby", level: 53 }
    ]
  },

  {
    id: "jrtrainer-gen1",
    nome: "Jrtrainer-gen1",
    imagem: "/images/trainers/jrtrainer-gen1.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 2330,
    stardust: 1763,
    xp: 232,
    ia: "agressiva",
    time: [
      { speciesId: 827, nome: "Nickit", level: 79 },
      { speciesId: 166, nome: "Ledian", level: 36 },
      { speciesId: 75, nome: "Graveler", level: 73 },
      { speciesId: 644, nome: "Zekrom", level: 67 },
      { speciesId: 119, nome: "Seaking", level: 66 },
      { speciesId: 912, nome: "Quaxly", level: 60 }
    ]
  },

  {
    id: "jrtrainer-gen1rb",
    nome: "Jrtrainer-gen1rb",
    imagem: "/images/trainers/jrtrainer-gen1rb.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 337,
    stardust: 200,
    xp: 100,
    ia: "agressiva",
    time: [
      { speciesId: 312, nome: "Minun", level: 21 },
      { speciesId: 1000, nome: "Gholdengo", level: 20 },
      { speciesId: 487, nome: "Giratina-altered", level: 67 },
      { speciesId: 137, nome: "Porygon", level: 32 },
      { speciesId: 93, nome: "Haunter", level: 19 },
      { speciesId: 640, nome: "Virizion", level: 76 }
    ]
  },

  {
    id: "jrtrainerf-gen1",
    nome: "Jrtrainerf-gen1",
    imagem: "/images/trainers/jrtrainerf-gen1.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 2666,
    stardust: 4407,
    xp: 468,
    ia: "agressiva",
    time: [
      { speciesId: 224, nome: "Octillery", level: 24 },
      { speciesId: 670, nome: "Floette", level: 79 },
      { speciesId: 104, nome: "Cubone", level: 52 },
      { speciesId: 604, nome: "Eelektross", level: 17 },
      { speciesId: 460, nome: "Abomasnow", level: 41 },
      { speciesId: 7, nome: "Squirtle", level: 18 }
    ]
  },

  {
    id: "jrtrainerf-gen1rb",
    nome: "Jrtrainerf-gen1rb",
    imagem: "/images/trainers/jrtrainerf-gen1rb.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 1271,
    stardust: 1555,
    xp: 58,
    ia: "agressiva",
    time: [
      { speciesId: 974, nome: "Cetoddle", level: 71 },
      { speciesId: 590, nome: "Foongus", level: 60 },
      { speciesId: 529, nome: "Drilbur", level: 73 },
      { speciesId: 164, nome: "Noctowl", level: 30 },
      { speciesId: 414, nome: "Mothim", level: 53 },
      { speciesId: 199, nome: "Slowking", level: 78 }
    ]
  },

  {
    id: "juan-gen3",
    nome: "Juan-gen3",
    imagem: "/images/trainers/juan-gen3.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 2178,
    stardust: 3643,
    xp: 365,
    ia: "aleatoria",
    time: [
      { speciesId: 408, nome: "Cranidos", level: 74 },
      { speciesId: 751, nome: "Dewpider", level: 70 },
      { speciesId: 72, nome: "Tentacool", level: 48 },
      { speciesId: 500, nome: "Emboar", level: 57 },
      { speciesId: 61, nome: "Poliwhirl", level: 45 },
      { speciesId: 540, nome: "Sewaddle", level: 35 }
    ]
  },

  {
    id: "juan",
    nome: "Juan",
    imagem: "/images/trainers/juan.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 2994,
    stardust: 4107,
    xp: 429,
    ia: "agressiva",
    time: [
      { speciesId: 563, nome: "Cofagrigus", level: 33 },
      { speciesId: 246, nome: "Larvitar", level: 61 },
      { speciesId: 166, nome: "Ledian", level: 64 },
      { speciesId: 3, nome: "Venusaur", level: 46 },
      { speciesId: 387, nome: "Turtwig", level: 25 },
      { speciesId: 944, nome: "Shroodle", level: 27 }
    ]
  },

  {
    id: "juggler-gen1",
    nome: "Juggler-gen1",
    imagem: "/images/trainers/juggler-gen1.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 1517,
    stardust: 2400,
    xp: 203,
    ia: "agressiva",
    time: [
      { speciesId: 822, nome: "Corvisquire", level: 54 },
      { speciesId: 283, nome: "Surskit", level: 16 },
      { speciesId: 746, nome: "Wishiwashi-solo", level: 75 },
      { speciesId: 784, nome: "Kommo-o", level: 15 },
      { speciesId: 370, nome: "Luvdisc", level: 30 },
      { speciesId: 851, nome: "Centiskorch", level: 25 }
    ]
  },

  {
    id: "juggler-gen1rb",
    nome: "Juggler-gen1rb",
    imagem: "/images/trainers/juggler-gen1rb.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 2928,
    stardust: 1660,
    xp: 484,
    ia: "defensiva",
    time: [
      { speciesId: 879, nome: "Copperajah", level: 15 },
      { speciesId: 430, nome: "Honchkrow", level: 43 },
      { speciesId: 94, nome: "Gengar", level: 39 },
      { speciesId: 95, nome: "Onix", level: 61 },
      { speciesId: 600, nome: "Klang", level: 15 },
      { speciesId: 716, nome: "Xerneas", level: 48 }
    ]
  },

  {
    id: "juggler-gen2",
    nome: "Juggler-gen2",
    imagem: "/images/trainers/juggler-gen2.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 1117,
    stardust: 4616,
    xp: 359,
    ia: "estrategica",
    time: [
      { speciesId: 53, nome: "Persian", level: 48 },
      { speciesId: 34, nome: "Nidoking", level: 25 },
      { speciesId: 701, nome: "Hawlucha", level: 19 },
      { speciesId: 264, nome: "Linoone", level: 13 },
      { speciesId: 426, nome: "Drifblim", level: 24 },
      { speciesId: 997, nome: "Arctibax", level: 76 }
    ]
  },

  {
    id: "juggler-gen3",
    nome: "Juggler-gen3",
    imagem: "/images/trainers/juggler-gen3.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 1550,
    stardust: 2164,
    xp: 401,
    ia: "agressiva",
    time: [
      { speciesId: 864, nome: "Cursola", level: 16 },
      { speciesId: 177, nome: "Natu", level: 16 },
      { speciesId: 620, nome: "Mienshao", level: 69 },
      { speciesId: 433, nome: "Chingling", level: 39 },
      { speciesId: 368, nome: "Gorebyss", level: 64 },
      { speciesId: 471, nome: "Glaceon", level: 29 }
    ]
  },

  {
    id: "juggler",
    nome: "Juggler",
    imagem: "/images/trainers/juggler.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 217,
    stardust: 3818,
    xp: 155,
    ia: "estrategica",
    time: [
      { speciesId: 85, nome: "Dodrio", level: 16 },
      { speciesId: 224, nome: "Octillery", level: 46 },
      { speciesId: 970, nome: "Glimmora", level: 77 },
      { speciesId: 851, nome: "Centiskorch", level: 35 },
      { speciesId: 614, nome: "Beartic", level: 62 },
      { speciesId: 465, nome: "Tangrowth", level: 62 }
    ]
  },

  {
    id: "juliana-bb",
    nome: "Juliana-bb",
    imagem: "/images/trainers/juliana-bb.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 120,
    stardust: 4074,
    xp: 398,
    ia: "aleatoria",
    time: [
      { speciesId: 19, nome: "Rattata", level: 12 },
      { speciesId: 542, nome: "Leavanny", level: 13 },
      { speciesId: 402, nome: "Kricketune", level: 26 },
      { speciesId: 467, nome: "Magmortar", level: 76 },
      { speciesId: 551, nome: "Sandile", level: 18 },
      { speciesId: 849, nome: "Toxtricity-amped", level: 53 }
    ]
  },

  {
    id: "juliana-festival",
    nome: "Juliana-festival",
    imagem: "/images/trainers/juliana-festival.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 2715,
    stardust: 4422,
    xp: 374,
    ia: "agressiva",
    time: [
      { speciesId: 185, nome: "Sudowoodo", level: 47 },
      { speciesId: 750, nome: "Mudsdale", level: 39 },
      { speciesId: 246, nome: "Larvitar", level: 41 },
      { speciesId: 881, nome: "Arctozolt", level: 50 },
      { speciesId: 700, nome: "Sylveon", level: 39 },
      { speciesId: 1010, nome: "Iron-leaves", level: 32 }
    ]
  },

  {
    id: "juliana-s",
    nome: "Juliana-s",
    imagem: "/images/trainers/juliana-s.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 277,
    stardust: 2759,
    xp: 210,
    ia: "estrategica",
    time: [
      { speciesId: 388, nome: "Grotle", level: 77 },
      { speciesId: 273, nome: "Seedot", level: 16 },
      { speciesId: 734, nome: "Yungoos", level: 64 },
      { speciesId: 927, nome: "Dachsbun", level: 22 },
      { speciesId: 445, nome: "Garchomp", level: 27 },
      { speciesId: 92, nome: "Gastly", level: 64 }
    ]
  },

  {
    id: "juniper",
    nome: "Juniper",
    imagem: "/images/trainers/juniper.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 1019,
    stardust: 428,
    xp: 440,
    ia: "aleatoria",
    time: [
      { speciesId: 102, nome: "Exeggcute", level: 52 },
      { speciesId: 109, nome: "Koffing", level: 52 },
      { speciesId: 767, nome: "Wimpod", level: 80 },
      { speciesId: 993, nome: "Iron-jugulis", level: 23 },
      { speciesId: 8, nome: "Wartortle", level: 63 },
      { speciesId: 921, nome: "Pawmi", level: 41 }
    ]
  },

  {
    id: "jupiter",
    nome: "Jupiter",
    imagem: "/images/trainers/jupiter.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 451,
    stardust: 3109,
    xp: 88,
    ia: "agressiva",
    time: [
      { speciesId: 332, nome: "Cacturne", level: 48 },
      { speciesId: 819, nome: "Skwovet", level: 51 },
      { speciesId: 828, nome: "Thievul", level: 22 },
      { speciesId: 321, nome: "Wailord", level: 66 },
      { speciesId: 346, nome: "Cradily", level: 61 },
      { speciesId: 48, nome: "Venonat", level: 30 }
    ]
  },

  {
    id: "kabu",
    nome: "Kabu",
    imagem: "/images/trainers/kabu.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 113,
    stardust: 178,
    xp: 397,
    ia: "defensiva",
    time: [
      { speciesId: 58, nome: "Growlithe", level: 80 },
      { speciesId: 1003, nome: "Ting-lu", level: 76 },
      { speciesId: 582, nome: "Vanillite", level: 65 },
      { speciesId: 724, nome: "Decidueye", level: 30 },
      { speciesId: 542, nome: "Leavanny", level: 17 },
      { speciesId: 247, nome: "Pupitar", level: 77 }
    ]
  },

  {
    id: "kahili",
    nome: "Kahili",
    imagem: "/images/trainers/kahili.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 1985,
    stardust: 4155,
    xp: 309,
    ia: "agressiva",
    time: [
      { speciesId: 981, nome: "Farigiraf", level: 43 },
      { speciesId: 821, nome: "Rookidee", level: 79 },
      { speciesId: 149, nome: "Dragonite", level: 65 },
      { speciesId: 592, nome: "Frillish", level: 43 },
      { speciesId: 1023, nome: "Iron-crown", level: 65 },
      { speciesId: 804, nome: "Naganadel", level: 34 }
    ]
  },

  {
    id: "kamado-armor",
    nome: "Kamado-armor",
    imagem: "/images/trainers/kamado-armor.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 391,
    stardust: 4508,
    xp: 259,
    ia: "aleatoria",
    time: [
      { speciesId: 231, nome: "Phanpy", level: 45 },
      { speciesId: 659, nome: "Bunnelby", level: 43 },
      { speciesId: 37, nome: "Vulpix", level: 54 },
      { speciesId: 15, nome: "Beedrill", level: 16 },
      { speciesId: 101, nome: "Electrode", level: 60 },
      { speciesId: 398, nome: "Staraptor", level: 57 }
    ]
  },

  {
    id: "kamado",
    nome: "Kamado",
    imagem: "/images/trainers/kamado.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 2294,
    stardust: 2686,
    xp: 253,
    ia: "defensiva",
    time: [
      { speciesId: 963, nome: "Finizen", level: 21 },
      { speciesId: 215, nome: "Sneasel", level: 39 },
      { speciesId: 698, nome: "Amaura", level: 72 },
      { speciesId: 404, nome: "Luxio", level: 13 },
      { speciesId: 98, nome: "Krabby", level: 11 },
      { speciesId: 183, nome: "Marill", level: 47 }
    ]
  },

  {
    id: "karen-gen2",
    nome: "Karen-gen2",
    imagem: "/images/trainers/karen-gen2.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 1395,
    stardust: 3259,
    xp: 391,
    ia: "agressiva",
    time: [
      { speciesId: 873, nome: "Frosmoth", level: 12 },
      { speciesId: 320, nome: "Wailmer", level: 40 },
      { speciesId: 2, nome: "Ivysaur", level: 44 },
      { speciesId: 210, nome: "Granbull", level: 26 },
      { speciesId: 355, nome: "Duskull", level: 15 },
      { speciesId: 932, nome: "Nacli", level: 35 }
    ]
  },

  {
    id: "karen",
    nome: "Karen",
    imagem: "/images/trainers/karen.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 1140,
    stardust: 3866,
    xp: 462,
    ia: "aleatoria",
    time: [
      { speciesId: 58, nome: "Growlithe", level: 52 },
      { speciesId: 955, nome: "Flittle", level: 28 },
      { speciesId: 465, nome: "Tangrowth", level: 51 },
      { speciesId: 13, nome: "Weedle", level: 66 },
      { speciesId: 42, nome: "Golbat", level: 41 },
      { speciesId: 817, nome: "Drizzile", level: 49 }
    ]
  },

  {
    id: "katy",
    nome: "Katy",
    imagem: "/images/trainers/katy.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 2082,
    stardust: 3275,
    xp: 417,
    ia: "agressiva",
    time: [
      { speciesId: 400, nome: "Bibarel", level: 62 },
      { speciesId: 332, nome: "Cacturne", level: 11 },
      { speciesId: 794, nome: "Buzzwole", level: 69 },
      { speciesId: 308, nome: "Medicham", level: 36 },
      { speciesId: 925, nome: "Maushold-family-of-four", level: 12 },
      { speciesId: 406, nome: "Budew", level: 47 }
    ]
  },

  {
    id: "kiawe",
    nome: "Kiawe",
    imagem: "/images/trainers/kiawe.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 2704,
    stardust: 2856,
    xp: 286,
    ia: "estrategica",
    time: [
      { speciesId: 451, nome: "Skorupi", level: 73 },
      { speciesId: 890, nome: "Eternatus", level: 77 },
      { speciesId: 335, nome: "Zangoose", level: 57 },
      { speciesId: 594, nome: "Alomomola", level: 50 },
      { speciesId: 36, nome: "Clefable", level: 16 },
      { speciesId: 341, nome: "Corphish", level: 77 }
    ]
  },

  {
    id: "kieran-champion",
    nome: "Kieran-champion",
    imagem: "/images/trainers/kieran-champion.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 2146,
    stardust: 587,
    xp: 262,
    ia: "defensiva",
    time: [
      { speciesId: 921, nome: "Pawmi", level: 46 },
      { speciesId: 448, nome: "Lucario", level: 33 },
      { speciesId: 840, nome: "Applin", level: 70 },
      { speciesId: 606, nome: "Beheeyem", level: 22 },
      { speciesId: 861, nome: "Grimmsnarl", level: 80 },
      { speciesId: 447, nome: "Riolu", level: 25 }
    ]
  },

  {
    id: "kieran-festival",
    nome: "Kieran-festival",
    imagem: "/images/trainers/kieran-festival.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 1929,
    stardust: 3367,
    xp: 259,
    ia: "estrategica",
    time: [
      { speciesId: 625, nome: "Bisharp", level: 18 },
      { speciesId: 82, nome: "Magneton", level: 42 },
      { speciesId: 104, nome: "Cubone", level: 58 },
      { speciesId: 268, nome: "Cascoon", level: 38 },
      { speciesId: 745, nome: "Lycanroc-midday", level: 48 },
      { speciesId: 333, nome: "Swablu", level: 25 }
    ]
  },

  {
    id: "kieran",
    nome: "Kieran",
    imagem: "/images/trainers/kieran.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 1661,
    stardust: 5146,
    xp: 329,
    ia: "aleatoria",
    time: [
      { speciesId: 919, nome: "Nymble", level: 22 },
      { speciesId: 992, nome: "Iron-hands", level: 65 },
      { speciesId: 196, nome: "Espeon", level: 69 },
      { speciesId: 504, nome: "Patrat", level: 12 },
      { speciesId: 702, nome: "Dedenne", level: 63 },
      { speciesId: 104, nome: "Cubone", level: 16 }
    ]
  },

  {
    id: "kimonogirl-gen2",
    nome: "Kimonogirl-gen2",
    imagem: "/images/trainers/kimonogirl-gen2.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 983,
    stardust: 1138,
    xp: 382,
    ia: "defensiva",
    time: [
      { speciesId: 620, nome: "Mienshao", level: 28 },
      { speciesId: 388, nome: "Grotle", level: 65 },
      { speciesId: 857, nome: "Hattrem", level: 67 },
      { speciesId: 249, nome: "Lugia", level: 63 },
      { speciesId: 537, nome: "Seismitoad", level: 74 },
      { speciesId: 459, nome: "Snover", level: 51 }
    ]
  },

  {
    id: "kimonogirl",
    nome: "Kimonogirl",
    imagem: "/images/trainers/kimonogirl.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 1267,
    stardust: 391,
    xp: 155,
    ia: "aleatoria",
    time: [
      { speciesId: 204, nome: "Pineco", level: 67 },
      { speciesId: 162, nome: "Furret", level: 77 },
      { speciesId: 696, nome: "Tyrunt", level: 38 },
      { speciesId: 609, nome: "Chandelure", level: 42 },
      { speciesId: 360, nome: "Wynaut", level: 76 },
      { speciesId: 549, nome: "Lilligant", level: 24 }
    ]
  },

  {
    id: "kindler-gen3",
    nome: "Kindler-gen3",
    imagem: "/images/trainers/kindler-gen3.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 1724,
    stardust: 2355,
    xp: 63,
    ia: "defensiva",
    time: [
      { speciesId: 323, nome: "Camerupt", level: 33 },
      { speciesId: 734, nome: "Yungoos", level: 61 },
      { speciesId: 216, nome: "Teddiursa", level: 47 },
      { speciesId: 866, nome: "Mr-rime", level: 16 },
      { speciesId: 824, nome: "Blipbug", level: 57 },
      { speciesId: 751, nome: "Dewpider", level: 38 }
    ]
  },

  {
    id: "kindler-gen6",
    nome: "Kindler-gen6",
    imagem: "/images/trainers/kindler-gen6.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 2291,
    stardust: 2020,
    xp: 323,
    ia: "agressiva",
    time: [
      { speciesId: 311, nome: "Plusle", level: 70 },
      { speciesId: 271, nome: "Lombre", level: 51 },
      { speciesId: 329, nome: "Vibrava", level: 43 },
      { speciesId: 464, nome: "Rhyperior", level: 33 },
      { speciesId: 532, nome: "Timburr", level: 69 },
      { speciesId: 548, nome: "Petilil", level: 28 }
    ]
  },

  {
    id: "klara",
    nome: "Klara",
    imagem: "/images/trainers/klara.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 658,
    stardust: 556,
    xp: 492,
    ia: "agressiva",
    time: [
      { speciesId: 122, nome: "Mr-mime", level: 18 },
      { speciesId: 323, nome: "Camerupt", level: 17 },
      { speciesId: 902, nome: "Basculegion-male", level: 30 },
      { speciesId: 33, nome: "Nidorino", level: 21 },
      { speciesId: 846, nome: "Arrokuda", level: 24 },
      { speciesId: 938, nome: "Tadbulb", level: 56 }
    ]
  },

  {
    id: "kofu",
    nome: "Kofu",
    imagem: "/images/trainers/kofu.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 2900,
    stardust: 5243,
    xp: 203,
    ia: "defensiva",
    time: [
      { speciesId: 973, nome: "Flamigo", level: 37 },
      { speciesId: 316, nome: "Gulpin", level: 29 },
      { speciesId: 450, nome: "Hippowdon", level: 23 },
      { speciesId: 373, nome: "Salamence", level: 15 },
      { speciesId: 556, nome: "Maractus", level: 12 },
      { speciesId: 134, nome: "Vaporeon", level: 32 }
    ]
  },

  {
    id: "koga-gen1",
    nome: "Koga-gen1",
    imagem: "/images/trainers/koga-gen1.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 2867,
    stardust: 2522,
    xp: 378,
    ia: "agressiva",
    time: [
      { speciesId: 165, nome: "Ledyba", level: 51 },
      { speciesId: 548, nome: "Petilil", level: 11 },
      { speciesId: 250, nome: "Ho-oh", level: 60 },
      { speciesId: 580, nome: "Ducklett", level: 65 },
      { speciesId: 600, nome: "Klang", level: 43 },
      { speciesId: 189, nome: "Jumpluff", level: 47 }
    ]
  },

  {
    id: "koga-gen1rb",
    nome: "Koga-gen1rb",
    imagem: "/images/trainers/koga-gen1rb.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 2136,
    stardust: 1424,
    xp: 343,
    ia: "defensiva",
    time: [
      { speciesId: 909, nome: "Fuecoco", level: 22 },
      { speciesId: 35, nome: "Clefairy", level: 19 },
      { speciesId: 570, nome: "Zorua", level: 43 },
      { speciesId: 929, nome: "Dolliv", level: 39 },
      { speciesId: 329, nome: "Vibrava", level: 12 },
      { speciesId: 92, nome: "Gastly", level: 43 }
    ]
  },

  {
    id: "koga-gen2",
    nome: "Koga-gen2",
    imagem: "/images/trainers/koga-gen2.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 137,
    stardust: 5273,
    xp: 381,
    ia: "aleatoria",
    time: [
      { speciesId: 923, nome: "Pawmot", level: 15 },
      { speciesId: 927, nome: "Dachsbun", level: 31 },
      { speciesId: 237, nome: "Hitmontop", level: 79 },
      { speciesId: 510, nome: "Liepard", level: 40 },
      { speciesId: 356, nome: "Dusclops", level: 53 },
      { speciesId: 811, nome: "Thwackey", level: 47 }
    ]
  },

  {
    id: "koga-gen3",
    nome: "Koga-gen3",
    imagem: "/images/trainers/koga-gen3.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 778,
    stardust: 602,
    xp: 374,
    ia: "aleatoria",
    time: [
      { speciesId: 655, nome: "Delphox", level: 30 },
      { speciesId: 583, nome: "Vanillish", level: 18 },
      { speciesId: 537, nome: "Seismitoad", level: 41 },
      { speciesId: 796, nome: "Xurkitree", level: 10 },
      { speciesId: 23, nome: "Ekans", level: 33 },
      { speciesId: 576, nome: "Gothitelle", level: 33 }
    ]
  },

  {
    id: "koga-lgpe",
    nome: "Koga-lgpe",
    imagem: "/images/trainers/koga-lgpe.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 2550,
    stardust: 3950,
    xp: 163,
    ia: "estrategica",
    time: [
      { speciesId: 1005, nome: "Roaring-moon", level: 60 },
      { speciesId: 979, nome: "Annihilape", level: 10 },
      { speciesId: 454, nome: "Toxicroak", level: 24 },
      { speciesId: 433, nome: "Chingling", level: 45 },
      { speciesId: 771, nome: "Pyukumuku", level: 63 },
      { speciesId: 238, nome: "Smoochum", level: 13 }
    ]
  },

  {
    id: "koga",
    nome: "Koga",
    imagem: "/images/trainers/koga.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 991,
    stardust: 1171,
    xp: 354,
    ia: "defensiva",
    time: [
      { speciesId: 140, nome: "Kabuto", level: 64 },
      { speciesId: 1010, nome: "Iron-leaves", level: 32 },
      { speciesId: 220, nome: "Swinub", level: 60 },
      { speciesId: 698, nome: "Amaura", level: 56 },
      { speciesId: 504, nome: "Patrat", level: 70 },
      { speciesId: 982, nome: "Dudunsparce-two-segment", level: 26 }
    ]
  },

  {
    id: "korrina-masters",
    nome: "Korrina-masters",
    imagem: "/images/trainers/korrina-masters.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 2606,
    stardust: 3125,
    xp: 376,
    ia: "aleatoria",
    time: [
      { speciesId: 438, nome: "Bonsly", level: 63 },
      { speciesId: 550, nome: "Basculin-red-striped", level: 20 },
      { speciesId: 692, nome: "Clauncher", level: 73 },
      { speciesId: 756, nome: "Shiinotic", level: 54 },
      { speciesId: 423, nome: "Gastrodon", level: 23 },
      { speciesId: 165, nome: "Ledyba", level: 58 }
    ]
  },

  {
    id: "korrina",
    nome: "Korrina",
    imagem: "/images/trainers/korrina.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 828,
    stardust: 4190,
    xp: 245,
    ia: "aleatoria",
    time: [
      { speciesId: 723, nome: "Dartrix", level: 78 },
      { speciesId: 370, nome: "Luvdisc", level: 34 },
      { speciesId: 945, nome: "Grafaiai", level: 25 },
      { speciesId: 430, nome: "Honchkrow", level: 32 },
      { speciesId: 1016, nome: "Fezandipiti", level: 14 },
      { speciesId: 923, nome: "Pawmot", level: 66 }
    ]
  },

  {
    id: "kris-gen2",
    nome: "Kris-gen2",
    imagem: "/images/trainers/kris-gen2.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 1422,
    stardust: 2885,
    xp: 107,
    ia: "agressiva",
    time: [
      { speciesId: 162, nome: "Furret", level: 68 },
      { speciesId: 161, nome: "Sentret", level: 39 },
      { speciesId: 538, nome: "Throh", level: 78 },
      { speciesId: 1002, nome: "Chien-pao", level: 62 },
      { speciesId: 175, nome: "Togepi", level: 68 },
      { speciesId: 683, nome: "Aromatisse", level: 37 }
    ]
  },

  {
    id: "kris-masters",
    nome: "Kris-masters",
    imagem: "/images/trainers/kris-masters.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 690,
    stardust: 3889,
    xp: 327,
    ia: "estrategica",
    time: [
      { speciesId: 767, nome: "Wimpod", level: 19 },
      { speciesId: 921, nome: "Pawmi", level: 37 },
      { speciesId: 963, nome: "Finizen", level: 73 },
      { speciesId: 1010, nome: "Iron-leaves", level: 74 },
      { speciesId: 494, nome: "Victini", level: 74 },
      { speciesId: 124, nome: "Jynx", level: 20 }
    ]
  },

  {
    id: "kris",
    nome: "Kris",
    imagem: "/images/trainers/kris.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 1272,
    stardust: 1537,
    xp: 388,
    ia: "defensiva",
    time: [
      { speciesId: 230, nome: "Kingdra", level: 38 },
      { speciesId: 581, nome: "Swanna", level: 49 },
      { speciesId: 757, nome: "Salandit", level: 66 },
      { speciesId: 174, nome: "Igglybuff", level: 13 },
      { speciesId: 542, nome: "Leavanny", level: 54 },
      { speciesId: 552, nome: "Krokorok", level: 64 }
    ]
  },

  {
    id: "kukui-stand",
    nome: "Kukui-stand",
    imagem: "/images/trainers/kukui-stand.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 734,
    stardust: 4545,
    xp: 177,
    ia: "agressiva",
    time: [
      { speciesId: 29, nome: "Nidoran-f", level: 10 },
      { speciesId: 723, nome: "Dartrix", level: 77 },
      { speciesId: 506, nome: "Lillipup", level: 15 },
      { speciesId: 426, nome: "Drifblim", level: 42 },
      { speciesId: 604, nome: "Eelektross", level: 33 },
      { speciesId: 78, nome: "Rapidash", level: 43 }
    ]
  },

  {
    id: "kukui",
    nome: "Kukui",
    imagem: "/images/trainers/kukui.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 382,
    stardust: 4539,
    xp: 368,
    ia: "estrategica",
    time: [
      { speciesId: 903, nome: "Sneasler", level: 64 },
      { speciesId: 328, nome: "Trapinch", level: 57 },
      { speciesId: 612, nome: "Haxorus", level: 63 },
      { speciesId: 888, nome: "Zacian", level: 61 },
      { speciesId: 211, nome: "Qwilfish", level: 67 },
      { speciesId: 560, nome: "Scrafty", level: 60 }
    ]
  },

  {
    id: "kunoichi-conquest",
    nome: "Kunoichi-conquest",
    imagem: "/images/trainers/kunoichi-conquest.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 1446,
    stardust: 3261,
    xp: 144,
    ia: "defensiva",
    time: [
      { speciesId: 597, nome: "Ferroseed", level: 27 },
      { speciesId: 920, nome: "Lokix", level: 54 },
      { speciesId: 78, nome: "Rapidash", level: 62 },
      { speciesId: 725, nome: "Litten", level: 47 },
      { speciesId: 706, nome: "Goodra", level: 29 },
      { speciesId: 588, nome: "Karrablast", level: 34 }
    ]
  },

  {
    id: "kunoichi2-conquest",
    nome: "Kunoichi2-conquest",
    imagem: "/images/trainers/kunoichi2-conquest.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 345,
    stardust: 4031,
    xp: 105,
    ia: "estrategica",
    time: [
      { speciesId: 701, nome: "Hawlucha", level: 53 },
      { speciesId: 804, nome: "Naganadel", level: 58 },
      { speciesId: 104, nome: "Cubone", level: 33 },
      { speciesId: 342, nome: "Crawdaunt", level: 28 },
      { speciesId: 453, nome: "Croagunk", level: 68 },
      { speciesId: 473, nome: "Mamoswine", level: 16 }
    ]
  },

  {
    id: "kurt",
    nome: "Kurt",
    imagem: "/images/trainers/kurt.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 934,
    stardust: 4196,
    xp: 122,
    ia: "agressiva",
    time: [
      { speciesId: 481, nome: "Mesprit", level: 38 },
      { speciesId: 817, nome: "Drizzile", level: 58 },
      { speciesId: 518, nome: "Musharna", level: 75 },
      { speciesId: 958, nome: "Tinkatuff", level: 48 },
      { speciesId: 732, nome: "Trumbeak", level: 75 },
      { speciesId: 546, nome: "Cottonee", level: 80 }
    ]
  },

  {
    id: "lacey",
    nome: "Lacey",
    imagem: "/images/trainers/lacey.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 2718,
    stardust: 1461,
    xp: 335,
    ia: "aleatoria",
    time: [
      { speciesId: 833, nome: "Chewtle", level: 31 },
      { speciesId: 33, nome: "Nidorino", level: 64 },
      { speciesId: 1, nome: "Bulbasaur", level: 60 },
      { speciesId: 591, nome: "Amoonguss", level: 54 },
      { speciesId: 901, nome: "Ursaluna", level: 51 },
      { speciesId: 217, nome: "Ursaring", level: 58 }
    ]
  },

  {
    id: "lady-gen3",
    nome: "Lady-gen3",
    imagem: "/images/trainers/lady-gen3.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 1073,
    stardust: 1147,
    xp: 337,
    ia: "agressiva",
    time: [
      { speciesId: 799, nome: "Guzzlord", level: 28 },
      { speciesId: 247, nome: "Pupitar", level: 34 },
      { speciesId: 748, nome: "Toxapex", level: 18 },
      { speciesId: 667, nome: "Litleo", level: 24 },
      { speciesId: 920, nome: "Lokix", level: 12 },
      { speciesId: 302, nome: "Sableye", level: 79 }
    ]
  },

  {
    id: "lady-gen3rs",
    nome: "Lady-gen3rs",
    imagem: "/images/trainers/lady-gen3rs.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 2750,
    stardust: 162,
    xp: 170,
    ia: "estrategica",
    time: [
      { speciesId: 505, nome: "Watchog", level: 16 },
      { speciesId: 599, nome: "Klink", level: 42 },
      { speciesId: 281, nome: "Kirlia", level: 62 },
      { speciesId: 357, nome: "Tropius", level: 48 },
      { speciesId: 307, nome: "Meditite", level: 77 },
      { speciesId: 499, nome: "Pignite", level: 23 }
    ]
  },

  {
    id: "lady-gen4",
    nome: "Lady-gen4",
    imagem: "/images/trainers/lady-gen4.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 2743,
    stardust: 3628,
    xp: 158,
    ia: "defensiva",
    time: [
      { speciesId: 838, nome: "Carkol", level: 39 },
      { speciesId: 683, nome: "Aromatisse", level: 68 },
      { speciesId: 984, nome: "Great-tusk", level: 78 },
      { speciesId: 139, nome: "Omastar", level: 34 },
      { speciesId: 8, nome: "Wartortle", level: 29 },
      { speciesId: 217, nome: "Ursaring", level: 26 }
    ]
  },

  {
    id: "lady-gen6",
    nome: "Lady-gen6",
    imagem: "/images/trainers/lady-gen6.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 1094,
    stardust: 663,
    xp: 407,
    ia: "agressiva",
    time: [
      { speciesId: 1022, nome: "Iron-boulder", level: 36 },
      { speciesId: 392, nome: "Infernape", level: 25 },
      { speciesId: 49, nome: "Venomoth", level: 42 },
      { speciesId: 518, nome: "Musharna", level: 78 },
      { speciesId: 99, nome: "Kingler", level: 35 },
      { speciesId: 728, nome: "Popplio", level: 44 }
    ]
  },

  {
    id: "lady-gen6oras",
    nome: "Lady-gen6oras",
    imagem: "/images/trainers/lady-gen6oras.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 2903,
    stardust: 2028,
    xp: 239,
    ia: "defensiva",
    time: [
      { speciesId: 836, nome: "Boltund", level: 78 },
      { speciesId: 189, nome: "Jumpluff", level: 35 },
      { speciesId: 142, nome: "Aerodactyl", level: 68 },
      { speciesId: 494, nome: "Victini", level: 70 },
      { speciesId: 369, nome: "Relicanth", level: 71 },
      { speciesId: 212, nome: "Scizor", level: 10 }
    ]
  },

  {
    id: "lady",
    nome: "Lady",
    imagem: "/images/trainers/lady.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 676,
    stardust: 894,
    xp: 464,
    ia: "agressiva",
    time: [
      { speciesId: 307, nome: "Meditite", level: 19 },
      { speciesId: 703, nome: "Carbink", level: 42 },
      { speciesId: 235, nome: "Smeargle", level: 36 },
      { speciesId: 521, nome: "Unfezant", level: 55 },
      { speciesId: 473, nome: "Mamoswine", level: 45 },
      { speciesId: 630, nome: "Mandibuzz", level: 63 }
    ]
  },

  {
    id: "lana-masters",
    nome: "Lana-masters",
    imagem: "/images/trainers/lana-masters.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 2373,
    stardust: 475,
    xp: 230,
    ia: "aleatoria",
    time: [
      { speciesId: 245, nome: "Suicune", level: 49 },
      { speciesId: 891, nome: "Kubfu", level: 40 },
      { speciesId: 500, nome: "Emboar", level: 52 },
      { speciesId: 961, nome: "Wugtrio", level: 12 },
      { speciesId: 227, nome: "Skarmory", level: 62 },
      { speciesId: 559, nome: "Scraggy", level: 42 }
    ]
  },

  {
    id: "lana",
    nome: "Lana",
    imagem: "/images/trainers/lana.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 2187,
    stardust: 4951,
    xp: 153,
    ia: "aleatoria",
    time: [
      { speciesId: 952, nome: "Scovillain", level: 57 },
      { speciesId: 417, nome: "Pachirisu", level: 59 },
      { speciesId: 830, nome: "Eldegoss", level: 69 },
      { speciesId: 990, nome: "Iron-treads", level: 68 },
      { speciesId: 955, nome: "Flittle", level: 66 },
      { speciesId: 880, nome: "Dracozolt", level: 72 }
    ]
  },

  {
    id: "lance-gen1",
    nome: "Lance-gen1",
    imagem: "/images/trainers/lance-gen1.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 2663,
    stardust: 3524,
    xp: 137,
    ia: "aleatoria",
    time: [
      { speciesId: 251, nome: "Celebi", level: 15 },
      { speciesId: 910, nome: "Crocalor", level: 58 },
      { speciesId: 793, nome: "Nihilego", level: 65 },
      { speciesId: 876, nome: "Indeedee-male", level: 37 },
      { speciesId: 896, nome: "Glastrier", level: 30 },
      { speciesId: 754, nome: "Lurantis", level: 34 }
    ]
  },

  {
    id: "lance-gen1rb",
    nome: "Lance-gen1rb",
    imagem: "/images/trainers/lance-gen1rb.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 2937,
    stardust: 4391,
    xp: 50,
    ia: "defensiva",
    time: [
      { speciesId: 457, nome: "Lumineon", level: 52 },
      { speciesId: 636, nome: "Larvesta", level: 34 },
      { speciesId: 628, nome: "Braviary", level: 35 },
      { speciesId: 313, nome: "Volbeat", level: 23 },
      { speciesId: 181, nome: "Ampharos", level: 37 },
      { speciesId: 900, nome: "Kleavor", level: 62 }
    ]
  },

  {
    id: "lance-gen2",
    nome: "Lance-gen2",
    imagem: "/images/trainers/lance-gen2.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 2120,
    stardust: 810,
    xp: 466,
    ia: "defensiva",
    time: [
      { speciesId: 964, nome: "Palafin-zero", level: 25 },
      { speciesId: 85, nome: "Dodrio", level: 56 },
      { speciesId: 907, nome: "Floragato", level: 58 },
      { speciesId: 204, nome: "Pineco", level: 70 },
      { speciesId: 1010, nome: "Iron-leaves", level: 71 },
      { speciesId: 276, nome: "Taillow", level: 25 }
    ]
  },

  {
    id: "lance-gen3",
    nome: "Lance-gen3",
    imagem: "/images/trainers/lance-gen3.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 857,
    stardust: 3759,
    xp: 274,
    ia: "estrategica",
    time: [
      { speciesId: 790, nome: "Cosmoem", level: 32 },
      { speciesId: 171, nome: "Lanturn", level: 77 },
      { speciesId: 110, nome: "Weezing", level: 61 },
      { speciesId: 842, nome: "Appletun", level: 62 },
      { speciesId: 840, nome: "Applin", level: 77 },
      { speciesId: 734, nome: "Yungoos", level: 32 }
    ]
  },

  {
    id: "lance-lgpe",
    nome: "Lance-lgpe",
    imagem: "/images/trainers/lance-lgpe.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 1093,
    stardust: 3047,
    xp: 472,
    ia: "defensiva",
    time: [
      { speciesId: 605, nome: "Elgyem", level: 76 },
      { speciesId: 878, nome: "Cufant", level: 24 },
      { speciesId: 404, nome: "Luxio", level: 32 },
      { speciesId: 858, nome: "Hatterene", level: 15 },
      { speciesId: 195, nome: "Quagsire", level: 42 },
      { speciesId: 566, nome: "Archen", level: 18 }
    ]
  },

  {
    id: "lance-masters",
    nome: "Lance-masters",
    imagem: "/images/trainers/lance-masters.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 656,
    stardust: 2337,
    xp: 398,
    ia: "defensiva",
    time: [
      { speciesId: 639, nome: "Terrakion", level: 26 },
      { speciesId: 179, nome: "Mareep", level: 41 },
      { speciesId: 868, nome: "Milcery", level: 40 },
      { speciesId: 443, nome: "Gible", level: 75 },
      { speciesId: 421, nome: "Cherrim", level: 48 },
      { speciesId: 229, nome: "Houndoom", level: 56 }
    ]
  },

  {
    id: "lance-masters2",
    nome: "Lance-masters2",
    imagem: "/images/trainers/lance-masters2.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 1282,
    stardust: 1417,
    xp: 218,
    ia: "defensiva",
    time: [
      { speciesId: 18, nome: "Pidgeot", level: 15 },
      { speciesId: 590, nome: "Foongus", level: 65 },
      { speciesId: 529, nome: "Drilbur", level: 72 },
      { speciesId: 87, nome: "Dewgong", level: 69 },
      { speciesId: 377, nome: "Regirock", level: 66 },
      { speciesId: 977, nome: "Dondozo", level: 59 }
    ]
  },

  {
    id: "lance",
    nome: "Lance",
    imagem: "/images/trainers/lance.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 1007,
    stardust: 5012,
    xp: 374,
    ia: "aleatoria",
    time: [
      { speciesId: 683, nome: "Aromatisse", level: 19 },
      { speciesId: 832, nome: "Dubwool", level: 62 },
      { speciesId: 845, nome: "Cramorant", level: 27 },
      { speciesId: 533, nome: "Gurdurr", level: 69 },
      { speciesId: 634, nome: "Zweilous", level: 32 },
      { speciesId: 524, nome: "Roggenrola", level: 72 }
    ]
  },

  {
    id: "lanette",
    nome: "Lanette",
    imagem: "/images/trainers/lanette.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 1701,
    stardust: 2229,
    xp: 135,
    ia: "estrategica",
    time: [
      { speciesId: 75, nome: "Graveler", level: 29 },
      { speciesId: 52, nome: "Meowth", level: 43 },
      { speciesId: 844, nome: "Sandaconda", level: 21 },
      { speciesId: 246, nome: "Larvitar", level: 71 },
      { speciesId: 273, nome: "Seedot", level: 32 },
      { speciesId: 647, nome: "Keldeo-ordinary", level: 65 }
    ]
  },

  {
    id: "larry",
    nome: "Larry",
    imagem: "/images/trainers/larry.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "dificil",
    recompensa: 1506,
    stardust: 5242,
    xp: 414,
    ia: "agressiva",
    time: [
      { speciesId: 75, nome: "Graveler", level: 13 },
      { speciesId: 224, nome: "Octillery", level: 75 },
      { speciesId: 476, nome: "Probopass", level: 75 },
      { speciesId: 207, nome: "Gligar", level: 67 },
      { speciesId: 897, nome: "Spectrier", level: 37 },
      { speciesId: 677, nome: "Espurr", level: 19 }
    ]
  },

  {
    id: "lass-gen1",
    nome: "Lass-gen1",
    imagem: "/images/trainers/lass-gen1.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 1809,
    stardust: 3884,
    xp: 292,
    ia: "estrategica",
    time: [
      { speciesId: 309, nome: "Electrike", level: 19 },
      { speciesId: 658, nome: "Greninja", level: 69 },
      { speciesId: 401, nome: "Kricketot", level: 27 },
      { speciesId: 621, nome: "Druddigon", level: 21 },
      { speciesId: 292, nome: "Shedinja", level: 80 },
      { speciesId: 28, nome: "Sandslash", level: 16 }
    ]
  },

  {
    id: "lass-gen1rb",
    nome: "Lass-gen1rb",
    imagem: "/images/trainers/lass-gen1rb.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 361,
    stardust: 4818,
    xp: 184,
    ia: "defensiva",
    time: [
      { speciesId: 459, nome: "Snover", level: 61 },
      { speciesId: 307, nome: "Meditite", level: 45 },
      { speciesId: 84, nome: "Doduo", level: 18 },
      { speciesId: 542, nome: "Leavanny", level: 49 },
      { speciesId: 655, nome: "Delphox", level: 76 },
      { speciesId: 472, nome: "Gliscor", level: 35 }
    ]
  },

  {
    id: "lass-gen2",
    nome: "Lass-gen2",
    imagem: "/images/trainers/lass-gen2.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 1789,
    stardust: 2224,
    xp: 87,
    ia: "aleatoria",
    time: [
      { speciesId: 468, nome: "Togekiss", level: 17 },
      { speciesId: 701, nome: "Hawlucha", level: 67 },
      { speciesId: 530, nome: "Excadrill", level: 14 },
      { speciesId: 800, nome: "Necrozma", level: 38 },
      { speciesId: 452, nome: "Drapion", level: 10 },
      { speciesId: 750, nome: "Mudsdale", level: 56 }
    ]
  },

  {
    id: "lass-gen3",
    nome: "Lass-gen3",
    imagem: "/images/trainers/lass-gen3.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 115,
    stardust: 4979,
    xp: 414,
    ia: "defensiva",
    time: [
      { speciesId: 762, nome: "Steenee", level: 52 },
      { speciesId: 52, nome: "Meowth", level: 40 },
      { speciesId: 85, nome: "Dodrio", level: 77 },
      { speciesId: 265, nome: "Wurmple", level: 33 },
      { speciesId: 892, nome: "Urshifu-single-strike", level: 52 },
      { speciesId: 485, nome: "Heatran", level: 33 }
    ]
  },

  {
    id: "lass-gen3rs",
    nome: "Lass-gen3rs",
    imagem: "/images/trainers/lass-gen3rs.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 2286,
    stardust: 3112,
    xp: 243,
    ia: "agressiva",
    time: [
      { speciesId: 312, nome: "Minun", level: 38 },
      { speciesId: 143, nome: "Snorlax", level: 33 },
      { speciesId: 532, nome: "Timburr", level: 79 },
      { speciesId: 802, nome: "Marshadow", level: 80 },
      { speciesId: 409, nome: "Rampardos", level: 71 },
      { speciesId: 328, nome: "Trapinch", level: 75 }
    ]
  },

  {
    id: "lass-gen4",
    nome: "Lass-gen4",
    imagem: "/images/trainers/lass-gen4.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 1737,
    stardust: 1665,
    xp: 353,
    ia: "aleatoria",
    time: [
      { speciesId: 919, nome: "Nymble", level: 25 },
      { speciesId: 155, nome: "Cyndaquil", level: 50 },
      { speciesId: 387, nome: "Turtwig", level: 48 },
      { speciesId: 117, nome: "Seadra", level: 27 },
      { speciesId: 1001, nome: "Wo-chien", level: 56 },
      { speciesId: 876, nome: "Indeedee-male", level: 54 }
    ]
  },

  {
    id: "lass-gen4dp",
    nome: "Lass-gen4dp",
    imagem: "/images/trainers/lass-gen4dp.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 1121,
    stardust: 2686,
    xp: 171,
    ia: "estrategica",
    time: [
      { speciesId: 417, nome: "Pachirisu", level: 63 },
      { speciesId: 1014, nome: "Okidogi", level: 63 },
      { speciesId: 929, nome: "Dolliv", level: 45 },
      { speciesId: 102, nome: "Exeggcute", level: 78 },
      { speciesId: 303, nome: "Mawile", level: 50 },
      { speciesId: 163, nome: "Hoothoot", level: 80 }
    ]
  },

  {
    id: "lass-gen6",
    nome: "Lass-gen6",
    imagem: "/images/trainers/lass-gen6.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 2609,
    stardust: 4965,
    xp: 302,
    ia: "agressiva",
    time: [
      { speciesId: 885, nome: "Dreepy", level: 52 },
      { speciesId: 840, nome: "Applin", level: 77 },
      { speciesId: 613, nome: "Cubchoo", level: 16 },
      { speciesId: 17, nome: "Pidgeotto", level: 36 },
      { speciesId: 943, nome: "Mabosstiff", level: 48 },
      { speciesId: 964, nome: "Palafin-zero", level: 17 }
    ]
  },

  {
    id: "lass-gen6oras",
    nome: "Lass-gen6oras",
    imagem: "/images/trainers/lass-gen6oras.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 301,
    stardust: 4391,
    xp: 370,
    ia: "defensiva",
    time: [
      { speciesId: 552, nome: "Krokorok", level: 16 },
      { speciesId: 105, nome: "Marowak", level: 35 },
      { speciesId: 649, nome: "Genesect", level: 28 },
      { speciesId: 41, nome: "Zubat", level: 72 },
      { speciesId: 748, nome: "Toxapex", level: 75 },
      { speciesId: 983, nome: "Kingambit", level: 16 }
    ]
  },

  {
    id: "lass-gen7",
    nome: "Lass-gen7",
    imagem: "/images/trainers/lass-gen7.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 1950,
    stardust: 1072,
    xp: 209,
    ia: "agressiva",
    time: [
      { speciesId: 190, nome: "Aipom", level: 54 },
      { speciesId: 684, nome: "Swirlix", level: 49 },
      { speciesId: 869, nome: "Alcremie", level: 43 },
      { speciesId: 113, nome: "Chansey", level: 28 },
      { speciesId: 729, nome: "Brionne", level: 79 },
      { speciesId: 117, nome: "Seadra", level: 13 }
    ]
  },

  {
    id: "lass-gen8",
    nome: "Lass-gen8",
    imagem: "/images/trainers/lass-gen8.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 2719,
    stardust: 1284,
    xp: 497,
    ia: "aleatoria",
    time: [
      { speciesId: 580, nome: "Ducklett", level: 21 },
      { speciesId: 881, nome: "Arctozolt", level: 34 },
      { speciesId: 236, nome: "Tyrogue", level: 44 },
      { speciesId: 984, nome: "Great-tusk", level: 10 },
      { speciesId: 266, nome: "Silcoon", level: 48 },
      { speciesId: 82, nome: "Magneton", level: 78 }
    ]
  },

  {
    id: "lass",
    nome: "Lass",
    imagem: "/images/trainers/lass.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 1506,
    stardust: 3014,
    xp: 132,
    ia: "agressiva",
    time: [
      { speciesId: 22, nome: "Fearow", level: 29 },
      { speciesId: 281, nome: "Kirlia", level: 39 },
      { speciesId: 27, nome: "Sandshrew", level: 20 },
      { speciesId: 394, nome: "Prinplup", level: 57 },
      { speciesId: 337, nome: "Lunatone", level: 52 },
      { speciesId: 1007, nome: "Koraidon", level: 21 }
    ]
  },

  {
    id: "laventon",
    nome: "Laventon",
    imagem: "/images/trainers/laventon.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 2561,
    stardust: 4817,
    xp: 221,
    ia: "agressiva",
    time: [
      { speciesId: 176, nome: "Togetic", level: 36 },
      { speciesId: 977, nome: "Dondozo", level: 64 },
      { speciesId: 71, nome: "Victreebel", level: 66 },
      { speciesId: 581, nome: "Swanna", level: 78 },
      { speciesId: 971, nome: "Greavard", level: 25 },
      { speciesId: 182, nome: "Bellossom", level: 41 }
    ]
  },

  {
    id: "laventon2",
    nome: "Laventon2",
    imagem: "/images/trainers/laventon2.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 2307,
    stardust: 155,
    xp: 371,
    ia: "defensiva",
    time: [
      { speciesId: 250, nome: "Ho-oh", level: 29 },
      { speciesId: 680, nome: "Doublade", level: 65 },
      { speciesId: 79, nome: "Slowpoke", level: 56 },
      { speciesId: 687, nome: "Malamar", level: 41 },
      { speciesId: 99, nome: "Kingler", level: 74 },
      { speciesId: 469, nome: "Yanmega", level: 13 }
    ]
  },

  {
    id: "leaf-gen3",
    nome: "Leaf-gen3",
    imagem: "/images/trainers/leaf-gen3.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "dificil",
    recompensa: 1012,
    stardust: 5232,
    xp: 115,
    ia: "defensiva",
    time: [
      { speciesId: 125, nome: "Electabuzz", level: 12 },
      { speciesId: 755, nome: "Morelull", level: 80 },
      { speciesId: 191, nome: "Sunkern", level: 14 },
      { speciesId: 599, nome: "Klink", level: 29 },
      { speciesId: 760, nome: "Bewear", level: 23 },
      { speciesId: 192, nome: "Sunflora", level: 19 }
    ]
  },

  {
    id: "leaf-masters",
    nome: "Leaf-masters",
    imagem: "/images/trainers/leaf-masters.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 2122,
    stardust: 3440,
    xp: 383,
    ia: "agressiva",
    time: [
      { speciesId: 254, nome: "Sceptile", level: 78 },
      { speciesId: 6, nome: "Charizard", level: 78 },
      { speciesId: 923, nome: "Pawmot", level: 53 },
      { speciesId: 597, nome: "Ferroseed", level: 74 },
      { speciesId: 648, nome: "Meloetta-aria", level: 66 },
      { speciesId: 741, nome: "Oricorio-baile", level: 79 }
    ]
  },

  {
    id: "leaf-masters2",
    nome: "Leaf-masters2",
    imagem: "/images/trainers/leaf-masters2.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 570,
    stardust: 5380,
    xp: 215,
    ia: "agressiva",
    time: [
      { speciesId: 371, nome: "Bagon", level: 18 },
      { speciesId: 274, nome: "Nuzleaf", level: 30 },
      { speciesId: 330, nome: "Flygon", level: 43 },
      { speciesId: 206, nome: "Dunsparce", level: 39 },
      { speciesId: 545, nome: "Scolipede", level: 19 },
      { speciesId: 788, nome: "Tapu-fini", level: 61 }
    ]
  },

  {
    id: "leaguestaff",
    nome: "Leaguestaff",
    imagem: "/images/trainers/leaguestaff.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 314,
    stardust: 2916,
    xp: 240,
    ia: "defensiva",
    time: [
      { speciesId: 200, nome: "Misdreavus", level: 33 },
      { speciesId: 952, nome: "Scovillain", level: 10 },
      { speciesId: 775, nome: "Komala", level: 52 },
      { speciesId: 94, nome: "Gengar", level: 64 },
      { speciesId: 615, nome: "Cryogonal", level: 35 },
      { speciesId: 346, nome: "Cradily", level: 38 }
    ]
  },

  {
    id: "leaguestafff",
    nome: "Leaguestafff",
    imagem: "/images/trainers/leaguestafff.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 2302,
    stardust: 3934,
    xp: 85,
    ia: "aleatoria",
    time: [
      { speciesId: 244, nome: "Entei", level: 67 },
      { speciesId: 535, nome: "Tympole", level: 24 },
      { speciesId: 656, nome: "Froakie", level: 13 },
      { speciesId: 553, nome: "Krookodile", level: 34 },
      { speciesId: 233, nome: "Porygon2", level: 24 },
      { speciesId: 821, nome: "Rookidee", level: 76 }
    ]
  },

  {
    id: "lenora",
    nome: "Lenora",
    imagem: "/images/trainers/lenora.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 2348,
    stardust: 1328,
    xp: 97,
    ia: "defensiva",
    time: [
      { speciesId: 537, nome: "Seismitoad", level: 19 },
      { speciesId: 86, nome: "Seel", level: 17 },
      { speciesId: 83, nome: "Farfetchd", level: 78 },
      { speciesId: 88, nome: "Grimer", level: 62 },
      { speciesId: 129, nome: "Magikarp", level: 10 },
      { speciesId: 619, nome: "Mienfoo", level: 32 }
    ]
  },

  {
    id: "leon-masters",
    nome: "Leon-masters",
    imagem: "/images/trainers/leon-masters.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 1452,
    stardust: 4691,
    xp: 144,
    ia: "agressiva",
    time: [
      { speciesId: 582, nome: "Vanillite", level: 46 },
      { speciesId: 719, nome: "Diancie", level: 51 },
      { speciesId: 15, nome: "Beedrill", level: 14 },
      { speciesId: 259, nome: "Marshtomp", level: 23 },
      { speciesId: 316, nome: "Gulpin", level: 79 },
      { speciesId: 817, nome: "Drizzile", level: 31 }
    ]
  },

  {
    id: "leon-masters2",
    nome: "Leon-masters2",
    imagem: "/images/trainers/leon-masters2.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 2710,
    stardust: 4881,
    xp: 59,
    ia: "agressiva",
    time: [
      { speciesId: 194, nome: "Wooper", level: 68 },
      { speciesId: 325, nome: "Spoink", level: 73 },
      { speciesId: 748, nome: "Toxapex", level: 36 },
      { speciesId: 478, nome: "Froslass", level: 79 },
      { speciesId: 121, nome: "Starmie", level: 76 },
      { speciesId: 59, nome: "Arcanine", level: 23 }
    ]
  },

  {
    id: "leon-tower",
    nome: "Leon-tower",
    imagem: "/images/trainers/leon-tower.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 1449,
    stardust: 4937,
    xp: 402,
    ia: "aleatoria",
    time: [
      { speciesId: 11, nome: "Metapod", level: 56 },
      { speciesId: 982, nome: "Dudunsparce-two-segment", level: 10 },
      { speciesId: 590, nome: "Foongus", level: 46 },
      { speciesId: 573, nome: "Cinccino", level: 23 },
      { speciesId: 569, nome: "Garbodor", level: 17 },
      { speciesId: 227, nome: "Skarmory", level: 42 }
    ]
  },

  {
    id: "leon",
    nome: "Leon",
    imagem: "/images/trainers/leon.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 2933,
    stardust: 4247,
    xp: 127,
    ia: "aleatoria",
    time: [
      { speciesId: 672, nome: "Skiddo", level: 36 },
      { speciesId: 373, nome: "Salamence", level: 13 },
      { speciesId: 481, nome: "Mesprit", level: 19 },
      { speciesId: 471, nome: "Glaceon", level: 74 },
      { speciesId: 998, nome: "Baxcalibur", level: 47 },
      { speciesId: 896, nome: "Glastrier", level: 37 }
    ]
  },

  {
    id: "li",
    nome: "Li",
    imagem: "/images/trainers/li.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 1785,
    stardust: 3713,
    xp: 314,
    ia: "defensiva",
    time: [
      { speciesId: 942, nome: "Maschiff", level: 49 },
      { speciesId: 666, nome: "Vivillon", level: 41 },
      { speciesId: 985, nome: "Scream-tail", level: 57 },
      { speciesId: 951, nome: "Capsakid", level: 79 },
      { speciesId: 831, nome: "Wooloo", level: 23 },
      { speciesId: 419, nome: "Floatzel", level: 62 }
    ]
  },

  {
    id: "lian",
    nome: "Lian",
    imagem: "/images/trainers/lian.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 1105,
    stardust: 3813,
    xp: 399,
    ia: "aleatoria",
    time: [
      { speciesId: 353, nome: "Shuppet", level: 78 },
      { speciesId: 987, nome: "Flutter-mane", level: 74 },
      { speciesId: 419, nome: "Floatzel", level: 29 },
      { speciesId: 376, nome: "Metagross", level: 58 },
      { speciesId: 962, nome: "Bombirdier", level: 68 },
      { speciesId: 527, nome: "Woobat", level: 76 }
    ]
  },

  {
    id: "lida",
    nome: "Lida",
    imagem: "/images/trainers/lida.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 731,
    stardust: 3641,
    xp: 108,
    ia: "defensiva",
    time: [
      { speciesId: 866, nome: "Mr-rime", level: 77 },
      { speciesId: 146, nome: "Moltres", level: 33 },
      { speciesId: 895, nome: "Regidrago", level: 64 },
      { speciesId: 643, nome: "Reshiram", level: 44 },
      { speciesId: 722, nome: "Rowlet", level: 63 },
      { speciesId: 802, nome: "Marshadow", level: 76 }
    ]
  },

  {
    id: "liko",
    nome: "Liko",
    imagem: "/images/trainers/liko.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 1729,
    stardust: 1456,
    xp: 313,
    ia: "estrategica",
    time: [
      { speciesId: 807, nome: "Zeraora", level: 53 },
      { speciesId: 928, nome: "Smoliv", level: 24 },
      { speciesId: 15, nome: "Beedrill", level: 46 },
      { speciesId: 371, nome: "Bagon", level: 69 },
      { speciesId: 743, nome: "Ribombee", level: 58 },
      { speciesId: 249, nome: "Lugia", level: 74 }
    ]
  },

  {
    id: "lillie-masters",
    nome: "Lillie-masters",
    imagem: "/images/trainers/lillie-masters.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 315,
    stardust: 1521,
    xp: 416,
    ia: "agressiva",
    time: [
      { speciesId: 398, nome: "Staraptor", level: 19 },
      { speciesId: 326, nome: "Grumpig", level: 57 },
      { speciesId: 930, nome: "Arboliva", level: 59 },
      { speciesId: 862, nome: "Obstagoon", level: 18 },
      { speciesId: 638, nome: "Cobalion", level: 47 },
      { speciesId: 37, nome: "Vulpix", level: 45 }
    ]
  },

  {
    id: "lillie-masters2",
    nome: "Lillie-masters2",
    imagem: "/images/trainers/lillie-masters2.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 381,
    stardust: 3537,
    xp: 269,
    ia: "agressiva",
    time: [
      { speciesId: 342, nome: "Crawdaunt", level: 70 },
      { speciesId: 480, nome: "Uxie", level: 36 },
      { speciesId: 15, nome: "Beedrill", level: 39 },
      { speciesId: 287, nome: "Slakoth", level: 36 },
      { speciesId: 198, nome: "Murkrow", level: 26 },
      { speciesId: 34, nome: "Nidoking", level: 11 }
    ]
  },

  {
    id: "lillie-masters3",
    nome: "Lillie-masters3",
    imagem: "/images/trainers/lillie-masters3.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 850,
    stardust: 214,
    xp: 473,
    ia: "estrategica",
    time: [
      { speciesId: 804, nome: "Naganadel", level: 62 },
      { speciesId: 672, nome: "Skiddo", level: 51 },
      { speciesId: 620, nome: "Mienshao", level: 64 },
      { speciesId: 867, nome: "Runerigus", level: 78 },
      { speciesId: 229, nome: "Houndoom", level: 75 },
      { speciesId: 535, nome: "Tympole", level: 42 }
    ]
  },

  {
    id: "lillie-z",
    nome: "Lillie-z",
    imagem: "/images/trainers/lillie-z.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 885,
    stardust: 5013,
    xp: 211,
    ia: "aleatoria",
    time: [
      { speciesId: 88, nome: "Grimer", level: 17 },
      { speciesId: 772, nome: "Type-null", level: 12 },
      { speciesId: 922, nome: "Pawmo", level: 59 },
      { speciesId: 402, nome: "Kricketune", level: 34 },
      { speciesId: 373, nome: "Salamence", level: 26 },
      { speciesId: 957, nome: "Tinkatink", level: 76 }
    ]
  },

  {
    id: "lillie",
    nome: "Lillie",
    imagem: "/images/trainers/lillie.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 2029,
    stardust: 1099,
    xp: 255,
    ia: "defensiva",
    time: [
      { speciesId: 280, nome: "Ralts", level: 12 },
      { speciesId: 741, nome: "Oricorio-baile", level: 25 },
      { speciesId: 546, nome: "Cottonee", level: 15 },
      { speciesId: 962, nome: "Bombirdier", level: 15 },
      { speciesId: 959, nome: "Tinkaton", level: 23 },
      { speciesId: 648, nome: "Meloetta-aria", level: 33 }
    ]
  },

  {
    id: "linebacker",
    nome: "Linebacker",
    imagem: "/images/trainers/linebacker.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 2503,
    stardust: 5216,
    xp: 191,
    ia: "agressiva",
    time: [
      { speciesId: 1025, nome: "Pecharunt", level: 50 },
      { speciesId: 9, nome: "Blastoise", level: 28 },
      { speciesId: 1010, nome: "Iron-leaves", level: 63 },
      { speciesId: 279, nome: "Pelipper", level: 14 },
      { speciesId: 791, nome: "Solgaleo", level: 59 },
      { speciesId: 228, nome: "Houndour", level: 33 }
    ]
  },

  {
    id: "lisia-masters",
    nome: "Lisia-masters",
    imagem: "/images/trainers/lisia-masters.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 497,
    stardust: 2530,
    xp: 89,
    ia: "aleatoria",
    time: [
      { speciesId: 58, nome: "Growlithe", level: 69 },
      { speciesId: 490, nome: "Manaphy", level: 59 },
      { speciesId: 780, nome: "Drampa", level: 68 },
      { speciesId: 655, nome: "Delphox", level: 59 },
      { speciesId: 339, nome: "Barboach", level: 51 },
      { speciesId: 432, nome: "Purugly", level: 43 }
    ]
  },

  {
    id: "lisia",
    nome: "Lisia",
    imagem: "/images/trainers/lisia.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 2720,
    stardust: 4599,
    xp: 94,
    ia: "defensiva",
    time: [
      { speciesId: 509, nome: "Purrloin", level: 31 },
      { speciesId: 400, nome: "Bibarel", level: 48 },
      { speciesId: 2, nome: "Ivysaur", level: 36 },
      { speciesId: 220, nome: "Swinub", level: 26 },
      { speciesId: 86, nome: "Seel", level: 21 },
      { speciesId: 260, nome: "Swampert", level: 44 }
    ]
  },

  {
    id: "liza-gen6",
    nome: "Liza-gen6",
    imagem: "/images/trainers/liza-gen6.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 922,
    stardust: 1992,
    xp: 185,
    ia: "defensiva",
    time: [
      { speciesId: 375, nome: "Metang", level: 11 },
      { speciesId: 863, nome: "Perrserker", level: 26 },
      { speciesId: 305, nome: "Lairon", level: 37 },
      { speciesId: 143, nome: "Snorlax", level: 24 },
      { speciesId: 587, nome: "Emolga", level: 49 },
      { speciesId: 857, nome: "Hattrem", level: 31 }
    ]
  },

  {
    id: "liza-masters",
    nome: "Liza-masters",
    imagem: "/images/trainers/liza-masters.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 411,
    stardust: 2909,
    xp: 235,
    ia: "aleatoria",
    time: [
      { speciesId: 467, nome: "Magmortar", level: 68 },
      { speciesId: 960, nome: "Wiglett", level: 79 },
      { speciesId: 167, nome: "Spinarak", level: 77 },
      { speciesId: 333, nome: "Swablu", level: 32 },
      { speciesId: 239, nome: "Elekid", level: 64 },
      { speciesId: 964, nome: "Palafin-zero", level: 42 }
    ]
  },

  {
    id: "liza",
    nome: "Liza",
    imagem: "/images/trainers/liza.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 778,
    stardust: 2240,
    xp: 92,
    ia: "agressiva",
    time: [
      { speciesId: 426, nome: "Drifblim", level: 70 },
      { speciesId: 69, nome: "Bellsprout", level: 64 },
      { speciesId: 492, nome: "Shaymin-land", level: 43 },
      { speciesId: 895, nome: "Regidrago", level: 55 },
      { speciesId: 246, nome: "Larvitar", level: 25 },
      { speciesId: 37, nome: "Vulpix", level: 19 }
    ]
  },

  {
    id: "lorelei-gen1",
    nome: "Lorelei-gen1",
    imagem: "/images/trainers/lorelei-gen1.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 245,
    stardust: 521,
    xp: 108,
    ia: "aleatoria",
    time: [
      { speciesId: 480, nome: "Uxie", level: 43 },
      { speciesId: 647, nome: "Keldeo-ordinary", level: 56 },
      { speciesId: 465, nome: "Tangrowth", level: 47 },
      { speciesId: 298, nome: "Azurill", level: 13 },
      { speciesId: 901, nome: "Ursaluna", level: 38 },
      { speciesId: 882, nome: "Dracovish", level: 42 }
    ]
  },

  {
    id: "lorelei-gen1rb",
    nome: "Lorelei-gen1rb",
    imagem: "/images/trainers/lorelei-gen1rb.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 1493,
    stardust: 3602,
    xp: 90,
    ia: "aleatoria",
    time: [
      { speciesId: 68, nome: "Machamp", level: 69 },
      { speciesId: 104, nome: "Cubone", level: 10 },
      { speciesId: 194, nome: "Wooper", level: 41 },
      { speciesId: 693, nome: "Clawitzer", level: 78 },
      { speciesId: 719, nome: "Diancie", level: 77 },
      { speciesId: 1021, nome: "Raging-bolt", level: 19 }
    ]
  },

  {
    id: "lorelei-gen3",
    nome: "Lorelei-gen3",
    imagem: "/images/trainers/lorelei-gen3.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 494,
    stardust: 3356,
    xp: 495,
    ia: "agressiva",
    time: [
      { speciesId: 532, nome: "Timburr", level: 63 },
      { speciesId: 232, nome: "Donphan", level: 39 },
      { speciesId: 829, nome: "Gossifleur", level: 40 },
      { speciesId: 75, nome: "Graveler", level: 28 },
      { speciesId: 143, nome: "Snorlax", level: 48 },
      { speciesId: 897, nome: "Spectrier", level: 13 }
    ]
  },

  {
    id: "lorelei-lgpe",
    nome: "Lorelei-lgpe",
    imagem: "/images/trainers/lorelei-lgpe.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 248,
    stardust: 3836,
    xp: 348,
    ia: "agressiva",
    time: [
      { speciesId: 979, nome: "Annihilape", level: 73 },
      { speciesId: 69, nome: "Bellsprout", level: 13 },
      { speciesId: 607, nome: "Litwick", level: 39 },
      { speciesId: 999, nome: "Gimmighoul", level: 48 },
      { speciesId: 653, nome: "Fennekin", level: 18 },
      { speciesId: 135, nome: "Jolteon", level: 60 }
    ]
  },

  {
    id: "ltsurge-gen1",
    nome: "Ltsurge-gen1",
    imagem: "/images/trainers/ltsurge-gen1.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 2701,
    stardust: 384,
    xp: 240,
    ia: "estrategica",
    time: [
      { speciesId: 294, nome: "Loudred", level: 47 },
      { speciesId: 46, nome: "Paras", level: 40 },
      { speciesId: 388, nome: "Grotle", level: 74 },
      { speciesId: 115, nome: "Kangaskhan", level: 64 },
      { speciesId: 261, nome: "Poochyena", level: 73 },
      { speciesId: 531, nome: "Audino", level: 43 }
    ]
  },

  {
    id: "ltsurge-gen1rb",
    nome: "Ltsurge-gen1rb",
    imagem: "/images/trainers/ltsurge-gen1rb.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 2977,
    stardust: 819,
    xp: 150,
    ia: "aleatoria",
    time: [
      { speciesId: 815, nome: "Cinderace", level: 63 },
      { speciesId: 491, nome: "Darkrai", level: 66 },
      { speciesId: 324, nome: "Torkoal", level: 68 },
      { speciesId: 764, nome: "Comfey", level: 15 },
      { speciesId: 380, nome: "Latias", level: 42 },
      { speciesId: 641, nome: "Tornadus-incarnate", level: 34 }
    ]
  },

  {
    id: "ltsurge-gen2",
    nome: "Ltsurge-gen2",
    imagem: "/images/trainers/ltsurge-gen2.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 1029,
    stardust: 1416,
    xp: 448,
    ia: "agressiva",
    time: [
      { speciesId: 255, nome: "Torchic", level: 53 },
      { speciesId: 841, nome: "Flapple", level: 21 },
      { speciesId: 341, nome: "Corphish", level: 75 },
      { speciesId: 817, nome: "Drizzile", level: 12 },
      { speciesId: 310, nome: "Manectric", level: 18 },
      { speciesId: 634, nome: "Zweilous", level: 47 }
    ]
  },

  {
    id: "ltsurge-gen3",
    nome: "Ltsurge-gen3",
    imagem: "/images/trainers/ltsurge-gen3.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 213,
    stardust: 3117,
    xp: 79,
    ia: "aleatoria",
    time: [
      { speciesId: 774, nome: "Minior-red-meteor", level: 48 },
      { speciesId: 90, nome: "Shellder", level: 40 },
      { speciesId: 187, nome: "Hoppip", level: 77 },
      { speciesId: 503, nome: "Samurott", level: 47 },
      { speciesId: 609, nome: "Chandelure", level: 70 },
      { speciesId: 433, nome: "Chingling", level: 28 }
    ]
  },

  {
    id: "ltsurge",
    nome: "Ltsurge",
    imagem: "/images/trainers/ltsurge.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 2415,
    stardust: 2029,
    xp: 339,
    ia: "aleatoria",
    time: [
      { speciesId: 780, nome: "Drampa", level: 59 },
      { speciesId: 260, nome: "Swampert", level: 53 },
      { speciesId: 446, nome: "Munchlax", level: 56 },
      { speciesId: 968, nome: "Orthworm", level: 12 },
      { speciesId: 996, nome: "Frigibax", level: 40 },
      { speciesId: 943, nome: "Mabosstiff", level: 21 }
    ]
  },

  {
    id: "lucas-contest",
    nome: "Lucas-contest",
    imagem: "/images/trainers/lucas-contest.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 2081,
    stardust: 5323,
    xp: 230,
    ia: "defensiva",
    time: [
      { speciesId: 496, nome: "Servine", level: 37 },
      { speciesId: 130, nome: "Gyarados", level: 43 },
      { speciesId: 575, nome: "Gothorita", level: 29 },
      { speciesId: 105, nome: "Marowak", level: 29 },
      { speciesId: 279, nome: "Pelipper", level: 23 },
      { speciesId: 595, nome: "Joltik", level: 41 }
    ]
  },

  {
    id: "lucas-gen4pt",
    nome: "Lucas-gen4pt",
    imagem: "/images/trainers/lucas-gen4pt.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 1951,
    stardust: 141,
    xp: 56,
    ia: "agressiva",
    time: [
      { speciesId: 933, nome: "Naclstack", level: 15 },
      { speciesId: 39, nome: "Jigglypuff", level: 45 },
      { speciesId: 742, nome: "Cutiefly", level: 67 },
      { speciesId: 585, nome: "Deerling", level: 51 },
      { speciesId: 990, nome: "Iron-treads", level: 34 },
      { speciesId: 322, nome: "Numel", level: 60 }
    ]
  },

  {
    id: "lucas",
    nome: "Lucas",
    imagem: "/images/trainers/lucas.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 1905,
    stardust: 2204,
    xp: 352,
    ia: "agressiva",
    time: [
      { speciesId: 104, nome: "Cubone", level: 73 },
      { speciesId: 709, nome: "Trevenant", level: 63 },
      { speciesId: 225, nome: "Delibird", level: 33 },
      { speciesId: 869, nome: "Alcremie", level: 53 },
      { speciesId: 715, nome: "Noivern", level: 39 },
      { speciesId: 365, nome: "Walrein", level: 24 }
    ]
  },

  {
    id: "lucian",
    nome: "Lucian",
    imagem: "/images/trainers/lucian.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 838,
    stardust: 2782,
    xp: 201,
    ia: "defensiva",
    time: [
      { speciesId: 834, nome: "Drednaw", level: 25 },
      { speciesId: 967, nome: "Cyclizar", level: 21 },
      { speciesId: 713, nome: "Avalugg", level: 21 },
      { speciesId: 816, nome: "Sobble", level: 51 },
      { speciesId: 115, nome: "Kangaskhan", level: 16 },
      { speciesId: 595, nome: "Joltik", level: 42 }
    ]
  },

  {
    id: "lucy-gen3",
    nome: "Lucy-gen3",
    imagem: "/images/trainers/lucy-gen3.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 2575,
    stardust: 634,
    xp: 73,
    ia: "agressiva",
    time: [
      { speciesId: 107, nome: "Hitmonchan", level: 65 },
      { speciesId: 229, nome: "Houndoom", level: 16 },
      { speciesId: 296, nome: "Makuhita", level: 44 },
      { speciesId: 872, nome: "Snom", level: 37 },
      { speciesId: 218, nome: "Slugma", level: 19 },
      { speciesId: 615, nome: "Cryogonal", level: 61 }
    ]
  },

  {
    id: "lucy",
    nome: "Lucy",
    imagem: "/images/trainers/lucy.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 2870,
    stardust: 3943,
    xp: 316,
    ia: "agressiva",
    time: [
      { speciesId: 40, nome: "Wigglytuff", level: 71 },
      { speciesId: 846, nome: "Arrokuda", level: 43 },
      { speciesId: 824, nome: "Blipbug", level: 12 },
      { speciesId: 305, nome: "Lairon", level: 54 },
      { speciesId: 745, nome: "Lycanroc-midday", level: 64 },
      { speciesId: 894, nome: "Regieleki", level: 23 }
    ]
  },

  {
    id: "lusamine-masters",
    nome: "Lusamine-masters",
    imagem: "/images/trainers/lusamine-masters.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 896,
    stardust: 1820,
    xp: 434,
    ia: "aleatoria",
    time: [
      { speciesId: 400, nome: "Bibarel", level: 36 },
      { speciesId: 593, nome: "Jellicent", level: 32 },
      { speciesId: 95, nome: "Onix", level: 42 },
      { speciesId: 677, nome: "Espurr", level: 77 },
      { speciesId: 39, nome: "Jigglypuff", level: 62 },
      { speciesId: 402, nome: "Kricketune", level: 47 }
    ]
  },

  {
    id: "lusamine-nihilego",
    nome: "Lusamine-nihilego",
    imagem: "/images/trainers/lusamine-nihilego.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 1301,
    stardust: 2802,
    xp: 416,
    ia: "defensiva",
    time: [
      { speciesId: 664, nome: "Scatterbug", level: 24 },
      { speciesId: 66, nome: "Machop", level: 73 },
      { speciesId: 474, nome: "Porygon-z", level: 23 },
      { speciesId: 682, nome: "Spritzee", level: 53 },
      { speciesId: 611, nome: "Fraxure", level: 41 },
      { speciesId: 528, nome: "Swoobat", level: 58 }
    ]
  },

  {
    id: "lusamine",
    nome: "Lusamine",
    imagem: "/images/trainers/lusamine.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 1266,
    stardust: 2896,
    xp: 410,
    ia: "agressiva",
    time: [
      { speciesId: 282, nome: "Gardevoir", level: 60 },
      { speciesId: 551, nome: "Sandile", level: 35 },
      { speciesId: 691, nome: "Dragalge", level: 12 },
      { speciesId: 766, nome: "Passimian", level: 10 },
      { speciesId: 687, nome: "Malamar", level: 68 },
      { speciesId: 463, nome: "Lickilicky", level: 22 }
    ]
  },

  {
    id: "lyra-masters",
    nome: "Lyra-masters",
    imagem: "/images/trainers/lyra-masters.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 2426,
    stardust: 1792,
    xp: 195,
    ia: "defensiva",
    time: [
      { speciesId: 260, nome: "Swampert", level: 68 },
      { speciesId: 324, nome: "Torkoal", level: 20 },
      { speciesId: 61, nome: "Poliwhirl", level: 29 },
      { speciesId: 535, nome: "Tympole", level: 66 },
      { speciesId: 578, nome: "Duosion", level: 29 },
      { speciesId: 667, nome: "Litleo", level: 55 }
    ]
  },

  {
    id: "lyra-masters2",
    nome: "Lyra-masters2",
    imagem: "/images/trainers/lyra-masters2.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 1247,
    stardust: 3434,
    xp: 476,
    ia: "defensiva",
    time: [
      { speciesId: 203, nome: "Girafarig", level: 27 },
      { speciesId: 254, nome: "Sceptile", level: 47 },
      { speciesId: 659, nome: "Bunnelby", level: 42 },
      { speciesId: 332, nome: "Cacturne", level: 46 },
      { speciesId: 188, nome: "Skiploom", level: 36 },
      { speciesId: 734, nome: "Yungoos", level: 54 }
    ]
  },

  {
    id: "lyra-pokeathlon",
    nome: "Lyra-pokeathlon",
    imagem: "/images/trainers/lyra-pokeathlon.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 1770,
    stardust: 1601,
    xp: 180,
    ia: "defensiva",
    time: [
      { speciesId: 624, nome: "Pawniard", level: 13 },
      { speciesId: 814, nome: "Raboot", level: 72 },
      { speciesId: 924, nome: "Tandemaus", level: 31 },
      { speciesId: 651, nome: "Quilladin", level: 71 },
      { speciesId: 999, nome: "Gimmighoul", level: 65 },
      { speciesId: 62, nome: "Poliwrath", level: 64 }
    ]
  },

  {
    id: "lyra",
    nome: "Lyra",
    imagem: "/images/trainers/lyra.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 515,
    stardust: 1389,
    xp: 309,
    ia: "estrategica",
    time: [
      { speciesId: 521, nome: "Unfezant", level: 29 },
      { speciesId: 919, nome: "Nymble", level: 36 },
      { speciesId: 1, nome: "Bulbasaur", level: 73 },
      { speciesId: 340, nome: "Whiscash", level: 52 },
      { speciesId: 321, nome: "Wailord", level: 44 },
      { speciesId: 519, nome: "Pidove", level: 16 }
    ]
  },

  {
    id: "lysandre-masters",
    nome: "Lysandre-masters",
    imagem: "/images/trainers/lysandre-masters.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 1065,
    stardust: 2030,
    xp: 160,
    ia: "agressiva",
    time: [
      { speciesId: 625, nome: "Bisharp", level: 80 },
      { speciesId: 948, nome: "Toedscool", level: 68 },
      { speciesId: 22, nome: "Fearow", level: 79 },
      { speciesId: 264, nome: "Linoone", level: 58 },
      { speciesId: 61, nome: "Poliwhirl", level: 14 },
      { speciesId: 813, nome: "Scorbunny", level: 53 }
    ]
  },

  {
    id: "lysandre",
    nome: "Lysandre",
    imagem: "/images/trainers/lysandre.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 1075,
    stardust: 4203,
    xp: 321,
    ia: "estrategica",
    time: [
      { speciesId: 836, nome: "Boltund", level: 45 },
      { speciesId: 140, nome: "Kabuto", level: 35 },
      { speciesId: 658, nome: "Greninja", level: 56 },
      { speciesId: 948, nome: "Toedscool", level: 68 },
      { speciesId: 316, nome: "Gulpin", level: 16 },
      { speciesId: 798, nome: "Kartana", level: 46 }
    ]
  },

  {
    id: "mable",
    nome: "Mable",
    imagem: "/images/trainers/mable.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 1496,
    stardust: 1207,
    xp: 91,
    ia: "agressiva",
    time: [
      { speciesId: 356, nome: "Dusclops", level: 39 },
      { speciesId: 311, nome: "Plusle", level: 14 },
      { speciesId: 865, nome: "Sirfetchd", level: 16 },
      { speciesId: 435, nome: "Skuntank", level: 28 },
      { speciesId: 746, nome: "Wishiwashi-solo", level: 30 },
      { speciesId: 952, nome: "Scovillain", level: 35 }
    ]
  },

  {
    id: "madame-gen4",
    nome: "Madame-gen4",
    imagem: "/images/trainers/madame-gen4.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 1522,
    stardust: 376,
    xp: 209,
    ia: "estrategica",
    time: [
      { speciesId: 447, nome: "Riolu", level: 79 },
      { speciesId: 915, nome: "Lechonk", level: 22 },
      { speciesId: 303, nome: "Mawile", level: 59 },
      { speciesId: 876, nome: "Indeedee-male", level: 49 },
      { speciesId: 717, nome: "Yveltal", level: 13 },
      { speciesId: 200, nome: "Misdreavus", level: 66 }
    ]
  },

  {
    id: "madame-gen4dp",
    nome: "Madame-gen4dp",
    imagem: "/images/trainers/madame-gen4dp.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "dificil",
    recompensa: 1731,
    stardust: 3396,
    xp: 88,
    ia: "estrategica",
    time: [
      { speciesId: 562, nome: "Yamask", level: 60 },
      { speciesId: 830, nome: "Eldegoss", level: 24 },
      { speciesId: 760, nome: "Bewear", level: 18 },
      { speciesId: 300, nome: "Skitty", level: 37 },
      { speciesId: 563, nome: "Cofagrigus", level: 33 },
      { speciesId: 4, nome: "Charmander", level: 20 }
    ]
  },

  {
    id: "madame-gen6",
    nome: "Madame-gen6",
    imagem: "/images/trainers/madame-gen6.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 2160,
    stardust: 2467,
    xp: 169,
    ia: "aleatoria",
    time: [
      { speciesId: 991, nome: "Iron-bundle", level: 58 },
      { speciesId: 419, nome: "Floatzel", level: 24 },
      { speciesId: 410, nome: "Shieldon", level: 67 },
      { speciesId: 974, nome: "Cetoddle", level: 19 },
      { speciesId: 43, nome: "Oddish", level: 25 },
      { speciesId: 566, nome: "Archen", level: 59 }
    ]
  },

  {
    id: "madame-gen7",
    nome: "Madame-gen7",
    imagem: "/images/trainers/madame-gen7.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 1357,
    stardust: 289,
    xp: 205,
    ia: "agressiva",
    time: [
      { speciesId: 722, nome: "Rowlet", level: 14 },
      { speciesId: 973, nome: "Flamigo", level: 58 },
      { speciesId: 383, nome: "Groudon", level: 27 },
      { speciesId: 176, nome: "Togetic", level: 28 },
      { speciesId: 71, nome: "Victreebel", level: 76 },
      { speciesId: 917, nome: "Tarountula", level: 13 }
    ]
  },

  {
    id: "madame-gen8",
    nome: "Madame-gen8",
    imagem: "/images/trainers/madame-gen8.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 2490,
    stardust: 5314,
    xp: 63,
    ia: "estrategica",
    time: [
      { speciesId: 272, nome: "Ludicolo", level: 31 },
      { speciesId: 922, nome: "Pawmo", level: 78 },
      { speciesId: 996, nome: "Frigibax", level: 63 },
      { speciesId: 120, nome: "Staryu", level: 79 },
      { speciesId: 443, nome: "Gible", level: 64 },
      { speciesId: 118, nome: "Goldeen", level: 18 }
    ]
  },

  {
    id: "madame",
    nome: "Madame",
    imagem: "/images/trainers/madame.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 2763,
    stardust: 3164,
    xp: 465,
    ia: "estrategica",
    time: [
      { speciesId: 835, nome: "Yamper", level: 18 },
      { speciesId: 898, nome: "Calyrex", level: 60 },
      { speciesId: 480, nome: "Uxie", level: 69 },
      { speciesId: 274, nome: "Nuzleaf", level: 36 },
      { speciesId: 137, nome: "Porygon", level: 27 },
      { speciesId: 424, nome: "Ambipom", level: 19 }
    ]
  },

  {
    id: "magmagrunt-rse",
    nome: "Magmagrunt-rse",
    imagem: "/images/trainers/magmagrunt-rse.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 2073,
    stardust: 1911,
    xp: 391,
    ia: "agressiva",
    time: [
      { speciesId: 198, nome: "Murkrow", level: 26 },
      { speciesId: 589, nome: "Escavalier", level: 35 },
      { speciesId: 988, nome: "Slither-wing", level: 67 },
      { speciesId: 809, nome: "Melmetal", level: 20 },
      { speciesId: 40, nome: "Wigglytuff", level: 52 },
      { speciesId: 855, nome: "Polteageist", level: 52 }
    ]
  },

  {
    id: "magmagrunt",
    nome: "Magmagrunt",
    imagem: "/images/trainers/magmagrunt.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "dificil",
    recompensa: 2442,
    stardust: 3501,
    xp: 292,
    ia: "defensiva",
    time: [
      { speciesId: 312, nome: "Minun", level: 35 },
      { speciesId: 776, nome: "Turtonator", level: 43 },
      { speciesId: 633, nome: "Deino", level: 25 },
      { speciesId: 574, nome: "Gothita", level: 10 },
      { speciesId: 236, nome: "Tyrogue", level: 14 },
      { speciesId: 216, nome: "Teddiursa", level: 73 }
    ]
  },

  {
    id: "magmagruntf-rse",
    nome: "Magmagruntf-rse",
    imagem: "/images/trainers/magmagruntf-rse.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 1900,
    stardust: 3723,
    xp: 328,
    ia: "agressiva",
    time: [
      { speciesId: 539, nome: "Sawk", level: 39 },
      { speciesId: 716, nome: "Xerneas", level: 31 },
      { speciesId: 177, nome: "Natu", level: 33 },
      { speciesId: 597, nome: "Ferroseed", level: 29 },
      { speciesId: 963, nome: "Finizen", level: 44 },
      { speciesId: 365, nome: "Walrein", level: 32 }
    ]
  },

  {
    id: "magmagruntf",
    nome: "Magmagruntf",
    imagem: "/images/trainers/magmagruntf.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 1034,
    stardust: 3375,
    xp: 315,
    ia: "agressiva",
    time: [
      { speciesId: 608, nome: "Lampent", level: 72 },
      { speciesId: 291, nome: "Ninjask", level: 69 },
      { speciesId: 176, nome: "Togetic", level: 14 },
      { speciesId: 484, nome: "Palkia", level: 67 },
      { speciesId: 662, nome: "Fletchinder", level: 19 },
      { speciesId: 470, nome: "Leafeon", level: 76 }
    ]
  },

  {
    id: "magmasuit",
    nome: "Magmasuit",
    imagem: "/images/trainers/magmasuit.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 292,
    stardust: 643,
    xp: 359,
    ia: "defensiva",
    time: [
      { speciesId: 407, nome: "Roserade", level: 17 },
      { speciesId: 799, nome: "Guzzlord", level: 76 },
      { speciesId: 61, nome: "Poliwhirl", level: 53 },
      { speciesId: 890, nome: "Eternatus", level: 67 },
      { speciesId: 73, nome: "Tentacruel", level: 25 },
      { speciesId: 847, nome: "Barraskewda", level: 48 }
    ]
  },

  {
    id: "magnolia",
    nome: "Magnolia",
    imagem: "/images/trainers/magnolia.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 2654,
    stardust: 1285,
    xp: 447,
    ia: "estrategica",
    time: [
      { speciesId: 102, nome: "Exeggcute", level: 64 },
      { speciesId: 13, nome: "Weedle", level: 77 },
      { speciesId: 491, nome: "Darkrai", level: 64 },
      { speciesId: 229, nome: "Houndoom", level: 22 },
      { speciesId: 988, nome: "Slither-wing", level: 24 },
      { speciesId: 392, nome: "Infernape", level: 45 }
    ]
  },

  {
    id: "magnus",
    nome: "Magnus",
    imagem: "/images/trainers/magnus.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 2027,
    stardust: 5012,
    xp: 239,
    ia: "estrategica",
    time: [
      { speciesId: 456, nome: "Finneon", level: 40 },
      { speciesId: 534, nome: "Conkeldurr", level: 72 },
      { speciesId: 759, nome: "Stufful", level: 45 },
      { speciesId: 742, nome: "Cutiefly", level: 17 },
      { speciesId: 977, nome: "Dondozo", level: 71 },
      { speciesId: 341, nome: "Corphish", level: 68 }
    ]
  },

  {
    id: "mai",
    nome: "Mai",
    imagem: "/images/trainers/mai.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "dificil",
    recompensa: 2764,
    stardust: 4639,
    xp: 478,
    ia: "estrategica",
    time: [
      { speciesId: 611, nome: "Fraxure", level: 38 },
      { speciesId: 847, nome: "Barraskewda", level: 75 },
      { speciesId: 593, nome: "Jellicent", level: 77 },
      { speciesId: 200, nome: "Misdreavus", level: 46 },
      { speciesId: 337, nome: "Lunatone", level: 68 },
      { speciesId: 234, nome: "Stantler", level: 72 }
    ]
  },

  {
    id: "maid-gen4",
    nome: "Maid-gen4",
    imagem: "/images/trainers/maid-gen4.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 527,
    stardust: 3844,
    xp: 317,
    ia: "aleatoria",
    time: [
      { speciesId: 709, nome: "Trevenant", level: 37 },
      { speciesId: 320, nome: "Wailmer", level: 32 },
      { speciesId: 499, nome: "Pignite", level: 28 },
      { speciesId: 25, nome: "Pikachu", level: 44 },
      { speciesId: 861, nome: "Grimmsnarl", level: 53 },
      { speciesId: 786, nome: "Tapu-lele", level: 50 }
    ]
  },

  {
    id: "maid-gen6",
    nome: "Maid-gen6",
    imagem: "/images/trainers/maid-gen6.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 1044,
    stardust: 4069,
    xp: 477,
    ia: "aleatoria",
    time: [
      { speciesId: 148, nome: "Dragonair", level: 41 },
      { speciesId: 633, nome: "Deino", level: 35 },
      { speciesId: 781, nome: "Dhelmise", level: 15 },
      { speciesId: 883, nome: "Arctovish", level: 45 },
      { speciesId: 986, nome: "Brute-bonnet", level: 69 },
      { speciesId: 809, nome: "Melmetal", level: 76 }
    ]
  },

  {
    id: "maid",
    nome: "Maid",
    imagem: "/images/trainers/maid.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 1279,
    stardust: 4732,
    xp: 300,
    ia: "aleatoria",
    time: [
      { speciesId: 743, nome: "Ribombee", level: 12 },
      { speciesId: 741, nome: "Oricorio-baile", level: 42 },
      { speciesId: 920, nome: "Lokix", level: 29 },
      { speciesId: 71, nome: "Victreebel", level: 63 },
      { speciesId: 809, nome: "Melmetal", level: 73 },
      { speciesId: 506, nome: "Lillipup", level: 11 }
    ]
  },

  {
    id: "mallow-masters",
    nome: "Mallow-masters",
    imagem: "/images/trainers/mallow-masters.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 2354,
    stardust: 2341,
    xp: 200,
    ia: "estrategica",
    time: [
      { speciesId: 125, nome: "Electabuzz", level: 21 },
      { speciesId: 886, nome: "Drakloak", level: 56 },
      { speciesId: 540, nome: "Sewaddle", level: 26 },
      { speciesId: 462, nome: "Magnezone", level: 39 },
      { speciesId: 771, nome: "Pyukumuku", level: 47 },
      { speciesId: 407, nome: "Roserade", level: 58 }
    ]
  },

  {
    id: "mallow",
    nome: "Mallow",
    imagem: "/images/trainers/mallow.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 1781,
    stardust: 5110,
    xp: 98,
    ia: "defensiva",
    time: [
      { speciesId: 685, nome: "Slurpuff", level: 16 },
      { speciesId: 575, nome: "Gothorita", level: 17 },
      { speciesId: 579, nome: "Reuniclus", level: 13 },
      { speciesId: 171, nome: "Lanturn", level: 74 },
      { speciesId: 800, nome: "Necrozma", level: 15 },
      { speciesId: 580, nome: "Ducklett", level: 50 }
    ]
  },

  {
    id: "malva",
    nome: "Malva",
    imagem: "/images/trainers/malva.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 1256,
    stardust: 4756,
    xp: 167,
    ia: "aleatoria",
    time: [
      { speciesId: 116, nome: "Horsea", level: 10 },
      { speciesId: 336, nome: "Seviper", level: 69 },
      { speciesId: 206, nome: "Dunsparce", level: 50 },
      { speciesId: 639, nome: "Terrakion", level: 44 },
      { speciesId: 48, nome: "Venonat", level: 11 },
      { speciesId: 631, nome: "Heatmor", level: 79 }
    ]
  },

  {
    id: "marley-masters",
    nome: "Marley-masters",
    imagem: "/images/trainers/marley-masters.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 747,
    stardust: 1390,
    xp: 283,
    ia: "estrategica",
    time: [
      { speciesId: 911, nome: "Skeledirge", level: 79 },
      { speciesId: 56, nome: "Mankey", level: 14 },
      { speciesId: 855, nome: "Polteageist", level: 14 },
      { speciesId: 383, nome: "Groudon", level: 38 },
      { speciesId: 451, nome: "Skorupi", level: 19 },
      { speciesId: 798, nome: "Kartana", level: 63 }
    ]
  },

  {
    id: "marley",
    nome: "Marley",
    imagem: "/images/trainers/marley.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 528,
    stardust: 4103,
    xp: 312,
    ia: "estrategica",
    time: [
      { speciesId: 497, nome: "Serperior", level: 18 },
      { speciesId: 356, nome: "Dusclops", level: 22 },
      { speciesId: 398, nome: "Staraptor", level: 45 },
      { speciesId: 949, nome: "Toedscruel", level: 43 },
      { speciesId: 834, nome: "Drednaw", level: 40 },
      { speciesId: 956, nome: "Espathra", level: 56 }
    ]
  },

  {
    id: "marlon",
    nome: "Marlon",
    imagem: "/images/trainers/marlon.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 511,
    stardust: 4374,
    xp: 352,
    ia: "estrategica",
    time: [
      { speciesId: 637, nome: "Volcarona", level: 19 },
      { speciesId: 268, nome: "Cascoon", level: 79 },
      { speciesId: 1022, nome: "Iron-boulder", level: 24 },
      { speciesId: 449, nome: "Hippopotas", level: 56 },
      { speciesId: 457, nome: "Lumineon", level: 43 },
      { speciesId: 519, nome: "Pidove", level: 54 }
    ]
  },

  {
    id: "marnie-league",
    nome: "Marnie-league",
    imagem: "/images/trainers/marnie-league.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 947,
    stardust: 210,
    xp: 82,
    ia: "defensiva",
    time: [
      { speciesId: 157, nome: "Typhlosion", level: 74 },
      { speciesId: 368, nome: "Gorebyss", level: 76 },
      { speciesId: 571, nome: "Zoroark", level: 17 },
      { speciesId: 993, nome: "Iron-jugulis", level: 12 },
      { speciesId: 193, nome: "Yanma", level: 73 },
      { speciesId: 457, nome: "Lumineon", level: 52 }
    ]
  },

  {
    id: "marnie-masters",
    nome: "Marnie-masters",
    imagem: "/images/trainers/marnie-masters.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 498,
    stardust: 2762,
    xp: 311,
    ia: "estrategica",
    time: [
      { speciesId: 519, nome: "Pidove", level: 61 },
      { speciesId: 742, nome: "Cutiefly", level: 38 },
      { speciesId: 249, nome: "Lugia", level: 70 },
      { speciesId: 554, nome: "Darumaka", level: 52 },
      { speciesId: 79, nome: "Slowpoke", level: 13 },
      { speciesId: 749, nome: "Mudbray", level: 27 }
    ]
  },

  {
    id: "marnie-masters2",
    nome: "Marnie-masters2",
    imagem: "/images/trainers/marnie-masters2.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 1635,
    stardust: 115,
    xp: 428,
    ia: "aleatoria",
    time: [
      { speciesId: 722, nome: "Rowlet", level: 48 },
      { speciesId: 112, nome: "Rhydon", level: 58 },
      { speciesId: 778, nome: "Mimikyu-disguised", level: 73 },
      { speciesId: 168, nome: "Ariados", level: 66 },
      { speciesId: 748, nome: "Toxapex", level: 13 },
      { speciesId: 422, nome: "Shellos", level: 23 }
    ]
  },

  {
    id: "marnie-masters3",
    nome: "Marnie-masters3",
    imagem: "/images/trainers/marnie-masters3.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 1605,
    stardust: 1198,
    xp: 314,
    ia: "agressiva",
    time: [
      { speciesId: 474, nome: "Porygon-z", level: 77 },
      { speciesId: 840, nome: "Applin", level: 23 },
      { speciesId: 666, nome: "Vivillon", level: 34 },
      { speciesId: 449, nome: "Hippopotas", level: 65 },
      { speciesId: 506, nome: "Lillipup", level: 54 },
      { speciesId: 591, nome: "Amoonguss", level: 29 }
    ]
  },

  {
    id: "marnie",
    nome: "Marnie",
    imagem: "/images/trainers/marnie.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 1562,
    stardust: 1648,
    xp: 262,
    ia: "aleatoria",
    time: [
      { speciesId: 116, nome: "Horsea", level: 78 },
      { speciesId: 346, nome: "Cradily", level: 33 },
      { speciesId: 818, nome: "Inteleon", level: 35 },
      { speciesId: 95, nome: "Onix", level: 33 },
      { speciesId: 552, nome: "Krokorok", level: 53 },
      { speciesId: 84, nome: "Doduo", level: 51 }
    ]
  },

  {
    id: "mars",
    nome: "Mars",
    imagem: "/images/trainers/mars.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 1458,
    stardust: 2482,
    xp: 334,
    ia: "aleatoria",
    time: [
      { speciesId: 1024, nome: "Terapagos", level: 47 },
      { speciesId: 256, nome: "Combusken", level: 39 },
      { speciesId: 295, nome: "Exploud", level: 60 },
      { speciesId: 529, nome: "Drilbur", level: 76 },
      { speciesId: 849, nome: "Toxtricity-amped", level: 51 },
      { speciesId: 160, nome: "Feraligatr", level: 21 }
    ]
  },

  {
    id: "marshal",
    nome: "Marshal",
    imagem: "/images/trainers/marshal.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "dificil",
    recompensa: 2776,
    stardust: 2498,
    xp: 294,
    ia: "estrategica",
    time: [
      { speciesId: 983, nome: "Kingambit", level: 28 },
      { speciesId: 133, nome: "Eevee", level: 66 },
      { speciesId: 937, nome: "Ceruledge", level: 49 },
      { speciesId: 924, nome: "Tandemaus", level: 71 },
      { speciesId: 892, nome: "Urshifu-single-strike", level: 52 },
      { speciesId: 454, nome: "Toxicroak", level: 51 }
    ]
  },

  {
    id: "masamune-conquest",
    nome: "Masamune-conquest",
    imagem: "/images/trainers/masamune-conquest.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 2725,
    stardust: 272,
    xp: 95,
    ia: "estrategica",
    time: [
      { speciesId: 463, nome: "Lickilicky", level: 24 },
      { speciesId: 324, nome: "Torkoal", level: 72 },
      { speciesId: 450, nome: "Hippowdon", level: 75 },
      { speciesId: 299, nome: "Nosepass", level: 40 },
      { speciesId: 767, nome: "Wimpod", level: 19 },
      { speciesId: 692, nome: "Clauncher", level: 13 }
    ]
  },

  {
    id: "mateo",
    nome: "Mateo",
    imagem: "/images/trainers/mateo.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 2456,
    stardust: 5492,
    xp: 440,
    ia: "aleatoria",
    time: [
      { speciesId: 977, nome: "Dondozo", level: 46 },
      { speciesId: 595, nome: "Joltik", level: 13 },
      { speciesId: 922, nome: "Pawmo", level: 56 },
      { speciesId: 983, nome: "Kingambit", level: 74 },
      { speciesId: 718, nome: "Zygarde-50", level: 26 },
      { speciesId: 237, nome: "Hitmontop", level: 64 }
    ]
  },

  {
    id: "matt-gen3",
    nome: "Matt-gen3",
    imagem: "/images/trainers/matt-gen3.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 1982,
    stardust: 2332,
    xp: 57,
    ia: "agressiva",
    time: [
      { speciesId: 177, nome: "Natu", level: 62 },
      { speciesId: 137, nome: "Porygon", level: 60 },
      { speciesId: 948, nome: "Toedscool", level: 12 },
      { speciesId: 158, nome: "Totodile", level: 66 },
      { speciesId: 751, nome: "Dewpider", level: 80 },
      { speciesId: 297, nome: "Hariyama", level: 75 }
    ]
  },

  {
    id: "matt",
    nome: "Matt",
    imagem: "/images/trainers/matt.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 2358,
    stardust: 1025,
    xp: 288,
    ia: "estrategica",
    time: [
      { speciesId: 787, nome: "Tapu-bulu", level: 79 },
      { speciesId: 753, nome: "Fomantis", level: 31 },
      { speciesId: 27, nome: "Sandshrew", level: 38 },
      { speciesId: 760, nome: "Bewear", level: 10 },
      { speciesId: 533, nome: "Gurdurr", level: 32 },
      { speciesId: 935, nome: "Charcadet", level: 34 }
    ]
  },

  {
    id: "maxie-gen3",
    nome: "Maxie-gen3",
    imagem: "/images/trainers/maxie-gen3.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 855,
    stardust: 3788,
    xp: 404,
    ia: "aleatoria",
    time: [
      { speciesId: 524, nome: "Roggenrola", level: 80 },
      { speciesId: 119, nome: "Seaking", level: 23 },
      { speciesId: 124, nome: "Jynx", level: 68 },
      { speciesId: 188, nome: "Skiploom", level: 53 },
      { speciesId: 518, nome: "Musharna", level: 40 },
      { speciesId: 630, nome: "Mandibuzz", level: 41 }
    ]
  },

  {
    id: "maxie-gen6",
    nome: "Maxie-gen6",
    imagem: "/images/trainers/maxie-gen6.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 578,
    stardust: 2974,
    xp: 163,
    ia: "defensiva",
    time: [
      { speciesId: 486, nome: "Regigigas", level: 43 },
      { speciesId: 360, nome: "Wynaut", level: 77 },
      { speciesId: 825, nome: "Dottler", level: 35 },
      { speciesId: 596, nome: "Galvantula", level: 80 },
      { speciesId: 1016, nome: "Fezandipiti", level: 31 },
      { speciesId: 219, nome: "Magcargo", level: 47 }
    ]
  },

  {
    id: "may-contest",
    nome: "May-contest",
    imagem: "/images/trainers/may-contest.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 275,
    stardust: 1944,
    xp: 319,
    ia: "estrategica",
    time: [
      { speciesId: 260, nome: "Swampert", level: 66 },
      { speciesId: 359, nome: "Absol", level: 51 },
      { speciesId: 751, nome: "Dewpider", level: 56 },
      { speciesId: 897, nome: "Spectrier", level: 58 },
      { speciesId: 537, nome: "Seismitoad", level: 41 },
      { speciesId: 604, nome: "Eelektross", level: 36 }
    ]
  },

  {
    id: "may-e",
    nome: "May-e",
    imagem: "/images/trainers/may-e.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 2845,
    stardust: 5154,
    xp: 151,
    ia: "defensiva",
    time: [
      { speciesId: 495, nome: "Snivy", level: 18 },
      { speciesId: 910, nome: "Crocalor", level: 62 },
      { speciesId: 678, nome: "Meowstic-male", level: 46 },
      { speciesId: 112, nome: "Rhydon", level: 75 },
      { speciesId: 764, nome: "Comfey", level: 70 },
      { speciesId: 683, nome: "Aromatisse", level: 47 }
    ]
  },

  {
    id: "may-gen3",
    nome: "May-gen3",
    imagem: "/images/trainers/may-gen3.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "dificil",
    recompensa: 2807,
    stardust: 1134,
    xp: 125,
    ia: "aleatoria",
    time: [
      { speciesId: 813, nome: "Scorbunny", level: 15 },
      { speciesId: 240, nome: "Magby", level: 80 },
      { speciesId: 970, nome: "Glimmora", level: 16 },
      { speciesId: 679, nome: "Honedge", level: 63 },
      { speciesId: 1013, nome: "Sinistcha", level: 56 },
      { speciesId: 80, nome: "Slowbro", level: 18 }
    ]
  },

  {
    id: "may-gen3rs",
    nome: "May-gen3rs",
    imagem: "/images/trainers/may-gen3rs.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 1189,
    stardust: 472,
    xp: 188,
    ia: "aleatoria",
    time: [
      { speciesId: 238, nome: "Smoochum", level: 60 },
      { speciesId: 293, nome: "Whismur", level: 60 },
      { speciesId: 226, nome: "Mantine", level: 71 },
      { speciesId: 987, nome: "Flutter-mane", level: 15 },
      { speciesId: 205, nome: "Forretress", level: 31 },
      { speciesId: 291, nome: "Ninjask", level: 33 }
    ]
  },

  {
    id: "may-masters",
    nome: "May-masters",
    imagem: "/images/trainers/may-masters.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 2343,
    stardust: 2091,
    xp: 417,
    ia: "aleatoria",
    time: [
      { speciesId: 434, nome: "Stunky", level: 73 },
      { speciesId: 914, nome: "Quaquaval", level: 23 },
      { speciesId: 414, nome: "Mothim", level: 16 },
      { speciesId: 487, nome: "Giratina-altered", level: 38 },
      { speciesId: 689, nome: "Barbaracle", level: 66 },
      { speciesId: 616, nome: "Shelmet", level: 36 }
    ]
  },

  {
    id: "may-masters2",
    nome: "May-masters2",
    imagem: "/images/trainers/may-masters2.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 2030,
    stardust: 1664,
    xp: 159,
    ia: "aleatoria",
    time: [
      { speciesId: 195, nome: "Quagsire", level: 51 },
      { speciesId: 558, nome: "Crustle", level: 66 },
      { speciesId: 666, nome: "Vivillon", level: 63 },
      { speciesId: 104, nome: "Cubone", level: 72 },
      { speciesId: 824, nome: "Blipbug", level: 55 },
      { speciesId: 979, nome: "Annihilape", level: 74 }
    ]
  },

  {
    id: "may-masters3",
    nome: "May-masters3",
    imagem: "/images/trainers/may-masters3.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 2783,
    stardust: 439,
    xp: 413,
    ia: "estrategica",
    time: [
      { speciesId: 549, nome: "Lilligant", level: 30 },
      { speciesId: 735, nome: "Gumshoos", level: 59 },
      { speciesId: 422, nome: "Shellos", level: 10 },
      { speciesId: 227, nome: "Skarmory", level: 12 },
      { speciesId: 234, nome: "Stantler", level: 15 },
      { speciesId: 797, nome: "Celesteela", level: 55 }
    ]
  },

  {
    id: "may-masters4",
    nome: "May-masters4",
    imagem: "/images/trainers/may-masters4.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 1502,
    stardust: 3058,
    xp: 119,
    ia: "aleatoria",
    time: [
      { speciesId: 192, nome: "Sunflora", level: 80 },
      { speciesId: 804, nome: "Naganadel", level: 13 },
      { speciesId: 908, nome: "Meowscarada", level: 75 },
      { speciesId: 447, nome: "Riolu", level: 50 },
      { speciesId: 48, nome: "Venonat", level: 68 },
      { speciesId: 90, nome: "Shellder", level: 15 }
    ]
  },

  {
    id: "may-rs",
    nome: "May-rs",
    imagem: "/images/trainers/may-rs.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 558,
    stardust: 2434,
    xp: 253,
    ia: "aleatoria",
    time: [
      { speciesId: 470, nome: "Leafeon", level: 12 },
      { speciesId: 501, nome: "Oshawott", level: 40 },
      { speciesId: 842, nome: "Appletun", level: 70 },
      { speciesId: 466, nome: "Electivire", level: 16 },
      { speciesId: 984, nome: "Great-tusk", level: 79 },
      { speciesId: 380, nome: "Latias", level: 16 }
    ]
  },

  {
    id: "may",
    nome: "May",
    imagem: "/images/trainers/may.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 1565,
    stardust: 1883,
    xp: 348,
    ia: "agressiva",
    time: [
      { speciesId: 839, nome: "Coalossal", level: 33 },
      { speciesId: 374, nome: "Beldum", level: 67 },
      { speciesId: 321, nome: "Wailord", level: 58 },
      { speciesId: 440, nome: "Happiny", level: 46 },
      { speciesId: 460, nome: "Abomasnow", level: 18 },
      { speciesId: 424, nome: "Ambipom", level: 77 }
    ]
  },

  {
    id: "maylene",
    nome: "Maylene",
    imagem: "/images/trainers/maylene.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 1499,
    stardust: 2245,
    xp: 158,
    ia: "defensiva",
    time: [
      { speciesId: 526, nome: "Gigalith", level: 17 },
      { speciesId: 488, nome: "Cresselia", level: 10 },
      { speciesId: 539, nome: "Sawk", level: 69 },
      { speciesId: 561, nome: "Sigilyph", level: 14 },
      { speciesId: 300, nome: "Skitty", level: 70 },
      { speciesId: 878, nome: "Cufant", level: 35 }
    ]
  },

  {
    id: "medium-gen2jp",
    nome: "Medium-gen2jp",
    imagem: "/images/trainers/medium-gen2jp.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 2908,
    stardust: 4713,
    xp: 315,
    ia: "defensiva",
    time: [
      { speciesId: 781, nome: "Dhelmise", level: 78 },
      { speciesId: 615, nome: "Cryogonal", level: 27 },
      { speciesId: 419, nome: "Floatzel", level: 28 },
      { speciesId: 135, nome: "Jolteon", level: 42 },
      { speciesId: 494, nome: "Victini", level: 52 },
      { speciesId: 783, nome: "Hakamo-o", level: 68 }
    ]
  },

  {
    id: "medium",
    nome: "Medium",
    imagem: "/images/trainers/medium.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 397,
    stardust: 4543,
    xp: 483,
    ia: "estrategica",
    time: [
      { speciesId: 585, nome: "Deerling", level: 25 },
      { speciesId: 341, nome: "Corphish", level: 74 },
      { speciesId: 26, nome: "Raichu", level: 24 },
      { speciesId: 175, nome: "Togepi", level: 33 },
      { speciesId: 161, nome: "Sentret", level: 45 },
      { speciesId: 1006, nome: "Iron-valiant", level: 25 }
    ]
  },

  {
    id: "mela",
    nome: "Mela",
    imagem: "/images/trainers/mela.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 470,
    stardust: 4190,
    xp: 479,
    ia: "estrategica",
    time: [
      { speciesId: 760, nome: "Bewear", level: 28 },
      { speciesId: 783, nome: "Hakamo-o", level: 45 },
      { speciesId: 734, nome: "Yungoos", level: 45 },
      { speciesId: 185, nome: "Sudowoodo", level: 71 },
      { speciesId: 981, nome: "Farigiraf", level: 61 },
      { speciesId: 960, nome: "Wiglett", level: 69 }
    ]
  },

  {
    id: "melli",
    nome: "Melli",
    imagem: "/images/trainers/melli.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 1822,
    stardust: 2071,
    xp: 436,
    ia: "estrategica",
    time: [
      { speciesId: 632, nome: "Durant", level: 21 },
      { speciesId: 771, nome: "Pyukumuku", level: 40 },
      { speciesId: 672, nome: "Skiddo", level: 75 },
      { speciesId: 601, nome: "Klinklang", level: 54 },
      { speciesId: 956, nome: "Espathra", level: 52 },
      { speciesId: 380, nome: "Latias", level: 55 }
    ]
  },

  {
    id: "melony",
    nome: "Melony",
    imagem: "/images/trainers/melony.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 655,
    stardust: 2310,
    xp: 273,
    ia: "agressiva",
    time: [
      { speciesId: 903, nome: "Sneasler", level: 15 },
      { speciesId: 71, nome: "Victreebel", level: 13 },
      { speciesId: 905, nome: "Enamorus-incarnate", level: 66 },
      { speciesId: 1017, nome: "Ogerpon", level: 48 },
      { speciesId: 477, nome: "Dusknoir", level: 47 },
      { speciesId: 339, nome: "Barboach", level: 67 }
    ]
  },

  {
    id: "miku-fairy",
    nome: "Miku-fairy",
    imagem: "/images/trainers/miku-fairy.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 2494,
    stardust: 2230,
    xp: 215,
    ia: "agressiva",
    time: [
      { speciesId: 886, nome: "Drakloak", level: 44 },
      { speciesId: 573, nome: "Cinccino", level: 24 },
      { speciesId: 684, nome: "Swirlix", level: 21 },
      { speciesId: 562, nome: "Yamask", level: 65 },
      { speciesId: 780, nome: "Drampa", level: 22 },
      { speciesId: 651, nome: "Quilladin", level: 73 }
    ]
  },

  {
    id: "miku-fire",
    nome: "Miku-fire",
    imagem: "/images/trainers/miku-fire.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 1084,
    stardust: 3852,
    xp: 235,
    ia: "estrategica",
    time: [
      { speciesId: 488, nome: "Cresselia", level: 43 },
      { speciesId: 952, nome: "Scovillain", level: 41 },
      { speciesId: 286, nome: "Breloom", level: 17 },
      { speciesId: 178, nome: "Xatu", level: 21 },
      { speciesId: 901, nome: "Ursaluna", level: 24 },
      { speciesId: 737, nome: "Charjabug", level: 34 }
    ]
  },

  {
    id: "miku-flying",
    nome: "Miku-flying",
    imagem: "/images/trainers/miku-flying.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 2818,
    stardust: 3926,
    xp: 188,
    ia: "agressiva",
    time: [
      { speciesId: 93, nome: "Haunter", level: 58 },
      { speciesId: 375, nome: "Metang", level: 40 },
      { speciesId: 264, nome: "Linoone", level: 35 },
      { speciesId: 799, nome: "Guzzlord", level: 36 },
      { speciesId: 1012, nome: "Poltchageist", level: 51 },
      { speciesId: 229, nome: "Houndoom", level: 33 }
    ]
  },

  {
    id: "miku-ghost",
    nome: "Miku-ghost",
    imagem: "/images/trainers/miku-ghost.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 2539,
    stardust: 3674,
    xp: 291,
    ia: "agressiva",
    time: [
      { speciesId: 601, nome: "Klinklang", level: 24 },
      { speciesId: 52, nome: "Meowth", level: 23 },
      { speciesId: 454, nome: "Toxicroak", level: 53 },
      { speciesId: 362, nome: "Glalie", level: 65 },
      { speciesId: 612, nome: "Haxorus", level: 33 },
      { speciesId: 464, nome: "Rhyperior", level: 53 }
    ]
  },

  {
    id: "miku-grass",
    nome: "Miku-grass",
    imagem: "/images/trainers/miku-grass.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 1765,
    stardust: 3451,
    xp: 314,
    ia: "estrategica",
    time: [
      { speciesId: 270, nome: "Lotad", level: 10 },
      { speciesId: 720, nome: "Hoopa", level: 76 },
      { speciesId: 763, nome: "Tsareena", level: 17 },
      { speciesId: 869, nome: "Alcremie", level: 44 },
      { speciesId: 753, nome: "Fomantis", level: 45 },
      { speciesId: 360, nome: "Wynaut", level: 68 }
    ]
  },

  {
    id: "miku-ground",
    nome: "Miku-ground",
    imagem: "/images/trainers/miku-ground.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 1189,
    stardust: 835,
    xp: 330,
    ia: "aleatoria",
    time: [
      { speciesId: 730, nome: "Primarina", level: 58 },
      { speciesId: 603, nome: "Eelektrik", level: 19 },
      { speciesId: 783, nome: "Hakamo-o", level: 23 },
      { speciesId: 448, nome: "Lucario", level: 80 },
      { speciesId: 14, nome: "Kakuna", level: 18 },
      { speciesId: 806, nome: "Blacephalon", level: 61 }
    ]
  },

  {
    id: "miku-ice",
    nome: "Miku-ice",
    imagem: "/images/trainers/miku-ice.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 1939,
    stardust: 3747,
    xp: 464,
    ia: "aleatoria",
    time: [
      { speciesId: 47, nome: "Parasect", level: 26 },
      { speciesId: 328, nome: "Trapinch", level: 44 },
      { speciesId: 929, nome: "Dolliv", level: 32 },
      { speciesId: 540, nome: "Sewaddle", level: 35 },
      { speciesId: 110, nome: "Weezing", level: 33 },
      { speciesId: 639, nome: "Terrakion", level: 46 }
    ]
  },

  {
    id: "miku-psychic",
    nome: "Miku-psychic",
    imagem: "/images/trainers/miku-psychic.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 1737,
    stardust: 3742,
    xp: 202,
    ia: "aleatoria",
    time: [
      { speciesId: 515, nome: "Panpour", level: 18 },
      { speciesId: 788, nome: "Tapu-fini", level: 73 },
      { speciesId: 548, nome: "Petilil", level: 37 },
      { speciesId: 264, nome: "Linoone", level: 45 },
      { speciesId: 917, nome: "Tarountula", level: 24 },
      { speciesId: 878, nome: "Cufant", level: 72 }
    ]
  },

  {
    id: "miku-water",
    nome: "Miku-water",
    imagem: "/images/trainers/miku-water.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 1371,
    stardust: 4951,
    xp: 398,
    ia: "agressiva",
    time: [
      { speciesId: 387, nome: "Turtwig", level: 55 },
      { speciesId: 998, nome: "Baxcalibur", level: 20 },
      { speciesId: 873, nome: "Frosmoth", level: 62 },
      { speciesId: 500, nome: "Emboar", level: 79 },
      { speciesId: 1010, nome: "Iron-leaves", level: 29 },
      { speciesId: 494, nome: "Victini", level: 57 }
    ]
  },

  {
    id: "milo",
    nome: "Milo",
    imagem: "/images/trainers/milo.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 576,
    stardust: 561,
    xp: 158,
    ia: "defensiva",
    time: [
      { speciesId: 645, nome: "Landorus-incarnate", level: 55 },
      { speciesId: 753, nome: "Fomantis", level: 40 },
      { speciesId: 895, nome: "Regidrago", level: 12 },
      { speciesId: 417, nome: "Pachirisu", level: 38 },
      { speciesId: 398, nome: "Staraptor", level: 74 },
      { speciesId: 505, nome: "Watchog", level: 48 }
    ]
  },

  {
    id: "mina-lgpe",
    nome: "Mina-lgpe",
    imagem: "/images/trainers/mina-lgpe.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 1036,
    stardust: 1484,
    xp: 182,
    ia: "defensiva",
    time: [
      { speciesId: 407, nome: "Roserade", level: 55 },
      { speciesId: 657, nome: "Frogadier", level: 78 },
      { speciesId: 780, nome: "Drampa", level: 66 },
      { speciesId: 199, nome: "Slowking", level: 30 },
      { speciesId: 669, nome: "Flabebe", level: 74 },
      { speciesId: 33, nome: "Nidorino", level: 58 }
    ]
  },

  {
    id: "mina-masters",
    nome: "Mina-masters",
    imagem: "/images/trainers/mina-masters.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 923,
    stardust: 5329,
    xp: 132,
    ia: "estrategica",
    time: [
      { speciesId: 173, nome: "Cleffa", level: 35 },
      { speciesId: 854, nome: "Sinistea", level: 34 },
      { speciesId: 629, nome: "Vullaby", level: 72 },
      { speciesId: 410, nome: "Shieldon", level: 59 },
      { speciesId: 988, nome: "Slither-wing", level: 80 },
      { speciesId: 446, nome: "Munchlax", level: 52 }
    ]
  },

  {
    id: "mina",
    nome: "Mina",
    imagem: "/images/trainers/mina.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 2102,
    stardust: 2090,
    xp: 464,
    ia: "estrategica",
    time: [
      { speciesId: 575, nome: "Gothorita", level: 50 },
      { speciesId: 738, nome: "Vikavolt", level: 23 },
      { speciesId: 433, nome: "Chingling", level: 54 },
      { speciesId: 145, nome: "Zapdos", level: 21 },
      { speciesId: 184, nome: "Azumarill", level: 35 },
      { speciesId: 242, nome: "Blissey", level: 49 }
    ]
  },

  {
    id: "mira",
    nome: "Mira",
    imagem: "/images/trainers/mira.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 1351,
    stardust: 484,
    xp: 244,
    ia: "aleatoria",
    time: [
      { speciesId: 557, nome: "Dwebble", level: 64 },
      { speciesId: 11, nome: "Metapod", level: 68 },
      { speciesId: 203, nome: "Girafarig", level: 28 },
      { speciesId: 458, nome: "Mantyke", level: 53 },
      { speciesId: 715, nome: "Noivern", level: 19 },
      { speciesId: 135, nome: "Jolteon", level: 57 }
    ]
  },

  {
    id: "miriam",
    nome: "Miriam",
    imagem: "/images/trainers/miriam.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 2531,
    stardust: 2111,
    xp: 238,
    ia: "agressiva",
    time: [
      { speciesId: 807, nome: "Zeraora", level: 79 },
      { speciesId: 470, nome: "Leafeon", level: 14 },
      { speciesId: 30, nome: "Nidorina", level: 28 },
      { speciesId: 396, nome: "Starly", level: 54 },
      { speciesId: 619, nome: "Mienfoo", level: 26 },
      { speciesId: 770, nome: "Palossand", level: 72 }
    ]
  },

  {
    id: "mirror",
    nome: "Mirror",
    imagem: "/images/trainers/mirror.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 2406,
    stardust: 2134,
    xp: 67,
    ia: "defensiva",
    time: [
      { speciesId: 468, nome: "Togekiss", level: 27 },
      { speciesId: 911, nome: "Skeledirge", level: 21 },
      { speciesId: 92, nome: "Gastly", level: 34 },
      { speciesId: 931, nome: "Squawkabilly-green-plumage", level: 69 },
      { speciesId: 350, nome: "Milotic", level: 35 },
      { speciesId: 150, nome: "Mewtwo", level: 44 }
    ]
  },

  {
    id: "misty-gen1",
    nome: "Misty-gen1",
    imagem: "/images/trainers/misty-gen1.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 551,
    stardust: 5091,
    xp: 173,
    ia: "estrategica",
    time: [
      { speciesId: 542, nome: "Leavanny", level: 32 },
      { speciesId: 806, nome: "Blacephalon", level: 19 },
      { speciesId: 17, nome: "Pidgeotto", level: 56 },
      { speciesId: 700, nome: "Sylveon", level: 26 },
      { speciesId: 482, nome: "Azelf", level: 31 },
      { speciesId: 68, nome: "Machamp", level: 65 }
    ]
  },

  {
    id: "misty-gen1rb",
    nome: "Misty-gen1rb",
    imagem: "/images/trainers/misty-gen1rb.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 699,
    stardust: 1902,
    xp: 217,
    ia: "aleatoria",
    time: [
      { speciesId: 259, nome: "Marshtomp", level: 25 },
      { speciesId: 235, nome: "Smeargle", level: 53 },
      { speciesId: 231, nome: "Phanpy", level: 71 },
      { speciesId: 532, nome: "Timburr", level: 53 },
      { speciesId: 1019, nome: "Hydrapple", level: 21 },
      { speciesId: 277, nome: "Swellow", level: 27 }
    ]
  },

  {
    id: "misty-gen2",
    nome: "Misty-gen2",
    imagem: "/images/trainers/misty-gen2.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 2886,
    stardust: 1325,
    xp: 203,
    ia: "agressiva",
    time: [
      { speciesId: 1025, nome: "Pecharunt", level: 23 },
      { speciesId: 498, nome: "Tepig", level: 69 },
      { speciesId: 882, nome: "Dracovish", level: 17 },
      { speciesId: 211, nome: "Qwilfish", level: 43 },
      { speciesId: 616, nome: "Shelmet", level: 45 },
      { speciesId: 20, nome: "Raticate", level: 10 }
    ]
  },

  {
    id: "misty-gen3",
    nome: "Misty-gen3",
    imagem: "/images/trainers/misty-gen3.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 2191,
    stardust: 2088,
    xp: 79,
    ia: "estrategica",
    time: [
      { speciesId: 195, nome: "Quagsire", level: 22 },
      { speciesId: 95, nome: "Onix", level: 64 },
      { speciesId: 453, nome: "Croagunk", level: 40 },
      { speciesId: 16, nome: "Pidgey", level: 61 },
      { speciesId: 473, nome: "Mamoswine", level: 77 },
      { speciesId: 48, nome: "Venonat", level: 55 }
    ]
  },

  {
    id: "misty-lgpe",
    nome: "Misty-lgpe",
    imagem: "/images/trainers/misty-lgpe.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 1607,
    stardust: 259,
    xp: 233,
    ia: "estrategica",
    time: [
      { speciesId: 633, nome: "Deino", level: 66 },
      { speciesId: 571, nome: "Zoroark", level: 73 },
      { speciesId: 659, nome: "Bunnelby", level: 75 },
      { speciesId: 155, nome: "Cyndaquil", level: 75 },
      { speciesId: 823, nome: "Corviknight", level: 21 },
      { speciesId: 551, nome: "Sandile", level: 13 }
    ]
  },

  {
    id: "misty-masters",
    nome: "Misty-masters",
    imagem: "/images/trainers/misty-masters.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 2180,
    stardust: 837,
    xp: 56,
    ia: "aleatoria",
    time: [
      { speciesId: 179, nome: "Mareep", level: 47 },
      { speciesId: 311, nome: "Plusle", level: 66 },
      { speciesId: 260, nome: "Swampert", level: 14 },
      { speciesId: 326, nome: "Grumpig", level: 70 },
      { speciesId: 131, nome: "Lapras", level: 51 },
      { speciesId: 539, nome: "Sawk", level: 58 }
    ]
  },

  {
    id: "misty",
    nome: "Misty",
    imagem: "/images/trainers/misty.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 1356,
    stardust: 3334,
    xp: 119,
    ia: "defensiva",
    time: [
      { speciesId: 833, nome: "Chewtle", level: 30 },
      { speciesId: 872, nome: "Snom", level: 28 },
      { speciesId: 339, nome: "Barboach", level: 48 },
      { speciesId: 346, nome: "Cradily", level: 73 },
      { speciesId: 465, nome: "Tangrowth", level: 74 },
      { speciesId: 219, nome: "Magcargo", level: 78 }
    ]
  },

  {
    id: "model-gen8",
    nome: "Model-gen8",
    imagem: "/images/trainers/model-gen8.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 1756,
    stardust: 727,
    xp: 92,
    ia: "aleatoria",
    time: [
      { speciesId: 46, nome: "Paras", level: 72 },
      { speciesId: 591, nome: "Amoonguss", level: 59 },
      { speciesId: 940, nome: "Wattrel", level: 46 },
      { speciesId: 989, nome: "Sandy-shocks", level: 46 },
      { speciesId: 537, nome: "Seismitoad", level: 25 },
      { speciesId: 887, nome: "Dragapult", level: 79 }
    ]
  },

  {
    id: "mohn-anime",
    nome: "Mohn-anime",
    imagem: "/images/trainers/mohn-anime.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 2001,
    stardust: 5335,
    xp: 194,
    ia: "defensiva",
    time: [
      { speciesId: 251, nome: "Celebi", level: 62 },
      { speciesId: 558, nome: "Crustle", level: 35 },
      { speciesId: 568, nome: "Trubbish", level: 42 },
      { speciesId: 122, nome: "Mr-mime", level: 13 },
      { speciesId: 11, nome: "Metapod", level: 76 },
      { speciesId: 544, nome: "Whirlipede", level: 62 }
    ]
  },

  {
    id: "mohn",
    nome: "Mohn",
    imagem: "/images/trainers/mohn.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 1751,
    stardust: 4559,
    xp: 497,
    ia: "agressiva",
    time: [
      { speciesId: 119, nome: "Seaking", level: 30 },
      { speciesId: 531, nome: "Audino", level: 62 },
      { speciesId: 71, nome: "Victreebel", level: 76 },
      { speciesId: 306, nome: "Aggron", level: 66 },
      { speciesId: 680, nome: "Doublade", level: 77 },
      { speciesId: 455, nome: "Carnivine", level: 43 }
    ]
  },

  {
    id: "molayne",
    nome: "Molayne",
    imagem: "/images/trainers/molayne.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 576,
    stardust: 731,
    xp: 447,
    ia: "estrategica",
    time: [
      { speciesId: 329, nome: "Vibrava", level: 72 },
      { speciesId: 418, nome: "Buizel", level: 77 },
      { speciesId: 349, nome: "Feebas", level: 49 },
      { speciesId: 732, nome: "Trumbeak", level: 21 },
      { speciesId: 165, nome: "Ledyba", level: 59 },
      { speciesId: 677, nome: "Espurr", level: 29 }
    ]
  },

  {
    id: "mom-alola",
    nome: "Mom-alola",
    imagem: "/images/trainers/mom-alola.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 275,
    stardust: 120,
    xp: 392,
    ia: "agressiva",
    time: [
      { speciesId: 597, nome: "Ferroseed", level: 39 },
      { speciesId: 525, nome: "Boldore", level: 11 },
      { speciesId: 81, nome: "Magnemite", level: 30 },
      { speciesId: 976, nome: "Veluza", level: 59 },
      { speciesId: 963, nome: "Finizen", level: 61 },
      { speciesId: 321, nome: "Wailord", level: 66 }
    ]
  },

  {
    id: "mom-hoenn",
    nome: "Mom-hoenn",
    imagem: "/images/trainers/mom-hoenn.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 572,
    stardust: 1020,
    xp: 71,
    ia: "defensiva",
    time: [
      { speciesId: 1, nome: "Bulbasaur", level: 47 },
      { speciesId: 513, nome: "Pansear", level: 21 },
      { speciesId: 334, nome: "Altaria", level: 50 },
      { speciesId: 111, nome: "Rhyhorn", level: 39 },
      { speciesId: 293, nome: "Whismur", level: 46 },
      { speciesId: 335, nome: "Zangoose", level: 71 }
    ]
  },

  {
    id: "mom-johto",
    nome: "Mom-johto",
    imagem: "/images/trainers/mom-johto.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 1410,
    stardust: 3604,
    xp: 109,
    ia: "estrategica",
    time: [
      { speciesId: 795, nome: "Pheromosa", level: 14 },
      { speciesId: 49, nome: "Venomoth", level: 77 },
      { speciesId: 388, nome: "Grotle", level: 68 },
      { speciesId: 198, nome: "Murkrow", level: 48 },
      { speciesId: 208, nome: "Steelix", level: 23 },
      { speciesId: 413, nome: "Wormadam-plant", level: 64 }
    ]
  },

  {
    id: "mom-paldea",
    nome: "Mom-paldea",
    imagem: "/images/trainers/mom-paldea.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 1258,
    stardust: 5133,
    xp: 159,
    ia: "agressiva",
    time: [
      { speciesId: 382, nome: "Kyogre", level: 43 },
      { speciesId: 187, nome: "Hoppip", level: 78 },
      { speciesId: 230, nome: "Kingdra", level: 31 },
      { speciesId: 298, nome: "Azurill", level: 46 },
      { speciesId: 510, nome: "Liepard", level: 78 },
      { speciesId: 439, nome: "Mime-jr", level: 72 }
    ]
  },

  {
    id: "mom-unova",
    nome: "Mom-unova",
    imagem: "/images/trainers/mom-unova.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 2811,
    stardust: 855,
    xp: 204,
    ia: "aleatoria",
    time: [
      { speciesId: 747, nome: "Mareanie", level: 41 },
      { speciesId: 832, nome: "Dubwool", level: 78 },
      { speciesId: 272, nome: "Ludicolo", level: 40 },
      { speciesId: 708, nome: "Phantump", level: 74 },
      { speciesId: 912, nome: "Quaxly", level: 76 },
      { speciesId: 751, nome: "Dewpider", level: 14 }
    ]
  },

  {
    id: "mom-unova2",
    nome: "Mom-unova2",
    imagem: "/images/trainers/mom-unova2.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 2158,
    stardust: 4446,
    xp: 480,
    ia: "agressiva",
    time: [
      { speciesId: 322, nome: "Numel", level: 23 },
      { speciesId: 517, nome: "Munna", level: 18 },
      { speciesId: 560, nome: "Scrafty", level: 44 },
      { speciesId: 323, nome: "Camerupt", level: 31 },
      { speciesId: 54, nome: "Psyduck", level: 28 },
      { speciesId: 278, nome: "Wingull", level: 69 }
    ]
  },

  {
    id: "morgan",
    nome: "Morgan",
    imagem: "/images/trainers/morgan.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 827,
    stardust: 3797,
    xp: 385,
    ia: "estrategica",
    time: [
      { speciesId: 44, nome: "Gloom", level: 41 },
      { speciesId: 597, nome: "Ferroseed", level: 22 },
      { speciesId: 737, nome: "Charjabug", level: 75 },
      { speciesId: 91, nome: "Cloyster", level: 80 },
      { speciesId: 588, nome: "Karrablast", level: 52 },
      { speciesId: 278, nome: "Wingull", level: 12 }
    ]
  },

  {
    id: "morty-gen2",
    nome: "Morty-gen2",
    imagem: "/images/trainers/morty-gen2.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 2874,
    stardust: 1905,
    xp: 249,
    ia: "agressiva",
    time: [
      { speciesId: 633, nome: "Deino", level: 17 },
      { speciesId: 269, nome: "Dustox", level: 32 },
      { speciesId: 608, nome: "Lampent", level: 55 },
      { speciesId: 89, nome: "Muk", level: 51 },
      { speciesId: 373, nome: "Salamence", level: 28 },
      { speciesId: 662, nome: "Fletchinder", level: 26 }
    ]
  },

  {
    id: "morty-masters",
    nome: "Morty-masters",
    imagem: "/images/trainers/morty-masters.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 2154,
    stardust: 5115,
    xp: 245,
    ia: "defensiva",
    time: [
      { speciesId: 825, nome: "Dottler", level: 29 },
      { speciesId: 90, nome: "Shellder", level: 48 },
      { speciesId: 796, nome: "Xurkitree", level: 80 },
      { speciesId: 467, nome: "Magmortar", level: 22 },
      { speciesId: 407, nome: "Roserade", level: 73 },
      { speciesId: 762, nome: "Steenee", level: 78 }
    ]
  },

  {
    id: "morty-masters2",
    nome: "Morty-masters2",
    imagem: "/images/trainers/morty-masters2.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 2465,
    stardust: 3570,
    xp: 485,
    ia: "aleatoria",
    time: [
      { speciesId: 496, nome: "Servine", level: 12 },
      { speciesId: 692, nome: "Clauncher", level: 64 },
      { speciesId: 953, nome: "Rellor", level: 46 },
      { speciesId: 933, nome: "Naclstack", level: 65 },
      { speciesId: 773, nome: "Silvally", level: 23 },
      { speciesId: 638, nome: "Cobalion", level: 16 }
    ]
  },

  {
    id: "morty-masters3",
    nome: "Morty-masters3",
    imagem: "/images/trainers/morty-masters3.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 1557,
    stardust: 4689,
    xp: 150,
    ia: "estrategica",
    time: [
      { speciesId: 611, nome: "Fraxure", level: 68 },
      { speciesId: 706, nome: "Goodra", level: 59 },
      { speciesId: 879, nome: "Copperajah", level: 38 },
      { speciesId: 210, nome: "Granbull", level: 21 },
      { speciesId: 623, nome: "Golurk", level: 68 },
      { speciesId: 595, nome: "Joltik", level: 54 }
    ]
  },

  {
    id: "morty",
    nome: "Morty",
    imagem: "/images/trainers/morty.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 2909,
    stardust: 3466,
    xp: 369,
    ia: "defensiva",
    time: [
      { speciesId: 614, nome: "Beartic", level: 13 },
      { speciesId: 472, nome: "Gliscor", level: 21 },
      { speciesId: 871, nome: "Pincurchin", level: 75 },
      { speciesId: 369, nome: "Relicanth", level: 35 },
      { speciesId: 269, nome: "Dustox", level: 60 },
      { speciesId: 1013, nome: "Sinistcha", level: 36 }
    ]
  },

  {
    id: "mrbriney",
    nome: "Mrbriney",
    imagem: "/images/trainers/mrbriney.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 2056,
    stardust: 3340,
    xp: 257,
    ia: "estrategica",
    time: [
      { speciesId: 560, nome: "Scrafty", level: 79 },
      { speciesId: 79, nome: "Slowpoke", level: 30 },
      { speciesId: 227, nome: "Skarmory", level: 33 },
      { speciesId: 34, nome: "Nidoking", level: 26 },
      { speciesId: 481, nome: "Mesprit", level: 14 },
      { speciesId: 410, nome: "Shieldon", level: 38 }
    ]
  },

  {
    id: "mrfuji-gen3",
    nome: "Mrfuji-gen3",
    imagem: "/images/trainers/mrfuji-gen3.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 537,
    stardust: 1628,
    xp: 152,
    ia: "defensiva",
    time: [
      { speciesId: 640, nome: "Virizion", level: 41 },
      { speciesId: 496, nome: "Servine", level: 10 },
      { speciesId: 764, nome: "Comfey", level: 67 },
      { speciesId: 637, nome: "Volcarona", level: 16 },
      { speciesId: 194, nome: "Wooper", level: 76 },
      { speciesId: 24, nome: "Arbok", level: 19 }
    ]
  },

  {
    id: "mrstone",
    nome: "Mrstone",
    imagem: "/images/trainers/mrstone.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 2477,
    stardust: 2317,
    xp: 374,
    ia: "estrategica",
    time: [
      { speciesId: 524, nome: "Roggenrola", level: 40 },
      { speciesId: 722, nome: "Rowlet", level: 79 },
      { speciesId: 1019, nome: "Hydrapple", level: 47 },
      { speciesId: 170, nome: "Chinchou", level: 69 },
      { speciesId: 101, nome: "Electrode", level: 46 },
      { speciesId: 1025, nome: "Pecharunt", level: 58 }
    ]
  },

  {
    id: "musician-gen8",
    nome: "Musician-gen8",
    imagem: "/images/trainers/musician-gen8.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 787,
    stardust: 3721,
    xp: 111,
    ia: "agressiva",
    time: [
      { speciesId: 1007, nome: "Koraidon", level: 12 },
      { speciesId: 38, nome: "Ninetales", level: 55 },
      { speciesId: 857, nome: "Hattrem", level: 12 },
      { speciesId: 693, nome: "Clawitzer", level: 43 },
      { speciesId: 991, nome: "Iron-bundle", level: 40 },
      { speciesId: 705, nome: "Sliggoo", level: 35 }
    ]
  },

  {
    id: "musician-gen9",
    nome: "Musician-gen9",
    imagem: "/images/trainers/musician-gen9.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 215,
    stardust: 3245,
    xp: 310,
    ia: "defensiva",
    time: [
      { speciesId: 608, nome: "Lampent", level: 66 },
      { speciesId: 132, nome: "Ditto", level: 77 },
      { speciesId: 382, nome: "Kyogre", level: 13 },
      { speciesId: 400, nome: "Bibarel", level: 58 },
      { speciesId: 434, nome: "Stunky", level: 52 },
      { speciesId: 562, nome: "Yamask", level: 23 }
    ]
  },

  {
    id: "musician",
    nome: "Musician",
    imagem: "/images/trainers/musician.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 918,
    stardust: 3188,
    xp: 192,
    ia: "defensiva",
    time: [
      { speciesId: 663, nome: "Talonflame", level: 12 },
      { speciesId: 156, nome: "Quilava", level: 65 },
      { speciesId: 995, nome: "Iron-thorns", level: 53 },
      { speciesId: 151, nome: "Mew", level: 23 },
      { speciesId: 833, nome: "Chewtle", level: 25 },
      { speciesId: 341, nome: "Corphish", level: 13 }
    ]
  },

  {
    id: "mustard-champion",
    nome: "Mustard-champion",
    imagem: "/images/trainers/mustard-champion.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 2373,
    stardust: 5092,
    xp: 348,
    ia: "defensiva",
    time: [
      { speciesId: 485, nome: "Heatran", level: 25 },
      { speciesId: 871, nome: "Pincurchin", level: 62 },
      { speciesId: 834, nome: "Drednaw", level: 38 },
      { speciesId: 893, nome: "Zarude", level: 75 },
      { speciesId: 40, nome: "Wigglytuff", level: 12 },
      { speciesId: 695, nome: "Heliolisk", level: 72 }
    ]
  },

  {
    id: "mustard-master",
    nome: "Mustard-master",
    imagem: "/images/trainers/mustard-master.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 2989,
    stardust: 106,
    xp: 382,
    ia: "estrategica",
    time: [
      { speciesId: 480, nome: "Uxie", level: 61 },
      { speciesId: 960, nome: "Wiglett", level: 69 },
      { speciesId: 888, nome: "Zacian", level: 63 },
      { speciesId: 392, nome: "Infernape", level: 75 },
      { speciesId: 142, nome: "Aerodactyl", level: 38 },
      { speciesId: 429, nome: "Mismagius", level: 24 }
    ]
  },

  {
    id: "mustard",
    nome: "Mustard",
    imagem: "/images/trainers/mustard.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 2299,
    stardust: 3245,
    xp: 151,
    ia: "estrategica",
    time: [
      { speciesId: 236, nome: "Tyrogue", level: 34 },
      { speciesId: 17, nome: "Pidgeotto", level: 12 },
      { speciesId: 185, nome: "Sudowoodo", level: 76 },
      { speciesId: 923, nome: "Pawmot", level: 53 },
      { speciesId: 267, nome: "Beautifly", level: 12 },
      { speciesId: 954, nome: "Rabsca", level: 51 }
    ]
  },

  {
    id: "n-masters",
    nome: "N-masters",
    imagem: "/images/trainers/n-masters.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 1536,
    stardust: 4686,
    xp: 133,
    ia: "estrategica",
    time: [
      { speciesId: 282, nome: "Gardevoir", level: 37 },
      { speciesId: 158, nome: "Totodile", level: 71 },
      { speciesId: 720, nome: "Hoopa", level: 43 },
      { speciesId: 725, nome: "Litten", level: 54 },
      { speciesId: 243, nome: "Raikou", level: 58 },
      { speciesId: 307, nome: "Meditite", level: 70 }
    ]
  },

  {
    id: "n-masters2",
    nome: "N-masters2",
    imagem: "/images/trainers/n-masters2.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 661,
    stardust: 200,
    xp: 52,
    ia: "defensiva",
    time: [
      { speciesId: 867, nome: "Runerigus", level: 66 },
      { speciesId: 1017, nome: "Ogerpon", level: 72 },
      { speciesId: 367, nome: "Huntail", level: 61 },
      { speciesId: 881, nome: "Arctozolt", level: 49 },
      { speciesId: 477, nome: "Dusknoir", level: 70 },
      { speciesId: 459, nome: "Snover", level: 78 }
    ]
  },

  {
    id: "n-masters3",
    nome: "N-masters3",
    imagem: "/images/trainers/n-masters3.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 652,
    stardust: 5427,
    xp: 468,
    ia: "aleatoria",
    time: [
      { speciesId: 247, nome: "Pupitar", level: 27 },
      { speciesId: 808, nome: "Meltan", level: 49 },
      { speciesId: 185, nome: "Sudowoodo", level: 51 },
      { speciesId: 367, nome: "Huntail", level: 23 },
      { speciesId: 86, nome: "Seel", level: 60 },
      { speciesId: 777, nome: "Togedemaru", level: 41 }
    ]
  },

  {
    id: "n",
    nome: "N",
    imagem: "/images/trainers/n.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 1141,
    stardust: 3129,
    xp: 69,
    ia: "aleatoria",
    time: [
      { speciesId: 107, nome: "Hitmonchan", level: 13 },
      { speciesId: 11, nome: "Metapod", level: 29 },
      { speciesId: 311, nome: "Plusle", level: 44 },
      { speciesId: 558, nome: "Crustle", level: 60 },
      { speciesId: 353, nome: "Shuppet", level: 11 },
      { speciesId: 457, nome: "Lumineon", level: 64 }
    ]
  },

  {
    id: "nancy",
    nome: "Nancy",
    imagem: "/images/trainers/nancy.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "dificil",
    recompensa: 685,
    stardust: 2306,
    xp: 254,
    ia: "aleatoria",
    time: [
      { speciesId: 167, nome: "Spinarak", level: 14 },
      { speciesId: 940, nome: "Wattrel", level: 26 },
      { speciesId: 798, nome: "Kartana", level: 51 },
      { speciesId: 712, nome: "Bergmite", level: 34 },
      { speciesId: 313, nome: "Volbeat", level: 29 },
      { speciesId: 282, nome: "Gardevoir", level: 44 }
    ]
  },

  {
    id: "nanu",
    nome: "Nanu",
    imagem: "/images/trainers/nanu.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 1001,
    stardust: 674,
    xp: 461,
    ia: "agressiva",
    time: [
      { speciesId: 232, nome: "Donphan", level: 10 },
      { speciesId: 132, nome: "Ditto", level: 27 },
      { speciesId: 368, nome: "Gorebyss", level: 65 },
      { speciesId: 1017, nome: "Ogerpon", level: 51 },
      { speciesId: 993, nome: "Iron-jugulis", level: 73 },
      { speciesId: 588, nome: "Karrablast", level: 37 }
    ]
  },

  {
    id: "nate-masters",
    nome: "Nate-masters",
    imagem: "/images/trainers/nate-masters.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 2040,
    stardust: 4627,
    xp: 482,
    ia: "agressiva",
    time: [
      { speciesId: 500, nome: "Emboar", level: 10 },
      { speciesId: 669, nome: "Flabebe", level: 32 },
      { speciesId: 552, nome: "Krokorok", level: 60 },
      { speciesId: 553, nome: "Krookodile", level: 28 },
      { speciesId: 897, nome: "Spectrier", level: 14 },
      { speciesId: 73, nome: "Tentacruel", level: 30 }
    ]
  },

  {
    id: "nate-pokestar",
    nome: "Nate-pokestar",
    imagem: "/images/trainers/nate-pokestar.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 2405,
    stardust: 3839,
    xp: 373,
    ia: "aleatoria",
    time: [
      { speciesId: 1, nome: "Bulbasaur", level: 64 },
      { speciesId: 40, nome: "Wigglytuff", level: 20 },
      { speciesId: 654, nome: "Braixen", level: 20 },
      { speciesId: 792, nome: "Lunala", level: 19 },
      { speciesId: 763, nome: "Tsareena", level: 59 },
      { speciesId: 609, nome: "Chandelure", level: 63 }
    ]
  },

  {
    id: "nate-pokestar3",
    nome: "Nate-pokestar3",
    imagem: "/images/trainers/nate-pokestar3.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 1601,
    stardust: 3666,
    xp: 255,
    ia: "estrategica",
    time: [
      { speciesId: 506, nome: "Lillipup", level: 41 },
      { speciesId: 84, nome: "Doduo", level: 15 },
      { speciesId: 830, nome: "Eldegoss", level: 39 },
      { speciesId: 715, nome: "Noivern", level: 53 },
      { speciesId: 598, nome: "Ferrothorn", level: 38 },
      { speciesId: 1003, nome: "Ting-lu", level: 15 }
    ]
  },

  {
    id: "nate-wonderlauncher",
    nome: "Nate-wonderlauncher",
    imagem: "/images/trainers/nate-wonderlauncher.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 680,
    stardust: 3488,
    xp: 207,
    ia: "estrategica",
    time: [
      { speciesId: 170, nome: "Chinchou", level: 32 },
      { speciesId: 344, nome: "Claydol", level: 70 },
      { speciesId: 107, nome: "Hitmonchan", level: 39 },
      { speciesId: 256, nome: "Combusken", level: 72 },
      { speciesId: 786, nome: "Tapu-lele", level: 24 },
      { speciesId: 320, nome: "Wailmer", level: 80 }
    ]
  },

  {
    id: "nate",
    nome: "Nate",
    imagem: "/images/trainers/nate.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 1275,
    stardust: 4173,
    xp: 316,
    ia: "aleatoria",
    time: [
      { speciesId: 1021, nome: "Raging-bolt", level: 39 },
      { speciesId: 715, nome: "Noivern", level: 59 },
      { speciesId: 52, nome: "Meowth", level: 63 },
      { speciesId: 857, nome: "Hattrem", level: 34 },
      { speciesId: 354, nome: "Banette", level: 53 },
      { speciesId: 203, nome: "Girafarig", level: 35 }
    ]
  },

  {
    id: "naveen",
    nome: "Naveen",
    imagem: "/images/trainers/naveen.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "dificil",
    recompensa: 2295,
    stardust: 2197,
    xp: 114,
    ia: "defensiva",
    time: [
      { speciesId: 936, nome: "Armarouge", level: 58 },
      { speciesId: 895, nome: "Regidrago", level: 38 },
      { speciesId: 180, nome: "Flaaffy", level: 12 },
      { speciesId: 663, nome: "Talonflame", level: 41 },
      { speciesId: 239, nome: "Elekid", level: 51 },
      { speciesId: 487, nome: "Giratina-altered", level: 23 }
    ]
  },

  {
    id: "nemona-masters",
    nome: "Nemona-masters",
    imagem: "/images/trainers/nemona-masters.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "dificil",
    recompensa: 2906,
    stardust: 1508,
    xp: 497,
    ia: "agressiva",
    time: [
      { speciesId: 684, nome: "Swirlix", level: 12 },
      { speciesId: 704, nome: "Goomy", level: 43 },
      { speciesId: 259, nome: "Marshtomp", level: 40 },
      { speciesId: 623, nome: "Golurk", level: 22 },
      { speciesId: 391, nome: "Monferno", level: 27 },
      { speciesId: 129, nome: "Magikarp", level: 15 }
    ]
  },

  {
    id: "nemona-s",
    nome: "Nemona-s",
    imagem: "/images/trainers/nemona-s.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 2337,
    stardust: 5102,
    xp: 340,
    ia: "estrategica",
    time: [
      { speciesId: 754, nome: "Lurantis", level: 33 },
      { speciesId: 576, nome: "Gothitelle", level: 29 },
      { speciesId: 640, nome: "Virizion", level: 68 },
      { speciesId: 309, nome: "Electrike", level: 75 },
      { speciesId: 103, nome: "Exeggutor", level: 20 },
      { speciesId: 586, nome: "Sawsbuck", level: 52 }
    ]
  },

  {
    id: "nemona-v",
    nome: "Nemona-v",
    imagem: "/images/trainers/nemona-v.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 1890,
    stardust: 5486,
    xp: 165,
    ia: "aleatoria",
    time: [
      { speciesId: 823, nome: "Corviknight", level: 48 },
      { speciesId: 827, nome: "Nickit", level: 69 },
      { speciesId: 246, nome: "Larvitar", level: 15 },
      { speciesId: 405, nome: "Luxray", level: 10 },
      { speciesId: 138, nome: "Omanyte", level: 38 },
      { speciesId: 519, nome: "Pidove", level: 58 }
    ]
  },

  {
    id: "neroli",
    nome: "Neroli",
    imagem: "/images/trainers/neroli.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 274,
    stardust: 3610,
    xp: 390,
    ia: "estrategica",
    time: [
      { speciesId: 974, nome: "Cetoddle", level: 67 },
      { speciesId: 696, nome: "Tyrunt", level: 68 },
      { speciesId: 376, nome: "Metagross", level: 72 },
      { speciesId: 986, nome: "Brute-bonnet", level: 76 },
      { speciesId: 142, nome: "Aerodactyl", level: 69 },
      { speciesId: 119, nome: "Seaking", level: 29 }
    ]
  },

  {
    id: "nessa-masters",
    nome: "Nessa-masters",
    imagem: "/images/trainers/nessa-masters.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 802,
    stardust: 4265,
    xp: 368,
    ia: "estrategica",
    time: [
      { speciesId: 387, nome: "Turtwig", level: 65 },
      { speciesId: 777, nome: "Togedemaru", level: 70 },
      { speciesId: 150, nome: "Mewtwo", level: 37 },
      { speciesId: 819, nome: "Skwovet", level: 66 },
      { speciesId: 877, nome: "Morpeko-full-belly", level: 17 },
      { speciesId: 379, nome: "Registeel", level: 19 }
    ]
  },

  {
    id: "nessa",
    nome: "Nessa",
    imagem: "/images/trainers/nessa.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 701,
    stardust: 1861,
    xp: 258,
    ia: "defensiva",
    time: [
      { speciesId: 947, nome: "Brambleghast", level: 52 },
      { speciesId: 842, nome: "Appletun", level: 51 },
      { speciesId: 797, nome: "Celesteela", level: 52 },
      { speciesId: 640, nome: "Virizion", level: 39 },
      { speciesId: 612, nome: "Haxorus", level: 42 },
      { speciesId: 509, nome: "Purrloin", level: 29 }
    ]
  },

  {
    id: "ninjaboy-gen3",
    nome: "Ninjaboy-gen3",
    imagem: "/images/trainers/ninjaboy-gen3.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 1429,
    stardust: 5090,
    xp: 78,
    ia: "aleatoria",
    time: [
      { speciesId: 32, nome: "Nidoran-m", level: 63 },
      { speciesId: 225, nome: "Delibird", level: 48 },
      { speciesId: 423, nome: "Gastrodon", level: 51 },
      { speciesId: 209, nome: "Snubbull", level: 41 },
      { speciesId: 532, nome: "Timburr", level: 37 },
      { speciesId: 95, nome: "Onix", level: 57 }
    ]
  },

  {
    id: "ninjaboy-gen6",
    nome: "Ninjaboy-gen6",
    imagem: "/images/trainers/ninjaboy-gen6.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 1848,
    stardust: 4432,
    xp: 426,
    ia: "estrategica",
    time: [
      { speciesId: 160, nome: "Feraligatr", level: 57 },
      { speciesId: 957, nome: "Tinkatink", level: 68 },
      { speciesId: 571, nome: "Zoroark", level: 52 },
      { speciesId: 548, nome: "Petilil", level: 14 },
      { speciesId: 287, nome: "Slakoth", level: 79 },
      { speciesId: 1016, nome: "Fezandipiti", level: 63 }
    ]
  },

  {
    id: "ninjaboy",
    nome: "Ninjaboy",
    imagem: "/images/trainers/ninjaboy.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 2835,
    stardust: 3814,
    xp: 270,
    ia: "aleatoria",
    time: [
      { speciesId: 737, nome: "Charjabug", level: 20 },
      { speciesId: 85, nome: "Dodrio", level: 79 },
      { speciesId: 620, nome: "Mienshao", level: 29 },
      { speciesId: 305, nome: "Lairon", level: 50 },
      { speciesId: 453, nome: "Croagunk", level: 45 },
      { speciesId: 952, nome: "Scovillain", level: 53 }
    ]
  },

  {
    id: "nita",
    nome: "Nita",
    imagem: "/images/trainers/nita.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 1679,
    stardust: 2852,
    xp: 107,
    ia: "aleatoria",
    time: [
      { speciesId: 886, nome: "Drakloak", level: 60 },
      { speciesId: 686, nome: "Inkay", level: 53 },
      { speciesId: 928, nome: "Smoliv", level: 55 },
      { speciesId: 118, nome: "Goldeen", level: 62 },
      { speciesId: 482, nome: "Azelf", level: 24 },
      { speciesId: 861, nome: "Grimmsnarl", level: 53 }
    ]
  },

  {
    id: "nobunaga-conquest",
    nome: "Nobunaga-conquest",
    imagem: "/images/trainers/nobunaga-conquest.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 319,
    stardust: 997,
    xp: 479,
    ia: "agressiva",
    time: [
      { speciesId: 737, nome: "Charjabug", level: 70 },
      { speciesId: 523, nome: "Zebstrika", level: 35 },
      { speciesId: 818, nome: "Inteleon", level: 42 },
      { speciesId: 24, nome: "Arbok", level: 70 },
      { speciesId: 332, nome: "Cacturne", level: 74 },
      { speciesId: 623, nome: "Golurk", level: 26 }
    ]
  },

  {
    id: "noland-gen3",
    nome: "Noland-gen3",
    imagem: "/images/trainers/noland-gen3.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 2357,
    stardust: 3274,
    xp: 384,
    ia: "aleatoria",
    time: [
      { speciesId: 8, nome: "Wartortle", level: 35 },
      { speciesId: 124, nome: "Jynx", level: 64 },
      { speciesId: 180, nome: "Flaaffy", level: 20 },
      { speciesId: 772, nome: "Type-null", level: 55 },
      { speciesId: 646, nome: "Kyurem", level: 62 },
      { speciesId: 158, nome: "Totodile", level: 77 }
    ]
  },

  {
    id: "noland",
    nome: "Noland",
    imagem: "/images/trainers/noland.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 1352,
    stardust: 790,
    xp: 452,
    ia: "estrategica",
    time: [
      { speciesId: 163, nome: "Hoothoot", level: 10 },
      { speciesId: 909, nome: "Fuecoco", level: 39 },
      { speciesId: 459, nome: "Snover", level: 10 },
      { speciesId: 986, nome: "Brute-bonnet", level: 22 },
      { speciesId: 46, nome: "Paras", level: 12 },
      { speciesId: 388, nome: "Grotle", level: 17 }
    ]
  },

  {
    id: "norman-gen3",
    nome: "Norman-gen3",
    imagem: "/images/trainers/norman-gen3.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 1286,
    stardust: 3063,
    xp: 309,
    ia: "estrategica",
    time: [
      { speciesId: 25, nome: "Pikachu", level: 43 },
      { speciesId: 185, nome: "Sudowoodo", level: 61 },
      { speciesId: 462, nome: "Magnezone", level: 47 },
      { speciesId: 584, nome: "Vanilluxe", level: 14 },
      { speciesId: 311, nome: "Plusle", level: 73 },
      { speciesId: 635, nome: "Hydreigon", level: 10 }
    ]
  },

  {
    id: "norman-gen6",
    nome: "Norman-gen6",
    imagem: "/images/trainers/norman-gen6.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 2518,
    stardust: 3829,
    xp: 182,
    ia: "agressiva",
    time: [
      { speciesId: 392, nome: "Infernape", level: 63 },
      { speciesId: 947, nome: "Brambleghast", level: 19 },
      { speciesId: 81, nome: "Magnemite", level: 33 },
      { speciesId: 219, nome: "Magcargo", level: 74 },
      { speciesId: 178, nome: "Xatu", level: 58 },
      { speciesId: 244, nome: "Entei", level: 14 }
    ]
  },

  {
    id: "norman",
    nome: "Norman",
    imagem: "/images/trainers/norman.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 2756,
    stardust: 4592,
    xp: 493,
    ia: "agressiva",
    time: [
      { speciesId: 961, nome: "Wugtrio", level: 39 },
      { speciesId: 587, nome: "Emolga", level: 14 },
      { speciesId: 458, nome: "Mantyke", level: 16 },
      { speciesId: 287, nome: "Slakoth", level: 27 },
      { speciesId: 158, nome: "Totodile", level: 70 },
      { speciesId: 49, nome: "Venomoth", level: 10 }
    ]
  },

  {
    id: "nurse",
    nome: "Nurse",
    imagem: "/images/trainers/nurse.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 2122,
    stardust: 1610,
    xp: 77,
    ia: "estrategica",
    time: [
      { speciesId: 154, nome: "Meganium", level: 63 },
      { speciesId: 68, nome: "Machamp", level: 66 },
      { speciesId: 553, nome: "Krookodile", level: 49 },
      { speciesId: 740, nome: "Crabominable", level: 20 },
      { speciesId: 545, nome: "Scolipede", level: 74 },
      { speciesId: 383, nome: "Groudon", level: 35 }
    ]
  },

  {
    id: "nurseryaide",
    nome: "Nurseryaide",
    imagem: "/images/trainers/nurseryaide.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 1738,
    stardust: 2371,
    xp: 475,
    ia: "estrategica",
    time: [
      { speciesId: 36, nome: "Clefable", level: 24 },
      { speciesId: 317, nome: "Swalot", level: 14 },
      { speciesId: 74, nome: "Geodude", level: 21 },
      { speciesId: 698, nome: "Amaura", level: 19 },
      { speciesId: 34, nome: "Nidoking", level: 29 },
      { speciesId: 738, nome: "Vikavolt", level: 58 }
    ]
  },

  {
    id: "oak-gen1",
    nome: "Oak-gen1",
    imagem: "/images/trainers/oak-gen1.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 687,
    stardust: 4258,
    xp: 492,
    ia: "estrategica",
    time: [
      { speciesId: 862, nome: "Obstagoon", level: 57 },
      { speciesId: 37, nome: "Vulpix", level: 52 },
      { speciesId: 101, nome: "Electrode", level: 78 },
      { speciesId: 290, nome: "Nincada", level: 15 },
      { speciesId: 365, nome: "Walrein", level: 28 },
      { speciesId: 147, nome: "Dratini", level: 32 }
    ]
  },

  {
    id: "oak-gen1rb",
    nome: "Oak-gen1rb",
    imagem: "/images/trainers/oak-gen1rb.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 726,
    stardust: 3393,
    xp: 98,
    ia: "aleatoria",
    time: [
      { speciesId: 587, nome: "Emolga", level: 12 },
      { speciesId: 334, nome: "Altaria", level: 45 },
      { speciesId: 898, nome: "Calyrex", level: 66 },
      { speciesId: 662, nome: "Fletchinder", level: 58 },
      { speciesId: 767, nome: "Wimpod", level: 54 },
      { speciesId: 479, nome: "Rotom", level: 38 }
    ]
  },

  {
    id: "oak-gen2",
    nome: "Oak-gen2",
    imagem: "/images/trainers/oak-gen2.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 1909,
    stardust: 3832,
    xp: 130,
    ia: "aleatoria",
    time: [
      { speciesId: 682, nome: "Spritzee", level: 37 },
      { speciesId: 394, nome: "Prinplup", level: 14 },
      { speciesId: 68, nome: "Machamp", level: 55 },
      { speciesId: 36, nome: "Clefable", level: 25 },
      { speciesId: 56, nome: "Mankey", level: 16 },
      { speciesId: 736, nome: "Grubbin", level: 45 }
    ]
  },

  {
    id: "oak-gen3",
    nome: "Oak-gen3",
    imagem: "/images/trainers/oak-gen3.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 2700,
    stardust: 1609,
    xp: 435,
    ia: "agressiva",
    time: [
      { speciesId: 1005, nome: "Roaring-moon", level: 75 },
      { speciesId: 32, nome: "Nidoran-m", level: 54 },
      { speciesId: 140, nome: "Kabuto", level: 28 },
      { speciesId: 930, nome: "Arboliva", level: 41 },
      { speciesId: 764, nome: "Comfey", level: 24 },
      { speciesId: 457, nome: "Lumineon", level: 39 }
    ]
  },

  {
    id: "oak",
    nome: "Oak",
    imagem: "/images/trainers/oak.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 380,
    stardust: 1549,
    xp: 378,
    ia: "defensiva",
    time: [
      { speciesId: 844, nome: "Sandaconda", level: 34 },
      { speciesId: 315, nome: "Roselia", level: 56 },
      { speciesId: 268, nome: "Cascoon", level: 50 },
      { speciesId: 570, nome: "Zorua", level: 49 },
      { speciesId: 16, nome: "Pidgey", level: 42 },
      { speciesId: 544, nome: "Whirlipede", level: 17 }
    ]
  },

  {
    id: "officer-gen2",
    nome: "Officer-gen2",
    imagem: "/images/trainers/officer-gen2.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "dificil",
    recompensa: 2942,
    stardust: 2642,
    xp: 354,
    ia: "defensiva",
    time: [
      { speciesId: 668, nome: "Pyroar", level: 71 },
      { speciesId: 623, nome: "Golurk", level: 49 },
      { speciesId: 134, nome: "Vaporeon", level: 62 },
      { speciesId: 300, nome: "Skitty", level: 57 },
      { speciesId: 56, nome: "Mankey", level: 57 },
      { speciesId: 390, nome: "Chimchar", level: 35 }
    ]
  },

  {
    id: "officeworker-gen9",
    nome: "Officeworker-gen9",
    imagem: "/images/trainers/officeworker-gen9.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 1984,
    stardust: 4644,
    xp: 174,
    ia: "defensiva",
    time: [
      { speciesId: 982, nome: "Dudunsparce-two-segment", level: 74 },
      { speciesId: 589, nome: "Escavalier", level: 22 },
      { speciesId: 765, nome: "Oranguru", level: 37 },
      { speciesId: 611, nome: "Fraxure", level: 27 },
      { speciesId: 153, nome: "Bayleef", level: 75 },
      { speciesId: 719, nome: "Diancie", level: 67 }
    ]
  },

  {
    id: "officeworker",
    nome: "Officeworker",
    imagem: "/images/trainers/officeworker.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 2046,
    stardust: 2068,
    xp: 264,
    ia: "defensiva",
    time: [
      { speciesId: 61, nome: "Poliwhirl", level: 49 },
      { speciesId: 981, nome: "Farigiraf", level: 35 },
      { speciesId: 656, nome: "Froakie", level: 33 },
      { speciesId: 205, nome: "Forretress", level: 67 },
      { speciesId: 316, nome: "Gulpin", level: 64 },
      { speciesId: 939, nome: "Bellibolt", level: 61 }
    ]
  },

  {
    id: "officeworkerf-gen9",
    nome: "Officeworkerf-gen9",
    imagem: "/images/trainers/officeworkerf-gen9.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 1417,
    stardust: 492,
    xp: 96,
    ia: "estrategica",
    time: [
      { speciesId: 544, nome: "Whirlipede", level: 60 },
      { speciesId: 232, nome: "Donphan", level: 73 },
      { speciesId: 60, nome: "Poliwag", level: 41 },
      { speciesId: 549, nome: "Lilligant", level: 38 },
      { speciesId: 899, nome: "Wyrdeer", level: 27 },
      { speciesId: 222, nome: "Corsola", level: 60 }
    ]
  },

  {
    id: "officeworkerf",
    nome: "Officeworkerf",
    imagem: "/images/trainers/officeworkerf.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 2303,
    stardust: 4695,
    xp: 144,
    ia: "defensiva",
    time: [
      { speciesId: 717, nome: "Yveltal", level: 29 },
      { speciesId: 120, nome: "Staryu", level: 29 },
      { speciesId: 230, nome: "Kingdra", level: 32 },
      { speciesId: 168, nome: "Ariados", level: 18 },
      { speciesId: 615, nome: "Cryogonal", level: 76 },
      { speciesId: 121, nome: "Starmie", level: 58 }
    ]
  },

  {
    id: "ogreclan",
    nome: "Ogreclan",
    imagem: "/images/trainers/ogreclan.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 2478,
    stardust: 3996,
    xp: 268,
    ia: "aleatoria",
    time: [
      { speciesId: 534, nome: "Conkeldurr", level: 28 },
      { speciesId: 205, nome: "Forretress", level: 64 },
      { speciesId: 92, nome: "Gastly", level: 21 },
      { speciesId: 133, nome: "Eevee", level: 53 },
      { speciesId: 639, nome: "Terrakion", level: 64 },
      { speciesId: 744, nome: "Rockruff", level: 35 }
    ]
  },

  {
    id: "oichi-conquest",
    nome: "Oichi-conquest",
    imagem: "/images/trainers/oichi-conquest.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 128,
    stardust: 2379,
    xp: 295,
    ia: "agressiva",
    time: [
      { speciesId: 584, nome: "Vanilluxe", level: 18 },
      { speciesId: 11, nome: "Metapod", level: 59 },
      { speciesId: 663, nome: "Talonflame", level: 29 },
      { speciesId: 852, nome: "Clobbopus", level: 22 },
      { speciesId: 794, nome: "Buzzwole", level: 79 },
      { speciesId: 116, nome: "Horsea", level: 12 }
    ]
  },

  {
    id: "oldcouple-gen3",
    nome: "Oldcouple-gen3",
    imagem: "/images/trainers/oldcouple-gen3.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 700,
    stardust: 1290,
    xp: 465,
    ia: "defensiva",
    time: [
      { speciesId: 156, nome: "Quilava", level: 21 },
      { speciesId: 31, nome: "Nidoqueen", level: 18 },
      { speciesId: 416, nome: "Vespiquen", level: 70 },
      { speciesId: 259, nome: "Marshtomp", level: 14 },
      { speciesId: 939, nome: "Bellibolt", level: 47 },
      { speciesId: 1017, nome: "Ogerpon", level: 57 }
    ]
  },

  {
    id: "oleana",
    nome: "Oleana",
    imagem: "/images/trainers/oleana.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 1268,
    stardust: 3848,
    xp: 82,
    ia: "defensiva",
    time: [
      { speciesId: 455, nome: "Carnivine", level: 20 },
      { speciesId: 881, nome: "Arctozolt", level: 10 },
      { speciesId: 297, nome: "Hariyama", level: 61 },
      { speciesId: 281, nome: "Kirlia", level: 48 },
      { speciesId: 855, nome: "Polteageist", level: 11 },
      { speciesId: 866, nome: "Mr-rime", level: 71 }
    ]
  },

  {
    id: "olivia",
    nome: "Olivia",
    imagem: "/images/trainers/olivia.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 2514,
    stardust: 135,
    xp: 407,
    ia: "agressiva",
    time: [
      { speciesId: 370, nome: "Luvdisc", level: 41 },
      { speciesId: 961, nome: "Wugtrio", level: 32 },
      { speciesId: 702, nome: "Dedenne", level: 38 },
      { speciesId: 475, nome: "Gallade", level: 53 },
      { speciesId: 925, nome: "Maushold-family-of-four", level: 68 },
      { speciesId: 1011, nome: "Dipplin", level: 38 }
    ]
  },

  {
    id: "olympia",
    nome: "Olympia",
    imagem: "/images/trainers/olympia.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 335,
    stardust: 431,
    xp: 492,
    ia: "agressiva",
    time: [
      { speciesId: 688, nome: "Binacle", level: 29 },
      { speciesId: 112, nome: "Rhydon", level: 27 },
      { speciesId: 670, nome: "Floette", level: 80 },
      { speciesId: 807, nome: "Zeraora", level: 50 },
      { speciesId: 892, nome: "Urshifu-single-strike", level: 48 },
      { speciesId: 281, nome: "Kirlia", level: 64 }
    ]
  },

  {
    id: "opal",
    nome: "Opal",
    imagem: "/images/trainers/opal.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 1825,
    stardust: 4380,
    xp: 426,
    ia: "estrategica",
    time: [
      { speciesId: 659, nome: "Bunnelby", level: 52 },
      { speciesId: 546, nome: "Cottonee", level: 71 },
      { speciesId: 983, nome: "Kingambit", level: 73 },
      { speciesId: 991, nome: "Iron-bundle", level: 63 },
      { speciesId: 481, nome: "Mesprit", level: 52 },
      { speciesId: 915, nome: "Lechonk", level: 18 }
    ]
  },

  {
    id: "ortega",
    nome: "Ortega",
    imagem: "/images/trainers/ortega.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 1720,
    stardust: 2925,
    xp: 221,
    ia: "aleatoria",
    time: [
      { speciesId: 293, nome: "Whismur", level: 15 },
      { speciesId: 260, nome: "Swampert", level: 28 },
      { speciesId: 1006, nome: "Iron-valiant", level: 71 },
      { speciesId: 611, nome: "Fraxure", level: 31 },
      { speciesId: 708, nome: "Phantump", level: 20 },
      { speciesId: 991, nome: "Iron-bundle", level: 24 }
    ]
  },

  {
    id: "owner",
    nome: "Owner",
    imagem: "/images/trainers/owner.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 684,
    stardust: 2652,
    xp: 129,
    ia: "aleatoria",
    time: [
      { speciesId: 622, nome: "Golett", level: 61 },
      { speciesId: 265, nome: "Wurmple", level: 36 },
      { speciesId: 951, nome: "Capsakid", level: 66 },
      { speciesId: 660, nome: "Diggersby", level: 66 },
      { speciesId: 706, nome: "Goodra", level: 48 },
      { speciesId: 819, nome: "Skwovet", level: 62 }
    ]
  },

  {
    id: "painter-gen3",
    nome: "Painter-gen3",
    imagem: "/images/trainers/painter-gen3.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 2831,
    stardust: 580,
    xp: 469,
    ia: "agressiva",
    time: [
      { speciesId: 702, nome: "Dedenne", level: 75 },
      { speciesId: 63, nome: "Abra", level: 42 },
      { speciesId: 555, nome: "Darmanitan-standard", level: 30 },
      { speciesId: 814, nome: "Raboot", level: 14 },
      { speciesId: 238, nome: "Smoochum", level: 46 },
      { speciesId: 744, nome: "Rockruff", level: 13 }
    ]
  },

  {
    id: "palina",
    nome: "Palina",
    imagem: "/images/trainers/palina.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 1442,
    stardust: 2186,
    xp: 221,
    ia: "aleatoria",
    time: [
      { speciesId: 586, nome: "Sawsbuck", level: 11 },
      { speciesId: 204, nome: "Pineco", level: 15 },
      { speciesId: 832, nome: "Dubwool", level: 26 },
      { speciesId: 782, nome: "Jangmo-o", level: 39 },
      { speciesId: 252, nome: "Treecko", level: 32 },
      { speciesId: 438, nome: "Bonsly", level: 71 }
    ]
  },

  {
    id: "palmer",
    nome: "Palmer",
    imagem: "/images/trainers/palmer.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 2906,
    stardust: 1015,
    xp: 176,
    ia: "defensiva",
    time: [
      { speciesId: 559, nome: "Scraggy", level: 47 },
      { speciesId: 411, nome: "Bastiodon", level: 68 },
      { speciesId: 234, nome: "Stantler", level: 40 },
      { speciesId: 515, nome: "Panpour", level: 55 },
      { speciesId: 507, nome: "Herdier", level: 43 },
      { speciesId: 873, nome: "Frosmoth", level: 64 }
    ]
  },

  {
    id: "parasollady-gen3",
    nome: "Parasollady-gen3",
    imagem: "/images/trainers/parasollady-gen3.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 592,
    stardust: 5439,
    xp: 144,
    ia: "aleatoria",
    time: [
      { speciesId: 181, nome: "Ampharos", level: 14 },
      { speciesId: 402, nome: "Kricketune", level: 22 },
      { speciesId: 339, nome: "Barboach", level: 34 },
      { speciesId: 876, nome: "Indeedee-male", level: 37 },
      { speciesId: 551, nome: "Sandile", level: 13 },
      { speciesId: 267, nome: "Beautifly", level: 72 }
    ]
  },

  {
    id: "parasollady-gen4",
    nome: "Parasollady-gen4",
    imagem: "/images/trainers/parasollady-gen4.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 2113,
    stardust: 3725,
    xp: 331,
    ia: "estrategica",
    time: [
      { speciesId: 11, nome: "Metapod", level: 23 },
      { speciesId: 435, nome: "Skuntank", level: 54 },
      { speciesId: 521, nome: "Unfezant", level: 52 },
      { speciesId: 449, nome: "Hippopotas", level: 60 },
      { speciesId: 298, nome: "Azurill", level: 25 },
      { speciesId: 432, nome: "Purugly", level: 56 }
    ]
  },

  {
    id: "parasollady-gen6",
    nome: "Parasollady-gen6",
    imagem: "/images/trainers/parasollady-gen6.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 2986,
    stardust: 3195,
    xp: 395,
    ia: "agressiva",
    time: [
      { speciesId: 36, nome: "Clefable", level: 18 },
      { speciesId: 396, nome: "Starly", level: 35 },
      { speciesId: 509, nome: "Purrloin", level: 50 },
      { speciesId: 361, nome: "Snorunt", level: 11 },
      { speciesId: 555, nome: "Darmanitan-standard", level: 60 },
      { speciesId: 952, nome: "Scovillain", level: 19 }
    ]
  },

  {
    id: "parasollady",
    nome: "Parasollady",
    imagem: "/images/trainers/parasollady.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 1851,
    stardust: 1524,
    xp: 338,
    ia: "estrategica",
    time: [
      { speciesId: 817, nome: "Drizzile", level: 10 },
      { speciesId: 619, nome: "Mienfoo", level: 33 },
      { speciesId: 282, nome: "Gardevoir", level: 28 },
      { speciesId: 414, nome: "Mothim", level: 58 },
      { speciesId: 946, nome: "Bramblin", level: 59 },
      { speciesId: 88, nome: "Grimer", level: 52 }
    ]
  },

  {
    id: "paulo-masters",
    nome: "Paulo-masters",
    imagem: "/images/trainers/paulo-masters.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 2197,
    stardust: 2749,
    xp: 362,
    ia: "defensiva",
    time: [
      { speciesId: 497, nome: "Serperior", level: 54 },
      { speciesId: 560, nome: "Scrafty", level: 38 },
      { speciesId: 367, nome: "Huntail", level: 71 },
      { speciesId: 14, nome: "Kakuna", level: 12 },
      { speciesId: 621, nome: "Druddigon", level: 55 },
      { speciesId: 612, nome: "Haxorus", level: 57 }
    ]
  },

  {
    id: "paxton",
    nome: "Paxton",
    imagem: "/images/trainers/paxton.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 1350,
    stardust: 4233,
    xp: 75,
    ia: "estrategica",
    time: [
      { speciesId: 166, nome: "Ledian", level: 56 },
      { speciesId: 1020, nome: "Gouging-fire", level: 12 },
      { speciesId: 20, nome: "Raticate", level: 75 },
      { speciesId: 574, nome: "Gothita", level: 73 },
      { speciesId: 709, nome: "Trevenant", level: 26 },
      { speciesId: 729, nome: "Brionne", level: 73 }
    ]
  },

  {
    id: "pearlclanmember",
    nome: "Pearlclanmember",
    imagem: "/images/trainers/pearlclanmember.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 2520,
    stardust: 621,
    xp: 197,
    ia: "aleatoria",
    time: [
      { speciesId: 535, nome: "Tympole", level: 23 },
      { speciesId: 858, nome: "Hatterene", level: 62 },
      { speciesId: 857, nome: "Hattrem", level: 17 },
      { speciesId: 359, nome: "Absol", level: 41 },
      { speciesId: 937, nome: "Ceruledge", level: 20 },
      { speciesId: 628, nome: "Braviary", level: 51 }
    ]
  },

  {
    id: "penny",
    nome: "Penny",
    imagem: "/images/trainers/penny.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 856,
    stardust: 2225,
    xp: 303,
    ia: "agressiva",
    time: [
      { speciesId: 220, nome: "Swinub", level: 11 },
      { speciesId: 343, nome: "Baltoy", level: 50 },
      { speciesId: 410, nome: "Shieldon", level: 23 },
      { speciesId: 626, nome: "Bouffalant", level: 76 },
      { speciesId: 660, nome: "Diggersby", level: 72 },
      { speciesId: 888, nome: "Zacian", level: 67 }
    ]
  },

  {
    id: "peonia",
    nome: "Peonia",
    imagem: "/images/trainers/peonia.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 740,
    stardust: 3434,
    xp: 390,
    ia: "estrategica",
    time: [
      { speciesId: 356, nome: "Dusclops", level: 69 },
      { speciesId: 326, nome: "Grumpig", level: 39 },
      { speciesId: 505, nome: "Watchog", level: 72 },
      { speciesId: 792, nome: "Lunala", level: 79 },
      { speciesId: 823, nome: "Corviknight", level: 42 },
      { speciesId: 529, nome: "Drilbur", level: 64 }
    ]
  },

  {
    id: "peony-league",
    nome: "Peony-league",
    imagem: "/images/trainers/peony-league.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 1080,
    stardust: 5097,
    xp: 176,
    ia: "defensiva",
    time: [
      { speciesId: 848, nome: "Toxel", level: 40 },
      { speciesId: 850, nome: "Sizzlipede", level: 44 },
      { speciesId: 488, nome: "Cresselia", level: 47 },
      { speciesId: 505, nome: "Watchog", level: 67 },
      { speciesId: 356, nome: "Dusclops", level: 41 },
      { speciesId: 714, nome: "Noibat", level: 25 }
    ]
  },

  {
    id: "peony",
    nome: "Peony",
    imagem: "/images/trainers/peony.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 1239,
    stardust: 5422,
    xp: 304,
    ia: "aleatoria",
    time: [
      { speciesId: 404, nome: "Luxio", level: 50 },
      { speciesId: 709, nome: "Trevenant", level: 54 },
      { speciesId: 727, nome: "Incineroar", level: 60 },
      { speciesId: 141, nome: "Kabutops", level: 15 },
      { speciesId: 205, nome: "Forretress", level: 13 },
      { speciesId: 207, nome: "Gligar", level: 43 }
    ]
  },

  {
    id: "perrin",
    nome: "Perrin",
    imagem: "/images/trainers/perrin.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 2113,
    stardust: 3326,
    xp: 185,
    ia: "defensiva",
    time: [
      { speciesId: 790, nome: "Cosmoem", level: 51 },
      { speciesId: 839, nome: "Coalossal", level: 53 },
      { speciesId: 910, nome: "Crocalor", level: 56 },
      { speciesId: 160, nome: "Feraligatr", level: 16 },
      { speciesId: 28, nome: "Sandslash", level: 17 },
      { speciesId: 997, nome: "Arctibax", level: 21 }
    ]
  },

  {
    id: "pesselle",
    nome: "Pesselle",
    imagem: "/images/trainers/pesselle.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 2408,
    stardust: 1534,
    xp: 231,
    ia: "aleatoria",
    time: [
      { speciesId: 144, nome: "Articuno", level: 65 },
      { speciesId: 757, nome: "Salandit", level: 12 },
      { speciesId: 321, nome: "Wailord", level: 60 },
      { speciesId: 553, nome: "Krookodile", level: 65 },
      { speciesId: 124, nome: "Jynx", level: 59 },
      { speciesId: 202, nome: "Wobbuffet", level: 44 }
    ]
  },

  {
    id: "petrel",
    nome: "Petrel",
    imagem: "/images/trainers/petrel.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 1573,
    stardust: 1214,
    xp: 261,
    ia: "agressiva",
    time: [
      { speciesId: 992, nome: "Iron-hands", level: 15 },
      { speciesId: 734, nome: "Yungoos", level: 12 },
      { speciesId: 301, nome: "Delcatty", level: 19 },
      { speciesId: 770, nome: "Palossand", level: 26 },
      { speciesId: 177, nome: "Natu", level: 77 },
      { speciesId: 860, nome: "Morgrem", level: 11 }
    ]
  },

  {
    id: "phil",
    nome: "Phil",
    imagem: "/images/trainers/phil.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 2049,
    stardust: 2047,
    xp: 492,
    ia: "agressiva",
    time: [
      { speciesId: 655, nome: "Delphox", level: 58 },
      { speciesId: 782, nome: "Jangmo-o", level: 35 },
      { speciesId: 425, nome: "Drifloon", level: 14 },
      { speciesId: 74, nome: "Geodude", level: 74 },
      { speciesId: 741, nome: "Oricorio-baile", level: 60 },
      { speciesId: 116, nome: "Horsea", level: 31 }
    ]
  },

  {
    id: "phoebe-gen3",
    nome: "Phoebe-gen3",
    imagem: "/images/trainers/phoebe-gen3.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 2930,
    stardust: 759,
    xp: 454,
    ia: "estrategica",
    time: [
      { speciesId: 405, nome: "Luxray", level: 46 },
      { speciesId: 884, nome: "Duraludon", level: 72 },
      { speciesId: 149, nome: "Dragonite", level: 15 },
      { speciesId: 370, nome: "Luvdisc", level: 40 },
      { speciesId: 367, nome: "Huntail", level: 56 },
      { speciesId: 398, nome: "Staraptor", level: 27 }
    ]
  },

  {
    id: "phoebe-gen6",
    nome: "Phoebe-gen6",
    imagem: "/images/trainers/phoebe-gen6.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 178,
    stardust: 3003,
    xp: 67,
    ia: "defensiva",
    time: [
      { speciesId: 807, nome: "Zeraora", level: 69 },
      { speciesId: 396, nome: "Starly", level: 10 },
      { speciesId: 250, nome: "Ho-oh", level: 72 },
      { speciesId: 678, nome: "Meowstic-male", level: 38 },
      { speciesId: 180, nome: "Flaaffy", level: 20 },
      { speciesId: 43, nome: "Oddish", level: 63 }
    ]
  },

  {
    id: "phoebe-masters",
    nome: "Phoebe-masters",
    imagem: "/images/trainers/phoebe-masters.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 878,
    stardust: 4575,
    xp: 458,
    ia: "defensiva",
    time: [
      { speciesId: 459, nome: "Snover", level: 69 },
      { speciesId: 598, nome: "Ferrothorn", level: 13 },
      { speciesId: 535, nome: "Tympole", level: 59 },
      { speciesId: 846, nome: "Arrokuda", level: 48 },
      { speciesId: 534, nome: "Conkeldurr", level: 29 },
      { speciesId: 480, nome: "Uxie", level: 52 }
    ]
  },

  {
    id: "phorus-unite",
    nome: "Phorus-unite",
    imagem: "/images/trainers/phorus-unite.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 590,
    stardust: 1422,
    xp: 322,
    ia: "defensiva",
    time: [
      { speciesId: 476, nome: "Probopass", level: 45 },
      { speciesId: 896, nome: "Glastrier", level: 40 },
      { speciesId: 609, nome: "Chandelure", level: 67 },
      { speciesId: 256, nome: "Combusken", level: 44 },
      { speciesId: 579, nome: "Reuniclus", level: 43 },
      { speciesId: 156, nome: "Quilava", level: 46 }
    ]
  },

  {
    id: "phyco",
    nome: "Phyco",
    imagem: "/images/trainers/phyco.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 184,
    stardust: 258,
    xp: 255,
    ia: "estrategica",
    time: [
      { speciesId: 553, nome: "Krookodile", level: 36 },
      { speciesId: 428, nome: "Lopunny", level: 13 },
      { speciesId: 364, nome: "Sealeo", level: 40 },
      { speciesId: 86, nome: "Seel", level: 57 },
      { speciesId: 61, nome: "Poliwhirl", level: 76 },
      { speciesId: 470, nome: "Leafeon", level: 12 }
    ]
  },

  {
    id: "picnicker-gen2",
    nome: "Picnicker-gen2",
    imagem: "/images/trainers/picnicker-gen2.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 2816,
    stardust: 1329,
    xp: 118,
    ia: "defensiva",
    time: [
      { speciesId: 160, nome: "Feraligatr", level: 16 },
      { speciesId: 61, nome: "Poliwhirl", level: 47 },
      { speciesId: 333, nome: "Swablu", level: 29 },
      { speciesId: 412, nome: "Burmy", level: 63 },
      { speciesId: 349, nome: "Feebas", level: 50 },
      { speciesId: 110, nome: "Weezing", level: 72 }
    ]
  },

  {
    id: "picnicker-gen3",
    nome: "Picnicker-gen3",
    imagem: "/images/trainers/picnicker-gen3.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 529,
    stardust: 3395,
    xp: 286,
    ia: "aleatoria",
    time: [
      { speciesId: 461, nome: "Weavile", level: 61 },
      { speciesId: 853, nome: "Grapploct", level: 38 },
      { speciesId: 939, nome: "Bellibolt", level: 34 },
      { speciesId: 661, nome: "Fletchling", level: 54 },
      { speciesId: 87, nome: "Dewgong", level: 72 },
      { speciesId: 386, nome: "Deoxys-normal", level: 44 }
    ]
  },

  {
    id: "picnicker-gen3rs",
    nome: "Picnicker-gen3rs",
    imagem: "/images/trainers/picnicker-gen3rs.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 281,
    stardust: 3874,
    xp: 242,
    ia: "defensiva",
    time: [
      { speciesId: 1, nome: "Bulbasaur", level: 36 },
      { speciesId: 825, nome: "Dottler", level: 43 },
      { speciesId: 873, nome: "Frosmoth", level: 63 },
      { speciesId: 175, nome: "Togepi", level: 10 },
      { speciesId: 276, nome: "Taillow", level: 18 },
      { speciesId: 19, nome: "Rattata", level: 62 }
    ]
  },

  {
    id: "picnicker-gen6",
    nome: "Picnicker-gen6",
    imagem: "/images/trainers/picnicker-gen6.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 1308,
    stardust: 5093,
    xp: 342,
    ia: "agressiva",
    time: [
      { speciesId: 769, nome: "Sandygast", level: 34 },
      { speciesId: 639, nome: "Terrakion", level: 42 },
      { speciesId: 8, nome: "Wartortle", level: 66 },
      { speciesId: 202, nome: "Wobbuffet", level: 14 },
      { speciesId: 851, nome: "Centiskorch", level: 23 },
      { speciesId: 640, nome: "Virizion", level: 54 }
    ]
  },

  {
    id: "picnicker",
    nome: "Picnicker",
    imagem: "/images/trainers/picnicker.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 1137,
    stardust: 398,
    xp: 171,
    ia: "aleatoria",
    time: [
      { speciesId: 101, nome: "Electrode", level: 45 },
      { speciesId: 528, nome: "Swoobat", level: 79 },
      { speciesId: 588, nome: "Karrablast", level: 49 },
      { speciesId: 1019, nome: "Hydrapple", level: 14 },
      { speciesId: 168, nome: "Ariados", level: 52 },
      { speciesId: 718, nome: "Zygarde-50", level: 33 }
    ]
  },

  {
    id: "piers-league",
    nome: "Piers-league",
    imagem: "/images/trainers/piers-league.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 616,
    stardust: 3573,
    xp: 258,
    ia: "defensiva",
    time: [
      { speciesId: 581, nome: "Swanna", level: 74 },
      { speciesId: 194, nome: "Wooper", level: 44 },
      { speciesId: 538, nome: "Throh", level: 24 },
      { speciesId: 154, nome: "Meganium", level: 39 },
      { speciesId: 506, nome: "Lillipup", level: 38 },
      { speciesId: 343, nome: "Baltoy", level: 80 }
    ]
  },

  {
    id: "piers-masters",
    nome: "Piers-masters",
    imagem: "/images/trainers/piers-masters.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 2797,
    stardust: 3907,
    xp: 281,
    ia: "estrategica",
    time: [
      { speciesId: 104, nome: "Cubone", level: 33 },
      { speciesId: 518, nome: "Musharna", level: 14 },
      { speciesId: 627, nome: "Rufflet", level: 28 },
      { speciesId: 142, nome: "Aerodactyl", level: 35 },
      { speciesId: 287, nome: "Slakoth", level: 38 },
      { speciesId: 49, nome: "Venomoth", level: 29 }
    ]
  },

  {
    id: "piers",
    nome: "Piers",
    imagem: "/images/trainers/piers.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 2178,
    stardust: 2013,
    xp: 220,
    ia: "agressiva",
    time: [
      { speciesId: 53, nome: "Persian", level: 26 },
      { speciesId: 825, nome: "Dottler", level: 60 },
      { speciesId: 111, nome: "Rhyhorn", level: 38 },
      { speciesId: 177, nome: "Natu", level: 18 },
      { speciesId: 868, nome: "Milcery", level: 58 },
      { speciesId: 492, nome: "Shaymin-land", level: 63 }
    ]
  },

  {
    id: "pilot",
    nome: "Pilot",
    imagem: "/images/trainers/pilot.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 2804,
    stardust: 2058,
    xp: 83,
    ia: "estrategica",
    time: [
      { speciesId: 103, nome: "Exeggutor", level: 11 },
      { speciesId: 792, nome: "Lunala", level: 38 },
      { speciesId: 581, nome: "Swanna", level: 42 },
      { speciesId: 344, nome: "Claydol", level: 59 },
      { speciesId: 826, nome: "Orbeetle", level: 77 },
      { speciesId: 164, nome: "Noctowl", level: 55 }
    ]
  },

  {
    id: "plasmagrunt-gen5bw",
    nome: "Plasmagrunt-gen5bw",
    imagem: "/images/trainers/plasmagrunt-gen5bw.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 2013,
    stardust: 1711,
    xp: 479,
    ia: "estrategica",
    time: [
      { speciesId: 750, nome: "Mudsdale", level: 26 },
      { speciesId: 470, nome: "Leafeon", level: 31 },
      { speciesId: 894, nome: "Regieleki", level: 16 },
      { speciesId: 139, nome: "Omastar", level: 24 },
      { speciesId: 883, nome: "Arctovish", level: 15 },
      { speciesId: 161, nome: "Sentret", level: 52 }
    ]
  },

  {
    id: "plasmagrunt",
    nome: "Plasmagrunt",
    imagem: "/images/trainers/plasmagrunt.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 123,
    stardust: 246,
    xp: 275,
    ia: "estrategica",
    time: [
      { speciesId: 265, nome: "Wurmple", level: 77 },
      { speciesId: 702, nome: "Dedenne", level: 49 },
      { speciesId: 734, nome: "Yungoos", level: 46 },
      { speciesId: 355, nome: "Duskull", level: 35 },
      { speciesId: 321, nome: "Wailord", level: 42 },
      { speciesId: 219, nome: "Magcargo", level: 54 }
    ]
  },

  {
    id: "plasmagruntf-gen5bw",
    nome: "Plasmagruntf-gen5bw",
    imagem: "/images/trainers/plasmagruntf-gen5bw.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "dificil",
    recompensa: 1304,
    stardust: 1158,
    xp: 294,
    ia: "aleatoria",
    time: [
      { speciesId: 644, nome: "Zekrom", level: 72 },
      { speciesId: 876, nome: "Indeedee-male", level: 40 },
      { speciesId: 671, nome: "Florges", level: 35 },
      { speciesId: 341, nome: "Corphish", level: 35 },
      { speciesId: 873, nome: "Frosmoth", level: 63 },
      { speciesId: 789, nome: "Cosmog", level: 80 }
    ]
  },

  {
    id: "plasmagruntf",
    nome: "Plasmagruntf",
    imagem: "/images/trainers/plasmagruntf.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 1108,
    stardust: 2936,
    xp: 473,
    ia: "estrategica",
    time: [
      { speciesId: 691, nome: "Dragalge", level: 34 },
      { speciesId: 85, nome: "Dodrio", level: 60 },
      { speciesId: 740, nome: "Crabominable", level: 61 },
      { speciesId: 389, nome: "Torterra", level: 30 },
      { speciesId: 804, nome: "Naganadel", level: 68 },
      { speciesId: 664, nome: "Scatterbug", level: 65 }
    ]
  },

  {
    id: "player-go",
    nome: "Player-go",
    imagem: "/images/trainers/player-go.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 2718,
    stardust: 4927,
    xp: 116,
    ia: "aleatoria",
    time: [
      { speciesId: 224, nome: "Octillery", level: 31 },
      { speciesId: 440, nome: "Happiny", level: 61 },
      { speciesId: 239, nome: "Elekid", level: 45 },
      { speciesId: 365, nome: "Walrein", level: 24 },
      { speciesId: 988, nome: "Slither-wing", level: 51 },
      { speciesId: 314, nome: "Illumise", level: 72 }
    ]
  },

  {
    id: "playerf-go",
    nome: "Playerf-go",
    imagem: "/images/trainers/playerf-go.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 1604,
    stardust: 2319,
    xp: 273,
    ia: "agressiva",
    time: [
      { speciesId: 962, nome: "Bombirdier", level: 40 },
      { speciesId: 836, nome: "Boltund", level: 49 },
      { speciesId: 170, nome: "Chinchou", level: 58 },
      { speciesId: 818, nome: "Inteleon", level: 54 },
      { speciesId: 712, nome: "Bergmite", level: 40 },
      { speciesId: 585, nome: "Deerling", level: 65 }
    ]
  },

  {
    id: "plumeria-league",
    nome: "Plumeria-league",
    imagem: "/images/trainers/plumeria-league.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 2093,
    stardust: 4677,
    xp: 450,
    ia: "agressiva",
    time: [
      { speciesId: 662, nome: "Fletchinder", level: 78 },
      { speciesId: 808, nome: "Meltan", level: 61 },
      { speciesId: 279, nome: "Pelipper", level: 37 },
      { speciesId: 623, nome: "Golurk", level: 27 },
      { speciesId: 295, nome: "Exploud", level: 71 },
      { speciesId: 222, nome: "Corsola", level: 46 }
    ]
  },

  {
    id: "plumeria",
    nome: "Plumeria",
    imagem: "/images/trainers/plumeria.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 1550,
    stardust: 4201,
    xp: 170,
    ia: "estrategica",
    time: [
      { speciesId: 91, nome: "Cloyster", level: 74 },
      { speciesId: 94, nome: "Gengar", level: 28 },
      { speciesId: 384, nome: "Rayquaza", level: 41 },
      { speciesId: 921, nome: "Pawmi", level: 32 },
      { speciesId: 768, nome: "Golisopod", level: 68 },
      { speciesId: 130, nome: "Gyarados", level: 23 }
    ]
  },

  {
    id: "pokefan-gen2",
    nome: "Pokefan-gen2",
    imagem: "/images/trainers/pokefan-gen2.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 2668,
    stardust: 3389,
    xp: 108,
    ia: "aleatoria",
    time: [
      { speciesId: 31, nome: "Nidoqueen", level: 66 },
      { speciesId: 444, nome: "Gabite", level: 12 },
      { speciesId: 261, nome: "Poochyena", level: 65 },
      { speciesId: 250, nome: "Ho-oh", level: 42 },
      { speciesId: 554, nome: "Darumaka", level: 31 },
      { speciesId: 945, nome: "Grafaiai", level: 17 }
    ]
  },

  {
    id: "pokefan-gen3",
    nome: "Pokefan-gen3",
    imagem: "/images/trainers/pokefan-gen3.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 687,
    stardust: 292,
    xp: 172,
    ia: "estrategica",
    time: [
      { speciesId: 187, nome: "Hoppip", level: 79 },
      { speciesId: 433, nome: "Chingling", level: 29 },
      { speciesId: 923, nome: "Pawmot", level: 61 },
      { speciesId: 50, nome: "Diglett", level: 51 },
      { speciesId: 944, nome: "Shroodle", level: 17 },
      { speciesId: 376, nome: "Metagross", level: 20 }
    ]
  },

  {
    id: "pokefan-gen4",
    nome: "Pokefan-gen4",
    imagem: "/images/trainers/pokefan-gen4.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 925,
    stardust: 1255,
    xp: 479,
    ia: "estrategica",
    time: [
      { speciesId: 472, nome: "Gliscor", level: 66 },
      { speciesId: 525, nome: "Boldore", level: 44 },
      { speciesId: 87, nome: "Dewgong", level: 66 },
      { speciesId: 35, nome: "Clefairy", level: 14 },
      { speciesId: 362, nome: "Glalie", level: 25 },
      { speciesId: 202, nome: "Wobbuffet", level: 11 }
    ]
  },

  {
    id: "pokefan-gen6",
    nome: "Pokefan-gen6",
    imagem: "/images/trainers/pokefan-gen6.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 205,
    stardust: 1050,
    xp: 139,
    ia: "agressiva",
    time: [
      { speciesId: 1007, nome: "Koraidon", level: 30 },
      { speciesId: 604, nome: "Eelektross", level: 37 },
      { speciesId: 419, nome: "Floatzel", level: 70 },
      { speciesId: 847, nome: "Barraskewda", level: 75 },
      { speciesId: 118, nome: "Goldeen", level: 78 },
      { speciesId: 869, nome: "Alcremie", level: 25 }
    ]
  },

  {
    id: "pokefan-gen6xy",
    nome: "Pokefan-gen6xy",
    imagem: "/images/trainers/pokefan-gen6xy.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 1426,
    stardust: 2936,
    xp: 194,
    ia: "estrategica",
    time: [
      { speciesId: 431, nome: "Glameow", level: 62 },
      { speciesId: 972, nome: "Houndstone", level: 45 },
      { speciesId: 832, nome: "Dubwool", level: 14 },
      { speciesId: 599, nome: "Klink", level: 65 },
      { speciesId: 392, nome: "Infernape", level: 19 },
      { speciesId: 634, nome: "Zweilous", level: 33 }
    ]
  },

  {
    id: "pokefan",
    nome: "Pokefan",
    imagem: "/images/trainers/pokefan.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 1115,
    stardust: 5428,
    xp: 192,
    ia: "aleatoria",
    time: [
      { speciesId: 337, nome: "Lunatone", level: 51 },
      { speciesId: 207, nome: "Gligar", level: 54 },
      { speciesId: 210, nome: "Granbull", level: 22 },
      { speciesId: 872, nome: "Snom", level: 46 },
      { speciesId: 777, nome: "Togedemaru", level: 11 },
      { speciesId: 231, nome: "Phanpy", level: 76 }
    ]
  },

  {
    id: "pokefanf-gen2",
    nome: "Pokefanf-gen2",
    imagem: "/images/trainers/pokefanf-gen2.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 868,
    stardust: 4441,
    xp: 177,
    ia: "defensiva",
    time: [
      { speciesId: 649, nome: "Genesect", level: 12 },
      { speciesId: 288, nome: "Vigoroth", level: 56 },
      { speciesId: 719, nome: "Diancie", level: 59 },
      { speciesId: 693, nome: "Clawitzer", level: 29 },
      { speciesId: 722, nome: "Rowlet", level: 13 },
      { speciesId: 568, nome: "Trubbish", level: 41 }
    ]
  },

  {
    id: "pokefanf-gen3",
    nome: "Pokefanf-gen3",
    imagem: "/images/trainers/pokefanf-gen3.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 414,
    stardust: 2767,
    xp: 397,
    ia: "aleatoria",
    time: [
      { speciesId: 724, nome: "Decidueye", level: 78 },
      { speciesId: 960, nome: "Wiglett", level: 62 },
      { speciesId: 745, nome: "Lycanroc-midday", level: 16 },
      { speciesId: 82, nome: "Magneton", level: 48 },
      { speciesId: 196, nome: "Espeon", level: 68 },
      { speciesId: 815, nome: "Cinderace", level: 39 }
    ]
  },

  {
    id: "pokefanf-gen4",
    nome: "Pokefanf-gen4",
    imagem: "/images/trainers/pokefanf-gen4.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 2839,
    stardust: 1925,
    xp: 168,
    ia: "agressiva",
    time: [
      { speciesId: 700, nome: "Sylveon", level: 57 },
      { speciesId: 244, nome: "Entei", level: 56 },
      { speciesId: 199, nome: "Slowking", level: 49 },
      { speciesId: 165, nome: "Ledyba", level: 68 },
      { speciesId: 183, nome: "Marill", level: 66 },
      { speciesId: 488, nome: "Cresselia", level: 58 }
    ]
  },

  {
    id: "pokefanf-gen6",
    nome: "Pokefanf-gen6",
    imagem: "/images/trainers/pokefanf-gen6.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 2939,
    stardust: 1011,
    xp: 424,
    ia: "aleatoria",
    time: [
      { speciesId: 336, nome: "Seviper", level: 40 },
      { speciesId: 1005, nome: "Roaring-moon", level: 65 },
      { speciesId: 102, nome: "Exeggcute", level: 56 },
      { speciesId: 243, nome: "Raikou", level: 14 },
      { speciesId: 591, nome: "Amoonguss", level: 28 },
      { speciesId: 281, nome: "Kirlia", level: 51 }
    ]
  },

  {
    id: "pokefanf-gen6xy",
    nome: "Pokefanf-gen6xy",
    imagem: "/images/trainers/pokefanf-gen6xy.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 1731,
    stardust: 2313,
    xp: 279,
    ia: "aleatoria",
    time: [
      { speciesId: 144, nome: "Articuno", level: 31 },
      { speciesId: 1023, nome: "Iron-crown", level: 41 },
      { speciesId: 102, nome: "Exeggcute", level: 55 },
      { speciesId: 972, nome: "Houndstone", level: 55 },
      { speciesId: 413, nome: "Wormadam-plant", level: 19 },
      { speciesId: 814, nome: "Raboot", level: 43 }
    ]
  },

  {
    id: "pokefanf",
    nome: "Pokefanf",
    imagem: "/images/trainers/pokefanf.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 2331,
    stardust: 457,
    xp: 445,
    ia: "aleatoria",
    time: [
      { speciesId: 538, nome: "Throh", level: 12 },
      { speciesId: 94, nome: "Gengar", level: 76 },
      { speciesId: 448, nome: "Lucario", level: 73 },
      { speciesId: 961, nome: "Wugtrio", level: 55 },
      { speciesId: 1017, nome: "Ogerpon", level: 69 },
      { speciesId: 796, nome: "Xurkitree", level: 45 }
    ]
  },

  {
    id: "pokekid-gen8",
    nome: "Pokekid-gen8",
    imagem: "/images/trainers/pokekid-gen8.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "dificil",
    recompensa: 1619,
    stardust: 1122,
    xp: 142,
    ia: "agressiva",
    time: [
      { speciesId: 852, nome: "Clobbopus", level: 52 },
      { speciesId: 198, nome: "Murkrow", level: 42 },
      { speciesId: 323, nome: "Camerupt", level: 76 },
      { speciesId: 781, nome: "Dhelmise", level: 58 },
      { speciesId: 750, nome: "Mudsdale", level: 23 },
      { speciesId: 199, nome: "Slowking", level: 26 }
    ]
  },

  {
    id: "pokekid",
    nome: "Pokekid",
    imagem: "/images/trainers/pokekid.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 2527,
    stardust: 4818,
    xp: 467,
    ia: "defensiva",
    time: [
      { speciesId: 66, nome: "Machop", level: 47 },
      { speciesId: 755, nome: "Morelull", level: 66 },
      { speciesId: 984, nome: "Great-tusk", level: 20 },
      { speciesId: 987, nome: "Flutter-mane", level: 70 },
      { speciesId: 15, nome: "Beedrill", level: 28 },
      { speciesId: 693, nome: "Clawitzer", level: 52 }
    ]
  },

  {
    id: "pokekidf-gen8",
    nome: "Pokekidf-gen8",
    imagem: "/images/trainers/pokekidf-gen8.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 1685,
    stardust: 4943,
    xp: 165,
    ia: "agressiva",
    time: [
      { speciesId: 577, nome: "Solosis", level: 53 },
      { speciesId: 190, nome: "Aipom", level: 80 },
      { speciesId: 779, nome: "Bruxish", level: 15 },
      { speciesId: 235, nome: "Smeargle", level: 62 },
      { speciesId: 997, nome: "Arctibax", level: 78 },
      { speciesId: 506, nome: "Lillipup", level: 45 }
    ]
  },

  {
    id: "pokemaniac-gen1",
    nome: "Pokemaniac-gen1",
    imagem: "/images/trainers/pokemaniac-gen1.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 2235,
    stardust: 2006,
    xp: 497,
    ia: "defensiva",
    time: [
      { speciesId: 516, nome: "Simipour", level: 51 },
      { speciesId: 165, nome: "Ledyba", level: 56 },
      { speciesId: 630, nome: "Mandibuzz", level: 61 },
      { speciesId: 469, nome: "Yanmega", level: 25 },
      { speciesId: 497, nome: "Serperior", level: 33 },
      { speciesId: 550, nome: "Basculin-red-striped", level: 52 }
    ]
  },

  {
    id: "pokemaniac-gen1rb",
    nome: "Pokemaniac-gen1rb",
    imagem: "/images/trainers/pokemaniac-gen1rb.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 896,
    stardust: 1077,
    xp: 279,
    ia: "defensiva",
    time: [
      { speciesId: 1002, nome: "Chien-pao", level: 29 },
      { speciesId: 727, nome: "Incineroar", level: 61 },
      { speciesId: 96, nome: "Drowzee", level: 77 },
      { speciesId: 242, nome: "Blissey", level: 24 },
      { speciesId: 296, nome: "Makuhita", level: 53 },
      { speciesId: 413, nome: "Wormadam-plant", level: 25 }
    ]
  },

  {
    id: "pokemaniac-gen2",
    nome: "Pokemaniac-gen2",
    imagem: "/images/trainers/pokemaniac-gen2.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 2637,
    stardust: 308,
    xp: 202,
    ia: "aleatoria",
    time: [
      { speciesId: 139, nome: "Omastar", level: 38 },
      { speciesId: 32, nome: "Nidoran-m", level: 62 },
      { speciesId: 538, nome: "Throh", level: 80 },
      { speciesId: 837, nome: "Rolycoly", level: 17 },
      { speciesId: 590, nome: "Foongus", level: 41 },
      { speciesId: 290, nome: "Nincada", level: 63 }
    ]
  },

  {
    id: "pokemaniac-gen3",
    nome: "Pokemaniac-gen3",
    imagem: "/images/trainers/pokemaniac-gen3.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 2280,
    stardust: 5357,
    xp: 130,
    ia: "defensiva",
    time: [
      { speciesId: 83, nome: "Farfetchd", level: 56 },
      { speciesId: 107, nome: "Hitmonchan", level: 68 },
      { speciesId: 608, nome: "Lampent", level: 59 },
      { speciesId: 788, nome: "Tapu-fini", level: 29 },
      { speciesId: 355, nome: "Duskull", level: 61 },
      { speciesId: 947, nome: "Brambleghast", level: 23 }
    ]
  },

  {
    id: "pokemaniac-gen3rs",
    nome: "Pokemaniac-gen3rs",
    imagem: "/images/trainers/pokemaniac-gen3rs.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 2307,
    stardust: 2519,
    xp: 461,
    ia: "aleatoria",
    time: [
      { speciesId: 859, nome: "Impidimp", level: 15 },
      { speciesId: 686, nome: "Inkay", level: 33 },
      { speciesId: 867, nome: "Runerigus", level: 37 },
      { speciesId: 149, nome: "Dragonite", level: 24 },
      { speciesId: 365, nome: "Walrein", level: 23 },
      { speciesId: 799, nome: "Guzzlord", level: 26 }
    ]
  },

  {
    id: "pokemaniac-gen6",
    nome: "Pokemaniac-gen6",
    imagem: "/images/trainers/pokemaniac-gen6.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 798,
    stardust: 3575,
    xp: 356,
    ia: "estrategica",
    time: [
      { speciesId: 97, nome: "Hypno", level: 77 },
      { speciesId: 1001, nome: "Wo-chien", level: 55 },
      { speciesId: 190, nome: "Aipom", level: 61 },
      { speciesId: 753, nome: "Fomantis", level: 45 },
      { speciesId: 691, nome: "Dragalge", level: 65 },
      { speciesId: 206, nome: "Dunsparce", level: 35 }
    ]
  },

  {
    id: "pokemaniac-gen9",
    nome: "Pokemaniac-gen9",
    imagem: "/images/trainers/pokemaniac-gen9.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 1107,
    stardust: 2125,
    xp: 183,
    ia: "aleatoria",
    time: [
      { speciesId: 720, nome: "Hoopa", level: 25 },
      { speciesId: 80, nome: "Slowbro", level: 42 },
      { speciesId: 459, nome: "Snover", level: 77 },
      { speciesId: 861, nome: "Grimmsnarl", level: 51 },
      { speciesId: 84, nome: "Doduo", level: 64 },
      { speciesId: 821, nome: "Rookidee", level: 28 }
    ]
  },

  {
    id: "pokemaniac",
    nome: "Pokemaniac",
    imagem: "/images/trainers/pokemaniac.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 1610,
    stardust: 352,
    xp: 455,
    ia: "estrategica",
    time: [
      { speciesId: 818, nome: "Inteleon", level: 46 },
      { speciesId: 627, nome: "Rufflet", level: 60 },
      { speciesId: 879, nome: "Copperajah", level: 41 },
      { speciesId: 385, nome: "Jirachi", level: 78 },
      { speciesId: 645, nome: "Landorus-incarnate", level: 63 },
      { speciesId: 913, nome: "Quaxwell", level: 48 }
    ]
  },

  {
    id: "pokemonbreeder-gen3",
    nome: "Pokemonbreeder-gen3",
    imagem: "/images/trainers/pokemonbreeder-gen3.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 1489,
    stardust: 305,
    xp: 407,
    ia: "aleatoria",
    time: [
      { speciesId: 109, nome: "Koffing", level: 26 },
      { speciesId: 706, nome: "Goodra", level: 39 },
      { speciesId: 686, nome: "Inkay", level: 29 },
      { speciesId: 494, nome: "Victini", level: 62 },
      { speciesId: 343, nome: "Baltoy", level: 12 },
      { speciesId: 398, nome: "Staraptor", level: 58 }
    ]
  },

  {
    id: "pokemonbreeder-gen4",
    nome: "Pokemonbreeder-gen4",
    imagem: "/images/trainers/pokemonbreeder-gen4.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 2369,
    stardust: 2873,
    xp: 113,
    ia: "estrategica",
    time: [
      { speciesId: 1, nome: "Bulbasaur", level: 28 },
      { speciesId: 889, nome: "Zamazenta", level: 49 },
      { speciesId: 168, nome: "Ariados", level: 59 },
      { speciesId: 108, nome: "Lickitung", level: 14 },
      { speciesId: 573, nome: "Cinccino", level: 50 },
      { speciesId: 848, nome: "Toxel", level: 51 }
    ]
  },

  {
    id: "pokemonbreeder-gen6",
    nome: "Pokemonbreeder-gen6",
    imagem: "/images/trainers/pokemonbreeder-gen6.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 1192,
    stardust: 5413,
    xp: 80,
    ia: "estrategica",
    time: [
      { speciesId: 47, nome: "Parasect", level: 78 },
      { speciesId: 759, nome: "Stufful", level: 60 },
      { speciesId: 91, nome: "Cloyster", level: 11 },
      { speciesId: 734, nome: "Yungoos", level: 35 },
      { speciesId: 661, nome: "Fletchling", level: 76 },
      { speciesId: 910, nome: "Crocalor", level: 15 }
    ]
  },

  {
    id: "pokemonbreeder-gen6xy",
    nome: "Pokemonbreeder-gen6xy",
    imagem: "/images/trainers/pokemonbreeder-gen6xy.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 2869,
    stardust: 3636,
    xp: 179,
    ia: "defensiva",
    time: [
      { speciesId: 713, nome: "Avalugg", level: 65 },
      { speciesId: 149, nome: "Dragonite", level: 48 },
      { speciesId: 289, nome: "Slaking", level: 37 },
      { speciesId: 266, nome: "Silcoon", level: 37 },
      { speciesId: 762, nome: "Steenee", level: 72 },
      { speciesId: 804, nome: "Naganadel", level: 59 }
    ]
  },

  {
    id: "pokemonbreeder-gen7",
    nome: "Pokemonbreeder-gen7",
    imagem: "/images/trainers/pokemonbreeder-gen7.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 1185,
    stardust: 3082,
    xp: 299,
    ia: "defensiva",
    time: [
      { speciesId: 662, nome: "Fletchinder", level: 69 },
      { speciesId: 926, nome: "Fidough", level: 25 },
      { speciesId: 940, nome: "Wattrel", level: 67 },
      { speciesId: 894, nome: "Regieleki", level: 20 },
      { speciesId: 41, nome: "Zubat", level: 49 },
      { speciesId: 421, nome: "Cherrim", level: 17 }
    ]
  },

  {
    id: "pokemonbreeder-gen8",
    nome: "Pokemonbreeder-gen8",
    imagem: "/images/trainers/pokemonbreeder-gen8.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 1894,
    stardust: 4510,
    xp: 323,
    ia: "defensiva",
    time: [
      { speciesId: 499, nome: "Pignite", level: 69 },
      { speciesId: 601, nome: "Klinklang", level: 31 },
      { speciesId: 70, nome: "Weepinbell", level: 31 },
      { speciesId: 384, nome: "Rayquaza", level: 63 },
      { speciesId: 584, nome: "Vanilluxe", level: 74 },
      { speciesId: 237, nome: "Hitmontop", level: 29 }
    ]
  },

  {
    id: "pokemonbreeder",
    nome: "Pokemonbreeder",
    imagem: "/images/trainers/pokemonbreeder.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 290,
    stardust: 2713,
    xp: 490,
    ia: "estrategica",
    time: [
      { speciesId: 305, nome: "Lairon", level: 62 },
      { speciesId: 606, nome: "Beheeyem", level: 58 },
      { speciesId: 945, nome: "Grafaiai", level: 25 },
      { speciesId: 221, nome: "Piloswine", level: 33 },
      { speciesId: 1012, nome: "Poltchageist", level: 48 },
      { speciesId: 1019, nome: "Hydrapple", level: 67 }
    ]
  },

  {
    id: "pokemonbreederf-gen3",
    nome: "Pokemonbreederf-gen3",
    imagem: "/images/trainers/pokemonbreederf-gen3.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 2721,
    stardust: 3145,
    xp: 351,
    ia: "estrategica",
    time: [
      { speciesId: 215, nome: "Sneasel", level: 12 },
      { speciesId: 841, nome: "Flapple", level: 27 },
      { speciesId: 941, nome: "Kilowattrel", level: 49 },
      { speciesId: 793, nome: "Nihilego", level: 62 },
      { speciesId: 895, nome: "Regidrago", level: 55 },
      { speciesId: 663, nome: "Talonflame", level: 47 }
    ]
  },

  {
    id: "pokemonbreederf-gen3frlg",
    nome: "Pokemonbreederf-gen3frlg",
    imagem: "/images/trainers/pokemonbreederf-gen3frlg.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 1702,
    stardust: 3049,
    xp: 154,
    ia: "estrategica",
    time: [
      { speciesId: 928, nome: "Smoliv", level: 46 },
      { speciesId: 453, nome: "Croagunk", level: 67 },
      { speciesId: 2, nome: "Ivysaur", level: 76 },
      { speciesId: 166, nome: "Ledian", level: 56 },
      { speciesId: 981, nome: "Farigiraf", level: 18 },
      { speciesId: 470, nome: "Leafeon", level: 25 }
    ]
  },

  {
    id: "pokemonbreederf-gen4",
    nome: "Pokemonbreederf-gen4",
    imagem: "/images/trainers/pokemonbreederf-gen4.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 2856,
    stardust: 1642,
    xp: 377,
    ia: "defensiva",
    time: [
      { speciesId: 286, nome: "Breloom", level: 12 },
      { speciesId: 1005, nome: "Roaring-moon", level: 16 },
      { speciesId: 745, nome: "Lycanroc-midday", level: 51 },
      { speciesId: 754, nome: "Lurantis", level: 17 },
      { speciesId: 1021, nome: "Raging-bolt", level: 49 },
      { speciesId: 64, nome: "Kadabra", level: 28 }
    ]
  },

  {
    id: "pokemonbreederf-gen6",
    nome: "Pokemonbreederf-gen6",
    imagem: "/images/trainers/pokemonbreederf-gen6.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 2442,
    stardust: 2688,
    xp: 118,
    ia: "estrategica",
    time: [
      { speciesId: 701, nome: "Hawlucha", level: 37 },
      { speciesId: 67, nome: "Machoke", level: 39 },
      { speciesId: 159, nome: "Croconaw", level: 34 },
      { speciesId: 359, nome: "Absol", level: 12 },
      { speciesId: 311, nome: "Plusle", level: 47 },
      { speciesId: 928, nome: "Smoliv", level: 25 }
    ]
  },

  {
    id: "pokemonbreederf-gen6xy",
    nome: "Pokemonbreederf-gen6xy",
    imagem: "/images/trainers/pokemonbreederf-gen6xy.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 100,
    stardust: 813,
    xp: 248,
    ia: "aleatoria",
    time: [
      { speciesId: 352, nome: "Kecleon", level: 62 },
      { speciesId: 5, nome: "Charmeleon", level: 19 },
      { speciesId: 899, nome: "Wyrdeer", level: 68 },
      { speciesId: 689, nome: "Barbaracle", level: 21 },
      { speciesId: 628, nome: "Braviary", level: 41 },
      { speciesId: 236, nome: "Tyrogue", level: 75 }
    ]
  },

  {
    id: "pokemonbreederf-gen7",
    nome: "Pokemonbreederf-gen7",
    imagem: "/images/trainers/pokemonbreederf-gen7.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "dificil",
    recompensa: 1420,
    stardust: 2176,
    xp: 77,
    ia: "estrategica",
    time: [
      { speciesId: 910, nome: "Crocalor", level: 31 },
      { speciesId: 543, nome: "Venipede", level: 61 },
      { speciesId: 423, nome: "Gastrodon", level: 70 },
      { speciesId: 792, nome: "Lunala", level: 23 },
      { speciesId: 122, nome: "Mr-mime", level: 65 },
      { speciesId: 976, nome: "Veluza", level: 20 }
    ]
  },

  {
    id: "pokemonbreederf-gen8",
    nome: "Pokemonbreederf-gen8",
    imagem: "/images/trainers/pokemonbreederf-gen8.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 136,
    stardust: 3712,
    xp: 216,
    ia: "defensiva",
    time: [
      { speciesId: 562, nome: "Yamask", level: 17 },
      { speciesId: 263, nome: "Zigzagoon", level: 25 },
      { speciesId: 576, nome: "Gothitelle", level: 17 },
      { speciesId: 846, nome: "Arrokuda", level: 80 },
      { speciesId: 920, nome: "Lokix", level: 11 },
      { speciesId: 213, nome: "Shuckle", level: 76 }
    ]
  },

  {
    id: "pokemonbreederf",
    nome: "Pokemonbreederf",
    imagem: "/images/trainers/pokemonbreederf.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 2999,
    stardust: 2349,
    xp: 272,
    ia: "aleatoria",
    time: [
      { speciesId: 250, nome: "Ho-oh", level: 33 },
      { speciesId: 394, nome: "Prinplup", level: 17 },
      { speciesId: 918, nome: "Spidops", level: 16 },
      { speciesId: 1004, nome: "Chi-yu", level: 66 },
      { speciesId: 49, nome: "Venomoth", level: 35 },
      { speciesId: 968, nome: "Orthworm", level: 47 }
    ]
  },

  {
    id: "pokemoncenterlady",
    nome: "Pokemoncenterlady",
    imagem: "/images/trainers/pokemoncenterlady.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 1655,
    stardust: 3269,
    xp: 111,
    ia: "aleatoria",
    time: [
      { speciesId: 932, nome: "Nacli", level: 45 },
      { speciesId: 401, nome: "Kricketot", level: 11 },
      { speciesId: 834, nome: "Drednaw", level: 38 },
      { speciesId: 441, nome: "Chatot", level: 47 },
      { speciesId: 809, nome: "Melmetal", level: 34 },
      { speciesId: 435, nome: "Skuntank", level: 47 }
    ]
  },

  {
    id: "pokemonranger-gen3",
    nome: "Pokemonranger-gen3",
    imagem: "/images/trainers/pokemonranger-gen3.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 1504,
    stardust: 4209,
    xp: 424,
    ia: "aleatoria",
    time: [
      { speciesId: 243, nome: "Raikou", level: 11 },
      { speciesId: 961, nome: "Wugtrio", level: 31 },
      { speciesId: 363, nome: "Spheal", level: 34 },
      { speciesId: 290, nome: "Nincada", level: 42 },
      { speciesId: 627, nome: "Rufflet", level: 72 },
      { speciesId: 957, nome: "Tinkatink", level: 43 }
    ]
  },

  {
    id: "pokemonranger-gen3rs",
    nome: "Pokemonranger-gen3rs",
    imagem: "/images/trainers/pokemonranger-gen3rs.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 383,
    stardust: 4209,
    xp: 179,
    ia: "defensiva",
    time: [
      { speciesId: 987, nome: "Flutter-mane", level: 58 },
      { speciesId: 952, nome: "Scovillain", level: 35 },
      { speciesId: 329, nome: "Vibrava", level: 15 },
      { speciesId: 853, nome: "Grapploct", level: 37 },
      { speciesId: 991, nome: "Iron-bundle", level: 53 },
      { speciesId: 344, nome: "Claydol", level: 20 }
    ]
  },

  {
    id: "pokemonranger-gen4",
    nome: "Pokemonranger-gen4",
    imagem: "/images/trainers/pokemonranger-gen4.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 1555,
    stardust: 1640,
    xp: 68,
    ia: "estrategica",
    time: [
      { speciesId: 753, nome: "Fomantis", level: 62 },
      { speciesId: 646, nome: "Kyurem", level: 58 },
      { speciesId: 759, nome: "Stufful", level: 75 },
      { speciesId: 219, nome: "Magcargo", level: 52 },
      { speciesId: 630, nome: "Mandibuzz", level: 78 },
      { speciesId: 970, nome: "Glimmora", level: 19 }
    ]
  },

  {
    id: "pokemonranger-gen6",
    nome: "Pokemonranger-gen6",
    imagem: "/images/trainers/pokemonranger-gen6.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 1444,
    stardust: 4346,
    xp: 68,
    ia: "estrategica",
    time: [
      { speciesId: 696, nome: "Tyrunt", level: 48 },
      { speciesId: 325, nome: "Spoink", level: 45 },
      { speciesId: 55, nome: "Golduck", level: 29 },
      { speciesId: 411, nome: "Bastiodon", level: 48 },
      { speciesId: 237, nome: "Hitmontop", level: 53 },
      { speciesId: 840, nome: "Applin", level: 65 }
    ]
  },

  {
    id: "pokemonranger-gen6xy",
    nome: "Pokemonranger-gen6xy",
    imagem: "/images/trainers/pokemonranger-gen6xy.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 1658,
    stardust: 2784,
    xp: 107,
    ia: "estrategica",
    time: [
      { speciesId: 920, nome: "Lokix", level: 20 },
      { speciesId: 76, nome: "Golem", level: 65 },
      { speciesId: 890, nome: "Eternatus", level: 49 },
      { speciesId: 259, nome: "Marshtomp", level: 51 },
      { speciesId: 486, nome: "Regigigas", level: 48 },
      { speciesId: 612, nome: "Haxorus", level: 21 }
    ]
  },

  {
    id: "pokemonranger",
    nome: "Pokemonranger",
    imagem: "/images/trainers/pokemonranger.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 1580,
    stardust: 1946,
    xp: 71,
    ia: "aleatoria",
    time: [
      { speciesId: 822, nome: "Corvisquire", level: 16 },
      { speciesId: 646, nome: "Kyurem", level: 54 },
      { speciesId: 99, nome: "Kingler", level: 38 },
      { speciesId: 439, nome: "Mime-jr", level: 23 },
      { speciesId: 1, nome: "Bulbasaur", level: 59 },
      { speciesId: 851, nome: "Centiskorch", level: 18 }
    ]
  },

  {
    id: "pokemonrangerf-gen3",
    nome: "Pokemonrangerf-gen3",
    imagem: "/images/trainers/pokemonrangerf-gen3.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 1463,
    stardust: 3782,
    xp: 308,
    ia: "estrategica",
    time: [
      { speciesId: 751, nome: "Dewpider", level: 12 },
      { speciesId: 597, nome: "Ferroseed", level: 37 },
      { speciesId: 968, nome: "Orthworm", level: 11 },
      { speciesId: 897, nome: "Spectrier", level: 76 },
      { speciesId: 567, nome: "Archeops", level: 80 },
      { speciesId: 667, nome: "Litleo", level: 73 }
    ]
  },

  {
    id: "pokemonrangerf-gen3rs",
    nome: "Pokemonrangerf-gen3rs",
    imagem: "/images/trainers/pokemonrangerf-gen3rs.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 901,
    stardust: 5119,
    xp: 77,
    ia: "agressiva",
    time: [
      { speciesId: 814, nome: "Raboot", level: 53 },
      { speciesId: 338, nome: "Solrock", level: 64 },
      { speciesId: 590, nome: "Foongus", level: 28 },
      { speciesId: 197, nome: "Umbreon", level: 69 },
      { speciesId: 256, nome: "Combusken", level: 54 },
      { speciesId: 956, nome: "Espathra", level: 58 }
    ]
  },

  {
    id: "pokemonrangerf-gen4",
    nome: "Pokemonrangerf-gen4",
    imagem: "/images/trainers/pokemonrangerf-gen4.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 1375,
    stardust: 886,
    xp: 228,
    ia: "defensiva",
    time: [
      { speciesId: 838, nome: "Carkol", level: 80 },
      { speciesId: 31, nome: "Nidoqueen", level: 28 },
      { speciesId: 304, nome: "Aron", level: 58 },
      { speciesId: 482, nome: "Azelf", level: 42 },
      { speciesId: 940, nome: "Wattrel", level: 53 },
      { speciesId: 486, nome: "Regigigas", level: 68 }
    ]
  },

  {
    id: "pokemonrangerf-gen6",
    nome: "Pokemonrangerf-gen6",
    imagem: "/images/trainers/pokemonrangerf-gen6.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 450,
    stardust: 4212,
    xp: 158,
    ia: "aleatoria",
    time: [
      { speciesId: 11, nome: "Metapod", level: 13 },
      { speciesId: 952, nome: "Scovillain", level: 20 },
      { speciesId: 16, nome: "Pidgey", level: 33 },
      { speciesId: 935, nome: "Charcadet", level: 40 },
      { speciesId: 377, nome: "Regirock", level: 40 },
      { speciesId: 121, nome: "Starmie", level: 72 }
    ]
  },

  {
    id: "pokemonrangerf-gen6xy",
    nome: "Pokemonrangerf-gen6xy",
    imagem: "/images/trainers/pokemonrangerf-gen6xy.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 1231,
    stardust: 223,
    xp: 492,
    ia: "defensiva",
    time: [
      { speciesId: 632, nome: "Durant", level: 70 },
      { speciesId: 660, nome: "Diggersby", level: 59 },
      { speciesId: 108, nome: "Lickitung", level: 36 },
      { speciesId: 382, nome: "Kyogre", level: 80 },
      { speciesId: 494, nome: "Victini", level: 32 },
      { speciesId: 678, nome: "Meowstic-male", level: 54 }
    ]
  },

  {
    id: "pokemonrangerf",
    nome: "Pokemonrangerf",
    imagem: "/images/trainers/pokemonrangerf.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 2990,
    stardust: 2172,
    xp: 345,
    ia: "agressiva",
    time: [
      { speciesId: 519, nome: "Pidove", level: 35 },
      { speciesId: 235, nome: "Smeargle", level: 73 },
      { speciesId: 716, nome: "Xerneas", level: 24 },
      { speciesId: 658, nome: "Greninja", level: 60 },
      { speciesId: 1011, nome: "Dipplin", level: 19 },
      { speciesId: 76, nome: "Golem", level: 31 }
    ]
  },

  {
    id: "policeman-gen4",
    nome: "Policeman-gen4",
    imagem: "/images/trainers/policeman-gen4.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "dificil",
    recompensa: 868,
    stardust: 2549,
    xp: 160,
    ia: "estrategica",
    time: [
      { speciesId: 604, nome: "Eelektross", level: 46 },
      { speciesId: 722, nome: "Rowlet", level: 29 },
      { speciesId: 855, nome: "Polteageist", level: 62 },
      { speciesId: 64, nome: "Kadabra", level: 57 },
      { speciesId: 512, nome: "Simisage", level: 45 },
      { speciesId: 879, nome: "Copperajah", level: 11 }
    ]
  },

  {
    id: "policeman-gen7",
    nome: "Policeman-gen7",
    imagem: "/images/trainers/policeman-gen7.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 1449,
    stardust: 1241,
    xp: 251,
    ia: "aleatoria",
    time: [
      { speciesId: 38, nome: "Ninetales", level: 61 },
      { speciesId: 701, nome: "Hawlucha", level: 38 },
      { speciesId: 518, nome: "Musharna", level: 56 },
      { speciesId: 563, nome: "Cofagrigus", level: 49 },
      { speciesId: 320, nome: "Wailmer", level: 61 },
      { speciesId: 299, nome: "Nosepass", level: 50 }
    ]
  },

  {
    id: "policeman-gen8",
    nome: "Policeman-gen8",
    imagem: "/images/trainers/policeman-gen8.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 1169,
    stardust: 3266,
    xp: 391,
    ia: "aleatoria",
    time: [
      { speciesId: 20, nome: "Raticate", level: 69 },
      { speciesId: 459, nome: "Snover", level: 50 },
      { speciesId: 522, nome: "Blitzle", level: 14 },
      { speciesId: 512, nome: "Simisage", level: 17 },
      { speciesId: 217, nome: "Ursaring", level: 63 },
      { speciesId: 607, nome: "Litwick", level: 16 }
    ]
  },

  {
    id: "policeman",
    nome: "Policeman",
    imagem: "/images/trainers/policeman.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 136,
    stardust: 3298,
    xp: 175,
    ia: "aleatoria",
    time: [
      { speciesId: 821, nome: "Rookidee", level: 71 },
      { speciesId: 474, nome: "Porygon-z", level: 26 },
      { speciesId: 63, nome: "Abra", level: 43 },
      { speciesId: 163, nome: "Hoothoot", level: 22 },
      { speciesId: 760, nome: "Bewear", level: 65 },
      { speciesId: 1006, nome: "Iron-valiant", level: 70 }
    ]
  },

  {
    id: "poppy",
    nome: "Poppy",
    imagem: "/images/trainers/poppy.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 2497,
    stardust: 4917,
    xp: 347,
    ia: "estrategica",
    time: [
      { speciesId: 126, nome: "Magmar", level: 21 },
      { speciesId: 428, nome: "Lopunny", level: 10 },
      { speciesId: 717, nome: "Yveltal", level: 15 },
      { speciesId: 55, nome: "Golduck", level: 64 },
      { speciesId: 892, nome: "Urshifu-single-strike", level: 60 },
      { speciesId: 879, nome: "Copperajah", level: 50 }
    ]
  },

  {
    id: "postman",
    nome: "Postman",
    imagem: "/images/trainers/postman.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 474,
    stardust: 2450,
    xp: 406,
    ia: "estrategica",
    time: [
      { speciesId: 589, nome: "Escavalier", level: 23 },
      { speciesId: 345, nome: "Lileep", level: 68 },
      { speciesId: 233, nome: "Porygon2", level: 31 },
      { speciesId: 940, nome: "Wattrel", level: 80 },
      { speciesId: 622, nome: "Golett", level: 67 },
      { speciesId: 357, nome: "Tropius", level: 29 }
    ]
  },

  {
    id: "preschooler-gen6",
    nome: "Preschooler-gen6",
    imagem: "/images/trainers/preschooler-gen6.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 725,
    stardust: 561,
    xp: 152,
    ia: "estrategica",
    time: [
      { speciesId: 827, nome: "Nickit", level: 34 },
      { speciesId: 498, nome: "Tepig", level: 24 },
      { speciesId: 906, nome: "Sprigatito", level: 34 },
      { speciesId: 433, nome: "Chingling", level: 46 },
      { speciesId: 610, nome: "Axew", level: 29 },
      { speciesId: 569, nome: "Garbodor", level: 38 }
    ]
  },

  {
    id: "preschooler-gen7",
    nome: "Preschooler-gen7",
    imagem: "/images/trainers/preschooler-gen7.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 2157,
    stardust: 1102,
    xp: 359,
    ia: "defensiva",
    time: [
      { speciesId: 883, nome: "Arctovish", level: 80 },
      { speciesId: 825, nome: "Dottler", level: 24 },
      { speciesId: 210, nome: "Granbull", level: 40 },
      { speciesId: 405, nome: "Luxray", level: 14 },
      { speciesId: 546, nome: "Cottonee", level: 35 },
      { speciesId: 436, nome: "Bronzor", level: 66 }
    ]
  },

  {
    id: "preschooler",
    nome: "Preschooler",
    imagem: "/images/trainers/preschooler.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 1218,
    stardust: 1047,
    xp: 101,
    ia: "estrategica",
    time: [
      { speciesId: 552, nome: "Krokorok", level: 17 },
      { speciesId: 971, nome: "Greavard", level: 57 },
      { speciesId: 619, nome: "Mienfoo", level: 40 },
      { speciesId: 894, nome: "Regieleki", level: 59 },
      { speciesId: 845, nome: "Cramorant", level: 55 },
      { speciesId: 594, nome: "Alomomola", level: 46 }
    ]
  },

  {
    id: "preschoolerf-gen6",
    nome: "Preschoolerf-gen6",
    imagem: "/images/trainers/preschoolerf-gen6.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 2179,
    stardust: 186,
    xp: 359,
    ia: "estrategica",
    time: [
      { speciesId: 367, nome: "Huntail", level: 50 },
      { speciesId: 934, nome: "Garganacl", level: 28 },
      { speciesId: 973, nome: "Flamigo", level: 80 },
      { speciesId: 924, nome: "Tandemaus", level: 63 },
      { speciesId: 236, nome: "Tyrogue", level: 76 },
      { speciesId: 790, nome: "Cosmoem", level: 39 }
    ]
  },

  {
    id: "preschoolerf-gen7",
    nome: "Preschoolerf-gen7",
    imagem: "/images/trainers/preschoolerf-gen7.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 384,
    stardust: 4100,
    xp: 367,
    ia: "aleatoria",
    time: [
      { speciesId: 346, nome: "Cradily", level: 79 },
      { speciesId: 870, nome: "Falinks", level: 55 },
      { speciesId: 94, nome: "Gengar", level: 25 },
      { speciesId: 326, nome: "Grumpig", level: 31 },
      { speciesId: 333, nome: "Swablu", level: 26 },
      { speciesId: 826, nome: "Orbeetle", level: 73 }
    ]
  },

  {
    id: "preschoolerf",
    nome: "Preschoolerf",
    imagem: "/images/trainers/preschoolerf.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 1368,
    stardust: 3524,
    xp: 110,
    ia: "defensiva",
    time: [
      { speciesId: 329, nome: "Vibrava", level: 49 },
      { speciesId: 9, nome: "Blastoise", level: 54 },
      { speciesId: 191, nome: "Sunkern", level: 40 },
      { speciesId: 593, nome: "Jellicent", level: 66 },
      { speciesId: 106, nome: "Hitmonlee", level: 25 },
      { speciesId: 33, nome: "Nidorino", level: 32 }
    ]
  },

  {
    id: "preschoolers",
    nome: "Preschoolers",
    imagem: "/images/trainers/preschoolers.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 2134,
    stardust: 1674,
    xp: 346,
    ia: "agressiva",
    time: [
      { speciesId: 648, nome: "Meloetta-aria", level: 79 },
      { speciesId: 902, nome: "Basculegion-male", level: 62 },
      { speciesId: 849, nome: "Toxtricity-amped", level: 18 },
      { speciesId: 69, nome: "Bellsprout", level: 22 },
      { speciesId: 936, nome: "Armarouge", level: 26 },
      { speciesId: 745, nome: "Lycanroc-midday", level: 75 }
    ]
  },

  {
    id: "proton",
    nome: "Proton",
    imagem: "/images/trainers/proton.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 1546,
    stardust: 1095,
    xp: 287,
    ia: "agressiva",
    time: [
      { speciesId: 429, nome: "Mismagius", level: 47 },
      { speciesId: 366, nome: "Clamperl", level: 31 },
      { speciesId: 776, nome: "Turtonator", level: 10 },
      { speciesId: 375, nome: "Metang", level: 61 },
      { speciesId: 231, nome: "Phanpy", level: 54 },
      { speciesId: 492, nome: "Shaymin-land", level: 41 }
    ]
  },

  {
    id: "pryce-gen2",
    nome: "Pryce-gen2",
    imagem: "/images/trainers/pryce-gen2.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 2503,
    stardust: 286,
    xp: 126,
    ia: "defensiva",
    time: [
      { speciesId: 795, nome: "Pheromosa", level: 34 },
      { speciesId: 343, nome: "Baltoy", level: 74 },
      { speciesId: 148, nome: "Dragonair", level: 74 },
      { speciesId: 786, nome: "Tapu-lele", level: 38 },
      { speciesId: 66, nome: "Machop", level: 70 },
      { speciesId: 387, nome: "Turtwig", level: 73 }
    ]
  },

  {
    id: "pryce",
    nome: "Pryce",
    imagem: "/images/trainers/pryce.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 2913,
    stardust: 1600,
    xp: 221,
    ia: "defensiva",
    time: [
      { speciesId: 156, nome: "Quilava", level: 65 },
      { speciesId: 423, nome: "Gastrodon", level: 59 },
      { speciesId: 779, nome: "Bruxish", level: 72 },
      { speciesId: 645, nome: "Landorus-incarnate", level: 30 },
      { speciesId: 35, nome: "Clefairy", level: 53 },
      { speciesId: 995, nome: "Iron-thorns", level: 50 }
    ]
  },

  {
    id: "psychic-gen1",
    nome: "Psychic-gen1",
    imagem: "/images/trainers/psychic-gen1.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 635,
    stardust: 818,
    xp: 115,
    ia: "defensiva",
    time: [
      { speciesId: 287, nome: "Slakoth", level: 32 },
      { speciesId: 113, nome: "Chansey", level: 24 },
      { speciesId: 385, nome: "Jirachi", level: 36 },
      { speciesId: 529, nome: "Drilbur", level: 28 },
      { speciesId: 1016, nome: "Fezandipiti", level: 35 },
      { speciesId: 155, nome: "Cyndaquil", level: 14 }
    ]
  },

  {
    id: "psychic-gen1rb",
    nome: "Psychic-gen1rb",
    imagem: "/images/trainers/psychic-gen1rb.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 2566,
    stardust: 5220,
    xp: 352,
    ia: "defensiva",
    time: [
      { speciesId: 413, nome: "Wormadam-plant", level: 44 },
      { speciesId: 228, nome: "Houndour", level: 10 },
      { speciesId: 404, nome: "Luxio", level: 72 },
      { speciesId: 708, nome: "Phantump", level: 39 },
      { speciesId: 574, nome: "Gothita", level: 59 },
      { speciesId: 57, nome: "Primeape", level: 31 }
    ]
  },

  {
    id: "psychic-gen2",
    nome: "Psychic-gen2",
    imagem: "/images/trainers/psychic-gen2.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 2806,
    stardust: 4312,
    xp: 494,
    ia: "agressiva",
    time: [
      { speciesId: 54, nome: "Psyduck", level: 52 },
      { speciesId: 733, nome: "Toucannon", level: 25 },
      { speciesId: 701, nome: "Hawlucha", level: 17 },
      { speciesId: 299, nome: "Nosepass", level: 49 },
      { speciesId: 242, nome: "Blissey", level: 26 },
      { speciesId: 500, nome: "Emboar", level: 39 }
    ]
  },

  {
    id: "psychic-gen3",
    nome: "Psychic-gen3",
    imagem: "/images/trainers/psychic-gen3.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 1381,
    stardust: 5431,
    xp: 437,
    ia: "agressiva",
    time: [
      { speciesId: 479, nome: "Rotom", level: 62 },
      { speciesId: 292, nome: "Shedinja", level: 24 },
      { speciesId: 802, nome: "Marshadow", level: 27 },
      { speciesId: 45, nome: "Vileplume", level: 55 },
      { speciesId: 386, nome: "Deoxys-normal", level: 67 },
      { speciesId: 434, nome: "Stunky", level: 74 }
    ]
  },

  {
    id: "psychic-gen3rs",
    nome: "Psychic-gen3rs",
    imagem: "/images/trainers/psychic-gen3rs.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 2539,
    stardust: 1566,
    xp: 347,
    ia: "estrategica",
    time: [
      { speciesId: 119, nome: "Seaking", level: 16 },
      { speciesId: 120, nome: "Staryu", level: 35 },
      { speciesId: 862, nome: "Obstagoon", level: 45 },
      { speciesId: 740, nome: "Crabominable", level: 14 },
      { speciesId: 222, nome: "Corsola", level: 54 },
      { speciesId: 827, nome: "Nickit", level: 72 }
    ]
  },

  {
    id: "psychic-gen4",
    nome: "Psychic-gen4",
    imagem: "/images/trainers/psychic-gen4.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 1896,
    stardust: 5060,
    xp: 157,
    ia: "defensiva",
    time: [
      { speciesId: 237, nome: "Hitmontop", level: 73 },
      { speciesId: 231, nome: "Phanpy", level: 59 },
      { speciesId: 927, nome: "Dachsbun", level: 13 },
      { speciesId: 102, nome: "Exeggcute", level: 63 },
      { speciesId: 265, nome: "Wurmple", level: 22 },
      { speciesId: 650, nome: "Chespin", level: 17 }
    ]
  },

  {
    id: "psychic-gen6",
    nome: "Psychic-gen6",
    imagem: "/images/trainers/psychic-gen6.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 1198,
    stardust: 5316,
    xp: 220,
    ia: "agressiva",
    time: [
      { speciesId: 251, nome: "Celebi", level: 53 },
      { speciesId: 572, nome: "Minccino", level: 27 },
      { speciesId: 590, nome: "Foongus", level: 55 },
      { speciesId: 353, nome: "Shuppet", level: 73 },
      { speciesId: 145, nome: "Zapdos", level: 70 },
      { speciesId: 741, nome: "Oricorio-baile", level: 23 }
    ]
  },

  {
    id: "psychic-lgpe",
    nome: "Psychic-lgpe",
    imagem: "/images/trainers/psychic-lgpe.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 562,
    stardust: 3360,
    xp: 388,
    ia: "estrategica",
    time: [
      { speciesId: 348, nome: "Armaldo", level: 20 },
      { speciesId: 559, nome: "Scraggy", level: 60 },
      { speciesId: 933, nome: "Naclstack", level: 25 },
      { speciesId: 435, nome: "Skuntank", level: 65 },
      { speciesId: 264, nome: "Linoone", level: 19 },
      { speciesId: 935, nome: "Charcadet", level: 34 }
    ]
  },

  {
    id: "psychic",
    nome: "Psychic",
    imagem: "/images/trainers/psychic.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 440,
    stardust: 5216,
    xp: 297,
    ia: "agressiva",
    time: [
      { speciesId: 288, nome: "Vigoroth", level: 69 },
      { speciesId: 826, nome: "Orbeetle", level: 15 },
      { speciesId: 947, nome: "Brambleghast", level: 13 },
      { speciesId: 427, nome: "Buneary", level: 80 },
      { speciesId: 30, nome: "Nidorina", level: 66 },
      { speciesId: 470, nome: "Leafeon", level: 18 }
    ]
  },

  {
    id: "psychicf-gen3",
    nome: "Psychicf-gen3",
    imagem: "/images/trainers/psychicf-gen3.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 1621,
    stardust: 610,
    xp: 174,
    ia: "estrategica",
    time: [
      { speciesId: 908, nome: "Meowscarada", level: 80 },
      { speciesId: 974, nome: "Cetoddle", level: 39 },
      { speciesId: 210, nome: "Granbull", level: 64 },
      { speciesId: 290, nome: "Nincada", level: 45 },
      { speciesId: 183, nome: "Marill", level: 31 },
      { speciesId: 34, nome: "Nidoking", level: 62 }
    ]
  },

  {
    id: "psychicf-gen3rs",
    nome: "Psychicf-gen3rs",
    imagem: "/images/trainers/psychicf-gen3rs.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 2848,
    stardust: 4611,
    xp: 163,
    ia: "aleatoria",
    time: [
      { speciesId: 255, nome: "Torchic", level: 70 },
      { speciesId: 892, nome: "Urshifu-single-strike", level: 72 },
      { speciesId: 201, nome: "Unown", level: 11 },
      { speciesId: 232, nome: "Donphan", level: 71 },
      { speciesId: 878, nome: "Cufant", level: 67 },
      { speciesId: 268, nome: "Cascoon", level: 11 }
    ]
  },

];

// Super Bosses Semanais (liberados ao vencer 10 batalhas no fim de semana)
export const superBossSemanal: DuelNpc[] = [
  // SEMANA 1 - TIPO FOGO
  {
    id: "ignar",
    semana: 1,
    nome: "Ignar, O Infernal",
    imagem: "/images/trainers/ignar.jpg",
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
    imagem: "/images/trainers/nerida.jpg",
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
    imagem: "/images/trainers/voltaris.jpg",
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
    imagem: "/images/trainers/umbra.jpg",
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

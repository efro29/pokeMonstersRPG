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
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 1658,
    stardust: 4381,
    xp: 496,
    ia: "aleatoria",
    time: [
      { speciesId: 591, nome: "Amoonguss", level: 1 },
      { speciesId: 897, nome: "Spectrier", level: 4 }
    ]
  },

  {
    id: "aarune",
    nome: "Aarune",
    imagem: "/images/trainers/aarune.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 2386,
    stardust: 3364,
    xp: 458,
    ia: "aleatoria",
    time: [
      { speciesId: 233, nome: "Porygon2", level: 3 },
      { speciesId: 547, nome: "Whimsicott", level: 4 }
    ]
  },

  {
    id: "acerola-masters",
    nome: "Acerola-masters",
    imagem: "/images/trainers/acerola-masters.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 309,
    stardust: 510,
    xp: 256,
    ia: "aleatoria",
    time: [
      { speciesId: 699, nome: "Aurorus", level: 21 }
    ]
  },

  {
    id: "acerola-masters2",
    nome: "Acerola-masters2",
    imagem: "/images/trainers/acerola-masters2.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 2467,
    stardust: 955,
    xp: 81,
    ia: "aleatoria",
    time: [
      { speciesId: 538, nome: "Throh", level: 14 },
      { speciesId: 1009, nome: "Walking-wake", level: 17 }
    ]
  },

  {
    id: "acerola-masters3",
    nome: "Acerola-masters3",
    imagem: "/images/trainers/acerola-masters3.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 1393,
    stardust: 1639,
    xp: 263,
    ia: "defensiva",
    time: [
      { speciesId: 831, nome: "Wooloo", level: 5 }
    ]
  },

  {
    id: "acerola",
    nome: "Acerola",
    imagem: "/images/trainers/acerola.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 674,
    stardust: 3713,
    xp: 394,
    ia: "defensiva",
    time: [
      { speciesId: 90, nome: "Shellder", level: 13 }
    ]
  },

  {
    id: "acetrainer-gen1",
    nome: "Acetrainer-gen1",
    imagem: "/images/trainers/acetrainer-gen1.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 1774,
    stardust: 5185,
    xp: 167,
    ia: "aleatoria",
    time: [
      { speciesId: 678, nome: "Meowstic-male", level: 34 },
      { speciesId: 674, nome: "Pancham", level: 35 },
      { speciesId: 920, nome: "Lokix", level: 33 },
      { speciesId: 466, nome: "Electivire", level: 32 },
      { speciesId: 822, nome: "Corvisquire", level: 44 }
    ]
  },

  {
    id: "acetrainer-gen1rb",
    nome: "Acetrainer-gen1rb",
    imagem: "/images/trainers/acetrainer-gen1rb.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 2008,
    stardust: 3549,
    xp: 78,
    ia: "estrategica",
    time: [
      { speciesId: 864, nome: "Cursola", level: 10 }
    ]
  },

  {
    id: "acetrainer-gen2",
    nome: "Acetrainer-gen2",
    imagem: "/images/trainers/acetrainer-gen2.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 812,
    stardust: 3536,
    xp: 325,
    ia: "agressiva",
    time: [
      { speciesId: 934, nome: "Garganacl", level: 30 },
      { speciesId: 31, nome: "Nidoqueen", level: 30 },
      { speciesId: 965, nome: "Varoom", level: 27 }
    ]
  },

  {
    id: "acetrainer-gen3",
    nome: "Acetrainer-gen3",
    imagem: "/images/trainers/acetrainer-gen3.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 982,
    stardust: 922,
    xp: 350,
    ia: "estrategica",
    time: [
      { speciesId: 259, nome: "Marshtomp", level: 35 },
      { speciesId: 217, nome: "Ursaring", level: 44 }
    ]
  },

  {
    id: "acetrainer-gen3jp",
    nome: "Acetrainer-gen3jp",
    imagem: "/images/trainers/acetrainer-gen3jp.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 287,
    stardust: 2474,
    xp: 482,
    ia: "estrategica",
    time: [
      { speciesId: 122, nome: "Mr-mime", level: 3 },
      { speciesId: 770, nome: "Palossand", level: 11 }
    ]
  },

  {
    id: "acetrainer-gen3rs",
    nome: "Acetrainer-gen3rs",
    imagem: "/images/trainers/acetrainer-gen3rs.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 2960,
    stardust: 4721,
    xp: 473,
    ia: "aleatoria",
    time: [
      { speciesId: 284, nome: "Masquerain", level: 29 },
      { speciesId: 767, nome: "Wimpod", level: 23 },
      { speciesId: 937, nome: "Ceruledge", level: 27 },
      { speciesId: 942, nome: "Maschiff", level: 27 }
    ]
  },

  {
    id: "acetrainer-gen4",
    nome: "Acetrainer-gen4",
    imagem: "/images/trainers/acetrainer-gen4.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 2749,
    stardust: 2368,
    xp: 142,
    ia: "agressiva",
    time: [
      { speciesId: 892, nome: "Urshifu-single-strike", level: 5 },
      { speciesId: 299, nome: "Nosepass", level: 12 }
    ]
  },

  {
    id: "acetrainer-gen4dp",
    nome: "Acetrainer-gen4dp",
    imagem: "/images/trainers/acetrainer-gen4dp.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 1785,
    stardust: 2455,
    xp: 451,
    ia: "aleatoria",
    time: [
      { speciesId: 358, nome: "Chimecho", level: 36 },
      { speciesId: 883, nome: "Arctovish", level: 45 },
      { speciesId: 991, nome: "Iron-bundle", level: 42 },
      { speciesId: 968, nome: "Orthworm", level: 37 }
    ]
  },

  {
    id: "acetrainer-gen6",
    nome: "Acetrainer-gen6",
    imagem: "/images/trainers/acetrainer-gen6.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 1194,
    stardust: 3651,
    xp: 330,
    ia: "defensiva",
    time: [
      { speciesId: 364, nome: "Sealeo", level: 23 }
    ]
  },

  {
    id: "acetrainer-gen6xy",
    nome: "Acetrainer-gen6xy",
    imagem: "/images/trainers/acetrainer-gen6xy.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 1846,
    stardust: 1405,
    xp: 343,
    ia: "agressiva",
    time: [
      { speciesId: 464, nome: "Rhyperior", level: 29 }
    ]
  },

  {
    id: "acetrainer-gen7",
    nome: "Acetrainer-gen7",
    imagem: "/images/trainers/acetrainer-gen7.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 412,
    stardust: 3948,
    xp: 193,
    ia: "aleatoria",
    time: [
      { speciesId: 537, nome: "Seismitoad", level: 10 }
    ]
  },

  {
    id: "acetrainer",
    nome: "Acetrainer",
    imagem: "/images/trainers/acetrainer.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 980,
    stardust: 4939,
    xp: 334,
    ia: "estrategica",
    time: [
      { speciesId: 748, nome: "Toxapex", level: 23 },
      { speciesId: 791, nome: "Solgaleo", level: 30 },
      { speciesId: 565, nome: "Carracosta", level: 30 }
    ]
  },

  {
    id: "acetrainercouple-gen3",
    nome: "Acetrainercouple-gen3",
    imagem: "/images/trainers/acetrainercouple-gen3.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 2298,
    stardust: 484,
    xp: 424,
    ia: "estrategica",
    time: [
      { speciesId: 310, nome: "Manectric", level: 4 },
      { speciesId: 841, nome: "Flapple", level: 3 }
    ]
  },

  {
    id: "acetrainercouple",
    nome: "Acetrainercouple",
    imagem: "/images/trainers/acetrainercouple.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 935,
    stardust: 1038,
    xp: 467,
    ia: "estrategica",
    time: [
      { speciesId: 662, nome: "Fletchinder", level: 12 }
    ]
  },

  {
    id: "acetrainerf-gen1",
    nome: "Acetrainerf-gen1",
    imagem: "/images/trainers/acetrainerf-gen1.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "dificil",
    recompensa: 2291,
    stardust: 1043,
    xp: 240,
    ia: "aleatoria",
    time: [
      { speciesId: 10, nome: "Caterpie", level: 29 },
      { speciesId: 689, nome: "Barbaracle", level: 24 },
      { speciesId: 751, nome: "Dewpider", level: 29 },
      { speciesId: 776, nome: "Turtonator", level: 28 }
    ]
  },

  {
    id: "acetrainerf-gen1rb",
    nome: "Acetrainerf-gen1rb",
    imagem: "/images/trainers/acetrainerf-gen1rb.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 1225,
    stardust: 606,
    xp: 489,
    ia: "agressiva",
    time: [
      { speciesId: 677, nome: "Espurr", level: 18 },
      { speciesId: 448, nome: "Lucario", level: 16 },
      { speciesId: 561, nome: "Sigilyph", level: 17 }
    ]
  },

  {
    id: "acetrainerf-gen2",
    nome: "Acetrainerf-gen2",
    imagem: "/images/trainers/acetrainerf-gen2.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 1683,
    stardust: 1071,
    xp: 430,
    ia: "agressiva",
    time: [
      { speciesId: 855, nome: "Polteageist", level: 35 },
      { speciesId: 689, nome: "Barbaracle", level: 35 },
      { speciesId: 800, nome: "Necrozma", level: 35 }
    ]
  },

  {
    id: "acetrainerf-gen3",
    nome: "Acetrainerf-gen3",
    imagem: "/images/trainers/acetrainerf-gen3.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 759,
    stardust: 1153,
    xp: 405,
    ia: "estrategica",
    time: [
      { speciesId: 348, nome: "Armaldo", level: 12 }
    ]
  },

  {
    id: "acetrainerf-gen3rs",
    nome: "Acetrainerf-gen3rs",
    imagem: "/images/trainers/acetrainerf-gen3rs.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "dificil",
    recompensa: 2119,
    stardust: 605,
    xp: 423,
    ia: "defensiva",
    time: [
      { speciesId: 936, nome: "Armarouge", level: 21 },
      { speciesId: 892, nome: "Urshifu-single-strike", level: 29 },
      { speciesId: 390, nome: "Chimchar", level: 30 }
    ]
  },

  {
    id: "acetrainerf-gen4",
    nome: "Acetrainerf-gen4",
    imagem: "/images/trainers/acetrainerf-gen4.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 2602,
    stardust: 1799,
    xp: 240,
    ia: "defensiva",
    time: [
      { speciesId: 19, nome: "Rattata", level: 7 },
      { speciesId: 177, nome: "Natu", level: 11 }
    ]
  },

  {
    id: "acetrainerf-gen4dp",
    nome: "Acetrainerf-gen4dp",
    imagem: "/images/trainers/acetrainerf-gen4dp.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 947,
    stardust: 2556,
    xp: 169,
    ia: "estrategica",
    time: [
      { speciesId: 679, nome: "Honedge", level: 3 }
    ]
  },

  {
    id: "acetrainerf-gen6",
    nome: "Acetrainerf-gen6",
    imagem: "/images/trainers/acetrainerf-gen6.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 2719,
    stardust: 3915,
    xp: 160,
    ia: "agressiva",
    time: [
      { speciesId: 740, nome: "Crabominable", level: 41 },
      { speciesId: 197, nome: "Umbreon", level: 44 },
      { speciesId: 407, nome: "Roserade", level: 31 }
    ]
  },

  {
    id: "acetrainerf-gen6xy",
    nome: "Acetrainerf-gen6xy",
    imagem: "/images/trainers/acetrainerf-gen6xy.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 766,
    stardust: 2117,
    xp: 444,
    ia: "agressiva",
    time: [
      { speciesId: 454, nome: "Toxicroak", level: 21 }
    ]
  },

  {
    id: "acetrainerf-gen7",
    nome: "Acetrainerf-gen7",
    imagem: "/images/trainers/acetrainerf-gen7.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 1489,
    stardust: 2920,
    xp: 155,
    ia: "defensiva",
    time: [
      { speciesId: 964, nome: "Palafin-zero", level: 29 },
      { speciesId: 328, nome: "Trapinch", level: 27 }
    ]
  },

  {
    id: "acetrainerf",
    nome: "Acetrainerf",
    imagem: "/images/trainers/acetrainerf.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 1211,
    stardust: 3352,
    xp: 367,
    ia: "defensiva",
    time: [
      { speciesId: 459, nome: "Snover", level: 43 },
      { speciesId: 582, nome: "Vanillite", level: 45 }
    ]
  },

  {
    id: "acetrainersnow",
    nome: "Acetrainersnow",
    imagem: "/images/trainers/acetrainersnow.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 2225,
    stardust: 3854,
    xp: 205,
    ia: "estrategica",
    time: [
      { speciesId: 984, nome: "Great-tusk", level: 19 }
    ]
  },

  {
    id: "acetrainersnowf",
    nome: "Acetrainersnowf",
    imagem: "/images/trainers/acetrainersnowf.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 2437,
    stardust: 5240,
    xp: 363,
    ia: "estrategica",
    time: [
      { speciesId: 755, nome: "Morelull", level: 13 },
      { speciesId: 410, nome: "Shieldon", level: 13 }
    ]
  },

  {
    id: "adaman-masters",
    nome: "Adaman-masters",
    imagem: "/images/trainers/adaman-masters.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 2733,
    stardust: 111,
    xp: 109,
    ia: "defensiva",
    time: [
      { speciesId: 225, nome: "Delibird", level: 13 }
    ]
  },

  {
    id: "adaman",
    nome: "Adaman",
    imagem: "/images/trainers/adaman.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 2877,
    stardust: 2565,
    xp: 463,
    ia: "aleatoria",
    time: [
      { speciesId: 41, nome: "Zubat", level: 18 },
      { speciesId: 430, nome: "Honchkrow", level: 17 },
      { speciesId: 281, nome: "Kirlia", level: 14 }
    ]
  },

  {
    id: "aetheremployee",
    nome: "Aetheremployee",
    imagem: "/images/trainers/aetheremployee.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 593,
    stardust: 5148,
    xp: 350,
    ia: "agressiva",
    time: [
      { speciesId: 304, nome: "Aron", level: 16 },
      { speciesId: 744, nome: "Rockruff", level: 16 },
      { speciesId: 341, nome: "Corphish", level: 14 }
    ]
  },

  {
    id: "aetheremployeef",
    nome: "Aetheremployeef",
    imagem: "/images/trainers/aetheremployeef.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 956,
    stardust: 4643,
    xp: 464,
    ia: "estrategica",
    time: [
      { speciesId: 154, nome: "Meganium", level: 33 }
    ]
  },

  {
    id: "aetherfoundation",
    nome: "Aetherfoundation",
    imagem: "/images/trainers/aetherfoundation.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 389,
    stardust: 1391,
    xp: 68,
    ia: "estrategica",
    time: [
      { speciesId: 652, nome: "Chesnaught", level: 7 },
      { speciesId: 774, nome: "Minior-red-meteor", level: 12 }
    ]
  },

  {
    id: "aetherfoundation2",
    nome: "Aetherfoundation2",
    imagem: "/images/trainers/aetherfoundation2.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 715,
    stardust: 5178,
    xp: 464,
    ia: "defensiva",
    time: [
      { speciesId: 56, nome: "Mankey", level: 29 },
      { speciesId: 1016, nome: "Fezandipiti", level: 26 },
      { speciesId: 1000, nome: "Gholdengo", level: 29 },
      { speciesId: 712, nome: "Bergmite", level: 29 }
    ]
  },

  {
    id: "aetherfoundationf",
    nome: "Aetherfoundationf",
    imagem: "/images/trainers/aetherfoundationf.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 1969,
    stardust: 568,
    xp: 485,
    ia: "aleatoria",
    time: [
      { speciesId: 51, nome: "Dugtrio", level: 43 },
      { speciesId: 289, nome: "Slaking", level: 31 },
      { speciesId: 70, nome: "Weepinbell", level: 39 }
    ]
  },

  {
    id: "agatha-gen1",
    nome: "Agatha-gen1",
    imagem: "/images/trainers/agatha-gen1.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 2136,
    stardust: 5205,
    xp: 345,
    ia: "estrategica",
    time: [
      { speciesId: 790, nome: "Cosmoem", level: 2 },
      { speciesId: 106, nome: "Hitmonlee", level: 4 }
    ]
  },

  {
    id: "agatha-gen1rb",
    nome: "Agatha-gen1rb",
    imagem: "/images/trainers/agatha-gen1rb.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 2254,
    stardust: 3354,
    xp: 271,
    ia: "estrategica",
    time: [
      { speciesId: 641, nome: "Tornadus-incarnate", level: 24 },
      { speciesId: 158, nome: "Totodile", level: 28 }
    ]
  },

  {
    id: "agatha-gen3",
    nome: "Agatha-gen3",
    imagem: "/images/trainers/agatha-gen3.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 2366,
    stardust: 4534,
    xp: 424,
    ia: "estrategica",
    time: [
      { speciesId: 114, nome: "Tangela", level: 10 }
    ]
  },

  {
    id: "agatha-lgpe",
    nome: "Agatha-lgpe",
    imagem: "/images/trainers/agatha-lgpe.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 248,
    stardust: 2714,
    xp: 360,
    ia: "estrategica",
    time: [
      { speciesId: 222, nome: "Corsola", level: 21 }
    ]
  },

  {
    id: "akari-isekai",
    nome: "Akari-isekai",
    imagem: "/images/trainers/akari-isekai.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 2064,
    stardust: 3754,
    xp: 487,
    ia: "agressiva",
    time: [
      { speciesId: 64, nome: "Kadabra", level: 30 },
      { speciesId: 60, nome: "Poliwag", level: 29 },
      { speciesId: 1005, nome: "Roaring-moon", level: 26 }
    ]
  },

  {
    id: "akari",
    nome: "Akari",
    imagem: "/images/trainers/akari.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 296,
    stardust: 1848,
    xp: 306,
    ia: "defensiva",
    time: [
      { speciesId: 791, nome: "Solgaleo", level: 23 }
    ]
  },

  {
    id: "alain",
    nome: "Alain",
    imagem: "/images/trainers/alain.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 2203,
    stardust: 535,
    xp: 225,
    ia: "estrategica",
    time: [
      { speciesId: 383, nome: "Groudon", level: 41 },
      { speciesId: 817, nome: "Drizzile", level: 36 }
    ]
  },

  {
    id: "alder",
    nome: "Alder",
    imagem: "/images/trainers/alder.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 1944,
    stardust: 3224,
    xp: 170,
    ia: "defensiva",
    time: [
      { speciesId: 496, nome: "Servine", level: 33 },
      { speciesId: 400, nome: "Bibarel", level: 37 },
      { speciesId: 474, nome: "Porygon-z", level: 34 },
      { speciesId: 613, nome: "Cubchoo", level: 41 },
      { speciesId: 788, nome: "Tapu-fini", level: 42 }
    ]
  },

  {
    id: "alec-anime",
    nome: "Alec-anime",
    imagem: "/images/trainers/alec-anime.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 1109,
    stardust: 2378,
    xp: 111,
    ia: "aleatoria",
    time: [
      { speciesId: 721, nome: "Volcanion", level: 17 }
    ]
  },

  {
    id: "allister-masters",
    nome: "Allister-masters",
    imagem: "/images/trainers/allister-masters.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 412,
    stardust: 3550,
    xp: 61,
    ia: "agressiva",
    time: [
      { speciesId: 777, nome: "Togedemaru", level: 15 },
      { speciesId: 123, nome: "Scyther", level: 13 },
      { speciesId: 656, nome: "Froakie", level: 13 }
    ]
  },

  {
    id: "allister-unmasked",
    nome: "Allister-unmasked",
    imagem: "/images/trainers/allister-unmasked.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 906,
    stardust: 4747,
    xp: 351,
    ia: "defensiva",
    time: [
      { speciesId: 589, nome: "Escavalier", level: 23 },
      { speciesId: 210, nome: "Granbull", level: 29 }
    ]
  },

  {
    id: "allister",
    nome: "Allister",
    imagem: "/images/trainers/allister.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 361,
    stardust: 4984,
    xp: 368,
    ia: "estrategica",
    time: [
      { speciesId: 796, nome: "Xurkitree", level: 1 }
    ]
  },

  {
    id: "amarys",
    nome: "Amarys",
    imagem: "/images/trainers/amarys.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 625,
    stardust: 4936,
    xp: 219,
    ia: "estrategica",
    time: [
      { speciesId: 421, nome: "Cherrim", level: 10 }
    ]
  },

  {
    id: "amelia-shuffle",
    nome: "Amelia-shuffle",
    imagem: "/images/trainers/amelia-shuffle.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 945,
    stardust: 5384,
    xp: 147,
    ia: "agressiva",
    time: [
      { speciesId: 329, nome: "Vibrava", level: 22 },
      { speciesId: 481, nome: "Mesprit", level: 29 },
      { speciesId: 122, nome: "Mr-mime", level: 25 },
      { speciesId: 889, nome: "Zamazenta", level: 24 }
    ]
  },

  {
    id: "anabel-gen3",
    nome: "Anabel-gen3",
    imagem: "/images/trainers/anabel-gen3.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 2152,
    stardust: 3933,
    xp: 211,
    ia: "agressiva",
    time: [
      { speciesId: 250, nome: "Ho-oh", level: 8 },
      { speciesId: 239, nome: "Elekid", level: 5 }
    ]
  },

  {
    id: "anabel-gen7",
    nome: "Anabel-gen7",
    imagem: "/images/trainers/anabel-gen7.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 1666,
    stardust: 4808,
    xp: 249,
    ia: "aleatoria",
    time: [
      { speciesId: 171, nome: "Lanturn", level: 11 }
    ]
  },

  {
    id: "anabel",
    nome: "Anabel",
    imagem: "/images/trainers/anabel.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 446,
    stardust: 5358,
    xp: 308,
    ia: "agressiva",
    time: [
      { speciesId: 803, nome: "Poipole", level: 5 },
      { speciesId: 320, nome: "Wailmer", level: 8 }
    ]
  },

  {
    id: "anthe",
    nome: "Anthe",
    imagem: "/images/trainers/anthe.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 752,
    stardust: 3691,
    xp: 218,
    ia: "agressiva",
    time: [
      { speciesId: 415, nome: "Combee", level: 7 },
      { speciesId: 540, nome: "Sewaddle", level: 4 }
    ]
  },

  {
    id: "anthea",
    nome: "Anthea",
    imagem: "/images/trainers/anthea.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 1585,
    stardust: 376,
    xp: 471,
    ia: "estrategica",
    time: [
      { speciesId: 129, nome: "Magikarp", level: 17 }
    ]
  },

  {
    id: "anvin",
    nome: "Anvin",
    imagem: "/images/trainers/anvin.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 2153,
    stardust: 1065,
    xp: 162,
    ia: "defensiva",
    time: [
      { speciesId: 107, nome: "Hitmonchan", level: 45 },
      { speciesId: 477, nome: "Dusknoir", level: 38 },
      { speciesId: 518, nome: "Musharna", level: 32 },
      { speciesId: 286, nome: "Breloom", level: 39 }
    ]
  },

  {
    id: "aquagrunt-rse",
    nome: "Aquagrunt-rse",
    imagem: "/images/trainers/aquagrunt-rse.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 1353,
    stardust: 2441,
    xp: 143,
    ia: "agressiva",
    time: [
      { speciesId: 993, nome: "Iron-jugulis", level: 43 },
      { speciesId: 575, nome: "Gothorita", level: 30 },
      { speciesId: 78, nome: "Rapidash", level: 45 },
      { speciesId: 198, nome: "Murkrow", level: 35 }
    ]
  },

  {
    id: "aquagrunt",
    nome: "Aquagrunt",
    imagem: "/images/trainers/aquagrunt.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 2635,
    stardust: 5165,
    xp: 157,
    ia: "defensiva",
    time: [
      { speciesId: 386, nome: "Deoxys-normal", level: 43 },
      { speciesId: 387, nome: "Turtwig", level: 43 },
      { speciesId: 800, nome: "Necrozma", level: 36 },
      { speciesId: 302, nome: "Sableye", level: 43 },
      { speciesId: 778, nome: "Mimikyu-disguised", level: 32 }
    ]
  },

  {
    id: "aquagruntf-rse",
    nome: "Aquagruntf-rse",
    imagem: "/images/trainers/aquagruntf-rse.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 1229,
    stardust: 546,
    xp: 304,
    ia: "estrategica",
    time: [
      { speciesId: 123, nome: "Scyther", level: 39 },
      { speciesId: 65, nome: "Alakazam", level: 40 },
      { speciesId: 613, nome: "Cubchoo", level: 41 },
      { speciesId: 183, nome: "Marill", level: 30 },
      { speciesId: 423, nome: "Gastrodon", level: 44 }
    ]
  },

  {
    id: "aquagruntf",
    nome: "Aquagruntf",
    imagem: "/images/trainers/aquagruntf.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 762,
    stardust: 2438,
    xp: 189,
    ia: "agressiva",
    time: [
      { speciesId: 726, nome: "Torracat", level: 36 },
      { speciesId: 848, nome: "Toxel", level: 40 },
      { speciesId: 793, nome: "Nihilego", level: 42 },
      { speciesId: 1010, nome: "Iron-leaves", level: 32 }
    ]
  },

  {
    id: "aquasuit",
    nome: "Aquasuit",
    imagem: "/images/trainers/aquasuit.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 2441,
    stardust: 3074,
    xp: 350,
    ia: "aleatoria",
    time: [
      { speciesId: 858, nome: "Hatterene", level: 14 },
      { speciesId: 823, nome: "Corviknight", level: 13 },
      { speciesId: 713, nome: "Avalugg", level: 20 }
    ]
  },

  {
    id: "archer",
    nome: "Archer",
    imagem: "/images/trainers/archer.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 776,
    stardust: 4873,
    xp: 51,
    ia: "agressiva",
    time: [
      { speciesId: 352, nome: "Kecleon", level: 45 },
      { speciesId: 575, nome: "Gothorita", level: 33 }
    ]
  },

  {
    id: "archie-gen3",
    nome: "Archie-gen3",
    imagem: "/images/trainers/archie-gen3.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 1593,
    stardust: 987,
    xp: 367,
    ia: "agressiva",
    time: [
      { speciesId: 566, nome: "Archen", level: 3 }
    ]
  },

  {
    id: "archie-gen6",
    nome: "Archie-gen6",
    imagem: "/images/trainers/archie-gen6.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 1750,
    stardust: 3668,
    xp: 183,
    ia: "aleatoria",
    time: [
      { speciesId: 958, nome: "Tinkatuff", level: 3 }
    ]
  },

  {
    id: "archie-usum",
    nome: "Archie-usum",
    imagem: "/images/trainers/archie-usum.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 2098,
    stardust: 3189,
    xp: 198,
    ia: "agressiva",
    time: [
      { speciesId: 213, nome: "Shuckle", level: 30 },
      { speciesId: 749, nome: "Mudbray", level: 42 },
      { speciesId: 957, nome: "Tinkatink", level: 37 }
    ]
  },

  {
    id: "arezu",
    nome: "Arezu",
    imagem: "/images/trainers/arezu.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 2768,
    stardust: 4303,
    xp: 447,
    ia: "estrategica",
    time: [
      { speciesId: 440, nome: "Happiny", level: 21 },
      { speciesId: 288, nome: "Vigoroth", level: 25 },
      { speciesId: 801, nome: "Magearna", level: 29 }
    ]
  },

  {
    id: "argenta",
    nome: "Argenta",
    imagem: "/images/trainers/argenta.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 716,
    stardust: 690,
    xp: 60,
    ia: "defensiva",
    time: [
      { speciesId: 116, nome: "Horsea", level: 28 },
      { speciesId: 336, nome: "Seviper", level: 29 }
    ]
  },

  {
    id: "ariana",
    nome: "Ariana",
    imagem: "/images/trainers/ariana.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 565,
    stardust: 2194,
    xp: 88,
    ia: "aleatoria",
    time: [
      { speciesId: 425, nome: "Drifloon", level: 1 },
      { speciesId: 797, nome: "Celesteela", level: 9 }
    ]
  },

  {
    id: "arlo",
    nome: "Arlo",
    imagem: "/images/trainers/arlo.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 319,
    stardust: 4467,
    xp: 360,
    ia: "aleatoria",
    time: [
      { speciesId: 556, nome: "Maractus", level: 24 },
      { speciesId: 735, nome: "Gumshoos", level: 23 },
      { speciesId: 914, nome: "Quaquaval", level: 29 },
      { speciesId: 397, nome: "Staravia", level: 21 }
    ]
  },

  {
    id: "aromalady-gen3",
    nome: "Aromalady-gen3",
    imagem: "/images/trainers/aromalady-gen3.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 2968,
    stardust: 372,
    xp: 124,
    ia: "defensiva",
    time: [
      { speciesId: 210, nome: "Granbull", level: 18 },
      { speciesId: 568, nome: "Trubbish", level: 17 },
      { speciesId: 654, nome: "Braixen", level: 13 }
    ]
  },

  {
    id: "aromalady-gen3rs",
    nome: "Aromalady-gen3rs",
    imagem: "/images/trainers/aromalady-gen3rs.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 2209,
    stardust: 1127,
    xp: 116,
    ia: "aleatoria",
    time: [
      { speciesId: 913, nome: "Quaxwell", level: 29 }
    ]
  },

  {
    id: "aromalady-gen6",
    nome: "Aromalady-gen6",
    imagem: "/images/trainers/aromalady-gen6.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 2781,
    stardust: 4260,
    xp: 161,
    ia: "aleatoria",
    time: [
      { speciesId: 430, nome: "Honchkrow", level: 42 },
      { speciesId: 59, nome: "Arcanine", level: 31 },
      { speciesId: 839, nome: "Coalossal", level: 36 }
    ]
  },

  {
    id: "aromalady",
    nome: "Aromalady",
    imagem: "/images/trainers/aromalady.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 1273,
    stardust: 3095,
    xp: 440,
    ia: "estrategica",
    time: [
      { speciesId: 803, nome: "Poipole", level: 1 },
      { speciesId: 314, nome: "Illumise", level: 9 }
    ]
  },

  {
    id: "artist-gen4",
    nome: "Artist-gen4",
    imagem: "/images/trainers/artist-gen4.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 655,
    stardust: 512,
    xp: 500,
    ia: "estrategica",
    time: [
      { speciesId: 514, nome: "Simisear", level: 2 },
      { speciesId: 964, nome: "Palafin-zero", level: 7 }
    ]
  },

  {
    id: "artist-gen6",
    nome: "Artist-gen6",
    imagem: "/images/trainers/artist-gen6.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 2299,
    stardust: 4788,
    xp: 149,
    ia: "estrategica",
    time: [
      { speciesId: 761, nome: "Bounsweet", level: 19 },
      { speciesId: 491, nome: "Darkrai", level: 14 },
      { speciesId: 241, nome: "Miltank", level: 17 }
    ]
  },

  {
    id: "artist-gen8",
    nome: "Artist-gen8",
    imagem: "/images/trainers/artist-gen8.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 2787,
    stardust: 340,
    xp: 241,
    ia: "defensiva",
    time: [
      { speciesId: 459, nome: "Snover", level: 31 },
      { speciesId: 514, nome: "Simisear", level: 36 },
      { speciesId: 410, nome: "Shieldon", level: 33 }
    ]
  },

  {
    id: "artist-gen9",
    nome: "Artist-gen9",
    imagem: "/images/trainers/artist-gen9.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 2516,
    stardust: 2507,
    xp: 88,
    ia: "estrategica",
    time: [
      { speciesId: 659, nome: "Bunnelby", level: 21 },
      { speciesId: 917, nome: "Tarountula", level: 29 },
      { speciesId: 926, nome: "Fidough", level: 27 }
    ]
  },

  {
    id: "artist",
    nome: "Artist",
    imagem: "/images/trainers/artist.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 2365,
    stardust: 2584,
    xp: 91,
    ia: "aleatoria",
    time: [
      { speciesId: 307, nome: "Meditite", level: 18 }
    ]
  },

  {
    id: "artistf-gen6",
    nome: "Artistf-gen6",
    imagem: "/images/trainers/artistf-gen6.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 800,
    stardust: 4292,
    xp: 109,
    ia: "aleatoria",
    time: [
      { speciesId: 798, nome: "Kartana", level: 19 },
      { speciesId: 580, nome: "Ducklett", level: 16 },
      { speciesId: 423, nome: "Gastrodon", level: 18 }
    ]
  },

  {
    id: "arven-s",
    nome: "Arven-s",
    imagem: "/images/trainers/arven-s.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 158,
    stardust: 756,
    xp: 287,
    ia: "agressiva",
    time: [
      { speciesId: 978, nome: "Tatsugiri-curly", level: 15 },
      { speciesId: 786, nome: "Tapu-lele", level: 17 },
      { speciesId: 327, nome: "Spinda", level: 16 }
    ]
  },

  {
    id: "arven-v",
    nome: "Arven-v",
    imagem: "/images/trainers/arven-v.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 1533,
    stardust: 2536,
    xp: 177,
    ia: "agressiva",
    time: [
      { speciesId: 313, nome: "Volbeat", level: 7 },
      { speciesId: 980, nome: "Clodsire", level: 8 }
    ]
  },

  {
    id: "ash-alola",
    nome: "Ash-alola",
    imagem: "/images/trainers/ash-alola.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 383,
    stardust: 4595,
    xp: 158,
    ia: "agressiva",
    time: [
      { speciesId: 861, nome: "Grimmsnarl", level: 9 },
      { speciesId: 327, nome: "Spinda", level: 3 }
    ]
  },

  {
    id: "ash-capbackward",
    nome: "Ash-capbackward",
    imagem: "/images/trainers/ash-capbackward.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 1130,
    stardust: 3519,
    xp: 80,
    ia: "defensiva",
    time: [
      { speciesId: 77, nome: "Ponyta", level: 10 },
      { speciesId: 954, nome: "Rabsca", level: 12 }
    ]
  },

  {
    id: "ash-hoenn",
    nome: "Ash-hoenn",
    imagem: "/images/trainers/ash-hoenn.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 2716,
    stardust: 2294,
    xp: 206,
    ia: "aleatoria",
    time: [
      { speciesId: 782, nome: "Jangmo-o", level: 34 },
      { speciesId: 367, nome: "Huntail", level: 43 },
      { speciesId: 109, nome: "Koffing", level: 32 },
      { speciesId: 622, nome: "Golett", level: 33 },
      { speciesId: 371, nome: "Bagon", level: 31 }
    ]
  },

  {
    id: "ash-johto",
    nome: "Ash-johto",
    imagem: "/images/trainers/ash-johto.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 1215,
    stardust: 4859,
    xp: 467,
    ia: "agressiva",
    time: [
      { speciesId: 877, nome: "Morpeko-full-belly", level: 7 },
      { speciesId: 252, nome: "Treecko", level: 11 }
    ]
  },

  {
    id: "ash-kalos",
    nome: "Ash-kalos",
    imagem: "/images/trainers/ash-kalos.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 758,
    stardust: 1403,
    xp: 118,
    ia: "defensiva",
    time: [
      { speciesId: 953, nome: "Rellor", level: 37 },
      { speciesId: 506, nome: "Lillipup", level: 38 }
    ]
  },

  {
    id: "ash-sinnoh",
    nome: "Ash-sinnoh",
    imagem: "/images/trainers/ash-sinnoh.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 2104,
    stardust: 3639,
    xp: 223,
    ia: "aleatoria",
    time: [
      { speciesId: 200, nome: "Misdreavus", level: 21 },
      { speciesId: 9, nome: "Blastoise", level: 27 },
      { speciesId: 697, nome: "Tyrantrum", level: 21 }
    ]
  },

  {
    id: "ash-unova",
    nome: "Ash-unova",
    imagem: "/images/trainers/ash-unova.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 2344,
    stardust: 4593,
    xp: 271,
    ia: "estrategica",
    time: [
      { speciesId: 727, nome: "Incineroar", level: 16 },
      { speciesId: 526, nome: "Gigalith", level: 15 },
      { speciesId: 52, nome: "Meowth", level: 16 }
    ]
  },

  {
    id: "ash",
    nome: "Ash",
    imagem: "/images/trainers/ash.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 2650,
    stardust: 1257,
    xp: 126,
    ia: "estrategica",
    time: [
      { speciesId: 739, nome: "Crabrawler", level: 41 }
    ]
  },

  {
    id: "atticus",
    nome: "Atticus",
    imagem: "/images/trainers/atticus.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 1054,
    stardust: 5364,
    xp: 128,
    ia: "estrategica",
    time: [
      { speciesId: 415, nome: "Combee", level: 30 },
      { speciesId: 198, nome: "Murkrow", level: 25 },
      { speciesId: 296, nome: "Makuhita", level: 29 }
    ]
  },

  {
    id: "avery",
    nome: "Avery",
    imagem: "/images/trainers/avery.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 1694,
    stardust: 3262,
    xp: 269,
    ia: "defensiva",
    time: [
      { speciesId: 106, nome: "Hitmonlee", level: 22 },
      { speciesId: 705, nome: "Sliggoo", level: 23 },
      { speciesId: 186, nome: "Politoed", level: 22 }
    ]
  },

  {
    id: "az-lza",
    nome: "Az-lza",
    imagem: "/images/trainers/az-lza.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 522,
    stardust: 4553,
    xp: 169,
    ia: "estrategica",
    time: [
      { speciesId: 982, nome: "Dudunsparce-two-segment", level: 21 },
      { speciesId: 40, nome: "Wigglytuff", level: 29 }
    ]
  },

  {
    id: "az",
    nome: "Az",
    imagem: "/images/trainers/az.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 1493,
    stardust: 2386,
    xp: 225,
    ia: "defensiva",
    time: [
      { speciesId: 92, nome: "Gastly", level: 11 }
    ]
  },

  {
    id: "backers",
    nome: "Backers",
    imagem: "/images/trainers/backers.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 120,
    stardust: 2499,
    xp: 215,
    ia: "agressiva",
    time: [
      { speciesId: 28, nome: "Sandslash", level: 19 },
      { speciesId: 350, nome: "Milotic", level: 19 }
    ]
  },

  {
    id: "backersf",
    nome: "Backersf",
    imagem: "/images/trainers/backersf.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 1047,
    stardust: 3868,
    xp: 365,
    ia: "agressiva",
    time: [
      { speciesId: 596, nome: "Galvantula", level: 19 },
      { speciesId: 402, nome: "Kricketune", level: 14 }
    ]
  },

  {
    id: "backpacker-gen6",
    nome: "Backpacker-gen6",
    imagem: "/images/trainers/backpacker-gen6.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 2819,
    stardust: 5189,
    xp: 426,
    ia: "estrategica",
    time: [
      { speciesId: 683, nome: "Aromatisse", level: 19 }
    ]
  },

  {
    id: "backpacker-gen8",
    nome: "Backpacker-gen8",
    imagem: "/images/trainers/backpacker-gen8.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 343,
    stardust: 2099,
    xp: 161,
    ia: "aleatoria",
    time: [
      { speciesId: 150, nome: "Mewtwo", level: 2 },
      { speciesId: 969, nome: "Glimmet", level: 10 }
    ]
  },

  {
    id: "backpacker-gen9",
    nome: "Backpacker-gen9",
    imagem: "/images/trainers/backpacker-gen9.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 1615,
    stardust: 2040,
    xp: 416,
    ia: "defensiva",
    time: [
      { speciesId: 871, nome: "Pincurchin", level: 32 },
      { speciesId: 207, nome: "Gligar", level: 43 },
      { speciesId: 65, nome: "Alakazam", level: 31 },
      { speciesId: 607, nome: "Litwick", level: 39 }
    ]
  },

  {
    id: "backpacker",
    nome: "Backpacker",
    imagem: "/images/trainers/backpacker.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 1542,
    stardust: 146,
    xp: 225,
    ia: "estrategica",
    time: [
      { speciesId: 506, nome: "Lillipup", level: 29 },
      { speciesId: 168, nome: "Ariados", level: 26 },
      { speciesId: 20, nome: "Raticate", level: 23 }
    ]
  },

  {
    id: "backpackerf",
    nome: "Backpackerf",
    imagem: "/images/trainers/backpackerf.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 2790,
    stardust: 354,
    xp: 144,
    ia: "agressiva",
    time: [
      { speciesId: 984, nome: "Great-tusk", level: 30 }
    ]
  },

  {
    id: "baker",
    nome: "Baker",
    imagem: "/images/trainers/baker.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 1367,
    stardust: 3565,
    xp: 404,
    ia: "defensiva",
    time: [
      { speciesId: 971, nome: "Greavard", level: 31 },
      { speciesId: 212, nome: "Scizor", level: 41 },
      { speciesId: 206, nome: "Dunsparce", level: 45 }
    ]
  },

  {
    id: "ballguy",
    nome: "Ballguy",
    imagem: "/images/trainers/ballguy.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "dificil",
    recompensa: 1772,
    stardust: 869,
    xp: 323,
    ia: "aleatoria",
    time: [
      { speciesId: 177, nome: "Natu", level: 22 },
      { speciesId: 847, nome: "Barraskewda", level: 22 },
      { speciesId: 818, nome: "Inteleon", level: 30 },
      { speciesId: 30, nome: "Nidorina", level: 26 }
    ]
  },

  {
    id: "baoba",
    nome: "Baoba",
    imagem: "/images/trainers/baoba.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 890,
    stardust: 4297,
    xp: 242,
    ia: "estrategica",
    time: [
      { speciesId: 886, nome: "Drakloak", level: 10 },
      { speciesId: 707, nome: "Klefki", level: 12 }
    ]
  },

  {
    id: "barry-masters",
    nome: "Barry-masters",
    imagem: "/images/trainers/barry-masters.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 494,
    stardust: 3365,
    xp: 419,
    ia: "defensiva",
    time: [
      { speciesId: 355, nome: "Duskull", level: 19 },
      { speciesId: 791, nome: "Solgaleo", level: 18 },
      { speciesId: 1023, nome: "Iron-crown", level: 17 }
    ]
  },

  {
    id: "barry",
    nome: "Barry",
    imagem: "/images/trainers/barry.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 2574,
    stardust: 849,
    xp: 482,
    ia: "aleatoria",
    time: [
      { speciesId: 505, nome: "Watchog", level: 38 },
      { speciesId: 749, nome: "Mudbray", level: 43 },
      { speciesId: 665, nome: "Spewpa", level: 44 },
      { speciesId: 308, nome: "Medicham", level: 33 }
    ]
  },

  {
    id: "battlegirl-gen3",
    nome: "Battlegirl-gen3",
    imagem: "/images/trainers/battlegirl-gen3.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 1889,
    stardust: 951,
    xp: 169,
    ia: "aleatoria",
    time: [
      { speciesId: 518, nome: "Musharna", level: 17 }
    ]
  },

  {
    id: "battlegirl-gen4",
    nome: "Battlegirl-gen4",
    imagem: "/images/trainers/battlegirl-gen4.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 597,
    stardust: 2871,
    xp: 248,
    ia: "aleatoria",
    time: [
      { speciesId: 457, nome: "Lumineon", level: 35 },
      { speciesId: 998, nome: "Baxcalibur", level: 44 },
      { speciesId: 884, nome: "Duraludon", level: 42 },
      { speciesId: 604, nome: "Eelektross", level: 38 },
      { speciesId: 42, nome: "Golbat", level: 43 }
    ]
  },

  {
    id: "battlegirl-gen6",
    nome: "Battlegirl-gen6",
    imagem: "/images/trainers/battlegirl-gen6.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 2240,
    stardust: 4750,
    xp: 283,
    ia: "agressiva",
    time: [
      { speciesId: 32, nome: "Nidoran-m", level: 6 },
      { speciesId: 946, nome: "Bramblin", level: 3 }
    ]
  },

  {
    id: "battlegirl-gen6xy",
    nome: "Battlegirl-gen6xy",
    imagem: "/images/trainers/battlegirl-gen6xy.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 564,
    stardust: 5231,
    xp: 112,
    ia: "estrategica",
    time: [
      { speciesId: 495, nome: "Snivy", level: 13 }
    ]
  },

  {
    id: "battlegirl",
    nome: "Battlegirl",
    imagem: "/images/trainers/battlegirl.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 2162,
    stardust: 4614,
    xp: 169,
    ia: "agressiva",
    time: [
      { speciesId: 971, nome: "Greavard", level: 13 },
      { speciesId: 258, nome: "Mudkip", level: 18 }
    ]
  },

  {
    id: "bea-masters",
    nome: "Bea-masters",
    imagem: "/images/trainers/bea-masters.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 1859,
    stardust: 1858,
    xp: 458,
    ia: "estrategica",
    time: [
      { speciesId: 351, nome: "Castform", level: 30 },
      { speciesId: 303, nome: "Mawile", level: 22 },
      { speciesId: 664, nome: "Scatterbug", level: 26 },
      { speciesId: 551, nome: "Sandile", level: 30 }
    ]
  },

  {
    id: "bea",
    nome: "Bea",
    imagem: "/images/trainers/bea.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 1790,
    stardust: 1226,
    xp: 192,
    ia: "defensiva",
    time: [
      { speciesId: 81, nome: "Magnemite", level: 13 },
      { speciesId: 741, nome: "Oricorio-baile", level: 19 },
      { speciesId: 55, nome: "Golduck", level: 16 }
    ]
  },

  {
    id: "beauty-gen1",
    nome: "Beauty-gen1",
    imagem: "/images/trainers/beauty-gen1.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 1546,
    stardust: 3352,
    xp: 132,
    ia: "estrategica",
    time: [
      { speciesId: 850, nome: "Sizzlipede", level: 30 },
      { speciesId: 336, nome: "Seviper", level: 28 },
      { speciesId: 798, nome: "Kartana", level: 28 },
      { speciesId: 1021, nome: "Raging-bolt", level: 30 }
    ]
  },

  {
    id: "beauty-gen1rb",
    nome: "Beauty-gen1rb",
    imagem: "/images/trainers/beauty-gen1rb.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 1769,
    stardust: 4719,
    xp: 259,
    ia: "defensiva",
    time: [
      { speciesId: 502, nome: "Dewott", level: 17 },
      { speciesId: 820, nome: "Greedent", level: 14 }
    ]
  },

  {
    id: "beauty-gen2",
    nome: "Beauty-gen2",
    imagem: "/images/trainers/beauty-gen2.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "dificil",
    recompensa: 2468,
    stardust: 4236,
    xp: 377,
    ia: "agressiva",
    time: [
      { speciesId: 279, nome: "Pelipper", level: 30 },
      { speciesId: 343, nome: "Baltoy", level: 23 },
      { speciesId: 995, nome: "Iron-thorns", level: 27 },
      { speciesId: 132, nome: "Ditto", level: 28 }
    ]
  },

  {
    id: "beauty-gen2jp",
    nome: "Beauty-gen2jp",
    imagem: "/images/trainers/beauty-gen2jp.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 2196,
    stardust: 2929,
    xp: 220,
    ia: "defensiva",
    time: [
      { speciesId: 704, nome: "Goomy", level: 42 },
      { speciesId: 876, nome: "Indeedee-male", level: 45 }
    ]
  },

  {
    id: "beauty-gen3",
    nome: "Beauty-gen3",
    imagem: "/images/trainers/beauty-gen3.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 1669,
    stardust: 4426,
    xp: 65,
    ia: "estrategica",
    time: [
      { speciesId: 724, nome: "Decidueye", level: 27 },
      { speciesId: 160, nome: "Feraligatr", level: 25 },
      { speciesId: 966, nome: "Revavroom", level: 30 },
      { speciesId: 305, nome: "Lairon", level: 29 }
    ]
  },

  {
    id: "beauty-gen3rs",
    nome: "Beauty-gen3rs",
    imagem: "/images/trainers/beauty-gen3rs.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 1663,
    stardust: 4164,
    xp: 339,
    ia: "agressiva",
    time: [
      { speciesId: 449, nome: "Hippopotas", level: 10 }
    ]
  },

  {
    id: "beauty-gen4dp",
    nome: "Beauty-gen4dp",
    imagem: "/images/trainers/beauty-gen4dp.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 1847,
    stardust: 5222,
    xp: 111,
    ia: "defensiva",
    time: [
      { speciesId: 987, nome: "Flutter-mane", level: 3 },
      { speciesId: 508, nome: "Stoutland", level: 6 }
    ]
  },

  {
    id: "beauty-gen5bw2",
    nome: "Beauty-gen5bw2",
    imagem: "/images/trainers/beauty-gen5bw2.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 538,
    stardust: 470,
    xp: 477,
    ia: "aleatoria",
    time: [
      { speciesId: 269, nome: "Dustox", level: 30 },
      { speciesId: 561, nome: "Sigilyph", level: 28 }
    ]
  },

  {
    id: "beauty-gen6",
    nome: "Beauty-gen6",
    imagem: "/images/trainers/beauty-gen6.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 2830,
    stardust: 2194,
    xp: 486,
    ia: "aleatoria",
    time: [
      { speciesId: 457, nome: "Lumineon", level: 27 },
      { speciesId: 447, nome: "Riolu", level: 24 }
    ]
  },

  {
    id: "beauty-gen6xy",
    nome: "Beauty-gen6xy",
    imagem: "/images/trainers/beauty-gen6xy.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 2830,
    stardust: 3675,
    xp: 380,
    ia: "agressiva",
    time: [
      { speciesId: 131, nome: "Lapras", level: 32 },
      { speciesId: 690, nome: "Skrelp", level: 37 },
      { speciesId: 671, nome: "Florges", level: 30 },
      { speciesId: 166, nome: "Ledian", level: 45 }
    ]
  },

  {
    id: "beauty-gen7",
    nome: "Beauty-gen7",
    imagem: "/images/trainers/beauty-gen7.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 1106,
    stardust: 2740,
    xp: 496,
    ia: "defensiva",
    time: [
      { speciesId: 616, nome: "Shelmet", level: 41 },
      { speciesId: 17, nome: "Pidgeotto", level: 41 },
      { speciesId: 303, nome: "Mawile", level: 38 },
      { speciesId: 269, nome: "Dustox", level: 31 }
    ]
  },

  {
    id: "beauty-gen8",
    nome: "Beauty-gen8",
    imagem: "/images/trainers/beauty-gen8.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 1841,
    stardust: 5263,
    xp: 209,
    ia: "aleatoria",
    time: [
      { speciesId: 446, nome: "Munchlax", level: 19 }
    ]
  },

  {
    id: "beauty-gen9",
    nome: "Beauty-gen9",
    imagem: "/images/trainers/beauty-gen9.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 2811,
    stardust: 4967,
    xp: 263,
    ia: "estrategica",
    time: [
      { speciesId: 62, nome: "Poliwrath", level: 3 },
      { speciesId: 10, nome: "Caterpie", level: 10 }
    ]
  },

  {
    id: "beauty-masters",
    nome: "Beauty-masters",
    imagem: "/images/trainers/beauty-masters.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 640,
    stardust: 3712,
    xp: 311,
    ia: "agressiva",
    time: [
      { speciesId: 405, nome: "Luxray", level: 4 }
    ]
  },

  {
    id: "beauty",
    nome: "Beauty",
    imagem: "/images/trainers/beauty.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 2259,
    stardust: 4273,
    xp: 275,
    ia: "aleatoria",
    time: [
      { speciesId: 907, nome: "Floragato", level: 13 },
      { speciesId: 452, nome: "Drapion", level: 14 },
      { speciesId: 523, nome: "Zebstrika", level: 18 }
    ]
  },

  {
    id: "bede-leader",
    nome: "Bede-leader",
    imagem: "/images/trainers/bede-leader.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 2902,
    stardust: 360,
    xp: 298,
    ia: "aleatoria",
    time: [
      { speciesId: 149, nome: "Dragonite", level: 44 }
    ]
  },

  {
    id: "bede-masters",
    nome: "Bede-masters",
    imagem: "/images/trainers/bede-masters.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 468,
    stardust: 4916,
    xp: 465,
    ia: "estrategica",
    time: [
      { speciesId: 23, nome: "Ekans", level: 11 }
    ]
  },

  {
    id: "bede",
    nome: "Bede",
    imagem: "/images/trainers/bede.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 1915,
    stardust: 1098,
    xp: 177,
    ia: "defensiva",
    time: [
      { speciesId: 195, nome: "Quagsire", level: 29 },
      { speciesId: 590, nome: "Foongus", level: 29 },
      { speciesId: 959, nome: "Tinkaton", level: 26 },
      { speciesId: 921, nome: "Pawmi", level: 25 }
    ]
  },

  {
    id: "bellelba",
    nome: "Bellelba",
    imagem: "/images/trainers/bellelba.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 1517,
    stardust: 2812,
    xp: 121,
    ia: "agressiva",
    time: [
      { speciesId: 615, nome: "Cryogonal", level: 14 },
      { speciesId: 595, nome: "Joltik", level: 16 },
      { speciesId: 287, nome: "Slakoth", level: 19 }
    ]
  },

  {
    id: "bellepa",
    nome: "Bellepa",
    imagem: "/images/trainers/bellepa.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 2971,
    stardust: 4423,
    xp: 415,
    ia: "aleatoria",
    time: [
      { speciesId: 319, nome: "Sharpedo", level: 3 },
      { speciesId: 121, nome: "Starmie", level: 2 }
    ]
  },

  {
    id: "bellhop",
    nome: "Bellhop",
    imagem: "/images/trainers/bellhop.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 1688,
    stardust: 5171,
    xp: 138,
    ia: "agressiva",
    time: [
      { speciesId: 996, nome: "Frigibax", level: 25 },
      { speciesId: 179, nome: "Mareep", level: 22 }
    ]
  },

  {
    id: "bellis",
    nome: "Bellis",
    imagem: "/images/trainers/bellis.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 2521,
    stardust: 4643,
    xp: 450,
    ia: "defensiva",
    time: [
      { speciesId: 725, nome: "Litten", level: 41 },
      { speciesId: 585, nome: "Deerling", level: 32 }
    ]
  },

  {
    id: "benga",
    nome: "Benga",
    imagem: "/images/trainers/benga.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 1581,
    stardust: 1664,
    xp: 233,
    ia: "aleatoria",
    time: [
      { speciesId: 606, nome: "Beheeyem", level: 40 },
      { speciesId: 164, nome: "Noctowl", level: 44 },
      { speciesId: 10, nome: "Caterpie", level: 37 },
      { speciesId: 413, nome: "Wormadam-plant", level: 40 },
      { speciesId: 420, nome: "Cherubi", level: 44 }
    ]
  },

  {
    id: "beni-ninja",
    nome: "Beni-ninja",
    imagem: "/images/trainers/beni-ninja.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 1634,
    stardust: 766,
    xp: 282,
    ia: "aleatoria",
    time: [
      { speciesId: 594, nome: "Alomomola", level: 39 }
    ]
  },

  {
    id: "beni",
    nome: "Beni",
    imagem: "/images/trainers/beni.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 2948,
    stardust: 4555,
    xp: 205,
    ia: "aleatoria",
    time: [
      { speciesId: 870, nome: "Falinks", level: 34 }
    ]
  },

  {
    id: "bertha",
    nome: "Bertha",
    imagem: "/images/trainers/bertha.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 1856,
    stardust: 1462,
    xp: 383,
    ia: "estrategica",
    time: [
      { speciesId: 772, nome: "Type-null", level: 14 },
      { speciesId: 642, nome: "Thundurus-incarnate", level: 16 }
    ]
  },

  {
    id: "bianca-masters",
    nome: "Bianca-masters",
    imagem: "/images/trainers/bianca-masters.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 2157,
    stardust: 3486,
    xp: 209,
    ia: "aleatoria",
    time: [
      { speciesId: 906, nome: "Sprigatito", level: 30 },
      { speciesId: 670, nome: "Floette", level: 30 },
      { speciesId: 491, nome: "Darkrai", level: 21 }
    ]
  },

  {
    id: "bianca-pwt",
    nome: "Bianca-pwt",
    imagem: "/images/trainers/bianca-pwt.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 562,
    stardust: 5044,
    xp: 110,
    ia: "defensiva",
    time: [
      { speciesId: 405, nome: "Luxray", level: 2 },
      { speciesId: 280, nome: "Ralts", level: 2 }
    ]
  },

  {
    id: "bianca",
    nome: "Bianca",
    imagem: "/images/trainers/bianca.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 2065,
    stardust: 3091,
    xp: 387,
    ia: "aleatoria",
    time: [
      { speciesId: 429, nome: "Mismagius", level: 14 },
      { speciesId: 203, nome: "Girafarig", level: 16 },
      { speciesId: 182, nome: "Bellossom", level: 17 }
    ]
  },

  {
    id: "biker-gen1",
    nome: "Biker-gen1",
    imagem: "/images/trainers/biker-gen1.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 2290,
    stardust: 3726,
    xp: 99,
    ia: "defensiva",
    time: [
      { speciesId: 564, nome: "Tirtouga", level: 33 },
      { speciesId: 437, nome: "Bronzong", level: 38 },
      { speciesId: 441, nome: "Chatot", level: 39 },
      { speciesId: 338, nome: "Solrock", level: 41 },
      { speciesId: 982, nome: "Dudunsparce-two-segment", level: 39 }
    ]
  },

  {
    id: "biker-gen1rb",
    nome: "Biker-gen1rb",
    imagem: "/images/trainers/biker-gen1rb.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 823,
    stardust: 3559,
    xp: 413,
    ia: "agressiva",
    time: [
      { speciesId: 480, nome: "Uxie", level: 18 },
      { speciesId: 753, nome: "Fomantis", level: 14 }
    ]
  },

  {
    id: "biker-gen2",
    nome: "Biker-gen2",
    imagem: "/images/trainers/biker-gen2.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 2939,
    stardust: 1458,
    xp: 91,
    ia: "defensiva",
    time: [
      { speciesId: 114, nome: "Tangela", level: 3 }
    ]
  },

  {
    id: "biker-gen3",
    nome: "Biker-gen3",
    imagem: "/images/trainers/biker-gen3.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 1024,
    stardust: 1252,
    xp: 352,
    ia: "agressiva",
    time: [
      { speciesId: 351, nome: "Castform", level: 14 },
      { speciesId: 799, nome: "Guzzlord", level: 16 }
    ]
  },

  {
    id: "biker-gen4",
    nome: "Biker-gen4",
    imagem: "/images/trainers/biker-gen4.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 1005,
    stardust: 1170,
    xp: 488,
    ia: "agressiva",
    time: [
      { speciesId: 373, nome: "Salamence", level: 45 }
    ]
  },

  {
    id: "biker",
    nome: "Biker",
    imagem: "/images/trainers/biker.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "dificil",
    recompensa: 2179,
    stardust: 4600,
    xp: 218,
    ia: "defensiva",
    time: [
      { speciesId: 160, nome: "Feraligatr", level: 26 },
      { speciesId: 525, nome: "Boldore", level: 24 }
    ]
  },

  {
    id: "bill-gen3",
    nome: "Bill-gen3",
    imagem: "/images/trainers/bill-gen3.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 1178,
    stardust: 2221,
    xp: 148,
    ia: "aleatoria",
    time: [
      { speciesId: 87, nome: "Dewgong", level: 34 },
      { speciesId: 852, nome: "Clobbopus", level: 36 },
      { speciesId: 649, nome: "Genesect", level: 32 },
      { speciesId: 82, nome: "Magneton", level: 45 },
      { speciesId: 423, nome: "Gastrodon", level: 35 }
    ]
  },

  {
    id: "bill",
    nome: "Bill",
    imagem: "/images/trainers/bill.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 2285,
    stardust: 2268,
    xp: 370,
    ia: "aleatoria",
    time: [
      { speciesId: 291, nome: "Ninjask", level: 29 },
      { speciesId: 106, nome: "Hitmonlee", level: 22 },
      { speciesId: 737, nome: "Charjabug", level: 29 },
      { speciesId: 196, nome: "Espeon", level: 25 }
    ]
  },

  {
    id: "birch-gen3",
    nome: "Birch-gen3",
    imagem: "/images/trainers/birch-gen3.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 1550,
    stardust: 1779,
    xp: 191,
    ia: "aleatoria",
    time: [
      { speciesId: 234, nome: "Stantler", level: 7 }
    ]
  },

  {
    id: "birch",
    nome: "Birch",
    imagem: "/images/trainers/birch.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 719,
    stardust: 527,
    xp: 258,
    ia: "defensiva",
    time: [
      { speciesId: 757, nome: "Salandit", level: 15 },
      { speciesId: 930, nome: "Arboliva", level: 17 },
      { speciesId: 686, nome: "Inkay", level: 15 }
    ]
  },

  {
    id: "birdkeeper-gen1",
    nome: "Birdkeeper-gen1",
    imagem: "/images/trainers/birdkeeper-gen1.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 1284,
    stardust: 2740,
    xp: 358,
    ia: "defensiva",
    time: [
      { speciesId: 918, nome: "Spidops", level: 29 }
    ]
  },

  {
    id: "birdkeeper-gen1rb",
    nome: "Birdkeeper-gen1rb",
    imagem: "/images/trainers/birdkeeper-gen1rb.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 941,
    stardust: 3488,
    xp: 55,
    ia: "estrategica",
    time: [
      { speciesId: 334, nome: "Altaria", level: 19 },
      { speciesId: 280, nome: "Ralts", level: 17 }
    ]
  },

  {
    id: "birdkeeper-gen2",
    nome: "Birdkeeper-gen2",
    imagem: "/images/trainers/birdkeeper-gen2.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 876,
    stardust: 1809,
    xp: 308,
    ia: "defensiva",
    time: [
      { speciesId: 416, nome: "Vespiquen", level: 14 },
      { speciesId: 902, nome: "Basculegion-male", level: 15 }
    ]
  },

  {
    id: "birdkeeper-gen3",
    nome: "Birdkeeper-gen3",
    imagem: "/images/trainers/birdkeeper-gen3.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 1046,
    stardust: 929,
    xp: 469,
    ia: "aleatoria",
    time: [
      { speciesId: 106, nome: "Hitmonlee", level: 7 }
    ]
  },

  {
    id: "birdkeeper-gen3rs",
    nome: "Birdkeeper-gen3rs",
    imagem: "/images/trainers/birdkeeper-gen3rs.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 806,
    stardust: 4444,
    xp: 189,
    ia: "estrategica",
    time: [
      { speciesId: 897, nome: "Spectrier", level: 28 },
      { speciesId: 449, nome: "Hippopotas", level: 29 },
      { speciesId: 282, nome: "Gardevoir", level: 22 }
    ]
  },

  {
    id: "birdkeeper-gen4dp",
    nome: "Birdkeeper-gen4dp",
    imagem: "/images/trainers/birdkeeper-gen4dp.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 2102,
    stardust: 922,
    xp: 108,
    ia: "aleatoria",
    time: [
      { speciesId: 878, nome: "Cufant", level: 9 }
    ]
  },

  {
    id: "birdkeeper-gen6",
    nome: "Birdkeeper-gen6",
    imagem: "/images/trainers/birdkeeper-gen6.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 402,
    stardust: 2251,
    xp: 367,
    ia: "defensiva",
    time: [
      { speciesId: 219, nome: "Magcargo", level: 12 }
    ]
  },

  {
    id: "birdkeeper",
    nome: "Birdkeeper",
    imagem: "/images/trainers/birdkeeper.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "dificil",
    recompensa: 617,
    stardust: 1414,
    xp: 394,
    ia: "estrategica",
    time: [
      { speciesId: 880, nome: "Dracozolt", level: 26 },
      { speciesId: 938, nome: "Tadbulb", level: 30 },
      { speciesId: 296, nome: "Makuhita", level: 30 },
      { speciesId: 167, nome: "Spinarak", level: 23 }
    ]
  },

  {
    id: "blackbelt-gen1",
    nome: "Blackbelt-gen1",
    imagem: "/images/trainers/blackbelt-gen1.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 2117,
    stardust: 4398,
    xp: 349,
    ia: "agressiva",
    time: [
      { speciesId: 408, nome: "Cranidos", level: 5 }
    ]
  },

  {
    id: "blackbelt-gen1rb",
    nome: "Blackbelt-gen1rb",
    imagem: "/images/trainers/blackbelt-gen1rb.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 2206,
    stardust: 1555,
    xp: 305,
    ia: "defensiva",
    time: [
      { speciesId: 435, nome: "Skuntank", level: 23 },
      { speciesId: 336, nome: "Seviper", level: 28 }
    ]
  },

  {
    id: "blackbelt-gen2",
    nome: "Blackbelt-gen2",
    imagem: "/images/trainers/blackbelt-gen2.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 1937,
    stardust: 2269,
    xp: 77,
    ia: "defensiva",
    time: [
      { speciesId: 495, nome: "Snivy", level: 23 }
    ]
  },

  {
    id: "blackbelt-gen3",
    nome: "Blackbelt-gen3",
    imagem: "/images/trainers/blackbelt-gen3.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 1821,
    stardust: 389,
    xp: 142,
    ia: "aleatoria",
    time: [
      { speciesId: 834, nome: "Drednaw", level: 27 },
      { speciesId: 433, nome: "Chingling", level: 26 }
    ]
  },

  {
    id: "blackbelt-gen3rs",
    nome: "Blackbelt-gen3rs",
    imagem: "/images/trainers/blackbelt-gen3rs.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 2794,
    stardust: 3590,
    xp: 230,
    ia: "aleatoria",
    time: [
      { speciesId: 369, nome: "Relicanth", level: 26 },
      { speciesId: 124, nome: "Jynx", level: 28 },
      { speciesId: 665, nome: "Spewpa", level: 21 },
      { speciesId: 729, nome: "Brionne", level: 26 }
    ]
  },

  {
    id: "blackbelt-gen4",
    nome: "Blackbelt-gen4",
    imagem: "/images/trainers/blackbelt-gen4.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 1042,
    stardust: 4822,
    xp: 162,
    ia: "agressiva",
    time: [
      { speciesId: 481, nome: "Mesprit", level: 12 }
    ]
  },

  {
    id: "blackbelt-gen4dp",
    nome: "Blackbelt-gen4dp",
    imagem: "/images/trainers/blackbelt-gen4dp.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 1074,
    stardust: 3359,
    xp: 190,
    ia: "aleatoria",
    time: [
      { speciesId: 471, nome: "Glaceon", level: 24 }
    ]
  },

  {
    id: "blackbelt-gen6",
    nome: "Blackbelt-gen6",
    imagem: "/images/trainers/blackbelt-gen6.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 859,
    stardust: 1831,
    xp: 431,
    ia: "agressiva",
    time: [
      { speciesId: 478, nome: "Froslass", level: 31 }
    ]
  },

  {
    id: "blackbelt-gen7",
    nome: "Blackbelt-gen7",
    imagem: "/images/trainers/blackbelt-gen7.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 172,
    stardust: 1162,
    xp: 231,
    ia: "estrategica",
    time: [
      { speciesId: 37, nome: "Vulpix", level: 34 }
    ]
  },

  {
    id: "blackbelt-gen8",
    nome: "Blackbelt-gen8",
    imagem: "/images/trainers/blackbelt-gen8.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 1390,
    stardust: 4570,
    xp: 221,
    ia: "defensiva",
    time: [
      { speciesId: 937, nome: "Ceruledge", level: 19 }
    ]
  },

  {
    id: "blackbelt-gen9",
    nome: "Blackbelt-gen9",
    imagem: "/images/trainers/blackbelt-gen9.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 750,
    stardust: 696,
    xp: 100,
    ia: "agressiva",
    time: [
      { speciesId: 847, nome: "Barraskewda", level: 33 },
      { speciesId: 115, nome: "Kangaskhan", level: 45 },
      { speciesId: 433, nome: "Chingling", level: 43 },
      { speciesId: 951, nome: "Capsakid", level: 42 }
    ]
  },

  {
    id: "blackbelt",
    nome: "Blackbelt",
    imagem: "/images/trainers/blackbelt.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 2575,
    stardust: 3567,
    xp: 85,
    ia: "aleatoria",
    time: [
      { speciesId: 977, nome: "Dondozo", level: 17 },
      { speciesId: 313, nome: "Volbeat", level: 16 },
      { speciesId: 485, nome: "Heatran", level: 18 }
    ]
  },

  {
    id: "blaine-gen1",
    nome: "Blaine-gen1",
    imagem: "/images/trainers/blaine-gen1.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 865,
    stardust: 3963,
    xp: 187,
    ia: "estrategica",
    time: [
      { speciesId: 764, nome: "Comfey", level: 18 }
    ]
  },

  {
    id: "blaine-gen1rb",
    nome: "Blaine-gen1rb",
    imagem: "/images/trainers/blaine-gen1rb.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 1214,
    stardust: 5114,
    xp: 78,
    ia: "aleatoria",
    time: [
      { speciesId: 245, nome: "Suicune", level: 2 }
    ]
  },

  {
    id: "blaine-gen2",
    nome: "Blaine-gen2",
    imagem: "/images/trainers/blaine-gen2.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 2387,
    stardust: 4406,
    xp: 431,
    ia: "agressiva",
    time: [
      { speciesId: 968, nome: "Orthworm", level: 15 },
      { speciesId: 819, nome: "Skwovet", level: 14 }
    ]
  },

  {
    id: "blaine-gen3",
    nome: "Blaine-gen3",
    imagem: "/images/trainers/blaine-gen3.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 1310,
    stardust: 3646,
    xp: 239,
    ia: "defensiva",
    time: [
      { speciesId: 580, nome: "Ducklett", level: 28 },
      { speciesId: 397, nome: "Staravia", level: 25 }
    ]
  },

  {
    id: "blaine-lgpe",
    nome: "Blaine-lgpe",
    imagem: "/images/trainers/blaine-lgpe.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 1813,
    stardust: 686,
    xp: 426,
    ia: "estrategica",
    time: [
      { speciesId: 601, nome: "Klinklang", level: 9 },
      { speciesId: 544, nome: "Whirlipede", level: 7 }
    ]
  },

  {
    id: "blaine",
    nome: "Blaine",
    imagem: "/images/trainers/blaine.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 282,
    stardust: 3101,
    xp: 392,
    ia: "estrategica",
    time: [
      { speciesId: 348, nome: "Armaldo", level: 11 },
      { speciesId: 750, nome: "Mudsdale", level: 7 }
    ]
  },

  {
    id: "blanche-casual",
    nome: "Blanche-casual",
    imagem: "/images/trainers/blanche-casual.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 1120,
    stardust: 916,
    xp: 304,
    ia: "agressiva",
    time: [
      { speciesId: 606, nome: "Beheeyem", level: 30 },
      { speciesId: 596, nome: "Galvantula", level: 22 },
      { speciesId: 512, nome: "Simisage", level: 23 }
    ]
  },

  {
    id: "blanche",
    nome: "Blanche",
    imagem: "/images/trainers/blanche.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 2456,
    stardust: 2646,
    xp: 433,
    ia: "defensiva",
    time: [
      { speciesId: 259, nome: "Marshtomp", level: 36 },
      { speciesId: 718, nome: "Zygarde-50", level: 34 },
      { speciesId: 148, nome: "Dragonair", level: 30 },
      { speciesId: 44, nome: "Gloom", level: 35 }
    ]
  },

  {
    id: "blue-gen1",
    nome: "Blue-gen1",
    imagem: "/images/trainers/blue-gen1.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 2008,
    stardust: 222,
    xp: 263,
    ia: "defensiva",
    time: [
      { speciesId: 215, nome: "Sneasel", level: 35 },
      { speciesId: 82, nome: "Magneton", level: 30 },
      { speciesId: 820, nome: "Greedent", level: 30 },
      { speciesId: 671, nome: "Florges", level: 44 }
    ]
  },

  {
    id: "blue-gen1champion",
    nome: "Blue-gen1champion",
    imagem: "/images/trainers/blue-gen1champion.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 2756,
    stardust: 2776,
    xp: 301,
    ia: "defensiva",
    time: [
      { speciesId: 450, nome: "Hippowdon", level: 3 },
      { speciesId: 378, nome: "Regice", level: 4 }
    ]
  },

  {
    id: "blue-gen1rb",
    nome: "Blue-gen1rb",
    imagem: "/images/trainers/blue-gen1rb.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 1117,
    stardust: 2163,
    xp: 468,
    ia: "aleatoria",
    time: [
      { speciesId: 343, nome: "Baltoy", level: 33 },
      { speciesId: 541, nome: "Swadloon", level: 31 }
    ]
  },

  {
    id: "blue-gen1rbchampion",
    nome: "Blue-gen1rbchampion",
    imagem: "/images/trainers/blue-gen1rbchampion.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 2389,
    stardust: 4527,
    xp: 357,
    ia: "estrategica",
    time: [
      { speciesId: 303, nome: "Mawile", level: 33 },
      { speciesId: 80, nome: "Slowbro", level: 31 },
      { speciesId: 1012, nome: "Poltchageist", level: 31 }
    ]
  },

  {
    id: "blue-gen1rbtwo",
    nome: "Blue-gen1rbtwo",
    imagem: "/images/trainers/blue-gen1rbtwo.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 1798,
    stardust: 3645,
    xp: 179,
    ia: "aleatoria",
    time: [
      { speciesId: 433, nome: "Chingling", level: 18 },
      { speciesId: 358, nome: "Chimecho", level: 18 },
      { speciesId: 694, nome: "Helioptile", level: 13 }
    ]
  },

  {
    id: "blue-gen1two",
    nome: "Blue-gen1two",
    imagem: "/images/trainers/blue-gen1two.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 2128,
    stardust: 4852,
    xp: 471,
    ia: "aleatoria",
    time: [
      { speciesId: 738, nome: "Vikavolt", level: 8 },
      { speciesId: 202, nome: "Wobbuffet", level: 6 }
    ]
  },

  {
    id: "blue-gen2",
    nome: "Blue-gen2",
    imagem: "/images/trainers/blue-gen2.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 2560,
    stardust: 3530,
    xp: 433,
    ia: "aleatoria",
    time: [
      { speciesId: 701, nome: "Hawlucha", level: 20 },
      { speciesId: 368, nome: "Gorebyss", level: 15 }
    ]
  },

  {
    id: "blue-gen3",
    nome: "Blue-gen3",
    imagem: "/images/trainers/blue-gen3.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 1144,
    stardust: 5302,
    xp: 431,
    ia: "aleatoria",
    time: [
      { speciesId: 557, nome: "Dwebble", level: 28 }
    ]
  },

  {
    id: "blue-gen3champion",
    nome: "Blue-gen3champion",
    imagem: "/images/trainers/blue-gen3champion.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 2252,
    stardust: 770,
    xp: 74,
    ia: "aleatoria",
    time: [
      { speciesId: 294, nome: "Loudred", level: 30 },
      { speciesId: 752, nome: "Araquanid", level: 29 },
      { speciesId: 68, nome: "Machamp", level: 29 },
      { speciesId: 256, nome: "Combusken", level: 22 }
    ]
  },

  {
    id: "blue-gen3two",
    nome: "Blue-gen3two",
    imagem: "/images/trainers/blue-gen3two.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 2922,
    stardust: 4712,
    xp: 313,
    ia: "agressiva",
    time: [
      { speciesId: 820, nome: "Greedent", level: 11 }
    ]
  },

  {
    id: "blue-gen7",
    nome: "Blue-gen7",
    imagem: "/images/trainers/blue-gen7.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "facil",
    recompensa: 1622,
    stardust: 2225,
    xp: 310,
    ia: "aleatoria",
    time: [
      { speciesId: 63, nome: "Abra", level: 7 }
    ]
  },

  {
    id: "blue-lgpe",
    nome: "Blue-lgpe",
    imagem: "/images/trainers/blue-lgpe.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 2596,
    stardust: 4294,
    xp: 317,
    ia: "estrategica",
    time: [
      { speciesId: 506, nome: "Lillipup", level: 32 },
      { speciesId: 689, nome: "Barbaracle", level: 41 }
    ]
  },

  {
    id: "blue-masters",
    nome: "Blue-masters",
    imagem: "/images/trainers/blue-masters.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 1897,
    stardust: 4450,
    xp: 427,
    ia: "estrategica",
    time: [
      { speciesId: 805, nome: "Stakataka", level: 1 }
    ]
  },

  {
    id: "blue-masters2",
    nome: "Blue-masters2",
    imagem: "/images/trainers/blue-masters2.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 2146,
    stardust: 5281,
    xp: 162,
    ia: "defensiva",
    time: [
      { speciesId: 418, nome: "Buizel", level: 25 }
    ]
  },

  {
    id: "blue",
    nome: "Blue",
    imagem: "/images/trainers/blue.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 127,
    stardust: 3343,
    xp: 285,
    ia: "defensiva",
    time: [
      { speciesId: 524, nome: "Roggenrola", level: 24 },
      { speciesId: 481, nome: "Mesprit", level: 27 },
      { speciesId: 682, nome: "Spritzee", level: 28 }
    ]
  },

  {
    id: "boarder-gen2",
    nome: "Boarder-gen2",
    imagem: "/images/trainers/boarder-gen2.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 1039,
    stardust: 3153,
    xp: 167,
    ia: "defensiva",
    time: [
      { speciesId: 139, nome: "Omastar", level: 4 },
      { speciesId: 626, nome: "Bouffalant", level: 9 }
    ]
  },

  {
    id: "boarder",
    nome: "Boarder",
    imagem: "/images/trainers/boarder.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 2957,
    stardust: 3446,
    xp: 478,
    ia: "agressiva",
    time: [
      { speciesId: 737, nome: "Charjabug", level: 7 },
      { speciesId: 726, nome: "Torracat", level: 3 }
    ]
  },

  {
    id: "bodybuilder-gen9",
    nome: "Bodybuilder-gen9",
    imagem: "/images/trainers/bodybuilder-gen9.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 294,
    stardust: 5193,
    xp: 385,
    ia: "aleatoria",
    time: [
      { speciesId: 967, nome: "Cyclizar", level: 1 },
      { speciesId: 537, nome: "Seismitoad", level: 12 }
    ]
  },

  {
    id: "bodybuilderf-gen9",
    nome: "Bodybuilderf-gen9",
    imagem: "/images/trainers/bodybuilderf-gen9.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 1668,
    stardust: 4118,
    xp: 357,
    ia: "defensiva",
    time: [
      { speciesId: 181, nome: "Ampharos", level: 30 },
      { speciesId: 859, nome: "Impidimp", level: 28 }
    ]
  },

  {
    id: "brandon-gen3",
    nome: "Brandon-gen3",
    imagem: "/images/trainers/brandon-gen3.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 2944,
    stardust: 4220,
    xp: 475,
    ia: "aleatoria",
    time: [
      { speciesId: 93, nome: "Haunter", level: 5 }
    ]
  },

  {
    id: "brandon",
    nome: "Brandon",
    imagem: "/images/trainers/brandon.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 273,
    stardust: 1737,
    xp: 201,
    ia: "aleatoria",
    time: [
      { speciesId: 529, nome: "Drilbur", level: 38 },
      { speciesId: 245, nome: "Suicune", level: 42 },
      { speciesId: 953, nome: "Rellor", level: 40 },
      { speciesId: 793, nome: "Nihilego", level: 45 }
    ]
  },

  {
    id: "brassius",
    nome: "Brassius",
    imagem: "/images/trainers/brassius.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 517,
    stardust: 4430,
    xp: 205,
    ia: "agressiva",
    time: [
      { speciesId: 221, nome: "Piloswine", level: 6 }
    ]
  },

  {
    id: "brawly-gen3",
    nome: "Brawly-gen3",
    imagem: "/images/trainers/brawly-gen3.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 403,
    stardust: 2299,
    xp: 400,
    ia: "aleatoria",
    time: [
      { speciesId: 562, nome: "Yamask", level: 31 },
      { speciesId: 309, nome: "Electrike", level: 30 },
      { speciesId: 478, nome: "Froslass", level: 32 },
      { speciesId: 1, nome: "Bulbasaur", level: 32 },
      { speciesId: 409, nome: "Rampardos", level: 39 }
    ]
  },

  {
    id: "brawly-gen6",
    nome: "Brawly-gen6",
    imagem: "/images/trainers/brawly-gen6.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 2949,
    stardust: 3613,
    xp: 286,
    ia: "agressiva",
    time: [
      { speciesId: 624, nome: "Pawniard", level: 26 },
      { speciesId: 215, nome: "Sneasel", level: 25 },
      { speciesId: 314, nome: "Illumise", level: 24 }
    ]
  },

  {
    id: "brawly",
    nome: "Brawly",
    imagem: "/images/trainers/brawly.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 346,
    stardust: 3012,
    xp: 382,
    ia: "estrategica",
    time: [
      { speciesId: 63, nome: "Abra", level: 30 },
      { speciesId: 509, nome: "Purrloin", level: 34 },
      { speciesId: 578, nome: "Duosion", level: 36 },
      { speciesId: 85, nome: "Dodrio", level: 42 }
    ]
  },

  {
    id: "brendan-contest",
    nome: "Brendan-contest",
    imagem: "/images/trainers/brendan-contest.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "facil",
    recompensa: 570,
    stardust: 3591,
    xp: 264,
    ia: "aleatoria",
    time: [
      { speciesId: 897, nome: "Spectrier", level: 12 },
      { speciesId: 312, nome: "Minun", level: 4 }
    ]
  },

  {
    id: "brendan-e",
    nome: "Brendan-e",
    imagem: "/images/trainers/brendan-e.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 2280,
    stardust: 2588,
    xp: 167,
    ia: "estrategica",
    time: [
      { speciesId: 111, nome: "Rhyhorn", level: 30 },
      { speciesId: 734, nome: "Yungoos", level: 36 },
      { speciesId: 164, nome: "Noctowl", level: 43 },
      { speciesId: 673, nome: "Gogoat", level: 34 }
    ]
  },

  {
    id: "brendan-gen3",
    nome: "Brendan-gen3",
    imagem: "/images/trainers/brendan-gen3.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 2330,
    stardust: 5308,
    xp: 356,
    ia: "estrategica",
    time: [
      { speciesId: 631, nome: "Heatmor", level: 19 },
      { speciesId: 424, nome: "Ambipom", level: 20 }
    ]
  },

  {
    id: "brendan-gen3rs",
    nome: "Brendan-gen3rs",
    imagem: "/images/trainers/brendan-gen3rs.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 153,
    stardust: 671,
    xp: 247,
    ia: "aleatoria",
    time: [
      { speciesId: 437, nome: "Bronzong", level: 30 }
    ]
  },

  {
    id: "brendan-masters",
    nome: "Brendan-masters",
    imagem: "/images/trainers/brendan-masters.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 2883,
    stardust: 3820,
    xp: 435,
    ia: "estrategica",
    time: [
      { speciesId: 848, nome: "Toxel", level: 21 },
      { speciesId: 908, nome: "Meowscarada", level: 25 }
    ]
  },

  {
    id: "brendan-masters2",
    nome: "Brendan-masters2",
    imagem: "/images/trainers/brendan-masters2.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 466,
    stardust: 914,
    xp: 284,
    ia: "aleatoria",
    time: [
      { speciesId: 654, nome: "Braixen", level: 14 },
      { speciesId: 712, nome: "Bergmite", level: 19 },
      { speciesId: 802, nome: "Marshadow", level: 19 }
    ]
  },

  {
    id: "brendan-rs",
    nome: "Brendan-rs",
    imagem: "/images/trainers/brendan-rs.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 2681,
    stardust: 1286,
    xp: 146,
    ia: "aleatoria",
    time: [
      { speciesId: 346, nome: "Cradily", level: 4 },
      { speciesId: 385, nome: "Jirachi", level: 7 }
    ]
  },

  {
    id: "brendan",
    nome: "Brendan",
    imagem: "/images/trainers/brendan.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 1454,
    stardust: 3999,
    xp: 428,
    ia: "aleatoria",
    time: [
      { speciesId: 395, nome: "Empoleon", level: 23 },
      { speciesId: 469, nome: "Yanmega", level: 25 }
    ]
  },

  {
    id: "briar",
    nome: "Briar",
    imagem: "/images/trainers/briar.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 1435,
    stardust: 4012,
    xp: 479,
    ia: "defensiva",
    time: [
      { speciesId: 391, nome: "Monferno", level: 3 },
      { speciesId: 469, nome: "Yanmega", level: 6 }
    ]
  },

  {
    id: "brigette",
    nome: "Brigette",
    imagem: "/images/trainers/brigette.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 130,
    stardust: 3985,
    xp: 111,
    ia: "estrategica",
    time: [
      { speciesId: 1010, nome: "Iron-leaves", level: 30 },
      { speciesId: 643, nome: "Reshiram", level: 29 }
    ]
  },

  {
    id: "brock-gen1",
    nome: "Brock-gen1",
    imagem: "/images/trainers/brock-gen1.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 2435,
    stardust: 987,
    xp: 315,
    ia: "aleatoria",
    time: [
      { speciesId: 279, nome: "Pelipper", level: 18 },
      { speciesId: 572, nome: "Minccino", level: 13 }
    ]
  },

  {
    id: "brock-gen1rb",
    nome: "Brock-gen1rb",
    imagem: "/images/trainers/brock-gen1rb.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 2405,
    stardust: 1969,
    xp: 352,
    ia: "agressiva",
    time: [
      { speciesId: 110, nome: "Weezing", level: 12 },
      { speciesId: 600, nome: "Klang", level: 5 }
    ]
  },

  {
    id: "brock-gen2",
    nome: "Brock-gen2",
    imagem: "/images/trainers/brock-gen2.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "dificil",
    recompensa: 113,
    stardust: 1733,
    xp: 444,
    ia: "aleatoria",
    time: [
      { speciesId: 905, nome: "Enamorus-incarnate", level: 26 },
      { speciesId: 140, nome: "Kabuto", level: 26 },
      { speciesId: 721, nome: "Volcanion", level: 30 }
    ]
  },

  {
    id: "brock-gen3",
    nome: "Brock-gen3",
    imagem: "/images/trainers/brock-gen3.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 1663,
    stardust: 1721,
    xp: 156,
    ia: "agressiva",
    time: [
      { speciesId: 692, nome: "Clauncher", level: 11 }
    ]
  },

  {
    id: "brock-lgpe",
    nome: "Brock-lgpe",
    imagem: "/images/trainers/brock-lgpe.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "medio",
    recompensa: 947,
    stardust: 2515,
    xp: 419,
    ia: "defensiva",
    time: [
      { speciesId: 588, nome: "Karrablast", level: 20 }
    ]
  },

  {
    id: "brock-masters",
    nome: "Brock-masters",
    imagem: "/images/trainers/brock-masters.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 1348,
    stardust: 3767,
    xp: 230,
    ia: "defensiva",
    time: [
      { speciesId: 506, nome: "Lillipup", level: 44 }
    ]
  },

  {
    id: "brock",
    nome: "Brock",
    imagem: "/images/trainers/brock.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 242,
    stardust: 4251,
    xp: 468,
    ia: "aleatoria",
    time: [
      { speciesId: 29, nome: "Nidoran-f", level: 8 },
      { speciesId: 305, nome: "Lairon", level: 1 }
    ]
  },

  {
    id: "bruno-gen1",
    nome: "Bruno-gen1",
    imagem: "/images/trainers/bruno-gen1.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 1442,
    stardust: 4808,
    xp: 261,
    ia: "estrategica",
    time: [
      { speciesId: 503, nome: "Samurott", level: 19 },
      { speciesId: 727, nome: "Incineroar", level: 19 }
    ]
  },

  {
    id: "bruno-gen1rb",
    nome: "Bruno-gen1rb",
    imagem: "/images/trainers/bruno-gen1rb.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 1692,
    stardust: 3798,
    xp: 179,
    ia: "defensiva",
    time: [
      { speciesId: 308, nome: "Medicham", level: 39 }
    ]
  },

  {
    id: "bruno-gen2",
    nome: "Bruno-gen2",
    imagem: "/images/trainers/bruno-gen2.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "dificil",
    recompensa: 2909,
    stardust: 4509,
    xp: 136,
    ia: "aleatoria",
    time: [
      { speciesId: 694, nome: "Helioptile", level: 27 },
      { speciesId: 126, nome: "Magmar", level: 23 },
      { speciesId: 111, nome: "Rhyhorn", level: 21 },
      { speciesId: 408, nome: "Cranidos", level: 30 }
    ]
  },

  {
    id: "bruno-gen3",
    nome: "Bruno-gen3",
    imagem: "/images/trainers/bruno-gen3.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "dificil",
    recompensa: 1093,
    stardust: 4768,
    xp: 233,
    ia: "aleatoria",
    time: [
      { speciesId: 978, nome: "Tatsugiri-curly", level: 21 },
      { speciesId: 470, nome: "Leafeon", level: 29 },
      { speciesId: 869, nome: "Alcremie", level: 23 }
    ]
  },

  {
    id: "bruno",
    nome: "Bruno",
    imagem: "/images/trainers/bruno.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 2355,
    stardust: 5359,
    xp: 333,
    ia: "estrategica",
    time: [
      { speciesId: 210, nome: "Granbull", level: 4 }
    ]
  },

  {
    id: "brycen",
    nome: "Brycen",
    imagem: "/images/trainers/brycen.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "medio",
    recompensa: 2028,
    stardust: 4003,
    xp: 391,
    ia: "defensiva",
    time: [
      { speciesId: 420, nome: "Cherubi", level: 17 },
      { speciesId: 660, nome: "Diggersby", level: 14 },
      { speciesId: 688, nome: "Binacle", level: 20 }
    ]
  },

  {
    id: "brycenman",
    nome: "Brycenman",
    imagem: "/images/trainers/brycenman.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "dificil",
    recompensa: 748,
    stardust: 3220,
    xp: 443,
    ia: "aleatoria",
    time: [
      { speciesId: 675, nome: "Pangoro", level: 21 },
      { speciesId: 580, nome: "Ducklett", level: 21 }
    ]
  },

  {
    id: "bryony",
    nome: "Bryony",
    imagem: "/images/trainers/bryony.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 2009,
    stardust: 596,
    xp: 406,
    ia: "agressiva",
    time: [
      { speciesId: 1013, nome: "Sinistcha", level: 16 },
      { speciesId: 702, nome: "Dedenne", level: 13 },
      { speciesId: 835, nome: "Yamper", level: 20 }
    ]
  },

  {
    id: "buck",
    nome: "Buck",
    imagem: "/images/trainers/buck.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "elite",
    recompensa: 2088,
    stardust: 365,
    xp: 145,
    ia: "estrategica",
    time: [
      { speciesId: 443, nome: "Gible", level: 42 }
    ]
  },

  {
    id: "bugcatcher-gen1",
    nome: "Bugcatcher-gen1",
    imagem: "/images/trainers/bugcatcher-gen1.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 1962,
    stardust: 4260,
    xp: 394,
    ia: "agressiva",
    time: [
      { speciesId: 662, nome: "Fletchinder", level: 35 },
      { speciesId: 33, nome: "Nidorino", level: 33 },
      { speciesId: 584, nome: "Vanilluxe", level: 36 },
      { speciesId: 635, nome: "Hydreigon", level: 41 },
      { speciesId: 268, nome: "Cascoon", level: 33 }
    ]
  },

  {
    id: "bugcatcher-gen1rb",
    nome: "Bugcatcher-gen1rb",
    imagem: "/images/trainers/bugcatcher-gen1rb.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 2943,
    stardust: 2968,
    xp: 81,
    ia: "agressiva",
    time: [
      { speciesId: 357, nome: "Tropius", level: 38 }
    ]
  },

  {
    id: "bugcatcher-gen2",
    nome: "Bugcatcher-gen2",
    imagem: "/images/trainers/bugcatcher-gen2.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "medio",
    recompensa: 793,
    stardust: 1028,
    xp: 304,
    ia: "aleatoria",
    time: [
      { speciesId: 70, nome: "Weepinbell", level: 13 },
      { speciesId: 68, nome: "Machamp", level: 15 }
    ]
  },

  {
    id: "bugcatcher-gen3",
    nome: "Bugcatcher-gen3",
    imagem: "/images/trainers/bugcatcher-gen3.jpg",
    fraseDesafio: "Vamos ver quem e o melhor!",
    nivel: "elite",
    recompensa: 242,
    stardust: 2171,
    xp: 377,
    ia: "aleatoria",
    time: [
      { speciesId: 87, nome: "Dewgong", level: 35 },
      { speciesId: 936, nome: "Armarouge", level: 33 },
      { speciesId: 868, nome: "Milcery", level: 35 },
      { speciesId: 737, nome: "Charjabug", level: 35 }
    ]
  },

  {
    id: "bugcatcher-gen3rs",
    nome: "Bugcatcher-gen3rs",
    imagem: "/images/trainers/bugcatcher-gen3rs.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "facil",
    recompensa: 2878,
    stardust: 3588,
    xp: 137,
    ia: "defensiva",
    time: [
      { speciesId: 559, nome: "Scraggy", level: 2 },
      { speciesId: 50, nome: "Diglett", level: 6 }
    ]
  },

  {
    id: "bugcatcher-gen4dp",
    nome: "Bugcatcher-gen4dp",
    imagem: "/images/trainers/bugcatcher-gen4dp.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "elite",
    recompensa: 2677,
    stardust: 4397,
    xp: 50,
    ia: "aleatoria",
    time: [
      { speciesId: 574, nome: "Gothita", level: 38 },
      { speciesId: 893, nome: "Zarude", level: 40 },
      { speciesId: 630, nome: "Mandibuzz", level: 33 },
      { speciesId: 63, nome: "Abra", level: 31 }
    ]
  },

  {
    id: "bugcatcher-gen6",
    nome: "Bugcatcher-gen6",
    imagem: "/images/trainers/bugcatcher-gen6.jpg",
    fraseDesafio: "Mostre seu verdadeiro poder!",
    nivel: "elite",
    recompensa: 2457,
    stardust: 5363,
    xp: 368,
    ia: "estrategica",
    time: [
      { speciesId: 692, nome: "Clauncher", level: 41 }
    ]
  },

  {
    id: "bugcatcher",
    nome: "Bugcatcher",
    imagem: "/images/trainers/bugcatcher.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "dificil",
    recompensa: 2785,
    stardust: 871,
    xp: 222,
    ia: "agressiva",
    time: [
      { speciesId: 22, nome: "Fearow", level: 26 },
      { speciesId: 942, nome: "Maschiff", level: 26 },
      { speciesId: 774, nome: "Minior-red-meteor", level: 29 },
      { speciesId: 419, nome: "Floatzel", level: 21 }
    ]
  },

  {
    id: "bugmaniac-gen3",
    nome: "Bugmaniac-gen3",
    imagem: "/images/trainers/bugmaniac-gen3.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "facil",
    recompensa: 421,
    stardust: 285,
    xp: 460,
    ia: "estrategica",
    time: [
      { speciesId: 908, nome: "Meowscarada", level: 3 },
      { speciesId: 708, nome: "Phantump", level: 6 }
    ]
  },

  {
    id: "bugmaniac-gen6",
    nome: "Bugmaniac-gen6",
    imagem: "/images/trainers/bugmaniac-gen6.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 1001,
    stardust: 4905,
    xp: 172,
    ia: "defensiva",
    time: [
      { speciesId: 581, nome: "Swanna", level: 34 },
      { speciesId: 451, nome: "Skorupi", level: 30 }
    ]
  },

  {
    id: "bugsy-gen2",
    nome: "Bugsy-gen2",
    imagem: "/images/trainers/bugsy-gen2.jpg",
    fraseDesafio: "Voce nao esta preparado!",
    nivel: "facil",
    recompensa: 952,
    stardust: 2633,
    xp: 202,
    ia: "agressiva",
    time: [
      { speciesId: 982, nome: "Dudunsparce-two-segment", level: 10 },
      { speciesId: 421, nome: "Cherrim", level: 6 }
    ]
  },

  {
    id: "bugsy-masters",
    nome: "Bugsy-masters",
    imagem: "/images/trainers/bugsy-masters.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "medio",
    recompensa: 1088,
    stardust: 1292,
    xp: 476,
    ia: "agressiva",
    time: [
      { speciesId: 53, nome: "Persian", level: 19 },
      { speciesId: 344, nome: "Claydol", level: 13 }
    ]
  },

  {
    id: "bugsy",
    nome: "Bugsy",
    imagem: "/images/trainers/bugsy.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "dificil",
    recompensa: 2897,
    stardust: 5321,
    xp: 221,
    ia: "defensiva",
    time: [
      { speciesId: 234, nome: "Stantler", level: 23 },
      { speciesId: 173, nome: "Cleffa", level: 22 },
      { speciesId: 255, nome: "Torchic", level: 28 },
      { speciesId: 387, nome: "Turtwig", level: 22 }
    ]
  },

  {
    id: "burgh-masters",
    nome: "Burgh-masters",
    imagem: "/images/trainers/burgh-masters.jpg",
    fraseDesafio: "Essa batalha sera lendaria!",
    nivel: "elite",
    recompensa: 982,
    stardust: 2396,
    xp: 231,
    ia: "aleatoria",
    time: [
      { speciesId: 865, nome: "Sirfetchd", level: 45 }
    ]
  },

  {
    id: "burgh",
    nome: "Burgh",
    imagem: "/images/trainers/burgh.jpg",
    fraseDesafio: "Prepare-se para perder!",
    nivel: "medio",
    recompensa: 2606,
    stardust: 5022,
    xp: 281,
    ia: "agressiva",
    time: [
      { speciesId: 817, nome: "Drizzile", level: 13 },
      { speciesId: 568, nome: "Trubbish", level: 13 },
      { speciesId: 933, nome: "Naclstack", level: 14 }
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

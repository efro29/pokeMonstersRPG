#!/usr/bin/env python3
"""
Generate Generation 3 (Hoenn) Pokemon data from 276-386
"""

gen3_data = [
    # Pokémon continuando de Shiftry (#275)
    (276, "Taillow", ["normal", "flying"], 40, ["peck", "growl"], ["quick-attack", "wing-attack", "double-attack", "agility"]),
    (277, "Swellow", ["normal", "flying"], 70, ["peck", "quick-attack"], ["wing-attack", "double-attack", "agility", "hyper-beam"]),
    
    (278, "Wingull", ["water", "flying"], 40, ["peck", "growl"], ["water-gun", "supersonic", "quick-attack", "aerial-ace"]),
    (279, "Pelipper", ["water", "flying"], 70, ["peck", "water-gun"], ["supersonic", "arial-ace", "protect", "hydro-pump"]),
    
    (280, "Ralts", ["psychic"], 30, ["growl", "confusion"], ["double-team", "teleport", "shock-wave", "psychic"]),
    (281, "Kirlia", ["psychic"], 50, ["growl", "confusion", "double-team"], ["teleport", "psychic", "calm-mind", "future-sight"]),
    (282, "Gardevoir", ["psychic"], 80, ["growl", "confusion", "double-team"], ["calm-mind", "psychic", "future-sight", "hyper-beam"]),
    
    (283, "Surskit", ["bug", "water"], 40, ["bubble", "quick-attack"], ["water-gun", "bug-bite", "aqua-jet", "ice-beam"]),
    (284, "Masquerain", ["bug", "flying"], 70, ["quick-attack", "bubble-beam"], ["stun-spore", "silver-wind", "air-cutter", "hydro-pump"]),
    
    (285, "Shroomish", ["grass"], 50, ["absorb", "growl"], ["mega-drain", "toxic-spores", "stun-spore", "solar-beam"]),
    (286, "Breloom", ["grass", "fighting"], 80, ["growl", "mega-drain"], ["bullet-seed", "drain-punch", "sky-uppercut", "earthquake"]),
    
    (287, "Slakoth", ["normal"], 60, ["scratch", "yawn"], ["slack-off", "comet-punch", "earthquake"]),
    (288, "Vigoroth", ["normal"], 80, ["scratch", "focus-energy"], ["slack-off", "comet-punch", "earthquake", "hyper-beam"]),
    (289, "Slaking", ["normal"], 100, ["scratch", "yawn"], ["earthquake", "hyper-beam", "giga-impact", "comet-punch"]),
    
    (290, "Maggot", ["bug"], 45, ["tackle", "string-shot"], ["bug-bite", "agility", "poison-gas"]),
    (291, "Nincada", ["bug", "ground"], 50, ["scratch", "harden"], ["x-scissor", "fury-swipes", "earthquake"]),
    (292, "Ninjask", ["bug", "flying"], 80, ["scratch", "harden"], ["x-scissor", "aerial-ace", "swords-dance", "agility"]),
    (293, "Shedinja", ["bug", "ghost"], 30, ["scratch", "harden"], ["x-scissor", "willowisp", "shadow-sneak"]),
    
    (294, "Whismur", ["normal"], 60, ["pound", "echo"], ["uproar", "howl", "bite", "crunch"]),
    (295, "Loudred", ["normal"], 80, ["pound", "echo"], ["uproar", "roar", "crunch", "hyper-beam"]),
    (296, "Exploud", ["normal"], 104, ["echo", "pound"], ["uproar", "hyper-beam", "giga-impact", "fire-blast"]),
    
    (297, "Makuhita", ["fighting"], 60, ["tackle", "focus-energy"], ["vital-throw", "arm-thrust", "earthquake", "close-combat"]),
    (298, "Hariyama", ["fighting"], 120, ["tackle", "focus-energy"], ["vital-throw", "close-combat", "earthquake", "hyper-beam"]),
    
    (299, "Azurill", ["normal"], 50, ["pound", "charm"], ["bubble-beam", "water-gun", "tail-whip"]),
    
    (300, "Spoink", ["psychic"], 60, ["psywave", "growl"], ["light-screen", "psybeam", "calm-mind", "psychic"]),
    (301, "Grumpig", ["psychic"], 80, ["psywave", "psybeam"], ["calm-mind", "psychic", "power-gem", "hyper-beam"]),
    
    (302, "Spinda", ["normal"], 60, ["pound", "spot"], ["dizzy-punch", "fake-out", "sucker-punch", "hyper-beam"]),
    
    (303, "Trapinch", ["ground"], 45, ["bite", "growl"], ["sand-attack", "crunch", "earthquake", "sandstorm"]),
    (304, "Vibrava", ["ground", "flying"], 70, ["bite", "sand-attack"], ["crunch", "earthquake", "sandstorm", "dragon-dance"]),
    (305, "Flygon", ["ground", "flying"], 80, ["bite", "sand-attack"], ["earthquake", "outrage", "dragon-dance", "sandstorm"]),
    
    (306, "Cacnea", ["grass"], 50, ["poison-powder", "growth"], ["spike-cannon", "sand-attack", "needle-arm", "solar-beam"]),
    (307, "Cacturne", ["grass", "dark"], 70, ["poison-powder", "growth"], ["spike-cannon", "needle-arm", "solar-beam", "dark-pulse"]),
    
    (308, "Swablu", ["normal", "flying"], 45, ["peck", "growl"], ["fury-attack", "refresh", "power-reserve", "cotton-guard"]),
    (309, "Altaria", ["dragon", "flying"], 75, ["peck", "refresh"], ["dragon-breath", "dragon-dance", "cotton-guard", "hyper-beam"]),
    
    (310, "Zangoose", ["normal"], 73, ["scratch", "leer"], ["false-swipe", "fury-cutter", "crush-claw", "close-combat"]),
    
    (311, "Castform", ["normal"], 70, ["tackle", "powder-snow"], ["weather-ball", "protect", "sunny-day", "rain-dance"]),
    
    (312, "Kecleon", ["normal"], 60, ["scratch", "tail-whip"], ["astonish", "fury-swipes", "sucker-punch", "shadow-claw"]),
    
    (313, "Shuppet", ["ghost"], 50, ["knock-off", "growl"], ["night-shade", "shadow-sneak", "will-o-wisp", "dark-pulse"]),
    (314, "Banette", ["ghost"], 80, ["knock-off", "shadow-sneak"], ["shadow-ball", "will-o-wisp", "curse", "hyper-beam"]),
    
    (315, "Duskull", ["ghost"], 70, ["leer", "night-shade"], ["shadow-sneak", "astonish", "will-o-wisp", "psychic"]),
    
    (316, "Tropius", ["grass", "flying"], 99, ["gust", "growl"], ["synthesis", "giga-drain", "air-slash", "solar-beam"]),
    
    (317, "Chimecho", ["psychic"], 65, ["psywave", "growl"], ["astonish", "psybeam", "calm-mind", "psychic"]),
    
    (318, "Absol", ["dark"], 65, ["scratch", "leer"], ["feint-attack", "pursuit", "night-slash", "psycho-cut"]),
    
    (319, "Wynaut", ["psychic"], 60, ["growl", "charm"], ["counter", "mirror-coat", "safeguard"]),
    
    (320, "Snorunt", ["ice"], 50, ["powder-snow", "growl"], ["ice-shard", "bite", "ice-beam", "blizzard"]),
    (321, "Glalie", ["ice"], 80, ["powder-snow", "bite"], ["ice-shard", "ice-beam", "blizzard", "hyper-beam"]),
    
    (322, "Spheal", ["ice", "water"], 70, ["growl", "powder-snow"], ["water-gun", "ice-ball", "rest", "aurora-beam"]),
    (323, "Sealeo", ["ice", "water"], 90, ["growl", "aurora-beam"], ["ice-ball", "rest", "protect", "hydro-pump"]),
    (324, "Walrein", ["ice", "water"], 110, ["growl", "aurora-beam"], ["ice-beam", "blizzard", "hydro-pump", "earthquake"]),
    
    (325, "Carvanha", ["water", "dark"], 45, ["leer", "bite"], ["crunch", "aqua-jet", "dark-pulse", "waterfall"]),
    (326, "Sharpedo", ["water", "dark"], 70, ["leer", "bite"], ["crunch", "waterfall", "dark-pulse", "hyper-beam"]),
    
    (327, "Wailmer", ["water"], 130, ["growl", "water-gun"], ["water-pulse", "rest", "aurora-beam", "surf"]),
    (328, "Wailord", ["water"], 170, ["growl", "water-gun"], ["surf", "hydro-pump", "aqua-ring", "hyper-beam"]),
    
    (329, "Barboach", ["water", "ground"], 50, ["mud-slap", "water-gun"], ["earthquakek", "waterfall", "stone-edge", "muddy-water"]),
    (330, "Whiscash", ["water", "ground"], 110, ["mud-slap", "water-gun"], ["earthquake", "waterfall", "stone-edge", "hyper-beam"]),
    
    (331, "Corphish", ["water"], 43, ["scratch", "harden"], ["bubble-beam", "crunch", "waterfall", "ice-beam"]),
    (332, "Crawdaunt", ["water", "dark"], 63, ["scratch", "crunch"], ["waterfall", "dark-pulse", "x-scissor", "earthquake"]),
    
    (333, "Baltoy", ["ground", "psychic"], 40, ["confusion", "harden"], ["psybeam", "ancient-power", "earthquake"]),
    (334, "Claydol", ["ground", "psychic"], 60, ["confusion", "ancient-power"], ["earthquake", "psychic", "power-gem", "hyper-beam"]),
    
    (335, "Lileep", ["rock", "grass"], 66, ["astonish", "constrict"], ["ancient-power", "absorb", "giga-drain", "solar-beam"]),
    (336, "Cradily", ["rock", "grass"], 86, ["astonish", "giga-drain"], ["ancient-power", "solar-beam", "stone-edge", "earthquake"]),
    
    (337, "Anorith", ["rock", "bug"], 45, ["bite", "scratch"], ["ancient-power", "x-scissor", "waterfall", "earthquake"]),
    (338, "Armaldo", ["rock", "bug"], 75, ["bite", "x-scissor"], ["ancient-power", "stone-edge", "earthquake", "hyper-beam"]),
    
    (339, "Feebas", ["water"], 20, ["splash"], ["water-gun", "rain-dance", "tackle", "protect"]),
    (340, "Milotic", ["water"], 95, ["water-gun", "rain-dance"], ["aqua-ring", "recover", "hydro-pump", "ice-beam"]),
    
    (341, "Carvanha", ["water", "dark"], 45, ["leer", "bite"], ["crunch", "aqua-jet", "dark-pulse", "waterfall"]),
    
    (342, "Barboach", ["water", "ground"], 50, ["mud-slap", "water-gun"], ["earthquake", "waterfall", "stone-edge", "muddy-water"]),
    
    (343, "Duskull", ["ghost"], 70, ["leer", "night-shade"], ["shadow-sneak", "astonish", "will-o-wisp", "psychic"]),
    
    (344, "Alomomola", ["water"], 165, ["water-sport", "pound"], ["water-gun", "protect", "aqua-ring", "hydro-pump"]),
    
    (345, "Corphish", ["water"], 43, ["scratch", "harden"], ["bubble-beam", "crunch", "waterfall", "ice-beam"]),
    
    (346, "Anorith", ["rock", "bug"], 45, ["bite", "scratch"], ["ancient-power", "x-scissor", "waterfall", "earthquake"]),
    
    (347, "Lileep", ["rock", "grass"], 66, ["astonish", "constrict"], ["ancient-power", "absorb", "giga-drain", "solar-beam"]),
    
    (348, "Feebas", ["water"], 20, ["splash"], ["water-gun", "rain-dance", "tackle", "protect"]),
    
    (349, "Carvanha", ["water", "dark"], 45, ["leer", "bite"], ["crunch", "aqua-jet", "dark-pulse", "waterfall"]),
    
    (350, "Barboach", ["water", "ground"], 50, ["mud-slap", "water-gun"], ["earthquake", "waterfall", "stone-edge", "muddy-water"]),
    
    # Legendários e pseudo-lendários da G3
    (351, "Castform", ["normal"], 70, ["tackle", "powder-snow"], ["weather-ball", "protect", "sunny-day", "rain-dance"]),
    (352, "Kecleon", ["normal"], 60, ["scratch", "tail-whip"], ["astonish", "fury-swipes", "sucker-punch", "shadow-claw"]),
    (353, "Shuppet", ["ghost"], 50, ["knock-off", "growl"], ["night-shade", "shadow-sneak", "will-o-wisp", "dark-pulse"]),
    (354, "Banette", ["ghost"], 80, ["knock-off", "shadow-sneak"], ["shadow-ball", "will-o-wisp", "curse", "hyper-beam"]),
    (355, "Duskull", ["ghost"], 70, ["leer", "night-shade"], ["shadow-sneak", "astonish", "will-o-wisp", "psychic"]),
    (356, "Dusclops", ["ghost"], 80, ["leer", "shadow-punch"], ["focus-punch", "shadow-ball", "curse", "hyper-beam"]),
    (357, "Tropius", ["grass", "flying"], 99, ["gust", "growl"], ["synthesis", "giga-drain", "air-slash", "solar-beam"]),
    (358, "Chimecho", ["psychic"], 65, ["psywave", "growl"], ["astonish", "psybeam", "calm-mind", "psychic"]),
    (359, "Chimera", ["psychic"], 75, ["psywave", "psybeam"], ["calm-mind", "psychic", "power-gem", "hyper-beam"]),
    (360, "Wynaut", ["psychic"], 60, ["growl", "charm"], ["counter", "mirror-coat", "safeguard"]),
    (361, "Wobbuffet", ["psychic"], 190, ["charm", "counter"], ["mirror-coat", "safeguard", "destiny-bond"]),
    (362, "Snorunt", ["ice"], 50, ["powder-snow", "growl"], ["ice-shard", "bite", "ice-beam", "blizzard"]),
    (363, "Glalie", ["ice"], 80, ["powder-snow", "bite"], ["ice-shard", "ice-beam", "blizzard", "hyper-beam"]),
    (364, "Spheal", ["ice", "water"], 70, ["growl", "powder-snow"], ["water-gun", "ice-ball", "rest", "aurora-beam"]),
    (365, "Carvanha", ["water", "dark"], 45, ["leer", "bite"], ["crunch", "aqua-jet", "dark-pulse", "waterfall"]),
    (366, "Sharpedo", ["water", "dark"], 70, ["leer", "bite"], ["crunch", "waterfall", "dark-pulse", "hyper-beam"]),
    (367, "Wailmer", ["water"], 130, ["growl", "water-gun"], ["water-pulse", "rest", "aurora-beam", "surf"]),
    (368, "Wailord", ["water"], 170, ["growl", "water-gun"], ["surf", "hydro-pump", "aqua-ring", "hyper-beam"]),
    (369, "Barboach", ["water", "ground"], 50, ["mud-slap", "water-gun"], ["earthquake", "waterfall", "stone-edge", "muddy-water"]),
    (370, "Whiscash", ["water", "ground"], 110, ["mud-slap", "water-gun"], ["earthquake", "waterfall", "stone-edge", "hyper-beam"]),
    (371, "Corphish", ["water"], 43, ["scratch", "harden"], ["bubble-beam", "crunch", "waterfall", "ice-beam"]),
    (372, "Crawdaunt", ["water", "dark"], 63, ["scratch", "crunch"], ["waterfall", "dark-pulse", "x-scissor", "earthquake"]),
    (373, "Baltoy", ["ground", "psychic"], 40, ["confusion", "harden"], ["psybeam", "ancient-power", "earthquake"]),
    (374, "Claydol", ["ground", "psychic"], 60, ["confusion", "ancient-power"], ["earthquake", "psychic", "power-gem", "hyper-beam"]),
    (375, "Lileep", ["rock", "grass"], 66, ["astonish", "constrict"], ["ancient-power", "absorb", "giga-drain", "solar-beam"]),
    (376, "Cradily", ["rock", "grass"], 86, ["astonish", "giga-drain"], ["ancient-power", "solar-beam", "stone-edge", "earthquake"]),
    (377, "Anorith", ["rock", "bug"], 45, ["bite", "scratch"], ["ancient-power", "x-scissor", "waterfall", "earthquake"]),
    (378, "Armaldo", ["rock", "bug"], 75, ["bite", "x-scissor"], ["ancient-power", "stone-edge", "earthquake", "hyper-beam"]),
    (379, "Feebas", ["water"], 20, ["splash"], ["water-gun", "rain-dance", "tackle", "protect"]),
    (380, "Milotic", ["water"], 95, ["water-gun", "rain-dance"], ["aqua-ring", "recover", "hydro-pump", "ice-beam"]),
    (381, "Absol", ["dark"], 65, ["scratch", "leer"], ["feint-attack", "pursuit", "night-slash", "psycho-cut"]),
    (382, "Kyogre", ["water"], 100, ["water-gun", "gust"], ["hydro-pump", "ice-beam", "origin-pulse", "water-spout"]),
    (383, "Groudon", ["ground"], 100, ["pound", "sand-attack"], ["earthquake", "fire-punch", "precipice-blades", "giga-impact"]),
    (384, "Rayquaza", ["dragon", "flying"], 105, ["ancientpower", "dragon-breath"], ["dragon-dance", "outrage", "earthquake", "hyper-beam"]),
    (385, "Jirachi", ["steel", "psychic"], 100, ["confusion", "doom-desire"], ["psychic", "iron-defense", "meteor-mash", "wish"]),
    (386, "Deoxys", ["psychic"], 50, ["leer", "confusion"], ["psycho-boost", "superpower", "extremespeed", "hyper-beam"]),
]

for entry in gen3_data:
    print(f"  {entry},")

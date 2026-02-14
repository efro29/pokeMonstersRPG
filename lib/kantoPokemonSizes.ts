export type PokemonSize = {
  width: number;
  height: number;
   top: number;
};

const SMALL = { width: 100, height: 80, top: 150};
const MEDIUM = { width: 200, height: 80, top: 80};
const BIG = { width: 200, height: 250 ,top: 125};
const MEGA = { width: 300, height: 300,top:10 };

export const kantoPokemonSizes: Record<number, PokemonSize> = {
  1: SMALL,   // Bulbasaur
  2: MEDIUM,
  3: BIG,
  4: SMALL,
  5: SMALL,
  6: MEGA,
  7: SMALL,
  8: SMALL,
  9: BIG,
  10: SMALL,
  11: SMALL,
  12: SMALL,
  13: SMALL,
  14: SMALL,
  15: SMALL,
  16: SMALL,
  17: SMALL,
  18: SMALL,
  19: SMALL,
  20: SMALL,
  21: SMALL,
  22: MEGA,
  23: SMALL,
  24: BIG,
  25: SMALL, // Pikachu
  26: SMALL,
  27: SMALL,
  28: SMALL,
  29: SMALL,
  30: SMALL,
  31: BIG,
  32: SMALL,
  33: SMALL,
  34: BIG,
  35: SMALL,
  36: SMALL,
  37: SMALL,
  38: SMALL,
  39: SMALL,
  40: BIG,
  41: SMALL,
  42: MEGA,
  43: SMALL,
  44: SMALL,
  45: SMALL,
  46: SMALL,
  47: SMALL,
  48: SMALL,
  49: SMALL,
  50: SMALL,
  51: SMALL,
  52: SMALL,
  53: SMALL,
  54: SMALL,
  55: SMALL,
  56: SMALL,
  57: SMALL,
  58: SMALL,
  59: BIG,
  60: SMALL,
  61: SMALL,
  62: BIG,
  63: SMALL,
  64: SMALL,
  65: BIG,
  66: SMALL,
  67: SMALL,
  68: BIG,
  69: SMALL,
  70: SMALL,
  71: BIG,
  72: SMALL,
  73: BIG,
  74: SMALL,
  75: SMALL,
  76: BIG,
  77: SMALL,
  78: SMALL,
  79: SMALL,
  80: BIG,
  81: SMALL,
  82: SMALL,
  83: SMALL,
  84: SMALL,
  85: SMALL,
  86: SMALL,
  87: BIG,
  88: SMALL,
  89: BIG,
  90: SMALL,
  91: BIG,
  92: SMALL,
  93: SMALL,
  94: BIG,
  95: BIG,
  96: SMALL,
  97: SMALL,
  98: SMALL,
  99: SMALL,
  100: SMALL,
  101: SMALL,
  102: SMALL,
  103: BIG,
  104: SMALL,
  105: SMALL,
  106: BIG,
  107: BIG,
  108: SMALL,
  109: SMALL,
  110: SMALL,
  111: SMALL,
  112: BIG,
  113: SMALL,
  114: SMALL,
  115: BIG,
  116: SMALL,
  117: SMALL,
  118: SMALL,
  119: SMALL,
  120: SMALL,
  121: BIG,
  122: BIG,
  123: BIG,
  124: BIG,
  125: BIG,
  126: BIG,
  127: BIG,
  128: BIG,
  129: SMALL,
  130: BIG,
  131: BIG,
  132: SMALL,
  133: SMALL,
  134: BIG,
  135: BIG,
  136: BIG,
  137: SMALL,
  138: SMALL,
  139: SMALL,
  140: SMALL,
  141: BIG,
  142: BIG,
  143: BIG,
  144: BIG,
  145: BIG,
  146: BIG,
  147: SMALL,
  148: SMALL,
  149: BIG,
  150: BIG,
  151: SMALL,
  // JOHTO (2ª geração)

  152: SMALL, // Chikorita
  153: SMALL,
  154: BIG,   // Meganium
  155: SMALL,
  156: SMALL,
  157: BIG,   // Typhlosion
  158: SMALL,
  159: SMALL,
  160: BIG,   // Feraligatr
  161: SMALL,
  162: SMALL,
  163: SMALL,
  164: SMALL,
  165: SMALL,
  166: SMALL,
  167: SMALL,
  168: SMALL,
  169: BIG,   // Crobat
  170: SMALL,
  171: BIG,   // Lanturn
  172: SMALL, // Pichu
  173: SMALL,
  174: SMALL,
  175: SMALL,
  176: SMALL,
  177: SMALL,
  178: SMALL,
  179: SMALL,
  180: SMALL,
  181: BIG,   // Ampharos
  182: SMALL,
  183: SMALL,
  184: SMALL,
  185: BIG,   // Sudowoodo
  186: BIG,   // Politoed
  187: SMALL,
  188: SMALL,
  189: SMALL,
  190: SMALL,
  191: SMALL,
  192: SMALL,
  193: SMALL,
  194: SMALL,
  195: BIG,   // Quagsire
  196: BIG,   // Espeon
  197: BIG,   // Umbreon
  198: SMALL,
  199: BIG,   // Slowking
  200: SMALL,
  201: SMALL, // Unown
  202: BIG,   // Wobbuffet
  203: SMALL,
  204: SMALL,
  205: BIG,   // Forretress
  206: SMALL,
  207: SMALL,
  208: BIG,   // Steelix
  209: SMALL,
  210: SMALL,
  211: SMALL,
  212: BIG,   // Scizor
  213: SMALL,
  214: BIG,   // Heracross
  215: SMALL,
  216: SMALL,
  217: BIG,   // Ursaring
  218: SMALL,
  219: SMALL,
  220: SMALL,
  221: BIG,   // Piloswine
  222: SMALL,
  223: SMALL,
  224: SMALL,
  225: SMALL,
  226: BIG,   // Mantine
  227: BIG,   // Skarmory
  228: SMALL,
  229: BIG,   // Houndoom
  230: BIG,   // Kingdra
  231: SMALL,
  232: BIG,   // Donphan
  233: SMALL,
  234: BIG,   // Stantler
  235: SMALL,
  236: SMALL,
  237: BIG,   // Hitmontop
  238: SMALL,
  239: SMALL,
  240: SMALL,
  241: BIG,   // Miltank
  242: BIG,   // Blissey
  243: BIG,   // Raikou
  244: BIG,   // Entei
  245: BIG,   // Suicune
  246: SMALL,
  247: SMALL,
  248: BIG,   // Tyranitar
  249: BIG,   // Lugia
  250: BIG,   // Ho-Oh
  251: SMALL  // Celebi
};



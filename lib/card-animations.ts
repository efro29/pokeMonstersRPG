// Tipos de animação para eventos de carta
export type CardEffectType = "damage" | "heal" | "buff" | "debuff" | "none";

// Mapeamento de tipos de carta para efeito de animação
export const getCardEffectAnimation = (alignment: "luck" | "bad-luck"): CardEffectType => {
  return alignment === "bad-luck" ? "damage" : "heal";
};

// Estado para controlar animação do Pokemon
export interface PokemonAnimationState {
  isAnimating: boolean;
  effectType: CardEffectType;
  duration: number;
}

// Retorna as variantes de animação baseado no tipo de efeito
// Usa keyframe arrays por propriedade (formato correto do framer-motion)
export const getPokemonAnimationVariants = (effectType: CardEffectType) => {
  switch (effectType) {
    case "damage":
      return {
        initial: { x: 0, opacity: 1 },
        animate: {
          x: [-8, 8, -8, 6, -4, 0],
          opacity: [1, 0.4, 1, 0.4, 1, 1],
        },
        transition: {
          duration: 0.5,
          ease: "easeInOut",
        },
      };

    case "heal":
      return {
        initial: { scale: 1, opacity: 1 },
        animate: {
          scale: [1, 1.06, 1],
          opacity: [1, 0.85, 1],
        },
        transition: {
          duration: 0.6,
          ease: "easeInOut",
        },
      };

    case "buff":
      return {
        initial: { scale: 1, opacity: 1 },
        animate: {
          scale: [1, 1.1, 1],
          opacity: [1, 0.8, 1],
        },
        transition: {
          duration: 0.7,
          ease: "easeInOut",
        },
      };

    case "debuff":
      return {
        initial: { scale: 1, opacity: 1 },
        animate: {
          scale: [1, 0.92, 1],
          opacity: [1, 0.5, 1],
        },
        transition: {
          duration: 0.6,
          ease: "easeInOut",
        },
      };

    default:
      return {
        initial: {},
        animate: {},
        transition: { duration: 0 },
      };
  }
};

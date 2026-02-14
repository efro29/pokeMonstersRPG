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
export const getPokemonAnimationVariants = (effectType: CardEffectType) => {
  switch (effectType) {
    case "damage":
      return {
        initial: { x: 0, rotate: 0, filter: "brightness(1)" },
        animate: [
          { x: -10, rotate: -2, filter: "brightness(1.3)" },
          { x: 10, rotate: 2, filter: "brightness(1.3)" },
          { x: -10, rotate: -2, filter: "brightness(1.3)" },
          { x: 0, rotate: 0, filter: "brightness(1)" },
        ],
        transition: {
          duration: 0.5,
          times: [0, 0.25, 0.5, 0.75, 1],
          ease: "easeInOut",
        },
      };

    case "heal":
      return {
        initial: { scale: 1, filter: "drop-shadow(0 0 0px rgba(34, 197, 94, 0))" },
        animate: [
          { scale: 1.05, filter: "drop-shadow(0 0 10px rgba(34, 197, 94, 0.8))" },
          { scale: 1, filter: "drop-shadow(0 0 0px rgba(34, 197, 94, 0))" },
        ],
        transition: {
          duration: 0.6,
          times: [0, 0.5, 1],
          ease: "easeInOut",
        },
      };

    case "buff":
      return {
        initial: { scale: 1, filter: "drop-shadow(0 0 0px rgba(251, 191, 36, 0))" },
        animate: [
          { scale: 1.08, filter: "drop-shadow(0 0 15px rgba(251, 191, 36, 0.9))" },
          { scale: 1, filter: "drop-shadow(0 0 0px rgba(251, 191, 36, 0))" },
        ],
        transition: {
          duration: 0.7,
          times: [0, 0.5, 1],
          ease: "easeInOut",
        },
      };

    case "debuff":
      return {
        initial: { scale: 1, filter: "drop-shadow(0 0 0px rgba(239, 68, 68, 0))" },
        animate: [
          { scale: 1.05, filter: "drop-shadow(0 0 12px rgba(239, 68, 68, 0.8))" },
          { scale: 1, filter: "drop-shadow(0 0 0px rgba(239, 68, 68, 0))" },
        ],
        transition: {
          duration: 0.6,
          times: [0, 0.5, 1],
          ease: "easeInOut",
        },
      };

    default:
      return {
        initial: { scale: 1 },
        animate: { scale: 1 },
        transition: { duration: 0 },
      };
  }
};

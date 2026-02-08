import { create } from "zustand";
import { persist } from "zustand/middleware";

export type GameMode = "master" | "trainer";

export interface TrainerProfile {
  id: string;
  name: string;
  avatarId: number;
  createdAt: number;
}

interface ModeState {
  mode: GameMode | null;
  profiles: TrainerProfile[];
  activeProfileId: string | null;
  discoveredPokemon: Record<string, number[]>; // profileId -> pokemon IDs

  setMode: (mode: GameMode) => void;
  addProfile: (name: string, avatarId: number) => string;
  removeProfile: (id: string) => void;
  setActiveProfile: (id: string) => void;
  clearActiveProfile: () => void;
  discoverPokemon: (pokemonId: number) => void;
  getDiscoveredForProfile: (profileId: string) => number[];
  resetMode: () => void;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export const useModeStore = create<ModeState>()(
  persist(
    (set, get) => ({
      mode: null,
      profiles: [],
      activeProfileId: null,
      discoveredPokemon: {},

      setMode: (mode) => set({ mode }),

      addProfile: (name, avatarId) => {
        const id = generateId();
        const profile: TrainerProfile = {
          id,
          name,
          avatarId,
          createdAt: Date.now(),
        };
        set({ profiles: [...get().profiles, profile] });
        return id;
      },

      removeProfile: (id) => {
        const { profiles, discoveredPokemon, activeProfileId } = get();
        const newProfiles = profiles.filter((p) => p.id !== id);
        const newDiscovered = { ...discoveredPokemon };
        delete newDiscovered[id];
        // Also remove the game data for this profile
        if (typeof window !== "undefined") {
          localStorage.removeItem(`pokemon-rpg-game-${id}`);
        }
        set({
          profiles: newProfiles,
          discoveredPokemon: newDiscovered,
          activeProfileId: activeProfileId === id ? null : activeProfileId,
        });
      },

      setActiveProfile: (id) => set({ activeProfileId: id }),

      clearActiveProfile: () => set({ activeProfileId: null }),

      discoverPokemon: (pokemonId) => {
        const { activeProfileId, discoveredPokemon } = get();
        if (!activeProfileId) return;
        const current = discoveredPokemon[activeProfileId] || [];
        if (current.includes(pokemonId)) return;
        set({
          discoveredPokemon: {
            ...discoveredPokemon,
            [activeProfileId]: [...current, pokemonId],
          },
        });
      },

      getDiscoveredForProfile: (profileId) => {
        return get().discoveredPokemon[profileId] || [];
      },

      resetMode: () => set({ mode: null, activeProfileId: null }),
    }),
    {
      name: "pokemon-rpg-mode",
    }
  )
);

// Avatars definition - 8 generic trainer avatars
export const TRAINER_AVATARS = [
  { id: 0, name: "Ash", hat: "#EF4444", shirt: "#3B82F6", skin: "#FBBF68", hair: "#1E1E1E" },
  { id: 1, name: "Misty", hat: "none", shirt: "#F59E0B", skin: "#FBBF68", hair: "#F97316" },
  { id: 2, name: "Brock", hat: "none", shirt: "#22C55E", skin: "#D4915C", hair: "#1E1E1E" },
  { id: 3, name: "Gary", hat: "none", shirt: "#8B5CF6", skin: "#FBBF68", hair: "#92400E" },
  { id: 4, name: "May", hat: "#EF4444", shirt: "#EC4899", skin: "#FBBF68", hair: "#4B2E16" },
  { id: 5, name: "Ace", hat: "#1E293B", shirt: "#1E293B", skin: "#FBBF68", hair: "#F59E0B" },
  { id: 6, name: "Ranger", hat: "#22C55E", shirt: "#166534", skin: "#D4915C", hair: "#1E1E1E" },
  { id: 7, name: "Rocket", hat: "none", shirt: "#1E1E1E", skin: "#FBBF68", hair: "#6366F1" },
];

// Helper to get the game store key based on persisted mode
export function getGameStoreKey(): string {
  if (typeof window === "undefined") return "pokemon-rpg-game";
  try {
    const stored = localStorage.getItem("pokemon-rpg-mode");
    if (stored) {
      const parsed = JSON.parse(stored);
      const state = parsed?.state;
      if (state?.mode === "master") {
        return "pokemon-rpg-game-master";
      }
      if (state?.mode === "trainer" && state?.activeProfileId) {
        return `pokemon-rpg-game-${state.activeProfileId}`;
      }
    }
  } catch {
    // fallback
  }
  return "pokemon-rpg-game";
}

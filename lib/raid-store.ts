import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";

export interface RaidPlayer {
  id: string;
  room_id: string;
  player_name: string;
  player_token: string;
  role: "master" | "trainer";
  pokemon_data: unknown[];
  is_ready: boolean;
  current_hp: number;
  max_hp: number;
  joined_at: string;
}

export interface RaidRoom {
  id: string;
  room_code: string;
  room_name: string;
  status: "waiting" | "battle" | "finished";
  current_turn_player_id: string | null;
  turn_number: number;
  master_pokemon: unknown[];
  created_at: string;
}

export interface RaidBattleLogEntry {
  id: string;
  room_id: string;
  player_id: string | null;
  player_name: string | null;
  turn_number: number;
  action_type: string;
  action_data: Record<string, unknown>;
  created_at: string;
}

type RaidScreen = "menu" | "create" | "join" | "lobby" | "battle" | "finished";

interface RaidState {
  screen: RaidScreen;
  room: RaidRoom | null;
  players: RaidPlayer[];
  myPlayer: RaidPlayer | null;
  myToken: string | null;
  battleLog: RaidBattleLogEntry[];
  isLoading: boolean;
  error: string | null;

  setScreen: (screen: RaidScreen) => void;
  setError: (error: string | null) => void;

  createRoom: (playerName: string, masterPokemon: unknown[]) => Promise<void>;
  joinRoom: (roomCode: string, playerName: string, pokemonData: unknown[]) => Promise<void>;
  fetchRoom: () => Promise<void>;
  sendAction: (actionType: string, actionData?: Record<string, unknown>) => Promise<void>;
  leaveRaid: () => void;
  subscribeRealtime: () => () => void;
}

export const useRaidStore = create<RaidState>()((set, get) => ({
  screen: "menu",
  room: null,
  players: [],
  myPlayer: null,
  myToken: null,
  battleLog: [],
  isLoading: false,
  error: null,

  setScreen: (screen) => set({ screen }),
  setError: (error) => set({ error }),

  createRoom: async (playerName, masterPokemon) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/raid/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName, masterPokemon }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      set({
        room: data.room,
        myPlayer: data.player,
        myToken: data.playerToken,
        players: [data.player],
        screen: "lobby",
        isLoading: false,
      });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  joinRoom: async (roomCode, playerName, pokemonData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/raid/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomCode, playerName, pokemonData }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      set({
        room: data.room,
        myPlayer: data.player,
        myToken: data.playerToken,
        screen: "lobby",
        isLoading: false,
      });

      // Fetch full room data
      get().fetchRoom();
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  fetchRoom: async () => {
    const { room } = get();
    if (!room) return;

    try {
      const res = await fetch(`/api/raid/room/${room.id}`);
      const data = await res.json();
      if (!res.ok) return;

      const newScreen = data.room.status === "battle"
        ? "battle"
        : data.room.status === "finished"
          ? "finished"
          : "lobby";

      set({
        room: data.room,
        players: data.players,
        battleLog: data.battleLog,
        screen: newScreen,
      });
    } catch {
      // Silently fail - will retry on next poll
    }
  },

  sendAction: async (actionType, actionData = {}) => {
    const { room, myPlayer, myToken } = get();
    if (!room || !myPlayer || !myToken) return;

    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/raid/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: room.id,
          playerId: myPlayer.id,
          playerToken: myToken,
          actionType,
          actionData,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      set({
        room: data.room,
        players: data.players,
        isLoading: false,
      });

      // Refresh full data to get battle log
      get().fetchRoom();
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  leaveRaid: () => {
    set({
      screen: "menu",
      room: null,
      players: [],
      myPlayer: null,
      myToken: null,
      battleLog: [],
      isLoading: false,
      error: null,
    });
  },

  subscribeRealtime: () => {
    const { room } = get();
    if (!room) return () => {};

    const supabase = createClient();

    const channel = supabase
      .channel(`raid-room-${room.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "raid_rooms", filter: `id=eq.${room.id}` },
        () => { get().fetchRoom(); }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "raid_players", filter: `room_id=eq.${room.id}` },
        () => { get().fetchRoom(); }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "raid_battle_log", filter: `room_id=eq.${room.id}` },
        () => { get().fetchRoom(); }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
}));

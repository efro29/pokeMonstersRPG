"use client";

import { useRaidStore } from "@/lib/raid-store";
import { RaidLobby } from "./raid-lobby";
import { RaidBattle } from "./raid-battle";

interface RaidScreenProps {
  onBack: () => void;
}

export function RaidScreen({ onBack }: RaidScreenProps) {
  const { screen } = useRaidStore();

  if (screen === "battle" || screen === "finished") {
    return <RaidBattle onBack={onBack} />;
  }

  return <RaidLobby onBack={onBack} />;
}

"use client";

import { useState, useEffect } from "react";
import { useGameStore } from "@/lib/game-store";
import { useModeStore, getGameStoreKey } from "@/lib/mode-store";
import { ModeSelectScreen } from "@/components/mode-select-screen";
import { ProfileSelectScreen } from "@/components/profile-select-screen";
import { StartScreen } from "@/components/start-screen";
import { PokedexTab } from "@/components/pokedex-tab";
import { TeamTab } from "@/components/team-tab";
import { BagTab } from "@/components/bag-tab";
import { BattleScene } from "@/components/battle-scene";
import { ProfileTab } from "@/components/profile-tab";
import { ShopTab } from "@/components/shop-tab";
import { NpcTab } from "@/components/npc-tab";
import { TrainerAvatar } from "@/components/trainer-avatar";
import { getPokemon } from "@/lib/pokemon-data";
import { RaidScreen } from "@/components/raid-screen";
import { Users, Backpack, BookOpen, User, ShoppingCart, Coins, LogOut, Swords } from "lucide-react";
import { playTabSwitch, playButtonClick } from "@/lib/sounds";

type Tab = "team" | "bag" | "pokedex" | "profile" | "shop" | "npcs";
type Screen = "loading" | "mode-select" | "profile-select" | "start" | "game";

export default function Page() {
  const { mode, setMode, profiles, activeProfileId, setActiveProfile, clearActiveProfile, resetMode } = useModeStore();
  const { battle, startBattle, addToTeamWithLevel, team, trainer } = useGameStore();

  const [screen, setScreen] = useState<Screen>("loading");
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [hasSave, setHasSave] = useState(false);

  const activeProfile = profiles.find((p) => p.id === activeProfileId);

  // After zustand hydrates from localStorage, determine the correct screen
  useEffect(() => {
    if (screen === "game") return; // don't override once in game

    if (!mode) {
      setScreen("mode-select");
    } else if (mode === "trainer" && !activeProfileId) {
      setScreen("profile-select");
    } else if (screen !== "game") {
      setScreen("start");
    }
  }, [mode, activeProfileId, screen]);

  useEffect(() => {
    if (!mode) return;
    // Check if there's saved data for the current profile/mode
    const key = getGameStoreKey();
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.state?.trainer?.name) {
          setHasSave(true);
        }
      } catch {
        // no valid save
      }
    }
  }, [activeProfileId, mode]);

  // In master mode, auto-set trainer name so ProfileTab doesn't force edit dialog
  useEffect(() => {
    if (screen === "game" && mode === "master" && !trainer.name) {
      useGameStore.getState().updateTrainer({ name: "Mestre Pokemon", trainerClass: "Mestre" });
    }
  }, [screen, mode, trainer.name]);

  const handleSelectMode = (selectedMode: "master" | "trainer") => {
    setMode(selectedMode);
    if (selectedMode === "master") {
      setScreen("start");
    } else {
      setScreen("profile-select");
    }
  };

  const handleSelectProfile = (profileId: string) => {
    setActiveProfile(profileId);
    // Reload page to reinitialize game store with the profile's key
    window.location.reload();
  };

  const handleBackToModeSelect = () => {
    resetMode();
    setScreen("mode-select");
  };

  // Start a battle with any Pokemon from Pokedex or NPC tab (master mode)
  const handleStartBattleWithPokemon = (speciesId: number, level: number) => {
    const species = getPokemon(speciesId);
    if (!species) return;
    // Check if already in team
    const existing = team.find((p) => p.speciesId === speciesId);
    if (existing) {
      startBattle(existing.uid);
      return;
    }
    // If team is full, replace the last slot
    if (team.length >= 6) {
      const lastUid = team[team.length - 1].uid;
      useGameStore.getState().removeFromTeam(lastUid);
    }
    // Add to team with the specified level and start battle
    const uid = addToTeamWithLevel(species, level);
    if (uid) {
      startBattle(uid);
    }
  };

  const handleBackToProfiles = () => {
    clearActiveProfile();
    // Reload so game store reinitializes
    window.location.reload();
  };

  // Loading state while zustand hydrates from localStorage
  if (screen === "loading") {
    return (
      <div
        className="flex flex-col h-dvh max-w-md mx-auto items-center justify-center"
        style={{
          background: "linear-gradient(180deg, #0c1220 0%, #1a1a3e 40%, #2d1b4e 70%, #0c1220 100%)",
        }}
      >
        <svg width="48" height="48" viewBox="0 0 100 100" className="animate-spin">
          <circle cx="50" cy="50" r="48" fill="#EF4444" stroke="#1E293B" strokeWidth="3" />
          <rect x="2" y="48" width="96" height="4" fill="#1E293B" />
          <path d="M 2 50 A 48 48 0 0 0 98 50" fill="#F1F5F9" />
          <circle cx="50" cy="50" r="14" fill="#F1F5F9" stroke="#1E293B" strokeWidth="3" />
          <circle cx="50" cy="50" r="7" fill="#1E293B" />
        </svg>
      </div>
    );
  }

  // Mode selection
  if (screen === "mode-select") {
    return <ModeSelectScreen onSelectMode={handleSelectMode} />;
  }

  // Profile selection (trainer mode only)
  if (screen === "profile-select") {
    return (
      <ProfileSelectScreen
        onSelectProfile={handleSelectProfile}
        onBack={handleBackToModeSelect}
      />
    );
  }

  // Start screen
  if (screen === "start") {
    return (
      <StartScreen
        hasSave={hasSave}
        mode={mode}
        profileName={activeProfile?.name}
        onContinue={() => setScreen("game")}
        onStart={() => {
          if (hasSave) {
            const key = getGameStoreKey();
            localStorage.removeItem(key);
            window.location.reload();
          } else {
            setScreen("game");
          }
        }}
        onChangeMode={handleBackToModeSelect}
        onChangeProfile={mode === "trainer" ? handleBackToProfiles : undefined}
      />
    );
  }

  // Battle
  if (battle.phase !== "idle") {
    return (
      <main className="flex flex-col h-dvh max-w-md mx-auto bg-background">
        <BattleScene />
      </main>
    );
  }

  // Game
  return (
    <main className="flex flex-col h-dvh max-w-md mx-auto bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-3 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          {mode === "trainer" && activeProfile ? (
            <button
              onClick={() => {
                playButtonClick();
                handleBackToProfiles();
              }}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              title="Trocar perfil"
            >
              <TrainerAvatar avatarId={activeProfile.avatarId} size={28} />
              <div className="flex flex-col">
                <h1 className="text-xs font-bold text-foreground tracking-wide leading-none">
                  {activeProfile.name}
                </h1>
                <span className="text-[9px] text-muted-foreground">Treinador</span>
              </div>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 100 100" className="shrink-0">
                <circle cx="50" cy="50" r="48" fill="hsl(var(--primary))" stroke="hsl(var(--border))" strokeWidth="3" />
                <rect x="2" y="48" width="96" height="4" fill="hsl(var(--foreground))" />
                <path d="M 2 50 A 48 48 0 0 0 98 50" fill="hsl(var(--foreground))" fillOpacity="0.9" />
                <circle cx="50" cy="50" r="14" fill="hsl(var(--foreground))" stroke="hsl(var(--foreground))" strokeWidth="3" />
                <circle cx="50" cy="50" r="7" fill="hsl(var(--card))" />
              </svg>
              <h1 className="text-sm font-bold text-foreground tracking-wide">
                Pokemon RPG Manaus
              </h1>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-secondary/50 rounded-full px-2.5 py-1">
            <Coins className="w-3 h-3 text-accent" />
            <span className="text-xs font-bold font-mono text-accent">
              {"$"}{trainer.money.toLocaleString("pt-BR")}
            </span>
          </div>
          <button
            onClick={() => {
              playButtonClick();
              if (mode === "trainer") {
                handleBackToProfiles();
              } else {
                handleBackToModeSelect();
              }
            }}
            className="w-7 h-7 rounded-full flex items-center justify-center bg-secondary/50 hover:bg-secondary transition-colors"
            title={mode === "trainer" ? "Trocar perfil" : "Trocar modo"}
          >
            <LogOut className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      </header>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "profile" && <ProfileTab />}
        {activeTab === "team" && <TeamTab onStartBattle={(uid) => startBattle(uid)} />}
        {activeTab === "bag" && <BagTab />}
        {activeTab === "shop" && <ShopTab />}
        {activeTab === "pokedex" && (
          <PokedexTab
            onStartBattleWithPokemon={mode === "master" ? handleStartBattleWithPokemon : undefined}
          />
        )}
        {activeTab === "npcs" && (
          <NpcTab onStartBattleWithPokemon={handleStartBattleWithPokemon} />
        )}
      </div>

      {/* Bottom tab bar */}
      <nav className="flex border-t border-border bg-card" role="tablist">
        {([
          { id: "profile" as Tab, label: "Perfil", icon: User },
          { id: "team" as Tab, label: "Equipe", icon: Users },
          ...(mode === "master" ? [{ id: "npcs" as Tab, label: "NPCs", icon: Swords }] : []),
          { id: "bag" as Tab, label: "Bolsa", icon: Backpack },
          { id: "shop" as Tab, label: "Loja", icon: ShoppingCart },
          { id: "pokedex" as Tab, label: "Pokedex", icon: BookOpen },
        ]).map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              role="tab"
              aria-selected={isActive}
              onClick={() => { playTabSwitch(); setActiveTab(id); }}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] font-medium">{label}</span>
              {isActive && (
                <div className="w-5 h-0.5 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </nav>
    </main>
  );
}

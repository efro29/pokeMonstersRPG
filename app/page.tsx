"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useGameStore } from "@/lib/game-store";
import { useModeStore, getGameStoreKey } from "@/lib/mode-store";
import { ModeSelectScreen } from "@/components/mode-select-screen";
import { ProfileSelectScreen } from "@/components/profile-select-screen";
import { StartScreen } from "@/components/start-screen";
import { PokedexTab } from "@/components/pokedex-tab";
import { TeamTab } from "@/components/team-tab";
import { Input } from "@/components/ui/input";
import { BagTab } from "@/components/bag-tab";
import { BattleScene } from "@/components/battle-scene";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ProfileTab } from "@/components/profile-tab";
import { ShopTab } from "@/components/shop-tab";
import { NpcTab } from "@/components/npc-tab";
import { MovesDictionaryTab } from "@/components/moves-dictionary-tab";
import { SettingsTab } from "@/components/settings-tab";
import { CaptureScene } from "@/components/capture-scene";
import { WildBattleScene } from "@/components/wild-battle-scene";
import { TrainerAvatar } from "@/components/trainer-avatar";
import { getPokemon, POKEMON } from "@/lib/pokemon-data";
import { calculateExplorationXp } from "@/lib/game-store";
import type { ExplorationReward, StreakUpdateResult } from "@/lib/game-store";

import { Users, Backpack, BookOpen, User, ShoppingCart, Coins, LogOut, Swords, Crosshair, Settings, Plus, StarIcon } from "lucide-react";
import { playTabSwitch, playButtonClick } from "@/lib/sounds";
import { useImagePreloader } from "@/hooks/use-image-preloader";
import {
  ProfileIcon,
  TeamIcon,
  NpcIcon,
  BagIcon,
  ShopIcon,
  MovesIcon,
  PokedexIcon,
  SettingsIcon,
} from "@/components/game-icons";
import { Button } from "@/components/ui/button";
type Tab = "team" | "bag" | "pokedex" | "profile" | "shop" | "npcs" | "moves" | "settings";
type Screen = "loading" | "mode-select" | "profile-select" | "start" | "game";

export default function Page() {
  // Pre-load all project images into browser cache on mount
  useImagePreloader();
  const { mode, setMode, profiles, activeProfileId, setActiveProfile, clearActiveProfile, resetMode } = useModeStore();
  const { battle, startBattle, addToTeamWithLevel, team, trainer } = useGameStore();
  const { updateTrainer, updateAttributes, addMoney, toggleBadge, toggleJohtoBadge, addTrainerXp, setTrainerLevel, damageTrainer, healTrainer, recalcTrainerStats } = useGameStore();
  const [screen, setScreen] = useState<Screen>("loading");
  const [moneyDialog, setMoneyDialog] = useState(false);
  const [moneyAmount, setMoneyAmount] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [hasSave, setHasSave] = useState(false);
  const [captureTarget, setCaptureTarget] = useState<number | null>(null);
  const [wildBattleTarget, setWildBattleTarget] = useState<number | null>(null);
  const wildLevelRef = useRef<number>(1);
  const [explorationRewardToast, setExplorationRewardToast] = useState<{
    xp: number;
    ballsUsed: number;
    rewards: ExplorationReward[];
    newLevel: number;
    oldLevel: number;
  } | null>(null);
  const [streakToast, setStreakToast] = useState<{
    streak: number;
    broken: boolean;
    milestone: number | null;
    legendaryId: number | null;
    legendaryName: string | null;
  } | null>(null);
  const [musicMuted, setMusicMuted] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("pokerpg-music-muted") === "true";
    }
    return false;
  });

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

    const handleAddMoney = () => {
    if (useModeStore.getState().economyLocked) return;
    const amount = parseInt(moneyAmount);
    if (amount > 0) {
      addMoney(amount);
      setMoneyAmount("");
      setMoneyDialog(false);
    }
  };

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

  // ── Audio refs ──
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastTrackRef = useRef<string | null>(null);
  const audioUnlockedRef = useRef(false);

  const HOME_TRACKS = ["/mp3/home.mp3", "/mp3/home1.mp3", "/mp3/home2.mp3"];

  const getRandomHomeTrack = useCallback(() => {
    let track: string;
    do {
      track = HOME_TRACKS[Math.floor(Math.random() * HOME_TRACKS.length)];
    } while (track === lastTrackRef.current && HOME_TRACKS.length > 1);
    lastTrackRef.current = track;
    return track;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for mute toggle from settings
  useEffect(() => {
    const handler = () => {
      const muted = localStorage.getItem("pokerpg-music-muted") === "true";
      setMusicMuted(muted);
    };
    window.addEventListener("pokerpg-music-toggle", handler);
    return () => window.removeEventListener("pokerpg-music-toggle", handler);
  }, []);

  // Create audio player ONCE
  useEffect(() => {
    const audio = new Audio();
    audio.volume = 0.4;
    audioRef.current = audio;

    // When a home track ends, play another random one (not looped)
    const onEnded = () => {
      if (!audioRef.current) return;
      if (localStorage.getItem("pokerpg-music-muted") === "true") return;
      const nextTrack = getRandomHomeTrack();
      audioRef.current.src = nextTrack;
      audioRef.current.loop = false;
      audioRef.current.play().catch(() => {});
    };
    audio.addEventListener("ended", onEnded);

    // Unlock audio on first user click
    const unlockAudio = () => {
      audioUnlockedRef.current = true;
      // Only play if not muted
      if (localStorage.getItem("pokerpg-music-muted") !== "true" && audioRef.current?.src) {
        audioRef.current.play().catch(() => {});
      }
      window.removeEventListener("click", unlockAudio);
    };
    window.addEventListener("click", unlockAudio);

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audio.removeEventListener("ended", onEnded);
      window.removeEventListener("click", unlockAudio);
    };
  }, [getRandomHomeTrack]);

  // Main music controller: reacts to battle phase AND mute state
  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    // If muted, stop everything
    if (musicMuted) {
      audio.pause();
      return;
    }

    let newMusic: string;

    // BATTLE
    if (battle.phase !== "idle") {
      newMusic = "/mp3/battle.mp3";
    }
    // HOME (random)
    else {
      newMusic = getRandomHomeTrack();
    }

    // Avoid reloading the same track
    if (audio.src && audio.src.includes(newMusic)) {
      // Same track, just resume if paused
      if (audio.paused && audioUnlockedRef.current) {
        audio.play().catch(() => {});
      }
      return;
    }

    audio.pause();
    audio.currentTime = 0;
    audio.src = newMusic;
    audio.loop = battle.phase !== "idle"; // loop only in battle

    if (audioUnlockedRef.current) {
      audio.play().catch(() => {});
    }
  }, [battle.phase, musicMuted, getRandomHomeTrack]);

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
    // Add to team (or reserves if full) with the specified level and start battle
    const uid = addToTeamWithLevel(species, level);
    if (uid) {
      // If it went to reserves, move it to team for battle
      const state = useGameStore.getState();
      const inReserves = state.reserves.some((p) => p.uid === uid);
      if (inReserves && state.team.length < 6) {
        state.moveToTeam(uid);
      }
      startBattle(uid);
    }
  };

  const handleBackToProfiles = () => {
    clearActiveProfile();
    // Reload so game store reinitializes
    window.location.reload();
  };

  // Capture mode handlers
  const handleStartCapture = (speciesId: number) => {
    setCaptureTarget(speciesId);
  };

  const handleStartWildBattle = (speciesId: number) => {
    // Get the highest level Pokemon in the main team
    const currentTeam = useGameStore.getState().team;
    const highestTeamLevel = currentTeam.length > 0 
      ? Math.max(...currentTeam.map(p => p.level)) 
      : 5;
    
    // Get exploration level (default to 1)
    const explorationLevel = trainer.explorationLevel ?? 1;
    
    // Calculate base level range based on both factors
    // Higher exploration level = chance for higher level wild Pokemon
    // Higher team level = wild Pokemon scale with your team
    const baseLevel = Math.max(1, Math.floor(highestTeamLevel * 0.6)); // 60% of highest team level as minimum
    const levelBonus = Math.floor(explorationLevel / 3); // +1 max level per 3 exploration levels
    
    // Level range: baseLevel to (highestTeamLevel + levelBonus)
    const minLevel = Math.max(1, baseLevel - 2);
    const maxLevel = Math.min(100, highestTeamLevel + levelBonus + 2);
    
    // Weighted random: higher chance for levels closer to team level
    // But exploration level increases chance of higher levels
    const roll = Math.random();
    const explorationBonus = Math.min(0.5, explorationLevel * 0.03); // Up to 50% bonus toward higher levels
    const adjustedRoll = Math.min(1, roll + explorationBonus * Math.random());
    
    // Calculate final level with weighted distribution
    const levelRange = maxLevel - minLevel;
    const wildLevel = Math.floor(minLevel + adjustedRoll * levelRange);
    
    wildLevelRef.current = Math.max(1, Math.min(100, wildLevel));
    setWildBattleTarget(speciesId);
  };

  const handleCaptureSuccess = (species: { id: number; name: string; types: string[]; baseHp: number; startingMoves: string[]; learnableMoves: string[] }, ballsUsed: number) => {
    handleCaptureSuccessWithLevel(species, ballsUsed, 1);
  };

  // Handler for wild battle captures - preserves the level of the wild Pokemon
  const handleCaptureSuccessWithLevel = (species: { id: number; name: string; types: string[]; baseHp: number; startingMoves: string[]; learnableMoves: string[] }, ballsUsed: number, level: number) => {
    const pokemonSpecies = getPokemon(species.id);
    if (pokemonSpecies) {
      // Auto-discover pokemon in Pokedex when captured
      if (mode === "trainer") {
        const modeState = useModeStore.getState();
        const profileId = modeState.activeProfileId;
        const alreadyDiscovered = profileId ? (modeState.discoveredPokemon[profileId] || []).includes(species.id) : true;
        modeState.discoverPokemon(species.id);
        // Trigger reveal animation and switch to pokedex tab only if newly discovered
        if (!alreadyDiscovered) {
          modeState.triggerPokedexReveal(species.id);
          setActiveTab("pokedex");
        }
      }
      // Add to team (or reserves if team full) with the captured level
      const uid = addToTeamWithLevel(pokemonSpecies, level);
      if (uid) {
        // Calculate HP based on level (baseHp + level * 3 as per wild pokemon formula)
        const baseHp = pokemonSpecies.baseHp || 40;
        const maxHp = baseHp + level * 3;
        const state = useGameStore.getState();
        const mapHp = (p: typeof state.team[number]) =>
          p.uid === uid ? { ...p, maxHp: maxHp, currentHp: maxHp } : p;
        useGameStore.setState({
          team: state.team.map(mapHp),
          reserves: state.reserves.map(mapHp),
        });
      }

      // Grant exploration XP for radar capture
      const explorationXpGained = calculateExplorationXp(ballsUsed);
      const oldLevel = useGameStore.getState().trainer.explorationLevel ?? 1;
      const rewards = useGameStore.getState().addExplorationXp(explorationXpGained);
      const newLevel = useGameStore.getState().trainer.explorationLevel ?? 1;

      // Show exploration reward toast
      setExplorationRewardToast({
        xp: explorationXpGained,
        ballsUsed,
        rewards,
        newLevel,
        oldLevel,
      });
      setTimeout(() => setExplorationRewardToast(null), 6000);

      // Register daily streak — check if already captured today BEFORE registering
      const lastCaptureBefore = useGameStore.getState().trainer.lastCaptureDate;
      const todayStr = new Date().toISOString().slice(0, 10);
      const alreadyCapturedToday = lastCaptureBefore === todayStr;

      const streakResult = useGameStore.getState().registerDailyCapture();

      // Track weekly event progress
      useGameStore.getState().trackWeeklyCapture(species.types, ballsUsed);

      // Show streak toast only once per day (first capture)
      if (!alreadyCapturedToday) {
        let legendaryName: string | null = null;
        if (streakResult.legendaryId) {
          const leg = getPokemon(streakResult.legendaryId);
          legendaryName = leg?.name ?? null;
        }
        setStreakToast({
          streak: streakResult.newStreak,
          broken: streakResult.streakBroken,
          milestone: streakResult.milestoneReached,
          legendaryId: streakResult.legendaryId,
          legendaryName,
        });
        setTimeout(() => setStreakToast(null), streakResult.milestoneReached ? 9000 : 5000);
      }
    }
    setCaptureTarget(null);
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
  

  // Wild Battle mode
  if (wildBattleTarget !== null) {
    const wildSpecies = POKEMON.find((p) => p.id === wildBattleTarget);
    if (wildSpecies) {
      return (
        <main className="flex flex-col h-dvh max-w-md mx-auto bg-background">
          <WildBattleScene
            wildPokemon={wildSpecies}
            wildLevel={wildLevelRef.current}
            onClose={() => {
              useGameStore.getState().endBattle();
              setWildBattleTarget(null);
            }}
            onCapture={(speciesId, ballsUsed, level) => {
              const species = POKEMON.find((p) => p.id === speciesId);
              if (species) {
                handleCaptureSuccessWithLevel(species as any, ballsUsed, level);
              }
              useGameStore.getState().endBattle();
              setWildBattleTarget(null);
            }}
            onFled={() => {
              useGameStore.getState().endBattle();
              setWildBattleTarget(null);
            }}
          />
        </main>
      );
    }
  }

  // Capture mode
  if (captureTarget !== null) {
    const captureSpecies = POKEMON.find((p) => p.id === captureTarget);
    if (captureSpecies) {
      return (
        <CaptureScene
          pokemon={captureSpecies}
          onClose={() => setCaptureTarget(null)}
          onCaptured={handleCaptureSuccess}
        />
      );
    }
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
    <main className="flex flex-col h-dvh max-w-md mx-auto bg-background relative">
      {/* Daily Streak Toast */}
      {streakToast && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-[101] animate-in fade-in slide-in-from-top-4 duration-300 w-[300px]">
          {streakToast.milestone ? (
            // Milestone unlocked - special legendary toast
            <div className="bg-card border-2 border-amber-400/60 rounded-xl shadow-2xl p-4 text-center">
              <div className="text-2xl mb-1">🔥</div>
              <p className="text-sm font-bold text-amber-400">{streakToast.milestone} dias de ofensiva!</p>
              <p className="text-xs text-foreground mt-1">Pokemon Lendario liberado para captura!</p>
              {streakToast.legendaryName && (
                <div className="mt-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-400/30">
                  <p className="text-xs font-bold text-amber-300 capitalize">{streakToast.legendaryName} apareceu no Radar!</p>
                </div>
              )}
            </div>
          ) : streakToast.broken ? (
            // Streak broken
            <div className="bg-card border border-red-500/40 rounded-xl shadow-xl p-3 flex items-center gap-3">
              <div className="text-xl">💔</div>
              <div>
                <p className="text-xs font-bold text-red-400">Ofensiva quebrada!</p>
                <p className="text-[10px] text-muted-foreground">Capture 1 pokemon por dia para manter a ofensiva.</p>
              </div>
            </div>
          ) : (
            // Normal streak update
            <div className="bg-card border border-orange-500/30 rounded-xl shadow-xl p-3 flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="text-xl">🔥</span>
                <span className="text-lg font-black text-orange-400">{streakToast.streak}</span>
              </div>
              <div>
                <p className="text-xs font-bold text-orange-400">{streakToast.streak === 1 ? "Ofensiva iniciada!" : `${streakToast.streak} dias seguidos!`}</p>
                <p className="text-[10px] text-muted-foreground">
                  Proximo lendario em {30 - (streakToast.streak % 30)} dia{30 - (streakToast.streak % 30) !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Exploration XP Toast */}
      {explorationRewardToast && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-card border border-border rounded-xl shadow-2xl p-3 min-w-[260px] max-w-[320px]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Crosshair className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-400">
                  +{explorationRewardToast.xp} XP Exploracao
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {explorationRewardToast.ballsUsed === 1
                    ? "Captura perfeita! 1 pokebola"
                    : `${explorationRewardToast.ballsUsed} pokebolas usadas`}
                </p>
              </div>
            </div>
            {explorationRewardToast.newLevel > explorationRewardToast.oldLevel && (
              <div className="mb-2 px-2 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-xs font-bold text-emerald-400 text-center">
                  Explorador Nivel {explorationRewardToast.newLevel}!
                </p>
              </div>
            )}
            {explorationRewardToast.rewards.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {explorationRewardToast.rewards.map((r, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-foreground font-medium"
                  >
                    {r.type === "money"
                      ? `$${r.quantity.toLocaleString("pt-BR")}`
                      : `${r.itemName} x${r.quantity}`}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between p-3 border-b border-border bg-[#011a3b] ">
        <div className="flex items-center gap-2 ">
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
              {/* <div className="flex flex-col">
                <h1 className="text-xs font-bold text-foreground tracking-wide leading-none">
                  {activeProfile.name}
                </h1>
                <span className="text-[9px] text-muted-foreground">Treinador</span>
              </div> */}
            </button>
          ) : (
            <div className="flex items-center gap-2 ">
              <svg width="24" height="24" viewBox="0 0 100 100" className="shrink-0">
                <circle cx="50" cy="50" r="48" fill="hsl(var(--primary))" stroke="hsl(var(--border))" strokeWidth="3" />
                <rect x="2" y="48" width="96" height="4" fill="hsl(var(--foreground))" />
                <path d="M 2 50 A 48 48 0 0 0 98 50" fill="hsl(var(--foreground))" fillOpacity="0.9" />
                <circle cx="50" cy="50" r="14" fill="hsl(var(--foreground))" stroke="hsl(var(--foreground))" strokeWidth="3" />
                <circle cx="50" cy="50" r="7" fill="hsl(var(--card))" />
              </svg>
              <h1 className="text-sm font-bold text-foreground tracking-wide">
                Mestre
              </h1>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Quantidade de poeira estelar */}
         <div className="flex items-center gap-1.5 justify-between bg-secondary/50 rounded-full px-2.5 py-1">
            <StarIcon className="w-9 h-3 text-accent text-blue-300" />
            <span className="text-xs font-bold font-mono text-blue-300 text-accent">
             12000
            </span>
              {!useModeStore.getState().economyLocked && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setMoneyDialog(true)}
                  className="h-7 w-7 p-0 border-border text-foreground bg-transparent hover:bg-secondary"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              )}
          </div>
          <div className="flex items-center gap-1.5 bg-secondary/50 rounded-full px-2.5 py-1">
            <Coins className="w-3 h-3 text-accent" />
            <span className="text-xs font-bold font-mono text-accent">
              {"$"}{trainer.money.toLocaleString("pt-BR")}
            </span>
              {!useModeStore.getState().economyLocked && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setMoneyDialog(true)}
                  className="h-7 w-7 p-0 border-border text-foreground bg-transparent hover:bg-secondary"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              )}
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
      <div  className="flex-1  overflow-hidden">
        {activeTab === "profile" && <ProfileTab />}
        {activeTab === "team" && <TeamTab onStartBattle={(uid) => startBattle(uid)} onSwitchToPokedex={() => setActiveTab("pokedex")} />}
        {activeTab === "bag" && <BagTab />}
        {activeTab === "shop" && <ShopTab />}
        {activeTab === "moves" && <MovesDictionaryTab />}
        {activeTab === "settings" && <SettingsTab />}
        {activeTab === "pokedex" && (
          <PokedexTab
            onStartBattleWithPokemon={mode === "master" ? handleStartBattleWithPokemon : undefined}
            onStartCapture={mode === "trainer" ? handleStartCapture : undefined}
            onStartWildBattle={mode === "trainer" ? handleStartWildBattle : undefined}
          />
        )}
        {activeTab === "npcs" && (
          <NpcTab onStartBattleWithPokemon={handleStartBattleWithPokemon} />
        )}
      </div>

      {/* Bottom tab bar */}
        <nav style={{zIndex:200}} className="relative w-full   ">
            <div
              className="relative items-end bg-[#011a3b] shadow-2xl   overflow-visible"
              style={{
       
                borderTopWidth:1,
                display: "grid",
                gridTemplateColumns: "repeat(7, minmax(0,1fr))"
              }}
            >
            {([
          

            { id: "bag", label: "Bolsa", icon: ''},
            { id: "shop", label: "Loja", icon: ShopIcon },
            { id: "team", label: "Equipe", icon: TeamIcon },
            { id: "profile", label: "Perfil", icon: ProfileIcon },
            { id: "moves", label: "Golpes", icon: MovesIcon },
            { id: "pokedex", label: "Pokedex", icon: PokedexIcon },
            { id: "settings", label: "Config", icon: SettingsIcon },
        ]).map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id;

              return (
                <button
                  key={id}
                  onClick={() => {
                    playTabSwitch();
                    setActiveTab(id);
                  }}
                  className="relative flex-1 flex justify-center"
                >
                  {/* CONTAINER DO BOTÃO */}
                 <div className="flex flex-col items-center justify-end h-[48px]">

                      {/* CÍRCULO FLUTUANTE */}
                              <div style={{borderRadius:50 , borderTopColor:'gray',borderTopWidth:isActive?1:0}}
                                className={`
                                  relative
                                  flex flex-col items-center justify-center
                                  w-14 h-14 
                                  transition-all duration-300
                                  ${isActive
                                    ? "bg-[#011a3b]  scale-110 -translate-y-5"
                                    : "bg-transparent"}
                                `}
                              >
                                {/* ÍCONE */}
                                <img
                                  src={`/images/ico/${id}.png`}
                                  className={`
                                    transition-all duration-300
                                    ${isActive ? "w-8 h-8 -mt-3" : "w-5 h-5 opacity-80"}
                                  `}
                                />

                                {/* NOME DENTRO DO BOTÃO */}
                                <span
                                  className={`
                                    absolute bottom-1
                                    text-[7px] font-bold tracking-wide
                                    transition-all duration-300
                                    ${isActive
                                      ? "text-red-400 opacity-100"
                                      : "text-slate-300 opacity-0"}
                                  `}
                                >
                                  {label}
                                </span>
                              </div>

                     

                        </div>
                            <span
                                  className={`
                                    absolute bottom-1
                                    text-[7px] font-bold tracking-wide
                                    transition-all duration-300
                                    ${!isActive
                                      ? "text-slate-400 opacity-100"
                                      : "text-red-300 opacity-0"}
                                  `}
                                >
                                  {label}
                                </span>

           
                </button>
              );
            })}
          </div>
                  {/* Add Money Dialog */}
        <Dialog open={moneyDialog} onOpenChange={setMoneyDialog}>
          <DialogContent className="bg-card border-border text-foreground max-w-sm mx-auto">
            <DialogHeader>
              <DialogTitle className="text-foreground">Receber Dinheiro</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">Quanto dinheiro o treinador recebeu?</p>
            <div className="flex gap-2 flex-wrap">
              {[100, 500, 1000, 2000, 5000].map((val) => (
                <Button
                  key={val}
                  size="sm"
                  variant="outline"
                  onClick={() => setMoneyAmount(String(val))}
                  className={`border-border bg-transparent hover:bg-secondary ${
                    moneyAmount === String(val) ? "text-accent border-accent" : "text-foreground"
                  }`}
                >
                  {"$"}{val.toLocaleString("pt-BR")}
                </Button>
              ))}
            </div>
            <Input
              type="number"
              value={moneyAmount}
              onChange={(e) => setMoneyAmount(e.target.value)}
              placeholder="Valor personalizado"
              className="bg-secondary border-border text-foreground"
            />
            <Button
              onClick={handleAddMoney}
              disabled={!moneyAmount || parseInt(moneyAmount) <= 0}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Coins className="w-4 h-4 mr-2" />
              Receber {"$"}{parseInt(moneyAmount || "0").toLocaleString("pt-BR")}
            </Button>
          </DialogContent>
        </Dialog>
        </nav>
    </main>
  );
}

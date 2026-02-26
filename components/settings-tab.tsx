"use client";

import { useState } from "react";
import { useGameStore } from "@/lib/game-store";
import { useModeStore } from "@/lib/mode-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Settings, Eye, EyeOff, Volume2, VolumeX, Hash, Lock, X, Coins, ShieldOff, Zap } from "lucide-react";
import { playButtonClick } from "@/lib/sounds";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const DISCOVER_SECRET = "dittocujo";
const ECONOMY_SECRET = "maodevaca";
const XP_SECRET = "maximo";

export function SettingsTab() {
  const { showBattleCards, toggleBattleCards } = useGameStore();
  const [musicMuted, setMusicMuted] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("pokerpg-music-muted") === "true";
    }
    return false;
  });
  const [discoverByNumber, setDiscoverByNumber] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("pokerpg-discover-by-number") === "true";
    }
    return false;
  });
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  // Economy lock
  const { economyLocked, setEconomyLocked, xpLocked, setXpLocked } = useModeStore();
  const [showEconomyPasswordPrompt, setShowEconomyPasswordPrompt] = useState(false);
  const [economyPasswordInput, setEconomyPasswordInput] = useState("");
  const [economyPasswordError, setEconomyPasswordError] = useState(false);

  // XP lock
  const [showXpPasswordPrompt, setShowXpPasswordPrompt] = useState(false);
  const [xpPasswordInput, setXpPasswordInput] = useState("");
  const [xpPasswordError, setXpPasswordError] = useState(false);

  const toggleMusic = () => {
    const newVal = !musicMuted;
    setMusicMuted(newVal);
    localStorage.setItem("pokerpg-music-muted", String(newVal));
    window.dispatchEvent(new Event("pokerpg-music-toggle"));
  };

  const handleDiscoverToggle = () => {
    playButtonClick();
    if (discoverByNumber) {
      // Turning off doesn't need password
      setDiscoverByNumber(false);
      localStorage.setItem("pokerpg-discover-by-number", "false");
      window.dispatchEvent(new Event("pokerpg-discover-toggle"));
    } else {
      // Turning on requires password
      setShowPasswordPrompt(true);
      setPasswordInput("");
      setPasswordError(false);
    }
  };

  const handlePasswordSubmit = () => {
    if (passwordInput.toLowerCase().trim() === DISCOVER_SECRET) {
      setDiscoverByNumber(true);
      localStorage.setItem("pokerpg-discover-by-number", "true");
      window.dispatchEvent(new Event("pokerpg-discover-toggle"));
      setShowPasswordPrompt(false);
      setPasswordInput("");
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setPasswordInput("");
    }
  };

  const handleEconomyToggle = () => {
    playButtonClick();
    if (!economyLocked) {
      // Locking doesn't need password
      setEconomyLocked(true);
    } else {
      // Unlocking requires password
      setShowEconomyPasswordPrompt(true);
      setEconomyPasswordInput("");
      setEconomyPasswordError(false);
    }
  };

  const handleEconomyPasswordSubmit = () => {
    if (economyPasswordInput.toLowerCase().trim() === ECONOMY_SECRET) {
      setEconomyLocked(false);
      setShowEconomyPasswordPrompt(false);
      setEconomyPasswordInput("");
      setEconomyPasswordError(false);
    } else {
      setEconomyPasswordError(true);
      setEconomyPasswordInput("");
    }
  };

  const handleXpToggle = () => {
    playButtonClick();
    if (!xpLocked) {
      // Locking doesn't need password
      setXpLocked(true);
    } else {
      // Unlocking requires password
      setShowXpPasswordPrompt(true);
      setXpPasswordInput("");
      setXpPasswordError(false);
    }
  };

  const handleXpPasswordSubmit = () => {
    if (xpPasswordInput.toLowerCase().trim() === XP_SECRET) {
      setXpLocked(false);
      setShowXpPasswordPrompt(false);
      setXpPasswordInput("");
      setXpPasswordError(false);
    } else {
      setXpPasswordError(true);
      setXpPasswordInput("");
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-4 p-4">
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Configurações</h3>
          </div>

          <div className="p-4 flex flex-col gap-4">
            {/* Battle Cards Toggle */}
            <div className="bg-secondary/50 rounded-lg p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {showBattleCards ? (
                      <Eye className="w-4 h-4 text-accent" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    )}
                    <h4 className="font-medium text-foreground text-sm">
                      Sistema de Cartas
                    </h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {showBattleCards
                      ? "As cartas estão ativas. Os golpes podem ser usados quando você tem as cartas corretas."
                      : "As cartas estão desativadas. O jogo usa o sistema de PP (Power Points) para limitar o uso dos golpes."}
                  </p>
                </div>
                <button
                  onClick={() => {
                    playButtonClick();
                    toggleBattleCards();
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                    showBattleCards
                      ? "bg-primary border-primary"
                      : "bg-secondary border-border"
                  }`}
                  role="switch"
                  aria-checked={showBattleCards}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out ${
                      showBattleCards ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="mt-3 pt-3 border-t border-border/50">
                <div className="flex items-center gap-2 text-xs">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      showBattleCards ? "bg-accent" : "bg-muted-foreground"
                    }`}
                  />
                  <span className="text-muted-foreground">
                    Status:{" "}
                    <span className="font-medium text-foreground">
                      {showBattleCards ? "Cartas Ativas" : "PP (Power Points)"}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Music Toggle */}
            <div className="bg-secondary/50 rounded-lg p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {musicMuted ? (
                      <VolumeX className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-accent" />
                    )}
                    <h4 className="font-medium text-foreground text-sm">
                      Musica
                    </h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {musicMuted
                      ? "A musica esta desligada. Nenhuma trilha sonora sera tocada."
                      : "A musica esta ligada. Trilhas sonoras tocam na tela inicial e durante batalhas."}
                  </p>
                </div>
                <button
                  onClick={() => {
                    playButtonClick();
                    toggleMusic();
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                    !musicMuted
                      ? "bg-primary border-primary"
                      : "bg-secondary border-border"
                  }`}
                  role="switch"
                  aria-checked={!musicMuted}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out ${
                      !musicMuted ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="mt-3 pt-3 border-t border-border/50">
                <div className="flex items-center gap-2 text-xs">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      !musicMuted ? "bg-accent" : "bg-muted-foreground"
                    }`}
                  />
                  <span className="text-muted-foreground">
                    Status:{" "}
                    <span className="font-medium text-foreground">
                      {musicMuted ? "Desligada" : "Ligada"}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Discover by Number Toggle */}
            <div className="bg-secondary/50 rounded-lg p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {discoverByNumber ? (
                      <Hash className="w-4 h-4 text-accent" />
                    ) : (
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    )}
                    <h4 className="font-medium text-foreground text-sm">
                      Descobrir por Numero
                    </h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {discoverByNumber
                      ? "Ativo. Voce pode descobrir Pokemon digitando o numero na Pokedex."
                      : "Desativado. Use o Radar de Exploracao para encontrar Pokemon."}
                  </p>
                </div>
                <button
                  onClick={handleDiscoverToggle}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                    discoverByNumber
                      ? "bg-primary border-primary"
                      : "bg-secondary border-border"
                  }`}
                  role="switch"
                  aria-checked={discoverByNumber}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out ${
                      discoverByNumber ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="mt-3 pt-3 border-t border-border/50">
                <div className="flex items-center gap-2 text-xs">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      discoverByNumber ? "bg-accent" : "bg-muted-foreground"
                    }`}
                  />
                  <span className="text-muted-foreground">
                    Status:{" "}
                    <span className="font-medium text-foreground">
                      {discoverByNumber ? "Desbloqueado" : "Bloqueado"}
                    </span>
                  </span>
                </div>
              </div>

              {/* Password Prompt Overlay */}
              {showPasswordPrompt && (
                <div className="mt-3 pt-3 border-t border-border/50">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-xs font-medium text-amber-400">
                        Digite a senha para desbloquear
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        type="password"
                        placeholder="Senha..."
                        value={passwordInput}
                        onChange={(e) => {
                          setPasswordInput(e.target.value);
                          setPasswordError(false);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handlePasswordSubmit();
                        }}
                        className={`bg-background border-border text-foreground flex-1 h-8 text-sm ${
                          passwordError ? "border-red-500 ring-1 ring-red-500" : ""
                        }`}
                        autoFocus
                      />
                      <Button
                        onClick={handlePasswordSubmit}
                        disabled={!passwordInput}
                        size="sm"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 text-xs"
                      >
                        OK
                      </Button>
                      <Button
                        onClick={() => {
                          setShowPasswordPrompt(false);
                          setPasswordInput("");
                          setPasswordError(false);
                        }}
                        size="sm"
                        variant="ghost"
                        className="h-8 px-2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    {passwordError && (
                      <p className="text-xs text-red-400 font-medium">
                        Senha incorreta. Tente novamente.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Economy Lock Toggle */}
            <div className="bg-secondary/50 rounded-lg p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {economyLocked ? (
                      <Lock className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Coins className="w-4 h-4 text-accent" />
                    )}
                    <h4 className="font-medium text-foreground text-sm">
                      Bloqueio de Economia
                    </h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {economyLocked
                      ? "Bloqueado. Adicao manual de dinheiro e itens esta desativada. Use o Radar para encontrar recompensas."
                      : "Desbloqueado. Adicao manual de dinheiro e itens esta liberada."}
                  </p>
                </div>
                <button
                  onClick={handleEconomyToggle}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                    !economyLocked
                      ? "bg-primary border-primary"
                      : "bg-secondary border-border"
                  }`}
                  role="switch"
                  aria-checked={!economyLocked}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out ${
                      !economyLocked ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="mt-3 pt-3 border-t border-border/50">
                <div className="flex items-center gap-2 text-xs">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      !economyLocked ? "bg-accent" : "bg-amber-400"
                    }`}
                  />
                  <span className="text-muted-foreground">
                    Status:{" "}
                    <span className="font-medium text-foreground">
                      {economyLocked ? "Bloqueado" : "Desbloqueado"}
                    </span>
                  </span>
                </div>
              </div>

              {/* Economy Password Prompt */}
              {showEconomyPasswordPrompt && (
                <div className="mt-3 pt-3 border-t border-border/50">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-xs font-medium text-amber-400">
                        Digite a senha para desbloquear
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        type="password"
                        placeholder="Senha..."
                        value={economyPasswordInput}
                        onChange={(e) => {
                          setEconomyPasswordInput(e.target.value);
                          setEconomyPasswordError(false);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleEconomyPasswordSubmit();
                        }}
                        className={`bg-background border-border text-foreground flex-1 h-8 text-sm ${
                          economyPasswordError ? "border-red-500 ring-1 ring-red-500" : ""
                        }`}
                        autoFocus
                      />
                      <Button
                        onClick={handleEconomyPasswordSubmit}
                        disabled={!economyPasswordInput}
                        size="sm"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 text-xs"
                      >
                        OK
                      </Button>
                      <Button
                        onClick={() => {
                          setShowEconomyPasswordPrompt(false);
                          setEconomyPasswordInput("");
                          setEconomyPasswordError(false);
                        }}
                        size="sm"
                        variant="ghost"
                        className="h-8 px-2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    {economyPasswordError && (
                      <p className="text-xs text-red-400 font-medium">
                        Senha incorreta. Tente novamente.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* XP Lock Toggle */}
            <div className="bg-secondary/50 rounded-lg p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {xpLocked ? (
                      <Lock className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Zap className="w-4 h-4 text-accent" />
                    )}
                    <h4 className="font-medium text-foreground text-sm">
                      Bloqueio de XP
                    </h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {xpLocked
                      ? "Bloqueado. Adicao manual de XP esta desativada. Ganhe XP atraves de batalhas."
                      : "Desbloqueado. Adicao manual de XP esta liberada."}
                  </p>
                </div>
                <button
                  onClick={handleXpToggle}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                    !xpLocked
                      ? "bg-primary border-primary"
                      : "bg-secondary border-border"
                  }`}
                  role="switch"
                  aria-checked={!xpLocked}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out ${
                      !xpLocked ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="mt-3 pt-3 border-t border-border/50">
                <div className="flex items-center gap-2 text-xs">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      !xpLocked ? "bg-accent" : "bg-amber-400"
                    }`}
                  />
                  <span className="text-muted-foreground">
                    Status:{" "}
                    <span className="font-medium text-foreground">
                      {xpLocked ? "Bloqueado" : "Desbloqueado"}
                    </span>
                  </span>
                </div>
              </div>

              {/* XP Password Prompt */}
              {showXpPasswordPrompt && (
                <div className="mt-3 pt-3 border-t border-border/50">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-xs font-medium text-amber-400">
                        Digite a senha para desbloquear
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        type="password"
                        placeholder="Senha..."
                        value={xpPasswordInput}
                        onChange={(e) => {
                          setXpPasswordInput(e.target.value);
                          setXpPasswordError(false);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleXpPasswordSubmit();
                        }}
                        className={`bg-background border-border text-foreground flex-1 h-8 text-sm ${
                          xpPasswordError ? "border-red-500 ring-1 ring-red-500" : ""
                        }`}
                        autoFocus
                      />
                      <Button
                        onClick={handleXpPasswordSubmit}
                        disabled={!xpPasswordInput}
                        size="sm"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 text-xs"
                      >
                        OK
                      </Button>
                      <Button
                        onClick={() => {
                          setShowXpPasswordPrompt(false);
                          setXpPasswordInput("");
                          setXpPasswordError(false);
                        }}
                        size="sm"
                        variant="ghost"
                        className="h-8 px-2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    {xpPasswordError && (
                      <p className="text-xs text-red-400 font-medium">
                        Senha incorreta. Tente novamente.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <p className="text-xs text-blue-200 leading-relaxed">
                <strong className="font-semibold">Dica:</strong> Desative as
                cartas se preferir jogar com o sistema classico de PP, onde cada
                golpe tem um numero limitado de usos por batalha.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

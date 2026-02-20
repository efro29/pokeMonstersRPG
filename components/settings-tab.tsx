"use client";

import { useGameStore } from "@/lib/game-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Settings, Eye, EyeOff } from "lucide-react";
import { playButtonClick } from "@/lib/sounds";

export function SettingsTab() {
  const { showBattleCards, toggleBattleCards } = useGameStore();

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

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <p className="text-xs text-blue-200 leading-relaxed">
                <strong className="font-semibold">Dica:</strong> Desative as
                cartas se preferir jogar com o sistema clássico de PP, onde cada
                golpe tem um número limitado de usos por batalha.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

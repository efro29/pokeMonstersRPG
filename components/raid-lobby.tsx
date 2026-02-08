"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRaidStore } from "@/lib/raid-store";
import { useGameStore } from "@/lib/game-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  Copy,
  Check,
  Crown,
  Shield,
  Users,
  Wifi,
  Loader2,
  Swords,
} from "lucide-react";
import { playButtonClick, playStartGame } from "@/lib/sounds";

interface RaidLobbyProps {
  onBack: () => void;
}

export function RaidLobby({ onBack }: RaidLobbyProps) {
  const { team, trainer } = useGameStore();
  const {
    screen,
    room,
    players,
    myPlayer,
    isLoading,
    error,
    setScreen,
    setError,
    createRoom,
    joinRoom,
    sendAction,
    leaveRaid,
    fetchRoom,
    subscribeRealtime,
  } = useRaidStore();

  const [playerName, setPlayerName] = useState(trainer.name || "");
  const [roomCode, setRoomCode] = useState("");
  const [copied, setCopied] = useState(false);

  // Subscribe to realtime updates when in lobby
  useEffect(() => {
    if (screen === "lobby" && room) {
      const unsub = subscribeRealtime();
      // Also poll every 3s as backup
      const interval = setInterval(fetchRoom, 3000);
      return () => {
        unsub();
        clearInterval(interval);
      };
    }
  }, [screen, room?.id, subscribeRealtime, fetchRoom]);

  const handleCopyCode = () => {
    if (room?.room_code) {
      navigator.clipboard.writeText(room.room_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCreateRoom = () => {
    if (!playerName.trim()) {
      setError("Digite seu nome");
      return;
    }
    playStartGame();
    const pokemonData = team.map((p) => ({
      uid: p.uid,
      speciesId: p.speciesId,
      name: p.name,
      level: p.level,
      maxHp: p.maxHp,
      currentHp: p.currentHp,
      moves: p.moves,
    }));
    createRoom(playerName.trim(), pokemonData);
  };

  const handleJoinRoom = () => {
    if (!playerName.trim() || !roomCode.trim()) {
      setError("Digite seu nome e o codigo da sala");
      return;
    }
    playStartGame();
    const pokemonData = team.map((p) => ({
      uid: p.uid,
      speciesId: p.speciesId,
      name: p.name,
      level: p.level,
      maxHp: p.maxHp,
      currentHp: p.currentHp,
      moves: p.moves,
    }));
    joinRoom(roomCode.trim().toUpperCase(), playerName.trim(), pokemonData);
  };

  const handleReady = () => {
    playButtonClick();
    const pokemonData = team.map((p) => ({
      uid: p.uid,
      speciesId: p.speciesId,
      name: p.name,
      level: p.level,
      maxHp: p.maxHp,
      currentHp: p.currentHp,
      moves: p.moves,
    }));
    sendAction("ready", { pokemonData });
  };

  const handleStartBattle = () => {
    playStartGame();
    const masterPokemon = team.map((p) => ({
      uid: p.uid,
      speciesId: p.speciesId,
      name: p.name,
      level: p.level,
      maxHp: p.maxHp,
      currentHp: p.maxHp,
      moves: p.moves,
    }));
    sendAction("start_battle", { masterPokemon });
  };

  const handleLeave = () => {
    playButtonClick();
    leaveRaid();
    onBack();
  };

  const trainers = players.filter((p) => p.role === "trainer");
  const master = players.find((p) => p.role === "master");
  const allTrainersReady = trainers.length > 0 && trainers.every((p) => p.is_ready);
  const isMaster = myPlayer?.role === "master";

  // Raid menu screen
  if (screen === "menu") {
    return (
      <div
        className="flex flex-col h-dvh max-w-md mx-auto relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #0c1220 0%, #1a1a3e 40%, #2d1b4e 70%, #0c1220 100%)",
        }}
      >
        <div className="flex items-center gap-3 p-3 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleLeave}
            className="text-foreground hover:bg-white/5"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Swords className="w-5 h-5" style={{ color: "#F59E0B" }} />
          <span className="font-pixel text-xs tracking-wider" style={{ color: "#F59E0B" }}>
            MODO RAID
          </span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12 }}
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "rgba(245, 158, 11, 0.15)", border: "2px solid rgba(245, 158, 11, 0.3)" }}
          >
            <Wifi className="w-10 h-10" style={{ color: "#F59E0B" }} />
          </motion.div>

          <div className="text-center">
            <h2 className="font-pixel text-sm tracking-wider mb-2" style={{ color: "#ffffff" }}>
              BATALHA RAID
            </h2>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
              4 Treinadores vs 1 Mestre
            </p>
          </div>

          <div className="w-full max-w-xs space-y-3">
            <Input
              placeholder="Seu nome de treinador"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="bg-white/5 border-white/10 text-foreground text-center font-pixel text-xs"
            />

            <Button
              onClick={() => { playButtonClick(); setScreen("create"); }}
              className="w-full h-14 font-pixel text-xs tracking-wider"
              style={{ backgroundColor: "#F59E0B", color: "#0c1220" }}
            >
              <Crown className="w-5 h-5 mr-2" />
              CRIAR SALA (MESTRE)
            </Button>

            <Button
              onClick={() => { playButtonClick(); setScreen("join"); }}
              variant="outline"
              className="w-full h-14 font-pixel text-xs tracking-wider border-white/20 text-foreground bg-transparent hover:bg-white/5"
            >
              <Shield className="w-5 h-5 mr-2" />
              ENTRAR EM SALA (TREINADOR)
            </Button>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-center"
              style={{ color: "#EF4444" }}
            >
              {error}
            </motion.p>
          )}
        </div>
      </div>
    );
  }

  // Create room screen
  if (screen === "create") {
    return (
      <div
        className="flex flex-col h-dvh max-w-md mx-auto relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #0c1220 0%, #1a1a3e 40%, #2d1b4e 70%, #0c1220 100%)",
        }}
      >
        <div className="flex items-center gap-3 p-3 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => { playButtonClick(); setScreen("menu"); }}
            className="text-foreground hover:bg-white/5"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Crown className="w-5 h-5" style={{ color: "#F59E0B" }} />
          <span className="font-pixel text-xs tracking-wider" style={{ color: "#F59E0B" }}>
            CRIAR SALA
          </span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
          <div className="text-center">
            <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>
              Voce sera o Mestre da batalha RAID. Os treinadores vao lutar contra os Pokemon da sua equipe.
            </p>
            {team.length === 0 && (
              <p className="text-xs" style={{ color: "#EF4444" }}>
                Atencao: Voce nao tem Pokemon na equipe. Adicione Pokemon antes de criar a sala.
              </p>
            )}
            {team.length > 0 && (
              <div className="text-left bg-white/5 rounded-xl p-3 mt-2">
                <p className="text-[10px] font-pixel mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>
                  SUA EQUIPE ({team.length}):
                </p>
                {team.map((p) => (
                  <div key={p.uid} className="flex items-center gap-2 py-1">
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.speciesId}.png`}
                      alt={p.name}
                      width={24}
                      height={24}
                      className="pixelated"
                      crossOrigin="anonymous"
                    />
                    <span className="text-xs text-foreground">{p.name}</span>
                    <span className="text-[10px] text-muted-foreground ml-auto">
                      Lv.{p.level}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            onClick={handleCreateRoom}
            disabled={isLoading || team.length === 0}
            className="w-full max-w-xs h-14 font-pixel text-xs tracking-wider"
            style={{ backgroundColor: "#F59E0B", color: "#0c1220" }}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Swords className="w-5 h-5 mr-2" />
                CRIAR SALA RAID
              </>
            )}
          </Button>

          {error && (
            <p className="text-xs text-center" style={{ color: "#EF4444" }}>
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Join room screen
  if (screen === "join") {
    return (
      <div
        className="flex flex-col h-dvh max-w-md mx-auto relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #0c1220 0%, #1a1a3e 40%, #2d1b4e 70%, #0c1220 100%)",
        }}
      >
        <div className="flex items-center gap-3 p-3 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => { playButtonClick(); setScreen("menu"); }}
            className="text-foreground hover:bg-white/5"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Shield className="w-5 h-5" style={{ color: "#3B82F6" }} />
          <span className="font-pixel text-xs tracking-wider" style={{ color: "#3B82F6" }}>
            ENTRAR NA SALA
          </span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
          <div className="text-center">
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
              Digite o codigo da sala que o Mestre compartilhou
            </p>
          </div>

          <Input
            placeholder="CODIGO DA SALA"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            maxLength={6}
            className="bg-white/5 border-white/10 text-foreground text-center font-pixel text-lg tracking-[0.3em] w-full max-w-xs uppercase"
          />

          <Button
            onClick={handleJoinRoom}
            disabled={isLoading || !roomCode.trim()}
            className="w-full max-w-xs h-14 font-pixel text-xs tracking-wider"
            style={{ backgroundColor: "#3B82F6", color: "#ffffff" }}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Users className="w-5 h-5 mr-2" />
                ENTRAR NA SALA
              </>
            )}
          </Button>

          {error && (
            <p className="text-xs text-center" style={{ color: "#EF4444" }}>
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Lobby (waiting room)
  if (screen === "lobby") {
    return (
      <div
        className="flex flex-col h-dvh max-w-md mx-auto relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #0c1220 0%, #1a1a3e 40%, #2d1b4e 70%, #0c1220 100%)",
        }}
      >
        <div className="flex items-center gap-3 p-3 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleLeave}
            className="text-foreground hover:bg-white/5"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Wifi className="w-5 h-5" style={{ color: "#22C55E" }} />
          <span className="font-pixel text-xs tracking-wider" style={{ color: "#22C55E" }}>
            SALA RAID
          </span>
        </div>

        <div className="flex-1 px-4 py-4 overflow-y-auto">
          {/* Room code */}
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-6"
          >
            <p className="text-[10px] font-pixel mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>
              CODIGO DA SALA
            </p>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-2 mx-auto px-4 py-2 rounded-lg transition-all active:scale-95"
              style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              <span className="font-pixel text-2xl tracking-[0.4em]" style={{ color: "#F59E0B" }}>
                {room?.room_code}
              </span>
              {copied ? (
                <Check className="w-4 h-4" style={{ color: "#22C55E" }} />
              ) : (
                <Copy className="w-4 h-4" style={{ color: "rgba(255,255,255,0.4)" }} />
              )}
            </button>
            <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
              Compartilhe este codigo com os treinadores
            </p>
          </motion.div>

          {/* Players list */}
          <div className="space-y-2 mb-6">
            <p className="text-[10px] font-pixel" style={{ color: "rgba(255,255,255,0.4)" }}>
              JOGADORES ({players.length}/5)
            </p>

            <AnimatePresence>
              {/* Master */}
              {master && (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{
                    backgroundColor: "rgba(245, 158, 11, 0.08)",
                    border: "1px solid rgba(245, 158, 11, 0.2)",
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "rgba(245, 158, 11, 0.2)" }}
                  >
                    <Crown className="w-4 h-4" style={{ color: "#F59E0B" }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">{master.player_name}</p>
                    <p className="text-[10px]" style={{ color: "#F59E0B" }}>Mestre</p>
                  </div>
                  {master.id === myPlayer?.id && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
                      VOCE
                    </span>
                  )}
                </motion.div>
              )}

              {/* Trainers */}
              {trainers.map((player, i) => (
                <motion.div
                  key={player.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: (i + 1) * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{
                    backgroundColor: "rgba(59, 130, 246, 0.08)",
                    border: `1px solid ${player.is_ready ? "rgba(34, 197, 94, 0.3)" : "rgba(59, 130, 246, 0.2)"}`,
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "rgba(59, 130, 246, 0.2)" }}
                  >
                    <Shield className="w-4 h-4" style={{ color: "#3B82F6" }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">{player.player_name}</p>
                    <p className="text-[10px]" style={{ color: "#3B82F6" }}>Treinador</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {player.id === myPlayer?.id && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
                        VOCE
                      </span>
                    )}
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: player.is_ready ? "rgba(34, 197, 94, 0.15)" : "rgba(255,255,255,0.05)",
                        color: player.is_ready ? "#22C55E" : "rgba(255,255,255,0.3)",
                      }}
                    >
                      {player.is_ready ? "PRONTO" : "AGUARDANDO"}
                    </span>
                  </div>
                </motion.div>
              ))}

              {/* Empty slots */}
              {Array.from({ length: Math.max(0, 4 - trainers.length) }).map((_, i) => (
                <motion.div
                  key={`empty-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: (trainers.length + i + 1) * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-xl border border-dashed"
                  style={{ borderColor: "rgba(255,255,255,0.1)" }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                  >
                    <Users className="w-4 h-4" style={{ color: "rgba(255,255,255,0.2)" }} />
                  </div>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
                    Aguardando treinador...
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Waiting animation */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "#22C55E" }}
            />
            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
              {room?.status === "waiting" ? "Aguardando jogadores..." : "Conectado"}
            </span>
          </div>
        </div>

        {/* Bottom actions */}
        <div className="p-4 border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          {isMaster ? (
            <Button
              onClick={handleStartBattle}
              disabled={isLoading || !allTrainersReady || trainers.length === 0}
              className="w-full h-14 font-pixel text-xs tracking-wider"
              style={{ backgroundColor: allTrainersReady && trainers.length > 0 ? "#EF4444" : "rgba(255,255,255,0.1)", color: allTrainersReady && trainers.length > 0 ? "#ffffff" : "rgba(255,255,255,0.3)" }}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Swords className="w-5 h-5 mr-2" />
                  {trainers.length === 0 ? "AGUARDANDO TREINADORES" : !allTrainersReady ? "AGUARDANDO TODOS FICAREM PRONTOS" : "INICIAR BATALHA!"}
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleReady}
              disabled={isLoading || myPlayer?.is_ready}
              className="w-full h-14 font-pixel text-xs tracking-wider"
              style={{
                backgroundColor: myPlayer?.is_ready ? "rgba(34, 197, 94, 0.15)" : "#22C55E",
                color: myPlayer?.is_ready ? "#22C55E" : "#ffffff",
              }}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : myPlayer?.is_ready ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  PRONTO! AGUARDANDO MESTRE...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5 mr-2" />
                  ESTOU PRONTO!
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return null;
}

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json();
  const { roomId, playerId, playerToken, actionType, actionData } = body;

  if (!roomId || !playerId || !playerToken) {
    return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
  }

  // Validate player token
  const { data: player } = await supabase
    .from("raid_players")
    .select("*")
    .eq("id", playerId)
    .eq("player_token", playerToken)
    .single();

  if (!player) {
    return NextResponse.json({ error: "Jogador nao autorizado" }, { status: 403 });
  }

  // Get room
  const { data: room } = await supabase
    .from("raid_rooms")
    .select("*")
    .eq("id", roomId)
    .single();

  if (!room) {
    return NextResponse.json({ error: "Sala nao encontrada" }, { status: 404 });
  }

  // Handle different action types
  switch (actionType) {
    case "ready": {
      await supabase
        .from("raid_players")
        .update({ is_ready: true, pokemon_data: actionData?.pokemonData || player.pokemon_data })
        .eq("id", playerId);
      break;
    }

    case "start_battle": {
      if (player.role !== "master") {
        return NextResponse.json({ error: "Apenas o mestre pode iniciar" }, { status: 403 });
      }

      const { data: allPlayers } = await supabase
        .from("raid_players")
        .select("*")
        .eq("room_id", roomId);

      const trainers = allPlayers?.filter((p) => p.role === "trainer") || [];
      const allReady = trainers.every((p) => p.is_ready);

      if (!allReady || trainers.length === 0) {
        return NextResponse.json({ error: "Nem todos os treinadores estao prontos" }, { status: 400 });
      }

      // Set first trainer as current turn
      const firstTrainer = trainers[0];

      await supabase
        .from("raid_rooms")
        .update({
          status: "battle",
          current_turn_player_id: firstTrainer.id,
          turn_number: 1,
          master_pokemon: actionData?.masterPokemon || room.master_pokemon,
        })
        .eq("id", roomId);

      await supabase.from("raid_battle_log").insert({
        room_id: roomId,
        player_id: playerId,
        player_name: player.player_name,
        turn_number: 1,
        action_type: "system",
        action_data: { message: "A batalha RAID comecou!" },
      });
      break;
    }

    case "attack": {
      // Log the attack
      await supabase.from("raid_battle_log").insert({
        room_id: roomId,
        player_id: playerId,
        player_name: player.player_name,
        turn_number: room.turn_number,
        action_type: "attack",
        action_data: actionData,
      });

      // Move to next turn
      const { data: allPlayers } = await supabase
        .from("raid_players")
        .select("*")
        .eq("room_id", roomId)
        .order("joined_at", { ascending: true });

      const trainers = allPlayers?.filter((p) => p.role === "trainer") || [];
      const currentIdx = trainers.findIndex((p) => p.id === playerId);
      const nextIdx = currentIdx + 1;

      if (nextIdx < trainers.length) {
        // Next trainer's turn
        await supabase
          .from("raid_rooms")
          .update({ current_turn_player_id: trainers[nextIdx].id })
          .eq("id", roomId);
      } else {
        // All trainers have attacked, master's turn
        const master = allPlayers?.find((p) => p.role === "master");
        if (master) {
          await supabase
            .from("raid_rooms")
            .update({ current_turn_player_id: master.id })
            .eq("id", roomId);
        }
      }
      break;
    }

    case "master_attack": {
      if (player.role !== "master") {
        return NextResponse.json({ error: "Apenas o mestre pode atacar" }, { status: 403 });
      }

      await supabase.from("raid_battle_log").insert({
        room_id: roomId,
        player_id: playerId,
        player_name: player.player_name,
        turn_number: room.turn_number,
        action_type: "master_attack",
        action_data: actionData,
      });

      // Move back to first trainer
      const { data: allPlayers } = await supabase
        .from("raid_players")
        .select("*")
        .eq("room_id", roomId)
        .order("joined_at", { ascending: true });

      const trainers = allPlayers?.filter((p) => p.role === "trainer") || [];
      if (trainers.length > 0) {
        await supabase
          .from("raid_rooms")
          .update({
            current_turn_player_id: trainers[0].id,
            turn_number: room.turn_number + 1,
          })
          .eq("id", roomId);
      }
      break;
    }

    case "damage": {
      // Apply damage to a player's pokemon
      await supabase
        .from("raid_players")
        .update({
          current_hp: Math.max(0, player.current_hp - (actionData?.damage || 0)),
        })
        .eq("id", actionData?.targetPlayerId || playerId);

      await supabase.from("raid_battle_log").insert({
        room_id: roomId,
        player_id: playerId,
        player_name: player.player_name,
        turn_number: room.turn_number,
        action_type: "damage",
        action_data: actionData,
      });
      break;
    }

    case "end_battle": {
      if (player.role !== "master") {
        return NextResponse.json({ error: "Apenas o mestre pode encerrar" }, { status: 403 });
      }
      await supabase
        .from("raid_rooms")
        .update({ status: "finished" })
        .eq("id", roomId);

      await supabase.from("raid_battle_log").insert({
        room_id: roomId,
        player_id: playerId,
        player_name: player.player_name,
        turn_number: room.turn_number,
        action_type: "system",
        action_data: { message: "A batalha RAID terminou!" },
      });
      break;
    }
  }

  // Fetch updated state
  const { data: updatedRoom } = await supabase
    .from("raid_rooms")
    .select("*")
    .eq("id", roomId)
    .single();

  const { data: updatedPlayers } = await supabase
    .from("raid_players")
    .select("*")
    .eq("room_id", roomId)
    .order("joined_at", { ascending: true });

  return NextResponse.json({ room: updatedRoom, players: updatedPlayers });
}

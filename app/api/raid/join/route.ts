import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json();
  const { roomCode, playerName, pokemonData } = body;

  if (!roomCode || !playerName) {
    return NextResponse.json({ error: "Codigo e nome obrigatorios" }, { status: 400 });
  }

  // Find room
  const { data: room, error: roomError } = await supabase
    .from("raid_rooms")
    .select("*")
    .eq("room_code", roomCode.toUpperCase())
    .single();

  if (roomError || !room) {
    return NextResponse.json({ error: "Sala nao encontrada" }, { status: 404 });
  }

  if (room.status !== "waiting") {
    return NextResponse.json({ error: "Sala ja esta em batalha" }, { status: 400 });
  }

  // Check player count
  const { data: players } = await supabase
    .from("raid_players")
    .select("id")
    .eq("room_id", room.id);

  if (players && players.length >= 5) {
    return NextResponse.json({ error: "Sala cheia (maximo 5 jogadores)" }, { status: 400 });
  }

  const playerToken = generateToken();

  const { data: player, error: playerError } = await supabase
    .from("raid_players")
    .insert({
      room_id: room.id,
      player_name: playerName,
      player_token: playerToken,
      role: "trainer",
      pokemon_data: pokemonData || [],
      is_ready: false,
    })
    .select()
    .single();

  if (playerError) {
    return NextResponse.json({ error: playerError.message }, { status: 500 });
  }

  return NextResponse.json({ room, player, playerToken });
}

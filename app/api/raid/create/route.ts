import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json();
  const { playerName, masterPokemon } = body;

  if (!playerName) {
    return NextResponse.json({ error: "Nome obrigatorio" }, { status: 400 });
  }

  const roomCode = generateRoomCode();
  const playerToken = generateToken();

  const { data: room, error: roomError } = await supabase
    .from("raid_rooms")
    .insert({
      room_code: roomCode,
      room_name: `Sala de ${playerName}`,
      master_pokemon: masterPokemon || [],
    })
    .select()
    .single();

  if (roomError) {
    return NextResponse.json({ error: roomError.message }, { status: 500 });
  }

  const { data: player, error: playerError } = await supabase
    .from("raid_players")
    .insert({
      room_id: room.id,
      player_name: playerName,
      player_token: playerToken,
      role: "master",
      is_ready: true,
    })
    .select()
    .single();

  if (playerError) {
    return NextResponse.json({ error: playerError.message }, { status: 500 });
  }

  return NextResponse.json({ room, player, playerToken });
}

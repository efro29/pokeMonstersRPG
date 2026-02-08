import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const supabase = await createClient();
  const { roomId } = await params;

  const { data: room, error: roomError } = await supabase
    .from("raid_rooms")
    .select("*")
    .eq("id", roomId)
    .single();

  if (roomError || !room) {
    return NextResponse.json({ error: "Sala nao encontrada" }, { status: 404 });
  }

  const { data: players } = await supabase
    .from("raid_players")
    .select("*")
    .eq("room_id", roomId)
    .order("joined_at", { ascending: true });

  const { data: battleLog } = await supabase
    .from("raid_battle_log")
    .select("*")
    .eq("room_id", roomId)
    .order("created_at", { ascending: true });

  return NextResponse.json({ room, players: players || [], battleLog: battleLog || [] });
}

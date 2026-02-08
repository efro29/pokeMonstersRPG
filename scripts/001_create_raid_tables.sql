-- Raid Rooms table
create table if not exists public.raid_rooms (
  id uuid primary key default gen_random_uuid(),
  room_code text unique not null,
  room_name text not null default 'Sala RAID',
  status text not null default 'waiting' check (status in ('waiting', 'battle', 'finished')),
  current_turn_player_id uuid,
  turn_number int not null default 0,
  master_pokemon jsonb default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- Raid Players table
create table if not exists public.raid_players (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.raid_rooms(id) on delete cascade,
  player_name text not null,
  player_token text not null,
  role text not null default 'trainer' check (role in ('master', 'trainer')),
  pokemon_data jsonb default '[]'::jsonb,
  is_ready boolean not null default false,
  current_hp int not null default 0,
  max_hp int not null default 0,
  joined_at timestamptz not null default now()
);

-- Raid Battle Log table
create table if not exists public.raid_battle_log (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.raid_rooms(id) on delete cascade,
  player_id uuid references public.raid_players(id) on delete set null,
  player_name text,
  turn_number int not null default 0,
  action_type text not null check (action_type in ('attack', 'item', 'damage', 'master_attack', 'system')),
  action_data jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Index for fast room code lookups
create index if not exists idx_raid_rooms_code on public.raid_rooms(room_code);

-- Index for finding players by room
create index if not exists idx_raid_players_room on public.raid_players(room_id);

-- Index for finding players by token
create index if not exists idx_raid_players_token on public.raid_players(player_token);

-- Index for battle log by room
create index if not exists idx_raid_battle_log_room on public.raid_battle_log(room_id);

-- Enable RLS but with permissive policies (anonymous access)
alter table public.raid_rooms enable row level security;
alter table public.raid_players enable row level security;
alter table public.raid_battle_log enable row level security;

-- Permissive policies for raid_rooms
create policy "Anyone can read raid rooms" on public.raid_rooms for select using (true);
create policy "Anyone can create raid rooms" on public.raid_rooms for insert with check (true);
create policy "Anyone can update raid rooms" on public.raid_rooms for update using (true);
create policy "Anyone can delete raid rooms" on public.raid_rooms for delete using (true);

-- Permissive policies for raid_players
create policy "Anyone can read raid players" on public.raid_players for select using (true);
create policy "Anyone can join raid" on public.raid_players for insert with check (true);
create policy "Anyone can update raid players" on public.raid_players for update using (true);
create policy "Anyone can leave raid" on public.raid_players for delete using (true);

-- Permissive policies for raid_battle_log
create policy "Anyone can read battle log" on public.raid_battle_log for select using (true);
create policy "Anyone can add battle log" on public.raid_battle_log for insert with check (true);

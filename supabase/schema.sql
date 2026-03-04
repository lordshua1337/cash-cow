-- Cash Cow V4 Database Schema

-- Snapshots: market research results
create table if not exists snapshots (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  niche text not null,
  data jsonb not null,
  created_at timestamptz default now() not null,
  expires_at timestamptz default (now() + interval '30 days') not null
);

create index idx_snapshots_user on snapshots(user_id);
create index idx_snapshots_niche on snapshots(niche);
create index idx_snapshots_expires on snapshots(expires_at);

-- Calves: product ideas
create table if not exists calves (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  snapshot_id text references snapshots(id) on delete set null,
  niche text not null,
  status text default 'grazing' not null,
  data jsonb not null,
  notes text,
  monthly_revenue numeric default 0,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index idx_calves_user on calves(user_id);
create index idx_calves_snapshot on calves(snapshot_id);
create index idx_calves_status on calves(status);

-- Briefs: cached build briefs
create table if not exists briefs (
  id uuid primary key default gen_random_uuid(),
  calf_id text references calves(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  content text not null,
  created_at timestamptz default now() not null,
  expires_at timestamptz default (now() + interval '7 days') not null
);

create index idx_briefs_calf on briefs(calf_id);
create index idx_briefs_expires on briefs(expires_at);

-- AI request tracking for rate limiting
create table if not exists ai_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  request_type text not null, -- 'research', 'brief', 'forecast', 'playbook', 'recommendations'
  created_at timestamptz default now() not null
);

create index idx_ai_requests_user_date on ai_requests(user_id, created_at);

-- Error logs
create table if not exists error_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  context text not null,
  message text not null,
  stack text,
  created_at timestamptz default now() not null
);

create index idx_error_logs_date on error_logs(created_at);

-- Watchlists: niches to monitor
create table if not exists watchlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  niche text not null,
  refresh_interval text default 'weekly' not null, -- 'daily', 'weekly', 'monthly'
  last_refreshed_at timestamptz,
  created_at timestamptz default now() not null,
  unique(user_id, niche)
);

create index idx_watchlists_user on watchlists(user_id);

-- Row Level Security policies

alter table snapshots enable row level security;
alter table calves enable row level security;
alter table briefs enable row level security;
alter table ai_requests enable row level security;
alter table error_logs enable row level security;
alter table watchlists enable row level security;

-- Users can only see their own data
create policy "Users can view own snapshots" on snapshots for select using (auth.uid() = user_id);
create policy "Users can insert own snapshots" on snapshots for insert with check (auth.uid() = user_id);
create policy "Users can delete own snapshots" on snapshots for delete using (auth.uid() = user_id);

create policy "Users can view own calves" on calves for select using (auth.uid() = user_id);
create policy "Users can insert own calves" on calves for insert with check (auth.uid() = user_id);
create policy "Users can update own calves" on calves for update using (auth.uid() = user_id);
create policy "Users can delete own calves" on calves for delete using (auth.uid() = user_id);

create policy "Users can view own briefs" on briefs for select using (auth.uid() = user_id);
create policy "Users can insert own briefs" on briefs for insert with check (auth.uid() = user_id);

create policy "Users can view own ai_requests" on ai_requests for select using (auth.uid() = user_id);
create policy "Users can insert own ai_requests" on ai_requests for insert with check (auth.uid() = user_id);

create policy "Users can insert error_logs" on error_logs for insert with check (true);

create policy "Users can view own watchlists" on watchlists for select using (auth.uid() = user_id);
create policy "Users can insert own watchlists" on watchlists for insert with check (auth.uid() = user_id);
create policy "Users can update own watchlists" on watchlists for update using (auth.uid() = user_id);
create policy "Users can delete own watchlists" on watchlists for delete using (auth.uid() = user_id);

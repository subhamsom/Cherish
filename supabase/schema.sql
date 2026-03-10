-- ============================================================
-- Cherish — Supabase database schema + RLS policies
-- Run this entire file in: Supabase Dashboard > SQL Editor
-- ============================================================

create extension if not exists "uuid-ossp";

-- ============================================================
-- PEOPLE
-- ============================================================
create table if not exists public.people (
  id                uuid primary key default uuid_generate_v4(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  name              text not null,
  relationship_type text not null default 'friend'
    check (relationship_type in ('partner','friend','family','colleague','other')),
  birthday          date,
  photo_url         text,
  notes             text,
  created_at        timestamptz not null default now()
);

alter table public.people enable row level security;

create policy "people_select" on public.people for select using (auth.uid() = user_id);
create policy "people_insert" on public.people for insert with check (auth.uid() = user_id);
create policy "people_update" on public.people for update using (auth.uid() = user_id);
create policy "people_delete" on public.people for delete using (auth.uid() = user_id);


-- ============================================================
-- ENTRIES
-- ============================================================
create table if not exists public.entries (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  person_id   uuid not null references public.people(id) on delete cascade,
  type        text not null default 'moment'
    check (type in ('moment','gift_given','gift_received','reminder_note')),
  title       text not null,
  body        text,
  date        date not null default current_date,
  tags        text[] not null default '{}',
  mood        text,
  created_at  timestamptz not null default now()
);

alter table public.entries enable row level security;

create policy "entries_select" on public.entries for select using (auth.uid() = user_id);
create policy "entries_insert" on public.entries for insert with check (auth.uid() = user_id);
create policy "entries_update" on public.entries for update using (auth.uid() = user_id);
create policy "entries_delete" on public.entries for delete using (auth.uid() = user_id);


-- ============================================================
-- REMINDERS (Phase 2 — table scaffolded now, app code later)
-- ============================================================
create table if not exists public.reminders (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  person_id   uuid not null references public.people(id) on delete cascade,
  entry_id    uuid references public.entries(id) on delete set null,
  title       text not null,
  remind_at   timestamptz not null,
  repeat      text not null default 'none'
    check (repeat in ('none','weekly','monthly','yearly')),
  channel     text not null default 'in_app'
    check (channel in ('email','in_app','both')),
  is_sent     boolean not null default false,
  created_at  timestamptz not null default now()
);

alter table public.reminders enable row level security;

create policy "reminders_select" on public.reminders for select using (auth.uid() = user_id);
create policy "reminders_insert" on public.reminders for insert with check (auth.uid() = user_id);
create policy "reminders_update" on public.reminders for update using (auth.uid() = user_id);
create policy "reminders_delete" on public.reminders for delete using (auth.uid() = user_id);

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists people_user_id_idx    on public.people(user_id);
create index if not exists entries_user_id_idx   on public.entries(user_id);
create index if not exists entries_person_id_idx on public.entries(person_id);
create index if not exists reminders_user_id_idx on public.reminders(user_id);
create index if not exists reminders_remind_at_idx on public.reminders(remind_at);

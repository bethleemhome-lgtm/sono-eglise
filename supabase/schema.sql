-- Base de données de la Check-list Sono.
-- À coller UNE FOIS dans Supabase : SQL Editor → New query → coller → Run.

-- 1. Vérifications : une par date et type de culte
create table if not exists public.verifications (
  id          uuid primary key default gen_random_uuid(),
  date        date not null,
  type        text not null,
  tech        text,
  note        text,
  items       jsonb not null default '{}'::jsonb,
  created_by  uuid default auth.uid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (date, type)
);

-- 2. Pannes : le suivi des équipements défaillants ou absents
create table if not exists public.pannes (
  id         uuid primary key default gen_random_uuid(),
  item       text not null,
  statut     text not null default 'a_reparer' check (statut in ('a_reparer', 'repare')),
  etat       text not null check (etat in ('bad', 'abs')),
  remarque   text,
  depuis     date not null,
  last_seen  date not null,
  vus        int  not null default 1,
  tech       text,
  repare_le  date,
  created_at timestamptz not null default now()
);
-- Un même équipement ne peut avoir qu'une seule panne ouverte à la fois
create unique index if not exists pannes_une_ouverte_par_item
  on public.pannes (item) where statut = 'a_reparer';

-- 3. Réglages de référence de la table de mixage
create table if not exists public.reglages (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- 4. Sécurité (RLS) : seuls les membres connectés de l'équipe lisent et écrivent.
--    Les visiteurs non connectés ne voient rien.
alter table public.verifications enable row level security;
alter table public.pannes        enable row level security;
alter table public.reglages      enable row level security;

drop policy if exists "equipe verifications" on public.verifications;
create policy "equipe verifications" on public.verifications
  for all to authenticated using (true) with check (true);

drop policy if exists "equipe pannes" on public.pannes;
create policy "equipe pannes" on public.pannes
  for all to authenticated using (true) with check (true);

drop policy if exists "equipe reglages" on public.reglages;
create policy "equipe reglages" on public.reglages
  for all to authenticated using (true) with check (true);

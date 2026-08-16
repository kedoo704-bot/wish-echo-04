create table if not exists public.cards (
  id text primary key,
  payload jsonb not null,
  photo_path text,
  view_count integer not null default 0,
  created_by uuid,
  created_at timestamptz not null default now()
);

create index if not exists cards_created_by_created_at_idx
  on public.cards (created_by, created_at desc);

create or replace function public.increment_card_view(card_id text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.cards
  set view_count = view_count + 1
  where id = card_id;
$$;

alter table public.cards enable row level security;

drop policy if exists cards_public_read on public.cards;
create policy cards_public_read
  on public.cards
  for select
  to anon, authenticated
  using (true);

grant execute on function public.increment_card_view(text) to service_role;

insert into storage.buckets (id, name, public)
values ('card-photos', 'card-photos', true)
on conflict (id) do update set public = true;

drop policy if exists card_photos_public_read on storage.objects;
create policy card_photos_public_read
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'card-photos');

-- ─── Card open notifications ────────────────────────────────────────────
-- Web Push subscriptions, one per (card, browser) — lets a card's sender
-- opt in to "notify me when this is opened" right after creating it,
-- without needing an account: possession of the card id is the same trust
-- boundary /share/[id] already uses. Only the service-role client ever
-- reads or writes this table (subscribe on the client, send + prune on
-- view) — no anon/authenticated policies needed, default-deny is correct.

create table if not exists public.card_push_subscriptions (
  id bigint generated always as identity primary key,
  card_id text not null references public.cards(id) on delete cascade,
  endpoint text not null,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now(),
  unique (card_id, endpoint)
);

create index if not exists card_push_subscriptions_card_id_idx
  on public.card_push_subscriptions (card_id);

alter table public.card_push_subscriptions enable row level security;

-- ─── Garden letters ─────────────────────────────────────────────────────
-- A deliberately separate table/stream from `cards` above — public,
-- anonymously-authored notes decorated with an illustrated flower cluster.
-- Posting requires no sign-in, matching gardenletters.online; created_by is
-- nullable and only ever populated for the rare visitor who happens to
-- already be signed in. "My letters" (app/garden/mine) is tracked
-- client-side instead — see src/lib/garden-mine.ts.
-- See src/lib/garden-bouquet.ts for how flower_seed becomes a rendered
-- arrangement, and app/api/garden/route.ts for the only insert path
-- (client never inserts directly; RLS below only grants SELECT).

create table if not exists public.garden_letters (
  id text primary key,
  message text not null,
  to_label text,
  from_label text,
  flower_seed integer not null,
  created_by uuid,
  reported_count integer not null default 0,
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists garden_letters_created_by_created_at_idx
  on public.garden_letters (created_by, created_at desc);
create index if not exists garden_letters_public_feed_idx
  on public.garden_letters (hidden, created_at desc);

alter table public.garden_letters enable row level security;

-- Anyone can read letters that haven't been hidden by moderation.
drop policy if exists garden_letters_public_read on public.garden_letters;
create policy garden_letters_public_read
  on public.garden_letters
  for select
  to anon, authenticated
  using (hidden = false);

-- Authors can also see their own letters even if hidden, so "My letters"
-- (app/garden/mine) shows everything they wrote, not just what's public.
drop policy if exists garden_letters_owner_read on public.garden_letters;
create policy garden_letters_owner_read
  on public.garden_letters
  for select
  to authenticated
  using (auth.uid() = created_by);

-- No insert/update policy: writes go exclusively through the service-role
-- client in app/api/garden/**, after zod validation + the profanity check +
-- a rate limit, matching how `cards` writes work above.

create table if not exists public.garden_letter_reports (
  id bigint generated always as identity primary key,
  letter_id text not null references public.garden_letters(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists garden_letter_reports_letter_id_idx
  on public.garden_letter_reports (letter_id);

alter table public.garden_letter_reports enable row level security;
-- No policies: this table is only ever written to (never read) by the
-- service-role client. Review reported letters directly in the Supabase
-- table editor, sorted by garden_letters.reported_count.

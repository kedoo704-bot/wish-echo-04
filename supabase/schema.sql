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

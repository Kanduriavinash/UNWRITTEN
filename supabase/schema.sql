-- UNWRITTEN: initial security-first schema scaffold.
-- Review before running in your own Supabase project's SQL Editor.
-- IMPORTANT: Add your exact official student email domain to private.allowed_email_domains.
-- Keep Supabase Auth > Email > Confirm email enabled. This schema fails closed until a domain is added.

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists private.allowed_email_domains (
  domain text primary key check (domain = lower(domain) and position('@' in domain) = 0 and position('.' in domain) > 1),
  created_at timestamptz not null default now()
);
revoke all on private.allowed_email_domains from public, anon, authenticated;

create or replace function private.enforce_college_email_domain()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  email_domain text;
begin
  if new.email is null or position('@' in new.email) = 0 then
    raise exception 'A college email address is required.';
  end if;
  email_domain := lower(split_part(new.email, '@', 2));
  if not exists (select 1 from private.allowed_email_domains d where d.domain = email_domain) then
    raise exception 'This email domain is not approved for UNWRITTEN.';
  end if;
  return new;
end;
$$;
revoke all on function private.enforce_college_email_domain() from public, anon, authenticated;
drop trigger if exists unwritten_enforce_college_domain on auth.users;
create trigger unwritten_enforce_college_domain
before insert or update of email on auth.users
for each row execute function private.enforce_college_email_domain();

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '' check (char_length(display_name) <= 50),
  course text not null default '' check (char_length(course) <= 100),
  study_year smallint check (study_year between 1 and 8),
  bio text not null default '' check (char_length(bio) <= 300),
  interests text[] not null default '{}' check (cardinality(interests) <= 20),
  seeking text not null default 'both' check (seeking in ('friendship','dating','both')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
revoke all on public.profiles from anon;
grant select, insert, update, delete on public.profiles to authenticated;
drop policy if exists "Verified campus users can view profiles" on public.profiles;
create policy "Verified campus users can view profiles" on public.profiles for select to authenticated using ((select auth.uid()) is not null);
drop policy if exists "Users create their own profile" on public.profiles;
create policy "Users create their own profile" on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
drop policy if exists "Users update their own profile" on public.profiles;
create policy "Users update their own profile" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
drop policy if exists "Users delete their own profile" on public.profiles;
create policy "Users delete their own profile" on public.profiles for delete to authenticated using ((select auth.uid()) = id);

create table if not exists public.connections (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references auth.users(id) on delete cascade,
  recipient_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','accepted','declined','blocked')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint connections_not_self check (requester_id <> recipient_id),
  constraint connections_unique_pair unique (requester_id, recipient_id)
);
alter table public.connections enable row level security;
revoke all on public.connections from anon;
grant select, insert, update on public.connections to authenticated;
drop policy if exists "Participants can view their connections" on public.connections;
create policy "Participants can view their connections" on public.connections for select to authenticated using ((select auth.uid()) in (requester_id, recipient_id));
drop policy if exists "Requester can send a connection request" on public.connections;
create policy "Requester can send a connection request" on public.connections for insert to authenticated with check ((select auth.uid()) = requester_id and status = 'pending');
drop policy if exists "Recipient can respond to request" on public.connections;
create policy "Recipient can respond to request" on public.connections for update to authenticated using ((select auth.uid()) = recipient_id and status = 'pending') with check ((select auth.uid()) = recipient_id and status in ('accepted','declined','blocked'));

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  connection_id uuid not null references public.connections(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index if not exists messages_connection_created_idx on public.messages(connection_id, created_at);
alter table public.messages enable row level security;
revoke all on public.messages from anon;
grant select, insert on public.messages to authenticated;
drop policy if exists "Accepted connection participants can read messages" on public.messages;
create policy "Accepted connection participants can read messages" on public.messages for select to authenticated using (
  exists (select 1 from public.connections c where c.id = connection_id and c.status = 'accepted' and (select auth.uid()) in (c.requester_id, c.recipient_id))
);
drop policy if exists "Participants can send messages in accepted connections" on public.messages;
create policy "Participants can send messages in accepted connections" on public.messages for insert to authenticated with check (
  sender_id = (select auth.uid()) and exists (
    select 1 from public.connections c where c.id = connection_id and c.status = 'accepted' and (select auth.uid()) in (c.requester_id, c.recipient_id)
  )
);

-- Add the exact verified student email domain manually, for example:
-- insert into private.allowed_email_domains(domain) values ('students.example.edu');
-- Do not guess this value. Never put a service-role key in frontend code.

-- Profiles table linked to auth.users so we can attach admin role + display name.
-- Each row's id IS the auth.users.id (1:1).
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  is_admin boolean not null default false,
  created_at timestamp with time zone not null default timezone('utc', now()),
  updated_at timestamp with time zone not null default timezone('utc', now())
);

create index if not exists idx_profiles_is_admin on public.profiles(is_admin);

alter table public.profiles enable row level security;

-- Authenticated users can read their own profile (the app reads this to check is_admin).
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

-- Authenticated admins can read every profile (so admin user manager can list them).
drop policy if exists "profiles_select_admins" on public.profiles;
create policy "profiles_select_admins" on public.profiles
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );

-- Users can update their own non-privileged fields; is_admin updates require service role.
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- INSERT and DELETE are intentionally locked to service-role-only:
-- new admins are added via a server route using the service role key.
-- (No INSERT/DELETE policies = denied for end-users; service role bypasses RLS.)

-- Auto-create a profile row whenever a user is created in auth.users.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, is_admin)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', null),
    coalesce((new.raw_user_meta_data ->> 'is_admin')::boolean, false)
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    is_admin = coalesce(excluded.is_admin, public.profiles.is_admin),
    updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- 1) auth_user_id kolonu
alter table public.users add column if not exists auth_user_id uuid;

-- 2) var olan kayıtları e-postadan backfill
update public.users u
set auth_user_id = a.id
from auth.users a
where u.email = a.email
  and u.auth_user_id is null;

-- 3) unique index (idempotent)
create unique index if not exists users_auth_user_id_uq_idx
  on public.users(auth_user_id);

-- 4) foreign key
alter table public.users
  drop constraint if exists users_auth_user_id_fkey,
  add constraint users_auth_user_id_fkey
    foreign key (auth_user_id) references auth.users(id) on delete cascade;

-- 5) RLS + policy'ler
alter table public.users enable row level security;

drop policy if exists users_select_own on public.users;
create policy users_select_own
on public.users for select
using (auth.uid() = auth_user_id);

drop policy if exists users_insert_own on public.users;
create policy users_insert_own
on public.users for insert
with check (auth.uid() = auth_user_id);

drop policy if exists users_update_own on public.users;
create policy users_update_own
on public.users for update
using (auth.uid() = auth_user_id);

-- 6) authenticated rolü için izinler
grant select, insert, update on public.users to authenticated;

-- 7) AUTH → PROFILE: signup'ta otomatik profil
create or replace function public.handle_auth_user_created()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (auth_user_id, email, role, first_name)
  values (new.id, new.email, 'client', split_part(coalesce(new.email,''),'@',1))
  on conflict (auth_user_id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_auth_user_created();


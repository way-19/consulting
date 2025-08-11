-- column
alter table public.users add column if not exists auth_user_id uuid;

-- backfill (email → auth.users.id)
update public.users u
set auth_user_id = a.id
from auth.users a
where u.email = a.email
  and u.auth_user_id is null;

-- unique index
create unique index if not exists users_auth_user_id_uq_idx
  on public.users(auth_user_id);

-- FK
alter table public.users
  drop constraint if exists users_auth_user_id_fkey,
  add constraint users_auth_user_id_fkey
    foreign key (auth_user_id) references auth.users(id) on delete cascade;

-- RLS
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

-- privileges
grant select, insert, update on public.users to authenticated;

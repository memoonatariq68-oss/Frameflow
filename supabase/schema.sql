create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  credits integer not null default 20,
  created_at timestamptz default now()
);

create table if not exists videos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  prompt text not null,
  status text not null default 'processing',
  json2video_project text,
  video_url text,
  credits_used integer not null default 10,
  created_at timestamptz default now()
);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table profiles enable row level security;
alter table videos enable row level security;

create policy "Users read own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users read own videos" on videos
  for select using (auth.uid() = user_id);

create policy "Users insert own videos" on videos
  for insert with check (auth.uid() = user_id);

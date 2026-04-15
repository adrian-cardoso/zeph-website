-- =============================================
-- Zeph Portal — Supabase Database Setup
-- Run each numbered section one at a time in the SQL Editor
-- =============================================


-- =============================================
-- STEP 1: Create tables
-- =============================================

create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  role text not null default 'patient' check (role in ('admin', 'patient')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.blog_posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  tag text,
  excerpt text,
  content text,
  image_url text,
  status text default 'draft' check (status in ('published', 'draft')),
  published_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.videos (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  video_url text,
  thumbnail_url text,
  display_order integer default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);


-- =============================================
-- STEP 2: Auto-create profile on signup trigger
-- =============================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'patient')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- =============================================
-- STEP 3: Enable RLS
-- =============================================

alter table public.profiles enable row level security;
alter table public.blog_posts enable row level security;
alter table public.videos enable row level security;


-- =============================================
-- STEP 4: Profiles policies
-- =============================================

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Admins can read all profiles" on public.profiles;
create policy "Admins can read all profiles"
  on public.profiles for select
  using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );


-- =============================================
-- STEP 5: Blog posts policies
-- =============================================

drop policy if exists "Anyone can read published blog posts" on public.blog_posts;
create policy "Anyone can read published blog posts"
  on public.blog_posts for select
  using (status = 'published');

drop policy if exists "Admins can read all blog posts" on public.blog_posts;
create policy "Admins can read all blog posts"
  on public.blog_posts for select
  using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

drop policy if exists "Admins can insert blog posts" on public.blog_posts;
create policy "Admins can insert blog posts"
  on public.blog_posts for insert
  with check (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

drop policy if exists "Admins can update blog posts" on public.blog_posts;
create policy "Admins can update blog posts"
  on public.blog_posts for update
  using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

drop policy if exists "Admins can delete blog posts" on public.blog_posts;
create policy "Admins can delete blog posts"
  on public.blog_posts for delete
  using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );


-- =============================================
-- STEP 6: Videos policies
-- =============================================

drop policy if exists "Authenticated users can read videos" on public.videos;
create policy "Authenticated users can read videos"
  on public.videos for select
  using (auth.uid() is not null);

drop policy if exists "Admins can insert videos" on public.videos;
create policy "Admins can insert videos"
  on public.videos for insert
  with check (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

drop policy if exists "Admins can update videos" on public.videos;
create policy "Admins can update videos"
  on public.videos for update
  using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

drop policy if exists "Admins can delete videos" on public.videos;
create policy "Admins can delete videos"
  on public.videos for delete
  using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );


-- =============================================
-- STEP 7: Storage bucket
-- Create the bucket first. If it already exists this is safe to skip.
-- =============================================

insert into storage.buckets (id, name, public)
values ('patient-videos', 'patient-videos', true)
on conflict (id) do nothing;


-- =============================================
-- STEP 8: Storage policies
-- =============================================

drop policy if exists "Admins can upload to patient-videos" on storage.objects;
create policy "Admins can upload to patient-videos"
  on storage.objects for insert
  with check (
    bucket_id = 'patient-videos'
    and (select role from public.profiles where id = auth.uid()) = 'admin'
  );

drop policy if exists "Admins can delete from patient-videos" on storage.objects;
create policy "Admins can delete from patient-videos"
  on storage.objects for delete
  using (
    bucket_id = 'patient-videos'
    and (select role from public.profiles where id = auth.uid()) = 'admin'
  );

drop policy if exists "Public read for patient-videos" on storage.objects;
create policy "Public read for patient-videos"
  on storage.objects for select
  using (bucket_id = 'patient-videos');


-- =============================================
-- STEP 9: Create your first admin
-- After creating a user via Supabase Auth dashboard, run:
--
--   update public.profiles set role = 'admin' where email = 'your-admin@email.com';
--
-- =============================================

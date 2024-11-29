-- Drop existing tables to rebuild with correct relationships
drop table if exists public.attendance cascade;
drop table if exists public.enrollments cascade;
drop table if exists public.lessons cascade;
drop table if exists public.trainings cascade;
drop table if exists public.profiles cascade;

-- Create profiles table first (for students)
create table if not exists public.profiles (
  id uuid references auth.users(id) primary key,
  email text unique not null,
  full_name text not null,
  department text,
  avatar_url text,
  created_at timestamptz default now() not null
);

-- Create trainings table
create table if not exists public.trainings (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  start_date date not null,
  duration text not null,
  max_students integer not null,
  created_by uuid references auth.users(id) not null,
  created_at timestamptz default now() not null
);

-- Create lessons table
create table if not exists public.lessons (
  id uuid default gen_random_uuid() primary key,
  training_id uuid references public.trainings(id) on delete cascade not null,
  title text not null,
  date date not null,
  start_time time not null,
  duration text not null,
  zoom_link text,
  completion_threshold integer not null default 80,
  created_by uuid references auth.users(id) not null,
  created_at timestamptz default now() not null
);

-- Create enrollments table with correct references
create table if not exists public.enrollments (
  id uuid default gen_random_uuid() primary key,
  training_id uuid references public.trainings(id) on delete cascade not null,
  student_id uuid references profiles(id) on delete cascade not null,
  enrollment_date timestamptz default now() not null,
  created_at timestamptz default now() not null,
  unique(training_id, student_id)
);

-- Create attendance table with explicit relationship to lessons
create table if not exists public.attendance (
  id uuid default gen_random_uuid() primary key,
  lesson_id uuid not null,
  student_id uuid not null,
  join_time timestamptz not null,
  leave_time timestamptz not null,
  created_at timestamptz default now() not null,
  foreign key (lesson_id) references public.lessons(id) on delete cascade,
  foreign key (student_id) references public.profiles(id) on delete cascade
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.trainings enable row level security;
alter table public.lessons enable row level security;
alter table public.enrollments enable row level security;
alter table public.attendance enable row level security;

-- Policies for profiles
create policy "Public profiles are viewable by everyone"
  on profiles for select
  to authenticated
  using (true);

create policy "Users can update own profile"
  on profiles for update
  to authenticated
  using (auth.uid() = id);

-- Policies for trainings
create policy "Anyone can view trainings"
  on trainings for select
  to authenticated
  using (true);

create policy "Admins can manage trainings"
  on trainings for all
  to authenticated
  using (
    exists (
      select 1 from public.admins
      where admins.email = auth.jwt()->>'email'
    )
  );

-- Policies for lessons
create policy "Anyone can view lessons"
  on lessons for select
  to authenticated
  using (true);

create policy "Admins can manage lessons"
  on lessons for all
  to authenticated
  using (
    exists (
      select 1 from public.admins
      where admins.email = auth.jwt()->>'email'
    )
  );

-- Policies for enrollments
create policy "Anyone can view enrollments"
  on enrollments for select
  to authenticated
  using (true);

create policy "Admins can manage enrollments"
  on enrollments for all
  to authenticated
  using (
    exists (
      select 1 from public.admins
      where admins.email = auth.jwt()->>'email'
    )
  );

-- Policies for attendance
create policy "Anyone can view attendance"
  on attendance for select
  to authenticated
  using (true);

create policy "Admins can manage attendance"
  on attendance for all
  to authenticated
  using (
    exists (
      select 1 from public.admins
      where admins.email = auth.jwt()->>'email'
    )
  );

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant all on public.profiles to anon, authenticated;
grant all on public.trainings to anon, authenticated;
grant all on public.lessons to anon, authenticated;
grant all on public.enrollments to anon, authenticated;
grant all on public.attendance to anon, authenticated;
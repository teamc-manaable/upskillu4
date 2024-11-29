-- Create admin table if it doesn't exist
create table if not exists public.admins (
  id uuid references auth.users(id) primary key,
  email text unique not null,
  name text not null,
  role text not null check (role in ('admin', 'trainer')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.admins enable row level security;

-- Create policies
create policy "Admins can view all admin profiles"
  on public.admins
  for select
  to authenticated
  using (true);

create policy "Only super admins can insert admin profiles"
  on public.admins
  for insert
  to authenticated
  using (auth.uid() in (
    select id from public.admins where role = 'admin'
  ));

-- Insert initial admin user
insert into public.admins (id, email, name, role)
values (
  '00000000-0000-0000-0000-000000000000', -- Replace with actual auth.users id after creating user
  'admin@manaable.com',
  'Admin User',
  'admin'
);

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant all on public.admins to anon, authenticated;
grant usage on all sequences in schema public to anon, authenticated;
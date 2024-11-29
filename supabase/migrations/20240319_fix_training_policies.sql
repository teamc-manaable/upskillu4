-- Drop existing policies if they exist
drop policy if exists "Admins can view all trainings" on trainings;
drop policy if exists "Admins can insert trainings" on trainings;
drop policy if exists "Admins can update trainings" on trainings;
drop policy if exists "Admins can delete trainings" on trainings;

-- Create new policies with fixed admin check
create policy "Admins can view all trainings"
  on trainings for select
  to authenticated
  using (true);  -- Allow all authenticated users to view trainings

create policy "Admins can insert trainings"
  on trainings for insert
  to authenticated
  with check (
    exists (
      select 1 from admins
      where admins.email = auth.jwt()->>'email'
    )
  );

create policy "Admins can update trainings"
  on trainings for update
  to authenticated
  using (
    exists (
      select 1 from admins
      where admins.email = auth.jwt()->>'email'
    )
  );

create policy "Admins can delete trainings"
  on trainings for delete
  to authenticated
  using (
    exists (
      select 1 from admins
      where admins.email = auth.jwt()->>'email'
    )
  );

-- Ensure RLS is enabled
alter table trainings enable row level security;

-- Grant necessary permissions
grant all on trainings to authenticated;
grant all on trainings to anon;
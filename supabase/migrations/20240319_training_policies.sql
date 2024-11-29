-- Enable RLS
alter table public.trainings enable row level security;

-- Create policies for trainings
create policy "Admins can view all trainings"
  on public.trainings
  for select
  to authenticated
  using (
    exists (
      select 1 from public.admins
      where admins.id = auth.uid()
    )
  );

create policy "Admins can insert trainings"
  on public.trainings
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.admins
      where admins.id = auth.uid()
    )
  );

create policy "Admins can update trainings"
  on public.trainings
  for update
  to authenticated
  using (
    exists (
      select 1 from public.admins
      where admins.id = auth.uid()
    )
  );

create policy "Admins can delete trainings"
  on public.trainings
  for delete
  to authenticated
  using (
    exists (
      select 1 from public.admins
      where admins.id = auth.uid()
    )
  );

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant all on public.trainings to anon, authenticated;
grant usage on all sequences in schema public to anon, authenticated;
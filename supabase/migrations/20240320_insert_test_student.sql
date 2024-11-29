-- First, create a student user in auth.users
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role_id
) VALUES (
  gen_random_uuid(),
  'student@manaable.com',
  crypt('student123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Test Student"}',
  false,
  1
) ON CONFLICT (email) DO NOTHING;

-- Then, create the student profile
INSERT INTO public.profiles (
  id,
  email,
  full_name,
  department,
  avatar_url,
  created_at
)
SELECT
  id,
  email,
  raw_user_meta_data->>'full_name',
  'Engineering',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
  created_at
FROM auth.users
WHERE email = 'student@manaable.com'
ON CONFLICT (email) DO NOTHING;
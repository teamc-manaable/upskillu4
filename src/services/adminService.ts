import { supabase } from '../lib/supabase';

interface AdminCredentials {
  email: string;
  password: string;
}

interface AdminData {
  email: string;
  name: string;
  role: 'admin' | 'trainer';
}

export async function loginAdmin({ email, password }: AdminCredentials) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  // Verify if the user is an admin
  const { data: adminData, error: adminError } = await supabase
    .from('admins')
    .select('*')
    .eq('email', email)
    .single();

  if (adminError || !adminData) {
    await supabase.auth.signOut();
    throw new Error('Not authorized as admin');
  }

  return { user: data.user, admin: adminData };
}

export async function logoutAdmin() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getAdminProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('admins')
    .select('*')
    .eq('email', user.email)
    .single();

  if (error || !data) throw new Error('Not an admin user');
  return data;
}

export async function updateAdminProfile(id: string, profile: Partial<AdminData>) {
  const { data, error } = await supabase
    .from('admins')
    .update(profile)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import * as adminService from '../services/adminService';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  adminProfile: any | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [adminProfile, setAdminProfile] = useState<any | null>(null);

  const loadAdminProfile = async (user: User) => {
    try {
      const { data: adminData } = await supabase
        .from('admins')
        .select('*')
        .eq('email', user.email)
        .single();

      if (adminData) {
        setAdminProfile(adminData);
      } else {
        setAdminProfile(null);
      }
    } catch (error) {
      console.error('Error loading admin profile:', error);
      setAdminProfile(null);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        loadAdminProfile(session.user);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        loadAdminProfile(session.user);
      } else {
        setUser(null);
        setAdminProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
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

    setUser(data.user);
    setAdminProfile(adminData);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setAdminProfile(null);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated: !!user && !!adminProfile,
      user,
      adminProfile,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
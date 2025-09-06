import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: AuthError }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: AuthError }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error?: any }>;
  refreshProfile: () => Promise<void>;
  changePassword: (newPassword: string) => Promise<{ error?: any }>;
  // MFA methods - simplified
  enrollMfaFactor: (factorType: string) => Promise<{ factor?: any; qrCode?: string; secret?: string; error?: any }>;
  verifyMfaFactor: (factorId: string, code: string) => Promise<{ error?: any }>;
  unenrollMfaFactor: (factorId: string) => Promise<{ error?: any }>;
  getMfaFactors: () => Promise<{ factors?: any[]; error?: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
      } else if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  };

  const changePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { error };
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: 'No user logged in' };

    const { error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', user.id);

    if (!error && profile) {
      setProfile({ ...profile, ...updates });
    }

    return { error };
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  // Simplified MFA methods (basic implementation)
  const enrollMfaFactor = async (factorType: string) => {
    try {
      // Basic MFA enrollment - this would need proper Supabase MFA implementation
      return { error: 'MFA not yet implemented' };
    } catch (error) {
      return { error };
    }
  };

  const verifyMfaFactor = async (factorId: string, code: string) => {
    try {
      return { error: 'MFA verification not yet implemented' };
    } catch (error) {
      return { error };
    }
  };

  const unenrollMfaFactor = async (factorId: string) => {
    try {
      return { error: 'MFA unenrollment not yet implemented' };
    } catch (error) {
      return { error };
    }
  };

  const getMfaFactors = async () => {
    try {
      return { factors: [], error: null };
    } catch (error) {
      return { factors: [], error };
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    refreshProfile,
    changePassword,
    enrollMfaFactor,
    verifyMfaFactor,
    unenrollMfaFactor,
    getMfaFactors,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
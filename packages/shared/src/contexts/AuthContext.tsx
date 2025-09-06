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
  // MFA methods
  enrollMFA: () => Promise<{ qrCodeUrl?: string; secret?: string; error?: any }>;
  verifyMFA: (code: string, factorId: string) => Promise<{ error?: any }>;
  unenrollMFA: (factorId: string) => Promise<{ error?: any }>;
  hasMFA: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasMFA, setHasMFA] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        checkMFAStatus();
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
          await checkMFAStatus();
        } else {
          setProfile(null);
          setHasMFA(false);
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

  const checkMFAStatus = async () => {
    try {
      const { data: factors } = await supabase.auth.mfa.listFactors();
      setHasMFA(factors?.totp?.length > 0);
    } catch (error) {
      console.error('Error checking MFA status:', error);
      setHasMFA(false);
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

  const enrollMFA = async () => {
    try {
      const { data: enrollData, error: enrollError } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'Authenticator App',
      });

      if (enrollError) {
        return { error: enrollError };
      }

      return {
        qrCodeUrl: enrollData?.totp?.qr_code,
        secret: enrollData?.totp?.secret,
        factorId: enrollData?.id,
      };
    } catch (error) {
      return { error };
    }
  };

  const verifyMFA = async (code: string, factorId: string) => {
    try {
      const { error } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: '', // This would be provided by the enrollment process
        code,
      });

      if (!error) {
        await checkMFAStatus();
      }

      return { error };
    } catch (error) {
      return { error };
    }
  };

  const unenrollMFA = async (factorId: string) => {
    try {
      const { error } = await supabase.auth.mfa.unenroll({ factorId });
      
      if (!error) {
        await checkMFAStatus();
      }

      return { error };
    } catch (error) {
      return { error };
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
    enrollMFA,
    verifyMFA,
    unenrollMFA,
    hasMFA,
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
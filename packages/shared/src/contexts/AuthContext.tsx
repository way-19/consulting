import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// Types
interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  display_name?: string;
  role: 'admin' | 'consultant' | 'client';
  country_id?: string;
  phone?: string;
  company?: string;
  avatar_url?: string;
  preferred_language?: string;
  timezone?: string;
  is_active: boolean;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  role: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>;
  enrollMfaFactor: (params: { factorType: string; friendlyName: string; issuer: string }) => Promise<{ data: any; error: any }>;
  verifyMfaFactor: (params: { factorId: string; challengeId: string; code: string }) => Promise<{ data: any; error: any }>;
  unenrollMfaFactor: () => Promise<{ error: any }>;
  challengeMfa: (factorId: string) => Promise<{ data: any; error: any }>;
  verifyMfaChallenge: (challengeId: string, code: string) => Promise<{ data: any; error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
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
      async (_event, session) => {
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

    return () => subscription?.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.error('Unexpected error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return { error };
    } catch (err: any) {
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      return { error };
    } catch (err: any) {
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setProfile(null);
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!user?.id) {
        return { error: new Error('No user logged in') };
      }

      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id);

      if (!error) {
        // Refresh profile data
        await fetchProfile(user.id);
      }

      return { error };
    } catch (err: any) {
      return { error: err };
    }
  };

  // 2FA Functions
  const enrollMfaFactor = async (params: { factorType: string; friendlyName: string; issuer: string }) => {
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: params.friendlyName,
        issuer: params.issuer
      });

      return { data, error };
    } catch (err: any) {
      return { data: null, error: err };
    }
  };

  const verifyMfaFactor = async (params: { factorId: string; challengeId: string; code: string }) => {
    try {
      const { data, error } = await supabase.auth.mfa.challengeAndVerify({
        factorId: params.factorId,
        code: params.code
      });

      return { data, error };
    } catch (err: any) {
      return { data: null, error: err };
    }
  };

  const unenrollMfaFactor = async () => {
    try {
      // Get current factors
      const { data: factors } = await supabase.auth.mfa.listFactors();
      
      if (factors?.totp && factors.totp.length > 0) {
        const factor = factors.totp[0];
        const { data, error } = await supabase.auth.mfa.unenroll({
          factorId: factor.id
        });
        return { data, error };
      }
      
      return { data: null, error: new Error('No MFA factor found') };
    } catch (err: any) {
      return { data: null, error: err };
    }
  };

  const challengeMfa = async (factorId: string) => {
    try {
      const { data, error } = await supabase.auth.mfa.challenge({
        factorId
      });

      return { data, error };
    } catch (err: any) {
      return { data: null, error: err };
    }
  };

  const verifyMfaChallenge = async (challengeId: string, code: string) => {
    try {
      const { data, error } = await supabase.auth.mfa.verify({
        challengeId,
        code
      });

      return { data, error };
    } catch (err: any) {
      return { data: null, error: err };
    }
  };

  const value: AuthContextType = {
    user,
    session,
    profile,
    role: profile?.role || null,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    enrollMfaFactor,
    verifyMfaFactor,
    unenrollMfaFactor,
    challengeMfa,
    verifyMfaChallenge,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
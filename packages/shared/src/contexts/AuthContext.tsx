import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  display_name: string | null;
  role: 'admin' | 'consultant' | 'client';
  country_id: string | null;
  phone: string | null;
  company: string | null;
  avatar_url: string | null;
  preferred_language: string | null;
  timezone: string | null;
  is_active: boolean;
  metadata: any;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  role: string | null;
  mfaChallenge: { challengeId: string; factorId: string; } | null;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | Error | null }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  verifyMfaCode: (challengeId: string, code: string) => Promise<{ error: AuthError | Error | null }>;
  enrollMfaFactor: () => Promise<{ error: AuthError | Error | null; factorId?: string; qrCode?: string; secret?: string }>;
  verifyMfaFactor: (factorId: string, code: string) => Promise<{ error: AuthError | Error | null }>;
  unenrollMfaFactor: (factorId: string) => Promise<{ error: AuthError | Error | null }>;
  getMfaFactors: () => Promise<{ data: any[] | null; error: AuthError | Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [mfaChallenge, setMfaChallenge] = useState<{ challengeId: string; factorId: string; } | null>(null);

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
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.error('Unexpected error fetching profile:', err);
      setProfile(null);
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

      if (error) {
        if (error.message === 'mfa_required' && data?.mfa) {
          // MFA is required, capture challenge details
          setMfaChallenge({
            challengeId: data.mfa.challengeId,
            factorId: data.mfa.factorId,
          });
          setLoading(false);
          return { error: new Error('mfa_required') };
        }
        
        // Handle other errors
        setLoading(false);
        return { error };
      }

      // Successful sign-in without MFA
      setMfaChallenge(null);
      return { error: null };
    } catch (err: any) {
      setLoading(false);
      return { error: err };
    }
  };

  const verifyMfaCode = async (challengeId: string, code: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.mfa.verify({
        challengeId,
        code,
      });

      if (error) {
        setLoading(false);
        return { error };
      }

      // Successful MFA verification
      setMfaChallenge(null);
      return { error: null };
    } catch (err: any) {
      setLoading(false);
      return { error: err };
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });

    return { error };
  };

  const signOut = async () => {
    setMfaChallenge(null);
    await supabase.auth.signOut();
  };

  const enrollMfaFactor = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp'
      });

      if (error) {
        return { error };
      }

      return { 
        error: null, 
        factorId: data.id,
        qrCode: data.totp?.qr_code,
        secret: data.totp?.secret
      };
    } catch (err: any) {
      return { error: err };
    }
  };

  const verifyMfaFactor = async (factorId: string, code: string) => {
    try {
      const { data, error } = await supabase.auth.mfa.verify({
        factorId,
        code
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const unenrollMfaFactor = async (factorId: string) => {
    try {
      const { error } = await supabase.auth.mfa.unenroll({
        factorId
      });

      return { error };
    } catch (err: any) {
      return { error: err };
    }
  };

  const getMfaFactors = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      return { data: data?.totp || [], error };
    } catch (err: any) {
      return { data: null, error: err };
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    role: profile?.role || null,
    mfaChallenge,
    signIn,
    signUp,
    signOut,
    verifyMfaCode,
    enrollMfaFactor,
    verifyMfaFactor,
    unenrollMfaFactor,
    getMfaFactors,
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
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

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

interface MfaChallenge {
  challengeId: string;
  type: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  role: string | null;
  loading: boolean;
  mfaChallenge: MfaChallenge | null;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  verifyMfaCode: (challengeId: string, code: string) => Promise<{ error: AuthError | null }>;
  enrollMfaFactor: () => Promise<{ error: AuthError | null; factorId?: string; qrCode?: string; secret?: string }>;
  verifyMfaFactor: (factorId: string, code: string) => Promise<{ error: AuthError | null }>;
  unenrollMfaFactor: (factorId: string) => Promise<{ error: AuthError | null }>;
  getMfaFactors: () => Promise<{ data: any[] | null; error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [mfaChallenge, setMfaChallenge] = useState<MfaChallenge | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setRole(null);
        setMfaChallenge(null);
        setLoading(false);
      }
    });

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
        setRole(null);
      } else {
        setProfile(data);
        setRole(data.role);
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
      setProfile(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setMfaChallenge(null);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoading(false);
        
        if (error.message.includes('mfa') || error.message.includes('factor')) {
          setMfaChallenge({
            challengeId: data?.session?.user?.id || 'mfa-required',
            type: 'totp'
          });
          return { error: { ...error, message: 'mfa_required' } as AuthError };
        }
        
        return { error };
      }

      // Successful login without MFA - loading will be handled by onAuthStateChange
      return { error: null };
    } catch (err) {
      setLoading(false);
      console.error('Sign in error:', err);
      return { error: err as AuthError };
    }
  };

  const verifyMfaCode = async (challengeId: string, code: string) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        token: code,
        type: 'totp'
      });

      if (error) {
        setLoading(false);
        return { error };
      }

      // Clear MFA challenge on success
      setMfaChallenge(null);
      
      // Successful MFA verification - loading will be handled by onAuthStateChange
      return { error: null };
    } catch (err) {
      setLoading(false);
      console.error('MFA verification error:', err);
      return { error: err as AuthError };
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

      if (error) {
        setLoading(false);
        return { error };
      }

      // Successful signup - loading will be handled by onAuthStateChange
      return { error: null };
    } catch (err) {
      setLoading(false);
      console.error('Sign up error:', err);
      return { error: err as AuthError };
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        setLoading(false);
        return { error };
      }

      // Clear all state
      setUser(null);
      setProfile(null);
      setRole(null);
      setMfaChallenge(null);
      setLoading(false);
      
      return { error: null };
    } catch (err) {
      setLoading(false);
      console.error('Sign out error:', err);
      return { error: err as AuthError };
    }
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
    } catch (err) {
      console.error('MFA enrollment error:', err);
      return { error: err as AuthError };
    }
  };

  const verifyMfaFactor = async (factorId: string, code: string) => {
    try {
      const { data, error } = await supabase.auth.mfa.challengeAndVerify({
        factorId,
        code
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (err) {
      console.error('MFA factor verification error:', err);
      return { error: err as AuthError };
    }
  };

  const unenrollMfaFactor = async (factorId: string) => {
    try {
      const { error } = await supabase.auth.mfa.unenroll({
        factorId
      });

      return { error };
    } catch (err) {
      console.error('MFA unenrollment error:', err);
      return { error: err as AuthError };
    }
  };

  const getMfaFactors = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      return { data: data?.totp || [], error };
    } catch (err) {
      console.error('Get MFA factors error:', err);
      return { data: null, error: err as AuthError };
    }
  };

  const value = {
    user,
    profile,
    role,
    loading,
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

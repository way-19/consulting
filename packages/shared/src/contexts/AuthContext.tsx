import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: any;
  role: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updateProfile: (updates: any) => Promise<{ error: any }>;
  changePassword: (newPassword: string) => Promise<{ error: any }>;
  // 2FA Methods
  enrollMfaFactor: (type: 'totp') => Promise<{ factor: any; qrCode: string; secret: string; error?: any }>;
  verifyMfaFactor: (factorId: string, code: string) => Promise<{ error: any }>;
  unenrollMfaFactor: (factorId: string) => Promise<{ error: any }>;
  challengeMfa: (factorId: string) => Promise<{ challengeId: string; error?: any }>;
  verifyMfaChallenge: (challengeId: string, code: string) => Promise<{ error: any }>;
  getMfaFactors: () => Promise<{ factors: any[]; error?: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
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
          setRole(null);
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
        return;
      }

      setProfile(data);
      setRole(data?.role || null);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string, metadata = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });
      
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const updateProfile = async (updates: any) => {
    try {
      if (!user) {
        return { error: { message: 'No user logged in' } };
      }

      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id);

      if (!error) {
        // Refresh profile
        await fetchProfile(user.id);
      }
      
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const changePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      return { error };
    } catch (error) {
      return { error };
    }
  };

  // 2FA Methods
  const enrollMfaFactor = async (type: 'totp') => {
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: type,
        friendlyName: 'Consulting19 Account'
      });

      if (error) {
        return { factor: null, qrCode: '', secret: '', error };
      }

      return {
        factor: data,
        qrCode: data.totp?.qr_code || '',
        secret: data.totp?.secret || '',
        error: null
      };
    } catch (error) {
      return { factor: null, qrCode: '', secret: '', error };
    }
  };

  const verifyMfaFactor = async (factorId: string, code: string) => {
    try {
      const { data, error } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: factorId, // For TOTP, challenge ID is the factor ID
        code
      });

      if (!error) {
        // Refresh user session to get updated MFA status
        await supabase.auth.refreshSession();
      }

      return { error };
    } catch (error) {
      return { error };
    }
  };

  const unenrollMfaFactor = async (factorId: string) => {
    try {
      const { error } = await supabase.auth.mfa.unenroll({ factorId });
      
      if (!error) {
        // Refresh user session
        await supabase.auth.refreshSession();
      }

      return { error };
    } catch (error) {
      return { error };
    }
  };

  const challengeMfa = async (factorId: string) => {
    try {
      const { data, error } = await supabase.auth.mfa.challenge({ factorId });
      
      return {
        challengeId: data?.id || '',
        error
      };
    } catch (error) {
      return { challengeId: '', error };
    }
  };

  const verifyMfaChallenge = async (challengeId: string, code: string) => {
    try {
      const { error } = await supabase.auth.mfa.verify({
        factorId: '', // Not needed for challenge verification
        challengeId,
        code
      });

      return { error };
    } catch (error) {
      return { error };
    }
  };

  const getMfaFactors = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      
      return {
        factors: data?.totp || [],
        error
      };
    } catch (error) {
      return { factors: [], error };
    }
  };

  const value = {
    user,
    session,
    profile,
    role,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    changePassword,
    // 2FA Methods
    enrollMfaFactor,
    verifyMfaFactor,
    unenrollMfaFactor,
    challengeMfa,
    verifyMfaChallenge,
    getMfaFactors
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
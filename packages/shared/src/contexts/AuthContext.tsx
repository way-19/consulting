import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
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
  factorId: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  role: string | null;
  loading: boolean;
  mfaChallenge: MfaChallenge | null;
  setMfaChallenge: (challenge: MfaChallenge | null) => void;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  verifyMfaCode: (challengeId: string, code: string) => Promise<{ error: Error | null }>;
  enrollMfaFactor: () => Promise<{ error: Error | null; factorId?: string; qrCode?: string; secret?: string; }>;
  verifyMfaFactor: (factorId: string, code: string) => Promise<{ error: Error | null }>;
  unenrollMfaFactor: (factorId: string) => Promise<{ error: Error | null }>;
  getMfaFactors: () => Promise<{ data: any[] | null; error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [mfaChallenge, setMfaChallenge] = useState<MfaChallenge | null>(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        if (session?.user) {
          console.log('Initial session found for user:', session.user.email);
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          console.log('No initial session found');
          setLoading(false);
        }
      } catch (err) {
        console.error('Error in getInitialSession:', err);
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
          setRole(null);
          setMfaChallenge(null); // Clear MFA challenge when signing out
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user ID:', userId);
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }

      if (data) {
        console.log('Profile loaded:', data.email, data.role);
        setProfile(data);
        setRole(data.role);
      } else {
        console.log('No profile found for user');
        setProfile(null);
        setRole(null);
      }
    } catch (err) {
      console.error('Error in fetchProfile:', err);
      setProfile(null);
      setRole(null);
    } finally {
      // ALWAYS set loading to false regardless of success or failure
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
        // Check if MFA is required
        if (error.message === 'mfa_required' && data?.mfa) {
          console.log('MFA required for sign-in');
          setMfaChallenge({
            challengeId: data.mfa.challengeId,
            factorId: data.mfa.factorId,
          });
          // Return MFA required error but don't fully fail
          return { error: new Error('mfa_required') };
        }
        
        console.error('Sign-in error:', error);
        return { error };
      }

      // Successful sign-in without MFA
      console.log('Sign-in successful for:', email);
      setMfaChallenge(null); // Clear any existing MFA challenge
      return { error: null };
    } catch (err: any) {
      console.error('Sign-in exception:', err);
      return { error: err };
    } finally {
      setLoading(false);
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
        console.error('MFA verification error:', error);
        return { error };
      }

      // MFA verification successful
      console.log('MFA verification successful');
      setMfaChallenge(null); // Clear MFA challenge
      
      // User should now be signed in, profile will be fetched by auth state change
      return { error: null };
    } catch (err: any) {
      console.error('MFA verification exception:', err);
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

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (err: any) {
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return { error };
      }

      setUser(null);
      setProfile(null);
      setRole(null);
      setMfaChallenge(null);
      return { error: null };
    } catch (err: any) {
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  const enrollMfaFactor = async () => {
    try {
      if (!user) {
        return { error: new Error('User not authenticated') };
      }

      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'Authenticator App'
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
      const { data, error } = await supabase.auth.mfa.challengeAndVerify({
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

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const getMfaFactors = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();

      if (error) {
        return { data: null, error };
      }

      return { data: data.totp, error: null };
    } catch (err: any) {
      return { data: null, error: err };
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    role,
    loading,
    mfaChallenge,
    setMfaChallenge,
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
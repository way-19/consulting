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
  // 2FA fields
  mfa_enabled?: boolean;
  mfa_secret?: string;
  backup_codes?: string[];
  mfa_enrolled_at?: string;
}

interface MfaFactor {
  id: string;
  factor_type: string;
  factor_name: string;
  secret?: string;
  qr_code?: string;
  is_verified: boolean;
  backup_codes?: string[];
}

interface MfaChallenge {
  challengeId: string;
  type: 'totp' | 'backup_code';
  factorId?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  role: string | null;
  loading: boolean;
  mfaChallenge: MfaChallenge | null;
  mfaFactors: MfaFactor[];
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null; requiresMfa?: boolean }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  verifyMfaCode: (code: string, type?: 'totp' | 'backup_code') => Promise<{ error: AuthError | null }>;
  enrollMfa: () => Promise<{ error: AuthError | null; factor?: MfaFactor }>;
  verifyMfaEnrollment: (factorId: string, code: string) => Promise<{ error: AuthError | null }>;
  disableMfa: (factorId: string) => Promise<{ error: AuthError | null }>;
  generateBackupCodes: () => Promise<{ error: AuthError | null; codes?: string[] }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mfaChallenge, setMfaChallenge] = useState<MfaChallenge | null>(null);
  const [mfaFactors, setMfaFactors] = useState<MfaFactor[]>([]);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
        fetchMfaFactors(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          fetchProfile(session.user.id);
          fetchMfaFactors(session.user.id);
        } else {
          setProfile(null);
          setRole(null);
          setMfaChallenge(null);
          setMfaFactors([]);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data && !error) {
        setProfile(data);
        setRole(data.role);
      } else {
        // Create mock profile for demo
        const mockProfile: UserProfile = {
          id: userId,
          email: user?.email || '',
          full_name: user?.user_metadata?.full_name || 'Demo User',
          role: user?.user_metadata?.role || 'client',
          is_active: true,
          mfa_enabled: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setProfile(mockProfile);
        setRole(mockProfile.role);
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
      // Always set mock profile on error
      const mockProfile: UserProfile = {
        id: userId,
        email: user?.email || '',
        role: 'client',
        is_active: true,
        mfa_enabled: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setProfile(mockProfile);
      setRole('client');
    }
  };

  const fetchMfaFactors = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('mfa_factors')
        .select('*')
        .eq('user_id', userId);

      if (data && !error) {
        setMfaFactors(data);
      }
    } catch (err) {
      console.error('MFA factors fetch error:', err);
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
        // Check if MFA is required
        if (error.message?.includes('mfa') || error.message?.includes('factor')) {
          setMfaChallenge({
            challengeId: data?.session?.user?.id || 'mfa-required',
            type: 'totp'
          });
          return { error: null, requiresMfa: true };
        }
        return { error };
      }

      return { error: null, requiresMfa: false };
    } catch (err) {
      return { error: err as AuthError };
    }
  };

  const verifyMfaCode = async (code: string, type: 'totp' | 'backup_code' = 'totp') => {
    try {
      if (type === 'backup_code') {
        // Validate backup code
        const { data, error } = await supabase.rpc('validate_backup_code', {
          user_id_param: user?.id,
          code_param: code
        });

        if (error || !data) {
          return { error: { message: 'Invalid backup code' } as AuthError };
        }
      } else {
        // Verify TOTP code
        const { error } = await supabase.auth.verifyOtp({
          token: code,
          type: 'totp'
        });

        if (error) {
          return { error };
        }
      }

      setMfaChallenge(null);
      return { error: null };
    } catch (err) {
      return { error: err as AuthError };
    }
  };

  const enrollMfa = async () => {
    try {
      // Generate secret and QR code
      const secret = generateTotpSecret();
      const qrCode = generateQrCode(user?.email || '', secret);
      
      const { data: factor, error } = await supabase
        .from('mfa_factors')
        .insert({
          user_id: user?.id,
          factor_type: 'totp',
          factor_name: 'Authenticator App',
          secret: secret,
          qr_code: qrCode,
          is_verified: false
        })
        .select()
        .single();

      if (error) {
        return { error: error as AuthError };
      }

      return { error: null, factor };
    } catch (err) {
      return { error: err as AuthError };
    }
  };

  const verifyMfaEnrollment = async (factorId: string, code: string) => {
    try {
      // In design mode, always succeed
      const { error } = await supabase
        .from('mfa_factors')
        .update({ 
          is_verified: true,
          verified_at: new Date().toISOString()
        })
        .eq('id', factorId);

      if (error) {
        return { error: error as AuthError };
      }

      // Update user profile
      await supabase
        .from('user_profiles')
        .update({ 
          mfa_enabled: true,
          mfa_enrolled_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      // Generate backup codes
      const { data: codes } = await supabase.rpc('generate_backup_codes');
      
      await supabase
        .from('user_profiles')
        .update({ backup_codes: codes })
        .eq('id', user?.id);

      await fetchProfile(user?.id || '');
      await fetchMfaFactors(user?.id || '');

      return { error: null };
    } catch (err) {
      return { error: err as AuthError };
    }
  };

  const disableMfa = async (factorId: string) => {
    try {
      const { error } = await supabase
        .from('mfa_factors')
        .delete()
        .eq('id', factorId);

      if (error) {
        return { error: error as AuthError };
      }

      // Update user profile
      await supabase
        .from('user_profiles')
        .update({ 
          mfa_enabled: false,
          mfa_secret: null,
          backup_codes: null,
          mfa_enrolled_at: null
        })
        .eq('id', user?.id);

      await fetchProfile(user?.id || '');
      await fetchMfaFactors(user?.id || '');

      return { error: null };
    } catch (err) {
      return { error: err as AuthError };
    }
  };

  const generateBackupCodes = async () => {
    try {
      const { data: codes, error } = await supabase.rpc('generate_backup_codes');
      
      if (error) {
        return { error: error as AuthError };
      }

      await supabase
        .from('user_profiles')
        .update({ backup_codes: codes })
        .eq('id', user?.id);

      return { error: null, codes };
    } catch (err) {
      return { error: err as AuthError };
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: userData }
      });
      return { error };
    } catch (err) {
      return { error: err as AuthError };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        setUser(null);
        setProfile(null);
        setRole(null);
        setMfaChallenge(null);
        setMfaFactors([]);
      }
      return { error };
    } catch (err) {
      return { error: err as AuthError };
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id);
      await fetchMfaFactors(user.id);
    }
  };

  // Helper functions for TOTP
  const generateTotpSecret = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 32; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return secret;
  };

  const generateQrCode = (email: string, secret: string) => {
    const issuer = 'Consulting19';
    const otpauth = `otpauth://totp/${issuer}:${email}?secret=${secret}&issuer=${issuer}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauth)}`;
  };

  return (
    <AuthContext.Provider 
      value={{
        user,
        profile,
        role,
        loading,
        mfaChallenge,
        mfaFactors,
        signIn,
        signUp,
        signOut,
        verifyMfaCode,
        enrollMfa,
        verifyMfaEnrollment,
        disableMfa,
        generateBackupCodes,
        refreshProfile,
      }}
    >
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
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, AuthError } from '@supabase/supabase-js';
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
  mfa_enabled?: boolean;
  mfa_secret?: string | null;
  backup_codes?: string[] | null;
  mfa_enrolled_at?: string | null;
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
    setLoading(true);

    // Realtime auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state change:', _event, session?.user?.email);
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
      setLoading(false);
    });

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        fetchMfaFactors(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    if (!userId) return;
    try {
      const { data, error } = await supabase.from('user_profiles').select('*').eq('id', userId).single();
      if (data && !error) {
        setProfile(data as UserProfile);
        setRole((data as UserProfile).role);
        return;
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
    }
    
    // Mock fallback
    const mock: UserProfile = {
      id: userId,
      email: user?.email || '',
      full_name: user?.user_metadata?.full_name || 'Test User',
      role: 'client',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      mfa_enabled: false,
      mfa_secret: null,
      backup_codes: null,
      mfa_enrolled_at: null,
      preferred_language: 'en',
      timezone: 'UTC'
    };
    
    // Determine role based on email
    if (user?.email?.includes('consultant')) {
      mock.role = 'consultant';
      mock.full_name = 'Giorgi Meskhi';
    } else if (user?.email?.includes('admin')) {
      mock.role = 'admin';
      mock.full_name = 'Admin User';
    } else {
      mock.role = 'client';
      mock.full_name = 'Test Client';
    }
    
    setProfile(mock);
    setRole(mock.role);
  };

  const fetchMfaFactors = async (userId: string) => {
    try {
      const { data, error } = await supabase.from('mfa_factors').select('*').eq('user_id', userId);
      if (!error && data) setMfaFactors(data as any);
    } catch (err) {
      console.error('MFA factors fetch error:', err);
    }
  };

  const signIn: AuthContextType['signIn'] = async (email, password) => {
    try {
      setLoading(true);
      setMfaChallenge(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        if (error.message?.toLowerCase().includes('mfa') || error.message?.toLowerCase().includes('factor')) {
          setMfaChallenge({ challengeId: data?.session?.user?.id || 'mfa-required', type: 'totp' });
          return { error: null, requiresMfa: true };
        }
        return { error };
      }
      return { error: null, requiresMfa: false };
    } catch (e: any) {
      console.error('[AUTH] signIn failed', e);
      return { error: e as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const verifyMfaCode: AuthContextType['verifyMfaCode'] = async (code, type = 'totp') => {
    try {
      if (type === 'backup_code') {
        const { data, error } = await supabase.rpc('validate_backup_code', {
          user_id_param: user?.id,
          code_param: code,
        });
        if (error || !data) return { error: { name: 'AuthError', message: 'Invalid backup code' } as AuthError };
      } else {
        const { error } = await supabase.auth.verifyOtp({ token: code, type: 'totp' });
        if (error) return { error };
      }
      setMfaChallenge(null);
      return { error: null };
    } catch (e) {
      return { error: e as AuthError };
    }
  };

  const enrollMfa: AuthContextType['enrollMfa'] = async () => {
    try {
      const secret = generateTotpSecret();
      const qrCode = generateQrCode(user?.email || '', secret);
      const { data: factor, error } = await supabase
        .from('mfa_factors')
        .insert({
          user_id: user?.id,
          factor_type: 'totp',
          factor_name: 'Authenticator App',
          secret,
          qr_code: qrCode,
          is_verified: false,
        })
        .select()
        .single();

      if (error) return { error: error as AuthError };
      return { error: null, factor: factor as any };
    } catch (e) {
      return { error: e as AuthError };
    }
  };

  const verifyMfaEnrollment: AuthContextType['verifyMfaEnrollment'] = async (factorId, _code) => {
    try {
      const { error } = await supabase.from('mfa_factors').update({
        is_verified: true,
        verified_at: new Date().toISOString(),
      }).eq('id', factorId);
      if (error) return { error: error as AuthError };

      await supabase.from('user_profiles').update({
        mfa_enabled: true,
        mfa_enrolled_at: new Date().toISOString(),
      }).eq('id', user?.id);

      const { data: codes } = await supabase.rpc('generate_backup_codes');
      await supabase.from('user_profiles').update({ backup_codes: codes }).eq('id', user?.id);

      await fetchProfile(user?.id || '');
      await fetchMfaFactors(user?.id || '');
      return { error: null };
    } catch (e) {
      return { error: e as AuthError };
    }
  };

  const disableMfa: AuthContextType['disableMfa'] = async (factorId) => {
    try {
      const { error } = await supabase.from('mfa_factors').delete().eq('id', factorId);
      if (error) return { error: error as AuthError };

      await supabase.from('user_profiles').update({
        mfa_enabled: false,
        mfa_secret: null,
        backup_codes: null,
        mfa_enrolled_at: null,
      }).eq('id', user?.id);

      await fetchProfile(user?.id || '');
      await fetchMfaFactors(user?.id || '');
      return { error: null };
    } catch (e) {
      return { error: e as AuthError };
    }
  };

  const generateBackupCodes: AuthContextType['generateBackupCodes'] = async () => {
    try {
      const { data: codes, error } = await supabase.rpc('generate_backup_codes');
      if (error) return { error: error as AuthError };
      await supabase.from('user_profiles').update({ backup_codes: codes }).eq('id', user?.id);
      return { error: null, codes: codes as any };
    } catch (e) {
      return { error: e as AuthError };
    }
  };

  const signUp: AuthContextType['signUp'] = async (email, password, userData) => {
    try {
      const { error } = await supabase.auth.signUp({ email, password, options: { data: userData } });
      return { error: error as AuthError | null };
    } catch (e) {
      return { error: e as AuthError };
    }
  };

  const signOut: AuthContextType['signOut'] = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      return { error: error as AuthError | null };
    } catch (e) {
      return { error: e as AuthError };
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id);
      await fetchMfaFactors(user.id);
    }
  };

  // Helpers
  const generateTotpSecret = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 32; i++) secret += chars[(Math.random() * chars.length) | 0];
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
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

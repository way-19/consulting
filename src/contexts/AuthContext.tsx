import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: 'client' | 'consultant' | 'admin' | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<'client' | 'consultant' | 'admin' | null>(null);
  const [loading, setLoading] = useState(true);

  const determineRoleFromEmail = (email: string): 'client' | 'consultant' | 'admin' => {
    console.log('📧 Determining role from email:', email);
    
    if (email === 'admin@consulting19.com') {
      console.log('👑 Admin role detected');
      return 'admin';
    } else if (email === 'giorgi.meskhi@consulting19.com') {
      console.log('💼 Consultant role detected');
      return 'consultant';
    } else {
      console.log('👤 Client role detected (default)');
      return 'client';
    }
  };

  const handleAuthChange = (session: Session | null) => {
    console.log('🔄 Auth state changed, session:', !!session);
    
    setSession(session);
    setUser(session?.user ?? null);
    
    if (session?.user?.email) {
      const role = determineRoleFromEmail(session.user.email);
      console.log('✅ Role determined:', role);
      setUserRole(role);
      
      // Create user profile if it doesn't exist
      createUserProfileIfNeeded(session.user, role);
    } else {
      console.log('❌ No user email, setting role to null');
      setUserRole(null);
    }
    
    console.log('🏁 Setting loading to false');
    setLoading(false);
  };

  const createUserProfileIfNeeded = async (user: User, role: string) => {
    console.log('👤 Checking if user profile exists for:', user.id);
    console.log('🔑 User session info:', {
      hasAccessToken: !!user.access_token,
      userRole: user.role,
      aud: user.aud,
    });
    try {
      console.log('👤 Checking if user profile exists for:', user.id);
      
      // Check if profile exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        console.log('⚠️ Error checking profile:', checkError.message);
        return;
      }

      if (existingProfile) {
        console.log('✅ Profile already exists');
        return;
      }

      // Create profile if it doesn't exist
      console.log('📝 Creating user profile...');
      const { error: createError } = await supabase
        .from('user_profiles')
        .insert({
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || '',
          role: role as any,
          country: user.user_metadata?.country || null,
        });

      if (createError) {
        console.log('⚠️ Error creating profile:', createError.message);
      } else {
        console.log('✅ Profile created successfully');
      }
    } catch (error) {
      console.log('💥 Unexpected error in profile creation:', error);
    }
  };

  useEffect(() => {
    console.log('🚀 AuthProvider initializing...');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('📱 Initial session loaded:', !!session);
      handleAuthChange(session);
    }).catch((error) => {
      console.error('💥 Error getting initial session:', error);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔔 Auth event:', event);
      handleAuthChange(session);
    });

    return () => {
      console.log('🧹 Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('🔐 Signing in with email:', email);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error('💥 Sign in error:', error);
    } else {
      console.log('✅ Sign in successful');
    }
    return { error };
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    console.log('📝 Signing up with email:', email);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        emailRedirectTo: undefined,
      },
    });
    if (error) {
      console.error('💥 Sign up error:', error);
    } else {
      console.log('✅ Sign up successful');
    }
    return { error };
  };

  const signOut = async () => {
    console.log('👋 Signing out...');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('💥 Sign out error:', error);
        throw error;
      }
      console.log('✅ Sign out successful');
    } catch (error) {
      console.error('💥 Sign out failed:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    console.log('🔄 Resetting password for:', email);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      console.error('💥 Reset password error:', error);
    } else {
      console.log('✅ Reset password email sent');
    }
    return { error };
  };

  const value = {
    user,
    session,
    userRole,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  console.log('🎯 AuthProvider render - loading:', loading, 'userRole:', userRole, 'user:', !!user);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
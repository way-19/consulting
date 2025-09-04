import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { UserProfile } from '../types/database';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  role: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper function to derive profile and role from user session
  const deriveProfileAndRole = (sessionUser: User): { profile: UserProfile, role: string } => {
    const userRole = sessionUser.user_metadata?.role || 'client';
    
    const profile: UserProfile = {
      id: sessionUser.id,
      email: sessionUser.email || '',
      full_name: sessionUser.user_metadata?.full_name || '',
      display_name: sessionUser.user_metadata?.display_name,
      role: userRole,
      country_id: sessionUser.user_metadata?.country_id,
      phone: sessionUser.user_metadata?.phone,
      company: sessionUser.user_metadata?.company,
      avatar_url: sessionUser.user_metadata?.avatar_url,
      preferred_language: sessionUser.user_metadata?.preferred_language || 'en',
      timezone: sessionUser.user_metadata?.timezone || 'UTC',
      is_active: true,
      metadata: sessionUser.user_metadata || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return { profile, role: userRole };
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Derive profile and role from session user metadata
        const { profile: derivedProfile, role: derivedRole } = deriveProfileAndRole(session.user);
        setProfile(derivedProfile);
        setRole(derivedRole);
        setLoading(false);
        
        // Try to fetch real profile in background
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Derive profile and role from session user metadata
          const { profile: derivedProfile, role: derivedRole } = deriveProfileAndRole(session.user);
          setProfile(derivedProfile);
          setRole(derivedRole);
          setLoading(false);
          
          // Try to fetch real profile in background
          fetchProfile(session.user.id);
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
    console.log('Fetching profile for user:', userId);
    
    // Temporarily disable database query due to RLS permission issues
    // TODO: Re-enable once RLS policies are fixed in Supabase
    console.warn('Database query disabled due to RLS permission issues, using session data fallback');

    // Fallback to session data if database fetch fails
    const sessionUser = user;
    if (sessionUser) {
      // Use helper function to derive profile and role consistently
      const { profile: derivedProfile, role: derivedRole } = deriveProfileAndRole(sessionUser);
      setProfile(derivedProfile);
      setRole(derivedRole);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      // Refresh using latest session data
      const { data: { user: latestUser } } = await supabase.auth.getUser();
      if (latestUser) {
        const { profile: derivedProfile, role: derivedRole } = deriveProfileAndRole(latestUser);
        setProfile(derivedProfile);
        setRole(derivedRole);
        setUser(latestUser);
      }
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });

    // Create user profile after successful signup
    if (!error && data.user) {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: data.user.id,
          email: data.user.email!,
          full_name: metadata?.full_name || '',
          role: metadata?.role || 'client',
          country_id: metadata?.country_id,
          phone: metadata?.phone,
          company: metadata?.company,
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
      }
    }

    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error };
  };

  return (
    <AuthContext.Provider 
      value={{
        user,
        session,
        profile,
        role,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
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
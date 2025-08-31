import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@consulting19/supabase';

type Role = 'admin' | 'consultant' | 'client' | null;

type AuthContextValue = {
  user: User | null;
  role: Role;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<unknown>;
  signUp: (email: string, password: string, metadata?: any) => Promise<unknown>;
  resetPassword: (email: string) => Promise<unknown>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (cancelled) return;

        const u = session?.user ?? null;
        setUser(u);

        let r: Role = (u?.app_metadata as any)?.role ?? null;
        if (!r && u) {
          try {
            const { data } = await supabase.from('user_profiles').select('role').eq('id', u.id).maybeSingle();
            r = (data?.role as Role) ?? null;
          } catch (error) {
            console.error('Error fetching user role:', error);
          }
        }
        setRole(r);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      const u = session?.user ?? null;
      setUser(u);
      
      // Get role from user_profiles table
      if (u) {
        supabase.from('user_profiles').select('role').eq('id', u.id).maybeSingle()
          .then(({ data }) => {
            const r: Role = (data?.role as Role) ?? null;
            setRole(r);
          })
          .catch(error => {
            console.error('Error fetching user role:', error);
            setRole(null);
          });
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => { cancelled = true; sub?.subscription?.unsubscribe?.(); };
  }, []);

  const signIn = (email: string, password: string) => supabase.auth.signInWithPassword({ email, password });
  const signUp = (email: string, password: string, metadata?: any) => supabase.auth.signUp({ email, password, options: { data: metadata } });
  const resetPassword = (email: string) => supabase.auth.resetPasswordForEmail(email);
  const signOut = () => supabase.auth.signOut();

  return (
    <Ctx.Provider value={{ user, role, loading, signIn, signUp, resetPassword, signOut }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthProvider;
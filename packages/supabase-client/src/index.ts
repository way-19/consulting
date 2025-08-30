import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

function createMock(): SupabaseClient {
  console.warn('🚧 Using mock Supabase client - auth/db disabled');
  // @ts-expect-error - extremely small mock, only what's used in dev
  return {
    auth: { 
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe(){} }}}),
      getSession: async () => ({ data: { session: null }, error: null }),
      signInWithPassword: async () => ({ error: null }),
      signUp: async () => ({ error: null }),
      signOut: async () => ({ error: null }),
      resetPasswordForEmail: async () => ({ error: null })
    },
    from: () => ({ select: async () => ({ data: [], error: null }) })
  };
}

export const supabase: SupabaseClient =
  url && anon && url.startsWith('https') && anon.length > 10
    ? createClient(url, anon)
    : createMock();
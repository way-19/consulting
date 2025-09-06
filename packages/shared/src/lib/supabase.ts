import { createClient } from '@supabase/supabase-js';

const url = (import.meta as any).env?.VITE_SUPABASE_URL;
const anon = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

if (!url || !anon) {
  throw new Error(
    '[ENV] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY (apps/marketing/.env.local ve Netlify env ayarla).'
  );
}

export const supabase = createClient(url, anon, {
  auth: { persistSession: true, autoRefreshToken: true },
});

export default supabase;
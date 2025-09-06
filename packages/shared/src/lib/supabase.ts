import { createClient } from '@supabase/supabase-js';

// Vite (browser) ve test/Node için güvenli ENV okuma
const viteEnv: any =
  (typeof import.meta !== 'undefined' && (import.meta as any).env) || {};
const nodeEnv: any =
  (typeof process !== 'undefined' && (process as any).env) || {};

const SUPABASE_URL: string | undefined =
  viteEnv.VITE_SUPABASE_URL ?? nodeEnv.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY: string | undefined =
  viteEnv.VITE_SUPABASE_ANON_KEY ?? nodeEnv.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('[ENV] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
}

// Dev’de webcontainer origin’indeysek proxy’yi kullan
const useProxy =
  typeof window !== 'undefined' &&
  (location.hostname.includes('webcontainer-api.io') ||
   location.hostname === 'localhost' ||
   location.hostname === '127.0.0.1');

const customFetch = (url: string, options?: RequestInit) => {
  if (useProxy) {
    if (url.startsWith(`${SUPABASE_URL}/auth/v1`)) {
      url = url.replace(`${SUPABASE_URL}/auth/v1`, '/_sb/auth');
    } else if (url.startsWith(`${SUPABASE_URL}/rest/v1`)) {
      url = url.replace(`${SUPABASE_URL}/rest/v1`, '/_sb/rest');
    } else if (url.startsWith(`${SUPABASE_URL}/storage/v1`)) {
      url = url.replace(`${SUPABASE_URL}/storage/v1`, '/_sb/storage');
    }
  }
  return fetch(url, options);
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  global: { fetch: customFetch },
  auth: { persistSession: true, autoRefreshToken: true },
});

export default supabase;

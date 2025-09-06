import { createClient } from '@supabase/supabase-js';

// Direct access to Vite environment variables
const SUPABASE_URL: string | undefined = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY: string | undefined = import.meta.env.VITE_SUPABASE_ANON_KEY;

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

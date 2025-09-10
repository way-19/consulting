// packages/shared/src/lib/supabase.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const isDev = !!import.meta.env.DEV;
const useProxy = import.meta.env.VITE_SB_PROXY === '1';

console.log('[SUPABASE] Configuration:', {
  url: SUPABASE_URL ? 'SET' : 'MISSING',
  key: SUPABASE_ANON_KEY ? 'SET' : 'MISSING',
  isDev,
  useProxy
});

const customFetch = (url: string, options?: RequestInit) => {
  if (useProxy && typeof SUPABASE_URL === 'string') {
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

function makeClient(): SupabaseClient {
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    console.log('[SUPABASE] Creating client with real credentials');
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { fetch: customFetch as any },
      auth: { persistSession: true, autoRefreshToken: true },
    });
  }

  if (!isDev) {
    throw new Error('[SUPABASE] Missing required environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. Please configure these in your .env.local file.');
  }

  console.warn('[SUPABASE] Environment variables missing in development mode - creating inert client');
  const inertFetch: typeof fetch = (() =>
    Promise.reject(
      new Error(
        '[SUPABASE] Missing environment variables: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. ' +
          'apps/<uygulama>/.env.local dosyanıza bu anahtarları ekleyin.'
      )
    )) as any;

  return createClient('https://placeholder.supabase.co', 'public-anon-key', {
    global: { fetch: inertFetch as any },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const supabase = makeClient();
export default supabase;

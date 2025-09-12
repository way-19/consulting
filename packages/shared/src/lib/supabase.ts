// packages/shared/src/lib/supabase.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const isDev = !!import.meta.env.DEV;
const useProxy = import.meta.env.VITE_SB_PROXY === '1';

console.log('Supabase Config:', {
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
    console.log('Creating Supabase client with real credentials');
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { fetch: customFetch as any },
      auth: { persistSession: true, autoRefreshToken: true },
      realtime: { params: { eventsPerSecond: 10 } },
    });
  }

  if (!isDev) {
    console.error('[ENV] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in production');
    throw new Error('[ENV] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
  }

  // DEV: env eksikse inert client; ilk çağrıda açıklayıcı hata verir
  console.warn('Creating inert Supabase client - env variables missing');
  const inertFetch: typeof fetch = (() =>
    Promise.reject(
      new Error(
        '[SUPABASE] Connection failed. Please:\n' +
          '1. Add your Supabase URL and API key to apps/client/.env.local\n' +
          '2. Or click "Connect to Supabase" button in the top right\n' +
          '3. Ensure your Supabase project allows localhost:5176 in CORS settings'
      )
    )) as any;

  console.warn(
    '[ENV] Supabase environment variables missing. Creating inert client for development.'
  );

  return createClient('https://placeholder.supabase.co', 'public-anon-key', {
    global: { fetch: inertFetch as any },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const supabase = makeClient();
export default supabase;

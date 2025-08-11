import { createClient } from '@supabase/supabase-js';

const baseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/+$/, '');
const functionsUrl =
  import.meta.env.VITE_SUPABASE_FUNCTIONS_URL?.replace(/\/+$/, '') ||
  (baseUrl ? `${baseUrl}/functions/v1` : undefined);

if (!baseUrl || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  throw new Error('Supabase env missing: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

const options: any = { auth: { persistSession: true, autoRefreshToken: true } };
if (functionsUrl) options.functions = { url: functionsUrl };

if (import.meta.env.DEV) {
  try {
    const host = new URL(baseUrl).host;
    const ref = host.split('.')[0];
    console.log('[SUPABASE] Resolved URL:', baseUrl, 'ref=', ref);
  } catch {}
}

export const supabase = createClient(
  baseUrl,
  import.meta.env.VITE_SUPABASE_ANON_KEY!,
  options
);

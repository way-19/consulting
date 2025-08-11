import { createClient } from '@supabase/supabase-js';

let baseUrl = import.meta.env.VITE_SUPABASE_URL;
if (baseUrl) {
  while (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);
}
let functionsUrl = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL;
if (functionsUrl) {
  while (functionsUrl.endsWith('/')) functionsUrl = functionsUrl.slice(0, -1);
} else if (baseUrl) {
  functionsUrl = `${baseUrl}/functions/v1`;
}

const options: any = { auth: { persistSession: true, autoRefreshToken: true } };
if (functionsUrl) options.functions = { url: functionsUrl };

if (!baseUrl || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  throw new Error('Supabase env missing: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

if (import.meta.env.DEV) {
  try {
    const host = new URL(baseUrl).host;
    const ref = host.split('.')[0];
    console.log('[SUPABASE] Resolved URL:', baseUrl, 'ref=', ref);
  } catch {}
}

export const supabase = createClient(
  baseUrl!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!,
  options
);

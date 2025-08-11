import { createClient } from '@supabase/supabase-js';

const baseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/+$/, '');
const functionsUrl =
  import.meta.env.VITE_SUPABASE_FUNCTIONS_URL?.replace(/\/+$/, '') ||
  (baseUrl ? `${baseUrl}/functions/v1` : undefined);

const options: any = {
  auth: { persistSession: true, autoRefreshToken: true }
};
if (functionsUrl) options.functions = { url: functionsUrl };

if (import.meta.env.DEV) {
  console.log('[SUPABASE] Resolved URL:', import.meta.env.VITE_SUPABASE_URL);
  if (import.meta.env.VITE_SUPABASE_URL?.includes('fwgaekupwecsruxjebbd')) {
    console.warn('[SUPABASE] Wrong project URL detected (ends with "d"). Fix your env.');
  }
  console.log('[SUPABASE] Resolved URL:', baseUrl);
  if (baseUrl?.includes('fwgaekupwecsruxjebbd')) {
    throw new Error("Wrong Supabase project ref (ends with 'd'). Fix VITE_SUPABASE_URL.");
  }
}

export const supabase = createClient(
  baseUrl!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!,
  options
);

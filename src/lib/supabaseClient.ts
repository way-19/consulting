import { createClient } from '@supabase/supabase-js';

const baseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/+$/, '');
const functionsUrl =
  import.meta.env.VITE_SUPABASE_FUNCTIONS_URL?.replace(/\/+$/, '') ||
  (baseUrl ? `${baseUrl}/functions/v1` : undefined);

if (import.meta.env.DEV) {
  console.log('Resolved Supabase URL:', baseUrl);
}

const options: any = {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
};

if (functionsUrl) {
  options.functions = { url: functionsUrl };
}

export const supabase = createClient(
  baseUrl!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!,
  options
);

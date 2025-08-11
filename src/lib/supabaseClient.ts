import { createClient } from '@supabase/supabase-js';

const options: any = {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
};

if (import.meta.env.VITE_SUPABASE_FUNCTIONS_URL) {
  options.functions = { url: import.meta.env.VITE_SUPABASE_FUNCTIONS_URL };
}

if (import.meta.env.DEV) {
  console.log('Resolved Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
}

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!,
  options
);

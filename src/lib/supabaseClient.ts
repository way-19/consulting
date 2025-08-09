import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
const fUrl = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL ?? url;

console.info('[VITE_SUPABASE_URL]', import.meta.env.VITE_SUPABASE_URL);
console.info(
  '[VITE_SUPABASE_FUNCTIONS_URL]',
  import.meta.env.VITE_SUPABASE_FUNCTIONS_URL ?? '(same)'
);
console.info('[VITE_SUPABASE_KEY?]', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

export const supabase = createClient(url!, key!, { functions: { url: fUrl } });

if (typeof window !== 'undefined') {
  (window as any).supabase = supabase;
}

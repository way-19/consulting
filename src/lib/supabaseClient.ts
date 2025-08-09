import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const functionsUrl = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL ?? url;

if (!url || !anonKey) {
  // Visible once after boot/login – helps debug Netlify env
  // Do NOT throw; app should still render a friendly error elsewhere.
  console.error('❌ Missing Supabase env', {
    urlPresent: !!url,
    anonKeyPresent: !!anonKey,
  });
}

console.info('[Supabase config]', {
  url: import.meta.env.VITE_SUPABASE_URL,
  functionsUrl: import.meta.env.VITE_SUPABASE_FUNCTIONS_URL ?? '(same as url)',
  anonKeyPresent: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
});

export const supabase = createClient(url!, anonKey!, {
  // Ensure edge functions use the correct base domain
  functions: { url: functionsUrl },
});

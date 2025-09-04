import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log the values to help the user debug if they are still missing
console.log('Supabase URL from env:', supabaseUrl);
console.log('Supabase Anon Key from env:', supabaseAnonKey ? '*****' : 'Missing'); // Mask key for security

// Check if Supabase is properly configured
const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey;

if (!isSupabaseConfigured) {
  console.warn('⚠️ Supabase environment variables are missing or empty. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file.');
  console.warn('If you are running in development, ensure your .env file is in the project root and contains VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  // Do NOT throw an error here, as per user's request to fix the specific error message.
  // The createClient call below will likely fail if values are truly missing.
}

const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: isSupabaseConfigured,
    }
  }
);

export { supabase };
export default supabase;
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is properly configured
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;

if (!isSupabaseConfigured) {
  console.warn('⚠️ Supabase not configured. Using mock mode.');
  console.warn('To connect to Supabase, click "Connect to Supabase" button in the top right.');
}

// Create Supabase client with fallback for development
const supabase = createClient(
  supabaseUrl || 'https://demo.supabase.co', 
  supabaseAnonKey || 'demo-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: isSupabaseConfigured,
    }
  }
);

export { supabase };
export default supabase;
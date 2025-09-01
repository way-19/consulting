import { createClient } from '@supabase/supabase-js';

// Completely lazy initialization - no env access during module load
let supabaseClient: ReturnType<typeof createClient> | null = null;

const getSupabaseClient = () => {
  if (!supabaseClient) {
    // Only access env vars when actually needed
    const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
    const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'placeholder-key';
    
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseClient;
};

// Proxy to defer all access until runtime
export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(target, prop) {
    const client = getSupabaseClient();
    return client[prop as keyof typeof client];
  }
});
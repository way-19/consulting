import { createClient } from '@supabase/supabase-js';

// Mock Supabase client for development when credentials are not available
const createMockSupabaseClient = () => {
  console.warn('🚧 Using mock Supabase client - authentication and database features are disabled');
  
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Mock client - authentication disabled' } }),
      signUp: () => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Mock client - authentication disabled' } }),
      signOut: () => Promise.resolve({ error: null }),
      resetPasswordForEmail: () => Promise.resolve({ error: { message: 'Mock client - authentication disabled' } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: { message: 'Mock client - database disabled' } }),
      update: () => ({ data: null, error: { message: 'Mock client - database disabled' } }),
      delete: () => ({ data: null, error: { message: 'Mock client - database disabled' } }),
      maybeSingle: () => Promise.resolve({ data: null, error: null }),
      eq: function() { return this; },
    }),
  };
};

// Get environment variables
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || '';

// Check if we have valid credentials
const hasValidCredentials = 
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-ref.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key-here';

let supabase: any;

if (hasValidCredentials) {
  try {
    // Validate URL format
    new URL(supabaseUrl);
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('✅ Supabase client initialized successfully');
  } catch (error) {
    console.warn('⚠️ Invalid Supabase URL format, using mock client');
    supabase = createMockSupabaseClient();
  }
} else {
  supabase = createMockSupabaseClient();
}

export { supabase };
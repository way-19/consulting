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
    from: () => {
      const mockQueryBuilder = {
        select: function() { return this; },
        insert: function() { return { data: null, error: { message: 'Mock client - database disabled' } }; },
        update: function() { return { data: null, error: { message: 'Mock client - database disabled' } }; },
        delete: function() { return { data: null, error: { message: 'Mock client - database disabled' } }; },
        maybeSingle: () => Promise.resolve({ data: null, error: null }),
        eq: function() { return this; },
        order: function() { return this; },
      };
      return mockQueryBuilder;
    },
  };
};

// Get environment variables
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || '';

// Debug: Log environment variables to identify the issue
console.log('🔍 DEBUG: Environment variables check:');
console.log('  - VITE_SUPABASE_URL:', supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'NOT FOUND');
console.log('  - VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'NOT FOUND');
console.log('  - import.meta.env object:', import.meta.env);

// Check if we have valid credentials
const hasValidCredentials = 
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  supabaseAnonKey.length > 10;

console.log('🔍 DEBUG: Credentials validation:');
console.log('  - hasValidCredentials:', hasValidCredentials);
console.log('  - URL starts with https:', supabaseUrl.startsWith('https://'));
console.log('  - Key length > 10:', supabaseAnonKey.length > 10);

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
  console.warn('⚠️ Supabase credentials not configured properly. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
  supabase = createMockSupabaseClient();
}

export { supabase };
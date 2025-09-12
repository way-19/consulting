// packages/shared/src/lib/supabase.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// WebContainer ortamında mock Supabase client kullan
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://mock.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-anon-key';
const isDev = !!import.meta.env.DEV;
const isWebContainer = window.location.hostname.includes('webcontainer-api.io') || window.location.hostname.includes('local-credentialless');

console.log('Supabase Config:', {
  url: SUPABASE_URL,
  key: SUPABASE_ANON_KEY ? 'SET' : 'MISSING',
  isDev,
  isWebContainer
});

// WebContainer için mock fetch
const mockFetch = async (url: string, options?: RequestInit): Promise<Response> => {
  console.log('Mock Supabase call:', url, options?.method || 'GET');
  
  // Mock successful responses
  if (url.includes('/auth/v1/token')) {
    return new Response(JSON.stringify({
      access_token: 'mock-token',
      user: {
        id: 'mock-user-id',
        email: 'client@consulting19.com',
        user_metadata: { full_name: 'Test Client' }
      }
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
  
  // Mock other responses
  return new Response(JSON.stringify({ data: [], error: null }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

function makeClient(): SupabaseClient {
  if (isWebContainer) {
    console.log('Creating mock Supabase client for WebContainer');
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { fetch: mockFetch as any },
      auth: { persistSession: false, autoRefreshToken: false },
      realtime: { params: { eventsPerSecond: 1 } },
    });
  }

  if (SUPABASE_URL && SUPABASE_ANON_KEY && !isWebContainer) {
    console.log('Creating real Supabase client');
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true },
      realtime: { params: { eventsPerSecond: 10 } },
    });
  }

  // Fallback mock client
  console.log('Creating fallback mock Supabase client');
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { fetch: mockFetch as any },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const supabase = makeClient();
export default supabase;

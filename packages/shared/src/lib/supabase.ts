// packages/shared/src/lib/supabase.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// URL validation function
const isValidHttpUrl = (string: string): boolean => {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

// WebContainer ortamında mock Supabase client kullan
const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const SUPABASE_URL = (envUrl && isValidHttpUrl(envUrl)) ? envUrl : 'https://mock.supabase.co';
const SUPABASE_ANON_KEY = (envKey && envKey.length > 10) ? envKey : 'mock-anon-key';
const isDev = !!import.meta.env.DEV;
const isWebContainer = window.location.hostname.includes('webcontainer-api.io') || window.location.hostname.includes('local-credentialless');

console.log('Supabase Config:', {
  url: SUPABASE_URL,
  key: SUPABASE_ANON_KEY !== 'mock-anon-key' ? 'SET' : 'MOCK',
  envUrl,
  isValidUrl: envUrl ? isValidHttpUrl(envUrl) : false,
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
  if (isWebContainer || SUPABASE_URL === 'https://mock.supabase.co') {
    console.log('Creating mock Supabase client for WebContainer');
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { fetch: mockFetch as any },
      auth: { persistSession: false, autoRefreshToken: false },
      realtime: { params: { eventsPerSecond: 1 } },
    });
  }

  if (SUPABASE_URL !== 'https://mock.supabase.co' && SUPABASE_ANON_KEY !== 'mock-anon-key') {
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

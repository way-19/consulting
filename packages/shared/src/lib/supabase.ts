// packages/shared/src/lib/supabase.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Global mock session storage
let currentMockUser: any = null;
let currentMockSession: any = null;

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
  
  // Handle sign in
  if (url.includes('/auth/v1/token') && options?.method === 'POST') {
    try {
      const body = JSON.parse(options.body as string);
      const email = body.email;
      
      // Create mock user based on email
      const mockUser = {
        id: `mock-${email.replace('@', '-').replace('.', '-')}`,
        email: email,
        user_metadata: {
          full_name: email.includes('client') ? 'Test Client' : 
                    email.includes('consultant') ? 'Giorgi Meskhi' : 
                    email.includes('admin') ? 'Admin User' : 'Test User'
        },
        created_at: new Date().toISOString(),
        app_metadata: {},
        aud: 'authenticated',
        role: 'authenticated'
      };
      
      const mockSession = {
        access_token: `mock-token-${Date.now()}`,
        refresh_token: `mock-refresh-${Date.now()}`,
        expires_in: 3600,
        token_type: 'bearer',
        user: mockUser
      };
      
      // Store in global variables
      currentMockUser = mockUser;
      currentMockSession = mockSession;
      
      console.log('Mock login successful for:', email);
      
      return new Response(JSON.stringify(mockSession), { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      });
    } catch (e) {
      console.error('Mock login error:', e);
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  // Handle get session
  if (url.includes('/auth/v1/user') && options?.method === 'GET') {
    if (currentMockUser && currentMockSession) {
      return new Response(JSON.stringify({ user: currentMockUser }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ user: null }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  // Handle logout
  if (url.includes('/auth/v1/logout') && options?.method === 'POST') {
    currentMockUser = null;
    currentMockSession = null;
    console.log('Mock logout successful');
    return new Response(JSON.stringify({}), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Default mock response
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

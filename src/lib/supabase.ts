import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if we have valid Supabase credentials
const hasValidCredentials = supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-ref.supabase.co' && 
  supabaseAnonKey !== 'your-anon-key-here' &&
  supabaseUrl.startsWith('https://') &&
  supabaseUrl.includes('.supabase.co');

// Create either real or mock Supabase client
export const supabase = hasValidCredentials 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockSupabaseClient();

// Mock Supabase client for development/demo purposes
function createMockSupabaseClient() {
  console.warn('🚧 Using mock Supabase client - authentication and database features will not work');
  
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Mock client - authentication disabled' } }),
      signUp: () => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Mock client - authentication disabled' } }),
      signOut: () => Promise.resolve({ error: null }),
      resetPasswordForEmail: () => Promise.resolve({ error: { message: 'Mock client - password reset disabled' } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: { message: 'Mock client - database operations disabled' } }),
      update: () => ({ data: null, error: { message: 'Mock client - database operations disabled' } }),
      delete: () => ({ data: null, error: { message: 'Mock client - database operations disabled' } }),
      eq: function() { return this; },
      maybeSingle: function() { return this; },
    }),
  };
}

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: 'client' | 'consultant' | 'admin';
          country: string | null;
          language: string;
          phone: string | null;
          company: string | null;
          bio: string | null;
          profile_image_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          role?: 'client' | 'consultant' | 'admin';
          country?: string | null;
          language?: string;
          phone?: string | null;
          company?: string | null;
          bio?: string | null;
          profile_image_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          role?: 'client' | 'consultant' | 'admin';
          country?: string | null;
          language?: string;
          phone?: string | null;
          company?: string | null;
          bio?: string | null;
          profile_image_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      countries: {
        Row: {
          id: string;
          name: string;
          code: string;
          flag_emoji: string;
          description: string;
          tax_rate: number | null;
          business_advantages: string[];
          consultant_id: string | null;
          featured: boolean;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          flag_emoji: string;
          description: string;
          tax_rate?: number | null;
          business_advantages?: string[];
          consultant_id?: string | null;
          featured?: boolean;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          code?: string;
          flag_emoji?: string;
          description?: string;
          tax_rate?: number | null;
          business_advantages?: string[];
          consultant_id?: string | null;
          featured?: boolean;
          is_active?: boolean;
          created_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          client_id: string;
          consultant_id: string;
          country_id: string;
          title: string;
          description: string | null;
          status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
          progress: number;
          total_amount: number | null;
          platform_commission: number | null;
          consultant_earnings: number | null;
          due_date: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          consultant_id: string;
          country_id: string;
          title: string;
          description?: string | null;
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
          progress?: number;
          total_amount?: number | null;
          platform_commission?: number | null;
          consultant_earnings?: number | null;
          due_date?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          consultant_id?: string;
          country_id?: string;
          title?: string;
          description?: string | null;
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
          progress?: number;
          total_amount?: number | null;
          platform_commission?: number | null;
          consultant_earnings?: number | null;
          due_date?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          consultant_id: string;
          country_id: string | null;
          title: string;
          description: string;
          price: number | null;
          is_recurring: boolean;
          billing_period: string | null;
          is_public: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          consultant_id: string;
          country_id?: string | null;
          title: string;
          description: string;
          price?: number | null;
          is_recurring?: boolean;
          billing_period?: string | null;
          is_public?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          consultant_id?: string;
          country_id?: string | null;
          title?: string;
          description?: string;
          price?: number | null;
          is_recurring?: boolean;
          billing_period?: string | null;
          is_public?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          project_id: string | null;
          service_id: string | null;
          client_id: string;
          consultant_id: string;
          amount: number;
          platform_commission: number;
          consultant_earnings: number;
          status: 'pending' | 'completed' | 'failed' | 'refunded';
          stripe_payment_intent_id: string | null;
          stripe_session_id: string | null;
          processed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id?: string | null;
          service_id?: string | null;
          client_id: string;
          consultant_id: string;
          amount: number;
          platform_commission: number;
          consultant_earnings: number;
          status?: 'pending' | 'completed' | 'failed' | 'refunded';
          stripe_payment_intent_id?: string | null;
          stripe_session_id?: string | null;
          processed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string | null;
          service_id?: string | null;
          client_id?: string;
          consultant_id?: string;
          amount?: number;
          platform_commission?: number;
          consultant_earnings?: number;
          status?: 'pending' | 'completed' | 'failed' | 'refunded';
          stripe_payment_intent_id?: string | null;
          stripe_session_id?: string | null;
          processed_at?: string | null;
          created_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          project_id: string | null;
          uploader_id: string;
          file_name: string;
          file_path: string;
          file_size: number | null;
          mime_type: string | null;
          document_type: 'identity' | 'business' | 'financial' | 'legal' | 'other';
          description: string | null;
          is_confidential: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id?: string | null;
          uploader_id: string;
          file_name: string;
          file_path: string;
          file_size?: number | null;
          mime_type?: string | null;
          document_type?: 'identity' | 'business' | 'financial' | 'legal' | 'other';
          description?: string | null;
          is_confidential?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string | null;
          uploader_id?: string;
          file_name?: string;
          file_path?: string;
          file_size?: number | null;
          mime_type?: string | null;
          document_type?: 'identity' | 'business' | 'financial' | 'legal' | 'other';
          description?: string | null;
          is_confidential?: boolean;
          created_at?: string;
        };
      };
    };
  };
};
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const db = {
  // Fetch all countries with their details
  getCountries: async () => {
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .eq('status', true)
      .order('name', { ascending: true });
    if (error) throw error;
    return data;
  },

  // Get country by slug
  getCountryBySlug: async (slug) => {
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  }
};

export default supabase
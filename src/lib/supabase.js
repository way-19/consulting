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

  // Fetch a single country by slug with its consultant, services, and FAQs
  getCountryBySlug: async (slug) => {
    const { data: countryData, error: countryError } = await supabase
      .from('countries')
      .select(`
        *,
        consultant:users!users_primary_country_id_fkey(
          id, first_name, last_name, email, performance_rating, total_clients_served
        )
      `)
      .eq('slug', slug)
      .single();

    if (countryError) throw countryError;

    const { data: servicesData, error: servicesError } = await supabase
      .from('country_services')
      .select('*')
      .eq('country_id', countryData.id)
      .order('title', { ascending: true });
    if (servicesError) throw servicesError;

    const { data: faqsData, error: faqsError } = await supabase
      .from('country_faqs')
      .select('*')
      .eq('country_id', countryData.id)
      .order('order_index', { ascending: true });
    if (faqsError) throw faqsError;

    return { ...countryData, services: servicesData, faqs: faqsData };
  }
};

export default supabase
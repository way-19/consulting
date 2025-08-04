import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase environment variables for service role');
}

// Service Role client - bypasses RLS, use carefully!
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Admin/Server-side data fetching functions
export const adminDb = {
  // Get consultant's clients using service role (bypasses RLS)
  getConsultantClients: async (consultantId: string, countryId: number = 1) => {
    console.log('🔍 [SERVICE ROLE] Loading clients for consultant:', consultantId);
    
    const { data, error } = await supabaseAdmin.rpc('get_consultant_clients', {
      p_consultant_id: consultantId,
      p_country_id: countryId,
      p_search: null,
      p_limit: 50,
      p_offset: 0
    });

    if (error) {
      console.error('❌ [SERVICE ROLE] Error loading clients:', error);
      throw error;
    }

    console.log('✅ [SERVICE ROLE] Clients loaded:', data?.length || 0);
    return data || [];
  },

  // Get consultant profile with service role
  getConsultantProfile: async (consultantId: string) => {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select(`
        *,
        countries!users_country_id_fkey(id, name, flag_emoji, slug),
        consultant_profiles!consultant_profiles_user_id_fkey(title, status)
      `)
      .eq('id', consultantId)
      .eq('role', 'consultant')
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  // Get all consultants (admin function)
  getAllConsultants: async () => {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select(`
        *,
        countries!users_country_id_fkey(name, flag_emoji),
        consultant_profiles!consultant_profiles_user_id_fkey(title, status)
      `)
      .eq('role', 'consultant')
      .eq('status', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Create consultant-client relationship (admin function)
  assignClientToConsultant: async (consultantId: string, clientId: string) => {
    const { data, error } = await supabaseAdmin
      .from('consultant_clients')
      .insert({
        consultant_id: consultantId,
        client_user_id: clientId,
        assigned_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Verify system integrity
  verifyGeorgiaSystem: async () => {
    console.log('🔍 [SERVICE ROLE] Verifying Georgia system...');
    
    // Check Georgia country exists
    const { data: georgia } = await supabaseAdmin
      .from('countries')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    // Check Nino exists
    const { data: nino } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', 'georgia_consultant@consulting19.com')
      .maybeSingle();

    // Check client count
    const { data: clients } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('role', 'client')
      .eq('country_id', 1);

    // Check consultant-client relationships
    const { data: relationships } = await supabaseAdmin
      .from('consultant_clients')
      .select('*')
      .eq('consultant_id', nino?.id);

    return {
      georgia: !!georgia,
      nino: !!nino,
      ninoId: nino?.id,
      clientCount: clients?.length || 0,
      relationshipCount: relationships?.length || 0,
      systemHealthy: !!(georgia && nino && clients?.length >= 4 && relationships?.length >= 4)
    };
  }
};

export default supabaseAdmin;
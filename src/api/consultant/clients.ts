import { supabaseAdmin } from '../../lib/supabaseAdmin';

interface ClientsRequest {
  consultantId?: string;
  consultantEmail?: string;
  countryId: number;
  search?: string;
  limit?: number;
  offset?: number;
}

interface ClientsResponse {
  data?: any[];
  count?: number;
  error?: string;
}

export async function getConsultantClients(request: ClientsRequest): Promise<ClientsResponse> {
  try {
    const { consultantId, consultantEmail, countryId, search = null, limit = 50, offset = 0 } = request;
    
    if (!countryId) {
      return { error: 'countryId required' };
    }

    let cId = consultantId;
    
    // If no consultantId provided, get it from email
    if (!cId && consultantEmail) {
      console.log('🔍 [SSR] Looking up consultant by email:', consultantEmail);
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', consultantEmail)
        .eq('role', 'consultant')
        .single();
        
      if (error || !data) {
        console.error('❌ [SSR] Consultant not found:', error);
        return { error: 'consultant not found' };
      }
      cId = data.id;
      console.log('✅ [SSR] Found consultant ID:', cId);
    }
    
    if (!cId) {
      return { error: 'consultantId or consultantEmail required' };
    }

    console.log('🔍 [SSR] Calling RPC with params:', {
      p_consultant_id: cId,
      p_country_id: countryId,
      p_search: search,
      p_limit: limit,
      p_offset: offset
    });

    // Call the RPC function
    const { data, error } = await supabaseAdmin.rpc('get_consultant_clients', {
      p_consultant_id: cId,
      p_country_id: countryId,
      p_search: search,
      p_limit: limit,
      p_offset: offset
    });

    if (error) {
      console.error('❌ [SSR] RPC error:', error);
      return { error: error.message };
    }

    console.log('✅ [SSR] RPC success, clients found:', data?.length || 0);
    return { data: data || [], count: data?.length || 0 };
    
  } catch (e: any) {
    console.error('❌ [SSR] Unexpected error:', e);
    return { error: e.message || 'unexpected error' };
  }
}

// Browser-compatible fetch wrapper
export async function fetchConsultantClients(request: ClientsRequest): Promise<ClientsResponse> {
  try {
    // In WebContainer, we'll call the function directly since we can't create API routes
    return await getConsultantClients(request);
  } catch (e: any) {
    console.error('❌ [SSR] Fetch error:', e);
    return { error: e.message || 'fetch error' };
  }
}
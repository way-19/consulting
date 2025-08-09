// Centralized Client Data Management System
import { supabase } from './supabaseClient';

export interface ClientData {
  client_id: string;
  full_name: string;
  email: string;
  company_name?: string;
  business_type?: string;
  language: string;
  country_name: string;
  client_since: string;
  assigned_at: string;
  consultant_id: string;
  applications_count: number;
  total_revenue: number;
}

export interface ConsultantClientRelationship {
  consultant_id: string;
  client_id: string;
  country_id: number;
  assigned_at: string;
  status: 'active' | 'inactive';
}

export class ClientDataManager {
  // Centralized client fetching for all components
  static async fetchConsultantClients(params: {
    consultantId?: string;
    consultantEmail?: string;
    countryId: number;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<ClientData[]> {
    try {
      console.log('🔍 [CDM] Fetching consultant clients:', params);

      const { data, error } = await supabase.functions.invoke('consultant-clients', {
        body: params,
      });

      if (!error) {
        console.log('✅ [CDM] API route success:', (data as any)?.data?.length || 0, 'clients');
        return (data as any)?.data || [];
      }

      console.log('⚠️ [CDM] API route failed, falling back to direct query');

      // Fallback to direct Supabase query
      return await this.fetchClientsDirectly(params);
      
    } catch (error) {
      console.error('❌ [CDM] Error fetching clients:', error);
      
      // Final fallback to direct query
      try {
        return await this.fetchClientsDirectly(params);
      } catch (fallbackError) {
        console.error('❌ [CDM] Fallback also failed:', fallbackError);
        return [];
      }
    }
  }

  // Direct Supabase query fallback
  private static async fetchClientsDirectly(params: {
    consultantId?: string;
    consultantEmail?: string;
    countryId: number;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<ClientData[]> {
    console.log('🔍 [CDM] Direct Supabase query fallback');

    let consultantId = params.consultantId;

    // Resolve consultant ID if needed
    if (!consultantId && params.consultantEmail) {
      const { data: consultant } = await supabase
        .from('users')
        .select('id')
        .eq('email', params.consultantEmail)
        .eq('role', 'consultant')
        .maybeSingle();
      
      consultantId = consultant?.id;
    }

    if (!consultantId) {
      throw new Error('Consultant not found');
    }

    // Query applications to get consultant's clients
    let query = supabase
      .from('applications')
      .select(`
        client:users!applications_client_id_fkey(
          id,
          first_name,
          last_name,
          email,
          company_name,
          business_type,
          language,
          created_at,
          countries!users_country_id_fkey(name, flag_emoji)
        ),
        created_at,
        total_amount,
        status
      `)
      .eq('consultant_id', consultantId)
      .eq('service_country_id', params.countryId)
      .not('client_id', 'is', null);

    if (params.search) {
      // Note: This is a simplified search, in production you'd want full-text search
      query = query.or(`client.first_name.ilike.%${params.search}%,client.last_name.ilike.%${params.search}%,client.email.ilike.%${params.search}%`);
    }

    if (params.limit) {
      query = query.limit(params.limit);
    }

    if (params.offset) {
      query = query.range(params.offset, params.offset + (params.limit || 50) - 1);
    }

    const { data: applications, error } = await query;

    if (error) {
      throw error;
    }

    // Transform to ClientData format
    const clientMap = new Map<string, ClientData>();

    applications?.forEach((app: any) => {
      if (!app.client) return;

      const clientId = app.client.id;
      if (!clientMap.has(clientId)) {
        clientMap.set(clientId, {
          client_id: clientId,
          full_name: `${app.client.first_name} ${app.client.last_name}`,
          email: app.client.email,
          company_name: app.client.company_name,
          business_type: app.client.business_type,
          language: app.client.language || 'tr',
          country_name: app.client.countries?.name || 'Unknown',
          client_since: app.client.created_at,
          assigned_at: app.created_at,
          consultant_id: consultantId,
          applications_count: 0,
          total_revenue: 0
        });
      }

      const client = clientMap.get(clientId)!;
      client.applications_count += 1;
      client.total_revenue += parseFloat(app.total_amount || '0');
    });

    return Array.from(clientMap.values());
  }

  // Create consultant-client relationship
  static async assignClientToConsultant(
    consultantId: string,
    clientId: string,
    countryId: number
  ): Promise<boolean> {
    try {
      const { error } = await supabase.functions.invoke('consultant-assign', {
        body: { consultantId, clientId, countryId },
      });
      return !error;
    } catch (error) {
      console.error('assign error', error);
      return false;
    }
  }

  // Ensure test data exists
  static async ensureTestData(): Promise<boolean> {
    try {
      console.log('🔧 [CDM] Ensuring test data exists...');

      // Test data creation now needs to be done via API route
      const response = await fetch('/api/diagnostics/create-test-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        console.error('❌ [CDM] Test data creation failed');
        return false;
      }

      console.log('✅ [CDM] Test data creation successful');
      return true;
    } catch (error) {
      console.error('❌ [CDM] Error ensuring test data:', error);
      return false;
    }
  }
}

export default ClientDataManager;
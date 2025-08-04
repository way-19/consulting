// Centralized Client Data Management System
import { supabase } from './supabase';
import { supabaseAdmin } from './supabaseAdmin';

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

      // Try API route first (SSR with service role)
      const response = await fetch('/api/consultant/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ [CDM] API route success:', result.data?.length || 0, 'clients');
        return result.data || [];
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
      console.log('🔗 [CDM] Assigning client to consultant:', { consultantId, clientId, countryId });

      // Create application to establish relationship
      const { error } = await supabase
        .from('applications')
        .insert({
          client_id: clientId,
          consultant_id: consultantId,
          service_type: 'company_formation',
          service_country_id: countryId,
          total_amount: 2500.00,
          currency: 'USD',
          status: 'pending',
          source_type: 'platform',
          priority_level: 'normal'
        });

      if (error) {
        throw error;
      }

      console.log('✅ [CDM] Client assigned successfully');
      return true;
    } catch (error) {
      console.error('❌ [CDM] Error assigning client:', error);
      return false;
    }
  }

  // Ensure test data exists
  static async ensureTestData(): Promise<boolean> {
    try {
      console.log('🔧 [CDM] Ensuring test data exists...');

      // Check if Georgia consultant exists
      const { data: consultant } = await supabase
        .from('users')
        .select('id')
        .eq('email', 'georgia_consultant@consulting19.com')
        .eq('role', 'consultant')
        .maybeSingle();

      if (!consultant) {
        console.log('❌ [CDM] Georgia consultant not found, creating...');
        
        const consultantId = 'c3d4e5f6-a7b8-4012-8456-789012cdefab';
        await supabaseAdmin
          .from('users')
          .upsert({
            id: consultantId,
            email: 'georgia_consultant@consulting19.com',
            role: 'consultant',
            first_name: 'Nino',
            last_name: 'Kvaratskhelia',
            country_id: 1,
            primary_country_id: 1,
            language: 'tr',
            status: true
          });
      }

      // Check if test clients exist
      const testEmails = ['client@consulting19.com', 'ahmet@test.com', 'maria@test.com', 'david@test.com'];
      const { data: existingClients } = await supabase
        .from('users')
        .select('email')
        .eq('role', 'client')
        .in('email', testEmails);

      const existingEmails = existingClients?.map(c => c.email) || [];
      const missingEmails = testEmails.filter(email => !existingEmails.includes(email));

      if (missingEmails.length > 0) {
        console.log('🔧 [CDM] Creating missing test clients:', missingEmails);
        
        const testClients = [
          { email: 'client@consulting19.com', first_name: 'Business', last_name: 'Client', id: 'd4e5f6a7-b8c9-4123-8567-890123defabc' },
          { email: 'ahmet@test.com', first_name: 'Ahmet', last_name: 'Yılmaz', id: 'e5f6a7b8-c9d0-4234-8678-901234efabcd' },
          { email: 'maria@test.com', first_name: 'Maria', last_name: 'Garcia', id: 'f6a7b8c9-d0e1-4345-8789-012345fabcde' },
          { email: 'david@test.com', first_name: 'David', last_name: 'Smith', id: 'a7b8c9d0-e1f2-4456-8890-123456abcdef' }
        ];

        for (const client of testClients) {
          if (missingEmails.includes(client.email)) {
            await supabaseAdmin
              .from('users')
              .upsert({
                ...client,
                role: 'client',
                country_id: 1,
                primary_country_id: 1,
                language: 'tr',
                status: true
              });

            // Create application relationship
            await this.assignClientToConsultant(
              consultant?.id || 'c3d4e5f6-a7b8-4012-8456-789012cdefab',
              client.id,
              1
            );
          }
        }
      }

      console.log('✅ [CDM] Test data ensured');
      return true;
    } catch (error) {
      console.error('❌ [CDM] Error ensuring test data:', error);
      return false;
    }
  }
}

export default ClientDataManager;
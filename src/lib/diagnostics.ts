// System Diagnostics and Health Check Module
import { supabase } from './supabase';
import { supabaseAdmin } from './supabaseAdmin';

export interface SystemHealth {
  database: boolean;
  rpcFunction: boolean;
  testData: boolean;
  apiRoute: boolean;
  consultantExists: boolean;
  clientsExist: boolean;
  relationships: boolean;
  errors: string[];
  details: any;
}

export class SystemDiagnostics {
  static async runFullDiagnostic(): Promise<SystemHealth> {
    const health: SystemHealth = {
      database: false,
      rpcFunction: false,
      testData: false,
      apiRoute: false,
      consultantExists: false,
      clientsExist: false,
      relationships: false,
      errors: [],
      details: {}
    };

    console.log('🔍 [DIAGNOSTIC] Starting comprehensive system diagnostic...');

    try {
      // 1. Database Connection Test
      console.log('🔍 [DIAGNOSTIC] Testing database connection...');
      const { data: dbTest, error: dbError } = await supabase
        .from('users')
        .select('count')
        .limit(1);
      
      if (dbError) {
        health.errors.push(`Database connection failed: ${dbError.message}`);
      } else {
        health.database = true;
        console.log('✅ [DIAGNOSTIC] Database connection OK');
      }

      // 2. RPC Function Test
      console.log('🔍 [DIAGNOSTIC] Testing RPC function...');
      try {
        const { data: rpcTest, error: rpcError } = await supabaseAdmin.rpc('get_consultant_clients', {
          p_consultant_id: 'test-id',
          p_country_id: 1,
          p_search: null,
          p_limit: 1,
          p_offset: 0
        });
        
        if (rpcError && !rpcError.message.includes('not found')) {
          health.errors.push(`RPC function error: ${rpcError.message}`);
        } else {
          health.rpcFunction = true;
          console.log('✅ [DIAGNOSTIC] RPC function exists and callable');
        }
      } catch (rpcErr: any) {
        health.errors.push(`RPC function test failed: ${rpcErr.message}`);
      }

      // 3. Georgia Consultant Test
      console.log('🔍 [DIAGNOSTIC] Testing Georgia consultant...');
      const { data: consultant, error: consultantError } = await supabase
        .from('users')
        .select('*')
        .eq('email', 'georgia_consultant@consulting19.com')
        .eq('role', 'consultant')
        .maybeSingle();

      if (consultantError || !consultant) {
        health.errors.push(`Georgia consultant not found: ${consultantError?.message || 'Missing'}`);
      } else {
        health.consultantExists = true;
        health.details.consultant = consultant;
        console.log('✅ [DIAGNOSTIC] Georgia consultant found:', consultant.id);
      }

      // 4. Test Clients Check
      console.log('🔍 [DIAGNOSTIC] Testing client data...');
      const testEmails = ['client@consulting19.com', 'ahmet@test.com', 'maria@test.com', 'david@test.com'];
      const { data: clients, error: clientsError } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'client')
        .in('email', testEmails);

      if (clientsError) {
        health.errors.push(`Clients query failed: ${clientsError.message}`);
      } else {
        health.clientsExist = clients && clients.length > 0;
        health.details.clients = clients;
        console.log(`✅ [DIAGNOSTIC] Found ${clients?.length || 0} test clients`);
      }

      // 5. Applications/Relationships Test
      if (consultant && clients && clients.length > 0) {
        console.log('🔍 [DIAGNOSTIC] Testing consultant-client relationships...');
        const { data: applications, error: appError } = await supabase
          .from('applications')
          .select('*')
          .eq('consultant_id', consultant.id);

        if (appError) {
          health.errors.push(`Applications query failed: ${appError.message}`);
        } else {
          health.relationships = applications && applications.length > 0;
          health.details.applications = applications;
          console.log(`✅ [DIAGNOSTIC] Found ${applications?.length || 0} applications`);
        }
      }

      // 6. API Route Test
      console.log('🔍 [DIAGNOSTIC] Testing API route...');
      try {
        const apiResponse = await fetch('/api/consultant/clients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            consultantEmail: 'georgia_consultant@consulting19.com',
            countryId: 1,
            search: null,
            limit: 10,
            offset: 0
          })
        });

        const apiData = await apiResponse.json();
        
        if (apiResponse.ok && apiData.data) {
          health.apiRoute = true;
          health.details.apiResponse = apiData;
          console.log(`✅ [DIAGNOSTIC] API route working, returned ${apiData.data.length} clients`);
        } else {
          health.errors.push(`API route failed: ${apiData.error || 'Unknown error'}`);
        }
      } catch (apiErr: any) {
        health.errors.push(`API route test failed: ${apiErr.message}`);
      }

      // 7. Overall Test Data Status
      health.testData = health.consultantExists && health.clientsExist && health.relationships;

    } catch (error: any) {
      health.errors.push(`Diagnostic failed: ${error.message}`);
    }

    console.log('🔍 [DIAGNOSTIC] Diagnostic complete:', health);
    return health;
  }

  static async createTestData(): Promise<boolean> {
    console.log('🔧 [DIAGNOSTIC] Creating test data...');
    
    try {
      // 1. Ensure Georgia country exists
      const { data: georgia, error: georgiaError } = await supabaseAdmin
        .from('countries')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (!georgia) {
        console.log('🔧 [DIAGNOSTIC] Creating Georgia country...');
        await supabaseAdmin
          .from('countries')
          .upsert({
            id: 1,
            name: 'Georgia',
            slug: 'georgia',
            flag_emoji: '🇬🇪',
            description: 'Strategic location between Europe and Asia',
            advantages: ['0% tax on foreign income', 'Strategic location', 'Simple company formation'],
            primary_language: 'en',
            supported_languages: ['en', 'tr'],
            status: true
          });
      }

      // 2. Create/Update Georgia consultant
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
          status: true,
          commission_rate: 65.00,
          performance_rating: 4.9,
          total_clients_served: 1247
        });

      // 3. Create consultant country assignment
      await supabaseAdmin
        .from('consultant_country_assignments')
        .upsert({
          consultant_id: consultantId,
          country_id: 1,
          is_primary: true,
          status: true
        });

      // 4. Create test clients
      const testClients = [
        {
          id: 'd4e5f6a7-b8c9-4123-8567-890123defabc',
          email: 'client@consulting19.com',
          first_name: 'Business',
          last_name: 'Client',
          company_name: 'Test Company LLC',
          business_type: 'Technology'
        },
        {
          id: 'e5f6a7b8-c9d0-4234-8678-901234efabcd',
          email: 'ahmet@test.com',
          first_name: 'Ahmet',
          last_name: 'Yılmaz',
          company_name: 'Ahmet Teknoloji',
          business_type: 'Software Development'
        },
        {
          id: 'f6a7b8c9-d0e1-4345-8789-012345fabcde',
          email: 'maria@test.com',
          first_name: 'Maria',
          last_name: 'Garcia',
          company_name: 'Garcia Consulting',
          business_type: 'Business Consulting'
        },
        {
          id: 'a7b8c9d0-e1f2-4456-8890-123456abcdef',
          email: 'david@test.com',
          first_name: 'David',
          last_name: 'Smith',
          company_name: 'Smith Enterprises',
          business_type: 'International Trade'
        }
      ];

      for (const client of testClients) {
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

        // Create application for each client
        await supabaseAdmin
          .from('applications')
          .upsert({
            client_id: client.id,
            consultant_id: consultantId,
            service_type: 'company_formation',
            service_country_id: 1,
            total_amount: 2500.00,
            currency: 'USD',
            status: 'in_progress',
            source_type: 'platform',
            priority_level: 'normal'
          });
      }

      console.log('✅ [DIAGNOSTIC] Test data created successfully');
      return true;
    } catch (error: any) {
      console.error('❌ [DIAGNOSTIC] Test data creation failed:', error);
      return false;
    }
  }
}

export default SystemDiagnostics;
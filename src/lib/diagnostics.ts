// System Diagnostics and Health Check Module
import { supabase } from './supabase';

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
        // Test RPC function via API route instead of direct call
        const rpcResponse = await fetch('/api/consultant/clients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            consultantId: 'test-id',
            countryId: 1,
            search: null,
            limit: 1,
            offset: 0
          })
        });
        
        const rpcData = await rpcResponse.json();
        
        if (!rpcResponse.ok && !rpcData.error?.includes('not found')) {
          health.errors.push(`RPC function error: ${rpcData.error}`);
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
      // Test data creation now needs to be done via API route
      const response = await fetch('/api/diagnostics/create-test-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create test data');
      }

      const result = await response.json();
      console.log('✅ [DIAGNOSTIC] Test data creation result:', result);
      return true;
    } catch (error: any) {
      console.error('❌ [DIAGNOSTIC] Test data creation failed:', error);
      return false;
    }
  }
}

export default SystemDiagnostics;
// Deep System Diagnostics for CONSULTING19 Platform
import { supabase } from './supabase';

export interface DiagnosticResult {
  category: string;
  test: string;
  status: 'PASS' | 'FAIL' | 'WARNING' | 'INFO';
  message: string;
  details?: any;
  fix?: string;
}

export interface SystemHealth {
  overall: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
  score: number;
  results: DiagnosticResult[];
  summary: {
    database: boolean;
    apiRoutes: boolean;
    testData: boolean;
    relationships: boolean;
    rpcFunctions: boolean;
  };
}

export class SystemDiagnostics {
  private static results: DiagnosticResult[] = [];

  private static addResult(category: string, test: string, status: 'PASS' | 'FAIL' | 'WARNING' | 'INFO', message: string, details?: any, fix?: string) {
    this.results.push({ category, test, status, message, details, fix });
    console.log(`🔍 [${status}] ${category} - ${test}: ${message}`);
  }

  static async runComprehensiveDiagnostic(): Promise<SystemHealth> {
    this.results = [];
    console.log('🚀 [DIAGNOSTIC] Starting comprehensive system analysis...');

    // 1. Environment & Configuration Tests
    await this.testEnvironmentConfiguration();
    
    // 2. Database Connection & Schema Tests
    await this.testDatabaseConnection();
    
    // 3. API Routes Tests
    await this.testApiRoutes();
    
    // 4. Test Data Verification
    await this.testDataIntegrity();
    
    // 5. RPC Functions Tests
    await this.testRpcFunctions();
    
    // 6. Consultant-Client Relationships
    await this.testConsultantClientRelationships();
    
    // 7. Authentication & Authorization
    await this.testAuthenticationFlow();
    
    // 8. Frontend-Backend Integration
    await this.testFrontendIntegration();

    return this.generateHealthReport();
  }

  private static async testEnvironmentConfiguration() {
    this.addResult('Environment', 'Client Environment Variables', 'INFO', 'Checking client-side environment variables');
    
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl) {
      this.addResult('Environment', 'VITE_SUPABASE_URL', 'FAIL', 'Missing VITE_SUPABASE_URL', null, 'Add VITE_SUPABASE_URL to .env file');
    } else {
      this.addResult('Environment', 'VITE_SUPABASE_URL', 'PASS', `Found: ${supabaseUrl.substring(0, 30)}...`);
    }
    
    if (!supabaseAnonKey) {
      this.addResult('Environment', 'VITE_SUPABASE_ANON_KEY', 'FAIL', 'Missing VITE_SUPABASE_ANON_KEY', null, 'Add VITE_SUPABASE_ANON_KEY to .env file');
    } else {
      this.addResult('Environment', 'VITE_SUPABASE_ANON_KEY', 'PASS', `Found: ${supabaseAnonKey.substring(0, 20)}...`);
    }

    // Check if we're in credentialless environment
    const isCredentialless = typeof window !== 'undefined' && 
      window.location.hostname.includes('local-credentialless');
    
    this.addResult('Environment', 'Credentialless Detection', isCredentialless ? 'WARNING' : 'PASS', 
      isCredentialless ? 'Running in credentialless WebContainer' : 'Standard environment');
  }

  private static async testDatabaseConnection() {
    try {
      this.addResult('Database', 'Connection Test', 'INFO', 'Testing database connection...');
      
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1);
      
      if (error) {
        this.addResult('Database', 'Connection', 'FAIL', `Connection failed: ${error.message}`, error);
      } else {
        this.addResult('Database', 'Connection', 'PASS', 'Database connection successful');
      }
    } catch (error: any) {
      this.addResult('Database', 'Connection', 'FAIL', `Connection error: ${error.message}`, error);
    }
  }

  private static async testApiRoutes() {
    const routes = [
      { path: '/api/consultant/clients', method: 'POST', body: { consultantEmail: 'georgia_consultant@consulting19.com', countryId: 1 } },
      { path: '/api/accounting/client', method: 'POST', body: { clientId: 'test-client-id' } },
      { path: '/api/messages/list', method: 'POST', body: { consultantId: 'test-consultant', clientId: 'test-client' } },
      { path: '/api/health', method: 'GET', body: null }
    ];

    for (const route of routes) {
      try {
        this.addResult('API Routes', `${route.method} ${route.path}`, 'INFO', 'Testing API route...');
        
        const response = await fetch(route.path, {
          method: route.method,
          headers: route.body ? { 'Content-Type': 'application/json' } : {},
          body: route.body ? JSON.stringify(route.body) : undefined
        });

        const data = await response.json().catch(() => ({}));
        
        if (response.ok) {
          this.addResult('API Routes', `${route.method} ${route.path}`, 'PASS', 
            `Route working (${response.status})`, { status: response.status, data });
        } else {
          this.addResult('API Routes', `${route.method} ${route.path}`, 'FAIL', 
            `Route failed (${response.status}): ${data.error || 'Unknown error'}`, 
            { status: response.status, data },
            'Check API route implementation and server-side imports');
        }
      } catch (error: any) {
        this.addResult('API Routes', `${route.method} ${route.path}`, 'FAIL', 
          `Route error: ${error.message}`, error,
          'Check if API route exists and is properly configured');
      }
    }
  }

  private static async testDataIntegrity() {
    try {
      // Test Georgia country exists
      this.addResult('Test Data', 'Georgia Country', 'INFO', 'Checking Georgia country data...');
      const { data: georgia, error: georgiaError } = await supabase
        .from('countries')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (georgiaError || !georgia) {
        this.addResult('Test Data', 'Georgia Country', 'FAIL', 
          'Georgia country not found in database', georgiaError,
          'Run database migration to create countries table with Georgia data');
      } else {
        this.addResult('Test Data', 'Georgia Country', 'PASS', 
          `Found: ${georgia.name} (${georgia.flag_emoji})`, georgia);
      }

      // Test Georgia consultant exists
      this.addResult('Test Data', 'Georgia Consultant', 'INFO', 'Checking Georgia consultant...');
      const { data: consultant, error: consultantError } = await supabase
        .from('users')
        .select('*')
        .eq('email', 'georgia_consultant@consulting19.com')
        .eq('role', 'consultant')
        .maybeSingle();

      if (consultantError || !consultant) {
        this.addResult('Test Data', 'Georgia Consultant', 'FAIL', 
          'Georgia consultant not found', consultantError,
          'Create Georgia consultant user in database');
      } else {
        this.addResult('Test Data', 'Georgia Consultant', 'PASS', 
          `Found: ${consultant.first_name} ${consultant.last_name}`, consultant);
      }

      // Test client data
      this.addResult('Test Data', 'Test Clients', 'INFO', 'Checking test client data...');
      const testEmails = ['client@consulting19.com', 'ahmet@test.com', 'maria@test.com', 'david@test.com'];
      const { data: clients, error: clientsError } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'client')
        .in('email', testEmails);

      if (clientsError) {
        this.addResult('Test Data', 'Test Clients', 'FAIL', 
          `Clients query failed: ${clientsError.message}`, clientsError);
      } else {
        this.addResult('Test Data', 'Test Clients', clients && clients.length >= 3 ? 'PASS' : 'WARNING', 
          `Found ${clients?.length || 0} test clients (expected 4)`, clients);
      }

      // Test applications (consultant-client relationships)
      if (consultant && clients && clients.length > 0) {
        this.addResult('Test Data', 'Applications', 'INFO', 'Checking consultant-client applications...');
        const { data: applications, error: appError } = await supabase
          .from('applications')
          .select('*')
          .eq('consultant_id', consultant.id);

        if (appError) {
          this.addResult('Test Data', 'Applications', 'FAIL', 
            `Applications query failed: ${appError.message}`, appError);
        } else {
          this.addResult('Test Data', 'Applications', applications && applications.length > 0 ? 'PASS' : 'WARNING', 
            `Found ${applications?.length || 0} applications for Georgia consultant`, applications);
        }
      }

    } catch (error: any) {
      this.addResult('Test Data', 'General', 'FAIL', `Data integrity test failed: ${error.message}`, error);
    }
  }

  private static async testRpcFunctions() {
    try {
      this.addResult('RPC Functions', 'get_consultant_clients', 'INFO', 'Testing RPC function via API...');
      
      // Test RPC function through API route
      const response = await fetch('/api/consultant/clients', {
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

      const data = await response.json();
      
      if (response.ok && data.data) {
        this.addResult('RPC Functions', 'get_consultant_clients', 'PASS', 
          `RPC function working, returned ${data.data.length} clients`, data);
      } else {
        this.addResult('RPC Functions', 'get_consultant_clients', 'FAIL', 
          `RPC function failed: ${data.error || 'Unknown error'}`, data,
          'Check if RPC function exists in database and API route implementation');
      }
    } catch (error: any) {
      this.addResult('RPC Functions', 'get_consultant_clients', 'FAIL', 
        `RPC test failed: ${error.message}`, error);
    }
  }

  private static async testConsultantClientRelationships() {
    try {
      this.addResult('Relationships', 'Consultant Assignments', 'INFO', 'Testing consultant country assignments...');
      
      const { data: assignments, error: assignError } = await supabase
        .from('consultant_country_assignments')
        .select(`
          *,
          consultant:users!consultant_country_assignments_consultant_id_fkey(first_name, last_name, email),
          country:countries!consultant_country_assignments_country_id_fkey(name, flag_emoji)
        `)
        .eq('status', true);

      if (assignError) {
        this.addResult('Relationships', 'Consultant Assignments', 'FAIL', 
          `Assignment query failed: ${assignError.message}`, assignError);
      } else {
        const georgiaAssignments = assignments?.filter(a => a.country?.name === 'Georgia') || [];
        this.addResult('Relationships', 'Consultant Assignments', georgiaAssignments.length > 0 ? 'PASS' : 'WARNING', 
          `Found ${assignments?.length || 0} total assignments, ${georgiaAssignments.length} for Georgia`, 
          { total: assignments?.length, georgia: georgiaAssignments });
      }

    } catch (error: any) {
      this.addResult('Relationships', 'General', 'FAIL', `Relationship test failed: ${error.message}`, error);
    }
  }

  private static async testAuthenticationFlow() {
    try {
      this.addResult('Authentication', 'Current User', 'INFO', 'Checking current user session...');
      
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        this.addResult('Authentication', 'Current User', 'PASS', 
          `Logged in as: ${user.role} (${user.email || user.name})`, user);
      } else {
        this.addResult('Authentication', 'Current User', 'WARNING', 
          'No user session found in localStorage');
      }

      // Test Supabase auth
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        this.addResult('Authentication', 'Supabase Auth', 'WARNING', 
          `Supabase auth error: ${error.message}`, error);
      } else if (user) {
        this.addResult('Authentication', 'Supabase Auth', 'PASS', 
          `Supabase user authenticated: ${user.email}`, user);
      } else {
        this.addResult('Authentication', 'Supabase Auth', 'INFO', 
          'No Supabase auth session (using localStorage for demo)');
      }

    } catch (error: any) {
      this.addResult('Authentication', 'General', 'FAIL', `Auth test failed: ${error.message}`, error);
    }
  }

  private static async testFrontendIntegration() {
    try {
      this.addResult('Frontend', 'Component State', 'INFO', 'Testing frontend component integration...');
      
      // Test if we're in the consultant dashboard
      const isConsultantDashboard = window.location.pathname.includes('consultant-dashboard');
      const isCountryClients = window.location.pathname.includes('country-clients');
      
      this.addResult('Frontend', 'Current Page', 'INFO', 
        `Current path: ${window.location.pathname}`, {
          isConsultantDashboard,
          isCountryClients,
          hostname: window.location.hostname
        });

      // Test React DevTools availability
      const hasReactDevTools = !!(window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
      this.addResult('Frontend', 'React DevTools', hasReactDevTools ? 'PASS' : 'INFO', 
        hasReactDevTools ? 'React DevTools detected' : 'React DevTools not installed');

      // Test Service Worker status
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        this.addResult('Frontend', 'Service Worker', registrations.length === 0 ? 'PASS' : 'WARNING', 
          `${registrations.length} service workers registered`, registrations);
      }

    } catch (error: any) {
      this.addResult('Frontend', 'General', 'FAIL', `Frontend test failed: ${error.message}`, error);
    }
  }

  private static generateHealthReport(): SystemHealth {
    const passCount = this.results.filter(r => r.status === 'PASS').length;
    const failCount = this.results.filter(r => r.status === 'FAIL').length;
    const warningCount = this.results.filter(r => r.status === 'WARNING').length;
    
    const totalTests = this.results.length;
    const score = totalTests > 0 ? Math.round((passCount / totalTests) * 100) : 0;
    
    let overall: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
    if (failCount === 0 && warningCount <= 2) overall = 'HEALTHY';
    else if (failCount <= 2) overall = 'DEGRADED';
    else overall = 'CRITICAL';

    const summary = {
      database: this.results.some(r => r.category === 'Database' && r.status === 'PASS'),
      apiRoutes: this.results.some(r => r.category === 'API Routes' && r.status === 'PASS'),
      testData: this.results.some(r => r.category === 'Test Data' && r.status === 'PASS'),
      relationships: this.results.some(r => r.category === 'Relationships' && r.status === 'PASS'),
      rpcFunctions: this.results.some(r => r.category === 'RPC Functions' && r.status === 'PASS')
    };

    console.log('📊 [DIAGNOSTIC] Analysis complete:', {
      overall,
      score,
      tests: totalTests,
      passed: passCount,
      failed: failCount,
      warnings: warningCount
    });

    return {
      overall,
      score,
      results: this.results,
      summary
    };
  }

  // Specific diagnostic for the current issue
  static async diagnoseConsultantClientIssue(): Promise<{
    rootCause: string;
    technicalDetails: any;
    recommendedFix: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
  }> {
    console.log('🔍 [DIAGNOSTIC] Analyzing consultant-client system issue...');

    const issues = [];
    let technicalDetails: any = {};

    try {
      // 1. Test API route directly
      console.log('🧪 Testing /api/consultant/clients directly...');
      const apiResponse = await fetch('/api/consultant/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consultantEmail: 'georgia_consultant@consulting19.com',
          countryId: 1
        })
      });

      const apiData = await apiResponse.json();
      technicalDetails.apiTest = {
        status: apiResponse.status,
        ok: apiResponse.ok,
        data: apiData,
        clientCount: apiData.data?.length || 0
      };

      if (!apiResponse.ok) {
        issues.push(`API route failing: ${apiData.error}`);
      } else if (!apiData.data || apiData.data.length === 0) {
        issues.push('API route returns empty data - RPC function or test data issue');
      }

      // 2. Test consultant existence
      console.log('🧪 Testing consultant existence...');
      const { data: consultant } = await supabase
        .from('users')
        .select('*')
        .eq('email', 'georgia_consultant@consulting19.com')
        .maybeSingle();

      technicalDetails.consultant = consultant;
      if (!consultant) {
        issues.push('Georgia consultant not found in database');
      }

      // 3. Test client data
      console.log('🧪 Testing client data...');
      const { data: clients } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'client')
        .in('email', ['ahmet@test.com', 'maria@test.com', 'david@test.com', 'client@consulting19.com']);

      technicalDetails.clients = {
        found: clients?.length || 0,
        expected: 4,
        data: clients
      };

      if (!clients || clients.length < 3) {
        issues.push(`Insufficient test clients: found ${clients?.length || 0}, expected 4`);
      }

      // 4. Test applications/relationships
      if (consultant && clients && clients.length > 0) {
        console.log('🧪 Testing applications...');
        const { data: applications } = await supabase
          .from('applications')
          .select('*')
          .eq('consultant_id', consultant.id);

        technicalDetails.applications = {
          found: applications?.length || 0,
          data: applications
        };

        if (!applications || applications.length === 0) {
          issues.push('No applications found linking consultant to clients');
        }
      }

      // 5. Test RLS policies
      console.log('🧪 Testing RLS policies...');
      try {
        const { data: rls } = await supabase
          .from('applications')
          .select('*')
          .limit(1);
        
        technicalDetails.rlsTest = {
          accessible: !!rls,
          count: rls?.length || 0
        };
      } catch (rlsError: any) {
        technicalDetails.rlsTest = {
          accessible: false,
          error: rlsError.message
        };
        issues.push(`RLS policy blocking access: ${rlsError.message}`);
      }

    } catch (error: any) {
      issues.push(`Diagnostic error: ${error.message}`);
      technicalDetails.diagnosticError = error.message;
    }

    // Determine root cause
    let rootCause = 'Unknown issue';
    let recommendedFix = 'Manual investigation required';
    let priority: 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM';

    if (issues.some(i => i.includes('API route failing'))) {
      rootCause = 'API Route Configuration Error';
      recommendedFix = 'Fix API route implementation and server-side Supabase admin client';
      priority = 'HIGH';
    } else if (issues.some(i => i.includes('consultant not found'))) {
      rootCause = 'Missing Test Data - Georgia Consultant';
      recommendedFix = 'Create Georgia consultant user and country assignment';
      priority = 'HIGH';
    } else if (issues.some(i => i.includes('test clients'))) {
      rootCause = 'Missing Test Data - Client Users';
      recommendedFix = 'Create test client users with proper country assignments';
      priority = 'HIGH';
    } else if (issues.some(i => i.includes('applications'))) {
      rootCause = 'Missing Consultant-Client Relationships';
      recommendedFix = 'Create applications linking consultant to clients';
      priority = 'HIGH';
    } else if (issues.some(i => i.includes('RLS policy'))) {
      rootCause = 'Row Level Security Policy Blocking Access';
      recommendedFix = 'Use service role API routes instead of client-side queries';
      priority = 'MEDIUM';
    } else if (technicalDetails.apiTest?.clientCount === 0) {
      rootCause = 'RPC Function Returns Empty Data';
      recommendedFix = 'Check RPC function implementation and test data relationships';
      priority = 'HIGH';
    }

    return {
      rootCause,
      technicalDetails,
      recommendedFix,
      priority
    };
  }
}

export default SystemDiagnostics;
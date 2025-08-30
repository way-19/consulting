import React, { useState, useEffect } from 'react';
import { useAuth } from '@consulting19/shared';
import { supabase } from '@consulting19/supabase';
import { Card, Button } from '@consulting19/ui';

const DebugPage = () => {
  const { user, userRole } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const runDebugTests = async () => {
    setLoading(true);
    const results: any = {};

    try {
      // 1. Check current user session
      const { data: session, error: sessionError } = await supabase.auth.getSession();
      results.session = {
        hasSession: !!session.session,
        userId: session.session?.user?.id,
        email: session.session?.user?.email,
        error: sessionError?.message
      };

      // 2. Check user profile
      if (session.session?.user?.id) {
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.session.user.id)
          .maybeSingle();
        
        results.userProfile = {
          profile,
          error: profileError?.message
        };
      }

      // 3. Test direct marketing_pages access
      const { data: pages, error: pagesError } = await supabase
        .from('marketing_pages')
        .select('*')
        .limit(1);
      
      results.marketingPagesAccess = {
        success: !pagesError,
        data: pages,
        error: pagesError?.message,
        errorCode: pagesError?.code
      };

      // 4. Test with RLS disabled query (admin only)
      const { data: rawQuery, error: rawError } = await supabase
        .rpc('get_marketing_pages_debug');
      
      results.rawQuery = {
        success: !rawError,
        data: rawQuery,
        error: rawError?.message
      };

    } catch (error) {
      results.generalError = error;
    }

    setDebugInfo(results);
    setLoading(false);
  };

  useEffect(() => {
    runDebugTests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Access Debug</h1>
          <p className="text-gray-600">Debugging admin access to marketing_pages table</p>
        </div>

        <div className="space-y-6">
          {/* Current User Info */}
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">Current User Info</h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-2">
                <p><strong>User ID:</strong> {user?.id || 'Not found'}</p>
                <p><strong>Email:</strong> {user?.email || 'Not found'}</p>
                <p><strong>Role (from context):</strong> {userRole || 'Not found'}</p>
                <p><strong>Full Name:</strong> {user?.user_metadata?.full_name || 'Not found'}</p>
              </div>
            </Card.Body>
          </Card>

          {/* Debug Results */}
          <Card>
            <Card.Header>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Debug Results</h2>
                <Button onClick={runDebugTests} loading={loading}>
                  {loading ? 'Running Tests...' : 'Run Debug Tests'}
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </Card.Body>
          </Card>

          {/* Quick Actions */}
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                <Button 
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Clear LocalStorage & Reload
                </Button>
                
                <Button 
                  onClick={() => {
                    console.log('Current localStorage:', localStorage);
                    console.log('Supabase session:', supabase.auth.getSession());
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Log Session Info to Console
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DebugPage;
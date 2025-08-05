import React, { useState, useEffect } from 'react';
import SystemDiagnostics, { SystemHealth, DiagnosticResult } from '../../../lib/systemDiagnostics';
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  XCircle,
  RefreshCw,
  Database,
  Server,
  Users,
  Settings,
  Zap,
  Eye,
  ChevronDown,
  ChevronUp,
  Bug,
  Wrench,
  Activity
} from 'lucide-react';

interface DiagnosticPanelProps {
  consultantId: string;
}

const DiagnosticPanel: React.FC<DiagnosticPanelProps> = ({ consultantId }) => {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [rootCauseAnalysis, setRootCauseAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    runDiagnostic();
  }, []);

  const runDiagnostic = async () => {
    setLoading(true);
    try {
      console.log('🚀 Starting comprehensive diagnostic...');
      
      const [healthResult, rootCauseResult] = await Promise.all([
        SystemDiagnostics.runComprehensiveDiagnostic(),
        SystemDiagnostics.diagnoseConsultantClientIssue()
      ]);
      
      setHealth(healthResult);
      setRootCauseAnalysis(rootCauseResult);
      
      console.log('📊 Diagnostic complete:', {
        health: healthResult.overall,
        score: healthResult.score,
        rootCause: rootCauseResult.rootCause
      });
      
    } catch (error) {
      console.error('❌ Diagnostic failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PASS': return CheckCircle;
      case 'FAIL': return XCircle;
      case 'WARNING': return AlertTriangle;
      case 'INFO': return Info;
      default: return Info;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PASS': return 'text-green-600 bg-green-50 border-green-200';
      case 'FAIL': return 'text-red-600 bg-red-50 border-red-200';
      case 'WARNING': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'INFO': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'text-red-600 bg-red-100';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100';
      case 'LOW': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const groupedResults = health?.results.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = [];
    }
    acc[result.category].push(result);
    return acc;
  }, {} as Record<string, DiagnosticResult[]>) || {};

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Sistem Analizi Yapılıyor...</h3>
          <p className="text-gray-600">Kapsamlı diagnostik çalıştırılıyor, lütfen bekleyin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Activity className="h-6 w-6 mr-3 text-blue-600" />
            🔍 Sistem Sağlık Analizi
          </h2>
          <button
            onClick={runDiagnostic}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Yeniden Analiz Et</span>
          </button>
        </div>

        {health && (
          <>
            {/* Overall Health Status */}
            <div className={`rounded-xl p-6 mb-6 border-2 ${
              health.overall === 'HEALTHY' ? 'bg-green-50 border-green-200' :
              health.overall === 'DEGRADED' ? 'bg-yellow-50 border-yellow-200' :
              'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-2xl font-bold ${
                    health.overall === 'HEALTHY' ? 'text-green-900' :
                    health.overall === 'DEGRADED' ? 'text-yellow-900' :
                    'text-red-900'
                  }`}>
                    Sistem Durumu: {health.overall}
                  </h3>
                  <p className={`text-lg ${
                    health.overall === 'HEALTHY' ? 'text-green-700' :
                    health.overall === 'DEGRADED' ? 'text-yellow-700' :
                    'text-red-700'
                  }`}>
                    Sağlık Skoru: {health.score}%
                  </p>
                </div>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  health.overall === 'HEALTHY' ? 'bg-green-100' :
                  health.overall === 'DEGRADED' ? 'bg-yellow-100' :
                  'bg-red-100'
                }`}>
                  {health.overall === 'HEALTHY' ? (
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  ) : health.overall === 'DEGRADED' ? (
                    <AlertTriangle className="h-8 w-8 text-yellow-600" />
                  ) : (
                    <XCircle className="h-8 w-8 text-red-600" />
                  )}
                </div>
              </div>

              {/* Quick Summary */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                <div className="text-center">
                  <div className={`text-lg font-bold ${health.summary.database ? 'text-green-600' : 'text-red-600'}`}>
                    {health.summary.database ? '✅' : '❌'}
                  </div>
                  <div className="text-sm text-gray-700">Database</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${health.summary.apiRoutes ? 'text-green-600' : 'text-red-600'}`}>
                    {health.summary.apiRoutes ? '✅' : '❌'}
                  </div>
                  <div className="text-sm text-gray-700">API Routes</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${health.summary.testData ? 'text-green-600' : 'text-red-600'}`}>
                    {health.summary.testData ? '✅' : '❌'}
                  </div>
                  <div className="text-sm text-gray-700">Test Data</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${health.summary.relationships ? 'text-green-600' : 'text-red-600'}`}>
                    {health.summary.relationships ? '✅' : '❌'}
                  </div>
                  <div className="text-sm text-gray-700">Relationships</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${health.summary.rpcFunctions ? 'text-green-600' : 'text-red-600'}`}>
                    {health.summary.rpcFunctions ? '✅' : '❌'}
                  </div>
                  <div className="text-sm text-gray-700">RPC Functions</div>
                </div>
              </div>
            </div>

            {/* Root Cause Analysis */}
            {rootCauseAnalysis && (
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 mb-6 border border-red-200">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getPriorityColor(rootCauseAnalysis.priority)}`}>
                    <Bug className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      🎯 Ana Sorun Tespit Edildi
                    </h3>
                    <div className="bg-white rounded-lg p-4 border border-red-200 mb-4">
                      <h4 className="font-bold text-red-900 mb-2">Kök Neden:</h4>
                      <p className="text-red-800">{rootCauseAnalysis.rootCause}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <h4 className="font-bold text-green-900 mb-2">Önerilen Çözüm:</h4>
                      <p className="text-green-800">{rootCauseAnalysis.recommendedFix}</p>
                    </div>
                    
                    {/* Technical Details */}
                    <div className="mt-4 bg-gray-50 rounded-lg p-4">
                      <h4 className="font-bold text-gray-900 mb-2">Teknik Detaylar:</h4>
                      <div className="text-sm text-gray-700 space-y-1">
                        <div>API Status: {rootCauseAnalysis.technicalDetails.apiTest?.status || 'Not tested'}</div>
                        <div>Client Count: {rootCauseAnalysis.technicalDetails.apiTest?.clientCount || 0}</div>
                        <div>Consultant: {rootCauseAnalysis.technicalDetails.consultant ? '✅ Found' : '❌ Missing'}</div>
                        <div>Test Clients: {rootCauseAnalysis.technicalDetails.clients?.found || 0}/4</div>
                        <div>Applications: {rootCauseAnalysis.technicalDetails.applications?.found || 0}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Detailed Results by Category */}
            <div className="space-y-4">
              {Object.entries(groupedResults).map(([category, results]) => {
                const isExpanded = expandedCategories.has(category);
                const categoryStats = {
                  total: results.length,
                  passed: results.filter(r => r.status === 'PASS').length,
                  failed: results.filter(r => r.status === 'FAIL').length,
                  warnings: results.filter(r => r.status === 'WARNING').length
                };

                return (
                  <div key={category} className="bg-gray-50 rounded-xl border border-gray-200">
                    <button
                      onClick={() => toggleCategory(category)}
                      className="w-full p-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          {category === 'Database' && <Database className="h-4 w-4 text-blue-600" />}
                          {category === 'API Routes' && <Server className="h-4 w-4 text-blue-600" />}
                          {category === 'Test Data' && <Users className="h-4 w-4 text-blue-600" />}
                          {category === 'Environment' && <Settings className="h-4 w-4 text-blue-600" />}
                          {category === 'RPC Functions' && <Zap className="h-4 w-4 text-blue-600" />}
                          {category === 'Relationships' && <Activity className="h-4 w-4 text-blue-600" />}
                          {category === 'Authentication' && <Eye className="h-4 w-4 text-blue-600" />}
                          {category === 'Frontend' && <Wrench className="h-4 w-4 text-blue-600" />}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{category}</h3>
                          <p className="text-sm text-gray-600">
                            {categoryStats.passed} geçti, {categoryStats.failed} başarısız, {categoryStats.warnings} uyarı
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          {categoryStats.passed > 0 && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              {categoryStats.passed} ✅
                            </span>
                          )}
                          {categoryStats.failed > 0 && (
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                              {categoryStats.failed} ❌
                            </span>
                          )}
                          {categoryStats.warnings > 0 && (
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                              {categoryStats.warnings} ⚠️
                            </span>
                          )}
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4">
                        <div className="space-y-3">
                          {results.map((result, index) => {
                            const StatusIcon = getStatusIcon(result.status);
                            
                            return (
                              <div
                                key={index}
                                className={`border rounded-lg p-4 ${getStatusColor(result.status)}`}
                              >
                                <div className="flex items-start space-x-3">
                                  <StatusIcon className="h-5 w-5 mt-0.5" />
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 mb-1">
                                      {result.test}
                                    </h4>
                                    <p className="text-sm text-gray-700 mb-2">
                                      {result.message}
                                    </p>
                                    
                                    {result.details && (
                                      <div className="bg-white/50 rounded p-2 mb-2">
                                        <pre className="text-xs text-gray-600 overflow-x-auto">
                                          {JSON.stringify(result.details, null, 2)}
                                        </pre>
                                      </div>
                                    )}
                                    
                                    {result.fix && (
                                      <div className="bg-blue-50 rounded p-2 border border-blue-200">
                                        <p className="text-sm text-blue-800">
                                          <strong>💡 Çözüm:</strong> {result.fix}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🛠️ Hızlı Düzeltme Araçları</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={async () => {
              try {
                const response = await fetch('/api/consultant/clients', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    consultantEmail: 'georgia_consultant@consulting19.com',
                    countryId: 1
                  })
                });
                const result = await response.json();
                alert(`API Test: ${response.status} - ${result.data?.length || 0} clients found`);
                console.log('API Test Result:', result);
              } catch (error) {
                alert(`API Test Failed: ${error}`);
              }
            }}
            className="bg-blue-600 text-white p-4 rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Server className="h-6 w-6 mb-2" />
            <div className="font-semibold">API Route Test</div>
            <div className="text-sm text-blue-100">Test /api/consultant/clients</div>
          </button>

          <button
            onClick={async () => {
              try {
                // Test database connection
                const { data, error } = await supabase.from('users').select('count').limit(1);
                if (error) throw error;
                alert('✅ Database connection successful');
              } catch (error) {
                alert(`❌ Database test failed: ${error}`);
              }
            }}
            className="bg-green-600 text-white p-4 rounded-xl hover:bg-green-700 transition-colors"
          >
            <Database className="h-6 w-6 mb-2" />
            <div className="font-semibold">Database Test</div>
            <div className="text-sm text-green-100">Test Supabase connection</div>
          </button>

          <button
            onClick={() => {
              console.log('🔍 Current System State:');
              console.log('URL:', window.location.href);
              console.log('User:', JSON.parse(localStorage.getItem('user') || '{}'));
              console.log('Environment:', {
                isDev: import.meta.env.DEV,
                mode: import.meta.env.MODE,
                supabaseUrl: import.meta.env.VITE_SUPABASE_URL?.substring(0, 30) + '...'
              });
              alert('Check console for detailed system state');
            }}
            className="bg-purple-600 text-white p-4 rounded-xl hover:bg-purple-700 transition-colors"
          >
            <Eye className="h-6 w-6 mb-2" />
            <div className="font-semibold">System State</div>
            <div className="text-sm text-purple-100">Log current state</div>
          </button>
        </div>
      </div>

      {/* Manual API Test */}
      <div className="bg-gray-900 text-white rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-4">🧪 Manuel API Test Kodu</h3>
        <div className="bg-black/50 rounded-lg p-4 font-mono text-sm">
          <div className="text-green-400 mb-2">// Browser Console'da çalıştır:</div>
          <div className="text-white">
            {`fetch('/api/consultant/clients', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    consultantEmail: 'georgia_consultant@consulting19.com',
    countryId: 1
  })
}).then(r => r.json()).then(console.log).catch(console.error);`}
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-300">
          <strong>Beklenen Sonuç:</strong> {`{ ok: true, data: [{ email: 'ahmet@test.com', ... }] }`}
        </div>
      </div>
    </div>
  );
};

export default DiagnosticPanel;
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Globe, 
  Filter, 
  Search, 
  Eye, 
  MessageSquare,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Building2,
  DollarSign,
  Clock,
  Star,
  Phone,
  Mail,
  MapPin,
  FileText,
  Plus,
  Edit,
  RefreshCw,
  BarChart3,
  CheckCircle,
  User,
  CreditCard,
  Package,
  X,
  Shield,
  Database,
  Zap,
  Settings
} from 'lucide-react';

interface CountryBasedClientsProps {
  consultantId: string;
}

// Simple API client function
async function fetchClients({ search = '', limit = 50, offset = 0 } = {}) {
  console.log('🔍 [CLIENT] Fetching clients via API...');
  
  try {
    const res = await fetch('/api/consultant/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        consultantEmail: 'georgia_consultant@consulting19.com',
        countryId: 1,
        search: search || null,
        limit, 
        offset
      })
    });

    const json = await res.json();
    console.log('📋 [CLIENT] API Response:', { status: res.status, json });
    
    if (!res.ok) {
      throw new Error(json?.error || `API error: ${res.status}`);
    }
    
    return Array.isArray(json.data) ? json.data : [];
  } catch (error) {
    console.error('❌ [CLIENT] API Error:', error);
    throw error;
  }
}

const CountryBasedClients: React.FC<CountryBasedClientsProps> = ({ consultantId }) => {
  const [clients, setClients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [showClientDetails, setShowClientDetails] = useState(false);
  const [apiTestResult, setApiTestResult] = useState<any>(null);

  useEffect(() => {
    console.log('🇬🇪 CountryBasedClients component mounted!');
    console.log('🇬🇪 Consultant ID:', consultantId);
    loadClients();
  }, [consultantId]);

  const loadClients = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const clientsData = await fetchClients({ 
        search: searchTerm, 
        limit: 50, 
        offset: 0 
      });
      
      console.log('✅ [CLIENT] Clients loaded:', clientsData.length);
      console.log('📋 [CLIENT] Sample client:', clientsData[0]);
      setClients(clientsData);
      
    } catch (error) {
      console.error('❌ [CLIENT] Error loading clients:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  const testApiDirectly = async () => {
    try {
      console.log('🧪 [TEST] Testing API directly...');
      
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

      const result = await response.json();
      
      setApiTestResult({
        status: response.status,
        ok: response.ok,
        data: result,
        timestamp: new Date().toISOString()
      });

      console.log('🧪 [TEST] API Test Result:', {
        status: response.status,
        ok: response.ok,
        dataLength: result.data?.length || 0,
        result
      });

      if (response.ok && result.data) {
        alert(`✅ API Working! Found ${result.data.length} clients`);
        setClients(result.data);
      } else {
        alert(`❌ API Failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('❌ [TEST] API test failed:', error);
      setApiTestResult({
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
      alert(`❌ API Test Failed: ${error}`);
    }
  };

  const createTestData = async () => {
    try {
      setLoading(true);
      console.log('🔧 [TEST] Creating test data...');
      
      // For now, we'll simulate test data creation
      // In a real implementation, this would call an API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('✅ Test data creation simulated! Try reloading clients.');
      await loadClients();
    } catch (error) {
      console.error('❌ [TEST] Error creating test data:', error);
      alert('❌ Error creating test data: ' + error);
    } finally {
      setLoading(false);
    }
  };

  // Reload clients when search term changes (debounced)
  useEffect(() => {
    if (searchTerm !== '') {
      const timeoutId = setTimeout(() => {
        loadClients();
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm]);

  const filteredClients = clients.filter(client => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      client.full_name?.toLowerCase().includes(search) ||
      client.email?.toLowerCase().includes(search) ||
      client.company_name?.toLowerCase().includes(search)
    );
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* API TEST CENTER */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-8 rounded-2xl border-4 border-yellow-400 shadow-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center">
          <Database className="h-8 w-8 mr-3" />
          🇬🇪 API TEST CENTER 🇬🇪
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold">{clients.length}</div>
            <div className="text-sm">Current Clients</div>
            <div className="text-xs mt-1">{clients.length === 4 ? '✅ EXPECTED' : '❌ MISSING'}</div>
          </div>
          <div className="bg-white/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold">4</div>
            <div className="text-sm">Expected Clients</div>
            <div className="text-xs mt-1">Target Count</div>
          </div>
          <div className="bg-white/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold">
              {apiTestResult?.ok ? '✅' : apiTestResult ? '❌' : '❓'}
            </div>
            <div className="text-sm">API Status</div>
            <div className="text-xs mt-1">
              {apiTestResult?.status || 'Not tested'}
            </div>
          </div>
          <div className="bg-white/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold">
              {apiTestResult?.data?.data?.length || 0}
            </div>
            <div className="text-sm">API Results</div>
            <div className="text-xs mt-1">Returned rows</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={testApiDirectly}
            className="bg-yellow-500 text-black py-4 px-6 rounded-xl font-bold hover:bg-yellow-400 transition-colors flex items-center justify-center space-x-2"
          >
            <Zap className="h-5 w-5" />
            <span>🧪 TEST API DIRECTLY</span>
          </button>
          <button
            onClick={createTestData}
            className="bg-green-500 text-white py-4 px-6 rounded-xl font-bold hover:bg-green-400 transition-colors flex items-center justify-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>🔧 CREATE TEST DATA</span>
          </button>
          <button
            onClick={loadClients}
            className="bg-blue-500 text-white py-4 px-6 rounded-xl font-bold hover:bg-blue-400 transition-colors flex items-center justify-center space-x-2"
          >
            <RefreshCw className="h-5 w-5" />
            <span>🔄 RELOAD CLIENTS</span>
          </button>
        </div>

        <div className="bg-black/30 p-4 rounded-xl text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>🎯 Expected Clients:</strong></p>
              <ul className="text-xs mt-1 space-y-1">
                <li>• Business Client (client@consulting19.com)</li>
                <li>• Ahmet Yılmaz (ahmet@test.com)</li>
                <li>• Maria Garcia (maria@test.com)</li>
                <li>• David Smith (david@test.com)</li>
              </ul>
            </div>
            <div>
              <p><strong>🔧 System Info:</strong></p>
              <ul className="text-xs mt-1 space-y-1">
                <li>• Consultant ID: {consultantId}</li>
                <li>• API: /api/consultant/clients</li>
                <li>• Method: POST</li>
                <li>• Country: Georgia (ID: 1)</li>
              </ul>
            </div>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-500/20 rounded-lg border border-red-400">
              <p className="text-red-200"><strong>❌ Current Error:</strong> {error}</p>
            </div>
          )}
          
          {apiTestResult && (
            <div className="mt-4 p-3 bg-blue-500/20 rounded-lg border border-blue-400">
              <p className="text-blue-200"><strong>🧪 Last API Test:</strong></p>
              <div className="text-xs mt-1 space-y-1">
                <div>Status: {apiTestResult.status} {apiTestResult.ok ? '✅' : '❌'}</div>
                <div>Data Length: {apiTestResult.data?.data?.length || 0}</div>
                <div>Error: {apiTestResult.error || apiTestResult.data?.error || 'None'}</div>
                <div>Time: {apiTestResult.timestamp}</div>
              </div>
            </div>
          )}
        </div>

        {/* Manual API Test */}
        <div className="mt-4 bg-black/40 p-4 rounded-xl">
          <h4 className="text-white font-bold mb-2">🧪 Manual API Test (Copy to Browser Console):</h4>
          <div className="bg-black/60 p-3 rounded text-green-300 text-xs font-mono">
            {`fetch('/api/consultant/clients', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    consultantEmail: 'georgia_consultant@consulting19.com',
    countryId: 1
  })
}).then(r => r.json()).then(console.log).catch(console.error);`}
          </div>
          <p className="text-white/70 text-xs mt-2">
            Expected: {`{ ok: true, data: [{ email: 'ahmet@test.com', ... }] }`}
          </p>
        </div>
      </div>

      {/* Main Client Management */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Users className="h-6 w-6 mr-3 text-blue-600" />
            🇬🇪 Ülke Bazlı Müşterilerim
          </h2>
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-500">
              <span className="font-bold text-lg">{filteredClients.length}</span> müşteri
            </div>
            <button
              onClick={loadClients}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              title="Müşterileri Yenile"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Müşteri ara (ad, email, şirket)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Georgia Summary */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 mb-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-3xl">🇬🇪</span>
                <div>
                  <h3 className="text-xl font-bold text-green-900">Georgia Müşteri Merkezi</h3>
                  <p className="text-green-700">Nino Kvaratskhelia - Georgia Expert</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-900">{clients.length}</div>
                  <div className="text-sm text-green-700">Toplam Müşteri</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-900">
                    {clients.filter(c => c.language === 'tr').length}
                  </div>
                  <div className="text-sm text-green-700">Türkçe Müşteri</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-900">
                    {clients.filter(c => c.company_name).length}
                  </div>
                  <div className="text-sm text-green-700">Şirket Müşterisi</div>
                </div>
              </div>
            </div>
            <Shield className="h-16 w-16 text-green-600" />
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-800">Liste yüklenemedi: {error}</p>
            </div>
          </div>
        )}

        {/* Client List */}
        <div className="space-y-4">
          {filteredClients.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {clients.length === 0 ? 'Müşteri Bulunamadı' : 'Arama Sonucu Yok'}
              </h3>
              <p className="text-gray-600 mb-6">
                {clients.length === 0 
                  ? 'API üzerinden müşteri verisi alınamadı.'
                  : 'Arama kriterlerinize uygun müşteri bulunamadı.'
                }
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-2xl mx-auto text-left mb-4">
                <h4 className="font-bold text-yellow-900 mb-2">🔍 Debug Bilgileri:</h4>
                <div className="text-sm text-yellow-800 space-y-1">
                  <p><strong>Consultant ID:</strong> {consultantId}</p>
                  <p><strong>API Endpoint:</strong> /api/consultant/clients</p>
                  <p><strong>Expected:</strong> 4 clients (Business Client, Ahmet, Maria, David)</p>
                  <p><strong>Current:</strong> {clients.length} clients</p>
                  <p><strong>Error:</strong> {error || 'None'}</p>
                  <p><strong>API Test Status:</strong> {apiTestResult?.ok ? '✅ OK' : apiTestResult ? '❌ Failed' : '❓ Not tested'}</p>
                </div>
              </div>
              
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={testApiDirectly}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-bold"
                >
                  🧪 TEST API NOW
                </button>
                <button
                  onClick={createTestData}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-bold"
                >
                  🔧 CREATE TEST DATA
                </button>
              </div>
            </div>
          ) : (
            filteredClients.map((client) => (
              <div
                key={client.client_id || client.id}
                className="border border-gray-200 rounded-xl p-6 hover:border-green-300 transition-colors bg-gradient-to-r from-white to-green-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Client Avatar */}
                    <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-green-200 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🇬🇪</span>
                    </div>

                    {/* Client Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          {client.full_name || `${client.first_name} ${client.last_name}`}
                        </h3>
                        {client.company_name && (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                            {client.company_name}
                          </span>
                        )}
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                          {client.language?.toUpperCase() || 'TR'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-4 w-4 mr-2 text-gray-400" />
                            {client.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Globe className="h-4 w-4 mr-2 text-gray-400" />
                            {client.country_name || 'Georgia'} • {client.language?.toUpperCase() || 'TR'}
                          </div>
                        </div>

                        <div className="space-y-1">
                          {client.business_type && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                              {client.business_type}
                            </div>
                          )}
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            Müşteri: {client.client_since ? formatDate(client.client_since) : 'N/A'}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-2 text-gray-400" />
                            Atanma: {client.assigned_at ? formatDate(client.assigned_at) : 'N/A'}
                          </div>
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-4 gap-2">
                        <div className="text-center bg-blue-50 rounded-lg p-2">
                          <div className="text-sm font-bold text-blue-900">{client.applications_count || 0}</div>
                          <div className="text-xs text-blue-700">Proje</div>
                        </div>
                        <div className="text-center bg-green-50 rounded-lg p-2">
                          <div className="text-sm font-bold text-green-900">0</div>
                          <div className="text-xs text-green-700">Aktif</div>
                        </div>
                        <div className="text-center bg-purple-50 rounded-lg p-2">
                          <div className="text-sm font-bold text-purple-900">0</div>
                          <div className="text-xs text-purple-700">Belge</div>
                        </div>
                        <div className="text-center bg-orange-50 rounded-lg p-2">
                          <div className="text-sm font-bold text-orange-900">${client.total_revenue || 0}</div>
                          <div className="text-xs text-orange-700">Gelir</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      onClick={() => {
                        setSelectedClient(client);
                        setShowClientDetails(true);
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                      title="Detayları Görüntüle"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors">
                      <MessageSquare className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
                      <Calendar className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-orange-600 rounded-lg hover:bg-orange-50 transition-colors">
                      <DollarSign className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Georgia Quick Actions */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Package className="h-5 w-5 mr-2 text-green-600" />
          🇬🇪 Gürcistan Hızlı İşlemler
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl p-4 text-left transition-colors">
            <Building2 className="h-8 w-8 text-green-600 mb-2" />
            <h4 className="font-semibold text-gray-900">Yeni LLC Kurulumu</h4>
            <p className="text-sm text-gray-600">Gürcistan LLC kurulum süreci başlat</p>
          </button>
          <button className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl p-4 text-left transition-colors">
            <BarChart3 className="h-8 w-8 text-blue-600 mb-2" />
            <h4 className="font-semibold text-gray-900">Muhasebe Hizmeti</h4>
            <p className="text-sm text-gray-600">Aylık muhasebe paketi öner</p>
          </button>
          <button className="bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl p-4 text-left transition-colors">
            <FileText className="h-8 w-8 text-purple-600 mb-2" />
            <h4 className="font-semibold text-gray-900">Vergi İkametgahı</h4>
            <p className="text-sm text-gray-600">Vergi ikametgahı başvurusu</p>
          </button>
        </div>
      </div>

      {/* Client Details Modal */}
      {showClientDetails && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="text-2xl mr-3">🇬🇪</span>
                {selectedClient.full_name || `${selectedClient.first_name} ${selectedClient.last_name}`} - Detaylar
              </h3>
              <button
                onClick={() => setShowClientDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Client Information */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Müşteri Bilgileri</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Ad Soyad:</strong> {selectedClient.full_name || `${selectedClient.first_name} ${selectedClient.last_name}`}
                  </div>
                  <div>
                    <strong>Email:</strong> {selectedClient.email}
                  </div>
                  <div>
                    <strong>Şirket:</strong> {selectedClient.company_name || 'Belirtilmemiş'}
                  </div>
                  <div>
                    <strong>İş Türü:</strong> {selectedClient.business_type || 'Belirtilmemiş'}
                  </div>
                  <div>
                    <strong>Dil:</strong> {selectedClient.language?.toUpperCase() || 'TR'}
                  </div>
                  <div>
                    <strong>Ülke:</strong> {selectedClient.country_name || 'Georgia'}
                  </div>
                  <div>
                    <strong>Müşteri Tarihi:</strong> {selectedClient.client_since ? formatDate(selectedClient.client_since) : 'N/A'}
                  </div>
                  <div>
                    <strong>Atanma Tarihi:</strong> {selectedClient.assigned_at ? formatDate(selectedClient.assigned_at) : 'N/A'}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4">
                <button className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Mesaj Gönder</span>
                </button>
                <button className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Toplantı Planla</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Export the fetchClients function for other components
export { fetchClients };

export default CountryBasedClients;
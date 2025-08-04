import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { 
  Users, 
  Globe, 
  Filter, 
  Search, 
  Eye, 
  MessageSquare,
  Calendar,
  TrendingUp,
  AlertCircle,
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
  Database
} from 'lucide-react';

interface CountryBasedClientsProps {
  consultantId: string;
}

const CountryBasedClients: React.FC<CountryBasedClientsProps> = ({ consultantId }) => {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [showClientDetails, setShowClientDetails] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  // Comprehensive debug function
  const runSystemDebug = async () => {
    console.log('🚨🚨🚨 =================================');
    console.log('🚨🚨🚨 GEORGIA SYSTEM COMPREHENSIVE DEBUG');
    console.log('🚨🚨🚨 =================================');
    
    try {
      const debug: any = {
        consultantId,
        timestamp: new Date().toISOString(),
        checks: {}
      };

      // 1. Check consultant exists
      const { data: consultant, error: consultantError } = await supabase
        .from('users')
        .select('*')
        .eq('id', consultantId)
        .eq('role', 'consultant')
        .maybeSingle();
      
      debug.checks.consultant = {
        exists: !!consultant,
        data: consultant,
        error: consultantError?.message
      };
      
      console.log('👤 CONSULTANT CHECK:', debug.checks.consultant);

      // 2. Check consultant_clients table exists and has data
      const { data: consultantClients, error: ccError } = await supabase
        .from('consultant_clients')
        .select('*')
        .eq('consultant_id', consultantId);
      
      debug.checks.consultantClients = {
        count: consultantClients?.length || 0,
        data: consultantClients,
        error: ccError?.message
      };
      
      console.log('🔗 CONSULTANT_CLIENTS TABLE:', debug.checks.consultantClients);

      // 3. Test the RPC function
      const { data: rpcResult, error: rpcError } = await supabase
        .rpc('get_consultant_clients', {
          p_consultant_id: consultantId,
          p_country_id: 1,
          p_search: null,
          p_limit: 50,
          p_offset: 0
        });
      
      debug.checks.rpcFunction = {
        count: rpcResult?.length || 0,
        data: rpcResult,
        error: rpcError?.message
      };
      
      console.log('⚡ RPC FUNCTION TEST:', debug.checks.rpcFunction);

      // 4. Check view directly
      const { data: viewResult, error: viewError } = await supabase
        .from('v_consultant_client_list')
        .select('*')
        .eq('consultant_id', consultantId);
      
      debug.checks.view = {
        count: viewResult?.length || 0,
        data: viewResult,
        error: viewError?.message
      };
      
      console.log('👁️ VIEW DIRECT QUERY:', debug.checks.view);

      // 5. Check all users in database
      const { data: allUsers, error: usersError } = await supabase
        .from('users')
        .select('id, first_name, last_name, role, email, country_id');
      
      debug.checks.allUsers = {
        total: allUsers?.length || 0,
        consultants: allUsers?.filter(u => u.role === 'consultant') || [],
        clients: allUsers?.filter(u => u.role === 'client') || [],
        error: usersError?.message
      };
      
      console.log('👥 ALL USERS:', debug.checks.allUsers);

      // 6. Check countries table
      const { data: countries, error: countriesError } = await supabase
        .from('countries')
        .select('*');
      
      debug.checks.countries = {
        count: countries?.length || 0,
        georgia: countries?.find(c => c.id === 1),
        error: countriesError?.message
      };
      
      console.log('🌍 COUNTRIES:', debug.checks.countries);

      setDebugInfo(debug);
      
      console.log('🚨🚨🚨 COMPLETE DEBUG OBJECT:', debug);
      console.log('🚨🚨🚨 DEBUG COMPLETED 🚨🚨🚨');
      
      return debug;
      
    } catch (error) {
      console.error('🚨 Debug error:', error);
      return { error: error.message };
    }
  };

  useEffect(() => {
    console.log('🚨 CountryBasedClients component mounted!');
    console.log('🚨 Consultant ID:', consultantId);
    loadClients();
  }, [consultantId]);

  const loadClients = async () => {
    try {
      setLoading(true);
      console.log('🔍 Loading clients using RPC function...');
      
      // Use the new RPC function for optimized query
      const { data: clientsData, error } = await supabase
        .rpc('get_consultant_clients', {
          p_consultant_id: consultantId,
          p_country_id: 1, // Georgia only
          p_search: searchTerm || null,
          p_limit: 50,
          p_offset: 0
        });

      console.log('📋 RPC Result:', { clientsData, error });

      if (error) {
        console.error('❌ RPC Error:', error);
        // Fallback to direct query if RPC fails
        await loadClientsFallback();
        return;
      }

      setClients(clientsData || []);
      console.log('✅ Clients loaded successfully:', clientsData?.length || 0);
      
    } catch (error) {
      console.error('Error loading clients:', error);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  // Fallback method using direct queries
  const loadClientsFallback = async () => {
    try {
      console.log('🔄 Using fallback method...');
      
      const { data: consultantClientsData, error } = await supabase
        .from('consultant_clients')
        .select(`
          client_user_id,
          assigned_at,
          client:users!consultant_clients_client_user_id_fkey(
            id, first_name, last_name, email, company_name, business_type, language, created_at
          )
        `)
        .eq('consultant_id', consultantId);

      console.log('📋 Fallback Result:', { consultantClientsData, error });

      if (error) {
        console.error('❌ Fallback Error:', error);
        setClients([]);
        return;
      }

      const clients = consultantClientsData?.map(cc => ({
        client_id: cc.client.id,
        email: cc.client.email,
        first_name: cc.client.first_name,
        last_name: cc.client.last_name,
        full_name: `${cc.client.first_name} ${cc.client.last_name}`,
        company_name: cc.client.company_name,
        business_type: cc.client.business_type,
        language: cc.client.language,
        client_since: cc.client.created_at,
        country_id: 1,
        country_name: 'Georgia',
        flag_emoji: '🇬🇪',
        assigned_at: cc.assigned_at
      })) || [];

      setClients(clients);
      console.log('✅ Fallback clients loaded:', clients.length);
      
    } catch (error) {
      console.error('Fallback error:', error);
      setClients([]);
    }
  };

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
    <>
      {/* SUPER VISIBLE DEBUG PANEL */}
      <div style={{
        position: 'fixed',
        top: '100px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 999999,
        backgroundColor: '#dc2626',
        color: 'white',
        padding: '20px',
        borderRadius: '16px',
        border: '4px solid #fbbf24',
        textAlign: 'center',
        boxShadow: '0 25px 50px rgba(0,0,0,0.8)',
        maxWidth: '700px',
        width: '90%'
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
          🇬🇪 GEORGIA CONSULTANT-CLIENT SYSTEM TEST 🇬🇪
        </h2>
        <p style={{ fontSize: '16px', marginBottom: '16px' }}>
          Migration çalıştırıldı! Şimdi Nino'nun müşterilerini kontrol edelim.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <button
            onClick={runSystemDebug}
            style={{
              backgroundColor: '#fbbf24',
              color: 'black',
              padding: '16px 24px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              border: '2px solid black',
              cursor: 'pointer',
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
            }}
          >
            🔍 FULL SYSTEM DEBUG
          </button>
          <button
            onClick={loadClients}
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              padding: '16px 24px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              border: '2px solid #065f46',
              cursor: 'pointer',
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
            }}
          >
            🔄 RELOAD CLIENTS
          </button>
        </div>
        <div style={{ fontSize: '14px', backgroundColor: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
          <p><strong>Consultant ID:</strong> {consultantId}</p>
          <p><strong>Current Clients:</strong> {clients.length}</p>
          <p><strong>Expected:</strong> 4 clients (Business Client, Ahmet, Maria, David)</p>
          <p><strong>Status:</strong> {clients.length === 4 ? '✅ SUCCESS' : '❌ MISSING CLIENTS'}</p>
        </div>
      </div>

      <div className="space-y-6" style={{ marginTop: '250px' }}>
        {/* Main Client Management */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Users className="h-6 w-6 mr-3 text-blue-600" />
              🇬🇪 Gürcistan Müşterilerim
            </h2>
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-500">
                {filteredClients.length} müşteri
              </div>
              <button
                onClick={loadClients}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                title="Müşterileri Yenile"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
              <button
                onClick={runSystemDebug}
                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                title="System Debug"
              >
                <Database className="h-5 w-5" />
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
                    ? 'Henüz size atanmış Gürcistan müşterisi yok.'
                    : 'Arama kriterlerinize uygun müşteri bulunamadı.'
                  }
                </p>
                
                {/* Debug Info Display */}
                {debugInfo && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-2xl mx-auto text-left">
                    <h4 className="font-bold text-yellow-900 mb-2">🔍 Debug Bilgileri:</h4>
                    <div className="text-sm text-yellow-800 space-y-1">
                      <p><strong>Consultant ID:</strong> {debugInfo.consultantId}</p>
                      <p><strong>Consultant Exists:</strong> {debugInfo.checks.consultant?.exists ? '✅' : '❌'}</p>
                      <p><strong>Consultant-Clients Count:</strong> {debugInfo.checks.consultantClients?.count || 0}</p>
                      <p><strong>RPC Function Count:</strong> {debugInfo.checks.rpcFunction?.count || 0}</p>
                      <p><strong>View Count:</strong> {debugInfo.checks.view?.count || 0}</p>
                      <p><strong>Total Users:</strong> {debugInfo.checks.allUsers?.total || 0}</p>
                      <p><strong>Total Clients:</strong> {debugInfo.checks.allUsers?.clients?.length || 0}</p>
                    </div>
                  </div>
                )}
                
                <button
                  onClick={runSystemDebug}
                  className="mt-4 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-bold"
                >
                  🚨 FULL SYSTEM DEBUG
                </button>
              </div>
            ) : (
              filteredClients.map((client) => (
                <div
                  key={client.client_id}
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
                            {client.full_name}
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
                              {client.country_name} • {client.language?.toUpperCase() || 'TR'}
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
                              Müşteri: {formatDate(client.client_since)}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="h-4 w-4 mr-2 text-gray-400" />
                              Atanma: {formatDate(client.assigned_at)}
                            </div>
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-4 gap-2">
                          <div className="text-center bg-blue-50 rounded-lg p-2">
                            <div className="text-sm font-bold text-blue-900">0</div>
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
                            <div className="text-sm font-bold text-orange-900">$0</div>
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
              <Calculator className="h-8 w-8 text-blue-600 mb-2" />
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

        {/* System Status */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl shadow-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            🇬🇪 Georgia System Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{clients.length}/4</div>
              <div className="text-gray-300 text-sm">Test Müşterileri</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">1</div>
              <div className="text-gray-300 text-sm">Georgia Danışmanı</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {clients.length === 4 ? '✅' : '❌'}
              </div>
              <div className="text-gray-300 text-sm">System Status</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">🇬🇪</div>
              <div className="text-gray-300 text-sm">Georgia Ready</div>
            </div>
          </div>
        </div>
      </div>

      {/* Client Details Modal */}
      {showClientDetails && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="text-2xl mr-3">🇬🇪</span>
                {selectedClient.full_name} - Detaylar
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
                    <strong>Ad Soyad:</strong> {selectedClient.full_name}
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
                    <strong>Ülke:</strong> {selectedClient.country_name}
                  </div>
                  <div>
                    <strong>Müşteri Tarihi:</strong> {formatDate(selectedClient.client_since)}
                  </div>
                  <div>
                    <strong>Atanma Tarihi:</strong> {formatDate(selectedClient.assigned_at)}
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
    </>
  );
};

export default CountryBasedClients;
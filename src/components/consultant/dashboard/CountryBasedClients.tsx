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
  X
} from 'lucide-react';

interface CountryBasedClientsProps {
  consultantId: string;
}

const CountryBasedClients: React.FC<CountryBasedClientsProps> = ({ consultantId }) => {
  const [clients, setClients] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [showClientDetails, setShowClientDetails] = useState(false);

  // Debug function
  const runDatabaseDebug = async () => {
    console.log('🚨🚨🚨 =================================');
    console.log('🚨🚨🚨 STARTING COMPREHENSIVE DEBUG');
    console.log('🚨🚨🚨 Consultant ID:', consultantId);
    console.log('🚨🚨🚨 =================================');
    
    try {
      // 1. Check consultant exists
      const { data: consultant, error: consultantError } = await supabase
        .from('users')
        .select('*')
        .eq('id', consultantId)
        .eq('role', 'consultant')
        .maybeSingle();
      
      console.log('👤 CONSULTANT CHECK:');
      console.log('👤 Data:', consultant);
      console.log('👤 Error:', consultantError);
      
      // 2. Check consultant country assignments
      const { data: assignments, error: assignmentsError } = await supabase
        .from('consultant_country_assignments')
        .select(`
          *,
          countries(id, name, flag_emoji)
        `)
        .eq('consultant_id', consultantId);
      
      console.log('🌍 COUNTRY ASSIGNMENTS:');
      console.log('🌍 Data:', assignments);
      console.log('🌍 Error:', assignmentsError);
      
      // 3. Check applications assigned to this consultant
      const { data: applications, error: appsError } = await supabase
        .from('applications')
        .select('*')
        .eq('consultant_id', consultantId);
      
      console.log('📋 APPLICATIONS FOR CONSULTANT:');
      console.log('📋 Data:', applications);
      console.log('📋 Count:', applications?.length || 0);
      console.log('📋 Error:', appsError);
      
      // 4. Check all applications in database
      const { data: allApps, error: allAppsError } = await supabase
        .from('applications')
        .select('*');
      
      console.log('📋 ALL APPLICATIONS IN DB:');
      console.log('📋 Data:', allApps);
      console.log('📋 Count:', allApps?.length || 0);
      console.log('📋 Error:', allAppsError);
      
      // 5. Check all users
      const { data: allUsers, error: usersError } = await supabase
        .from('users')
        .select('id, first_name, last_name, role, email, country_id');
      
      console.log('👥 ALL USERS:');
      console.log('👥 Data:', allUsers);
      console.log('👥 Consultants:', allUsers?.filter(u => u.role === 'consultant'));
      console.log('👥 Clients:', allUsers?.filter(u => u.role === 'client'));
      console.log('👥 Error:', usersError);
      
      // 6. Try the actual query used in loadData
      const { data: clientQuery, error: clientError } = await supabase
        .from('applications')
        .select(`
          client:users!applications_client_id_fkey(
            id, first_name, last_name, email, phone, company_name, business_type, 
            address, language, marketing_consent, timezone, created_at,
            client_country:countries!users_country_id_fkey(id, name, flag_emoji)
          ),
          id, service_type, status, total_amount, currency, created_at, priority_level,
          estimated_completion, actual_completion, client_satisfaction_rating,
          service_country:countries!applications_service_country_id_fkey(id, name, flag_emoji)
        `)
        .eq('consultant_id', consultantId)
        .not('client_id', 'is', null);
      
      console.log('🔍 CLIENT QUERY RESULT:');
      console.log('🔍 Data:', clientQuery);
      console.log('🔍 Error:', clientError);
      
      console.log('🚨🚨🚨 DEBUG COMPLETED 🚨🚨🚨');
      
    } catch (error) {
      console.error('🚨 Debug error:', error);
    }
  };

  // Auto-run debug on component mount
  useEffect(() => {
    console.log('🚨 CountryBasedClients component mounted!');
    console.log('🚨 Consultant ID:', consultantId);
    
    // Auto-run debug after 2 seconds
    setTimeout(() => {
      console.log('🚨 Auto-running database debug...');
      runDatabaseDebug();
    }, 2000);
  }, [consultantId]);

  useEffect(() => {
    loadData();
  }, [consultantId]);

  const loadData = async () => {
    try {
      console.log('🔍 loadData function started for consultant:', consultantId);
      
      // Load consultant's assigned countries
      const { data: assignedCountries, error: countriesError } = await supabase
        .from('consultant_country_assignments')
        .select(`
          countries!consultant_country_assignments_country_id_fkey(id, name, flag_emoji)
        `)
        .eq('consultant_id', consultantId)
        .eq('status', true);

      console.log('🌍 Countries query result:', { assignedCountries, countriesError });
      
      const countryList = assignedCountries?.map(ac => ac.countries).filter(Boolean) || [];
      setCountries(countryList);

      // Load clients assigned to this consultant via applications
      const { data: applicationsData, error: appsError } = await supabase
        .from('applications')
        .select(`
          client:users!applications_client_id_fkey(
            id, first_name, last_name, email, phone, company_name, business_type, 
            address, language, marketing_consent, timezone, created_at,
            client_country:countries!users_country_id_fkey(id, name, flag_emoji)
          ),
          id, service_type, status, total_amount, currency, created_at, priority_level,
          estimated_completion, actual_completion, client_satisfaction_rating,
          service_country:countries!applications_service_country_id_fkey(id, name, flag_emoji)
        `)
        .eq('consultant_id', consultantId)
        .not('client_id', 'is', null)
        .order('created_at', { ascending: false });
      
      console.log('📋 Applications query result:', { applicationsData, appsError });
      
      if (appsError) {
        console.error('Error loading applications:', appsError);
        setClients([]);
        return;
      }

      // Get unique clients with their application data
      const clientsMap = new Map();
      applicationsData?.forEach(app => {
        if (app.client) {
          const clientId = app.client.id;
          if (!clientsMap.has(clientId)) {
            clientsMap.set(clientId, {
              ...app.client,
              applications: []
            });
          }
          clientsMap.get(clientId).applications.push({
            id: app.id,
            service_type: app.service_type,
            status: app.status,
            total_amount: app.total_amount,
            currency: app.currency,
            created_at: app.created_at,
            priority_level: app.priority_level,
            estimated_completion: app.estimated_completion,
            actual_completion: app.actual_completion,
            client_satisfaction_rating: app.client_satisfaction_rating,
            service_country: app.service_country
          });
        }
      });

      const uniqueClients = Array.from(clientsMap.values());
      console.log('👥 Final unique clients:', uniqueClients);
      setClients(uniqueClients);
      
    } catch (error) {
      console.error('Error loading data:', error);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesCountry = selectedCountry === 'all' || 
      client.client_country?.id === parseInt(selectedCountry);
    const matchesSearch = searchTerm === '' || 
      `${client.first_name} ${client.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCountry && matchesSearch;
  });

  const getClientStats = (client: any) => {
    const applications = client.applications || [];
    return {
      total: applications.length,
      active: applications.filter((app: any) => ['pending', 'in_progress'].includes(app.status)).length,
      completed: applications.filter((app: any) => app.status === 'completed').length,
      revenue: applications.reduce((sum: number, app: any) => sum + parseFloat(app.total_amount || 0), 0),
      avgSatisfaction: applications.filter((app: any) => app.client_satisfaction_rating)
        .reduce((sum: number, app: any, _, arr: any[]) => 
          sum + app.client_satisfaction_rating / arr.length, 0) || 0
    };
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getServiceTypeLabel = (serviceType: string) => {
    const labels: Record<string, string> = {
      'company_formation': 'Şirket Kurulumu',
      'accounting_services': 'Muhasebe Hizmetleri',
      'tax_optimization': 'Vergi Optimizasyonu',
      'legal_consulting': 'Hukuki Danışmanlık',
      'banking_solutions': 'Bankacılık Çözümleri',
      'visa_residency': 'Vize & İkamet'
    };
    return labels[serviceType] || serviceType;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'pending': 'Bekliyor',
      'in_progress': 'Devam Ediyor',
      'completed': 'Tamamlandı',
      'cancelled': 'İptal Edildi'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
      {/* SUPER VISIBLE DEBUG BUTTON */}
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
        maxWidth: '600px',
        width: '90%'
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
          🚨 GEORGIA TEST SYSTEM 🚨
        </h2>
        <p style={{ fontSize: '16px', marginBottom: '16px' }}>
          Migration çalıştırıldı! Şimdi Gürcistan test sistemini kontrol edelim.
        </p>
        <button
          onClick={runDatabaseDebug}
          style={{
            backgroundColor: '#fbbf24',
            color: 'black',
            padding: '16px 32px',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: 'bold',
            border: '2px solid black',
            cursor: 'pointer',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
          }}
        >
          🔍 GÜRCİSTAN SİSTEMİNİ KONTROL ET!
        </button>
        <p style={{ fontSize: '14px', marginTop: '8px' }}>
          Console'u açık tutun ve bu butona tıklayın!
        </p>
        <p style={{ fontSize: '12px', marginTop: '4px' }}>
          Consultant ID: {consultantId} | Current Clients: {clients.length}
        </p>
      </div>

      <div className="space-y-6" style={{ marginTop: '200px' }}>
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
                onClick={loadData}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Country Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {countries.map(country => {
              const countryClients = clients.filter(c => c.client_country?.id === country.id);
              const totalRevenue = countryClients.reduce((sum, client) => {
                return sum + getClientStats(client).revenue;
              }, 0);
              const activeClients = countryClients.filter(c => 
                getClientStats(c).active > 0
              ).length;

              return (
                <div key={country.id} className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-2xl">{country.flag_emoji}</span>
                        <span className="font-semibold text-blue-900">{country.name}</span>
                      </div>
                      <p className="text-sm text-blue-700">{countryClients.length} toplam müşteri</p>
                      <p className="text-sm text-blue-700">{activeClients} aktif proje</p>
                      <p className="text-lg font-bold text-blue-900">{formatCurrency(totalRevenue)}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Müşteri ara (ad, email, şirket)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                <option value="all">Tüm Ülkeler</option>
                {countries.map(country => (
                  <option key={country.id} value={country.id}>
                    {country.flag_emoji} {country.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Client List */}
          <div className="space-y-4">
            {filteredClients.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Müşteri Bulunamadı</h3>
                <p className="text-gray-600 mb-4">Bu kriterlere uygun müşteri bulunamadı.</p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-yellow-800 text-sm">
                    <strong>Debug Bilgisi:</strong><br/>
                    Consultant ID: {consultantId}<br/>
                    Toplam müşteri: {clients.length}<br/>
                    Ülke sayısı: {countries.length}<br/>
                    Loading: {loading ? 'true' : 'false'}
                  </p>
                  <button
                    onClick={runDatabaseDebug}
                    className="mt-3 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 font-medium"
                  >
                    🔍 Debug Çalıştır
                  </button>
                </div>
              </div>
            ) : (
              filteredClients.map((client) => {
                const stats = getClientStats(client);
                
                return (
                  <div
                    key={client.id}
                    className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        {/* Client Avatar */}
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl">{client.client_country?.flag_emoji || '🇬🇪'}</span>
                        </div>

                        {/* Client Info */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">
                              {client.first_name} {client.last_name}
                            </h3>
                            {client.company_name && (
                              <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                                {client.company_name}
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-gray-600">
                                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                {client.email}
                              </div>
                              {client.phone && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                  {client.phone}
                                </div>
                              )}
                              <div className="flex items-center text-sm text-gray-600">
                                <Globe className="h-4 w-4 mr-2 text-gray-400" />
                                {client.client_country?.name || 'Georgia'} • Dil: {client.language?.toUpperCase()}
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
                                Müşteri: {new Date(client.created_at).toLocaleDateString('tr-TR')}
                              </div>
                              {stats.avgSatisfaction > 0 && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <Star className="h-4 w-4 mr-2 text-yellow-500" />
                                  Memnuniyet: {stats.avgSatisfaction.toFixed(1)}/5
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Client Stats */}
                          <div className="grid grid-cols-4 gap-4 mb-4">
                            <div className="text-center bg-blue-50 rounded-lg p-3">
                              <div className="text-lg font-bold text-blue-900">{stats.total}</div>
                              <div className="text-xs text-blue-700">Toplam Proje</div>
                            </div>
                            <div className="text-center bg-green-50 rounded-lg p-3">
                              <div className="text-lg font-bold text-green-900">{stats.active}</div>
                              <div className="text-xs text-green-700">Aktif Proje</div>
                            </div>
                            <div className="text-center bg-purple-50 rounded-lg p-3">
                              <div className="text-lg font-bold text-purple-900">{stats.completed}</div>
                              <div className="text-xs text-purple-700">Tamamlanan</div>
                            </div>
                            <div className="text-center bg-orange-50 rounded-lg p-3">
                              <div className="text-lg font-bold text-orange-900">
                                {formatCurrency(stats.revenue)}
                              </div>
                              <div className="text-xs text-orange-700">Toplam Gelir</div>
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

                    {/* Recent Applications Preview */}
                    {client.applications && client.applications.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Projeler:</h4>
                        <div className="space-y-2">
                          {client.applications.map((app: any) => (
                            <div key={app.id} className="flex items-center justify-between text-sm bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center space-x-3">
                                <span className="text-lg">{app.service_country?.flag_emoji || '🇬🇪'}</span>
                                <div>
                                  <span className="font-medium text-gray-900">{getServiceTypeLabel(app.service_type)}</span>
                                  <div className="text-xs text-gray-500">
                                    {new Date(app.created_at).toLocaleDateString('tr-TR')}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                                  {getStatusLabel(app.status)}
                                </span>
                                <span className="text-gray-600 font-medium">
                                  {formatCurrency(app.total_amount, app.currency)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Quick Actions for Georgia Consultant */}
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
      </div>

      {/* Client Details Modal */}
      {showClientDetails && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="text-2xl mr-3">{selectedClient.client_country?.flag_emoji || '🇬🇪'}</span>
                {selectedClient.first_name} {selectedClient.last_name} - Detaylar
              </h3>
              <button
                onClick={() => setShowClientDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Client Information */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Müşteri Bilgileri</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Ad Soyad:</strong> {selectedClient.first_name} {selectedClient.last_name}</div>
                    <div><strong>Email:</strong> {selectedClient.email}</div>
                    <div><strong>Şirket:</strong> {selectedClient.company_name || 'Belirtilmemiş'}</div>
                    <div><strong>İş Türü:</strong> {selectedClient.business_type || 'Belirtilmemiş'}</div>
                    <div><strong>Dil:</strong> {selectedClient.language?.toUpperCase()}</div>
                    <div><strong>Ülke:</strong> {selectedClient.client_country?.name || 'Georgia'}</div>
                    <div><strong>Müşteri Tarihi:</strong> {new Date(selectedClient.created_at).toLocaleDateString('tr-TR')}</div>
                  </div>
                </div>

                {/* Client Stats */}
                <div className="bg-blue-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Proje İstatistikleri</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {(() => {
                      const stats = getClientStats(selectedClient);
                      return (
                        <>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
                            <div className="text-sm text-blue-700">Toplam Proje</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-900">{stats.active}</div>
                            <div className="text-sm text-green-700">Aktif</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-900">{stats.completed}</div>
                            <div className="text-sm text-purple-700">Tamamlanan</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-900">{formatCurrency(stats.revenue)}</div>
                            <div className="text-sm text-orange-700">Toplam Gelir</div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Applications List */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Tüm Projeler</h4>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {selectedClient.applications?.map((app: any) => (
                    <div key={app.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{getServiceTypeLabel(app.service_type)}</h5>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                          {getStatusLabel(app.status)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>Tutar: {formatCurrency(app.total_amount, app.currency)}</div>
                        <div>Başlangıç: {new Date(app.created_at).toLocaleDateString('tr-TR')}</div>
                        {app.estimated_completion && (
                          <div>Tahmini Bitiş: {new Date(app.estimated_completion).toLocaleDateString('tr-TR')}</div>
                        )}
                        <div>Öncelik: {app.priority_level}</div>
                      </div>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-center py-4">Proje bulunamadı</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CountryBasedClients;
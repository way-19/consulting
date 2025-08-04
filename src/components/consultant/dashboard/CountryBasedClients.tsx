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
  // IMMEDIATE DEBUG LOGS
  console.log('🚨🚨🚨 CountryBasedClients component loaded!');
  console.log('🚨🚨🚨 Consultant ID:', consultantId);
  
  const [clients, setClients] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [showClientDetails, setShowClientDetails] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  // SUPER VISIBLE DEBUG FUNCTION
  const checkDatabaseData = async () => {
    console.log('🚨🚨🚨 =================================');
    console.log('🚨🚨🚨 MANUAL DATABASE CHECK STARTING');
    console.log('🚨🚨🚨 Current consultant ID:', consultantId);
    console.log('🚨🚨🚨 =================================');
    
    try {
      // Check if consultant exists
      const { data: consultant, error: consultantError } = await supabase
        .from('users')
        .select('*')
        .eq('id', consultantId)
        .maybeSingle();
      
      console.log('👤 =================================');
      console.log('👤 CONSULTANT IN DB:', consultant);
      console.log('👤 CONSULTANT ERROR:', consultantError);
      console.log('👤 =================================');
      
      // Check applications for this specific consultant
      const { data: consultantApps, error: appsError } = await supabase
        .from('applications')
        .select('*')
        .eq('consultant_id', consultantId);
      
      console.log('📋 =================================');
      console.log('📋 APPLICATIONS FOR THIS CONSULTANT:');
      console.log('📋 Data:', consultantApps);
      console.log('📋 Count:', consultantApps?.length || 0);
      console.log('📋 Error:', appsError);
      console.log('📋 =================================');
      
      // Check all applications
      const { data: allApps } = await supabase
        .from('applications')
        .select('*');
      
      console.log('📋 =================================');
      console.log('📋 ALL APPLICATIONS IN DB:');
      console.log('📋 Data:', allApps);
      console.log('📋 Count:', allApps?.length || 0);
      console.log('📋 =================================');
      
      // Check all users
      const { data: allUsers } = await supabase
        .from('users')
        .select('id, first_name, last_name, role, email');
      
      console.log('👥 =================================');
      console.log('👥 ALL USERS IN DB:');
      console.log('👥 Data:', allUsers);
      console.log('👥 Count:', allUsers?.length || 0);
      console.log('👥 Consultants:', allUsers?.filter(u => u.role === 'consultant'));
      console.log('👥 Clients:', allUsers?.filter(u => u.role === 'client'));
      console.log('👥 =================================');
      
      // Check consultant assignments
      const { data: assignments } = await supabase
        .from('consultant_country_assignments')
        .select('*')
        .eq('consultant_id', consultantId);
      
      console.log('🌍 =================================');
      console.log('🌍 CONSULTANT ASSIGNMENTS:');
      console.log('🌍 Data:', assignments);
      console.log('🌍 Count:', assignments?.length || 0);
      console.log('🌍 =================================');
      
      // Check localStorage user
      const localUser = localStorage.getItem('user');
      console.log('💾 =================================');
      console.log('💾 LOCALSTORAGE USER:');
      console.log('💾 Raw:', localUser);
      console.log('💾 Parsed:', localUser ? JSON.parse(localUser) : null);
      console.log('💾 =================================');

      // Set debug info for display
      setDebugInfo({
        consultant,
        consultantApps,
        allApps,
        allUsers,
        assignments,
        localUser: localUser ? JSON.parse(localUser) : null
      });
      
    } catch (error) {
      console.error('🚨 Database check error:', error);
    }
  };

  useEffect(() => {
    console.log('🔄 useEffect triggered for loadData');
    loadData();
  }, [consultantId]);

  const loadData = async () => {
    try {
      console.log('🔍 loadData function started');
      console.log('🔍 =================================');
      console.log('🔍 STARTING LOAD DATA FOR CONSULTANT');
      console.log('🔍 Consultant ID:', consultantId);
      console.log('🔍 =================================');
      
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
      {/* SUPER VISIBLE DEBUG BUTTON - ABSOLUTE FIRST ELEMENT */}
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
        maxWidth: '500px',
        width: '90%'
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
          🚨 DEBUG ZONE 🚨
        </h2>
        <p style={{ fontSize: '16px', marginBottom: '16px' }}>
          Migration çalıştı ama müşteri görünmüyor!
        </p>
        <button
          onClick={checkDatabaseData}
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
          🔍 VERİTABANI KONTROL ET (TIKLA!)
        </button>
        <p style={{ fontSize: '14px', marginTop: '8px' }}>
          Console'u açık tutun ve bu butona tıklayın!
        </p>
        <p style={{ fontSize: '12px', marginTop: '4px' }}>
          Consultant ID: {consultantId} | Clients: {clients.length}
        </p>
      </div>

    <>
      {/* SUPER VISIBLE DEBUG BUTTON - ABSOLUTE FIRST ELEMENT */}
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
        maxWidth: '500px',
        width: '90%'
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
          🚨 DEBUG ZONE 🚨
        </h2>
        <p style={{ fontSize: '16px', marginBottom: '16px' }}>
          Migration çalıştı ama müşteri görünmüyor!
        </p>
        <button
          onClick={checkDatabaseData}
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
          🔍 VERİTABANI KONTROL ET (TIKLA!)
        </button>
        <p style={{ fontSize: '14px', marginTop: '8px' }}>
          Console'u açık tutun ve bu butona tıklayın!
        </p>
        <p style={{ fontSize: '12px', marginTop: '4px' }}>
          Consultant ID: {consultantId} | Clients: {clients.length}
        </p>
      </div>

    <div className="space-y-6">
      {/* Main Client Management */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100" style={{ marginTop: '200px' }}>
        position: 'fixed',
        top: '80px',
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
        maxWidth: '500px',
        width: '90%'
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
          🚨 DEBUG ZONE 🚨
        </h2>
        <p style={{ fontSize: '16px', marginBottom: '16px' }}>
          Migration çalıştı ama müşteri görünmüyor!
        </p>
        <button
          onClick={checkDatabaseData}
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
          🔍 VERİTABANI KONTROL ET (TIKLA!)
        </button>
        <p style={{ fontSize: '14px', marginTop: '8px' }}>
          Console'u açık tutun ve bu butona tıklayın!
        </p>
        <p style={{ fontSize: '12px', marginTop: '4px' }}>
          Consultant ID: {consultantId} | Clients: {clients.length}
        </p>
      </div>

      {/* Debug Info Display */}
      {debugInfo && (
        <div className="bg-yellow-100 border-4 border-yellow-500 rounded-xl p-6" style={{ marginTop: '200px' }}>
          <h3 className="text-xl font-bold text-yellow-900 mb-4">Debug Bilgileri:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-bold">Consultant:</h4>
              <p>{debugInfo.consultant ? 'BULUNDU ✅' : 'BULUNAMADI ❌'}</p>
              {debugInfo.consultant && (
                <p>{debugInfo.consultant.first_name} {debugInfo.consultant.last_name}</p>
              )}
            </div>
            <div>
              <h4 className="font-bold">Applications:</h4>
              <p>Bu consultant için: {debugInfo.consultantApps?.length || 0}</p>
              <p>Toplam DB'de: {debugInfo.allApps?.length || 0}</p>
            </div>
            <div>
              <h4 className="font-bold">Users:</h4>
              <p>Toplam: {debugInfo.allUsers?.length || 0}</p>
              <p>Consultants: {debugInfo.allUsers?.filter((u: any) => u.role === 'consultant').length || 0}</p>
              <p>Clients: {debugInfo.allUsers?.filter((u: any) => u.role === 'client').length || 0}</p>
            </div>
            <div>
              <h4 className="font-bold">Assignments:</h4>
              <p>{debugInfo.assignments?.length || 0} ülke ataması</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Client Management */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100" style={{ marginTop: debugInfo ? '0' : '200px' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Users className="h-6 w-6 mr-3 text-blue-600" />
            Ülke Bazlı Müşteri Yönetimi
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
              <h3 className="text-xl font-bold text-red-600 mb-4">🚨 MÜŞTERI BULUNAMADI!</h3>
              <p className="text-sm text-gray-500 mt-2">
                Yeni müşteriler atandığında burada görünecekler.
              </p>
              <div className="mt-4 p-6 bg-red-100 border-4 border-red-500 rounded-xl">
                <p className="text-red-800 font-bold">DEBUG BİLGİSİ:</p>
                <p className="text-red-700">Consultant ID: {consultantId}</p>
                <p className="text-red-700">Toplam müşteri: {clients.length}</p>
                <p className="text-red-700">Ülke sayısı: {countries.length}</p>
                <p className="text-red-700">Loading: {loading ? 'true' : 'false'}</p>
                <button
                  onClick={() => {
                    console.log('🔄 Manual reload triggered');
                    loadData();
                  }}
                  className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-bold"
                >
                  🔄 MANUEL YENİLE
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
                        <span className="text-2xl">{client.client_country?.flag_emoji || '🌍'}</span>
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
                              {client.client_country?.name} • Dil: {client.language?.toUpperCase()}
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
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Son Projeler:</h4>
                      <div className="space-y-2">
                        {client.applications.slice(0, 3).map((app: any) => (
                          <div key={app.id} className="flex items-center justify-between text-sm bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center space-x-3">
                              <span className="text-lg">{app.service_country?.flag_emoji}</span>
                              <div>
                                <span className="font-medium text-gray-900">{app.service_type}</span>
                                <div className="text-xs text-gray-500">
                                  {new Date(app.created_at).toLocaleDateString('tr-TR')}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                app.status === 'completed' ? 'bg-green-100 text-green-800' :
                                app.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {app.status === 'completed' ? 'Tamamlandı' :
                                 app.status === 'in_progress' ? 'Devam Ediyor' :
                                 'Bekliyor'}
                              </span>
                              <span className="text-gray-600 font-medium">
                                {formatCurrency(app.total_amount, app.currency)}
                              </span>
                            </div>
                          </div>
                        ))}
                        {client.applications.length > 3 && (
                          <div className="text-center">
                            <button
                              onClick={() => {
                                setSelectedClient(client);
                                setShowClientDetails(true);
                              }}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              +{client.applications.length - 3} proje daha...
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
    </>
    </>
  );
};

export default CountryBasedClients;
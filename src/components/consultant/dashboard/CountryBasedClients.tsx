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

  useEffect(() => {
    loadData();
  }, [consultantId]);

  const loadData = async () => {
    try {
      console.log('🔍 Starting loadData for consultant:', consultantId);
      console.log('🔍 Consultant ID type:', typeof consultantId, 'Value:', consultantId);
      
      // Load consultant's assigned countries
      const { data: assignedCountries, error: countriesError } = await supabase
        .from('consultant_country_assignments')
        .select(`
          countries!consultant_country_assignments_country_id_fkey(id, name, flag_emoji)
        `)
        .eq('consultant_id', consultantId)
        .eq('status', true);

      console.log('🌍 Countries query result:', { data: assignedCountries, error: countriesError });
      
      if (countriesError) {
        console.error('Error loading assigned countries:', countriesError);
        console.log('🔍 Will try to load clients anyway...');
      }

      const countryList = assignedCountries?.map(ac => ac.countries).filter(Boolean) || [];
      console.log('🌍 Final country list:', countryList);
      setCountries(countryList);

      // Check if consultant exists in database
      const { data: consultantCheck, error: consultantError } = await supabase
        .from('users')
        .select('id, first_name, last_name, role')
        .eq('id', consultantId)
        .eq('role', 'consultant')
        .maybeSingle();
      
      console.log('👤 Consultant check:', { data: consultantCheck, error: consultantError });

      if (!consultantCheck) {
        console.error('❌ Consultant not found in database with ID:', consultantId);
        alert('Danışman veritabanında bulunamadı. Lütfen giriş yapın.');
        return;
      }

      // Load clients assigned to this consultant
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
      
      console.log('📋 Applications query result:', { data: applicationsData, error: appsError });
      console.log('📋 Raw applications data:', applicationsData);
      
      if (appsError) {
        console.error('Error loading applications:', appsError);
        console.log('🔍 Applications error, but continuing...');
      } else {
        console.log('Applications data loaded:', applicationsData);
        
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
        console.log('👥 Client count:', uniqueClients.length);
        
        if (uniqueClients.length === 0) {
          console.log('❌ No clients found. Checking if applications exist...');
          console.log('📋 Applications data was:', applicationsData);
          console.log('📋 Applications with clients:', applicationsData?.filter(app => app.client));
        }
        
        setClients(uniqueClients);
      }
      
      // Final debug summary
      console.log('📊 Load data summary:', {
        consultantId,
        countriesFound: countryList.length,
        applicationsFound: applicationsData?.length || 0,
        uniqueClientsFound: Array.from(new Map(applicationsData?.filter(app => app.client).map(app => [app.client.id, app.client]) || []).values()).length
      });
      
    } catch (error) {
      console.error('Error loading data:', error);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  // Add a manual data check function
  const checkDatabaseData = async () => {
    console.log('🔍 Manual database check starting...');
    console.log('🔍 Current consultant ID:', consultantId);
    
    try {
      // Check if consultant exists
      const { data: consultant } = await supabase
        .from('users')
        .select('*')
        .eq('id', consultantId)
        .maybeSingle();
      console.log('👤 Consultant in DB:', consultant);
      
      // Check applications for this specific consultant
      const { data: consultantApps } = await supabase
        .from('applications')
        .select('*')
        .eq('consultant_id', consultantId);
      console.log('📋 Applications for this consultant:', consultantApps);
      
      // Check all applications
      const { data: allApps } = await supabase
        .from('applications')
        .select('*');
      console.log('📋 All applications in DB:', allApps);
      
      // Check all users
      const { data: allUsers } = await supabase
        .from('users')
        .select('id, first_name, last_name, role, email');
      console.log('👥 All users in DB:', allUsers);
      
      // Check consultant assignments
      const { data: assignments } = await supabase
        .from('consultant_country_assignments')
        .select('*')
        .eq('consultant_id', consultantId);
      console.log('🌍 All assignments in DB:', assignments);
      
      // Check if Georgia country exists
      const { data: georgiaCountry } = await supabase
        .from('countries')
        .select('*')
        .eq('slug', 'georgia');
      console.log('🇬🇪 Georgia country in DB:', georgiaCountry);
      
    } catch (error) {
      console.error('Database check error:', error);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Tamamlandı';
      case 'in_progress': return 'Devam Ediyor';
      case 'pending': return 'Bekliyor';
      case 'cancelled': return 'İptal';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'normal': return 'text-blue-600';
      case 'low': return 'text-gray-600';
      default: return 'text-gray-600';
    }
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
    <div className="space-y-6">
      {/* Main Client Management */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
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
              onClick={checkDatabaseData}
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 font-medium"
            >
              🔍 Veritabanı Kontrol
            </button>
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
              <p className="text-gray-600">Bu kriterlere uygun müşteri bulunamadı.</p>
              <p className="text-sm text-gray-500 mt-2">
                Yeni müşteriler atandığında burada görünecekler.
              </p>
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
                        <span className="text-2xl">{client.countries?.flag_emoji || '🌍'}</span>
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
                              {client.countries?.name} • Dil: {client.language?.toUpperCase()}
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
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                                {getStatusLabel(app.status)}
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

      {/* Client Details Modal */}
      {showClientDetails && selectedClient && (
        <ClientDetailsModal
          client={selectedClient}
          onClose={() => {
            setShowClientDetails(false);
            setSelectedClient(null);
          }}
          consultantId={consultantId}
        />
      )}
    </div>
  );
};

// Client Details Modal Component
const ClientDetailsModal: React.FC<{
  client: any;
  onClose: () => void;
  consultantId: string;
}> = ({ client, onClose, consultantId }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [clientDocuments, setClientDocuments] = useState<any[]>([]);
  const [clientMessages, setClientMessages] = useState<any[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClientDetails();
  }, [client.id]);

  const loadClientDetails = async () => {
    try {
      // Load client documents
      const { data: docsData } = await supabase
        .from('client_documents')
        .select('*')
        .eq('client_id', client.id)
        .order('created_at', { ascending: false });

      // Load client messages
      const { data: messagesData } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${client.id},recipient_id.eq.${client.id}`)
        .order('created_at', { ascending: false })
        .limit(10);

      // Load payment history
      const { data: paymentsData } = await supabase
        .from('payments')
        .select(`
          *,
          application:applications(service_type, countries!applications_service_country_id_fkey(name, flag_emoji))
        `)
        .eq('application_id', client.applications?.[0]?.id)
        .order('created_at', { ascending: false });

      setClientDocuments(docsData || []);
      setClientMessages(messagesData || []);
      setPaymentHistory(paymentsData || []);
    } catch (error) {
      console.error('Error loading client details:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: client.applications?.length || 0,
    active: client.applications?.filter((app: any) => ['pending', 'in_progress'].includes(app.status)).length || 0,
    completed: client.applications?.filter((app: any) => app.status === 'completed').length || 0,
    revenue: client.applications?.reduce((sum: number, app: any) => sum + parseFloat(app.total_amount || 0), 0) || 0
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Tamamlandı';
      case 'in_progress': return 'Devam Ediyor';
      case 'pending': return 'Bekliyor';
      case 'cancelled': return 'İptal';
      default: return status;
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-3xl">{client.countries?.flag_emoji || '🌍'}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {client.first_name} {client.last_name}
                </h2>
                <p className="text-gray-600">{client.email}</p>
                {client.company_name && (
                  <p className="text-sm text-purple-600 font-medium">{client.company_name}</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mt-4">
            <div className="text-center bg-white rounded-lg p-3">
              <div className="text-xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-xs text-gray-600">Toplam Proje</div>
            </div>
            <div className="text-center bg-white rounded-lg p-3">
              <div className="text-xl font-bold text-blue-900">{stats.active}</div>
              <div className="text-xs text-blue-700">Aktif</div>
            </div>
            <div className="text-center bg-white rounded-lg p-3">
              <div className="text-xl font-bold text-green-900">{stats.completed}</div>
              <div className="text-xs text-green-700">Tamamlanan</div>
            </div>
            <div className="text-center bg-white rounded-lg p-3">
              <div className="text-xl font-bold text-purple-900">
                {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'USD' }).format(stats.revenue)}
              </div>
              <div className="text-xs text-purple-700">Toplam Gelir</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { key: 'overview', label: 'Genel Bakış', icon: User },
              { key: 'projects', label: 'Projeler', icon: Building2 },
              { key: 'documents', label: 'Belgeler', icon: FileText },
              { key: 'messages', label: 'Mesajlar', icon: MessageSquare },
              { key: 'payments', label: 'Ödemeler', icon: CreditCard }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Müşteri Bilgileri</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ad Soyad:</span>
                    <span className="font-medium">{client.first_name} {client.last_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">E-posta:</span>
                    <span className="font-medium">{client.email}</span>
                  </div>
                  {client.company_name && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Şirket:</span>
                      <span className="font-medium">{client.company_name}</span>
                    </div>
                  )}
                  {client.business_type && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">İş Türü:</span>
                      <span className="font-medium">{client.business_type}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ülke:</span>
                    <span className="font-medium">{client.client_country?.flag_emoji} {client.client_country?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dil:</span>
                    <span className="font-medium">{client.language?.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kayıt Tarihi:</span>
                    <span className="font-medium">{new Date(client.created_at).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Proje Özeti</h3>
                <div className="space-y-4">
                  {client.applications?.slice(0, 3).map((app: any) => (
                    <div key={app.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{app.service_type}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          app.status === 'completed' ? 'bg-green-100 text-green-800' :
                          app.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {app.status === 'completed' ? 'Tamamlandı' :
                           app.status === 'in_progress' ? 'Devam Ediyor' :
                           'Bekliyor'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{new Date(app.created_at).toLocaleDateString('tr-TR')}</span>
                        <span className="font-medium">{formatCurrency(app.total_amount, app.currency)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Tüm Projeler</h3>
              {client.applications?.map((app: any) => (
                <div key={app.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{app.service_country?.flag_emoji}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900">{app.service_type}</h4>
                        <p className="text-sm text-gray-600">
                          Başlangıç: {new Date(app.created_at).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">
                        {formatCurrency(app.total_amount, app.currency)}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                        {getStatusLabel(app.status)}
                      </span>
                    </div>
                  </div>
                  
                  {app.estimated_completion && (
                    <div className="text-sm text-gray-600 mb-2">
                      Tahmini Tamamlanma: {new Date(app.estimated_completion).toLocaleDateString('tr-TR')}
                    </div>
                  )}
                  
                  {app.priority_level !== 'normal' && (
                    <div className={`text-sm font-medium ${
                      app.priority_level === 'urgent' ? 'text-red-600' :
                      app.priority_level === 'high' ? 'text-orange-600' :
                      'text-blue-600'
                    }`}>
                      Öncelik: {app.priority_level === 'urgent' ? 'Acil' :
                                app.priority_level === 'high' ? 'Yüksek' :
                                'Normal'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Other tabs content would go here */}
          {activeTab !== 'overview' && activeTab !== 'projects' && (
            <div className="text-center py-8">
              <div className="text-gray-500">Bu sekme yakında aktif olacak.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CountryBasedClients;
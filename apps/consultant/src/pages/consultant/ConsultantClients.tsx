import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  Users, 
  Plus, 
  Search,
  Filter,
  Eye,
  Edit,
  MessageSquare,
  Calendar,
  User,
  Building,
  Star,
  CheckCircle,
  Clock,
  AlertTriangle,
  BarChart3,
  TrendingUp,
  MoreVertical,
  Eye,
  Edit,
  Mail,
  FileText
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface Client {
  id: string;
  profile_id: string;
  company_name?: string;
  status: string;
  priority: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  profile: {
    full_name: string;
    email: string;
    phone?: string;
    preferred_language?: string;
    timezone?: string;
  };
  performance_metrics?: {
    overall_score: number;
    communication_score: number;
    payment_score: number;
    engagement_score: number;
    total_revenue: number;
    last_activity_date: string;
  };
}

interface ClientStats {
  total: number;
  active: number;
  highPriority: number;
  avgPerformance: number;
  totalRevenue: number;
  activeProjects: number;
}

const ConsultantClients = () => {
  const { user, profile } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [clientStats, setClientStats] = useState<ClientStats>({
    total: 0,
    active: 0,
    highPriority: 0,
    avgPerformance: 0,
    totalRevenue: 0,
    activeProjects: 0
  });
  
  // Fixed: Add missing financialInsights state
  const [financialInsights, setFinancialInsights] = useState<any>({});
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    if (user && profile) {
      fetchClients();
    }
  }, [user, profile]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      
      const { data: clientsData, error } = await supabase
        .from('clients')
        .select(`
          *,
          profile:user_profiles!clients_profile_id_fkey(
            full_name, email, phone, preferred_language, timezone
          )
        `)
        .eq('assigned_consultant_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching clients:', error);
        return;
      }

      // Enrich with performance metrics
      const enrichedClients = await Promise.all(
        (clientsData || []).map(async (client) => {
          try {
            const { data: performanceData } = await supabase
              .from('client_performance_metrics')
              .select('*')
              .eq('client_id', client.id)
              .eq('consultant_id', user?.id)
              .maybeSingle();

            return {
              ...client,
              performance_metrics: performanceData
            };
          } catch (err) {
            console.error('Error fetching performance metrics for client:', err);
            return client;
          }
        })
      );

      setClients(enrichedClients);
      calculateClientStats(enrichedClients);
      
      // Fixed: Set financial insights (empty object if no specific insights)
      setFinancialInsights({
        totalRevenue: enrichedClients.reduce((sum, client) => 
          sum + (client.performance_metrics?.total_revenue || 0), 0
        ),
        avgClientValue: enrichedClients.length > 0 
          ? enrichedClients.reduce((sum, client) => 
              sum + (client.performance_metrics?.total_revenue || 0), 0
            ) / enrichedClients.length
          : 0
      });
      
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateClientStats = (clientsData: Client[]) => {
    const stats = {
      total: clientsData.length,
      active: clientsData.filter(c => c.status === 'active').length,
      highPriority: clientsData.filter(c => c.priority === 'high').length,
      avgPerformance: clientsData.length > 0 
        ? clientsData.reduce((sum, c) => sum + (c.performance_metrics?.overall_score || 0), 0) / clientsData.length
        : 0,
      totalRevenue: clientsData.reduce((sum, c) => sum + (c.performance_metrics?.total_revenue || 0), 0),
      activeProjects: 0 // Mock for now
    };
    
    setClientStats(stats);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.profile.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.profile.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || client.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (loading) {
    return (
      <>
        <Helmet>
          <title>My Clients - Consultant Dashboard</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Clients - Consultant Dashboard</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Clients</h1>
            <p className="text-gray-600 mt-1">Manage and track your client relationships</p>
          </div>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Add Client
          </button>
        </div>

        {/* Client Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clients</p>
                <p className="text-3xl font-bold text-gray-900">{clientStats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Clients</p>
                <p className="text-3xl font-bold text-green-600">{clientStats.active}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-3xl font-bold text-red-600">{clientStats.highPriority}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Performance</p>
                <p className="text-3xl font-bold text-purple-600">{clientStats.avgPerformance.toFixed(0)}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>

        {/* Client List */}
        {filteredClients.length > 0 ? (
          <div className="space-y-4">
            {filteredClients.map((client) => (
              <div key={client.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                {/* Header */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{client.profile.full_name}</h3>
                    <p className="text-sm text-gray-600">{client.company_name || 'Gonzalez Consulting SL'}</p>
                    <div className="flex items-center space-x-3 text-sm text-gray-500 mt-1">
                      <span>📧 {client.profile.email}</span>
                      <span>🇬🇪 Georgia</span>
                      <span>🇺🇸 {client.profile.preferred_language?.toUpperCase() || 'EN'}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <button 
                      onClick={() => alert('More options menu')}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Stats Row - Resimde görüldüğü gibi */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">
                      1
                    </div>
                    <div className="text-xs text-blue-700">Active Projects</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="text-2xl font-bold text-orange-600">
                      3
                    </div>
                    <div className="text-xs text-orange-700">Pending Tasks</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-2xl font-bold text-green-600">
                      $0
                    </div>
                    <div className="text-xs text-green-700">Total Spent</div>
                  </div>
                </div>

                {/* Status Dropdowns - Resimde görüldüğü gibi */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <select 
                    value={client.status} 
                    onChange={(e) => {
                      alert(`Status changing to ${e.target.value} for ${client.profile.full_name}`);
                    }}
                    className="px-3 py-2 rounded-lg border border-green-300 bg-green-100 text-green-800 text-sm font-medium"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                  <select 
                    value={client.priority}
                    onChange={(e) => {
                      alert(`Priority changing to ${e.target.value} for ${client.profile.full_name}`);
                    }}
                    className="px-3 py-2 rounded-lg border border-orange-300 bg-orange-100 text-orange-800 text-sm font-medium"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                {/* Action Buttons - Resimde görüldüğü gibi 2 satır */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button
                    onClick={() => alert(`Viewing profile for ${client.profile.full_name}`)}
                    className="flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Profile
                  </button>
                  <button 
                    onClick={() => alert(`Creating task for ${client.profile.full_name}`)}
                    className="flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Target className="w-4 h-4 mr-1" />
                    Create Task
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => alert(`Sending message to ${client.profile.full_name}`)}
                    className="flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    <Mail className="w-4 h-4 mr-1" />
                    Message
                  </button>
                  <button
                    onClick={() => alert(`Viewing documents for ${client.profile.full_name}`)}
                    className="flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    Documents
                  </button>
                </div>
              </div>
                >
                  <Target className="w-4 h-4 mr-2" />
                  Create Task
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'No clients match your filters'
                : 'No clients assigned yet'
              }
            </h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'Try adjusting your search terms or filters'
                : 'Clients will be assigned to you by the admin team'
              }
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default ConsultantClients;
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Plus, 
  Search,
  User,
  Building,
  Globe,
  CheckCircle,
  Clock,
  AlertTriangle,
  BarChart3,
  TrendingUp,
  MoreVertical,
  Eye,
  Edit,
  Mail,
  FileText,
  Target,
  X,
  CreditCard,
  DollarSign
} from 'lucide-react';
import { supabase } from '@consulting19/shared/supabase';

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
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [clientStats, setClientStats] = useState<ClientStats>({
    total: 0,
    active: 0,
    highPriority: 0,
    avgPerformance: 0,
    totalRevenue: 0,
    activeProjects: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [feeData, setFeeData] = useState({
    type: 'accounting_fee',
    amount: 0,
    description: '',
    due_date: ''
  });
  const [creatingFee, setCreatingFee] = useState(false);

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

  const handleCreateManualFee = (client: Client) => {
    setSelectedClient(client);
    setShowFeeModal(true);
  };

  const submitManualFee = async () => {
    if (!selectedClient || !feeData.amount || !feeData.description) return;

    try {
      setCreatingFee(true);
      
      // Create invoice
      const { error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          client_id: selectedClient.id,
          amount_due: feeData.amount,
          currency: 'USD',
          status: 'pending',
          memo: feeData.description,
          payment_type: feeData.type,
          due_date: feeData.due_date || null,
          created_at: new Date().toISOString()
        });

      if (invoiceError) throw invoiceError;

      // Notify client
      await supabase.functions.invoke('notify', {
        body: {
          recipient_id: selectedClient.profile_id,
          type: 'invoice_created',
          payload: {
            consultant_name: profile?.full_name,
            amount: feeData.amount,
            currency: 'USD',
            description: feeData.description,
            due_date: feeData.due_date
          },
          email_notification: true
        }
      });

      alert('Fee invoice created successfully!');
      setShowFeeModal(false);
      setSelectedClient(null);
    } catch (err: any) {
      console.error('Error creating fee:', err);
      alert('Failed to create fee');
    } finally {
      setCreatingFee(false);
    }
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
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {filteredClients.map((client) => (
              <div key={client.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                {/* Header */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">{client.profile.full_name}</h3>
                    <p className="text-xs text-gray-600 truncate">{client.company_name || 'Individual'}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>📧 {client.profile.email.split('@')[0]}</span>
                      <span>🌍 {client.profile.preferred_language?.toUpperCase() || 'EN'}</span>
                    </div>
                  </div>
                  <div>
                    <button 
                      onClick={() => alert('More options menu')}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center p-2 bg-blue-50 rounded border border-blue-200">
                    <div className="text-lg font-bold text-blue-600">1</div>
                    <div className="text-xs text-blue-700">Projects</div>
                  </div>
                  <div className="text-center p-2 bg-orange-50 rounded border border-orange-200">
                    <div className="text-lg font-bold text-orange-600">3</div>
                    <div className="text-xs text-orange-700">Tasks</div>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded border border-green-200">
                    <div className="text-lg font-bold text-green-600">$0</div>
                    <div className="text-xs text-green-700">Spent</div>
                  </div>
                </div>

                {/* Status Dropdowns */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <select 
                    value={client.status} 
                    onChange={(e) => {
                      alert(`Status changing to ${e.target.value} for ${client.profile.full_name}`);
                    }}
                    className="px-2 py-1 rounded border border-green-300 bg-green-100 text-green-800 text-xs font-medium"
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
                    className="px-2 py-1 rounded border border-orange-300 bg-orange-100 text-orange-800 text-xs font-medium"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-1 mb-2">
                  <button
                    onClick={() => alert(`Client Profile:\n\nName: ${client.profile.full_name}\nEmail: ${client.profile.email}\nPhone: ${client.profile.phone || 'Not provided'}\nCompany: ${client.company_name || 'Individual'}\nLanguage: ${client.profile.preferred_language || 'en'}\nTimezone: ${client.profile.timezone || 'UTC'}\nStatus: ${client.status}\nPriority: ${client.priority}`)}
                    className="flex items-center justify-center px-2 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors text-xs"
                  >
                    <User className="w-3 h-3 mr-1" />
                    Profile
                  </button>
                  <button 
                    onClick={() => navigate('/tasks', { state: { clientFilter: client.id } })}
                    className="flex items-center justify-center px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs"
                  >
                    <Target className="w-3 h-3 mr-1" />
                    Task
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-1">
                  <button
                    onClick={() => navigate('/messages', { state: { selectedClientId: client.profile_id } })}
                    className="flex items-center justify-center px-2 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors text-xs"
                  >
                    <Mail className="w-3 h-3 mr-1" />
                    Message
                  </button>
                  <button
                    onClick={() => handleCreateManualFee(client)}
                    className="flex items-center justify-center px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs"
                  >
                    <DollarSign className="w-3 h-3 mr-1" />
                    Fee
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
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

        {/* Fee Modal */}
        {showFeeModal && selectedClient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Create Fee Invoice for {selectedClient.profile.full_name}
                </h3>
                <button
                  onClick={() => {
                    setShowFeeModal(false);
                    setSelectedClient(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 p-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fee Type
                  </label>
                  <select
                    value={feeData.type}
                    onChange={(e) => setFeeData(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="accounting_fee">Accounting Fee</option>
                    <option value="virtual_office_fee">Virtual Office Fee</option>
                    <option value="tax_payment">Tax Payment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (USD) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={feeData.amount}
                    onChange={(e) => setFeeData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <input
                    type="text"
                    value={feeData.description}
                    onChange={(e) => setFeeData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder={
                      feeData.type === 'accounting_fee' ? 'e.g., Monthly accounting service - January 2025' :
                      feeData.type === 'virtual_office_fee' ? 'e.g., Virtual office service - Q1 2025' :
                      'e.g., Corporate income tax - 2024 fiscal year'
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={feeData.due_date}
                    onChange={(e) => setFeeData(prev => ({ ...prev, due_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {feeData.type === 'accounting_fee' && (
                  <p className="text-xs text-blue-600 mt-1">📊 Monthly accounting service fee</p>
                )}
                {feeData.type === 'virtual_office_fee' && (
                  <p className="text-xs text-purple-600 mt-1">🏢 Virtual office service fee</p>
                )}
                {feeData.type === 'tax_payment' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <h4 className="text-sm font-semibold text-red-900 mb-1">🏛️ Tax Payment Process</h4>
                    <p className="text-xs text-red-800">
                      This creates an invoice for the client's tax obligation. After
import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, MoreVertical, User, Building, Phone, Mail, Calendar, MessageSquare, FileText, Target } from 'lucide-react';
import { useAuth } from '@consulting19/shared';
import { supabase } from '@consulting19/shared/lib/supabase';
import { Link } from 'react-router-dom';

interface Client {
  id: string;
  profile_id: string;
  company_name: string;
  status: 'active' | 'inactive' | 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
  notes: string;
  created_at: string;
  updated_at: string;
  profile: {
    full_name: string;
    email: string;
    phone: string;
  };
  unread_messages: number;
  total_projects: number;
  total_spent: number;
}

const ConsultantClients = () => {
  const { user, profile } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    if (user && profile) {
      fetchClients();
    }
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select(`
          *,
          profile:user_profiles!clients_profile_id_fkey(full_name, email, phone)
        `)
        .eq('assigned_consultant_id', user?.id)
        .order('created_at', { ascending: false });

      if (clientsError) {
        console.error('Error fetching clients:', clientsError);
        return;
      }

      // Enrich with additional stats
      const enrichedClients = await Promise.all(
        (clientsData || []).map(async (client) => {
          // Get unread messages count
          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('sender_id', client.profile_id)
            .eq('receiver_id', user?.id)
            .eq('is_read', false);

          // Get project count
          const { count: projectCount } = await supabase
            .from('projects')
            .select('*', { count: 'exact', head: true })
            .eq('client_id', client.id);

          // Get total spent
          const { data: ordersData } = await supabase
            .from('service_orders')
            .select('total_amount')
            .eq('client_id', client.id)
            .eq('status', 'completed');

          const totalSpent = ordersData?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

          return {
            ...client,
            unread_messages: unreadCount || 0,
            total_projects: projectCount || 0,
            total_spent: totalSpent
          };
        })
      );

      setClients(enrichedClients);
    } catch (err) {
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || client.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
              <p className="text-gray-600">Manage your client relationships and track their progress</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-600">
                Total Clients: <span className="font-semibold">{clients.length}</span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Clients</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Clients Grid */}
        {filteredClients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <div key={client.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {client.profile?.full_name || 'Unknown'}
                        </h3>
                        {client.company_name && (
                          <p className="text-sm text-gray-600">{client.company_name}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {client.unread_messages > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                          {client.unread_messages}
                        </span>
                      )}
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      <span className="truncate">{client.profile?.email}</span>
                    </div>
                    {client.profile?.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        <span>{client.profile.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <Target className="w-4 h-4 mr-2" />
                      <span>{client.total_projects} projects</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span>${client.total_spent.toLocaleString()} spent</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                      {client.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(client.priority)}`}>
                      {client.priority}
                    </span>
                  </div>

                  <div className="flex space-x-2 mb-3">
                    <Link
                      to="/messages"
                      className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
                    >
                      <MessageSquare className="w-4 h-4 mr-1 inline" />
                      Message
                    </Link>
                    <Link
                      to="/tasks"
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center"
                    >
                      <Target className="w-4 h-4 mr-1 inline" />
                      Tasks
                    </Link>
                  </div>
                  
                  <div className="text-xs text-gray-500 text-center">
                    Member since {new Date(client.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No clients assigned yet
            </h3>
            <p className="text-gray-600 mb-6">
              Clients will be automatically assigned to you by the admin team
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">👥 Client Assignment</h4>
              <p className="text-xs text-blue-800">
                New clients are automatically assigned based on your expertise and availability. 
                You'll receive notifications when new clients are assigned to you.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultantClients;
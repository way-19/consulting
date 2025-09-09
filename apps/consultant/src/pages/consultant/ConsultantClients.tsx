import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  User, 
  Building, 
  Phone, 
  Mail, 
  Calendar,
  MapPin,
  Star,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  MessageSquare,
  Target,
  TrendingUp,
  Globe,
  Settings,
  UserPlus,
  FileText,
  DollarSign,
  X,
  Save
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@consulting19/shared/lib/supabase';

interface Client {
  id: string;
  profile_id: string;
  company_name?: string;
  status: 'active' | 'inactive' | 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  created_at: string;
  updated_at: string;
  profile: {
    full_name: string;
    email: string;
    phone?: string;
    preferred_language?: string;
    country_id?: string;
    country?: {
      name: string;
      flag_emoji: string;
    };
  };
  project_stats: {
    total_projects: number;
    active_projects: number;
    completed_projects: number;
  };
  task_stats: {
    total_tasks: number;
    pending_tasks: number;
    completed_tasks: number;
  };
  financial_stats: {
    total_spent: number;
    pending_amount: number;
    last_payment_date?: string;
  };
}

const ConsultantClients = () => {
  const { user, profile } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showClientModal, setShowClientModal] = useState(false);
  const [selectedClientForModal, setSelectedClientForModal] = useState<Client | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedClientForTask, setSelectedClientForTask] = useState<Client | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    due_date: '',
    estimated_hours: 1,
    billable: true,
    is_client_visible: true
  });
  const [creatingTask, setCreatingTask] = useState(false);

  useEffect(() => {
    if (user && profile) {
      fetchClients();
    }
  }, [user, profile, sortBy, sortOrder]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      
      // Fetch clients assigned to this consultant with related data
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select(`
          *,
          profile:user_profiles!clients_profile_id_fkey(
            full_name, email, phone, preferred_language, country_id
          )
        `)
        .eq('assigned_consultant_id', user?.id)
        .order(sortBy, { ascending: sortOrder === 'asc' });

      if (clientsError) {
        console.error('Error fetching clients:', clientsError);
        return;
      }

      // Enrich clients with statistics and country data
      const enrichedClients = await Promise.all(
        (clientsData || []).map(async (client) => {
          try {
            // Fetch country data separately if country_id exists
            let countryData = null;
            if (client.profile?.country_id) {
              const { data: country } = await supabase
                .from('countries')
                .select('name, flag_emoji')
                .eq('id', client.profile.country_id)
                .single();
              countryData = country;
            }

            // Get project statistics
            const [
              { count: totalProjects },
              { count: activeProjects },
              { count: completedProjects }
            ] = await Promise.all([
              supabase.from('projects').select('*', { count: 'exact', head: true }).eq('client_id', client.id),
              supabase.from('projects').select('*', { count: 'exact', head: true }).eq('client_id', client.id).eq('status', 'active'),
              supabase.from('projects').select('*', { count: 'exact', head: true }).eq('client_id', client.id).eq('status', 'completed')
            ]);

            // Get task statistics
            const [
              { count: totalTasks },
              { count: pendingTasks },
              { count: completedTasks }
            ] = await Promise.all([
              supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('client_id', client.id),
              supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('client_id', client.id).in('status', ['todo', 'in_progress']),
              supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('client_id', client.id).eq('status', 'completed')
            ]);

            // Get financial statistics
            const { data: invoicesData } = await supabase
              .from('invoices')
              .select('amount_due, status, paid_at')
              .eq('client_id', client.id);

            const totalSpent = invoicesData?.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount_due, 0) || 0;
            const pendingAmount = invoicesData?.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.amount_due, 0) || 0;
            const lastPayment = invoicesData?.filter(inv => inv.paid_at).sort((a, b) => new Date(b.paid_at!).getTime() - new Date(a.paid_at!).getTime())[0];

            return {
              ...client,
              profile: {
                ...client.profile,
                country: countryData
              },
              project_stats: {
                total_projects: totalProjects || 0,
                active_projects: activeProjects || 0,
                completed_projects: completedProjects || 0
              },
              task_stats: {
                total_tasks: totalTasks || 0,
                pending_tasks: pendingTasks || 0,
                completed_tasks: completedTasks || 0
              },
              financial_stats: {
                total_spent: totalSpent,
                pending_amount: pendingAmount,
                last_payment_date: lastPayment?.paid_at
              }
            };
          } catch (err) {
            console.error('Error enriching client data:', err);
            return {
              ...client,
              project_stats: { total_projects: 0, active_projects: 0, completed_projects: 0 },
              task_stats: { total_tasks: 0, pending_tasks: 0, completed_tasks: 0 },
              financial_stats: { total_spent: 0, pending_amount: 0 }
            };
          }
        })
      );

      setClients(enrichedClients);
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateClientStatus = async (clientId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', clientId);

      if (error) {
        throw error;
      }

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'client_status_updated',
          description: `Updated client status to ${newStatus}`,
          payload: { client_id: clientId, new_status: newStatus }
        });

      // Refresh clients
      fetchClients();
      alert('Client status updated successfully!');
    } catch (err) {
      console.error('Error updating client status:', err);
      alert('Failed to update client status. Please try again.');
    }
  };

  const updateClientPriority = async (clientId: string, newPriority: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .update({ 
          priority: newPriority,
          updated_at: new Date().toISOString()
        })
        .eq('id', clientId);

      if (error) {
        throw error;
      }

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'client_priority_updated',
          description: `Updated client priority to ${newPriority}`,
          payload: { client_id: clientId, new_priority: newPriority }
        });

      // Refresh clients
      fetchClients();
      alert('Client priority updated successfully!');
    } catch (err) {
      console.error('Error updating client priority:', err);
      alert('Failed to update client priority. Please try again.');
    }
  };

  const openClientModal = (client: Client) => {
    setSelectedClientForModal(client);
    setShowClientModal(true);
  };

  const openCreateTaskModal = (client: Client) => {
    setSelectedClientForTask(client);
    setShowTaskModal(true);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      due_date: '',
      estimated_hours: 1,
      billable: true,
      is_client_visible: true
    });
  };

  const handleCreateTask = async () => {
    if (!selectedClientForTask || !newTask.title.trim()) return;

    try {
      setCreatingTask(true);

      const { error } = await supabase
        .from('tasks')
        .insert({
          title: newTask.title.trim(),
          description: newTask.description.trim() || null,
          priority: newTask.priority,
          due_date: newTask.due_date || null,
          estimated_hours: newTask.estimated_hours,
          billable: newTask.billable,
          is_client_visible: newTask.is_client_visible,
          client_id: selectedClientForTask.id,
          assigned_to: user?.id,
          status: 'todo',
          created_by: user?.id
        });

      if (error) {
        throw error;
      }

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'task_created',
          description: `Created task "${newTask.title}" for client ${selectedClientForTask.profile?.full_name}`,
          payload: { 
            client_id: selectedClientForTask.id,
            task_title: newTask.title
          }
        });

      alert('Task created successfully!');
      setShowTaskModal(false);
      setSelectedClientForTask(null);
      fetchClients(); // Refresh to update task stats
    } catch (err) {
      console.error('Error creating task:', err);
      alert('Failed to create task. Please try again.');
    } finally {
      setCreatingTask(false);
    }
  };

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

  const getLanguageFlag = (langCode: string) => {
    const flags: { [key: string]: string } = {
      'en': '🇺🇸',
      'tr': '🇹🇷',
      'pt': '🇵🇹',
      'es': '🇪🇸',
      'de': '🇩🇪',
      'fr': '🇫🇷'
    };
    return flags[langCode] || '🌐';
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.profile?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || client.priority === priorityFilter;
    const matchesCountry = countryFilter === 'all' || client.profile?.country?.name === countryFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCountry;
  });

  const clientStats = {
    total: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    pending: clients.filter(c => c.status === 'pending').length,
    highPriority: clients.filter(c => c.priority === 'high').length
  };

  const countries = [...new Set(clients.map(c => c.profile?.country?.name).filter(Boolean))];

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Clients - Consultant Dashboard</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
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
        <title>Clients - Consultant Dashboard</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Clients</h1>
            <p className="text-gray-600 mt-1">Manage your client relationships and track their progress</p>
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
                <User className="w-6 h-6 text-blue-600" />
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
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{clientStats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
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
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search clients by name, company, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              {countries.length > 0 && (
                <select
                  value={countryFilter}
                  onChange={(e) => setCountryFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Countries</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              )}
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order as 'asc' | 'desc');
                }}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="created_at-desc">Newest First</option>
                <option value="created_at-asc">Oldest First</option>
                <option value="updated_at-desc">Recently Updated</option>
                <option value="priority-desc">High Priority First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Clients Grid */}
        {filteredClients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <div key={client.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Client Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {client.profile?.full_name || 'Unknown Client'}
                        </h3>
                        {client.company_name && (
                          <p className="text-sm text-gray-600 flex items-center">
                            <Building className="w-3 h-3 mr-1" />
                            {client.company_name}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="relative">
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Client Info */}
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
                    {client.profile?.country && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{client.profile.country.flag_emoji} {client.profile.country.name}</span>
                      </div>
                    )}
                    {client.profile?.preferred_language && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Globe className="w-4 h-4 mr-2" />
                        <span>{getLanguageFlag(client.profile.preferred_language)} {client.profile.preferred_language.toUpperCase()}</span>
                      </div>
                    )}
                  </div>

                  {/* Client Statistics */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">{client.project_stats.active_projects}</div>
                      <div className="text-xs text-blue-800">Active Projects</div>
                    </div>
                    <div className="text-center p-2 bg-orange-50 rounded-lg">
                      <div className="text-lg font-bold text-orange-600">{client.task_stats.pending_tasks}</div>
                      <div className="text-xs text-orange-800">Pending Tasks</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">${client.financial_stats.total_spent.toLocaleString()}</div>
                      <div className="text-xs text-green-800">Total Spent</div>
                    </div>
                  </div>

                  {/* Status and Priority */}
                  <div className="flex justify-between items-center mb-4">
                    <select
                      value={client.status}
                      onChange={(e) => updateClientStatus(client.id, e.target.value)}
                      className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(client.status)}`}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </select>
                    <select
                      value={client.priority}
                      onChange={(e) => updateClientPriority(client.id, e.target.value)}
                      className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${getPriorityColor(client.priority)}`}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  {/* Financial Alert */}
                  {client.financial_stats.pending_amount > 0 && (
                    <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-yellow-600" />
                        <span className="text-xs text-yellow-800 font-medium">
                          ${client.financial_stats.pending_amount.toLocaleString()} pending payment
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => openClientModal(client)}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-1 inline" />
                      View Profile
                    </button>
                    <button 
                      onClick={() => openCreateTaskModal(client)}
                      className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Target className="w-4 h-4 mr-1 inline" />
                      Create Task
                    </button>
                  </div>

                  {/* Quick Actions */}
                  <div className="mt-3 flex space-x-2">
                    <button 
                      onClick={() => window.location.href = '/messages'}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <MessageSquare className="w-3 h-3 mr-1 inline" />
                      Message
                    </button>
                    <button 
                      onClick={() => window.location.href = '/documents'}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FileText className="w-3 h-3 mr-1 inline" />
                      Documents
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || countryFilter !== 'all' 
                ? 'No clients match your filters' 
                : 'No clients assigned yet'
              }
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || countryFilter !== 'all'
                ? 'Try adjusting your search terms or filters'
                : 'Clients will appear here when they are assigned to you by the admin'
              }
            </p>
            {!(searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || countryFilter !== 'all') && (
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Request Client Assignment
              </button>
            )}
          </div>
        )}

        {/* Client Profile Modal */}
        {showClientModal && selectedClientForModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Client Profile: {selectedClientForModal.profile?.full_name}
                </h2>
                <button
                  onClick={() => {
                    setShowClientModal(false);
                    setSelectedClientForModal(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <p className="text-gray-900">{selectedClientForModal.profile?.full_name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900">{selectedClientForModal.profile?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <p className="text-gray-900">{selectedClientForModal.company_name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <p className="text-gray-900">{selectedClientForModal.profile?.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                    <p className="text-gray-900 flex items-center">
                      {selectedClientForModal.profile?.preferred_language && (
                        <>
                          <span className="mr-2">{getLanguageFlag(selectedClientForModal.profile.preferred_language)}</span>
                          <span>{selectedClientForModal.profile.preferred_language.toUpperCase()}</span>
                        </>
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <p className="text-gray-900">
                      {selectedClientForModal.profile?.country 
                        ? `${selectedClientForModal.profile.country.flag_emoji} ${selectedClientForModal.profile.country.name}`
                        : 'N/A'
                      }
                    </p>
                  </div>
                </div>

                {/* Status & Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedClientForModal.status)}`}>
                      {selectedClientForModal.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedClientForModal.priority)}`}>
                      {selectedClientForModal.priority}
                    </span>
                  </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{selectedClientForModal.project_stats.total_projects}</div>
                    <div className="text-sm text-blue-800">Total Projects</div>
                    <div className="text-xs text-blue-600">{selectedClientForModal.project_stats.active_projects} active</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{selectedClientForModal.task_stats.completed_tasks}</div>
                    <div className="text-sm text-green-800">Completed Tasks</div>
                    <div className="text-xs text-green-600">{selectedClientForModal.task_stats.pending_tasks} pending</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">${selectedClientForModal.financial_stats.total_spent.toLocaleString()}</div>
                    <div className="text-sm text-purple-800">Total Spent</div>
                    {selectedClientForModal.financial_stats.pending_amount > 0 && (
                      <div className="text-xs text-yellow-600">${selectedClientForModal.financial_stats.pending_amount.toLocaleString()} pending</div>
                    )}
                  </div>
                </div>

                {/* Notes */}
                {selectedClientForModal.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700">{selectedClientForModal.notes}</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Link
                    to="/messages"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
                  >
                    <MessageSquare className="w-4 h-4 mr-2 inline" />
                    Send Message
                  </Link>
                  <button
                    onClick={() => openCreateTaskModal(selectedClientForModal)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Target className="w-4 h-4 mr-2 inline" />
                    Create Task
                  </button>
                  <Link
                    to="/documents"
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
                  >
                    <FileText className="w-4 h-4 mr-2 inline" />
                    Documents
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Task Creation Modal */}
        {showTaskModal && selectedClientForTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Create Task for {selectedClientForTask.profile?.full_name}
                </h2>
                <button
                  onClick={() => {
                    setShowTaskModal(false);
                    setSelectedClientForTask(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter task title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Describe the task"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={newTask.due_date}
                      onChange={(e) => setNewTask(prev => ({ ...prev, due_date: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Hours
                    </label>
                    <input
                      type="number"
                      min="0.5"
                      step="0.5"
                      value={newTask.estimated_hours}
                      onChange={(e) => setNewTask(prev => ({ ...prev, estimated_hours: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newTask.billable}
                      onChange={(e) => setNewTask(prev => ({ ...prev, billable: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-900">Billable task</span>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newTask.is_client_visible}
                      onChange={(e) => setNewTask(prev => ({ ...prev, is_client_visible: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-900">Visible to client</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowTaskModal(false);
                    setSelectedClientForTask(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTask}
                  disabled={creatingTask || !newTask.title.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {creatingTask ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2 inline" />
                      Create Task
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ConsultantClients;
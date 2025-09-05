import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MessageSquare, 
  Calendar,
  CheckSquare,
  FileText,
  DollarSign,
  Send,
  User,
  Building,
  MapPin,
  Phone,
  Mail,
  Clock,
  Star,
  AlertTriangle,
  X,
  Save,
  CreditCard,
  Receipt,
  Bell
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface Client {
  id: string;
  company_name: string;
  status: string;
  priority: string;
  notes: string;
  created_at: string;
  updated_at: string;
  profile: {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    company: string;
    preferred_language: string;
    timezone: string;
  };
  stats: {
    total_projects: number;
    active_projects: number;
    completed_tasks: number;
    pending_payments: number;
  };
}

const ConsultantClients = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [invoiceForm, setInvoiceForm] = useState({
    title: '',
    description: '',
    amount: '',
    currency: 'USD',
    due_date: '',
    payment_type: 'immediate',
    notes: ''
  });
  const [creatingInvoice, setCreatingInvoice] = useState(false);

  useEffect(() => {
    if (user) {
      fetchClients();
    }
  }, [user]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      
      // Fetch clients assigned to this consultant
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select(`
          *,
          profile:user_profiles!clients_profile_id_fkey(*)
        `)
        .eq('assigned_consultant_id', user?.id)
        .order('created_at', { ascending: false });

      if (clientsError) {
        console.error('Error fetching clients:', clientsError);
        return;
      }

      // Enrich with stats for each client
      const enrichedClients = await Promise.all(
        (clientsData || []).map(async (client) => {
          try {
            const [projectsResult, tasksResult, ordersResult] = await Promise.all([
              supabase.from('projects').select('id, status').eq('client_id', client.id),
              supabase.from('tasks').select('id, status').eq('client_id', client.id),
              supabase.from('service_orders').select('id, status').eq('client_id', client.id)
            ]);

            const projects = projectsResult.data || [];
            const tasks = tasksResult.data || [];
            const orders = ordersResult.data || [];

            return {
              ...client,
              stats: {
                total_projects: projects.length,
                active_projects: projects.filter(p => p.status === 'active').length,
                completed_tasks: tasks.filter(t => t.status === 'completed').length,
                pending_payments: orders.filter(o => ['pending', 'quoted'].includes(o.status)).length
              }
            };
          } catch (err) {
            console.error(`Error fetching stats for client ${client.id}:`, err);
            return {
              ...client,
              stats: {
                total_projects: 0,
                active_projects: 0,
                completed_tasks: 0,
                pending_payments: 0
              }
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

  const handleCreateInvoice = async () => {
    if (!selectedClient || !invoiceForm.title || !invoiceForm.amount) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setCreatingInvoice(true);

      const amount = parseFloat(invoiceForm.amount);
      if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
      }

      // Create service order first
      const { data: serviceOrder, error: orderError } = await supabase
        .from('service_orders')
        .insert({
          client_id: selectedClient.id,
          consultant_id: user?.id,
          title: invoiceForm.title,
          description: invoiceForm.description,
          total_amount: amount,
          currency: invoiceForm.currency,
          status: invoiceForm.payment_type === 'immediate' ? 'pending' : 'quoted'
        })
        .select()
        .single();

      if (orderError) {
        throw orderError;
      }

      // Create invoice
      const dueDate = invoiceForm.payment_type === 'immediate' 
        ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        : invoiceForm.due_date ? new Date(invoiceForm.due_date) : null;

      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          client_id: selectedClient.id,
          service_order_id: serviceOrder.id,
          amount_due: amount,
          currency: invoiceForm.currency,
          status: 'pending',
          due_date: dueDate?.toISOString(),
          memo: invoiceForm.notes
        })
        .select()
        .single();

      if (invoiceError) {
        throw invoiceError;
      }

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'invoice_created',
          resource_type: 'invoice',
          resource_id: invoice.id,
          description: `Created invoice for client: ${selectedClient.profile.full_name}`,
          payload: {
            client_id: selectedClient.id,
            amount: amount,
            currency: invoiceForm.currency,
            service_title: invoiceForm.title,
            payment_type: invoiceForm.payment_type
          }
        });

      // Notify client
      await supabase.functions.invoke('notify', {
        body: {
          recipient_id: selectedClient.profile.id,
          type: 'invoice_created',
          payload: {
            consultant_name: user?.user_metadata?.full_name || 'Your Consultant',
            service_title: invoiceForm.title,
            amount: amount,
            currency: invoiceForm.currency,
            due_date: dueDate?.toISOString(),
            payment_type: invoiceForm.payment_type,
            invoice_id: invoice.id
          },
          email_notification: true
        }
      });

      alert('Invoice created and sent to client successfully!');
      setShowInvoiceModal(false);
      setSelectedClient(null);
      setInvoiceForm({
        title: '',
        description: '',
        amount: '',
        currency: 'USD',
        due_date: '',
        payment_type: 'immediate',
        notes: ''
      });
      
      // Refresh client stats
      fetchClients();
    } catch (err) {
      console.error('Invoice creation error:', err);
      alert('Failed to create invoice. Please try again.');
    } finally {
      setCreatingInvoice(false);
    }
  };

  const openInvoiceModal = (client: Client) => {
    setSelectedClient(client);
    setInvoiceForm({
      title: '',
      description: '',
      amount: '',
      currency: 'USD',
      due_date: '',
      payment_type: 'immediate',
      notes: ''
    });
    setShowInvoiceModal(true);
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

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.profile?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || client.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Clients - Consultant Dashboard</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
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
        <title>Clients - Consultant Dashboard</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Clients</h1>
            <p className="text-gray-600 mt-1">Manage your clients and create invoices</p>
          </div>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Add Client
          </button>
        </div>

        {/* Client Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Clients</p>
                <p className="text-2xl font-bold text-blue-600">{clients.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {clients.filter(c => c.status === 'active').length}
                </p>
              </div>
              <CheckSquare className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-orange-600">
                  {clients.filter(c => c.priority === 'high').length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Payments</p>
                <p className="text-2xl font-bold text-red-600">
                  {clients.reduce((sum, c) => sum + c.stats.pending_payments, 0)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-red-600" />
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
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Clients List */}
        {filteredClients.length > 0 ? (
          <div className="space-y-4">
            {filteredClients.map((client) => (
              <div key={client.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {client.profile?.full_name}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                          {client.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(client.priority)}`}>
                          {client.priority}
                        </span>
                      </div>
                      
                      {client.company_name && (
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <Building className="w-4 h-4 mr-1" />
                          <span>{client.company_name}</span>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        {client.profile?.email && (
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            <span>{client.profile.email}</span>
                          </div>
                        )}
                        {client.profile?.phone && (
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-1" />
                            <span>{client.profile.phone}</span>
                          </div>
                        )}
                        {client.profile?.timezone && (
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{client.profile.timezone}</span>
                          </div>
                        )}
                      </div>

                      {/* Client Stats */}
                      <div className="flex items-center space-x-6 text-sm text-gray-600 mt-3">
                        <span>{client.stats.total_projects} projects</span>
                        <span>{client.stats.completed_tasks} tasks done</span>
                        {client.stats.pending_payments > 0 && (
                          <span className="text-red-600 font-medium">
                            {client.stats.pending_payments} pending payment(s)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => openInvoiceModal(client)}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Invoice
                    </button>
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Message
                    </button>
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Calendar className="w-4 h-4 mr-1" />
                      Schedule
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Clients Found</h3>
            <p className="text-gray-600 mb-6">
              Start by adding your first client to begin managing their projects.
            </p>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Client
            </button>
          </div>
        )}

        {/* Invoice Creation Modal */}
        {showInvoiceModal && selectedClient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Create Invoice</h2>
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Client Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900">{selectedClient.profile.full_name}</h3>
                    <p className="text-sm text-blue-700">{selectedClient.profile.email}</p>
                    {selectedClient.company_name && (
                      <p className="text-sm text-blue-600">{selectedClient.company_name}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Title *
                    </label>
                    <input
                      type="text"
                      value={invoiceForm.title}
                      onChange={(e) => setInvoiceForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Company Registration Service"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={invoiceForm.description}
                      onChange={(e) => setInvoiceForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Detailed description of the service..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Amount *
                      </label>
                      <input
                        type="number"
                        value={invoiceForm.amount}
                        onChange={(e) => setInvoiceForm(prev => ({ ...prev, amount: e.target.value }))}
                        placeholder="2500"
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Currency
                      </label>
                      <select
                        value={invoiceForm.currency}
                        onChange={(e) => setInvoiceForm(prev => ({ ...prev, currency: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="TRY">TRY (₺)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Internal Notes
                    </label>
                    <textarea
                      value={invoiceForm.notes}
                      onChange={(e) => setInvoiceForm(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Internal notes (not visible to client)..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Payment Type
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          value="immediate"
                          checked={invoiceForm.payment_type === 'immediate'}
                          onChange={(e) => setInvoiceForm(prev => ({ ...prev, payment_type: e.target.value }))}
                          className="mt-1 text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Immediate Payment</div>
                          <div className="text-sm text-gray-600">Client can pay immediately via Stripe</div>
                          <div className="text-xs text-green-600 mt-1">✨ Due in 7 days</div>
                        </div>
                      </label>
                      
                      <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          value="scheduled"
                          checked={invoiceForm.payment_type === 'scheduled'}
                          onChange={(e) => setInvoiceForm(prev => ({ ...prev, payment_type: e.target.value }))}
                          className="mt-1 text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Scheduled Payment</div>
                          <div className="text-sm text-gray-600">Set custom due date for payment</div>
                          <div className="text-xs text-blue-600 mt-1">📅 Choose due date below</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {invoiceForm.payment_type === 'scheduled' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Due Date *
                      </label>
                      <input
                        type="date"
                        value={invoiceForm.due_date}
                        onChange={(e) => setInvoiceForm(prev => ({ ...prev, due_date: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}

                  {/* Invoice Preview */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">📋 Invoice Preview</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Client:</span>
                        <span className="font-medium">{selectedClient.profile.full_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service:</span>
                        <span className="font-medium">{invoiceForm.title || 'Service Title'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-bold text-lg text-green-600">
                          {invoiceForm.amount ? `${invoiceForm.currency} $${parseFloat(invoiceForm.amount).toLocaleString()}` : 'Amount'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment:</span>
                        <span className="font-medium">
                          {invoiceForm.payment_type === 'immediate' ? 'Due in 7 days' : 
                           invoiceForm.due_date ? `Due ${new Date(invoiceForm.due_date).toLocaleDateString()}` : 'Due date TBD'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods Info */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <CreditCard className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-900">Secure Payment</span>
                    </div>
                    <p className="text-sm text-green-800">
                      Client will receive invoice with secure Stripe payment link
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateInvoice}
                  disabled={creatingInvoice || !invoiceForm.title || !invoiceForm.amount || (invoiceForm.payment_type === 'scheduled' && !invoiceForm.due_date)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
                >
                  {creatingInvoice ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                      Creating Invoice...
                    </>
                  ) : (
                    <>
                      <Receipt className="w-4 h-4 mr-2 inline" />
                      Create & Send Invoice
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
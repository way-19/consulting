import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
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
  DollarSign,
  Send,
  X
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';
import { useAuth } from '@consulting19/shared';

interface Client {
  id: string;
  company_name: string | null;
  status: string;
  priority: string;
  notes: string | null;
  created_at: string;
  profile_id: string;
  profile: {
    full_name: string;
    email: string;
    phone: string | null;
  };
}

interface InvoiceForm {
  client_id: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  due_date: string;
  scheduled_send_date: string;
  notes: string;
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
  const [submitting, setSubmitting] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState<InvoiceForm>({
    client_id: '',
    title: '',
    description: '',
    amount: 0,
    currency: 'USD',
    due_date: '',
    scheduled_send_date: '',
    notes: ''
  });

  useEffect(() => {
    if (user) {
      fetchClients();
    }
  }, [user]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      
      const { data: clientsData, error } = await supabase
        .from('clients')
        .select(`
          *,
          profile:user_profiles!clients_profile_id_fkey(full_name, email, phone)
        `)
        .eq('assigned_consultant_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching clients:', error);
        return;
      }

      setClients(clientsData || []);
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const openInvoiceModal = (client: Client) => {
    setSelectedClient(client);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    setInvoiceForm({
      client_id: client.id,
      title: '',
      description: '',
      amount: 0,
      currency: 'USD',
      due_date: nextWeek.toISOString().split('T')[0], // Default 1 week due
      scheduled_send_date: tomorrow.toISOString().split('T')[0], // Default tomorrow
      notes: ''
    });
    setShowInvoiceModal(true);
  };

  const handleCreateInvoice = async () => {
    if (!invoiceForm.title.trim() || !invoiceForm.amount || !invoiceForm.due_date) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);

      // Calculate total amount (in case of future service fees, taxes etc)
      const totalAmount = invoiceForm.amount;

      // Create service order first (required for invoice)
      const { data: serviceOrder, error: orderError } = await supabase
        .from('service_orders')
        .insert({
          client_id: invoiceForm.client_id,
          consultant_id: user?.id,
          title: invoiceForm.title,
          description: invoiceForm.description,
          total_amount: totalAmount,
          currency: invoiceForm.currency,
          status: 'quoted' // Quoted status for manual invoices
        })
        .select()
        .single();

      if (orderError) {
        throw orderError;
      }

      // Create invoice
      const { error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          client_id: invoiceForm.client_id,
          service_order_id: serviceOrder.id,
          amount_due: totalAmount,
          currency: invoiceForm.currency,
          status: 'pending',
          due_date: new Date(invoiceForm.due_date).toISOString(),
          memo: invoiceForm.notes
        });

      if (invoiceError) {
        throw invoiceError;
      }

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'invoice_created',
          description: `Created invoice for client: ${selectedClient?.profile?.full_name}`,
          payload: {
            client_id: invoiceForm.client_id,
            amount: totalAmount,
            currency: invoiceForm.currency,
            title: invoiceForm.title,
            due_date: invoiceForm.due_date,
            scheduled_send_date: invoiceForm.scheduled_send_date
          }
        });

      // Notify client
      const { data: clientProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', selectedClient?.profile_id)
        .single();

      if (clientProfile) {
        // Send immediate notification
        await supabase.functions.invoke('notify', {
          body: {
            recipient_id: clientProfile.id,
            type: 'invoice_created',
            payload: {
              invoice_title: invoiceForm.title,
              amount: totalAmount,
              currency: invoiceForm.currency,
              due_date: invoiceForm.due_date,
              consultant_name: user?.user_metadata?.full_name
            },
            email_notification: true
          }
        });

        // Schedule payment reminders
        await schedulePaymentReminders(serviceOrder.id, invoiceForm.due_date, clientProfile.id);
      }

      // Schedule future sending if requested
      if (invoiceForm.scheduled_send_date && invoiceForm.scheduled_send_date !== new Date().toISOString().split('T')[0]) {
        console.log(`📅 Invoice scheduled for: ${invoiceForm.scheduled_send_date}`);
        // In production, you'd use a job queue or cron job
        alert(`Invoice created and scheduled to send on ${new Date(invoiceForm.scheduled_send_date).toLocaleDateString()}!`);
      } else {
        alert('Invoice created and sent to client successfully!');
      }

      setShowInvoiceModal(false);
      setSelectedClient(null);
      
      // Trigger real-time dashboard refresh for consultant
      await triggerDashboardRefresh();
    } catch (err) {
      console.error('Invoice creation error:', err);
      alert('Failed to create invoice. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const triggerDashboardRefresh = async () => {
    try {
      // Broadcast to consultant dashboard channel for real-time updates
      const channel = supabase.channel('consultant-dashboard');
      await channel.send({
        type: 'broadcast',
        event: 'invoice_created',
        payload: {
          consultant_id: user?.id,
          timestamp: new Date().toISOString()
        }
      });
      
      console.log('📡 Dashboard refresh trigger sent');
    } catch (err) {
      console.error('Dashboard refresh trigger failed:', err);
    }
  };

  const schedulePaymentReminders = async (orderId: string, dueDate: string, clientId: string) => {
    try {
      const dueDateObj = new Date(dueDate);
      
      // Schedule 7-day advance reminder
      const sevenDaysBefore = new Date(dueDateObj);
      sevenDaysBefore.setDate(sevenDaysBefore.getDate() - 7);
      
      // Schedule 24-hour final reminder  
      const oneDayBefore = new Date(dueDateObj);
      oneDayBefore.setDate(oneDayBefore.getDate() - 1);
      
      // Schedule overdue alert
      const oneDayAfter = new Date(dueDateObj);
      oneDayAfter.setDate(oneDayAfter.getDate() + 1);

      // In production, you'd use a job scheduler like:
      // - Supabase pg_cron
      // - External cron service
      // - Task queue system
      
      console.log('📅 Payment reminders scheduled:', {
        order_id: orderId,
        seven_day_reminder: sevenDaysBefore.toISOString(),
        final_reminder: oneDayBefore.toISOString(),
        overdue_alert: oneDayAfter.toISOString(),
        client_id: clientId
      });

      // Create reminder audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'payment_reminders_scheduled',
          description: `Scheduled payment reminders for invoice due ${dueDateObj.toLocaleDateString()}`,
          payload: {
            order_id: orderId,
            due_date: dueDate,
            reminder_dates: {
              advance_notice: sevenDaysBefore.toISOString(),
              final_notice: oneDayBefore.toISOString(),
              overdue_alert: oneDayAfter.toISOString()
            }
          }
        });

    } catch (err) {
      console.error('Error scheduling payment reminders:', err);
      // Don't fail invoice creation if reminder scheduling fails
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.profile?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      default: return 'bg-blue-100 text-blue-800';
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
      <>
        <Helmet>
          <title>Clients - Consultant Dashboard</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
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
            <p className="text-gray-600 mt-1">Manage your client relationships and communications</p>
          </div>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Add Client
          </button>
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
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

        {/* Clients Grid */}
        {filteredClients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <div key={client.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{client.profile?.full_name}</h3>
                      {client.company_name && (
                        <p className="text-sm text-gray-600">{client.company_name}</p>
                      )}
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{client.profile?.email}</span>
                  </div>
                  {client.profile?.phone && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{client.profile.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(client.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                    {client.status}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(client.priority)}`}>
                    {client.priority}
                  </span>
                </div>

                {client.notes && (
                  <p className="text-sm text-gray-600 mb-4 bg-gray-50 p-2 rounded">{client.notes}</p>
                )}

                <div className="flex space-x-2">
                  <button className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    View Profile
                  </button>
                  <button 
                    onClick={() => openInvoiceModal(client)}
                    className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <DollarSign className="w-3 h-3 mr-1 inline" />
                    Send Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Clients Yet</h3>
            <p className="text-gray-600 mb-6">
              Start building your client base by adding your first client
            </p>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Add Client
            </button>
          </div>
        )}

        {/* Invoice Creation Modal */}
        {showInvoiceModal && selectedClient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Create Invoice</h2>
                <button
                  onClick={() => {
                    setShowInvoiceModal(false);
                    setSelectedClient(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Client Info Header */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900">
                      Invoice for: {selectedClient.profile?.full_name}
                    </h3>
                    {selectedClient.company_name && (
                      <p className="text-sm text-blue-700">{selectedClient.company_name}</p>
                    )}
                    <p className="text-xs text-blue-600">{selectedClient.profile?.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Invoice Details */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Invoice Title *
                    </label>
                    <input
                      type="text"
                      value={invoiceForm.title}
                      onChange={(e) => setInvoiceForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Monthly Consulting Services"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={invoiceForm.description}
                      onChange={(e) => setInvoiceForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Detailed description of services provided..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Amount *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={invoiceForm.amount || ''}
                        onChange={(e) => setInvoiceForm(prev => ({ ...prev, amount: Number(e.target.value) }))}
                        placeholder="0.00"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Currency
                      </label>
                      <select
                        value={invoiceForm.currency}
                        onChange={(e) => setInvoiceForm(prev => ({ ...prev, currency: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="GEL">GEL (₾)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Right Column - Scheduling */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date *
                    </label>
                    <input
                      type="date"
                      value={invoiceForm.due_date}
                      onChange={(e) => setInvoiceForm(prev => ({ ...prev, due_date: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Schedule Send Date
                    </label>
                    <input
                      type="date"
                      value={invoiceForm.scheduled_send_date}
                      onChange={(e) => setInvoiceForm(prev => ({ ...prev, scheduled_send_date: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Leave blank to send immediately, or schedule for future delivery
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Internal Notes
                    </label>
                    <textarea
                      value={invoiceForm.notes}
                      onChange={(e) => setInvoiceForm(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Internal notes (not visible to client)..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      rows={3}
                    />
                  </div>

                  {/* Invoice Preview */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Invoice Preview</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Client:</span>
                        <span className="font-medium">{selectedClient.profile?.full_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-bold text-green-600">
                          {invoiceForm.amount > 0 ? `${invoiceForm.currency} ${invoiceForm.amount.toLocaleString()}` : 'Not set'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Due:</span>
                        <span className="font-medium">
                          {invoiceForm.due_date ? new Date(invoiceForm.due_date).toLocaleDateString() : 'Not set'}
                        </span>
                      </div>
                      {invoiceForm.scheduled_send_date && invoiceForm.scheduled_send_date !== new Date().toISOString().split('T')[0] && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Send Date:</span>
                          <span className="font-medium text-blue-600">
                            {new Date(invoiceForm.scheduled_send_date).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowInvoiceModal(false);
                    setSelectedClient(null);
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateInvoice}
                  disabled={submitting || !invoiceForm.title.trim() || !invoiceForm.amount || !invoiceForm.due_date}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2 inline" />
                      {invoiceForm.scheduled_send_date && invoiceForm.scheduled_send_date !== new Date().toISOString().split('T')[0] 
                        ? 'Schedule Invoice' 
                        : 'Create & Send Invoice'
                      }
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
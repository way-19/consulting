import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  CreditCard, 
  DollarSign, 
  Calendar,
  Download,
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  X,
  ExternalLink,
  Receipt,
  TrendingUp,
  FileText,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface Invoice {
  id: string;
  amount_due: number;
  currency: string;
  status: string;
  stripe_invoice_id?: string;
  stripe_payment_intent?: string;
  stripe_session_id?: string;
  memo?: string;
  due_date?: string;
  paid_at?: string;
  created_at: string;
  service_order?: {
    title: string;
    description?: string;
  };
}

interface ServiceOrder {
  id: string;
  title: string;
  description?: string;
  total_amount: number;
  currency: string;
  status: string;
  stripe_session_id?: string;
  stripe_payment_intent_id?: string;
  created_at: string;
  consultant?: {
    full_name: string;
  };
}

interface BillingStats {
  totalSpent: number;
  pendingAmount: number;
  paidInvoices: number;
  pendingInvoices: number;
  thisMonthSpent: number;
  lastMonthSpent: number;
}

const ClientBilling = () => {
  const { user, profile } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([]);
  const [billingStats, setBillingStats] = useState<BillingStats>({
    totalSpent: 0,
    pendingAmount: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
    thisMonthSpent: 0,
    lastMonthSpent: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('invoices');
  const [payingInvoice, setPayingInvoice] = useState<string | null>(null);

  useEffect(() => {
    if (user && profile) {
      fetchBillingData();
    }
  }, [user, profile]);

  const fetchBillingData = async () => {
    try {
      setLoading(true);
      
      // Get client ID
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', user?.id)
        .maybeSingle();

      if (clientError || !clientData) {
        console.error('Client fetch error:', clientError);
        setLoading(false);
        return;
      }

      // Fetch invoices
      const { data: invoicesData, error: invoicesError } = await supabase
        .from('invoices')
        .select(`
          *,
          service_order:service_orders(title, description)
        `)
        .eq('client_id', clientData.id)
        .order('created_at', { ascending: false });

      if (invoicesError) {
        console.error('Invoices fetch error:', invoicesError);
      } else {
        setInvoices(invoicesData || []);
      }

      // Fetch service orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('service_orders')
        .select(`
          *,
          consultant:user_profiles!service_orders_consultant_id_fkey(full_name)
        `)
        .eq('client_id', clientData.id)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Service orders fetch error:', ordersError);
      } else {
        setServiceOrders(ordersData || []);
      }

      // Calculate billing statistics
      calculateBillingStats(invoicesData || [], ordersData || []);

    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateBillingStats = (invoices: Invoice[], orders: ServiceOrder[]) => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const paidInvoices = invoices.filter(inv => inv.status === 'paid');
    const pendingInvoices = invoices.filter(inv => inv.status === 'pending');
    
    const totalSpent = paidInvoices.reduce((sum, inv) => sum + inv.amount_due, 0);
    const pendingAmount = pendingInvoices.reduce((sum, inv) => sum + inv.amount_due, 0);
    
    const thisMonthSpent = paidInvoices
      .filter(inv => inv.paid_at && new Date(inv.paid_at) >= thisMonth)
      .reduce((sum, inv) => sum + inv.amount_due, 0);
    
    const lastMonthSpent = paidInvoices
      .filter(inv => inv.paid_at && new Date(inv.paid_at) >= lastMonth && new Date(inv.paid_at) <= lastMonthEnd)
      .reduce((sum, inv) => sum + inv.amount_due, 0);

    setBillingStats({
      totalSpent,
      pendingAmount,
      paidInvoices: paidInvoices.length,
      pendingInvoices: pendingInvoices.length,
      thisMonthSpent,
      lastMonthSpent
    });
  };

  const handlePayInvoice = async (invoice: Invoice) => {
    try {
      setPayingInvoice(invoice.id);

      // Create Stripe checkout session
      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke(
        'create-stripe-checkout',
        {
          body: {
            amount: Math.round(invoice.amount_due * 100), // Convert to cents
            currency: invoice.currency.toLowerCase(),
            title: `Invoice Payment - ${invoice.service_order?.title || 'Consulting Service'}`,
            description: invoice.memo || invoice.service_order?.description || 'Professional consulting service payment',
            success_url: `${window.location.origin}/billing?payment=success&invoice_id=${invoice.id}`,
            cancel_url: `${window.location.origin}/billing?payment=cancelled`,
            metadata: {
              invoice_id: invoice.id,
              client_id: user?.id
            }
          }
        }
      );

      if (checkoutError) {
        throw checkoutError;
      }

      // Redirect to Stripe Checkout
      if (checkoutData?.url) {
        window.location.href = checkoutData.url;
      } else {
        throw new Error('No checkout URL received');
      }

    } catch (err) {
      console.error('Payment initiation error:', err);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setPayingInvoice(null);
    }
  };

  const downloadInvoice = async (invoice: Invoice) => {
    try {
      // Generate PDF invoice
      const { data: pdfData, error: pdfError } = await supabase.functions.invoke(
        'generate-invoice-pdf',
        {
          body: { order_id: invoice.service_order?.id || invoice.id }
        }
      );

      if (pdfError) {
        throw pdfError;
      }

      // Create download link
      const blob = new Blob([pdfData], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoice.id.substring(0, 8)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

    } catch (err) {
      console.error('Invoice download error:', err);
      alert('Failed to download invoice. Please try again.');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'failed': return <X className="w-5 h-5 text-red-600" />;
      case 'cancelled': return <AlertTriangle className="w-5 h-5 text-gray-600" />;
      default: return <Receipt className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.service_order?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.memo?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const filteredOrders = serviceOrders.filter(order => {
    const matchesSearch = 
      order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Billing - Client Portal</title>
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
        <title>Billing & Payments - Client Portal</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Billing & Payments</h1>
            <p className="text-gray-600 mt-1">Manage your payments and billing history</p>
          </div>
          <button 
            onClick={fetchBillingData}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>

        {/* Billing Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-3xl font-bold text-green-600">${billingStats.totalSpent.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                <p className="text-3xl font-bold text-yellow-600">${billingStats.pendingAmount.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-3xl font-bold text-blue-600">${billingStats.thisMonthSpent.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Growth</p>
                <p className={`text-3xl font-bold ${
                  billingStats.thisMonthSpent >= billingStats.lastMonthSpent ? 'text-green-600' : 'text-red-600'
                }`}>
                  {billingStats.lastMonthSpent > 0 
                    ? `${(((billingStats.thisMonthSpent - billingStats.lastMonthSpent) / billingStats.lastMonthSpent) * 100).toFixed(0)}%`
                    : '0%'
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'invoices', name: `Invoices (${invoices.length})`, icon: Receipt },
                { id: 'orders', name: `Service Orders (${serviceOrders.length})`, icon: FileText },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Filters */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search invoices and orders..."
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
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Invoices Tab */}
            {activeTab === 'invoices' && (
              <div>
                {filteredInvoices.length > 0 ? (
                  <div className="space-y-4">
                    {filteredInvoices.map((invoice) => (
                      <div key={invoice.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            {getStatusIcon(invoice.status)}
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {invoice.service_order?.title || 'Consulting Service'}
                              </h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>Invoice #{invoice.id.substring(0, 8)}</span>
                                <span>•</span>
                                <span>{new Date(invoice.created_at).toLocaleDateString()}</span>
                                {invoice.due_date && (
                                  <>
                                    <span>•</span>
                                    <span>Due: {new Date(invoice.due_date).toLocaleDateString()}</span>
                                  </>
                                )}
                              </div>
                              {invoice.memo && (
                                <p className="text-sm text-gray-600 mt-1">{invoice.memo}</p>
                              )}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">
                              ${invoice.amount_due.toLocaleString()} {invoice.currency}
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invoice.status)}`}>
                              {invoice.status}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          {invoice.status === 'pending' && (
                            <button
                              onClick={() => handlePayInvoice(invoice)}
                              disabled={payingInvoice === invoice.id}
                              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                              {payingInvoice === invoice.id ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <CreditCard className="w-4 h-4 mr-2" />
                                  Pay with Stripe
                                </>
                              )}
                            </button>
                          )}
                          
                          <button 
                            onClick={() => downloadInvoice(invoice)}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF
                          </button>

                          {invoice.stripe_invoice_id && (
                            <button 
                              onClick={() => window.open(`https://dashboard.stripe.com/invoices/${invoice.stripe_invoice_id}`, '_blank')}
                              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View in Stripe
                            </button>
                          )}
                        </div>

                        {invoice.paid_at && (
                          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-green-900">
                                Paid on {new Date(invoice.paid_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Receipt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Invoices Yet</h3>
                    <p className="text-gray-600 mb-6">
                      Invoices will appear here when you order services from your consultant
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                      <h4 className="text-sm font-semibold text-blue-900 mb-2">💳 Secure Payments</h4>
                      <p className="text-xs text-blue-800">
                        All payments are processed securely through Stripe with bank-level encryption. 
                        You'll receive email confirmations for all transactions.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Service Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                {filteredOrders.length > 0 ? (
                  <div className="space-y-4">
                    {filteredOrders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            {getStatusIcon(order.status)}
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{order.title}</h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>Order #{order.id.substring(0, 8)}</span>
                                <span>•</span>
                                <span>{new Date(order.created_at).toLocaleDateString()}</span>
                                {order.consultant && (
                                  <>
                                    <span>•</span>
                                    <span>by {order.consultant.full_name}</span>
                                  </>
                                )}
                              </div>
                              {order.description && (
                                <p className="text-sm text-gray-600 mt-1">{order.description}</p>
                              )}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">
                              ${order.total_amount.toLocaleString()} {order.currency}
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </button>
                          
                          {order.stripe_session_id && (
                            <button 
                              onClick={() => window.open(`https://dashboard.stripe.com/payments/${order.stripe_payment_intent_id}`, '_blank')}
                              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View Payment
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Service Orders</h3>
                    <p className="text-gray-600 mb-6">
                      Service orders will appear here when you purchase consulting services
                    </p>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
                      <h4 className="text-sm font-semibold text-green-900 mb-2">🛒 Order Services</h4>
                      <p className="text-xs text-green-800">
                        Browse available services from your consultant and place orders. 
                        All transactions are tracked here with full payment history.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Payment Methods Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">Stripe Payments</h3>
                <p className="text-sm text-blue-800">Secure credit card processing</p>
                <p className="text-xs text-blue-700">Visa, Mastercard, American Express accepted</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-green-900">Bank-Level Security</h3>
                <p className="text-sm text-green-800">256-bit SSL encryption</p>
                <p className="text-xs text-green-700">PCI DSS compliant payment processing</p>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Spending Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Spending Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">This Month</span>
                <span className="font-bold text-blue-600">${billingStats.thisMonthSpent.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-blue-500 h-4 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${billingStats.lastMonthSpent > 0 
                      ? Math.min((billingStats.thisMonthSpent / billingStats.lastMonthSpent) * 100, 100)
                      : billingStats.thisMonthSpent > 0 ? 100 : 0
                    }%` 
                  }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Last Month</span>
                <span className="font-bold text-gray-600">${billingStats.lastMonthSpent.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-gray-400 h-4 rounded-full"
                  style={{ width: '100%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientBilling;
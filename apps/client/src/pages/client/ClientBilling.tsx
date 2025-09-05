import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  CreditCard, 
  DollarSign, 
  Download,
  Calendar,
  User,
  Clock,
  CheckCircle,
  AlertTriangle,
  Receipt,
  ShoppingCart,
  Mail,
  Send,
  RefreshCw,
  Eye,
  BarChart3,
  TrendingUp,
  TrendingDown,
  PieChart,
  Search
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface ServiceOrder {
  id: string;
  title: string;
  description: string;
  total_amount: number;
  currency: string;
  status: string;
  stripe_payment_intent_id: string | null;
  created_at: string;
  consultant: {
    full_name: string;
  } | null;
  custom_service: {
    billing_type: string;
  } | null;
}

const ClientBilling = () => {
  const { user, profile } = useAuth();
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [generatingInvoice, setGeneratingInvoice] = useState<string | null>(null);
  const [sendingInvoice, setSendingInvoice] = useState<string | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState<string | null>(null);

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
        return;
      }

      // Fetch service orders for this client
      const { data: ordersData, error: ordersError } = await supabase
        .from('service_orders')
        .select(`
          *,
          consultant:user_profiles!service_orders_consultant_id_fkey(full_name),
          custom_service:custom_services(billing_type)
        `)
        .eq('client_id', clientData.id)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        return;
      }

      setOrders(ordersData || []);
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (order: ServiceOrder) => {
    try {
      setPaymentProcessing(order.id);
      
      // Create Stripe checkout session
      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke(
        'create-stripe-checkout',
        {
          body: {
            service_order_id: order.id,
            amount: Math.round(order.total_amount * 100), // Convert to cents
            currency: order.currency.toLowerCase(),
            title: order.title,
            description: order.description,
            success_url: `${window.location.origin}/billing?payment=success`,
            cancel_url: `${window.location.origin}/billing?payment=cancelled`
          }
        }
      );

      if (checkoutError) {
        throw checkoutError;
      }

      // Redirect to Stripe Checkout
      if (checkoutData?.url) {
        window.location.href = checkoutData.url;
      }
    } catch (err) {
      console.error('Payment error:', err);
      alert('Failed to process payment. Please try again.');
    } finally {
      setPaymentProcessing(null);
    }
  };

  const generateInvoicePDF = async (orderId: string) => {
    try {
      setGeneratingInvoice(orderId);
      
      const { data: pdfData, error: pdfError } = await supabase.functions.invoke(
        'generate-invoice-pdf',
        {
          body: { order_id: orderId }
        }
      );

      if (pdfError) {
        throw pdfError;
      }

      // Create and download PDF
      const blob = new Blob([pdfData], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `invoice-${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setGeneratingInvoice(null);
    }
  };

  const sendInvoiceEmail = async (orderId: string) => {
    try {
      setSendingInvoice(orderId);
      
      const { error: emailError } = await supabase.functions.invoke(
        'send-invoice-email',
        {
          body: { 
            order_id: orderId, 
            recipient_email: user?.email 
          }
        }
      );

      if (emailError) {
        throw emailError;
      }

      alert('Invoice email sent successfully!');
    } catch (err) {
      console.error('Email sending error:', err);
      alert('Failed to send email. Please try again.');
    } finally {
      setSendingInvoice(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'pending': return <Clock className="w-6 h-6 text-yellow-600" />;
      case 'failed': return <AlertTriangle className="w-6 h-6 text-red-600" />;
      default: return <Receipt className="w-6 h-6 text-gray-600" />;
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.consultant?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Financial calculations
  const totalSpent = orders
    .filter(order => order.status === 'paid')
    .reduce((sum, order) => sum + order.total_amount, 0);
    
  const pendingAmount = orders
    .filter(order => order.status === 'pending')
    .reduce((sum, order) => sum + order.total_amount, 0);
    
  const pendingCount = orders.filter(order => order.status === 'pending').length;

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Billing & Payments - Client Portal</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {[...Array(3)].map((_, i) => (
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing & Payments</h1>
          <p className="text-gray-600 mt-1">Manage your payments and view billing history</p>
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-3xl font-bold text-gray-900">${totalSpent.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-1">All time</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                <p className="text-3xl font-bold text-orange-600">${pendingAmount.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-1">{pendingCount} invoice(s)</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-3xl font-bold text-blue-600">
                  ${orders.filter(o => 
                    new Date(o.created_at).getMonth() === new Date().getMonth() &&
                    o.status === 'paid'
                  ).reduce((sum, o) => sum + o.total_amount, 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">Current period</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search invoices..."
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
            <button
              onClick={fetchBillingData}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Enhanced Orders/Invoices List */}
        <div data-billing-section>
          {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    {getStatusIcon(order.status)}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{order.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{order.description}</p>
                      <div className="flex flex-wrap items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          <span>Consultant: {order.consultant?.full_name}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{new Date(order.created_at).toLocaleDateString()}</span>
                        </div>
                        {order.custom_service?.billing_type && (
                          <>
                            <span>•</span>
                            <span className="capitalize bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                              {order.custom_service.billing_type.replace('_', ' ')}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      ${order.total_amount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500 uppercase tracking-wider">{order.currency}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${getStatusColor(order.status)}`}>
                    {order.status.replace('_', ' ').toUpperCase()}
                  </span>
                  
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => generateInvoicePDF(order.id)}
                      disabled={generatingInvoice === order.id}
                      className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      {generatingInvoice === order.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                      ) : (
                        <Download className="w-4 h-4 mr-2" />
                      )}
                      {generatingInvoice === order.id ? 'Generating...' : 'PDF Invoice'}
                    </button>

                    <button 
                      onClick={() => sendInvoiceEmail(order.id)}
                      disabled={sendingInvoice === order.id}
                      className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors"
                    >
                      {sendingInvoice === order.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      ) : (
                        <Mail className="w-4 h-4 mr-2" />
                      )}
                      {sendingInvoice === order.id ? 'Sending...' : 'Email Invoice'}
                    </button>
                    
                    {order.status === 'pending' && (
                      <button 
                        onClick={() => handlePayment(order)}
                        className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Pay Securely
                      </button>
                    )}
                    
                    {order.status === 'paid' && order.stripe_payment_intent_id && (
                      <button className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors">
                        <Receipt className="w-4 h-4 mr-2" />
                        Receipt
                      </button>
                    )}

                    <button className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-colors">
                      <Eye className="w-4 h-4 mr-2" />
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CreditCard className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Financial History</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Your payment history and invoices will appear here once you start ordering services from your consultant.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
              <button className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Browse Services
              </button>
              <button className="inline-flex items-center justify-center px-6 py-3 border-2 border-blue-300 text-blue-700 rounded-xl hover:bg-blue-50 transition-all duration-300 font-semibold">
                <Send className="w-5 h-5 mr-2" />
                Contact Consultant
              </button>
            </div>
          </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ClientBilling;
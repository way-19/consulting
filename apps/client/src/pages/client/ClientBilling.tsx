import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  Download,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  FileText,
  User,
  Building,
  X
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface Invoice {
  id: string;
  amount_due: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  due_date: string;
  paid_at: string;
  created_at: string;
  memo: string;
  stripe_invoice_id: string;
  payment_type: string;
  service_order?: {
    title: string;
    description: string;
  };
}

interface ServiceOrder {
  id: string;
  title: string;
  description: string;
  total_amount: number;
  currency: string;
  status: string;
  created_at: string;
  consultant: {
    full_name: string;
  };
  stripe_session_id?: string;
  stripe_payment_intent_id?: string;
}

interface BillingStats {
  totalSpent: number;
  pendingPayments: number;
  totalInvoices: number;
  successfulPayments: number;
  avgOrderValue: number;
}

const ClientBilling = () => {
  const { user, profile } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([]);
  const [billingStats, setBillingStats] = useState<BillingStats>({
    totalSpent: 0,
    pendingPayments: 0,
    totalInvoices: 0,
    successfulPayments: 0,
    avgOrderValue: 0
  });
  const [loading, setLoading] = useState(true);
  const [payingInvoice, setPayingInvoice] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [permissionError, setPermissionError] = useState(false);

  useEffect(() => {
    if (user && profile) {
      fetchBillingData();
    }
  }, [user, profile]);

  const fetchBillingData = async () => {
    try {
      setLoading(true);
      setError('');
      setPermissionError(false);
      
      // Get client ID first
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id, assigned_consultant_id')
        .eq('profile_id', user?.id)
        .maybeSingle();

      if (clientError) {
        console.error('Client fetch error:', clientError);
        if (clientError.code === 'PGRST116' || clientError.message?.includes('permission')) {
          setPermissionError(true);
          setError('Permission denied: Unable to access client data. Please ensure you have proper permissions.');
        } else {
          setError(`Unable to load client data: ${clientError.message}`);
        }
        return;
      }

      if (!clientData) {
        setError('Client record not found. Please ensure your account is properly configured.');
        return;
      }

      await Promise.all([
        fetchInvoices(clientData.id),
        fetchServiceOrders(clientData.id)
      ]);

    } catch (err) {
      console.error('Error fetching billing data:', err);
      setError(`An unexpected error occurred while loading billing data: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoices = async (clientId: string) => {
    try {
      const { data: invoicesData, error: invoicesError } = await supabase
        .from('invoices')
        .select(`
          *,
          service_order:service_orders(title, description)
        `)
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (invoicesError) {
        console.error('Invoices fetch error:', invoicesError);
        if (invoicesError.code === 'PGRST116' || invoicesError.message?.includes('permission')) {
          setError('Permission denied: Unable to access your invoices. Please check your account permissions.');
          setPermissionError(true);
        } else {
          setError(`Failed to load invoices: ${invoicesError.message}`);
        }
        return;
      }

      setInvoices(invoicesData || []);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError(`Error loading invoices: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const fetchServiceOrders = async (clientId: string) => {
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('service_orders')
        .select(`
          *,
          consultant:user_profiles!service_orders_consultant_id_fkey(full_name)
        `)
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Service orders fetch error:', ordersError);
        if (ordersError.code === 'PGRST116' || ordersError.message?.includes('permission')) {
          setError('Permission denied: Unable to access your service orders. Please check your account permissions.');
          setPermissionError(true);
        } else {
          setError(`Failed to load service orders: ${ordersError.message}`);
        }
        return;
      }

      setServiceOrders(ordersData || []);
      
      // Calculate billing statistics
      calculateBillingStats(invoicesData || [], ordersData || []);
    } catch (err) {
      console.error('Error fetching service orders:', err);
      setError(`Error loading service orders: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const calculateBillingStats = (invoicesData: Invoice[], ordersData: ServiceOrder[]) => {
    const paidInvoices = invoicesData.filter(inv => inv.status === 'paid');
    const pendingInvoices = invoicesData.filter(inv => inv.status === 'pending');
    
    const totalSpent = paidInvoices.reduce((sum, inv) => sum + inv.amount_due, 0);
    const pendingPayments = pendingInvoices.reduce((sum, inv) => sum + inv.amount_due, 0);
    
    const completedOrders = ordersData.filter(order => order.status === 'completed');
    const avgOrderValue = completedOrders.length > 0 
      ? completedOrders.reduce((sum, order) => sum + order.total_amount, 0) / completedOrders.length 
      : 0;

    setBillingStats({
      totalSpent,
      pendingPayments,
      totalInvoices: invoicesData.length,
      successfulPayments: paidInvoices.length,
      avgOrderValue
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
            title: invoice.service_order?.title || 'Invoice Payment',
            description: invoice.memo || invoice.service_order?.description || 'Consulting19 Service Payment',
            success_url: `${window.location.origin}/billing?payment=success&invoice_id=${invoice.id}`,
            cancel_url: `${window.location.origin}/billing?payment=cancelled`,
            metadata: {
              payment_type: 'invoice',
              invoice_id: invoice.id
            }
          }
        }
      );

      if (checkoutError) {
        throw checkoutError;
      }

      if (checkoutData?.url) {
        window.location.href = checkoutData.url;
      }

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'invoice_payment_initiated',
          description: `Payment initiated for invoice: ${invoice.memo}`,
          payload: {
            invoice_id: invoice.id,
            amount: invoice.amount_due,
            currency: invoice.currency
          }
        });

    } catch (err) {
      console.error('Payment initiation error:', err);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setPayingInvoice(null);
    }
  };

  const downloadInvoicePDF = async (invoice: Invoice) => {
    try {
      // Generate PDF invoice
      const { data: pdfData, error: pdfError } = await supabase.functions.invoke(
        'generate-invoice-pdf',
        {
          body: {
            invoice_id: invoice.id
          }
        }
      );

      if (pdfError) {
        throw pdfError;
      }

      // Download the PDF
      const blob = new Blob([pdfData], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoice.id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'failed': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'cancelled': return <X className="w-5 h-5 text-gray-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
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

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Billing & Payments - Client Portal</title>
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

        {/* Error Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                <span>{error}</span>
              </div>
              <button
                onClick={() => {
                  setError('');
                  setPermissionError(false);
                }}
                className="text-red-700 hover:text-red-900 ml-4"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {permissionError && (
              <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded text-sm">
                <p><strong>Permission Issue:</strong> This might be due to:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Missing RLS policies for invoices or service_orders tables</li>
                  <li>Inactive client status preventing data access</li>
                  <li>Database configuration issues</li>
                </ul>
                <p className="mt-2">Please contact your administrator to resolve this issue.</p>
              </div>
            )}
          </div>
        )}

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
                <p className="text-3xl font-bold text-yellow-600">${billingStats.pendingPayments.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                <p className="text-3xl font-bold text-blue-600">{billingStats.totalInvoices}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-3xl font-bold text-purple-600">${billingStats.avgOrderValue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Invoices */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Invoices</h2>
            <p className="text-sm text-gray-600">Your billing history and pending payments</p>
          </div>
          
          <div className="p-6">
            {invoices.length > 0 ? (
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(invoice.status)}
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {invoice.service_order?.title || invoice.memo}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {invoice.service_order?.description || `${invoice.payment_type.replace('_', ' ')}`}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Created: {new Date(invoice.created_at).toLocaleDateString()}</span>
                            {invoice.due_date && (
                              <span>Due: {new Date(invoice.due_date).toLocaleDateString()}</span>
                            )}
                            {invoice.paid_at && (
                              <span>Paid: {new Date(invoice.paid_at).toLocaleDateString()}</span>
                            )}
                          </div>
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
                      <button
                        onClick={() => downloadInvoicePDF(invoice)}
                        className="inline-flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download PDF
                      </button>
                      
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
                              Pay Now
                            </>
                          )}
                        </button>
                      )}
                      
                      {invoice.stripe_invoice_id && (
                        <button
                          onClick={() => window.open(`https://dashboard.stripe.com/invoices/${invoice.stripe_invoice_id}`, '_blank')}
                          className="inline-flex items-center px-3 py-2 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View in Stripe
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Invoices Yet</h3>
                <p className="text-gray-600 mb-6">
                  Your billing history will appear here once you start ordering services.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">💳 Secure Billing</h4>
                  <p className="text-xs text-blue-800">
                    All payments are processed securely through Stripe with industry-standard encryption.
                    You'll receive email confirmations for all transactions.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Service Orders History */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Service Orders</h2>
            <p className="text-sm text-gray-600">Complete history of your service purchases</p>
          </div>
          
          <div className="p-6">
            {serviceOrders.length > 0 ? (
              <div className="space-y-4">
                {serviceOrders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{order.title}</h3>
                          <p className="text-sm text-gray-600">{order.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Consultant: {order.consultant?.full_name}</span>
                            <span>•</span>
                            <span>Ordered: {new Date(order.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900">
                          ${order.total_amount.toLocaleString()} {order.currency}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => alert(`Order Details:\n\nTitle: ${order.title}\nDescription: ${order.description}\nAmount: $${order.total_amount} ${order.currency}\nStatus: ${order.status}\nConsultant: ${order.consultant?.full_name}\nCreated: ${new Date(order.created_at).toLocaleDateString()}`)}
                        className="inline-flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </button>
                      
                      {order.stripe_session_id && (
                        <button 
                          onClick={() => window.open(`https://dashboard.stripe.com/payments/${order.stripe_payment_intent_id}`, '_blank')}
                          className="inline-flex items-center px-3 py-2 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
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
                  Your service order history will appear here once you start purchasing services.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
                  <h4 className="text-sm font-semibold text-green-900 mb-2">🚀 Professional Services</h4>
                  <p className="text-xs text-green-800">
                    Browse available services from your consultant to start your international business expansion.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payment Methods Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-blue-900 mb-2">Secure Payments</h4>
              <p className="text-sm text-blue-800">
                All payments processed through Stripe with bank-level security
              </p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-green-900 mb-2">Instant Confirmations</h4>
              <p className="text-sm text-green-800">
                Get immediate email confirmations and receipt downloads
              </p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Building className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-purple-900 mb-2">Business Receipts</h4>
              <p className="text-sm text-purple-800">
                Professional invoices and receipts for your business records
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientBilling;
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  DollarSign, 
  CreditCard, 
  FileText, 
  Calendar, 
  CheckCircle,
  Clock,
  AlertTriangle,
  Download,
  Eye,
  TrendingUp,
  BarChart3,
  Target,
  PaymentMethod,
  Receipt,
  Archive,
  Truck
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface Invoice {
  id: string;
  amount_due: number;
  currency: string;
  status: string;
  due_date: string | null;
  memo: string | null;
  created_at: string;
  paid_at: string | null;
  service_order: {
    title: string;
    description: string;
    consultant: {
      full_name: string;
    };
  } | null;
}

interface ServiceOrder {
  id: string;
  title: string;
  description: string;
  total_amount: number;
  currency: string;
  status: string;
  created_at: string;
}

interface BillingStats {
  totalSpent: number;
  pendingInvoices: number;
  pendingAmount: number;
  overdueInvoices: number;
  paidThisMonth: number;
  totalOrders: number;
}

const ClientBilling = () => {
  const { user, profile } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([]);
  const [billingStats, setBillingStats] = useState<BillingStats>({
    totalSpent: 0,
    pendingInvoices: 0,
    pendingAmount: 0,
    overdueInvoices: 0,
    paidThisMonth: 0,
    totalOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('invoices');

  useEffect(() => {
    if (user && profile) {
      fetchBillingData();
    }
  }, [user, profile]);

  const fetchBillingData = async () => {
    try {
      setLoading(true);
      
      // Get client ID first
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id, assigned_consultant_id')
        .eq('profile_id', user?.id)
        .maybeSingle();

      if (clientError || !clientData) {
        console.error('Client fetch error:', clientError);
        return;
      }

      // Fetch invoices and service orders
      const [invoicesResult, ordersResult] = await Promise.all([
        supabase
          .from('invoices')
          .select(`
            *,
            service_order:service_orders!invoices_service_order_id_fkey(
              title,
              description,
              consultant:user_profiles!service_orders_consultant_id_fkey(full_name)
            )
          `)
          .eq('client_id', clientData.id)
          .order('created_at', { ascending: false }),
        
        supabase
          .from('service_orders')
          .select('*')
          .eq('client_id', clientData.id)
          .order('created_at', { ascending: false })
      ]);

      const invoicesData = invoicesResult.data || [];
      const ordersData = ordersResult.data || [];

      setInvoices(invoicesData);
      setServiceOrders(ordersData);

      // Calculate billing statistics
      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const paidInvoices = invoicesData.filter(inv => inv.status === 'paid');
      const pendingInvoices = invoicesData.filter(inv => inv.status === 'pending');
      const overdueInvoices = pendingInvoices.filter(inv => 
        inv.due_date && new Date(inv.due_date) < now
      );
      const paidThisMonth = paidInvoices.filter(inv => 
        inv.paid_at && new Date(inv.paid_at) >= thisMonthStart
      );

      setBillingStats({
        totalSpent: paidInvoices.reduce((sum, inv) => sum + inv.amount_due, 0),
        pendingInvoices: pendingInvoices.length,
        pendingAmount: pendingInvoices.reduce((sum, inv) => sum + inv.amount_due, 0),
        overdueInvoices: overdueInvoices.length,
        paidThisMonth: paidThisMonth.reduce((sum, inv) => sum + inv.amount_due, 0),
        totalOrders: ordersData.length
      });

    } catch (err) {
      console.error('Error fetching billing data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (invoiceId: string, amount: number) => {
    try {
      // Create Stripe checkout session
      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke(
        'create-stripe-checkout',
        {
          body: {
            amount: amount * 100, // Convert to cents
            currency: 'usd',
            title: 'Invoice Payment',
            description: `Payment for invoice ${invoiceId}`,
            service_order_id: invoiceId,
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
      alert('Failed to initiate payment. Please try again.');
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

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
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
          <p className="text-gray-600 mt-1">Manage your invoices and payment history</p>
        </div>

        {/* Billing Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(billingStats.totalSpent)}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Invoices</p>
                <p className="text-2xl font-bold text-yellow-600">{billingStats.pendingInvoices}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatCurrency(billingStats.pendingAmount)}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{billingStats.overdueInvoices}</p>
                <p className="text-xs text-gray-500 mt-1">Immediate action needed</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(billingStats.paidThisMonth)}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Invoices List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Invoices</h2>
            <p className="text-sm text-gray-600">Your payment history and pending invoices</p>
          </div>

          {invoices.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        invoice.status === 'paid' ? 'bg-green-100' :
                        isOverdue(invoice.due_date) ? 'bg-red-100' : 'bg-yellow-100'
                      }`}>
                        {invoice.status === 'paid' ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : isOverdue(invoice.due_date) ? (
                          <AlertTriangle className="w-6 h-6 text-red-600" />
                        ) : (
                          <Clock className="w-6 h-6 text-yellow-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {invoice.service_order?.title || 'Service Payment'}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {invoice.service_order?.description || 'Professional consulting service'}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Created: {new Date(invoice.created_at).toLocaleDateString()}</span>
                          {invoice.due_date && (
                            <span className={isOverdue(invoice.due_date) ? 'text-red-600 font-medium' : ''}>
                              Due: {new Date(invoice.due_date).toLocaleDateString()}
                            </span>
                          )}
                          {invoice.paid_at && (
                            <span className="text-green-600">
                              Paid: {new Date(invoice.paid_at).toLocaleDateString()}
                            </span>
                          )}
                          <span>From: {invoice.service_order?.consultant?.full_name || 'Consultant'}</span>
                        </div>
                        {invoice.memo && (
                          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded mt-2">
                            {invoice.memo}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {formatCurrency(invoice.amount_due, invoice.currency)}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button className="inline-flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </button>
                        <button className="inline-flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          <Download className="w-4 h-4 mr-1" />
                          PDF
                        </button>
                        {invoice.status === 'pending' && (
                          <button 
                            onClick={() => handlePayment(invoice.id, invoice.amount_due)}
                            className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                              isOverdue(invoice.due_date)
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            <CreditCard className="w-4 h-4 mr-1" />
                            {isOverdue(invoice.due_date) ? 'PAY NOW' : 'Pay'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Invoices Yet</h3>
              <p className="text-gray-600">
                Your consultant will create invoices for services you purchase.
              </p>
            </div>
          )}
        </div>

        {/* Payment Automation Info */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-8">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-indigo-900 mb-2">🤖 Smart Payment Automation</h3>
              <p className="text-indigo-800 mb-4">
                Our automated system helps you stay on top of payments:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-indigo-100">
                  <div className="text-sm font-semibold text-indigo-900 mb-1">📅 3-Day Reminders</div>
                  <div className="text-xs text-indigo-800">
                    Automatic notifications before payment due dates
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-indigo-100">
                  <div className="text-sm font-semibold text-indigo-900 mb-1">🚨 Overdue Alerts</div>
                  <div className="text-xs text-indigo-800">
                    Immediate notifications for past-due payments
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-indigo-100">
                  <div className="text-sm font-semibold text-indigo-900 mb-1">✅ Payment Confirmations</div>
                  <div className="text-xs text-indigo-800">
                    Instant notifications when payments are received
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientBilling;
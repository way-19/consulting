import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  Receipt, 
  Trophy, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  PieChart, 
  Zap, 
  ShoppingCart, 
  Send, 
  BarChart3, 
  DollarSign, 
  Clock,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  AlertTriangle,
  User,
  Calendar,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Percent
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface ServiceOrder {
  id: string;
  title: string;
  description: string;
  total_amount: number;
  currency: string;
  status: string;
  created_at: string;
  customer_details: any;
  consultant: {
    full_name: string;
  } | null;
}

interface BillingStats {
  totalSpent: number;
  pendingPayments: number;
  thisMonth: number;
  avgTransaction: number;
  trend: {
    current: number;
    previous: number;
    percentage: number;
    direction: 'up' | 'down' | 'stable';
  };
  paymentMethods: {
    stripe: { active: boolean; label: string; };
    wire: { active: boolean; label: string; };
    crypto: { active: boolean; label: string; };
  };
  transactionBreakdown: {
    company_formation: { amount: number; percentage: number; };
    tax_services: { amount: number; percentage: number; };
    banking: { amount: number; percentage: number; };
    legal: { amount: number; percentage: number; };
  };
}

const ClientBilling = () => {
  const { user, profile } = useAuth();
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [billingStats, setBillingStats] = useState<BillingStats>({
    totalSpent: 1500,
    pendingPayments: 0,
    thisMonth: 0,
    avgTransaction: 1500,
    trend: {
      current: 0,
      previous: 1500,
      percentage: 100,
      direction: 'down'
    },
    paymentMethods: {
      stripe: { active: true, label: 'Primary' },
      wire: { active: false, label: 'Coming Soon' },
      crypto: { active: false, label: 'Beta' }
    },
    transactionBreakdown: {
      company_formation: { amount: 2500, percentage: 45 },
      tax_services: { amount: 1800, percentage: 32 },
      banking: { amount: 800, percentage: 15 },
      legal: { amount: 450, percentage: 8 }
    }
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [generatingInvoice, setGeneratingInvoice] = useState<string | null>(null);
  const [sendingInvoice, setSendingInvoice] = useState<string | null>(null);

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
        console.error('Error fetching orders:', ordersError);
        return;
      }

      setOrders(ordersData || []);

      // Calculate billing statistics
      const currentMonth = new Date();
      currentMonth.setDate(1);
      const lastMonth = new Date(currentMonth);
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      const thisMonthOrders = (ordersData || []).filter(order => 
        new Date(order.created_at) >= currentMonth
      );
      const lastMonthOrders = (ordersData || []).filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate >= lastMonth && orderDate < currentMonth;
      });

      const thisMonthTotal = thisMonthOrders.reduce((sum, order) => sum + order.total_amount, 0);
      const lastMonthTotal = lastMonthOrders.reduce((sum, order) => sum + order.total_amount, 0);
      const totalSpent = (ordersData || []).reduce((sum, order) => 
        order.status === 'completed' ? sum + order.total_amount : sum, 0
      );
      const pendingPayments = (ordersData || []).filter(order => 
        order.status === 'pending'
      ).reduce((sum, order) => sum + order.total_amount, 0);

      const trendPercentage = lastMonthTotal > 0 
        ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
        : thisMonthTotal > 0 ? 100 : 0;

      setBillingStats(prev => ({
        ...prev,
        totalSpent,
        pendingPayments,
        thisMonth: thisMonthTotal,
        avgTransaction: totalSpent > 0 ? totalSpent / (ordersData?.length || 1) : 0,
        trend: {
          current: thisMonthTotal,
          previous: lastMonthTotal,
          percentage: Math.abs(trendPercentage),
          direction: trendPercentage > 5 ? 'up' : trendPercentage < -5 ? 'down' : 'stable'
        }
      }));

    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (orderId: string) => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      // Create Stripe checkout session
      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke(
        'create-stripe-checkout',
        {
          body: {
            service_order_id: orderId,
            amount: order.total_amount * 100, // Convert to cents
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
    }
  };

  const generateInvoicePDF = async (orderId: string) => {
    try {
      setGeneratingInvoice(orderId);
      
      const { data: pdfData, error: pdfError } = await supabase.functions.invoke(
        'generate-invoice-pdf',
        { body: { order_id: orderId } }
      );

      if (pdfError) {
        throw pdfError;
      }

      // Create download link
      const blob = new Blob([pdfData], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${orderId}.pdf`;
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
      
      const { error } = await supabase.functions.invoke('send-invoice-email', {
        body: {
          order_id: orderId,
          recipient_email: user?.email
        }
      });

      if (error) {
        throw error;
      }

      alert('Invoice sent to your email successfully!');
    } catch (err) {
      console.error('Email sending error:', err);
      alert('Failed to send email. Please try again.');
    } finally {
      setSendingInvoice(null);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Financial Dashboard - Client Portal</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
        <title>Financial Dashboard - Client Portal</title>
      </Helmet>
      
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Receipt className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Financial Dashboard</h1>
              <p className="text-gray-600">Manage payments, invoices, and financial analytics</p>
            </div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div className="text-xs font-medium text-green-600 mt-1">Average</div>
            <div className="text-xs text-gray-500">0% Success</div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-red-600 text-sm font-medium">-100%</div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(billingStats.totalSpent)}
            </div>
            <div className="text-sm text-gray-600">Total Investment</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="text-yellow-600 text-sm font-medium">100%</div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(billingStats.pendingPayments)}
            </div>
            <div className="text-sm text-gray-600">Pending Payments</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-blue-600 text-sm font-medium flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(billingStats.thisMonth)}
            </div>
            <div className="text-sm text-gray-600">This Month</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-purple-600 text-sm font-medium">⭐</div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(billingStats.avgTransaction)}
            </div>
            <div className="text-sm text-gray-600">Avg Transaction</div>
          </div>
        </div>

        {/* Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Spending Trend */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingDown className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Spending Trend</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">This Month</span>
                <span className="font-bold text-gray-900">{formatCurrency(billingStats.trend.current)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Last Month</span>
                <span className="font-bold text-gray-600">{formatCurrency(billingStats.trend.previous)}</span>
              </div>
              <div className="flex items-center justify-center p-3 bg-red-50 rounded-lg">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                  <TrendingDown className="w-4 h-4 text-white" />
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-red-600">-{billingStats.trend.percentage.toFixed(0)}%</div>
                  <div className="text-xs text-red-800 uppercase tracking-wide">DOWN</div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <CreditCard className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900">Stripe Checkout</span>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  {billingStats.paymentMethods.stripe.label}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Send className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">Wire Transfer</span>
                </div>
                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                  {billingStats.paymentMethods.wire.label}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">Crypto Payments</span>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  {billingStats.paymentMethods.crypto.label}
                </span>
              </div>
            </div>
          </div>

          {/* Transaction Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <PieChart className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">Transaction Breakdown</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Company Formation</span>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-gray-900">{formatCurrency(billingStats.transactionBreakdown.company_formation.amount)}</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${billingStats.transactionBreakdown.company_formation.percentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500">{billingStats.transactionBreakdown.company_formation.percentage}% of total spending</div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Tax Services</span>
                <span className="font-bold text-gray-900">{formatCurrency(billingStats.transactionBreakdown.tax_services.amount)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${billingStats.transactionBreakdown.tax_services.percentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500">{billingStats.transactionBreakdown.tax_services.percentage}% of total spending</div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Banking Setup</span>
                <span className="font-bold text-gray-900">{formatCurrency(billingStats.transactionBreakdown.banking.amount)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full" 
                  style={{ width: `${billingStats.transactionBreakdown.banking.percentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500">{billingStats.transactionBreakdown.banking.percentage}% of total spending</div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Legal Services</span>
                <span className="font-bold text-gray-900">{formatCurrency(billingStats.transactionBreakdown.legal.amount)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full" 
                  style={{ width: `${billingStats.transactionBreakdown.legal.percentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500">{billingStats.transactionBreakdown.legal.percentage}% of total spending</div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
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
        </div>

        {/* Financial History */}
        {filteredOrders.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Payment History ({filteredOrders.length})</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Receipt className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{order.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{order.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{new Date(order.created_at).toLocaleDateString()}</span>
                          {order.consultant && (
                            <span>• {order.consultant.full_name}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          {formatCurrency(order.total_amount, order.currency)}
                        </div>
                        <div className={`text-sm font-medium ${
                          order.status === 'paid' ? 'text-green-600' :
                          order.status === 'pending' ? 'text-yellow-600' :
                          order.status === 'failed' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {order.status.toUpperCase()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {order.status === 'pending' && (
                          <button 
                            onClick={() => handlePayment(order.id)}
                            className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <CreditCard className="w-4 h-4 mr-1" />
                            Pay Now
                          </button>
                        )}
                        <button 
                          onClick={() => generateInvoicePDF(order.id)}
                          disabled={generatingInvoice === order.id}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          {generatingInvoice === order.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-1"></div>
                          ) : (
                            <Download className="w-4 h-4 mr-1" />
                          )}
                          PDF
                        </button>
                        <button 
                          onClick={() => sendInvoiceEmail(order.id)}
                          disabled={sendingInvoice === order.id}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          {sendingInvoice === order.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-1"></div>
                          ) : (
                            <Send className="w-4 h-4 mr-1" />
                          )}
                          Email
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Receipt className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Financial History</h3>
            <p className="text-gray-600 mb-8">
              Your payment history and invoices will appear here once you start ordering services from your consultant.
            </p>
            <div className="flex justify-center space-x-4">
              <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Browse Services
              </button>
              <button className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Send className="w-5 h-5 mr-2" />
                Contact Consultant
              </button>
            </div>
          </div>
        )}

        {/* Payment History Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Payment History (2)</h2>
          </div>
          <div className="divide-y divide-gray-200">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Service Payment</h4>
                  <div className="text-sm text-gray-600">$2,500 USD • 05.09.2025</div>
                </div>
              </div>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                PENDING
              </span>
            </div>
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Service Payment</h4>
                  <div className="text-sm text-gray-600">$1,500 USD • 05.09.2025 • Paid: 10.09.2025</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  PAID
                </span>
                <button className="inline-flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Download className="w-4 h-4 mr-1" />
                  Receipt
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Insights - Dark Theme */}
        <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-teal-900 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <div className="flex items-center space-x-2 mb-8">
              <BarChart3 className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">Financial Insights</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <Percent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400">0%</div>
                    <div className="text-sm text-green-200">Payment Success Rate</div>
                  </div>
                </div>
                <p className="text-xs text-blue-200">Excellent payment reliability</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-400">{formatCurrency(billingStats.avgTransaction)}</div>
                    <div className="text-sm text-blue-200">Average Transaction</div>
                  </div>
                </div>
                <p className="text-xs text-blue-200">Your spending pattern</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400">{orders.length}</div>
                    <div className="text-sm text-purple-200">Service Orders</div>
                  </div>
                </div>
                <p className="text-xs text-blue-200">Total transactions</p>
              </div>
            </div>

            {/* Smart Financial Tips */}
            <div className="border-t border-white/10 pt-6">
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">Smart Financial Tips</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-yellow-500 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-3 h-3 text-white" />
                    </div>
                    <h4 className="font-semibold text-yellow-400">Tax Optimization</h4>
                  </div>
                  <p className="text-sm text-blue-200">
                    Business expenses may be tax-deductible. Consult with your advisor.
                  </p>
                </div>
                
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-3 h-3 text-white" />
                    </div>
                    <h4 className="font-semibold text-blue-400">Budget Planning</h4>
                  </div>
                  <p className="text-sm text-blue-200">
                    Your average transaction is {formatCurrency(billingStats.avgTransaction)}. Plan accordingly.
                  </p>
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
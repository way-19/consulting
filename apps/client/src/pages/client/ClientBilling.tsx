import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  ExternalLink,
  FileText,
  Eye,
  Send,
  Mail,
  TrendingUp,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  Banknote,
  Wallet,
  ShoppingCart,
  Star,
  Award,
  Zap,
  Activity
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface ServiceOrder {
  id: string;
  title: string;
  description: string;
  total_amount: number;
  currency: string;
  status: string;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  created_at: string;
  updated_at: string;
  consultant: {
    full_name: string;
  };
  custom_service: {
    title_i18n: any;
    billing_type: string;
  } | null;
}

interface Invoice {
  id: string;
  service_order_id: string;
  amount_due: number;
  currency: string;
  status: string;
  stripe_invoice_id: string;
  stripe_payment_intent: string;
  paid_at: string;
  created_at: string;
  service_order: {
    title: string;
  };
}

interface FinancialStats {
  total_spent: number;
  pending_amount: number;
  paid_this_month: number;
  avg_transaction: number;
  payment_success_rate: number;
  spending_trend: {
    this_month: number;
    last_month: number;
    trend: 'up' | 'down' | 'stable';
    percentage: number;
  };
}

const ClientBilling = () => {
  const { user, profile } = useAuth();
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [financialStats, setFinancialStats] = useState<FinancialStats>({
    total_spent: 0,
    pending_amount: 0,
    paid_this_month: 0,
    avg_transaction: 0,
    payment_success_rate: 0,
    spending_trend: { this_month: 0, last_month: 0, trend: 'stable', percentage: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
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

      if (clientError) {
        console.error('❌ Client fetch error:', clientError);
        setError('Database error occurred');
        return;
      }

      if (!clientData) {
        console.log('❌ No client record found for this user');
        setError('Client record not found');
        return;
      }

      // Fetch service orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('service_orders')
        .select(`
          *,
          consultant:user_profiles!service_orders_consultant_id_fkey(full_name),
          custom_service:custom_services(title_i18n, billing_type)
        `)
        .eq('client_id', clientData.id)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        setError('Unable to fetch billing data');
        return;
      }

      // Fetch invoices
      const { data: invoicesData, error: invoicesError } = await supabase
        .from('invoices')
        .select(`
          *,
          service_order:service_orders(title)
        `)
        .eq('client_id', clientData.id)
        .order('created_at', { ascending: false });

      if (invoicesError) {
        console.error('Error fetching invoices:', invoicesError);
      } else {
        setInvoices(invoicesData || []);
      }

      setOrders(ordersData || []);
      calculateFinancialStats(ordersData || [], invoicesData || []);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const calculateFinancialStats = (ordersData: ServiceOrder[], invoicesData: Invoice[]) => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const paidInvoices = invoicesData.filter(i => i.status === 'paid');
    const totalSpent = paidInvoices.reduce((sum, i) => sum + i.amount_due, 0);
    const pendingAmount = ordersData.filter(o => o.status === 'pending').reduce((sum, o) => sum + o.total_amount, 0);
    
    const thisMonthPaid = paidInvoices.filter(i => new Date(i.paid_at) >= thisMonth).reduce((sum, i) => sum + i.amount_due, 0);
    const lastMonthPaid = paidInvoices.filter(i => {
      const paidDate = new Date(i.paid_at);
      return paidDate >= lastMonth && paidDate < thisMonth;
    }).reduce((sum, i) => sum + i.amount_due, 0);

    const avgTransaction = paidInvoices.length > 0 ? totalSpent / paidInvoices.length : 0;
    const paymentSuccessRate = ordersData.length > 0 ? (paidInvoices.length / ordersData.length) * 100 : 0;

    const trendPercentage = lastMonthPaid > 0 
      ? ((thisMonthPaid - lastMonthPaid) / lastMonthPaid) * 100 
      : thisMonthPaid > 0 ? 100 : 0;

    const spendingTrend = {
      this_month: thisMonthPaid,
      last_month: lastMonthPaid,
      trend: trendPercentage > 5 ? 'up' : trendPercentage < -5 ? 'down' : 'stable',
      percentage: Math.abs(trendPercentage)
    };

    setFinancialStats({
      total_spent: totalSpent,
      pending_amount: pendingAmount,
      paid_this_month: thisMonthPaid,
      avg_transaction: avgTransaction,
      payment_success_rate: paymentSuccessRate,
      spending_trend: spendingTrend
    });
  };

  const handlePayment = async (order: ServiceOrder) => {
    try {
      // Create Stripe Checkout Session
      const checkoutData = {
        service_order_id: order.id,
        amount: Math.round(order.total_amount * 100), // Convert to cents
        currency: order.currency.toLowerCase(),
        title: order.title,
        description: order.description,
        success_url: `${window.location.origin}/billing?payment=success`,
        cancel_url: `${window.location.origin}/billing?payment=cancelled`
      };

      // Call Stripe checkout edge function
      const { data: sessionData, error: sessionError } = await supabase.functions.invoke(
        'create-stripe-checkout',
        { body: checkoutData }
      );

      if (sessionError) {
        throw sessionError;
      }

      // Redirect to Stripe Checkout
      if (sessionData?.url) {
        window.location.href = sessionData.url;
      }

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'payment_initiated',
          description: `Initiated payment for: ${order.title}`,
          payload: { 
            order_id: order.id,
            amount: order.total_amount,
            currency: order.currency
          }
        });

    } catch (err) {
      console.error('Payment error:', err);
      alert('Failed to initiate payment. Please try again.');
    }
  };

  const generateInvoicePDF = async (orderId: string) => {
    try {
      setGeneratingInvoice(orderId);

      // Call edge function to generate PDF
      const { data: pdfData, error: pdfError } = await supabase.functions.invoke(
        'generate-invoice-pdf',
        {
          body: { order_id: orderId }
        }
      );

      if (pdfError) {
        throw pdfError;
      }

      // Download PDF
      const blob = new Blob([pdfData], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `invoice-${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'invoice_downloaded',
          description: `Downloaded invoice PDF for order: ${orderId}`,
          payload: { order_id: orderId }
        });

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

      // Call edge function to send email
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

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'invoice_emailed',
          description: `Emailed invoice for order: ${orderId}`,
          payload: { order_id: orderId, email: user?.email }
        });

      alert('Invoice sent to your email successfully!');
    } catch (err) {
      console.error('Email sending error:', err);
      alert('Failed to send email. Please try again.');
    } finally {
      setSendingInvoice(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'cancelled': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default: return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUpRight className="w-5 h-5 text-green-600" />;
      case 'down': return <ArrowDownRight className="w-5 h-5 text-red-600" />;
      default: return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.consultant?.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Billing & Invoices - Client Portal</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
        <title>Billing & Financial Analytics - Client Portal</title>
      </Helmet>
      
      <div className="space-y-8">
        {/* Hero Financial Dashboard */}
        <div className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-3xl p-8 border border-green-200">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-200/30 to-emerald-200/30 rounded-full -translate-y-32 translate-x-32"></div>
          
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <Wallet className="w-8 h-8 mr-3 text-green-600" />
                  Financial Dashboard
                </h1>
                <p className="text-gray-600 text-lg mt-2">Manage payments, invoices, and financial analytics</p>
              </div>
              
              {/* Financial Health Badge */}
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-xl mb-2">
                  <Award className="w-10 h-10 text-white" />
                </div>
                <div className="font-bold text-gray-900">
                  {financialStats.payment_success_rate > 90 ? 'Excellent' : 
                   financialStats.payment_success_rate > 75 ? 'Good' : 'Average'}
                </div>
                <div className="text-sm text-gray-600">{financialStats.payment_success_rate.toFixed(0)}% Success</div>
              </div>
            </div>

            {/* Key Financial Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(financialStats.spending_trend.trend)}
                    <span className="text-sm font-medium text-gray-600">
                      {financialStats.spending_trend.percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  ${financialStats.total_spent.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Investment</div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <Zap className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  ${financialStats.pending_amount.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Pending Payments</div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  ${financialStats.paid_this_month.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">This Month</div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  </div>
                  <Star className="w-5 h-5 text-purple-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  ${financialStats.avg_transaction.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Avg Transaction</div>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Financial Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Spending Trend */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                Spending Trend
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">This Month</span>
                <span className="font-bold text-2xl text-gray-900">
                  ${financialStats.spending_trend.this_month.toLocaleString()}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Last Month</span>
                <span className="font-bold text-gray-600">
                  ${financialStats.spending_trend.last_month.toLocaleString()}
                </span>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-2 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    financialStats.spending_trend.trend === 'up' ? 'bg-green-500' :
                    financialStats.spending_trend.trend === 'down' ? 'bg-red-500' : 'bg-gray-500'
                  }`}>
                    {getTrendIcon(financialStats.spending_trend.trend)}
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${
                      financialStats.spending_trend.trend === 'up' ? 'text-green-600' :
                      financialStats.spending_trend.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {financialStats.spending_trend.trend === 'stable' ? '±0' : 
                       financialStats.spending_trend.trend === 'up' ? '+' : '-'}{financialStats.spending_trend.percentage.toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">
                      {financialStats.spending_trend.trend}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-purple-600" />
                Payment Methods
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-900">Stripe Checkout</span>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Primary
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg opacity-60">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Banknote className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="font-medium text-gray-900">Wire Transfer</span>
                </div>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  Coming Soon
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg opacity-60">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Wallet className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="font-medium text-gray-900">Crypto Payments</span>
                </div>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  Beta
                </span>
              </div>
            </div>
          </div>

          {/* Transaction Categories */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <PieChart className="w-5 h-5 mr-2 text-orange-600" />
                Transaction Breakdown
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              {[
                { category: 'Company Formation', amount: 2500, color: 'bg-blue-500', percentage: 45 },
                { category: 'Tax Services', amount: 1800, color: 'bg-green-500', percentage: 32 },
                { category: 'Banking Setup', amount: 800, color: 'bg-purple-500', percentage: 15 },
                { category: 'Legal Services', amount: 450, color: 'bg-orange-500', percentage: 8 }
              ].map((cat, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{cat.category}</span>
                    <span className="text-sm font-bold text-gray-900">${cat.amount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${cat.color} h-2 rounded-full transition-all duration-700`}
                      style={{ width: `${cat.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">{cat.percentage}% of total spending</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending Payment</option>
              <option value="paid">Paid</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Enhanced Orders/Invoices List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    {getStatusIcon(order.status)}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{order.title}</h3>
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
                        className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
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

        {/* Payment History */}
        {invoices.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Receipt className="w-6 h-6 mr-2 text-gray-600" />
                Payment History ({invoices.length})
              </h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {invoice.service_order?.title || 'Service Payment'}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="font-bold text-green-600">
                            ${invoice.amount_due.toLocaleString()} {invoice.currency}
                          </span>
                          <span>•</span>
                          <span>{new Date(invoice.created_at).toLocaleDateString()}</span>
                          {invoice.paid_at && (
                            <>
                              <span>•</span>
                              <span>Paid: {new Date(invoice.paid_at).toLocaleDateString()}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-xl text-sm font-semibold ${getStatusColor(invoice.status)}`}>
                        {invoice.status.toUpperCase()}
                      </span>
                      {invoice.status === 'paid' && invoice.stripe_payment_intent && (
                        <button className="inline-flex items-center px-3 py-2 text-sm bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors">
                          <Download className="w-4 h-4 mr-1" />
                          Receipt
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Financial Insights */}
        <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 rounded-2xl shadow-xl text-white overflow-hidden">
          <div className="relative p-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-full -translate-y-32 translate-x-32"></div>
            
            <div className="relative">
              <div className="flex items-center space-x-3 mb-6">
                <BarChart3 className="w-8 h-8 text-green-400" />
                <h2 className="text-2xl font-bold">Financial Insights</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-green-400">
                      {financialStats.payment_success_rate.toFixed(0)}%
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Payment Success Rate</p>
                    <p className="text-sm text-gray-300">Excellent payment reliability</p>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-blue-400">
                      ${financialStats.avg_transaction.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Average Transaction</p>
                    <p className="text-sm text-gray-300">Your spending pattern</p>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-purple-400">
                      {orders.length}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Service Orders</p>
                    <p className="text-sm text-gray-300">Total transactions</p>
                  </div>
                </div>
              </div>

              {/* Financial Tips */}
              <div className="mt-8 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                  Smart Financial Tips
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-medium mb-2">💰 Tax Optimization</h4>
                    <p className="text-sm text-gray-300">Business expenses may be tax-deductible. Consult with your advisor.</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-medium mb-2">📊 Budget Planning</h4>
                    <p className="text-sm text-gray-300">Your average transaction is ${financialStats.avg_transaction.toLocaleString()}. Plan accordingly.</p>
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
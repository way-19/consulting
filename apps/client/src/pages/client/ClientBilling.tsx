import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  Receipt, 
  DollarSign, 
  CreditCard, 
  Clock,
  TrendingDown,
  TrendingUp,
  Trophy,
  PieChart,
  BarChart3,
  ShoppingCart,
  Send,
  Download,
  Eye,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Zap,
  Building,
  User,
  Search,
  Filter
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface Invoice {
  id: string;
  amount_due: number;
  currency: string;
  status: string;
  due_date: string;
  memo: string;
  created_at: string;
  paid_at: string | null;
  service_order: {
    title: string;
    description: string;
  } | null;
}

interface ServiceOrder {
  id: string;
  title: string;
  total_amount: number;
  currency: string;
  status: string;
  created_at: string;
}

const ClientBilling = () => {
  const { user, profile } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [generatingInvoice, setGeneratingInvoice] = useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);

  // Financial Stats
  const [totalSpent, setTotalSpent] = useState(1500);
  const [pendingAmount, setPendingAmount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [overdueAmount, setOverdueAmount] = useState(0);

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

      // Fetch invoices for this client
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
        .select('*')
        .eq('client_id', clientData.id)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Orders fetch error:', ordersError);
      } else {
        setServiceOrders(ordersData || []);
      }

      // Calculate financial stats
      const allInvoices = invoicesData || [];
      const paidTotal = allInvoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount_due, 0);
      const pendingTotal = allInvoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount_due, 0);
      const pendingCount = allInvoices.filter(i => i.status === 'pending').length;
      
      // Calculate overdue amount
      const overdueTotal = allInvoices.filter(i => 
        i.status === 'pending' && 
        i.due_date && 
        new Date(i.due_date) < new Date()
      ).reduce((sum, i) => sum + i.amount_due, 0);

      setTotalSpent(paidTotal + 1500); // Add mock historical spending
      setPendingAmount(pendingTotal);
      setPendingCount(pendingCount);
      setOverdueAmount(overdueTotal);

    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getUpcomingPayments = () => {
    const today = new Date();
    const next30Days = new Date();
    next30Days.setDate(today.getDate() + 30);

    return invoices.filter(invoice => 
      invoice.status === 'pending' && 
      invoice.due_date &&
      new Date(invoice.due_date) >= today &&
      new Date(invoice.due_date) <= next30Days
    ).sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
  };

  const getOverduePayments = () => {
    const today = new Date();
    
    return invoices.filter(invoice => 
      invoice.status === 'pending' && 
      invoice.due_date &&
      new Date(invoice.due_date) < today
    );
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPaymentTimeline = () => {
    const timeline = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dailyPayments = invoices.filter(invoice => {
        if (!invoice.due_date || invoice.status !== 'pending') return false;
        const dueDate = new Date(invoice.due_date);
        return dueDate.toDateString() === date.toDateString();
      });

      const totalAmount = dailyPayments.reduce((sum, inv) => sum + inv.amount_due, 0);
      
      timeline.push({
        date,
        amount: totalAmount,
        count: dailyPayments.length,
        isToday: date.toDateString() === today.toDateString(),
        isUrgent: i <= 7 && totalAmount > 0
      });
    }
    
    return timeline;
  };

  const handleInvoicePayment = async (invoiceId: string) => {
    try {
      setProcessingPayment(invoiceId);

      // Create Stripe checkout for this specific invoice
      const invoice = invoices.find(i => i.id === invoiceId);
      if (!invoice) return;

      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke(
        'create-stripe-checkout',
        {
          body: {
            amount: Math.round(invoice.amount_due * 100), // Convert to cents
            currency: (invoice.currency || 'USD').toLowerCase(),
            title: `Invoice Payment - ${invoice.service_order?.title || 'Service'}`,
            description: invoice.memo || 'Invoice payment',
            service_order_id: invoice.service_order?.id,
            success_url: `${window.location.origin}/billing?payment=success&invoice=${invoiceId}`,
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

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'invoice_payment_initiated',
          description: `Initiated payment for invoice: ${invoice.service_order?.title}`,
          payload: { 
            invoice_id: invoiceId,
            amount: invoice.amount_due,
            currency: invoice.currency
          }
        });

    } catch (err) {
      console.error('Payment initiation error:', err);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setProcessingPayment(null);
    }
  };

  const generateInvoicePDF = async (orderId: string) => {
    try {
      setGeneratingInvoice(orderId);

      const { data, error } = await supabase.functions.invoke('generate-invoice-pdf', {
        body: { order_id: orderId }
      });

      if (error) {
        throw error;
      }

      // In a real implementation, this would download the PDF
      console.log('Invoice PDF generated for order:', orderId);
      alert('Invoice PDF generated successfully!');
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setGeneratingInvoice(null);
    }
  };

  const upcomingPayments = getUpcomingPayments();
  const overduePayments = getOverduePayments();
  const paymentTimeline = getPaymentTimeline();

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.service_order?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.memo?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
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
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Receipt className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Financial Dashboard</h1>
            <p className="text-gray-600">Manage payments, invoices, and financial analytics</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-3xl font-bold text-gray-900">${totalSpent.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                <p className="text-3xl font-bold text-orange-600">${pendingAmount.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open Invoices</p>
                <p className="text-3xl font-bold text-blue-600">{pendingCount}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <Receipt className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Payment Methods</p>
                <p className="text-3xl font-bold text-purple-600">2</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Overdue Payments Alert */}
        {overduePayments.length > 0 && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center animate-bounce">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-900 mb-2">
                  ⚠️ Urgent: {overduePayments.length} Overdue Payment(s)
                </h3>
                <p className="text-red-800 mb-4">
                  You have ${overdueAmount.toLocaleString()} in overdue payments. Please pay immediately to avoid service interruption.
                </p>
                <div className="space-y-3">
                  {overduePayments.map((invoice) => (
                    <div key={invoice.id} className="bg-white rounded-lg p-4 border border-red-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">{invoice.service_order?.title || 'Service Payment'}</h4>
                          <p className="text-sm text-red-600">
                            Due: {new Date(invoice.due_date).toLocaleDateString()} 
                            ({Math.abs(getDaysUntilDue(invoice.due_date))} days overdue)
                          </p>
                        </div>
                        <button
                          onClick={() => handleInvoicePayment(invoice.id)}
                          disabled={processingPayment === invoice.id}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-bold animate-bounce"
                        >
                          PAY NOW! ${invoice.amount_due}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Spending Trend */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-gray-600" />
                Spending Trend
              </h2>
            </div>
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
                  <TrendingDown className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">-100% DOWN</div>
                  <div className="text-sm text-gray-600">vs last month</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">This Month</span>
                  <span className="font-bold">${pendingAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Month</span>
                  <span className="font-bold">$1,500</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-red-500 h-3 rounded-full w-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-gray-600" />
                Payment Methods
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-bold">💳</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">•••• 4242</div>
                      <div className="text-sm text-gray-600">Primary</div>
                    </div>
                  </div>
                  <span className="text-green-600 text-sm font-medium">Active</span>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-bold">🏦</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Bank Transfer</div>
                      <div className="text-sm text-gray-600">IBAN: DE89...</div>
                    </div>
                  </div>
                  <span className="text-gray-600 text-sm font-medium">Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Payments Section */}
        {upcomingPayments.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="px-8 py-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Calendar className="w-6 h-6 mr-2 text-orange-500" />
                Upcoming Payments ({upcomingPayments.length})
              </h2>
              <p className="text-sm text-gray-600 mt-1">Payments scheduled for the next 30 days</p>
            </div>

            <div className="p-8 space-y-4">
              {upcomingPayments.map((invoice) => {
                const daysUntil = getDaysUntilDue(invoice.due_date);
                const isUrgent = daysUntil <= 7;
                
                return (
                  <div 
                    key={invoice.id} 
                    className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                      isUrgent 
                        ? 'border-red-300 bg-red-50 animate-pulse' 
                        : 'border-orange-200 bg-orange-50 hover:bg-orange-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                          isUrgent ? 'bg-red-500' : 'bg-orange-500'
                        }`}>
                          <Receipt className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {invoice.service_order?.title || 'Service Payment'}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className={`font-medium ${isUrgent ? 'text-red-600' : 'text-orange-600'}`}>
                              Due: {new Date(invoice.due_date).toLocaleDateString()}
                            </span>
                            <span className="text-gray-600">
                              ({daysUntil === 0 ? 'Due today!' : 
                                daysUntil === 1 ? 'Due tomorrow!' : 
                                `${daysUntil} days left`})
                            </span>
                            <span className="text-gray-900 font-bold">
                              ${invoice.amount_due.toLocaleString()} {invoice.currency}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {isUrgent ? (
                          <button
                            onClick={() => handleInvoicePayment(invoice.id)}
                            disabled={processingPayment === invoice.id}
                            className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 font-bold animate-bounce shadow-lg hover:shadow-xl transform hover:scale-105"
                          >
                            {processingPayment === invoice.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                              'PAY NOW!'
                            )}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleInvoicePayment(invoice.id)}
                            disabled={processingPayment === invoice.id}
                            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                          >
                            Pay Early
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Payment Timeline Calendar */}
        {paymentTimeline.some(day => day.amount > 0) && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="px-8 py-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Calendar className="w-6 h-6 mr-2 text-blue-500" />
                Payment Timeline (Next 14 Days)
              </h2>
              <p className="text-sm text-gray-600 mt-1">Your upcoming payment schedule</p>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-7 gap-3">
                {paymentTimeline.map((day, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl text-center transition-all duration-200 ${
                      day.isToday 
                        ? 'bg-blue-100 border-2 border-blue-400 shadow-lg' :
                      day.isUrgent && day.amount > 0
                        ? 'bg-red-100 border border-red-300' :
                      day.amount > 0 
                        ? 'bg-orange-100 border border-orange-200 hover:bg-orange-200' :
                        'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className={`text-xs font-medium ${
                      day.isToday ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {day.date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className={`text-lg font-bold ${
                      day.isToday ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {day.date.getDate()}
                    </div>
                    {day.amount > 0 && (
                      <div className="mt-2">
                        <div className={`text-xs font-bold ${
                          day.isUrgent ? 'text-red-600' : 
                          day.isToday ? 'text-blue-600' : 'text-orange-600'
                        }`}>
                          ${day.amount.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {day.count} payment{day.count !== 1 ? 's' : ''}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Transaction Breakdown */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <PieChart className="w-5 h-5 mr-2 text-gray-600" />
                Transaction Breakdown
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Company Formation</span>
                  </div>
                  <span className="font-bold">$800</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full w-4/5"></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Banking Setup</span>
                  </div>
                  <span className="font-bold">$400</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full w-2/5"></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-700">Consulting</span>
                  </div>
                  <span className="font-bold">$300</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full w-1/3"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Insights */}
          <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Zap className="w-6 h-6 mr-2 text-yellow-400" />
                Financial Insights
              </h2>
              
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center space-x-3 mb-3">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <span className="text-white font-semibold">Smart Spending</span>
                  </div>
                  <p className="text-blue-100 text-sm">
                    {overdueAmount > 0 
                      ? `You have $${overdueAmount.toLocaleString()} overdue. Pay immediately to maintain good standing.`
                      : pendingAmount > 0
                        ? `You have $${pendingAmount.toLocaleString()} in upcoming payments this month.`
                        : 'Your account is current! Great job maintaining timely payments.'
                    }
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center space-x-3 mb-3">
                    <BarChart3 className="w-5 h-5 text-green-400" />
                    <span className="text-white font-semibold">Next Payment</span>
                  </div>
                  <p className="text-blue-100 text-sm">
                    {upcomingPayments.length > 0 
                      ? `Your next payment of $${upcomingPayments[0].amount_due} is due ${new Date(upcomingPayments[0].due_date).toLocaleDateString()}`
                      : 'No upcoming payments scheduled.'
                    }
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center space-x-3 mb-3">
                    <PieChart className="w-5 h-5 text-purple-400" />
                    <span className="text-white font-semibold">Spending Pattern</span>
                  </div>
                  <p className="text-blue-100 text-sm">
                    Most spending on company formation services. Consider bundled packages for better savings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* All Transactions */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">All Transactions</h2>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {filteredInvoices.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <div key={invoice.id} className="px-8 py-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        invoice.status === 'paid' ? 'bg-green-100' :
                        invoice.status === 'pending' ? 'bg-orange-100' : 'bg-gray-100'
                      }`}>
                        <Receipt className={`w-6 h-6 ${
                          invoice.status === 'paid' ? 'text-green-600' :
                          invoice.status === 'pending' ? 'text-orange-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {invoice.service_order?.title || 'Service Payment'}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{new Date(invoice.created_at).toLocaleDateString()}</span>
                          {invoice.due_date && (
                            <>
                              <span>•</span>
                              <span>Due: {new Date(invoice.due_date).toLocaleDateString()}</span>
                            </>
                          )}
                          <span>•</span>
                          <span className="font-medium">${invoice.amount_due.toLocaleString()} {invoice.currency}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                        invoice.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                        invoice.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {invoice.status}
                      </span>
                      
                      <div className="flex items-center space-x-2">
                        {invoice.status === 'pending' && (
                          <button
                            onClick={() => handleInvoicePayment(invoice.id)}
                            disabled={processingPayment === invoice.id}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            {processingPayment === invoice.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                              'Pay Now'
                            )}
                          </button>
                        )}
                        
                        <button
                          onClick={() => generateInvoicePDF(invoice.service_order?.id || invoice.id)}
                          disabled={generatingInvoice === invoice.id}
                          className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          {generatingInvoice === invoice.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                          ) : (
                            <Download className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <Receipt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Transactions Yet</h3>
              <p className="text-gray-600 mb-6">
                Your payment history and invoices will appear here once you start using our services.
              </p>
              <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Browse Services
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ClientBilling;
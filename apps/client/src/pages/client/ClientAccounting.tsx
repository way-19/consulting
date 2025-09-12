import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Search,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  BarChart3,
  PieChart,
  Target,
  RefreshCw,
  Building,
  CreditCard,
  Percent,
  Bell,
  ExternalLink,
  Download,
  Users,
  Award,
  Star,
  FileText
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface FinancialStats {
  total_revenue: number;
  monthly_revenue: number;
  commission_earned: number;
  pending_commission: number;
  avg_order_value: number;
  total_orders: number;
  completed_orders: number;
  conversion_rate: number;
  client_count: number;
  active_clients: number;
}

interface ServiceOrder {
  id: string;
  title: string;
  description?: string;
  total_amount: number;
  currency: string;
  status: string;
  consultant_commission_amount: number;
  system_commission_amount: number;
  created_at: string;
  client: {
    profile: {
      full_name: string;
    };
    company_name?: string;
  };
}

interface CommissionBreakdown {
  total_earned: number;
  this_month: number;
  last_month: number;
  pending: number;
  rate: number;
  currency: string;
}

interface AccountingFee {
  id: string;
  amount_due: number;
  currency: string;
  status: string;
  memo: string;
  due_date: string;
  created_at: string;
  paid_at?: string;
}

interface VirtualOfficeFee {
  id: string;
  amount_due: number;
  currency: string;
  status: string;
  memo: string;
  due_date: string;
  created_at: string;
  paid_at?: string;
}

interface TaxNotification {
  id: string;
  type: string;
  payload: {
    tax_type?: string;
    amount?: number;
    currency?: string;
    due_date?: string;
    description?: string;
  };
  read_at: string | null;
  created_at: string;
}

const ConsultantFinancialDashboard = () => {
  const { user, profile } = useAuth();
  const [financialStats, setFinancialStats] = useState<FinancialStats>({
    total_revenue: 0,
    monthly_revenue: 0,
    commission_earned: 0,
    pending_commission: 0,
    avg_order_value: 0,
    total_orders: 0,
    completed_orders: 0,
    conversion_rate: 0,
    client_count: 0,
    active_clients: 0
  });
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([]);
  const [commissionBreakdown, setCommissionBreakdown] = useState<CommissionBreakdown>({
    total_earned: 0,
    this_month: 0,
    last_month: 0,
    pending: 0,
    rate: 65,
    currency: 'USD'
  });
  const [accountingFees, setAccountingFees] = useState<AccountingFee[]>([]);
  const [virtualOfficeFees, setVirtualOfficeFees] = useState<VirtualOfficeFee[]>([]);
  const [taxNotifications, setTaxNotifications] = useState<TaxNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('this_month');
  const [payingFee, setPayingFee] = useState<string | null>(null);

  useEffect(() => {
    if (user && profile) {
      fetchFinancialData();
    }
  }, [user, profile, dateRange]);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      
      // Fetch service orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('service_orders')
        .select(`
          *,
          client:clients!service_orders_client_id_fkey(
            profile:user_profiles!clients_profile_id_fkey(full_name),
            company_name
          )
        `)
        .eq('consultant_id', user?.id)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Error fetching service orders:', ordersError);
      } else {
        setServiceOrders(ordersData || []);
        calculateFinancialStats(ordersData || []);
      }

      // Fetch commission breakdown
      const completedOrders = (ordersData || []).filter(o => o.status === 'completed');
      const totalEarned = completedOrders.reduce((sum, o) => sum + (o.consultant_commission_amount || 0), 0);
      
      // Calculate this month's commission
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const thisMonthOrders = completedOrders.filter(o => new Date(o.created_at) >= thisMonth);
      const thisMonthEarned = thisMonthOrders.reduce((sum, o) => sum + (o.consultant_commission_amount || 0), 0);

      setCommissionBreakdown({
        total_earned: totalEarned,
        this_month: thisMonthEarned,
        last_month: 0, // Would calculate from previous month
        pending: (ordersData || []).filter(o => o.status === 'pending').reduce((sum, o) => sum + (o.consultant_commission_amount || 0), 0),
        rate: profile?.commission_rate || 65,
        currency: 'USD'
      });

      // Fetch accounting fees
      const { data: accountingData } = await supabase
        .from('invoices')
        .select('*')
        .eq('payment_type', 'accounting_fee')
        .order('created_at', { ascending: false });
      
      setAccountingFees(accountingData || []);

      // Fetch virtual office fees
      const { data: virtualOfficeData } = await supabase
        .from('invoices')
        .select('*')
        .eq('payment_type', 'virtual_office_fee')
        .order('created_at', { ascending: false });
      
      setVirtualOfficeFees(virtualOfficeData || []);

    } catch (err) {
      console.error('Error fetching financial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateFinancialStats = (orders: ServiceOrder[]) => {
    const completedOrders = orders.filter(o => o.status === 'completed');
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total_amount, 0);
    const commissionEarned = completedOrders.reduce((sum, o) => sum + (o.consultant_commission_amount || 0), 0);

    // Calculate monthly revenue
    const thisMonth = new Date();
    thisMonth.setDate(1);
    const monthlyOrders = completedOrders.filter(o => new Date(o.created_at) >= thisMonth);
    const monthlyRevenue = monthlyOrders.reduce((sum, o) => sum + o.total_amount, 0);

    setFinancialStats({
      total_revenue: totalRevenue,
      monthly_revenue: monthlyRevenue,
      commission_earned: commissionEarned,
      pending_commission: orders.filter(o => o.status === 'pending').reduce((sum, o) => sum + (o.consultant_commission_amount || 0), 0),
      avg_order_value: completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0,
      total_orders: orders.length,
      completed_orders: completedOrders.length,
      conversion_rate: orders.length > 0 ? (completedOrders.length / orders.length) * 100 : 0,
      client_count: 0, // Would fetch from clients table
      active_clients: 0
    });
  };

  const filteredOrders = serviceOrders.filter(order => {
    const matchesSearch = 
      order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.client.profile.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    let matchesDate = true;
    if (dateRange !== 'all') {
      const orderDate = new Date(order.created_at);
      const now = new Date();
      
      switch (dateRange) {
        case 'this_month':
          matchesDate = orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
          break;
        case 'last_month':
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          matchesDate = orderDate.getMonth() === lastMonth.getMonth() && orderDate.getFullYear() === lastMonth.getFullYear();
          break;
        case 'this_year':
          matchesDate = orderDate.getFullYear() === now.getFullYear();
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Financial Dashboard - Consultant</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Financial Dashboard</h1>
              <p className="text-gray-600">Track your earnings, commissions, and financial performance</p>
            </div>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Refresh Data
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Financial Dashboard - Consultant</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Financial Dashboard</h1>
            <p className="text-gray-600">Track your earnings, commissions, and financial performance</p>
          </div>
          <button 
            onClick={fetchFinancialData}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </button>
        </div>

        {/* Financial Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">${financialStats.total_revenue.toLocaleString()}</p>
                <p className="text-xs text-gray-500">from completed orders</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-3xl font-bold text-blue-600">${financialStats.monthly_revenue.toLocaleString()}</p>
                <p className="text-xs text-gray-500">this month's completed orders</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Commission Earned</p>
                <p className="text-3xl font-bold text-purple-600">${financialStats.commission_earned.toLocaleString()}</p>
                <p className="text-xs text-gray-500">0 pending</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-3xl font-bold text-orange-600">${financialStats.avg_order_value.toLocaleString()}</p>
                <p className="text-xs text-gray-500">0 completed orders</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Commission Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Commission Breakdown</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
              <div className="text-3xl font-bold text-blue-600 mb-2">${commissionBreakdown.total_earned.toLocaleString()}</div>
              <div className="text-sm text-blue-800 font-medium">Total Earned</div>
            </div>

            <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
              <div className="text-3xl font-bold text-green-600 mb-2">${commissionBreakdown.this_month.toLocaleString()}</div>
              <div className="text-sm text-green-800 font-medium">This Month</div>
            </div>

            <div className="text-center p-6 bg-yellow-50 rounded-xl border border-yellow-200">
              <div className="text-3xl font-bold text-yellow-600 mb-2">${commissionBreakdown.pending.toLocaleString()}</div>
              <div className="text-sm text-yellow-800 font-medium">Pending</div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600">Your current commission rate is <span className="font-bold text-blue-600">{commissionBreakdown.rate}%</span></p>
          </div>
        </div>

        {/* Service Orders */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Service Orders</h2>
                <p className="text-sm text-gray-600">Manage and track all service orders</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pending Commission Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Pending Commission Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center p-6 bg-yellow-50 rounded-xl border border-yellow-200">
              <div className="text-3xl font-bold text-yellow-600 mb-2">${financialStats.pending_commission.toLocaleString()}</div>
              <div className="text-sm text-yellow-800 font-medium">Pending Commission</div>
              <div className="text-xs text-yellow-700 mt-2">From pending orders</div>
            </div>

            <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
              <div className="text-3xl font-bold text-blue-600 mb-2">{commissionBreakdown.rate}%</div>
              <div className="text-sm text-blue-800 font-medium">Commission Rate</div>
              <div className="text-xs text-blue-700 mt-2">Your current rate</div>
            </div>
          </div>
        </div>

        {/* Additional Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Orders</p>
                <p className="text-3xl font-bold text-green-600">{financialStats.completed_orders}</p>
                <p className="text-xs text-gray-500">{financialStats.completed_orders} completed orders</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-indigo-600">{financialStats.total_orders}</p>
                <p className="text-xs text-gray-500">all time orders</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-3xl font-bold text-emerald-600">{financialStats.conversion_rate.toFixed(1)}%</p>
                <p className="text-xs text-gray-500">order completion rate</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Client Portfolio</p>
                <p className="text-3xl font-bold text-cyan-600">{financialStats.client_count}</p>
                <p className="text-xs text-gray-500">{financialStats.active_clients} active clients</p>
              </div>
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-cyan-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConsultantFinancialDashboard;
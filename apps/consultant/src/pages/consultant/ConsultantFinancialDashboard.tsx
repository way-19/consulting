import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  RefreshCw,
  CreditCard,
  Target,
  Award,
  Users,
  Clock,
  AlertCircle,
  CheckCircle,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  Building,
  Calculator,
  Receipt,
  FileText,
  Globe,
  Settings,
  Filter,
  Search
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface FinancialStats {
  // Revenue
  totalRevenue: number;
  monthlyRevenue: number;
  quarterlyRevenue: number;
  yearlyRevenue: number;
  
  // Commission
  commissionRate: number;
  totalCommissionEarned: number;
  monthlyCommissionEarned: number;
  pendingCommissions: number;
  
  // Orders
  totalOrders: number;
  completedOrders: number;
  avgOrderValue: number;
  
  // Performance
  clientCount: number;
  activeClients: number;
  clientRetentionRate: number;
  avgResponseTime: number;
  
  // Trends
  monthlyGrowth: number;
  quarterlyGrowth: number;
  bestMonth: {
    month: string;
    revenue: number;
  };
}

interface ClientFinancialData {
  client_id: string;
  client_name: string;
  company_name: string;
  total_revenue: number;
  total_expenses: number;
  net_profit: number;
  tax_due: number;
  periods_count: number;
  last_submission: string;
  compliance_score: number;
}
interface OrderBreakdown {
  byService: Array<{
    service_name: string;
    order_count: number;
    total_revenue: number;
    avg_price: number;
  }>;
  byMonth: Array<{
    month: string;
    revenue: number;
    commission: number;
    order_count: number;
  }>;
  byClient: Array<{
    client_name: string;
    company_name: string;
    total_spent: number;
    commission_earned: number;
    order_count: number;
  }>;
}

const ConsultantFinancialDashboard = () => {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<FinancialStats>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    quarterlyRevenue: 0,
    yearlyRevenue: 0,
    commissionRate: 65,
    totalCommissionEarned: 0,
    monthlyCommissionEarned: 0,
    pendingCommissions: 0,
    totalOrders: 0,
    completedOrders: 0,
    avgOrderValue: 0,
    clientCount: 0,
    activeClients: 0,
    clientRetentionRate: 0,
    avgResponseTime: 2.3,
    monthlyGrowth: 0,
    quarterlyGrowth: 0,
    bestMonth: { month: '', revenue: 0 }
  });
  const [breakdown, setBreakdown] = useState<OrderBreakdown>({
    byService: [],
    byMonth: [],
    byClient: []
  });
  const [clientFinancialData, setClientFinancialData] = useState<ClientFinancialData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('thisYear');
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('total_revenue');

  useEffect(() => {
    if (user && profile) {
      fetchFinancialData();
    }
  }, [user, profile, dateRange]);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);

      // Calculate date ranges
      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const thisQuarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
      const thisYearStart = new Date(now.getFullYear(), 0, 1);
      
      let startDate = thisYearStart;
      switch (dateRange) {
        case 'thisMonth':
          startDate = thisMonthStart;
          break;
        case 'thisQuarter':
          startDate = thisQuarterStart;
          break;
        case 'thisYear':
          startDate = thisYearStart;
          break;
      }

      // Fetch service orders and commission data
      const { data: ordersData, error: ordersError } = await supabase
        .from('service_orders')
        .select(`
          *,
          client:clients!service_orders_client_id_fkey(
            company_name,
            profile:user_profiles!clients_profile_id_fkey(full_name)
          ),
          custom_service:custom_services(title_i18n)
        `)
        .eq('consultant_id', user?.id)
        .gte('created_at', startDate.toISOString());

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        return;
      }

      const orders = ordersData || [];
      const completedOrders = orders.filter(o => o.status === 'completed');
      
      // Calculate basic financial stats
      const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total_amount, 0);
      const totalCommissionEarned = completedOrders.reduce((sum, o) => sum + (o.consultant_commission_amount || 0), 0);
      
      // Calculate period-specific stats
      const monthlyOrders = completedOrders.filter(o => new Date(o.created_at) >= thisMonthStart);
      const monthlyRevenue = monthlyOrders.reduce((sum, o) => sum + o.total_amount, 0);
      const monthlyCommissionEarned = monthlyOrders.reduce((sum, o) => sum + (o.consultant_commission_amount || 0), 0);

      const quarterlyOrders = completedOrders.filter(o => new Date(o.created_at) >= thisQuarterStart);
      const quarterlyRevenue = quarterlyOrders.reduce((sum, o) => sum + o.total_amount, 0);

      // Calculate growth (compare with previous periods)
      const lastMonth = new Date(thisMonthStart);
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      const lastMonthOrders = completedOrders.filter(o => {
        const orderDate = new Date(o.created_at);
        return orderDate >= lastMonth && orderDate < thisMonthStart;
      });
      const lastMonthRevenue = lastMonthOrders.reduce((sum, o) => sum + o.total_amount, 0);
      const monthlyGrowth = lastMonthRevenue > 0 ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

      // Get client stats
      const { data: clientsData } = await supabase
        .from('clients')
        .select('id, status')
        .eq('assigned_consultant_id', user?.id);

      const clientCount = clientsData?.length || 0;
      const activeClients = clientsData?.filter(c => c.status === 'active').length || 0;

      // Fetch detailed client financial data
      await fetchClientFinancialData();
      // Calculate service breakdown
      const serviceBreakdown = completedOrders.reduce((acc: any, order) => {
        const serviceName = order.custom_service?.title_i18n?.en || order.title || 'Other';
        if (!acc[serviceName]) {
          acc[serviceName] = {
            service_name: serviceName,
            order_count: 0,
            total_revenue: 0,
            avg_price: 0
          };
        }
        acc[serviceName].order_count++;
        acc[serviceName].total_revenue += order.total_amount;
        acc[serviceName].avg_price = acc[serviceName].total_revenue / acc[serviceName].order_count;
        return acc;
      }, {});

      // Calculate client breakdown
      const clientBreakdown = completedOrders.reduce((acc: any, order) => {
        const clientName = order.client?.profile?.full_name || 'Unknown';
        const companyName = order.client?.company_name || '';
        const key = `${clientName}-${order.client_id}`;
        
        if (!acc[key]) {
          acc[key] = {
            client_name: clientName,
            company_name: companyName,
            total_spent: 0,
            commission_earned: 0,
            order_count: 0
          };
        }
        acc[key].total_spent += order.total_amount;
        acc[key].commission_earned += order.consultant_commission_amount || 0;
        acc[key].order_count++;
        return acc;
      }, {});

      // Calculate monthly breakdown
      const monthlyBreakdown = completedOrders.reduce((acc: any, order) => {
        const orderDate = new Date(order.created_at);
        const monthKey = `${orderDate.getFullYear()}-${orderDate.getMonth() + 1}`;
        const monthName = orderDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
        
        if (!acc[monthKey]) {
          acc[monthKey] = {
            month: monthName,
            revenue: 0,
            commission: 0,
            order_count: 0
          };
        }
        acc[monthKey].revenue += order.total_amount;
        acc[monthKey].commission += order.consultant_commission_amount || 0;
        acc[monthKey].order_count++;
        return acc;
      }, {});

      setStats({
        totalRevenue,
        monthlyRevenue,
        quarterlyRevenue,
        yearlyRevenue: totalRevenue, // For current year
        commissionRate: profile?.commission_rate || 65,
        totalCommissionEarned,
        monthlyCommissionEarned,
        pendingCommissions: 0, // Mock for now
        totalOrders: orders.length,
        completedOrders: completedOrders.length,
        avgOrderValue: completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0,
        clientCount,
        activeClients,
        clientRetentionRate: clientCount > 0 ? (activeClients / clientCount) * 100 : 0,
        avgResponseTime: 2.3, // Mock
        monthlyGrowth,
        quarterlyGrowth: 0, // Mock calculation similar to monthly
        bestMonth: Object.values(monthlyBreakdown).sort((a: any, b: any) => b.revenue - a.revenue)[0] || { month: '', revenue: 0 }
      });

      setBreakdown({
        byService: Object.values(serviceBreakdown),
        byMonth: Object.values(monthlyBreakdown).sort((a: any, b: any) => new Date(a.month).getTime() - new Date(b.month).getTime()),
        byClient: Object.values(clientBreakdown).sort((a: any, b: any) => b.total_spent - a.total_spent)
      });

    } catch (err) {
      console.error('Error fetching financial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClientFinancialData = async () => {
    try {
      const { data: clientsData, error } = await supabase
        .from('clients')
        .select(`
          id,
          company_name,
          profile:user_profiles!clients_profile_id_fkey(full_name)
        `)
        .eq('assigned_consultant_id', user?.id)
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching clients:', error);
        return;
      }

      // Enrich with accounting data
      const enrichedClients = await Promise.all(
        (clientsData || []).map(async (client) => {
          const { data: periodsData } = await supabase
            .from('accounting_periods')
            .select('total_revenue, total_expenses, net_profit, tax_due, updated_at')
            .eq('client_id', client.id)
            .order('period_start', { ascending: false });

          const totalRevenue = periodsData?.reduce((sum, p) => sum + (p.total_revenue || 0), 0) || 0;
          const totalExpenses = periodsData?.reduce((sum, p) => sum + (p.total_expenses || 0), 0) || 0;
          const netProfit = totalRevenue - totalExpenses;
          const taxDue = periodsData?.reduce((sum, p) => sum + (p.tax_due || 0), 0) || 0;
          
          // Calculate compliance score
          const periodsCount = periodsData?.length || 0;
          const lastSubmission = periodsData?.[0]?.updated_at || client.created_at;
          const daysSinceLastSubmission = Math.floor((Date.now() - new Date(lastSubmission).getTime()) / (1000 * 60 * 60 * 24));
          const complianceScore = Math.max(0, 100 - (daysSinceLastSubmission * 2)); // Reduce 2 points per day

          return {
            client_id: client.id,
            client_name: client.profile.full_name,
            company_name: client.company_name || '',
            total_revenue: totalRevenue,
            total_expenses: totalExpenses,
            net_profit: netProfit,
            tax_due: taxDue,
            periods_count: periodsCount,
            last_submission: lastSubmission,
            compliance_score: Math.round(complianceScore)
          };
        })
      );

      setClientFinancialData(enrichedClients);
    } catch (err) {
      console.error('Error fetching client financial data:', err);
    }
  };
  const exportFinancialReport = () => {
    const csvData = [
      ['Financial Report', `Generated ${new Date().toLocaleDateString()}`],
      ['Period', dateRange],
      [''],
      ['Metric', 'Value'],
      ['Total Revenue', `$${stats.totalRevenue.toLocaleString()}`],
      ['Commission Earned', `$${stats.totalCommissionEarned.toLocaleString()}`],
      ['Commission Rate', `${stats.commissionRate}%`],
      ['Total Orders', stats.totalOrders.toString()],
      ['Completed Orders', stats.completedOrders.toString()],
      ['Average Order Value', `$${stats.avgOrderValue.toFixed(2)}`],
      ['Monthly Growth', `${stats.monthlyGrowth.toFixed(1)}%`],
      ['Client Count', stats.clientCount.toString()],
      ['Active Clients', stats.activeClients.toString()],
      [''],
      ['Top Services'],
      ['Service Name', 'Orders', 'Revenue'],
      ...breakdown.byService.slice(0, 5).map(service => [
        service.service_name,
        service.order_count.toString(),
        `$${service.total_revenue.toLocaleString()}`
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `consultant-financial-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredClients = clientFinancialData.filter(client =>
    client.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    switch (sortBy) {
      case 'total_revenue':
        return b.total_revenue - a.total_revenue;
      case 'compliance_score':
        return b.compliance_score - a.compliance_score;
      case 'last_submission':
        return new Date(b.last_submission).getTime() - new Date(a.last_submission).getTime();
      default:
        return a.client_name.localeCompare(b.client_name);
    }
  });
  if (loading) {
    return (
      <>
        <Helmet>
          <title>Financial Dashboard - Consultant Panel</title>
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
        <title>Financial Dashboard - Consultant Panel</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Financial Dashboard</h1>
            <p className="text-gray-600 mt-1">Track your earnings, commissions, and performance</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="thisMonth">This Month</option>
              <option value="thisQuarter">This Quarter</option>
              <option value="thisYear">This Year</option>
            </select>
            <button 
              onClick={fetchFinancialData}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <button 
              onClick={exportFinancialReport}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>

        {/* Key Financial Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-green-600">${stats.totalRevenue.toLocaleString()}</p>
                <div className="flex items-center space-x-1 mt-1">
                  {stats.monthlyGrowth >= 0 ? (
                    <ArrowUpRight className="w-4 h-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${
                    stats.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {Math.abs(stats.monthlyGrowth).toFixed(1)}% vs last month
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Commission Earned</p>
                <p className="text-3xl font-bold text-blue-600">${stats.totalCommissionEarned.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.commissionRate}% rate • ${stats.monthlyCommissionEarned.toLocaleString()} this month
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Order Value</p>
                <p className="text-3xl font-bold text-purple-600">${stats.avgOrderValue.toFixed(0)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.completedOrders} completed orders
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Clients</p>
                <p className="text-3xl font-bold text-orange-600">{stats.activeClients}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.clientRetentionRate.toFixed(1)}% retention rate
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Commission Rate Display */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Commission Structure</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{stats.commissionRate}%</div>
                  <div className="text-sm text-blue-800">Your Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-600">{100 - stats.commissionRate}%</div>
                  <div className="text-sm text-gray-800">System Fee</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">${stats.totalCommissionEarned.toLocaleString()}</div>
                  <div className="text-sm text-purple-800">Total Earned</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: BarChart3 },
                { id: 'accounting', name: 'Client Accounting', icon: Calculator },
                { id: 'services', name: 'By Service', icon: Target },
                { id: 'clients', name: 'By Client', icon: Users },
                { id: 'monthly', name: 'Monthly Trend', icon: Calendar },
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

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Monthly</span>
                        <span className="font-bold text-green-600">${stats.monthlyRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Quarterly</span>
                        <span className="font-bold text-green-600">${stats.quarterlyRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Yearly</span>
                        <span className="font-bold text-green-600">${stats.yearlyRevenue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Conversion Rate</span>
                        <span className="font-bold text-blue-600">
                          {stats.totalOrders > 0 ? ((stats.completedOrders / stats.totalOrders) * 100).toFixed(1) : 0}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Client Retention</span>
                        <span className="font-bold text-blue-600">{stats.clientRetentionRate.toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Avg Response Time</span>
                        <span className="font-bold text-blue-600">{stats.avgResponseTime}h</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Client Accounting Tab */}
            {activeTab === 'accounting' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Client Accounting Overview</h3>
                  <div className="flex space-x-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search clients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="total_revenue">Sort by Revenue</option>
                      <option value="compliance_score">Sort by Compliance</option>
                      <option value="last_submission">Sort by Last Submission</option>
                      <option value="client_name">Sort by Name</option>
                    </select>
                  </div>
                </div>

                {/* Client Accounting Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">
                      {clientFinancialData.length}
                    </div>
                    <div className="text-sm text-blue-800">Clients with Accounting</div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="text-2xl font-bold text-green-600">
                      ${clientFinancialData.reduce((sum, c) => sum + c.total_revenue, 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-green-800">Total Client Revenue</div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <div className="text-2xl font-bold text-purple-600">
                      {clientFinancialData.length > 0 
                        ? Math.round(clientFinancialData.reduce((sum, c) => sum + c.compliance_score, 0) / clientFinancialData.length)
                        : 0
                      }%
                    </div>
                    <div className="text-sm text-purple-800">Avg Compliance Score</div>
                  </div>
                  
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <div className="text-2xl font-bold text-orange-600">
                      ${clientFinancialData.reduce((sum, c) => sum + c.tax_due, 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-orange-800">Total Tax Due</div>
                  </div>
                </div>

                {/* Client Financial Table */}
                {filteredClients.length > 0 ? (
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Client
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Revenue
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Profit
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tax Due
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Compliance
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredClients.map((client) => (
                            <tr key={client.client_id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {client.client_name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {client.company_name}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  ${client.total_revenue.toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {client.periods_count} periods
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className={`text-sm font-medium ${
                                  client.net_profit >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  ${Math.abs(client.net_profit).toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {client.total_revenue > 0 
                                    ? `${((client.net_profit / client.total_revenue) * 100).toFixed(1)}% margin`
                                    : '0% margin'
                                  }
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  ${client.tax_due.toLocaleString()}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  client.compliance_score >= 80 ? 'bg-green-100 text-green-800' :
                                  client.compliance_score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {client.compliance_score}%
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <div className="flex space-x-2">
                                  <button className="text-blue-600 hover:text-blue-700">
                                    <Receipt className="w-4 h-4" />
                                  </button>
                                  <button className="text-green-600 hover:text-green-700">
                                    <FileText className="w-4 h-4" />
                                  </button>
                                  <button className="text-purple-600 hover:text-purple-700">
                                    <Calculator className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No accounting data available</p>
                  </div>
                )}
              </div>
            )}
            {/* Services Tab */}
            {activeTab === 'services' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Service</h3>
                {breakdown.byService.length > 0 ? (
                  <div className="space-y-4">
                    {breakdown.byService.map((service, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Target className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{service.service_name}</h4>
                            <p className="text-sm text-gray-600">{service.order_count} orders • Avg: ${service.avg_price.toFixed(0)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">${service.total_revenue.toLocaleString()}</div>
                          <div className="text-sm text-green-600">
                            ${((service.total_revenue * stats.commissionRate) / 100).toLocaleString()} commission
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No service data available</p>
                  </div>
                )}
              </div>
            )}

            {/* Clients Tab */}
            {activeTab === 'clients' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Client</h3>
                {breakdown.byClient.length > 0 ? (
                  <div className="space-y-4">
                    {breakdown.byClient.map((client, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{client.client_name}</h4>
                            <p className="text-sm text-gray-600">
                              {client.company_name && `${client.company_name} • `}
                              {client.order_count} orders
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">${client.total_spent.toLocaleString()}</div>
                          <div className="text-sm text-purple-600">${client.commission_earned.toLocaleString()} commission</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No client data available</p>
                  </div>
                )}
              </div>
            )}

            {/* Monthly Tab */}
            {activeTab === 'monthly' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Performance</h3>
                {breakdown.byMonth.length > 0 ? (
                  <div className="space-y-4">
                    {breakdown.byMonth.map((month, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{month.month}</h4>
                            <p className="text-sm text-gray-600">{month.order_count} orders completed</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">${month.revenue.toLocaleString()}</div>
                          <div className="text-sm text-indigo-600">${month.commission.toLocaleString()} commission</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No monthly data available</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Best Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Highlights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl border border-yellow-200">
              <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-yellow-600 mb-2">{stats.bestMonth.month}</div>
              <div className="text-sm text-yellow-800 font-medium">Best Month</div>
              <div className="text-xs text-yellow-600 mt-1">${stats.bestMonth.revenue.toLocaleString()} revenue</div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-green-600 mb-2">
                {stats.monthlyGrowth >= 0 ? '+' : ''}{stats.monthlyGrowth.toFixed(1)}%
              </div>
              <div className="text-sm text-green-800 font-medium">Monthly Growth</div>
              <div className="text-xs text-green-600 mt-1">vs previous month</div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Percent className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {stats.totalOrders > 0 ? ((stats.completedOrders / stats.totalOrders) * 100).toFixed(1) : 0}%
              </div>
              <div className="text-sm text-blue-800 font-medium">Success Rate</div>
              <div className="text-xs text-blue-600 mt-1">order completion</div>
            </div>
          </div>
        </div>

        {/* Goals and Targets */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Goals & Targets</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Revenue Goal ($10,000)</span>
                <span className="text-sm font-bold text-gray-900">
                  ${stats.monthlyRevenue.toLocaleString()} / $10,000
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((stats.monthlyRevenue / 10000) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Commission Goal ($6,500)</span>
                <span className="text-sm font-bold text-gray-900">
                  ${stats.monthlyCommissionEarned.toLocaleString()} / $6,500
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((stats.monthlyCommissionEarned / 6500) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Service Order Management */}
          <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Service Order Management</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.completedOrders}</div>
                <div className="text-sm text-blue-800">Completed Orders</div>
                <div className="text-xs text-blue-600 mt-1">
                  {stats.totalOrders > 0 ? ((stats.completedOrders / stats.totalOrders) * 100).toFixed(1) : 0}% success rate
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">${stats.avgOrderValue.toFixed(0)}</div>
                <div className="text-sm text-purple-800">Avg Order Value</div>
                <div className="text-xs text-purple-600 mt-1">Per completed service</div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <button 
                onClick={() => window.location.href = '/services'}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Target className="w-4 h-4 mr-2" />
                Manage Service Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConsultantFinancialDashboard;
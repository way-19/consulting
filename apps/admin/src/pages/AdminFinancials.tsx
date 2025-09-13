import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  BarChart3, 
  PieChart,
  Download,
  Calendar,
  Filter,
  RefreshCw,
  Users,
  Target,
  Award,
  CreditCard,
  Building,
  Globe,
  Percent,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { supabase } from '@consulting19/shared/src/lib/supabase';

interface FinancialStats {
  grossRevenue: number;
  netRevenue: number;
  systemRevenue: number;
  consultantCommissions: number;
  totalOrders: number;
  avgOrderValue: number;
  conversionRate: number;
  refunds: number;
  monthlyGrowth: number;
  topConsultant: {
    name: string;
    revenue: number;
  };
  topService: {
    name: string;
    orders: number;
  };
}

interface RevenueBreakdown {
  byConsultant: Array<{
    consultant_name: string;
    total_revenue: number;
    commission_earned: number;
    order_count: number;
  }>;
  byService: Array<{
    service_category: string;
    total_revenue: number;
    order_count: number;
  }>;
  byCountry: Array<{
    country_name: string;
    total_revenue: number;
    order_count: number;
  }>;
}

const AdminFinancials = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<FinancialStats>({
    grossRevenue: 0,
    netRevenue: 0,
    systemRevenue: 0,
    consultantCommissions: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    conversionRate: 0,
    refunds: 0,
    monthlyGrowth: 0,
    topConsultant: { name: '', revenue: 0 },
    topService: { name: '', orders: 0 }
  });
  const [breakdown, setBreakdown] = useState<RevenueBreakdown>({
    byConsultant: [],
    byService: [],
    byCountry: []
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('last30Days');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      fetchFinancialData();
    }
  }, [user, dateRange]);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);

      // Calculate date range
      const endDate = new Date();
      let startDate = new Date();
      
      switch (dateRange) {
        case 'last7Days':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case 'last30Days':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case 'last90Days':
          startDate.setDate(endDate.getDate() - 90);
          break;
        case 'thisQuarter':
          startDate = new Date(endDate.getFullYear(), Math.floor(endDate.getMonth() / 3) * 3, 1);
          break;
        default:
          startDate.setDate(endDate.getDate() - 30);
      }

      // Fetch order data
      const { data: ordersData, error: ordersError } = await supabase
        .from('service_orders')
        .select(`
          *,
          consultant:user_profiles!service_orders_consultant_id_fkey(full_name),
          client:clients!service_orders_client_id_fkey(
            company_name,
            profile:user_profiles!clients_profile_id_fkey(full_name)
          )
        `)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        return;
      }

      const orders = ordersData || [];
      const completedOrders = orders.filter(o => o.status === 'completed');

      // Calculate basic stats
      const grossRevenue = completedOrders.reduce((sum, o) => sum + o.total_amount, 0);
      const systemRevenue = completedOrders.reduce((sum, o) => sum + (o.system_commission_amount || 0), 0);
      const consultantCommissions = completedOrders.reduce((sum, o) => sum + (o.consultant_commission_amount || 0), 0);
      const netRevenue = systemRevenue;

      // Calculate previous period for growth
      const prevStartDate = new Date(startDate);
      const prevEndDate = new Date(startDate);
      const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      prevStartDate.setDate(prevStartDate.getDate() - daysDiff);

      const { data: prevOrdersData } = await supabase
        .from('service_orders')
        .select('total_amount, system_commission_amount')
        .eq('status', 'completed')
        .gte('created_at', prevStartDate.toISOString())
        .lt('created_at', startDate.toISOString());

      const prevRevenue = prevOrdersData?.reduce((sum, o) => sum + (o.system_commission_amount || 0), 0) || 0;
      const monthlyGrowth = prevRevenue > 0 ? ((systemRevenue - prevRevenue) / prevRevenue) * 100 : 0;

      // Calculate breakdown by consultant
      const consultantBreakdown = completedOrders.reduce((acc: any, order) => {
        const consultantName = order.consultant?.full_name || 'Unknown';
        if (!acc[consultantName]) {
          acc[consultantName] = {
            consultant_name: consultantName,
            total_revenue: 0,
            commission_earned: 0,
            order_count: 0
          };
        }
        acc[consultantName].total_revenue += order.total_amount;
        acc[consultantName].commission_earned += order.consultant_commission_amount || 0;
        acc[consultantName].order_count += 1;
        return acc;
      }, {});

      // Calculate breakdown by service category
      const serviceBreakdown = completedOrders.reduce((acc: any, order) => {
        const category = order.title?.includes('Formation') ? 'Company Formation' :
                        order.title?.includes('Tax') ? 'Tax Planning' :
                        order.title?.includes('Bank') ? 'Banking' : 'Other';
        if (!acc[category]) {
          acc[category] = {
            service_category: category,
            total_revenue: 0,
            order_count: 0
          };
        }
        acc[category].total_revenue += order.total_amount;
        acc[category].order_count += 1;
        return acc;
      }, {});

      setStats({
        grossRevenue,
        netRevenue,
        systemRevenue,
        consultantCommissions,
        totalOrders: orders.length,
        avgOrderValue: completedOrders.length > 0 ? grossRevenue / completedOrders.length : 0,
        conversionRate: orders.length > 0 ? (completedOrders.length / orders.length) * 100 : 0,
        refunds: 0, // Mock for now
        monthlyGrowth,
        topConsultant: Object.values(consultantBreakdown).sort((a: any, b: any) => b.total_revenue - a.total_revenue)[0] || { name: '', revenue: 0 },
        topService: Object.values(serviceBreakdown).sort((a: any, b: any) => b.order_count - a.order_count)[0] || { name: '', orders: 0 }
      });

      setBreakdown({
        byConsultant: Object.values(consultantBreakdown).sort((a: any, b: any) => b.total_revenue - a.total_revenue),
        byService: Object.values(serviceBreakdown).sort((a: any, b: any) => b.total_revenue - a.total_revenue),
        byCountry: [] // Mock for now
      });

    } catch (err) {
      console.error('Error fetching financial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    // Create CSV data
    const csvData = [
      ['Metric', 'Value'],
      ['Gross Revenue', `$${stats.grossRevenue.toLocaleString()}`],
      ['System Revenue', `$${stats.systemRevenue.toLocaleString()}`],
      ['Consultant Commissions', `$${stats.consultantCommissions.toLocaleString()}`],
      ['Total Orders', stats.totalOrders.toString()],
      ['Average Order Value', `$${stats.avgOrderValue.toFixed(2)}`],
      ['Conversion Rate', `${stats.conversionRate.toFixed(1)}%`],
      ['Monthly Growth', `${stats.monthlyGrowth.toFixed(1)}%`]
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Financial Reports - Admin Panel</title>
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
        <title>Financial Reports - Admin Panel</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Financial Reports</h1>
            <p className="text-gray-600 mt-1">Revenue analytics and financial insights</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="last7Days">Last 7 Days</option>
              <option value="last30Days">Last 30 Days</option>
              <option value="last90Days">Last 90 Days</option>
              <option value="thisQuarter">This Quarter</option>
            </select>
            <button 
              onClick={fetchFinancialData}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <button 
              onClick={exportData}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Key Financial Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Gross Revenue</p>
                <p className="text-3xl font-bold text-gray-900">${stats.grossRevenue.toLocaleString()}</p>
                <div className="flex items-center space-x-1 mt-1">
                  {stats.monthlyGrowth >= 0 ? (
                    <ArrowUpRight className="w-4 h-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${
                    stats.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {Math.abs(stats.monthlyGrowth).toFixed(1)}%
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
                <p className="text-sm font-medium text-gray-600">System Revenue</p>
                <p className="text-3xl font-bold text-blue-600">${stats.systemRevenue.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.grossRevenue > 0 ? ((stats.systemRevenue / stats.grossRevenue) * 100).toFixed(1) : 0}% of gross
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Consultant Commissions</p>
                <p className="text-3xl font-bold text-purple-600">${stats.consultantCommissions.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.grossRevenue > 0 ? ((stats.consultantCommissions / stats.grossRevenue) * 100).toFixed(1) : 0}% of gross
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-3xl font-bold text-orange-600">${stats.avgOrderValue.toFixed(0)}</p>
                <p className="text-xs text-gray-500 mt-1">{stats.totalOrders} total orders</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-orange-600" />
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
                { id: 'consultants', name: 'By Consultant', icon: Users },
                { id: 'services', name: 'By Service', icon: Target },
                { id: 'trends', name: 'Trends', icon: TrendingUp },
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
                {/* Revenue Distribution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Distribution</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">System (35%)</span>
                        <span className="font-bold text-blue-600">${stats.systemRevenue.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${stats.grossRevenue > 0 ? (stats.systemRevenue / stats.grossRevenue) * 100 : 0}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Consultants (65%)</span>
                        <span className="font-bold text-purple-600">${stats.consultantCommissions.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-purple-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${stats.grossRevenue > 0 ? (stats.consultantCommissions / stats.grossRevenue) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Conversion Rate</span>
                        <span className="font-bold text-green-600">{stats.conversionRate.toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Growth Rate</span>
                        <span className={`font-bold ${stats.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stats.monthlyGrowth >= 0 ? '+' : ''}{stats.monthlyGrowth.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Top Consultant</span>
                        <span className="font-bold text-gray-900">{stats.topConsultant.name || 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Top Service</span>
                        <span className="font-bold text-gray-900">{stats.topService.name || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* By Consultant Tab */}
            {activeTab === 'consultants' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Consultant</h3>
                {breakdown.byConsultant.length > 0 ? (
                  <div className="space-y-4">
                    {breakdown.byConsultant.map((consultant, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{consultant.consultant_name}</h4>
                            <p className="text-sm text-gray-600">{consultant.order_count} orders</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">${consultant.total_revenue.toLocaleString()}</div>
                          <div className="text-sm text-purple-600">${consultant.commission_earned.toLocaleString()} commission</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No consultant data available</p>
                  </div>
                )}
              </div>
            )}

            {/* By Service Tab */}
            {activeTab === 'services' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Service Category</h3>
                {breakdown.byService.length > 0 ? (
                  <div className="space-y-4">
                    {breakdown.byService.map((service, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Target className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{service.service_category}</h4>
                            <p className="text-sm text-gray-600">{service.order_count} orders</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">${service.total_revenue.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">
                            ${(service.total_revenue / service.order_count).toFixed(0)} avg
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

            {/* Trends Tab */}
            {activeTab === 'trends' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200">
                    <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {stats.monthlyGrowth >= 0 ? '+' : ''}{stats.monthlyGrowth.toFixed(1)}%
                    </div>
                    <div className="text-sm text-green-800 font-medium">Growth Rate</div>
                    <div className="text-xs text-green-600 mt-1">vs previous period</div>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                    <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Percent className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">{stats.conversionRate.toFixed(1)}%</div>
                    <div className="text-sm text-blue-800 font-medium">Conversion Rate</div>
                    <div className="text-xs text-blue-600 mt-1">orders to completion</div>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200">
                    <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-purple-600 mb-2">${stats.avgOrderValue.toFixed(0)}</div>
                    <div className="text-sm text-purple-800 font-medium">Avg Order Value</div>
                    <div className="text-xs text-purple-600 mt-1">per transaction</div>
                  </div>
                </div>

                {/* Monthly Trend Chart Placeholder */}
                <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue Trend</h3>
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Chart visualization would be implemented here</p>
                      <p className="text-sm text-gray-500">Integration with charting library needed</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminFinancials;
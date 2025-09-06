import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  BarChart3,
  Users,
  Percent,
  Clock,
  CheckCircle,
  Eye,
  Download,
  Filter,
  Search
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface CommissionData {
  totalCommissions: number;
  thisMonthCommissions: number;
  lastMonthCommissions: number;
  commissionRate: number;
  systemRevenueGenerated: number;
  totalOrders: number;
  averageOrderValue: number;
  monthlyTrend: number;
}

interface OrderCommission {
  id: string;
  title: string;
  total_amount: number;
  consultant_commission_amount: number;
  system_commission_amount: number;
  currency: string;
  status: string;
  created_at: string;
  client_name: string;
}

const ConsultantCommissions = () => {
  const { user } = useAuth();
  const [commissionData, setCommissionData] = useState<CommissionData>({
    totalCommissions: 0,
    thisMonthCommissions: 0,
    lastMonthCommissions: 0,
    commissionRate: 65,
    systemRevenueGenerated: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    monthlyTrend: 0
  });
  const [orderCommissions, setOrderCommissions] = useState<OrderCommission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [monthFilter, setMonthFilter] = useState('all');

  useEffect(() => {
    if (user) {
      fetchCommissionData();
    }
  }, [user]);

  const fetchCommissionData = async () => {
    try {
      setLoading(true);

      // Get consultant's commission rate
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('commission_rate')
        .eq('id', user?.id)
        .single();

      const commissionRate = profile?.commission_rate || 65;

      // Get all completed orders with commission data
      const { data: orders, error: ordersError } = await supabase
        .from('service_orders')
        .select(`
          id,
          title,
          total_amount,
          consultant_commission_amount,
          system_commission_amount,
          currency,
          status,
          created_at,
          client:clients!service_orders_client_id_fkey(
            profile:user_profiles!clients_profile_id_fkey(full_name)
          )
        `)
        .eq('consultant_id', user?.id)
        .eq('status', 'completed')
        .not('consultant_commission_amount', 'is', null)
        .order('created_at', { ascending: false });

      if (ordersError) {
        throw ordersError;
      }

      // Calculate statistics
      const totalCommissions = orders?.reduce((sum, order) => sum + (order.consultant_commission_amount || 0), 0) || 0;
      const systemRevenueGenerated = orders?.reduce((sum, order) => sum + (order.system_commission_amount || 0), 0) || 0;
      const totalOrders = orders?.length || 0;
      const averageOrderValue = totalOrders > 0 ? (totalCommissions + systemRevenueGenerated) / totalOrders : 0;

      // Calculate monthly trends
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const lastMonth = new Date(thisMonth);
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      const thisMonthOrders = orders?.filter(order => new Date(order.created_at) >= thisMonth) || [];
      const lastMonthOrders = orders?.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate >= lastMonth && orderDate < thisMonth;
      }) || [];

      const thisMonthCommissions = thisMonthOrders.reduce((sum, order) => sum + (order.consultant_commission_amount || 0), 0);
      const lastMonthCommissions = lastMonthOrders.reduce((sum, order) => sum + (order.consultant_commission_amount || 0), 0);

      const monthlyTrend = lastMonthCommissions > 0 
        ? ((thisMonthCommissions - lastMonthCommissions) / lastMonthCommissions) * 100 
        : thisMonthCommissions > 0 ? 100 : 0;

      setCommissionData({
        totalCommissions,
        thisMonthCommissions,
        lastMonthCommissions,
        commissionRate,
        systemRevenueGenerated,
        totalOrders,
        averageOrderValue,
        monthlyTrend
      });

      // Format order data for display
      const formattedOrders = orders?.map(order => ({
        id: order.id,
        title: order.title,
        total_amount: order.total_amount,
        consultant_commission_amount: order.consultant_commission_amount || 0,
        system_commission_amount: order.system_commission_amount || 0,
        currency: order.currency,
        status: order.status,
        created_at: order.created_at,
        client_name: order.client?.profile?.full_name || 'Unknown Client'
      })) || [];

      setOrderCommissions(formattedOrders);

    } catch (err) {
      console.error('Error fetching commission data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getMonthOptions = () => {
    const months = [];
    const now = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        value: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`,
        label: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
      });
    }
    
    return months;
  };

  const filteredOrders = orderCommissions.filter(order => {
    const matchesSearch = 
      order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.client_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (monthFilter !== 'all') {
      const orderDate = new Date(order.created_at);
      const orderMonth = `${orderDate.getFullYear()}-${(orderDate.getMonth() + 1).toString().padStart(2, '0')}`;
      if (orderMonth !== monthFilter) return false;
    }
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Commissions - Consultant Dashboard</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        <title>Commissions - Consultant Dashboard</title>
      </Helmet>
      
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Commission Dashboard</h1>
          <p className="text-gray-600">Track your earnings and revenue performance</p>
        </div>

        {/* Commission Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Commissions</p>
                <p className="text-3xl font-bold text-green-600">${commissionData.totalCommissions.toLocaleString()}</p>
                <p className="text-xs text-gray-500">All time earnings</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-3xl font-bold text-blue-600">${commissionData.thisMonthCommissions.toLocaleString()}</p>
                <p className={`text-xs font-medium ${
                  commissionData.monthlyTrend > 0 ? 'text-green-600' : 
                  commissionData.monthlyTrend < 0 ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {commissionData.monthlyTrend > 0 ? '+' : ''}{commissionData.monthlyTrend.toFixed(1)}% vs last month
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Commission Rate</p>
                <p className="text-3xl font-bold text-purple-600">{commissionData.commissionRate}%</p>
                <p className="text-xs text-gray-500">Your current rate</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                <Percent className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-3xl font-bold text-orange-600">${commissionData.averageOrderValue.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{commissionData.totalOrders} total orders</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Split Visualization */}
        <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
              <BarChart3 className="w-7 h-7 mr-3 text-blue-400" />
              Revenue Partnership Model
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Your Earnings</h3>
                    <p className="text-sm text-green-200">{commissionData.commissionRate}% Commission Rate</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-green-400 mb-2">
                  ${commissionData.totalCommissions.toLocaleString()}
                </div>
                <p className="text-sm text-green-200">
                  Total commissions earned from {commissionData.totalOrders} completed orders
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Platform Revenue</h3>
                    <p className="text-sm text-blue-200">{100 - commissionData.commissionRate}% Platform Share</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  ${commissionData.systemRevenueGenerated.toLocaleString()}
                </div>
                <p className="text-sm text-blue-200">
                  Revenue generated for platform operations and growth
                </p>
              </div>
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
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Months</option>
              {getMonthOptions().map((month) => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Commission History */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Commission History</h2>
            <p className="text-sm text-gray-600">Detailed breakdown of your earnings by order</p>
          </div>

          {filteredOrders.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{order.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span>Client: {order.client_name}</span>
                        <span>•</span>
                        <span>{new Date(order.created_at).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>Total: ${order.total_amount.toLocaleString()} {order.currency}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        +${order.consultant_commission_amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        Your {commissionData.commissionRate}% commission
                      </div>
                      <div className="text-xs text-blue-600">
                        Platform: ${order.system_commission_amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Commission History</h3>
              <p className="text-gray-600">
                Complete your first service order to start earning commissions
              </p>
            </div>
          )}
        </div>

        {/* Commission Insights */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Commission Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">💰 Earnings Performance</h3>
              <p className="text-sm text-green-800">
                {commissionData.monthlyTrend > 0 
                  ? `Your commissions are up ${commissionData.monthlyTrend.toFixed(1)}% this month! Keep up the excellent work.`
                  : commissionData.monthlyTrend < 0
                    ? `Your commissions are down ${Math.abs(commissionData.monthlyTrend).toFixed(1)}% this month. Consider focusing on higher-value services.`
                    : 'Your commission performance is stable this month.'
                }
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">📊 Revenue Partnership</h3>
              <p className="text-sm text-blue-800">
                You earn {commissionData.commissionRate}% commission on all completed orders. 
                The platform uses its {100 - commissionData.commissionRate}% share for operations, 
                marketing, and platform improvements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConsultantCommissions;
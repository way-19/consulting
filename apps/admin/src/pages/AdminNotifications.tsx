import React, { useState, useEffect } from 'react';
import { Bell, DollarSign, MessageSquare, TrendingUp, LogOut, Users, Percent } from 'lucide-react';
import { useAuth, supabase } from '@consulting19/shared';

interface SalesNotification {
  id: string;
  type: string;
  payload: any;
  created_at: string;
}

interface ConsultantCommission {
  consultant_id: string;
  consultant_name: string;
  total_sales: number;
  commission_rate: number;
  commission_amount: number;
  pending_commission: number;
}

const AdminNotifications = () => {
  const { user, signOut } = useAuth();
  const [notifications, setNotifications] = useState<SalesNotification[]>([]);
  const [consultantCommissions, setConsultantCommissions] = useState<ConsultantCommission[]>([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalCommissions: 0,
    activeMessages: 0,
    activeConsultants: 0
  });
  const [loading, setLoading] = useState(true);
  const [commissionRates, setCommissionRates] = useState<{[key: string]: number}>({});

  useEffect(() => {
    fetchNotifications();
    fetchStats();
    fetchConsultantCommissions();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await supabase
        .from('audit_logs')
        .select('*')
        .in('action_type', ['service_purchase', 'payment_received', 'message_sent', 'invoice_created'])
        .order('created_at', { ascending: false })
        .limit(20);

      setNotifications(data || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const [
        { count: salesCount },
        { count: messageCount },
        { count: consultantCount }
      ] = await Promise.all([
        supabase.from('service_orders').select('*', { count: 'exact', head: true }),
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
        supabase.from('user_profiles').select('*', { count: 'exact', head: true }).eq('role', 'consultant').eq('is_active', true)
      ]);

      // Calculate total sales amount
      const { data: salesData } = await supabase
        .from('service_orders')
        .select('total_amount')
        .eq('status', 'completed');

      const totalSales = salesData?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

      setStats({
        totalSales,
        totalCommissions: totalSales * 0.1, // 10% average commission
        activeMessages: messageCount || 0,
        activeConsultants: consultantCount || 0
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchConsultantCommissions = async () => {
    try {
      // Get all consultants with their sales
      const { data: consultants } = await supabase
        .from('user_profiles')
        .select(`
          id, full_name,
          service_orders!service_orders_consultant_id_fkey(total_amount, status)
        `)
        .eq('role', 'consultant')
        .eq('is_active', true);

      const commissionData = (consultants || []).map(consultant => {
        const completedOrders = consultant.service_orders?.filter(order => order.status === 'completed') || [];
        const totalSales = completedOrders.reduce((sum, order) => sum + order.total_amount, 0);
        const commissionRate = commissionRates[consultant.id] || 10; // Default 10%
        const commissionAmount = totalSales * (commissionRate / 100);

        return {
          consultant_id: consultant.id,
          consultant_name: consultant.full_name,
          total_sales: totalSales,
          commission_rate: commissionRate,
          commission_amount: commissionAmount,
          pending_commission: commissionAmount // Assume all pending for demo
        };
      });

      setConsultantCommissions(commissionData);
    } catch (err) {
      console.error('Error fetching consultant commissions:', err);
    }
  };

  const updateCommissionRate = async (consultantId: string, newRate: number) => {
    try {
      setCommissionRates(prev => ({ ...prev, [consultantId]: newRate }));
      
      // In real implementation, save to database
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'commission_rate_updated',
          description: `Updated commission rate to ${newRate}%`,
          payload: { consultant_id: consultantId, new_rate: newRate }
        });

      // Refresh commission data
      fetchConsultantCommissions();
    } catch (err) {
      console.error('Error updating commission rate:', err);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = 'http://localhost:5173';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Sales monitoring and consultant commission management</p>
        </div>
        <button
          onClick={handleSignOut}
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold text-green-600">${stats.totalSales.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Commissions</p>
              <p className="text-2xl font-bold text-orange-600">${stats.totalCommissions.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Messages</p>
              <p className="text-2xl font-bold text-blue-600">{stats.activeMessages}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Consultants</p>
              <p className="text-2xl font-bold text-purple-600">{stats.activeConsultants}</p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Consultant Commission Management */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Consultant Commission Management</h2>
        </div>
        
        <div className="p-6">
          {consultantCommissions.length > 0 ? (
            <div className="space-y-4">
              {consultantCommissions.map((commission) => (
                <div key={commission.consultant_id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{commission.consultant_name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Sales: ${commission.total_sales.toLocaleString()}</span>
                        <span>Commission: ${commission.commission_amount.toLocaleString()}</span>
                        <span>Pending: ${commission.pending_commission.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <Percent className="w-4 h-4 text-gray-400" />
                        <input
                          type="number"
                          value={commission.commission_rate}
                          onChange={(e) => updateCommissionRate(commission.consultant_id, Number(e.target.value))}
                          min="0"
                          max="50"
                          step="1"
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <span className="text-sm text-gray-600">%</span>
                      </div>
                      <button
                        onClick={() => updateCommissionRate(commission.consultant_id, commission.commission_rate)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No active consultants found</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Platform Activity</h2>
        </div>
        
        {notifications.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <div key={notification.id} className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bell className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {notification.payload?.description || notification.action_type}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Activity Yet</h3>
            <p className="text-gray-600">Platform activity will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;
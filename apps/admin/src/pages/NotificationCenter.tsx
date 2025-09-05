import React, { useState, useEffect } from 'react';
import { Bell, DollarSign, MessageSquare, TrendingUp, LogOut } from 'lucide-react';
import { useAuth, supabase } from '@consulting19/shared';

interface SalesNotification {
  id: string;
  type: string;
  payload: any;
  created_at: string;
}

const NotificationCenter = () => {
  const { user, signOut } = useAuth();
  const [notifications, setNotifications] = useState<SalesNotification[]>([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    pendingCommissions: 0,
    activeMessages: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    fetchStats();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await supabase
        .from('audit_logs')
        .select('*')
        .in('action_type', ['service_purchase', 'payment_received', 'message_sent'])
        .order('created_at', { ascending: false })
        .limit(20);

      setNotifications(data || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const fetchStats = async () => {
    try {
      // Get basic stats
      const [
        { count: salesCount },
        { count: messageCount }
      ] = await Promise.all([
        supabase.from('service_orders').select('*', { count: 'exact', head: true }),
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false)
      ]);

      setStats({
        totalSales: salesCount || 0,
        pendingCommissions: 0, // Calculate based on business logic
        activeMessages: messageCount || 0
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
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
          <h1 className="text-3xl font-bold text-gray-900">Admin Notifications</h1>
          <p className="text-gray-600">Sales and messaging oversight</p>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold text-green-600">{stats.totalSales}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Commissions</p>
              <p className="text-2xl font-bold text-orange-600">${stats.pendingCommissions}</p>
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

export default NotificationCenter;
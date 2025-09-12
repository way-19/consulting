import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  Users, 
  CheckSquare, 
  DollarSign, 
  Calendar,
  MessageSquare,
  FileText,
  TrendingUp,
  BarChart3,
  Clock,
  Target,
  Award,
  AlertTriangle,
  Bell,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface DashboardStats {
  totalClients: number;
  activeClients: number;
  pendingTasks: number;
  completedTasks: number;
  monthlyRevenue: number;
  commissionEarned: number;
  unreadMessages: number;
  upcomingMeetings: number;
}

const ConsultantDashboard = () => {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    activeClients: 0,
    pendingTasks: 0,
    completedTasks: 0,
    monthlyRevenue: 0,
    commissionEarned: 0,
    unreadMessages: 0,
    upcomingMeetings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && profile) {
      fetchDashboardStats();
    }
  }, [user, profile]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch comprehensive stats
      const [
        { count: totalClients },
        { count: activeClients },
        { count: pendingTasks },
        { count: completedTasks },
        { count: unreadMessages },
        { count: upcomingMeetings }
      ] = await Promise.all([
        supabase.from('clients').select('*', { count: 'exact', head: true }).eq('assigned_consultant_id', user?.id),
        supabase.from('clients').select('*', { count: 'exact', head: true }).eq('assigned_consultant_id', user?.id).eq('status', 'active'),
        supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('consultant_id', user?.id).in('status', ['todo', 'in_progress']),
        supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('consultant_id', user?.id).eq('status', 'completed'),
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('receiver_id', user?.id).eq('is_read', false),
        supabase.from('meetings').select('*', { count: 'exact', head: true }).eq('consultant_id', user?.id).gte('start_time', new Date().toISOString())
      ]);

      // Fetch financial data
      const { data: ordersData } = await supabase
        .from('service_orders')
        .select('total_amount, consultant_commission_amount, status, created_at')
        .eq('consultant_id', user?.id);

      const thisMonth = new Date();
      thisMonth.setDate(1);
      const monthlyOrders = (ordersData || []).filter(o => 
        o.status === 'completed' && new Date(o.created_at) >= thisMonth
      );
      const monthlyRevenue = monthlyOrders.reduce((sum, o) => sum + o.total_amount, 0);
      const commissionEarned = (ordersData || [])
        .filter(o => o.status === 'completed')
        .reduce((sum, o) => sum + (o.consultant_commission_amount || 0), 0);

      setStats({
        totalClients: totalClients || 0,
        activeClients: activeClients || 0,
        pendingTasks: pendingTasks || 0,
        completedTasks: completedTasks || 0,
        monthlyRevenue,
        commissionEarned,
        unreadMessages: unreadMessages || 0,
        upcomingMeetings: upcomingMeetings || 0
      });

    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Consultant Dashboard</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
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
        <title>Consultant Dashboard</title>
      </Helmet>
      
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {profile?.full_name || user?.user_metadata?.full_name || 'Consultant'}!
              </h1>
              <p className="text-gray-600 text-lg">Manage your clients and grow your consulting business</p>
            </div>
            <div className="hidden md:block">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-2">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  Consultant
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clients</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalClients}</p>
                <p className="text-xs text-gray-500">{stats.activeClients} active</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
                <p className="text-3xl font-bold text-orange-600">{stats.pendingTasks}</p>
                <p className="text-xs text-gray-500">Needs attention</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <CheckSquare className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-3xl font-bold text-green-600">${stats.monthlyRevenue.toLocaleString()}</p>
                <p className="text-xs text-gray-500">This month</p>
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
                <p className="text-3xl font-bold text-purple-600">${stats.commissionEarned.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Total earned</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unread Messages</p>
                <p className="text-3xl font-bold text-blue-600">{stats.unreadMessages}</p>
                <p className="text-xs text-gray-500">All caught up</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Meetings</p>
                <p className="text-3xl font-bold text-indigo-600">{stats.upcomingMeetings}</p>
                <p className="text-xs text-gray-500">Scheduled</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <button className="flex flex-col items-center p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-900 text-center">View Clients</span>
            </button>

            <button className="flex flex-col items-center p-6 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3">
                <CheckSquare className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-900 text-center">Create Task</span>
            </button>

            <button className="flex flex-col items-center p-6 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-900 text-center">Send Message</span>
            </button>

            <button className="flex flex-col items-center p-6 rounded-xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-3">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-sm font-medium text-gray-900 text-center">Review Documents</span>
            </button>
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Alerts & Notifications</h2>
          <p className="text-gray-600 mb-6">Important alerts and updates</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center p-6 bg-orange-50 rounded-xl border border-orange-200">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-orange-900 mb-2">Document Alerts</h3>
              <p className="text-sm text-orange-700 mb-4">Gelen döküman uyarıları</p>
              <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm">
                View Alerts
              </button>
            </div>

            <div className="text-center p-6 bg-red-50 rounded-xl border border-red-200">
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-red-900 mb-2">Payment & Document Overdue</h3>
              <p className="text-sm text-red-700 mb-4">Payment and document delay warnings</p>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                View Alerts
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Bell className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Document deleted: ein.pdf</p>
                  <p className="text-xs text-gray-500">11.09.2025 • 19:23:46</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Bell className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Document deleted: PASSPORT.pdf</p>
                  <p className="text-xs text-gray-500">11.09.2025 • 19:23:39</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Bell className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Document deleted: mercury bank.pdf</p>
                  <p className="text-xs text-gray-500">11.09.2025 • 19:23:37</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-green-900">Total Revenue</p>
                    <p className="text-xs text-green-700">All time earnings</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">${stats.monthlyRevenue.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-blue-900">Commission Earned</p>
                    <p className="text-xs text-blue-700">Your earnings</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">${stats.commissionEarned.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-purple-900">Client Satisfaction</p>
                    <p className="text-xs text-purple-700">Average rating</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-purple-600">4.8/5.0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConsultantDashboard;
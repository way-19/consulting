import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  Users, 
  CheckSquare, 
  FileText, 
  MessageSquare, 
  DollarSign,
  TrendingUp,
  Calendar,
  Target,
  BarChart3,
  Clock,
  AlertTriangle,
  Star,
  Award,
  Briefcase
} from 'lucide-react';
import { Card, Button } from '@consulting19/shared';
import { supabase } from '@consulting19/shared/lib/supabase';
import ConsultantAlerts from '../../components/ConsultantAlerts';

interface DashboardStats {
  totalClients: number;
  activeClients: number;
  pendingTasks: number;
  completedTasks: number;
  unreadMessages: number;
  totalRevenue: number;
  monthlyRevenue: number;
  commissionEarned: number;
  upcomingMeetings: number;
}

const ConsultantDashboard = () => {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    activeClients: 0,
    pendingTasks: 0,
    completedTasks: 0,
    unreadMessages: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    commissionEarned: 0,
    upcomingMeetings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    if (user && profile) {
      fetchDashboardData();
    }
  }, [user, profile]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get clients count
      const { count: totalClientsCount } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .eq('assigned_consultant_id', user?.id);

      const { count: activeClientsCount } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .eq('assigned_consultant_id', user?.id)
        .eq('status', 'active');

      // Get tasks count
      const { count: pendingTasksCount } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('consultant_id', user?.id)
        .in('status', ['todo', 'in_progress']);

      const { count: completedTasksCount } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('consultant_id', user?.id)
        .eq('status', 'completed');

      // Get unread messages count
      const { count: unreadMessagesCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user?.id)
        .eq('is_read', false);

      // Get financial data
      const { data: serviceOrders } = await supabase
        .from('service_orders')
        .select('total_amount, status, consultant_commission_amount, created_at')
        .eq('consultant_id', user?.id);

      const completedOrders = serviceOrders?.filter(o => o.status === 'completed') || [];
      const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total_amount, 0);
      const commissionEarned = completedOrders.reduce((sum, o) => sum + (o.consultant_commission_amount || 0), 0);

      // Calculate monthly revenue
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const monthlyOrders = completedOrders.filter(o => new Date(o.created_at) >= thisMonth);
      const monthlyRevenue = monthlyOrders.reduce((sum, o) => sum + o.total_amount, 0);

      // Get upcoming meetings
      const { count: upcomingMeetingsCount } = await supabase
        .from('meetings')
        .select('*', { count: 'exact', head: true })
        .eq('consultant_id', user?.id)
        .gte('start_time', new Date().toISOString());

      setStats({
        totalClients: totalClientsCount || 0,
        activeClients: activeClientsCount || 0,
        pendingTasks: pendingTasksCount || 0,
        completedTasks: completedTasksCount || 0,
        unreadMessages: unreadMessagesCount || 0,
        totalRevenue,
        monthlyRevenue,
        commissionEarned,
        upcomingMeetings: upcomingMeetingsCount || 0,
      });

      // Fetch recent activity
      const { data: activityData } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentActivity(activityData || []);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Clients',
      value: stats.totalClients.toString(),
      icon: Users,
      color: 'blue',
      href: '/clients',
      change: `${stats.activeClients} active`,
      changeType: 'positive' as const,
    },
    {
      title: 'Pending Tasks',
      value: stats.pendingTasks.toString(),
      icon: CheckSquare,
      color: 'orange',
      href: '/tasks',
      change: stats.pendingTasks > 0 ? 'Needs attention' : 'All caught up',
      changeType: stats.pendingTasks > 0 ? 'neutral' : 'positive' as const,
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'green',
      href: '/financial',
      change: 'This month',
      changeType: 'positive' as const,
    },
    {
      title: 'Commission Earned',
      value: `$${stats.commissionEarned.toLocaleString()}`,
      icon: Award,
      color: 'purple',
      href: '/financial',
      change: 'Total earned',
      changeType: 'positive' as const,
    },
    {
      title: 'Unread Messages',
      value: stats.unreadMessages.toString(),
      icon: MessageSquare,
      color: 'indigo',
      href: '/messages',
      change: stats.unreadMessages > 0 ? 'New messages' : 'All caught up',
      changeType: stats.unreadMessages > 0 ? 'neutral' : 'positive' as const,
    },
    {
      title: 'Upcoming Meetings',
      value: stats.upcomingMeetings.toString(),
      icon: Calendar,
      color: 'teal',
      href: '/availability',
      change: stats.upcomingMeetings > 0 ? 'Scheduled' : 'No meetings',
      changeType: 'neutral' as const,
    },
  ];

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Consultant Dashboard - Consulting19</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
        <title>Consultant Dashboard - Consulting19</title>
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
                  <Briefcase className="w-8 h-8 text-white" />
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
          {statCards.map((stat, index) => (
            <Card key={index} hover className="h-full transition-all duration-200 hover:shadow-xl">
              <Card.Body>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <div className="flex items-center">
                    <TrendingUp className={`w-4 h-4 mr-1 ${
                      stat.changeType === 'positive' ? 'text-green-600' : 
                      stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                    }`} />
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 
                      stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>

        {/* Consultant Alerts - Geciken Ödemeler ve Evraklar */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">Alerts & Notifications</h2>
            <p className="text-gray-600">Urgent matters requiring your attention</p>
          </Card.Header>
          <Card.Body>
            <ConsultantAlerts consultantId={user?.id} />
          </Card.Body>
        </Card>

        {/* Recent Activity & Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            </Card.Header>
            <Card.Body>
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                        <Clock className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.created_at).toLocaleDateString()} • {new Date(activity.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recent Activity</h3>
                  <p className="text-gray-600">Your activity will appear here as you work with clients</p>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Performance Overview */}
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">Performance Overview</h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-700">Total Revenue</p>
                      <p className="text-xl font-bold text-green-900">${stats.totalRevenue.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-700">Commission Earned</p>
                      <p className="text-xl font-bold text-blue-900">${stats.commissionEarned.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-purple-700">Client Satisfaction</p>
                      <p className="text-xl font-bold text-purple-900">4.8/5.0</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Alerts & Notifications */}
        {stats.pendingTasks > 5 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <h3 className="text-sm font-semibold text-yellow-900">High Task Load</h3>
                <p className="text-sm text-yellow-800">
                  You have {stats.pendingTasks} pending tasks. Consider prioritizing or delegating some work.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ConsultantDashboard;
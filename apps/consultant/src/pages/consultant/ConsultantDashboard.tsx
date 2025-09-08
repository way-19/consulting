import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  Users, 
  CheckSquare, 
  DollarSign, 
  TrendingUp,
  MessageSquare,
  Calendar,
  FileText,
  Target,
  Clock,
  Award,
  BarChart3,
  AlertTriangle,
  Plus,
  Eye,
  ArrowRight,
  Briefcase,
  Globe,
  Star
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface DashboardStats {
  activeClients: number;
  totalClients: number;
  pendingTasks: number;
  completedTasks: number;
  totalTasks: number;
  unreadMessages: number;
  totalMessages: number;
  monthlyRevenue: number;
  totalRevenue: number;
  commissionRate: number;
  commissionEarned: number;
  upcomingMeetings: number;
  documentsToReview: number;
  activeProjects: number;
  completedProjects: number;
}

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  client_name?: string;
  amount?: number;
}

interface SalesData {
  thisMonth: number;
  lastMonth: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

const ConsultantDashboard = () => {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    activeClients: 0,
    totalClients: 0,
    pendingTasks: 0,
    completedTasks: 0,
    totalTasks: 0,
    unreadMessages: 0,
    totalMessages: 0,
    monthlyRevenue: 0,
    totalRevenue: 0,
    commissionRate: 65,
    commissionEarned: 0,
    upcomingMeetings: 0,
    documentsToReview: 0,
    activeProjects: 0,
    completedProjects: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [salesData, setSalesData] = useState<SalesData>({
    thisMonth: 0,
    lastMonth: 0,
    trend: 'stable',
    trendPercentage: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && profile) {
      fetchDashboardData();
    }
  }, [user, profile]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch comprehensive dashboard statistics
      const [
        { count: activeClientsCount },
        { count: totalClientsCount },
        { count: pendingTasksCount },
        { count: completedTasksCount },
        { count: totalTasksCount },
        { count: unreadMessagesCount },
        { count: totalMessagesCount },
        { count: upcomingMeetingsCount },
        { count: documentsToReviewCount },
        { count: activeProjectsCount },
        { count: completedProjectsCount }
      ] = await Promise.all([
        supabase.from('clients').select('*', { count: 'exact', head: true }).eq('assigned_consultant_id', user?.id).eq('status', 'active'),
        supabase.from('clients').select('*', { count: 'exact', head: true }).eq('assigned_consultant_id', user?.id),
        supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('consultant_id', user?.id).in('status', ['todo', 'in_progress']),
        supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('consultant_id', user?.id).eq('status', 'completed'),
        supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('consultant_id', user?.id),
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('receiver_id', user?.id).eq('is_read', false),
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('receiver_id', user?.id),
        supabase.from('meetings').select('*', { count: 'exact', head: true }).eq('consultant_id', user?.id).gte('start_time', new Date().toISOString()),
        supabase.from('documents').select('*', { count: 'exact', head: true }).eq('consultant_id', user?.id).eq('status', 'uploaded'),
        supabase.from('projects').select('*', { count: 'exact', head: true }).eq('consultant_id', user?.id).eq('status', 'active'),
        supabase.from('projects').select('*', { count: 'exact', head: true }).eq('consultant_id', user?.id).eq('status', 'completed')
      ]);

      // Fetch revenue and commission data
      const { data: revenueData } = await supabase
        .from('service_orders')
        .select('total_amount, consultant_commission_amount, created_at, status')
        .eq('consultant_id', user?.id)
        .eq('status', 'completed');

      const totalRevenue = revenueData?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
      const commissionEarned = revenueData?.reduce((sum, order) => sum + (order.consultant_commission_amount || 0), 0) || 0;

      // Calculate monthly revenue
      const thisMonth = new Date();
      const lastMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth() - 1, 1);
      const thisMonthStart = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1);

      const thisMonthRevenue = revenueData?.filter(order => 
        new Date(order.created_at) >= thisMonthStart
      ).reduce((sum, order) => sum + order.total_amount, 0) || 0;

      const lastMonthRevenue = revenueData?.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate >= lastMonth && orderDate < thisMonthStart;
      }).reduce((sum, order) => sum + order.total_amount, 0) || 0;

      // Calculate sales trend
      const trendPercentage = lastMonthRevenue > 0 
        ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
        : thisMonthRevenue > 0 ? 100 : 0;

      const trend = trendPercentage > 5 ? 'up' : trendPercentage < -5 ? 'down' : 'stable';

      setSalesData({
        thisMonth: thisMonthRevenue,
        lastMonth: lastMonthRevenue,
        trend,
        trendPercentage: Math.abs(trendPercentage)
      });

      setStats({
        activeClients: activeClientsCount || 0,
        totalClients: totalClientsCount || 0,
        pendingTasks: pendingTasksCount || 0,
        completedTasks: completedTasksCount || 0,
        totalTasks: totalTasksCount || 0,
        unreadMessages: unreadMessagesCount || 0,
        totalMessages: totalMessagesCount || 0,
        monthlyRevenue: thisMonthRevenue,
        totalRevenue,
        commissionRate: profile?.commission_rate || 65,
        commissionEarned,
        upcomingMeetings: upcomingMeetingsCount || 0,
        documentsToReview: documentsToReviewCount || 0,
        activeProjects: activeProjectsCount || 0,
        completedProjects: completedProjectsCount || 0
      });

      // Fetch recent activity
      const { data: activityData } = await supabase
        .from('audit_logs')
        .select('*')
        .or(`user_id.eq.${user?.id},payload->>consultant_id.eq.${user?.id}`)
        .order('created_at', { ascending: false })
        .limit(10);

      if (activityData) {
        setRecentActivity(activityData.map(log => ({
          id: log.id,
          type: log.action_type,
          description: log.description,
          timestamp: log.created_at,
          client_name: log.payload?.client_name,
          amount: log.payload?.amount
        })));
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'client_assigned': return '👤';
      case 'task_completed': return '✅';
      case 'payment_received': return '💰';
      case 'message_sent': return '💬';
      case 'document_uploaded': return '📄';
      case 'meeting_scheduled': return '📅';
      default: return '🔔';
    }
  };

  const getTrendIcon = () => {
    switch (salesData.trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-600 transform rotate-180" />;
      default: return <BarChart3 className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = () => {
    switch (salesData.trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Dashboard - Consultant Panel</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
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
        <title>Dashboard - Consultant Panel</title>
      </Helmet>
      
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {profile?.full_name || 'Consultant'}!
              </h1>
              <p className="text-gray-600 text-lg">Here's your business overview for today</p>
              <div className="mt-4 flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-700">Commission Rate: {stats.commissionRate}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  {getTrendIcon()}
                  <span className={`text-sm font-medium ${getTrendColor()}`}>
                    {salesData.trend === 'stable' ? 'Stable' : 
                     salesData.trend === 'up' ? `+${salesData.trendPercentage.toFixed(1)}%` : 
                     `-${salesData.trendPercentage.toFixed(1)}%`} this month
                  </span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-2">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <div className="text-sm font-medium text-gray-900">Consultant</div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Clients</p>
                <p className="text-3xl font-bold text-blue-600">{stats.activeClients}</p>
                <p className="text-xs text-gray-500">of {stats.totalClients} total</p>
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
                <p className="text-xs text-gray-500">{stats.completedTasks} completed</p>
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
                <div className="flex items-center space-x-1">
                  {getTrendIcon()}
                  <span className={`text-xs font-medium ${getTrendColor()}`}>
                    {salesData.trendPercentage.toFixed(1)}%
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
                <p className="text-3xl font-bold text-purple-600">${stats.commissionEarned.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{stats.commissionRate}% rate</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unread Messages</p>
                <p className="text-2xl font-bold text-red-600">{stats.unreadMessages}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Meetings</p>
                <p className="text-2xl font-bold text-indigo-600">{stats.upcomingMeetings}</p>
              </div>
              <Calendar className="w-8 h-8 text-indigo-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Documents to Review</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.documentsToReview}</p>
              </div>
              <FileText className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-teal-600">{stats.activeProjects}</p>
              </div>
              <Target className="w-8 h-8 text-teal-600" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={() => window.location.href = '/clients'}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">Add Client</div>
                <div className="text-sm text-gray-600">Assign new client</div>
              </div>
            </button>

            <button 
              onClick={() => window.location.href = '/tasks'}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckSquare className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">Create Task</div>
                <div className="text-sm text-gray-600">Assign client task</div>
              </div>
            </button>

            <button 
              onClick={() => window.location.href = '/documents'}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">Review Documents</div>
                <div className="text-sm text-gray-600">Check uploads</div>
              </div>
            </button>

            <button 
              onClick={() => window.location.href = '/availability'}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">Set Availability</div>
                <div className="text-sm text-gray-600">Update schedule</div>
              </div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                <button 
                  onClick={() => window.location.href = '/analytics'}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="text-lg mt-0.5">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>{new Date(activity.timestamp).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{new Date(activity.timestamp).toLocaleTimeString()}</span>
                          {activity.amount && (
                            <>
                              <span>•</span>
                              <span className="font-medium text-green-600">${activity.amount.toLocaleString()}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No recent activity</p>
                </div>
              )}
            </div>
          </div>

          {/* Performance Overview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Performance Overview</h2>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Task Completion Rate */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Task Completion Rate</span>
                  <span className="text-sm font-bold text-gray-900">
                    {stats.totalTasks > 0 ? ((stats.completedTasks / stats.totalTasks) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Client Satisfaction */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Client Satisfaction</span>
                  <span className="text-sm font-bold text-gray-900">4.8/5.0</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: '96%' }}
                  ></div>
                </div>
              </div>

              {/* Response Time */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Avg Response Time</span>
                  <span className="text-sm font-bold text-gray-900">2.3 hours</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: '85%' }}
                  ></div>
                </div>
              </div>

              {/* Revenue Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Monthly Goal Progress</span>
                  <span className="text-sm font-bold text-gray-900">
                    ${stats.monthlyRevenue.toLocaleString()} / $10,000
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((stats.monthlyRevenue / 10000) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Items */}
        {(stats.unreadMessages > 0 || stats.documentsToReview > 0 || stats.pendingTasks > 0) && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
              Action Items
            </h2>
            <div className="space-y-3">
              {stats.unreadMessages > 0 && (
                <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-red-900">
                      {stats.unreadMessages} unread message{stats.unreadMessages > 1 ? 's' : ''}
                    </span>
                  </div>
                  <button 
                    onClick={() => window.location.href = '/messages'}
                    className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    Reply
                  </button>
                </div>
              )}

              {stats.documentsToReview > 0 && (
                <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium text-yellow-900">
                      {stats.documentsToReview} document{stats.documentsToReview > 1 ? 's' : ''} to review
                    </span>
                  </div>
                  <button 
                    onClick={() => window.location.href = '/documents'}
                    className="px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                  >
                    Review
                  </button>
                </div>
              )}

              {stats.pendingTasks > 0 && (
                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckSquare className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">
                      {stats.pendingTasks} pending task{stats.pendingTasks > 1 ? 's' : ''}
                    </span>
                  </div>
                  <button 
                    onClick={() => window.location.href = '/tasks'}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Manage
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Revenue Analytics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Revenue Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">${stats.totalRevenue.toLocaleString()}</div>
              <div className="text-sm text-green-800 font-medium">Total Revenue</div>
              <div className="text-xs text-green-600 mt-1">All time earnings</div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">${salesData.thisMonth.toLocaleString()}</div>
              <div className="text-sm text-blue-800 font-medium">This Month</div>
              <div className={`text-xs mt-1 font-medium ${getTrendColor()}`}>
                {salesData.trend === 'up' ? '↗' : salesData.trend === 'down' ? '↘' : '→'} {salesData.trendPercentage.toFixed(1)}%
              </div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200">
              <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-2">${stats.commissionEarned.toLocaleString()}</div>
              <div className="text-sm text-purple-800 font-medium">Commission Earned</div>
              <div className="text-xs text-purple-600 mt-1">{stats.commissionRate}% rate</div>
            </div>
          </div>
        </div>

        {/* Client Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Client Overview</h2>
            <button 
              onClick={() => window.location.href = '/clients'}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Users className="w-4 h-4 mr-2" />
              Manage Clients
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Active Clients</span>
                <span className="font-bold text-blue-600">{stats.activeClients}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Clients</span>
                <span className="font-bold text-gray-900">{stats.totalClients}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Active Projects</span>
                <span className="font-bold text-teal-600">{stats.activeProjects}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Completed Projects</span>
                <span className="font-bold text-green-600">{stats.completedProjects}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Pending Tasks</span>
                <span className="font-bold text-orange-600">{stats.pendingTasks}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Completed Tasks</span>
                <span className="font-bold text-green-600">{stats.completedTasks}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Documents to Review</span>
                <span className="font-bold text-yellow-600">{stats.documentsToReview}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Upcoming Meetings</span>
                <span className="font-bold text-indigo-600">{stats.upcomingMeetings}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConsultantDashboard;
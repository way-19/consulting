import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  Users, 
  CheckSquare, 
  FileText, 
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  BarChart3,
  Target,
  MessageSquare,
  Calendar,
  RefreshCw,
  Bell,
  Award,
  Star,
  Activity
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface DashboardStats {
  totalClients: number;
  activeClients: number;
  pendingTasks: number;
  completedTasks: number;
  pendingDocuments: number;
  monthlyRevenue: number;
  totalRevenue: number;
  commissionEarned: number;
  avgClientSatisfaction: number;
}

interface Alert {
  alert_source_id: string;
  alert_type: string;
  is_resolved: boolean;
  notes?: string;
  payload: {
    client_name?: string;
    amount?: number;
    currency?: string;
    invoice_id?: string;
    document_type?: string;
    document_name?: string;
    due_date?: string;
    task_title?: string;
  };
  notification_id?: string;
}

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  client_name?: string;
}

const ConsultantDashboard = () => {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    activeClients: 0,
    pendingTasks: 0,
    completedTasks: 0,
    pendingDocuments: 0,
    monthlyRevenue: 0,
    totalRevenue: 0,
    commissionEarned: 0,
    avgClientSatisfaction: 0
  });
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && profile) {
      fetchDashboardData();
    }
  }, [user, profile]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchStats(),
        fetchConsultantAlerts(),
        fetchRecentActivity()
      ]);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Get client counts
      const { count: totalClients } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .eq('assigned_consultant_id', user?.id);

      const { count: activeClients } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .eq('assigned_consultant_id', user?.id)
        .eq('status', 'active');

      // Get task counts
      const { count: pendingTasks } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('consultant_id', user?.id)
        .in('status', ['todo', 'in_progress']);

      const { count: completedTasks } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('consultant_id', user?.id)
        .eq('status', 'completed');

      // Get document counts
      const { count: pendingDocuments } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .eq('consultant_id', user?.id)
        .in('status', ['uploaded', 'pending']);

      // Get revenue data
      const { data: orders } = await supabase
        .from('service_orders')
        .select('total_amount, consultant_commission_amount, status, created_at')
        .eq('consultant_id', user?.id);

      const completedOrders = orders?.filter(o => o.status === 'completed') || [];
      const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total_amount, 0);
      const commissionEarned = completedOrders.reduce((sum, o) => sum + (o.consultant_commission_amount || 0), 0);

      // Calculate monthly revenue
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const monthlyOrders = completedOrders.filter(o => new Date(o.created_at) >= thisMonth);
      const monthlyRevenue = monthlyOrders.reduce((sum, o) => sum + o.total_amount, 0);

      setStats({
        totalClients: totalClients || 0,
        activeClients: activeClients || 0,
        pendingTasks: pendingTasks || 0,
        completedTasks: completedTasks || 0,
        pendingDocuments: pendingDocuments || 0,
        monthlyRevenue,
        totalRevenue,
        commissionEarned,
        avgClientSatisfaction: 4.8 // Mock data
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchConsultantAlerts = async () => {
    try {
      const { data: alertsData, error } = await supabase
        .from('consultant_alerts')
        .select('alert_source_id, alert_type, is_resolved, notes')
        .eq('consultant_id', user?.id)
        .eq('is_resolved', false);

      if (error) {
        console.error('Error fetching consultant alerts:', error);
        return;
      }

      // For each alert, fetch the related notification to get payload
      const enrichedAlerts: Alert[] = [];
      for (const alert of alertsData || []) {
        try {
          const { data: notification } = await supabase
            .from('notifications')
            .select('id, payload, read_at')
            .eq('id', alert.alert_source_id)
            .single();

          enrichedAlerts.push({
            ...alert,
            payload: notification?.payload || {},
            notification_id: notification?.id
          });
        } catch (notificationError) {
          console.error('Error fetching notification for alert:', notificationError);
          // Add alert without payload if notification fetch fails
          enrichedAlerts.push({
            ...alert,
            payload: {},
            notification_id: undefined
          });
        }
      }

      setAlerts(enrichedAlerts);
    } catch (err) {
      console.error('Error fetching alerts:', err);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const { data: activityData } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (activityData) {
        setRecentActivity(activityData.map(log => ({
          id: log.id,
          type: log.action_type,
          description: log.description,
          timestamp: log.created_at,
          client_name: log.payload?.client_name
        })));
      }
    } catch (err) {
      console.error('Error fetching recent activity:', err);
    }
  };

  const markAlertAsResolved = async (alertSourceId: string, notificationId?: string) => {
    try {
      const { error } = await supabase
        .from('consultant_alerts')
        .update({ is_resolved: true, resolved_at: new Date().toISOString() })
        .eq('alert_source_id', alertSourceId);

      if (error) {
        console.error('Error resolving alert:', error);
        return;
      }

      if (notificationId) {
        const { error: notificationUpdateError } = await supabase
          .from('notifications')
          .update({ read_at: new Date().toISOString() })
          .eq('id', notificationId);

        if (notificationUpdateError) {
          console.error('Error marking notification as read:', notificationUpdateError);
        }
      }
      
      fetchConsultantAlerts();
    } catch (err) {
      console.error('Error resolving alert:', err);
    }
  };

  const statCards = [
    {
      title: 'Total Clients',
      value: stats.totalClients.toString(),
      icon: Users,
      color: 'blue',
      change: `${stats.activeClients} active`,
      changeType: 'positive' as const,
    },
    {
      title: 'Pending Tasks',
      value: stats.pendingTasks.toString(),
      icon: CheckSquare,
      color: 'orange',
      change: `${stats.completedTasks} completed`,
      changeType: 'positive' as const,
    },
    {
      title: 'Pending Documents',
      value: stats.pendingDocuments.toString(),
      icon: FileText,
      color: 'red',
      change: '3 total',
      changeType: 'neutral' as const,
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'green',
      change: '$0 total',
      changeType: 'positive' as const,
    },
  ];

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Consultant Dashboard</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
        <title>Consultant Dashboard</title>
      </Helmet>
      
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {profile?.full_name || 'Giorgi Meskhi'}!
              </h1>
              <p className="text-gray-600 text-lg">Manage your clients and track your consulting business</p>
            </div>
            <div className="hidden md:block">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-2">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  Expert Consultant
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
            </div>
          ))}
        </div>

        {/* Consultant Alerts Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2 text-yellow-600" />
              Consultant Alerts
            </h2>
            <div className="flex items-center space-x-2">
              <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
                <option>All Alerts</option>
                <option>Payment Overdue</option>
                <option>Document Due</option>
                <option>Task Assigned</option>
              </select>
              <button
                onClick={fetchConsultantAlerts}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {alerts.length > 0 ? (
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-900">
                      {alert.alert_type === 'payment_overdue' && alert.payload.client_name && alert.payload.amount ?
                        `Overdue Payment from ${alert.payload.client_name}: $${alert.payload.amount} ${alert.payload.currency || 'USD'}` :
                      alert.alert_type === 'document_due' && alert.payload.client_name && alert.payload.document_type ?
                        `Overdue Document from ${alert.payload.client_name}: ${alert.payload.document_type}` :
                      alert.alert_type === 'document_uploaded' && alert.payload.client_name && alert.payload.document_name ?
                        `New Document Uploaded by ${alert.payload.client_name}: ${alert.payload.document_name}` :
                      alert.alert_type === 'task_assigned' && alert.payload.task_title ?
                        `New Task Assigned: ${alert.payload.task_title}` :
                      `${alert.alert_type.replace('_', ' ').toUpperCase()} Alert`}
                    </p>
                    {alert.payload.due_date && (
                      <p className="text-xs text-yellow-800 mt-1 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Due: {new Date(alert.payload.due_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => markAlertAsResolved(alert.alert_source_id, alert.notification_id)}
                    className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Reviewed
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
              <p className="text-gray-600">No pending alerts. Great job staying on top of things!</p>
            </div>
          )}
        </div>

        {/* Performance & Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              Performance Summary
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <Target className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="font-medium text-gray-900">Commission Earned</span>
                </div>
                <span className="text-lg font-bold text-blue-600">${stats.commissionEarned.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-green-600 mr-3" />
                  <span className="font-medium text-gray-900">Client Satisfaction</span>
                </div>
                <span className="text-lg font-bold text-green-600">{stats.avgClientSatisfaction}/5.0</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center">
                  <Award className="w-5 h-5 text-purple-600 mr-3" />
                  <span className="font-medium text-gray-900">Total Revenue</span>
                </div>
                <span className="text-lg font-bold text-purple-600">${stats.totalRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-green-600" />
              Recent Activity
            </h3>
            {recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      {activity.client_name && (
                        <p className="text-xs text-gray-600">Client: {activity.client_name}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.timestamp).toLocaleDateString()} at {new Date(activity.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No recent activity</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Users className="w-6 h-6 text-blue-600 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Add New Client</p>
                <p className="text-sm text-gray-600">Onboard a new client</p>
              </div>
            </button>
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <CheckSquare className="w-6 h-6 text-green-600 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Create Task</p>
                <p className="text-sm text-gray-600">Add a new task</p>
              </div>
            </button>
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Calendar className="w-6 h-6 text-purple-600 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Schedule Meeting</p>
                <p className="text-sm text-gray-600">Book a client meeting</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConsultantDashboard;
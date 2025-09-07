import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  ArrowRight, 
  Globe,
  MessageSquare,
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Card, Button } from '@consulting19/shared';
import { supabase } from '@consulting19/shared';
import { useI18n } from '@consulting19/shared';
import AdminLayout from '../../components/layouts/AdminLayout';
import { Helmet } from 'react-helmet-async';

interface DashboardStats {
  totalUsers: number;
  activeConsultants: number;
  activeClients: number;
  totalProjects: number;
  monthlyRevenue: number;
  pendingDocuments: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
}

interface RecentActivity {
  id: string;
  action: string;
  resource: string;
  user: string;
  timestamp: string;
  metadata?: any;
}

interface SystemAlert {
  id: string;
  type: 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
}

const AdminDashboard = () => {
  const { t, formatCurrency, formatNumber, formatRelativeTime } = useI18n();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeConsultants: 0,
    activeClients: 0,
    totalProjects: 0,
    monthlyRevenue: 0,
    pendingDocuments: 0,
    systemHealth: 'healthy',
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch comprehensive stats
      const [
        usersResult,
        consultantsResult,
        clientsResult,
        projectsResult,
        revenueResult,
        documentsResult,
        activityResult
      ] = await Promise.all([
        supabase.from('user_profiles').select('id', { count: 'exact', head: true }),
        supabase.from('user_profiles').select('id', { count: 'exact', head: true }).eq('role', 'consultant').eq('is_active', true),
        supabase.from('clients').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('transactions').select('gross_amount').gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
        supabase.from('document_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(10)
      ]);

      // Calculate monthly revenue
      const monthlyRevenue = revenueResult.data?.reduce((sum, transaction) => sum + (transaction.gross_amount || 0), 0) || 0;

      setStats({
        totalUsers: usersResult.count || 0,
        activeConsultants: consultantsResult.count || 0,
        activeClients: clientsResult.count || 0,
        totalProjects: projectsResult.count || 0,
        monthlyRevenue,
        pendingDocuments: documentsResult.count || 0,
        systemHealth: monthlyRevenue > 10000 ? 'healthy' : monthlyRevenue > 5000 ? 'warning' : 'critical',
      });

      // Process recent activity
      if (activityResult.data) {
        setRecentActivity(activityResult.data.map(log => ({
          id: log.id,
          action: log.action,
          resource: log.resource_type,
          user: 'System User',
          timestamp: log.created_at,
          metadata: log.metadata
        })));
      }

      // Generate system alerts based on data
      const alerts: SystemAlert[] = [];
      
      if (documentsResult.count && documentsResult.count > 10) {
        alerts.push({
          id: 'pending-docs',
          type: 'warning',
          title: 'High Document Queue',
          message: `${documentsResult.count} documents pending review`,
          timestamp: new Date().toISOString()
        });
      }

      if (monthlyRevenue < 5000) {
        alerts.push({
          id: 'low-revenue',
          type: 'error',
          title: 'Revenue Alert',
          message: 'Monthly revenue below target threshold',
          timestamp: new Date().toISOString()
        });
      }

      setSystemAlerts(alerts);

      // Log telemetry
      await supabase.rpc('log_telemetry_event', {
        event_type: 'admin_dashboard_viewed',
        event_data: { stats }
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: t('dashboard.stats.totalUsers'),
      value: formatNumber(stats.totalUsers),
      icon: Users,
      color: 'blue',
      trend: '+12%',
      trendDirection: 'up' as const,
    },
    {
      title: t('dashboard.stats.activeConsultants'),
      value: formatNumber(stats.activeConsultants),
      icon: Users,
      color: 'green',
      trend: '+5%',
      trendDirection: 'up' as const,
    },
    {
      title: 'Active Clients',
      value: formatNumber(stats.activeClients),
      icon: Users,
      color: 'purple',
      trend: '+18%',
      trendDirection: 'up' as const,
    },
    {
      title: 'Total Projects',
      value: formatNumber(stats.totalProjects),
      icon: FileText,
      color: 'orange',
      trend: '+25%',
      trendDirection: 'up' as const,
    },
    {
      title: t('dashboard.stats.monthlyRevenue'),
      value: formatCurrency(stats.monthlyRevenue),
      icon: DollarSign,
      color: 'green',
      trend: '+32%',
      trendDirection: 'up' as const,
    },
    {
      title: 'Pending Documents',
      value: formatNumber(stats.pendingDocuments),
      icon: FileText,
      color: stats.pendingDocuments > 10 ? 'red' : 'gray',
      trend: stats.pendingDocuments > 10 ? 'High' : 'Normal',
      trendDirection: stats.pendingDocuments > 10 ? 'up' : 'stable' as const,
    },
  ];

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default: return <CheckCircle className="w-5 h-5 text-blue-600" />;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <Helmet>
          <title>{t('dashboard.title')} - Consulting19</title>
        </Helmet>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Helmet>
        <title>{t('dashboard.title')} - Consulting19</title>
      </Helmet>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.title')}</h1>
            <p className="text-gray-600">{t('dashboard.subtitle')}</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getHealthColor(stats.systemHealth)}`}>
              System {stats.systemHealth}
            </div>
            <Button variant="outline" size="sm" onClick={fetchDashboardData}>
              Refresh
            </Button>
          </div>
        </div>

        {/* System Alerts */}
        {systemAlerts.length > 0 && (
          <div className="mb-6 space-y-2">
            {systemAlerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border ${
                alert.type === 'error' ? 'bg-red-50 border-red-200' :
                alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-center space-x-3">
                  {getAlertIcon(alert.type)}
                  <div>
                    <h3 className="font-medium text-gray-900">{alert.title}</h3>
                    <p className="text-sm text-gray-600">{alert.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Card key={index} hover className="relative overflow-hidden">
            <Card.Body>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className={`w-4 h-4 mr-1 ${
                      stat.trendDirection === 'up' ? 'text-green-600' : 
                      stat.trendDirection === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`} />
                    <span className={`text-sm font-medium ${
                      stat.trendDirection === 'up' ? 'text-green-600' : 
                      stat.trendDirection === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {stat.trend}
                    </span>
                  </div>
                </div>
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* Financial Overview */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Financial Overview</h2>
              <Link to="/admin/financial">
                <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
                  View Reports
                </Button>
              </Link>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Gross Revenue</span>
                <span className="font-semibold text-gray-900">{formatCurrency(stats.monthlyRevenue)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Platform Fee (35%)</span>
                <span className="font-semibold text-green-600">{formatCurrency(stats.monthlyRevenue * 0.35)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Consultant Payout (65%)</span>
                <span className="font-semibold text-blue-600">{formatCurrency(stats.monthlyRevenue * 0.65)}</span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Net Revenue</span>
                  <span className="font-bold text-green-600">{formatCurrency(stats.monthlyRevenue * 0.35)}</span>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Recent Activity */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          </Card.Header>
          <Card.Body>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 font-medium">
                        {activity.action} {activity.resource}
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.user} • {formatRelativeTime(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No recent activity</p>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Quick Actions */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-3">
              <Link to="/admin/content">
                <Button variant="outline" className="w-full justify-start" icon={Globe}>
                  Manage Content
                </Button>
              </Link>
              <Link to="/admin/users">
                <Button variant="outline" className="w-full justify-start" icon={Users}>
                  Manage Users
                </Button>
              </Link>
              <Link to="/admin/financial">
                <Button variant="outline" className="w-full justify-start" icon={BarChart3}>
                  Financial Reports
                </Button>
              </Link>
              <Link to="/admin/settings">
                <Button variant="outline" className="w-full justify-start" icon={Shield}>
                  System Settings
                </Button>
              </Link>
            </div>
          </Card.Body>
        </Card>

        {/* System Health */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">System Health</h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Database</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  Healthy
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">API Response</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  Fast
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Storage</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                  75% Used
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Payments</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  Operational
                </span>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Content Management Overview */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Content Status</h2>
              <Link to="/admin/content">
                <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
                  Manage
                </Button>
              </Link>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Marketing Pages</span>
                <span className="font-semibold text-gray-900">12 Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Blog Posts</span>
                <span className="font-semibold text-gray-900">8 Published</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Countries</span>
                <span className="font-semibold text-gray-900">9 Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">FAQs</span>
                <span className="font-semibold text-gray-900">24 Active</span>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* User Management Overview */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
              <Link to="/admin/users">
                <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
                  Manage
                </Button>
              </Link>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending Approvals</span>
                <span className="font-semibold text-orange-600">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Sessions</span>
                <span className="font-semibold text-gray-900">47</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">New Registrations</span>
                <span className="font-semibold text-green-600">+12 Today</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Support Tickets</span>
                <span className="font-semibold text-blue-600">2 Open</span>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
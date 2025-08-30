import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, BarChart3, DollarSign, TrendingUp, ArrowRight } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { supabase } from '@consulting19/supabase';
import { useI18n } from '../../hooks/useI18n';
import AdminLayout from '../../components/layouts/AdminLayout';
import { Helmet } from 'react-helmet-async';

interface DashboardStats {
  totalUsers: number;
  activeConsultants: number;
  contentPages: number;
  monthlyRevenue: number;
}

interface RecentActivity {
  id: string;
  action: string;
  resource: string;
  user: string;
  timestamp: string;
}

const AdminDashboard = () => {
  const { t, formatCurrency } = useI18n();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeConsultants: 0,
    contentPages: 0,
    monthlyRevenue: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch stats in parallel
      const [usersResult, consultantsResult, pagesResult, revenueResult] = await Promise.all([
        supabase.from('user_profiles').select('id', { count: 'exact', head: true }),
        supabase.from('user_profiles').select('id', { count: 'exact', head: true }).eq('role', 'consultant'),
        supabase.from('marketing_pages').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('service_orders').select('total_amount').gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
      ]);

      // Calculate monthly revenue
      const monthlyRevenue = revenueResult.data?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

      setStats({
        totalUsers: usersResult.count || 0,
        activeConsultants: consultantsResult.count || 0,
        contentPages: pagesResult.count || 0,
        monthlyRevenue,
      });

      // Fetch recent activity from audit logs
      const { data: auditData } = await supabase
        .from('audit_logs')
        .select(`
          id,
          action,
          resource_type,
          created_at,
          user:user_profiles(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (auditData) {
        setRecentActivity(auditData.map(log => ({
          id: log.id,
          action: log.action,
          resource: log.resource_type,
          user: log.user?.full_name || 'System',
          timestamp: log.created_at,
        })));
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: t('dashboard.stats.totalUsers'),
      value: stats.totalUsers.toString(),
      icon: Users,
      color: 'blue',
    },
    {
      title: t('dashboard.stats.activeConsultants'),
      value: stats.activeConsultants.toString(),
      icon: Users,
      color: 'green',
    },
    {
      title: t('dashboard.stats.contentPages'),
      value: stats.contentPages.toString(),
      icon: FileText,
      color: 'purple',
    },
    {
      title: t('dashboard.stats.monthlyRevenue'),
      value: formatCurrency(stats.monthlyRevenue),
      icon: DollarSign,
      color: 'orange',
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <Helmet>
          <title>{t('dashboard.title')} - Consulting19</title>
        </Helmet>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('dashboard.title')}</h1>
        <p className="text-gray-600">{t('dashboard.subtitle')}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <Card.Body className="text-center">
              <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center mx-auto mb-4`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.title}</div>
            </Card.Body>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Financial Highlights */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">{t('dashboard.financialHighlights')}</h2>
              <Link to="/admin/financial">
                <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
                  {t('dashboard.viewFinancialReports')}
                </Button>
              </Link>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">{t('financial.kpis.grossRevenue')}</span>
                <span className="font-semibold text-gray-900">{formatCurrency(stats.monthlyRevenue)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">{t('financial.kpis.netRevenue')}</span>
                <span className="font-semibold text-gray-900">{formatCurrency(stats.monthlyRevenue * 0.35)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Platform Fee</span>
                <span className="font-semibold text-green-600">35%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Consultant Payout</span>
                <span className="font-semibold text-blue-600">65%</span>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Recent Activity */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">{t('dashboard.recentActivity')}</h2>
          </Card.Header>
          <Card.Body>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <span className="text-sm text-gray-900">{activity.action} {activity.resource}</span>
                      <div className="text-xs text-gray-500">
                        {activity.user} • {new Date(activity.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">{t('emptyStates.noData')}</p>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
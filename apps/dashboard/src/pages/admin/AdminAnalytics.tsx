import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Globe, Activity, Download } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { supabase } from '@consulting19/supabase';
import { useI18n } from '../../hooks/useI18n';
import AdminLayout from '../../components/layouts/AdminLayout';
import { Helmet } from 'react-helmet-async';

interface AnalyticsData {
  userGrowth: Array<{ month: string; users: number; consultants: number; clients: number }>;
  revenueGrowth: Array<{ month: string; revenue: number; transactions: number }>;
  topCountries: Array<{ country: string; projects: number; revenue: number }>;
  topConsultants: Array<{ name: string; clients: number; revenue: number; rating: number }>;
  systemMetrics: {
    totalPageViews: number;
    avgSessionDuration: string;
    bounceRate: number;
    conversionRate: number;
  };
}

const AdminAnalytics = () => {
  const { t, formatCurrency, formatNumber } = useI18n();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    userGrowth: [],
    revenueGrowth: [],
    topCountries: [],
    topConsultants: [],
    systemMetrics: {
      totalPageViews: 0,
      avgSessionDuration: '0m',
      bounceRate: 0,
      conversionRate: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('last30Days');

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch telemetry events for analytics
      const { data: telemetryData } = await supabase
        .from('telemetry_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000);

      // Mock analytics data for demonstration
      setAnalytics({
        userGrowth: [
          { month: 'Jan', users: 45, consultants: 8, clients: 37 },
          { month: 'Feb', users: 67, consultants: 12, clients: 55 },
          { month: 'Mar', users: 89, consultants: 15, clients: 74 },
          { month: 'Apr', users: 123, consultants: 19, clients: 104 },
          { month: 'May', users: 156, consultants: 23, clients: 133 },
          { month: 'Jun', users: 198, consultants: 28, clients: 170 },
        ],
        revenueGrowth: [
          { month: 'Jan', revenue: 12500, transactions: 25 },
          { month: 'Feb', revenue: 18750, transactions: 38 },
          { month: 'Mar', revenue: 24300, transactions: 49 },
          { month: 'Apr', revenue: 31200, transactions: 62 },
          { month: 'May', revenue: 38900, transactions: 78 },
          { month: 'Jun', revenue: 45600, transactions: 91 },
        ],
        topCountries: [
          { country: 'UAE', projects: 45, revenue: 112500 },
          { country: 'Estonia', projects: 38, revenue: 95000 },
          { country: 'Georgia', projects: 32, revenue: 80000 },
          { country: 'Malta', projects: 28, revenue: 70000 },
          { country: 'Portugal', projects: 22, revenue: 55000 },
        ],
        topConsultants: [
          { name: 'Giorgi Meskhi', clients: 15, revenue: 37500, rating: 4.9 },
          { name: 'Ahmed Al-Rashid', clients: 12, revenue: 30000, rating: 4.8 },
          { name: 'Maria Silva', clients: 10, revenue: 25000, rating: 4.7 },
          { name: 'Hans Mueller', clients: 8, revenue: 20000, rating: 4.9 },
        ],
        systemMetrics: {
          totalPageViews: 125000,
          avgSessionDuration: '4m 32s',
          bounceRate: 32.5,
          conversionRate: 8.7,
        },
      });

      // Log analytics view
      await supabase.rpc('log_telemetry_event', {
        event_type: 'admin_analytics_viewed',
        event_data: { date_range: dateRange }
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportAnalytics = () => {
    const csvData = analytics.revenueGrowth.map(row => ({
      Month: row.month,
      Revenue: row.revenue,
      Transactions: row.transactions,
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <AdminLayout>
        <Helmet>
          <title>{t('navigation.analytics')} - Consulting19</title>
        </Helmet>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
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
        <title>{t('navigation.analytics')} - Consulting19</title>
      </Helmet>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('navigation.analytics')}</h1>
            <p className="text-gray-600">System analytics and performance metrics</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="last7Days">Last 7 Days</option>
              <option value="last30Days">Last 30 Days</option>
              <option value="last90Days">Last 90 Days</option>
              <option value="thisYear">This Year</option>
            </select>
            <Button onClick={exportAnalytics} icon={Download}>
              Export Data
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <Card.Body className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatNumber(analytics.systemMetrics.totalPageViews)}
            </div>
            <div className="text-sm text-gray-600">Total Page Views</div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {analytics.systemMetrics.conversionRate}%
            </div>
            <div className="text-sm text-gray-600">Conversion Rate</div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {analytics.systemMetrics.avgSessionDuration}
            </div>
            <div className="text-sm text-gray-600">Avg Session Duration</div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Globe className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {analytics.systemMetrics.bounceRate}%
            </div>
            <div className="text-sm text-gray-600">Bounce Rate</div>
          </Card.Body>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Growth Chart */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">User Growth</h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              {analytics.userGrowth.map((data, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-900">{data.month}</div>
                    <div className="text-sm text-gray-600">
                      {formatNumber(data.consultants)} consultants, {formatNumber(data.clients)} clients
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {formatNumber(data.users)} total
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>

        {/* Revenue Growth Chart */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">Revenue Growth</h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              {analytics.revenueGrowth.map((data, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-900">{data.month}</div>
                    <div className="text-sm text-gray-600">
                      {formatNumber(data.transactions)} transactions
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {formatCurrency(data.revenue)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>

        {/* Top Countries */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">Top Countries</h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              {analytics.topCountries.map((country, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{country.country}</div>
                      <div className="text-sm text-gray-600">{country.projects} projects</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {formatCurrency(country.revenue)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>

        {/* Top Consultants */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">Top Consultants</h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              {analytics.topConsultants.map((consultant, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-green-600">{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{consultant.name}</div>
                      <div className="text-sm text-gray-600">
                        {consultant.clients} clients • {consultant.rating}★
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {formatCurrency(consultant.revenue)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
import React, { useState, useEffect } from 'react';
import { Users, Globe, FileText, DollarSign, TrendingUp, Activity } from 'lucide-react';
import { Card } from '../../shared/components/ui';
import { supabase } from '../../shared/lib/supabase';
import { useLanguage } from '../../shared/contexts/LanguageContext';

interface DashboardStats {
  totalUsers: number;
  activeConsultants: number;
  activeClients: number;
  totalCountries: number;
  monthlyRevenue: number;
  totalProjects: number;
}

const AdminDashboard = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeConsultants: 0,
    activeClients: 0,
    totalCountries: 0,
    monthlyRevenue: 0,
    totalProjects: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      // Fetch comprehensive stats
      const [
        usersResult,
        consultantsResult,
        clientsResult,
        countriesResult,
        projectsResult
      ] = await Promise.all([
        supabase.from('user_profiles').select('id', { count: 'exact', head: true }),
        supabase.from('user_profiles').select('id', { count: 'exact', head: true }).eq('role', 'consultant').eq('is_active', true),
        supabase.from('clients').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('countries').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('projects').select('id', { count: 'exact', head: true })
      ]);

      setStats({
        totalUsers: usersResult.count || 0,
        activeConsultants: consultantsResult.count || 0,
        activeClients: clientsResult.count || 0,
        totalCountries: countriesResult.count || 0,
        monthlyRevenue: 0, // Will be calculated from service_orders
        totalProjects: projectsResult.count || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toString(),
      icon: Users,
      color: 'blue',
      description: 'All platform users',
    },
    {
      title: 'Active Consultants',
      value: stats.activeConsultants.toString(),
      icon: Users,
      color: 'green',
      description: 'Verified consultants',
    },
    {
      title: 'Active Clients',
      value: stats.activeClients.toString(),
      icon: Users,
      color: 'purple',
      description: 'Paying customers',
    },
    {
      title: 'Countries',
      value: stats.totalCountries.toString(),
      icon: Globe,
      color: 'orange',
      description: 'Supported jurisdictions',
    },
    {
      title: 'Total Projects',
      value: stats.totalProjects.toString(),
      icon: FileText,
      color: 'teal',
      description: 'Active & completed',
    },
    {
      title: 'Monthly Revenue',
      value: '$0',
      icon: DollarSign,
      color: 'green',
      description: 'Platform earnings',
    },
  ];

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('welcome')}, Admin!
        </h1>
        <p className="text-gray-600">Platform overview and system management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} hover>
            <Card.Body>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </div>
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900 font-medium">New consultant registered</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900 font-medium">Service order completed</p>
                  <p className="text-xs text-gray-500">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900 font-medium">New country added</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
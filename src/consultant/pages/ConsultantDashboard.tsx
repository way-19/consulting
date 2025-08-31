import React, { useState, useEffect } from 'react';
import { Users, Target, DollarSign, TrendingUp, Calendar, MessageSquare } from 'lucide-react';
import { Card, Button } from '../../shared/components/ui';
import { supabase } from '../../shared/lib/supabase';
import { useAuth } from '../../shared/hooks/useAuth';
import { useLanguage } from '../../shared/contexts/LanguageContext';

interface ConsultantStats {
  activeClients: number;
  totalServices: number;
  monthlyRevenue: number;
  completedProjects: number;
  pendingTasks: number;
  responseTime: string;
}

const ConsultantDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState<ConsultantStats>({
    activeClients: 0,
    totalServices: 0,
    monthlyRevenue: 0,
    completedProjects: 0,
    pendingTasks: 0,
    responseTime: '0h',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardStats();
    }
  }, [user]);

  const fetchDashboardStats = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch consultant stats
      const [
        clientsResult,
        servicesResult,
        projectsResult
      ] = await Promise.all([
        supabase
          .from('clients')
          .select('id', { count: 'exact', head: true })
          .eq('assigned_consultant_id', user.id)
          .eq('status', 'active'),
        supabase
          .from('custom_services')
          .select('id', { count: 'exact', head: true })
          .eq('consultant_id', user.id)
          .eq('is_active', true),
        supabase
          .from('projects')
          .select('id', { count: 'exact', head: true })
          .eq('consultant_id', user.id)
      ]);

      setStats({
        activeClients: clientsResult.count || 0,
        totalServices: servicesResult.count || 0,
        monthlyRevenue: 0, // Will be calculated from service_orders
        completedProjects: projectsResult.count || 0,
        pendingTasks: 0,
        responseTime: '2.3h',
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Active Clients',
      value: stats.activeClients.toString(),
      icon: Users,
      color: 'blue',
      description: 'Currently working with',
    },
    {
      title: 'Services Created',
      value: stats.totalServices.toString(),
      icon: Target,
      color: 'purple',
      description: 'Available to clients',
    },
    {
      title: 'Monthly Revenue',
      value: '$' + stats.monthlyRevenue.toLocaleString(),
      icon: DollarSign,
      color: 'green',
      description: 'This month earnings',
    },
    {
      title: 'Completed Projects',
      value: stats.completedProjects.toString(),
      icon: TrendingUp,
      color: 'orange',
      description: 'Successfully finished',
    },
  ];

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
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
          {t('welcome')}, {user?.user_metadata?.full_name || 'Consultant'}!
        </h1>
        <p className="text-gray-600">Manage your consulting practice and grow your client base</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start" icon={Target}>
                Create New Service
              </Button>
              <Button variant="outline" className="w-full justify-start" icon={Users}>
                View Clients
              </Button>
              <Button variant="outline" className="w-full justify-start" icon={MessageSquare}>
                Send Message
              </Button>
              <Button variant="outline" className="w-full justify-start" icon={Calendar}>
                Update Schedule
              </Button>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No recent activity</p>
                <p className="text-sm text-gray-400">Activity will appear here as you work with clients</p>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default ConsultantDashboard;
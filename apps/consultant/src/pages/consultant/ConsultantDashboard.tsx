import React from 'react';
import { useState, useEffect } from 'react';
import { useAuth } from '@consulting19/shared';
import { supabase } from '@consulting19/shared/lib/supabase';
import { Users, DollarSign, TrendingUp, MessageSquare, Clock, Target, BarChart3, CheckCircle } from 'lucide-react';

const ConsultantDashboard = () => {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({
    activeClients: 0,
    pendingTasks: 0,
    monthlyRevenue: 0,
    unreadMessages: 0,
    completedProjects: 0,
    commissionEarned: 0
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
      
      // Fetch real stats from database
      const [
        { count: clientsCount },
        { count: tasksCount },
        { count: messagesCount },
        { count: projectsCount }
      ] = await Promise.all([
        supabase.from('clients').select('*', { count: 'exact', head: true }).eq('assigned_consultant_id', user?.id).eq('status', 'active'),
        supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('consultant_id', user?.id).in('status', ['todo', 'in_progress']),
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('receiver_id', user?.id).eq('is_read', false),
        supabase.from('projects').select('*', { count: 'exact', head: true }).eq('consultant_id', user?.id).eq('status', 'completed')
      ]);

      // Calculate commission earnings
      const { data: ordersData } = await supabase
        .from('service_orders')
        .select('consultant_commission_amount')
        .eq('consultant_id', user?.id)
        .eq('status', 'completed');

      const commissionEarned = ordersData?.reduce((sum, order) => sum + (order.consultant_commission_amount || 0), 0) || 0;

      setStats({
        activeClients: clientsCount || 0,
        pendingTasks: tasksCount || 0,
        monthlyRevenue: commissionEarned,
        unreadMessages: messagesCount || 0,
        completedProjects: projectsCount || 0,
        commissionEarned
      });

    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
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
      description: 'Currently assigned clients',
    },
    {
      title: 'Pending Tasks',
      value: stats.pendingTasks.toString(),
      icon: Clock,
      color: 'orange',
      description: 'Tasks requiring attention',
    },
    {
      title: 'Monthly Commission',
      value: `$${stats.commissionEarned.toLocaleString()}`,
      icon: DollarSign,
      color: 'green',
      description: 'Earned this month',
    },
    {
      title: 'Unread Messages',
      value: stats.unreadMessages.toString(),
      icon: MessageSquare,
      color: 'purple',
      description: 'New client messages',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {profile?.full_name || 'Consultant'}!
          </h1>
          <p className="text-gray-600">
            Manage your clients, track commissions, and grow your business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Stats Cards */}
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
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
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <span className="font-medium text-gray-900">View Clients</span>
              </button>

              <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-green-600" />
                </div>
                <span className="font-medium text-gray-900">Create Task</span>
              </button>

              <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-purple-600" />
                </div>
                <span className="font-medium text-gray-900">Messages</span>
              </button>

              <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-orange-600" />
                </div>
                <span className="font-medium text-gray-900">View Earnings</span>
              </button>
            </div>
          </div>
        </div>

        {/* Commission Overview */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Commission Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-600 mb-2">${stats.commissionEarned.toLocaleString()}</div>
                <div className="text-sm text-green-800">Total Earned</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-600 mb-2">{profile?.commission_rate || 65}%</div>
                <div className="text-sm text-blue-800">Commission Rate</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-2xl font-bold text-purple-600 mb-2">{stats.completedProjects}</div>
                <div className="text-sm text-purple-800">Completed Projects</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultantDashboard;
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CheckSquare, 
  DollarSign, 
  FileText, 
  Calendar,
  TrendingUp,
  Clock,
  AlertTriangle,
  Plus,
  Send,
  BarChart3,
  MessageSquare,
  Bell,
  Percent
} from 'lucide-react';
import { useAuth } from '@consulting19/shared';
import { supabase } from '@consulting19/shared/lib/supabase';
import { Link } from 'react-router-dom';

type Stats = {
  activeClients: number;
  pendingTasks: number;
  monthlyRevenue: number;
  pendingInvoices: number;
  totalDocuments: number;
  completedProjects: number;
  unreadMessages: number;
  todayMeetings: number;
  totalCommissions: number;
  thisMonthCommissions: number;
  commissionRate: number;
  systemRevenueGenerated: number;
};

const ConsultantDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    activeClients: 0,
    pendingTasks: 0,
    monthlyRevenue: 0,
    pendingInvoices: 0,
    totalDocuments: 0,
    completedProjects: 0,
    unreadMessages: 0,
    todayMeetings: 0,
    totalCommissions: 0,
    thisMonthCommissions: 0,
    commissionRate: 65,
    systemRevenueGenerated: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [realTimeStats, setRealTimeStats] = useState({
    newClients: 0,
    newMessages: 0,
    newPayments: 0
  });

  useEffect(() => {
    if (user) {
      fetchDashboardStats();
    }
  }, [user]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      const [
        { count: clientCount },
        { count: taskCount },
        { count: documentCount },
        { count: projectCount },
        { data: serviceOrdersData },
        { data: activityData },
        { data: consultantProfile }
      ] = await Promise.all([
        supabase.from('clients').select('*', { count: 'exact', head: true }).eq('assigned_consultant_id', user?.id).eq('status', 'active'),
        supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('consultant_id', user?.id).in('status', ['todo', 'in_progress']),
        supabase.from('documents').select('*', { count: 'exact', head: true }).eq('consultant_id', user?.id),
        supabase.from('projects').select('*', { count: 'exact', head: true }).eq('consultant_id', user?.id).eq('status', 'completed'),
        supabase.from('service_orders').select('id, total_amount, currency, status, created_at, consultant_commission_amount, system_commission_amount').eq('consultant_id', user?.id),
        supabase.from('audit_logs').select('*').eq('user_id', user?.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('user_profiles').select('commission_rate').eq('id', user?.id).single()
      ]);

      // Calculate monthly revenue and pending invoices
      const thisMonth = new Date();
      thisMonth.setDate(1);
      
      const monthlyRevenue = serviceOrdersData?.filter(order => 
        (order.status === 'accepted' || order.status === 'completed') && new Date(order.created_at) >= thisMonth
      ).reduce((sum, order) => sum + order.total_amount, 0) || 0;
      
      const pendingInvoices = serviceOrdersData?.filter(order => 
        order.status === 'pending' || order.status === 'quoted'
      ).length || 0;

      // Calculate commission statistics
      const completedOrders = serviceOrdersData?.filter(order => order.status === 'completed') || [];
      const totalCommissions = completedOrders.reduce((sum, order) => sum + (order.consultant_commission_amount || 0), 0);
      const systemRevenueGenerated = completedOrders.reduce((sum, order) => sum + (order.system_commission_amount || 0), 0);
      
      const thisMonthCommissions = completedOrders
        .filter(order => new Date(order.created_at) >= thisMonth)
        .reduce((sum, order) => sum + (order.consultant_commission_amount || 0), 0);

      const commissionRate = consultantProfile?.commission_rate || 65;

      setStats({
        activeClients: clientCount || 0,
        pendingTasks: taskCount || 0,
        monthlyRevenue: monthlyRevenue,
        pendingInvoices: pendingInvoices,
        totalDocuments: documentCount || 0,
        completedProjects: projectCount || 0,
        unreadMessages: 0,
        todayMeetings: 0,
        totalCommissions,
        thisMonthCommissions,
        commissionRate,
        systemRevenueGenerated
      });

      setRecentActivity(activityData || []);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
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
    );
  }

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Consultant Dashboard
        </h1>
        <p className="text-gray-600">
          Manage your clients, track revenue, and monitor service delivery
        </p>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {[
          {
            label: 'Active Clients',
            value: stats.activeClients,
            newCount: realTimeStats.newClients,
            icon: Users,
            color: 'blue',
            href: '/clients'
          },
          {
            label: 'My Commissions',
            value: `$${stats.totalCommissions.toLocaleString()}`,
            newCount: realTimeStats.newPayments,
            icon: TrendingUp,
            color: 'green',
            href: '/commissions'
          },
          {
            label: 'Pending Tasks',
            value: stats.pendingTasks,
            newCount: 0,
            icon: CheckSquare,
            color: 'orange',
            href: '/tasks'
          },
          {
            label: 'This Month',
            value: `$${stats.thisMonthCommissions.toLocaleString()}`,
            newCount: realTimeStats.newMessages,
            icon: Calendar,
            color: 'purple',
            href: '/invoices'
          },
          {
            label: 'Commission Rate',
            value: `${stats.commissionRate}%`,
            newCount: 0,
            icon: Percent,
            color: 'indigo',
            href: '/documents'
          }
        ].map((stat, index) => (
          <Link key={index} to={stat.href}>
            <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  {stat.newCount > 0 && (
                    <p className="text-xs text-green-600 font-medium">+{stat.newCount} new</p>
                  )}
                </div>
                <div className={`w-12 h-12 bg-${stat.color}-50 rounded-2xl flex items-center justify-center relative`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
                  {stat.newCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{stat.newCount}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Commission Analytics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">My Commission Analytics</h2>
          <p className="text-sm text-gray-600">Your earnings and revenue contribution</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Commissions */}
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">${stats.totalCommissions.toLocaleString()}</div>
              <div className="text-sm font-medium text-green-800">Total Commissions Earned</div>
              <div className="text-xs text-green-600 mt-1">Your {stats.commissionRate}% share</div>
            </div>

            {/* System Revenue Generated */}
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">${stats.systemRevenueGenerated.toLocaleString()}</div>
              <div className="text-sm font-medium text-blue-800">System Revenue Generated</div>
              <div className="text-xs text-blue-600 mt-1">Platform's {100 - stats.commissionRate}% share</div>
            </div>

            {/* This Month Performance */}
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200">
              <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-2">${stats.thisMonthCommissions.toLocaleString()}</div>
              <div className="text-sm font-medium text-purple-800">This Month's Commissions</div>
              <div className="text-xs text-purple-600 mt-1">Current month earnings</div>
            </div>
          </div>

          {/* Commission Rate Visualization */}
          <div className="mt-8 p-6 bg-gray-50 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Split Visualization</h3>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-700">Your Commission ({stats.commissionRate}%)</span>
                  <span className="text-sm font-bold text-green-900">${stats.totalCommissions.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${stats.commissionRate}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-700">System Share ({100 - stats.commissionRate}%)</span>
                  <span className="text-sm font-bold text-blue-900">${stats.systemRevenueGenerated.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${100 - stats.commissionRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recent Activity</h3>
            <p className="text-gray-600">
              Your recent client interactions and project updates will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultantDashboard;
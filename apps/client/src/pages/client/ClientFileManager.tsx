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
  BarChart3
} from 'lucide-react';
import { useAuth } from '@consulting19/shared';
import { supabase } from '@consulting19/shared/lib/supabase';

interface FolderStats {
  total_files: number;
  total_size: number;
  file_types: Record<string, number>;
}

interface StorageInfo {
  limit_gb: number;
  used_bytes: number;
  used_gb: number;
  usage_percentage: number;
  tier: string;
}

const ConsultantDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeClients: 0,
    pendingTasks: 0,
    monthlyRevenue: 0,
    pendingInvoices: 0,
    totalDocuments: 0,
    completedProjects: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

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
        { data: activityData }
      ] = await Promise.all([
        supabase.from('clients').select('*', { count: 'exact', head: true }).eq('assigned_consultant_id', user?.id).eq('status', 'active'),
        supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('consultant_id', user?.id).in('status', ['todo', 'in_progress']),
        supabase.from('documents').select('*', { count: 'exact', head: true }).eq('consultant_id', user?.id),
        supabase.from('projects').select('*', { count: 'exact', head: true }).eq('consultant_id', user?.id).eq('status', 'completed'),
        supabase.from('service_orders').select('id, total_amount, currency, status, created_at').eq('consultant_id', user?.id),
        supabase.from('audit_logs').select('*').eq('user_id', user?.id).order('created_at', { ascending: false }).limit(5)
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

      setStats({
        activeClients: clientCount || 0,
        pendingTasks: taskCount || 0,
        monthlyRevenue: monthlyRevenue,
        pendingInvoices: pendingInvoices,
        totalDocuments: documentCount || 0,
        completedProjects: projectCount || 0
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            label: 'Active Clients',
            value: stats.activeClients,
            icon: Users,
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50',
            href: '/clients'
          },
          {
            label: 'Monthly Revenue',
            value: `$${stats.monthlyRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: 'bg-green-500',
            bgColor: 'bg-green-50',
            href: '/financial'
          },
          {
            label: 'Pending Tasks',
            value: stats.pendingTasks,
            icon: CheckSquare,
            color: 'bg-orange-500',
            bgColor: 'bg-orange-50',
            href: '/tasks'
          },
          {
            label: 'Pending Invoices',
            value: stats.pendingInvoices,
            icon: FileText,
            color: 'bg-red-500',
            bgColor: 'bg-red-50',
            href: '/invoices'
          },
          {
            label: 'Documents',
            value: stats.totalDocuments,
            icon: FileText,
            color: 'bg-purple-500',
            bgColor: 'bg-purple-50',
            href: '/documents'
          },
          {
            label: 'Completed Projects',
            value: stats.completedProjects,
            icon: BarChart3,
            color: 'bg-teal-500',
            bgColor: 'bg-teal-50',
            href: '/projects'
          }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.bgColor} rounded-2xl flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
            </div>
          </div>
        ))}
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
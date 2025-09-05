import React from 'react';
import { useState, useEffect } from 'react';
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
        { data: invoiceData },
        { data: activityData }
      ] = await Promise.all([
        supabase.from('clients').select('*', { count: 'exact', head: true }).eq('assigned_consultant_id', user?.id).eq('status', 'active'),
        supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('consultant_id', user?.id).in('status', ['todo', 'in_progress']),
        supabase.from('documents').select('*', { count: 'exact', head: true }).eq('consultant_id', user?.id),
        supabase.from('projects').select('*', { count: 'exact', head: true }).eq('consultant_id', user?.id).eq('status', 'completed'),
        supabase.from('invoices').select('amount_due, status').eq('consultant_id', user?.id),
        supabase.from('audit_logs').select('*').eq('user_id', user?.id).order('created_at', { ascending: false }).limit(5)
      ]);

      // Calculate monthly revenue and pending invoices
      const thisMonth = new Date();
      thisMonth.setDate(1);
      
      const monthlyRevenue = invoiceData?.filter(i => 
        i.status === 'paid' && new Date(i.created_at) >= thisMonth
      ).reduce((sum, i) => sum + i.amount_due, 0) || 0;
      
      const pendingInvoices = invoiceData?.filter(i => i.status === 'pending').length || 0;

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
                <stat.icon className={`w-6 h-6 text-gray-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pending Invoices Alert */}
      {stats.pendingInvoices > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-900">
                  {stats.pendingInvoices} Pending Invoice{stats.pendingInvoices > 1 ? 's' : ''}
                </h3>
                <p className="text-red-700">
                  Review and follow up on unpaid client invoices
                </p>
              </div>
            </div>
            <button className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl">
              <FileText className="w-5 h-5 mr-2" />
              Review Invoices
            </button>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all duration-300">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Plus className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium text-blue-900">Add Client</span>
          </button>

          <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg hover:from-green-100 hover:to-green-200 transition-all duration-300">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <Send className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium text-green-900">Send Invoice</span>
          </button>

          <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all duration-300">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium text-purple-900">Upload Document</span>
          </button>

          <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg hover:from-orange-100 hover:to-orange-200 transition-all duration-300">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium text-orange-900">Schedule Meeting</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
        {recentActivity.length > 0 ? (
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(activity.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recent Activity</h3>
            <p className="text-gray-600">
              Your billing activities and payment history will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultantDashboard;

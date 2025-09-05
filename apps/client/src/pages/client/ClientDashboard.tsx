import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useAuth } from '@consulting19/shared';
import { 
  FolderOpen, 
  CheckSquare, 
  DollarSign, 
  FileText, 
  Calendar,
  TrendingUp,
  Clock,
  AlertTriangle,
  CreditCard,
  MessageSquare,
  User,
  Bell,
  Target,
  BarChart3
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedTasks: number;
  pendingTasks: number;
  totalOrders: number;
  pendingPayments: number;
  pendingAmount: number;
  upcomingPayments: number;
  upcomingAmount: number;
}

interface UpcomingPayment {
  id: string;
  title: string;
  amount: number;
  currency: string;
  due_date: string;
  status: string;
}

interface OverdueAlert {
  count: number;
  totalAmount: number;
  oldestDays: number;
}

const ClientDashboard = () => {
  const { user, profile } = useAuth();
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    completedTasks: 0,
    pendingTasks: 0,
    totalOrders: 0,
    pendingPayments: 0,
    pendingAmount: 0,
    upcomingPayments: 0,
    upcomingAmount: 0
  });
  const [upcomingPayments, setUpcomingPayments] = useState<UpcomingPayment[]>([]);
  const [overdueAlert, setOverdueAlert] = useState<OverdueAlert | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && profile) {
      fetchDashboardData();
    }
  }, [user, profile]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get client ID
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id, assigned_consultant_id')
        .eq('profile_id', user?.id)
        .maybeSingle();

      if (clientError || !clientData) {
        console.error('Client fetch error:', clientError);
        return;
      }

      // Fetch all client data
      const [ordersResult, invoicesResult, projectsResult, tasksResult] = await Promise.all([
        supabase.from('service_orders').select('*').eq('client_id', clientData.id),
        supabase.from('invoices').select('*').eq('client_id', clientData.id),
        supabase.from('projects').select('*').eq('client_id', clientData.id),
        supabase.from('tasks').select('*').eq('client_id', clientData.id).eq('is_client_visible', true)
      ]);

      const orders = ordersResult.data || [];
      const invoices = invoicesResult.data || [];
      const projects = projectsResult.data || [];
      const tasks = tasksResult.data || [];

      // Calculate stats
      const totalOrders = orders.length;
      const pendingOrders = orders.filter(o => ['pending', 'quoted'].includes(o.status));
      const pendingAmount = pendingOrders.reduce((sum, o) => sum + o.total_amount, 0);
      
      // Upcoming payments (next 30 days)
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
      const upcomingInvoices = invoices.filter(inv => {
        if (!inv.due_date || inv.status === 'paid') return false;
        const dueDate = new Date(inv.due_date);
        return dueDate >= new Date() && dueDate <= thirtyDaysFromNow;
      });

      const upcomingAmount = upcomingInvoices.reduce((sum, inv) => sum + inv.amount_due, 0);

      setDashboardStats({
        totalProjects: projects.length,
        activeProjects: projects.filter(p => p.status === 'active').length,
        completedTasks: tasks.filter(t => t.status === 'completed').length,
        pendingTasks: tasks.filter(t => ['todo', 'in_progress'].includes(t.status)).length,
        totalOrders: totalOrders,
        pendingPayments: pendingOrders.length,
        pendingAmount: pendingAmount,
        upcomingPayments: upcomingInvoices.length,
        upcomingAmount: upcomingAmount
      });

      // Set upcoming payments for timeline
      setUpcomingPayments(upcomingInvoices.map(inv => ({
        id: inv.id,
        title: inv.service_order?.title || 'Service Payment',
        amount: inv.amount_due,
        currency: inv.currency || 'USD',
        due_date: inv.due_date!,
        status: inv.status
      })));

      // Check for overdue payments
      await checkOverduePayments(clientData.id, invoices);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Check and notify about overdue payments
  const checkOverduePayments = async (clientId: string, invoices: any[]) => {
    const overdueInvoices = invoices.filter(inv => {
      if (inv.status === 'paid' || !inv.due_date) return false;
      return new Date(inv.due_date) < new Date();
    });

    if (overdueInvoices.length > 0) {
      setOverdueAlert({
        count: overdueInvoices.length,
        totalAmount: overdueInvoices.reduce((sum, inv) => sum + inv.amount_due, 0),
        oldestDays: Math.max(...overdueInvoices.map(inv => 
          Math.ceil((new Date().getTime() - new Date(inv.due_date).getTime()) / (1000 * 60 * 60 * 24))
        ))
      });
    }
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Dashboard - Client Portal</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
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
        <title>Dashboard - Client Portal</title>
      </Helmet>
      
      <div className="space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Your Dashboard
          </h1>
          <p className="text-gray-600">
            Track your projects, payments, and business expansion progress
          </p>
        </div>

        {/* Overdue Payments Alert */}
        {overdueAlert && (
          <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300 rounded-2xl p-6 shadow-lg animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-red-900 mb-1">
                    🚨 URGENT: {overdueAlert.count} Overdue Payment{overdueAlert.count > 1 ? 's' : ''}
                  </h3>
                  <p className="text-red-800 mb-2">
                    Total overdue: <span className="font-bold">${overdueAlert.totalAmount.toLocaleString()}</span>
                  </p>
                  <p className="text-red-700 text-sm">
                    Oldest payment: {overdueAlert.oldestDays} days overdue
                  </p>
                </div>
              </div>
              <Link
                to="/billing"
                className="inline-flex items-center px-8 py-4 bg-red-600 text-white rounded-xl font-bold text-lg hover:bg-red-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <CreditCard className="w-6 h-6 mr-3" />
                PAY NOW
              </Link>
            </div>
          </div>
        )}

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              label: 'My Projects',
              value: dashboardStats.totalProjects,
              icon: FolderOpen,
              color: 'blue',
              bgColor: 'bg-blue-50',
              href: '/projects',
              subtitle: `${dashboardStats.activeProjects} active`
            },
            {
              label: 'Completed Tasks',
              value: dashboardStats.completedTasks,
              icon: CheckSquare,
              color: 'green',
              bgColor: 'bg-green-50',
              href: '/tasks',
              subtitle: `${dashboardStats.pendingTasks} pending`
            },
            {
              label: 'Service Orders',
              value: dashboardStats.totalOrders,
              icon: BarChart3,
              color: 'purple',
              bgColor: 'bg-purple-50',
              href: '/services',
              subtitle: 'Total services ordered'
            },
            {
              label: 'Pending Payments',
              value: dashboardStats.pendingPayments,
              icon: DollarSign,
              color: 'red',
              bgColor: 'bg-red-50',
              href: '/billing',
              subtitle: `$${dashboardStats.pendingAmount.toLocaleString()}`
            },
            {
              label: 'Upcoming Payments',
              value: dashboardStats.upcomingPayments,
              icon: Calendar,
              color: 'orange',
              bgColor: 'bg-orange-50',
              href: '/billing',
              subtitle: `$${dashboardStats.upcomingAmount.toLocaleString()}`
            },
            {
              label: 'Progress Tracking',
              value: '85%',
              icon: TrendingUp,
              color: 'indigo',
              bgColor: 'bg-indigo-50',
              href: '/progress',
              subtitle: 'Overall completion'
            }
          ].map((stat, index) => (
            <Link
              key={index}
              to={stat.href}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 block"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-2xl flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Upcoming Payments Timeline */}
        {upcomingPayments.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Upcoming Payments</h2>
            <div className="space-y-4">
              {upcomingPayments.slice(0, 3).map((payment) => {
                const daysUntilDue = Math.ceil(
                  (new Date(payment.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                );
                
                return (
                  <div key={payment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <div>
                        <h3 className="font-semibold text-gray-900">{payment.title}</h3>
                        <p className="text-sm text-gray-600">
                          Due in {daysUntilDue} days • {new Date(payment.due_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        ${payment.amount.toLocaleString()} {payment.currency}
                      </div>
                      <Link
                        to="/billing"
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Pay Now →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/projects"
              className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all duration-300"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <FolderOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-blue-900">View Projects</span>
            </Link>

            <Link
              to="/billing"
              className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg hover:from-green-100 hover:to-green-200 transition-all duration-300"
            >
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-green-900">Manage Billing</span>
            </Link>

            <Link
              to="/messages"
              className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all duration-300"
            >
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-purple-900">Contact Support</span>
            </Link>

            <Link
              to="/calendar"
              className="flex items-center space-x-3 p-4 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg hover:from-orange-100 hover:to-orange-200 transition-all duration-300"
            >
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-orange-900">Schedule Meeting</span>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome to Consulting19!</h3>
            <p className="text-gray-600">
              Your project activities and updates will appear here as you work with your consultant.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientDashboard;
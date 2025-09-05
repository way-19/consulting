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
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[120px]"
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-gray-900">Stripe Checkout</span>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Primary</span>
                  <span className="font-medium text-gray-500">Wire Transfer</span>
                </div>
                <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded-full text-xs">Coming Soon</span>
        {/* Payment History */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Receipt className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Payment History ({filteredOrders.length})</h2>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                        {getStatusIcon(order.status)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{order.title}</h3>
                        <div className="flex items-center space-x-3 text-sm text-gray-500">
                          <span className="font-bold text-green-600">${order.total_amount.toLocaleString()} {order.currency}</span>
                          <span>•</span>
                          <span>{new Date(order.created_at).toLocaleDateString()}</span>
                          {order.status === 'paid' && order.consultant && (
                            <>
                              <span>•</span>
                              <span>Paid: {new Date(order.created_at).toLocaleDateString()}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'paid' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status.toUpperCase()}
                      </span>
                      
                      {order.status === 'pending' && (
                        <button 
                          onClick={() => handlePayment(order)}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Pay Now
                        </button>
                      )}
                      
                      {order.status === 'paid' && (
                        <button 
                          onClick={() => generateInvoicePDF(order.id)}
                          disabled={generatingInvoice === order.id}
                          className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                        >
                          {generatingInvoice === order.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                          ) : (
                            <Download className="w-4 h-4 mr-2" />
                          )}
                          Receipt
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Receipt className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">No Financial History</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Your payment history and invoices will appear here once you start ordering services from your consultant.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Browse Services
              </button>
              <button className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold">
                <Send className="w-5 h-5 mr-2" />
                Contact Consultant
              </button>
            </div>
          </div>
          )}
        </div>

        {/* Financial Insights */}
        <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-2xl shadow-2xl overflow-hidden">
          <div className="relative p-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full -translate-y-32 translate-x-32"></div>
            
            <div className="relative">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <BarChart3 className="w-6 h-6 mr-2 text-blue-400" />
                Financial Insights
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
              </div>
                      <h3 className="text-lg font-bold text-white">Payment Success Rate</h3>
                      <p className="text-sm text-blue-200">Excellent payment reliability</p>
                      <p className="text-2xl font-bold text-green-400">0%</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                      <DollarSign className="w-6 h-6 text-white" />
                      ></div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Average Transaction</h3>
                      <p className="text-sm text-blue-200">Your spending pattern</p>
                      <p className="text-2xl font-bold text-blue-400">$1,500</p>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">{item.percentage}% of total spending</span>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Receipt className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Service Orders</h3>
                      <p className="text-sm text-blue-200">Total transactions</p>
                      <p className="text-2xl font-bold text-purple-400">{orders.length}</p>
                    </div>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
              </div>

              {/* Smart Financial Tips */}
              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                  Smart Financial Tips
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">💡</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">Tax Optimization</h4>
                        <p className="text-sm text-blue-200">Business expenses may be tax-deductible. Consult with your advisor.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">💰</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">Budget Planning</h4>
                        <p className="text-sm text-blue-200">Your average transaction is $1,500. Plan accordingly.</p>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
            </div>
              </button>
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
        )}
      </div>
    </div>
  );
};

export default ConsultantDashboard;
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  BarChart3, 
  FileText, 
  CheckSquare, 
  MessageSquare, 
  CreditCard, 
  Settings,
  TrendingUp,
  Clock,
  Bell,
  Activity,
  Calendar,
  User,
  Briefcase
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

const ClientDashboard = () => {
  const { user, profile } = useAuth();
  const [recentActivity, setRecentActivity] = React.useState([]);
  const [stats, setStats] = React.useState({
    activeProjects: 0,
    pendingTasks: 0,
    totalDocuments: 0,
    unreadMessages: 0,
    pendingPayments: 0
  });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (user && profile) {
      fetchDashboardData();
    }
  }, [user, profile]);

  const fetchDashboardData = async () => {
    try {
      // Get client ID
      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', user?.id)
        .single();

      if (!clientData) return;

      // Fetch various stats in parallel
      const [
        { count: projectCount },
        { count: taskCount },
        { count: documentCount },
        { count: messageCount },
        { count: paymentCount },
        { data: auditData }
      ] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }).eq('client_id', clientData.id).eq('status', 'active'),
        supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('client_id', clientData.id).in('status', ['todo', 'in_progress']).eq('is_client_visible', true),
        supabase.from('documents').select('*', { count: 'exact', head: true }).eq('client_id', clientData.id),
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('receiver_id', user?.id).eq('is_read', false),
        supabase.from('service_orders').select('*', { count: 'exact', head: true }).eq('client_id', clientData.id).eq('status', 'pending'),
        supabase.from('audit_logs').select('*').eq('user_id', user?.id).order('created_at', { ascending: false }).limit(5)
      ]);

      setStats({
        activeProjects: projectCount || 0,
        pendingTasks: taskCount || 0,
        totalDocuments: documentCount || 0,
        unreadMessages: messageCount || 0,
        pendingPayments: paymentCount || 0
      });

      setRecentActivity(auditData || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const dashboardStats = [
    { label: 'Active Projects', value: stats.activeProjects.toString(), icon: BarChart3, color: 'text-blue-600', href: '/projects' },
    { label: 'Pending Tasks', value: stats.pendingTasks.toString(), icon: CheckSquare, color: 'text-orange-600', href: '/tasks' },
    { label: 'Documents', value: stats.totalDocuments.toString(), icon: FileText, color: 'text-green-600', href: '/documents' },
    { label: 'Unread Messages', value: stats.unreadMessages.toString(), icon: MessageSquare, color: 'text-purple-600', href: '/messages' },
    { label: 'Pending Payments', value: stats.pendingPayments.toString(), icon: CreditCard, color: 'text-red-600', href: '/billing' },
  ];

  const quickActions = [
    { label: 'View Projects', href: '/projects', icon: BarChart3, color: 'bg-blue-100 text-blue-600' },
    { label: 'Upload Accounting', href: '/documents', icon: FileText, color: 'bg-green-100 text-green-600' },
    { label: 'Check Tasks', href: '/tasks', icon: CheckSquare, color: 'bg-orange-100 text-orange-600' },
    { label: 'Send Message', href: '/messages', icon: MessageSquare, color: 'bg-purple-100 text-purple-600' },
    { label: 'View Mailbox', href: '/mailbox', icon: Mail, color: 'bg-indigo-100 text-indigo-600' },
    { label: 'Browse Services', href: '/services', icon: Briefcase, color: 'bg-teal-100 text-teal-600' },
  ];

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Dashboard - Client Portal</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-64 bg-gray-200 rounded-lg"></div>
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Client Dashboard - Consulting19</title>
      </Helmet>
      
      <div className="space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Client'}!
          </h1>
          <p className="text-gray-600 mt-2">Manage your projects and services</p>
        </div>

        {/* Stats Grid - Made mobile-responsive with cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {dashboardStats.map((stat, index) => (
            <Link 
              key={index} 
              to={stat.href}
              className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions - Mobile-First Card Design */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.href}
                  className="flex items-center p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 hover:scale-105 group"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform ${action.color}`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-gray-900">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Activity className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            </div>
            
            {recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.slice(0, 5).map((activity: any) => (
                  <div key={activity.id} className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-gray-900">{activity.description}</p>
                      <p className="text-gray-500 text-xs">
                        {new Date(activity.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 text-sm">No recent activity</p>
                <p className="text-gray-500 text-xs">Your actions will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Welcome Information for New Users */}
        {stats.activeProjects === 0 && stats.pendingTasks === 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Welcome to Consulting19! 🎉
                </h3>
                <p className="text-blue-800 mb-4">
                  You're all set! Here's what you can do next to get the most out of your consulting experience:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">1</span>
                    </div>
                    <span className="text-blue-800">Message your consultant to introduce yourself</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">2</span>
                    </div>
                    <span className="text-blue-800">Browse available services you might need</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">3</span>
                    </div>
                    <span className="text-blue-800">Upload any documents you already have</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">4</span>
                    </div>
                    <span className="text-blue-800">Review and complete your profile settings</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ClientDashboard;
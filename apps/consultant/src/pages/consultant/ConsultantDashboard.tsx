```typescript
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home,
  FolderOpen,
  CheckSquare,
  FileText, 
  MessageSquare, 
  Calendar,
  Upload,
  CreditCard,
  User,
  Clock,
  TrendingUp,
  ArrowRight,
  AlertCircle,
  Target,
  BarChart3,
  Settings,
  Bell,
  DollarSign,
  Award,
  Briefcase,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Card, Button } from '@consulting19/shared';
import { supabase } from '@consulting19/shared/lib/supabase';
import { useAuth } from '@consulting19/shared';
import { useI18n } from '@consulting19/shared';
import { Helmet } from 'react-helmet-async';

interface DashboardStats {
  activeProjects: number; // Used for active clients
  pendingTasks: number;
  totalDocuments: number;
  unreadMessages: number;
  completedMilestones: number;
  upcomingMeetings: number;
  totalSpent: number; // Used for total earnings
  pendingPayments: number; // Used for pending payouts
  consultantName: string;
  consultantEmail: string;
  clientStatus: string; // Consultant's own status
}

interface RecentActivity {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  status: string;
}

interface Consultant { 
  id: string;
  full_name: string;
  email: string;
  timezone: string;
  is_online: boolean;
}
interface QuickAction {
  label: string;
  href: string;
  icon: any;
  color: string;
  description: string;
}

const ConsultantDashboard = () => { 
  const { user, profile } = useAuth();
  const { t } = useI18n();
  const [stats, setStats] = useState<DashboardStats>({
    activeProjects: 0, 
    pendingTasks: 0,
    totalDocuments: 0,
    unreadMessages: 0,
    completedMilestones: 0,
    upcomingMeetings: 0,
    totalSpent: 0, 
    pendingPayments: 0, 
    consultantName: profile?.full_name || '', 
    consultantEmail: profile?.email || '', 
    clientStatus: profile?.is_active ? 'active' : 'pending', 
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [consultant, setConsultant] = useState<Consultant | null>(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && profile) {
      fetchDashboardData();
    }
  }, [user, profile]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch total clients assigned to this consultant
      const { count: totalClientsCount, error: clientsError } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .eq('assigned_consultant_id', user?.id);

      if (clientsError) {
        console.error('Error fetching total clients:', clientsError);
        return;
      }

      // Fetch active clients assigned to this consultant
      const { count: activeClientsCount, error: activeClientsError } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .eq('assigned_consultant_id', user?.id)
        .eq('status', 'active');

      if (activeClientsError) {
        console.error('Error fetching active clients:', activeClientsError);
        return;
      }

      // Fetch pending tasks for clients assigned to this consultant
      const { count: pendingTasksCount, error: pendingTasksError } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('consultant_id', user?.id)
        .in('status', ['todo', 'in_progress', 'review']);

      if (pendingTasksError) {
        console.error('Error fetching pending tasks:', pendingTasksError);
        return;
      }

      // Fetch total documents uploaded by clients assigned to this consultant
      const { count: totalDocumentsCount, error: totalDocumentsError } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .eq('consultant_id', user?.id); 

      if (totalDocumentsError) {
        console.error('Error fetching total documents:', totalDocumentsError);
        return;
      }

      // Fetch unread messages for this consultant
      const { count: unreadMessagesCount, error: unreadMessagesError } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user?.id)
        .eq('is_read', false);

      if (unreadMessagesError) {
        console.error('Error fetching unread messages:', unreadMessagesError);
        return;
      }

      // Fetch upcoming meetings for this consultant
      const { count: upcomingMeetingsCount, error: upcomingMeetingsError } = await supabase
        .from('meetings')
        .select('*', { count: 'exact', head: true })
        .eq('consultant_id', user?.id)
        .gte('start_time', new Date().toISOString());

      if (upcomingMeetingsError) {
        console.error('Error fetching upcoming meetings:', upcomingMeetingsError);
        return;
      }

      // Fetch financial data (total earnings, pending payouts) for this consultant
      const { data: serviceOrdersData, error: serviceOrdersError } = await supabase
        .from('service_orders')
        .select('total_amount, status, consultant_commission_amount')
        .eq('consultant_id', user?.id);

      if (serviceOrdersError) {
        console.error('Error fetching service orders:', serviceOrdersError);
        return;
      }

      const totalEarnings = serviceOrdersData?.filter(so => so.status === 'completed').reduce((sum, so) => sum + (so.consultant_commission_amount || 0), 0) || 0;
      const pendingPayouts = serviceOrdersData?.filter(so => so.status !== 'completed').reduce((sum, so) => sum + (so.consultant_commission_amount || 0), 0) || 0; 

      setStats({
        activeProjects: activeClientsCount || 0, 
        pendingTasks: pendingTasksCount || 0,
        totalDocuments: totalDocumentsCount || 0,
        unreadMessages: unreadMessagesCount || 0,
        completedMilestones: 0, 
        upcomingMeetings: upcomingMeetingsCount || 0,
        totalSpent: totalEarnings, 
        pendingPayments: pendingPayouts, 
        consultantName: profile?.full_name || user?.user_metadata?.full_name || 'Consultant',
        consultantEmail: profile?.email || user?.email || '',
        clientStatus: profile?.is_active ? 'active' : 'pending', 
      });

      // Fetch recent activity for this consultant
      const { data: activityData, error: activityError } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (activityError) {
        console.error('Error fetching recent activity:', activityError);
        return;
      }

      if (activityData) {
        setRecentActivity(activityData.map(log => ({
          id: log.id,
          type: log.action_type,
          title: log.description,
          description: log.action_type,
          timestamp: log.created_at,
          status: 'completed'
        })));
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const quickActions: QuickAction[] = [
    { 
      label: 'Manage Clients', 
      href: '/clients', 
      icon: Users, 
      color: 'blue',
      description: 'View and manage your assigned clients'
    },
    { 
      label: 'Manage Tasks', 
      href: '/tasks', 
      icon: CheckSquare, 
      color: 'green',
      description: 'Assign and track tasks for clients'
    },
    { 
      label: 'Review Documents', 
      href: '/documents', 
      icon: FileText, 
      color: 'purple',
      description: 'Review client uploaded documents'
    },
    { 
      label: 'Messages', 
      href: '/messages', 
      icon: MessageSquare, 
      color: 'orange',
      description: 'Communicate with clients'
    },
    { 
      label: 'My Services', 
      href: '/services', 
      icon: Briefcase, 
      color: 'indigo',
      description: 'Create and manage your service offerings'
    },
    { 
      label: 'Availability', 
      href: '/availability', 
      icon: Calendar, 
      color: 'red',
      description: 'Manage your meeting availability'
    },
  ];

  const statCards = [
    {
      title: 'Active Clients', 
      value: stats.activeProjects.toString(),
      icon: Users, 
      color: 'blue',
      href: '/clients',
      change: stats.activeProjects > 0 ? `${stats.activeProjects} active` : 'No active clients',
      changeType: 'positive' as const,
    },
    {
      title: 'Pending Tasks',
      value: stats.pendingTasks.toString(),
      icon: CheckSquare,
      color: 'orange',
      href: '/tasks',
      change: stats.pendingTasks > 0 ? `${stats.pendingTasks} pending` : 'All caught up',
      changeType: 'neutral' as const,
    },
    {
      title: 'Total Documents',
      value: stats.totalDocuments.toString(),
      icon: FileText,
      color: 'green',
      href: '/documents',
      change: stats.totalDocuments > 0 ? `${stats.totalDocuments} uploaded` : 'No documents yet',
      changeType: 'positive' as const,
    },
    {
      title: 'Unread Messages',
      value: stats.unreadMessages.toString(),
      icon: MessageSquare,
      color: 'purple',
      href: '/messages',
      change: stats.unreadMessages > 0 ? 'New messages' : 'All caught up',
      changeType: stats.unreadMessages > 0 ? 'neutral' : 'positive' as const,
    },
    {
      title: 'Total Earnings', 
      value: `$${stats.totalSpent.toLocaleString()}`,
      icon: DollarSign,
      color: 'green',
      href: '/financial', 
      change: stats.totalSpent > 0 ? 'View earnings' : 'No earnings yet',
      changeType: 'positive' as const,
    },
    {
      title: 'Upcoming Meetings',
      value: stats.upcomingMeetings.toString(),
      icon: Calendar,
      color: 'indigo',
      href: '/availability', 
      change: stats.upcomingMeetings > 0 ? 'Next meeting soon' : 'No meetings scheduled',
      changeType: 'neutral' as const,
    },
  ];

  if (loading) {
    return (
      <>
        <Helmet>
          <title>{t('dashboard.title')} - Consulting19</title>
        </Helmet>
        
        <div className="space-y-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
        <title>{t('dashboard.title')} - Consulting19</title>
      </Helmet>
      
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {t('dashboard.welcome')}, {profile?.full_name || user?.user_metadata?.full_name || 'Consultant'}!
              </h1>
              <p className="text-gray-600 text-lg">{t('dashboard.subtitle')}</p>
              {profile && ( 
                <div className="mt-4 flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-700">Your Status:</span>
                    <span className="text-sm font-semibold text-blue-700">{profile.is_active ? 'Active' : 'Pending'}</span>
                  </div>
                  <Link
                    to="/settings"
                    className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Settings className="w-3 h-3 mr-1" />
                    Settings
                  </Link>
                </div>
              )}
            </div>
            <div className="hidden md:block">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-2">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  stats.clientStatus === 'active' ? 'bg-green-100 text-green-800' :
                  stats.clientStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {stats.clientStatus}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 responsive-grid">
          {statCards.map((stat, index) => (
            <Link key={index} to={stat.href} className="group">
              <Card hover className="h-full transition-all duration-200 group-hover:shadow-xl mobile-p-2 md:p-6">
                <Card.Body>
                  <div className="flex items-center justify-between mb-2 md:mb-4">
                    <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-gray-600 transition-colors mobile-hidden" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">{stat.value}</p>
                    <div className="flex items-center">
                      <TrendingUp className={`w-4 h-4 mr-1 ${
                        stat.changeType === 'positive' ? 'text-green-600' : 
                        stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                      }`} />
                      <span className={`text-xs md:text-sm font-medium ${
                        stat.changeType === 'positive' ? 'text-green-600' : 
                        stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Link>
          ))}
        </div>

        {/* Pending Payments Alert */}
        {stats.pendingPayments > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <h3 className="text-sm font-semibold text-yellow-900">Pending Payouts</h3> 
                <p className="text-sm text-yellow-800">
                  You have ${stats.pendingPayments.toLocaleString()} in pending payouts.
                </p>
              </div>
              <Link
                to="/financial" 
                className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                View Payouts
              </Link>
            </div>
          </div>
        )}
        {/* Quick Actions */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
            <p className="text-gray-600">Common tasks and shortcuts</p>
          </Card.Header>
          <Card.Body>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 responsive-grid-2">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.href}
                  className="group flex flex-col items-center p-3 md:p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                >
                  <div className={`w-12 h-12 bg-${action.color}-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                    <action.icon className={`w-6 h-6 text-${action.color}-600`} />
                  </div>
                  <span className="text-xs md:text-sm font-medium text-gray-900 text-center mb-1">{action.label}</span>
                  <span className="text-xs text-gray-500 text-center mobile-hidden">{action.description}</span>
                </Link>
              ))}
            </div>
          </Card.Body>
        </Card>

        {/* Recent Activity & Consultant Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
          {/* Recent Activity */}
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                <Link to="/progress"> 
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </Card.Header>
            <Card.Body>
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                        <Bell className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.timestamp).toLocaleDateString()} • {new Date(activity.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recent Activity</h3>
                  <p className="text-gray-600">Your activity will appear here as you use the platform</p>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Consultant Info - This section is for client dashboard, needs to be adapted for consultant */}
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">My Profile</h2> 
            </Card.Header>
            <Card.Body>
              {profile ? ( 
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      {profile.is_active && ( 
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{profile.full_name}</h3>
                      <p className="text-sm text-gray-600">{profile.email}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{profile.is_active ? '🟢 Active' : '🔴 Inactive'}</span>
                        <span>•</span>
                        <span>{profile.timezone}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Link to="/messages" className="block">
                      <Button className="w-full" icon={MessageSquare}>
                        View Messages
                      </Button>
                    </Link>
                    <Link to="/settings" className="block">
                      <Button variant="outline" className="w-full" icon={Settings}>
                        Edit Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Not Loaded</h3>
                  <p className="text-gray-600 mb-6">
                    Your profile information is not available. Please try refreshing the page.
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>

        {/* Financial Overview */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">Financial Overview</h2>
            <p className="text-gray-600">Your earnings and payouts</p>
          </Card.Header>
          <Card.Body>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-2 md:mb-3">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div className="text-xl md:text-2xl font-bold text-green-600 mb-1">${stats.totalSpent.toLocaleString()}</div>
                <div className="text-xs md:text-sm text-green-800">Total Earnings</div>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-2 md:mb-3">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="text-xl md:text-2xl font-bold text-yellow-600 mb-1">${stats.pendingPayments.toLocaleString()}</div>
                <div className="text-xs md:text-sm text-yellow-800">Pending Payouts</div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-2 md:mb-3">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="text-xl md:text-2xl font-bold text-blue-600 mb-1">{stats.activeProjects}</div>
                <div className="text-xs md:text-sm text-blue-800">Active Clients</div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default ConsultantDashboard;
```
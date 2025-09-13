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
  activeProjects: number;
  pendingTasks: number;
  totalDocuments: number;
  unreadMessages: number;
  completedMilestones: number;
  upcomingMeetings: number;
  totalSpent: number;
  pendingPayments: number;
  consultantName: string;
  consultantEmail: string;
  clientStatus: string;
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

const ClientDashboard = () => {
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
    consultantName: '',
    consultantEmail: '',
    clientStatus: 'pending',
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
      
      // Get client ID
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select(`
          id, 
          status, 
          assigned_consultant_id,
          consultant:user_profiles!clients_assigned_consultant_id_fkey(
            id, full_name, email, timezone
          )
        `)
        .eq('profile_id', user?.id)
        .maybeSingle();

      if (clientError || !clientData) {
        console.error('Client data not found:', clientError);
        setLoading(false);
        return;
      }

      // Set consultant info
      if (clientData.consultant) {
        setConsultant({
          ...clientData.consultant,
          is_online: Math.random() > 0.5 // Mock online status
        });
      }

      // Fetch comprehensive stats
      const [
        { count: projectsCount },
        { count: tasksCount },
        { count: documentsCount },
        { count: messagesCount },
        { count: meetingsCount }
      ] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }).eq('client_id', clientData.id).eq('status', 'active'),
        supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('client_id', clientData.id).in('status', ['todo', 'in_progress']),
        supabase.from('documents').select('*', { count: 'exact', head: true }).eq('client_id', clientData.id),
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('receiver_id', user?.id).eq('is_read', false),
        supabase.from('meetings').select('*', { count: 'exact', head: true }).eq('client_id', clientData.id).gte('start_time', new Date().toISOString())
      ]);

      // Fetch financial data
      const { data: invoicesData } = await supabase
        .from('invoices')
        .select('amount_due, status')
        .eq('client_id', clientData.id);

      const totalSpent = invoicesData?.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount_due, 0) || 0;
      const pendingPayments = invoicesData?.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.amount_due, 0) || 0;

      setStats({
        activeProjects: projectsCount || 0,
        pendingTasks: tasksCount || 0,
        totalDocuments: documentsCount || 0,
        unreadMessages: messagesCount || 0,
        completedMilestones: 2, // Mock for now
        upcomingMeetings: meetingsCount || 0,
        totalSpent,
        pendingPayments,
        consultantName: clientData.consultant?.full_name || '',
        consultantEmail: clientData.consultant?.email || '',
        clientStatus: clientData.status || 'pending'
      });

      // Fetch recent activity
      const { data: activityData } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

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
      label: t('navigation.projects'), 
      href: '/projects', 
      icon: FolderOpen, 
      color: 'blue',
      description: 'View and manage your projects'
    },
    { 
      label: t('navigation.tasks'), 
      href: '/tasks', 
      icon: CheckSquare, 
      color: 'green',
      description: 'Check your pending tasks'
    },
    { 
      label: 'Company Documents', 
      href: '/mailbox', 
      icon: FileText, 
      color: 'blue',
      description: 'View official company documents'
    },
    { 
      label: t('navigation.messages'), 
      href: '/messages', 
      icon: MessageSquare, 
      color: 'orange',
      description: 'Chat with your consultant'
    },
    { 
      label: 'Meetings', 
      href: '/meetings', 
      icon: Calendar, 
      color: 'indigo',
      description: 'Schedule and join meetings'
    },
    { 
      label: t('navigation.accounting'), 
      href: '/accounting', 
      icon: BarChart3, 
      color: 'purple',
      description: 'Submit monthly financial documents'
    },
    { 
      label: t('navigation.billing'), 
      href: '/billing', 
      icon: CreditCard, 
      color: 'red',
      description: 'View invoices and payments'
    },
  ];

  const statCards = [
    {
      title: t('dashboard.stats.activeProjects'),
      value: stats.activeProjects.toString(),
      icon: Target,
      color: 'blue',
      href: '/projects',
      change: stats.activeProjects > 0 ? `${stats.activeProjects} active` : 'No active projects',
      changeType: 'positive' as const,
    },
    {
      title: t('dashboard.stats.pendingTasks'),
      value: stats.pendingTasks.toString(),
      icon: CheckSquare,
      color: 'orange',
      href: '/tasks',
      change: stats.pendingTasks > 0 ? `${stats.pendingTasks} pending` : 'All caught up',
      changeType: 'neutral' as const,
    },
    {
      title: t('dashboard.stats.totalDocuments'),
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
      title: 'Total Spent',
      value: `$${stats.totalSpent.toLocaleString()}`,
      icon: DollarSign,
      color: 'green',
      href: '/billing',
      change: stats.totalSpent > 0 ? 'View billing' : 'No payments yet',
      changeType: 'positive' as const,
    },
    {
      title: 'Upcoming Meetings',
      value: stats.upcomingMeetings.toString(),
      icon: Calendar,
      color: 'indigo',
      href: '/meetings',
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
                {t('dashboard.welcome')}, {profile?.full_name || user?.user_metadata?.full_name || 'Client'}!
              </h1>
              <p className="text-gray-600 text-lg">{t('dashboard.subtitle')}</p>
              {consultant && (
                <div className="mt-4 flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-700">Your Consultant:</span>
                    <span className="text-sm font-semibold text-blue-700">{consultant.full_name}</span>
                  </div>
                  <Link
                    to="/messages"
                    className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Message
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
                <h3 className="text-sm font-semibold text-yellow-900">Pending Payments</h3>
                <p className="text-sm text-yellow-800">
                  You have ${stats.pendingPayments.toLocaleString()} in pending payments.
                </p>
              </div>
              <Link
                to="/billing"
                className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Pay Now
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

          {/* Consultant Info */}
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">Your Consultant</h2>
            </Card.Header>
            <Card.Body>
              {consultant ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      {consultant.is_online && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{consultant.full_name}</h3>
                      <p className="text-sm text-gray-600">{consultant.email}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{consultant.is_online ? '🟢 Online' : '🔴 Offline'}</span>
                        <span>•</span>
                        <span>{consultant.timezone}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Link to="/messages" className="block">
                      <Button className="w-full" icon={MessageSquare}>
                        Send Message
                      </Button>
                    </Link>
                    <Link to="/meetings" className="block">
                      <Button variant="outline" className="w-full" icon={Calendar}>
                        Schedule Meeting
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Consultant Assignment</h3>
                  <p className="text-gray-600 mb-6">
                    You'll be assigned to an expert consultant who will guide your business expansion journey.
                  </p>
                  <div className="space-y-3">
                    <Link to="/support" className="block">
                      <Button className="w-full" icon={MessageSquare}>
                        Contact Support
                      </Button>
                    </Link>
                    <Link to="/meetings" className="block">
                      <Button variant="outline" className="w-full" icon={Calendar}>
                        Schedule Consultation
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>

        {/* Getting Started */}
        {stats.clientStatus === 'pending' && (
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Getting Started</h2>
                  <p className="text-gray-600">Complete these steps to maximize your experience</p>
                </div>
                <Link
                  to="/onboarding"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Continue Setup
                </Link>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-green-900 mb-2">Account Created</h3>
                  <p className="text-sm text-green-700">✓ Welcome to Consulting19!</p>
                </div>

                <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-blue-900 mb-2">Complete Profile</h3>
                  <p className="text-sm text-blue-700">Add your business information</p>
                </div>

                <div className="text-center p-6 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-purple-900 mb-2">Choose Services</h3>
                  <p className="text-sm text-purple-700">Select your expansion goals</p>
                </div>

                <div className="text-center p-6 bg-orange-50 rounded-xl border border-orange-200">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-orange-900 mb-2">Meet Your Consultant</h3>
                  <p className="text-sm text-orange-700">Start your consultation</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Financial Overview */}
        {stats.totalSpent > 0 && (
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">Financial Overview</h2>
              <p className="text-gray-600">Your investment in business expansion</p>
            </Card.Header>
            <Card.Body>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-2 md:mb-3">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-green-600 mb-1">${stats.totalSpent.toLocaleString()}</div>
                  <div className="text-xs md:text-sm text-green-800">Total Investment</div>
                </div>
                
                <div className="text-center p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-2 md:mb-3">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-yellow-600 mb-1">${stats.pendingPayments.toLocaleString()}</div>
                  <div className="text-xs md:text-sm text-yellow-800">Pending Payments</div>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-2 md:mb-3">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-blue-600 mb-1">{stats.activeProjects}</div>
                  <div className="text-xs md:text-sm text-blue-800">Active Projects</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        )}
      </div>
    </>
  );
};

export default ClientDashboard;
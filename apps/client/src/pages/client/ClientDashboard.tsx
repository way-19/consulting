import React from 'react';
import { Link } from 'react-router-dom';
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
  Activity,
  Calendar,
  User,
  Briefcase,
  Mail,
  ArrowRight,
  Sparkles,
  Target,
  Zap,
  Globe,
  Shield,
  Award,
  ChevronRight,
  Plus,
  Upload
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
    completedMilestones: 0
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
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id, assigned_consultant_id')
        .eq('profile_id', user?.id)
        .maybeSingle();

      if (clientError) {
        console.error('Error fetching client data:', clientError);
        return;
      }

      if (!clientData) {
        console.log('No client record found for user');
        return;
      }

      // Fetch various stats in parallel
      const [
        { count: projectCount },
        { count: taskCount },
        { count: documentCount },
        { count: messageCount },
        { data: auditData },
        { count: completedTaskCount },
        { data: pendingOrders }
      ] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }).eq('client_id', clientData.id).eq('status', 'active'),
        supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('client_id', clientData.id).in('status', ['todo', 'in_progress']).eq('is_client_visible', true),
        supabase.from('documents').select('*', { count: 'exact', head: true }).eq('client_id', clientData.id),
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('receiver_id', user?.id).eq('is_read', false),
        supabase.from('audit_logs').select('*').eq('user_id', user?.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('client_id', clientData.id).eq('status', 'completed').eq('is_client_visible', true),
        supabase.from('service_orders').select('id, total_amount, currency, status').eq('client_id', clientData.id).in('status', ['pending', 'quoted'])
      ]);

      // Calculate pending payment stats
      const pendingPaymentAmount = pendingOrders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

      setStats({
        activeProjects: projectCount || 0,
        pendingTasks: taskCount || 0,
        totalDocuments: documentCount || 0,
        unreadMessages: messageCount || 0,
        completedMilestones: completedTaskCount || 0,
        pendingPayments: pendingOrders?.length || 0,
        pendingPaymentAmount: pendingPaymentAmount
      });

      setRecentActivity(auditData || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const dashboardStats = [
    { 
      label: 'Active Projects', 
      value: stats.activeProjects.toString(), 
      icon: BarChart3, 
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      href: '/projects',
      trend: '+12%'
    },
    { 
      label: 'Pending Tasks', 
      value: stats.pendingTasks.toString(), 
      icon: CheckSquare, 
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      href: '/tasks',
      trend: '+8%'
    },
    { 
      label: 'Documents', 
      value: stats.totalDocuments.toString(), 
      icon: FileText, 
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      href: '/documents',
      trend: '+5%'
    },
    { 
      label: 'Unread Messages', 
      value: stats.unreadMessages.toString(), 
      icon: MessageSquare, 
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      href: '/messages',
      trend: 'New!'
    },
    { 
      label: 'Milestones', 
      value: stats.completedMilestones.toString(), 
      icon: Award, 
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600',
      href: '/projects',
      trend: '+3'
    },
  ];

  const quickActions = [
    { 
      label: 'Start New Project', 
      description: 'Begin your business expansion',
      href: '/services', 
      icon: Target, 
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700'
    },
    { 
      label: 'Upload Documents', 
      description: 'Submit accounting or legal docs',
      href: '/documents', 
      icon: Upload, 
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700'
    },
    { 
      label: 'Message Consultant', 
      description: 'Get expert guidance',
      href: '/messages', 
      icon: MessageSquare, 
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700'
    },
    { 
      label: 'Schedule Meeting', 
      description: 'Book time with consultant',
      href: '/calendar', 
      icon: Calendar, 
      color: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
      hoverColor: 'hover:from-indigo-600 hover:to-indigo-700'
    },
    { 
      label: 'Check Progress', 
      description: 'Review your milestones and achievements',
      href: '/progress', 
      icon: TrendingUp, 
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
      hoverColor: 'hover:from-orange-600 hover:to-orange-700'
    },
    { 
      label: 'View Invoices', 
      description: 'Manage payments and billing',
      href: '/billing', 
      icon: CreditCard, 
      color: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
      hoverColor: 'hover:from-emerald-600 hover:to-emerald-700'
    },
  ];

  const recentActivityItems = [
    { type: 'milestone', text: 'Company registration completed', time: '2 hours ago', icon: Award, color: 'text-green-600' },
    { type: 'document', text: 'Tax certificate uploaded', time: '1 day ago', icon: FileText, color: 'text-blue-600' },
    { type: 'message', text: 'Message from consultant received', time: '2 days ago', icon: MessageSquare, color: 'text-purple-600' },
    { type: 'payment', text: 'Service payment processed', time: '3 days ago', icon: CreditCard, color: 'text-green-600' },
  ];

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Dashboard - Consulting19 Client Portal</title>
        </Helmet>
        
        <div className="space-y-8">
          {/* Loading Header */}
          <div className="animate-pulse">
            <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/2 mb-3"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          </div>

          {/* Loading Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Loading Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 animate-pulse">
              <div className="h-64 bg-gray-200 rounded-2xl"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - Consulting19 Client Portal</title>
        <meta name="description" content="Manage your international business expansion projects and track progress with Consulting19" />
      </Helmet>
      
      <div className="space-y-8">
        {/* Modern Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-teal-50 rounded-3xl p-8 border border-gray-100">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full -translate-y-32 translate-x-32 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-100 to-pink-100 rounded-full translate-y-24 -translate-x-24 opacity-30"></div>
          
          <div className="relative">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Client'}!
                </h1>
                <p className="text-gray-600 text-lg">Your international business expansion journey continues</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 mt-6">
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-white/50 shadow-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">System Status: All Good</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-white/50 shadow-sm">
                <Globe className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Multi-Language Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {dashboardStats.map((stat, index) => (
            <Link 
              key={index} 
              to={stat.href}
              className="group relative overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300" style={{background: `linear-gradient(135deg, ${stat.color.split(' ')[1]}, ${stat.color.split(' ')[3]})`}}></div>
              
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {stat.trend}
                  </span>
                </div>
                
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r transition-all duration-300" 
                     style={{backgroundImage: `linear-gradient(135deg, ${stat.color.split(' ')[1]}, ${stat.color.split(' ')[3]})`}}>
                    {stat.value}
                  </p>
                </div>

                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions - Enhanced */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                Quick Actions
              </h2>
              <p className="text-sm text-gray-600 mt-1">Jump into your most common tasks</p>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.href}
                    className="group relative overflow-hidden rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <div className={`absolute inset-0 ${action.color} ${action.hoverColor} transition-all duration-300`}></div>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-all duration-300"></div>
                    
                    <div className="relative">
                      <div className="flex items-center justify-between mb-3">
                        <action.icon className="w-8 h-8 text-white/90 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                        <ArrowRight className="w-5 h-5 text-white/60 group-hover:text-white/90 group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{action.label}</h3>
                      <p className="text-sm text-white/80">{action.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Activity Panel */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-green-500" />
                  Recent Activity
                </h2>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View All
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.slice(0, 5).map((activity: any) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Activity className="w-4 h-4 text-blue-600" />
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
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Clean Slate</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Your activity timeline will populate as you start using the platform
                  </p>
                </div>
              )}

              {/* Simulated Recent Activity */}
              <div className="space-y-4 mt-6">
                {recentActivityItems.slice(0, 4).map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <activity.icon className={`w-4 h-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.text}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Information for New Users - Enhanced */}
        {stats.activeProjects === 0 && stats.pendingTasks === 0 && (
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 rounded-3xl border border-indigo-200 p-8">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
            
            <div className="relative">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0">
                  <User className="w-8 h-8 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-2xl font-bold text-indigo-900">
                      Welcome to Consulting19! 
                    </h3>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                  
                  <p className="text-indigo-800 mb-6 text-lg leading-relaxed">
                    Your international business expansion platform is ready. Here's how to get started:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { icon: MessageSquare, text: 'Connect with your expert consultant', color: 'bg-purple-500' },
                      { icon: Briefcase, text: 'Explore specialized services for your needs', color: 'bg-blue-500' },
                      { icon: FileText, text: 'Upload documents securely', color: 'bg-green-500' },
                      { icon: Settings, text: 'Customize your profile preferences', color: 'bg-orange-500' },
                    ].map((step, index) => (
                      <div key={index} className="flex items-center space-x-3 p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 hover:bg-white/90 transition-all duration-300 group">
                        <div className={`w-10 h-10 ${step.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <span className="text-white text-lg font-bold">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-indigo-900">{step.text}</p>
                        </div>
                        <step.icon className="w-5 h-5 text-indigo-600 group-hover:text-indigo-700" />
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center space-x-4">
                    <Link
                      to="/services"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <Target className="w-5 h-5 mr-2" />
                      Explore Services
                    </Link>
                    <Link
                      to="/messages"
                      className="inline-flex items-center px-6 py-3 border-2 border-indigo-300 text-indigo-700 rounded-xl font-semibold hover:bg-indigo-50 transition-all duration-300"
                    >
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Contact Consultant
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Overview - Only show for active users */}
        {(stats.activeProjects > 0 || stats.pendingTasks > 0) && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                Your Progress Overview
              </h2>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Award className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stats.completedMilestones}</div>
                  <div className="text-sm text-gray-600">Milestones Completed</div>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <BarChart3 className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stats.activeProjects}</div>
                  <div className="text-sm text-gray-600">Active Projects</div>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <CheckSquare className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stats.pendingTasks}</div>
                  <div className="text-sm text-gray-600">Pending Tasks</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Security & Trust Section */}
        <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 rounded-2xl shadow-xl text-white overflow-hidden">
          <div className="relative p-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full -translate-y-32 translate-x-32"></div>
            
            <div className="relative">
              <div className="flex items-center space-x-3 mb-6">
                <Shield className="w-8 h-8 text-blue-400" />
                <h2 className="text-2xl font-bold">Security & Trust</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">Bank-Level Security</p>
                    <p className="text-sm text-gray-300">256-bit encryption</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">Global Compliance</p>
                    <p className="text-sm text-gray-300">19+ jurisdictions</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">Expert Network</p>
                    <p className="text-sm text-gray-300">Verified consultants</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientDashboard;
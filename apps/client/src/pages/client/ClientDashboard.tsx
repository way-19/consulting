import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import {
  FolderOpen,
  CheckSquare,
  FileText,
  MessageSquare,
  Trophy,
  TrendingUp,
  Upload,
  Calendar,
  BarChart3,
  CreditCard,
  Target,
  Send,
  Shield,
  Globe,
  Users,
  Zap,
  Activity,
  Clock,
  CheckCircle,
  User,
  Building,
  Receipt,
  MessageCircle
} from "lucide-react";
import { useAuth } from "@consulting19/shared";
import { supabase } from "@consulting19/shared/lib/supabase";

type Stats = {
  activeProjects: number;
  pendingTasks: number;
  totalDocuments: number;
  unreadMessages: number;
  milestones: number;
  projectsGrowth: number;
  tasksGrowth: number;
  documentsGrowth: number;
  messagesGrowth: number;
  milestonesGrowth: number;
};

type ActivityItem = {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  color: string;
};

const ClientDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    activeProjects: 1,
    pendingTasks: 3,
    totalDocuments: 2,
    unreadMessages: 0,
    milestones: 1,
    projectsGrowth: 12,
    tasksGrowth: 8,
    documentsGrowth: 5,
    messagesGrowth: 0,
    milestonesGrowth: 3,
  });
  const [recentActivity] = useState<ActivityItem[]>([
    {
      id: '1',
      type: 'login',
      title: 'User logged in',
      description: '',
      timestamp: '05.09.2025 17:56:37',
      icon: '👤',
      color: 'blue'
    },
    {
      id: '2', 
      type: 'document',
      title: 'Uploaded document: Tax ID Application Form.pdf',
      description: '',
      timestamp: '05.09.2025 17:56:37',
      icon: '📄',
      color: 'blue'
    },
    {
      id: '3',
      type: 'milestone',
      title: 'Company registration completed',
      description: '2 hours ago',
      timestamp: '2 hours ago',
      icon: '🏢',
      color: 'green'
    },
    {
      id: '4',
      type: 'document',
      title: 'Tax certificate uploaded',
      description: '1 day ago',
      timestamp: '1 day ago',
      icon: '📋',
      color: 'blue'
    },
    {
      id: '5',
      type: 'message',
      title: 'Message from consultant received',
      description: '2 days ago',
      timestamp: '2 days ago',
      icon: '💬',
      color: 'purple'
    },
    {
      id: '6',
      type: 'payment',
      title: 'Service payment processed',
      description: '3 days ago', 
      timestamp: '3 days ago',
      icon: '💳',
      color: 'green'
    }
  ]);

  useEffect(() => {
    if (!user) return;

    // Simulate loading for smooth transition
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, [user]);

  const getDisplayName = () => {
    if (profile?.display_name) return profile.display_name;
    if (profile?.full_name) return profile.full_name;
    if (user?.email) return user.email.split('@')[0];
    return 'Client';
  };

  if (!user) {
    return (
      <>
        <Helmet>
          <title>Dashboard - Client Portal</title>
        </Helmet>
        
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-gray-900">Welcome</h1>
          <p className="text-gray-600 mt-2">Please sign in to view your dashboard.</p>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Dashboard - Client Portal</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-28 bg-gray-200 rounded-lg"></div>
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
        {/* Header with Welcome Message */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full opacity-20 transform translate-x-16 -translate-y-16"></div>
          <div className="relative flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {getDisplayName()}!
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                Your international business expansion journey continues
              </p>
            </div>
          </div>
          
          {/* Status Indicators */}
          <div className="mt-6 flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">System Status: All Good</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Multi-Language Ready</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            {
              label: 'Active Projects',
              value: stats.activeProjects,
              growth: stats.projectsGrowth,
              icon: BarChart3,
              color: 'blue',
              href: '/projects'
            },
            {
              label: 'Pending Tasks',
              value: stats.pendingTasks,
              growth: stats.tasksGrowth,
              icon: CheckSquare,
              color: 'orange',
              href: '/tasks'
            },
            {
              label: 'Documents',
              value: stats.totalDocuments,
              growth: stats.documentsGrowth,
              icon: FileText,
              color: 'green',
              href: '/documents'
            },
            {
              label: 'Unread Messages',
              value: stats.unreadMessages,
              growth: stats.messagesGrowth,
              isNew: stats.unreadMessages === 0,
              icon: MessageSquare,
              color: 'purple',
              href: '/messages'
            },
            {
              label: 'Milestones',
              value: stats.milestones,
              growth: stats.milestonesGrowth,
              icon: Trophy,
              color: 'yellow',
              href: '/progress'
            }
          ].map((stat, index) => (
            <Link key={index} to={stat.href}>
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  {stat.isNew ? (
                    <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded-full animate-pulse">
                      New!
                    </span>
                  ) : (
                    <span className={`text-xs font-bold text-${stat.color}-600`}>
                      +{stat.growth}%
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="px-8 py-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                  Quick Actions
                </h2>
                <p className="text-sm text-gray-600 mt-1">Jump into your most common tasks</p>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      title: 'Start New Project',
                      description: 'Begin your business expansion',
                      icon: Target,
                      color: 'blue',
                      href: '/services',
                      gradient: 'from-blue-500 to-blue-600'
                    },
                    {
                      title: 'Upload Documents',
                      description: 'Submit accounting or legal docs',
                      icon: Upload,
                      color: 'green',
                      href: '/documents',
                      gradient: 'from-green-500 to-green-600'
                    },
                    {
                      title: 'Message Consultant',
                      description: 'Get expert guidance',
                      icon: MessageCircle,
                      color: 'purple',
                      href: '/messages',
                      gradient: 'from-purple-500 to-purple-600'
                    },
                    {
                      title: 'Schedule Meeting',
                      description: 'Book time with consultant',
                      icon: Calendar,
                      color: 'indigo',
                      href: '/calendar',
                      gradient: 'from-indigo-500 to-indigo-600'
                    },
                    {
                      title: 'Check Progress',
                      description: 'Review your milestones and achievements',
                      icon: BarChart3,
                      color: 'orange',
                      href: '/progress',
                      gradient: 'from-orange-500 to-orange-600'
                    },
                    {
                      title: 'View Invoices',
                      description: 'Manage payments and billing',
                      icon: CreditCard,
                      color: 'teal',
                      href: '/billing',
                      gradient: 'from-teal-500 to-teal-600'
                    }
                  ].map((action, index) => (
                    <Link key={index} to={action.href}>
                      <div className="group relative overflow-hidden bg-gradient-to-br bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-xl transition-all duration-300 cursor-pointer">
                        <div className="flex items-start space-x-4">
                          <div className={`w-12 h-12 bg-gradient-to-r ${action.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                            <action.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {action.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1 group-hover:text-gray-700">
                              {action.description}
                            </p>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 text-sm">→</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 h-full">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-green-500" />
                    Recent Activity
                  </h2>
                  <Link to="/progress" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View All
                  </Link>
                </div>
              </div>
              
              <div className="p-6 max-h-96 overflow-y-auto">
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm">{activity.icon}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {activity.timestamp}
                        </p>
                        {activity.description && (
                          <p className="text-xs text-gray-600 mt-1">
                            {activity.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Your Progress Overview */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <BarChart3 className="w-6 h-6 mr-2 text-green-500" />
              Your Progress Overview
            </h2>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">1</div>
                <div className="text-sm font-medium text-gray-600">Milestones Completed</div>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">1</div>
                <div className="text-sm font-medium text-gray-600">Active Projects</div>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-orange-200">
                <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <CheckSquare className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">3</div>
                <div className="text-sm font-medium text-gray-600">Pending Tasks</div>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Trust */}
        <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-2xl shadow-2xl overflow-hidden">
          <div className="relative p-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full -translate-y-32 translate-x-32"></div>
            
            <div className="relative">
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
                <Shield className="w-7 h-7 mr-3 text-blue-400" />
                Security & Trust
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Bank-Level Security</h3>
                      <p className="text-sm text-blue-200">256-bit encryption</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Global Compliance</h3>
                      <p className="text-sm text-blue-200">19+ jurisdictions</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Expert Network</h3>
                      <p className="text-sm text-blue-200">Verified consultants</p>
                    </div>
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
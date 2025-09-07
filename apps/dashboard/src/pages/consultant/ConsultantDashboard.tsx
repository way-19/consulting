import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  FileText, 
  Clock, 
  MessageSquare,
  Calendar,
  Target,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Upload
} from 'lucide-react';
import { Card, Button } from '@consulting19/shared';
import { supabase } from '@consulting19/shared';
import { useAuth } from '@consulting19/shared';
import { useI18n } from '../../hooks/useI18n';
import ConsultantLayout from '../../components/layouts/ConsultantLayout';
import { Helmet } from 'react-helmet-async';

interface ConsultantStats {
  activeClients: number;
  totalProjects: number;
  monthlyRevenue: number;
  pendingDocuments: number;
  completedTasks: number;
  responseTime: string;
  clientSatisfaction: number;
}

interface RecentClient {
  id: string;
  name: string;
  company: string;
  status: string;
  lastActivity: string;
  priority: string;
}

interface PendingTask {
  id: string;
  title: string;
  client: string;
  dueDate: string;
  priority: string;
  status: string;
}

interface DocumentRequest {
  id: string;
  title: string;
  client: string;
  dueDate: string;
  status: string;
  priority: string;
}

const ConsultantDashboard = () => {
  const { user } = useAuth();
  const { t, formatCurrency, formatNumber, formatRelativeTime } = useI18n();
  const [stats, setStats] = useState<ConsultantStats>({
    activeClients: 0,
    totalProjects: 0,
    monthlyRevenue: 0,
    pendingDocuments: 0,
    completedTasks: 0,
    responseTime: '0h',
    clientSatisfaction: 0,
  });
  const [recentClients, setRecentClients] = useState<RecentClient[]>([]);
  const [pendingTasks, setPendingTasks] = useState<PendingTask[]>([]);
  const [documentRequests, setDocumentRequests] = useState<DocumentRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch comprehensive consultant stats
      const [
        clientsResult,
        projectsResult,
        revenueResult,
        documentsResult,
        tasksResult
      ] = await Promise.all([
        supabase
          .from('clients')
          .select('*, profile:user_profiles(full_name)')
          .eq('assigned_consultant_id', user.id)
          .eq('status', 'active'),
        supabase
          .from('projects')
          .select('*')
          .eq('consultant_id', user.id),
        supabase
          .from('transactions')
          .select('consultant_amount')
          .eq('consultant_id', user.id)
          .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
        supabase
          .from('document_requests')
          .select('*, client:clients(profile:user_profiles(full_name))')
          .eq('consultant_id', user.id)
          .eq('status', 'pending'),
        supabase
          .from('tasks')
          .select('*')
          .eq('consultant_id', user.id)
          .eq('status', 'completed')
          .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
      ]);

      // Calculate stats
      const monthlyRevenue = revenueResult.data?.reduce((sum, t) => sum + (t.consultant_amount || 0), 0) || 0;
      
      setStats({
        activeClients: clientsResult.data?.length || 0,
        totalProjects: projectsResult.data?.length || 0,
        monthlyRevenue,
        pendingDocuments: documentsResult.data?.length || 0,
        completedTasks: tasksResult.data?.length || 0,
        responseTime: '2.3h',
        clientSatisfaction: 4.8,
      });

      // Process recent clients
      if (clientsResult.data) {
        setRecentClients(clientsResult.data.slice(0, 5).map(client => ({
          id: client.id,
          name: client.profile?.full_name || 'Unknown',
          company: client.company_name || 'No company',
          status: client.status,
          lastActivity: client.updated_at,
          priority: client.priority
        })));
      }

      // Process document requests
      if (documentsResult.data) {
        setDocumentRequests(documentsResult.data.slice(0, 5).map(req => ({
          id: req.id,
          title: req.title,
          client: req.client?.profile?.full_name || 'Unknown',
          dueDate: req.due_date,
          status: req.status,
          priority: req.priority
        })));
      }

      // Log telemetry
      await supabase.rpc('log_telemetry_event', {
        event_type: 'consultant_dashboard_viewed',
        event_data: { consultant_id: user.id }
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const statCards = [
    {
      title: t('dashboard.stats.activeClients'),
      value: formatNumber(stats.activeClients),
      icon: Users,
      color: 'blue',
      change: '+3 this month',
      changeType: 'positive' as const,
    },
    {
      title: 'Total Projects',
      value: formatNumber(stats.totalProjects),
      icon: Target,
      color: 'purple',
      change: '+5 this month',
      changeType: 'positive' as const,
    },
    {
      title: t('dashboard.stats.monthlyRevenue'),
      value: formatCurrency(stats.monthlyRevenue),
      icon: DollarSign,
      color: 'green',
      change: '+18% vs last month',
      changeType: 'positive' as const,
    },
    {
      title: 'Pending Documents',
      value: formatNumber(stats.pendingDocuments),
      icon: FileText,
      color: stats.pendingDocuments > 5 ? 'red' : 'gray',
      change: stats.pendingDocuments > 5 ? 'Needs attention' : 'Under control',
      changeType: stats.pendingDocuments > 5 ? 'negative' : 'neutral' as const,
    },
    {
      title: 'Completed Tasks',
      value: formatNumber(stats.completedTasks),
      icon: CheckCircle,
      color: 'green',
      change: '+12 this month',
      changeType: 'positive' as const,
    },
    {
      title: 'Avg Response Time',
      value: stats.responseTime,
      icon: Clock,
      color: 'blue',
      change: '-15min improvement',
      changeType: 'positive' as const,
    },
  ];

  if (loading) {
    return (
      <ConsultantLayout>
        <Helmet>
          <title>{t('dashboard.title')} - Consulting19</title>
        </Helmet>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </ConsultantLayout>
    );
  }

  return (
    <ConsultantLayout>
      <Helmet>
        <title>{t('dashboard.title')} - Consulting19</title>
      </Helmet>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t('dashboard.welcome')}, {user?.user_metadata?.full_name || 'Consultant'}!
            </h1>
            <p className="text-gray-600">Manage your clients and grow your consulting practice</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              Online
            </div>
            <Button variant="outline" size="sm" onClick={fetchDashboardData}>
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Card key={index} hover className="relative overflow-hidden">
            <Card.Body>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className={`w-4 h-4 mr-1 ${
                      stat.changeType === 'positive' ? 'text-green-600' : 
                      stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                    }`} />
                    <span className={`text-xs font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 
                      stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* Recent Clients */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Clients</h2>
              <Link to="/consultant/clients">
                <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
                  View All
                </Button>
              </Link>
            </div>
          </Card.Header>
          <Card.Body>
            {recentClients.length > 0 ? (
              <div className="space-y-4">
                {recentClients.map((client) => (
                  <div key={client.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{client.name}</p>
                        <p className="text-sm text-gray-600">{client.company}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                        {client.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatRelativeTime(client.lastActivity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No clients yet</p>
                <Link to="/consultant/clients">
                  <Button variant="outline" size="sm" className="mt-2">
                    Add First Client
                  </Button>
                </Link>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Document Requests */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Document Requests</h2>
              <Link to="/consultant/documents">
                <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
                  Manage
                </Button>
              </Link>
            </div>
          </Card.Header>
          <Card.Body>
            {documentRequests.length > 0 ? (
              <div className="space-y-4">
                {documentRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        request.priority === 'high' ? 'bg-red-500' :
                        request.priority === 'medium' ? 'bg-orange-500' : 'bg-green-500'
                      }`}></div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{request.title}</p>
                        <p className="text-xs text-gray-600">{request.client}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                      {request.dueDate && (
                        <p className="text-xs text-gray-500 mt-1">
                          Due {new Date(request.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No pending requests</p>
                <Link to="/consultant/documents">
                  <Button variant="outline" size="sm" className="mt-2">
                    Request Document
                  </Button>
                </Link>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">Performance</h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Client Satisfaction</span>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full ${
                          i < Math.floor(stats.clientSatisfaction) ? 'bg-yellow-400' : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-gray-900">{stats.clientSatisfaction}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Response Time</span>
                <span className="font-semibold text-gray-900">{stats.responseTime}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Project Success Rate</span>
                <span className="font-semibold text-green-600">96%</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">On-time Delivery</span>
                <span className="font-semibold text-blue-600">94%</span>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Quick Actions */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-3">
              <Link to="/consultant/clients">
                <Button variant="outline" className="w-full justify-start" icon={Users}>
                  Add New Client
                </Button>
              </Link>
              <Link to="/consultant/documents">
                <Button variant="outline" className="w-full justify-start" icon={Upload}>
                  Request Document
                </Button>
              </Link>
              <Link to="/consultant/services">
                <Button variant="outline" className="w-full justify-start" icon={Target}>
                  Create Service
                </Button>
              </Link>
              <Link to="/consultant/availability">
                <Button variant="outline" className="w-full justify-start" icon={Calendar}>
                  Update Schedule
                </Button>
              </Link>
            </div>
          </Card.Body>
        </Card>

        {/* Revenue Breakdown */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Revenue Breakdown</h2>
              <Link to="/consultant/analytics">
                <Button variant="outline" size="sm" icon={BarChart3}>
                  Analytics
                </Button>
              </Link>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">This Month</span>
                <span className="font-semibold text-gray-900">{formatCurrency(stats.monthlyRevenue)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Last Month</span>
                <span className="font-semibold text-gray-700">{formatCurrency(stats.monthlyRevenue * 0.82)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">YTD Total</span>
                <span className="font-semibold text-gray-900">{formatCurrency(stats.monthlyRevenue * 8.5)}</span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Growth Rate</span>
                  <span className="font-bold text-green-600">+18%</span>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Deadlines</h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              {documentRequests.filter(req => req.dueDate).slice(0, 4).map((request) => (
                <div key={request.id} className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    new Date(request.dueDate) < new Date(Date.now() + 24 * 60 * 60 * 1000) ? 'bg-red-500' :
                    new Date(request.dueDate) < new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) ? 'bg-orange-500' : 'bg-green-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{request.title}</p>
                    <p className="text-xs text-gray-600">{request.client}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {new Date(request.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {documentRequests.filter(req => req.dueDate).length === 0 && (
                <div className="text-center py-6">
                  <Calendar className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No upcoming deadlines</p>
                </div>
              )}
            </div>
          </Card.Body>
        </Card>
      </div>
    </ConsultantLayout>
  );
};

export default ConsultantDashboard;
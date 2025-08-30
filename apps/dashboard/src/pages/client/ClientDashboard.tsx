import React, { useState, useEffect } from 'react';
import { FolderOpen, CheckSquare, FileText, CreditCard, TrendingUp, Clock, User, Calendar, MessageCircle, Upload, Briefcase } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { supabase } from '@consulting19/supabase';
import { useAuth } from '@consulting19/shared';
import { useI18n } from '../../hooks/useI18n';
import ClientLayout from '../../components/layouts/ClientLayout';
import { Helmet } from 'react-helmet-async';

interface DashboardStats {
  activeProjects: number;
  pendingTasks: number;
  totalDocuments: number;
  overdueInvoices: number;
}

interface Project {
  id: string;
  name: string;
  description_i18n: any;
  status: string;
  priority: string;
  progress: number;
  consultant: {
    full_name: string;
  };
}

interface RecentActivity {
  id: string;
  type: string;
  title: string;
  timestamp: string;
  status?: string;
}

const ClientDashboard = () => {
  const { user } = useAuth();
  const { t, formatCurrency, getLocalizedContent } = useI18n();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<DashboardStats>({
    activeProjects: 0,
    pendingTasks: 0,
    totalDocuments: 0,
    overdueInvoices: 0,
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
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

      // Fetch client record
      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', user.id)
        .single();

      if (!clientData) {
        setLoading(false);
        return;
      }

      // Fetch stats in parallel
      const [projectsResult, tasksResult, documentsResult] = await Promise.all([
        supabase
          .from('projects')
          .select('id, status')
          .eq('client_id', clientData.id),
        supabase
          .from('tasks')
          .select('id, status')
          .eq('client_id', clientData.id)
          .eq('is_client_visible', true),
        supabase
          .from('documents')
          .select('id')
          .eq('client_id', clientData.id),
      ]);

      // Calculate stats
      const activeProjects = projectsResult.data?.filter(p => p.status === 'active').length || 0;
      const pendingTasks = tasksResult.data?.filter(t => ['todo', 'in_progress'].includes(t.status)).length || 0;
      const totalDocuments = documentsResult.data?.length || 0;

      setStats({
        activeProjects,
        pendingTasks,
        totalDocuments,
        overdueInvoices: 0, // TODO: Implement when invoicing is added
      });

      // Fetch recent projects
      const { data: projectsData } = await supabase
        .from('projects')
        .select(`
          *,
          consultant:user_profiles!projects_consultant_id_fkey(full_name)
        `)
        .eq('client_id', clientData.id)
        .order('updated_at', { ascending: false })
        .limit(3);

      setProjects(projectsData || []);

      // Mock recent activity (TODO: Implement proper activity tracking)
      setRecentActivity([
        {
          id: '1',
          type: 'project_updated',
          title: 'Project progress updated',
          timestamp: new Date().toISOString(),
          status: 'active'
        },
        {
          id: '2',
          type: 'document_approved',
          title: 'Passport document approved',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'approved'
        },
        {
          id: '3',
          type: 'task_assigned',
          title: 'New task assigned',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending'
        }
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <ClientLayout>
        <Helmet>
          <title>{t('dashboard.title')} - Consulting19</title>
        </Helmet>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <Helmet>
        <title>{t('dashboard.title')} - Consulting19</title>
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('dashboard.welcome')}, {user?.user_metadata?.full_name || 'Client'}!
        </h1>
        <p className="text-gray-600">Track your international business expansion progress</p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: t('dashboard.overview'), icon: Home },
              { id: 'projects', label: t('dashboard.projects'), icon: FolderOpen },
              { id: 'documents', label: t('dashboard.documents'), icon: FileText },
              { id: 'invoices', label: t('dashboard.invoices'), icon: CreditCard },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <Card.Body className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FolderOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stats.activeProjects}</div>
                <div className="text-sm text-gray-600">{t('dashboard.stats.activeProjects')}</div>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CheckSquare className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stats.pendingTasks}</div>
                <div className="text-sm text-gray-600">{t('dashboard.stats.pendingTasks')}</div>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalDocuments}</div>
                <div className="text-sm text-gray-600">{t('dashboard.stats.totalDocuments')}</div>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-6 h-6 text-red-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stats.overdueInvoices}</div>
                <div className="text-sm text-gray-600">{t('dashboard.stats.overdueInvoices')}</div>
              </Card.Body>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
            </Card.Header>
            <Card.Body>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" icon={FolderOpen} iconPosition="left" className="justify-start">
                  {t('dashboard.quickActions.viewProjects')}
                </Button>
                <Button variant="outline" icon={Upload} iconPosition="left" className="justify-start">
                  {t('dashboard.quickActions.uploadDocument')}
                </Button>
                <Button variant="outline" icon={Calendar} iconPosition="left" className="justify-start">
                  {t('dashboard.quickActions.bookMeeting')}
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Recent Projects */}
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">{t('projects.title')}</h2>
            </Card.Header>
            <Card.Body>
              {projects.length > 0 ? (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{project.name}</h3>
                          <p className="text-sm text-gray-600">
                            {getLocalizedContent(project.description_i18n, 'description', 'No description')}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {t('projects.consultant')}: {project.consultant?.full_name}
                          </p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                            {t(`projects.status.${project.status}`)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                            {t(`projects.priority.${project.priority}`)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>{t('projects.progress')}</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {t('projects.emptyState.title')}
                  </h3>
                  <p className="text-gray-600">
                    {t('projects.emptyState.description')}
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">{t('projects.title')}</h2>
          </Card.Header>
          <Card.Body>
            <p className="text-gray-600 mb-4">{t('projects.subtitle')}</p>
            {/* Projects content will be implemented in ClientProjects component */}
            <div className="text-center py-8">
              <p className="text-gray-500">Project details will be shown here</p>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">{t('documents.title')}</h2>
          </Card.Header>
          <Card.Body>
            <p className="text-gray-600 mb-4">{t('documents.subtitle')}</p>
            {/* Documents content will be implemented in ClientDocuments component */}
            <div className="text-center py-8">
              <p className="text-gray-500">Document management will be shown here</p>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Invoices Tab */}
      {activeTab === 'invoices' && (
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">{t('billing.title')}</h2>
          </Card.Header>
          <Card.Body>
            <p className="text-gray-600 mb-4">{t('billing.subtitle')}</p>
            {/* Billing content will be implemented in ClientBilling component */}
            <div className="text-center py-8">
              <p className="text-gray-500">Billing information will be shown here</p>
            </div>
          </Card.Body>
        </Card>
      )}
    </ClientLayout>
  );
};

export default ClientDashboard;
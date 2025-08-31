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
  Target
} from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { supabase } from '@consulting19/supabase';
import { useAuth } from '@consulting19/shared';
import { useI18n } from '../../hooks/useI18n';
import ClientLayout from '../../components/layouts/ClientLayout';
import { Helmet } from 'react-helmet-async';

interface ClientStats {
  activeProjects: number;
  pendingTasks: number;
  totalDocuments: number;
  completedMilestones: number;
  nextDeadline: string | null;
  consultantResponseTime: string;
}

interface Project {
  id: string;
  title: string;
  description_i18n: any;
  status: string;
  priority: string;
  progress: number;
  consultant: {
    full_name: string;
  };
  updated_at: string;
}

interface DocumentRequest {
  id: string;
  title: string;
  description: string;
  due_date: string;
  priority: string;
  status: string;
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
  const { t, formatRelativeTime, getLocalizedContent } = useI18n();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<ClientStats>({
    activeProjects: 0,
    pendingTasks: 0,
    totalDocuments: 0,
    completedMilestones: 0,
    nextDeadline: null,
    consultantResponseTime: '0h',
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [documentRequests, setDocumentRequests] = useState<DocumentRequest[]>([]);
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
        // Create client record if it doesn't exist
        const { data: newClient } = await supabase
          .from('clients')
          .insert({
            profile_id: user.id,
            status: 'active',
            priority: 'medium'
          })
          .select('id')
          .single();
        
        if (!newClient) {
          setLoading(false);
          return;
        }
        clientData.id = newClient.id;
      }

      // Fetch comprehensive stats
      const [
        projectsResult,
        documentsResult,
        requestsResult
      ] = await Promise.all([
        supabase
          .from('projects')
          .select(`
            *,
            consultant:user_profiles!projects_consultant_id_fkey(full_name)
          `)
          .eq('client_id', clientData.id)
          .order('updated_at', { ascending: false }),
        supabase
          .from('documents')
          .select('id, status')
          .eq('client_id', clientData.id),
        supabase
          .from('document_requests')
          .select('*')
          .eq('client_id', clientData.id)
          .eq('status', 'pending')
          .order('due_date', { ascending: true })
      ]);

      // Calculate stats
      const activeProjects = projectsResult.data?.filter(p => p.status === 'active').length || 0;
      const totalDocuments = documentsResult.data?.length || 0;
      const nextDeadline = requestsResult.data?.[0]?.due_date || null;

      setStats({
        activeProjects,
        pendingTasks: 0, // Will be calculated when tasks are implemented
        totalDocuments,
        completedMilestones: projectsResult.data?.filter(p => p.status === 'completed').length || 0,
        nextDeadline,
        consultantResponseTime: '2.1h',
      });

      setProjects(projectsResult.data || []);
      setDocumentRequests(requestsResult.data || []);

      // Mock recent activity
      setRecentActivity([
        {
          id: '1',
          type: 'project_updated',
          title: 'Project progress updated to 75%',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'active'
        },
        {
          id: '2',
          type: 'document_approved',
          title: 'Passport document approved',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          status: 'approved'
        },
        {
          id: '3',
          type: 'message_received',
          title: 'New message from consultant',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          status: 'unread'
        }
      ]);

      // Log telemetry
      await supabase.rpc('log_telemetry_event', {
        event_type: 'client_dashboard_viewed',
        event_data: { client_id: clientData.id }
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
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
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

  const statCards = [
    {
      title: 'Active Projects',
      value: stats.activeProjects.toString(),
      icon: FolderOpen,
      color: 'blue',
      description: 'Currently in progress',
    },
    {
      title: 'Pending Tasks',
      value: stats.pendingTasks.toString(),
      icon: CheckSquare,
      color: 'orange',
      description: 'Awaiting completion',
    },
    {
      title: 'Total Documents',
      value: stats.totalDocuments.toString(),
      icon: FileText,
      color: 'green',
      description: 'Uploaded and approved',
    },
    {
      title: 'Completed Milestones',
      value: stats.completedMilestones.toString(),
      icon: Target,
      color: 'purple',
      description: 'Successfully finished',
    },
  ];

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
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
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
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t('dashboard.welcome')}, {user?.user_metadata?.full_name || 'Client'}!
            </h1>
            <p className="text-gray-600">Track your international business expansion progress</p>
          </div>
          <div className="flex items-center space-x-3">
            {stats.nextDeadline && (
              <div className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                Next deadline: {new Date(stats.nextDeadline).toLocaleDateString()}
              </div>
            )}
            <Button variant="outline" size="sm" onClick={fetchDashboardData}>
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Home },
              { id: 'projects', label: 'Projects', icon: FolderOpen },
              { id: 'documents', label: 'Documents', icon: FileText },
              { id: 'activity', label: 'Activity', icon: Clock },
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => (
              <Card key={index} hover>
                <Card.Body>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                    </div>
                    <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
            </Card.Header>
            <Card.Body>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link to="/client/projects">
                  <Button variant="outline" icon={FolderOpen} iconPosition="left" className="w-full justify-start">
                    View Projects
                  </Button>
                </Link>
                <Link to="/client/documents">
                  <Button variant="outline" icon={Upload} iconPosition="left" className="w-full justify-start">
                    Upload Document
                  </Button>
                </Link>
                <Link to="/client/messages">
                  <Button variant="outline" icon={MessageSquare} iconPosition="left" className="w-full justify-start">
                    Send Message
                  </Button>
                </Link>
                <Link to="/client/services">
                  <Button variant="outline" icon={Target} iconPosition="left" className="w-full justify-start">
                    Order Service
                  </Button>
                </Link>
              </div>
            </Card.Body>
          </Card>

          {/* Document Requests */}
          {documentRequests.length > 0 && (
            <Card>
              <Card.Header>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Pending Document Requests</h2>
                  <Link to="/client/documents">
                    <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
                      View All
                    </Button>
                  </Link>
                </div>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  {documentRequests.slice(0, 3).map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          request.priority === 'high' ? 'bg-red-500' :
                          request.priority === 'medium' ? 'bg-orange-500' : 'bg-green-500'
                        }`}></div>
                        <div>
                          <h3 className="font-medium text-gray-900">{request.title}</h3>
                          <p className="text-sm text-gray-600">{request.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                        {request.due_date && (
                          <p className="text-xs text-gray-500 mt-1">
                            Due {new Date(request.due_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Active Projects */}
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Active Projects</h2>
                <Link to="/client/projects">
                  <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
                    View All
                  </Button>
                </Link>
              </div>
            </Card.Header>
            <Card.Body>
              {projects.length > 0 ? (
                <div className="space-y-4">
                  {projects.slice(0, 3).map((project) => (
                    <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{project.title}</h3>
                          <p className="text-sm text-gray-600">
                            {getLocalizedContent(project.description_i18n, 'description', 'No description')}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Consultant: {project.consultant?.full_name}
                          </p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                            {project.priority}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          Updated {formatRelativeTime(project.updated_at)}
                        </span>
                        <Link to={`/client/projects/${project.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Active Projects
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Your consultant will create projects as your business expansion progresses
                  </p>
                  <Link to="/client/services">
                    <Button icon={Target}>
                      Browse Services
                    </Button>
                  </Link>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          {projects.map((project) => (
            <Card key={project.id} hover>
              <Card.Body>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                        {project.priority}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">
                      {getLocalizedContent(project.description_i18n, 'description', 'No description available')}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        <span>{project.consultant?.full_name}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>Updated {formatRelativeTime(project.updated_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" icon={MessageSquare}>
                    Message Consultant
                  </Button>
                  <Button variant="outline" size="sm" icon={FileText}>
                    View Documents
                  </Button>
                  <Link to={`/client/projects/${project.id}`}>
                    <Button variant="primary" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </Card.Body>
            </Card>
          ))}

          {projects.length === 0 && (
            <Card>
              <Card.Body className="text-center py-12">
                <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Projects Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Your consultant will create projects as your business expansion begins
                </p>
                <Link to="/client/services">
                  <Button icon={Target}>
                    Browse Available Services
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          )}
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          {documentRequests.length > 0 ? (
            documentRequests.map((request) => (
              <Card key={request.id}>
                <Card.Body>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                          {request.priority}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{request.description}</p>
                      
                      {request.due_date && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>Due: {new Date(request.due_date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Link to="/client/documents">
                        <Button variant="primary" size="sm" icon={Upload}>
                          Upload Document
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))
          ) : (
            <Card>
              <Card.Body className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Document Requests
                </h3>
                <p className="text-gray-600">
                  Your consultant will request documents as needed for your projects
                </p>
              </Card.Body>
            </Card>
          )}
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          </Card.Header>
          <Card.Body>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      {activity.type === 'project_updated' && <FolderOpen className="w-5 h-5 text-blue-600" />}
                      {activity.type === 'document_approved' && <CheckCircle className="w-5 h-5 text-green-600" />}
                      {activity.type === 'message_received' && <MessageSquare className="w-5 h-5 text-purple-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">{formatRelativeTime(activity.timestamp)}</p>
                    </div>
                    {activity.status && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Recent Activity
                </h3>
                <p className="text-gray-600">
                  Activity will appear here as your projects progress
                </p>
              </div>
            )}
          </Card.Body>
        </Card>
      )}
    </ClientLayout>
  );
};

export default ClientDashboard;
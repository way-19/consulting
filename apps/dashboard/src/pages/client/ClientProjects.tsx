import React, { useState, useEffect } from 'react';
import { FolderOpen, User, Calendar, Clock, TrendingUp, CheckSquare } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { supabase } from '@consulting19/supabase';
import { useAuth } from '@consulting19/shared';
import { useI18n } from '../../hooks/useI18n';
import ClientLayout from '../../components/layouts/ClientLayout';
import { Helmet } from 'react-helmet-async';

interface Project {
  id: string;
  name: string;
  description_i18n: any;
  status: string;
  priority: string;
  progress: number;
  budget: number;
  currency: string;
  start_date: string;
  end_date: string;
  created_at: string;
  consultant: {
    full_name: string;
    email: string;
  };
  task_stats: {
    total_tasks: number;
    completed_tasks: number;
    total_hours: number;
  };
}

const ClientProjects = () => {
  const { user } = useAuth();
  const { t, formatCurrency, formatDate, getLocalizedContent } = useI18n();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Get client record first
      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', user.id)
        .single();

      if (!clientData) {
        setLoading(false);
        return;
      }

      // Fetch projects with aggregated task stats (avoiding N+1)
      const { data, error } = await supabase
        .rpc('get_client_projects_with_stats', {
          client_id_param: clientData.id
        });

      if (error) {
        console.error('Error fetching projects:', error);
        // Fallback to basic query without stats
        const { data: basicData } = await supabase
          .from('projects')
          .select(`
            *,
            consultant:user_profiles!projects_consultant_id_fkey(full_name, email)
          `)
          .eq('client_id', clientData.id)
          .order('created_at', { ascending: false });

        setProjects(basicData?.map(p => ({
          ...p,
          task_stats: { total_tasks: 0, completed_tasks: 0, total_hours: 0 }
        })) || []);
      } else {
        setProjects(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    if (statusFilter === 'all') return true;
    return project.status === statusFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'planning': return 'bg-purple-100 text-purple-800';
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
          <title>{t('projects.title')} - Consulting19</title>
        </Helmet>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <Helmet>
        <title>{t('projects.title')} - Consulting19</title>
      </Helmet>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('projects.title')}</h1>
            <p className="text-gray-600">{t('projects.subtitle')}</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <Card.Body>
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">
                {t('common.filter')}:
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="planning">{t('projects.status.planning')}</option>
                <option value="active">{t('projects.status.active')}</option>
                <option value="on_hold">{t('projects.status.on_hold')}</option>
                <option value="completed">{t('projects.status.completed')}</option>
                <option value="cancelled">{t('projects.status.cancelled')}</option>
              </select>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Projects List */}
      {filteredProjects.length > 0 ? (
        <div className="space-y-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} hover>
              <Card.Body>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {t(`projects.status.${project.status}`)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                        {t(`projects.priority.${project.priority}`)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">
                      {getLocalizedContent(project.description_i18n, 'description', 'No description available')}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="w-4 h-4 mr-2" />
                        <span>{project.consultant?.full_name}</span>
                      </div>
                      {project.budget && (
                        <div className="flex items-center text-sm text-gray-500">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          <span>{formatCurrency(project.budget, project.currency)}</span>
                        </div>
                      )}
                      <div className="flex items-center text-sm text-gray-500">
                        <CheckSquare className="w-4 h-4 mr-2" />
                        <span>{project.task_stats?.completed_tasks || 0}/{project.task_stats?.total_tasks || 0} {t('tasks.title')}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{project.task_stats?.total_hours || 0}h {t('projects.timeSpent')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
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

                {/* Timeline */}
                {(project.start_date || project.end_date) && (
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {project.start_date && formatDate(project.start_date)}
                      {project.start_date && project.end_date && ' - '}
                      {project.end_date && formatDate(project.end_date)}
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" icon={MessageCircle}>
                    {t('messages.sendMessage')}
                  </Button>
                  <Button variant="outline" size="sm" icon={FileText}>
                    {t('documents.title')}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <Card.Body className="text-center py-12">
            <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('projects.emptyState.title')}
            </h3>
            <p className="text-gray-600">
              {t('projects.emptyState.description')}
            </p>
          </Card.Body>
        </Card>
      )}
    </ClientLayout>
  );
};

export default ClientProjects;
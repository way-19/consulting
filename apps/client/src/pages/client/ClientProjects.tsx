import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useAuth } from '@consulting19/shared';
import { 
  FolderOpen, 
  Search,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  Calendar,
  Users,
  DollarSign,
  FileText,
  RefreshCw,
  BarChart3,
  Target,
  Star
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface Project {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  progress: number;
  estimated_budget?: number;
  actual_budget?: number;
  currency: string;
  start_date?: string;
  end_date?: string;
  estimated_completion?: string;
  consultant_id?: string;
  created_at: string;
  updated_at: string;
  consultant?: {
    profile: {
      full_name: string;
    };
  };
  tasks_count?: number;
  completed_tasks_count?: number;
}

interface ProjectStats {
  total: number;
  active: number;
  completed: number;
  onHold: number;
  totalBudget: number;
  avgProgress: number;
}

const ClientProjects = () => {
  const { user, profile } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectStats, setProjectStats] = useState<ProjectStats>({
    total: 0,
    active: 0,
    completed: 0,
    onHold: 0,
    totalBudget: 0,
    avgProgress: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && profile) {
      fetchProjects();
    }
  }, [user, profile]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError('');
      
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id, assigned_consultant_id')
        .eq('profile_id', user?.id)
        .maybeSingle();

      if (clientError || !clientData) {
        setError('Client data not found');
        return;
      }

      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          *,
          consultant:user_profiles!projects_consultant_id_fkey(full_name),
          tasks_count:tasks(count),
          completed_tasks_count:tasks!left(count).eq(status, 'completed')
        `)
        .eq('client_id', clientData.id)
        .order('created_at', { ascending: false });

      if (projectsError) {
        console.error('Error fetching projects:', projectsError);
        setError('Failed to fetch projects');
        return;
      }

      setProjects(projectsData || []);
      calculateStats(projectsData || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (projects: Project[]) => {
    const stats = {
      total: projects.length,
      active: projects.filter(p => p.status === 'active' || p.status === 'in_progress').length,
      completed: projects.filter(p => p.status === 'completed').length,
      onHold: projects.filter(p => p.status === 'on_hold' || p.status === 'paused').length,
      totalBudget: projects.reduce((sum, p) => sum + (p.estimated_budget || 0), 0),
      avgProgress: projects.length > 0 ? projects.reduce((sum, p) => sum + p.progress, 0) / projects.length : 0
    };
    
    setProjectStats(stats);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': 
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'on_hold':
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'planning': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'active':
      case 'in_progress': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'on_hold':
      case 'paused': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'cancelled': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <FolderOpen className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.consultant?.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Projects - Client Portal</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              {[...Array(4)].map((_, i) => (
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
        <title>Projects - Client Portal</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600 mt-1">Manage and track your projects</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={fetchProjects}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        {/* Project Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-3xl font-bold text-gray-900">{projectStats.total}</p>
                <p className="text-xs text-gray-500">{projectStats.active} active</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-green-600">{projectStats.completed}</p>
                <p className="text-xs text-gray-500">Successfully finished</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Budget</p>
                <p className="text-3xl font-bold text-purple-600">${projectStats.totalBudget.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Estimated budget</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('projects.stats.avgProgress')}</p>
                <p className="text-3xl font-bold text-orange-600">{Math.round(projectStats.avgProgress)}%</p>
                <p className="text-xs text-gray-500">Average completion</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('projects.searchProjects')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">{t('common.allStatus')}</option>
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="in_progress">In Progress</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>

        {/* Projects List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">{t('projects.myProjects')}</h2>
            <p className="text-sm text-gray-600">{t('projects.projectsSubtitle')}</p>
          </div>
          
          <div className="p-6">
            {filteredProjects.length > 0 ? (
              <div className="space-y-4">
                {filteredProjects.map((project) => (
                  <div key={project.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        {getStatusIcon(project.status)}
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                              {project.priority} priority
                            </span>
                          </div>
                          {project.description && (
                            <p className="text-gray-600 mb-3">{project.description}</p>
                          )}
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            {project.consultant?.profile?.full_name && (
                              <span className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                {project.consultant.profile.full_name}
                              </span>
                            )}
                            {project.estimated_budget && (
                              <span className="flex items-center">
                                <DollarSign className="w-4 h-4 mr-1" />
                                ${project.estimated_budget.toLocaleString()} {project.currency}
                              </span>
                            )}
                            {project.start_date && (
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                Started {new Date(project.start_date).toLocaleDateString()}
                              </span>
                            )}
                            {(project.tasks_count || 0) > 0 && (
                              <span className="flex items-center">
                                <FileText className="w-4 h-4 mr-1" />
                                {project.completed_tasks_count || 0}/{project.tasks_count || 0} tasks
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                          {project.status.replace('_', ' ')}
                        </span>
                        <div className="mt-2 text-right">
                          <div className="text-sm text-gray-500">Progress</div>
                          <div className="text-lg font-bold text-gray-900">{project.progress}%</div>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>Project Progress</span>
                        <span>{project.progress}% Complete</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-3">
                      <Link
                        to={`/projects/${project.id}`}
                        className="inline-flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Link>
                      <button className="inline-flex items-center px-3 py-2 text-sm border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                        <BarChart3 className="w-4 h-4 mr-1" />
                        View Progress
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('projects.noProjects')}</h3>
                <p className="text-gray-600 mb-6">{t('projects.noProjectsDescription')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientProjects;
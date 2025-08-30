import React, { useState, useEffect } from 'react';
import { CheckSquare, Clock, Calendar, User, AlertCircle } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { supabase } from '@consulting19/supabase';
import { useAuth } from '@consulting19/shared';
import { useI18n } from '../../hooks/useI18n';
import ClientLayout from '../../components/layouts/ClientLayout';
import { Helmet } from 'react-helmet-async';

interface Task {
  id: string;
  title_i18n: any;
  description_i18n: any;
  status: string;
  priority: string;
  due_date: string | null;
  estimated_hours: number;
  actual_hours: number;
  billable: boolean;
  created_at: string;
  project: {
    name: string;
  } | null;
  consultant: {
    full_name: string;
  };
}

const ClientTasks = () => {
  const { user } = useAuth();
  const { t, formatDate, formatRelativeTime, getLocalizedContent } = useI18n();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
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

      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          project:projects(name),
          consultant:user_profiles!tasks_consultant_id_fkey(full_name)
        `)
        .eq('client_id', clientData.id)
        .eq('is_client_visible', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
      } else {
        setTasks(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckSquare className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'review': return <AlertCircle className="w-4 h-4" />;
      default: return <CheckSquare className="w-4 h-4" />;
    }
  };

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && !['completed', 'cancelled'].includes(tasks.find(t => t.due_date === dueDate)?.status || '');
  };

  if (loading) {
    return (
      <ClientLayout>
        <Helmet>
          <title>{t('tasks.title')} - Consulting19</title>
        </Helmet>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <Helmet>
        <title>{t('tasks.title')} - Consulting19</title>
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('tasks.title')}</h1>
        <p className="text-gray-600">{t('tasks.subtitle')}</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <Card.Body>
          <div className="flex flex-col md:flex-row gap-4">
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
                <option value="todo">{t('tasks.status.todo')}</option>
                <option value="in_progress">{t('tasks.status.in_progress')}</option>
                <option value="review">{t('tasks.status.review')}</option>
                <option value="completed">{t('tasks.status.completed')}</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Priorities</option>
                <option value="high">{t('tasks.priority.high')}</option>
                <option value="medium">{t('tasks.priority.medium')}</option>
                <option value="low">{t('tasks.priority.low')}</option>
              </select>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Tasks List */}
      {filteredTasks.length > 0 ? (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <Card key={task.id}>
              <Card.Body>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(task.status)}
                      <h3 className="text-lg font-semibold text-gray-900">
                        {getLocalizedContent(task.title_i18n, 'title', 'Task')}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {t(`tasks.status.${task.status}`)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {t(`tasks.priority.${task.priority}`)}
                      </span>
                      {task.due_date && isOverdue(task.due_date) && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Overdue
                        </span>
                      )}
                    </div>
                    
                    {task.description_i18n && (
                      <p className="text-gray-600 mb-3">
                        {getLocalizedContent(task.description_i18n, 'description', '')}
                      </p>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-500">
                      {task.project && (
                        <div className="flex items-center">
                          <FolderOpen className="w-4 h-4 mr-1" />
                          <span>{task.project.name}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        <span>{task.consultant?.full_name}</span>
                      </div>
                      {task.due_date && (
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{formatDate(task.due_date)}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{task.actual_hours.toFixed(1)}h / {task.estimated_hours || 0}h</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <Card.Body className="text-center py-12">
            <CheckSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('tasks.emptyState.title')}
            </h3>
            <p className="text-gray-600">
              {t('tasks.emptyState.description')}
            </p>
          </Card.Body>
        </Card>
      )}
    </ClientLayout>
  );
};

export default ClientTasks;
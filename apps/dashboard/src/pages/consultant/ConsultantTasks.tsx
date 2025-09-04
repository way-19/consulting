import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  Play, 
  Pause, 
  Square, 
  CheckCircle, 
  Calendar, 
  User,
  Target,
  Timer,
  MoreVertical,
  Edit,
  Trash2
} from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { supabase } from '@consulting19/supabase';
import { useAuth } from '@consulting19/shared';
import { useI18n } from '../../hooks/useI18n';
import ConsultantLayout from '../../components/layouts/ConsultantLayout';
import { Helmet } from 'react-helmet-async';

interface Task {
  id: string;
  title: string;
  description: string;
  title_i18n: any;
  description_i18n: any;
  status: string;
  priority: string;
  due_date: string;
  estimated_hours: number;
  actual_hours: number;
  billable: boolean;
  is_client_visible: boolean;
  client: {
    company_name: string;
    profile: {
      full_name: string;
    };
  } | null;
  project: {
    title: string;
  } | null;
  created_at: string;
  updated_at: string;
}

interface TimeEntry {
  id: string;
  minutes: number;
  description: string;
  date: string;
  billable: boolean;
}

interface TaskForm {
  title: string;
  description: string;
  client_id: string;
  project_id: string;
  priority: string;
  due_date: string;
  estimated_hours: number;
  billable: boolean;
  is_client_visible: boolean;
}

const ConsultantTasks = () => {
  const { user } = useAuth();
  const { t } = useI18n();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const [timerStart, setTimerStart] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [taskForm, setTaskForm] = useState<TaskForm>({
    title: '',
    description: '',
    client_id: '',
    project_id: '',
    priority: 'medium',
    due_date: '',
    estimated_hours: 0,
    billable: true,
    is_client_visible: true,
  });

  useEffect(() => {
    if (user) {
      fetchTasks();
      fetchClients();
      fetchProjects();
    }
  }, [user]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeTimer && timerStart) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - timerStart.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTimer, timerStart]);

  const fetchTasks = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          client:clients(
            company_name,
            profile:user_profiles(full_name)
          ),
          project:projects(title)
        `)
        .eq('consultant_id', user.id)
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

  const fetchClients = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('clients')
        .select(`
          id,
          company_name,
          profile:user_profiles(full_name)
        `)
        .eq('assigned_consultant_id', user.id)
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching clients:', error);
      } else {
        setClients(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const fetchProjects = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id, title, client_id')
        .eq('consultant_id', user.id)
        .in('status', ['active', 'review']);

      if (error) {
        console.error('Error fetching projects:', error);
      } else {
        setProjects(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const createTask = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .insert({
          consultant_id: user.id,
          client_id: taskForm.client_id || null,
          project_id: taskForm.project_id || null,
          title: taskForm.title,
          description: taskForm.description,
          title_i18n: { en: taskForm.title },
          description_i18n: { en: taskForm.description },
          priority: taskForm.priority,
          due_date: taskForm.due_date || null,
          estimated_hours: taskForm.estimated_hours,
          billable: taskForm.billable,
          is_client_visible: taskForm.is_client_visible,
        });

      if (error) {
        console.error('Error creating task:', error);
      } else {
        fetchTasks();
        setShowTaskForm(false);
        resetTaskForm();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const updateTaskStatus = async (taskId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status })
        .eq('id', taskId);

      if (error) {
        console.error('Error updating task:', error);
      } else {
        fetchTasks();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const startTimer = (taskId: string) => {
    setActiveTimer(taskId);
    setTimerStart(new Date());
    setElapsedTime(0);
  };

  const stopTimer = async (taskId: string) => {
    if (!timerStart || !user) return;

    const minutes = Math.floor((Date.now() - timerStart.getTime()) / 60000);
    
    try {
      // Add time entry
      await supabase
        .from('time_entries')
        .insert({
          task_id: taskId,
          consultant_id: user.id,
          minutes,
          description: `Time tracking session`,
          billable: true,
        });

      // Update task actual hours
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        await supabase
          .from('tasks')
          .update({
            actual_hours: task.actual_hours + (minutes / 60),
          })
          .eq('id', taskId);
      }

      setActiveTimer(null);
      setTimerStart(null);
      setElapsedTime(0);
      fetchTasks();
    } catch (error) {
      console.error('Error saving time entry:', error);
    }
  };

  const resetTaskForm = () => {
    setTaskForm({
      title: '',
      description: '',
      client_id: '',
      project_id: '',
      priority: 'medium',
      due_date: '',
      estimated_hours: 0,
      billable: true,
      is_client_visible: true,
    });
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.client?.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
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
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const tasksByStatus = {
    todo: filteredTasks.filter(t => t.status === 'todo'),
    in_progress: filteredTasks.filter(t => t.status === 'in_progress'),
    review: filteredTasks.filter(t => t.status === 'review'),
    completed: filteredTasks.filter(t => t.status === 'completed'),
  };

  if (loading) {
    return (
      <ConsultantLayout>
        <Helmet>
          <title>{t('tasks.title')} - Consulting19</title>
        </Helmet>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-16 bg-gray-200 rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </ConsultantLayout>
    );
  }

  return (
    <ConsultantLayout>
      <Helmet>
        <title>{t('tasks.title')} - Consulting19</title>
      </Helmet>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('tasks.title')}</h1>
            <p className="text-gray-600">{t('tasks.subtitle')}</p>
          </div>
          <Button onClick={() => setShowTaskForm(true)} icon={Plus}>
            {t('tasks.addTask')}
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <Card.Body>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={t('tasks.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="todo">{t('tasks.status.todo')}</option>
                  <option value="in_progress">{t('tasks.status.inProgress')}</option>
                  <option value="review">{t('tasks.status.review')}</option>
                  <option value="completed">{t('tasks.status.completed')}</option>
                </select>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Priorities</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">{t('tasks.priority.high')}</option>
                  <option value="medium">{t('tasks.priority.medium')}</option>
                  <option value="low">{t('tasks.priority.low')}</option>
                </select>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
          <div key={status} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 capitalize">
                {t(`tasks.status.${status}`)} ({statusTasks.length})
              </h2>
              <div className="text-2xl">
                {status === 'todo' && '📋'}
                {status === 'in_progress' && '🔄'}
                {status === 'review' && '👀'}
                {status === 'completed' && '✅'}
              </div>
            </div>
            
            <div className="space-y-3 min-h-[400px]">
              {statusTasks.map((task) => (
                <Card key={task.id} hover>
                  <Card.Body>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {task.title}
                      </h3>
                      <div className="flex items-center space-x-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {task.description}
                    </p>
                    
                    <div className="space-y-2 text-xs text-gray-500 mb-3">
                      {task.client && (
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          <span>{task.client.profile?.full_name}</span>
                        </div>
                      )}
                      
                      {task.project && (
                        <div className="flex items-center">
                          <Target className="w-3 h-3 mr-1" />
                          <span>{task.project.title}</span>
                        </div>
                      )}
                      
                      {task.due_date && (
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{task.estimated_hours}h est. / {task.actual_hours}h actual</span>
                      </div>
                    </div>

                    {/* Timer Controls */}
                    {task.status === 'in_progress' && (
                      <div className="mb-3">
                        {activeTimer === task.id ? (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-blue-900">
                                {formatTime(elapsedTime)}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                icon={Square}
                                onClick={() => stopTimer(task.id)}
                                className="text-red-600 border-red-600 hover:bg-red-50"
                              >
                                Stop
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            icon={Play}
                            onClick={() => startTimer(task.id)}
                            className="w-full"
                          >
                            Start Timer
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Status Actions */}
                    <div className="flex space-x-2">
                      {task.status === 'todo' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateTaskStatus(task.id, 'in_progress')}
                          className="flex-1"
                        >
                          Start
                        </Button>
                      )}
                      {task.status === 'in_progress' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateTaskStatus(task.id, 'review')}
                          className="flex-1"
                        >
                          Review
                        </Button>
                      )}
                      {task.status === 'review' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateTaskStatus(task.id, 'completed')}
                          className="flex-1"
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              ))}
              
              {statusTasks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📝</div>
                  <p className="text-sm">No {status.replace('_', ' ')} tasks</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Task Form Modal */}
      {showTaskForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('tasks.form.title')}
                  </label>
                  <input
                    type="text"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter task title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('tasks.form.description')}
                  </label>
                  <textarea
                    value={taskForm.description}
                    onChange={(e) => setTaskForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter task description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('tasks.form.client')}
                    </label>
                    <select
                      value={taskForm.client_id}
                      onChange={(e) => setTaskForm(prev => ({ ...prev, client_id: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select client</option>
                      {clients.map(client => (
                        <option key={client.id} value={client.id}>
                          {client.profile?.full_name} ({client.company_name})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project
                    </label>
                    <select
                      value={taskForm.project_id}
                      onChange={(e) => setTaskForm(prev => ({ ...prev, project_id: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select project</option>
                      {projects
                        .filter(p => !taskForm.client_id || p.client_id === taskForm.client_id)
                        .map(project => (
                        <option key={project.id} value={project.id}>
                          {project.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('tasks.form.priority')}
                    </label>
                    <select
                      value={taskForm.priority}
                      onChange={(e) => setTaskForm(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">{t('tasks.priority.low')}</option>
                      <option value="medium">{t('tasks.priority.medium')}</option>
                      <option value="high">{t('tasks.priority.high')}</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('tasks.form.dueDate')}
                    </label>
                    <input
                      type="date"
                      value={taskForm.due_date}
                      onChange={(e) => setTaskForm(prev => ({ ...prev, due_date: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('tasks.form.estimatedHours')}
                    </label>
                    <input
                      type="number"
                      value={taskForm.estimated_hours}
                      onChange={(e) => setTaskForm(prev => ({ ...prev, estimated_hours: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      step="0.5"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={taskForm.billable}
                      onChange={(e) => setTaskForm(prev => ({ ...prev, billable: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{t('tasks.form.billable')}</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={taskForm.is_client_visible}
                      onChange={(e) => setTaskForm(prev => ({ ...prev, is_client_visible: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{t('tasks.form.clientVisible')}</span>
                  </label>
                </div>
              </div>
            </Card.Body>
            <Card.Footer>
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setShowTaskForm(false);
                    setEditingTask(null);
                    resetTaskForm();
                  }}
                >
                  {t('common.cancel')}
                </Button>
                <Button 
                  className="flex-1"
                  onClick={createTask}
                  disabled={!taskForm.title.trim()}
                >
                  {editingTask ? t('common.save') : 'Create Task'}
                </Button>
              </div>
            </Card.Footer>
          </Card>
        </div>
      )}

      {/* Summary Stats */}
      <Card className="mt-8">
        <Card.Header>
          <h2 className="text-xl font-semibold text-gray-900">Task Summary</h2>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{tasks.length}</div>
              <div className="text-sm text-gray-600">Total Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{tasksByStatus.in_progress.length}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{tasksByStatus.completed.length}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {tasks.reduce((sum, task) => sum + (task.estimated_hours || 0), 0)}h
              </div>
              <div className="text-sm text-gray-600">Estimated Hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {tasks.reduce((sum, task) => sum + (task.actual_hours || 0), 0)}h
              </div>
              <div className="text-sm text-gray-600">Actual Hours</div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </ConsultantLayout>
  );
};

export default ConsultantTasks;
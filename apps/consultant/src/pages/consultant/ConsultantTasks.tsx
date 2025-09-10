import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
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
  Building,
  Target,
  AlertTriangle,
  Edit,
  Trash2,
  Eye,
  Save,
  X,
  Timer,
  BarChart3,
  TrendingUp,
  Award,
  DollarSign
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  estimated_hours: number;
  actual_hours: number;
  billable: boolean;
  is_client_visible: boolean;
  created_at: string;
  updated_at: string;
  client: {
    id: string;
    profile: {
      full_name: string;
    };
    company_name?: string;
  };
  project?: {
    id: string;
    title: string;
  };
}

interface Client {
  id: string;
  profile: {
    full_name: string;
  };
  company_name?: string;
}

interface Project {
  id: string;
  title: string;
  client_id: string;
}

interface TaskStats {
  total: number;
  todo: number;
  in_progress: number;
  review: number;
  completed: number;
  cancelled: number;
  total_estimated_hours: number;
  total_actual_hours: number;
  billable_hours: number;
  completion_rate: number;
}

const ConsultantTasks = () => {
  const { user, profile } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [taskStats, setTaskStats] = useState<TaskStats>({
    total: 0,
    todo: 0,
    in_progress: 0,
    review: 0,
    completed: 0,
    cancelled: 0,
    total_estimated_hours: 0,
    total_actual_hours: 0,
    billable_hours: 0,
    completion_rate: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('all');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [updatingTask, setUpdatingTask] = useState<string | null>(null);
  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    client_id: '',
    project_id: '',
    priority: 'medium' as const,
    due_date: '',
    estimated_hours: 1,
    billable: true,
    is_client_visible: true
  });

  useEffect(() => {
    if (user && profile) {
      fetchInitialData();
    }
  }, [user, profile]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchTasks(),
        fetchClients(),
        fetchProjects()
      ]);
    } catch (err) {
      console.error('Error fetching initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select(`
          *,
          client:clients!tasks_client_id_fkey(
            id,
            company_name,
            profile:user_profiles!clients_profile_id_fkey(full_name)
          ),
          project:projects(id, title)
        `)
        .eq('consultant_id', user?.id)
        .order('created_at', { ascending: false });

      if (tasksError) {
        console.error('Error fetching tasks:', tasksError);
        return;
      }

      const tasks = tasksData || [];
      setTasks(tasks);
      calculateTaskStats(tasks);
    } catch (err) {
      console.error('Unexpected error fetching tasks:', err);
    }
  };

  const fetchClients = async () => {
    try {
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select(`
          id,
          company_name,
          profile:user_profiles!clients_profile_id_fkey(full_name)
        `)
        .eq('assigned_consultant_id', user?.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (clientsError) {
        console.error('Error fetching clients:', clientsError);
        return;
      }

      setClients(clientsData || []);
    } catch (err) {
      console.error('Unexpected error fetching clients:', err);
    }
  };

  const fetchProjects = async () => {
    try {
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('id, title, client_id')
        .eq('consultant_id', user?.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (projectsError) {
        console.error('Error fetching projects:', projectsError);
        return;
      }

      setProjects(projectsData || []);
    } catch (err) {
      console.error('Unexpected error fetching projects:', err);
    }
  };

  const calculateTaskStats = (tasks: Task[]) => {
    const stats: TaskStats = {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'todo').length,
      in_progress: tasks.filter(t => t.status === 'in_progress').length,
      review: tasks.filter(t => t.status === 'review').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      cancelled: tasks.filter(t => t.status === 'cancelled').length,
      total_estimated_hours: tasks.reduce((sum, t) => sum + t.estimated_hours, 0),
      total_actual_hours: tasks.reduce((sum, t) => sum + t.actual_hours, 0),
      billable_hours: tasks.filter(t => t.billable).reduce((sum, t) => sum + t.actual_hours, 0),
      completion_rate: tasks.length > 0 ? (tasks.filter(t => t.status === 'completed').length / tasks.length) * 100 : 0
    };
    setTaskStats(stats);
  };

  const handleCreateTask = async () => {
    if (!newTask.title.trim() || !newTask.client_id) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const { error } = await supabase
        .from('tasks')
        .insert({
          client_id: newTask.client_id,
          consultant_id: user?.id,
          project_id: newTask.project_id || null,
          title: newTask.title,
          description: newTask.description,
          priority: newTask.priority,
          due_date: newTask.due_date || null,
          estimated_hours: newTask.estimated_hours,
          actual_hours: 0,
          billable: newTask.billable,
          is_client_visible: newTask.is_client_visible,
          status: 'todo'
        });

      if (error) {
        throw error;
      }

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'task_created',
          description: `Created task: ${newTask.title}`,
          payload: {
            task_title: newTask.title,
            client_id: newTask.client_id,
            project_id: newTask.project_id,
            priority: newTask.priority
          }
        });

      // Notify client if task is visible to them
      if (newTask.is_client_visible) {
        const client = clients.find(c => c.id === newTask.client_id);
        if (client) {
          await supabase.functions.invoke('notify', {
            body: {
              recipient_id: client.profile.full_name, // Should be profile_id in real implementation
              type: 'task_assigned',
              payload: {
                task_title: newTask.title,
                consultant_name: profile?.full_name,
                due_date: newTask.due_date,
                priority: newTask.priority
              },
              email_notification: true
            }
          });
        }
      }

      alert('Task created successfully!');
      setShowTaskModal(false);
      setNewTask({
        title: '',
        description: '',
        client_id: '',
        project_id: '',
        priority: 'medium',
        due_date: '',
        estimated_hours: 1,
        billable: true,
        is_client_visible: true
      });
      fetchTasks();
    } catch (err) {
      console.error('Error creating task:', err);
      alert('Failed to create task. Please try again.');
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      setUpdatingTask(taskId);

      const { error } = await supabase
        .from('tasks')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) {
        throw error;
      }

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'task_updated',
          description: `Updated task status to ${newStatus}`,
          payload: { task_id: taskId, new_status: newStatus }
        });

      fetchTasks();
    } catch (err) {
      console.error('Error updating task status:', err);
      alert('Failed to update task status. Please try again.');
    } finally {
      setUpdatingTask(null);
    }
  };

  const handleUpdateActualHours = async (taskId: string, hours: number) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          actual_hours: hours,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) {
        throw error;
      }

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'task_hours_updated',
          description: `Updated task hours to ${hours}h`,
          payload: { task_id: taskId, hours: hours }
        });

      fetchTasks();
    } catch (err) {
      console.error('Error updating task hours:', err);
      alert('Failed to update task hours. Please try again.');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) {
        throw error;
      }

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'task_deleted',
          description: 'Deleted task',
          payload: { task_id: taskId }
        });

      fetchTasks();
      alert('Task deleted successfully!');
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Failed to delete task. Please try again.');
    }
  };

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'todo': return <Square className="w-5 h-5 text-gray-600" />;
      case 'in_progress': return <Play className="w-5 h-5 text-blue-600" />;
      case 'review': return <Eye className="w-5 h-5 text-yellow-600" />;
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'cancelled': return <X className="w-5 h-5 text-red-600" />;
      default: return <Square className="w-5 h-5 text-gray-600" />;
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.client?.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesClient = clientFilter === 'all' || task.client.id === clientFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesClient;
  });

  const tasksByStatus = {
    todo: filteredTasks.filter(t => t.status === 'todo'),
    in_progress: filteredTasks.filter(t => t.status === 'in_progress'),
    review: filteredTasks.filter(t => t.status === 'review'),
    completed: filteredTasks.filter(t => t.status === 'completed'),
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Tasks - Consultant Dashboard</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
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
        <title>Tasks - Consultant Dashboard</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
            <p className="text-gray-600 mt-1">Manage client tasks and track time</p>
          </div>
          <button 
            onClick={() => setShowTaskModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Task
          </button>
        </div>

        {/* Task Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900">{taskStats.total}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-blue-600">{taskStats.in_progress}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Play className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-green-600">{taskStats.completed}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Billable Hours</p>
                <p className="text-3xl font-bold text-purple-600">{taskStats.billable_hours}h</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-3xl font-bold text-orange-600">{taskStats.completion_rate.toFixed(0)}%</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <select
                value={clientFilter}
                onChange={(e) => setClientFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Clients</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.profile.full_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
            <div key={status} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 capitalize flex items-center">
                  {getStatusIcon(status)}
                  <span className="ml-2">{status.replace('_', ' ')} ({statusTasks.length})</span>
                </h2>
              </div>
              
              <div className="space-y-3 min-h-[400px] bg-gray-50 rounded-lg p-4">
                {statusTasks.map((task) => (
                  <div key={task.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{task.title}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{task.description}</p>
                        
                        <div className="space-y-1 text-xs text-gray-500">
                          <div className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            <span>{task.client.profile.full_name}</span>
                          </div>
                          {task.client.company_name && (
                            <div className="flex items-center">
                              <Building className="w-3 h-3 mr-1" />
                              <span>{task.client.company_name}</span>
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
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        {task.billable && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            Billable
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Time Tracking */}
                    <div className="mb-3 p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Time: {task.actual_hours}h / {task.estimated_hours}h</span>
                        <span>{task.estimated_hours > 0 ? ((task.actual_hours / task.estimated_hours) * 100).toFixed(0) : 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div 
                          className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                          style={{ width: `${task.estimated_hours > 0 ? Math.min((task.actual_hours / task.estimated_hours) * 100, 100) : 0}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      {/* Status Update */}
                      <select
                        value={task.status}
                        onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value)}
                        disabled={updatingTask === task.id}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="review">Review</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      {/* Hours Update */}
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={task.actual_hours}
                          onChange={(e) => handleUpdateActualHours(task.id, Number(e.target.value))}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Hours"
                        />
                        <span className="text-xs text-gray-500">h</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-1">
                        <button 
                          onClick={() => {
                            setEditingTask(task);
                            setNewTask({
                              title: task.title,
                              description: task.description,
                              client_id: task.client.id,
                              project_id: task.project?.id || '',
                              priority: task.priority,
                              due_date: task.due_date || '',
                              estimated_hours: task.estimated_hours,
                              billable: task.billable,
                              is_client_visible: task.is_client_visible
                            });
                            setShowTaskModal(true);
                          }}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                        >
                          <Edit className="w-3 h-3 mr-1 inline" />
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteTask(task.id)}
                          className="px-2 py-1 text-xs border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
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

        {/* Task Analytics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Task Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-1">{taskStats.total_estimated_hours}h</div>
              <div className="text-sm text-blue-800">Estimated Hours</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Timer className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-green-600 mb-1">{taskStats.total_actual_hours}h</div>
              <div className="text-sm text-green-800">Actual Hours</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-purple-600 mb-1">{taskStats.billable_hours}h</div>
              <div className="text-sm text-purple-800">Billable Hours</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-200">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-orange-600 mb-1">{taskStats.completion_rate.toFixed(0)}%</div>
              <div className="text-sm text-orange-800">Completion Rate</div>
            </div>
          </div>
        </div>

        {/* Task Creation/Edit Modal */}
        {showTaskModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingTask ? 'Edit Task' : 'Create New Task'}
                </h2>
                <button
                  onClick={() => {
                    setShowTaskModal(false);
                    setEditingTask(null);
                    setNewTask({
                      title: '',
                      description: '',
                      client_id: '',
                      project_id: '',
                      priority: 'medium',
                      due_date: '',
                      estimated_hours: 1,
                      billable: true,
                      is_client_visible: true
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter task title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Describe the task"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Client *
                    </label>
                    <select
                      value={newTask.client_id}
                      onChange={(e) => setNewTask(prev => ({ ...prev, client_id: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select client</option>
                      {clients.map(client => (
                        <option key={client.id} value={client.id}>
                          {client.profile.full_name} {client.company_name && `(${client.company_name})`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project (Optional)
                    </label>
                    <select
                      value={newTask.project_id}
                      onChange={(e) => setNewTask(prev => ({ ...prev, project_id: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">No project</option>
                      {projects.filter(p => p.client_id === newTask.client_id).map(project => (
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
                      Priority
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={newTask.due_date}
                      onChange={(e) => setNewTask(prev => ({ ...prev, due_date: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Hours
                    </label>
                    <input
                      type="number"
                      min="0.5"
                      step="0.5"
                      value={newTask.estimated_hours}
                      onChange={(e) => setNewTask(prev => ({ ...prev, estimated_hours: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newTask.billable}
                      onChange={(e) => setNewTask(prev => ({ ...prev, billable: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-900">Billable task</span>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newTask.is_client_visible}
                      onChange={(e) => setNewTask(prev => ({ ...prev, is_client_visible: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-900">Visible to client</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowTaskModal(false);
                    setEditingTask(null);
                    setNewTask({
                      title: '',
                      description: '',
                      client_id: '',
                      project_id: '',
                      priority: 'medium',
                      due_date: '',
                      estimated_hours: 1,
                      billable: true,
                      is_client_visible: true
                    });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingTask ? () => {
                    // Update existing task logic would go here
                    alert('Task update functionality will be implemented');
                  } : handleCreateTask}
                  disabled={!newTask.title.trim() || !newTask.client_id}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  <Save className="w-4 h-4 mr-2 inline" />
                  {editingTask ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ConsultantTasks;
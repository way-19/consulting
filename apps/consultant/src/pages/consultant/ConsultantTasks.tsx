// apps/consultant/src/pages/consultant/ConsultantTasks.tsx
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth, supabase } from '@consulting19/shared';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Clock,
  Target,
  BarChart3,
  TrendingUp,
  User,
  Building,
  Calendar,
  Edit,
  Trash2,
  Eye,
  Send,
  DollarSign,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  PlayCircle,
  Pause,
  MoreVertical,
  X
} from 'lucide-react';

interface TaskFormData {
  title: string;
  description: string;
  client_id: string;
  project_id?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date: string;
  estimated_hours: number;
  billable: boolean;
  is_client_visible: boolean;
}

interface BulkTaskData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date: string;
  estimated_hours: number;
  selected_clients: string[];
  billable: boolean;
  is_client_visible: boolean;
}

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
    company_name: string;
  };
  project?: {
    title: string;
  };
}

interface TaskStats {
  totalTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  reviewTasks: number;
  completedTasks: number;
  billableHours: number;
  totalHours: number;
  successRate: number;
}

const ConsultantTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskStats, setTaskStats] = useState<TaskStats>({
    totalTasks: 0,
    todoTasks: 0,
    inProgressTasks: 0,
    reviewTasks: 0,
    completedTasks: 0,
    billableHours: 0,
    totalHours: 0,
    successRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('all');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [availableClients, setAvailableClients] = useState<any[]>([]);
  const [availableProjects, setAvailableProjects] = useState<any[]>([]);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showBulkCreateModal, setShowBulkCreateModal] = useState(false);
  const [taskFormData, setTaskFormData] = useState<TaskFormData>({
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
  const [bulkTaskData, setBulkTaskData] = useState<BulkTaskData>({
    title: '',
    description: '',
    priority: 'medium',
    due_date: '',
    estimated_hours: 1,
    selected_clients: [],
    billable: true,
    is_client_visible: true
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTasks();
      fetchClientsAndProjects();
      markTaskNotificationsAsRead(); // Yeni görev bildirimlerini okunmuş olarak işaretle
    }
  }, [user]);

  const markTaskNotificationsAsRead = async () => {
    if (!user?.id) return;
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('recipient_profile_id', user.id)
        .eq('type', 'task_assigned')
        .is('read_at', null); // Sadece okunmamış olanları işaretle

      if (error) {
        console.error('Error marking task notifications as read:', error);
      } else {
        console.log('Task notifications marked as read.');
        // ConsultantRoutes'daki rozetin güncellenmesi için sayfayı yeniden yüklemeye gerek yok,
        // çünkü ConsultantRoutes'daki useEffect location.pathname değiştiğinde zaten sayıyı tekrar çekecek.
      }
    } catch (err) {
      console.error('Unexpected error marking task notifications as read:', err);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const { data: tasksData, error } = await supabase
        .from('tasks')
        .select(`
          *,
          client:clients!tasks_client_id_fkey(
            id,
            company_name,
            profile:user_profiles!clients_profile_id_fkey(full_name)
          ),
          project:projects(title)
        `)
        .eq('consultant_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
        return;
      }

      const fetchedTasks = tasksData || [];
      setTasks(fetchedTasks);

      // Calculate statistics
      const stats = {
        totalTasks: fetchedTasks.length,
        todoTasks: fetchedTasks.filter(t => t.status === 'todo').length,
        inProgressTasks: fetchedTasks.filter(t => t.status === 'in_progress').length,
        reviewTasks: fetchedTasks.filter(t => t.status === 'review').length,
        completedTasks: fetchedTasks.filter(t => t.status === 'completed').length,
        billableHours: fetchedTasks.filter(t => t.billable).reduce((sum, t) => sum + t.actual_hours, 0),
        totalHours: fetchedTasks.reduce((sum, t) => sum + t.actual_hours, 0),
        successRate: fetchedTasks.length > 0 ? (fetchedTasks.filter(t => t.status === 'completed').length / fetchedTasks.length) * 100 : 0
      };

      setTaskStats(stats);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskAction = async (taskId: string, action: string, newValue?: any) => {
    try {
      let updateData: any = { updated_at: new Date().toISOString() };

      switch (action) {
        case 'updateStatus':
          updateData.status = newValue;
          break;
        case 'updatePriority':
          updateData.priority = newValue;
          break;
        case 'updateHours':
          updateData.actual_hours = newValue;
          break;
        case 'toggleBillable':
          const task = tasks.find(t => t.id === taskId);
          updateData.billable = !task?.billable;
          break;
      }

      const { error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', taskId);

      if (error) {
        console.error('Error updating task:', error);
        return;
      }

      // Refresh tasks
      fetchTasks();
    } catch (err) {
      console.error('Task action error:', err);
    }
  };

  const fetchClientsAndProjects = async () => {
    try {
      const [{ data: clientsData }, { data: projectsData }] = await Promise.all([
        supabase
          .from('clients')
          .select(`
            id, company_name,
            profile:user_profiles!clients_profile_id_fkey(full_name)
          `)
          .eq('assigned_consultant_id', user?.id)
          .eq('status', 'active'),
        supabase
          .from('projects')
          .select('id, title, client_id')
          .eq('consultant_id', user?.id)
          .eq('status', 'active')
      ]);

      setAvailableClients(clientsData || []);
      setAvailableProjects(projectsData || []);
    } catch (err) {
      console.error('Error fetching clients and projects:', err);
    }
  };

  const handleCreateTask = () => {
    setTaskFormData({
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
    setShowCreateTaskModal(true);
  };

  const handleBulkCreate = () => {
    setBulkTaskData({
      title: '',
      description: '',
      priority: 'medium',
      due_date: '',
      estimated_hours: 1,
      selected_clients: [],
      billable: true,
      is_client_visible: true
    });
    setShowBulkCreateModal(true);
  };

  const handleCreateSingleTask = async () => {
    if (!taskFormData.title.trim() || !taskFormData.client_id) {
      alert('Task title and client are required');
      return;
    }

    try {
      setCreating(true);

      const { error } = await supabase
        .from('tasks')
        .insert({
          consultant_id: user?.id,
          client_id: taskFormData.client_id,
          project_id: taskFormData.project_id || null,
          title: taskFormData.title,
          description: taskFormData.description,
          status: 'todo',
          priority: taskFormData.priority,
          due_date: taskFormData.due_date || null,
          estimated_hours: taskFormData.estimated_hours,
          actual_hours: 0,
          billable: taskFormData.billable,
          is_client_visible: taskFormData.is_client_visible
        });

      if (error) throw error;

      alert('Task created successfully!');
      setShowCreateTaskModal(false);
      fetchTasks();
    } catch (err) {
      console.error('Error creating task:', err);
      alert('Failed to create task');
    } finally {
      setCreating(false);
    }
  };

  const handleCreateBulkTasks = async () => {
    if (!bulkTaskData.title.trim() || bulkTaskData.selected_clients.length === 0) {
      alert('Task title and client selection are required');
      return;
    }

    try {
      setCreating(true);

      const taskInserts = bulkTaskData.selected_clients.map(clientId => ({
        consultant_id: user?.id,
        client_id: clientId,
        title: bulkTaskData.title,
        description: bulkTaskData.description,
        status: 'todo',
        priority: bulkTaskData.priority,
        due_date: bulkTaskData.due_date || null,
        estimated_hours: bulkTaskData.estimated_hours,
        actual_hours: 0,
        billable: bulkTaskData.billable,
        is_client_visible: bulkTaskData.is_client_visible
      }));

      const { error } = await supabase
        .from('tasks')
        .insert(taskInserts);

      if (error) throw error;

      alert(`${bulkTaskData.selected_clients.length} tasks created successfully!`);
      setShowBulkCreateModal(false);
      fetchTasks();
    } catch (err) {
      console.error('Error creating bulk tasks:', err);
      alert('Failed to create bulk tasks');
    } finally {
      setCreating(false);
    }
  };

  const getTasksByStatus = (status: string) => {
    return filteredTasks.filter(t => t.status === status);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getBillableColor = (billable: boolean) => {
    return billable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600';
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.client.profile.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.client.company_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesClient = clientFilter === 'all' || task.client.id === clientFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesClient;
  });

  const uniqueClients = Array.from(new Set(tasks.map(t => t.client.id)))
    .map(clientId => tasks.find(t => t.client.id === clientId)?.client)
    .filter(Boolean);

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Task Management - Consultant Dashboard</title>
        </Helmet>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Task Management - Consultant Dashboard</title>
      </Helmet>

      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
            <p className="text-gray-600">Manage client tasks and track time</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCreateTask}
              className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Create Task
            </button>
            <button
              onClick={handleBulkCreate}
              className="inline-flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              <Send className="w-4 h-4 mr-1" />
              Bulk Create
            </button>
          </div>
        </div>

        {/* Stats Row - Very Compact */}
        <div className="grid grid-cols-5 gap-3">
          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 text-center">
            <div className="text-lg font-bold text-gray-900">{taskStats.totalTasks}</div>
            <div className="text-xs text-gray-600 flex items-center justify-center">
              <BarChart3 className="w-3 h-3 mr-1" />
              Total Tasks
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 text-center">
            <div className="text-lg font-bold text-blue-600">{taskStats.inProgressTasks}</div>
            <div className="text-xs text-gray-600 flex items-center justify-center">
              <PlayCircle className="w-3 h-3 mr-1" />
              In Progress
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 text-center">
            <div className="text-lg font-bold text-green-600">{taskStats.completedTasks}</div>
            <div className="text-xs text-gray-600 flex items-center justify-center">
              <CheckCircle className="w-3 h-3 mr-1" />
              Completed
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 text-center">
            <div className="text-lg font-bold text-purple-600">{taskStats.billableHours}h</div>
            <div className="text-xs text-gray-600 flex items-center justify-center">
              <DollarSign className="w-3 h-3 mr-1" />
              Billable Hours
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 text-center">
            <div className="text-lg font-bold text-orange-600">{taskStats.successRate.toFixed(0)}%</div>
            <div className="text-xs text-gray-600 flex items-center justify-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              Success Rate
            </div>
          </div>
        </div>

        {/* Filters - Ultra Compact */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
          <div className="grid grid-cols-6 gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-6 pr-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500"
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
              className="px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Clients</option>
              {uniqueClients.map((client: any) => (
                <option key={client.id} value={client.id}>
                  {client.profile.full_name}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                const visibleTaskIds = filteredTasks.map(t => t.id);
                setSelectedTasks(
                  selectedTasks.length === visibleTaskIds.length ? [] : visibleTaskIds
                );
              }}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors"
            >
              Select All
            </button>
            <button
              onClick={fetchTasks}
              className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Task Board - 4 Columns Layout */}
        <div className="grid grid-cols-4 gap-3">
          {/* Todo Column */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">📝 Todo ({getTasksByStatus('todo').length})</h3>
              <button
                onClick={handleCreateTask}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                + Add
              </button>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {getTasksByStatus('todo').map((task) => (
                <TaskCard key={task.id} task={task} onAction={handleTaskAction} />
              ))}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">▶️ In Progress ({getTasksByStatus('in_progress').length})</h3>
              <button
                onClick={handleCreateTask}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                + Add
              </button>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {getTasksByStatus('in_progress').map((task) => (
                <TaskCard key={task.id} task={task} onAction={handleTaskAction} />
              ))}
            </div>
          </div>

          {/* Review Column */}
          <div className="bg-yellow-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">👁️ Review ({getTasksByStatus('review').length})</h3>
              <button
                onClick={handleCreateTask}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                + Add
              </button>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {getTasksByStatus('review').length > 0 ? (
                getTasksByStatus('review').map((task) => (
                  <TaskCard key={task.id} task={task} onAction={handleTaskAction} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Eye className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-xs">No review tasks</div>
                </div>
              )}
            </div>
          </div>

          {/* Completed Column */}
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">✅ Completed ({getTasksByStatus('completed').length})</h3>
              <button
                onClick={handleCreateTask}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                + Add
              </button>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {getTasksByStatus('completed').map((task) => (
                <TaskCard key={task.id} task={task} onAction={handleTaskAction} />
              ))}
            </div>
          </div>
        </div>

        {/* Task Analytics - Bottom */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Analytics</h3>
          <div className="grid grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-1">{Math.round(taskStats.totalHours)}h</div>
              <div className="text-sm text-blue-800">Estimated Hours</div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-green-600 mb-1">{Math.round(taskStats.billableHours)}h</div>
              <div className="text-sm text-green-800">Actual Hours</div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-purple-600 mb-1">{Math.round(taskStats.billableHours)}h</div>
              <div className="text-sm text-purple-800">Billable Hours</div>
            </div>

            <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-200">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-orange-600 mb-1">{taskStats.successRate.toFixed(0)}%</div>
              <div className="text-sm text-orange-800">Completion Rate</div>
            </div>
          </div>
        </div>

        {/* Create Task Modal */}
        {showCreateTaskModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Create New Task</h2>
                <button
                  onClick={() => setShowCreateTaskModal(false)}
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
                    value={taskFormData.title}
                    onChange={(e) => setTaskFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter task title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={taskFormData.description}
                    onChange={(e) => setTaskFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the task"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Client *
                    </label>
                    <select
                      value={taskFormData.client_id}
                      onChange={(e) => setTaskFormData(prev => ({ ...prev, client_id: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select client</option>
                      {availableClients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.profile.full_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project (Optional)
                    </label>
                    <select
                      value={taskFormData.project_id}
                      onChange={(e) => setTaskFormData(prev => ({ ...prev, project_id: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={!taskFormData.client_id}
                    >
                      <option value="">No project</option>
                      {availableProjects
                        .filter(p => p.client_id === taskFormData.client_id)
                        .map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.title}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={taskFormData.priority}
                      onChange={(e) => setTaskFormData(prev => ({ ...prev, priority: e.target.value as any }))}
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
                      value={taskFormData.due_date}
                      onChange={(e) => setTaskFormData(prev => ({ ...prev, due_date: e.target.value }))}
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
                      value={taskFormData.estimated_hours}
                      onChange={(e) => setTaskFormData(prev => ({ ...prev, estimated_hours: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={taskFormData.billable}
                      onChange={(e) => setTaskFormData(prev => ({ ...prev, billable: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-900">Billable task</span>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={taskFormData.is_client_visible}
                      onChange={(e) => setTaskFormData(prev => ({ ...prev, is_client_visible: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-900">Visible to client</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateTaskModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateSingleTask}
                  disabled={creating || !taskFormData.title.trim() || !taskFormData.client_id}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {creating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                      Creating...
                    </>
                  ) : (
                    'Create Task'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Create Tasks Modal */}
        {showBulkCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Create Tasks for Multiple Clients</h2>
                <button
                  onClick={() => setShowBulkCreateModal(false)}
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
                    value={bulkTaskData.title}
                    onChange={(e) => setBulkTaskData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Submit Monthly Financial Documents"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={bulkTaskData.description}
                    onChange={(e) => setBulkTaskData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Detailed task description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={bulkTaskData.priority}
                      onChange={(e) => setBulkTaskData(prev => ({ ...prev, priority: e.target.value as any }))}
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
                      value={bulkTaskData.due_date}
                      onChange={(e) => setBulkTaskData(prev => ({ ...prev, due_date: e.target.value }))}
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
                      value={bulkTaskData.estimated_hours}
                      onChange={(e) => setBulkTaskData(prev => ({ ...prev, estimated_hours: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Clients * ({bulkTaskData.selected_clients.length} selected)
                  </label>
                  <div className="border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
                    <div className="p-3 border-b border-gray-200">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={bulkTaskData.selected_clients.length === availableClients.length && availableClients.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setBulkTaskData(prev => ({ ...prev, selected_clients: availableClients.map(c => c.id) }));
                            } else {
                              setBulkTaskData(prev => ({ ...prev, selected_clients: [] }));
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-900">Select All</span>
                      </label>
                    </div>
                    {availableClients.map((client) => (
                      <div key={client.id} className="p-3 border-b border-gray-200 last:border-b-0">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={bulkTaskData.selected_clients.includes(client.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setBulkTaskData(prev => ({ ...prev, selected_clients: [...prev.selected_clients, client.id] }));
                              } else {
                                setBulkTaskData(prev => ({ ...prev, selected_clients: prev.selected_clients.filter(id => id !== client.id) }));
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-900">
                            {client.profile.full_name} ({client.company_name || 'Individual'})
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={bulkTaskData.billable}
                      onChange={(e) => setBulkTaskData(prev => ({ ...prev, billable: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-900">Billable tasks</span>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={bulkTaskData.is_client_visible}
                      onChange={(e) => setBulkTaskData(prev => ({ ...prev, is_client_visible: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-900">Visible to clients</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 mt-6">
                <button
                  onClick={() => setShowBulkCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateBulkTasks}
                  disabled={creating || !bulkTaskData.title.trim() || bulkTaskData.selected_clients.length === 0}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {creating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                      Creating...
                    </>
                  ) : (
                    `Create for ${bulkTaskData.selected_clients.length} Clients`
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// Ultra Compact Task Card Component
interface TaskCardProps {
  task: Task;
  onAction: (taskId: string, action: string, value?: any) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onAction }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500 bg-red-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const progress = task.estimated_hours > 0 ? (task.actual_hours / task.estimated_hours) * 100 : 0;

  return (
    <div className={`border-l-4 ${getPriorityColor(task.priority)} bg-white rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer text-xs`}
         onClick={() => setShowDetails(!showDetails)}>

      {/* Task Header - Ultra Compact */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-1">
          <span className="text-xs font-medium text-gray-900 truncate max-w-20">{task.title}</span>
          {task.priority === 'urgent' && <span className="text-red-500">🔥</span>}
          {task.priority === 'high' && <span className="text-orange-500">⚡</span>}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            alert('Task actions menu');
          }}
          className="text-gray-400 hover:text-gray-600 p-0.5"
        >
          <MoreVertical className="w-3 h-3" />
        </button>
      </div>

      {/* Client Info - Very Compact */}
      <div className="text-xs text-gray-600 mb-2">
        <div className="flex items-center space-x-1">
          <User className="w-2 h-2" />
          <span className="truncate max-w-16">{task.client.profile.full_name}</span>
        </div>
        {task.client.company_name && (
          <div className="flex items-center space-x-1">
            <Building className="w-2 h-2" />
            <span className="truncate max-w-16">{task.client.company_name}</span>
          </div>
        )}
      </div>

      {/* Progress Bar - Mini */}
      <div className="mb-2">
        <div className="w-full bg-gray-200 rounded-full h-1">
          <div
            className="bg-blue-500 h-1 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-0.5">
          <span>Time: {task.actual_hours}h / {task.estimated_hours}h</span>
          <span>{Math.min(progress, 100).toFixed(0)}%</span>
        </div>
      </div>

      {/* Status + Billable */}
      <div className="flex items-center space-x-1 mb-2">
        <select
          value={task.status}
          onChange={(e) => {
            e.stopPropagation();
            onAction(task.id, 'updateStatus', e.target.value);
          }}
          className="text-xs bg-blue-100 text-blue-800 border border-blue-300 rounded px-1 py-0.5"
          onClick={(e) => e.stopPropagation()}
        >
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="review">Review</option>
          <option value="completed">Completed</option>
        </select>
        {task.billable && (
          <span className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded">$</span>
        )}
      </div>

      {/* Due Date */}
      {task.due_date && (
        <div className="text-xs text-gray-500 flex items-center space-x-1">
          <Calendar className="w-2 h-2" />
          <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
        </div>
      )}

      {/* Quick Actions - Show on Hover/Click */}
      {showDetails && (
        <div className="mt-2 pt-2 border-t border-gray-200 grid grid-cols-2 gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              alert(`Editing task: ${task.title}`);
            }}
            className="text-xs bg-gray-100 text-gray-700 px-1 py-0.5 rounded hover:bg-gray-200 transition-colors"
          >
            <Edit className="w-2 h-2 mr-0.5 inline" />
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              alert(`Viewing task details: ${task.title}`);
            }}
            className="text-xs bg-blue-100 text-blue-700 px-1 py-0.5 rounded hover:bg-blue-200 transition-colors"
          >
            <Eye className="w-2 h-2 mr-0.5 inline" />
            View
          </button>
        </div>
      )}
    </div>
  );
};

export default ConsultantTasks;

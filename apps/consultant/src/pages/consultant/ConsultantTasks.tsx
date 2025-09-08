import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Clock, Play, Pause, Square, CheckCircle, Calendar, User, Target, AlertTriangle, MessageSquare } from 'lucide-react';
import { useAuth } from '@consulting19/shared';
import { supabase } from '@consulting19/shared/lib/supabase';
import { Link } from 'react-router-dom';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string | null;
  estimated_hours: number;
  actual_hours: number;
  billable: boolean;
  is_client_visible: boolean;
  client: {
    id: string;
    full_name: string;
  } | null;
  project: {
    id: string;
    title: string;
  } | null;
  created_at: string;
  updated_at: string;
}

const ConsultantTasks = () => {
  const { user, profile } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const [updatingTask, setUpdatingTask] = useState<string | null>(null);

  useEffect(() => {
    if (user && profile) {
      fetchTasks();
    }
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select(`
          *,
          client:clients!tasks_client_id_fkey(id, profile:user_profiles!clients_profile_id_fkey(full_name)),
          project:projects(id, title)
        `)
        .eq('consultant_id', user?.id)
        .order('created_at', { ascending: false });

      if (tasksError) {
        console.error('Error fetching tasks:', tasksError);
        return;
      }

      // Flatten the nested client structure
      const flattenedTasks = (tasksData || []).map(task => ({
        ...task,
        client: task.client ? {
          id: task.client.id,
          full_name: task.client.profile?.full_name || 'Unknown Client'
        } : null
      }));

      setTasks(flattenedTasks);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
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
      console.error('Error updating task:', err);
      alert('Failed to update task status');
    } finally {
      setUpdatingTask(null);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
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

  const tasksByStatus = {
    todo: filteredTasks.filter(t => t.status === 'todo'),
    in_progress: filteredTasks.filter(t => t.status === 'in_progress'),
    review: filteredTasks.filter(t => t.status === 'review'),
    completed: filteredTasks.filter(t => t.status === 'completed'),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-16 bg-gray-200 rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
              <p className="text-gray-600">Manage client tasks and time tracking</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-600">
                Total Tasks: <span className="font-semibold">{tasks.length}</span>
              </div>
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Create Task
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search tasks..."
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
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="completed">Completed</option>
                </select>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Priorities</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
            <div key={status} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 capitalize">
                  {status.replace('_', ' ')} ({statusTasks.length})
                </h2>
                <div className="text-2xl">
                  {status === 'todo' && '📋'}
                  {status === 'in_progress' && '🔄'}
                  {status === 'review' && '👀'}
                  {status === 'completed' && '✅'}
                </div>
              </div>
              
              <div className="space-y-3 min-h-[400px]">
                {statusTasks.length > 0 ? (
                  statusTasks.map((task) => (
                    <div key={task.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <div className="mb-3">
                        <h3 className="font-semibold text-gray-900 mb-1">{task.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                        
                        <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
                          {task.client && (
                            <span className="flex items-center">
                              <User className="w-3 h-3 mr-1" />
                              {task.client.full_name}
                            </span>
                          )}
                          {task.project && (
                            <span className="flex items-center">
                              <Target className="w-3 h-3 mr-1" />
                              {task.project.title}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          {task.due_date && (
                            <span className="text-xs text-gray-500">
                              Due: {new Date(task.due_date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        {status !== 'completed' && (
                          <button
                            onClick={() => {
                              const nextStatus = status === 'todo' ? 'in_progress' : 
                                              status === 'in_progress' ? 'review' : 'completed';
                              updateTaskStatus(task.id, nextStatus);
                            }}
                            disabled={updatingTask === task.id}
                            className="flex-1 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:opacity-50 transition-colors"
                          >
                            {updatingTask === task.id ? '...' : 
                             status === 'todo' ? 'Start' :
                             status === 'in_progress' ? 'Review' : 'Complete'}
                          </button>
                        )}
                        <Link
                          to="/messages"
                          className="px-2 py-1 border border-gray-300 text-gray-700 rounded text-xs hover:bg-gray-50 transition-colors"
                        >
                          <MessageSquare className="w-3 h-3 inline" />
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">📝</div>
                    <p className="text-sm">No {status.replace('_', ' ')} tasks</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Task Summary</h2>
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
                {tasks.reduce((sum, t) => sum + t.estimated_hours, 0)}h
              </div>
              <div className="text-sm text-gray-600">Estimated Hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {tasks.reduce((sum, t) => sum + t.actual_hours, 0)}h
              </div>
              <div className="text-sm text-gray-600">Actual Hours</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultantTasks;
import React, { useState, useEffect } from 'react';
import { Search, Plus, Play, Pause, Square, Clock, Calendar, User } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { supabase } from '@consulting19/supabase';
import { useTranslation } from '../../hooks/useTranslation';
import ConsultantLayout from '../../components/layouts/ConsultantLayout';

interface Task {
  id: string;
  client_id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  due_date: string;
  estimated_hours: number;
  actual_hours: number;
  billable: boolean;
  is_client_visible: boolean;
  created_at: string;
  client: {
    company_name: string;
    profile: {
      full_name: string;
    };
  };
}

interface TimeEntry {
  id: string;
  task_id: string;
  minutes: number;
  description: string;
  date: string;
  billable: boolean;
}

const ConsultantTasks = () => {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const [timerStart, setTimerStart] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    fetchTasks();
  }, []);

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
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          client:clients(
            company_name,
            profile:user_profiles(full_name)
          )
        `)
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

  const startTimer = (taskId: string) => {
    setActiveTimer(taskId);
    setTimerStart(new Date());
    setElapsedTime(0);
  };

  const stopTimer = async (taskId: string) => {
    if (!timerStart) return;

    const minutes = Math.floor((Date.now() - timerStart.getTime()) / 60000);
    
    try {
      // Create time entry
      const { error } = await supabase
        .from('time_entries')
        .insert({
          task_id: taskId,
          consultant_id: (await supabase.auth.getUser()).data.user?.id,
          minutes,
          description: `Work session`,
          billable: true,
        });

      if (error) {
        console.error('Error saving time entry:', error);
      } else {
        // Update task actual hours
        const task = tasks.find(t => t.id === taskId);
        if (task) {
          const newActualHours = task.actual_hours + (minutes / 60);
          await supabase
            .from('tasks')
            .update({ actual_hours: newActualHours })
            .eq('id', taskId);
          
          fetchTasks(); // Refresh tasks
        }
      }
    } catch (error) {
      console.error('Error stopping timer:', error);
    }

    setActiveTimer(null);
    setTimerStart(null);
    setElapsedTime(0);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <ConsultantLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </ConsultantLayout>
    );
  }

  return (
    <ConsultantLayout>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('tasks.title')}</h1>
            <p className="text-gray-600">{t('tasks.subtitle')}</p>
          </div>
          <Button icon={Plus}>
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
                  <option value="high">{t('tasks.priority.high')}</option>
                  <option value="medium">{t('tasks.priority.medium')}</option>
                  <option value="low">{t('tasks.priority.low')}</option>
                </select>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Tasks List */}
      {filteredTasks.length > 0 ? (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <Card key={task.id}>
              <Card.Body>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {t(`tasks.status.${task.status}`)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {t(`tasks.priority.${task.priority}`)}
                      </span>
                    </div>
                    
                    {task.description && (
                      <p className="text-gray-600 mb-2">{task.description}</p>
                    )}
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        <span>{task.client?.profile?.full_name || 'Unknown Client'}</span>
                      </div>
                      {task.due_date && (
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{new Date(task.due_date).toLocaleDateString()}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{task.actual_hours.toFixed(1)}h / {task.estimated_hours || 0}h</span>
                      </div>
                    </div>
                  </div>

                  {/* Timer Controls */}
                  <div className="flex items-center space-x-2">
                    {activeTimer === task.id ? (
                      <>
                        <div className="text-sm font-mono text-blue-600 mr-2">
                          {formatTime(elapsedTime)}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => stopTimer(task.id)}
                          icon={Square}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          {t('tasks.timer.stop')}
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startTimer(task.id)}
                        icon={Play}
                        className="text-green-600 border-green-600 hover:bg-green-50"
                        disabled={!!activeTimer}
                      >
                        {t('tasks.timer.start')}
                      </Button>
                    )}
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <Card.Body className="text-center py-12">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No tasks found
            </h3>
            <p className="text-gray-600 mb-6">
              Start by creating your first task or adjust your filters
            </p>
            <Button icon={Plus}>
              {t('tasks.addTask')}
            </Button>
          </Card.Body>
        </Card>
      )}
    </ConsultantLayout>
  );
};

export default ConsultantTasks;
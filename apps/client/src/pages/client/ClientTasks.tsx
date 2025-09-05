import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  CheckSquare, 
  Calendar, 
  User, 
  Clock, 
  AlertTriangle,
  Upload,
  Download,
  Search,
  Filter,
  Plus,
  FileText,
  DollarSign,
  Paperclip,
  CheckCircle,
  XCircle,
  ArrowLeft
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
  billable: boolean;
  is_client_visible: boolean;
  consultant: {
    full_name: string;
  };
  project: {
    title: string;
  } | null;
  created_at: string;
}

interface TaskDocument {
  id: string;
  name: string;
  file_url: string;
  file_size: number;
  uploaded_at: string;
}

const ClientTasks = () => {
  const { user, profile } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadingTaskId, setUploadingTaskId] = useState<string | null>(null);

  useEffect(() => {
    if (user && profile) {
      fetchTasks();
    }
  }, [user, profile]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      
      // Get client ID first
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', user?.id)
        .maybeSingle();

      if (clientError) {
        console.error('❌ Client fetch error:', clientError);
        setError('Database error occurred');
        return;
      }

      if (!clientData) {
        console.log('❌ No client record found for this user');
        setError('Client record not found');
        return;
      }

      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select(`
          *,
          consultant:user_profiles!tasks_consultant_id_fkey(full_name),
          project:projects(title)
        `)
        .eq('client_id', clientData.id)
        .eq('is_client_visible', true)
        .order('due_date', { ascending: true, nullsLast: true });

      if (tasksError) {
        console.error('Error fetching tasks:', tasksError);
        setError('Unable to fetch tasks');
        return;
      }

      setTasks(tasksData || []);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (taskId: string, file: File) => {
    try {
      setUploadingTaskId(taskId);
      
      // Upload file to Supabase Storage
      const fileName = `${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(`task-documents/${fileName}`, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(uploadData.path);

      // Get client ID
      const { data: clientData } = await supabase
        .from('clients')
        .select('id, assigned_consultant_id')
        .eq('profile_id', user?.id)
        .single();

      // Save document metadata
      const { error: docError } = await supabase
        .from('documents')
        .insert({
          client_id: clientData?.id,
          consultant_id: clientData?.assigned_consultant_id,
          name: file.name,
          type: 'other',
          file_url: urlData.publicUrl,
          file_size: file.size,
          mime_type: file.type,
          uploaded_at: new Date().toISOString(),
          notes: `Uploaded for task: ${tasks.find(t => t.id === taskId)?.title}`
        });

      if (docError) {
        throw docError;
      }

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'document_upload',
          resource_type: 'task',
          resource_id: taskId,
          description: `Uploaded document: ${file.name} for task`,
          payload: { file_name: file.name, task_id: taskId }
        });

      // Notify consultant
      if (clientData?.assigned_consultant_id) {
        await supabase.functions.invoke('notify', {
          body: {
            recipient_id: clientData.assigned_consultant_id,
            type: 'document_uploaded',
            payload: {
              client_name: profile?.full_name,
              document_name: file.name,
              task_title: tasks.find(t => t.id === taskId)?.title
            }
          }
        });
      }

      alert('Document uploaded successfully!');
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload document. Please try again.');
    } finally {
      setUploadingTaskId(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in_progress': return <Clock className="w-5 h-5 text-blue-600" />;
      case 'review': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default: return <CheckSquare className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
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

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Categorize tasks
  const upcomingPayments = filteredTasks.filter(t => 
    t.title.toLowerCase().includes('payment') || 
    t.title.toLowerCase().includes('fee') ||
    t.title.toLowerCase().includes('invoice')
  );
  
  const documentRequests = filteredTasks.filter(t => 
    t.description?.toLowerCase().includes('document') || 
    t.description?.toLowerCase().includes('upload') ||
    t.title.toLowerCase().includes('submit')
  );
  
  const generalTasks = filteredTasks.filter(t => 
    !upcomingPayments.includes(t) && !documentRequests.includes(t)
  );

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Tasks - Client Portal</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
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
        <title>Tasks - Client Portal</title>
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-gray-600 mt-1">Manage your tasks, payments, and document requests</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
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

        {/* Task Categories */}
        <div className="space-y-6">
          {/* Upcoming Payments */}
          {upcomingPayments.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                Upcoming Payments ({upcomingPayments.length})
              </h2>
              <div className="space-y-3">
                {upcomingPayments.map((task) => (
                  <div key={task.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <div>
                          <h3 className="font-semibold text-gray-900">{task.title}</h3>
                          <p className="text-sm text-gray-600">{task.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {task.due_date && (
                          <span className={`text-sm ${
                            isOverdue(task.due_date) ? 'text-red-600 font-medium' : 'text-gray-600'
                          }`}>
                            Due: {new Date(task.due_date).toLocaleDateString()}
                          </span>
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Document Requests */}
          {documentRequests.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                Document Requests ({documentRequests.length})
              </h2>
              <div className="space-y-3">
                {documentRequests.map((task) => (
                  <div key={task.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <FileText className="w-5 h-5 text-blue-600 mt-1" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{task.title}</h3>
                          <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                          
                          {/* File Upload Area */}
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                            <input
                              type="file"
                              id={`file-${task.id}`}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(task.id, file);
                              }}
                              className="hidden"
                              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                            />
                            <label
                              htmlFor={`file-${task.id}`}
                              className="cursor-pointer flex flex-col items-center"
                            >
                              {uploadingTaskId === task.id ? (
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                              ) : (
                                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                              )}
                              <span className="text-sm text-gray-600">
                                {uploadingTaskId === task.id ? 'Uploading...' : 'Click to upload document'}
                              </span>
                              <span className="text-xs text-gray-500 mt-1">
                                PDF, DOC, DOCX, PNG, JPG (Max 10MB)
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {task.due_date && (
                          <span className={`text-sm ${
                            isOverdue(task.due_date) ? 'text-red-600 font-medium' : 'text-gray-600'
                          }`}>
                            Due: {new Date(task.due_date).toLocaleDateString()}
                          </span>
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status.replace('_', ' ')}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* General Tasks */}
          {generalTasks.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <CheckSquare className="w-5 h-5 mr-2 text-purple-600" />
                General Tasks ({generalTasks.length})
              </h2>
              <div className="space-y-3">
                {generalTasks.map((task) => (
                  <div key={task.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(task.status)}
                        <div>
                          <h3 className="font-semibold text-gray-900">{task.title}</h3>
                          <p className="text-sm text-gray-600">{task.description}</p>
                          {task.project && (
                            <p className="text-xs text-blue-600 mt-1">Project: {task.project.title}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {task.due_date && (
                          <span className={`text-sm ${
                            isOverdue(task.due_date) ? 'text-red-600 font-medium' : 'text-gray-600'
                          }`}>
                            Due: {new Date(task.due_date).toLocaleDateString()}
                          </span>
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status.replace('_', ' ')}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* No Tasks */}
        {filteredTasks.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <CheckSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Tasks Yet</h3>
            <p className="text-gray-600 mb-6">
              Your consultant will create tasks as your projects progress. Document requests, 
              payment reminders, and action items will appear here.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Getting Started</h4>
              <p className="text-xs text-blue-800">
                Tasks help you stay organized and ensure nothing falls through the cracks. 
                You'll be able to upload documents, track deadlines, and manage your business requirements.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ClientTasks;
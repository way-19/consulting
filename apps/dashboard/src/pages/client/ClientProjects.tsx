import React, { useState, useEffect } from 'react';
import { FolderOpen, Calendar, User, TrendingUp, MessageSquare, FileText, Target, Clock } from 'lucide-react';
import { Card, Button } from '@consulting19/shared';
import { supabase } from '@consulting19/shared';
import { useAuth } from '@consulting19/shared';
import { useI18n } from '../../hooks/useI18n';
import ClientLayout from '../../components/layouts/ClientLayout';
import { Helmet } from 'react-helmet-async';

interface Project {
  id: string;
  title: string;
  description_i18n: any;
  status: string;
  priority: string;
  progress: number;
  budget: number;
  currency: string;
  start_date: string;
  end_date: string;
  steps: any[];
  consultant: {
    full_name: string;
    email: string;
  };
  country: {
    name: string;
    flag_emoji: string;
  } | null;
  created_at: string;
  updated_at: string;
}

interface ProjectTask {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
  estimated_hours: number;
  actual_hours: number;
}

const ClientProjects = () => {
  const { user } = useAuth();
  const { t, formatCurrency, formatDate, formatRelativeTime, getLocalizedContent } = useI18n();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectTasks, setProjectTasks] = useState<ProjectTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  useEffect(() => {
    if (selectedProject) {
      fetchProjectTasks(selectedProject.id);
    }
  }, [selectedProject]);

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

      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          consultant:user_profiles!projects_consultant_id_fkey(full_name, email),
          country:countries(name, flag_emoji)
        `)
        .eq('client_id', clientData.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
      } else {
        setProjects(data || []);
        if (data && data.length > 0 && !selectedProject) {
          setSelectedProject(data[0]);
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectTasks = async (projectId: string) => {
    try {
      setTasksLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .eq('is_client_visible', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching project tasks:', error);
      } else {
        setProjectTasks(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setTasksLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'intake': return 'bg-purple-100 text-purple-800';
      case 'review': return 'bg-orange-100 text-orange-800';
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

  if (loading) {
    return (
      <ClientLayout>
        <Helmet>
          <title>Projects - Consulting19</title>
        </Helmet>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="lg:col-span-2 h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <Helmet>
        <title>Projects - Consulting19</title>
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Projects</h1>
        <p className="text-gray-600">Track your international business expansion projects</p>
      </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects List */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">All Projects</h2>
            {projects.map((project) => (
              <Card 
                key={project.id} 
                hover 
                className={`cursor-pointer transition-all duration-200 ${
                  selectedProject?.id === project.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => setSelectedProject(project)}
              >
                <Card.Body>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{project.title}</h3>
                      <p className="text-sm text-gray-600">
                        {getLocalizedContent(project.description_i18n, 'en', 'No description')}
                      </p>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
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
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      <span>{project.consultant?.full_name}</span>
                    </div>
                    <span>{formatRelativeTime(project.updated_at)}</span>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>

          {/* Project Details */}
          <div className="lg:col-span-2">
            {selectedProject ? (
              <div className="space-y-6">
                {/* Project Header */}
                <Card>
                  <Card.Body>
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h1 className="text-2xl font-bold text-gray-900">{selectedProject.title}</h1>
                          {selectedProject.country && (
                            <span className="text-2xl">{selectedProject.country.flag_emoji}</span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-4">
                          {getLocalizedContent(selectedProject.description_i18n, 'en', 'No description available')}
                        </p>
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            <span>{selectedProject.consultant?.full_name}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>Started {formatDate(selectedProject.start_date)}</span>
                          </div>
                          {selectedProject.budget && (
                            <div className="flex items-center">
                              <Target className="w-4 h-4 mr-1" />
                              <span>Budget: {formatCurrency(selectedProject.budget)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedProject.status)}`}>
                          {selectedProject.status}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedProject.priority)}`}>
                          {selectedProject.priority}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Overall Progress</span>
                        <span>{selectedProject.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${selectedProject.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <Button icon={MessageSquare} iconPosition="left">
                        Message Consultant
                      </Button>
                      <Button variant="outline" icon={FileText} iconPosition="left">
                        View Documents
                      </Button>
                      <Button variant="outline" icon={Calendar} iconPosition="left">
                        Schedule Meeting
                      </Button>
                    </div>
                  </Card.Body>
                </Card>

                {/* Project Tasks */}
                <Card>
                  <Card.Header>
                    <h2 className="text-xl font-semibold text-gray-900">Project Tasks</h2>
                  </Card.Header>
                  <Card.Body>
                    {tasksLoading ? (
                      <div className="animate-pulse space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
                        ))}
                      </div>
                    ) : projectTasks.length > 0 ? (
                      <div className="space-y-4">
                        {projectTasks.map((task) => (
                          <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">{task.title}</h3>
                                <p className="text-sm text-gray-600">{task.description}</p>
                              </div>
                              <div className="flex flex-col items-end space-y-1">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                                  {task.status}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                  {task.priority}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              {task.due_date && (
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  <span>Due: {formatDate(task.due_date)}</span>
                                </div>
                              )}
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                <span>{task.estimated_hours}h estimated</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No Tasks Yet
                        </h3>
                        <p className="text-gray-600">
                          Your consultant will create tasks as the project progresses
                        </p>
                      </div>
                    )}
                  </Card.Body>
                </Card>

                {/* Project Timeline */}
                <Card>
                  <Card.Header>
                    <h2 className="text-xl font-semibold text-gray-900">Project Timeline</h2>
                  </Card.Header>
                  <Card.Body>
                    <div className="space-y-4">
                      {selectedProject.steps && selectedProject.steps.length > 0 ? (
                        selectedProject.steps.map((step: any, index: number) => (
                          <div key={index} className="flex items-start space-x-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              step.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {step.completed ? '✓' : index + 1}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">{step.title}</h3>
                              <p className="text-sm text-gray-600">{step.description}</p>
                              {step.completed_at && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Completed {formatDate(step.completed_at)}
                                </p>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Timeline Coming Soon
                          </h3>
                          <p className="text-gray-600">
                            Your consultant will set up project milestones and timeline
                          </p>
                        </div>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </div>
            ) : (
              <Card>
                <Card.Body className="text-center py-12">
                  <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Select a Project
                  </h3>
                  <p className="text-gray-600">
                    Choose a project from the list to view details
                  </p>
                </Card.Body>
              </Card>
            )}
          </div>
        </div>
      ) : (
        <Card>
          <Card.Body className="text-center py-12">
            <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Projects Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Your consultant will create projects as your business expansion begins
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button icon={MessageSquare}>
                Contact Consultant
              </Button>
              <Button variant="outline" icon={Target}>
                Browse Services
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}
    </ClientLayout>
  );
};

export default ClientProjects;
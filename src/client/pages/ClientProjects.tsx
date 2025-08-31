import React, { useState, useEffect } from 'react';
import { FolderOpen, Calendar, User, TrendingUp } from 'lucide-react';
import { Card, Button } from '../../shared/components/ui';
import { supabase, Project } from '../../shared/lib/supabase';
import { useAuth } from '../../shared/hooks/useAuth';
import { useLanguage } from '../../shared/contexts/LanguageContext';

interface ProjectWithConsultant extends Project {
  consultant: {
    full_name: string;
    email: string;
  };
}

const ClientProjects = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [projects, setProjects] = useState<ProjectWithConsultant[]>([]);
  const [loading, setLoading] = useState(true);

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

      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          consultant:user_profiles!projects_consultant_id_fkey(full_name, email)
        `)
        .eq('client_id', clientData.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
      } else {
        setProjects(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800';
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

  const getLocalizedContent = (content: Record<string, string>, fallback: string = '') => {
    if (!content || typeof content !== 'object') return fallback;
    return content[language] || content.en || fallback;
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
        <p className="text-gray-600">Track your international business expansion projects</p>
      </div>

      {/* Projects List */}
      {projects.length > 0 ? (
        <div className="space-y-6">
          {projects.map((project) => (
            <Card key={project.id} hover>
              <Card.Body>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {t(project.status)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                        {t(project.priority)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">
                      {getLocalizedContent(project.description_i18n, 'No description available')}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        <span>{project.consultant?.full_name}</span>
                      </div>
                      {project.start_date && (
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>Started {new Date(project.start_date).toLocaleDateString()}</span>
                        </div>
                      )}
                      {project.budget && (
                        <div className="flex items-center">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          <span>Budget: ${project.budget.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Message Consultant
                  </Button>
                  <Button variant="outline" size="sm">
                    View Documents
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
              No Projects Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Your consultant will create projects as your business expansion begins
            </p>
            <Button icon={Target}>
              Browse Available Services
            </Button>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default ClientProjects;
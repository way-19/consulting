import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  FileText, 
  CreditCard, 
  Settings, 
  Plus, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  MessageCircle,
  Download,
  Eye
} from 'lucide-react';
import { useAuth } from '@consulting19/shared';
import { Card, Button } from '@consulting19/ui';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const ClientDashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - in real app this would come from Supabase
  const mockProjects = [
    {
      id: '1',
      title: 'UAE Company Formation',
      consultant: 'Ahmed Al-Rashid',
      status: 'in_progress',
      progress: 75,
      country: 'UAE 🇦🇪',
      created_at: '2025-01-15',
      next_step: 'Bank account opening',
      documents: 8,
      messages: 12
    },
    {
      id: '2', 
      title: 'Estonia e-Residency',
      consultant: 'Maria Kask',
      status: 'completed',
      progress: 100,
      country: 'Estonia 🇪🇪',
      created_at: '2024-12-20',
      next_step: 'Project completed',
      documents: 15,
      messages: 8
    },
    {
      id: '3',
      title: 'Tax Optimization Review',
      consultant: 'Sofia Patel',
      status: 'pending',
      progress: 25,
      country: 'Malta 🇲🇹',
      created_at: '2025-01-20',
      next_step: 'Waiting for documents',
      documents: 3,
      messages: 4
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setProjects(mockProjects);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in_progress': return Clock;
      case 'pending': return AlertCircle;
      default: return Clock;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.user_metadata?.full_name || 'Client'}!
            </h1>
            <p className="text-gray-600">
              Track your international business expansion projects and communicate with your advisors.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <Card.Body className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {projects.length}
                </div>
                <div className="text-sm text-gray-600">Active Projects</div>
              </Card.Body>
            </Card>
            
            <Card>
              <Card.Body className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {projects.filter(p => p.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </Card.Body>
            </Card>
            
            <Card>
              <Card.Body className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  {projects.reduce((sum, p) => sum + p.documents, 0)}
                </div>
                <div className="text-sm text-gray-600">Documents</div>
              </Card.Body>
            </Card>
            
            <Card>
              <Card.Body className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {projects.reduce((sum, p) => sum + p.messages, 0)}
                </div>
                <div className="text-sm text-gray-600">Messages</div>
              </Card.Body>
            </Card>
          </div>

          {/* Projects Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Your Projects</h2>
                <Button icon={Plus} iconPosition="left">
                  New Project
                </Button>
              </div>

              <div className="space-y-6">
                {projects.map((project) => {
                  const StatusIcon = getStatusIcon(project.status);
                  return (
                    <Card key={project.id} hover>
                      <Card.Body>
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {project.title}
                              </h3>
                              <span className="text-sm">{project.country}</span>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">
                              Consultant: {project.consultant}
                            </p>
                            <p className="text-gray-500 text-sm">
                              Started: {project.created_at}
                            </p>
                          </div>
                          
                          <div className="text-right">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {project.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
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

                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <FileText className="w-4 h-4 mr-1" />
                              {project.documents} docs
                            </div>
                            <div className="flex items-center">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              {project.messages} messages
                            </div>
                          </div>
                          
                          <Link to={`/project/${project.id}`}>
                            <Button variant="outline" size="sm" icon={Eye} iconPosition="left">
                              View Details
                            </Button>
                          </Link>
                        </div>

                        {project.next_step && (
                          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800">
                              <strong>Next Step:</strong> {project.next_step}
                            </p>
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recent Activity */}
              <Card>
                <Card.Header>
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                </Card.Header>
                <Card.Body>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm text-gray-900">Estonia e-Residency completed</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm text-gray-900">New message from Ahmed</p>
                        <p className="text-xs text-gray-500">5 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm text-gray-900">Document uploaded</p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Quick Actions */}
              <Card>
                <Card.Header>
                  <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                </Card.Header>
                <Card.Body>
                  <div className="space-y-3">
                    <Link to="/documents">
                      <Button variant="outline" className="w-full justify-start" icon={FileText} iconPosition="left">
                        Upload Documents
                      </Button>
                    </Link>
                    <Link to="/billing">
                      <Button variant="outline" className="w-full justify-start" icon={CreditCard} iconPosition="left">
                        View Billing
                      </Button>
                    </Link>
                    <Link to="/settings">
                      <Button variant="outline" className="w-full justify-start" icon={Settings} iconPosition="left">
                        Account Settings
                      </Button>
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientDashboard;
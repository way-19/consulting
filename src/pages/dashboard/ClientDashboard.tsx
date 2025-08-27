import React, { useState } from 'react';
import { FileText, DollarSign, Clock, CheckCircle, Plus, MessageCircle, Download } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const ClientDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const projects = [
    {
      id: '1',
      title: 'UAE Company Formation',
      consultant: 'Ahmed Al-Rashid',
      country: 'UAE 🇦🇪',
      status: 'in_progress',
      progress: 75,
      amount: '$3,500',
      dueDate: '2025-02-15',
    },
    {
      id: '2',
      title: 'Estonia e-Residency',
      consultant: 'Maria Kask',
      country: 'Estonia 🇪🇪',
      status: 'completed',
      progress: 100,
      amount: '$1,200',
      dueDate: '2025-01-20',
    },
  ];

  const documents = [
    {
      id: '1',
      name: 'UAE Trade License.pdf',
      type: 'Business License',
      uploadDate: '2025-01-25',
      size: '2.4 MB',
    },
    {
      id: '2',
      name: 'Bank Account Details.pdf',
      type: 'Banking',
      uploadDate: '2025-01-24',
      size: '1.1 MB',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in_progress': return 'In Progress';
      case 'pending': return 'Pending';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.user_metadata?.full_name || 'Client'}!
              </h1>
              <p className="text-gray-600">Manage your international business projects</p>
            </div>
            <Button icon={Plus} iconPosition="left">
              New Project
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <Card.Body>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Projects</p>
                  <p className="text-2xl font-bold text-gray-900">2</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </Card.Body>
          </Card>
          
          <Card>
            <Card.Body>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Invested</p>
                  <p className="text-2xl font-bold text-gray-900">$4,700</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </Card.Body>
          </Card>
          
          <Card>
            <Card.Body>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg. Completion</p>
                  <p className="text-2xl font-bold text-gray-900">87%</p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </Card.Body>
          </Card>
          
          <Card>
            <Card.Body>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">1</p>
                </div>
                <CheckCircle className="w-8 h-8 text-teal-600" />
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Overview' },
                { id: 'projects', name: 'Projects' },
                { id: 'documents', name: 'Documents' },
                { id: 'messages', name: 'Messages' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Projects */}
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold text-gray-900">Recent Projects</h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  {projects.slice(0, 3).map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{project.title}</h3>
                        <p className="text-sm text-gray-600">{project.consultant} • {project.country}</p>
                        <div className="mt-2">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{project.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 text-right">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                          {getStatusText(project.status)}
                        </span>
                        <p className="text-sm font-medium text-gray-900 mt-1">{project.amount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>

            {/* Recent Documents */}
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold text-gray-900">Recent Documents</h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-8 h-8 text-blue-600" />
                        <div>
                          <h3 className="font-medium text-gray-900">{doc.name}</h3>
                          <p className="text-sm text-gray-600">{doc.type} • {doc.size}</p>
                          <p className="text-xs text-gray-500">{doc.uploadDate}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" icon={Download}>
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </div>
        )}

        {activeTab === 'projects' && (
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">All Projects</h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-6">
                {projects.map((project) => (
                  <div key={project.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                        <p className="text-gray-600">{project.consultant} • {project.country}</p>
                      </div>
                      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(project.status)}`}>
                        {getStatusText(project.status)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Amount</p>
                        <p className="font-semibold text-gray-900">{project.amount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Due Date</p>
                        <p className="font-semibold text-gray-900">{project.dueDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Progress</p>
                        <p className="font-semibold text-gray-900">{project.progress}%</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <Button variant="primary" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm" icon={MessageCircle}>
                        Message Consultant
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        )}

        {activeTab === 'documents' && (
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">Document Library</h2>
            </Card.Header>
            <Card.Body>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documents.map((doc) => (
                  <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <FileText className="w-10 h-10 text-blue-600" />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{doc.name}</h3>
                        <p className="text-sm text-gray-600">{doc.type}</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mb-3">
                      <p>Size: {doc.size}</p>
                      <p>Uploaded: {doc.uploadDate}</p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full" icon={Download}>
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        )}

        {activeTab === 'messages' && (
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
            </Card.Header>
            <Card.Body>
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages yet</h3>
                <p className="text-gray-600">Your conversations with consultants will appear here.</p>
              </div>
            </Card.Body>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;
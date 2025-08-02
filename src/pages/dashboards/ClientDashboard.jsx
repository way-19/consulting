import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  FileText, 
  MessageSquare, 
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  LogOut,
  Settings,
  Bell,
  Plus,
  Download,
  Upload
} from 'lucide-react';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [client, setClient] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id || user.role !== 'client') {
      navigate('/login');
      return;
    }
    setClient(user);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const applications = [
    { 
      id: 1, 
      country: 'Estonia', 
      type: 'LLC Formation', 
      status: 'In Progress', 
      progress: 75,
      consultant: 'Sarah Johnson',
      amount: '$2,500',
      date: '2024-01-15',
      nextStep: 'Document review pending'
    },
    { 
      id: 2, 
      country: 'Malta', 
      type: 'Tax Optimization', 
      status: 'Completed', 
      progress: 100,
      consultant: 'Antonio Rucci',
      amount: '$4,200',
      date: '2024-01-10',
      nextStep: 'Setup complete'
    },
    { 
      id: 3, 
      country: 'UAE', 
      type: 'Company Setup', 
      status: 'Documents Required', 
      progress: 40,
      consultant: 'Ahmed Hassan',
      amount: '$3,800',
      date: '2024-01-12',
      nextStep: 'Upload bank statements'
    }
  ];

  const recentMessages = [
    { from: 'Sarah Johnson', message: 'Your Estonia LLC documents are ready for review', time: '2 hours ago', unread: true },
    { from: 'AI Assistant', message: 'Reminder: Bank statement upload required for UAE application', time: '1 day ago', unread: false },
    { from: 'Antonio Rucci', message: 'Malta tax optimization completed successfully!', time: '3 days ago', unread: false }
  ];

  const documents = [
    { name: 'Estonia LLC Certificate', type: 'Certificate', status: 'Ready', date: '2024-01-15' },
    { name: 'Tax Registration', type: 'Tax Document', status: 'Processing', date: '2024-01-14' },
    { name: 'Bank Account Details', type: 'Banking', status: 'Ready', date: '2024-01-13' },
    { name: 'Compliance Report', type: 'Report', status: 'Ready', date: '2024-01-12' }
  ];

  const recommendedServices = [
    { 
      title: 'Accounting Services', 
      description: 'Monthly bookkeeping and tax preparation for your Estonia LLC',
      price: '$299/month',
      consultant: 'Sarah Johnson'
    },
    { 
      title: 'Banking Solutions', 
      description: 'Open business accounts in multiple jurisdictions',
      price: '$500',
      consultant: 'Available Consultants'
    },
    { 
      title: 'Compliance Monitoring', 
      description: 'Ongoing regulatory compliance and filing management',
      price: '$199/month',
      consultant: 'AI + Human Oversight'
    }
  ];

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-green-700 rounded-lg flex items-center justify-center mr-3">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Client Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Settings className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700">Welcome, {client.name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back! 👋</h2>
          <p className="text-gray-600">
            Track your applications, communicate with consultants, and manage your business setup
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Applications</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">3</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">1</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Documents</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Messages</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">5</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Applications */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">My Applications</h3>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>New Application</span>
              </button>
            </div>
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="p-4 border border-gray-200 rounded-xl hover:border-green-300 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{app.country} {app.type}</h4>
                      <p className="text-sm text-gray-600">Consultant: {app.consultant}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{app.amount}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        app.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        app.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{app.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${app.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">{app.nextStep}</p>
                    <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Messages & Quick Actions */}
          <div className="space-y-6">
            {/* Recent Messages */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Messages</h3>
              <div className="space-y-3">
                {recentMessages.map((message, index) => (
                  <div key={index} className={`p-3 rounded-xl ${message.unread ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900">{message.from}</p>
                      {message.unread && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{message.message}</p>
                    <p className="text-xs text-gray-500">{message.time}</p>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                View All Messages
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors">
                  <Upload className="h-5 w-5" />
                  <span>Upload Documents</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors">
                  <MessageSquare className="h-5 w-5" />
                  <span>Message Consultant</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-colors">
                  <Calendar className="h-5 w-5" />
                  <span>Schedule Meeting</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 bg-orange-50 text-orange-700 rounded-xl hover:bg-orange-100 transition-colors">
                  <Download className="h-5 w-5" />
                  <span>Download Documents</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">My Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {documents.map((doc, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-xl hover:border-green-300 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <FileText className="h-8 w-8 text-gray-400" />
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    doc.status === 'Ready' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {doc.status}
                  </span>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">{doc.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{doc.type}</p>
                <p className="text-xs text-gray-500">{doc.date}</p>
                {doc.status === 'Ready' && (
                  <button className="w-full mt-3 bg-green-100 text-green-700 py-2 rounded-lg hover:bg-green-200 transition-colors text-sm">
                    Download
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Services */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recommended Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedServices.map((service, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-xl hover:border-green-300 transition-colors">
                <h4 className="font-medium text-gray-900 mb-2">{service.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-green-600 font-semibold">{service.price}</span>
                  <span className="text-xs text-gray-500">{service.consultant}</span>
                </div>
                <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
                  Request Service
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
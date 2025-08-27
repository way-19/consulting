import React, { useState } from 'react';
import { Users, DollarSign, TrendingUp, Clock, Plus, MessageCircle, FileText, Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const ConsultantDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const clients = [
    {
      id: '1',
      name: 'John Smith',
      project: 'UAE Company Formation',
      status: 'in_progress',
      progress: 75,
      amount: '$3,500',
      earnings: '$2,275',
      startDate: '2025-01-15',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      project: 'Banking Setup',
      status: 'completed',
      progress: 100,
      amount: '$1,200',
      earnings: '$780',
      startDate: '2025-01-10',
    },
  ];

  const services = [
    {
      id: '1',
      title: 'UAE Free Zone Company Formation',
      price: '$3,500',
      duration: '7-14 days',
      active: true,
    },
    {
      id: '2',
      title: 'Corporate Banking Setup',
      price: '$1,500',
      duration: '14-30 days',
      active: true,
    },
    {
      id: '3',
      title: 'Tax Residency Certificate',
      price: '$800',
      duration: '5-10 days',
      active: false,
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
                Consultant Dashboard
              </h1>
              <p className="text-gray-600">Manage your clients and services</p>
            </div>
            <Button icon={Plus} iconPosition="left">
              Add Service
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
                  <p className="text-sm text-gray-600">Active Clients</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </Card.Body>
          </Card>
          
          <Card>
            <Card.Body>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Monthly Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">$8,450</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </Card.Body>
          </Card>
          
          <Card>
            <Card.Body>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">98%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </Card.Body>
          </Card>
          
          <Card>
            <Card.Body>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg. Rating</p>
                  <p className="text-2xl font-bold text-gray-900">4.9</p>
                </div>
                <Star className="w-8 h-8 text-yellow-600" />
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
                { id: 'clients', name: 'Clients' },
                { id: 'services', name: 'Services' },
                { id: 'earnings', name: 'Earnings' },
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
            {/* Recent Clients */}
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold text-gray-900">Recent Clients</h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  {clients.map((client) => (
                    <div key={client.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{client.name}</h3>
                        <p className="text-sm text-gray-600">{client.project}</p>
                        <div className="mt-2">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{client.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${client.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 text-right">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(client.status)}`}>
                          {getStatusText(client.status)}
                        </span>
                        <p className="text-sm font-medium text-gray-900 mt-1">{client.earnings}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold text-gray-900">Performance This Month</h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">New Clients</span>
                    <span className="text-2xl font-bold text-blue-600">5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Projects Completed</span>
                    <span className="text-2xl font-bold text-green-600">8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Revenue Generated</span>
                    <span className="text-2xl font-bold text-orange-600">$12,300</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Client Satisfaction</span>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-yellow-600 mr-2">4.9</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        )}

        {activeTab === 'clients' && (
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">All Clients</h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-6">
                {clients.map((client) => (
                  <div key={client.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
                        <p className="text-gray-600">{client.project}</p>
                      </div>
                      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(client.status)}`}>
                        {getStatusText(client.status)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Project Value</p>
                        <p className="font-semibold text-gray-900">{client.amount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Your Earnings</p>
                        <p className="font-semibold text-green-600">{client.earnings}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Start Date</p>
                        <p className="font-semibold text-gray-900">{client.startDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Progress</p>
                        <p className="font-semibold text-gray-900">{client.progress}%</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${client.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <Button variant="primary" size="sm">
                        Update Progress
                      </Button>
                      <Button variant="outline" size="sm" icon={MessageCircle}>
                        Message Client
                      </Button>
                      <Button variant="outline" size="sm" icon={FileText}>
                        View Documents
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        )}

        {activeTab === 'services' && (
          <Card>
            <Card.Header>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">My Services</h2>
                <Button icon={Plus} iconPosition="left" size="sm">
                  Add New Service
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <div key={service.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-gray-900">{service.title}</h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        service.active ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100'
                      }`}>
                        {service.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-semibold text-gray-900">{service.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-semibold text-gray-900">{service.duration}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Edit
                      </Button>
                      <Button 
                        variant={service.active ? "outline" : "primary"} 
                        size="sm" 
                        className="flex-1"
                      >
                        {service.active ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        )}

        {activeTab === 'earnings' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold text-gray-900">Earnings Overview</h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">$8,450</p>
                    <p className="text-gray-600">This Month</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">$3,055</p>
                      <p className="text-sm text-blue-800">Completed Projects</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">$5,395</p>
                      <p className="text-sm text-orange-800">Ongoing Projects</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Platform Commission (35%)</span>
                      <span className="font-semibold text-red-600">-$4,607</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Your Share (65%)</span>
                      <span className="font-semibold text-green-600">$8,450</span>
                    </div>
                    <hr />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Revenue Generated</span>
                      <span>$13,057</span>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  {[
                    { client: 'John Smith', amount: '$2,275', date: '2025-01-25', status: 'completed' },
                    { client: 'Sarah Johnson', amount: '$780', date: '2025-01-20', status: 'completed' },
                    { client: 'Mike Wilson', amount: '$1,950', date: '2025-01-18', status: 'pending' },
                  ].map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">{transaction.client}</h3>
                        <p className="text-sm text-gray-600">{transaction.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{transaction.amount}</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                          {getStatusText(transaction.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultantDashboard;
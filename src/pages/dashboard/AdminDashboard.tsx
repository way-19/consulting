import React from 'react';
import { Users, TrendingUp, DollarSign, Globe, Bell, Settings, FileText } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const AdminDashboard = () => {
  const { user } = useAuth();

  const platformStats = [
    { title: 'Total Users', value: '1,247', icon: Users, color: 'text-blue-600', trend: '+12%' },
    { title: 'Active Consultants', value: '43', icon: Globe, color: 'text-teal-600', trend: '+5%' },
    { title: 'Monthly Revenue', value: '$47,380', icon: DollarSign, color: 'text-green-600', trend: '+23%' },
    { title: 'Active Projects', value: '89', icon: TrendingUp, color: 'text-orange-600', trend: '+8%' },
  ];

  const recentActivity = [
    {
      id: '1',
      type: 'user_registration',
      message: 'New client registered: John Smith',
      timestamp: '5 minutes ago',
      status: 'success',
    },
    {
      id: '2',
      type: 'payment',
      message: 'Payment received: $1,000 - UAE Company Formation',
      timestamp: '1 hour ago',
      status: 'success',
    },
    {
      id: '3',
      type: 'consultant_application',
      message: 'New consultant application: Maria Santos (Portugal)',
      timestamp: '2 hours ago',
      status: 'pending',
    },
  ];

  const pendingApprovals = [
    {
      id: '1',
      type: 'consultant',
      title: 'Consultant Application',
      description: 'Maria Santos - Portugal specialist',
      submittedDate: '2025-01-25',
    },
    {
      id: '2',
      type: 'blog_post',
      title: 'Blog Post Review',
      description: '"Tax Benefits of Cyprus Business Formation"',
      submittedDate: '2025-01-24',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">Platform management and oversight</p>
            </div>
            <Button icon={Settings} iconPosition="left" variant="outline">
              Platform Settings
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {platformStats.map((stat, index) => (
            <Card key={index}>
              <Card.Body>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600 font-medium">{stat.trend} from last month</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Activity */}
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold text-gray-900">Recent Platform Activity</h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          activity.status === 'success' ? 'bg-green-500' : 
                          activity.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500">{activity.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>

            {/* Revenue Chart Placeholder */}
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold text-gray-900">Revenue Trends</h2>
              </Card.Header>
              <Card.Body>
                <div className="h-64 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Revenue analytics chart will be implemented here</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Pending Approvals */}
            <Card>
              <Card.Header>
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">Pending Approvals</h2>
                  <div className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full">
                    {pendingApprovals.length}
                  </div>
                </div>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  {pendingApprovals.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-3">
                      <h3 className="font-medium text-gray-900 text-sm">{item.title}</h3>
                      <p className="text-xs text-gray-600 mb-2">{item.description}</p>
                      <div className="flex space-x-2">
                        <Button variant="primary" size="sm" className="text-xs">
                          Approve
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs">
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>

            {/* System Health */}
            <Card>
              <Card.Header>
                <h2 className="text-lg font-semibold text-gray-900">System Health</h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Database</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Healthy</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Payment Gateway</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Operational</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">AI Oracle</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Online</span>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Quick Admin Actions */}
            <Card>
              <Card.Header>
                <h2 className="text-lg font-semibold text-gray-900">Admin Tools</h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" icon={Users}>
                    Manage Users
                  </Button>
                  <Button variant="outline" className="w-full justify-start" icon={Globe}>
                    Manage Countries
                  </Button>
                  <Button variant="outline" className="w-full justify-start" icon={FileText}>
                    Content Management
                  </Button>
                  <Button variant="outline" className="w-full justify-start" icon={DollarSign}>
                    Financial Reports
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Globe, 
  TrendingUp, 
  Shield, 
  AlertTriangle,
  DollarSign,
  Activity,
  LogOut,
  Settings,
  Bell
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    setAdmin(user);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const stats = [
    { title: 'Total Revenue', value: '$2.4M', change: '+12%', icon: DollarSign, color: 'text-green-600' },
    { title: 'Active Consultants', value: '47', change: '+3', icon: Users, color: 'text-blue-600' },
    { title: 'Client Applications', value: '1,247', change: '+89', icon: Globe, color: 'text-purple-600' },
    { title: 'Success Rate', value: '98%', change: '+2%', icon: TrendingUp, color: 'text-orange-600' }
  ];

  const recentActivities = [
    { type: 'New Application', message: 'Estonia company formation - John Smith', time: '2 min ago' },
    { type: 'Payment Received', message: '$2,500 from Malta LLC setup', time: '15 min ago' },
    { type: 'Consultant Assigned', message: 'Sarah Johnson assigned to UAE case', time: '1 hour ago' },
    { type: 'AI Alert', message: 'High-risk query flagged for review', time: '2 hours ago' }
  ];

  const alerts = [
    { type: 'warning', message: '3 AI responses pending legal review', priority: 'High' },
    { type: 'info', message: 'Monthly commission payments due tomorrow', priority: 'Medium' },
    { type: 'success', message: 'System backup completed successfully', priority: 'Low' }
  ];

  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
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
              <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-red-700 rounded-lg flex items-center justify-center mr-3">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Settings className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700">Welcome, {admin.name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Global Command Center</h2>
          <p className="text-gray-600">
            Complete oversight of CONSULTING19 ecosystem with AI monitoring and analytics
          </p>
        </div>

        {/* Alerts */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Alerts</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border-l-4 ${
                  alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                  alert.type === 'info' ? 'bg-blue-50 border-blue-400' :
                  'bg-green-50 border-green-400'
                }`}
              >
                <div className="flex items-center">
                  <AlertTriangle className={`h-5 w-5 mr-2 ${
                    alert.type === 'warning' ? 'text-yellow-600' :
                    alert.type === 'info' ? 'text-blue-600' :
                    'text-green-600'
                  }`} />
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    alert.priority === 'High' ? 'bg-red-100 text-red-800' :
                    alert.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {alert.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mt-2">{alert.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className={`text-sm mt-1 ${stat.color}`}>{stat.change} from last month</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  stat.color === 'text-green-600' ? 'bg-green-100' :
                  stat.color === 'text-blue-600' ? 'bg-blue-100' :
                  stat.color === 'text-purple-600' ? 'bg-purple-100' :
                  'bg-orange-100'
                }`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Safety Monitor */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-red-600" />
              AI Safety Monitor
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                <div>
                  <p className="font-medium text-green-900">AI System Status</p>
                  <p className="text-sm text-green-700">All systems operational</p>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-2xl font-bold text-gray-900">247</p>
                  <p className="text-sm text-gray-600">AI Interactions Today</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-2xl font-bold text-gray-900">3</p>
                  <p className="text-sm text-gray-600">Pending Legal Review</p>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <p className="font-medium text-yellow-900">Recent AI Alert</p>
                <p className="text-sm text-yellow-700 mt-1">
                  High-confidence legal advice flagged for human review - Estonia tax query
                </p>
                <button className="mt-2 text-xs bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full hover:bg-yellow-300">
                  Review Now
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-600" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                    <p className="text-sm text-gray-600">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue Analytics */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
            Revenue Analytics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">$847K</p>
              <p className="text-sm text-gray-600">Legacy Orders</p>
              <p className="text-xs text-green-600 mt-1">+15% this month</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">$623K</p>
              <p className="text-sm text-gray-600">Platform Services</p>
              <p className="text-xs text-green-600 mt-1">+28% this month</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">$234K</p>
              <p className="text-sm text-gray-600">Custom Services</p>
              <p className="text-xs text-green-600 mt-1">+42% this month</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">65%</p>
              <p className="text-sm text-gray-600">Consultant Share</p>
              <p className="text-xs text-gray-600 mt-1">Standard rate</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg">
            <Users className="h-8 w-8 mb-2" />
            <h4 className="font-semibold">Manage Consultants</h4>
            <p className="text-sm text-blue-100 mt-1">View and manage all consultants</p>
          </button>
          
          <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-2xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg">
            <Shield className="h-8 w-8 mb-2" />
            <h4 className="font-semibold">AI Safety Center</h4>
            <p className="text-sm text-purple-100 mt-1">Monitor AI interactions and safety</p>
          </button>
          
          <button className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-2xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg">
            <BarChart3 className="h-8 w-8 mb-2" />
            <h4 className="font-semibold">Revenue Reports</h4>
            <p className="text-sm text-green-100 mt-1">Detailed financial analytics</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
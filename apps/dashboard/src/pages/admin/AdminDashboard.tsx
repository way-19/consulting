import React from 'react';
import { Link } from 'react-router-dom';
import { Settings, Users, Globe, FileText, DollarSign, TrendingUp, Activity, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
  const statCards = [
    {
      title: 'Total Applications',
      value: '0',
      icon: FileText,
      color: 'blue',
      description: 'Order form submissions',
      trend: '+0%'
    },
    {
      title: 'Active Jurisdictions',
      value: '2',
      icon: Globe,
      color: 'green',
      description: 'Available for orders',
      trend: '+0%'
    },
    {
      title: 'Total Revenue',
      value: '$0',
      icon: DollarSign,
      color: 'purple',
      description: 'From formations',
      trend: '+0%'
    },
    {
      title: 'Success Rate',
      value: '100%',
      icon: TrendingUp,
      color: 'emerald',
      description: 'Completion rate',
      trend: '0%'
    },
  ];

  const quickActions = [
    {
      title: 'Order Form Control',
      description: 'Manage wizard configuration',
      icon: Settings,
      href: '/admin/order-form',
      color: 'bg-blue-600'
    },
    {
      title: 'User Management',
      description: 'Manage users and roles',
      icon: Users,
      href: '/admin/users',
      color: 'bg-green-600'
    },
    {
      title: 'System Settings',
      description: 'Global configuration',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-purple-600'
    },
    {
      title: 'Analytics',
      description: 'View system analytics',
      icon: Activity,
      href: '/admin/analytics',
      color: 'bg-orange-600'
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">Platform overview and system management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </div>
              <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm font-medium text-green-600">{stat.trend}</span>
              <span className="text-sm text-gray-600 ml-1">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.href}
                className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {action.title}
                    </div>
                    <div className="text-sm text-gray-600">{action.description}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">System Status</h2>
        </div>
        <div className="px-6 py-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Order Form System</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Database Connection</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                Healthy
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">API Response Time</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                &lt;200ms
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Storage Usage</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                45% Used
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="px-6 py-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Settings className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <span className="text-gray-900">Order form system initialized</span>
                <span className="text-gray-500 ml-2">• Just now</span>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Globe className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <span className="text-gray-900">Georgia jurisdiction activated</span>
                <span className="text-gray-500 ml-2">• Just now</span>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <span className="text-gray-900">UAE jurisdiction configured</span>
                <span className="text-gray-500 ml-2">• Just now</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
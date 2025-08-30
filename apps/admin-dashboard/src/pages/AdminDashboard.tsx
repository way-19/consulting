import React from 'react';
import { Users, TrendingUp, DollarSign, Globe, Bell, Settings, FileText, Edit } from 'lucide-react';
import { useAuth } from '@consulting19/shared';
import { Card, Button } from '@consulting19/ui';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const AdminDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { title: 'Total Users', value: '1,247', icon: Users, color: 'blue' },
    { title: 'Active Projects', value: '89', icon: FileText, color: 'green' },
    { title: 'Monthly Revenue', value: '$45,230', icon: DollarSign, color: 'yellow' },
    { title: 'Countries', value: '19', icon: Globe, color: 'purple' },
  ];

  const quickActions = [
    { title: 'Content Management', description: 'Manage marketing pages and content', href: '/content', icon: Edit, color: 'blue' },
    { title: 'User Management', description: 'Manage users and permissions', href: '/users', icon: Users, color: 'green' },
    { title: 'Countries', description: 'Manage countries and consultants', href: '/countries', icon: Globe, color: 'purple' },
    { title: 'Analytics', description: 'View platform analytics', href: '/analytics', icon: TrendingUp, color: 'orange' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.user_metadata?.full_name || 'Admin'}!
            </h1>
            <p className="text-gray-600">
              Manage the Consulting19 platform from your admin dashboard.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index}>
                <Card.Body className="text-center">
                  <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center mx-auto mb-4`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.title}</div>
                </Card.Body>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.href}>
                <Card hover className="h-full">
                  <Card.Body className="text-center">
                    <div className={`w-12 h-12 bg-${action.color}-100 rounded-lg flex items-center justify-center mx-auto mb-4`}>
                      <action.icon className={`w-6 h-6 text-${action.color}-600`} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {action.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {action.description}
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Manage
                    </Button>
                  </Card.Body>
                </Card>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Globe, 
  Settings, 
  FileText, 
  MessageSquare, 
  HelpCircle, 
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  Plus
} from 'lucide-react';
import { useAuth } from '@consulting19/shared';
import { Card, Button } from '@consulting19/ui';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const ConsultantDashboard = () => {
  const { user } = useAuth();

  // Mock data - in real app this would come from Supabase
  const stats = {
    totalServices: 8,
    activeClients: 12,
    monthlyRevenue: 15400,
    completedProjects: 45
  };

  const recentActivity = [
    { type: 'service', message: 'New service "UAE Banking Solutions" published', time: '2 hours ago' },
    { type: 'client', message: 'New client inquiry from Sarah Chen', time: '4 hours ago' },
    { type: 'content', message: 'Updated UAE company formation guide', time: '1 day ago' },
    { type: 'blog', message: 'Published "UAE Business Setup 2025" article', time: '2 days ago' },
  ];

  const quickActions = [
    { title: 'Add New Service', href: '/services', icon: Plus, color: 'blue' },
    { title: 'Update Country Info', href: '/country', icon: Globe, color: 'green' },
    { title: 'Write Blog Post', href: '/blog', icon: FileText, color: 'purple' },
    { title: 'Manage FAQ', href: '/faq', icon: HelpCircle, color: 'orange' },
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
              Welcome back, {user?.user_metadata?.full_name || 'Consultant'}!
            </h1>
            <p className="text-gray-600">
              Manage your country services, content, and client interactions from your dashboard.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <Card.Body className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {stats.totalServices}
                </div>
                <div className="text-sm text-gray-600">Active Services</div>
              </Card.Body>
            </Card>
            
            <Card>
              <Card.Body className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {stats.activeClients}
                </div>
                <div className="text-sm text-gray-600">Active Clients</div>
              </Card.Body>
            </Card>
            
            <Card>
              <Card.Body className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  ${stats.monthlyRevenue.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Monthly Revenue</div>
              </Card.Body>
            </Card>
            
            <Card>
              <Card.Body className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {stats.completedProjects}
                </div>
                <div className="text-sm text-gray-600">Completed Projects</div>
              </Card.Body>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <Button variant="outline" size="sm" className="w-full">
                          Manage
                        </Button>
                      </Card.Body>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
              <Card>
                <Card.Body>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          activity.type === 'service' ? 'bg-blue-500' :
                          activity.type === 'client' ? 'bg-green-500' :
                          activity.type === 'content' ? 'bg-orange-500' :
                          'bg-purple-500'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
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

export default ConsultantDashboard;
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Users, 
  DollarSign, 
  Globe, 
  FileText, 
  Activity,
  TrendingUp,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Card } from '../components/ui/Card';

interface AdminStats {
  totalUsers: number;
  activeConsultants: number;
  activeClients: number;
  monthlyRevenue: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  contentPages: number;
  systemHealth: {
    database: 'healthy' | 'warning' | 'error';
    api: 'healthy' | 'warning' | 'error';
    storage: number;
  };
}

interface RecentActivity {
  id: string;
  description: string;
  created_at: string;
}

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeConsultants: 0,
    activeClients: 0,
    monthlyRevenue: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    contentPages: 0,
    systemHealth: {
      database: 'healthy',
      api: 'healthy',
      storage: 45
    }
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  useEffect(() => {
    // Mock data for demo
    setTimeout(() => {
      setStats({
        totalUsers: 156,
        activeConsultants: 12,
        activeClients: 89,
        monthlyRevenue: 45200,
        totalRevenue: 234500,
        pendingOrders: 8,
        completedOrders: 142,
        contentPages: 67,
        systemHealth: {
          database: 'healthy',
          api: 'healthy',
          storage: 45
        }
      });
      
      setRecentActivity([
        {
          id: '1',
          description: 'New consultant registered: John Smith',
          created_at: new Date().toISOString()
        },
        {
          id: '2', 
          description: 'Client payment processed: $2,500',
          created_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: '3',
          description: 'New service order created',
          created_at: new Date(Date.now() - 7200000).toISOString()
        }
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toString(),
      icon: Users,
      color: 'blue',
      description: 'All platform users',
      change: `${stats.activeConsultants} consultants, ${stats.activeClients} clients`,
    },
    {
      title: 'Active Countries',
      value: '19+',
      icon: Globe,
      color: 'green',
      description: 'Supported jurisdictions',
      change: 'Global coverage',
    },
    {
      title: 'Content Pages',
      value: stats.contentPages.toString(),
      icon: FileText,
      color: 'purple',
      description: 'Published content',
      change: 'Blog posts and pages',
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'green',
      description: 'Platform earnings',
      change: `$${stats.totalRevenue.toLocaleString()} total`,
    },
  ];

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Admin Dashboard - Admin Panel</title>
        </Helmet>
        
        <div className="space-y-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Admin Panel</title>
      </Helmet>
      
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
            <Card key={index} hover>
              <Card.Body>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    stat.color === 'blue' ? 'bg-blue-100' :
                    stat.color === 'green' ? 'bg-green-100' :
                    stat.color === 'purple' ? 'bg-purple-100' : 'bg-gray-100'
                  }`}>
                    <stat.icon className={`w-6 h-6 ${
                      stat.color === 'blue' ? 'text-blue-600' :
                      stat.color === 'green' ? 'text-green-600' :
                      stat.color === 'purple' ? 'text-purple-600' : 'text-gray-600'
                    }`} />
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>

        {/* Order Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">Order Management</h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Pending Orders</span>
                  <span className="font-bold text-yellow-600">{stats.pendingOrders}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Completed Orders</span>
                  <span className="font-bold text-green-600">{stats.completedOrders}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="font-bold text-blue-600">
                    {stats.pendingOrders + stats.completedOrders > 0 
                      ? Math.round((stats.completedOrders / (stats.pendingOrders + stats.completedOrders)) * 100)
                      : 0}%
                  </span>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            </Card.Header>
            <Card.Body>
              {recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Activity className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">No recent activity</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>

        {/* System Status */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">System Status</h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getHealthIcon(stats.systemHealth.database)}
                  <span className="text-gray-600">Database</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getHealthColor(stats.systemHealth.database)}`}>
                  {stats.systemHealth.database}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getHealthIcon(stats.systemHealth.api)}
                  <span className="text-gray-600">API Response</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getHealthColor(stats.systemHealth.api)}`}>
                  {stats.systemHealth.api}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-600">Storage</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  stats.systemHealth.storage > 80 ? 'bg-red-100 text-red-800' :
                  stats.systemHealth.storage > 60 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {stats.systemHealth.storage}% Used
                </span>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default AdminDashboard;
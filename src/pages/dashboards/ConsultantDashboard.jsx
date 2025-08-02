import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  FileText, 
  MessageSquare,
  Calendar,
  Award,
  LogOut,
  Settings,
  Bell,
  Plus,
  Eye
} from 'lucide-react';

const ConsultantDashboard = () => {
  const navigate = useNavigate();
  const [consultant, setConsultant] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id || user.role !== 'consultant') {
      navigate('/login');
      return;
    }
    setConsultant(user);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const stats = [
    { title: 'Monthly Earnings', value: '$12,450', change: '+18%', icon: DollarSign, color: 'text-green-600' },
    { title: 'Active Clients', value: '23', change: '+5', icon: Users, color: 'text-blue-600' },
    { title: 'Success Rate', value: '96%', change: '+2%', icon: TrendingUp, color: 'text-purple-600' },
    { title: 'Avg Rating', value: '4.9', change: '+0.1', icon: Award, color: 'text-orange-600' }
  ];

  const recentClients = [
    { name: 'John Smith', service: 'Estonia LLC Formation', status: 'In Progress', amount: '$2,500', date: '2024-01-15' },
    { name: 'Maria Garcia', service: 'Malta Tax Optimization', status: 'Completed', amount: '$4,200', date: '2024-01-14' },
    { name: 'Ahmed Hassan', service: 'UAE Company Setup', status: 'Documents Review', amount: '$3,800', date: '2024-01-13' },
    { name: 'Lisa Chen', service: 'Portugal Golden Visa', status: 'In Progress', amount: '$15,000', date: '2024-01-12' }
  ];

  const customServices = [
    { name: 'Tax Planning Consultation', price: '$500', clients: 12, status: 'Active' },
    { name: 'Business Plan Development', price: '$1,200', clients: 8, status: 'Active' },
    { name: 'Compliance Monitoring', price: '$300/month', clients: 15, status: 'Active' },
    { name: 'Investment Advisory', price: '$800', clients: 6, status: 'Active' }
  ];

  const commissionBreakdown = [
    { source: 'Legacy Orders', amount: '$4,250', percentage: '65%', count: 8 },
    { source: 'Custom Services', amount: '$3,900', percentage: '65%', count: 12 },
    { source: 'Platform Applications', amount: '$2,800', percentage: '65%', count: 6 },
    { source: 'Referral Bonuses', amount: '$1,500', percentage: '100%', count: 3 }
  ];

  if (!consultant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mr-3">
                <Users className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Consultant Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Settings className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700">Welcome, {consultant.name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Performance Hub</h2>
          <p className="text-gray-600">
            Manage your clients, track revenue, and grow your consulting business
          </p>
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
          {/* Recent Clients */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Clients</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentClients.map((client, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{client.name}</p>
                    <p className="text-sm text-gray-600">{client.service}</p>
                    <p className="text-xs text-gray-500 mt-1">{client.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{client.amount}</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      client.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      client.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {client.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 p-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors">
                <Plus className="h-5 w-5" />
                <span>Create Custom Service</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors">
                <FileText className="h-5 w-5" />
                <span>Send Payment Request</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-colors">
                <MessageSquare className="h-5 w-5" />
                <span>Message Client</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 bg-orange-50 text-orange-700 rounded-xl hover:bg-orange-100 transition-colors">
                <Calendar className="h-5 w-5" />
                <span>Schedule Meeting</span>
              </button>
            </div>
          </div>
        </div>

        {/* Commission Breakdown */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Commission Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {commissionBreakdown.map((item, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-xl">
                <p className="text-2xl font-bold text-gray-900">{item.amount}</p>
                <p className="text-sm text-gray-600 mt-1">{item.source}</p>
                <div className="flex items-center justify-center space-x-2 mt-2">
                  <span className="text-xs text-green-600 font-medium">{item.percentage}</span>
                  <span className="text-xs text-gray-500">• {item.count} items</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Services */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">My Custom Services</h3>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Service</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {customServices.map((service, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{service.name}</h4>
                  <span className="text-green-600 font-semibold">{service.price}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{service.clients} clients</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    {service.status}
                  </span>
                </div>
                <div className="mt-3 flex space-x-2">
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center justify-center">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </button>
                  <button className="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded-lg hover:bg-blue-200 transition-colors text-sm">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultantDashboard;
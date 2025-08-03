import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  LogOut, 
  Settings, 
  Bell, 
  BarChart3,
  MessageSquare,
  Users,
  Globe,
  AlertTriangle
} from 'lucide-react';

interface AdminDashboardLayoutProps {
  admin: any;
  children: React.ReactNode;
}

const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({ 
  admin, 
  children 
}) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    localStorage.removeItem('user');
    await new Promise(resolve => setTimeout(resolve, 100));
    navigate('/', { replace: true });
  };

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
              <h1 className="text-xl font-bold text-gray-900">Admin Panosu</h1>
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
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-700">
                    {admin?.first_name} {admin?.last_name}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center">
                    <Shield className="h-3 w-3 mr-1" />
                    Sistem Yöneticisi
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Çıkış</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu,
  Users, 
  LogOut, 
  Settings, 
  Shield

} from 'lucide-react';

interface ConsultantDashboardLayoutProps {
  children: React.ReactNode;
}

export default function ConsultantDashboardLayout({ children }: ConsultantDashboardLayoutProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">ConsultConnect</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/consultant/settings"
                className="text-gray-500 hover:text-gray-700 p-2 rounded-md hover:bg-gray-100"
              >
                <Settings className="h-5 w-5" />
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-md hover:bg-gray-100"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar will be rendered by the parent ConsultantDashboard */}
        <div className="flex-1 ml-64 p-8"> {/* Adjust ml-64 to match sidebar width */}
          {children}
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, 
  LogOut, 
  Settings, 
  Bell, 
  BarChart3,
  MessageSquare,
  Calculator,
  FileText,
  DollarSign,
  Globe
} from 'lucide-react';

interface ConsultantDashboardLayoutProps {
  consultant: any;
  children: React.ReactNode;
}

const ConsultantDashboardLayout: React.FC<ConsultantDashboardLayoutProps> = ({ 
  consultant, 
  children 
}) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    localStorage.removeItem('user');
    navigate('/');
  };

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
              <h1 className="text-xl font-bold text-gray-900">Danışman Panosu</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => {
                  const event = new CustomEvent('toggleNotifications');
                  window.dispatchEvent(event);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 relative"
              >
                <Bell className="h-5 w-5" />
              </button>
              <button 
                onClick={() => {
                  const event = new CustomEvent('toggleSettings');
                  window.dispatchEvent(event);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <Settings className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-700">
                    {consultant?.first_name} {consultant?.last_name}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center">
                    <span className="mr-1">{consultant?.countries?.flag_emoji || '🌍'}</span>
                    {consultant?.countries?.name || 'Global'}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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

export default ConsultantDashboardLayout;
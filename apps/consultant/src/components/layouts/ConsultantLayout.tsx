import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Settings, 
  Users, 
  FileText, 
  LogOut, 
  Clock, 
  Upload, 
  Calendar,
  MessageSquare,
  Target,
  BarChart3,
  DollarSign
} from 'lucide-react';
import { useAuth } from '@consulting19/shared';
import { supabase } from '@consulting19/shared/lib/supabase';

interface ConsultantLayoutProps {
  children: React.ReactNode;
}

const ConsultantLayout: React.FC<ConsultantLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();
  const [pendingTasksCount, setPendingTasksCount] = useState(0);
  const [alertsCount, setAlertsCount] = useState(0);

  useEffect(() => {
    if (user?.id) {
      fetchNotificationCounts();
      // Refresh counts every 30 seconds
      const interval = setInterval(fetchNotificationCounts, 30000);
      return () => clearInterval(interval);
    }
  }, [user?.id]);

  const fetchNotificationCounts = async () => {
    try {
      // Get pending tasks count
      const { count: tasksCount } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('consultant_id', user?.id)
        .in('status', ['todo', 'in_progress']);

      setPendingTasksCount(tasksCount || 0);

      // Get unresolved alerts count  
      const { count: alertsCount } = await supabase
        .from('consultant_alerts')
        .select('*', { count: 'exact', head: true })
        .eq('consultant_id', user?.id)
        .eq('is_resolved', false);

      setAlertsCount(alertsCount || 0);

    } catch (err) {
      console.error('Error fetching notification counts:', err);
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home, badge: alertsCount },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'Tasks', href: '/tasks', icon: Clock, badge: pendingTasksCount },
    { name: 'Documents', href: '/documents', icon: Upload },
    { name: 'Services', href: '/services', icon: Target },
    { name: 'Cross Assignments', href: '/cross-assignments', icon: Users },
    { name: 'Content', href: '/content', icon: FileText },
    { name: 'Availability', href: '/availability', icon: Calendar },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const handleSignOut = () => {
    // Implement sign out logic
    window.location.href = window.location.origin;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C19</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Consultant</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const hasBadge = item.badge && item.badge > 0;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    {hasBadge && (
                      <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info & Sign Out */}
        <div className="p-4 border-t border-gray-200">
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-900">Consultant</p>
            <p className="text-xs text-gray-500">consultant@consulting19.com</p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-200 w-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-semibold text-gray-900">Consultant Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Consultant Panel</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ConsultantLayout;
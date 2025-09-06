import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Users, 
  CheckSquare, 
  FileText, 
  Briefcase, 
  Calendar,
  Settings, 
  LogOut,
  Bell,
  MessageSquare,
  DollarSign
} from 'lucide-react';
import { useAuth } from '@consulting19/shared';
import ConsultantSyncManager from '../ConsultantSyncManager';

interface ConsultantLayoutProps {
  children: React.ReactNode;
}

const ConsultantLayout: React.FC<ConsultantLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user, profile } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Documents', href: '/documents', icon: FileText },
    { name: 'Services', href: '/services', icon: Briefcase },
    { name: 'Availability', href: '/availability', icon: Calendar },
    { name: 'Commissions', href: '/commissions', icon: DollarSign },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getDisplayName = () => {
    if (profile?.display_name) return profile.display_name;
    if (profile?.full_name) return profile.full_name;
    if (user?.email) return user.email.split('@')[0];
    return 'Consultant';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sync Manager for real-time updates */}
      <ConsultantSyncManager 
        onNotification={(notification) => {
          setNotificationCount(prev => prev + 1);
          setTimeout(() => setNotificationCount(prev => Math.max(0, prev - 1)), 5000);
        }}
      />

      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C19</span>
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">Consultant</span>
              <div className="text-sm text-gray-500">Welcome, {getDisplayName()}</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 shadow-md'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info & Controls */}
        <div className="p-4 border-t border-gray-200 space-y-4">
          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">
                {getDisplayName().charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{getDisplayName()}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold text-gray-900">Consultant Portal</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notification Bell */}
              <div className="relative">
                <button className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  notificationCount > 0 
                    ? 'bg-red-100 hover:bg-red-200 text-red-600 animate-pulse' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}>
                  <Bell className="w-5 h-5" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>Clients</span>
                </div>
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-4 h-4" />
                  <span>Revenue</span>
                </div>
              </div>
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
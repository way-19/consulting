import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@consulting19/shared';
import {
  Home,
  Users,
  CheckSquare,
  FileText,
  MessageSquare,
  Calendar,
  Settings,
  LogOut,
  Briefcase,
  Target,
  BarChart3,
  DollarSign,
  Globe,
  Bot,
  FolderOpen,
  CreditCard,
  HelpCircle,
  Mail,
  Bell
} from 'lucide-react';
import ConsultantDashboard from './pages/consultant/ConsultantDashboard';
import ConsultantClients from './pages/consultant/ConsultantClients';
import ConsultantTasks from './pages/consultant/ConsultantTasks';
import ConsultantDocuments from './pages/consultant/ConsultantDocuments';
import ConsultantServices from './pages/consultant/ConsultantServices';
import ConsultantMessages from './pages/consultant/ConsultantMessages';
import ConsultantFinancialDashboard from './pages/consultant/ConsultantFinancialDashboard';
import ConsultantAvailability from './pages/consultant/ConsultantAvailability';
import ConsultantCrossAssignments from './pages/consultant/ConsultantCrossAssignments';
import ConsultantContent from './pages/consultant/ConsultantContent';
import ConsultantSettings from './pages/consultant/ConsultantSettings';
import ConsultantSyncManager from './components/ConsultantSyncManager';
import { supabase } from '@consulting19/shared/lib/supabase';

const LogoutButton = () => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = 'http://localhost:5173';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-200 w-full"
    >
      <LogOut className="w-5 h-5" />
      <span className="font-medium">Logout</span>
    </button>
  );
};

const ConsultantRoutes = () => {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    if (user && profile?.role === 'consultant') {
      fetchUnreadNotifications();
    }
  }, [user, profile, location.pathname]);

  const fetchUnreadNotifications = async () => {
    try {
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('recipient_profile_id', user?.id)
        .is('read_at', null);

      setUnreadNotifications(count || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
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
            <li>
              <Link
                to="/"
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  location.pathname === '/' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/clients"
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  location.pathname === '/clients' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Users className="w-5 h-5" />
                <span className="font-medium">Clients</span>
              </Link>
            </li>
            <li>
              <Link
                to="/tasks"
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 relative ${
                  location.pathname === '/tasks' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <CheckSquare className="w-5 h-5" />
                <span className="font-medium">Tasks</span>
                {unreadNotifications > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </Link>
            </li>
            <li>
              <Link
                to="/documents"
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  location.pathname === '/documents' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span className="font-medium">Documents</span>
              </Link>
            </li>
            <li>
              <Link
                to="/services"
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  location.pathname === '/services' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Briefcase className="w-5 h-5" />
                <span className="font-medium">Services</span>
              </Link>
            </li>
            <li>
              <Link
                to="/messages"
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  location.pathname === '/messages' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                <span className="font-medium">Messages</span>
              </Link>
            </li>
            <li>
              <Link
                to="/financial"
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  location.pathname === '/financial' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <DollarSign className="w-5 h-5" />
                <span className="font-medium">Financial</span>
              </Link>
            </li>
            <li>
              <Link
                to="/availability"
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  location.pathname === '/availability' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Calendar className="w-5 h-5" />
                <span className="font-medium">Availability</span>
              </Link>
            </li>
            <li>
              <Link
                to="/cross-assignments"
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  location.pathname === '/cross-assignments' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Target className="w-5 h-5" />
                <span className="font-medium">Cross Assignments</span>
              </Link>
            </li>
            <li>
              <Link
                to="/content"
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  location.pathname === '/content' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span className="font-medium">Content</span>
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  location.pathname === '/settings' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">Settings</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* User Info & Sign Out */}
        <div className="p-4 border-t border-gray-200">
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-900">{profile?.full_name || user?.user_metadata?.full_name || 'Consultant'}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <LogoutButton />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-semibold text-gray-900">Consultant Dashboard</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </div>
              <button
                onClick={async () => {
                  try {
                    await signOut();
                    window.location.href = 'http://localhost:5173';
                  } catch (error) {
                    console.error('Error signing out:', error);
                  }
                }}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-200 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<ConsultantDashboard />} />
            <Route path="/clients" element={<ConsultantClients />} />
            <Route path="/tasks" element={<ConsultantTasks />} />
            <Route path="/documents" element={<ConsultantDocuments />} />
            <Route path="/services" element={<ConsultantServices />} />
            <Route path="/messages" element={<ConsultantMessages />} />
            <Route path="/financial" element={<ConsultantFinancialDashboard />} />
            <Route path="/availability" element={<ConsultantAvailability />} />
            <Route path="/cross-assignments" element={<ConsultantCrossAssignments />} />
            <Route path="/content" element={<ConsultantContent />} />
            <Route path="/settings" element={<ConsultantSettings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Sync Manager */}
      <ConsultantSyncManager />
    </div>
  );
};

export default ConsultantRoutes;
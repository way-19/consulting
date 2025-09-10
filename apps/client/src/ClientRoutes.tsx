import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { 
  Home,
  FolderOpen,
  CheckSquare,
  FileText, 
  MessageSquare,
  Calendar,
  Settings, 
  LogOut,
  CreditCard,
  Upload,
  HardDrive,
  Mail,
  BarChart3,
  HelpCircle,
  TrendingUp,
  Target
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth, NotificationBell } from '@consulting19/shared';

// Import pages
import ClientDashboard from './pages/client/ClientDashboard';
import ClientProjects from './pages/client/ClientProjects';
import ClientProjectDetails from './pages/client/ClientProjectDetails';
import ClientTasks from './pages/client/ClientTasks';
import ClientMessages from './pages/client/ClientMessages';
import ClientFileManager from './pages/client/ClientFileManager';
import ClientMailbox from './pages/client/ClientMailbox';
import ClientAccounting from './pages/client/ClientAccounting';
import ClientServices from './pages/client/ClientServices';
import ClientBilling from './pages/client/ClientBilling';
import ClientProgressTracking from './pages/client/ClientProgressTracking';
import ClientSupport from './pages/client/ClientSupport';
import ClientSettings from './pages/client/ClientSettings';
import ClientOnboarding from './pages/client/ClientOnboarding';

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

const ClientRoutes = () => {
  const { user, profile } = useAuth();
  const location = useLocation();
  
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
            <span className="text-xl font-bold text-gray-900">Client Portal</span>
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
                to="/projects"
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  location.pathname.startsWith('/projects') ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FolderOpen className="w-5 h-5" />
                <span className="font-medium">Projects</span>
              </Link>
            </li>
            <li>
              <Link
                to="/tasks"
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  location.pathname === '/tasks' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <CheckSquare className="w-5 h-5" />
                <span className="font-medium">Tasks</span>
              </Link>
            </li>
            <li>
              <Link
                to="/services"
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  location.pathname === '/services' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Target className="w-5 h-5" />
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
                to="/file-manager"
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  location.pathname === '/file-manager' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <HardDrive className="w-5 h-5" />
                <span className="font-medium">File Manager</span>
              </Link>
            </li>
            <li>
              <Link
                to="/mailbox"
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  location.pathname === '/mailbox' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Mail className="w-5 h-5" />
                <span className="font-medium">Mailbox</span>
              </Link>
            </li>
            <li>
              <Link
                to="/accounting"
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  location.pathname === '/accounting' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                <span className="font-medium">Accounting</span>
              </Link>
            </li>
            <li>
              <Link
                to="/billing"
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  location.pathname === '/billing' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span className="font-medium">Billing</span>
              </Link>
            </li>
            <li>
              <Link
                to="/progress"
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  location.pathname === '/progress' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <TrendingUp className="w-5 h-5" />
                <span className="font-medium">Progress</span>
              </Link>
            </li>
            <li>
              <Link
                to="/support"
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  location.pathname === '/support' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <HelpCircle className="w-5 h-5" />
                <span className="font-medium">Support</span>
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
            <p className="text-sm font-medium text-gray-900">{profile?.full_name || user?.user_metadata?.full_name || 'Client'}</p>
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
            <h1 className="text-lg font-semibold text-gray-900">Client Portal</h1>
            <div className="flex items-center space-x-4">
              <NotificationBell />
              <span className="text-sm text-gray-600">Client Dashboard</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<ClientDashboard />} />
            <Route path="/onboarding" element={<ClientOnboarding />} />
            <Route path="/projects" element={<ClientProjects />} />
            <Route path="/projects/:projectId" element={<ClientProjectDetails />} />
            <Route path="/tasks" element={<ClientTasks />} />
            <Route path="/services" element={<ClientServices />} />
            <Route path="/messages" element={<ClientMessages />} />
            <Route path="/file-manager" element={<ClientFileManager />} />
            <Route path="/mailbox" element={<ClientMailbox />} />
            <Route path="/accounting" element={<ClientAccounting />} />
            <Route path="/billing" element={<ClientBilling />} />
            <Route path="/progress" element={<ClientProgressTracking />} />
            <Route path="/support" element={<ClientSupport />} />
            <Route path="/settings" element={<ClientSettings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default ClientRoutes;
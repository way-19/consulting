// apps/client/src/ClientRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { 
  Home,
  FolderOpen,
  CheckSquare,
  FileText, 
  MessageSquare,
  Calendar,
  CreditCard,
  Settings, 
  LogOut, 
  Briefcase,
  HelpCircle,
  Mail,
  BarChart3,
  DollarSign
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@consulting19/shared';
import { useTranslation } from 'react-i18next';
import LoginPage from './pages/auth/LoginPage';
import ClientDashboard from './pages/client/ClientDashboard';
import ClientProjects from './pages/client/ClientProjects';
import ClientTasks from './pages/client/ClientTasks';
import ClientDocuments from './pages/client/ClientDocuments';
import ClientServices from './pages/client/ClientServices';
import ClientMessages from './pages/client/ClientMessages';
import ClientBilling from './pages/client/ClientBilling';
import ClientSettings from './pages/client/ClientSettings';
import ClientOnboarding from './pages/client/ClientOnboarding';
import ClientAccounting from './pages/client/ClientAccounting';
import ClientCalendar from './pages/client/ClientCalendar';
import ClientFileManager from './pages/client/ClientFileManager';
import ClientMailbox from './pages/client/ClientMailbox';
import ClientProgressTracking from './pages/client/ClientProgressTracking';
import ClientProjectDetails from './pages/client/ClientProjectDetails';
import ClientSupport from './pages/client/ClientSupport';

const ClientRoutes = () => {
  return (
    <ProtectedClientRoutes />
  );
};

const ProtectedClientRoutes = () => {
  const { user, loading } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-xl">C19</span>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
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
                <span className="font-medium">{t('navigation.dashboard')}</span>
              </Link>
            </li>
            <li>
              <Link
                to="/projects"
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  location.pathname === '/projects' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FolderOpen className="w-5 h-5" />
                <span className="font-medium">{t('navigation.projects')}</span>
              </Link>
            </li>
            <li>
              <Link
                to="/tasks"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                <CheckSquare className="w-5 h-5" />
                <span className="font-medium">Tasks</span>
              </Link>
            </li>
            <li>
              <Link
                to="/documents"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                <FileText className="w-5 h-5" />
                <span className="font-medium">Documents</span>
              </Link>
            </li>
            <li>
              <Link
                to="/services"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
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
                <span className="font-medium">{t('navigation.messages')}</span>
              </Link>
            </li>
            <li>
              <Link
                to="/meetings"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                <Calendar className="w-5 h-5" />
                <span className="font-medium">Meetings</span>
              </Link>
            </li>
            <li>
              <Link
                to="/billing"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                <CreditCard className="w-5 h-5" />
                <span className="font-medium">Billing</span>
              </Link>
            </li>
            <li>
              <Link
                to="/accounting"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                <DollarSign className="w-5 h-5" />
                <span className="font-medium">Accounting</span>
              </Link>
            </li>
            <li>
              <Link
                to="/file-manager"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                <FolderOpen className="w-5 h-5" />
                <span className="font-medium">File Manager</span>
              </Link>
            </li>
            <li>
              <Link
                to="/mailbox"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                <Mail className="w-5 h-5" />
                <span className="font-medium">Mailbox</span>
              </Link>
            </li>
            <li>
              <Link
                to="/progress"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                <BarChart3 className="w-5 h-5" />
                <span className="font-medium">Progress</span>
              </Link>
            </li>
            <li>
              <Link
                to="/support"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                <HelpCircle className="w-5 h-5" />
                <span className="font-medium">Support</span>
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
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
            <p className="text-sm font-medium text-gray-900">{user?.user_metadata?.full_name || t('navigation.client')}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <button
            onClick={async () => {
              try {
                const { signOut } = useAuth();
                await signOut();
                window.location.href = 'http://localhost:5173';
              } catch (error) {
                console.error('Error signing out:', error);
              }
            }}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-200 w-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">{t('navigation.logout')}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-semibold text-gray-900">{t('dashboard.title')}</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Client Dashboard</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
      <Routes>
        <Route path="/" element={<ClientDashboard />} />
        <Route path="/projects" element={<ClientProjects />} />
        <Route path="/projects/:projectId" element={<ClientProjectDetails />} />
        <Route path="/tasks" element={<ClientTasks />} />
        <Route path="/documents" element={<ClientDocuments />} />
        <Route path="/services" element={<ClientServices />} />
        <Route path="/messages" element={<ClientMessages />} />
        <Route path="/meetings" element={<ClientCalendar />} />
        <Route path="/billing" element={<ClientBilling />} />
        <Route path="/settings" element={<ClientSettings />} />
        <Route path="/onboarding" element={<ClientOnboarding />} />
        <Route path="/accounting" element={<ClientAccounting />} />
        <Route path="/file-manager" element={<ClientFileManager />} />
        <Route path="/mailbox" element={<ClientMailbox />} />
        <Route path="/progress" element={<ClientProgressTracking />} />
        <Route path="/support" element={<ClientSupport />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
        </main>
      </div>
    </div>
  );
};

export default ClientRoutes;

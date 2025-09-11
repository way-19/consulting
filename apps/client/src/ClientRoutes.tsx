import React from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
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
  BarChart3,
  HardDrive,
  Mail,
  TrendingUp,
  HelpCircle
} from 'lucide-react';
import { useAuth, NotificationBell } from '@consulting19/shared';
import ClientDashboard from './pages/client/ClientDashboard';
import ClientProjects from './pages/client/ClientProjects';
import ClientProjectDetails from './pages/client/ClientProjectDetails';
import ClientTasks from './pages/client/ClientTasks';
import ClientServices from './pages/client/ClientServices';
import ClientMessages from './pages/client/ClientMessages';
import ClientBilling from './pages/client/ClientBilling';
import ClientAccounting from './pages/client/ClientAccounting';
import ClientFileManager from './pages/client/ClientFileManager';
import ClientMailbox from './pages/client/ClientMailbox';
import ClientProgressTracking from './pages/client/ClientProgressTracking';
import ClientCalendar from './pages/client/ClientCalendar';
import ClientSupport from './pages/client/ClientSupport';
import ClientSettings from './pages/client/ClientSettings';
import ClientOnboarding from './pages/client/ClientOnboarding';
import AIAssistant from './components/AIAssistant';
import MobileNavigation from './components/MobileNavigation';

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
  const [showAIAssistant, setShowAIAssistant] = React.useState(false);
  const [aiMinimized, setAiMinimized] = React.useState(false);

  // Check if user should go through onboarding
  const needsOnboarding = React.useMemo(() => {
    if (!profile) return false;
    
    // Simple onboarding check - if profile is incomplete or no consultant assigned
    const profileIncomplete = !profile.full_name || !profile.phone;
    const isNewUser = new Date().getTime() - new Date(profile.created_at).getTime() < 48 * 60 * 60 * 1000; // 48 hours
    
    return isNewUser && profileIncomplete;
  }, [profile]);

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
            <span className="text-xl font-bold text-gray-900">Client</span>
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
                <FileText className="w-5 h-5" />
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
                to="/meetings"
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  location.pathname === '/meetings' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Calendar className="w-5 h-5" />
                <span className="font-medium">Meetings</span>
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
              <button
                onClick={() => setShowAIAssistant(true)}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="AI Assistant"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">AI Assistant</span>
              </button>
              <NotificationBell />
              <span className="text-sm text-gray-600">Client Panel</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={needsOnboarding ? <ClientOnboarding /> : <ClientDashboard />} />
            <Route path="/onboarding" element={<ClientOnboarding />} />
            <Route path="/projects" element={<ClientProjects />} />
            <Route path="/projects/:projectId" element={<ClientProjectDetails />} />
            <Route path="/tasks" element={<ClientTasks />} />
            <Route path="/services" element={<ClientServices />} />
            <Route path="/messages" element={<ClientMessages />} />
            <Route path="/meetings" element={<ClientCalendar />} />
            <Route path="/billing" element={<ClientBilling />} />
            <Route path="/accounting" element={<ClientAccounting />} />
            <Route path="/file-manager" element={<ClientFileManager />} />
            <Route path="/mailbox" element={<ClientMailbox />} />
            <Route path="/progress" element={<ClientProgressTracking />} />
            <Route path="/support" element={<ClientSupport />} />
            <Route path="/settings" element={<ClientSettings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <MobileNavigation />
      </div>

      {/* AI Assistant */}
      <AIAssistant 
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
        onMinimize={() => setAiMinimized(!aiMinimized)}
        isMinimized={aiMinimized}
      />
    </div>
  );
};

export default ClientRoutes;
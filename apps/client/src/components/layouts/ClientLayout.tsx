import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  MessageCircle, 
  CreditCard, 
  Settings, 
  LogOut, 
  FolderOpen, 
  CheckSquare, 
  Briefcase, 
  FolderOpen as FilesIcon,
  User,
  Calendar,
  HelpCircle,
  Mail,
  Bell as BellIcon,
  Globe,
  ChevronDown
} from 'lucide-react';
import { useAuth, supabase } from '@consulting19/shared';
import NotificationCenter from '../NotificationCenter';

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { signOut, user, profile } = useAuth();
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
  ];

  const currentLang = languages[0]; // Default to English

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Projects', href: '/projects', icon: FolderOpen },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Accounting', href: '/documents', icon: FileText },
    { name: 'Mailbox', href: '/mailbox', icon: Mail },
    { name: 'Files', href: '/files', icon: FilesIcon },
    { name: 'Services', href: '/services', icon: Briefcase },
    { name: 'Messages', href: '/messages', icon: MessageCircle },
    { name: 'Billing', href: '/billing', icon: CreditCard },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Support', href: '/support', icon: HelpCircle },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = 'http://localhost:5173';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleLanguageChange = (languageCode: string) => {
    setLanguageDropdownOpen(false);
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
            <span className="text-xl font-bold text-gray-900">Client Dashboard</span>
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
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
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

        {/* User Info & Sign Out */}
        <div className="p-4 border-t border-gray-200">
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-900">
              {profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Client'}
            </p>
            <p className="text-xs text-gray-500">{user?.email}</p>
            {profile?.assigned_consultant_id && (
              <p className="text-xs text-blue-600 mt-1">Consultant assigned</p>
            )}
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
            <div></div>
            <div className="flex items-center space-x-4">
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  className="relative w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors group"
                >
                  <BellIcon className="w-5 h-5 text-gray-600 group-hover:text-gray-700" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                  )}
                </button>
                
                <NotificationCenter
                  isOpen={notificationOpen}
                  onClose={() => setNotificationOpen(false)}
                  onBadgeUpdate={setNotificationCount}
                />
              </div>

              {/* Language Switcher */}
              <div className="relative">
                <span className="text-sm text-gray-600">🇺🇸 EN</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>

      {/* Backdrop for dropdown */}
      {(languageDropdownOpen || notificationOpen) && (
        <div 
          className="fixed inset-0 z-40 bg-transparent" 
          onClick={() => {
            setLanguageDropdownOpen(false);
            setNotificationOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default ClientLayout;
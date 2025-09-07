// apps/client/src/components/layouts/ClientLayout.tsx
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
  User,
  Calendar,
  HelpCircle,
  Mail, // Mailbox için
  BarChart3, // Progress Tracking için
  DollarSign, // Accounting için
  Bell
} from 'lucide-react';
import { useAuth } from '@consulting19/shared';
import { useI18n } from '../../hooks/useI18n';
import NotificationCenter from '../NotificationCenter';

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { signOut, user } = useAuth();
  const { t } = useI18n();
  const [showNotifications, setShowNotifications] = useState(false);

  const navigation = [
    { name: t('navigation.dashboard'), href: '/client', icon: Home },
    { name: t('navigation.projects'), href: '/client/projects', icon: FolderOpen },
    { name: t('navigation.tasks'), href: '/client/tasks', icon: CheckSquare },
    { name: t('navigation.documents'), href: '/client/documents', icon: FileText },
    { name: t('navigation.services'), href: '/client/services', icon: Briefcase },
    { name: t('navigation.messages'), href: '/client/messages', icon: MessageCircle },
    { name: t('navigation.meetings'), href: '/client/meetings', icon: Calendar },
    { name: t('navigation.billing'), href: '/client/billing', icon: CreditCard },
    { name: t('navigation.accounting'), href: '/client/accounting', icon: DollarSign },
    { name: t('navigation.fileManager'), href: '/client/file-manager', icon: FolderOpen },
    { name: t('navigation.mailbox'), href: '/client/mailbox', icon: Mail },
    { name: t('navigation.progressTracking'), href: '/client/progress', icon: BarChart3 },
    { name: t('navigation.support'), href: '/client/support', icon: HelpCircle },
    { name: t('navigation.settings'), href: '/client/settings', icon: Settings },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = 'http://localhost:5173';
    } catch (error) {
      console.error('Error signing out:', error);
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
            <span className="text-xl font-bold text-gray-900">{t('dashboard.title')}</span>
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
            <p className="text-sm font-medium text-gray-900">{user?.user_metadata?.full_name || t('navigation.client')}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <button
            onClick={handleSignOut}
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
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>
                <NotificationCenter 
                  isOpen={showNotifications} 
                  onClose={() => setShowNotifications(false)} 
                />
              </div>
              <span className="text-sm text-gray-600">Client Dashboard</span>
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

export default ClientLayout;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Settings, Users, FileText, LogOut, Clock, Upload, Calendar } from 'lucide-react';
import { useAuth } from '@consulting19/shared';
import { useTranslation } from '../../hooks/useTranslation';
import LanguageSelector from '../LanguageSelector';

interface ConsultantLayoutProps {
  children: React.ReactNode;
}

const ConsultantLayout: React.FC<ConsultantLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { signOut, user } = useAuth();
  const { t } = useTranslation();

  const navigation = [
    { name: t('navigation.dashboard'), href: '/consultant', icon: Home },
    { name: t('navigation.clients'), href: '/consultant/clients', icon: Users },
    { name: t('navigation.tasks'), href: '/consultant/tasks', icon: Clock },
    { name: t('navigation.documents'), href: '/consultant/documents', icon: Upload },
    { name: t('navigation.availability'), href: '/consultant/availability', icon: Calendar },
    { name: t('navigation.settings'), href: '/consultant/settings', icon: Settings },
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
            <LanguageSelector />
          </div>
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-900">{user?.user_metadata?.full_name || t('dashboard.title')}</p>
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
              <span className="text-sm text-gray-600">Consultant Dashboard</span>
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
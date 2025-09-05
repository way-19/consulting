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
  Mail,
  Bell,
  Globe,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '@consulting19/shared';
import { useTranslation } from 'react-i18next';
import NotificationCenter from '../NotificationCenter';

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { signOut, user, profile } = useAuth();
  const { t, i18n } = useTranslation();
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
  ];

  const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];

  // Fetch unread notification count
  React.useEffect(() => {
    if (user) {
      const fetchUnreadCount = async () => {
        try {
          const { count, error } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('recipient_profile_id', user.id)
            .is('read_at', null);

          if (!error) {
            setUnreadCount(count || 0);
          }
        } catch (err) {
          console.error('Error fetching notification count:', err);
        }
      };

      fetchUnreadCount();
      
      // Setup realtime subscription for notification updates
      const channel = supabase
        .channel('notification-count')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notifications',
            filter: `recipient_profile_id=eq.${user.id}`
          },
          () => {
            fetchUnreadCount();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Projects', href: '/projects', icon: FolderOpen },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Accounting', href: '/documents', icon: FileText },
    { name: 'Mailbox', href: '/mailbox', icon: Mail },
    { name: 'Services', href: '/services', icon: Briefcase },
    { name: 'Messages', href: '/messages', icon: MessageCircle },
    { name: 'Billing', href: '/billing', icon: CreditCard },
    { name: 'Support', href: '/support', icon: HelpCircle },
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
    i18n.changeLanguage(languageCode);
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
              {/* Language Switcher */}
              <div className="relative">
                <button 
                  onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-lg">{currentLang.flag}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                    languageDropdownOpen ? 'rotate-180' : ''
                  }`} />
                </button>
                
                {languageDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-100 z-50 overflow-hidden">
                    <div className="py-1">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageChange(lang.code)}
                          className={`w-full text-left px-3 py-2 hover:bg-blue-50 transition-colors flex items-center space-x-3 ${
                            i18n.language === lang.code 
                              ? 'bg-blue-50 text-blue-700' 
                              : 'text-gray-700'
                          }`}
                        >
                          <span className="text-lg">{lang.flag}</span>
                          <span className="font-medium">{lang.name}</span>
                          {i18n.language === lang.code && (
                            <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Notification Bell */}
              <div className="relative">
                <button 
                  onClick={() => setNotificationCenterOpen(!notificationCenterOpen)}
                  className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>
                <NotificationCenter 
                  isOpen={notificationCenterOpen} 
                  onClose={() => setNotificationCenterOpen(false)} 
                />
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
      {(languageDropdownOpen || notificationCenterOpen) && (
        <div 
          className="fixed inset-0 z-40 bg-transparent" 
          onClick={() => {
            setLanguageDropdownOpen(false);
            setNotificationCenterOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default ClientLayout;
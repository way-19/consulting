import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  FolderOpen, 
  CheckSquare, 
  FileText, 
  Mail, 
  ShoppingBag, 
  MessageSquare, 
  CreditCard, 
  Settings, 
  LogOut,
  Bell as BellIcon,
  Globe,
  ChevronDown,
  Calendar,
  BarChart3,
  Folder
} from 'lucide-react';
import { useAuth, supabase } from '@consulting19/shared';
import NotificationCenter from '../NotificationCenter';

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  const [lastPaymentAlert, setLastPaymentAlert] = useState<Date | null>(null);

  // Real-time connection status monitoring
  useEffect(() => {
    if (!user) return;

    // Monitor Supabase real-time connection
    const checkConnection = () => {
      setRealtimeConnected(supabase.realtime.isConnected());
    };

    // Check every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    checkConnection(); // Initial check

    // Setup payment due alerts (runs every hour in production)
    const paymentAlertCheck = setInterval(() => {
      checkForDuePayments();
    }, 60000); // Check every minute for demo

    return () => {
      clearInterval(interval);
      clearInterval(paymentAlertCheck);
    };
  }, [user]);

  const checkForDuePayments = async () => {
    try {
      // Get client ID
      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', user?.id)
        .single();

      if (!clientData) return;

      // Check for due payments (next 24 hours)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const { data: dueInvoices } = await supabase
        .from('invoices')
        .select(`
          *,
          service_order:service_orders(title)
        `)
        .eq('client_id', clientData.id)
        .eq('status', 'pending')
        .lte('due_date', tomorrow.toISOString())
        .limit(5);

      // Show browser notification for urgent payments
      if (dueInvoices && dueInvoices.length > 0) {
        const now = new Date();
        const shouldAlert = !lastPaymentAlert || 
          (now.getTime() - lastPaymentAlert.getTime()) > 4 * 60 * 60 * 1000; // 4 hours

        if (shouldAlert && 'Notification' in window) {
          Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
              new Notification('💳 Payment Due Soon', {
                body: `${dueInvoices.length} invoice(s) due within 24 hours`,
                icon: '/favicon.svg',
                tag: 'payment-due'
              });
              setLastPaymentAlert(now);
            }
          });
        }

        // Update notification badge
        setNotificationCount(prev => prev + dueInvoices.length);
      }
    } catch (err) {
      console.error('Error checking due payments:', err);
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Projects', href: '/projects', icon: FolderOpen },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Accounting', href: '/documents', icon: FileText },
    { name: 'Mailbox', href: '/mailbox', icon: Mail },
    { name: 'Services', href: '/services', icon: ShoppingBag },
    { name: 'Messages', href: '/messages', icon: MessageSquare },
    { name: 'Billing', href: '/billing', icon: CreditCard },
    { name: 'File Manager', href: '/files', icon: Folder },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Progress', href: '/progress', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
  ];

  const currentLanguage = languages[0]; // Default to English for now

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Get display name
  const getDisplayName = () => {
    if (profile?.display_name) return profile.display_name;
    if (profile?.full_name) return profile.full_name;
    if (user?.email) return user.email.split('@')[0];
    return 'Client';
  };

  useEffect(() => {
    if (user) {
      fetchNotificationCount();
      setupNotificationSubscription();
    }
  }, [user]);

  const fetchNotificationCount = async () => {
    try {
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('recipient_profile_id', user?.id)
        .is('read_at', null);
      
      setNotificationCount(count || 0);
    } catch (err) {
      console.error('Error fetching notification count:', err);
    }
  };

  const setupNotificationSubscription = () => {
    const channel = supabase
      .channel('user-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_profile_id=eq.${user?.id}`
        },
        () => {
          fetchNotificationCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C19</span>
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">Client Portal</span>
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
              <h1 className="text-lg font-semibold text-gray-900">Client Portal</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notification Bell */}
              <div className="relative">
                {/* Real-time Connection Status */}
                <div className="absolute -top-2 -left-2">
                  <div className={`w-3 h-3 rounded-full ${
                    realtimeConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                  }`} title={realtimeConnected ? 'Connected' : 'Disconnected'}></div>
                </div>
                
                <button
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group ${
                    notificationCount > 0 
                      ? 'bg-red-100 hover:bg-red-200 text-red-600 animate-pulse' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
                >
                  <BellIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce shadow-lg">
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                  )}
                </button>
                
                <NotificationCenter 
                  isOpen={notificationOpen} 
                  onClose={() => setNotificationOpen(false)} 
                />
              </div>

              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Globe className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{currentLanguage.flag}</span>
                  <ChevronDown className="w-3 h-3 text-gray-600" />
                </button>
                
                {languageDropdownOpen && (
                  <div className="absolute top-12 right-0 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          // Language switching logic here
                          setLanguageDropdownOpen(false);
                        }}
                        className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 transition-colors w-full text-left"
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span className="text-sm font-medium text-gray-700">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
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

export default ClientLayout;
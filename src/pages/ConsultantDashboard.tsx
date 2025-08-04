import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, useLocation, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

// Components
import ConsultantAccountingModule from '../components/consultant/accounting/ConsultantAccountingModule';
import PerformanceHub from '../components/consultant/dashboard/PerformanceHub';
import LegacyOrderManager from '../components/consultant/dashboard/LegacyOrderManager';
import QuickActions from '../components/consultant/dashboard/QuickActions';
import CountryBasedClients from '../components/consultant/dashboard/CountryBasedClients';
import CustomServiceManager from '../components/consultant/dashboard/CustomServiceManager';
import ConsultantMessagingModule from '../components/consultant/messaging/ConsultantMessagingModule';
import ConsultantToAdminMessaging from '../components/consultant/messaging/ConsultantToAdminMessaging';
import CountryContentManager from '../components/consultant/dashboard/CountryContentManager';
import NotificationDropdown from '../components/shared/NotificationDropdown';
import UserSettingsModal from '../components/shared/UserSettingsModal';
import { useNotifications } from '../hooks/useNotifications';

import { 
  Users, 
  LogOut, 
  Settings, 
  Bell, 
  BarChart3,
  MessageSquare,
  Calculator,
  FileText,
  DollarSign,
  Globe,
  Package,
  Shield,
  Menu,
  X
} from 'lucide-react';

const ConsultantDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [consultant, setConsultant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Use notifications hook
  const { unreadCount } = useNotifications(consultant?.id || '');

  const navigation = [
    { name: 'Performans Merkezi', href: '/consultant-dashboard/performance', icon: BarChart3 },
    { name: 'Müşteri Mesajları', href: '/consultant-dashboard/messages', icon: MessageSquare },
    { name: 'Muhasebe Yönetimi', href: '/consultant-dashboard/accounting', icon: Calculator },
    { name: 'Özel Hizmetler', href: '/consultant-dashboard/custom-services', icon: DollarSign },
    { name: 'Ülke Bazlı Müşteriler', href: '/consultant-dashboard/country-clients', icon: Users },
    { name: 'Legacy Siparişler', href: '/consultant-dashboard/legacy-orders', icon: Package },
    { name: 'Ülke İçerik Yönetimi', href: '/consultant-dashboard/country-content', icon: Globe },
    { name: 'Admin İletişimi', href: '/consultant-dashboard/admin-messages', icon: Shield },
  ];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (!userData) {
          window.location.href = '/login';
          return;
        }

        const user = JSON.parse(userData);
        if (user.role !== 'consultant') {
          window.location.href = '/unauthorized';
          return;
        }

        // Load full consultant data from database
        const { data: consultantData } = await supabase
          .from('users')
          .select(`
            *,
            countries(name, flag_emoji)
          `)
          .eq('id', user.id)
          .maybeSingle();

        setConsultant(consultantData || user);
      } catch (error) {
        console.error('Error checking auth:', error);
        window.location.href = '/login';
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // Redirect to performance if on base consultant path
  useEffect(() => {
    if (consultant && location.pathname === '/consultant-dashboard') {
      navigate('/consultant-dashboard/performance', { replace: true });
    }
  }, [consultant, location.pathname, navigate]);

  const handleLogout = async () => {
    localStorage.removeItem('user');
    await new Promise(resolve => setTimeout(resolve, 100));
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Danışman panosu yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!consultant) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - ALWAYS VISIBLE */}
      <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {/* HAMBURGER MENU BUTTON - BÜYÜK VE GÖRÜNÜR */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-3 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 mr-4 border-2 border-blue-500 bg-blue-50"
                title="Menüyü Aç/Kapat"
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mr-3">
                <Users className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Danışman Panosu</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 relative"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setShowSettings(true)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <Settings className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-700">
                    {consultant?.first_name} {consultant?.last_name}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center">
                    <span className="mr-1">{consultant?.countries?.flag_emoji || '🌍'}</span>
                    {consultant?.countries?.name || 'Global'}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Çıkış</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT WITH SIDEBAR */}
      <div className="flex pt-16">
        {/* SIDEBAR - ALWAYS VISIBLE WHEN OPEN */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden`}>
          <div className="w-64 bg-white shadow-lg h-screen fixed top-16 left-0 z-40 border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Danışman Menüsü
                </h3>
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <p className="text-xs text-blue-800 font-medium">
                    🎯 Tüm modüller aktif ve çalışır durumda!
                  </p>
                </div>
              </div>
            </div>
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-6 py-3 transition-colors border-r-4 ${
                    location.pathname === item.href
                      ? 'bg-blue-50 text-blue-700 border-blue-500 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50 border-transparent hover:border-gray-300'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium text-sm">{item.name}</span>
                </Link>
              ))}
            </nav>
            
            {/* Sidebar Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 border-t border-gray-200">
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  {consultant?.countries?.flag_emoji} {consultant?.countries?.name || 'Global'} Danışmanı
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {consultant?.first_name} {consultant?.last_name}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-0'} p-8 transition-all duration-300`}>
          <Routes>
            <Route path="/performance" element={
              <div className="space-y-8">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Performans Merkezi</h2>
                  <p className="text-gray-600">
                    Müşterilerinizi yönetin, gelir takibi yapın ve danışmanlık işinizi büyütün
                  </p>
                </div>

                <PerformanceHub consultantId={consultant.id} />
                <QuickActions consultantId={consultant.id} />
              </div>
            } />
            
            <Route path="/messages" element={
              <div className="space-y-8">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Müşteri Mesajları</h2>
                  <p className="text-gray-600">
                    Müşterilerinizle iletişim kurun ve mesajları yönetin
                  </p>
                </div>
                <ConsultantMessagingModule consultantId={consultant.id} />
              </div>
            } />
            
            <Route path="/accounting" element={
              <div className="space-y-8">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Muhasebe Yönetimi</h2>
                  <p className="text-gray-600">
                    Müşteri belgelerini yönetin ve muhasebe süreçlerini takip edin
                  </p>
                </div>
                <ConsultantAccountingModule consultantId={consultant.id} />
              </div>
            } />
            
            <Route path="/custom-services" element={
              <div className="space-y-8">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Özel Hizmetlerim</h2>
                  <p className="text-gray-600">
                    Kendi hizmetlerinizi oluşturun ve müşterilerinize önerin
                  </p>
                </div>
                <CustomServiceManager consultantId={consultant.id} />
              </div>
            } />
            
            <Route path="/country-clients" element={
              <div className="space-y-8">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Ülke Bazlı Müşteriler</h2>
                  <p className="text-gray-600">
                    Atandığınız ülkelerdeki müşterilerinizi görüntüleyin ve yönetin
                  </p>
                </div>
                <CountryBasedClients consultantId={consultant.id} />
              </div>
            } />
            
            <Route path="/legacy-orders" element={
              <div className="space-y-8">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Legacy Sipariş Yönetimi</h2>
                  <p className="text-gray-600">
                    Eski sistemden gelen siparişleri yönetin ve komisyonları takip edin
                  </p>
                </div>
                <LegacyOrderManager consultantId={consultant.id} />
              </div>
            } />
            
            <Route path="/admin-messages" element={
              <div className="space-y-8">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin İletişimi</h2>
                  <p className="text-gray-600">
                    Sistem yöneticileri ile iletişim kurun ve bildirimleri görüntüleyin
                  </p>
                </div>
                <ConsultantToAdminMessaging consultantId={consultant.id} />
              </div>
            } />
            
            <Route path="/country-content" element={
              <div className="space-y-8">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Ülke İçerik Yönetimi</h2>
                  <p className="text-gray-600">
                    Atandığınız ülkelerin frontend içeriğini yönetin
                  </p>
                </div>
                <CountryContentManager consultantId={consultant.id} />
              </div>
            } />
          </Routes>
        </div>
      </div>

      {/* Notification Dropdown */}
      {showNotifications && (
        <div className="fixed top-16 right-4 z-50">
          <NotificationDropdown
            userId={consultant.id}
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
          />
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <UserSettingsModal
          userId={consultant.id}
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};

export default ConsultantDashboard;
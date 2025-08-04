import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, useLocation, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { safeNavigate } from '../lib/safeNavigate';

// Components
import PerformanceHub from '../components/consultant/dashboard/PerformanceHub';
import LegacyOrderManager from '../components/consultant/dashboard/LegacyOrderManager';
import QuickActions from '../components/consultant/dashboard/QuickActions';
import CountryBasedClients from '../components/consultant/dashboard/CountryBasedClients';
import CustomServiceManager from '../components/consultant/dashboard/CustomServiceManager';
import ConsultantMessagingModule from '../components/consultant/messaging/ConsultantMessagingModule';
import ConsultantToAdminMessaging from '../components/consultant/messaging/ConsultantToAdminMessaging';
import CountryContentManager from '../components/consultant/dashboard/CountryContentManager';
import ConsultantAccountingModule from '../components/consultant/accounting/ConsultantAccountingModule';
import NotificationDropdown from '../components/shared/NotificationDropdown';
import UserSettingsModal from '../components/shared/UserSettingsModal';
import { useNotifications } from '../hooks/useNotifications';

import { 
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
  X,
  Users
} from 'lucide-react';

interface ConsultantDashboardProps {
  country?: string;
}

const ConsultantDashboard: React.FC<ConsultantDashboardProps> = ({ country = 'global' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [consultant, setConsultant] = useState<any>(null);
  const [assignedCountry, setAssignedCountry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Use notifications hook
  const { unreadCount } = useNotifications(consultant?.id || '');

  // Dynamic navigation based on country
  const getNavigation = (country: string) => {
    const basePath = country === 'global' ? '/consultant-dashboard' : `/${country}/consultant-dashboard`;
    return [
      { name: 'Performans Merkezi', href: `${basePath}/performance`, icon: BarChart3 },
      { name: 'Müşteri Mesajları', href: `${basePath}/messages`, icon: MessageSquare },
      { name: 'Muhasebe Yönetimi', href: `${basePath}/accounting`, icon: Calculator },
      { name: 'Özel Hizmetler', href: `${basePath}/custom-services`, icon: DollarSign },
      { name: 'Ülke Müşterileri', href: `${basePath}/country-clients`, icon: Users },
      { name: 'Legacy Siparişler', href: `${basePath}/legacy-orders`, icon: Package },
      { name: 'İçerik Yönetimi', href: `${basePath}/country-content`, icon: Globe },
      { name: 'Admin İletişimi', href: `${basePath}/admin-messages`, icon: Shield },
    ];
  };

  const navigation = getNavigation(country);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔍 Checking consultant auth...');
        const userData = localStorage.getItem('user');
        if (!userData) {
          console.log('❌ No user data found, redirecting to login');
          navigate('/login');
          return;
        }

        const user = JSON.parse(userData);
        console.log('👤 User data from localStorage:', user);
        
        if (user.role !== 'consultant') {
          console.log('❌ User is not a consultant, redirecting');
          navigate('/unauthorized');
          return;
        }

        console.log('🔍 Loading consultant data from database...');
        // Load full consultant data from database
        const { data: consultantData } = await supabase
          .from('users')
          .select(`
            *,
            countries!users_country_id_fkey(name, flag_emoji, slug),
            consultant_country_assignments!consultant_country_assignments_consultant_id_fkey(
              countries!consultant_country_assignments_country_id_fkey(id, name, flag_emoji, slug)
            )
          `)
          .eq('id', user.id)
          .maybeSingle();

        console.log('👤 Consultant data from database:', consultantData);
        
        if (consultantData) {
          setConsultant(consultantData);
          
          console.log('🌍 Checking country assignments for country:', country);
          // Check if consultant is assigned to the requested country
          if (country !== 'global') {
            const assignments = consultantData.consultant_country_assignments || [];
            console.log('📋 Country assignments:', assignments);
            
            const countryAssignment = assignments.find((assignment: any) => 
              assignment.countries?.slug === country
            );
            
            console.log('🎯 Found country assignment:', countryAssignment);
            
            if (!countryAssignment) {
              console.log('❌ Consultant not assigned to this country, redirecting...');
              // Consultant not assigned to this country, redirect to their primary country or global
              const primaryAssignment = assignments.find((assignment: any) => assignment.is_primary);
              if (primaryAssignment) {
                navigate(`/${primaryAssignment.countries.slug}/consultant-dashboard/performance`);
              } else {
                navigate('/consultant-dashboard/performance');
              }
              return;
            }
            
            setAssignedCountry(countryAssignment.countries);
          }
        } else {
          setConsultant(user);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate, country]);

  // Redirect to performance if on base consultant path
  useEffect(() => {
    if (consultant && location.pathname === '/consultant-dashboard') {
      navigate('/consultant-dashboard/performance');
    } else if (consultant && location.pathname === `/${country}/consultant-dashboard`) {
      navigate(`/${country}/consultant-dashboard/performance`);
    }
  }, [consultant, location.pathname, navigate, country]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    safeNavigate('/login');
  };

  // Get current module based on URL
  const getCurrentModule = () => {
    const path = location.pathname;
    if (path.includes('/performance')) return 'performance';
    if (path.includes('/messages')) return 'messages';
    if (path.includes('/accounting')) return 'accounting';
    if (path.includes('/custom-services')) return 'custom-services';
    if (path.includes('/country-clients')) return 'country-clients';
    if (path.includes('/legacy-orders')) return 'legacy-orders';
    if (path.includes('/country-content')) return 'country-content';
    if (path.includes('/admin-messages')) return 'admin-messages';
    return 'performance';
  };

  const renderCurrentModule = () => {
    const currentModule = getCurrentModule();
    
    switch (currentModule) {
      case 'performance':
        return (
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
        );
        
      case 'messages':
        return (
          <div className="space-y-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Müşteri Mesajları</h2>
              <p className="text-gray-600">
                Müşterilerinizle iletişim kurun ve mesajları yönetin
              </p>
            </div>
            <ConsultantMessagingModule consultantId={consultant.id} />
          </div>
        );
        
      case 'accounting':
        return (
          <div className="space-y-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Muhasebe Yönetimi</h2>
              <p className="text-gray-600">
                Müşteri belgelerini yönetin, ödeme takibi yapın ve mali raporlar oluşturun
              </p>
            </div>
            <ConsultantAccountingModule consultantId={consultant.id} />
          </div>
        );
        
      case 'custom-services':
        return (
          <div className="space-y-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Özel Hizmetlerim</h2>
              <p className="text-gray-600">
                Kendi hizmetlerinizi oluşturun ve müşterilerinize önerin
              </p>
            </div>
            <CustomServiceManager consultantId={consultant.id} />
          </div>
        );
        
      case 'country-clients':
        return (
          <div className="space-y-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Ülke Müşterileri</h2>
              <p className="text-gray-600">
                Ülke bazlı müşteri yönetimi ve CRM sistemi
              </p>
            </div>
            <CountryBasedClients consultantId={consultant.id} />
          </div>
        );
        
      case 'legacy-orders':
        return (
          <div className="space-y-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Legacy Sipariş Yönetimi</h2>
              <p className="text-gray-600">
                Eski sistemden gelen siparişleri yönetin ve komisyonları takip edin
              </p>
            </div>
            <LegacyOrderManager consultantId={consultant.id} />
          </div>
        );
        
      case 'admin-messages':
        return (
          <div className="space-y-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin İletişimi</h2>
              <p className="text-gray-600">
                Sistem yöneticileri ile iletişim kurun ve bildirimleri görüntüleyin
              </p>
            </div>
            <ConsultantToAdminMessaging consultantId={consultant.id} />
          </div>
        );
        
      case 'country-content':
        return (
          <div className="space-y-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Ülke İçerik Yönetimi</h2>
              <p className="text-gray-600">
                Atandığınız ülkelerin frontend içeriğini yönetin
              </p>
            </div>
            <CountryContentManager consultantId={consultant.id} />
          </div>
        );
        
      default:
        return (
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
        );
    }
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
              {/* HAMBURGER MENU BUTTON */}
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
              {assignedCountry && (
                <div className="ml-4 flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-lg">
                  <span className="text-lg">{assignedCountry.flag_emoji}</span>
                  <span className="text-sm font-medium text-blue-700">{assignedCountry.name}</span>
                </div>
              )}
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
                    <span className="mr-1">{assignedCountry?.flag_emoji || consultant?.countries?.flag_emoji || '🌍'}</span>
                    {assignedCountry?.name || consultant?.countries?.name || 'Global'}
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
        {/* SIDEBAR */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden`}>
          <div className="w-64 bg-white shadow-lg h-screen fixed top-16 left-0 z-40 border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  {assignedCountry ? `${assignedCountry.name} Danışman Menüsü` : 'Danışman Menüsü'}
                </h3>
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  {assignedCountry && (
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">{assignedCountry.flag_emoji}</span>
                      <span className="text-sm font-bold text-blue-800">{assignedCountry.name} Uzmanı</span>
                    </div>
                  )}
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
                  {assignedCountry?.flag_emoji || consultant?.countries?.flag_emoji || '🌍'} {assignedCountry?.name || consultant?.countries?.name || 'Global'} Danışmanı
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
          {renderCurrentModule()}
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
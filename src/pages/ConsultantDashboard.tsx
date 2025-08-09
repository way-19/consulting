import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { safeNavigate } from '../lib/safeNavigate';
import ConsultantSidebar from '../components/consultant/ConsultantSidebar';
import { normalizeCountrySlug } from '../lib/countrySlug';

// Components
import PerformanceHub from '../components/consultant/dashboard/PerformanceHub';
import LegacyOrderManager from '../components/consultant/dashboard/LegacyOrderManager';
import QuickActions from '../components/consultant/dashboard/QuickActions';
import CountryBasedClients from '../components/consultant/dashboard/CountryBasedClients';
import CustomServiceManager from '../components/consultant/dashboard/CustomServiceManager';
import ConsultantMessagingModule from '../components/consultant/messaging/ConsultantMessagingModule';
import ConsultantToAdminMessaging from '../components/consultant/messaging/ConsultantToAdminMessaging';
import CountryContentManager from '../components/consultant/dashboard/CountryContentManager';
import ProductionAccountingModule from '../components/consultant/accounting/ProductionAccountingModule';
import NotificationDropdown from '../components/shared/NotificationDropdown';
import UserSettingsModal from '../components/shared/UserSettingsModal';
import { useNotifications } from '../hooks/useNotifications';

import {
  LogOut,
  Settings,
  Bell,
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
  const { unreadCount } = useNotifications(consultant?.id || '');

  const slug = normalizeCountrySlug(country);
  const basePath = slug === 'global' ? '/consultant-dashboard' : `/${slug}/consultant-dashboard`;

  const countryId = assignedCountry?.id || consultant?.countries?.id || 0;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user }
        } = await supabase.auth.getUser();

        if (!user) {
          navigate('/login');
          return;
        }

        const { data: consultantData } = await supabase
          .from('users')
          .select(`
            *,
            countries!users_country_id_fkey(name, flag_emoji, slug),
            consultant_country_assignments!consultant_country_assignments_consultant_id_fkey(
              countries!consultant_country_assignments_country_id_fkey(id, name, flag_emoji, slug),
              is_primary,
              status
            )
          `)
          .eq('id', user.id)
          .maybeSingle();

        if (!consultantData || consultantData.role !== 'consultant') {
          navigate('/unauthorized');
          return;
        }

        setConsultant(consultantData);
        localStorage.setItem('user', JSON.stringify(consultantData));

        if (slug !== 'global') {
          const assignments = consultantData.consultant_country_assignments || [];
          const countryAssignment = assignments.find(
            (assignment: any) => assignment.countries?.slug === slug
          );

          if (!countryAssignment) {
            const primaryAssignment = assignments.find(
              (assignment: any) => assignment.is_primary
            );
            if (primaryAssignment) {
              navigate(`/${primaryAssignment.countries.slug}/consultant-dashboard/performance`);
            } else {
              navigate('/consultant-dashboard/performance');
            }
            return;
          }

          setAssignedCountry(countryAssignment.countries);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate, slug]);

  // Redirect to performance if on base consultant path
  useEffect(() => {
    if (consultant && location.pathname === basePath) {
      navigate(`${basePath}/performance`);
    }
  }, [consultant, location.pathname, navigate, basePath]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
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
            <PerformanceHub consultantId={consultant.id} />
            <QuickActions consultantId={consultant.id} />
          </div>
        );
        
      case 'messages':
        return (
          <div className="space-y-8">
            <ConsultantMessagingModule consultantId={consultant.id} countryId={countryId} />
          </div>
        );
        
      case 'accounting':
        return (
          <div className="space-y-8">
            <ProductionAccountingModule consultantId={consultant.id} countryId={countryId} />
          </div>
        );
        
      case 'custom-services':
        return (
          <div className="space-y-8">
            <CustomServiceManager consultantId={consultant.id} />
          </div>
        );
        
      case 'country-clients':
        return (
          <div className="space-y-8">
            <CountryBasedClients consultantId={consultant.id} countryId={countryId} />
          </div>
        );
        
      case 'legacy-orders':
        return (
          <div className="space-y-8">
            <LegacyOrderManager consultantId={consultant.id} />
          </div>
        );
        
      case 'admin-messages':
        return (
          <div className="space-y-8">
            <ConsultantToAdminMessaging consultantId={consultant.id} />
          </div>
        );
        
      case 'country-content':
        return (
          <div className="space-y-8">
            <CountryContentManager consultantId={consultant.id} />
          </div>
        );
        
      default:
        return (
          <div className="space-y-8">
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
          <ConsultantSidebar consultantId={consultant?.id || ''} country={slug} />
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
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useMessageTranslation } from '../hooks/useMessageTranslation';
import ConsultantAccountingModule from '../components/consultant/accounting/ConsultantAccountingModule';
import ConsultantDashboardLayout from '../components/consultant/ConsultantDashboardLayout';
import PerformanceHub from '../components/consultant/dashboard/PerformanceHub';
import LegacyOrderManager from '../components/consultant/dashboard/LegacyOrderManager';
import QuickActions from '../components/consultant/dashboard/QuickActions';
import CountryBasedClients from '../components/consultant/dashboard/CountryBasedClients';
import CustomServiceManager from '../components/consultant/dashboard/CustomServiceManager';
import ConsultantMessagingModule from '../components/consultant/messaging/ConsultantMessagingModule';
import ConsultantToAdminMessaging from '../components/consultant/messaging/ConsultantToAdminMessaging';
import NotificationDropdown from '../components/shared/NotificationDropdown';
import UserSettingsModal from '../components/shared/UserSettingsModal';
import { useNotifications } from '../hooks/useNotifications';

const ConsultantDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [consultant, setConsultant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Use translation hook
  const { processingTranslations } = useMessageTranslation(consultant?.id || '', consultant?.language || 'en');
  
  // Use notifications hook
  const { unreadCount } = useNotifications(consultant?.id || '');

  // Listen for layout events
  useEffect(() => {
    const handleToggleNotifications = () => setShowNotifications(!showNotifications);
    const handleToggleSettings = () => setShowSettings(!showSettings);

    window.addEventListener('toggleNotifications', handleToggleNotifications);
    window.addEventListener('toggleSettings', handleToggleSettings);

    return () => {
      window.removeEventListener('toggleNotifications', handleToggleNotifications);
      window.removeEventListener('toggleSettings', handleToggleSettings);
    };
  }, [showNotifications, showSettings]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (!userData) {
          navigate('/login');
          return;
        }

        const user = JSON.parse(userData);
        if (user.role !== 'consultant') {
          navigate('/unauthorized');
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
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

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
    <ConsultantDashboardLayout consultant={consultant}>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Performans Merkezi</h2>
          <p className="text-gray-600">
            Müşterilerinizi yönetin, gelir takibi yapın ve danışmanlık işinizi büyütün
          </p>
        </div>

        {/* Performance Hub */}
        <PerformanceHub consultantId={consultant.id} />

        {/* Quick Actions */}
        <QuickActions consultantId={consultant.id} />

        {/* Admin Communication */}
        <ConsultantToAdminMessaging consultantId={consultant.id} />

        {/* Client Messaging */}
        <ConsultantMessagingModule consultantId={consultant.id} />

        {/* Country Based Clients */}
        <CountryBasedClients consultantId={consultant.id} />

        {/* Legacy Order Management */}
        <LegacyOrderManager consultantId={consultant.id} />

        {/* Custom Service Manager */}
        <CustomServiceManager consultantId={consultant.id} />
         
        {/* Accounting Module */}
        <ConsultantAccountingModule consultantId={consultant.id} />
      </div>

      {/* Notification Dropdown */}
      {showNotifications && (
        <NotificationDropdown
          userId={consultant.id}
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <UserSettingsModal
          userId={consultant.id}
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </ConsultantDashboardLayout>
  );
};

export default ConsultantDashboard;
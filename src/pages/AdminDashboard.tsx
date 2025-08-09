import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { safeNavigate } from '../lib/safeNavigate';
import AdminDashboardLayout from '../components/admin/AdminDashboardLayout';
import OverviewMetrics from '../components/admin/dashboard/OverviewMetrics';
import LegacyIntegrationStatus from '../components/admin/dashboard/LegacyIntegrationStatus';
import ConsultantPerformanceWidget from '../components/admin/dashboard/ConsultantPerformanceWidget';
import RevenueOverview from '../components/admin/dashboard/RevenueOverview';
import AISafetyMonitor from '../components/admin/dashboard/AISafetyMonitor';
import RealTimeAlerts from '../components/admin/dashboard/RealTimeAlerts';
import AdminMessagingModule from '../components/admin/messaging/AdminMessagingModule';
import NewClientRegistration from '../components/client/dashboard/NewClientRegistration';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<any>(null);
  const [overviewData, setOverviewData] = useState<any>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

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
    const checkAdminAuth = async () => {
      try {
        const {
          data: { user }
        } = await supabase.auth.getUser();

        if (!user) {
          navigate('/login');
          return;
        }

        const { data: adminData } = await supabase
          .from('users')
          .select('*')
          .eq('auth_user_id', user.id)
          .maybeSingle();

        if (!adminData) {
          setProfileError('Your profile was not found. Please contact an administrator.');
          return;
        }

        if (adminData.role !== 'admin') {
          navigate('/unauthorized');
          return;
        }

        localStorage.setItem('user', JSON.stringify(adminData));

        const { data: overviewData } = await supabase
          .from('admin_overview')
          .select('*')
          .maybeSingle();

        setAdmin(adminData);
        setOverviewData(overviewData);
      } catch (error) {
        console.error('Error loading admin dashboard:', error);
        window.location.href = '/login';
      } finally {
        setLoading(false);
      }
    };

    checkAdminAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{profileError}</p>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  return (
    <AdminDashboardLayout admin={admin}>
      <div className="space-y-6">
        {/* Global overview header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Global Command Center</h1>
          <p className="text-gray-600">
            Complete oversight of consulting19.com ecosystem with legacy integration
          </p>
        </div>

        {/* Real-time alerts */}
        <RealTimeAlerts />

        {/* Overview metrics grid */}
        <OverviewMetrics data={overviewData} />

        {/* Admin Messaging Module */}
        <AdminMessagingModule adminId={admin.id} />
        
        {/* New Client Registration */}
        <NewClientRegistration onClientCreated={(client) => {
          console.log('New client created:', client);
          // Refresh dashboard data if needed
        }} />
        
        {/* Key management widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LegacyIntegrationStatus />
          <AISafetyMonitor />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RevenueOverview />
          </div>
          <div>
            <ConsultantPerformanceWidget />
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminDashboard;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import AdminDashboardLayout from '../components/admin/AdminDashboardLayout';
import OverviewMetrics from '../components/admin/dashboard/OverviewMetrics';
import LegacyIntegrationStatus from '../components/admin/dashboard/LegacyIntegrationStatus';
import ConsultantPerformanceWidget from '../components/admin/dashboard/ConsultantPerformanceWidget';
import RevenueOverview from '../components/admin/dashboard/RevenueOverview';
import AISafetyMonitor from '../components/admin/dashboard/AISafetyMonitor';
import RealTimeAlerts from '../components/admin/dashboard/RealTimeAlerts';
import AdminMessagingModule from '../components/admin/messaging/AdminMessagingModule';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<any>(null);
  const [overviewData, setOverviewData] = useState<any>(null);
  // Listen for layout events
  useEffect(() => {
    const handleToggleNotifications = () => setShowNotifications(!showNotifications);
    const handleToggleSettings = () => setShowSettings(!showSettings);
  const [loading, setLoading] = useState(true);
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
        const userData = localStorage.getItem('user');
        if (!userData) {
          navigate('/login');
          return;
        }

        const user = JSON.parse(userData);
        if (user.role !== 'admin') {
          navigate('/unauthorized');
          return;
        }

        // Load full admin data from database
        const { data: adminData } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (!adminData) {
          navigate('/unauthorized');
          return;
        }

        // Load dashboard overview data
        const { data: overviewData } = await supabase
          .from('admin_overview')
          .select('*')
          .maybeSingle();

        setAdmin(adminData);
        setOverviewData(overviewData);
      } catch (error) {
        console.error('Error loading admin dashboard:', error);
        navigate('/login');
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
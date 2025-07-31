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

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<any>(null);
  const [overviewData, setOverviewData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/login');
          return;
        }

        // Verify admin role
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .eq('role', 'admin')
          .single();

        if (!userData) {
          navigate('/unauthorized');
          return;
        }

        // Load dashboard overview data
        const { data: overviewData } = await supabase
          .from('admin_overview')
          .select('*')
          .single();

        setAdmin(userData);
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
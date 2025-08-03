import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ConsultantAccountingModule from '../components/consultant/accounting/ConsultantAccountingModule';
import ConsultantDashboardLayout from '../components/consultant/ConsultantDashboardLayout';
import PerformanceHub from '../components/consultant/dashboard/PerformanceHub';
import LegacyOrderManager from '../components/consultant/dashboard/LegacyOrderManager';
import QuickActions from '../components/consultant/dashboard/QuickActions';
import CountryBasedClients from '../components/consultant/dashboard/CountryBasedClients';
import CustomServiceManager from '../components/consultant/dashboard/CustomServiceManager';

const ConsultantDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [consultant, setConsultant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        {/* Custom Service Manager */}
        <CustomServiceManager consultantId={consultant.id} />
         
        {/* Accounting Module */}
        <ConsultantAccountingModule consultantId={consultant.id} />
         
        if (!session) {
          navigate('/login');
          return;
        }

        // Fetch consultant data
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .eq('role', 'consultant')
          .single();

        if (!userData) {
          navigate('/unauthorized');
          return;
        }

        setConsultant(userData);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!consultant) {
    return null;
  }

  return (
    <ConsultantDashboardLayout consultant={consultant}>
      <div className="space-y-6">
        {/* Welcome section */}
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {consultant?.first_name || 'Consultant'}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your clients, track revenue, and grow your consulting business
          </p>
        </div>

        {/* Performance Overview */}
        <PerformanceHub consultantId={consultant.id} />
         
        {/* Country Based Clients */}
        <CountryBasedClients consultantId={consultant.id} />
         
        {/* Quick Actions */}
        <QuickActions consultantId={consultant.id} />
         
        {/* Legacy Orders */}
        <LegacyOrderManager consultantId={consultant.id} />
      </div>
    </ConsultantDashboardLayout>
  );
};

export default ConsultantDashboard;
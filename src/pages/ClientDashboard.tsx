import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ClientDashboardLayout from '../components/client/ClientDashboardLayout';
import ApplicationsOverview from '../components/client/dashboard/ApplicationsOverview';
import QuickActions from '../components/client/dashboard/QuickActions';
import RecentActivity from '../components/client/dashboard/RecentActivity';
import ServiceRecommendations from '../components/client/dashboard/ServiceRecommendations';
import UpcomingPayments from '../components/client/dashboard/UpcomingPayments';
import CountryServiceRequest from '../components/client/dashboard/CountryServiceRequest';

const ClientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [client, setClient] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [legacyOrders, setLegacyOrders] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClientData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/login');
          return;
        }

        // Fetch client profile
        const { data: clientData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .eq('role', 'client')
          .single();

        if (!clientData) {
          navigate('/unauthorized');
          return;
        }

        // Fetch applications
        const { data: applicationsData } = await supabase
          .from('applications')
          .select(`
            *,
            countries(name, flag_emoji),
            consultant:users!applications_consultant_id_fkey(first_name, last_name)
          `)
          .eq('client_id', session.user.id)
          .order('created_at', { ascending: false });

        // Fetch legacy orders for this client
        const { data: legacyData } = await supabase
          .from('legacy_order_integrations')
          .select('*')
          .eq('customer_data->email', clientData.email)
          .order('assignment_date', { ascending: false });

        // Fetch notifications
        const { data: notificationsData } = await supabase
          .from('client_notifications')
          .select('*')
          .eq('client_id', session.user.id)
          .eq('is_read', false)
          .order('created_at', { ascending: false })
          .limit(5);

        setClient(clientData);
        setApplications(applicationsData || []);
        setLegacyOrders(legacyData || []);
        setNotifications(notificationsData || []);
      } catch (error) {
        console.error('Error loading client data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadClientData();
  }, [navigate]);

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await supabase
        .from('client_notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      setNotifications(notifications.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <ClientDashboardLayout client={client} notifications={notifications}>
      <div className="space-y-6">
        {/* Welcome section */}
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {client?.first_name || 'Client'}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Track your applications, communicate with consultants, and manage your business setup
          </p>
        </div>

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></span>
              Recent Updates
            </h2>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div key={notification.id} className="flex justify-between items-center bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex-1">
                    <p className="font-semibold text-blue-900">{notification.title}</p>
                    <p className="text-sm text-blue-700">{notification.message}</p>
                  </div>
                  <button
                    onClick={() => markNotificationAsRead(notification.id)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    Mark as read
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick actions */}
        <QuickActions client={client} />

        {/* Upcoming Payments */}
        <UpcomingPayments clientId={client.id} />

        {/* Applications overview */}
        <ApplicationsOverview 
          applications={applications} 
          legacyOrders={legacyOrders}
          clientId={client.id} 
        />

        {/* Cross Country Service Requests */}
        <CountryServiceRequest 
          clientId={client.id} 
          clientCountryId={client.country_id}
        />

        {/* Service recommendations */}
        <ServiceRecommendations 
          client={client}
          existingApplications={applications}
          legacyOrders={legacyOrders}
        />

        {/* Recent activity */}
        <RecentActivity 
          applications={applications}
          legacyOrders={legacyOrders}
        />
      </div>
    </ClientDashboardLayout>
  );
};

export default ClientDashboard;
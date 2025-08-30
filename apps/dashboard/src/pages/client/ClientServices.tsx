import React, { useState, useEffect } from 'react';
import { Briefcase, ShoppingCart, MessageCircle, Star, DollarSign } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { supabase } from '@consulting19/supabase';
import { useAuth } from '@consulting19/shared';
import { useI18n } from '../../hooks/useI18n';
import ClientLayout from '../../components/layouts/ClientLayout';
import { Helmet } from 'react-helmet-async';

interface CustomService {
  id: string;
  title_i18n: any;
  description_i18n: any;
  features_i18n: any;
  price: number;
  currency: string;
  consultant: {
    full_name: string;
  };
}

interface ServiceOrder {
  id: string;
  status: string;
  total_amount: number;
  currency: string;
  notes: string | null;
  created_at: string;
  custom_service: {
    title_i18n: any;
  } | null;
  service: {
    title: string;
  } | null;
}

const ClientServices = () => {
  const { user } = useAuth();
  const { t, formatCurrency, getLocalizedContent } = useI18n();
  const [services, setServices] = useState<CustomService[]>([]);
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available');

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Get client record first
      const { data: clientData } = await supabase
        .from('clients')
        .select('id, assigned_consultant_id')
        .eq('profile_id', user.id)
        .single();

      if (!clientData) {
        setLoading(false);
        return;
      }

      // Fetch available services from assigned consultant
      const { data: servicesData } = await supabase
        .from('custom_services')
        .select(`
          *,
          consultant:user_profiles!custom_services_consultant_id_fkey(full_name)
        `)
        .eq('consultant_id', clientData.assigned_consultant_id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      setServices(servicesData || []);

      // Fetch client's orders
      const { data: ordersData } = await supabase
        .from('service_orders')
        .select(`
          *,
          custom_service:custom_services(title_i18n),
          service:services(title)
        `)
        .eq('client_id', clientData.id)
        .order('created_at', { ascending: false });

      setOrders(ordersData || []);

    } catch (error) {
      console.error('Error fetching services data:', error);
    } finally {
      setLoading(false);
    }
  };

  const orderService = async (serviceId: string, price: number, currency: string) => {
    if (!user) return;

    try {
      // Get client record
      const { data: clientData } = await supabase
        .from('clients')
        .select('id, assigned_consultant_id')
        .eq('profile_id', user.id)
        .single();

      if (!clientData) return;

      const { error } = await supabase
        .from('service_orders')
        .insert({
          custom_service_id: serviceId,
          client_id: clientData.id,
          consultant_id: clientData.assigned_consultant_id,
          status: 'pending',
          total_amount: price,
          currency: currency
        });

      if (error) {
        console.error('Error creating order:', error);
        alert('Failed to create order');
      } else {
        // Notify consultant
        await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/notify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            recipient_id: clientData.assigned_consultant_id,
            type: 'service_ordered',
            payload: {
              service_name: getLocalizedContent(services.find(s => s.id === serviceId)?.title_i18n, 'title', 'Service'),
              client_name: user.user_metadata?.full_name,
              amount: formatCurrency(price, currency)
            },
            email_notification: true
          }),
        });

        fetchData();
        alert('Service ordered successfully!');
      }
    } catch (error) {
      console.error('Error ordering service:', error);
      alert('Failed to order service');
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <ClientLayout>
        <Helmet>
          <title>{t('services.title')} - Consulting19</title>
        </Helmet>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <Helmet>
        <title>{t('services.title')} - Consulting19</title>
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('services.title')}</h1>
        <p className="text-gray-600">{t('services.subtitle')}</p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'available', label: t('services.availableServices'), icon: Briefcase },
              { id: 'orders', label: t('services.myOrders'), icon: ShoppingCart },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Available Services Tab */}
      {activeTab === 'available' && (
        <div>
          {services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service) => (
                <Card key={service.id} hover>
                  <Card.Body>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {getLocalizedContent(service.title_i18n, 'title', 'Service')}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {getLocalizedContent(service.description_i18n, 'description', 'No description available')}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {formatCurrency(service.price, service.currency)}
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    {service.features_i18n && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">{t('services.features')}</h4>
                        <ul className="space-y-1">
                          {(getLocalizedContent(service.features_i18n, 'features', []) as string[]).map((feature, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-center">
                              <Star className="w-3 h-3 text-blue-600 mr-2" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        {t('services.consultant')}: {service.consultant?.full_name}
                      </div>
                      <Button 
                        icon={ShoppingCart}
                        onClick={() => orderService(service.id, service.price, service.currency)}
                      >
                        {t('services.orderNow')}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <Card.Body className="text-center py-12">
                <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('services.emptyState.title')}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t('services.emptyState.description')}
                </p>
                <Button icon={MessageCircle}>
                  {t('services.requestCustom')}
                </Button>
              </Card.Body>
            </Card>
          )}
        </div>
      )}

      {/* My Orders Tab */}
      {activeTab === 'orders' && (
        <div>
          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <Card.Body>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {order.custom_service 
                            ? getLocalizedContent(order.custom_service.title_i18n, 'title', 'Custom Service')
                            : order.service?.title || 'Service'
                          }
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span>Order #{order.id.slice(0, 8)}</span>
                          <span>{formatDate(order.created_at)}</span>
                        </div>
                        {order.notes && (
                          <p className="text-gray-600 mt-2">{order.notes}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900 mb-2">
                          {formatCurrency(order.total_amount, order.currency)}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}>
                          {t(`services.orderStatus.${order.status}`)}
                        </span>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <Card.Body className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('services.ordersEmptyState.title')}
                </h3>
                <p className="text-gray-600">
                  {t('services.ordersEmptyState.description')}
                </p>
              </Card.Body>
            </Card>
          )}
        </div>
      )}
    </ClientLayout>
  );
};

export default ClientServices;
import React, { useState, useEffect } from 'react';
import { Target, DollarSign, Calendar, ShoppingCart, Star, Filter, Search } from 'lucide-react';
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
  billing_type: string;
  category: string;
  is_featured: boolean;
  consultant: {
    full_name: string;
    company: string;
  };
  country: {
    name: string;
    flag_emoji: string;
  } | null;
  created_at: string;
}

interface ServiceOrder {
  id: string;
  title: string;
  description: string;
  total_amount: number;
  currency: string;
  status: string;
  created_at: string;
  consultant: {
    full_name: string;
  };
}

const ClientServices = () => {
  const { user } = useAuth();
  const { t, formatCurrency, formatRelativeTime, getLocalizedContent } = useI18n();
  const [services, setServices] = useState<CustomService[]>([]);
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedService, setSelectedService] = useState<CustomService | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    if (user) {
      fetchServices();
      fetchOrders();
    }
  }, [user]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('custom_services')
        .select(`
          *,
          consultant:user_profiles!custom_services_consultant_id_fkey(full_name, company),
          country:countries(name, flag_emoji)
        `)
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching services:', error);
      } else {
        setServices(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    if (!user) return;

    try {
      // Get client record first
      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', user.id)
        .single();

      if (!clientData) return;

      const { data, error } = await supabase
        .from('service_orders')
        .select(`
          *,
          consultant:user_profiles!service_orders_consultant_id_fkey(full_name)
        `)
        .eq('client_id', clientData.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
      } else {
        setOrders(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const createOrder = async (service: CustomService) => {
    if (!user) return;

    try {
      // Get client record
      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', user.id)
        .single();

      if (!clientData) return;

      const { data, error } = await supabase
        .from('service_orders')
        .insert({
          client_id: clientData.id,
          consultant_id: service.consultant_id,
          service_id: service.id,
          title: getLocalizedContent(service.title_i18n, 'en', 'Service Order'),
          description: getLocalizedContent(service.description_i18n, 'en', ''),
          total_amount: service.price,
          currency: service.currency,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating order:', error);
        alert('Failed to create order');
      } else {
        alert('Order created successfully! Your consultant will contact you soon.');
        fetchOrders();
        setShowOrderModal(false);
        setSelectedService(null);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = 
      getLocalizedContent(service.title_i18n, 'en', '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      getLocalizedContent(service.description_i18n, 'en', '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.consultant?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

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

  const categories = Array.from(new Set(services.map(s => s.category)));

  if (loading) {
    return (
      <ClientLayout>
        <Helmet>
          <title>Services - Consulting19</title>
        </Helmet>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-16 bg-gray-200 rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <Helmet>
        <title>Services - Consulting19</title>
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Services</h1>
        <p className="text-gray-600">Browse and order services from expert consultants</p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'available', label: 'Available Services', count: services.length },
              { id: 'orders', label: 'My Orders', count: orders.length },
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
                <span>{tab.label}</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Available Services Tab */}
      {activeTab === 'available' && (
        <div>
          {/* Filters */}
          <Card className="mb-6">
            <Card.Body>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </Card.Body>
          </Card>

          {/* Services Grid */}
          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <Card key={service.id} hover className="relative">
                  {service.is_featured && (
                    <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      Featured
                    </div>
                  )}
                  
                  <Card.Body>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {getLocalizedContent(service.title_i18n, 'en', 'Service')}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                          {getLocalizedContent(service.description_i18n, 'en', 'No description')}
                        </p>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">What's Included:</h4>
                      <ul className="space-y-1">
                        {(getLocalizedContent(service.features_i18n, 'en', []) as string[]).slice(0, 3).map((feature, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Consultant Info */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{service.consultant?.full_name}</p>
                          <p className="text-xs text-gray-600">{service.consultant?.company}</p>
                          {service.country && (
                            <p className="text-xs text-gray-500">
                              {service.country.flag_emoji} {service.country.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Price:</span>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">
                            {formatCurrency(service.price)}
                          </div>
                          <div className="text-xs text-gray-500 capitalize">
                            {service.billing_type.replace('_', ' ')}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Button */}
                    <Button 
                      className="w-full" 
                      icon={ShoppingCart}
                      onClick={() => {
                        setSelectedService(service);
                        setShowOrderModal(true);
                      }}
                    >
                      Order Service
                    </Button>
                  </Card.Body>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <Card.Body className="text-center py-12">
                <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Services Available
                </h3>
                <p className="text-gray-600">
                  {searchTerm || categoryFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'Services will be available once you are assigned to a consultant'
                  }
                </p>
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
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{order.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{order.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            <span>{order.consultant?.full_name}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>Ordered {formatRelativeTime(order.created_at)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          {formatCurrency(order.total_amount)}
                        </div>
                        <div className="text-sm text-gray-500">{order.currency}</div>
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
                  No Orders Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Browse available services and place your first order
                </p>
                <Button onClick={() => setActiveTab('available')} icon={Target}>
                  Browse Services
                </Button>
              </Card.Body>
            </Card>
          )}
        </div>
      )}

      {/* Order Confirmation Modal */}
      {showOrderModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4">
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">Confirm Order</h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {getLocalizedContent(selectedService.title_i18n, 'en', 'Service')}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {getLocalizedContent(selectedService.description_i18n, 'en', 'No description')}
                  </p>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">Total:</span>
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(selectedService.price)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Your consultant will contact you to confirm details and arrange payment
                  </p>
                </div>
              </div>
            </Card.Body>
            <Card.Footer>
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setShowOrderModal(false);
                    setSelectedService(null);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => createOrder(selectedService)}
                >
                  Confirm Order
                </Button>
              </div>
            </Card.Footer>
          </Card>
        </div>
      )}
    </ClientLayout>
  );
};

export default ClientServices;
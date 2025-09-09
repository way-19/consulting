import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  DollarSign, 
  Globe, 
  Star, 
  ToggleLeft, 
  ToggleRight,
  Search,
  Filter,
  Save,
  X,
  CheckCircle,
  AlertTriangle,
  Languages,
  Target,
  BarChart3,
  TrendingUp,
  Award,
  Building,
  Calendar,
  Clock,
  Users
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface CustomService {
  id: string;
  consultant_id: string;
  country_id?: string;
  title_i18n: Record<string, string>;
  description_i18n: Record<string, string>;
  features_i18n: Record<string, string[]>;
  category: string;
  price: number;
  currency: string;
  billing_type: 'one_time' | 'monthly' | 'quarterly' | 'yearly';
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  order_count?: number;
  total_revenue?: number;
}

interface ServiceStats {
  total: number;
  active: number;
  featured: number;
  total_revenue: number;
  avg_price: number;
  most_popular_category: string;
}

const ConsultantServices = () => {
  const { user, profile } = useAuth();
  const [services, setServices] = useState<CustomService[]>([]);
  const [serviceStats, setServiceStats] = useState<ServiceStats>({
    total: 0,
    active: 0,
    featured: 0,
    total_revenue: 0,
    avg_price: 0,
    most_popular_category: ''
  });
  const [loading, setLoading] = useState(true);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<CustomService | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [newService, setNewService] = useState({
    title_i18n: { en: '', tr: '', pt: '', es: '' },
    description_i18n: { en: '', tr: '', pt: '', es: '' },
    features_i18n: { en: [''], tr: [''], pt: [''], es: [''] },
    category: '',
    price: 0,
    currency: 'USD',
    billing_type: 'one_time' as const,
    is_active: true,
    is_featured: false,
    country_id: ''
  });

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
  ];

  const categories = [
    'Company Formation',
    'Tax Planning',
    'Banking Solutions',
    'Legal Compliance',
    'Asset Protection',
    'Investment Advisory',
    'Visa & Residency',
    'Market Research',
    'Accounting Services',
    'Business Consulting'
  ];

  const billingTypes = [
    { value: 'one_time', label: 'One-time Payment' },
    { value: 'monthly', label: 'Monthly Subscription' },
    { value: 'quarterly', label: 'Quarterly Subscription' },
    { value: 'yearly', label: 'Yearly Subscription' }
  ];

  const currencies = ['USD', 'EUR', 'GBP', 'TRY', 'BRL'];

  useEffect(() => {
    if (user && profile) {
      fetchServices();
    }
  }, [user, profile]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      
      // Fetch custom services for this consultant
      const { data: servicesData, error: servicesError } = await supabase
        .from('custom_services')
        .select('*')
        .eq('consultant_id', user?.id)
        .order('created_at', { ascending: false });

      if (servicesError) {
        console.error('Error fetching services:', servicesError);
        setErrorMessage('Failed to load services');
        return;
      }

      // Enrich services with order statistics
      const enrichedServices = await Promise.all(
        (servicesData || []).map(async (service) => {
          try {
            // Get order count and revenue for this service
            const { data: ordersData } = await supabase
              .from('service_orders')
              .select('total_amount, status')
              .eq('custom_service_id', service.id);

            const orderCount = ordersData?.length || 0;
            const totalRevenue = ordersData?.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.total_amount, 0) || 0;

            return {
              ...service,
              order_count: orderCount,
              total_revenue: totalRevenue
            };
          } catch (err) {
            console.error('Error enriching service data:', err);
            return {
              ...service,
              order_count: 0,
              total_revenue: 0
            };
          }
        })
      );

      setServices(enrichedServices);
      calculateServiceStats(enrichedServices);
    } catch (err) {
      console.error('Unexpected error:', err);
      setErrorMessage('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const calculateServiceStats = (services: CustomService[]) => {
    const stats: ServiceStats = {
      total: services.length,
      active: services.filter(s => s.is_active).length,
      featured: services.filter(s => s.is_featured).length,
      total_revenue: services.reduce((sum, s) => sum + (s.total_revenue || 0), 0),
      avg_price: services.length > 0 ? services.reduce((sum, s) => sum + s.price, 0) / services.length : 0,
      most_popular_category: getMostPopularCategory(services)
    };
    setServiceStats(stats);
  };

  const getMostPopularCategory = (services: CustomService[]) => {
    const categoryCounts: { [key: string]: number } = {};
    services.forEach(service => {
      categoryCounts[service.category] = (categoryCounts[service.category] || 0) + (service.order_count || 0);
    });
    
    const mostPopular = Object.entries(categoryCounts).sort(([,a], [,b]) => b - a)[0];
    return mostPopular ? mostPopular[0] : 'N/A';
  };

  const handleCreateService = async () => {
    if (!newService.title_i18n.en.trim() || !newService.category || newService.price < 0) {
      setErrorMessage('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      setErrorMessage('');

      const serviceData = {
        consultant_id: user?.id,
        country_id: newService.country_id || null,
        title_i18n: newService.title_i18n,
        description_i18n: newService.description_i18n,
        features_i18n: newService.features_i18n,
        category: newService.category,
        price: newService.price,
        currency: newService.currency,
        billing_type: newService.billing_type,
        is_active: newService.is_active,
        is_featured: newService.is_featured
      };

      const { error } = await supabase
        .from('custom_services')
        .insert(serviceData);

      if (error) {
        throw error;
      }

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'custom_service_created',
          description: `Created custom service: ${newService.title_i18n.en}`,
          payload: {
            service_title: newService.title_i18n.en,
            category: newService.category,
            price: newService.price,
            currency: newService.currency
          }
        });

      setSuccessMessage('Service created successfully!');
      setShowServiceForm(false);
      resetForm();
      fetchServices();
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error creating service:', err);
      setErrorMessage('Failed to create service. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateService = async () => {
    if (!editingService || !newService.title_i18n.en.trim()) {
      setErrorMessage('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      setErrorMessage('');

      const { error } = await supabase
        .from('custom_services')
        .update({
          title_i18n: newService.title_i18n,
          description_i18n: newService.description_i18n,
          features_i18n: newService.features_i18n,
          category: newService.category,
          price: newService.price,
          currency: newService.currency,
          billing_type: newService.billing_type,
          is_active: newService.is_active,
          is_featured: newService.is_featured,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingService.id);

      if (error) {
        throw error;
      }

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'custom_service_updated',
          description: `Updated custom service: ${newService.title_i18n.en}`,
          payload: {
            service_id: editingService.id,
            service_title: newService.title_i18n.en,
            category: newService.category,
            price: newService.price
          }
        });

      setSuccessMessage('Service updated successfully!');
      setShowServiceForm(false);
      setEditingService(null);
      resetForm();
      fetchServices();
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error updating service:', err);
      setErrorMessage('Failed to update service. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(serviceId);

      const { error } = await supabase
        .from('custom_services')
        .delete()
        .eq('id', serviceId);

      if (error) {
        throw error;
      }

      // Create audit log
      const service = services.find(s => s.id === serviceId);
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'custom_service_deleted',
          description: `Deleted custom service: ${service?.title_i18n?.en || 'Unknown'}`,
          payload: { service_id: serviceId }
        });

      setSuccessMessage('Service deleted successfully!');
      fetchServices();
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error deleting service:', err);
      setErrorMessage('Failed to delete service. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  const toggleServiceStatus = async (serviceId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('custom_services')
        .update({ 
          is_active: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', serviceId);

      if (error) {
        throw error;
      }

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'custom_service_status_updated',
          description: `${!currentStatus ? 'Activated' : 'Deactivated'} custom service`,
          payload: { service_id: serviceId, new_status: !currentStatus }
        });

      fetchServices();
    } catch (err) {
      console.error('Error updating service status:', err);
      setErrorMessage('Failed to update service status');
    }
  };

  const toggleFeaturedStatus = async (serviceId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('custom_services')
        .update({ 
          is_featured: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', serviceId);

      if (error) {
        throw error;
      }

      fetchServices();
    } catch (err) {
      console.error('Error updating featured status:', err);
      setErrorMessage('Failed to update featured status');
    }
  };

  const resetForm = () => {
    setNewService({
      title_i18n: { en: '', tr: '', pt: '', es: '' },
      description_i18n: { en: '', tr: '', pt: '', es: '' },
      features_i18n: { en: [''], tr: [''], pt: [''], es: [''] },
      category: '',
      price: 0,
      currency: 'USD',
      billing_type: 'one_time',
      is_active: true,
      is_featured: false,
      country_id: ''
    });
  };

  const loadServiceForEdit = (service: CustomService) => {
    setEditingService(service);
    setNewService({
      title_i18n: service.title_i18n || { en: '', tr: '', pt: '', es: '' },
      description_i18n: service.description_i18n || { en: '', tr: '', pt: '', es: '' },
      features_i18n: service.features_i18n || { en: [''], tr: [''], pt: [''], es: [''] },
      category: service.category,
      price: service.price,
      currency: service.currency,
      billing_type: service.billing_type,
      is_active: service.is_active,
      is_featured: service.is_featured,
      country_id: service.country_id || ''
    });
    setShowServiceForm(true);
  };

  const updateFeaturesList = (langCode: string, index: number, value: string) => {
    setNewService(prev => ({
      ...prev,
      features_i18n: {
        ...prev.features_i18n,
        [langCode]: prev.features_i18n[langCode].map((feature, i) => 
          i === index ? value : feature
        )
      }
    }));
  };

  const addFeature = (langCode: string) => {
    setNewService(prev => ({
      ...prev,
      features_i18n: {
        ...prev.features_i18n,
        [langCode]: [...prev.features_i18n[langCode], '']
      }
    }));
  };

  const removeFeature = (langCode: string, index: number) => {
    setNewService(prev => ({
      ...prev,
      features_i18n: {
        ...prev.features_i18n,
        [langCode]: prev.features_i18n[langCode].filter((_, i) => i !== index)
      }
    }));
  };

  const getLocalizedText = (i18nObj: Record<string, string>, fallback: string = '') => {
    if (!i18nObj || typeof i18nObj !== 'object') return fallback;
    
    const currentLang = profile?.preferred_language || 'en';
    
    // Try current language first
    if (i18nObj[currentLang]) return i18nObj[currentLang];
    
    // Fallback to English
    if (i18nObj.en) return i18nObj.en;
    
    // Return fallback
    return fallback;
  };

  const getBillingTypeText = (billingType: string) => {
    switch (billingType) {
      case 'one_time': return 'One-time';
      case 'monthly': return 'Monthly';
      case 'quarterly': return 'Quarterly';
      case 'yearly': return 'Yearly';
      default: return 'One-time';
    }
  };

  const filteredServices = services.filter(service => {
    const title = getLocalizedText(service.title_i18n, '');
    const description = getLocalizedText(service.description_i18n, '');
    
    const matchesSearch = 
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && service.is_active) ||
      (statusFilter === 'inactive' && !service.is_active) ||
      (statusFilter === 'featured' && service.is_featured);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const uniqueCategories = [...new Set(services.map(s => s.category))];

  if (loading) {
    return (
      <>
        <Helmet>
          <title>My Services - Consultant Dashboard</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Services - Consultant Dashboard</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Services</h1>
            <p className="text-gray-600 mt-1">Create and manage your custom service offerings</p>
          </div>
          <button 
            onClick={() => {
              resetForm();
              setEditingService(null);
              setShowServiceForm(true);
            }}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Service
          </button>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            {successMessage}
          </div>
        )}
        
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {errorMessage}
          </div>
        )}

        {/* Service Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Services</p>
                <p className="text-3xl font-bold text-gray-900">{serviceStats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Services</p>
                <p className="text-3xl font-bold text-green-600">{serviceStats.active}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Featured Services</p>
                <p className="text-3xl font-bold text-yellow-600">{serviceStats.featured}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-purple-600">${serviceStats.total_revenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {uniqueCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="featured">Featured</option>
            </select>
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div key={service.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Service Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {getLocalizedText(service.title_i18n, 'Untitled Service')}
                        </h3>
                        {service.is_featured && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {getLocalizedText(service.description_i18n, 'No description available')}
                      </p>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {service.category}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => toggleFeaturedStatus(service.id, service.is_featured)}
                        className={`p-1 rounded ${service.is_featured ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                        title="Toggle featured status"
                      >
                        <Star className={`w-4 h-4 ${service.is_featured ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => toggleServiceStatus(service.id, service.is_active)}
                        className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                          service.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {service.is_active ? (
                          <ToggleRight className="w-3 h-3" />
                        ) : (
                          <ToggleLeft className="w-3 h-3" />
                        )}
                        <span>{service.is_active ? 'Active' : 'Inactive'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Features Preview */}
                  {service.features_i18n && getLocalizedText(service.features_i18n, []).length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Features:</h4>
                      <ul className="text-xs text-gray-700 space-y-1">
                        {getLocalizedText(service.features_i18n, []).slice(0, 3).map((feature: string, index: number) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                            {feature}
                          </li>
                        ))}
                        {getLocalizedText(service.features_i18n, []).length > 3 && (
                          <li className="text-gray-500">+{getLocalizedText(service.features_i18n, []).length - 3} more features</li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Pricing */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          ${service.price.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">
                          {getBillingTypeText(service.billing_type)} • {service.currency}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {service.order_count || 0} orders
                        </div>
                        <div className="text-xs text-gray-500">
                          ${(service.total_revenue || 0).toLocaleString()} revenue
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => {
                        const features = getLocalizedText(service.features_i18n, []);
                        alert(`Service Details:\n\nTitle: ${getLocalizedText(service.title_i18n, 'Untitled')}\n\nDescription: ${getLocalizedText(service.description_i18n, 'No description')}\n\nCategory: ${service.category}\n\nPrice: $${service.price} ${service.currency}\n\nBilling: ${getBillingTypeText(service.billing_type)}\n\nFeatures: ${features.join(', ')}\n\nOrders: ${service.order_count || 0}\n\nRevenue: $${(service.total_revenue || 0).toLocaleString()}`);
                      }}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-1 inline" />
                      Preview
                    </button>
                    <button 
                      onClick={() => loadServiceForEdit(service)}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Edit className="w-4 h-4 mr-1 inline" />
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteService(service.id)}
                      disabled={deleting === service.id}
                      className="px-3 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
                    >
                      {deleting === service.id ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600"></div>
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                ? 'No services match your filters'
                : 'No services created yet'
              }
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search terms or filters'
                : 'Create your first custom service to start offering specialized solutions to clients'
              }
            </p>
            {!(searchTerm || categoryFilter !== 'all' || statusFilter !== 'all') && (
              <button 
                onClick={() => {
                  resetForm();
                  setEditingService(null);
                  setShowServiceForm(true);
                }}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Service
              </button>
            )}
          </div>
        )}

        {/* Service Analytics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Service Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-1">${serviceStats.avg_price.toFixed(0)}</div>
              <div className="text-sm text-blue-800">Average Price</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-green-600 mb-1">${serviceStats.total_revenue.toLocaleString()}</div>
              <div className="text-sm text-green-800">Total Revenue</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="text-lg font-bold text-purple-600 mb-1">{serviceStats.most_popular_category}</div>
              <div className="text-sm text-purple-800">Most Popular</div>
            </div>
          </div>
        </div>

        {/* Service Creation/Edit Modal */}
        {showServiceForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingService ? 'Edit Service' : 'Create New Service'}
                </h2>
                <button
                  onClick={() => {
                    setShowServiceForm(false);
                    setEditingService(null);
                    resetForm();
                    setErrorMessage('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        value={newService.category}
                        onChange={(e) => setNewService(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select category</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price *
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={newService.price}
                          onChange={(e) => setNewService(prev => ({ ...prev, price: Number(e.target.value) }))}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0.00"
                        />
                        <select
                          value={newService.currency}
                          onChange={(e) => setNewService(prev => ({ ...prev, currency: e.target.value }))}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {currencies.map(currency => (
                            <option key={currency} value={currency}>{currency}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Billing Type
                      </label>
                      <select
                        value={newService.billing_type}
                        onChange={(e) => setNewService(prev => ({ ...prev, billing_type: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {billingTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newService.is_active}
                          onChange={(e) => setNewService(prev => ({ ...prev, is_active: e.target.checked }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-900">Active</span>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newService.is_featured}
                          onChange={(e) => setNewService(prev => ({ ...prev, is_featured: e.target.checked }))}
                          className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                        />
                        <span className="ml-2 text-sm text-gray-900">Featured</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Multilingual Content */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Languages className="w-5 h-5 mr-2 text-blue-600" />
                    Multilingual Content
                  </h3>
                  
                  <div className="space-y-6">
                    {languages.map((lang) => (
                      <div key={lang.code} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-4">
                          <span className="text-lg">{lang.flag}</span>
                          <h4 className="font-semibold text-gray-900">{lang.name}</h4>
                          {lang.code === 'en' && <span className="text-xs text-red-600">*Required</span>}
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Service Title {lang.code === 'en' && '*'}
                            </label>
                            <input
                              type="text"
                              value={newService.title_i18n[lang.code]}
                              onChange={(e) => setNewService(prev => ({
                                ...prev,
                                title_i18n: { ...prev.title_i18n, [lang.code]: e.target.value }
                              }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder={`Enter service title in ${lang.name}`}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Description {lang.code === 'en' && '*'}
                            </label>
                            <textarea
                              value={newService.description_i18n[lang.code]}
                              onChange={(e) => setNewService(prev => ({
                                ...prev,
                                description_i18n: { ...prev.description_i18n, [lang.code]: e.target.value }
                              }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              rows={3}
                              placeholder={`Enter service description in ${lang.name}`}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Features
                            </label>
                            <div className="space-y-2">
                              {newService.features_i18n[lang.code].map((feature, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <input
                                    type="text"
                                    value={feature}
                                    onChange={(e) => updateFeaturesList(lang.code, index, e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder={`Feature ${index + 1} in ${lang.name}`}
                                  />
                                  {newService.features_i18n[lang.code].length > 1 && (
                                    <button
                                      onClick={() => removeFeature(lang.code, index)}
                                      className="p-2 text-red-600 hover:text-red-700"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              ))}
                              <button
                                onClick={() => addFeature(lang.code)}
                                className="text-sm text-blue-600 hover:text-blue-700"
                              >
                                + Add Feature
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowServiceForm(false);
                    setEditingService(null);
                    resetForm();
                    setErrorMessage('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingService ? handleUpdateService : handleCreateService}
                  disabled={saving || !newService.title_i18n.en.trim() || !newService.category}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                      {editingService ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2 inline" />
                      {editingService ? 'Update Service' : 'Create Service'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Service Guidelines */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💼 Service Creation Guidelines</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mt-0.5">
                  <DollarSign className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Service Order Management</h4>
                  <p className="text-sm text-gray-600">
                    Track all service orders from clients in the Financial Dashboard. 
                    View order status, payments, and commission earnings for each service.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mt-0.5">
                  <Languages className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Multilingual Content</h4>
                  <p className="text-sm text-gray-600">
                    Provide content in multiple languages to reach international clients. 
                    English is required, other languages are optional but recommended.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mt-0.5">
                  <DollarSign className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Competitive Pricing</h4>
                  <p className="text-sm text-gray-600">
                    Research market rates and price your services competitively. 
                    Consider offering different billing options for flexibility.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mt-0.5">
                  <Star className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Featured Services</h4>
                  <p className="text-sm text-gray-600">
                    Mark your best services as featured to highlight them to clients. 
                    Featured services appear first in client dashboards.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mt-0.5">
                  <Target className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Clear Categories</h4>
                  <p className="text-sm text-gray-600">
                    Choose appropriate categories to help clients find your services easily. 
                    Consistent categorization improves discoverability.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mt-0.5">
                  <CheckCircle className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Detailed Features</h4>
                  <p className="text-sm text-gray-600">
                    List specific features and deliverables to set clear expectations. 
                    Detailed feature lists help clients understand the value proposition.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mt-0.5">
                  <BarChart3 className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Performance Tracking</h4>
                  <p className="text-sm text-gray-600">
                    Monitor your service performance through order counts and revenue metrics. 
                    Use this data to optimize your offerings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConsultantServices;
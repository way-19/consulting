import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useAuth } from '@consulting19/shared';
import { 
  Briefcase, 
  DollarSign, 
  Star,
  Globe,
  Calendar,
  CheckCircle,
  Clock,
  User,
  Target,
  CreditCard,
  Eye,
  ShoppingCart,
  Filter,
  Search,
  TrendingUp,
  Award,
  Zap,
  Plus
} from 'lucide-react';
import { supabase } from '@consulting19/shared/src/lib/supabase';

interface CustomService {
  id: string;
  consultant_id: string;
  title_i18n: any;
  description_i18n: any;
  features_i18n: any;
  category: string;
  price: number;
  currency: string;
  billing_type: string;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  consultant: {
    full_name: string;
    email: string;
  };
}

const ClientServices = () => {
  const { user, profile } = useAuth();
  const [services, setServices] = useState<CustomService[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [consultant, setConsultant] = useState<any>(null);
  const [ordering, setOrdering] = useState<string | null>(null);

  useEffect(() => {
    if (user && profile) {
      fetchConsultantAndServices();
    }
  }, [user, profile]);

  const fetchConsultantAndServices = async () => {
    try {
      setLoading(true);
      
      // Get client data with assigned consultant
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select(`
          id,
          assigned_consultant_id,
          consultant:user_profiles!clients_assigned_consultant_id_fkey(
            id, full_name, email, timezone
          )
        `)
        .eq('profile_id', user?.id)
        .maybeSingle();

      if (clientError || !clientData) {
        console.error('Client fetch error:', clientError);
        setLoading(false);
        return;
      }

      if (!clientData.assigned_consultant_id) {
        console.log('No consultant assigned yet');
        setLoading(false);
        return;
      }

      setConsultant(clientData.consultant);

      // Fetch custom services from assigned consultant
      const { data: servicesData, error: servicesError } = await supabase
        .from('custom_services')
        .select(`
          *,
          consultant:user_profiles!custom_services_consultant_id_fkey(full_name, email)
        `)
        .eq('consultant_id', clientData.assigned_consultant_id)
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (servicesError) {
        console.error('Services fetch error:', servicesError);
        setLoading(false);
        return;
      }

      console.log('Fetched services:', servicesData?.length || 0);
      setServices(servicesData || []);
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderService = async (service: CustomService) => {
    try {
      setOrdering(service.id);

      // Get client data
      const { data: clientData } = await supabase
        .from('clients')
        .select('id, assigned_consultant_id')
        .eq('profile_id', user?.id)
        .single();

      if (!clientData) {
        throw new Error('Client data not found');
      }

      // Create service order
      const { data: orderData, error: orderError } = await supabase
        .from('service_orders')
        .insert({
          client_id: clientData.id,
          consultant_id: service.consultant_id,
          custom_service_id: service.id,
          title: service.title_i18n?.en || 'Custom Service',
          description: service.description_i18n?.en || '',
          total_amount: service.price,
          currency: service.currency,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) {
        throw orderError;
      }

      // Create Stripe checkout session
      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke(
        'create-stripe-checkout',
        {
          body: {
            service_order_id: orderData.id,
            amount: Math.round(service.price * 100), // Convert to cents
            currency: service.currency.toLowerCase(),
            title: service.title_i18n?.en || 'Custom Service',
            description: service.description_i18n?.en || 'Professional consulting service',
            success_url: `${window.location.origin}/billing?payment=success&order_id=${orderData.id}`,
            cancel_url: `${window.location.origin}/services?payment=cancelled`
          }
        }
      );

      if (checkoutError) {
        throw checkoutError;
      }

      // Redirect to Stripe Checkout
      if (checkoutData?.url) {
        window.location.href = checkoutData.url;
      }

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'service_ordered',
          description: `Ordered service: ${service.title_i18n?.en}`,
          payload: { 
            service_id: service.id,
            amount: service.price,
            currency: service.currency
          }
        });

    } catch (err) {
      console.error('Service order error:', err);
      alert('Failed to order service. Please try again.');
    } finally {
      setOrdering(null);
    }
  };

  const getLocalizedText = (i18nObj: any, fallback: string = '') => {
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
      case 'one_time': return 'One-time payment';
      case 'monthly': return 'Monthly subscription';
      case 'quarterly': return 'Quarterly subscription';
      case 'yearly': return 'Yearly subscription';
      default: return 'One-time payment';
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
    
    const matchesPrice = 
      priceFilter === 'all' ||
      (priceFilter === 'free' && service.price === 0) ||
      (priceFilter === 'under_500' && service.price < 500) ||
      (priceFilter === 'under_1000' && service.price < 1000) ||
      (priceFilter === 'over_1000' && service.price >= 1000);
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const categories = [...new Set(services.map(s => s.category))];
  const featuredServices = filteredServices.filter(s => s.is_featured);
  const regularServices = filteredServices.filter(s => !s.is_featured);

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Available Services - Client Portal</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!consultant) {
    return (
      <>
        <Helmet>
          <title>Available Services - Client Portal</title>
        </Helmet>
        
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Available Services</h1>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <User className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-yellow-900 mb-4">No Consultant Assigned</h3>
            <p className="text-yellow-800 mb-6">
              You need to be assigned to a consultant to view available services. 
              This usually happens within 24 hours of account creation.
            </p>
            <div className="bg-white rounded-lg p-4 border border-yellow-300 max-w-md mx-auto">
              <h4 className="font-semibold text-gray-900 mb-2">📋 Next Steps:</h4>
              <ol className="text-sm text-gray-700 text-left space-y-1">
                <li>1. Wait for consultant assignment</li>
                <li>2. Receive welcome message</li>
                <li>3. Browse custom services</li>
                <li>4. Place your first order</li>
              </ol>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Available Services - Client Portal</title>
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Available Services</h1>
          <p className="text-gray-600 mt-1">
            Custom services from your consultant: <span className="font-semibold text-blue-600">{consultant.full_name}</span>
          </p>
        </div>

        {/* Service Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Services</p>
                <p className="text-3xl font-bold text-gray-900">{services.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Featured</p>
                <p className="text-3xl font-bold text-yellow-600">{featuredServices.length}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-3xl font-bold text-purple-600">{categories.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Price</p>
                <p className="text-3xl font-bold text-green-600">
                  ${services.length > 0 ? Math.round(services.reduce((sum, s) => sum + s.price, 0) / services.length).toLocaleString() : '0'}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
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
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Prices</option>
              <option value="free">Free</option>
              <option value="under_500">Under $500</option>
              <option value="under_1000">Under $1,000</option>
              <option value="over_1000">$1,000+</option>
            </select>
          </div>
        </div>

        {/* Featured Services */}
        {featuredServices.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-orange-50">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Star className="w-6 h-6 mr-2 text-yellow-600" />
                Featured Services
              </h2>
              <p className="text-sm text-gray-600">Recommended services from your consultant</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredServices.map((service) => (
                  <div key={service.id} className="relative border-2 border-yellow-200 rounded-xl p-6 bg-gradient-to-br from-yellow-50 to-orange-50 hover:shadow-lg transition-all duration-200">
                    {/* Featured Badge */}
                    <div className="absolute -top-3 -right-3">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                        <Star className="w-4 h-4 text-white fill-current" />
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {getLocalizedText(service.title_i18n, 'Untitled Service')}
                        </h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          {service.category}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        {getLocalizedText(service.description_i18n, 'No description available')}
                      </p>
                      
                      {/* Features */}
                      {service.features_i18n && getLocalizedText(service.features_i18n, []).length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">✨ Features:</h4>
                          <ul className="text-xs text-gray-700 space-y-1">
                            {getLocalizedText(service.features_i18n, []).slice(0, 3).map((feature: string, index: number) => (
                              <li key={index} className="flex items-center">
                                <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-gray-900">
                            ${service.price.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">
                            {getBillingTypeText(service.billing_type)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">{service.currency}</div>
                          <div className="text-xs text-gray-500">
                            by {service.consultant.full_name}
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOrderService(service)}
                      disabled={ordering === service.id}
                      className="w-full px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 transition-all duration-200 font-semibold"
                    >
                      {ordering === service.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4 mr-2 inline" />
                          Order Now
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Regular Services */}
        {regularServices.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Briefcase className="w-6 h-6 mr-2 text-blue-600" />
                All Services ({regularServices.length})
              </h2>
              <p className="text-sm text-gray-600">Professional consulting services tailored for your needs</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularServices.map((service) => (
                  <div key={service.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200">
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {getLocalizedText(service.title_i18n, 'Untitled Service')}
                        </h3>
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                          {service.category}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        {getLocalizedText(service.description_i18n, 'No description available')}
                      </p>
                      
                      {/* Features */}
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
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-gray-900">
                            ${service.price.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">
                            {getBillingTypeText(service.billing_type)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">{service.currency}</div>
                          <div className="text-xs text-gray-500">
                            by {service.consultant.full_name}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button 
                        onClick={() => {
                          alert(`Service Details:\n\nTitle: ${getLocalizedText(service.title_i18n, 'Untitled Service')}\n\nDescription: ${getLocalizedText(service.description_i18n, 'No description')}\n\nPrice: $${service.price} ${service.currency}\n\nBilling: ${getBillingTypeText(service.billing_type)}\n\nConsultant: ${service.consultant.full_name}`);
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      >
                        <Eye className="w-4 h-4 mr-1 inline" />
                        Details
                      </button>
                      <button
                        onClick={() => handleOrderService(service)}
                        disabled={ordering === service.id}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
                      >
                        {ordering === service.id ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1 inline-block"></div>
                            Ordering...
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3 h-3 mr-1 inline" />
                            Order
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* No Services Available */}
        {services.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Services Available Yet</h3>
            <p className="text-gray-600 mb-6">
              Your consultant <strong>{consultant.full_name}</strong> hasn't created any custom services yet. 
              They will add specialized services based on your business needs.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">💼 Custom Services</h4>
              <p className="text-xs text-blue-800">
                Your consultant will create personalized service packages for your specific 
                business expansion needs. These may include company formation, tax planning, 
                banking solutions, and legal compliance services.
              </p>
            </div>
            <div className="mt-6 flex justify-center space-x-3">
              <Link
                to="/messages"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <User className="w-4 h-4 mr-2" />
                Contact Consultant
              </Link>
              <Link
                to="/meetings"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Consultation
              </Link>
            </div>
          </div>
        )}

        {/* Consultant Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Consultant</h3>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{consultant.full_name}</h4>
              <p className="text-sm text-gray-600">{consultant.email}</p>
              <p className="text-xs text-gray-500">Specialized in international business expansion</p>
            </div>
            <div className="flex space-x-2">
              <Link
                to="/messages"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <User className="w-4 h-4 mr-2" />
                View Profile
              </Link>
              <Link
                to="/meetings"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Meeting
              </Link>
            </div>
          </div>
        </div>

        {/* Custom Service Request */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🌍 Need Services from Other Countries?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Request Custom Services</h4>
              <p className="text-gray-600 text-sm mb-4">
                Need services outside your consultant's expertise or from different countries? 
                Create a custom service request to access our global network of specialists.
              </p>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Banking services in USA, UAE, or Europe
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Visa and immigration consulting
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Specialized legal or tax advice
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                  Market research in specific regions
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">How It Works</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs font-bold text-blue-600">1</span>
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-gray-900">Submit Request</h5>
                    <p className="text-xs text-gray-600">Create a service request with your specific needs</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs font-bold text-purple-600">2</span>
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-gray-900">Consultant Review</h5>
                    <p className="text-xs text-gray-600">Your consultant evaluates and assigns to specialist</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs font-bold text-green-600">3</span>
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-gray-900">Expert Connection</h5>
                    <p className="text-xs text-gray-600">Get connected with the right specialist automatically</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <Link
                  to="/support"
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Request Custom Service
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* Service Categories Info */}
        {categories.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category, index) => {
                const categoryServices = services.filter(s => s.category === category);
                const avgPrice = categoryServices.reduce((sum, s) => sum + s.price, 0) / categoryServices.length;
                
                return (
                  <div key={category} className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-2xl mb-2">
                      {category === 'Company Formation' && '🏢'}
                      {category === 'Tax Planning' && '💰'}
                      {category === 'Banking' && '🏦'}
                      {category === 'Legal' && '⚖️'}
                      {category === 'Compliance' && '📋'}
                      {!['Company Formation', 'Tax Planning', 'Banking', 'Legal', 'Compliance'].includes(category) && '💼'}
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm">{category}</h4>
                    <p className="text-xs text-gray-600">{categoryServices.length} services</p>
                    <p className="text-xs text-gray-500">Avg: ${Math.round(avgPrice).toLocaleString()}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ClientServices;
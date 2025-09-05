import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  Briefcase, 
  DollarSign, 
  Plus, 
  Star, 
  Clock,
  CheckCircle,
  MessageSquare,
  Calendar,
  Search,
  Filter,
  ShoppingCart,
  Send
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface CustomService {
  id: string;
  title_i18n: any;
  description_i18n: any;
  features_i18n: any;
  category: string;
  price: number;
  currency: string;
  billing_type: string;
  is_active: boolean;
  is_featured: boolean;
  consultant_id: string;
}

const ClientServices = () => {
  const { user, profile } = useAuth();
  const [services, setServices] = useState<CustomService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showCustomRequestModal, setShowCustomRequestModal] = useState(false);
  const [customRequest, setCustomRequest] = useState({
    title: '',
    description: '',
    urgency: 'medium',
    budget: ''
  });
  const [submittingRequest, setSubmittingRequest] = useState(false);

  useEffect(() => {
    if (user && profile) {
      fetchServices();
    }
  }, [user, profile]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      
      // Get client's assigned consultant
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('assigned_consultant_id')
        .eq('profile_id', user?.id)
        .maybeSingle();

      if (clientError) {
        console.error('❌ Client fetch error:', clientError);
        setError('Database error occurred');
        return;
      }

      if (!clientData) {
        console.log('❌ No client record found for this user');
        setError('Client record not found');
        return;
      }

      if (!clientData?.assigned_consultant_id) {
        console.log('Client has no assigned consultant');
        setError('No consultant assigned yet');
        return;
      }

      // Verify consultant exists and is active
      const { data: consultantData, error: consultantError } = await supabase
        .from('user_profiles')
        .select('id, full_name')
        .eq('id', clientData.assigned_consultant_id)
        .eq('role', 'consultant')
        .eq('is_active', true)
        .maybeSingle();

      if (consultantError) {
        console.error('❌ Consultant fetch error:', consultantError);
        setError('Error fetching consultant information');
        return;
      }

      if (!consultantData) {
        console.log('❌ Consultant not found or inactive');
        setError('Assigned consultant not available');
        return;
      }

      console.log('Services from consultant:', consultantData.full_name);
      // Fetch consultant's active services
      const { data: servicesData, error: servicesError } = await supabase
        .from('custom_services')
        .select('*')
        .eq('consultant_id', clientData.assigned_consultant_id)
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (servicesError) {
        console.error('Error fetching services:', servicesError);
        setError('Unable to fetch services');
        return;
      }

      console.log('Found services count:', servicesData?.length || 0);
      setServices(servicesData || []);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleServicePurchase = async (service: CustomService) => {
    try {
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
      const { error: orderError } = await supabase
        .from('service_orders')
        .insert({
          client_id: clientData.id,
          consultant_id: clientData.assigned_consultant_id,
          custom_service_id: service.id,
          title: service.title_i18n?.en || 'Service Order',
          description: service.description_i18n?.en || '',
          total_amount: service.price,
          currency: service.currency,
          status: 'pending'
        });

      if (orderError) {
        throw orderError;
      }

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'service_purchase',
          description: `Purchased service: ${service.title_i18n?.en}`,
          payload: { 
            service_id: service.id,
            service_title: service.title_i18n?.en,
            amount: service.price,
            currency: service.currency
          }
        });

      // Notify consultant
      await supabase.functions.invoke('notify', {
        body: {
          recipient_id: clientData.assigned_consultant_id,
          type: 'service_ordered',
          payload: {
            client_name: profile?.full_name,
            service_title: service.title_i18n?.en,
            amount: service.price,
            currency: service.currency
          },
          email_notification: true
        }
      });

      alert('Service ordered successfully! Your consultant will contact you soon.');
    } catch (err) {
      console.error('Purchase error:', err);
      alert('Failed to order service. Please try again.');
    }
  };

  const handleCustomServiceRequest = async () => {
    if (!customRequest.title.trim() || !customRequest.description.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setSubmittingRequest(true);

      // Get client data
      const { data: clientData } = await supabase
        .from('clients')
        .select('id, assigned_consultant_id')
        .eq('profile_id', user?.id)
        .single();

      if (!clientData) {
        throw new Error('Client data not found');
      }

      // Create pending service order for custom request
      const { error: orderError } = await supabase
        .from('service_orders')
        .insert({
          client_id: clientData.id,
          consultant_id: clientData.assigned_consultant_id,
          title: `Custom Request: ${customRequest.title}`,
          description: customRequest.description,
          total_amount: 0, // Will be set by consultant
          currency: 'USD',
          status: 'pending',
          customer_details: {
            urgency: customRequest.urgency,
            estimated_budget: customRequest.budget
          }
        });

      if (orderError) {
        throw orderError;
      }

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'custom_service_request',
          description: `Requested custom service: ${customRequest.title}`,
          payload: customRequest
        });

      // Notify consultant
      await supabase.functions.invoke('notify', {
        body: {
          recipient_id: clientData.assigned_consultant_id,
          type: 'custom_service_request',
          payload: {
            client_name: profile?.full_name,
            service_title: customRequest.title,
            description: customRequest.description,
            urgency: customRequest.urgency,
            budget: customRequest.budget
          },
          email_notification: true
        }
      });

      alert('Custom service request submitted successfully!');
      setShowCustomRequestModal(false);
      setCustomRequest({ title: '', description: '', urgency: 'medium', budget: '' });
    } catch (err) {
      console.error('Custom request error:', err);
      alert('Failed to submit custom request. Please try again.');
    } finally {
      setSubmittingRequest(false);
    }
  };

  const filteredServices = services.filter(service => {
    const title = service.title_i18n?.en || '';
    const description = service.description_i18n?.en || '';
    
    const matchesSearch = 
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(services.map(s => s.category))];

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Services - Client Portal</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
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

  if (error) {
    return (
      <>
        <Helmet>
          <title>Services - Client Portal</title>
        </Helmet>
        
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Services</h1>
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-6 rounded-lg text-center">
            <Briefcase className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">No Consultant Assigned</h3>
            <p className="text-sm">
              You need to be assigned to a consultant to view and purchase services. 
              This typically happens after your initial consultation or service purchase.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Services - Client Portal</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Available Services</h1>
            <p className="text-gray-600 mt-1">Browse and purchase services from your consultant</p>
          </div>
          <button 
            onClick={() => setShowCustomRequestModal(true)}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Request Custom Service
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div key={service.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {service.title_i18n?.en || 'Service'}
                        </h3>
                        {service.is_featured && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mb-3">
                        {service.category}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {service.description_i18n?.en || 'No description available'}
                  </p>

                  {/* Features */}
                  {service.features_i18n?.en && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Features:</h4>
                      <ul className="space-y-1">
                        {service.features_i18n.en.slice(0, 3).map((feature: string, index: number) => (
                          <li key={index} className="flex items-center text-xs text-gray-600">
                            <CheckCircle className="w-3 h-3 text-green-600 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                        {service.features_i18n.en.length > 3 && (
                          <li className="text-xs text-gray-500">
                            +{service.features_i18n.en.length - 3} more features
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Pricing */}
                  <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          ${service.price.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">
                          {service.billing_type.replace('_', ' ')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Currency</div>
                        <div className="text-sm font-medium">{service.currency}</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button 
                      onClick={() => handleServicePurchase(service)}
                      className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2 inline" />
                      Order Service
                    </button>
                    <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <MessageSquare className="w-4 h-4 mr-2 inline" />
                      Ask Questions
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Services Available</h3>
            <p className="text-gray-600 mb-6">
              Your consultant hasn't published any services yet, or you need to be assigned to a consultant first.
            </p>
            <button 
              onClick={() => setShowCustomRequestModal(true)}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Request Custom Service
            </button>
          </div>
        )}

        {/* Custom Service Request Modal */}
        {showCustomRequestModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Request Custom Service</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Title *
                  </label>
                  <input
                    type="text"
                    value={customRequest.title}
                    onChange={(e) => setCustomRequest(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Special License Application"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={customRequest.description}
                    onChange={(e) => setCustomRequest(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what you need in detail..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Urgency
                  </label>
                  <select
                    value={customRequest.urgency}
                    onChange={(e) => setCustomRequest(prev => ({ ...prev, urgency: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low - No rush</option>
                    <option value="medium">Medium - Standard timing</option>
                    <option value="high">High - Priority</option>
                    <option value="urgent">Urgent - ASAP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Budget (Optional)
                  </label>
                  <input
                    type="text"
                    value={customRequest.budget}
                    onChange={(e) => setCustomRequest(prev => ({ ...prev, budget: e.target.value }))}
                    placeholder="e.g., $1,000 - $2,000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-3 mt-6">
                <button
                  onClick={() => setShowCustomRequestModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCustomServiceRequest}
                  disabled={submittingRequest || !customRequest.title.trim() || !customRequest.description.trim()}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {submittingRequest ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2 inline" />
                      Submit Request
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ClientServices;
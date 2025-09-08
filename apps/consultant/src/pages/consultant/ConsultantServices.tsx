import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, DollarSign, Globe, Star, ToggleLeft, ToggleRight, Save, X } from 'lucide-react';
import { useAuth } from '@consulting19/shared';
import { supabase } from '@consulting19/shared/lib/supabase';

interface CustomService {
  id: string;
  title_i18n: any;
  description_i18n: any;
  features_i18n: any;
  price: number;
  currency: string;
  billing_type: string;
  category: string;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

const ConsultantServices = () => {
  const { user, profile } = useAuth();
  const [services, setServices] = useState<CustomService[]>([]);
  const [loading, setLoading] = useState(true);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<CustomService | null>(null);
  const [newService, setNewService] = useState({
    title_en: '',
    description_en: '',
    features_en: [''],
    category: 'general',
    price: 0,
    currency: 'USD',
    billing_type: 'one_time',
    is_featured: false
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user && profile) {
      fetchServices();
    }
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      
      const { data: servicesData, error: servicesError } = await supabase
        .from('custom_services')
        .select('*')
        .eq('consultant_id', user?.id)
        .order('created_at', { ascending: false });

      if (servicesError) {
        console.error('Error fetching services:', servicesError);
        return;
      }

      setServices(servicesData || []);
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  const createService = async () => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('custom_services')
        .insert({
          consultant_id: user?.id,
          title_i18n: { en: newService.title_en },
          description_i18n: { en: newService.description_en },
          features_i18n: { en: newService.features_en.filter(f => f.trim()) },
          category: newService.category,
          price: newService.price,
          currency: newService.currency,
          billing_type: newService.billing_type,
          is_featured: newService.is_featured,
          is_active: true
        });

      if (error) {
        throw error;
      }

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'service_created',
          description: `Created new service: ${newService.title_en}`,
          payload: newService
        });

      alert('Service created successfully!');
      setShowServiceForm(false);
      setNewService({
        title_en: '',
        description_en: '',
        features_en: [''],
        category: 'general',
        price: 0,
        currency: 'USD',
        billing_type: 'one_time',
        is_featured: false
      });
      fetchServices();
    } catch (err) {
      console.error('Error creating service:', err);
      alert('Failed to create service');
    } finally {
      setSaving(false);
    }
  };

  const toggleServiceStatus = (serviceId: string, currentStatus: boolean) => {
    updateServiceStatus(serviceId, !currentStatus);
  };

  const updateServiceStatus = async (serviceId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('custom_services')
        .update({ is_active: isActive })
        .eq('id', serviceId);

      if (error) {
        throw error;
      }

      fetchServices();
    } catch (err) {
      console.error('Error updating service status:', err);
    }
  };

  const deleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const { error } = await supabase
        .from('custom_services')
        .delete()
        .eq('id', serviceId);

      if (error) {
        throw error;
      }

      fetchServices();
    } catch (err) {
      console.error('Error deleting service:', err);
      alert('Failed to delete service');
    }
  };

  const getLocalizedText = (i18nObj: any, fallback: string = '') => {
    if (!i18nObj || typeof i18nObj !== 'object') return fallback;
    return i18nObj.en || fallback;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Services</h1>
              <p className="text-gray-600">Create and manage your custom services</p>
            </div>
            <button 
              onClick={() => setShowServiceForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Service
            </button>
          </div>
        </div>

        {/* Services Grid */}
        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="p-6">
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
                        {getLocalizedText(service.description_i18n, 'No description')}
                      </p>
                    </div>
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

                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Price:</span>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          ${service.price.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">
                          {service.billing_type.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium text-gray-900">{service.category}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Eye className="w-4 h-4 mr-1 inline" />
                      Preview
                    </button>
                    <button 
                      onClick={() => setEditingService(service)}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Edit className="w-4 h-4 mr-1 inline" />
                      Edit
                    </button>
                    <button 
                      onClick={() => deleteService(service.id)}
                      className="px-3 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Services Created Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first custom service to start offering specialized solutions to clients
            </p>
            <button 
              onClick={() => setShowServiceForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Service
            </button>
          </div>
        )}

        {/* Service Creation Modal */}
        {showServiceForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Service</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Title *
                  </label>
                  <input
                    type="text"
                    value={newService.title_en}
                    onChange={(e) => setNewService(prev => ({ ...prev, title_en: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Company Formation in Georgia"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={newService.description_en}
                    onChange={(e) => setNewService(prev => ({ ...prev, description_en: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Describe your service..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newService.price}
                      onChange={(e) => setNewService(prev => ({ ...prev, price: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <select
                      value={newService.currency}
                      onChange={(e) => setNewService(prev => ({ ...prev, currency: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={newService.category}
                    onChange={(e) => setNewService(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="general">General</option>
                    <option value="company_formation">Company Formation</option>
                    <option value="tax_planning">Tax Planning</option>
                    <option value="banking">Banking</option>
                    <option value="legal">Legal</option>
                    <option value="compliance">Compliance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Billing Type
                  </label>
                  <select
                    value={newService.billing_type}
                    onChange={(e) => setNewService(prev => ({ ...prev, billing_type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="one_time">One-time Payment</option>
                    <option value="monthly">Monthly Subscription</option>
                    <option value="quarterly">Quarterly Subscription</option>
                    <option value="yearly">Yearly Subscription</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newService.is_featured}
                      onChange={(e) => setNewService(prev => ({ ...prev, is_featured: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Featured Service</span>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 mt-6">
                <button
                  onClick={() => setShowServiceForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createService}
                  disabled={saving || !newService.title_en.trim() || !newService.description_en.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2 inline" />
                      Create Service
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultantServices;
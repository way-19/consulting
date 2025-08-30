import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, DollarSign, Clock, Globe, Tag, Languages, Loader, Building2, Calculator, CreditCard, FileText, Shield, TrendingUp, Users, BarChart3 } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { deepLTranslator, useAuth } from '@consulting19/shared';
import { supabase } from '@consulting19/supabase';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

interface Service {
  id: string;
  title: string;
  description: string;
  meta_keywords: string[] | null;
  meta_description: string | null;
  title_tr: string | null;
  description_tr: string | null;
  meta_keywords_tr: string[] | null;
  meta_description_tr: string | null;
  title_pt: string | null;
  description_pt: string | null;
  meta_keywords_pt: string[] | null;
  meta_description_pt: string | null;
  price: number | null;
  is_recurring: boolean;
  billing_period: string | null;
  image_url: string | null;
  is_public: boolean;
  is_active: boolean;
  is_marketing_service: boolean;
  country_id: string | null;
  created_at: string;
}

const ServicesManagement = () => {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching services:', error);
      } else {
        setServices(data || []);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);

      if (error) {
        console.error('Error deleting service:', error);
        alert('Error deleting service');
      } else {
        alert('Service deleted successfully!');
        fetchServices();
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred');
    }
  };

  const toggleServiceStatus = async (serviceId: string, field: 'is_active' | 'is_public' | 'is_marketing_service') => {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;

    try {
      const { error } = await supabase
        .from('services')
        .update({ [field]: !service[field] })
        .eq('id', serviceId);

      if (error) {
        console.error('Error updating service:', error);
        alert('Error updating service');
      } else {
        setServices(prev => prev.map(s => 
          s.id === serviceId ? { ...s, [field]: !s[field] } : s
        ));
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred');
    }
  };

  const getServiceIcon = (title: string) => {
    if (title.toLowerCase().includes('formation') || title.toLowerCase().includes('company')) return Building2;
    if (title.toLowerCase().includes('tax')) return Calculator;
    if (title.toLowerCase().includes('banking')) return CreditCard;
    if (title.toLowerCase().includes('legal')) return FileText;
    if (title.toLowerCase().includes('asset')) return Shield;
    if (title.toLowerCase().includes('investment')) return TrendingUp;
    if (title.toLowerCase().includes('visa')) return Users;
    if (title.toLowerCase().includes('market')) return BarChart3;
    return Globe;
  };

  const getServiceCategory = (title: string) => {
    if (title.toLowerCase().includes('formation') || title.toLowerCase().includes('company')) return 'Company Formation';
    if (title.toLowerCase().includes('tax')) return 'Tax Optimization';
    if (title.toLowerCase().includes('banking')) return 'Banking Solutions';
    if (title.toLowerCase().includes('legal')) return 'Legal Compliance';
    if (title.toLowerCase().includes('asset')) return 'Asset Protection';
    if (title.toLowerCase().includes('investment')) return 'Investment Advisory';
    if (title.toLowerCase().includes('visa')) return 'Visa & Residency';
    if (title.toLowerCase().includes('market')) return 'Market Research';
    return 'Other Services';
  };

  // Group services by marketing vs country-specific
  const marketingServices = services.filter(s => s.is_marketing_service);
  const countryServices = services.filter(s => !s.is_marketing_service);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Services Management</h1>
                <p className="text-gray-600">Manage marketing services and country-specific offerings</p>
              </div>
              <Button 
                icon={Plus} 
                iconPosition="left"
                onClick={() => setShowAddModal(true)}
              >
                Add New Service
              </Button>
            </div>
          </div>

          {/* Marketing Services Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Marketing Services</h2>
                <p className="text-gray-600">Services displayed on the main marketing website</p>
              </div>
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <span className="text-blue-800 font-medium">{marketingServices.length} services</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {marketingServices.map((service) => {
                const ServiceIcon = getServiceIcon(service.title);
                const category = getServiceCategory(service.title);
                
                return (
                  <Card key={service.id} hover>
                    <div className="h-48 overflow-hidden rounded-t-xl relative">
                      <img 
                        src={service.image_url || 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400'}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute top-3 left-3">
                        <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                          <ServiceIcon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          Marketing
                        </span>
                      </div>
                    </div>
                    
                    <Card.Body>
                      <div className="mb-3">
                        <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded">
                          {category}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                        {service.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {service.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
                        {service.price && (
                          <div className="flex items-center">
                            <DollarSign className="w-3 h-3 mr-1" />
                            ${service.price.toLocaleString()}
                          </div>
                        )}
                        <div className="flex space-x-2">
                          <span className={`w-2 h-2 rounded-full ${service.is_active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          <span className={`w-2 h-2 rounded-full ${service.is_public ? 'bg-blue-500' : 'bg-gray-500'}`}></span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          icon={Edit}
                          onClick={() => setEditingService(service)}
                          className="flex-1"
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          icon={Eye}
                          className="flex-1"
                        >
                          Preview
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          icon={Trash2}
                          onClick={() => handleDeleteService(service.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                );
              })}
            </div>

            {marketingServices.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
                <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Marketing Services</h3>
                <p className="text-gray-600 mb-4">Add services to display on the marketing website</p>
                <Button onClick={() => setShowAddModal(true)}>
                  Add First Marketing Service
                </Button>
              </div>
            )}
          </div>

          {/* Country-Specific Services Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Country-Specific Services</h2>
                <p className="text-gray-600">Services managed by individual consultants</p>
              </div>
              <div className="bg-green-50 px-4 py-2 rounded-lg">
                <span className="text-green-800 font-medium">{countryServices.length} services</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {countryServices.map((service) => {
                const ServiceIcon = getServiceIcon(service.title);
                const category = getServiceCategory(service.title);
                
                return (
                  <Card key={service.id} hover>
                    <div className="h-32 overflow-hidden rounded-t-xl relative">
                      <img 
                        src={service.image_url || 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400'}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute top-2 left-2">
                        <div className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                          <ServiceIcon className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className="absolute top-2 right-2">
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          Country
                        </span>
                      </div>
                    </div>
                    
                    <Card.Body className="p-4">
                      <div className="mb-2">
                        <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded">
                          {category}
                        </span>
                      </div>
                      
                      <h3 className="text-md font-semibold text-gray-900 mb-2 line-clamp-1">
                        {service.title}
                      </h3>
                      
                      <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                        {service.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
                        {service.price && (
                          <div className="flex items-center">
                            <DollarSign className="w-3 h-3 mr-1" />
                            ${service.price.toLocaleString()}
                          </div>
                        )}
                        <div className="flex space-x-1">
                          <span className={`w-2 h-2 rounded-full ${service.is_active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          <span className={`w-2 h-2 rounded-full ${service.is_public ? 'bg-blue-500' : 'bg-gray-500'}`}></span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-1">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          icon={Edit}
                          onClick={() => setEditingService(service)}
                          className="flex-1 text-xs py-1"
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          icon={Trash2}
                          onClick={() => handleDeleteService(service.id)}
                          className="text-red-600 hover:text-red-700 text-xs py-1"
                        >
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                );
              })}
            </div>

            {countryServices.length === 0 && (
              <div className="text-center py-8 bg-white rounded-xl border border-gray-200">
                <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Country Services</h3>
                <p className="text-gray-600 text-sm">Country-specific services will appear here</p>
              </div>
            )}
          </div>

          {/* Add/Edit Service Modal */}
          {(showAddModal || editingService) && (
            <ServiceModal 
              service={editingService}
              onClose={() => {
                setShowAddModal(false);
                setEditingService(null);
              }}
              onSave={() => {
                setShowAddModal(false);
                setEditingService(null);
                fetchServices();
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
};

// Service Modal Component
interface ServiceModalProps {
  service?: Service;
  onClose: () => void;
  onSave: () => void;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ service, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: service?.title || '',
    description: service?.description || '',
    meta_keywords: service?.meta_keywords?.join(', ') || '',
    meta_description: service?.meta_description || '',
    title_tr: service?.title_tr || '',
    description_tr: service?.description_tr || '',
    title_pt: service?.title_pt || '',
    description_pt: service?.description_pt || '',
    price: service?.price || 0,
    is_recurring: service?.is_recurring || false,
    billing_period: service?.billing_period || '',
    image_url: service?.image_url || '',
    is_public: service?.is_public ?? true,
    is_active: service?.is_active ?? true,
    is_marketing_service: service?.is_marketing_service ?? true,
    country_id: service?.country_id || null,
  });
  const [saving, setSaving] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Please fill in the English title and description first');
      return;
    }

    setIsTranslating(true);
    try {
      // Translate to Turkish
      const titleTr = await deepLTranslator.translate(formData.title, 'EN', 'TR');
      const descriptionTr = await deepLTranslator.translate(formData.description, 'EN', 'TR');
      
      // Translate to Portuguese
      const titlePt = await deepLTranslator.translate(formData.title, 'EN', 'PT');
      const descriptionPt = await deepLTranslator.translate(formData.description, 'EN', 'PT');

      setFormData(prev => ({
        ...prev,
        title_tr: titleTr,
        description_tr: descriptionTr,
        title_pt: titlePt,
        description_pt: descriptionPt,
      }));

      alert('Translation completed successfully!');
    } catch (error) {
      console.error('Translation error:', error);
      alert('Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const keywordsArray = formData.meta_keywords
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0);

      const serviceData = {
        title: formData.title,
        description: formData.description,
        meta_keywords: keywordsArray.length > 0 ? keywordsArray : null,
        meta_description: formData.meta_description || null,
        title_tr: formData.title_tr || null,
        description_tr: formData.description_tr || null,
        title_pt: formData.title_pt || null,
        description_pt: formData.description_pt || null,
        price: formData.price || null,
        is_recurring: formData.is_recurring,
        billing_period: formData.billing_period || null,
        image_url: formData.image_url || null,
        is_public: formData.is_public,
        is_active: formData.is_active,
        is_marketing_service: formData.is_marketing_service,
        country_id: formData.country_id,
      };

      if (service) {
        // Update existing service
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', service.id);

        if (error) {
          console.error('Error updating service:', error);
          alert('Error updating service');
          return;
        }
      } else {
        // Create new service
        const { error } = await supabase
          .from('services')
          .insert(serviceData);

        if (error) {
          console.error('Error creating service:', error);
          alert('Error creating service');
          return;
        }
      }

      alert(service ? 'Service updated successfully!' : 'Service created successfully!');
      onSave();
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {service ? 'Edit Service' : 'Add New Service'}
          </h2>
          <div className="flex space-x-2">
            <Button
              icon={Languages}
              iconPosition="left"
              onClick={handleTranslate}
              disabled={isTranslating || !formData.title.trim() || !formData.description.trim()}
              loading={isTranslating}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isTranslating ? 'Translating...' : 'Translate'}
            </Button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Title (English) *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
                placeholder="e.g., UAE Company Formation"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price ($)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                min="0"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (English) *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Detailed description of the service..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="https://images.pexels.com/..."
            />
          </div>

          {/* Translations */}
          {isTranslating && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <Loader className="w-5 h-5 text-blue-600 animate-spin mr-3" />
                <span className="text-blue-800">Translating service using DeepL AI...</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🇹🇷 Title (Turkish)
              </label>
              <input
                type="text"
                value={formData.title_tr}
                onChange={(e) => setFormData(prev => ({ ...prev, title_tr: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Türkçe hizmet başlığı"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🇵🇹 Title (Portuguese)
              </label>
              <input
                type="text"
                value={formData.title_pt}
                onChange={(e) => setFormData(prev => ({ ...prev, title_pt: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Título do serviço em português"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🇹🇷 Description (Turkish)
              </label>
              <textarea
                value={formData.description_tr}
                onChange={(e) => setFormData(prev => ({ ...prev, description_tr: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Türkçe hizmet açıklaması"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🇵🇹 Description (Portuguese)
              </label>
              <textarea
                value={formData.description_pt}
                onChange={(e) => setFormData(prev => ({ ...prev, description_pt: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Descrição do serviço em português"
              />
            </div>
          </div>

          {/* SEO Meta Data */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Description (SEO)
            </label>
            <textarea
              value={formData.meta_description}
              onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description for search engines (150-160 characters)"
              maxLength={160}
            />
            <div className="text-xs text-gray-500 mt-1">
              {formData.meta_description.length}/160 characters
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Keywords (SEO)
            </label>
            <input
              type="text"
              value={formData.meta_keywords}
              onChange={(e) => setFormData(prev => ({ ...prev, meta_keywords: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="keyword1, keyword2, keyword3"
            />
          </div>

          {/* Service Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Service Settings</h3>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_recurring}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_recurring: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Recurring Service</span>
              </label>

              {formData.is_recurring && (
                <select
                  value={formData.billing_period}
                  onChange={(e) => setFormData(prev => ({ ...prev, billing_period: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Period</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Visibility Settings</h3>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_marketing_service}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_marketing_service: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Marketing Service</span>
                <span className="ml-2 text-xs text-gray-500">(Show on main website)</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_public}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_public: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Public Service</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Active</span>
              </label>
            </div>
          </div>

          <div className="flex space-x-4 pt-6">
            <Button type="submit" className="flex-1" loading={saving}>
              {saving ? 'Saving...' : (service ? 'Update Service' : 'Create Service')}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServicesManagement;
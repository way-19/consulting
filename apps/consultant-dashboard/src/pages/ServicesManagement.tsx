import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, DollarSign, Clock, Globe, HelpCircle, Tag, Languages, Loader } from 'lucide-react';
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
  created_at: string;
}

interface ServiceFAQ {
  id: string;
  question: string;
  answer: string;
  question_tr: string | null;
  answer_tr: string | null;
  question_pt: string | null;
  answer_pt: string | null;
  order_index: number;
  is_active: boolean;
}

const ServicesManagement = () => {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [managingFaqs, setManagingFaqs] = useState<Service | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  // Mock data for consultant - their own country-specific services
  const mockServices = [
    {
      id: 'c1',
      title: 'UAE Company Formation',
      description: 'Complete business setup in Dubai International Financial Centre (DIFC) free zone.',
      meta_keywords: ['UAE', 'company formation', 'DIFC', 'business setup'],
      meta_description: 'Professional UAE company formation services in DIFC free zone with banking support.',
      title_tr: 'BAE Şirket Kuruluşu',
      description_tr: 'Dubai Uluslararası Finans Merkezi (DIFC) serbest bölgesinde komple iş kurulumu.',
      title_pt: 'Formação de Empresa nos EAU',
      description_pt: 'Configuração completa de negócios na zona franca DIFC de Dubai.',
      price: 4500,
      is_recurring: false,
      billing_period: null,
      image_url: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
      is_public: true,
      is_active: true,
      created_at: '2025-01-20',
    },
    {
      id: 'c2',
      title: 'UAE Banking Solutions',
      description: 'UAE corporate banking support including Emirates NBD, ADCB, and international banks.',
      meta_keywords: ['UAE banking', 'Emirates NBD', 'ADCB', 'corporate banking'],
      meta_description: 'Professional UAE banking solutions for corporate accounts and international banking.',
      title_tr: 'BAE Bankacılık Çözümleri',
      description_tr: 'Emirates NBD, ADCB ve uluslararası bankalar dahil BAE kurumsal bankacılık desteği.',
      title_pt: 'Soluções Bancárias dos EAU',
      description_pt: 'Suporte bancário corporativo dos EAU incluindo Emirates NBD, ADCB e bancos internacionais.',
      price: 1500,
      is_recurring: false,
      billing_period: null,
      image_url: 'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=800',
      is_public: true,
      is_active: true,
      created_at: '2025-01-18',
    },
  ];

  const fetchServices = async () => {
    try {
      setLoading(true);
      // Use mock data for now until foreign keys are properly set up
      setTimeout(() => {
        setServices(mockServices);
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error('Unexpected error:', err);
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
        setServices(prev => prev.filter(s => s.id !== serviceId));
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred');
    }
  };

  const toggleServiceStatus = async (serviceId: string, field: 'is_active' | 'is_public') => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your services...</p>
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Services Management</h1>
                <p className="text-gray-600">Manage your country-specific services and FAQs</p>
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

          {/* Services Grid */}
          {services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card key={service.id} hover>
                  <div className="h-48 overflow-hidden rounded-t-xl">
                    <img 
                      src={service.image_url || 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400'}
                      alt={service.title}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <Card.Body>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 flex-1">
                        {service.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className={`w-2 h-2 rounded-full ${
                          service.is_active ? 'bg-green-500' : 'bg-red-500'
                        }`}></span>
                        <span className={`text-xs font-medium ${
                          service.is_active ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {service.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {service.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        {service.price && (
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            ${service.price.toLocaleString()}
                          </div>
                        )}
                        {service.is_recurring && (
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {service.billing_period}
                          </div>
                        )}
                        <div className="flex items-center">
                          <Globe className="w-4 h-4 mr-1" />
                          {service.is_public ? 'Public' : 'Private'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        icon={HelpCircle}
                        onClick={() => setManagingFaqs(service)}
                      >
                        Manage FAQs
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        icon={Edit}
                        onClick={() => setEditingService(service)}
                      >
                        Edit Service
                      </Button>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleServiceStatus(service.id, 'is_active')}
                        className={`flex-1 ${service.is_active ? 'text-orange-600' : 'text-green-600'}`}
                      >
                        {service.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleServiceStatus(service.id, 'is_public')}
                        className={`flex-1 ${service.is_public ? 'text-orange-600' : 'text-green-600'}`}
                      >
                        {service.is_public ? 'Make Private' : 'Make Public'}
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
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Services Yet</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Start by adding your first service for your country. Each service can have its own FAQs and detailed information.
              </p>
              <Button 
                size="lg"
                icon={Plus} 
                iconPosition="left"
                onClick={() => setShowAddModal(true)}
              >
                Add Your First Service
              </Button>
            </div>
          )}

          {/* Add Service Modal */}
          {showAddModal && (
            <ServiceModal 
              onClose={() => setShowAddModal(false)}
              onSave={() => {
                setShowAddModal(false);
                fetchServices();
              }}
            />
          )}

          {/* Edit Service Modal */}
          {editingService && (
            <ServiceModal 
              service={editingService}
              onClose={() => setEditingService(null)}
              onSave={() => {
                setEditingService(null);
                fetchServices();
              }}
            />
          )}

          {/* FAQ Management Modal */}
          {managingFaqs && (
            <FAQManagementModal 
              service={managingFaqs}
              onClose={() => setManagingFaqs(null)}
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
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: service?.title || '',
    description: service?.description || '',
    meta_keywords: service?.meta_keywords?.join(', ') || '',
    meta_description: service?.meta_description || '',
    title_tr: service?.title_tr || '',
    description_tr: service?.description_tr || '',
    meta_keywords_tr: service?.meta_keywords_tr?.join(', ') || '',
    meta_description_tr: service?.meta_description_tr || '',
    title_pt: service?.title_pt || '',
    description_pt: service?.description_pt || '',
    meta_keywords_pt: service?.meta_keywords_pt?.join(', ') || '',
    meta_description_pt: service?.meta_description_pt || '',
    price: service?.price || 0,
    is_recurring: service?.is_recurring || false,
    billing_period: service?.billing_period || '',
    image_url: service?.image_url || '',
    is_public: service?.is_public ?? true,
    is_active: service?.is_active ?? true,
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
      const metaDescTr = formData.meta_description ? await deepLTranslator.translate(formData.meta_description, 'EN', 'TR') : '';
      
      // Translate to Portuguese
      const titlePt = await deepLTranslator.translate(formData.title, 'EN', 'PT');
      const descriptionPt = await deepLTranslator.translate(formData.description, 'EN', 'PT');
      const metaDescPt = formData.meta_description ? await deepLTranslator.translate(formData.meta_description, 'EN', 'PT') : '';

      setFormData(prev => ({
        ...prev,
        title_tr: titleTr,
        description_tr: descriptionTr,
        meta_description_tr: metaDescTr,
        title_pt: titlePt,
        description_pt: descriptionPt,
        meta_description_pt: metaDescPt,
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
      const keywordsTrArray = formData.meta_keywords_tr
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0);
      const keywordsPtArray = formData.meta_keywords_pt
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
        meta_keywords_tr: keywordsTrArray.length > 0 ? keywordsTrArray : null,
        meta_description_tr: formData.meta_description_tr || null,
        title_pt: formData.title_pt || null,
        description_pt: formData.description_pt || null,
        meta_keywords_pt: keywordsPtArray.length > 0 ? keywordsPtArray : null,
        meta_description_pt: formData.meta_description_pt || null,
        price: formData.price || null,
        is_recurring: formData.is_recurring,
        billing_period: formData.billing_period || null,
        image_url: formData.image_url || null,
        is_public: formData.is_public,
        is_active: formData.is_active,
        is_marketing_service: false, // Consultant services are NEVER marketing services
        is_featured: false, // Only admin can set featured
        category: 'Consultant Service', // Consultant services category
        consultant_id: user?.id,
        country_id: null, // Will be set based on consultant's assigned country
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

// FAQ Management Modal Component
interface FAQManagementModalProps {
  service: Service;
  onClose: () => void;
}

const FAQManagementModal: React.FC<FAQManagementModalProps> = ({ service, onClose }) => {
  const [faqs, setFaqs] = useState<ServiceFAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddFaq, setShowAddFaq] = useState(false);
  const [editingFaq, setEditingFaq] = useState<ServiceFAQ | null>(null);

  useEffect(() => {
    fetchFaqs();
  }, [service.id]);

  const fetchFaqs = async () => {
    try {
      const { data, error } = await supabase
        .from('service_faqs')
        .select('*')
        .eq('service_id', service.id)
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error fetching FAQs:', error);
      } else {
        setFaqs(data || []);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFaq = async (faqId: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    const { error } = await supabase
      .from('service_faqs')
      .delete()
      .eq('id', faqId);

    if (error) {
      console.error('Error deleting FAQ:', error);
      alert('Error deleting FAQ');
    } else {
      setFaqs(prev => prev.filter(f => f.id !== faqId));
    }
  };

  const toggleActive = async (faqId: string) => {
    const faq = faqs.find(f => f.id === faqId);
    if (!faq) return;

    const { error } = await supabase
      .from('service_faqs')
      .update({ is_active: !faq.is_active })
      .eq('id', faqId);

    if (error) {
      console.error('Error updating FAQ:', error);
      alert('Error updating FAQ');
    } else {
      setFaqs(prev => prev.map(f => 
        f.id === faqId ? { ...f, is_active: !f.is_active } : f
      ));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            FAQ Management - {service.title}
          </h2>
          <div className="flex space-x-3">
            <Button 
              icon={Plus} 
              iconPosition="left"
              onClick={() => setShowAddFaq(true)}
            >
              Add FAQ
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading FAQs...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.id}>
                <Card.Body>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {faq.answer}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Order: {faq.order_index}</span>
                        <span className={`font-medium ${
                          faq.is_active ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {faq.is_active ? 'Active' : 'Inactive'}
                        </span>
                        {faq.question_tr && <span className="text-red-600">🇹🇷</span>}
                        {faq.question_pt && <span className="text-green-600">🇵🇹</span>}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setEditingFaq(faq)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleActive(faq.id)}
                        className={faq.is_active ? 'text-orange-600' : 'text-green-600'}
                      >
                        {faq.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDeleteFaq(faq.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
            
            {faqs.length === 0 && (
              <div className="text-center py-8">
                <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No FAQs Yet</h3>
                <p className="text-gray-600 mb-4">Add frequently asked questions to help your clients understand this service better.</p>
                <Button onClick={() => setShowAddFaq(true)}>
                  Add First FAQ
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Add/Edit FAQ Modal */}
        {(showAddFaq || editingFaq) && (
          <FAQModal 
            serviceId={service.id}
            faq={editingFaq}
            onClose={() => {
              setShowAddFaq(false);
              setEditingFaq(null);
            }}
            onSave={() => {
              fetchFaqs();
              setShowAddFaq(false);
              setEditingFaq(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

// FAQ Modal Component
interface FAQModalProps {
  serviceId: string;
  faq?: ServiceFAQ;
  onClose: () => void;
  onSave: () => void;
}

const FAQModal: React.FC<FAQModalProps> = ({ serviceId, faq, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    question: faq?.question || '',
    answer: faq?.answer || '',
    question_tr: faq?.question_tr || '',
    answer_tr: faq?.answer_tr || '',
    question_pt: faq?.question_pt || '',
    answer_pt: faq?.answer_pt || '',
    order_index: faq?.order_index || 1,
    is_active: faq?.is_active ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async () => {
    if (!formData.question.trim() || !formData.answer.trim()) {
      alert('Please fill in the English question and answer first');
      return;
    }

    setIsTranslating(true);
    try {
      // Translate to Turkish
      const questionTr = await deepLTranslator.translate(formData.question, 'EN', 'TR');
      const answerTr = await deepLTranslator.translate(formData.answer, 'EN', 'TR');
      
      // Translate to Portuguese
      const questionPt = await deepLTranslator.translate(formData.question, 'EN', 'PT');
      const answerPt = await deepLTranslator.translate(formData.answer, 'EN', 'PT');

      setFormData(prev => ({
        ...prev,
        question_tr: questionTr,
        answer_tr: answerTr,
        question_pt: questionPt,
        answer_pt: answerPt,
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
      if (faq) {
        // Update existing FAQ
        const { error } = await supabase
          .from('service_faqs')
          .update(formData)
          .eq('id', faq.id);

        if (error) {
          console.error('Error updating FAQ:', error);
          alert('Error updating FAQ');
          return;
        }
      } else {
        // Create new FAQ
        const { error } = await supabase
          .from('service_faqs')
          .insert({
            ...formData,
            service_id: serviceId,
          });

        if (error) {
          console.error('Error creating FAQ:', error);
          alert('Error creating FAQ');
          return;
        }
      }

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
      <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            {faq ? 'Edit FAQ' : 'Add New FAQ'}
          </h3>
          <Button
            icon={Languages}
            iconPosition="left"
            onClick={handleTranslate}
            disabled={isTranslating || !formData.question.trim() || !formData.answer.trim()}
            loading={isTranslating}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isTranslating ? 'Translating...' : 'Translate'}
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* English Content */}
          <div className="border-b border-gray-200 pb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">🇺🇸</span>
              English Content (Primary)
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question *
                </label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="What is the most common question about this service?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Answer *
                </label>
                <textarea
                  value={formData.answer}
                  onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="Provide a detailed answer that helps clients understand this service..."
                />
              </div>
            </div>
          </div>

          {/* Translation Section */}
          {isTranslating && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <Loader className="w-5 h-5 text-blue-600 animate-spin mr-3" />
                <span className="text-blue-800">Translating FAQ using DeepL AI...</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Turkish Content */}
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                <span className="mr-2">🇹🇷</span>
                Turkish Content
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Turkish Question
                  </label>
                  <input
                    type="text"
                    value={formData.question_tr}
                    onChange={(e) => setFormData(prev => ({ ...prev, question_tr: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Türkçe soru"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Turkish Answer
                  </label>
                  <textarea
                    value={formData.answer_tr}
                    onChange={(e) => setFormData(prev => ({ ...prev, answer_tr: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Türkçe cevap"
                  />
                </div>
              </div>
            </div>

            {/* Portuguese Content */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                <span className="mr-2">🇵🇹</span>
                Portuguese Content
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Portuguese Question
                  </label>
                  <input
                    type="text"
                    value={formData.question_pt}
                    onChange={(e) => setFormData(prev => ({ ...prev, question_pt: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Pergunta em português"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Portuguese Answer
                  </label>
                  <textarea
                    value={formData.answer_pt}
                    onChange={(e) => setFormData(prev => ({ ...prev, answer_pt: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Resposta em português"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Order
              </label>
              <input
                type="number"
                value={formData.order_index}
                onChange={(e) => setFormData(prev => ({ ...prev, order_index: Number(e.target.value) }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                min="1"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Active FAQ</span>
              </label>
            </div>
          </div>

          <div className="flex space-x-4 pt-6">
            <Button type="submit" className="flex-1" loading={saving}>
              {saving ? 'Saving...' : (faq ? 'Update FAQ' : 'Create FAQ')}
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
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { translateText } from '@consulting19/shared';
import { InfoTooltip } from '../../components/InfoTooltip';
import { 
  Briefcase, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Star,
  Globe,
  DollarSign,
  Search,
  Filter,
  Save,
  X,
  CheckCircle,
  AlertTriangle,
  FileText,
  Tag,
  Languages
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface CustomService {
  id: string;
  title_i18n: Record<string, string>;
  description_i18n: Record<string, string>;
  features_i18n: Record<string, string[]>;
  category: string;
  price: number;
  currency: string;
  billing_type: string;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

const ConsultantServices = () => {
  const { user, profile } = useAuth();
  const [services, setServices] = useState<CustomService[]>([]);
  const [loading, setLoading] = useState(true);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<CustomService | null>(null);
  const [saving, setSaving] = useState(false);
  const [translatingAll, setTranslatingAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [newService, setNewService] = useState({
    title_i18n: { en: '', tr: '', pt: '', es: '' },
    description_i18n: { en: '', tr: '', pt: '', es: '' },
    features_i18n: { en: ['', '', ''], tr: ['', '', ''], pt: ['', '', ''], es: ['', '', ''] },
    category: 'general',
    price: 0,
    currency: 'USD',
    billing_type: 'one_time',
    is_active: true,
    is_featured: false
  });

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
  ];

  const categories = [
    'general',
    'tax_planning',
    'banking',
    'legal',
    'visa',
    'accounting',
    'other'
  ];

  const billingTypes = [
    { value: 'one_time', label: 'One-time payment' },
    { value: 'monthly', label: 'Monthly subscription' },
    { value: 'quarterly', label: 'Quarterly subscription' },
    { value: 'yearly', label: 'Yearly subscription' }
  ];

  useEffect(() => {
    if (user && profile) {
      fetchServices();
    }
  }, [user, profile]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      
      const { data: servicesData, error } = await supabase
        .from('custom_services')
        .select('*')
        .eq('consultant_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching services:', error);
        return;
      }

      setServices(servicesData || []);
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTranslateAll = async () => {
    setTranslatingAll(true);
    setErrorMessage('');
    setSuccessMessage('');

    const sourceTitle = newService.title_i18n.en;
    const sourceDescription = newService.description_i18n.en;
    const sourceFeatures = newService.features_i18n.en.filter(f => f.trim());

    if (!sourceTitle || !sourceDescription) {
      setErrorMessage('English title and description are required before translating all.');
      setTranslatingAll(false);
      return;
    }

    try {
      const updatedService = { ...newService };

      for (const lang of languages) {
        if (lang.code === 'en') continue;

        try {
          // Başlığı çevir
          const translatedTitle = await translateText(sourceTitle, lang.code);
          updatedService.title_i18n[lang.code] = translatedTitle;

          // Açıklamayı çevir
          const translatedDescription = await translateText(sourceDescription, lang.code);
          updatedService.description_i18n[lang.code] = translatedDescription;

          // Özellikleri çevir (varsa)
          if (sourceFeatures.length > 0) {
            const combinedFeatures = sourceFeatures.join('|||');
            const translatedCombined = await translateText(combinedFeatures, lang.code);
            const translatedFeatures = translatedCombined.split('|||');
            updatedService.features_i18n[lang.code] = translatedFeatures;
          }

          // Small delay between translations to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (langError) {
          console.error(`Translation error for ${lang.code}:`, langError);
          setErrorMessage(`Failed to translate to ${lang.name}. Continuing with others...`);
        }
      }

      setNewService(updatedService);
      setSuccessMessage('All translations completed successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (err) {
      console.error('Error during bulk translation:', err);
      setErrorMessage('Failed to translate all content.');
    } finally {
      setTranslatingAll(false);
    }
  };

  const handleCreateService = async () => {
    if (!newService.title_i18n.en || !newService.description_i18n.en) {
      setErrorMessage('English title and description are required');
      return;
    }

    try {
      setSaving(true);
      setErrorMessage('');

      const serviceData = {
        consultant_id: user?.id,
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

      if (editingService) {
        const { error } = await supabase
          .from('custom_services')
          .update(serviceData)
          .eq('id', editingService.id);
        
        if (error) throw error;
        setSuccessMessage('Service updated successfully!');
      } else {
        const { error } = await supabase
          .from('custom_services')
          .insert(serviceData);
        
        if (error) throw error;
        setSuccessMessage('Service created successfully!');
      }

      setShowServiceModal(false);
      setEditingService(null);
      resetForm();
      fetchServices();
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (err: any) {
      console.error('Error saving service:', err);
      setErrorMessage(err.message || 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setNewService({
      title_i18n: { en: '', tr: '', pt: '', es: '' },
      description_i18n: { en: '', tr: '', pt: '', es: '' },
      features_i18n: { en: ['', '', ''], tr: ['', '', ''], pt: ['', '', ''], es: ['', '', ''] },
      category: 'general',
      price: 0,
      currency: 'USD',
      billing_type: 'one_time',
      is_active: true,
      is_featured: false
    });
  };

  const handleEditService = (service: CustomService) => {
    setEditingService(service);
    setNewService({
      title_i18n: service.title_i18n,
      description_i18n: service.description_i18n,
      features_i18n: service.features_i18n,
      category: service.category,
      price: service.price,
      currency: service.currency,
      billing_type: service.billing_type,
      is_active: service.is_active,
      is_featured: service.is_featured
    });
    setShowServiceModal(true);
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const { error } = await supabase
        .from('custom_services')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;

      setSuccessMessage('Service deleted successfully!');
      fetchServices();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error deleting service:', err);
      setErrorMessage('Failed to delete service');
    }
  };

  const toggleServiceStatus = async (serviceId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('custom_services')
        .update({ is_active: !currentStatus })
        .eq('id', serviceId);

      if (error) throw error;
      fetchServices();
    } catch (err) {
      console.error('Error updating service status:', err);
    }
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

  const updateFeature = (langCode: string, index: number, value: string) => {
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

  const filteredServices = services.filter(service => {
    const titleMatch = service.title_i18n?.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     service.title_i18n?.tr?.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = categoryFilter === 'all' || service.category === categoryFilter;
    return titleMatch && categoryMatch;
  });

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Services - Consultant Dashboard</title>
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

  return (
    <>
      <Helmet>
        <title>Services - Consultant Dashboard</title>
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
              setShowServiceModal(true);
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
                <option key={category} value={category}>
                  {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div key={service.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {service.is_featured && (
                  <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-yellow-800">Featured Service</span>
                    </div>
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {service.title_i18n?.en || 'Untitled Service'}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleServiceStatus(service.id, service.is_active)}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          service.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {service.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {service.description_i18n?.en || 'No description available'}
                  </p>

                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Tag className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">Category:</span>
                      <span className="text-sm text-gray-600 capitalize">
                        {service.category.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-lg font-bold text-gray-900">
                        ${service.price.toLocaleString()} {service.currency}
                      </span>
                      <span className="text-sm text-gray-600">
                        ({service.billing_type.replace('_', ' ')})
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEditService(service)}
                      className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      <Edit className="w-4 h-4 mr-1 inline" />
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteService(service.id)}
                      className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      <Trash2 className="w-4 h-4 mr-1 inline" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Services Yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first custom service to offer to your clients
            </p>
            <button 
              onClick={() => setShowServiceModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Service
            </button>
          </div>
        )}

        {/* Service Modal */}
        {showServiceModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingService ? 'Edit Service' : 'Create New Service'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowServiceModal(false);
                      setEditingService(null);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-8">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={newService.category}
                        onChange={(e) => setNewService(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={newService.price}
                          onChange={(e) => setNewService(prev => ({ ...prev, price: Number(e.target.value) }))}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="0.00"
                        />
                        <select
                          value={newService.currency}
                          onChange={(e) => setNewService(prev => ({ ...prev, currency: e.target.value }))}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="TRY">TRY</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Billing Type
                      </label>
                      <select
                        value={newService.billing_type}
                        onChange={(e) => setNewService(prev => ({ ...prev, billing_type: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        {billingTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newService.is_featured}
                          onChange={(e) => setNewService(prev => ({ ...prev, is_featured: e.target.checked }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-900">Featured service</span>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newService.is_active}
                          onChange={(e) => setNewService(prev => ({ ...prev, is_active: e.target.checked }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-900">Active service</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Multilingual Content */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Multilingual Content</h3>
                    <button
                      type="button"
                      onClick={handleTranslateAll}
                      disabled={translatingAll || !newService.title_i18n.en || !newService.description_i18n.en}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                    >
                      {translatingAll ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                          Translating All...
                        </>
                      ) : (
                        <>
                          <Languages className="w-4 h-4 mr-2 inline" />
                          Translate All from English
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-6">
                    {languages.map((lang) => (
                      <div key={lang.code} className="border border-gray-200 rounded-lg p-6">
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
                              required={lang.code === 'en'}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Service Description {lang.code === 'en' && '*'}
                            </label>
                            <textarea
                              value={newService.description_i18n[lang.code]}
                              onChange={(e) => setNewService(prev => ({
                                ...prev,
                                description_i18n: { ...prev.description_i18n, [lang.code]: e.target.value }
                              }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              rows={3}
                              placeholder={`Enter detailed service description in ${lang.name}`}
                              required={lang.code === 'en'}
                            />
                          </div>

                          <div>
                            <div className="flex items-center mb-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Features
                              </label>
                              <InfoTooltip
                                title="What are Features?"
                                content={
                                  <>
                                    <p className="mb-2">This section lists the key benefits and inclusions of your service.</p>
                                    <p className="mb-2">Features help clients quickly understand what your service provides.</p>
                                    <p className="font-semibold mb-1">Example (for "Company Formation"):</p>
                                    <ul className="list-disc list-inside text-xs space-y-1 mb-2">
                                      <li>Fast Trade Registry Registration</li>
                                      <li>Tax ID Number Acquisition</li>
                                      <li>Bank Account Opening Support</li>
                                      <li>First Year Virtual Office Service</li>
                                    </ul>
                                    <p className="text-xs italic">These features also serve as keywords for search and filtering.</p>
                                  </>
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              {newService.features_i18n[lang.code].map((feature, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <input
                                    type="text"
                                    value={feature}
                                    onChange={(e) => updateFeature(lang.code, index, e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder={`Feature ${index + 1} in ${lang.name}`}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeFeature(lang.code, index)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => addFeature(lang.code)}
                                className="text-blue-600 hover:text-blue-700 text-sm"
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

                {/* Action Buttons */}
                <div className="flex items-center space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                  <button
                    onClick={() => {
                      setShowServiceModal(false);
                      setEditingService(null);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateService}
                    disabled={saving || !newService.title_i18n.en || !newService.description_i18n.en}
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
          </div>
        )}
      </div>
    </>
  );
};

export default ConsultantServices;
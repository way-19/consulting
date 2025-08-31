import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, DollarSign, Globe, Star, ToggleLeft, ToggleRight } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { supabase } from '@consulting19/supabase';
import { useAuth } from '@consulting19/shared';
import { useTranslation } from '../../hooks/useTranslation';
import ConsultantLayout from '../../components/layouts/ConsultantLayout';
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
  is_active: boolean;
  is_featured: boolean;
  country: {
    name: string;
    flag_emoji: string;
  } | null;
  created_at: string;
  updated_at: string;
}

interface ServiceForm {
  title_en: string;
  title_tr: string;
  title_pt: string;
  description_en: string;
  description_tr: string;
  description_pt: string;
  features_en: string[];
  features_tr: string[];
  features_pt: string[];
  price: number;
  currency: string;
  billing_type: string;
  category: string;
  country_id: string;
  is_featured: boolean;
}

const ConsultantServices = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [services, setServices] = useState<CustomService[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<CustomService | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<'en' | 'tr' | 'pt'>('en');
  const [serviceForm, setServiceForm] = useState<ServiceForm>({
    title_en: '',
    title_tr: '',
    title_pt: '',
    description_en: '',
    description_tr: '',
    description_pt: '',
    features_en: [''],
    features_tr: [''],
    features_pt: [''],
    price: 0,
    currency: 'USD',
    billing_type: 'one_time',
    category: 'general',
    country_id: '',
    is_featured: false,
  });

  useEffect(() => {
    if (user) {
      fetchServices();
      fetchCountries();
    }
  }, [user]);

  const fetchServices = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('custom_services')
        .select(`
          *,
          country:countries(name, flag_emoji)
        `)
        .eq('consultant_id', user.id)
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

  const fetchCountries = async () => {
    try {
      const { data, error } = await supabase
        .from('countries')
        .select('id, name, flag_emoji')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Error fetching countries:', error);
      } else {
        setCountries(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const createService = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('custom_services')
        .insert({
          consultant_id: user.id,
          country_id: serviceForm.country_id || null,
          title_i18n: {
            en: serviceForm.title_en,
            tr: serviceForm.title_tr,
            pt: serviceForm.title_pt,
          },
          description_i18n: {
            en: serviceForm.description_en,
            tr: serviceForm.description_tr,
            pt: serviceForm.description_pt,
          },
          features_i18n: {
            en: serviceForm.features_en.filter(f => f.trim()),
            tr: serviceForm.features_tr.filter(f => f.trim()),
            pt: serviceForm.features_pt.filter(f => f.trim()),
          },
          price: serviceForm.price,
          currency: serviceForm.currency,
          billing_type: serviceForm.billing_type,
          category: serviceForm.category,
          is_featured: serviceForm.is_featured,
        });

      if (error) {
        console.error('Error creating service:', error);
      } else {
        fetchServices();
        setShowServiceForm(false);
        resetServiceForm();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const toggleServiceStatus = async (serviceId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('custom_services')
        .update({ is_active: !currentStatus })
        .eq('id', serviceId);

      if (error) {
        console.error('Error updating service status:', error);
      } else {
        fetchServices();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
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
        console.error('Error deleting service:', error);
      } else {
        fetchServices();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const resetServiceForm = () => {
    setServiceForm({
      title_en: '',
      title_tr: '',
      title_pt: '',
      description_en: '',
      description_tr: '',
      description_pt: '',
      features_en: [''],
      features_tr: [''],
      features_pt: [''],
      price: 0,
      currency: 'USD',
      billing_type: 'one_time',
      category: 'general',
      country_id: '',
      is_featured: false,
    });
  };

  const addFeature = (lang: 'en' | 'tr' | 'pt') => {
    setServiceForm(prev => ({
      ...prev,
      [`features_${lang}`]: [...prev[`features_${lang}` as keyof ServiceForm] as string[], '']
    }));
  };

  const updateFeature = (lang: 'en' | 'tr' | 'pt', index: number, value: string) => {
    setServiceForm(prev => {
      const features = [...prev[`features_${lang}` as keyof ServiceForm] as string[]];
      features[index] = value;
      return { ...prev, [`features_${lang}`]: features };
    });
  };

  const removeFeature = (lang: 'en' | 'tr' | 'pt', index: number) => {
    setServiceForm(prev => {
      const features = [...prev[`features_${lang}` as keyof ServiceForm] as string[]];
      features.splice(index, 1);
      return { ...prev, [`features_${lang}`]: features };
    });
  };

  const getLocalizedContent = (content: any, field: string) => {
    if (!content || typeof content !== 'object') return '';
    return content[activeLanguage] || content.en || '';
  };

  const categories = [
    'Company Formation',
    'Tax Planning',
    'Banking',
    'Legal Compliance',
    'Asset Protection',
    'Investment Advisory',
    'Visa & Residency',
    'Market Research',
    'General'
  ];

  if (loading) {
    return (
      <ConsultantLayout>
        <Helmet>
          <title>Services - Consulting19</title>
        </Helmet>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </ConsultantLayout>
    );
  }

  return (
    <ConsultantLayout>
      <Helmet>
        <title>Services - Consulting19</title>
      </Helmet>
      
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Services</h1>
            <p className="text-gray-600">Create and manage your custom services</p>
          </div>
          <Button onClick={() => setShowServiceForm(true)} icon={Plus}>
            Create Service
          </Button>
        </div>
      </div>

      {/* Services Grid */}
      {services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} hover>
              <Card.Body>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {getLocalizedContent(service.title_i18n, 'title')}
                      </h3>
                      {service.is_featured && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                      {getLocalizedContent(service.description_i18n, 'description')}
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

                {/* Features */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Features:</h4>
                  <ul className="space-y-1">
                    {(getLocalizedContent(service.features_i18n, 'features') as string[] || []).slice(0, 3).map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pricing */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Price:</span>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: service.currency
                        }).format(service.price)}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {service.billing_type.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Country & Category */}
                <div className="mb-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium text-gray-900">{service.category}</span>
                  </div>
                  {service.country && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Country:</span>
                      <span className="font-medium text-gray-900">
                        {service.country.flag_emoji} {service.country.name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" icon={Eye} className="flex-1">
                    Preview
                  </Button>
                  <Button variant="outline" size="sm" icon={Edit} className="flex-1">
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    icon={Trash2}
                    onClick={() => deleteService(service.id)}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <Card.Body className="text-center py-12">
            <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Services Created Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first custom service to start offering specialized solutions to clients
            </p>
            <Button onClick={() => setShowServiceForm(true)} icon={Plus}>
              Create Your First Service
            </Button>
          </Card.Body>
        </Card>
      )}

      {/* Service Form Modal */}
      {showServiceForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <Card.Header>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingService ? 'Edit Service' : 'Create New Service'}
                </h2>
                <div className="flex space-x-2">
                  {[
                    { code: 'en', name: 'English', flag: '🇺🇸' },
                    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
                    { code: 'pt', name: 'Português', flag: '🇵🇹' },
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setActiveLanguage(lang.code as 'en' | 'tr' | 'pt')}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                        activeLanguage === lang.code
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span className="text-sm">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={serviceForm.category}
                      onChange={(e) => setServiceForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country (Optional)
                    </label>
                    <select
                      value={serviceForm.country_id}
                      onChange={(e) => setServiceForm(prev => ({ ...prev, country_id: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Countries</option>
                      {countries.map(country => (
                        <option key={country.id} value={country.id}>
                          {country.flag_emoji} {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Localized Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Title ({activeLanguage.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={serviceForm[`title_${activeLanguage}` as keyof ServiceForm] as string}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, [`title_${activeLanguage}`]: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Enter service title in ${activeLanguage.toUpperCase()}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Description ({activeLanguage.toUpperCase()})
                  </label>
                  <textarea
                    value={serviceForm[`description_${activeLanguage}` as keyof ServiceForm] as string}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, [`description_${activeLanguage}`]: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Enter service description in ${activeLanguage.toUpperCase()}`}
                  />
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Features ({activeLanguage.toUpperCase()})
                  </label>
                  <div className="space-y-2">
                    {(serviceForm[`features_${activeLanguage}` as keyof ServiceForm] as string[]).map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => updateFeature(activeLanguage, index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={`Feature ${index + 1}`}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Trash2}
                          onClick={() => removeFeature(activeLanguage, index)}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        />
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Plus}
                      onClick={() => addFeature(activeLanguage)}
                    >
                      Add Feature
                    </Button>
                  </div>
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price
                    </label>
                    <input
                      type="number"
                      value={serviceForm.price}
                      onChange={(e) => setServiceForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <select
                      value={serviceForm.currency}
                      onChange={(e) => setServiceForm(prev => ({ ...prev, currency: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="TRY">TRY</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Billing Type
                    </label>
                    <select
                      value={serviceForm.billing_type}
                      onChange={(e) => setServiceForm(prev => ({ ...prev, billing_type: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="one_time">One Time</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>

                {/* Featured Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Featured Service</div>
                    <div className="text-sm text-gray-600">Highlight this service to clients</div>
                  </div>
                  <button
                    onClick={() => setServiceForm(prev => ({ ...prev, is_featured: !prev.is_featured }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      serviceForm.is_featured ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        serviceForm.is_featured ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </Card.Body>
            <Card.Footer>
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setShowServiceForm(false);
                    setEditingService(null);
                    resetServiceForm();
                  }}
                >
                  {t('common.cancel')}
                </Button>
                <Button 
                  className="flex-1"
                  onClick={createService}
                  disabled={!serviceForm.title_en.trim() || serviceForm.price <= 0}
                >
                  {editingService ? t('common.save') : 'Create Service'}
                </Button>
              </div>
            </Card.Footer>
          </Card>
        </div>
      )}
    </ConsultantLayout>
  );
};

export default ConsultantServices;
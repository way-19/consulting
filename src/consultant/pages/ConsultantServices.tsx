import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Globe, DollarSign, Star, ToggleLeft, ToggleRight } from 'lucide-react';
import { Card, Button } from '../../shared/components/ui';
import { supabase, CustomService, Country } from '../../shared/lib/supabase';
import { useAuth } from '../../shared/hooks/useAuth';
import { useLanguage } from '../../shared/contexts/LanguageContext';

const ConsultantServices = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [services, setServices] = useState<CustomService[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<CustomService | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>('');

  useEffect(() => {
    if (user) {
      fetchServices();
      fetchAssignedCountries();
    }
  }, [user, selectedCountry]);

  const fetchServices = async () => {
    if (!user) return;

    try {
      setLoading(true);
      let query = supabase
        .from('custom_services')
        .select('*')
        .eq('consultant_id', user.id)
        .order('created_at', { ascending: false });

      if (selectedCountry) {
        query = query.eq('country_id', selectedCountry);
      }

      const { data, error } = await query;

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

  const fetchAssignedCountries = async () => {
    if (!user) return;

    try {
      // TODO: Fetch countries assigned to this consultant
      // For now, fetch all active countries
      const { data, error } = await supabase
        .from('countries')
        .select('*')
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

  const getLocalizedContent = (content: Record<string, string>, fallback: string = '') => {
    if (!content || typeof content !== 'object') return fallback;
    return content[language] || content.en || fallback;
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat(language, {
      style: 'currency',
      currency,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Services</h1>
          <p className="text-gray-600">Create and manage your service offerings</p>
        </div>
        <Button onClick={() => setShowServiceForm(true)} icon={Plus}>
          Create Service
        </Button>
      </div>

      {/* Country Filter */}
      <Card>
        <Card.Body>
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">
              Filter by Country:
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Countries</option>
              {countries.map(country => (
                <option key={country.id} value={country.id}>
                  {country.flag_emoji} {country.name}
                </option>
              ))}
            </select>
          </div>
        </Card.Body>
      </Card>

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
                        {getLocalizedContent(service.title_i18n, 'Untitled Service')}
                      </h3>
                      {service.is_featured && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                      {getLocalizedContent(service.description_i18n, 'No description')}
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
                    <span>{service.is_active ? t('active') : t('inactive')}</span>
                  </button>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Features:</h4>
                  <ul className="space-y-1">
                    {(getLocalizedContent(service.features_i18n, []) as string[] || []).slice(0, 3).map((feature, index) => (
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
                        {formatCurrency(service.price, service.currency)}
                      </div>
                      <div className="text-xs text-gray-500">One-time fee</div>
                    </div>
                  </div>
                </div>

                {/* Category & Country */}
                <div className="mb-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium text-gray-900">{service.category}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" icon={Edit} className="flex-1">
                    {t('edit')}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    icon={Trash2}
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
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Services Created Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first service to start attracting clients
            </p>
            <Button onClick={() => setShowServiceForm(true)} icon={Plus}>
              Create Your First Service
            </Button>
          </Card.Body>
        </Card>
      )}

      {/* Service Form Modal - TODO: Implement */}
      {showServiceForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-2xl w-full mx-4">
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">
                {editingService ? 'Edit Service' : 'Create New Service'}
              </h2>
            </Card.Header>
            <Card.Body>
              <p className="text-gray-600">Service creation form will be implemented here</p>
            </Card.Body>
            <Card.Footer>
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowServiceForm(false)}
                >
                  {t('cancel')}
                </Button>
                <Button className="flex-1">
                  {t('save')}
                </Button>
              </div>
            </Card.Footer>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ConsultantServices;
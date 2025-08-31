import React, { useState, useEffect } from 'react';
import { Target, DollarSign, Star, CheckCircle, ShoppingCart } from 'lucide-react';
import { Card, Button } from '../../shared/components/ui';
import { supabase, CustomService } from '../../shared/lib/supabase';
import { useAuth } from '../../shared/hooks/useAuth';
import { useLanguage } from '../../shared/contexts/LanguageContext';

const ClientServices = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [services, setServices] = useState<CustomService[]>([]);
  const [loading, setLoading] = useState(true);
  const [consultant, setConsultant] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchServices();
    }
  }, [user]);

  const fetchServices = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Get client record and assigned consultant
      const { data: clientData } = await supabase
        .from('clients')
        .select(`
          *,
          consultant:user_profiles!clients_assigned_consultant_id_fkey(full_name, email, company)
        `)
        .eq('profile_id', user.id)
        .single();

      if (!clientData || !clientData.assigned_consultant_id) {
        setLoading(false);
        return;
      }

      setConsultant(clientData.consultant);

      // Fetch consultant's services
      const { data: servicesData, error } = await supabase
        .from('custom_services')
        .select('*')
        .eq('consultant_id', clientData.assigned_consultant_id)
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching services:', error);
      } else {
        setServices(servicesData || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
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

  const handleServicePurchase = async (service: CustomService) => {
    // TODO: Implement Stripe checkout
    console.log('Purchasing service:', service);
    alert('Payment integration will be implemented here');
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Available Services</h1>
        <p className="text-gray-600">
          Services from your consultant: {consultant?.full_name || 'Not assigned'}
        </p>
      </div>

      {/* Services Grid */}
      {services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} hover className="h-full">
              <Card.Body>
                {service.is_featured && (
                  <div className="inline-flex items-center bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full mb-4">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Featured
                  </div>
                )}
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {getLocalizedContent(service.title_i18n, 'Service')}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {getLocalizedContent(service.description_i18n, 'No description available')}
                </p>
                
                {/* Features */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">What's Included:</h4>
                  <ul className="space-y-1">
                    {(getLocalizedContent(service.features_i18n, []) as string[] || []).slice(0, 3).map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Pricing */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600">Price:</span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {formatCurrency(service.price, service.currency)}
                      </div>
                      <div className="text-xs text-gray-500">One-time fee</div>
                    </div>
                  </div>
                  <Button 
                    className="w-full" 
                    icon={ShoppingCart}
                    onClick={() => handleServicePurchase(service)}
                  >
                    Purchase Service
                  </Button>
                </div>
                
                <div className="text-xs text-gray-500">
                  Category: {service.category}
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
              No Services Available
            </h3>
            <p className="text-gray-600">
              {consultant 
                ? `${consultant.full_name} hasn't created any services yet.`
                : 'You need to be assigned to a consultant first.'
              }
            </p>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default ClientServices;
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, MapPin, Calendar, MessageSquare, CheckCircle, Globe, DollarSign, ShoppingCart } from 'lucide-react';
import { supabase, CustomService, UserProfile } from '@consulting19/shared';
import { useLanguage, useAuth } from '@consulting19/shared';
import { Button, Card } from '@consulting19/shared';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ConsultantProfilePage = () => {
  const { consultantId } = useParams<{ consultantId: string }>();
  const { t, language } = useLanguage();
  const { user, role } = useAuth();
  const [consultant, setConsultant] = useState<UserProfile | null>(null);
  const [services, setServices] = useState<CustomService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (consultantId) {
      fetchConsultantData();
    }
  }, [consultantId]);

  const fetchConsultantData = async () => {
    if (!consultantId) return;

    try {
      setLoading(true);

      // Fetch consultant profile
      const { data: consultantData, error: consultantError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', consultantId)
        .eq('role', 'consultant')
        .eq('is_active', true)
        .single();

      if (consultantError) {
        console.error('Error fetching consultant:', consultantError);
        return;
      }

      setConsultant(consultantData);

      // Fetch consultant's services
      const { data: servicesData, error: servicesError } = await supabase
        .from('custom_services')
        .select('*')
        .eq('consultant_id', consultantId)
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (servicesError) {
        console.error('Error fetching services:', servicesError);
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

  const isClientOfConsultant = () => {
    return user && role === 'client';
  };

  const handleServicePurchase = async (service: CustomService) => {
    if (!user || !isClientOfConsultant()) {
      window.location.href = '/auth?redirect=' + encodeURIComponent(window.location.pathname);
      return;
    }

    // TODO: Implement Stripe checkout
    console.log('Purchasing service:', service);
    alert('Stripe ödeme entegrasyonu yakında eklenecek');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!consultant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Consultant Not Found</h1>
          <p className="text-gray-600">The consultant you're looking for doesn't exist or is not active.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Consultant Header */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
              {consultant.avatar_url ? (
                <img 
                  src={consultant.avatar_url} 
                  alt={consultant.full_name}
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-white">
                  {consultant.full_name.charAt(0)}
                </span>
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {consultant.full_name}
              </h1>
              <p className="text-xl text-blue-100 mb-4">
                International Business Consultant
              </p>
              
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-blue-100">
                {consultant.company && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{consultant.company}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-2 fill-current text-yellow-400" />
                  <span>4.9 (127 reviews)</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>Verified Expert</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-3">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100"
                icon={MessageSquare}
              >
                Contact Consultant
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-600"
                icon={Calendar}
              >
                Schedule Meeting
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Services</h2>
          <p className="text-gray-600">Professional consulting services tailored to your business needs</p>
        </div>

        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  {isClientOfConsultant() ? (
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
                  ) : (
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                      <p className="text-blue-800 text-sm font-medium mb-2">
                        Sign in to view pricing and purchase
                      </p>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.location.href = '/auth?redirect=' + encodeURIComponent(window.location.pathname)}
                      >
                        Sign In
                      </Button>
                    </div>
                  )}
                  
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
              <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Services Available
              </h3>
              <p className="text-gray-600">
                This consultant hasn't added any services yet.
              </p>
            </Card.Body>
          </Card>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default ConsultantProfilePage;
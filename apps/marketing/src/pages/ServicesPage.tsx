import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Calculator, CreditCard, FileText, Shield, TrendingUp, Users, BarChart3, Globe, MessageCircle, DollarSign, ArrowRight } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { useLanguage, useMarketingContent } from '@consulting19/shared';
import { supabase } from '@consulting19/supabase';

interface Service {
  id: string;
  title: string;
  title_tr?: string;
  title_pt?: string;
  description: string;
  description_tr?: string;
  description_pt?: string;
  image_url?: string;
  price?: number;
  is_recurring: boolean;
  billing_period?: string;
}

const ServicesPage = () => {
  const { t, language } = useLanguage();
  const { content, loading: contentLoading } = useMarketingContent('services_overview');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('services')
        .select(`
          id,
          title,
          title_tr,
          title_pt,
          description,
          description_tr,
          description_pt,
          image_url,
          price,
          is_recurring,
          billing_period
        `)
        .eq('is_public', true)
        .eq('is_active', true)
        .eq('is_marketing_service', true)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching services:', fetchError);
        setError('Failed to load services');
      } else {
        setServices(data || []);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get localized content
  const getLocalizedContent = (service: Service, field: 'title' | 'description'): string => {
    if (language === 'tr' && service[`${field}_tr` as keyof Service]) {
      return service[`${field}_tr` as keyof Service] as string;
    }
    if (language === 'pt' && service[`${field}_pt` as keyof Service]) {
      return service[`${field}_pt` as keyof Service] as string;
    }
    return service[field];
  };

  const getServiceIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('formation') || lowerTitle.includes('company') || lowerTitle.includes('kuruluş') || lowerTitle.includes('formação')) return Building2;
    if (lowerTitle.includes('tax') || lowerTitle.includes('vergi') || lowerTitle.includes('fiscal')) return Calculator;
    if (lowerTitle.includes('banking') || lowerTitle.includes('bankacılık') || lowerTitle.includes('bancário')) return CreditCard;
    if (lowerTitle.includes('legal') || lowerTitle.includes('yasal') || lowerTitle.includes('legal')) return FileText;
    if (lowerTitle.includes('asset') || lowerTitle.includes('varlık') || lowerTitle.includes('ativo')) return Shield;
    if (lowerTitle.includes('investment') || lowerTitle.includes('yatırım') || lowerTitle.includes('investimento')) return TrendingUp;
    if (lowerTitle.includes('visa') || lowerTitle.includes('vize') || lowerTitle.includes('visto')) return Users;
    if (lowerTitle.includes('market') || lowerTitle.includes('pazar') || lowerTitle.includes('mercado')) return BarChart3;
    return Globe;
  };

  const getServiceRoute = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('formation') || lowerTitle.includes('company') || lowerTitle.includes('kuruluş') || lowerTitle.includes('formação')) return '/services/company-formation';
    if (lowerTitle.includes('tax') || lowerTitle.includes('vergi') || lowerTitle.includes('fiscal')) return '/services/tax-optimization';
    if (lowerTitle.includes('banking') || lowerTitle.includes('bankacılık') || lowerTitle.includes('bancário')) return '/services/banking-solutions';
    if (lowerTitle.includes('legal') || lowerTitle.includes('yasal') || lowerTitle.includes('legal')) return '/services/legal-compliance';
    if (lowerTitle.includes('asset') || lowerTitle.includes('varlık') || lowerTitle.includes('ativo')) return '/services/asset-protection';
    if (lowerTitle.includes('investment') || lowerTitle.includes('yatırım') || lowerTitle.includes('investimento')) return '/services/investment-advisory';
    if (lowerTitle.includes('visa') || lowerTitle.includes('vize') || lowerTitle.includes('visto')) return '/services/visa-residency';
    if (lowerTitle.includes('market') || lowerTitle.includes('pazar') || lowerTitle.includes('mercado')) return '/services/market-research';
    return '/services';
  };

  const getServiceColor = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('formation') || lowerTitle.includes('company') || lowerTitle.includes('kuruluş') || lowerTitle.includes('formação')) return 'from-blue-600 to-blue-700';
    if (lowerTitle.includes('tax') || lowerTitle.includes('vergi') || lowerTitle.includes('fiscal')) return 'from-teal-600 to-teal-700';
    if (lowerTitle.includes('banking') || lowerTitle.includes('bankacılık') || lowerTitle.includes('bancário')) return 'from-orange-600 to-orange-700';
    if (lowerTitle.includes('legal') || lowerTitle.includes('yasal') || lowerTitle.includes('legal')) return 'from-green-600 to-green-700';
    if (lowerTitle.includes('asset') || lowerTitle.includes('varlık') || lowerTitle.includes('ativo')) return 'from-purple-600 to-purple-700';
    if (lowerTitle.includes('investment') || lowerTitle.includes('yatırım') || lowerTitle.includes('investimento')) return 'from-red-600 to-red-700';
    if (lowerTitle.includes('visa') || lowerTitle.includes('vize') || lowerTitle.includes('visto')) return 'from-indigo-600 to-indigo-700';
    if (lowerTitle.includes('market') || lowerTitle.includes('pazar') || lowerTitle.includes('mercado')) return 'from-pink-600 to-pink-700';
    return 'from-gray-600 to-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-0">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {content?.hero_title || t('servicesPageTitle')}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {content?.hero_description || t('servicesPageDescription')}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading services...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">Error loading services: {error}</div>
            <Button onClick={fetchServices}>Retry</Button>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Globe className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Services Available</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Services are being prepared by our admin team. Please check back soon for our comprehensive business solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" icon={MessageCircle} iconPosition="left">
                  Contact Us
                </Button>
              </Link>
              <Link to="/countries">
                <Button size="lg" variant="outline" icon={Globe} iconPosition="left">
                  Explore Countries
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Services Grid - 4 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {services.map((service) => {
                const ServiceIcon = getServiceIcon(service.title);
                const serviceRoute = getServiceRoute(service.title);
                const serviceColor = getServiceColor(service.title);
                
                return (
                  <div key={service.id} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <img 
                        src={service.image_url || 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800'} 
                        alt={getLocalizedContent(service, 'title')}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    </div>
                    
                    {/* Content */}
                    <div className="relative h-80 flex flex-col justify-between p-6 text-white">
                      {/* Top Section */}
                      <div className="flex justify-between items-start">
                        <div className={`w-12 h-12 bg-gradient-to-r ${serviceColor} rounded-xl flex items-center justify-center shadow-lg`}>
                          <ServiceIcon className="w-6 h-6 text-white" />
                        </div>
                        
                        {/* Price Badge */}
                        {service.price && (
                          <div className="bg-green-500/80 backdrop-blur-sm rounded-full px-3 py-1">
                            <span className="text-xs font-medium text-white">
                              ${service.price.toLocaleString()}
                            </span>
                          </div>
                        )}
                        
                        {/* Recurring Badge */}
                        {service.is_recurring && (
                          <div className="bg-blue-500/80 backdrop-blur-sm rounded-full px-3 py-1">
                            <span className="text-xs font-medium text-white">
                              {service.billing_period || 'Recurring'}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Bottom Section */}
                      <div>
                        <h3 className="text-xl font-bold mb-3 group-hover:text-blue-300 transition-colors duration-300">
                          {getLocalizedContent(service, 'title')}
                        </h3>
                        
                        <p className="text-gray-200 text-sm leading-relaxed mb-4 opacity-90 line-clamp-3">
                          {getLocalizedContent(service, 'description')}
                        </p>
                        
                        {/* Button - appears on hover */}
                        <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                          <Link to={serviceRoute}>
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              className="w-full bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-gray-900 transition-all duration-300"
                              icon={ArrowRight}
                              iconPosition="right"
                            >
                              {t('learnMore')}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>

      {/* Bottom CTA Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {content?.cta_title || t('needCustomSolution')}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {content?.cta_description || t('needCustomSolutionDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" icon={MessageCircle} iconPosition="left">
                {content?.cta_primary || t('consultWithExpert')}
              </Button>
            </Link>
            <Link to="/countries">
              <Button size="lg" variant="outline" icon={Globe} iconPosition="left">
                {content?.cta_secondary || t('exploreCountries')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
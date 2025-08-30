import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Calculator, CreditCard, FileText, Shield, TrendingUp, Users, BarChart3, Globe, MessageCircle } from 'lucide-react';
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
  is_public: boolean;
  is_active: boolean;
  country_id: string;
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
          is_public,
          is_active,
          country_id
        `)
        .eq('is_public', true)
        .eq('is_active', true)
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

  // Group services by category/type for better organization
  const groupedServices = services.reduce((acc, service) => {
    const title = getLocalizedContent(service, 'title');
    const category = title.includes('Formation') || title.includes('Kuruluş') || title.includes('Formação') ? 'Company Formation' :
                    title.includes('Tax') || title.includes('Vergi') || title.includes('Fiscal') ? 'Tax Optimization' :
                    title.includes('Banking') || title.includes('Bankacılık') || title.includes('Bancário') ? 'Banking Solutions' :
                    title.includes('Legal') || title.includes('Yasal') || title.includes('Legal') ? 'Legal Compliance' :
                    title.includes('Asset') || title.includes('Varlık') || title.includes('Ativo') ? 'Asset Protection' :
                    title.includes('Investment') || title.includes('Yatırım') || title.includes('Investimento') ? 'Investment Advisory' :
                    title.includes('Visa') || title.includes('Vize') || title.includes('Visto') ? 'Visa & Residency' :
                    title.includes('Market') || title.includes('Pazar') || title.includes('Mercado') ? 'Market Research' :
                    'Other Services';
    
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  const content = {
    en: {
      heroTitle: 'Comprehensive International Business Services',
      heroDescription: 'From company formation to ongoing compliance, we provide end-to-end support delivered by expert consultants in 19+ countries.',
      needCustomSolution: 'Need a Custom Solution?',
      needCustomSolutionDesc: 'Our expert advisors can design a tailored strategy for your business needs.',
      consultWithExpert: 'Consult with Expert',
      exploreCountries: 'Explore Countries'
    },
    tr: {
      heroTitle: 'Kapsamlı Uluslararası İş Hizmetleri',
      heroDescription: 'Şirket kuruluşundan devam eden uyumluluğa kadar, 19+ ülkede uzman danışmanlar tarafından sunulan uçtan uca destek sağlıyoruz.',
      needCustomSolution: 'Özel Çözüme İhtiyacınız Var mı?',
      needCustomSolutionDesc: 'Uzman danışmanlarımız iş ihtiyaçlarınız için özel bir strateji tasarlayabilir.',
      consultWithExpert: 'Uzmanla Görüşün',
      exploreCountries: 'Ülkeleri Keşfedin'
    },
    pt: {
      heroTitle: 'Serviços Empresariais Internacionais Abrangentes',
      heroDescription: 'Da formação de empresa à conformidade contínua, fornecemos suporte completo entregue por consultores especialistas em 19+ países.',
      needCustomSolution: 'Precisa de uma Solução Personalizada?',
      needCustomSolutionDesc: 'Nossos consultores especialistas podem projetar uma estratégia personalizada para suas necessidades empresariais.',
      consultWithExpert: 'Consultar com Especialista',
      exploreCountries: 'Explorar Países'
    }
  };

  const currentContent = content[language] || content.en;

  // Static service categories with icons and routes (for fallback)
  const staticServiceCategories = {
    'Company Formation': { icon: Building2, color: 'blue', route: '/services/company-formation' },
    'Tax Optimization': { icon: Calculator, color: 'teal', route: '/services/tax-optimization' },
    'Banking Solutions': { icon: CreditCard, color: 'orange', route: '/services/banking-solutions' },
    'Legal Compliance': { icon: FileText, color: 'green', route: '/services/legal-compliance' },
    'Asset Protection': { icon: Shield, color: 'purple', route: '/services/asset-protection' },
    'Investment Advisory': { icon: TrendingUp, color: 'red', route: '/services/investment-advisory' },
    'Visa & Residency': { icon: Users, color: 'indigo', route: '/services/visa-residency' },
    'Market Research': { icon: BarChart3, color: 'pink', route: '/services/market-research' },
    'Other Services': { icon: Globe, color: 'gray', route: '/services' },
  };

  const colorClasses = {
    blue: 'from-blue-600 to-blue-700',
    teal: 'from-teal-600 to-teal-700',
    orange: 'from-orange-600 to-orange-700',
    green: 'from-green-600 to-green-700',
    purple: 'from-purple-600 to-purple-700',
    red: 'from-red-600 to-red-700',
    indigo: 'from-indigo-600 to-indigo-700',
    pink: 'from-pink-600 to-pink-700',
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-0">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {content?.hero_title || currentContent.heroTitle}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {content?.hero_description || currentContent.heroDescription}
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
        ) : Object.keys(groupedServices).length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Globe className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Services Available</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Services are being prepared by our team. Please check back soon for our comprehensive business solutions.
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
          <div className="space-y-12">
            {Object.entries(groupedServices).map(([categoryName, categoryServices]) => {
              const categoryConfig = staticServiceCategories[categoryName as keyof typeof staticServiceCategories] || staticServiceCategories['Other Services'];
              
              return (
                <div key={categoryName}>
                  <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${colorClasses[categoryConfig.color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center`}>
                        <categoryConfig.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{categoryName}</h2>
                    <p className="text-gray-600">Available services in this category</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {categoryServices.map((service) => (
                      <Card key={service.id} hover className="h-full">
                        {service.image_url && (
                          <div className="h-48 overflow-hidden rounded-t-xl">
                            <img 
                              src={service.image_url} 
                              alt={getLocalizedContent(service, 'title')}
                              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        
                        <Card.Body className="h-full flex flex-col">
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            {getLocalizedContent(service, 'title')}
                          </h3>
                          
                          <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
                            {getLocalizedContent(service, 'description')}
                          </p>
                          
                          <div className="mt-auto">
                            <Link to={categoryConfig.route}>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="w-full"
                              >
                                Learn More
                              </Button>
                            </Link>
                          </div>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="text-center">
                    <Link to={categoryConfig.route}>
                      <Button 
                        size="lg"
                        className={`bg-gradient-to-r ${colorClasses[categoryConfig.color as keyof typeof colorClasses]} text-white`}
                      >
                        Explore All {categoryName} Services
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Bottom CTA Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {content?.cta_title || currentContent.needCustomSolution}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {content?.cta_description || currentContent.needCustomSolutionDesc}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" icon={MessageCircle} iconPosition="left">
                {content?.cta_primary || currentContent.consultWithExpert}
              </Button>
            </Link>
            <Link to="/countries">
              <Button size="lg" variant="outline" icon={Globe} iconPosition="left">
                {content?.cta_secondary || currentContent.exploreCountries}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
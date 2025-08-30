import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Calculator, CreditCard, FileText, Shield, TrendingUp, Users, BarChart3, Globe, ArrowRight } from 'lucide-react';
import { useLanguage } from '@consulting19/shared';
import { Card, Button } from '@consulting19/ui';
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
}

const ServicesOverviewSection = () => {
  const { t, language } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarketingServices();
  }, []);

  // Mock marketing services for homepage
  const mockServices = [
    {
      id: '1',
      title: 'Company Formation',
      title_tr: 'Şirket Kuruluşu',
      title_pt: 'Formação de Empresa',
      description: 'Complete business setup and incorporation services across multiple jurisdictions.',
      description_tr: 'Birden fazla yargı alanında komple iş kurulumu ve kuruluş hizmetleri.',
      description_pt: 'Serviços completos de configuração e incorporação de negócios em múltiplas jurisdições.',
      image_url: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: 2500,
    },
    {
      id: '2',
      title: 'Tax Optimization',
      title_tr: 'Vergi Optimizasyonu',
      title_pt: 'Otimização Fiscal',
      description: 'Strategic international tax planning to minimize legal tax liability.',
      description_tr: 'Yasal vergi yükümlülüğünü minimize etmek için stratejik uluslararası vergi planlaması.',
      description_pt: 'Planejamento fiscal internacional estratégico para minimizar responsabilidade fiscal legal.',
      image_url: 'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: 1800,
    },
    {
      id: '3',
      title: 'Banking Solutions',
      title_tr: 'Bankacılık Çözümleri',
      title_pt: 'Soluções Bancárias',
      description: 'Global banking support for opening and managing corporate accounts.',
      description_tr: 'Kurumsal hesapları açma ve yönetme için küresel bankacılık desteği.',
      description_pt: 'Suporte bancário global para abertura e gestão de contas corporativas.',
      image_url: 'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: 1200,
    },
    {
      id: '4',
      title: 'Legal Compliance',
      title_tr: 'Yasal Uyumluluk',
      title_pt: 'Conformidade Legal',
      description: 'Ongoing legal and regulatory support to keep your business compliant.',
      description_tr: 'İşinizi uyumlu tutmak için devam eden yasal ve düzenleyici destek.',
      description_pt: 'Suporte legal e regulatório contínuo para manter seu negócio em conformidade.',
      image_url: 'https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: 800,
    },
    {
      id: '5',
      title: 'Asset Protection',
      title_tr: 'Varlık Koruma',
      title_pt: 'Proteção de Ativos',
      description: 'Sophisticated trust and foundation structures to protect assets.',
      description_tr: 'Varlıkları korumak için sofistike tröst ve vakıf yapıları.',
      description_pt: 'Estruturas sofisticadas de trust e fundação para proteger ativos.',
      image_url: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: 3500,
    },
    {
      id: '6',
      title: 'Investment Advisory',
      title_tr: 'Yatırım Danışmanlığı',
      title_pt: 'Consultoria de Investimento',
      description: 'Professional investment and wealth management services.',
      description_tr: 'Profesyonel yatırım ve servet yönetimi hizmetleri.',
      description_pt: 'Serviços profissionais de investimento e gestão de patrimônio.',
      image_url: 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: 2000,
    },
    {
      id: '7',
      title: 'Visa & Residency',
      title_tr: 'Vize ve İkamet',
      title_pt: 'Visto e Residência',
      description: 'End-to-end visa and residency solutions for international mobility.',
      description_tr: 'Uluslararası mobilite için uçtan uca vize ve ikamet çözümleri.',
      description_pt: 'Soluções completas de visto e residência para mobilidade internacional.',
      image_url: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: 5000,
    },
    {
      id: '8',
      title: 'Market Research',
      title_tr: 'Pazar Araştırması',
      title_pt: 'Pesquisa de Mercado',
      description: 'Market analysis and business intelligence',
      description_tr: 'Pazar analizi ve iş zekası',
      description_pt: 'Análise de mercado e inteligência empresarial',
      image_url: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: 1500,
    },
  ];

  const fetchMarketingServices = async () => {
    try {
      setLoading(true);
      // Use mock data for homepage services
      setTimeout(() => {
        setServices(mockServices);
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error('Unexpected error:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketingServices();
  }, []);
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

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading services...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 relative">
          {/* Modern Header Background */}
          <div className="relative bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 rounded-2xl p-12 mb-8 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-6 right-12 w-20 h-20 border border-indigo-400 rounded-full animate-pulse"></div>
              <div className="absolute bottom-6 left-12 w-14 h-14 border border-purple-400 rounded-lg rotate-45 animate-bounce"></div>
              <div className="absolute top-1/3 right-1/3 w-10 h-10 border border-teal-400 rounded-full animate-ping"></div>
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center bg-indigo-500/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
                <Building2 className="w-5 h-5 text-indigo-400 mr-2" />
                <span className="text-indigo-300 font-medium">{t('endToEndSolutions')}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {t('servicesOverviewTitle')}
              </h2>
              <p className="text-lg text-slate-300 max-w-3xl mx-auto">
                {t('servicesOverviewDescription')}
              </p>
            </div>
          </div>
        </div>

        {services.length > 0 ? (
          <>
            {/* Services Grid - 4x2 Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {services.map((service, index) => {
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
                    <div className="relative h-80 flex flex-col justify-end p-6 text-white">
                      <div className={`w-12 h-12 bg-gradient-to-r ${serviceColor} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                        <ServiceIcon className="w-6 h-6 text-white" />
                      </div>
                      
                      {/* Price Badge */}
                      {service.price && (
                        <div className="absolute top-4 right-4 bg-green-500/80 backdrop-blur-sm rounded-full px-3 py-1">
                          <span className="text-xs font-medium text-white">
                            ${service.price.toLocaleString()}
                          </span>
                        </div>
                      )}
                      
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
                          >
                            {t('learnMore')}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center">
              <Link to="/services">
                <Button size="lg" variant="primary" className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 border-0 px-8 py-3" icon={ArrowRight} iconPosition="right">
                  {t('viewAllServicesBtn') || 'View All Services'}
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Services Available</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Services are being prepared by our admin team. Please check back soon for our comprehensive business solutions.
            </p>
            <Link to="/contact">
              <Button size="lg">
                Contact Us for Information
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesOverviewSection;
import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Calculator, CreditCard, FileText, Shield, TrendingUp, Import as Passport, BarChart3 } from 'lucide-react';
import { useLanguage } from '../../lib/language';
import { Card, Button } from '../../lib/ui';

const ServicesOverviewSection = () => {
  const { t } = useLanguage();

  const services = [
    {
      id: 'company-formation',
      icon: Building2,
      title: t('companyFormationTitle'),
      description: t('companyFormationDesc'),
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
      color: 'blue',
    },
    {
      id: 'tax-optimization',
      icon: Calculator,
      title: t('taxOptimizationTitle'),
      description: t('taxOptimizationDesc'),
      image: 'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=800',
      color: 'teal',
    },
    {
      id: 'banking-solutions',
      icon: CreditCard,
      title: t('bankingSolutionsTitle'),
      description: t('bankingSolutionsDesc'),
      image: 'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=800',
      color: 'orange',
    },
    {
      id: 'legal-compliance',
      icon: FileText,
      title: t('legalComplianceTitle'),
      description: t('legalComplianceDesc'),
      image: 'https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg?auto=compress&cs=tinysrgb&w=800',
      color: 'green',
    },
    {
      id: 'asset-protection',
      icon: Shield,
      title: t('assetProtectionTitle'),
      description: t('assetProtectionDesc'),
      image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800',
      color: 'purple',
    },
    {
      id: 'investment-advisory',
      icon: TrendingUp,
      title: t('investmentAdvisoryTitle'),
      description: t('investmentAdvisoryDesc'),
      image: 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=800',
      color: 'red',
    },
    {
      id: 'visa-residency',
      icon: Passport,
      title: t('visaResidencyTitle'),
      description: t('visaResidencyDesc'),
      image: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=800',
      color: 'indigo',
    },
    {
      id: 'market-research',
      icon: BarChart3,
      title: t('marketResearchTitle'),
      description: t('marketResearchDesc'),
      image: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=800',
      color: 'pink',
    },
  ];

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
    <section className="py-10 bg-white">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {services.map((service, index) => (
            <div key={index} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
              {/* Background Image */}
              <div className="absolute inset-0">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              </div>
              
              {/* Content */}
              <div className="relative h-80 flex flex-col justify-end p-6 text-white">
                <div className={`w-12 h-12 bg-gradient-to-r ${colorClasses[service.color as keyof typeof colorClasses]} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-bold mb-3 group-hover:text-blue-300 transition-colors duration-300">
                  {service.title}
                </h3>
                
                <p className="text-gray-200 text-sm leading-relaxed mb-4 opacity-90">
                  {service.description}
                </p>
                
                {/* Button - appears on hover */}
                <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <Link to={`/services/${service.id}`}>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="w-full bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-gray-900 transition-all duration-300"
                    >
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/services">
            <Button size="lg" variant="primary" className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 border-0 px-8 py-3">
              {t('viewAllServicesBtn') || 'View All Services'}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesOverviewSection;
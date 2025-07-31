import React from 'react';
import { ArrowRight, Globe, Zap, Shield, Building2, TrendingUp, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const HomePage: React.FC = () => {
  const { t } = useLanguage();

  const countries = [
    { name: 'Georgia', slug: 'georgia', flag: '🇬🇪', image: 'https://images.pexels.com/photos/12461213/pexels-photo-12461213.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop' },
    { name: 'USA', slug: 'usa', flag: '🇺🇸', image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop' },
    { name: 'Montenegro', slug: 'montenegro', flag: '🇲🇪', image: 'https://images.pexels.com/photos/15031396/pexels-photo-15031396.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop' },
    { name: 'Estonia', slug: 'estonia', flag: '🇪🇪', image: 'https://images.pexels.com/photos/9816335/pexels-photo-9816335.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop' },
    { name: 'Portugal', slug: 'portugal', flag: '🇵🇹', image: 'https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop' },
    { name: 'Malta', slug: 'malta', flag: '🇲🇹', image: 'https://images.pexels.com/photos/9816335/pexels-photo-9816335.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop' },
    { name: 'Panama', slug: 'panama', flag: '🇵🇦', image: 'https://images.pexels.com/photos/2034335/pexels-photo-2034335.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop' }
  ];

  const features = [
    { icon: Globe, title: t('nav.countries'), desc: '7 strategic jurisdictions' },
    { icon: Zap, title: 'AI-Powered', desc: 'Intelligent guidance' },
    { icon: Shield, title: 'Legal Oversight', desc: 'Compliance guaranteed' }
  ];

  const services = [
    {
      icon: Building2,
      title: t('service.companyFormation'),
      desc: 'Quick entity setup worldwide'
    },
    {
      icon: TrendingUp,
      title: t('service.investmentAdvisory'),
      desc: 'Strategic market analysis'
    },
    {
      icon: Users,
      title: t('service.legalConsulting'),
      desc: 'Regulatory compliance'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-16 min-h-screen flex items-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {t('home.title')} <span className="block">{t('home.subtitle')}</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8 leading-relaxed">
              {t('home.description')}
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white/90"
                >
                  <feature.icon className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">{feature.title}</span>
                </div>
              ))}
            </div>

            <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105">
              {t('common.getStarted')}
              <ArrowRight className="ml-2 h-5 w-5 inline" />
            </button>
          </div>
        </div>
      </section>

      {/* Countries Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('nav.countries')}
            </h2>
            <p className="text-xl text-gray-600">
              Choose the perfect location for your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {countries.map((country) => (
              <a
                key={country.slug}
                href={`/${country.slug}`}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={country.image}
                    alt={country.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="text-3xl">{country.flag}</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1">{country.name}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-purple-600">
                      {t('common.explore')} {country.name}
                    </span>
                    <ArrowRight className="h-4 w-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('nav.services')}
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive business solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200 transform hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
                  <service.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.desc}</p>
                <a
                  href="/services"
                  className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
                >
                  {t('common.learnMore')}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
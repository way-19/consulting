import React from 'react';
import { ArrowRight, CheckCircle, Globe, Users, Zap, Shield, Building2, Calculator, CreditCard, FileText, TrendingUp, BarChart3 } from 'lucide-react';
import { useLanguage } from '../../shared/contexts/LanguageContext';
import { Button, Card } from '../../shared/components/ui';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HomePage = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Zap,
      title: t('aiPoweredIntelligence'),
      description: 'Smart jurisdiction recommendations based on your business needs',
    },
    {
      icon: Users,
      title: t('expertNetwork'),
      description: 'Local specialists in 19+ countries with proven track records',
    },
    {
      icon: Shield,
      title: t('comprehensiveServices'),
      description: 'End-to-end support from formation to ongoing compliance',
    },
    {
      icon: Globe,
      title: t('multiLanguageSupport'),
      description: 'Platform available in English, Turkish, and Portuguese',
    },
  ];

  const services = [
    {
      icon: Building2,
      title: t('companyFormation'),
      description: 'Professional business setup and incorporation services worldwide',
      color: 'blue',
    },
    {
      icon: Calculator,
      title: t('taxOptimization'),
      description: 'Strategic tax planning and international tax optimization',
      color: 'teal',
    },
    {
      icon: CreditCard,
      title: t('bankingSolutions'),
      description: 'Global banking and financial services access',
      color: 'orange',
    },
    {
      icon: FileText,
      title: t('legalCompliance'),
      description: 'Comprehensive legal and regulatory compliance',
      color: 'green',
    },
    {
      icon: Shield,
      title: t('assetProtection'),
      description: 'Wealth protection and asset security strategies',
      color: 'purple',
    },
    {
      icon: TrendingUp,
      title: t('investmentAdvisory'),
      description: 'Professional investment and wealth management',
      color: 'red',
    },
    {
      icon: Users,
      title: t('visaResidency'),
      description: 'Immigration and residency planning services',
      color: 'indigo',
    },
    {
      icon: BarChart3,
      title: t('marketResearch'),
      description: 'Market intelligence and business research',
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Global business consulting"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-blue-900/70 to-black/60"></div>
        </div>

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-4xl">
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8 shadow-lg">
                <Zap className="w-5 h-5 text-yellow-300 mr-2 animate-pulse" />
                <span className="text-white font-medium">{t('aiPoweredIntelligence')}</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                {t('heroTitle')}
                <br />
                <span className="text-yellow-400">
                  {t('heroSubtitle')}
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-200 leading-relaxed mb-10 max-w-3xl">
                {t('heroDescription')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:from-blue-700 hover:to-teal-700 font-semibold px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  icon={ArrowRight} 
                  iconPosition="right"
                >
                  {t('heroPrimaryCTA')}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white hover:text-gray-900 backdrop-blur-sm font-semibold px-8 py-4 text-lg transition-all duration-300"
                >
                  {t('heroSecondaryCTA')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Consulting19?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced technology meets expert knowledge for seamless global expansion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} hover className="text-center h-full">
                <Card.Body>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive business services for international expansion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} hover className="h-full">
                <Card.Body>
                  <div className={`w-12 h-12 bg-gradient-to-r ${colorClasses[service.color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center mb-4`}>
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    {t('learnMore')}
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border border-blue-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 border border-teal-400 rounded-lg rotate-45 animate-bounce"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Simple 4-step process to expand your business globally
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Globe,
                title: 'Choose Jurisdiction',
                description: 'AI analyzes your needs and recommends optimal countries',
              },
              {
                icon: Zap,
                title: 'AI Matching',
                description: 'Get matched with expert consultants in your target markets',
              },
              {
                icon: Users,
                title: 'Expert Guidance',
                description: 'Work with local specialists who understand regulations',
              },
              {
                icon: CheckCircle,
                title: 'Launch & Scale',
                description: 'Complete setup with ongoing compliance and support',
              },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-blue-100 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Expand Globally?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of entrepreneurs who have successfully expanded their businesses internationally.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              {t('getStarted')}
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              {t('scheduleConsultation')}
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
import React from 'react';
import { useState } from 'react';
import { ArrowRight, CheckCircle, Globe, Users, Zap, Shield } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../lib/language';
import { Button, Card } from '../lib/ui';
import { AIAgentIcon } from '@consulting19/shared';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HomePage = () => {
  const { t } = useLanguage();
  const [showAIChat, setShowAIChat] = useState(false);

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Consulting19 - AI-Powered Global Business Consulting</title>
        <meta name="description" content="Expert guidance for international business expansion. AI-powered platform connecting you with advisors in 19+ countries for tax optimization, company formation, and legal compliance." />
      </Helmet>

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
                  onClick={() => window.open('/auth?mode=register', '_blank')}
                >
                  {t('heroPrimaryCTA')}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => window.open('/services', '_blank')}
                >
                  {t('heroSecondaryCTA')}
                </Button>
              </div>
            </div>
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

      {/* Services Overview */}
      <section className="py-20 bg-white">
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
            {[
              {
                icon: Shield,
                title: t('companyFormation'),
                description: 'Professional business setup and incorporation services',
                link: '/services/company-formation',
              },
              {
                icon: Zap,
                title: t('taxOptimization'),
                description: 'Strategic tax planning and international optimization',
                link: '/services/tax-optimization',
              },
              {
                icon: Globe,
                title: t('bankingSolutions'),
                description: 'Global banking access and financial services',
                link: '/services/banking-solutions',
              },
              {
                icon: Users,
                title: t('legalCompliance'),
                description: 'Comprehensive legal and regulatory compliance',
                link: '/services/legal-compliance',
              },
            ].map((service, index) => (
              <Card key={index} hover className="text-center h-full">
                <Card.Body>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => window.open(service.link, '_blank')}
                  >
                    {t('learnMore')}
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Countries Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Global Presence
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expert consultants in 19+ countries ready to help your expansion
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { flag: '🇬🇪', name: 'Georgia', available: true, link: '/countries/georgia' },
              { flag: '🇺🇸', name: 'USA', available: false, link: '#' },
              { flag: '🇦🇪', name: 'UAE', available: false, link: '#' },
              { flag: '🇪🇪', name: 'Estonia', available: false, link: '#' },
              { flag: '🇲🇹', name: 'Malta', available: false, link: '#' },
              { flag: '🇵🇹', name: 'Portugal', available: false, link: '#' },
              { flag: '🇳🇱', name: 'Netherlands', available: false, link: '#' },
              { flag: '🇨🇭', name: 'Switzerland', available: false, link: '#' },
              { flag: '🇸🇬', name: 'Singapore', available: false, link: '#' },
              { flag: '🇨🇦', name: 'Canada', available: false, link: '#' },
              { flag: '🇲🇪', name: 'Montenegro', available: false, link: '#' },
              { flag: '🇵🇦', name: 'Panama', available: false, link: '#' },
            ].map((country, index) => (
              <Card 
                key={index} 
                hover 
                className={`text-center cursor-pointer ${!country.available ? 'opacity-60' : ''}`}
                onClick={() => {
                  if (country.available) {
                    window.open(country.link, '_blank');
                  } else {
                    alert(`${country.name} services coming soon!`);
                  }
                }}
              >
                <Card.Body className="py-6">
                  <div className="text-4xl mb-3">{country.flag}</div>
                  <h3 className="font-semibold text-gray-900 text-sm">{country.name}</h3>
                  {country.available ? (
                    <div className="text-xs text-green-600 font-medium mt-1">Available</div>
                  ) : (
                    <div className="text-xs text-orange-600 font-medium mt-1">Coming Soon</div>
                  )}
                </Card.Body>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => window.open('/countries', '_blank')}
            >
              View All Countries
            </Button>
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
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => window.open('/auth?mode=register', '_blank')}
            >
              {t('getStarted')}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-blue-600"
              onClick={() => window.open('/contact', '_blank')}
            >
              {t('scheduleConsultation')}
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      
      {/* AI Agent Icon */}
      <AIAgentIcon autoOpen={true} />
    </div>
  );
};

export default HomePage;
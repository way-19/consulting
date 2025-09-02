import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Globe, Users, Zap, Shield, Building2, Calculator, CreditCard, FileText, TrendingUp, BarChart3, MessageSquare, Send, X, Star, MapPin, Clock, Target, Home, ExternalLink } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../lib/language';
import { Button, Card } from '../lib/ui';
import { AIAgentIcon } from '@consulting19/shared';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HomePage = () => {
  const { t } = useLanguage();
  const [showAIChat, setShowAIChat] = useState(false);

  const serviceCategories = [
    {
      icon: Building2,
      title: 'Company Formation',
      summary: 'Professional business setup and incorporation services worldwide',
      services: [
        'Company Registration',
        'Business Licenses',
        'Corporate Structure Setup',
        'Registered Agent Services',
        'Virtual Office Solutions',
      ],
      color: 'blue',
      link: '/services/company-formation',
    },
    {
      icon: Calculator,
      title: 'Tax Optimization',
      summary: 'Strategic tax planning and international tax optimization',
      services: [
        'International Tax Planning',
        'Double Tax Treaty Optimization',
        'Tax Residency Planning',
        'Transfer Pricing',
        'Annual Compliance',
      ],
      color: 'teal',
      link: '/services/tax-optimization',
    },
    {
      icon: CreditCard,
      title: 'Banking Solutions',
      summary: 'Global banking and financial services access',
      services: [
        'Corporate Account Opening',
        'Multi-Currency Accounts',
        'Payment Gateway Setup',
        'Banking Relationships',
        'Trade Finance',
      ],
      color: 'orange',
      link: '/services/banking-solutions',
    },
    {
      icon: FileText,
      title: 'Legal Compliance',
      summary: 'Comprehensive legal and regulatory compliance',
      services: [
        'Compliance Monitoring',
        'Contract Review',
        'Legal Structure Optimization',
        'IP Protection',
        'Data Protection',
      ],
      color: 'green',
      link: '/services/legal-compliance',
    },
    {
      icon: Shield,
      title: 'Asset Protection',
      summary: 'Wealth protection and asset security strategies',
      services: [
        'Protection Strategy',
        'Trust & Foundation Setup',
        'Risk Mitigation',
        'Estate Planning',
        'Insurance Coordination',
      ],
      color: 'purple',
      link: '/services/asset-protection',
    },
    {
      icon: TrendingUp,
      title: 'Investment Advisory',
      summary: 'Professional investment and wealth management',
      services: [
        'Portfolio Management',
        'Alternative Investments',
        'Real Estate Investment',
        'ESG Investment Strategies',
        'Crypto Compliance',
      ],
      color: 'red',
      link: '/services/investment-advisory',
    },
    {
      icon: Users,
      title: 'Visa & Residency',
      summary: 'Immigration and residency planning services',
      services: [
        'Eligibility Review',
        'Country Comparison',
        'Application Preparation',
        'Document Filing',
        'Status Tracking',
      ],
      color: 'indigo',
      link: '/services/visa-residency',
    },
    {
      icon: BarChart3,
      title: 'Market Research',
      summary: 'Market intelligence and business research',
      services: [
        'Market Analysis',
        'Competitor Mapping',
        'Pricing Insights',
        'Go-to-Market Testing',
        'Local Regulations',
      ],
      color: 'pink',
      link: '/services/market-research',
    },
  ];

  const getServiceBackgroundImage = (serviceTitle: string) => {
    const serviceBackgrounds = {
      'Company Formation': 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
      'Tax Optimization': 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800',
      'Banking Solutions': 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=800',
      'Legal Compliance': 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=800',
      'Asset Protection': 'https://images.pexels.com/photos/3483098/pexels-photo-3483098.jpeg?auto=compress&cs=tinysrgb&w=800',
      'Investment Advisory': 'https://images.pexels.com/photos/8369648/pexels-photo-8369648.jpeg?auto=compress&cs=tinysrgb&w=800',
      'Visa & Residency': 'https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg?auto=compress&cs=tinysrgb&w=800',
      'Market Research': 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800',
    };
    return serviceBackgrounds[serviceTitle as keyof typeof serviceBackgrounds] || serviceBackgrounds['Company Formation'];
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
                >
                  {t('heroPrimaryCTA')}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => setShowAIChat(true)}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {serviceCategories.map((service, index) => (
              <Link
                key={index}
                to={service.link}
                className="group relative block overflow-hidden rounded-2xl min-h-[300px] hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={getServiceBackgroundImage(service.title)}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70 group-hover:from-black/80 group-hover:via-black/60 group-hover:to-black/80 transition-all duration-300"></div>
                </div>
                
                {/* Content */}
                <div className="h-full flex flex-col p-6 relative z-10">
                  <div className="flex items-start space-x-3 mb-5">
                    <div className={`w-10 h-10 bg-gradient-to-r ${colorClasses[service.color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg backdrop-blur-sm border border-white/20`}>
                      <service.icon className="w-5 h-5 text-white drop-shadow-lg" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">
                        {service.title}
                      </h3>
                      <p className="text-gray-200 leading-relaxed text-sm line-clamp-2 drop-shadow-sm">
                        {service.summary}
                      </p>
                    </div>
                  </div>
                  
                  <ul className="space-y-2 mb-6 flex-1">
                    {service.services.map((serviceItem, i) => (
                      <li key={i} className="flex items-center text-white">
                        <div className={`w-2 h-2 bg-gradient-to-r ${colorClasses[service.color as keyof typeof colorClasses]} rounded-full mr-2 flex-shrink-0 shadow-md`}></div>
                        <span className="text-xs font-medium drop-shadow-sm">{serviceItem}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-auto">
                    <div className={`w-full md:w-auto md:min-w-[160px] bg-gradient-to-r ${colorClasses[service.color as keyof typeof colorClasses]} backdrop-blur-sm text-white hover:opacity-90 font-semibold shadow-lg hover:shadow-xl border-0 transition-all duration-300 transform hover:scale-105 px-6 py-3 text-sm rounded-lg text-center`}>
                      <span className="relative z-10">Explore {service.title}</span>
                    </div>
                  </div>
                </div>
              </Link>
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
              Get Started Today
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Schedule Consultation
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      
      {/* AI Agent Icon */}
      <AIAgentIcon />
    </div>
  );
};

export default HomePage;
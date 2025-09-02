import React from 'react';
import { ArrowRight, CheckCircle, Globe, Users, Zap, Shield, Building2, Calculator, CreditCard, FileText, TrendingUp, BarChart3, Star, Bot, Target, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../lib/language';
import { Button, Card } from '../lib/ui';
import { AIAgentIcon } from '@consulting19/shared';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HomePage = () => {
  const { t } = useLanguage();

  const serviceCategories = [
    {
      icon: Building2,
      title: t('companyFormation') || 'Company Formation',
      summary: 'Professional business setup and incorporation services worldwide',
      color: 'blue',
      link: '/services/company-formation',
    },
    {
      icon: Calculator,
      title: t('taxOptimization') || 'Tax Optimization',
      summary: 'Strategic tax planning and international tax optimization',
      color: 'teal',
      link: '/services/tax-optimization',
    },
    {
      icon: CreditCard,
      title: t('bankingSolutions') || 'Banking Solutions',
      summary: 'Global banking and financial services access',
      color: 'orange',
      link: '/services/banking-solutions',
    },
    {
      icon: FileText,
      title: t('legalCompliance') || 'Legal Compliance',
      summary: 'Comprehensive legal and regulatory compliance',
      color: 'green',
      link: '/services/legal-compliance',
    },
    {
      icon: Shield,
      title: t('assetProtection') || 'Asset Protection',
      summary: 'Wealth protection and asset security strategies',
      color: 'purple',
      link: '/services/asset-protection',
    },
    {
      icon: TrendingUp,
      title: t('investmentAdvisory') || 'Investment Advisory',
      summary: 'Professional investment and wealth management',
      color: 'red',
      link: '/services/investment-advisory',
    },
    {
      icon: Users,
      title: t('visaResidency') || 'Visa & Residency',
      summary: 'Immigration and residency planning services',
      color: 'indigo',
      link: '/services/visa-residency',
    },
    {
      icon: BarChart3,
      title: t('marketResearch') || 'Market Research',
      summary: 'Market intelligence and business research',
      color: 'pink',
      link: '/services/market-research',
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
      <Helmet>
        <title>Consulting19 - AI-Powered Global Business Consulting</title>
        <meta name="description" content="Expert guidance for international business expansion. AI-powered platform connecting you with advisors in 19+ countries for tax optimization, company formation, and legal compliance." />
      </Helmet>

      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-blue-600 to-purple-600 text-white py-20 mt-16 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-teal-400/5 rounded-full blur-3xl"></div>
        </div>

        {/* Floating Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 text-4xl animate-float">🌍</div>
          <div className="absolute top-32 right-1/4 text-3xl animate-float-delayed">🚀</div>
          <div className="absolute bottom-20 left-1/3 text-3xl animate-bounce delay-1000">💼</div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8 shadow-lg border border-white/30">
              <Zap className="w-5 h-5 text-yellow-300 mr-2 animate-pulse" />
              <span className="text-white font-medium">{t('aiPoweredIntelligence')}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {t('heroTitle')}
              <br />
              <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
                {t('heroSubtitle')}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed max-w-4xl mx-auto">
              {t('heroDescription')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link to="/auth?mode=register">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-10 py-4 text-lg shadow-2xl border-0 transform hover:scale-105 transition-all duration-300"
                >
                  {t('heroPrimaryCTA')}
                </Button>
              </Link>
              <Link to="/services">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-10 py-4 text-lg transition-all duration-300"
                >
                  {t('heroSecondaryCTA')}
                </Button>
              </Link>
            </div>

            {/* Trust Badge */}
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-8 py-3 shadow-lg border border-white/30">
              <CheckCircle className="w-5 h-5 text-green-300 mr-2" />
              <span className="text-white font-medium">98% Success Rate</span>
              <span className="mx-3 text-white/60">•</span>
              <Users className="w-5 h-5 text-blue-300 mr-2" />
              <span className="text-white font-medium">{t('expertNetwork')}</span>
              <span className="mx-3 text-white/60">•</span>
              <Bot className="w-5 h-5 text-purple-300 mr-2" />
              <span className="text-white font-medium">AI-Powered</span>
            </div>
          </div>
        </div>
      </section>

      {/* AI-Powered Country Recommendations */}
      <section className="py-14 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-14 left-14 w-44 h-44 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-14 right-14 w-67 h-67 bg-yellow-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Floating AI Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-14 left-1/4 text-3xl animate-float">🤖</div>
          <div className="absolute top-22 right-1/4 text-2xl animate-float-delayed">🌍</div>
          <div className="absolute bottom-14 left-1/3 text-2xl animate-bounce delay-1000">📊</div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl animate-pulse">
                <Bot className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              AI-Powered Country
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                Recommendations
              </span>
            </h2>
            
            <p className="text-lg text-gray-600 mb-6 leading-relaxed max-w-4xl mx-auto">
              Get personalized jurisdiction recommendations based on your business needs, goals, and priorities. 
              Our AI analyzes 19+ countries to find your perfect match.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link to="/ai-recommendations">
                <Button 
                  size="md" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-8 py-3 text-base shadow-xl border-0 transform hover:scale-105 transition-all duration-300"
                  icon={Bot}
                  iconPosition="right"
                >
                  Start AI Analysis
                </Button>
              </Link>
              <Link to="/countries">
                <Button 
                  size="md" 
                  variant="outline" 
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold px-8 py-3 text-base transition-all duration-300"
                  icon={Globe}
                  iconPosition="right"
                >
                  Explore All Countries
                </Button>
              </Link>
            </div>

            {/* Trust Badge */}
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 shadow-lg border border-white/30">
              <Bot className="w-4 h-4 text-purple-600 mr-2" />
              <span className="text-gray-700 font-medium">AI Oracle Analysis</span>
              <span className="mx-3 text-gray-400">•</span>
              <Globe className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-gray-700 font-medium">19+ Countries</span>
              <span className="mx-3 text-gray-400">•</span>
              <Target className="w-4 h-4 text-teal-600 mr-2" />
              <span className="text-gray-700 font-medium">Personalized Results</span>
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
              Comprehensive Business Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              End-to-end support for international business expansion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceCategories.map((service, index) => (
              <Link key={index} to={service.link} className="block">
                <Card hover className="text-center h-full group">
                  <Card.Body className="py-8">
                    <div className={`w-12 h-12 bg-gradient-to-r ${colorClasses[service.color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                      <service.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6 text-sm">
                      {service.summary}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full group-hover:border-blue-500 group-hover:text-blue-600 transition-colors duration-300"
                      icon={ArrowRight}
                      iconPosition="right"
                    >
                      Learn More
                    </Button>
                  </Card.Body>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Countries Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Expand to 19+ Countries
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expert consultants and comprehensive services across the globe
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-12">
            {[
              { name: 'Georgia', flag: '🇬🇪', available: true },
              { name: 'Estonia', flag: '🇪🇪', available: false },
              { name: 'UAE', flag: '🇦🇪', available: false },
              { name: 'Malta', flag: '🇲🇹', available: false },
              { name: 'Portugal', flag: '🇵🇹', available: false },
              { name: 'Ireland', flag: '🇮🇪', available: false },
              { name: 'Netherlands', flag: '🇳🇱', available: false },
              { name: 'Singapore', flag: '🇸🇬', available: false },
              { name: 'Switzerland', flag: '🇨🇭', available: false },
              { name: 'Canada', flag: '🇨🇦', available: false },
              { name: 'Gibraltar', flag: '🇬🇮', available: false },
              { name: 'Lithuania', flag: '🇱🇹', available: false },
            ].map((country, index) => (
              <Card key={index} hover className="text-center group">
                <Card.Body className="py-6">
                  <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                    {country.flag}
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    {country.name}
                  </h3>
                  <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                    country.available 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {country.available ? 'Available' : 'Coming Soon'}
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link to="/countries">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                icon={Globe}
                iconPosition="right"
              >
                Explore All Countries
              </Button>
            </Link>
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
              Advanced technology meets expert human guidance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Bot,
                title: 'AI-Powered Intelligence',
                description: 'Our AI Oracle analyzes your business needs and recommends optimal jurisdictions with personalized strategies.',
                color: 'from-purple-500 to-pink-500',
              },
              {
                icon: Users,
                title: 'Expert Network',
                description: 'Licensed professionals in 19+ countries provide local expertise and hands-on guidance for your expansion.',
                color: 'from-blue-500 to-teal-500',
              },
              {
                icon: Zap,
                title: 'Faster Results',
                description: 'Streamlined processes and AI assistance deliver results 3x faster than traditional consulting.',
                color: 'from-orange-500 to-red-500',
              },
            ].map((feature, index) => (
              <Card key={index} hover className="text-center group">
                <Card.Body className="py-10">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-700 transition-colors duration-300">
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

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Trusted by Entrepreneurs Worldwide</h2>
            <p className="text-xl text-gray-300">Real results from our global platform</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: '2,500+', label: 'Companies Formed' },
              { number: '19+', label: 'Countries Covered' },
              { number: '98%', label: 'Success Rate' },
              { number: '4.9★', label: 'Client Rating' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Expand Globally?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of entrepreneurs who have successfully expanded their businesses internationally with our expert guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth?mode=register">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-10 py-4 text-lg shadow-2xl border-0 transform hover:scale-105 transition-all duration-300"
              >
                Start Your Expansion
              </Button>
            </Link>
            <Link to="/contact">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-10 py-4 text-lg transition-all duration-300"
              >
                Schedule Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      
      {/* AI Agent Icon */}
      <AIAgentIcon autoOpen={true} />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float 3s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
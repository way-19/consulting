import React from 'react';
import { ArrowRight, CheckCircle, Globe, Users, Zap, Shield, Building2, Calculator, CreditCard, FileText, TrendingUp, BarChart3, Star, MessageSquare, Calendar, Bot, Target, Eye, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../lib/language';
import { Button, Card } from '../lib/ui';
import { AIAgentIcon } from '@consulting19/shared';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HomePage = () => {
  const { t } = useLanguage();

  const services = [
    {
      icon: Building2,
      title: t('companyFormation'),
      description: 'Professional business setup and incorporation services worldwide',
      color: 'from-blue-500 to-cyan-500',
      link: '/services/company-formation',
    },
    {
      icon: Calculator,
      title: t('taxOptimization'),
      description: 'Strategic tax planning and international tax optimization',
      color: 'from-green-500 to-emerald-500',
      link: '/services/tax-optimization',
    },
    {
      icon: CreditCard,
      title: t('bankingSolutions'),
      description: 'Global banking and financial services access',
      color: 'from-orange-500 to-red-500',
      link: '/services/banking-solutions',
    },
    {
      icon: FileText,
      title: t('legalCompliance'),
      description: 'Comprehensive legal and regulatory compliance',
      color: 'from-purple-500 to-pink-500',
      link: '/services/legal-compliance',
    },
    {
      icon: Shield,
      title: 'Asset Protection',
      description: 'Wealth protection and asset security strategies',
      color: 'from-indigo-500 to-purple-500',
      link: '/services/asset-protection',
    },
    {
      icon: TrendingUp,
      title: 'Investment Advisory',
      description: 'Professional investment and wealth management',
      color: 'from-emerald-500 to-teal-500',
      link: '/services/investment-advisory',
    },
    {
      icon: Users,
      title: 'Visa & Residency',
      description: 'Immigration and residency planning services',
      color: 'from-red-500 to-pink-500',
      link: '/services/visa-residency',
    },
    {
      icon: BarChart3,
      title: 'Market Research',
      description: 'Market intelligence and business research',
      color: 'from-pink-500 to-purple-500',
      link: '/services/market-research',
    },
  ];

  const features = [
    {
      icon: Bot,
      title: 'AI Oracle Assistant',
      description: 'Your personal AI consultant available 24/7 in 20+ languages',
    },
    {
      icon: Globe,
      title: 'Global Network',
      description: 'Expert consultants in 19+ countries with local expertise',
    },
    {
      icon: Zap,
      title: 'Fast Setup',
      description: 'Average company formation completed in 1-3 days',
    },
    {
      icon: Shield,
      title: 'Fully Compliant',
      description: 'All services comply with international regulations',
    },
  ];

  const stats = [
    { number: '19+', label: 'Countries Served', icon: Globe },
    { number: '2,500+', label: 'Successful Formations', icon: CheckCircle },
    { number: '98%', label: 'Success Rate', icon: Award },
    { number: '24/7', label: 'AI Support', icon: Bot },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Consulting19 - AI-Powered Global Business Consulting</title>
        <meta name="description" content="Expert guidance for international business expansion. AI-powered platform connecting you with advisors in 19+ countries for tax optimization, company formation, and legal compliance." />
      </Helmet>

      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 text-white py-20 mt-16 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Floating Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-32 left-1/4 text-4xl animate-float">🌍</div>
          <div className="absolute top-48 right-1/4 text-3xl animate-float-delayed">🤖</div>
          <div className="absolute bottom-32 left-1/3 text-3xl animate-bounce delay-1000">🚀</div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8 shadow-lg border border-white/30">
              <Bot className="w-5 h-5 text-purple-300 mr-2 animate-pulse" />
              <span className="text-white font-medium">{t('aiPoweredIntelligence')}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              {t('heroTitle')}
              <br />
              <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
                {t('heroSubtitle')}
              </span>
            </h1>

            <p className="text-xl text-blue-100 leading-relaxed mb-10 max-w-4xl mx-auto">
              {t('heroDescription')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link to="/auth?mode=register">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold px-10 py-4 text-lg shadow-2xl border-0 transform hover:scale-105 transition-all duration-300"
                >
                  {t('heroPrimaryCTA')}
                </Button>
              </Link>
              <Link to="/services">
                <Button 
                  size="lg" 
                  className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/30 font-semibold px-10 py-4 text-lg transition-all duration-300"
                >
                  {t('heroSecondaryCTA')}
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-blue-100">
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span className="font-medium">19+ Countries</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span className="font-medium">Expert Network</span>
              </div>
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5" />
                <span className="font-medium">AI-Powered</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
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
            <h2 className="text-4xl font-bold text-white mb-6">
              How It Works
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Simple 4-step process to expand your business globally
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Target,
                title: 'AI Analysis',
                description: 'AI analyzes your needs and recommends optimal countries',
                step: 1,
              },
              {
                icon: Users,
                title: 'Expert Matching',
                description: 'Get matched with expert consultants in your target markets',
                step: 2,
              },
              {
                icon: MessageSquare,
                title: 'Professional Guidance',
                description: 'Work with local specialists who understand regulations',
                step: 3,
              },
              {
                icon: CheckCircle,
                title: 'Launch & Scale',
                description: 'Complete setup with ongoing compliance and support',
                step: 4,
              },
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-300 transition-colors duration-300">
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
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Comprehensive Business Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need for international business expansion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Link key={index} to={service.link}>
                <Card hover className="text-center h-full group cursor-pointer">
                  <Card.Body className="py-8">
                    <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-700 transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {service.description}
                    </p>
                    <Button variant="outline" size="sm" className="w-full group-hover:border-blue-500 group-hover:text-blue-700">
                      Learn More
                    </Button>
                  </Card.Body>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why Choose Consulting19?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced technology meets expert human guidance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} hover className="text-center group">
                <Card.Body className="py-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-purple-700 transition-colors duration-300">
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Expand Globally?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of entrepreneurs who have successfully expanded their businesses internationally with AI-powered guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth?mode=register">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold px-10 py-4 text-lg shadow-2xl border-0 transform hover:scale-105 transition-all duration-300"
              >
                Get Started Today
              </Button>
            </Link>
            <Link to="/ai-recommendations">
              <Button 
                size="lg" 
                className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/30 font-semibold px-10 py-4 text-lg transition-all duration-300"
              >
                Get AI Recommendations
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
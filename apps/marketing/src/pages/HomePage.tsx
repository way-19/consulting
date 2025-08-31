import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Globe, Users, Zap, Shield, Building2, Calculator, CreditCard, FileText, TrendingUp, BarChart3, MessageSquare, Send, X, Star, MapPin, Clock, Target } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../lib/language';
import { Button, Card } from '../lib/ui';
import { AIAgentIcon } from '@consulting19/shared';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HomePage = () => {
  const { t } = useLanguage();
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiMessage, setAiMessage] = useState('');

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
      title: 'Comprehensive Services',
      description: 'End-to-end support from formation to ongoing compliance',
    },
    {
      icon: Globe,
      title: 'Multi-Language Support',
      description: 'Platform available in English, Turkish, and Portuguese',
    },
  ];

  const countryRecommendations = [
    {
      id: 'georgia',
      name: 'Georgia',
      flag: '🇬🇪',
      image: 'https://images.pexels.com/photos/4386440/pexels-photo-4386440.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.9,
      link: '/countries/georgia',
      available: true,
    },
    {
      id: 'uae',
      name: 'United Arab Emirates',
      flag: '🇦🇪',
      image: 'https://images.pexels.com/photos/3787839/pexels-photo-3787839.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.8,
      link: '#',
      available: false,
    },
    {
      id: 'estonia',
      name: 'Estonia',
      flag: '🇪🇪',
      image: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.7,
      link: '#',
      available: false,
    },
    {
      id: 'usa',
      name: 'United States',
      flag: '🇺🇸',
      image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.9,
      link: '#',
      available: false,
    },
    {
      id: 'malta',
      name: 'Malta',
      flag: '🇲🇹',
      image: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.6,
      link: '#',
      available: false,
    },
    {
      id: 'portugal',
      name: 'Portugal',
      flag: '🇵🇹',
      image: 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.5,
      link: '#',
      available: false,
    },
    {
      id: 'panama',
      name: 'Panama',
      flag: '🇵🇦',
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.4,
      link: '#',
      available: false,
    },
    {
      id: 'switzerland',
      name: 'Switzerland',
      flag: '🇨🇭',
      image: 'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.8,
      link: '#',
      available: false,
    },
  ];

  const expertServices = [
    {
      icon: Building2,
      title: 'Company Formation',
      description: 'Professional business setup and incorporation services worldwide',
      color: 'blue',
      features: ['LLC & Corporation Setup', 'Government Registration', 'Legal Compliance', 'Ongoing Support'],
    },
    {
      icon: Calculator,
      title: 'Tax Optimization',
      description: 'Strategic tax planning and international tax optimization',
      color: 'green',
      features: ['Tax Planning', 'Double Tax Treaties', 'Residency Planning', 'Annual Compliance'],
    },
    {
      icon: CreditCard,
      title: 'Banking Solutions',
      description: 'Global banking access and financial services',
      color: 'purple',
      features: ['Account Opening', 'Multi-Currency', 'Payment Systems', 'Banking Relations'],
    },
    {
      icon: FileText,
      title: 'Legal Consulting',
      description: 'Comprehensive legal and regulatory compliance',
      color: 'orange',
      features: ['Contract Review', 'IP Protection', 'Compliance Monitoring', 'Legal Structure'],
    },
    {
      icon: Shield,
      title: 'Asset Protection',
      description: 'Wealth protection and asset security strategies',
      color: 'teal',
      features: ['Protection Strategy', 'Trust Setup', 'Risk Mitigation', 'Estate Planning'],
    },
    {
      icon: TrendingUp,
      title: 'Investment Advisory',
      description: 'Professional investment and wealth management',
      color: 'red',
      features: ['Portfolio Management', 'Alternative Investments', 'Real Estate', 'Crypto Compliance'],
    },
    {
      icon: Users,
      title: 'Visa & Residency',
      description: 'Immigration and residency planning services',
      color: 'indigo',
      features: ['Eligibility Review', 'Application Prep', 'Document Filing', 'Status Tracking'],
    },
    {
      icon: BarChart3,
      title: 'Market Research',
      description: 'Market intelligence and business research',
      color: 'pink',
      features: ['Market Analysis', 'Competitor Mapping', 'Pricing Insights', 'Regulations'],
    },
  ];

  const platformStats = [
    { label: 'Countries Covered', value: '19+', icon: Globe },
    { label: 'Expert Consultants', value: '50+', icon: Users },
    { label: 'Successful Projects', value: '2,500+', icon: CheckCircle },
    { label: 'Client Satisfaction', value: '98%', icon: Star },
  ];

  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    teal: 'from-teal-500 to-teal-600',
    red: 'from-red-500 to-red-600',
    indigo: 'from-indigo-500 to-indigo-600',
    pink: 'from-pink-500 to-pink-600',
  };

  const quickQuestions = [
    'I want to start a tech company',
    'Looking for tax optimization',
    'Need EU market access',
    'Interested in crypto business',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Consulting19 - AI-Powered Global Business Consulting</title>
        <meta name="description" content="Expert guidance for international business expansion. AI-powered platform connecting you with advisors in 19+ countries for tax optimization, company formation, and legal compliance." />
      </Helmet>

      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-blue-400/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 min-h-screen flex items-center pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-center">
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8 shadow-lg animate-fade-in border border-white/30">
                <Zap className="w-5 h-5 text-yellow-300 mr-2 animate-pulse" />
                <span className="text-white font-medium">AI-Enhanced Global Intelligence</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-8 animate-fade-in-up">
                AI-Enhanced Global
                <br />
                <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
                  Intelligence at Your Service
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-blue-100 leading-relaxed mb-12 max-w-4xl mx-auto animate-fade-in-up delay-200">
                Smart Hiring, Regulatory Guidance, and Expert Jurisdictional Advice &
                Comprehensive Business Formation Services
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-fade-in-up delay-300">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold px-10 py-5 text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 border-0"
                  icon={ArrowRight} 
                  iconPosition="right"
                  onClick={() => setShowAIChat(true)}
                >
                  Start Your Expansion
                </Button>
                <Button 
                  size="lg" 
                  className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/30 font-semibold px-10 py-5 text-lg transition-all duration-300"
                  onClick={() => setShowAIChat(true)}
                >
                  Explore Services
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI-Powered Country Recommendations */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              AI-Powered Country <span className="text-blue-600">Recommendations</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Advanced AI analyzes your business needs with intelligent guidance from 
              our expert consultants and comprehensive business formation services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {countryRecommendations.map((country, index) => (
              <Card 
                key={country.id} 
                hover 
                className={`relative overflow-hidden transition-all duration-300 group ${
                  country.available ? 'cursor-pointer' : 'opacity-75'
                }`}
                onClick={() => country.available && window.open(country.link, '_blank')}
              >
                <div className="relative h-48">
                  <img
                    src={country.image}
                    alt={country.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    {country.available && (
                      <span className="bg-green-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        Available
                      </span>
                    )}
                    {!country.available && (
                      <span className="bg-orange-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  
                  {/* Country Info */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-4xl drop-shadow-lg">{country.flag}</span>
                        <div>
                          <h3 className="text-lg font-bold text-white drop-shadow-lg">{country.name}</h3>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current drop-shadow-sm" />
                            <span className="text-white text-sm font-medium drop-shadow-sm">{country.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Analytics */}
      <section className="py-12 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-6 left-6 w-20 h-20 border border-blue-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-6 right-6 w-16 h-16 border border-teal-400 rounded-lg rotate-45 animate-bounce"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Real-Time Platform <span className="text-blue-400">Analytics</span>
            </h2>
            <p className="text-lg text-blue-100 max-w-3xl mx-auto">
              Advanced AI insights for optimal business decisions
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            {platformStats.map((stat, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border border-white/20">
                <Card.Body className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-teal-400 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-blue-200 text-xs">{stat.label}</div>
                </Card.Body>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
              <Card.Body className="text-center">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">AI Consulting</h3>
                <p className="text-blue-200 text-xs">Personalized business guidance</p>
              </Card.Body>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
              <Card.Body className="text-center">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Legal Consulting</h3>
                <p className="text-blue-200 text-xs">Expert legal advice worldwide</p>
              </Card.Body>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
              <Card.Body className="text-center">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Business Formation</h3>
                <p className="text-blue-200 text-xs">Complete formation services</p>
              </Card.Body>
            </Card>
          </div>

          <div className="text-center mt-6">
            <Button 
              size="md" 
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold px-8 py-4"
              onClick={() => setShowAIChat(true)}
            >
              Join Successful Businesses
            </Button>
          </div>
        </div>
      </section>

      {/* Expert Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Expert Services for <span className="text-blue-600">Global Success</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Expert consultants for every aspect of international business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {expertServices.map((service, index) => (
              <Card key={index} hover className="h-full">
                <Card.Body className="text-center">
                  <div className={`w-12 h-12 bg-gradient-to-r ${colorClasses[service.color as keyof typeof colorClasses]} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">{service.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    {service.features.map((feature, i) => (
                      <div key={i} className="flex items-center text-xs text-gray-700">
                        <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    variant="primary" 
                    size="sm" 
                    className={`w-full bg-gradient-to-r ${colorClasses[service.color as keyof typeof colorClasses]} border-0 text-white font-semibold`}
                  >
                    Learn More
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Chat Experience */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Experience the Future of <span className="text-blue-600">Business Consulting</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Advanced AI technology combined with expert human guidance for 
              intelligent business decisions and strategic international expansion
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 shadow-xl">
                <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900">AI Oracle Assistant</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        Hello! I can help you find the perfect jurisdiction for your business. What type of company are you looking to establish?
                      </p>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3 ml-8">
                      <p className="text-sm text-gray-700">
                        I want to start a tech company with international clients
                      </p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        Based on your needs, I recommend Estonia (EU access), Georgia (1% tax), or UAE (0% tax). Would you like detailed comparisons?
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <Button 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-6 py-3"
                    onClick={() => setShowAIChat(true)}
                  >
                    Try AI Assistant Now
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Intelligent Business Guidance</h3>
                  <p className="text-gray-600">AI-powered recommendations tailored to your specific business needs and goals</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Expert Human Support</h3>
                  <p className="text-gray-600">Local specialists in each jurisdiction provide hands-on guidance and support</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Comprehensive Solutions</h3>
                  <p className="text-gray-600">End-to-end business formation with ongoing compliance and optimization</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Insights */}
      <section className="py-20 bg-gradient-to-br from-gray-100 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Expert Insights from Our <span className="text-blue-600">Global Consultants</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Stay updated with the latest regulatory changes, market opportunities, and 
              strategic insights from our network of international business experts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'UAE Company Formation Guide 2024',
                excerpt: 'Complete guide to setting up your business in the UAE with zero corporate tax benefits',
                author: 'Ahmed Al-Rashid',
                country: '🇦🇪',
                date: '2 days ago',
                category: 'Company Formation',
                image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
              },
              {
                title: 'Estonian e-Residency Opportunities for Digital Nomads',
                excerpt: 'How Estonia\'s digital residency program can benefit your international business operations',
                author: 'Maria Kask',
                country: '🇪🇪',
                date: '5 days ago',
                category: 'Digital Nomad',
                image: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=800',
              },
              {
                title: 'Georgian Visa Updates for 2024',
                excerpt: 'Latest changes to Georgian visa requirements and new opportunities for international entrepreneurs',
                author: 'Giorgi Meskhi',
                country: '🇬🇪',
                date: '1 week ago',
                category: 'Immigration',
                image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800',
              },
            ].map((insight, index) => (
              <Card key={index} hover className="overflow-hidden">
                <div className="relative">
                  <img
                    src={insight.image}
                    alt={insight.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {insight.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 text-2xl">
                    {insight.country}
                  </div>
                </div>
                
                <Card.Body>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                    {insight.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {insight.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>{insight.author}</span>
                    <span>{insight.date}</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Read Full Article
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold px-8 py-4"
            >
              View All Expert Insights
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Expand Globally?
          </h2>
          <p className="text-xl text-blue-100 mb-12 leading-relaxed">
            Join thousands of entrepreneurs who have successfully expanded their businesses 
            internationally with our AI-powered platform and expert guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold px-10 py-5 text-lg shadow-2xl border-0"
              onClick={() => setShowAIChat(true)}
            >
              Start Your Journey Today
            </Button>
            <Button 
              size="lg" 
              className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/30 font-semibold px-10 py-5 text-lg"
              onClick={() => setShowAIChat(true)}
            >
              Schedule Free Consultation
            </Button>
          </div>
        </div>
      </section>

      <Footer />

      {/* AI Agent Icon - auto-opens on homepage */}
      <AIAgentIcon autoOpen={true} />

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
        
        .delay-200 {
          animation-delay: 0.2s;
          animation-fill-mode: both;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
          animation-fill-mode: both;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
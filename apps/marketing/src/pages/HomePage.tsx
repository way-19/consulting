import React, { useState, useEffect } from 'react';
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
  const [aiMessage, setAiMessage] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [companyFormationImageIndex, setCompanyFormationImageIndex] = useState(0);
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);

  // Financial background images for Matrix card
  const matrixBackgroundImages = [
    'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800', // Trading charts
    'https://images.pexels.com/photos/8369648/pexels-photo-8369648.jpeg?auto=compress&cs=tinysrgb&w=800', // Bitcoin/crypto
    'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=800', // Banking/finance
    'https://images.pexels.com/photos/3483098/pexels-photo-3483098.jpeg?auto=compress&cs=tinysrgb&w=800', // Stock market
  ];

  // Company formation background images
  const companyFormationBackgroundImages = [
    'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800', // Business meeting
    'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800', // Office workspace
    'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800', // Business documents
    'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800', // Corporate setup
  ];

  // Hero slider images with business themes
  const heroSlides = [
    {
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1920',
      title: 'AI-Enhanced Global Intelligence at Your Service',
      subtitle: 'Smart Hiring, Regulatory Guidance, and Expert Jurisdictional Advice',
      description: 'Comprehensive Business Formation Services',
      cta: 'Start Your Expansion',
      theme: 'business-meeting'
    },
    {
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1920',
      title: 'Global Business Consulting Platform',
      subtitle: 'Expert Guidance Worldwide',
      description: 'Connect with advisors in 19+ countries for seamless international expansion',
      cta: 'Explore Services',
      theme: 'workspace'
    },
    {
      image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1920',
      title: 'AI-Powered Tax Optimization',
      subtitle: 'Strategic International Tax Planning',
      description: 'Minimize your global tax burden with expert guidance and AI insights',
      cta: 'Optimize Taxes',
      theme: 'financial-data'
    },
    {
      image: 'https://images.pexels.com/photos/8369648/pexels-photo-8369648.jpeg?auto=compress&cs=tinysrgb&w=1920',
      title: 'Digital Asset & Crypto Compliance',
      subtitle: 'Blockchain Business Solutions',
      description: 'Navigate crypto regulations and establish compliant blockchain businesses',
      cta: 'Start Crypto Business',
      theme: 'cryptocurrency'
    },
    {
      image: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=1920',
      title: 'International Banking Solutions',
      subtitle: 'Global Financial Access',
      description: 'Open corporate accounts and access premium financial services worldwide',
      cta: 'Setup Banking',
      theme: 'banking'
    }
  ];
  // Rotate background images every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % matrixBackgroundImages.length);
      setCompanyFormationImageIndex((prev) => (prev + 1) % companyFormationBackgroundImages.length);
      setHeroSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [matrixBackgroundImages.length, companyFormationBackgroundImages.length, heroSlides.length]);

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
      id: 'usa',
      name: 'United States',
      flag: '🇺🇸',
      image: 'https://images.pexels.com/photos/290595/pexels-photo-290595.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.9,
      link: '#',
      available: false,
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

  const getServiceBackgroundImage = (serviceTitle: string) => {
    const serviceImages: { [key: string]: string } = {
      'Company Formation': 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
      'Tax Optimization': 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800',
      'Banking Solutions': 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=800',
      'Legal Consulting': 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=800',
      'Asset Protection': 'https://images.pexels.com/photos/3483098/pexels-photo-3483098.jpeg?auto=compress&cs=tinysrgb&w=800',
      'Investment Advisory': 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800',
      'Visa & Residency': 'https://images.pexels.com/photos/4386440/pexels-photo-4386440.jpeg?auto=compress&cs=tinysrgb&w=800',
      'Market Research': 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
    };
    
    return serviceImages[serviceTitle] || 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800';
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
      <section className="relative min-h-screen overflow-hidden">
        {/* Hero Slider Background */}
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === heroSlideIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.theme}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/60"></div>
            </div>
          ))}
        </div>

        {/* Animated Overlay Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-purple-400/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 min-h-screen flex items-center pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-center">
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8 shadow-lg animate-fade-in border border-white/30">
                <Zap className="w-5 h-5 text-yellow-300 mr-2 animate-pulse" />
                <span className="text-white font-medium">AI-Enhanced Global Intelligence</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-8 animate-fade-in-up transition-all duration-1000">
                {heroSlides[heroSlideIndex].title.split(' ').slice(0, -3).join(' ')}
                <br />
                <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
                  {heroSlides[heroSlideIndex].title.split(' ').slice(-3).join(' ')}
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-blue-100 leading-relaxed mb-4 max-w-4xl mx-auto animate-fade-in-up delay-200 transition-all duration-1000">
                {heroSlides[heroSlideIndex].subtitle}
              </p>
              
              <p className="text-lg text-gray-200 leading-relaxed mb-12 max-w-3xl mx-auto animate-fade-in-up delay-300 transition-all duration-1000">
                {heroSlides[heroSlideIndex].description}
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-fade-in-up delay-300">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold px-10 py-5 text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 border-0"
                  icon={ArrowRight} 
                  iconPosition="right"
                  onClick={() => setShowAIChat(true)}
                >
                  {heroSlides[heroSlideIndex].cta}
                </Button>
                <Button 
                  size="lg" 
                  className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/30 font-semibold px-10 py-5 text-lg transition-all duration-300"
                  onClick={() => setShowAIChat(true)}
                >
                  Explore Services
                </Button>
              </div>

              {/* Slider Indicators */}
              <div className="flex justify-center space-x-3 animate-fade-in-up delay-400">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setHeroSlideIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === heroSlideIndex 
                        ? 'bg-white shadow-lg scale-125' 
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Matrix Private Wealth & Company Formation Cards */}
      <section className="py-5 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Matrix — Private Wealth Card */}
            <Card hover className="overflow-hidden group relative bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 text-white">
              {/* Rotating Background Images */}
              <div className="absolute inset-0 opacity-20">
                {matrixBackgroundImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt="Financial background"
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                      index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                ))}
              </div>
              
              {/* Light shadow overlay for text readability */}
              <div className="absolute inset-0 bg-black/30"></div>
              
              {/* Premium Badge */}
              <div className="absolute top-4 left-4 z-20">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  ⭐ PREMIUM
                </span>
              </div>
              
              {/* Animated Pattern Overlay */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-8 right-8 w-32 h-32 border border-white/30 rounded-full animate-pulse"></div>
                <div className="absolute bottom-8 left-8 w-24 h-24 border border-white/20 rounded-lg rotate-45 animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl opacity-20 animate-pulse delay-500">₿</div>
              </div>
              
              <Card.Body className="p-6 relative z-10">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-white mb-2">
                    Matrix — Private Wealth
                  </h2>
                  <p className="text-purple-200 text-sm">
                    Ultra-high-net-worth platform with AI-assisted global allocation
                  </p>
                </div>
                
                <div className="space-y-3 mb-4">
                  {[
                    { icon: '🤖', text: 'AI-driven portfolio analysis' },
                    { icon: '🌍', text: 'Global investment opportunities' },
                    { icon: '🛡️', text: 'Strict confidentiality protocols' }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3 text-sm">
                      <span className="text-lg">{feature.icon}</span>
                      <span className="text-purple-100">{feature.text}</span>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-400">$68B+ AUM</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-400">98% Success</div>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold text-sm py-2 shadow-lg"
                  onClick={() => window.open('https://wealth.consulting19.com', '_blank')}
                >
                  🔥 Explore Matrix Wealth →
                </Button>
              </Card.Body>
            </Card>

            {/* Company Formation Card */}
            <Card hover className="overflow-hidden group relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 text-white">
              {/* Rotating Background Images */}
              <div className="absolute inset-0 opacity-20">
                {companyFormationBackgroundImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt="Company formation background"
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                      index === companyFormationImageIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                ))}
              </div>
              
              {/* Light shadow overlay for text readability */}
              <div className="absolute inset-0 bg-black/30"></div>
              
              {/* Icon Badge */}
              <div className="absolute top-4 left-4 z-20">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <Card.Body className="p-6 relative z-10">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-white mb-2">
                    Company Formation
                  </h2>
                  <p className="text-blue-200 text-sm">
                    Fast, compliant business setup in 19+ countries
                  </p>
                </div>
                
                <div className="space-y-3 mb-4">
                  {[
                    { icon: '⚡', text: 'AI-powered jurisdiction analysis' },
                    { icon: '🟢', text: 'Expert local guidance' },
                    { icon: '✅', text: 'Banking & compliance included' },
                    { icon: '🔒', text: 'Full legal documentation' }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3 text-sm">
                      <span className="text-lg">{feature.icon}</span>
                      <span className="text-blue-100">{feature.text}</span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 text-white hover:from-emerald-700 hover:to-blue-700 font-bold text-sm py-2 shadow-lg"
                  onClick={() => {/* URL will be added later */}}
                >
                  🚀 Start Company Formation →
                </Button>
              </Card.Body>
            </Card>
          </div>
        </div>
      </section>

      {/* AI-Powered Country Recommendations */}
      <section className="py-5 bg-white">
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

          <div className="text-center mt-8">
            <button
              onClick={() => window.location.href = '/countries'}
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 mr-2">View All Countries</span>
              <Globe className="relative z-10 w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </section>

      {/* Platform Analytics */}
      <section className="py-5 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
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
      <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-8 left-8 w-32 h-32 border-2 border-blue-300 rounded-full animate-pulse"></div>
          <div className="absolute bottom-8 right-8 w-24 h-24 border-2 border-purple-300 rounded-lg rotate-45 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-teal-300 rounded-full animate-bounce delay-500"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Expert Services for <span className="text-blue-600">Global Success</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Comprehensive business solutions delivered by certified experts across 19+ countries
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {expertServices.map((service, index) => (
              <Card key={index} hover className="h-full group relative overflow-hidden border-2 border-gray-100 hover:border-blue-200 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={getServiceBackgroundImage(service.title)}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-500"></div>
                </div>
                
                <Card.Body className="text-center p-6 relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-3 drop-shadow-2xl group-hover:text-yellow-300 transition-colors duration-300" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>{service.title}</h3>
                    <p className="text-white mb-4 leading-relaxed text-sm drop-shadow-xl" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>{service.description}</p>
                    
                    <div className="space-y-2 mb-6">
                      {service.features.map((feature, i) => (
                        <div key={i} className="flex items-center text-sm text-white group-hover:text-yellow-100 transition-colors duration-300">
                          <CheckCircle className="w-3 h-3 text-green-400 mr-2 flex-shrink-0 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" />
                          <span className="font-medium drop-shadow-lg" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    variant="primary"
                    size="sm"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 backdrop-blur-sm border-2 border-blue-500 text-white font-bold hover:from-blue-700 hover:to-purple-700 hover:text-white shadow-xl hover:shadow-2xl transform group-hover:scale-105 transition-all duration-300"
                  >
                    Explore {service.title}
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Chat Experience */}
      <section className="py-5 bg-white">
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
      <section className="py-5 bg-gradient-to-br from-gray-100 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Expert Insights from Our <span className="text-blue-600">Global Consultants</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Stay updated with the latest regulatory changes, market opportunities, and 
              strategic insights from our network of international business experts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <Card key={index} hover className="overflow-hidden h-full">
                <div className="relative">
                  <img
                    src={insight.image}
                    alt={insight.title}
                    className="w-full h-40 object-cover"
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
                  <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2">
                    {insight.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {insight.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
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

          <div className="text-center mt-8">
            <button
              onClick={() => window.location.href = '/blog'}
              className="group relative inline-flex items-center justify-center px-6 py-3 text-base font-bold text-white bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 via-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 mr-2">View All Expert Insights</span>
              <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white relative overflow-hidden">
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
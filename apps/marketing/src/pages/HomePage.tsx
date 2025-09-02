import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Globe, Users, Zap, Shield, Building2, Calculator, CreditCard, FileText, TrendingUp, BarChart3, MessageSquare, Send, X, Star, MapPin, Clock, Target, Home, ExternalLink, Bot } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../lib/language';
import { Button, Card } from '../lib/ui';
import { AIAgentIcon } from '@consulting19/shared';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HomePage = () => {
  const { t } = useLanguage();
  const [showAIChat, setShowAIChat] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Rotate background images every 4 seconds
  const propertyBackgroundImages = [
    'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800', // Modern house
    'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800', // Luxury property
    'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800', // Real estate investment
    'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=800', // Property development
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % propertyBackgroundImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [propertyBackgroundImages.length]);
  const [aiMessage, setAiMessage] = useState('');
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
      link: '/countries/usa',
      available: false,
    },
    {
      id: 'uae',
      name: 'United Arab Emirates',
      flag: '🇦🇪',
      image: 'https://images.pexels.com/photos/3787839/pexels-photo-3787839.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.8,
      link: '/countries/uae',
      available: false,
    },
    {
      id: 'estonia',
      name: 'Estonia',
      flag: '🇪🇪',
      image: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.7,
      link: '/countries/estonia',
      available: false,
    },
    {
      id: 'malta',
      name: 'Malta',
      flag: '🇲🇹',
      image: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.6,
      link: '/countries/malta',
      available: false,
    },
    {
      id: 'portugal',
      name: 'Portugal',
      flag: '🇵🇹',
      image: 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.5,
      link: '/countries/portugal',
      available: false,
    },
    {
      id: 'panama',
      name: 'Panama',
      flag: '🇵🇦',
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.4,
      link: '/countries/panama',
      available: false,
    },
    {
      id: 'switzerland',
      name: 'Switzerland',
      flag: '🇨🇭',
      image: 'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.8,
      link: '/countries/switzerland',
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
      link: '/services/company-formation',
    },
    {
      icon: Calculator,
      title: 'Tax Optimization',
      description: 'Strategic tax planning and international tax optimization',
      color: 'green',
      features: ['Tax Planning', 'Double Tax Treaties', 'Residency Planning', 'Annual Compliance'],
      link: '/services/tax-optimization',
    },
    {
      icon: CreditCard,
      title: 'Banking Solutions',
      description: 'Global banking access and financial services',
      color: 'purple',
      features: ['Account Opening', 'Multi-Currency', 'Payment Systems', 'Banking Relations'],
      link: '/services/banking-solutions',
    },
    {
      icon: FileText,
      title: 'Legal Consulting',
      description: 'Comprehensive legal and regulatory compliance',
      color: 'orange',
      features: ['Contract Review', 'IP Protection', 'Compliance Monitoring', 'Legal Structure'],
      link: '/services/legal-compliance',
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
                  Access Matrix Platform
                </Button>
              </Card.Body>
            </Card>

            {/* Company Formation Card */}
            <Card hover className="overflow-hidden group relative bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-800 text-white">
              {/* Rotating Background Images */}
              <div className="absolute inset-0 opacity-20">
                {companyFormationBackgroundImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt="Business background"
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                      index === companyFormationImageIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                ))}
              </div>
              
              {/* Light shadow overlay for text readability */}
              <div className="absolute inset-0 bg-black/30"></div>
              
              {/* Popular Badge */}
              <div className="absolute top-4 left-4 z-20">
                <span className="bg-gradient-to-r from-green-400 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  🔥 POPULAR
                </span>
              </div>
              
              {/* Animated Pattern Overlay */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-8 right-8 w-32 h-32 border border-white/30 rounded-lg animate-pulse"></div>
                <div className="absolute bottom-8 left-8 w-24 h-24 border border-white/20 rounded-full animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl opacity-20 animate-pulse delay-500">🏢</div>
              </div>
              
              <Card.Body className="p-6 relative z-10">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-white mb-2">
                    Company Formation Services
                  </h2>
                  <p className="text-blue-200 text-sm">
                    Professional business setup and incorporation worldwide
                  </p>
                </div>
                
                <div className="space-y-3 mb-4">
                  {[
                    { icon: '🏢', text: 'LLC & Corporation Setup' },
                    { icon: '📋', text: 'Government Registration' },
                    { icon: '⚖️', text: 'Legal Compliance Support' }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3 text-sm">
                      <span className="text-lg">{feature.icon}</span>
                      <span className="text-blue-100">{feature.text}</span>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-400">19+ Countries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-400">2,500+ Formed</div>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold text-sm py-2 shadow-lg"
                  onClick={() => setShowAIChat(true)}
                >
                  Start Company Formation
                </Button>
              </Card.Body>
            </Card>
          </div>
        </div>
      </section>

      {/* Platform Stats */}
      <section className="py-16 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Businesses Worldwide
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our AI-powered platform has helped thousands of entrepreneurs and businesses expand globally
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {platformStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
                    <IconComponent className="w-8 h-8 text-yellow-400" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-300 font-medium">
                    {stat.label}
                  </div>
                </div>
              );
            })}
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
              Our AI-enhanced platform combines cutting-edge technology with expert human guidance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} hover className="text-center p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Expert Services Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Business Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              End-to-end solutions for your international business expansion
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {expertServices.map((service, index) => {
              const IconComponent = service.icon;
              const gradientClass = colorClasses[service.color as keyof typeof colorClasses];
              
              return (
                <Card key={index} hover className="overflow-hidden group relative">
                  {/* Background Image */}
                  <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
                    <img
                      src={getServiceBackgroundImage(service.title)}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-90 group-hover:opacity-95 transition-opacity duration-300`}></div>
                  
                  <Card.Body className="p-6 relative z-10 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <IconComponent className="w-8 h-8" />
                      {service.link && (
                        <ExternalLink className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                    
                    <h3 className="text-lg font-bold mb-2">
                      {service.title}
                    </h3>
                    
                    <p className="text-sm opacity-90 mb-4 leading-relaxed">
                      {service.description}
                    </p>
                    
                    <div className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-xs">
                          <CheckCircle className="w-3 h-3 mr-2 opacity-80" />
                          <span className="opacity-90">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    {service.link && (
                      <div className="mt-4 pt-4 border-t border-white/20">
                        <Link 
                          to={service.link}
                          className="text-xs font-medium hover:underline flex items-center"
                        >
                          Learn More <ArrowRight className="w-3 h-3 ml-1" />
                        </Link>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Country Recommendations */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Jurisdictions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the best countries for your business based on AI recommendations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {countryRecommendations.map((country) => (
              <Card key={country.id} hover className="overflow-hidden group">
                <div className="relative h-48">
                  <img
                    src={country.image}
                    alt={country.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  
                  {/* Country Flag */}
                  <div className="absolute top-4 left-4">
                    <span className="text-3xl">{country.flag}</span>
                  </div>
                  
                  {/* Rating */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center">
                    <Star className="w-3 h-3 text-yellow-500 mr-1" />
                    <span className="text-xs font-medium text-gray-900">{country.rating}</span>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="absolute bottom-4 left-4">
                    {country.available ? (
                      <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        Available Now
                      </span>
                    ) : (
                      <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        Coming Soon
                      </span>
                    )}
                  </div>
                </div>
                
                <Card.Body className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {country.name}
                  </h3>
                  
                  {country.available ? (
                    <Link 
                      to={country.link}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      Explore Details <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  ) : (
                    <button 
                      onClick={() => setShowAIChat(true)}
                      className="inline-flex items-center text-gray-500 font-medium text-sm cursor-pointer hover:text-gray-700"
                    >
                      Get Notified <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  )}
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Chat Modal */}
      {showAIChat && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">AI Business Advisor</h3>
                  <p className="text-xs opacity-90">Powered by Consulting19</p>
                </div>
              </div>
              <button
                onClick={() => setShowAIChat(false)}
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Chat Content */}
            <div className="p-6 space-y-4">
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-3">
                  👋 Hi! I'm your AI business advisor. I can help you with:
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Jurisdiction recommendations</li>
                  <li>• Tax optimization strategies</li>
                  <li>• Company formation guidance</li>
                  <li>• Banking solutions</li>
                </ul>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Quick questions:</p>
                <div className="space-y-2">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setAiMessage(question)}
                      className="w-full text-left text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg p-3 transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Input */}
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={aiMessage}
                  onChange={(e) => setAiMessage(e.target.value)}
                  placeholder="Ask me anything about international business..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default HomePage;
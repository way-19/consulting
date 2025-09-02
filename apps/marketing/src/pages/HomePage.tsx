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
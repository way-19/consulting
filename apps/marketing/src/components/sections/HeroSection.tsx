import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Sparkles, Globe, Users, Zap, TrendingUp, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@consulting19/shared';
import { Button } from '@consulting19/ui';

const HeroSection = () => {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      icon: Globe,
      title: 'Global Network',
      subtitle: '19+ Countries',
      description: 'Expert advisors across business-friendly jurisdictions worldwide',
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
      color: 'from-blue-600 to-blue-700'
    },
    {
      icon: Users,
      title: 'Expert Consultants',
      subtitle: '500+ Specialists',
      description: 'Certified professionals with deep local market knowledge',
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
      color: 'from-teal-600 to-teal-700'
    },
    {
      icon: Zap,
      title: 'AI-Powered Matching',
      subtitle: 'Instant Results',
      description: 'Advanced AI algorithms for perfect consultant-client pairing',
      image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
      color: 'from-purple-600 to-purple-700'
    },
    {
      icon: TrendingUp,
      title: 'Success Rate',
      subtitle: '98% Completion',
      description: 'Proven track record of successful business formations',
      image: 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=800',
      color: 'from-green-600 to-green-700'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      subtitle: 'Bank-Grade Protection',
      description: 'Advanced security measures protecting your sensitive data',
      image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800',
      color: 'from-orange-600 to-orange-700'
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-16 pb-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-16 left-8 w-60 h-60 bg-blue-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-16 right-8 w-80 h-80 bg-teal-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-purple-500 rounded-full opacity-5 blur-2xl animate-bounce"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <Sparkles className="w-4 h-4 text-yellow-300 mr-2 animate-pulse" />
              <span className="text-sm font-medium text-blue-100">AI-Powered Intelligence</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              {t('hero.title')}
            </h1>
            
            <p className="text-lg text-blue-100 leading-relaxed max-w-lg">
              {t('hero.subtitle')}. Connect with expert advisors in 19+ countries for tax optimization, company formation, and legal compliance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button size="md" icon={ArrowRight} iconPosition="right" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 border-0 shadow-xl">
                  {t('hero.cta.primary')}
                </Button>
              </Link>
              <Link to="/services">
                <Button size="md" variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white hover:text-gray-900 backdrop-blur-sm">
                  {t('hero.cta.secondary')}
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center space-x-6 pt-2">
              <div className="flex items-center text-sm text-blue-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Enterprise Security
              </div>
              <div className="flex items-center text-sm text-blue-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                24/7 Support
              </div>
              <div className="flex items-center text-sm text-blue-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                99.9% Uptime
              </div>
            </div>
          </div>

          {/* Modern Slider */}
          <div 
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="relative bg-slate-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-slate-700/50 overflow-hidden">
              {/* Background Image */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <img 
                  src={slides[currentSlide].image} 
                  alt={slides[currentSlide].title}
                  className="w-full h-full object-cover opacity-20 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-800/60 to-transparent"></div>
              </div>
              
              {/* Content */}
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Platform Highlights</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-400 font-medium">Live</span>
                  </div>
                </div>
                
                {/* Current Slide Content */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${slides[currentSlide].color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <slides[currentSlide].icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-lg">{slides[currentSlide].title}</div>
                      <div className="text-blue-300 font-medium">{slides[currentSlide].subtitle}</div>
                    </div>
                  </div>
                  
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {slides[currentSlide].description}
                  </p>
                </div>
                
                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentSlide ? 'bg-blue-400 w-6' : 'bg-slate-600 hover:bg-slate-500'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={prevSlide}
                      className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-center pt-2">
                  <Link to="/ai-assistant">
                    <Button size="sm" icon={Play} iconPosition="left" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 text-white shadow-lg">
                      Experience AI Oracle
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Globe, Users, Zap, TrendingUp, Shield } from 'lucide-react';
import { useLanguage } from '@consulting19/shared';
import { Button } from '@consulting19/ui';

const HeroSection = () => {
  const { t, language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      title: t('heroTitle1'),
      subtitle: t('heroSubtitle1'),
      description: t('heroDescription1'),
      image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1920',
      primaryCTA: t('heroPrimaryCTA1'),
      secondaryCTA: t('heroSecondaryCTA1'),
      gradient: 'from-purple-900/80 via-blue-900/70 to-black/60'
    },
    {
      title: t('heroTitle2'),
      subtitle: t('heroSubtitle2'),
      description: t('heroDescription2'),
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1920',
      primaryCTA: t('heroPrimaryCTA2'),
      secondaryCTA: t('heroSecondaryCTA2'),
      gradient: 'from-blue-900/80 via-teal-900/70 to-black/60'
    },
    {
      title: t('heroTitle3'),
      subtitle: t('heroSubtitle3'),
      description: t('heroDescription3'),
      image: 'https://images.pexels.com/photos/8439093/pexels-photo-8439093.jpeg?auto=compress&cs=tinysrgb&w=1920',
      primaryCTA: t('heroPrimaryCTA3'),
      secondaryCTA: t('heroSecondaryCTA3'),
      gradient: 'from-indigo-900/80 via-purple-900/70 to-black/60'
    },
    {
      title: t('heroTitle4'),
      subtitle: t('heroSubtitle4'),
      description: t('heroDescription4'),
      image: 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=1920',
      primaryCTA: t('heroPrimaryCTA4'),
      secondaryCTA: t('heroSecondaryCTA4'),
      gradient: 'from-green-900/80 via-emerald-900/70 to-black/60'
    },
    {
      title: t('heroTitle5'),
      subtitle: t('heroSubtitle5'),
      description: t('heroDescription5'),
      image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1920',
      primaryCTA: t('heroPrimaryCTA5'),
      secondaryCTA: t('heroSecondaryCTA5'),
      gradient: 'from-slate-900/80 via-gray-900/70 to-black/60'
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // 5 seconds per slide

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  return (
    <section 
      className="relative h-screen overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Images with Transitions */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`}></div>
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-4xl">
            {/* AI Badge */}
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8 shadow-lg">
              <Sparkles className="w-5 h-5 text-yellow-300 mr-2 animate-pulse" />
              <span className="text-white font-medium">{t('aiPoweredIntelligence')}</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              {slides[currentSlide].title}
              <br />
              <span className="text-yellow-400">
                {slides[currentSlide].subtitle}
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed mb-10 max-w-3xl">
              {slides[currentSlide].description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to="/register">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:from-blue-700 hover:to-teal-700 font-semibold px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  icon={ArrowRight} 
                  iconPosition="right"
                >
                  {slides[currentSlide].primaryCTA}
                </Button>
              </Link>
              <Link to="/services">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white hover:text-gray-900 backdrop-blur-sm font-semibold px-8 py-4 text-lg transition-all duration-300"
                >
                  {slides[currentSlide].secondaryCTA}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center space-x-4">
          {/* Slide Indicators */}
          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-white w-8' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Arrow Navigation */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 group"
      >
        <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 group"
      >
        <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
      </button>

      {/* Slide Counter */}
      <div className="absolute top-8 right-8 z-20 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2">
        <span className="text-white font-medium">
          {currentSlide + 1} / {slides.length}
        </span>
      </div>
    </section>
  );
};

export default HeroSection;
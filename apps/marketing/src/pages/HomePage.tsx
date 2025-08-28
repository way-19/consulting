import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Globe, Users, Zap, Shield, TrendingUp, MessageCircle, Calendar, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@consulting19/shared';
import { Button, Card } from '@consulting19/ui';
import { getLatestBlogPosts } from '../data/mockBlogPosts';
import HeroSection from '../components/sections/HeroSection';
import HowItWorksSection from '../components/sections/HowItWorksSection';
import ServicesOverviewSection from '../components/sections/ServicesOverviewSection';
import FeaturedCountriesSection from '../components/sections/FeaturedCountriesSection';
import AIPromotionSection from '../components/sections/AIPromotionSection';
import BlogSliderSection from '../components/sections/BlogSliderSection';
import RealTimeAnalyticsSection from '../components/sections/RealTimeAnalyticsSection';
import AIAssistantWidget from '../components/AIAssistantWidget';

const HomePage = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <HeroSection />
      <HowItWorksSection />
      
      {/* Split Content Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-blue-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 border-2 border-teal-400 rounded-lg rotate-45 animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 border-2 border-purple-400 rounded-full animate-ping"></div>
          <div className="absolute top-1/3 right-1/3 w-20 h-20 border-2 border-yellow-400 rounded-lg animate-pulse"></div>
          <div className="absolute top-1/4 right-1/4 w-12 h-12 border-2 border-pink-400 rounded-full animate-bounce"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-8 h-8 bg-gradient-to-r from-teal-400 to-blue-400 rounded-lg rotate-45 animate-bounce"></div>
          <div className="absolute top-1/3 left-1/3 w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-ping"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side - Wealth Management CTA */}
          <WealthCTASection />

          {/* Right Side Content */}
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 hover:shadow-3xl hover:bg-white transition-all duration-500 relative overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-teal-50/50 rounded-2xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl flex items-center justify-center mr-4 shadow-xl">
                  <span className="text-white text-xl">🏢</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {t('company.title')}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {t('company.subtitle')}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-green-600 text-sm">⚡</span>
                  </div>
                  <p className="text-gray-700 font-medium">{t('company.feature1')}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-blue-600 text-sm">🌍</span>
                  </div>
                  <p className="text-gray-700 font-medium">{t('company.feature2')}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-purple-600 text-sm">✅</span>
                  </div>
                  <p className="text-gray-700 font-medium">{t('company.feature3')}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-orange-600 text-sm">👨‍💼</span>
                  </div>
                  <p className="text-gray-700 font-medium">{t('company.feature4')}</p>
                </div>
              </div>
              
              <button
                className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-bold py-3 px-6 rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                onClick={() => {
                  // Yönlendirme daha sonra eklenecek
                  console.log('Company formation order clicked');
                }}
              >
                <span className="flex items-center justify-center">
                  <span className="mr-2">🚀</span>
                  {t('company.cta')}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </span>
              </button>
            </div>
          </div>
          </div>
        </div>
      </section>
      
      <ServicesOverviewSection />
      <FeaturedCountriesSection />
      <AIPromotionSection />
      <RealTimeAnalyticsSection />
      <BlogSliderSection />
      
      {/* AI Assistant Widget - only on homepage */}
      <AIAssistantWidget />
    </div>
  );
};

// Wealth CTA Component with rotating backgrounds
const WealthCTASection = () => {
  const { t } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Wealth-themed background images
  const backgroundImages = [
    'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800', // Luxury office
    'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=800', // Financial charts
    'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=800', // Banking/vault
    'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=800', // Cryptocurrency
    'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=800', // Investment planning
  ];

  // Rotate background images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <div className="relative overflow-hidden rounded-xl shadow-xl h-80">
      {/* Rotating Background Images */}
      {backgroundImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={image}
            alt="Wealth management"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-purple-900/60 to-black/80"></div>
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
        {/* Top Section */}
        <div>
          {/* Premium Badge */}
          <div className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold mb-4 shadow-lg">
            <span className="mr-1">💎</span>
            PREMIUM
          </div>
          
          <h2 className="text-xl font-bold mb-3 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            {t('wealth.title')}
          </h2>
          
          <p className="text-blue-100 mb-4 text-sm leading-relaxed">
            {t('wealth.subtitle')}
          </p>
        </div>

        {/* Middle Section - Features */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-xs">🤖</span>
            </div>
            <span className="text-sm font-medium">{t('wealth.feature1')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-xs">🌍</span>
            </div>
            <span className="text-sm font-medium">{t('wealth.feature2')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs">♾️</span>
            </div>
            <span className="text-sm font-medium">{t('wealth.feature3')}</span>
          </div>
        </div>

        {/* Bottom Section */}
        <div>
          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center">
              <div className="text-sm font-bold text-yellow-400">{t('wealth.stat1')}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center">
              <div className="text-sm font-bold text-green-400">{t('wealth.stat2')}</div>
            </div>
          </div>
          
          {/* CTA Button */}
          <a
            href="https://wealth.consulting19.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-sm"
          >
            <span className="mr-1">✨</span>
            {t('wealth.cta')}
            <ArrowRight className="ml-1 w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
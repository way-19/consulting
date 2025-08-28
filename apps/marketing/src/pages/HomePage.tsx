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

// Inline WealthCTASection component
const WealthCTASection = () => {
  const { t } = useLanguage();
  
  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/30 hover:shadow-2xl hover:bg-white/95 transition-all duration-500 relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-indigo-50/30 to-purple-50/40 rounded-2xl"></div>
      
      <div className="relative z-10">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mr-4 shadow-xl">
            <span className="text-white text-xl">💰</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Wealth Management
            </h2>
            <p className="text-gray-600 text-sm">
              Professional financial advisory services
            </p>
          </div>
        </div>
        
        <div className="space-y-4 mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-green-600 text-sm">📈</span>
            </div>
            <p className="text-gray-700 font-medium">Investment Portfolio Management</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-emerald-600 text-sm">🏦</span>
            </div>
            <p className="text-gray-700 font-medium">Tax Optimization Strategies</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-teal-600 text-sm">💎</span>
            </div>
            <p className="text-gray-700 font-medium">Wealth Preservation Planning</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-blue-600 text-sm">🎯</span>
            </div>
            <p className="text-gray-700 font-medium">Personalized Financial Goals</p>
          </div>
        </div>
        
        <button
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
          onClick={() => {
            console.log('Wealth management consultation clicked');
          }}
        >
          <span className="flex items-center justify-center">
            <span className="mr-2">💰</span>
            Start Wealth Consultation
            <ArrowRight className="ml-2 w-4 h-4" />
          </span>
        </button>
      </div>
    </div>
  );
};

const HomePage = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <HeroSection />
      <HowItWorksSection />
      
      {/* Split Content Section */}
      <section className="py-20 bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-100 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-blue-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 border-2 border-indigo-400 rounded-lg rotate-45 animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 border-2 border-purple-400 rounded-full animate-ping"></div>
          <div className="absolute top-1/3 right-1/3 w-20 h-20 border-2 border-teal-400 rounded-lg animate-pulse"></div>
          <div className="absolute top-1/4 left-1/3 w-12 h-12 border-2 border-blue-500 rounded-full animate-bounce"></div>
          <div className="absolute top-1/4 right-1/4 w-12 h-12 border-2 border-indigo-500 rounded-full animate-bounce"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 opacity-12">
          <div className="absolute top-20 right-20 w-6 h-6 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-lg rotate-45 animate-bounce"></div>
          <div className="absolute top-1/3 left-1/3 w-4 h-4 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-ping"></div>
          <div className="absolute bottom-1/3 right-1/4 w-5 h-5 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full animate-pulse"></div>
          <div className="absolute top-1/5 right-1/5 w-3 h-3 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-bounce"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side - Wealth Management CTA */}
          <WealthCTASection />

          {/* Right Side Content */}
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/40 hover:shadow-3xl hover:bg-white/98 transition-all duration-500 relative overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-indigo-50/30 to-purple-50/40 rounded-2xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-4 shadow-xl">
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
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-blue-600 text-sm">⚡</span>
                  </div>
                  <p className="text-gray-700 font-medium">{t('company.feature1')}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-indigo-600 text-sm">🌍</span>
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
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-teal-600 text-sm">👨‍💼</span>
                  </div>
                  <p className="text-gray-700 font-medium">{t('company.feature4')}</p>
                </div>
              </div>
              
              <button
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
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
      <BlogSliderSection />
      <RealTimeAnalyticsSection />
      <AIAssistantWidget />
    </div>
  );
};

export default HomePage;
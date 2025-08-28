import React from 'react';
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side - Wealth Management CTA */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8 text-white shadow-2xl">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 w-20 h-20 border border-white rounded-full animate-pulse"></div>
              <div className="absolute bottom-4 left-4 w-16 h-16 border border-white rounded-lg rotate-45 animate-bounce"></div>
              <div className="absolute top-1/2 left-1/3 w-12 h-12 border border-white rounded-full animate-ping"></div>
            </div>
            
            <div className="relative z-10">
              {/* Premium Badge */}
              <div className="inline-flex items-center bg-gradient-to-r from-gold-400 to-yellow-500 text-black px-4 py-2 rounded-full text-sm font-bold mb-6 shadow-lg">
                <span className="mr-2">💎</span>
                PREMIUM
              </div>
              
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                {t('wealth.title')}
              </h2>
              
              <p className="text-blue-100 mb-6 leading-relaxed">
                {t('wealth.subtitle')}
              </p>
              
              {/* Features */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-sm">🤖</span>
                  </div>
                  <span className="font-medium">{t('wealth.feature1')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-sm">🌍</span>
                  </div>
                  <span className="font-medium">{t('wealth.feature2')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center">
                    <span className="text-sm">♾️</span>
                  </div>
                  <span className="font-medium">{t('wealth.feature3')}</span>
                </div>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-1 gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400">{t('wealth.stat1')}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">{t('wealth.stat2')}</div>
                </div>
              </div>
              
              {/* CTA Button */}
              <a
                href="https://wealth.consulting19.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold py-4 px-8 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <span className="mr-2">✨</span>
                {t('wealth.cta')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </div>
            
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-indigo-600/20 rounded-2xl blur-xl"></div>
          </div>

          {/* Right Side Content */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">
              Sağ Taraf Başlığı
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Sağ taraf içeriği buraya gelecek. Bu bölümde hangi konuyu ele almak istediğinizi belirtin.
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
                <p className="text-gray-700">Sağ taraf madde 1</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
                <p className="text-gray-700">Sağ taraf madde 2</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
                <p className="text-gray-700">Sağ taraf madde 3</p>
              </div>
            </div>
          </div>

          {/* Right Side Content */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">
              Sağ Taraf Başlığı
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Sağ taraf içeriği buraya gelecek. Bu bölümde hangi konuyu ele almak istediğinizi belirtin.
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
                <p className="text-gray-700">Sağ taraf madde 1</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
                <p className="text-gray-700">Sağ taraf madde 2</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
                <p className="text-gray-700">Sağ taraf madde 3</p>
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

export default HomePage;
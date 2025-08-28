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
          {/* Left Side Content */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">
              Sol Taraf Başlığı
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Sol taraf içeriği buraya gelecek. Bu bölümde hangi konuyu ele almak istediğinizi belirtin.
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <p className="text-gray-700">Sol taraf madde 1</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <p className="text-gray-700">Sol taraf madde 2</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <p className="text-gray-700">Sol taraf madde 3</p>
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
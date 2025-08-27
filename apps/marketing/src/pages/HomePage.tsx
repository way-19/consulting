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

const HomePage = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <HeroSection />
      <HowItWorksSection />
      <ServicesOverviewSection />
      <FeaturedCountriesSection />
      <AIPromotionSection />
      <BlogSliderSection />
      
      {/* Trust Indicators */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users, label: '500+ Clients Served', value: '500+' },
              { icon: Globe, label: 'Countries Covered', value: '19+' },
              { icon: CheckCircle, label: 'Success Rate', value: '98%' },
              { icon: TrendingUp, label: 'Average Tax Savings', value: '35%' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Expand Your Business Globally?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of entrepreneurs who trust Consulting19 for their international expansion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" icon={ArrowRight} iconPosition="right">
              <Link to="/register" className="text-white">
                Get Started Today
              </Link>
            </Button>
            <Button size="lg" variant="outline" icon={MessageCircle} iconPosition="left" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Link to="/ai-assistant">
                Try AI Assistant
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
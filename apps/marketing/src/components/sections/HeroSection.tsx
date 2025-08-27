import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { useLanguage } from '@consulting19/shared';
import { Button } from '@consulting19/ui';

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-teal-50 pt-20 pb-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-200 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center bg-white rounded-full px-4 py-2 shadow-md">
              <Sparkles className="w-4 h-4 text-yellow-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">AI-Powered Intelligence</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              {t('hero.title')}
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
              {t('hero.subtitle')}. Connect with expert advisors in 19+ countries for tax optimization, company formation, and legal compliance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button size="lg" icon={ArrowRight} iconPosition="right" className="w-full sm:w-auto">
                  {t('hero.cta.primary')}
                </Button>
              </Link>
              <Link to="/services">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  {t('hero.cta.secondary')}
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center space-x-6 pt-4">
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Enterprise Security
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                24/7 Support
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                99.9% Uptime
              </div>
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative">
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-600 rounded-lg"></div>
              <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-teal-600 rounded-lg"></div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">AI Analysis Results</h3>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="font-medium text-blue-900">Recommended: UAE</div>
                    <div className="text-sm text-blue-700">0% corporate tax, strategic location</div>
                  </div>
                  <div className="bg-teal-50 p-4 rounded-lg">
                    <div className="font-medium text-teal-900">Alternative: Estonia</div>
                    <div className="text-sm text-teal-700">Digital nomad friendly, EU access</div>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <Link to="/ai-assistant">
                    <Button size="sm" icon={Play} iconPosition="left">
                      Try AI Assistant
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
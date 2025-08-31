import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Bot, Zap } from 'lucide-react';
import { useLanguage } from '../../lib/language';
import { Button } from '../../lib/ui';

const AIPromotionSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border border-white rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 border border-white rounded-lg rotate-45"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-white rounded-full"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-white">
            <div className="inline-flex items-center bg-white/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-yellow-300 mr-2" />
              <span className="text-sm font-medium">{t('aiPoweredIntelligence')}</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t('aiPromotionTitle')}
            </h2>
            
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              {t('aiPromotionDescription')}
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <Zap className="w-5 h-5 text-yellow-300 mr-3" />
                <span>{t('instantJurisdictionRecommendations')}</span>
              </div>
              <div className="flex items-center">
                <Bot className="w-5 h-5 text-yellow-300 mr-3" />
                <span>{t('aiPoweredExpertMatching')}</span>
              </div>
              <div className="flex items-center">
                <ArrowRight className="w-5 h-5 text-yellow-300 mr-3" />
                <span>{t('personalizedBusinessStrategies')}</span>
              </div>
            </div>

            <Link to="/ai-assistant">
              <Button 
                size="lg" 
                className="bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl font-semibold"
                icon={Sparkles}
                iconPosition="left"
              >
                {t('tryAiAssistantFree')}
              </Button>
            </Link>
          </div>

          {/* Interactive Demo Preview */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-6 transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">{t('aiOracleAssistant')}</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600 font-medium">{t('online')}</span>
                </div>
              </div>
              
              {/* Chat Interface Preview */}
              <div className="space-y-4 mb-6">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-sm text-blue-900 font-medium">{t('aiOracleAssistant')}</div>
                  <div className="text-sm text-blue-800">{t('aiPromotionDescription')}</div>
                </div>
                
                <div className="bg-gray-100 p-3 rounded-lg ml-8">
                  <div className="text-sm text-gray-700">E-ticaret işi AB pazarlarını hedefliyor</div>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-sm text-blue-900 font-medium">{t('aiOracleAssistant')}</div>
                  <div className="text-sm text-blue-800">İhtiyaçlarınıza göre, uygun vergi yapılarıyla AB erişimi için Estonya veya Malta öneriyorum...</div>
                </div>
              </div>
              
              <Link to="/ai-assistant">
                <Button variant="primary" size="sm" className="w-full">
                  {t('startConsultation')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIPromotionSection;
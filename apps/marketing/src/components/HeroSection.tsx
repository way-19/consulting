import React from 'react';
import { ArrowRight, Zap } from 'lucide-react';
import { useLanguage, Button } from '@consulting19/shared';

interface HeroSectionProps {
  onStartChat: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onStartChat }) => {
  const { t } = useLanguage();

  return (
    <section className="relative h-screen overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Global business consulting"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-blue-900/70 to-black/60"></div>
      </div>

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-4xl">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8 shadow-lg">
              <Zap className="w-5 h-5 text-yellow-300 mr-2 animate-pulse" />
              <span className="text-white font-medium">{t('aiPoweredIntelligence')}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              {t('heroTitle')}
              <br />
              <span className="text-yellow-400">
                {t('heroSubtitle')}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-200 leading-relaxed mb-10 max-w-3xl">
              {t('heroDescription')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:from-blue-700 hover:to-teal-700 font-semibold px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                icon={ArrowRight} 
                iconPosition="right"
                onClick={onStartChat}
              >
                {t('heroPrimaryCTA')}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white hover:text-gray-900 backdrop-blur-sm font-semibold px-8 py-4 text-lg transition-all duration-300"
                onClick={onStartChat}
              >
                {t('heroSecondaryCTA')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
import React from 'react';
import { Search, Zap, Users, Globe } from 'lucide-react';
import { useLanguage } from '../../lib/language';

const HowItWorksSection = () => {
  const { t } = useLanguage();

  const steps = [
    {
      icon: Search,
      title: t('step1Title'),
      description: t('step1Description'),
      image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      icon: Zap,
      title: t('step2Title'),
      description: t('step2Description'),
      image: 'https://images.pexels.com/photos/8439093/pexels-photo-8439093.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      icon: Users,
      title: t('step3Title'),
      description: t('step3Description'),
      image: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      icon: Globe,
      title: t('step4Title'),
      description: t('step4Description'),
      image: 'https://images.pexels.com/photos/8439093/pexels-photo-8439093.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
  ];

  return (
    <section className="pt-[30px] pb-14 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-14 left-7 w-22 h-22 border border-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-14 right-7 w-17 h-17 border border-teal-400 rounded-lg rotate-45 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-11 h-11 border border-purple-400 rounded-full animate-ping"></div>
        <div className="absolute top-1/3 right-1/3 w-14 h-14 border border-cyan-400 rounded-lg animate-pulse"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-11">
          <div className="inline-flex items-center bg-blue-500/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
            <Zap className="w-5 h-5 text-blue-400 mr-2 animate-pulse" />
            <span className="text-blue-300 font-medium">{t('aiPoweredProcess')}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            {t('howItWorksTitle')}
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            {t('howItWorksDescription')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="group relative">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-400 via-teal-400 to-transparent z-0 animate-pulse"></div>
              )}
              
              <div className="relative bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-xl hover:shadow-blue-500/25 transition-all duration-500 text-center border border-white/20 group-hover:border-blue-400/50 group-hover:bg-white/15">
                {/* Background Image Overlay */}
                <div className="absolute inset-0 rounded-xl overflow-hidden opacity-20 group-hover:opacity-30 transition-opacity duration-500">
                  <img 
                    src={step.image} 
                    alt={step.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent"></div>
                </div>
                
                <div className="relative z-10">
                  <div className="relative mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-110">
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg animate-bounce">
                      {index + 1}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-sm text-blue-100 leading-relaxed group-hover:text-white transition-colors duration-300">
                    {step.description}
                  </p>
                </div>

                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-11">
          <div className="inline-flex items-center bg-gradient-to-r from-blue-600 to-teal-600 rounded-full px-6 py-3 shadow-xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105">
            <Zap className="w-5 h-5 text-white mr-2 animate-pulse" />
            <span className="text-white font-medium text-sm">{t('experienceAiConsulting')}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
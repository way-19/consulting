import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, DollarSign, Shield, Zap, Scale, Target, Globe, ArrowRight } from 'lucide-react';
import { useLanguage } from '@consulting19/shared';
import { Button } from '@consulting19/ui';

const RealTimeAnalyticsSection = () => {
  const { t } = useLanguage();

  const stats = [
    {
      icon: TrendingUp,
      value: '1,247+',
      label: t('activeConsultations'),
      description: 'Dünya çapında devam eden müşteri etkileşimleri',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-slate-800/50',
    },
    {
      icon: DollarSign,
      value: '8',
      label: t('strategicJurisdictions'),
      description: 'Uzman danışmanları olan ülkeler',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-slate-800/50',
    },
    {
      icon: Shield,
      value: '98%',
      label: t('successRate'),
      description: 'Başarılı şirket kuruluşları',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-slate-800/50',
    },
    {
      icon: Zap,
      value: '47min',
      label: t('avgResponseTime'),
      description: 'Yapay zeka destekli anında destek',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-slate-800/50',
    },
    {
      icon: Scale,
      value: t('aiPoweredMatching'),
      label: '',
      description: t('aiMatchingDescription'),
      color: 'from-blue-500 to-orange-500',
      bgColor: 'bg-slate-800/50',
      isWide: true,
    },
    {
      icon: Target,
      value: t('legalCompliance'),
      label: '',
      description: t('legalComplianceDescription'),
      color: 'from-slate-500 to-slate-600',
      bgColor: 'bg-slate-800/50',
      isWide: true,
    },
    {
      icon: Globe,
      value: t('successOptimization'),
      label: '',
      description: t('successOptimizationDescription'),
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-slate-800/50',
      isWide: true,
    },
  ];

  return (
    <section className="pt-[34px] pb-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-16 left-16 w-32 h-32 border border-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-16 right-16 w-24 h-24 border border-teal-400 rounded-lg rotate-45 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-20 h-20 border border-purple-400 rounded-full animate-ping"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-blue-500/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
            <Globe className="w-5 h-5 text-blue-400 mr-2" />
            <span className="text-blue-300 font-medium">{t('globalIntelligenceNetwork')}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-5">
            {t('realTimeAnalyticsTitle')}
          </h2>
          <p className="text-base text-slate-300 max-w-3xl mx-auto">
            {t('realTimeAnalyticsDescription')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {stats.slice(0, 4).map((stat, index) => (
            <div key={index} className="group relative">
              <div className={`${stat.bgColor} backdrop-blur-lg p-5 rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:transform hover:scale-105`}>
                <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm font-medium text-slate-300 mb-2">{stat.label}</div>
                <div className="text-xs text-slate-400">{stat.description}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Wide Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10">
          {stats.slice(4).map((stat, index) => (
            <div key={index} className="group relative">
              <div className={`${stat.bgColor} backdrop-blur-lg p-5 rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:transform hover:scale-105`}>
                <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-base font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-slate-300 leading-relaxed">{stat.description}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="bg-slate-800/50 backdrop-blur-lg p-6 rounded-xl border border-slate-700/50 max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-3">
              {t('joinThousandsTitle')}
            </h3>
            <p className="text-sm text-slate-300 mb-5 max-w-xl mx-auto">
              {t('joinThousandsDescription')}
            </p>
            <Link to="/register">
              <Button 
                size="md" 
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0 px-6 py-2 shadow-xl hover:shadow-orange-500/25 transition-all duration-300"
              >
                {t('startYourJourney')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RealTimeAnalyticsSection;
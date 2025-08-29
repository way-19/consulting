import React from 'react';
import { Users, Globe, Zap, Shield, Award, Target, Calendar, Building, Bot, TrendingUp } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { useLanguage } from '@consulting19/shared';

const AboutPage = () => {
  const { t } = useLanguage();

  const values = [
    {
      icon: Globe,
      title: 'globalExpertise',
      description: 'globalExpertiseDesc',
    },
    {
      icon: Zap,
      title: 'aiEfficiency',
      description: 'aiEfficiencyDesc',
    },
    {
      icon: Shield,
      title: 'trustSecurity',
      description: 'trustSecurityDesc',
    },
    {
      icon: Target,
      title: 'resultsDriven',
      description: 'resultsDrivenDesc',
    },
  ];

  const timeline = [
    {
      year: '2016',
      title: 'founded2016',
      description: 'founded2016Desc',
      icon: Building,
    },
    {
      year: '2019',
      title: 'founded2019',
      description: 'founded2019Desc',
      icon: Globe,
    },
    {
      year: '2022',
      title: 'founded2022',
      description: 'founded2022Desc',
      icon: Bot,
    },
    {
      year: '2025',
      title: 'founded2025',
      description: 'founded2025Desc',
      icon: TrendingUp,
    },
  ];

  const impactMetrics = [
    {
      value: '19+',
      label: 'countriesSupported',
    },
    {
      value: '4500+',
      label: 'companiesFormed',
    },
    {
      value: '98%',
      label: 'successRate',
    },
    {
      value: '14',
      label: 'avgSetupTime',
    },
  ];

  const flagshipPlatforms = [
    {
      badge: 'matrixBadge',
      title: 'matrixTitle',
      description: 'matrixDescription',
      features: ['matrixFeature1', 'matrixFeature2', 'matrixFeature3'],
      cta: 'matrixCTA',
      href: 'https://wealth.consulting19.com',
      note: 'matrixNote',
      gradient: 'from-purple-700/90 via-purple-600/85 to-fuchsia-600/80',
      image: 'https://images.pexels.com/photos/8293687/pexels-photo-8293687.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    {
      badge: 'fidelkeyBadge',
      title: 'fidelkeyTitle',
      description: 'fidelkeyDescription',
      features: ['fidelkeyFeature1', 'fidelkeyFeature2', 'fidelkeyFeature3'],
      cta: 'fidelkeyCTA',
      href: 'https://fidelkey.com',
      note: null,
      gradient: 'from-blue-700/90 via-indigo-600/85 to-purple-600/80',
      image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t('aboutHeroTitle')}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            {t('aboutHeroDescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100"
              aria-label="Start your international expansion"
            >
              {t('startYourExpansion')}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-blue-600"
              aria-label="Explore available countries"
            >
              {t('exploreCountries')}
            </Button>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('missionTitle')}</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            {t('missionDescription')}
          </p>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('valuesTitle')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('valuesDescription')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} hover className="text-center h-full">
                <Card.Body>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {t(value.title)}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t(value.description)}
                  </p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Founded in 2016 Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('foundedTitle')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {timeline.map((milestone, index) => (
              <div key={index} className="relative">
                {/* Connection Line */}
                {index < timeline.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-400 to-teal-400 z-0"></div>
                )}
                
                <Card hover className="text-center h-full relative z-10">
                  <Card.Body>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <milestone.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-blue-600 mb-2">{milestone.year}</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {t(milestone.title)}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {t(milestone.description)}
                    </p>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flagship Platforms */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('flagshipPlatformsTitle')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('flagshipPlatformsDescription')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {flagshipPlatforms.map((platform, index) => (
              <div key={index} className="relative overflow-hidden rounded-2xl shadow-xl">
                {/* Background */}
                <div className="absolute inset-0">
                  <img
                    src={platform.image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-r ${platform.gradient}`} />
                </div>

                {/* Content */}
                <div className="relative p-8 text-white">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 ring-1 ring-white/25 text-sm font-semibold mb-4">
                    <span>🔷 {t(platform.badge)}</span>
                  </div>

                  <h3 className="text-2xl font-bold leading-tight mb-4">
                    {t(platform.title)}
                  </h3>
                  <p className="text-white/90 mb-6">
                    {t(platform.description)}
                  </p>

                  {/* Features */}
                  <div className="grid grid-cols-1 gap-3 mb-6">
                    {platform.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-white rounded-full" />
                        <span className="text-sm">{t(feature)}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="space-y-4">
                    <a
                      href={platform.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex"
                    >
                      <Button 
                        size="lg" 
                        className="bg-amber-400 text-black hover:bg-amber-300"
                        aria-label={`${t(platform.cta)} - opens in new tab`}
                      >
                        {t(platform.cta)}
                      </Button>
                    </a>
                    {platform.note && (
                      <p className="text-xs text-white/70">
                        {t(platform.note)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('storyTitle')}</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t('storyDescription')}
            </p>
          </div>
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('impactMetricsTitle')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactMetrics.map((metric, index) => (
              <Card key={index} className="text-center">
                <Card.Body>
                  <div className="text-3xl font-bold text-blue-600 mb-2">{metric.value}</div>
                  <p className="text-gray-600 font-medium">{t(metric.label)}</p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            {t('finalCtaTitle')}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {t('finalCtaDescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100"
              aria-label="Start your international expansion journey"
            >
              {t('startYourExpansion')}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-blue-600"
              aria-label="Learn about becoming a consultant"
            >
              {t('becomeConsultant')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
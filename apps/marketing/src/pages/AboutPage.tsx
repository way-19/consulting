import React from 'react';
import { Users, Globe, Zap, Shield, Award, Target, ArrowRight, Building2, TrendingUp, CheckCircle, Calendar } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { useLanguage } from '@consulting19/shared';

const AboutPage = () => {
  const { t } = useLanguage();

  const values = [
    {
      icon: Globe,
      title: t('globalExpertise'),
      description: t('globalExpertiseDesc'),
    },
    {
      icon: Zap,
      title: t('aiPoweredEfficiency'),
      description: t('aiPoweredEfficiencyDesc'),
    },
    {
      icon: Shield,
      title: t('trustSecurity'),
      description: t('trustSecurityDesc'),
    },
    {
      icon: Target,
      title: t('resultsDriven'),
      description: t('resultsDrivenDesc'),
    },
  ];

  const timeline = [
    {
      year: '2016',
      title: t('founded'),
      description: t('foundedDesc'),
      icon: Building2,
    },
    {
      year: '2019',
      title: t('tenPlusCountries'),
      description: t('tenPlusCountriesDesc'),
      icon: Globe,
    },
    {
      year: '2022',
      title: t('aiAssistant'),
      description: t('aiAssistantDesc'),
      icon: Zap,
    },
    {
      year: '2025',
      title: t('flagshipPlatforms'),
      description: t('flagshipPlatformsDesc'),
      icon: Award,
    },
  ];

  const metrics = [
    { value: '19+', label: t('countriesSupported') },
    { value: '4500+', label: t('companiesFormed') },
    { value: '98%', label: t('successRate') },
    { value: '14 days', label: t('averageSetup') },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t('aboutConsulting19')}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            {t('aboutHeroDescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" aria-label="Start your international expansion journey">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                {t('startYourExpansion')}
              </Button>
            </a>
            <a href="/countries" aria-label="Explore available countries for business expansion">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                {t('exploreCountries')}
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('ourMission')}</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t('ourMissionDescription')}
            </p>
          </div>
          <div className="relative">
            <img 
              src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600" 
              alt=""
              className="rounded-xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('ourValues')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('ourValuesDescription')}
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
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Founded in 2016 Timeline */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('foundedIn2016')}</h2>
            <p className="text-xl text-gray-600">{t('foundedDescription')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {timeline.map((milestone, index) => (
              <Card key={index} className="text-center">
                <Card.Body>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <milestone.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mb-2">{milestone.year}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{milestone.description}</p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Flagship Platforms */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('flagshipPlatformsTitle')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('flagshipPlatformsSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Matrix Card */}
            <div className="relative overflow-hidden rounded-2xl shadow-xl">
              <div className="absolute inset-0">
                <img
                  src="https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-700/90 via-purple-600/85 to-fuchsia-600/80" />
              </div>

              <div className="relative p-8 text-white">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 ring-1 ring-white/25 text-sm font-semibold mb-4">
                  <span>💎 Premium</span>
                </div>

                <h3 className="text-2xl font-bold leading-tight mb-4">
                  {t('matrixPlatform')}
                </h3>
                <p className="text-white/90 mb-6">
                  {t('matrixDescription')}
                </p>

                <div className="grid grid-cols-1 gap-3 mb-6">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-white" />
                    <span className="text-sm">AI-driven analysis</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-white" />
                    <span className="text-sm">Global opportunities</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-white" />
                    <span className="text-sm">Strict confidentiality</span>
                  </div>
                </div>

                <a
                  href="https://wealth.consulting19.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Explore Matrix Wealth platform for ultra-high-net-worth clients"
                >
                  <Button size="lg" className="bg-amber-400 text-black hover:bg-amber-300 w-full">
                    Explore Matrix Wealth
                  </Button>
                </a>
                
                <p className="text-xs text-white/70 mt-3 text-center">
                  For qualified investors only.
                </p>
              </div>
            </div>

            {/* FidelKey Card */}
            <div className="relative overflow-hidden rounded-2xl shadow-xl">
              <div className="absolute inset-0">
                <img
                  src="https://images.pexels.com/photos/8293687/pexels-photo-8293687.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-700/90 via-purple-700/85 to-rose-600/80" />
              </div>

              <div className="relative p-8 text-white">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 ring-1 ring-white/25 text-sm font-semibold mb-4">
                  <span>🚀 Innovation</span>
                </div>

                <h3 className="text-2xl font-bold leading-tight mb-4">
                  {t('fidelkeyPlatform')}
                </h3>
                <p className="text-white/90 mb-6">
                  {t('fidelkeyDescription')}
                </p>

                <div className="grid grid-cols-1 gap-3 mb-6">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-white" />
                    <span className="text-sm">Secured title structure</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-white" />
                    <span className="text-sm">Residency options</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-white" />
                    <span className="text-sm">Rental/dividend yield potential</span>
                  </div>
                </div>

                <a
                  href="https://fidelkey.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Explore FidelKey secured title investment system"
                >
                  <Button size="lg" className="bg-amber-400 text-black hover:bg-amber-300 w-full">
                    Explore FidelKey
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('ourStory')}</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t('ourStoryDescription')}
            </p>
          </div>
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{metric.value}</div>
                <div className="text-gray-600 font-medium">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {t('readyToJoin')}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {t('readyToJoinDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" aria-label="Start your international expansion with Consulting19">
              <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700" icon={ArrowRight} iconPosition="right">
                {t('startYourExpansion')}
              </Button>
            </a>
            <a href="/partners" aria-label="Become a consultant partner with Consulting19">
              <Button size="lg" variant="outline" icon={Users} iconPosition="left">
                {t('becomeConsultant')}
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
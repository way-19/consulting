import React from 'react';
import { Users, Globe, Zap, Shield, Award, Target, ArrowRight, Building2, TrendingUp, CheckCircle, Calendar } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { useLanguage } from '@consulting19/shared';

const AboutPage = () => {
  const { t } = useLanguage();

  const values = [
    {
      icon: Globe,
      title: t('aboutPage.value1Title'),
      description: t('aboutPage.value1Description'),
    },
    {
      icon: Zap,
      title: t('aboutPage.value2Title'),
      description: t('aboutPage.value2Description'),
    },
    {
      icon: Shield,
      title: t('aboutPage.value3Title'),
      description: t('aboutPage.value3Description'),
    },
    {
      icon: Target,
      title: t('aboutPage.value4Title'),
      description: t('aboutPage.value4Description'),
    },
  ];

  const timeline = [
    {
      year: '2016',
      title: t('aboutPage.timeline1Title'),
      description: t('aboutPage.timeline1Description'),
      icon: Building2,
    },
    {
      year: '2019',
      title: t('aboutPage.timeline2Title'),
      description: t('aboutPage.timeline2Description'),
      icon: Globe,
    },
    {
      year: '2022',
      title: t('aboutPage.timeline3Title'),
      description: t('aboutPage.timeline3Description'),
      icon: Zap,
    },
    {
      year: '2025',
      title: t('aboutPage.timeline4Title'),
      description: t('aboutPage.timeline4Description'),
      icon: Award,
    },
  ];

  const metrics = [
    { value: '19+', label: t('aboutPage.metric1Label') },
    { value: '4500+', label: t('aboutPage.metric2Label') },
    { value: '98%', label: t('aboutPage.metric3Label') },
    { value: '14 days', label: t('aboutPage.metric4Label') },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t('aboutPage.heroTitle')}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            {t('aboutPage.heroDescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" aria-label={t('aboutPage.heroCta1')}>
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                {t('aboutPage.heroCta1')}
              </Button>
            </a>
            <a href="/countries" aria-label={t('aboutPage.heroCta2')}>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                {t('aboutPage.heroCta2')}
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('aboutPage.missionTitle')}</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t('aboutPage.missionDescription')}
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('aboutPage.valuesTitle')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('aboutPage.valuesDescription')}
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Founded in 2016</h2>
            <p className="text-xl text-gray-600">Our journey of innovation and growth</p>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Flagship Platforms</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Specialized platforms for sophisticated wealth management and investment opportunities
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
                  Matrix — Private Wealth Platform
                </h3>
                <p className="text-white/90 mb-6">
                  A privacy-first platform for ultra-high-net-worth clients. AI-assisted global allocation, multi-jurisdiction banking, and discreet execution. Minimum investment: $5M.
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
                  FidelKey — Secured Title Investment System
                </h3>
                <p className="text-white/90 mb-6">
                  The world's first secured-title investment gateway combining real-estate ownership, financial returns, and international visa pathways under a collateralized title model.
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
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Consulting19 began in 2016 with a simple observation: cross-border expansion was harder than it needed to be. By pairing cutting-edge AI with a curated network of local experts, we deliver enterprise-level results—company formation, banking, tax optimization, and compliance—faster and more predictably than traditional models.
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
            {t('aboutPage.finalCtaTitle')}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {t('aboutPage.finalCtaDescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" aria-label={t('aboutPage.finalCta1')}>
              <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700" icon={ArrowRight} iconPosition="right">
                {t('aboutPage.finalCta1')}
              </Button>
            </a>
            <a href="/partners" aria-label={t('aboutPage.finalCta2')}>
              <Button size="lg" variant="outline" icon={Users} iconPosition="left">
                {t('aboutPage.finalCta2')}
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
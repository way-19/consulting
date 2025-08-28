import React from 'react';
import { Users, Globe, Zap, Shield, Award, Target } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { useLanguage } from '@consulting19/shared';

const AboutPage = () => {
  const teamMembers = [
    {
      name: 'Erdal KAYMAZ',
      role: 'aboutPage.teamMemberRoleErdal',
      bio: 'aboutPage.teamMemberBioErdal',
      linkedin: 'https://linkedin.com/in/erdal-kaymaz',
    },
  ];

  const values = [
    {
      icon: Globe,
      title: 'Global Expertise',
      description: 'aboutPage.valueGlobalExpertiseDesc',
    },
    {
      icon: Zap,
      title: 'AI-Powered Efficiency',
      description: 'aboutPage.valueAIEfficiencyDesc',
    },
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'aboutPage.valueTrustSecurityDesc',
    },
    {
      icon: Target,
      title: 'Results-Driven',
      description: 'aboutPage.valueResultsDrivenDesc',
    },
  ];

  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t('aboutPage.heroTitle')}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {t('aboutPage.heroDescription')}
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('aboutPage.missionTitle')}</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6"> {/* Use t() for mission descriptions */}
              {t('aboutPage.missionDesc1')}
            </p>
            <p className="text-lg text-gray-600 leading-relaxed"> {/* Use t() for mission descriptions */}
              {t('aboutPage.missionDesc2')}
            </p>
          </div>
          <div className="relative">
            <img 
              src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600" 
              alt="Global business"
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
            <p className="text-xl text-gray-600 max-w-3xl mx-auto"> {/* Use t() for values description */}
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
                  <h3 className="text-xl font-semibold text-gray-900 mb-3"> {/* Use t() for value titles */}
                    {t(value.title)}
                  </h3>
                  <p className="text-gray-600 leading-relaxed"> {/* Use t() for value descriptions */}
                    {t(value.description)}
                  </p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('aboutPage.teamTitle')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto"> {/* Use t() for team description */}
              {t('aboutPage.teamDescription')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} hover className="text-center">
                <Card.Body>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-4">
                    {t(member.role)}
                  </p>
                  <p className="text-gray-600 leading-relaxed"> {/* Use t() for member bio */}
                    {t(member.bio)}
                  </p>
                  {member.linkedin && (
                    <div className="mt-4">
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                        {t('aboutPage.linkedinProfile')}
                      </a>
                    </div>
                  )}
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('aboutPage.storyTitle')}</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6"> {/* Use t() for story descriptions */}
              {t('aboutPage.storyDesc1')}
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mb-6"> {/* Use t() for story descriptions */}
              {t('aboutPage.storyDesc2')}
            </p>
            <p className="text-lg text-gray-600 leading-relaxed"> {/* Use t() for story descriptions */}
              {t('aboutPage.storyDesc3')}
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {t('aboutPage.ctaTitle')}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {t('aboutPage.ctaDescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" icon={Users} iconPosition="left">
              {t('aboutPage.startExpansionBtn')}
            </Button>
            <Button size="lg" variant="outline" icon={Award} iconPosition="left">
              {t('aboutPage.becomeConsultantBtn')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
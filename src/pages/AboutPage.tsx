import React from 'react';
import { Users, Globe, Award, Shield } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const AboutPage: React.FC = () => {
  const { t } = useLanguage();

  const stats = [
    { icon: Users, value: '1,000+', label: 'Happy Clients' },
    { icon: Globe, value: '7', label: 'Countries' },
    { icon: Award, value: '98%', label: 'Success Rate' },
    { icon: Shield, value: '100%', label: 'Legal Compliance' }
  ];

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About CONSULTING19
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Your trusted partner for international business formation
          </p>
          <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
            CONSULTING19 is a leading international business consultancy specializing in company formation, 
            investment advisory, and legal compliance across 7 strategic jurisdictions.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-xl text-gray-700 leading-relaxed">
            To provide world-class business formation and advisory services with AI-enhanced guidance and legal oversight.
          </p>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
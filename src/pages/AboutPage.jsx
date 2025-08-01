import React from 'react';
import { Users, Globe, Award, Shield, Brain, Zap } from 'lucide-react';

const AboutPage = () => {
  const stats = [
    { icon: Users, value: '1,000+', label: 'Happy Clients' },
    { icon: Globe, value: '8', label: 'Countries' },
    { icon: Award, value: '98%', label: 'Success Rate' },
    { icon: Shield, value: '100%', label: 'Legal Compliance' }
  ];

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Intelligence',
      description: 'Advanced artificial intelligence analyzes global regulations and market opportunities in real-time.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast Setup',
      description: 'Streamlined processes and digital-first approach ensure rapid business formation and compliance.'
    },
    {
      icon: Shield,
      title: 'Legal Oversight',
      description: 'Every recommendation is reviewed by qualified legal experts to ensure full compliance.'
    },
    {
      icon: Globe,
      title: 'Global Network',
      description: 'Extensive network of local experts and partners across 8 strategic jurisdictions.'
    }
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
            Your trusted partner for international business formation and AI-enhanced consulting
          </p>
          <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
            CONSULTING19 is the world's first AI-enhanced territorial consultancy platform, specializing in company formation, 
            investment advisory, and legal compliance across 8 strategic jurisdictions. We combine cutting-edge artificial 
            intelligence with human expertise to deliver unparalleled business consulting services.
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

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">CONSULTING19</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We revolutionize international business consulting with AI-powered intelligence and expert human oversight
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-xl text-gray-700 leading-relaxed mb-8">
            To democratize access to global business opportunities through AI-enhanced intelligence, 
            expert guidance, and seamless digital experiences. We believe every entrepreneur deserves 
            world-class consulting services, regardless of their location or business size.
          </p>
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Your Global Journey?</h3>
            <p className="text-purple-100 mb-6">
              Join thousands of successful businesses who trust CONSULTING19 for their international expansion
            </p>
            <a
              href="/contact"
              className="inline-flex items-center bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-pink-600 transition-all duration-300"
            >
              Get Started Today
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
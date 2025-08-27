import React from 'react';
import { Users, Globe, Zap, Shield, Award, Target } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';

const AboutPage = () => {
  const teamMembers = [
    {
      name: 'Erdal KAYMAZ',
      role: 'SEO & Digital Marketing Specialist',
      bio: 'Expert in search engine optimization and digital marketing strategies for international business expansion.',
      linkedin: 'https://linkedin.com/in/erdal-kaymaz',
    },
  ];

  const values = [
    {
      icon: Globe,
      title: 'Global Expertise',
      description: 'Deep knowledge of international business landscapes across 19+ countries.',
    },
    {
      icon: Zap,
      title: 'AI-Powered Efficiency',
      description: 'Cutting-edge AI technology combined with human expertise for optimal results.',
    },
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'Enterprise-grade security protecting your sensitive business information.',
    },
    {
      icon: Target,
      title: 'Results-Driven',
      description: 'Focused on delivering measurable outcomes for your international expansion.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About Consulting19
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            We're revolutionizing international business consulting by combining 
            AI-powered intelligence with a global network of expert advisors.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              To democratize international business expansion by making expert advice 
              accessible, affordable, and instant through the power of artificial intelligence.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              We believe that every entrepreneur should have access to world-class 
              international business guidance, regardless of their location or business size.
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do at Consulting19.
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

      {/* Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experienced professionals from leading consulting firms and technology companies.
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
                    {member.role}
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    {member.bio}
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
                        LinkedIn Profile
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
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Consulting19 was born from a simple observation: international business expansion 
              is unnecessarily complex and expensive. Traditional consulting firms charge premium 
              rates while entrepreneurs struggle to navigate foreign regulations alone.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              By combining cutting-edge AI technology with a carefully curated network of expert 
              advisors in business-friendly jurisdictions, we've created a platform that delivers 
              enterprise-level consulting at a fraction of traditional costs.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Today, we're proud to serve hundreds of entrepreneurs worldwide, helping them save 
              millions in taxes while expanding their businesses across borders with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Join Our Mission?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Whether you're an entrepreneur looking to expand globally or an expert advisor 
            wanting to help others, we'd love to have you on board.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" icon={Users} iconPosition="left">
              Start Your Expansion
            </Button>
            <Button size="lg" variant="outline" icon={Award} iconPosition="left">
              Become a Consultant
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
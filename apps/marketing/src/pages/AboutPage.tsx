import React from 'react';
import { Users, Globe, Zap, Shield, Award, Target } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const AboutPage = () => {
  const teamMembers = [
    {
      name: 'Alexandra Chen',
      role: 'Founder & CEO',
      bio: 'Former international tax attorney with 15+ years helping Fortune 500 companies expand globally.',
      image: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=300',
    },
    {
      name: 'Marcus Rodriguez',
      role: 'CTO & AI Lead',
      bio: 'Ex-Google AI researcher specializing in natural language processing and business intelligence.',
      image: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=300',
    },
    {
      name: 'Sofia Patel',
      role: 'Head of Global Operations',
      bio: 'International business specialist with expertise in 20+ jurisdictions and regulatory compliance.',
      image: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=300',
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
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-4">
                    {member.role}
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    {member.bio}
                  </p>
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
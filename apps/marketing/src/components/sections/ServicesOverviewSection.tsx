import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Calculator, CreditCard, FileText, Shield, TrendingUp, Import as Passport, BarChart3 } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';

const ServicesOverviewSection = () => {
  const services = [
    {
      id: 'company-formation',
      icon: Building2,
      title: 'Company Formation',
      description: 'Complete assistance in company registration and incorporation in business-friendly jurisdictions worldwide.',
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
      color: 'blue',
    },
    {
      id: 'tax-optimization',
      icon: Calculator,
      title: 'Tax Optimization',
      description: 'Strategic tax planning and optimization to minimize your international tax burden legally.',
      image: 'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=800',
      color: 'teal',
    },
    {
      id: 'banking-solutions',
      icon: CreditCard,
      title: 'Banking Solutions',
      description: 'Help opening international bank accounts and establishing banking relationships globally.',
      image: 'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=800',
      color: 'orange',
    },
    {
      id: 'legal-compliance',
      icon: FileText,
      title: 'Legal Compliance',
      description: 'Ongoing legal and regulatory compliance support to keep your business compliant.',
      image: 'https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg?auto=compress&cs=tinysrgb&w=800',
      color: 'green',
    },
    {
      id: 'asset-protection',
      icon: Shield,
      title: 'Asset Protection',
      description: 'Strategies to protect your assets and minimize risks in international business operations.',
      image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800',
      color: 'purple',
    },
    {
      id: 'investment-advisory',
      icon: TrendingUp,
      title: 'Investment Advisory',
      description: 'Commercial investment consulting and growth strategies for international markets.',
      image: 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=800',
      color: 'red',
    },
    {
      id: 'visa-residency',
      icon: Passport,
      title: 'Visa & Residency',
      description: 'Complete visa and residency solutions for international business owners and investors.',
      image: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=800',
      color: 'indigo',
    },
    {
      id: 'market-research',
      icon: BarChart3,
      title: 'Market Research',
      description: 'In-depth market analysis and research for successful international business expansion.',
      image: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=800',
      color: 'pink',
    },
  ];

  const colorClasses = {
    blue: 'from-blue-600 to-blue-700',
    teal: 'from-teal-600 to-teal-700',
    orange: 'from-orange-600 to-orange-700',
    green: 'from-green-600 to-green-700',
    purple: 'from-purple-600 to-purple-700',
    red: 'from-red-600 to-red-700',
    indigo: 'from-indigo-600 to-indigo-700',
    pink: 'from-pink-600 to-pink-700',
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Comprehensive International Business Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From company formation to ongoing compliance, we provide end-to-end support for your global business expansion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {services.map((service, index) => (
            <div key={index} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
              {/* Background Image */}
              <div className="absolute inset-0">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              </div>
              
              {/* Content */}
              <div className="relative h-80 flex flex-col justify-end p-6 text-white">
                <div className={`w-12 h-12 bg-gradient-to-r ${colorClasses[service.color as keyof typeof colorClasses]} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-bold mb-3 group-hover:text-blue-300 transition-colors duration-300">
                  {service.title}
                </h3>
                
                <p className="text-gray-200 text-sm leading-relaxed mb-4 opacity-90">
                  {service.description}
                </p>
                
                {/* Button - appears on hover */}
                <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <Link to={`/services/${service.id}`}>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="w-full bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-gray-900 transition-all duration-300"
                    >
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/services">
            <Button size="lg" variant="primary" className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 border-0 px-8 py-3">
              View All Services
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesOverviewSection;
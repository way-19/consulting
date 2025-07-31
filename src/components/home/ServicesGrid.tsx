import React from 'react';
import { 
  Building2, 
  TrendingUp, 
  Scale, 
  Calculator,
  Plane,
  Search,
  CreditCard,
  Shield,
  ArrowRight,
  Sparkles,
  CheckCircle
} from 'lucide-react';

const ServicesGrid: React.FC = () => {
  const services = [
    {
      id: 1,
      icon: Building2,
      title: 'Company Formation',
      description: 'Quick entity setup worldwide with expert guidance and AI-powered recommendations.',
      features: ['LLC & Corporation setup', 'Registered agent service', 'EIN & tax ID', 'Compliance support'],
      gradient: 'from-blue-500 to-blue-600',
      hoverGradient: 'from-blue-600 to-blue-700',
      bgGradient: 'from-blue-50 to-blue-100',
      glowColor: 'blue-500/20'
    },
    {
      id: 2,
      icon: TrendingUp,
      title: 'Investment Advisory',
      description: 'Strategic market analysis and investment opportunities across global markets.',
      features: ['Market research', 'Risk assessment', 'Portfolio optimization', 'Due diligence'],
      gradient: 'from-green-500 to-green-600',
      hoverGradient: 'from-green-600 to-green-700',
      bgGradient: 'from-green-50 to-green-100',
      glowColor: 'green-500/20'
    },
    {
      id: 3,
      icon: Scale,
      title: 'Legal Consulting',
      description: 'Regulatory compliance and business law expertise for international operations.',
      features: ['Contract drafting', 'Compliance review', 'Legal structure', 'Dispute resolution'],
      gradient: 'from-purple-500 to-purple-600',
      hoverGradient: 'from-purple-600 to-purple-700',
      bgGradient: 'from-purple-50 to-purple-100',
      glowColor: 'purple-500/20'
    },
    {
      id: 4,
      icon: Calculator,
      title: 'Accounting Services',
      description: 'International tax optimization and comprehensive accounting solutions.',
      features: ['Tax planning', 'Bookkeeping', 'Financial reporting', 'Audit support'],
      gradient: 'from-orange-500 to-orange-600',
      hoverGradient: 'from-orange-600 to-orange-700',
      bgGradient: 'from-orange-50 to-orange-100',
      glowColor: 'orange-500/20'
    },
    {
      id: 5,
      icon: Plane,
      title: 'Visa & Residency',
      description: 'Global mobility solutions including residency and citizenship programs.',
      features: ['Visa applications', 'Residency programs', 'Citizenship planning', 'Immigration law'],
      gradient: 'from-teal-500 to-teal-600',
      hoverGradient: 'from-teal-600 to-teal-700',
      bgGradient: 'from-teal-50 to-teal-100',
      glowColor: 'teal-500/20'
    },
    {
      id: 6,
      icon: Search,
      title: 'Market Research',
      description: 'Industry insights and competitive analysis for informed business decisions.',
      features: ['Industry analysis', 'Competitor research', 'Market sizing', 'Trend analysis'],
      gradient: 'from-pink-500 to-pink-600',
      hoverGradient: 'from-pink-600 to-pink-700',
      bgGradient: 'from-pink-50 to-pink-100',
      glowColor: 'pink-500/20'
    },
    {
      id: 7,
      icon: CreditCard,
      title: 'Banking Solutions',
      description: 'International account opening and banking relationship management.',
      features: ['Account opening', 'Banking relationships', 'Payment processing', 'Credit facilities'],
      gradient: 'from-indigo-500 to-indigo-600',
      hoverGradient: 'from-indigo-600 to-indigo-700',
      bgGradient: 'from-indigo-50 to-indigo-100',
      glowColor: 'indigo-500/20'
    },
    {
      id: 8,
      icon: Shield,
      title: 'Ongoing Compliance',
      description: 'Continuous regulatory monitoring and compliance management services.',
      features: ['Regulatory updates', 'Filing management', 'Compliance calendar', 'Risk monitoring'],
      gradient: 'from-red-500 to-red-600',
      hoverGradient: 'from-red-600 to-red-700',
      bgGradient: 'from-red-50 to-red-100',
      glowColor: 'red-500/20'
    }
  ];

  return (
    <section className="section-padding bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20 fade-in">
          <div className="inline-flex items-center bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full px-6 py-3 mb-8">
            <Sparkles className="h-5 w-5 text-blue-600 mr-3" />
            <span className="text-blue-700 font-semibold">Comprehensive Business Services</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
            Expert Services for 
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent block md:inline"> Global Success</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            From company formation to ongoing compliance, our AI-enhanced platform 
            connects you with expert consultants for every aspect of international business.
          </p>

          {/* Decorative Line */}
          <div className="w-32 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 mx-auto rounded-full"></div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="group relative bg-gradient-to-br from-white via-white to-gray-50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-3 hover:scale-105 scale-in backdrop-blur-sm"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Hover Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r from-${service.glowColor} to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              {/* Icon Container */}
              <div className={`relative w-20 h-20 bg-gradient-to-r ${service.gradient} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                <service.icon className="h-10 w-10 text-white" />
                
                {/* Icon Glow */}
                <div className={`absolute inset-0 bg-gradient-to-r ${service.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300`}></div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-8 leading-relaxed text-base">
                  {service.description}
                </p>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-gray-700">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button className={`w-full bg-gradient-to-r ${service.gradient} hover:${service.hoverGradient} text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group-hover:animate-pulse flex items-center justify-center group/btn`}>
                  <span>Get Started</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </button>
              </div>

              {/* Corner Decoration */}
              <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-white/50 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
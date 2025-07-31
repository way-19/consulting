import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  Globe, 
  Clock,
  Award,
  Zap,
  Shield,
  Target
} from 'lucide-react';

const GlobalStats: React.FC = () => {
  const [stats, setStats] = useState({
    activeConsultations: 0,
    countriesServed: 0,
    successRate: 0,
    avgResponseTime: 0
  });

  const targetStats = {
    activeConsultations: 1247,
    countriesServed: 8,
    successRate: 98,
    avgResponseTime: 47
  };

  useEffect(() => {
    const animateStats = () => {
      const duration = 2500;
      const steps = 60;
      const stepDuration = duration / steps;

      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);

        setStats({
          activeConsultations: Math.floor(targetStats.activeConsultations * easeOutQuart),
          countriesServed: Math.floor(targetStats.countriesServed * easeOutQuart),
          successRate: Math.floor(targetStats.successRate * easeOutQuart),
          avgResponseTime: Math.floor(targetStats.avgResponseTime * easeOutQuart)
        });

        if (currentStep >= steps) {
          clearInterval(interval);
          setStats(targetStats);
        }
      }, stepDuration);

      return () => clearInterval(interval);
    };

    const timer = setTimeout(animateStats, 500);
    return () => clearTimeout(timer);
  }, []);

  const statItems = [
    {
      icon: TrendingUp,
      value: `${stats.activeConsultations.toLocaleString()}+`,
      label: 'Active Consultations',
      description: 'Ongoing client engagements worldwide',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      icon: Globe,
      value: stats.countriesServed,
      label: 'Strategic Jurisdictions',
      description: 'Countries with expert consultants',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      icon: Award,
      value: `${stats.successRate}%`,
      label: 'Success Rate',
      description: 'Successful business formations',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      icon: Clock,
      value: `${stats.avgResponseTime}min`,
      label: 'Avg Response Time',
      description: 'AI-powered instant support',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    }
  ];

  const features = [
    {
      icon: Zap,
      title: 'AI-Powered Matching',
      description: 'Intelligent consultant-client pairing based on expertise and requirements'
    },
    {
      icon: Shield,
      title: 'Legal Compliance',
      description: 'All recommendations reviewed by legal experts for full compliance'
    },
    {
      icon: Target,
      title: 'Success Optimization',
      description: 'Continuous optimization based on successful case patterns'
    }
  ];

  return (
    <section className="section-padding bg-gradient-to-br from-dark-950 via-dark-900 to-primary-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 network-bg opacity-20"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container relative z-10">
        <div className="text-center mb-16 fade-in">
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <TrendingUp className="h-4 w-4 text-accent-400 mr-2" />
            <span className="text-white/90 text-sm font-medium">Global Intelligence Network</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Real-Time Platform 
            <span className="text-gradient"> Analytics</span>
          </h2>
          
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Live insights from our worldwide network of expert consultants and 
            AI-powered analytics driving successful business formations.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {statItems.map((item, index) => (
            <div
              key={item.label}
              className="stat-card group scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 ${item.bgColor} rounded-2xl mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 pulse-glow`}>
                <item.icon className={`h-8 w-8 ${item.iconColor}`} />
              </div>
              
              <div className="stat-number" style={{ animationDelay: `${index * 0.1}s` }}>
                {item.value}
              </div>
              
              <div className="text-white/90 font-semibold mb-2 group-hover:text-white transition-colors duration-300">
                {item.label}
              </div>
              
              <div className="text-white/60 text-sm group-hover:text-white/80 transition-colors duration-300">
                {item.description}
              </div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 fade-in">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="text-center group hover-lift"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="h-7 w-7 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-accent-400 transition-colors duration-300">
                {feature.title}
              </h3>
              
              <p className="text-white/70 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 fade-in">
          <div className="glass-effect rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Join Thousands of Successful Businesses
            </h3>
            
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              Experience the power of AI-enhanced consulting with expert guidance 
              across 8 strategic jurisdictions worldwide.
            </p>
            
            <button className="bg-gradient-to-r from-accent-500 to-accent-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-accent-600 hover:to-accent-700 transition-all duration-300 shadow-xl hover:scale-105 hover:shadow-2xl">
              Start Your Journey
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalStats;
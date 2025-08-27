import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, DollarSign, Shield, Zap, Scale, Target, Globe } from 'lucide-react';
import { Button } from '@consulting19/ui';

const RealTimeAnalyticsSection = () => {
  const stats = [
    {
      icon: TrendingUp,
      value: '1,247+',
      label: 'Active Consultations',
      description: 'Ongoing client engagements worldwide',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-slate-800/50',
    },
    {
      icon: DollarSign,
      value: '8',
      label: 'Strategic Jurisdictions',
      description: 'Countries with expert consultants',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-slate-800/50',
    },
    {
      icon: Shield,
      value: '98%',
      label: 'Success Rate',
      description: 'Successful business formations',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-slate-800/50',
    },
    {
      icon: Zap,
      value: '47min',
      label: 'Avg Response Time',
      description: 'AI-powered instant support',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-slate-800/50',
    },
    {
      icon: Scale,
      value: 'AI-Powered Matching',
      label: '',
      description: 'Intelligent consultant-client pairing based on expertise and requirements',
      color: 'from-blue-500 to-orange-500',
      bgColor: 'bg-slate-800/50',
      isWide: true,
    },
    {
      icon: Target,
      value: 'Legal Compliance',
      label: '',
      description: 'All recommendations reviewed by legal experts for full compliance',
      color: 'from-slate-500 to-slate-600',
      bgColor: 'bg-slate-800/50',
      isWide: true,
    },
    {
      icon: Globe,
      value: 'Success Optimization',
      label: '',
      description: 'Continuous optimization based on successful case patterns',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-slate-800/50',
      isWide: true,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-40 h-40 border border-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 border border-teal-400 rounded-lg rotate-45 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 border border-purple-400 rounded-full animate-ping"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-blue-500/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
            <Globe className="w-5 h-5 text-blue-400 mr-2" />
            <span className="text-blue-300 font-medium">Global Intelligence Network</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Real-Time Platform <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">Analytics</span>
          </h2>
          <p className="text-lg text-slate-300 max-w-4xl mx-auto">
            Live insights from our worldwide network of expert consultants and AI-powered analytics driving successful business formations.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.slice(0, 4).map((stat, index) => (
            <div key={index} className="group relative">
              <div className={`${stat.bgColor} backdrop-blur-lg p-6 rounded-2xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:transform hover:scale-105`}>
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm font-medium text-slate-300 mb-2">{stat.label}</div>
                <div className="text-xs text-slate-400 leading-relaxed">{stat.description}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Wide Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {stats.slice(4).map((stat, index) => (
            <div key={index} className="group relative">
              <div className={`${stat.bgColor} backdrop-blur-lg p-6 rounded-2xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:transform hover:scale-105`}>
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-lg font-bold text-white mb-3">{stat.value}</div>
                <div className="text-sm text-slate-300 leading-relaxed">{stat.description}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="bg-slate-800/50 backdrop-blur-lg p-8 rounded-2xl border border-slate-700/50 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Join Thousands of Successful Businesses
            </h3>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Experience the power of AI-enhanced consulting with expert guidance across 8 strategic jurisdictions worldwide.
            </p>
            <Link to="/register">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0 px-8 py-3 shadow-xl hover:shadow-orange-500/25 transition-all duration-300"
              >
                Start Your Journey
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RealTimeAnalyticsSection;
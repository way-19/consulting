import React from 'react';
import { Search, Zap, Users, Globe } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      icon: Search,
      title: 'AI-Powered Business Analysis',
      description: 'Our advanced AI Oracle analyzes your business model, target markets, and growth objectives to create a personalized expansion roadmap tailored to your unique needs.',
      image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      icon: Zap,
      title: 'Instant Smart Recommendations',
      description: 'Within minutes, receive AI-generated recommendations for optimal jurisdictions, tax structures, and business strategies based on real-time data and regulatory intelligence.',
      image: 'https://images.pexels.com/photos/8439093/pexels-photo-8439093.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      icon: Users,
      title: 'Expert Human Connection',
      description: 'Get matched with certified specialists in your chosen countries who combine local expertise with our AI insights to deliver personalized, compliant solutions.',
      image: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      icon: Globe,
      title: 'Seamless Global Expansion',
      description: 'Launch your international operations with confidence, backed by continuous AI monitoring, compliance updates, and expert support throughout your growth journey.',
      image: 'https://images.pexels.com/photos/8439093/pexels-photo-8439093.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 border border-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 border border-teal-400 rounded-lg rotate-45 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-purple-400 rounded-full animate-ping"></div>
        <div className="absolute top-1/3 right-1/3 w-20 h-20 border border-cyan-400 rounded-lg animate-pulse"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-blue-500/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
            <Zap className="w-5 h-5 text-blue-400 mr-2 animate-pulse" />
            <span className="text-blue-300 font-medium">AI-Powered Process</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How Our AI Oracle Works
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Experience the future of international business consulting with our revolutionary AI-powered platform that combines artificial intelligence with human expertise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="group relative">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-blue-400 via-teal-400 to-transparent z-0 animate-pulse"></div>
              )}
              
              <div className="relative bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 text-center border border-white/20 group-hover:border-blue-400/50 group-hover:bg-white/15">
                {/* Background Image Overlay */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-20 group-hover:opacity-30 transition-opacity duration-500">
                  <img 
                    src={step.image} 
                    alt={step.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent"></div>
                </div>
                
                <div className="relative z-10">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-110">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg animate-bounce">
                      {index + 1}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-blue-100 leading-relaxed group-hover:text-white transition-colors duration-300">
                    {step.description}
                  </p>
                </div>

                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center bg-gradient-to-r from-blue-600 to-teal-600 rounded-full px-8 py-4 shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105">
            <Zap className="w-5 h-5 text-white mr-2 animate-pulse" />
            <span className="text-white font-semibold">Experience AI-Powered Consulting Today</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
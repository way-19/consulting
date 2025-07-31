import React from 'react';
import { 
  ArrowRight, 
  Globe, 
  Zap, 
  Shield, 
  TrendingUp,
  Sparkles,
  Network
} from 'lucide-react';

const HeroSection: React.FC = () => {
  const features = [
    { icon: Globe, text: "Global Network", color: "text-blue-400" },
    { icon: Zap, text: "AI-Powered", color: "text-yellow-400" },
    { icon: Shield, text: "Secure & Compliant", color: "text-green-400" },
    { icon: TrendingUp, text: "98% Success Rate", color: "text-purple-400" }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden animated-bg">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Mesh Background */}
        <div className="absolute inset-0 bg-mesh"></div>
        <div className="absolute inset-0 bg-dots opacity-30"></div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl floating"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl floating" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="relative z-10 container text-center">
        <div className="max-w-5xl mx-auto fade-in">
          {/* Badge */}
          <div className="inline-flex items-center glass-effect rounded-full px-6 py-3 mb-8 scale-in pulse-glow">
            <Sparkles className="h-4 w-4 text-accent-400 mr-2" />
            <span className="text-white/90 text-sm font-medium">
              World's First AI-Enhanced Territorial Consultancy Platform
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight slide-in-left text-shadow-glow">
            AI-Enhanced Global 
            <span className="text-gradient"> Intelligence Network </span>
            at Your Service
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/80 mb-12 leading-relaxed max-w-4xl mx-auto slide-in-right">
            Real-time regulatory updates and cross-border opportunities across 8 strategic jurisdictions
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 fade-in">
            {features.map((feature, index) => (
              <div
                key={feature.text}
                className="flex items-center glass-effect rounded-full px-4 py-2 text-white/90 hover-lift interactive-button"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <feature.icon className={`h-4 w-4 mr-2 ${feature.color}`} />
                <span className="text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 text-white/60 fade-in">
        <div className="flex flex-col items-center floating">
          <span className="text-sm mb-2">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/60 to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
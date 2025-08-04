import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Globe, 
  Zap, 
  Shield, 
  Building2, 
  TrendingUp, 
  Users,
  Star,
  CheckCircle,
  Sparkles,
  Brain,
  Scale,
  Calculator,
  Plane,
  CreditCard,
  Search,
  BarChart3,
  FileText,
  MessageSquare,
  Clock,
  Award
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSupabase } from '../contexts/SupabaseContext';

const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const { countries } = useSupabase();
  const [stats, setStats] = useState({
    activeConsultations: 1247,
    countriesServed: 7,
    successRate: 98,
    yearsExperience: 15
  });

  // Country images mapping
  const countryImages = {
    'georgia': 'https://images.pexels.com/photos/12461213/pexels-photo-12461213.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    'usa': 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    'montenegro': 'https://images.pexels.com/photos/15031396/pexels-photo-15031396.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    'estonia': 'https://images.pexels.com/photos/9816335/pexels-photo-9816335.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    'portugal': 'https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    'malta': 'https://images.pexels.com/photos/9816335/pexels-photo-9816335.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    'panama': 'https://images.pexels.com/photos/2034335/pexels-photo-2034335.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  };

  const services = [
    {
      icon: Building2,
      title: 'Company Formation',
      description: 'Quick entity setup worldwide with expert guidance and AI-powered recommendations.',
      features: ['LLC & Corporation setup', 'Registered agent service', 'EIN & tax ID', 'Compliance support'],
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      icon: TrendingUp,
      title: 'Investment Advisory',
      description: 'Strategic market analysis and investment opportunities across global markets.',
      features: ['Market research', 'Risk assessment', 'Portfolio optimization', 'Due diligence'],
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      icon: Scale,
      title: 'Legal Consulting',
      description: 'Regulatory compliance and business law expertise for international operations.',
      features: ['Contract drafting', 'Compliance review', 'Legal structure', 'Dispute resolution'],
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      icon: Calculator,
      title: 'Accounting Services',
      description: 'International tax optimization and comprehensive accounting solutions.',
      features: ['Tax planning', 'Bookkeeping', 'Financial reporting', 'Audit support'],
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    },
    {
      icon: Plane,
      title: 'Visa & Residency',
      description: 'Global mobility solutions including residency and citizenship programs.',
      features: ['Visa applications', 'Residency programs', 'Citizenship planning', 'Immigration law'],
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-700'
    },
    {
      icon: Search,
      title: 'Market Research',
      description: 'Comprehensive market analysis and business intelligence services.',
      features: ['Industry analysis', 'Competitor research', 'Market entry strategy', 'Consumer insights'],
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-700'
    },
    {
      icon: CreditCard,
      title: 'Banking Solutions',
      description: 'International account opening and banking relationship management.',
      features: ['Account opening', 'Banking relationships', 'Payment processing', 'Credit facilities'],
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700'
    },
    {
      icon: FileText,
      title: 'Ongoing Compliance',
      description: 'Continuous regulatory monitoring and compliance management services.',
      features: ['Regulatory updates', 'Filing management', 'Compliance calendar', 'Risk monitoring'],
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700'
    }
  ];

  const platformFeatures = [
    {
      icon: Brain,
      title: 'AI-Powered Matching',
      description: 'Intelligent consultant assignment based on expertise and client needs'
    },
    {
      icon: Shield,
      title: 'Legal Compliance',
      description: 'All recommendations reviewed by legal experts for compliance'
    },
    {
      icon: BarChart3,
      title: 'Success Analytics',
      description: 'Data-driven insights to optimize your business formation strategy'
    },
    {
      icon: MessageSquare,
      title: 'Real-Time Communication',
      description: 'Direct messaging with consultants and instant status updates'
    },
    {
      icon: Clock,
      title: 'Business Optimization',
      description: 'Ongoing support and optimization for your international business'
    },
    {
      icon: Award,
      title: 'Success Optimization',
      description: 'Proven strategies and best practices from thousands of successful cases'
    }
  ];

  const blogPosts = [
    {
      title: 'New Company Formation Guide 2024',
      excerpt: 'Complete guide to forming companies in strategic jurisdictions with updated regulations.',
      author: 'Sarah Johnson',
      country: 'Estonia',
      flag: '🇪🇪',
      date: 'March 15, 2024',
      category: 'Company Formation'
    },
    {
      title: 'AI Investment Opportunities Guide 2024',
      excerpt: 'Discover emerging markets and investment opportunities with AI-powered analysis.',
      author: 'Michael Chen',
      country: 'USA',
      flag: '🇺🇸',
      date: 'March 12, 2024',
      category: 'Investment'
    },
    {
      title: 'Cyprus Visa Requirements for 2024',
      excerpt: 'Updated visa requirements and application processes for Cyprus residency programs.',
      author: 'Elena Rodriguez',
      country: 'Portugal',
      flag: '🇵🇹',
      date: 'March 10, 2024',
      category: 'Visa & Immigration'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-16 min-h-screen flex items-center animated-bg relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl floating"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl floating" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl floating" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight text-shadow-lg">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed text-shadow">
              {t('hero.subtitle')}
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-4 mb-8 slide-in-left">
              <div className="flex items-center glass-effect rounded-full px-6 py-3 text-white/90">
                <Globe className="h-5 w-5 mr-2" />
                <span className="font-medium">7 Strategic Jurisdictions</span>
              </div>
              <div className="flex items-center glass-effect rounded-full px-6 py-3 text-white/90">
                <Zap className="h-5 w-5 mr-2" />
                <span className="font-medium">AI-Powered Guidance</span>
              </div>
              <div className="flex items-center glass-effect rounded-full px-6 py-3 text-white/90">
                <Shield className="h-5 w-5 mr-2" />
                <span className="font-medium">Legal Oversight</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center scale-in">
              <Link
                to="/login"
                className="btn-primary inline-flex items-center"
              >
                {t('hero.cta')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/about"
                className="btn-secondary inline-flex items-center"
              >
                Learn More
                <Sparkles className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Countries Section */}
      <section className="section-padding bg-gray-50">
        <div className="container">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              AI-Powered Country <span className="text-gradient">Recommendations</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the perfect jurisdiction for your business with intelligent guidance from our expert consultants and AI-powered analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {countries.slice(0, 8).map((country, index) => (
              <Link
                key={country.slug}
                to={`/${country.slug}`}
                className="card-country group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-48 overflow-hidden rounded-t-2xl">
                  <img
                    src={countryImages[country.slug as keyof typeof countryImages] || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'}
                    alt={country.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  <div className="absolute top-4 left-4">
                    <span className="text-3xl drop-shadow-lg">{country.flag_emoji}</span>
                  </div>
                  
                  <div className="absolute top-4 right-4">
                    <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Available
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1 text-shadow">{country.name}</h3>
                    <p className="text-white/90 text-sm text-shadow">
                      {country.advantages?.[0] || 'Strategic business location'}
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-white rounded-b-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium text-gray-700">Perfect Match</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-primary-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* AI Recommendation Banner */}
          <div className="glass-card p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center mr-4">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Get AI-Powered Perfect Jurisdiction</h3>
            </div>
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              Our intelligent system analyzes your business needs, tax requirements, and growth plans to recommend the optimal jurisdiction for your success.
            </p>
            <Link
              to="/login"
              className="btn-primary inline-flex items-center"
            >
              Get AI Recommendation
              <Sparkles className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Expert Services for <span className="text-gradient">Global Success</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive business solutions powered by AI intelligence and delivered by our expert consultants for every aspect of international business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="card group hover-lift"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="p-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {service.description}
                  </p>

                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/services"
                    className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${service.color} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 group-hover:scale-105`}
                  >
                    Learn More
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Analytics Section */}
      <section className="section-padding bg-gray-900 text-white network-bg">
        <div className="container">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Real-Time Platform <span className="text-gradient">Analytics</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Live insights from our AI-enhanced global consultancy platform and AI-powered business intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="stat-card">
              <div className="stat-number">{stats.activeConsultations.toLocaleString()}</div>
              <div className="text-white/80 font-medium">Active Consultations</div>
              <div className="text-white/60 text-sm mt-1">Across all jurisdictions</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-number">{stats.countriesServed}</div>
              <div className="text-white/80 font-medium">Strategic Jurisdictions</div>
              <div className="text-white/60 text-sm mt-1">Optimized locations</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-number">{stats.successRate}%</div>
              <div className="text-white/80 font-medium">Success Rate</div>
              <div className="text-white/60 text-sm mt-1">Client satisfaction</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-number">{stats.yearsExperience}</div>
              <div className="text-white/80 font-medium">Years Experience</div>
              <div className="text-white/60 text-sm mt-1">Industry expertise</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platformFeatures.map((feature, index) => (
              <div
                key={index}
                className="glass-card p-6 hover-lift"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-white/70 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="container text-center">
          <div className="max-w-3xl mx-auto fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Join Thousands of Successful Businesses
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Start your global expansion journey today with AI-enhanced guidance and expert consultants across 7 strategic jurisdictions.
            </p>
            <Link
              to="/login"
              className="btn-secondary inline-flex items-center text-lg px-8 py-4"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-6 w-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Expert Insights from Our <span className="text-gradient">Global Consultants</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay updated with the latest regulatory changes, market opportunities, and expert analysis from our consultants across 8 strategic jurisdictions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {blogPosts.map((post, index) => (
              <article
                key={index}
                className="card group hover-lift"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">{post.flag}</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{post.author}</div>
                      <div className="text-xs text-gray-500">Consultant • {post.country}</div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>{post.date}</span>
                    <span>5 min read</span>
                  </div>

                  <Link
                    to="/blog"
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm"
                  >
                    Read Article
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="btn-primary inline-flex items-center"
            >
              View All Articles
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* AI Assistant Preview Section */}
      <section className="section-padding bg-gradient-to-br from-gray-50 to-primary-50">
        <div className="container">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Experience the Future of <span className="text-gradient">Business Consulting</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform provides instant guidance while connecting you with expert human consultants for personalized support.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-primary-600 to-accent-600 p-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Intelligent Business Guidance</h3>
                    <p className="text-white/80 text-sm">AI-powered recommendations with human expertise</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <MessageSquare className="h-4 w-4 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-2xl p-4">
                        <p className="text-gray-800">
                          "I want to start a tech company that can operate globally but minimize tax obligations. What's the best jurisdiction?"
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center mr-3 mt-1">
                      <Brain className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-4 border border-primary-200">
                        <p className="text-gray-800 mb-3">
                          Based on your requirements, I recommend <strong>Estonia</strong> for your tech company. Here's why:
                        </p>
                        <ul className="space-y-1 text-sm text-gray-700">
                          <li>• e-Residency program for digital operations</li>
                          <li>• 0% tax on retained earnings</li>
                          <li>• EU market access</li>
                          <li>• Advanced digital infrastructure</li>
                        </ul>
                        <div className="mt-4 p-3 bg-white rounded-lg border border-primary-200">
                          <p className="text-sm text-primary-700 font-medium">
                            💡 <strong>AI Insight:</strong> 94% of similar tech companies chose Estonia and reported 40% faster market entry.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <Link
                    to="/login"
                    className="btn-primary inline-flex items-center"
                  >
                    Try AI Assistant Now
                    <Sparkles className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
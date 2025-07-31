import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles,
  MapPin,
  Mail,
  Phone,
  Globe,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  ArrowRight,
  Shield,
  Award,
  Clock
} from 'lucide-react';

const Footer: React.FC = () => {
  const countries = [
    { name: 'Georgia', slug: 'georgia', flag: '🇬🇪' },
    { name: 'USA', slug: 'usa', flag: '🇺🇸' },
    { name: 'Montenegro', slug: 'montenegro', flag: '🇲🇪' },
    { name: 'Estonia', slug: 'estonia', flag: '🇪🇪' },
    { name: 'Portugal', slug: 'portugal', flag: '🇵🇹' },
    { name: 'Malta', slug: 'malta', flag: '🇲🇹' },
    { name: 'Panama', slug: 'panama', flag: '🇵🇦' },
    { name: 'UAE', slug: 'uae', flag: '🇦🇪' }
  ];

  const services = [
    'Company Formation',
    'Investment Advisory',
    'Legal Consulting',
    'Accounting Services',
    'Visa & Residency',
    'Banking Solutions'
  ];

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Success Stories', href: '/success-stories' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
    { name: 'FAQ', href: '/faq' }
  ];

  return (
    <footer className="bg-gradient-to-br from-dark-950 via-dark-900 to-primary-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 network-bg opacity-10"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <Link to="/" className="flex items-center mb-6 group">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center mr-3">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white group-hover:text-gradient transition-all duration-300">
                  CONSULTING19
                </div>
              </Link>
              
              <p className="text-white/70 mb-6 leading-relaxed">
                World's first AI-enhanced territorial consultancy platform. Expert guidance 
                across 8 strategic jurisdictions with intelligent oversight.
              </p>

              {/* Trust Indicators */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-white/80">
                  <Shield className="h-4 w-4 text-green-400 mr-2" />
                  <span className="text-sm">Legal Compliance Guaranteed</span>
                </div>
                <div className="flex items-center text-white/80">
                  <Award className="h-4 w-4 text-yellow-400 mr-2" />
                  <span className="text-sm">98% Success Rate</span>
                </div>
                <div className="flex items-center text-white/80">
                  <Clock className="h-4 w-4 text-blue-400 mr-2" />
                  <span className="text-sm">47min Avg Response Time</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {[
                  { icon: Linkedin, href: '#', color: 'hover:text-blue-400' },
                  { icon: Twitter, href: '#', color: 'hover:text-sky-400' },
                  { icon: Facebook, href: '#', color: 'hover:text-blue-500' },
                  { icon: Instagram, href: '#', color: 'hover:text-pink-400' }
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className={`w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white/70 ${social.color} transition-all duration-300 hover:bg-white/20 hover:scale-110`}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Countries */}
            <div>
              <h3 className="text-white font-bold text-lg mb-6 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-primary-400" />
                Countries
              </h3>
              <div className="space-y-3">
                {countries.map((country) => (
                  <Link
                    key={country.slug}
                    to={`/${country.slug}`}
                    className="flex items-center text-white/70 hover:text-white transition-colors duration-300 group"
                  >
                    <span className="text-lg mr-3 group-hover:scale-110 transition-transform duration-300">
                      {country.flag}
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {country.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-white font-bold text-lg mb-6">Services</h3>
              <div className="space-y-3">
                {services.map((service) => (
                  <Link
                    key={service}
                    to="/services"
                    className="block text-white/70 hover:text-white transition-colors duration-300 hover:translate-x-1 transform"
                  >
                    {service}
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Links & Contact */}
            <div>
              <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
              <div className="space-y-3 mb-8">
                {quickLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="block text-white/70 hover:text-white transition-colors duration-300 hover:translate-x-1 transform"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center text-white/70">
                  <Mail className="h-4 w-4 mr-3 text-primary-400" />
                  <span className="text-sm">info@consulting19.com</span>
                </div>
                <div className="flex items-center text-white/70">
                  <Phone className="h-4 w-4 mr-3 text-primary-400" />
                  <span className="text-sm">+1 (555) CONSULT</span>
                </div>
                <div className="flex items-center text-white/70">
                  <Globe className="h-4 w-4 mr-3 text-primary-400" />
                  <span className="text-sm">24/7 Global Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-white/10">
          <div className="container py-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0">
                <h3 className="text-white font-bold text-xl mb-2">
                  Stay Updated with Global Opportunities
                </h3>
                <p className="text-white/70">
                  Get regulatory updates, market insights, and exclusive opportunities.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent backdrop-blur-sm"
                />
                <button className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 flex items-center group">
                  Subscribe
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="container py-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-white/60 text-sm mb-4 md:mb-0">
                © 2024 CONSULTING19. All rights reserved. | 
                <Link to="/privacy" className="hover:text-white ml-1">Privacy Policy</Link> | 
                <Link to="/terms" className="hover:text-white ml-1">Terms of Service</Link>
              </div>
              
              <div className="flex items-center text-white/60 text-sm">
                <span>Powered by AI Intelligence</span>
                <div className="w-2 h-2 bg-green-400 rounded-full ml-2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
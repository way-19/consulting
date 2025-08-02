import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

const Footer = () => {
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
    'Market Research',
    'Banking Solutions',
    'Ongoing Compliance'
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold">C19</span>
              </div>
              <div className="text-2xl font-bold text-white">CONSULTING19</div>
            </Link>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              World's first AI-enhanced territorial consultancy platform. Expert guidance across 8 strategic jurisdictions with intelligent oversight.
            </p>

            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <Mail className="h-4 w-4 mr-3 text-purple-400" />
                <span className="text-sm">info@consulting19.com</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone className="h-4 w-4 mr-3 text-purple-400" />
                <span className="text-sm">+1 (555) CONSULT</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Globe className="h-4 w-4 mr-3 text-purple-400" />
                <span className="text-sm">24/7 Global Support</span>
              </div>
            </div>
          </div>

          {/* Countries */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-purple-400" />
              Countries
            </h3>
            <div className="space-y-3">
              {countries.map((country) => (
                <Link
                  key={country.slug}
                  to={`/${country.slug}`}
                  className="flex items-center text-gray-300 hover:text-white transition-colors duration-300"
                >
                  <span className="text-lg mr-3">{country.flag}</span>
                  <span>{country.name}</span>
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
                  className="block text-gray-300 hover:text-white transition-colors duration-300"
                >
                  {service}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
            <div className="space-y-3">
              <Link to="/about" className="block text-gray-300 hover:text-white transition-colors duration-300">
                About Us
              </Link>
              <Link to="/services" className="block text-gray-300 hover:text-white transition-colors duration-300">
                Our Services
              </Link>
              <Link to="/blog" className="block text-gray-300 hover:text-white transition-colors duration-300">
                Expert Blog
              </Link>
              <Link to="/contact" className="block text-gray-300 hover:text-white transition-colors duration-300">
                Contact
              </Link>
              <Link to="/contact" className="block text-gray-300 hover:text-white transition-colors duration-300">
                Get Started
              </Link>
            </div>

            {/* Latest Blog Posts */}
            <div className="mt-8">
              <h4 className="text-white font-bold text-sm mb-4">Latest Insights</h4>
              <div className="space-y-3">
                <Link to="/blog" className="block group">
                  <div className="text-gray-300 hover:text-white transition-colors duration-300 text-sm">
                    <div className="font-medium mb-1">Estonia Company Formation Guide</div>
                    <div className="text-xs text-gray-400">by Sarah Johnson • Jan 15</div>
                  </div>
                </Link>
                <Link to="/blog" className="block group">
                  <div className="text-gray-300 hover:text-white transition-colors duration-300 text-sm">
                    <div className="font-medium mb-1">AI Investment Opportunities</div>
                    <div className="text-xs text-gray-400">by Michael Chen • Jan 12</div>
                  </div>
                </Link>
                <Link to="/blog" className="block group">
                  <div className="text-gray-300 hover:text-white transition-colors duration-300 text-sm">
                    <div className="font-medium mb-1">Malta Golden Visa Updates</div>
                    <div className="text-xs text-gray-400">by Antonio Rucci • Jan 10</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-400 text-sm">
            © 2024 CONSULTING19. All rights reserved. | AI-Enhanced Global Intelligence Network
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
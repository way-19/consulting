import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, MapPin, Mail, Phone, Globe, Linkedin, Twitter, Facebook, Instagram
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSupabase } from '../../contexts/SupabaseContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const { countries } = useSupabase();

  const servicesList = [
    'Company Formation',
    'Investment Advisory', 
    'Legal Consulting',
    'Accounting Services',
    'Visa & Residency',
    'Banking Solutions'
  ];

  const links = [
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.services'), href: '/services' },
    { name: t('nav.blog'), href: '/blog' },
    { name: t('nav.contact'), href: '/contact' },
    { name: t('nav.partnership'), href: '/partnership' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">CONSULTING19</div>
            </Link>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              {t('footer.description')}
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {[
                { icon: Linkedin, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Facebook, href: '#' },
                { icon: Instagram, href: '#' }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-purple-600 transition-all duration-300"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Countries */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-purple-400" />
              {t('nav.countries')}
            </h3>
            <div className="space-y-3">
              {countries.map((country) => (
                <Link
                  key={country.slug}
                  to={`/${country.slug}`}
                  className="flex items-center text-gray-300 hover:text-white transition-colors duration-300"
                >
                  <span className="text-lg mr-3">{country.flag_emoji}</span>
                  <span>{country.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">{t('nav.services')}</h3>
            <div className="space-y-3">
              {servicesList.map((service) => (
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

          {/* Quick Links & Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">{t('footer.quickLinks')}</h3>
            <div className="space-y-3 mb-8">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block text-gray-300 hover:text-white transition-colors duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Contact Info */}
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
                <span className="text-sm">{t('footer.support')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-400 text-sm">
            {t('footer.copyright')}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
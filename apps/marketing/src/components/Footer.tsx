import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Linkedin, Facebook, Instagram, Twitter } from 'lucide-react';
import { useLanguage } from '../lib/language';

const Footer = () => {
  const { t } = useLanguage();

  const footerLinks = [
    {
      title: 'Platform',
      links: [
        { name: t('services'), href: '/services' },
        { name: t('countries'), href: '/countries' },
        { name: 'AI Assistant', href: '/ai-experience' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: t('about'), href: '/about' },
        { name: t('blog'), href: '/blog' },
        { name: 'Sitemap', href: '/sitemap' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
      ],
    },
  ];

  const socialLinks = [
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/consulting19', color: 'hover:text-blue-600' },
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/consulting19', color: 'hover:text-blue-600' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/consulting19', color: 'hover:text-pink-600' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/consulting19', color: 'hover:text-blue-400' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C19</span>
              </div>
              <span className="text-xl font-bold">Consulting19</span>
            </Link>
            <p className="text-gray-300 mb-6 leading-relaxed text-sm">
              AI-powered global business consulting platform connecting entrepreneurs 
              with expert advisors in 19+ countries for seamless international expansion.
            </p>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center space-x-3">
                <Mail size={14} className="text-blue-400" />
                <span className="text-gray-300 text-sm">support@consulting19.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin size={14} className="text-blue-400" />
                <span className="text-gray-300 text-sm">Global Operations Center</span>
              </div>
            </div>

            {/* Let's Connect Section */}
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3 text-sm">Let's connect</h3>
              
              {/* Trustpilot Review */}
              <div className="mb-4">
                <a 
                  href="https://www.trustpilot.com/review/consulting19.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-white rounded-lg p-2 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600 font-bold text-sm">★</span>
                    <span className="text-gray-900 text-xs font-medium">Review us on</span>
                    <span className="text-green-600 font-bold text-sm">Trustpilot</span>
                  </div>
                </a>
              </div>

              {/* Social Media Icons */}
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 ${social.color} transition-colors hover:bg-gray-700`}
                    aria-label={social.name}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-semibold mb-3 text-sm">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-6 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Stripe Payment */}
            <div className="text-center md:text-left">
              <div className="text-xs text-gray-400 mb-2">Powered by</div>
              <div className="bg-white rounded-lg p-2 inline-block">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-900 font-bold text-sm">stripe</span>
                  <div className="flex space-x-1">
                    <div className="w-6 h-4 bg-blue-600 rounded-sm flex items-center justify-center">
                      <span className="text-white text-xs font-bold">VISA</span>
                    </div>
                    <div className="w-6 h-4 bg-red-600 rounded-sm"></div>
                    <div className="w-6 h-4 bg-blue-800 rounded-sm"></div>
                    <div className="w-6 h-4 bg-blue-500 rounded-sm"></div>
                    <div className="w-6 h-4 bg-orange-500 rounded-sm"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex justify-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <div className="text-center">
                  <div className="text-white text-xs font-bold">100%</div>
                  <div className="text-white text-xs leading-none">MONEY</div>
                  <div className="text-white text-xs leading-none">BACK</div>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                <div className="text-center">
                  <div className="text-white text-xs font-bold">100%</div>
                  <div className="text-white text-xs leading-none">SECURE</div>
                  <div className="text-white text-xs leading-none">SSL</div>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <div className="text-center">
                  <div className="text-white text-xs font-bold">100%</div>
                  <div className="text-white text-xs leading-none">PRIVACY</div>
                  <div className="text-white text-xs leading-none">SAFE</div>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">
                {t('copyright')}
              </p>
              <p className="text-gray-500 text-xs mt-1">
                {t('powered')}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
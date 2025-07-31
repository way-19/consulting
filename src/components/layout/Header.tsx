import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  Globe, 
  Menu, 
  X, 
  Bot,
  Sparkles,
  MapPin
} from 'lucide-react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCountriesOpen, setIsCountriesOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const countries = [
    { name: 'Georgia', slug: 'georgia', flag: '🇬🇪', advantage: '0% Tax on Foreign Income' },
    { name: 'United States', slug: 'usa', flag: '🇺🇸', advantage: 'Delaware LLC Formation' },
    { name: 'Montenegro', slug: 'montenegro', flag: '🇲🇪', advantage: 'EU Candidate Benefits' },
    { name: 'Estonia', slug: 'estonia', flag: '🇪🇪', advantage: 'Digital Nomad Paradise' },
    { name: 'Portugal', slug: 'portugal', flag: '🇵🇹', advantage: 'Golden Visa Gateway' },
    { name: 'Malta', slug: 'malta', flag: '🇲🇹', advantage: 'EU Tax Optimization' },
    { name: 'Panama', slug: 'panama', flag: '🇵🇦', advantage: 'Offshore Finance Hub' },
    { name: 'UAE', slug: 'uae', flag: '🇦🇪', advantage: 'Zero Tax Jurisdiction' }
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' }
  ];

  const navigation = [
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' }
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-dark-900/95 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="container">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white group-hover:text-gradient transition-all duration-300">
                CONSULTING19
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-white/90 hover:text-white px-3 py-2 text-sm font-medium transition-all duration-300 relative group ${
                  location.pathname === item.href ? 'text-white' : ''
                }`}
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}

            {/* Countries Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCountriesOpen(!isCountriesOpen)}
                className="flex items-center text-white/90 hover:text-white px-3 py-2 text-sm font-medium transition-all duration-300 group"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Countries
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-300 ${isCountriesOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isCountriesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50"
                  >
                    <div className="grid grid-cols-2 gap-1 p-2">
                      {countries.map((country) => (
                        <Link
                          key={country.slug}
                          to={`/${country.slug}`}
                          onClick={() => setIsCountriesOpen(false)}
                          className="flex items-center p-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 hover:text-primary-700 transition-all duration-300 rounded-lg group"
                        >
                          <span className="text-xl mr-3 group-hover:scale-110 transition-transform duration-300">
                            {country.flag}
                          </span>
                          <span className="font-medium">{country.name}</span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Language Selector */}
            <div className="relative mr-6">
              <button 
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center text-white/90 hover:text-white transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-white/10 border border-white/20"
              >
                <Globe className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">
                  {languages.find(lang => lang.code === currentLanguage)?.flag} {currentLanguage.toUpperCase()}
                </span>
                <ChevronDown className={`ml-1 h-3 w-3 transition-transform duration-300 ${isLanguageOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isLanguageOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-40 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50"
                  >
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => {
                          setCurrentLanguage(language.code);
                          setIsLanguageOpen(false);
                        }}
                        className={`w-full flex items-center px-4 py-2 text-sm hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 hover:text-primary-700 transition-all duration-300 ${
                          currentLanguage === language.code ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
                        }`}
                      >
                        <span className="text-lg mr-3">{language.flag}</span>
                        <span className="font-medium">{language.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CTA Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/get-started"
                className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2 rounded-lg font-medium hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
              >
                Get Started
              </Link>
            </motion.div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors duration-300"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-dark-900/98 backdrop-blur-md border-t border-white/10"
          >
            <div className="container py-6 space-y-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-white hover:text-primary-400 py-2 text-lg font-medium transition-colors duration-300"
                >
                  {item.name}
                </Link>
              ))}

              <div className="border-t border-white/10 pt-6">
                <div className="text-white font-medium mb-4">Countries</div>
                <div className="grid grid-cols-2 gap-3">
                  {countries.slice(0, 6).map((country) => (
                    <Link
                      key={country.slug}
                      to={`/${country.slug}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center p-3 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                    >
                      <span className="text-lg mr-3">{country.flag}</span>
                      <span>{country.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/10 pt-6 space-y-4">
                <div className="space-y-2">
                  <div className="text-white font-medium text-center mb-3">Language</div>
                  <div className="flex justify-center space-x-2">
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => {
                          setCurrentLanguage(language.code);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          currentLanguage === language.code 
                            ? 'bg-primary-600 text-white' 
                            : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                        }`}
                      >
                        <span className="text-base mr-2">{language.flag}</span>
                        <span>{language.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <Link
                  to="/get-started"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center btn-primary"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
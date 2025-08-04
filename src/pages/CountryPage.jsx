import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Users, 
  DollarSign,
  Clock, 
  Globe,
  Building2,
  CreditCard,
  FileText,
  Calculator,
  Plane,
  Scale,
  TrendingUp,
  Shield,
  ChevronDown,
  ChevronUp,
  Calendar,
  Eye,
  Tag
} from 'lucide-react';

import { supabase } from '../lib/supabase';

const CountryPage = ({ country }) => {
  const [countryData, setCountryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const loadCountryDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load country data directly from Supabase
        const { data: countryData, error: countryError } = await supabase
          .from('countries')
          .select('*')
          .eq('slug', country)
          .maybeSingle();

        if (countryError) throw countryError;
        
        if (!countryData) {
          setError('Ülke bulunamadı');
          return;
        }

        // Load services for this country
        const { data: servicesData } = await supabase
          .from('country_services')
          .select('*')
          .eq('country_id', countryData.id)
          .order('title', { ascending: true });

        // Load FAQs for this country
        const { data: faqsData } = await supabase
          .from('country_faqs')
          .select('*')
          .eq('country_id', countryData.id)
          .order('order_index', { ascending: true });

        // Load consultant for this country
        const { data: consultantData } = await supabase
          .from('users')
          .select('id, first_name, last_name, email, performance_rating, total_clients_served')
          .eq('role', 'consultant')
          .eq('primary_country_id', countryData.id)
          .maybeSingle();

        setCountryData({
          ...countryData,
          services: servicesData || [],
          faqs: faqsData || [],
          consultant: consultantData
        });
      } catch (err) {
        console.error("Error loading country data:", err);
        setError("Ülke bilgileri yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    if (country) {
      loadCountryDetails();
    }
  }, [country]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ülke bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !countryData) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Ülke bulunamadı</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link to="/" className="text-purple-600 hover:text-purple-700">
            Ana sayfaya dön
          </Link>
        </div>
      </div>
    );
  }

  const toggleFaq = (index) => { // Keep this for local FAQ state
    setOpenFaq(openFaq === index ? null : index);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Financial Services': 'bg-blue-100 text-blue-700',
      'Tax Planning': 'bg-green-100 text-green-700',
      'Visa & Immigration': 'bg-purple-100 text-purple-700',
      'Company Formation': 'bg-orange-100 text-orange-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  // Default image for services if not provided
  const defaultServiceImage = 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop';
  const defaultBlogImage = 'https://images.pexels.com/photos/12461213/pexels-photo-12461213.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop';

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <img
          src={countryData.image_url || 'https://images.pexels.com/photos/12461213/pexels-photo-12461213.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop'}
          alt={countryData.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" /> {/* Overlay */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center mb-4">
                <span className="text-6xl mr-4">{countryData.flag}</span>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">
                    {countryData.name}
                  </h1>
                  <p className="text-xl text-white/90">{countryData.description}</p>
                </div>
              </div>
              
              {/* Consultant Info */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
                <div className="flex items-center mb-4">
                  {/* Placeholder for consultant avatar */}
                  <div className="w-16 h-16 rounded-full mr-4 bg-gray-200 flex items-center justify-center text-gray-600 text-2xl font-bold">
                    {countryData.consultant?.first_name ? countryData.consultant.first_name.charAt(0) : 'C'}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{countryData.consultant?.first_name} {countryData.consultant?.last_name}</h3>
                    <p className="text-white/80">Senior Business Consultant</p>
                    <p className="text-white/60 text-sm">{countryData.consultant?.total_clients_served || 0} clients served</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{countryData.consultant?.total_clients_served || 'N/A'}</div>
                    <div className="text-white/80 text-sm">Clients</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{countryData.consultant?.performance_rating || 'N/A'}</div>
                    <div className="text-white/80 text-sm">Rating</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{countryData.advantages?.[0] || 'N/A'}</div> {/* Using first advantage as setup time placeholder */}
                    <div className="text-white/80 text-sm">Setup</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Services Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Services</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"> {/* Changed to 3 columns for better layout */}
            {countryData.services.map((service) => (
              <div
                key={service.id}
                className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-white/20 transition-all duration-300 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image_url || defaultServiceImage}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg font-bold text-white mb-1">{service.title}</h3>
                    <p className="text-white/80 text-sm">{service.description}</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="mb-4">
                    <Link
                      to={`/georgia/${service.slug}`}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors font-medium block text-center"
                    >
                      Daha Fazla Bilgi
                    </Link>
                  </div>
                  
                  <ul className="space-y-2">
                    {service.features && service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-white/80 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-400 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Outsourcing Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* This section is hardcoded in the original. For dynamic content, it would need to pull from country_services with a specific category or tag. */}
          {/* For now, we'll keep it as a placeholder or remove it if not needed dynamically. */}
          {/* If you want to make this dynamic, you'd filter countryData.services by a specific category like 'Outsourcing' */}
          {/* Example: */}
          {/* {countryData.services.filter(s => s.category === 'Outsourcing').length > 0 && (
            <>
              <div className="text-center mb-4">
                <span className="text-blue-600 font-medium text-sm uppercase tracking-wide">OUTSOURCING</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Accounting, legal and HR outsourcing
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="relative">
                  <img
                    src={countryData.services.find(s => s.slug === 'hr-outsourcing')?.image_url || defaultServiceImage}
                    alt="Office workspace"
                    className="w-full h-96 object-cover rounded-2xl shadow-xl"
                  />
                </div>
                <div className="space-y-8">
                  {countryData.services.filter(s => s.category === 'Outsourcing').map((service, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">{service.description}</p>
                      <Link to={`/${countryData.slug}/${service.slug}`} className="inline-block bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                        Daha Fazla Bilgi
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )} */}
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest News from {countryData.name}</h2>
            <p className="text-xl text-gray-600">Stay updated with the latest business developments and opportunities in {countryData.name}</p>
          </div>

          {/* Blog posts are currently hardcoded in BlogPage.jsx. For dynamic content, you'd fetch from a blog_posts table filtered by country_id. */}
          {/* For now, this section will remain static or be removed if not dynamically populated. */}
          {/* Example: */}
          {/* {countryData.blog_posts && countryData.blog_posts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {countryData.blog_posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image_url || defaultBlogImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors duration-300">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{new Date(post.published_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{post.read_time} min read</span>
                      </div>
                    </div>

                    <Link to={`/blog/${post.slug}`} className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium text-sm">
                      Read Article
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )} */}

          <div className="text-center">
            <Link to="/blog" className="bg-purple-600 text-white px-8 py-3 rounded-xl hover:bg-purple-700 transition-colors">
              View All {countryData.name} News
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Common questions about doing business in {countryData.name}</p>
          </div>

          <div className="space-y-4">
            {countryData.faqs.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Bu ülke için henüz SSS bulunmuyor.</p>
              </div>
            ) : (
              countryData.faqs.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-gray-900">{item.question}</span>
                    {openFaq === index ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  
                  {openFaq === index && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-6">Ready to Start Your Business in {countryData.name}?</h3>
          <p className="text-xl text-purple-100 mb-8">
            Contact {countryData.consultant?.first_name} {countryData.consultant?.last_name}, your dedicated {countryData.name} business consultant
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="inline-block bg-white text-purple-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-xl text-center"
            >
              Register & Get Started
            </Link>
            <Link
              to="/contact"
              className="inline-block border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition-all duration-300 text-center"
            >
              Schedule Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CountryPage;
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

const CountryPage = ({ country }) => {
  const [openFaq, setOpenFaq] = useState(null);

  // Static country data for demo purposes
  const countryData = {
    georgia: {
      name: 'Georgia',
      flag: '🇬🇪',
      description: 'Easy company formation and tax advantages with dedicated consultant support',
      image_url: 'https://images.pexels.com/photos/12461213/pexels-photo-12461213.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
      consultant: {
        first_name: 'Nino',
        last_name: 'Kvaratskhelia',
        total_clients_served: 1247,
        performance_rating: 4.9
      },
      services: [
        {
          id: 1,
          title: 'Company Registration',
          slug: 'company-registration',
          description: 'Open your business fast, easy and reliable',
          image_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
          features: ['LLC & Corporation setup', 'Tax number acquisition', 'Bank account assistance', 'Legal address provision']
        },
        {
          id: 2,
          title: 'Bank Account Opening',
          slug: 'bank-account',
          description: 'Open Georgian bank accounts for residents and non-residents',
          image_url: 'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
          features: ['Personal & business accounts', 'Multi-currency support', 'Online banking', 'Debit cards']
        },
        {
          id: 3,
          title: 'Visa & Residence',
          slug: 'visa-residence',
          description: 'Get Your Georgian Visa or Residence Permit',
          image_url: 'https://images.pexels.com/photos/2034335/pexels-photo-2034335.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
          features: ['Tourist & work visas', 'Residence permits', 'Document preparation', 'Application support']
        },
        {
          id: 4,
          title: 'Tax Residency',
          slug: 'tax-residency',
          description: 'One of the lowest tax rates in the world',
          image_url: 'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
          features: ['0% tax on foreign income', 'Territorial taxation', 'Tax optimization', 'Compliance support']
        },
        {
          id: 5,
          title: 'Accounting Services',
          slug: 'accounting-services',
          description: 'Your outsource partner for all accounting needs',
          image_url: 'https://images.pexels.com/photos/6863515/pexels-photo-6863515.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
          features: ['Monthly bookkeeping', 'Tax preparation', 'Financial reporting', 'Payroll processing']
        },
        {
          id: 6,
          title: 'Legal Consulting',
          slug: 'legal-consulting',
          description: 'Professional legal services for business operations',
          image_url: 'https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
          features: ['Contract drafting', 'Legal compliance', 'Business law', 'Dispute resolution']
        }
      ],
      faqs: [
        {
          id: 1,
          question: 'How long does it take to register a company in Georgia?',
          answer: 'Company registration in Georgia typically takes 3-5 business days. With our streamlined process and local expertise, we can often complete it faster.'
        },
        {
          id: 2,
          question: 'What are the tax advantages of Georgian companies?',
          answer: 'Georgia offers territorial taxation, meaning you only pay tax on Georgian-sourced income. Foreign income is tax-free, making it very attractive for international businesses.'
        },
        {
          id: 3,
          question: 'Can non-residents open bank accounts in Georgia?',
          answer: 'Yes, non-residents can open both personal and business bank accounts in Georgia. We assist with the entire process including document preparation and bank meetings.'
        },
        {
          id: 4,
          question: 'What is the minimum share capital required?',
          answer: 'The minimum share capital for a Georgian LLC is just 1 GEL (approximately $0.37), making it one of the most accessible jurisdictions for company formation.'
        },
        {
          id: 5,
          question: 'Do I need to visit Georgia to start a business?',
          answer: 'While not always required, we recommend at least one visit for bank account opening and to meet with local authorities. We can arrange everything for your visit.'
        }
      ]
    },
    usa: {
      name: 'United States',
      flag: '🇺🇸',
      description: 'Access to the world\'s largest economy with advanced financial systems',
      image_url: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
      consultant: {
        first_name: 'Michael',
        last_name: 'Chen',
        total_clients_served: 892,
        performance_rating: 4.8
      },
      services: [
        {
          id: 1,
          title: 'Delaware LLC Formation',
          slug: 'delaware-llc',
          description: 'Form your Delaware LLC with expert guidance',
          image_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
          features: ['Delaware incorporation', 'Registered agent', 'EIN acquisition', 'Operating agreement']
        },
        {
          id: 2,
          title: 'US Banking Solutions',
          slug: 'us-banking',
          description: 'Open US business bank accounts',
          image_url: 'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
          features: ['Business checking accounts', 'Credit facilities', 'Payment processing', 'Banking relationships']
        }
      ],
      faqs: [
        {
          id: 1,
          question: 'Why choose Delaware for LLC formation?',
          answer: 'Delaware offers the most business-friendly laws, established legal precedents, and flexible corporate structures that are recognized worldwide.'
        },
        {
          id: 2,
          question: 'Can non-US residents form a Delaware LLC?',
          answer: 'Yes, there are no residency requirements for forming a Delaware LLC. Non-US residents can be owners and managers of Delaware LLCs.'
        }
      ]
    }
  };

  const data = countryData[country];

  if (!data) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Country not found</h1>
          <Link to="/" className="text-purple-600 hover:text-purple-700">
            Back to Home
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
          src={data.image_url}
          alt={data.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" /> {/* Overlay */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center mb-4">
                <span className="text-6xl mr-4">{data.flag}</span>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">
                    {data.name}
                  </h1>
                  <p className="text-xl text-white/90">{data.description}</p>
                </div>
              </div>
              
              {/* Consultant Info */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
                <div className="flex items-center mb-4">
                  <img
                    src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
                    alt={data.consultant.first_name}
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-bold">{data.consultant.first_name} {data.consultant.last_name}</h3>
                    <p className="text-white/80">Senior Business Consultant</p>
                    <p className="text-white/60 text-sm">{data.consultant.total_clients_served} clients served</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{data.consultant.total_clients_served}</div>
                    <div className="text-white/80 text-sm">Clients</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{data.consultant.performance_rating}</div>
                    <div className="text-white/80 text-sm">Rating</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">3-5 days</div>
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
            {data.services.map((service) => (
              <div
                key={service.id}
                className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-white/20 transition-all duration-300 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image_url}
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
                      to={`/${country}/${service.slug}`}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors font-medium block text-center"
                    >
                      Learn More
                    </Link>
                  </div>
                  
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest News from {data.name}</h2>
            <p className="text-xl text-gray-600">Stay updated with the latest business developments and opportunities in {data.name}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {[
              {
                title: 'Georgia Becomes Regional Fintech Hub with New Banking Laws',
                excerpt: 'Georgia passes progressive fintech legislation, attracting international financial services companies.',
                category: 'Financial Services',
                date: '2024-01-08',
                readTime: 10,
                image: 'https://images.pexels.com/photos/12461213/pexels-photo-12461213.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop'
              },
              {
                title: 'New Tax Incentives for International Businesses',
                excerpt: 'Georgian government announces new tax benefits for foreign companies establishing operations.',
                category: 'Tax Planning',
                date: '2024-01-05',
                readTime: 8,
                image: 'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop'
              },
              {
                title: 'Simplified Visa Process for Business Investors',
                excerpt: 'Georgia streamlines visa application process for international business investors and entrepreneurs.',
                category: 'Visa & Immigration',
                date: '2024-01-03',
                readTime: 6,
                image: 'https://images.pexels.com/photos/2034335/pexels-photo-2034335.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop'
              }
            ].map((post, index) => (
              <article
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
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
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{post.readTime} min read</span>
                    </div>
                  </div>

                  <Link to="/blog" className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium text-sm">
                    Read Article
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center">
            <Link to="/blog" className="bg-purple-600 text-white px-8 py-3 rounded-xl hover:bg-purple-700 transition-colors">
              View All {data.name} News
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Common questions about doing business in {data.name}</p>
          </div>

          <div className="space-y-4">
            {data.faqs.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No FAQs available for this country yet.</p>
              </div>
            ) : (
              data.faqs.map((item, index) => (
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
          <h3 className="text-3xl font-bold text-white mb-6">Ready to Start Your Business in {data.name}?</h3>
          <p className="text-xl text-purple-100 mb-8">
            Contact {data.consultant.first_name} {data.consultant.last_name}, your dedicated {data.name} business consultant
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
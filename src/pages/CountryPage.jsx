import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Users, 
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

  // Country specific data with full subsite structure
  const countryData = {
    georgia: {
      name: 'Georgia',
      flag: '🇬🇪',
      consultant: {
        name: 'Nino Kvaratskhelia',
        title: 'Senior Business Consultant',
        experience: '8+ years',
        clients: '1,247',
        rating: '4.9',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
      },
      hero: {
        image: 'https://images.pexels.com/photos/12461213/pexels-photo-12461213.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
        title: 'Start Your Business in Georgia',
        subtitle: 'Strategic location between Europe and Asia with 0% tax on foreign income',
        stats: {
          setupTime: '3-5 days',
          clients: '1,247',
          rating: '4.9',
          satisfaction: '98%'
        }
      },
      services: [
        {
          id: 1,
          title: 'Open A Bank Account In Georgia',
          description: 'Get your personal bank account remotely or in-person.',
          image: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
          features: ['Remote account opening', 'Multi-currency support', 'Online banking', 'Debit card included']
        },
        {
          id: 2,
          slug: 'visa-residence',
          title: 'Visa And Residence Permit In Georgia',
          description: 'Get Your Georgian Visa or Residence Permit.',
          image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
          features: ['Visa application', 'Document preparation', 'Government liaison', 'Status tracking']
        },
        {
          id: 3,
          slug: 'accounting-services',
          title: 'Accounting Services In Georgia',
          description: 'Your outsource partner in Georgia.',
          image: 'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
          features: ['Monthly bookkeeping', 'Tax preparation', 'Financial reporting', 'Compliance monitoring']
        },
        {
          id: 4,
          slug: 'tax-residency',
          title: 'Tax Residency In Georgia',
          description: 'One of the lowest tax rates in the world.',
          image: 'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
          features: ['Tax residency application', 'Status certificate', 'Tax optimization', 'Legal compliance']
        },
        {
          id: 5,
          slug: 'company-registration',
          title: 'Company Registration In Georgia',
          description: 'Open your business fast, easy and reliable.',
          image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
          features: ['LLC registration', 'Tax number', 'Bank account opening', 'Legal address']
        },
        {
          id: 6,
          slug: 'commercial-law',
          title: 'Commercial Law Consulting In Georgia',
          description: 'Professional commercial law services for businesses.',
          image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
          features: ['Contract drafting', 'Business law', 'Compliance review', 'Legal advisory']
        }
      ],
      outsourcing: {
        title: 'Accounting, legal and HR outsourcing',
        services: [
          {
            title: 'HR Outsourcing',
            description: 'Every successful business relies on a team of competent individuals. In Georgia, legalizing business operations necessitates employing both residents and non-residents.',
            image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop',
            buttonText: 'HR outsourcing'
          },
          {
            title: 'Legal Consulting',
            description: 'Professional legal services for business operations in Georgia including contract drafting, compliance review, and regulatory guidance.',
            image: 'https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop',
            buttonText: 'Legal consulting'
          },
          {
            title: 'Accounting Services',
            description: 'Complete accounting solutions including bookkeeping, tax preparation, financial reporting, and compliance monitoring for Georgian businesses.',
            image: 'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop',
            buttonText: 'Accounting services'
          }
        ]
      },
      blog: [
        {
          id: 1,
          title: 'Georgia Becomes Regional Fintech Hub with New Banking Laws',
          excerpt: 'Georgia passes progressive fintech legislation, attracting international financial services companies with streamlined licensing and favorable regulations.',
          image: 'https://images.pexels.com/photos/12461213/pexels-photo-12461213.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
          category: 'Financial Services',
          date: '2024-01-15',
          readTime: 8,
          views: 1247
        },
        {
          id: 2,
          title: 'New Tax Incentives for International Businesses in Georgia',
          excerpt: 'Georgian government announces additional tax benefits for foreign companies establishing operations in the country, including extended tax holidays.',
          image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
          category: 'Tax Planning',
          date: '2024-01-12',
          readTime: 6,
          views: 892
        },
        {
          id: 3,
          title: 'Georgia Digital Nomad Visa: Complete Application Guide',
          excerpt: 'Step-by-step guide to applying for Georgia\'s new digital nomad visa program, including requirements, benefits, and application process.',
          image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
          category: 'Visa & Immigration',
          date: '2024-01-10',
          readTime: 10,
          views: 1156
        }
      ],
      faq: [
        {
          question: 'How long does it take to register a company in Georgia?',
          answer: 'Company registration in Georgia typically takes 3-5 business days. Our streamlined process ensures all documentation is prepared correctly and submitted efficiently to the House of Justice.'
        },
        {
          question: 'What are the tax benefits of Georgian tax residency?',
          answer: 'Georgian tax residents benefit from territorial taxation, meaning you only pay tax on Georgian-sourced income. Foreign income is generally tax-free, making it highly attractive for international businesses and entrepreneurs.'
        },
        {
          question: 'Can I open a bank account in Georgia remotely?',
          answer: 'Yes, we offer remote bank account opening services for most Georgian banks. The process typically requires document verification and a video call with the bank representative.'
        },
        {
          question: 'What is the Individual Entrepreneur (IE) status in Georgia?',
          answer: 'IE status allows you to operate as a sole proprietor with only 1% tax on income up to $200,000 annually. It\'s the simplest business structure in Georgia with minimal reporting requirements.'
        },
        {
          question: 'Do I need to visit Georgia to start my business?',
          answer: 'While not always required, we recommend at least one visit to Georgia to complete banking procedures and meet with local authorities. However, many processes can be handled remotely through our services.'
        },
        {
          question: 'What ongoing compliance is required for Georgian companies?',
          answer: 'Georgian companies must file annual returns and maintain proper accounting records. Our ongoing compliance services ensure all requirements are met, including tax filings and regulatory updates.'
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

  const toggleFaq = (index) => {
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

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <img
          src={data.hero.image}
          alt={data.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center mb-4">
                <span className="text-6xl mr-4">{data.flag}</span>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">
                    {data.hero.title}
                  </h1>
                  <p className="text-xl text-white/90">{data.hero.subtitle}</p>
                </div>
              </div>
              
              {/* Consultant Info */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
                <div className="flex items-center mb-4">
                  <img
                    src={data.consultant.avatar}
                    alt={data.consultant.name}
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-bold">{data.consultant.name}</h3>
                    <p className="text-white/80">{data.consultant.title}</p>
                    <p className="text-white/60 text-sm">{data.consultant.experience} experience</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{data.consultant.clients}</div>
                    <div className="text-white/80 text-sm">Clients</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{data.consultant.rating}</div>
                    <div className="text-white/80 text-sm">Rating</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{data.hero.stats.setupTime}</div>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {data.services.map((service) => (
              <div
                key={service.id}
                className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-white/20 transition-all duration-300 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
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
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-white/80">
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
          <div className="text-center mb-4">
            <span className="text-blue-600 font-medium text-sm uppercase tracking-wide">OUTSOURCING</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            {data.outsourcing.title}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src={data.outsourcing.services[0].image}
                alt="Office workspace"
                className="w-full h-96 object-cover rounded-2xl shadow-xl"
              />
            </div>

            <div className="space-y-8">
              {data.outsourcing.services.map((service, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{service.description}</p>
                 <Link
                   to="/georgia/accounting-services"
                   className="inline-block bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                 >
                    {service.buttonText}
                 </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Latest News from {data.name}
            </h2>
            <p className="text-xl text-gray-600">
              Stay updated with the latest business developments and opportunities in {data.name}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {data.blog.map((post) => (
              <article
                key={post.id}
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
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{post.readTime} min read</span>
                    </div>
                  </div>

                  <button className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium text-sm">
                    Read Article
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center">
            <button className="bg-purple-600 text-white px-8 py-3 rounded-xl hover:bg-purple-700 transition-colors">
              View All {data.name} News
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Common questions about doing business in {data.name}
            </p>
          </div>

          <div className="space-y-4">
            {data.faq.map((item, index) => (
              <div
                key={index}
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
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-6">Ready to Start Your Business in {data.name}?</h3>
          <p className="text-xl text-purple-100 mb-8">
            Contact {data.consultant.name}, your dedicated {data.name} business consultant
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
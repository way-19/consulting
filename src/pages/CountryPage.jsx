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
  const defaultBlogImage = 'https://images.pexels.com/photos/12461213/pexels-photo-12461213.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop';

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <img
          src={data.image_url}
          alt={`${data.name} landscape`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">
              {data.flag} {data.name}
            </h1>
            <p className="text-xl max-w-2xl mx-auto">
              {data.description}
            </p>
          </div>
        </div>
      </section>

      {/* Consultant Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Dedicated Consultant</h2>
            <p className="text-lg text-gray-600">Expert guidance from local professionals</p>
          </div>
          
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-12 h-12 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {data.consultant.first_name} {data.consultant.last_name}
              </h3>
              <div className="flex items-center justify-center mb-4">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="ml-1 text-gray-600">{data.consultant.performance_rating}</span>
              </div>
              <div className="text-gray-600 mb-6">
                <p>{data.consultant.total_clients_served} clients served</p>
              </div>
              <button className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors">
                Schedule Consultation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services in {data.name}</h2>
            <p className="text-lg text-gray-600">Comprehensive business solutions tailored for your success</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.services.map((service) => (
              <div key={service.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <img
                  src={service.image_url || defaultServiceImage}
                  alt={service.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={`/${country}/${service.slug}`}
                    className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Get answers to common questions about doing business in {data.name}</p>
          </div>
          
          <div className="space-y-4">
            {data.faqs.map((faq, index) => (
              <div key={faq.id} className="bg-white rounded-lg shadow-sm">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Business in {data.name}?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Get expert guidance and personalized support for your business journey
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Schedule Free Consultation
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-purple-600 transition-colors">
              View All Services
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CountryPage;
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
          src={data.image_url
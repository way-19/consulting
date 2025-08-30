import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Search, HelpCircle } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { supabase } from '@consulting19/supabase';
import { useLanguage } from '@consulting19/shared';

interface ServiceFAQ {
  id: string;
  service_id: string;
  question: string;
  answer: string;
  question_tr?: string;
  answer_tr?: string;
  question_pt?: string;
  answer_pt?: string;
  order_index: number;
  is_active: boolean;
  service: {
    title: string;
    title_tr?: string;
    title_pt?: string;
  };
}

const FAQPage = () => {
  const { language } = useLanguage();
  const [faqs, setFaqs] = useState<ServiceFAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState('all');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  useEffect(() => {
    fetchFAQs();
  }, []);

  // Mock FAQ data - these would come from consultant services
  const mockFaqs = [
    {
      id: '1',
      service_id: 'c1',
      question: 'How long does UAE company formation take?',
      answer: 'UAE company formation typically takes 7-14 days depending on the jurisdiction and banking requirements.',
      question_tr: 'BAE şirket kuruluşu ne kadar sürer?',
      answer_tr: 'BAE şirket kuruluşu genellikle yargı alanı ve bankacılık gereksinimlerine bağlı olarak 7-14 gün sürer.',
      question_pt: 'Quanto tempo leva a formação de empresa nos EAU?',
      answer_pt: 'A formação de empresa nos EAU normalmente leva 7-14 dias dependendo da jurisdição e requisitos bancários.',
      order_index: 1,
      is_active: true,
      service: {
        title: 'UAE Company Formation',
        title_tr: 'BAE Şirket Kuruluşu',
        title_pt: 'Formação de Empresa nos EAU'
      }
    },
    {
      id: '2',
      service_id: 'c2',
      question: 'What are the banking requirements in UAE?',
      answer: 'UAE banking requirements include trade license, Emirates ID for signatories, and initial deposit.',
      question_tr: 'BAE\'de bankacılık gereksinimleri nelerdir?',
      answer_tr: 'BAE bankacılık gereksinimleri ticaret lisansı, imzacılar için Emirates ID ve ilk depozito içerir.',
      question_pt: 'Quais são os requisitos bancários nos EAU?',
      answer_pt: 'Os requisitos bancários dos EAU incluem licença comercial, Emirates ID para signatários e depósito inicial.',
      order_index: 1,
      is_active: true,
      service: {
        title: 'UAE Banking Solutions',
        title_tr: 'BAE Bankacılık Çözümleri',
        title_pt: 'Soluções Bancárias dos EAU'
      }
    },
  ];

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      // Use mock data for now
      setTimeout(() => {
        setFaqs(mockFaqs);
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error('Unexpected error:', err);
      setLoading(false);
    }
  };
  const getLocalizedContent = (item: ServiceFAQ, field: 'question' | 'answer'): string => {
    if (language === 'tr' && item[`${field}_tr` as keyof ServiceFAQ]) {
      return item[`${field}_tr` as keyof ServiceFAQ] as string;
    }
    if (language === 'pt' && item[`${field}_pt` as keyof ServiceFAQ]) {
      return item[`${field}_pt` as keyof ServiceFAQ] as string;
    }
    return item[field];
  };

  const getLocalizedServiceTitle = (service: ServiceFAQ['service']): string => {
    if (language === 'tr' && service.title_tr) {
      return service.title_tr;
    }
    if (language === 'pt' && service.title_pt) {
      return service.title_pt;
    }
    return service.title;
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  // Get unique services for filter
  const uniqueServices = Array.from(
    new Set(faqs.map(faq => JSON.stringify({ id: faq.service_id, title: getLocalizedServiceTitle(faq.service) })))
  ).map(str => JSON.parse(str));

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = 
      getLocalizedContent(faq, 'question').toLowerCase().includes(searchTerm.toLowerCase()) ||
      getLocalizedContent(faq, 'answer').toLowerCase().includes(searchTerm.toLowerCase()) ||
      getLocalizedServiceTitle(faq.service).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesService = selectedService === 'all' || faq.service_id === selectedService;
    return matchesSearch && matchesService;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-0">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Find answers to common questions about our services and international business expansion.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter */}
        <Card className="mb-12">
          <Card.Body>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Services</option>
                {uniqueServices.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.title}
                  </option>
                ))}
              </select>
            </div>
          </Card.Body>
        </Card>

        {/* FAQ Items */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading FAQs...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <Card key={faq.id}>
                <Card.Body>
                  <button
                    onClick={() => toggleExpanded(faq.id)}
                    className="w-full text-left flex justify-between items-center"
                  >
                    <div className="flex-1 pr-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {getLocalizedContent(faq, 'question')}
                      </h3>
                      <div className="text-sm text-blue-600 font-medium">
                        {getLocalizedServiceTitle(faq.service)}
                      </div>
                    </div>
                    {expandedItems.includes(faq.id) ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  
                  {expandedItems.includes(faq.id) && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-gray-600 leading-relaxed">
                        {getLocalizedContent(faq, 'answer')}
                      </p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            ))}
          </div>
        )}

        {filteredFAQs.length === 0 && !loading && (
          <div className="text-center py-12">
            <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No FAQs found</h3>
            <p className="text-gray-600">
              {searchTerm || selectedService !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'FAQs are being prepared by our consultants for each service.'}
            </p>
          </div>
        )}

        {/* CTA */}
        <Card className="mt-12 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
          <Card.Body className="text-center">
            <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-blue-100 mb-6">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button variant="secondary" size="lg">
                  Contact Support
                </Button>
              </Link>
              <Link to="/ai-assistant">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Try AI Assistant
                </Button>
              </Link>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default FAQPage;
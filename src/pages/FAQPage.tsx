import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, HelpCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const faqCategories = [
    { value: 'all', label: 'All Categories' },
    { value: 'account', label: 'Account & Registration' },
    { value: 'services', label: 'Services & Pricing' },
    { value: 'payments', label: 'Payments & Billing' },
    { value: 'legal', label: 'Legal & Compliance' },
    { value: 'technical', label: 'Technical Support' },
  ];

  const faqs = [
    {
      id: '1',
      category: 'account',
      question: 'How do I create an account on Consulting19?',
      answer: 'Creating an account is simple. Click "Sign Up" on our homepage, fill in your basic information (name, email, password), and verify your email address. Once verified, you can access our AI Oracle and start exploring services.',
    },
    {
      id: '2',
      category: 'services',
      question: 'How does Consulting19 select the right consultant for me?',
      answer: 'Our AI Oracle analyzes your business needs, target markets, and goals to recommend the most suitable jurisdictions and services. We then match you with expert consultants who specialize in your chosen countries and have experience with businesses similar to yours.',
    },
    {
      id: '3',
      category: 'services',
      question: 'What countries does Consulting19 operate in?',
      answer: 'We currently operate in 19+ business-friendly jurisdictions including UAE, Singapore, Estonia, Malta, Georgia, Panama, Portugal, and more. Each country is served by local expert advisors who understand the specific regulations and opportunities.',
    },
    {
      id: '4',
      category: 'payments',
      question: 'What are the platform fees?',
      answer: 'Consulting19 operates on a transparent commission model. We charge a 35% platform fee on all services, while consultants receive 65% of the payment. There are no hidden fees or monthly subscription costs for clients.',
    },
    {
      id: '5',
      category: 'payments',
      question: 'How does billing work?',
      answer: 'We use Stripe for secure payment processing. You can pay for services using credit cards, debit cards, or bank transfers. Payments are processed instantly and you receive immediate confirmation and receipts.',
    },
    {
      id: '6',
      category: 'legal',
      question: 'Is my data secure on Consulting19?',
      answer: 'Yes, we take security very seriously. We use enterprise-grade security measures including encryption at rest and in transit, row-level security policies, and strict access controls. Only you and your assigned consultant can access your documents and information.',
    },
    {
      id: '7',
      category: 'legal',
      question: 'What documents do I need to provide?',
      answer: 'Required documents vary by service and country, but typically include passport copies, proof of address, bank statements, and business plans. Your consultant will provide a specific checklist based on your chosen jurisdiction and services.',
    },
    {
      id: '8',
      category: 'services',
      question: 'How long does company formation typically take?',
      answer: 'Timeline varies by jurisdiction. Fast jurisdictions like Estonia can complete e-Residency in 1-2 weeks, while more complex setups in countries like UAE or Singapore typically take 2-6 weeks depending on banking requirements and document preparation.',
    },
    {
      id: '9',
      category: 'technical',
      question: 'How do I access my documents and project updates?',
      answer: 'All your documents and project updates are available in your secure client portal. You can access this 24/7 from any device. You\'ll also receive email notifications for important updates.',
    },
    {
      id: '10',
      category: 'account',
      question: 'Can I change my assigned consultant?',
      answer: 'While we carefully match clients with the best consultants for their needs, if you\'re not satisfied, you can request a consultant change through your dashboard or by contacting our support team.',
    },
  ];

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Find answers to common questions about our services, processes, and platform.
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
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                {faqCategories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </Card.Body>
        </Card>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.map((faq) => (
            <Card key={faq.id}>
              <Card.Body>
                <button
                  onClick={() => toggleExpanded(faq.id)}
                  className="w-full text-left flex justify-between items-center"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  {expandedItems.includes(faq.id) ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                
                {expandedItems.includes(faq.id) && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </Card.Body>
            </Card>
          ))}
        </div>

        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No FAQs found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
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
              <Button variant="secondary" size="lg">
                Contact Support
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                Try AI Assistant
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default FAQPage;
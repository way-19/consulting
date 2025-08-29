import React from 'react';
import { Book, Code, Download, ExternalLink, Search, FileText, Zap, Shield } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';

const DocumentationPage = () => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const docSections = [
    {
      title: 'Getting Started',
      icon: Book,
      docs: [
        { title: 'Platform Overview', description: 'Introduction to Consulting19 platform and services', href: '#overview' },
        { title: 'Account Setup', description: 'How to create and configure your account', href: '#setup' },
        { title: 'First Project', description: 'Step-by-step guide to your first consultation', href: '#first-project' },
      ],
    },
    {
      title: 'API Documentation',
      icon: Code,
      docs: [
        { title: 'Authentication', description: 'API authentication and security', href: '#auth' },
        { title: 'Endpoints', description: 'Complete API endpoint reference', href: '#endpoints' },
        { title: 'SDKs', description: 'Available SDKs and integration libraries', href: '#sdks' },
      ],
    },
    {
      title: 'Services Guide',
      icon: FileText,
      docs: [
        { title: 'Company Formation', description: 'Complete guide to international company setup', href: '#company-formation' },
        { title: 'Tax Optimization', description: 'International tax planning strategies', href: '#tax-optimization' },
        { title: 'Banking Solutions', description: 'Global banking and payment solutions', href: '#banking' },
      ],
    },
    {
      title: 'Security & Compliance',
      icon: Shield,
      docs: [
        { title: 'Data Security', description: 'How we protect your sensitive information', href: '#security' },
        { title: 'Compliance Standards', description: 'Our regulatory compliance framework', href: '#compliance' },
        { title: 'Privacy Controls', description: 'Privacy settings and data management', href: '#privacy' },
      ],
    },
  ];

  const quickLinks = [
    { title: 'AI Oracle Guide', description: 'How to use our AI assistant effectively', icon: Zap },
    { title: 'Country Comparison Tool', description: 'Compare jurisdictions side by side', icon: FileText },
    { title: 'Document Templates', description: 'Download common business documents', icon: Download },
    { title: 'Support Center', description: 'Get help from our support team', icon: ExternalLink },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Documentation
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Everything you need to know about using Consulting19 for your international business expansion.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search */}
        <Card className="mb-12">
          <Card.Body>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search documentation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </Card.Body>
        </Card>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {quickLinks.map((link, index) => (
            <Card key={index} hover>
              <Card.Body className="text-center">
                <link.icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">{link.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{link.description}</p>
                <Button variant="outline" size="sm" className="w-full">
                  View Guide
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>

        {/* Documentation Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {docSections.map((section, index) => (
            <Card key={index}>
              <Card.Header>
                <div className="flex items-center space-x-3">
                  <section.icon className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                </div>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  {section.docs.map((doc, docIndex) => (
                    <div key={docIndex} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <h3 className="font-medium text-gray-900 mb-2">{doc.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{doc.description}</p>
                      <Button variant="outline" size="sm">
                        Read More
                      </Button>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>

        {/* Help Section */}
        <Card className="mt-12 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
          <Card.Body className="text-center">
            <h2 className="text-2xl font-bold mb-4">Need Additional Help?</h2>
            <p className="text-blue-100 mb-6">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg">
                Contact Support
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                Schedule Demo
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default DocumentationPage;
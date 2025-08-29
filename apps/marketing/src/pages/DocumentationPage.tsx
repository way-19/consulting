import React, { useState } from 'react';
import { Book, Code, Download, Search, ExternalLink } from 'lucide-react';
import { useLanguage } from '@consulting19/shared';
import { Card, Button } from '@consulting19/ui';

const DocumentationPage = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const docSections = [
    {
      title: t('docsGettingStartedTitle'),
      description: t('docsGettingStartedDesc'),
      icon: Book,
      articles: [
        { title: t('docsQuickStartTitle'), href: '#quick-start' },
        { title: t('docsAccountSetupTitle'), href: '#account-setup' },
        { title: t('docsFirstProjectTitle'), href: '#first-project' },
      ],
    },
    {
      title: t('docsAPITitle'),
      description: t('docsAPIDesc'),
      icon: Code,
      articles: [
        { title: t('docsAPIReferenceTitle'), href: '#api-reference' },
        { title: t('docsWebhooksTitle'), href: '#webhooks' },
        { title: t('docsSDKsTitle'), href: '#sdks' },
      ],
    },
    {
      title: t('docsGuidesTitle'),
      description: t('docsGuidesDesc'),
      icon: Download,
      articles: [
        { title: t('docsCompanyFormationTitle'), href: '#company-formation' },
        { title: t('docsBankingTitle'), href: '#banking' },
        { title: t('docsTaxPlanningTitle'), href: '#tax-planning' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t('docsHeroTitle')}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {t('docsHeroDescription')}
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
                placeholder={t('docsSearchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </Card.Body>
        </Card>

        {/* Documentation Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {docSections.map((section, index) => (
            <Card key={index} hover>
              <Card.Body>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center mb-4">
                  <section.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {section.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {section.description}
                </p>
                
                <ul className="space-y-2">
                  {section.articles.map((article, i) => (
                    <li key={i}>
                      <a 
                        href={article.href}
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        {article.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;
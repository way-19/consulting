import React from 'react';
import { Shield, FileText, Globe, Users, CheckCircle, Award } from 'lucide-react';
import { useLanguage } from '@consulting19/shared';
import { Card } from '@consulting19/ui';

const CompliancePage = () => {
  const { t } = useLanguage();

  const complianceAreas = [
    {
      icon: Shield,
      title: t('complianceDataProtectionTitle'),
      description: t('complianceDataProtectionDesc'),
      standards: [
        t('complianceGDPR'),
        t('complianceCCPA'),
        t('complianceSOC2'),
        t('complianceISO27001'),
      ],
    },
    {
      icon: FileText,
      title: t('complianceFinancialTitle'),
      description: t('complianceFinancialDesc'),
      standards: [
        t('complianceAML'),
        t('complianceKYC'),
        t('compliancePCI'),
        t('complianceSOX'),
      ],
    },
    {
      icon: Globe,
      title: t('complianceInternationalTitle'),
      description: t('complianceInternationalDesc'),
      standards: [
        t('complianceOECD'),
        t('complianceFATCA'),
        t('complianceCRS'),
        t('complianceBEPS'),
      ],
    },
  ];

  const certifications = [
    {
      name: t('complianceCertISO'),
      description: t('complianceCertISODesc'),
      status: 'certified',
    },
    {
      name: t('complianceCertSOC'),
      description: t('complianceCertSOCDesc'),
      status: 'certified',
    },
    {
      name: t('complianceCertGDPR'),
      description: t('complianceCertGDPRDesc'),
      status: 'compliant',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t('complianceHeroTitle')}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {t('complianceHeroDescription')}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Compliance Areas */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('complianceAreasTitle')}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('complianceAreasDescription')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {complianceAreas.map((area, index) => (
            <Card key={index} hover className="h-full">
              <Card.Body>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <area.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  {area.title}
                </h3>
                <p className="text-gray-600 mb-6 text-center">
                  {area.description}
                </p>
                
                <ul className="space-y-2">
                  {area.standards.map((standard, i) => (
                    <li key={i} className="flex items-center text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm">{standard}</span>
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          ))}
        </div>

        {/* Certifications */}
        <Card>
          <Card.Header>
            <h3 className="text-2xl font-bold text-gray-900">{t('complianceCertificationsTitle')}</h3>
          </Card.Header>
          <Card.Body>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {certifications.map((cert, index) => (
                <div key={index} className="text-center p-6 border border-gray-200 rounded-lg">
                  <Award className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h4 className="font-semibold text-gray-900 mb-2">{cert.name}</h4>
                  <p className="text-gray-600 text-sm mb-3">{cert.description}</p>
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                    cert.status === 'certified' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {t(`complianceStatus${cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}`)}
                  </span>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default CompliancePage;
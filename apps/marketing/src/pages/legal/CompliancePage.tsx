import React from 'react';
import { Shield, CheckCircle, FileText, Globe, Lock, Award } from 'lucide-react';
import { Card } from '@consulting19/ui';

const CompliancePage = () => {
  const complianceStandards = [
    {
      icon: Shield,
      title: 'GDPR Compliance',
      description: 'Full compliance with European data protection regulations',
      status: 'Certified',
    },
    {
      icon: Lock,
      title: 'SOC 2 Type II',
      description: 'Security, availability, and confidentiality controls',
      status: 'Audited',
    },
    {
      icon: Globe,
      title: 'ISO 27001',
      description: 'International information security management standards',
      status: 'Certified',
    },
    {
      icon: Award,
      title: 'PCI DSS',
      description: 'Payment card industry data security standards',
      status: 'Compliant',
    },
  ];

  const regulations = [
    {
      title: 'Anti-Money Laundering (AML)',
      description: 'We maintain strict AML policies and procedures to prevent financial crimes.',
      requirements: [
        'Customer due diligence procedures',
        'Suspicious activity monitoring',
        'Regular compliance training',
        'Third-party risk assessment',
      ],
    },
    {
      title: 'Know Your Customer (KYC)',
      description: 'Comprehensive identity verification and ongoing monitoring processes.',
      requirements: [
        'Identity verification procedures',
        'Beneficial ownership identification',
        'Enhanced due diligence for high-risk clients',
        'Ongoing monitoring and updates',
      ],
    },
    {
      title: 'Data Protection',
      description: 'Robust data protection measures to safeguard client information.',
      requirements: [
        'Data encryption at rest and in transit',
        'Access controls and authentication',
        'Regular security assessments',
        'Incident response procedures',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Compliance & Security
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Our commitment to maintaining the highest standards of security, privacy, and regulatory compliance.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Compliance Standards */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Compliance Standards</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We adhere to international standards and regulations to ensure your data and transactions are secure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {complianceStandards.map((standard, index) => (
            <Card key={index} className="text-center">
              <Card.Body>
                <standard.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">{standard.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{standard.description}</p>
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  {standard.status}
                </span>
              </Card.Body>
            </Card>
          ))}
        </div>

        {/* Regulatory Compliance */}
        <div className="space-y-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Regulatory Compliance</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We comply with all applicable laws and regulations in the jurisdictions where we operate.
            </p>
          </div>

          {regulations.map((regulation, index) => (
            <Card key={index}>
              <Card.Body>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-8 h-8 text-green-600 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {regulation.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {regulation.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {regulation.requirements.map((requirement, reqIndex) => (
                        <div key={reqIndex} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <span className="text-sm text-gray-700">{requirement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>

        {/* Security Measures */}
        <Card className="mt-12">
          <Card.Header>
            <h2 className="text-2xl font-bold text-gray-900">Security Measures</h2>
          </Card.Header>
          <Card.Body>
            <div className="prose prose-lg max-w-none">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Encryption</h3>
              <p className="text-gray-600 mb-4">
                All data is encrypted using industry-standard AES-256 encryption both at rest and in transit. 
                We use TLS 1.3 for all communications and maintain strict key management procedures.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-3">Access Controls</h3>
              <p className="text-gray-600 mb-4">
                We implement role-based access controls with multi-factor authentication for all user accounts. 
                Administrative access is strictly limited and monitored with comprehensive audit logs.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-3">Regular Audits</h3>
              <p className="text-gray-600 mb-4">
                Our security and compliance programs are regularly audited by independent third parties. 
                We conduct quarterly security assessments and annual compliance reviews.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-3">Incident Response</h3>
              <p className="text-gray-600 mb-6">
                We maintain a comprehensive incident response plan with 24/7 monitoring and rapid response 
                capabilities. All security incidents are investigated and reported according to regulatory requirements.
              </p>
            </div>
          </Card.Body>
        </Card>

        {/* Contact */}
        <Card className="mt-8 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
          <Card.Body className="text-center">
            <h2 className="text-2xl font-bold mb-4">Questions About Compliance?</h2>
            <p className="text-blue-100 mb-6">
              Our compliance team is available to answer any questions about our security and regulatory practices.
            </p>
            <div className="bg-white/10 p-4 rounded-lg">
              <p className="text-white">
                <strong>Compliance Team:</strong> compliance@consulting19.com<br />
                <strong>Security Team:</strong> security@consulting19.com
              </p>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default CompliancePage;
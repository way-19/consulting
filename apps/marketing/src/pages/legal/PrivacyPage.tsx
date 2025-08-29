import React from 'react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';
import { Card } from '@consulting19/ui';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-0">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Your privacy is our priority. Learn how we collect, use, and protect your information.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Privacy Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: Shield,
              title: 'Enterprise Security',
              description: 'Bank-grade encryption and security measures'
            },
            {
              icon: Lock,
              title: 'Data Protection',
              description: 'GDPR compliant with strict access controls'
            },
            {
              icon: Eye,
              title: 'Transparency',
              description: 'Clear policies on data collection and usage'
            }
          ].map((item, index) => (
            <Card key={index} className="text-center">
              <Card.Body>
                <item.icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </Card.Body>
            </Card>
          ))}
        </div>

        {/* Privacy Policy Content */}
        <Card>
          <Card.Body>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                <strong>Last updated:</strong> January 2025
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
              <p className="text-gray-600 mb-4">
                We collect information you provide directly to us, such as when you create an account, 
                use our services, or contact us for support. This includes:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1">
                <li>Personal identification information (name, email, phone number)</li>
                <li>Business information (company details, industry, expansion goals)</li>
                <li>Financial information (for payment processing and tax optimization)</li>
                <li>Documents you upload to our secure platform</li>
                <li>Communication records with our consultants</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-600 mb-4">We use the information we collect to:</p>
              <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1">
                <li>Provide and improve our consulting services</li>
                <li>Match you with appropriate expert advisors</li>
                <li>Process payments and manage your account</li>
                <li>Communicate about your projects and services</li>
                <li>Comply with legal and regulatory requirements</li>
                <li>Provide customer support and technical assistance</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing</h2>
              <p className="text-gray-600 mb-4">
                We do not sell or rent your personal information. We may share your information only in these circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1">
                <li>With assigned consultants to provide requested services</li>
                <li>With service providers who assist in our operations (payment processing, hosting)</li>
                <li>To comply with legal obligations or protect our rights</li>
                <li>With your explicit consent</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
              <p className="text-gray-600 mb-6">
                We implement comprehensive security measures to protect your information:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1">
                <li>Encryption of data in transit and at rest</li>
                <li>Row-level security policies in our database</li>
                <li>Regular security audits and monitoring</li>
                <li>Limited access on a need-to-know basis</li>
                <li>Secure document storage with access controls</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Rights</h2>
              <p className="text-gray-600 mb-4">You have the right to:</p>
              <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1">
                <li>Access and review your personal information</li>
                <li>Correct inaccurate or incomplete data</li>
                <li>Request deletion of your data (subject to legal requirements)</li>
                <li>Object to processing of your information</li>
                <li>Data portability for your information</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. International Transfers</h2>
              <p className="text-gray-600 mb-6">
                As we operate globally, your information may be transferred to countries other than your own. 
                We ensure appropriate safeguards are in place for such transfers, including adequacy decisions 
                and standard contractual clauses where applicable.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Contact Us</h2>
              <p className="text-gray-600 mb-4">
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> privacy@consulting19.com<br />
                  <strong>Address:</strong> 123 Business Ave, Suite 100, New York, NY 10001
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPage;
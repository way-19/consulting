import React from 'react';
import { FileText, Scale, Users, CreditCard } from 'lucide-react';
import { Card } from '@consulting19/ui';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-0">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Please read these terms carefully before using our platform and services.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Key Terms Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            {
              icon: FileText,
              title: 'Service Terms',
              description: 'Clear expectations for all services'
            },
            {
              icon: Scale,
              title: 'Fair Usage',
              description: 'Reasonable use policies'
            },
            {
              icon: Users,
              title: 'User Responsibilities',
              description: 'Your obligations as a user'
            },
            {
              icon: CreditCard,
              title: 'Payment Terms',
              description: 'Billing and refund policies'
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

        {/* Terms Content */}
        <Card>
          <Card.Body>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                <strong>Last updated:</strong> January 2025
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 mb-6">
                By accessing and using Consulting19's platform and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Service Description</h2>
              <p className="text-gray-600 mb-4">
                Consulting19 is an AI-powered platform that connects clients with expert business advisors for international business expansion services, including but not limited to:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1">
                <li>Company formation and registration services</li>
                <li>Tax optimization and planning strategies</li>
                <li>Banking solutions and account opening assistance</li>
                <li>Legal compliance and regulatory guidance</li>
                <li>AI-powered business recommendations</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts and Registration</h2>
              <p className="text-gray-600 mb-4">
                To use our services, you must:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1">
                <li>Provide accurate and complete registration information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized use</li>
                <li>Be responsible for all activities under your account</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Payment Terms</h2>
              <p className="text-gray-600 mb-4">
                Our platform operates on a commission-based model:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1">
                <li>Consulting19 charges a 35% platform fee on all services</li>
                <li>Consultants receive 65% of the payment for services provided</li>
                <li>Payments are processed securely through Stripe</li>
                <li>Refunds are subject to individual service terms and consultant policies</li>
                <li>Recurring services will be charged automatically until cancelled</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Consultant Responsibilities</h2>
              <p className="text-gray-600 mb-4">
                Consultants using our platform agree to:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1">
                <li>Provide accurate professional credentials and experience</li>
                <li>Deliver services with professional competence and integrity</li>
                <li>Maintain client confidentiality and data security</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Respond to client inquiries in a timely manner</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Limitation of Liability</h2>
              <p className="text-gray-600 mb-6">
                Consulting19 acts as a platform connecting clients with independent consultants. While we vet our consultants, we do not guarantee specific outcomes. Our liability is limited to the platform fees paid. Consultants are independent contractors responsible for their professional services and advice.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
              <p className="text-gray-600 mb-6">
                The Consulting19 platform, including its AI Oracle technology, design, and content, is protected by intellectual property laws. Users may not copy, modify, or distribute our proprietary technology without written permission.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Termination</h2>
              <p className="text-gray-600 mb-6">
                Either party may terminate this agreement at any time. Upon termination, your access to the platform will be revoked, but you remain responsible for any outstanding payments. Data retention follows our Privacy Policy.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Governing Law</h2>
              <p className="text-gray-600 mb-6">
                These terms are governed by the laws of Delaware, United States. Any disputes will be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Information</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700">
                  For questions about these Terms of Service, please contact us:<br />
                  <strong>Email:</strong> legal@consulting19.com<br />
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

export default TermsPage;
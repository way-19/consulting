import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card } from '../lib/ui';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Terms of Service - Consulting19</title>
        <meta name="description" content="Consulting19 terms of service and conditions of use. Rules and conditions you must follow when using our platform." />
      </Helmet>

      <Navbar />

      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Terms and conditions governing your use of our platform.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card>
          <Card.Body className="prose prose-lg max-w-none text-gray-700">
            <h2>Introduction</h2>
            <p>
              These Terms of Service ("Terms") govern your use of the Consulting19 website and services. By visiting our website or using our services, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our services.
            </p>

            <h2>Service Description</h2>
            <p>
              Consulting19 is a platform that provides international business consulting services. Our services include:
            </p>
            <ul>
              <li>Company formation consulting</li>
              <li>Tax optimization advisory</li>
              <li>Visa and residency consulting</li>
              <li>Banking solutions</li>
              <li>Legal compliance advisory</li>
              <li>Asset protection strategies</li>
              <li>Investment advisory</li>
              <li>Market research</li>
              <li>AI-powered business recommendations</li>
              <li>Expert consultant matching</li>
            </ul>

            <h2>User Accounts</h2>
            <p>
              To use some of our services, you may need to create an account. When creating an account:
            </p>
            <ul>
              <li>You must provide accurate, current, and complete information</li>
              <li>You are responsible for maintaining account security</li>
              <li>You are responsible for all activities under your account</li>
              <li>You must not share your account credentials with others</li>
              <li>You must notify us immediately of any suspicious activity</li>
              <li>You must be at least 18 years old to create an account</li>
            </ul>

            <h2>Acceptable Use</h2>
            <p>
              When using our services, you must comply with the following rules:
            </p>
            <ul>
              <li>Act in accordance with all applicable laws and regulations</li>
              <li>Not violate the rights of others</li>
              <li>Not provide misleading or false information</li>
              <li>Not abuse or harm the system</li>
              <li>Not send spam or unwanted content</li>
              <li>Not violate intellectual property rights</li>
              <li>Not engage in illegal activities</li>
              <li>Not interfere with the proper functioning of our services</li>
              <li>Not attempt to gain unauthorized access to our systems</li>
            </ul>

            <h2>Consulting Services</h2>
            <p>
              Our consulting services are provided through qualified professionals in our network:
            </p>
            <ul>
              <li>All consultants are vetted and qualified in their respective jurisdictions</li>
              <li>Services are provided based on current laws and regulations</li>
              <li>We do not guarantee specific outcomes or results</li>
              <li>You are responsible for making final decisions based on our advice</li>
              <li>Additional fees may apply for specialized services</li>
              <li>Service timelines are estimates and may vary</li>
            </ul>

            <h2>Payment and Billing</h2>
            <p>
              For paid services:
            </p>
            <ul>
              <li>All fees are clearly stated and require your approval</li>
              <li>Payments are processed through secure payment processors</li>
              <li>Refund policies may vary by service type</li>
              <li>Unpaid services may be suspended</li>
              <li>Price changes will be communicated in advance</li>
              <li>You are responsible for all applicable taxes</li>
              <li>Late payment fees may apply</li>
              <li>We reserve the right to change pricing with notice</li>
            </ul>

            <h2>Intellectual Property</h2>
            <p>
              All content, design, logos, trademarks, and other intellectual property elements related to our website and services belong to Consulting19 and are protected by copyright laws. You may not copy, distribute, or use this content for commercial purposes without permission.
            </p>

            <h2>Privacy</h2>
            <p>
              The collection, use, and protection of your personal data is detailed in our Privacy Policy. By accepting these Terms, you also agree to our Privacy Policy.
            </p>

            <h2>AI Services and Recommendations</h2>
            <p>
              Our AI-powered services and recommendations:
            </p>
            <ul>
              <li>Are provided for informational purposes only</li>
              <li>Should not be considered as professional advice without human expert validation</li>
              <li>May not be 100% accurate and should be verified</li>
              <li>Are continuously improved but may contain limitations</li>
              <li>Require human expert consultation for final decisions</li>
            </ul>

            <h2>Service Denial</h2>
            <p>
              We reserve the right to refuse service in the following situations:
            </p>
            <ul>
              <li>Users who violate these Terms</li>
              <li>Individuals or entities engaged in illegal activities</li>
              <li>Customers who provide false or incomplete information</li>
              <li>Situations that may negatively affect our service quality</li>
              <li>High-risk jurisdictions or sanctioned entities</li>
              <li>Requests that violate applicable laws or regulations</li>
            </ul>

            <h2>Limitation of Liability</h2>
            <p>
              Consulting19 does not guarantee that our services will be uninterrupted, error-free, or secure. We are not liable for direct or indirect damages that may arise from the use of our services. Our liability is limited to the amount you paid for the service.
            </p>

            <h2>Disclaimers</h2>
            <p>
              Our services are provided "as is" and "as available." We make no warranties, express or implied, regarding:
            </p>
            <ul>
              <li>The accuracy or completeness of information provided</li>
              <li>The availability or reliability of our services</li>
              <li>The success of any business formation or consulting advice</li>
              <li>Compliance with changing laws and regulations</li>
              <li>Third-party services or recommendations</li>
            </ul>

            <h2>Service Changes</h2>
            <p>
              We reserve the right to modify, suspend, or terminate our services without prior notice. We will try to provide advance notice for significant changes when possible.
            </p>

            <h2>Changes to Terms</h2>
            <p>
              We may update these Terms of Service from time to time. Changes become effective when posted on our website. We may send email notifications for significant changes.
            </p>

            <h2>Termination</h2>
            <p>
              You may terminate this agreement at any time. We may suspend or terminate your account if you violate these Terms. Upon termination, your right to use our services ceases immediately.
            </p>

            <h2>Governing Law</h2>
            <p>
              These Terms are governed by the laws of the United States. Any disputes will be resolved in the courts of the United States.
            </p>

            <h2>Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable, the remaining provisions will continue to be valid and enforceable.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <p className="mb-2"><strong>Email:</strong> legal@consulting19.com</p>
              <p className="mb-2"><strong>Address:</strong> 5830 E 2ND St 7000 WY, United States</p>
              <p><strong>Support:</strong> support@consulting19.com</p>
            </div>
            <p className="text-sm text-gray-500 mt-6">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </Card.Body>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default TermsPage;
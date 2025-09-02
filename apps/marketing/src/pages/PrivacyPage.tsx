import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card } from '../lib/ui';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Privacy Policy - Consulting19</title>
        <meta name="description" content="Learn about Consulting19's privacy policy. How we collect, use, and protect your data." />
      </Helmet>

      <Navbar />

      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Your privacy and data security are our top priorities.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card>
          <Card.Body className="prose prose-lg max-w-none text-gray-700">
            <h2>Introduction</h2>
            <p>
              At Consulting19, we are committed to protecting your privacy when you use our website and services. This Privacy Policy explains how we collect, use, process, and protect your personal information. By using our services, you agree to the practices described in this policy.
            </p>

            <h2>Information We Collect</h2>
            <p>
              We collect various types of information to provide and improve our services:
            </p>
            <ul>
              <li><strong>Personal Identifiers:</strong> Your name, email address, phone number, company name, country, and other contact information that directly identifies you. This information is typically provided when creating an account, requesting services, or contacting us.</li>
              <li><strong>Usage Data:</strong> Information about how you interact with our website, including your IP address, browser type, pages visited, time spent on our site, and referring URLs.</li>
              <li><strong>Financial Information:</strong> Billing addresses and payment information necessary for processing transactions. Sensitive financial data like credit card numbers are not stored directly by us but processed through secure payment processors.</li>
              <li><strong>Communication Data:</strong> Records of your communications with us, including support tickets, chat messages, and consultation notes.</li>
              <li><strong>Business Information:</strong> Details about your business needs, goals, and requirements for our consulting services.</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>
              We use the collected information for the following purposes:
            </p>
            <ul>
              <li>Provide, operate, and maintain our services</li>
              <li>Manage your account and provide technical support</li>
              <li>Respond to your questions and requests</li>
              <li>Improve our services and develop new features</li>
              <li>Send you marketing and promotional materials (with your consent)</li>
              <li>Comply with legal obligations and prevent fraud</li>
              <li>Analyze website usage and track trends</li>
              <li>Connect you with appropriate consultants and experts</li>
              <li>Process payments and manage billing</li>
            </ul>

            <h2>How We Share Your Information</h2>
            <p>
              We may share your personal information with third parties in the following circumstances:
            </p>
            <ul>
              <li><strong>Service Providers:</strong> Third-party companies that help us provide our services (e.g., payment processors, hosting services, analytics providers).</li>
              <li><strong>Business Partners:</strong> Qualified consultants and experts in our network who provide services to you.</li>
              <li><strong>Legal Requirements:</strong> To comply with legal obligations, respond to subpoenas, or comply with legal processes.</li>
              <li><strong>Business Transfers:</strong> In case of mergers, acquisitions, or asset sales.</li>
              <li><strong>With Your Consent:</strong> Other situations with your explicit consent.</li>
            </ul>

            <h2>Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy or as legally required. When we no longer need your information, we securely delete or anonymize it.
            </p>

            <h2>Your Rights</h2>
            <p>
              You have certain rights regarding your personal information:
            </p>
            <ul>
              <li><strong>Right to Access:</strong> Request access to personal information we hold about you.</li>
              <li><strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete personal information.</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your personal information under certain conditions.</li>
              <li><strong>Right to Restrict Processing:</strong> Request restriction of processing your personal information under certain conditions.</li>
              <li><strong>Right to Data Portability:</strong> Receive your personal information in a structured, commonly used, and machine-readable format.</li>
              <li><strong>Right to Object:</strong> Object to the processing of your personal information.</li>
              <li><strong>Right to Withdraw Consent:</strong> Withdraw your consent at any time where processing is based on consent.</li>
            </ul>
            <p>
              To exercise these rights, please contact us using the information provided below.
            </p>

            <h2>Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission over the internet or electronic storage is 100% secure. We use industry-standard encryption and security protocols to protect your data.
            </p>

            <h2>International Data Transfers</h2>
            <p>
              Your information may be stored and processed on servers located outside your country of residence. We take necessary steps to ensure your data is protected in accordance with this Privacy Policy and applicable data protection laws.
            </p>

            <h2>Children's Privacy</h2>
            <p>
              Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that we have collected such information, we will take steps to delete it.
            </p>

            <h2>Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your experience on our website. For detailed information about our cookie usage, please refer to our Cookie Policy.
            </p>

            <h2>Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. When we make changes, we will post the updated policy on our website and notify you of any significant changes. Changes become effective when posted.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <p className="mb-2"><strong>Email:</strong> privacy@consulting19.com</p>
              <p className="mb-2"><strong>Address:</strong> 5830 E 2ND St 7000 WY, United States</p>
              <p><strong>Data Protection Officer:</strong> dpo@consulting19.com</p>
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

export default PrivacyPage;
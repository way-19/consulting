import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card } from '../lib/ui';

const CookiePolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Cookie Policy - Consulting19</title>
        <meta name="description" content="Consulting19's cookie usage policy. Learn about the cookies we use on our website and their purposes." />
      </Helmet>

      <Navbar />

      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Information about the cookies we use on our website and their purposes.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card>
          <Card.Body className="prose prose-lg max-w-none text-gray-700">
            <h2>What Are Cookies?</h2>
            <p>
              Cookies are small text files that websites store on users' devices (computers, tablets, phones). These files help websites function better and improve user experience. Cookies do not contain personally identifiable information and are harmless.
            </p>

            <h2>Why We Use Cookies</h2>
            <p>
              At Consulting19, we use cookies for the following purposes:
            </p>
            <ul>
              <li><strong>Essential Functionality:</strong> Cookies necessary for our website to function properly</li>
              <li><strong>User Experience:</strong> Remember your preferences to provide a more personalized experience</li>
              <li><strong>Analytics:</strong> Analyze website usage to improve our services</li>
              <li><strong>Security:</strong> Ensure account security and prevent fraud</li>
              <li><strong>Marketing:</strong> Show you more relevant content and advertisements</li>
            </ul>

            <h2>Types of Cookies We Use</h2>
            
            <h3>1. Essential Cookies</h3>
            <p>
              These cookies are necessary for our website to perform basic functions and cannot be disabled:
            </p>
            <ul>
              <li><strong>Session Cookies:</strong> Maintain your login status and session information</li>
              <li><strong>Security Cookies:</strong> Ensure account security and prevent attacks</li>
              <li><strong>Load Balancing Cookies:</strong> Distribute traffic across servers</li>
              <li><strong>Authentication Cookies:</strong> Verify your identity and access permissions</li>
            </ul>

            <h3>2. Functional Cookies</h3>
            <p>
              These cookies enable enhanced features and personalization of the website:
            </p>
            <ul>
              <li><strong>Language Preference:</strong> Remember your selected language</li>
              <li><strong>Theme Preference:</strong> Store your light/dark theme choice</li>
              <li><strong>Form Data:</strong> Temporarily store form information you've filled out</li>
              <li><strong>Navigation Preferences:</strong> Remember your menu and page preferences</li>
              <li><strong>AI Assistant Settings:</strong> Store your AI chat preferences and history</li>
            </ul>

            <h3>3. Analytics Cookies</h3>
            <p>
              Help us understand website performance and usage:
            </p>
            <ul>
              <li><strong>Google Analytics:</strong> Visitor statistics and behavior analysis</li>
              <li><strong>Page Views:</strong> Identify most popular pages and content</li>
              <li><strong>User Journey:</strong> Analyze how you navigate through the site</li>
              <li><strong>Performance Metrics:</strong> Page load times and error rates</li>
              <li><strong>Conversion Tracking:</strong> Measure the effectiveness of our services</li>
            </ul>

            <h3>4. Marketing Cookies</h3>
            <p>
              Used to show you more relevant advertisements and content:
            </p>
            <ul>
              <li><strong>Retargeting:</strong> Show relevant ads based on pages you've visited</li>
              <li><strong>Social Media:</strong> Integration with social media platforms</li>
              <li><strong>Email Marketing:</strong> Measure the effectiveness of email campaigns</li>
              <li><strong>Conversion Tracking:</strong> Measure the success of marketing campaigns</li>
              <li><strong>Personalization:</strong> Customize content based on your interests</li>
            </ul>

            <h2>Third-Party Cookies</h2>
            <p>
              Our website may also use cookies from the following third-party services:
            </p>
            <ul>
              <li><strong>Google Analytics:</strong> For website analytics</li>
              <li><strong>Google Ads:</strong> For advertising campaigns</li>
              <li><strong>Facebook Pixel:</strong> For social media advertising</li>
              <li><strong>LinkedIn Insight:</strong> For professional network advertising</li>
              <li><strong>Hotjar:</strong> For user experience analysis</li>
              <li><strong>Intercom:</strong> For customer support system</li>
              <li><strong>Supabase:</strong> For backend services and authentication</li>
              <li><strong>Stripe:</strong> For payment processing</li>
            </ul>

            <h2>Cookie Management</h2>
            <p>
              You can manage your cookie preferences in the following ways:
            </p>

            <h3>Browser Settings</h3>
            <p>
              Most web browsers automatically accept cookies, but you can modify your browser settings to:
            </p>
            <ul>
              <li>Completely disable cookies</li>
              <li>Receive warnings before cookies are stored</li>
              <li>Delete existing cookies</li>
              <li>Block cookies from specific websites</li>
              <li>Set different rules for different types of cookies</li>
            </ul>

            <h3>Cookie Preference Center</h3>
            <p>
              You can manage your cookie preferences through the "Cookie Settings" link at the bottom of our website. Through this center, you can:
            </p>
            <ul>
              <li>Turn cookie categories on and off individually</li>
              <li>See which cookies are currently active</li>
              <li>Change your preferences at any time</li>
              <li>View detailed information about each cookie</li>
            </ul>

            <h2>Cookie Duration</h2>
            <p>
              Our cookies are stored for different periods:
            </p>
            <ul>
              <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
              <li><strong>Persistent Cookies:</strong> Stored for a specific period (usually 1-2 years)</li>
              <li><strong>Security Cookies:</strong> Active during your session</li>
              <li><strong>Analytics Cookies:</strong> May be stored for up to 2 years</li>
              <li><strong>Marketing Cookies:</strong> Typically stored for 30-90 days</li>
            </ul>

            <h2>Effects of Disabling Cookies</h2>
            <p>
              If you disable cookies:
            </p>
            <ul>
              <li>Some website features may not work properly</li>
              <li>You may not receive a personalized experience</li>
              <li>You may need to log in again each visit</li>
              <li>Your preferences may not be remembered</li>
              <li>Some forms and features may be unavailable</li>
              <li>AI assistant functionality may be limited</li>
            </ul>

            <h2>Mobile Applications</h2>
            <p>
              In our mobile applications, we may use similar technologies instead of cookies:
            </p>
            <ul>
              <li><strong>App Data:</strong> Store your preferences and settings</li>
              <li><strong>Device Identifiers:</strong> For security and analytics purposes</li>
              <li><strong>Push Notifications:</strong> To send you important updates</li>
              <li><strong>Local Storage:</strong> Cache data for better performance</li>
            </ul>

            <h2>International Transfers</h2>
            <p>
              Data collected through cookies may be transferred to countries where our service providers are located. These transfers are conducted with appropriate security measures.
            </p>

            <h2>Updates</h2>
            <p>
              This Cookie Policy is regularly reviewed and updated as necessary. Significant changes will be announced on our website.
            </p>

            <h2>Your Choices</h2>
            <p>
              You have several options for managing cookies:
            </p>
            <ul>
              <li>Accept all cookies for the best experience</li>
              <li>Accept only essential cookies</li>
              <li>Customize your cookie preferences</li>
              <li>Reject all non-essential cookies</li>
            </ul>

            <h2>Contact Us</h2>
            <p>
              If you have questions about our cookie usage:
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

export default CookiePolicyPage;
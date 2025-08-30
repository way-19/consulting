import React from 'react';
import { Cookie, Settings, Eye, Shield } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';

const CookiePage = () => {
  const cookieTypes = [
    {
      icon: Shield,
      title: 'Essential Cookies',
      description: 'Required for basic website functionality',
      required: true,
    },
    {
      icon: Eye,
      title: 'Analytics Cookies',
      description: 'Help us understand how visitors use our site',
      required: false,
    },
    {
      icon: Settings,
      title: 'Functional Cookies',
      description: 'Enable enhanced features and personalization',
      required: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-0">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Cookie Policy
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Learn about how we use cookies to improve your experience on our platform.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Cookie Types */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {cookieTypes.map((type, index) => (
            <Card key={index} className="text-center">
              <Card.Body>
                <type.icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">{type.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{type.description}</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  type.required ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {type.required ? 'Required' : 'Optional'}
                </span>
              </Card.Body>
            </Card>
          ))}
        </div>

        {/* Cookie Policy Content */}
        <Card>
          <Card.Body>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                <strong>Last updated:</strong> January 2025
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">What Are Cookies?</h2>
              <p className="text-gray-600 mb-6">
                Cookies are small text files that are stored on your device when you visit our website. 
                They help us provide you with a better experience by remembering your preferences and 
                analyzing how you use our platform.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Cookies</h2>
              <p className="text-gray-600 mb-4">We use cookies for several purposes:</p>
              <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for basic website functionality, security, and user authentication</li>
                <li><strong>Analytics Cookies:</strong> Help us understand visitor behavior and improve our services</li>
                <li><strong>Functional Cookies:</strong> Remember your preferences and provide personalized features</li>
                <li><strong>Performance Cookies:</strong> Monitor website performance and optimize user experience</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookie Categories</h2>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Essential Cookies</h3>
              <p className="text-gray-600 mb-4">
                These cookies are necessary for the website to function properly. They enable core functionality 
                such as security, network management, and accessibility. You cannot opt-out of these cookies.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-3">Analytics Cookies</h3>
              <p className="text-gray-600 mb-4">
                We use analytics cookies to understand how visitors interact with our website. This information 
                helps us improve our services and user experience. These cookies collect anonymous data about 
                page visits, time spent on site, and user interactions.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-3">Functional Cookies</h3>
              <p className="text-gray-600 mb-6">
                Functional cookies enable enhanced features and personalization. They remember your language 
                preferences, login status, and other customization settings to provide a more personalized experience.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">Managing Your Cookie Preferences</h2>
              <p className="text-gray-600 mb-4">
                You can control and manage cookies in several ways:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1">
                <li>Use our cookie preference center to opt-out of non-essential cookies</li>
                <li>Configure your browser settings to block or delete cookies</li>
                <li>Use browser extensions that manage cookie preferences</li>
                <li>Clear your browser's cookie storage periodically</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Cookies</h2>
              <p className="text-gray-600 mb-6">
                Some cookies are set by third-party services that appear on our pages. We use reputable 
                third-party services for analytics, customer support, and payment processing. These services 
                may set their own cookies to provide their functionality.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">Updates to This Policy</h2>
              <p className="text-gray-600 mb-6">
                We may update this Cookie Policy from time to time to reflect changes in our practices 
                or applicable laws. We will notify you of any material changes by posting the updated 
                policy on our website.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  If you have questions about our use of cookies, please contact us:<br />
                  <strong>Email:</strong> privacy@consulting19.com<br />
                  <strong>Address:</strong> 5830 E 2nd St, STE 7000, Casper WY 82609
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Cookie Settings */}
        <Card className="mt-8">
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">Cookie Preferences</h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              {cookieTypes.map((type, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <type.icon className="w-6 h-6 text-blue-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">{type.title}</h3>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {type.required ? (
                      <span className="text-sm text-gray-500">Always Active</span>
                    ) : (
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-4">
              <Button>Save Preferences</Button>
              <Button variant="outline">Accept All</Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default CookiePage;
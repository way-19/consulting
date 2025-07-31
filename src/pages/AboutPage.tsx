import React from 'react';
import { Link } from 'react-router-dom';

function AboutPage() {
  const features = [
    {
      icon: '🤖',
      title: 'Real-Time Analysis',
      description: 'Live regulatory updates',
      color: 'text-blue-500'
    },
    {
      icon: '🎯',
      title: 'Precision Matching',
      description: '98.7% accuracy rate',
      color: 'text-green-500'
    },
    {
      icon: '🌍',
      title: 'Global Intelligence',
      description: '8 strategic jurisdictions',
      color: 'text-purple-500'
    }
  ];

  const stats = [
    { number: '1,247+', label: 'Successful Matches' },
    { number: '98.7%', label: 'Success Rate' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-purple-700 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
            <span className="text-sm font-medium">🔮 AI Intelligence Preview</span>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Experience the Future of <span className="text-blue-200">Business Consulting</span>
          </h1>
          
          <p className="text-xl text-purple-100 mb-8 max-w-4xl mx-auto">
            Our AI assistant combines global regulatory knowledge with real-time market insights to provide personalized recommendations for your international business needs.
          </p>
        </div>
      </section>

      {/* Revolutionary AI Oracle Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="text-6xl mb-6">🔮</div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Revolutionary AI Oracle
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              <strong>Predicts Your Perfect Jurisdiction</strong>
            </p>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto mb-12">
              Our advanced AI analyzes 847 regulatory factors across 8 strategic jurisdictions, processing real-time market data to deliver personalized recommendations with 98.7% accuracy. Experience the future of international business consulting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className={`text-4xl mb-4 ${feature.color}`}>{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mb-8">
            <div className="flex justify-center space-x-8 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
            
            <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold px-8 py-4 rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
              🔮 Discover Your Perfect Jurisdiction →
            </button>
          </div>

          <div className="text-center">
            <span className="text-orange-500 font-semibold">98.7% Accurate</span>
          </div>
        </div>
      </section>

      {/* Intelligent Business Guidance */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Intelligent Business Guidance
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI assistant combines global regulatory knowledge with real-time market insights to provide personalized recommendations for your international business needs.
            </p>
          </div>

          {/* Demo Chat Interface */}
          <div className="max-w-2xl mx-auto bg-gray-50 rounded-2xl p-8">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  AI
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm max-w-md">
                  <p className="text-gray-800">I need to form a company for my tech startup with international operations.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 justify-end">
                <div className="bg-blue-500 text-white rounded-lg p-4 shadow-sm max-w-md">
                  <p>Based on your tech startup profile, I recommend Georgia for the optimal jurisdiction with:</p>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• Residency program and digital-friendly regulations</li>
                    <li>• Success rate: 94%</li>
                  </ul>
                </div>
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  🤖
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  AI
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm max-w-md">
                  <p className="text-gray-800">What about tax implications?</p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link
                to="/services"
                className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors inline-block"
              >
                Try AI Assistant Now →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">AI-Powered Insights</h3>
              <p className="text-gray-600 text-sm">Advanced algorithms analyze regulatory factors for optimal recommendations.</p>
            </div>
            
            <div className="text-center">  
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Legal Compliance</h3>
              <p className="text-gray-600 text-sm">Every AI response is reviewed by legal experts for complete compliance assurance.</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Multilingual Support</h3>
              <p className="text-gray-600 text-sm">Communicate seamlessly in English, Turkish, Portuguese, or Spanish.</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Instant Responses</h3>
              <p className="text-gray-600 text-sm">Get immediate answers with human consultant backup within 47 minutes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Experience AI-Enhanced Consulting?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of successful businesses using our revolutionary AI platform.
          </p>
          <Link 
            to="/services"
            className="inline-flex items-center bg-white text-purple-600 font-bold px-8 py-4 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Start Your Journey
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
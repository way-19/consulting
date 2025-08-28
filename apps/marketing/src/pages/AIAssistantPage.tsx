import React, { useState } from 'react';
import { Send, Sparkles, Bot, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, Button } from '@consulting19/ui';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const AIAssistantPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI Oracle assistant. I can help you find the best jurisdiction and services for your international business expansion. What type of business are you looking to establish?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time before typing starts
    const thinkingDelay = 500; // milliseconds
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage.content); // Use userMessage.content for response generation
      const typingSpeed = 50; // milliseconds per character
      const typingDelay = aiResponse.length * typingSpeed;

      // Simulate typing
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: aiResponse,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      }, typingDelay);
    }, thinkingDelay);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('tech') || input.includes('software') || input.includes('digital')) {
      return 'For a tech/software business, I recommend considering Estonia or Singapore. Estonia offers 100% online e-Residency with EU access, while Singapore provides excellent infrastructure and serves as the gateway to Asian markets. Both have favorable tax structures for digital businesses. Would you like me to provide more details about either option?';
    }
    
    if (input.includes('ecommerce') || input.includes('online') || input.includes('retail')) {
      return 'For e-commerce businesses, I suggest looking at Malta or Estonia for EU market access, or Singapore for Asian markets. These jurisdictions offer favorable tax rates and excellent digital infrastructure. Malta provides 5% effective corporate tax rate with full EU access. Which region interests you most?';
    }
    
    if (input.includes('consulting') || input.includes('service')) {
      return 'For consulting or service-based businesses, UAE (0% tax in free zones), Georgia (1% small business tax), or Estonia (deferred taxation) could be excellent choices. The key factors are your client base location and desired tax efficiency. Where are most of your clients located?';
    }

    if (input.includes('crypto') || input.includes('blockchain')) {
      return 'For cryptocurrency and blockchain ventures, Malta, Estonia, and UAE offer progressive regulatory frameworks. Malta is particularly crypto-friendly with clear regulations, while UAE provides tax advantages. Estonia offers digital innovation support. Which aspect is most important to you - regulatory clarity or tax optimization?';
    }

    return 'Thank you for that information! Based on what you\'ve shared, I\'d recommend exploring a few options. To provide more targeted recommendations, could you tell me: 1) Your target market/customers, 2) Expected annual revenue, and 3) Your priority (tax optimization, market access, or ease of setup)? This will help me suggest the perfect jurisdiction for your needs.';
  };

  const quickQuestions = [
    'I want to start a tech company',
    'Looking for tax optimization',
    'Need EU market access',
    'Interested in crypto business',
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center bg-white/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-yellow-300 mr-2" />
            <span className="text-sm font-medium">AI-Powered Intelligence</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            AI Oracle Assistant
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Get instant, personalized recommendations for your international business expansion. 
            Our AI analyzes your needs and suggests the perfect jurisdiction and services.
          </p>
        </div>
      </section>

      {/* Chat Interface */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="h-[600px] flex flex-col">
          <Card.Header>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">AI Oracle</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 font-medium">Online</span>
                  </div>
                </div>
              </div>
            </div>
          </Card.Header>

          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                  }`}>
                    {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="px-6 py-4 border-t border-gray-100">
              <div className="text-sm text-gray-600 mb-3">Quick start:</div>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInputValue(question)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-2 rounded-full transition-colors duration-200"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <Card.Footer className="bg-white">
            <div className="flex space-x-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me about jurisdictions, tax rates, or business setup..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                icon={Send}
                size="md"
              >
                Send
              </Button>
            </div>
          </Card.Footer>
        </Card>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <Card className="max-w-md mx-auto">
            <Card.Body>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-gray-600 mb-6">
                Create your free account to connect with expert advisors and begin your international expansion.
              </p>
              <Link to="/register">
                <Button size="lg" className="w-full" icon={ArrowRight} iconPosition="right">
                  Create Free Account
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default AIAssistantPage;
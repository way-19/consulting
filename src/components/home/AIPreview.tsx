import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Bot, 
  User, 
  Zap, 
  Shield, 
  Globe, 
  Brain,
  Sparkles,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const AIPreview: React.FC = () => {
  const [currentDemo, setCurrentDemo] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const demoConversations = [
    {
      title: "Smart Country Matching",
      subtitle: "AI analyzes your business profile for optimal jurisdiction selection",
      messages: [
        { type: 'user', text: "I need to form a company for my tech startup with international clients", delay: 0 },
        { type: 'ai', text: "Based on your tech startup profile, I recommend Estonia for its e-Residency program and digital-friendly regulations. Success rate: 94%", delay: 1000 },
        { type: 'user', text: "What about tax implications?", delay: 2000 },
        { type: 'ai', text: "Estonia offers 0% corporate tax on retained earnings. I'll connect you with our Estonia specialist for detailed tax optimization strategies.", delay: 3000 }
      ]
    },
    {
      title: "Real-time Regulatory Updates",
      subtitle: "Stay informed with instant regulatory changes and opportunities",
      messages: [
        { type: 'user', text: "Any recent changes in Malta's company formation requirements?", delay: 0 },
        { type: 'ai', text: "Yes! Malta introduced streamlined digital incorporation this month. Processing time reduced from 14 to 7 days. 12 clients already benefited.", delay: 1000 },
        { type: 'user', text: "That's perfect timing!", delay: 2000 },
        { type: 'ai', text: "I'll schedule a consultation with our Malta expert within the next hour for the new expedited process.", delay: 3000 }
      ]
    },
    {
      title: "Cross-border Opportunities",
      subtitle: "Discover expansion possibilities with AI-powered market analysis",
      messages: [
        { type: 'user', text: "I have a company in Georgia, considering expansion", delay: 0 },
        { type: 'ai', text: "Excellent! Georgia companies benefit from expanding to Portugal for EU market access. 89% success rate for Georgia-Portugal expansion.", delay: 1000 },
        { type: 'user', text: "What's the success rate for my industry?", delay: 2000 },
        { type: 'ai', text: "For your industry: 94% success rate. I can connect you with consultants from both countries for coordinated planning.", delay: 3000 }
      ]
    }
  ];

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Advanced algorithms analyze global regulations and market conditions in real-time"
    },
    {
      icon: Shield,
      title: "Legal Oversight",
      description: "Every AI response is reviewed by legal experts for complete compliance assurance"
    },
    {
      icon: Globe,
      title: "Multilingual Support",
      description: "Communicate seamlessly in English, Turkish, Portuguese, or Spanish"
    },
    {
      icon: Zap,
      title: "Instant Responses",
      description: "Get immediate answers with human consultant backup within 47 minutes"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDemo((prev) => (prev + 1) % demoConversations.length);
      setCurrentMessageIndex(0);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const conversation = demoConversations[currentDemo];
    if (currentMessageIndex < conversation.messages.length) {
      const timer = setTimeout(() => {
        setCurrentMessageIndex(prev => prev + 1);
      }, conversation.messages[currentMessageIndex].delay + 1500);

      return () => clearTimeout(timer);
    }
  }, [currentDemo, currentMessageIndex]);

  return (
    <section className="section-padding bg-gradient-to-br from-gray-50 via-white to-primary-50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200 rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-primary-600 mr-2" />
            <span className="text-primary-700 text-sm font-medium">AI Intelligence Preview</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Experience the Future of 
            <span className="text-gradient"> Business Consulting</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI assistant combines global regulatory knowledge with real-time market insights 
            to provide personalized recommendations for your international business needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* AI Chat Demo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg">
                      {demoConversations[currentDemo].title}
                    </h3>
                    <p className="text-white/80 text-sm">
                      {demoConversations[currentDemo].subtitle}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-white/80 text-sm">Online</span>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentDemo}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {demoConversations[currentDemo].messages.slice(0, currentMessageIndex).map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-start space-x-3 max-w-xs ${
                          message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                        }`}>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            message.type === 'user' 
                              ? 'bg-primary-600' 
                              : 'bg-gradient-to-r from-accent-500 to-accent-600'
                          }`}>
                            {message.type === 'user' ? (
                              <User className="h-5 w-5 text-white" />
                            ) : (
                              <Bot className="h-5 w-5 text-white" />
                            )}
                          </div>
                          <div className={`rounded-2xl px-4 py-3 shadow-sm ${
                            message.type === 'user'
                              ? 'bg-primary-600 text-white'
                              : 'bg-white text-gray-900 border border-gray-200'
                          }`}>
                            <p className="text-sm leading-relaxed">{message.text}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* Typing Indicator */}
                {currentMessageIndex < demoConversations[currentDemo].messages.length && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full flex items-center justify-center">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                      <div className="bg-white rounded-2xl px-4 py-3 border border-gray-200">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Chat Input */}
              <div className="border-t border-gray-200 p-4 bg-white">
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    placeholder="Ask about international business formation..."
                    className="flex-1 border border-gray-300 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    disabled
                  />
                  <button className="bg-primary-600 text-white rounded-full p-3 hover:bg-primary-700 transition-colors shadow-lg">
                    <MessageCircle className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Demo Navigation */}
            <div className="flex justify-center mt-6 space-x-2">
              {demoConversations.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentDemo(index);
                    setCurrentMessageIndex(0);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentDemo 
                      ? 'bg-primary-600 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Intelligent Business Guidance
              </h3>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Our AI assistant combines global regulatory knowledge with real-time market insights 
                to provide personalized recommendations for your international business needs.
              </p>
            </div>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ x: 5 }}
                  className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-gray-900 font-bold mb-2 group-hover:text-primary-600 transition-colors duration-300">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              ))}
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="pt-6"
            >
              <button className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center group">
                Try AI Assistant Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AIPreview;
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, MessageCircle, Sparkles } from 'lucide-react';

const FloatingAIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <>
      {/* Floating AI Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-16 h-16 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-full shadow-2xl hover:shadow-accent-500/25 transition-all duration-300 flex items-center justify-center group relative overflow-hidden"
        >
          {/* Pulse Animation */}
          <div className="absolute inset-0 bg-accent-400 rounded-full animate-ping opacity-20"></div>
          
          {/* Icon */}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? (
              <X className="h-7 w-7" />
            ) : (
              <Bot className="h-7 w-7" />
            )}
          </motion.div>

          {/* Notification Badge */}
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            1
          </div>
        </motion.button>

        {/* Tooltip */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute right-20 top-1/2 transform -translate-y-1/2 bg-dark-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg"
            >
              AI Assistant
              <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-2 h-2 bg-dark-800 rotate-45"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* AI Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-40 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-accent-500 to-accent-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold">AI Assistant</h3>
                    <p className="text-xs text-white/80">Online • Ready to help</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                  >
                    <div className="w-3 h-0.5 bg-white"></div>
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Chat Content */}
            {!isMinimized && (
              <div className="flex flex-col h-[calc(100%-80px)]">
                {/* Messages */}
                <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50">
                  {/* Welcome Message */}
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-white rounded-2xl px-4 py-3 shadow-sm max-w-xs">
                      <p className="text-sm text-gray-800">
                        👋 Hi! I'm your AI business consultant. I can help you with:
                      </p>
                      <div className="mt-2 space-y-1 text-xs text-gray-600">
                        <div className="flex items-center">
                          <Sparkles className="h-3 w-3 mr-1 text-accent-500" />
                          Country recommendations
                        </div>
                        <div className="flex items-center">
                          <Sparkles className="h-3 w-3 mr-1 text-accent-500" />
                          Tax optimization
                        </div>
                        <div className="flex items-center">
                          <Sparkles className="h-3 w-3 mr-1 text-accent-500" />
                          Legal compliance
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 text-center">Quick Actions</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="bg-white border border-gray-200 rounded-lg p-3 text-xs text-gray-700 hover:bg-gray-50 transition-colors">
                        🇬🇪 Georgia Setup
                      </button>
                      <button className="bg-white border border-gray-200 rounded-lg p-3 text-xs text-gray-700 hover:bg-gray-50 transition-colors">
                        🇺🇸 USA LLC
                      </button>
                      <button className="bg-white border border-gray-200 rounded-lg p-3 text-xs text-gray-700 hover:bg-gray-50 transition-colors">
                        💰 Tax Planning
                      </button>
                      <button className="bg-white border border-gray-200 rounded-lg p-3 text-xs text-gray-700 hover:bg-gray-50 transition-colors">
                        📋 Compliance
                      </button>
                    </div>
                  </div>
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Ask about international business..."
                      className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                    />
                    <button className="bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-full p-2 hover:from-accent-600 hover:to-accent-700 transition-all">
                      <MessageCircle className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Powered by AI • Legal review included
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingAIAssistant;
import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Minimize2, Maximize2, Mic, MicOff } from 'lucide-react';
import { useAuth } from '@consulting19/shared';

interface AIMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
  isMinimized: boolean;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ 
  isOpen, 
  onClose, 
  onMinimize, 
  isMinimized 
}) => {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: `Hello ${profile?.full_name || 'there'}! I'm your AI Oracle assistant. I can help you with business questions, explain processes, and guide you through your international expansion journey. How can I assist you today?`,
      timestamp: new Date(),
      suggestions: [
        'How do I upload documents?',
        'What are my next steps?',
        'Explain tax benefits',
        'Schedule a meeting'
      ]
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (content?: string) => {
    const messageContent = content || newMessage.trim();
    if (!messageContent) return;

    const startTime = Date.now();

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: messageContent,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Real AI response
    try {
      const response = await supabase.functions.invoke('ai-oracle-chat', {
        body: {
          message: messageContent,
          user_id: user?.id || 'anonymous',
          context: {
            page: 'client_dashboard',
            has_consultant: !!profile?.metadata?.assigned_consultant_id,
            user_role: 'client'
          },
          language: profile?.preferred_language || 'en'
        },
        headers: {
          'x-start-time': startTime.toString()
        }
      });

      if (response.error) {
        throw response.error;
      }

      const aiResponse: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.data.content,
        timestamp: new Date(),
        suggestions: response.data.suggestions
      };

      setMessages(prev => [...prev, aiResponse]);
      
    } catch (error) {
      console.error('AI response error:', error);
      
      // Fallback to local response
      const aiResponse = generateAIResponse(messageContent);
      setMessages(prev => [...prev, aiResponse]);
    }
    
    setIsTyping(false);
  };

  const generateAIResponse = (userMessage: string): AIMessage => {
    const lowerMessage = userMessage.toLowerCase();
    
    let response = '';
    let suggestions: string[] = [];

    if (lowerMessage.includes('document') || lowerMessage.includes('upload')) {
      response = 'To upload documents, go to the Documents or Accounting section. You can drag and drop files or click the upload button. Accepted formats are PDF, DOCX, XLSX, JPG, and PNG. Your consultant will review them within 2-3 business days.';
      suggestions = ['How to check document status?', 'What documents do I need?', 'Contact my consultant'];
    } else if (lowerMessage.includes('payment') || lowerMessage.includes('billing')) {
      response = 'For payments, visit the Billing section where you can view invoices and pay securely through Stripe. All payments are encrypted and you\'ll receive email confirmations. Need help with a specific payment?';
      suggestions = ['View pending payments', 'Download invoice', 'Payment methods'];
    } else if (lowerMessage.includes('meeting') || lowerMessage.includes('schedule')) {
      response = 'You can schedule meetings with your consultant in the Meetings section. Choose your preferred time slot and the system will handle the rest. Video meetings are conducted through secure links.';
      suggestions = ['Available time slots', 'Reschedule meeting', 'Meeting preparation'];
    } else if (lowerMessage.includes('task') || lowerMessage.includes('progress')) {
      response = 'Check your Tasks section to see assigned work and track progress. You can mark tasks as complete, ask questions, and view deadlines. Your consultant assigns tasks to guide your business expansion.';
      suggestions = ['View pending tasks', 'Task deadlines', 'Ask about a task'];
    } else if (lowerMessage.includes('consultant') || lowerMessage.includes('contact')) {
      response = 'You can message your consultant anytime through the Messages section. They typically respond within a few hours during business hours. For urgent matters, you can also schedule a meeting.';
      suggestions = ['Send message now', 'Schedule urgent meeting', 'Consultant availability'];
    } else {
      response = 'I\'m here to help with any questions about using the platform, understanding processes, or navigating your business expansion journey. What specific area would you like assistance with?';
      suggestions = ['Platform navigation', 'Business processes', 'Next steps', 'Contact support'];
    }

    return {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: response,
      timestamp: new Date(),
      suggestions
    };
  };

  const startVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = profile?.preferred_language === 'tr' ? 'tr-TR' : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setNewMessage(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Voice recognition not supported in this browser');
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-80 h-96'
    } md:w-96 md:h-[500px]`}>
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">AI Oracle Assistant</h3>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-blue-100">Online & Ready</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onMinimize}
              className="text-white/80 hover:text-white transition-colors"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs px-4 py-2 rounded-2xl ai-chat-bubble ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-900 border border-gray-200 shadow-sm'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs ${
                        message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-2 shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            {messages.length > 0 && messages[messages.length - 1].suggestions && (
              <div className="px-4 py-2 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {messages[messages.length - 1].suggestions!.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => sendMessage(suggestion)}
                      className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-end space-x-2">
                <div className="flex-1 relative">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Ask me anything about your business expansion..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={1}
                    style={{ minHeight: '36px', maxHeight: '100px' }}
                  />
                </div>
                
                <button
                  onClick={startVoiceRecognition}
                  disabled={isListening}
                  className={`p-2 rounded-xl transition-colors ${
                    isListening 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title="Voice input"
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                
                <button
                  onClick={() => sendMessage()}
                  disabled={!newMessage.trim() || isTyping}
                  className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <span>Press Enter to send, Shift+Enter for new line</span>
                <span className="flex items-center space-x-1">
                  <Bot className="w-3 h-3" />
                  <span>AI Oracle</span>
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;
import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { Button } from '@consulting19/ui';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const AIAssistantWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Merhaba! Ben AI Oracle asistanınızım. Uluslararası iş genişlemeniz için size yardımcı olabilirim. Hangi tür bir iş kurmak istiyorsunuz?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Auto-open for new users (only once)
  useEffect(() => {
    const hasSeenWidget = localStorage.getItem('ai-widget-seen');
    if (!hasSeenWidget) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem('ai-widget-seen', 'true');
      }, 3000); // 3 seconds after page load

      return () => clearTimeout(timer);
    }
  }, []);

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

    // Simulate AI thinking time
    const thinkingDelay = 800;
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage.content);
      const typingSpeed = 30; // milliseconds per character
      const typingDelay = aiResponse.length * typingSpeed;

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
    
    if (input.includes('teknoloji') || input.includes('yazılım') || input.includes('dijital')) {
      return 'Teknoloji/yazılım işi için Estonya veya Singapur öneriyorum. Estonya %100 online e-Residency ile AB erişimi sunarken, Singapur Asya pazarlarına geçit sağlıyor. Her ikisi de dijital işler için uygun vergi yapıları sunuyor. Hangi seçenek hakkında daha fazla bilgi istersiniz?';
    }
    
    if (input.includes('e-ticaret') || input.includes('online') || input.includes('perakende')) {
      return 'E-ticaret işleri için AB pazarı erişimi için Malta veya Estonya, Asya pazarları için Singapur öneriyorum. Malta %5 efektif kurumlar vergisi ile tam AB erişimi sağlıyor. Hangi bölge sizi daha çok ilgilendiriyor?';
    }
    
    if (input.includes('danışmanlık') || input.includes('hizmet')) {
      return 'Danışmanlık veya hizmet tabanlı işler için BAE (serbest bölgelerde %0 vergi), Gürcistan (%1 küçük işletme vergisi) veya Estonya (ertelenmiş vergilendirme) mükemmel seçenekler olabilir. Müşterilerinizin çoğu nerede bulunuyor?';
    }

    if (input.includes('kripto') || input.includes('blockchain')) {
      return 'Kripto para ve blockchain girişimleri için Malta, Estonya ve BAE ilerici düzenleyici çerçeveler sunuyor. Malta özellikle kripto dostu net düzenlemelerle, BAE ise vergi avantajları sağlıyor. Hangi yön sizin için daha önemli - düzenleyici netlik mi vergi optimizasyonu mu?';
    }

    return 'Bu bilgi için teşekkürler! Paylaştıklarınıza dayanarak birkaç seçenek keşfetmenizi öneriyorum. Daha hedefli öneriler sunabilmem için şunları söyleyebilir misiniz: 1) Hedef pazarınız/müşterileriniz, 2) Beklenen yıllık gelir, 3) Önceliğiniz (vergi optimizasyonu, pazar erişimi veya kolay kurulum)? Bu ihtiyaçlarınız için mükemmel yargı yetkisini önermeme yardımcı olacak.';
  };

  const quickQuestions = [
    'Teknoloji şirketi kurmak istiyorum',
    'Vergi optimizasyonu arıyorum',
    'AB pazarına erişim istiyorum',
    'Kripto işi yapmak istiyorum',
  ];

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300 transform hover:scale-110 animate-bounce"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
        
        {/* Notification Badge */}
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
          1
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 bg-black text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          AI Oracle ile konuşun
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold">AI Oracle</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-indigo-100">Çevrimiçi</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white/80 hover:text-white transition-colors duration-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-xs ${
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
        <div className="px-4 py-2 border-t border-gray-100">
          <div className="text-xs text-gray-600 mb-2">Hızlı başlangıç:</div>
          <div className="flex flex-wrap gap-1">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setInputValue(question)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full transition-colors duration-200"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Mesajınızı yazın..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            icon={Send}
            size="sm"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantWidget;
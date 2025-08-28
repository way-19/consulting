import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { useLanguage } from '@consulting19/shared';
import { Button } from '@consulting19/ui';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const AIAssistantWidget = () => {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Language-specific content
  const content = {
    en: {
      greeting: 'Hello! I\'m your AI Oracle assistant. I can help you with international business expansion. What type of business are you looking to establish?',
      online: 'Online',
      placeholder: 'Type your message...',
      tooltip: 'Chat with AI Oracle',
      quickQuestions: [
        'I want to start a tech company',
        'Looking for tax optimization',
        'Need EU market access',
        'Interested in crypto business',
      ],
      responses: {
        tech: 'For a tech/software business, I recommend considering Estonia or Singapore. Estonia offers 100% online e-Residency with EU access, while Singapore provides excellent infrastructure and serves as the gateway to Asian markets. Both have favorable tax structures for digital businesses. Would you like me to provide more details about either option?',
        ecommerce: 'For e-commerce businesses, I suggest looking at Malta or Estonia for EU market access, or Singapore for Asian markets. These jurisdictions offer favorable tax rates and excellent digital infrastructure. Malta provides 5% effective corporate tax rate with full EU access. Which region interests you most?',
        consulting: 'For consulting or service-based businesses, UAE (0% tax in free zones), Georgia (1% small business tax), or Estonia (deferred taxation) could be excellent choices. The key factors are your client base location and desired tax efficiency. Where are most of your clients located?',
        crypto: 'For cryptocurrency and blockchain ventures, Malta, Estonia, and UAE offer progressive regulatory frameworks. Malta is particularly crypto-friendly with clear regulations, while UAE provides tax advantages. Estonia offers digital innovation support. Which aspect is most important to you - regulatory clarity or tax optimization?',
        default: 'Thank you for that information! Based on what you\'ve shared, I\'d recommend exploring a few options. To provide more targeted recommendations, could you tell me: 1) Your target market/customers, 2) Expected annual revenue, and 3) Your priority (tax optimization, market access, or ease of setup)? This will help me suggest the perfect jurisdiction for your needs.'
      }
    },
    tr: {
      greeting: 'Merhaba! Ben AI Oracle asistanınızım. Uluslararası iş genişlemeniz için size yardımcı olabilirim. Hangi tür bir iş kurmak istiyorsunuz?',
      online: 'Çevrimiçi',
      placeholder: 'Mesajınızı yazın...',
      tooltip: 'AI Oracle ile konuşun',
      quickQuestions: [
        'Teknoloji şirketi kurmak istiyorum',
        'Vergi optimizasyonu arıyorum',
        'AB pazarına erişim istiyorum',
        'Kripto işi yapmak istiyorum',
      ],
      responses: {
        tech: 'Teknoloji/yazılım işi için Estonya veya Singapur öneriyorum. Estonya %100 online e-Residency ile AB erişimi sunarken, Singapur Asya pazarlarına geçit sağlıyor. Her ikisi de dijital işler için uygun vergi yapıları sunuyor. Hangi seçenek hakkında daha fazla bilgi istersiniz?',
        ecommerce: 'E-ticaret işleri için AB pazarı erişimi için Malta veya Estonya, Asya pazarları için Singapur öneriyorum. Malta %5 efektif kurumlar vergisi ile tam AB erişimi sağlıyor. Hangi bölge sizi daha çok ilgilendiriyor?',
        consulting: 'Danışmanlık veya hizmet tabanlı işler için BAE (serbest bölgelerde %0 vergi), Gürcistan (%1 küçük işletme vergisi) veya Estonya (ertelenmiş vergilendirme) mükemmel seçenekler olabilir. Müşterilerinizin çoğu nerede bulunuyor?',
        crypto: 'Kripto para ve blockchain girişimleri için Malta, Estonya ve BAE ilerici düzenleyici çerçeveler sunuyor. Malta özellikle kripto dostu net düzenlemelerle, BAE ise vergi avantajları sağlıyor. Estonya dijital inovasyon desteği sunuyor. Hangi yön sizin için daha önemli - düzenleyici netlik mi vergi optimizasyonu mu?',
        default: 'Bu bilgi için teşekkürler! Paylaştıklarınıza dayanarak birkaç seçenek keşfetmenizi öneriyorum. Daha hedefli öneriler sunabilmem için şunları söyleyebilir misiniz: 1) Hedef pazarınız/müşterileriniz, 2) Beklenen yıllık gelir, 3) Önceliğiniz (vergi optimizasyonu, pazar erişimi veya kolay kurulum)? Bu ihtiyaçlarınız için mükemmel yargı yetkisini önermeme yardımcı olacak.'
      }
    },
    pt: {
      greeting: 'Olá! Sou seu assistente AI Oracle. Posso ajudá-lo com expansão internacional de negócios. Que tipo de negócio você está procurando estabelecer?',
      online: 'Online',
      placeholder: 'Digite sua mensagem...',
      tooltip: 'Converse com AI Oracle',
      quickQuestions: [
        'Quero começar uma empresa de tecnologia',
        'Procurando otimização fiscal',
        'Preciso de acesso ao mercado da UE',
        'Interessado em negócios cripto',
      ],
      responses: {
        tech: 'Para negócios de tecnologia/software, recomendo considerar Estônia ou Singapura. A Estônia oferece e-Residency 100% online com acesso à UE, enquanto Singapura fornece excelente infraestrutura e serve como porta de entrada para mercados asiáticos. Ambos têm estruturas fiscais favoráveis para negócios digitais. Gostaria que eu fornecesse mais detalhes sobre qualquer uma das opções?',
        ecommerce: 'Para negócios de e-commerce, sugiro Malta ou Estônia para acesso ao mercado da UE, ou Singapura para mercados asiáticos. Essas jurisdições oferecem taxas fiscais favoráveis e excelente infraestrutura digital. Malta oferece taxa corporativa efetiva de 5% com acesso total à UE. Qual região mais lhe interessa?',
        consulting: 'Para negócios de consultoria ou serviços, EAU (0% de imposto em zonas francas), Geórgia (1% de imposto para pequenas empresas) ou Estônia (tributação diferida) podem ser excelentes escolhas. Os fatores-chave são a localização da sua base de clientes e a eficiência fiscal desejada. Onde estão localizados a maioria dos seus clientes?',
        crypto: 'Para empreendimentos de criptomoeda e blockchain, Malta, Estônia e EAU oferecem estruturas regulatórias progressivas. Malta é particularmente amigável às criptos com regulamentações claras, enquanto EAU oferece vantagens fiscais. A Estônia oferece suporte à inovação digital. Qual aspecto é mais importante para você - clareza regulatória ou otimização fiscal?',
        default: 'Obrigado por essa informação! Com base no que você compartilhou, eu recomendaria explorar algumas opções. Para fornecer recomendações mais direcionadas, você poderia me dizer: 1) Seu mercado/clientes alvo, 2) Receita anual esperada, e 3) Sua prioridade (otimização fiscal, acesso ao mercado ou facilidade de configuração)? Isso me ajudará a sugerir a jurisdição perfeita para suas necessidades.'
      }
    }
  };

  // Initialize messages with greeting based on language
  useEffect(() => {
    setMessages([{
      id: '1',
      type: 'ai',
      content: t('aiAssistantGreeting'),
      timestamp: new Date(),
    }]);
  }, [language, t]);

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
    
    // Turkish responses
    if (language === 'tr') {
      if (input.includes('teknoloji') || input.includes('yazılım') || input.includes('dijital')) {
        return 'Teknoloji/yazılım işi için Estonya veya Singapur öneriyorum. Estonya %100 online e-Residency ile AB erişimi sunarken, Singapur mükemmel altyapı ve Asya pazarlarına geçit sağlıyor. Her ikisi de dijital işler için uygun vergi yapıları sunuyor. Hangi seçenek hakkında daha fazla bilgi istersiniz?';
      }
      if (input.includes('e-ticaret') || input.includes('online') || input.includes('perakende')) {
        return 'E-ticaret işleri için AB pazarı erişimi için Malta veya Estonya, Asya pazarları için Singapur öneriyorum. Bu yargı yetkileri uygun vergi oranları ve mükemmel dijital altyapı sunuyor. Malta tam AB erişimi ile %5 efektif kurumlar vergisi sağlıyor. Hangi bölge sizi daha çok ilgilendiriyor?';
      }
      if (input.includes('danışmanlık') || input.includes('hizmet')) {
        return 'Danışmanlık veya hizmet tabanlı işler için BAE (serbest bölgelerde %0 vergi), Gürcistan (%1 küçük işletme vergisi) veya Estonya (ertelenmiş vergilendirme) mükemmel seçenekler olabilir. Ana faktörler müşteri tabanınızın konumu ve istenen vergi verimliliğidir. Müşterilerinizin çoğu nerede bulunuyor?';
      }
      if (input.includes('kripto') || input.includes('blockchain')) {
        return 'Kripto para ve blockchain girişimleri için Malta, Estonya ve BAE ilerici düzenleyici çerçeveler sunuyor. Malta özellikle kripto dostu net düzenlemelerle, BAE ise vergi avantajları sağlıyor. Estonya dijital inovasyon desteği sunuyor. Sizin için hangi yön daha önemli - düzenleyici netlik mi vergi optimizasyonu mu?';
      }
      return 'Bu bilgi için teşekkürler! Paylaştıklarınıza dayanarak birkaç seçenek keşfetmenizi öneriyorum. Daha hedefli öneriler sunabilmem için şunları söyleyebilir misiniz: 1) Hedef pazarınız/müşterileriniz, 2) Beklenen yıllık gelir, 3) Önceliğiniz (vergi optimizasyonu, pazar erişimi veya kolay kurulum)? Bu ihtiyaçlarınız için mükemmel yargı yetkisini önermeme yardımcı olacak.';
    }
    
    // Portuguese responses
    if (language === 'pt') {
      if (input.includes('tecnologia') || input.includes('software') || input.includes('digital')) {
        return 'Para negócios de tecnologia/software, recomendo considerar Estônia ou Singapura. A Estônia oferece e-Residency 100% online com acesso à UE, enquanto Singapura fornece excelente infraestrutura e serve como porta de entrada para mercados asiáticos. Ambos têm estruturas fiscais favoráveis para negócios digitais. Gostaria que eu fornecesse mais detalhes sobre qualquer uma das opções?';
      }
      if (input.includes('e-commerce') || input.includes('online') || input.includes('varejo')) {
        return 'Para negócios de e-commerce, sugiro Malta ou Estônia para acesso ao mercado da UE, ou Singapura para mercados asiáticos. Essas jurisdições oferecem taxas fiscais favoráveis e excelente infraestrutura digital. Malta oferece taxa corporativa efetiva de 5% com acesso total à UE. Qual região mais lhe interessa?';
      }
      if (input.includes('consultoria') || input.includes('serviço')) {
        return 'Para negócios de consultoria ou serviços, EAU (0% de imposto em zonas francas), Geórgia (1% de imposto para pequenas empresas) ou Estônia (tributação diferida) podem ser excelentes escolhas. Os fatores-chave são a localização da sua base de clientes e a eficiência fiscal desejada. Onde estão localizados a maioria dos seus clientes?';
      }
      if (input.includes('cripto') || input.includes('blockchain')) {
        return 'Para empreendimentos de criptomoeda e blockchain, Malta, Estônia e EAU oferecem estruturas regulatórias progressivas. Malta é particularmente amigável às criptos com regulamentações claras, enquanto EAU oferece vantagens fiscais. A Estônia oferece suporte à inovação digital. Qual aspecto é mais importante para você - clareza regulatória ou otimização fiscal?';
      }
      return 'Obrigado por essa informação! Com base no que você compartilhou, eu recomendaria explorar algumas opções. Para fornecer recomendações mais direcionadas, você poderia me dizer: 1) Seu mercado/clientes alvo, 2) Receita anual esperada, e 3) Sua prioridade (otimização fiscal, acesso ao mercado ou facilidade de configuração)? Isso me ajudará a sugerir a jurisdição perfeita para suas necessidades.';
    }
    
    // English responses (default)
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
    t('aiAssistantQuick1'),
    t('aiAssistantQuick2'),
    t('aiAssistantQuick3'),
    t('aiAssistantQuick4'),
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
          {content[language as keyof typeof content].tooltip}
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
            <h3 className="font-semibold">{t('aiOracleAssistant')}</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-indigo-100">{t('online')}</span>
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
          <div className="text-xs text-gray-600 mb-2">
            {language === 'tr' ? 'Hızlı başlangıç:' : 
             language === 'pt' ? 'Início rápido:' : 'Quick start:'}
          </div>
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
            placeholder={content[language as keyof typeof content].placeholder}
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
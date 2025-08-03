import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useMessageTranslation } from '../../hooks/useMessageTranslation';
import TranslatedMessage from '../../components/shared/TranslatedMessage';
import MessageComposer from '../../components/shared/MessageComposer';
import LanguageSelector from '../../components/shared/LanguageSelector';
import { 
  ArrowLeft, 
  MessageSquare, 
  User, 
  Search, 
  Filter,
  RefreshCw,
  Send,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const MessagesPage: React.FC = () => {
  const navigate = useNavigate();
  const [client, setClient] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [consultants, setConsultants] = useState<any[]>([]);
  const [selectedConsultant, setSelectedConsultant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [userLanguage, setUserLanguage] = useState('tr');

  // Use translation hook
  const { processingTranslations } = useMessageTranslation(client?.id || '', userLanguage);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (!userData) {
          navigate('/login');
          return;
        }

        const user = JSON.parse(userData);
        if (user.role !== 'client') {
          navigate('/unauthorized');
          return;
        }

        setClient(user);
        await loadUserLanguage(user.id);
        await loadConsultants(user.id);
        await loadMessages(user.id);
      } catch (error) {
        console.error('Error checking auth:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const loadUserLanguage = async (clientId: string) => {
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('language')
        .eq('id', clientId)
        .single();

      if (userData?.language) {
        setUserLanguage(userData.language);
      }
    } catch (error) {
      console.error('Error loading user language:', error);
    }
  };

  const loadConsultants = async (clientId: string) => {
    try {
      // Load consultants who have worked with this client
      const { data: consultantsData } = await supabase
        .from('applications')
        .select(`
          consultant:users!applications_consultant_id_fkey(
            id, first_name, last_name, email, language,
            countries(name, flag_emoji)
          )
        `)
        .eq('client_id', clientId)
        .not('consultant_id', 'is', null);

      // Get unique consultants
      const uniqueConsultants = consultantsData?.reduce((acc: any[], app: any) => {
        if (app.consultant && !acc.find(c => c.id === app.consultant.id)) {
          acc.push(app.consultant);
        }
        return acc;
      }, []) || [];

      setConsultants(uniqueConsultants);
      if (uniqueConsultants.length > 0) {
        setSelectedConsultant(uniqueConsultants[0]);
      }
    } catch (error) {
      console.error('Error loading consultants:', error);
    }
  };

  const loadMessages = async (clientId: string, consultantId?: string) => {
    try {
      let query = supabase
        .from('messages')
        .select(`
          *,
          sender:users!messages_sender_id_fkey(first_name, last_name, role, language),
          recipient:users!messages_recipient_id_fkey(first_name, last_name, role, language)
        `)
        .or(`sender_id.eq.${clientId},recipient_id.eq.${clientId}`)
        .order('created_at', { ascending: false });

      if (consultantId) {
        query = query.or(`and(sender_id.eq.${clientId},recipient_id.eq.${consultantId}),and(sender_id.eq.${consultantId},recipient_id.eq.${clientId})`);
      }

      const { data: messagesData } = await query;
      setMessages(messagesData || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const updateUserLanguage = async (newLanguage: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ language: newLanguage })
        .eq('id', client.id);

      if (error) throw error;
      setUserLanguage(newLanguage);
    } catch (error) {
      console.error('Error updating user language:', error);
    }
  };

  const getMessageTypeColor = (messageType: string) => {
    switch (messageType) {
      case 'accounting': return 'bg-orange-100 text-orange-700';
      case 'general': return 'bg-blue-100 text-blue-700';
      case 'urgent': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getMessageTypeLabel = (messageType: string) => {
    switch (messageType) {
      case 'accounting': return 'Muhasebe';
      case 'general': return 'Genel';
      case 'urgent': return 'Acil';
      default: return messageType;
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesFilter = filter === 'all' || message.message_type === filter;
    const matchesSearch = searchTerm === '' || 
      message.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${message.sender?.first_name} ${message.sender?.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesConsultant = !selectedConsultant || 
      message.sender_id === selectedConsultant.id || 
      message.recipient_id === selectedConsultant.id;
    
    return matchesFilter && matchesSearch && matchesConsultant;
  });

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50">
        <div className="container py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Mesajlar yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!client) {
    return null;
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              to="/client"
              className="inline-flex items-center text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Panele Dön
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Tüm Mesajlarım</h1>
          </div>
          <div className="flex items-center space-x-3">
            <LanguageSelector
              selectedLanguage={userLanguage}
              onLanguageChange={updateUserLanguage}
            />
            <button
              onClick={() => loadMessages(client.id, selectedConsultant?.id)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Consultants Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Danışmanlarım</h2>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setSelectedConsultant(null);
                    loadMessages(client.id);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    !selectedConsultant 
                      ? 'bg-blue-100 border-blue-300' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="font-medium text-gray-900">Tüm Danışmanlar</div>
                  <div className="text-sm text-gray-600">Tüm mesajları görüntüle</div>
                </button>
                
                {consultants.map((consultant) => (
                  <button
                    key={consultant.id}
                    onClick={() => {
                      setSelectedConsultant(consultant);
                      loadMessages(client.id, consultant.id);
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedConsultant?.id === consultant.id 
                        ? 'bg-blue-100 border-blue-300' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{consultant.countries?.flag_emoji || '🌍'}</span>
                      <div>
                        <div className="font-medium text-gray-900">
                          {consultant.first_name} {consultant.last_name}
                        </div>
                        <div className="text-sm text-gray-600">{consultant.countries?.name}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
              {/* Messages Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedConsultant 
                      ? `${selectedConsultant.first_name} ${selectedConsultant.last_name} ile Mesajlar`
                      : 'Tüm Mesajlar'
                    }
                  </h2>
                  <div className="text-sm text-gray-500">
                    {filteredMessages.length} mesaj
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Mesajlarda ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                    >
                      <option value="all">Tüm Mesajlar</option>
                      <option value="general">Genel</option>
                      <option value="accounting">Muhasebe</option>
                      <option value="urgent">Acil</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Messages List */}
              <div className="p-6">
                <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
                  {filteredMessages.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Bu kriterlere uygun mesaj bulunamadı.</p>
                    </div>
                  ) : (
                    filteredMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`border rounded-xl p-4 transition-colors ${
                          message.sender_id === client.id 
                            ? 'border-blue-200 bg-blue-50 ml-8' 
                            : 'border-gray-200 bg-white mr-8'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            message.sender_id === client.id 
                              ? 'bg-blue-100' 
                              : 'bg-purple-100'
                          }`}>
                            <User className={`h-5 w-5 ${
                              message.sender_id === client.id 
                                ? 'text-blue-600' 
                                : 'text-purple-600'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-semibold text-gray-900">
                                  {message.sender_id === client.id 
                                    ? 'Ben' 
                                    : `${message.sender?.first_name} ${message.sender?.last_name}`}
                                </h4>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMessageTypeColor(message.message_type)}`}>
                                  {getMessageTypeLabel(message.message_type)}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                {processingTranslations.includes(message.id) && (
                                  <div className="flex items-center space-x-1 text-xs text-blue-600">
                                    <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-600"></div>
                                    <span>Çevriliyor...</span>
                                  </div>
                                )}
                                <span className="text-sm text-gray-500">
                                  {new Date(message.created_at).toLocaleDateString('tr-TR')}
                                </span>
                              </div>
                            </div>
                            
                            <TranslatedMessage
                              originalMessage={message.message}
                              translatedMessage={message.translated_message}
                              originalLanguage={message.original_language || 'en'}
                              translatedLanguage={message.translated_language}
                              userLanguage={userLanguage}
                              showTranslationToggle={true}
                            />
                            
                            {/* Message status indicators */}
                            <div className="flex items-center space-x-2 mt-2">
                              {message.needs_translation && (
                                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                                  Çeviri gerekli
                                </span>
                              )}
                              {message.translation_status === 'completed' && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                  Çevrildi
                                </span>
                              )}
                              {message.translation_status === 'failed' && (
                                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                                  Çeviri başarısız
                                </span>
                              )}
                              {!message.is_read && message.recipient_id === client.id && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                  Yeni
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Composer */}
                {selectedConsultant && (
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {selectedConsultant.first_name} {selectedConsultant.last_name}'a Mesaj Gönder
                    </h3>
                    <MessageComposer
                      onSendMessage={async (msg, lang) => {
                        const { error } = await supabase
                          .from('messages')
                          .insert({
                            sender_id: client.id,
                            recipient_id: selectedConsultant.id,
                            message: msg,
                            original_language: lang,
                            message_type: 'general',
                            needs_translation: true
                          });

                        if (error) throw error;
                        loadMessages(client.id, selectedConsultant.id);
                      }}
                      userLanguage={userLanguage}
                      recipientLanguage={selectedConsultant?.language}
                      placeholder="Danışmanınıza mesaj yazın..."
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
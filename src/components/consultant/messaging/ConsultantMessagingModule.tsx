import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { api } from '../../../lib/api';
import { useMessageTranslation } from '../../../hooks/useMessageTranslation';
import TranslatedMessage from '../../shared/TranslatedMessage';
import MessageComposer from '../../shared/MessageComposer';
import LanguageSelector from '../../shared/LanguageSelector';
import { fetchClients } from '../dashboard/CountryBasedClients.tsx';
import ClientDataManager from '../../../lib/clientDataManager';
import { 
  MessageSquare, 
  User, 
  Search, 
  Filter,
  RefreshCw,
  Send,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  ArrowRight,
  Users,
  Globe,
  Bell
} from 'lucide-react';

interface ConsultantMessagingModuleProps {
  consultantId: string;
}

const ConsultantMessagingModule: React.FC<ConsultantMessagingModuleProps> = ({ consultantId }) => {
  const [consultant, setConsultant] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [consultantLanguage, setConsultantLanguage] = useState('en');

  // Use translation hook
  const { processingTranslations } = useMessageTranslation(consultantId, consultantLanguage);

  useEffect(() => {
    loadConsultantData();
    loadClients();
  }, [consultantId]);

  useEffect(() => {
    if (selectedClient) {
      loadMessages();
    }
  }, [selectedClient, consultantId]);

  const loadConsultantData = async () => {
    try {
      const { data: consultantData } = await supabase
        .from('users')
        .select(`
          *,
          countries!users_country_id_fkey(name, flag_emoji)
        `)
        .eq('id', consultantId)
        .maybeSingle();

      if (consultantData) {
        setConsultant(consultantData);
        setConsultantLanguage(consultantData.language || 'en');
      }
    } catch (error) {
      console.error('Error loading consultant data:', error);
    }
  };

  const loadClients = async () => {
    try {
      console.log('🔍 Loading clients for messaging...');
      const clientsData = await ClientDataManager.fetchConsultantClients({
        consultantEmail: 'georgia_consultant@consulting19.com',
        countryId: 1,
        search: '',
        limit: 50,
        offset: 0
      });

      // Transform API data to match expected format
      const transformedClients = clientsData.map((client: any) => ({
        id: client.client_id || client.id,
        first_name: client.full_name?.split(' ')[0] || '',
        last_name: client.full_name?.split(' ').slice(1).join(' ') || '',
        email: client.email,
        language: client.language || 'tr',
        company_name: client.company_name,
        client_country: {
          name: client.country_name,
          flag_emoji: '🇬🇪'
        }
      }));

      console.log('👥 Clients loaded for messaging:', transformedClients.length);
      setClients(transformedClients);
      if (clientsData.length > 0 && !selectedClient) {
        setSelectedClient(transformedClients[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading clients:', error);
      setClients([]);
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    if (!selectedClient) return;

    try {
      const res = await api<{ data:any[] }>('/api/messages/list', {
        consultantId,
        clientId: selectedClient.id
      });
      setMessages(res.data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages([]);
    }
  };

  const updateConsultantLanguage = async (language: string) => {
    setConsultantLanguage(language);
    try {
      await supabase
        .from('users')
        .update({ language })
        .eq('id', consultantId);
    } catch (error) {
      console.error('Error updating consultant language:', error);
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

  const getMessageTypeColor = (messageType: string) => {
    switch (messageType) {
      case 'accounting': return 'bg-blue-100 text-blue-800';
      case 'general': return 'bg-gray-100 text-gray-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesFilter = filter === 'all' || message.message_type === filter;
    const matchesSearch = searchTerm === '' || 
      message.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${message.sender?.first_name} ${message.sender?.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const unreadCount = messages.filter(msg => 
    !msg.is_read && msg.recipient_id === consultantId
  ).length;

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <MessageSquare className="h-6 w-6 mr-3 text-blue-600" />
            Müşteri Mesajları
            {unreadCount > 0 && (
              <span className="ml-3 bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                {unreadCount} yeni
              </span>
            )}
          </h2>
          <div className="flex items-center space-x-3">
            <LanguageSelector
              selectedLanguage={consultantLanguage}
              onLanguageChange={updateConsultantLanguage}
              className="text-sm"
            />
            <button
              onClick={() => {
                loadClients();
                if (selectedClient) loadMessages();
              }}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
        {/* Clients Sidebar */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-purple-600" />
            Müşterilerim ({clients.length})
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {clients.map((client) => {
              const clientMessages = messages.filter(msg => 
                msg.sender_id === client.id || msg.recipient_id === client.id
              );
              const unreadClientMessages = clientMessages.filter(msg => 
                !msg.is_read && msg.recipient_id === consultantId
              ).length;

              return (
                <button
                  key={client.id}
                  onClick={() => setSelectedClient(client)}
                  className={`w-full text-left p-3 rounded-lg transition-colors border ${
                    selectedClient?.id === client.id 
                      ? 'bg-blue-100 border-blue-300' 
                      : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{client.client_country?.flag_emoji || '🌍'}</span>
                      <div>
                        <div className="font-medium text-gray-900">
                          {client.first_name} {client.last_name}
                        </div>
                        <div className="text-sm text-gray-600">{client.client_country?.name}</div>
                        <div className="text-xs text-blue-600">
                          Dil: {client.language?.toUpperCase() || 'EN'}
                        </div>
                      </div>
                    </div>
                    {unreadClientMessages > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {unreadClientMessages}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Messages Area */}
        <div className="lg:col-span-3">
          {selectedClient ? (
            <div>
              {/* Client Header */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{selectedClient.client_country?.flag_emoji || '🌍'}</span>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {selectedClient.first_name} {selectedClient.last_name}
                      </h3>
                      <p className="text-sm text-gray-600">{selectedClient.email}</p>
                      <p className="text-xs text-blue-600">
                        Müşteri Dili: {selectedClient.language?.toUpperCase() || 'EN'} • 
                        Sizin Diliniz: {consultantLanguage.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      {filteredMessages.length} mesaj
                    </div>
                    {selectedClient.language !== consultantLanguage && (
                      <div className="text-xs text-green-600 flex items-center">
                        <Globe className="h-3 w-3 mr-1" />
                        Otomatik çeviri aktif
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
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

              {/* Messages List */}
              <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
                {filteredMessages.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Bu müşteri ile henüz mesaj alışverişi yok.</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Aşağıdaki mesaj kutusunu kullanarak ilk mesajınızı gönderin.
                    </p>
                  </div>
                ) : (
                  filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`border rounded-xl p-4 transition-colors ${
                        message.sender_id === consultantId 
                          ? 'border-blue-200 bg-blue-50 ml-8' 
                          : 'border-gray-200 bg-white mr-8'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          message.sender_id === consultantId 
                            ? 'bg-blue-100' 
                            : 'bg-purple-100'
                        }`}>
                          <User className={`h-5 w-5 ${
                            message.sender_id === consultantId 
                              ? 'text-blue-600' 
                              : 'text-purple-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold text-gray-900">
                                {message.sender_id === consultantId 
                                  ? 'Ben (Danışman)' 
                                  : `${selectedClient.first_name} ${selectedClient.last_name} (Müşteri)`}
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
                            userLanguage={consultantLanguage}
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
                            {!message.is_read && message.recipient_id === consultantId && (
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
              <div className="pt-6 border-t border-gray-200">
                <h4 className="text-md font-semibold text-gray-900 mb-4">
                  {selectedClient.first_name} {selectedClient.last_name}'a Mesaj Gönder
                </h4>
                <MessageComposer
                  onSendMessage={async (msg, lang) => {
                    await api('/api/accounting/actions', {
                      action: 'send_message',
                      payload: {
                        sender_id: consultantId,
                        recipient_id: selectedClient.id,
                        message: msg,
                        original_language: lang,
                        message_type: 'general'
                      }
                      });

                    loadMessages();
                  }}
                  userLanguage={consultantLanguage}
                  recipientLanguage={selectedClient?.language}
                  placeholder="Müşterinize mesaj yazın..."
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Müşteri Seçin</h3>
              <p className="text-gray-600 mb-6">
                Mesajlaşmaya başlamak için sol taraftan bir müşteri seçin.
              </p>
              {clients.length === 0 && (
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <p className="text-yellow-800 text-sm">
                    Henüz size atanmış müşteri bulunmuyor. Yeni müşteriler atandığında burada görünecekler.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-900">{clients.length}</div>
            <div className="text-sm text-blue-700">Toplam Müşteri</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-900">{messages.length}</div>
            <div className="text-sm text-green-700">Toplam Mesaj</div>
          </div>
          <div className="bg-red-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-red-900">{unreadCount}</div>
            <div className="text-sm text-red-700">Okunmamış</div>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-900">
              {messages.filter(msg => msg.translation_status === 'completed').length}
            </div>
            <div className="text-sm text-purple-700">Çevrildi</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultantMessagingModule;
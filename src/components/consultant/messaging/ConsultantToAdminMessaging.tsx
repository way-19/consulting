import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useMessageTranslation } from '../../../hooks/useMessageTranslation';
import TranslatedMessage from '../../shared/TranslatedMessage';
import MessageComposer from '../../shared/MessageComposer';
import LanguageSelector from '../../shared/LanguageSelector';
import { 
  MessageSquare, 
  Shield, 
  User, 
  Search, 
  Filter,
  RefreshCw,
  Send,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Globe,
  Bell
} from 'lucide-react';

interface ConsultantToAdminMessagingProps {
  consultantId: string;
}

const ConsultantToAdminMessaging: React.FC<ConsultantToAdminMessagingProps> = ({ consultantId }) => {
  const [consultant, setConsultant] = useState<any>(null);
  const [admin, setAdmin] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [consultantLanguage, setConsultantLanguage] = useState('en');

  // Use translation hook
  const { processingTranslations } = useMessageTranslation(consultantId, consultantLanguage);

  useEffect(() => {
    loadConsultantData();
    loadAdminData();
    loadMessages();
  }, [consultantId]);

  const loadConsultantData = async () => {
    try {
      const { data: consultantData } = await supabase
        .from('users')
        .select(`
          *,
          countries(name, flag_emoji)
        `)
        .eq('id', consultantId)
        .single();

      if (consultantData) {
        setConsultant(consultantData);
        setConsultantLanguage(consultantData.language || 'en');
      }
    } catch (error) {
      console.error('Error loading consultant data:', error);
    }
  };

  const loadAdminData = async () => {
    try {
      const { data: adminData } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'admin')
        .single();

      setAdmin(adminData);
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  };

  const loadMessages = async () => {
    if (!admin) return;

    try {
      const { data: messagesData } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users!messages_sender_id_fkey(first_name, last_name, role, language)
        `)
        .or(`and(sender_id.eq.${consultantId},recipient_id.eq.${admin.id}),and(sender_id.eq.${admin.id},recipient_id.eq.${consultantId})`)
        .order('created_at', { ascending: false });

      setMessages(messagesData || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateConsultantLanguage = async (newLanguage: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ language: newLanguage })
        .eq('id', consultantId);

      if (error) throw error;
      setConsultantLanguage(newLanguage);
    } catch (error) {
      console.error('Error updating consultant language:', error);
    }
  };

  const getMessageTypeColor = (messageType: string) => {
    switch (messageType) {
      case 'admin_notice': return 'bg-red-100 text-red-700';
      case 'performance_review': return 'bg-purple-100 text-purple-700';
      case 'general': return 'bg-blue-100 text-blue-700';
      case 'urgent': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getMessageTypeLabel = (messageType: string) => {
    switch (messageType) {
      case 'admin_notice': return 'Admin Bildirimi';
      case 'performance_review': return 'Performans Değerlendirmesi';
      case 'general': return 'Genel';
      case 'urgent': return 'Acil';
      default: return messageType;
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesFilter = filter === 'all' || message.message_type === filter;
    const matchesSearch = searchTerm === '' || 
      message.message.toLowerCase().includes(searchTerm.toLowerCase());
    
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
            <Shield className="h-6 w-6 mr-3 text-red-600" />
            Admin İletişimi
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
              onClick={loadMessages}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {admin ? (
          <div>
            {/* Admin Header */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 mb-6 border border-red-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Shield className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {admin.first_name} {admin.last_name} (Sistem Yöneticisi)
                    </h3>
                    <p className="text-sm text-gray-600">{admin.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-xs text-red-600">
                        Sizin Diliniz: {consultantLanguage.toUpperCase()}
                      </p>
                      <span>•</span>
                      <p className="text-xs text-red-600">
                        Admin Dili: {admin.language?.toUpperCase() || 'EN'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    {filteredMessages.length} mesaj
                  </div>
                  {admin.language !== consultantLanguage && (
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
                  <option value="admin_notice">Admin Bildirimi</option>
                  <option value="performance_review">Performans</option>
                  <option value="urgent">Acil</option>
                </select>
              </div>
            </div>

            {/* Messages List */}
            <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
              {filteredMessages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Admin ile henüz mesaj alışverişi yok.</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Aşağıdaki mesaj kutusunu kullanarak admin ile iletişime geçin.
                  </p>
                </div>
              ) : (
                filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`border rounded-xl p-4 transition-colors ${
                      message.sender_id === consultantId 
                        ? 'border-blue-200 bg-blue-50 ml-8' 
                        : 'border-red-200 bg-red-50 mr-8'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        message.sender_id === consultantId 
                          ? 'bg-blue-100' 
                          : 'bg-red-100'
                      }`}>
                        {message.sender_id === consultantId ? (
                          <User className="h-5 w-5 text-blue-600" />
                        ) : (
                          <Shield className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-gray-900">
                              {message.sender_id === consultantId 
                                ? 'Ben (Danışman)' 
                                : `${admin.first_name} ${admin.last_name} (Admin)`}
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
                Admin'e Mesaj Gönder
              </h4>
              <MessageComposer
                onSendMessage={async (msg, lang) => {
                  const { error } = await supabase
                    .from('messages')
                    .insert({
                      sender_id: consultantId,
                      recipient_id: admin.id,
                      message: msg,
                      original_language: lang,
                      message_type: 'general',
                      needs_translation: true
                    });

                  if (error) throw error;
                  loadMessages();
                }}
                userLanguage={consultantLanguage}
                recipientLanguage={admin?.language}
                placeholder="Admin'e mesaj yazın..."
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Admin Bulunamadı</h3>
            <p className="text-gray-600">
              Sistem yöneticisi ile iletişim kurmak için admin hesabının aktif olması gerekiyor.
            </p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-900">{messages.length}</div>
            <div className="text-sm text-blue-700">Toplam Mesaj</div>
          </div>
          <div className="bg-red-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-red-900">{unreadCount}</div>
            <div className="text-sm text-red-700">Okunmamış</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-900">
              {messages.filter(msg => msg.translation_status === 'completed').length}
            </div>
            <div className="text-sm text-green-700">Çevrildi</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultantToAdminMessaging;
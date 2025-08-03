import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { translationService } from '../../../lib/translation';
import TranslatedMessage from '../../shared/TranslatedMessage';
import LanguageSelector from '../../shared/LanguageSelector';
import MessageComposer from '../../shared/MessageComposer';
import { 
  Calculator, 
  FileText, 
  MessageSquare, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Eye,
  Download,
  Send,
  User,
  Filter,
  Search,
  RefreshCw,
  Plus,
  Edit,
  X
} from 'lucide-react';

interface ConsultantAccountingModuleProps {
  consultantId: string;
}

const ConsultantAccountingModule: React.FC<ConsultantAccountingModuleProps> = ({ consultantId }) => {
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('clients');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [consultantLanguage, setConsultantLanguage] = useState('tr'); // Default to Turkish

  const [requestForm, setRequestForm] = useState({
    title: '',
    message: '',
    priority: 'normal',
    document_types: [] as string[]
  });

  const [messageForm, setMessageForm] = useState({
    subject: '',
    message: '',
    priority: 'normal'
  });

  // Load consultant language preference
  useEffect(() => {
    const loadConsultantLanguage = async () => {
      try {
        const { data: userData } = await supabase
          .from('users')
          .select('language')
          .eq('id', consultantId)
          .single();

        if (userData?.language) {
          setConsultantLanguage(userData.language);
        }
      } catch (error) {
        console.error('Error loading consultant language:', error);
      }
    };

    if (consultantId) {
      loadConsultantLanguage();
    }
  }, [consultantId]);

  const documentTypes = [
    { value: 'income_statement', label: 'Gelir Belgesi' },
    { value: 'expense_receipt', label: 'Gider Makbuzu' },
    { value: 'bank_statement', label: 'Banka Ekstresi' },
    { value: 'invoice', label: 'Fatura' },
    { value: 'contract', label: 'Sözleşme' },
    { value: 'tax_document', label: 'Vergi Belgesi' },
    { value: 'payroll', label: 'Bordro' },
    { value: 'other', label: 'Diğer' }
  ];

  useEffect(() => {
    loadClients();
  }, [consultantId]);

  useEffect(() => {
    if (selectedClient) {
      loadClientDocuments();
    }
  }, [selectedClient]);

  const loadClients = async () => {
    try {
      // Load clients assigned to this consultant
      const { data: clientsData } = await supabase
        .from('applications')
        .select(`
          client:users!applications_client_id_fkey(
            id, first_name, last_name, email, language,
            countries(name, flag_emoji)
          )
        `)
        .eq('consultant_id', consultantId)
        .not('client_id', 'is', null);

      // Get unique clients
      const uniqueClients = clientsData?.reduce((acc: any[], app: any) => {
        if (app.client && !acc.find(c => c.id === app.client.id)) {
          acc.push(app.client);
        }
        return acc;
      }, []) || [];

      setClients(uniqueClients);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadClientDocuments = async () => {
    if (!selectedClient) return;

    try {
      const { data: docsData } = await supabase
        .from('client_documents')
        .select('*')
        .eq('client_id', selectedClient.id)
        .order('created_at', { ascending: false });

      setDocuments(docsData || []);
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  const handleDocumentReview = async (documentId: string, status: string, notes?: string) => {
    try {
      const { error } = await supabase
        .from('client_documents')
        .update({
          status,
          consultant_notes: notes || null
        })
        .eq('id', documentId);

      if (error) throw error;
      
      loadClientDocuments();
      alert('Belge durumu güncellendi!');
    } catch (error) {
      console.error('Error updating document:', error);
      alert('Belge durumu güncellenirken hata oluştu.');
    }
  };

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClient) return;

    try {
      const { error } = await supabase
        .from('client_notifications')
        .insert({
          client_id: selectedClient.id,
          consultant_id: consultantId,
          notification_type: 'document_request',
          title: requestForm.title,
          message: requestForm.message,
          priority: requestForm.priority
        });

      if (error) throw error;

      setRequestForm({
        title: '',
        message: '',
        priority: 'normal',
        document_types: []
      });
      setShowRequestModal(false);
      alert('Belge talebi gönderildi!');
    } catch (error) {
      console.error('Error sending request:', error);
      alert('Belge talebi gönderilirken hata oluştu.');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClient) return;

    try {
      // Detect message language
      const detectedLanguage = await translationService.detectLanguage(messageForm.message);
      
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: consultantId,
          recipient_id: selectedClient.id,
          message: messageForm.message,
          original_language: detectedLanguage,
          message_type: 'accounting',
          needs_translation: true,
        });

      if (error) throw error;

      setMessageForm({
        subject: '',
        message: '',
        priority: 'normal'
      });
      setShowMessageModal(false);
      alert('Mesaj gönderildi!');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Mesaj gönderilirken hata oluştu.');
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

  const getDocumentTypeLabel = (type: string) => {
    const typeObj = documentTypes.find(t => t.value === type);
    return typeObj?.label || type;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending_review': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'requires_update': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Onaylandı';
      case 'pending_review': return 'İnceleniyor';
      case 'rejected': return 'Reddedildi';
      case 'requires_update': return 'Güncelleme Gerekli';
      default: return status;
    }
  };

  const getLanguageFlag = (language: string) => {
    const flags: { [key: string]: string } = {
      'tr': '🇹🇷',
      'en': '🇺🇸',
      'ar': '🇸🇦',
      'fr': '🇫🇷',
      'de': '🇩🇪',
      'es': '🇪🇸',
      'ru': '🇷🇺',
      'zh': '🇨🇳'
    };
    return flags[language] || '🌍';
  };

  const getLanguageName = (language: string) => {
    const names: { [key: string]: string } = {
      'tr': 'Türkçe',
      'en': 'English',
      'ar': 'العربية',
      'fr': 'Français',
      'de': 'Deutsch',
      'es': 'Español',
      'ru': 'Русский',
      'zh': '中文'
    };
    return names[language] || language;
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesFilter = filter === 'all' || doc.status === filter;
    const matchesSearch = searchTerm === '' || 
      doc.document_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

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
            <Calculator className="h-6 w-6 mr-3 text-purple-600" />
            Muhasebe Yönetimi
          </h2>
          <div className="flex items-center space-x-3">
            <LanguageSelector
              selectedLanguage={consultantLanguage}
              onLanguageChange={updateConsultantLanguage}
              className="text-sm"
            />
            <button
              onClick={loadClients}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Client Selection */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Müşteri Seçin</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client) => (
            <button
              key={client.id}
              onClick={() => setSelectedClient(client)}
              className={`p-4 border rounded-xl text-left transition-colors ${
                selectedClient?.id === client.id
                  ? 'border-purple-300 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{client.countries?.flag_emoji || '🌍'}</span>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {client.first_name} {client.last_name}
                  </h4>
                  <p className="text-sm text-gray-600">{client.email}</p>
                  <p className="text-xs text-gray-500">{client.countries?.name}</p>
                  <p className="text-xs text-blue-600">
                    Dil: {getLanguageFlag(client.language || 'en')} {getLanguageName(client.language || 'en')}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Client Documents Management */}
      {selectedClient && (
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {selectedClient.first_name} {selectedClient.last_name} - Muhasebe Belgeleri
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowRequestModal(true)}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
              >
                <AlertTriangle className="h-4 w-4" />
                <span>Belge Talep Et</span>
              </button>
              <button
                onClick={() => setShowMessageModal(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Mesaj Gönder</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Belge ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none bg-white"
              >
                <option value="all">Tüm Belgeler</option>
                <option value="pending_review">İnceleme Bekleyen</option>
                <option value="approved">Onaylanmış</option>
                <option value="rejected">Reddedilmiş</option>
                <option value="requires_update">Güncelleme Gerekli</option>
              </select>
            </div>
          </div>

          {/* Documents List */}
          <div className="space-y-4">
            {filteredDocuments.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Bu müşteri için belge bulunmuyor.</p>
                <button
                  onClick={() => setShowRequestModal(true)}
                  className="mt-4 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Belge Talep Et
                </button>
              </div>
            ) : (
              filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="border border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{doc.document_name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                          {getStatusLabel(doc.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {getDocumentTypeLabel(doc.document_type)}
                      </p>
                      <div className="text-xs text-gray-500 mb-3">
                        Yükleme: {new Date(doc.created_at).toLocaleDateString('tr-TR')}
                      </div>

                      {doc.consultant_notes && (
                        <div className="bg-purple-50 rounded-lg p-3 mb-3">
                          <p className="text-sm text-purple-800">
                            <strong>Notlarım:</strong> {doc.consultant_notes}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Review Actions */}
                  {doc.status === 'pending_review' && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDocumentReview(doc.id, 'approved')}
                          className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          Onayla
                        </button>
                        <button
                          onClick={() => {
                            const notes = prompt('Ret nedeni:');
                            if (notes) handleDocumentReview(doc.id, 'rejected', notes);
                          }}
                          className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                        >
                          Reddet
                        </button>
                        <button
                          onClick={() => {
                            const notes = prompt('Güncelleme notları:');
                            if (notes) handleDocumentReview(doc.id, 'requires_update', notes);
                          }}
                          className="bg-orange-600 text-white px-3 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm"
                        >
                          Güncelleme İste
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Accounting Messages Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Muhasebe Mesajları</h3>
              <div className="flex items-center space-x-2">
                <LanguageSelector
                  selectedLanguage={consultantLanguage}
                  onLanguageChange={updateConsultantLanguage}
                  className="text-sm"
                />
                <button
                  onClick={() => setShowMessageModal(true)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Mesaj Gönder</span>
                </button>
              </div>
            </div>

            {/* Messages Display */}
            <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
              {/* Load and display messages for selected client */}
              <AccountingMessages 
                consultantId={consultantId}
                clientId={selectedClient.id}
                consultantLanguage={consultantLanguage}
              />
            </div>

            {/* Message Composer */}
            <MessageComposer
              onSendMessage={async (msg, lang) => {
                const { error } = await supabase
                  .from('messages')
                  .insert({
                    sender_id: consultantId,
                    recipient_id: selectedClient.id,
                    message: msg,
                    original_language: lang,
                    message_type: 'accounting',
                    needs_translation: true
                  });

                if (error) throw error;
                loadClientDocuments();
              }}
              userLanguage={consultantLanguage}
              recipientLanguage={selectedClient?.language}
              placeholder="Müşteriye mesaj yazın..."
            />
          </div>
        </div>
      )}

      {/* Document Request Modal */}
      {showRequestModal && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Belge Talep Et</h3>
              <button
                onClick={() => setShowRequestModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSendRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Talep Başlığı *
                </label>
                <input
                  type="text"
                  value={requestForm.title}
                  onChange={(e) => setRequestForm({...requestForm, title: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Örn: Ocak Ayı Gider Belgeleri"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Talep Mesajı *
                </label>
                <textarea
                  value={requestForm.message}
                  onChange={(e) => setRequestForm({...requestForm, message: e.target.value})}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Hangi belgelere ihtiyacınız olduğunu detaylı açıklayın..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Öncelik
                </label>
                <select
                  value={requestForm.priority}
                  onChange={(e) => setRequestForm({...requestForm, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="normal">Normal</option>
                  <option value="high">Yüksek</option>
                  <option value="urgent">Acil</option>
                </select>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Talep Gönder</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Müşteriye Mesaj</h3>
              <button
                onClick={() => setShowMessageModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konu *
                </label>
                <input
                  type="text"
                  value={messageForm.subject}
                  onChange={(e) => setMessageForm({...messageForm, subject: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Mesaj konusu..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mesaj *
                </label>
                <textarea
                  value={messageForm.message}
                  onChange={(e) => setMessageForm({...messageForm, message: e.target.value})}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Mesajınızı yazın..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Gönder</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowMessageModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Separate component for accounting messages
const AccountingMessages: React.FC<{
  consultantId: string;
  clientId: string;
  consultantLanguage: string;
}> = ({ consultantId, clientId, consultantLanguage }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, [consultantId, clientId]);

  const loadMessages = async () => {
    try {
      const { data: messagesData } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users!messages_sender_id_fkey(first_name, last_name, role, language)
        `)
      setMessages(messagesData || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };
        .or(`and(sender_id.eq.${consultantId},recipient_id.eq.${clientId}),and(sender_id.eq.${clientId},recipient_id.eq.${consultantId})`)
  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
      </div>
    );
  }
        .eq('message_type', 'accounting')
  if (messages.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Henüz muhasebe mesajı bulunmuyor.</p>
      </div>
    );
  }
        .order('created_at', { ascending: true });
  return (
    <>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`border rounded-xl p-4 transition-colors ${
            message.sender_id === consultantId 
              ? 'border-purple-200 bg-purple-50 ml-8' 
              : 'border-blue-200 bg-blue-50 mr-8'
          }`}
        >
          <div className="flex items-start space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              message.sender_id === consultantId 
                ? 'bg-purple-100' 
                : 'bg-blue-100'
            }`}>
              <User className={`h-5 w-5 ${
                message.sender_id === consultantId 
                  ? 'text-purple-600' 
                  : 'text-blue-600'
              }`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">
                  {message.sender_id === consultantId 
                    ? 'Ben (Danışman)' 
                    : `${message.sender?.first_name} ${message.sender?.last_name} (Müşteri)`}
                </h4>
                <div className="flex items-center space-x-2">
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
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ConsultantAccountingModule;
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { translationService } from '../../../lib/translation';
import TranslatedMessage from '../../shared/TranslatedMessage';
import LanguageSelector from '../../shared/LanguageSelector';
import MessageComposer from '../../shared/MessageComposer';
import { useMessageTranslation } from '../../../hooks/useMessageTranslation';
import { 
  Calculator, 
  Upload, 
  FileText, 
  Calendar, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  MessageSquare,
  Download,
  Eye,
  Plus,
  Filter,
  Search,
  RefreshCw,
  User,
  Send,
  Paperclip,
  X
} from 'lucide-react';

interface AccountingModuleProps {
  clientId: string;
}

const AccountingModule: React.FC<AccountingModuleProps> = ({ clientId }) => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('documents');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [userLanguage, setUserLanguage] = useState('tr'); // Default to Turkish for Turkish clients

  // Use translation hook
  const { processingTranslations } = useMessageTranslation(clientId, userLanguage);

  const [uploadForm, setUploadForm] = useState({
    document_type: '',
    period: '',
    description: '',
    file: null as File | null
  });

  const [messageForm, setMessageForm] = useState({
    subject: '',
    message: '',
    priority: 'normal'
  });

  // Load user language preference
  useEffect(() => {
    const loadUserLanguage = async () => {
      try {
        const { data: userData } = await supabase
          .from('users')
          .select('language')
          .eq('id', clientId)
          .maybeSingle();

        if (userData?.language) {
          setUserLanguage(userData.language);
        }
      } catch (error) {
        console.error('Error loading user language:', error);
      }
    };

    if (clientId) {
      loadUserLanguage();
    }
  }, [clientId]);

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
    loadAccountingData();
  }, [clientId]);

  const loadAccountingData = async () => {
    try {
      setLoading(true);

      // Load client documents
      const { data: docsData } = await supabase
        .from('client_documents')
        .select(`
          *,
          application:applications(service_type, countries(name, flag_emoji))
        `)
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      // Load document requests from consultant
      const { data: requestsData } = await supabase
        .from('client_notifications')
        .select('*')
        .eq('client_id', clientId)
        .eq('notification_type', 'document_request')
        .order('created_at', { ascending: false });

      // Load accounting messages
      const { data: messagesData } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users!messages_sender_id_fkey(first_name, last_name, role, language)
        `)
        .or(`sender_id.eq.${clientId},recipient_id.eq.${clientId}`)
        .eq('message_type', 'accounting')
        .order('created_at', { ascending: false });

      setDocuments(docsData || []);
      setRequests(requestsData || []);
      setMessages(messagesData || []);
    } catch (error) {
      console.error('Error loading accounting data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadForm.file) {
      alert('Lütfen bir dosya seçin.');
      return;
    }

    try {
      // In a real implementation, you would upload to Supabase Storage
      const fileUrl = `documents/${Date.now()}_${uploadForm.file.name}`;

      const { error } = await supabase
        .from('client_documents')
        .insert({
          client_id: clientId,
          document_name: uploadForm.file.name,
          document_type: uploadForm.document_type,
          file_url: fileUrl,
          file_size: uploadForm.file.size,
          mime_type: uploadForm.file.type,
          upload_source: 'client',
          status: 'pending_review',
          is_required: false
        });

      if (error) throw error;

      // Reset form and reload
      setUploadForm({
        document_type: '',
        period: '',
        description: '',
        file: null
      });
      setShowUploadModal(false);
      loadAccountingData();
      alert('Belge başarıyla yüklendi!');
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Belge yüklenirken hata oluştu.');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Detect message language
      const detectedLanguage = await translationService.detectLanguage(messageForm.message);
      
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: clientId,
          message: messageForm.message,
          original_language: detectedLanguage,
          message_type: 'accounting',
          needs_translation: true,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      setMessageForm({
        subject: '',
        message: '',
        priority: 'normal'
      });
      setShowMessageModal(false);
      loadAccountingData();
      alert('Mesaj gönderildi!');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Mesaj gönderilirken hata oluştu.');
    }
  };

  const updateUserLanguage = async (newLanguage: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ language: newLanguage })
        .eq('id', clientId);

      if (error) throw error;
      setUserLanguage(newLanguage);
    } catch (error) {
      console.error('Error updating user language:', error);
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

  const filteredDocuments = documents.filter(doc => {
    const matchesFilter = filter === 'all' || doc.status === filter;
    const matchesSearch = searchTerm === '' || 
      doc.document_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getDocumentTypeLabel(doc.document_type).toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const pendingRequests = requests.filter(req => !req.is_read);
  const totalDocuments = documents.length;
  const approvedDocuments = documents.filter(doc => doc.status === 'approved').length;
  const pendingDocuments = documents.filter(doc => doc.status === 'pending_review').length;

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
            <Calculator className="h-6 w-6 mr-3 text-blue-600" />
            Muhasebe Merkezi
          </h2>
          <div className="flex items-center space-x-3">
            <LanguageSelector
              selectedLanguage={userLanguage}
              onLanguageChange={updateUserLanguage}
              className="text-sm"
            />
            {pendingRequests.length > 0 && (
              <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                {pendingRequests.length} eksik belge talebi
              </div>
            )}
            <button
              onClick={loadAccountingData}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-900">{totalDocuments}</div>
            <div className="text-sm text-blue-700">Toplam Belge</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-900">{approvedDocuments}</div>
            <div className="text-sm text-green-700">Onaylanan</div>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-900">{pendingDocuments}</div>
            <div className="text-sm text-yellow-700">İncelenen</div>
          </div>
          <div className="bg-red-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-red-900">{pendingRequests.length}</div>
            <div className="text-sm text-red-700">Eksik Belge</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { key: 'documents', label: 'Belgelerim', icon: FileText },
            { key: 'requests', label: 'Belge Talepleri', icon: AlertTriangle },
            { key: 'messages', label: 'Muhasebe Mesajları', icon: MessageSquare }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {tab.key === 'requests' && pendingRequests.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-1">
                  {pendingRequests.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'documents' && (
          <div>
            {/* Actions Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Belge ara..."
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
                  <option value="all">Tüm Belgeler</option>
                  <option value="pending_review">İnceleniyor</option>
                  <option value="approved">Onaylandı</option>
                  <option value="rejected">Reddedildi</option>
                  <option value="requires_update">Güncelleme Gerekli</option>
                </select>
              </div>
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>Belge Yükle</span>
              </button>
            </div>

            {/* Documents Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Henüz belge bulunmuyor.</p>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    İlk Belgenizi Yükleyin
                  </button>
                </div>
              ) : (
                filteredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{doc.document_name}</h3>
                        <p className="text-sm text-gray-600">{getDocumentTypeLabel(doc.document_type)}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                        {getStatusLabel(doc.status)}
                      </span>
                    </div>

                    <div className="text-xs text-gray-500 mb-3">
                      Yükleme: {new Date(doc.created_at).toLocaleDateString('tr-TR')}
                    </div>

                    {doc.consultant_notes && (
                      <div className="bg-blue-50 rounded-lg p-3 mb-3">
                        <p className="text-sm text-blue-800">
                          <strong>Danışman Notu:</strong> {doc.consultant_notes}
                        </p>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center justify-center">
                        <Eye className="h-4 w-4 mr-1" />
                        Görüntüle
                      </button>
                      <button className="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded-lg hover:bg-blue-200 transition-colors text-sm flex items-center justify-center">
                        <Download className="h-4 w-4 mr-1" />
                        İndir
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Danışman Belge Talepleri</h3>
              <button
                onClick={() => setShowMessageModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Danışmana Mesaj</span>
              </button>
            </div>

            <div className="space-y-4">
              {requests.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-600">Bekleyen belge talebi bulunmuyor.</p>
                </div>
              ) : (
                requests.map((request) => (
                  <div
                    key={request.id}
                    className={`border rounded-xl p-4 ${
                      !request.is_read ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{request.title}</h3>
                          {!request.is_read && (
                            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                              YENİ
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3">{request.message}</p>
                        <div className="text-sm text-gray-500">
                          {new Date(request.created_at).toLocaleDateString('tr-TR')} tarihinde talep edildi
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setShowUploadModal(true)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          Belge Yükle
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Muhasebe Mesajları</h3>
              <div className="flex items-center space-x-2">
                <LanguageSelector
                  selectedLanguage={userLanguage}
                  onLanguageChange={updateUserLanguage}
                  className="text-sm"
                />
                <button
                  onClick={() => setShowMessageModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Yeni Mesaj</span>
                </button>
              </div>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Henüz muhasebe mesajı bulunmuyor.</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`border rounded-xl p-4 transition-colors ${
                      message.sender_id === clientId 
                        ? 'border-blue-200 bg-blue-50 ml-8' 
                        : 'border-gray-200 bg-white mr-8'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        message.sender_id === clientId 
                          ? 'bg-blue-100' 
                          : 'bg-purple-100'
                      }`}>
                        <User className={`h-5 w-5 ${
                          message.sender_id === clientId 
                            ? 'text-blue-600' 
                            : 'text-purple-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">
                            {message.sender_id === clientId 
                              ? 'Ben' 
                              : `${message.sender?.first_name} ${message.sender?.last_name}`}
                          </h4>
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
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Real-time message composer */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Danışmanınıza Mesaj Gönderin</h4>
              <MessageComposer
                onSendMessage={async (msg, lang) => {
                  const { error } = await supabase
                    .from('messages')
                    .insert({
                      sender_id: clientId,
                      message: msg,
                      original_language: lang,
                      message_type: 'accounting',
                      needs_translation: true
                    });

                  if (error) throw error;
                  loadAccountingData();
                }}
                userLanguage={userLanguage}
                placeholder="Danışmanınıza mesaj yazın..."
              />
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Belge Yükle</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleFileUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Belge Türü *
                </label>
                <select
                  value={uploadForm.document_type}
                  onChange={(e) => setUploadForm({...uploadForm, document_type: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Belge türü seçin</option>
                  {documentTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dönem (Opsiyonel)
                </label>
                <input
                  type="month"
                  value={uploadForm.period}
                  onChange={(e) => setUploadForm({...uploadForm, period: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama
                </label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Belge hakkında açıklama..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dosya *
                </label>
                <input
                  type="file"
                  onChange={(e) => setUploadForm({...uploadForm, file: e.target.files?.[0] || null})}
                  required
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Desteklenen formatlar: PDF, JPG, PNG, DOC, XLS (Max 10MB)
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Yükle
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
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
      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Danışmana Mesaj</h3>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Mesajınızı yazın..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Öncelik
                </label>
                <select
                  value={messageForm.priority}
                  onChange={(e) => setMessageForm({...messageForm, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="normal">Normal</option>
                  <option value="high">Yüksek</option>
                  <option value="urgent">Acil</option>
                </select>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
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

export default AccountingModule;
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
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
  X,
  DollarSign,
  CreditCard,
  Bell,
  Star,
  Building2,
  Mail,
  Globe,
  TrendingUp
} from 'lucide-react';

interface EnhancedAccountingModuleProps {
  clientId: string;
}

const EnhancedAccountingModule: React.FC<EnhancedAccountingModuleProps> = ({ clientId }) => {
  const [accountingData, setAccountingData] = useState({
    documents: [] as any[],
    payments: [] as any[],
    messages: [] as any[],
    requests: [] as any[]
  });
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [userLanguage, setUserLanguage] = useState('tr');

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

  const documentTypes = [
    { value: 'income_statement', label: 'Gelir Belgesi', icon: '💰' },
    { value: 'expense_receipt', label: 'Gider Makbuzu', icon: '🧾' },
    { value: 'bank_statement', label: 'Banka Ekstresi', icon: '🏦' },
    { value: 'invoice', label: 'Fatura', icon: '📄' },
    { value: 'contract', label: 'Sözleşme', icon: '📋' },
    { value: 'tax_document', label: 'Vergi Belgesi', icon: '🏛️' },
    { value: 'payroll', label: 'Bordro', icon: '👥' },
    { value: 'other', label: 'Diğer', icon: '📁' }
  ];

  useEffect(() => {
    loadAccountingData();
    loadUserLanguage();
    subscribeToRealTimeUpdates();
  }, [clientId]);

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

  const loadAccountingData = async () => {
    try {
      setLoading(true);
      console.log('🔍 [CLIENT-ACCOUNTING] Loading data for client:', clientId);
      
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/accounting-data`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: clientId
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ [CLIENT-ACCOUNTING] Data loaded:', result.data);
        setAccountingData(result.data || {
          documents: [],
          payments: [],
          messages: [],
          requests: []
        });
      } else {
        // Fallback to mock data for development
        console.log('⚠️ [CLIENT-ACCOUNTING] Using mock data');
        setAccountingData({
          documents: [
            {
              id: '1',
              client_id: clientId,
              document_name: 'Ocak Ayı Gelir Belgesi.pdf',
              document_type: 'income_statement',
              status: 'approved',
              upload_source: 'client',
              created_at: new Date().toISOString(),
              consultant_notes: 'Belge onaylandı ve muhasebe kaydı yapıldı.',
              file_size: 245760
            },
            {
              id: '2',
              client_id: clientId,
              document_name: 'Banka Ekstresi - Aralık.pdf',
              document_type: 'bank_statement',
              status: 'pending_review',
              upload_source: 'client',
              created_at: new Date(Date.now() - 86400000).toISOString(),
              consultant_notes: null,
              file_size: 512000
            }
          ],
          payments: [
            {
              id: '1',
              client_id: clientId,
              payment_type: 'accounting_fee',
              description: 'Aylık muhasebe hizmet ücreti',
              amount: 299.00,
              currency: 'USD',
              due_date: '2025-02-15',
              status: 'pending',
              recurring: true,
              recurring_interval: 'monthly',
              created_at: new Date().toISOString(),
              consultant: {
                first_name: 'Nino',
                last_name: 'Kvaratskhelia'
              },
              country: {
                name: 'Georgia',
                flag_emoji: '🇬🇪'
              }
            },
            {
              id: '2',
              client_id: clientId,
              payment_type: 'virtual_address',
              description: 'Aylık sanal adres yenileme ücreti',
              amount: 50.00,
              currency: 'USD',
              due_date: '2025-01-28',
              status: 'overdue',
              recurring: true,
              recurring_interval: 'monthly',
              created_at: new Date(Date.now() - 172800000).toISOString(),
              consultant: {
                first_name: 'Nino',
                last_name: 'Kvaratskhelia'
              },
              country: {
                name: 'Georgia',
                flag_emoji: '🇬🇪'
              }
            }
          ],
          messages: [
            {
              id: '1',
              sender_id: 'c3d4e5f6-a7b8-4012-8456-789012cdefab', // Nino's ID
              recipient_id: clientId,
              message: 'Merhaba! Ocak ayı belgelerinizi kontrol ettim. Gelir belgesi onaylandı.',
              original_language: 'tr',
              message_type: 'accounting',
              is_read: false,
              created_at: new Date(Date.now() - 3600000).toISOString(),
              sender: {
                first_name: 'Nino',
                last_name: 'Kvaratskhelia',
                role: 'consultant',
                language: 'tr'
              }
            }
          ],
          requests: [
            {
              id: '1',
              client_id: clientId,
              title: 'Şubat Ayı Gider Belgeleri',
              message: 'Şubat ayına ait tüm gider belgelerinizi (faturalar, makbuzlar) yüklemeniz gerekiyor.',
              priority: 'high',
              is_read: false,
              created_at: new Date(Date.now() - 7200000).toISOString(),
              consultant_id: 'c3d4e5f6-a7b8-4012-8456-789012cdefab'
            }
          ]
        });
      }
    } catch (error) {
      console.error('❌ [CLIENT-ACCOUNTING] Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToRealTimeUpdates = () => {
    // Subscribe to document changes
    const documentSubscription = supabase
      .channel('client-documents-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'client_documents',
          filter: `client_id=eq.${clientId}`
        },
        () => {
          console.log('🔄 [CLIENT-ACCOUNTING] Document updated, reloading...');
          loadAccountingData();
        }
      )
      .subscribe();

    // Subscribe to payment changes
    const paymentSubscription = supabase
      .channel('client-payments-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'client_payment_schedules',
          filter: `client_id=eq.${clientId}`
        },
        () => {
          console.log('🔄 [CLIENT-ACCOUNTING] Payment updated, reloading...');
          loadAccountingData();
        }
      )
      .subscribe();

    // Subscribe to new messages
    const messageSubscription = supabase
      .channel('client-messages-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${clientId}`
        },
        (payload) => {
          if (payload.new.message_type === 'accounting') {
            console.log('🔄 [CLIENT-ACCOUNTING] New accounting message, reloading...');
            loadAccountingData();
          }
        }
      )
      .subscribe();

    return () => {
      documentSubscription.unsubscribe();
      paymentSubscription.unsubscribe();
      messageSubscription.unsubscribe();
    };
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadForm.file) {
      alert('Lütfen bir dosya seçin.');
      return;
    }

    try {
      // Upload file to Supabase Storage
      const fileExt = uploadForm.file.name.split('.').pop();
      const fileName = `${Date.now()}_${uploadForm.file.name}`;
      const filePath = `client-documents/${clientId}/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, uploadForm.file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      // Create document record
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/accounting-actions`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'upload_document',
          payload: {
            client_id: clientId,
            document_name: uploadForm.file.name,
            document_type: uploadForm.document_type,
            file_url: publicUrl,
            file_size: uploadForm.file.size,
            mime_type: uploadForm.file.type,
            description: uploadForm.description,
            consultant_id: 'c3d4e5f6-a7b8-4012-8456-789012cdefab' // Nino's ID for notification
          }
        })
      });

      if (!response.ok) throw new Error('Document upload failed');

      // Reset form and reload
      setUploadForm({
        document_type: '',
        period: '',
        description: '',
        file: null
      });
      setShowUploadModal(false);
      loadAccountingData();
      alert('✅ Belge başarıyla yüklendi!');
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('❌ Belge yüklenirken hata oluştu.');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/accounting-actions`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'send_accounting_message',
          payload: {
            sender_id: clientId,
            recipient_id: 'c3d4e5f6-a7b8-4012-8456-789012cdefab', // Nino's ID
            message: messageForm.message,
            original_language: userLanguage,
            message_type: 'accounting'
          }
        })
      });

      if (!response.ok) throw new Error('Message send failed');

      setMessageForm({
        subject: '',
        message: '',
        priority: 'normal'
      });
      setShowMessageModal(false);
      loadAccountingData();
      alert('✅ Mesaj gönderildi!');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('❌ Mesaj gönderilirken hata oluştu.');
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

  const getDocumentTypeInfo = (type: string) => {
    return documentTypes.find(dt => dt.value === type) || { value: type, label: type, icon: '📁' };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending_review': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'requires_update': return 'bg-orange-100 text-orange-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'approved': 'Onaylandı',
      'pending_review': 'İnceleniyor',
      'rejected': 'Reddedildi',
      'requires_update': 'Güncelleme Gerekli',
      'paid': 'Ödendi',
      'pending': 'Bekliyor',
      'overdue': 'Gecikti'
    };
    return labels[status] || status;
  };

  const getPaymentUrgency = (payment: any) => {
    if (payment.status === 'paid') return 'paid';
    
    const dueDate = new Date(payment.due_date);
    const today = new Date();
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDue < 0) return 'overdue';
    if (daysUntilDue <= 3) return 'urgent';
    if (daysUntilDue <= 7) return 'soon';
    return 'upcoming';
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const filteredDocuments = accountingData.documents.filter(doc => {
    const matchesFilter = filter === 'all' || doc.status === filter;
    const matchesSearch = searchTerm === '' || 
      doc.document_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getDocumentTypeInfo(doc.document_type).label.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const pendingRequests = accountingData.requests.filter(req => !req.is_read);
  const overduePayments = accountingData.payments.filter(p => getPaymentUrgency(p) === 'overdue');
  const upcomingPayments = accountingData.payments.filter(p => 
    getPaymentUrgency(p) === 'urgent' || getPaymentUrgency(p) === 'soon'
  );

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Muhasebe Bilgileri Yükleniyor...</h3>
          <p className="text-gray-600">Belgeler, ödemeler ve mesajlar alınıyor.</p>
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
            {(pendingRequests.length > 0 || overduePayments.length > 0) && (
              <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                <Bell className="h-3 w-3" />
                <span>{pendingRequests.length + overduePayments.length} acil</span>
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

        {/* Alert Banner */}
        {(pendingRequests.length > 0 || overduePayments.length > 0) && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-900">Dikkat Gereken Konular</h3>
                <div className="text-sm text-red-700 space-y-1">
                  {pendingRequests.length > 0 && (
                    <p>• {pendingRequests.length} belge talebi bekliyor</p>
                  )}
                  {overduePayments.length > 0 && (
                    <p>• {overduePayments.length} ödeme gecikmiş</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
          <div className="bg-blue-50 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-blue-900">{accountingData.documents.length}</div>
            <div className="text-sm text-blue-700">Toplam Belge</div>
          </div>
          <div className="bg-green-50 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-green-900">
              {accountingData.documents.filter(d => d.status === 'approved').length}
            </div>
            <div className="text-sm text-green-700">Onaylanan</div>
          </div>
          <div className="bg-yellow-50 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-yellow-900">
              {accountingData.documents.filter(d => d.status === 'pending_review').length}
            </div>
            <div className="text-sm text-yellow-700">İncelenen</div>
          </div>
          <div className="bg-red-50 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-red-900">{overduePayments.length}</div>
            <div className="text-sm text-red-700">Geciken Ödeme</div>
          </div>
          <div className="bg-purple-50 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-purple-900">{accountingData.messages.length}</div>
            <div className="text-sm text-purple-700">Mesaj</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { key: 'overview', label: 'Genel Bakış', icon: TrendingUp },
            { key: 'documents', label: 'Belgelerim', icon: FileText, badge: accountingData.documents.filter(d => d.status === 'pending_review').length },
            { key: 'payments', label: 'Ödemelerim', icon: CreditCard, badge: overduePayments.length },
            { key: 'requests', label: 'Talepler', icon: AlertTriangle, badge: pendingRequests.length },
            { key: 'messages', label: 'Mesajlar', icon: MessageSquare, badge: accountingData.messages.filter(m => !m.is_read).length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors relative ${
                activeTab === tab.key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {tab.badge && tab.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Muhasebe Durumu</h3>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setShowUploadModal(true)}
                className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl hover:shadow-lg transition-all duration-300 text-left"
              >
                <Upload className="h-8 w-8 text-blue-600 mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Belge Yükle</h4>
                <p className="text-sm text-gray-600">Muhasebe belgelerinizi yükleyin</p>
              </button>
              
              <button
                onClick={() => setActiveTab('payments')}
                className="p-6 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl hover:shadow-lg transition-all duration-300 text-left"
              >
                <CreditCard className="h-8 w-8 text-green-600 mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Ödemelerim</h4>
                <p className="text-sm text-gray-600">Ödeme durumunuzu kontrol edin</p>
              </button>
              
              <button
                onClick={() => setShowMessageModal(true)}
                className="p-6 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl hover:shadow-lg transition-all duration-300 text-left"
              >
                <MessageSquare className="h-8 w-8 text-purple-600 mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Mesaj Gönder</h4>
                <p className="text-sm text-gray-600">Danışmanınızla iletişim kurun</p>
              </button>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Son Aktiviteler</h4>
              <div className="space-y-3">
                {[
                  ...accountingData.documents.slice(0, 2).map(doc => ({
                    type: 'document',
                    title: `Belge yüklendi: ${doc.document_name}`,
                    time: doc.created_at,
                    status: doc.status
                  })),
                  ...accountingData.payments.slice(0, 2).map(pay => ({
                    type: 'payment',
                    title: `Ödeme: ${pay.description}`,
                    time: pay.created_at,
                    status: pay.status
                  })),
                  ...accountingData.messages.slice(0, 2).map(msg => ({
                    type: 'message',
                    title: `Mesaj: ${msg.message.substring(0, 50)}...`,
                    time: msg.created_at,
                    status: msg.is_read ? 'read' : 'unread'
                  }))
                ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'document' ? 'bg-blue-100' :
                      activity.type === 'payment' ? 'bg-green-100' :
                      'bg-purple-100'
                    }`}>
                      {activity.type === 'document' && <FileText className="h-4 w-4 text-blue-600" />}
                      {activity.type === 'payment' && <DollarSign className="h-4 w-4 text-green-600" />}
                      {activity.type === 'message' && <MessageSquare className="h-4 w-4 text-purple-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500">{formatDate(activity.time)}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                      {getStatusLabel(activity.status)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

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
                filteredDocuments.map((doc) => {
                  const docType = getDocumentTypeInfo(doc.document_type);
                  
                  return (
                    <div key={doc.id} className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{docType.icon}</span>
                          <div>
                            <h4 className="font-semibold text-gray-900">{doc.document_name}</h4>
                            <p className="text-sm text-gray-600">{docType.label}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                          {getStatusLabel(doc.status)}
                        </span>
                      </div>

                      <div className="text-xs text-gray-500 mb-3">
                        <div>Yükleme: {formatDate(doc.created_at)}</div>
                        <div>Boyut: {(doc.file_size / 1024).toFixed(1)} KB</div>
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
                  );
                })
              )}
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Ödeme Durumum</h3>
            
            <div className="space-y-4">
              {accountingData.payments.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Henüz ödeme kaydı bulunmuyor.</p>
                </div>
              ) : (
                accountingData.payments.map((payment) => {
                  const urgency = getPaymentUrgency(payment);
                  const isOverdue = urgency === 'overdue';
                  
                  return (
                    <div
                      key={payment.id}
                      className={`border rounded-xl p-4 transition-colors ${
                        isOverdue ? 'border-red-300 bg-red-50' : 
                        payment.status === 'paid' ? 'border-green-300 bg-green-50' :
                        'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            payment.status === 'paid' ? 'bg-green-100' :
                            isOverdue ? 'bg-red-100' :
                            'bg-orange-100'
                          }`}>
                            {payment.status === 'paid' ? (
                              <CheckCircle className="h-6 w-6 text-green-600" />
                            ) : isOverdue ? (
                              <AlertTriangle className="h-6 w-6 text-red-600" />
                            ) : (
                              <Clock className="h-6 w-6 text-orange-600" />
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold text-gray-900">{payment.description}</h4>
                              <span className="text-lg">{payment.country?.flag_emoji}</span>
                              {payment.recurring && (
                                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                                  Tekrarlanan
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              Danışman: {payment.consultant?.first_name} {payment.consultant?.last_name}
                            </p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-sm text-gray-500">
                                Vade: {formatDate(payment.due_date)}
                              </span>
                              {isOverdue && (
                                <span className="text-sm font-medium text-red-600">
                                  {Math.abs(Math.ceil((new Date(payment.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} gün gecikti
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-900">
                            {formatCurrency(payment.amount, payment.currency)}
                          </div>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                            {getStatusLabel(payment.status)}
                          </span>
                          {payment.status !== 'paid' && (
                            <button className="block w-full mt-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                              Öde
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Belge Talepleri</h3>
            
            <div className="space-y-4">
              {pendingRequests.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-600">Bekleyen belge talebi bulunmuyor.</p>
                </div>
              ) : (
                pendingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="border border-red-300 bg-red-50 rounded-xl p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{request.title}</h3>
                          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            YENİ TALEP
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{request.message}</p>
                        <div className="text-sm text-gray-500">
                          {formatDate(request.created_at)} tarihinde talep edildi
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
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Muhasebe Mesajları</h3>
              <button
                onClick={() => setShowMessageModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>Yeni Mesaj</span>
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {accountingData.messages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Henüz muhasebe mesajı bulunmuyor.</p>
                </div>
              ) : (
                accountingData.messages.map((message) => (
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
                              : `${message.sender?.first_name} ${message.sender?.last_name} (Danışman)`}
                          </h4>
                          <div className="flex items-center space-x-2">
                            {processingTranslations.includes(message.id) && (
                              <div className="flex items-center space-x-1 text-xs text-blue-600">
                                <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-600"></div>
                                <span>Çevriliyor...</span>
                              </div>
                            )}
                            <span className="text-sm text-gray-500">
                              {formatDate(message.created_at)}
                            </span>
                          </div>
                        </div>
                        
                        <TranslatedMessage
                          originalMessage={message.message}
                          translatedMessage={message.translated_message}
                          originalLanguage={message.original_language || 'tr'}
                          translatedLanguage={message.translated_language}
                          userLanguage={userLanguage}
                          showTranslationToggle={true}
                        />
                        
                        {!message.is_read && message.recipient_id === clientId && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full mt-2 inline-block">
                            Yeni
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Composer */}
            <div className="pt-6 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Danışmanınıza Mesaj Gönder</h4>
              <MessageComposer
                onSendMessage={async (msg, lang) => {
                  const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/accounting-actions`;
                  
                  const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      action: 'send_accounting_message',
                      payload: {
                        sender_id: clientId,
                        recipient_id: 'c3d4e5f6-a7b8-4012-8456-789012cdefab', // Nino's ID
                        message: msg,
                        original_language: lang,
                        message_type: 'accounting'
                      }
                    })
                  });

                  if (!response.ok) throw new Error('Message send failed');
                  loadAccountingData();
                }}
                userLanguage={userLanguage}
                recipientLanguage="tr"
                placeholder="Danışmanınıza muhasebe mesajı yazın..."
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
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
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

export default EnhancedAccountingModule;
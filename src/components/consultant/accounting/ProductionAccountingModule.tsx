import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import TranslatedMessage from '../../shared/TranslatedMessage';
import LanguageSelector from '../../shared/LanguageSelector';
import MessageComposer from '../../shared/MessageComposer';
import { useMessageTranslation } from '../../../hooks/useMessageTranslation';
import ClientDataManager from '../../../lib/clientDataManager';
import { 
  Calculator, 
  Search, 
  Filter, 
  Users, 
  FileText, 
  CreditCard,
  MessageSquare,
  StickyNote,
  RefreshCw,
  Plus,
  Upload,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  DollarSign,
  Calendar,
  User,
  Globe,
  Send,
  Edit,
  Trash2,
  Bell,
  Star,
  Building2,
  Mail,
  Phone,
  MapPin,
  Tag,
  Archive,
  TrendingUp,
  BarChart3
} from 'lucide-react';

interface ProductionAccountingModuleProps {
  consultantId: string;
  countryId: number;
}

interface ClientData {
  client_id: string;
  full_name: string;
  email: string;
  company_name?: string;
  business_type?: string;
  language: string;
  country_name: string;
  client_since: string;
  assigned_at: string;
  consultant_id: string;
  applications_count: number;
  total_revenue: number;
}

interface AccountingData {
  documents: any[];
  payments: any[];
  messages: any[];
  requests: any[];
  consultant_notes: any[];
}

const ProductionAccountingModule: React.FC<ProductionAccountingModuleProps> = ({ consultantId, countryId }) => {
  // State Management
  const [clients, setClients] = useState<ClientData[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);
  const [accountingData, setAccountingData] = useState<AccountingData>({
    documents: [],
    payments: [],
    messages: [],
    requests: [],
    consultant_notes: []
  });
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('last_message');
  
  // Modal States
  const [showDocumentRequest, setShowDocumentRequest] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  
  // Form States
  const [documentRequestForm, setDocumentRequestForm] = useState({
    title: '',
    message: '',
    document_types: [] as string[],
    priority: 'normal',
    due_date: ''
  });
  
  const [paymentForm, setPaymentForm] = useState({
    payment_type: 'accounting_fee',
    description: '',
    amount: '',
    currency: 'USD',
    due_date: '',
    recurring: false,
    recurring_interval: ''
  });
  
  const [noteForm, setNoteForm] = useState({
    note_type: 'general',
    note_content: '',
    reference_id: ''
  });
  
  const [consultantLanguage, setConsultantLanguage] = useState('tr');
  
  // Translation hook
  const { processingTranslations } = useMessageTranslation(consultantId, consultantLanguage);

  // Constants
  const documentTypes = [
    { value: 'income_statement', label: 'Gelir Belgesi', icon: '💰' },
    { value: 'expense_receipt', label: 'Gider Makbuzu', icon: '🧾' },
    { value: 'bank_statement', label: 'Banka Ekstresi', icon: '🏦' },
    { value: 'invoice', label: 'Fatura', icon: '📄' },
    { value: 'contract', label: 'Sözleşme', icon: '📋' },
    { value: 'tax_document', label: 'Vergi Belgesi', icon: '🏛️' },
    { value: 'payroll', label: 'Bordro', icon: '👥' },
    { value: 'financial_report', label: 'Mali Rapor', icon: '📊' },
    { value: 'other', label: 'Diğer', icon: '📁' }
  ];

  const paymentTypes = [
    { value: 'accounting_fee', label: 'Muhasebe Ücreti' },
    { value: 'tax_payment', label: 'Vergi Ödemesi' },
    { value: 'audit_fee', label: 'Denetim Ücreti' },
    { value: 'consultation_fee', label: 'Danışmanlık Ücreti' },
    { value: 'compliance_fee', label: 'Uyumluluk Ücreti' },
    { value: 'virtual_address', label: 'Sanal Adres' },
    { value: 'company_maintenance', label: 'Şirket Bakım' },
    { value: 'other', label: 'Diğer' }
  ];

  const messageTemplates = [
    {
      title: 'Belge Talebi',
      content: 'Merhaba, muhasebe işlemleriniz için aşağıdaki belgelere ihtiyacımız var:'
    },
    {
      title: 'Ödeme Hatırlatması',
      content: 'Sayın müşterimiz, ödeme tarihiniz yaklaşmaktadır. Lütfen zamanında ödeme yapınız.'
    },
    {
      title: 'Belge Onayı',
      content: 'Gönderdiğiniz belgeler incelendi ve onaylandı. Teşekkür ederiz.'
    },
    {
      title: 'Eksik Bilgi',
      content: 'Muhasebe işlemlerinizi tamamlamak için ek bilgilere ihtiyacımız var.'
    }
  ];

  // Load initial data
  useEffect(() => {
    loadClients();
    loadConsultantLanguage();
  }, [consultantId, countryId]);

  // Load accounting data when client is selected
  useEffect(() => {
    if (selectedClient) {
      loadAccountingData();
      subscribeToRealTimeUpdates();
    }
  }, [selectedClient]);

  const loadConsultantLanguage = async () => {
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('language')
        .eq('id', consultantId)
        .maybeSingle();

      if (userData?.language) {
        setConsultantLanguage(userData.language);
      }
    } catch (error) {
      console.error('Error loading consultant language:', error);
    }
  };

  const loadClients = async () => {
    try {
      setLoading(true);
      console.log('🔍 [ACCOUNTING] Loading clients...');
      
      const clientsData = await ClientDataManager.fetchConsultantClients({
        consultantId,
        countryId,
        search: searchTerm,
        limit: 100,
        offset: 0
      });

      console.log('👥 [ACCOUNTING] Clients loaded:', clientsData.length);
      setClients(clientsData);
      
      // Auto-select first client if none selected
      if (clientsData.length > 0 && !selectedClient) {
        setSelectedClient(clientsData[0]);
      }
    } catch (error) {
      console.error('❌ [ACCOUNTING] Error loading clients:', error);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  const loadAccountingData = async () => {
    if (!selectedClient) return;

    try {
      console.log('🔍 [ACCOUNTING] Loading data for client:', selectedClient.client_id);
      
      const { data, error } = await supabase.functions.invoke('accounting-data', {
        body: {
          client_id: selectedClient.client_id,
          consultant_id: consultantId,
        },
      });
      if (error) {
        throw new Error(`Accounting data API error: ${error.message}`);
      }
      console.log(✅
      
      setAccountingData(result.data || {
        documents: [],
        payments: [],
        messages: [],
        requests: [],
        consultant_notes: []
      });
    } catch (error) {
      console.error('❌ [ACCOUNTING] Error loading data:', error);
      // Set mock data for development
      setAccountingData({
        documents: [
          {
            id: '1',
            client_id: selectedClient.client_id,
            document_name: 'Ocak Ayı Gelir Belgesi.pdf',
            document_type: 'income_statement',
            status: 'pending_review',
            upload_source: 'client',
            created_at: new Date().toISOString(),
            consultant_notes: null,
            file_size: 245760
          },
          {
            id: '2',
            client_id: selectedClient.client_id,
            document_name: 'Banka Ekstresi - Aralık.pdf',
            document_type: 'bank_statement',
            status: 'approved',
            upload_source: 'client',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            consultant_notes: 'Belge onaylandı, muhasebe kaydı yapıldı.',
            file_size: 512000
          }
        ],
        payments: [
          {
            id: '1',
            client_id: selectedClient.client_id,
            payment_type: 'accounting_fee',
            description: 'Aylık muhasebe hizmet ücreti',
            amount: 299.00,
            currency: 'USD',
            due_date: '2025-02-15',
            status: 'pending',
            recurring: true,
            recurring_interval: 'monthly',
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            client_id: selectedClient.client_id,
            payment_type: 'tax_payment',
            description: 'Vergi beyannamesi hazırlık ücreti',
            amount: 150.00,
            currency: 'USD',
            due_date: '2025-01-30',
            status: 'overdue',
            recurring: false,
            created_at: new Date(Date.now() - 172800000).toISOString()
          }
        ],
        messages: [
          {
            id: '1',
            sender_id: selectedClient.client_id,
            recipient_id: consultantId,
            message: 'Merhaba, Ocak ayı belgelerimi yükledim. Kontrol edebilir misiniz?',
            original_language: 'tr',
            message_type: 'accounting',
            is_read: false,
            created_at: new Date(Date.now() - 3600000).toISOString(),
            sender: {
              first_name: selectedClient.full_name.split(' ')[0],
              last_name: selectedClient.full_name.split(' ').slice(1).join(' '),
              role: 'client',
              language: 'tr'
            }
          }
        ],
        requests: [
          {
            id: '1',
            client_id: selectedClient.client_id,
            title: 'Şubat Ayı Gider Belgeleri',
            message: 'Şubat ayına ait tüm gider belgelerinizi yüklemeniz gerekiyor.',
            priority: 'high',
            is_read: false,
            created_at: new Date(Date.now() - 7200000).toISOString()
          }
        ],
        consultant_notes: []
      });
    }
  };

  const subscribeToRealTimeUpdates = () => {
    if (!selectedClient) return;

    // Subscribe to document changes
    const documentSubscription = supabase
      .channel('client-documents')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'client_documents',
          filter: `client_id=eq.${selectedClient.client_id}`
        },
        () => {
          loadAccountingData();
        }
      )
      .subscribe();

    // Subscribe to payment changes
    const paymentSubscription = supabase
      .channel('client-payments')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'client_payment_schedules',
          filter: `client_id=eq.${selectedClient.client_id}`
        },
        () => {
          loadAccountingData();
        }
      )
      .subscribe();

    // Subscribe to message changes
    const messageSubscription = supabase
      .channel('accounting-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `message_type=eq.accounting`
        },
        (payload) => {
          if (payload.new.sender_id === selectedClient.client_id || 
              payload.new.recipient_id === selectedClient.client_id) {
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

  // Helper Functions
  const getClientStatus = (client: ClientData) => {
    const hasOverduePayments = accountingData.payments.some(p => 
      p.client_id === client.client_id && 
      p.status === 'pending' && 
      new Date(p.due_date) < new Date()
    );
    
    const hasPendingDocuments = accountingData.documents.some(d => 
      d.client_id === client.client_id && 
      d.status === 'pending_review'
    );
    
    const hasUnreadMessages = accountingData.messages.some(m => 
      m.recipient_id === consultantId && 
      !m.is_read
    );

    if (hasOverduePayments) return { status: 'overdue', label: 'Ödeme Gecikti', color: 'bg-red-100 text-red-800' };
    if (hasPendingDocuments) return { status: 'pending_docs', label: 'Belge Bekliyor', color: 'bg-yellow-100 text-yellow-800' };
    if (hasUnreadMessages) return { status: 'new_message', label: 'Yeni Mesaj', color: 'bg-blue-100 text-blue-800' };
    return { status: 'active', label: 'Aktif', color: 'bg-green-100 text-green-800' };
  };

  const getDocumentTypeInfo = (type: string) => {
    return documentTypes.find(dt => dt.value === type) || { value: type, label: type, icon: '📁' };
  };

  const getPaymentTypeLabel = (type: string) => {
    return paymentTypes.find(pt => pt.value === type)?.label || type;
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

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
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

  // Filter and sort clients
  const filteredClients = clients.filter(client => {
    const matchesSearch = searchTerm === '' || 
      client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    if (statusFilter === 'all') return true;
    
    const clientStatus = getClientStatus(client);
    return clientStatus.status === statusFilter;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.full_name.localeCompare(b.full_name);
      case 'company':
        return (a.company_name || '').localeCompare(b.company_name || '');
      case 'revenue':
        return b.total_revenue - a.total_revenue;
      case 'last_message':
      default:
        return new Date(b.assigned_at).getTime() - new Date(a.assigned_at).getTime();
    }
  });

  // Action Handlers
  const handleSendDocumentRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/accounting-actions`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'request_document',
          payload: {
            client_id: selectedClient.client_id,
            consultant_id: consultantId,
            title: documentRequestForm.title,
            message: documentRequestForm.message,
            priority: documentRequestForm.priority
          }
        })
      });

      if (!response.ok) throw new Error('Document request failed');

      setDocumentRequestForm({
        title: '',
        message: '',
        document_types: [],
        priority: 'normal',
        due_date: ''
      });
      setShowDocumentRequest(false);
      loadAccountingData();
      
      alert('✅ Belge talebi gönderildi!');
    } catch (error) {
      console.error('Error sending document request:', error);
      alert('❌ Belge talebi gönderilirken hata oluştu.');
    }
  };

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/accounting-actions`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_payment_schedule',
          payload: {
            client_id: selectedClient.client_id,
            consultant_id: consultantId,
            payment_type: paymentForm.payment_type,
            description: paymentForm.description,
            amount: paymentForm.amount,
            currency: paymentForm.currency,
            due_date: paymentForm.due_date,
            recurring: paymentForm.recurring,
            recurring_interval: paymentForm.recurring ? paymentForm.recurring_interval : null,
            country_id: 1 // Georgia
          }
        })
      });

      if (!response.ok) throw new Error('Payment creation failed');

      setPaymentForm({
        payment_type: 'accounting_fee',
        description: '',
        amount: '',
        currency: 'USD',
        due_date: '',
        recurring: false,
        recurring_interval: ''
      });
      setShowPaymentModal(false);
      loadAccountingData();
      
      alert('✅ Ödeme talebi oluşturuldu!');
    } catch (error) {
      console.error('Error creating payment:', error);
      alert('❌ Ödeme talebi oluşturulurken hata oluştu.');
    }
  };

  const handleDocumentAction = async (documentId: string, action: string, notes?: string) => {
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/accounting-actions`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update_document_status',
          payload: {
            document_id: documentId,
            status: action,
            notes: notes || null
          }
        })
      });

      if (!response.ok) throw new Error('Document update failed');

      loadAccountingData();
      alert(`✅ Belge ${getStatusLabel(action).toLowerCase()}!`);
    } catch (error) {
      console.error('Error updating document:', error);
      alert('❌ Belge durumu güncellenirken hata oluştu.');
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/accounting-actions`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'add_consultant_note',
          payload: {
            consultant_id: consultantId,
            client_id: selectedClient.client_id,
            note_type: noteForm.note_type,
            note_content: noteForm.note_content,
            reference_id: noteForm.reference_id
          }
        })
      });

      if (!response.ok) throw new Error('Note creation failed');

      setNoteForm({
        note_type: 'general',
        note_content: '',
        reference_id: ''
      });
      setShowNoteModal(false);
      loadAccountingData();
      
      alert('✅ Not eklendi!');
    } catch (error) {
      console.error('Error adding note:', error);
      alert('❌ Not eklenirken hata oluştu.');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Muhasebe Sistemi Yükleniyor...</h3>
          <p className="text-gray-600">Müşteri verileri ve muhasebe bilgileri alınıyor.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Calculator className="h-8 w-8 mr-4 text-purple-600" />
            🇬🇪 Muhasebe Yönetim Merkezi
          </h1>
          <div className="flex items-center space-x-3">
            <LanguageSelector
              selectedLanguage={consultantLanguage}
              onLanguageChange={setConsultantLanguage}
            />
            <button
              onClick={loadClients}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Müşteri ara (ad, email, şirket)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none bg-white"
            >
              <option value="all">Tüm Müşteriler</option>
              <option value="overdue">Ödeme Gecikmiş</option>
              <option value="pending_docs">Belge Bekliyor</option>
              <option value="new_message">Yeni Mesaj</option>
              <option value="active">Aktif</option>
            </select>
          </div>
          
          <div className="relative">
            <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none bg-white"
            >
              <option value="last_message">Son Mesaj</option>
              <option value="name">İsim</option>
              <option value="company">Şirket</option>
              <option value="revenue">Gelir</option>
            </select>
          </div>
          
          <div className="text-sm text-gray-600 flex items-center justify-center">
            <Users className="h-4 w-4 mr-2" />
            {filteredClients.length} / {clients.length} müşteri
          </div>
        </div>

        {/* Client List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          {filteredClients.map((client) => {
            const clientStatus = getClientStatus(client);
            const isSelected = selectedClient?.client_id === client.client_id;
            
            return (
              <button
                key={client.client_id}
                onClick={() => setSelectedClient(client)}
                className={`p-4 border rounded-xl text-left transition-all duration-300 hover:shadow-lg ${
                  isSelected
                    ? 'border-purple-500 bg-purple-50 shadow-lg'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🇬🇪</span>
                    <div>
                      <h3 className="font-bold text-gray-900">{client.full_name}</h3>
                      <p className="text-sm text-gray-600">{client.email}</p>
                      {client.company_name && (
                        <p className="text-xs text-purple-600 font-medium">{client.company_name}</p>
                      )}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${clientStatus.color}`}>
                    {clientStatus.label}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center bg-blue-50 rounded p-2">
                    <div className="font-bold text-blue-900">{client.applications_count || 0}</div>
                    <div className="text-blue-700">Proje</div>
                  </div>
                  <div className="text-center bg-green-50 rounded p-2">
                    <div className="font-bold text-green-900">${client.total_revenue || 0}</div>
                    <div className="text-green-700">Gelir</div>
                  </div>
                  <div className="text-center bg-orange-50 rounded p-2">
                    <div className="font-bold text-orange-900">{client.language?.toUpperCase() || 'TR'}</div>
                    <div className="text-orange-700">Dil</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Arama kriterlerinize uygun müşteri bulunamadı.</p>
          </div>
        )}
      </div>

      {/* Selected Client Dashboard */}
      {selectedClient && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
          {/* Client Summary Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                  <span className="text-3xl">🇬🇪</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedClient.full_name}</h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {selectedClient.email}
                    </span>
                    <span className="flex items-center">
                      <Building2 className="h-4 w-4 mr-1" />
                      {selectedClient.company_name || 'Bireysel'}
                    </span>
                    <span className="flex items-center">
                      <Globe className="h-4 w-4 mr-1" />
                      {selectedClient.language?.toUpperCase() || 'TR'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowDocumentRequest(true)}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>Belge Talep Et</span>
                </button>
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <DollarSign className="h-4 w-4" />
                  <span>Ödeme Oluştur</span>
                </button>
                <button
                  onClick={() => setShowNoteModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <StickyNote className="h-4 w-4" />
                  <span>Not Ekle</span>
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
              <div className="bg-blue-50 rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-blue-900">{accountingData.documents.length}</div>
                <div className="text-sm text-blue-700">Toplam Belge</div>
              </div>
              <div className="bg-yellow-50 rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-yellow-900">
                  {accountingData.documents.filter(d => d.status === 'pending_review').length}
                </div>
                <div className="text-sm text-yellow-700">Bekleyen</div>
              </div>
              <div className="bg-green-50 rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-green-900">
                  {accountingData.payments.filter(p => p.status === 'paid').length}
                </div>
                <div className="text-sm text-green-700">Ödenen</div>
              </div>
              <div className="bg-red-50 rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-red-900">
                  {accountingData.payments.filter(p => getPaymentUrgency(p) === 'overdue').length}
                </div>
                <div className="text-sm text-red-700">Geciken</div>
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
                { key: 'overview', label: 'Genel Bakış', icon: BarChart3 },
                { key: 'documents', label: 'Belgeler', icon: FileText, badge: accountingData.documents.filter(d => d.status === 'pending_review').length },
                { key: 'payments', label: 'Ödemeler', icon: CreditCard, badge: accountingData.payments.filter(p => getPaymentUrgency(p) === 'overdue').length },
                { key: 'messages', label: 'Mesajlar', icon: MessageSquare, badge: accountingData.messages.filter(m => !m.is_read && m.recipient_id === consultantId).length },
                { key: 'notes', label: 'Notlarım', icon: StickyNote }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md text-sm font-medium transition-colors relative ${
                    activeTab === tab.key
                      ? 'bg-white text-purple-600 shadow-sm'
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

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">Müşteri Özeti</h3>
                
                {/* Activity Timeline */}
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

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setShowDocumentRequest(true)}
                    className="p-6 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl hover:shadow-lg transition-all duration-300 text-left"
                  >
                    <Upload className="h-8 w-8 text-orange-600 mb-3" />
                    <h4 className="font-semibold text-gray-900 mb-2">Belge Talep Et</h4>
                    <p className="text-sm text-gray-600">Müşteriden eksik belgeleri talep edin</p>
                  </button>
                  
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="p-6 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl hover:shadow-lg transition-all duration-300 text-left"
                  >
                    <DollarSign className="h-8 w-8 text-green-600 mb-3" />
                    <h4 className="font-semibold text-gray-900 mb-2">Ödeme Oluştur</h4>
                    <p className="text-sm text-gray-600">Yeni ödeme talebi oluşturun</p>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('messages')}
                    className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl hover:shadow-lg transition-all duration-300 text-left"
                  >
                    <MessageSquare className="h-8 w-8 text-blue-600 mb-3" />
                    <h4 className="font-semibold text-gray-900 mb-2">Mesaj Gönder</h4>
                    <p className="text-sm text-gray-600">Müşteri ile iletişim kurun</p>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Belge Yönetimi</h3>
                  <button
                    onClick={() => setShowDocumentRequest(true)}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Belge Talep Et</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {accountingData.documents.length === 0 ? (
                    <div className="col-span-full text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Bu müşteri için belge bulunmuyor.</p>
                    </div>
                  ) : (
                    accountingData.documents.map((doc) => {
                      const docType = getDocumentTypeInfo(doc.document_type);
                      
                      return (
                        <div key={doc.id} className="border border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-colors">
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
                            <div className="bg-purple-50 rounded-lg p-3 mb-3">
                              <p className="text-sm text-purple-800">
                                <strong>Notlarım:</strong> {doc.consultant_notes}
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

                          {doc.status === 'pending_review' && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleDocumentAction(doc.id, 'approved')}
                                  className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors flex items-center space-x-1"
                                >
                                  <CheckCircle className="h-3 w-3" />
                                  <span>Onayla</span>
                                </button>
                                <button
                                  onClick={() => {
                                    const notes = prompt('Ret nedeni:');
                                    if (notes) handleDocumentAction(doc.id, 'rejected', notes);
                                  }}
                                  className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors flex items-center space-x-1"
                                >
                                  <XCircle className="h-3 w-3" />
                                  <span>Reddet</span>
                                </button>
                                <button
                                  onClick={() => {
                                    const notes = prompt('Güncelleme notları:');
                                    if (notes) handleDocumentAction(doc.id, 'requires_update', notes);
                                  }}
                                  className="bg-orange-600 text-white px-3 py-1 rounded text-xs hover:bg-orange-700 transition-colors flex items-center space-x-1"
                                >
                                  <Edit className="h-3 w-3" />
                                  <span>Güncelle</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Ödeme Takibi</h3>
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Yeni Ödeme</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {accountingData.payments.length === 0 ? (
                    <div className="text-center py-8">
                      <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Bu müşteri için ödeme kaydı bulunmuyor.</p>
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
                            'border-gray-200 hover:border-green-300'
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
                                  <h4 className="font-semibold text-gray-900">
                                    {getPaymentTypeLabel(payment.payment_type)}
                                  </h4>
                                  {payment.recurring && (
                                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                                      Tekrarlanan
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600">{payment.description}</p>
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
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Muhasebe Mesajları</h3>
                  <div className="text-sm text-gray-500">
                    {accountingData.messages.length} mesaj
                  </div>
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
                              <h4 className="font-semibold text-gray-900">
                                {message.sender_id === consultantId 
                                  ? 'Ben (Danışman)' 
                                  : `${selectedClient.full_name} (Müşteri)`}
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
                              userLanguage={consultantLanguage}
                              showTranslationToggle={true}
                            />
                            
                            {!message.is_read && message.recipient_id === consultantId && (
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
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    {selectedClient.full_name}'a Mesaj Gönder
                  </h4>
                  
                  {/* Message Templates */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                    {messageTemplates.map((template, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          // Auto-fill message composer with template
                          const event = new CustomEvent('fillMessage', { 
                            detail: { message: template.content } 
                          });
                          window.dispatchEvent(event);
                        }}
                        className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs text-left transition-colors"
                      >
                        <div className="font-medium text-gray-900">{template.title}</div>
                        <div className="text-gray-600 truncate">{template.content.substring(0, 30)}...</div>
                      </button>
                    ))}
                  </div>

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
                            sender_id: consultantId,
                            recipient_id: selectedClient.client_id,
                            message: msg,
                            original_language: lang,
                            message_type: 'accounting'
                          }
                        })
                      });

                      if (!response.ok) throw new Error('Message send failed');
                      loadAccountingData();
                    }}
                    userLanguage={consultantLanguage}
                    recipientLanguage={selectedClient?.language}
                    placeholder="Müşterinize muhasebe mesajı yazın..."
                  />
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Özel Notlarım</h3>
                  <button
                    onClick={() => setShowNoteModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Not Ekle</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {accountingData.consultant_notes.length === 0 ? (
                    <div className="text-center py-8">
                      <StickyNote className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Bu müşteri için not bulunmuyor.</p>
                    </div>
                  ) : (
                    accountingData.consultant_notes.map((note) => (
                      <div key={note.id} className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-2">{note.title}</h4>
                            <p className="text-gray-700 mb-3">{note.message}</p>
                            <div className="text-xs text-gray-500">
                              {formatDate(note.created_at)}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Document Request Modal */}
      {showDocumentRequest && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Belge Talep Et</h3>
              <button
                onClick={() => setShowDocumentRequest(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSendDocumentRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Talep Başlığı *
                </label>
                <input
                  type="text"
                  value={documentRequestForm.title}
                  onChange={(e) => setDocumentRequestForm({...documentRequestForm, title: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Örn: Şubat Ayı Gider Belgeleri"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Belge Türleri
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {documentTypes.map((type) => (
                    <label key={type.value} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={documentRequestForm.document_types.includes(type.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setDocumentRequestForm({
                              ...documentRequestForm,
                              document_types: [...documentRequestForm.document_types, type.value]
                            });
                          } else {
                            setDocumentRequestForm({
                              ...documentRequestForm,
                              document_types: documentRequestForm.document_types.filter(t => t !== type.value)
                            });
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{type.icon} {type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Talep Mesajı *
                </label>
                <textarea
                  value={documentRequestForm.message}
                  onChange={(e) => setDocumentRequestForm({...documentRequestForm, message: e.target.value})}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Hangi belgelere ihtiyacınız olduğunu detaylı açıklayın..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Öncelik
                  </label>
                  <select
                    value={documentRequestForm.priority}
                    onChange={(e) => setDocumentRequestForm({...documentRequestForm, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">Yüksek</option>
                    <option value="urgent">Acil</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Son Tarih
                  </label>
                  <input
                    type="date"
                    value={documentRequestForm.due_date}
                    onChange={(e) => setDocumentRequestForm({...documentRequestForm, due_date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Talep Gönder</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowDocumentRequest(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Ödeme Talebi Oluştur</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleCreatePayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ödeme Türü *
                </label>
                <select
                  value={paymentForm.payment_type}
                  onChange={(e) => setPaymentForm({...paymentForm, payment_type: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {paymentTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama *
                </label>
                <textarea
                  value={paymentForm.description}
                  onChange={(e) => setPaymentForm({...paymentForm, description: e.target.value})}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Ödeme açıklaması..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tutar *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Para Birimi
                  </label>
                  <select
                    value={paymentForm.currency}
                    onChange={(e) => setPaymentForm({...paymentForm, currency: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="USD">🇺🇸 USD</option>
                    <option value="EUR">🇪🇺 EUR</option>
                    <option value="GEL">🇬🇪 GEL</option>
                    <option value="TRY">🇹🇷 TRY</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vade Tarihi *
                </label>
                <input
                  type="date"
                  value={paymentForm.due_date}
                  onChange={(e) => setPaymentForm({...paymentForm, due_date: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={paymentForm.recurring}
                    onChange={(e) => setPaymentForm({...paymentForm, recurring: e.target.checked})}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Tekrarlanan ödeme</span>
                </label>
              </div>

              {paymentForm.recurring && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tekrar Aralığı
                  </label>
                  <select
                    value={paymentForm.recurring_interval}
                    onChange={(e) => setPaymentForm({...paymentForm, recurring_interval: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Aralık seçin</option>
                    <option value="monthly">Aylık</option>
                    <option value="quarterly">Üç Aylık</option>
                    <option value="semi_annual">Altı Aylık</option>
                    <option value="annual">Yıllık</option>
                  </select>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <DollarSign className="h-4 w-4" />
                  <span>Ödeme Oluştur</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Note Modal */}
      {showNoteModal && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Özel Not Ekle</h3>
              <button
                onClick={() => setShowNoteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleAddNote} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Not Türü
                </label>
                <select
                  value={noteForm.note_type}
                  onChange={(e) => setNoteForm({...noteForm, note_type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="general">Genel Not</option>
                  <option value="document">Belge Notu</option>
                  <option value="payment">Ödeme Notu</option>
                  <option value="meeting">Toplantı Notu</option>
                  <option value="reminder">Hatırlatma</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Not İçeriği *
                </label>
                <textarea
                  value={noteForm.note_content}
                  onChange={(e) => setNoteForm({...noteForm, note_content: e.target.value})}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Özel notunuzu yazın (sadece siz görebilirsiniz)..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <StickyNote className="h-4 w-4" />
                  <span>Not Ekle</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowNoteModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors"
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

export default ProductionAccountingModule;
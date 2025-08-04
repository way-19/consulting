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
  X,
  Upload,
  DollarSign,
  Calendar,
  TrendingUp,
  BarChart3,
  Package,
  Building2,
  CreditCard,
  Star,
  Globe,
  Users,
  Shield
} from 'lucide-react';

interface ConsultantAccountingModuleProps {
  consultantId: string;
}

const ConsultantAccountingModule: React.FC<ConsultantAccountingModuleProps> = ({ consultantId }) => {
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [paymentSchedules, setPaymentSchedules] = useState<any[]>([]);
  const [accountingReports, setAccountingReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('clients');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [consultantLanguage, setConsultantLanguage] = useState('tr');

  const [requestForm, setRequestForm] = useState({
    title: '',
    message: '',
    priority: 'normal',
    document_types: [] as string[],
    due_date: ''
  });

  const [invoiceForm, setInvoiceForm] = useState({
    client_id: '',
    service_description: '',
    amount: '',
    currency: 'USD',
    due_date: '',
    payment_type: 'accounting_fee',
    recurring: false,
    recurring_interval: ''
  });

  const [reportForm, setReportForm] = useState({
    client_id: '',
    report_type: 'monthly_summary',
    period_start: '',
    period_end: '',
    include_documents: true,
    include_payments: true,
    notes: ''
  });

  // Load consultant language preference
  useEffect(() => {
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
    { value: 'financial_report', label: 'Mali Rapor' },
    { value: 'audit_report', label: 'Denetim Raporu' },
    { value: 'other', label: 'Diğer' }
  ];

  const paymentTypes = [
    { value: 'accounting_fee', label: 'Muhasebe Ücreti' },
    { value: 'tax_payment', label: 'Vergi Ödemesi' },
    { value: 'audit_fee', label: 'Denetim Ücreti' },
    { value: 'consultation_fee', label: 'Danışmanlık Ücreti' },
    { value: 'compliance_fee', label: 'Uyumluluk Ücreti' },
    { value: 'other', label: 'Diğer' }
  ];

  const reportTypes = [
    { value: 'monthly_summary', label: 'Aylık Özet Raporu' },
    { value: 'quarterly_report', label: 'Üç Aylık Rapor' },
    { value: 'annual_report', label: 'Yıllık Rapor' },
    { value: 'tax_report', label: 'Vergi Raporu' },
    { value: 'compliance_report', label: 'Uyumluluk Raporu' },
    { value: 'financial_analysis', label: 'Mali Analiz' }
  ];

  useEffect(() => {
    loadClients();
  }, [consultantId]);

  useEffect(() => {
    if (selectedClient) {
      loadClientAccountingData();
    }
  }, [selectedClient]);

  const loadClients = async () => {
    try {
      // Load clients assigned to this consultant
      const { data: applicationsData, error } = await supabase
        .from('applications')
        .select(`
          client:users!applications_client_id_fkey(
            id, first_name, last_name, email, language, company_name, business_type,
            countries!users_country_id_fkey(name, flag_emoji)
          ),
          id, service_type, status, total_amount, currency, created_at
        `)
        .eq('consultant_id', consultantId)
        .not('client_id', 'is', null);

      if (error) {
        console.error('Error loading applications for accounting:', error);
        setClients([]);
        return;
      }

      console.log('Accounting module - loaded applications:', applicationsData);

      // Get unique clients with their application data
      const clientsMap = new Map();
      applicationsData?.forEach(app => {
        if (app.client) {
          const clientId = app.client.id;
          if (!clientsMap.has(clientId)) {
            clientsMap.set(clientId, {
              ...app.client,
              applications: []
            });
          }
          clientsMap.get(clientId).applications.push(app);
        }
      });

      const uniqueClients = Array.from(clientsMap.values());
      console.log('Accounting module - processed clients:', uniqueClients);
      setClients(uniqueClients);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadClientAccountingData = async () => {
    if (!selectedClient) return;

    try {
      // Load client documents
      const { data: docsData } = await supabase
        .from('client_documents')
        .select('*')
        .eq('client_id', selectedClient.id)
        .order('created_at', { ascending: false });

      // Load payment schedules
      const { data: paymentsData } = await supabase
        .from('client_payment_schedules')
        .select(`
          *,
          countries!client_payment_schedules_country_id_fkey(name, flag_emoji)
        `)
        .eq('client_id', selectedClient.id)
        .order('due_date', { ascending: true });

      setDocuments(docsData || []);
      setPaymentSchedules(paymentsData || []);
    } catch (error) {
      console.error('Error loading client accounting data:', error);
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
      
      loadClientAccountingData();
      alert('Belge durumu güncellendi!');
    } catch (error) {
      console.error('Error updating document:', error);
      alert('Belge durumu güncellenirken hata oluştu.');
    }
  };

  const handleSendDocumentRequest = async (e: React.FormEvent) => {
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
        document_types: [],
        due_date: ''
      });
      setShowRequestModal(false);
      alert('Belge talebi gönderildi!');
    } catch (error) {
      console.error('Error sending request:', error);
      alert('Belge talebi gönderilirken hata oluştu.');
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('client_payment_schedules')
        .insert({
          client_id: invoiceForm.client_id,
          consultant_id: consultantId,
          payment_type: invoiceForm.payment_type,
          description: invoiceForm.service_description,
          amount: parseFloat(invoiceForm.amount),
          currency: invoiceForm.currency,
          due_date: invoiceForm.due_date,
          status: 'pending',
          recurring: invoiceForm.recurring,
          recurring_interval: invoiceForm.recurring ? invoiceForm.recurring_interval : null,
          country_id: selectedClient?.countries?.id
        });

      if (error) throw error;

      setInvoiceForm({
        client_id: '',
        service_description: '',
        amount: '',
        currency: 'USD',
        due_date: '',
        payment_type: 'accounting_fee',
        recurring: false,
        recurring_interval: ''
      });
      setShowInvoiceModal(false);
      loadClientAccountingData();
      alert('Ödeme talebi oluşturuldu!');
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Ödeme talebi oluşturulurken hata oluştu.');
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
      case 'paid': return 'Ödendi';
      case 'pending': return 'Bekliyor';
      case 'overdue': return 'Gecikti';
      default: return status;
    }
  };

  const getPaymentTypeLabel = (type: string) => {
    const typeObj = paymentTypes.find(t => t.value === type);
    return typeObj?.label || type;
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = searchTerm === '' || 
      `${client.first_name} ${client.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const getClientAccountingStats = (client: any) => {
    const clientDocs = documents.filter(doc => doc.client_id === client.id);
    const clientPayments = paymentSchedules.filter(pay => pay.client_id === client.id);
    
    return {
      totalDocuments: clientDocs.length,
      pendingDocuments: clientDocs.filter(doc => doc.status === 'pending_review').length,
      approvedDocuments: clientDocs.filter(doc => doc.status === 'approved').length,
      totalPayments: clientPayments.length,
      pendingPayments: clientPayments.filter(pay => pay.status === 'pending').length,
      overduePayments: clientPayments.filter(pay => {
        const dueDate = new Date(pay.due_date);
        return pay.status === 'pending' && dueDate < new Date();
      }).length
    };
  };

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
    <div className="space-y-6">
      {/* Main Accounting Dashboard */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Calculator className="h-6 w-6 mr-3 text-purple-600" />
              Muhasebe Yönetim Merkezi
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

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-900">{clients.length}</div>
              <div className="text-sm text-blue-700">Toplam Müşteri</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-900">
                {documents.filter(doc => doc.status === 'pending_review').length}
              </div>
              <div className="text-sm text-green-700">Bekleyen Belge</div>
            </div>
            <div className="bg-orange-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-orange-900">
                {paymentSchedules.filter(pay => pay.status === 'pending').length}
              </div>
              <div className="text-sm text-orange-700">Bekleyen Ödeme</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-900">
                {paymentSchedules.filter(pay => {
                  const dueDate = new Date(pay.due_date);
                  return pay.status === 'pending' && dueDate < new Date();
                }).length}
              </div>
              <div className="text-sm text-purple-700">Geciken Ödeme</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { key: 'clients', label: 'Müşteri Seçimi', icon: Users },
              { key: 'documents', label: 'Belge Yönetimi', icon: FileText },
              { key: 'payments', label: 'Ödeme Takibi', icon: CreditCard },
              { key: 'reports', label: 'Raporlar', icon: BarChart3 }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'clients' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Müşteri Seçin</h3>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Müşteri ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>

              {filteredClients.length === 0 ? (
                <div className="text-center py-8">
                  <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Henüz atanmış müşteri yok.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredClients.map((client) => {
                    const stats = getClientAccountingStats(client);
                    
                    return (
                      <button
                        key={client.id}
                        onClick={() => setSelectedClient(client)}
                        className={`p-4 border rounded-xl text-left transition-colors ${
                          selectedClient?.id === client.id
                            ? 'border-purple-300 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-200'
                        }`}
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="text-2xl">{client.countries?.flag_emoji || '🌍'}</span>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {client.first_name} {client.last_name}
                            </h4>
                            <p className="text-sm text-gray-600">{client.email}</p>
                            {client.company_name && (
                              <p className="text-xs text-purple-600 font-medium">{client.company_name}</p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-blue-50 rounded p-2 text-center">
                            <div className="font-bold text-blue-900">{stats.totalDocuments}</div>
                            <div className="text-blue-700">Belge</div>
                          </div>
                          <div className="bg-green-50 rounded p-2 text-center">
                            <div className="font-bold text-green-900">{stats.pendingDocuments}</div>
                            <div className="text-green-700">Bekleyen</div>
                          </div>
                          <div className="bg-orange-50 rounded p-2 text-center">
                            <div className="font-bold text-orange-900">{stats.pendingPayments}</div>
                            <div className="text-orange-700">Ödeme</div>
                          </div>
                          <div className="bg-red-50 rounded p-2 text-center">
                            <div className="font-bold text-red-900">{stats.overduePayments}</div>
                            <div className="text-red-700">Geciken</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'documents' && selectedClient && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedClient.first_name} {selectedClient.last_name} - Belge Yönetimi
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowRequestModal(true)}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <span>Belge Talep Et</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {documents.filter(doc => doc.client_id === selectedClient.id).length === 0 ? (
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
                  documents.filter(doc => doc.client_id === selectedClient.id).map((doc) => (
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
                            {doc.upload_source === 'consultant' ? 'Gönderilme' : 'Yükleme'}: {new Date(doc.created_at).toLocaleDateString('tr-TR')}
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
            </div>
          )}

          {activeTab === 'payments' && selectedClient && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedClient.first_name} {selectedClient.last_name} - Ödeme Takibi
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setInvoiceForm({...invoiceForm, client_id: selectedClient.id});
                      setShowInvoiceModal(true);
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <DollarSign className="h-4 w-4" />
                    <span>Ödeme Talebi Oluştur</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {paymentSchedules.filter(pay => pay.client_id === selectedClient.id).length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Bu müşteri için ödeme kaydı bulunmuyor.</p>
                    <button
                      onClick={() => {
                        setInvoiceForm({...invoiceForm, client_id: selectedClient.id});
                        setShowInvoiceModal(true);
                      }}
                      className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      İlk Ödeme Talebini Oluştur
                    </button>
                  </div>
                ) : (
                  paymentSchedules.filter(pay => pay.client_id === selectedClient.id).map((payment) => {
                    const isOverdue = new Date(payment.due_date) < new Date() && payment.status === 'pending';
                    
                    return (
                      <div
                        key={payment.id}
                        className={`border rounded-xl p-4 transition-colors ${
                          isOverdue ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-green-300'
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
                              <h4 className="font-semibold text-gray-900">
                                {getPaymentTypeLabel(payment.payment_type)}
                              </h4>
                              <p className="text-sm text-gray-600">{payment.description}</p>
                              <div className="flex items-center space-x-4 mt-1">
                                <span className="text-sm text-gray-500">
                                  Vade: {new Date(payment.due_date).toLocaleDateString('tr-TR')}
                                </span>
                                {payment.recurring && (
                                  <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                                    Tekrarlanan
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-xl font-bold text-gray-900">
                              {new Intl.NumberFormat('tr-TR', {
                                style: 'currency',
                                currency: payment.currency
                              }).format(payment.amount)}
                            </div>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                              isOverdue ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {payment.status === 'paid' ? 'Ödendi' :
                               isOverdue ? 'Gecikti' :
                               'Bekliyor'}
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

          {activeTab === 'reports' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Muhasebe Raporları</h3>
                <button
                  onClick={() => setShowReportModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Yeni Rapor Oluştur</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Sample Reports */}
                <div className="border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">Aylık Özet Raporu</h4>
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Tüm müşteriler için aylık muhasebe özeti
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Dönem:</span>
                      <span className="font-medium">Ocak 2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Müşteri Sayısı:</span>
                      <span className="font-medium">{clients.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Toplam Gelir:</span>
                      <span className="font-medium text-green-600">$12,450</span>
                    </div>
                  </div>
                  <button className="w-full mt-4 bg-blue-100 text-blue-700 py-2 rounded-lg hover:bg-blue-200 transition-colors">
                    Raporu İndir
                  </button>
                </div>

                <div className="border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">Vergi Raporu</h4>
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Vergi beyannamesi için hazırlık raporu
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Dönem:</span>
                      <span className="font-medium">2023 Yılı</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Durum:</span>
                      <span className="font-medium text-green-600">Hazır</span>
                    </div>
                  </div>
                  <button className="w-full mt-4 bg-green-100 text-green-700 py-2 rounded-lg hover:bg-green-200 transition-colors">
                    Raporu İndir
                  </button>
                </div>

                <div className="border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">Uyumluluk Raporu</h4>
                    <Shield className="h-5 w-5 text-purple-600" />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Mevzuat uyumluluğu kontrol raporu
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Son Kontrol:</span>
                      <span className="font-medium">15 Ocak 2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Durum:</span>
                      <span className="font-medium text-green-600">Uyumlu</span>
                    </div>
                  </div>
                  <button className="w-full mt-4 bg-purple-100 text-purple-700 py-2 rounded-lg hover:bg-purple-200 transition-colors">
                    Raporu İndir
                  </button>
                </div>
              </div>
            </div>
          )}

          {!selectedClient && activeTab !== 'clients' && (
            <div className="text-center py-12">
              <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Müşteri Seçin</h3>
              <p className="text-gray-600 mb-6">
                Bu modülü kullanmak için önce bir müşteri seçin.
              </p>
              <button
                onClick={() => setActiveTab('clients')}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Müşteri Seç
              </button>
            </div>
          )}
        </div>
      </div>

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

            <form onSubmit={handleSendDocumentRequest} className="space-y-4">
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
                  Son Tarih
                </label>
                <input
                  type="date"
                  value={requestForm.due_date}
                  onChange={(e) => setRequestForm({...requestForm, due_date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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

      {/* Invoice Creation Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Ödeme Talebi Oluştur</h3>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Müşteri
                </label>
                <select
                  value={invoiceForm.client_id}
                  onChange={(e) => setInvoiceForm({...invoiceForm, client_id: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Müşteri seçin</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.countries?.flag_emoji} {client.first_name} {client.last_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ödeme Türü
                </label>
                <select
                  value={invoiceForm.payment_type}
                  onChange={(e) => setInvoiceForm({...invoiceForm, payment_type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {paymentTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hizmet Açıklaması *
                </label>
                <textarea
                  value={invoiceForm.service_description}
                  onChange={(e) => setInvoiceForm({...invoiceForm, service_description: e.target.value})}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Hizmet detaylarını açıklayın..."
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
                    value={invoiceForm.amount}
                    onChange={(e) => setInvoiceForm({...invoiceForm, amount: e.target.value})}
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
                    value={invoiceForm.currency}
                    onChange={(e) => setInvoiceForm({...invoiceForm, currency: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GEL">GEL</option>
                    <option value="TRY">TRY</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vade Tarihi *
                </label>
                <input
                  type="date"
                  value={invoiceForm.due_date}
                  onChange={(e) => setInvoiceForm({...invoiceForm, due_date: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={invoiceForm.recurring}
                    onChange={(e) => setInvoiceForm({...invoiceForm, recurring: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Tekrarlanan ödeme</span>
                </label>
              </div>

              {invoiceForm.recurring && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tekrar Aralığı
                  </label>
                  <select
                    value={invoiceForm.recurring_interval}
                    onChange={(e) => setInvoiceForm({...invoiceForm, recurring_interval: e.target.value})}
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
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <DollarSign className="h-4 w-4" />
                  <span>Ödeme Talebi Oluştur</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(false)}
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

export default ConsultantAccountingModule;
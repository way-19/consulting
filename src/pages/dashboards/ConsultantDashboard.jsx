import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase, db } from '../../lib/supabase';

// Import the actual working modules
import PerformanceHub from '../../components/consultant/dashboard/PerformanceHub';
import LegacyOrderManager from '../../components/consultant/dashboard/LegacyOrderManager';
import QuickActions from '../../components/consultant/dashboard/QuickActions';
import CountryBasedClients from '../../components/consultant/dashboard/CountryBasedClients';
import CustomServiceManager from '../../components/consultant/dashboard/CustomServiceManager';
import ConsultantMessagingModule from '../../components/consultant/messaging/ConsultantMessagingModule';
import ConsultantToAdminMessaging from '../../components/consultant/messaging/ConsultantToAdminMessaging';
import CountryContentManager from '../../components/consultant/dashboard/CountryContentManager';
import ConsultantAccountingModule from '../../components/consultant/accounting/ConsultantAccountingModule';

import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  FileText, 
  MessageSquare,
  Calendar,
  Award,
  LogOut,
  Settings,
  Bell,
  Plus,
  Eye,
  Menu,
  X,
  BarChart3,
  Calculator,
  Globe,
  Package,
  Shield,
  RefreshCw,
  Send,
  User,
  AlertTriangle,
  Download,
  CheckCircle,
  Clock
} from 'lucide-react';

const ConsultantDashboard = ({ country = 'global' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [consultant, setConsultant] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeModule, setActiveModule] = useState('performance');
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    checkAuthAndLoadData();
    
    // Set active module based on URL
    const path = location.pathname;
    if (path.includes('/performance')) setActiveModule('performance');
    else if (path.includes('/messages')) setActiveModule('messages');
    else if (path.includes('/accounting')) setActiveModule('accounting');
    else if (path.includes('/custom-services')) setActiveModule('custom-services');
    else if (path.includes('/country-clients')) setActiveModule('country-clients');
    else if (path.includes('/legacy-orders')) setActiveModule('legacy-orders');
    else if (path.includes('/country-content')) setActiveModule('country-content');
    else if (path.includes('/admin-messages')) setActiveModule('admin-messages');
  }, [navigate, location.pathname]);

  const checkAuthAndLoadData = async () => {
    try {
      // Get user data from localStorage (simulated auth)
      const storedUser = localStorage.getItem('user');
      
      if (!storedUser) {
        console.warn('⚠️ No user data in localStorage, redirecting to login');
        window.location.href = '/login';
        return;
      }

      let consultantData;
      try {
        consultantData = JSON.parse(storedUser);
      } catch (parseError) {
        console.warn('⚠️ Invalid user data in localStorage, redirecting to login');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return;
      }

      if (!consultantData || consultantData.role !== 'consultant') {
        console.warn('⚠️ User is not a consultant, redirecting to login');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return;
      }

      console.log('✅ Consultant authenticated:', consultantData.name || consultantData.email);
      setConsultant(consultantData);
      await loadConsultantData(consultantData.id);
      
    } catch (error) {
      console.warn('⚠️ Auth check failed, redirecting to login:', error.message);
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  };

  const loadConsultantData = async (consultantId) => {
    if (!consultantId) {
      console.error('❌ No consultantId provided to loadConsultantData');
      return;
    }

    try {
      setLoading(true);
      
      // Load consultant's clients
      const clientsData = await db.getConsultantClients(consultantId);
      setClients(clientsData);
      
      if (clientsData.length > 0) {
        setSelectedClient(clientsData[0]);
        // Load messages for first client
        const messagesData = await db.getMessages(consultantId, clientsData[0].client_id);
        setMessages(messagesData);
        
        // Load documents for first client
        const documentsData = await db.getClientDocuments(clientsData[0].client_id);
        setDocuments(documentsData);
      }
    } catch (error) {
      console.error('Error loading consultant data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClientSelect = async (client) => {
    if (!client?.client_id || !consultant?.id) {
      console.error('❌ Invalid client or consultant data');
      return;
    }
    
    setSelectedClient(client);
    try {
      const [messagesData, documentsData] = await Promise.all([
        db.getMessages(consultant.id, client.client_id),
        db.getClientDocuments(client.client_id)
      ]);
      setMessages(messagesData);
      setDocuments(documentsData);
    } catch (error) {
      console.error('Error loading client data:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedClient?.id || !consultant?.id) {
      console.error('❌ Missing required data for sending message');
      return;
    }
    
    try {
      await db.sendMessage(consultant.id, selectedClient.id, newMessage, 'general');
      setNewMessage('');
      
      // Reload messages
      const messagesData = await db.getMessages(consultant.id, selectedClient.id);
      setMessages(messagesData);
      
      alert('✅ Mesaj gönderildi!');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('❌ Mesaj gönderilirken hata oluştu.');
    }
  };

  const handleDocumentAction = async (documentId, action, notes = null) => {
    if (!documentId || !selectedClient?.client_id) {
      console.error('❌ Missing required data for document action');
      return;
    }
    
    try {
      await db.updateDocumentStatus(documentId, action, notes);
      
      // Reload documents
      const documentsData = await db.getClientDocuments(selectedClient.client_id);
      setDocuments(documentsData);
      
      alert(`✅ Belge ${action === 'approved' ? 'onaylandı' : action === 'rejected' ? 'reddedildi' : 'güncelleme için işaretlendi'}!`);
    } catch (error) {
      console.error('Error updating document:', error);
      alert('❌ Belge durumu güncellenirken hata oluştu.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const modules = [
    { id: 'performance', name: 'Performans Merkezi', icon: BarChart3, color: 'text-blue-600' },
    { id: 'messages', name: 'Müşteri Mesajları', icon: MessageSquare, color: 'text-green-600' },
    { id: 'accounting', name: 'Muhasebe Yönetimi', icon: Calculator, color: 'text-purple-600' },
    { id: 'custom-services', name: 'Özel Hizmetler', icon: DollarSign, color: 'text-orange-600' },
    { id: 'country-clients', name: 'Ülke Müşterileri', icon: Users, color: 'text-indigo-600' },
    { id: 'legacy-orders', name: 'Legacy Siparişler', icon: Package, color: 'text-yellow-600' },
    { id: 'country-content', name: 'İçerik Yönetimi', icon: Globe, color: 'text-teal-600' },
    { id: 'admin-messages', name: 'Admin İletişimi', icon: Shield, color: 'text-red-600' }
  ];

  const stats = [
    { title: 'Monthly Earnings', value: '$12,450', change: '+18%', icon: DollarSign, color: 'text-green-600' },
    { title: 'Active Clients', value: '23', change: '+5', icon: Users, color: 'text-blue-600' },
    { title: 'Success Rate', value: '96%', change: '+2%', icon: TrendingUp, color: 'text-purple-600' },
    { title: 'Avg Rating', value: '4.9', change: '+0.1', icon: Award, color: 'text-orange-600' }
  ];

  if (!consultant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const renderModuleContent = () => {
    switch (activeModule) {
      case 'performance':
        return (
          <div className="space-y-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Performans Merkezi</h2>
              <p className="text-gray-600">
                Müşterilerinizi yönetin, gelir takibi yapın ve danışmanlık işinizi büyütün
              </p>
            </div>
            <PerformanceHub consultantId={consultant.id} />
            <QuickActions consultantId={consultant.id} />
          </div>
        );

      case 'messages':
        return (
          <div className="space-y-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Müşteri Mesajları</h2>
              <p className="text-gray-600">
                Müşterilerinizle iletişim kurun ve mesajları yönetin
              </p>
            </div>
            <ConsultantMessagingModule consultantId={consultant.id} />
          </div>
        );

      case 'accounting':
        return (
          <div className="space-y-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Muhasebe Yönetimi</h2>
              <p className="text-gray-600">
                Müşteri belgelerini yönetin, ödeme takibi yapın ve mali raporlar oluşturun
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Calculator className="h-6 w-6 mr-3 text-purple-600" />
                  Muhasebe Yönetim Merkezi
                </h2>
                <button
                  onClick={() => loadConsultantData(consultant.id)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <RefreshCw className="h-5 w-5" />
                </button>
              </div>

              {/* Client Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Müşteri Seçin</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {clients.map((client) => (
                    <button
                      key={client.client_id}
                      onClick={() => handleClientSelect(client)}
                      className={`p-4 border rounded-xl text-left transition-colors ${
                        selectedClient?.client_id === client.client_id
                          ? 'border-purple-300 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl">🇬🇪</span>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {client.full_name}
                          </h4>
                          <p className="text-sm text-gray-600">{client.email}</p>
                          {client.company_name && (
                            <p className="text-xs text-purple-600 font-medium">{client.company_name}</p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Client Content */}
              {selectedClient ? (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      🇬🇪 {selectedClient.full_name} - Muhasebe Yönetimi
                    </h3>
                    <p className="text-sm text-gray-600">{selectedClient.email}</p>
                    {selectedClient.company_name && (
                      <p className="text-sm text-purple-700 font-medium">{selectedClient.company_name}</p>
                    )}
                  </div>

                  {/* Documents Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">Müşteri Belgeleri</h4>
                      <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4" />
                        <span>Belge Talep Et</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="border border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h5 className="font-semibold text-gray-900 mb-1">{doc.document_name}</h5>
                              <p className="text-sm text-gray-600">{doc.document_type}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                              doc.status === 'pending_review' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {doc.status === 'approved' ? 'Onaylandı' :
                               doc.status === 'pending_review' ? 'İnceleniyor' :
                               'Reddedildi'}
                            </span>
                          </div>

                          <div className="text-xs text-gray-500 mb-3">
                            {new Date(doc.created_at).toLocaleDateString('tr-TR')}
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

                          {/* Review Actions for pending documents */}
                          {doc.status === 'pending_review' && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleDocumentAction(doc.id, 'approved')}
                                  className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors"
                                >
                                  Onayla
                                </button>
                                <button
                                  onClick={() => {
                                    const notes = prompt('Ret nedeni:');
                                    if (notes) handleDocumentAction(doc.id, 'rejected', notes);
                                  }}
                                  className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors"
                                >
                                  Reddet
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {documents.length === 0 && (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Bu müşteri için belge bulunmuyor.</p>
                        <button className="mt-4 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                          Belge Talep Et
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Messages Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">Muhasebe Mesajları</h4>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                        <Send className="h-4 w-4" />
                        <span>Yeni Mesaj</span>
                      </button>
                    </div>

                    <div className="space-y-4 max-h-64 overflow-y-auto">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`border rounded-xl p-4 transition-colors ${
                            message.sender_id === consultant.id 
                              ? 'border-blue-200 bg-blue-50 ml-8' 
                              : 'border-gray-200 bg-white mr-8'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              message.sender_id === consultant.id 
                                ? 'bg-blue-100' 
                                : 'bg-purple-100'
                            }`}>
                              <User className={`h-4 w-4 ${
                                message.sender_id === consultant.id 
                                  ? 'text-blue-600' 
                                  : 'text-purple-600'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h5 className="font-semibold text-gray-900 text-sm">
                                  {message.sender_id === consultant.id 
                                    ? 'Ben (Danışman)' 
                                    : `${selectedClient.full_name} (Müşteri)`}
                                </h5>
                                <span className="text-xs text-gray-500">
                                  {new Date(message.created_at).toLocaleDateString('tr-TR')}
                                </span>
                              </div>
                              <p className="text-sm text-gray-800">{message.message}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {messages.length === 0 && (
                      <div className="text-center py-6">
                        <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 text-sm">Henüz muhasebe mesajı bulunmuyor.</p>
                      </div>
                    )}

                    {/* Message Input */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Müşteriye mesaj yazın..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleSendMessage();
                            }
                          }}
                        />
                        <button
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim()}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                          <Send className="h-4 w-4" />
                          <span>Gönder</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Müşteri Seçin</h3>
                  <p className="text-gray-600 mb-6">
                    Muhasebe işlemlerini yönetmek için bir müşteri seçin.
                  </p>
                  {clients.length === 0 && (
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                      <p className="text-yellow-800 text-sm">
                        Henüz size atanmış müşteri bulunmuyor.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case 'custom-services':
        return (
          <div className="space-y-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Özel Hizmetlerim</h2>
              <p className="text-gray-600">
                Kendi hizmetlerinizi oluşturun ve müşterilerinize önerin
              </p>
            </div>
            <CustomServiceManager consultantId={consultant.id} />
          </div>
        );

      case 'country-clients':
        return (
          <div className="space-y-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Ülke Müşterileri</h2>
              <p className="text-gray-600">
                Ülke bazlı müşteri yönetimi ve CRM sistemi
              </p>
            </div>
            <CountryBasedClients consultantId={consultant.id} />
          </div>
        );

      case 'legacy-orders':
        return (
          <div className="space-y-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Legacy Sipariş Yönetimi</h2>
              <p className="text-gray-600">
                Eski sistemden gelen siparişleri yönetin ve komisyonları takip edin
              </p>
            </div>
            <LegacyOrderManager consultantId={consultant.id} />
          </div>
        );

      case 'admin-messages':
        return (
          <div className="space-y-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin İletişimi</h2>
              <p className="text-gray-600">
                Sistem yöneticileri ile iletişim kurun ve bildirimleri görüntüleyin
              </p>
            </div>
            <ConsultantToAdminMessaging consultantId={consultant.id} />
          </div>
        );

      case 'country-content':
        return (
          <div className="space-y-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Ülke İçerik Yönetimi</h2>
              <p className="text-gray-600">
                Atandığınız ülkelerin frontend içeriğini yönetin
              </p>
            </div>
            <CountryContentManager consultantId={consultant.id} />
          </div>
        );

      default:
        return (
          <div className="space-y-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Performans Merkezi</h2>
              <p className="text-gray-600">
                Müşterilerinizi yönetin, gelir takibi yapın ve danışmanlık işinizi büyütün
              </p>
            </div>
            <PerformanceHub consultantId={consultant.id} />
            <QuickActions consultantId={consultant.id} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - ALWAYS VISIBLE */}
      <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {/* 🍔 BÜYÜK HAMBURGER MENÜ BUTONU */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg mr-4 shadow-lg border-2 border-blue-500"
                title="Menüyü Aç/Kapat"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mr-3">
                <Users className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Consultant Dashboard</h1>
              
              {/* Georgia Consultant Badge */}
              <div className="ml-4 flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-lg">
                <span className="text-lg">🇬🇪</span>
                <span className="text-sm font-medium text-blue-700">Georgia Expert</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Settings className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700">Welcome, {consultant.name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT WITH SIDEBAR */}
      <div className="flex pt-16">
        {/* 📱 SIDEBAR - OVERLAY STYLE */}
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-30"
              onClick={() => setSidebarOpen(false)}
            />
            
            {/* Sidebar */}
            <div className="fixed top-16 left-0 w-80 h-screen bg-white shadow-2xl z-40 border-r border-gray-200 overflow-y-auto transform transition-transform duration-300">
              <div className="p-4">
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    🇬🇪 Georgia Danışman Menüsü
                  </h3>
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">🇬🇪</span>
                      <span className="text-sm font-bold text-blue-800">Georgia Uzmanı</span>
                    </div>
                    <p className="text-xs text-blue-800 font-medium">
                      🎯 Tüm modüller aktif ve çalışır durumda!
                    </p>
                  </div>
                </div>
              </div>
              
              <nav className="space-y-2">
                {modules.map((module) => (
                  <button
                    key={module.id}
                    onClick={() => {
                      setActiveModule(module.id);
                      setSidebarOpen(false); // Close sidebar on mobile
                    }}
                    className={`w-full flex items-center space-x-3 px-6 py-3 transition-colors border-r-4 text-left ${
                      activeModule === module.id
                        ? 'bg-blue-50 text-blue-700 border-blue-500 font-semibold'
                        : 'text-gray-600 hover:bg-gray-50 border-transparent hover:border-gray-200'
                    }`}
                  >
                    <module.icon className={`h-5 w-5 ${
                      activeModule === module.id ? 'text-blue-600' : module.color
                    }`} />
                    <span className="font-medium">{module.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </>
        )}

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6">
          {renderModuleContent()}
        </main>
      </div>
    </div>
  );
};

export default ConsultantDashboard;
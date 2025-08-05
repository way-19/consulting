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
    if (!client?.id || !consultant?.id) {
      console.error('❌ Invalid client or consultant data');
      return;
    }
    
    setSelectedClient(client);
    try {
      const [messagesData, documentsData] = await Promise.all([
        db.getMessages(consultant.id, client.id),
        db.getClientDocuments(client.id)
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
            <ConsultantAccountingModule consultantId={consultant.id} />
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
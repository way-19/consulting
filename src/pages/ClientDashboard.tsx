import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

// UUID validation function
const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

import AccountingModule from '../components/client/accounting/AccountingModule';
import { 
  Building2, 
  FileText, 
  MessageSquare, 
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  LogOut,
  Settings,
  Bell,
  Plus,
  Download,
  Upload,
  CreditCard,
  DollarSign,
  RefreshCw,
  Brain,
  Sparkles,
  Send,
  Zap
} from 'lucide-react';

const ClientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
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

        // Validate UUID format
        if (!user.id || !isValidUUID(user.id)) {
          console.error('Invalid client ID format, redirecting to login');
          localStorage.removeItem('user');
          navigate('/login');
          return;
        }

        setClient(user);
        setMounted(true);
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('user');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    // Small delay to ensure proper mounting
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [navigate]);

  const handleLogout = async () => {
    localStorage.removeItem('user');
    await new Promise(resolve => setTimeout(resolve, 100));
    navigate('/', { replace: true });
  };

  const handleAiQuestion = async () => {
    if (!aiQuestion.trim()) return;
    
    setAiLoading(true);
    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const responses = [
        "Gürcistan'da şirket kurulumu genellikle 3-5 iş günü sürer. Gerekli belgelerinizi hazırladıktan sonra danışmanınız süreci hızlandırabilir.",
        "Muhasebe belgelerinizi düzenli olarak yüklemeniz önemli. Aylık gelir-gider belgelerinizi sisteme yükleyerek vergi uyumluluğunuzu sağlayabilirsiniz.",
        "Ödeme takviminizde geciken ödemeler var. Bunları en kısa sürede tamamlamanız şirketinizin uyumluluğu için kritik.",
        "Danışmanınızla mesajlaşarak sürecinizi hızlandırabilirsiniz. Tüm sorularınızı doğrudan danışmanınıza iletebilirsiniz."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setAiResponse(randomResponse);
    } catch (error) {
      setAiResponse("Üzgünüm, şu anda yanıt veremiyorum. Lütfen danışmanınızla iletişime geçin.");
    } finally {
      setAiLoading(false);
    }
  };

  // Mock payment data
  const upcomingPayments = [
    {
      id: '1',
      payment_type: 'virtual_address',
      description: 'Aylık sanal adres yenileme ücreti',
      amount: 50.00,
      currency: 'USD',
      due_date: '2025-07-28',
      status: 'pending',
      recurring: true,
      urgency: 'overdue',
      daysUntilDue: -5,
      countries: { name: 'Georgia', flag_emoji: '🇬🇪' }
    },
    {
      id: '2',
      payment_type: 'compliance_fee',
      description: 'Yıllık uyumluluk kontrol ücreti',
      amount: 199.00,
      currency: 'USD',
      due_date: '2025-08-04',
      status: 'pending',
      recurring: false,
      urgency: 'urgent',
      daysUntilDue: 2,
      countries: { name: 'Georgia', flag_emoji: '🇬🇪' }
    },
    {
      id: '3',
      payment_type: 'accounting_fee',
      description: 'Ağustos ayı muhasebe hizmet ücreti',
      amount: 299.00,
      currency: 'USD',
      due_date: '2025-08-10',
      status: 'pending',
      recurring: true,
      urgency: 'soon',
      daysUntilDue: 7,
      countries: { name: 'Georgia', flag_emoji: '🇬🇪' }
    }
  ];

  const getPaymentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'accounting_fee': 'Muhasebe Ücreti',
      'tax_payment': 'Vergi Ödemesi',
      'virtual_address': 'Sanal Adres',
      'legal_fee': 'Hukuki Danışmanlık',
      'company_maintenance': 'Şirket Bakım',
      'compliance_fee': 'Uyumluluk Ücreti'
    };
    return labels[type] || type;
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      case 'urgent': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'soon': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const totalUpcomingAmount = upcomingPayments.reduce((sum, payment) => sum + payment.amount, 0);

  const applications = [
    { 
      id: 1, 
      country: 'Estonia', 
      type: 'LLC Formation', 
      status: 'In Progress', 
      progress: 75,
      consultant: 'Sarah Johnson',
      amount: '$2,500',
      date: '2024-01-15',
      nextStep: 'Document review pending'
    },
    { 
      id: 2, 
      country: 'Malta', 
      type: 'Tax Optimization', 
      status: 'Completed', 
      progress: 100,
      consultant: 'Antonio Rucci',
      amount: '$4,200',
      date: '2024-01-10',
      nextStep: 'Setup complete'
    },
    { 
      id: 3, 
      country: 'UAE', 
      type: 'Company Setup', 
      status: 'Documents Required', 
      progress: 40,
      consultant: 'Ahmed Hassan',
      amount: '$3,800',
      date: '2024-01-12',
      nextStep: 'Upload bank statements'
    }
  ];

  const recentMessages = [
    { from: 'Sarah Johnson', message: 'Your Estonia LLC documents are ready for review', time: '2 hours ago', unread: true },
    { from: 'AI Assistant', message: 'Reminder: Bank statement upload required for UAE application', time: '1 day ago', unread: false },
    { from: 'Antonio Rucci', message: 'Malta tax optimization completed successfully!', time: '3 days ago', unread: false }
  ];

  const documents = [
    { name: 'Estonia LLC Certificate', type: 'Certificate', status: 'Ready', date: '2024-01-15' },
    { name: 'Tax Registration', type: 'Tax Document', status: 'Processing', date: '2024-01-14' },
    { name: 'Bank Account Details', type: 'Banking', status: 'Ready', date: '2024-01-13' },
    { name: 'Compliance Report', type: 'Report', status: 'Ready', date: '2024-01-12' }
  ];

  const recommendedServices = [
    { 
      title: 'Accounting Services', 
      description: 'Monthly bookkeeping and tax preparation for your Estonia LLC',
      price: '$299/month',
      consultant: 'Sarah Johnson'
    },
    { 
      title: 'Banking Solutions', 
      description: 'Open business accounts in multiple jurisdictions',
      price: '$500',
      consultant: 'Available Consultants'
    },
    { 
      title: 'Compliance Monitoring', 
      description: 'Ongoing regulatory compliance and filing management',
      price: '$199/month',
      consultant: 'AI + Human Oversight'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Müşteri panosu yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!client || !mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-green-700 rounded-lg flex items-center justify-center mr-3">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Müşteri Panosu</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Settings className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700">Hoş Geldiniz, {client.name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Çıkış Yap</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Tekrar hoş geldiniz! 👋</h2>
          <p className="text-gray-600">
            Başvurularınızı takip edin, danışmanlarla iletişim kurun ve iş kurulumunuzu yönetin
          </p>
        </div>

        {/* ===== YAKLAŞAN ÖDEMELERİM - EN ÜST BÖLÜM ===== */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <CreditCard className="h-8 w-8 mr-4 text-red-600" />
              🚨 YAKLAŞAN ÖDEMELERİM
            </h2>
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-bold">
                {upcomingPayments.length} ACİL ÖDEME!
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Summary Card - KOMPAKT */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-4 mb-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold mb-2">⚠️ ACİL ÖDEME UYARISI</h3>
                <p className="text-2xl font-bold mb-1">${totalUpcomingAmount.toFixed(2)}</p>
                <p className="text-sm">Toplam ödemeniz gereken tutar</p>
                <p className="text-red-200 text-xs mt-1">1 ödeme gecikmiş, 2 ödeme yaklaşıyor!</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          {/* Payment List - 4x1 GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {upcomingPayments.map((payment) => (
              <div
                key={payment.id}
                className={`border rounded-xl p-4 ${getUrgencyColor(payment.urgency)} hover:shadow-lg transition-all duration-300`}
              >
                <div className="text-center">
                  <div className="flex items-center justify-center mb-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      payment.urgency === 'overdue' ? 'bg-red-200' :
                      payment.urgency === 'urgent' ? 'bg-orange-200' :
                      'bg-yellow-200'
                    }`}>
                      {payment.urgency === 'overdue' ? (
                        <AlertCircle className="h-6 w-6 text-red-600" />
                      ) : payment.urgency === 'urgent' ? (
                        <Clock className="h-6 w-6 text-orange-600" />
                      ) : (
                        <Calendar className="h-6 w-6 text-yellow-600" />
                      )}
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <h3 className="text-sm font-bold text-gray-900">
                        {getPaymentTypeLabel(payment.payment_type)}
                      </h3>
                      <span className="text-lg">{payment.countries.flag_emoji}</span>
                    </div>
                    {payment.recurring && (
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                        TEKRARLANAN
                      </span>
                    )}
                  </div>

                  <div className="text-xl font-bold text-gray-900 mb-2">
                    ${payment.amount}
                  </div>
                  
                  <div className="text-xs text-gray-600 mb-2">
                    Vade: {new Date(payment.due_date).toLocaleDateString('tr-TR')}
                  </div>
                  
                  <div className={`text-xs font-bold mb-3 ${
                    payment.urgency === 'overdue' ? 'text-red-600' :
                    payment.urgency === 'urgent' ? 'text-orange-600' :
                    'text-yellow-600'
                  }`}>
                    {payment.urgency === 'overdue' ? `${Math.abs(payment.daysUntilDue)} GÜN GECİKTİ!` :
                     `${payment.daysUntilDue} GÜN KALDI!`}
                  </div>
                  
                  <button className={`w-full px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
                    payment.urgency === 'overdue' ? 'bg-red-600 hover:bg-red-700 text-white' :
                    payment.urgency === 'urgent' ? 'bg-orange-600 hover:bg-orange-700 text-white' :
                    'bg-yellow-600 hover:bg-yellow-700 text-white'
                  }`}>
                    {payment.urgency === 'overdue' ? '🚨 ACİL ÖDE' : 'ÖDE'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Payment Actions - AYNI BOYUT */}
          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button className="bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors font-medium">
                📋 TÜM ÖDEMELERİ GÖRÜNTÜLE
              </button>
              <button className="bg-gray-600 text-white py-3 px-4 rounded-xl hover:bg-gray-700 transition-colors font-medium">
                💳 ÖDEME YÖNTEMİ EKLE
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktif Uygulamalar</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">3</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tamamlanmış</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">1</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Belgeler</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mesajlar</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">5</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Applications */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Başvurularım</h3>
              <Link
                to="/client/new-application"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Yeni Uygulama</span>
              </Link>
            </div>
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="p-4 border border-gray-200 rounded-xl hover:border-green-300 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{app.country} {app.type}</h4>
                      <p className="text-sm text-gray-600">Danışman: {app.consultant}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{app.amount}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        app.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        app.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>İlerleme</span>
                      <span>{app.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${app.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">{app.nextStep}</p>
                    <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                      Ayrıntıları Görüntüle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {/* Recent Messages */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Son Mesajlar</h3>
              <div className="space-y-3">
                {recentMessages.map((message, index) => (
                  <div key={index} className={`p-3 rounded-xl ${message.unread ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900">{message.from}</p>
                      {message.unread && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{message.message}</p>
                    <p className="text-xs text-gray-500">{message.time}</p>
                  </div>
                ))}
              </div>
              <Link
                to="/client/messages"
                className="block w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
              >
                Mesajları görüntüle / Gönder
              </Link>
            </div>

            {/* AI Assistant */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-lg p-6 border border-purple-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mr-3">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    AI Asistanınız
                    <Sparkles className="h-4 w-4 ml-2 text-purple-500" />
                  </h3>
                  <p className="text-sm text-gray-600">Anında yardım ve rehberlik</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                İş kurulumunuzla ilgili anında yanıtlar alın, belgeler hakkında bilgi edinin 
                veya danışmanlık sürecinizle ilgili sorular sorun.
              </p>

              <div className="space-y-3">
                <textarea
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  placeholder="Sorunuzu yazın... (örn: Gürcistan şirket kurulumu ne kadar sürer?)"
                  rows={3}
                  className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
                
                <button
                  onClick={handleAiQuestion}
                  disabled={!aiQuestion.trim() || aiLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {aiLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>AI Düşünüyor...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      <span>AI Asistanına Sor</span>
                    </>
                  )}
                </button>

                {aiResponse && (
                  <div className="bg-white rounded-lg p-4 border border-purple-200">
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Brain className="h-3 w-3 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800 leading-relaxed">{aiResponse}</p>
                        <div className="mt-2 text-xs text-purple-600">
                          💡 Bu yanıt AI tarafından oluşturulmuştur. Detaylı bilgi için danışmanınızla iletişime geçin.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-purple-200">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setAiQuestion('Gürcistan şirket kurulumu ne kadar sürer?')}
                    className="p-2 bg-white/50 rounded-lg hover:bg-white transition-colors text-left"
                  >
                    🏢 Şirket kurulum süresi
                  </button>
                  <button
                    onClick={() => setAiQuestion('Hangi belgeleri yüklemem gerekiyor?')}
                    className="p-2 bg-white/50 rounded-lg hover:bg-white transition-colors text-left"
                  >
                    📄 Gerekli belgeler
                  </button>
                  <button
                    onClick={() => setAiQuestion('Ödeme takvimimdeki geciken ödemeler neler?')}
                    className="p-2 bg-white/50 rounded-lg hover:bg-white transition-colors text-left"
                  >
                    💳 Ödeme durumu
                  </button>
                  <button
                    onClick={() => setAiQuestion('Danışmanımla nasıl iletişim kurabilirim?')}
                    className="p-2 bg-white/50 rounded-lg hover:bg-white transition-colors text-left"
                  >
                    💬 İletişim yolları
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Belgelerim</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {documents.map((doc, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-xl hover:border-green-300 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <FileText className="h-8 w-8 text-gray-400" />
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    doc.status === 'Ready' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {doc.status}
                  </span>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">{doc.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{doc.type}</p>
                <p className="text-xs text-gray-500">{doc.date}</p>
                {doc.status === 'Ready' && (
                  <button className="w-full mt-3 bg-green-100 text-green-700 py-2 rounded-lg hover:bg-green-200 transition-colors text-sm">
                    İndir
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Services */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <RecommendedServices clientId={client.id} />
        </div>

        {/* Accounting Module */}
        <div className="mt-8">
          <AccountingModule clientId={client.id} />
        </div>
      </div>
    </div>
  );
};

// Recommended Services Component
const RecommendedServices: React.FC<{ clientId: string }> = ({ clientId }) => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, [clientId]);

  const loadRecommendations = async () => {
    try {
      const { data: recommendationsData } = await supabase
        .from('service_payment_requests')
        .select(`
          *,
          consultant:users!service_payment_requests_consultant_id_fkey(
            first_name, last_name,
            countries(name, flag_emoji)
          ),
          recommended_service:consultant_custom_services(
            service_name, service_description, service_category
          )
        `)
        .eq('client_id', clientId)
        .eq('is_recommendation', true)
        .eq('recommendation_status', 'pending')
        .order('recommended_at', { ascending: false });

      setRecommendations(recommendationsData || []);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRecommendation = async (recommendationId: string) => {
    try {
      const { error } = await supabase
        .from('service_payment_requests')
        .update({ 
          recommendation_status: 'accepted',
          status: 'pending' // Convert to actual payment request
        })
        .eq('id', recommendationId);

      if (error) throw error;
      
      loadRecommendations();
      alert('✅ Hizmet önerisi kabul edildi! Ödeme talebi oluşturuldu.');
    } catch (error) {
      console.error('Error accepting recommendation:', error);
      alert('❌ Hizmet önerisi kabul edilirken hata oluştu.');
    }
  };

  const handleRejectRecommendation = async (recommendationId: string) => {
    try {
      const { error } = await supabase
        .from('service_payment_requests')
        .update({ recommendation_status: 'rejected' })
        .eq('id', recommendationId);

      if (error) throw error;
      
      loadRecommendations();
      alert('Hizmet önerisi reddedildi.');
    } catch (error) {
      console.error('Error rejecting recommendation:', error);
      alert('❌ Hizmet önerisi reddedilirken hata oluştu.');
    }
  };

  if (loading) {
    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Size Özel Hizmet Önerileri</h3>
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
          Size Özel Hizmet Önerileri
        </h3>
        {recommendations.length > 0 && (
          <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
            {recommendations.length} yeni öneri
          </div>
        )}
      </div>

      {recommendations.length === 0 ? (
        <div className="text-center py-8">
          <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Henüz Öneri Yok</h4>
          <p className="text-gray-600">
            Danışmanınız size özel hizmet önerileri gönderdiğinde burada görünecek.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((recommendation) => (
            <div
              key={recommendation.id}
              className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{recommendation.consultant?.countries?.flag_emoji || '🌍'}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {recommendation.consultant?.first_name} {recommendation.consultant?.last_name}
                    </h4>
                    <p className="text-xs text-gray-600">Danışmanınız</p>
                  </div>
                </div>
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                  YENİ ÖNERİ
                </span>
              </div>

              <div className="mb-4">
                <h4 className="font-bold text-gray-900 mb-2">
                  {recommendation.recommended_service?.service_name || 'Özel Hizmet'}
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  {recommendation.recommended_service?.service_description || recommendation.description}
                </p>
                <div className="bg-white rounded-lg p-3 border border-purple-200 mb-3">
                  <p className="text-sm text-purple-800">
                    <strong>Danışman Mesajı:</strong> {recommendation.recommendation_message}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl font-bold text-green-600">
                  ${recommendation.amount} {recommendation.currency}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(recommendation.recommended_at).toLocaleDateString('tr-TR')}
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleAcceptRecommendation(recommendation.id)}
                  className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center space-x-1"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Kabul Et</span>
                </button>
                <button
                  onClick={() => handleRejectRecommendation(recommendation.id)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium flex items-center justify-center space-x-1"
                >
                  <X className="h-4 w-4" />
                  <span>Reddet</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default ClientDashboard;
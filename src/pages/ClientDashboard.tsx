import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  RefreshCw
} from 'lucide-react';

const ClientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
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

        setClient(user);
      } catch (error) {
        console.error('Error checking auth:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!client) {
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
            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
              <CreditCard className="h-8 w-8 mr-4 text-red-600" />
              🚨 YAKLAŞAN ÖDEMELERİM
            </h2>
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-lg font-bold">
                {upcomingPayments.length} ACİL ÖDEME!
              </div>
              <button className="p-3 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <RefreshCw className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Summary Card - BÜYÜK VE GÖRÜNÜR */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-8 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-3">⚠️ ACİL ÖDEME UYARISI</h3>
                <p className="text-4xl font-bold mb-2">${totalUpcomingAmount.toFixed(2)}</p>
                <p className="text-xl">Toplam ödemeniz gereken tutar</p>
                <p className="text-red-200 mt-2">1 ödeme gecikmiş, 2 ödeme yaklaşıyor!</p>
              </div>
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                <DollarSign className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>

          {/* Payment List - BÜYÜK KARTLAR */}
          <div className="space-y-6">
            {upcomingPayments.map((payment) => (
              <div
                key={payment.id}
                className={`border-2 rounded-2xl p-6 ${getUrgencyColor(payment.urgency)} hover:shadow-2xl transition-all duration-300`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                      payment.urgency === 'overdue' ? 'bg-red-200' :
                      payment.urgency === 'urgent' ? 'bg-orange-200' :
                      'bg-yellow-200'
                    }`}>
                      {payment.urgency === 'overdue' ? (
                        <AlertCircle className="h-8 w-8 text-red-600" />
                      ) : payment.urgency === 'urgent' ? (
                        <Clock className="h-8 w-8 text-orange-600" />
                      ) : (
                        <Calendar className="h-8 w-8 text-yellow-600" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-2xl font-bold text-gray-900">
                          {getPaymentTypeLabel(payment.payment_type)}
                        </h3>
                        <span className="text-3xl">{payment.countries.flag_emoji}</span>
                        {payment.recurring && (
                          <span className="bg-purple-100 text-purple-700 px-3 py-2 rounded-full text-sm font-bold">
                            TEKRARLANAN
                          </span>
                        )}
                      </div>
                      <p className="text-lg text-gray-700 mb-2">{payment.description}</p>
                      <div className="flex items-center space-x-6">
                        <span className="text-lg text-gray-600">
                          Vade: {new Date(payment.due_date).toLocaleDateString('tr-TR')}
                        </span>
                        <span className={`text-lg font-bold ${
                          payment.urgency === 'overdue' ? 'text-red-600' :
                          payment.urgency === 'urgent' ? 'text-orange-600' :
                          'text-yellow-600'
                        }`}>
                          {payment.urgency === 'overdue' ? `${Math.abs(payment.daysUntilDue)} GÜN GECİKTİ!` :
                           `${payment.daysUntilDue} GÜN KALDI!`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900 mb-3">
                      ${payment.amount} {payment.currency}
                    </div>
                    <button className={`px-8 py-4 rounded-xl text-lg font-bold transition-colors ${
                      payment.urgency === 'overdue' ? 'bg-red-600 hover:bg-red-700 text-white' :
                      payment.urgency === 'urgent' ? 'bg-orange-600 hover:bg-orange-700 text-white' :
                      'bg-yellow-600 hover:bg-yellow-700 text-white'
                    }`}>
                      {payment.urgency === 'overdue' ? '🚨 ACİL ÖDE' : 'ÖDE'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Payment Actions - BÜYÜK BUTONLAR */}
          <div className="mt-8 pt-6 border-t-2 border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button className="bg-blue-600 text-white py-4 px-6 rounded-2xl hover:bg-blue-700 transition-colors text-xl font-bold">
                📋 TÜM ÖDEMELERİ GÖRÜNTÜLE
              </button>
              <button className="bg-gray-600 text-white py-4 px-6 rounded-2xl hover:bg-gray-700 transition-colors text-xl font-bold">
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
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Yeni Uygulama</span>
              </button>
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

          {/* Messages & Quick Actions */}
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
              <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Tüm Mesajları Görüntüle
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors">
                  <Upload className="h-5 w-5" />
                  <span>Belgeleri Yükle</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors">
                  <MessageSquare className="h-5 w-5" />
                  <span>Danışman Mesajı</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-colors">
                  <Calendar className="h-5 w-5" />
                  <span>Toplantı Planla</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 bg-orange-50 text-orange-700 rounded-xl hover:bg-orange-100 transition-colors">
                  <Download className="h-5 w-5" />
                  <span>Belgeleri İndir</span>
                </button>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Önerilen Hizmetler</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedServices.map((service, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-xl hover:border-green-300 transition-colors">
                <h4 className="font-medium text-gray-900 mb-2">{service.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-green-600 font-semibold">{service.price}</span>
                  <span className="text-xs text-gray-500">{service.consultant}</span>
                </div>
                <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
                  Hizmet Talep Et
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
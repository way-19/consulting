import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
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
  Download
} from 'lucide-react';

const ConsultantDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [consultant, setConsultant] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeModule, setActiveModule] = useState('performance');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id || user.role !== 'consultant') {
      navigate('/login');
      return;
    }
    setConsultant(user);
  }, [navigate]);

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

  const recentClients = [
    { name: 'John Smith', service: 'Estonia LLC Formation', status: 'In Progress', amount: '$2,500', date: '2024-01-15' },
    { name: 'Maria Garcia', service: 'Malta Tax Optimization', status: 'Completed', amount: '$4,200', date: '2024-01-14' },
    { name: 'Ahmed Hassan', service: 'UAE Company Setup', status: 'Documents Review', amount: '$3,800', date: '2024-01-13' },
    { name: 'Lisa Chen', service: 'Portugal Golden Visa', status: 'In Progress', amount: '$15,000', date: '2024-01-12' }
  ];

  const customServices = [
    { name: 'Tax Planning Consultation', price: '$500', clients: 12, status: 'Active' },
    { name: 'Business Plan Development', price: '$1,200', clients: 8, status: 'Active' },
    { name: 'Compliance Monitoring', price: '$300/month', clients: 15, status: 'Active' },
    { name: 'Investment Advisory', price: '$800', clients: 6, status: 'Active' }
  ];

  const commissionBreakdown = [
    { source: 'Legacy Orders', amount: '$4,250', percentage: '65%', count: 8 },
    { source: 'Custom Services', amount: '$3,900', percentage: '65%', count: 12 },
    { source: 'Platform Applications', amount: '$2,800', percentage: '65%', count: 6 },
    { source: 'Referral Bonuses', amount: '$1,500', percentage: '100%', count: 3 }
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
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      <p className={`text-sm mt-1 ${stat.color}`}>{stat.change} from last month</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      stat.color === 'text-green-600' ? 'bg-green-100' :
                      stat.color === 'text-blue-600' ? 'bg-blue-100' :
                      stat.color === 'text-purple-600' ? 'bg-purple-100' :
                      'bg-orange-100'
                    }`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Clients */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Clients</h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentClients.map((client, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{client.name}</p>
                      <p className="text-sm text-gray-600">{client.service}</p>
                      <p className="text-xs text-gray-500 mt-1">{client.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{client.amount}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        client.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        client.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {client.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Commission Breakdown */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Commission Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {commissionBreakdown.map((item, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-xl">
                    <p className="text-2xl font-bold text-gray-900">{item.amount}</p>
                    <p className="text-sm text-gray-600 mt-1">{item.source}</p>
                    <div className="flex items-center justify-center space-x-2 mt-2">
                      <span className="text-xs text-green-600 font-medium">{item.percentage}</span>
                      <span className="text-xs text-gray-500">• {item.count} items</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'messages':
        return (
          <div className="space-y-8">
            {/* Messaging Module */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <MessageSquare className="h-6 w-6 mr-3 text-blue-600" />
                    Müşteri Mesajları
                    <span className="ml-3 bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                      2 yeni
                    </span>
                  </h2>
                  <div className="flex items-center space-x-3">
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <RefreshCw className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
                {/* Clients Sidebar */}
                <div className="lg:col-span-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-purple-600" />
                    Müşterilerim (4)
                  </h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {[
                      {
                        id: 1,
                        name: 'Ahmet Yılmaz',
                        email: 'ahmet@example.com',
                        country: 'Georgia',
                        flag: '🇬🇪',
                        language: 'tr',
                        unread: 2,
                        lastMessage: '2 saat önce'
                      },
                      {
                        id: 2,
                        name: 'Mehmet Özkan',
                        email: 'mehmet@example.com',
                        country: 'Georgia',
                        flag: '🇬🇪',
                        language: 'tr',
                        unread: 0,
                        lastMessage: '1 gün önce'
                      },
                      {
                        id: 3,
                        name: 'Fatma Demir',
                        email: 'fatma@example.com',
                        country: 'Georgia',
                        flag: '🇬🇪',
                        language: 'tr',
                        unread: 0,
                        lastMessage: '3 gün önce'
                      },
                      {
                        id: 4,
                        name: 'Ali Kaya',
                        email: 'ali@example.com',
                        country: 'Georgia',
                        flag: '🇬🇪',
                        language: 'tr',
                        unread: 1,
                        lastMessage: '5 saat önce'
                      }
                    ].map((client) => (
                      <button
                        key={client.id}
                        className="w-full text-left p-3 rounded-lg transition-colors border bg-gray-50 hover:bg-gray-100 border-gray-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{client.flag}</span>
                            <div>
                              <div className="font-medium text-gray-900">
                                {client.name}
                              </div>
                              <div className="text-sm text-gray-600">{client.country}</div>
                              <div className="text-xs text-blue-600">
                                Dil: {client.language.toUpperCase()}
                              </div>
                            </div>
                          </div>
                          {client.unread > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              {client.unread}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{client.lastMessage}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Messages Area */}
                <div className="lg:col-span-3">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🇬🇪</span>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            Ahmet Yılmaz ile Mesajlar
                          </h3>
                          <p className="text-sm text-gray-600">ahmet@example.com</p>
                          <p className="text-xs text-blue-600">
                            Müşteri Dili: TR • Sizin Diliniz: TR
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">
                          8 mesaj
                        </div>
                        <div className="text-xs text-green-600 flex items-center">
                          <Globe className="h-3 w-3 mr-1" />
                          Aynı dil - çeviri gerekmez
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sample Messages */}
                  <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
                    {[
                      {
                        id: 1,
                        sender: 'client',
                        message: 'Merhaba Nino! Gürcistan şirket kurulumu için gerekli belgeler nelerdir?',
                        time: '2 saat önce',
                        isRead: true
                      },
                      {
                        id: 2,
                        sender: 'consultant',
                        message: 'Merhaba Ahmet Bey! Gürcistan LLC kurulumu için şu belgeler gerekli: 1) Pasaport kopyası 2) Adres belgesi 3) Şirket adı önerileri. Size detaylı liste gönderiyorum.',
                        time: '1 saat önce',
                        isRead: true
                      },
                      {
                        id: 3,
                        sender: 'client',
                        message: 'Teşekkürler! Belgeler hazır, ne zaman gönderebilirim?',
                        time: '30 dakika önce',
                        isRead: false
                      }
                    ].map((message) => (
                      <div
                        key={message.id}
                        className={`border rounded-xl p-4 transition-colors ${
                          message.sender === 'consultant' 
                            ? 'border-blue-200 bg-blue-50 ml-8' 
                            : 'border-gray-200 bg-white mr-8'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            message.sender === 'consultant' 
                              ? 'bg-blue-100' 
                              : 'bg-purple-100'
                          }`}>
                            <User className={`h-5 w-5 ${
                              message.sender === 'consultant' 
                                ? 'text-blue-600' 
                                : 'text-purple-600'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900">
                                {message.sender === 'consultant' 
                                  ? 'Ben (Danışman)' 
                                  : 'Ahmet Yılmaz (Müşteri)'}
                              </h4>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">
                                  {message.time}
                                </span>
                                {!message.isRead && message.sender === 'client' && (
                                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                    Yeni
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-gray-800">{message.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Composer */}
                  <div className="pt-6 border-t border-gray-200">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">
                      Ahmet Yılmaz'a Mesaj Gönder
                    </h4>
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <div className="space-y-3">
                        <textarea
                          placeholder="Müşterinize mesaj yazın..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                        
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            Türkçe mesaj - çeviri gerekmez
                          </div>
                          
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                            <Send className="h-4 w-4" />
                            <span>Gönder</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="px-6 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-blue-900">4</div>
                    <div className="text-sm text-blue-700">Toplam Müşteri</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-green-900">23</div>
                    <div className="text-sm text-green-700">Toplam Mesaj</div>
                  </div>
                  <div className="bg-red-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-red-900">3</div>
                    <div className="text-sm text-red-700">Okunmamış</div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-purple-900">12</div>
                    <div className="text-sm text-purple-700">Bu Hafta</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'accounting':
        return (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Muhasebe Yönetimi</h3>
            <div className="text-center py-12">
              <Calculator className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Muhasebe modülü yakında aktif olacak.</p>
            </div>
          </div>
        );

      case 'custom-services':
        return (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">My Custom Services</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Service</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {customServices.map((service, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{service.name}</h4>
                    <span className="text-green-600 font-semibold">{service.price}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{service.clients} clients</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      {service.status}
                    </span>
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center justify-center">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </button>
                    <button className="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded-lg hover:bg-blue-200 transition-colors text-sm">
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">{modules.find(m => m.id === activeModule)?.name}</h3>
            <div className="text-center py-12">
              <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Bu modül yakında aktif olacak.</p>
            </div>
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
                  onClick={() => setActiveModule(module.id)}
                  className={`w-full flex items-center space-x-3 px-6 py-3 transition-colors border-r-4 text-left ${
                    activeModule === module.id
                      ? 'bg-blue-50 text-blue-700 border-blue-500 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50 border-transparent hover:border-gray-300'
                  }`}
                >
                  <module.icon className="h-5 w-5" />
                  <span className="font-medium text-sm">{module.name}</span>
                </button>
              ))}
            </nav>
            
            {/* Sidebar Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 border-t border-gray-200">
              <div className="text-center">
                <p className="text-xs text-gray-500">🇬🇪 Georgia Danışmanı</p>
                <p className="text-xs text-gray-400 mt-1">{consultant.name}</p>
              </div>
            </div>
          </div>
          </>
        )}

        {/* 📄 MAIN CONTENT AREA - ALWAYS FULL WIDTH */}
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {modules.find(m => m.id === activeModule)?.name}
            </h2>
            <p className="text-gray-600">
              Müşterilerinizi yönetin, gelir takibi yapın ve danışmanlık işinizi büyütün
            </p>
          </div>

          {renderModuleContent()}
        </div>
      </div>
    </div>
  );
};

export default ConsultantDashboard;
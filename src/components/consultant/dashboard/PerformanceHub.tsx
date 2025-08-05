import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Award,
  Calendar,
  Eye,
  MessageSquare,
  FileText,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react';

interface PerformanceHubProps {
  consultantId: string;
}

const PerformanceHub: React.FC<PerformanceHubProps> = ({ consultantId }) => {
  const [stats, setStats] = useState({
    monthlyEarnings: 0,
    activeClients: 0,
    successRate: 0,
    avgRating: 0,
    totalApplications: 0,
    completedApplications: 0,
    pendingApplications: 0,
    totalMessages: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPerformanceData();
  }, [consultantId]);

  const loadPerformanceData = async () => {
    try {
      // Use API route instead of direct Supabase calls
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/consultant-clients`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          consultantId,
          countryId: 1
        })
      });
      
      const result = await response.json();
      const clients = result.data || [];
      
      // Mock performance data for now
      const applications = clients.length > 0 ? [{ status: 'completed' }] : [];
      const commissions = [{ consultant_commission: 2500 }];
      const messages = [{ id: '1' }, { id: '2' }];

      const monthlyEarnings = commissions.reduce((sum, comm) => 
        sum + parseFloat(comm.consultant_commission || 0), 0
      );

      const completedApps = applications.filter(app => app.status === 'completed');
      const successRate = applications.length > 0 
        ? (completedApps.length / applications.length) * 100 
        : 0;

      setStats({
        monthlyEarnings,
        activeClients: applications.length,
        successRate: Math.round(successRate),
        avgRating: 4.8, // Mock data
        totalApplications: applications.length,
        completedApplications: completedApps.length,
        pendingApplications: applications.filter(app => 
          ['pending', 'in_progress'].includes(app.status)
        ).length,
        totalMessages: messages.length
      });
    } catch (error) {
      console.error('Error loading performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const performanceStats = [
    { 
      title: 'Aylık Kazanç', 
      value: `$${stats.monthlyEarnings.toFixed(2)}`, 
      change: '+18%', 
      icon: DollarSign, 
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    { 
      title: 'Aktif Müşteriler', 
      value: stats.activeClients.toString(), 
      change: '+5', 
      icon: Users, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    { 
      title: 'Başarı Oranı', 
      value: `${stats.successRate}%`, 
      change: '+2%', 
      icon: TrendingUp, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    { 
      title: 'Ortalama Puan', 
      value: stats.avgRating.toString(), 
      change: '+0.1', 
      icon: Award, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <BarChart3 className="h-6 w-6 mr-3 text-blue-600" />
          Performans Merkezi
        </h2>
        <button
          onClick={loadPerformanceData}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
        >
          <Eye className="h-5 w-5" />
        </button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {performanceStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className={`text-sm mt-1 ${stat.color}`}>{stat.change} bu ay</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Başvuru Durumu</h3>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">Toplam:</span>
                  <span className="font-semibold text-blue-900">{stats.totalApplications}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">Tamamlanan:</span>
                  <span className="font-semibold text-blue-900">{stats.completedApplications}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">Devam Eden:</span>
                  <span className="font-semibold text-blue-900">{stats.pendingApplications}</span>
                </div>
              </div>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-900 mb-2">İletişim</h3>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm text-green-700">Toplam Mesaj:</span>
                  <span className="font-semibold text-green-900">{stats.totalMessages}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-green-700">Bu Ay:</span>
                  <span className="font-semibold text-green-900">47</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-green-700">Yanıt Süresi:</span>
                  <span className="font-semibold text-green-900">2.3 saat</span>
                </div>
              </div>
            </div>
            <MessageSquare className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-purple-900 mb-2">Bu Ay</h3>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm text-purple-700">Yeni Müşteri:</span>
                  <span className="font-semibold text-purple-900">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-purple-700">Tamamlanan:</span>
                  <span className="font-semibold text-purple-900">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-purple-700">Gelir:</span>
                  <span className="font-semibold text-purple-900">${stats.monthlyEarnings.toFixed(0)}</span>
                </div>
              </div>
            </div>
            <Calendar className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceHub;
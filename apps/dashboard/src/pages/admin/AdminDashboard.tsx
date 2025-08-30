import React from 'react';
import { Users, FileText, BarChart3, Settings } from 'lucide-react';
import { Card } from '@consulting19/ui';
import AdminLayout from '../../components/layouts/AdminLayout';

const AdminDashboard = () => {
  const stats = [
    { title: 'Toplam Kullanıcı', value: '1,247', icon: Users, color: 'blue' },
    { title: 'Aktif Danışman', value: '89', icon: Users, color: 'green' },
    { title: 'İçerik Sayfası', value: '156', icon: FileText, color: 'purple' },
    { title: 'Aylık Gelir', value: '$45,230', icon: BarChart3, color: 'orange' },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Sistem genel bakışı ve yönetim</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <Card.Body className="text-center">
              <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center mx-auto mb-4`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.title}</div>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold text-gray-900">Son Aktiviteler</h2>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-900">Yeni danışman kaydı: Maria Silva (Portekiz)</span>
              <span className="text-xs text-gray-500">2 saat önce</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-900">İçerik güncellendi: BAE şirket kuruluş sayfası</span>
              <span className="text-xs text-gray-500">5 saat önce</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-900">Yeni müşteri kaydı: Tech Startup LLC</span>
              <span className="text-xs text-gray-500">1 gün önce</span>
            </div>
          </div>
        </Card.Body>
      </Card>
    </AdminLayout>
  );
};

export default AdminDashboard;
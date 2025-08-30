import React from 'react';
import { Users, DollarSign, TrendingUp, FileText, Clock, Upload } from 'lucide-react';
import { Card } from '@consulting19/ui';
import { useTranslation } from '../../hooks/useTranslation';
import ConsultantLayout from '../../components/layouts/ConsultantLayout';

const ConsultantDashboard = () => {
  const { t } = useTranslation();
  
  const stats = [
    { title: t('dashboard.stats.activeClients'), value: '12', icon: Users, color: 'blue' },
    { title: t('dashboard.stats.monthlyRevenue'), value: '$15,400', icon: DollarSign, color: 'green' },
    { title: t('dashboard.stats.completedProjects'), value: '45', icon: TrendingUp, color: 'purple' },
    { title: t('dashboard.stats.pendingTasks'), value: '8', icon: Clock, color: 'orange' },
  ];

  return (
    <ConsultantLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('dashboard.welcome')}</h1>
        <p className="text-gray-600">{t('dashboard.subtitle')}</p>
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
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-900">New client inquiry: Sarah Chen</span>
              <span className="text-xs text-gray-500">2 hours ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-900">Service updated: UAE Banking Solutions</span>
              <span className="text-xs text-gray-500">5 hours ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-900">Blog post published: UAE Business Setup 2025</span>
              <span className="text-xs text-gray-500">1 day ago</span>
            </div>
          </div>
        </Card.Body>
      </Card>
    </ConsultantLayout>
  );
};

export default ConsultantDashboard;
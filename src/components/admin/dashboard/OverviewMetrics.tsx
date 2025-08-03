import React from 'react';
import { 
  DollarSign, 
  Users, 
  Globe, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  MessageSquare
} from 'lucide-react';

interface OverviewMetricsProps {
  data: any;
}

const OverviewMetrics: React.FC<OverviewMetricsProps> = ({ data }) => {
  const metrics = [
    {
      title: 'Aylık Legacy Siparişler',
      value: data?.monthly_legacy_orders || 0,
      change: '+12%',
      icon: Globe,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Yeni Platform Başvuruları',
      value: data?.monthly_new_applications || 0,
      change: '+28%',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Aktif Danışmanlar',
      value: data?.active_consultants || 0,
      change: '+3',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Toplam Müşteriler',
      value: data?.total_clients || 0,
      change: '+89',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Aylık Danışman Komisyonları',
      value: `$${(data?.monthly_consultant_commissions || 0).toLocaleString()}`,
      change: '+15%',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Platform Geliri',
      value: `$${(data?.monthly_platform_revenue || 0).toLocaleString()}`,
      change: '+22%',
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Yüksek Riskli AI Etkileşimleri',
      value: data?.high_risk_ai_interactions || 0,
      change: '-5%',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Bekleyen Ödeme Talepleri',
      value: data?.pending_payment_requests || 0,
      change: '+7',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{metric.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
              <p className={`text-sm mt-1 ${metric.color}`}>{metric.change} bu ay</p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${metric.bgColor}`}>
              <metric.icon className={`h-6 w-6 ${metric.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OverviewMetrics;
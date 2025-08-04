import React from 'react';
import { 
  Plus, 
  FileText, 
  MessageSquare, 
  Calendar,
  DollarSign,
  Users,
  Settings,
  BarChart3
} from 'lucide-react';

interface QuickActionsProps {
  consultantId: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({ consultantId }) => {
  const actions = [
    {
      title: 'Özel Hizmet Oluştur',
      description: 'Müşterileriniz için yeni hizmet paketi oluşturun',
      icon: Plus,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Ödeme Talebi Gönder',
      description: 'Müşteriye hizmet için ödeme talebi gönderin',
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      title: 'Performans Raporu',
      description: 'Aylık performans ve kazanç raporunuzu görüntüleyin',
      icon: BarChart3,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Settings className="h-6 w-6 mr-3 text-gray-600" />
          Hızlı İşlemler
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {actions.map((action, index) => (
          <button
            key={index}
            className="text-left p-6 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg group"
          >
            <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
              <action.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {action.title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {action.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
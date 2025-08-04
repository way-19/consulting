import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  MessageSquare, 
  Calculator, 
  FileText, 
  DollarSign, 
  Users,
  Settings,
  Globe,
  Package,
  Handshake
} from 'lucide-react';

interface ConsultantSidebarProps {
  consultantId: string;
}

const ConsultantSidebar: React.FC<ConsultantSidebarProps> = ({ consultantId }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Performans Merkezi', href: '/consultant', icon: BarChart3 },
    { name: 'Müşteri Mesajları', href: '/consultant/messages', icon: MessageSquare },
    { name: 'Muhasebe Yönetimi', href: '/consultant/accounting', icon: Calculator },
    { name: 'Özel Hizmetler', href: '/consultant/custom-services', icon: DollarSign },
    { name: 'Ülke Bazlı Müşteriler', href: '/consultant/country-clients', icon: Users },
    { name: 'Legacy Siparişler', href: '/consultant/legacy-orders', icon: Package },
    { name: 'Ülke İçerik Yönetimi', href: '/consultant/country-content', icon: Globe },
    { name: 'Admin İletişimi', href: '/consultant/admin-messages', icon: Handshake },
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-full fixed top-16 left-0 z-40 p-4 border-r border-gray-200">
      <nav className="space-y-2">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
              location.pathname === item.href
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default ConsultantSidebar;
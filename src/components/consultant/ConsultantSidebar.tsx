import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BarChart3,
  MessageSquare,
  Calculator,
  DollarSign,
  Users,
  Globe,
  Package,
  Handshake
} from 'lucide-react';
import { normalizeCountrySlug } from '../../lib/countrySlug';

interface ConsultantSidebarProps {
  consultantId: string;
  country?: string;
}

const ConsultantSidebar: React.FC<ConsultantSidebarProps> = ({ consultantId, country }) => {
  const location = useLocation();
  const slug = normalizeCountrySlug(country);
  const basePath = slug === 'global' ? '/consultant-dashboard' : `/${slug}/consultant-dashboard`;

  const navigation = [
    { name: 'Performans Merkezi', href: `${basePath}/performance`, icon: BarChart3 },
    { name: 'Müşteri Mesajları', href: `${basePath}/messages`, icon: MessageSquare },
    { name: 'Muhasebe Yönetimi', href: `${basePath}/accounting`, icon: Calculator },
    { name: 'Özel Hizmetler', href: `${basePath}/custom-services`, icon: DollarSign },
    { name: 'Ülke Bazlı Müşteriler', href: `${basePath}/country-clients`, icon: Users },
    { name: 'Legacy Siparişler', href: `${basePath}/legacy-orders`, icon: Package },
    { name: 'Ülke İçerik Yönetimi', href: `${basePath}/country-content`, icon: Globe },
    { name: 'Admin İletişimi', href: `${basePath}/admin-messages`, icon: Handshake },
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed top-16 left-0 z-40 border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Danışman Menüsü
          </h3>
        </div>
      </div>
      <nav className="space-y-2">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`flex items-center space-x-3 px-6 py-3 transition-colors border-r-4 ${
              location.pathname === item.href
                ? 'bg-blue-50 text-blue-700 border-blue-500'
                : 'text-gray-600 hover:bg-gray-50 border-transparent hover:border-gray-300'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium text-sm">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default ConsultantSidebar;
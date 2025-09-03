import React from 'react';
import { Building2, User, Mail, Phone, MapPin } from 'lucide-react';
import { Card, Button } from '../../lib/ui';
import type { OrderFormData } from '../../hooks/useOrderForm';

interface Step1CompanyDetailsProps {
  formData: OrderFormData;
  updateFormData: (updates: Partial<OrderFormData>) => void;
  onNext: () => void;
}

const Step1CompanyDetails: React.FC<Step1CompanyDetailsProps> = ({
  formData,
  updateFormData,
  onNext,
}) => {
  const companyTypes = [
    'Limited Liability Company (LLC)',
    'Corporation',
    'Partnership',
    'Sole Proprietorship',
    'International Business Company (IBC)',
    'Other',
  ];

  const validateStep = () => {
    return (
      formData.companyName.trim() !== '' &&
      formData.companyType !== '' &&
      formData.customerName.trim() !== '' &&
      formData.customerEmail.trim() !== '' &&
      formData.customerPhone.trim() !== ''
    );
  };

  const handleNext = () => {
    if (validateStep()) {
      onNext();
    } else {
      alert('Lütfen tüm gerekli alanları doldurun.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Şirket ve İletişim Bilgileri</h2>
        <p className="text-gray-600">Şirketiniz ve iletişim bilgilerinizi girin</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Company Information */}
        <Card>
          <Card.Header>
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">Şirket Bilgileri</h3>
            </div>
          </Card.Header>
          <Card.Body className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Önerilen Şirket Adı *
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => updateFormData({ companyName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Şirket adınızı girin"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Şirket Tipi *
              </label>
              <select
                value={formData.companyType}
                onChange={(e) => updateFormData({ companyType: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Şirket tipini seçin</option>
                {companyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </Card.Body>
        </Card>

        {/* Customer Information */}
        <Card>
          <Card.Header>
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-green-600" />
              <h3 className="text-xl font-semibold text-gray-900">İletişim Bilgileri</h3>
            </div>
          </Card.Header>
          <Card.Body className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ad Soyad *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => updateFormData({ customerName: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Adınızı ve soyadınızı girin"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-posta Adresi *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => updateFormData({ customerEmail: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="E-posta adresinizi girin"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefon Numarası *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => updateFormData({ customerPhone: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Telefon numaranızı girin"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adres
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <textarea
                  value={formData.customerAddress}
                  onChange={(e) => updateFormData({ customerAddress: e.target.value })}
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Adresinizi girin (isteğe bağlı)"
                />
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Navigation */}
      <div className="flex justify-end">
        <Button
          onClick={handleNext}
          disabled={!validateStep()}
          size="lg"
          className="px-8"
        >
          Sonraki Adım
        </Button>
      </div>
    </div>
  );
};

export default Step1CompanyDetails;
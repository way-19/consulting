// apps/marketing/src/components/order-form/Step1CompanyDetails.tsx
import React from 'react';
import { Building, Mail, Phone, User } from 'lucide-react';
import { Card, Button } from '../../lib/ui';
import { ... } from '../../hooks/useOrderForm';
import { useLanguage } from '../../lib/language'; // useLanguage kancasını içe aktar

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
  const { t } = useLanguage(); // t fonksiyonunu kullan

  const companyTypes = [
    t('orderForm.companyDetails.companyTypes.llc'),
    t('orderForm.companyDetails.companyTypes.corporation'),
    t('orderForm.companyDetails.companyTypes.individualEntrepreneur'),
    t('orderForm.companyDetails.companyTypes.partnership'),
    t('orderForm.companyDetails.companyTypes.other'),
  ];

  const validateStep = () => {
    return (
      formData.companyName.trim() !== '' &&
      formData.companyType.trim() !== '' &&
      formData.contactEmail.trim() !== '' &&
      formData.phoneNumber.trim() !== ''
    );
  };

  const handleNext = () => {
    if (validateStep()) {
      onNext();
    } else {
      alert(t('orderForm.companyDetails.alertFillAllFields'));
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('orderForm.companyDetails.title')}</h2>
        <p className="text-gray-600">{t('orderForm.companyDetails.subtitle')}</p>
      </div>

      <Card>
        <Card.Header>
          <div className="flex items-center space-x-2">
            <Building className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">{t('orderForm.companyDetails.title')}</h3>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="space-y-6">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                {t('orderForm.companyDetails.companyName')} *
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="companyName"
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => updateFormData({ companyName: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('orderForm.companyDetails.companyNamePlaceholder')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="companyType" className="block text-sm font-medium text-gray-700 mb-2">
                {t('orderForm.companyDetails.companyType')} *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  id="companyType"
                  value={formData.companyType}
                  onChange={(e) => updateFormData({ companyType: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">{t('orderForm.companyDetails.companyTypePlaceholder')}</option>
                  {companyTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <div className="flex items-center space-x-2">
            <Mail className="w-5 h-5 text-green-600" />
            <h3 className="text-xl font-semibold text-gray-900">{t('orderForm.companyDetails.contactInfo')}</h3>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="space-y-6">
            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                {t('orderForm.companyDetails.contactEmail')} *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => updateFormData({ contactEmail: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('orderForm.companyDetails.contactEmailPlaceholder')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                {t('orderForm.companyDetails.phoneNumber')} *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => updateFormData({ phoneNumber: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('orderForm.companyDetails.phoneNumberPlaceholder')}
                />
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      <div className="flex justify-end mt-8">
        <Button onClick={handleNext}>
          {t('orderForm.common.next')}
        </Button>
      </div>
    </div>
  );
};

export default Step1CompanyDetails;


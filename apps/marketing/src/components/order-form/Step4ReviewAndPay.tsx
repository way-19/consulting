// apps/marketing/src/components/order-form/Step4ReviewAndPay.tsx
import React from 'react';
import { CheckCircle, DollarSign, Edit, Send } from 'lucide-react';
import { Card, Button } from '../../lib/ui';
import type { OrderFormData, Country, Package as PackageType, AdditionalService, Bank } from '../../hooks/useOrderForm';
import { useLanguage } from '../../lib/language'; // useLanguage kancasını içe aktar

interface Step4ReviewAndPayProps {
  formData: OrderFormData;
  countries: Country[];
  packages: PackageType[];
  additionalServices: AdditionalService[];
  banks: Bank[];
  onPrev: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const Step4ReviewAndPay: React.FC<Step4ReviewAndPayProps> = ({
  formData,
  countries,
  packages,
  additionalServices,
  banks,
  onPrev,
  onSubmit,
  isSubmitting,
}) => {
  const { t } = useLanguage(); // t fonksiyonunu kullan

  const selectedCountry = countries.find(c => c.id === formData.selectedCountryId);
  const selectedPackage = packages.find(p => p.id === formData.selectedPackageId);
  const selectedBank = banks.find(b => b.id === formData.selectedBankId);

  const selectedAdditionalServices = additionalServices.filter(service =>
    formData.selectedAdditionalServiceIds.includes(service.id)
  );

  const calculateTotalPrice = () => {
    let total = 0;
    if (selectedPackage) {
      total += selectedPackage.price;
    }
    selectedAdditionalServices.forEach(service => {
      // Assuming additionalServices here already have the correct price for the selected country
      // In a real scenario, you might need to fetch country-specific prices for these services again
      total += service.price; 
    });
    if (selectedBank) {
      total += selectedBank.price;
    }
    return total;
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('orderForm.reviewAndPay.title')}</h2>
        <p className="text-gray-600">{t('orderForm.reviewAndPay.subtitle')}</p>
      </div>

      {/* Company Details Review */}
      <Card>
        <Card.Header>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">{t('orderForm.reviewAndPay.companyDetails')}</h3>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <div>
              <p><strong>{t('orderForm.reviewAndPay.companyName')}:</strong> {formData.companyName}</p>
              <p><strong>{t('orderForm.reviewAndPay.companyType')}:</strong> {formData.companyType}</p>
            </div>
            <div>
              <p><strong>{t('orderForm.reviewAndPay.contactEmail')}:</strong> {formData.contactEmail}</p>
              <p><strong>{t('orderForm.reviewAndPay.phoneNumber')}:</strong> {formData.phoneNumber}</p>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Service Selection Review */}
      <Card>
        <Card.Header>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="text-xl font-semibold text-gray-900">{t('orderForm.reviewAndPay.serviceSelection')}</h3>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4 text-gray-700">
            <p><strong>{t('orderForm.reviewAndPay.selectedCountry')}:</strong> {selectedCountry?.name} {selectedCountry?.flag_emoji}</p>
            <p><strong>{t('orderForm.reviewAndPay.selectedPackage')}:</strong> {selectedPackage?.name} (${selectedPackage?.price.toFixed(2)})</p>
            <div>
              <p><strong>{t('orderForm.reviewAndPay.additionalServices')}:</strong></p>
              {selectedAdditionalServices.length > 0 ? (
                <ul className="list-disc list-inside ml-4">
                  {selectedAdditionalServices.map(service => (
                    <li key={service.id}>{service.name} (${service.price.toFixed(2)})</li>
                  ))}
                </ul>
              ) : (
                <p className="ml-4">{t('orderForm.reviewAndPay.none')}</p>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Banking Details Review */}
      <Card>
        <Card.Header>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-purple-600" />
            <h3 className="text-xl font-semibold text-gray-900">{t('orderForm.reviewAndPay.bankingDetails')}</h3>
          </div>
        </Card.Header>
        <Card.Body>
          <p className="text-gray-700"><strong>{t('orderForm.reviewAndPay.selectedBank')}:</strong> {selectedBank?.name} (${selectedBank?.price.toFixed(2)})</p>
        </Card.Body>
      </Card>

      {/* Total Price */}
      <Card>
        <Card.Body className="flex justify-between items-center">
          <h3 className="text-2xl font-bold text-gray-900">{t('orderForm.reviewAndPay.totalAmount')}:</h3>
          <span className="text-3xl font-bold text-blue-600">
            ${calculateTotalPrice().toFixed(2)}
          </span>
        </Card.Body>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onPrev}>
          {t('orderForm.common.back')}
        </Button>
        <Button onClick={onSubmit} loading={isSubmitting} icon={Send}>
          {isSubmitting ? t('orderForm.reviewAndPay.submittingOrder') : t('orderForm.reviewAndPay.completeOrder')}
        </Button>
      </div>
    </div>
  );
};

export default Step4ReviewAndPay;


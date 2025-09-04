import React from 'react';
import { CheckCircle, CreditCard } from 'lucide-react';
import { Button, Card } from '../../lib/ui';
import { OrderFormData, Country, Package, AdditionalService, Bank } from '../../hooks/useOrderForm';

interface Step4ReviewAndPayProps {
  formData: OrderFormData;
  countries: Country[];
  packages: Package[];
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
  isSubmitting
}) => {
  const selectedCountry = countries.find(c => c.id === formData.selectedCountryId);
  const selectedPackage = packages.find(p => p.id === formData.selectedPackageId);
  const selectedBank = banks.find(b => b.id === formData.selectedBankId);
  const selectedAddOns = additionalServices.filter(s => formData.selectedAdditionalServiceIds.includes(s.id));

  const calculateTotal = () => {
    let total = 0;
    if (selectedPackage) total += selectedPackage.price;
    if (selectedBank) total += selectedBank.price;
    selectedAddOns.forEach(service => total += service.price);
    return total;
  };

  return (
    <div className="space-y-6">
      <Card>
        <Card.Header>
          <h2 className="text-2xl font-bold text-gray-900">Review & Confirm</h2>
          <p className="text-gray-600">Review your order details</p>
        </Card.Header>
        <Card.Body className="space-y-6">
          {/* Company Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Company Details</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Company Name:</span>
                <span className="font-medium">{formData.companyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Company Type:</span>
                <span className="font-medium">{formData.companyType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{formData.contactEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">{formData.phoneNumber}</span>
              </div>
            </div>
          </div>

          {/* Selected Services */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Selected Services</h3>
            <div className="space-y-3">
              {selectedCountry && (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{selectedCountry.flag_emoji}</span>
                    <span className="font-medium">Country: {selectedCountry.name}</span>
                  </div>
                </div>
              )}
              
              {selectedPackage && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{selectedPackage.name}</span>
                  <span className="font-bold">${selectedPackage.price}</span>
                </div>
              )}
              
              {selectedBank && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Banking: {selectedBank.name}</span>
                  <span className="font-bold">${selectedBank.price}</span>
                </div>
              )}
              
              {selectedAddOns.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{service.name}</span>
                  <span className="font-bold">${service.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between text-xl font-bold">
              <span>Total:</span>
              <span className="text-blue-600">${calculateTotal().toLocaleString()}</span>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Previous
        </Button>
        <Button 
          onClick={onSubmit}
          loading={isSubmitting}
          icon={CreditCard}
          className="px-8 py-3"
        >
          {isSubmitting ? 'Processing...' : 'Submit Order'}
        </Button>
      </div>
    </div>
  );
};

export default Step4ReviewAndPay;
import React from 'react';
import { Globe, Package, Plus } from 'lucide-react';
import { Button, Card } from '../../lib/ui';
import { OrderFormData, Country, Package as ServicePackage, AdditionalService } from '../../hooks/useOrderForm';

interface Step2ServiceSelectionProps {
  formData: OrderFormData;
  updateFormData: (updates: Partial<OrderFormData>) => void;
  countries: Country[];
  packages: ServicePackage[];
  additionalServices: AdditionalService[];
  onNext: () => void;
  onPrev: () => void;
}

const Step2ServiceSelection: React.FC<Step2ServiceSelectionProps> = ({
  formData,
  updateFormData,
  countries,
  packages,
  additionalServices,
  onNext,
  onPrev
}) => {
  const handleCountryChange = (countryId: string) => {
    updateFormData({ selectedCountryId: countryId });
  };

  const handlePackageChange = (packageId: string) => {
    updateFormData({ selectedPackageId: packageId });
  };

  const handleAdditionalServiceToggle = (serviceId: string) => {
    const currentServices = formData.selectedAdditionalServiceIds;
    const updatedServices = currentServices.includes(serviceId)
      ? currentServices.filter(id => id !== serviceId)
      : [...currentServices, serviceId];
    
    updateFormData({ selectedAdditionalServiceIds: updatedServices });
  };

  const isValid = formData.selectedCountryId && formData.selectedPackageId;

  return (
    <div className="space-y-6">
      {/* Country Selection */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-bold text-gray-900">Select Country</h2>
          <p className="text-gray-600">Choose your target jurisdiction</p>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {countries.map((country) => (
              <button
                key={country.id}
                onClick={() => handleCountryChange(country.id)}
                className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                  formData.selectedCountryId === country.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{country.flag_emoji}</span>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">{country.name}</h3>
                    {country.is_recommended && (
                      <span className="text-xs text-blue-600 font-medium">Recommended</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* Package Selection */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-bold text-gray-900">Select Package</h2>
          <p className="text-gray-600">Choose your service package</p>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {packages.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => handlePackageChange(pkg.id)}
                className={`p-6 border-2 rounded-lg transition-all duration-200 text-left ${
                  formData.selectedPackageId === pkg.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{pkg.name}</h3>
                  <span className="text-lg font-bold text-blue-600">${pkg.price}</span>
                </div>
                <p className="text-sm text-gray-600">{pkg.description}</p>
              </button>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* Additional Services */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-bold text-gray-900">Additional Services</h2>
          <p className="text-gray-600">Optional add-on services</p>
        </Card.Header>
        <Card.Body>
          <div className="space-y-3">
            {additionalServices.map((service) => (
              <label
                key={service.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.selectedAdditionalServiceIds.includes(service.id)}
                    onChange={() => handleAdditionalServiceToggle(service.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{service.name}</h4>
                    <p className="text-sm text-gray-600">{service.description}</p>
                  </div>
                </div>
                <span className="font-semibold text-gray-900">${service.price}</span>
              </label>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Previous
        </Button>
        <Button 
          onClick={onNext}
          disabled={!isValid}
        >
          Next Step
        </Button>
      </div>
    </div>
  );
};

export default Step2ServiceSelection;
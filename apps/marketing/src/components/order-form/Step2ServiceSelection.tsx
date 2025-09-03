// apps/marketing/src/components/order-form/Step2ServiceSelection.tsx
import React, { useState, useEffect } from 'react';
import { Globe, Package, Plus, CheckCircle, DollarSign } from 'lucide-react';
import { Card, Button } from '../../lib/ui';
import { supabase } from '../../lib/supabase';
import { OrderFormData, Country, Package as PackageType, AdditionalService } from '../../hooks/useOrderForm';
import { useLanguage } from '../../lib/language'; // useLanguage kancasını içe aktar

interface Step2ServiceSelectionProps {
  formData: OrderFormData;
  updateFormData: (updates: Partial<OrderFormData>) => void;
  countries: Country[];
  packages: PackageType[];
  additionalServices: AdditionalService[];
  onNext: () => void;
  onPrev: () => void;
}

interface CountryAdditionalService extends AdditionalService {
  countryPrice: number;
}

const Step2ServiceSelection: React.FC<Step2ServiceSelectionProps> = ({
  formData,
  updateFormData,
  countries,
  packages,
  additionalServices,
  onNext,
  onPrev,
}) => {
  const { t } = useLanguage(); // t fonksiyonunu kullan
  const [countryAdditionalServices, setCountryAdditionalServices] = useState<CountryAdditionalService[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);

  useEffect(() => {
    if (formData.selectedCountryId) {
      fetchCountryAdditionalServices();
    }
  }, [formData.selectedCountryId]);

  const fetchCountryAdditionalServices = async () => {
    if (!formData.selectedCountryId) return;

    try {
      setLoadingServices(true);
      const { data: countryServices, error } = await supabase
        .from('country_additional_services')
        .select(`
          price,
          additional_service:additional_services(*)
        `)
        .eq('country_id', formData.selectedCountryId)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching country services:', error);
      } else {
        const servicesWithPrices = countryServices?.map(cs => ({
          ...cs.additional_service,
          countryPrice: cs.price,
        })) || [];
        setCountryAdditionalServices(servicesWithPrices);
      }
    } catch (error) {
      console.error('Error fetching country services:', error);
    } finally {
      setLoadingServices(false);
    }
  };

  const validateStep = () => {
    return (
      formData.selectedCountryId !== '' &&
      formData.selectedPackageId !== ''
    );
  };

  const handleNext = () => {
    if (validateStep()) {
      onNext();
    } else {
      alert(t('orderForm.serviceSelection.alertSelectCountryPackage'));
    }
  };

  const toggleAdditionalService = (serviceId: string) => {
    const currentServices = formData.selectedAdditionalServiceIds;
    const isSelected = currentServices.includes(serviceId);
    
    if (isSelected) {
      updateFormData({
        selectedAdditionalServiceIds: currentServices.filter(id => id !== serviceId)
      });
    } else {
      updateFormData({
        selectedAdditionalServiceIds: [...currentServices, serviceId]
      });
    }
  };

  const recommendedCountries = countries.filter(c => c.is_recommended);
  const otherCountries = countries.filter(c => !c.is_recommended);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('orderForm.serviceSelection.title')}</h2>
        <p className="text-gray-600">{t('orderForm.serviceSelection.subtitle')}</p>
      </div>

      {/* Country Selection */}
      <Card>
        <Card.Header>
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">{t('orderForm.serviceSelection.countrySelection')} *</h3>
          </div>
        </Card.Header>
        <Card.Body>
          {/* Recommended Countries */}
          {recommendedCountries.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">{t('orderForm.serviceSelection.recommendedCountries')}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendedCountries.map((country) => (
                  <button
                    key={country.id}
                    onClick={() => updateFormData({ selectedCountryId: country.id })}
                    className={`p-4 border-2 rounded-lg transition-all duration-200 text-left ${
                      formData.selectedCountryId === country.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{country.flag_emoji}</span>
                      <div>
                        <h5 className="font-semibold text-gray-900">{country.name}</h5>
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                          {t('orderForm.serviceSelection.recommended')}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Other Countries */}
          {otherCountries.length > 0 && (
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">{t('orderForm.serviceSelection.otherCountries')}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {otherCountries.map((country) => (
                  <button
                    key={country.id}
                    onClick={() => updateFormData({ selectedCountryId: country.id })}
                    className={`p-3 border-2 rounded-lg transition-all duration-200 text-left ${
                      formData.selectedCountryId === country.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{country.flag_emoji}</span>
                      <span className="font-medium text-gray-900 text-sm">{country.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Package Selection */}
      <Card>
        <Card.Header>
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-green-600" />
            <h3 className="text-xl font-semibold text-gray-900">{t('orderForm.serviceSelection.packageSelection')} *</h3>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => updateFormData({ selectedPackageId: pkg.id })}
                className={`p-4 border-2 rounded-lg transition-all duration-200 text-left ${
                  formData.selectedPackageId === pkg.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h4 className="font-semibold text-gray-900 mb-2">{pkg.name}</h4>
                <p className="text-sm text-gray-600 mb-3">{pkg.description}</p>
                <div className="font-bold text-lg text-blue-600">
                  ${pkg.price.toFixed(2)}
                </div>
              </button>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* Additional Services Selection */}
      <Card>
        <Card.Header>
          <div className="flex items-center space-x-2">
            <Plus className="w-5 h-5 text-purple-600" />
            <h3 className="text-xl font-semibold text-gray-900">{t('orderForm.serviceSelection.additionalServices')}</h3>
          </div>
        </Card.Header>
        <Card.Body>
          {formData.selectedCountryId ? (
            loadingServices ? (
              <div className="text-center text-gray-500">{t('orderForm.serviceSelection.loadingServices')}</div>
            ) : countryAdditionalServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {countryAdditionalServices.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => toggleAdditionalService(service.id)}
                    className={`p-4 border-2 rounded-lg transition-all duration-200 text-left ${
                      formData.selectedAdditionalServiceIds.includes(service.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{service.name}</h4>
                      <CheckCircle
                        className={`w-5 h-5 ${
                          formData.selectedAdditionalServiceIds.includes(service.id)
                            ? 'text-blue-600'
                            : 'text-gray-300'
                        }`}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                    <div className="font-bold text-lg text-purple-600">
                      ${service.countryPrice.toFixed(2)}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">{t('orderForm.serviceSelection.noAdditionalServices')}</div>
            )
          ) : (
            <div className="text-center text-gray-500">{t('orderForm.serviceSelection.selectCountryFirst')}</div>
          )}
        </Card.Body>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onPrev}>
          {t('orderForm.common.back')}
        </Button>
        <Button onClick={handleNext}>
          {t('orderForm.common.next')}
        </Button>
      </div>
    </div>
  );
};

export default Step2ServiceSelection;

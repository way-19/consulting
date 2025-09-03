import React, { useState, useEffect } from 'react';
import { Globe, Package, Plus, CheckCircle, DollarSign } from 'lucide-react';
import { Card, Button } from '../../lib/ui';
import { supabase } from '@consulting19/shared';
import type { OrderFormData, Country, Package as PackageType, AdditionalService } from '../../hooks/useOrderForm';

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
      alert('Lütfen ülke ve paket seçimi yapın.');
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
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Hizmet Seçimi</h2>
        <p className="text-gray-600">Ülke, paket ve ek hizmetlerinizi seçin</p>
      </div>

      {/* Country Selection */}
      <Card>
        <Card.Header>
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">Ülke Seçimi *</h3>
          </div>
        </Card.Header>
        <Card.Body>
          {/* Recommended Countries */}
          {recommendedCountries.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Önerilen Ülkeler</h4>
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
                          Önerilen
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
              <h4 className="text-lg font-medium text-gray-900 mb-4">Diğer Ülkeler</h4>
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
            <h3 className="text-xl font-semibold text-gray-900">Paket Seçimi *</h3>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => updateFormData({ selectedPac
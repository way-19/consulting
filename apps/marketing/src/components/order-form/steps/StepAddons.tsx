import React from 'react';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { CheckCircle } from 'lucide-react';
import { FormationApplicationData } from '../../../schemas/formationApplicationSchema';
import { Card } from '../../../lib/ui';
import { formatCurrency } from '../../../lib/currency';

interface StepAddonsProps {
  setValue: UseFormSetValue<FormationApplicationData>;
  watch: UseFormWatch<FormationApplicationData>;
  selectedJurisdiction: any;
}

export const StepAddons: React.FC<StepAddonsProps> = ({
  setValue,
  watch,
  selectedJurisdiction,
}) => {
  const selectedAddons = watch('addons') || [];
  const currency = selectedJurisdiction?.currency || 'USD';
  const addons = selectedJurisdiction?.addons?.filter((addon: any) => addon.active) || [];

  const handleAddonToggle = (addon: any) => {
    const isSelected = selectedAddons.some(selected => selected.id === addon.id);
    
    if (isSelected) {
      // Remove addon
      setValue('addons', selectedAddons.filter(selected => selected.id !== addon.id));
    } else {
      // Add addon
      setValue('addons', [...selectedAddons, {
        id: addon.id,
        label: addon.label,
        price: addon.price,
      }]);
    }
  };

  const isAddonSelected = (addonId: string) => {
    return selectedAddons.some(addon => addon.id === addonId);
  };

  // Check if addons step is disabled for this jurisdiction
  if (selectedJurisdiction?.steps?.addons === false) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Additional Services</h3>
          <p className="text-gray-600">Additional services configuration</p>
        </div>
        
        <Card className="bg-gray-50 border-gray-200">
          <Card.Body className="text-center py-12">
            <div className="text-4xl mb-4">✨</div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              No Additional Services Available
            </h4>
            <p className="text-gray-600">
              The selected package includes all available services for {selectedJurisdiction.name}.
            </p>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Additional Services</h3>
        <p className="text-gray-600">
          Enhance your package with these optional services
        </p>
      </div>

      {addons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addons.map((addon: any) => {
            const isSelected = isAddonSelected(addon.id);
            
            return (
              <Card
                key={addon.id}
                hover
                className={`cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-300'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleAddonToggle(addon)}
              >
                <Card.Body className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{addon.label}</h4>
                      <div className="text-lg font-bold text-blue-600">
                        {formatCurrency(addon.price, currency)}
                      </div>
                    </div>
                    
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      isSelected
                        ? 'bg-blue-500 border-blue-500'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}>
                      {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="bg-gray-50 border-gray-200">
          <Card.Body className="text-center py-8">
            <div className="text-4xl mb-4">🎯</div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              No Additional Services
            </h4>
            <p className="text-gray-600">
              No additional services are available for {selectedJurisdiction.name} at this time.
            </p>
          </Card.Body>
        </Card>
      )}

      {selectedAddons.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <Card.Body>
            <h4 className="font-medium text-blue-900 mb-3">Selected Add-ons</h4>
            <div className="space-y-2">
              {selectedAddons.map((addon) => (
                <div key={addon.id} className="flex justify-between items-center">
                  <span className="text-blue-800">{addon.label}</span>
                  <span className="font-semibold text-blue-600">
                    {formatCurrency(addon.price, currency)}
                  </span>
                </div>
              ))}
              <div className="border-t border-blue-300 pt-2 mt-3">
                <div className="flex justify-between items-center font-semibold text-blue-900">
                  <span>Add-ons Total:</span>
                  <span>
                    {formatCurrency(
                      selectedAddons.reduce((sum, addon) => sum + addon.price, 0),
                      currency
                    )}
                  </span>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};
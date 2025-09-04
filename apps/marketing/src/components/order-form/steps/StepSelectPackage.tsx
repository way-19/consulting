import React from 'react';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { CheckCircle, Clock, Star } from 'lucide-react';
import { FormationApplicationData } from '../../../schemas/formationApplicationSchema';
import { Card } from '../../../lib/ui';
import { formatCurrency } from '../../../lib/currency';

interface StepSelectPackageProps {
  setValue: UseFormSetValue<FormationApplicationData>;
  watch: UseFormWatch<FormationApplicationData>;
  selectedJurisdiction: any;
}

export const StepSelectPackage: React.FC<StepSelectPackageProps> = ({
  setValue,
  watch,
  selectedJurisdiction,
}) => {
  const selectedPackage = watch('package');
  const currency = selectedJurisdiction?.currency || 'USD';
  const packages = selectedJurisdiction?.packages?.filter((pkg: any) => pkg.active) || [];

  const handlePackageSelect = (pkg: any) => {
    setValue('package', {
      id: pkg.id,
      name: pkg.name,
      price: pkg.price,
      currency,
      processingTime: pkg.processingTime,
      includes: pkg.includes,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Select Service Package</h3>
        <p className="text-gray-600">
          Choose the service level that best fits your needs
        </p>
      </div>

      {packages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {packages.map((pkg: any) => (
            <Card
              key={pkg.id}
              hover
              className={`cursor-pointer transition-all duration-200 relative ${
                selectedPackage?.id === pkg.id
                  ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-300'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handlePackageSelect(pkg)}
            >
              {pkg.recommended && (
                <div className="absolute top-3 right-3">
                  <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                    <Star className="w-3 h-3 mr-1" />
                    Recommended
                  </span>
                </div>
              )}
              
              <Card.Body className="p-6">
                <div className="text-center">
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{pkg.name}</h4>
                  
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {formatCurrency(pkg.price, currency)}
                  </div>
                  
                  <div className="text-sm text-gray-500 mb-4 flex items-center justify-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {pkg.processingTime}
                  </div>

                  <div className="text-left space-y-2">
                    <h5 className="font-medium text-gray-900 text-sm">What's Included:</h5>
                    <ul className="space-y-1">
                      {pkg.includes.map((item: string, index: number) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {selectedPackage?.id === pkg.id && (
                    <div className="mt-4 p-3 bg-blue-100 border border-blue-300 rounded-lg">
                      <div className="flex items-center justify-center text-blue-700 font-medium text-sm">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Selected Package
                      </div>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No packages available for this jurisdiction.</p>
        </div>
      )}
    </div>
  );
};
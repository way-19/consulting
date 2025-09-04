import React from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { FormationApplicationData } from '../../../schemas/formationApplicationSchema';
import { Card } from '../../ui';

interface StepSelectJurisdictionProps {
  selectedJurisdiction: string;
  onJurisdictionSelect: (jurisdiction: any) => void;
  setValue: UseFormSetValue<FormationApplicationData>;
  jurisdictions: any[];
}

export const StepSelectJurisdiction: React.FC<StepSelectJurisdictionProps> = ({
  selectedJurisdiction,
  onJurisdictionSelect,
  setValue,
  jurisdictions,
}) => {
  const handleJurisdictionSelect = (jurisdiction: any) => {
    setValue('jurisdiction', jurisdiction.code);
    onJurisdictionSelect(jurisdiction);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Select Jurisdiction</h3>
        <p className="text-gray-600">Choose the country where you want to incorporate your company</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jurisdictions
          .filter(j => j.active)
          .map(jurisdiction => (
            <Card
              key={jurisdiction.code}
              hover
              className={`cursor-pointer transition-all duration-200 ${
                selectedJurisdiction === jurisdiction.code
                  ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-300'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleJurisdictionSelect(jurisdiction)}
            >
              <Card.Body className="p-6">
                <div className="text-center">
                  <div className="text-4xl mb-3">{jurisdiction.flag}</div>
                  <h4 className="font-semibold text-gray-900 mb-2">{jurisdiction.name}</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Entity Types: {jurisdiction.entityTypes.join(', ')}</div>
                    <div>Currency: {jurisdiction.currency}</div>
                    <div>{jurisdiction.packages.length} packages available</div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
      </div>

      {jurisdictions.filter(j => j.active).length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No jurisdictions available at the moment.</p>
        </div>
      )}
    </div>
  );
};
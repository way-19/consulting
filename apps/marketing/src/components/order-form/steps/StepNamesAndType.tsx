import React from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { Plus, X } from 'lucide-react';
import { FormationApplicationData } from '../../../schemas/formationApplicationSchema';
import { Button } from '../../ui';

interface StepNamesAndTypeProps {
  register: UseFormRegister<FormationApplicationData>;
  errors: FieldErrors<FormationApplicationData>;
  watch: UseFormWatch<FormationApplicationData>;
  setValue: UseFormSetValue<FormationApplicationData>;
  selectedJurisdiction: any;
}

export const StepNamesAndType: React.FC<StepNamesAndTypeProps> = ({
  register,
  errors,
  watch,
  setValue,
  selectedJurisdiction,
}) => {
  const proposedNames = watch('proposedNames') || [''];
  const entityType = watch('entityType');
  
  const minNames = selectedJurisdiction?.validations?.minProposedNames || 1;
  const maxNames = 5;

  const addName = () => {
    if (proposedNames.length < maxNames) {
      setValue('proposedNames', [...proposedNames, '']);
    }
  };

  const removeName = (index: number) => {
    if (proposedNames.length > minNames) {
      const newNames = proposedNames.filter((_, i) => i !== index);
      setValue('proposedNames', newNames);
    }
  };

  const updateName = (index: number, value: string) => {
    const newNames = [...proposedNames];
    newNames[index] = value;
    setValue('proposedNames', newNames);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Company Names & Entity Type</h3>
        <p className="text-gray-600">
          Choose your entity type and provide {minNames > 1 ? `${minNames} alternative` : 'your preferred'} company name{minNames > 1 ? 's' : ''}
        </p>
      </div>

      {/* Entity Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Entity Type
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {selectedJurisdiction?.entityTypes?.map((type: string) => (
            <button
              key={type}
              type="button"
              onClick={() => setValue('entityType', type)}
              className={`p-4 border-2 rounded-lg text-left transition-all duration-200 hover:border-blue-300 ${
                entityType === type
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="font-medium text-gray-900">{type}</div>
              <div className="text-sm text-gray-600 mt-1">
                {type === 'LLC' && 'Limited Liability Company'}
                {type === 'JSC' && 'Joint Stock Company'}
                {type === 'Free Zone LLC' && 'Free Zone Limited Liability Company'}
                {type === 'Limited Şirketi' && 'Turkish Limited Company'}
                {type === 'Anonim Şirketi' && 'Turkish Joint Stock Company'}
                {type === 'Kollektif Şirketi' && 'Turkish Partnership'}
              </div>
            </button>
          ))}
        </div>
        {errors.entityType && (
          <p className="mt-2 text-sm text-red-600">{errors.entityType.message}</p>
        )}
      </div>

      {/* Proposed Names */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Proposed Company Names
          {minNames > 1 && (
            <span className="text-red-500 ml-1">
              (Minimum {minNames} required)
            </span>
          )}
        </label>
        
        <div className="space-y-3">
          {proposedNames.map((name, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium text-sm">
                  {index + 1}.
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => updateName(index, e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Company name ${index + 1}${index === 0 ? ' (primary)' : ''}`}
                />
              </div>
              {proposedNames.length > minNames && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  icon={X}
                  onClick={() => removeName(index)}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                />
              )}
            </div>
          ))}
        </div>
        
        {proposedNames.length < maxNames && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            icon={Plus}
            onClick={addName}
            className="mt-3"
          >
            Add Alternative Name
          </Button>
        )}
        
        {errors.proposedNames && (
          <p className="mt-2 text-sm text-red-600">{errors.proposedNames.message}</p>
        )}

        {/* Name Guidelines */}
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Name Guidelines</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Names should be unique and not conflict with existing companies</li>
            <li>• Avoid generic terms or restricted words</li>
            <li>• Names will be checked for availability during processing</li>
            {minNames > 1 && (
              <li>• Provide {minNames} alternatives to increase approval chances</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
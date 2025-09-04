import React from 'react';
import { UseFormWatch } from 'react-hook-form';
import { FormationApplicationData } from '../../schemas/formationApplicationSchema';
import { formatCurrency } from '../../lib/currency';
import { calculateTotal } from '../../lib/validators';

interface SummaryPanelProps {
  watch: UseFormWatch<FormationApplicationData>;
  selectedJurisdiction: any;
}

export const SummaryPanel: React.FC<SummaryPanelProps> = ({ watch, selectedJurisdiction }) => {
  const formData = watch();
  
  const estimatedTotal = calculateTotal(
    formData.package || null,
    formData.addons || []
  );
  
  const currency = selectedJurisdiction?.currency || 'USD';

  return (
    <div className="sticky top-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Summary</h3>
        
        <div className="space-y-4 text-sm">
          {/* Selected Jurisdiction */}
          {formData.jurisdiction && selectedJurisdiction && (
            <div>
              <span className="text-gray-500">Jurisdiction:</span>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-2xl">{selectedJurisdiction.flag}</span>
                <span className="font-medium text-gray-900">{selectedJurisdiction.name}</span>
              </div>
            </div>
          )}

          {/* Entity Type */}
          {formData.entityType && (
            <div>
              <span className="text-gray-500">Entity Type:</span>
              <div className="font-medium text-gray-900 mt-1">{formData.entityType}</div>
            </div>
          )}

          {/* Proposed Names */}
          {formData.proposedNames && formData.proposedNames.some(name => name.trim()) && (
            <div>
              <span className="text-gray-500">Proposed Names:</span>
              <div className="mt-1 space-y-1">
                {formData.proposedNames
                  .filter(name => name.trim())
                  .map((name, index) => (
                    <div key={index} className="font-medium text-gray-900">
                      {index + 1}. {name}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Selected Package */}
          {formData.package && (
            <div>
              <span className="text-gray-500">Package:</span>
              <div className="font-medium text-gray-900 mt-1">{formData.package.name}</div>
              <div className="text-blue-600 font-semibold">
                {formatCurrency(formData.package.price, currency)}
              </div>
              {formData.package.processingTime && (
                <div className="text-xs text-gray-500">
                  Processing: {formData.package.processingTime}
                </div>
              )}
            </div>
          )}

          {/* Selected Add-ons */}
          {formData.addons && formData.addons.length > 0 && (
            <div>
              <span className="text-gray-500">Add-ons:</span>
              <div className="mt-1 space-y-1">
                {formData.addons.map((addon, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">{addon.label}</span>
                    <span className="text-blue-600">
                      {formatCurrency(addon.price, currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Information */}
          {formData.contact && (formData.contact.fullName || formData.contact.email) && (
            <div>
              <span className="text-gray-500">Contact:</span>
              <div className="mt-1 space-y-1">
                {formData.contact.fullName && (
                  <div className="font-medium text-gray-900">{formData.contact.fullName}</div>
                )}
                {formData.contact.email && (
                  <div className="text-sm text-gray-600">{formData.contact.email}</div>
                )}
                {formData.contact.phone && (
                  <div className="text-sm text-gray-600">{formData.contact.phone}</div>
                )}
              </div>
            </div>
          )}

          {/* Estimated Total */}
          {estimatedTotal > 0 && (
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Estimated Total:</span>
                <span className="font-bold text-lg text-blue-600">
                  {formatCurrency(estimatedTotal, currency)}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Final amount may vary based on government fees
              </div>
            </div>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 mb-2">Progress</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(((estimatedTotal > 0 ? 4 : 2) / 6) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { UseFormRegister, UseFormWatch, FieldErrors } from 'react-hook-form';
import { CheckCircle, AlertCircle, Shield, FileText, User, Mail, Phone, MapPin } from 'lucide-react';
import { FormationApplicationData } from '../../../schemas/formationApplicationSchema';
import { Card } from '../../ui';
import { formatCurrency } from '../../../lib/currency';
import { calculateTotal } from '../../../lib/validators';

interface StepConfirmationProps {
  register: UseFormRegister<FormationApplicationData>;
  watch: UseFormWatch<FormationApplicationData>;
  errors: FieldErrors<FormationApplicationData>;
  selectedJurisdiction: any;
}

export const StepConfirmation: React.FC<StepConfirmationProps> = ({
  register,
  watch,
  errors,
  selectedJurisdiction,
}) => {
  const formData = watch();
  const currency = selectedJurisdiction?.currency || 'USD';
  
  const estimatedTotal = calculateTotal(
    formData.package || null,
    formData.addons || []
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Review & Submit</h3>
        <p className="text-gray-600">
          Please review all information before submitting your application
        </p>
      </div>

      {/* Application Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company Details */}
        <Card>
          <Card.Header>
            <h4 className="font-semibold text-gray-900">Company Details</h4>
          </Card.Header>
          <Card.Body className="space-y-3">
            <div>
              <span className="text-sm text-gray-500">Jurisdiction:</span>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-2xl">{selectedJurisdiction?.flag}</span>
                <span className="font-medium text-gray-900">{selectedJurisdiction?.name}</span>
              </div>
            </div>
            
            {formData.entityType && (
              <div>
                <span className="text-sm text-gray-500">Entity Type:</span>
                <div className="font-medium text-gray-900 mt-1">{formData.entityType}</div>
              </div>
            )}
            
            {formData.proposedNames && formData.proposedNames.some(name => name.trim()) && (
              <div>
                <span className="text-sm text-gray-500">Proposed Names:</span>
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
          </Card.Body>
        </Card>

        {/* Contact Information */}
        <Card>
          <Card.Header>
            <h4 className="font-semibold text-gray-900">Contact Information</h4>
          </Card.Header>
          <Card.Body className="space-y-3">
            {formData.contact?.fullName && (
              <div className="flex items-center space-x-3">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900">{formData.contact.fullName}</span>
              </div>
            )}
            
            {formData.contact?.email && (
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900">{formData.contact.email}</span>
              </div>
            )}
            
            {formData.contact?.phone && (
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900">{formData.contact.phone}</span>
              </div>
            )}
            
            {formData.personal?.address?.street && (
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                <div className="text-gray-900">
                  <div>{formData.personal.address.street}</div>
                  <div>
                    {formData.personal.address.city}
                    {formData.personal.address.state && `, ${formData.personal.address.state}`}
                    {` ${formData.personal.address.zipcode}`}
                  </div>
                  <div>{formData.personal.address.country}</div>
                </div>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>

      {/* Package & Add-ons Summary */}
      <Card>
        <Card.Header>
          <h4 className="font-semibold text-gray-900">Selected Services</h4>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            {/* Selected Package */}
            {formData.package && (
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <div>
                  <div className="font-medium text-gray-900">{formData.package.name}</div>
                  <div className="text-sm text-gray-500">
                    Processing: {formData.package.processingTime}
                  </div>
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {formatCurrency(formData.package.price, currency)}
                </div>
              </div>
            )}

            {/* Selected Add-ons */}
            {formData.addons && formData.addons.length > 0 && (
              <>
                {formData.addons.map((addon, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <span className="text-gray-700">{addon.label}</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(addon.price, currency)}
                    </span>
                  </div>
                ))}
              </>
            )}

            {/* Total */}
            {estimatedTotal > 0 && (
              <div className="flex justify-between items-center py-3 border-t-2 border-gray-300">
                <span className="text-lg font-semibold text-gray-900">Estimated Total:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatCurrency(estimatedTotal, currency)}
                </span>
              </div>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* Payment Information Notice */}
      <Card className="bg-blue-50 border-blue-200">
        <Card.Body>
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900 mb-2">Payment Information</h4>
              <p className="text-sm text-blue-700">
                After your application is reviewed and approved, you will receive payment instructions 
                from your assigned consultant. Payment processing is handled securely through our 
                integrated payment system with proper commission distribution.
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Terms and Conditions */}
      <div className="space-y-4">
        <Card className="border-gray-300">
          <Card.Body>
            <h4 className="font-medium text-gray-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-600" />
              Terms and Agreements
            </h4>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  {...register('consents.termsAccepted')}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-700">
                  I have read and agree to the{' '}
                  <a 
                    href="/terms" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Terms of Service
                  </a>
                  {errors.consents?.termsAccepted && (
                    <span className="block text-red-600 mt-1">{errors.consents.termsAccepted.message}</span>
                  )}
                </label>
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  {...register('consents.privacyAccepted')}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-700">
                  I have read and agree to the{' '}
                  <a 
                    href="/privacy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Privacy Policy
                  </a>
                  {errors.consents?.privacyAccepted && (
                    <span className="block text-red-600 mt-1">{errors.consents.privacyAccepted.message}</span>
                  )}
                </label>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Application Confirmation */}
      <Card className="bg-green-50 border-green-200">
        <Card.Body>
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-green-900 mb-2">Application Submission</h4>
              <p className="text-sm text-green-700 leading-relaxed">
                By submitting this application, you confirm that all information provided is accurate 
                and complete. Our team will review your application and contact you within 24-48 hours 
                to proceed with the formation process.
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Next Steps Information */}
      <Card className="bg-gray-50 border-gray-200">
        <Card.Body>
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-gray-600" />
            What Happens Next?
          </h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
              Application review within 24-48 hours
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
              Assignment to your dedicated {selectedJurisdiction?.name} specialist
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
              Payment instructions and process initiation
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
              Regular updates throughout the formation process
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
              Delivery of certificates and company documentation
            </li>
          </ul>
        </Card.Body>
      </Card>
    </div>
  );
};
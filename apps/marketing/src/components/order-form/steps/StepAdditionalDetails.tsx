import React from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import { User, Mail, Phone, MapPin, Globe, Calendar } from 'lucide-react';
import { FormationApplicationData } from '../../../schemas/formationApplicationSchema';

interface StepAdditionalDetailsProps {
  register: UseFormRegister<FormationApplicationData>;
  errors: FieldErrors<FormationApplicationData>;
  watch: UseFormWatch<FormationApplicationData>;
  selectedJurisdiction: any;
}

export const StepAdditionalDetails: React.FC<StepAdditionalDetailsProps> = ({
  register,
  errors,
  watch,
  selectedJurisdiction,
}) => {
  const fields = selectedJurisdiction?.fields || {};
  const validations = selectedJurisdiction?.validations || {};

  const getFieldStatus = (fieldName: string) => {
    return fields[fieldName] || 'optional';
  };

  const isFieldRequired = (fieldName: string) => {
    return getFieldStatus(fieldName) === 'required';
  };

  const isFieldVisible = (fieldName: string) => {
    return getFieldStatus(fieldName) !== 'hidden';
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Details</h3>
        <p className="text-gray-600">
          Please provide your personal and contact information
        </p>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isFieldVisible('email') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name {isFieldRequired('email') && <span className="text-red-500">*</span>}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  {...register('contact.fullName')}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              {errors.contact?.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.contact.fullName.message}</p>
              )}
            </div>
          )}

          {isFieldVisible('email') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address {isFieldRequired('email') && <span className="text-red-500">*</span>}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  {...register('contact.email')}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
              {errors.contact?.email && (
                <p className="mt-1 text-sm text-red-600">{errors.contact.email.message}</p>
              )}
            </div>
          )}

          {isFieldVisible('phone') && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number {isFieldRequired('phone') && <span className="text-red-500">*</span>}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  {...register('contact.phone')}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1234567890 (E.164 format)"
                />
              </div>
              {errors.contact?.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.contact.phone.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Please use E.164 format (e.g., +1234567890)
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Personal Information */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isFieldVisible('nationality') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nationality {isFieldRequired('nationality') && <span className="text-red-500">*</span>}
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  {...register('personal.nationality')}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., American, British, Turkish"
                />
              </div>
              {errors.personal?.nationality && (
                <p className="mt-1 text-sm text-red-600">{errors.personal.nationality.message}</p>
              )}
            </div>
          )}

          {isFieldVisible('dateOfBirth') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth {isFieldRequired('dateOfBirth') && <span className="text-red-500">*</span>}
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  {...register('personal.dateOfBirth')}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - validations.minApplicantAge)).toISOString().split('T')[0]}
                />
              </div>
              {errors.personal?.dateOfBirth && (
                <p className="mt-1 text-sm text-red-600">{errors.personal.dateOfBirth.message}</p>
              )}
            </div>
          )}

          {isFieldVisible('passportNumber') && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passport Number {isFieldRequired('passportNumber') && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                {...register('personal.passportNumber')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your passport number"
              />
              {errors.personal?.passportNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.personal.passportNumber.message}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Address Information */}
      {isFieldVisible('address') && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address {isFieldRequired('address') && <span className="text-red-500">*</span>}
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  {...register('personal.address.street')}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your street address"
                />
              </div>
              {errors.personal?.address?.street && (
                <p className="mt-1 text-sm text-red-600">{errors.personal.address.street.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City {isFieldRequired('address') && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  {...register('personal.address.city')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="City"
                />
                {errors.personal?.address?.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.personal.address.city.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State/Province
                </label>
                <input
                  type="text"
                  {...register('personal.address.state')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="State/Province"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zip/Postal Code {isFieldRequired('address') && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  {...register('personal.address.zipcode')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Zip code"
                />
                {errors.personal?.address?.zipcode && (
                  <p className="mt-1 text-sm text-red-600">{errors.personal.address.zipcode.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country {isFieldRequired('address') && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                {...register('personal.address.country')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Country"
              />
              {errors.personal?.address?.country && (
                <p className="mt-1 text-sm text-red-600">{errors.personal.address.country.message}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Information Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-800 mb-2">
          📋 Information Use
        </h4>
        <p className="text-sm text-yellow-700">
          This information will be used for company registration and compliance purposes only. 
          All data is handled securely and in accordance with our privacy policy.
        </p>
      </div>
    </div>
  );
};
import React from 'react';
import { Building, Mail, Phone, User } from 'lucide-react';
import { Button, Card } from '../../lib/ui';
import { OrderFormData } from '../../hooks/useOrderForm';

interface Step1CompanyDetailsProps {
  formData: OrderFormData;
  updateFormData: (updates: Partial<OrderFormData>) => void;
  onNext: () => void;
}

const Step1CompanyDetails: React.FC<Step1CompanyDetailsProps> = ({
  formData,
  updateFormData,
  onNext
}) => {
  const handleInputChange = (field: keyof OrderFormData, value: string) => {
    updateFormData({ [field]: value });
  };

  const isValid = formData.companyName && formData.companyType && formData.contactEmail && formData.phoneNumber;

  return (
    <Card>
      <Card.Header>
        <h2 className="text-2xl font-bold text-gray-900">Company Details</h2>
        <p className="text-gray-600">Tell us about your company</p>
      </Card.Header>
      <Card.Body className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Name *
          </label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your company name"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Type *
          </label>
          <select
            value={formData.companyType}
            onChange={(e) => handleInputChange('companyType', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select company type</option>
            <option value="LLC">LLC</option>
            <option value="Corporation">Corporation</option>
            <option value="Partnership">Partnership</option>
            <option value="Sole Proprietorship">Sole Proprietorship</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Email *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => handleInputChange('contactEmail', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email address"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your phone number"
              required
            />
          </div>
        </div>
      </Card.Body>
      <Card.Footer>
        <div className="flex justify-end">
          <Button 
            onClick={onNext}
            disabled={!isValid}
            className="px-8 py-3"
          >
            Next Step
          </Button>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default Step1CompanyDetails;
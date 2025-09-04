import React from 'react';
import { CreditCard } from 'lucide-react';
import { Button, Card } from '../../lib/ui';
import { OrderFormData, Bank } from '../../hooks/useOrderForm';

interface Step3BankingDetailsProps {
  formData: OrderFormData;
  updateFormData: (updates: Partial<OrderFormData>) => void;
  banks: Bank[];
  onNext: () => void;
  onPrev: () => void;
}

const Step3BankingDetails: React.FC<Step3BankingDetailsProps> = ({
  formData,
  updateFormData,
  banks,
  onNext,
  onPrev
}) => {
  const handleBankChange = (bankId: string) => {
    updateFormData({ selectedBankId: bankId });
  };

  return (
    <div className="space-y-6">
      <Card>
        <Card.Header>
          <h2 className="text-2xl font-bold text-gray-900">Banking Details</h2>
          <p className="text-gray-600">Select your preferred banking partner</p>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banks.map((bank) => (
              <button
                key={bank.id}
                onClick={() => handleBankChange(bank.id)}
                className={`p-6 border-2 rounded-lg transition-all duration-200 text-left ${
                  formData.selectedBankId === bank.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {bank.flag_url && (
                      <img src={bank.flag_url} alt={bank.name} className="w-6 h-6" />
                    )}
                    <h3 className="font-semibold text-gray-900">{bank.name}</h3>
                  </div>
                  <span className="text-lg font-bold text-blue-600">${bank.price}</span>
                </div>
                <p className="text-sm text-gray-600">Banking setup and account opening assistance</p>
              </button>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Previous
        </Button>
        <Button onClick={onNext}>
          Next Step
        </Button>
      </div>
    </div>
  );
};

export default Step3BankingDetails;
// apps/marketing/src/components/order-form/Step3BankingDetails.tsx
import React, { useState, useEffect } from 'react';
import { Banknote, CheckCircle, DollarSign, CreditCard } from 'lucide-react';
import { Card, Button } from '../../lib/ui';
import { supabase } from '../../lib/supabase';
import type { OrderFormData, Bank } from '../../hooks/useOrderForm';
import { useLanguage } from '../../lib/language'; // useLanguage kancasını içe aktar

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
  onPrev,
}) => {
  const { t } = useLanguage(); // t fonksiyonunu kullan

  const validateStep = () => {
    return formData.selectedBankId !== '';
  };

  const handleNext = () => {
    if (validateStep()) {
      onNext();
    } else {
      alert(t('orderForm.bankingDetails.alertSelectBank'));
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('orderForm.bankingDetails.title')}</h2>
        <p className="text-gray-600">{t('orderForm.bankingDetails.subtitle')}</p>
      </div>

      <Card>
        <Card.Header>
          <div className="flex items-center space-x-2">
            <Banknote className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">{t('orderForm.bankingDetails.bankSelection')} *</h3>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banks.map((bank) => (
              <button
                key={bank.id}
                onClick={() => updateFormData({ selectedBankId: bank.id })}
                className={`p-4 border-2 rounded-lg transition-all duration-200 text-left ${
                  formData.selectedBankId === bank.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  {bank.flag_url && (
                    <img src={bank.flag_url} alt={bank.name} className="w-8 h-8 object-contain" />
                  )}
                  <h4 className="font-semibold text-gray-900">{bank.name}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {t('orderForm.bankingDetails.bankDescription', { bankName: bank.name })}
                </p>
                <div className="font-bold text-lg text-green-600">
                  ${bank.price.toFixed(2)}
                </div>
              </button>
            ))}
          </div>
        </Card.Body>
      </Card>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onPrev}>
          {t('orderForm.common.back')}
        </Button>
        <Button onClick={handleNext}>
          {t('orderForm.common.next')}
        </Button>
      </div>
    </div>
  );
};

export default Step3BankingDetails;


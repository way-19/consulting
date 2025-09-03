// apps/marketing/src/components/order-form/OrderFormProgressBar.tsx
import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { useLanguage } from '../../lib/language'; // useLanguage kancasını içe aktar

interface OrderFormProgressBarProps {
  currentStep: number;
}

const OrderFormProgressBar: React.FC<OrderFormProgressBarProps> = ({ currentStep }) => {
  const { t } = useLanguage(); // t fonksiyonunu kullan

  const steps = [
    { id: 1, name: t('orderForm.common.step1') },
    { id: 2, name: t('orderForm.common.step2') },
    { id: 3, name: t('orderForm.common.step3') },
    { id: 4, name: t('orderForm.common.step4') },
  ];

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center relative">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm transition-colors duration-300 ${
                currentStep >= step.id ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              {currentStep > step.id ? <CheckCircle className="w-5 h-5" /> : step.id}
            </div>
            <p
              className={`mt-2 text-center text-xs font-medium ${
                currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              {step.name}
            </p>
            {step.id < steps.length && (
              <div
                className={`absolute left-full top-5 h-0.5 w-full transform -translate-x-1/2 ${
                  currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default OrderFormProgressBar;


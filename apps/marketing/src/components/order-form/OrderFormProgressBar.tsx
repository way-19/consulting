import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';

interface OrderFormProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const OrderFormProgressBar: React.FC<OrderFormProgressBarProps> = ({ currentStep, totalSteps }) => {
  const steps = [
    { number: 1, title: 'Şirket Bilgileri', description: 'Temel bilgiler' },
    { number: 2, title: 'Hizmet Seçimi', description: 'Paket ve ek hizmetler' },
    { number: 3, title: 'Bankacılık', description: 'Banka seçimi' },
    { number: 4, title: 'İnceleme & Ödeme', description: 'Son kontrol' },
  ];

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                step.number < currentStep
                  ? 'bg-green-600 border-green-600 text-white'
                  : step.number === currentStep
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-gray-300 text-gray-400'
              }`}>
                {step.number < currentStep ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <span className="font-semibold">{step.number}</span>
                )}
              </div>
              <div className="mt-2 text-center">
                <div className={`text-sm font-medium ${
                  step.number <= currentStep ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.title}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {step.description}
                </div>
              </div>
            </div>
            
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 transition-all duration-300 ${
                step.number < currentStep ? 'bg-green-600' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderFormProgressBar;
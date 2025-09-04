import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  description: string;
  enabled: boolean;
}

interface StepperProps {
  currentStep: number;
  steps: Step[];
}

export const Stepper: React.FC<StepperProps> = ({ currentStep, steps }) => {
  return (
    <div className="sticky top-8">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Company Formation</h2>
        <div className="text-sm text-gray-500 mb-4">Complete application process</div>
      </div>
      
      <div className="space-y-4">
        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          const isDisabled = !step.enabled;
          
          return (
            <div
              key={step.id}
              className={`flex items-start space-x-3 ${
                isDisabled ? 'opacity-50' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                  isCompleted
                    ? 'bg-green-500 text-white shadow-lg'
                    : isActive
                    ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-200'
                    : isDisabled
                    ? 'bg-gray-200 text-gray-400'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  step.id
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-blue-600'
                      : isCompleted
                      ? 'text-green-600'
                      : isDisabled
                      ? 'text-gray-400'
                      : 'text-gray-500'
                  }`}
                >
                  {step.title}
                  {isDisabled && ' (Skipped)'}
                </h3>
                <p
                  className={`text-xs mt-1 transition-colors duration-200 ${
                    isActive
                      ? 'text-blue-500'
                      : isCompleted
                      ? 'text-green-500'
                      : 'text-gray-400'
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast, { Toaster } from 'react-hot-toast';
import { 
  OrderFormData, 
  orderFormSchema,
  companyDetailsSchema,
  serviceSelectionSchema,
  bankingDetailsSchema,
  reviewAndPaySchema
} from '../types/order';
import { Step1CompanyDetails } from '../components/order-form/Step1CompanyDetails';
import { Step2ServiceSelection } from '../components/order-form/Step2ServiceSelection';
import { Step3BankingDetails } from '../components/order-form/Step3BankingDetails';
import { Step4ReviewAndPay } from '../components/order-form/Step4ReviewAndPay';
import { Button } from '../components/ui';

const STEPS = [
  { id: 1, title: 'Şirket Bilgileri', schema: companyDetailsSchema },
  { id: 2, title: 'Hizmet Seçimi', schema: serviceSelectionSchema },
  { id: 3, title: 'Bankacılık Detayları', schema: bankingDetailsSchema },
  { id: 4, title: 'İnceleme ve Ödeme', schema: reviewAndPaySchema },
];

export const OrderFormPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    mode: 'onChange',
    defaultValues: {
      selectedServices: [],
      termsAccepted: false,
      privacyAccepted: false,
    }
  });

  const { handleSubmit, trigger, formState: { errors } } = form;

  const validateCurrentStep = async () => {
    const currentStepSchema = STEPS[currentStep - 1].schema;
    const currentData = form.getValues();
    
    try {
      currentStepSchema.parse(currentData);
      return true;
    } catch (error) {
      // Trigger validation for current step fields
      const stepFields = Object.keys(currentStepSchema.shape);
      await trigger(stepFields as any);
      return false;
    }
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: OrderFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Form submitted:', data);
      toast.success('Siparişiniz başarıyla alındı! En kısa sürede sizinle iletişime geçeceğiz.');
      
      // Reset form after successful submission
      form.reset();
      setCurrentStep(1);
    } catch (error) {
      toast.error('Bir hata oluştu. Lütfen tekrar deneyiniz.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1CompanyDetails form={form} />;
      case 2:
        return <Step2ServiceSelection form={form} />;
      case 3:
        return <Step3BankingDetails form={form} />;
      case 4:
        return <Step4ReviewAndPay form={form} />;
      default:
        return null;
    }
  };

  const getStepErrors = (stepNumber: number) => {
    const stepSchema = STEPS[stepNumber - 1].schema;
    const stepFields = Object.keys(stepSchema.shape);
    return stepFields.some(field => errors[field as keyof typeof errors]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Toaster position="top-right" />
      
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200
                  ${currentStep >= step.id 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : getStepErrors(step.id)
                    ? 'bg-red-100 border-red-500 text-red-600'
                    : 'bg-white border-gray-300 text-gray-500'
                  }
                `}>
                  {currentStep > step.id ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    step.id
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`flex-1 mx-4 h-0.5 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            {renderStep()}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                Geri
              </Button>
              
              <div className="flex space-x-3">
                {currentStep < STEPS.length ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                  >
                    İleri
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Gönderiliyor...' : 'Siparişi Tamamla'}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
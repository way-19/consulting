import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast, Toaster } from 'react-hot-toast';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui';
import { ProgressIndicator } from '../components/order-form/ProgressIndicator';
import { Step1CompanyDetails } from '../components/order-form/Step1CompanyDetails';
import { Step2ServiceSelection } from '../components/order-form/Step2ServiceSelection';
import { Step3AdditionalDetails } from '../components/order-form/Step3AdditionalDetails';
import { Step4ReviewAndSubmit } from '../components/order-form/Step4ReviewAndSubmit';
import { OrderFormData } from '../types/order';
import { step1Schema, step2Schema, step3Schema, orderFormSchema } from '../schemas/orderSchema';

const steps = [
  { id: 1, title: 'Şirket Bilgileri', isCompleted: false, isActive: true },
  { id: 2, title: 'Hizmet Seçimi', isCompleted: false, isActive: false },
  { id: 3, title: 'Ek Detaylar', isCompleted: false, isActive: false },
  { id: 4, title: 'Onay', isCompleted: false, isActive: false }
];

export const OrderFormPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepStates, setStepStates] = useState(steps);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors }
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    mode: 'onChange',
    defaultValues: {
      selectedServices: [],
      communicationPreference: 'email'
    }
  });

  const updateStepStates = (step: number) => {
    setStepStates(prev => prev.map(s => ({
      ...s,
      isActive: s.id === step,
      isCompleted: s.id < step
    })));
  };

  const validateCurrentStep = async () => {
    let isValid = false;
    
    switch (currentStep) {
      case 1:
        isValid = await trigger(['companyName', 'contactPerson', 'email', 'phone', 'website']);
        break;
      case 2:
        isValid = await trigger(['selectedServices', 'projectDescription', 'timeline', 'budget']);
        break;
      case 3:
        isValid = await trigger(['preferredStartDate', 'communicationPreference', 'additionalRequirements']);
        break;
      default:
        isValid = true;
    }
    
    return isValid;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    
    if (isValid && currentStep < 4) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      updateStepStates(nextStep);
      toast.success('Adım tamamlandı!');
    } else if (!isValid) {
      toast.error('Lütfen tüm gerekli alanları doldurun');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      updateStepStates(prevStep);
    }
  };

  const onSubmit = async (data: OrderFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Order submitted:', data);
      toast.success('Siparişiniz başarıyla gönderildi! 24 saat içinde sizinle iletişime geçeceğiz.');
      
      // Reset form or redirect to success page
      // You can implement navigation to a success page here
      
    } catch (error) {
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
      console.error('Order submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalSubmit = () => {
    handleSubmit(onSubmit)();
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1CompanyDetails register={register} errors={errors} />;
      case 2:
        return (
          <Step2ServiceSelection
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />
        );
      case 3:
        return <Step3AdditionalDetails register={register} errors={errors} />;
      case 4:
        return (
          <Step4ReviewAndSubmit
            watch={watch}
            isSubmitting={isSubmitting}
            onSubmit={handleFinalSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Toaster position="top-right" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-8 sm:px-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Hizmet Talebi Formu
              </h1>
              <p className="text-gray-600">
                Projeniiz için en uygun çözümü birlikte bulalım
              </p>
            </div>

            <ProgressIndicator steps={stepStates} />

            <div className="mb-8">
              {renderCurrentStep()}
            </div>

            {/* Navigation Buttons */}
            {currentStep < 4 && (
              <div className="flex justify-between items-center pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Geri
                </Button>

                <div className="text-sm text-gray-500">
                  Adım {currentStep} / 4
                </div>

                <Button
                  variant="primary"
                  onClick={handleNext}
                  className="flex items-center gap-2"
                >
                  İleri
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {currentStep === 4 && (
              <div className="flex justify-between items-center pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Geri
                </Button>

                <div className="text-sm text-gray-500">
                  Son Adım
                </div>

                <div className="w-20" /> {/* Spacer for alignment */}
              </div>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Sorularınız mı var? 
            <a href="mailto:info@consulting19.com" className="text-blue-600 hover:text-blue-700 ml-1">
              Bizimle iletişime geçin
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
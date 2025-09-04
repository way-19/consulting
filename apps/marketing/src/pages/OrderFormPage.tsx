import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useOrderForm } from '../hooks/useOrderForm';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import OrderFormProgressBar from '../components/order-form/OrderFormProgressBar';
import Step1CompanyDetails from '../components/order-form/Step1CompanyDetails';
import Step2ServiceSelection from '../components/order-form/Step2ServiceSelection';
import Step3BankingDetails from '../components/order-form/Step3BankingDetails';
import Step4ReviewAndPay from '../components/order-form/Step4ReviewAndPay';
import { LoadingSpinner } from '@consulting19/shared';

const OrderFormPage: React.FC = () => {
  const {
    formData,
    updateFormData,
    currentStep,
    nextStep,
    prevStep,
    countries,
    packages,
    additionalServices,
    banks,
    loading,
    error,
    handleSubmit,
    isSubmitting,
  } = useOrderForm();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Hata Oluştu</h1>
          <p className="text-gray-700">{error}</p>
          <p className="text-gray-500 mt-2">Lütfen daha sonra tekrar deneyin veya destek ile iletişime geçin.</p>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1CompanyDetails
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <Step2ServiceSelection
            formData={formData}
            updateFormData={updateFormData}
            countries={countries}
            packages={packages}
            additionalServices={additionalServices}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <Step3BankingDetails
            formData={formData}
            updateFormData={updateFormData}
            banks={banks}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 4:
        return (
          <Step4ReviewAndPay
            formData={formData}
            countries={countries}
            packages={packages}
            additionalServices={additionalServices}
            banks={banks}
            onPrev={prevStep}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Sipariş Formu - Consulting19</title>
        <meta name="description" content="Consulting19 ile uluslararası iş hizmetleri sipariş formu." />
      </Helmet>

      <Navbar />

      <div className="pt-20 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <OrderFormProgressBar currentStep={currentStep} />
          <div className="mt-8">
            {renderStep()}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderFormPage;
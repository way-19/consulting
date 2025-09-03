// apps/marketing/src/pages/OrderFormPage.tsx
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar'; // Düzeltildi
import Footer from '../components/Footer'; // Düzeltildi
import OrderFormProgressBar from '../components/order-form/OrderFormProgressBar'; // Düzeltildi
import Step1CompanyDetails from '../components/order-form/Step1CompanyDetails'; // Düzeltildi
import Step2ServiceSelection from '../components/order-form/Step2ServiceSelection'; // Düzeltildi
import Step3BankingDetails from '../components/order-form/Step3BankingDetails'; // Düzeltildi
import Step4ReviewAndPay from '../components/order-form/Step4ReviewAndPay'; // Düzeltildi
import { useOrderForm } from '../hooks/useOrderForm'; // Düzeltildi
import { useLanguage } from '../lib/language'; // Düzeltildi
import { Card, Button } from '../lib/ui'; // Düzeltildi

const OrderFormPage = () => {
  const { t } = useLanguage();
  const {
    formData,
    updateFormData,
    currentStep,
    nextStep,
    prevStep,
    isSubmitting,
    submitOrder,
    countries,
    packages,
    additionalServices,
    banks,
    loading,
    error,
  } = useOrderForm();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">{t('common.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <Card.Body>
            <h2 className="text-xl font-bold text-red-600 mb-4">{t('common.error')}</h2>
            <p className="text-gray-600">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              {t('common.refresh')}
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{t('orderForm.common.title')} - Consulting19</title>
        <meta name="description" content={t('orderForm.common.subtitle')} />
      </Helmet>

      <Navbar />

      <div className="pt-20 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <OrderFormProgressBar currentStep={currentStep} />

          {currentStep === 1 && (
            <Step1CompanyDetails
              formData={formData}
              updateFormData={updateFormData}
              onNext={nextStep}
            />
          )}
          {currentStep === 2 && (
            <Step2ServiceSelection
              formData={formData}
              updateFormData={updateFormData}
              countries={countries}
              packages={packages}
              additionalServices={additionalServices}
              onNext={nextStep}
              onPrev={prevStep}
            />
          )}
          {currentStep === 3 && (
            <Step3BankingDetails
              formData={formData}
              updateFormData={updateFormData}
              banks={banks}
              onNext={nextStep}
              onPrev={prevStep}
            />
          )}
          {currentStep === 4 && (
            <Step4ReviewAndPay
              formData={formData}
              countries={countries}
              packages={packages}
              additionalServices={additionalServices}
              banks={banks}
              onPrev={prevStep}
              onSubmit={submitOrder}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderFormPage;

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { Helmet } from 'react-helmet-async';
import { Button } from '../lib/ui';
import Navbar from '../components/Navbar';

// Import wizard components
import { Stepper } from '../components/order-form/Stepper';
import { SummaryPanel } from '../components/order-form/SummaryPanel';
import { StepSelectJurisdiction } from '../components/order-form/steps/StepSelectJurisdiction';
import { StepNamesAndType } from '../components/order-form/steps/StepNamesAndType';
import { StepSelectPackage } from '../components/order-form/steps/StepSelectPackage';
import { StepAddons } from '../components/order-form/steps/StepAddons';
import { StepAdditionalDetails } from '../components/order-form/steps/StepAdditionalDetails';
import { StepConfirmation } from '../components/order-form/steps/StepConfirmation';

// Import schemas and utilities
import { 
  formationApplicationSchema, 
  createJurisdictionSchema,
  FormationApplicationData 
} from '../schemas/formationApplicationSchema';
import { useWizardState } from '../hooks/useWizardState';
import jurisdictionsData from '../config/jurisdictions.json';

const CompanyFormationWizard: React.FC = () => {
  const { user } = useAuth();
  const {
    formData: savedFormData,
    currentStep: savedCurrentStep,
    selectedJurisdiction: savedJurisdiction,
    isLoaded,
    updateFormData,
    setCurrentStep: updateCurrentStep,
    setSelectedJurisdiction: updateSelectedJurisdiction,
    clearStorage,
  } = useWizardState();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic schema based on selected jurisdiction
  const activeSchema = selectedJurisdiction 
    ? createJurisdictionSchema(selectedJurisdiction)
    : formationApplicationSchema;

  const form = useForm<FormationApplicationData>({
    resolver: zodResolver(activeSchema),
    mode: 'onChange',
    defaultValues: {
      jurisdiction: '',
      entityType: '',
      proposedNames: ['', '', ''],
      addons: [],
      contact: {
        fullName: '',
        email: '',
        phone: ''
      },
      personal: {
        nationality: '',
        dateOfBirth: '',
        passportNumber: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipcode: '',
          country: ''
        }
      },
      consents: {
        termsAccepted: false,
        privacyAccepted: false,
      }
    }
  });

  // Load saved state when available
  useEffect(() => {
    if (isLoaded && savedFormData) {
      form.reset(savedFormData);
      setCurrentStep(savedCurrentStep);
      setSelectedJurisdiction(savedJurisdiction);
    }
  }, [isLoaded, savedFormData, savedCurrentStep, savedJurisdiction, form]);

  // Save state to localStorage whenever form changes
  const watchedValues = form.watch();
  useEffect(() => {
    if (isLoaded) {
      updateFormData(watchedValues);
      updateCurrentStep(currentStep);
      updateSelectedJurisdiction(selectedJurisdiction);
    }
  }, [watchedValues, currentStep, selectedJurisdiction, isLoaded]);

  // Define all wizard steps
  const allSteps = [
    { id: 1, title: 'Select Jurisdiction', description: 'Choose country', enabled: true },
    { id: 2, title: 'Company Name & Type', description: 'Names and entity', enabled: true },
    { id: 3, title: 'Select Package', description: 'Service package', enabled: true },
    { id: 4, title: 'Additional Services', description: 'Optional add-ons', enabled: selectedJurisdiction?.steps?.addons !== false },
    { id: 5, title: 'Your Details', description: 'Contact info', enabled: true },
    { id: 6, title: 'Review & Submit', description: 'Confirm application', enabled: true }
  ];

  const handleJurisdictionSelect = (jurisdiction: any) => {
    setSelectedJurisdiction(jurisdiction);
    
    // Find and set the jurisdiction in the form
    const foundJurisdiction = jurisdictionsData.jurisdictions.find(
      j => j.code === jurisdiction.code
    );
    if (foundJurisdiction) {
      form.setValue('jurisdiction', jurisdiction.code);
    }
  };

  const getNextEnabledStep = (fromStep: number): number => {
    for (let step = fromStep + 1; step <= 6; step++) {
      const stepConfig = allSteps.find(s => s.id === step);
      if (stepConfig?.enabled) {
        return step;
      }
    }
    return fromStep; // No next step found
  };

  const getPrevEnabledStep = (fromStep: number): number => {
    for (let step = fromStep - 1; step >= 1; step--) {
      const stepConfig = allSteps.find(s => s.id === step);
      if (stepConfig?.enabled) {
        return step;
      }
    }
    return fromStep; // No previous step found
  };

  const nextStep = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      const nextStepNumber = getNextEnabledStep(currentStep);
      if (nextStepNumber > currentStep) {
        setCurrentStep(nextStepNumber);
      }
    } else {
      toast.error('Please complete all required fields before proceeding');
    }
  };

  const prevStep = () => {
    const prevStepNumber = getPrevEnabledStep(currentStep);
    if (prevStepNumber < currentStep) {
      setCurrentStep(prevStepNumber);
    }
  };

  const onSubmit = async (data: FormationApplicationData) => {
    if (!user) {
      toast.error('Please log in to submit your application');
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate totals
      const packagePrice = data.package?.price || 0;
      const addonsTotal = data.addons?.reduce((sum, addon) => sum + addon.price, 0) || 0;
      const estimatedTotal = packagePrice + addonsTotal;

      // Prepare submission payload
      const submissionPayload = {
        ...data,
        totals: {
          package: packagePrice,
          addons: addonsTotal,
          estimatedTotal
        },
        meta: {
          submittedAt: new Date().toISOString(),
          source: 'company-formation-wizard',
          userAgent: navigator.userAgent
        }
      };

      // Update user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          role: 'client',
          country_id: selectedJurisdiction?.code
        })
        .eq('id', user.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
      }

      // Create or update client record
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .upsert({
          profile_id: user.id,
          assigned_consultant_id: selectedJurisdiction?.defaultConsultantId,
          status: 'active',
          priority: 'medium',
          company_name: data.proposedNames?.[0] || '',
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'profile_id'
        })
        .select()
        .single();

      if (clientError) {
        throw new Error(`Client record error: ${clientError.message}`);
      }

      // Create service order
      const { data: serviceOrder, error: orderError } = await supabase
        .from('service_orders')
        .insert({
          client_id: clientData.id,
          consultant_id: selectedJurisdiction?.defaultConsultantId,
          title: `Company Formation: ${data.proposedNames?.[0]} in ${selectedJurisdiction?.name}`,
          description: `${selectedJurisdiction?.name} ${data.entityType} formation with ${data.package?.name} package`,
          total_amount: estimatedTotal,
          currency: selectedJurisdiction?.currency || 'USD',
          status: 'pending',
          company_name: data.proposedNames?.[0] || '',
          customer_details: {
            contact: data.contact,
            personal: data.personal,
            package: data.package,
            addons: data.addons,
            submission_data: submissionPayload
          },
          country_id: selectedJurisdiction?.code,
        })
        .select()
        .single();

      if (orderError) {
        throw new Error(`Order creation error: ${orderError.message}`);
      }

      // Send notification to assigned consultant
      try {
        await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/notify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            recipient_id: selectedJurisdiction?.defaultConsultantId,
            type: 'new_formation_application',
            payload: {
              applicant_name: data.contact?.fullName,
              company_name: data.proposedNames?.[0],
              jurisdiction: selectedJurisdiction?.name,
              entity_type: data.entityType,
              package_name: data.package?.name,
              application_id: serviceOrder.id,
              estimated_total: estimatedTotal,
              currency: selectedJurisdiction?.currency || 'USD'
            },
            email_notification: true
          }),
        });
      } catch (notifyError) {
        console.error('Notification error:', notifyError);
        // Don't fail the main process if notification fails
      }

      // Clear saved wizard state
      clearStorage();

      toast.success('Application submitted successfully! Our team will contact you shortly.');
      
      // Redirect to client dashboard after short delay
      setTimeout(() => {
        window.location.href = 'http://localhost:5177/client';
      }, 2000);

    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render until state is loaded
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading wizard...</p>
        </div>
      </div>
    );
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepSelectJurisdiction
            selectedJurisdiction={form.watch('jurisdiction')}
            onJurisdictionSelect={handleJurisdictionSelect}
            setValue={form.setValue}
            jurisdictions={jurisdictionsData.jurisdictions}
          />
        );
      case 2:
        return (
          <StepNamesAndType
            register={form.register}
            errors={form.formState.errors}
            watch={form.watch}
            setValue={form.setValue}
            selectedJurisdiction={selectedJurisdiction}
          />
        );
      case 3:
        return (
          <StepSelectPackage
            setValue={form.setValue}
            watch={form.watch}
            selectedJurisdiction={selectedJurisdiction}
          />
        );
      case 4:
        return (
          <StepAddons
            setValue={form.setValue}
            watch={form.watch}
            selectedJurisdiction={selectedJurisdiction}
          />
        );
      case 5:
        return (
          <StepAdditionalDetails
            register={form.register}
            errors={form.formState.errors}
            watch={form.watch}
            selectedJurisdiction={selectedJurisdiction}
          />
        );
      case 6:
        return (
          <StepConfirmation
            register={form.register}
            watch={form.watch}
            errors={form.formState.errors}
            selectedJurisdiction={selectedJurisdiction}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Company Formation Application - Consulting19</title>
        <meta name="description" content="Apply for company formation services with our comprehensive wizard interface." />
      </Helmet>

      <Navbar />

      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Company Formation Application
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Complete your company formation application with our guided wizard. 
              Expert review and dedicated consultant assignment included.
            </p>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Left Stepper - Sticky */}
            <div className="col-span-12 lg:col-span-3">
              <Stepper currentStep={currentStep} steps={allSteps} />
            </div>

            {/* Center Content */}
            <div className="col-span-12 lg:col-span-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
                {renderCurrentStep()}

                {/* Navigation */}
                <div className="flex justify-between items-center pt-8 mt-8 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="px-6 py-3"
                  >
                    ← Previous
                  </Button>
                  
                  {currentStep < 6 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    >
                      Next →
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={form.handleSubmit(onSubmit)}
                      disabled={isSubmitting || !form.watch('consents.termsAccepted') || !form.watch('consents.privacyAccepted')}
                      loading={isSubmitting}
                      className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Summary Panel - Sticky */}
            <div className="col-span-12 lg:col-span-3">
              <SummaryPanel 
                watch={form.watch} 
                selectedJurisdiction={selectedJurisdiction} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyFormationWizard;
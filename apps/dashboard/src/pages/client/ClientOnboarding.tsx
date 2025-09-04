import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, ArrowRight, User, FileText, Shield, Calendar, Target, MessageSquare } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { supabase } from '@consulting19/supabase';
import { useAuth } from '@consulting19/shared';
import { useI18n } from '../../hooks/useI18n';
import ClientLayout from '../../components/layouts/ClientLayout';
import { Helmet } from 'react-helmet-async';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  completed: boolean;
  required: boolean;
}

interface OnboardingProgress {
  profile_id: string;
  profile_done: boolean;
  documents_done: boolean;
  agreements_done: boolean;
  kickoff_done: boolean;
  completed_at: string | null;
}

const ClientOnboarding = () => {
  const { user } = useAuth();
  const { t } = useI18n();
  const [progress, setProgress] = useState<OnboardingProgress>({
    profile_id: '',
    profile_done: false,
    documents_done: false,
    agreements_done: false,
    kickoff_done: false,
    completed_at: null,
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps: OnboardingStep[] = [
    {
      id: 'profile',
      title: 'Complete Your Profile',
      description: 'Add your personal and business information to help us serve you better.',
      icon: User,
      completed: progress.profile_done,
      required: true,
    },
    {
      id: 'documents',
      title: 'Upload Required Documents',
      description: 'Upload identity and business documents as requested by your consultant.',
      icon: FileText,
      completed: progress.documents_done,
      required: true,
    },
    {
      id: 'agreements',
      title: 'Review & Sign Agreements',
      description: 'Review and digitally sign service agreements and terms.',
      icon: Shield,
      completed: progress.agreements_done,
      required: true,
    },
    {
      id: 'kickoff',
      title: 'Schedule Kickoff Meeting',
      description: 'Schedule your first consultation with your assigned consultant.',
      icon: Calendar,
      completed: progress.kickoff_done,
      required: false,
    },
  ];

  useEffect(() => {
    if (user) {
      fetchOnboardingProgress();
    }
  }, [user]);

  const fetchOnboardingProgress = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Check if client_onboarding_progress table exists and get progress
      const { data, error } = await supabase
        .from('client_onboarding_progress')
        .select('*')
        .eq('profile_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching onboarding progress:', error);
      } else if (data) {
        setProgress(data);
        
        // Find current step
        const completedSteps = [
          data.profile_done,
          data.documents_done,
          data.agreements_done,
          data.kickoff_done,
        ];
        const nextIncompleteStep = completedSteps.findIndex(step => !step);
        setCurrentStep(nextIncompleteStep === -1 ? completedSteps.length : nextIncompleteStep);
      } else {
        // Create initial progress record
        const { data: newProgress, error: insertError } = await supabase
          .from('client_onboarding_progress')
          .insert({
            profile_id: user.id,
            profile_done: false,
            documents_done: false,
            agreements_done: false,
            kickoff_done: false,
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating onboarding progress:', insertError);
        } else if (newProgress) {
          setProgress(newProgress);
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStepProgress = async (stepId: string, completed: boolean) => {
    if (!user) return;

    try {
      setUpdating(true);
      
      const updateData: any = {
        [`${stepId}_done`]: completed,
      };

      // Check if all required steps are completed
      const updatedProgress = { ...progress, [`${stepId}_done`]: completed };
      const allRequiredCompleted = steps
        .filter(step => step.required)
        .every(step => updatedProgress[`${step.id}_done` as keyof OnboardingProgress]);

      if (allRequiredCompleted && !updatedProgress.completed_at) {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('client_onboarding_progress')
        .upsert({
          profile_id: user.id,
          ...progress,
          ...updateData,
        });

      if (error) {
        console.error('Error updating progress:', error);
      } else {
        setProgress(prev => ({ ...prev, ...updateData }));
        
        // Move to next step if completed
        if (completed && currentStep < steps.length - 1) {
          setCurrentStep(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setUpdating(false);
    }
  };

  const getStepAction = (step: OnboardingStep) => {
    switch (step.id) {
      case 'profile':
        return (
          <Button 
            size="sm" 
            onClick={() => window.location.href = '/client/settings'}
            disabled={step.completed}
          >
            {step.completed ? 'Completed' : 'Complete Profile'}
          </Button>
        );
      case 'documents':
        return (
          <Button 
            size="sm" 
            onClick={() => window.location.href = '/client/documents'}
            disabled={step.completed}
          >
            {step.completed ? 'Completed' : 'Upload Documents'}
          </Button>
        );
      case 'agreements':
        return (
          <Button 
            size="sm" 
            onClick={() => updateStepProgress('agreements', true)}
            disabled={step.completed || updating}
          >
            {step.completed ? 'Completed' : 'Review Agreements'}
          </Button>
        );
      case 'kickoff':
        return (
          <Button 
            size="sm" 
            onClick={() => updateStepProgress('kickoff', true)}
            disabled={step.completed || updating}
          >
            {step.completed ? 'Completed' : 'Schedule Meeting'}
          </Button>
        );
      default:
        return null;
    }
  };

  const completedSteps = steps.filter(step => step.completed).length;
  const totalSteps = steps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  if (loading) {
    return (
      <ClientLayout>
        <Helmet>
          <title>Onboarding - Consulting19</title>
        </Helmet>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <Helmet>
        <title>Onboarding - Consulting19</title>
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Consulting19!</h1>
        <p className="text-gray-600">Let's get you set up for success with our platform</p>
      </div>

      {/* Progress Overview */}
      <Card className="mb-8">
        <Card.Body>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Onboarding Progress</h2>
            <span className="text-sm text-gray-600">
              {completedSteps} of {totalSteps} steps completed
            </span>
          </div>
          
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
          
          {progress.completed_at ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-green-800 font-medium">
                  Onboarding completed! Welcome to Consulting19.
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">
              Complete these steps to get the most out of your Consulting19 experience.
            </p>
          )}
        </Card.Body>
      </Card>

      {/* Onboarding Steps */}
      <div className="space-y-6">
        {steps.map((step, index) => (
          <Card key={step.id} className={`transition-all duration-200 ${
            index === currentStep && !step.completed ? 'ring-2 ring-blue-500 bg-blue-50' : ''
          }`}>
            <Card.Body>
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  step.completed 
                    ? 'bg-green-100 text-green-600' 
                    : index === currentStep 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {step.completed ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <step.icon className="w-6 h-6" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {step.title}
                      {step.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {step.completed && (
                        <span className="text-sm text-green-600 font-medium">Completed</span>
                      )}
                      {getStepAction(step)}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{step.description}</p>
                  
                  {index === currentStep && !step.completed && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-blue-800 text-sm font-medium">
                        👆 This is your next step. Click the button above to continue.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Next Steps */}
      {progress.completed_at && (
        <Card className="mt-8 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
          <Card.Body className="text-center">
            <h2 className="text-2xl font-bold mb-4">🎉 You're All Set!</h2>
            <p className="text-blue-100 mb-6">
              Your onboarding is complete. Here's what you can do next:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="secondary" 
                size="lg" 
                icon={Target}
                onClick={() => window.location.href = '/client/projects'}
              >
                View Projects
              </Button>
              <Button 
                variant="secondary" 
                size="lg" 
                icon={MessageSquare}
                onClick={() => window.location.href = '/client/messages'}
              >
                Message Consultant
              </Button>
              <Button 
                variant="secondary" 
                size="lg" 
                icon={FileText}
                onClick={() => window.location.href = '/client/services'}
              >
                Browse Services
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}
    </ClientLayout>
  );
};

export default ClientOnboarding;
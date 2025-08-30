import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, User, FileText, FileCheck, Calendar, ArrowRight } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { supabase } from '@consulting19/supabase';
import { useAuth } from '@consulting19/shared';
import { useI18n } from '../../hooks/useI18n';
import ClientLayout from '../../components/layouts/ClientLayout';
import { Helmet } from 'react-helmet-async';

interface OnboardingProgress {
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
    profile_done: false,
    documents_done: false,
    agreements_done: false,
    kickoff_done: false,
    completed_at: null,
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchProgress();
    }
  }, [user]);

  const fetchProgress = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('client_onboarding_progress')
        .select('*')
        .eq('profile_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching onboarding progress:', error);
      } else if (data) {
        setProgress(data);
      } else {
        // Create initial progress record
        const { data: newProgress } = await supabase
          .from('client_onboarding_progress')
          .insert({
            profile_id: user.id,
            profile_done: false,
            documents_done: false,
            agreements_done: false,
            kickoff_done: false
          })
          .select()
          .single();

        if (newProgress) {
          setProgress(newProgress);
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStep = async (step: keyof OnboardingProgress, completed: boolean) => {
    if (!user) return;

    setUpdating(step);
    try {
      const updates: any = { [step]: completed };
      
      // Check if all steps will be completed
      const newProgress = { ...progress, [step]: completed };
      const allStepsComplete = newProgress.profile_done && 
                              newProgress.documents_done && 
                              newProgress.agreements_done && 
                              newProgress.kickoff_done;
      
      if (allStepsComplete && !progress.completed_at) {
        updates.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('client_onboarding_progress')
        .update(updates)
        .eq('profile_id', user.id);

      if (error) {
        console.error('Error updating progress:', error);
      } else {
        setProgress(prev => ({ ...prev, ...updates }));
        
        // Notify consultant if onboarding is completed
        if (allStepsComplete && !progress.completed_at) {
          // Get client record to find assigned consultant
          const { data: clientData } = await supabase
            .from('clients')
            .select('assigned_consultant_id')
            .eq('profile_id', user.id)
            .single();

          if (clientData?.assigned_consultant_id) {
            await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/notify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              },
              body: JSON.stringify({
                recipient_id: clientData.assigned_consultant_id,
                type: 'onboarding_completed',
                payload: {
                  client_name: user.user_metadata?.full_name
                },
                email_notification: true
              }),
            });
          }
        }
      }
    } catch (error) {
      console.error('Error updating step:', error);
    } finally {
      setUpdating(null);
    }
  };

  const steps = [
    {
      key: 'profile_done' as keyof OnboardingProgress,
      icon: User,
      title: t('onboarding.steps.profile.title'),
      description: t('onboarding.steps.profile.description'),
      action: 'Complete Profile',
      link: '/client/settings'
    },
    {
      key: 'documents_done' as keyof OnboardingProgress,
      icon: FileText,
      title: t('onboarding.steps.documents.title'),
      description: t('onboarding.steps.documents.description'),
      action: 'Upload Documents',
      link: '/client/documents'
    },
    {
      key: 'agreements_done' as keyof OnboardingProgress,
      icon: FileCheck,
      title: t('onboarding.steps.agreements.title'),
      description: t('onboarding.steps.agreements.description'),
      action: 'Review Agreements',
      link: '#'
    },
    {
      key: 'kickoff_done' as keyof OnboardingProgress,
      icon: Calendar,
      title: t('onboarding.steps.kickoff.title'),
      description: t('onboarding.steps.kickoff.description'),
      action: 'Schedule Meeting',
      link: '#'
    }
  ];

  const completedSteps = steps.filter(step => progress[step.key]).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  if (loading) {
    return (
      <ClientLayout>
        <Helmet>
          <title>{t('onboarding.title')} - Consulting19</title>
        </Helmet>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <Helmet>
        <title>{t('onboarding.title')} - Consulting19</title>
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('onboarding.title')}</h1>
        <p className="text-gray-600">{t('onboarding.subtitle')}</p>
      </div>

      {/* Progress Overview */}
      <Card className="mb-8">
        <Card.Body>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">{t('onboarding.progress')}</h2>
            <span className="text-lg font-bold text-blue-600">
              {completedSteps}/{steps.length} {t('onboarding.completed')}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          
          {progress.completed_at && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-green-800 font-medium">
                  {t('onboarding.congratulations')} {t('onboarding.allStepsComplete')}
                </span>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Onboarding Steps */}
      <div className="space-y-6">
        {steps.map((step, index) => {
          const isCompleted = progress[step.key];
          const isUpdating = updating === step.key;
          
          return (
            <Card key={step.key} className={isCompleted ? 'border-green-200 bg-green-50' : ''}>
              <Card.Body>
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    isCompleted 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {step.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isCompleted 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {isCompleted ? t('onboarding.completed') : t('onboarding.pending')}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">
                      {step.description}
                    </p>
                    
                    <div className="flex space-x-3">
                      {step.link !== '#' && (
                        <a href={step.link}>
                          <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
                            {step.action}
                          </Button>
                        </a>
                      )}
                      
                      <Button
                        variant={isCompleted ? 'outline' : 'primary'}
                        size="sm"
                        loading={isUpdating}
                        onClick={() => updateStep(step.key, !isCompleted)}
                        icon={isCompleted ? Circle : CheckCircle}
                      >
                        {isCompleted ? 'Mark as Incomplete' : t('onboarding.completeStep')}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          );
        })}
      </div>
    </ClientLayout>
  );
};

export default ClientOnboarding;
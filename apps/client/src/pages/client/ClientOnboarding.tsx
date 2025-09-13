import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { supabase } from '@consulting19/shared/src/lib/supabase';
import { CheckCircle, User, Target, MessageSquare, FileText, Calendar, Clock, ArrowRight, Star } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  action?: () => void;
  href?: string;
}

interface OnboardingProgress {
  completedSteps: string[];
  currentStep: number;
  overallProgress: number;
  consultant_assigned: boolean;
  profile_complete: boolean;
  first_message_sent: boolean;
  first_document_uploaded: boolean;
  first_meeting_scheduled: boolean;
}

const ClientOnboarding = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState<OnboardingProgress>({
    completedSteps: [],
    currentStep: 0,
    overallProgress: 0,
    consultant_assigned: false,
    profile_complete: false,
    first_message_sent: false,
    first_document_uploaded: false,
    first_meeting_scheduled: false
  });
  const [loading, setLoading] = useState(true);
  const [consultant, setConsultant] = useState<any>(null);

  useEffect(() => {
    if (user && profile) {
      checkOnboardingProgress();
    }
  }, [user, profile]);

  const checkOnboardingProgress = async () => {
    try {
      setLoading(true);
      
      const { data: clientData } = await supabase
        .from('clients')
        .select(`
          id, 
          assigned_consultant_id,
          consultant:user_profiles!clients_assigned_consultant_id_fkey(
            full_name, email
          )
        `)
        .eq('profile_id', user?.id)
        .maybeSingle();

      if (clientData?.consultant) {
        setConsultant(clientData.consultant);
      }

      const progressData = {
        completedSteps: ['account_created'],
        currentStep: 1,
        overallProgress: 25,
        consultant_assigned: !!clientData?.assigned_consultant_id,
        profile_complete: !!(profile?.full_name && profile?.phone),
        first_message_sent: false,
        first_document_uploaded: false,
        first_meeting_scheduled: false
      };

      if (clientData) {
        const [{ count: messagesCount }, { count: documentsCount }, { count: meetingsCount }] = await Promise.all([
          supabase.from('messages').select('*', { count: 'exact', head: true }).eq('sender_id', user?.id),
          supabase.from('documents').select('*', { count: 'exact', head: true }).eq('client_id', clientData.id),
          supabase.from('meetings').select('*', { count: 'exact', head: true }).eq('client_id', clientData.id)
        ]);

        progressData.first_message_sent = (messagesCount || 0) > 0;
        progressData.first_document_uploaded = (documentsCount || 0) > 0;
        progressData.first_meeting_scheduled = (meetingsCount || 0) > 0;
      }

      // Calculate overall progress
      const completedCount = [
        true, // account created
        progressData.consultant_assigned,
        progressData.profile_complete,
        progressData.first_message_sent,
        progressData.first_document_uploaded
      ].filter(Boolean).length;

      progressData.overallProgress = (completedCount / 5) * 100;
      progressData.currentStep = completedCount;

      setProgress(progressData);

      // Auto-redirect if onboarding is complete
      if (progressData.overallProgress >= 80) {
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }

    } catch (err) {
      console.error('Onboarding progress check error:', err);
    } finally {
      setLoading(false);
    }
  };

  const onboardingSteps: OnboardingStep[] = [
    {
      id: 'account_created',
      title: 'Account Created',
      description: 'Welcome to Consulting19!',
      completed: true
    },
    {
      id: 'consultant_assigned',
      title: 'Consultant Assigned',
      description: 'You\'ve been matched with an expert advisor',
      completed: progress.consultant_assigned
    },
    {
      id: 'profile_complete',
      title: 'Complete Your Profile',
      description: 'Add your business information',
      completed: progress.profile_complete,
      href: '/settings'
    },
    {
      id: 'first_message',
      title: 'Send First Message',
      description: 'Connect with your consultant',
      completed: progress.first_message_sent,
      href: '/messages'
    },
    {
      id: 'upload_document',
      title: 'Upload Documents',
      description: 'Share your business documents',
      completed: progress.first_document_uploaded,
      href: '/file-manager'
    }
  ];

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Getting Started - Client Portal</title>
        </Helmet>
        
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <User className="w-8 h-8 text-white" />
            </div>
            <p className="text-gray-600">Loading your onboarding progress...</p>
          </div>
        </div>
      </>
    );
  }

  // Show completion screen
  if (progress.overallProgress >= 80) {
    return (
      <>
        <Helmet>
          <title>Welcome Complete - Client Portal</title>
        </Helmet>
        
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
          <div className="max-w-2xl mx-auto text-center px-6">
            <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🎉 Congratulations!
            </h1>
            
            <p className="text-xl text-gray-600 mb-6">
              You've successfully completed the onboarding process!
              Welcome to the Consulting19 family. Your expert consultant{' '}
              <span className="font-semibold text-blue-600">
                {consultant?.full_name || 'Giorgi Meskhi'}
              </span>{' '}
              is ready to guide your international business expansion journey.
            </p>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-8 h-8 text-yellow-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">4</div>
                <div className="text-sm text-gray-600">Steps Completed</div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">100%</div>
                <div className="text-sm text-gray-600">Setup Complete</div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-8 h-8 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">Ready!</div>
                <div className="text-sm text-gray-600">For Business</div>
              </div>
            </div>

            <div className="flex items-center justify-center text-gray-600 mb-8">
              <Clock className="w-5 h-5 mr-2" />
              <span>Redirecting to your dashboard in 3 seconds...</span>
            </div>
            
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
            >
              <Target className="w-5 h-5 mr-2" />
              Go to Dashboard
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Getting Started - Client Portal</title>
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Consulting19!
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Let's get you set up for success with our platform
            </p>
            
            {/* Progress Bar */}
            <div className="max-w-md mx-auto">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Progress</span>
                <span className="text-sm font-medium text-gray-600">{progress.overallProgress.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-700"
                  style={{ width: `${progress.overallProgress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Onboarding Steps */}
          <div className="space-y-4">
            {onboardingSteps.map((step, index) => (
              <div key={step.id} className={`bg-white rounded-lg shadow-sm border-2 p-6 transition-all ${
                step.completed 
                  ? 'border-green-500 bg-green-50' 
                  : index === progress.currentStep 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      step.completed 
                        ? 'bg-green-500 text-white' 
                        : index === progress.currentStep
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                    }`}>
                      {step.completed ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <span className="font-bold">{index + 1}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                  
                  <div>
                    {step.completed ? (
                      <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        Completed
                      </span>
                    ) : step.href ? (
                      <button
                        onClick={() => navigate(step.href!)}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Start
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    ) : (
                      <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                        Waiting...
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Consultant Info */}
          {consultant && (
            <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Assigned Consultant</h3>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{consultant.full_name}</h4>
                  <p className="text-sm text-gray-600">{consultant.email}</p>
                  <p className="text-xs text-gray-500">International Business Expert</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ClientOnboarding;
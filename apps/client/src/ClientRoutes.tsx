import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  CheckCircle, 
  Clock, 
  ArrowRight,
  ArrowLeft,
  User,
  Building,
  Phone,
  Mail,
  Globe,
  MapPin,
  Target,
  MessageSquare,
  Calendar,
  FileText,
  DollarSign,
  Star,
  Zap,
  Crown,
  Gift,
  Sparkles,
  Trophy,
  Medal
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
  action: string;
  href?: string;
  icon: any;
  color: string;
  estimatedTime: string;
}

interface ProfileData {
  full_name: string;
  display_name: string;
  phone: string;
  company: string;
  preferred_language: string;
  timezone: string;
}

interface OnboardingProgress {
  completedSteps: string[];
  currentStep: number;
  overallProgress: number;
  lastActivity: string;
  consultant_assigned: boolean;
  profile_complete: boolean;
  first_message_sent: boolean;
  first_document_uploaded: boolean;
  first_meeting_scheduled: boolean;
  welcome_call_completed: boolean;
}

const ClientOnboarding = () => {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [onboardingProgress, setOnboardingProgress] = useState<OnboardingProgress>({
    completedSteps: [],
    currentStep: 0,
    overallProgress: 0,
    lastActivity: '',
    consultant_assigned: false,
    profile_complete: false,
    first_message_sent: false,
    first_document_uploaded: false,
    first_meeting_scheduled: false,
    welcome_call_completed: false
  });
  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: '',
    display_name: '',
    phone: '',
    company: '',
    preferred_language: 'en',
    timezone: 'UTC'
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [consultant, setConsultant] = useState<any>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
  ];

  const timezones = [
    'UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 
    'Europe/Berlin', 'Europe/Istanbul', 'Asia/Dubai', 'Asia/Singapore',
    'Asia/Tokyo', 'Australia/Sydney'
  ];

  useEffect(() => {
    if (user && profile) {
      initializeOnboarding();
    }
  }, [user, profile]);

  const initializeOnboarding = async () => {
    try {
      setLoading(true);
      
      // Initialize profile data
      if (profile) {
        setProfileData({
          full_name: profile.full_name || '',
          display_name: profile.display_name || '',
          phone: profile.phone || '',
          company: profile.company || '',
          preferred_language: profile.preferred_language || 'en',
          timezone: profile.timezone || 'UTC'
        });
      }

      await Promise.all([
        checkOnboardingProgress(),
        fetchConsultantInfo()
      ]);
      
    } catch (err) {
      console.error('Error initializing onboarding:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkOnboardingProgress = async () => {
    try {
      // Get client data
      const { data: clientData } = await supabase
        .from('clients')
        .select('id, assigned_consultant_id, status')
        .eq('profile_id', user?.id)
        .maybeSingle();

      const progress: OnboardingProgress = {
        completedSteps: [],
        currentStep: 0,
        overallProgress: 0,
        lastActivity: '',
        consultant_assigned: !!clientData?.assigned_consultant_id,
        profile_complete: !!(profile?.full_name && profile?.phone),
        first_message_sent: false,
        first_document_uploaded: false,
        first_meeting_scheduled: false,
        welcome_call_completed: false
      };

      if (clientData) {
        // Check for messages sent
        const { count: messagesCount } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('sender_id', user?.id);

        // Check for documents uploaded  
        const { count: documentsCount } = await supabase
          .from('documents')
          .select('*', { count: 'exact', head: true })
          .eq('client_id', clientData.id);

        // Check for meetings scheduled
        const { count: meetingsCount } = await supabase
          .from('meetings')
          .select('*', { count: 'exact', head: true })
          .eq('client_id', clientData.id);

        progress.first_message_sent = (messagesCount || 0) > 0;
        progress.first_document_uploaded = (documentsCount || 0) > 0;
        progress.first_meeting_scheduled = (meetingsCount || 0) > 0;
      }

      // Calculate completed steps
      const stepCompletions = [
        progress.profile_complete,
        progress.consultant_assigned,
        progress.first_message_sent,
        progress.first_document_uploaded,
        progress.first_meeting_scheduled,
        progress.welcome_call_completed
      ];

      progress.completedSteps = stepCompletions.map((completed, index) => 
        completed ? `step-${index + 1}` : ''
      ).filter(Boolean);

      progress.currentStep = stepCompletions.findIndex(step => !step);
      if (progress.currentStep === -1) progress.currentStep = stepCompletions.length; // All completed

      progress.overallProgress = (progress.completedSteps.length / stepCompletions.length) * 100;

      setOnboardingProgress(progress);
      setCurrentStepIndex(Math.max(0, progress.currentStep));

    } catch (err) {
      console.error('Error checking onboarding progress:', err);
    }
  };

  const fetchConsultantInfo = async () => {
    try {
      const { data: clientData } = await supabase
        .from('clients')
        .select(`
          assigned_consultant_id,
          consultant:user_profiles!clients_assigned_consultant_id_fkey(
            id, full_name, email, timezone, preferred_language
          )
        `)
        .eq('profile_id', user?.id)
        .maybeSingle();

      if (clientData?.consultant) {
        setConsultant({
          ...clientData.consultant,
          is_online: Math.random() > 0.5 // Mock online status
        });
      }
    } catch (err) {
      console.error('Error fetching consultant:', err);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      setUpdating(true);

      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: profileData.full_name,
          display_name: profileData.display_name,
          phone: profileData.phone,
          company: profileData.company,
          preferred_language: profileData.preferred_language,
          timezone: profileData.timezone,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (error) {
        throw error;
      }

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'profile_updated',
          description: 'Completed profile setup during onboarding',
          payload: { onboarding_step: 'profile_completion' }
        });

      await refreshProfile();
      await checkOnboardingProgress();
      
      alert('Profile updated successfully!');
      nextStep();
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const markStepCompleted = async (stepId: string) => {
    try {
      // Create audit log for step completion
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'other',
          description: `Completed onboarding step: ${stepId}`,
          payload: { step_id: stepId }
        });

      checkOnboardingProgress();
    } catch (err) {
      console.error('Error marking step completed:', err);
    }
  };

  const completeOnboarding = async () => {
    try {
      // Mark onboarding as complete
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'other',
          description: 'Client onboarding process completed successfully',
          payload: { 
            completion_date: new Date().toISOString(),
            total_steps: onboardingSteps.length,
            consultant_id: consultant?.id
          }
        });

      setShowCelebration(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      console.error('Error completing onboarding:', err);
    }
  };

  const nextStep = () => {
    setCurrentStepIndex(prev => Math.min(prev + 1, onboardingSteps.length - 1));
  };

  const prevStep = () => {
    setCurrentStepIndex(prev => Math.max(prev - 1, 0));
  };

  const onboardingSteps: OnboardingStep[] = [
    {
      id: 'profile-setup',
      title: 'Complete Your Profile',
      description: 'Add your personal and business information to help us serve you better',
      completed: onboardingProgress.profile_complete,
      required: true,
      action: 'Complete Profile',
      icon: User,
      color: 'blue',
      estimatedTime: '2 minutes'
    },
    {
      id: 'consultant-assignment',
      title: 'Meet Your Consultant',
      description: 'Get assigned to an expert consultant who will guide your business expansion',
      completed: onboardingProgress.consultant_assigned,
      required: true,
      action: onboardingProgress.consultant_assigned ? 'View Consultant' : 'Wait for Assignment',
      href: consultant ? '/messages' : undefined,
      icon: Target,
      color: 'green',
      estimatedTime: '24 hours'
    },
    {
      id: 'first-contact',
      title: 'First Contact',
      description: 'Send your first message to your consultant and introduce yourself',
      completed: onboardingProgress.first_message_sent,
      required: true,
      action: 'Send Message',
      href: '/messages',
      icon: MessageSquare,
      color: 'purple',
      estimatedTime: '5 minutes'
    },
    {
      id: 'document-upload',
      title: 'Upload Initial Documents',
      description: 'Upload any relevant business documents or accounting records',
      completed: onboardingProgress.first_document_uploaded,
      required: false,
      action: 'Upload Documents',
      href: '/file-manager',
      icon: FileText,
      color: 'orange',
      estimatedTime: '10 minutes'
    },
    {
      id: 'schedule-meeting',
      title: 'Schedule Consultation',
      description: 'Book your first consultation meeting with your expert consultant',
      completed: onboardingProgress.first_meeting_scheduled,
      required: false,
      action: 'Schedule Meeting',
      href: '/meetings',
      icon: Calendar,
      color: 'indigo',
      estimatedTime: '3 minutes'
    },
    {
      id: 'welcome-call',
      title: 'Welcome Call Complete',
      description: 'Complete your welcome call and discuss your business expansion goals',
      completed: onboardingProgress.welcome_call_completed,
      required: false,
      action: 'Mark as Complete',
      icon: CheckCircle,
      color: 'green',
      estimatedTime: '30 minutes'
    }
  ];

  const currentStep = onboardingSteps[currentStepIndex];
  const completedStepsCount = onboardingSteps.filter(step => step.completed).length;
  const totalRequiredSteps = onboardingSteps.filter(step => step.required).length;
  const isOnboardingComplete = completedStepsCount === onboardingSteps.length;

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Getting Started - Client Portal</title>
        </Helmet>
        
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse shadow-xl">
              <span className="text-white font-bold text-xl">C19</span>
            </div>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-700 font-medium">Preparing your onboarding...</p>
          </div>
        </div>
      </>
    );
  }

  // Celebration screen for completed onboarding
  if (showCelebration) {
    return (
      <>
        <Helmet>
          <title>Welcome to Consulting19! - Client Portal</title>
        </Helmet>
        
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-300/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-300/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-20 text-4xl animate-bounce">🎉</div>
            <div className="absolute top-32 right-32 text-3xl animate-bounce delay-500">✨</div>
            <div className="absolute bottom-32 left-32 text-3xl animate-bounce delay-1000">🚀</div>
            <div className="absolute bottom-20 right-20 text-4xl animate-bounce delay-1500">🏆</div>
          </div>

          <div className="relative z-10 text-center max-w-2xl mx-auto px-8">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 via-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl animate-pulse">
              <Crown className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              🎊 Congratulations!
            </h1>
            
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              You've successfully completed the onboarding process! Welcome to the Consulting19 family. 
              Your expert consultant <strong>{consultant?.full_name}</strong> is ready to guide your international business expansion journey.
            </p>
            
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg">
                <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">{completedStepsCount}</div>
                <div className="text-sm text-gray-600">Steps Completed</div>
              </div>
              
              <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg">
                <Star className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">100%</div>
                <div className="text-sm text-gray-600">Setup Complete</div>
              </div>
              
              <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg">
                <Sparkles className="w-12 h-12 text-purple-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">Ready!</div>
                <div className="text-sm text-gray-600">For Business</div>
              </div>
            </div>

            <p className="text-gray-600 mb-6">
              🚀 Redirecting to your dashboard in 3 seconds...
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Welcome to Consulting19! - Get Started</title>
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse">
              <span className="text-white font-bold text-2xl">C19</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
              Welcome to Consulting19!
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Let's get you set up for success with our AI-powered international business expansion platform. 
              This quick setup will connect you with expert consultants and unlock all platform features.
            </p>
          </div>

          {/* Progress Overview */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Onboarding Progress</h2>
                <p className="text-gray-600">Complete these steps to unlock the full platform experience</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">{onboardingProgress.overallProgress.toFixed(0)}%</div>
                <div className="text-sm text-gray-600">Complete</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 h-4 rounded-full transition-all duration-1000 relative"
                  style={{ width: `${onboardingProgress.overallProgress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 animate-pulse opacity-50"></div>
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>Getting Started</span>
                <span>{completedStepsCount} / {onboardingSteps.length} steps</span>
                <span>Ready to Launch!</span>
              </div>
            </div>

            {/* Steps Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {onboardingSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`relative p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer group ${
                    step.completed
                      ? 'border-green-300 bg-green-50 shadow-lg'
                      : index === currentStepIndex
                      ? `border-${step.color}-400 bg-${step.color}-50 shadow-lg scale-105`
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  }`}
                  onClick={() => setCurrentStepIndex(index)}
                >
                  {/* Step Number/Status */}
                  <div className="absolute -top-3 -right-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
                      step.completed 
                        ? 'bg-green-500 text-white' 
                        : index === currentStepIndex
                        ? `bg-${step.color}-500 text-white`
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {step.completed ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <span className="text-xs font-bold">{index + 1}</span>
                      )}
                    </div>
                  </div>

                  <div className={`w-12 h-12 bg-${step.color}-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <step.icon className={`w-6 h-6 text-${step.color}-600`} />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      step.completed ? 'bg-green-100 text-green-800' :
                      index === currentStepIndex ? `bg-${step.color}-100 text-${step.color}-800` :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {step.completed ? 'Completed' : step.required ? 'Required' : 'Optional'}
                    </span>
                    <span className="text-xs text-gray-500">{step.estimatedTime}</span>
                  </div>

                  {/* Active Step Indicator */}
                  {index === currentStepIndex && !step.completed && (
                    <div className="absolute inset-0 border-2 border-blue-400 rounded-xl animate-pulse"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Current Step Detail */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className={`bg-gradient-to-r from-${currentStep.color}-500 to-${currentStep.color}-600 text-white p-8`}>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <currentStep.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium opacity-90">Step {currentStepIndex + 1} of {onboardingSteps.length}</div>
                  <h2 className="text-3xl font-bold">{currentStep.title}</h2>
                  <p className="text-lg opacity-90 mt-1">{currentStep.description}</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              {/* Profile Setup Step */}
              {currentStep.id === 'profile-setup' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Complete Your Profile Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={profileData.full_name}
                          onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Display Name
                        </label>
                        <input
                          type="text"
                          value={profileData.display_name}
                          onChange={(e) => setProfileData(prev => ({ ...prev, display_name: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="How you'd like to be addressed"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={profileData.company}
                          onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Your company name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Preferred Language
                        </label>
                        <select
                          value={profileData.preferred_language}
                          onChange={(e) => setProfileData(prev => ({ ...prev, preferred_language: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {languages.map((lang) => (
                            <option key={lang.code} value={lang.code}>
                              {lang.flag} {lang.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Timezone
                        </label>
                        <select
                          value={profileData.timezone}
                          onChange={(e) => setProfileData(prev => ({ ...prev, timezone: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {timezones.map((tz) => (
                            <option key={tz} value={tz}>{tz}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <button
                        onClick={handleProfileUpdate}
                        disabled={updating || !profileData.full_name.trim() || !profileData.phone.trim()}
                        className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 shadow-lg"
                      >
                        {updating ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                            Saving Profile...
                          </>
                        ) : (
                          <>
                            <User className="w-5 h-5 mr-3" />
                            Complete Profile Setup
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Consultant Assignment Step */}
              {currentStep.id === 'consultant-assignment' && (
                <div className="space-y-6">
                  {onboardingProgress.consultant_assigned ? (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">🎉 Consultant Assigned!</h3>
                      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 max-w-md mx-auto">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="text-left">
                            <h4 className="font-semibold text-green-900">{consultant?.full_name}</h4>
                            <p className="text-sm text-green-700">{consultant?.email}</p>
                            <div className="flex items-center space-x-1 text-xs text-green-600">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span>Your Expert Consultant</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          markStepCompleted('consultant-assigned');
                          nextStep();
                        }}
                        className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors mt-6"
                      >
                        Continue to Next Step
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
                        <Clock className="w-8 h-8 text-yellow-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Consultant Assignment in Progress</h3>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 max-w-md mx-auto">
                        <p className="text-yellow-800 mb-4">
                          Our system is matching you with the perfect consultant based on your location, 
                          business needs, and preferred language. This usually takes up to 24 hours.
                        </p>
                        <div className="space-y-2 text-sm text-yellow-700">
                          <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            <span>Profile analyzed</span>
                          </div>
                          <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            <span>Expert consultant searching</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 text-yellow-500 mr-2" />
                            <span>Assignment notification pending</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mt-6">
                        You'll receive an email notification as soon as your consultant is assigned
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Other Steps */}
              {!['profile-setup', 'consultant-assignment'].includes(currentStep.id) && (
                <div className="space-y-6">
                  {currentStep.completed ? (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-green-900 mb-4">✅ Step Completed!</h3>
                      <p className="text-green-700 mb-6">{currentStep.description}</p>
                      <button
                        onClick={nextStep}
                        disabled={currentStepIndex >= onboardingSteps.length - 1}
                        className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                      >
                        Continue to Next Step
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className={`w-16 h-16 bg-${currentStep.color}-100 rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                        <currentStep.icon className={`w-8 h-8 text-${currentStep.color}-600`} />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{currentStep.title}</h3>
                      <p className="text-gray-600 mb-8 max-w-md mx-auto">{currentStep.description}</p>
                      
                      {currentStep.href ? (
                        <a
                          href={currentStep.href}
                          className={`inline-flex items-center px-8 py-4 bg-${currentStep.color}-600 text-white rounded-xl hover:bg-${currentStep.color}-700 transition-all duration-200 transform hover:scale-105 shadow-lg`}
                        >
                          <currentStep.icon className="w-5 h-5 mr-3" />
                          {currentStep.action}
                          <ArrowRight className="w-4 h-4 ml-3" />
                        </a>
                      ) : currentStep.id === 'welcome-call' ? (
                        <button
                          onClick={() => {
                            markStepCompleted('welcome-call');
                            if (currentStepIndex === onboardingSteps.length - 1) {
                              completeOnboarding();
                            } else {
                              nextStep();
                            }
                          }}
                          className={`inline-flex items-center px-8 py-4 bg-${currentStep.color}-600 text-white rounded-xl hover:bg-${currentStep.color}-700 transition-all duration-200 transform hover:scale-105 shadow-lg`}
                        >
                          <CheckCircle className="w-5 h-5 mr-3" />
                          {currentStep.action}
                        </button>
                      ) : (
                        <div className="text-gray-500">
                          <Clock className="w-8 h-8 mx-auto mb-2" />
                          <p>Waiting for prerequisite steps to complete</p>
                        </div>
                      )}
                      
                      {currentStep.required && !currentStep.completed && (
                        <p className="text-sm text-red-600 mt-4">* This step is required to continue</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <button
                  onClick={prevStep}
                  disabled={currentStepIndex === 0}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous Step
                </button>
                
                <div className="flex items-center space-x-2">
                  {onboardingSteps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentStepIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        index === currentStepIndex
                          ? 'bg-blue-600 scale-125'
                          : onboardingSteps[index].completed
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                
                <button
                  onClick={() => {
                    if (currentStepIndex === onboardingSteps.length - 1) {
                      completeOnboarding();
                    } else {
                      nextStep();
                    }
                  }}
                  disabled={currentStepIndex >= onboardingSteps.length - 1}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {currentStepIndex === onboardingSteps.length - 1 ? 'Complete Setup' : 'Next Step'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Quick Tips for Success</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Star className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Complete Your Profile</h4>
                    <p className="text-sm text-gray-600">
                      A complete profile helps us assign the best consultant for your needs
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MessageSquare className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Communicate Openly</h4>
                    <p className="text-sm text-gray-600">
                      Share your business goals and challenges to get personalized guidance
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <FileText className="w-5 h-5 text-purple-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Organize Documents</h4>
                    <p className="text-sm text-gray-600">
                      Upload documents early to speed up your business formation process
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Schedule Regularly</h4>
                    <p className="text-sm text-gray-600">
                      Regular check-ins with your consultant ensure smooth progress
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Globe className="w-5 h-5 text-teal-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Think Global</h4>
                    <p className="text-sm text-gray-600">
                      Consider multiple jurisdictions to optimize your international structure
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <DollarSign className="w-5 h-5 text-orange-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Plan Your Budget</h4>
                    <p className="text-sm text-gray-600">
                      Discuss budget expectations early for better service planning
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Support */}
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">Need help during onboarding?</p>
            <div className="flex justify-center space-x-4">
              <a
                href="/support"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact Support
              </a>
              <a
                href="mailto:onboarding@consulting19.com"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email Help
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientOnboarding;
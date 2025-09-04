import { useState, useEffect, useCallback } from 'react';
import { FormationApplicationData } from '../schemas/formationApplicationSchema';

interface WizardState {
  formData: Partial<FormationApplicationData>;
  currentStep: number;
  selectedJurisdiction: any;
}

const WIZARD_STORAGE_KEY = 'company-formation-wizard';
const DEFAULT_STATE: WizardState = {
  formData: {
    proposedNames: ['', '', ''],
    addons: [],
    contact: {
      fullName: '',
      email: '',
      phone: '',
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
        country: '',
      },
    },
    consents: {
      termsAccepted: false,
      privacyAccepted: false,
    },
  },
  currentStep: 1,
  selectedJurisdiction: null,
};

export function useWizardState() {
  const [state, setState] = useState<WizardState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(WIZARD_STORAGE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        setState(parsedState);
      }
    } catch (error) {
      console.error('Failed to load wizard state from localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(WIZARD_STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save wizard state to localStorage:', error);
      }
    }
  }, [state, isLoaded]);

  const updateFormData = useCallback((updates: Partial<FormationApplicationData>) => {
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, ...updates },
    }));
  }, []);

  const setCurrentStep = useCallback((step: number) => {
    setState(prev => ({ ...prev, currentStep: step }));
  }, []);

  const setSelectedJurisdiction = useCallback((jurisdiction: any) => {
    setState(prev => ({ ...prev, selectedJurisdiction: jurisdiction }));
  }, []);

  const resetWizard = useCallback(() => {
    setState(DEFAULT_STATE);
    localStorage.removeItem(WIZARD_STORAGE_KEY);
  }, []);

  const clearStorage = useCallback(() => {
    localStorage.removeItem(WIZARD_STORAGE_KEY);
  }, []);

  return {
    formData: state.formData,
    currentStep: state.currentStep,
    selectedJurisdiction: state.selectedJurisdiction,
    isLoaded,
    updateFormData,
    setCurrentStep,
    setSelectedJurisdiction,
    resetWizard,
    clearStorage,
  };
}
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { Country } from '../types';

interface SupabaseContextType {
  countries: Country[];
  loading: boolean;
  getCountries: () => Promise<Country[]>;
  getCountryBySlug: (slug: string) => Promise<Country | null>;
  refreshCountries: () => Promise<void>;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

interface SupabaseProviderProps {
  children: ReactNode;
}

export const SupabaseProvider: React.FC<SupabaseProviderProps> = ({ children }) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  // Load countries on component mount
  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .eq('status', true)
        .order('name');
      
      if (error) {
        console.error('Error loading countries:', error);
        // Fallback to mock data if database fails
        setCountries(getMockCountries());
      } else {
        setCountries(data || []);
      }
    } catch (error) {
      console.error('Error loading countries:', error);
      // Fallback to mock data
      setCountries(getMockCountries());
    } finally {
      setLoading(false);
    }
  };

  const getCountries = async (): Promise<Country[]> => {
    try {
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .eq('status', true)
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching countries:', error);
      return getMockCountries();
    }
  };

  const getCountryBySlug = async (slug: string): Promise<Country | null> => {
    try {
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .eq('slug', slug)
        .eq('status', true)
        .single();
      
      if (error) {
        // Fallback to mock data
        const mockCountries = getMockCountries();
        return mockCountries.find(c => c.slug === slug) || null;
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching country:', error);
      const mockCountries = getMockCountries();
      return mockCountries.find(c => c.slug === slug) || null;
    }
  };

  const refreshCountries = async () => {
    await loadCountries();
  };

  // Mock data fallback
  const getMockCountries = (): Country[] => [
    {
      id: 1,
      name: 'Georgia',
      slug: 'georgia',
      flag_emoji: '🇬🇪',
      description: 'Strategic location between Europe and Asia with favorable tax system',
      advantages: ['0% tax on foreign-sourced income', 'Strategic location', 'Simple company formation'],
      primary_language: 'en',
      supported_languages: ['en', 'tr'],
      auto_language_detection: true,
      legacy_form_integration: true,
      consultant_auto_assignment: true,
      status: true,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      name: 'United States',
      slug: 'usa',
      flag_emoji: '🇺🇸',
      description: 'Access to the world\'s largest economy',
      advantages: ['Global market access', 'Delaware business laws', 'Advanced financial systems'],
      primary_language: 'en',
      supported_languages: ['en', 'tr'],
      auto_language_detection: true,
      legacy_form_integration: true,
      consultant_auto_assignment: true,
      status: true,
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      name: 'Montenegro',
      slug: 'montenegro',
      flag_emoji: '🇲🇪',
      description: 'EU candidate country with investment opportunities',
      advantages: ['EU candidate status', 'Investment programs', 'Adriatic location'],
      primary_language: 'en',
      supported_languages: ['en', 'tr'],
      auto_language_detection: true,
      legacy_form_integration: true,
      consultant_auto_assignment: true,
      status: true,
      created_at: new Date().toISOString()
    },
    {
      id: 4,
      name: 'Estonia',
      slug: 'estonia',
      flag_emoji: '🇪🇪',
      description: 'Digital-first approach with e-Residency program',
      advantages: ['e-Residency program', 'Digital government', 'EU membership'],
      primary_language: 'en',
      supported_languages: ['en', 'tr'],
      auto_language_detection: true,
      legacy_form_integration: true,
      consultant_auto_assignment: true,
      status: true,
      created_at: new Date().toISOString()
    },
    {
      id: 5,
      name: 'Portugal',
      slug: 'portugal',
      flag_emoji: '🇵🇹',
      description: 'EU membership with Golden Visa program',
      advantages: ['Golden Visa program', 'EU membership', 'Quality of life'],
      primary_language: 'en',
      supported_languages: ['en', 'tr'],
      auto_language_detection: true,
      legacy_form_integration: true,
      consultant_auto_assignment: true,
      status: true,
      created_at: new Date().toISOString()
    },
    {
      id: 6,
      name: 'Malta',
      slug: 'malta',
      flag_emoji: '🇲🇹',
      description: 'EU membership with sophisticated tax planning',
      advantages: ['EU tax optimization', 'Financial services hub', 'English-speaking'],
      primary_language: 'en',
      supported_languages: ['en', 'tr'],
      auto_language_detection: true,
      legacy_form_integration: true,
      consultant_auto_assignment: true,
      status: true,
      created_at: new Date().toISOString()
    },
    {
      id: 7,
      name: 'Panama',
      slug: 'panama',
      flag_emoji: '🇵🇦',
      description: 'Premier offshore jurisdiction with banking privacy',
      advantages: ['Offshore advantages', 'Banking privacy', 'USD currency'],
      primary_language: 'en',
      supported_languages: ['en', 'tr'],
      auto_language_detection: true,
      legacy_form_integration: true,
      consultant_auto_assignment: true,
      status: true,
      created_at: new Date().toISOString()
    }
  ];

  const value: SupabaseContextType = {
    countries,
    loading,
    getCountries,
    getCountryBySlug,
    refreshCountries
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = (): SupabaseContextType => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};
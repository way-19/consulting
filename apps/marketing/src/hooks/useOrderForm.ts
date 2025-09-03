import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Country {
  id: string;
  name: string;
  code: string;
  flag_emoji: string;
  is_recommended: boolean;
  is_active: boolean;
}

export interface Package {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface AdditionalService {
  id: string;
  name: string;
  description: string;
  price: number;
  is_active: boolean;
}

export interface Bank {
  id: string;
  name: string;
  price: number;
  flag_url: string;
  is_active: boolean;
}

export interface OrderFormData {
  // Step 1: Company Details
  companyName: string;
  companyType: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  
  // Step 2: Service Selection
  selectedCountryId: string;
  selectedPackageId: string;
  selectedAdditionalServiceIds: string[];
  
  // Step 3: Banking
  selectedBankId: string;
  
  // Step 4: File Upload
  uploadedFileUrl: string;
  
  // Additional
  notes: string;
  acceptedTerms: boolean;
  acceptedKvkk: boolean;
}

export const useOrderForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [additionalServices, setAdditionalServices] = useState<AdditionalService[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [formData, setFormData] = useState<OrderFormData>({
    companyName: '',
    companyType: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    selectedCountryId: '',
    selectedPackageId: '',
    selectedAdditionalServiceIds: [],
    selectedBankId: '',
    uploadedFileUrl: '',
    notes: '',
    acceptedTerms: false,
    acceptedKvkk: false,
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);

      // Fetch countries
      const { data: countriesData, error: countriesError } = await supabase
        .from('countries')
        .select('*')
        .eq('is_active', true)
        .order('is_recommended', { ascending: false })
        .order('name');

      if (countriesError) {
        console.error('Error fetching countries:', countriesError);
      } else {
        setCountries(countriesData || []);
      }

      // Fetch packages
      const { data: packagesData, error: packagesError } = await supabase
        .from('packages')
        .select('*')
        .order('price');

      if (packagesError) {
        console.error('Error fetching packages:', packagesError);
      } else {
        setPackages(packagesData || []);
      }

      // Fetch additional services
      const { data: servicesData, error: servicesError } = await supabase
        .from('additional_services')
        .select('*')
        .order('name');

      if (servicesError) {
        console.error('Error fetching additional services:', servicesError);
      } else {
        setAdditionalServices(servicesData || []);
      }

      // Fetch banks
      const { data: banksData, error: banksError } = await supabase
        .from('banks')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (banksError) {
        console.error('Error fetching banks:', banksError);
      } else {
        setBanks(banksData || []);
      }

    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (updates: Partial<OrderFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 4) {
      setCurrentStep(step);
    }
  };

  const submitOrder = async () => {
    try {
      setSubmitting(true);

      // Get selected country for additional services
      const selectedCountry = countries.find(c => c.id === formData.selectedCountryId);
      
      // Calculate total price
      const selectedPackage = packages.find(p => p.id === formData.selectedPackageId);
      const selectedBank = banks.find(b => b.id === formData.selectedBankId);
      
      let totalAmount = (selectedPackage?.price || 0) + (selectedBank?.price || 0);
      
      // Add additional services prices
      for (const serviceId of formData.selectedAdditionalServiceIds) {
        const { data: countryService } = await supabase
          .from('country_additional_services')
          .select('price')
          .eq('country_id', formData.selectedCountryId)
          .eq('additional_service_id', serviceId)
          .single();
        
        if (countryService) {
          totalAmount += countryService.price;
        }
      }

      // Create service order
      const { data: order, error: orderError } = await supabase
        .from('service_orders')
        .insert({
          title: `${selectedCountry?.name} Company Formation - ${formData.companyName}`,
          description: `Company formation service for ${formData.companyName} in ${selectedCountry?.name}`,
          total_amount: totalAmount,
          currency: 'USD',
          status: 'pending',
          company_name: formData.companyName,
          company_type: formData.companyType,
          selected_package_id: formData.selectedPackageId,
          additional_service_ids: formData.selectedAdditionalServiceIds,
          country_id: formData.selectedCountryId,
          customer_details: {
            name: formData.customerName,
            email: formData.customerEmail,
            phone: formData.customerPhone,
            address: formData.customerAddress,
            bank_id: formData.selectedBankId,
            notes: formData.notes,
          },
          file_url: formData.uploadedFileUrl,
        })
        .select()
        .single();

      if (orderError) {
        throw orderError;
      }

      // Redirect to success page or payment
      window.location.href = `/order-success?order_id=${order.id}`;

    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Sipariş gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setSubmitting(false);
    }
  };

  const getSelectedAdditionalServicesWithPrices = async () => {
    if (!formData.selectedCountryId || formData.selectedAdditionalServiceIds.length === 0) {
      return [];
    }

    const { data: countryServices } = await supabase
      .from('country_additional_services')
      .select(`
        price,
        additional_service:additional_services(id, name, description)
      `)
      .eq('country_id', formData.selectedCountryId)
      .in('additional_service_id', formData.selectedAdditionalServiceIds);

    return countryServices || [];
  };

  const calculateTotalPrice = async () => {
    const selectedPackage = packages.find(p => p.id === formData.selectedPackageId);
    const selectedBank = banks.find(b => b.id === formData.selectedBankId);
    
    let total = (selectedPackage?.price || 0) + (selectedBank?.price || 0);
    
    // Add additional services prices
    const additionalServicesWithPrices = await getSelectedAdditionalServicesWithPrices();
    total += additionalServicesWithPrices.reduce((sum, service) => sum + service.price, 0);
    
    return total;
  };

  return {
    currentStep,
    formData,
    loading,
    submitting,
    countries,
    packages,
    additionalServices,
    banks,
    updateFormData,
    nextStep,
    prevStep,
    goToStep,
    submitOrder,
    getSelectedAdditionalServicesWithPrices,
    calculateTotalPrice,
  };
};
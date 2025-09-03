// apps/marketing/src/types/order-form.d.ts
export interface Country {
  id: string;
  name: string;
  flag_emoji: string;
  is_recommended: boolean;
}

export interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface AdditionalService {
  id: string;
  name: string;
  description: string;
  price: number; // Base price, country-specific price will override
}

export interface Bank {
  id: string;
  name: string;
  price: number;
  flag_url: string;
}

export interface OrderFormData {
  companyName: string;
  companyType: string;
  contactEmail: string;
  phoneNumber: string;
  selectedCountryId: string;
  selectedPackageId: string;
  selectedAdditionalServiceIds: string[];
  selectedBankId: string;
}

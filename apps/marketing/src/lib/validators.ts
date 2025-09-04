/**
 * Custom validation functions for the Company Formation Wizard
 */

/**
 * Validates E.164 phone number format
 */
export function isValidE164PhoneNumber(value: string): boolean {
  if (!value) return false;
  
  // E.164 format: +[country code][number]
  // Length: 7-15 digits (excluding +)
  // Must start with +
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  
  return e164Regex.test(value);
}

/**
 * Checks if a person is at least minAge years old based on their date of birth
 */
export function isAdult(dateOfBirth: string, minAge: number = 18): boolean {
  if (!dateOfBirth) return false;
  
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  
  // Calculate age
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age >= minAge;
}

/**
 * Validates company name against jurisdiction-specific regex
 */
export function isValidCompanyName(name: string, regex: string): boolean {
  if (!name || !regex) return false;
  
  try {
    const regexPattern = new RegExp(regex);
    return regexPattern.test(name);
  } catch (error) {
    console.error('Invalid regex pattern:', regex);
    return true; // Fallback to allow if regex is invalid
  }
}

/**
 * Validates address format
 */
export function isValidAddress(address: {
  street: string;
  city: string;
  state?: string;
  zipcode: string;
  country: string;
}): boolean {
  return !!(
    address.street?.trim() &&
    address.city?.trim() &&
    address.zipcode?.trim() &&
    address.country?.trim()
  );
}

/**
 * Calculates estimated total from package and addons
 */
export function calculateTotal(
  selectedPackage: { price: number } | null,
  selectedAddons: Array<{ price: number }> = []
): number {
  const packagePrice = selectedPackage?.price || 0;
  const addonsTotal = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
  return packagePrice + addonsTotal;
}
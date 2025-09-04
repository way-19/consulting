import { z } from 'zod';
import { isValidE164PhoneNumber, isAdult, isValidCompanyName, isValidAddress } from '../lib/validators';

// Base schemas for reusable objects
const packageSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  currency: z.string(),
  processingTime: z.string(),
  includes: z.array(z.string()),
});

const addonSchema = z.object({
  id: z.string(),
  label: z.string(),
  price: z.number(),
});

const addressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().optional(),
  zipcode: z.string().min(1, 'Zip code is required'),
  country: z.string().min(1, 'Country is required'),
}).refine((address) => isValidAddress(address), {
  message: 'Please provide a complete address',
});

const contactSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().refine((phone) => isValidE164PhoneNumber(phone), {
    message: 'Please enter a valid phone number in E.164 format (e.g., +1234567890)',
  }),
});

// Personal information schema with conditional validation
const personalSchema = z.object({
  nationality: z.string().min(1, 'Nationality is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  passportNumber: z.string().optional(),
  address: addressSchema,
}).refine((data) => isAdult(data.dateOfBirth, 18), {
  message: 'Applicant must be at least 18 years old',
  path: ['dateOfBirth'],
});

// Main schema
export const formationApplicationSchema = z.object({
  // Step 1: Jurisdiction Selection
  jurisdiction: z.string().min(1, 'Please select a jurisdiction'),
  
  // Step 2: Names and Entity Type
  entityType: z.string().min(1, 'Please select an entity type'),
  proposedNames: z.array(z.string().min(1, 'Company name is required'))
    .min(1, 'At least one company name is required'),
  
  // Step 3: Package Selection
  package: packageSchema,
  
  // Step 4: Add-ons (optional, depends on jurisdiction)
  addons: z.array(addonSchema).optional().default([]),
  
  // Step 5: Contact Information
  contact: contactSchema,
  
  // Step 5: Personal Information
  personal: personalSchema,
  
  // Step 6: Consents
  consents: z.object({
    termsAccepted: z.boolean().refine(val => val === true, {
      message: 'You must accept the terms and conditions',
    }),
    privacyAccepted: z.boolean().refine(val => val === true, {
      message: 'You must accept the privacy policy',
    }),
  }),
});

/**
 * Create a dynamic schema based on selected jurisdiction
 */
export function createJurisdictionSchema(jurisdiction: any) {
  let schema = formationApplicationSchema;
  
  if (jurisdiction?.validations) {
    const { validations, fields } = jurisdiction;
    
    // Apply minimum proposed names validation
    if (validations.minProposedNames > 1) {
      schema = schema.extend({
        proposedNames: z.array(z.string().min(1, 'Company name is required'))
          .min(validations.minProposedNames, `At least ${validations.minProposedNames} company names are required`)
          .refine((names) => {
            return names.every(name => isValidCompanyName(name, validations.companyNameRegex));
          }, {
            message: 'Company names contain invalid characters',
          }),
      });
    }
    
    // Apply passport number requirement
    if (validations.requirePassportNumber) {
      schema = schema.extend({
        personal: schema.shape.personal.extend({
          passportNumber: z.string().min(1, 'Passport number is required'),
        }),
      });
    }
    
    // Apply field requirements
    if (fields.nationality === 'hidden') {
      schema = schema.extend({
        personal: schema.shape.personal.omit({ nationality: true }),
      });
    }
  }
  
  return schema;
}

export type FormationApplicationData = z.infer<typeof formationApplicationSchema>;
export type ContactData = z.infer<typeof contactSchema>;
export type PersonalData = z.infer<typeof personalSchema>;
export type AddressData = z.infer<typeof addressSchema>;
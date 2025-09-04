import { z } from 'zod';

// Validation schemas for each step
export const companyDetailsSchema = z.object({
  companyName: z.string().min(2, 'Şirket adı en az 2 karakter olmalıdır'),
  taxNumber: z.string().min(10, 'Vergi numarası en az 10 karakter olmalıdır'),
  address: z.string().min(10, 'Adres en az 10 karakter olmalıdır'),
  city: z.string().min(2, 'Şehir adı gereklidir'),
  country: z.string().min(1, 'Ülke seçimi gereklidir'),
  contactPerson: z.string().min(2, 'İletişim kişisi adı gereklidir'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  phone: z.string().min(10, 'Telefon numarası en az 10 karakter olmalıdır'),
});

export const serviceSelectionSchema = z.object({
  selectedServices: z.array(z.string()).min(1, 'En az bir hizmet seçmelisiniz'),
  additionalRequirements: z.string().optional(),
});

export const bankingDetailsSchema = z.object({
  bankName: z.string().min(1, 'Banka seçimi gereklidir'),
  accountType: z.enum(['checking', 'savings'], {
    errorMap: () => ({ message: 'Hesap türü seçimi gereklidir' })
  }),
  monthlyVolume: z.string().min(1, 'Aylık işlem hacmi gereklidir'),
  businessType: z.string().min(1, 'İş türü seçimi gereklidir'),
  riskLevel: z.enum(['low', 'medium', 'high'], {
    errorMap: () => ({ message: 'Risk seviyesi seçimi gereklidir' })
  }),
});

export const reviewAndPaySchema = z.object({
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'Şartları kabul etmelisiniz'
  }),
  privacyAccepted: z.boolean().refine(val => val === true, {
    message: 'Gizlilik politikasını kabul etmelisiniz'
  }),
});

// Combined schema for the entire form
export const orderFormSchema = companyDetailsSchema
  .merge(serviceSelectionSchema)
  .merge(bankingDetailsSchema)
  .merge(reviewAndPaySchema);

export type OrderFormData = z.infer<typeof orderFormSchema>;
export type CompanyDetailsData = z.infer<typeof companyDetailsSchema>;
export type ServiceSelectionData = z.infer<typeof serviceSelectionSchema>;
export type BankingDetailsData = z.infer<typeof bankingDetailsSchema>;
export type ReviewAndPayData = z.infer<typeof reviewAndPaySchema>;
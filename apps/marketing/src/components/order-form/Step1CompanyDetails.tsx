import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { OrderFormData } from '../../types/order';
import { Input, Select } from '../ui';

interface Step1Props {
  form: UseFormReturn<OrderFormData>;
}

const COUNTRIES = [
  { value: 'TR', label: 'Türkiye' },
  { value: 'US', label: 'Amerika Birleşik Devletleri' },
  { value: 'GB', label: 'Birleşik Krallık' },
  { value: 'DE', label: 'Almanya' },
  { value: 'FR', label: 'Fransa' },
];

export const Step1CompanyDetails: React.FC<Step1Props> = ({ form }) => {
  const { register, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Şirket Bilgileri</h2>
        <p className="text-gray-600">Lütfen şirketinizin temel bilgilerini giriniz.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Şirket Adı"
          required
          {...register('companyName')}
          error={errors.companyName?.message}
          placeholder="Örn: ABC Teknoloji Ltd."
        />

        <Input
          label="Vergi Numarası"
          required
          {...register('taxNumber')}
          error={errors.taxNumber?.message}
          placeholder="1234567890"
        />

        <div className="md:col-span-2">
          <Input
            label="Adres"
            required
            {...register('address')}
            error={errors.address?.message}
            placeholder="Tam adresinizi giriniz"
          />
        </div>

        <Input
          label="Şehir"
          required
          {...register('city')}
          error={errors.city?.message}
          placeholder="İstanbul"
        />

        <Select
          label="Ülke"
          required
          {...register('country')}
          error={errors.country?.message}
          options={COUNTRIES}
          placeholder="Ülke seçiniz"
        />

        <Input
          label="İletişim Kişisi"
          required
          {...register('contactPerson')}
          error={errors.contactPerson?.message}
          placeholder="Ad Soyad"
        />

        <Input
          label="E-posta"
          type="email"
          required
          {...register('email')}
          error={errors.email?.message}
          placeholder="ornek@sirket.com"
        />

        <Input
          label="Telefon"
          type="tel"
          required
          {...register('phone')}
          error={errors.phone?.message}
          placeholder="+90 555 123 45 67"
        />
      </div>
    </div>
  );
};
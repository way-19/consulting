import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { OrderFormData } from '../../types/order';

interface Step2Props {
  form: UseFormReturn<OrderFormData>;
}

const SERVICES = [
  {
    id: 'payment-processing',
    title: 'Ödeme İşleme',
    description: 'Kredi kartı ve banka kartı ödemeleri',
    price: '₺299/ay',
    features: ['PCI DSS Uyumlu', '24/7 Destek', 'Fraud Koruması']
  },
  {
    id: 'merchant-account',
    title: 'Merchant Hesabı',
    description: 'Profesyonel ödeme hesabı kurulumu',
    price: '₺199/ay',
    features: ['Hızlı Onay', 'Düşük Komisyon', 'API Entegrasyonu']
  },
  {
    id: 'pos-terminal',
    title: 'POS Terminal',
    description: 'Fiziksel mağaza ödemeleri',
    price: '₺149/ay',
    features: ['Kablosuz Terminal', 'Mobil Uygulama', 'Raporlama']
  },
  {
    id: 'online-payments',
    title: 'Online Ödemeler',
    description: 'E-ticaret entegrasyonu',
    price: '₺249/ay',
    features: ['API Entegrasyonu', 'Güvenli Ödeme', 'Çoklu Para Birimi']
  }
];

export const Step2ServiceSelection: React.FC<Step2Props> = ({ form }) => {
  const { register, watch, setValue, formState: { errors } } = form;
  const selectedServices = watch('selectedServices') || [];

  const handleServiceToggle = (serviceId: string) => {
    const isSelected = selectedServices.includes(serviceId);
    if (isSelected) {
      setValue('selectedServices', selectedServices.filter(id => id !== serviceId));
    } else {
      setValue('selectedServices', [...selectedServices, serviceId]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Hizmet Seçimi</h2>
        <p className="text-gray-600">İhtiyacınız olan hizmetleri seçiniz.</p>
      </div>

      {errors.selectedServices && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.selectedServices.message}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SERVICES.map((service) => {
          const isSelected = selectedServices.includes(service.id);
          return (
            <div
              key={service.id}
              className={`
                relative border-2 rounded-lg p-6 cursor-pointer transition-all duration-200
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }
              `}
              onClick={() => handleServiceToggle(service.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-3">{service.description}</p>
                  <div className="text-2xl font-bold text-blue-600 mb-3">
                    {service.price}
                  </div>
                  <ul className="space-y-1">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
                  ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}
                `}>
                  {isSelected && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Ek Gereksinimler
        </label>
        <textarea
          {...register('additionalRequirements')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          rows={4}
          placeholder="Özel gereksinimleriniz varsa buraya yazabilirsiniz..."
        />
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

interface ContactPageProps {
  language: 'en' | 'tr';
}

const ContactPage: React.FC<ContactPageProps> = ({ language }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    service: '',
    message: ''
  });

  const content = {
    en: {
      title: 'Contact Us',
      subtitle: 'Get in touch with our experts',
      form: {
        name: 'Full Name',
        email: 'Email Address',
        country: 'Country of Interest',
        service: 'Service Needed',
        message: 'Message',
        submit: 'Send Message'
      },
      contact: {
        email: 'info@consulting19.com',
        phone: '+1 (555) CONSULT',
        address: 'Global Operations Center',
        hours: '24/7 Support Available'
      }
    },
    tr: {
      title: 'İletişim',
      subtitle: 'Uzmanlarımızla iletişime geçin',
      form: {
        name: 'Ad Soyad',
        email: 'E-posta Adresi',
        country: 'İlgilendiğiniz Ülke',
        service: 'İhtiyaç Duyulan Hizmet',
        message: 'Mesaj',
        submit: 'Mesaj Gönder'
      },
      contact: {
        email: 'info@consulting19.com',
        phone: '+1 (555) CONSULT',
        address: 'Küresel Operasyon Merkezi',
        hours: '7/24 Destek Mevcut'
      }
    }
  };

  const countries = [
    'Georgia', 'USA', 'Montenegro', 'Estonia', 'Portugal', 'Malta', 'Panama'
  ];

  const services = language === 'en' 
    ? ['Company Formation', 'Investment Advisory', 'Legal Consulting', 'Accounting Services', 'Visa & Residency', 'Banking Solutions']
    : ['Şirket Kuruluşu', 'Yatırım Danışmanlığı', 'Hukuki Danışmanlık', 'Muhasebe Hizmetleri', 'Vize ve İkamet', 'Bankacılık Çözümleri'];

  const t = content[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert(language === 'en' ? 'Message sent successfully!' : 'Mesaj başarıyla gönderildi!');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t.title}
          </h1>
          <p className="text-xl text-gray-600">
            {t.subtitle}
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {language === 'en' ? 'Send us a message' : 'Bize mesaj gönderin'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.form.name}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.form.email}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.form.country}
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">{language === 'en' ? 'Select a country' : 'Ülke seçin'}</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.form.service}
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">{language === 'en' ? 'Select a service' : 'Hizmet seçin'}</option>
                    {services.map((service) => (
                      <option key={service} value={service}>{service}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.form.message}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {t.form.submit}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {language === 'en' ? 'Get in touch' : 'İletişime geçin'}
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-purple-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">{t.contact.email}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-purple-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-600">{t.contact.phone}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-purple-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Address</h3>
                    <p className="text-gray-600">{t.contact.address}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="h-6 w-6 text-purple-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Hours</h3>
                    <p className="text-gray-600">{t.contact.hours}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, Users, Star, Phone, Mail } from 'lucide-react';
import { db } from '../../lib/supabase';

const BankAccountGeorgia = () => {
  const { country, serviceSlug } = useParams(); // Get country and service slug from URL
  const [serviceData, setServiceData] = useState(null);
  const [consultant, setConsultant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadServiceDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        // Assuming db.getServiceBySlug can fetch service details and associated consultant
        const data = await db.getServiceBySlug(serviceSlug);
        setServiceData(data);
        setConsultant(data.consultant); // Assuming consultant data is nested
      } catch (err) {
        console.error("Error loading service data:", err);
        setError("Hizmet bilgileri yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    if (serviceSlug) {
      loadServiceDetails();
    }
  }, [serviceSlug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Hizmet bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !serviceData || !consultant) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Hizmet bulunamadı</h1>
          <Link to={`/${country}`} className="text-blue-600 hover:text-blue-700">
            {country} sayfasına geri dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link // Dynamic back link
            to={`/${country}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Georgia Services
          </Link>
          
          <div className="flex items-center justify-between"> {/* Hero section */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                🇬🇪 {serviceData.title}
              </h1>
              <p className="text-xl text-gray-600">{serviceData.description}</p>
            </div>
            
            {/* Consultant Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center mb-4">
                <img
                  src={consultant.avatar_url || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'}
                  alt={consultant.first_name}
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{consultant.first_name} {consultant.last_name}</h3>
                  <p className="text-blue-600">Senior Business Consultant</p>
                  <p className="text-gray-600 text-sm">{consultant.total_clients_served || 0} clients served</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div> {/* Using performance_rating as rating */}
                  <div className="text-2xl font-bold">{consultant.performance_rating || 'N/A'}</div>
                  <div className="text-gray-600 text-sm">Rating</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{consultant.total_clients_served || 'N/A'}</div>
                  <div className="text-gray-600 text-sm">Clients</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Service Overview */}
              {/* Service overview is now part of serviceData.description */}
              {/* You can add more detailed content here if serviceData has a 'content' field */}
              {/* <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Hizmet Detayları</h2>
                <p className="text-gray-600 leading-relaxed">{serviceData.description}</p>
              </div> */}

              {/* Features */}
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Features from serviceData.features */}
                  {serviceData.features && serviceData.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Process */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Process</h2>
                <div className="space-y-6"> {/* This would ideally come from serviceData.process or similar */}
                  {process.map((item) => (
                    <div key={item.step} className="flex items-start">
                      <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Quick Stats */}
              {/* Quick facts would come from serviceData.metadata or specific fields */}
              {/* <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Hızlı Bilgiler</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">İşlem Süresi</span>
                    <span className="font-semibold text-gray-900">{serviceData.metadata?.processing_time || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Uzaktan Açılış</span>
                    <span className="font-semibold text-green-600">{serviceData.metadata?.remote_opening ? 'Mevcut' : 'Yok'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Para Birimleri</span>
                    <span className="font-semibold text-gray-900">{serviceData.metadata?.currencies || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Min. Bakiye</span>
                    <span className="font-semibold text-gray-900">{serviceData.metadata?.min_balance || 'N/A'}</span>
                  </div>
                </div>
              </div> */}

              {/* Requirements */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Required Documents</h3>
                <div className="space-y-3">
                  {requirements.map((requirement, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-blue-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{requirement}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white text-center">
                <h3 className="text-xl font-bold mb-3">Ready to Get Started?</h3>
                <p className="text-blue-100 mb-6">
                  Register now and connect with Nino to start your bank account opening process
                </p>
                <Link
                  to="/login"
                  className="block w-full bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors mb-3"
                > {/* Link to login/registration */}
                  Register & Start Process
                </Link>
                <Link
                  to="/contact"
                  className="block w-full border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors"
                >
                  Ask Questions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Dummy data for process and requirements - these should also come from DB if dynamic
const process = [
  { step: 1, title: 'Document Preparation', description: 'We help you prepare all required documents and forms' },
  { step: 2, title: 'Bank Selection', description: 'Choose the best Georgian bank based on your needs' },
  { step: 3, title: 'Application Submission', description: 'Submit your application through our verified channels' },
  { step: 4, title: 'Verification Process', description: 'Complete video call verification with bank representatives' },
  { step: 5, title: 'Account Activation', description: 'Receive your account details and banking cards' }
];

const requirements = [
  'Valid passport copy', 'Proof of address (utility bill)', 'Bank reference letter', 'Source of income documentation', 'Completed application form', 'Video call verification'
];

export default BankAccountGeorgia;
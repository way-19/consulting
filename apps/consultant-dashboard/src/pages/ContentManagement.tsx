import React, { useState } from 'react';
import { Save, Eye, Upload } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const ContentManagement = () => {
  const [contentData, setContentData] = useState({
    heroTitle: 'United Arab Emirates Business Formation',
    heroDescription: 'The UAE is a premier destination for international business, offering zero corporate tax in many free zones, strategic location, and world-class infrastructure.',
    aboutSection: 'The UAE offers unparalleled opportunities for international businesses looking to establish a presence in the Middle East and access global markets.',
    whyChooseTitle: 'Why Choose UAE for Your Business?',
    whyChooseContent: 'Strategic location, tax benefits, modern infrastructure, and business-friendly regulations make the UAE an ideal choice for international expansion.',
    processTitle: 'Our UAE Business Setup Process',
    processDescription: 'We guide you through every step of establishing your business in the UAE, from initial consultation to full operational setup.',
    testimonialsTitle: 'Success Stories from UAE',
    testimonialsDescription: 'Hear from entrepreneurs who have successfully established their businesses in the UAE with our expert guidance.',
  });

  const handleSave = () => {
    // Save content data logic here
    console.log('Saving content data:', contentData);
    alert('Content updated successfully!');
  };

  const handleInputChange = (field: string, value: string) => {
    setContentData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Management</h1>
                <p className="text-gray-600">Customize your country page content and messaging</p>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" icon={Eye}>
                  Preview
                </Button>
                <Button icon={Save} iconPosition="left" onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Hero Section */}
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold text-gray-900">Hero Section</h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hero Title
                    </label>
                    <input
                      type="text"
                      value={contentData.heroTitle}
                      onChange={(e) => handleInputChange('heroTitle', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hero Description
                    </label>
                    <textarea
                      value={contentData.heroDescription}
                      onChange={(e) => handleInputChange('heroDescription', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* About Section */}
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold text-gray-900">About Section</h2>
              </Card.Header>
              <Card.Body>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    About Content
                  </label>
                  <textarea
                    value={contentData.aboutSection}
                    onChange={(e) => handleInputChange('aboutSection', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </Card.Body>
            </Card>

            {/* Why Choose Section */}
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold text-gray-900">Why Choose Section</h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={contentData.whyChooseTitle}
                      onChange={(e) => handleInputChange('whyChooseTitle', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content
                    </label>
                    <textarea
                      value={contentData.whyChooseContent}
                      onChange={(e) => handleInputChange('whyChooseContent', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Process Section */}
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold text-gray-900">Process Section</h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Process Title
                    </label>
                    <input
                      type="text"
                      value={contentData.processTitle}
                      onChange={(e) => handleInputChange('processTitle', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Process Description
                    </label>
                    <textarea
                      value={contentData.processDescription}
                      onChange={(e) => handleInputChange('processDescription', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Testimonials Section */}
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold text-gray-900">Testimonials Section</h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Testimonials Title
                    </label>
                    <input
                      type="text"
                      value={contentData.testimonialsTitle}
                      onChange={(e) => handleInputChange('testimonialsTitle', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Testimonials Description
                    </label>
                    <textarea
                      value={contentData.testimonialsDescription}
                      onChange={(e) => handleInputChange('testimonialsDescription', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ContentManagement;
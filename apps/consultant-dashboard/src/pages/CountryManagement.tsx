import React, { useState } from 'react';
import { Save, Upload, Eye } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const CountryManagement = () => {
  const [countryData, setCountryData] = useState({
    name: 'United Arab Emirates',
    code: 'uae',
    flag_emoji: '🇦🇪',
    description: 'The UAE is a premier destination for international business, offering zero corporate tax in many free zones, strategic location, and world-class infrastructure.',
    tax_rate: 0,
    business_advantages: [
      '0% corporate tax for 50 years in free zones',
      '100% foreign ownership allowed',
      'No personal income tax',
      'Strategic location between East and West',
      'World-class infrastructure',
      'Political and economic stability',
    ],
    featured: true,
    is_active: true,
  });

  const [newAdvantage, setNewAdvantage] = useState('');

  const handleSave = () => {
    // Save country data logic here
    console.log('Saving country data:', countryData);
    alert('Country information updated successfully!');
  };

  const addAdvantage = () => {
    if (newAdvantage.trim()) {
      setCountryData(prev => ({
        ...prev,
        business_advantages: [...prev.business_advantages, newAdvantage.trim()]
      }));
      setNewAdvantage('');
    }
  };

  const removeAdvantage = (index: number) => {
    setCountryData(prev => ({
      ...prev,
      business_advantages: prev.business_advantages.filter((_, i) => i !== index)
    }));
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Country Management</h1>
                <p className="text-gray-600">Update your country information and business advantages</p>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Basic Information */}
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country Name
                    </label>
                    <input
                      type="text"
                      value={countryData.name}
                      onChange={(e) => setCountryData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country Code
                    </label>
                    <input
                      type="text"
                      value={countryData.code}
                      onChange={(e) => setCountryData(prev => ({ ...prev, code: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Flag Emoji
                    </label>
                    <input
                      type="text"
                      value={countryData.flag_emoji}
                      onChange={(e) => setCountryData(prev => ({ ...prev, flag_emoji: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      value={countryData.tax_rate}
                      onChange={(e) => setCountryData(prev => ({ ...prev, tax_rate: Number(e.target.value) }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="0"
                      max="100"
                    />
                  </div>

                  <div className="flex items-center space-x-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={countryData.featured}
                        onChange={(e) => setCountryData(prev => ({ ...prev, featured: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Featured Country</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={countryData.is_active}
                        onChange={(e) => setCountryData(prev => ({ ...prev, is_active: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Active</span>
                    </label>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Description */}
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold text-gray-900">Description</h2>
              </Card.Header>
              <Card.Body>
                <textarea
                  value={countryData.description}
                  onChange={(e) => setCountryData(prev => ({ ...prev, description: e.target.value }))}
                  rows={8}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your country's business advantages..."
                />
              </Card.Body>
            </Card>
          </div>

          {/* Business Advantages */}
          <Card className="mt-8">
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">Business Advantages</h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                {countryData.business_advantages.map((advantage, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className="flex-1 text-gray-900">{advantage}</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => removeAdvantage(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={newAdvantage}
                    onChange={(e) => setNewAdvantage(e.target.value)}
                    placeholder="Add new business advantage..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && addAdvantage()}
                  />
                  <Button onClick={addAdvantage}>
                    Add
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default CountryManagement;
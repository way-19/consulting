import React, { useState } from 'react';
import { Save, Upload, Eye, Languages, Loader } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { deepLTranslator } from '@consulting19/shared';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const CountryManagement = () => {
  const [countryData, setCountryData] = useState({
    name: 'United Arab Emirates',
    code: 'uae',
    flag_emoji: '🇦🇪',
    description: 'The UAE is a premier destination for international business, offering zero corporate tax in many free zones, strategic location, and world-class infrastructure.',
    description_tr: '',
    description_pt: '',
    tax_rate: 0,
    business_advantages: [
      '0% corporate tax for 50 years in free zones',
      '100% foreign ownership allowed',
      'No personal income tax',
      'Strategic location between East and West',
      'World-class infrastructure',
      'Political and economic stability',
    ],
    business_advantages_tr: [] as string[],
    business_advantages_pt: [] as string[],
    featured: true,
    is_active: true,
  });

  const [newAdvantage, setNewAdvantage] = useState('');
  const [newAdvantageTR, setNewAdvantageTR] = useState('');
  const [newAdvantagePT, setNewAdvantagePT] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

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

  const addAdvantageLocalized = (lang: 'tr' | 'pt') => {
    if (lang === 'tr' && newAdvantageTR.trim()) {
      setCountryData(prev => ({
        ...prev,
        business_advantages_tr: [...(prev.business_advantages_tr || []), newAdvantageTR.trim()]
      }));
      setNewAdvantageTR('');
    } else if (lang === 'pt' && newAdvantagePT.trim()) {
      setCountryData(prev => ({
        ...prev,
        business_advantages_pt: [...(prev.business_advantages_pt || []), newAdvantagePT.trim()]
      }));
      setNewAdvantagePT('');
    }
  };

  const removeAdvantageLocalized = (index: number, lang: 'tr' | 'pt') => {
    if (lang === 'tr') {
      setCountryData(prev => ({
        ...prev,
        business_advantages_tr: (prev.business_advantages_tr || []).filter((_, i) => i !== index)
      }));
    } else if (lang === 'pt') {
      setCountryData(prev => ({
        ...prev,
        business_advantages_pt: (prev.business_advantages_pt || []).filter((_, i) => i !== index)
      }));
    }
  };

  const handleTranslate = async () => {
    if (!countryData.description.trim()) {
      alert('Please fill in the English description first for translation.');
      return;
    }
    
    setIsTranslating(true);
    try {
      // Translate description
      const descriptionTr = await deepLTranslator.translate(countryData.description, 'EN', 'TR');
      const descriptionPt = await deepLTranslator.translate(countryData.description, 'EN', 'PT');

      // Translate business advantages
      const advantagesTrResult = await deepLTranslator.translateMultiple(countryData.business_advantages, 'TR');
      const advantagesPtResult = await deepLTranslator.translateMultiple(countryData.business_advantages, 'PT');

      const businessAdvantagesTr = Object.values(advantagesTrResult);
      const businessAdvantagesPt = Object.values(advantagesPtResult);

      setCountryData(prev => ({
        ...prev,
        description_tr: descriptionTr,
        description_pt: descriptionPt,
        business_advantages_tr: businessAdvantagesTr,
        business_advantages_pt: businessAdvantagesPt,
      }));

      alert('Translation completed successfully!');
    } catch (error) {
      console.error('Translation error:', error);
      alert('Translation failed. Please check your DeepL API key and try again.');
    } finally {
      setIsTranslating(false);
    }
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
                <Button
                  icon={Languages}
                  iconPosition="left"
                  onClick={handleTranslate}
                  disabled={isTranslating || !countryData.description.trim()}
                  loading={isTranslating}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isTranslating ? 'Translating...' : 'Translate Content'}
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
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      English Description
                    </label>
                <textarea
                  value={countryData.description}
                  onChange={(e) => setCountryData(prev => ({ ...prev, description: e.target.value }))}
                  rows={8}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your country's business advantages..."
                />
                  </div>

                  {isTranslating && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <Loader className="w-5 h-5 text-blue-600 animate-spin mr-3" />
                        <span className="text-blue-800">Translating content using DeepL AI...</span>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Turkish Description
                    </label>
                    <textarea
                      value={countryData.description_tr}
                      onChange={(e) => setCountryData(prev => ({ ...prev, description_tr: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Ülkenizin iş avantajlarını Türkçe açıklayın..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Portuguese Description
                    </label>
                    <textarea
                      value={countryData.description_pt}
                      onChange={(e) => setCountryData(prev => ({ ...prev, description_pt: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Descreva as vantagens de negócios do seu país em Português..."
                    />
                  </div>
                </div>
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
                {/* English Business Advantages */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">English Business Advantages</h3>
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
                </div>

                {/* Turkish Business Advantages */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Turkish Business Advantages</h3>
                  {(countryData.business_advantages_tr || []).map((advantage, index) => (
                    <div key={`tr-${index}`} className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                      <span className="flex-1 text-gray-900">{advantage}</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeAdvantageLocalized(index, 'tr')}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={newAdvantageTR}
                      onChange={(e) => setNewAdvantageTR(e.target.value)}
                      placeholder="Yeni Türkçe iş avantajı ekle..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && addAdvantageLocalized('tr')}
                    />
                    <Button onClick={() => addAdvantageLocalized('tr')}>
                      Add TR
                    </Button>
                  </div>
                </div>

                {/* Portuguese Business Advantages */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Portuguese Business Advantages</h3>
                  {(countryData.business_advantages_pt || []).map((advantage, index) => (
                    <div key={`pt-${index}`} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <span className="flex-1 text-gray-900">{advantage}</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeAdvantageLocalized(index, 'pt')}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={newAdvantagePT}
                      onChange={(e) => setNewAdvantagePT(e.target.value)}
                      placeholder="Adicionar nova vantagem de negócio em Português..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && addAdvantageLocalized('pt')}
                    />
                    <Button onClick={() => addAdvantageLocalized('pt')}>
                      Add PT
                    </Button>
                  </div>
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
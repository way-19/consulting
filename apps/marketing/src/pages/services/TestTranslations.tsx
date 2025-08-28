import React from 'react';
import { useLanguage } from '@consulting19/shared';

const TestTranslations = () => {
  const { t, language } = useLanguage();

  // Test existing translations
  const existingKeys = [
    'companyFormation',
    'taxOptimization', 
    'bankingSolutions',
    'legalCompliance',
    'assetProtection',
    'investmentAdvisory',
    'home',
    'services',
    'countries',
    'about',
    'blog',
    'contact'
  ];

  // Test new keys we need
  const newKeys = [
    'companyFormationHeroTitle',
    'companyFormationHeroDesc',
    'whatWeOffer',
    'whyChooseUs',
    'howItWorks',
    'successStories'
  ];

  return (
    <div className="p-8">
      <h1>Translation Test - Current Language: {language}</h1>
      
      <h2>Existing Keys (should work):</h2>
      {existingKeys.map(key => (
        <div key={key}>
          <strong>{key}:</strong> {t(key)}
        </div>
      ))}
      
      <h2>New Keys (might not work):</h2>
      {newKeys.map(key => (
        <div key={key}>
          <strong>{key}:</strong> {t(key)}
        </div>
      ))}
    </div>
  );
};

export default TestTranslations;
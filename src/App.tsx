import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Countries from './components/Countries';
import Services from './components/Services';
import Footer from './components/Footer';

function App() {
  const [language, setLanguage] = useState<'en' | 'tr'>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'tr' : 'en');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header language={language} onLanguageToggle={toggleLanguage} />
      <Hero language={language} />
      <Countries language={language} />
      <Services language={language} />
      <Footer language={language} />
    </div>
  );
}

export default App;
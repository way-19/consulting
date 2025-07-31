import React from 'react';
import HeroSection from '../components/home/HeroSection';
import CountryGrid from '../components/home/CountryGrid';
import ServicesGrid from '../components/home/ServicesGrid';
import GlobalStats from '../components/home/GlobalStats';
import AIPreview from '../components/home/AIPreview';
import BlogNewsSection from '../components/home/BlogNewsSection';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <CountryGrid />
      <ServicesGrid />
      <GlobalStats />
      <AIPreview />
      <BlogNewsSection />
    </div>
  );
};

export default HomePage;
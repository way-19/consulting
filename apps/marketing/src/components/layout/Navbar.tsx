import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Globe, Users, Zap, Shield, TrendingUp, MessageCircle, Calendar, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@consulting19/shared';
import { Button, Card } from '@consulting19/ui';
import { getLatestBlogPosts } from '../data/mockBlogPosts';
import HeroSection from '../components/sections/HeroSection';
import HowItWorksSection from '../components/sections/HowItWorksSection';
import ServicesOverviewSection from '../components/sections/ServicesOverviewSection';
import FeaturedCountriesSection from '../components/sections/FeaturedCountriesSection';
import AIPromotionSection from '../components/sections/AIPromotionSection';
import BlogSliderSection from '../components/sections/BlogSliderSection';
import RealTimeAnalyticsSection from '../components/sections/RealTimeAnalyticsSection';
import AIAssistantWidget from '../components/AIAssistantWidget';

const HomePage = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <HeroSection />
      <HowItWorksSection />
      
      {/* Split Content Section */}
      <section className="py-6 bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 border border-blue-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 border border-teal-400 rounded-lg rotate-45 animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-purple-400 rounded-full animate-ping"></div>
          <div className="absolute top-1/3 right-1/3 w-20 h-20 border border-indigo-400 rounded-lg animate-pulse"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Wealth Management CTA */}
          <WealthCTASection />
              <div className="flex items-center mb-3">
          {/* Right Side Content */}
          <div className="bg-gradient-to-br from-indigo-600/95 via-purple-600/90 to-blue-600/95 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-indigo-300/30 hover:shadow-2xl hover:from-indigo-700/95 hover:via-purple-700/90 hover:to-blue-700/95 transition-all duration-500 relative overflow-hidden h-80">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-xl"></div>
                <h2 className="text-lg font-bold text-white">
            <div className="relative z-10 h-full flex flex-col justify-between">
            {/* Top Section */}
                  <p className="text-indigo-100 text-xs leading-tight">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-white/20 to-white/30 rounded-xl flex items-center justify-center mr-4 shadow-lg backdrop-blur-sm">
                <span className="text-white text-xl">🏢</span>
              </div>
              <div>
              <div className="space-y-2 mb-4">
                  {t('company.title')}
                </h2>
                <p className="text-blue-100 mb-3 text-xs leading-tight">
                  {t('company.subtitle')}
                  <p className="text-white font-medium text-xs">{t('company.feature1')}</p>
              </div>
            </div>
            </div>
            
            {/* Middle Section - Features */}
                  <p className="text-white font-medium text-xs">{t('company.feature2')}</p>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-yellow-300 text-sm">⚡</span>
                </div>
                <span className="text-xs font-medium text-white">{t('company.feature1')}</span>
                  <p className="text-white font-medium text-xs">{t('company.feature3')}</p>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-blue-300 text-sm">🌍</span>
                </div>
                <span className="text-xs font-medium text-white">{t('company.feature2')}</span>
                  <p className="text-white font-medium text-xs">{t('company.feature4')}</p>
              <div className="flex items-center space-x-3">
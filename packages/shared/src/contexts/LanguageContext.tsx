import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'tr' | 'pt';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    home: 'Home',
    services: 'Services',
    countries: 'Countries',
    about: 'About',
    blog: 'Blog',
    contact: 'Contact',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    dashboard: 'Dashboard',
    viewAllServices: 'View All Services',
    viewAllCountries: 'View All Countries',

    // Hero Section (HomePage)
    heroTitle: 'AI-Enhanced Global Intelligence',
    heroSubtitle: 'at Your Service',
    heroDescription: 'Next-level regulatory guidance with intelligent automation. Our AI-powered platform connects you with expert consultants across the world\'s most business-friendly jurisdictions.',
    getStarted: 'Get Started Today',
    exploreServices: 'Explore Services',

    // Company Formation CTA (HomePage)
    companyTitle: 'Company Formation',
    companySubtitle: 'Fast & reliable business setup worldwide',
    companyFeature1: 'Expert guidance',
    companyFeature2: 'Global network',
    companyFeature3: 'Compliance assured',
    companyFeature4: 'Professional support',
    companyCta: 'Start Company Formation',

    // Wealth Management CTA (HomePage)
    wealthTitle: 'Wealth Management',
    wealthSubtitle: 'AI-powered investment strategies for global wealth optimization',
    wealthFeature1: 'AI-driven analysis',
    wealthFeature2: 'Global opportunities',
    wealthFeature3: 'Unlimited potential',
    wealthStat1: '$2.5B+ Managed',
    wealthStat2: '98% Success Rate',
    wealthCta: 'Explore Wealth Solutions',

    // Footer
    copyright: '© 2025 Consulting19. All rights reserved',
    powered: 'Powered by AI Oracle',

    // Services Page
    servicesHeroTitle: 'Comprehensive International Business Services',
    servicesHeroDescription: 'From company formation to ongoing compliance, we provide end-to-end support delivered by expert consultants in over 19 countries worldwide.',
    
    // Service Categories
    companyFormation: 'Company Formation',
    companyFormationDesc: 'Complete assistance in company registration and incorporation across business-friendly jurisdictions.',
    companyFormationService1: 'Company registration and incorporation',
    companyFormationService2: 'Business license applications',
    companyFormationService3: 'Corporate structure optimization',
    companyFormationService4: 'Registered agent services',
    companyFormationService5: 'Virtual office solutions',

    taxOptimization: 'Tax Optimization',
    taxOptimizationDesc: 'Strategic tax planning and optimization to minimize your international tax burden legally.',
    taxOptimizationService1: 'International tax planning',
    taxOptimizationService2: 'Double taxation treaty optimization',
    taxOptimizationService3: 'Tax residence strategies',
    taxOptimizationService4: 'Transfer pricing guidance',
    taxOptimizationService5: 'Annual tax compliance',

    bankingSolutions: 'Banking Solutions',
    bankingSolutionsDesc: 'Comprehensive banking support for international business operations.',
    bankingSolutionsService1: 'International bank account opening',
    bankingSolutionsService2: 'Multi-currency account setup',
    bankingSolutionsService3: 'Payment gateway integration',
    bankingSolutionsService4: 'Banking relationship management',
    bankingSolutionsService5: 'Trade finance solutions',

    legalCompliance: 'Legal Compliance',
    legalComplianceDesc: 'Ongoing legal and regulatory compliance support to keep your business compliant.',
    legalComplianceService1: 'Regulatory compliance monitoring',
    legalComplianceService2: 'Contract reviews and drafting',
    legalComplianceService3: 'Legal structure optimization',
    legalComplianceService4: 'Intellectual property protection',
    legalComplianceService5: 'Data protection compliance',

    assetProtection: 'Asset Protection',
    assetProtectionDesc: 'Advanced strategies to protect your assets and minimize risks in international operations.',
    assetProtectionService1: 'Asset protection strategies',
    assetProtectionService2: 'Trust and foundation setup',
    assetProtectionService3: 'Risk assessment and mitigation',
    assetProtectionService4: 'Estate planning for international assets',
    assetProtectionService5: 'Insurance optimization',

    investmentAdvisory: 'Investment Advisory',
    investmentAdvisoryDesc: 'Commercial investment consulting and growth strategies for international markets.',
    investmentAdvisoryService1: 'Market entry strategies',
    investmentAdvisoryService2: 'Investment structure optimization',
    investmentAdvisoryService3: 'Due diligence support',
    investmentAdvisoryService4: 'Exit strategy planning',
    investmentAdvisoryService5: 'Cross-border M&A advisory',

    exploreCategory: 'Explore',
    servicesCtaTitle: 'Need a Custom Solution?',
    servicesCtaDescription: 'Our expert advisors can create a tailored strategy for your unique business needs.',
    consultExpertBtn: 'Consult with Expert',
    exploreCountriesBtn: 'Explore Countries',

    // Countries Page
    countriesHeroTitle: 'Global Business Destinations',
    countriesHeroDescription: 'Explore the world\'s most business-friendly jurisdictions. Each location offers unique advantages for international expansion and tax optimization.',
    searchPlaceholder: 'Search countries...',
    allRegions: 'All Regions',
    regionEurope: 'Europe',
    regionAsia: 'Asia',
    regionMiddleEast: 'Middle East',
    regionAmericas: 'Americas',
    availableDestinations: 'Available Destinations',
    noCountriesFoundTitle: 'No countries found',
    noCountriesFoundDesc: 'Try adjusting your search or filter criteria.',
    corporateTax: 'Corporate Tax',
    featuredBadge: 'FEATURED',
    learnMoreBtn: 'Learn More',

    // About Page
    aboutHeroTitle: 'About Consulting19',
    aboutHeroDescription: 'We\'re revolutionizing international business consulting by combining AI-powered intelligence with a global network of expert advisors.',
    missionTitle: 'Our Mission',
    missionDesc1: 'To democratize international business expansion by making expert advice accessible, affordable, and instant through the power of artificial intelligence.',
    missionDesc2: 'We believe that every entrepreneur should have access to world-class international business guidance, regardless of their location or business size.',
    valuesTitle: 'Our Values',
    valuesDescription: 'The principles that guide everything we do at Consulting19.',
    globalExpertise: 'Global Expertise',
    globalExpertiseDesc: 'Deep knowledge of international business landscapes across 19+ countries.',
    aiEfficiency: 'AI-Powered Efficiency',
    aiEfficiencyDesc: 'Cutting-edge AI technology combined with human expertise for optimal results.',
    trustSecurity: 'Trust & Security',
    trustSecurityDesc: 'Enterprise-grade security protecting your sensitive business information.',
    resultsDriven: 'Results-Driven',
    resultsDrivenDesc: 'Focused on delivering measurable outcomes for your international expansion.',
    teamTitle: 'Meet Our Team',
    teamDescription: 'Experienced professionals from leading consulting firms and technology companies.',
    teamMemberRoleErdal: 'SEO & Digital Marketing Specialist',
    teamMemberBioErdal: 'Expert in search engine optimization and digital marketing strategies for international business expansion.',
    linkedinProfile: 'LinkedIn Profile',
    storyTitle: 'Our Story',
    storyDesc1: 'Consulting19 was born from a simple observation: international business expansion is unnecessarily complex and expensive. Traditional consulting firms charge premium rates while entrepreneurs struggle to navigate foreign regulations alone.',
    storyDesc2: 'By combining cutting-edge AI technology with a carefully curated network of expert advisors in business-friendly jurisdictions, we\'ve created a platform that delivers enterprise-level consulting at a fraction of traditional costs.',
    storyDesc3: 'Today, we\'re proud to serve hundreds of entrepreneurs worldwide, helping them save millions in taxes while expanding their businesses across borders with confidence.',
    ctaTitle: 'Ready to Join Our Mission?',
    ctaDescription: 'Whether you\'re an entrepreneur looking to expand globally or an expert advisor wanting to help others, we\'d love to have you on board.',
    startExpansionBtn: 'Start Your Expansion',
    becomeConsultantBtn: 'Become a Consultant',

    // Hero Section
    heroTitle1: 'AI-Enhanced Global Intelligence',
    heroSubtitle1: 'at Your Service',
    heroDescription1: 'Next-level regulatory guidance with intelligent automation. Our AI-powered platform connects you with expert consultants across the world\'s most business-friendly jurisdictions.',
    heroTitle2: 'Global Network of Experts',
    heroSubtitle2: 'in 19+ Countries',
    heroDescription2: 'Connect with certified business advisors and legal experts across strategic jurisdictions. From UAE to Estonia, our network ensures you get local expertise with global reach.',
    heroTitle3: 'Instant AI-Powered Matching',
    heroSubtitle3: 'Smart
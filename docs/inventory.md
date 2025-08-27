# Monorepo Migration Inventory

## Current Single App Structure Analysis

This document inventories the existing routes, components, and files in the current single Vite/React app to plan their migration to the monorepo structure.

## Current Routes & Pages

### Public Marketing Routes (→ apps/marketing)
- `/` - HomePage
- `/services` - ServicesPage  
- `/countries` - CountriesPage
- `/countries/:countryId` - CountryDetailPage
- `/about` - AboutPage
- `/contact` - ContactPage
- `/blog` - BlogPage
- `/blog/:postId` - BlogPostPage
- `/faq` - FAQPage
- `/ai-assistant` - AIAssistantPage
- `/privacy` - PrivacyPage (legal)
- `/terms` - TermsPage (legal)

### Auth Routes (→ apps/marketing - public auth flows)
- `/login` - LoginPage
- `/register` - RegisterPage  
- `/reset-password` - ResetPasswordPage

### Admin Routes (→ apps/admin)
- `/admin` - AdminDashboard

## Current Component Structure

### Layout Components (→ apps/marketing)
- `src/components/layout/Navbar.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/layout/LanguageSelector.tsx`

### Marketing Sections (→ apps/marketing)
- `src/components/sections/HeroSection.tsx`
- `src/components/sections/HowItWorksSection.tsx`
- `src/components/sections/ServicesOverviewSection.tsx`
- `src/components/sections/FeaturedCountriesSection.tsx`
- `src/components/sections/TestimonialsSection.tsx`
- `src/components/sections/AIPromotionSection.tsx`

### Shared UI Components (→ packages/shared)
- `src/components/ui/Button.tsx` - Used across multiple apps
- `src/components/ui/Card.tsx` - Used across multiple apps

### Context Providers (→ packages/shared)
- `src/contexts/AuthContext.tsx` - Used by all apps
- `src/contexts/LanguageContext.tsx` - Used by marketing and potentially others

### Utilities & Config (→ packages/shared)
- `src/lib/supabase.ts` - Database client used by all apps

### Pages by Target App

#### apps/marketing/
- `src/pages/HomePage.tsx`
- `src/pages/ServicesPage.tsx`
- `src/pages/CountriesPage.tsx`
- `src/pages/CountryDetailPage.tsx`
- `src/pages/AboutPage.tsx`
- `src/pages/ContactPage.tsx`
- `src/pages/BlogPage.tsx`
- `src/pages/BlogPostPage.tsx`
- `src/pages/FAQPage.tsx`
- `src/pages/AIAssistantPage.tsx`
- `src/pages/auth/LoginPage.tsx`
- `src/pages/auth/RegisterPage.tsx`
- `src/pages/auth/ResetPasswordPage.tsx`
- `src/pages/legal/PrivacyPage.tsx`
- `src/pages/legal/TermsPage.tsx`

#### apps/admin/
- `src/pages/dashboard/AdminDashboard.tsx`

#### portals/client/
- Currently no ClientDashboard exists in codebase
- Will need to create minimal placeholder or move from existing if found

#### portals/consultant/
- Currently no ConsultantDashboard exists in codebase  
- Will need to create minimal placeholder or move from existing if found

## Files to Move to packages/shared/

### UI Components (used by multiple apps)
- `src/components/ui/Button.tsx`
- `src/components/ui/Card.tsx`

### Contexts (used by multiple apps)
- `src/contexts/AuthContext.tsx`
- `src/contexts/LanguageContext.tsx`

### Utilities (used by multiple apps)
- `src/lib/supabase.ts`

## Root Files to Keep/Modify
- `package.json` - Update for monorepo
- `tsconfig.json` - Update to extend base config
- `.env` - Keep at root level
- `vite.config.ts` - Will be replaced by app-specific configs
- `src/main.tsx` - Will be replaced by app-specific mains
- `src/App.tsx` - Will be replaced by app-specific Apps

## Migration Strategy Notes

1. **Missing Dashboards**: The inventory shows no existing ClientDashboard or ConsultantDashboard. These will need minimal placeholder implementations in their respective portals.

2. **Auth Flow**: Login/Register/Reset pages are currently public routes, so they belong in the marketing app.

3. **Shared Dependencies**: Button, Card, AuthContext, LanguageContext, and supabase client are used across multiple components and should be moved to shared package.

4. **Route Protection**: The current App.tsx has route definitions that will need to be split across the different apps.

## Next Steps

Following this inventory, the migration will proceed with:
1. Create monorepo skeleton with guards
2. Move marketing pages and components  
3. Move admin dashboard
4. Create minimal client/consultant portals
5. Extract shared components and utilities
6. Clean up root files

This ensures all existing functionality is preserved while establishing the new monorepo structure.
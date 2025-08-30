import { useTranslation } from 'react-i18next';

export const useI18n = () => {
  const { t, i18n } = useTranslation();

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat(i18n.language, {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const formatNumber = (number: number) => {
    return new Intl.NumberFormat(i18n.language).format(number);
  };

  const formatDate = (date: string | Date, options?: Intl.DateTimeFormatOptions) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(i18n.language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options,
    }).format(dateObj);
  };

  const formatDateTime = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(i18n.language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObj);
  };

  const formatRelativeTime = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return t('dateTime.justNow');
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return t('dateTime.minutesAgo', { count: minutes });
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return t('dateTime.hoursAgo', { count: hours });
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return t('dateTime.daysAgo', { count: days });
    } else {
      return formatDate(dateObj);
    }
  };

  const getLocalizedContent = (content: any, field: string, fallback: string = '') => {
    if (!content || typeof content !== 'object') return fallback;
    
    const currentLang = i18n.language;
    
    // Try current language first
    if (content[currentLang]) return content[currentLang];
    
    // Fallback to English
    if (content.en) return content.en;
    
    // Return fallback
    return fallback;
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return {
    t,
    i18n,
    formatCurrency,
    formatNumber,
    formatDate,
    formatDateTime,
    formatRelativeTime,
    getLocalizedContent,
    changeLanguage,
    currentLanguage: i18n.language,
  };
};
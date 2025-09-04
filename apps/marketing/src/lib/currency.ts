/**
 * Currency formatting utilities
 */

interface CurrencyFormatOptions {
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

/**
 * Format currency amount with proper locale and symbol
 */
export function formatCurrency(
  amount: number,
  currencyCode: string,
  options: CurrencyFormatOptions = {}
): string {
  const {
    locale = 'en-US',
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
  } = options;

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(amount);
  } catch (error) {
    console.error('Currency formatting error:', error);
    return `${currencyCode} ${amount.toLocaleString()}`;
  }
}

/**
 * Get currency symbol for a given currency code
 */
export function getCurrencySymbol(currencyCode: string): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    })
      .formatToParts(0)
      .find(part => part.type === 'currency')?.value || currencyCode;
  } catch (error) {
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      TRY: '₺',
      GEL: '₾',
      AED: 'د.إ',
    };
    return symbols[currencyCode] || currencyCode;
  }
}

/**
 * Get locale-specific formatting for a currency
 */
export function getCurrencyLocale(currencyCode: string): string {
  const localeMap: Record<string, string> = {
    USD: 'en-US',
    EUR: 'de-DE',
    GBP: 'en-GB',
    TRY: 'tr-TR',
    GEL: 'ka-GE',
    AED: 'ar-AE',
  };
  return localeMap[currencyCode] || 'en-US';
}
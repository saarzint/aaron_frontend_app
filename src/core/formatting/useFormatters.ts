import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatNumber,
  formatPercent,
  formatRelativeTime,
} from './formatters';

export function useFormatters() {
  const { i18n } = useTranslation();
  const locale = i18n.language ?? 'en-US';

  return useMemo(
    () => ({
      currency: (value: number, currency = 'USD') => formatCurrency(value, locale, currency),
      number: (value: number) => formatNumber(value, locale),
      percent: (value: number) => formatPercent(value, locale),
      date: (value: string | number | Date, options?: Intl.DateTimeFormatOptions) =>
        formatDate(value, locale, options),
      dateTime: (value: string | number | Date) => formatDateTime(value, locale),
      relative: (value: string | number | Date) => formatRelativeTime(value, locale),
    }),
    [locale]
  );
}

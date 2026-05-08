export type FormatLocale = string;

export function formatCurrency(
  value: number,
  locale: FormatLocale = 'en-US',
  currency = 'USD'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number, locale: FormatLocale = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(value);
}

export function formatPercent(value: number, locale: FormatLocale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    maximumFractionDigits: 1,
  }).format(value / 100);
}

export function formatDate(
  value: string | number | Date,
  locale: FormatLocale = 'en-US',
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }
): string {
  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat(locale, options).format(date);
}

export function formatDateTime(
  value: string | number | Date,
  locale: FormatLocale = 'en-US'
): string {
  return formatDate(value, locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(
  value: string | number | Date,
  locale: FormatLocale = 'en-US'
): string {
  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) return String(value);

  const diffMs = date.getTime() - Date.now();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHr = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHr / 24);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (Math.abs(diffSec) < 60) return rtf.format(diffSec, 'second');
  if (Math.abs(diffMin) < 60) return rtf.format(diffMin, 'minute');
  if (Math.abs(diffHr) < 24) return rtf.format(diffHr, 'hour');
  return rtf.format(diffDay, 'day');
}

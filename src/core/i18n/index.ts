import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from '../locales/en/common.json';
import enNavigation from '../locales/en/navigation.json';
import enDashboard from '../locales/en/dashboard.json';
import enAuth from '../locales/en/auth.json';
import enSettings from '../locales/en/settings.json';
import enOrders from '../locales/en/orders.json';
import enCustomers from '../locales/en/customers.json';
import enUsers from '../locales/en/users.json';

import frCommon from '../locales/fr/common.json';
import frNavigation from '../locales/fr/navigation.json';
import frDashboard from '../locales/fr/dashboard.json';
import frAuth from '../locales/fr/auth.json';
import frSettings from '../locales/fr/settings.json';
import frOrders from '../locales/fr/orders.json';
import frCustomers from '../locales/fr/customers.json';
import frUsers from '../locales/fr/users.json';

export const SUPPORTED_LOCALES = ['en', 'fr'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const LOCALE_LABELS: Record<SupportedLocale, string> = {
  en: 'English',
  fr: 'Français',
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        navigation: enNavigation,
        dashboard: enDashboard,
        auth: enAuth,
        settings: enSettings,
        orders: enOrders,
        customers: enCustomers,
        users: enUsers,
      },
      fr: {
        common: frCommon,
        navigation: frNavigation,
        dashboard: frDashboard,
        auth: frAuth,
        settings: frSettings,
        orders: frOrders,
        customers: frCustomers,
        users: frUsers,
      },
    },
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LOCALES,
    defaultNS: 'common',
    ns: ['common', 'navigation', 'dashboard', 'auth', 'settings', 'orders', 'customers', 'users'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nLocale',
    },
  });

export default i18n;

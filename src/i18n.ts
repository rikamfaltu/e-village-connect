
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './locales/en.json';
import mrTranslation from './locales/mr.json';

// the translations
const resources = {
  en: {
    translation: enTranslation
  },
  mr: {
    translation: mrTranslation
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already escapes by default
    }
  });

export default i18n;

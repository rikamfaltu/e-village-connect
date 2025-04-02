
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import language resources
import translationEN from "./locales/en/translation.json";
import translationHI from "./locales/hi/translation.json";
import translationMR from "./locales/mr/translation.json";

// Define resources for each language
const resources = {
  en: {
    translation: translationEN
  },
  hi: {
    translation: translationHI
  },
  mr: {
    translation: translationMR
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // Default language
    interpolation: {
      escapeValue: false // React already safes from XSS
    },
    fallbackLng: "en"
  });

export default i18n;

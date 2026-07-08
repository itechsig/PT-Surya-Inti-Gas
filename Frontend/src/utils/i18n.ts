import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import en from '../locales/en.json';
import id from '../locales/id.json';
import zh from '../locales/zh.json';

const resources = {
  en: { translation: en },
  id: { translation: id },
  zh: { translation: zh }
};

// Detect language from URL path
const detectLanguageFromPath = () => {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname;
    const segments = path.split('/').filter(Boolean);
    const validLanguages = ['en', 'id', 'zh'];
    
    if (segments.length > 0 && validLanguages.includes(segments[0])) {
      return segments[0];
    }
  }
  return 'id'; // Default to Indonesian
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'id',
    lng: detectLanguageFromPath(),
    
    interpolation: {
      escapeValue: false
    },
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },
    
    // Force Indonesian as default regardless of browser detection
    lowerCaseLng: true,
    cleanCode: true
  });

export default i18n;
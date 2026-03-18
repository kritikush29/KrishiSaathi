import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en/translation.json';
import translationHI from './locales/hi/translation.json';
import translationPA from './locales/pa/translation.json';
import translationBN from './locales/bn/translation.json';
import translationGU from './locales/gu/translation.json';
import translationMR from './locales/mr/translation.json';
import translationML from './locales/ml/translation.json';
import translationTA from './locales/ta/translation.json';

const resources = {
  en: { translation: translationEN },
  hi: { translation: translationHI },
  pa: { translation: translationPA },
  bn: { translation: translationBN },
  gu: { translation: translationGU },
  mr: { translation: translationMR },
  ml: { translation: translationML },
  ta: { translation: translationTA },
};

// Map language codes to their native font families for proper script rendering
export const langFontMap = {
  en: "'Inter', sans-serif",
  hi: "'Noto Sans Devanagari', 'Inter', sans-serif",
  pa: "'Noto Sans Gurmukhi', 'Inter', sans-serif",
  bn: "'Noto Sans Bengali', 'Inter', sans-serif",
  gu: "'Noto Sans Gujarati', 'Inter', sans-serif",
  mr: "'Noto Sans Devanagari', 'Inter', sans-serif",
  ml: "'Noto Sans Malayalam', 'Inter', sans-serif",
  ta: "'Noto Sans Tamil', 'Inter', sans-serif",
};

// Language metadata for the switcher dropdown
export const languages = [
  { code: 'en', label: 'English',   nativeLabel: 'English',  flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi',     nativeLabel: 'हिन्दी',    flag: '🇮🇳' },
  { code: 'pa', label: 'Punjabi',   nativeLabel: 'ਪੰਜਾਬੀ',   flag: '🇮🇳' },
  { code: 'bn', label: 'Bengali',   nativeLabel: 'বাংলা',    flag: '🇮🇳' },
  { code: 'gu', label: 'Gujarati',  nativeLabel: 'ગુજરાતી',  flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi',   nativeLabel: 'मराठी',    flag: '🇮🇳' },
  { code: 'ml', label: 'Malayalam', nativeLabel: 'മലയാളം',  flag: '🇮🇳' },
  { code: 'ta', label: 'Tamil',     nativeLabel: 'தமிழ்',    flag: '🇮🇳' },
];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'krishisaathi-lang',
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

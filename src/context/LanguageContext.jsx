// client/src/context/LanguageContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

// Import section-specific translations
// ENSURE THESE FILES EXIST AND EXPORT THE CORRECT TRANSLATION OBJECTS
import { headerTranslations } from '../translations/headerTranslations';
import { slideshowTranslations } from '../translations/slideshowTranslations';
import { visionMissionTranslations } from '../translations/visionMissionTranslations';
import { typologiesTranslations } from '../translations/typologiesTranslations';
import { servicesTranslations } from '../translations/servicesTranslations';
import { projectsTranslations } from '../translations/projectsTranslations';
import { testimonialsTranslations } from '../translations/testimonialsTranslations';
import { joinCommunityTranslations } from '../translations/joinCommunityTranslations';
import { footerTranslations } from '../translations/footerTranslations';
import { contactTranslations } from '../translations/contactTranslations';
import { fallbackTranslations } from '../translations/fallbackTranslations';
import { userTranslations } from '../translations/userTranslations';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  const allCombinedTranslations = {
    en: {
      ...headerTranslations.en,
      ...slideshowTranslations.en,
      ...visionMissionTranslations.en,
      ...typologiesTranslations.en,
      ...servicesTranslations.en,
      ...projectsTranslations.en,
      ...testimonialsTranslations.en,
      ...joinCommunityTranslations.en,
      ...footerTranslations.en,
      ...contactTranslations.en,
      ...userTranslations.en,
      ...fallbackTranslations.en,
    },
    km: {
      ...headerTranslations.km,
      ...slideshowTranslations.km,
      ...visionMissionTranslations.km,
      ...typologiesTranslations.km,
      ...servicesTranslations.km,
      ...projectsTranslations.km,
      ...testimonialsTranslations.km,
      ...joinCommunityTranslations.km,
      ...footerTranslations.km,
      ...contactTranslations.km,
      ...userTranslations.km,
      ...fallbackTranslations.km,
    },
  };

  const languageNameTranslations = {
    en: {
      'lang-kh': 'Khmer',
      'lang-en': 'English',
    },
    km: {
      'lang-kh': 'ភាសាខ្មែរ',
      'lang-en': 'អង់គ្លេស',
    },
  };

  const t = useCallback(
    (key) => {
      const validLang = ['en', 'km'].includes(language) ? language : 'en';
      const translation = allCombinedTranslations[validLang][key] || key;
      return translation;
    },
    [language]
  );

  const toggleLanguage = useCallback(
    (lang) => {
      const newLang = lang || (language === 'en' ? 'km' : 'en');
      setLanguage(newLang);
      localStorage.setItem('language', newLang);
      document.documentElement.lang = newLang;
    },
    [language]
  );

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, toggleLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

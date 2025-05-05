import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const useI18nextSectionLogic = (initialExpanded = false) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const { t, i18n } = useTranslation();
  // Re-introduce state for current language, initialized from i18n or localStorage
  const [currentLanguage, setCurrentLanguage] = useState(localStorage.getItem("language") || i18n.language || "en");

  // Update state when i18n language changes (e.g., via browser detector)
  useEffect(() => {
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);




  const toggleExpand = () => {
    setIsExpanded(prev => !prev);
  };

  const changeLanguage = (lang) => {
    // Use i18n instance to change language
    if (i18n && typeof i18n.changeLanguage === 'function') {
      try {
        i18n.changeLanguage(lang);
        // Persist the chosen language in localStorage
        localStorage.setItem("language", lang);
        // Update the state immediately for responsiveness, though useEffect will also catch it
        setCurrentLanguage(lang);
      } catch (error) {
        console.error('Error using i18n.changeLanguage:', error);
      }
    } else {
      console.error('i18n.changeLanguage function not available.');
      // Fallback: update state and localStorage directly
      localStorage.setItem("language", lang);
      setCurrentLanguage(lang);
    }
  };

  return {
    isExpanded,
    toggleExpand,
    currentLanguage,
    changeLanguage,
    t, // Pass translation function
  };
};


import React from 'react';
import styles from './I18nextSection.module.css';
import { FaLanguage, FaChevronUp, FaChevronDown } from 'react-icons/fa';
import LibraryStatusIndicator from '../LibraryStatusIndicator';
import LanguageSwitcher from './components/LanguageSwitcher';
import { useI18nextSectionLogic } from './I18nextSection';

const I18nextSection = ({ libraryStatus }) => {
  const { 
    isExpanded, 
    toggleExpand, 
    currentLanguage, 
    changeLanguage, 
    t // Get translation function from hook
  } = useI18nextSectionLogic();

  return (
    // Restore Tailwind classes from original Dashboard.js
    <section className={`bg-gray-800 rounded-xl ${styles.i18nextSection}`}>
      <div className="flex justify-between items-center p-4 cursor-pointer" onClick={toggleExpand}> {/* Add cursor-pointer */}
        <div className="flex items-center space-x-3">
          <FaLanguage className="h-8 w-8 text-purple-400" />
          <h2 className="text-xl font-bold">i18next</h2>
        </div>
        <button 
          className="text-gray-400 hover:text-white"
        >
          {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>
      {isExpanded && (
        // Restore Tailwind classes for content area
        <div className="p-4 space-y-4">
          <LibraryStatusIndicator libraryName='i18next' status={libraryStatus} />
          {libraryStatus && (
            // Restore Tailwind classes for translation demo area
            <div className="bg-gray-700 p-4 rounded-lg">
              <p>Aktualny język: {currentLanguage === 'pl' ? 'Polski' : 'English'}</p>
              {/* Use translation function from hook */}
              <p>Tekst testowy: {t('dashboard.welcome', 'Welcome to the dashboard')}</p> 
              <LanguageSwitcher 
                currentLanguage={currentLanguage} 
                onChangeLanguage={changeLanguage} 
              />
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default I18nextSection;


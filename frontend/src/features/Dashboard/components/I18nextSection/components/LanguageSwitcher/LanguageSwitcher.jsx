import React from 'react';
import styles from './LanguageSwitcher.module.css';
import { useLanguageSwitcherLogic } from './LanguageSwitcher';

const LanguageSwitcher = ({ currentLanguage, onChangeLanguage }) => {
  // Logic is handled by the parent (I18nextSection) via props
  // const { handleSwitch } = useLanguageSwitcherLogic(onChangeLanguage);

  return (
    <div className={styles.switcherContainer}> {/* Use styles from CSS module */}
      <button 
        onClick={() => onChangeLanguage('pl')}
        className={`${styles.button} ${currentLanguage === 'pl' ? styles.active : ''}`} /* Use styles */
        disabled={currentLanguage === 'pl'}
      >
        {currentLanguage === 'pl' ? 'Polski' : 'Polish'}
      </button>
      <button 
        onClick={() => onChangeLanguage('en')}
        className={`${styles.button} ${currentLanguage === 'en' ? styles.active : ''}`} /* Use styles */
        disabled={currentLanguage === 'en'}
      >
        {currentLanguage === 'pl' ? 'Angielski' : 'English'}
      </button>
    </div>
  );
};

export default LanguageSwitcher;


import React from 'react';
import styles from './NavigationButton.module.css';

const NavigationButton = ({ text, onClick, active }) => {
  return (
    <button 
      className={`${styles.navigationButton} ${active ? styles.active : ''}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default NavigationButton;

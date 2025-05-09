import React from 'react';
import styles from './NavigationButton.module.css';

const NavigationButton = ({ text, onClick, isActive }) => {
  return (
    <button 
      className={`${styles.navigationButton} ${isActive ? styles.active : ''}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default NavigationButton;


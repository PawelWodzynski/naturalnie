import React from 'react';
import styles from './AddProductButton.module.css';

// Accept onClick as a prop
const AddProductButton = ({ onClick }) => {
  // Use the passed onClick handler
  const handleAddProduct = () => {
    if (onClick) {
      onClick();
    } else {
      // Fallback or default behavior if no onClick is provided
      console.log('Przycisk "Dodaj produkt" kliknięty, ale brak akcji do wykonania.');
    }
  };

  return (
    <button 
      onClick={handleAddProduct} 
      className={styles.addProductButton}
    >
      Dodaj produkt
    </button>
  );
};

export default AddProductButton;

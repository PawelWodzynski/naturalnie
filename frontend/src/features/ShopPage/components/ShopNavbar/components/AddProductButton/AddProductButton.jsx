import React from 'react';
import styles from './AddProductButton.module.css';

const AddProductButton = () => {
  const handleAddProduct = () => {
    // Funkcjonalność zostanie dodana później
    console.log('Przycisk "Dodaj produkt" kliknięty');
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

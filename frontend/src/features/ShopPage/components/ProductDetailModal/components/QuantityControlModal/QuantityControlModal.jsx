import React from 'react';
import styles from './QuantityControlModal.module.css';
import { useProductQuantity } from '../../../../../../../context/ProductQuantityContext'; // Adjusted path

const QuantityControlModal = ({ productId }) => {
  // Ensure productId is available before using the context
  if (!productId) {
    // Optionally, render nothing or a placeholder if productId is not yet available
    // This depends on how ProductDetailModal handles product loading
    console.warn("QuantityControlModal: productId is undefined. Cannot initialize quantity.");
    return (
      <div className={styles.quantityControlContainer}>
        <button className={styles.quantityButton} disabled>-</button>
        <input 
          type="number" 
          value="1" 
          className={styles.quantityInput} 
          min="1"
          disabled
        />
        <button className={styles.quantityButton} disabled>+</button>
      </div>
    );
  }

  const { getQuantity, incrementQuantity, decrementQuantity, updateQuantity } = useProductQuantity();
  const currentQuantity = getQuantity(productId);

  const handleDecrement = () => {
    decrementQuantity(productId);
  };

  const handleIncrement = () => {
    incrementQuantity(productId);
  };

  const handleInputChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value >= 1) {
      updateQuantity(productId, value);
    } else if (event.target.value === '') {
      updateQuantity(productId, 1); // Reset to 1 if input is cleared
    }
  };

  return (
    <div className={styles.quantityControlContainer}>
      <button onClick={handleDecrement} className={styles.quantityButton}>-</button>
      <input 
        type="number" 
        value={currentQuantity} 
        onChange={handleInputChange} 
        className={styles.quantityInput} 
        min="1"
      />
      <button onClick={handleIncrement} className={styles.quantityButton}>+</button>
    </div>
  );
};

export default QuantityControlModal;


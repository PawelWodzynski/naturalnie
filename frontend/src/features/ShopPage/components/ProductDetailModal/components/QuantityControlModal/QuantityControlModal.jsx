import React, { useState, useEffect } from 'react'; // Added useEffect
import styles from './QuantityControlModal.module.css';
import { useProductQuantity } from '../../../../../../../context/ProductQuantityContext'; // Adjusted path

const QuantityControlModal = ({ productId }) => {
  // Hooks are called at the top level
  const { getQuantity, incrementQuantity, decrementQuantity, updateQuantity } = useProductQuantity();
  
  // State for current quantity, initialized from context or 1 if not available
  const [currentQuantity, setCurrentQuantity] = React.useState(1);

  useEffect(() => {
    if (productId) {
      setCurrentQuantity(getQuantity(productId));
    }
  }, [productId, getQuantity]);

  // Early return if productId is not available
  if (!productId) {
    console.warn("QuantityControlModal: productId is undefined. Cannot initialize quantity.");
    return (
      <div className={styles.quantityControlContainer}>
        <button className={styles.quantityButton} disabled>-</button>
        <input 
          type="number" 
          value="1" 
          className={styles.quantityInput} 
          disabled
        />
        <button className={styles.quantityButton} disabled>+</button>
      </div>
    );
  }

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
    } else if (event.target.value === "") { // Fixed syntax error here
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


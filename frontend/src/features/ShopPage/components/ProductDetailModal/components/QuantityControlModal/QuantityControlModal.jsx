import React, { useState, useEffect } from 'react';
import styles from './QuantityControlModal.module.css';
import { useProductQuantity } from '../../../../../../context/ProductQuantityContext'; // Adjusted path

const QuantityControlModal = ({ productId }) => {
  // Use the new context functions
  const { getStoredQuantity, updateStoredQuantity, commitFinalQuantity, incrementQuantity, decrementQuantity } = useProductQuantity();
  
  const quantityFromContext = getStoredQuantity(productId);
  const [inputValue, setInputValue] = useState(quantityFromContext.toString());

  useEffect(() => {
    setInputValue(quantityFromContext.toString());
  }, [quantityFromContext]);

  // Early return if productId is not available - Hooks are already called above, so this is fine.
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
    const currentDisplayValue = event.target.value;
    setInputValue(currentDisplayValue);

    if (currentDisplayValue === "") {
      // Allow empty for typing, validation on blur
    } else {
      const numericValue = parseInt(currentDisplayValue, 10);
      if (!isNaN(numericValue)) {
        updateStoredQuantity(productId, numericValue); // Update context with potentially 0 or positive value
      }
    }
  };

  const handleInputBlur = () => {
    // On blur, commit the final quantity. Context will handle setting to 1 if it's 0.
    commitFinalQuantity(productId);
    // useEffect will sync inputValue with the potentially corrected context value.
  };

  return (
    <div className={styles.quantityControlContainer}>
      <button onClick={handleDecrement} className={styles.quantityButton}>-</button>
      <input 
        type="number" 
        value={inputValue} 
        onChange={handleInputChange} 
        onBlur={handleInputBlur} // Added onBlur handler
        className={styles.quantityInput} 
        // min="1" is not strictly enforced by browser due to custom handling
      />
      <button onClick={handleIncrement} className={styles.quantityButton}>+</button>
    </div>
  );
};

export default QuantityControlModal;

